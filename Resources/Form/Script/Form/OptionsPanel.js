/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.form_modules = componyx.UI.form_modules || {};

componyx.UI.form_modules.OptionsPanel = class OptionsPanel
{
    #updateOptionsTimerId;
    constructor(form, configPanelManager)
    {
        this.form = form;
        this.cf = form.componentFactory;
        this.cpm = configPanelManager;
        this.InputTypeOption = this.cpm.InputTypeOption;
    }

    render(field)
    {
        const panelId = 'FieldOptionsPanel',
            templateId = field.panelTemplates?.[panelId] ?? panelId,
            panel = this.cpm.panelBar.panels.find(p => p.id === panelId),
            contentEl = panel.contentElement,
            idPrefix = `${this.form.id}_${panelId}_`,
            hasDataSource = this.form.dataSources.some(ds => [ds.inputType].flat().includes(field.inputType)),
            groups = [
                ['options'],
                ['dataSourceId', 'dataSourcePreview']
            ],
            onChange = () =>
            {
                if ($lib(`#${idPrefix}optionsType_static_input`).checked)
                {
                    this.form.getFields().find(f => f.id === field.id).dataSourceId = null;
                    this.form.dataObserver.shouldProcessChanges = true;
                }

                this.#toggleFieldsDisplay(contentEl, idPrefix, 'optionsType', groups);
            },
            fields = [
                {
                    id: 'optionsType', label: this.form.labels.fieldOptionsType, type: 'radio', name: 'optionsType',
                    config: { cssClass: this.cpm.getCssClass(this.cpm.classOption.FIELD_OPTIONS_TYPE) },
                    options: [
                        { value: 'static', label: this.form.labels.fieldOptionsTypeStatic, checked: $lib.isEmpty(field.dataSourceId), events: { onchange: onChange } },
                        { value: 'dataSource', label: this.form.labels.fieldOptionsTypeDataSource, checked: !$lib.isEmpty(field.dataSourceId), disabled: !hasDataSource, events: { onchange: onChange } }
                    ],
                    disableDataBinding: true
                }
            ],
            previewComboId = `${idPrefix}dataSourcePreview_input`,
            events = this.cpm.createBindingEvents(field);

        if (hasDataSource)
        {
            const showing = !$lib.isEmpty(field.dataSourceId);
            const dataSourceEvents = { ...events };

            fields.push({
                id: 'dataSourceId',
                fieldElement: this.cpm.createDataSourceCombo(`${idPrefix}dataSourceId_input`, field.inputType, 'dataSourceId', dataSourceEvents),
                config: { showing }
            });

            if (field.dataSourcePreview)
            {
                const previewConfig = showing ? this.cf.configureComboBox(field) : { disabled: true };
                fields.push({
                    id: 'dataSourcePreview',
                    fieldElement: this.#createPreviewCombo(previewComboId, field, previewConfig),
                    config: { showing }
                });
            }
        }

        if (field.inputType !== this.InputTypeOption.COMBOBOX)
        {
            fields.push({
                id: 'inlineOptions', label: this.form.labels.fieldInlineOptions, type: 'checkbox',
                events: { onchange: (e) => { this.cpm.toggleFieldDisplay(idPrefix, 'optionWidth', e.target.checked); } },
                config: { switch: true }
            });

            fields.push({
                id: 'optionWidth', label: this.form.labels.fieldOptionWidth,
                fieldElement: this.#createOptionWidthCombo(`${idPrefix}optionWidth`, events),
                config: { showing: field.inlineOptions }
            });
        }

        fields.push({
            id: 'options',
            fieldElement: this.#createOptions(field, panel),
            config: { showing: $lib.isEmpty(field.dataSourceId) }
        });

        this.cpm.renderPanel(field, contentEl, fields, templateId, idPrefix);
        this.cpm.bindProperties(field, contentEl);
    }

    #createOptionWidthCombo(id, events)
    {
        return this.cf.createComboBox(this.form, id, this.form.fieldOptionWidthComboBoxId, {
            name: 'optionWidth',
            placeholder: this.form.labels.comboBoxDefaultHint,
            allowInput: false,
            itemList: [{ id: '0', text: this.form.labels.fieldOptionWidthAuto, value: 'auto' },
            { id: '1', text: this.form.labels.fieldOptionWidth2PerRow, value: '50%' },
            { id: '2', text: this.form.labels.fieldOptionWidth3PerRow, value: '33%' },
            { id: '3', text: this.form.labels.fieldOptionWidth4PerRow, value: '25%' }],
            events
        }).element;
    }

    #createPreviewCombo(id, field, config)
    {
        const comboBox = this.cf.createComboBox(this.form, id, this.form.previewComboBoxId,
            {
                name: 'dataSourcePreview',
                allowInput: false,
                _disableDataBinding: true,
                _mustRender: false,
                multiSelect: field.inputType === this.InputTypeOption.CHECKBOX || field.inputType === this.InputTypeOption.SWITCH || (field.componentSettings && field.componentSettings.multiSelect)
            });

        $lib.clone(comboBox, config, true, true, true, true, true, null);
        comboBox.render();

        return comboBox.element;
    }

    #createOptions(field, panel)
    {
        const isCheckBox = field.inputType === this.InputTypeOption.CHECKBOX || field.inputType === this.InputTypeOption.SWITCH,
            isComboBox = field.inputType === this.InputTypeOption.COMBOBOX,
            multiSelect = isCheckBox || (isComboBox && field.componentSettings && field.componentSettings.multiSelect),
            grid = $lib.element(null, null, 'div', null, '', { className: this.cpm.getCssClass(this.cpm.classOption.FIELD_OPTIONS) }),
            headerRow = $lib.element(grid, null, 'div', null, '', { className: this.cpm.getCssClass(this.cpm.classOption.FIELD_OPTIONS_HEADER) });

        $lib.element(headerRow, null); // empty first cell
        $lib.element(headerRow, null, 'div', this.form.labels.fieldOptionLabelHeader, { title: this.form.labels.fieldOptionLabelHeader });
        $lib.element(headerRow, null, 'div', this.form.labels.fieldOptionValueHeader, { title: this.form.labels.fieldOptionValueHeader });
        $lib.element(headerRow, null, 'div', this.form.labels.fieldOptionSelectedHeader, { title: this.form.labels.fieldOptionSelectedHeader });
        $lib.element(headerRow, null, 'div', this.form.labels.fieldOptionDisabledHeader, { title: this.form.labels.fieldOptionDisabledHeader });
        $lib.element(headerRow, null); // action column

        if (field.options)
        {
            field.options.forEach(option =>
            {
                this.#createOption(grid, field, option, multiSelect, panel);
            });
        }

        this.#createOption(grid, field, new this.form.constructor.FieldOption(), multiSelect, panel);

        grid.addEventListener('input', (e) =>
        {
            if (e.target && e.target.tagName.toLowerCase() === 'input')
            {
                const input = e.target,
                    row = input.closest(`.${this.cpm.getCssClass(this.cpm.classOption.FIELD_OPTIONS_ITEM)}`),
                    option = row._option,
                    inputs = row.querySelectorAll('input'),
                    labelInput = inputs[0],
                    valueInput = inputs[1];

                if (!option) return;

                const isNew = !field.options.some(o => o.id === option.id);

                if (e.target === labelInput)
                    valueInput.value = labelInput.value.trim();

                if (isNew && !input.value.trim()) return;

                this.#saveOption(field, option, row);
            }
        });

        return grid;
    }

    #createOption(container, field, option, multiSelect, panel)
    {
        const isNew = $lib.isEmpty(option.id),
            baseCssClass = this.cpm.getCssClass(this.cpm.classOption.FIELD_OPTIONS_ITEM),
            cssClass = isNew ? `${baseCssClass} ${this.cpm.getCssClass(this.cpm.classOption.FIELD_OPTIONS_ITEM_NEW)}` : baseCssClass,
            isRadio = field.inputType === this.InputTypeOption.RADIO || !multiSelect,
            labelPlaceholder = this.form.labels.newItemPrefix + this.form.labels.fieldOption,
            valuePlaceholder = this.form.labels.newItemPrefix + this.form.labels.fieldOptionValue,
            idPrefix = `${this.form.id}_${panel.id}_`;

        this.form.ensureItemId(option);

        const selectInput = isRadio ? this.cf.createRadio(`${idPrefix}${option.id}_select`, 'selected', '', option.selected) : this.cf.createCheckbox('', 'selected', '', option.selected),
            row = $lib.element({ container, tag: 'div', props: { className: cssClass, "_option": option } });

        $lib.element(row, null); // drag cell
        $lib.element(row, null, 'div', this.cf.createTextInput(`${idPrefix}${option.id}_label`, 'label', option.label, labelPlaceholder));
        $lib.element(row, null, 'div', this.cf.createTextInput(`${idPrefix}${option.id}_value`, 'value', option.value, valuePlaceholder));
        $lib.element(row, null, 'div', selectInput);
        $lib.element(row, null, 'div', this.cf.createCheckbox(`${idPrefix}${option.id}_disable`, 'disabled', '', option.disabled));
        const lastCell = $lib.element(row, null);

        if (!isNew)
        {
            this.#makeDraggable(row, field, option, panel);
            this.#createRemoveButton(row, field, option);
        }
    }

    #addOption(field)
    {
        const panel = this.cpm.panelBar.panels.find(p => p.id === 'FieldOptionsPanel'),
            isCheckBox = field.inputType === this.InputTypeOption.CHECKBOX || field.inputType === this.InputTypeOption.SWITCH,
            isComboBox = field.inputType === this.InputTypeOption.COMBOBOX,
            multiSelect = isCheckBox || (isComboBox && field.componentSettings?.multiSelect),
            container = panel.contentElement.querySelector('.' + this.cpm.getCssClass(this.cpm.classOption.FIELD_OPTIONS));

        this.#createOption(container, field, new this.form.constructor.FieldOption(), multiSelect, panel);
    }

    #saveOption(field, option, row)
    {
        const inputs = row.querySelectorAll('input'),
            index = field.options.findIndex(o => o.id === option.id);

        if (index > -1)
            option = field.options[index];

        this.form.dataObserver.shouldProcessChanges = true;

        if (field.inputType === this.InputTypeOption.RADIO || (field.inputType === this.InputTypeOption.COMBOBOX && !field.componentSettings?.multiSelect))
        {
            const selectionChanged = Array.from(inputs).some(input => input.name === 'selected' && input.checked);

            if (selectionChanged)
                field.options.forEach(opt => { opt.selected = false; });
        }

        inputs.forEach(input =>
        {
            if (input.name === 'label')
                option.label = input.value.trim();
            else if (input.name === 'value')
                option.value = input.value.trim();
            else if (input.name === 'selected')
                option.selected = input.checked;
            else if (input.name === 'disabled')
                option.disabled = input.checked;
        });

        if (!option.label)
            option.label = `${this.form.labels.fieldOption} ${index > -1 ? index : field.options.length}`;

        if (!option.value)
            option.value = this.form.getValidFieldNameFromLabel(option.label);

        if (index == -1)
        {
            field.options.push(option);
            this.#addOption(field);

            $lib.removeClass(row, this.cpm.getCssClass(this.cpm.classOption.FIELD_OPTIONS_ITEM_NEW));
            row.classList.add(this.cpm.getCssClass(this.cpm.classOption.FIELD_OPTIONS_ITEM));
            row._option = option;
            this.#makeDraggable(row, field, option);
            this.#createRemoveButton(row, field, option);
        }

        this.#updateOptions(field);
    }

    #createRemoveButton(row, field, option)
    {
        const idPrefix = `${this.form.id}_FieldOptionsPanel_options_`,
            cells = Array.from(row.children),
            lastCell = cells[5];

        const button = this.cf.createButton(lastCell, `${idPrefix}_${option.id}_remove`, this.form.removeFieldOptionButtonId,
            {
                hasIcon: true,
                cssClassIcon: 'ico-bin',
                cssClass: this.cpm.getCssClass(this.cpm.classOption.REMOVE),
            });

        button.command = this.#removeOption.bind(this, field, option, button);
    }

    #removeOption(field, option, button)
    {
        const index = field.options.findIndex(o => o.id === option.id);
        if (index !== -1)
            field.options.splice(index, 1);

        const row = button.element.closest('.' + this.cpm.getCssClass(this.cpm.classOption.FIELD_OPTIONS_ITEM));
        row.parentElement.removeChild(row);

        this.#updateOptions(field);
    }

    #updateOptions(field)
    {
        clearTimeout(this.#updateOptionsTimerId);
        this.#updateOptionsTimerId = setTimeout(() =>
        {
            this.form.updateFieldOptions(field);
        }, 0);
    }

    #makeDraggable(row, field, option, panel)
    {
        const firstCell = row.querySelector('div');

        if (!panel)
            panel = this.cpm.panelBar.panels.find(p => p.id === 'FieldOptionsPanel');

        this.cf.createDragHandle(firstCell);
        this.cpm.draggable.createDraggableOption({ element: row, field, option, panel });
    }

    #toggleFieldsDisplay(contentEl, idPrefix, name, groups)
    {
        // find which radio (by index) is checked
        const radios = Array.from(contentEl.querySelectorAll(`input[name="${name}"]`)),
            index = radios.findIndex(r => r.checked);

        // hide *all* keys
        groups.flat().forEach(key =>
        {
            $UI.store[`${idPrefix + key}_field`]?.hide();
        });

        // show only the matched group
        (groups[index] || []).forEach(key =>
        {
            $UI.store[`${idPrefix + key}_field`]?.show();
        });
    }
}

export default componyx.UI.form_modules.OptionsPanel;
