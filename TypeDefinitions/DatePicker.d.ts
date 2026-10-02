declare namespace componyx 
{
    namespace UI
    {
        interface DatePicker extends componyx.UI.base.methods { }
        /**
         * <p>DatePicker class.</p>
         */
        class DatePicker extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new DatePicker instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<DatePicker> | HTMLElement);
            /**
             * <p>DatePicker events</p>
             */
            events: componyx.UI.DatePicker.DatePickerEvents;
            /**
             * <p>Resets all inputs to the initial value.</p>
             * @param [fireEvent = false] - <p>A value indicating if the onChanged event is fired.</p>
             */
            reset(fireEvent?: boolean): void;
            /**
             * <p>Clears all input values.</p>
             * @param [fireEvent = false] - <p>A value indicating if the onChanged event is fired.</p>
             */
            clear(fireEvent?: boolean): void;
            /**
             * <p>Selects the text of the first input field of the datepicker.</p>
             */
            select(): void;
            /**
             * <p>Gets the day numeric box.</p>
             * @returns <p>The numeric box instance.</p>
             */
            getDayNumericBox(): componyx.UI.NumericBox;
            /**
             * <p>Gets the month numeric box.</p>
             * @returns <p>The numeric box instance.</p>
             */
            getMonthNumericBox(): componyx.UI.NumericBox;
            /**
             * <p>Gets the year numeric box.</p>
             * @returns <p>The numeric box instance.</p>
             */
            getYearNumericBox(): componyx.UI.NumericBox;
            /**
             * <p>Gets the calendar month numeric box.</p>
             * @returns <p>The numeric box instance.</p>
             */
            getCalendarMonthNumericBox(): componyx.UI.NumericBox;
            /**
             * <p>Gets the calendar year numeric box.</p>
             * @returns <p>The numeric box instance.</p>
             */
            getCalendarYearNumericBox(): componyx.UI.NumericBox;
            /**
             * <p>Shows the calendar.</p>
             */
            showCalendar(): void;
            /**
             * <p>Hides the calendar.</p>
             */
            hideCalendar(): void;
            /**
             * <p>Gets the selected date.</p>
             * @returns <p>The selected date.</p>
             */
            getDate(): Date;
            /**
             * <p>Sets the date.</p>
             * @param date - <p>The date object.</p>
             * @param [fireEvent = false] - <p>A value indicating if the onChanged event is fired.</p>
             */
            setDate(date: Date, fireEvent?: boolean): void;
            /**
             * <p>Sets the date.</p>
             * @param value - <p>The date value in the specified date format.</p>
             * @param [fireEvent = false] - <p>A value indicating if the onChanged event is fired.</p>
             */
            setValue(value: string, fireEvent?: boolean): void;
            /**
             * <p>Gets the input field value which holds the date in the specified date format.</p>
             * @returns <p>The selected date value in the specified date format.</p>
             */
            getValue(): string;
            /**
             * <p>Gets the input field value as ISO8601 string.</p>
             * @returns <p>The selected date value as ISO8601 string.</p>
             */
            getISOValue(): string;
            /**
             * <p>Defines the template for the input separator.</p>
             * @param content - <p>The content of the template.</p>
             */
            setSeparatorTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Gets a value indicating if the specified date is allowed.</p>
             * @param date - <p>The date to check.</p>
             * @returns <p>A value indicating if the date is allowed.</p>
             */
            isAllowedDate(date: Date | string): boolean;
            /**
             * <p>Renders the component</p>
             */
            render(): void;
            /**
             * <p>Destroys the component.</p>
             */
            destroy(): void;
            /**
             * <p>Gets or sets the css class of the numericbox.</p>
            */
            cssClassNumericBox: string;
            /**
             * <p>Gets or sets the css class of the day input.</p>
            */
            cssClassDay: string;
            /**
             * <p>Gets or sets the css class of the month input.</p>
            */
            cssClassMonth: string;
            /**
             * <p>Gets or sets the css class of the year input.</p>
            */
            cssClassYear: string;
            /**
             * <p>Gets or sets the css class of the picker button.</p>
            */
            cssClassPicker: string;
            /**
             * <p>Gets or sets the css class of the calendar dialog.</p>
            */
            cssClassCalendar: string;
            /**
             * <p>Gets or sets the css class of the prev month button.</p>
            */
            cssClassPrevMonth: string;
            /**
             * <p>Gets or sets the css class of the next month button.</p>
            */
            cssClassNextMonth: string;
            /**
             * <p>Gets or sets the css class of the calendar header label.</p>
            */
            cssClassHeaderLabel: string;
            /**
             * <p>Gets or sets the css class of the week number cell in the calendar.</p>
            */
            cssClassWeekNumber: string;
            /**
             * <p>Gets or sets the css class of the current week row in the calendar.</p>
            */
            cssClassCurrentWeek: string;
            /**
             * <p>Gets or sets the css class of the current day cell in the calendar.</p>
            */
            cssClassToday: string;
            /**
             * <p>Gets or sets the css class of an inactive day cell in the calendar.</p>
            */
            cssClassInactive: string;
            /**
             * <p>Gets or sets the input format for dates. Default: MM/dd/yyyy.</p>
            */
            dateFormat: string;
            /**
             * <p>Gets or sets the first day of the week.</p>
            */
            firstDayOfWeek: componyx.UI.DatePicker.FirstDayOfWeekOption;
            /**
             * <p>Gets or sets a value indicating whether today should be used as initial selected date.</p>
            */
            today: boolean;
            /**
             * <p>Gets or sets the placeholder which is visible when the day input box has no value. Default: DD.</p>
            */
            dayPlaceholder: string;
            /**
             * <p>Gets or sets the placeholder which is visible when the month input box has no value. Default: MM.</p>
            */
            monthPlaceholder: string;
            /**
             * <p>Gets or sets the placeholder which is visible when the year input box has no value. Default: YYYY.</p>
            */
            yearPlaceholder: string;
            /**
             * <p>Gets or sets the view mode in which the date picker is rendered.</p>
            */
            viewMode: componyx.UI.DatePicker.ViewModeOption;
            /**
             * <p>Gets or sets a value indicating if week numbers are displayed in the calendar.</p>
            */
            weekNumbers: boolean;
            /**
             * <p>Gets or sets a value indicating whether the date picker is readonly.</p>
            */
            readOnly: boolean;
            /**
             * <p>Gets or sets a value indicating whether the date picker is disabled.</p>
            */
            disabled: boolean;
            /**
             * <p>Gets or sets a value indicating whether a calendar day has a leading zero.</p>
            */
            calendarDayLeadingZero: boolean;
            /**
             * <p>Gets or sets a value indicating whether focus on an input field is automaticly moved to the next field while typing.</p>
            */
            autoFocus: boolean;
            /**
             * <p>Gets or sets the month names as List of StringValue objects.</p>
            */
            months: String[];
            /**
             * <p>Gets or sets the day names as List of StringValue objects.</p>
            */
            days: String[];
            /**
             * <p>Gets or sets the hidden input field name which contains the selected date in the specified date format.</p>
            */
            name: string;
            /**
             * <p>Gets or sets the initial date value.</p>
            */
            value: string | Date;
            /**
             * <p>Gets or sets the minimum allowed date value.</p>
            */
            minValue: string | Date;
            /**
             * <p>Gets or sets the maximum allowed date value.</p>
            */
            maxValue: string | Date;
            /**
             * <p>Gets or sets a list of allowed calendar dates. Separate two date strings with a space to specify allowed range. When allowed dates are set, date input fields are rendered in readonly mode.</p>
            */
            allowedDates: String[] | Date[];
            /**
             * <p>Gets or sets a value indicating if the dates specified in the dates property are disallowed instead of the default allowed.</p>
            */
            disallowDates: boolean;
            /**
             * <p>Gets or sets the id of the picker button from which the settings are cloned.</p>
            */
            pickerButtonId: string;
            /**
             * <p>Gets or sets the id of the day numeric box from which the settings are cloned.</p>
            */
            dayNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the month numeric box from which the settings are cloned.</p>
            */
            monthNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the year numeric box from which the settings are cloned.</p>
            */
            yearNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the month numeric box in the calendar from which the settings are cloned.</p>
            */
            calendarMonthNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the year numeric box in the calendar from which the settings are cloned.</p>
            */
            calendarYearNumericBoxId: string;
            /**
             * <p>Gets or sets the id of the dialog from which the settings are cloned.</p>
            */
            dialogId: string;
            /**
             * <p>Gets or sets the id of the hidden input from which the settings are cloned. The hidden input contains the date in the configured date-format when a valid date is given.</p>
            */
            hiddenInputId: string;
        }
        namespace DatePicker
        {
            /**
             * @property onFocus - <p>Event which fires when the date picker is focused.</p>
             * @property onBlur - <p>Event which fires when the date picker is blurred.</p>
             * @property onChanged - <p>Event which fires when the date has changed.</p>
             * @property onCalendarWeekRender - <p>Event which fires when a calendar week is rendered.</p>
             * @property onCalendarDayRender - <p>Event which fires when a calendar day is rendered.</p>
             */
            class DatePickerEvents extends componyx.UI.base.Events<componyx.UI.DatePicker>
            {
                constructor();
                /**
                 * <p>Event which fires when the date picker is focused.</p>
                */
                onFocus: componyx.UI.base.Event<componyx.UI.DatePicker, undefined>;
                /**
                 * <p>Event which fires when the date picker is blurred.</p>
                */
                onBlur: componyx.UI.base.Event<componyx.UI.DatePicker, undefined>;
                /**
                 * <p>Event which fires when the date has changed.</p>
                */
                onChanged: componyx.UI.base.Event<componyx.UI.DatePicker, componyx.UI.DatePicker.ChangedEventArgs>;
                /**
                 * <p>Event which fires when a calendar week is rendered.</p>
                */
                onCalendarWeekRender: componyx.UI.base.Event<componyx.UI.DatePicker, componyx.UI.DatePicker.CalendarRenderEventArgs>;
                /**
                 * <p>Event which fires when a calendar day is rendered.</p>
                */
                onCalendarDayRender: componyx.UI.base.Event<componyx.UI.DatePicker, componyx.UI.DatePicker.CalendarRenderEventArgs>;
            }
            /**
             * <p>DatePicker changed event arguments.</p>
             */
            type ChangedEventArgs = {
                /** <p>The selected date, or null when the date was cleared.</p> */
                date: Date | null;
            };
            /**
             * <p>DatePicker calendar render event arguments (week and day).</p>
             */
            type CalendarRenderEventArgs = {
                /** <p>The table row of the calendar week.</p> */
                row: HTMLTableRowElement;
                /** <p>The table cell of the calendar day (onCalendarDayRender only).</p> */
                cell?: HTMLTableCellElement;
                /** <p>The button of the calendar day (onCalendarDayRender only).</p> */
                button?: componyx.UI.Button;
                /** <p>The date of the first day shown in the week row (week render) or the date of the day (day render).</p> */
                date: Date;
            };
            /**
             * <p>FirstDayOfWeekOption</p>
             */
            enum FirstDayOfWeekOption
            {
                SUNDAY = 0,
                MONDAY = 1,
                SATURDAY = 6
            }
            /**
             * <p>ViewModeOption</p>
             */
            enum ViewModeOption
            {
                INPUT_CALENDAR_POPUP = 0,
                INPUT_CALENDAR_STATIC = 1,
                INPUT = 2,
                CALENDAR = 3,
                CALENDAR_POPUP = 4
            }
        }
    }
}