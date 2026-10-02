/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

const _omit = new Set(['type', 'id', 'name', 'element', 'viewElement', 'editElement', 'lineBreakElement']),
    _renderedEditComponentSymbol = Symbol('renderedComponent'),
    _parentSymbol = Symbol('parent'),
    _elementSymbol = Symbol('element'),
    _lineBreakElementSymbol = Symbol('lineBreakElement'),
    _viewElementSymbol = Symbol('viewElement'),
    _editElementSymbol = Symbol('editElement'),
    _cloneableTypes = () =>
    {
        const Types = componyx.UI.form_modules.Types;
        return Object.fromEntries(Object.entries(Types));
    },
    _clone = (target, source) =>
    {
        let omit = _omit;

        if (source && source._keepOriginal !== false)
        {
            omit = new Set(_omit);
            omit.delete('id');
            omit.delete('name');
            delete source._keepOriginal;
        }

        //(target, source, deep, overwrite, extend, excludeEmpty, excludeFunctions, exclude, omit, types, typeCheck, converter)
        if (source)
            $lib.clone({ target, source, deep: true, overwrite: true, excludeEmpty: true, omit, types: _cloneableTypes(), typeCheck: 'type' });
    };

componyx.UI.form_modules = componyx.UI.form_modules || {};

/**
* @typedef {MaskedTextBoxSettings|NumericBoxSettings|ComboBoxSettings|DatePickerSettings|TimePickerSettings|SliderSettings|FileUploadSettings|EditorSettings} ComponentSettingsType
* @memberof componyx.UI.Form
*/

/**
 * @typedef {Object} ComboBoxSettings
 * @memberof componyx.UI.Form
 * @property {Boolean} [multiSelect]                                                            - Gets or sets a value indicating whether multiple items can be selected through checkboxes.
 * @property {Boolean} [multiSelectTagging]                                                     - Gets or sets a value indicating whether selected items are displayed as tags.
 * @property {Boolean} [allowInput]                                                             - Gets or sets a value indicating whether textual input is allowed.
 */

/**
 * @typedef {Object} DatePickerSettings
 * @memberof componyx.UI.Form
 * @property {Boolean} [today]                                                                  - Gets or sets a value indicating whether today should be used as initial selected date.
 * @property {String|Date} [minValue]                                                           - Gets or sets the minimum allowed date value.
 * @property {String|Date} [maxValue]                                                           - Gets or sets the maximum allowed date value.
 * @property {String[]|Date[]} [allowedDates]                                                   - Gets or sets a list of allowed calendar dates. Separate two date strings with a space to specify allowed range. When allowed dates are set, date input fields are rendered in readonly mode.
 * @property {Boolean} [disallowDates]                                                          - Gets or sets a value indicating if the dates specified in the dates property are disallowed instead of the default allowed.
 */

/**
 * @typedef {Object} MaskedTextBoxSettings
 * @memberof componyx.UI.Form
 * @property {string} [mask]                                                                    - Gets or sets the text box mask pattern.
 * @property {MaskedTextBox.CharacterAllowOption} [allowedCharacters]                           - Gets or sets a value indicating which characters are allowed.
 */

/**
 * @typedef {Object} NumericBoxSettings
 * @memberof componyx.UI.Form
 * @property {Number} [minValue]                                                                - Gets or sets the minimium allowed value.
 * @property {Number} [maxValue]                                                                - Gets or sets the maximum allowed value.
 * @property {Number} [precision]                                                               - Gets or sets the amount of decimal places.
 */

/**
 * @typedef {Object} SliderSettings
 * @memberof componyx.UI.Form
 * @property {Boolean} [range=false]                                                            - Gets or sets a value indicating if the slider has a start- and end-handle to set a range.
 * @property {Number} [startValue=0]                                                            - Gets or sets the start value of the range slider.
 * @property {Number} [minValue=0]                                                              - Gets or sets the minimum value.
 * @property {Number} [maxValue=100]                                                            - Gets or sets the maximum value.
 * @property {Number} [tickMarks]                                                               - Gets or sets the amount of rendered tickmarks.
 * @property {Number} [trackSize]                                                               - Gets or sets the size of the slider track.
 */

/**
 * @typedef {Object} TimePickerSettings
 * @memberof componyx.UI.Form
 * @property {String} [minValue]                                                                - Gets or sets the minimum allowed time in format 'HH:MM'. Minutes must be divisible by 5.
 * @property {String} [maxValue]                                                                - Gets or sets the maximum allowed time in format 'HH:MM'. Minutes must be divisible by 5.
 * @property {String} [incrementalValue]                                                        - Gets or sets the incremental value in minutes. Minutes must be divisible by 5.
 * @property {String[]} [allowedTimes]                                                          - Gets or sets a list of allowed clock times (format 'HH:MM'). Separate two date strings with a space to specify allowed range. When allowed times are set, date input fields are rendered in readonly mode.Gets or sets a list of allowed calendar dates.
 * @property {Boolean} [disallowTimes]                                                          - Gets or sets a value indicating if the times specified in the times property are disallowed instead of the default allowed.
 */

/**
 * @typedef {Object} FileUploadSettings
 * @memberof componyx.UI.Form
 * @property {String} [accept]                                                                  - Gets or sets the comma-separated list of allowed file extensions (.png, .jpg, .jpeg) or MIME types (image/png or image/*).
 * @property {Number} [maxFileSize]                                                             - Gets or sets the max allowed file size in KB.
 * @property {Number} [maxFiles]                                                                - Gets or sets the max allowed file count.
 */

/**
 * @typedef {Object} EditorSettings
 * @memberof componyx.UI.Form
 * @property {componyx.UI.Form.EditorVisibleCommands} [visibleCommands]                      - Gets or sets the editor visible commands settings.
 */

/**
 * @typedef {Object} EditorVisibleCommands
 * @memberof componyx.UI.Form
 * @property {Boolean} [all]      - Enables all visible commands.
 * @property {Boolean} [block]    - Enables changing block styles.
 * @property {Boolean} [link]     - Enables editing links.
 * @property {Boolean} [list]     - Enables editing UL/OL lists.
 * @property {Boolean} [special]  - Enables special commands (if applicable).
 */

/**
 * Command Location options
 * @readonly
 * @enum {number}
 * @memberof componyx.UI.Form
 */
const CommandLocationOption =
{
    /** Commands shown in the top header bar. */
    HEADER: 0,
    /** Commands shown in the top-left corner of the form. */
    BUILD_PANE_TOP: 1,
    /** Commands shown in the bottom-left corner of the form. */
    BUILD_PANE_BOTTOM: 2,
    /** Commands shown in the top-right corner of the form. */
    CONFIG_PANE_TOP: 3,
    /** Commands shown in the bottom-right corner of the form. */
    CONFIG_PANE_BOTTOM: 4,
};

/**
 * Block Type options
 * @readonly
 * @enum {number}
 * @memberof componyx.UI.Form
 */
const BlockTypeOption =
{
    /** A container for grouping related fields. */
    FIELD_SET: 0,
    /** A standard input field. */
    FIELD: 1,
    /** A content block for displaying rich text. */
    CONTENT_FIELD: 2,
    /** A spacer field. */
    SPACER_FIELD: 3,

    getName(value)
    {
        const key = $base.static.getKeyByValue(this, value);
        return key.split('_').map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join('');
    }
};

/**
* Input Type options
* @readonly
* @enum {number}
* @memberof componyx.UI.Form
*/
const InputTypeOption =
{
    // === Native HTML inputs ===
    /** Simple single-line text input. */
    TEXTBOX: 0,
    /** Multi-line text input. */
    TEXTAREA: 1,
    /** Checkbox input, for binary options. */
    CHECKBOX: 2,
    /** Radio button input, for selecting one option from a group. */
    RADIO: 3,
    /** Checkbox as switch input, for selecting one option from a group. */
    SWITCH: 4,
    // === Componyx UI components ===
    /** Textbox input with masking (componyx.UI.MaskedTextBox). */
    MASKEDTEXTBOX: 5,
    /** Input for numeric values (componyx.UI.NumericBox). */
    NUMERICBOX: 6,
    /** Dropdown input (componyx.UI.ComboBox). */
    COMBOBOX: 7,
    /** Date selector (componyx.UI.DatePicker). */
    DATEPICKER: 8,
    /** Time selector (componyx.UI.TimePicker). */
    TIMEPICKER: 9,
    /** Range slider (componyx.UI.Slider). */
    SLIDER: 10,
    /** File upload control (componyx.UI.FileUpload). */
    FILEUPLOAD: 11,
    /** Rich text editor (componyx.UI.Editor). */
    EDITOR: 12,

    getName(value)
    {
        let names = { 5: 'MaskedTextBox', 6: 'NumericBox', 7: 'ComboBox', 8: 'DatePicker', 9: 'TimePicker', 10: 'Slider', 11: 'FileUpload', 12: 'Editor' };

        if (names[value])
            return names[value];

        const key = $base.static.getKeyByValue(this, value);
        return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
    }
};

/**
* Display Type options
* @readonly
* @enum {number}
* @memberof componyx.UI.Form
*/
const DisplayModeOption =
{
    /** Editable mode for user input. */
    EDIT: 0,
    /** View-only mode, for displaying data. */
    VIEW: 1,
    /** Build mode, for constructing and designing the form. */
    BUILD: 2,
    /** Preview mode. Similar to editable mode but with header. */
    PREVIEW: 3
};

/**
* FieldSet Layout options
* @readonly
* @enum {number}
* @memberof componyx.UI.Form
*/
const FieldSetLayoutOption =
{
    /** No visible layout applied. Fields appear directly in the form. */
    NONE: 0,
    /** Default fieldset appearance with a thin border and a legend at the top. */
    DEFAULT: 1,
    /** Section with a full-width banner header above the fields, giving it a modern look. */
    BANNERED: 2
};

/**
 * Rule Case triggers.
 * @readonly
 * @enum {string}
 * @memberof componyx.UI.Form
 */
const RuleCaseTriggerOption =
{
    /** The RuleCase runs both on form initialization and when dependent fields change. */
    ALWAYS: 'always',
    /** The RuleCase runs once when the form initializes. */
    INIT: 'init',
    /** The RuleCase runs whenever dependent fields change. */
    CHANGE: 'change',
    /** The RuleCase runs when the corresponding section becomes visible. */
    SHOW_SECTION: 'show_section',
    /** The RuleCase runs before the form is being submitted. */
    BEFORE_SUBMIT: 'before_submit',
    /** The RuleCase runs when the form submit was successful. */
    SUBMIT_SUCCEEDED: 'submit_succeeded',
    /** The RuleCase runs when the form submit was unsuccessful */
    SUBMIT_FAILED: 'submit_failed'

};

/**
 * Rule Case run options.
 * @readonly
 * @enum {string}
 * @memberof componyx.UI.Form
 */
const RuleCaseRunVisibilityOption =
{
    /** The RuleCase runs only when field is visible. */
    VISIBLE: 'visible',
    /** The RuleCase runs when field is hidden. */
    HIDDEN: 'hidden',
    /** The RuleCase runs even when the field's section is hidden. */
    SECTION_HIDDEN: 'section_hidden'
}

/**
 * Comparison operators options
 * @readonly
 * @enum {string}
 * @memberof componyx.UI.Form
 */
const RuleComparisonOperatorOption =
{
    EQUAL: 'equal',
    NOT_EQUAL: 'not_equal',
    GREATER_THAN: 'greater_than',
    GREATER_THAN_OR_EQUAL: 'greater_than_or_equal',
    LESS_THAN: 'less_than',
    LESS_THAN_OR_EQUAL: 'less_than_or_equal',
    CONTAINS: 'contains',
    NOT_CONTAINS: 'not_contains',
    STARTS_WITH: 'starts_with',
    ENDS_WITH: 'ends_with',
    EMPTY: 'empty',
    NOT_EMPTY: 'not_empty',
    VISIBLE: 'visible',
    HIDDEN: 'hidden',
    ENABLED: 'enabled',
    DISABLED: 'disabled',
    REQUIRED: 'required',
    OPTIONAL: 'optional'
};

/**
 * @typedef {Object} BaseSetProperties
 * @memberof componyx.UI.Form
 * @property {HTMLElement|HTMLElement[]|DocumentFragment|string|null} [headerTemplate] Gets or sets the header template.
 * @property {HTMLElement|HTMLElement[]|DocumentFragment|string|null} [footerTemplate] Gets or sets the footer template.
 * @property {componyx.UI.Form.BaseSet[]} [fieldSets] Gets or sets an array of field sets (nested field groupings).
 */

/**
 * @typedef {Object} FieldSetProperties
 * @memberof componyx.UI.Form
 * @property {boolean} [allowAsRoot] Gets or sets a value indicating if this field set can be used as a root element in the form.
 * @property {componyx.UI.Form.FieldSetLayoutOption} [layout] Gets or sets the layout of the field set.
 * @property {boolean} [repeatable] Gets or sets a value indicating if this field set is repeatable.
 * @property {number|null} [maxRepeats] Gets or sets a value indicating how many repeats are allowed for this field set. No value or zero means unlimited.
 * @property {string} [repeatLabel] Gets or sets the field set repeat label.
 * @property {componyx.UI.Form.BaseField[]} [fields] Gets or sets the form fields that belong to the field set.
 */

/**
 * @typedef {Object} BaseFieldProperties
 * @memberof componyx.UI.Form
 * @property {Object.<string,string>|null} [panelTemplates] Gets or sets the templates to render in each configuration panel. Maps configuration panel ids to template ids.
 * @property {componyx.UI.Form.BaseField|null} [parent] The parent field if this set is part of another set.
 * @property {string} id Gets or sets the id of the field. The id is generated if it's not set.
 * @property {string} [name] Gets or sets the name of the field.
 * @property {string} [width] Gets or sets the width of the field.
 * @property {string} [cssClass] Gets or sets the CSS class of the field.
 * @property {string} [cssClassIcon] Gets or sets the CSS class of the field icon.
 * @property {string} [style] Gets or sets the CSS style of the field.
 * @property {string} [tooltip] Gets or sets the tooltip of the field.
 * @property {boolean} [visible] Gets a value indicating if the field is visible.
 * @property {boolean} [disabled] Gets a value indicating if the field is disabled.
 * @property {string} [label] Gets or sets the label of the field.
 * @property {string} [value] Gets or sets the value of the option.
 * @property {boolean} [lineBreak] Gets or sets a value indicating if the field moves to a new line.
 * @property {HTMLElement|HTMLElement[]|DocumentFragment|string|null} [viewTemplate] Gets or sets a custom template to display the field in view mode.
 * @property {HTMLElement|HTMLElement[]|DocumentFragment|string|null} [editTemplate] Gets or sets a custom template to display the field in edit mode.
 * @property {HTMLElement|null} [element] Gets the rendered root element.
 * @property {HTMLElement} [lineBreakElement] Gets the rendered line break element.
 * @property {componyx.UI.Form.ComponentSettings|null} [componentSettings] Gets or sets the specific settings configured for the input type component.
 */

/**
 * @typedef {Object} FieldProperties
 * @memberof componyx.UI.Form
 * @property {string} [placeholder] Gets or sets the placeholder of the field for when it has no value.
 * @property {componyx.UI.FormField.LabelDisplayOption} [labelDisplay=3] Gets or sets the label display option of the field (above, before, floating, inside).
 * @property {string} [bindingKey] Gets or sets the data binding key of the field. Defaults to the field name if not set. Supports dot notation (e.g. "user.address.street"). Only applies when form.bindToCustomModel is true.
 * @property {string} [role] Gets or sets the role identifier for the field, defining its purpose or behavior.
 * @property {boolean} [autoDataBind] Gets or sets a value indicating if the data binding (via Bindary) is automatically activated on this form field.
 * @property {boolean} [hideLabel] Gets or sets a value indicating if the label should be hidden. Ignored in build mode.
 * @property {boolean} [viewAsLabel] Gets or sets a value indicating if the field value is displayed as a label when in view mode.
 * @property {boolean} [inlineOptions=true] Gets or sets a value indicating whether options are displayed horizontally or stacked vertically.
 * @property {string} [optionWidth=auto] Gets or sets the width of a field option (auto, 50%, 33%, 25%, 20%). Only applies when inlineOptions is true.
 * @property {componyx.UI.Form.FieldOption} [options] Gets or sets the field options for input types CHECKBOX or RADIO.
 * @property {componyx.UI.Form.InputTypeOption} [inputType] Gets or sets the input type to render the editable field.
 * @property {string} [customType] Gets or sets the custom type of the form field.
 * @property {string} [dataSourceId] Gets or sets the id of the data source used for the field.
 * @property {boolean} [dataSourcePreview] Gets or sets a value indicating if the data source can be previewed in Form Build mode.
 * @property {boolean} [readOnly] Gets or sets a value indicating if the field is readonly.
 * @property {boolean} [required] Gets or sets a value indicating if the field is required.
 * @property {ValidationSettings} [validationSettings] Gets or sets the validation settings of the field.
 * @property {Array<RuleCase>} [ruleCases] Gets or sets a list of rule cases.
 * @property {string} [inputId] Gets or sets the id of the edit HTML Element or UI component from which attributes/settings are cloned.
 * @property {string} [viewElementId] Gets or sets the id of the view HTML Element from which attributes are cloned.
 * @property {string} [formFieldId] Gets or sets the id of the FormField component from which settings are cloned.
 * @property {HTMLElement} [viewElement] Gets the rendered view element.
 * @property {HTMLElement} [editElement] Gets the rendered edit element.
 */

/**
 * @typedef {Object} FieldOptionProperties
 * @memberof componyx.UI.Form
 * @property {string} [value] Gets or sets the value of the option.
 * @property {boolean} [selected] Gets or sets a value indicating if the option is selected/checked.
 * @property {string} [inputId] Gets or sets the id of the HTML Element from which attributes are cloned.
 * @property {string} [formFieldId] Gets or sets the id of the FormField component from which settings are cloned.
 */

/**
 * @typedef {Object} ContentFieldProperties
 * @memberof componyx.UI.Form
 * @property {string} [trustHTML] Gets or sets a value indicating whether the HTML content of this field is trusted.
 * @property {string} [margin] Gets or sets the margin of the content field.
 * @property {string} [padding] Gets or sets the padding of the content field.
 * @property {number|null} [borderWidth] Gets or sets the border width of the content field.
 * @property {string} [borderRadius] Gets or sets the border radius of the content field.
 * @property {string} [borderColor] Gets or sets the border color of the content field.
 * @property {string} [backgroundColor] Gets or sets the background color of the content field.
 */

/**
 * @typedef {Object} SpacerFieldProperties
 * @memberof componyx.UI.Form
 * @property {string} [showDivider] Gets or sets a value indicating whether the divider line is rendered in the middle of the spacer.
 * @property {string} [height] Gets or sets the height of the spacer field.
 */

/**
 * @typedef {Object} BuildBlockProperties
 * @memberof componyx.UI.Form
 * @property {string} [panelId] Gets or sets the identifier of the panel in which the build block is placed. Item is placed in first Panel if not set.
 * @property {componyx.UI.Form.BlockTypeOption|null} [blockType=0] Gets or sets the type of the build block or null if it's a custom field. Defaults to an input field type.
 * @property {componyx.UI.Form.InputTypeOption|null} [inputType] Gets or sets the input type of the form field or null if it's a custom field.
 * @property {string} [customType] Gets or sets the custom type of the form field.
 * @property {string} [inputId] Gets or sets the id of the edit HTML Element or UI component from which attributes/settings are cloned.
 * @property {componyx.UI.Form.FieldSet} [fieldSet] Gets or sets the field set of the build block when type is set to FIELDSET.
 */

/**
 * Represents a field role.
 * @class
 * @memberof componyx.UI.Form
 */
class FieldRole
{
    /**
     * @param {Object} [properties] The properties used to initialize the object.
     * @param {string} [properties.id] - Gets or sets the id of the role.
     * @param {string} [properties.label] - Gets or sets the label of the role.
     * @param {string} [properties.defaultValue] - Gets or sets the default value of the role if desired.
     * @param {componyx.UI.Form.InputTypeOption|componyx.UI.Form.InputTypeOption[]|null} [properties.inputType] - Gets or sets the field input type(s) for which this field role will be selectable.
     */
    constructor(properties)
    {
        /**
         * Gets or sets the id of the role.
         * @type {String}
         */
        this.id = null;

        /**
         * Gets or sets the label of the role.
         * @type {String}
         */
        this.label = null;

        /**
         * Gets or sets the default value of the role if desired.
         * @type {*}
         */
        this.defaultValue = null;

        /**
         * Gets or sets the field input type(s) for which this field role will be selectable.
         * @type {componyx.UI.Form.InputTypeOption|componyx.UI.Form.InputTypeOption[]|null} 
         */
        this.inputType = null;

        _clone(this, properties);
    }
}

/**
 * The Form ServerEndpoint class.
 * @class
 * @memberof componyx.UI.Form
 */
class ServerEndpoint
{
    /**
     * @param {Object} [properties] The properties used to initialize the object.
     * @param {String} properties.id Gets or sets the identifier of the item.
     * @param {String} properties.label Gets or sets the label of the item.
     * @param {Boolean} properties.absoluteURL Gets or sets a value indicating whether the URL is absolute or relative.
     * @param {String} properties.url Gets or sets the API endpoint for file uploads or data requests.
     * @param {String} properties.method Gets or sets the HTTP method used for requests (e.g., "POST", "GET").
     * @param {Object} properties.headers Gets or sets the request headers for the API call.
     * @param {Object} properties.params Gets or sets additional parameters sent with the request.
     * @param {Number|null} properties.timeout Gets or sets the timeout in milliseconds for the request.
     * @param {String} properties.credentials Gets or sets the credentials mode for the fetch request.
     * @param {String} properties.responseType Gets or sets the expected response type ('json', 'text', 'blob').
     * @param {Function|null} properties.preFetch Gets or sets the hook executed before the fetch request.
     * @param {Function|null} properties.postFetch Gets or sets the hook executed after the fetch request completes.
     */
    constructor(properties)
    {
        /**
         * Gets or sets the id of the item.
         * @type {string}
         */
        this.id = '';

        /**
         * Gets or sets the label of the item.
         * @type {string}
         */
        this.label = '';

        /**
         * Gets or sets a value indicating whether the URL is absolute or relative.
         * @type {boolean}
         */
        this.absoluteURL = false;

        /**
         * Gets or sets the API endpoint for file uploads or data requests.
         * @type {string}
         */
        this.url = '';

        /**
         * Gets or sets the HTTP method used for requests (e.g., "POST", "GET").
         * @type {string}
         */
        this.method = 'GET';

        /**
         * Gets or sets the request headers for the API call.
         * @type {Object}
         */
        this.headers = {};

        /**
         * Gets or sets additional parameters sent with the request.
         * @type {Object}
         */
        this.params = {};

        /**
         * Gets or sets the timeout in milliseconds for the request. If null, no timeout is applied.
         * @type {number|null}
         */
        this.timeout = null;

        /**
         * Gets or sets the credentials mode for the fetch request. E.g., 'same-origin', 'include', or 'omit'.
         * @type {string}
         */
        this.credentials = 'same-origin';

        /**
         * Gets or sets the expected response type. Determines how the fetch response is parsed. 
         * Supported values: 'json', 'text', 'blob'.
         * @type {string}
         */
        this.responseType = 'json';

        /** Gets or sets the optional hook executed before the fetch request. Can be used to modify the request parameters or context.
         * @type {function(Object, Object): (Object|Promise<Object>)|null}
         * @param {Object} params - The current request parameters.
         * @param {Object} context - Generic context passed by the caller. The context includes the current form and field instance (possible action instance).
         * @returns {Object|Promise<Object>} Optionally return modified params.
         */
        this.preFetch = null;

        /**
         * Gets or sets the optional hook executed after the fetch request completes. Can be used to handle the result or update the context.
         * @type {function(Object, Object): void|Promise<void>|null}
         * @param {Object} result - The JSON-parsed response from the server.
         * @param {Object} context - Generic context passed by the caller. The context includes the current form and field instance (possible action instance).
         */
        this.postFetch = null;

        _clone(this, properties);
    }
}

/**
 * The Form DataSource class.
 * @class
 * @memberof componyx.UI.Form
 * @extends ServerEndpoint
 */
class DataSource extends ServerEndpoint
{
    /**
     * @param {Object} [properties] The properties used to initialize the object.
     * @param {componyx.UI.Form.InputTypeOption|componyx.UI.Form.InputTypeOption[]} properties.inputType Gets or sets the supported input type(s) of the data source; matched by strict equality or inclusion if array.
     */
    constructor(properties)
    {
        super(properties);

        /**
         * Gets or sets the supported input type(s) of the data source; matched by strict equality or inclusion if array.
         * @type {componyx.UI.Form.InputTypeOption|componyx.UI.Form.InputTypeOption[]|null}
         */
        this.inputType = properties?.inputType || null;
    }
}

/**
 * The base class that holds the type property so the type can be converted back to class instance after JSON serialization.
 * @class
 * @memberof componyx.UI.Form
 */
class BaseType
{
    #type;
    constructor()
    {
        /**
        * The name of the class, required for identifying the object type when stored as JSON data.
        * @type {string}
        * @ignore
        */
        this.#type = this.constructor.name;

        Object.defineProperty(this, 'type', {
            value: this.#type,
            writable: false,
            enumerable: true,
            configurable: false
        });
    }

    /**
    * Gets the parent fieldSet or Section.
    * @type {BaseType|null} 
    */
    get parent()
    {
        return this[_parentSymbol];
    }

    /** 
     * Sets the parent.
     * @param {BaseType} value
     * @ignore
     */
    set parent(value)
    {
        this[_parentSymbol] = value;
    }

    /**
    * Gets the name of the class, required for identifying the object type when stored as JSON data.
    * @type {string}
    */
    get type()
    {
        return this.#type;
    }
}

/**
 * The base class for all form field and fieldSet types.
 * @class
 * @memberof componyx.UI.Form
 * @extends BaseType
 */
class BaseField extends BaseType
{
    constructor()
    {
        super();

        /**
         * Gets or sets the templates to render in each configuration panel. Maps configuration panel ids to template ids.
         * @type {Object.<string,string>|null}
         */
        this.panelTemplates = null;

        /**
         * Gets or sets the id of the field. The id is generated if it's not set.
         * @type {string}
         */
        this.id = '';

        /**
         * Gets or sets the name of the field.
         * @type {string}
         */
        this.name = '';

        /**
         * Gets or sets the width of the field.
         * @type {string}
         */
        this.width = '100%';

        /**
         * Gets or sets the CSS class of the field.
         * @type {string}
         */
        this.cssClass = '';

        /**
         * Gets or sets the CSS class of the field icon.
         * @type {string}
         */
        this.cssClassIcon = '';

        /**
         * Gets or sets the CSS style of the field.
         * @type {string}
         */
        this.style = '';

        /**
         * Gets or sets the tooltip of the field.
         * @type {string}
         */
        this.tooltip = '';

        /**
         * Gets a value indicating if the field is visible.
         * @type {boolean}
         */
        this.visible = true;

        /**
         * Gets a value indicating if the field is disabled.
         * @type {boolean}
         */
        this.disabled = false;

        /**
         * Gets or sets the label of the field.
         * @type {string}
         */
        this.label = '';

        /**
         * Gets or sets the value of the option.
         * @type {string}
         */
        this.value = '';

        /**
         * Gets or sets a value indicating if the field moves to a new line.
         * @type {boolean}
         */
        this.lineBreak = false;

        /**
         * Gets or sets a custom template to display the field in view mode.
         * @type {HTMLElement|HTMLElement[]|DocumentFragment|string|null}
         */
        this.viewTemplate = null;

        /**
         * Gets or sets the id of the custom template to display the field in view mode.
         * @type {string}
         */
        this.viewTemplateId = null;

        /**
         * Gets or sets a custom template to display the field in edit mode.
         * @type {HTMLElement|HTMLElement[]|DocumentFragment|string|null}
         */
        this.editTemplate = null;

        /**
         * Gets or sets the id of the custom template to display the field in edit mode.
         * @type {string}
         */
        this.editTemplateId = null;

        /**
         * Gets or sets the specific settings configured for the input type component.
         * @type {ComponentSettings|null}
         */
        this.componentSettings = new ComponentSettings();
    }

        /**
        * Gets the rendered root element.
        * @type {HTMLElement|null} 
        */
        get element()
        {
            return this[_elementSymbol];
        }

        /** 
         * Sets the rendered root element.
         * @param {HTMLElement} value
         * @ignore
         */
        set element(value)
        {
            this[_elementSymbol] = value;
        }

        /**
        * Gets the rendered line break element.
        * @type {HTMLElement|null} 
        */
        get lineBreakElement()
        {
            return this[_lineBreakElementSymbol];
        }

        /** 
         * Sets the rendered line break element.
         * @param {HTMLElement} value
         * @ignore
         */
        set lineBreakElement(value)
        {
            this[_lineBreakElementSymbol] = value;
        }
}

/**
 * The base class for form field sets (Section, FieldSet).
 * @class
 * @extends BaseField
 * @memberof componyx.UI.Form
 */
class BaseSet extends BaseField
{
    constructor()
    {
        super();

        /**
         * Gets or sets the header template.
         * @type {HTMLElement|HTMLElement[]|DocumentFragment|string|null}
         */
        this.headerTemplate = null;

        /**
         * Gets or sets the footer template.
         * @type {HTMLElement|HTMLElement[]|DocumentFragment|string|null}
         */
        this.footerTemplate = null;

        /**
         * Gets or sets an array of field sets (nested field groupings).
         * @type {componyx.UI.Form.BaseSet[]}
         */
        this.fieldSets = [];
    }
}

/**
 * The Form BuildItem class.
 * @class
 * @extends BaseField
 * @memberof componyx.UI.Form
 */
class BuildBlock extends BaseField
{
    /**
     * @param {BaseFieldProperties | BuildBlockProperties} [properties] The properties used to initialize the object.
     */
    constructor(properties)
    {
        super();

        /**
         * Gets or sets the type of the build block or null if it's a custom field. Defaults to input field type.
         * @type {componyx.UI.Form.BlockTypeOption|null}
         */
        this.blockType = BlockTypeOption.FIELD;

        /**
         * Gets or sets the input type of the form field or null if it's a custom field.
         * @type {componyx.UI.Form.InputTypeOption|null}
         */
        this.inputType = null;

        /**
         * Gets or sets the custom type of the form field.
         * @type {string|null}
         */
        this.customType = null;

        /**
         * Gets or sets the identifier of the panel in which the build block is placed.
         * @type {string}
         */
        this.panelId = '';

        /**
         * Gets or sets the id of the edit HTML Element or UI component from which the attributes/settings are cloned.
         * @type {string|null}
         */
        this.inputId = null;

        /**
         * Gets or sets the field set of the build block when type is set to FIELDSET.
         * @type {componyx.UI.Form.FieldSet|null}
         */
        this.fieldSet = null;

        _clone(this, properties);
    }
}

/**
 * The Form Section class.
 * @class
 * @memberof componyx.UI.Form
 * @extends BaseSet
 */
class Section extends BaseSet
{
    /**
      * @param {BaseSetProperties} [properties] The properties used to initialize the object.
     */
    constructor(properties)
    {
        super();
        _clone(this, properties);
    }
}

/**
 * The Form FieldSet class.
 * @class
 * @memberof componyx.UI.Form
 * @extends BaseField
 */
class FieldSet extends BaseSet
{
    /**
    * @param {BaseSetProperties | FieldSetProperties} [properties] The properties used to initialize the object.
     */
    constructor(properties)
    {
        super();

        /**
         * Gets or sets a value indicating if this field set can be used as a root element in the form.
         * @type {boolean}
         */
        this.allowAsRoot = true;

        /**
         * Gets or sets the layout of the field set.
         * @type {Form.FieldSetLayoutOption}
         */
        this.layout = FieldSetLayoutOption.DEFAULT;

        /**
         * Gets or sets a value indicating if this field set is repeatable.
         * @type {boolean}
         */
        this.repeatable = false;

        /**
         * Gets the field set repeat label.
         * @type {string}
         */
        this.repeatLabel = '';

        /**
         * Gets or sets how many repeats are allowed for this field set. No value or zero means unlimited repeats.
         * @type {number|null}
         */
        this.maxRepeats = 0;

        /**
         * Gets or sets the form fields that belong to the field set.
         * @type {componyx.UI.Form.BaseField[]}
         */
        this.fields = [];

        _clone(this, properties);
    }
}

/**
 * The Form Field class.
 * @class
 * @memberof componyx.UI.Form
 * @extends BaseField
 */
class Field extends BaseField 
{
    /**
     * @param {BaseFieldProperties | FieldProperties} [properties] The properties used to initialize the object.
     */
    constructor(properties)
    {
        super();

        /**
         * Gets or sets the placeholder of the field for when it has no value.
         * @type {string}
         */
        this.placeholder = '';

        /**
         * Gets or sets the label display option of the field (above, before, floating, inside).
         * @type {componyx.UI.FormField.LabelDisplayOption}
         */
        this.labelDisplay = 3;

        /**
         * Gets or sets the data binding key of the field. If not provided, the field name is used as the key.
         * @type {string}
         */
        this.bindingKey = '';

        /**
         * Gets or sets the role identifier for the field, defining its purpose or behavior.
         * @type {string}
         */
        this.role = '';

        /**
         * Gets or sets a value indicating if the data binding (via Bindary) is automatically activated on this form field.
         * @type {boolean|null}
         */
        this.autoDataBind = null;

        /**
         * Gets or sets a value indicating if the label should be hidden. Setting is ignored in build mode.
         * @type {boolean|null}
         */
        this.hideLabel = null;

        /**
         * Gets or sets a value indicating if the field value is displayed as a label when in view mode.
         * @type {boolean}
         */
        this.viewAsLabel = false;

        /**
         * Gets or sets a value indicating whether options are displayed horizontally or stacked vertically.
         * @type {boolean}
         */
        this.inlineOptions = true;

        /**
         * Gets or sets the width of a field option (auto - sized by content; 50% - 2 per row; 33% - 3 per row; 25% - 4 per row; 20% - 5 per row).
         * @type {string}
         */
        this.optionWidth = 'auto';

        /**
         * Gets or sets the field options for when the input type is set to CHECKBOX or RADIO.
         * @type {componyx.UI.Form.FieldOption[]}
         */
        this.options = [];

        /**
         * Gets or sets the input type to render the editable field.
         * @type {componyx.UI.Form.InputTypeOption|null}
         */
        this.inputType = InputTypeOption.TEXTBOX;

        /**
         * Gets or sets the custom type of the form field.
         * @type {string|null}
         */
        this.customType = null;

        /**
         * Gets or sets the id of the data source used for the field.
         * @type {string|null}
         */
        this.dataSourceId = null;

        /**
         * Gets or sets a value indicating if the data source can be previewed in the Form Build mode.
         * @type {boolean}
         */
        this.dataSourcePreview = true;

        /**
         * Gets a value indicating if the field is readonly.
         * @type {boolean}
         */
        this.readOnly = false;

        /**
         * Gets or sets a value indicating if the field is required.
         * @type {boolean}
         */
        this.required = false;

        /**
         * Gets or sets the validation settings of the field.
         * @type {ValidationSettings}
         */
        this.validationSettings = new ValidationSettings();

        /**
         * Gets or sets a list of rule cases.
         * @type {Array<RuleCase>}
         */
        this.ruleCases = [];

        /**
         * Gets or sets the id of the edit HTML Element (TextBox, TextArea) or UI component from which the attributes/settings are cloned.
         * @type {string|null}
         */
        this.inputId = null;

        /**
         * Gets or sets the id of the view HTML Element from which the attributes are cloned.
         * @type {string|null}
         */
        this.viewElementId = null;

        /**
         * Gets or sets the id of the FormField component from which the settings are cloned.
         * @type {string|null}
         */
        this.formFieldId = null;

        _clone(this, properties);
    }

    /**
    * Gets the rendered view element.
    * @type {HTMLElement|null} 
    */
    get viewElement()
    {
        return this[_viewElementSymbol];
    }

    /** 
     * Sets the rendered view element.
     * @param {HTMLElement} value
     * @ignore
     */
    set viewElement(value)
    {
        this[_viewElementSymbol] = value;
    }

    /**
    * Gets the rendered edit element.
    * @type {HTMLElement|null} 
    */
    get editElement()
    {
        return this[_editElementSymbol];
    }

    /** 
     * Sets the rendered edit element.
     * @param {HTMLElement} value
     * @ignore
     */
    set editElement(value)
    {
        this[_editElementSymbol] = value;
    }

    /**
     * Gets the rendered edit component.
     * @type {componyx.UI.Base.Component | componyx.UI.Base.WebComponent | HTMLElement}
     */
    get renderedEditComponent()
    {
        return this[_renderedEditComponentSymbol];
    }

    set renderedEditComponent(value)
    {
        this[_renderedEditComponentSymbol] = value;
    }
}



/** 
* The Form FieldOption class.
* @class
* @memberof componyx.UI.Form
* @extends BaseField
*/
class FieldOption extends BaseField
{
    /**
    * @param {BaseFieldProperties | FieldOptionProperties} [properties] The properties used to initialize the object.
     */
    constructor(properties)
    {
        super();

        /**
         * Gets or sets a value indicating if the option is selected/checked.
         * @type {boolean}
         */
        this.selected = false;

        /**
         * Gets or sets the id of the HTML Element from which the attributes are cloned.
         * @type {string|null}
         */
        this.inputId = null;

        /**
         * Gets or sets the id of the FormField component from which the settings are cloned.
         * @type {string|null}
         */
        this.formFieldId = null;

        _clone(this, properties);
    }
}

/** 
* The Form ContentField class.
* @class
* @memberof componyx.UI.Form
* @extends BaseField
*/
class ContentField extends BaseField
{
    /**
    * @param {BaseFieldProperties | ContentFieldProperties} [properties] The properties used to initialize the object.
     */
    constructor(properties)
    {
        super();

        /**
         * Gets or sets a value indicating whether the HTML content of this field is trusted.
         * @type {boolean}
         */
        this.trustHTML = false;

        /**
         * Gets or sets the margin of the content field.
         * @type {string|null}
         */
        this.margin = null;

        /**
         * Gets or sets the padding of the content field.
         * @type {string|null}
         */
        this.padding = null;

        /**
         * Gets or sets the border width of the content field.
         * @type {number|null}
         */
        this.borderWidth = null;

        /**
         * Gets or sets the border radius of the content field.
         * @type {string|null}
         */
        this.borderRadius = null;

        /**
         * Gets or sets the border color of the content field.
         * @type {string|null}
         */
        this.borderColor = null;

        /**
         * Gets or sets the background color of the content field.
         * @type {string|null}
         */
        this.backgroundColor = null;

        _clone(this, properties);
    }
}

/** 
* The Form SpacerField class.
* @class
* @memberof componyx.UI.Form
* @extends BaseField
*/
class SpacerField extends BaseField
{
    /**
    * @param {BaseFieldProperties | SpacerFieldProperties} [properties] The properties used to initialize the object.
     */
    constructor(properties)
    {
        super();

        this.width = '100%';

        /**
         * Gets or sets a value indicating whether the divider line is rendered in the middle of the spacer.
         * @type {boolean}
         */
        this.showDivider = false;

        /**
         * Gets or sets the height of the spacer field.
         * @type {string|null}
         */
        this.height = null;

        _clone(this, properties);
    }
}

/**
 * The Form ComponentSettings class.
 * @class
 * @memberof componyx.UI.Form
 * @extends BaseType
 * @implements {ComponentSettingsType}
 */
class ComponentSettings extends BaseType
{
    constructor()
    {
        super();
    }
}

/**
 * The Form ValidationSettings class.
 * @class
 * @memberof componyx.UI.Form
 * @extends BaseType
 */
class ValidationSettings extends BaseType
{
    /**
     * @param {Object} [properties] The properties used to initialize the object.
     * @param {Number} [properties.dataType] Gets or sets the expected data type of the field. INTEGER: 0, FLOAT: 1, DATETIME: 2, EMAIL: 3, URL: 4, SOURCE: 5
     * @param {String} [properties.compareFieldId] Gets or sets the comparison field identifier for the field.
     * @param {String} [properties.compareOperator] Gets or sets the comparison operator for the field.
     * @param {Number} [properties.minLength] Gets or sets the minimum length allowed for the field value.
     * @param {Number} [properties.maxLength] Gets or sets the maximum length allowed for the field value.
     * @param {Number} [properties.minRange] Gets or sets the minimum range allowed for the field value.
     * @param {Number} [properties.maxRange] Gets or sets the maximum range allowed for the field value.
     * @param {String} [properties.pattern] Gets or sets the regex pattern that the field value must match.
     */
    constructor(properties)
    {
        super();

        /**
         * Gets or sets the expected data type of the field. INTEGER: 0, FLOAT: 1, DATETIME: 2, EMAIL: 3, URL: 4, SOURCE: 5
         * @type {number|null}
         */
        this.dataType = null;

        /**
         * Gets or sets the comparison field identifier for the field.
         * @type {string|Object|null}
         */
        this.compareFieldId = null;

        /**
         * Gets or sets the comparison operator for the field.
         * @type {string|null}
         */
        this.compareOperator = null;

        /**
         * Gets or sets the minimum length allowed for the field value.
         * @type {number|null}
         */
        this.minLength = null;

        /**
         * Gets or sets the maximum length allowed for the field value.
         * @type {number|null}
         */
        this.maxLength = null;

        /**
         * Gets or sets the minimum range allowed for the field value.
         * @type {number|null}
         */
        this.minRange = null;

        /**
         * Gets or sets the maximum range allowed for the field value.
         * @type {number|null}
         */
        this.maxRange = null;

        /**
         * Gets or sets the regex pattern that the field value must match.
         * @type {string|null}
         */
        this.pattern = null;

        _clone(this, properties);
    }
}

/** 
* The Form Command class.
* @class
* @memberof componyx.UI.Form
*/
class Command
{
    /**
     * @param {Object} [properties] The properties used to initialize the object.
     * @param {String} [properties.id] Gets or sets the id of the command. The id is generated if it's not set.
     * @param {String|Function} [properties.command] Gets or sets the command that the button triggers (e.g. 'undo', 'redo').
     * @param {Function} [properties.isVisible] Gets or sets a predicate function that returns `true` when this button should be shown. No value set means always visible.
     * @param {Function} [properties.isEnabled]  Gets or sets a predicate function that returns `true` when this button should be enabled; return `false` to disable it. No value set means always enabled.
     * @param {String} [properties.shortcutKey]  Gets or sets the keyboard shortcut key in combination with the CTRL key for this button (e.g. 'z' for undo).
     * @param {String} [properties.cssClass=''] Gets or sets the CSS class name for the button.
     * @param {String} [properties.cssClassIcon='ico-undo'] Gets or sets the CSS class name for the icon to display.
     * @param {Object} [properties.events=null] Gets or sets the events of the button component.
     * @param {String|null} [properties.buttonId=null] Gets or sets the id of the button component from which the settings are cloned.
     */
    constructor(properties)
    {
        /**
         * Gets or sets the id of the command. The id is generated if it's not set.
         * @type {string|null}
         */
        this.id = null;

        /**
         * Gets or sets the command to execute.
         * @type {Function|null}
         */
        this.command = null;

        /**
         * Gets or sets a predicate function that returns `true` when this button should be shown.
         * @type {Function|null}
         */
        this.isVisible = null;

        /**
         * Gets or sets a predicate function that returns `true` when this button should be enabled; return `false` to disable it.
         * @type {Function|null}
         */
        this.isEnabled = null;

        /**
         * Gets or sets the keyboard shortcut key in combination with the CTRL key for this button (e.g. 'z' for undo).
         * @type {string}
         */
        this.shortcutKey = '';

        /**
         * Gets or sets the CSS class name for the button.
         * @type {string}
         */
        this.cssClass = '';

        /**
         * Gets or sets the CSS class name for the icon to display.
         * @type {string}
         */
        this.cssClassIcon = '';

        /**
         * Gets or sets the location of the command button.
         * @type {Form.CommandLocationOption}
         */
        this.location = CommandLocationOption.HEADER;

        /**
         * Gets or sets the events of the button component.
         * @type {Object|null}
         */
        this.events = null;

        /**
         * Gets or sets the id of the button component from which the settings are cloned.
         * @type {string|null}
         */
        this.buttonId = null;

        _clone(this, properties);
    }
}

/**
 * The RuleCase class represents a case of rules that result in actions.
 * @class
 * @memberof componyx.UI.Form
 * @extends BaseType
 */
class RuleCase extends BaseType
{
    constructor()
    {
        super();

        /**
         * Gets or sets the id. The id is generated if it's not set.
         * @type {String}
         */
        this.id = null;

        /**
         * Gets or sets the trigger of the RuleCase. Determines when this case executes.
         * @type {RuleCaseTriggerOption}
         */
        this.trigger = null;

        /**
         * Gets or sets a value indicating if this rule case is run when the field is visible (default), hidden or when even it's section is hidden.
         * @type {RuleCaseRunVisibilityOption}
         */
        this.runVisibility = null;

        /**
         * Gets or sets the array of RuleGroup objects in this case.
         * @type {Array<RuleGroup>}
         */
        this.ruleGroups = [];

        /** 
         * Gets or sets a list of actions to execute when the rule condition is met. Each action is an object with a type and optional value.
         * @type {Array<Action>}
        */
        this.actions = [];
    }
}

/**
 * The RuleGroup class represents a group of rules combined with a logical operator.
 * @class
 * @memberof componyx.UI.Form
 * @extends BaseType
 */
class RuleGroup extends BaseType
{
    constructor()
    {
        super();

        /**
         * Gets or sets the id. The id is generated if it's not set.
         * @type {String}
         */
        this.id = null;

        /**
         * Gets or sets the array of Rule objects in this group.
         * @type {Array<Rule>}
         */
        this.rules = [];

        /**
         * Gets or sets the logical operator to combine the rules: 'AND' or 'OR'.
         * @type {string}
         */
        this.logicalOperator = null;
    }
}

/**
 * The Rule class represents a single conditional rule for a field.
 * @class
 * @memberof componyx.UI.Form
 * @extends BaseType
 */
class Rule extends BaseType
{
    constructor()
    {
        super();

        /**
         * Gets or sets the id. The id is generated if it's not set.
         * @type {String}
         */
        this.id = null;

        /**
         * Gets or sets the id of the field/fieldset that this rule applies to.
         * @type {string|null}
         */
        this.sourceId = null;

        /**
         * Gets or sets the logical operator to combine the rules: 'AND' or 'OR'.
         * @type {string|null}
         */
        this.logicalOperator = null;

        /**
         * Gets or sets the comparison operator for evaluation (e.g., equals, greater than).
         * @type {RuleComparisonOperatorOption}
         */
        this.comparisonOperator = null;

        /**
         * Gets or sets the value to compare against.
         * @type {*}
         */
        this.value = null;

        /**
         * Gets or sets a value indicating if the set value is the end value of a range.
         * @type {boolean}
         */
        this.isRangeEnd = null;
    }
}

/**
 * Represents an action to execute when a rule case condition is met.
 * @class
 * @memberof componyx.UI.Form
 * @extends BaseType
 */
class Action extends BaseType
{
    /**
     * @param {Object} [properties] The properties used to initialize the object.
     * @param {string} [properties.id] - Gets or sets the id of the action.
     * @param {string} [properties.runtimeActionId] - Gets or sets the unique id of the registered runtime action to execute.
     * @param {any} [properties.targetFieldSetId] - Gets or sets the id of the target field set.
     * @param {any} [properties.value] - Gets or sets the value associated with the action.
     */
    constructor(properties)
    {
        super();

        /**
         * Gets or sets the id of the action.
         * @type {String}
         */
        this.id = null;

        /**
         * Gets or sets the unique id of the registered runtime action to execute.
         * @type {String}
         */
        this.runtimeActionId = null;

        /**
         * Gets or sets the id of the target field set.
         * @type {String}
         */
        this.targetFieldSetId = null;

        /**
        * Gets or sets the value associated with the action.
        * @type {*}
        */
        this.value = null;

        _clone(this, properties);
    }
}

/**
 * @typedef {object} Types
 * @property {CommandLocationOption} CommandLocationOption
 * @property {BlockTypeOption} BlockTypeOption
 * @property {InputTypeOption} InputTypeOption
 * @property {DisplayModeOption} DisplayModeOption
 * @property {FieldSetLayoutOption} FieldSetLayoutOption
 * @property {RuleCaseTriggerOption} RuleCaseTriggerOption
 * @property {RuleCaseRunVisibilityOption} RuleCaseRunVisibilityOption
 * @property {RuleComparisonOperatorOption} RuleComparisonOperatorOption
 * @property {FieldRole} FieldRole
 * @property {ServerEndpoint} ServerEndpoint
 * @property {DataSource} DataSource
 * @property {BuildBlock} BuildBlock
 * @property {BaseField} BaseField
 * @property {Section} Section
 * @property {FieldSet} FieldSet
 * @property {Field} Field
 * @property {FieldOption} FieldOption
 * @property {ContentField} ContentField
 * @property {SpacerField} SpacerField
 * @property {ComponentSettings} ComponentSettings
 * @property {ValidationSettings} ValidationSettings
 * @property {Command} Command
 * @property {RuleCase} RuleCase
 * @property {RuleGroup} RuleGroup
 * @property {Rule} Rule
 * @property {Action} Action
 * @ignore
 */
componyx.UI.form_modules.Types =
{
    CommandLocationOption,
    BlockTypeOption,
    InputTypeOption,
    DisplayModeOption,
    FieldSetLayoutOption,
    RuleCaseTriggerOption,
    RuleCaseRunVisibilityOption,
    RuleComparisonOperatorOption,
    FieldRole,
    ServerEndpoint,
    DataSource,
    BuildBlock,
    BaseField,
    Section,
    FieldSet,
    Field,
    FieldOption,
    ContentField,
    SpacerField,
    ComponentSettings,
    ValidationSettings,
    Command,
    RuleCase,
    RuleGroup,
    Rule,
    Action
};

export default componyx.UI.form_modules.Types;