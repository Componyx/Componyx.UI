declare namespace componyx 
{
    namespace UI
    {
        interface ColorPicker extends componyx.UI.base.methods { }
        /**
         * <p>ColorPicker class.</p>
         */
        class ColorPicker extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new ColorPicker instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<ColorPicker> | HTMLElement);
            /**
                         * <p>ColorPicker events</p>
                         */
            events: componyx.UI.ColorPicker.ColorPickerEvents;
            /**
             * <p>Gets the corresponding box component.</p>
             * @returns <p>The box component.</p>
             */
            getBox(): componyx.UI.Box;
            /**
             * <p>Expands the colorpicker popup box.</p>
             * @param [expander] - <p>The expander element or id of the expander element.</p>
             * @param [rgba] - <p>RGBA color value.</p>
             * @param [confirmCallback] - <p>The callback function to call when the color is confirmed through the confirm button.</p>
             * @param [boxPosition] - <p>The popup box autoPosition.</p>
             * @param [modal] - <p>A value indicating if the colorpicker popup is shown as modal.</p>
             * @param [toggle] - <p>A value indicating if the colorpicker popup hides when already showing.</p>
             */
            expand(expander?: HTMLElement | string, rgba?: String[], confirmCallback?: (...params: any[]) => any, boxPosition?: componyx.UI.Box.AutoPositionOption, modal?: boolean, toggle?: boolean): void;
            /**
             * <p>Returns the current selected HSBA color value.</p>
             */
            getHSBA(): Number[];
            /**
             * <p>Sets the selected color to the specified HSBA color value.</p>
             * @param h - <p>Hue value (0-1).</p>
             * @param s - <p>Saturation value (0-1).</p>
             * @param b - <p>Brightness value (0-1).</p>
             * @param a - <p>Alpha value (0-1).</p>
             */
            setHSBA(h: number, s: number, b: number, a: number): void;
            /**
             * <p>Returns the current selected RGBA color value.</p>
             */
            getRGBA(): Number[];
            /**
             * <p>Sets the selected color to the specified RGBA color value.</p>
             * @param r - <p>Red value (0-255).</p>
             * @param g - <p>Green value (0-255).</p>
             * @param b - <p>Blue value (0-255).</p>
             * @param a - <p>Alpha value (0-1).</p>
             */
            setRGBA(r: number, g: number, b: number, a: number): void;
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
             * <p>Renders the component</p>
             */
            render(): void;
            /**
             * <p>Handles the post render procedure.</p>
             */
            postRender(): void;
            /**
             * <p>Destroys the component.</p>
             */
            destroy(): void;
            /**
             * <p>Converts the rgb value to hsv.</p>
             * @param r - <p>The red value 0-255.</p>
             * @param g - <p>The green value 0-255.</p>
             * @param b - <p>The blue value 0-255.</p>
             * @returns <p>The hue saturation value.</p>
             */
            static rgbToHsv(r: number, g: number, b: number): Number[];
            /**
             * <p>Converts the hsv value to rgb.</p>
             * @param h - <p>The hue value 0-1.</p>
             * @param s - <p>The saturation value 0-1.</p>
             * @param v - <p>The lightness value 0-1.</p>
             * @returns <p>The rgb value.</p>
             */
            static hsvToRgb(h: number, s: number, v: number): Number[];
            /**
             * <p>Gets or sets the css class of the preview color box.</p>
            */
            cssClassPreview: string;
            /**
             * <p>Gets or sets the css class of the saturation palette.</p>
            */
            cssClassSaturation: string;
            /**
             * <p>Gets or sets the css class of the hue palette.</p>
            */
            cssClassHue: string;
            /**
             * <p>Gets or sets the css class of the input container.</p>
            */
            cssClassInputContainer: string;
            /**
             * <p>Gets or sets the css class of the saturation and hue picker.</p>
            */
            cssClassPicker: string;
            /**
             * <p>Gets or sets the css class of the hue-saturation-brightness(value) input container.</p>
            */
            cssClassHSB: string;
            /**
             * <p>Gets or sets the css class of the red-green-blue input container.</p>
            */
            cssClassRGB: string;
            /**
             * <p>Gets or sets the css class of the alpha input container.</p>
            */
            cssClassAlpha: string;
            /**
             * <p>Gets or sets the css class of the hex input container.</p>
            */
            cssClassHex: string;
            /**
             * <p>Gets or sets the css class appended to the confirm button.</p>
            */
            cssClassConfirmButton: string;
            /**
             * <p>Gets or sets the css class appended to the cancel button.</p>
            */
            cssClassCancelButton: string;
            /**
             * <p>Gets or sets the css class appended to the clear button.</p>
            */
            cssClassClearButton: string;
            /**
             * <p>Gets or sets the css class of the popup box.</p>
             */
            cssClassPopupBox: string;
            /**
             * <p>Gets or sets the text label of the confirm button.</p>
            */
            confirmButtonLabel: string;
            /**
             * <p>Gets or sets the text label of the cancel button.</p>
            */
            cancelButtonLabel: string;
            /**
             * <p>Gets or sets the text label of the clear button.</p>
            */
            clearButtonLabel: string;
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
             * <p>Gets or sets a value indicating if the color picker is displayed within a popup with a color box as popup trigger.</p>
            */
            popupView: boolean;
            /**
             * <p>Gets or sets the clientid of the numeric box.</p>
            */
            numericBoxId: string | null;
            /**
             * <p>Gets or sets the clientid of the popup box.</p>
            */
            boxId: string | null;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the confirm button.</p>
            */
            confirmButtonId: string | null;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the cancel button.</p>
            */
            cancelButtonId: string | null;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned for the clear button.</p>
            */
            clearButtonId: string | null;
        }
        namespace ColorPicker
        {
            /**
             * @property onChange - <p>Event which fires on a color change.</p>
             * @property onConfirm - <p>Event which fires on a color change confirmation.</p>
             */
            class ColorPickerEvents extends componyx.UI.base.Events<componyx.UI.ColorPicker>
            {
                constructor();
                /**
                 * <p>Event which fires on a color change.</p>
                */
                onChange: componyx.UI.base.Event<componyx.UI.ColorPicker, componyx.UI.ColorPicker.ColorPickerEventArgs>;
                /**
                 * <p>Event which fires on a color change confirmation.</p>
                */
                onConfirm: componyx.UI.base.Event<componyx.UI.ColorPicker, componyx.UI.ColorPicker.ColorPickerEventArgs>;
            }
            /**
             * <p>ColorPicker event arguments.</p>
             */
            type ColorPickerEventArgs = {
                /** <p>The RGBA color value as [r, g, b, a].</p> */
                rgba: number[];
            };
        }
    }
}