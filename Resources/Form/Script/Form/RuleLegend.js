/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.form_modules = componyx.UI.form_modules || {};

componyx.UI.form_modules.RuleLegend = class RuleLegend
{
    #dialog;
    #titleElement;
    #listElement;

    constructor(form)
    {
        this.form = form;
        this.cf = form.componentFactory;
        this.classOption = form.classOption;
        this.getCssClass = form.getCssClass;
    }

    get labels()
    {
        return this.form.labels;
    }

    /**
     * Creates the rule legend dialog and binds it to the command button that toggles it's visibility.
     * @param {componyx.UI.Form.Command} command - The header command that opens and closes the legend.
     */
    create(command)
    {
        this.#dialog = this.cf.createComponent(this.form, componyx.UI.Dialog, `${this.form.id}_RuleLegend`, this.form.ruleLegendDialogId,
            {
                cssClass: this.getCssClass(this.classOption.RULE_LEGEND),
                showing: false,
                modal: false,
                draggable: true,
                hideOnOutsideClick: false,
                expandDirection: componyx.UI.Box.ExpandDirectionOption.DOWN,
                alignX: componyx.UI.Box.AlignXOption.CENTER
            });

        this.#dialog.buttons.confirm = this.#dialog.buttons.cancel = this.#dialog.buttons.deny = false;

        this.#titleElement = $lib.element({ tag: 'span' });
        this.#listElement = $lib.element({ tag: 'ul', attrs: { class: this.getCssClass(this.classOption.RULE_LEGEND_LIST), "data-placeholder": this.labels.ruleLegendEmpty } });

        this.#dialog.setHeaderTemplate(this.#titleElement);
        this.#dialog.setContentTemplate(this.#listElement);

        command.boxId = this.#dialog.id;
    }

    /**
     * Rebuilds the legend from the rule cases that are currently active in the rule engine.
     */
    update()
    {
        const activeRuleCases = this.form.ruleEngine.getActiveRuleCases();
        let count = 0;

        this.#listElement.innerHTML = '';

        activeRuleCases.forEach((ruleCases, fieldId) =>
        {
            const field = this.form.getField(fieldId);

            ruleCases.forEach(ruleCase =>
            {
                this.#createItem(field, ruleCase);
                count++;
            });
        });

        this.#titleElement.textContent = $lib.format(this.labels.ruleLegendTitle, count);
    }

    /**
     * Adds one list item for a rule case: the field it belongs to, its actions and the reason it applies.
     * @private
     * @param {componyx.UI.Form.Field} field - The field that owns the rule case.
     * @param {Object} ruleCase - The active rule case.
     */
    #createItem(field, ruleCase)
    {
        const itemElement = $lib.element({ container: this.#listElement, tag: 'li' }),
            fieldElement = $lib.element({ container: itemElement, tag: 'span', attrs: { class: this.getCssClass(this.classOption.RULE_LEGEND_FIELD) } }),
            actionsElement = $lib.element({ container: itemElement, tag: 'span', attrs: { class: this.getCssClass(this.classOption.RULE_LEGEND_ACTIONS) } }),
            reasonElement = $lib.element({ container: itemElement, tag: 'span', attrs: { class: this.getCssClass(this.classOption.RULE_LEGEND_REASON) } });

        fieldElement.textContent = field.label;
        actionsElement.textContent = this.#describeActions(ruleCase);
        reasonElement.textContent = this.#describeReason(ruleCase);
    }

    /**
     * Gets the labels of the actions of a rule case, comma separated.
     * @private
     * @param {Object} ruleCase - The rule case.
     * @returns {string} The action labels.
     */
    #describeActions(ruleCase)
    {
        return (ruleCase.actions || []).map(action => this.form.runtimeActions[action.runtimeActionId].label).join(', ');
    }

    /**
     * Gets the reason a rule case applies: its conditions, or its trigger when it has no conditions.
     * @private
     * @param {Object} ruleCase - The rule case.
     * @returns {string} The reason.
     */
    #describeReason(ruleCase)
    {
        if ($lib.isEmpty(ruleCase.ruleGroups))
            return this.labels[`trigger_${ruleCase.trigger || 'always'}`];

        return this.#describeRuleGroups(ruleCase.ruleGroups);
    }

    /**
     * Describes the rule groups of a rule case, combined with their logical operators. Groups are put between brackets when there is more than one.
     * @private
     * @param {Object[]} groups - The rule groups.
     * @returns {string} The description.
     */
    #describeRuleGroups(groups)
    {
        let text = '';

        groups.forEach((group, index) =>
        {
            let groupText = this.#describeRules(group.rules || []);

            if (groups.length > 1)
                groupText = `(${groupText})`;

            if (index > 0)
                text += ` ${this.#getLogicalOperatorLabel(groups[index - 1].logicalOperator)} `;

            text += groupText;
        });

        return text;
    }

    /**
     * Describes the rules of a rule group, combined with their logical operators.
     * @private
     * @param {Object[]} rules - The rules.
     * @returns {string} The description.
     */
    #describeRules(rules)
    {
        let text = '';

        rules.forEach((rule, index) =>
        {
            if (index > 0)
                text += ` ${this.#getLogicalOperatorLabel(rules[index - 1].logicalOperator)} `;

            text += this.#describeRule(rule);
        });

        return text;
    }

    /**
     * Describes a single rule: the source field, the operator and, when the operator uses one, the value.
     * @private
     * @param {Object} rule - The rule.
     * @returns {string} The description.
     */
    #describeRule(rule)
    {
        const source = this.form.getField(rule.sourceId),
            operator = this.labels[`operator_${rule.comparisonOperator}`];

        if (this.form.constructor.RuleUnaryOperators.includes(rule.comparisonOperator))
            return `${source.label} ${operator}`;

        return `${source.label} ${operator} ${this.#formatRuleValue(source, rule.value)}`;
    }

    /**
     * Formats a rule value for display, using the option label instead of the option value when the field has options.
     * @private
     * @param {componyx.UI.Form.Field} field - The source field of the rule.
     * @param {*} value - The rule value, a single value or an array.
     * @returns {string} The formatted value.
     */
    #formatRuleValue(field, value)
    {
        const values = Array.isArray(value) ? value : [value],
            options = field.options || [];

        return values.map(item =>
        {
            const option = options.find(opt => opt.value === item);
            return `"${option ? option.label : item}"`;
        }).join(', ');
    }

    /**
     * Gets the label of a logical operator. AND is used when none is set, the same as the rule engine does.
     * @private
     * @param {string} logicalOperator - The logical operator ('AND' or 'OR').
     * @returns {string} The label.
     */
    #getLogicalOperatorLabel(logicalOperator)
    {
        return this.labels[`operator_${(logicalOperator || 'AND').toLowerCase()}`];
    }
};

export default componyx.UI.form_modules.RuleLegend;