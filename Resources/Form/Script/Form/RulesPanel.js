/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.form_modules = componyx.UI.form_modules || {};

componyx.UI.form_modules.RulesPanel = class RulesPanel
{
    #formCtor;
    #idPrefix;
    #panelId;
    #targetField;
    constructor(form, configPanelManager)
    {
        this.#panelId = 'RulesPanel';
        this.#idPrefix = `${form.id}_${this.#panelId}_`;

        this.form = form;
        this.expressionEngine = form.expressionEngine;
        this.labels = form.labels;
        this.cf = form.componentFactory;
        this.cpm = configPanelManager;
        this.#formCtor = this.form.constructor;
        this.InputTypeOption = this.#formCtor.InputTypeOption;
        this.LabelDisplayOption = componyx.UI.FormField.LabelDisplayOption;
        this.RunVisibilityOption = this.#formCtor.RuleCaseRunVisibilityOption;
    }

    destroy()
    {
        if (this.#targetField)
            this.#clearEmptyRules(this.#targetField);

        this.#targetField = null;
    }

    render(target)
    {
        const panel = this.cpm.panelBar.panels.find(p => p.id === this.#panelId),
            contentEl = panel.contentElement;

        contentEl.innerHTML = '';

        this.#targetField = this.form.getFields().find(f => f.id === target.id); // always make sure we have the proxied field

        this.cf.createButton(contentEl, `${this.#idPrefix}add_case`, this.form.addRuleCaseButtonId,
            {
                transparent: false,
                hasIcon: true,
                cssClassIcon: 'ico-plus',
                cssClass: this.cpm.getCssClass(this.cpm.classOption.ADD),
                text: `${this.labels.addItemPrefix}${this.labels.ruleCase}`,
                command: this.#addRuleCase.bind(this)
            });

        (target.ruleCases || []).forEach(ruleCase =>
        {
            this.#createRuleCase(contentEl, ruleCase.id);
        });
    }

    /**
     * Creates the value input for the rule or action.
     * @param {HTMLElement} container The container element.
     * @param {componyx.UI.Form.Field} field The Field instance.
     * @param {componyx.UI.Form.Rule|componyx.UI.Form.Action} target The Rule or Action instance.
     */
    createValueInput(container, field, target)
    {
        this.#createValueInput(container, field, target);
    }

    /**
     * Creates the expression value input for the action.
     * @param {HTMLElement} container The container element.
     * @param {componyx.UI.Form.Field} field The Field instance.
     * @param {componyx.UI.Form.Action} action The Action instance.
     */
    createExpressionInput(container, field, action)
    {
        this.#createExpressionInput(container, field, action);
    }

    #getRuleCaseById(id)
    {
        return this.#targetField.ruleCases.find(rc => rc.id === id) || null;
    }

    #getRuleGroupById(id, ruleCase)
    {
        return ruleCase.ruleGroups?.find(rg => rg.id === id) || null;
    }

    #getRuleById(id, ruleGroup)
    {

        return ruleGroup.rules?.find(r => r.id === id) || null;
    }

    #getActionById(id, ruleCase)
    {
        return ruleCase.actions?.find(a => a.id === id) || null;
    }

    #createRuleCase(container, ruleCaseId)
    {
        const ruleCase = this.#getRuleCaseById(ruleCaseId),
            id = `${this.#idPrefix}${ruleCase.id}`,
            ruleCaseEl = this.#createContainer(container, this.cpm.classOption.RULE_CASE, id),
            headerTitleEl = $lib.element({ tag: 'span', content: this.labels.ruleCaseHeader }),
            headerEl = $lib.element({ container: ruleCaseEl, tag: 'header', content: headerTitleEl });

        this.cf.createButton(headerEl, `${id}_remove`, this.form.removeRuleCaseButtonId,
            {
                hasIcon: true,
                cssClassIcon: 'ico-bin',
                cssClass: this.cpm.getCssClass(this.cpm.classOption.REMOVE),
                command: this.#removeRuleCase.bind(this, this.#targetField, ruleCase)
            });

        const ruleCaseContent = this.#createContainer(ruleCaseEl);
        this.cf.createFormField(ruleCaseContent, `${id}_trigger`, '', this.labels.ruleCaseTrigger, this.#createTriggerCombo(ruleCaseContent, `${id}_trigger_input`, ruleCase), {
            cssClass: this.cpm.getCssClass(this.cpm.classOption.RULE_CASE_TRIGGER),
            labelDisplay: this.LabelDisplayOption.BEFORE,
            inline: true
        });
        this.cf.createFormField(ruleCaseContent, `${id}_run_visibility`, '', this.labels.ruleCaseRunVisibility, this.#createRunVisibilityCombo(ruleCaseContent, `${id}_run_visibility_input`, ruleCase), {
            cssClass: this.cpm.getCssClass(this.cpm.classOption.RULE_CASE_RUN_VISIBILITY),
            labelDisplay: this.LabelDisplayOption.BEFORE,
            inline: true
        });

        this.#createLineBreak(ruleCaseContent);
        this.cf.createButton(ruleCaseContent, `${id}add_group`, this.form.addRuleGroupButtonId,
            {
                transparent: false,
                hasIcon: true,
                cssClassIcon: 'ico-plus',
                cssClass: this.cpm.getCssClass(this.cpm.classOption.ADD),
                text: `${this.labels.addItemPrefix}${this.labels.ruleGroup}`,
                command: this.#addRuleGroup.bind(this, ruleCase.id)
            });

        this.#createGroups(ruleCaseContent, ruleCase);
        this.#createActions(ruleCaseContent, ruleCase);
    }

    #createLineBreak(container)
    {
        $lib.element({ container, tag: 'p', attrs: { class: this.cpm.getCssClass(this.cpm.classOption.LINE_BREAK) } });
    }

    #createGroups(container, ruleCase)
    {
        const ruleGroupsEl = this.#createContainer(container, this.cpm.classOption.RULE_GROUPS);

        ruleGroupsEl.setAttribute('data-placeholder', this.labels.ruleGroupsEmptyHint);

        (ruleCase.ruleGroups || []).forEach(ruleGroup =>
        {
            this.#createRuleGroup(ruleGroupsEl, ruleCase, ruleGroup.id);
        });
    }

    #createActions(container, ruleCase)
    {
        const id = `${this.#idPrefix}${ruleCase.id}`,
            actionsContainer = this.#createContainer(container, this.cpm.classOption.ACTIONS),
            headerEl = $lib.element({ container: actionsContainer, tag: 'header', content: this.labels.actionsHeader });

        this.cf.createButton(headerEl, `${id}add_action`, this.form.addActionButtonId,
            {
                hasIcon: true,
                cssClassIcon: 'ico-plus',
                cssClass: this.cpm.getCssClass(this.cpm.classOption.ADD),
                command: this.#addAction.bind(this, ruleCase)
            });

        let isFollowUpAction = false;
        (ruleCase.actions || []).forEach(action =>
        {
            this.#createAction(actionsContainer, ruleCase, action.id, isFollowUpAction);

            const runtime = this.form.runtimeActions[action.runtimeActionId];
            if (runtime?.mustAwait)
                isFollowUpAction = true;
        });
    }

    #createRuleGroup(container, ruleCase, ruleGroupId)
    {
        const ruleGroup = this.#getRuleGroupById(ruleGroupId, ruleCase),
            id = `${this.#idPrefix}${ruleGroup.id}`,
            groupEl = this.#createContainer(container, this.cpm.classOption.RULE_GROUP, id);

        ruleGroup.parent = ruleCase; // set parent reference

        const rulesEl = this.#createContainer(groupEl, this.cpm.classOption.RULES);

        (ruleGroup.rules || []).forEach(rule =>
        {
            this.#createRule(rulesEl, ruleGroup, rule.id);
        });

        this.cf.createFormField(groupEl, `${id}_logical_operator`, '', this.labels.ruleGroupConnector,
            this.#createLogicalOperatorCombo(groupEl, `${id}_logical_operator_input`, ruleGroup,
                {
                    onItemSelect: (combo, args) =>
                    {
                        if (args.item.id === 'X') // clear
                        {
                            ruleGroup.logicalOperator = null;

                            const index = ruleCase.ruleGroups.findIndex(rg => rg.id === ruleGroup.id);

                            if (index !== -1)
                            {
                                const groupsToRemove = ruleCase.ruleGroups.slice(index); // remove this and all following groups
                                groupsToRemove.forEach(g => this.#removeRuleGroup(ruleCase, g));
                            }
                        }
                        else
                        {
                            ruleGroup.logicalOperator = args.item.id;

                            const lastGroup = ruleCase.ruleGroups[ruleCase.ruleGroups.length - 1];
                            if (lastGroup.id === ruleGroup.id)
                                this.#addRuleGroup(ruleCase.id);
                        }
                    }
                }), { labelDisplay: this.LabelDisplayOption.BEFORE });
    }

    #createRule(container, ruleGroup, ruleId)
    {
        const rule = this.#getRuleById(ruleId, ruleGroup),
            id = `${this.#idPrefix}${rule.id}`,
            ruleEl = this.#createContainer(container, this.cpm.classOption.RULE, id);

        ruleEl._rule = rule;
        rule.parent = ruleGroup;

        // make sure value container is already available for possible field selection when rendering field combobox
        const cssClass = `${this.cpm.getCssClass(this.cpm.classOption.RULE_VALUE)} ${this.cpm.getCssClass(this.cpm.classOption.DISABLED)}`,
            valueContainer = $lib.element({ container: ruleEl, props: { className: cssClass, inert: true } });

        this.#createFieldCombo(ruleEl, `${id}_field`, rule);
        this.#createComparisonOperatorCombo(ruleEl, `${id}_comparison_operator`, rule);
        const logicalOperatorEl = this.#createLogicalOperatorCombo(ruleEl, `${id}_logical_operator`, rule,
            {
                onItemSelect: (combo, args) =>
                {
                    if (args.item.id === 'X') // clear
                    {
                        const index = ruleGroup.rules.findIndex(r => r.id === rule.id);

                        if (index !== -1)
                        {
                            const rulesToRemove = ruleGroup.rules.slice(index); // remove this and all following rules
                            rulesToRemove.forEach(r => this.#removeRule(ruleGroup, r));
                        }
                    }
                    else
                    {
                        rule.logicalOperator = args.item.id;

                        const lastRule = ruleGroup.rules[ruleGroup.rules.length - 1];
                        if (lastRule.id === rule.id)
                            this.#addRule(ruleGroup);
                    }
                }
            });

        ruleEl.insertBefore(valueContainer, logicalOperatorEl); // correct placement of value container
    }

    #createAction(container, ruleCase, actionId, followUp)
    {
        const action = this.#getActionById(actionId, ruleCase),
            id = `${this.#idPrefix}${action.id}`,
            actionEl = this.#createContainer(container, this.cpm.classOption.ACTION, id);

        if (followUp)
            actionEl.classList.add(this.cpm.getCssClass(this.cpm.classOption.ACTION_FOLLOW_UP));

        action.parent = ruleCase;

        const valueContainer = $lib.element({
            container: actionEl,
            props:
            {
                className: `${this.cpm.getCssClass(this.cpm.classOption.ACTION_VALUE)} ${this.cpm.getCssClass(this.cpm.classOption.DISABLED)}`,
                inert: true
            }
        });

        this.#createActionCombo(actionEl, `${id}`, action);
        this.#createActionTargetCombo(actionEl, `${id}`, action);
        this.cf.createButton(actionEl, `${id}_remove`, this.form.removeActionButtonId,
            {
                hasIcon: true,
                cssClassIcon: 'ico-bin',
                cssClass: this.cpm.getCssClass(this.cpm.classOption.REMOVE),
                command: this.#removeAction.bind(this, ruleCase, action)
            }).element;

        this.#createLineBreak(actionEl);
        actionEl.appendChild(valueContainer); // correct placement of value container
    }

    #addRuleCase()
    {
        const ruleCase = new this.#formCtor.RuleCase({ trigger: this.#formCtor.RuleCaseTriggerOption.ALWAYS, ruleGroups: [], actions: [] }),
            target = this.#targetField;

        ruleCase.id = this.form.guid();
        target.ruleCases = target.ruleCases || [];
        target.ruleCases.push(ruleCase);

        const panel = this.cpm.panelBar.panels.find(p => p.id === this.#panelId);
        this.#createRuleCase(panel.contentElement, ruleCase.id);
        this.#addRuleGroup(ruleCase.id);
        this.form.updateField(this.#targetField);
    }

    #removeRuleCase(target, ruleCase)
    {
        const index = target.ruleCases.findIndex(rc => rc.id === ruleCase.id);
        if (index !== -1) target.ruleCases.splice(index, 1);

        const el = $lib(`#${this.#idPrefix}${ruleCase.id}`);

        if (el)
            el.remove();

        this.form.updateField(this.#targetField);
    }

    #addRuleGroup(ruleCaseId)
    {
        const ruleCase = this.#getRuleCaseById(ruleCaseId),
            ruleGroup = new this.#formCtor.RuleGroup({ rules: [], logicalOperator: 'AND' }),
            rule = new this.#formCtor.Rule();

        ruleGroup.id = this.form.guid();
        rule.id = this.form.guid();

        ruleCase.ruleGroups = ruleCase.ruleGroups || [];
        ruleCase.ruleGroups.push(ruleGroup);
        ruleGroup.rules.push(rule);

        const ruleGroupsEl = $lib(`#${this.#idPrefix}${ruleCase.id}`).querySelector(`.${this.cpm.getCssClass(this.cpm.classOption.RULE_GROUPS)}`);
        this.#createRuleGroup(ruleGroupsEl, ruleCase, ruleGroup.id);
    }

    #removeRuleGroup(ruleCase, ruleGroup)
    {
        (ruleGroup.rules || []).forEach(rule =>
        {
            this.#removeRule(ruleGroup, rule);
        });

        const index = ruleCase.ruleGroups.findIndex(rg => rg.id === ruleGroup.id);
        if (index !== -1) ruleCase.ruleGroups.splice(index, 1);

        const el = $lib(`#${this.#idPrefix}${ruleGroup.id}`);

        if (el)
            el.remove();
    }

    #addRule(ruleGroup)
    {
        const rule = new this.#formCtor.Rule({ sourceId: null, property: null, comparisonOperator: null, value: null });

        rule.id = this.form.guid();
        ruleGroup.rules = ruleGroup.rules || [];
        ruleGroup.rules.push(rule);

        const groupEl = $lib(`#${this.#idPrefix}${ruleGroup.id}`).querySelector(`.${this.cpm.getCssClass(this.cpm.classOption.RULES)}`);
        this.#createRule(groupEl, ruleGroup, rule.id);
    }

    #removeRule(ruleGroup, rule)
    {
        const index = ruleGroup.rules.findIndex(r => r.id === rule.id);
        if (index !== -1) ruleGroup.rules.splice(index, 1);

        const el = $lib(`#${this.#idPrefix}${rule.id}`);
        el.remove();

        if (!ruleGroup.rules || ruleGroup.rules.length === 0)
            this.#removeRuleGroup(ruleGroup.parent, ruleGroup);
    }

    #addAction(ruleCase)
    {
        const action = new this.#formCtor.Action({ value: null });

        action.id = this.form.guid();
        ruleCase.actions = ruleCase.actions || [];
        ruleCase.actions.push(action);

        const actionsEl = $lib(`#${this.#idPrefix}${ruleCase.id}`).querySelector(`.${this.cpm.getCssClass(this.cpm.classOption.ACTIONS)}`);
        this.#createAction(actionsEl, ruleCase, action.id, false);
        this.#updateFollowUpActions(ruleCase);
    }

    #removeAction(ruleCase, action)
    {
        const index = ruleCase.actions.findIndex(a => a.id === action.id);
        if (index !== -1) ruleCase.actions.splice(index, 1);

        const el = $lib(`#${this.#idPrefix}${action.id}`);
        el.remove();
        this.#updateFollowUpActions(ruleCase);
    }

    #updateFollowUpActions(ruleCase)
    {
        const cssClassFollowUp = this.cpm.getCssClass(this.cpm.classOption.ACTION_FOLLOW_UP);
        let isFollowUpAction = false;

        (ruleCase.actions || []).forEach(action =>
        {
            const el = $lib(`#${this.#idPrefix}${action.id}`);
            if (!el) return;

            el.classList.toggle(cssClassFollowUp, isFollowUpAction);

            const runtime = this.form.runtimeActions[action.runtimeActionId];
            if (runtime?.mustAwait)
                isFollowUpAction = true;
        });
    }

    #clearEmptyRules(field)
    {
        (field.ruleCases || []).forEach(ruleCase =>
        {
            (ruleCase.ruleGroups || []).slice().forEach(ruleGroup =>
            {
                (ruleGroup.rules || []).slice().forEach(rule =>
                {
                    if ($lib.isEmpty(rule.sourceId))
                        this.#removeRule(ruleGroup, rule);
                });

                if (!ruleGroup.rules || ruleGroup.rules.length === 0)
                    this.#removeRuleGroup(ruleCase, ruleGroup);
            })
        });
    }

    #createContainer(container, cssClass, id)
    {
        return $lib.element({ container: container, props: { id: (id) ? id : undefined, className: (cssClass) ? this.cpm.getCssClass(cssClass) : undefined } });
    }

    #createSectionsValueCombo(container, field, action)
    {
        const sections = this.form.fieldSets,
            itemList = sections.map(s => ({ id: s.id, text: s.name, selected: s.id === action.value }));
        this.cf.createComboBox(container, `${action.id}_input`, this.form.sectionsValueComboBoxId, {
            placeholder: this.labels.comboBoxDefaultHint,
            allowInput: false,
            disableClearButton: true,
            itemList,
            events: {
                onItemSelect: (combo, args) =>
                {
                    action.value = combo.getValue();
                }
            }
        });
    }

    /**
     * Creates the value input for the rule or action.
     * @param {HTMLElement} container The container element.
     * @param {componyx.UI.Form.Field} field The Field instance.
     * @param {componyx.UI.Form.Rule|componyx.UI.Form.Action} target The Rule or Action instance.
     * @private
     * @ignore
     */
    #createValueInput(container, field, target)
    {
        const formCtor = this.form.constructor,
            customType = formCtor.getCustomType(field.inputTypeName),
            InputTypeOption = this.InputTypeOption,
            id = `${target.id}_input`,
            defaultInput = this.#createDefaultValueInput.bind(this),
            onChanged = (c, args) => { target.value = args.value },
            events = { onChanged },
            createComponent = (cloneId, type, compSettings = {}) =>
            {
                return this.cf.createComponent(
                    container,
                    type || this.cf.getComponentType(field.inputType),
                    this.cf.createElement(id).id,
                    cloneId,
                    {
                        ...compSettings,
                        _disableDataBinding: true,
                        value: target.value,
                        events: {
                            ...(compSettings.events || {})
                        }
                    }
                );
            };

        this.#clearValueContainer(container, target.id);

        if (customType?.renderValueInput)
        {
            return customType.renderValueInput({
                form: this.form,
                field,
                target,
                container
            });
        }

        const settings = field.componentSettings || {};

        switch (field.inputType)
        {
            case InputTypeOption.TEXTBOX:
            case InputTypeOption.TEXTAREA:
                return defaultInput(container, target, id);

            case InputTypeOption.MASKEDTEXTBOX:
                return createComponent(this.form.valueMaskedTextBoxId, null, {
                    mask: settings.mask || '____-____',
                    events
                });

            case InputTypeOption.NUMERICBOX:
                return createComponent(this.form.valueNumericBoxId, null, {
                    precision: (!$lib.isEmpty(settings.precision)) ? parseFloat(settings.precision) : 0,
                    minValue: settings.minValue,
                    maxValue: settings.maxValue,
                    events
                });

            case InputTypeOption.SLIDER:
                return createComponent(this.form.valueNumericBoxId, this.cf.getComponentType(InputTypeOption.NUMERICBOX), {
                    minValue: settings.minValue,
                    maxValue: settings.maxValue,
                    events
                });

            case InputTypeOption.DATEPICKER:
                return createComponent(this.form.valueDatePickerId, null, {
                    dateFormat: this.form.format.dateFormat,
                    events: {
                        onChanged: (c, args) => { target.value = $lib.formatDate(args.date, 'YYYY-MM-DD') }
                    }
                });

            case InputTypeOption.TIMEPICKER:
                return createComponent(this.form.valueTimePickerId, null, {
                    events
                });

            case InputTypeOption.CHECKBOX:
            case InputTypeOption.SWITCH:
            case InputTypeOption.RADIO:
            case InputTypeOption.COMBOBOX:
                return this.#createComboBoxValueInput(container, field, target);

            default:
                defaultInput(container, target, id);
        }
    }

    #createDefaultValueInput(container, target, id)
    {
        return this.cf.createInput({
            container,
            id,
            type: (target.type === 'Rule') ? 'text' : 'textarea',
            value: target.value || '',
            placeholder: this.labels.actionValueHint,
            events: { input: (e) => { target.value = e.target.value; } }
        });
    }

    #createComboBoxValueInput(container, field, target, showSelectAll = true, forceMultiSelect = false)
    {
        const id = `${this.#idPrefix}${target.type}_${target.id}_input`,
            multiSelect = forceMultiSelect || (field.inputType === this.InputTypeOption.CHECKBOX || field.inputType === this.InputTypeOption.SWITCH || field.componentSettings?.multiSelect == true),
            comboBox = this.cf.createComboBox(container, id, this.form.optionsValueComboBoxId,
                {
                    allowInput: false,
                    _disableDataBinding: true,
                    _mustRender: false, // we render after clone
                    multiSelect,
                    events: {
                        onItemSelect: (combo, args) =>
                        {
                            target.value = combo.getValue().split(',');
                        },
                        onItemDeselect: (combo, args) =>
                        {
                            target.value = combo.getValue().split(',');
                        }
                    }
                });

        const config = this.cf.configureComboBox(field, {}, false);

        (config.itemList || []).forEach((item) =>
        {
            if (target.value && target.value.includes(item.value))
                item.selected = true;
        })

        $lib.clone(comboBox, config, true, true, true, true, true, null);

        if (showSelectAll)
            comboBox.setSelectAllTemplate(`{checkBox} ${this.labels.comboBoxSelectAll}`);

        comboBox.render();

        return comboBox.element;
    }

    /**
     * Creates an expression input (textarea + two comboboxes: fields and math functions).
     * Only supported for TEXTBOX, TEXTAREA and NUMERICBOX input types.
     * @private
     * @param {HTMLElement} container - The container where the expression UI will be placed (value container).
     * @param {componyx.UI.Form.Field} field - The target field for which the expression will be built.
     * @param {Object} action - The action object being edited (will get action.expression).
     * @returns {HTMLElement} The expression UI container element.
     */
    #createExpressionInput(container, field, action)
    {
        this.#clearValueContainer(container, action.id);

        const id = `${this.#idPrefix}${action.id}_expression`,
            exprEl = this.#createContainer(container, this.cpm.classOption.EXPRESSION);

        this.cf.createInput({
            container: exprEl,
            type: 'textarea',
            id: `${id}_input`,
            value: action.expression || '',
            placeholder: this.labels.actionExpressionHint,
            events: {
                input: (e) =>
                {
                    const textarea = e.target,
                        isNumericField = field.inputType === this.InputTypeOption.NUMERICBOX;

                    textarea.value = textarea.value.replace(/(\{\{[^}]*\}\})|./g, (match, placeholder) => 
                    {
                        if (placeholder) // sanitize inside placeholder: allow letters, numbers, underscore, dot
                        {
                            const disallowedCharsRegex = /[^0-9+\-*/().,\s<>=!?:@_\$[\]_A-Za-z0-9'"\\]/g;
                            const inner = placeholder.slice(2, -2).replace(disallowedCharsRegex, '');
                            return '{{' + inner + '}}';
                        }
                        else if (isNumericField) // for numeric fields, only allow numeric expression chars outside placeholders
                        {
                            if (/[\d+\-*/()., ]/.test(match)) return match;
                            return '';
                        }
                        else
                            return match; // for free-text fields, leave as-is
                    }
                    );

                    action.expression = e.target.value;
                },
                keydown: (e) =>
                {
                    if (field.inputType === this.InputTypeOption.NUMERICBOX)
                    {
                        if (!/[0-9+\-*/()., ]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key))
                            e.preventDefault();
                    }
                },
            }
        });

        const controls = this.#createContainer(exprEl, this.cpm.classOption.EXPRESSION_CONTROLS);
        this.#createExprFieldCombo(controls, id, action);
        this.#createExprMathCombo(controls, id, action);

        return exprEl;
    }

    /**
     * Checks if the cursor is inside an existing placeholder {{...}}.
     * @private
     * @param {HTMLTextAreaElement} textarea
     * @returns {boolean}
     */
    #isCursorInsidePlaceholder(textarea)
    {
        const pos = textarea.selectionStart,
            placeholders = this.#getPlaceholders(textarea.value);

        for (const t of placeholders)
        {
            if (pos > t.start && pos < t.end)
                return true;
        }
        return false;
    }

    /**
     * Gets the placeholders from the textarea.
     * @private
     * @param {HTMLTextAreaElement} textarea
     * @returns {string[]} The placeholders.
     */
    #getPlaceholders(value)
    {
        const regex = /\{\{[^{}]+\}\}/g
        let match, placeholders = [];
        while ((match = regex.exec(value)) !== null)
        {
            placeholders.push({ start: match.index, end: match.index + match[0].length });
        }
        return placeholders;
    }

    /**
     * Creates the Expression Field ComboBox.
     * @private
     * @param {any} container
     * @param {any} id
     * @param {any} action
     */
    #createExprFieldCombo(container, id, action)
    {
        let fields = (action.parent.runVisibility === this.RunVisibilityOption.SECTION_HIDDEN || !this.form.hasSections())
            ? this.form.getFields()
            : this.form.getFields().filter(f =>
            {
                const section = this.form.getParentSection(f);
                return section.selected;
            }),
            itemList = fields.map(f => ({ id: f.name, text: f.name }));

        this.cf.createComboBox(container, `${id}_fieldCombo`, this.form.compareFieldComboBoxId, {
            name: 'exprField',
            placeholder: this.labels.comboBoxDefaultHint,
            allowInput: false,
            disableClearButton: true,
            itemList,
            events: {
                onItemSelect: (c, args) =>
                {
                    const textarea = $lib(`#${id}_input`),
                        inPlaceholder = this.#isCursorInsidePlaceholder(textarea),
                        insertText = inPlaceholder ? `${args.item.id}` : `{{${args.item.id}}}`;

                    this.#insertAtCursor(textarea, insertText);
                    textarea.focus();
                }
            }
        });
    }

    /**
     * Creates the expression Math ComboBox.
     * @private
     * @param {any} container
     * @param {any} id
     * @param {any} action
     */
    #createExprMathCombo(container, id, action)
    {
        const mathFns = ['abs', 'ceil', 'floor', 'round', 'max', 'min', 'trunc', 'sqrt', 'pow'],
            itemList = mathFns.map(fn => ({ id: fn, text: `Math.${fn}()` }));

        this.cf.createComboBox(container, `${id}_mathCombo`, this.form.operatorComboBoxId, {
            name: 'exprMath',
            placeholder: this.labels.comboBoxDefaultHint,
            allowInput: false,
            disableClearButton: true,
            itemList,
            events: {
                onItemSelect: (combo, args) =>
                {
                    const textarea = $lib(`#${id}_input`),
                        inPlaceholder = this.#isCursorInsidePlaceholder(textarea),
                        insertText = inPlaceholder ? `Math.${args.item.id}()` : `{{Math.${args.item.id}()}}`,
                        cursorPos = inPlaceholder ? -1 : -3; // set cursor between parenthesis

                    this.#insertAtCursor(textarea, insertText, cursorPos);

                    textarea.focus();
                }
            }
        });
    }

    /**
     * Inserts text at the cursor of a textarea and optionally sets cursor offset (relative to insertion end).
     * @private
     * @param {HTMLTextAreaElement} textarea
     * @param {string} text
     * @param {number} cursorOffset - offset from end of inserted text where cursor should be placed (default 0).
     */
    #insertAtCursor(textarea, text, cursorOffset = 0)
    {
        const start = textarea.selectionStart ?? textarea.value.length,
            end = textarea.selectionEnd ?? textarea.value.length,
            before = textarea.value.substring(0, start),
            after = textarea.value.substring(end);

        textarea.value = before + text + after;

        // position cursor: start + inserted length + offset
        let cursorPos = start + text.length + cursorOffset;

        if (cursorPos < 0)
            cursorPos = 0;

        if (cursorPos > textarea.value.length)
            cursorPos = textarea.value.length;

        textarea.selectionStart = textarea.selectionEnd = cursorPos;
        textarea.focus();
        textarea.dispatchEvent(new Event('input')); // trigger input so bindings pick it up
    }

    #createFieldCombo(container, id, rule)
    {
        let ruleGroup = rule.parent,
            fields = (ruleGroup.parent.runVisibility === this.RunVisibilityOption.SECTION_HIDDEN || !this.form.hasSections())
            ? this.form.getFields()
            : this.form.getFields().filter(f =>
            {
                const section = this.form.getParentSection(f);
                return section.selected;
            }),
            selectedValue = rule.sourceId,
            itemList = fields
                .flatMap(f =>
                {
                    if (f.inputType === this.InputTypeOption.SLIDER && f.componentSettings?.range)
                    {
                        return [
                            { id: `${f.id}_start`, text: `${f.name} (${this.labels.start})`, selected: f.id === selectedValue && !rule.isRangeEnd },
                            { id: `${f.id}_end`, text: `${f.name} (${this.labels.end})`, selected: f.id === selectedValue && rule.isRangeEnd }
                        ];
                    }
                    return [{ id: f.id, text: f.name, selected: f.id === selectedValue }];
                }),
            events = {
                onItemSelect: (c, args) =>
                {
                    const id = args.item.id;

                    rule.isRangeEnd = id.endsWith("_end");
                    rule.sourceId = id.replace(/_start$|_end$/, '');

                    this.#createValueInput(this.#getValueContainer(container), this.form.getField(rule.sourceId), rule);
                }
            };

        return this.cf.createComboBox(container, id, this.form.sourceFieldComboBoxId, {
            name: `sourceId`,
            placeholder: this.labels.ruleFieldHint,
            cssClass: this.cpm.getCssClass(this.cpm.classOption.COMBOBOX_RULE_FIELD),
            allowInput: false,
            disableClearButton: true,
            itemList,
            events
        }).element;
    }

    #createComparisonOperatorCombo(container, id, rule)
    {
        const selectedValue = rule.comparisonOperator,
            itemList = Object.values(this.#formCtor.RuleComparisonOperatorOption)
                .map(value => ({
                    id: value,
                    text: this.labels[`operator_${value}`],
                    selected: value === selectedValue
                })),
            events = {
                onItemSelect: (c, args) =>
                {
                    const valueContainer = this.#getValueContainer(container);
                    rule.comparisonOperator = args.item.id;

                    if (['empty', 'not_empty', 'visible', 'hidden', 'enabled', 'disabled', 'required', 'optional'].includes(args.item.id))
                    {
                        this.#toggleContainer(valueContainer);
                    }
                    else
                    {
                        this.#toggleContainer(valueContainer, false);
                    }
                }
            };

        return this.cf.createComboBox(container, id, this.form.comparisonComboBoxId, {
            name: 'comparisonOperator',
            placeholder: this.labels.ruleComparisonOperatorHint,
            cssClass: this.cpm.getCssClass(this.cpm.classOption.COMBOBOX_RULE_COMPARISON_OPERATOR),
            allowInput: false,
            disableClearButton: true,
            itemList,
            events
        }).element;
    }

    #createLogicalOperatorCombo(container, id, target, events)
    {
        const itemList = [
            { id: 'AND', text: this.labels.operator_and },
            { id: 'OR', text: this.labels.operator_or },
            { id: 'X', text: `${this.labels.removeItemPrefix.trim()}`, hasIcon: true, cssClassIcon: 'icon ico-bin' }];

        itemList.forEach(item =>
        {
            item.selected = (item.id === target?.logicalOperator);
        });

        return this.cf.createComboBox(container, id, this.form.logicalOperatorComboBoxId, {
            name: 'logicalOperator',
            placeholder: this.labels.comboBoxDefaultHint,
            cssClass: this.cpm.getCssClass(this.cpm.classOption.COMBOBOX_LOGICAL_OPERATOR),
            allowInput: false,
            disableClearButton: true,
            itemList,
            events
        }).element;
    }

    #createTriggerCombo(container, id, ruleCase)
    {
        const selectedValue = ruleCase.trigger || this.#formCtor.RuleCaseTriggerOption.ALWAYS,
            itemList = Object.values(this.#formCtor.RuleCaseTriggerOption)
                .map(value => ({
                    id: value,
                    text: this.labels[`trigger_${value}`],
                    selected: value === selectedValue
                })),
            events = {
                onItemSelect: (c, args) =>
                {
                    ruleCase.trigger = args.item.id;
                }
            };

        return this.cf.createComboBox(container, id, this.form.triggerComboBoxId, {
            name: 'trigger',
            allowInput: false,
            disableClearButton: true,
            itemList,
            events
        }).element;
    }

    #createRunVisibilityCombo(container, id, ruleCase)
    {
        const selectedValue = ruleCase.runVisibility || this.RunVisibilityOption.VISIBLE,
            itemList = Object.values(this.RunVisibilityOption)
                .map(value => ({
                    id: value,
                    text: this.labels[`run_visibility_${value}`],
                    selected: value === selectedValue
                })),
            events = {
                onItemSelect: (c, args) =>
                {
                    ruleCase.runVisibility = args.item.id;
                }
            };

        return this.cf.createComboBox(container, id, this.form.runVisibilityComboBoxId, {
            name: 'runVisibility',
            allowInput: false,
            disableClearButton: true,
            itemList,
            events
        }).element;
    }

    #createActionCombo(container, id, action)
    {
        const itemList = [],
            selectedValue = action.runtimeActionId,
            runtimeActions = this.form.runtimeActions,
            target = this.#targetField,
            InputTypeOption = this.InputTypeOption,
            isOptionField = [InputTypeOption.CHECKBOX, InputTypeOption.SWITCH, InputTypeOption.RADIO, InputTypeOption.COMBOBOX].includes(target.inputType),
            allowedExprTypes = [InputTypeOption.TEXTBOX, InputTypeOption.TEXTAREA, InputTypeOption.NUMERICBOX],
            events = {
                onItemSelect: (c, args) =>
                {
                    action.runtimeActionId = args.item.id;

                    const ra = runtimeActions[action.runtimeActionId],
                        valueContainer = this.#getValueContainer(container, this.cpm.classOption.ACTION_VALUE),
                        targetCombo = $UI.store[`${id}_target_input`];

                    if (targetCombo)
                    {
                        if (targetCombo.renderState === $base.static.RenderState.RENDERED)
                        {
                            if (ra.supportsFieldSet)
                                targetCombo.enable();
                            else
                                targetCombo.disable();
                        }
                        else
                        {
                            targetCombo.disabled = !ra.supportsFieldSet;
                        }
                    }

                    if (isOptionField && (action.runtimeActionId === 'disable' || action.runtimeActionId === 'enable'))
                    {
                        this.#toggleContainer(valueContainer, false);
                        this.#clearValueContainer(valueContainer, target.id);
                        this.#createComboBoxValueInput(valueContainer, target, action, true, true);
                    }
                    else if (ra.setValue)
                    {
                        this.#toggleContainer(valueContainer, false);

                        if (ra.id === 'show_section') // special case, show combo-box with sections
                            this.#createSectionsValueCombo(valueContainer, target, action);
                        else
                            this.#createValueInput(valueContainer, target, action);
                    }
                    else if (ra.setExpression)
                    {
                        this.#toggleContainer(valueContainer, false);
                        this.#createExpressionInput(valueContainer, target, action);
                    }
                    else
                        this.#clearValueContainer(valueContainer, action.id);
                },
                onClear: () =>
                {
                    action.runtimeActionId = null;
                    this.#clearValueContainer(this.#getValueContainer(container, this.cpm.classOption.ACTION_VALUE), action.id);
                }
            };

        Object.entries(runtimeActions).forEach(([id, a]) =>
        {
            if (((a.setValue || a.setExpression) && target.inputType === InputTypeOption.FILEUPLOAD) ||
                (a.setExpression && (!allowedExprTypes.includes(target.inputType))))
                return;

            if (id === 'cancel_submit' && action.parent?.trigger !== this.#formCtor.RuleCaseTriggerOption.BEFORE_SUBMIT)
                return;

            if (id === 'show_section' && !this.form.hasSections() && id !== selectedValue)
                return;

            itemList.push({
                id: id,
                text: a.label,
                tooltip: a.description || undefined,
                selected: id === selectedValue
            });
        });

        return this.cf.createComboBox(container, id + '_action_input', this.form.actionComboBoxId, {
            name: 'action',
            placeholder: this.labels.comboBoxDefaultHint,
            cssClass: this.cpm.getCssClass(this.cpm.classOption.COMBOBOX_ACTION),
            allowInput: false,
            tooltipManagerId: this.form.tooltipManager.id,
            itemList,
            events
        }).element;
    }

    #createActionTargetCombo(container, id, action)
    {
        const field = this.#targetField,
            runtimeActions = this.form.runtimeActions,
            fieldSet = field.parent,
            selectedValue = action.targetFieldSetId || field.id,
            itemList = [
                {
                    id: field.id,
                    text: `${this.labels.applyToItemPrefix} ${this.labels.field} (${field.name})`,
                    selected: selectedValue === field.id
                },
                {
                    id: `fieldset_${fieldSet.id}`,
                    text: `${this.labels.applyToItemPrefix} ${this.labels.fieldSet} (${fieldSet.id})`,
                    selected: selectedValue === fieldSet.id
                }
            ];

        const combo = this.cf.createComboBox(container, `${id}_target_input`, this.form.actionTargetComboBoxId, {
            name: 'actionTarget',
            placeholder: this.labels.comboBoxDefaultHint,
            allowInput: false,
            disableClearButton: true,
            disabled: (!action.runtimeActionId) ? true : !runtimeActions[action.runtimeActionId].supportsFieldSet,
            itemList,
            events: {
                onItemSelect: (c, args) =>
                {
                    const selectedId = args.item.id,
                        valueContainer = this.#getValueContainer(container, this.cpm.classOption.ACTION_VALUE);

                    if (selectedId.startsWith('fieldset_'))
                    {
                        action.targetFieldSetId = selectedId.replace('fieldset_', '');
                        this.#toggleContainer(valueContainer, true);
                    }
                    else
                    {
                        action.targetFieldSetId = null;
                        this.#toggleContainer(valueContainer, false);
                    }
                }
            }
        });

        return combo.element;
    }

    #toggleContainer(container, disabled = true)
    {
        container.inert = disabled;

        if (disabled)
            container.classList.add(this.cpm.getCssClass(this.cpm.classOption.DISABLED));
        else
            container.classList.remove(this.cpm.getCssClass(this.cpm.classOption.DISABLED));
    }

    #getValueContainer(container, cssClass = this.cpm.classOption.RULE_VALUE)
    {
        return container.querySelector(`.${this.cpm.getCssClass(cssClass)}`);
    }

    #clearValueContainer(container, id)
    {
        const inputId = `${this.#idPrefix}${id}_input`;

        if ($UI.store[inputId]?.renderState > 0)
            $UI.store[inputId].destroy();

        container.innerHTML = '';
    }
}

export default componyx.UI.form_modules.RulesPanel;
