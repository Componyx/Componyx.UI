/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.form_modules = componyx.UI.form_modules || {};
componyx.UI.form_modules.Renderer = class Renderer
{
    #header;
    #footer;
    #formPane;
    #contentEditor;
    #valueHandlers = {};
    #tabStripCaret;
    constructor(form)
    {
        this.form = form;
        this.cf = form.componentFactory;
        this.InputTypeOption = form.constructor.InputTypeOption;
        this.classOption = form.classOption;
        this.getCssClass = form.getCssClass;
        this.sectionTabStrip = null;
        this.prevButton = null;
        this.nextButton = null;
        this.submitButton = null;
    }

    get id()
    {
        return this.form.id;
    }

    get labels()
    {
        return this.form.labels;
    }

    get fieldSets() 
    {
        return this.form.fieldSets;
    }

    get formPane()
    {
        return (!this.#formPane) ? this.#formPane = this.form.querySelector('.' + this.getCssClass(this.classOption.FORM_PANE)) : this.#formPane;
    }

    get header()
    {
        return this.#header;
    }

    get footer()
    {
        if (!this.#footer)
            this.#footer = $lib.element({ container: this.formPane.parentElement, tag: 'footer' });

        return this.#footer;
    }

    get saveStatusElement()
    {
        return this.#header.querySelector(`.${this.getCssClass(this.classOption.SAVE_STATUS)}`);
    }

    destroy()
    {
        this.#contentEditor = null;
        this.clearValueHandlers();

        this.sectionTabStrip?.destroy();
        this.prevButton?.destroy();
        this.nextButton?.destroy();
        this.submitButton?.destroy();
    }

    clearValueHandlers()
    {
        if (!this.#valueHandlers) return;

        Object.keys(this.#valueHandlers).forEach(id =>
        {
            $bindary.unregisterValueHandler(this.#valueHandlers[id]);
        });

        this.#valueHandlers = {};
    }

    /**
    * Creates the header.
    */
    createHeader()
    {
        let headerId = 'Header',
            cssClassTitle = this.getCssClass(this.classOption.TITLE),
            cssClassStatus = this.getCssClass(this.classOption.SAVE_STATUS),
            cssClassSpinner = this.getCssClass(this.classOption.SPINNER),
            cssClassSectionSwitch = this.getCssClass(this.classOption.SECTION_SWITCH),
            cssClassCommands = this.getCssClass(this.classOption.COMMANDS),
            values = {
                title: $lib.format('<h1 class="{0}"></h1>', cssClassTitle),
                saveStatus: $lib.format('<div class="{0}"><div class="{1}"></div></div>', cssClassStatus, cssClassSpinner),
                sectionSwitch: (this.form.isBuildMode()) ? $lib.format('<div class="{0}"></div>', cssClassSectionSwitch) : '',
                commands: (this.form.isBuildMode() || this.form.isPreviewMode()) ? $lib.format('<span class="{0}"></span>', cssClassCommands) : '',
            };

        this.#header = $lib.element(this.form, '', 'header');

        if (this.form.hasTemplate(headerId))
            this.form.applyTemplate(this.#header, headerId, values);

        const titleEl = this.#header.querySelector('.' + cssClassTitle),
            sectionSwitchEl = this.#header.querySelector('.' + cssClassSectionSwitch),
            commandsEl = this.#header.querySelector('.' + cssClassCommands),
            statusEl = this.#header.querySelector('.' + cssClassStatus),
            hasSections = this.form.hasSections();

        if (titleEl)
            titleEl.innerHTML = this.labels.headerTitle;

        if (!this.form.isBuildMode() && !this.form.isPreviewMode())
        {
            if (statusEl)
                statusEl.style.display = 'none';

            if ($lib.isEmpty(this.labels.headerTitle))
                this.#header.style.display = 'none';

            return;
        }

        if (sectionSwitchEl)
        {
            const formFieldId = `${this.id}_section_switch`,
                input = this.cf.createCheckbox(`${formFieldId}_input`, '', '', hasSections, { onchange: () => { this.form.toggleSectionMode() } });

            this.cf.createFormField(sectionSwitchEl, formFieldId, this.form.sectionSwitchFormFieldId, this.labels.sectionSwitch, input, { switch: true })
        }

        if (commandsEl)
        {
            const headerCommands = this.form.commands.filter(cmd => cmd.location === this.form.constructor.CommandLocationOption.HEADER);

            $lib.each(headerCommands, (cmd, index) =>
            {
                cmd.id = cmd.id || `${this.id}_command_header_${index}`;
                this.cf.createButton(commandsEl, cmd.id, cmd.buttonId,
                    {
                        ...cmd,
                        shortcutScope: this.form,
                        primary: true,
                        hasIcon: true,
                        disabled: (cmd.isEnabled) ? !cmd.isEnabled() : false,
                        showing: (cmd.isVisible) ? cmd.isVisible() : true
                    });
            });
        }

        if (statusEl)
        {
            statusEl.setAttribute('data-busy', this.labels.saveInProgress);
            statusEl.setAttribute('data-success', this.labels.saveSuccess);
            statusEl.setAttribute('data-failed', this.labels.saveFailed);
            statusEl.style.visibility = 'hidden';
        }

        if (this.form.isBuildMode() && hasSections)
            this.renderSectionTabStrip();
    }

    renderSectionTabStrip(focusTabInput = false)
    {
        const sectionsEl = this.#header.parentNode.querySelector(`:scope > .${this.getCssClass(this.classOption.SECTIONS)}`)
            || $lib.element({
                tag: 'nav',
                container: this.#header.parentNode,
                before: this.#header.nextElementSibling,
                attrs: { class: this.getCssClass(this.classOption.SECTIONS) }
            });

        if (this.sectionTabStrip)
            this.sectionTabStrip.destroy();

        sectionsEl.innerHTML = '';

        if (!this.form.hasSections())
        {
            sectionsEl.remove();
            return;
        }

        const addSectionId = `${this.form.id}_section_add`,
            showRemoveBtn = this.form.fieldSets.length > 1,
            tabItems = this.form.fieldSets.map((section) =>
            {
                const labelInput = this.#createLabelInput(null, section.label, `${section.id}_input`),
                    removeBtn = (showRemoveBtn) ? $lib.element({ tag: 'i', attrs: { class: this.getCssClass(this.classOption.SECTION_REMOVE) } }) : null,
                    tabContent = (showRemoveBtn) ? [labelInput, removeBtn] : labelInput,
                    tabItem = {
                        id: section.id,
                        content: tabContent,
                        selected: section.selected
                    };

                this.form.dataBinder.bindProperty(section, labelInput);

                if (showRemoveBtn)
                {
                    $lib.on(removeBtn, 'click', (e) =>
                    {
                        e.stopPropagation();
                        this.form.removeSection(section);
                    });
                }

                return tabItem;
            }),
            setFocus = () => setTimeout(() =>
            {
                const selectedItem = tabItems.find(item => item.selected),
                    el = selectedItem && $lib(`#${selectedItem.id}_input`);

                if (el)
                {
                    el.focus();

                    if (this.#tabStripCaret && this.#tabStripCaret.id === selectedItem.id)
                        el.setSelectionRange(this.#tabStripCaret.start, this.#tabStripCaret.end);
                }

                this.#tabStripCaret = null;
            }, 0);

        tabItems.push({
            id: addSectionId,
            text: `${this.labels.addItemPrefix}${this.labels.section}`,
            hasIcon: true,
            cssClass: this.getCssClass(this.classOption.SECTION_ADD),
            cssClassIcon: 'ico-plus',
            selected: false
        });

        this.sectionTabStrip = this.cf.createComponent(
            sectionsEl,
            componyx.UI.TabStrip,
            `${this.form.id}_section_tabstrip`,
            this.form.sectionTabStripId,
            {
                itemList: tabItems,
                alignment: componyx.UI.TabStrip.AlignmentOption.TOP,
                events: {
                    onPostRender: (!focusTabInput) ? null : () =>
                    {
                        setFocus();
                    },
                    onItemSelect: (tabStrip, args) =>
                    {
                        if (args.item.id === addSectionId)
                            this.form.addSection();
                        else
                        {
                            const activeEl = document.activeElement,
                                input = $lib(`#${args.item.id}_input`);

                            if (activeEl == input)
                            {
                                this.#tabStripCaret = {
                                    id: args.item.id,
                                    start: activeEl.selectionStart,
                                    end: activeEl.selectionEnd
                                };
                            }

                            this.form.selectSection(this.form.getSection(args.item.id), true);
                        }
                    }
                }
            }
        );
    }

    createStepIndicator(container)
    {
        const stepIndicatorEl = $lib.element({ container, attrs: { class: this.getCssClass(this.classOption.STEP_INDICATOR) } });

        this.form.fieldSets.forEach((s) =>
        {
            const step = $lib.element({ container: stepIndicatorEl, attrs: { id: `${this.form.id}_${s.id}_step`, class: this.getCssClass(this.classOption.STEP) } });
            $lib.element({ container: step, tag: 'span', content: s.label });
        });
    }

    ensurePrevButton()
    {
        if (!this.prevButton)
        {
            this.prevButton = this.cf.createButton(this.footer, `${this.form.id}_section_prev`, this.form.previousSectionButtonId,
                {
                    transparent: false,
                    hasIcon: true,
                    cssClassIcon: 'ico-arrow-l',
                    cssClass: this.getCssClass(this.classOption.SECTION_PREVIOUS),
                    command: this.form.previousSection.bind(this.form),
                    text: this.labels.previous
                }
            );
        }
        return this.prevButton;
    }

    ensureNextButton()
    {
        if (!this.nextButton)
        {
            this.nextButton = this.cf.createButton(this.footer, `${this.form.id}_section_next`, this.form.nextSectionButtonId,
                {
                    transparent: false,
                    hasIcon: true,
                    cssClassIcon: 'ico-arrow-r',
                    iconAlign: componyx.UI.Button.AlignOption.RIGHT,
                    cssClass: this.getCssClass(this.classOption.SECTION_NEXT),
                    command: this.form.nextSection.bind(this.form),
                    text: this.labels.next,
                    disabled: true
                }
            );
        }
        return this.nextButton;
    }

    ensureSubmitButton()
    {
        if (!this.submitButton)
        {
            this.submitButton = this.cf.createButton(this.footer, `${this.form.id}_submit`, this.submitButtonId,
                {
                    transparent: false,
                    primary: true,
                    cssClass: this.getCssClass(this.classOption.SUBMIT),
                    command: this.form.submit.bind(this.form),
                    text: this.labels.submit,
                    disabled: true
                }
            );
        }
        return this.submitButton;
    }

    /**
    * Destroys the section
    * @param {componyx.UI.Form.Section} section The section to destroy.
    */
    destroySection(section)
    {
        if (section.fieldSets)
        {
            section.fieldSets.forEach((fieldSet) =>
            {
                this.destroyFieldSet(fieldSet);
            });
        }

        if (section.element)
            section.element.remove();

        section.element = null;
        this.renderSectionTabStrip();

        this.form.buildPanelManager.scheduleNavigatorUpdate();
    }

    /**
    * Renders the section.
    * @param {componyx.UI.Form.Section} section The section to render.
    */
    renderSection(section)
    {
        const index = this.fieldSets.findIndex(fs => fs.id === section.id),
            nextConnectedEl = this.getNextConnectedElement(this.fieldSets, index);

        this.createSection(section);
        this.formPane.insertBefore(section.element, nextConnectedEl);
        section.fieldSets.forEach(fs => this.renderFieldSet(fs));

        this.form.buildPanelManager.scheduleNavigatorUpdate();
    }

    /**
     * Updates simple settings that don't required a re-render.
     * @param {componyx.UI.Form.Section} section The section to update.
     */
    updateSection(section)
    {
        const input = $lib(`#${section.id}_input`);
        input.value = section.label;

        this.form.buildPanelManager.scheduleNavigatorItemUpdate(section);
    }

    /**
    * Destroys the field-set.
    * @param {componyx.UI.Form.FieldSet} fieldSet The field-set to destroy.
    */
    destroyFieldSet(fieldSet)
    {
        if (!fieldSet.element)
            return;

        if (fieldSet.fieldSets)
        {
            fieldSet.fieldSets.forEach((fieldSet) =>
            {
                this.destroyFieldSet(fieldSet);
            });
        }

        if (!$lib.isEmpty(fieldSet.fields))
        {
            fieldSet.fields.forEach((field) =>
            {
                this.destroyField(field);
            });
        }

        if (fieldSet.element)
            fieldSet.element.remove();

        fieldSet.element = null;
        this.form.removeLineBreak(fieldSet, false);

        this.form.rebindFieldSetLabels();
        this.form.rebindFieldElements();

        if (!this.form.isBuildMode() && fieldSet.parent && fieldSet.parent.type === 'FieldSet' && fieldSet.repeatable)
            this.#ensureRepeatContainer(fieldSet);

        if (this.form.autoDataBindFields && !this.form.isBuildMode())
            this.form.dataBinder.scheduleBindFieldsToModel(fieldSet.parent);

        this.form.buildPanelManager.scheduleNavigatorUpdate();
    }

    /**
    * Renders the field-set.
    * @param {componyx.UI.Form.FieldSet} fieldSet The field-set to render.
    */
    renderFieldSet(fieldSet)
    {
        this.form.ensureItemId(fieldSet);

        const parentFieldSet = fieldSet.parent,
            isSelected = (this.form.selectedFieldSetId === fieldSet.id || fieldSet.selected),
            element = parentFieldSet?.element || this.formPane,
            siblings = parentFieldSet?.fieldSets || this.fieldSets,
            index = siblings.findIndex(fs => fs.id === fieldSet.id),
            nextConnectedEl = this.getNextConnectedElement(siblings, index);

        if (isSelected)
            this.form.deselectFieldSet();

        this.createFieldSet(fieldSet);
        element.insertBefore(fieldSet.element, nextConnectedEl);

        if (fieldSet.lineBreakElement)
            fieldSet.element.parentElement.insertBefore(fieldSet.lineBreakElement, fieldSet.element);

        if (fieldSet.fieldSets)
        {
            fieldSet.fieldSets.forEach(subFieldSet => this.renderFieldSet(subFieldSet));
        }

        if (fieldSet.fields)
        {
            fieldSet.fields.forEach(field => this.renderField(field));
        }

        this.form.rebindFieldSetLabels();
        this.form.rebindFieldElements();

        if (isSelected)
            this.form.selectFieldSet(fieldSet);

        this.form.buildPanelManager.scheduleNavigatorUpdate();
    }

    /**
     * Updates simple field set settings that don't required a re-render.
     * @param {componyx.UI.Form.FieldSet} fieldSet The field-set to update.
     * @param {Boolean} fireEvent A value indicating to fire the update event.
     */
    updateFieldSet(fieldSet, fireEvent = true)
    {
        this.#updateLabel(fieldSet);
        this.#updateFieldSetLayout(fieldSet);
        this.#updateDisabledState(fieldSet);
        this.#updateVisibleState(fieldSet);
        this.#updateLineBreak(fieldSet);
        this.#updateFieldSetTooltip(fieldSet);
        this.#updateRepeatButton(fieldSet);

        if (!this.form.isBuildMode() && fieldSet.parent && fieldSet.parent.type === 'FieldSet' && fieldSet.repeatable)
            this.#ensureRepeatContainer(fieldSet);

        if (fireEvent)
            this.form.events.onUpdateFieldSet.fire(this.form, { fieldSet: fieldSet });

        this.form.buildPanelManager.scheduleNavigatorItemUpdate(fieldSet);

        if (this.form.renderState == $base.static.RenderState.RENDERED && (this.form.isEditMode() || this.form.isPreviewMode()))
            this.form.validationManager.validator.validate(this.form, true);
    }

    /**
     * Renders the field.
     * @param {componyx.UI.Form.Field} field The field to render.
     */
    renderField(field)
    {
        this.form.ensureItemId(field);
        this.destroyField(field);

        const context = this.form.getFieldContext(field),
            isSelected = (this.form.selectedFieldId === field.id || field.selected);

        if (isSelected)
        {
            this.form.deselectFieldSet();
            this.form.deselectField();
        }

        if (!context)
        {
            if (isSelected)
                this.selectFirst();

            return;
        }

        let fieldPane;

        if (context.fieldSet.element?.isConnected)
        {
            fieldPane = $lib(this.getCssClass(this.classOption.FIELD_PANE), context.fieldSet.element, '', true);
            this.createField(field, fieldPane);

            if (!context.isLastField)
            {
                const siblings = context.fieldSet.fields,
                    index = siblings.findIndex(f => f.id === field.id),
                    nextConnectedEl = this.getNextConnectedElement(siblings, index);

                fieldPane.insertBefore(field.element, nextConnectedEl || null);
            }
            else
            {
                fieldPane.appendChild(field.element);
            }

            if (field.lineBreakElement)
                fieldPane.insertBefore(field.lineBreakElement, field.element);
        }
        else // new field set
        {
            fieldPane = this.createFieldSet(context.fieldSet);
            this.createField(field, fieldPane);
        }

        if (this.form.autoDataBindFields && !this.form.isBuildMode())
            this.form.dataBinder.scheduleBindFieldsToModel([field.parent]);

        this.form.rebindFieldElements(field.parent);

        if (isSelected)
            this.form.selectField(field);

        this.form.buildPanelManager.scheduleNavigatorUpdate();
    }

    /**
     * Updates simple field settings that don't required a re-render.
     * @param {componyx.UI.Form.FieldSet} field The field to update.
     * @param {Boolean} fireEvent A value indicating to fire the update event.
     */
    updateField(field, fireEvent = true)
    {
        const formField = $UI.store[field.element.id],
            customConfig = this.form.constructor.getCustomType(field.customType),
            labelDisplay = componyx.UI.FormField.LabelDisplayOption;

        if (!this.form.isViewMode())
        {
            formField.setRequired(field.required || false);
            this.form.validationManager.updateRequiredRule(field);
        }

        this.#ensureLineBreaks(field.parent);
        this.#updateLabel(field);
        this.#updateLineBreak(field);
        this.#updateDisabledState(field);
        this.#updateVisibleState(field);
        this.#updateWidth(field);

        if (!this.form.isViewMode())
            this.#updateFieldTooltip(field);

        if (this.form.isBuildMode())
        {
            formField.setLabelDisplay((field.labelDisplay == labelDisplay.FLOATING || field.labelDisplay == labelDisplay.INSIDE) ? labelDisplay.ABOVE : field.labelDisplay || 0);
            this.#updateFieldIndicators(field);

            if (field.type === 'ContentField')
            {
                this.#updateContentField(field);
            }
            else if (field.type === 'SpacerField')
            {
                this.#updateSpacerFieldSettings(field);
            }
        }
        else
        {
            formField.setLabelDisplay(field.labelDisplay || 0);
            formField.linkLabelToInput();
        }

        if (field.type === 'Field' && !this.form.isViewMode())
        {
            if (customConfig)
            {
                if (customConfig.updater)
                    customConfig.updater(this.form, field);
            }
            else if (field.inputType === this.InputTypeOption.TEXTBOX || field.inputType === this.InputTypeOption.TEXTAREA)
            {
                const value = this.#getFieldValue(field),
                    input = field.editElement.querySelector('input, textarea');

                this.#setInputEditAttributes({ input, name: field.name, value: value, placeholder: field.placeholder, disabled: field.disabled, readOnly: field.readOnly });
            }
            else if (field.inputType >= this.InputTypeOption.MASKEDTEXTBOX) // component
            {
                if (this.form.isBuildMode())
                    this.#updateComponentPlaceholder(field);

                if (!this.form.isBuildMode() || field.inputType != this.InputTypeOption.COMBOBOX) // do not update component value for combo-box when in build-mode (we show only option count)
                {
                    if (this.form.renderState !== $base.static.RenderState.RENDERED)
                        this.form.classList.remove('hidden'); // temporarily make form visible for value calculation based on width (e.g. slider handle position)

                    this.#updateComponentValue(field);

                    if (this.form.renderState !== $base.static.RenderState.RENDERED)
                        this.form.classList.add('hidden');
                }
            }
        }

        if (this.form.renderState == $base.static.RenderState.RENDERED && (this.form.isEditMode() || this.form.isPreviewMode()))
            this.form.validationManager.validator.validate(this.form, true);

        if (fireEvent)
            this.form.events.onUpdateField.fire(this.form, { field: field });

        this.form.buildPanelManager.scheduleNavigatorItemUpdate(field);
    }

    /**
     * Updates the field with new options for build mode view.
     * @param {componyx.UI.Form.FieldSet} field The field to update.
     */
    updateFieldOptions(field)
    {
        if (!field.editElement || !this.form.isBuildMode())
            return;

        if (field.inputType == this.InputTypeOption.COMBOBOX)
        {
            this.#updateComponentPlaceholder(field);
        }
        else
        {
            field.editElement.innerHTML = '';
            this.#createFieldOptions(field, field.editElement);
            this.#addFeedbackElement(field);
        }
    }

    /**
    * Destroys the field.
    * @param {componyx.UI.Form.Field} field The field to destroy.
    */
    destroyField(field)
    {
        const fieldId = `${this.id}_${field.id}`;

        if (!field.element || !$UI.store[fieldId])
            return;

        if (field.type === 'ContentField' && this.#contentEditor)
        {
            const contentId = this.form.getId(field, 'content'),
                index = this.#contentEditor.editableElements.findIndex(item => item.id === contentId);

            if (index !== -1)
            {
                this.#contentEditor.editableElements.splice(index, 1);
                if (this.#valueHandlers[contentId])
                {
                    $bindary.unregisterValueHandler(this.#valueHandlers[contentId]);
                    delete this.#valueHandlers[contentId];
                }
            }

        }

        $lib.each(field.options, function (option, index)
        {
            if ($UI.store[`${fieldId}_${index}`])
                $UI.store[`${fieldId}_${index}`].destroy();

            option.element = null;
        });

        if (field.inputType > this.InputTypeOption.SWITCH)
            $UI.store[fieldId + '_input'].destroy();

        $UI.store[fieldId].destroy();
        field.element = field.editElement = field.viewElement = null;
        this.form.removeLineBreak(field, false);
        this.form.rebindFieldElements(field.parent);

        this.form.buildPanelManager.scheduleNavigatorItemUpdate(field, true);
    }

    /**
     * Returns the next sibling element in the array that is connected to the DOM. Useful for determining where to insert a new element in a reliable position.
     * @param {Array} siblings - Array of sibling fieldSets or fields.
     * @param {number} startIndex - The index to start searching from.
     * @returns {HTMLElement|null} The next connected element or null if none found.
     */
    getNextConnectedElement(siblings, startIndex)
    {
        for (let index = startIndex + 1; index < siblings.length; index++)
        {
            const candidate = siblings[index];
            const el = candidate.lineBreakElement || candidate.element;
            if (el?.isConnected)
                return el;
        }
        return null;
    }

    createSection(section)
    {
        if ($lib.isEmpty(section.id))
            this.form.ensureItemId(section);

        let element = section.element,
            id = section.id,
            headerTemplateId = `SectionHeader_${id}`,
            footerTemplateId = `SectionFooter_${id}`;

        if (element)
        {
            element.innerHTML = '';
        }
        else
        {
            element = $lib.element(this.formPane, '', 'section');
            element.id = `${this.id}_${section.id}`;
        }

        section.element = element;
        this.#updateClassAndStyle(section);

        if (!this.form.hasTemplate(headerTemplateId) && section.headerTemplate)
            this.form.addTemplate(headerTemplateId, section.headerTemplate);

        if (!this.form.hasTemplate(footerTemplateId) && section.footerTemplate)
            this.form.addTemplate(footerTemplateId, section.footerTemplate);

        if (this.form.hasTemplate(headerTemplateId))
            this.form.applyTemplate($lib.element(element, '', 'header'), headerTemplateId, section);

        if (this.form.hasTemplate(footerTemplateId))
            this.form.applyTemplate($lib.element(element, '', 'footer'), footerTemplateId, section);

        return section.element;
    }


    createFieldSet(fieldSet)
    {
        this.form.ensureItemId(fieldSet);

        let id = fieldSet.id,
            element = fieldSet.element,
            fieldPane,
            headerTemplateId = `Header_${id}`,
            footerTemplateId = `Footer_${id}`,
            parentEl = fieldSet.parent?.element || this.formPane,
            footerEl = parentEl.querySelector('footer'),
            siblings = fieldSet.parent?.fieldSets || this.fieldSets,
            index = siblings.findIndex(fs => fs.id === fieldSet.id),
            hasTooltip = !$lib.isEmpty(fieldSet.tooltip);

        if (!element || !element.isConnected) // if element does not exist or is no longer connected, we recreate it
        {
            element = $lib.element({ tag: 'fieldset', props: { id: `${this.id}_${id}` } });
            const nextConnectedEl = this.getNextConnectedElement(siblings, index);

            parentEl.insertBefore(element, nextConnectedEl || footerEl);
            fieldSet.element = element;
            fieldPane = $lib.element({ attrs: { "class": this.getCssClass(this.classOption.FIELD_PANE) } });
        }
        else
        {
            fieldPane = $lib(this.getCssClass(this.classOption.FIELD_PANE), element, '', true);
            element.innerHTML = '';
            element.className = '';
        }

        fieldPane.setAttribute('data-placeholder', this.labels.fieldPaneEmptyHint);

        const legend = $lib.element(element, '', 'legend', (!this.form.isBuildMode()) ? [fieldSet.label] : '');

        if (this.form.isBuildMode())
        {
            this.#createLabelInput(legend, fieldSet.label);
            $lib.on(legend, 'click', () => { legend.querySelector('input').focus(); });
        }

        if (this.form.isBuildMode() || hasTooltip)
            $lib.element({ container: legend, tag: 'i', attrs: { "class": this.getCssClass(this.classOption.ICON) + ' ' + this.getCssClass(this.classOption.TOOLTIP_ICON) } });

        if (!this.form.isBuildMode() && !hasTooltip && $lib.isEmpty(fieldSet.label))
            legend.style.display = 'none';

        if (!this.form.hasTemplate(headerTemplateId) && fieldSet.headerTemplate)
            this.form.addTemplate(headerTemplateId, fieldSet.headerTemplate);

        if (!this.form.hasTemplate(footerTemplateId) && fieldSet.footerTemplate)
            this.form.addTemplate(footerTemplateId, fieldSet.footerTemplate);

        if (this.form.hasTemplate(headerTemplateId))
            this.form.applyTemplate($lib.element(element, '', 'header'), headerTemplateId, fieldSet);

        element.appendChild(fieldPane); // field-pane comes before footer

        if (this.form.hasTemplate(footerTemplateId))
        {
            $lib.element(element, '', 'p', '', { "class": this.getCssClass(this.classOption.FILLER) });
            this.form.applyTemplate($lib.element(element, '', 'footer'), footerTemplateId, fieldSet);
        }

        if (this.form.isBuildMode())
        {
            this.#createBuildView(fieldSet);
        }

        this.updateFieldSet(fieldSet, false);
        this.form.events.onRenderFieldSet.fire(this, { fieldSet: fieldSet });

        return fieldPane;
    }

    createField(field, container)
    {
        this.form.ensureItemId(field);

        let showLabel = !this.form.isBuildMode() && field.hideLabel !== true && field.type !== 'ContentField' && field.type !== 'SpacerField',
            labelEl = (showLabel) ? $lib.element({ tag: 'span', content: field.label }) : '',
            formField = this.cf.createFormField(container, this.id + '_' + field.id, field.formFieldId, (showLabel) ? [labelEl] : '', this.#createFieldTemplate(field),
                {
                    inline: false,
                    borderless: false,
                    cssClass: field.cssClass,
                    style: field.style,
                    required: (!this.form.isViewMode()) ? field.required : false,
                    labelDisplay: (!$lib.isEmpty(field.labelDisplay)) ? field.labelDisplay : (!$lib.isEmpty(this.form.labelDisplay)) ? this.form.labelDisplay : undefined
                }, this.#formFieldPostRender.bind(this, field));

        field.element = formField.element;
    }

    updateLabel(item)
    {
        this.#updateLabel(item);
    }

    #createLabelInput(element, label, id)
    {
        return $lib.element({
            container: element, tag: 'input',
            attrs: { "data-ui-form-setting": '' },
            props: { id: id, type: 'text', name: 'label', value: label, placeholder: this.labels.labelPlaceholder }
        });
    }

    #updateFieldSetLayout(fieldSet)
    {
        const el = fieldSet.element,
            cl = el.classList,
            layout = ($lib.isEmpty(fieldSet.layout)) ? 0 : parseFloat(fieldSet.layout),
            fieldSetLayoutOption = this.form.constructor.FieldSetLayoutOption;

        cl.remove(this.getCssClass(this.classOption.LAYOUTLESS), this.getCssClass(this.classOption.BANNERED));

        if (layout === fieldSetLayoutOption.NONE)
            el.classList.add(this.getCssClass(this.classOption.LAYOUTLESS));
        else if (layout === fieldSetLayoutOption.BANNERED)
            el.classList.add(this.getCssClass(this.classOption.BANNERED));
    }

    #updateClassAndStyle(item)
    {
        const el = item.element;

        if (item.cssClass)
            el.className = item.cssClass;
        else
            el.removeAttribute('class');

        if (item.style)
            el.style = item.style;
        else
            el.removeAttribute('style');
    }

    #createFieldTemplate(field)
    {
        let content = $lib.element();

        if (this.form.isViewMode())
        {
            let viewEl = $lib.element(content);

            viewEl.className = this.getCssClass(this.classOption.VIEW_FIELD);
            field.viewElement = viewEl;
        }
        else
        {
            let editEl = $lib.element(content);

            editEl.className = this.getCssClass(this.classOption.EDIT_FIELD);
            field.editElement = editEl;
        }

        if (this.form.isBuildMode() && field.type !== 'ContentField')
            content.inert = true;

        return content;
    }

    #createViewTemplate(field, element, callback)
    {
        let templateId = field.viewTemplateId || 'View_' + field.id,
            fireCallback = true;

        if (!this.form.hasTemplate(templateId) && field.viewTemplate)
            this.form.addTemplate(templateId, field.viewTemplate);

        if (this.form.hasTemplate(templateId))
        {
            this.form.applyTemplate(element, templateId, field);
        }
        else if (field.type === 'ContentField')
        {
            this.#renderContentField(field);
        }
        else if (field.type === 'SpacerField')
        {
            this.#renderSpacerField(field);
        }
        else if (field.customType)
        {
            const customConfig = this.form.constructor.getCustomType(field.customType);

            if (customConfig && customConfig.renderer)
            {
                customConfig.renderer(this.form, field, element, true, callback);
                fireCallback = false;
            }
            else
            {
                let value = (customConfig.getter) ? customConfig.getter(field) : field.value;
                let view = $lib.element(element, '', 'span');
                view.textContent = value;
                view.classList.add(this.getCssClass(this.classOption.READONLY));
            }
        }
        else
        {
            let tag = (field.viewAsLabel) ? 'span' : 'input',
                view;

            if (field.inputType === this.InputTypeOption.TEXTAREA || field.inputType === this.InputTypeOption.EDITOR)
                tag = 'textarea';

            if (field.viewElementId)
            {
                view = element.appendChild(this.form.getSourceElement(field.viewElementId));
                tag = view.nodeName.toLowerCase();
            }
            else
            {
                view = $lib.element(element, '', tag);

                if (!field.viewAsLabel && tag == 'input')
                    view.type = "text";
            }

            view.textContent = field.value;
            view.classList.add(this.getCssClass(this.classOption.READONLY));

            if (tag == 'input' || tag == 'textarea')
            {
                view.readOnly = true;
                view.name = field.name || '';
                view.placeholder = field.placeholder || '';
            }

            if (!$lib.isEmpty(field.width))
                view.width = $lib.unit(field.width);
        }

        this.form.events.onRenderViewTemplate.fire(this.form, { field: field });

        if (fireCallback)
            callback();
    }

    #createEditTemplate(field, element, callback)
    {
        let templateId = field.editTemplateId || 'Edit_' + field.id,
            fireCallback = true;

        if (!this.form.hasTemplate(templateId) && field.editTemplate)
            this.form.addTemplate(templateId, field.editTemplate);

        if (this.form.hasTemplate(templateId))
            this.form.applyTemplate(element, templateId, field);
        else if (field.type === 'ContentField')
        {
            if (this.form.isBuildMode())
            {
                this.#renderContentBuildField(field, callback);
                fireCallback = false;
            }
            else
                this.#renderContentField(field);
        }
        else if (field.type === 'SpacerField')
        {
            this.#renderSpacerField(field);
        }
        else
        {
            const customConfig = this.form.constructor.getCustomType(field.customType);

            if (customConfig)
            {
                if (customConfig.renderer)
                    field.renderedEditComponent = customConfig.renderer(this.form, field, element, false, callback);

                fireCallback = false;
            }
            else if (field.inputType <= this.InputTypeOption.TEXTAREA) // textbox/textarea
                field.renderedEditComponent = this.#createTextBox(field, element);
            else if (field.inputType <= this.InputTypeOption.SWITCH) // radio/checkbox
            {
                fireCallback = false;
                this.#createFieldOptions(field, element, callback);
            }
            else
            {
                let config = this.cf.getComponentConfig(field, !this.form.isBuildMode());
                config.events.onPostRender = callback;
                fireCallback = false;
                field.renderedEditComponent = this.cf.createComponent(element, this.cf.getComponentType(field.inputType), this.form.getId(field, 'input'), field.inputId, config);
            }

            this.#addFeedbackElement(field);
        }

        this.form.events.onRenderEditTemplate.fire(this.form, { field: field });

        if (fireCallback)
            callback();
    }

    #addFeedbackElement(field)
    {
        if (!this.form.isBuildMode())
        {
            const feedbackEl = $lib.element({ container: field.editElement, attrs: { class: this.getCssClass(this.classOption.FEEDBACK) } });

            $lib.element({ container: feedbackEl, tag: 'span', attrs: { class: this.getCssClass(this.classOption.RULE_FEEDBACK) } });
            $lib.element({ container: feedbackEl, attrs: { class: this.getCssClass(this.classOption.VALIDATION_FEEDBACK) } });
        }
    }

    #renderContentBuildField(field, callback)
    {
        const contentFieldEl = this.#createContentFieldElement(field),
            doc = this.form.ownerDocument || document,
            wrappedCallback = (editor) =>
            {
                const matcher = (item) => contentFieldEl.id === item.element.id,
                    getValue = (element) =>
                    {
                        return this.#contentEditor.getValue(element);
                    };

                if (this.#valueHandlers[contentFieldEl.id])
                    $bindary.unregisterValueHandler(this.#valueHandlers[contentFieldEl.id]);

                this.#valueHandlers[contentFieldEl.id] = $bindary.registerValueHandler(matcher, getValue);
                this.form.dataBinder.updateView(true);

                if (callback)
                    callback();
            };

        contentFieldEl.id = this.form.getId(field, 'content');
        contentFieldEl.dataset.name = 'value';
        this.form.dataBinder.bindProperty(field, contentFieldEl); // bind to field value

        if (!this.#contentEditor)
        {
            const config = {
                ...field.componentSettings,
                editableElements: [{ element: contentFieldEl }],
                events: { onPostRender: wrappedCallback }
            };

            this.#contentEditor = this.cf.createComponent(this.form, componyx.UI.Editor, `${this.form.id}_content_field_editor`, this.form.contentFieldEditorId, config);
        }
        else
        {
            this.#contentEditor.addEditableElement({ element: contentFieldEl });
            wrappedCallback();
        }
    }

    #renderContentField(field)
    {
        const contentFieldEl = this.#createContentFieldElement(field);
        contentFieldEl.innerHTML = (field.trustHTML) ? field.value : this.sanitizer ? this.form.sanitizer(field.value) : this.form.getSanitizer().sanitize(field.value);
    }

    #createContentFieldElement(field)
    {
        const rootElement = (this.form.isViewMode()) ? field.viewElement : field.editElement,
            contentFieldEl = $lib.element({ container: rootElement, attrs: { class: this.getCssClass(this.classOption.CONTENT) } });

        this.#updateContentFieldSettings(field);

        if (!this.form.isViewMode())
            contentFieldEl.contentEditable = true;

        return contentFieldEl;
    }

    #updateContentFieldSettings(field)
    {
        const rootElement = (this.form.isViewMode()) ? field.viewElement : field.editElement,
            contentFieldEl = rootElement.querySelector(`:scope > .${this.getCssClass(this.classOption.CONTENT)}`),
            style = contentFieldEl.style;

        const styleMap = [
            { prop: 'margin', unit: true },
            { prop: 'padding', unit: true },
            { prop: 'borderWidth', unit: true },
            { prop: 'borderColor', rgba: true },
            { prop: 'borderRadius', unit: true },
            { prop: 'backgroundColor', rgba: true }
        ];

        for (const { prop, unit, rgba } of styleMap)
        {
            if (!$lib.isEmpty(field[prop]) && field[prop] != '0')
                style[prop] = unit ? $lib.unit(field[prop]) : rgba ? `rgba(${field[prop]})` : field[prop];
            else
                style.removeProperty(prop);
        }
    }

    #renderSpacerField(field)
    {
        const rootElement = (this.form.isViewMode()) ? field.viewElement : field.editElement,
            spacerEl = $lib.element({ container: rootElement, attrs: { class: this.getCssClass(this.classOption.SPACER) } });

        this.#updateSpacerFieldSettings(field);

        return spacerEl;
    }

    #updateSpacerFieldSettings(field)
    {
        const rootElement = (this.form.isViewMode()) ? field.viewElement : field.editElement,
            spacerEl = rootElement.querySelector(`:scope > .${this.getCssClass(this.classOption.SPACER)}`),
            divider = this.getCssClass(this.classOption.DIVIDER);

        if (field.height)
            spacerEl.style.height = $lib.unit(field.height);
        else
            spacerEl.style.removeProperty('height');

        if (field.showDivider)
            spacerEl.classList.add(divider);
        else
            spacerEl.classList.remove(divider);
    }

    #createTextBox(field, element)
    {
        if (field.inputId)
            return element.appendChild(this.form.getSourceElement(field.inputId));
        else
            return this.cf.createInput({ type: (field.inputType == this.InputTypeOption.TEXTAREA) ? 'textarea' : 'text', container: element });
    }

    #createFieldOptions(field, container, callback = () => { })
    {
        const useRowBasedOptions = (field.inlineOptions && (!$lib.isEmpty(field.optionWidth) && field.optionWidth != 'auto')),
            createEmpty = () => { $lib.element({ container: container, content: this.labels.addItemPrefix + this.labels.fieldOption, attrs: { class: this.getCssClass(this.classOption.EMPTY) } }); },
            createOption = (option) =>
            {
                const isRadio = field.inputType === this.InputTypeOption.RADIO,
                    input = (option.inputId) ? this.form.getSourceElement(option.inputId) :
                        (field.inputId) ? this.form.getSourceElement(field.inputId) : $lib.element('', '', 'input', ''),
                    config = (useRowBasedOptions) ? { style: `flex-basis:${field.optionWidth}` } : { inline: field.inlineOptions || false };

                if (field.inputType === this.InputTypeOption.SWITCH)
                    config.switch = true;

                this.form.ensureItemId(option);
                this.#setInputEditAttributes({ input, name: field.name, value: option.value, disabled: option.disabled });
                input.checked = option.selected;
                input.type = isRadio ? 'radio' : 'checkbox';
                this.cf.createFormField(optionsContainer, this.form.getId(field, `${option.id}_field`), option.formFieldId, option.label, input, config);

                option.element = input;
                this.form.events.onRenderEditFieldOption.fire(this.form, { field, option });
            };

        container.innerHTML = '';
        const optionsContainer = $lib.element({ container: container, attrs: { class: this.getCssClass(this.classOption.FIELD_OPTIONS) } });

        if (field.inlineOptions)
            optionsContainer.classList.add(this.getCssClass(this.classOption.FIELD_OPTIONS_INLINE));

        if (useRowBasedOptions)
            optionsContainer.classList.add(this.getCssClass(this.classOption.FIELD_OPTIONS_ROW));

        if (field.dataSourceId)
        {
            this.#loadFieldOptions(field).then(result =>
            {
                if (result.itemList.length > 0)
                {
                    result.itemList.forEach(item =>
                    {
                        createOption({
                            id: item.id || this.form.guid(),
                            name: field.name,
                            value: item.value,
                            label: item.text || item.value,
                            selected: item.selected,
                            disabled: item.disabled
                        });
                    });
                }
                else
                {
                    createEmpty();
                }

                callback();
            });
        }
        else if (!$lib.isEmpty(field.options))
        {
            field.options.forEach(createOption);
            callback();
        }
        else
        {
            createEmpty();
            callback();
        }
    }

    async #loadFieldOptions(field)
    {
        const empty = { itemList: [] },
            ds = this.form.dataSources.find(d => d.id === field.dataSourceId);

        if (!ds) return empty;

        const result = this.form.fetchFromEndpoint(ds, { form: this.form, field });
        return result || empty;
    }

    #setInputEditAttributes({ input, name, value, placeholder, disabled, readOnly })
    {
        input.name = name || '';
        input.value = value || '';
        input.placeholder = placeholder || '';
        input.disabled = (!$lib.isEmpty(disabled)) ? disabled : false;
        input.readOnly = (!$lib.isEmpty(disabled)) ? readOnly : false;
    }

    async #formFieldPostRender(field, formField)
    {
        if (field)
        {
            let el = formField.element;

            el.setAttribute(this.form.fieldAttribute, field.id);
            field.element = el;

            if (this.form.isBuildMode())
            {
                let label = el.querySelector(':scope > label');

                if (field.type === 'FieldSet' || field.type === 'Field')
                {
                    const input = this.#createLabelInput(label, field.label);

                    if (field.type === 'Field')
                    {
                        input.onblur = (e) =>
                        {
                            if (this.form.autoNameCandidates.has(field.id)) // make sure that we set the field-name to match the label
                            {
                                const nameSettingInput = $lib(`#${this.form.id}_FieldPanel_name_input`);

                                if (nameSettingInput)
                                {
                                    const val = e.target.value.trim(),
                                        name = this.form.getValidFieldNameFromLabel(val),
                                        event = new FocusEvent('blur', { bubbles: true, cancelable: true });

                                    nameSettingInput.value = `${name}`;
                                    nameSettingInput.dispatchEvent(event);
                                }
                            }
                        }
                    }
                }
                else
                {
                    label.classList.add(this.getCssClass(this.classOption.DISABLED));
                    label.textContent = field.label;
                }

                this.#createBuildView(field);
            }

            const callback = () =>
            {
                this.form.events.onRenderField.fire(this.form, { field: field });

                this.form.dataBinder.initModelValue(field);
                this.updateField(field, false);
            }

            if (this.form.isViewMode())
            {
                this.#createViewTemplate(field, field.viewElement, callback);
            }
            else
            {
                this.#createEditTemplate(field, field.editElement, callback);
            }
        }
    }

    #createBuildView(item)
    {
        if (item.type === 'Field' && item.cssClassIcon)
            $lib.element({ container: item.element, tag: 'i', attrs: { "class": `${this.getCssClass(this.classOption.ICON)} ${item.cssClassIcon}`.trim() } });

        this.#createBuildMenu(item);
        this.cf.createDragHandle(item.element);
        this.form.draggable.createDraggableField(item);
        this.#createSelectable(item);
    }

    #createBuildMenu(item)
    {
        const menuEl = $lib.element(item.element, '', '', '', { "class": this.getCssClass(this.classOption.BUILD_MENU) }),
            addAction = (item, clone) =>
            {
                const action = (item.type === 'FieldSet')
                    ? this.form.addFieldSet.bind(this.form, item, clone)
                    : this.form.addField.bind(this.form, item, clone);

                return () =>
                {
                    action();
                    setTimeout(() =>
                    {
                        const doc = this.form.ownerDocument || document;
                        doc.activeElement?.blur();
                    }, 0);
                };
            };

        this.cf.createButton(menuEl, this.form.getId(item, 'remove'), this.form.removeFieldButtonId,
            {
                hasIcon: true,
                cssClassIcon: 'ico-bin',
                cssClass: this.getCssClass(this.classOption.REMOVE),
                command: (item.type === 'FieldSet') ? this.form.removeFieldSet.bind(this.form, item, true) : this.form.removeField.bind(this.form, item, true)
            });
        this.cf.createButton(menuEl, this.form.getId(item, 'clone'), this.form.cloneFieldButtonId,
            {
                hasIcon: true,
                cssClassIcon: 'ico-copy',
                cssClass: this.getCssClass(this.classOption.CLONE),
                command: addAction(item, true)
            });
        this.cf.createButton(menuEl, this.form.getId(item, 'add'), this.form.addFieldButtonId,
            {
                hasIcon: true,
                cssClassIcon: 'ico-plus',
                cssClass: this.getCssClass(this.classOption.ADD),
                command: addAction(item, false)
            });
    }

    #createSelectable(item)
    {
        if (!$lib.has(item.element, 'click', this.#selectItem))
            $lib.on(item.element, 'click', this.#selectItem, [item], this);
    }

    #selectItem(item, evt)
    {
        const clickedEl = evt.target;

        if (clickedEl.closest(`.${this.getCssClass(this.classOption.BUILD_MENU)}`)) // do not select the field(set) when any of the menu-buttons were clicked
            return;

        if (item.type === 'FieldSet')
            this.form.selectFieldSet(item);
        else
            this.form.selectField(item);

        evt.stopPropagation();
    }

    #updateDisabledState(item)
    {
        const el = item.element,
            cssClass = this.getCssClass(this.classOption.DISABLED);

        if (item.disabled)
        {
            el.classList.add(cssClass);

            if (!this.form.isBuildMode())
                el.inert = true;
        }
        else
        {
            if (this.form.isViewMode())
                return;

            el.classList.remove(cssClass);
            el.inert = false;

            const isOptionField = [this.InputTypeOption.CHECKBOX, this.InputTypeOption.SWITCH, this.InputTypeOption.RADIO].includes(item.inputType);

            if (item.type === 'Field')
            {
                if (item.inputType === this.InputTypeOption.COMBOBOX)
                {
                    (item.options || []).forEach((opt) =>
                    {
                        const comboBox = $UI.store[this.form.getId(item, 'input')];

                        if (opt.disabled)
                            comboBox.disableItem(opt.id);
                        else
                            comboBox.enableItem(opt.id);
                    });
                }
                else if (isOptionField)
                {
                    (item.options || []).forEach((opt) =>
                    {
                        opt.element.disabled = opt.disabled;
                    });
                }
            }
        }
    }

    #updateVisibleState(item)
    {
        const el = item.element,
            cssClass = this.getCssClass(this.classOption.INVISIBLE);

        if (this.form.isBuildMode())
        {
            if (!item.visible)
                el.classList.add(cssClass);
            else
                el.classList.remove(cssClass);
        }
        else
        {
            el.style.display = (item.visible !== false) ? '' : 'none';
        }
    }

    #ensureLineBreaks(fieldSet)
    {
        let rowWidth = 0;

        (fieldSet.fields || []).forEach((field, index) =>
        {
            const width = field.width?.toString().endsWith('%') ? parseFloat(field.width) : 0;

            if (!field.lineBreak && (index === 0 || width >= 100 || rowWidth >= 100 || rowWidth + width > 100)) // force line break
                this.form.addLineBreak(field);
                
            rowWidth = field.lineBreak ? width : rowWidth + width;
        });
    }

    #updateLabel(item)
    {
        if (item.type !== 'FieldSet' && item.type !== 'Field')
            return;

        if (item.type === 'Field')
        {
            if (!this.form.isBuildMode())
            {
                $UI.store[item.element.id].updateLabel(item.label); // considers possible tooltip
            }
            else
            {
                const labelInput = item.element.querySelector(':scope > label > input');

                if (labelInput)
                    labelInput.value = item.label;
            }

            return;
        }
        else // fieldset
        {
            const query = ':scope > legend',
                labelEl = item.element.querySelector(this.form.isBuildMode() ? `${query} > input` : query);

            if (labelEl)
            {
                if (labelEl.nodeName === 'INPUT') // build mode
                    labelEl.value = item.label;
                else if (item.tooltip)
                    labelEl.firstChild.textContent = item.label;
                else
                    labelEl.textContent = item.label;
            }
        }
    }

    #updateLineBreak(item)
    {
        const hasLineBreak = item.lineBreak;

        if (!hasLineBreak && item.lineBreakElement?.isConnected)
            this.form.removeLineBreak(item);

        if (hasLineBreak && !item.lineBreakElement?.isConnected)
            this.form.addLineBreak(item);
    }

    #updateFieldSetTooltip(fieldSet)
    {
        const tooltipEl = fieldSet.element.querySelector(`.${this.getCssClass(this.classOption.TOOLTIP_ICON)}`),
            tooltipManager = this.form.tooltipManager,
            hasTooltip = tooltipManager.hasTemplate(fieldSet.id);

        if (!tooltipEl)
            return;

        tooltipEl.style.display = !$lib.isEmpty(fieldSet.tooltip) ? '' : 'none';

        if ($lib.isEmpty(fieldSet.tooltip) && hasTooltip)
        {
            tooltipManager.removeTooltip(fieldSet.id);
        }
        else if (!$lib.isEmpty(fieldSet.tooltip) && !hasTooltip)
        {
            tooltipManager.addTooltip(fieldSet.id, fieldSet.tooltip);
            tooltipManager.addTrigger(tooltipEl, fieldSet.id);
        }
    }

    #updateFieldIndicators(field)
    {
        let cssClass = this.getCssClass(this.classOption.FIELD_INDICATORS),
            container = field.element.querySelector(`.${cssClass}`),
            excludeKeys = ['type', 'compareOperator', 'parent'];

        if (!container)
            container = $lib.element({ container: field.element, attrs: { "class": cssClass } });

        let iconRules = container.querySelector(`.${this.getCssClass(this.classOption.RULES_ICON)}`),
            iconValidator = container.querySelector(`.${this.getCssClass(this.classOption.VALIDATOR_ICON)}`);

        if (field.ruleCases?.length)
        {
            if (!iconRules)
                $lib.element({ container, tag: 'i', attrs: { "class": `${this.getCssClass(this.classOption.ICON)} ${this.getCssClass(this.classOption.RULES_ICON)}` } });
        }
        else
            iconRules?.remove();

        if (field.required || Object.entries(field.validationSettings ?? {})
            .some(([key, value]) => !excludeKeys.includes(key) && !$lib.isEmpty(value)))
        {
            if (!iconValidator)
                $lib.element({ container, tag: 'i', attrs: { "class": `${this.getCssClass(this.classOption.ICON)} ${this.getCssClass(this.classOption.VALIDATOR_ICON)}` } });
        }
        else
            iconValidator?.remove();

        if (!container.childNodes.length)
            container.remove();
    }

    #updateFieldTooltip(field)
    {
        const formField = $UI.store[field.element.id],
            tooltipManager = this.form.tooltipManager,
            hasTooltip = tooltipManager.hasTemplate(field.id);

        formField.tooltipManagerId = tooltipManager.id;
        formField.tooltipId = $lib.isEmpty(field.tooltip) ? null : field.id;

        if ($lib.isEmpty(field.tooltip) && hasTooltip)
            tooltipManager.removeTooltip(field.id);
        else if (!$lib.isEmpty(field.tooltip) && !hasTooltip)
            tooltipManager.addTooltip(field.id, field.tooltip);

        formField.updateTooltip();
    }

    #updateWidth(field)
    {
        const el = field.element;

        if ($lib.isEmpty(field.width))
        {
            el.style.removeProperty('width');
            return;
        }

        let isPercentage = field.width.toString().trim().endsWith('%'),
            width = field.width;

        if (isPercentage)
        {
            const numeric = parseInt(width, 10);

            if (100 % numeric)
                width = (100 / Math.round(100 / numeric)).toFixed(6) + '%'; // always convert percentage values to correct decimals to avoid rounding issues, e.g. 33% -> 33.333333%

            if (this.form.isBuildMode())
            {
                const inlineFieldCount = this.getInlineFieldCount(field);
                el.style.width = `calc(${width} - var(--field-margin-right, 0px) - (var(--droppable-margin, 0px) / ${inlineFieldCount}))`; // remove the margin from the width and also reserve the droppable margin
            }
            else
                el.style.width = `calc(${width} - var(--field-margin-right, 0px))`; // remove the margin from the width
        }
        else
            el.style.width = $lib.unit(width);
    }

    getInlineFieldCount(field)
    {
        const fields = field.parent.fields,
            index = fields.findIndex(f => f.id === field.id);

        if (index === -1) return 1;

        let start = index;
        while (start > 0 && !fields[start].lineBreak)
            start--;

        let end = index + 1;
        while (end < fields.length && !fields[end].lineBreak)
            end++;

        return fields.slice(start, end).length || 1;
    }

    #getFieldValue(field)
    {
        if (this.form.isBuildMode())
            return field.value;

        return this.form.dataBinder.getModelValue(field);
    }

    #updateComponentPlaceholder(field)
    {
        const component = $UI.store[this.form.getId(field, 'input')];

        if (field.inputType === this.InputTypeOption.COMBOBOX)
        {
            const getPlaceholderValue = (optionCount) =>
            {
                if (optionCount > 0)
                {
                    const base = field.placeholder ? `${field.placeholder} ` : '';
                    return `${base}(${optionCount} ${this.labels.fieldOptions})`;
                }
                return field.placeholder;
            };

            if (field.dataSourceId)
            {
                this.#loadFieldOptions(field).then(result =>
                {
                    component.setPlaceholder(getPlaceholderValue(result.totalItemCount || result.itemList.length));
                });
            }
            else
            {
                component.setPlaceholder(getPlaceholderValue(field.options?.length || 0));
            }
        }
        else if (field.inputType === this.InputTypeOption.MASKEDTEXTBOX)
            component.mask = field.componentSettings?.mask;
        else if (component.setPlaceholder)
            component.setPlaceholder(field.placeholder);
    }

    #updateContentField(field)
    {
        if (!this.form.isBuildMode())
            return;

        this.#updateContentFieldValue(field);
        this.#updateContentFieldSettings(field);
    }

    #updateContentFieldValue(field)
    {
        const component = this.#contentEditor;

        if (!component || component.renderState != $base.static.RenderState.RENDERED)
            return;

        const contentId = this.form.getId(field, 'content'),
            index = component.editableElements.findIndex(item => item.id === contentId);

        if (index !== -1)
        {
            const currentValue = component.getValue();
            if (currentValue !== field.value)
                component.setValue(field.value, component.editableElements[index]);
        }
    }

    #updateComponentValue(field)
    {
        const component = $UI.store[this.form.getId(field, 'input')],
            settings = field.componentSettings || {};

        if (component.renderState != $base.static.RenderState.RENDERED)
            return;

        let currentValue = component.getValue(),
            modelValue = this.#getFieldValue(field);

        // we suppress the next change event if the component value is set here (inner input fires onchange by default)
        if (field.inputType === this.InputTypeOption.COMBOBOX)
        {
            const currentArray = currentValue ? currentValue.split(',').map(s => s.trim()) : [],
                modelValueArray = Array.isArray(modelValue) ? modelValue : [],
                isEqual = currentArray.length === modelValueArray.length &&
                    currentArray.every((val, index) => val === modelValueArray[index]);

            if (!isEqual)
            {
                component.suppressNextChangeEvent(() => { component.setValue(modelValueArray.join(',')); });
            }
        }
        else if (field.inputType === this.InputTypeOption.DATEPICKER)
        {
            let formattedValue = modelValue; // value is always in iso-date format (YYYY-MM-DD), this format is supported by DatePicker

            if (!modelValue && settings.today)
                formattedValue = $lib.formatDate(new Date(), component.dateFormat);

            if (formattedValue !== currentValue)
            {
                component.suppressNextChangeEvent(() => { component.setValue(formattedValue); });
            }
        }
        else if (field.inputType >= this.InputTypeOption.MASKEDTEXTBOX && (component.setValue && currentValue != modelValue))
        {
            component.suppressNextChangeEvent(() => { component.setValue((modelValue == undefined) ? null : modelValue); });
        }
    }

    #updateRepeatButton(fieldSet)
    {
        const id = this.form.getId(fieldSet, 'add_repeat'),
            isRepeatable = fieldSet.parent && fieldSet.parent.type === 'FieldSet' && fieldSet.repeatable && !fieldSet.repeatGroupId,
            addButton = $UI.store[id],
            baseLabel = fieldSet.repeatLabel || fieldSet.label,
            label = baseLabel ? `${this.labels.addItemPrefix} ${baseLabel}` : this.labels.fieldSetRepeatButton;

        if (addButton && !addButton.element?.isConnected)
            addButton.destroy();

        if (isRepeatable)
        {
            fieldSet.element.classList.add(this.getCssClass(this.classOption.REPEATABLE));

            if (!addButton || !addButton.renderState)
            {
                const container = fieldSet.element;

                this.cf.createButton(container, id, this.form.addRepeatButtonId,
                    {
                        hasIcon: true,
                        transparent: false,
                        cssClassIcon: 'ico-plus',
                        text: label,
                        cssClass: this.getCssClass(this.classOption.REPEAT_ADD),
                        command: this.form.addRepeatedFieldSet.bind(this.form, fieldSet)
                    });
            }
            else
            {
                addButton.text = label;
                addButton.updateContent();
            }
        }
        else if (!isRepeatable && addButton)
        {
            addButton.destroy();
        }
    }

    #ensureRepeatContainer(fs)
    {
        this.#ensureContainerOnModel(this.form.values, fs);

        if (this.form.bindToCustomModel && this.form.customModelGetter)
        {
            const customModel = this.form.customModelGetter();
            if (customModel)
                this.#ensureContainerOnModel(customModel, fs);
        }
    }

    #ensureContainerOnModel(model, fs)
    {
        const fieldSets = fs.parent.fieldSets,
            originalFieldSet = fs.repeatGroupId ? fieldSets.find(f => f.id === fs.repeatGroupId) : fs,
            groupName = originalFieldSet.id,
            groupFieldSets = fieldSets.filter(fs => fs.id === originalFieldSet.id || fs.repeatGroupId === originalFieldSet.id),
            repeatGroupIndex = groupFieldSets.findIndex((f) => f.id === fs.id),
            index = repeatGroupIndex >= 0 ? repeatGroupIndex : 0;

        if (!Array.isArray(model[groupName]))
            model[groupName] = [];

        if (!model[groupName][index])
            model[groupName][index] = {};

        if (model[groupName].length > groupFieldSets.length) // If repeated fieldset is removed, we correct the length
            model[groupName].length = groupFieldSets.length;
    }
}

export default componyx.UI.form_modules.Renderer;