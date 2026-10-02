/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * DatePicker class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {Object} An instance of the component.
    * @property {String} cssClassNumericBox                                                 - Gets or sets the css class of the numericbox.
    * @property {String} cssClassDay                                                        - Gets or sets the css class of the day input.
    * @property {String} cssClassMonth                                                      - Gets or sets the css class of the month input.
    * @property {String} cssClassYear                                                       - Gets or sets the css class of the year input.
    * @property {String} cssClassPicker                                                     - Gets or sets the css class of the picker button.
    * @property {String} cssClassCalendar                                                   - Gets or sets the css class of the calendar dialog.
    * @property {String} cssClassPrevMonth                                                  - Gets or sets the css class of the prev month button.
    * @property {String} cssClassNextMonth                                                  - Gets or sets the css class of the next month button.
    * @property {String} cssClassHeaderLabel                                                - Gets or sets the css class of the calendar header label.
    * @property {String} cssClassWeekNumber                                                 - Gets or sets the css class of the week number cell in the calendar.
    * @property {String} cssClassCurrentWeek                                                - Gets or sets the css class of the current week row in the calendar.
    * @property {String} cssClassToday                                                      - Gets or sets the css class of the current day cell in the calendar.
    * @property {String} cssClassInactive                                                   - Gets or sets the css class of an inactive day cell in the calendar.
    * @property {String} dateFormat                                                         - Gets or sets the input format for dates. Default: MM/dd/yyyy.
    * @property {componyx.UI.DatePicker.FirstDayOfWeekOption} firstDayOfWeek             - Gets or sets the first day of the week.
    * @property {Boolean} today                                                             - Gets or sets a value indicating whether today should be used as initial selected date.
    * @property {String} dayPlaceholder                                                     - Gets or sets the placeholder which is visible when the day input box has no value. Default: DD.
    * @property {String} monthPlaceholder                                                   - Gets or sets the placeholder which is visible when the month input box has no value. Default: MM.
    * @property {String} yearPlaceholder                                                    - Gets or sets the placeholder which is visible when the year input box has no value. Default: YYYY.
    * @property {componyx.UI.DatePicker.ViewModeOption} viewMode                         - Gets or sets the view mode in which the date picker is rendered.
    * @property {Boolean} weekNumbers                                                       - Gets or sets a value indicating if week numbers are displayed in the calendar.
    * @property {Boolean} readOnly                                                          - Gets or sets a value indicating whether the date picker is readonly.
    * @property {Boolean} disabled                                                          - Gets or sets a value indicating whether the date picker is disabled.
    * @property {Boolean} calendarDayLeadingZero                                            - Gets or sets a value indicating whether a calendar day has a leading zero.
    * @property {Boolean} autoFocus                                                         - Gets or sets a value indicating whether focus on an input field is automaticly moved to the next field while typing.
    * @property {String[]} months                                                           - Gets or sets the month names as List of StringValue objects.
    * @property {String[]} days                                                             - Gets or sets the day names as List of StringValue objects.
    * @property {String} name                                                               - Gets or sets the hidden input field name which contains the selected date in the specified date format.
    * @property {String|Date} value                                                         - Gets or sets the initial date value.
    * @property {String|Date} minValue                                                      - Gets or sets the minimum allowed date value.
    * @property {String|Date} maxValue                                                      - Gets or sets the maximum allowed date value.
    * @property {String[]|Date[]} allowedDates				                                - Gets or sets a list of allowed calendar dates. Separate two date strings with a space to specify allowed range. When allowed dates are set, date input fields are rendered in readonly mode.
    * @property {Boolean} disallowDates						                                - Gets or sets a value indicating if the dates specified in the dates property are disallowed instead of the default allowed.
    * @property {String} pickerButtonId                                                     - Gets or sets the id of the picker button from which the settings are cloned.
    * @property {String} dayNumericBoxId                                                    - Gets or sets the id of the day numeric box from which the settings are cloned.
    * @property {String} monthNumericBoxId                                                  - Gets or sets the id of the month numeric box from which the settings are cloned.
    * @property {String} yearNumericBoxId                                                   - Gets or sets the id of the year numeric box from which the settings are cloned.
    * @property {String} calendarMonthNumericBoxId                                          - Gets or sets the id of the month numeric box in the calendar from which the settings are cloned.
    * @property {String} calendarYearNumericBoxId                                           - Gets or sets the id of the year numeric box in the calendar from which the settings are cloned.
    * @property {String} dialogId                                                           - Gets or sets the id of the dialog from which the settings are cloned.
    * @property {String} hiddenInputId                                                      - Gets or sets the id of the hidden input from which the settings are cloned. The hidden input contains the date in the configured date-format when a valid date is given.
    */
    componyx.UI.DatePicker = function DatePicker(id, properties)
    {
        // define private properties
        var _instance = this,
            _hidden,
            _today = new Date(),
            _date = null,
            _calendarDate = null,
            _dayInput = null,
            _monthInput = null,
            _yearInput = null,
            _pickerButton = null,
            _prevButton = null,
            _nextButton = null,
            _calendarDialog = null,
            _calendarMonthInput = null,
            _calendarYearInput = null,
            _day = null,
            _focus, _tabFocus,
            _dayButtons = [],
            _themeOption = $base.static.ThemeOption,
            _firstDayOfWeekOption = componyx.UI.DatePicker.FirstDayOfWeekOption,
            _viewModeOption = componyx.UI.DatePicker.ViewModeOption,
            _classOption =
            {
                NUMERICBOX: 'numeric-box',
                DAY: 'day',
                MONTH: 'month',
                YEAR: 'year',
                LAST: ' last',
                PICKER: 'button picker',
                CALENDAR: 'dialog calendar',
                PREVMONTH: 'button prev',
                NEXTMONTH: 'button next',
                HEADERLABEL: 'header-label',
                WEEKNUMBER: 'week-number',
                CURRENTWEEK: 'current-week',
                TODAY: 'today',
                INACTIVE: 'inactive'
            }

        // define public properties
        this.cssClassNumericBox = '';
        this.cssClassDay = '';
        this.cssClassMonth = '';
        this.cssClassYear = '';
        this.cssClassPicker = '';
        this.cssClassCalendar = '';
        this.cssClassPrevMonth = '';
        this.cssClassNextMonth = '';
        this.cssClassHeaderLabel = '';
        this.cssClassWeekNumber = '';
        this.cssClassCurrentWeek = '';
        this.cssClassToday = '';
        this.cssClassInactive = '';
        this.dateFormat = 'MM/dd/yyyy';
        this.firstDayOfWeek = _firstDayOfWeekOption.SUNDAY;
        this.today = false;
        this.dayPlaceholder = 'DD';
        this.monthPlaceholder = 'MM';
        this.yearPlaceholder = 'YYYY';
        this.viewMode = _viewModeOption.INPUT_CALENDAR_POPUP;
        this.weekNumbers = true;
        this.readOnly = false;
        this.disabled = false;
        this.calendarDayLeadingZero = false;
        this.autoFocus = true;
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
        this.name = '';
        this.value = null;
        this.minValue = null;
        this.maxValue = null;
        this.allowedDates = [];
        this.disallowDates = false;
        this.pickerButtonId = null;
        this.dayNumericBoxId = null;
        this.monthNumericBoxId = null;
        this.yearNumericBoxId = null;
        this.calendarMonthNumericBoxId = null;
        this.calendarYearNumericBoxId = null;
        this.dialogId = null;
        this.hiddenInputId = null;

        /**
         * @class
         * @augments componyx.UI.base.Events
         * @memberof componyx.UI.DatePicker
         * @property {componyx.UI.base.Event} onFocus               - Event which fires when the date picker is focused.
         * @property {componyx.UI.base.Event} onBlur                - Event which fires when the date picker is blurred.
         * @property {componyx.UI.base.Event} onChanged             - Event which fires when the date has changed. @see {@link componyx.UI.DatePicker.ChangedEventArgs}
         * @property {componyx.UI.base.Event} onCalendarWeekRender  - Event which fires when a calendar week is rendered. @see {@link componyx.UI.DatePicker.CalendarRenderEventArgs}
         * @property {componyx.UI.base.Event} onCalendarDayRender   - Event which fires when a calendar day is rendered. @see {@link componyx.UI.DatePicker.CalendarRenderEventArgs}
         * @see {@link componyx.UI.base.Events}
         */
        function DatePickerEvents(events)
        {
            Object.assign(this, events);

            this.onFocus = $base.static.createEvent('onFocus');
            this.onBlur = $base.static.createEvent('onBlur');
            this.onChanged = $base.static.createEvent('onChanged');
            this.onCalendarWeekRender = $base.static.createEvent('onCalendarWeekRender');
            this.onCalendarDayRender = $base.static.createEvent('onCalendarDayRender');
        };

        /**
         * DatePicker events
         * @type {componyx.UI.DatePicker.DatePickerEvents}
         */
        this.events = new DatePickerEvents(this.events);

        /**
         * DatePicker changed event arguments.
         * @typedef {Object} ChangedEventArgs
         * @memberof componyx.UI.DatePicker
         * @property {Date|null} date - The selected date, or null when the date was cleared.
         */

        /**
         * DatePicker calendar render event arguments (week and day).
         * @typedef {Object} CalendarRenderEventArgs
         * @memberof componyx.UI.DatePicker
         * @property {HTMLTableRowElement} row - The table row of the calendar week.
         * @property {HTMLTableCellElement} [cell] - The table cell of the calendar day (onCalendarDayRender only).
         * @property {componyx.UI.Button} [button] - The button of the calendar day (onCalendarDayRender only).
         * @property {Date} date - The date of the first day shown in the week row (week render) or the date of the day (day render).
         */

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        /** 
        * Resets all inputs to the initial value.
        * @param {Boolean} [fireEvent=false] A value indicating if the onChanged event is fired.
        */
        this.reset = function (fireEvent)
        {
            reset(($lib.isEmpty(fireEvent)) ? false : fireEvent);
        }

        /** 
        * Clears all input values.
        * @param {Boolean} [fireEvent=false] A value indicating if the onChanged event is fired.
        */
        this.clear = function (fireEvent)
        {
            clear(($lib.isEmpty(fireEvent)) ? false : fireEvent);
        }

        /** 
        * Selects the text of the first input field of the datepicker.
        */
        this.select = function ()
        {
            select();
        }

        /** 
        * Gets the day numeric box.
        * @returns {componyx.UI.NumericBox} The numeric box instance.
        */
        this.getDayNumericBox = function ()
        {
            return $UI.store[_instance.id + '_D'];
        }

        /** 
        * Gets the month numeric box.
        * @returns {componyx.UI.NumericBox} The numeric box instance.
        */
        this.getMonthNumericBox = function ()
        {
            return $UI.store[_instance.id + '_M'];
        }

        /** 
        * Gets the year numeric box.
        * @returns {componyx.UI.NumericBox} The numeric box instance.
        */
        this.getYearNumericBox = function ()
        {
            return $UI.store[_instance.id + '_Y'];
        }

        /** 
        * Gets the calendar month numeric box.
        * @returns {componyx.UI.NumericBox} The numeric box instance.
        */
        this.getCalendarMonthNumericBox = function ()
        {
            return (_calendarDialog) ? $UI.store[_calendarDialog.id + '_M'] : null;
        }

        /** 
        * Gets the calendar year numeric box.
        * @returns {componyx.UI.NumericBox} The numeric box instance.
        */
        this.getCalendarYearNumericBox = function ()
        {
            return (_calendarDialog) ? $UI.store[_calendarDialog.id + '_Y'] : null;
        }

        /** 
        * Shows the calendar.
        */
        this.showCalendar = function ()
        {
            showCalendar();
        }

        /** 
        * Hides the calendar.
        */
        this.hideCalendar = function ()
        {
            hideCalendar();
        }

        /** 
        * Gets the selected date.
        * @returns {Date} The selected date.
        */
        this.getDate = function ()
        {
            return getDate();
        }

        /** 
        * Sets the date.
        * @param {Date} date The date object.
        * @param {Boolean} [fireEvent=false] A value indicating if the onChanged event is fired.
        */
        this.setDate = function (date, fireEvent)
        {
            setDate(date, ($lib.isEmpty(fireEvent)) ? false : fireEvent);
        }

        /** 
        * Sets the date.
        * @param {String} value The date value in the specified date format.
        * @param {Boolean} [fireEvent=false] A value indicating if the onChanged event is fired.
        */
        this.setValue = function (value, fireEvent)
        {
            setDate(value || null, ($lib.isEmpty(fireEvent)) ? false : fireEvent);
        }

        /** 
        * Gets the input field value which holds the date in the specified date format.
        * @returns {String} The selected date value in the specified date format.
        */
        this.getValue = function ()
        {
            return getValue();
        }

        /** 
        * Gets the input field value as ISO8601 string.
        * @returns {String} The selected date value as ISO8601 string.
        */
        this.getISOValue = function ()
        {
            const dt = this.getDate();

            if (!dt)
                return null;

            return $lib.formatDate(dt, 'yyyy-MM-dd');
        }

        /** 
        * Defines the template for the input separator.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The content of the template.
        */
        this.setSeparatorTemplate = function (content)
        {
            _instance.addTemplate('Separator', content, true);
        }

        /** 
        * Gets a value indicating if the specified date is allowed.
        * @param {Date|String} date The date to check.
        * @returns {Boolean} A value indicating if the date is allowed.
        */
        this.isAllowedDate = function (date)
        {
            return isAllowedDate(date);
        }

        /** 
        * Renders the component
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'date-picker');
                return;
            }

            // render logic after loading resources
            draw();
        }

        /**
        * Executes the post render procedure.
        */
        this.postRender = function ()
        {
            if (_instance.renderState == $base.static.RenderState.RENDERED)
                return;

            if (_instance.viewMode == _viewModeOption.INPUT_CALENDAR_STATIC || _instance.viewMode == _viewModeOption.CALENDAR)
                showCalendar();

            if (_instance.viewMode == _viewModeOption.INPUT_CALENDAR_POPUP)
            {
                setInputEvent(_dayInput.getInput());
                setInputEvent(_monthInput.getInput());
                setInputEvent(_yearInput.getInput());
            }

            $base.methods.postRender.call(_instance);
        }

        /** 
         * Destroys the component.
         * @see {@link componyx.UI.base.methods#destroy}
         */
        this.destroy = function (...args)
        {
            dispose();
            $base.methods.destroy.call(this, ...args);
        }

        function preRender()
        {
            // initialize script and css
            var scripts = ['Button', 'NumericBox'];

            if (_instance.viewMode != _viewModeOption.INPUT)
                scripts.push('Dialog');

            return ['DatePicker', scripts];
        }

        function setInputEvent(input)
        {
            $lib.on(input, 'keyup', inputKeyUp);
        }

        function draw()
        {
            var format = _instance.dateFormat.toLowerCase(),
                splitChar = format.match(/[^\w]/)[0];

            _hidden = _instance.createSyncedInput(_instance.hiddenInputId, function ()
            {
                setDate(this.value);
            });

            initDates();

            if (($lib.touch && _instance.autoTouchConfig && isPopup()) || !$lib.isEmpty(_instance.allowedDates))
                _instance.readOnly = true;

            if (_instance.viewMode < 3)
            {
                addInput(format);
                format = format.substring(format.indexOf(splitChar) + 1);
                _instance.applyTemplate(_instance.element, 'Separator');
                addInput(format);
                format = format.substring(format.indexOf(splitChar) + 1);
                _instance.applyTemplate(_instance.element, 'Separator');
                addInput(format);
            }

            setValue();

            if (!$lib.isEmpty(_date))
                _day = _date.getDate();

            if (isPopup())
            {
                createPicker();
                $lib.on(window, 'keyup', checkTabFocus);
            }

            if (_instance.viewMode != _viewModeOption.INPUT)
                createCalendar();

            _instance.renderChildren();
        }

        function initDates()
        {
            var allowedDates = _instance.allowedDates;

            _date = _instance.value = _instance.value || _hidden.value;

            if (!$lib.isEmpty(_date))
                _date = convertDate(_date);
            else if (_instance.today)
                _date = _today;

            _instance.minValue = convertDate(_instance.minValue);
            _instance.maxValue = convertDate(_instance.maxValue);

            $lib.each(allowedDates, function (date, index)
            {
                if (date.indexOf(' ') > -1) // min-max
                    allowedDates[index] = [convertDate(date.split(' ')[0]), convertDate(date.split(' ')[1])];
                else
                    allowedDates[index] = [convertDate(date)];
            });
        }

        function convertDate(date)
        {
            if (typeof date !== 'string') return date;
            else if (/^\d{4}-\d{2}-\d{2}/.test(date)) // iso string date
                return new Date(date);
            else
                return $lib.parseDate(date, _instance.dateFormat);
        }

        function addInput(format)
        {
            if (format.indexOf('d') == 0)
                createDayInput(_instance.element);
            if (format.indexOf('m') == 0)
                createMonthInput(_instance.element);
            if (format.indexOf('y') == 0)
                createYearInput(_instance.element);
        }

        function createDayInput(container)
        {
            var format = _instance.dateFormat.toLowerCase(),
                last = (format.indexOf('d') > (format.indexOf('m') + format.indexOf('y'))) ? true : false;

            _dayInput = createInput(container, _instance.id + '_D', _instance.dayNumericBoxId);
            _dayInput.id = _instance.id + '_D';
            _dayInput.cssClass += ' ' + (_instance.cssClassDay || _classOption.DAY) + ((last) ? _classOption.LAST : '');
            _dayInput.placeholder = _instance.dayPlaceholder || '';
            _dayInput.maxLength = 2;
            _dayInput.minValue = 1;
            _dayInput.maxValue = 31;
            _dayInput.readOnly = _instance.readOnly;
            _dayInput.disabled = _instance.disabled;
            _dayInput.selectOnFocus = (_instance.autoFocus) ? true : _dayInput.selectOnFocus;
            _dayInput.showButtons = (last && $lib.isEmpty(_instance.allowedDates));
            _dayInput.leadingZeros = hasLeadingZero('dd');
            _dayInput.digitPadLeftValue = (_dayInput.leadingZeros) ? "00" : null;
            _dayInput.value = (_date) ? addNil(_date.getDate(), hasLeadingZero('dd')) : '';
            _dayInput.events.onChange.priorityAdd(dayInputChange);
            _dayInput.events.onChanged.priorityAdd(valueChanged, [false]);
            _dayInput.events.onIncrement.priorityAdd(incrementDay);
            _dayInput.events.onDecrement.priorityAdd(decrementDay);
        }

        function createMonthInput(container, calendar)
        {
            var cssClass = _instance.cssClassMonth || _classOption.MONTH,
                id = (calendar) ? _calendarDialog.id + '_M' : _instance.id + '_M',
                input = createInput(container, id, (calendar) ? _instance.calendarMonthNumericBoxId : _instance.monthNumericBoxId, calendar),
                format = _instance.dateFormat.toLowerCase(),
                last = (format.indexOf('m') > (format.indexOf('d') + format.indexOf('y'))) ? true : false;

            input.id = (calendar) ? _calendarDialog.id + '_M' : _instance.id + '_M';
            input.cssClass += ' ' + (_instance.cssClassMonth || _classOption.MONTH) + ((last) ? _classOption.LAST : '');
            input.placeholder = _instance.monthPlaceholder || '';
            input.maxLength = 2;
            input.minValue = 1;
            input.maxValue = 12;
            input.readOnly = (!calendar && _instance.readOnly) ? true : input.readOnly;
            input.disabled = _instance.disabled;
            input.selectOnFocus = (_instance.autoFocus) ? true : input.selectOnFocus;
            input.showButtons = (last && $lib.isEmpty(_instance.allowedDates));
            input.leadingZeros = hasLeadingZero('mm');
            input.digitPadLeftValue = (input.leadingZeros) ? "00" : null;
            input.value = (_date) ? addNil(_date.getMonth() + 1, hasLeadingZero('mm')) : '';
            input.events.onChanged.priorityAdd(valueChanged, [calendar]);
            input.events.onIncrement.priorityAdd(incrementMonth.bind(_instance, calendar));
            input.events.onDecrement.priorityAdd(decrementMonth.bind(_instance, calendar));

            if (!calendar)
            {
                _monthInput = input;
                _monthInput.events.onChange.priorityAdd(monthInputChange);
            }
            else
            {
                input.events.onChange.priorityAdd(moveFocus, ['m', calendar]);
                input.showButtons = (format.indexOf('m') > format.indexOf('y')) ? true : false;
                input.focusGroupId = _instance.id + '_C';
                _calendarMonthInput = input;
            }
        }

        function createYearInput(container, calendar)
        {
            var cssClass = _instance.cssClassYear || _classOption.YEAR,
                id = (calendar) ? _calendarDialog.id + '_Y' : _instance.id + '_Y',
                input = createInput(container, id, (calendar) ? _instance.calendarYearNumericBoxId : _instance.yearNumericBoxId, calendar),
                format = _instance.dateFormat.toLowerCase(),
                last = (format.indexOf('y') > (format.indexOf('d') + format.indexOf('m'))) ? true : false;

            input.cssClass += ' ' + (_instance.cssClassYear || _classOption.YEAR) + ((last) ? _classOption.LAST : '');
            input.placeholder = _instance.yearPlaceholder || '';
            input.maxLength = 4;
            input.minValue = 1800;
            input.maxValue = 9999;
            input.readOnly = (!calendar && _instance.readOnly) ? true : input.readOnly;
            input.disabled = _instance.disabled;
            input.selectOnFocus = (_instance.autoFocus) ? true : input.selectOnFocus;
            input.showButtons = (last && $lib.isEmpty(_instance.allowedDates));
            input.value = (_date) ? _date.getFullYear() : '';

            if (!calendar)
            {
                _yearInput = input;
                input.events.onChange.priorityAdd(yearInputChange);
                input.events.onIncrement.priorityAdd(yearInputChange);
                input.events.onDecrement.priorityAdd(yearInputChange);
            }
            else
            {
                _calendarYearInput = input;
                input.events.onChange.priorityAdd(moveFocus, ['y', calendar]);
                input.showButtons = (format.indexOf('y') > format.indexOf('m')) ? true : false;
                input.focusGroupId = _instance.id + '_C';
            }

            input.events.onIncrement.priorityAdd(valueChanged, [calendar]);
            input.events.onDecrement.priorityAdd(valueChanged, [calendar]);
            input.events.onChanged.priorityAdd(valueChanged, [calendar]);
        }

        function createInput(container, id, numericBoxId, calendar)
        {
            var input = $UI.createComponent(componyx.UI.NumericBox, { id: id, containerElement: container });

            input.clone($UI.store[numericBoxId], _instance);
            input.showing = true;
            input.cssClass = input.cssClass || _instance.cssClassNumericBox || _classOption.NUMERICBOX;
            input.focusGroupId = _instance.id;
            input.focusableButtons = false;
            input.events.onPostRender.priorityAdd(() => { _instance.isReady.apply(_instance); }, null);

            if (!calendar && _instance.viewMode == _viewModeOption.INPUT_CALENDAR_POPUP && !_instance.disabled)
            {
                input.events.onClick.priorityAdd(function ()
                {
                    _tabFocus = false;
                    showCalendar();
                });

                input.events.onFocus.priorityAdd(function ()
                {
                    _tabFocus = true;
                });
            }

            input.delegateFocusEvents(_instance);

            return input;
        }

        function checkTabFocus(e)
        {
            if (_tabFocus && e.key == 'Tab')
                showCalendar();

            _tabFocus = false;

            $lib.defer(function ()
            {
                const active = _instance.element.ownerDocument.activeElement;
                if (!_instance.element.contains(active) && _calendarDialog)
                {
                    _calendarDialog.hide();
                }
            }.bind(_instance));
        }

        function hasLeadingZero(part)
        {
            return _instance.dateFormat.toLowerCase().indexOf(part) > -1;
        }

        function addNil(val, leadingZero)
        {
            val = val.toString();

            if (!leadingZero)
                return val;

            return (val.length != 2) ? '0' + val : val;
        }

        function moveFocus(type, calendar, input, args)
        {
            var keyCode = (args.event) ? args.event.key : null;

            if (!_instance.autoFocus || !keyCode || keyCode == 'ArrowUp' || keyCode == 'ArrowDown')
                return;

            var format = _instance.dateFormat.toLowerCase(),
                splitChar = format.match(/[^\w]/)[0];

            if (calendar)
                format = format.replace('dd', '').replace(splitChar + splitChar, splitChar);

            var index = format.indexOf(type),
                nextIndex = index + format.substr(index).indexOf(splitChar) + 1,
                id, nextInput;

            if (!nextIndex || nextIndex == index)
            {
                var match = format.match(new RegExp(type, "g"));

                if (nextIndex == index && match && match.length == input.getValue().length) // last input is filled
                    valueChanged();

                return;
            }

            id = format.substr(nextIndex, 1).toUpperCase();
            id = (calendar) ? _calendarDialog.id + '_' + id : _instance.id + '_' + id;
            nextInput = $UI.store[id];

            if (input.getValue().length == (nextIndex - index) - 1)
                nextInput.select();
        }

        function dayInputChange(input, args)
        {
            var format = _instance.dateFormat.toLowerCase(),
                last = (format.indexOf('d') > (format.indexOf('m') + format.indexOf('y'))) ? true : false;

            _day = _dayInput.getValue();

            if (last)
                setMonthEnd(true);
            else if (validDate(_date) && parseFloat(_day) < 32 && (parseFloat(_day) > getDayCount(_date)))
            {
                if (format.indexOf('y') > format.indexOf('d'))
                    _yearInput.clear();

                if (format.indexOf('m') > format.indexOf('d'))
                    _monthInput.clear();
            }

            moveFocus('d', false, input, args);
        }

        function monthInputChange(input, args)
        {
            setMonthEnd(false);
            moveFocus('m', false, input, args);
        }

        function yearInputChange(input, args)
        {
            setMonthEnd(false);
            moveFocus('y', false, input, args);
        }

        function setMonthEnd(dayChange)
        {
            if (_yearInput.getValue().length != 4)
                return;

            var dayCount = null, day = null, format = _instance.dateFormat.toLowerCase(), digitPadLeftValue,
                date = parseDate(_yearInput.getValue(), _monthInput.getValue(), '01');

            if (!date || isNaN(date))
                return;

            dayCount = getDayCount(date);
            day = (parseFloat(_day) > dayCount) ? dayCount : _day;

            if (dayChange)
            {
                if (day.length == 1)
                {
                    digitPadLeftValue = _dayInput.digitPadLeftValue;
                    _dayInput.digitPadLeftValue = null;
                    _dayInput.setValue(day);
                    _dayInput.digitPadLeftValue = digitPadLeftValue;
                }
                else
                    _dayInput.setValue(day);
            }
            else
            {
                day = day || 1;
                _dayInput.setValue(day);
            }

            _day = day;

            return date;
        }

        function inputKeyUp(e)
        {
            var keyCode = e.key,
                hasDate = validDate(_date);

            if (hasDate && (keyCode == 'Enter' || keyCode == ' ') && _calendarDialog && _calendarDialog.showing)
            {
                hideCalendar();
                this.blur();
            }
        }

        function validDate(date)
        {
            return (date && !isNaN(date.getTime()));
        }

        function incrementDay(input, args)
        {
            if (validDate(_date))
            {
                _date.setDate(_date.getDate() + 1);
                _day = _date.getDate();
                setInputs(_date);
            }

            valueChanged();
        }

        function decrementDay(input, args)
        {
            if (validDate(_date))
            {
                _date.setDate(_date.getDate() - 1);
                _day = _date.getDate();
                setInputs(_date);

            }

            valueChanged();
        }

        function incrementMonth(calendar)
        {
            var date = (calendar) ? _calendarDate : _date;

            if (validDate(date))
                setNextMonth(calendar);

            valueChanged(calendar);
        }

        function decrementMonth(calendar)
        {
            var date = (calendar) ? _calendarDate : _date;

            if (validDate(date))
                setPreviousMonth(calendar);

            valueChanged(calendar);
        }

        function setPreviousMonth(calendar)
        {
            var date = (calendar) ? _calendarDate : _date,
                dayCount = getDayCount(new Date(date.getFullYear(), date.getMonth() - 1, 1));

            if (date.getDate() > dayCount)
            {
                date.setDate(dayCount);

                if (!calendar)
                    _day = dayCount;
            }

            date.setMonth(date.getMonth() - 1);
            setInputs(date, calendar);
        }

        function setNextMonth(calendar)
        {
            var date = (calendar) ? _calendarDate : _date,
                dayCount = getDayCount(new Date(date.getFullYear(), date.getMonth() + 1, 1));

            if (date.getDate() > dayCount)
            {
                date.setDate(dayCount);

                if (!calendar)
                    _day = dayCount;
            }

            date.setMonth(date.getMonth() + 1);
            setInputs(date, calendar);
        }

        function setInputs(date, calendar)
        {
            if (calendar)
            {
                _calendarMonthInput.setValue(addNil(date.getMonth() + 1, hasLeadingZero('mm')));
                _calendarYearInput.setValue(date.getFullYear());
            }
            else
            {
                _dayInput.setValue(addNil(date.getDate(), hasLeadingZero('dd')));
                _monthInput.setValue(addNil(date.getMonth() + 1, hasLeadingZero('mm')));
                _yearInput.setValue(date.getFullYear());
            }
        }

        function valueChanged(calendar)
        {
            if (!calendar)
            {
                setDate(parseDate(_yearInput.getValue(), _monthInput.getValue(), _dayInput.getValue()), true, false);

                if (validDate(_date))
                    showCalendar();
            }
            else
            {
                var month = _calendarMonthInput.getValue();
                var year = _calendarYearInput.getValue();
                if (!$lib.isEmpty(month) && !$lib.isEmpty(year))
                {
                    _calendarDate = new Date(parseFloat(year), parseFloat(month) - 1, 1);

                    if (validDate(_calendarDate))
                        updateCalendar();
                }
            }
        }

        function parseDate(year, month, day)
        {
            return $lib.parseDate($lib.format('{0}/{1}/{2}', year, addNil(month, true), addNil(day, true)), 'yyyy/mm/dd');
        }

        function createPicker()
        {
            var id = _instance.id + '_Picker';
            _pickerButton = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: _instance.element });

            _pickerButton.clone($UI.store[_instance.pickerButtonId], _instance);
            _pickerButton.transparent = true;
            _pickerButton.cssClass = _pickerButton.cssClass || _instance.cssClassPicker || _classOption.PICKER;
            _pickerButton.hasIcon = true;
            _pickerButton.events.onPostRender.priorityAdd(() => { _instance.isReady.apply(_instance); }, null);
            _pickerButton.command = function () { toggleCalendar(); };
            _pickerButton.type = componyx.UI.Button.TypeOption.CHECKBUTTON;
            _pickerButton.disabled = _instance.disabled;
            _pickerButton.delegateFocusEvents(_instance);
            _pickerButton.showing = true;
        }

        function createCalendar()
        {
            var id = _instance.id + '_Dialog',
                header = document.createElement('div'),
                content = document.createElement('div'),
                footer = document.createElement('div');

            content.id = id + '_Content';
            _calendarDialog = $UI.createComponent(componyx.UI.Dialog, { id: id, containerElement: _instance.element });

            _calendarDialog.clone($UI.store[_instance.dialogId], _instance);
            _calendarDialog.cssClass = _calendarDialog.cssClass || _instance.cssClassCalendar || _classOption.CALENDAR;
            _calendarDialog.autoFit = _calendarDialog.buttons.close = _calendarDialog.buttons.confirm = _calendarDialog.buttons.deny = _calendarDialog.buttons.cancel = false;
            _calendarDialog.events.onPostRender.priorityAdd(calendarReady, null);
            _calendarDialog.events.onPostRender.priorityAdd(() => { _instance.isReady.apply(_instance); }, null);
            _calendarDialog.setHeaderTemplate(header);
            _calendarDialog.setContentTemplate(content);
            _calendarDialog.setFooterTemplate(footer);
            _calendarDialog.expandDirection = componyx.UI.Box.ExpandDirectionOption.DOWN;

            if (isPopup())
            {
                _calendarDialog.expander = _instance.id;
                _calendarDialog.autoPosition = componyx.UI.Box.AutoPositionOption.EXPAND;
                _calendarDialog.autoInvertFit = _calendarDialog.autoFit = true;
                _calendarDialog.events.onHideComplete.priorityAdd(function () { _pickerButton.deselect(); }, null);
                _calendarDialog.hideOnOutsideClick = true;
            }
            else
            {
                _calendarDialog.autoPosition = componyx.UI.Box.AutoPositionOption.NONE;
                _calendarDialog.showing = true;
            }

            function calendarReady()
            {
                createHeader();
                createContent();
                createFooter();
            }

            function createHeader()
            {
                var button = createButton(_calendarDialog.id + '_Prev'),
                    label = document.createElement('span');

                button.id = _calendarDialog.id + '_Prev';
                button.cssClass = _instance.cssClassPrevMonth || _classOption.PREVMONTH;
                button.command = function () { prevMonth(); };
                button.delegateFocusEvents(_instance);
                _prevButton = button;

                button = createButton(_calendarDialog.id + '_Next');
                button.id = _calendarDialog.id + '_Next';
                button.cssClass = _instance.cssClassNextMonth || _classOption.NEXTMONTH;
                button.command = function () { nextMonth(); };
                button.delegateFocusEvents(_instance);
                _nextButton = button;

                label.id = _calendarDialog.id + '_HeaderLabel';
                label.className = _instance.cssClassHeaderLabel || _classOption.HEADERLABEL;
                header.appendChild(label);
            }

            function createButton(id)
            {
                var button = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: header });

                button.clone(null, _instance);
                button.showing = true;
                button.hasIcon = true;
                button.transparent = true;
                button.events.onPostRender.priorityAdd(() => { _instance.isReady.apply(_instance); }, null);

                return button;
            }

            function createContent()
            {
                var table = document.createElement('table'),
                    rowIndex = 0, columnIndex = 0,
                    cell = null, row = null;

                content.appendChild(table);
                drawHeader(table);

                for (; rowIndex < 6; ++rowIndex)
                {
                    row = table.insertRow(-1);

                    if (_instance.weekNumbers)
                    {
                        cell = row.insertCell(-1);
                        $lib.addClass(cell, _instance.cssClassWeekNumber || _classOption.WEEKNUMBER);
                    }

                    for (columnIndex = 0; columnIndex < 7; columnIndex++)
                    {
                        cell = row.insertCell(-1);
                    }
                }
            }

            function drawHeader(table)
            {
                var row = null, cell = null, index = 0;

                row = table.insertRow(-1);

                if (_instance.weekNumbers)
                {
                    cell = document.createElement('th');
                    $lib.addClass(cell, _instance.cssClassWeekNumber || _classOption.WEEKNUMBER);
                    row.appendChild(cell);
                }

                for (; index < 7; index++)
                {
                    cell = document.createElement('th');
                    cell.innerHTML = _instance.days[index];
                    $lib.addClass(cell, _instance.cssClassDay || _classOption.DAY);
                    row.appendChild(cell);
                }
            }

            function createFooter()
            {
                var format = _instance.dateFormat.toLowerCase();

                if (format.indexOf('m') < format.indexOf('y'))
                {
                    createMonthInput(footer, true);
                    createYearInput(footer, true);
                }
                else
                {
                    createYearInput(footer, true);
                    createMonthInput(footer, true);
                }
            }
        }

        function prevMonth()
        {
            setPreviousMonth(true);
            updateCalendar();
        }

        function nextMonth()
        {
            setNextMonth(true);
            updateCalendar();
        }

        function toggleCalendar()
        {
            if (!_calendarDialog.showing)
                showCalendar(true); // allow focus by tab on calendar elements
            else
                _calendarDialog.hide();
        }

        function showCalendar(allowFocusInside = false)
        {
            if (!_calendarDialog)
                return;

            var hasCalendarDate = validDate(_calendarDate),
                hasDate = validDate(_date),
                date = _date || _today;

            if (_pickerButton)
                _pickerButton.select();

            if (!isPopup())
                allowFocusInside = true;

            if (!hasCalendarDate || !hasDate || !isPopup())
            {
                _calendarDate = new Date(date.getFullYear(), date.getMonth(), 1);
                updateCalendar();
                _calendarDialog.show();
            }
            else
            {
                if (_calendarDate.getMonth() === date.getMonth() && _calendarDate.getFullYear() === date.getFullYear()) // different day
                {
                    var day = addNil(1, _instance.calendarDayLeadingZero),
                        firstDayIndex = $lib.indexOf(_dayButtons, function (button) { return (button.text === day); });

                    _dayButtons[((date.getDate() - 1) + firstDayIndex)].select();
                    _calendarDialog.show();
                }
                else // different year or month
                {
                    _calendarDate = new Date(date.getFullYear(), date.getMonth(), 1);
                    updateCalendar();
                    _calendarDialog.show();
                }
            }

            const focusableEls = _calendarDialog.element.querySelectorAll('input, a');

            focusableEls.forEach(el =>
            {
                if (allowFocusInside)
                {
                    el.setAttribute('tabindex', '0');
                }
                else
                {
                    el.setAttribute('tabindex', '-1');
                }
            });
        }

        function hideCalendar()
        {
            _calendarDialog.hide();
        }

        function updateCalendar()
        {
            updateHeader();
            updateFooter();
            drawMonth();

            function updateHeader()
            {
                var label = $lib($lib.format('#{0}_HeaderLabel', _calendarDialog.id)),
                    month = document.createElement('span'), year = document.createElement('span'),
                    format = _instance.dateFormat.toLowerCase();

                month.className = _instance.cssClassMonth || _classOption.MONTH;
                month.innerHTML = _instance.months[_calendarDate.getMonth()];
                year.className = _instance.cssClassYear || _classOption.YEAR;
                year.innerHTML = _calendarDate.getFullYear();

                label.innerHTML = '';

                if (format.indexOf('m') < format.indexOf('y'))
                {
                    label.appendChild(month);
                    label.appendChild(year);
                }
                else
                {
                    label.appendChild(year);
                    label.appendChild(month);
                }
            }

            function updateFooter()
            {
                _calendarMonthInput.events.onChange.disable(true);
                _calendarMonthInput.events.onChanged.disable(true);
                _calendarYearInput.events.onChange.disable(true);
                _calendarYearInput.events.onChanged.disable(true);

                _calendarMonthInput.setValue(addNil(_calendarDate.getMonth() + 1, hasLeadingZero('mm')));
                _calendarYearInput.setValue(_calendarDate.getFullYear());

                _calendarMonthInput.events.onChange.enable(true);
                _calendarMonthInput.events.onChanged.enable(true);
                _calendarYearInput.events.onChange.enable(true);
                _calendarYearInput.events.onChanged.enable(true);
            }

            function drawMonth()
            {
                var content = $lib($lib.format('#{0}_Content', _calendarDialog.id)),
                    rowIndex = 0, columnIndex = 0, columnStart = 0,
                    date = new Date(_calendarDate.getFullYear(), _calendarDate.getMonth(), 1),
                    prevRemainder = date.getDay() - _instance.firstDayOfWeek,
                    table = $lib(null, content, 'table', true),
                    index = 0;

                if (prevRemainder < 0)
                    prevRemainder += 7;

                for (rowIndex = 0; rowIndex < 6; ++rowIndex)
                {
                    var row = $lib(null, table, 'tr')[rowIndex + 1];

                    columnStart = 0;
                    row.className = '';
                    if (rowIndex == 0 && prevRemainder > 0)
                        date.setDate(date.getDate() - prevRemainder);

                    _instance.events.onCalendarWeekRender.fire(_instance, { row: row, date: new Date(date) });

                    if (_instance.weekNumbers)
                    {
                        var cell = $lib(null, row, 'td')[0];
                        cell.innerHTML = $lib.getWeekNumber(date, _instance.firstDayOfWeek);
                    }

                    while (prevRemainder > 0)
                    {
                        drawDay(row, date, index++);
                        prevRemainder--;
                        columnStart++;
                    }

                    for (columnIndex = columnStart; columnIndex < 7; columnIndex++)
                    {
                        drawDay(row, date, index++);
                    }
                }

                function drawDay(row, date, index)
                {
                    var cell = $lib(null, row, 'td')[(_instance.weekNumbers) ? (index % 7) + 1 : (index % 7)],
                        container = document.createElement('div'),
                        year = date.getFullYear(), month = date.getMonth(), day = date.getDate(),
                        button = null;

                    cell.className = '';
                    $lib.addClass(cell, _instance.cssClassDay || _classOption.DAY);

                    if (comparableDate(date) == comparableDate(_today))
                    {
                        $lib.addClass(row, _instance.cssClassCurrentWeek || _classOption.CURRENTWEEK);
                        $lib.addClass(cell, _instance.cssClassToday || _classOption.TODAY);
                    }

                    if (date.getMonth() != _calendarDate.getMonth())
                        $lib.addClass(cell, _instance.cssClassInactive || _classOption.INACTIVE);

                    if (_dayButtons[index])
                    {
                        button = _dayButtons[index];
                        button.deselect();
                        button.command = function () { selectDay(year, month, day) }
                        button.text = addNil(day, _instance.calendarDayLeadingZero);
                        button.updateContent();
                    }
                    else
                    {
                        cell.appendChild(container);

                        _dayButtons[index] = button = $UI.createComponent(componyx.UI.Button, { id: $lib.format('{0}_{1}', _instance.id, index), containerElement: container });

                        button.clone(null, _instance);
                        button.containerElement = container;
                        button.renderId = false;
                        button.transparent = true;
                        button.text = addNil(day, _instance.calendarDayLeadingZero);
                        button.type = componyx.UI.Button.TypeOption.RADIOBUTTON;
                        button.radioGroupId = _instance.id;
                        button.command = function () { selectDay(year, month, day) }
                        button.selected = false;
                        button.delegateFocusEvents(_instance);
                        button.show();
                    }

                    if (!isAllowedDate(date))
                        button.disable();
                    else
                        button.enable();

                    if (_date && comparableDate(date) == comparableDate(_date))
                        button.select();

                    _instance.events.onCalendarDayRender.fire(_instance, { row: row, cell: cell, button: button, date: new Date(date) });
                    date.setDate(date.getDate() + 1);
                }
            }
        }

        function isAllowedDate(date)
        {
            var minDate = _instance.minValue,
                maxDate = _instance.maxValue,
                dates = _instance.allowedDates,
                time = date.getTime();

            if (minDate && time < minDate.getTime())
                return false;
            else if (maxDate && time > maxDate.getTime())
                return false;
            else if (!$lib.isEmpty(dates))
            {
                var val = dates[$lib.indexOf(dates, function (item)
                {
                    if (item.length == 1)
                        return (item[0].getTime() === time);
                    else // min-max
                        return (time > item[0].getTime() && time < item[1].getTime());
                })];

                if ((val && _instance.disallowDates) || (!val && !_instance.disallowDates))
                    return false;
            }

            return true;
        }

        function comparableDate(date)
        {
            return parseInt(date.getFullYear() + addNil(date.getMonth(), true) + addNil(date.getDate(), true), 10);
        }

        function selectDay(year, month, day)
        {
            _date = new Date(year, month, day);
            _day = _date.getDate();

            if (!isPopup())
                _calendarDate = new Date(year, month, day);

            if (_pickerButton)
                _pickerButton.focus();

            setDate(_date);

            if (isPopup())
                _calendarDialog.hide();
        }

        function toggleEvents(enable)
        {
            if (enable)
            {
                _yearInput.events.onChange.enable(true);
                _yearInput.events.onChanged.enable(true);
                _monthInput.events.onChange.enable(true);
                _monthInput.events.onChanged.enable(true);
                _dayInput.events.onChange.enable(true);
                _dayInput.events.onChanged.enable(true);
            }
            else
            {
                _yearInput.events.onChange.disable(true);
                _yearInput.events.onChanged.disable(true);
                _monthInput.events.onChange.disable(true);
                _monthInput.events.onChanged.disable(true);
                _dayInput.events.onChange.disable(true);
                _dayInput.events.onChanged.disable(true);
            }
        }

        function getDayCount(date)
        {
            var month = date.getMonth();

            if (month == 1)
            {
                if ($lib.isLeapYear(date.getFullYear()))
                    return 29;
                else
                    return 28;
            }
            else if (month == 3 || month == 5 || month == 8 || month == 10)
                return 30;
            else
                return 31;
        }

        function reset(fireEvent)
        {
            var value = (_instance.value) ? _instance.value : (_instance.today) ? _today : null;

            if (!value)
                clear(fireEvent);
            else
                setDate(value, fireEvent);
        }

        function clear(fireEvent)
        {
            setDate(null, fireEvent);
        }

        function select()
        {
            var input = $lib(null, _instance.element, 'input')[0];
            input.select();
        }

        function getDate()
        {
            return _date;
        }

        function setDate(date, fireEvent, allowClearance)
        {
            var minDate = _instance.minValue,
                maxDate = _instance.maxValue,
                prevValue = _hidden.value,
                hasInputs = (_instance.viewMode < _viewModeOption.CALENDAR);

            if (hasInputs)
                toggleEvents();

            if (date)
            {
                _date = (typeof (date) == 'string') ? convertDate(date) : createNewDate(date);

                if (minDate && _date.getTime() < minDate.getTime())
                    _date = createNewDate(minDate);
                else if (maxDate && _date.getTime() > maxDate.getTime())
                    _date = createNewDate(maxDate);

                if (hasInputs)
                {
                    _yearInput.setValue(_date.getFullYear());
                    _monthInput.setValue(addNil(_date.getMonth() + 1, hasLeadingZero('mm')));
                    _dayInput.setValue(addNil(_date.getDate(), hasLeadingZero('dd')));
                }
            }
            else
            {
                _date = null;

                if (allowClearance != false && hasInputs)
                {
                    _yearInput.setValue('');
                    _monthInput.setValue('');
                    _dayInput.setValue('');
                }
            }

            if (hasInputs)
                toggleEvents(true);

            setValue();

            if (fireEvent != false && prevValue != _hidden.value)
                _instance.events.onChanged.fire(_instance, { date: _date });
        }

        function createNewDate(date)
        {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }

        function getValue()
        {
            return _hidden.value;
        }

        function setValue()
        {
            var format = _instance.dateFormat.toLowerCase();

            if (validDate(_date))
            {
                var val = format;

                val = val.replace('yyyy', _date.getFullYear());
                val = (format.indexOf('mm') > -1) ? val.replace('mm', addNil(_date.getMonth() + 1, true)) : val.replace('m', _date.getMonth() + 1);
                val = (format.indexOf('dd') > -1) ? val.replace('dd', addNil(_date.getDate(), true)) : val.replace('d', _date.getDate());
                _hidden.__setValue(val);
            }
            else
                _hidden.__setValue('');
        }

        function isPopup()
        {
            var v = _instance.viewMode;
            return (v == _viewModeOption.INPUT_CALENDAR_POPUP || v == _viewModeOption.CALENDAR_POPUP)
        }

        function dispose()
        {
            _dayButtons = [];
            _pickerButton = null;
            _calendarDialog = null;
            _calendarDate = null;
            _date = null;
            $lib.off(window, 'keyup', checkTabFocus);
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.DatePicker.prototype = Object.create($base.methods);
    componyx.UI.DatePicker.prototype.constructor = componyx.UI.DatePicker;

    /**
    * FirstDayOfWeekOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.DatePicker.FirstDayOfWeekOption =
    {
        SUNDAY: 0,
        MONDAY: 1,
        SATURDAY: 6
    }

    /**
    * ViewModeOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.DatePicker.ViewModeOption =
    {
        INPUT_CALENDAR_POPUP: 0,
        INPUT_CALENDAR_STATIC: 1,
        INPUT: 2,
        CALENDAR: 3,
        CALENDAR_POPUP: 4
    }
})(window);