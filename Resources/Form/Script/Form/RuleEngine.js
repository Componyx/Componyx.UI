/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.form_modules = componyx.UI.form_modules || {};

const Operators = {
    equal: (a, b) =>
    {
        if (Array.isArray(a) && Array.isArray(b))
            return a.length === b.length && a.every(x => b.includes(x));
        if (Array.isArray(a))
            return a.includes(b);
        if (Array.isArray(b))
            return b.includes(a);
        return a === b;
    },

    not_equal: (a, b) =>
    {
        if (Array.isArray(a) && Array.isArray(b))
            return !(a.length === b.length && a.every(x => b.includes(x)));
        if (Array.isArray(a))
            return !a.includes(b);
        if (Array.isArray(b))
            return !b.includes(a);
        return a !== b;
    },

    greater_than: (a, b) =>
    {
        if (Array.isArray(a)) return a.length > b;
        return a > b;
    },

    greater_than_or_equal: (a, b) =>
    {
        if (Array.isArray(a)) return a.length >= b;
        return a >= b;
    },

    less_than: (a, b) =>
    {
        if (Array.isArray(a)) return a.length < b;
        return a < b;
    },

    less_than_or_equal: (a, b) =>
    {
        if (Array.isArray(a)) return a.length <= b;
        return a <= b;
    },

    contains: (a, b) =>
    {
        if (Array.isArray(a) && Array.isArray(b))
            return b.some(x => a.includes(x)); // any overlap
        if (Array.isArray(a))
            return a.includes(b);
        if (typeof a === 'string')
            return a.indexOf(b) !== -1;
        return false;
    },

    not_contains: (a, b) =>
    {
        if (Array.isArray(a) && Array.isArray(b))
            return b.every(x => !a.includes(x)); // no overlap
        if (Array.isArray(a))
            return !a.includes(b);
        if (typeof a === 'string')
            return a.indexOf(b) === -1;
        return false;
    },

    starts_with: (a, b) => typeof a === 'string' && a.startsWith(b),
    ends_with: (a, b) => typeof a === 'string' && a.endsWith(b),

    empty: (a) =>
    {
        if (Array.isArray(a)) return a.length === 0;
        return a == null || a === '';
    },

    not_empty: (a) =>
    {
        if (Array.isArray(a)) return a.length > 0;
        return !(a == null || a === '');
    }
};

componyx.UI.form_modules.RuleEngine = class RuleEngine
{
    #fields;
    #isExecuting = false;
    #hiddenFieldCache;
    #dependencyMap;
    #originalFieldStates = new Map();
    #visible = { on: 'show', off: 'hide' };
    #readOnly = { on: 'readOnly', off: 'editable' };
    #disabled = { on: 'disable', off: 'enable' };
    #required = { on: 'required', off: 'optional' };

    constructor(form)
    {
        this.form = form;
        this.dataBinder = form.dataBinder;
        this.InputTypeOption = form.constructor.InputTypeOption;
        this.TriggerOption = form.constructor.RuleCaseTriggerOption;
        this.RunVisibilityOption = form.constructor.RuleCaseRunVisibilityOption;
        this.ComparisonOperatorOption = form.constructor.RuleComparisonOperatorOption;
        this.ActionOption = form.constructor.RuleActionOption;
    }

    destroy()
    {
        this.#restoreFields();
    }

    /**
     * Evaluates all rules for all fields/fieldsets and executes actions for matching rule cases.
     * @param {componyx.UI.Form.RuleCaseTriggerOption} caseTrigger The trigger causing this evaluation (e.g., INIT, SHOW_SECTION, SUBMIT).
     */
    initRules(trigger = this.TriggerOption.INIT)
    {
        if (!this.#dependencyMap)
            this.#buildDependencyMap();

        this.#hiddenFieldCache = {};
        this.form.getFields().forEach(field => this.#applyRulesChain(field, trigger));
    }

    /**
     * Evaluates the field/fieldset rules and executes actions for each rule case if conditions are met.
     * @param {componyx.UI.Form.Field} changedField The field for which the rule actions are applied.
     * @param {componyx.UI.Form.RuleCaseTriggerOption} caseTrigger The trigger that caused this evaluation.
     */
    applyRules(changedField, trigger = this.TriggerOption.CHANGE)
    {
        this.#applyRulesChain(changedField, trigger);
    }

    /**
     * Updates the temporary rule-driven state of a field.
     * @param {Object} field - The form field whose rule-driven state should be updated.
     * @param {string} key - The property name being updated (e.g., 'readOnly', 'value').
     * @param {*} newValue - The new value to store for this rule-driven property.
     * @param {boolean} manualChange - A value indicating if this value was set manually.
     */
    updateRuleDrivenState(field, key, newValue, manualChange = false)
    {
        const entry = this.#originalFieldStates.get(field.id);
        if (!entry) return;

        entry.ruleState ??= {};
        entry.ruleState[key] = newValue;
        entry.manualChange = manualChange;
    }

    /** 
     * Build the dependency map where each field holds a set of its dependend fields stored by field id. 
     * @private
     */
    #buildDependencyMap()
    {
        this.#dependencyMap = new Map();

        this.form.getFields().forEach(field =>
        {
            const targetId = field.id;
            (field.ruleCases || []).forEach(ruleCase =>
            {
                (ruleCase.ruleGroups || []).forEach(group =>
                {
                    (group.rules || []).forEach(rule =>
                    {
                        const sourceId = rule.sourceId;
                        if (!this.#dependencyMap.has(sourceId))
                        {
                            this.#dependencyMap.set(sourceId, new Set());
                        }
                        this.#dependencyMap.get(sourceId).add(targetId);
                    });
                });
            });
        });
    }

    #restoreFields()
    {
        const fields = this.form.getFields();

        for (const [fieldId] of this.#originalFieldStates)
        {
            const field = this.form.getField(fieldId, null, fields);
            if (!field) continue;

            this.#restoreOriginalState(field, true);
        }

        this.#originalFieldStates = new Map();
    }

    /**
     * Evaluates the field/fieldset rules and executes actions for each rule case if conditions are met.
     * @private
     * @param {Field} changedField - The field or fieldset to evaluate.
     * @param {string} trigger - The current lifecycle trigger ('init' or 'change').
     */
    async #applyRulesChain(changedField, trigger)
    {
        if (this.#isExecuting)
            return;

        this.#isExecuting = true;

        try
        {
            this.#fields = this.form.getFields();

            const visited = new Set(),
                queue = [...(this.#dependencyMap.get(changedField.id) || []), ...this.#getUnconditionalFields(trigger)];

            while (queue.length > 0)
            {
                const currentId = queue.shift();
                if (visited.has(currentId)) continue;
                visited.add(currentId);

                const currentField = this.form.getField(currentId, null, this.#fields);
                if (!currentField) continue;

                this.#restoreOriginalState(currentField);

                if (this.form.ended) return; // If form ended, stop executing rules and actions

                const section = this.form.getParentSection(currentField);

                // Process each ruleCase sequentially
                const ruleCases = currentField.ruleCases || [];
                for (const ruleCase of ruleCases)
                {
                    if (section && !section.visible && ruleCase.runVisibility !== this.RunVisibilityOption.SECTION_HIDDEN)
                        continue;

                    if (!ruleCase.trigger || ruleCase.trigger === this.TriggerOption.ALWAYS || ruleCase.trigger === trigger)
                    {
                        const isHidden = this.#isFieldHidden(currentField);
                        if (isHidden && (ruleCase.runVisibility !== this.RunVisibilityOption.HIDDEN && ruleCase.runVisibility !== this.RunVisibilityOption.SECTION_HIDDEN))
                            continue;

                        const caseMatched = this.#evaluateCase(ruleCase);
                        if (!caseMatched)
                            continue;

                        const actions = ruleCase.actions || [];
                        for (const action of actions)
                        {
                            const target = action.targetFieldSetId ? this.form.getFieldSet(action.targetFieldSetId) : currentField,
                                runtime = this.form.runtimeActions[action.runtimeActionId];

                            this.#storeFieldState(currentField, action);
                            const result = await this.form.executeAction(action, target); // await confirmation if mustAwait

                            if (runtime?.mustAwait && result && result.success === false)
                                break; // skip remaining actions in this ruleCase
                        }
                    }
                }

                // Add all dependents of currentField to the queue
                (this.#dependencyMap.get(currentId) || []).forEach(depId =>
                {
                    if (!visited.has(depId))
                        queue.push(depId);
                });
            }
        }
        finally
        {
            this.#isExecuting = false;
        }
    }

    #getUnconditionalFields(trigger)
    {
        const result = [];

        this.#fields.forEach(field =>
        {
            const cases = field.ruleCases || [];
            cases.forEach(ruleCase =>
            {
                const hasNoRules = !ruleCase.ruleGroups || ruleCase.ruleGroups.length === 0,
                    hasActions = ruleCase.actions && ruleCase.actions.length > 0,
                    triggerMatches = !ruleCase.trigger || ruleCase.trigger === this.TriggerOption.ALWAYS || ruleCase.trigger === trigger;

                if (hasNoRules && hasActions && triggerMatches)
                {
                    result.push(field.id);
                }
            });
        });

        return result;
    }

    #storeFieldState(field, action)
    {
        const relevantActions = [this.#visible.on, this.#visible.off, this.#readOnly.on, this.#readOnly.off,
        this.#disabled.on, this.#disabled.off, this.#required.on, this.#required.off, 'value', 'expression', 'feedback'];

        if (!relevantActions.includes(action?.runtimeActionId)) return; // nothing to store

        const fields = action?.targetFieldSetId
            ? this.form.getFields(this.form.getFieldSet(action.targetFieldSetId)) || []
            : [field];

        const props = {};
        if ([this.#required.on, this.#required.off].includes(action.runtimeActionId)) props.required = true;
        if ([this.#visible.on, this.#visible.off].includes(action.runtimeActionId)) props.visible = true;
        if ([this.#readOnly.on, this.#readOnly.off].includes(action.runtimeActionId)) props.readOnly = true;
        if ([this.#disabled.on, this.#disabled.off].includes(action.runtimeActionId)) props.disabled = true;

        fields.forEach(f =>
        {
            const entry = this.#originalFieldStates.get(f.id) || { original: {}, affectedByFieldSet: null };

            Object.keys(props).forEach(prop =>
            {
                if (!(prop in entry.original))
                    entry.original[prop] = f[prop];
            });

            if (action.runtimeActionId == 'feedback' && !('feedback' in entry.original))
            {
                const ruleFeedbackEl = this.#getFeedbackElement(f);

                if (ruleFeedbackEl)
                    entry.original.feedback = ruleFeedbackEl.textContent;
            }

            if (!('value' in entry.original))
            {
                entry.original.value = this.dataBinder.getModelValue(f);
            }

            // Store the state of field options (disabled state of options)
            if (f.options && Array.isArray(f.options))
            {
                entry.original.options = f.options.map(opt => ({
                    id: opt.id,
                    disabled: opt.disabled
                }));
            }

            if (action.targetFieldSetId)
                entry.affectedByFieldSet = action.targetFieldSetId;

            this.#originalFieldStates.set(f.id, entry);
        });
    }

    #restoreOriginalState(field, ignoreManualFlag)
    {
        const entry = this.#originalFieldStates.get(field.id);
        if (!entry) return;

        const restore = f =>
        {
            const entry = this.#originalFieldStates.get(f.id);
            if (!entry) return;

            const { value, feedback, options, ...switchStates } = entry.original;

            if ('value' in entry.original && ignoreManualFlag || !entry.manualChange)
            {
                if (Operators.equal(entry.ruleState?.value, this.dataBinder.getModelValue(f)))
                    this.form.dataBinder.setModelValue(f, entry.original.value); // only restore if it holds the value set by the action
            }                

            if (('feedback' in entry.original))
            {
                const ruleFeedbackEl = this.#getFeedbackElement(f);

                if (ruleFeedbackEl && entry.ruleState?.feedback === ruleFeedbackEl.textContent)
                    ruleFeedbackEl.textContent = entry.original.feedback; // only restore if it holds the feedback msg set by the action
            }

            // Restore options (disabled state for each option)
            if (options && Array.isArray(options))
            {
                f.options.forEach(opt =>
                {
                    const storedOpt = options.find(o => o.id === opt.id);
                    if (storedOpt)
                    {
                        opt.disabled = storedOpt.disabled;
                    }
                });
            }

            if (!$lib.isEmpty(switchStates))
            {
                Object.assign(f, switchStates);
                this.form.updateField(f);
            }
        };

        if (entry.affectedByFieldSet)
        {
            const siblings = this.form.getFields(this.form.getFieldSet(entry.affectedByFieldSet)) || [];
            siblings.forEach(restore);
        }
        else
        {
            restore(field);
        }
    }

    #getFeedbackElement(field)
    {
        return field.element.querySelector('.' + this.form.getCssClass(this.form.classOption.RULE_FEEDBACK));
    }

    #isFieldHidden(field)
    {
        if (field.id in this.#hiddenFieldCache)
            return this.#hiddenFieldCache[field.id];

        let current = field,
            hidden = false;

        while (current)
        {
            if (current.visible === false)
            {
                hidden = true;
                break;
            }
            if (current.type === 'Section') break;

            current = current.parent;
        }

        this.#hiddenFieldCache[field.id] = hidden;
        return hidden;
    }

    /**
     * Loops through all ruleGroups in a case and evaluates them to see if they match.
     * @private
     * @param {Object} ruleCase
     * @returns {boolean} A value indicating if the rule case matches.
     */
    #evaluateCase(ruleCase)
    {
        if (!ruleCase.ruleGroups || ruleCase.ruleGroups.length === 0) return true;

        let result;
        const groups = ruleCase.ruleGroups;

        for (let index = 0; index < groups.length; index++)
        {
            const matched = this.#evaluateGroup(groups[index]);

            if (index === 0)
            {
                result = matched;
            }
            else
            {
                const op = groups[index - 1].logicalOperator || 'AND';
                result = (op === 'OR') ? (result || matched) : (result && matched);
            }
        }

        return result;
    }

    /**
     * Loops through rules in a group and returns true if the group matches.
     * @private
     * @param {Object} group
     * @returns {boolean} A value indicating if the group matches.
     */
    #evaluateGroup(group)
    {
        if (!group?.rules || group.rules.length === 0) return false;

        let result;
        const rules = group.rules;

        for (let index = 0; index < rules.length; index++)
        {
            const matched = this.#evaluateRule(rules[index]);

            if (index === 0)
            {
                result = matched;
            }
            else
            {
                // operator that combines rules[i-1] with rules[i]
                const op = rules[index - 1].logicalOperator || 'AND';
                result = (op === 'OR') ? (result || matched) : (result && matched);
            }
        }

        return result;
    }

    /**
     * Evaluates a single rule and returns true if the rule matches.
     * @private
     * @param {Object} rule 
     * @returns {boolean} A value indicating if the rule matches.
     */
    #evaluateRule(rule)
    {
        if (!rule?.sourceId || !rule.comparisonOperator)
            return false;

        const target = this.#getRuleTarget(rule);
        if (!target)
            return false;

        const isValueOperator = Operators.hasOwnProperty(rule.comparisonOperator);
        let valueToCheck;

        if (isValueOperator)
        {
            if (target.inputType === this.InputTypeOption.CHECKBOX || target.inputType === this.InputTypeOption.SWITCH)
            {
                const arrVal = this.dataBinder.getModelValue(target);

                if (Array.isArray(arrVal))
                {
                    if (target.componentSettings?.range)
                    {
                        valueToCheck = rule.isRangeEnd ? arrVal[1] : arrVal[0];
                    }
                    else
                        valueToCheck = arrVal;
                }
                else
                {
                    valueToCheck = (target.options || []).filter(opt =>
                    {
                        return !!this.dataBinder.getModelValue(opt); // make boolean of result
                    }).map(opt => (opt.value !== undefined ? opt.value : (opt.name || null))).filter(v => v !== null); // first filter all checked options, then either take the value (if set), otherwise the name
                }
            }
            else
            {
                valueToCheck = this.dataBinder.getModelValue(target);
            }

            const operatorFn = Operators[rule.comparisonOperator];
            return operatorFn ? operatorFn(valueToCheck, rule.value) : false;
        }
        else
        {
            const propMap = {
                [this.ComparisonOperatorOption.VISIBLE]: ['visible', true],
                [this.ComparisonOperatorOption.DISABLED]: ['disabled', true],
                [this.ComparisonOperatorOption.REQUIRED]: ['required', true],
                [this.ComparisonOperatorOption.HIDDEN]: ['visible', false],
                [this.ComparisonOperatorOption.ENABLED]: ['disabled', false],
                [this.ComparisonOperatorOption.OPTIONAL]: ['required', false],
            };

            const [propertyName, expectedValue] = propMap[rule.comparisonOperator];
            return target[propertyName] === expectedValue;
        }
    }

    #getRuleTarget(rule)
    {
        if (!rule?.sourceId) return null;

        return this.form.getField(rule.sourceId, null, this.#fields) || null;
    }
};

export default componyx.UI.form_modules.RuleEngine;
