declare namespace componyx 
{
    namespace UI
    {
        interface ColorButton extends componyx.UI.base.methods { }
        /**
         * <p>ColorButton class.</p>
         */
        class ColorButton extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new ColorButton instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<ColorButton> | HTMLElement);
            /**
             * <p>ColorButton events</p>
             */
            events: componyx.UI.ColorButton.ColorButtonEvents;
            /**
             * <p>Gets the RGBA color value.</p>
             * @returns <p>The RGBA string value as in 'r,g,b,a' or '' if no color was set.</p>
             */
            getValue(): string;
            /**
             * <p>Sets the RGBA color value.</p>
             * @param rgbaValue - <p>The RGBA string value as in 'r,g,b,a'</p>
             */
            setValue(rgbaValue: string): void;
            /**
             * <p>Gets the RGBA color value</p>
             * @returns <p>The RGBA color value as array of numbers.</p>
             */
            getRGBA(): Number[];
            /**
             * <p>Sets the selected color to the specified RGBA color value.</p>
             * @param r - <p>Red value (0-255).</p>
             * @param g - <p>Green value (0-255).</p>
             * @param b - <p>Blue value (0-255).</p>
             * @param a - <p>Alpha value (0-1).</p>
             */
            setRGBA(r: string, g: string, b: string, a?: string): void;
            /**
             * <p>Returns the current selected hex color value.</p>
             */
            getHex(): string;
            /**
             * <p>Sets the selected color to the specified hex color value.</p>
             * @param value - <p>Hex color value.</p>
             */
            setHex(value: string): void;
            /**
             * <p>Returns the underlying Button component instance.</p>
             */
            getButton(): componyx.UI.Button;
            /**
             * <p>Renders the component</p>
             */
            render(): void;
            /**
             * <p>Handles the post render procedure.</p>
             */
            postRender(): void;
            /**
             * <p>Gets or sets the css class of the color box.</p>
            */
            cssClassColorBox: string;
            /**
             * <p>Gets or sets the color in the format Hue, Saturation, Brightness, Alpha.</p>
            */
            hsba: string | null;
            /**
             * <p>Gets or sets the color in the format Red, Green, Blue, Alpha.</p>
            */
            rgba: string | null;
            /**
             * <p>Gets or sets the color in the hexadecimal format.</p>
            */
            hex: string;
            /**
             * <p>Gets or sets the color in the either hexadecimal or RGBA format.</p>
            */
            value: string;
            /**
             * <p>Gets or sets the id of the hidden input from which the settings are cloned.</p>
            */
            hiddenInputId: string | null;
            /**
             * <p>Gets or sets the clientid of the button.</p>
            */
            buttonId: string | null;
            /**
             * <p>Gets or sets the id of the corresponding colorpicker.</p>
            */
            colorPickerId: string | null;
        }
        namespace ColorButton
        {
            /**
             * @property onConfirm - <p>Event which fires on a color change confirmation.</p>
             */
            class ColorButtonEvents extends componyx.UI.base.Events<componyx.UI.ColorButton>
            {
                constructor();
                /**
                 * <p>Event which fires on a color change confirmation.</p>
                */
                onConfirm: componyx.UI.base.Event<componyx.UI.ColorButton, componyx.UI.ColorButton.ConfirmEventArgs>;
            }
            /**
             * <p>ColorButton confirm event arguments.</p>
             */
            type ConfirmEventArgs = {
                /** <p>The confirmed RGBA color value as [r, g, b, a].</p> */
                rgba: number[];
            };
        }
    }
}