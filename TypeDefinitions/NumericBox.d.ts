declare namespace componyx 
{
    namespace UI
    {
        interface NumericBox extends componyx.UI.base.methods { }
        /**
         * <p>NumericBox class.</p>
         */
        class NumericBox extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new NumericBox instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<NumericBox> | HTMLElement);
            /**
             * <p>NumericBox events</p>
             */
            events: componyx.UI.NumericBox.NumericBoxEvents;
            /**
             * <p>Sets the placeholder text.</p>
             * @param text - <p>The placeholder text.</p>
             */
            setPlaceholder(text: string): void;
            /**
             * <p>Selects the text of the input box.</p>
             */
            select(): void;
            /**
             * <p>Sets focus on the input element.</p>
             */
            focus(): void;
            /**
             * <p>Gets the input element.</p>
             */
            getInput(): HTMLElement;
            /**
             * <p>Gets the input value.</p>
             * @returns <p>The value as formatted string.</p>
             */
            getValue(): string;
            /**
             * <p>Gets the value.</p>
             * @returns <p>The value as number.</p>
             */
            getNumberValue(): number | null;
            /**
             * <p>Sets the input value.</p>
             * @param value - <p>The value to set.</p>
             * @param [fireChange = true] - <p>A value indicating if the change event is fired.</p>
             */
            setValue(value: string, fireChange?: boolean): void;
            /**
             * <p>Resets the input to the initial value.</p>
             * @param [fireChange = true] - <p>A value indicating if the change event is fired.</p>
             */
            reset(fireChange?: boolean): void;
            /**
             * <p>Clears the input value.</p>
             * @param [fireChange = true] - <p>A value indicating if the change event is fired.</p>
             */
            clear(fireChange?: boolean): void;
            /**
             * <p>Increments the value with one step.</p>
             */
            increment(): void;
            /**
             * <p>Decrements the value with one step.</p>
             */
            decrement(): void;
            /**
             * <p>Renders the component</p>
             */
            render(): void;
            /**
             * <p>Destroys the component.</p>
             */
            destroy(): void;
            /**
             * <p>Gets or sets the css class of the numeric box when it is disabled.</p>
            */
            cssClassDisabled: string | null;
            /**
             * <p>Gets or sets the css class of the numeric box when it is readonly.</p>
            */
            cssClassReadOnly: string | null;
            /**
             * <p>Gets or sets the css class of the button holder.</p>
            */
            cssClassButtonHolder: string | null;
            /**
             * <p>Gets or sets the css class of the buttons.</p>
            */
            cssClassButton: string | null;
            /**
             * <p>Gets or sets the css class of the plus button.</p>
            */
            cssClassPlus: string | null;
            /**
             * <p>Gets or sets the css class of the minus button.</p>
            */
            cssClassMinus: string | null;
            /**
             * <p>Gets or sets if the numeric box is disabled.</p>
            */
            disabled: boolean;
            /**
             * <p>Gets or sets if the numeric box is readonly.</p>
            */
            readOnly: boolean;
            /**
             * <p>Gets or sets if keyboard navigation is allowed.</p>
            */
            keyboardNavigation: boolean;
            /**
             * <p>Gets or sets if the plus and minus buttons are visible.</p>
            */
            showButtons: boolean;
            /**
             * <p>Gets or sets a value indicating if the buttons are displayed vertically instead of horizontally.</p>
            */
            verticalButtons: boolean;
            /**
             * <p>Gets or sets a value indicating if the buttons are focusable.</p>
            */
            focusableButtons: boolean;
            /**
             * <p>Gets or sets the minimium allowed value.</p>
            */
            minValue: number | null;
            /**
             * <p>Gets or sets the maximum allowed value.</p>
            */
            maxValue: number | null;
            /**
             * <p>Gets or sets the width of the component in the specified CSS unit (e.g., px, %, or ch).</p>
            */
            width: string;
            /**
             * <p>Gets or sets the incremental value when using plus or minus.</p>
            */
            incrementalValue: number;
            /**
             * <p>Gets or sets the placeholder which is visible when the input box has no value.</p>
            */
            placeholder: string | null;
            /**
             * <p>Gets or sets the decimal separator. Default: '.'</p>
            */
            decimalSeparator: string;
            /**
             * <p>Gets or sets the group separator.</p>
            */
            groupSeparator?: string | null;
            /**
             * <p>Gets or sets the amount of decimal places.</p>
            */
            precision: number;
            /**
             * <p>Gets or sets the decimal rounding type that should be applied.</p>
            */
            rounding: componyx.UI.NumericBox.RoundingOption;
            /**
             * <p>Gets or sets if the input value can hold leading zeros.</p>
            */
            leadingZeros: boolean;
            /**
             * <p>Gets or sets if the input value can hold trailing zeros at the decimal side.</p>
            */
            trailingZeros: boolean;
            /**
             * <p>Gets or sets the value to right-align the digits by padding this value to the left.</p>
            */
            digitPadLeftValue: string | null;
            /**
             * <p>Gets or sets if the input value is selected when the input gets focus.</p>
            */
            selectOnFocus: boolean;
            /**
             * <p>Gets or sets the id of the focus group to which this control belongs.</p>
            */
            focusGroupId: string | null;
            /**
             * <p>Gets or sets the value which indicates whether this control should get focus when there is no control focused in the focus group.</p>
            */
            focusGroupFirst: boolean;
            /**
             * <p>Gets or sets the input field name of the control.</p>
            */
            name: string;
            /**
             * <p>Gets or sets the initial value of the numeric box and holds the selected value on a postback.</p>
            */
            value: number | null;
            /**
             * <p>Gets or sets the id of the base button.</p>
            */
            buttonId: string | null;
            /**
             * <p>Gets or sets the tooltip manager used to display tooltips.</p>
            */
            tooltipManagerId: string | null;
            /**
             * <p>Gets or sets the id of the tooltip to show.</p>
            */
            tooltipId: string | null;
            /**
             * <p>Gets or sets the clientid of the HTML input.</p>
            */
            inputId: string | null;
        }
        namespace NumericBox
        {
            /**
            * @property onFocus - <p>Event which fires when the component is focused.</p>
            * @property onBlur - <p>Event which fires when the component is blurred.</p>
            * @property onInputFocus - <p>Event which fires when the input is focused.</p>
            * @property onInputBlur - <p>Event which fires when the input is blurred.</p>
            * @property onChange - <p>Event which fires when the input changes.</p>
            * @property onChanged - <p>Event which fires when the input is changed (onblur or onpointerup).</p>
            * @property onIncrement - <p>Event which fires when the value is incremented.</p>
            * @property onDecrement - <p>Event which fires when the value is decremented.</p>
            */
            class NumericBoxEvents extends componyx.UI.base.Events<componyx.UI.NumericBox>
            {
                constructor();
                /**
                 * <p>Event which fires when the component is focused.</p>
                */
                onFocus: componyx.UI.base.Event<componyx.UI.NumericBox, undefined>;
                /**
                 * <p>Event which fires when the component is blurred.</p>
                */
                onBlur: componyx.UI.base.Event<componyx.UI.NumericBox, undefined>;
                /**
                 * <p>Event which fires when the input is focused.</p>
                */
                onInputFocus: componyx.UI.base.Event<componyx.UI.NumericBox, componyx.UI.NumericBox.InputEventArgs>;
                /**
                 * <p>Event which fires when the input is blurred.</p>
                */
                onInputBlur: componyx.UI.base.Event<componyx.UI.NumericBox, componyx.UI.NumericBox.InputEventArgs>;
                /**
                 * <p>Event which fires when the input changes.</p>
                */
                onChange: componyx.UI.base.Event<componyx.UI.NumericBox, componyx.UI.NumericBox.ChangeEventArgs>;
                /**
                 * <p>Event which fires when the input is changed (onblur or onpointerup).</p>
                */
                onChanged: componyx.UI.base.Event<componyx.UI.NumericBox, componyx.UI.NumericBox.ChangeEventArgs>;
                /**
                 * <p>Event which fires when the value is incremented.</p>
                */
                onIncrement: componyx.UI.base.Event<componyx.UI.NumericBox, componyx.UI.NumericBox.StepEventArgs>;
                /**
                 * <p>Event which fires when the value is decremented.</p>
                */
                onDecrement: componyx.UI.base.Event<componyx.UI.NumericBox, componyx.UI.NumericBox.StepEventArgs>;
            }
            /**
             * <p>NumericBox input focus/blur event arguments.</p>
             */
            type InputEventArgs = {
                /** <p>The original event object.</p> */
                event: Event;
            };
            /**
             * <p>NumericBox change event arguments.</p>
             */
            type ChangeEventArgs = {
                /** <p>The input value without group separators and with '.' as decimal separator.</p> */
                value: string;
                /** <p>The original event object.</p> */
                event: Event;
                /** <p>A value indicating if the change was caused by an increment or decrement (onChange only).</p> */
                incremental?: boolean;
            };
            /**
             * <p>NumericBox increment/decrement event arguments.</p>
             */
            type StepEventArgs = {
                /** <p>The new value without group separators and with '.' as decimal separator.</p> */
                value: string;
                /** <p>The previous value without group separators and with '.' as decimal separator.</p> */
                previousValue: string;
                /** <p>The original event object.</p> */
                event: Event;
            };
            /**
             * <p>RoundingOption</p>
             */
            enum RoundingOption
            {
                NONE = 0,
                ROUND = 1,
                FLOOR = 2,
                CEIL = 3
            }
            namespace RoundingOption
            {
                /**
                 * <p>Gets the lowercase name of the option value.</p>
                 * @param value - <p>The enum value.</p>
                 */
                function getName(value: componyx.UI.NumericBox.RoundingOption): string;
            }
        }
    }
}