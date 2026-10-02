/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

await (async function ()
{
    await import(`${$UI.getScriptResourcePath('Form.ComponentPanel')}`);
    await import(`${$UI.getScriptResourcePath('Form.OptionsPanel')}`);
    await import(`${$UI.getScriptResourcePath('Form.RulesPanel')}`);

    componyx.UI.form_modules = componyx.UI.form_modules || {};
    componyx.UI.form_modules.ConfigPanelManager = class ConfigPanelManger
    {
        #activeFieldSetId;
        #activeFieldId;
        #updateOptionsTimerId;
        constructor(form)
        {
            this.form = form;
            this.cf = form.componentFactory;
            this.draggable = form.draggable;
            this.panelBar = null;
            this.labels = this.form.labels;
            this.InputTypeOption = this.form.constructor.InputTypeOption;
            this.classOption = form.classOption;
            this.getCssClass = form.getCssClass;

            this.expressionEngine = form.expressionEngine;
            this.componentPanel = new componyx.UI.form_modules.ComponentPanel(form, this);
            this.optionsPanel = new componyx.UI.form_modules.OptionsPanel(form, this);
            this.rulesPanel = new componyx.UI.form_modules.RulesPanel(form, this);
        }

        destroy()
        {
            this.rulesPanel.destroy();
        }

        isFieldSetActive(fieldSet)
        {
            return this.#activeFieldSetId === fieldSet.id;
        }

        isFieldActive(field)
        {
            return this.#activeFieldId === field.id;
        }

        setActiveFieldSet(fieldSet)
        {
            this.#activeFieldSetId = fieldSet.id;
        }

        setActiveField(field)
        {
            this.#activeFieldId = field.id;
        }

        clearActive()
        {
            this.#activeFieldSetId = null;
            this.#activeFieldId = null;
            this.form.dataBinder.clearValueHandlers();
        }

        createPanelBar(container, id, cloneId, panels)
        {
            const panelBar = $UI.createComponent(componyx.UI.PanelBar, { id: id, containerElement: container });
            panelBar.clone($UI.store[cloneId], this.form);

            panelBar.events.onPostRender.priorityAdd(() => { this.form.isReady(); }, null, true);
            panelBar.expandOnPointerEnter = false;
            panelBar.showing = true;
            panelBar.panels = panels;
            this.panelBar = panelBar;
        }

        applyPanelTemplate(contentEl, templateId)
        {
            contentEl.innerHTML = '';
            this.form.applyTemplate(contentEl, templateId, this.#getTemplateValues(templateId));
        }

        renderPanel(item, contentEl, fields = [], templateId, idPrefix = '', namePrefix = '')
        {
            this.applyPanelTemplate(contentEl, templateId);

            for (const fieldDef of fields)
            {
                if (!fieldDef) continue;

                let { id, name, label, type, value, options, checked, placeholder, config = {}, events, fieldElement, disableDataBinding } = fieldDef,
                    fullId = `${idPrefix}${id}`,
                    inputId = `${idPrefix}${id}_input`,
                    defaultPlaceholder = this.labels[id + 'Hint'],
                    element, input;

                name = (name) ? name : namePrefix + id;

                if (!(element = $lib(`#${fullId}`)))
                    continue;

                if (!label)
                    label = this.labels[id]; // auto set label

                if (!placeholder && defaultPlaceholder)
                    placeholder = defaultPlaceholder;

                if ($lib.isEmpty(config.labelDisplay) && ' checkbox radio '.indexOf(` ${type} `) == -1)
                {
                    config.labelDisplay = componyx.UI.FormField.LabelDisplayOption.ABOVE;
                }

                if (!type && fieldElement)
                {
                    this.renderComponentField(contentEl, element, label, fieldElement, config);
                    continue;
                }

                if (Array.isArray(options) && options.length > 0)
                {
                    const container = $lib.element({ attrs: { class: this.getCssClass(this.classOption.CONFIG_CHOICE_GROUP) } });
                    for (const opt of options)
                    {
                        inputId = `${fullId}_${opt.value}_input`;
                        input = type === 'radio' ? this.cf.createRadio(inputId, name, opt.value, opt.checked || false, opt.events) : this.cf.createCheckbox(inputId, name, opt.value, opt.checked || false, opt.events);
                        this.cf.createFormField(container, `${fullId}_${opt.value}_field`, '', opt.label || opt.value, input, { ...config, inline: true });

                        if (!disableDataBinding)
                            this.#setSettingAttribute(input);
                    }
                    this.cf.createFormField(contentEl, `${element.id}_field`, '', label, container, config);
                }
                else
                {
                    if (type === 'checkbox' && checked === undefined && item[id] != null)
                        checked = item[id];
                    else if (type !== 'checkbox' && value === undefined && item[id] != null)
                        value = item[id];

                    switch (type)
                    {
                        case 'input':
                            input = this.cf.createTextInput(inputId, name, value, placeholder, events);
                            break;
                        case 'textarea':
                            input = this.cf.createTextarea(inputId, name, value, placeholder, events);
                            break;
                        case 'checkbox':
                            input = this.cf.createCheckbox(inputId, name, value, checked || false, events);
                            break;
                        default:
                            continue;
                    }

                    if (!disableDataBinding)
                        this.#setSettingAttribute(input);

                    this.cf.createFormField(contentEl, `${element.id}_field`, '', label, input, config);
                }
            }
        }

        renderComponentField(contentEl, element, label, fieldElement, config)
        {
            if (!config.events)
                config.events = {};

            config.events.onPostRender = (formField) =>
            {
                const componentId = formField.id.replace(/_field$/, '_input'),
                    component = $UI.store[componentId];

                if (!component)
                    return;

                if (component.renderState === $base.static.RenderState.RENDERED)
                    formField.linkLabelToInput();
                else
                    component.events.onPostRender.priorityAdd(() => { formField.linkLabelToInput(); });
            };

            this.cf.createFormField(contentEl, `${element.id}_field`, '', label, fieldElement, config);
        }

        renderFieldSetPanel(fieldSet)
        {
            const panelId = 'FieldSetPanel',
                templateId = fieldSet.panelTemplates?.[panelId] ?? panelId,
                panel = this.panelBar.panels.find(p => p.id === panelId),
                contentEl = panel.contentElement,
                idPrefix = `${this.form.id}_${panelId}_`,
                events = this.createBindingEvents(fieldSet),
                selectLabelDisplay = (combo, args) => { this.form.setLabelDisplay(fieldSet, args.item.value) },
                parentFieldSet = fieldSet.parent,
                isRepeatable = (parentFieldSet && parentFieldSet.type === 'FieldSet');

            this.renderPanel(fieldSet, contentEl, [
                { id: 'id', label: this.labels.fieldSetId, type: 'input', value: fieldSet.id, disableDataBinding: true, config: { disabled: true } },
                { id: 'layout', label: this.labels.fieldSetLayout, fieldElement: this.#createLayoutCombo(`${idPrefix}layout_input`, events) },
                { id: 'labelDisplay', label: this.labels.fieldLabelDisplay, fieldElement: this.#createLabelDisplayCombo(`${idPrefix}labelDisplay_input`, { onItemSelect: selectLabelDisplay }, true) },
                (isRepeatable) ? { id: 'repeatable', label: this.labels.fieldSetRepeatable, type: 'checkbox', config: { switch: true } } : null,
                (isRepeatable) ? {
                    id: 'maxRepeats', label: this.labels.fieldSetMaxRepeats, fieldElement: this.cf.createNumericBox(this.form, `${idPrefix}maxRepeats_input`, this.form.panelMaxRepeatsNumericBoxId,
                        {
                            name: `maxRepeats`,
                            value: fieldSet.maxRepeats,
                            events
                        }).element
                } : null,
                (isRepeatable) ? { id: 'repeatLabel', label: this.labels.fieldSetRepeatLabel, type: 'input', value: fieldSet.repeatLabel } : null,
                { id: 'tooltip', type: 'textarea' },
                { id: 'lineBreak', type: 'checkbox', config: { switch: true } },
                { id: 'visible', type: 'checkbox', config: { switch: true } },
                { id: 'disabled', type: 'checkbox', config: { switch: true } }
            ], templateId, idPrefix);

            this.bindProperties(fieldSet, contentEl);
        }

        renderFieldTypePanel(field)
        {
            if (field.type === 'ContentField')
                this.renderContentFieldPanel(field);
            else if (field.type === 'SpacerField')
                this.renderSpacerFieldPanel(field);
            else
                this.renderFieldPanel(field);
        }

        renderFieldPanel(field)
        {
            const panelId = 'FieldPanel',
                templateId = field.panelTemplates?.[panelId] ?? panelId,
                panel = this.panelBar.panels.find(p => p.id === panelId),
                contentEl = panel.contentElement,
                idPrefix = `${this.form.id}_${panelId}_`,
                showPlaceholder = (field.inputType <= this.InputTypeOption.TEXTAREA || field.inputType == this.InputTypeOption.COMBOBOX || field.inputType == this.InputTypeOption.NUMERICBOX),
                showValue = (field.inputType <= this.InputTypeOption.TEXTAREA),
                events = this.createBindingEvents(field),
                hasComponentPanel = (field.inputType >= this.InputTypeOption.MASKEDTEXTBOX),
                hasRoles = this.form.fieldRoles?.length > 0;

            let customConfigFields = [];
            let fields = [
                {
                    id: 'name', label: this.labels.fieldName, type: 'input', config: { required: true }, disableDataBinding: true,
                    events: {
                        input: (e) =>
                        {
                            const val = e.target.value,
                                duplicate = this.form.getFields().some(f => f.id !== field.id && f.name === val);

                            if (!val || duplicate)
                                e.target.classList.add('invalid');
                            else
                                e.target.classList.remove('invalid');
                        },
                        blur: (e) =>
                        {
                            const oldName = field.name,
                                val = e.target.value.trim(),
                                duplicate = this.form.getFields().some(f => f.id !== field.id && f.name === val);

                            e.target.classList.remove('invalid');

                            if (!val || duplicate)
                                e.target.value = field.name = field.id; // reset
                            else
                            {
                                field.name = val;

                                this.form.getFields().forEach(f =>
                                {
                                    (f.ruleCases || []).forEach(ruleCase =>
                                    {
                                        (ruleCase.actions || []).forEach(action =>
                                        {
                                            if (action.expression)
                                            {
                                                const found = [];
                   
                                                this.expressionEngine.evaluate(action.expression, (token, startIndex) =>
                                                {
                                                    if (token === oldName)
                                                        found.push({ startIndex, length: token.length });
                                                });

                                                if (found.length > 0)
                                                {
                                                    // Sort found by descending startIndex to avoid messing up indexes during replacements
                                                    found.sort((a, b) => b.startIndex - a.startIndex);

                                                    let expr = action.expression;

                                                    for (const f of found)
                                                    {
                                                        expr = expr.substring(0, f.startIndex) + val + expr.substring(f.startIndex + f.length);
                                                    }

                                                    action.expression = expr;

                                                    if (f.id === field.id)
                                                        this.renderRulesPanel(field);
                                                }
                                            }
                                        });
                                    });
                                });
                            }

                            this.form.autoNameCandidates.delete(field.id);
                            this.form.save();
                        }
                    }
                },
                { id: 'labelDisplay', label: this.labels.fieldLabelDisplay, fieldElement: this.#createLabelDisplayCombo(`${idPrefix}labelDisplay_input`, events) },
                (showPlaceholder) ? { id: 'placeholder', label: this.labels.fieldPlaceholder, type: 'input' } : null,
                { id: 'tooltip', type: 'textarea' },
                (showValue) ? { id: 'value', type: (field.inputType == this.InputTypeOption.TEXTAREA) ? 'textarea' : 'input' } : null,
                (hasRoles) ? { id: 'role', label: this.labels.fieldRole, fieldElement: this.#createFieldRoleCombo(`${idPrefix}fieldRole_input`, field, events), config: { tooltipId: this.cf.addTooltip(`${idPrefix}role_tooltip`, { tooltip: this.labels.fieldRoleTooltip }) } } : null,
                { id: 'width', label: this.labels.fieldWidth, fieldElement: this.#createFieldWidthCombo(`${idPrefix}fieldWidth_input`, field, events), config: { tooltipId: this.cf.addTooltip(`${idPrefix}width_tooltip`, { tooltip: this.labels.fieldWidthTooltip }) } },
                { id: 'required', label: this.labels.validationRequired, type: 'checkbox', config: { switch: true } },
                { id: 'lineBreak', type: 'checkbox', config: { switch: true } },
                { id: 'visible', type: 'checkbox', config: { switch: true } },
                { id: 'disabled', type: 'checkbox', config: { switch: true }, events: { onchange: (evt) => { this.setDisabled(`${idPrefix}readOnly_field`, evt.target.checked); } } },
                (showValue) ? { id: 'readOnly', type: 'checkbox', config: { switch: true } } : null,
            ];

            if (field.customType)
            {
                const config = this.form.constructor.getCustomType(field.customType);

                if (config)
                    customConfigFields = config.configGetter(this.form, field, panelId);
            }

            this.renderPanel(field, contentEl, [...fields, ...customConfigFields], templateId, idPrefix);

            if (hasComponentPanel && this.labels.fieldMoreSettings)
            {
                this.cf.createButton(contentEl, `${idPrefix}_more_settings`, this.moreSettingsButtonId, {
                    hasIcon: false,
                    text: this.labels.fieldMoreSettings,
                    cssClass: this.getCssClass(this.classOption.MORE_SETTINGS),
                    primary: false,
                    command: () => { this.panelBar.expandPanel('ComponentPanel'); }
                });
            }

            this.bindProperties(field, contentEl);
        }

        renderContentFieldPanel(field)
        {
            const panelId = 'ContentFieldPanel',
                templateId = field.panelTemplates?.[panelId] ?? panelId,
                panel = this.panelBar.panels.find(p => p.id === panelId),
                contentEl = panel.contentElement,
                idPrefix = `${this.form.id}_${panelId}_`,
                events = this.createBindingEvents(field),
                colorPickerId = this.form.colorPicker.id;

            this.renderPanel(field, contentEl, [
                { id: 'width', label: this.labels.fieldWidth, fieldElement: this.#createFieldWidthCombo(`${idPrefix}fieldWidth_input`, field, events), config: { tooltipId: this.cf.addTooltip(`${idPrefix}width_tooltip`, { tooltip: this.labels.fieldWidthTooltip }) } },
                { id: 'margin', type: 'input' },
                { id: 'padding', type: 'input' },
                { id: 'borderWidth', fieldElement: this.cf.createNumericBox(this.form, `${idPrefix}borderWidth_input`, this.form.borderWidthNumericBoxId, { name: 'borderWidth', minValue: 0, maxValue: 25, value: field.borderWidth, events }).element },
                { id: 'borderRadius', type: 'input' },
                {
                    id: 'borderColor',
                    fieldElement: this.cf.createColorButton(this.form, `${idPrefix}borderColor_input`, this.form.borderColorButtonId, { colorPickerId, name: 'borderColor', value: field.borderColor, events }).element,
                    config: { labelDisplay: componyx.UI.FormField.LabelDisplayOption.AFTER }
                },
                {
                    id: 'backgroundColor',
                    fieldElement: this.cf.createColorButton(this.form, `${idPrefix}backgroundColor_input`, this.form.backgroundColorButtonId, { colorPickerId, name: 'backgroundColor', value: field.backgroundColor, events }).element,
                    config: { labelDisplay: componyx.UI.FormField.LabelDisplayOption.AFTER }
                },
                { id: 'lineBreak', type: 'checkbox', config: { switch: true } },
                { id: 'visible', type: 'checkbox', config: { switch: true } },
            ], templateId, idPrefix);

            this.bindProperties(field, contentEl);
        }

        renderSpacerFieldPanel(field)
        {
            const panelId = 'SpacerFieldPanel',
                templateId = field.panelTemplates?.[panelId] ?? panelId,
                panel = this.panelBar.panels.find(p => p.id === panelId),
                contentEl = panel.contentElement,
                idPrefix = `${this.form.id}_${panelId}_`;

            this.renderPanel(field, contentEl, [
                { id: 'showDivider', type: 'checkbox', config: { switch: true } },
                { id: 'height', type: 'input' }
            ], templateId, idPrefix);

            this.bindProperties(field, contentEl);
        }

        renderComponentPanel(field)
        {
            this.componentPanel.render(field);
        }

        renderOptionsPanel(field)
        {
            this.optionsPanel.render(field);
        }

        renderValidationPanel(field)
        {
            const panelId = 'ValidationPanel',
                templateId = field.panelTemplates?.[panelId] ?? panelId,
                panel = this.panelBar.panels.find(p => p.id === panelId),
                contentEl = panel.contentElement,
                idPrefix = `${this.form.id}_${panelId}_`,
                namePrefix = 'validationSettings.',
                settings = field.validationSettings || new this.form.constructor.ValidationSettings(),
                events = this.createBindingEvents(field); // bind components 

            if (!settings.compareOperator)
                settings.compareOperator = '==';

            settings.parent = field;

            this.renderPanel(field, contentEl, [
                { id: 'required', label: this.labels.validationRequired, type: 'checkbox', config: { switch: true } },
                { id: 'dataType', name: `${namePrefix}dataType`, label: this.labels.validationDataType, fieldElement: this.#createDataTypeCombo(idPrefix, namePrefix, events) },
                { id: 'length', label: this.labels.validationLength, fieldElement: this.#createLengthField(idPrefix, namePrefix, events) },
                { id: 'range', label: this.labels.validationRange, fieldElement: this.#createRangeField(idPrefix, namePrefix, events) },
                { id: 'pattern', name: `${namePrefix}pattern`, label: this.labels.validationPattern, placeholder: this.labels.validationPatternHint, type: 'textarea' },
                { id: 'compare', label: this.labels.validationCompare, fieldElement: this.#createCompareField(idPrefix, namePrefix, field, events), config: { disabled: this.form.getFields().length <= 1 } },
            ], templateId, idPrefix);

            this.bindProperties(field, contentEl);
        }

        renderRulesPanel(field)
        {
            this.rulesPanel.render(field);
        }

        createBindingEvents(item)
        {
            this.form.dataBinder.cancelUpdate();

            return {
                onPostRender: (component) =>
                {
                    this.form.dataBinder.bindSettingProperties(item, component.element);
                    this.form.dataBinder.updateView(true);
                }
            };
        }

        bindProperties(item, contentEl)
        {
            this.form.dataBinder.bindSettingProperties(item, contentEl);
        }

        setDisabled(ids, disabled = true)
        {
            if (!Array.isArray(ids))
                ids = [ids];

            ids.forEach(id =>
            {
                const formField = $UI.store[id];

                if (!formField)
                    return;

                if (disabled)
                    formField.disable();
                else
                    formField.enable();
            });
        }

        toggleFieldDisplay(idPrefix, id, show)
        {
            const formField = $UI.store[idPrefix + id + '_field'];

            if (show)
                formField.show();
            else
                formField.hide();
        }

        createDataSourceCombo(id, inputType, name, events)
        {
            return this.cf.createComboBox(this.form, id, this.form.dataSourceComboBoxId,
                {
                    name: name,
                    placeholder: this.labels.comboBoxDefaultHint,
                    allowInput: false,
                    itemList: this.form.dataSources
                        .filter(ds => [ds.inputType].flat().includes(inputType))
                        .map(ds => ({ id: ds.id, text: ds.label })),
                    events
                }).element;
        }

        #setSettingAttribute(element)
        {
            element.setAttribute('data-ui-form-setting', '');
        }

        #createLayoutCombo(id, events)
        {
            return this.cf.createComboBox(this.form, id, this.form.layoutComboBoxId, {
                name: 'layout',
                placeholder: this.labels.comboBoxDefaultHint,
                allowInput: false,
                itemList: [{ id: '0', text: this.labels.fieldSetLayoutNone },
                { id: '1', text: this.labels.fieldSetLayoutDefault },
                { id: '2', text: this.labels.fieldSetLayoutBannered }],
                events
            }).element;
        }

        #createLabelDisplayCombo(id, events, isFieldSet = false)
        {
            const itemList = [{ id: '1', value: '3', text: this.labels.fieldLabelDisplayAbove },
            { id: '2', value: '4', text: this.labels.fieldLabelDisplayBefore },
            { id: '3', value: '1', text: this.labels.fieldLabelDisplayFloating },
            { id: '4', value: '2', text: this.labels.fieldLabelDisplayInside }];

            return this.cf.createComboBox(this.form, id, this.form.labelDisplayComboBoxId, {
                name: 'labelDisplay',
                placeholder: this.labels.comboBoxDefaultHint,
                allowInput: false,
                itemList: itemList,
                events,
                _disableDataBinding: isFieldSet
            }).element;
        }

        #createFieldRoleCombo(id, field, events)
        {
            const fields = this.form.getFields(),
                isCompatibleType = (fieldInputType, roleInputType) =>
                {
                    if (!roleInputType) return true;

                    if (Array.isArray(roleInputType))
                        return roleInputType.includes(fieldInputType);

                    return roleInputType === fieldInputType;
                },
                assignedRoles = new Set(fields.filter(f => f.id !== field.id && f.role).map(f => f.role)),
                itemList = this.form.fieldRoles
                    .filter(role =>
                        !assignedRoles.has(role.id) &&
                        isCompatibleType(field.inputType, role.inputType))
                    .map(role => ({ id: role.id, text: role.label }));

            return this.cf.createComboBox(this.form, id, this.form.fieldWidthComboBoxId, {
                name: 'role',
                placeholder: this.labels.comboBoxDefaultHint,
                allowInput: false,
                value: field.role,
                itemList: itemList,
                disabled: !itemList.length,
                events
            }).element;
        }

        #createFieldWidthCombo(id, field, events)
        {
            return this.cf.createComboBox(this.form, id, this.form.fieldWidthComboBoxId, {
                name: 'width',
                placeholder: this.labels.fieldWidthHint,
                allowInput: true,
                allowCustomValue: true,
                value: field.width,
                itemList: [
                    { id: '1', text: this.labels.fieldWidth1PerRow, value: '100%' },
                    { id: '2', text: this.labels.fieldWidth2PerRow, value: '50%' },
                    { id: '3', text: this.labels.fieldWidth3PerRow, value: '33%' },
                    { id: '4', text: this.labels.fieldWidth4PerRow, value: '25%' },
                    { id: '5', text: this.labels.fieldWidthAuto, value: '' }],
                events
            }).element;
        }

        #createDataTypeCombo(idPrefix, namePrefix, events)
        {
            return this.cf.createComboBox(this.form, `${idPrefix}dataType_input`, this.form.dataTypeComboBoxId, {
                name: `${namePrefix}dataType`,
                placeholder: this.labels.comboBoxDefaultHint,
                allowInput: false,
                itemList: [{ id: '0', text: this.labels.validationDataTypeInteger },
                { id: '1', text: this.labels.validationDataTypeFloat },
                { id: '2', text: this.labels.validationDataTypeDateTime },
                { id: '3', text: this.labels.validationDataTypeEmail },
                { id: '4', text: this.labels.validationDataTypeURL },
                { id: '5', text: this.labels.validationDataTypeSource }],
                events
            }).element;
        }

        #createCompareOperatorCombo(id, namePrefix, events)
        {
            return this.cf.createComboBox(this.form, id, this.form.compareOperatorComboBoxId, {
                name: `${namePrefix}compareOperator`,
                cssClass: this.getCssClass(this.classOption.COMBOBOX_VAL_COMPARE_OPERATOR),
                allowInput: false,
                disableClearButton: true,
                itemList: [{ id: '0', value: '==', text: this.labels.operator_equal },
                { id: '1', value: '<', text: this.labels.operator_less_than },
                { id: '2', value: '<=', text: this.labels.operator_less_than_or_equal },
                { id: '3', value: '>=', text: this.labels.operator_greater_than_or_equal },
                { id: '4', value: '>', text: this.labels.operator_greater_than }],
                events
            }).element;
        }

        #createCompareFieldCombo(id, field, namePrefix, events)
        {
            const fields = this.form.getFields(),
                itemList = fields.filter(f => f.id !== field.id).map(f => ({ id: f.id, text: f.name }));

            return this.cf.createComboBox(this.form, id, this.form.compareFieldComboBoxId, {
                name: `${namePrefix}compareFieldId`,
                placeholder: this.labels.comboBoxDefaultHint,
                cssClass: this.getCssClass(this.classOption.COMBOBOX_VAL_COMPARE_FIELD),
                allowInput: false,
                itemList,
                events
            }).element;
        }

        #createLengthField(idPrefix, namePrefix, events)
        {
            const container = $lib.element(),
                minLength = this.cf.createNumericBox(this.form, `${idPrefix}min_length_input`, this.form.minLengthNumericBoxId, { name: namePrefix + 'minLength', placeholder: this.labels.validationMinLengthHint, events }).element,
                maxLength = this.cf.createNumericBox(this.form, `${idPrefix}max_length_input`, this.form.maxLengthNumericBoxId, { name: namePrefix + 'maxLength', placeholder: this.labels.validationMaxLengthHint, events }).element;

            container.appendChild(minLength);
            container.appendChild(maxLength);
            return container;
        }

        #createRangeField(idPrefix, namePrefix, events)
        {
            const container = $lib.element(),
                minRange = this.cf.createNumericBox(this.form, `${idPrefix}min_range_input`, this.form.minRangeNumericBoxId, { name: namePrefix + 'minRange', placeholder: this.labels.validationMinRangeHint, events }).element,
                maxRange = this.cf.createNumericBox(this.form, `${idPrefix}max_range_input`, this.form.maxRangeNumericBoxId, { name: namePrefix + 'maxRange', placeholder: this.labels.validationMaxRangeHint, events }).element;

            container.appendChild(minRange);
            container.appendChild(maxRange);
            return container;
        }

        #createCompareField(idPrefix, namePrefix, field, events)
        {
            const container = $lib.element(),
                compareOperatorEl = this.#createCompareOperatorCombo(`${idPrefix}compare_operator_input`, namePrefix, events),
                compareFieldEl = this.#createCompareFieldCombo(`${idPrefix}compare_field_input`, field, namePrefix, events);

            container.appendChild(compareOperatorEl);
            container.appendChild(compareFieldEl);
            return container;
        }

        #getTemplateValues(templateId)
        {
            let values = {},
                idPrefix = `${this.form.id}_${templateId}_`,
                templateTags = this.form.getTemplateTags(templateId);

            $lib.each(templateTags, (tag) =>
            {
                values[tag] = `<div id="${idPrefix}${tag}"></div>`;
            });

            return values;
        }
    }
})();

export default componyx.UI.form_modules.ConfigPanelManager;
