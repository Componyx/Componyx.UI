/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.form_modules = componyx.UI.form_modules || {};
componyx.UI.form_modules.DataBinder = class DataBinder
{
    #updateTimerId;
    #settingName;
    #checkSetting;
    #postDataBind;
    #valueHandlers = [];
    #modelBinderTimerId = null;
    #pendingFieldSets = new Map();

    constructor(form)
    {
        this.form = form;
        this.InputTypeOption = this.form.constructor.InputTypeOption;
        this.#settingName = 'data-ui-form-setting';

        if (this.form.isBuildMode())
        {
            this.#checkSetting = this.checkSetting.bind(this);
            $bindary.onPreDataBind.add(this.#checkSetting);
        }
        else
        {
            this.#postDataBind = this.postDataBind.bind(this);
            $bindary.onPostDataBind.add(this.#postDataBind);
        }
    }

    get valueHandlers()
    {
        return this.#valueHandlers;
    }

    destroy(removeElement)
    {
        $bindary.onPreDataBind.remove(this.#checkSetting);
        $bindary.onPostDataBind.remove(this.#postDataBind);
        this.clearValueHandlers();

        if (removeElement)
            $bindary.removeTemplateItem(this.form);
    }

    clearValueHandlers()
    {
        this.#valueHandlers.forEach((id) =>
        {
            $bindary.unregisterValueHandler(id);
        });
        this.#valueHandlers = [];
    }

    checkSetting(item, el)
    {
        if (el.hasAttribute(this.#settingName))
            this.form.dataObserver.shouldProcessChanges = true; // process changes in data observer
    }

    isMultiValueField(field)
    {
        if (field.inputType === this.InputTypeOption.CHECKBOX || field.inputType === this.InputTypeOption.SWITCH)
            return true;

        if (field.inputType === this.InputTypeOption.COMBOBOX)
            return this.isMultiSelectComboBox(field);

        return false;
    }

    isMultiSelectComboBox(field)
    {
        if (field.componentSettings?.multiSelect)
            return true;

        if (field.inputId && field.renderedEditComponent?.multiSelect) // infer from component, but warn if not explicitly set as it should be
        {
            console.warn(`Form Field "${field.name}" in Form ${this.form.id} inferred as multiSelect from component. Consider setting componentSettings.multiSelect explicitly.`);
            return true;
        }

        return false;
    }

    postDataBind(item, element, model, value)
    {
        if (!this.form.contains(element) || this.form.isBuildMode())
            return;

        const fieldAttr = this.form.fieldAttribute,
            formField = element.closest(`[${fieldAttr}]`),
            fieldId = formField.getAttribute(fieldAttr),
            field = this.form.getField(fieldId);

        if (this.form.bindToCustomModel) // set value on form values object
        {
            this.setModelValue(field, value, false); // don't set on custom model, already set
        }

        this.form.ruleEngine.updateRuleDrivenState(field, 'value', value, true);
        this.form.ruleEngine.applyRules(field);
    }

    /**
     * Initializes the model value for a field.      
     * @param {componyx.UI.Form.Field|componyx.UI.Form.FieldOption} field The field or field option.
     */
    initModelValue(field)
    {
        if (this.form.isBuildMode())
            return;

        const hasOptions =
            field.inputType === this.InputTypeOption.CHECKBOX ||
            field.inputType === this.InputTypeOption.SWITCH ||
            field.inputType === this.InputTypeOption.COMBOBOX ||
            field.inputType === this.InputTypeOption.RADIO,
            isMultiSelectComboBox = field.inputType === this.InputTypeOption.COMBOBOX && this.isMultiSelectComboBox(field);

        if (!hasOptions)
        {
            let value = this.getModelValue(field);

            if ($lib.isEmpty(value))
            {
                if (!$lib.isEmpty(field.value))
                    this.setModelValue(field, field.value);
                else if (!$lib.isEmpty(field.role?.defaultValue))
                    this.setModelValue(field, field.role.defaultValue);
            }

            return;
        }

        let selectedForField = [],
            fieldWasUsed = false;

        for (const option of field.options ?? [])
        {
            const optionHasBinding = !!(option.name || option.bindingKey);

            if (optionHasBinding)
            {
                const optionValue = this.getModelValue(option);

                if (optionValue === undefined && option.selected)
                {
                    this.setModelValue(option, option.value ?? true);
                }
            }
            else
            {
                fieldWasUsed = true;

                if (option.selected)
                    selectedForField.push(option.value);
            }
        }

        if (fieldWasUsed)
        {
            const current = this.getModelValue(field);

            if (current === undefined)
            {
                const value = (field.inputType === this.InputTypeOption.RADIO || (field.inputType === this.InputTypeOption.COMBOBOX && !isMultiSelectComboBox))
                        ? selectedForField[0]
                        : (selectedForField.length ? selectedForField : []);

                this.setModelValue(field, value);
            }
        }
        else if ((field.options ?? []).length === 0 && this.isMultiValueField(field))
        {
            const current = this.getModelValue(field);

            if (current === undefined)
                this.setModelValue(field, []); // init as array so bindary knows it's a multi-value field
        }
    }

    /**
     * Gets the field value from the model.
     * @param {componyx.UI.Form.Field|componyx.UI.Form.FieldOption} field The field or field option.
     */
    getModelValue(field)
    {
        let key = this.getValueBindingKey(field),
            model = this.form.values;

        if (!this.form.isPreviewMode() && this.form.bindToCustomModel && this.form.customModelGetter)
        {
            const customModel = this.form.customModelGetter();

            if (customModel)
                model = customModel;
        }

        return this.#getNestedValue(model, key);
    }

    /**
     * Sets the field value in the model.
     * @param {componyx.UI.Form.Field|componyx.UI.Form.FieldOption} field The field or field option.
     * @param {any} value The value to set in the model.
     * @param {boolean} [syncCustomModel=true] A value indicating whether to also sync the value to the custom model if applicable. 
     */
    setModelValue(field, value, syncCustomModel = true)
    {
        const key = this.getValueBindingKey(field);
        const normValue = this.#normalizeValue(field, value);
        this.#setNestedValue(this.form.values, key, normValue);

        if (syncCustomModel && !this.form.isPreviewMode() && this.form.bindToCustomModel && this.form.customModelGetter)
        {
            const customModel = this.form.customModelGetter();

            if (customModel)
                this.#setNestedValue(customModel, key, normValue);
        }
    }

    getValueBindingKey(item)
    {
        let parent = item.parent,
            key = item.bindingKey || item.name;

        if (!key && parent?.type === 'Field')
            key = parent.bindingKey || parent.name;

        if (parent?.type === 'FieldSet' && parent?.repeatable)
        {
            const fieldSets = parent.parent.fieldSets,
                originalFieldSet = parent.repeatGroupId ? fieldSets.find(f => f.id === parent.repeatGroupId) : parent,
                groupName = originalFieldSet.id;

            // Collect all fieldsets that belong to this repeat group (original + clones)
            const groupFieldSets = fieldSets.filter(fs => fs.id === originalFieldSet.id || fs.repeatGroupId === originalFieldSet.id),
                repeatGroupIndex = groupFieldSets.findIndex((f) => f.id === parent.id),
                index = repeatGroupIndex >= 0 ? repeatGroupIndex : 0;

            return `${groupName}[${index}].${key}`;
        }

        return key;
    }

    #getNestedValue = (obj, path) =>
    {
        const ctx = this.#traversePath(obj, path, false);
        return ctx ? ctx.parent[ctx.lastKey] : undefined;
    }

    #setNestedValue = (obj, path, val) =>
    {
        const ctx = this.#traversePath(obj, path, true);
        if (ctx)
        {
            if (val === undefined)
                delete ctx.parent[ctx.lastKey];
            else
                ctx.parent[ctx.lastKey] = val;
        }
    }

    #normalizeValue(field, value)
    {
        if ((value === null || value === undefined) && field?.inputType !== undefined && this.isMultiValueField(field))
            return [];

        return value;
    }

    bindContext(el)
    {
        let attrContext = `${$bindary.attributePrefix}context`,
            attrKeep = `${$bindary.attributePrefix}keep`,
            attrLive = `${$bindary.attributePrefix}live`;

        if (this.form.isBuildMode())
        {
            el.setAttribute(attrContext, `$UI.store.${this.form.id}`);
            el.setAttribute(attrLive, this.form.settingUpdateDelay); // set live bind delay for setting inputs
            el.setAttribute(attrKeep, `true`); // keep attributes so redetecting template-items will always work
        }
        else if (this.form.isPreviewMode() || !this.form.bindToCustomModel)
            el.setAttribute(attrContext, `$UI.store.${this.form.id}`); // use internal model for field values
    }

    bindSettingProperties(item, container)
    {
        const containers = Array.isArray(container) ? container : [container],
            attr = `[${this.#settingName}]`,
            elements = containers.flatMap(el => Array.from(el.querySelectorAll(`[contenteditable]${attr}, input${attr}, textarea${attr}`)));

        for (const element of elements)
        {
            this.bindProperty(item, element);

            if (element.tagName === 'INPUT')
            {
                if (element.type === 'hidden')
                {
                    this.#registerSettingValueHandler(element, 'date-picker', (id) =>
                    {
                        const component = $UI.store[id],
                            dateValue = component.getISOValue();

                        return dateValue;
                    });
                }

                this.#registerSettingValueHandler(element, 'numeric-box', (id) => $UI.store[id].getNumberValue());
            }
        }
    }

    bindProperty(item, element)
    {
        const bindingKey = this.#getDefinitionBindingKey(item),
            name = element.name || element.dataset.name;

        if (name)
        {
            this.#setBindingAttr(element, `${bindingKey}.${name}`);

            if (element.isContentEditable)
                element.setAttribute(`${$bindary.attributePrefix}live`, 'false'); // disable live bind for content field
        }
    }

    scheduleBindFieldsToModel(fieldSets)
    {
        const setsToAdd = Array.isArray(fieldSets) ? fieldSets : fieldSets ? [fieldSets] : [];

        if (!fieldSets)
        {
            this.#scheduleBinding.call(this);
            return;
        }

        setsToAdd.forEach(fs =>
        {
            if (fs && fs.id)
            {
                this.#pendingFieldSets.set(fs.id, fs);
            }
        });

        this.#scheduleBinding.call(this);
    }

    #scheduleBinding()
    {
        if (!this.#modelBinderTimerId)
        {
            this.#modelBinderTimerId = setTimeout(() =>
            {
                this.#modelBinderTimerId = null;

                const setsToProcess = Array.from(this.#pendingFieldSets.values());
                this.#pendingFieldSets.clear();
                this.bindFieldsToModel(setsToProcess);
            }, 0);
        }
    }

    bindFieldsToModel(fieldSets, initForm)
    {
        const processFieldSets = (sets) =>
        {
            sets.forEach((fieldSet) =>
            {
                if (fieldSet.fields)
                {
                    fieldSet.fields.forEach((field) =>
                    {
                        if (field.autoDataBind === false || !(field.element?.isConnected))
                            return;

                        let bindToCustomModel = this.form.bindToCustomModel,
                            resolveBindingKey = (key) =>
                            {
                                if (this.form.isPreviewMode() || !bindToCustomModel)
                                    key = 'values.' + key;

                                return key;
                            },
                            bindingKey = resolveBindingKey(this.getValueBindingKey(field));

                        if (!this.form.isViewMode())
                        {
                            let editInputs = Array.from(field.editElement.querySelectorAll('input, textarea')),
                                hiddenInputs = editInputs.filter(input => input.type === 'hidden');

                            if (field.inputType === this.InputTypeOption.NUMERICBOX)
                            {
                                const numericBox = $UI.store[this.form.getId(field, 'input')],
                                    input = numericBox.getInput();

                                this.#setBindingAttr(input, bindingKey);
                                this.#registerValueHandler(input, numericBox.id, (id) => $UI.store[id].getNumberValue());

                            }
                            else if (field.inputType === this.InputTypeOption.DATEPICKER)
                            {
                                this.#setBindingAttr(hiddenInputs[0], bindingKey);
                                this.#registerValueHandler(hiddenInputs[0], this.form.getId(field, 'input'), (id) => $UI.store[id].getISOValue());
                            }
                            else if (field.inputType === this.InputTypeOption.EDITOR)
                            {
                                const editor = $UI.store[this.form.getId(field, 'input')],
                                    element = editor.getEditorElement(),
                                    matcher = (item) => { return (element === item.element); }, // could get support for multiple editable-elements bound to one editor, but for now we won't support this
                                    getValue = (element) => { return editor.getContent(); },
                                    setValue = (element, value) => { return editor.setContent(value); };

                                this.#setBindingAttr(element, bindingKey);
                                this.#valueHandlers.push($bindary.registerValueHandler(matcher, getValue, setValue));
                            }
                            else if (field.inputType === this.InputTypeOption.SLIDER)
                            {
                                if (!field.componentSettings?.range)
                                    this.#setBindingAttr(hiddenInputs[0], bindingKey);
                                else
                                    this.#setBindingAttr(hiddenInputs.find(input => input.id === this.form.getId(field, 'input_range')), bindingKey);
                            }
                            else
                            {
                                editInputs.forEach((input, index) =>
                                {
                                    if (input.name.trim() === '' || (field.inputType >= this.InputTypeOption.COMBOBOX && input.type != 'hidden'))  // these components all use a hidden input
                                        return;

                                    if ((field.inputType === this.InputTypeOption.RADIO && $lib.isEmpty(this.getValueBindingKey(field))) || field.inputType === this.InputTypeOption.CHECKBOX || field.inputType === this.InputTypeOption.SWITCH)
                                    {
                                        let option = field.options.find(opt => opt.element === input);
                                        option.parent = field;
                                        bindingKey = resolveBindingKey(this.getValueBindingKey(option));
                                    }

                                    this.#setBindingAttr(input, bindingKey);
                                });
                            }
                        }
                        else
                        {
                            let viewInput;

                            if (field.type === 'ContentField')
                            {
                                viewInput = field.viewElement.querySelector(`.${this.form.getCssClass(this.form.classOption.CONTENT)}`);

                                if (viewInput)
                                    viewInput.setAttribute(`${$bindary.attributePrefix}html`, bindingKey);
                            }
                            else
                            {
                                viewInput = field.viewElement.querySelector(field.viewAsLabel ? `span` : `input, textarea`);
                                if (viewInput)
                                    this.#setBindingAttr(viewInput, bindingKey, true, field);
                            }
                        }

                    });
                }

                if (fieldSet.fieldSets && fieldSet.fieldSets.length > 0)
                {
                    this.bindFieldsToModel(fieldSet.fieldSets);
                }
            });
        }

        if (fieldSets && !Array.isArray(fieldSets))
            fieldSets = [fieldSets];

        if (!fieldSets)
            fieldSets = this.form.fieldSets;

        processFieldSets(fieldSets); // recursively bind elements inside fieldsets
        this.updateView(this.form.hasDataBindRootContext, initForm); // only update from the form if it contains the root context for the data model
    }

    cancelUpdate()
    {
        clearTimeout(this.#updateTimerId);
    }

    updateView(formAsRoot, initForm)
    {
        clearTimeout(this.#updateTimerId);
        this.#updateTimerId = setTimeout(() =>
        {
            let rootItem = $bindary.updateTemplateItem(this.form, true, true); // update form template item with deep and clear

            if (initForm) // after fields are bound and view is updated, run form init once if provided
                $bindary.onPostRender.once(initForm); 

            $bindary.updateView(true, false, (formAsRoot) ? [rootItem] : null);
            this.form.dataObserver.restoreActiveState(); // if state was captured in undo/redo action then this will restore cursor pos on correct element
        }, 0);
    }

    #registerSettingValueHandler(element, wrapperClass, getValueFn)
    {
        const wrapper = element.closest(`.${wrapperClass}`);
        if (!wrapper) return;

        const component = $UI.store[wrapper.id];
        if (!component) return;

        this.#registerValueHandler(element, component.id, getValueFn);
    }

    #registerValueHandler(element, componentId, getValueFn)
    {
        const id = element.id;
        let matcher;

        if ($lib.isEmpty(id))
            matcher = (item) => item.element === element;
        else
            matcher = (item) => item.element.id === id;

        this.#valueHandlers.push($bindary.registerValueHandler(matcher, () => getValueFn(componentId)));
    }

    #traversePath = (obj, path, createMissing = false) =>
    {
        const keys = path.split('.');
        let current = obj;

        for (let index = 0; index < keys.length - 1; index++)
        {
            const key = keys[index];

            if (current[key] == null)
            {
                if (createMissing)
                    current[key] = {};
                else
                    return undefined; // stop if missing
            }
            current = current[key];
            if (typeof current !== 'object') return undefined;
        }

        return { parent: current, lastKey: keys[keys.length - 1] };
    };

    #getDefinitionBindingKey(item)
    {
        const path = [];

        while (item.parent)
        {
            const parent = item.parent,
                type = item.type,
                containerName = type === 'FieldSet' ? 'fieldSets' : 'fields',
                siblings = parent[containerName];

            if (!Array.isArray(siblings))
                break;

            const index = siblings.findIndex(fs => fs.id === item.id);
            if (index === -1)
                break;

            path.unshift(`${containerName}[${index}]`);
            item = parent;
        }

        const rootIndex = this.form.fieldSets.findIndex(fs => fs.id === item.id);
        path.unshift(`fieldSets[${rootIndex}]`);

        return path.join('.');
    }

    #setBindingAttr(el, bindingKey, isView, field)
    {
        let attrSuffix = isView ? 'value' : 'bind',
            attr = `${$bindary.attributePrefix + attrSuffix}`;

        el.setAttribute(attr, bindingKey);

        if (field?.inputType === this.InputTypeOption.DATEPICKER)
            el.setAttribute($bindary.attributePrefix + 'type', 'date');
        else if (field?.inputType === this.InputTypeOption.NUMERICBOX)
        {
            const places = field.componentSettings?.precision,
                typeValue = places != null ? `number(${places})` : 'number';

            el.setAttribute($bindary.attributePrefix + 'type', typeValue);
        }
    }
}

export default componyx.UI.form_modules.DataBinder;