/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.form_modules = componyx.UI.form_modules || {};
componyx.UI.form_modules.ComponentFactory = class ComponentFactory
{
    #classOption;
    constructor(form)
    {
        this.form = form;
        this.InputTypeOption = this.form.constructor.InputTypeOption;
        this.#classOption = form.classOption;
    }

    getComponentType(type)
    {
        return componyx.UI[this.InputTypeOption.getName(type)];
    }

    createElement(id)
    {
        const el = $lib(`#${id}`);

        if (el)
            return el;
        else
            return $lib.element(this.form, '', '', '', '', { id: `${id}` }); // temporary place inside form container, element will be moved into form-field field template
    }

    setAttribute(element, attr, value = '')
    {
        element.setAttribute(attr, value);
    }

    createInput({ type, id, name, value, placeholder, checked, disabled, events, container })
    {
        const el = $lib.element(container, '', type === 'textarea' ? 'textarea' : 'input', '', '', {
            type: type !== 'textarea' ? type : undefined,
            id: id || undefined,
            name,
            value: (!$lib.isEmpty(value)) ? value : undefined,
            placeholder: (!$lib.isEmpty(placeholder)) ? placeholder : undefined,
            checked: checked === true ? true : undefined,
            disabled: disabled === true ? true : undefined
        });

        $lib.each(events, (handler, eventType) =>
        {
            $lib.on(el, eventType, handler);
        });

        return el;
    }

    createTextarea(id, name, value, placeholder, events)
    {
        return this.createInput({ type: 'textarea', id, name, value, placeholder, events });
    }

    createCheckbox(id, name, value, checked, events)
    {
        return this.createInput({ type: 'checkbox', id, name, value, checked, events });
    }

    createRadio(id, name, value, checked, events)
    {
        return this.createInput({ type: 'radio', id, name, value, checked, events });
    }

    createTextInput(id, name, value, placeholder, events)
    {
        return this.createInput({ type: 'text', id, name, value, placeholder, events });
    }

    createHiddenInput(id)
    {
        return this.createInput({ type: 'hidden', container: this.form, id: id });
    }

    createDragHandle(container)
    {
        const dragHandle = $lib.element(container, '', '', '', { "class": this.form.getCssClass(this.#classOption.DRAG_HANDLE) });
        dragHandle.innerHTML = '<b></b><b></b><b></b>';
    }

    createNumericBox(container, id, cloneId, config)
    {
        config.decimalSeparator = this.form.format.decimalSeparator;
        config.groupSeparator = this.form.format.groupSeparator;

        return this.createComponent(container, this.getComponentType(this.InputTypeOption.NUMERICBOX), this.createElement(id).id, cloneId, config);
    }

    createComboBox(container, id, cloneId, config = {}, noResultLabel)
    {
        if (!config.placeholder)
            config.placeholder = this.form.labels.comboBoxDefaultHint;

        const combo = this.createComponent(container, this.getComponentType(this.InputTypeOption.COMBOBOX), this.createElement(id).id, cloneId, config);

        if (noResultLabel)
            combo.setNoResultTemplate(config.noResultLabel);

        return combo;
    }

    createColorButton(container, id, cloneId, config)
    {
        return this.createComponent(container, componyx.UI.ColorButton, this.createElement(id).id, cloneId, config);
    }

    createButton(container, id, cloneId, config)
    {
        return this.createComponent(container, componyx.UI.Button, id, cloneId, {
            ...config,
            transparent: $lib.isEmpty(config.transparent) ? true : config.transparent,
            transparentBorder: $lib.isEmpty(config.transparentBorder) ? true : config.transparentBorder,
            primary: $lib.isEmpty(config.primary) ? false : config.primary,
            hasIcon: !$lib.isEmpty(config.cssClassIcon),
            cssClassIcon: `${this.form.getCssClass(this.#classOption.ICON)} ${config.cssClassIcon}`,
            tooltipManagerId: this.form.tooltipManager.id,
            tooltipId: this.addTooltip(id.replace(`${this.form.id}_`, ''), config),
            command: config.command,
            renderId: false,
        });
    }

    addTooltip(id, config)
    {
        let key = config.key,
            text = config.tooltip || '';

        if (key && !config.tooltip)
            text += ` (Ctrl+${key.toUpperCase()})`;

        if (text)
        {
            this.form.tooltipManager.addTooltip(id, text);
            return id;
        }

        return null;
    }

    createFormField(container, id, cloneId, label, fieldTemplate, config = {}, postRender)
    {
        const formField = this.createComponent(container, componyx.UI.FormField, id, cloneId, {
            ...config,
            wrapFieldContent: (fieldTemplate && fieldTemplate.nodeName === 'INPUT' || fieldTemplate.nodeName === 'TEXTAREA') ? false : true, // no need to wrap direct input fields
            tooltipManagerId: (config.tooltipId) ? this.form.tooltipManager.id : null,
            borderless: false,
            events: {
                onPostRender: (formField) =>
                {
                    if (postRender)
                        postRender(formField);
                }
            },
            _mustRender: false
        });

        formField.setLabelTemplate(label);
        formField.setFieldTemplate(fieldTemplate);

        if (this.form.renderState === $base.static.RenderState.RENDERED)
            formField.render();

        if (this.form.displayMode === this.form.constructor.DisplayModeOption.BUILD)
            formField.element.tabIndex = 0;

        return formField;
    }

    createTooltipManager(container, id, cloneId, config = {})
    {
        const tooltipBox = $UI.createComponent(componyx.UI.Box, {
            id: id + '_TooltipManagerBox',
            containerElement: container,
            cssClass: this.form.getCssClass(this.#classOption.FIELD_TOOLTIP),
            expandDirection: componyx.UI.Box.ExpandDirectionOption.DOWN,
            autoPosition: componyx.UI.Box.AutoPositionOption.EXPAND,
            alignX: componyx.UI.Box.AlignXOption.CENTER,
            autoInvertFit: true
        });

        return this.createComponent(container, componyx.UI.TooltipManager, id, cloneId, { ...config, boxId: tooltipBox.id, _mustRender: false });
    }

    createComponent(container, type, id, cloneId, config = {})
    {
        const component = $UI.createComponent(type, { id: id, containerElement: container });

        component.clone($UI.store[cloneId], this.form);

        const { events, ...restSettings } = config;
        Object.assign(component, Object.fromEntries(Object.entries(restSettings).filter(([k, v]) => v !== undefined))); // don't assign undefined properties

        if (config._disableDataBinding !== true)
        {
            if ((component.hiddenInputId !== undefined && $lib.isEmpty(component.hiddenInputId))
                || (component.inputId !== undefined && $lib.isEmpty(component.hiddenInputId))) // set the setting attribute on the input to enable data binding via the DataBinder
            {
                let hiddenId = `${id}_value`,
                    hiddenInput = $lib(`#${hiddenId}`);

                if (!hiddenInput)
                {
                    hiddenInput = this.createHiddenInput(hiddenId);

                    if (this.form.isBuildMode())
                        this.setAttribute(hiddenInput, 'data-ui-form-setting');
                }

                if (component.hiddenInputId !== undefined)
                    component.hiddenInputId = hiddenInput.id;
                else if (component.inputId !== undefined)
                    component.inputId = hiddenInput.id;
            }
        }

        component.keepInputId = true;
        component.cloneInput = false;
        component.ignoreConnectionCallbacks = true;
        component.showing = (!$lib.isEmpty(config.showing)) ? config.showing : true;

        if (events && typeof events === 'object')
        {
            for (const [eventName, handler] of Object.entries(events))
            {
                if (!eventName || !handler)
                    continue;

                if (component.events?.[eventName]?.priorityAdd)
                {
                    component.events[eventName].priorityAdd(handler);
                }
            }
        }

        component.events.onPostRender.priorityAdd(() => { this.form.isReady(); }, null, true); // Mark form ready after internal postRender events, avoiding global postRender call

        if (this.form.renderState === $base.static.RenderState.RENDERED && config._mustRender !== false)
            component.render();

        return component;
    }

    getComponentConfig(field, allowSelection = true)
    {
        const config = {
            name: field.name,
            value: field.value,
            placeholder: field.placeholder,
            events: {}
        };

        if (field.inputType === this.InputTypeOption.MASKEDTEXTBOX)
        {
            this.configureMaskedTextBox(field, config);
        }
        else if (field.inputType === this.InputTypeOption.NUMERICBOX)
        {
            this.configureNumericBox(field, config);
        }
        else if (field.inputType === this.InputTypeOption.COMBOBOX)
        {
            this.configureComboBox(field, config, allowSelection);
        }
        else if (field.inputType === this.InputTypeOption.DATEPICKER)
        {
            this.configureDatePicker(field, config);
        }
        else if (field.inputType === this.InputTypeOption.TIMEPICKER)
        {
            this.configureTimePicker(field, config);
        }
        else if (field.inputType === this.InputTypeOption.SLIDER)
        {
            this.configureSlider(field, config);
        }
        else if (field.inputType === this.InputTypeOption.FILEUPLOAD)
        {
            this.configureFileUpload(field, config);
        }
        else if (field.inputType === this.InputTypeOption.EDITOR)
        {
            this.configureEditor(field, config);
        }

        return config;
    }

    configureMaskedTextBox(field, config = {})
    {
        const settings = field.componentSettings || {},
            defaults = { allowedCharacters: 0 };

        return this.#configureComponentConfig(settings, config, defaults);
    }

    configureNumericBox(field, config = {})
    {
        const settings = field.componentSettings || {};

        config.decimalSeparator = this.form.format.decimalSeparator;
        config.groupSeparator = this.form.format.groupSeparator;

        return this.#configureComponentConfig(settings, config);
    }

    configureComboBox(field, config = {}, allowSelection = true)
    {
        const settings = field.componentSettings || {};

        this.#configureComponentConfig(settings, config);

        if (field.dataSourceId)
        {
            config.loadOnDemand = true;
            this.configureDataSource(config, field.dataSourceId);
        }
        else if (!$lib.isEmpty(field.options))
        {
            config.itemList = field.options.map(option =>
            {
                this.form.ensureItemId(option);
                return { id: option.id, text: option.label, value: option.value, selected: (allowSelection) ? option.selected : false, disabled: option.disabled };
            });
        }

        if (this.form.isBuildMode())
        {
            config.events = {
                onPostRender: (comboBox) =>
                {
                    this.form.updateFieldOptions(field);
                }
            }
        }

        return config;
    }

    configureDatePicker(field, config = {})
    {
        const settings = field.componentSettings || {};

        config.dateFormat = this.form.format.dateFormat;
        return this.#configureComponentConfig(settings, config);
    }

    configureTimePicker(field, config = {})
    {
        const settings = field.componentSettings || {},
            defaults = { incrementalValue: 5 };
        return this.#configureComponentConfig(settings, config, defaults);
    }

    configureSlider(field, config = {})
    {
        const settings = field.componentSettings || {};

        this.#configureComponentConfig(settings, config);

        if (settings.range)
        {
            const el = $lib.element({ container: this.form, tag: 'input', props: { id: `${field.id}_Range`, type: 'hidden' } }); // we need to create a hidden input for data-binding
            config.rangeHiddenInputId = el.id;
        }

        if (settings.tickMarks)
        {
            config.tickMarkSide = componyx.UI.Slider.TickMarkSideOption.BOTH;
            config.tickMarkValueSide = componyx.UI.Slider.TickMarkSideOption.AFTER;
        }


        return config;
    }

    configureFileUpload(field, config = {})
    {
        const settings = field.componentSettings || {};

        if (field.dataSourceId)
            this.configureDataSource(config, field.dataSourceId);

        return this.#configureComponentConfig(settings, config);
    }

    configureEditor(field, config = {})
    {
        const settings = field.componentSettings || {},
            { visibleCommands, ...otherSettings } = settings,
            commandSettings = visibleCommands || {},
            coreCommands = ['*core'],
            listCommands = ['*list'],
            optionalCommands = [...listCommands, 'block', 'link', 'special'];

        config.visibleCommands = [...coreCommands];

        if (commandSettings.all)
        {
            config.visibleCommands = [...coreCommands, ...optionalCommands];
            ['all', 'list', 'block', 'link', 'special'].forEach(k => delete commandSettings[k]);
        }
        
        for (const [key, value] of Object.entries(commandSettings))
        {
            let cmds = config.visibleCommands;

            if (!value || cmds.includes(`${key}`) || cmds.includes(`*${key}`))
                continue;

            config.visibleCommands.push(key);
        }
        
        this.#configureComponentConfig(otherSettings, config);

        return config;
    }

    configureDataSource(config, dataSourceId)
    {
        let dataSource = this.form.dataSources.find(ds => ds.id === dataSourceId),
            ajaxMethod;

        config.ajax = { customParameters: dataSource.params ?? {} };

        if (dataSource.inputType === this.InputTypeOption.FILEUPLOAD)
            ajaxMethod = config.ajax.upload = {};
        else
            ajaxMethod = config.ajax.load = {};

        ajaxMethod.url = dataSource.url;
        ajaxMethod.absoluteURL = dataSource.absoluteURL || true;
        ajaxMethod.headers = dataSource.headers || null;
        return config;
    }

    #configureComponentConfig(settings, config, defaults = {}) 
    {
        for (const key in settings)
        {
            if (settings[key] !== undefined)
            {
                if (Array.isArray(settings[key]))
                    config[key] = [...settings[key]];
                else if (typeof settings[key] === 'object' && settings[key] !== null)
                    config[key] = { ...settings[key] };
                else
                    config[key] = settings[key];
            }
        }

        for (const key in defaults)
        {
            if (config[key] === undefined && defaults[key] !== undefined)
            {
                config[key] = defaults[key];
            }
        }

        return config;
    }
}

export default componyx.UI.form_modules.ComponentFactory;