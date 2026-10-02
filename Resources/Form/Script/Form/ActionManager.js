/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.form_modules = componyx.UI.form_modules || {};

componyx.UI.form_modules.ActionManager = class ActionManager
{
    constructor(form)
    {
        this.form = form;
        this.cf = form.componentFactory;
        this.expressionEngine = form.expressionEngine;
    }

    registerDefaultActions()
    {
        const actions = [
            {
                id: 'value',
                config: {
                    supportsFieldSet: false,
                    setValue: true,
                    label: this.form.labels.action_value,
                    execute: (action, target) =>
                    {
                        this.form.dataBinder.setModelValue(target, action.value);
                        this.form.ruleEngine.updateRuleDrivenState(target, 'value', action.value);
                        this.updateTarget(target);
                    }
                }
            },
            {
                id: 'expression',
                config: {
                    supportsFieldSet: false,
                    setExpression: true,
                    label: this.form.labels.action_expression,
                    execute: (action, target) =>
                    {
                        const value = this.evaluateExpression(action.expression);
                        this.form.dataBinder.setModelValue(target, value);
                        this.form.ruleEngine.updateRuleDrivenState(target, 'value', value);
                        this.updateTarget(target);
                    }
                }
            },
            {
                id: 'feedback',
                config: {
                    supportsFieldSet: false,
                    setExpression: true,
                    label: this.form.labels.action_feedback,
                    execute: (action, target) =>
                    {
                        const ruleFeedbackEl = target.element.querySelector('.' + this.form.getCssClass(this.form.classOption.RULE_FEEDBACK)),
                            message = this.evaluateExpression(action.expression);

                        ruleFeedbackEl.textContent = message;
                        this.form.ruleEngine.updateRuleDrivenState(target, 'feedback', message);
                    }
                },
            },
            {
                id: 'alert',
                config: {
                    supportsFieldSet: false,
                    setExpression: true,
                    label: this.form.labels.action_alert,
                    execute: (action, target) =>
                    {
                        const id = `${this.form.id}_${action.id}_alert`,
                            dialog = this.cf.createComponent(this.form, componyx.UI.Dialog, this.cf.createElement(id).id, this.form.alertDialogId);

                        dialog.alert(null, this.form.labels.alertDialogHeader, this.evaluateExpression(action.expression));
                    }
                },
            },
            {
                id: 'confirm',
                config: {
                    supportsFieldSet: false,
                    setExpression: true,
                    mustAwait: true,
                    label: this.form.labels.action_confirm,
                    execute: async (action, target) =>
                    {
                        return new Promise(resolve =>
                        {
                            const id = `${this.form.id}_${action.id}_confirm`,
                                dialog = this.cf.createComponent(this.form, componyx.UI.Dialog, this.cf.createElement(id).id, this.form.confirmDialogId);

                            dialog.confirm((dialog, userConfirmed) =>
                            {
                                resolve({ success: !!userConfirmed });
                            }, this.form.labels.confirmDialogHeader, this.evaluateExpression(action.expression));
                        });
                    }
                },
            },
            {
                id: 'hide',
                config: {
                    supportsFieldSet: true,
                    label: this.form.labels.action_hide,
                    execute: (action, target) =>
                    {
                        target.visible = false;
                        this.updateTarget(target);
                    }
                }
            },
            {
                id: 'show',
                config: {
                    supportsFieldSet: true,
                    label: this.form.labels.action_show,
                    execute: (action, target) =>
                    {
                        target.visible = true;
                        this.updateTarget(target);
                    }
                }
            },
            {
                id: 'disable',
                config: {
                    supportsFieldSet: true,
                    label: this.form.labels.action_disable,
                    execute: (action, target) =>
                    {
                        this.toggleDisabledState(action, target, true);
                    }
                }
            },
            {
                id: 'enable',
                config: {
                    supportsFieldSet: true,
                    label: this.form.labels.action_enable,
                    execute: (action, target) =>
                    {
                        this.toggleDisabledState(action, target, false);
                    }
                }
            },
            {
                id: 'required',
                config: {
                    supportsFieldSet: true,
                    label: this.form.labels.action_required,
                    execute: (action, target) =>
                    {
                        const isFieldSet = (target.type === 'FieldSet'),
                            fields = (isFieldSet ? this.form.getFields(target) || [] : [target]);

                        fields.forEach((f) =>
                        {
                            f.required = true;
                            this.form.renderer.updateField(f);
                        });
                    }
                }
            },
            {
                id: 'optional',
                config: {
                    supportsFieldSet: true,
                    label: this.form.labels.action_optional,
                    execute: (action, target) =>
                    {
                        const isFieldSet = (target.type === 'FieldSet'),
                            fields = (isFieldSet ? this.form.getFields(target) || [] : [target]);

                        fields.forEach((f) =>
                        {
                            f.required = false;
                            this.form.renderer.updateField(f);
                        });
                    }
                },
            },
            {
                id: 'readonly',
                config: {
                    supportsFieldSet: false,
                    label: this.form.labels.action_read,
                    execute: (action, target) =>
                    {
                        target.readOnly = true;
                        this.updateTarget(target);
                    }
                }
            },
            {
                id: 'editable',
                config: {
                    supportsFieldSet: false,
                    label: this.form.labels.action_editable,
                    execute: (action, target) =>
                    {
                        target.readOnly = false;
                        this.updateTarget(target);
                    }
                }
            },
            {
                id: 'disable_next',
                config: {
                    supportsFieldSet: false,
                    label: this.form.labels.action_disable_next,
                    execute: (action, target) =>
                    {
                        const button = (!this.form.hasSections() || this.form.isLastSection()) ? this.form.renderer.submitButton : this.form.renderer.nextButton;
                        button?.disable();
                    }
                }
            },
            {
                id: 'enable_next',
                config: {
                    supportsFieldSet: false,
                    label: this.form.labels.action_enable_next,
                    execute: (action, target) =>
                    {
                        const button = (!this.form.hasSections() || this.form.isLastSection()) ? this.form.renderer.submitButton : this.form.renderer.nextButton;
                        button?.enable();
                    }
                }
            },
            {
                id: 'cancel_submit',
                config: {
                    supportsFieldSet: false,
                    label: this.form.labels.action_cancel,
                    execute: (action, target) =>
                    {
                        this.form.submitCanceled = true;
                    }
                }
            },
            {
                id: 'show_section',
                config: {
                    supportsFieldSet: false,
                    setValue: true,
                    label: this.form.labels.action_show_section,
                    execute: (action, target) =>
                    {
                        if (!this.form.hasSections() || !action.value)
                            return;

                        const section = this.form.fieldSets.find((s) => s.id === action.value);

                        if (section)
                            this.form.showSection(section);
                    }
                }
            },
            {
                id: 'end_form',
                config: {
                    supportsFieldSet: false,
                    label: this.form.labels.action_end,
                    execute: (action, target) =>
                    {
                        this.form.ended = true;
                        this.form.events.onEndForm.fire(this.form);
                        return false;
                    }
                }
            }
        ];

        actions.forEach((a) => { this.form.registerAction(a.id, a.config); });
        this.registerApiActions();
    }

    toggleDisabledState(action, target, disabled)
    {
        const opts = target.options || [],
            selectedValues = new Set(action.value || []),
            InputTypeOption = this.form.constructor.InputTypeOption,
            isOptionField = [InputTypeOption.CHECKBOX, InputTypeOption.SWITCH, InputTypeOption.RADIO, InputTypeOption.COMBOBOX].includes(target.inputType);

        if (target.type == 'Field' && isOptionField && selectedValues.size)
        {
            if (selectedValues.size === opts.length)
            {
                target.disabled = disabled;
            }
            else
            {
                opts.forEach(opt =>
                {
                    if (selectedValues.has(opt.value))
                        opt.disabled = disabled;
                });
            }
        }
        else
        {
            target.disabled = disabled;
        }

        this.updateTarget(target);
    }

    updateTarget(target) 
    {
        if (target.type === 'FieldSet')
            this.form.renderer.updateFieldSet(target);
        else
            this.form.renderer.updateField(target);
    }


    registerApiActions()
    {
        this.form.actionEndpoints.forEach(endpoint =>
        {
            this.form.registerAction(`api_${endpoint.id}`,
                {
                    supportsFieldSet: false,
                    mustAwait: true,
                    label: `${endpoint.label}`,
                    execute: async (action, target) =>
                    {
                        const result = await this.form.fetchFromEndpoint(endpoint, { form: this.form, action, target }),
                            formCtor = this.form.constructor;

                        if ($lib.isEmpty(result.actions))
                            return result;

                        const fieldsById = new Map(this.form.getFields().map(f => [f.id, f]));

                        for (const act of result.actions) // API response includes actions
                        {
                            const targetField = fieldsById.get(act.fieldId);

                            await this.form.executeAction(new formCtor.Action({
                                runtimeActionId: act.runtimeActionId,
                                value: act.value
                            }), targetField);
                        }

                        return result;
                    }
                });
        });
    }

    evaluateExpression(expr)
    {
        const fields = this.form.getFields();

        const resolver = (token) =>
        {
            const field = fields.find(f => f.name === token);
            if (!field) return '""';
            const value = this.form.dataBinder.getModelValue(field);
            return (value !== undefined) ? value : null;
        };

        return this.expressionEngine.evaluate(expr)(resolver); // create and execute directly with our field resolver
    }
}

export default componyx.UI.form_modules.ActionManager;