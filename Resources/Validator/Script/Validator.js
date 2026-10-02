/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * A list of supported Validator HTML data-attributes.
    * @typedef {Object} HTML_Attributes
    * @memberof componyx.UI.Validator
    * @property {String} ["data-ui-validator-id"]							                                    - The identifier of the Validator component on which the rule is added.
    * @property {String} ["data-ui-validator-feedbackid"]					                                    - The identifier of the element used by the Validator to display validation result feedback.
    * @property {String} ["data-ui-validator-autovalidate"]					                                    - A value ('true' or 'false') indicating if the field is validated when the field value changes.
    * @property {String} ["data-ui-validator-live"]							                                    - A value ('true' or 'false') indicating if the field validation is done while typing.
    * @property {String} ["data-ui-validator-getValue"]						                                    - A custom method to get the field value.
    * @property {String} ["data-ui-validator-required-msg"]					                                    - Denotes an element as required validation field with the attribute value as message to display if validation fails.
    * @property {String} ["data-ui-validator-required-when"]				                                    - The method name that returns a boolean value to determines whether the field is required (true) or not (false). 
    * @property {String} ["data-ui-validator-datatype-msg"]					                                    - Denotes an element as datatype validation field with the attribute value as message to display if validation fails.
    * @property {componyx.UI.Validator.DataTypeOption} ["data-ui-validator-datatype-datatype"]	                - The data-type to which the field value must comply.
    * @property {String} ["data-ui-validator-length-msg"]					                                    - Denotes an element as length validation field with the attribute value as message to display if validation fails.
    * @property {String} ["data-ui-validator-length-min"]				                                        - The minimum length to which the field value must comply.
    * @property {String} ["data-ui-validator-length-max"]					                                    - The maximum length to which the field value must comply.
    * @property {String} ["data-ui-validator-range-msg"]					                                    - Denotes an element as range validation field with the attribute value as message to display if validation fails.
    * @property {String} ["data-ui-validator-range-min"]					                                    - The minimum value to which the field value must comply.
    * @property {String} ["data-ui-validator-range-max"]					                                    - The maximum value to which the field value must comply.
    * @property {String} ["data-ui-validator-regex-msg"]					                                    - Denotes an element as regex validation field with the attribute value as message to display if validation fails.
    * @property {String} ["data-ui-validator-regex-pattern"]			                                        - The pattern to which the field value must comply.
    * @property {String} ["data-ui-validator-compare-msg"]					                                    - Denotes an element as compare validation field with the attribute value as message to display if validation fails.
    * @property {String} ["data-ui-validator-compare-fields"]				                                    - The comparison field(s) with which the field value will be compared.
    * @property {String} ["data-ui-validator-compare-operators"]			                                    - The comparison operator(s) for the comparison field validation.
    * @property {String} ["data-ui-validator-custom-msg"]					                                    - Denotes an element as custom validation field with the attribute value as message to display if validation fails.
    * @property {String} ["data-ui-validator-custom-onValidation"]			                                    - The event handler to invoke when the field is validated.
    * @property {String} ["data-ui-validator-ajax-msg"]						                                    - Denotes an element as ajax validation field with the attribute value as message to display if validation fails.
    * @property {String} ["data-ui-validator-ajax-onBeforeValidation"]		                                    - The event handler to invoke before the field is validated on the server.
    * @property {String} ["data-ui-validator-ajax-onAfterValidation"]	                                        - The event handler to invoke after the field is validated on the server.
    */

    /**
    * Validator class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @property {componyx.UI.base.AjaxMethod} ajax.validate - AJAX method used to validate field values on the server.
    * @returns {Object} An instance of the component.
    */
    componyx.UI.Validator = function Validator(id, properties)
    {
        // define private properties
        let _instance = this,
            _themes = ['themeDefault'],
            _fields = null,
            _ajaxFields = {},
            _formSubmit = false,
            _liveTimerId = null,
            _validatingTimerId = null,
            _fieldValueFromCache = false,
            _tooltipManager,
            _classOption =
            {
                VALIDATOR: 'validator',
                FEEDBACK: 'feedback',
                SUMMARY: 'summary',
                VALIDATING: 'validating',
                VALID: 'valid',
                INVALID: 'invalid',
                ICON: 'icon',
                MULTIPLE: 'multiple',
                TOOLTIPTRIGGER: 'tooltip-trigger'
            },
            _feedbackStatus =
            {
                VALIDATING: 0,
                VALID: 1,
                INVALID: 2
            },
            _typeOption = componyx.UI.Validator.TypeOption,
            _dataTypeOption = componyx.UI.Validator.DataTypeOption,
            _showValidFieldsOption = componyx.UI.Validator.ShowValidFieldsOption,
            _messageDisplayOption = componyx.UI.Validator.MessageDisplayOption,
            _prefix = 'data-ui-validator-',
            _query = 'input,textarea,select,[contenteditable=true]',
            _nativeInputDataTypes = ['email', 'url', 'tel', 'number', 'date', 'time', 'range'],
            _container = null,
            _create = Object.create,
            _attrBase =
            {
                msg: ''
            },
            _prop = (val) => ({ value: val, writable: true, enumerable: true }),
            _Required = function (when) { this.when = _prop(when); },
            _DataType = function (dataType) { this.dataType = _prop(dataType); },
            _Range = function (min, max)
            {
                this.min = _prop(min);
                this.max = _prop(max);
            },
            _RegEx = function (pattern) { this.pattern = _prop(pattern); },
            _Compare = function (fields, operators)
            {
                this.fields = _prop(fields);
                this.operators = _prop(operators);
            },
            _Custom = function (onValidation) { this.onValidation = _prop(onValidation); },
            _Ajax = function (onBeforeValidation, onAfterValidation)
            {
                this.onBeforeValidation = _prop(onBeforeValidation);
                this.onAfterValidation = _prop(onAfterValidation);
            },
            _attr =
            {
                feedbackId: '',
                autoValidate: '',
                live: '',
                getValue: '',
                required: _create(_attrBase, new _Required()),
                dataType: _create(_attrBase, new _DataType()),
                length: _create(_attrBase, new _Range()),
                range: _create(_attrBase, new _Range()),
                regex: _create(_attrBase, new _RegEx()),
                compare: _create(_attrBase, new _Compare()),
                custom: _create(_attrBase, new _Custom()),
                ajax: _create(_attrBase, new _Ajax())
            };

        _attr.id = _prefix + 'id';
        _attr.feedbackId = _prefix + 'feedbackid';
        _attr.autoValidate = _prefix + 'autovalidate';
        _attr.live = _prefix + 'live';
        _attr.getValue = _prefix + 'getvalue';

        // create correct attribute keys with 'data-ui-validator-' prefix
        $lib.each(_attr, function (v, k)
        {
            if (v == _attr.id || v == _attr.feedbackId || v == _attr.autoValidate || v == _attr.live || v == _attr.getValue)
                return;

            $lib.each(_attr[k], function (sv, sk)
            {
                _attr[k][sk] = _prefix + k.toLowerCase() + '-' + sk.toLowerCase();
            });
        });

        // define public properties
        /**
         * Gets or sets the css class of a feedback ul element.
         * @type {String}
         */
        this.cssClassFeedback = '';

        /**
         * Gets or sets the css class of a summary ul element.
         * @type {String}
         */
        this.cssClassSummary = '';

        /**
         * Gets or sets the css class of the feedback message when server-side validation is processing.
         * @type {String}
         */
        this.cssClassValidating = '';

        /**
         * Gets or sets the css class of the feedback/summary message when the input field passes validation.
         * @type {String}
         */
        this.cssClassValid = '';

        /**
         * Gets or sets the css class of the feedback/summary message when the input field fails validation.
         * @type {String}
         */
        this.cssClassInvalid = '';

        /**
         * Gets or sets the css class of the icon in a feedback or summary message.
         * @type {String}
         */
        this.cssClassIcon = '';

        /**
         * Gets or sets the css class of the tooltip trigger.
         * @type {String}
         */
        this.cssClassTooltipTrigger = '';

        /**
         * Gets or sets the message which is shown when ajax validation is processing.
         * @type {String}
         */
        this.validatingFieldMessage = '';

        /**
         * Gets or sets the message which is shown when a field passes validation.
         * @type {String}
         */
        this.validFieldMessage = '';

        /**
         * Gets or sets the message which is shown when a field fails validation. Message is not shown when the ErrorMessage is defined on the model property.
         * @type {String}
         */
        this.invalidFieldMessage = '';

        /**
         * Gets or sets the message which is shown when ajax validation throws an error.
         * @type {String}
         */
        this.ajaxErrorMessage = '';

        /**
         * Gets or sets the delay for the validating field message which is shown when ajax validation is processing.
         * @type {Number}
         */
        this.validatingFieldMessageDelay = 50;

        /**
         * Gets or sets when valid fields are displayed.
         * @type {componyx.UI.Validator.ShowValidFieldsOption}
         */
        this.showValidFields = _showValidFieldsOption.NONE;

        /**
         * Gets or sets a value indicating how validation messages are being displayed.
         * @type {componyx.UI.Validator.MessageDisplayOption}
         */
        this.messageDisplay = _messageDisplayOption.FEEDBACKFIRST;

        /**
         * Gets or sets a value indicating how validation messages are being displayed in the summary container.
         * @type {componyx.UI.Validator.MessageDisplayOption}
         */
        this.summaryMessageDisplay = _messageDisplayOption.FEEDBACKFIRST;

        /**
         * Gets or sets a value indicating whether valid fields are also displayed in the summary container.
         * @type {Boolean}
         */
        this.showValidFieldsInSummary = false;

        /**
         * Gets or sets the identifying css class of the field feedback container.
         * @type {String}
         */
        this.feedbackIdentifyingCssClass = '';

        /**
         * Gets or sets the container id of the validation message summary.
         * @type {String}
         */
        this.summaryContainerId = '';

        /**
         * Gets or sets the form id of the form that holds the input fields when using multiple forms on a single page.
         * @type {String|null}
         */
        this.formId = null;

        /**
         * Gets or sets the input format for dates. Default: MM/dd/yyyy
         * @type {String}
         */
        this.dateFormat = 'mm/dd/yyyy';

        /**
         * Gets or sets the input decimal separator for numbers. Default: '.'
         * @type {String}
         */
        this.decimalSeparator = '.';

        /**
         * Gets or sets the input group separator for numbers. Default: ','
         * @type {String}
         */
        this.groupSeparator = ',';

        /**
         * Gets or sets the initial validator rules (Array or JSON string).
         * @type {componyx.UI.Validator.Rule[]|String|null}
         */
        this.rules = null;

        /**
         * Gets or sets the fields which passed validation on postback.
         * @type {String[]}
         */
        this.validFields = {};

        /**
         * Gets or sets the fields which failed validation on postback.
         * @type {String[]}
         */
        this.invalidFields = {};

        /**
         * List containing the friendly field names.
         * @type {String[]}
         */
        this.friendlyFieldNames = {};

        /**
         * Gets or sets a value indicating whether auto generated field names should be corrected to static names.
         * @type {Boolean}
         */
        this.staticASPNETFieldNames = true;

        /**
         * Gets or sets a value indicating whether the validation status css classes are applied to the (input/textarea/select/contenteditable) field (defaults to true).
         * @type {Boolean}
         */
        this.validationCssOnField = true;

        /**
         * Gets or sets a value indicating whether field validation should be performed while typing (defaults to false).
         * @type {Boolean}
         */
        this.live = false;

        /**
         * Gets or sets the delay in milliseconds before the live field validation is performed.
         * @type {Number}
         */
        this.liveDelay = 0;

        /**
         * Gets or sets a value indicating if fields are being detected when the component initializes.
         * @type {Boolean}
         */
        this.detectFields = true;

        /**
         * Gets or sets the tabindex of the tooltip trigger element.
         * @type {String}
         */
        this.tooltipTriggerTabIndex = '';

        /**
         * Gets or sets the tooltip manager used to display tooltips.
         * @type {String|null}
         */
        this.tooltipManagerId = null;


        /**
        * @class
        * @augments componyx.UI.base.Events
        * @memberof componyx.UI.Validator
        * @property {componyx.UI.base.Event} onPreInit           - Event which fires before the initialization but after loading resources.
        * @property {componyx.UI.base.Event} onPostInit          - Event which fires after the initialization of the validator.
        * @property {componyx.UI.base.Event} onValidField        - Event which fires when validation for a field passes. @see {@link componyx.UI.Validator.FieldEventArgs}
        * @property {componyx.UI.base.Event} onInvalidField      - Event which fires when validation for a field fails. @see {@link componyx.UI.Validator.FieldEventArgs}
        * @property {componyx.UI.base.Event} onValid             - Event which fires when validation passes.
        * @property {componyx.UI.base.Event} onInvalid           - Event which fires when validation fails.
        * @property {componyx.UI.base.Event} onFieldFeedback     - Event which fires when feedback for a field is set. @see {@link componyx.UI.Validator.FieldEventArgs}
        * @see {@link componyx.UI.base.Events}
        */
        function ValidatorEvents(events)
        {
            Object.assign(this, events);
            this.onPreInit = $base.static.createEvent('onPreInit');
            this.onPostInit = $base.static.createEvent('onPostInit');
            this.onValidField = $base.static.createEvent('onValidField');
            this.onInvalidField = $base.static.createEvent('onInvalidField');
            this.onValid = $base.static.createEvent('onValid');
            this.onInvalid = $base.static.createEvent('onInvalid');
            this.onFieldFeedback = $base.static.createEvent('onFieldFeedback');
        };

        /**
         * Validator events
         * @type {componyx.UI.Validator.ValidatorEvents}
         */
        this.events = new ValidatorEvents(this.events);

        /**
         * Validator field event arguments.
         * @typedef {Object} FieldEventArgs
         * @memberof componyx.UI.Validator
         * @property {HTMLElement} fieldElement - The validated field element.
         * @property {String} fieldName - The name of the field.
         * @property {String} fieldValue - The value of the field.
         * @property {Object} fieldData - The internal validation data of the field (validation settings and state).
         * @property {String[]} msg - The validation messages.
         * @property {HTMLUListElement} [feedbackElement] - The feedback list element (onFieldFeedback only, when feedback is displayed).
         * @property {HTMLUListElement} [summaryElement] - The summary list element (onFieldFeedback only, when the field is summarised).
         */

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        // define ajax method
        this.ajax.addMethod('validate');

        /** 
        * Returns true if the current validation state is valid, otherwise false
        */
        this.isValid = function ()
        {
            return isValid();
        }

        /**
        * Validates the required field using the specified settings.
        * @param {Object} settings The validation rule settings.
        * @param {HTMLElement[]} field The field or fields in case of a Radio Button. 
        * @returns {Boolean} A value indicating if the field is valid (true) or invalid (false).
        */
        this.validateRequired = function (settings, field)
        {
            return validateRequired(settings, field);
        }

        /**
        * Validates the field by value comparison using the specified settings.
        * @param {Object} settings Validation rule settings (includes fields and operators).
        * @param {String} value The field value.
        * @param {componyx.UI.Validator.DataTypeOption|null} [dataType] Field value data type (default: string).
        * @returns {Boolean} A value indicating if the field is valid (true) or invalid (false).
        */
        this.validateCompare = function (settings, value, dataType)
        {
            return validateCompare(settings, value, dataType);
        }

        /**
        * Validates the field value range using the specified settings.
        * @param {Object} settings The validation rule settings.
        * @param {String} value The field value.
        * @param {DataTypeOption} value The data type of the value.
        * @returns {Boolean} A value indicating if the field is valid (true) or invalid (false).
        */
        this.validateRange = function (settings, value, dataType)
        {
            return validateRange(settings, value, dataType);
        }

        /**
        * Validates the field value length using the specified settings.
        * @param {Object} settings The validation rule settings.
        * @param {String} value The field value.
        * @returns {Boolean} A value indicating if the field is valid (true) or invalid (false).
        */
        this.validateLength = function (settings, value)
        {
            return validateLength(settings, value);
        }

        /**
        * Validates the field value data-type using the specified settings.
        * @param {Object} settings The validation rule settings.
        * @param {String} value The field value.
        * @returns {Boolean} A value indicating if the field is valid (true) or invalid (false).
        */
        this.validateType = function (settings, value)
        {
            return validateType(settings, value);
        }

        /**
        * Validates the field value by the configured regex pattern using the specified settings.
        * @param {Object} settings The validation rule settings.
        * @param {String} value The field value.
        * @returns {Boolean} A value indicating if the field is valid (true) or invalid (false).
        */
        this.validateRegEx = function (settings, value)
        {
            return validateRegEx(settings, value);
        }

        /**
        * Gets all the validation fields with there defined rules.
        * @returns {Object} An object with field-name as key and the validation rules as value.
        */
        this.getFields = function ()
        {
            return _fields;
        }

        /** 
        * Defines the template for a validating field in the feedback container. The template supports the below listed interpolations. Default value: {icon}{message}
        * - {icon} This value will be replaced validation state icon.
        * - {fieldName} This value will be replaced with the name of the validation field.
        * - {message} This value will be replaced with the validation message.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The content of the template
        */
        this.setValidatingFieldFeedbackTemplate = function (content)
        {
            _instance.addTemplate('ValidatingFieldFeedback', content);
        }

        /** 
        * Defines the template for a valid field in the feedback container. The template supports the below listed interpolations. Default value: {icon}{message}
        * - {icon} This value will be replaced validation state icon.
        * - {fieldName} This value will be replaced with the name of the validation field.
        * - {message} This value will be replaced with the validation message.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The content of the template
        */
        this.setValidFieldFeedbackTemplate = function (content)
        {
            _instance.addTemplate('ValidFieldFeedback', content);
        }

        /** 
        * Defines the template for an invalid field in the feedback container. The template supports the below listed interpolations. Default value: {icon}{tooltipTrigger}{multiple}[ 1-{messageCount} ]{/multiple}{/tooltipTrigger} {message}
        * - {icon} This value will be replaced validation state icon.
        * - {fieldName} This value will be replaced with the name of the validation field.
        * - {message} This value will be replaced with the validation message.
        * - {tooltipTrigger} This value will be replaced with the opening trigger element tag.
        * - {/tooltipTrigger} This value will be replaced with the closing trigger element tag.
        * - {multiple} This value will be replaced with the opening multiple element tag.
        * - {/multiple} This value will be replaced with the closing multiple element tag.
        * - {messageCount} This value will be replaced with the validation message count.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The content of the template
        */
        this.setInvalidFieldFeedbackTemplate = function (content)
        {
            _instance.addTemplate('InvalidFieldFeedback', content);
        }

        /** 
        * Defines the template for a valid field in the summary container. The template supports the below listed interpolations. Default value: {icon}{fieldName} {message
        * - {icon} This value will be replaced validation state icon.
        * - {fieldName} This value will be replaced with the name of the validation field.
        * - {message} This value will be replaced with the validation message.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The content of the template
        */
        this.setValidFieldSummaryTemplate = function (content)
        {
            _instance.addTemplate('ValidFieldSummary', content);
        }

        /** 
        * Defines the template for an invalid field in the summary container. The template supports the below listed interpolations. Default value: {icon}{fieldName}: {tooltipTrigger}{multiple}[ 1-{messageCount} ]{/multiple}{/tooltipTrigger} {message}
        * - {icon} This value will be replaced validation state icon.
        * - {fieldName} This value will be replaced with the name of the validation field.
        * - {message} This value will be replaced with the validation message.
        * - {tooltipTrigger} This value will be replaced with the opening trigger element tag.
        * - {/tooltipTrigger} This value will be replaced with the closing trigger element tag.
        * - {multiple} This value will be replaced with the opening multiple element tag.
        * - {/multiple} This value will be replaced with the closing multiple element tag.
        * - {messageCount} This value will be replaced with the validation message count.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The content of the template
        */
        this.setInvalidFieldSummaryTemplate = function (content)
        {
            _instance.addTemplate('InvalidFieldSummary', content);
        }

        /** 
        * Defines the template for an invalid field in the popup. The template supports the below listed interpolations. Default value: {icon}{fieldName}: {tooltipTrigger}{multiple}[ 1-{messageCount} ]{/multiple}{/tooltipTrigger} {message}
        * - {message} This value will be replaced with the validation message.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The content of the template
        */
        this.setInvalidFieldPopupTemplate = function (content)
        {
            _instance.addTemplate('InvalidFieldPopup', content);
        }

        // the validator does not render html output, so nothing to hide
        this.hide = null;

        /** 
        * Initializes the Validator component if this has not yet been done.
        */
        this.show = function ()
        {
            if (_instance.renderState == $base.static.RenderState.NONE)
                this.render();
        }

        /** 
        * Initializes the Validator component.
        */
        this.init = function ()
        {
            if (_instance.renderState == $base.static.RenderState.RENDERING)
                return;

            const element = _instance.element;
            let script = ['Box', 'TooltipManager'];

            _instance.destroy(true, false); // keep events, keep the placeholder in the DOM
            _instance.element = element;
            _instance.hasTheme = false;
            $UI.store[_instance.id] = _instance;

            if (element) // a Validator created by another component does not have an element
            {
                $UI.elementStore.set(element, _instance); // destroy() removed it
                $base.methods.setupMutationObserver.call(_instance);
            }

            _instance.renderState = $base.static.RenderState.RENDERING;

            // initialize css
            _instance.registerResources(function ()
            {
                return ['Validator', script];
            },
                function ()
                {
                    // create default templates
                    if (!_instance.hasTemplate('ValidatingFieldFeedback'))
                        _instance.addTemplate('ValidatingFieldFeedback', '{icon}{message}', true);

                    if (!_instance.hasTemplate('ValidFieldFeedback'))
                        _instance.addTemplate('ValidFieldFeedback', '{icon}{message}', true);

                    if (!_instance.hasTemplate('InvalidFieldFeedback'))
                        _instance.addTemplate('InvalidFieldFeedback', '{icon}{tooltipTrigger}{multiple}[ 1-{messageCount} ]{/multiple}{/tooltipTrigger} {message}', true);

                    if (!_instance.hasTemplate('ValidFieldSummary'))
                        _instance.addTemplate('ValidFieldSummary', '{icon}{fieldName} {message}', true);

                    if (!_instance.hasTemplate('InvalidFieldSummary'))
                        _instance.addTemplate('InvalidFieldSummary', '{icon}{fieldName}: {tooltipTrigger}{multiple}[ 1-{messageCount} ]{/multiple}{/tooltipTrigger} {message}', true);

                    if (!_instance.hasTemplate('InvalidFieldPopup'))
                        _instance.addTemplate('InvalidFieldPopup', '{message}', true);

                    _instance.renderState = $base.static.RenderState.RENDERED; // we need to set this state otherwise main UI postRender event might be blocked
                    createTooltipManager();
                    _instance.events.onPreInit.fire(_instance);

                    if ($UI.busy)
                    {
                        if (!$UI.onPostRender.has(postInit))
                            $UI.onPostRender.once(postInit);
                    }
                    else
                        postInit();
                });
        }

        /**
        * Initializes the Validator component. Both init and render are the same for this component.
        * @function
        */
        this.render = this.init;

        /** 
        * Detects validation rules specified through data-attributes on input elements.
        * @param {HTMLElement} [container] A container element to restrict detection to fields within the container.
        * @param {boolean} [ignoreHidden] A value indicating whether hidden fields should be excluded from detection.
        */
        this.detect = function (container, ignoreHidden = false)
        {
            let settings, dataType, detected = {},
                getValidatorAttr = (el, attrFullName) =>
                {
                    let val = el.getAttribute(attrFullName);
                    if (val != null)
                        return val;

                    if (attrFullName.startsWith('data-ui-validator-')) // check for shortened attribute without 'data-' prefix
                    {
                        const suffix = attrFullName.slice('data-ui-validator-'.length);

                        val = el.getAttribute('ui-val-' + suffix);
                        if (val != null) return val;

                        val = el.getAttribute('ui-validator-' + suffix);
                        if (val != null) return val;
                    }

                    return null;
                },
                hasValidatorAttr = (el, attrFullName) =>
                {
                    return getValidatorAttr(el, attrFullName) != null;
                },
                setup = function (el, type, props)
                {
                    var settings = _create(_attrBase, props);
                    settings.feedBackId = getValidatorAttr(el, _attr.feedbackId);
                    settings.autoValidate = hasValidatorAttr(el, _attr.autoValidate) ? getValidatorAttr(el, _attr.autoValidate) != 'false' : null;
                    settings.live = hasValidatorAttr(el, _attr.live) ? getValidatorAttr(el, _attr.live) != 'false' : null;
                    settings.getValue = getValidatorAttr(el, _attr.getValue);
                    settings.msg = getValidatorAttr(el, type.msg);
                    settings.native = (type === _attr.required && el.hasAttribute('required')) ||
                        (type === _attr.dataType && _nativeInputDataTypes.includes(el.type)) ||
                        (type === _attr.length && (el.hasAttribute('minlength') || el.hasAttribute('maxlength'))) ||
                        (type === _attr.range && (el.hasAttribute('min') || el.hasAttribute('max'))) ||
                        (type === _attr.regex && el.hasAttribute('pattern'));
                    settings.checkValidity = (settings.native) ? el.checkValidity.bind(el) : null;

                    return settings;
                };

            _container = container || getForm() || document;
            let list = _container.querySelectorAll(_query);

            if (ignoreHidden)
                list = Array.from(list).filter(el => isVisible(el));

            $lib.each(list, function (el)
            {
                let name = getFieldName(el);

                if ($lib.isEmpty(name) || detected[name] || (hasValidatorAttr(el, _attr.id) && getValidatorAttr(el, _attr.id) != _instance.id))
                    return;

                detected[name] = true;

                if (hasValidatorAttr(el, _attr.required.msg))
                {
                    settings = setup(el, _attr.required, new _Required(getValidatorAttr(el, _attr.required.when)));
                    _instance.addRule(name, settings, _typeOption.REQUIRED);
                }

                if (hasValidatorAttr(el, _attr.dataType.msg))
                {
                    dataType = getValidatorAttr(el, _attr.dataType.dataType);
                    settings = setup(el, _attr.dataType, new _DataType(!$lib.isEmpty(dataType) ? _dataTypeOption[dataType.toUpperCase()] : 0));
                    _instance.addRule(name, settings, _typeOption.DATATYPE);
                }

                if (hasValidatorAttr(el, _attr.length.msg))
                {
                    settings = setup(el, _attr.length, new _Range(getValidatorAttr(el, _attr.length.min), getValidatorAttr(el, _attr.length.max)));
                    _instance.addRule(name, settings, _typeOption.LENGTH);
                }

                if (hasValidatorAttr(el, _attr.range.msg))
                {
                    settings = setup(el, _attr.range, new _Range(getValidatorAttr(el, _attr.range.min), getValidatorAttr(el, _attr.range.max)));
                    _instance.addRule(name, settings, _typeOption.RANGE);
                }

                if (hasValidatorAttr(el, _attr.regex.msg))
                {
                    settings = setup(el, _attr.regex, new _RegEx(getValidatorAttr(el, _attr.regex.pattern)));
                    _instance.addRule(name, settings, _typeOption.REGEX);
                }

                if (hasValidatorAttr(el, _attr.compare.msg))
                {
                    const fields = (getValidatorAttr(el, _attr.compare.fields) || '').split(',').map(f => f.trim()),
                        operators = (getValidatorAttr(el, _attr.compare.operators) || '').split(',').map(o => o.trim());

                    settings = setup(el, _attr.compare, new _Compare(fields, operators));
                    _instance.addRule(name, settings, _typeOption.COMPARE);
                }

                if (hasValidatorAttr(el, _attr.custom.onValidation))
                {
                    settings = setup(el, _attr.custom, new _Custom(getMethod(getValidatorAttr(el, _attr.custom.onValidation))));
                    _instance.addRule(name, settings, _typeOption.CUSTOM);
                }

                if (hasValidatorAttr(el, _attr.ajax.msg))
                {
                    settings = setup(el, _attr.ajax, new _Ajax(
                        getMethod(getValidatorAttr(el, _attr.ajax.onBeforeValidation)),
                        getMethod(getValidatorAttr(el, _attr.ajax.onAfterValidation))
                    ));
                    _instance.addRule(name, settings, _typeOption.AJAX);
                }
            });

            _container = null;
        };

        /** 
        * Adds a validation rule of the specified type for the given field name(s).
        * @param {String|String[]} fieldName The name of the form field(s).
        * @param {Object} settings The validation rule settings.
        * @param {String} settings.feedbackId The identifier of the element used by the Validator to display validation result feedback.
        * @param {Boolean} settings.autoValidate A value indicating if the field is validated when the field value changes.
        * @param {Boolean} settings.live A value indicating if the field validation is done while typing.
        * @param {Function} settings.getValue A custom method to return the value for this field. Passes in the field element and expects the field value as result.
        * @param {String} settings.msg The message to display if validation fails.
        * @param {String} [settings.when] The name of the method that returns a boolean value to determines whether the field is required (true) or not (false). (REQUIRED type validation).
        * @param {Number|String} [settings.min] The minimum value. (LENGTH and RANGE type validation).
        * @param {Number|String} [settings.max] The maximum value. (LENGTH and RANGE type validation).
        * @param {RegExp} settings.pattern The Regular expression pattern. (REGEX type validation).
        * @param {HTMLElement[]|String[]} settings.fields  The HTML element(s), element name(s) or values to compare against.
        * @param {String[]} settings.operators The operator(s) to use for comparison: < 'LessThan', <= 'LessThanOrEqualTo', > 'GreaterThan', >= 'GreaterThanOrEqualTo', or == 'EqualTo' (default). Can be a single entry (applied to all fields) or an array aligned with `fields`.
        * @param {componyx.UI.Validator.DataTypeOption} settings.dataType The data-type to which the field value must comply. (DATATYPE type validation).
        * @param {Boolean} settings.alwaysCheck A value indicating if the validation rule should always be checked even if the field validation has already failed (only applies to type CUSTOM).
        * @param {OnValidation} settings.onValidation A function(sender, args) invoked when the field is validated. (CUSTOM type validation).
        * @param {OnBeforeValidation} settings.onBeforeValidation A function(sender, args) invoked before the field is validated. (AJAX type validation).
        * @param {OnAfterValidation} settings.onAfterValidation A function function(sender, args) invoked after the field is validated. (AJAX type validation).
        * @param {TypeOption} [type] The type of the validation. May be omitted to apply a global field setting only (feedbackId, autoValidate or live).
        * - 0 REQUIRED
        * - 1 DATATYPE
        * - 2 LENGTH
        * - 3 RANGE
        * - 4 REGEX
        * - 5 COMPARE
        * - 6 CUSTOM
        * - 7 AJAX
        */
        this.addRule = function (fieldName, settings, type)
        {
            var form = getForm();

            if (!fieldName)
                return;

            if (!$lib.isArray(fieldName))
                fieldName = [fieldName];

            if (!settings)
                settings = {};

            if (!_fields)
            {
                _fields = {};

                if (form)
                    $lib.on(form, 'submit', validateForm);
            }

            if (settings.fields && !$lib.isArray(settings.fields))
                settings.fields = [settings.fields];

            $lib.each(fieldName, function (name)
            {
                let fieldEl = getFieldByName(name);

                if (!_fields[name])
                {
                    _fields[name] =
                    {
                        feedbackId: settings.feedbackId,
                        autoValidate: settings.autoValidate,
                        live: settings.live,
                        getValue: settings.getValue,
                        isValid: false,
                        lastValue: null,
                        lastMsg: null,
                        element: fieldEl || null
                    };
                }
                else
                {
                    _fields[name].isValid = false;
                    _fields[name].lastValue = null;
                    _fields[name].lastMsg = null;

                    if (!$lib.isEmpty(settings.feedbackId))
                        _fields[name].feedbackId = settings.feedbackId;

                    if (!$lib.isEmpty(settings.autoValidate))
                        _fields[name].autoValidate = settings.autoValidate;

                    if (!$lib.isEmpty(settings.live))
                        _fields[name].live = settings.live;

                    if (!$lib.isEmpty(settings.getValue))
                        _fields[name].getValue = settings.getValue;
                }

                if (fieldEl && _fields[name].autoValidate != false)
                {
                    let fieldEls = [fieldEl];

                    if (fieldEl.type == 'radio')
                        fieldEls = getRadioFields(fieldEl);

                    if (type === _typeOption.COMPARE && settings.fields) // make sure original field gets validated
                    {
                        settings.fields.forEach(cf =>
                        {
                            let cfEl = (cf instanceof HTMLElement) ? cf : getFieldByName(cf);

                            if (cfEl && fieldEls.indexOf(cfEl) === -1)
                            {
                                if (cfEl.type == 'radio')
                                    fieldEls = fieldEls.concat(getRadioFields(cfEl));
                                else
                                    fieldEls.push(cfEl);
                            }
                        });
                    }

                    $lib.each(fieldEls, function (fld)
                    {
                        // add unique event handler for field, binding will only be added once per field
                        let eventType = (fld.isContentEditable) ? 'blur' : 'change';

                        $lib.on(fld, eventType, validateFieldOnChange, [fld, false], null, true);
                        $lib.on(fld, 'focus', hideTooltip, name, null, true);

                        if (fld.nodeName.toLowerCase() != 'select' && (_fields[name].live == true || (_instance.live && _fields[name].live != false)))
                            $lib.on(fld, 'input', validateFieldOnInput, [fld, false], null, true);
                    });
                }

                delete settings.feedbackId;
                delete settings.autoValidate;
                delete settings.live;
                delete settings.getValue;

                if (!$lib.isEmpty(type))
                {
                    if (!_fields[name][type])
                        _fields[name].isValid = false; // new rule

                    _fields[name][type] = settings;
                }

                var reqSettings = _fields[name][_typeOption.REQUIRED];

                if ((!_fields[name][_typeOption.REQUIRED] || (reqSettings.when && !isRequired(reqSettings.when, fieldEl))) && $lib.isEmpty(getFieldValue(fieldEl)))
                    _fields[name].isValid = true; // not required and no field value
            });
        }

        /** 
        * Resets the field's validation state.
        * @param {String|String[]} fieldName The name of the form field (or array of field names).
        */
        this.resetState = function (fieldName)
        {
            $lib.each(fieldName, function (name)
            {
                resetState(_fields[name], name);
            });
        }

        /** 
        * Resets the validation state for all fields.
        * @param {HTMLElement} [container] A container element to restrict the state reset to fields within the container.
        */
        this.resetStates = function (container)
        {
            $lib.each(_fields, function (fld, name)
            {
                if (!container || (container && fld.element && container.contains(fld.element)))
                    resetState(fld, name);
            });
        }

        /** 
        * Returns true if there are validation rules for this field, otherwise false.
        * @param {String} fieldName The name of the form field.
        */
        this.hasRules = function (fieldName)
        {
            return (_fields != null && _fields[fieldName] != undefined);
        }

        /** 
        * Returns true if the validation rule is set for this field, otherwise false.
        * @param {String} fieldName The name of the form field.
        */
        this.hasRule = function (fieldName, type)
        {
            return (_fields != null && _fields[fieldName] != undefined && _fields[fieldName][type] != undefined);
        }

        /** 
        * Returns the validation rules for the specified field.
        * @param {String} fieldName The name of the form field.
        */
        this.getRules = function (fieldName)
        {
            if (_fields != null && _fields[fieldName] != undefined)
                return _fields[fieldName];
            else
                return null
        }

        /** 
        * Removes the validation rule of the specified type for the given field name(s).
        * @param {String|String[]} fieldName The name of the form field (or array of field names).
        * @param {TypeOption} type The type of the validation
        */
        this.removeRule = function (fieldName, type)
        {
            if (!_fields)
                return;

            if (!fieldName.constructor || fieldName.constructor.toString().indexOf('Array') == -1)
                fieldName = [fieldName];

            $lib.each(fieldName, function (name)
            {
                if (_fields[name] && _fields[name][type])
                {
                    clearFieldFeedback(name);
                    delete _fields[name][type];
                    _fields[name].lastValue = null;

                    if (!hasRule(name))
                    {
                        removeBinding(name);
                        delete _fields[name];
                    }
                }
            });
        }

        /** 
        * Removes the validation rules for the given field name(s).
        * @param {String|String[]} fieldName The name of the form field (or array of field names).
        */
        this.removeRules = function (fieldName)
        {
            if (!_fields)
                return;

            fieldName = Array.isArray(fieldName) ? fieldName : [fieldName];

            $lib.each(fieldName, function (name)
            {
                if (_fields[name])
                {
                    clearFieldFeedback(name);
                    delete _fields[name];
                    removeBinding(name);
                }
            });
        }

        /** 
        * Removes the validation rules for all fields.
        * @param {HTMLElement} [container] A container element to restrict clearance to fields within the container.
        * @param {Boolean} [keepForRemovedField] A value indicating to keep (instead of clearing) validation rules for field elements removed from the document.
        */
        this.clear = function (container, keepForRemovedField)
        {
            var clearFields = [];

            _instance.clearFeedback(container, keepForRemovedField);

            $lib.each(_fields, function (fld, name)
            {
                if (container)
                {
                    if (fld.element && (document.contains(fld.element) || keepForRemovedField) && !container.contains(fld.element))
                        return;
                    else
                        clearFields.push(name);
                }

                removeBinding(name);
            });

            if (container)
            {
                $lib.each(clearFields, function (name)
                {
                    delete _fields[name];

                    if (_ajaxFields[name])
                        delete _ajaxFields[name];
                });
            }
            else
            {
                _fields = null;
                _ajaxFields = {};
            }
        }

        /** 
        * Removes the feedback messages for all fields.
        * @param {HTMLElement} [container] A container element to restrict clearance to fields within the container.
        * @param {Boolean} [keepForRemovedField] A value indicating to keep (instead of clearing) validation rules for field elements removed from the document.
        */
        this.clearFeedback = function (container, keepForRemovedField)
        {
            $lib.each(_fields, function (field, name)
            {
                if (container && field.element && (document.contains(field.element) || keepForRemovedField) && !container.contains(field.element))
                    return;

                clearFieldFeedback(name);
            });
        }

        /** 
        * Removes the feedback messages for the specified field name.
        */
        this.clearFieldFeedback = function (fieldName)
        {
            clearFieldFeedback(fieldName);
        }

        /** 
        * Validates all fields or the fields within the specified container element.
        * @param {HTMLElement} [container] A container element to restrict validation to fields within the container.
        * @param {Boolean} [filledOnly] A value indicating to only validate filled out fields.
        */
        this.validate = function (container, filledOnly)
        {
            return validate(container, filledOnly);
        }

        /** 
        * Validates a specific field
        * @param {String} fieldName The name of the form field.
        * @returns {boolean} A value indicating if the field is valid, works only for simple non async validations.
        */
        this.validateField = function (fieldName)
        {
            validateField(getFieldByName(fieldName));
            return _fields[fieldName].isValid;
        }

        /** 
         * Destroys the component.
         * @see {@link componyx.UI.base.methods#destroy}
         */
        this.destroy = function (...args)
        {
            _instance.clear();
            $base.methods.destroy.call(this, ...args);
        }

        function postInit()
        {
            if (_instance.rules)
                initRules();

            if (_instance.detectFields)
                _instance.detect();

            initFeedback();
            _instance.events.onPostInit.fire(_instance);
        }

        function initRules()
        {
            if (typeof _instance.rules == 'string')
                _instance.rules = window.JSON.parse(_instance.rules);

            $lib.each(_instance.rules, function (rule)
            {
                _instance.addRule(rule.fieldName, rule, rule.type);
            });
        }

        function initFeedback()
        {
            var fieldName;

            if (_instance.validFields)
            {
                for (var index = 0; _instance.validFields[index]; ++index)
                {
                    fieldName = _instance.validFields[index];
                    _fields[fieldName].isValid = true;
                    addFieldFeedback(getFieldByName(fieldName), _feedbackStatus.VALID, _fields[fieldName].feedbackId, true);
                }
            }

            for (fieldName in _instance.invalidFields)
            {
                addFieldFeedback(getFieldByName(fieldName), _feedbackStatus.INVALID, _fields[fieldName].feedbackId, true, _instance.invalidFields[fieldName]);
            }
        }

        function getFieldByName(name)
        {
            return $lib(function (el)
            {
                var fieldName = getFieldName(el);

                if (fieldName && fieldName == name)
                    return true;

                return false;
            }, _container || getForm(), '*', true);
        }

        function getRadioFields(el)
        {
            let name = getFieldName(el),
                root = getForm() || document,
                radios = root.querySelectorAll('input[type="radio"]'),
                fields = [];

            $lib.each(radios, function (r)
            {
                if (name == getFieldName(r))
                    fields.push(r);
            });

            return fields;
        }

        function getFieldName(el)
        {
            var name = el.getAttribute('name');

            if (name && name.indexOf('$') > -1 && _instance.staticASPNETFieldNames)
                name = name.substr(name.lastIndexOf('$') + 1);

            return name;
        }

        function getFieldValue(fieldEl)
        {
            let value, field = _fields[getFieldName(fieldEl)];

            if (_fieldValueFromCache && field.lastValue != null)
                return field.lastValue;

            if (' input textarea '.indexOf(' ' + fieldEl.nodeName.toLowerCase() + ' ') > -1)
            {
                if (fieldEl.type == 'radio')
                {
                    let fields = getRadioFields(fieldEl);

                    $lib.each(fields, function (el)
                    {
                        if (el.checked)
                        {
                            value = el.value;
                            return false;
                        }
                    });
                }
                else
                    value = fieldEl.value;
            }
            else if (fieldEl.nodeName.toLowerCase() == 'select')
                value = fieldEl.options[fieldEl.selectedIndex].value;
            else // content-editable
            {
                let grab = field.getValue;
                value = (grab) ? getMethod(grab)(fieldEl) : fieldEl.innerHTML;
            }

            return value;
        }

        function getForm()
        {
            if (_instance.formId)
                return $lib('#' + _instance.formId);
        }

        function validateForm(e)
        {
            _formSubmit = true;
            return validate(null, false, e);
        }

        function validate(container, filledOnly, e)
        {
            const shouldValidate = (el) =>
            {
                if (!isVisible(el))
                    return false;
                if (el.disabled)
                    return true;
                if (!filledOnly)
                    return true;
                if (el.type === 'checkbox' || el.type === 'radio')
                    return el.checked;
                return !$lib.isEmpty(getFieldValue(el));
            };

            if ($lib.isEmpty(_fields))
                return validationComplete(e);

            if (container)
            {
                let fieldEls = container.querySelectorAll(_query),
                    validated = {};

                $lib.each(fieldEls, function (el, index)
                {
                    let name = getFieldName(el);

                    if (!validated[name] && _fields[name] && shouldValidate(el))
                    {
                        validated[name] = true;
                        validateField(el, true);
                    }
                });
            }
            else
            {
                $lib.each(_fields, function (field, fieldName)
                {
                    let el = getFieldByName(fieldName);

                    if (shouldValidate(el))
                        validateField(getFieldByName(fieldName), true);
                });
            }

            if (!$lib.isEmpty(_ajaxFields))
            {
                let form = getForm();

                if (form)
                    $lib.off(form, 'submit', validateForm);

                if (e)
                    e.preventDefault();

                return false;
            }
            else
                _formSubmit = false;

            return validationComplete(e);
        }

        function isVisible(el)
        {
            if (el.type === "hidden")
                return el.parentElement.offsetParent !== null;
            else
                return el.offsetParent !== null;
        }

        function asyncValidationComplete()
        {
            var form = getForm();
            var formSubmit = _formSubmit;
            _formSubmit = false;

            var isValid = validationComplete();

            if (isValid && formSubmit)
                form.submit();

            if (formSubmit)
                $lib.on(form, 'submit', validateForm);
        }

        function validationComplete(e)
        {
            if (isValid())
            {
                var form = getForm();

                if (form)
                    _instance.setPostBackArgs(form);

                _instance.events.onValid.fire(_instance);
                return true;
            }
            else
            {
                if (e)
                    e.preventDefault();

                _instance.events.onInvalid.fire(_instance);
                return false;
            }
        }

        function isValid()
        {
            var valid = true;

            if ($lib.isEmpty(_fields))
                return valid;

            $lib.each(_fields, function (field)
            {
                return (valid = field.isValid);
            });

            return valid;
        }

        function validateFieldOnChange(field, summarise)
        {
            validateField(field, summarise);
        }

        function validateFieldOnInput(field, summarise, e)
        {
            var keyCode = e.key;

            clearLiveTimer();

            if (keyCode == 'Tab')
                return;

            _liveTimerId = setTimeout(function () { validateField(field, summarise); }, _instance.liveDelay);
        }

        function clearLiveTimer()
        {
            clearTimeout(_liveTimerId);
            _liveTimerId = null;
        }

        function validateField(fieldEl, summarise, visited = new Set())
        {
            if (visited.has(fieldEl))
                return;

            _fieldValueFromCache = false;

            let valid = true,
                validField = true,
                fieldName = getFieldName(fieldEl),
                fieldType = fieldEl.type,
                fieldValue = getFieldValue(fieldEl) || '',
                fieldData = _fields[fieldName],
                showAll = (_instance.messageDisplay == _messageDisplayOption.FEEDBACKALL || _instance.messageDisplay == _messageDisplayOption.FEEDBACKFIRST_TOOLTIPALL || _instance.messageDisplay == _messageDisplayOption.TOOLTIPALL)
                    || (summarise && (_instance.summaryMessageDisplay == _messageDisplayOption.FEEDBACKALL || _instance.summaryMessageDisplay == _messageDisplayOption.FEEDBACKFIRST_TOOLTIPALL)),
                msg = [],
                dataType = (fieldData?.[_typeOption.DATATYPE]) ? fieldData[_typeOption.DATATYPE].dataType : null;

            if (_liveTimerId)
                clearLiveTimer();

            visited.add(fieldEl);

            if (!fieldData)
            {
                validateDependentFields(fieldEl, visited);
                return;
            }

            if (fieldEl.disabled)
            {
                clearFieldFeedback(fieldName);
                fieldData.isValid = true;

                if (!summarise)
                    validationComplete();

                return;
            }

            if (_ajaxFields[fieldName])
            {
                // cache validation when field is already in async validation
                let cached = _ajaxFields[fieldName].cached;
                cached.push(function () { validateField(fieldEl, summarise); });
                return;
            }

            if (!fieldData[_typeOption.REQUIRED] && !fieldData[_typeOption.CUSTOM] && !fieldData[_typeOption.COMPARE] && !summarise && fieldData.lastValue != null && fieldData.lastValue === fieldValue && ' radio checkbox '.indexOf(fieldType) == -1)
            {
                if (_instance.messageDisplay >= _messageDisplayOption.TOOLTIPFIRST && fieldData.tooltipTrigger)
                    _tooltipManager.showTooltip(fieldData.tooltipTrigger);

                validationComplete();
                return;
            }

            _fieldValueFromCache = true;
            fieldData.lastValue = fieldValue;
            fieldData.isValid = false

            if (fieldData[_typeOption.REQUIRED])
                validField = valid = validateRequired(fieldData[_typeOption.REQUIRED], fieldEl, msg);

            if ((showAll || valid) && fieldData[_typeOption.COMPARE])
            {
                let dataType = fieldData[_typeOption.DATATYPE]?.dataType;

                valid = validateCompare(fieldData[_typeOption.COMPARE], fieldValue, dataType, msg);

                if (validField)
                    validField = valid;
            }

            if (!$lib.isEmpty(fieldValue))
            {
                if ((showAll || valid) && fieldData[_typeOption.DATATYPE])
                {
                    valid = validateType(fieldData[_typeOption.DATATYPE], fieldValue, msg);

                    if (validField)
                        validField = valid;
                }

                if ((showAll || valid) && fieldData[_typeOption.LENGTH])
                {
                    valid = validateLength(fieldData[_typeOption.LENGTH], fieldValue, msg);

                    if (validField)
                        validField = valid;
                }

                if ((showAll || valid) && fieldData[_typeOption.RANGE])
                {
                    valid = validateRange(fieldData[_typeOption.RANGE], fieldValue, dataType, msg);

                    if (validField)
                        validField = valid;
                }

                if ((showAll || valid) && fieldData[_typeOption.REGEX])
                {
                    valid = validateRegEx(fieldData[_typeOption.REGEX], fieldValue, msg);

                    if (validField)
                        validField = valid;
                }

                let settings = fieldData[_typeOption.CUSTOM];

                if (settings && (settings.alwaysCheck || showAll || valid))
                {
                    valid = validateCustom(settings, { settings: settings, field: fieldEl, fieldName: fieldName, fieldValue: fieldValue, valid: validField }, msg);

                    if (validField || settings.alwaysCheck)
                        validField = valid;
                }

                if (valid && fieldData[_typeOption.AJAX] && _instance.ajax.validate && _instance.ajax.validate.isDefined())
                {
                    validateAjax(fieldData[_typeOption.AJAX], fieldEl, fieldName, fieldValue, summarise, visited);
                    let cached = _ajaxFields[fieldName].cached;
                    cached.push(function () { validateDependentFields(fieldEl, visited); });
                    return;
                }
            }

            fieldData.isValid = validField;
            validateFieldComplete(fieldEl, summarise, msg);
            fieldData.silent = false;
            _fieldValueFromCache = false;

            validateDependentFields(fieldEl, visited);
        }

        function validateDependentFields(fieldEl, visited = new Set())
        {
            let dependentFields = [],
                fieldName = getFieldName(fieldEl),
                fieldData = _fields[fieldName];

            if (!fieldData || !fieldData[_typeOption.COMPARE])
                dependentFields = getDependentFields(fieldEl);

            dependentFields.forEach((fld) =>
            {
                let fieldName = getFieldName(fld),
                    fieldData = _fields[fieldName];

                if (fieldData)
                {
                    fieldData.silent = true;
                    validateField(fld, false, visited);
                }
            });
        }

        function getDependentFields(fieldEl)
        {
            const dependentFields = [];

            $lib.each(_fields, function (fld, name)
            {
                const compare = fld[_typeOption.COMPARE];
                if (!compare || !compare.fields)
                    return;

                compare.fields.forEach(cf =>
                {
                    const cfEl = (cf instanceof HTMLElement)
                        ? cf
                        : getFieldByName(cf);

                    if (cfEl === fieldEl)
                        dependentFields.push(getFieldByName(name));
                });
            });

            return dependentFields;
        }

        function validateRequired(settings, fieldEl, msg)
        {
            let valid = false;

            if (settings.native && !settings.when)
            {
                valid = settings.checkValidity();
            }
            else
            {
                if (settings.when && !isRequired(settings.when, fieldEl))
                    return true;

                if (fieldEl.type == 'checkbox')
                    valid = fieldEl.checked;
                else if (fieldEl.type == 'radio')
                {
                    let fields = getRadioFields(fieldEl);
                    $lib.each(fields, function (fld)
                    {
                        if (fld.checked)
                        {
                            valid = true;
                            return false;
                        }
                    });
                }
                else
                {
                    valid = !$lib.isEmpty(getFieldValue(fieldEl));
                }
            }

            if (!valid && !$lib.isEmpty(settings.msg))
                msg.push(settings.msg);

            return valid;
        }

        function isRequired(when, field)
        {
            return getMethod(when)(_instance, { field: field });
        }

        function validateType(settings, value, msg)
        {
            var valid = true;

            if (settings.native)
            {
                valid = settings.checkValidity();
            }
            else
            {
                switch (settings.dataType)
                {
                    case _dataTypeOption.INTEGER:
                        {
                            var intRegEx = new RegExp('^[0-9]*[' + $lib.escapeRegExp(_instance.groupSeparator) + ']*[0-9]+$');
                            valid = intRegEx.test(value);
                            break;
                        }
                    case _dataTypeOption.FLOAT:
                        {
                            var floatRegEx = new RegExp('^[0-9]*[' + $lib.escapeRegExp(_instance.groupSeparator) + ']?[0-9]*[' + $lib.escapeRegExp(_instance.decimalSeparator) + ']?[0-9]+$');
                            valid = floatRegEx.test(value);
                            break;
                        }
                    case _dataTypeOption.DATETIME:
                        {
                            var date = $lib.parseDate(value, _instance.dateFormat.toLowerCase());

                            if (!date)
                                valid = false;

                            break;
                        }
                    case _dataTypeOption.EMAIL:
                        {
                            valid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
                            break;
                        }
                    case _dataTypeOption.URL:
                        {
                            valid = /^(https?|ftp):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]$/.test(value);
                            break;
                        }
                    case _dataTypeOption.SOURCE:
                        {
                            valid = /^(blob:)?(https?|ftp|file):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]$/.test(value) // absolute URL with allowed protocols, blob: URLs for file inputs
                                || /^\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*$/.test(value); // relative URL starting with /
                            break;
                        }
                }
            }

            return addMsg(settings, msg, valid);
        }

        function validateLength(settings, value, msg)
        {
            let valid = true, length = value.length;

            if (settings.native)
            {
                valid = settings.checkValidity();
            }
            else
            {
                if (!$lib.isEmpty(settings.min))
                    valid = (length >= settings.min);

                if (valid && !$lib.isEmpty(settings.max))
                    valid = (length <= settings.max);
            }

            return addMsg(settings, msg, valid);
        }

        function validateRange(settings, value, dataType, msg)
        {
            var valid = true;

            if (settings.native)
            {
                valid = settings.checkValidity();
            }
            else
            {
                if (dataType == _dataTypeOption.DATETIME)
                {
                    var date = $lib.parseDate(value, _instance.dateFormat.toLowerCase()),
                        minDate = $lib.parseDate(settings.min, _instance.dateFormat.toLowerCase()),
                        maxDate = $lib.parseDate(settings.max, _instance.dateFormat.toLowerCase());

                    if (date)
                    {
                        if (minDate)
                            valid = comparableDate(date) >= comparableDate(minDate);

                        if (maxDate && valid)
                            valid = comparableDate(date) <= comparableDate(maxDate);
                    }
                    else
                        valid = false;
                }
                else if (dataType == _dataTypeOption.INTEGER || dataType == _dataTypeOption.FLOAT)
                {
                    var number = value.replace(_instance.decimalSeparator, '.');

                    valid = (!isNaN(number));

                    if (valid)
                    {
                        if (!isNaN(settings.min))
                            valid = parseFloat(number) >= parseFloat(settings.min);

                        if (valid && !isNaN(settings.max))
                            valid = parseFloat(number) <= parseFloat(settings.max);
                    }
                }
                else
                {
                    if (!$lib.isEmpty(settings.min))
                        valid = (value >= settings.min);

                    if (valid && !$lib.isEmpty(settings.max))
                        valid = (value <= settings.max);
                }
            }

            return addMsg(settings, msg, valid);
        }

        function validateRegEx(settings, value, msg)
        {
            let valid = false;

            if (settings.native)
            {
                valid = settings.checkValidity();
            }
            else
            {
                if (typeof settings.pattern == 'string')
                    settings.pattern = new RegExp(settings.pattern);

                valid = settings.pattern.test(value);
            }

            return addMsg(settings, msg, valid);
        }

        function validateCompare(settings, value, dataType, msg)
        {
            const fields = settings.fields,
                operators = settings.operators || [];

            let valid = true;

            for (let i = 0; i < fields.length; i++)
            {
                const f = fields[i],
                    operator = operators[i] || operators[0] || '==';

                let compareValue;

                if (f instanceof HTMLElement)
                {
                    compareValue = f.value;
                }
                else if (typeof f === 'string')
                {
                    const el = getFieldByName(f);
                    compareValue = el ? el.value : f; // fallback: treat as literal value
                } else
                {
                    compareValue = f; // literal value
                }

                // convert types
                if (dataType === _dataTypeOption.INTEGER || dataType === _dataTypeOption.FLOAT)
                {
                    const v1 = parseFloat(value.replace(_instance.decimalSeparator, '.')),
                        v2 = parseFloat(compareValue.replace(_instance.decimalSeparator, '.'));

                    if (isNaN(v1) || isNaN(v2))
                        return addMsg(settings, msg, false);

                    value = v1;
                    compareValue = v2;
                } else if (dataType === _dataTypeOption.DATETIME)
                {
                    const fmt = _instance.dateFormat.toLowerCase(),
                        d1 = $lib.parseDate(value, fmt),
                        d2 = $lib.parseDate(compareValue, fmt);

                    if (!d1 || !d2)
                        return addMsg(settings, msg, false);

                    value = comparableDate(d1);
                    compareValue = comparableDate(d2);
                }

                // compare
                switch (operator)
                {
                    case '<': valid = value < compareValue; break;
                    case '<=': valid = value <= compareValue; break;
                    case '>=': valid = value >= compareValue; break;
                    case '>': valid = value > compareValue; break;
                    default: valid = value == compareValue;
                }

                if (!valid) break;
            }

            return addMsg(settings, msg, valid);
        }


        function validateCustom(settings, obj, msg)
        {
            return addMsg(settings, msg, getMethod(settings.onValidation)(_instance, obj));
        }

        function validateAjax(settings, fieldEl, name, value, summarise)
        {
            var data;

            _ajaxFields[name] = { cached: [] };

            if (settings.onBeforeValidation)
                data = getMethod(settings.onBeforeValidation)(_instance, { field: fieldEl, fieldName: name, fieldValue: value, feedbackId: _fields[name].feedbackId, settings: settings });

            if (settings.data)
                data = (data) ? $lib.clone(data, settings.data, true) : settings.data;

            if (data && data.validationFields && data.validationFields[0])
            {
                if ($lib.isEmpty(data.validationFields[0].fieldName))
                    data.validationFields[0].fieldName = name;

                if ($lib.isEmpty(data.validationFields[0].value))
                    data.validationFields[0].value = value;
            }

            _validatingTimerId = setTimeout(function () { addFieldFeedback(fieldEl, _feedbackStatus.VALIDATING, _fields[name].feedbackId, false); }, _instance.validatingFieldMessageDelay);

            _instance.ajaxCall('validate', data,
                {
                    onSuccess: function (ajaxArgs)
                    {
                        validateAjaxFieldComplete(fieldEl, name, value, settings, summarise, ajaxArgs);
                    },
                    onError: function (ajaxArgs)
                    {
                        validateAjaxFieldComplete(fieldEl, name, value, settings, summarise, ajaxArgs, true);
                    }
                });
        }

        function addMsg(settings, msg, valid)
        {
            if (!valid && !$lib.isEmpty(settings.msg) && msg)
                msg.push(settings.msg);

            return valid;
        }

        function validateAjaxFieldComplete(field, fieldName, fieldValue, settings, summarise, ajaxArgs, ajaxError)
        {
            var msg,
                fieldData = _fields[fieldName],
                cached = _ajaxFields[fieldName].cached,
                data = settings.data;

            if (_validatingTimerId)
                clearTimeout(_validatingTimerId);

            _validatingTimerId = null;
            fieldData.lastValue = fieldData.lastMsg = null;
            fieldData.isValid = false;
            fieldData.silent = false;
            msg = _instance.ajaxErrorMessage;

            if (data && data.validationFields)
            {
                $lib.each(data.validationFields, function (field)
                {
                    field.fieldName = field.value = null;
                });
            }

            if (!ajaxError)
            {
                msg = (!$lib.isEmpty(ajaxArgs.data.msg)) ? ajaxArgs.data.msg : settings.msg;

                fieldData.lastValue = fieldValue;
                fieldData.lastMsg = msg;
                fieldData.isValid = ajaxArgs.data.isValid;

                if (!ajaxArgs.data.isValid && (!msg.constructor || msg.constructor.toString().indexOf('Array') == -1))
                    msg = [msg];

                if (settings.onAfterValidation)
                    getMethod(settings.onAfterValidation)(_instance, { field: field, fieldName: fieldName, fieldValue: fieldValue });
            }

            validateFieldComplete(field, summarise, msg, true);
            delete _ajaxFields[fieldName];

            if (cached && cached.length)
                cached.forEach((callback) => callback());
        }

        function validateFieldComplete(fieldEL, summarise, msg, async)
        {
            var fieldName = getFieldName(fieldEL),
                fieldValue = getFieldValue(fieldEL),
                fieldData = _fields[fieldName],
                showValid = _instance.showValidFields,
                args = eventArgs(fieldEL, fieldName, fieldValue, fieldData, msg);

            clearCss(fieldEL);

            // fire event
            (fieldData.isValid) ? _instance.events.onValidField.fire(_instance, args) : _instance.events.onInvalidField.fire(_instance, args);

            if (fieldData.isValid && (showValid == _showValidFieldsOption.ALL
                || (showValid == _showValidFieldsOption.FILLED && !$lib.isEmpty(fieldValue))
                || (showValid == _showValidFieldsOption.REQUIRED && fieldData[_typeOption.REQUIRED])))
            {
                clearFieldFeedback(fieldName);
                addFieldFeedback(fieldEL, _feedbackStatus.VALID, _fields[fieldName].feedbackId, summarise, msg);
            }
            else if (!fieldData.isValid)
            {
                addFieldFeedback(fieldEL, _feedbackStatus.INVALID, _fields[fieldName].feedbackId, summarise, msg);
            }
            else
            {
                clearFieldFeedback(fieldName);
            }

            if (!summarise && !async)
                validationComplete();
            else if (async && $lib.isEmpty(_ajaxFields))
                asyncValidationComplete();
        }

        function eventArgs()
        {
            var args = arguments;
            return { fieldElement: args[0], fieldName: args[1], fieldValue: args[2], fieldData: args[3], msg: args[4], feedbackElement: args[5], summaryElement: args[6] }
        }

        function comparableDate(date)
        {
            return parseInt(date.getFullYear() + addNil(date.getMonth(), true) + addNil(date.getDate(), true));
        }

        function addNil(val, leadingZero)
        {
            val = val.toString();

            if (!leadingZero)
                return val;

            return (val.length != 2) ? '0' + val : val;
        }

        function addFieldFeedback(fieldEl, status, feedbackId, summarise, msg)
        {
            if (!fieldEl)
                return;

            var feedbackContainer = (feedbackId) ? $lib('#' + feedbackId) : getFeedbackElement(fieldEl),
                summaryContainer = (_instance.summaryContainerId) ? $lib('#' + _instance.summaryContainerId) : null,
                fieldName = getFieldName(fieldEl),
                fieldValue = getFieldValue(fieldEl),
                fieldData = _fields[fieldName],
                silent = fieldData.silent,
                values = {},
                summarise = summaryContainer && summarise,
                triggerClass = _instance.cssClassTooltipTrigger || _classOption.TOOLTIPTRIGGER,
                invalidCssClass = _instance.cssClassInvalid || _classOption.INVALID,
                validCssClass = _instance.cssClassValid || _classOption.VALID,
                validatingCssClass = _instance.cssClassValidating || _classOption.VALIDATING,
                ulFeedback, ulSummary, ul, li, liSummary;

            if (!silent)
            {
                if (feedbackContainer && _instance.messageDisplay > _messageDisplayOption.NONE)
                {
                    ul = document.createElement('ul');

                    if (fieldData.feedbackElement?.isConnected)
                    {
                        ulFeedback = fieldData.feedbackElement;
                        ulFeedback.parentNode.replaceChild(ul, ulFeedback);
                    }

                    fieldData.feedbackElement = ulFeedback = ul;
                    addValidatorClass(ulFeedback);
                    $lib.addClass(ulFeedback, _instance.cssClassFeedback || _classOption.FEEDBACK);
                    feedbackContainer.appendChild(ulFeedback);
                }

                if (summarise && ((status == _feedbackStatus.INVALID && _instance.summaryMessageDisplay > _messageDisplayOption.NONE) || (status == _feedbackStatus.VALID && _instance.showValidFieldsInSummary)))
                {
                    ul = document.createElement('ul');

                    if (fieldData.summaryElement?.isConnected)
                    {
                        ulSummary = fieldData.summaryElement;
                        ulSummary.parentNode.replaceChild(ul, ulSummary);
                    }

                    fieldData.summaryElement = ulSummary = ul;
                    addValidatorClass(ulSummary);
                    $lib.addClass(ulSummary, _instance.cssClassSummary || _classOption.SUMMARY);
                    summaryContainer.appendChild(ulSummary);
                }

                values['fieldName'] = _instance.friendlyFieldNames[fieldName] || fieldName;
                values['icon'] = $lib.format('<span class="{0}"></span>', _instance.cssClassIcon || _classOption.ICON);
            }

            switch (status)
            {
                case _feedbackStatus.VALIDATING:
                    {
                        if (_instance.validationCssOnField)
                            $lib.addClass(fieldEl, validatingCssClass);

                        if (!ulFeedback)
                            break;

                        values['message'] = _instance.validatingFieldMessage;

                        if (ulFeedback)
                            createItem(ulFeedback, validatingCssClass, 'ValidatingFieldFeedback', values);

                        break;
                    }
                case _feedbackStatus.VALID:
                    {
                        if (_instance.validationCssOnField)
                            $lib.addClass(fieldEl, validCssClass);

                        if (!ulFeedback && !ulSummary)
                            break;

                        values['message'] = _instance.validFieldMessage;

                        if (ulFeedback)
                            createItem(ulFeedback, validCssClass, 'ValidFieldFeedback', values);

                        if (ulSummary)
                            createItem(ulSummary, validCssClass, 'ValidFieldSummary', values);

                        break;
                    }
                case _feedbackStatus.INVALID:
                    {
                        if (_instance.validationCssOnField)
                            $lib.addClass(fieldEl, invalidCssClass);

                        if (silent || (!ulFeedback && !ulSummary && _instance.messageDisplay < 3))
                            break;

                        let multipleStart = $lib.format('<span class="{0}">', _instance.cssClassMultiple || _classOption.MULTIPLE),
                            tooltipTriggerStart = $lib.format('<span class="{0}">', triggerClass),
                            spanEnd = '</span>',
                            tooltipTriggerKey = 'tooltipTrigger',
                            multipleKey = 'multiple';

                        $lib.addClass(ulFeedback, invalidCssClass);
                        values['messageCount'] = msg.length;
                        values['tooltipTrigger'] = values['/tooltipTrigger'] = '';
                        values['multiple'] = '<span style="display:none;">';
                        values['/multiple'] = '</span>';

                        if (!msg.length)
                            msg.push(_instance.invalidFieldMessage);

                        if (msg.length > 1)
                        {
                            if (_instance.messageDisplay == _messageDisplayOption.FEEDBACKFIRST_TOOLTIPALL)
                            {
                                values[multipleKey] = multipleStart;
                                values[tooltipTriggerKey] = tooltipTriggerStart;
                                values['/' + tooltipTriggerKey] = spanEnd;
                            }
                        }

                        $lib.each(msg, function (msg, index)
                        {
                            values['message'] = msg;

                            if (ulFeedback)
                            {
                                if (_instance.messageDisplay < _messageDisplayOption.TOOLTIPFIRST && (index == 0 || _instance.messageDisplay == _messageDisplayOption.FEEDBACKALL))
                                    li = createItem(ulFeedback, invalidCssClass, 'InvalidFieldFeedback', values);
                            }

                            if (ulSummary)
                            {
                                if (index == 0 || _instance.messageDisplay == _messageDisplayOption.FEEDBACKALL)
                                    liSummary = createItem(ulSummary, invalidCssClass, 'InvalidFieldSummary', values);
                            }
                        });

                        if (msg.length > 0)
                        {
                            if (_instance.messageDisplay >= _messageDisplayOption.TOOLTIPFIRST)
                                addTooltip(fieldEl, msg, false, fieldData);
                            else if (ulFeedback && _instance.messageDisplay == _messageDisplayOption.FEEDBACKFIRST_TOOLTIPALL)
                                addTooltip($lib(triggerClass, li, '', true), msg, true, fieldData);

                            if (ulSummary && _instance.summaryMessageDisplay == _messageDisplayOption.FEEDBACKFIRST_TOOLTIPALL)
                                addTooltip($lib(triggerClass, liSummary, '', true), msg, true, fieldData, true);
                        }

                        break;
                    }
            }

            fieldData.lastMsg = msg;

            _instance.events.onFieldFeedback.fire(_instance, eventArgs(fieldEl, fieldName, fieldValue, fieldData, msg, ulFeedback, ulSummary));
        }

        function createItem(ul, cssClass, template, values)
        {
            $lib.addClass(ul, cssClass);
            var li = ul.appendChild(document.createElement('li'));
            _instance.applyTemplate(li, template, values);

            return li;
        }

        function clearFieldFeedback(fieldName)
        {
            if (!fieldName)
                return;

            var fieldData = _fields[fieldName];

            if (fieldData.feedbackElement)
                fieldData.feedbackElement.innerHTML = '';
            if (fieldData.summaryElement)
                fieldData.summaryElement.innerHTML = '';

            fieldData.lastMsg = null;

            if (fieldData.tooltipId)
            {
                _tooltipManager.hideTooltip(fieldData.tooltipTrigger);
                _tooltipManager.removeTrigger(fieldData.tooltipTrigger);
                fieldData.tooltipId = fieldData.tooltipTrigger = null;
            }

            if (fieldData.summaryTooltipId)
            {
                _tooltipManager.hideTooltip(fieldData.summaryTooltipTrigger);
                _tooltipManager.removeTrigger(fieldData.summaryTooltipTrigger);
                fieldData.summaryTooltipId = fieldData.summaryTooltipTrigger = null;
            }

            if (fieldData.element)
                clearCss(fieldData.element);
        }

        function clearCss(element)
        {
            if (!element)
                return;

            var invalidCssClass = _instance.cssClassInvalid || _classOption.INVALID,
                validCssClass = _instance.cssClassValid || _classOption.VALID,
                validatingCssClass = _instance.cssClassValidating || _classOption.VALIDATING;

            $lib.removeClass(element, validatingCssClass + ' ' + validCssClass + ' ' + invalidCssClass);
        }

        function createTooltipManager()
        {
            var id = _instance.id + '_TooltipManager';

            _tooltipManager = $UI.createComponent(componyx.UI.TooltipManager, { id: id });
            _tooltipManager.clone($UI.store[_instance.tooltipManagerId], _instance, true, true, { triggers: '' });
            _tooltipManager.singleBoxInstance = false;

            if (!_tooltipManager.boxId)
            {
                var box = $UI.createComponent(componyx.UI.Box, { id: id + '_TempBox' });
                box.expandDirection = componyx.UI.Box.ExpandDirectionOption.DOWN;
                box.autoPosition = componyx.UI.Box.AutoPositionOption.EXPAND;
                box.autoInvertFit = true;
                _tooltipManager.boxId = box.id;
            }

            _tooltipManager.show();
        }

        function addTooltip(el, msg, isTrigger, fieldData, summary)
        {
            if (!el)
                return;

            var ul = document.createElement('ul'), values = {},
                id = (summary) ? fieldData.summaryTooltipId : fieldData.tooltipId;

            if (!id)
                id = $lib.guid();

            if (summary)
            {
                fieldData.summaryTooltipId = id;
                fieldData.summaryTooltipTrigger = el;
            }
            else
            {
                fieldData.tooltipId = id;
                fieldData.tooltipTrigger = el;
            }

            addValidatorClass(ul);
            $lib.addClass(ul, 'tooltip');

            $lib.each(msg, function (msg)
            {
                values['message'] = msg;
                _instance.applyTemplate(ul.appendChild(document.createElement('li')), 'InvalidFieldPopup', values);
            });

            _tooltipManager.addTooltip(id, ul); // add or update

            if (isTrigger) // trigger element
            {
                el.setAttribute('tabindex', _instance.tooltipTriggerTabIndex || '0');
                _tooltipManager.addTrigger(el, id);
            }
            else // field
                _tooltipManager.addTrigger(el, id, 0, false, false); // show on blur

            if (!isTrigger)
                _tooltipManager.showTooltip(el);
        }

        function hideTooltip(fieldName)
        {
            var fieldData = _fields[fieldName];

            if (fieldData.tooltipTrigger)
                _tooltipManager.hideTooltip(fieldData.tooltipTrigger);
        }

        function getFeedbackElement(field)
        {
            if (!_instance.feedbackIdentifyingCssClass)
                return null;

            var feedbackElement = null;

            $lib(function (el, stop)
            {
                if (feedbackElement = $lib(_instance.feedbackIdentifyingCssClass, el)[0])
                {
                    stop();
                    return false;
                }

                return false;

            }, field, '', false, true);

            return feedbackElement || null;
        }

        function addValidatorClass(el)
        {
            $lib.addClass(el, _instance.className || _classOption.VALIDATOR);

            if (_instance.theme > $base.static.ThemeOption.NONE)
            {
                $lib.addClass(el, 'theme');
                $lib.addClass(el, _themes[parseInt(_instance.theme, 10) - 1]);
            }
        }

        function getMethod(method)
        {
            return $base.static.getMethod(method);
        }

        function hasRule(name)
        {
            if (!_fields[name])
                return false;

            for (var key in _typeOption)
            {
                if (_fields[name][_typeOption[key]])
                    return true;
            }

            return false;
        }

        function resetState(field, name)
        {
            if (!field)
                return;

            field.isValid = false;
            field.lastValue = null;

            if (!field[_typeOption.REQUIRED] && $lib.isEmpty(getFieldValue(field.element || getFieldByName(name)))) // not required and no field value 
                field.isValid = true;
        }

        function removeBinding(name)
        {
            let fieldEl = getFieldByName(name),
                fieldEls = [fieldEl];

            if (!fieldEl)
                return;

            if (fieldEl.type == 'radio')
                fieldEls = getRadioFields(fieldEl);

            $lib.each(fieldEls, function (fld)
            {
                $lib.off(fld, 'blur change', validateFieldOnChange);
                $lib.off(fld, 'focus', hideTooltip);
                $lib.off(fld, 'input', validateFieldOnInput);
            });
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.Validator.prototype = Object.create($base.methods);
    componyx.UI.Validator.prototype.constructor = componyx.UI.Validator;

    /**
    * TypeOption
    * @readonly
    * @enum {number}
    * @memberof componyx.UI.Validator
    */
    componyx.UI.Validator.TypeOption =
    {
        REQUIRED: 0,
        DATATYPE: 1,
        LENGTH: 2,
        RANGE: 3,
        REGEX: 4,
        COMPARE: 5,
        CUSTOM: 6,
        AJAX: 7
    }

    /**
    * DataTypeOption
    * @readonly
    * @enum {number}
    * @memberof componyx.UI.Validator 
    */
    componyx.UI.Validator.DataTypeOption =
    {
        INTEGER: 0,
        FLOAT: 1,
        DATETIME: 2,
        EMAIL: 3,
        URL: 4,
        SOURCE: 5
    }

    /**
    * ShowValidFieldsOption
    * @readonly
    * @enum {number}
    * @memberof componyx.UI.Validator
    */
    componyx.UI.Validator.ShowValidFieldsOption =
    {
        NONE: 0,
        REQUIRED: 1,
        FILLED: 2,
        ALL: 3
    }

    /**
    * MessageDisplayOption
    * @readonly
    * @enum {number}
    * @memberof componyx.UI.Validator
    */
    componyx.UI.Validator.MessageDisplayOption =
    {
        NONE: 0,
        FEEDBACKFIRST: 1,
        FEEDBACKALL: 2,
        FEEDBACKFIRST_TOOLTIPALL: 3,
        TOOLTIPFIRST: 4,
        TOOLTIPALL: 5
    }

    /**
     * @typedef {object} ValidationData
     * @memberof componyx.UI.Validator
     * @property {string} fieldName The name of the field to validate.
     * @property {string} value The value of the field to validate.
     */

    /**
     * @typedef {object} ValidationArgs
     * @memberof componyx.UI.Validator
     * @property {HTMLElement} [field] The field.
     * @property {string} [fieldName] The field name.
     * @property {string} [fieldValue] The field value.
     * @property {string} [feedbackId] The field feedback identifier.
     * @property {object} [settings] The validation settings of the field.
    */

    /**
     * @callback OnValidation
     * @memberof componyx.UI.Validator
     * @param {componyx.UI.Validator} sender
     * @param {ValidationArgs} args
     * @returns {boolean} A value indicating if the validation result is valid or invalid.
     */
    /**
     * @callback OnBeforeValidation
     * @memberof componyx.UI.Validator
     * @param {componyx.UI.Validator} sender
     * @param {ValidationArgs} args
     * @returns {ValidationData[]} The validation data.
     */
    /**
     * @callback OnAfterValidation
     * @memberof componyx.UI.Validator
     * @param {componyx.UI.Validator} sender
     * @param {ValidationArgs} args
     */

    /**
    * Creates a Rule object instance.
    * @class
    * @property {String} fieldName Gets or sets the field name to which the rule applies.
    * @property {TypeOption} type Gets or sets the validation type of the rule.
    * @param {String} feedbackId Gets or sets the identifier of the element used by the Validator to display validation result feedback.
    * @param {Boolean} autoValidate Gets or sets a value indicating if the field is validated when the field value changes.
    * @param {Boolean} live Gets or sets a value indicating if the field validation is done while typing.
    * @param {Function} getValue A custom method to return the value for this field. Passes in the field element and expects the field value as result.
    * @param {String} msg Gets or sets the message to display if validation fails.
    * @param {Number|String} min Gets or sets the minimum value. (LENGTH and RANGE type validation).
    * @param {Number|String} max Gets or sets the maximum value. (LENGTH and RANGE type validation).
    * @param {RegExp} pattern Gets or sets the Regular expression pattern (REGEX type validation).
    * @param {HTMLElement|String} field Gets or sets the element or element id (COMPARE type validation).
    * @param {componyx.UI.DataTypeOption} dataType Gets or sets the data type (DATATYPE type validation).
    * @param {componyx.UI.OnValidation} onValidation Gets or sets a function invoked when the field is validated (CUSTOM type validation).
    * @param {componyx.UI.OnBeforeValidation} onBeforeValidation Gets or sets a function invoked before the field is validated (AJAX type validation).
    * @param {componyx.UI.OnAfterValidation} onAfterValidation Gets or sets a function invoked after the field is validated (AJAX type validation).
    * @param {Object} data Gets or sets the data query for the AJAX type validation.
    */
    componyx.UI.Validator.Rule = function ()
    {
        this.fieldName = null;
        this.type = null;
        this.feedbackId = null;
        this.autoValidate = null;
        this.getValue = null;
        this.live = null;
        this.msg = null;
        this.min = null;
        this.max = null;
        this.pattern = null;
        this.field = null;
        this.dataType = null;
        this.onValidation = null;
        this.onBeforeValidation = null;
        this.onAfterValidation = null;
    }
})(window);