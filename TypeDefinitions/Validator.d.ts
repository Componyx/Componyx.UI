/**
 * <p>Root namespace for componyx components and utilities (shorthand: CMP).</p>
 */
declare namespace componyx 
{
    namespace UI
    {
        namespace Validator 
        {
            /**
            * @property onPreInit - <p>Event which fires before the initialization but after loading resources.</p>
            * @property onPostInit - <p>Event which fires after the initialization of the validator.</p>
            * @property onValidField - <p>Event which fires when validation for a field passes.</p>
            * @property onInvalidField - <p>Event which fires when validation for a field fails.</p>
            * @property onValid - <p>Event which fires when validation passes.</p>
            * @property onInvalid - <p>Event which fires when validation fails.</p>
            * @property onFieldFeedback - <p>Event which fires when feedback for a field is set.</p>
            */
            class ValidatorEvents extends componyx.UI.base.Events<componyx.UI.Validator>
            {
                constructor();
                /**
                 * <p>Event which fires before the initialization but after loading resources.</p>
                */
                onPreInit: componyx.UI.base.Event<componyx.UI.Validator, undefined>;
                /**
                 * <p>Event which fires after the initialization of the validator.</p>
                */
                onPostInit: componyx.UI.base.Event<componyx.UI.Validator, undefined>;
                /**
                 * <p>Event which fires when validation for a field passes.</p>
                */
                onValidField: componyx.UI.base.Event<componyx.UI.Validator, componyx.UI.Validator.FieldEventArgs>;
                /**
                 * <p>Event which fires when validation for a field fails.</p>
                */
                onInvalidField: componyx.UI.base.Event<componyx.UI.Validator, componyx.UI.Validator.FieldEventArgs>;
                /**
                 * <p>Event which fires when validation passes.</p>
                */
                onValid: componyx.UI.base.Event<componyx.UI.Validator, undefined>;
                /**
                 * <p>Event which fires when validation fails.</p>
                */
                onInvalid: componyx.UI.base.Event<componyx.UI.Validator, undefined>;
                /**
                 * <p>Event which fires when feedback for a field is set.</p>
                */
                onFieldFeedback: componyx.UI.base.Event<componyx.UI.Validator, componyx.UI.Validator.FieldEventArgs>;
            }
            /**
             * <p>Validator field event arguments.</p>
             */
            type FieldEventArgs = {
                /** <p>The validated field element.</p> */
                fieldElement: HTMLElement;
                /** <p>The name of the field.</p> */
                fieldName: string;
                /** <p>The value of the field.</p> */
                fieldValue: string;
                /** <p>The internal validation data of the field (validation settings and state).</p> */
                fieldData: any;
                /** <p>The validation messages.</p> */
                msg: string[];
                /** <p>The feedback list element (onFieldFeedback only, when feedback is displayed).</p> */
                feedbackElement?: HTMLUListElement;
                /** <p>The summary list element (onFieldFeedback only, when the field is summarised).</p> */
                summaryElement?: HTMLUListElement;
            };
            /**
             * <p>TypeOption</p>
             */
            enum TypeOption
            {
                REQUIRED = 0,
                DATATYPE = 1,
                LENGTH = 2,
                RANGE = 3,
                REGEX = 4,
                COMPARE = 5,
                CUSTOM = 6,
                AJAX = 7
            }
            /**
             * <p>DataTypeOption</p>
             */
            enum DataTypeOption
            {
                INTEGER = 0,
                FLOAT = 1,
                DATETIME = 2,
                EMAIL = 3,
                URL = 4,
                SOURCE = 5
            }
            /**
             * <p>ShowValidFieldsOption</p>
             */
            enum ShowValidFieldsOption
            {
                NONE = 0,
                REQUIRED = 1,
                FILLED = 2,
                ALL = 3
            }
            /**
             * <p>MessageDisplayOption</p>
             */
            enum MessageDisplayOption
            {
                NONE = 0,
                FEEDBACKFIRST = 1,
                FEEDBACKALL = 2,
                FEEDBACKFIRST_TOOLTIPALL = 3,
                TOOLTIPFIRST = 4,
                TOOLTIPALL = 5
            }
            /**
             * @property fieldName - <p>The name of the field to validate.</p>
             * @property value - <p>The value of the field to validate.</p>
             */
            type ValidationData = {
                fieldName: string;
                value: string;
            };
            /**
             * @property [field] - <p>The field.</p>
             * @property [fieldName] - <p>The field name.</p>
             * @property [fieldValue] - <p>The field value.</p>
             * @property [feedbackId] - <p>The field feedback identifier.</p>
             * @property [settings] - <p>The validation settings of the field.</p>
             */
            type ValidationArgs = {
                field?: HTMLElement;
                fieldName?: string;
                fieldValue?: string;
                feedbackId?: string;
                settings?: any;
            };
            type OnValidation = (sender: componyx.UI.Validator, args: ValidationArgs) => boolean;
            type OnBeforeValidation = (sender: componyx.UI.Validator, args: ValidationArgs) => ValidationData[];
            type OnAfterValidation = (sender: componyx.UI.Validator, args: ValidationArgs) => void;
            /**
             * <p>Creates a Rule object instance.</p>
             * @property fieldName - <p>Gets or sets the field name to which the rule applies.</p>
             * @property type - <p>Gets or sets the validation type of the rule.</p>
             * @param feedbackId - <p>Gets or sets the identifier of the element used by the Validator to display validation result feedback.</p>
             * @param autoValidate - <p>Gets or sets a value indicating if the field is validated when the field value changes.</p>
             * @param live - <p>Gets or sets a value indicating if the field validation is done while typing.</p>
             * @param getValue - <p>A custom method to return the value for this field. Passes in the field element and expects the field value as result.</p>
             * @param msg - <p>Gets or sets the message to display if validation fails.</p>
             * @param min - <p>Gets or sets the minimum value. (LENGTH and RANGE type validation).</p>
             * @param max - <p>Gets or sets the maximum value. (LENGTH and RANGE type validation).</p>
             * @param pattern - <p>Gets or sets the Regular expression pattern (REGEX type validation).</p>
             * @param field - <p>Gets or sets the element or element id (COMPARE type validation).</p>
             * @param dataType - <p>Gets or sets the data type (DATATYPE type validation).</p>
             * @param onValidation - <p>Gets or sets a function invoked when the field is validated (CUSTOM type validation).</p>
             * @param onBeforeValidation - <p>Gets or sets a function invoked before the field is validated (AJAX type validation).</p>
             * @param onAfterValidation - <p>Gets or sets a function invoked after the field is validated (AJAX type validation).</p>
             * @param data - <p>Gets or sets the data query for the AJAX type validation.</p>
             */
            class Rule
            {
                constructor();
                /** <p>Gets or sets the field name to which the rule applies.</p> */
                fieldName: string | null;
                /** <p>Gets or sets the validation type of the rule.</p> */
                type: componyx.UI.Validator.TypeOption | null;
                /** <p>Gets or sets the id of the feedback element.</p> */
                feedbackId: string | null;
                /** <p>Gets or sets a value indicating if the field is validated automatically.</p> */
                autoValidate: boolean | null;
                /** <p>Gets or sets a function returning the value to validate.</p> */
                getValue: ((...params: any[]) => any) | null;
                /** <p>Gets or sets a value indicating if the field is validated while typing.</p> */
                live: boolean | null;
                /** <p>Gets or sets the validation message.</p> */
                msg: string | null;
                /** <p>Gets or sets the minimum value (LENGTH and RANGE type validation).</p> */
                min: number | string | null;
                /** <p>Gets or sets the maximum value (LENGTH and RANGE type validation).</p> */
                max: number | string | null;
                /** <p>Gets or sets the Regular expression pattern (REGEX type validation).</p> */
                pattern: RegExp | null;
                /** <p>Gets or sets the element or element id (COMPARE type validation).</p> */
                field: HTMLElement | string | null;
                /** <p>Gets or sets the data type (DATATYPE type validation).</p> */
                dataType: componyx.UI.Validator.DataTypeOption | null;
                /** <p>Gets or sets a function invoked when the field is validated (CUSTOM type validation).</p> */
                onValidation: componyx.UI.Validator.OnValidation | null;
                /** <p>Gets or sets a function invoked before the field is validated (AJAX type validation).</p> */
                onBeforeValidation: componyx.UI.Validator.OnBeforeValidation | null;
                /** <p>Gets or sets a function invoked after the field is validated (AJAX type validation).</p> */
                onAfterValidation: componyx.UI.Validator.OnAfterValidation | null;
            }
        }

        interface Validator extends Omit<componyx.UI.base.methods, 'hide'> { }
        /**
         * <p>Validator class.</p>
         * @property cssClassFeedback - <p>Gets or sets the css class of a feedback ul element.</p>
         * @property cssClassSummary - <p>Gets or sets the css class of a summary ul element.</p>
         * @property cssClassValidating - <p>Gets or sets the css class of the feedback message when server-side validation is processing.</p>
         * @property cssClassValid - <p>Gets or sets the css class of the feedback/summary message when the input field passes validation.</p>
         * @property cssClassInvalid - <p>Gets or sets the css class of the feedback/summary message when the input field fails validation.</p>
         * @property cssClassIcon - <p>Gets or sets the css class of the icon in a feedback or summary message.</p>
         * @property cssClassTooltipTrigger - <p>Gets or sets the css class of the tooltip trigger.</p>
         * @property validatingFieldMessage - <p>Gets or sets the message which is shown when ajax validation is processing.</p>
         * @property validFieldMessage - <p>Gets or sets the message which is shown when a field passes validation.</p>
         * @property invalidFieldMessage - <p>Gets or sets the message which is shown when a field fails validation. Message is not shown when the ErrorMessage is defined on the model property.</p>
         * @property ajaxErrorMessage - <p>Gets or sets the message which is shown when ajax validation throws an error.</p>
         * @property validatingFieldMessageDelay - <p>Gets or sets the delay for the validating field message which is shown when ajax validation is processing.</p>
         * @property showValidFields - <p>Gets or sets when valid fields are displayed.</p>
         * @property messageDisplay - <p>Gets or sets a value indicating how validation messages are being displayed.</p>
         * @property summaryMessageDisplay - <p>Gets or sets a value indicating how validation messages are being displayed in the summary container.</p>
         * @property showValidFieldsInSummary - <p>Gets or sets a value indicating whether valid fields are also displayed in the summary container.</p>
         * @property feedbackIdentifyingCssClass - <p>Gets or sets the identifying css class of the field feedback container.</p>
         * @property [summaryContainerId] - <p>Gets or sets the container id of the validation message summary.</p>
         * @property [formId] - <p>Gets or sets the form id of the form that holds the input fields when using multiple forms on a single page.</p>
         * @property dateFormat - <p>Gets or sets the input format for dates. Default: MM/dd/yyyy</p>
         * @property decimalSeparator - <p>Gets or sets the input decimal separator for numbers. Default: '.'</p>
         * @property groupSeparator - <p>Gets or sets the input group separator for numbers. Default: ','</p>
         * @property rules - <p>Gets or sets the initial validator rules (Array or JSON string).</p>
         * @property validFields - <p>Gets or sets the fields which passed validation on postback.</p>
         * @property invalidFields - <p>Gets or sets the fields which failed validation on postback.</p>
         * @property friendlyFieldNames - <p>List containing the friendly field names.</p>
         * @property staticASPNETFieldNames - <p>Gets or sets a value indicating whether auto generated field names should be corrected to static names.</p>
         * @property validationCssOnField - <p>Gets or sets a value indicating whether the validation status css classes are applied to the (input/textarea/select/contenteditable) field (defaults to true).</p>
         * @property live - <p>Gets or sets a value indicating whether field validation should be performed while typing (defaults to false).</p>
         * @property liveDelay - <p>Gets or sets the delay in milliseconds before the live field validation is performed.</p>
         * @property detectFields - <p>Gets or sets a value indicating if fields are being detected when the component initializes.</p>
         * @property tooltipTriggerTabIndex - <p>Gets or sets the tabindex of the tooltip trigger element.</p>
         * @property tooltipManagerId - <p>Gets or sets the tooltip manager used to display tooltips.</p>
         * @param id - <p>The id of the component.</p>
         * @param properties - <p>The properties used to initialize the component or the container element.</p>
         */
        class Validator extends componyx.UI.base.Component
        {
            constructor(id: string, properties: any | HTMLElement);
            ajax: componyx.UI.base.Component['ajax'] & {
                /**
                 * <p>AJAX method used to validate field values on the server.</p>
                 */
                validate: componyx.UI.base.AjaxMethod;
            };
            /**
             * <p>BookmarkSpy events</p>
             */
            events: componyx.UI.Validator.ValidatorEvents;
            /**
             * <p>Returns true if the current validation state is valid, otherwise false</p>
             */
            isValid(): boolean;
            /**
             * <p>Validates the required field using the specified settings.</p>
             * @param settings - <p>The validation rule settings.</p>
             * @param field - <p>The field or fields in case of a Radio Button.</p>
             * @returns <p>A value indicating if the field is valid (true) or invalid (false).</p>
             */
            validateRequired(settings: any, field: HTMLElement[]): boolean;
            /**
             * <p>Validates the field by value comparison using the specified settings.</p>
             * @param settings - <p>Validation rule settings (includes fields and operators).</p>
             * @param value - <p>The field value.</p>
             * @param [dataType] - <p>Field value data type (default: string).</p>
             * @returns <p>A value indicating if the field is valid (true) or invalid (false).</p>
             */
            validateCompare(settings: any, value: string, dataType?: componyx.UI.Validator.DataTypeOption | null): boolean;
            /**
             * <p>Validates the field value range using the specified settings.</p>
             * @param settings - <p>The validation rule settings.</p>
             * @param value - <p>The field value.</p>
             * @param dataType - <p>The data type of the value.</p>
             * @returns <p>A value indicating if the field is valid (true) or invalid (false).</p>
             */
            validateRange(settings: any, value: string, dataType?: componyx.UI.Validator.DataTypeOption): boolean;
            /**
             * <p>Validates the field value length using the specified settings.</p>
             * @param settings - <p>The validation rule settings.</p>
             * @param value - <p>The field value.</p>
             * @returns <p>A value indicating if the field is valid (true) or invalid (false).</p>
             */
            validateLength(settings: any, value: string): boolean;
            /**
             * <p>Validates the field value data-type using the specified settings.</p>
             * @param settings - <p>The validation rule settings.</p>
             * @param value - <p>The field value.</p>
             * @returns <p>A value indicating if the field is valid (true) or invalid (false).</p>
             */
            validateType(settings: any, value: string): boolean;
            /**
             * <p>Validates the field value by the configured regex pattern using the specified settings.</p>
             * @param settings - <p>The validation rule settings.</p>
             * @param value - <p>The field value.</p>
             * @returns <p>A value indicating if the field is valid (true) or invalid (false).</p>
             */
            validateRegEx(settings: any, value: string): boolean;
            /**
             * <p>Gets all the validation fields with there defined rules.</p>
             * @returns <p>An object with field-name as key and the validation rules as value.</p>
             */
            getFields(): any;
            /**
             * <p>Defines the template for a validating field in the feedback container. The template supports the below listed interpolations. Default value: {icon}{message}</p>
             * <ul>
             * <li>{icon} This value will be replaced validation state icon.</li>
             * <li>{fieldName} This value will be replaced with the name of the validation field.</li>
             * <li>{message} This value will be replaced with the validation message.</li>
             * </ul>
             * @param content - <p>The content of the template</p>
             */
            setValidatingFieldFeedbackTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Defines the template for a valid field in the feedback container. The template supports the below listed interpolations. Default value: {icon}{message}</p>
             * <ul>
             * <li>{icon} This value will be replaced validation state icon.</li>
             * <li>{fieldName} This value will be replaced with the name of the validation field.</li>
             * <li>{message} This value will be replaced with the validation message.</li>
             * </ul>
             * @param content - <p>The content of the template</p>
             */
            setValidFieldFeedbackTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Defines the template for an invalid field in the feedback container. The template supports the below listed interpolations. Default value: {icon}{tooltipTrigger}{multiple}[ 1-{messageCount} ]{/multiple}{/tooltipTrigger} {message}</p>
             * <ul>
             * <li>{icon} This value will be replaced validation state icon.</li>
             * <li>{fieldName} This value will be replaced with the name of the validation field.</li>
             * <li>{message} This value will be replaced with the validation message.</li>
             * <li>{tooltipTrigger} This value will be replaced with the opening trigger element tag.</li>
             * <li>{/tooltipTrigger} This value will be replaced with the closing trigger element tag.</li>
             * <li>{multiple} This value will be replaced with the opening multiple element tag.</li>
             * <li>{/multiple} This value will be replaced with the closing multiple element tag.</li>
             * <li>{messageCount} This value will be replaced with the validation message count.</li>
             * </ul>
             * @param content - <p>The content of the template</p>
             */
            setInvalidFieldFeedbackTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Defines the template for a valid field in the summary container. The template supports the below listed interpolations. Default value: {icon}{fieldName} {message</p>
             * <ul>
             * <li>{icon} This value will be replaced validation state icon.</li>
             * <li>{fieldName} This value will be replaced with the name of the validation field.</li>
             * <li>{message} This value will be replaced with the validation message.</li>
             * </ul>
             * @param content - <p>The content of the template</p>
             */
            setValidFieldSummaryTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Defines the template for an invalid field in the summary container. The template supports the below listed interpolations. Default value: {icon}{fieldName}: {tooltipTrigger}{multiple}[ 1-{messageCount} ]{/multiple}{/tooltipTrigger} {message}</p>
             * <ul>
             * <li>{icon} This value will be replaced validation state icon.</li>
             * <li>{fieldName} This value will be replaced with the name of the validation field.</li>
             * <li>{message} This value will be replaced with the validation message.</li>
             * <li>{tooltipTrigger} This value will be replaced with the opening trigger element tag.</li>
             * <li>{/tooltipTrigger} This value will be replaced with the closing trigger element tag.</li>
             * <li>{multiple} This value will be replaced with the opening multiple element tag.</li>
             * <li>{/multiple} This value will be replaced with the closing multiple element tag.</li>
             * <li>{messageCount} This value will be replaced with the validation message count.</li>
             * </ul>
             * @param content - <p>The content of the template</p>
             */
            setInvalidFieldSummaryTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Defines the template for an invalid field in the popup. The template supports the below listed interpolations. Default value: {icon}{fieldName}: {tooltipTrigger}{multiple}[ 1-{messageCount} ]{/multiple}{/tooltipTrigger} {message}</p>
             * <ul>
             * <li>{message} This value will be replaced with the validation message.</li>
             * </ul>
             * @param content - <p>The content of the template</p>
             */
            setInvalidFieldPopupTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Initializes the Validator component if this has not yet been done.</p>
             */
            show(): void;
            /**
             * <p>Initializes the Validator component.</p>
             */
            init(): void;
            /**
             * <p>Initializes the Validator component. Both init and render are the same for this component.</p>
             */
            render(): void;
            /**
             * <p>Detects validation rules specified through data-attributes on input elements.</p>
             * @param [container] - <p>A container element to restrict detection to fields within the container.</p>
             * @param [ignoreHidden] - <p>A value indicating whether hidden fields should be excluded from detection.</p>
             */
            detect(container?: HTMLElement, ignoreHidden?: boolean): void;
            /**
             * <p>Adds a validation rule of the specified type for the given field name(s).</p>
             * @param fieldName - <p>The name of the form field(s).</p>
             * @param settings - <p>The validation rule settings.</p>
             * @param settings.feedbackId - <p>The identifier of the element used by the Validator to display validation result feedback.</p>
             * @param settings.autoValidate - <p>A value indicating if the field is validated when the field value changes.</p>
             * @param settings.live - <p>A value indicating if the field validation is done while typing.</p>
             * @param settings.getValue - <p>A custom method to return the value for this field. Passes in the field element and expects the field value as result.</p>
             * @param settings.msg - <p>The message to display if validation fails.</p>
             * @param [settings.when] - <p>The name of the method that returns a boolean value to determines whether the field is required (true) or not (false). (REQUIRED type validation).</p>
             * @param [settings.min] - <p>The minimum value. (LENGTH and RANGE type validation).</p>
             * @param [settings.max] - <p>The maximum value. (LENGTH and RANGE type validation).</p>
             * @param settings.pattern - <p>The Regular expression pattern. (REGEX type validation).</p>
             * @param settings.fields - <p>The HTML element(s), element name(s) or values to compare against.</p>
             * @param settings.operators - <p>The operator(s) to use for comparison: &lt; 'LessThan', &lt;= 'LessThanOrEqualTo', &gt; 'GreaterThan', &gt;= 'GreaterThanOrEqualTo', or == 'EqualTo' (default). Can be a single entry (applied to all fields) or an array aligned with <code>fields</code>.</p>
             * @param settings.dataType - <p>The data-type to which the field value must comply. (DATATYPE type validation).</p>
             * @param settings.alwaysCheck - <p>A value indicating if the validation rule should always be checked even if the field validation has already failed (only applies to type CUSTOM).</p>
             * @param settings.onValidation - <p>A function(sender, args) invoked when the field is validated. (CUSTOM type validation).</p>
             * @param settings.onBeforeValidation - <p>A function(sender, args) invoked before the field is validated. (AJAX type validation).</p>
             * @param settings.onAfterValidation - <p>A function function(sender, args) invoked after the field is validated. (AJAX type validation).</p>
             * @param [type] - <p>The type of the validation. May be omitted to apply a global field setting only (feedbackId, autoValidate or live).</p>
             * <ul>
             * <li>0 REQUIRED</li>
             * <li>1 DATATYPE</li>
             * <li>2 LENGTH</li>
             * <li>3 RANGE</li>
             * <li>4 REGEX</li>
             * <li>5 COMPARE</li>
             * <li>6 CUSTOM</li>
             * <li>7 AJAX</li>
             * </ul>
             */
            addRule(fieldName: string | String[], settings: {
                feedbackId: string;
                autoValidate: boolean;
                live: boolean;
                getValue: (...params: any[]) => any;
                msg: string;
                when?: string;
                min?: number | string;
                max?: number | string;
                pattern: RegExp;
                fields: HTMLElement[] | String[];
                operators: String[];
                dataType: componyx.UI.Validator.DataTypeOption;
                alwaysCheck: boolean;
                onValidation: componyx.UI.Validator.OnValidation;
                onBeforeValidation: componyx.UI.Validator.OnBeforeValidation;
                onAfterValidation: componyx.UI.Validator.OnAfterValidation;
            }, type?: componyx.UI.Validator.TypeOption): void;
            /**
             * <p>Resets the field's validation state.</p>
             * @param fieldName - <p>The name of the form field (or array of field names).</p>
             */
            resetState(fieldName: string | String[]): void;
            /**
             * <p>Resets the validation state for all fields.</p>
             * @param [container] - <p>A container element to restrict the state reset to fields within the container.</p>
             */
            resetStates(container?: HTMLElement): void;
            /**
             * <p>Returns true if there are validation rules for this field, otherwise false.</p>
             * @param fieldName - <p>The name of the form field.</p>
             */
            hasRules(fieldName: string): boolean;
            /**
             * <p>Returns true if the validation rule is set for this field, otherwise false.</p>
             * @param fieldName - <p>The name of the form field.</p>
             * @param type - <p>The type of the validation.</p>
             */
            hasRule(fieldName: string, type: componyx.UI.Validator.TypeOption): boolean;
            /**
             * <p>Returns the validation rules for the specified field.</p>
             * @param fieldName - <p>The name of the form field.</p>
             */
            getRules(fieldName: string): any | null;
            /**
             * <p>Removes the validation rule of the specified type for the given field name(s).</p>
             * @param fieldName - <p>The name of the form field (or array of field names).</p>
             * @param type - <p>The type of the validation</p>
             */
            removeRule(fieldName: string | String[], type: componyx.UI.Validator.TypeOption): void;
            /**
             * <p>Removes the validation rules for the given field name(s).</p>
             * @param fieldName - <p>The name of the form field (or array of field names).</p>
             */
            removeRules(fieldName: string | String[]): void;
            /**
             * <p>Removes the validation rules for all fields.</p>
             * @param [container] - <p>A container element to restrict clearance to fields within the container.</p>
             * @param [keepForRemovedField] - <p>A value indicating to keep (instead of clearing) validation rules for field elements removed from the document.</p>
             */
            clear(container?: HTMLElement, keepForRemovedField?: boolean): void;
            /**
             * <p>Removes the feedback messages for all fields.</p>
             * @param [container] - <p>A container element to restrict clearance to fields within the container.</p>
             * @param [keepForRemovedField] - <p>A value indicating to keep (instead of clearing) validation rules for field elements removed from the document.</p>
             */
            clearFeedback(container?: HTMLElement, keepForRemovedField?: boolean): void;
            /**
             * <p>Removes the feedback messages for the specified field name.</p>
             * @param fieldName - <p>The name of the form field.</p>
             */
            clearFieldFeedback(fieldName: string): void;
            /**
             * <p>Validates all fields or the fields within the specified container element.</p>
             * @param [container] - <p>A container element to restrict validation to fields within the container.</p>
             * @param [filledOnly] - <p>A value indicating to only validate filled out fields.</p>
             */
            validate(container?: HTMLElement, filledOnly?: boolean): boolean;
            /**
             * <p>Validates a specific field</p>
             * @param fieldName - <p>The name of the form field.</p>
             * @returns <p>A value indicating if the field is valid, works only for simple non async validations.</p>
             */
            validateField(fieldName: string): boolean;
            /**
             * <p>Destroys the component.</p>
             * @param keepEvents - <p>A value indicating if the events must be kept.</p>
             * @param [removeElement = true] - <p>A value indicating if the element must be removed.</p>
             */
            destroy(keepEvents: boolean, removeElement?: boolean): void;
            /**
             * <p>The validator does not render HTML output, so it has no hide behavior of its own; this is always <code>null</code>.</p>
            */
            hide: null;
            /**
             * <p>Gets or sets the css class of a feedback ul element.</p>
            */
            cssClassFeedback: string;
            /**
             * <p>Gets or sets the css class of a summary ul element.</p>
            */
            cssClassSummary: string;
            /**
             * <p>Gets or sets the css class of the feedback message when server-side validation is processing.</p>
            */
            cssClassValidating: string;
            /**
             * <p>Gets or sets the css class of the feedback/summary message when the input field passes validation.</p>
            */
            cssClassValid: string;
            /**
             * <p>Gets or sets the css class of the feedback/summary message when the input field fails validation.</p>
            */
            cssClassInvalid: string;
            /**
             * <p>Gets or sets the css class of the element wrapping multiple validation messages (default: 'multiple').</p>
             */
            cssClassMultiple: string;
            /**
             * <p>Gets or sets the css class of the icon in a feedback or summary message.</p>
            */
            cssClassIcon: string;
            /**
             * <p>Gets or sets the css class of the tooltip trigger.</p>
            */
            cssClassTooltipTrigger: string;
            /**
             * <p>Gets or sets the message which is shown when ajax validation is processing.</p>
            */
            validatingFieldMessage: string;
            /**
             * <p>Gets or sets the message which is shown when a field passes validation.</p>
            */
            validFieldMessage: string;
            /**
             * <p>Gets or sets the message which is shown when a field fails validation. Message is not shown when the ErrorMessage is defined on the model property.</p>
            */
            invalidFieldMessage: string;
            /**
             * <p>Gets or sets the message which is shown when ajax validation throws an error.</p>
            */
            ajaxErrorMessage: string;
            /**
             * <p>Gets or sets the delay for the validating field message which is shown when ajax validation is processing.</p>
            */
            validatingFieldMessageDelay: number;
            /**
             * <p>Gets or sets when valid fields are displayed.</p>
            */
            showValidFields: componyx.UI.Validator.ShowValidFieldsOption;
            /**
             * <p>Gets or sets a value indicating how validation messages are being displayed.</p>
            */
            messageDisplay: componyx.UI.Validator.MessageDisplayOption;
            /**
             * <p>Gets or sets a value indicating how validation messages are being displayed in the summary container.</p>
            */
            summaryMessageDisplay: componyx.UI.Validator.MessageDisplayOption;
            /**
             * <p>Gets or sets a value indicating whether valid fields are also displayed in the summary container.</p>
            */
            showValidFieldsInSummary: boolean;
            /**
             * <p>Gets or sets the identifying css class of the field feedback container.</p>
            */
            feedbackIdentifyingCssClass: string;
            /**
             * <p>Gets or sets the container id of the validation message summary.</p>
            */
            summaryContainerId?: string;
            /**
             * <p>Gets or sets the form id of the form that holds the input fields when using multiple forms on a single page.</p>
            */
            formId?: string | null;
            /**
             * <p>Gets or sets the input format for dates. Default: MM/dd/yyyy</p>
            */
            dateFormat: string;
            /**
             * <p>Gets or sets the input decimal separator for numbers. Default: '.'</p>
            */
            decimalSeparator: string;
            /**
             * <p>Gets or sets the input group separator for numbers. Default: ','</p>
            */
            groupSeparator: string;
            /**
             * <p>Gets or sets the initial validator rules (Array or JSON string).</p>
            */
            rules: componyx.UI.Validator.Rule[] | string | null;
            /**
             * <p>Gets or sets the fields which passed validation on postback.</p>
            */
            validFields: String[];
            /**
             * <p>Gets or sets the fields which failed validation on postback.</p>
            */
            invalidFields: String[];
            /**
             * <p>List containing the friendly field names.</p>
            */
            friendlyFieldNames: { [fieldName: string]: string };
            /**
             * <p>Gets or sets a value indicating whether auto generated field names should be corrected to static names.</p>
            */
            staticASPNETFieldNames: boolean;
            /**
             * <p>Gets or sets a value indicating whether the validation status css classes are applied to the (input/textarea/select/contenteditable) field (defaults to true).</p>
            */
            validationCssOnField: boolean;
            /**
             * <p>Gets or sets a value indicating whether field validation should be performed while typing (defaults to false).</p>
            */
            live: boolean;
            /**
             * <p>Gets or sets the delay in milliseconds before the live field validation is performed.</p>
            */
            liveDelay: number;
            /**
             * <p>Gets or sets a value indicating if fields are being detected when the component initializes.</p>
            */
            detectFields: boolean;
            /**
             * <p>Gets or sets the tabindex of the tooltip trigger element.</p>
            */
            tooltipTriggerTabIndex: string;
            /**
             * <p>Gets or sets the tooltip manager used to display tooltips.</p>
            */
            tooltipManagerId: string | null;
        }
    }
}