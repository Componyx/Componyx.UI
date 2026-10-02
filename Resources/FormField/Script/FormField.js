/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * FormField class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {Object} An instance of the component.
    */
    componyx.UI.FormField = function (id, properties)
    {
        // define private properties
        let _instance = this,
            _formElements = 'input:not([type="hidden"]):not([type="file"]), textarea, select',
            _labelDisplayOption = componyx.UI.FormField.LabelDisplayOption,
            _tooltipIcon,
            _classOption =
            {
                INLINE: 'inline',
                REQUIRED: 'required',
                BORDERLESS: 'borderless',
                TRANSPARENT: 'lucent',
                SWITCH: 'switch',
                TOOLTIP_ICON: 'icon ico-question-mark',
                CONTENT_WRAPPER: 'field-content-wrapper',
                DISABLED: 'disabled'
            }

        // define public properties
        /**
         * Gets or sets the css class which is appended to the formfield class when inline is enabled.
         * @type {String}
         */
        this.cssClassInline = '';

        /**
         * Gets or sets the css class which is appended to the formfield class when required is enabled.
         * @type {String}
         */
        this.cssClassRequired = '';

        /**
         * Gets or sets the css class which is appended to the formfield class when borderless is enabled.
         * @type {String}
         */
        this.cssClassBorderless = '';

        /**
         * Gets or sets the css class which is appended to the formfield class when transparent is enabled.
         * @type {String}
         */
        this.cssClassTransparent = '';

        /**
         * Gets or sets the css class which is appended to the formfield class when switch is enabled.
         * @type {String}
         */
        this.cssClassSwitch = '';

        /**
         * Gets or sets the css class of the form field label element.
         * @type {String}
         */
        this.cssClassLabel = '';

        /**
         * Gets or sets the css class of the form field tooltip icon element.
         * @type {String}
         */
        this.cssClassTooltipIcon = '';

        /**
         * Gets or sets the css class of the form field content wrapper element when wrapFieldContent is set to true or the field root element is not an input field and the label display is set to above/floating/inside.
         * @type {String}
         */
        this.cssClassContentWrapper = '';

        /**
         * Gets or sets the text label.
         * @type {String}
         */
        this.label = '';

        /**
         * Gets or sets a value indicating whether the formfield is displayed as inline or block element.
         * @type {Boolean}
         */
        this.inline = false;

        /**
         * Gets or sets a value indicating if the form field is required.
         * @type {Boolean}
         */
        this.required = false;

        /**
         * Gets or sets a value indicating if the form field is rendered without the top, left and right borders.
         * @type {Boolean}
         */
        this.borderless = true;

        /**
         * Gets or sets a value indicating if the checkbox or radio field must be rendered transparent.
         * @type {Boolean}
         */
        this.transparent = false;

        /**
         * Gets or sets a value indicating if the form field must be rendered as switch control. This option has effect only when the field is an input of type checkbox.
         * @type {Boolean}
         */
        this.switch = false;

        /**
         * Gets or sets a value indicating if the form field content is placed inside a wrapper element.
         * @type {Boolean}
         */
        this.wrapFieldContent = false;

        /**
         * Gets or sets a value indicating if the form field is disabled.
         * @type {Boolean}
         */
        this.disabled = false;

        /**
         * Gets or sets a value indicating whether the label is displayed automatically, inside, above, before or after the form input field.
         * @type {componyx.UI.FormField.LabelDisplayOption}
         */
        this.labelDisplay = _labelDisplayOption.AUTO;

        /**
         * Gets or sets the tooltip manager used to display tooltips.
         * @type {String|null}
         */
        this.tooltipManagerId = null;

        /**
         * Gets or sets the id of the tooltip to show.
         * @type {String|null}
         */
        this.tooltipId = null;


        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        /** 
        * Enables or disables the inline state of the form field.
        * @param {Boolean} enable A value indicating if the option should be enabled or disabled.
        */
        this.setInline = function (enable)
        {
            setCss(enable, _instance.cssClassInline || _classOption.INLINE);
            _instance.inline = enable || false;
        }

        /** 
        * Enables or disables the required state of the form field.
        * @param {Boolean} enable A value indicating if the option should be enabled or disabled.
        */
        this.setRequired = function (enable)
        {
            setCss(enable, _instance.cssClassRequired || _classOption.REQUIRED);
            _instance.required = enable || false;
        }

        /** 
        * Enables or disables the borderless field style.
        * @param {Boolean} enable A value indicating if the option should be enabled or disabled.
        */
        this.setBorderless = function (enable)
        {
            setCss(enable, _instance.cssClassBorderless || _classOption.BORDERLESS);
            _instance.borderless = enable || false;
        }

        /** 
        * Enables or disables the transparent field style.
        * @param {Boolean} enable A value indicating if the option should be enabled or disabled.
        */
        this.setTransparent = function (enable)
        {
            setCss(enable, _instance.cssClassTransparent || _classOption.TRANSPARENT);
            _instance.transparent = enable || false;
        }

        /** 
        * Enables or disables the switch field style.
        * @param {Boolean} enable A value indicating if the option should be enabled or disabled.
        */
        this.setSwitch = function (enable)
        {
            setCss(enable, _instance.cssClassSwitch || _classOption.SWITCH);
            _instance.switch = enable || false;
        }

        /**
        * Sets the label display type (inside above before after).
        * @param {componyx.UI.FormField.LabelDisplayOption} display The label display option.
        */
        this.setLabelDisplay = function (display)
        {
            var field = _instance.element.firstElementChild;
            $lib.removeClass(_instance.element, 'inside above before after');

            if (display == _labelDisplayOption.AUTO)
            {
                var name = (field) ? field.nodeName.toLowerCase() : '';

                if (!isFormElement(field) || (name == 'input' && ' checkbox radio text password email search url tel '.indexOf(' ' + field.type + ' ') == -1))
                {
                    $lib.addClass(_instance.element, _labelDisplayOption.getName(_labelDisplayOption.ABOVE));
                    return;
                }

                if (name == 'input' && (field.type == 'checkbox' || field.type == 'radio'))
                    $lib.addClass(_instance.element, _labelDisplayOption.getName(_labelDisplayOption.AFTER));
                else
                    setInsideDisplay(_labelDisplayOption.FLOATING);
            }
            else if (display <= _labelDisplayOption.INSIDE)
            {
                setInsideDisplay(display);
            }
            else
                $lib.addClass(_instance.element, _labelDisplayOption.getName(display));
        }


        /** 
        * Adds the content template for the label.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The label template content.
        */
        this.setLabelTemplate = function (content)
        {
            _instance.addTemplate('Label', content, false);
        }

        /** 
        * Adds the content template for the field.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The field template content.
        */
        this.setFieldTemplate = function (content)
        {
            _instance.addTemplate('Field', content, false);
        }

        /**
        * Updates the label.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The label template content.
        */
        this.updateLabel = function (content)
        {
            let label = _instance.element.querySelector(':scope > label'),
                b = _instance.element.querySelector(':scope > b');

            if (!label)
                return;

            label.innerHTML = '';
            _instance.addTemplate('Label', content, false);
            _instance.applyTemplate(label, 'Label');

            if (b)
            {
                b.setAttribute('title', label.textContent);
                bindLabelEvent(b);
            }

            _instance.updateTooltip();
        }

        /**
        * Links the label to the nested input by setting htmlFor and, if necessary, assigning an ID to the input.
        * Adds a placeholder attribute if missing to support CSS styling.
        */
        this.linkLabelToInput = function ()
        {
            const guid = `${_instance.id}_${$lib.guid()}`,
                label = _instance.element.querySelector(':scope > label'),
                formEl = getFormElement();

            if (label && formEl)
            {
                if (!formEl.id)
                    formEl.id = guid;

                label.htmlFor = formEl.id;

                if (!formEl.hasAttribute('placeholder'))
                    formEl.setAttribute('placeholder', ''); // placeholder is required for css :placeholder-shown to work

                const observer = new MutationObserver(() =>
                {
                    if (formEl.id)
                    {
                        label.htmlFor = formEl.id;
                        observer.disconnect(); // fire once, then done
                    }
                });

                observer.observe(formEl, { attributes: true, attributeFilter: ['id'] });
            }
        }

        /**
         * Recreates the tooltip icon for the element and updates its trigger in the tooltip manager.
         */
        this.updateTooltip = function ()
        {
            if (_instance.tooltipManagerId)
            {
                const tooltipManager = $UI.store[_instance.tooltipManagerId];

                if (_tooltipIcon)
                {
                    tooltipManager.removeTrigger(_tooltipIcon);
                    _tooltipIcon.remove();
                }

                if (_instance.tooltipId)
                {
                    _tooltipIcon = $lib.element({ container: _instance.element.querySelector(':scope > label'), tag: 'i', attrs: { class: _instance.cssClassTooltipIcon || _classOption.TOOLTIP_ICON } });
                    tooltipManager.addTrigger(_tooltipIcon, _instance.tooltipId);
                }
            }
        }

        /**
         * Disables the form field.
         */
        this.disable = function ()
        {
            _instance.element.inert = true;
            _instance.disabled = true;
            setCss(true, _classOption.DISABLED);   
        }

        /**
         * Enables the form field.
         */
        this.enable = function ()
        {
            _instance.element.inert = false;
            _instance.disabled = false;
            setCss(false, _classOption.DISABLED);
        }

        /** 
        * Renders the component
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'form-field');
                return;
            }

            // render logic after loading resources
            draw();
        }

        /**
        * Handles the post render procedure.
        */
        this.postRender = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING) // extra safety to never execute a postRender when the component state is incorrect
                return;

            _instance.updateTooltip();
            $base.methods.postRender.call(_instance);
        }

        function preRender()
        {
            // initialize script and css
            return ['FormField'];
        }

        function draw()
        {
            let label = document.createElement('label'),
                element = _instance.element;

            if (_instance.cssClassLabel)
                $lib.addClass(label, _instance.cssClassLabel);

            _instance.applyTemplate(element, 'Field');

            if (_instance.hasTemplate('Label'))
                _instance.applyTemplate(label, 'Label');
            else if (_instance.label)
                label.textContent = _instance.label;

            let firstChild = element.firstElementChild,
                isFormEl = isFormElement(firstChild);

            if (isFormEl && isCheckOrRadio(firstChild))
            {
                let b = element.appendChild(document.createElement('b'));
                b.setAttribute('title', label.textContent);
                bindLabelEvent(b);
            }

            _instance.setInline(_instance.inline);
            _instance.setRequired(_instance.required);
            _instance.setBorderless(_instance.borderless);
            _instance.setTransparent(_instance.transparent);
            _instance.setSwitch(_instance.switch);
            _instance.setLabelDisplay(_instance.labelDisplay);
            _instance.element.inert = false; // make sure we remove a possible inert attribute from previous render

            if (_instance.disabled)
                _instance.disable();

            if (_instance.wrapFieldContent || (!isFormEl && ($lib.hasClass(_instance.element, 'above') || $lib.hasClass(_instance.element, 'floating') || $lib.hasClass(_instance.element, 'inside')))) // put content inside flex column
            {
                let content = getFieldContent(),
                    wrapper = $lib.element({ container: _instance.element, attrs: { class: _instance.cssClassContentWrapper  || _classOption.CONTENT_WRAPPER } } );

                $lib.surround(wrapper, content);
            }

            element.appendChild(label);
            _instance.linkLabelToInput();
            _instance.postRender();
        }

        function getFieldContent()
        {
            var content = document.createDocumentFragment(),
                element = _instance.element.firstChild, next;

            while (element)
            {
                next = element.nextSibling;
                content.appendChild(element);

                element = next;
            }

            return content;
        }

        function bindLabelEvent(el)
        {
            if (!$lib.has(el, 'click', pretendLabelClick))
                $lib.on(el, 'click', pretendLabelClick);
        }

        function pretendLabelClick(e)
        {
            var el = getFormElement();

            if (!el)
                return;

            e.stopPropagation(); // input will bubble click event
            el.focus();
            (el.click) ? el.click() : $lib.fireEvent(el, 'click', true, true);
        }

        function isFormElement(el)
        {
            if (!el || !el.nodeName) return false;

            const tag = el.nodeName.toLowerCase();

            if (tag === 'input')
            {
                const type = (el.getAttribute('type') || '').toLowerCase();
                return type !== 'hidden';
            }

            return tag === 'textarea' || tag === 'select';
        }

        function getFormElement()
        {
            const elements = Array.from(_instance.element.querySelectorAll(_formElements)),
                cssClass = '.form-field';

            return elements.find(el =>
            {
                let nearestFormField = el.closest(cssClass);

                if (!nearestFormField) return false;

                while (nearestFormField)
                {
                    if (nearestFormField === _instance.element)
                        return true; // Input belongs to this component

                    if ($UI.elementStore.has(nearestFormField))
                        return false; // Input is inside a child form-field component, skip

                    nearestFormField = nearestFormField.parentElement?.closest(cssClass); // Not registered, move up to the next form-field ancestor
                }
                return false;
            }) || null;
        }

        function isCheckOrRadio(el)
        {
            return (el.nodeName.toLowerCase() === 'input' && (el.type == 'checkbox' || el.type == 'radio'));
        }
        function setInsideDisplay(display)
        {
            let formEl = getFormElement(),
                ph = 'placeholder';

            if (!formEl)
                return;

            if (!formEl.hasAttribute(ph))
                formEl.setAttribute(ph, ''); // placeholder is required for css :placeholder-shown to work

            if (formEl.getAttribute(ph) === '' && (formEl.nodeName === 'TEXTAREA' || formEl.nodeName === 'INPUT'))
                $lib.addClass(_instance.element, _labelDisplayOption.getName(display).replace('_', ' '));
            else
                $lib.addClass(_instance.element, _labelDisplayOption.getName(_labelDisplayOption.ABOVE));
        }

        function setCss(enable, css)
        {
            if (enable)
                $lib.addClass(_instance.element, css);
            else
                $lib.removeClass(_instance.element, css);
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.FormField.prototype = Object.create($base.methods);
    componyx.UI.FormField.prototype.constructor = componyx.UI.FormField;

    /**
    * LabelDisplayOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.FormField.LabelDisplayOption =
    {
        /** The label display depends on the field type: displayed after when the field is a checkbox or radiobutton,
            displayed floating when the field is a basic textual input and displayed above for all other field types. */
        AUTO: 0,
        /** the label is displayed inside the field when empty and not focused otherwise it will be displayed above the field. */
        FLOATING: 1,
        /** the label is displayed inside the field and will be cleared when the input field gets focus, allowing placeholder to become visible. */
        INSIDE: 2,
        /** the label is displayed above the field. */
        ABOVE: 3,
        /** the label is displayed before the field. */
        BEFORE: 4,
        /** the label is displayed after the field. */
        AFTER: 5,

        getName: function (value) { return $base.static.getKeyByValue(this, value).toLowerCase(); }
    }
})(window);