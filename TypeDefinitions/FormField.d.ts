declare namespace componyx 
{
    namespace UI
    {
        interface FormField extends componyx.UI.base.methods { }
        /**
         * <p>FormField class.</p>
         * @param id - <p>The id of the component.</p>
         * @param properties - <p>The properties used to initialize the component or the container element.</p>
         */
        class FormField extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            constructor(id: string, properties: any | HTMLElement);
            /**
             * <p>Enables or disables the inline state of the form field.</p>
             * @param enable - <p>A value indicating if the option should be enabled or disabled.</p>
             */
            setInline(enable: boolean): void;
            /**
             * <p>Enables or disables the required state of the form field.</p>
             * @param enable - <p>A value indicating if the option should be enabled or disabled.</p>
             */
            setRequired(enable: boolean): void;
            /**
             * <p>Enables or disables the borderless field style.</p>
             * @param enable - <p>A value indicating if the option should be enabled or disabled.</p>
             */
            setBorderless(enable: boolean): void;
            /**
             * <p>Enables or disables the transparent field style.</p>
             * @param enable - <p>A value indicating if the option should be enabled or disabled.</p>
             */
            setTransparent(enable: boolean): void;
            /**
             * <p>Enables or disables the switch field style.</p>
             * @param enable - <p>A value indicating if the option should be enabled or disabled.</p>
             */
            setSwitch(enable: boolean): void;
            /**
             * <p>Sets the label display type (inside above before after).</p>
             * @param display - <p>The label display option.</p>
             */
            setLabelDisplay(display: componyx.UI.FormField.LabelDisplayOption): void;
            /**
             * <p>Adds the content template for the label.</p>
             * @param content - <p>The label template content.</p>
             */
            setLabelTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Adds the content template for the field.</p>
             * @param content - <p>The field template content.</p>
             */
            setFieldTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Updates the label.</p>
             * @param content - <p>The label template content.</p>
             */
            updateLabel(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Links the label to the nested input by setting htmlFor and, if necessary, assigning an ID to the input.
             * Adds a placeholder attribute if missing to support CSS styling.</p>
             */
            linkLabelToInput(): void;
            /**
             * <p>Recreates the tooltip icon for the element and updates its trigger in the tooltip manager.</p>
             */
            updateTooltip(): void;
            /**
             * <p>Disables the form field.</p>
             */
            disable(): void;
            /**
             * <p>Enables the form field.</p>
             */
            enable(): void;
            /**
             * <p>Renders the component</p>
             */
            render(): void;
            /**
             * <p>Handles the post render procedure.</p>
             */
            postRender(): void;
            /**
             * <p>Gets or sets the css class which is appended to the formfield class when inline is enabled.</p>
            */
            cssClassInline: string;
            /**
             * <p>Gets or sets the css class which is appended to the formfield class when required is enabled.</p>
            */
            cssClassRequired: string;
            /**
             * <p>Gets or sets the css class which is appended to the formfield class when borderless is enabled.</p>
            */
            cssClassBorderless: string;
            /**
             * <p>Gets or sets the css class which is appended to the formfield class when transparent is enabled.</p>
            */
            cssClassTransparent: string;
            /**
             * <p>Gets or sets the css class which is appended to the formfield class when switch is enabled.</p>
            */
            cssClassSwitch: string;
            /**
             * <p>Gets or sets the css class of the form field label element.</p>
            */
            cssClassLabel: string;
            /**
             * <p>Gets or sets the css class of the form field tooltip icon element.</p>
            */
            cssClassTooltipIcon: string;
            /**
             * <p>Gets or sets the css class of the form field content wrapper element when wrapFieldContent is set to true or the field root element is not an input field and the label display is set to above/floating/inside.</p>
            */
            cssClassContentWrapper: string;
            /**
             * <p>Gets or sets the text label.</p>
            */
            label: string;
            /**
             * <p>Gets or sets a value indicating whether the formfield is displayed as inline or block element.</p>
            */
            inline: boolean;
            /**
             * <p>Gets or sets a value indicating if the form field is required.</p>
            */
            required: boolean;
            /**
             * <p>Gets or sets a value indicating if the form field is rendered without the top, left and right borders.</p>
            */
            borderless: boolean;
            /**
             * <p>Gets or sets a value indicating if the checkbox or radio field must be rendered transparent.</p>
            */
            transparent: boolean;
            /**
             * <p>Gets or sets a value indicating if the form field must be rendered as switch control. This option has effect only when the field is an input of type checkbox.</p>
            */
            switch: boolean;
            /**
             * <p>Gets or sets a value indicating if the form field content is placed inside a wrapper element.</p>
            */
            wrapFieldContent: boolean;
            /**
             * <p>Gets or sets a value indicating if the form field is disabled.</p>
            */
            disabled: boolean;
            /**
             * <p>Gets or sets a value indicating whether the label is displayed automatically, inside, above, before or after the form input field.</p>
            */
            labelDisplay: componyx.UI.FormField.LabelDisplayOption;
            /**
             * <p>Gets or sets the tooltip manager used to display tooltips.</p>
            */
            tooltipManagerId: string | null;
            /**
             * <p>Gets or sets the id of the tooltip to show.</p>
            */
            tooltipId: string | null;
        }
        namespace FormField
        {
            /**
             * <p>LabelDisplayOption</p>
             */
            enum LabelDisplayOption
            {
                /**
                 * <p>The label display depends on the field type: displayed after when the field is a checkbox or radiobutton,
                 * displayed floating when the field is a basic textual input and displayed above for all other field types.</p>
                 */
                AUTO = 0,
                /**
                 * <p>the label is displayed inside the field when empty and not focused otherwise it will be displayed above the field.</p>
                 */
                FLOATING = 1,
                /**
                 * <p>the label is displayed inside the field and will be cleared when the input field gets focus, allowing placeholder to become visible.</p>
                 */
                INSIDE = 2,
                /**
                 * <p>the label is displayed above the field.</p>
                 */
                ABOVE = 3,
                /**
                 * <p>the label is displayed before the field.</p>
                 */
                BEFORE = 4,
                /**
                 * <p>the label is displayed after the field.</p>
                 */
                AFTER = 5
            }
            namespace LabelDisplayOption
            {
                /**
                 * <p>Gets the name of the specified value.</p>
                 * @param value - <p>The enum value.</p>
                 */
                function getName(value: componyx.UI.FormField.LabelDisplayOption): string;
            }
        }
    }
}