declare namespace componyx
{
    namespace UI
    {
        /**
         * <p>Namespace for form modules.</p>
         */
        namespace form_modules
        {
            /**
             * <p>Promise that resolves when all form modules are loaded asynchronously.</p>
             */
            var loaded: Promise<void>;
        }

        namespace Form
        {
            /**
             * @property newItemPrefix - <p>= New                                                                   - Gets or sets the prefix used when a new type is created without a custom label.</p>
             * @property addItemPrefix - <p>= Add                                                                   - Gets or sets the prefix used for adding an item. The type description of the item is used as suffix.</p>
             * @property removeItemPrefix - <p>= Remove                                                                - Gets or sets the prefix used for removing an item. The type description of the item is used as suffix.</p>
             * @property applyToPrefix - <p>= Apply to                                                              - Gets or sets the prefix used for apply to. The type description of the item is used as suffix.</p>
             * @property labelPlaceholder - <p>= Enter a label                                                         - Gets or sets the placeholder to display when a label is empty.</p>
             * @property headerTitle - <p>= Form Header                                                           - Gets or sets the header title.</p>
             * @property sectionSwitch - <p>= Enable Sections                                                       - Gets or sets the label for the Sections switch.</p>
             * @property lineBreak - <p>= Line break                                                            - Gets or sets the label for the lineBreak setting in the FieldSet/Field/FieldOption configuration panel.</p>
             * @property visible - <p>= Visible                                                               - Gets or sets the label for the visible setting field in the FieldSet/Field configuration panel.</p>
             * @property disabled - <p>= Disabled                                                              - Gets or sets the label for the disabled setting in the FieldSet/Field/FieldOption configuration panel.</p>
             * @property readOnly - <p>= Readonly                                                              - Gets or sets the label for the readOnly setting in the Field configuration panel.</p>
             * @property selected - <p>= Selected                                                              - Gets or sets the label for the selected setting in the FieldOption configuration panel.</p>
             * @property tooltip - <p>= Tooltip                                                               - Gets or sets the label for the tooltip setting in the FieldSet/Field configuration panel.</p>
             * @property tooltipHint - <p>= Text shown via info icon                                              - Gets or sets the label for the tooltip setting hint in the FieldSet/Field configuration panel.</p>
             * @property value - <p>= Default Value                                                         - Gets or sets the label for the value setting in the Field- and Component- configuration panels.</p>
             * @property minValue - <p>= Minimum Value                                                         - Gets or sets the label for the minValue setting in the DatePicker/NumericBox/Slider/TimePicker configuration panel.</p>
             * @property maxValue - <p>= Maximum Value                                                         - Gets or sets the label for the maxValue setting in the DatePicker/NumericBox/Slider/TimePicker configuration panel.</p>
             * @property comboBoxDefaultHint - <p>= - Select -                                                            - Gets or sets the label for the ComboBox placeholder.</p>
             * @property section - <p>= Section                                                               - Gets or sets the label used to describe a section.</p>
             * @property fieldSet - <p>= Field Set                                                             - Gets or sets the label used to describe a field set.</p>
             * @property fieldSets - <p>= Field Sets                                                            - Gets or sets the label used to describe field sets.</p>
             * @property fieldPaneEmptyHint - <p>= Drag a field here...                                                  - Gets or sets the message to display when a field pane of a field set is empty.</p>
             * @property fieldSetId - <p>= ID                                                                    - Gets or sets the label for the id read-only setting field in the FieldSet configuration panel.</p>
             * @property fieldSetLayout - <p>= Layout                                                                - Gets or sets the label for the layout setting field in the FieldSet configuration panel.</p>
             * @property fieldSetLayoutNone - <p>= None                                                                  - Gets or sets the label for the 'None' option of the Layout dropdown in the FieldSet configuration panel.</p>
             * @property fieldSetLayoutDefault - <p>= Default                                                               - Gets or sets the label for the 'Default' option of the Layout dropdown in the FieldSet configuration panel.</p>
             * @property fieldSetLayoutBannered - <p>= Bannered                                                              - Gets or sets the label for the 'Bannered' option of the Layout dropdown in the FieldSet configuration panel.</p>
             * @property fieldSetLabelDisplay - <p>= Label Display (this group)                                            - Gets or sets the label for the label display setting in the FieldSet configuration panel.</p>
             * @property fieldSetRepeatable - <p>= Repeatable                                                            - Gets or sets the label for the repeatable setting field in the FieldSet configuration panel.</p>
             * @property fieldSetMaxRepeats - <p>= Max Repeats                                                           - Gets or sets the label for the maximum repeats setting field in the FieldSet configuration panel.</p>
             * @property fieldSetRepeatLabel - <p>= Repeat Label                                                          - Gets or sets the label for the repeat label setting field in the FieldSet configuration panel.</p>
             * @property fieldSetRepeatButton - <p>= Add Another                                                           - Gets or sets the label for the button to add a repeated field set if the field set does not have a label, otherwise addItemPrefix + label are used.</p>
             * @property field - <p>= Field                                                                 - Gets or sets the label used to describe a field.</p>
             * @property fields - <p>= Fields                                                                - Gets or sets the label used to describe fields.</p>
             * @property fieldName - <p>= Field Name                                                            - Gets or sets the label for the name setting in the Field configuration panel.</p>
             * @property fieldPlaceholder - <p>= Placeholder                                                           - Gets or sets the label for the placeholder setting in the Field configuration panel.</p>
             * @property fieldPlaceholderHint - <p>= Text shown when empty                                                 - Gets or sets the label for the placeholder setting hint in the Field configuration panel.</p>
             * @property fieldWidth - <p>= Width                                                                 - Gets or sets the label for the width setting in the Field configuration panel.</p>
             * @property fieldWidthHint - <p>= - Select option or type a value -                                     - Gets or sets the label for the width setting hint in the Field configuration panel.</p>
             * @property fieldWidthTooltip - <p>Gets or sets the label for the width setting tooltip in the Field configuration panel.</p>
             * @property fieldWidthAuto - <p>= Auto (360px)                                                          - Gets or sets the label for the 'Auto' option of the fieldWidth dropdown in the Field configuration panel.</p>
             * @property fieldWidth1PerRow - <p>= 100% (1 field per row)                                                - Gets or sets the label for the '100%' option of the fieldWidth dropdown in the Field configuration panel.</p>
             * @property fieldWidth2PerRow - <p>= 50% (2 fields per row)                                                - Gets or sets the label for the '50%' option of the fieldWidth dropdown in the Field configuration panel.</p>
             * @property fieldWidth3PerRow - <p>= 33% (3 fields per row)                                                - Gets or sets the label for the '33%' option of the fieldWidth dropdown in the Field configuration panel.</p>
             * @property fieldWidth4PerRow - <p>= 25% (4 fields per row)                                                - Gets or sets the label for the '25%' option of the fieldWidth dropdown in the Field configuration panel.</p>
             * @property fieldRole - <p>= Role                                                                  - Gets or sets the label for the role setting in the Field configuration panel.</p>
             * @property fieldRoleTooltip - <p>Gets or sets the label for the role setting tooltip in the Field configuration panel.</p>
             * @property fieldLabelDisplay - <p>= Label Display                                                         - Gets or sets the label for the label display setting in the Field configuration panel.</p>
             * @property fieldLabelDisplayAbove - <p>= Above                                                                 - Gets or sets the label for the 'Above' label display option.</p>
             * @property fieldLabelDisplayBefore - <p>= Before                                                                - Gets or sets the label for the 'Before' label display option.</p>
             * @property fieldLabelDisplayFloating - <p>= Floating                                                              - Gets or sets the label for the 'Floating' label display option.</p>
             * @property fieldLabelDisplayInside - <p>= Inside                                                                - Gets or sets the label for the 'Inside' label display option.</p>
             * @property fieldMoreSettings - <p>= More Settings...                                                      - Gets or sets the label for the more settings button in the Field configuration panel.</p>
             * @property fieldInlineOptions - <p>= Inline Options                                                        - Gets or sets the label for the inline options setting in the Field Options configuration panel.</p>
             * @property fieldOptionWidth - <p>= Option Width                                                          - Gets or sets the label for the option width setting in the Field Options configuration panel.</p>
             * @property fieldOptionWidthAuto - <p>= Auto                                                                  - Gets or sets the label for the 'Auto' option of the optionWidth dropdown in the Field Options configuration panel.</p>
             * @property fieldOptionWidth2PerRow - <p>= 50% (2 items per row)                                                 - Gets or sets the label for the '50%' option of the optionWidth dropdown in the Field Options configuration panel.</p>
             * @property fieldOptionWidth3PerRow - <p>= 33% (3 items per row)                                                 - Gets or sets the label for the '33%' option of the optionWidth dropdown in the Field Options configuration panel.</p>
             * @property fieldOptionWidth4PerRow - <p>= 25% (4 items per row)                                                 - Gets or sets the label for the '25%' option of the optionWidth dropdown in the Field Options configuration panel.</p>
             * @property fieldOption - <p>= Option                                                                - Gets or sets the label used to describe a field option.</p>
             * @property fieldOptions - <p>= Options                                                               - Gets or sets the label used to describe field options.</p>
             * @property fieldOptionValue - <p>= Option Value                                                          - Gets or sets the label used to describe a field option value.</p>
             * @property fieldOptionsType - <p>= Options Type                                                          - Gets or sets the label for the options type setting in the Field Option configuration panel.</p>
             * @property fieldOptionsTypeStatic - <p>= Static                                                                - Gets or sets the label for the 'Static' options of the option type radio button in the Field Options configuration panel.</p>
             * @property fieldOptionsTypeDataSource - <p>= Data Source                                                           - Gets or sets the label for the 'DataSource' options of the option type radio button in the Field Options configuration panel.</p>
             * @property fieldOptionLabelHeader - <p>= Label                                                                 - Gets or sets the label for the label header of a field-option.</p>
             * @property fieldOptionValueHeader - <p>= Value                                                                 - Gets or sets the label for the value header of a field-option.</p>
             * @property fieldOptionSelectedHeader - <p>= Selected                                                              - Gets or sets the label for the selected header of a field-option.</p>
             * @property fieldOptionDisabledHeader - <p>= Disabled                                                              - Gets or sets the label for the disabled header of a field-option.</p>
             * @property dataSourceId - <p>= Data Source ID                                                        - Gets or sets the label for the data source id setting in the Field Options configuration panel.</p>
             * @property dataSourcePreview - <p>= Data Source Preview                                                   - Gets or sets the label for the data source preview setting in the Field Options configuration panel.</p>
             * @property validationRequired - <p>= Required                                                              - Gets or sets the label for the required setting in the Validation configuration panel.</p>
             * @property validationDataType - <p>= Data Type                                                             - Gets or sets the label for the dataType setting in the Validation configuration panel.</p>
             * @property validationDataTypeInteger - <p>= Integer                                                               - Gets or sets the label for the 'Integer' option of the dataType dropdown in the Validation configuration panel.</p>
             * @property validationDataTypeFloat - <p>= Float                                                                 - Gets or sets the label for the 'Float' option of the dataType dropdown in the Validation configuration panel.</p>
             * @property validationDataTypeDateTime - <p>= DateTime                                                              - Gets or sets the label for the 'DateTime' option of the dataType dropdown in the Validation configuration panel.</p>
             * @property validationDataTypeEmail - <p>= Email                                                                 - Gets or sets the label for the 'Email' option of the dataType dropdown in the Validation configuration panel.</p>
             * @property validationDataTypeURL - <p>= URL                                                                   - Gets or sets the label for the 'URL' option of the dataType dropdown in the Validation configuration panel.</p>
             * @property validationDataTypeSource - <p>= Source                                                                - Gets or sets the label for the 'Source' option of the DataType dropdown in the Validation configuration panel.</p>
             * @property validationPattern - <p>= Pattern                                                               - Gets or sets the label for the pattern setting in the Validation configuration panel.</p>
             * @property validationPatternHint - <p>= Regular expression (e.g. ^[0-9]+$)                                    - Gets or sets the label for the pattern setting hint in the Validation configuration panel.</p>
             * @property validationLength - <p>= Length                                                                - Gets or sets the label for the length setting in the Validation configuration panel.</p>
             * @property validationMinLengthHint - <p>= Min Length                                                            - Gets or sets the label for the min length setting hint in the Validation configuration panel.</p>
             * @property validationMaxLengthHint - <p>= Max Length                                                            - Gets or sets the label for the max length setting hint in the Validation configuration panel.</p>
             * @property validationRange - <p>= Range                                                                 - Gets or sets the label for the range setting in the Validation configuration panel.</p>
             * @property validationMinRangeHint - <p>= Min Range                                                             - Gets or sets the label for the min range setting hint in the Validation configuration panel.</p>
             * @property validationMaxRangeHint - <p>= Max Range                                                             - Gets or sets the label for the max range setting hint in the Validation configuration panel.</p>
             * @property validationCompare - <p>= Compare To                                                            - Gets or sets the label for the compare setting in the Validation configuration panel.</p>
             * @property validatorMessage_required - <p>= {field} is required.                                                  - Gets or sets the label for required field validation error messages.</p>
             * @property validatorMessage_range - <p>= {field} must be between {min} and {max}.                              - Gets or sets the label for numeric range validation error messages.</p>
             * @property validatorMessage_length - <p>= {field} must be between {min} and {max} characters long.              - Gets or sets the label for minimum/maximum length validation error messages.</p>
             * @property validatorMessage_integer - <p>= {field} must be a valid number.                                       - Gets or sets the label for integer data type validation error messages.</p>
             * @property validatorMessage_float - <p>= {field} must be a valid decimal number.                               - Gets or sets the label for float data type validation error messages.</p>
             * @property validatorMessage_datetime - <p>= {field} must be a valid date.                                         - Gets or sets the label for datetime data type validation error messages.</p>
             * @property validatorMessage_email - <p>= {field} must be a valid email address.                                - Gets or sets the label for email data type validation error messages.</p>
             * @property validatorMessage_url - <p>= {field} must be a valid URL.                                          - Gets or sets the label for URL data type validation error messages.</p>
             * @property validatorMessage_source - <p>= {field} must be a valid source.                                       - Gets or sets the label for source data type validation error messages.</p>
             * @property validatorMessage_compare - <p>= {field} must be {operator} {compareField}.                            - Gets or sets the label for comparison validation error messages.</p>
             * @property validatorMessage_pattern - <p>= {field} has an invalid format.                                        - Gets or sets the label for regex/pattern validation error messages.</p>
             * @property ruleCase - <p>= Rule Case                                                             - Gets or sets the label used to describe a rule case.</p>
             * @property ruleGroup - <p>= Rule Group                                                            - Gets or sets the label used to describe a rule group.</p>
             * @property ruleCaseHeader - <p>= Rule Case                                                             - Gets or sets the label for the rule case header in the Rules configuration panel.</p>
             * @property ruleCaseTrigger - <p>= Case Trigger                                                          - Gets or sets the label for the rule case trigger setting in the Rules configuration panel.</p>
             * @property ruleCaseRunVisibility - <p>= Run When                                                              - Gets or sets the label for the rule case run visibility setting in the Rules configuration panel.</p>
             * @property ruleGroupConnector - <p>= Group Connector                                                       - Gets or sets the label for the rule group connector setting in the Rules configuration panel.</p>
             * @property ruleGroupsEmptyHint - <p>= Actions will fire unconditionally                                     - Gets or sets the message to display when the rule groups container element is empty.</p>
             * @property actionsHeader - <p>= Actions                                                               - Gets or sets the label for the actions header in the Rules configuration panel.</p>
             * @property ruleFieldHint - <p>= - Field -                                                             - Gets or sets the label for the rule field setting hint in the Rules configuration panel.</p>
             * @property ruleComparisonOperatorHint - <p>= - Condition -                                                         - Gets or sets the label for the rule comparison operator hint in the Rules configuration panel.</p>
             * @property operator_and - <p>= AND                                                                   - Gets or sets the label for the AND logical operator.</p>
             * @property operator_or - <p>= OR                                                                    - Gets or sets the label for the OR logical operator.</p>
             * @property operator_equal - <p>= Equal                                                                 - Gets or sets the label for the equal operator.</p>
             * @property operator_not_equal - <p>= Not Equal                                                             - Gets or sets the label for the not equal operator.</p>
             * @property operator_less_than - <p>= Less Than                                                             - Gets or sets the label for the less than operator.</p>
             * @property operator_less_than_or_equal - <p>= Less Than Or Equal                                                    - Gets or sets the label for the less than or equal operator.</p>
             * @property operator_greater_than_or_equal - <p>= Greater Than Or Equal                                                 - Gets or sets the label for the greater than or equal operator.</p>
             * @property operator_greater_than - <p>= Greater Than                                                          - Gets or sets the label for the greater than operator.</p>
             * @property operator_contains - <p>= Contains                                                              - Gets or sets the label for the contains operator.</p>
             * @property operator_not_contains - <p>= Does Not Contain                                                      - Gets or sets the label for the not contains operator.</p>
             * @property operator_starts_with - <p>= Starts With                                                           - Gets or sets the label for the starts with operator.</p>
             * @property operator_ends_with - <p>= Ends With                                                             - Gets or sets the label for the ends with operator.</p>
             * @property operator_empty - <p>= Empty                                                                 - Gets or sets the label for the empty operator.</p>
             * @property operator_not_empty - <p>= Not Empty                                                             - Gets or sets the label for the not empty operator.</p>
             * @property operator_visible - <p>= Visible                                                               - Gets or sets the label for the visible operator.</p>
             * @property operator_hidden - <p>= Hidden                                                                - Gets or sets the label for the hidden (not visible) operator.</p>
             * @property operator_enabled - <p>= Enabled                                                               - Gets or sets the label for the enabled operator.</p>
             * @property operator_disabled - <p>= Disabled                                                              - Gets or sets the label for the disabled operator.</p>
             * @property operator_required - <p>= Required                                                              - Gets or sets the label for the required operator.</p>
             * @property operator_optional - <p>= Optional                                                              - Gets or sets the label for the optional operator.</p>
             * @property trigger_always - <p>= Always                                                                - Gets or sets the label for the always rule case trigger.</p>
             * @property trigger_change - <p>= On Field Change                                                       - Gets or sets the label for the change rule case trigger.</p>
             * @property trigger_init - <p>= On Form Load                                                          - Gets or sets the label for the init rule case trigger.</p>
             * @property trigger_show_section - <p>= On Show Section                                                       - Gets or sets the label for the show section rule case trigger.</p>
             * @property trigger_before_submit - <p>= Before Form Submit                                                    - Gets or sets the label for the before submit rule case trigger.</p>
             * @property trigger_submit_succeeded - <p>= After Successful Submit                                               - Gets or sets the label for the succeeded submit rule case trigger.</p>
             * @property trigger_submit_failed - <p>= After Failed Submit                                                   - Gets or sets the label for the failed submit rule case trigger.</p>
             * @property run_visibility_visible - <p>= Field is Visible                                                      - Gets or sets the label for the rule case run visibility 'visible' option.</p>
             * @property run_visibility_hidden - <p>= Field is Visible or Hidden                                            - Gets or sets the label for the rule case run visibility 'hidden' option.</p>
             * @property run_visibility_section_hidden - <p>= Section is Hidden                                                     - Gets or sets the label for the rule case run visibility 'section_hidden' option.</p>
             * @property action_value - <p>= Set Value                                                             - Gets or sets the label for the set field value action.</p>
             * @property action_expression - <p>= Set Value Expression                                                  - Gets or sets the label for the set field value expression action.</p>
             * @property action_feedback - <p>= Feedback Message                                                      - Gets or sets the label for the set field feedback value action.</p>
             * @property action_alert - <p>= Alert Dialog                                                          - Gets or sets the label for the set field alert value action.</p>
             * @property action_confirm - <p>= Confirmation Dialog                                                   - Gets or sets the label for the set field confirm value action.</p>
             * @property action_required - <p>= Set Required                                                          - Gets or sets the label for the set field required action.</p>
             * @property action_optional - <p>= Set Optional                                                          - Gets or sets the label for the set field optional action.</p>
             * @property action_hide - <p>= Hide                                                                  - Gets or sets the label for the hide field action.</p>
             * @property action_show - <p>= Show                                                                  - Gets or sets the label for the show field action.</p>
             * @property action_disable - <p>= Enable                                                                - Gets or sets the label for the disable field action.</p>
             * @property action_enable - <p>= Disable                                                               - Gets or sets the label for the enable field action.</p>
             * @property action_read - <p>= Read only                                                             - Gets or sets the label for the readonly field action.</p>
             * @property action_editable - <p>= Editable                                                              - Gets or sets the label for the editable field action.</p>
             * @property action_disable_next - <p>= Disable Next/Submit                                                   - Gets or sets the label for the disable next/submit button action.</p>
             * @property action_enable_next - <p>= Enable Next/Submit                                                    - Gets or sets the label for the disable next/submit button action.</p>
             * @property action_cancel - <p>= Cancel Submit                                                         - Gets or sets the label for the cancel submit action.</p>
             * @property action_show_section - <p>= Show Section                                                          - Gets or sets the label for the show section action.</p>
             * @property action_end - <p>= End Form                                                              - Gets or sets the label for the end form action.</p>
             * @property actionValueHint - <p>= Enter a Value                                                         - Gets or sets the label for the 'Set Value' action hint in the Rules configuration panel.</p>
             * @property actionExpressionHint - <p>= Enter an Expression                                                   - Gets or sets the label for the 'Set Expression' action in the Rules configuration panel.</p>
             * @property componentPanelHeader - <p>= {0} Configuration                                                     - Gets or sets the label for the component configuration panel header. The {0} tag gets replaced with the name of the component.</p>
             * @property comboBox - <p>= ComboBox                                                              - Gets or sets the label for the component's friendly name of the when the field input type is a ComboBox component.</p>
             * @property datePicker - <p>= DatePicker                                                            - Gets or sets the label for the component's friendly name of the when the field input type is a DatePicker component.</p>
             * @property editor - <p>= Editor                                                                - Gets or sets the label for the component's friendly name of the when the field input type is a Editor component.</p>
             * @property fileUpload - <p>= FileUpload                                                            - Gets or sets the label for the component's friendly name of the when the field input type is a FileUpload component.</p>
             * @property maskedTextBox - <p>= MaskedTextBox                                                         - Gets or sets the label for the component's friendly name of the when the field input type is a MaskedTextBox component.</p>
             * @property numericBox - <p>= NumericBox                                                            - Gets or sets the label for the component's friendly name of the when the field input type is a NumericBox component.</p>
             * @property slider - <p>= Slider                                                                - Gets or sets the label for the component's friendly name of the when the field input type is a Slider component.</p>
             * @property timePicker - <p>= TimePicker                                                            - Gets or sets the label for the component's friendly name of the when the field input type is a TimePicker component.</p>
             * @property multiSelect - <p>= Enable Multi-Selection                                                - Gets or sets the label for the multiSelect setting in the ComboBox configuration panel.</p>
             * @property multiSelectTagging - <p>= Selections as Tags                                                    - Gets or sets the label for the multiSelectTagging setting in the ComboBox configuration panel.</p>
             * @property allowInput - <p>= Allow Typing                                                          - Gets or sets the label for the allowInput setting in the ComboBox configuration panel.</p>
             * @property today - <p>= Default to Today                                                      - Gets or sets the label for the today setting in the DatePicker configuration panel.</p>
             * @property allowedDates - <p>= Allow Listed Dates                                                    - Gets or sets the label for the allowedDates setting in the DatePicker configuration panel.</p>
             * @property disallowDates - <p>= Disallow Listed Dates                                                 - Gets or sets the label for the disallowDates setting in the DatePicker configuration panel.</p>
             * @property precision - <p>= Decimal Precision                                                     - Gets or sets the label for the precision setting in the NumericBox configuration panel.</p>
             * @property mask - <p>= Mask                                                                  - Gets or sets the label for the mask setting in the MaskedTextBox configuration panel.</p>
             * @property maskTooltip - <p>Gets or sets the label for the tooltip for the mask setting in the MaskedTextBox configuration panel.</p>
             * @property allowedCharacters - <p>= Allowed Characters                                                    - Gets or sets the label for the allowedCharacters setting in the MaskedTextBox configuration panel.</p>
             * @property allowedCharactersAlphanumeric - <p>= Alphanumeric                                                          - Gets or sets the label for the 'Alphanumeric' option of the allowedCharacters dropdown in the MaskedTextBox configuration panel.</p>
             * @property allowedCharactersDigits - <p>= Digits                                                                - Gets or sets the label for the 'Digits' option of the allowedCharacters dropdown in the MaskedTextBox configuration panel.</p>
             * @property allowedCharactersLetters - <p>= Letters                                                               - Gets or sets the label for the 'Letters' option of the allowedCharacters dropdown in the MaskedTextBox configuration panel.</p>
             * @property range - <p>= Enable Range Selection                                                - Gets or sets the label for the range setting in the Slider configuration panel.</p>
             * @property trackSize - <p>= Track Size                                                            - Gets or sets the label for the trackSize setting in the Slider configuration panel.</p>
             * @property trackSizeHint - <p>= 200px, 100%, 20ch - use CSS units                                     - Gets or sets the label for the trackSize setting hint in the Field configuration panel.</p>
             * @property startValue - <p>= Start Value                                                           - Gets or sets the label for the startValue setting in the Slider configuration panel.</p>
             * @property tickMarks - <p>= Tick Marks                                                            - Gets or sets the label for the tickMarks setting in the Slider configuration panel.</p>
             * @property incrementalValue - <p>= Step Interval (minutes)                                               - Gets or sets the label for the incrementalValue setting in the TimePicker configuration panel.</p>
             * @property allowedTimes - <p>= Allowed Times                                                         - Gets or sets the label for the allowedTimes setting in the TimePicker configuration panel.</p>
             * @property disallowTimes - <p>= Disallow Listed Times                                                 - Gets or sets the label for the disallowTimes setting in the TimePicker configuration panel.</p>
             * @property accept - <p>= Accept                                                                - Gets or sets the label for the accept setting in the FileUpload configuration panel.</p>
             * @property acceptHint - <p>= .png, .jpg, .jpeg                                                     - Gets or sets the label for the placeholder setting hint for the accept setting in the FileUpload configuration panel.</p>
             * @property maxFileSize - <p>=  Max. File Size (KB)                                                  - Gets or sets the label for the maxFileSize setting in the FileUpload configuration panel.</p>
             * @property maxFiles - <p>=  Max. Files                                                           - Gets or sets the label for the maxFiles setting in the FileUpload configuration panel.</p>
             * @property all - <p>= All Options                                                           - Gets or sets the label for the all setting in the Editor configuration panel.</p>
             * @property block - <p>= Block styles                                                          - Gets or sets the label for the block setting in the Editor configuration panel.</p>
             * @property link - <p>= Links                                                                 - Gets or sets the label for the link setting in the Editor configuration panel.</p>
             * @property list - <p>= Lists                                                                 - Gets or sets the label for the list setting in the Editor configuration panel.</p>
             * @property special - <p>= Special Chars                                                         - Gets or sets the label for the special setting in the Editor configuration panel.</p>
             * @property margin - <p>= Margin                                                                - Gets or sets the label for the margin setting in the Content configuration panel.</p>
             * @property marginHint - <p>= 5px, 100% - use CSS units                                             - Gets or sets the label for the margin setting hint in the Content configuration panel.</p>
             * @property padding - <p>= Padding                                                               - Gets or sets the label for the padding setting in the Content configuration panel.</p>
             * @property paddingHint - <p>= 5px, 100% - use CSS units                                             - Gets or sets the label for the padding setting hint in the Content configuration panel.</p>
             * @property backgroundColor - <p>= Background color                                                      - Gets or sets the label for the backgroundColor setting in the Content configuration panel.</p>
             * @property borderWidth - <p>= Border width                                                          - Gets or sets the label for the borderWidth setting in the Content configuration panel.</p>
             * @property borderColor - <p>= Border color                                                          - Gets or sets the label for the borderColor setting in the Content configuration panel.</p>
             * @property borderRadius - <p>= Border radius                                                         - Gets or sets the label for the borderRadius setting in the Content configuration panel.</p>
             * @property borderRadiusHint - <p>= 5px, 100% - use CSS units                                             - Gets or sets the label for the borderRadius setting hint in the Content configuration panel.</p>
             * @property showDivider - <p>= Show Divider                                                          - Gets or sets the label for the showDivider setting in the Spacer configuration panel.</p>
             * @property height - <p>= Height                                                                - Gets or sets the label for the height setting in the Spacer configuration panel.</p>
             * @property heightHint - <p>= 10px, 2em - use CSS units                                             - Gets or sets the label for the height setting hint in the Spacer configuration panel.</p>
             * @property saveInProgress - <p>= Saving...                                                             - Gets or sets the label for the save-status when the save is in progress.</p>
             * @property saveSuccess - <p>= Saved...                                                              - Gets or sets the label for the save-status when the save is successful.</p>
             * @property saveFailed - <p>= Save failed                                                           - Gets or sets the label for the save-status when the save failed.</p>
             * @property alertDialogHeader - <p>= Alert                                                                 - Gets or sets the header label for the alert dialog.</p>
             * @property confirmDialogHeader - <p>= Confirmation                                                          - Gets or sets the header label for the confirmation dialog.</p>
             * @property previous - <p>= Previous                                                              - Gets or sets the label for the previous section button.</p>
             * @property next - <p>= Next                                                                  - Gets or sets the label for the next section button.</p>
             * @property submit - <p>= Submit                                                                - Gets or sets the label for the submit button.</p>
             */
            type LabelSettings = {
                [key: string]: string;
            };

            /**
             * <p>Internal CSS class name constants of the Form component.</p>
             */
            type ClassOption = Readonly<{
                BUILD_MODE: 'build-mode';
                PREVIEW_MODE: 'preview-mode';
                EDIT_MODE: 'edit-mode';
                VIEW_MODE: 'view-mode';
                FIXED_LAYOUT: 'fixed-layout';
                PANES: 'panes';
                BUILD_PANE: 'build-pane';
                CONFIG_PANE: 'config-pane';
                FORM_PANE: 'form-pane';
                FIELD_PANE: 'field-pane';
                PANE_HIDDEN: 'pane-hidden';
                EDGE_TOP: 'edge-top';
                EDGE_BOTTOM: 'edge-bottom';
                LINE_BREAK: 'line-break';
                VIEW_FIELD: 'view-field';
                EDIT_FIELD: 'edit-field';
                BUILD_FIELD: 'build-field';
                BUILD_MENU: 'build-menu';
                LABEL: 'label';
                REMOVE: 'remove';
                CLONE: 'clone';
                ADD: 'add';
                DISABLED: 'disabled';
                INVISIBLE: 'invisible';
                READONLY: 'readonly';
                FILLER: 'filler';
                BUILD_BLOCK: 'build-block';
                BUILD_BLOCK_INSERT: 'insert';
                FIELD_INDICATORS: 'field-indicators';
                ICON: 'icon';
                TOOLTIP_ICON: 'ico-question-mark';
                RULES_ICON: 'ico-chip';
                VALIDATOR_ICON: 'ico-validator';
                DRAG_GHOST: 'drag-ghost';
                DRAG_HANDLE: 'drag-handle';
                DRAGGING: 'dragging';
                DROPPABLE: 'droppable';
                DROP_LEFT: 'drop-left';
                DROP_RIGHT: 'drop-right';
                DROP_ABOVE: 'drop-above';
                DROP_BELOW: 'drop-below';
                DROP_INSIDE: 'drop-inside';
                DROP_DENIED: 'drop-denied';
                FIELD_SET: 'field-set';
                BANNERED: 'bannered';
                LAYOUTLESS: 'layoutless';
                SELECTED: 'selected';
                TITLE: 'title';
                SECTION_SWITCH: 'section-switch';
                COMMANDS: 'commands';
                SECTIONS: 'sections';
                SECTION_ADD: 'section-add';
                SECTION_REMOVE: 'section-remove icon ico-bin';
                SECTION_PREVIOUS: 'section-prev';
                SECTION_NEXT: 'section-next';
                STEP_INDICATOR: 'step-indicator';
                STEP: 'step';
                STEP_ACTIVE: 'step-active';
                SUBMIT: 'submit';
                CONFIG_CHOICE_GROUP: 'config-choice-group';
                MORE_SETTINGS: 'more-settings';
                FIELD_OPTIONS_TYPE: 'options-type';
                FIELD_OPTIONS: 'field-options';
                FIELD_OPTIONS_INLINE: 'options-inline';
                FIELD_OPTIONS_ROW: 'options-row';
                FIELD_OPTIONS_HEADER: 'option-header';
                FIELD_OPTIONS_ITEM: 'option-item';
                FIELD_OPTIONS_ITEM_NEW: 'option-new';
                FIELD_OPTIONS_ITEM_GHOST: 'option-item-ghost';
                ALLOWED_LIST: 'allowed-list';
                REPEATABLE: 'repeatable';
                REPEAT_ADD: 'repeat-add';
                REPEAT_REMOVE: 'repeat-remove';
                EMPTY: 'empty';
                FIELD_TOOLTIP: 'tooltip field-tooltip';
                SPACER: 'spacer';
                CONTENT: 'content';
                DIVIDER: 'divider';
                COMBOBOX_VAL_COMPARE_OPERATOR: 'val-compare-operator';
                COMBOBOX_VAL_COMPARE_FIELD: 'val-compare-field';
                COMBOBOX_LOGICAL_OPERATOR: 'logical-operator';
                COMBOBOX_RULE_FIELD: 'rule-field';
                COMBOBOX_RULE_COMPARISON_OPERATOR: 'rule-comparison-operator';
                COMBOBOX_ACTION: 'action';
                RULE_CASE: 'rule-case';
                RULE_CASE_TRIGGER: 'rule-case-trigger';
                RULE_CASE_RUN_VISIBILITY: 'rule-case-run-visibility';
                ACTIONS: 'actions';
                RULE_GROUPS: 'rule-groups';
                RULE_GROUP: 'rule-group';
                RULES: 'rules';
                RULE: 'rule';
                RULE_VALUE: 'rule-value';
                ACTION: 'action';
                ACTION_FOLLOW_UP: 'follow-up';
                ACTION_VALUE: 'action-value';
                EXPRESSION: 'expression';
                EXPRESSION_CONTROLS: 'expr-controls';
                FEEDBACK: 'feedback';
                VALIDATION_FEEDBACK: 'val-feedback';
                RULE_FEEDBACK: 'rule-feedback';
                SAVE_STATUS: 'save-status';
                SAVE_STATUS_BUSY: 'busy';
                SAVE_STATUS_SUCCESS: 'success';
                SAVE_STATUS_FAILED: 'failed';
                SPINNER: 'spinner';
            }>;

            /**
             * <p>Form CSS Variables.</p>
             * @property ["--fieldset-border-width"] - <p>Border width of fieldsets.</p>
             * @property ["--fieldset-drop-above-margin"] - <p>34px&quot;                                      - Margin above a drop target fieldset.</p>
             * @property ["--fieldset-bannered-drop-above-margin"] - <p>52px&quot;                             - Margin above a bannered drop target.</p>
             * @property ["--fieldset-nested-margin"] - <p>Margin for nested fieldsets.</p>
             * @property ["--droppable-margin"] - <p>Margin between droppable zones when dropping a field(set).</p>
             * @property ["--droppable-line-size"] - <p>Height of the droppable line.</p>
             * @property ["--build-pane-width"] - <p>15vw, 260px)&quot;                            - Width of the build pane.</p>
             * @property ["--config-pane-width"] - <p>25vw, 500px)&quot;                           - Width of the config pane.</p>
             * @property ["--header-height"] - <p>Height of the header.</p>
             * @property ["--fixed-layout-offset-top"] - <p>Top offset for fixed layout.</p>
             * @property ["--fixed-layout-offset-bottom"] - <p>Bottom offset for fixed layout.</p>
             * @property ["--fixed-layout-offset-left"] - <p>Left offset for fixed layout.</p>
             * @property ["--fixed-layout-offset-right"] - <p>Right offset for fixed layout.</p>
             * @property ["--fixed-layout-z-index"] - <p>Z-index for fixed layout elements.</p>
             */
            type CSSVariables = {
                "--fieldset-border-width"?: string;
                "--fieldset-drop-above-margin"?: string;
                "--fieldset-bannered-drop-above-margin"?: string;
                "--fieldset-nested-margin"?: string;
                "--droppable-margin"?: string;
                "--droppable-line-size"?: string;
                "--build-pane-width"?: string;
                "--config-pane-width"?: string;
                "--header-height"?: string;
                "--fixed-layout-offset-top"?: string;
                "--fixed-layout-offset-bottom"?: string;
                "--fixed-layout-offset-left"?: string;
                "--fixed-layout-offset-right"?: string;
                "--fixed-layout-z-index"?: string;
            };

            /**
             * @property dateFormat - <p>Gets or sets the input format for dates. Default: MM/dd/yyyy.</p>
             * @property decimalSeparator - <p>Gets or sets the decimal separator for numbers. Default: '.'.</p>
             * @property groupSeparator - <p>Gets or sets the group (thousands) separator for numbers. Default: ','.</p>
             */
            type FormatConfig = {
                dateFormat: string;
                decimalSeparator: string;
                groupSeparator: string;
            };

            /**
             * @property fieldSet - <p>The fieldset instance. Use <code>fieldSet.element</code> to access the fieldset's root element.</p>
             */
            type FieldSetEventArgs = {
                fieldSet: componyx.UI.Form.Field;
            };
            /**
             * @property field - <p>The field instance. Use <code>field.element</code> to access the field's root element.</p>
             * @property [option] - <p>The optional field option, only available for <code>onRenderEditFieldOption</code>.</p>
             */
            type FieldEventArgs = {
                field: componyx.UI.Form.Field;
                option?: componyx.UI.Form.FieldOption;
            };
            /**
             * @property item - <p>The dropped field or fieldSet.</p>
             */
            type DropFieldEventArgs = {
                item: componyx.UI.Form.Field | componyx.UI.Form.FieldSet;
            };
            /**
             * @property fieldSet - <p>The selected fieldSet.</p>
             */
            type SelectFieldSetEventArgs = {
                fieldSet: componyx.UI.Form.FieldSet;
            };
            /**
             * @property field - <p>The selected field.</p>
             */
            type SelectFieldEventArgs = {
                field: componyx.UI.Form.Field;
            };
            /**
             * @property sanitizer - <p>The created sanitizer class instance.</p>
             */
            type CreateSanitizerEventArgs = {
                sanitizer: componyx.base_modules.Sanitizer;
            };
            /**
             * <p>// empty additional fields besides form instance</p>
             */
            type BaseEventArgs = any;
            /**
             * @property values - <p>The submitted form values.</p>
             * @property result - <p>The submit result.
             * Custom onSubmit handler(s) must set <code>result.error</code> and <code>result.success</code> ONLY if the onSubmitEndpoint is not configured.
             * If the default endpoint is used, these flags are set automatically and handlers can safely ignore them.</p>
             * @property [result.error] - <p>A value indicating if an exception was thrown.</p>
             * @property [result.success] - <p>A value indicating if the completed action returned true (success) or false.</p>
             */
            type SubmitEventArgs = {
                values: any;
                result: {
                    error?: boolean;
                    success?: boolean;
                };
            };
            /**
             * @property result - <p>The save result.
             * Custom onSave handler(s) must set <code>result.error</code> and <code>result.success</code> ONLY if the onSaveEndpoint is not configured.
             * If the default endpoint is used, these flags are set automatically and handlers can safely ignore them.</p>
             * @property [result.error] - <p>A value indicating if an exception was thrown.</p>
             * @property [result.success] - <p>A value indicating if the completed action returned true (success) or false.</p>
             */
            type SaveEventArgs = {
                result: {
                    error?: boolean;
                    success?: boolean;
                };
            };
            /**
             * <p>Callback for fieldset events.</p>
             * @param form - <p>The form instance firing the event.</p>
             * @param eventArgs - <p>The event details.</p>
             */
            type FieldSetEventHandler = (form: componyx.UI.Form, eventArgs: componyx.UI.Form.FieldSetEventArgs) => void;
            /**
             * <p>Callback for field events.</p>
             * @param form - <p>The form instance firing the event.</p>
             * @param eventArgs - <p>The event details.</p>
             */
            type FieldEventHandler = (form: componyx.UI.Form, eventArgs: componyx.UI.Form.FieldEventArgs) => void;
            /**
             * <p>Callback for drop field events.</p>
             * @param form - <p>The form instance firing the event.</p>
             * @param eventArgs - <p>The event details.</p>
             */
            type DropFieldEventHandler = (form: componyx.UI.Form, eventArgs: componyx.UI.Form.DropFieldEventArgs) => void;
            /**
             * <p>Callback for select fieldset events.</p>
             * @param form - <p>The form instance firing the event.</p>
             * @param eventArgs - <p>The event details.</p>
             */
            type SelectFieldSetEventHandler = (form: componyx.UI.Form, eventArgs: componyx.UI.Form.SelectFieldSetEventArgs) => void;
            /**
             * <p>Callback for select field events.</p>
             * @param form - <p>The form instance firing the event.</p>
             * @param eventArgs - <p>The event details.</p>
             */
            type SelectFieldEventHandler = (form: componyx.UI.Form, eventArgs: componyx.UI.Form.SelectFieldEventArgs) => void;
            /**
             * <p>Callback for sanitizer creation events.</p>
             * @param form - <p>The form instance firing the event.</p>
             * @param eventArgs - <p>The event details.</p>
             */
            type CreateSanitizerEventHandler = (form: componyx.UI.Form, eventArgs: componyx.UI.Form.CreateSanitizerEventArgs) => void;
            /**
             * <p>Callback for base form events.</p>
             * @param form - <p>The form instance firing the event.</p>
             * @param [eventArgs] - <p>The event details (optional).</p>
             */
            type BaseEventHandler = (form: componyx.UI.Form, eventArgs?: componyx.UI.Form.BaseEventArgs) => void;
            /**
             * <p>Callback for form submit events.</p>
             * @param form - <p>The form instance firing the event.</p>
             * @param eventArgs - <p>The event details.</p>
             */
            type SubmitEventHandler = (form: componyx.UI.Form, eventArgs: componyx.UI.Form.SubmitEventArgs) => void;
            /**
             * <p>Callback for form save events.</p>
             * @param form - <p>The form instance firing the event.</p>
             * @param eventArgs - <p>The event details.</p>
             */
            type SaveEventHandler = (form: componyx.UI.Form, eventArgs: componyx.UI.Form.SaveEventArgs) => void;
            /**
             * @property onRenderFieldSet - <p>Fires when a fieldset is rendered.</p>
             * @property onRenderField - <p>Fires when a field is rendered.</p>
             * @property onRenderViewTemplate - <p>Fires when the view template is rendered.</p>
             * @property onRenderEditTemplate - <p>Fires when the edit template is rendered.</p>
             * @property onRenderEditFieldOption - <p>Fires when a field option is rendered. </p>
             * @property onUpdateFieldSet - <p>Fires when a fieldset is updated, minor changes that do not require full re-render.</p>
             * @property onUpdateField - <p>Fires when a field is updated, minor changes that do not require full re-render.</p>
             * @property onDropField - <p>Fires when a field or fieldSet is dropped from build pane onto the form.</p>
             * @property onSelectFieldSet - <p>Fires when a fieldSet is selected.</p>
             * @property onSelectField - <p>Fires when a field is selected.</p>
             * @property onCreateSanitizer - <p>Fires when the default HTML sanitizer is created, allowing optional configuration.</p>
             * @property onSave - <p>Fires when the form definition is saved in build mode.</p>
             * @property onSubmit - <p>Fires when the form values are submitted.</p>
             * @property onSubmitCanceled - <p>Fires when the form submit is canceled because of the rule case cancel submit action.</p>
             * @property onEndForm - <p>Fires when the form end action is executed.</p>
             */
            class FormEvents extends componyx.UI.base.Events<componyx.UI.Form>
            {
                constructor();
                /**
                 * <p>Fires when a fieldset is rendered.</p>
                */
                onRenderFieldSet: componyx.UI.base.Event<componyx.UI.Form, componyx.UI.Form.FieldSetEventArgs>;
                /**
                 * <p>Fires when a field is rendered.</p>
                */
                onRenderField: componyx.UI.base.Event<componyx.UI.Form, componyx.UI.Form.FieldEventArgs>;
                /**
                 * <p>Fires when the view template is rendered.</p>
                */
                onRenderViewTemplate: componyx.UI.base.Event<componyx.UI.Form, componyx.UI.Form.FieldEventArgs>;
                /**
                 * <p>Fires when the edit template is rendered.</p>
                */
                onRenderEditTemplate: componyx.UI.base.Event<componyx.UI.Form, componyx.UI.Form.FieldEventArgs>;
                /**
                 * <p>Fires when a field option is rendered. </p>
                */
                onRenderEditFieldOption: componyx.UI.base.Event<componyx.UI.Form, componyx.UI.Form.FieldEventArgs>;
                /**
                 * <p>Fires when a fieldset is updated, minor changes that do not require full re-render.</p>
                */
                onUpdateFieldSet: componyx.UI.base.Event<componyx.UI.Form, componyx.UI.Form.FieldSetEventArgs>;
                /**
                 * <p>Fires when a field is updated, minor changes that do not require full re-render.</p>
                */
                onUpdateField: componyx.UI.base.Event<componyx.UI.Form, componyx.UI.Form.FieldEventArgs>;
                /**
                 * <p>Fires when a field or fieldSet is dropped from build pane onto the form.</p>
                */
                onDropField: componyx.UI.base.Event<componyx.UI.Form, componyx.UI.Form.DropFieldEventArgs>;
                /**
                 * <p>Fires when a fieldSet is selected.</p>
                */
                onSelectFieldSet: componyx.UI.base.Event<componyx.UI.Form, componyx.UI.Form.SelectFieldSetEventArgs>;
                /**
                 * <p>Fires when a field is selected.</p>
                */
                onSelectField: componyx.UI.base.Event<componyx.UI.Form, componyx.UI.Form.SelectFieldEventArgs>;
                /**
                 * <p>Fires when the default HTML sanitizer is created, allowing optional configuration.</p>
                */
                onCreateSanitizer: componyx.UI.base.Event<componyx.UI.Form, componyx.UI.Form.CreateSanitizerEventArgs>;
                /**
                 * <p>Fires when the form definition is saved in build mode.</p>
                */
                onSave: componyx.UI.base.Event<componyx.UI.Form, componyx.UI.Form.SaveEventArgs>;
                /**
                 * <p>Fires when the form values are submitted.</p>
                */
                onSubmit: componyx.UI.base.Event<componyx.UI.Form, componyx.UI.Form.SubmitEventArgs>;
                /**
                 * <p>Fires when the form submit is canceled because of the rule case cancel submit action.</p>
                */
                onSubmitCanceled: componyx.UI.base.Event<componyx.UI.Form, componyx.UI.Form.SubmitEventArgs>;
                /**
                 * <p>Fires when the form end action is executed.</p>
                */
                onEndForm: componyx.UI.base.Event<componyx.UI.Form>;
            }

            /**
             * <p>Gets the value from the field.</p>
             * @param field - <p>The field instance.</p>
             */
            type CustomFieldGetter = (field: any) => any;
            /**
             * <p>Sets the value on the field.</p>
             * @param field - <p>The field instance.</p>
             * @param value - <p>The value to set.</p>
             */
            type CustomFieldSetter = (field: any, value: any) => void;
            /**
             * <p>Renders the field HTML and must call the callback when rendering is complete.</p>
             * @param form - <p>The form instance.</p>
             * @param field - <p>The field instance.</p>
             * @param element - <p>The container element to render into.</p>
             * @param isView - <p>A value indicating if the field is rendered in the view template instead of the edit template.</p>
             * @param callback - <p>Callback to invoke when rendering is done.</p>
             */
            type CustomFieldRenderer = (form: componyx.UI.Form, field: componyx.UI.Form.Field, element: HTMLElement, isView: boolean, callback: (...params: any[]) => any) => void;
            /**
             * <p>Updates &quot;minor&quot; properties without full re-render. Called when a property in <code>minorProps</code> changes.</p>
             * @param form - <p>The form instance.</p>
             * @param field - <p>The field instance.</p>
             */
            type CustomFieldUpdater = (form: componyx.UI.Form, field: componyx.UI.Form.Field) => void;
            /**
             * <p>Creates the configurable input value used in rules and set-value actions.</p>
             * @param form - <p>The form instance.</p>
             * @param field - <p>The field instance.</p>
             * @param target - <p>The target, either a rule or an action.</p>
             * @param container - <p>The container element in which to render the output.</p>
             */
            type CustomFieldRenderValueInput = (form: componyx.UI.Form, field: componyx.UI.Form.Field, target: componyx.UI.Form.Rule | componyx.UI.Form.Action, container: HTMLElement) => void;
            type CustomFieldConfig = {
                getter: componyx.UI.Form.CustomFieldGetter;
                setter?: componyx.UI.Form.CustomFieldSetter;
                renderer?: componyx.UI.Form.CustomFieldRenderer;
                updater?: componyx.UI.Form.CustomFieldUpdater;
                renderValueInput?: componyx.UI.Form.CustomFieldRenderValueInput;
                minorProps?: Set<string>;
                omitProps?: Set<string>;
            };
            /**
             * <p>A function that executes an action.</p>
             * @param supportsFieldSet - <p>A value indicating if the action can be applied to a FieldSet.</p>
             * @param mustAwait- - <p>A value indicating if the action must be awaited (blocks other actions until this action is completed).</p>
             * @param setValue - <p>A value indicating if the action sets the value of the related target field.</p>
             * @param setExpression - <p>A value indicating if the action sets the expression value of the related target field.</p>
             * @param label - <p>The text label of the action.</p>
             * @param execute - <p>The function to execute the action.</p>
             * @param [description] - <p>The optional desciption of the action, displayed in a tooltip.</p>
             */
            type ActionConfig = any;
            /**
             * <p>A function that executes an action.</p>
             * @param value - <p>The value associated with the action.</p>
             * @param target - <p>The field or fieldset on which the action is executed.</p>
             */
            type ActionExecutor = (value: any, target: componyx.UI.Form.Field | componyx.UI.Form.FieldSet) => void;
            /**
             * @property fieldSet - <p>The field set containing the target field.</p>
             * @property fieldSetIndex - <p>The index of the field set in the field set list.</p>
             * @property fieldIndex - <p>The index of the field.</p>
             * @property nextField - <p>The rendered field after the target field, or null if it's the last field.</p>
             * @property nextFieldSet - <p>The rendered field-set after the target field-set, or null if it's the last field-set.</p>
             * @property isLastField - <p>A value indicating if the target field is the last field in the field set.</p>
             * @property isLastFieldSet - <p>A value indicating if the target field-set is the last.</p>
             */
            type FieldContext = {
                fieldSet: componyx.UI.Form.FieldSet;
                fieldSetIndex: number;
                fieldIndex: number;
                nextField: componyx.UI.Form.Field;
                nextFieldSet: componyx.UI.Form.FieldSet;
                isLastField: boolean;
                isLastFieldSet: boolean;
            };

            /**
            * <p>The Form ComponentSettings class.</p>
            */
            class ComponentSettings extends BaseType
            {
            }
            type ExtraComponentSettings = {
                [key: string]: any;
            };

            /**
             * @property [multiSelect] - <p>Gets or sets a value indicating whether multiple items can be selected through checkboxes.</p>
             * @property [multiSelectTagging] - <p>Gets or sets a value indicating whether selected items are displayed as tags.</p>
             * @property [allowInput] - <p>Gets or sets a value indicating whether textual input is allowed.</p>
             */
            type ComboBoxSettings = ComponentSettings & ExtraComponentSettings & {
                multiSelect?: boolean;
                multiSelectTagging?: boolean;
                allowInput?: boolean;
            };
            /**
             * @property [today] - <p>Gets or sets a value indicating whether today should be used as initial selected date.</p>
             * @property [minValue] - <p>Gets or sets the minimum allowed date value.</p>
             * @property [maxValue] - <p>Gets or sets the maximum allowed date value.</p>
             * @property [allowedDates] - <p>Gets or sets a list of allowed calendar dates. Separate two date strings with a space to specify allowed range. When allowed dates are set, date input fields are rendered in readonly mode.</p>
             * @property [disallowDates] - <p>Gets or sets a value indicating if the dates specified in the dates property are disallowed instead of the default allowed.</p>
             */
            type DatePickerSettings = ComponentSettings & ExtraComponentSettings & {
                today?: boolean;
                minValue?: string | Date;
                maxValue?: string | Date;
                allowedDates?: String[] | Date[];
                disallowDates?: boolean;
            };
            /**
             * @property [mask] - <p>Gets or sets the text box mask pattern.</p>
             * @property [allowedCharacters] - <p>Gets or sets a value indicating which characters are allowed.</p>
             */
            type MaskedTextBoxSettings = ComponentSettings & ExtraComponentSettings & {
                mask?: string;
                allowedCharacters?: MaskedTextBox.AllowedCharactersOption;
            };
            /**
             * @property [minValue] - <p>Gets or sets the minimium allowed value.</p>
             * @property [maxValue] - <p>Gets or sets the maximum allowed value.</p>
             * @property [precision] - <p>Gets or sets the amount of decimal places.</p>
             */
            type NumericBoxSettings = ComponentSettings & ExtraComponentSettings & {
                minValue?: number;
                maxValue?: number;
                precision?: number;
            };
            /**
             * @property [range] - <p>Gets or sets a value indicating if the slider has a start- and end-handle to set a range.</p>
             * @property [startValue] - <p>Gets or sets the start value of the range slider.</p>
             * @property [minValue] - <p>Gets or sets the minimum value.</p>
             * @property [maxValue] - <p>Gets or sets the maximum value.</p>
             * @property [tickMarks] - <p>Gets or sets the amount of rendered tickmarks.</p>
             * @property [trackSize] - <p>Gets or sets the size of the slider track.</p>
             */
            type SliderSettings = ComponentSettings & ExtraComponentSettings & {
                range?: boolean;
                startValue?: number;
                minValue?: number;
                maxValue?: number;
                tickMarks?: number;
                trackSize?: number;
            };
            /**
             * @property [minValue] - <p>Gets or sets the minimum allowed time in format 'HH:MM'. Minutes must be divisible by 5.</p>
             * @property [maxValue] - <p>Gets or sets the maximum allowed time in format 'HH:MM'. Minutes must be divisible by 5.</p>
             * @property [incrementalValue] - <p>Gets or sets the incremental value in minutes. Minutes must be divisible by 5.</p>
             * @property [allowedTimes] - <p>Gets or sets a list of allowed clock times (format 'HH:MM'). Separate two date strings with a space to specify allowed range. When allowed times are set, date input fields are rendered in readonly mode.Gets or sets a list of allowed calendar dates.</p>
             * @property [disallowTimes] - <p>Gets or sets a value indicating if the times specified in the times property are disallowed instead of the default allowed.</p>
             */
            type TimePickerSettings = ComponentSettings & ExtraComponentSettings & {
                minValue?: string;
                maxValue?: string;
                incrementalValue?: string;
                allowedTimes?: String[];
                disallowTimes?: boolean;
            };
            /**
             * @property [accept] - <p>Gets or sets the comma-separated list of allowed file extensions (.png, .jpg, .jpeg) or MIME types (image/png or image/*).</p>
             * @property [maxFileSize] - <p>Gets or sets the max allowed file size in KB.</p>
             * @property [maxFiles] - <p>Gets or sets the max allowed file count.</p>
             */
            type FileUploadSettings = ComponentSettings & ExtraComponentSettings & {
                accept?: string;
                maxFileSize?: number;
                maxFiles?: number;
            };
            /**
             * @property [all] - <p>Gets or sets a value indicating whether all editor settings are enabled.</p>
             * @property [block] - <p>Gets or sets a value indicating whether changing block styles is enabled.</p>
             * @property [link] - <p>Gets or sets a value indicating whether editing links is enabled.</p>
             * @property [list] - <p>Gets or sets a value indicating whether editing UL/OL lists is enabled.</p>
             * @property [image] - <p>Gets or sets a value indicating whether editing images is enabled.</p>
             * @property [media] - <p>Gets or sets a value indicating whether editing media (video/audio) is enabled.</p>
             */
            type EditorSettings = ComponentSettings & ExtraComponentSettings & {
                all?: boolean;
                block?: boolean;
                link?: boolean;
                list?: boolean;
                image?: boolean;
                media?: boolean;
            };
            /**
             * <p>Command Location options</p>
             */
            enum CommandLocationOption
            {
                /**
                 * <p>Commands shown in the top header bar.</p>
                 */
                HEADER = 0,
                /**
                 * <p>Commands shown in the top-left corner of the form.</p>
                 */
                BUILD_PANE_TOP = 1,
                /**
                 * <p>Commands shown in the bottom-left corner of the form.</p>
                 */
                BUILD_PANE_BOTTOM = 2,
                /**
                 * <p>Commands shown in the top-right corner of the form.</p>
                 */
                CONFIG_PANE_TOP = 3,
                /**
                 * <p>Commands shown in the bottom-right corner of the form.</p>
                 */
                CONFIG_PANE_BOTTOM = 4
            }
            /**
             * <p>Block Type options</p>
             */
            enum BlockTypeOption
            {
                /**
                 * <p>A container for grouping related fields.</p>
                 */
                FIELD_SET = 0,
                /**
                 * <p>A standard input field.</p>
                 */
                FIELD = 1,
                /**
                 * <p>A content block for displaying rich text.</p>
                 */
                CONTENT_FIELD = 2,
                /**
                 * <p>A spacer field.</p>
                 */
                SPACER_FIELD = 3
            }
            namespace BlockTypeOption
            {
                /**
                 * <p>Gets the PascalCase name of the block type (e.g. ContentField).</p>
                 * @param value - <p>The enum value.</p>
                 */
                function getName(value: componyx.UI.Form.BlockTypeOption): string;
            }
            /**
             * <p>Input Type options</p>
             */
            enum InputTypeOption
            {
                /**
                 * <p>Simple single-line text input.</p>
                 */
                TEXTBOX = 0,
                /**
                 * <p>Multi-line text input.</p>
                 */
                TEXTAREA = 1,
                /**
                 * <p>Checkbox input, for binary options.</p>
                 */
                CHECKBOX = 2,
                /**
                 * <p>Radio button input, for selecting one option from a group.</p>
                 */
                RADIO = 3,
                /**
                 * <p>Checkbox as switch input, for selecting one option from a group.</p>
                 */
                SWITCH = 4,
                /**
                 * <p>Textbox input with masking (componyx.UI.MaskedTextBox).</p>
                 */
                MASKEDTEXTBOX = 5,
                /**
                 * <p>Input for numeric values (componyx.UI.NumericBox).</p>
                 */
                NUMERICBOX = 6,
                /**
                 * <p>Dropdown input (componyx.UI.ComboBox).</p>
                 */
                COMBOBOX = 7,
                /**
                 * <p>Date selector (componyx.UI.DatePicker).</p>
                 */
                DATEPICKER = 8,
                /**
                 * <p>Time selector (componyx.UI.TimePicker).</p>
                 */
                TIMEPICKER = 9,
                /**
                 * <p>Range slider (componyx.UI.Slider).</p>
                 */
                SLIDER = 10,
                /**
                 * <p>File upload control (componyx.UI.FileUpload).</p>
                 */
                FILEUPLOAD = 11,
                /**
                 * <p>Rich text editor (componyx.UI.Editor).</p>
                 */
                EDITOR = 12
            }
            namespace InputTypeOption
            {
                /**
                 * <p>Gets the PascalCase name of the input type. Component input types return the component name (e.g. MaskedTextBox, DatePicker).</p>
                 * @param value - <p>The enum value.</p>
                 */
                function getName(value: componyx.UI.Form.InputTypeOption): string;
            }
            /**
             * <p>Display Type options</p>
             */
            enum DisplayModeOption
            {
                /**
                 * <p>Editable mode for user input.</p>
                 */
                EDIT = 0,
                /**
                 * <p>View-only mode, for displaying data.</p>
                 */
                VIEW = 1,
                /**
                 * <p>Build mode, for constructing and designing the form.</p>
                 */
                BUILD = 2,
                /**
                 * <p>Preview mode. Similar to editable mode but with header.</p>
                 */
                PREVIEW = 3
            }
            /**
             * <p>FieldSet Layout options</p>
             */
            enum FieldSetLayoutOption
            {
                /**
                 * <p>No visible layout applied. Fields appear directly in the form.</p>
                 */
                NONE = 0,
                /**
                 * <p>Default fieldset appearance with a thin border and a legend at the top.</p>
                 */
                DEFAULT = 1,
                /**
                 * <p>Section with a full-width banner header above the fields, giving it a modern look.</p>
                 */
                BANNERED = 2
            }
            /**
             * <p>Rule Case triggers.</p>
             */
            enum RuleCaseTriggerOption
            {
                /**
                 * <p>The RuleCase runs both on form initialization and when dependent fields change.</p>
                 */
                ALWAYS = "always",
                /**
                 * <p>The RuleCase runs once when the form initializes.</p>
                 */
                INIT = "init",
                /**
                 * <p>The RuleCase runs whenever dependent fields change.</p>
                 */
                CHANGE = "change",
                /**
                 * <p>The RuleCase runs when the corresponding section becomes visible.</p>
                 */
                SHOW_SECTION = "show_section",
                /**
                 * <p>The RuleCase runs when before the form is being submitted.</p>
                 */
                BEFORE_SUBMIT = "before_submit",
                /**
                 * <p>The RuleCase runs when the form submit was successful.</p>
                 */
                SUBMIT_SUCCEEDED = "submit_succeeded",
                /**
                 * <p>The RuleCase runs when the form submit was unsuccessful</p>
                 */
                SUBMIT_FAILED = "submit_failed"
            }
            /**
             * <p>Rule Case run options.</p>
             */
            enum RuleCaseRunVisibilityOption
            {
                /**
                 * <p>The RuleCase runs only when field is visible.</p>
                 */
                VISIBLE = "visible",
                /**
                 * <p>The RuleCase runs when field is hidden.</p>
                 */
                HIDDEN = "hidden",
                /**
                 * <p>The RuleCase runs when even when the field's section is hidden.</p>
                 */
                SECTION_HIDDEN = "section_hidden"
            }
            /**
             * <p>Comparison operators options</p>
             */
            enum RuleComparisonOperatorOption
            {
                EQUAL = "equal",
                NOT_EQUAL = "not_equal",
                GREATER_THAN = "greater_than",
                GREATER_THAN_OR_EQUAL = "greater_than_or_equal",
                LESS_THAN = "less_than",
                LESS_THAN_OR_EQUAL = "less_than_or_equal",
                CONTAINS = "contains",
                NOT_CONTAINS = "not_contains",
                STARTS_WITH = "starts_with",
                ENDS_WITH = "ends_with",
                EMPTY = "empty",
                NOT_EMPTY = "not_empty",
                VISIBLE = "visible",
                HIDDEN = "hidden",
                ENABLED = "enabled",
                DISABLED = "disabled",
                REQUIRED = "required",
                OPTIONAL = "optional"
            }
            /**
               * @property [headerTemplate] - <p>Gets or sets the header template.</p>
               * @property [footerTemplate] - <p>Gets or sets the footer template.</p>
               * @property [fieldSets] - <p>Gets or sets an array of field sets (nested field groupings).</p>
               */
            type BaseSetProperties = {
                headerTemplate?: HTMLElement | HTMLElement[] | DocumentFragment | string | null;
                footerTemplate?: HTMLElement | HTMLElement[] | DocumentFragment | string | null;
                fieldSets?: componyx.UI.Form.BaseSet[];
            };
            /**
             * @property [allowAsRoot] - <p>Gets or sets a value indicating if this field set can be used as a root element in the form.</p>
             * @property [layout] - <p>Gets or sets the layout of the field set.</p>
             * @property [repeatable] - <p>Gets or sets a value indicating if this field set is repeatable.</p>
             * @property [maxRepeats] - <p>Gets or sets a value indicating how many repeats are allowed for this field set. No value or zero means unlimited.</p>
             * @property [repeatLabel] - <p>Gets or sets the field set repeat label.</p>
             * @property [fields] - <p>Gets or sets the form fields that belong to the field set.</p>
             */
            type FieldSetProperties = {
                allowAsRoot?: boolean;
                layout?: componyx.UI.Form.FieldSetLayoutOption;
                repeatable?: boolean;
                maxRepeats?: number | null;
                repeatLabel?: string;
                fields?: componyx.UI.Form.BaseField[];
            };
            /**
             * @property [panelTemplates] - <p>Gets or sets the templates to render in each property panel. Maps property panel ids to template ids.</p>
             * @property [parent] - <p>The parent field if this set is part of another set.</p>
             * @property [id] - <p>Gets or sets the id of the field. The id is generated if it's not set.</p>
             * @property [name] - <p>Gets or sets the name of the field.</p>
             * @property [width] - <p>Gets or sets the width of the field.</p>
             * @property [cssClass] - <p>Gets or sets the CSS class of the field.</p>
             * @property [cssClassIcon] - <p>Gets or sets the CSS class of the field icon.</p>
             * @property [style] - <p>Gets or sets the CSS style of the field.</p>
             * @property [tooltip] - <p>Gets or sets the tooltip of the field.</p>
             * @property [visible] - <p>Gets a value indicating if the field is visible.</p>
             * @property [disabled] - <p>Gets a value indicating if the field is disabled.</p>
             * @property [label] - <p>Gets or sets the label of the field.</p>
             * @property [value] - <p>Gets or sets the value of the option.</p>
             * @property [lineBreak] - <p>Gets or sets a value indicating if the field moves to a new line.</p>
             * @property [viewTemplate] - <p>Gets or sets a custom template to display the field in view mode.</p>
             * @property [editTemplate] - <p>Gets or sets a custom template to display the field in edit mode.</p>
             * @property [element] - <p>Gets the rendered root element of the class.</p>
             * @property [componentSettings] - <p>Gets or sets the specific settings configured for the input type component.</p>
             */
            type BaseFieldProperties = {
                panelTemplates?: {
                    [key: string]: string;
                } | null;
                parent?: componyx.UI.Form.BaseField | null;
                id?: string;
                name?: string;
                width?: string;
                cssClass?: string;
                cssClassIcon?: string;
                style?: string;
                tooltip?: string;
                visible?: boolean;
                disabled?: boolean;
                label?: string;
                value?: string;
                lineBreak?: boolean;
                viewTemplate?: HTMLElement | HTMLElement[] | DocumentFragment | string | null;
                editTemplate?: HTMLElement | HTMLElement[] | DocumentFragment | string | null;
                element?: HTMLElement | null;
                componentSettings?: componyx.UI.Form.ComponentSettings | null;
            };
            /**
             * @property [placeholder] - <p>Gets or sets the placeholder of the field for when it has no value.</p>
             * @property [labelDisplay = 3] - <p>Gets or sets the label display option of the field (above, before, floating, inside).</p>
             * @property [bindingKey] - <p>Gets or sets the data binding key of the field. Defaults to the field name if not set. Supports dot notation (e.g. &quot;user.address.street&quot;). Only applies when form.bindToCustomModel is true.</p>
             * @property [autoDataBind] - <p>Gets or sets a value indicating if the data binding (via Bindary) is automatically activated on this form field.</p>
             * @property [hideLabel] - <p>Gets or sets a value indicating if the label should be hidden. Ignored in build mode.</p>
             * @property [viewAsLabel] - <p>Gets or sets a value indicating if the field value is displayed as a label when in view mode.</p>
             * @property [inlineOptions = true] - <p>Gets or sets a value indicating whether options are displayed horizontally or stacked vertically.</p>
             * @property [optionWidth = auto] - <p>Gets or sets the width of a field option (auto, 50%, 33%, 25%, 20%). Only applies when inlineOptions is true.</p>
             * @property [options] - <p>Gets or sets the field options for input types CHECKBOX or RADIO.</p>
             * @property [inputType] - <p>Gets or sets the input type to render the editable field.</p>
             * @property [customType] - <p>Gets or sets the custom type of the form field.</p>
             * @property [dataSourceId] - <p>Gets or sets the id of the data source used for the field.</p>
             * @property [dataSourcePreview] - <p>Gets or sets a value indicating if the data source can be previewed in Form Build mode.</p>
             * @property [readOnly] - <p>Gets or sets a value indicating if the field is readonly.</p>
             * @property [required] - <p>Gets or sets a value indicating if the field is required.</p>
             * @property [validationSettings] - <p>Gets or sets the validation settings of the field.</p>
             * @property [ruleCases] - <p>Gets or sets a list of rule cases.</p>
             * @property [inputId] - <p>Gets or sets the id of the edit HTML Element or UI component from which attributes/settings are cloned.</p>
             * @property [viewElementId] - <p>Gets or sets the id of the view HTML Element from which attributes are cloned.</p>
             * @property [formFieldId] - <p>Gets or sets the id of the FormField component from which settings are cloned.</p>
             * @property [lineBreakElement] - <p>Gets the rendered line break element.</p>
             * @property [viewElement] - <p>Gets the rendered view element.</p>
             * @property [editElement] - <p>Gets the rendered edit element.</p>
             */
            type FieldProperties = {
                placeholder?: string;
                labelDisplay?: componyx.UI.FormField.LabelDisplayOption;
                bindingKey?: string;
                autoDataBind?: boolean;
                hideLabel?: boolean;
                viewAsLabel?: boolean;
                inlineOptions?: boolean;
                optionWidth?: string;
                options?: componyx.UI.Form.FieldOption;
                inputType?: componyx.UI.Form.InputTypeOption;
                customType?: string;
                dataSourceId?: string;
                dataSourcePreview?: boolean;
                readOnly?: boolean;
                required?: boolean;
                validationSettings?: ValidationSettings;
                ruleCases?: RuleCase[];
                inputId?: string;
                viewElementId?: string;
                formFieldId?: string;
                lineBreakElement?: HTMLElement;
                viewElement?: HTMLElement;
                editElement?: HTMLElement;
            };
            /**
             * @property [value] - <p>Gets or sets the value of the option.</p>
             * @property [selected] - <p>Gets or sets a value indicating if the option is selected/checked.</p>
             * @property [inputId] - <p>Gets or sets the id of the HTML Element from which attributes are cloned.</p>
             * @property [formFieldId] - <p>Gets or sets the id of the FormField component from which settings are cloned.</p>
             */
            type FieldOptionProperties = {
                value?: string;
                selected?: boolean;
                inputId?: string;
                formFieldId?: string;
            };
            /**
             * @property [trustHTML] - <p>Gets or sets a value indicating whether the HTML content of this field is trusted.</p>
             * @property [margin] - <p>Gets or sets the margin of the content field.</p>
             * @property [padding] - <p>Gets or sets the padding of the content field.</p>
             * @property [borderWidth] - <p>Gets or sets the border width of the content field.</p>
             * @property [borderRadius] - <p>Gets or sets the border radius of the content field.</p>
             * @property [borderColor] - <p>Gets or sets the border color of the content field.</p>
             * @property [backgroundColor] - <p>Gets or sets the background color of the content field.</p>
             */
            type ContentFieldProperties = {
                trustHTML?: string;
                margin?: string;
                padding?: string;
                borderWidth?: number | null;
                borderRadius?: string;
                borderColor?: string;
                backgroundColor?: string;
            };
            /**
             * @property [showDivider] - <p>Gets or sets a value indicating whether the divider line is rendered in the middle of the spacer.</p>
             * @property [height] - <p>Gets or sets the height of the spacer field.</p>
             */
            type SpacerFieldProperties = {
                showDivider?: string;
                height?: string;
            };
            /**
             * @property [panelId] - <p>Gets or sets the identifier of the panel in which the build block is placed. Item is placed in first Panel if not set.</p>
             * @property [blockType = 0] - <p>Gets or sets the type of the build block or null if it's a custom field. Defaults to an input field type.</p>
             * @property [inputType] - <p>Gets or sets the input type of the form field or null if it's a custom field.</p>
             * @property [customType] - <p>Gets or sets the custom type of the form field.</p>
             * @property [inputId] - <p>Gets or sets the id of the edit HTML Element or UI component from which attributes/settings are cloned.</p>
             * @property [fieldSet] - <p>Gets or sets the field set of the build block when type is set to FIELDSET.</p>
             */
            type BuildBlockProperties = {
                panelId?: string;
                blockType?: componyx.UI.Form.BlockTypeOption | null;
                inputType?: componyx.UI.Form.InputTypeOption | null;
                customType?: string;
                inputId?: string;
                fieldSet?: componyx.UI.Form.FieldSet;
            };
            /**
             * <p>Represents a field role.</p>
             * @param [properties] - <p>The properties used to initialize the object.</p>
             * @param [properties.id] - <p>Gets or sets the id of the role.</p>
             * @param [properties.label] - <p>Gets or sets the label of the role.</p>
             * @param [properties.defaultValue] - <p>Gets or sets the default value of the role if desired.</p>
             * @param [properties.inputType] - <p>Gets or sets the field input type(s) for which this field role will be selectable.</p>
             */
            class FieldRole
            {
                constructor(properties?: {
                    id?: string;
                    label?: string;
                    defaultValue?: string;
                    inputType?: componyx.UI.Form.InputTypeOption | componyx.UI.Form.InputTypeOption[] | null;
                });
                /**
                 * <p>Gets or sets the id of the role.</p>
                 */
                id: string;
                /**
                 * <p>Gets or sets the label of the role.</p>
                 */
                label: string;
                /**
                 * <p>Gets or sets the default value of the role if desired.</p>
                 */
                defaultValue: any;
                /**
                 * <p>Gets or sets the field input type(s) for which this field role will be selectable.</p>
                 */
                inputType: componyx.UI.Form.InputTypeOption | componyx.UI.Form.InputTypeOption[] | null;
            }
            /**
             * <p>The Form ServerEndpoint class.</p>
             * @param [properties] - <p>The properties used to initialize the object.</p>
             * @param properties.id - <p>Gets or sets the identifier of the item.</p>
             * @param properties.label - <p>Gets or sets the label of the item.</p>
             * @param properties.absoluteURL - <p>Gets or sets a value indicating whether the URL is absolute or relative.</p>
             * @param properties.url - <p>Gets or sets the API endpoint for file uploads or data requests.</p>
             * @param properties.method - <p>Gets or sets the HTTP method used for requests (e.g., &quot;POST&quot;, &quot;GET&quot;).</p>
             * @param properties.headers - <p>Gets or sets the request headers for the API call.</p>
             * @param properties.params - <p>Gets or sets additional parameters sent with the request.</p>
             * @param properties.timeout - <p>Gets or sets the timeout in milliseconds for the request.</p>
             * @param properties.credentials - <p>Gets or sets the credentials mode for the fetch request.</p>
             * @param properties.responseType - <p>Gets or sets the expected response type ('json', 'text', 'blob').</p>
             * @param properties.preFetch - <p>Gets or sets the hook executed before the fetch request.</p>
             * @param properties.postFetch - <p>Gets or sets the hook executed after the fetch request completes.</p>
             */
            class ServerEndpoint
            {
                constructor(properties?: {
                    id: string;
                    label: string;
                    absoluteURL: boolean;
                    url: string;
                    method: string;
                    headers: any;
                    params: any;
                    timeout: number | null;
                    credentials: string;
                    responseType: string;
                    preFetch: ((...params: any[]) => any) | null;
                    postFetch: ((...params: any[]) => any) | null;
                });
                /**
                 * <p>Gets or sets the id of the item.</p>
                 */
                id: string;
                /**
                 * <p>Gets or sets the label of the item.</p>
                 */
                label: string;
                /**
                 * <p>Gets or sets a value indicating whether the URL is absolute or relative.</p>
                 */
                absoluteURL: boolean;
                /**
                 * <p>Gets or sets the API endpoint for file uploads or data requests.</p>
                 */
                url: string;
                /**
                 * <p>Gets or sets the HTTP method used for requests (e.g., &quot;POST&quot;, &quot;GET&quot;).</p>
                 */
                method: string;
                /**
                 * <p>Gets or sets the request headers for the API call.</p>
                 */
                headers: any;
                /**
                 * <p>Gets or sets additional parameters sent with the request.</p>
                 */
                params: any;
                /**
                 * <p>Gets or sets the timeout in milliseconds for the request. If null, no timeout is applied.</p>
                 */
                timeout: number | null;
                /**
                 * <p>Gets or sets the credentials mode for the fetch request. E.g., 'same-origin', 'include', or 'omit'.</p>
                 */
                credentials: string;
                /**
                 * <p>Gets or sets the expected response type. Determines how the fetch response is parsed.
                 * Supported values: 'json', 'text', 'blob'.</p>
                 */
                responseType: string;
                /**
                 * <p>Gets or sets the optional hook executed before the fetch request. Can be used to modify the request parameters or context.</p>
                 */
                preFetch: ((...params: any[]) => any) | null;
                /**
                 * <p>Gets or sets the optional hook executed after the fetch request completes. Can be used to handle the result or update the context.</p>
                 */
                postFetch: (...params: any[]) => any;
            }
            /**
             * <p>The Form DataSource class.</p>
             * @param [properties] - <p>The properties used to initialize the object.</p>
             * @param properties.inputType - <p>Gets or sets the supported input type(s) of the data source; matched by strict equality or inclusion if array.</p>
             */
            class DataSource extends ServerEndpoint
            {
                constructor(properties?: {
                    inputType: componyx.UI.Form.InputTypeOption | componyx.UI.Form.InputTypeOption[];
                });
                /**
                 * <p>Gets or sets the supported input type(s) of the data source; matched by strict equality or inclusion if array.</p>
                 */
                inputType: componyx.UI.Form.InputTypeOption | componyx.UI.Form.InputTypeOption[] | null;
            }
            /**
             * <p>The base class that holds the type property so the type can be converted back to class instance after JSON serialization.</p>
             */
            class BaseType
            {
                /**
                 * <p>Gets the parent fieldSet or Section.</p>
                 */
                parent?: BaseType | null;
                /**
                 * <p>Gets the name of the class, required for identifying the object type when stored as JSON data.</p>
                 */
                readonly type: string;
            }
            /**
             * <p>The base class for all form field and fieldSet types.</p>
             */
            class BaseField extends BaseType
            {
                /**
                 * <p>Gets or sets the templates to render in each property panel. Maps property panel ids to template ids.</p>
                 */
                panelTemplates: {
                    [key: string]: string;
                } | null;
                /**
                 * <p>Gets or sets the id of the field. The id is generated if it's not set.</p>
                 */
                id: string;
                /**
                 * <p>Gets or sets the name of the field.</p>
                 */
                name: string;
                /**
                 * <p>Gets or sets the width of the field.</p>
                 */
                width: string;
                /**
                 * <p>Gets or sets the id of the custom template to display the field in view mode.</p>
                 */
                viewTemplateId: string | null;
                /**
                 * <p>Gets or sets the id of the custom template to display the field in edit mode.</p>
                 */
                editTemplateId: string | null;
                /**
                 * <p>Gets or sets the CSS class of the field.</p>
                 */
                cssClass: string;
                /**
                 * <p>Gets or sets the CSS class of the field icon.</p>
                 */
                cssClassIcon: string;
                /**
                 * <p>Gets or sets the CSS style of the field.</p>
                 */
                style: string;
                /**
                 * <p>Gets or sets the tooltip of the field.</p>
                 */
                tooltip: string;
                /**
                 * <p>Gets a value indicating if the field is visible.</p>
                 */
                visible: boolean;
                /**
                 * <p>Gets a value indicating if the field is disabled.</p>
                 */
                disabled: boolean;
                /**
                 * <p>Gets or sets the label of the field.</p>
                 */
                label: string;
                /**
                 * <p>Gets or sets the value of the option.</p>
                 */
                value: string;
                /**
                 * <p>Gets or sets a value indicating if the field moves to a new line.</p>
                 */
                lineBreak: boolean;
                /**
                 * <p>Gets or sets a custom template to display the field in view mode.</p>
                 */
                viewTemplate: HTMLElement | HTMLElement[] | DocumentFragment | string | null;
                /**
                 * <p>Gets or sets a custom template to display the field in edit mode.</p>
                 */
                editTemplate: HTMLElement | HTMLElement[] | DocumentFragment | string | null;
                /**
                 * <p>Gets or sets the specific settings configured for the input type component.</p>
                 */
                componentSettings: ComponentSettings | null;
                /**
                 * <p>Gets the rendered root element.</p>
                 */
                element: HTMLElement | null;
                /**
                 * <p>Gets the rendered line break element.</p>
                 */
                lineBreakElement: HTMLElement | null;
            }
            /**
             * <p>The base class for form field sets (Section, FieldSet).</p>
             */
            class BaseSet extends BaseField
            {
                /**
                 * <p>Gets or sets the header template.</p>
                 */
                headerTemplate: HTMLElement | HTMLElement[] | DocumentFragment | string | null;
                /**
                 * <p>Gets or sets the footer template.</p>
                 */
                footerTemplate: HTMLElement | HTMLElement[] | DocumentFragment | string | null;
                /**
                 * <p>Gets or sets an array of field sets (nested field groupings).</p>
                 */
                fieldSets: componyx.UI.Form.BaseSet[];
            }
            /**
             * <p>The Form BuildItem class.</p>
             * @param [properties] - <p>The properties used to initialize the object.</p>
             */
            class BuildBlock extends BaseField
            {
                constructor(properties?: BaseFieldProperties & BuildBlockProperties);
                /**
                 * <p>Gets or sets the type of the build block or null if it's a custom field. Defaults to input field type.</p>
                 */
                blockType: componyx.UI.Form.BlockTypeOption | null;
                /**
                 * <p>Gets or sets the input type of the form field or null if it's a custom field.</p>
                 */
                inputType: componyx.UI.Form.InputTypeOption | null;
                /**
                 * <p>Gets or sets the custom type of the form field.</p>
                 */
                customType: string | null;
                /**
                 * <p>Gets or sets the identifier of the panel in which the build block is placed.</p>
                 */
                panelId: string;
                /**
                 * <p>Gets or sets the id of the edit HTML Element or UI component from which the attributes/settings are cloned.</p>
                 */
                inputId: string | null;
                /**
                 * <p>Gets or sets the field set of the build block when type is set to FIELDSET.</p>
                 */
                fieldSet: componyx.UI.Form.FieldSet | null;
            }
            /**
             * <p>The Form Section class.</p>
             * @param [properties] - <p>The properties used to initialize the object.</p>
             */
            class Section extends BaseSet
            {
                constructor(properties?: BaseFieldProperties & BaseSetProperties);
            }
            /**
             * <p>The Form FieldSet class.</p>
             * @param [properties] - <p>The properties used to initialize the object.</p>
             */
            class FieldSet extends BaseSet
            {
                constructor(properties?: BaseFieldProperties & BaseSetProperties & FieldSetProperties);
                /**
                 * <p>Gets or sets a value indicating if this field set can be used as a root element in the form.</p>
                 */
                allowAsRoot: boolean;
                /**
                 * <p>Gets or sets the layout of the field set.</p>
                 */
                layout: Form.FieldSetLayoutOption;
                /**
                 * <p>Gets or sets a value indicating if this field set is repeatable.</p>
                 */
                repeatable: boolean;
                /**
                 * <p>Gets the field set repeat label.</p>
                 */
                repeatLabel: string;
                /**
                 * <p>Gets or sets how many repeats are allowed for this field set. No value or zero means unlimited repeats.</p>
                 */
                maxRepeats: number | null;
                /**
                 * <p>Gets or sets the form fields that belong to the field set.</p>
                 */
                fields: componyx.UI.Form.BaseField[];
            }
            /**
             * <p>The Form Field class.</p>
             * @param [properties] - <p>The properties used to initialize the object.</p>
             */
            class Field extends BaseField
            {
                constructor(properties?: BaseFieldProperties & FieldProperties);
                /**
                 * <p>Gets or sets the role identifier for the field, defining its purpose or behavior.</p>
                 */
                role: string;
                /**
                 * <p>Gets or sets the placeholder of the field for when it has no value.</p>
                 */
                placeholder: string;
                /**
                 * <p>Gets or sets the label display option of the field (above, before, floating, inside).</p>
                 */
                labelDisplay: componyx.UI.FormField.LabelDisplayOption;
                /**
                 * <p>Gets or sets the data binding key of the field. If not provided, the field name is used as the key.</p>
                 */
                bindingKey: string;
                /**
                 * <p>Gets or sets a value indicating if the data binding (via Bindary) is automatically activated on this form field.</p>
                 */
                autoDataBind: boolean | null;
                /**
                 * <p>Gets or sets a value indicating if the label should be hidden. Setting is ignored in build mode.</p>
                 */
                hideLabel: boolean | null;
                /**
                 * <p>Gets or sets a value indicating if the field value is displayed as a label when in view mode.</p>
                 */
                viewAsLabel: boolean;
                /**
                 * <p>Gets or sets a value indicating whether options are displayed horizontally or stacked vertically.</p>
                 */
                inlineOptions: boolean;
                /**
                 * <p>Gets or sets the width of a field option (auto - sized by content; 50% - 2 per row; 33% - 3 per row; 25% - 4 per row; 20% - 5 per row).</p>
                 */
                optionWidth: string;
                /**
                 * <p>Gets or sets the field options for when the input type is set to CHECKBOX or RADIO.</p>
                 */
                options: componyx.UI.Form.FieldOption[];
                /**
                 * <p>Gets or sets the input type to render the editable field.</p>
                 */
                inputType: componyx.UI.Form.InputTypeOption | null;
                /**
                 * <p>Gets or sets the custom type of the form field.</p>
                 */
                customType: string | null;
                /**
                 * <p>Gets or sets the id of the data source used for the field.</p>
                 */
                dataSourceId: string | null;
                /**
                 * <p>Gets or sets a value indicating if the data source can be previewed in the Form Build mode.</p>
                 */
                dataSourcePreview: boolean;
                /**
                 * <p>Gets a value indicating if the field is readonly.</p>
                 */
                readOnly: boolean;
                /**
                 * <p>Gets or sets a value indicating if the field is required.</p>
                 */
                required: boolean;
                /**
                 * <p>Gets or sets the validation settings of the field.</p>
                 */
                validationSettings: ValidationSettings;
                /**
                 * <p>Gets or sets a list of rule cases.</p>
                 */
                ruleCases: RuleCase[];
                /**
                 * <p>Gets or sets the id of the edit HTML Element (TextBox, TextArea) or UI component from which the attributes/settings are cloned.</p>
                 */
                inputId: string | null;
                /**
                 * <p>Gets or sets the id of the view HTML Element from which the attributes are cloned.</p>
                 */
                viewElementId: string | null;
                /**
                 * <p>Gets or sets the id of the FormField component from which the settings are cloned.</p>
                 */
                formFieldId: string | null;
                /**
                 * <p>Gets the rendered view element.</p>
                 */
                viewElement: HTMLElement | null;
                /**
                 * <p>Gets the rendered edit element.</p>
                 */
                editElement: HTMLElement | null;
                /**
                 * <p>Gets the rendered edit component.</p>
                 */
                renderedEditComponent: componyx.UI.base.Component | componyx.UI.base.WebComponent | HTMLElement;
            }
            /**
             * <p>The Form FieldOption class.</p>
             * @param [properties] - <p>The properties used to initialize the object.</p>
             */
            class FieldOption extends BaseField
            {
                constructor(properties?: BaseFieldProperties & FieldOptionProperties);
                /**
                 * <p>Gets or sets a value indicating if the option is selected/checked.</p>
                 */
                selected: boolean;
                /**
                 * <p>Gets or sets the id of the HTML Element from which the attributes are cloned.</p>
                 */
                inputId: string | null;
                /**
                 * <p>Gets or sets the id of the FormField component from which the settings are cloned.</p>
                 */
                formFieldId: string | null;
            }
            /**
             * <p>The Form ContentField class.</p>
             * @param [properties] - <p>The properties used to initialize the object.</p>
             */
            class ContentField extends BaseField
            {
                constructor(properties?: BaseFieldProperties & ContentFieldProperties);
                /**
                 * <p>Gets or sets a value indicating whether the HTML content of this field is trusted.</p>
                 */
                trustHTML: boolean;
                /**
                 * <p>Gets or sets the margin of the content field.</p>
                 */
                margin: string | null;
                /**
                 * <p>Gets or sets the padding of the content field.</p>
                 */
                padding: string | null;
                /**
                 * <p>Gets or sets the border width of the content field.</p>
                 */
                borderWidth: number | null;
                /**
                 * <p>Gets or sets the border radius of the content field.</p>
                 */
                borderRadius: string | null;
                /**
                 * <p>Gets or sets the border color of the content field.</p>
                 */
                borderColor: string | null;
                /**
                 * <p>Gets or sets the background color of the content field.</p>
                 */
                backgroundColor: string | null;
            }
            /**
             * <p>The Form SpacerField class.</p>
             * @param [properties] - <p>The properties used to initialize the object.</p>
             */
            class SpacerField extends BaseField
            {
                constructor(properties?: BaseFieldProperties & SpacerFieldProperties);
                /**
                 * <p>Gets or sets a value indicating whether the divider line is rendered in the middle of the spacer.</p>
                 */
                showDivider: boolean;
                /**
                 * <p>Gets or sets the height of the spacer field.</p>
                 */
                height: string | null;
            }
            /**
             * <p>The Form ValidationSettings class.</p>
             * @param [properties] - <p>The properties used to initialize the object.</p>
             * @param [properties.dataType] - <p>Gets or sets the expected data type of the field. INTEGER: 0, FLOAT: 1, DATETIME: 2, EMAIL: 3, URL: 4, SOURCE: 5</p>
             * @param [properties.compareFieldId] - <p>Gets or sets the comparison field identifier for the field.</p>
             * @param [properties.compareOperator] - <p>Gets or sets the comparison operator for the field.</p>
             * @param [properties.minLength] - <p>Gets or sets the minimum length allowed for the field value.</p>
             * @param [properties.maxLength] - <p>Gets or sets the maximum length allowed for the field value.</p>
             * @param [properties.minRange] - <p>Gets or sets the minimum range allowed for the field value.</p>
             * @param [properties.maxRange] - <p>Gets or sets the maximum range allowed for the field value.</p>
             * @param [properties.pattern] - <p>Gets or sets the regex pattern that the field value must match.</p>
             */
            class ValidationSettings extends BaseType
            {
                constructor(properties?: {
                    dataType?: number;
                    compareFieldId?: string;
                    compareOperator?: string;
                    minLength?: number;
                    maxLength?: number;
                    minRange?: number;
                    maxRange?: number;
                    pattern?: string;
                });
                /**
                 * <p>Gets or sets the expected data type of the field. INTEGER: 0, FLOAT: 1, DATETIME: 2, EMAIL: 3, URL: 4, SOURCE: 5</p></p>
                 */
                dataType?: number | null;
                /**
                 * <p>Gets or sets the comparison field identifier for the field.</p>
                 */
                compareFieldId?: string | any | null;
                /**
                 * <p>Gets or sets the comparison operator for the field.</p>
                 */
                compareOperator?: string | null;
                /**
                 * <p>Gets or sets the minimum length allowed for the field value.</p>
                 */
                minLength?: number | null;
                /**
                 * <p>Gets or sets the maximum length allowed for the field value.</p>
                 */
                maxLength?: number | null;
                /**
                 * <p>Gets or sets the minimum range allowed for the field value.</p>
                 */
                minRange?: number | null;
                /**
                 * <p>Gets or sets the maximum range allowed for the field value.</p>
                 */
                maxRange?: number | null;
                /**
                 * <p>Gets or sets the regex pattern that the field value must match.</p>
                 */
                pattern?: string | null;
            }
            /**
             * <p>The Form Command class.</p>
             * @param [properties] - <p>The properties used to initialize the object.</p>
             * @param [properties.id] - <p>Gets or sets the id of the command. The id is generated if it's not set.</p>
             * @param [properties.command] - <p>Gets or sets the command that the button triggers (e.g. 'undo', 'redo').</p>
             * @param [properties.isVisible] - <p>Gets or sets a predicate function that returns <code>true</code> when this button should be shown. No value set means always visible.</p>
             * @param [properties.isEnabled] - <p>Gets or sets a predicate function that returns <code>true</code> when this button should be enabled; return <code>false</code> to disable it. No value set means always enabled.</p>
             * @param [properties.shortcutKey] - <p>Gets or sets the keyboard shortcut key in combination with the CTRL key for this button (e.g. 'z' for undo).</p>
             * @param [properties.cssClass = ''] - <p>Gets or sets the CSS class name for the button.</p>
             * @param [properties.cssClassIcon = 'ico-undo'] - <p>Gets or sets the CSS class name for the icon to display.</p>
             * @param [properties.events = null] - <p>Gets or sets the events of the button component.</p>
             * @param [properties.buttonId = null] - <p>Gets or sets the id of the button component from which the settings are cloned.</p>
             */
            class Command
            {
                constructor(properties?: {
                    id?: string;
                    command?: string | ((...params: any[]) => any);
                    isVisible?: (...params: any[]) => any;
                    isEnabled?: (...params: any[]) => any;
                    shortcutKey?: string;
                    cssClass?: string;
                    cssClassIcon?: string;
                    events?: any;
                    buttonId?: string | null;
                });
                /**
                 * <p>Gets or sets the id of the command. The id is generated if it's not set.</p>
                 */
                id: string | null;
                /**
                 * <p>Gets or sets the command to execute.</p>
                 */
                command: ((...params: any[]) => any) | null;
                /**
                 * <p>Gets or sets a predicate function that returns <code>true</code> when this button should be shown.</p>
                 */
                isVisible: ((...params: any[]) => any) | null;
                /**
                 * <p>Gets or sets a predicate function that returns <code>true</code> when this button should be enabled; return <code>false</code> to disable it.</p>
                 */
                isEnabled: ((...params: any[]) => any) | null;
                /**
                 * <p>Gets or sets the keyboard shortcut key in combination with the CTRL key for this button (e.g. 'z' for undo).</p>
                 */
                shortcutKey: string;
                /**
                 * <p>Gets or sets the CSS class name for the button.</p>
                 */
                cssClass: string;
                /**
                 * <p>Gets or sets the CSS class name for the icon to display.</p>
                 */
                cssClassIcon: string;
                /**
                 * <p>Gets or sets the location of the command button.</p>
                 */
                location: Form.CommandLocationOption;
                /**
                 * <p>Gets or sets the events of the button component.</p>
                 */
                events: any | null;
                /**
                 * <p>Gets or sets the id of the button component from which the settings are cloned.</p>
                 */
                buttonId: string | null;
            }
            /**
             * <p>The RuleCase class represents a case of rules that result in actions.</p>
             */
            class RuleCase extends BaseType
            {
                /**
                 * <p>Gets or sets the id. The id is generated if it's not set.</p>
                 */
                id: string;
                /**
                 * <p>Gets or sets the trigger of the RuleCase. Determines when this case executes.</p>
                 */
                trigger: RuleCaseTriggerOption;
                /**
                 * <p>Gets or sets a value indicating if this rule case is run when the field is visible (default), hidden or when even it's section is hidden.</p>
                 */
                runVisibility: RuleCaseRunVisibilityOption;
                /**
                 * <p>Gets or sets the array of RuleGroup objects in this case.</p>
                 */
                ruleGroups: RuleGroup[];
                /**
                 * <p>Gets or sets a list of actions to execute when the rule condition is met. Each action is an object with a type and optional value.</p>
                 */
                actions: Action[];
            }
            /**
             * <p>The RuleGroup class represents a group of rules combined with a logical operator.</p>
             */
            class RuleGroup extends BaseType
            {
                /**
                 * <p>Gets or sets the id. The id is generated if it's not set.</p>
                 */
                id: string;
                /**
                 * <p>Gets or sets the array of Rule objects in this group.</p>
                 */
                rules: Rule[];
                /**
                 * <p>Gets or sets the logical operator to combine the rules: 'AND' or 'OR'.</p>
                 */
                logicalOperator: string;
            }
            /**
             * <p>The Rule class represents a single conditional rule for a field.</p>
             */
            class Rule extends BaseType
            {
                /**
                 * <p>Gets or sets the id. The id is generated if it's not set.</p>
                 */
                id: string;
                /**
                 * <p>Gets or sets the id of the field/fieldset that this rule applies to.</p>
                 */
                sourceId: string | null;
                /**
                 * <p>Gets or sets the logical operator to combine the rules: 'AND' or 'OR'.</p>
                 */
                logicalOperator: string | null;
                /**
                 * <p>Gets or sets the comparison operator for evaluation (e.g., equals, greater than).</p>
                 */
                comparisonOperator: RuleComparisonOperatorOption;
                /**
                 * <p>Gets or sets the value to compare against.</p>
                 */
                value: any;
                /**
                 * <p>Gets or sets a value indicating if the set value is the end value of a range.</p>
                 */
                isRangeEnd: boolean;
            }
            /**
             * <p>Represents an action to execute when a rule case condition is met.</p>
             * @param [properties] - <p>The properties used to initialize the object.</p>
             * @param [properties.id] - <p>Gets or sets the id of the action.</p>
             * @param [properties.runtimeActionId] - <p>Gets or sets the unique id of the registered runtime action to execute.</p>
             * @param [properties.targetFieldSetId] - <p>Gets or sets the id of the target field set.</p>
             * @param [properties.value] - <p>Gets or sets the value associated with the action.</p>
             */
            class Action extends BaseType
            {
                constructor(properties?: {
                    id?: string;
                    runtimeActionId?: string;
                    targetFieldSetId?: any;
                    value?: any;
                });
                /**
                 * <p>Gets or sets the id of the action.</p>
                 */
                id: string;
                /**
                 * <p>Gets or sets the unique id of the registered runtime action to execute.</p>
                 */
                runtimeActionId: string;
                /**
                 * <p>Gets or sets the id of the target field set.</p>
                 */
                targetFieldSetId: string;
                /**
                 * <p>Gets or sets the value associated with the action.</p>
                 */
                value: any;
            }
        }

        interface Form extends Omit<componyx.UI.base.methods, 'render' | 'postRender' | 'destroy' | 'cloneProperties'> { }
        /**
         * <p>Form class.</p>
         */
        class Form extends componyx.UI.base.WebComponent
        {
            /**
             * Creates a new Form instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id?: string, properties?: Partial<Form> | HTMLElement);
            /**
            * <p>Internal CSS class name constants.
            * You can override any of these classes on the Component instance by defining a property named
            * <code>cssClass&lt;Key&gt;</code> where &lt;Key&gt; is the PascalCase key from this object.
            * Example:
            * 'BUILD_PANE' -&gt; 'cssClassBuildPane'
            * Be cautious: overriding these classes without including the default names may break styling and functionality.</p>
            */
            readonly classOption: componyx.UI.Form.ClassOption;
            /**
             * <p>Gets or sets the tab index of the form element. A value is required so the form can receive focus programmatically, enabling its keyboard shortcuts.</p>
             */
            tabIndex: number;
            /**
             * <p>Gets or sets the format configuration for dates and numbers.</p>
             */
            format: componyx.UI.Form.FormatConfig;
            /**
             * <p>Gets or sets a value indicating whether the display is in build, edit or view mode.</p>
             */
            displayMode: componyx.UI.Form.DisplayModeOption;
            /**
             * <p>Gets or sets a value indicating whether the label is displayed automatically, inside, above, before or after the form input field.</p>
             */
            labelDisplay: componyx.UI.FormField.LabelDisplayOption;
            /**
             * <p>Gets or sets a value indicating if the form uses a fixed layout with always-visible side panes and header. Useful when embedding the form in full-page layouts.</p>
             */
            fixedLayout: boolean;
            /**
             * <p>Gets or sets a value indicating whether the form navigation buttons (previous/next/submit) are rendered.</p>
             */
            renderNavigationButtons: boolean;
            /**
             * <p>Gets or sets a value indicating if the data binding (via Bindary) is automatically activated on the form fields.</p>
             */
            autoDataBindFields: boolean;
            /**
             * <p>Gets or sets a value indicating whether the form binds field values to a custom external model instead of the internal model (form.values).</p>
             */
            bindToCustomModel: boolean;
            /**
             * <p>Gets or sets a method to retrieve the custom external model. When using form rules in combination with bindToCustomModel this property is required.</p>
             */
            customModelGetter: (...params: any[]) => any;
            /**
             * <p>Gets or sets a value indicating whether the form element is configured with a root data binding context (set via the Bindary context attribute). When true, this element serves as the root of the view update, potentially improving performance.</p>
             */
            hasDataBindRootContext: boolean;
            /**
             * <p>Gets or sets the array of nested field sets. Sections group FieldSets (cannot contain fields) while FieldSets directly contain fields, ensuring every field is always within a FieldSet.</p>
             */
            fieldSets: (componyx.UI.Form.Section | componyx.UI.Form.FieldSet)[];
            /**
             * <p>Gets or sets the current form field values stored by bindingKey or name.</p>
             */
            values: {
                [key: string]: any;
            };
            /**
             * <p>Gets or sets the field roles that determine how this field’s data is processed by the backend. Each role can specify a default value and be restricted to certain input types.</p>
             */
            fieldRoles: componyx.UI.Form.FieldRole[];
            /**
             * <p>Gets or sets the panels of the build panel-bar. If using Panel instances, the PanelBar script must be available at design time. If using plain objects, they are converted at runtime, and the PanelBar script is imported in the preRender phase.</p>
             */
            buildPanels: componyx.UI.PanelBar.Panel[] | object[];
            /**
             * <p>Gets or sets the panel id in the build panels for the Navigator. If set to null or if no panel with the specified id exists, the Navigator will not be rendered.</p>
             */
            navigatorPanelId: string | null;
            /**
             * <p>Gets or sets the delay in milliseconds before applying the navigator search after the user stops typing.</p>
             */
            navigatorSearchDelay: number;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the navigator menu used by the form component.</p>
             */
            navigatorMenuId: string | null;
            /**
             * <p>Gets or sets the panels of the config panel-bar. If using Panel instances, the PanelBar script must be available at design time. If using plain objects, they are converted at runtime, and the PanelBar script is imported in the preRender phase.</p>
             */
            configPanels: componyx.UI.PanelBar.Panel[] | object[];
            /**
             * <p>Gets or sets the build blocks that are displayed in the form's build pane when the displayMode is set to BUILD.</p>
             */
            buildBlocks: componyx.UI.Form.BuildBlock[];
            /**
             * <p>Gets or sets the command buttons displayed in the form’s specific placeholder locations.</p>
             */
            commands: componyx.UI.Form.Command[];
            /**
             * <p>Gets or sets the text labels used by the form.</p>
             */
            labels: componyx.UI.Form.LabelSettings;
            /**
             * <p>Gets or sets the data sources available for form fields (server endpoints filtered by input type). Configurable in build mode; used at runtime to populate field options (ComboBox, Checkbox, Radio, Switch) or to upload files.</p>
             */
            dataSources: componyx.UI.Form.DataSource[];
            /**
             * <p>Gets or sets the server endpoints used by rule case actions at runtime. Endpoints should return a JSON object with <code>success: true</code> to continue the current rule case actions or <code>success: false</code> to stop the action flow.</p>
             */
            actionEndpoints: componyx.UI.Form.ServerEndpoint[];
            /**
             * <p>Gets or sets the endpoint used to save the form definition.</p>
             */
            saveEndpoint: componyx.UI.Form.ServerEndpoint;
            /**
             * <p>Gets or sets the endpoint used to submit the form values at runtime.</p>
             */
            submitEndpoint: componyx.UI.Form.ServerEndpoint;
            /**
             * <p>Gets or sets the CRSF Token to send with each server endpoint request.</p>
             */
            crsfToken: string;
            /**
             * <p>Gets or sets a value indicating if disabled form fields are included in the form submit.</p>
             */
            includeDisabledFields: string;
            /**
             * <p>Gets or sets the maximum items allowed in the history stack. Null means no limit.</p>
             */
            maxHistoryLength: number | null;
            /**
             * <p>Gets or sets the delay in milliseconds before applying config panel setting changes to the form pane when in form build mode.</p>
             */
            settingUpdateDelay: number;
            /**
             * <p>* Gets or sets the delay in milliseconds before saving the form via the configured saveEndpoint (or custom onSave implementation) when in form build mode.</p>
             */
            autoSaveDelay: number;
            /**
             * <p>Gets or sets a custom function to sanitize HTML data. If provided, it overrides the default built-in sanitizer. For high-security environments, it's strongly recommended to use a library like DOMPurify or similar.</p>
             */
            sanitizer: ((...params: any[]) => any) | null;
            /**
             * <p>Gets or sets the drag settings for all draggable items.</p>
             */
            dragSettings: componyx.library.DraggableSettings;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the remove Field button (inside the Field action-menu).</p>
             */
            removeFieldButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the clone Field button (inside the Field action-menu).</p>
             */
            cloneFieldButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the add Field button (inside the Field action-menu).</p>
             */
            addFieldButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the remove Field Option button (inside the Field Options configuration panel).</p>
             */
            removeFieldOptionButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the add Field option button (inside the Field Options configuration panel).</p>
             */
            addFieldOptionButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the remove allowed time/date button (inside the Component configuration panel).</p>
             */
            removeAllowedItemButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the add allowed time/date button (inside the Component configuration panel).</p>
             */
            addAllowedItemOptionButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the build panel-bar.</p>
             */
            buildPanelBarId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the configuration panel-bar.</p>
             */
            configPanelBarId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the build-block insert button (inside the build panel).</p>
             */
            insertBuildBlockButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the layout combo-box (inside the FieldSet configuration panel).</p>
             */
            layoutComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the label display combo-box (inside the Field and FieldSet configuration panels).</p>
             */
            labelDisplayComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the field width combo-box (inside the Field configuration panel).</p>
             */
            fieldWidthComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the option width combo-box (inside the Field Options configuration panel).</p>
             */
            fieldOptionWidthComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for more settings button (inside the Field configuration panel).</p>
             */
            moreSettingsButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the data type combo-box (inside the Validation configuration panel).</p>
             */
            dataTypeComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the compare operator combo-box (inside the Validation configuration panel).</p>
             */
            compareOperatorComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the compare field combo-box (inside the Validation configuration panel).</p>
             */
            compareFieldComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the data source combo-box (inside the Field Options configuration panel).</p>
             */
            dataSourceComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the data source preview combo-box (inside the Field Options configuration panel).</p>
             */
            dataSourcePreviewComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the max repeats numeric-box (inside the FieldSet configuration panel).</p>
             */
            maxRepeatsNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the min length numeric-box (inside the Validation configuration panel).</p>
             */
            minLengthNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the max length numeric-box (inside the Validation configuration panel).</p>
             */
            maxLengthNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the min range numeric-box (inside the Validation configuration panel).</p>
             */
            minRangeNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the max range numeric-box (inside the Validation configuration panel).</p>
             */
            maxRangeNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the remove option button (inside the Field Options configuration panel).</p>
             */
            removeOptionButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the add rule case button (inside the Rules configuration panel).</p>
             */
            addRuleCaseButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the remove rule case button (inside the Rules configuration panel).</p>
             */
            removeRuleCaseButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the add rule group button (inside the Rules configuration panel).</p>
             */
            addRuleGroupButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the add action button (inside the Rules configuration panel).</p>
             */
            addActionButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the remove action button (inside the Rules configuration panel).</p>
             */
            removeActionButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the trigger combo-box (inside the Rules configuration panel).</p>
             */
            triggerComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the run visibility combo-box (inside the Rules configuration panel).</p>
             */
            runVisibilityComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the action combo-box (inside the Rules configuration panel).</p>
             */
            actionComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the action target combo-box (inside the Rules configuration panel).</p>
             */
            actionTargetComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the source field operator combo-box (inside the Rules configuration panel).</p>
             */
            sourceFieldComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the comparison operator combo-box (inside the Rules configuration panel).</p>
             */
            comparisonComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the logical operator combo-box (inside the Rules configuration panel).</p>
             */
            logicalOperatorComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the options value combo-box (inside the Rules configuration panel).</p>
             */
            optionsValueComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the sections value combo-box displayed for the show_section action (inside the Rules configuration panel).</p>
             */
            sectionsValueComboBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the value date-picker (inside the Component configuration panel).</p>
             */
            valueDatePickerId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the min value date-picker (inside the Component configuration panel).</p>
             */
            minValueDatePickerId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the max value date-picker (inside the Component configuration panel).</p>
             */
            maxValueDatePickerId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the value time-picker (inside the Component configuration panel).</p>
             */
            valueTimePickerId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the min value time-picker (inside the Component configuration panel).</p>
             */
            minValueTimePickerId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the max value time-picker (inside the Component configuration panel).</p>
             */
            maxValueTimePickerId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the default value numeric-box (inside the Component configuration panel).</p>
             */
            valueNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the min value numeric-box (inside the Component configuration panel).</p>
             */
            minValueNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the max value numeric-box (inside the Component configuration panel).</p>
             */
            maxValueNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the start value numeric-box (inside the Component configuration panel).</p>
             */
            startValueNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the precision numeric-box (inside the Component configuration panel).</p>
             */
            precisionNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the tick marks numeric-box (inside the Component configuration panel).</p>
             */
            tickMarksNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the incremental value numeric-box (inside the Component configuration panel).</p>
             */
            incrementalValueNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the date-picker used to add allowed dates (inside the Component configuration panel).</p>
             */
            addAllowedDatePickerId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the time-picker used to add allowed times (inside the Component configuration panel).</p>
             */
            addAllowedTimePickerId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the max file size numeric-box (inside the Component configuration panel).</p>
             */
            maxFileSizeNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the max files numeric-box (inside the Component configuration panel).</p>
             */
            maxFilesNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the border width numeric-box (inside the Content configuration panel).</p>
             */
            borderWidthNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the border color-button (inside the Content configuration panel).</p>
             */
            borderColorButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the background color-button (inside the Content configuration panel).</p>
             */
            backgroundColorButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the content field editor (Content Fields in Build Mode).</p>
             */
            contentFieldEditorId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the color picker used by the form component.</p>
             */
            colorPickerId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the section switch form-field rendered in the form header.</p>
             */
            sectionSwitchFormFieldId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the alert dialog action.</p>
             */
            alertDialogId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the confirmation dialog action.</p>
             */
            confirmDialogId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the previous section button.</p>
             */
            previousSectionButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the next section button.</p>
             */
            nextSectionButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the submit button.</p>
             */
            submitButtonId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the tooltip manager used by the form component.</p>
             */
            tooltipManagerId: string;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the validator used by the form component.</p>
             */
            validatorId: string;
            events: componyx.UI.Form.FormEvents;
            /**
             * <p>Gets the previous button.</p>
             */
            readonly prevButton: componyx.UI.Button;
            /**
             * <p>Gets the next button.</p>
             */
            readonly nextButton: componyx.UI.Button;
            /**
             * <p>Gets the submit button.</p>
             */
            readonly submitButton: componyx.UI.Button;
            /**
             * <p>Gets the field attribute name</p>
             */
            readonly fieldAttribute: string;
            /**
             * <p>Gets the selected field set identifier.</p>
             */
            readonly selectedFieldSetId: string;
            /**
             * <p>Gets the selected field identifier.</p>
             */
            readonly selectedFieldId: string;
            /**
             * <p>Gets the registered runtime actions.</p>
             */
            readonly runtimeActions: {
                [key: string]: componyx.UI.Form.ActionConfig;
            };
            /**
             * <p>Registers a custom field type.</p>
             * @param typeName - <p>The name of the custom field type.</p>
             * @param config - <p>Configuration for the custom field type.</p>
             */
            static registerCustomType(typeName: string, config: componyx.UI.Form.CustomFieldConfig): void;
            /**
             * <p>Retrieves the configuration for a registered custom field type.</p>
             * @param typeName - <p>The name of the custom field type.</p>
             * @returns <p>The configuration object for the custom type, or undefined if not registered.</p>
             */
            static getCustomType(typeName: string): any | undefined;
            /**
             * <p>Gets a unique identifer.</p>
             * @returns <p>A unique identifier.</p>
             */
            guid(): string;
            /**
             * <p>Registers a runtime action.</p>
             * @param id - <p>The unique identifier of the action.</p>
             * @param config - <p>The object to configure the action.</p>
             */
            registerAction(id: string, config: componyx.UI.Form.ActionConfig): void;
            /**
             * <p>Executes a serialized action on a field.</p>
             * @param action - <p>The action instance.</p>
             * @param target - <p>The target field or fieldset on which the action is executed.</p>
             */
            executeAction(action: componyx.UI.Form.Action, target: componyx.UI.Form.Field | componyx.UI.Form.FieldSet): void;
            /**
             * <p>Retrieves the Section of the current field (if sections are enabled).</p>
             * @param field - <p>The field instance.</p>
             * @returns <p>The parent section.</p>
             */
            getParentSection(field: componyx.UI.Form.Field): componyx.UI.Form.Section;
            /**
             * <p>Gets the values of enabled form fields (excludes disabled fields).</p>
             * @returns <p>The form values of all enabled fields.</p>
             */
            getEnabledFieldValues(): any;
            /**
             * <p>Check if the given type belongs to a group container (e.g., FieldSet, Section).</p>
             * @param type - <p>The type to check.</p>
             * @returns <p>True if the type is a group.</p>
             */
            isGroup(type: string): boolean;
            /**
             * <p>Check if the given type is an input field (user-enterable).</p>
             * @param type - <p>The type to check.</p>
             * @returns <p>True if the type is an input field.</p>
             */
            isInputField(type: string): boolean;
            /**
             * <p>Check if the given type is a content-only field.</p>
             * @param type - <p>The type to check.</p>
             * @returns <p>True if the type is a content field.</p>
             */
            isContentField(type: string): boolean;
            /**
             * <p>Check if the given type is a content or input field.</p>
             * @param type - <p>The type to check.</p>
             * @returns <p>True if the type is a content field.</p>
             */
            isField(type: string): boolean;
            /**
             * <p>Sets the header template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{title} This value will be replaced with the form title.</li>
             * <li>{commands} This value will be replaced with the form commands.</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setHeaderTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the FieldSetPanel template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{layout}</li>
             * <li>{labelDisplay}</li>
             * <li>{repeatable}</li>
             * <li>{maxRepeats}</li>
             * <li>{repeatLabel}</li>
             * <li>{tooltip}</li>
             * <li>{lineBreak}</li>
             * <li>{visible}</li>
             * <li>{disabled}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setFieldSetPanel(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the FieldPanel template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{name}</li>
             * <li>{labelDisplay}</li>
             * <li>{placeholder}</li>
             * <li>{tooltip}</li>
             * <li>{value}</li>
             * <li>{width}</li>
             * <li>{required}</li>
             * <li>{lineBreak}</li>
             * <li>{visible}</li>
             * <li>{disabled}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setFieldPanel(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the ContentFieldPanel template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{width}</li>
             * <li>{margin}</li>
             * <li>{padding}</li>
             * <li>{borderWidth}</li>
             * <li>{borderRadius}</li>
             * <li>{borderColor}</li>
             * <li>{backgroundColor}</li>
             * <li>{lineBreak}</li>
             * <li>{visible}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setContentFieldPanel(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the SpacerFieldPanel template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{showDivider}</li>
             * <li>{height}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setSpacerFieldPanel(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the FieldOptionsPanel template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{optionsType}</li>
             * <li>{dataSourceId}</li>
             * <li>{dataSourcePreview}</li>
             * <li>{inlineOptions}</li>
             * <li>{optionWidth}</li>
             * <li>{options}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setFieldOptionsPanel(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the ComponentPanel_MaskedTextBox template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{mask}</li>
             * <li>{value}</li>
             * <li>{allowedCharacters}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setComponentPanel_MaskedTextBox(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the ComponentPanel_NumericBox template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{precision}</li>
             * <li>{value}</li>
             * <li>{minValue}</li>
             * <li>{maxValue}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setComponentPanel_NumericBox(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the ComponentPanel_ComboBox template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{multiSelect}</li>
             * <li>{multiSelectTagging}</li>
             * <li>{allowInput}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setComponentPanel_ComboBox(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the ComponentPanel_DatePicker template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{today}</li>
             * <li>{value}</li>
             * <li>{minValue}</li>
             * <li>{maxValue}</li>
             * <li>{allowedDates}</li>
             * <li>{disallowDates}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setComponentPanel_DatePicker(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the ComponentPanel_TimePicker template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{value}</li>
             * <li>{minValue}</li>
             * <li>{maxValue}</li>
             * <li>{incrementalValue}</li>
             * <li>{allowedTimes}</li>
             * <li>{disallowTimes}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setComponentPanel_TimePicker(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the ComponentPanel_Slider template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{range}</li>
             * <li>{trackSize}</li>
             * <li>{startValue}</li>
             * <li>{value}</li>
             * <li>{minValue}</li>
             * <li>{maxValue}</li>
             * <li>{tickMarks}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setComponentPanel_Slider(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the ComponentPanel_FileUpload template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{accept}</li>
             * <li>{maxFileSize}</li>
             * <li>{maxFiles}</li>
             * <li>{dataSourceId}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setComponentPanel_FileUpload(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the ComponentPanel_Editor template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{blockStyles}</li>
             * <li>{links}</li>
             * <li>{lists}</li>
             * <li>{images}</li>
             * <li>{media}</li>
             * <li>{all}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setComponentPanel_Editor(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the ValidationPanel template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{required}</li>
             * <li>{dataType}</li>
             * <li>{pattern}</li>
             * <li>{length}</li>
             * <li>{compare}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setValidationPanel(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the Option template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{name}</li>
             * <li>{value}</li>
             * <li>{remove}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setOption(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the Rule template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{source}</li>
             * <li>{operator}</li>
             * <li>{value}</li>
             * <li>{connector}</li>
             * <li>{remove}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setRule(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the Action template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{actionSelector}</li>
             * <li>{remove}</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setAction(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Gets a value indicating whether the form is in build mode.</p>
             * @returns <p>A value indicating whether the form is in build mode.</p>
             */
            isBuildMode(): boolean;
            /**
             * <p>Gets a value indicating whether the form is in preview mode.</p>
             * @returns <p>A value indicating whether the form is in preview mode.</p>
             */
            isPreviewMode(): boolean;
            /**
             * <p>Sets the display mode and re-renders the component.</p>
             * @param displayMode - <p>The display mode in which the form will be rendered.</p>
             */
            setDisplayMode(displayMode: componyx.UI.Form.DisplayModeOption): void;
            /**
             * <p>Toggles the visibility of a specified side pane (build or config).
             * Adds or removes a CSS class that controls visibility.</p>
             * @param pane - <p>The pane to toggle ('build' for the left panel, 'config' for the right panel).</p>
             */
            togglePane(pane?: 'build' | 'config'): void;
            /**
             * <p>Checks whether an undo or redo operation is possible based on the current history state.</p>
             * @param type - <p>Either 'undo' or 'redo'.</p>
             * @returns <p>True if the operation is possible; otherwise, false.</p>
             */
            canPerformHistoryAction(type: string): boolean;
            /**
             * <p>Updates the visibility and enabled state of UI command buttons based on their associated conditions.
             * Commands are shown/hidden and enabled/disabled according to their <code>isVisible</code> and <code>isEnabled</code> callbacks.</p>
             */
            updateCommandStates(): void;
            /**
             * <p>Reverts the form data to the previous state in the undo stack.</p>
             */
            undo(): void;
            /**
             * <p>Restores the form data to the next state in the redo stack.</p>
             */
            redo(): void;
            /**
             * <p>Sets the active element for the data observer.</p>
             */
            setActiveElement(): void;
            /**
             * <p>Executes a block of code without tracking any changes in the undo/redo history stack.
             * Any modifications to form data within the callback will not be recorded in the form's history. This is useful for internal or silent updates that should not be undoable.
             * Optionally, you can disable processing/rendering of the changes by passing <code>false</code> as the second argument.</p>
             * @param callback - <p>The function containing non-history-tracked changes.</p>
             * @param processChanges - <p>A value indicating whether to process and render the changes made during the callback.</p>
             */
            withoutTracking(callback: (...params: any[]) => any, processChanges?: boolean): void;
            /**
             * <p>Processes any pending data changes and updates the form UI accordingly.
             * Call this method after making direct changes to the form data to ensure those changes are rendered and reflected in the UI.</p>
             */
            processChanges(): void;
            /**
             * <p>Checks if the form has any sections (root-level fieldSets of type &quot;Section&quot;).</p>
             * @returns <p>True if at least one section exists.</p>
             */
            hasSections(): boolean;
            /**
             * <p>Retrieves a section by its identifier. Sections are represented as root-level field sets.</p>
             * @param id - <p>The identifier of the section to find.</p>
             * @returns <p>The section with the specified id, or null if not found.</p>
             */
            getSection(id: string): componyx.UI.Form.FieldSet | null;
            /**
             * <p>Retrieves a field set by its identifier, searching recursively through all nested field sets.</p>
             * @param id - <p>The identifier of the field set to find.</p>
             * @param [fieldSets = this.fieldSets] - <p>Optional root list of field sets to start from.</p>
             * @returns <p>The field set with the specified id, or null if not found.</p>
             */
            getFieldSet(id: string, fieldSets?: componyx.UI.Form.FieldSet[]): componyx.UI.Form.FieldSet | null;
            /**
             * <p>Get field by its identifier.</p>
             * @param id - <p>The identifier of the field to retrieve.</p>
             * @param [fieldSet = null] - <p>The root field set to start from.</p>
             * @param [fields = null] - <p>The flattened field collection to speed up the lookup for batched find actions.</p>
             * @returns <p>The field with the specified id, or null if not found.</p>
             */
            getField(id: string, fieldSet?: componyx.UI.Form.FieldSet, fields?: componyx.UI.Form.Field[]): componyx.UI.Form.Field | null;
            /**
             * <p>Retrieves all fields from the given field set or the entire form if none is provided.
             * Searches recursively to include fields from nested field sets.</p>
             * @param [fieldSet = null] - <p>The root field set to start from.</p>
             * @returns <p>A flat array of all fields.</p>
             */
            getFields(fieldSet?: componyx.UI.Form.FieldSet): componyx.UI.Form.Field[];
            /**
             * <p>Retrieves all field sets from the given root or the entire form if none is provided.
             * Searches recursively to include field sets from nested field sets.</p>
             * @param [fieldSet = null] - <p>The root field set to start from.</p>
             * @returns <p>A flat array of all field sets.</p>
             */
            getFieldSets(fieldSet?: any): object[];
            /**
             * <p>Retrieves the field by the field option.</p>
             * @param fieldOption - <p>The field option.</p>
             * @returns <p>The field to which the field option belongs.</p>
             */
            getFieldByFieldOption(fieldOption: componyx.UI.Form.FieldOption): componyx.UI.Form.Field;
            /**
             * <p>Retrieves the field name from the specified text label.</p>
             * @param label - <p>The text label.</p>
             * @returns <p>A valid field name.</p>
             */
            getValidFieldNameFromLabel(label: string): string;
            /**
             * <p>Gets the field context by its identifier in the field sets.</p>
             * @param field - <p>The field to find context for.</p>
             * @returns <p>The context of the field.</p>
             */
            getFieldContext(field: componyx.UI.Form.Field): componyx.UI.Form.FieldContext | null;
            /**
             * <p>Recursively finds a FieldSet by its associated DOM element.</p>
             * @param fieldSets - <p>The list of FieldSets to search through.</p>
             * @param element - <p>The element to find the corresponding FieldSet for.</p>
             * @returns <p>The matching FieldSet, or null if not found.</p>
             */
            findFieldSetByElement(fieldSets: any[], element: HTMLElement): any | null;
            /**
             * <p>Inserts a build block into the form's active field-set.</p>
             * @param buildBlock - <p>The build block to insert.</p>
             */
            insertBuildBlock(buildBlock: componyx.UI.Form.BuildBlock): void;
            /**
             * <p>Gets the active field set.</p>
             * @returns <p>The active field set.</p>
             */
            getActiveFieldSet(): componyx.UI.Form.FieldSet;
            /**
             * <p>Toggles sections mode.</p>
             */
            toggleSectionMode(): void;
            /**
             * <p>Disables sections mode: flattens all section fieldSets into root.</p>
             */
            disableSectionMode(): void;
            /**
             * <p>Enables sections mode: wraps all existing root fieldSets into a single Section.</p>
             */
            enableSectionMode(): void;
            /**
             * <p>Shows the previous visible Section, if any.
             * Navigates backward within the fieldSets sequence.</p>
             */
            previousSection(): void;
            /**
             * <p>Shows the next visible Section, if any.
             * Navigates forward within the fieldSets sequence.</p>
             */
            nextSection(): void;
            /**
             * <p>Checks if the currently visible Section is the first one.</p>
             * @returns <p>True if the current Section is the first; otherwise false.</p>
             */
            isFirstSection(): boolean;
            /**
             * <p>Checks if the currently visible Section is the last one.</p>
             * @returns <p>True if the current Section is the last; otherwise false.</p>
             */
            isLastSection(): boolean;
            /**
             * <p>Displays the specified Section and updates button and rule states accordingly.
             * Hides the currently visible Section if different.</p>
             * @param section - <p>The Section to display.</p>
             */
            showSection(section: componyx.UI.Form.Section): void;
            /**
             * <p>Initializes conditional and validation rules. Also updates form navigation button states and moves focus to first form field.
             * Is called automatically after the form is loaded or when a section is shown.</p>
             * @param fieldSets - <p>The fieldSets for which the rules will be initialized.</p>
             */
            initRules(fieldSets: componyx.UI.Form.FieldSet[]): void;
            /**
             * <p>Adds a new Section as root item into the fieldSets data.
             * Optionally, existing fieldSets can be wrapped inside this new section.</p>
             * @param [fieldSets] - <p>Optional array of fieldSets to include in the new Section.</p>
             * @returns <p>The newly added Section.</p>
             */
            addSection(fieldSets?: componyx.UI.Form.FieldSet[], focusTabInput?: boolean): componyx.UI.Form.Section;
            /**
             * <p>Removes the specified section from the fieldSets data.
             * Picks a neighbor section (previous if possible, otherwise next) to keep the form visible.</p>
             */
            removeSection(section: componyx.UI.Form.Section): void;
            /**
             * <p>Adds a repeated instance of the given field set, assigning it a new label and tracking it as part of a repeat group.</p>
             * @param fieldSet - <p>The original field set to repeat.</p>
             */
            addRepeatedFieldSet(fieldSet: componyx.UI.Form.FieldSet): void;
            /**
             * <p>Removes a repeated field set instance and updates related UI elements and data.</p>
             * <ul>
             * <li>Adjusts line breaks if necessary.</li>
             * <li>Removes the associated &quot;remove repeat&quot; button.</li>
             * <li>Re-enables the &quot;add repeat&quot; button if applicable.</li>
             * </ul>
             * @param fieldSet - <p>The repeated field set to remove.</p>
             */
            removeRepeatedFieldSet(fieldSet: componyx.UI.Form.FieldSet): void;
            /**
             * <p>Adds a new field set after the specified field into the fieldSets data.</p>
             * @param fieldSet - <p>The field set after which the new field will be added.</p>
             * @param clone - <p>A value indicating if the field set should be cloned.</p>
             * @returns <p>The added field set.</p>
             */
            addFieldSet(fieldSet: componyx.UI.Form.FieldSet, clone: boolean): componyx.UI.Form.FieldSet;
            /**
             * <p>Removes the specified field set from the fieldSets data and adjusts the line break if necessary.</p>
             * @param fieldSet - <p>The field set to be removed.</p>
             * @param resetConfigPanelBar - <p>A value indicating if the config panel bar must be reset (disabled and collapsed).</p>
             */
            removeFieldSet(fieldSet: componyx.UI.Form.FieldSet, resetConfigPanelBar: boolean): void;
            /**
             * <p>Adds a new field after the specified field into the fieldSets data.</p>
             * @param field - <p>The field after which the new field will be added.</p>
             * @param clone - <p>A value indicating if the field should be cloned.</p>
             * @returns <p>The added field.</p>
             */
            addField(field: componyx.UI.Form.Field, clone: boolean): componyx.UI.Form.Field;
            /**
             * <p>Removes the specified field from the fieldSets data and adjusts the line break if necessary.</p>
             * @param field - <p>The field to be removed.</p>
             * @param resetConfigPanelBar - <p>A value indicating if the config panel bar must be reset (disabled and collapsed).</p>
             */
            removeField(field: componyx.UI.Form.Field, resetConfigPanelBar: boolean): void;
            /**
             * <p>Resets the config panel bar to default disabled and collapsed state.</p>
             */
            resetConfigPanelBar(): void;
            /**
             * <p>Sets the label display for all fields in the field set.</p>
             * @param fieldSet - <p>The field set containing the fields for which to set the label display.</p>
             * @param labelDisplay - <p>The label display.</p>
             */
            setLabelDisplay(fieldSet: componyx.UI.Form.FieldSet, labelDisplay: componyx.UI.FormField.LabelDisplayOption): void;
            /**
             * <p>Destroys the section</p>
             * @param section - <p>The section to destroy.</p>
             */
            destroySection(section: componyx.UI.Form.Section): void;
            /**
             * <p>Renders the section.</p>
             * @param section - <p>The section to render.</p>
             */
            renderSection(section: componyx.UI.Form.Section): void;
            /**
             * <p>Updates simple settings that don't required a re-render.</p>
             * @param section - <p>The section to update.</p>
             */
            updateSection(section: componyx.UI.Form.Section): void;
            /**
             * <p>Destroys the field-set.</p>
             * @param fieldSet - <p>The field-set to destroy.</p>
             */
            destroyFieldSet(fieldSet: componyx.UI.Form.FieldSet): void;
            /**
             * <p>Renders the field-set.</p>
             * @param fieldSet - <p>The field-set to render.</p>
             */
            renderFieldSet(fieldSet: componyx.UI.Form.FieldSet): void;
            /**
             * <p>Updates simple field set settings that don't required a re-render.</p>
             * @param fieldSet - <p>The field-set to update.</p>
             */
            updateFieldSet(fieldSet: componyx.UI.Form.FieldSet): void;
            /**
             * <p>Renders the field.</p>
             * @param field - <p>The field to render.</p>
             */
            renderField(field: componyx.UI.Form.Field): void;
            /**
             * <p>Updates simple field settings that don't required a re-render.</p>
             * @param field - <p>The field to update.</p>
             */
            updateField(field: componyx.UI.Form.FieldSet): void;
            /**
             * <p>Updates the field with new options for build mode view.</p>
             * @param field - <p>The field to update.</p>
             */
            updateFieldOptions(field: componyx.UI.Form.FieldSet): void;
            /**
             * <p>Destroys the field.</p>
             * @param field - <p>The field to destroy.</p>
             */
            destroyField(field: componyx.UI.Form.Field): void;
            /**
             * <p>Recursively assign parent references to each field set and its nested field sets.</p>
             * @param fieldSets - <p>Array of field sets or sections.</p>
             * @param [parent = null] - <p>Parent field set (null if at root level).</p>
             */
            setParentReferences(fieldSets: componyx.UI.Form.FieldSet[], parent?: componyx.UI.Form.FieldSet | null): void;
            /**
             * <p>Adds a line break to the field.</p>
             * @param field - <p>The field or field set.</p>
             */
            addLineBreak(field: componyx.UI.Form.Field | componyx.UI.Form.FieldSet): void;
            /**
             * <p>Removes a line break from the field.</p>
             * @param field - <p>The field or field set.</p>
             * @param updateProperty - <p>A value indicating if the lineBreak property is also updated.</p>
             */
            removeLineBreak(field: componyx.UI.Form.Field | componyx.UI.Form.FieldSet, updateProperty?: boolean): void;
            /**
             * <p>Gets the css class if it exists and otherwise the default css class.</p>
             * @param cssClassValue - <p>The default css class value (one of the classOption values).</p>
             * @returns <p>The css class.</p>
             */
            getCssClass(cssClassValue: string): string;
            /**
             * <p>Enables or disables remove buttons for root fieldSets, at least one fieldSet is required.</p>
             */
            updateRemoveButtonState(): void;
            /**
             * <p>Ensures that the object has a valid identifier if it is not set.</p>
             * @param isClone - <p>A value indicating if this field is cloned.</p>
             * @returns <p>The passed object.</p>
             */
            ensureItemId(item: componyx.UI.Form.Field | componyx.UI.Form.FieldSet | componyx.UI.Form.Section, isClone: boolean): componyx.UI.Form.Field | componyx.UI.Form.FieldSet | componyx.UI.Form.Section;
            /**
             * <p>Deselects the currently selected section.</p>
             */
            deselectSection(): void;
            /**
             * <p>Selects the given section, making it visible and deselecting the previous one.</p>
             * @param section - <p>The section to select.</p>
             * @param selectFirst - <p>A value indicating if the first field or fieldSet is selected.</p>
             */
            selectSection(section: componyx.UI.Form.Section, selectFirst: boolean): void;
            /**
             * <p>Deselects the currently selected field set.</p>
             */
            deselectFieldSet(): void;
            /**
             * <p>Selects the given field set and applies selected styling.</p>
             * @param fieldSet - <p>The field set to select.</p>
             */
            selectFieldSet(fieldSet: any): void;
            /**
             * <p>Deselects the currently selected field.</p>
             */
            deselectField(): void;
            /**
             * <p>Selects the given field and applies selected styling.</p>
             * @param field - <p>The field to select.</p>
             */
            selectField(field: any): void;
            /**
             * <p>Selects the first field or field set.</p>
             * @param [section] - <p>The section to search in. Defaults to the first root item.</p>
             */
            selectFirst(section?: componyx.UI.Form.Section | componyx.UI.Form.FieldSet): void;
            /**
             * <p>Gets a value indicating whether the form is in edit mode.</p>
             */
            isEditMode(): boolean;
            /**
             * <p>Gets a value indicating whether the form is in view mode.</p>
             */
            isViewMode(): boolean;
            /**
             * <p>Schedules an auto-save after a delay. Resets the timer if called repeatedly.</p>
             */
            scheduleSave(): void;
            /**
             * <p>Saves the current form definition by calling the configured save endpoint.
             * Triggers onSave events and updates the UI save status indicator.</p>
             * @returns <p>Resolves with the save result object.</p>
             */
            save(): Promise<object>;
            /**
             * <p>Submits the form values by calling the configured submit endpoint.
             * Executes rule-engine submit triggers and fires submit events.</p>
             * @returns <p>Resolves when submission and related rules have completed.</p>
             */
            submit(): Promise<void>;
            /**
             * <p>Rebinds legend inputs for all child field sets.
             * If no fieldSet provided, processes all field sets recursively.</p>
             * @param [fieldSet = null] - <p>The parent field set containing child sets.</p>
             */
            rebindFieldSetLabels(fieldSet?: any): void;
            /**
             * <p>Rebinds label inputs and possible content field values for all fields in the given field set or all fields in the form if none given.</p>
             * @param [fieldSet = null] - <p>The field set containing fields to rebind.</p>
             */
            rebindFieldElements(fieldSet?: any): void;
            /**
             * <p>Converts serialized objects back to their corresponding class instances.</p>
             * @param fieldSets - <p>An array of field set objects (FieldSet or Section) to rehydrate.</p>
             */
            rehydrate(fieldSets: componyx.UI.Form.FieldSet[] | componyx.UI.Form.Section[]): void;
            /**
             * <p>Renders the component.</p>
             */
            render(): void;
        }
    }
}