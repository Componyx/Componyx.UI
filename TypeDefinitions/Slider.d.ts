declare namespace componyx 
{
    namespace UI
    {
        interface Slider extends componyx.UI.base.methods { }
        /**
         * <p>Slider class.</p>
         */
        class Slider extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new Slider instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<Slider> | HTMLElement);
            /**
             * <p>Slider events</p>
             */
            events: componyx.UI.Slider.SliderEvents;
            /**
             * <p>Sets the value template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{value} This value will be replaced with the selected value or label text.</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setValueTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the start value template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{value} This value will be replaced with the selected value or label text.</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setStartValueTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Gets the selected slider value(s).</p>
             * @returns <p>The value for a slider or the range start and end values for a range slider.</p>
             */
            getValue(): number | Number[];
            /**
             * <p>Sets the (end) value.</p>
             * @param value - <p>The value to set.</p>
             */
            setValue(value: number): void;
            /**
             * <p>Sets the start value in a range slider.</p>
             * @param value - <p>The start value to set.</p>
             */
            setStartValue(value: number): void;
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
             * <p>Gets or sets a value indicating if the slider is rendered vertically.</p>
            */
            vertical: boolean;
            /**
             * <p>Gets or sets a value indicating if the slider has a start- and end-handle to set a range.</p>
            */
            range: boolean;
            /**
             * <p>Gets or sets a value indicating if the increase and decrease buttons are displayed.</p>
            */
            showButtons: boolean;
            /**
             * <p>Gets or sets a value indicating if tooltips are displayed when there are value changes.</p>
            */
            showTooltips: boolean;
            /**
             * <p>Gets or sets a value indicating if the slider is rendered in reverse direction.</p>
            */
            reversed: boolean;
            /**
             * <p>Gets or sets a value indicating if the css animation is activated when the track is selected.</p>
            */
            animation: boolean;
            /**
             * <p>Gets or sets a value indicating if the slider is disabled.</p>
            */
            disabled: boolean;
            /**
             * <p>Gets or sets a value indicating where the tickmark side is rendered.</p>
            */
            tickMarkSide: componyx.UI.Slider.TickMarkSideOption;
            /**
             * <p>Gets or sets a value indicating where the tickmark values are rendered.</p>
            */
            tickMarkValueSide: componyx.UI.Slider.TickMarkSideOption;
            /**
             * <p>Gets or sets the track size. If a track size is defined the CSS class 'fixed-track-size' is appended to the root element. You can also control the slider’s dimensions via CSS, either on the track or the root element.</p>
            */
            trackSize: string | number;
            /**
             * <p>Gets or sets the decimal separator used when displaying tickmark values.</p>
            */
            decimalSeparator: string;
            /**
             * <p>Gets or sets the decimal places used when displaying tickmark values.</p>
            */
            decimalPlaces: number;
            /**
             * <p>Gets or sets the minimum value.</p>
            */
            minValue: number;
            /**
             * <p>Gets or sets the maximum value.</p>
            */
            maxValue: number;
            /**
             * <p>Gets or sets the minimum change in value.</p>
            */
            minChange: number;
            /**
             * <p>Gets or sets the maximum change in value. If a maximum value is not set the handle can move to any clicked position in the track.</p>
            */
            maxChange: number;
            /**
             * <p>Gets or sets the start value of the range slider.</p>
            */
            startValue: number;
            /**
             * <p>Gets or sets the value (end value in range) of the slider. If range is set to true and this value is not set it will take the maxValue by default, otherwise it defaults to the minValue or 0.</p>
            */
            value: number | null;
            /**
             * <p>Gets or sets the amount of rendered tickmarks.</p>
            */
            tickMarks: number;
            /**
             * <p>Gets or sets the tickmark step on which a value is rendered. 0 means never, 1 means every item, 2 means every 2nd item.</p>
            */
            tickMarkValueStep: number;
            /**
             * <p>Gets or sets the tickmark step on which a minor tick is rendered. 0 means never, 1 means every item, 2 means every 2nd item and so on.</p>
            */
            minorTickMarkStep: number;
            /**
             * <p>Gets or sets the tickmark step on which a major tick is rendered. 0 means never, 1 means every item, 2 means every 2nd item and so on.</p>
            */
            majorTickMarkStep: number;
            /**
             * <p>Gets or sets the tickmark labels when text instead of a numeric value is desired.</p>
            */
            tickMarkLabels: {
                [key: number]: string;
            };
            /**
             * <p>Gets or sets the id of the decrease button from which the settings are cloned.</p>
            */
            decreaseButtonId: string | null;
            /**
             * <p>Gets or sets the id of the increase button from which the settings are cloned.</p>
            */
            increaseButtonId: string | null;
            /**
             * <p>Gets or sets the id of the tooltip manager from which the settings are cloned.</p>
            */
            tooltipManagerId: string | null;
            /**
             * <p>Gets or sets the id of the hidden input from which the attributes and properties are cloned. The hidden input contains the selected value.</p>
            */
            hiddenInputId: string | null;
            /**
             * <p>Gets or sets the id of the range-start hidden input from which the attributes and properties are cloned. The hidden input contains the selected range start value.</p>
            */
            startHiddenInputId: string | null;
            /**
             * <p>Gets or sets the id of the range hidden input from which the attributes and properties are cloned. The hidden input contains both the selected range start and end value.</p>
            */
            rangeHiddenInputId: string | null;
        }
        namespace Slider
        {
            /**
            * @property onFocus - <p>Event which fires when the component is focused.</p>
            * @property onBlur - <p>Event which fires when the component is blurred.</p>
            * @property onChange - <p>Event which fires when the value or start value is changed.</p>
            */
            class SliderEvents extends componyx.UI.base.Events<componyx.UI.Slider>
            {
                constructor();
                /**
                 * <p>Event which fires when the component is focused.</p>
                */
                onFocus: componyx.UI.base.Event<componyx.UI.Slider, undefined>;
                /**
                 * <p>Event which fires when the component is blurred.</p>
                */
                onBlur: componyx.UI.base.Event<componyx.UI.Slider, undefined>;
                /**
                 * <p>Event which fires when the value or start value is changed.</p>
                */
                onChange: componyx.UI.base.Event<componyx.UI.Slider, componyx.UI.Slider.ChangeEventArgs>;
            }
            /**
             * <p>Slider change event arguments.</p>
             */
            type ChangeEventArgs = {
                /** <p>A value indicating if the range start value changed instead of the (end) value.</p> */
                isStart: boolean;
                /** <p>The new value.</p> */
                value: number | null;
            };
            /**
             * <p>TickMarkSideOption</p>
             */
            enum TickMarkSideOption
            {
                NONE = 0,
                BEFORE = 1,
                AFTER = 2,
                BOTH = 3
            }
        }
    }
}