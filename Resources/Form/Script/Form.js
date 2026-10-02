/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(async function (window)
{
    /**
     * Namespace for form modules.
     * @namespace componyx.UI.form_modules
     */
    componyx.UI.form_modules = componyx.UI.form_modules || {};

    /**
     * Promise that resolves when all form modules are loaded asynchronously.
     * @type {Promise<void>}
     * @memberof componyx.UI.form_modules
     */
    componyx.UI.form_modules.loaded = (async () =>
    {
            // these dynamic imports are removed when files are bundled into UI(.min).js
            await import(`${$UI.getScriptResourcePath('Base.Sanitizer')}`);
            await import(`${$UI.getScriptResourcePath('Form.ActionManager')}`);
            await import(`${$UI.getScriptResourcePath('Form.BuildPanelManager')}`);
            await import(`${$UI.getScriptResourcePath('Form.ComponentFactory')}`);
            await import(`${$UI.getScriptResourcePath('Form.ConfigPanelManager')}`);
            await import(`${$UI.getScriptResourcePath('Form.DataBinder')}`);
            await import(`${$UI.getScriptResourcePath('Form.Draggable')}`);
            await import(`${$UI.getScriptResourcePath('Form.DataObserver')}`);
            await import(`${$UI.getScriptResourcePath('Form.Renderer')}`);
            await import(`${$UI.getScriptResourcePath('Form.RuleEngine')}`);
            await import(`${$UI.getScriptResourcePath('Form.Types')}`);
            await import(`${$UI.getScriptResourcePath('Form.ValidationManager')}`);
    })();

    await componyx.UI.form_modules.loaded;
    const Sanitizer = componyx.base_modules.Sanitizer;
    const ActionManager = componyx.UI.form_modules.ActionManager;
    const BuildPanelManager = componyx.UI.form_modules.BuildPanelManager;
    const DataBinder = componyx.UI.form_modules.DataBinder;
    const DataObserver = componyx.UI.form_modules.DataObserver;
    const Draggable = componyx.UI.form_modules.Draggable;
    const ComponentFactory = componyx.UI.form_modules.ComponentFactory;
    const ConfigPanelManager = componyx.UI.form_modules.ConfigPanelManager;
    const Renderer = componyx.UI.form_modules.Renderer;
    const RuleEngine = componyx.UI.form_modules.RuleEngine;
    const Types = componyx.UI.form_modules.Types;
    const ValidationManager = componyx.UI.form_modules.ValidationManager;


    /**
     * A list of internal HTML data-attributes used for identifying form fields.
     * @typedef {Object} HTML_Attributes
     * @memberof componyx.UI.Form
     * @property {string} data-ui-form-field - Marks an HTMLElement as a Form field; the attribute value is the field's id.
     * 
     * @see {@link componyx.UI.Form.registerCustomType}
     * @example
     * // Usage in `connectedCallback()` of a custom element to register a custom field type:
     * class MyCustomElement extends HTMLElement {
     *     connectedCallback() {
     *         const wrapper = this.closest("[data-ui-form-field]");
     *         if (!wrapper) return;
     * 
     *         const fieldId = wrapper.getAttribute("data-ui-form-field");
     *         const field = $UI.store['myFormId'].getField(fieldId);
     *         if (field) {
     *             // Register the custom field type
     *             $UI.store.myFormInstance.registerCustomType('MyCustomType', {
     *                 getter: this.getValue.bind(this),
     *                 setter: this.setValue?.bind(this),
     *                 renderer: this.render?.bind(this),
     *                 updater: this.update?.bind(this)
     *             });
     *         }
     *     }
     * }
     */


    /**
      * @typedef {Object} LabelSettings
      * @memberof componyx.UI.Form
      * @property {String} newItemPrefix                            = New                                                                   - Gets or sets the prefix used when a new type is created without a custom label.
      * @property {String} addItemPrefix                            = Add                                                                   - Gets or sets the prefix used for adding an item. The type description of the item is used as suffix.
      * @property {String} removeItemPrefix                         = Remove                                                                - Gets or sets the prefix used for removing an item. The type description of the item is used as suffix.
      * @property {String} applyToPrefix                            = Apply to                                                              - Gets or sets the prefix used for apply to. The type description of the item is used as suffix.
      * @property {String} labelPlaceholder                         = Enter a label                                                         - Gets or sets the placeholder to display when a label is empty.
      * @property {String} headerTitle                              = Form Header                                                           - Gets or sets the header title.
      * @property {String} sectionSwitch                            = Enable Sections                                                       - Gets or sets the label for the Sections switch.
      * @property {String} lineBreak                                = Line break                                                            - Gets or sets the label for the lineBreak setting in the FieldSet/Field/FieldOption configuration panel.
      * @property {String} visible                                  = Visible                                                               - Gets or sets the label for the visible setting field in the FieldSet/Field configuration panel.
      * @property {String} disabled                                 = Disabled                                                              - Gets or sets the label for the disabled setting in the FieldSet/Field/FieldOption configuration panel.
      * @property {String} readOnly                                 = Readonly                                                              - Gets or sets the label for the readOnly setting in the Field configuration panel.
      * @property {String} selected                                 = Selected                                                              - Gets or sets the label for the selected setting in the FieldOption configuration panel.
      * @property {String} tooltip                                  = Tooltip                                                               - Gets or sets the label for the tooltip setting in the FieldSet/Field configuration panel.
      * @property {String} tooltipHint                              = Text shown via info icon                                              - Gets or sets the label for the tooltip setting hint in the FieldSet/Field configuration panel.
      * @property {String} value                                    = Default Value                                                         - Gets or sets the label for the value setting in the Field- and Component- configuration panels.
      * @property {String} minValue                                 = Minimum Value                                                         - Gets or sets the label for the minValue setting in the DatePicker/NumericBox/Slider/TimePicker configuration panel.
      * @property {String} maxValue                                 = Maximum Value                                                         - Gets or sets the label for the maxValue setting in the DatePicker/NumericBox/Slider/TimePicker configuration panel.
      * @property {String} comboBoxDefaultHint                      = - Select -                                                            - Gets or sets the label for the ComboBox placeholder.
      * @property {String} comboBoxSelectAll                        = Select All                                                            - Gets or sets the label for the ComboBox placeholder.
      * 
      * @property {String} section                                  = Section                                                               - Gets or sets the label used to describe a section.
      * @property {String} fieldSet                                 = Field Set                                                             - Gets or sets the label used to describe a field set.
      * @property {String} fieldSets                                = Field Sets                                                            - Gets or sets the label used to describe field sets.
      * @property {String} fieldPaneEmptyHint                       = Drag a field here...                                                  - Gets or sets the message to display when a field pane of a field set is empty.
      * @property {String} fieldSetId                               = ID                                                                    - Gets or sets the label for the id read-only setting field in the FieldSet configuration panel.
      * @property {String} fieldSetLayout                           = Layout                                                                - Gets or sets the label for the layout setting field in the FieldSet configuration panel.
      * @property {String} fieldSetLayoutNone                       = None                                                                  - Gets or sets the label for the 'None' option of the Layout dropdown in the FieldSet configuration panel.
      * @property {String} fieldSetLayoutDefault                    = Default                                                               - Gets or sets the label for the 'Default' option of the Layout dropdown in the FieldSet configuration panel.
      * @property {String} fieldSetLayoutBannered                   = Bannered                                                              - Gets or sets the label for the 'Bannered' option of the Layout dropdown in the FieldSet configuration panel.
      * @property {String} fieldSetLabelDisplay                     = Label Display (this group)                                            - Gets or sets the label for the label display setting in the FieldSet configuration panel.
      * @property {String} fieldSetRepeatable                       = Repeatable                                                            - Gets or sets the label for the repeatable setting field in the FieldSet configuration panel.
      * @property {String} fieldSetMaxRepeats                       = Max Repeats                                                           - Gets or sets the label for the maximum repeats setting field in the FieldSet configuration panel.
      * @property {String} fieldSetRepeatLabel                      = Repeat Label                                                          - Gets or sets the label for the repeat label setting field in the FieldSet configuration panel.
      * @property {String} fieldSetRepeatButton                     = Add Another                                                           - Gets or sets the label for the button to add a repeated field set if the field set does not have a label, otherwise addItemPrefix + label are used.
      * 
      * @property {String} field                                    = Field                                                                 - Gets or sets the label used to describe a field.
      * @property {String} fields                                   = Fields                                                                - Gets or sets the label used to describe fields.
      * @property {String} fieldName                                = Field Name                                                            - Gets or sets the label for the name setting in the Field configuration panel.
      * @property {String} fieldPlaceholder                         = Placeholder                                                           - Gets or sets the label for the placeholder setting in the Field configuration panel.
      * @property {String} fieldPlaceholderHint                     = Text shown when empty                                                 - Gets or sets the label for the placeholder setting hint in the Field configuration panel.
      * @property {String} fieldWidth                               = Width                                                                 - Gets or sets the label for the width setting in the Field configuration panel.
      * @property {String} fieldWidthHint                           = - Select option or type a value -                                     - Gets or sets the label for the width setting hint in the Field configuration panel.
      * @property {String} fieldWidthTooltip                                                                                                - Gets or sets the label for the width setting tooltip in the Field configuration panel.
      * @property {String} fieldWidthAuto                           = Auto (360px)                                                          - Gets or sets the label for the 'Auto' option of the fieldWidth dropdown in the Field configuration panel.
      * @property {String} fieldWidth1PerRow                        = 100% (1 field per row)                                                - Gets or sets the label for the '100%' option of the fieldWidth dropdown in the Field configuration panel.
      * @property {String} fieldWidth2PerRow                        = 50% (2 fields per row)                                                - Gets or sets the label for the '50%' option of the fieldWidth dropdown in the Field configuration panel.
      * @property {String} fieldWidth3PerRow                        = 33% (3 fields per row)                                                - Gets or sets the label for the '33%' option of the fieldWidth dropdown in the Field configuration panel.
      * @property {String} fieldWidth4PerRow                        = 25% (4 fields per row)                                                - Gets or sets the label for the '25%' option of the fieldWidth dropdown in the Field configuration panel.
      * @property {String} fieldRole                                = Role                                                                  - Gets or sets the label for the role setting in the Field configuration panel.
      * @property {String} fieldRoleTooltip                                                                                                 - Gets or sets the label for the role setting tooltip in the Field configuration panel.
      * 
      * @property {String} fieldLabelDisplay                        = Label Display                                                         - Gets or sets the label for the label display setting in the Field configuration panel.
      * @property {String} fieldLabelDisplayAbove                   = Above                                                                 - Gets or sets the label for the 'Above' label display option.
      * @property {String} fieldLabelDisplayBefore                  = Before                                                                - Gets or sets the label for the 'Before' label display option.
      * @property {String} fieldLabelDisplayFloating                = Floating                                                              - Gets or sets the label for the 'Floating' label display option.
      * @property {String} fieldLabelDisplayInside                  = Inside                                                                - Gets or sets the label for the 'Inside' label display option.
      * @property {String} fieldMoreSettings                        = More Settings...                                                      - Gets or sets the label for the more settings button in the Field configuration panel.
      * 
      * @property {String} fieldInlineOptions                       = Inline Options                                                        - Gets or sets the label for the inline options setting in the Field Options configuration panel.
      * @property {String} fieldOptionWidth                         = Option Width                                                          - Gets or sets the label for the option width setting in the Field Options configuration panel.
      * @property {String} fieldOptionWidthAuto                     = Auto                                                                  - Gets or sets the label for the 'Auto' option of the optionWidth dropdown in the Field Options configuration panel.
      * @property {String} fieldOptionWidth2PerRow                  = 50% (2 items per row)                                                 - Gets or sets the label for the '50%' option of the optionWidth dropdown in the Field Options configuration panel.
      * @property {String} fieldOptionWidth3PerRow                  = 33% (3 items per row)                                                 - Gets or sets the label for the '33%' option of the optionWidth dropdown in the Field Options configuration panel.
      * @property {String} fieldOptionWidth4PerRow                  = 25% (4 items per row)                                                 - Gets or sets the label for the '25%' option of the optionWidth dropdown in the Field Options configuration panel.
      * 
      * @property {String} fieldOption                              = Option                                                                - Gets or sets the label used to describe a field option.
      * @property {String} fieldOptions                             = Options                                                               - Gets or sets the label used to describe field options.
      * @property {String} fieldOptionValue                         = Option Value                                                          - Gets or sets the label used to describe a field option value.
      * @property {String} fieldOptionsType                         = Options Type                                                          - Gets or sets the label for the options type setting in the Field Option configuration panel.
      * @property {String} fieldOptionsTypeStatic                   = Static                                                                - Gets or sets the label for the 'Static' options of the option type radio button in the Field Options configuration panel.
      * @property {String} fieldOptionsTypeDataSource               = Data Source                                                           - Gets or sets the label for the 'DataSource' options of the option type radio button in the Field Options configuration panel.
      * @property {String} fieldOptionLabelHeader                   = Label                                                                 - Gets or sets the label for the label header of a field-option.
      * @property {String} fieldOptionValueHeader                   = Value                                                                 - Gets or sets the label for the value header of a field-option.
      * @property {String} fieldOptionSelectedHeader                = Selected                                                              - Gets or sets the label for the selected header of a field-option.
      * @property {String} fieldOptionDisabledHeader                = Disabled                                                              - Gets or sets the label for the disabled header of a field-option.
      * @property {String} dataSourceId                             = Data Source ID                                                        - Gets or sets the label for the data source id setting in the Field Options configuration panel.
      * @property {String} dataSourcePreview                        = Data Source Preview                                                   - Gets or sets the label for the data source preview setting in the Field Options configuration panel.
      * 
      * @property {String} validationRequired                       = Required                                                              - Gets or sets the label for the required setting in the Validation configuration panel.
      * @property {String} validationDataType                       = Data Type                                                             - Gets or sets the label for the dataType setting in the Validation configuration panel.
      * @property {String} validationDataTypeInteger                = Integer                                                               - Gets or sets the label for the 'Integer' option of the dataType dropdown in the Validation configuration panel.
      * @property {String} validationDataTypeFloat                  = Float                                                                 - Gets or sets the label for the 'Float' option of the dataType dropdown in the Validation configuration panel.
      * @property {String} validationDataTypeDateTime               = DateTime                                                              - Gets or sets the label for the 'DateTime' option of the dataType dropdown in the Validation configuration panel.
      * @property {String} validationDataTypeEmail                  = Email                                                                 - Gets or sets the label for the 'Email' option of the dataType dropdown in the Validation configuration panel.
      * @property {String} validationDataTypeURL                    = URL                                                                   - Gets or sets the label for the 'URL' option of the dataType dropdown in the Validation configuration panel.
      * @property {String} validationDataTypeSource                 = Source                                                                - Gets or sets the label for the 'Source' option of the DataType dropdown in the Validation configuration panel.
      * @property {String} validationPattern                        = Pattern                                                               - Gets or sets the label for the pattern setting in the Validation configuration panel.
      * @property {String} validationPatternHint                    = Regular expression (e.g. ^[0-9]+$)                                    - Gets or sets the label for the pattern setting hint in the Validation configuration panel.
      * @property {String} validationLength                         = Length                                                                - Gets or sets the label for the length setting in the Validation configuration panel.
      * @property {String} validationMinLengthHint                  = Min Length                                                            - Gets or sets the label for the min length setting hint in the Validation configuration panel.
      * @property {String} validationMaxLengthHint                  = Max Length                                                            - Gets or sets the label for the max length setting hint in the Validation configuration panel.
      * @property {String} validationRange                          = Range                                                                 - Gets or sets the label for the range setting in the Validation configuration panel.
      * @property {String} validationMinRangeHint                   = Min Range                                                             - Gets or sets the label for the min range setting hint in the Validation configuration panel.
      * @property {String} validationMaxRangeHint                   = Max Range                                                             - Gets or sets the label for the max range setting hint in the Validation configuration panel.
      * @property {String} validationCompare                        = Compare To                                                            - Gets or sets the label for the compare setting in the Validation configuration panel.
      * 
      * @property {String} validatorMessage_required                = {field} is required.                                                  - Gets or sets the label for required field validation error messages.
      * @property {String} validatorMessage_range                   = {field} must be between {min} and {max}.                              - Gets or sets the label for numeric range validation error messages.
      * @property {String} validatorMessage_length                  = {field} must be between {min} and {max} characters long.              - Gets or sets the label for minimum/maximum length validation error messages.
      * @property {String} validatorMessage_integer                 = {field} must be a valid number.                                       - Gets or sets the label for integer data type validation error messages.
      * @property {String} validatorMessage_float                   = {field} must be a valid decimal number.                               - Gets or sets the label for float data type validation error messages.
      * @property {String} validatorMessage_datetime                = {field} must be a valid date.                                         - Gets or sets the label for datetime data type validation error messages.
      * @property {String} validatorMessage_email                   = {field} must be a valid email address.                                - Gets or sets the label for email data type validation error messages.
      * @property {String} validatorMessage_url                     = {field} must be a valid URL.                                          - Gets or sets the label for URL data type validation error messages.
      * @property {String} validatorMessage_source                  = {field} must be a valid source.                                       - Gets or sets the label for source data type validation error messages.
      * @property {String} validatorMessage_compare                 = {field} must be {operator} {compareField}.                            - Gets or sets the label for comparison validation error messages.
      * @property {String} validatorMessage_pattern                 = {field} has an invalid format.                                        - Gets or sets the label for regex/pattern validation error messages.
      * 
      * @property {String} ruleCase                                 = Rule Case                                                             - Gets or sets the label used to describe a rule case.
      * @property {String} ruleGroup                                = Rule Group                                                            - Gets or sets the label used to describe a rule group.
      * @property {String} ruleCaseHeader                           = Rule Case                                                             - Gets or sets the label for the rule case header in the Rules configuration panel.
      * @property {String} ruleCaseTrigger                          = Case Trigger                                                          - Gets or sets the label for the rule case trigger setting in the Rules configuration panel.
      * @property {String} ruleCaseRunVisibility                    = Run When                                                              - Gets or sets the label for the rule case run visibility setting in the Rules configuration panel.
      * @property {String} ruleGroupConnector                       = Group Connector                                                       - Gets or sets the label for the rule group connector setting in the Rules configuration panel.
      * @property {String} ruleGroupsEmptyHint                      = Actions will fire unconditionally                                     - Gets or sets the message to display when the rule groups container element is empty.
      * @property {String} actionsHeader                            = Actions                                                               - Gets or sets the label for the actions header in the Rules configuration panel.
      * @property {String} ruleFieldHint                            = - Field -                                                             - Gets or sets the label for the rule field setting hint in the Rules configuration panel.
      * @property {String} ruleComparisonOperatorHint               = - Condition -                                                         - Gets or sets the label for the rule comparison operator hint in the Rules configuration panel.
      * 
      * @property {String} operator_and                             = AND                                                                   - Gets or sets the label for the AND logical operator.
      * @property {String} operator_or                              = OR                                                                    - Gets or sets the label for the OR logical operator.
      * @property {String} operator_equal                           = Equal                                                                 - Gets or sets the label for the equal operator.
      * @property {String} operator_not_equal                       = Not Equal                                                             - Gets or sets the label for the not equal operator.
      * @property {String} operator_less_than                       = Less Than                                                             - Gets or sets the label for the less than operator.
      * @property {String} operator_less_than_or_equal              = Less Than Or Equal                                                    - Gets or sets the label for the less than or equal operator.
      * @property {String} operator_greater_than_or_equal           = Greater Than Or Equal                                                 - Gets or sets the label for the greater than or equal operator.
      * @property {String} operator_greater_than                    = Greater Than                                                          - Gets or sets the label for the greater than operator.
      * @property {String} operator_contains                        = Contains                                                              - Gets or sets the label for the contains operator.
      * @property {String} operator_not_contains                    = Does Not Contain                                                      - Gets or sets the label for the not contains operator.
      * @property {String} operator_starts_with                     = Starts With                                                           - Gets or sets the label for the starts with operator.
      * @property {String} operator_ends_with                       = Ends With                                                             - Gets or sets the label for the ends with operator.
      * @property {String} operator_empty                           = Empty                                                                 - Gets or sets the label for the empty operator.
      * @property {String} operator_not_empty                       = Not Empty                                                             - Gets or sets the label for the not empty operator.
      * @property {String} operator_visible                         = Visible                                                               - Gets or sets the label for the visible operator.
      * @property {String} operator_hidden                          = Hidden                                                                - Gets or sets the label for the hidden (not visible) operator.
      * @property {String} operator_enabled                         = Enabled                                                               - Gets or sets the label for the enabled operator.
      * @property {String} operator_disabled                        = Disabled                                                              - Gets or sets the label for the disabled operator.
      * @property {String} operator_required                        = Required                                                              - Gets or sets the label for the required operator.
      * @property {String} operator_optional                        = Optional                                                              - Gets or sets the label for the optional operator.
      *
      * @property {String} trigger_always                           = Always                                                                - Gets or sets the label for the always rule case trigger.
      * @property {String} trigger_change                           = On Field Change                                                       - Gets or sets the label for the change rule case trigger.
      * @property {String} trigger_init                             = On Form Load                                                          - Gets or sets the label for the init rule case trigger.
      * @property {String} trigger_show_section                     = On Show Section                                                       - Gets or sets the label for the show section rule case trigger.
      * @property {String} trigger_before_submit                    = Before Form Submit                                                    - Gets or sets the label for the before submit rule case trigger.
      * @property {String} trigger_submit_succeeded                 = After Successful Submit                                               - Gets or sets the label for the succeeded submit rule case trigger.
      * @property {String} trigger_submit_failed                    = After Failed Submit                                                   - Gets or sets the label for the failed submit rule case trigger.
      * 
      * @property {String} run_visibility_visible                   = Field is Visible                                                      - Gets or sets the label for the rule case run visibility 'visible' option.
      * @property {String} run_visibility_hidden                    = Field is Visible or Hidden                                            - Gets or sets the label for the rule case run visibility 'hidden' option.
      * @property {String} run_visibility_section_hidden            = Section is Hidden                                                     - Gets or sets the label for the rule case run visibility 'section_hidden' option.
      * 
      * @property {String} action_value                             = Set Value                                                             - Gets or sets the label for the set field value action.
      * @property {String} action_expression                        = Set Value Expression                                                  - Gets or sets the label for the set field value expression action.
      * @property {String} action_feedback                          = Feedback Message                                                      - Gets or sets the label for the set field feedback value action.
      * @property {String} action_alert                             = Alert Dialog                                                          - Gets or sets the label for the set field alert value action.
      * @property {String} action_confirm                           = Confirmation Dialog                                                   - Gets or sets the label for the set field confirm value action.
      * @property {String} action_required                          = Set Required                                                          - Gets or sets the label for the set field required action.
      * @property {String} action_optional                          = Set Optional                                                          - Gets or sets the label for the set field optional action.
      * @property {String} action_hide                              = Hide                                                                  - Gets or sets the label for the hide field action.
      * @property {String} action_show                              = Show                                                                  - Gets or sets the label for the show field action.
      * @property {String} action_disable                           = Enable                                                                - Gets or sets the label for the disable field action.
      * @property {String} action_enable                            = Disable                                                               - Gets or sets the label for the enable field action.
      * @property {String} action_read                              = Read only                                                             - Gets or sets the label for the readonly field action.
      * @property {String} action_editable                          = Editable                                                              - Gets or sets the label for the editable field action.
      * @property {String} action_disable_next                      = Disable Next/Submit                                                   - Gets or sets the label for the disable next/submit button action.
      * @property {String} action_enable_next                       = Enable Next/Submit                                                    - Gets or sets the label for the disable next/submit button action.
      * @property {String} action_cancel                            = Cancel Submit                                                         - Gets or sets the label for the cancel submit action.
      * @property {String} action_show_section                      = Show Section                                                          - Gets or sets the label for the show section action.
      * @property {String} action_end                               = End Form                                                              - Gets or sets the label for the end form action.
      * 
      * @property {String} actionValueHint                          = Enter a Value                                                         - Gets or sets the label for the 'Set Value' action hint in the Rules configuration panel.
      * @property {String} actionExpressionHint                     = Enter an Expression                                                   - Gets or sets the label for the 'Set Expression' action in the Rules configuration panel.
      * 
      * @property {String} componentPanelHeader                     = {0} Configuration                                                     - Gets or sets the label for the component configuration panel header. The {0} tag gets replaced with the name of the component.
      * 
      * @property {String} textbox                                  = Textbox                                                               - Gets or sets the label for the friendly name when the field input type is a textbox element.
      * @property {String} textarea                                 = Textarea                                                              - Gets or sets the label for the friendly name when the field input type is a textarea element.
      * @property {String} checkbox                                 = Checkbox                                                              - Gets or sets the label for the friendly name when the field input type is a checkbox element.
      * @property {String} radio                                    = Radio                                                                 - Gets or sets the label for the friendly name when the field input type is a radio element.
      * @property {String} switch                                   = Switch                                                                - Gets or sets the label for the friendly name when the field input type is a switch element.
      * @property {String} maskedTextBox                            = Masked Textbox                                                        - Gets or sets the label for the friendly name when the field input type is a MaskedTextBox component.
      * @property {String} numericBox                               = Number                                                                - Gets or sets the label for the friendly name when the field input type is a NumericBox component.
      * @property {String} comboBox                                 = Dropdown                                                              - Gets or sets the label for the friendly name when the field input type is a ComboBox component.
      * @property {String} datePicker                               = Date                                                                  - Gets or sets the label for the friendly name when the field input type is a DatePicker component.
      * @property {String} timePicker                               = Time                                                                  - Gets or sets the label for the friendly name when the field input type is a TimePicker component.
      * @property {String} slider                                   = Slider                                                                - Gets or sets the label for the friendly name when the field input type is a Slider component.
      * @property {String} fileUpload                               = File Upload                                                           - Gets or sets the label for the friendly name when the field input type is a FileUpload component. 
      * @property {String} editor                                   = Editor                                                                - Gets or sets the label for the friendly name when the field input type is a Editor component.
      * @property {String} contentField                             = Content                                                               - Gets or sets the label for the friendly name when the field type is a Content field.
      * @property {String} spacerField                              = Spacer                                                                - Gets or sets the label for the friendly name when the field type is a Spacer field.
      * 
      * @property {String} multiSelect                              = Enable Multi-Selection                                                - Gets or sets the label for the multiSelect setting in the ComboBox configuration panel.
      * @property {String} multiSelectTagging                       = Selections as Tags                                                    - Gets or sets the label for the multiSelectTagging setting in the ComboBox configuration panel.
      * @property {String} allowInput                               = Allow Typing                                                          - Gets or sets the label for the allowInput setting in the ComboBox configuration panel.
      * 
      * @property {String} today                                    = Default to Today                                                      - Gets or sets the label for the today setting in the DatePicker configuration panel.
      * @property {String} allowedDates                             = Allow Listed Dates                                                    - Gets or sets the label for the allowedDates setting in the DatePicker configuration panel.
      * @property {String} disallowDates                            = Disallow Listed Dates                                                 - Gets or sets the label for the disallowDates setting in the DatePicker configuration panel.
      * 
      * @property {String} precision                                = Decimal Precision                                                     - Gets or sets the label for the precision setting in the NumericBox configuration panel.
      * 
      * @property {String} mask                                     = Mask                                                                  - Gets or sets the label for the mask setting in the MaskedTextBox configuration panel.
      * @property {String} maskTooltip                                                                                                      - Gets or sets the label for the tooltip for the mask setting in the MaskedTextBox configuration panel. 
      *                      
      * @property {String} allowedCharacters                        = Allowed Characters                                                    - Gets or sets the label for the allowedCharacters setting in the MaskedTextBox configuration panel.
      * @property {String} allowedCharactersAlphanumeric            = Alphanumeric                                                          - Gets or sets the label for the 'Alphanumeric' option of the allowedCharacters dropdown in the MaskedTextBox configuration panel.
      * @property {String} allowedCharactersDigits                  = Digits                                                                - Gets or sets the label for the 'Digits' option of the allowedCharacters dropdown in the MaskedTextBox configuration panel.
      * @property {String} allowedCharactersLetters                 = Letters                                                               - Gets or sets the label for the 'Letters' option of the allowedCharacters dropdown in the MaskedTextBox configuration panel.
      * 
      * @property {String} range                                    = Enable Range Selection                                                - Gets or sets the label for the range setting in the Slider configuration panel.
      * @property {String} trackSize                                = Track Size                                                            - Gets or sets the label for the trackSize setting in the Slider configuration panel.
      * @property {String} trackSizeHint                            = 200px, 100%, 20ch — use CSS units                                     - Gets or sets the label for the trackSize setting hint in the Field configuration panel.
      * @property {String} startValue                               = Start Value                                                           - Gets or sets the label for the startValue setting in the Slider configuration panel.
      * @property {String} tickMarks                                = Tick Marks                                                            - Gets or sets the label for the tickMarks setting in the Slider configuration panel. 
      * 
      * @property {String} incrementalValue                         = Step Interval (minutes)                                               - Gets or sets the label for the incrementalValue setting in the TimePicker configuration panel.
      * @property {String} allowedTimes                             = Allowed Times                                                         - Gets or sets the label for the allowedTimes setting in the TimePicker configuration panel.
      * @property {String} disallowTimes                            = Disallow Listed Times                                                 - Gets or sets the label for the disallowTimes setting in the TimePicker configuration panel.
      * 
      * @property {String} accept                                   = Accept                                                                - Gets or sets the label for the accept setting in the FileUpload configuration panel.
      * @property {String} acceptHint                               = .png, .jpg, .jpeg                                                     - Gets or sets the label for the placeholder setting hint for the accept setting in the FileUpload configuration panel.
      * @property {String} maxFileSize                              =  Max. File Size (KB)                                                  - Gets or sets the label for the maxFileSize setting in the FileUpload configuration panel.
      * @property {String} maxFiles                                 =  Max. Files                                                           - Gets or sets the label for the maxFiles setting in the FileUpload configuration panel.
      * 
      * @property {String} all                                      = All Options                                                           - Gets or sets the label for the all setting in the Editor configuration panel.
      * @property {String} block                                    = Block styles                                                          - Gets or sets the label for the block setting in the Editor configuration panel.
      * @property {String} link                                     = Links                                                                 - Gets or sets the label for the link setting in the Editor configuration panel.
      * @property {String} list                                     = Lists                                                                 - Gets or sets the label for the list setting in the Editor configuration panel.
      * @property {String} special                                  = Special Chars                                                         - Gets or sets the label for the special setting in the Editor configuration panel. 
      *
      * @property {String} margin                                   = Margin                                                                - Gets or sets the label for the margin setting in the Content configuration panel. 
      * @property {String} marginHint                               = 5px, 100% - use CSS units                                             - Gets or sets the label for the margin setting hint in the Content configuration panel.
      * @property {String} padding                                  = Padding                                                               - Gets or sets the label for the padding setting in the Content configuration panel. 
      * @property {String} paddingHint                              = 5px, 100% - use CSS units                                             - Gets or sets the label for the padding setting hint in the Content configuration panel.
      * @property {String} backgroundColor                          = Background color                                                      - Gets or sets the label for the backgroundColor setting in the Content configuration panel.
      * @property {String} borderWidth                              = Border width                                                          - Gets or sets the label for the borderWidth setting in the Content configuration panel.
      * @property {String} borderColor                              = Border color                                                          - Gets or sets the label for the borderColor setting in the Content configuration panel.
      * @property {String} borderRadius                             = Border radius                                                         - Gets or sets the label for the borderRadius setting in the Content configuration panel.
      * @property {String} borderRadiusHint                         = 5px, 100% - use CSS units                                             - Gets or sets the label for the borderRadius setting hint in the Content configuration panel.
      * 
      * @property {String} showDivider                              = Show Divider                                                          - Gets or sets the label for the showDivider setting in the Spacer configuration panel. 
      * @property {String} height                                   = Height                                                                - Gets or sets the label for the height setting in the Spacer configuration panel.
      * @property {String} heightHint                               = 10px, 2em - use CSS units                                             - Gets or sets the label for the height setting hint in the Spacer configuration panel.
      * 
      * @property {String} saveInProgress                           = Saving...                                                             - Gets or sets the label for the save-status when the save is in progress.
      * @property {String} saveSuccess                              = Saved...                                                              - Gets or sets the label for the save-status when the save is successful.
      * @property {String} saveFailed                               = Save failed                                                           - Gets or sets the label for the save-status when the save failed.
      * 
      * @property {String} alertDialogHeader                        = Alert                                                                 - Gets or sets the header label for the alert dialog.
      * @property {String} confirmDialogHeader                      = Confirmation                                                          - Gets or sets the header label for the confirmation dialog.
      * 
      * @property {String} previous                                 = Previous                                                              - Gets or sets the label for the previous section button.
      * @property {String} next                                     = Next                                                                  - Gets or sets the label for the next section button.
      * @property {String} submit                                   = Submit                                                                - Gets or sets the label for the submit button.
      * 
      * @property {String} navigatorSearchHint                      = Find Field                                                            - Gets or sets the label for the navigator search-box hint in the Navigator panel.
      * 
      * @property {String} buildPanel_fields                       = Fields                                                                - Gets or sets the label for the title of the Fields build-panel.
      * @property {String} buildPanel_content                      = Content                                                               - Gets or sets the label for the title of the Content build-panel.
      * @property {String} buildPanel_navigator                    = Navigator                                                             - Gets or sets the label for the title of the Navigator build-panel.
      * @property {String} configPanel_fieldset                    = FieldSet Configuration                                                - Gets or sets the label for the title of the FieldSet config-panel.
      * @property {String} configPanel_field                       = Field Configuration                                                   - Gets or sets the label for the title of the Field config-panel.
      * @property {String} configPanel_content                     = Content Field Configuration                                           - Gets or sets the label for the title of the Content config-panel.
      * @property {String} configPanel_spacer                      = Spacer Field Configuration                                            - Gets or sets the label for the title of the Spacer config-panel.
      * @property {String} configPanel_fieldOptions                = Field Options                                                         - Gets or sets the label for the title of the Field Options config-panel.
      * @property {String} configPanel_validation                  = Validation Rules                                                      - Gets or sets the label for the title of the Validation Rules config-panel.
      * @property {String} configPanel_rules                       = Conditional Rules                                                     - Gets or sets the label for the title of the Conditional Rules config-panel.
      */

    /**
     * Form CSS Variables.
     * @typedef {Object} CSSVariables
     * @memberof componyx.UI.Form
     * @property {string} ["--fieldset-border-width"]="1px"                                             - Border width of fieldsets.
     * @property {string} ["--fieldset-drop-above-margin"]="-34px"                                      - Margin above a drop target fieldset.
     * @property {string} ["--fieldset-bannered-drop-above-margin"]="-52px"                             - Margin above a bannered drop target.
     * @property {string} ["--fieldset-nested-margin"]="30px"                                           - Margin for nested fieldsets.
     * @property {string} ["--droppable-margin"]="20px"                                                 - Margin between droppable zones when dropping a field(set).
     * @property {string} ["--droppable-line-size"]="5px"                                               - Height of the droppable line.
     * @property {string} ["--build-pane-width"]="clamp(220px, 15vw, 260px)"                            - Width of the build pane.
     * @property {string} ["--config-pane-width"]="clamp(360px, 25vw, 500px)"                           - Width of the config pane.
     * @property {string} ["--header-height"]="48px"                                                    - Height of the header.
     * @property {string} ["--fixed-layout-offset-top"]="0px"                                           - Top offset for fixed layout.
     * @property {string} ["--fixed-layout-offset-bottom"]="0px"                                        - Bottom offset for fixed layout.
     * @property {string} ["--fixed-layout-offset-left"]="0px"                                          - Left offset for fixed layout.
     * @property {string} ["--fixed-layout-offset-right"]="0px"                                         - Right offset for fixed layout.
     * @property {string} ["--fixed-layout-z-index"]="9"                                                - Z-index for fixed layout elements.
     */

    /**
     * @typedef {Object} FormatConfig
     * @memberof componyx.UI.Form
     * @property {string} dateFormat Gets or sets the input format for dates. Default: MM/dd/yyyy.
     * @property {string} decimalSeparator Gets or sets the decimal separator for numbers. Default: '.'.
     * @property {string} groupSeparator Gets or sets the group (thousands) separator for numbers. Default: ','.
     */
    const formatConfig = {
        dateFormat: 'mm/dd/yyyy',
        decimalSeparator: '.',
        groupSeparator: ','
    };

    /**
     * Form class.
     * @class
     * @memberof componyx.UI
     * @augments componyx.UI.base.WebComponent
     * @mixes componyx.UI.base.methods
     * @param {String} id The id of the component.
     * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
     * @returns {componyx.UI.Form} An instance of the component.
    */
    class Form extends componyx.UI.base.WebComponent
    {
        static #customFieldTypes = new Map();

        #guidCounter;
        #fieldAttribute = 'data-ui-form-field';
        #selectedSectionId;
        #selectedFieldSetId;
        #selectedFieldId;
        #buildPane; #formPane; #configPane;
        #undoRedoHandler;
        #templateTags;
        #sanitizer;
        #blockType = Form.BlockTypeOption;
        #typeGroups;
        #runtimeActions = {};
        dataBinder;
        draggable;
        dataObserver;
        #saveTimerId;

        /**
         * Internal CSS class name constants.
         * You can override any of these classes on the Component instance by defining a property named
         * `cssClass<Key>` where <Key> is the PascalCase key from this object.
         * Example:
         *  'BUILD_PANE' -> 'cssClassBuildPane'
         * Be cautious: overriding these classes without including the default names may break styling and functionality.
         * @constant
         * @type {Readonly<Object<string, string>>}
         */
        classOption = Object.freeze(
            {
                BUILD_MODE: 'build-mode',
                PREVIEW_MODE: 'preview-mode',
                EDIT_MODE: 'edit-mode',
                VIEW_MODE: 'view-mode',
                FIXED_LAYOUT: 'fixed-layout',
                PANES: 'panes',
                BUILD_PANE: 'build-pane',
                CONFIG_PANE: 'config-pane',
                FORM_PANE: 'form-pane',
                FIELD_PANE: 'field-pane',
                PANE_HIDDEN: 'pane-hidden',
                EDGE_TOP: 'edge-top',
                EDGE_BOTTOM: 'edge-bottom',
                LINE_BREAK: 'line-break',
                VIEW_FIELD: 'view-field',
                EDIT_FIELD: 'edit-field',
                BUILD_FIELD: 'build-field',
                BUILD_MENU: 'build-menu',
                LABEL: 'label',
                REMOVE: 'remove',
                CLONE: 'clone',
                ADD: 'add',
                DISABLED: 'disabled',
                INVISIBLE: 'invisible',
                READONLY: 'readonly',
                FILLER: 'filler',
                BUILD_BLOCK: 'build-block',
                BUILD_BLOCK_INSERT: 'insert',
                FIELD_INDICATORS: 'field-indicators',
                ICON: 'icon',
                TOOLTIP_ICON: 'ico-question-mark',
                RULES_ICON: 'ico-chip',
                VALIDATOR_ICON: 'ico-validator',
                DRAG_GHOST: 'drag-ghost',
                DRAG_HANDLE: 'drag-handle',
                DRAGGING: 'dragging',
                DROPPABLE: 'droppable',
                DROP_LEFT: 'drop-left',
                DROP_RIGHT: 'drop-right',
                DROP_ABOVE: 'drop-above',
                DROP_BELOW: 'drop-below',
                DROP_INSIDE: 'drop-inside',
                DROP_DENIED: 'drop-denied',
                FIELD_SET: 'field-set',
                BANNERED: 'bannered',
                LAYOUTLESS: 'layoutless',
                SELECTED: 'selected',
                TITLE: 'title',
                SECTION_SWITCH: 'section-switch',
                COMMANDS: 'commands',
                SECTIONS: 'sections',
                SECTION_ADD: 'section-add',
                SECTION_REMOVE: 'section-remove icon ico-bin',
                SECTION_PREVIOUS: 'section-prev',
                SECTION_NEXT: 'section-next',
                STEP_INDICATOR: 'step-indicator',
                STEP: 'step',
                STEP_ACTIVE: 'step-active',
                SUBMIT: 'submit',
                CONFIG_CHOICE_GROUP: 'config-choice-group',
                MORE_SETTINGS: 'more-settings',
                FIELD_OPTIONS_TYPE: 'options-type',
                FIELD_OPTIONS: 'field-options',
                FIELD_OPTIONS_INLINE: 'options-inline',
                FIELD_OPTIONS_ROW: 'options-row',
                FIELD_OPTIONS_HEADER: 'option-header',
                FIELD_OPTIONS_ITEM: 'option-item',
                FIELD_OPTIONS_ITEM_NEW: 'option-new',
                FIELD_OPTIONS_ITEM_GHOST: 'option-item-ghost',
                ALLOWED_LIST: 'allowed-list',
                REPEATABLE: 'repeatable',
                REPEAT_ADD: 'repeat-add',
                REPEAT_REMOVE: 'repeat-remove',
                EMPTY: 'empty',
                FIELD_TOOLTIP: 'tooltip field-tooltip',
                SPACER: 'spacer',
                CONTENT: 'content',
                DIVIDER: 'divider',
                COMBOBOX_VAL_COMPARE_OPERATOR: 'val-compare-operator',
                COMBOBOX_VAL_COMPARE_FIELD: 'val-compare-field',
                COMBOBOX_LOGICAL_OPERATOR: 'logical-operator',
                COMBOBOX_RULE_FIELD: 'rule-field',
                COMBOBOX_RULE_COMPARISON_OPERATOR: 'rule-comparison-operator',
                COMBOBOX_ACTION: 'action',
                RULE_CASE: 'rule-case',
                RULE_CASE_TRIGGER: 'rule-case-trigger',
                RULE_CASE_RUN_VISIBILITY: 'rule-case-run-visibility',
                ACTIONS: 'actions',
                RULE_GROUPS: 'rule-groups',
                RULE_GROUP: 'rule-group',
                RULES: 'rules',
                RULE: 'rule',
                RULE_VALUE: 'rule-value',
                ACTION: 'action',
                ACTION_FOLLOW_UP: 'follow-up',
                ACTION_VALUE: 'action-value',
                EXPRESSION: 'expression',
                EXPRESSION_CONTROLS: 'expr-controls',
                FEEDBACK: 'feedback',
                VALIDATION_FEEDBACK: 'val-feedback',
                RULE_FEEDBACK: 'rule-feedback',
                SAVE_STATUS: 'save-status',
                SAVE_STATUS_BUSY: 'busy',
                SAVE_STATUS_SUCCESS: 'success',
                SAVE_STATUS_FAILED: 'failed',
                SPINNER: 'spinner',
            });

        constructor(id, properties)
        {
            super(id, properties);

            // Private fields
            this.#typeGroups = {
                group: ['Section', this.#blockType.getName(this.#blockType.FIELD_SET)],
                input: [this.#blockType.getName(this.#blockType.FIELD)],
                content: [this.#blockType.getName(this.#blockType.CONTENT_FIELD), this.#blockType.getName(this.#blockType.SPACER_FIELD)]
            };

            /**
             * Defines the valid property keys (tags) available in each configuration panel template.
             * Each key corresponds to a panel ID or component-specific panel,
             * and the array lists the names of the fields/properties supported in that panel's template.
             * 
             * @private
             * @type {Object.<string, string[]>}
             * @property {string[]} Header - Template tags for the Header panel: 'title', 'saveStatus', 'sectionSwitch', 'commands'.
             * @property {string[]} FieldSetPanel - Template tags for the FieldSet configuration panel: 'id', 'layout', 'labelDisplay', 'repeatable', 'maxRepeats', 'repeatLabel', 'tooltip', 'lineBreak', 'visible', 'disabled'.
             * @property {string[]} FieldPanel - Template tags for the Field configuration panel: 'name', 'labelDisplay', 'placeholder', 'tooltip', 'value', 'role', 'width', 'required', 'lineBreak', 'visible', 'disabled', 'readOnly'.
             * @property {string[]} ContentFieldPanel - Template tags for the ContentField configuration panel: 'width', 'margin', 'padding', 'borderWidth', 'borderRadius', 'borderColor', 'backgroundColor', 'lineBreak', 'visible'.
             * @property {string[]} SpacerFieldPanel - Template tags for the SpacerField configuration panel: 'showDivider', 'height'.
             * @property {string[]} FieldOptionsPanel - Template tags for the FieldOptions panel: 'optionsType', 'dataSourceId', 'dataSourcePreview', 'inlineOptions', 'optionWidth', 'options'.
             * @property {string[]} ComponentPanel_MaskedTextBox - Template tags for the MaskedTextBox component panel: 'mask', 'value', 'allowedCharacters'.
             * @property {string[]} ComponentPanel_NumericBox - Template tags for the NumericBox component panel: 'precision', 'value', 'minValue', 'maxValue'.
             * @property {string[]} ComponentPanel_ComboBox - Template tags for the ComboBox component panel: 'multiSelect', 'multiSelectTagging', 'allowInput'.
             * @property {string[]} ComponentPanel_DatePicker - Template tags for the DatePicker component panel: 'today', 'value', 'minValue', 'maxValue', 'allowedDates', 'disallowDates'.
             * @property {string[]} ComponentPanel_TimePicker - Template tags for the TimePicker component panel: 'value', 'minValue', 'maxValue', 'incrementalValue', 'allowedTimes', 'disallowTimes'.
             * @property {string[]} ComponentPanel_Slider - Template tags for the Slider component panel: 'range', 'trackSize', 'startValue', 'value', 'minValue', 'maxValue', 'tickMarks'.
             * @property {string[]} ComponentPanel_FileUpload - Template tags for the FileUpload component panel: 'accept', 'maxFileSize', 'maxFiles', 'dataSourceId'.
             * @property {string[]} ComponentPanel_Editor - Template tags for the Editor component panel: 'all', 'list', 'block', 'link', 'special'.
             * @property {string[]} ValidationPanel - Template tags for the Validation panel: 'required', 'dataType', 'length', 'range', 'compare', 'pattern'.
             */
            this.#templateTags = {
                Header: ['title', 'saveStatus', 'sectionSwitch', 'commands'],
                FieldSetPanel: ['id', 'layout', 'labelDisplay', 'repeatable', 'maxRepeats', 'repeatLabel', 'tooltip', 'lineBreak', 'visible', 'disabled'],
                FieldPanel: ['name', 'labelDisplay', 'placeholder', 'tooltip', 'value', 'role', 'width', 'required', 'lineBreak', 'visible', 'disabled', 'readOnly'],
                ContentFieldPanel: ['width', 'margin', 'padding', 'borderWidth', 'borderRadius', 'borderColor', 'backgroundColor', 'lineBreak', 'visible'],
                SpacerFieldPanel: ['showDivider', 'height'],
                FieldOptionsPanel: ['optionsType', 'dataSourceId', 'dataSourcePreview', 'inlineOptions', 'optionWidth', 'options'],
                ComponentPanel_MaskedTextBox: ['mask', 'value', 'allowedCharacters'],
                ComponentPanel_NumericBox: ['precision', 'value', 'minValue', 'maxValue'],
                ComponentPanel_ComboBox: ['multiSelect', 'multiSelectTagging', 'allowInput'],
                ComponentPanel_DatePicker: ['today', 'value', 'minValue', 'maxValue', 'allowedDates', 'disallowDates'],
                ComponentPanel_TimePicker: ['value', 'minValue', 'maxValue', 'incrementalValue', 'allowedTimes', 'disallowTimes'],
                ComponentPanel_Slider: ['range', 'trackSize', 'startValue', 'value', 'minValue', 'maxValue', 'tickMarks'],
                ComponentPanel_FileUpload: ['accept', 'maxFileSize', 'maxFiles', 'dataSourceId'],
                ComponentPanel_Editor: ['all', 'list', 'block', 'link', 'special'],
                ValidationPanel: ['required', 'dataType', 'length', 'range', 'compare', 'pattern']
            };

            this.#undoRedoHandler = (e) =>
            {
                const isUndo = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z',
                    isRedo = (e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'));

                if (isUndo || isRedo)
                {
                    e.preventDefault(); // stops browser undo/redo
                }
            };

            // Public fields
            /** Gets or sets the tab index of the form element. A value is required so the form can receive focus programmatically, enabling its keyboard shortcuts.
            * @type {number} 
            */
            this.tabIndex;

            /** Gets or sets the format configuration for dates and numbers.
            * @type {componyx.UI.Form.FormatConfig}
            */
            this.format = formatConfig;

            /** Gets or sets a value indicating whether the display is in build, edit or view mode.
            * @type {componyx.UI.Form.DisplayModeOption} 
            */
            this.displayMode = Form.DisplayModeOption.EDIT;

            /** Gets or sets a value indicating whether the label is displayed automatically, inside, above, before or after the form input field.
            * @type {componyx.UI.FormField.LabelDisplayOption} 
            */
            this.labelDisplay = null;

            /** Gets or sets a value indicating if the form uses a fixed layout with always-visible side panes and header. Useful when embedding the form in full-page layouts.
            * @type {boolean} 
            */
            this.fixedLayout = true;

            /** Gets or sets a value indicating whether the form navigation buttons (previous/next/submit) are rendered.
            * @type {boolean} 
            */
            this.renderNavigationButtons = true;

            /** Gets or sets a value indicating if the data binding (via Bindary) is automatically activated on the form fields.
            * @type {boolean} 
            */
            this.autoDataBindFields = true;

            /** Gets or sets a value indicating whether the form binds field values to a custom external model instead of the internal model (form.values).
            * @type {boolean} 
            */
            this.bindToCustomModel = false;

            /** Gets or sets a method to retrieve the custom external model. When bindToCustomModel is set to true and the form has default field values or form rules this property is required.
            * @type {function} 
            */
            this.customModelGetter = null;

            /** Gets or sets a value indicating whether the form element is configured with a root data binding context (set via the Bindary context attribute). When true, this element serves as the root of the view update, potentially improving performance.
            * @type {boolean} 
            */
            this.hasDataBindRootContext = false;

            /** Gets or sets the array of nested field sets. Sections group FieldSets (cannot contain fields) while FieldSets directly contain fields, ensuring every field is always within a FieldSet.
            * @type {Array<componyx.UI.Form.Section|componyx.UI.Form.FieldSet>} 
            */
            this.fieldSets = [];

            /** Gets or sets the current form field values stored by bindingKey or name.
            * @type {Object<string, any>}
            */
            this.values = {};

            /**
             * Gets or sets the field roles that determine how this field’s data is processed by the backend. Each role can specify a default value and be restricted to certain input types.
             * @type {componyx.UI.Form.FieldRole[]}
             */
            this.fieldRoles = [];

            /** Gets or sets the panels of the build panel-bar. If using Panel instances, the PanelBar script must be available at design time. If using plain objects, they are converted at runtime, and the PanelBar script is imported in the preRender phase.
            * The cssClass values of the default panels are used by the built-in styling and should be kept unless you intentionally override the design.
            * @type {Array<componyx.UI.PanelBar.Panel> | Array<Object>}
            */
            this.buildPanels = [
                {
                    id: 'Fields',
                    cssClass: 'fields-panel',
                    title: ':buildPanel_fields',
                    expanded: true
                },
                {
                    id: 'Content',
                    cssClass: 'content-panel',
                    title: ':buildPanel_content',
                },
                {
                    id: 'Navigator',
                    cssClass: 'navigator-panel',
                    title: ':buildPanel_navigator',
                }
            ];

            /** Gets or sets the panels of the config panel-bar. If using Panel instances, the PanelBar script must be available at design time. If using plain objects, they are converted at runtime, and the PanelBar script is imported in the preRender phase.
            * The cssClass values of the default panels are used by the built-in styling and should be kept unless you intentionally override the design.
            * @type {Array<componyx.UI.PanelBar.Panel> | Array<Object>}
            */
            this.configPanels = [
                {
                    id: 'FieldSetPanel',
                    cssClass: 'fieldset-panel',
                    title: ':configPanel_fieldset',
                },
                {
                    id: 'FieldPanel',
                    cssClass: 'field-panel',
                    title: ':configPanel_field'
                },
                {
                    id: 'ContentFieldPanel',
                    cssClass: 'content-field-panel',
                    title: ':configPanel_content'
                },
                {
                    id: 'SpacerFieldPanel',
                    cssClass: 'spacer-field-panel',
                    title: ':configPanel_spacer'
                },
                {
                    id: 'FieldOptionsPanel',
                    cssClass: 'field-options-panel',
                    title: ':configPanel_fieldOptions'
                },
                {
                    id: 'ComponentPanel',
                    cssClass: 'component-panel'
                },
                {
                    id: 'ValidationPanel',
                    cssClass: 'validation-panel',
                    title: ':configPanel_validation',
                },
                {
                    id: 'RulesPanel',
                    cssClass: 'rules-panel',
                    title: ':configPanel_rules',
                }
            ]

            /** Gets or sets the build blocks that are displayed in the form's build pane when the displayMode is set to BUILD.
            * @type {Array<componyx.UI.Form.BuildBlock>}
            */
            this.buildBlocks = [
                new Form.BuildBlock({
                    label: ':textbox',
                    inputType: Form.InputTypeOption.TEXTBOX,
                    cssClass: 'text-box-field',
                    cssClassIcon: 'ico-text'
                }),
                new Form.BuildBlock({
                    label: ':textarea',
                    inputType: Form.InputTypeOption.TEXTAREA,
                    cssClass: 'text-area-field',
                    cssClassIcon: 'ico-textarea'
                }),
                new Form.BuildBlock({
                    label: ':checkbox',
                    inputType: Form.InputTypeOption.CHECKBOX,
                    cssClass: 'check-box-field',
                    cssClassIcon: 'ico-checkbox'
                }),
                new Form.BuildBlock({
                    label: ':radio',
                    inputType: Form.InputTypeOption.RADIO,
                    cssClass: 'radio-field',
                    cssClassIcon: 'ico-radio'
                }),
                new Form.BuildBlock({
                    label: ':switch',
                    inputType: Form.InputTypeOption.SWITCH,
                    cssClass: 'switch-field',
                    cssClassIcon: 'ico-switch'
                }),
                new Form.BuildBlock({
                    label: ':numericBox',
                    inputType: Form.InputTypeOption.NUMERICBOX,
                    cssClass: 'numeric-box-field',
                    cssClassIcon: 'ico-com-numeric-box'
                }),
                new Form.BuildBlock({
                    label: ':comboBox',
                    inputType: Form.InputTypeOption.COMBOBOX,
                    cssClass: 'combo-box-field',
                    cssClassIcon: 'ico-com-combo-box'
                }),
                new Form.BuildBlock({
                    label: ':datePicker',
                    inputType: Form.InputTypeOption.DATEPICKER,
                    cssClass: 'date-picker-field',
                    cssClassIcon: 'ico-com-date-picker'
                }),
                new Form.BuildBlock({
                    label: ':timePicker',
                    inputType: Form.InputTypeOption.TIMEPICKER,
                    cssClass: 'time-picker-field',
                    cssClassIcon: 'ico-com-time-picker'
                }),
                new Form.BuildBlock({
                    label: ':maskedTextBox',
                    inputType: Form.InputTypeOption.MASKEDTEXTBOX,
                    cssClass: 'masked-text-box-field',
                    cssClassIcon: 'ico-com-masked-textbox',
                }),
                new Form.BuildBlock({
                    label: ':slider',
                    inputType: Form.InputTypeOption.SLIDER,
                    cssClass: 'slider-field',
                    cssClassIcon: 'ico-com-slider',
                }),
                new Form.BuildBlock({
                    label: ':fileUpload',
                    inputType: Form.InputTypeOption.FILEUPLOAD,
                    cssClass: 'file-upload-field',
                    cssClassIcon: 'ico-com-file-upload',
                }),
                new Form.BuildBlock({
                    label: ':editor',
                    inputType: Form.InputTypeOption.EDITOR,
                    cssClass: 'rich-textbox-field',
                    cssClassIcon: 'ico-italic',
                }),
                new Form.BuildBlock({
                    blockType: Form.BlockTypeOption.FIELD_SET,
                    label: ':fieldSet',
                    cssClass: 'field-set',
                    cssClassIcon: 'ico-group',
                    panelId: 'Content'
                }),
                new Form.BuildBlock({
                    blockType: Form.BlockTypeOption.CONTENT_FIELD,
                    label: ':contentField',
                    cssClass: 'content-field',
                    cssClassIcon: 'ico-com-editor',
                    panelId: 'Content',
                    componentSettings: { visibleCommands: ['*core', '*list', 'block', 'link', 'horizontalLine', 'image', 'media', 'table', 'special', 'emoji'] }
                }),
                new Form.BuildBlock({
                    blockType: Form.BlockTypeOption.SPACER_FIELD,
                    label: ':spacerField',
                    cssClass: 'spacer-field',
                    cssClassIcon: 'ico-divider',
                    panelId: 'Content'
                })];

            /** Gets or sets the command buttons displayed in the form’s specific placeholder locations.
            * @type {Array<componyx.UI.Form.Command>}
            */
            this.commands = [
                new Form.Command({
                    command: this.undo.bind(this),
                    events: { 'onMouseDown': this.setActiveElement.bind(this) },
                    shortcutKey: 'z',
                    isVisible: this.isBuildMode.bind(this),
                    isEnabled: this.canPerformHistoryAction.bind(this, 'undo'),
                    cssClass: 'undo',
                    cssClassIcon: 'ico-undo',
                    location: Form.CommandLocationOption.HEADER,
                    buttonId: null
                }),
                new Form.Command({
                    command: this.redo.bind(this),
                    events: { 'onMouseDown': this.setActiveElement.bind(this) },
                    isVisible: this.isBuildMode.bind(this),
                    isEnabled: this.canPerformHistoryAction.bind(this, 'redo'),
                    shortcutKey: 'y',
                    cssClass: 'redo',
                    cssClassIcon: 'ico-redo',
                    location: Form.CommandLocationOption.HEADER,
                    buttonId: null
                }),
                new Form.Command({
                    command: this.setDisplayMode.bind(this, Form.DisplayModeOption.PREVIEW),
                    isVisible: this.isBuildMode.bind(this),
                    location: Form.CommandLocationOption.HEADER,
                    shortcutKey: 'p',
                    cssClass: 'preview-mode',
                    cssClassIcon: 'ico-eye',
                    buttonId: null
                }),
                new Form.Command({
                    command: this.setDisplayMode.bind(this, Form.DisplayModeOption.BUILD),
                    isVisible: this.isPreviewMode.bind(this),
                    location: Form.CommandLocationOption.HEADER,
                    shortcutKey: 'e',
                    cssClass: 'build-mode',
                    cssClassIcon: 'ico-com-form',
                    buttonId: null
                }),
                new Form.Command({
                    command: this.togglePane.bind(this, 'build'),
                    isVisible: this.isBuildMode.bind(this),
                    location: Form.CommandLocationOption.BUILD_PANE_BOTTOM,
                    shortcutKey: '',
                    cssClass: 'toggle-build-pane',
                    cssClassIcon: 'ico-arrow-l-bracket',
                    buttonId: null
                }),
                new Form.Command({
                    command: this.togglePane.bind(this, 'config'),
                    isVisible: this.isBuildMode.bind(this),
                    location: Form.CommandLocationOption.CONFIG_PANE_BOTTOM,
                    shortcutKey: '',
                    cssClass: 'toggle-config-pane',
                    cssClassIcon: 'ico-arrow-r-bracket',
                    buttonId: null
                }),
            ];

            /** Gets or sets the text labels used by the form.
            * @type {componyx.UI.Form.LabelSettings}
            */
            this.labels = {
                newItemPrefix: "New ",
                addItemPrefix: "Add ",
                removeItemPrefix: "Remove ",
                applyToItemPrefix: "Apply to ",
                labelPlaceholder: "Enter a label",
                headerTitle: "Form Header",
                sectionSwitch: "Enable Sections",
                lineBreak: "Line break",
                visible: "Visible",
                disabled: "Disabled",
                readOnly: "Readonly",
                selected: "Selected",
                tooltip: "Tooltip",
                tooltipHint: "Text shown via info icon",
                value: "Default Value",
                minValue: "Minimum Value",
                maxValue: "Maximum Value",
                comboBoxDefaultHint: "- Select -",
                comboBoxSelectAll: "Select All",

                section: "Section",
                fieldSet: "Field Set",
                fieldSets: "Field Sets",
                fieldPaneEmptyHint: "Drag a field here...",
                fieldSetId: "ID",
                fieldSetLayout: "Layout",
                fieldSetLayoutNone: "None",
                fieldSetLayoutDefault: "Default",
                fieldSetLayoutBannered: "Bannered",
                fieldSetRepeatable: "Repeatable",
                fieldSetMaxRepeats: "Max Repeats",
                fieldSetRepeatLabel: "Repeat label",
                fieldSetRepeatButton: "Add Another",

                field: "Field",
                fields: "Fields",
                fieldName: "Field Name",
                fieldPlaceholder: "Placeholder",
                fieldPlaceholderHint: "Text shown when empty",
                fieldWidth: "Width",
                fieldWidthHint: "- Select an option or type a value - ",
                fieldWidthTooltip: "Select an option or type a value.<br> Custom widths below 360px may not be applied due to layout constraints.<br> Use valid CSS units (e.g., 200px, 100%, 20ch).",
                fieldRole: "Role",
                fieldRoleTooltip: "Set a role that defines how the data of this field should be processed by the backend upon form submission.",
                fieldWidthAuto: "Auto (360px)",
                fieldWidth1PerRow: "100% (1 field per row)",
                fieldWidth2PerRow: "50% (2 fields per row)",
                fieldWidth3PerRow: "33% (3 fields per row)",
                fieldWidth4PerRow: "25% (4 fields per row)",

                fieldLabelDisplay: "Label Display",
                fieldLabelDisplayAbove: "Above",
                fieldLabelDisplayBefore: "Before",
                fieldLabelDisplayFloating: "Floating",
                fieldLabelDisplayInside: "Inside",
                fieldMoreSettings: "More Settings...",

                fieldInlineOptions: "Inline Options",
                fieldOptionWidth: "Option Width",
                fieldOptionWidthAuto: "Auto",
                fieldOptionWidth2PerRow: "50% (2 items per row)",
                fieldOptionWidth3PerRow: "33% (3 items per row)",
                fieldOptionWidth4PerRow: "25% (4 items per row)",

                fieldOption: "Option",
                fieldOptions: "Options",
                fieldOptionValue: "Option Value",
                fieldOptionsType: "Options Type",
                fieldOptionsTypeStatic: "Static",
                fieldOptionsTypeDataSource: "Data Source",
                fieldOptionLabelHeader: "Label",
                fieldOptionValueHeader: "Value",
                fieldOptionSelectedHeader: "Selected",
                fieldOptionDisabledHeader: "Disabled",
                dataSource: "Data Source",
                dataSourcePreview: "Data Source Preview",

                optionLabelHeader: "Label",
                optionValueHeader: "Value",
                optionSelectedHeader: "Selected",
                optionDisabledHeader: "Disabled",

                validationRequired: "Required",
                validationDataType: "Data Type",
                validationDataTypeInteger: "Integer",
                validationDataTypeFloat: "Float",
                validationDataTypeDateTime: "DateTime",
                validationDataTypeEmail: "Email",
                validationDataTypeURL: "URL",
                validationDataTypeSource: "Source",
                validationPattern: "Pattern",
                validationPatternHint: "Type a regular expression ^[0-9]+$",
                validationLength: "Length",
                validationMinLengthHint: "Min Length",
                validationMaxLengthHint: "Max Length",
                validationRange: "Range",
                validationMinRangeHint: "Min Range",
                validationMaxRangeHint: "Max Range",
                validationCompare: "Compare To",

                validatorMessage_required: "{field} is required.",
                validatorMessage_range: "{field} must be between {min} and {max}.",
                validatorMessage_length: "{field} must be between {min} and {max} characters long.",
                validatorMessage_integer: "{field} must be a valid number.",
                validatorMessage_float: "{field} must be a valid decimal number.",
                validatorMessage_email: "{field} must be a valid email address.",
                validatorMessage_datetime: "{field} must be a valid date.",
                validatorMessage_url: "{field} must be a valid URL.",
                validatorMessage_source: "{field} must be a valid source.",
                validatorMessage_compare: "{field} must be {operator} {compareField}.",
                validatorMessage_pattern: "{field} has an invalid format.",

                ruleCase: "Rule Case",
                ruleGroup: "Rule Group",
                ruleCaseHeader: "Rule Case",
                ruleCaseTrigger: "Trigger",
                ruleCaseRunVisibility: "Run When",
                ruleGroupConnector: "Group Connector",
                ruleGroupsEmptyHint: "Actions run unconditionally when no rules are set.",
                actionsHeader: "Actions",
                ruleFieldHint: "- Field -",
                ruleComparisonOperatorHint: "- Condition -",

                operator_and: "AND",
                operator_or: "OR",
                operator_equal: "Equal",
                operator_not_equal: "Not Equal",
                operator_less_than: "Less Than",
                operator_less_than_or_equal: "Less / Equal",
                operator_greater_than_or_equal: "Greater / Equal",
                operator_greater_than: "Greater Than",
                operator_contains: "Contains",
                operator_not_contains: "Not Contains",
                operator_starts_with: "Starts With",
                operator_ends_with: "Ends With",
                operator_empty: "Empty",
                operator_not_empty: "Not Empty",
                operator_visible: "Visible",
                operator_hidden: "Hidden",
                operator_enabled: "Enabled",
                operator_disabled: "Disabled",
                operator_required: "Required",
                operator_optional: "Optional",

                trigger_always: "Always",
                trigger_change: "On Field Change",
                trigger_init: "On Form Load",
                trigger_show_section: "On Show Section",
                trigger_before_submit: "Before Form Submit",
                trigger_submit_succeeded: "After Succesful Submit",
                trigger_submit_failed: "After Failed Submit",

                run_visibility_visible: "Field is Visible",
                run_visibility_hidden: "Field is Visible or Hidden",
                run_visibility_section_hidden: "Section is Hidden",

                action_value: "Set Value",
                action_expression: "Set Value Expression",
                action_feedback: "Feedback Message",
                action_alert: "Alert Dialog",
                action_confirm: "Confirmation Dialog",
                action_required: "Set Required",
                action_optional: "Set Optional",
                action_hide: "Hide",
                action_show: "Show",
                action_disable: "Disable",
                action_enable: "Enable",
                action_read: "Read only",
                action_editable: "Editable",
                action_disable_next: "Disable Next/Submit",
                action_enable_next: "Enable Next / Submit",
                action_cancel: "Cancel Submit",
                action_show_section: "Show Section",
                action_end: "End Form",

                actionValueHint: "Enter a value",
                actionExpressionHint: "Enter a value or expression",

                componentPanelHeader: "{0} Configuration",

                textbox: "Textbox",
                textarea: "Textarea",
                checkbox: "Checkbox",
                radio: "Radio",
                switch: "Switch",
                maskedTextBox: "Masked Textbox",
                numericBox: "Number",
                comboBox: "Dropdown",
                datePicker: "Date",
                timePicker: "Time",
                slider: "Slider",
                fileUpload: "File Upload",
                editor: "Editor",
                contentField: "Content",
                spacerField: "Spacer",

                multiSelect: "Enable Multi-Selection",
                multiSelectTagging: "Selections as Tags",
                allowInput: "Allow Typing",

                today: "Default to Today",
                allowedDates: "Allow Listed Dates",
                disallowDates: "Disallow Listed Dates",

                precision: "Decimal Precision",

                mask: "Mask",
                maskTooltip: "Use `A` for letters, `0` for digits, and `_` as default input slot (based on allowed characters).<br> For example: 'AA-0000' allows 2 letters, and 4 digits.",
                allowedCharacters: "Allowed Characters",
                allowedCharactersAlphanumeric: "Alphanumeric",
                allowedCharactersDigits: "Digits",
                allowedCharactersLetters: "Letters",

                range: "Enable Range Selection",
                trackSize: "Track Size",
                trackSizeHint: "200px, 100%, 20ch — use CSS units",
                startValue: "Start Value",
                tickMarks: "Tick Marks",

                incrementalValue: "Step Interval (minutes)",
                allowedTimes: "Allowed Times",
                disallowTimes: "Disallow Listed Times",

                accept: "Accept",
                acceptHint: ".png, .jpg, .jpeg ",
                maxFileSize: "Max. File Size (KB)",
                maxFiles: "Max. Files",

                all: "All Options",
                list: "Lists",
                block: "Block styles",
                link: "Links",
                special: "Special chars",

                margin: "Margin",
                marginHint: "5px, 100% - use CSS units",
                padding: "Padding",
                paddingHint: "5px, 100% - use CSS units",
                backgroundColor: "Background Color",
                borderWidth: "Border Width",
                borderColor: "Border Color",
                borderRadius: "Border Radius",
                borderRadiusHint: "5px, 100% - use CSS units",

                showDivider: "Show Divider",
                height: "Height",
                heightHint: "10px, 2em - use CSS units",

                saveInProgress: "Saving...",
                saveSuccess: "Saved...",
                saveFailed: "Save Failed",

                alertDialogHeader: "Alert",
                confirmDialogHeader: "Confirm",

                previous: "Previous",
                next: "Next",
                submit: "Submit",

                navigatorSearchHint: "Find Field",

                buildPanel_fields: "Fields",
                buildPanel_content: "Content",
                buildPanel_navigator: "Navigator",
                configPanel_fieldset: "FieldSet Configuration",
                configPanel_field: "Field Configuration",
                configPanel_content: "Content Field Configuration",
                configPanel_spacer: "Spacer Field Configuration",
                configPanel_fieldOptions: "Field Options",
                configPanel_validation: "Validation Rules",
                configPanel_rules: "Conditional Rules"
            };

            /**
             * Gets or sets the data sources available for form fields (server endpoints filtered by input type). Configurable in build mode; used at runtime to populate field options (ComboBox, Checkbox, Radio, Switch) or to upload files.
             * @type {componyx.UI.Form.DataSource[]}
             */
            this.dataSources = [
                new Form.DataSource({
                    id: 'CategoryListExample',
                    inputType: [Form.InputTypeOption.CHECKBOX, Form.InputTypeOption.RADIO, Form.InputTypeOption.COMBOBOX],
                    label: 'Category List Example',
                    url: '/api/get-categories',
                    method: 'GET',
                    headers: {},
                    absoluteURL: false,
                    params: {}
                }),
                new Form.DataSource({
                    id: 'ImageUploadExample',
                    inputType: Form.InputTypeOption.FILEUPLOAD,
                    label: 'Image Upload Example',
                    url: '/api/upload-image',
                    method: 'POST',
                    headers: {},
                    absoluteURL: false,
                    params: {}
                })
            ];

            /**
             * Gets or sets the server endpoints used by rule case actions at runtime. Endpoints should return a JSON object with `success: true` to continue the current rule case actions or `success: false` to stop the action flow.
             * @type {componyx.UI.Form.ServerEndpoint[]}
             */
            this.actionEndpoints = [];

            /**
             * Gets or sets the endpoint used to save the form definition.
             * @type {componyx.UI.Form.ServerEndpoint}
             */
            this.saveEndpoint = null;

            /**
             * Gets or sets the endpoint used to submit the form values at runtime.
             * @type {componyx.UI.Form.ServerEndpoint}
             */
            this.submitEndpoint = null;

            /**
             * Gets or sets the panel id in the build panels for the Navigator. If set to null or if no panel with the specified id exists, the Navigator will not be rendered.
             * @type {String}
             */
            this.navigatorPanelId = 'Navigator';

            /**
             * Gets or sets the CRSF Token to send with each server endpoint request.
             * @type {String}
             */
            this.crsfToken = null;

            /**
             * Gets or sets a value indicating if disabled form fields are included in the form submit.
             * @type {String}
             */
            this.includeDisabledFields = false;

            /**
             * Gets or sets the maximum items allowed in the history stack. Null means no limit.
             * @type {number|null}
             */
            this.maxHistoryLength = null;

            /**
             * Gets or sets the delay in milliseconds before applying config panel setting changes to the form pane when in form build mode.
             * @type {number}
             */
            this.settingUpdateDelay = 500;

            /**
             * Gets or sets the delay in milliseconds before saving the form via the configured saveEndpoint (or custom onSave implementation) when in form build mode.
             * @type {number}
             */
            this.autoSaveDelay = 500;

            /**
             * Gets or sets the delay in milliseconds before applying the navigator search after the user stops typing.
             * @type {number}
             */
            this.navigatorSearchDelay = 500;

            /**
            * Gets or sets a custom sanitizer function to sanitize HTML. When set, overrides the built-in sanitizer.
            * The function receives an HTML string and should return a sanitized HTML string.
            * For high-security requirements, consider a dedicated library such as DOMPurify.
            * Client-side sanitization is not a substitute for server-side validation.
            * @type {Function|null}
            */
            this.sanitizer = null;

            /**
             * Gets or sets the drag settings for all draggable items.
             * @type {componyx.library.DraggableSettings}
             */
            this.dragSettings = {};

            /**
             * Gets or sets the id of the component from which the settings are cloned for the remove Field button (inside the Field action-menu).
             * @type {string}
             */
            this.removeFieldButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the clone Field button (inside the Field action-menu).
             * @type {string}
             */
            this.cloneFieldButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the add Field button (inside the Field action-menu).
             * @type {string}
             */
            this.addFieldButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the remove Field Option button (inside the Field Options configuration panel).
             * @type {string}
             */
            this.removeFieldOptionButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the add Field option button (inside the Field Options configuration panel).
             * @type {string}
             */
            this.addFieldOptionButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the remove allowed time/date button (inside the Component configuration panel).
             * @type {string}
             */
            this.removeAllowedItemButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the add allowed time/date button (inside the Component configuration panel).
             * @type {string}
             */
            this.addAllowedItemOptionButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the build panel-bar.
             * @type {string}
             */
            this.buildPanelBarId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the configuration panel-bar.
             * @type {string}
             */
            this.configPanelBarId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the build-block insert button (inside the build panel).
             * @type {string}
             */
            this.insertBuildBlockButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the layout combo-box (inside the FieldSet configuration panel).
             * @type {string}
             */
            this.layoutComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the label display combo-box (inside the Field and FieldSet configuration panels).
             * @type {string}
             */
            this.labelDisplayComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the field width combo-box (inside the Field configuration panel).
             * @type {string}
             */
            this.fieldWidthComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the option width combo-box (inside the Field Options configuration panel).
             * @type {string}
             */
            this.fieldOptionWidthComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for more settings button (inside the Field configuration panel).
             * @type {string}
             */
            this.moreSettingsButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the data type combo-box (inside the Validation configuration panel).
             * @type {string}
             */
            this.dataTypeComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the compare operator combo-box (inside the Validation configuration panel).
             * @type {string}
             */
            this.compareOperatorComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the compare field combo-box (inside the Validation configuration panel).
             * @type {string}
             */
            this.compareFieldComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the data source combo-box (inside the Field Options configuration panel).
             * @type {string}
             */
            this.dataSourceComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the data source preview combo-box (inside the Field Options configuration panel).
             * @type {string}
             */
            this.dataSourcePreviewComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the max repeats numeric-box (inside the FieldSet configuration panel).
             * @type {string}
             */
            this.maxRepeatsNumericBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the min length numeric-box (inside the Validation configuration panel).
             * @type {string}
             */
            this.minLengthNumericBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the max length numeric-box (inside the Validation configuration panel).
             * @type {string}
             */
            this.maxLengthNumericBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the min range numeric-box (inside the Validation configuration panel).
             * @type {string}
             */
            this.minRangeNumericBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the max range numeric-box (inside the Validation configuration panel).
             * @type {string}
             */
            this.maxRangeNumericBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the remove option button (inside the Field Options configuration panel).
             * @type {string}
             */
            this.removeOptionButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the add rule case button (inside the Rules configuration panel).
             * @type {string}
             */
            this.addRuleCaseButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the remove rule case button (inside the Rules configuration panel).
             * @type {string}
             */
            this.removeRuleCaseButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the add rule group button (inside the Rules configuration panel).
             * @type {string}
             */
            this.addRuleGroupButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the add action button (inside the Rules configuration panel).
             * @type {string}
             */
            this.addActionButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the remove action button (inside the Rules configuration panel).
             * @type {string}
             */
            this.removeActionButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the trigger combo-box (inside the Rules configuration panel).
             * @type {string}
             */
            this.triggerComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the run visibility combo-box (inside the Rules configuration panel).
             * @type {string}
             */
            this.runVisibilityComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the action combo-box (inside the Rules configuration panel).
             * @type {string}
             */
            this.actionComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the action target combo-box (inside the Rules configuration panel).
             * @type {string}
             */
            this.actionTargetComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the source field operator combo-box (inside the Rules configuration panel).
             * @type {string}
             */
            this.sourceFieldComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the comparison operator combo-box (inside the Rules configuration panel).
             * @type {string}
             */
            this.comparisonComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the logical operator combo-box (inside the Rules configuration panel).
             * @type {string}
             */
            this.logicalOperatorComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the options value combo-box (inside the Rules configuration panel).
             * @type {string}
             */
            this.optionsValueComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the sections value combo-box displayed for the show_section action (inside the Rules configuration panel).
             * @type {string}
             */
            this.sectionsValueComboBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the value date-picker (inside the Component configuration panel).
             * @type {string}
             */
            this.valueDatePickerId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the min value date-picker (inside the Component configuration panel).
             * @type {string}
             */
            this.minValueDatePickerId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the max value date-picker (inside the Component configuration panel).
             * @type {string}
             */
            this.maxValueDatePickerId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the value time-picker (inside the Component configuration panel).
             * @type {string}
             */
            this.valueTimePickerId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the min value time-picker (inside the Component configuration panel).
             * @type {string}
             */
            this.minValueTimePickerId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the max value time-picker (inside the Component configuration panel).
             * @type {string}
             */
            this.maxValueTimePickerId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the default value numeric-box (inside the Component configuration panel).
             * @type {string}
             */
            this.valueNumericBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the min value numeric-box (inside the Component configuration panel).
             * @type {string}
             */
            this.minValueNumericBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the max value numeric-box (inside the Component configuration panel).
             * @type {string}
             */
            this.maxValueNumericBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the start value numeric-box (inside the Component configuration panel).
             * @type {string}
             */
            this.startValueNumericBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the precision numeric-box (inside the Component configuration panel).
             * @type {string}
             */
            this.precisionNumericBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the tick marks numeric-box (inside the Component configuration panel).
             * @type {string}
             */
            this.tickMarksNumericBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the incremental value numeric-box (inside the Component configuration panel).
             * @type {string}
             */
            this.incrementalValueNumericBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the date-picker used to add allowed dates (inside the Component configuration panel).
             * @type {string}
             */
            this.addAllowedDatePickerId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the time-picker used to add allowed times (inside the Component configuration panel).
             * @type {string}
             */
            this.addAllowedTimePickerId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the max file size numeric-box (inside the Component configuration panel).
             * @type {string}
             */
            this.maxFileSizeNumericBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the max files numeric-box (inside the Component configuration panel).
             * @type {string}
             */
            this.maxFilesNumericBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the border width numeric-box (inside the Content configuration panel).
             * @type {string}
             */
            this.borderWidthNumericBoxId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the border color-button (inside the Content configuration panel).
             * @type {string}
             */
            this.borderColorButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the background color-button (inside the Content configuration panel).
             * @type {string}
             */
            this.backgroundColorButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the content field editor (Content Fields in Build Mode).
             * @type {string}
             */
            this.contentFieldEditorId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the color picker used by the form component.
             * @type {string}
             */
            this.colorPickerId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the section switch form-field rendered in the form header.
             * @type {string}
             */
            this.sectionSwitchFormFieldId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the alert dialog action.
             * @type {string}
             */
            this.alertDialogId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the confirmation dialog action.
             * @type {string}
             */
            this.confirmDialogId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the previous section button.
             * @type {string}
             */
            this.previousSectionButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the next section button.
             * @type {string}
             */
            this.nextSectionButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the submit button.
             * @type {string}
             */
            this.submitButtonId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the tooltip manager used by the form component.
             * @type {string}
             */
            this.tooltipManagerId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the validator used by the form component.
             * @type {string}
             */
            this.validatorId = null;

            /**
             * Gets or sets the id of the component from which the settings are cloned for the navigator menu used by the form component.
             * @type {string}
             */
            this.navigatorMenuId = null;

            /** @private
             *  @type {Boolean}
             */
            this.ended = false;

            /** @private
             *  @type {Set}
             */
            this.autoNameCandidates = new Set();

            /** @private
             *  @type {Boolean}
             */
            this.submitCanceled = false;

            /** @private
             *  @type {componyx.UI.ColorPicker}
             */
            this.colorPicker = null;

            /** @private
             *  @type {componyx.UI.TooltipManager}
             */
            this.tooltipManager = null;

            /** @private
             *  @type {componyx.UI.Validator}
             */
            this.validator = null;

            /** @private
             *  @type {componyx.UI.Form.FieldSet[]}
             */
            this.repeatedFieldSets = [];

            /** @private
             *  @type {componyx.bindary_modules.ExpressionEngine}
             */
            this.expressionEngine = null;

            /** @private
             *  @type {componyx.UI.form_modules.ActionManager}
             */
            this.actionManager = null;

            /** @private
             *  @type {componyx.UI.form_modules.BuildPanelManager}
             */
            this.buildPanelManager = null;

            /** @private
             *  @type {componyx.UI.form_modules.ComponentFactory}
             */
            this.componentFactory = null;

            /** @private
             *  @type {componyx.UI.form_modules.ConfigPanelManager}
             */
            this.configPanelManager = null;

            /** @private
             *  @type {componyx.UI.form_modules.DataBinder}
             */
            this.dataBinder = null;

            /** @private
             *  @type {componyx.UI.form_modules.Draggable}
             */
            this.draggable = null;

            /** @private
             *  @type {componyx.UI.form_modules.DataObserver}
             */
            this.dataObserver = null;

            /** @private
             *  @type {componyx.UI.form_modules.RuleEngine}
             */
            this.ruleEngine = null;

            /** @private
             *  @type {componyx.UI.form_modules.Renderer}
             */
            this.renderer = null;

            /** @private
             *  @type {componyx.UI.form_modules.ValidationManager}
             */
            this.validationManager = null;

            /**
            * @typedef {Object} componyx.UI.Form.FieldSetEventArgs
            * @property {componyx.UI.Form.Field} fieldSet - The fieldset instance. Use `fieldSet.element` to access the fieldset's root element.
            */

            /**
             * @typedef {Object} componyx.UI.Form.FieldEventArgs
             * @property {componyx.UI.Form.Field} field - The field instance. Use `field.element` to access the field's root element.
             * @property {componyx.UI.Form.FieldOption} [option] - The optional field option, only available for `onRenderEditFieldOption`.
             */

            /**
             * @typedef {Object} componyx.UI.Form.DropFieldEventArgs
             * @property {componyx.UI.Form.Item} item - The dropped field or fieldSet.
             */

            /**
             * @typedef {Object} componyx.UI.Form.SelectFieldSetEventArgs
             * @property {componyx.UI.Form.FieldSet} fieldSet - The selected fieldSet.
             */

            /**
             * @typedef {Object} componyx.UI.Form.SelectFieldEventArgs
             * @property {componyx.UI.Form.Field} field - The selected field.
             */

            /**
             * @typedef {Object} componyx.UI.Form.CreateSanitizerEventArgs
             * @property {componyx.base_modules.Sanitizer} sanitizer - The created sanitizer class instance.
             */

            /**
             * @typedef {Object} componyx.UI.Form.BaseEventArgs
             * // empty additional fields besides form instance
             */

            /**
             * @typedef {Object} componyx.UI.Form.SubmitEventArgs
             * @property {Object} values - The submitted form values.
             * @property {Object} result - The submit result. 
             * Custom onSubmit handler(s) must set `result.error` and `result.success` ONLY if the onSubmitEndpoint is not configured.
             * If the default endpoint is used, these flags are set automatically and handlers can safely ignore them.
             * @property {boolean} [result.error] - A value indicating if an exception was thrown.
             * @property {boolean} [result.success] - A value indicating if the completed action returned true (success) or false.
             */

            /**
            * @typedef {Object} componyx.UI.Form.SaveEventArgs
            * @property {Object} result - The save result.
            * Custom onSave handler(s) must set `result.error` and `result.success` ONLY if the onSaveEndpoint is not configured.
            * If the default endpoint is used, these flags are set automatically and handlers can safely ignore them.
            * @property {boolean} [result.error] - A value indicating if an exception was thrown.
            * @property {boolean} [result.success] - A value indicating if the completed action returned true (success) or false.
            */

            /**
             * Callback for fieldset events.
             * @typedef {function} componyx.UI.Form.FieldSetEventHandler
             * @param {componyx.UI.Form} form - The form instance firing the event.
             * @param {componyx.UI.Form.FieldSetEventArgs} eventArgs - The event details.
             */

            /**
             * Callback for field events.
             * @typedef {function} componyx.UI.Form.FieldEventHandler
             * @param {componyx.UI.Form} form - The form instance firing the event.
             * @param {componyx.UI.Form.FieldEventArgs} eventArgs - The event details.
             */

            /**
             * Callback for drop field events.
             * @typedef {function} componyx.UI.Form.DropFieldEventHandler
             * @param {componyx.UI.Form} form - The form instance firing the event.
             * @param {componyx.UI.Form.DropFieldEventArgs} eventArgs - The event details.
             */

            /**
             * Callback for select fieldset events.
             * @typedef {function} componyx.UI.Form.SelectFieldSetEventHandler
             * @param {componyx.UI.Form} form - The form instance firing the event.
             * @param {componyx.UI.Form.SelectFieldSetEventArgs} eventArgs - The event details.
             */

            /**
             * Callback for select field events.
             * @typedef {function} componyx.UI.Form.SelectFieldEventHandler
             * @param {componyx.UI.Form} form - The form instance firing the event.
             * @param {componyx.UI.Form.SelectFieldEventArgs} eventArgs - The event details.
             */

            /**
             * Callback for sanitizer creation events.
             * @typedef {function} componyx.UI.Form.CreateSanitizerEventHandler
             * @param {componyx.UI.Form} form - The form instance firing the event.
             * @param {componyx.UI.Form.CreateSanitizerEventArgs} eventArgs - The event details.
             */

            /**
             * Callback for base form events.
             * @typedef {function} componyx.UI.Form.BaseEventHandler
             * @param {componyx.UI.Form} form - The form instance firing the event.
             * @param {componyx.UI.Form.BaseEventArgs} [eventArgs] - The event details (optional).
             */

            /**
             * Callback for form submit events.
             * @typedef {function} componyx.UI.Form.SubmitEventHandler
             * @param {componyx.UI.Form} form - The form instance firing the event.
             * @param {componyx.UI.Form.SubmitEventArgs} eventArgs - The event details.
             */

            /**
             * Callback for form save events.
             * @typedef {function} componyx.UI.Form.SaveEventHandler
             * @param {componyx.UI.Form} form - The form instance firing the event.
             * @param {componyx.UI.Form.SaveEventArgs} eventArgs - The event details.
             */

            /**
             * @class
             * @augments componyx.UI.base.Events
             * @memberof componyx.UI.Form
             * @property {componyx.UI.base.Event} onRenderFieldSet  - Fires when a fieldset is rendered. @see {@link componyx.UI.Form.FieldSetEventHandler}
             * @property {componyx.UI.base.Event} onRenderField  - Fires when a field is rendered. @see {@link componyx.UI.Form.FieldEventHandler}
             * @property {componyx.UI.base.Event} onRenderViewTemplate  - Fires when the view template is rendered. @see {@link componyx.UI.Form.FieldEventHandler}
             * @property {componyx.UI.base.Event} onRenderEditTemplate  - Fires when the edit template is rendered. @see {@link componyx.UI.Form.FieldEventHandler}
             * @property {componyx.UI.base.Event} onRenderEditFieldOption - Fires when a field option is rendered.  @see {@link componyx.UI.Form.FieldEventHandler}
             * @property {componyx.UI.base.Event} onUpdateFieldSet  - Fires when a fieldset is updated, minor changes that do not require full re-render. @see {@link componyx.UI.Form.FieldSetEventHandler}
             * @property {componyx.UI.base.Event} onUpdateField  - Fires when a field is updated, minor changes that do not require full re-render. @see {@link componyx.UI.Form.FieldEventHandler}
             * @property {componyx.UI.base.Event} onDropField - Fires when a field or fieldSet is dropped from build pane onto the form. @see {@link componyx.UI.Form.DropFieldEventHandler}
             * @property {componyx.UI.base.Event} onSelectFieldSet - Fires when a fieldSet is selected. @see {@link componyx.UI.Form.SelectFieldSetEventHandler}
             * @property {componyx.UI.base.Event} onSelectField - Fires when a field is selected. @see {@link componyx.UI.Form.SelectFieldEventHandler}
             * @property {componyx.UI.base.Event} onCreateSanitizer - Fires when the default HTML sanitizer is created, allowing optional configuration. @see {@link componyx.UI.Form.CreateSanitizerEventHandler}
             * @property {componyx.UI.base.Event} onSave - Fires when the form definition is saved in build mode. @see {@link componyx.UI.Form.SaveEventHandler}
             * @property {componyx.UI.base.Event} onSubmit - Fires when the form values are submitted. @see {@link componyx.UI.Form.SubmitEventHandler}
             * @property {componyx.UI.base.Event} onSubmitCanceled - Fires when the form submit is canceled because of the rule case cancel submit action. @see {@link componyx.UI.Form.SubmitEventHandler}
             * @property {componyx.UI.base.Event} onEndForm - Fires when the form end action is executed. @see {@link componyx.UI.Form.BaseEventHandler}
             * @see {@link componyx.UI.base.Events}
             */
            function FormEvents(events)
            {
                Object.assign(this, events);
                this.onRenderFieldSet = $base.static.createEvent('onRenderFieldSet');
                this.onRenderField = $base.static.createEvent('onRenderField');
                this.onRenderViewTemplate = $base.static.createEvent('onRenderViewTemplate');
                this.onRenderEditTemplate = $base.static.createEvent('onRenderEditTemplate');
                this.onRenderEditFieldOption = $base.static.createEvent('onRenderEditFieldOption');
                this.onUpdateFieldSet = $base.static.createEvent('onRenderFieldSet');
                this.onUpdateField = $base.static.createEvent('onRenderField');
                this.onDropField = $base.static.createEvent('onDropField');
                this.onSelectFieldSet = $base.static.createEvent('onSelectFieldSet');
                this.onSelectField = $base.static.createEvent('onSelectField');
                this.onCreateSanitizer = $base.static.createEvent('onCreateSanitizer');
                this.onSave = $base.static.createEvent('onSave');
                this.onSubmit = $base.static.createEvent('onSubmit');
                this.onSubmitCanceled = $base.static.createEvent('onSubmitCanceled');
                this.onEndForm = $base.static.createEvent('onEndForm');
            };

            /**
              * @type {componyx.UI.Form.FormEvents}
            */
            this.events = new FormEvents(this.events);
        }

        /** 
         * Gets the previous button.
         * @type {componyx.UI.Button}
         */
        get prevButton()
        {
            return this.renderer.prevButton;
        }

        /**
         * Gets the next button.
         * @type {componyx.UI.Button}
         */
        get nextButton()
        {
            return this.renderer.nextButton;
        }

        /**
         * Gets the submit button.
         * @type {componyx.UI.Button}
         */
        get submitButton()
        {
            return this.renderer.submitButton;
        }

        /**
         * Gets the field attribute name
         * @type {String}
         */
        get fieldAttribute()
        {
            return this.#fieldAttribute;
        }

        /**
         * Gets the selected field set identifier.
         * @type {String}
         */
        get selectedFieldSetId()
        {
            return this.#selectedFieldSetId;
        }

        /**
         * Gets the selected field identifier.
         * @type {String}
         */
        get selectedFieldId()
        {
            return this.#selectedFieldId;
        }

        /**
         * Gets the registered runtime actions.
         * @type {Object<string, componyx.UI.Form.ActionConfig>}
         */
        get runtimeActions()
        {
            return this.#runtimeActions;
        }

        /**
         * Gets the value from the field.
         * @typedef {function} componyx.UI.Form.CustomFieldGetter
         * @param {componyx.UI.Form.Field} field - The field instance.
         * @returns {any} The field value.
         */

        /**
         * Sets the value on the field.
         * @typedef {function} componyx.UI.Form.CustomFieldSetter
         * @param {componyx.UI.Form.Field} field - The field instance.
         * @param {any} value - The value to set.
         */

        /**
         * Renders the field HTML and must call the callback when rendering is complete.
         * @typedef {function} componyx.UI.Form.CustomFieldRenderer
         * @param {componyx.UI.Form} form - The form instance.
         * @param {componyx.UI.Form.Field} field - The field instance.
         * @param {HTMLElement} element - The container element to render into.
         * @param {boolean} isView - Indicates if the field is rendered in view mode (not edit mode).
         * @param {function} callback - Callback to invoke when rendering is done.
         */

        /**
         * Updates "minor" properties without full re-render.
         * Called when a property in `minorProps` changes.
         * @typedef {function} componyx.UI.Form.CustomFieldUpdater
         * @param {componyx.UI.Form} form - The form instance.
         * @param {componyx.UI.Form.Field} field - The field instance.
         * @param {string} propName - The name of the property that changed.
         * @param {any} newValue - The new value of the property.
         */

        /**
         * Creates the configurable input value used in rules and set-value actions.
         * @typedef {function} componyx.UI.Form.CustomFieldRenderValueInput
         * @param {componyx.UI.Form} form - The form instance.
         * @param {componyx.UI.Form.Field} field - The field instance.
         * @param {componyx.UI.Form.Rule|componyx.UI.Form.Action} target - The target, either a rule or an action.
         * @param {HTMLElement} container - The container element in which to render the output.
         */

        /**
         * Gets the config fields to render in the field configuration panel.
         * @typedef {function} componyx.UI.Form.CustomFieldConfigGetter
         * @param {componyx.UI.Form} form - The form instance.
         * @param {componyx.UI.Form.Field} field - The field instance.
         * @param {string} panelName - The name of the panel in which the config fields are rendered, e.g. 'FieldPanel' or 'ComponentPanel'.
         * @returns {componyx.UI.Form.CustomFieldConfigFieldDefinition[]} Array of config field definitions.
         */

        /**
         * @typedef {Object} componyx.UI.Form.RadioCheckboxOption
         * @property {string} value
         * @property {string} [label]
         * @property {boolean} [checked]
         * @property {Object} [events]
         */

        /**
         * Configuration for a field in a configuration panel.
         * @typedef {Object} componyx.UI.Form.CustomFieldConfigFieldDefinition
         * @property {string} id - Unique identifier/key for the config field (used as HTML id suffix).
         * @property {string} [name] - Name attribute for input elements; defaults to `${namePrefix}${id}`.
         * @property {string} [label] - Label text shown next to the field; auto-fetched from `labels` if missing.
         * @property {string} [type] - Input type: `"input"`, `"textarea"`, `"checkbox"`, or `"radio"`.
         * @property {string|number|boolean} [value] - Initial input value (except checkboxes where `checked` is used).
         * @property {boolean} [checked] - Whether a checkbox or radio option is checked.
         * @property {componyx.UI.Form.RadioCheckboxOption[]} [options] - Options for radio/checkbox groups.
         * @property {string} [placeholder] - Placeholder text for input fields.
         * @property {Object} [config] - Additional config such as layout, label display, disabled state, switch style, inline display, tooltip info, etc.
         * @property {Object<string, Function>} [events] - Event handlers keyed by event names, e.g. `input`, `change`, `blur`.
         * @property {HTMLElement} [fieldElement] - Custom DOM element to use as the field instead of standard input creation.
         * @property {boolean} [disableDataBinding] - If true, disables internal data binding on this field.
         * 
         * @example
         * {
         *   id: "required",
         *   label: "Is Required",
         *   type: "checkbox",
         *   value: false,
         *   config: { switch: true },
         *   events: { change: onRequiredChange }
         * }
         * 
         * @memberof componyx.UI.Form
         */

        /**
         * Defines the set of custom field behaviors and configuration.
         * @typedef {Object} componyx.UI.Form.CustomFieldConfig
         * @property {componyx.UI.Form.CustomFieldGetter} getter - Function to get the field value.
         * @property {componyx.UI.Form.CustomFieldSetter} [setter] - Function to set the field value.
         * @property {componyx.UI.Form.CustomFieldRenderer} [renderer] - Function to render the field UI.
         * @property {componyx.UI.Form.CustomFieldUpdater} [updater] - Function to update minor properties without full re-render.
         * @property {componyx.UI.Form.CustomFieldRenderValueInput} [renderValueInput] - Function to create the input used in rules/set-value actions.
         * @property {componyx.UI.Form.CustomFieldConfigGetter} [configGetter] - Function returning config fields per panel.
         * @property {Set<string>} [minorProps] - Set of property names considered minor (trigger partial updates).
         * @property {Set<string>} [omitProps] - Set of property names to omit from processing changes.
         */


        /**
         * Registers a custom field type.
         * @param {string} typeName - The name of the custom field type.
         * @param {componyx.UI.Form.CustomFieldConfig} config - Configuration for the custom field type.
         * @static
         */
        static registerCustomType(typeName, config)
        {
            if (!Form.#customFieldTypes)
                Form.#customFieldTypes = new Map();

            if (Form.#customFieldTypes.has(typeName))
                throw new Error(`Custom field type "${typeName}" is already registered.`);

            Form.#customFieldTypes.set(typeName, config);
        }

        /**
         * Retrieves the configuration for a registered custom field type.
         * @param {string} typeName - The name of the custom field type.
         * @returns {Object|undefined} The configuration object for the custom type, or undefined if not registered.
         * @static
         */
        static getCustomType(typeName)
        {
            if (!typeName)
                return undefined;

            return Form.#customFieldTypes?.get(typeName);
        }

        /**
         * Gets a unique identifer.
         * @returns {string} A unique identifier.
         */
        guid()
        {
            return String(this.#guidCounter++);
        }

        /**
         * A function that executes an action.
         * @typedef {Object} ActionConfig
         * @memberof componyx.UI.Form
         * @param {boolean} supportsFieldSet - A value indicating if the action can be applied to a FieldSet.
         * @param {boolean} mustAwait- A value indicating if the action must be awaited (blocks other actions until this action is completed).
         * @param {boolean} setValue - A value indicating if the action sets the value of the related target field.
         * @param {boolean} setExpression - A value indicating if the action sets the expression value of the related target field.
         * @param {string} label - The text label of the action.
         * @param {ActionExecutor} execute - The function to execute the action.
         * @param {string} [description] - The optional desciption of the action, displayed in a tooltip.
         */

        /**
         * A function that executes an action.
         * @typedef {function} ActionExecutor
         * @memberof componyx.UI.Form
         * @param {any} value - The value associated with the action.
         * @param {componyx.UI.Form.Field|componyx.UI.Form.FieldSet} target - The field or fieldset on which the action is executed.
         * @returns {Promise<componyx.UI.Form.ActionResult>|void} Returns a promise resolving to an ActionResult or void if no result.
         */

        /**
         * The result returned by an action execution.
         * @typedef {Object} ActionResult
         * @memberof componyx.UI.Form
         * @property {boolean} success - Indicates if the action succeeded. Returning `success: false` will stop further actions in the Rule Case queue.
         * @property {any} [data] - Optional additional data returned by the action.
         */

        /**
         * Registers a runtime action.
         * @param {string} id - The unique identifier of the action.
         * @param {componyx.UI.Form.ActionConfig} config - The object to configure the action.
         */
        registerAction(id, config)
        {
            this.#runtimeActions[id] = config;
        }

        /**
         * Executes a serialized action on a field.
         * @param {componyx.UI.Form.Action} action The action instance.
         * @param {componyx.UI.Form.Field|componyx.UI.Form.FieldSet} target The target field or fieldset on which the action is executed.
         * @returns {Promise<componyx.UI.Form.ActionResult>|void} Returns a promise resolving to an ActionResult or void if no result.
         */
        async executeAction(action, target)
        {
            const runtime = this.#runtimeActions[action.runtimeActionId];

            if (!runtime || !runtime.execute) return;

            const result = runtime.execute(action, target);

            if (runtime.mustAwait && result instanceof Promise)
            {
                return await result;
            }

            return result;
        }

        /**
         * Gets the Sanitizer object to sanitize HTML.
         * @returns {componyx.bindary_modules.Sanitizer} The Sanitizer object.
         * @private
         */
        getSanitizer()
        {
            if (!this.#sanitizer)
            {
                this.#sanitizer = new Sanitizer();
                this.events.onCreateSanitizer.fire(this, { sanitizer: this.#sanitizer });
            }

            return this.#sanitizer;
        }

        /**
         * Retrieves the Section of the current field (if sections are enabled).
         * @param {componyx.UI.Form.Field} field - The field instance.
         * @returns {componyx.UI.Form.Section} The parent section.
         */
        getParentSection(field)
        {
            let parent = field.parent;
            while (parent)
            {
                if (parent.type === 'Section') return parent;
                parent = parent.parent;
            }
            return null;
        }

        /**
         * Gets the values of enabled form fields (excludes disabled fields).
         * @returns {Object} The form values of all enabled fields.
         */
        getEnabledFieldValues()
        {
            const values = JSON.parse(JSON.stringify(this.values));

            for (const field of this.getFields())
            {
                if (field.disabled)
                    this.dataBinder.setModelValue(field, undefined);
            }

            return values;
        }

        /**
         * Check if the given type belongs to a group container (e.g., FieldSet, Section).
         * @param {string} type - The type to check.
         * @returns {boolean} True if the type is a group.
         */
        isGroup(type)
        {
            return this.#typeGroups['group'].includes(type);
        }

        /**
         * Check if the given type is an input field (user-enterable).
         * @param {string} type - The type to check.
         * @returns {boolean} True if the type is an input field.
         */
        isInputField(type)
        {
            return this.#typeGroups['input'].includes(type);
        }

        /**
         * Check if the given type is a content-only field.
         * @param {string} type - The type to check.
         * @returns {boolean} True if the type is a content field.
         */
        isContentField(type)
        {
            return this.#typeGroups['content'].includes(type);
        }

        /**
         * Check if the given type is a content or input field.
         * @param {string} type - The type to check.
         * @returns {boolean} True if the type is a content field.
         */
        isField(type)
        {
            return this.isInputField(type) || this.isContentField(type);
        }

        /** 
        * Sets the header template. The template supports the below listed interpolations.
        * - {title} This value will be replaced with the form title.
        * - {commands} This value will be replaced with the form commands.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setHeaderTemplate(content)
        {
            this.addTemplate('Header', content, false);
        }

        /** 
        * Sets the FieldSetPanel template. The template supports the below listed interpolations.
        * - {layout}
        * - {labelDisplay}
        * - {repeatable}
        * - {maxRepeats}
        * - {repeatLabel}
        * - {tooltip}
        * - {lineBreak}
        * - {visible}
        * - {disabled}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setFieldSetPanel(content)
        {
            this.addTemplate('FieldSetPanel', content, false);
        }

        /** 
        * Sets the FieldPanel template. The template supports the below listed interpolations.
        * - {name}
        * - {labelDisplay}
        * - {placeholder}
        * - {tooltip}
        * - {value}
        * - {width}
        * - {required}
        * - {lineBreak}
        * - {visible}
        * - {disabled}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setFieldPanel(content)
        {
            this.addTemplate('FieldPanel', content, false);
        }

        /** 
        * Sets the ContentFieldPanel template. The template supports the below listed interpolations.
        * - {width}
        * - {margin}
        * - {padding}
        * - {borderWidth}
        * - {borderRadius}
        * - {borderColor}
        * - {backgroundColor}
        * - {lineBreak}
        * - {visible}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setContentFieldPanel(content)
        {
            this.addTemplate('ContentFieldPanel', content, false);
        }

        /** 
        * Sets the SpacerFieldPanel template. The template supports the below listed interpolations.
        * - {showDivider}
        * - {height}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setSpacerFieldPanel(content)
        {
            this.addTemplate('SpacerFieldPanel', content, false);
        }

        /** 
        * Sets the FieldOptionsPanel template. The template supports the below listed interpolations.
        * - {optionsType}
        * - {dataSourceId}
        * - {dataSourcePreview}
        * - {inlineOptions}
        * - {optionWidth}
        * - {options}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setFieldOptionsPanel(content)
        {
            this.addTemplate('FieldOptionsPanel', content, false);
        }

        /** 
        * Sets the ComponentPanel_MaskedTextBox template. The template supports the below listed interpolations.
        * - {mask}
        * - {value}
        * - {allowedCharacters}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setComponentPanel_MaskedTextBox(content)
        {
            this.addTemplate('ComponentPanel_MaskedTextBox', content, false);
        }

        /** 
        * Sets the ComponentPanel_NumericBox template. The template supports the below listed interpolations.
        * - {precision}
        * - {value}
        * - {minValue}
        * - {maxValue}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setComponentPanel_NumericBox(content)
        {
            this.addTemplate('ComponentPanel_NumericBox', content, false);
        }

        /** 
        * Sets the ComponentPanel_ComboBox template. The template supports the below listed interpolations.
        * - {multiSelect}
        * - {multiSelectTagging}
        * - {allowInput}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setComponentPanel_ComboBox(content)
        {
            this.addTemplate('ComponentPanel_ComboBox', content, false);
        }

        /** 
        * Sets the ComponentPanel_DatePicker template. The template supports the below listed interpolations.
        * - {today}
        * - {value}
        * - {minValue}
        * - {maxValue}
        * - {allowedDates}
        * - {disallowDates}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setComponentPanel_DatePicker(content)
        {
            this.addTemplate('ComponentPanel_DatePicker', content, false);
        }

        /** 
        * Sets the ComponentPanel_TimePicker template. The template supports the below listed interpolations.
        * - {value}
        * - {minValue}
        * - {maxValue}
        * - {incrementalValue}
        * - {allowedTimes}
        * - {disallowTimes}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setComponentPanel_TimePicker(content)
        {
            this.addTemplate('ComponentPanel_TimePicker', content, false);
        }

        /** 
        * Sets the ComponentPanel_Slider template. The template supports the below listed interpolations.
        * - {range}
        * - {trackSize}
        * - {startValue}
        * - {value}
        * - {minValue}
        * - {maxValue}
        * - {tickMarks}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setComponentPanel_Slider(content)
        {
            this.addTemplate('ComponentPanel_Slider', content, false);
        }

        /** 
        * Sets the ComponentPanel_FileUpload template. The template supports the below listed interpolations.
        * - {accept}
        * - {maxFileSize}
        * - {maxFiles}
        * - {dataSourceId}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setComponentPanel_FileUpload(content)
        {
            this.addTemplate('ComponentPanel_FileUpload', content, false);
        }

        /** 
        * Sets the ComponentPanel_Editor template. The template supports the below listed interpolations.
        * - {blockStyles}
        * - {links}
        * - {lists}
        * - {images}
        * - {media}
        * - {all}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setComponentPanel_Editor(content)
        {
            this.addTemplate('ComponentPanel_Editor', content, false);
        }

        /** 
        * Sets the ValidationPanel template. The template supports the below listed interpolations.
        * - {required}
        * - {dataType}
        * - {pattern}
        * - {length}
        * - {compare}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setValidationPanel(content)
        {
            this.addTemplate('ValidationPanel', content, false);
        }

        /** 
        * Sets the Option template. The template supports the below listed interpolations.
        * - {name}
        * - {value}
        * - {remove}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setOption(content)
        {
            this.addTemplate('Option', content, false);
        }

        /** 
        * Sets the Rule template. The template supports the below listed interpolations.
        * - {source}
        * - {operator}
        * - {value}
        * - {connector}
        * - {remove}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setRule(content)
        {
            this.addTemplate('Rule', content, false);
        }

        /** 
        * Sets the Action template. The template supports the below listed interpolations.
        * - {actionSelector}
        * - {remove}
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        setAction(content)
        {
            this.addTemplate('Action', content, false);
        }

        /**
         * Gets a value indicating whether the form is in build mode.
         * @returns {boolean} A value indicating whether the form is in build mode.
         */
        isBuildMode()
        {
            return (this.displayMode === Form.DisplayModeOption.BUILD);
        }

        /**
         * Gets a value indicating whether the form is in preview mode.
         * @returns {boolean} A value indicating whether the form is in preview mode.
         */
        isPreviewMode()
        {
            return (this.displayMode === Form.DisplayModeOption.PREVIEW);
        }

        /**
         * Gets a value indicating whether the form is in edit mode.
         * @returns {boolean} A value indicating whether the form is in edit mode.
         */
        isEditMode()
        {
            return (this.displayMode === Form.DisplayModeOption.EDIT);
        }

        /**
         * Gets a value indicating whether the form is in view mode.
         * @returns {boolean} A value indicating whether the form is in view mode.
         */
        isViewMode()
        {
            return (this.displayMode === Form.DisplayModeOption.VIEW);
        }

        /**
         * Sets the display mode and re-renders the component.
         * @param {componyx.UI.Form.DisplayModeOption} displayMode The display mode in which the form will be rendered.
         */
        setDisplayMode(displayMode)
        {
            this.displayMode = displayMode;
            const selectedFieldId = this.#selectedFieldId;
            this.render();
            if (!$lib.isEmpty(selectedFieldId) && displayMode === Form.DisplayModeOption.BUILD)
            {
                this.events.onPostRender.priorityAdd(() =>
                {
                    const field = this.getFields().find((f) => f.id === selectedFieldId);

                    if (field)
                        this.selectField(field);
                }, null, true);
            }
        }

        /**
         * Toggles the visibility of a specified side pane (build or config).
         * Adds or removes a CSS class that controls visibility.
         * @param {'build' | 'config'} pane - The pane to toggle ('build' for the left panel, 'config' for the right panel).
         */
        togglePane(pane = 'build')
        {
            const cl = (pane === 'build') ? this.#buildPane.classList : this.#configPane.classList,
                cssClass = this.getCssClass(this.classOption.PANE_HIDDEN);

            if (cl.contains(cssClass))
                cl.remove(cssClass);
            else
                cl.add(cssClass);
        }

        /**
         * Checks whether an undo or redo operation is possible based on the current history state.
         * @param {string} type Either 'undo' or 'redo'.
         * @returns {boolean} True if the operation is possible; otherwise, false.
         */
        canPerformHistoryAction(type)
        {
            return ((type == 'undo' && this.dataObserver.canUndo()) || (type == 'redo' && this.dataObserver.canRedo()));
        }

        /**
         * Updates the visibility and enabled state of UI command buttons based on their associated conditions.
         * Commands are shown/hidden and enabled/disabled according to their `isVisible` and `isEnabled` callbacks.
         */
        updateCommandStates()
        {
            if (!this.isBuildMode())
                return;

            $lib.each(this.commands, (cmd) =>
            {
                const button = $UI.store[cmd.id];

                if (($lib.isEmpty(cmd.isVisible) || cmd.isVisible()))
                    button.show();
                else
                    button.hide();

                if ($lib.isEmpty(cmd.isEnabled) || !button.showing)
                    return;

                const isEnabled = cmd.isEnabled();

                if (button.disabled && isEnabled)
                    button.enable();
                else if (!button.disabled && !isEnabled)
                    button.disable();
            });
        }

        /**
         * Reverts the form data to the previous state in the undo stack.
         */
        undo()
        {
            this.dataObserver.undo();
        }

        /**
         * Restores the form data to the next state in the redo stack.
         */
        redo()
        {
            this.dataObserver.redo();
        }

        /**
         * Sets the active element for the data observer.
         */
        setActiveElement()
        {
            const doc = this.ownerDocument || document;
            this.dataObserver.activeElement = doc.activeElement;
        }

        /**
         * Executes a block of code without tracking any changes in the undo/redo history stack.
         * Any modifications to form data within the callback will not be recorded in the form's history. This is useful for internal or silent updates that should not be undoable.
         * Optionally, you can disable processing/rendering of the changes by passing `false` as the second argument.
         * 
         * @param {Function} callback - The function containing non-history-tracked changes.
         * @param {Boolean} processChanges - A value indicating whether to process and render the changes made during the callback.
         */
        withoutTracking(callback, processChanges = true)
        {
            this.dataObserver.withoutTracking(callback, processChanges);
        }

        /**
         * Processes any pending data changes and updates the form UI accordingly.
         * Call this method after making direct changes to the form data to ensure those changes are rendered and reflected in the UI.
         */
        processChanges()
        {
            this.dataObserver.processPendingChanges();
        }

        /**
         * Checks if the form has any sections (root-level fieldSets of type "Section").
         *
         * @returns {Boolean} True if at least one section exists.
         */
        hasSections()
        {
            return this.fieldSets.some(fs => fs.type === "Section");
        }

        /**
         * Retrieves a section by its identifier. Sections are represented as root-level field sets.
         *
         * @param {String} id - The identifier of the section to find.
         * @returns {componyx.UI.Form.FieldSet|null} The section with the specified id, or null if not found.
         */
        getSection(id)
        {
            for (const fs of this.fieldSets)
            {
                if (fs.id === id && fs.type === "Section")
                    return fs;
            }

            return null;
        }

        /**
         * Retrieves a field set by its identifier, searching recursively through all nested field sets.
         * 
         * @param {String} id - The identifier of the field set to find.
         * @param {componyx.UI.Form.FieldSet[]} [fieldSets=this.fieldSets] - Optional root list of field sets to start from.
         * @returns {componyx.UI.Form.FieldSet|null} The field set with the specified id, or null if not found.
         */
        getFieldSet(id, fieldSets = this.fieldSets)
        {
            for (const fs of fieldSets)
            {
                if (fs.id === id)
                {
                    return fs;
                }

                const nested = fs.fieldSets || [],
                    result = this.getFieldSet(id, nested);

                if (result)
                    return result;
            }

            return null;
        }

        /**
         * Get field by its identifier.
         * @param {String} id The identifier of the field to retrieve.
         * @param {componyx.UI.Form.FieldSet} [fieldSet=null] - The root field set to start from.
         * @param {componyx.UI.Form.Field[]} [fields=null] - The flattened field collection to speed up the lookup for batched find actions.
         * @returns {componyx.UI.Form.Field|null} The field with the specified id, or null if not found.
         */
        getField(id, fieldSet = null, fields = null)
        {
            return (fields || this.getFields(fieldSet)).find(field => field.id === id) || null;
        }

        /**
         * Retrieves all fields from the given field set or the entire form if none is provided.
         * Searches recursively to include fields from nested field sets.
         * 
         * @param {componyx.UI.Form.FieldSet} [fieldSet=null] - The root field set to start from.
         * @returns {componyx.UI.Form.Field[]} A flat array of all fields.
         */
        getFields(fieldSet = null)
        {
            const root = fieldSet || this,
                ownFields = root.fields || [],
                nestedFields = (root.fieldSets || []).flatMap(fs => this.getFields(fs));

            return ownFields.concat(nestedFields);
        }

        /**
         * Retrieves all field sets from the given root or the entire form if none is provided.
         * Searches recursively to include field sets from nested field sets.
         * @param {Object} [fieldSet=null] - The root field set to start from.
         * @returns {Object[]} A flat array of all field sets.
         */
        getFieldSets(fieldSet = null)
        {
            let rootSets = fieldSet?.fieldSets || [];

            if (!fieldSet)
                rootSets = (this.fieldSets || []).flatMap(fs => fs.type === 'Section' ? fs.fieldSets || [] : [fs]);

            return rootSets.concat(rootSets.flatMap(fs => this.getFieldSets(fs)));
        }

        /**
        * Retrieves the field by the field option.
        * @param {componyx.UI.Form.FieldOption} fieldOption The field option.
        * @returns {componyx.UI.Form.Field} The field to which the field option belongs.
        */
        getFieldByFieldOption(fieldOption)
        {
            return this.getFields().find(field => field.options && field.options.find(option => option.id === fieldOption.id)) || null;
        }

        /**
        * Retrieves the field name from the specified text label.
        * @param {string} label The text label.
        * @returns {string} A valid field name.
        */
        getValidFieldNameFromLabel(label)
        {
            return label
                .replace(/[,.]/g, '-')
                .replace(/[^a-zA-Z0-9_\s\-]/g, '')
                .replace(/\s+/g, '_')
                .toLowerCase();
        }

        /**
         * @typedef {Object} FieldContext
         * @memberof componyx.UI.Form
         * @property {componyx.UI.Form.FieldSet} fieldSet - The field set containing the target field.
         * @property {number} fieldSetIndex - The index of the field set in the field set list.
         * @property {number} fieldIndex - The index of the field.
         * @property {componyx.UI.Form.Field} nextField - The rendered field after the target field, or null if it's the last field.
         * @property {componyx.UI.Form.FieldSet} nextFieldSet - The rendered field-set after the target field-set, or null if it's the last field-set.
         * @property {boolean} isLastField - A value indicating if the target field is the last field in the field set.
         * @property {boolean} isLastFieldSet - A value indicating if the target field-set is the last.
         */

        /**
         * Gets the field context by its identifier in the field sets.
         * @param {componyx.UI.Form.Field} field - The field to find context for.
         * @returns {FieldContext|null} The context of the field.
         */
        getFieldContext(field)
        {
            if (!field?.parent)
                return null;

            const fieldSet = field.parent,
                parentFieldSets = fieldSet.parent?.fieldSets || this.fieldSets || [],
                fieldSetIndex = parentFieldSets.findIndex(fs => fs.id === fieldSet.id),
                fieldIndex = fieldSet.fields.findIndex(f => f.id === field.id);

            if (fieldSetIndex === -1 || fieldIndex === -1)
                return null;

            const previousField = fieldSet.fields[fieldIndex - 1] || null,
                nextField = fieldSet.fields[fieldIndex + 1] || null,
                nextFieldSet = parentFieldSets[fieldSetIndex + 1] || null;

            return {
                fieldSet,
                fieldSetIndex,
                fieldIndex,
                previousField,
                nextField,
                nextFieldSet,
                isLastField: !nextField,
                isLastFieldSet: !nextFieldSet
            };
        }

        /**
         * Recursively finds a FieldSet by its associated DOM element.
         * @param {Array} fieldSets - The list of FieldSets to search through.
         * @param {HTMLElement} element - The element to find the corresponding FieldSet for.
         * @returns {Object|null} The matching FieldSet, or null if not found.
         */
        findFieldSetByElement(fieldSets, element)
        {
            for (const fieldSet of fieldSets)
            {
                if (fieldSet.element === element)
                    return fieldSet;

                if (fieldSet.fieldSets)
                {
                    const found = this.findFieldSetByElement(fieldSet.fieldSets, element);
                    if (found)
                        return found;
                }
            }
            return null;
        }

        /**
         * Inserts a build block into the form's active field-set.
         * @param {componyx.UI.Form.BuildBlock} buildBlock - The build block to insert.
         */
        insertBuildBlock(buildBlock)
        {
            const fieldSet = this.getActiveFieldSet(),
                fieldSets = fieldSet.parent?.fieldSets || this.fieldSets,
                fieldSetIndex = fieldSets.findIndex(fs => fs === fieldSet);

            buildBlock.lineBreak = true;

            if (buildBlock.blockType === Form.BlockTypeOption.FIELD_SET) // add fieldset with optional fields 
            {
                const newFieldSet = this.createItemFromBuildBlock(buildBlock);

                fieldSets.splice(fieldSetIndex + 1, 0, newFieldSet);
                newFieldSet.parent = fieldSet.parent;
                this.renderFieldSet(newFieldSet);
            }
            else
            {
                const field = this.createItemFromBuildBlock(buildBlock);

                fieldSet.fields.push(field);
                this.setParentReferences(fieldSet.parent?.fieldSets, fieldSet.parent);
                this.renderField(field);
            }
        }

        createItemFromBuildBlock(buildBlock)
        {
            const className = Form.BlockTypeOption.getName(buildBlock.blockType),
                BlockClass = Form[className],
                props = {};

            if (buildBlock.blockType === Form.BlockTypeOption.FIELD || buildBlock.blockType === Form.BlockTypeOption.FIELD_SET) // editable labels
                props.label = this.labels.newItemPrefix + buildBlock.label;
            else
                props.label = buildBlock.label; // static labels

            const item = this.ensureItemId(new BlockClass({ ...buildBlock, ...props, _keepOriginal: false }));

            if (buildBlock.editTemplate) item.editTemplate = buildBlock.editTemplate;
            if (buildBlock.viewTemplate) item.viewTemplate = buildBlock.viewTemplate;

            if (!item.componentSettings && buildBlock.blockType !== Form.BlockTypeOption.FIELDSET)
                item.componentSettings = {};

            this.autoNameCandidates.add(item.id);

            return item;
        }

        /**
        * Gets the active field set.
        * @returns {componyx.UI.Form.FieldSet} The active field set.
        */
        getActiveFieldSet()
        {
            return (this.#selectedFieldSetId) ? this.getFieldSet(this.#selectedFieldSetId) : this.fieldSets[this.fieldSets.length - 1];
        }

        /**
         * Toggles sections mode.
         */
        toggleSectionMode()
        {
            if (this.hasSections())
                this.disableSectionMode();
            else
                this.enableSectionMode();
        }

        /**
         * Disables sections mode: flattens all section fieldSets into root.
         */
        disableSectionMode()
        {
            if (!this.hasSections()) return;

            this.withoutTracking(() =>
            {
                const newFieldSets = [];

                this.fieldSets.forEach(section =>
                {
                    if (section.fieldSets)
                    {
                        section.fieldSets.forEach(fs => { fs._keepOriginal = false; newFieldSets.push(new Form.FieldSet(fs)) });
                    }

                    this.destroySection(section);
                });

                this.fieldSets = newFieldSets;
                this.setParentReferences();
                this.fieldSets.forEach(fs => this.renderer.renderFieldSet(fs));
            });

            this.renderer.renderSectionTabStrip();
            this.updateRemoveButtonState();
            this.dataObserver.observe();
            this.updateCommandStates();
            this.save();
        }

        /**
         * Enables sections mode: wraps all existing root fieldSets into a single Section.
         */
        enableSectionMode()
        {
            if (this.hasSections())
                return;

            this.dataObserver.withoutTracking(() =>
            {
                const existingFieldSets = [...this.fieldSets];
                this.fieldSets = [];
                this.#formPane.innerHTML = '';
                this.addSection(existingFieldSets, false);
            });

            this.dataObserver.observe();
            this.updateCommandStates();
            this.save();
        }

        /**
         * Shows the previous visible Section, if any.
         * Navigates backward within the fieldSets sequence.
         */
        previousSection()
        {
            const index = this.fieldSets.findIndex(s => s.visible);
            if (index > 0)
                this.showSection(this.fieldSets[index - 1]);
        }

        /**
         * Shows the next visible Section, if any.
         * Navigates forward within the fieldSets sequence.
         */
        nextSection()
        {
            const index = this.fieldSets.findIndex(s => s.visible);
            if (index < this.fieldSets.length - 1)
                this.showSection(this.fieldSets[index + 1]);
        }

        /**
         * Checks if the currently visible Section is the first one.
         * @returns {boolean} True if the current Section is the first; otherwise false.
         */
        isFirstSection()
        {
            if (!this.hasSections())
                return false;

            const index = this.fieldSets.findIndex((s) => s.visible);
            return (index == 0);
        }

        /**
         * Checks if the currently visible Section is the last one.
         * @returns {boolean} True if the current Section is the last; otherwise false.
         */
        isLastSection()
        {
            if (!this.hasSections())
                return false;

            const index = this.fieldSets.findIndex((s) => s.visible);
            return (index == this.fieldSets.length - 1);
        }

        /**
         * Displays the specified Section and updates button and rule states accordingly.
         * Hides the currently visible Section if different.
         * @param {componyx.UI.Form.Section} section - The Section to display.
         */
        showSection(section)
        {
            if (this.isBuildMode() || !this.hasSections())
                return;

            const current = this.fieldSets.find(s => s.visible);

            if (current && current !== section)
                this.#setSectionDisplay(current, false);

            this.#setSectionDisplay(section, true);
            this.initRules(section.fieldSets);
        }

        /**
        * Initializes conditional and validation rules. Also updates form navigation button states and moves focus to first form field.
        * Is called automatically after the form is loaded or when a section is shown.
        * @param {componyx.UI.Form.FieldSet[]} fieldSets - The fieldSets for which the rules will be initialized.
        */
        initRules(fieldSets = this.fieldSets)
        {
            let hasRules = false;

            if (!this.isViewMode())
                hasRules = this.validationManager.addRules(fieldSets);

            if (this.renderNavigationButtons)
            {
                if (this.hasSections())
                    this.#setSectionButtonState(hasRules);
                else if (!hasRules)
                    this.submitButton?.enable();
            }

            if (hasRules)
                this.validationManager.validator.validate(this, true);

            this.ruleEngine.initRules();

            if (this.isViewMode())
                this.submitButton?.hide();
            else
                setTimeout(() => { this.#focusFirst(fieldSets) }); // we use a double set timeout to make sure that this runs after other scheduled macro tasks
        }

        /**
         * Adds a new Section as root item into the fieldSets data.
         * Optionally, existing fieldSets can be wrapped inside this new section.
         * @param {Form.FieldSet[]} [fieldSets] - Optional array of fieldSets to include in the new Section.
         * @returns {componyx.UI.Form.Section} The newly added Section.
         */
        addSection(fieldSets = [], focusTabInput = true)
        {
            const newSection = new Form.Section({
                _keepOriginal: false,
                label: this.labels.newItemPrefix + this.labels.section,
                fieldSets: fieldSets.length ? fieldSets : []
            });

            this.ensureItemId(newSection);
            this.fieldSets.push(newSection);

            if (!fieldSets.length)
                this.ensureValidFieldSet(true);

            this.setParentReferences(newSection.fieldSets, newSection);

            this.renderer.renderSection(newSection);
            this.selectSection(newSection);
            this.renderer.renderSectionTabStrip(focusTabInput);
            this.updateRemoveButtonState();

            return newSection;
        }


        /**
         * Removes the specified section from the fieldSets data. 
         * Picks a neighbor section (previous if possible, otherwise next) to keep the form visible.
         * @param {componyx.UI.Form.Section} section
         */
        removeSection(section)
        {
            const siblings = this.fieldSets,
                index = siblings.findIndex(s => s.id === section.id),
                previous = siblings[index - 1] || null,
                next = siblings[index + 1] || null;

            siblings.splice(index, 1);
            this.destroySection(section);
            this.updateRemoveButtonState();
            this.resetConfigPanelBar();

            const candidate =
                (previous && previous.element && previous.element.isConnected) ? previous :
                    (next && next.element && next.element.isConnected) ? next :
                        null;

            if (candidate)
                this.selectSection(candidate, true);
        }

        /**
         * Adds a repeated instance of the given field set, assigning it a new label and tracking it as part of a repeat group.
         * @param {componyx.UI.Form.FieldSet} fieldSet - The original field set to repeat.
         */
        addRepeatedFieldSet(fieldSet)
        {
            if (this.isBuildMode()) return;

            const repeatGroupId = fieldSet.id,
                parent = fieldSet.parent,
                siblings = parent?.fieldSets || this.fieldSets,
                groupFieldSets = siblings.filter(fs => fs.repeatGroupId === repeatGroupId),
                lastFieldSet = groupFieldSets[groupFieldSets.length - 1] || fieldSet,
                newFieldSet = this.addFieldSet({
                    ...fieldSet,
                    repeatGroupId,
                    id: lastFieldSet.id, // ensures new one is inserted after last repeated instance
                }, true);

            this.repeatedFieldSets.push(newFieldSet);
            newFieldSet.element.classList.add(this.getCssClass(this.classOption.REPEATABLE));

            // Recalculate labels for all repeated instances including original
            const allRepeated = [...groupFieldSets, newFieldSet];
            allRepeated.forEach((fs, index) =>
            {
                fs.label = this.#generateRepeatedLabel(fieldSet.repeatLabel || fieldSet.label, index + 1);
                this.renderer.updateLabel(fs);
            });

            // Re-render add button
            const addButton = $UI.store[this.getId(fieldSet, 'add_repeat')];
            this.#updateButtonPlacement(addButton, newFieldSet.element);

            if (fieldSet.maxRepeats && allRepeated.length >= fieldSet.maxRepeats)
                addButton?.disable();

            const removeButton = $UI.store[this.getId(fieldSet, 'remove_repeat')];

            if (removeButton)
            {
                removeButton.command = this.removeRepeatedFieldSet.bind(this, newFieldSet);
                this.#updateButtonPlacement(removeButton, newFieldSet.element);
            }
            else
            {
                this.componentFactory.createButton(
                    newFieldSet.element,
                    this.getId(fieldSet, 'remove_repeat'),
                    this.removeRepeatButtonId,
                    {
                        hasIcon: true,
                        cssClassIcon: 'ico-bin',
                        cssClass: this.getCssClass(this.classOption.REPEAT_REMOVE),
                        command: this.removeRepeatedFieldSet.bind(this, newFieldSet)
                    }
                );
            }
        }

        #updateButtonPlacement(button, element)
        {
            button.destroy();
            button.containerElement = element;
            button.render();
        }

        /**
         * Removes a repeated field set instance and updates related UI elements and data.
         * - Adjusts line breaks if necessary.
         * - Removes the associated "remove repeat" button.
         * - Re-enables the "add repeat" button if applicable.
         * @param {componyx.UI.Form.FieldSet} fieldSet - The repeated field set to remove.
         */
        removeRepeatedFieldSet(fieldSet)
        {
            const repeatGroupId = fieldSet.repeatGroupId,
                siblings = fieldSet.parent?.fieldSets || this.fieldSets,
                orgFieldSet = siblings.find(fs => fs.id === repeatGroupId),
                addButtonId = this.getId(orgFieldSet, 'add_repeat'),
                addButton = $UI.store[addButtonId],
                removeButtonId = this.getId(orgFieldSet, 'remove_repeat'),
                removeButton = $UI.store[removeButtonId];

            this.removeFieldSet(fieldSet); // Remove the fieldset from DOM and internal data              

            const index = this.repeatedFieldSets.findIndex(fs => fs.id === fieldSet.id);
            if (index !== -1)
                this.repeatedFieldSets.splice(index, 1);

            const updatedSiblings = orgFieldSet?.parent?.fieldSets || this.fieldSets,
                remainingGroup = updatedSiblings.filter(fs => fs.repeatGroupId === repeatGroupId),
                lastGroupFieldSet = remainingGroup.length ? remainingGroup[remainingGroup.length - 1] : orgFieldSet;

            remainingGroup.forEach((fs, index) =>
            {
                fs.label = this.#generateRepeatedLabel(orgFieldSet.repeatLabel || orgFieldSet.label, index + 1);
                this.renderer.updateLabel(fs);
            });

            this.#updateButtonPlacement(addButton, lastGroupFieldSet.element)

            if (lastGroupFieldSet.id !== orgFieldSet.id)
            {
                removeButton.command = this.removeRepeatedFieldSet.bind(this, lastGroupFieldSet);
                this.#updateButtonPlacement(removeButton, lastGroupFieldSet.element)
            }
            else
                remove.destroy();

            // Re-enable Add button if we’re below max repeats again
            if (orgFieldSet && orgFieldSet.maxRepeats && remainingGroup.length < orgFieldSet.maxRepeats)
                addButton?.enable();
        }

        /**
         * Adds a new field set after the specified field into the fieldSets data.
         * @param {componyx.UI.Form.FieldSet} fieldSet - The field set after which the new field will be added.
          * @param {boolean} clone - A value indicating if the field set should be cloned.
          * @returns {componyx.UI.Form.FieldSet} The added field set.
         */
        addFieldSet(fieldSet, clone)
        {
            let defaultLabel = this.labels.newItemPrefix + this.labels.fieldSet,
                parentFieldSet = fieldSet.parent,
                siblings = parentFieldSet?.fieldSets || this.fieldSets,
                index = siblings.findIndex(fs => fs.id === fieldSet.id),
                nextFieldSet = (index >= 0 && index < siblings.length - 1)
                    ? siblings[index + 1]
                    : null,
                props = (clone) ? { ...fieldSet, _keepOriginal: false } : { label: defaultLabel },
                newFieldSet = this.ensureItemId(new Form.FieldSet(props));

            newFieldSet.lineBreak = (!nextFieldSet || nextFieldSet.lineBreak === true);
            siblings.splice(index + 1, 0, newFieldSet);
            this.setParentReferences(siblings, parentFieldSet);
            this.renderFieldSet(newFieldSet);
            this.selectFieldSet(newFieldSet);
            this.updateRemoveButtonState();

            return newFieldSet;
        }

        /**
         * Removes the specified field set from the fieldSets data and adjusts the line break if necessary.
         * @param {componyx.UI.Form.FieldSet} fieldSet - The field set to be removed.
         * @param {Boolean} resetConfigPanelBar - A value indicating if the config panel bar must be reset (disabled and collapsed).
         */
        removeFieldSet(fieldSet, resetConfigPanelBar)
        {
            const parent = fieldSet.parent,
                siblings = parent?.fieldSets || this.fieldSets,
                index = siblings.findIndex(fs => fs.id === fieldSet.id),
                previous = siblings[index - 1],
                next = siblings[index + 1];

            if (next && fieldSet.lineBreak && next.lineBreak === false) // move line break to next field set
                this.addLineBreak(next);

            siblings.splice(index, 1);
            this.destroyFieldSet(fieldSet);
            this.updateRemoveButtonState();

            if (resetConfigPanelBar)
                this.resetConfigPanelBar();

            const selectFieldSet = previous?.element.isConnected ? previous
                : next?.element.isConnected ? next : null;

            if (selectFieldSet)
                this.selectFieldSet(selectFieldSet);
        }

        /**
         * Adds a new field after the specified field into the fieldSets data.
         * @param {componyx.UI.Form.Field} field - The field after which the new field will be added.
         * @param {boolean} clone - A value indicating if the field should be cloned.
         * @returns {componyx.UI.Form.Field} The added field.
         */
        addField(field, clone = false)
        {
            const context = this.getFieldContext(field);

            if (!context)
                return;

            let defaultLabel = this.labels.newItemPrefix + this.labels.field,
                props = clone ? { ...field, _keepOriginal: false } : { label: defaultLabel, inputType: field.inputType },
                FieldClass = Form[field.type],
                newField = new FieldClass(props);

            this.ensureItemId(newField);
            newField.lineBreak = (!context.nextField || context.nextField.lineBreak === true);
            context.fieldSet.fields.splice(context.fieldIndex + 1, 0, newField);
            this.setParentReferences(context.fieldSet.parent?.fieldSets || this.fieldSets, context.fieldSet.parent);
            this.renderField(newField);
            this.selectField(newField);
            this.autoNameCandidates.add(newField.id);

            return newField;
        }

        /**
         * Removes the specified field from the fieldSets data and adjusts the line break if necessary.
         * @param {componyx.UI.Form.Field} field - The field to be removed.
         * @param {Boolean} resetConfigPanelBar - A value indicating if the config panel bar must be reset (disabled and collapsed).
         */
        removeField(field, resetConfigPanelBar = false)
        {
            const context = this.getFieldContext(field),
                hasLineBreak = field.lineBreak;
            let lineBreakChanged = false;

            if (!context)
                return;

            if (context.nextField && hasLineBreak && context.nextField.lineBreak === false) // move line break to next field
            {
                lineBreakChanged = true;
                this.addLineBreak(context.nextField);
            }

            context.fieldSet.fields.splice(context.fieldIndex, 1);
            this.destroyField(field);

            if (lineBreakChanged)
                this.scaleInlineSiblings(context.nextField);
            else if (!hasLineBreak && context.previousField)
                this.scaleInlineSiblings(context.previousField);

            if (resetConfigPanelBar)
                this.resetConfigPanelBar();

            const selectField = context.previousField?.element.isConnected ? context.previousField
                : context.nextField?.element.isConnected ? context.nextField : null;

            if (selectField)
                this.selectField(selectField);
            else
            {
                this.deselectField();
                this.selectFieldSet(context.fieldSet);
            }
        }

        scaleInlineSiblings(field)
        {
            let fields = field.parent.fields,
                index = fields.findIndex(f => f.id === field.id),
                lineFields = [];

            if (index === -1) return; // safety check

            lineFields.push(field);

            const width = f => !f.element ? 0 : (f.width?.toString().endsWith('%') ? parseFloat(f.width) : 0); // a new field has no width yet

            let start = index,
                end = index + 1,
                total = width(field);

            while (start > 0 && !fields[start].lineBreak && total + width(fields[start - 1]) <= 100) // find start of row while fields fit
                total += width(fields[--start]); // moves start index back

            if (start < index)
                lineFields.push(...fields.slice(start, index)); // collect fields before current

            while (end < fields.length && !fields[end].lineBreak && total + width(fields[end]) <= 100) // find end of row while fields fit
                total += width(fields[end++]); // moves end index forward

            if (end > index + 1)
                lineFields.push(...fields.slice(index + 1, end)); // collect fields after current

            const widthMap = ['100%', '50%', '33%', '25%'],
                fieldCount = Math.min(lineFields.length - 1, 3);

            if (!field.element) // new field
            {
                if (!field.width || field.width.endsWith('%'))
                    field.width = widthMap[fieldCount];

                lineFields = lineFields.filter(f => f.id !== field.id); // field is new, remove from update list, needs to be rendered
            }

            lineFields.forEach(f =>
            {
                if (!f.width || f.width.endsWith('%'))
                {
                    f.width = widthMap[fieldCount];
                    this.updateField(f);
                }
            });
        }

        /** Resets the config panel bar to default disabled and collapsed state. */
        resetConfigPanelBar()
        {
            const panelBar = this.configPanelManager.panelBar;
            panelBar.collapseAllPanels(true);
            panelBar.disableAllPanels();
        }

        /**
        * Sets the label display for all fields in the field set.
        * @param {componyx.UI.Form.FieldSet} fieldSet The field set containing the fields for which to set the label display.
        * @param {componyx.UI.FormField.LabelDisplayOption} labelDisplay The label display.
        */
        setLabelDisplay(fieldSet, labelDisplay)
        {
            fieldSet.fields.forEach(field =>
            {
                if (!$lib.isEmpty(labelDisplay))
                {
                    this.dataObserver.shouldProcessChanges = true;
                    field.labelDisplay = parseFloat(labelDisplay);
                }
            });
        }

        /**
        * Destroys the section
        * @param {componyx.UI.Form.Section} section The section to destroy.
        */
        destroySection(section)
        {
            this.renderer.destroySection(section);
        }

        /**
        * Renders the section.
        * @param {componyx.UI.Form.Section} section The section to render.
        */
        renderSection(section)
        {
            this.renderer.renderSection(section);
        }

        /**
         * Updates simple settings that don't required a re-render.
         * @param {componyx.UI.Form.Section} section The section to update.
         */
        updateSection(section)
        {
            this.renderer.updateSection(section);
        }

        /**
        * Destroys the field-set.
        * @param {componyx.UI.Form.FieldSet} fieldSet The field-set to destroy.
        */
        destroyFieldSet(fieldSet)
        {
            this.renderer.destroyFieldSet(fieldSet);
        }

        /**
        * Renders the field-set.
        * @param {componyx.UI.Form.FieldSet} fieldSet The field-set to render.
        */
        renderFieldSet(fieldSet)
        {
            this.renderer.renderFieldSet(fieldSet);
        }

        /**
         * Updates simple field set settings that don't required a re-render.
         * @param {componyx.UI.Form.FieldSet} fieldSet The field-set to update.
         */
        updateFieldSet(fieldSet)
        {
            this.renderer.updateFieldSet(fieldSet);
        }

        /**
         * Renders the field.
         * @param {componyx.UI.Form.Field} field The field to render.
         */
        renderField(field)
        {
            this.renderer.renderField(field);
        }

        /**
         * Updates simple field settings that don't required a re-render.
         * @param {componyx.UI.Form.FieldSet} field The field to update.
         */
        updateField(field)
        {
            this.renderer.updateField(field);
        }

        /**
         * Updates the field with new options for build mode view.
         * @param {componyx.UI.Form.FieldSet} field The field to update.
         */
        updateFieldOptions(field)
        {
            this.renderer.updateFieldOptions(field);
        }

        /**
        * Destroys the field.
        * @param {componyx.UI.Form.Field} field The field to destroy.
        */
        destroyField(field)
        {
            this.renderer.destroyField(field);
        }

        /**
         * Recursively assign parent references to each field set and its nested field sets.
         * @param {componyx.UI.Form.FieldSet[]} fieldSets - Array of field sets or sections.
         * @param {componyx.UI.Form.FieldSet|null} [parent=null] - Parent field set (null if at root level).
         */
        setParentReferences(fieldSets = this.fieldSets, parent = null)
        {
            if (!parent)
                fieldSets = this.fieldSets;

            fieldSets.forEach(fieldSet =>
            {
                fieldSet.parent = parent; // Store reference to parent

                if (fieldSet.fieldSets)
                {
                    this.setParentReferences(fieldSet.fieldSets, fieldSet);
                }

                if (fieldSet.fields)
                {
                    fieldSet.fields.forEach(field => 
                    {
                        field.parent = fieldSet;
                    });
                }
            });
        }

        /**
         * Adds a line break to the field.
         * @param {componyx.UI.Form.Field|componyx.UI.Form.FieldSet} field The field or field set.
         */
        addLineBreak(field)
        {
            field.lineBreak = true;

            if (!field.element || field.lineBreakElement?.isConnected)
                return;

            let p = document.createElement("p");
            p.classList.add(this.getCssClass(this.classOption.LINE_BREAK));

            field.element.parentElement.insertBefore(p, field.element);
            field.lineBreakElement = p;
        }

        /**
         * Removes a line break from the field.
         * @param {componyx.UI.Form.Field|componyx.UI.Form.FieldSet} field The field or field set.
         * @param {Boolean} updateProperty A value indicating if the lineBreak property is also updated.
         */
        removeLineBreak(field, updateProperty = true)
        {
            if (updateProperty)
                field.lineBreak = false;

            if (!field.lineBreakElement)
                return;

            field.lineBreakElement.remove();
            field.lineBreakElement = null;
        }

        /**
        * Gets the css class if it exists and otherwise the default css class.
        * @returns {String} The css class.
        */
        getCssClass(cssClassValue)
        {
            return super.getCssClass(this.classOption, cssClassValue);
        }

        /**
         * Enables or disables remove buttons for root fieldSets, at least one fieldSet is required.
         */
        updateRemoveButtonState()
        {
            if (!this.isBuildMode())
                return;

            const rootItems = this.fieldSets,
                setButtonState = (item, disable = false) =>
                {
                    const button = $UI.store[this.getId(item, 'remove')];

                    if (disable && !button.disabled)
                        button.disable()
                    else if (!disable)
                        button.enable();
                }

            if (rootItems.length && rootItems[0].type === 'FieldSet')
            {
                if (rootItems.length === 1)
                {
                    setButtonState(rootItems[0], true);
                }
                else
                {
                    rootItems.forEach(fs => setButtonState(fs));
                }
            }
            else if (rootItems.length && rootItems[0].type === 'Section') // Root contains Sections, check one level deeper
            {
                rootItems.forEach(section =>
                {
                    const sectionFieldSets = section.fieldSets;

                    if (sectionFieldSets.length === 1)
                    {
                        setButtonState(sectionFieldSets[0], true);
                    }
                    else
                    {
                        sectionFieldSets.forEach(fs => setButtonState(fs));
                    }
                });
            }
        }

        /**
         * Ensures that the object has a valid identifier if it is not set.
         * @param {componyx.UI.Form.Field|componyx.UI.Form.FieldSet|componyx.UI.Form.Section} item
         * @param {boolean} isClone=false A value indicating if this field is cloned.
         * @returns {componyx.UI.Form.Field|componyx.UI.Form.FieldSet|componyx.UI.Form.Section} The passed object.
         */
        ensureItemId(item, isClone = false)
        {
            if ($lib.isEmpty(item.id))
            {
                const id = this.guid();

                if (item.type === 'Field' && !$lib.isEmpty(item.name))
                {
                    const baseName = (isClone) ? item.name.split('_').slice(0, -1).join('_') : item.name;
                    item.id = `${baseName}_${id}`;
                }
                else
                    item.id = `${item.type}_${id}`;
            }

            if (item.type === 'Field' && $lib.isEmpty(item.name))
                item.name = item.id;

            return item;
        }

        /**
         * Deselects the currently selected section.
         */
        deselectSection()
        {
            if (!this.#selectedSectionId)
                return;

            const section = this.getSection(this.#selectedSectionId);

            if (section)
            {
                section.selected = false;

                if (section.element)
                    section.element.style.display = 'none';
            }

            this.#selectedSectionId = null;
        }

        /**
         * Selects the given section, making it visible and deselecting the previous one.
         * @param {componyx.UI.Form.Section} section - The section to select.
         * @param {Boolean} selectFirst - A value indicating if the first field or fieldSet is selected.
         */
        selectSection(section, selectFirst = false)
        {
            if (this.#selectedSectionId === section.id)
                return;

            if (this.renderState != $base.static.RenderState.RENDERED)
            {
                this.#selectedSectionId = section.id;
                return;
            }

            this.deselectSection();

            section.selected = true;
            section.element.style.display = '';
            this.#selectedSectionId = section.id;
            this.renderer.renderSectionTabStrip(true);

            if (selectFirst)
                this.selectFirst(section);
        }

        /**
         * Deselects the currently selected field set.
         */
        deselectFieldSet()
        {
            if (!this.isBuildMode())
                return;

            if (this.#selectedFieldSetId)
            {
                const fieldSet = this.getFieldSet(this.#selectedFieldSetId);

                if (fieldSet)
                {
                    fieldSet.selected = false;

                    if (fieldSet.element)
                        fieldSet.element.classList.remove(this.getCssClass(this.classOption.SELECTED));
                }

                this.#selectedFieldSetId = null;
                this.configPanelManager.clearActive();
            }

            if (this.configPanelManager.panelBar)
                this.configPanelManager.panelBar.disableAllPanels();
        }

        /**
         * Selects the given field set and applies selected styling.
         * @param {Object} fieldSet - The field set to select.
         */
        selectFieldSet(fieldSet)
        {
            if (!this.isBuildMode())
                return;

            const manager = this.configPanelManager,
                isActive = this.configPanelManager.isFieldSetActive(fieldSet),
                panelBar = manager.panelBar,
                legendInput = fieldSet.element.querySelector('legend > input'),
                doc = this.ownerDocument || document;

            if (this.#selectedFieldSetId === fieldSet.id)
            {
                if (doc.activeElement === legendInput || !this.#selectedFieldId)
                {
                    panelBar.enablePanel('FieldSetPanel');
                    panelBar.expandPanel('FieldSetPanel');
                }

                return;
            }

            this.deselectFieldSet();
            this.deselectField();

            if (this.hasSections())
                this.selectSection(fieldSet.parent);

            fieldSet.selected = true;
            fieldSet.element.classList.add(this.getCssClass(this.classOption.SELECTED));
            this.#selectedFieldSetId = fieldSet.id;
            manager.setActiveFieldSet(fieldSet);

            panelBar.collapseAllPanels(this.dataObserver.activePanelId ? true : false);
            panelBar.hidePanel('ComponentPanel');
            panelBar.enablePanel('FieldSetPanel');
            panelBar.expandPanel('FieldSetPanel');

            if (!isActive) // render panel content
            {
                this.dataBinder.bindProperty(fieldSet, legendInput);
                manager.renderFieldSetPanel(fieldSet);
                manager.renderRulesPanel(fieldSet);

                this.dataBinder.updateView(true);
            }

            this.events.onSelectFieldSet.fire(this, { fieldSet: fieldSet });
        }

        /**
         * Deselects the currently selected field.
         */
        deselectField()
        {
            if (!this.isBuildMode())
                return;

            if (this.#selectedFieldId)
            {
                const field = this.getField(this.#selectedFieldId);

                if (field)
                {
                    field.selected = false;

                    if (field.element)
                        field.element.classList.remove(this.getCssClass(this.classOption.SELECTED));
                }

                this.#selectedFieldId = null;
            }
        }

        /**
         * Selects the given field and applies selected styling.
         * @param {Object} field - The field to select.
         */
        selectField(field)
        {
            if (!this.isBuildMode())
                return;

            const manager = this.configPanelManager,
                isActive = manager.isFieldActive(field),
                panelBar = manager.panelBar,
                optionsPanel = (field.inputType == Form.InputTypeOption.CHECKBOX || field.inputType == Form.InputTypeOption.RADIO || field.inputType == Form.InputTypeOption.SWITCH || field.inputType == Form.InputTypeOption.COMBOBOX),
                componentPanel = (field.inputType >= Form.InputTypeOption.MASKEDTEXTBOX),
                fieldPanelName = field.type + 'Panel',
                labelInput = field.element.querySelector(`label > input`),
                doc = this.ownerDocument || document;

            if (this.#selectedFieldId === field.id)
            {
                if (doc.activeElement === labelInput)
                    panelBar.expandPanel(fieldPanelName);

                return;
            }

            this.configPanelManager.destroy();
            this.deselectFieldSet();
            this.deselectField();

            this.selectFieldSet(field.parent);
            panelBar.enableAllPanels();
            panelBar.showAllPanels();

            field.selected = true;
            field.element.classList.add(this.getCssClass(this.classOption.SELECTED));
            this.#selectedFieldId = field.id;
            manager.setActiveField(field);
            panelBar.collapseAllPanels(this.dataObserver.activePanelId ? true : false);

            if (!optionsPanel)
                panelBar.disablePanel('FieldOptionsPanel');

            if (!componentPanel)
                panelBar.hidePanel('ComponentPanel');

            if (!isActive) // render panel content
            {
                if (labelInput)
                    this.dataBinder.bindProperty(field, labelInput);

                ['Field', 'ContentField', 'SpacerField'].forEach(name => fieldPanelName !== name + 'Panel' && panelBar.hidePanel(name + 'Panel'));
                manager.renderFieldTypePanel(field);
                manager.renderValidationPanel(field);
                manager.renderRulesPanel(field);

                if (!this.dataObserver.activePanelId)
                    panelBar.expandPanel(fieldPanelName);

                if (optionsPanel)
                    manager.renderOptionsPanel(field);

                if (componentPanel)
                    manager.renderComponentPanel(field);

                this.dataBinder.updateView(true);
            }

            field.element.scrollIntoView({ behavior: "smooth", block: "nearest" });
            this.events.onSelectField.fire(this, { field: field });
        }

        /**
         * Selects the first field or field set.
        */
        selectFirst(section)
        {
            const getFirstSelectable = (item) =>
            {
                if (item.fieldSets && item.fieldSets.length)
                    return getFirstSelectable(item.fieldSets[0]); // item is a Section or FieldSet with child FieldSets, descend into its fieldSets                

                return (item.fields && item.fields.length) ? item.fields[0] : item; // either return first Field or FieldSet
            };

            const first = getFirstSelectable(section || this.fieldSets[0]);

            if (first.type === 'FieldSet')
                this.selectFieldSet(first);
            else
                this.selectField(first);
        }

        /**
         * Rebinds legend inputs for all child field sets.
         * If no fieldSet provided, processes all field sets recursively.
         * @param {Object} [fieldSet=null] - The parent field set containing child sets.
         */
        rebindFieldSetLabels(fieldSet = null)
        {
            if (!this.isBuildMode())
                return;

            const sets = fieldSet?.fieldSets ? fieldSet.fieldSets : this.getFieldSets();

            sets.forEach(set =>
            {
                if (!set.element || !set.element.isConnected)
                    return;

                const legendInput = set.element.querySelector('legend > input');
                if (legendInput)
                    this.dataBinder.bindProperty(set, legendInput);
            });

            this.dataBinder.updateView(true);
        }

        /**
         * Rebinds label inputs and possible content field values for all fields in the given field set or all fields in the form if none given.
         * @param {Object} [fieldSet=null] - The field set containing fields to rebind.
         */
        rebindFieldElements(fieldSet = null)
        {
            if (!this.isBuildMode())
                return;

            const fields = fieldSet ? this.getFields(fieldSet) : this.getFields();

            fields.forEach(field =>
            {
                if (!field.element || !field.element.isConnected)
                    return;

                const labelInput = field.element.querySelector(`label > input`);

                if (labelInput)
                    this.dataBinder.bindProperty(field, labelInput);

                if (field.type === 'ContentField')
                {
                    const contentFieldEl = $lib('#' + this.getId(field, 'content'));
                    this.dataBinder.bindProperty(field, contentFieldEl); // bind to field value
                }
            });

            this.dataBinder.updateView(true);
        }

        /**
         * Converts serialized objects back to their corresponding class instances.
         * @param {componyx.UI.Form.FieldSet[]|componyx.UI.Form.Section[]} fieldSets - An array of field set objects (FieldSet or Section) to rehydrate.
         */
        rehydrate(fieldSets = this.fieldSets)
        {
            for (let index = 0; index < fieldSets.length; index++)
            {
                let props = { ...fieldSets[index], _keepOriginal: true }; // clone will instantiate correct class
                fieldSets[index] = (fieldSets[index].type === 'Section') ? new Form.Section(props) : new Form.FieldSet(props);
            }
        }

        /**
        * Renders the component.
        */
        async render()
        {
            if (this.renderState != $base.static.RenderState.RENDERING)
            {
                super.render(this.#preRender, 'form');
                return;
            }

            if (componyx.UI.editor_modules)
                await componyx.UI.editor_modules.loaded; // we wait before the editor and it's modules are loaded

            if (componyx.bindary_modules)
                await componyx.bindary_modules.loaded; // make sure Bindary is loaded for data-binding

            this.#instantiateModules();
            this.#guidCounter = this.#getMaxGuidCounter(this.getFieldSets());
            this.actionManager.registerDefaultActions();

            // render logic after loading resources
            if (this.isBuildMode())
            {
                this.classList.add(this.getCssClass(this.classOption.BUILD_MODE));

                if (this.fixedLayout)
                    this.classList.add(this.getCssClass(this.classOption.FIXED_LAYOUT));

                this.addEventListener('keydown', this.#undoRedoHandler, { capture: true });
            }
            else if (this.isPreviewMode())
                this.classList.add(this.getCssClass(this.classOption.PREVIEW_MODE));
            else if (this.isViewMode())
                this.classList.add(this.getCssClass(this.classOption.VIEW_MODE));
            else if (this.isEditMode())
                this.classList.add(this.getCssClass(this.classOption.EDIT_MODE));

            const resolvePanel = panel =>
            {
                if (!(panel instanceof componyx.UI.PanelBar.Panel))
                    panel = new componyx.UI.PanelBar.Panel(panel);

                if (typeof panel.title === 'string' && panel.title.startsWith(':'))
                {
                    const key = panel.title.slice(1);

                    if (this.labels[key])
                        panel.title = this.labels[key];
                }

                return panel;
            };

            this.buildPanels = this.buildPanels.map(resolvePanel);
            this.configPanels = this.configPanels.map(resolvePanel);
            this.tabIndex = (!$lib.isEmpty(this.tabIndex)) ? this.tabIndex : -1;
            this.#setDefaultTemplates();
            this.#draw();
            this.updateCommandStates();
            this.renderChildren();
        }

        /**
         * Executes post render tasks.
        * @private
        */
        async postRender()
        {
            if (this.renderState != $base.static.RenderState.RENDERING) // extra safety to never execute a postRender when the component state is incorrect
                return;

            const initForm = () =>
            {
                if (this.hasSections())
                    this.showSection(this.fieldSets[0]);
                else
                    this.initRules();
            }

            const bindToModel = this.isPreviewMode() || (this.autoDataBindFields && !this.isBuildMode());

            this.dataBinder.bindContext(this);
            this.dataObserver.observe();

            if (bindToModel)
                this.dataBinder.bindFieldsToModel(this.fieldSets, initForm);

            if (this.isBuildMode())
                this.updateRemoveButtonState();

            super.postRender();

            if (this.isBuildMode())
            {
                if (this.#selectedSectionId) // section tab was selected before post-render
                {
                    let sectionId = this.#selectedSectionId;
                    this.#selectedSectionId = null;
                    this.selectSection(this.getSection(sectionId), true);
                }

                if ($lib.isEmpty(this.#selectedFieldId))
                    this.selectFirst();

                return;
            }
                  
            if (!bindToModel)
                initForm();    
        }

        /**
        * Destroys the component.
        * @param {Boolean} keepEvents A value indicating if component events should be kept.
        * @param {Boolean} removeElement=true A value indicating if the corresponding HTML Element should be removed.
        */
        destroy(keepEvents, removeElement = true)
        {
            this.#dispose(removeElement);
            super.destroy(keepEvents, removeElement);
        }

        /**
         * Schedules an auto-save after a delay. Resets the timer if called repeatedly.
         */
        scheduleSave()
        {
            clearTimeout(this.#saveTimerId);
            this.#saveTimerId = setTimeout(async () => { await this.save(); }, this.autoSaveDelay);
        }

        /**
         * Saves the current form definition by calling the configured save endpoint.
         * Triggers onSave events and updates the UI save status indicator.
         * @returns {Promise<Object>} Resolves with the save result object.
         */
        async save()
        {
            let result;
            const statusEl = this.renderer.saveStatusElement,
                cssClassBusy = this.getCssClass(this.classOption.SAVE_STATUS_BUSY);

            statusEl.style.visibility = '';
            statusEl.classList.add(cssClassBusy);
            statusEl.offsetWidth; // force reflow to apply styles immediately

            if (this.saveEndpoint)
            {
                result = await this.fetchFromEndpoint(this.saveEndpoint, { form: this }, { fieldSets: this.fieldSets });
            }

            if (!result)
                result = { error: false, success: true };

            await this.events.onSave.fire(this, result);

            statusEl.classList.remove(cssClassBusy);
            statusEl.offsetWidth; // force reflow to apply styles immediately

            if (result?.error)
                statusEl.classList.add(this.getCssClass(this.classOption.SAVE_STATUS_FAILED));
            else
                statusEl.classList.add(this.getCssClass(this.classOption.SAVE_STATUS_SUCCESS));

            $lib.cssAnimation(statusEl, undefined, [], // use default cui-animation class
                {
                    onComplete: () =>
                    {
                        statusEl.className = this.getCssClass(this.classOption.SAVE_STATUS);
                        statusEl.style.visibility = 'hidden';
                    },

                }
            );
        }

        /**
         * Submits the form values by calling the configured submit endpoint.
         * Executes rule-engine submit triggers and fires submit events.
         *
         * @returns {Promise<void>} Resolves when submission and related rules have completed.
         */
        async submit()
        {
            if (this.isPreviewMode())
                return;

            const values = (this.includeDisabledFields) ? this.values : this.getEnabledFieldValues();
            let result;

            await this.ruleEngine.initRules(this.constructor.RuleCaseTriggerOption.BEFORE_SUBMIT);

            if (this.submitCanceled)
            {
                await this.events.onSubmitCanceled.fire(this, { values });
                this.submitCanceled = false; // reset
                return;
            }

            if (this.submitEndpoint)
            {
                result = await this.fetchFromEndpoint(this.submitEndpoint, { form: this }, { values });
            }

            if (!result)
                result = { error: false, success: true };

            await this.events.onSubmit.fire(this, { values, result });

            if (!this.renderState) // component was destroyed after submit
                return;

            if (!result?.error)
            {
                if (result.success)
                    await this.ruleEngine.initRules(this.constructor.RuleCaseTriggerOption.SUBMIT_SUCCEEDED);
                else
                    await this.ruleEngine.initRules(this.constructor.RuleCaseTriggerOption.SUBMIT_FAILED);
            }
        }

        /**
         * Fetches data from the specified server endpoint.
        * @private
        */
        async fetchFromEndpoint(endpoint, context = {}, reqParams = {})
        {
            let params = { ...endpoint.params, ...reqParams };

            if (this.crsfToken != null && !('csrfToken' in reqParams)) // Include CSRF token if set and not already in request
                params.csrfToken = this.crsfToken;

            // Resolve preFetch and postFetch if provided as string
            if (typeof endpoint.preFetch === 'string')
                endpoint.preFetch = $base.static.getMethod(endpoint.preFetch);
            if (typeof endpoint.postFetch === 'string')
                endpoint.postFetch = $base.static.getMethod(endpoint.postFetch);


            if (typeof endpoint.preFetch === 'function') // Execute preFetch hook
                params = await endpoint.preFetch(params, context) || params;

            let url = endpoint.absoluteURL ? endpoint.url
                : endpoint.url.startsWith('/')
                    ? `${location.origin}${endpoint.url}`
                    : `${location.origin}/${endpoint.url}`;

            const fetchOpts = {
                method: endpoint.method || 'GET',
                headers: endpoint.headers || {},
                credentials: endpoint.credentials || 'same-origin',
            };

            // Append query string for GET requests
            if (fetchOpts.method.toUpperCase() === 'GET' && params)
            {
                const query = new URLSearchParams(params).toString();
                if (query) url += (url.includes('?') ? '&' : '?') + query;
            }
            // Include body for POST requests
            else if (params)
            {
                fetchOpts.body = JSON.stringify(params);
                fetchOpts.headers['Content-Type'] = 'application/json';
            }

            let result;
            try
            {
                const parseResponse = async (res, responseType = 'json') =>
                {
                    switch (responseType)
                    {
                        case 'text':
                            return await res.text();
                        case 'blob':
                            return await res.blob();
                        case 'json':
                        default:
                            return await res.json();
                    }
                };

                if (endpoint.timeout)
                {
                    const controller = new AbortController(),
                        id = setTimeout(() => controller.abort(), endpoint.timeout);

                    fetchOpts.signal = controller.signal;

                    const res = await fetch(url, fetchOpts);
                    clearTimeout(id);

                    result = await parseResponse(res, endpoint.responseType);
                }
                else
                {
                    const res = await fetch(url, fetchOpts);
                    result = await parseResponse(res, endpoint.responseType);
                }
            }
            catch (ex)
            {
                console.error(`Failed to fetch from "${endpoint.label || endpoint.id}"` +
                    ((ex.name === 'AbortError') ? ` (timed out after ${endpoint.timeout} ms)` : ''), ex
                );
                result = { error: true, success: false, ex };
            }

            if (typeof endpoint.postFetch === 'function')  // Execute postFetch hook
                await endpoint.postFetch(result, context);

            return result;
        }

        #instantiateModules()
        {
            this.expressionEngine = new componyx.bindary_modules.ExpressionEngine();

            this.componentFactory = new ComponentFactory(this);
            this.draggable = new Draggable(this);
            this.buildPanelManager = new BuildPanelManager(this);
            this.configPanelManager = new ConfigPanelManager(this);
            this.dataBinder = new DataBinder(this);
            this.dataObserver = new DataObserver(this);
            this.renderer = new Renderer(this);
            this.ruleEngine = new RuleEngine(this);
            this.actionManager = new ActionManager(this);
            this.validationManager = new ValidationManager(this);
        }

        #getMaxGuidCounter(arr)
        {
            let max = 0;

            function traverse(array)
            {
                for (const item of array)
                {
                    if (!item) continue;

                    if (item.id)
                    {
                        const parts = item.id.split('_'),
                            num = parseInt(parts[parts.length - 1], 10);

                        if (!isNaN(num) && num > max)
                            max = num;
                    }

                    for (const key in item)
                    {
                        if (Array.isArray(item[key]))
                        {
                            traverse(item[key]);
                        }
                    }
                }
            }

            traverse(arr);
            return max + 1;
        }

        #focusFirst(fieldSets)
        {
            setTimeout(() =>
            {
                for (const fs of fieldSets)
                {
                    const fields = this.getFields(fs);
                    for (const field of fields)
                    {
                        if (!field.visible || field.disabled || $lib.isEmpty(field.inputType))
                            continue;

                        const el = this.#getFocusableInput(field.editElement);
                        if (el)
                        {
                            el.focus();
                            return;
                        }
                    }
                }
            });
        }

        #getFocusableInput(element)
        {
            const selector = `input:not([type="hidden"]), textarea, select, [contenteditable="true"]`,
                inputEl = element.querySelector(selector);

            return inputEl || null;
        }

        #setSectionButtonState(hasRules)
        {
            let activeButton,
                prev = this.renderer.ensurePrevButton(),
                next = this.renderer.ensureNextButton();

            if (this.isFirstSection())
                prev.hide();
            else
                prev.show();

            if (this.isLastSection())
            {
                next.hide();
                activeButton = this.submitButton;
            }
            else
            {
                this.submitButton.hide();
                activeButton = next;
            }

            activeButton.show();

            if (hasRules)
                activeButton.disable(); // will be enabled by validator when all fields are valid
            else
                activeButton.enable();
        }

        #setSectionDisplay(section, on = true)
        {
            const step = $lib(`#${this.id}_${section.id}_step`),
                cssClass = this.getCssClass(this.classOption.STEP_ACTIVE);

            section.visible = on;
            section.element.style.display = on ? '' : 'none';

            if (on)
                step.classList.add(cssClass);
            else
                step.classList.remove(cssClass);
        }

        #generateRepeatedLabel(originalLabel, index)
        {
            if ($lib.isEmpty(originalLabel))
                return '';

            const baseLabel = originalLabel.replace(/\s+\d+$/, '') || '';
            return `${baseLabel} ${index}`;
        }

        #setDefaultTemplates()
        {
            this.#setDefaultTemplate('Header');
            this.#setDefaultTemplate('FieldSetPanel');
            this.#setDefaultTemplate('FieldPanel');
            this.#setDefaultTemplate('ContentFieldPanel');
            this.#setDefaultTemplate('SpacerFieldPanel');
            this.#setDefaultTemplate('FieldOptionsPanel');
            this.#setDefaultTemplate('ValidationPanel');

            $lib.each(Form.InputTypeOption, (value) =>
            {
                if (value >= Form.InputTypeOption.MASKEDTEXTBOX)
                    this.#setDefaultTemplate(`ComponentPanel_${Form.InputTypeOption.getName(value)}`);
            });
        }

        #setDefaultTemplate(templateId)
        {
            const tags = this.getTemplateTags(templateId);

            if (!this.hasTemplate(templateId))
                this.addTemplate(templateId, tags.map(tag => `{${tag}}`).join(''), false);
        }

        getTemplateTags(templateId)
        {
            return this.#templateTags[templateId];
        }

        #preRender()
        {
            let script = [], fields = this.getFields(),
                comparer = function (type)
                {
                    return function (field) { return (!field.editTemplate && field.inputType == type) };
                };

            script.push('Menu');
            script.push('Button');
            script.push('ColorPicker');
            script.push('ColorButton');
            script.push('PanelBar');
            script.push('TabStrip');
            script.push('Validator');
            script.push('Dialog');
            script.push('TooltipManager');

            if (this.isBuildMode() || $lib.indexOf(fields, comparer(Form.InputTypeOption.MASKEDTEXTBOX)) > -1)
                script.push('MaskedTextBox');

            if (this.isBuildMode() || $lib.indexOf(fields, comparer(Form.InputTypeOption.NUMERICBOX)) > -1)
                script.push('NumericBox');

            if (this.isBuildMode() || $lib.indexOf(fields, comparer(Form.InputTypeOption.COMBOBOX)) > -1)
                script.push('ComboBox');

            if (this.isBuildMode() || $lib.indexOf(fields, comparer(Form.InputTypeOption.DATEPICKER)) > -1)
                script.push('DatePicker');

            if (this.isBuildMode() || $lib.indexOf(fields, comparer(Form.InputTypeOption.TIMEPICKER)) > -1)
                script.push('TimePicker');

            if (this.isBuildMode() || $lib.indexOf(fields, comparer(Form.InputTypeOption.SLIDER)) > -1)
                script.push('Slider');

            if (this.isBuildMode() || $lib.indexOf(fields, comparer(Form.InputTypeOption.FILEUPLOAD)) > -1)
                script.push('FileUpload');

            if (this.isBuildMode() || $lib.indexOf(fields, comparer(Form.InputTypeOption.EDITOR)) > -1 || fields.findIndex(f => f.type === Form.BlockTypeOption.CONTENT_FIELD) > -1)
                script.push('Editor');

            return ['Form', script];
        }

        #draw()
        {
            this.tooltipManager = this.componentFactory.createTooltipManager(this, this.id + '_TooltipManager', this.tooltipManagerId);
            this.colorPicker = this.componentFactory.createComponent(this, componyx.UI.ColorPicker, this.id + '_ColorPicker', this.colorPickerId, { popupView: true });
            this.renderer.createHeader();

            const panesEl = $lib.element(this, '', '', '', { "class": this.getCssClass(this.classOption.PANES) });

            if (this.isBuildMode())
            {
                this.#buildPane = $lib.element(panesEl, '', '', '', { "class": this.getCssClass(this.classOption.BUILD_PANE) });
                this.#createEdgeCommands(this.#buildPane);
            }
            else if (this.hasSections())
                this.renderer.createStepIndicator(panesEl);

            this.#formPane = $lib.element(panesEl, '', '', '', { "class": this.getCssClass(this.classOption.FORM_PANE) });

            if ($lib.isEmpty(this.fieldSets))
                this.ensureValidFieldSet(true);
            else if (this.fieldSets.some(fs => !(fs instanceof Form.Section || fs instanceof Form.FieldSet))) // rehydrate serialized objects to classes
            {
                this.rehydrate();
            }

            this.setParentReferences(this.fieldSets);
            this.#createFields();

            const model = (this.bindToCustomModel && this.customModelGetter) ? this.customModelGetter() : this.values;

            if (model)
                this.#restoreRepeatedFieldSets(model);

            if (this.isBuildMode())
            {
                this.#configPane = $lib.element(panesEl, '', '', '', { "class": this.getCssClass(this.classOption.CONFIG_PANE) });
                this.#createEdgeCommands(this.#configPane);

                this.buildPanelManager.createPanelBar(this.#buildPane, `${this.id}_BuildPanelBar`, this.buildPanelBarId, this.buildPanels);
                this.configPanelManager.createPanelBar(this.#configPane, `${this.id}_ConfigPanelBar`, this.configPanelBarId, this.configPanels);
            }

            if (!this.isBuildMode() && this.renderNavigationButtons)
                this.renderer.ensureSubmitButton();
        }

        ensureValidFieldSet(addDefaultField = false)
        {
            const createFieldSet = () =>
            {
                const fieldSet = new Form.FieldSet({
                    _keepOriginal: false,
                    label: this.labels.newItemPrefix + this.labels.fieldSet,
                    layout: Form.FieldSetLayoutOption.NONE,
                    fields: addDefaultField ? [
                        new Form.Field({
                            _keepOriginal: false,
                            label: this.labels.newItemPrefix + this.labels.field,
                            inputType: Form.InputTypeOption.TEXTBOX,
                            cssClassIcon: 'ico-text',
                            lineBreak: true
                        })
                    ] : []
                });

                this.ensureItemId(fieldSet);
                if (addDefaultField)
                {
                    this.ensureItemId(fieldSet.fields[0]);
                    this.autoNameCandidates.add(fieldSet.fields[0].id);
                }

                return fieldSet;
            };

            if ($lib.isEmpty(this.fieldSets))
            {
                this.fieldSets = [createFieldSet()];
                return;
            }

            // root contains Sections
            if (this.fieldSets.every(item => item.type === 'Section'))
            {
                this.fieldSets.forEach(section =>
                {
                    if (!Array.isArray(section.fieldSets) || section.fieldSets.length === 0)
                    {
                        section.fieldSets = [createFieldSet()];
                    }
                });
            }
        }

        #restoreRepeatedFieldSets(model)
        {
            const fieldSets = this.getFieldSets() // all fieldsets flattened

            fieldSets.forEach(fs =>
            {
                if (!fs.repeatable || fs.repeatGroupId) return;

                const repeatedData = model[fs.id];

                if (Array.isArray(repeatedData) && repeatedData.length > 1)
                {
                    repeatedData.slice(1).forEach(() => this.addRepeatedFieldSet(fs));  // Skip index 0 (original fs)
                }
            });
        }

        #createEdgeCommands(container)
        {
            const isBuildPane = container === this.#buildPane,
                topLocation = isBuildPane ? Form.CommandLocationOption.BUILD_PANE_TOP : Form.CommandLocationOption.CONFIG_PANE_TOP,
                bottomLocation = isBuildPane ? Form.CommandLocationOption.BUILD_PANE_BOTTOM : Form.CommandLocationOption.CONFIG_PANE_BOTTOM,
                edgeCommands = this.commands.filter(cmd => cmd.location === topLocation || cmd.location === bottomLocation),
                topEl = $lib.element({ container, attrs: { class: this.getCssClass(this.classOption.EDGE_TOP) } }),
                bottomEl = $lib.element({ container, attrs: { class: this.getCssClass(this.classOption.EDGE_BOTTOM) } }),
                idPrefix = isBuildPane ? `${this.id}_command_build_edge_` : `${this.id}_command_config_edge_`;

            $lib.each(edgeCommands, (cmd, index) =>
            {
                cmd.id = cmd.id || `${idPrefix}${index}`;

                const containerEl = (cmd.location === topLocation) ? topEl : bottomEl;

                this.componentFactory.createButton(containerEl, cmd.id, cmd.buttonId, {
                    ...cmd,
                    shortcutScope: this,
                    primary: false,
                    transparent: false,
                    transparentBorder: false,
                    hasIcon: true,
                    showing: cmd.isVisible ? cmd.isVisible() : true
                });
            });
        }

        #createFields(fieldSets = this.fieldSets)
        {
            fieldSets.forEach((fs) =>
            {
                if (!fs.type)
                    fs.type = 'FieldSet';

                if (fs.type === 'Section')
                {
                    this.renderer.createSection(fs);
                    this.#createFields(fs.fieldSets);
                    fs.visible = false;
                    fs.element.style.display = 'none';
                }
                else
                {
                    let fieldPane = this.renderer.createFieldSet(fs);

                    if (fs.fieldSets && fs.fieldSets.length)
                        this.#createFields(fs.fieldSets);
                    else if (fs.fields)
                    {
                        fs.fields.forEach((field) =>
                        {
                            if (!field.type)
                            {
                                field.type = 'Field';

                                if (field.inputType == undefined)
                                    field.inputType = Form.InputTypeOption.TEXTBOX;
                            }

                            if (!field.cssClassIcon || !field.cssClass) // field loaded from data (not dragged from a BuildBlock), backfill from the matching build block
                            {
                                const buildBlock = this.buildBlocks.find(b =>
                                    (field.type === 'Field' && b.blockType === Form.BlockTypeOption.FIELD && b.inputType === field.inputType) ||
                                    (field.type === 'ContentField' && b.blockType === Form.BlockTypeOption.CONTENT_FIELD) ||
                                    (field.type === 'SpacerField' && b.blockType === Form.BlockTypeOption.SPACER_FIELD)
                                );

                                if (buildBlock)
                                {
                                    field.cssClassIcon = field.cssClassIcon || buildBlock.cssClassIcon;
                                    field.cssClass = field.cssClass || buildBlock.cssClass;
                                }
                            }

                            this.renderer.createField(this.ensureItemId(field), fieldPane);
                        });
                    }
                }
            });
        }

        getId(item, suffix)
        {
            return `${this.id}_${item.id}_${suffix.toLowerCase()}`;
        }

        #dispose(removeElement)
        {
            if (this.renderState < $base.static.RenderState.RENDERING)
                return;

            this.removeEventListener('keydown', this.#undoRedoHandler, { capture: true });
            this.autoNameCandidates = new Set();

            this.ruleEngine?.destroy();
            this.draggable?.destroy();
            this.dataBinder?.destroy(removeElement);
            this.dataObserver?.destroy();
            this.renderer?.destroy();
            this.configPanelManager?.destroy();
            this.validationManager?.destroy();

            this.deselectSection();
            this.deselectFieldSet();
            this.deselectField();
            this.#disposeFields();

            this.#removeRepeatedFieldSets();
            this.values = {};
            this.actionManager = null;
            this.buildPanelManager = null;
            this.draggable = null;
            this.dataBinder = null;
            this.dataObserver = null;
            this.renderer = null;
            this.ruleEngine = null;
            this.configPanelManager = null;
            this.componentFactory = null;
            this.validationManager = null;
            this.ended = false;
        }

        #removeRepeatedFieldSets()
        {
            if (!this.repeatedFieldSets?.length)
                return;

            const repeatedIds = new Set(this.repeatedFieldSets.map(fs => fs.id));

            const removeFromTree = (fieldSets) =>
            {
                for (let index = fieldSets.length - 1; index >= 0; index--)
                {
                    const fs = fieldSets[index];

                    if (repeatedIds.has(fs.id))
                        fieldSets.splice(index, 1);
                    else if (Array.isArray(fs.fieldSets) && fs.fieldSets.length)
                        removeFromTree(fs.fieldSets);
                }
            };

            removeFromTree(this.fieldSets);
            this.repeatedFieldSets = [];
        }

        #disposeFields()
        {
            const disposeFieldSet = (fs) =>
            {
                fs.fields?.forEach((field) =>
                {
                    field.element = null;
                    field.viewElement = null;
                    field.editElement = null;
                    field.lineBreakElement = null;
                });

                fs.fieldSets?.forEach(disposeFieldSet);
                fs.element = null;

                if (fs.lineBreakElement)
                    fs.lineBreakElement = null;
            };

            this.fieldSets?.forEach(disposeFieldSet);
        }
    }

    Form.CommandLocationOption = Types.CommandLocationOption;
    Form.BlockTypeOption = Types.BlockTypeOption;
    Form.InputTypeOption = Types.InputTypeOption;
    Form.DisplayModeOption = Types.DisplayModeOption;
    Form.FieldSetLayoutOption = Types.FieldSetLayoutOption;
    Form.RuleCaseTriggerOption = Types.RuleCaseTriggerOption;
    Form.RuleCaseRunVisibilityOption = Types.RuleCaseRunVisibilityOption;
    Form.RuleComparisonOperatorOption = Types.RuleComparisonOperatorOption;
    Form.FieldRole = Types.FieldRole;
    Form.ServerEndpoint = Types.ServerEndpoint;
    Form.DataSource = Types.DataSource;
    Form.BuildBlock = Types.BuildBlock;
    Form.Section = Types.Section;
    Form.FieldSet = Types.FieldSet;
    Form.Field = Types.Field;
    Form.FieldOption = Types.FieldOption;
    Form.ContentField = Types.ContentField;
    Form.SpacerField = Types.SpacerField;
    Form.ComponentSettings = Types.ComponentSettings;
    Form.ValidationSettings = Types.ValidationSettings;
    Form.Command = Types.Command;
    Form.RuleCase = Types.RuleCase;
    Form.RuleGroup = Types.RuleGroup;
    Form.Rule = Types.Rule;
    Form.Action = Types.Action;

    // Preserve HTMLElement prototype and extend it with $base.methods
    //Object.assign(Form.prototype, $base.methods);
    Object.assign(Form.prototype, Object.fromEntries(Object.entries($base.methods).filter(([key]) => !['render', 'postRender', 'destroy', 'getCssClass'].includes(key))));


    // Restore the constructor reference
    Form.prototype.constructor = Form;
    componyx.UI.Form = Form;
    // Define the custom element
    customElements.define(`${$UI.tagPrefix}${Form.name.toLowerCase()}`, Form);
})();