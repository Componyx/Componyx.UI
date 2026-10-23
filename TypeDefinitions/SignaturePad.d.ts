declare namespace componyx 
{
    namespace UI
    {
        interface SignaturePad extends Omit<componyx.UI.base.methods, 'render' | 'destroy' | 'getCssClass' | 'cloneProperties' | 'postRender'> { }
        /**
         * SignaturePad class.
         */
        class SignaturePad extends componyx.UI.base.WebComponent
        {
            /**
             * Creates a new SignaturePad instance.
             * @param id - The id of the component.
             * @param properties - The properties used to initialize the component or the container element.
             */
            constructor(id?: string, properties?: Partial<SignaturePad> | HTMLElement);
            /**
             * Internal CSS class name constants. Override a class by defining a property named `cssClass<Key>`, where <Key> is the PascalCase key (e.g. 'CLEAR' -> 'cssClassClear').
             */
            readonly classOption: Readonly<{
                PAD: string;
                CLEAR: string;
                EMPTY: string;
                DISABLED: string;
            }>;
            /**
             * Gets or sets the width of the drawn line.
             */
            lineWidth: number;
            /**
             * Gets or sets the color of the drawn line. When not set, the CSS color of the drawing area is used, so the line follows the theme.
             */
            lineColor: string | null;
            /**
             * Gets or sets the line color used by toPng.
             */
            exportColor: string;
            /**
             * Gets or sets the background color used by toPng. Use 'transparent' or an empty value for a transparent background.
             */
            exportBackgroundColor: string;
            /**
             * Gets or sets a value indicating if the clear button is shown.
             */
            showClearButton: boolean;
            /**
             * Gets or sets the accessible label of the drawing area.
             */
            label: string;
            /**
             * Gets or sets the id of the HTML input to use.
             */
            inputId: string;
            /**
             * Gets or sets the id of a Button component whose settings are cloned to the clear button.
             */
            clearButtonId: string;
            /**
             * Gets the input element.
             */
            readonly input: HTMLInputElement;
            /**
             * Gets or sets the signature as SVG markup, or an empty string when there is no signature.
             */
            value: string;
            /**
             * Gets or sets a value indicating if the component is disabled.
             */
            disabled: boolean;
            /**
             * Gets or sets a value indicating if the signature is read-only (shown, but cannot be changed).
             */
            readOnly: boolean;
            /**
             * Gets the signature as SVG markup, or an empty string when there is no signature.
             */
            getValue(): string;
            /**
             * Sets the signature.
             * @param value - SVG markup, or an empty value to clear the signature.
             */
            setValue(value: string): void;
            /**
             * Returns true if there is no signature, otherwise false.
             */
            isEmpty(): boolean;
            /**
             * Clears the signature.
             */
            clear(): void;
            /**
             * Creates a PNG image of the signature, using exportColor for the line and exportBackgroundColor for the background.
             * When only a width is given, the height follows the proportions of the signature.
             * @param width - The width of the image in pixels. Defaults to the width of the drawing area when the signature was made.
             * @param height - The height of the image in pixels.
             * @returns A PNG data URL, or an empty string when there is no signature.
             */
            toPng(width?: number, height?: number): Promise<string>;
            /**
             * Renders the component.
             */
            render(): void;
            /**
             * Destroys the component.
             * @param keepEvents - A value indicating if component events should be kept.
             * @param removeElement - A value indicating if the corresponding HTML Element should be removed (default: true).
             */
            destroy(keepEvents?: boolean, removeElement?: boolean): void;
            /**
             * Renders the current value on the drawing area and in the input.
             */
            renderValue(): void;
            /**
             * Events attached to the component.
             */
            events: componyx.UI.SignaturePad.SignaturePadEvents;
        }
        namespace SignaturePad
        {
            class SignaturePadEvents extends componyx.UI.base.Events<componyx.UI.SignaturePad>
            {
                constructor();
                /**
                  * Event which fires when the signature has changed (after drawing a line or clearing).
                */
                onChanged: componyx.UI.base.Event<componyx.UI.SignaturePad, componyx.UI.SignaturePadEventArgs>;
            }
            /**
             * The event arguments of onChanged.
             * @property value - The current value (SVG markup, or an empty string when there is no signature).
             * @property event - The original event object.
             */
            type SignaturePadEventArgs = {
                value: string;
                event: Event;
            };
        }
    }
}