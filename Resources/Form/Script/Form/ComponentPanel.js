/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.form_modules = componyx.UI.form_modules || {};

componyx.UI.form_modules.ComponentPanel = class ComponentPanel
{
    constructor(form, configPanelManager)
    {
        this.form = form;
        this.cf = form.componentFactory;
        this.cpm = configPanelManager;
        this.InputTypeOption = this.cpm.InputTypeOption;
    }

    render(field)
    {
        const panelId = 'ComponentPanel',
            typeName = this.cf.getComponentType(field.inputType).name,
            templateId = `ComponentPanel_${typeName}`,
            customTemplateId = field.panelTemplates?.[panelId],
            panel = this.cpm.panelBar.panels.find(p => p.id === panelId),
            contentEl = panel.contentElement,
            idPrefix = `${this.form.id}_${panelId}_`,
            settings = field.componentSettings || new this.form.constructor.ComponentSettings(),
            namePrefix = 'componentSettings.',
            panelTitle = $lib.format(this.form.labels.componentPanelHeader, this.form.labels[`${typeName.charAt(0).toLowerCase() + typeName.slice(1)}`] || typeName),
            events = this.cpm.createBindingEvents(field),
            createComponent = (type, id, cloneId, value, compSettings = {}, container = this.form) =>
            {
                return this.cf.createComponent(
                    container,
                    componyx.UI[type],
                    this.cf.createElement(`${idPrefix}${id}_input`).id,
                    this.form[cloneId],
                    {
                        ...compSettings,
                        name: (id === 'value') ? id : namePrefix + id,
                        value,
                        events: {
                            ...(compSettings.events || {}),
                            ...events
                        }
                    }
                );
            },
            componentField = (type, id, cloneId, value, compSettings = {}, container) => ({
                id,
                label: this.form.labels[id],
                fieldElement: createComponent(type, id, cloneId, value, compSettings, container).element
            }),
            numericField = (...args) => componentField('NumericBox', ...args),
            maskedField = (...args) => componentField('MaskedTextBox', ...args),
            dateField = (id, cloneId, value, compSettings = {}) =>
            {
                const formattedValue = (!$lib.isEmpty(value)) ? $lib.formatDate($lib.parseDate(value, 'YYYY-MM-DD'), this.form.format.dateFormat) : null;
                return componentField('DatePicker', id, cloneId, formattedValue, { ...compSettings, dateFormat: this.form.format.dateFormat });
            },
            timeField = (...args) => componentField('TimePicker', ...args);


        this.cpm.panelBar.updatePanelTitle(panel, panelTitle);
        this.cpm.panelBar.showPanel(panel);

        let fields = [];
        let customConfigFields = [];
        settings.parent = field;

        switch (field.inputType)
        {
            case this.InputTypeOption.MASKEDTEXTBOX:
                if ($lib.isEmpty(settings.mask)) settings.mask = '____-____';
                if ($lib.isEmpty(settings.allowedCharacters)) settings.allowedCharacters = 0;

                fields = [
                    { id: 'mask', type: 'input', value: settings.mask, config: { tooltipId: this.cf.addTooltip(`${idPrefix}mask_tooltip`, { tooltip: this.form.labels.maskTooltip }) } },
                    maskedField('value', 'valueMaskedTextBoxId', field.value, { mask: settings.mask }),
                    {
                        id: 'allowedCharacters',
                        type: 'radio',
                        options: [
                            { value: 0, label: this.form.labels.allowedCharactersAlphanumeric, checked: settings.allowedCharacters === 0 },
                            { value: 1, label: this.form.labels.allowedCharactersDigits, checked: settings.allowedCharacters === 1 },
                            { value: 2, label: this.form.labels.allowedCharactersLetters, checked: settings.allowedCharacters === 2 }
                        ]
                    }
                ];
                break;

            case this.InputTypeOption.NUMERICBOX:
                settings.precision = (!$lib.isEmpty(settings.precision)) ? parseFloat(settings.precision) : 0;

                fields = [
                    numericField('precision', 'precisionNumericBoxId', settings.precision),
                    numericField('value', 'valueNumericBoxId', field.value, { precision: settings.precision }),
                    numericField('minValue', 'minValueNumericBoxId', settings.minValue, { precision: settings.precision }),
                    numericField('maxValue', 'maxValueNumericBoxId', settings.maxValue, { precision: settings.precision }),
                ];
                break;

            case this.InputTypeOption.COMBOBOX:
                fields = [
                    {
                        id: 'multiSelect', type: 'checkbox', checked: settings.multiSelect, config: { switch: true }, events: {
                            onchange: () =>
                            {
                                field.options?.forEach(opt => { opt.selected = false; });
                                this.cpm.renderOptionsPanel(field);
                            }
                        }
                    },
                    { id: 'multiSelectTagging', type: 'checkbox', checked: settings.multiSelectTagging, config: { switch: true } },
                    { id: 'allowInput', type: 'checkbox', checked: settings.allowInput, config: { switch: true } }
                ];
                break;

            case this.InputTypeOption.DATEPICKER:
                settings.allowedDates = settings.allowedDates || [];
                fields = [
                    { id: 'today', type: 'checkbox', checked: settings.today, config: { switch: true }, events: { onchange: (evt) => { this.cpm.setDisabled(`${idPrefix + typeName}_value_field`, evt.target.checked); } } },
                    dateField('value', 'valueDatePickerId', field.value),
                    dateField('minValue', 'minValueDatePickerId', settings.minValue),
                    dateField('maxValue', 'maxValueDatePickerId', settings.maxValue),
                    { id: 'allowedDates', fieldElement: this.#createAllowedListComponent(this.cf.getComponentType(this.InputTypeOption.DATEPICKER), `${idPrefix}allowedDates_input`, this.form.addAllowedDatePickerId, settings.allowedDates) },
                    { id: 'disallowDates', type: 'checkbox', checked: settings.disallowDates, config: { switch: true } }
                ];
                break;

            case this.InputTypeOption.TIMEPICKER:
                settings.allowedTimes = settings.allowedTimes || [];
                fields = [
                    timeField('value', 'valueTimePickerId', field.value),
                    timeField('minValue', 'minValueTimePickerId', settings.minValue),
                    timeField('maxValue', 'maxValueTimePickerId', settings.maxValue),
                    numericField('incrementalValue', 'incrementalValueNumericBoxId', settings.incrementalValue, { incrementalValue: 5 }),
                    { id: 'allowedTimes', fieldElement: this.#createAllowedListComponent(this.cf.getComponentType(this.InputTypeOption.TIMEPICKER), `${idPrefix}allowedTimes_input`, this.form.addAllowedTimePickerId, settings.allowedTimes) },
                    { id: 'disallowTimes', type: 'checkbox', value: settings.disallowTimes, config: { switch: true } }
                ];
                break;

            case this.InputTypeOption.SLIDER:
                fields = [
                    { id: 'range', type: 'checkbox', checked: settings.range, config: { switch: true } },
                    { id: 'trackSize', type: 'input', value: settings.trackSize },
                    (settings.range) ? numericField('startValue', 'startValueNumericBoxId', settings.startValue) : null,
                    numericField('value', 'valueNumericBoxId', field.value),
                    numericField('minValue', 'minValueNumericBoxId', settings.minValue),
                    numericField('maxValue', 'maxValueNumericBoxId', settings.maxValue),
                    numericField('tickMarks', 'tickMarksNumericBoxId', settings.tickMarks),
                ];
                break;

            case this.InputTypeOption.FILEUPLOAD:
                fields = [
                    { id: 'accept', type: 'input', value: settings.accept || '' },
                    numericField('maxFileSize', 'maxFileSizeNumericBoxId', settings.maxFileSize),
                    numericField('maxFiles', 'maxFilesNumericBoxId', settings.maxFiles),
                    { id: 'dataSourceId', fieldElement: this.cpm.createDataSourceCombo(`${idPrefix}fileUpload_dataSourceId`, this.InputTypeOption.FILEUPLOAD, 'componentSettings.dataSourceId') }
                ];
                break;

            case this.InputTypeOption.EDITOR:

                const visibleCommands = settings.visibleCommands || {};
                const all = visibleCommands.all,
                    config = { switch: true, disabled: all };

                if (all)
                    visibleCommands.list = visibleCommands.block = visibleCommands.link = visibleCommands.special = true;

                fields = [
                    { id: 'all', name: 'visibleCommands.all', type: 'checkbox', checked: all, config: { switch: true } },
                    { id: 'list', name: 'visibleCommands.list', type: 'checkbox', checked: settings.list, config },
                    { id: 'block', name: 'visibleCommands.block', type: 'checkbox', checked: settings.block, config },
                    { id: 'link', name: 'visibleCommands.link', type: 'checkbox', checked: settings.link, config },
                    { id: 'special', name: 'visibleCommands.special', type: 'checkbox', checked: settings.special, config },
                ];
                break;
        }

        if (field.customType)
        {
            const config = this.form.constructor.getCustomType(field.customType);

            if (config)
                customConfigFields = config.configGetter(this.form, field, panelId);
        }

        // Render the panel fields
        this.cpm.renderPanel(field, contentEl, [...fields, ...customConfigFields], customTemplateId || templateId, `${idPrefix + typeName}_`, namePrefix);
        this.cpm.bindProperties(field, contentEl);
    }

    #createAllowedListComponent(componentType, pickerId, cloneId, values)
    {
        const pickerEl = this.cf.createComponent(this.form, componentType, pickerId, cloneId).element,
            container = $lib.element({ content: pickerEl, props: { className: this.cpm.getCssClass(this.cpm.classOption.ALLOWED_LIST) } });

        this.cf.createButton(container, `${pickerId}_add`, this.form.addAllowedItemButtonId, {
            hasIcon: true,
            cssClassIcon: 'ico-plus',
            cssClass: this.cpm.getCssClass(this.cpm.classOption.ADD),
            command: () =>
            {
                const pickerInstance = $UI.store[pickerId],
                    isDatePicker = pickerInstance.constructor.name === 'DatePicker',
                    value = (isDatePicker && !$lib.isEmpty(pickerInstance.getDate())) ? $lib.formatDate(pickerInstance.getDate(), 'YYYY-MM-DD') : pickerInstance.getValue();

                if (!value)
                    return;

                if (!values.includes(value))
                {
                    values.push(value);
                    this.#createAllowedList(container, values, pickerId);
                }
            }
        });

        this.#createAllowedList(container, values, pickerId);
        return container;
    }

    #createAllowedList(container, values, pickerId)
    {
        let ul = container.querySelector('ul'),
            isDatePicker = $UI.store[pickerId].constructor.name === 'DatePicker';

        if (ul)
            ul.innerHTML = '';
        else
            ul = $lib.element({ container: container, tag: 'ul' });

        for (const value of values)
        {
            const li = $lib.element({ container: ul, tag: 'li' });

            $lib.element({ container: li, tag: 'span', content: (isDatePicker) ? $lib.formatDate(this.#parseISODate(value), this.form.format.dateFormat) : value });

            const removeButton = this.cf.createButton(li, `${pickerId}_remove`, this.form.removeAllowedItemButtonId, {
                hasIcon: true,
                cssClassIcon: 'ico-bin',
                cssClass: this.cpm.getCssClass(this.cpm.classOption.REMOVE),
                command: () =>
                {
                    const index = values.findIndex(v => v === value);

                    if (index !== -1)
                        values.splice(index, 1);

                    this.#createAllowedList(container, values, pickerId);
                }
            });

            li.appendChild(removeButton.element);
        }
    }

    #parseISODate(value)
    {
        return $lib.parseDate(value, 'YYYY-MM-DD');
    }
}

export default componyx.UI.form_modules.ComponentPanel;
