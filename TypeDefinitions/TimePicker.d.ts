declare namespace componyx 
{
    namespace UI
    {
        interface TimePicker extends componyx.UI.base.methods { }
        /**
         * <p>TimePicker class.</p>
         * @property cssClassNumericBox - <p>Gets or sets the css class of the numericbox.</p>
         * @property cssClassHour - <p>Gets or sets the css class of the hour input.</p>
         * @property cssClassMinute - <p>Gets or sets the css class of the minute input.</p>
         * @property hourPlaceholder - <p>Gets or sets the placeholder which is visible when the hour input box has no value. Default: HH.</p>
         * @property minutePlaceholder - <p>Gets or sets the placeholder which is visible when the minute input box has no value. Default: MM.</p>
         * @property readOnly - <p>Gets or sets a value indicating whether the timepicker is readonly.</p>
         * @property disabled - <p>Gets or sets a value indicating whether the timepicker is disabled.</p>
         * @property autoFocus - <p>Gets or sets a value indicating whether focus on an input field is automaticly moved to the next field while typing.</p>
         * @property hourLeadingZero - <p>Gets or sets a value indicating whether a leading zero is added to the hour input box if it is not provided. Default: true.</p>
         * @property is24HourClock - <p>Gets or sets a value indicating whether a 12 or 24 hour clock is used.</p>
         * @property meridiemValue - <p>Gets or sets the meridiem value if its not set to a 24 hour clock.</p>
         * @property name - <p>Gets or sets the hidden input field name which contains the selected time value.</p>
         * @property value - <p>Gets or sets the the selected time value in format 'HH:MM'.</p>
         * @property minValue - <p>Gets or sets the minimum allowed time in format 'HH:MM'. Minutes must be divisible by 5.</p>
         * @property maxValue - <p>Gets or sets the maximum allowed time in format 'HH:MM'. Minutes must be divisible by 5.</p>
         * @property incrementalValue - <p>Gets or sets the incremental value in minutes. Minutes must be divisible by 5.</p>
         * @property allowedTimes - <p>Gets or sets a list of allowed clock times (format 'HH:MM'). Separate two date strings with a space to specify allowed range. When allowed times are set, date input fields are rendered in readonly mode.</p>
         * @property disallowTimes - <p>Gets or sets a value indicating if the times specified in the times property are disallowed instead of the default allowed.</p>
         * @property viewMode - <p>Gets or sets the view mode in which the time picker is rendered.</p>
         * @property hourNumericBoxId - <p>Gets or sets the id of the hour numeric box from which the settings are cloned.</p>
         * @property minuteNumericBoxId - <p>Gets or sets the id of the minute numeric box from which the settings are cloned.</p>
         * @property clockDialogId - <p>Gets or sets the id of the clock dialog from which the settings are cloned.</p>
         * @property pmButtonId - <p>Gets or sets the id of the post meridiem (PM) button from which the settings are cloned.</p>
         * @property amButtonId - <p>Gets or sets the id of the ante meridiem (AM) button from which the settings are cloned.</p>
         * @property pickerButtonId - <p>Gets or sets the id of the picker button from which the settings are cloned.</p>
         * @property hiddenInputId - <p>Gets or sets the id of the hidden input from which the settings are cloned.</p>
         * @param id - <p>The id of the component.</p>
         * @param properties - <p>The properties used to initialize the component or the container element.</p>
         */
        class TimePicker extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            constructor(id: string, properties: any | HTMLElement);
            /**
             * <p>TimePicker events</p>
             */
            events: componyx.UI.TimePicker.TimePickerEvents;
            /**
             * <p>Resets the inputs to the initial value.</p>
             * @param [fireEvent = false] - <p>A value indicating if the onChanged event is fired.</p>
             */
            reset(fireEvent?: boolean): void;
            /**
             * <p>Clears the input values.</p>
             * @param [fireEvent = false] - <p>A value indicating if the onChanged event is fired.</p>
             */
            clear(fireEvent?: boolean): void;
            /**
             * <p>Selects the text of the first input field of the timepicker.</p>
             */
            select(): void;
            /**
             * <p>Gets the hour value from the timepicker.</p>
             * @returns <p>Hour value.</p>
             */
            getHour(): number;
            /**
             * @returns <p>Minute value.</p>
             */
            getMinute(): number;
            /**
             * <p>Gets the time value in string format.</p>
             * @returns <p>Time value in the format 'hour:minute'.</p>
             */
            getValue(): string;
            /**
             * <p>Sets the time value.</p>
             * @param value - <p>The time value in the format hour:minute.</p>
             * @param [fireEvent = false] - <p>A value indicating if the onChanged event is fired.</p>
             */
            setValue(value: string, fireEvent?: boolean): void;
            /**
             * <p>Gets a value indicating if the time is before or after noon.</p>
             * @returns <p>PM or AM.</p>
             */
            getMeridiemValue(): string;
            /**
             * <p>Sets a value indicating if the time is before or after noon.</p>
             * @param value - <p>PM or AM.</p>
             */
            setMeridiemValue(value: string): void;
            /**
             * <p>Shows the clock.</p>
             */
            showClock(): void;
            /**
             * <p>Hides the clock.</p>
             */
            hideClock(): void;
            /**
             * <p>Selects the hour clock.</p>
             */
            selectHourClock(): void;
            /**
             * <p>Selects the minute clock.</p>
             */
            selectMinuteClock(): void;
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
             * @param keepEvents - <p>A value indicating if the events must be kept.</p>
             * @param [removeElement = true] - <p>A value indicating if the element must be removed.</p>
             */
            destroy(keepEvents: boolean, removeElement?: boolean): void;
            /**
             * <p>Gets or sets the css class of the numericbox.</p>
            */
            cssClassNumericBox: string;
            /**
             * <p>Gets or sets the css class of the hour input.</p>
            */
            cssClassHour: string;
            /**
             * <p>Gets or sets the css class of the minute input.</p>
            */
            cssClassMinute: string;
            /**
             * <p>Gets or sets the placeholder which is visible when the hour input box has no value. Default: HH.</p>
            */
            hourPlaceholder: string;
            /**
             * <p>Gets or sets the placeholder which is visible when the minute input box has no value. Default: MM.</p>
            */
            minutePlaceholder: string;
            /**
             * <p>Gets or sets a value indicating whether the timepicker is readonly.</p>
            */
            readOnly: boolean;
            /**
             * <p>Gets or sets a value indicating whether the timepicker is disabled.</p>
            */
            disabled: boolean;
            /**
             * <p>Gets or sets a value indicating whether focus on an input field is automaticly moved to the next field while typing.</p>
            */
            autoFocus: boolean;
            /**
             * <p>Gets or sets a value indicating whether a leading zero is added to the hour input box if it is not provided. Default: true.</p>
            */
            hourLeadingZero: boolean;
            /**
             * <p>Gets or sets a value indicating whether a 12 or 24 hour clock is used.</p>
            */
            is24HourClock: boolean;
            /**
             * <p>Gets or sets the meridiem value if its not set to a 24 hour clock.</p>
            */
            meridiemValue: string;
            /**
             * <p>Gets or sets the hidden input field name which contains the selected time value.</p>
            */
            name: string;
            /**
             * <p>Gets or sets the the selected time value in format 'HH:MM'.</p>
            */
            value: string | null;
            /**
             * <p>Gets or sets the minimum allowed time in format 'HH:MM'. Minutes must be divisible by 5.</p>
            */
            minValue: string | null;
            /**
             * <p>Gets or sets the maximum allowed time in format 'HH:MM'. Minutes must be divisible by 5.</p>
            */
            maxValue: string | null;
            /**
             * <p>Gets or sets the incremental value in minutes. Minutes must be divisible by 5.</p>
            */
            incrementalValue: number | null;
            /**
             * <p>Gets or sets a list of allowed clock times (format 'HH:MM'). Separate two date strings with a space to specify allowed range. When allowed times are set, date input fields are rendered in readonly mode.</p>
            */
            allowedTimes: String[];
            /**
             * <p>Gets or sets a value indicating if the times specified in the times property are disallowed instead of the default allowed.</p>
            */
            disallowTimes: boolean;
            /**
             * <p>Gets or sets the view mode in which the time picker is rendered.</p>
            */
            viewMode: componyx.UI.TimePicker.ViewModeOption;
            /**
             * <p>Gets or sets the id of the hour numeric box from which the settings are cloned.</p>
            */
            hourNumericBoxId: string | null;
            /**
             * <p>Gets or sets the id of the minute numeric box from which the settings are cloned.</p>
            */
            minuteNumericBoxId: string | null;
            /**
             * <p>Gets or sets the id of the clock dialog from which the settings are cloned.</p>
            */
            clockDialogId: string | null;
            /**
             * <p>Gets or sets the id of the post meridiem (PM) button from which the settings are cloned.</p>
            */
            pmButtonId: string | null;
            /**
             * <p>Gets or sets the id of the ante meridiem (AM) button from which the settings are cloned.</p>
            */
            amButtonId: string | null;
            /**
             * <p>Gets or sets the id of the picker button from which the settings are cloned.</p>
            */
            pickerButtonId: string | null;
            /**
             * <p>Gets or sets the id of the hidden input from which the settings are cloned.</p>
            */
            hiddenInputId: string | null;
        }
        namespace TimePicker
        {
            /**
             * @property onFocus - <p>Event which fires when the time picker is focused.</p>
             * @property onBlur - <p>Event which fires when the time picker is blurred.</p>
             * @property onChanged - <p>Event which fires when the value has changed.</p>
             */
            class TimePickerEvents extends componyx.UI.base.Events<componyx.UI.TimePicker>
            {
                constructor();
                /**
                 * <p>Event which fires when the time picker is focused.</p>
                */
                onFocus: componyx.UI.base.Event<componyx.UI.TimePicker, undefined>;
                /**
                 * <p>Event which fires when the time picker is blurred.</p>
                */
                onBlur: componyx.UI.base.Event<componyx.UI.TimePicker, undefined>;
                /**
                 * <p>Event which fires when the value has changed.</p>
                */
                onChanged: componyx.UI.base.Event<componyx.UI.TimePicker, componyx.UI.TimePicker.ChangedEventArgs>;
            }
            /**
             * <p>TimePicker changed event arguments.</p>
             */
            type ChangedEventArgs = {
                /** <p>The time value in the format 'HH:MM'.</p> */
                value: string;
            };
            /**
             * <p>ViewModeOption</p>
             */
            enum ViewModeOption
            {
                INPUT_CLOCK_POPUP = 0,
                INPUT_CLOCK_STATIC = 1,
                INPUT = 2,
                CLOCK = 3
            }
        }
    }
}