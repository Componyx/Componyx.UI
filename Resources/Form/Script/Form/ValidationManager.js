/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.form_modules = componyx.UI.form_modules || {};

componyx.UI.form_modules.ValidationManager = class ValidationManager
{
    constructor(form)
    {
        this.form = form;
        this.labels = form.labels;
        this.InputTypeOption = this.form.constructor.InputTypeOption;
        this.TypeOption = componyx.UI.Validator.TypeOption;
        this.operatorLabels = {
            '==': this.labels.operator_equal,
            '!=': this.labels.operator_not_equal,
            '<': this.labels.operator_less_than,
            '<=': this.labels.operator_less_than_or_equal,
            '>=': this.labels.operator_greater_than_or_equal,
            '>': this.labels.operator_greater_than
        };

        this.validator = this.form.componentFactory.createComponent(this, componyx.UI.Validator, this.form.id + '_Validator', this.form.validatorId,
            {
                detectFields: false,
                dateFormat: this.form.format.dateFormat,
                decimalSeparator: this.form.format.decimalSeparator,
                groupSeparator: this.form.format.groupSeparator,
                feedbackIdentifyingCssClass: this.form.getCssClass(this.form.classOption.VALIDATION_FEEDBACK),
                events: {
                    onValid: () =>
                    {
                        if (!this.form.renderNavigationButtons)
                            return;

                        const button = !this.form.hasSections() || this.form.isLastSection() ? this.form.renderer.submitButton : this.form.renderer.nextButton;
                        button.enable();

                    },
                    onInvalid: () =>
                    {
                        if (!this.form.renderNavigationButtons)
                            return;

                        const button = !this.form.hasSections() || this.form.isLastSection() ? this.form.renderer.submitButton : this.form.renderer.nextButton;
                        button.disable();
                    }
                }
            });
    }

    destroy()
    {
        this.validator.destroy();
    }

    /**
     * Adds the field validation rules recursively for all fieldSets and fields.
     * @param {componyx.UI.Form.FieldSet[]} fieldSets The fieldSets for which the validation rules are added.
     * @returns {Boolean} A value indicating if rules were added.
     */
    addRules(fieldSets)
    {
        if (this.form.isBuildMode() || !Array.isArray(fieldSets))
            return;

        this.validator.clear();

        let rulesAdded = false,
            recurse = (sets) =>
            {
                sets.forEach(fs =>
                {
                    let hasRules = false;

                    if (fs.fieldSets?.length)
                        recurse(fs.fieldSets);

                    fs.fields?.forEach(field =>
                    {
                        hasRules = this.addFieldRules(field);

                        if (!rulesAdded && hasRules)
                            rulesAdded = true;
                    });
                });
            };

        recurse(fieldSets);
        return rulesAdded;
    }

    /**
     * Adds the field validation rules for the specified field.
     * @param {componyx.UI.Form.Field} field The field for which the validation rules are added.
     * @returns {Boolean} A value indicating if rules were added.
     */
    addFieldRules(field)
    {
        const dataTypeOption = componyx.UI.Validator.DataTypeOption,
            s = field.validationSettings;
        let hasRules = false;

        if (field.required)
        {
            hasRules = this.updateRequiredRule(field);
        }

        if (!s)
            return hasRules;

        if (s.minRange || s.maxRange)
        {
            hasRules = this.#add(field, this.TypeOption.RANGE, "range", { min: s.minRange, max: s.maxRange });
        }
        if (s.minLength || s.maxLength)
        {
            hasRules = this.#add(field, this.TypeOption.LENGTH, "length", { min: s.minLength, max: s.maxLength });
        }
        if (s.dataType)
        {
            const dataTypeKey = Object.keys(dataTypeOption).find(k => dataTypeOption[k] == s.dataType).toLowerCase();
            hasRules = this.#add(field, this.TypeOption.DATATYPE, dataTypeKey, { dataType: parseInt(s.dataType, 10) });
        }
        if (s.compareFieldId)
        {
            const compareField = this.form.getField(s.compareFieldId),
                operatorText = this.operatorLabels[s.compareOperator] || s.compareOperator;

            hasRules = this.#add(field, this.TypeOption.COMPARE, "compare", {
                fields: [compareField.name],
                operators: [s.compareOperator],
                compareFieldName: compareField.label || compareField.name,
                operatorText: operatorText?.toLowerCase()
            });
        }
        if (s.pattern)
        {
            hasRules = this.#add(field, this.TypeOption.REGEX, "pattern", { pattern: s.pattern });
        }

        return hasRules;
    }

    /**
     * Updates the field required validation rule for the specified field.
     * @param {componyx.UI.Form.Field} field The field for which the validation rule is updated.
     */
    updateRequiredRule(field)
    {
        this.validator.removeRule(field.name, this.TypeOption.REQUIRED);

        if (field.required)
        {
            this.#add(field, this.TypeOption.REQUIRED, "required");
            return true;
        }
        return false;
    }

    #add(field, type, msgKey, props = {})
    {
        const msgTemplate = this.labels[`validatorMessage_${msgKey}`],
            msg = $.format(msgTemplate, {
                field: field.label || field.name,
                min: props.min,
                max: props.max,
                compareField: props.compareFieldName,
                operator: props.operatorText,
                dataType: props.dataType,
                pattern: props.pattern
            }),
            rule = {
                autoValidate: true,
                live: true,
                ...props,
                msg
            };

        if (field.inputType === this.InputTypeOption.EDITOR)
        {
            rule.getValue = (element) =>
            {
                const editor = $UI.store[this.form.getId(field, 'input')];
                return editor.getContent(element);
            };
        }

        this.validator.addRule(field.name, rule, type);
        return true;
    }
};

export default componyx.UI.form_modules.ValidationManager;
