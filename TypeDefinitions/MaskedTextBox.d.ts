declare namespace componyx 
{
    namespace UI
    {
        interface MaskedTextBox extends Omit<componyx.UI.base.methods, 'render' | 'destroy' | 'cloneProperties' | 'postRender'> { }
        /**
         * <p>MaskedTextBox class.</p>
         */
        class MaskedTextBox extends componyx.UI.base.WebComponent
        {
            /**
             * Creates a new MaskedTextBox instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id?: string, properties?: Partial<MaskedTextBox> | HTMLElement);
            /**
             * <p>Gets or sets a value indicating which characters are allowed on the underscore (_) slots.</p>
             */
            allowedCharacters: componyx.UI.MaskedTextBox.AllowedCharactersOption;
            /**
             * <p>Gets or sets the regular expression pattern when allowedCharacters is set to CUSTOM.</p>
             */
            customPattern: RegExp;
            /**
             * <p>Gets or sets a value indicating if the mask hint is displayed. If null, it's auto-detected based on the configured mask and character settings.</p>
             */
            showMaskHint: boolean | null;
            /**
             * <p>Gets or sets the hint text displayed when the input gets focus. This text is appended after the mask pattern. (A=letters, 0=digits)</p>
             */
            maskHint: string;
            /**
             * <p>Gets or sets the id of the HTML input to use.</p>
             */
            inputId: string;
            /**
             * <p>Gets the input element.</p>
             */
            readonly input: HTMLInputElement;
            /**
             * <p>Gets the raw input value without mask characters.</p>
             */
            value: string;
            /**
             * <p>Gets or sets the text box mask pattern. Use 'A' for letters, '0' for digits, and '_' for any allowed character slot. To include a literal A, 0, or _ in the mask, escape it with a backslash ().</p>
             */
            mask: string;
            /**
             * <p>Gets the raw input value without mask characters.</p>
             */
            getValue(): string;
            /**
             * <p>Sets the raw input value with or without mask characters.</p>
             * @param value - <p>The value to set.</p>
             */
            setValue(value: string): void;
            /**
             * <p>Sets the mask hint.</p>
             */
            setMaskHint(): void;
            /**
             * <p>Renders the component.</p>
             */
            render(): void;
            /**
             * <p>Events attached to the component.</p>
             */
            events: componyx.UI.base.Events<componyx.UI.MaskedTextBox> & componyx.UI.MaskedTextBox.MaskedTextBoxEvents;
        }
        namespace MaskedTextBox
        {
            /**
             * @property onChanged - <p>Fires when the input value has changed.</p>
             */
            type MaskedTextBoxEvents = {
                onChanged: componyx.UI.base.Event<componyx.UI.MaskedTextBox>;
            };
            /**
             * <p>AllowedCharactersOption</p>
             */
            enum AllowedCharactersOption
            {
                ALPHANUMERIC = 0,
                DIGITS = 1,
                LETTERS = 2,
                CUSTOM = 3
            }
        }
    }
}