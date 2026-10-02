/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
	/**
    * TimePicker class.
    * @class
    * @memberof componyx.UI
	* @augments componyx.UI.base.Component
	* @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {Object} An instance of the component.
    */
	componyx.UI.TimePicker = function TimePicker(id, properties)
	{
		// define private properties
		var _instance = this,
        _hidden,
        _hourInput = null,
        _minuteInput = null,
        _themeOption = $base.static.ThemeOption,
		_viewModeOption = componyx.UI.TimePicker.ViewModeOption,
		_clockDialog, _hourClockInput, _minuteClockInput, _hourClock, _minuteClock, _hourClockHand, _minuteClockHand, _hourClockValue, _minuteClockValue, _drag, _tabFocus,
		_activeClock, _activeClockHand, _twentyFourClock, _circle = {}, _clockHours = {}, _clockMinutes = {}, _minuteClockSelected, _hourClockSelected, _pickerButton,
		_buttonPM, _buttonAM, _tabBlur,
        _classOption =
        {
        	NUMERICBOX: 'numeric-box',
        	HOUR: 'hour',
        	MINUTE: 'minute',
        	HOURCLOCK: 'clock hour',
        	MINUTECLOCK: 'clock minute',
        	CLOCKHAND: 'clock-hand',
        	CLOCKITEM: 'clock-item',
        	SELECTED: 'selected',
        	BETWEEN: 'between',
        	PICKER: 'button picker',
        	PM: 'button pm',
        	AM: 'button am',
        	TWENTYFOURCLOCK: 'clock-24',
        	TWENTYFOURHAND: 'hand-24',
        	SEPARATOR: 'separator',
        	INPUT: 'input',
        	BUTTONHOLDER: 'button-holder',
        	DISABLED: 'disabled'
        }

		// define public properties
		/**
		 * Gets or sets the css class of the numericbox.
		 * @type {String}
		 */
		this.cssClassNumericBox = '';

		/**
		 * Gets or sets the css class of the hour input.
		 * @type {String}
		 */
		this.cssClassHour = '';

		/**
		 * Gets or sets the css class of the minute input.
		 * @type {String}
		 */
		this.cssClassMinute = '';

		/**
		 * Gets or sets the placeholder which is visible when the hour input box has no value. Default: HH.
		 * @type {String}
		 */
		this.hourPlaceholder = 'HH';

		/**
		 * Gets or sets the placeholder which is visible when the minute input box has no value. Default: MM.
		 * @type {String}
		 */
		this.minutePlaceholder = 'MM';

		/**
		 * Gets or sets a value indicating whether the timepicker is readonly.
		 * @type {Boolean}
		 */
		this.readOnly = false;

		/**
		 * Gets or sets a value indicating whether the timepicker is disabled.
		 * @type {Boolean}
		 */
		this.disabled = false;

		/**
		 * Gets or sets a value indicating whether focus on an input field is automatically moved to the next field while typing.
		 * @type {Boolean}
		 */
		this.autoFocus = true;

		/**
		 * Gets or sets a value indicating whether a leading zero is added to the hour input box if it is not provided. Default: true.
		 * @type {Boolean}
		 */
		this.hourLeadingZero = true;

		/**
		 * Gets or sets a value indicating whether a 12 or 24 hour clock is used.
		 * @type {Boolean}
		 */
		this.is24HourClock = true;

		/**
		 * Gets or sets the meridiem value if it’s not set to a 24 hour clock.
		 * @type {String}
		 */
		this.meridiemValue = 'AM';

		/**
		 * Gets or sets the hidden input field name which contains the selected time value.
		 * @type {String}
		 */
		this.name = '';

		/**
		 * Gets or sets the selected time value in format 'HH:MM'.
		 * @type {String|null}
		 */
		this.value = null;

		/**
		 * Gets or sets the minimum allowed time in format 'HH:MM'. Minutes must be divisible by 5.
		 * @type {String|null}
		 */
		this.minValue = null;

		/**
		 * Gets or sets the maximum allowed time in format 'HH:MM'. Minutes must be divisible by 5.
		 * @type {String|null}
		 */
		this.maxValue = null;

		/**
		 * Gets or sets the incremental value in minutes. Minutes must be divisible by 5.
		 * @type {Number|null}
		 */
		this.incrementalValue = null;

		/**
		 * Gets or sets a list of allowed clock times (format 'HH:MM'). Separate two date strings with a space to specify allowed range. When allowed times are set, date input fields are rendered in readonly mode.
		 * @type {String[]}
		 */
		this.allowedTimes = [];

		/**
		 * Gets or sets a value indicating if the times specified in the times property are disallowed instead of the default allowed.
		 * @type {Boolean}
		 */
		this.disallowTimes = false;

		/**
		 * Gets or sets the view mode in which the time picker is rendered.
		 * @type {componyx.UI.TimePicker.ViewModeOption}
		 */
		this.viewMode = _viewModeOption.INPUT_CLOCK_POPUP;

		/**
		 * Gets or sets the id of the hour numeric box from which the settings are cloned.
		 * @type {String|null}
		 */
		this.hourNumericBoxId = null;

		/**
		 * Gets or sets the id of the minute numeric box from which the settings are cloned.
		 * @type {String|null}
		 */
		this.minuteNumericBoxId = null;

		/**
		 * Gets or sets the id of the clock dialog from which the settings are cloned.
		 * @type {String|null}
		 */
		this.clockDialogId = null;

		/**
		 * Gets or sets the id of the post meridiem (PM) button from which the settings are cloned.
		 * @type {String|null}
		 */
		this.pmButtonId = null;

		/**
		 * Gets or sets the id of the ante meridiem (AM) button from which the settings are cloned.
		 * @type {String|null}
		 */
		this.amButtonId = null;

		/**
		 * Gets or sets the id of the picker button from which the settings are cloned.
		 * @type {String|null}
		 */
		this.pickerButtonId = null;

		/**
		 * Gets or sets the id of the hidden input from which the settings are cloned.
		 * @type {String|null}
		 */
		this.hiddenInputId = null;


		/**
		* @class
		 * @augments componyx.UI.base.Events
		 * @memberof componyx.UI.TimePicker
		 * @property {componyx.UI.base.Event} onFocus    - Event which fires when the time picker is focused.
		 * @property {componyx.UI.base.Event} onBlur     - Event which fires when the time picker is blurred.
		 * @property {componyx.UI.base.Event} onChanged  - Event which fires when the value has changed. @see {@link componyx.UI.TimePicker.ChangedEventArgs}
		 * @see {@link componyx.UI.base.Events}
		 */
		function TimePickerEvents(events)
		{
			Object.assign(this, events);
			this.onFocus = $base.static.createEvent('onFocus');
			this.onBlur = $base.static.createEvent('onBlur');
			this.onChanged = $base.static.createEvent('onChanged');
		};

		/**
		 * TimePicker events
		 * @type {componyx.UI.TimePicker.TimePickerEvents}
		 */
		this.events = new TimePickerEvents(this.events);

		/**
		 * TimePicker changed event arguments.
		 * @typedef {Object} ChangedEventArgs
		 * @memberof componyx.UI.TimePicker
		 * @property {String} value - The time value in the format 'HH:MM'.
		 */

		// inherit base instance members
		$base.Component.apply(this, [id, properties]);

		/** 
        * Resets the inputs to the initial value.
		* @param {Boolean} [fireEvent=false] A value indicating if the onChanged event is fired.
        */
		this.reset = function (fireEvent)
		{
			reset(($lib.isEmpty(fireEvent)) ? false : fireEvent);
		}

		/** 
        * Clears the input values.
		* @param {Boolean} [fireEvent=false] A value indicating if the onChanged event is fired.
        */
		this.clear = function (fireEvent)
		{
			clear(($lib.isEmpty(fireEvent)) ? false : fireEvent);
		}

		/** 
        * Selects the text of the first input field of the timepicker.
        */
		this.select = function ()
		{
			select();
		}

		/** 
        * Gets the hour value from the timepicker.
        * @returns {Number} Hour value.
        */
		this.getHour = function ()
		{
			return getHour();
		}

		/** 
        * @returns {Number} Minute value.
        */
		this.getMinute = function ()
		{
			return getMinute();
		}

		/** 
        * Gets the time value in string format.
        * @returns {String} Time value in the format 'hour:minute'.
        */
		this.getValue = function ()
		{
			return getValue();
		}

		/** 
		* Sets the time value.
		* @param {String} value The time value in the format hour:minute.
		* @param {Boolean} [fireEvent=false] A value indicating if the onChanged event is fired.
		*/
		this.setValue = function (value, fireEvent)
		{
			setValue(value, ($lib.isEmpty(fireEvent)) ? false : fireEvent);
		}

		/** 
		* Gets a value indicating if the time is before or after noon.
		* @returns {String} PM or AM.
		*/
		this.getMeridiemValue = function ()
		{
			if (_instance.is24HourClock)
				return '';

			return getMeridiemValue();
		}

		/** 
		* Sets a value indicating if the time is before or after noon.
		* @param {String} PM or AM.
		*/
		this.setMeridiemValue = function (value)
		{
			if (_instance.is24HourClock)
				return;

			$UI.store[_instance.id + '_' + value.toUpperCase()].select();
		}

		/** 
		* Shows the clock.
		*/
		this.showClock = function ()
		{
			showClock();
		}

		/** 
		* Hides the clock.
		*/
		this.hideClock = function ()
		{
			hideClock();
		}

		/** 
		* Selects the hour clock.
		*/
		this.selectHourClock = function ()
		{
			selectHourClock();
		}

		/** 
		* Selects the minute clock.
		*/
		this.selectMinuteClock = function ()
		{
			selectMinuteClock();
		}

		/** 
        * Renders the component
        */
		this.render = function ()
		{
			if (_instance.renderState != $base.static.RenderState.RENDERING)
			{
				// call base render and return
				$base.methods.render.call(_instance, preRender, 'time-picker');
				return;
			}

			// render logic after loading resources
			draw();
		}

		/** 
        * Handles the post render procedure.
        */
		this.postRender = function ()
		{
			if (_instance.renderState != $base.static.RenderState.RENDERING) // extra safety to never execute a postRender when the component state is incorrect
				return;

			if (_clockDialog)
			{
				var contentHolder = _clockDialog.getBox().contentElement.firstElementChild.firstElementChild;
				$lib.on(contentHolder, 'mousedown', startDrag);
				$lib.on(contentHolder, 'mousemove', drag);
				$lib.on(contentHolder, 'mouseleave', endDrag);
				$lib.on(contentHolder, 'wheel', navigate);
				$lib.on(document, 'mouseup', endDrag);
			}

			if (_instance.viewMode == _viewModeOption.INPUT_CLOCK_POPUP)
			{
				setInputEvent(_hourInput.getInput());
				setInputEvent(_minuteInput.getInput());
			}

			if (!$base.methods.postRender.call(_instance)) // component got destroyed on postrender event
				return;

			setValue(_instance.value, false);

			if (_instance.meridiemValue && !_instance.is24HourClock)
				_instance.setMeridiemValue(_instance.meridiemValue);

			selectHourClock();
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

			return ['TimePicker', scripts];
		}

		function draw()
		{
			_hidden = _instance.createSyncedInput(_instance.hiddenInputId, function ()
			{
				setValue(this.value);
			});

			_instance.value = _instance.value || _hidden.value;

			if (_instance.viewMode < _viewModeOption.CLOCK)
			{
				if (($lib.touch && _instance.autoTouchConfig) || !$lib.isEmpty(_instance.allowedTimes))
					_instance.readOnly = true;

				initTimes();

				createHourInput();
				createSeparator(_instance.element);
				createMinuteInput();

				if (_instance.viewMode == _viewModeOption.INPUT_CLOCK_POPUP)
				{
					createPicker();
					$lib.on(window, 'keyup', checkTabFocus);
					$lib.on(window, 'keyup', checkTabBlur);

					_instance.events.onFocus.priorityAdd(function ()
					{
						_tabBlur = false;
					});

					_instance.events.onBlur.priorityAdd(function ()
					{
						_tabBlur = true;
					});
				}

				if (!_instance.is24HourClock)
					createMeridiemButtons(_instance.element);
			}

			if (_instance.viewMode != _viewModeOption.INPUT)
				createClockDialog();

			_instance.renderChildren();
		}

		function initTimes()
		{
			var minValue = _instance.minValue,
				maxValue = _instance.maxValue,
				allowedTimes = _instance.allowedTimes;

			_instance.incrementalValue = validateIncrement(_instance.incrementalValue);
			
			if (minValue)
			{
				minValue = minValue.split(':');
				_instance.minValue = minValue[0] + ':' + $lib.padLeft(floorToIncrement(minValue[1]), 2);
			}

			if (maxValue)
			{
				maxValue = maxValue.split(':');
				_instance.maxValue = maxValue[0] + ':' + $lib.padLeft(floorToIncrement(maxValue[1]), 2);
			}

			$lib.each(allowedTimes, function (time, index)
			{
				if (time.indexOf(' ') > -1) // min-max
					allowedTimes[index] = [time.split(' ')[0], time.split(' ')[1]];
				else
					allowedTimes[index] = [time];
			});
		}

		function validateIncrement(value)
		{
			if ($lib.isEmpty(value) || value == 0)
				return 0;

			value = parseInt(value, 10);

			if (isNaN(value))
				return 0;

			if ((value !== 1 && 60 % value !== 0))
			{
				return 5; // fall back to 5 minutes
			}
			return value;
		}

		function floorToIncrement(value)
		{
			value = parseInt(value, 10);

			let incrementValue = parseInt(_instance.incrementalValue, 10);

			if (incrementValue === 1) return value; // no rounding needed

			return value - (value % incrementValue);
		}

		function createHourInput()
		{
			var input,
				minValue = (_instance.minValue) ? _instance.minValue.split(':')[0] : null,
				maxValue = (_instance.maxValue) ? _instance.maxValue.split(':')[0] : null;

			_hourInput = input = createInput(_instance.element, _instance.id + '_H', _instance.hourNumericBoxId);
			input.cssClass += ' ' + (_instance.cssClassHour || _classOption.HOUR);
			input.placeholder = _instance.hourPlaceholder;
			input.maxLength = 2;

			if ($lib.isEmpty(minValue))
				input.minValue = (_instance.is24HourClock) ? 0 : 1;
			else
				input.minValue = null;

			if ($lib.isEmpty(maxValue))
				input.maxValue = (_instance.is24HourClock) ? 23 : 12;
			else
				input.maxValue = null;

			input.selectOnFocus = (_instance.autoFocus) ? true : _hourInput.selectOnFocus;
			input.showButtons = false;
			input.digitPadLeftValue = (_instance.hourLeadingZero) ? "00" : null;
			input.value = (_instance.value) ? _instance.value.split(':')[0] : '';
			input.events.onChange.priorityAdd(moveFocus, null);
		}

		function createMinuteInput()
		{
			var input;

			_minuteInput = input = createInput(_instance.element, _instance.id + '_M', _instance.minuteNumericBoxId);
			input.cssClass += ' ' + (_instance.cssClassMinute || _classOption.MINUTE);
			input.placeholder = _instance.minutePlaceholder;
			input.maxLength = 2;
			input.maxValue = 59;
			input.selectOnFocus = (_instance.autoFocus) ? true : _minuteInput.selectOnFocus;
			input.showButtons = (input.readOnly && !$lib.isEmpty(_instance.allowedTimes)) ? false : true;
			input.digitPadLeftValue = "00";
			input.value = (_instance.value) ? _instance.value.split(':')[1] || '' : '';
		}

		function createInput(container, id, numericBoxId)
		{
			var input = $UI.createComponent(componyx.UI.NumericBox, { id: id, containerElement: container });

			input.clone($UI.store[numericBoxId], _instance);
			input.cssClass = input.cssClass || _instance.cssClassNumericBox || _classOption.NUMERICBOX;
			input.focusGroupId = _instance.id;
			input.readOnly = _instance.readOnly;
			input.disabled = _instance.disabled;
			input.focusableButtons = false;
			input.leadingZeros = true;
			input.minValue = 0;
			input.incrementalValue = (_instance.incrementalValue) ? 0 : 1;
			input.showing = true;
			input.delegateFocusEvents(_instance);
			input.events.onChanged.priorityAdd(valueChanged, null);
			input.events.onIncrement.priorityAdd(increment);
			input.events.onDecrement.priorityAdd(decrement);
			input.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);

			if (_instance.viewMode == _viewModeOption.INPUT_CLOCK_POPUP)
			{
				if ($lib.endsWith(id, '_H'))
				{
					input.events.onClick.priorityAdd(function (input)
					{
						_tabFocus = false;
						showClock();
					});

					input.events.onFocus.priorityAdd(function ()
					{
						selectHourClock();
						showClock();
						_tabFocus = true;
					});
				}
				else
				{
					input.events.onClick.priorityAdd(function (input)
					{
						_tabFocus = false;
						showClock();
					});

					input.events.onFocus.priorityAdd(function ()
					{
						selectMinuteClock();
						showClock();
						_tabFocus = true;
					});
				}
			}

			return input;
		}

		function setInputEvent(input)
		{
			$lib.on(input, 'keyup', inputKeyUp);
		}

		function inputKeyUp(e)
		{
			var keyCode = e.key;

			if (!$lib.isEmpty(_hidden.value) && (keyCode == 'Enter' || keyCode == ' ') && _clockDialog && _clockDialog.showing)
			{
				hideClock();
				this.blur();
			}
		}

		function checkTabFocus(e)
		{
			if (_tabFocus && e.key == 'Tab')
				showClock();

			_tabFocus = false;
		}

		function checkTabBlur(e)
		{
			$lib.defer(function ()
			{
				if (_tabBlur && e.key == 'Tab')
					hideClock();

				_tabBlur = false;
			}.bind(_instance, e));
		}

		function createSeparator(container)
		{
			$lib.element(container, '', 'span', ':', { "class": _classOption.SEPARATOR });
		}

		function createPicker()
		{
			var id = _instance.id + '_Picker';
			_pickerButton = createButton(_instance.element, id, _instance.pickerButtonId);

			_pickerButton.transparent = true;
			_pickerButton.cssClass = _classOption.PICKER;
			_pickerButton.hasIcon = true;
			_pickerButton.type = componyx.UI.Button.TypeOption.CHECKBUTTON;
			_pickerButton.command = function () { selectHourClock(); _clockDialog.toggle(); };
		}

		function createMeridiemButtons(container)
		{
			var id = _instance.id,
				pm = 'PM', am = 'AM',
				buttonHolder = $lib.element(container, '', '', '', { "class": _classOption.BUTTONHOLDER });

			_buttonAM = createButton(buttonHolder, id + '_' + am, _instance.amButtonId, am);
			_buttonAM.transparent = true;
			_buttonAM.primary = (container !== _instance.element);
			_buttonAM.cssClass = _classOption.AM;

			_buttonPM = createButton(buttonHolder, id + '_' + pm, _instance.pmButtonId, pm);
			_buttonPM.transparent = true;
			_buttonPM.primary = (container !== _instance.element);
			_buttonPM.cssClass = _classOption.PM;
		}

		function createButton(container, id, cloneId, text)
		{
			var button = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: container });
			button.type = componyx.UI.Button.TypeOption.RADIOBUTTON;
			button.radioGroupId = _instance.id;
			button.text = text;
			button.clone($UI.store[cloneId], _instance);
			button.disabled = _instance.disabled;
			button.delegateFocusEvents(_instance);
			button.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);
			button.showing = true;

			return button;
		}

		function createClockDialog()
		{
			var id = _instance.id + '_Clock',
			header = $lib.element(),
			content = $lib.element();

			_clockDialog = $UI.createComponent(componyx.UI.Dialog, { id: id, containerElement: _instance.element });
			_clockDialog.clone($UI.store[_instance.dialogId], _instance);
			_clockDialog.cssClass = _classOption.CLOCK;
			_clockDialog.autoFit = _clockDialog.buttons.close = _clockDialog.buttons.deny = _clockDialog.buttons.confirm = _clockDialog.buttons.cancel = false;
			_clockDialog.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);
			_clockDialog.setHeaderTemplate(header);
			_clockDialog.setContentTemplate(content);
			_clockDialog.expandDirection = componyx.UI.Box.ExpandDirectionOption.DOWN;

			if (_instance.viewMode == _viewModeOption.INPUT_CLOCK_POPUP)
			{
				_clockDialog.expander = _instance.id;
				_clockDialog.autoPosition = componyx.UI.Box.AutoPositionOption.EXPAND;
				_clockDialog.autoInvertFit = _clockDialog.autoFit = true;
				_clockDialog.events.onHideComplete.priorityAdd(function ()
				{
					_pickerButton.deselect();

					if (!_instance.is24HourClock && _instance.viewMode == _viewModeOption.INPUT_CLOCK_POPUP)
						_buttonAM.focus();

				}, null);
				_clockDialog.hideOnOutsideClick = true;
			}
			else
				_clockDialog.showing = true;

			createHeader();
			createContent();

			function createHeader()
			{
				_hourClockInput = $lib.element(header, '', '', '--', { "class": _classOption.INPUT + ' ' + _classOption.HOUR });
				createSeparator(header);
				_minuteClockInput = $lib.element(header, '', '', '--', { "class": _classOption.INPUT + ' ' + _classOption.MINUTE });

				if (_instance.viewMode == _viewModeOption.CLOCK && !_instance.is24HourClock)
					createMeridiemButtons(header);

				$lib.on(_hourClockInput, 'click', selectHourClock);
				$lib.on(_minuteClockInput, 'click', selectMinuteClock);
			}

			function createContent()
			{
				_hourClock = $lib.element(content, '', '', '', { "class": _classOption.HOURCLOCK });
				_minuteClock = $lib.element(content, '', '', '', { "class": _classOption.MINUTECLOCK });

				createHours($lib.element(_hourClock));

				if (_instance.is24HourClock)
					$lib.element(_hourClock, '', '', '', { "class": _classOption.TWENTYFOURCLOCK });

				createMinutes($lib.element(_minuteClock));
			}

			function createHours(container)
			{
				_hourClockHand = $lib.element(container, '', '', '', { "class": _classOption.CLOCKHAND });
				_hourClockHand.tabIndex = '0';

				$lib.on(_hourClockHand, 'keydown', navigate);
				$lib.on(_hourClockHand, 'blur', function () { _instance.onBlur.call(_instance); });

				_clockHours = {};
				createClock(container);
			}

			function createMinutes(container)
			{
				_minuteClockHand = $lib.element(container, '', '', '', { "class": _classOption.CLOCKHAND });
				_minuteClockHand.tabIndex = '0';

				$lib.on(_minuteClockHand, 'keydown', navigate);
				$lib.on(_minuteClockHand, 'blur', function () { _instance.onBlur.call(_instance); });

				_clockMinutes = [];
				createClock(container, true);
			}

			function createClock(container, isMinutes)
			{
				var length = (!isMinutes && _instance.is24HourClock) ? 24: 12;

				for (var index = 0; index < length; ++index)
				{
					var value = index,
						label = (isMinutes) ? $lib.padLeft(value * 5, 2) : (!index) ? 12 : value;

					var size = (!isMinutes && index > 11) ? 50 : 100, // 01-23 is inside container (50%)
						top = ((100 - (size * (Math.sin((2 * Math.PI / 12) * (index + 3))))) / 2), // +3 because we start at top center
						left = ((100 - (size * (Math.cos((2 * Math.PI / 12) * (index + 3))))) / 2),
						el = $lib.element(container, '', '', '', { "class": _classOption.CLOCKITEM });

					if (!isMinutes && value == 0 && length == 24)
						label = '00';

					el.style.top = top + '%';
					el.style.left = left + '%';
					el.innerHTML = '<span>' + label + '</span>';

					if (isMinutes)
						_clockMinutes[(value * 5).toString()] = el;
					else
						_clockHours[value.toString()] = el;
				};
			}
		}

		function isInCircle(x, y, cx, cy, radius)
		{
			var distanceSquared = (x - cx) * (x - cx) + (y - cy) * (y - cy); // cx, cy = center point
			return distanceSquared <= (radius * radius);
		}

		function navigate(e)
		{
			var keyCode = e.key,
				wheelMove = e.deltaY != undefined && e.deltaY != 0,
				up = (keyCode == 'ArrowUp'),
				down = (keyCode == 'ArrowDown'),
				left = (keyCode == 'ArrowLeft'),
				right = (keyCode == 'ArrowRight');

			if (!(up || down || left || right || wheelMove))
				return;

			var forwards = e.deltaY > 0 || right || down,
				hand = ($lib.hasClass(_hourClock, _classOption.SELECTED)) ? _hourClockHand : _minuteClockHand;

			var value = (hand === _hourClockHand) ? _hourClockValue : (_minuteClockValue || 0),
				incrementValue = _instance.incrementalValue || 1;

			if (hand === _hourClockHand)
				value += (forwards) ? 1 : -1;
			else
			{
				if (forwards)
					value += incrementValue;
				else
					value = (value == 0) ? 60 - incrementValue : value - incrementValue;
			}

			if (hand === _hourClockHand)
				setValue(mergeValues(value, _minuteClockValue));
			else
				setValue(mergeValues(_hourClockValue, value));

			if (wheelMove)
				e.preventDefault();
		}

		function showClock()
		{
			if (_pickerButton)
				_pickerButton.select();

			_clockDialog.show();
		}

		function hideClock()
		{
			_clockDialog.hide();
		}

		function startDrag(e)
		{
			_drag = true;
			_activeClock = _hourClock;
			_activeClockHand = _hourClockHand;

			if ($lib.hasClass(_minuteClock, _classOption.SELECTED))
			{
				_activeClock = _minuteClock;
				_activeClockHand = _minuteClockHand;
			}

			var pos = $lib.getPos(_activeClock, null, true);
			_circle.radius = ((pos.bottom - pos.top) / 2);
			_circle.innerRadius = (_circle.radius / 2);
			_circle.cy = pos.top + _circle.radius;
			_circle.cx = pos.left + _circle.radius;
			drag(e);
		}

		function drag(e)
		{
			if (!_drag)
				return;

			var x = $lib.clientX(e),
				y = $lib.clientY(e),
				deltaY = _circle.cy - y,
				deltaX = x - _circle.cx,
				rad = Math.atan2(deltaY, deltaX), // in radians
				deg = 90 - (rad * (180 / Math.PI)); // radians to degrees (90- because we start at top of circle and move clockwise instead of counter clockwise)

			if (deg < 0)
				deg = 360 + deg; // instead of minus degree values we use positive numbers only

			if (_activeClock == _minuteClock)
				setClockMinute(degreesToMinute(deg));
			else
				setClockHour(degreesToHour(deg, _instance.is24HourClock && isInCircle(x, y, _circle.cx, _circle.cy, _circle.innerRadius)));
		}

		function endDrag()
		{
			if (_drag)
			{
				_activeClockHand.focus();

				if (_activeClockHand === _hourClockHand && !$lib.isEmpty(_hourClockValue))
					selectMinuteClock();
				else if (_activeClockHand === _minuteClockHand && !$lib.isEmpty(_hourClockValue) && !$lib.isEmpty(_minuteClockValue) && _instance.viewMode == _viewModeOption.INPUT_CLOCK_POPUP)
					hideClock();

				setValue(mergeValues(_hourClockValue, _minuteClockValue));
			}

			_drag = false;
		}

		function mergeValues(hourValue, minuteValue)
		{
			return validateValue(hourValue) + ':' + validateValue(minuteValue);
		}

		function validateValue(value)
		{
			return ($lib.isEmpty(value)) ? '' : value;
		}

		function selectHourClock()
		{
			if ($lib.hasClass(_hourClockInput, _classOption.SELECTED))
				return;

			toggleClock();
			enableHourClockItems();
		}

		function selectMinuteClock()
		{
			if ($lib.hasClass(_minuteClockInput, _classOption.SELECTED))
				return;

			toggleClock(true);
			enableMinuteClockItems();
		}

		function toggleClock(isMinute)
		{
			var activeInput = (isMinute) ? _minuteClockInput : _hourClockInput,
        		input = (isMinute) ? _hourClockInput : _minuteClockInput,
        		activeClock = (isMinute) ? _minuteClock : _hourClock,
				clock = (isMinute) ? _hourClock : _minuteClock;

			$lib.removeClass(input, _classOption.SELECTED);
			$lib.removeClass(clock, _classOption.SELECTED);
			$lib.addClass(activeInput, _classOption.SELECTED);
			$lib.addClass(activeClock, _classOption.SELECTED);
		}

		function enableHourClockItems()
		{
			var incrementalValues = getIncrementalValues();

			$lib.each(_clockHours, function (el, hour)
			{
				if ((!incrementalValues || incrementalValues.hours[hour]) && isAllowedHour(parseFloat(hour)))
					$lib.removeClass(el, _classOption.DISABLED);
				else
					$lib.addClass(el, _classOption.DISABLED);
			});
		}

		function enableMinuteClockItems()
		{
			var incrementalValues = getIncrementalValues();

			$lib.each(_clockMinutes, function (el, minute)
			{
				if ((!incrementalValues || incrementalValues.times[parseFloat(_hourClockValue).toString() + ':' + minute]) && isAllowedTime(parseFloat(_hourClockValue), parseFloat(minute)))
					$lib.removeClass(el, _classOption.DISABLED);
				else
				{
					if (_minuteClockValue == minute)
						_minuteClockValue = '';

					$lib.addClass(el, _classOption.DISABLED);
				}
			});
		}

		function getIncrementalValues()
		{
			var incrementalValues,
				incrementalValue = _instance.incrementalValue || null,
				minValue = getMinValue(),
				maxValue = getMaxValue();

			if (incrementalValue)
			{
				var dtMin = new Date(),
					dtMax = new Date();

				incrementalValues = { times: {}, hours: {} };
				dtMin.setHours(minValue[0], minValue[1]);
				dtMax.setHours(maxValue[0], maxValue[1]);

				while (dtMin < dtMax)
				{
					incrementalValues.hours[dtMin.getHours().toString()] = true;
					incrementalValues.times[dtMin.getHours().toString() + ':' + dtMin.getMinutes().toString()] = true;
					dtMin = addMinutes(dtMin, incrementalValue);
				}

				incrementalValues.hours[dtMin.getHours().toString()] = true;
				incrementalValues.times[dtMin.getHours().toString() + ':' + dtMin.getMinutes().toString()] = true;
			}

			return incrementalValues;
		}

		function isAllowedHour(hour)
		{
			var times = _instance.allowedTimes,
				minValue = getMinValue(),
				maxValue = getMaxValue();

			if (hour < minValue[0] || (hour > maxValue[0])) // exceed min or max
				return false;
			else if (!$lib.isEmpty(times))
			{
				var val = times[$lib.indexOf(times, function (item)
				{
					return (item[0].split(':')[0] == hour || (item.length > 1 && item[1].split(':')[0] == hour));
				})];

				if ((val && _instance.disallowDates) || (!val && !_instance.disallowDates))
					return false;
			}

			return true;
		}

		function isAllowedTime(hour, minute)
		{
			var times = _instance.allowedTimes,
				minValue = getMinValue(),
				maxValue = getMaxValue();

			if ((hour == minValue[0] && minute < minValue[1]) || (hour == maxValue[0] && minute > maxValue[1])) // exceed min or max
				return false;
			else if (!$lib.isEmpty(times))
			{
				var val = times[$lib.indexOf(times, function (item)
				{
					if (item.length == 1)
					{
						item = item[0].split(':');
						return (item[0] == hour && item[1] == minute)
					}
					else
					{
						var min = parseFloat(item[0].split(':').join('')),
							max = parseFloat(item[1].split(':').join('')),
							check = parseFloat(hour.toString() + $lib.padLeft(minute.toString(), 2));

						return (check >= min && check <= max);
					}
				})];

				if ((val && _instance.disallowDates) || (!val && !_instance.disallowDates))
					return false;
			}

			return true;
		}

		function getMinValue()
		{
			return (_instance.minValue) ? _instance.minValue.split(':') : [0, 0];
		}

		function getMaxValue()
		{
			return (_instance.maxValue) ? _instance.maxValue.split(':') : [getMaxHours(), 59];
		}

		function getMaxHours()
		{
			return (_instance.is24HourClock) ? 23 : 11;
		}

		function moveFocus(input, args)
		{
			var keyCode = (args.event) ? args.event.key : null;

			if (_instance.autoFocus && keyCode != null && keyCode != 'ArrowUp' && keyCode != 'ArrowDown' && !args.incremental && _hourInput.getValue().length == 2)
				_minuteInput.select();
		}

		function decrement(input)
		{
			increment(input, null, null, (_instance.incrementalValue) ? _instance.incrementalValue * -1 : input.incrementalValue * -1);
		}

		function increment(input, args, e, incrementalValue)
		{
			if (input.incrementalValue == 1)
			{
				valueChanged();
				return;
			}

			var hour = _hourInput.getValue() || 0,
				minute = _minuteInput.getValue() || 0;

			if (incrementalValue == undefined)
				incrementalValue = _instance.incrementalValue;

			var dt = new Date();
			dt.setHours(parseFloat(hour), parseFloat(minute));
			dt = addMinutes(dt, incrementalValue);

			setValue(dt.getHours() + ':' + dt.getMinutes());
		}

		function addMinutes(date, minutes)
		{
			var dt = new Date(date.getTime() + minutes * 60000);
			return dt;
		}

		function valueChanged()
		{
			var value = _hourInput.getValue() + ':' + _minuteInput.getValue();
			setValue(value);
		}

		function reset()
		{
			setValue(_instance.value);
		}

		function clear()
		{
			setValue();
		}

		function select()
		{
			var input = $lib(null, _instance.element, 'input')[0];
			input.select();
		}

		function setValue(value, fireEvent)
		{
			value = value || '';

			if (value == ':')
				value = '';

			var is24HourClock = _instance.is24HourClock,
			arr = value.split(':'), number,
			hour = (arr[0]) ? $lib.padLeft(arr[0], 2) : '',
			minute = (arr[1]) ? $lib.padLeft(arr[1], 2) : '',
			minValue = (_instance.minValue) ? parseFloat(_instance.minValue.replace(':', '')) : null,
			maxValue = (_instance.maxValue) ? parseFloat(_instance.maxValue.replace(':', '')) : null;

			if (hour)
			{
				number = parseFloat(hour);

				if ((!is24HourClock && number > 11) || (is24HourClock && number > 23))
					hour = '00';
				else if (number < 0)
					hour = (is24HourClock) ? '23' : '11';
			}

			if (minute)
			{
				if (_instance.incrementalValue)
					minute = floorToIncrement(minute).toString();
				
				number = parseFloat(minute);

				if (number > 59)
					minute = '00';
				else if (number < 0)
					minute = '59';
			}

			if (!$lib.isEmpty(value))
			{
				var comparable = parseFloat($lib.format('{0}{1}', hour, minute || '00'));

				if (minValue && comparable < minValue)
				{
					minValue = minValue.toString();
					minute = minValue.slice(-2);
					hour = $lib.padLeft(minValue.substr(0, minValue.length - minute.length), 2);
				}
				else if (maxValue && comparable > maxValue)
				{
					maxValue = maxValue.toString();
					minute = maxValue.slice(-2);
					hour = $lib.padLeft(maxValue.substr(0, maxValue.length - minute.length), 2);
				}

				value = $lib.padLeft(hour, 2) + ':' + $lib.padLeft(minute, 2);
			}

			if (!is24HourClock && hour == '00')
				hour = '12';

			if (_instance.viewMode < _viewModeOption.CLOCK)
			{
				if (_hourInput.getValue() != hour)
					_hourInput.setValue(hour);

				if (_minuteInput.getValue() != minute)
					_minuteInput.setValue(minute);
			}

			if (_clockDialog)
			{
				if (!_instance.is24HourClock && hour == '12')
					hour = 0;

				setClockValue(($lib.isEmpty(hour)) ? null : parseFloat(hour), ($lib.isEmpty(minute)) ? null : parseFloat(minute));
			}

			var prevValue = _hidden.value;

			if (!$lib.isEmpty(hour) && !$lib.isEmpty(minute))
				_hidden.__setValue(value);
			else
				_hidden.__setValue('');

			if (fireEvent != false && prevValue != value)
				_instance.events.onChanged.fire(_instance, { value: value });
		}

		function setClockValue(hour, minute)
		{
			setClockHour(hour);
			setClockMinute(minute);
		}

		function setClockHour(value)
		{
			if (value === _hourClockValue)
				return;

			_hourClockValue = value;
			clearSelected([_hourClockSelected, _hourClockHand]);

			if ($lib.isEmpty(value))
			{
				_hourClockInput.textContent = '--';
				rotate(_hourClockHand, 0);
				return;
			}

			var el = _clockHours[value.toString()];
			selectHourClock();

			if ($lib.hasClass(el, _classOption.DISABLED))
			{
				_hourClockValue = '';
				return;
			}

			setDisplayValue(_hourClockInput, value);
			$lib.addClass(el, _classOption.SELECTED);
			_hourClockSelected = el;

			$lib.addClass(_hourClockHand, _classOption.SELECTED);
			rotate(_hourClockHand, hourToDegrees(value));

			if (_instance.is24HourClock && value > 11)
				$lib.addClass(_hourClockHand, _classOption.TWENTYFOURHAND);
			else
				$lib.removeClass(_hourClockHand, _classOption.TWENTYFOURHAND);
		}

		function setClockMinute(value)
		{
			if (value === _minuteClockValue)
				return;

			clearSelected([_minuteClockSelected, _minuteClockHand]);

			if (_minuteClockHand.firstChild)
			{
				$lib.remove(_minuteClockHand.firstChild);
				$lib.removeClass(_minuteClockHand, _classOption.BETWEEN);
			}

			if ($lib.isEmpty(value))
			{
				_minuteClockInput.textContent = '--';
				_minuteClockValue = 0;
				rotate(_minuteClockHand, 0);
				return;
			}

			if (_instance.incrementalValue)
				value = floorToIncrement(value);

			_minuteClockValue = value;

			var el = _clockMinutes[value.toString()];
			selectMinuteClock();

			if ($lib.hasClass(el, _classOption.DISABLED))
			{
				_minuteClockValue = '';
				_minuteClockValue = 0;
				return;
			}

			_minuteClockInput.textContent = $lib.padLeft(value.toString(), 2);

			if (el)
			{
				$lib.addClass(el, _classOption.SELECTED);
				_minuteClockSelected = el;
			}
			else
			{
				var content = $lib.element(_minuteClockHand);
				$lib.element(content, '', 'span', $lib.padLeft(value, 2));
				rotate(content, minuteToDegrees(value) * -1);

				$.addClass(_minuteClockHand, _classOption.BETWEEN);
			}

			$lib.addClass(_minuteClockHand, _classOption.SELECTED);
			rotate(_minuteClockHand, minuteToDegrees(value));
		}

		function setDisplayValue(input, value)
		{
			if (value == 0 && !_instance.is24HourClock)
				value = 12;

			input.textContent = $lib.padLeft(value.toString(), 2);
		}

		function clearSelected(elements)
		{
			$lib.each(elements, function (el)
			{
				if (el)
					$lib.removeClass(el, _classOption.SELECTED);
			});
		}

		function rotate(hand, degrees)
		{
			hand.style.transform = 'rotate(' + degrees + 'deg)';
		}

		function degreesToHour(degrees, twentyFourClock)
		{
			var value = Math.round((12 / 360) * degrees);

			if (twentyFourClock)
			{
				value = value + 12;

				if (value > 23)
					value = 12;
			}
			else if (value > 11)
				value = 0;

			return value;
		}

		function degreesToMinute(degrees)
		{
			var value = Math.round((60 / 360) * degrees)
			return (value > 59) ? 0 : value;
		}

		function hourToDegrees(hour)
		{
			hour = (_instance.is24HourClock && hour > 11) ? hour - 12 : hour;

			var value = (360 / 12) * hour;
			return (value >= 360) ? 0 : value;
		}

		function minuteToDegrees(minute)
		{
			var value = (360 / 60) * minute;
			return (value >= 360) ? 0 : value;
		}

		function getMeridiemValue()
		{
			var button = componyx.UI.Button.getSelected(_instance.id);

			return button.text;
		}

		function getValue()
		{
			return _hidden.value;
		}

		function getHour()
		{
			var value = _hidden.value.split(':')[0];
			return (value) ? parseInt(value, 10) : null;
		}

		function getMinute()
		{
			var value = _hidden.value.split(':')[1];
			return (value) ? parseInt(value, 10) : null;
		}

		function dispose()
		{
			_clockDialog = _buttonPM = _buttonAM = null;
			$lib.off(window, 'keyup', checkTabFocus);
			$lib.off(window, 'keyup', checkTabBlur);
		}
	}

	/**
    * @see {@link componyx.UI.base.methods}
    */
	componyx.UI.TimePicker.prototype = Object.create($base.methods);
	componyx.UI.TimePicker.prototype.constructor = componyx.UI.TimePicker;

	/**
	* ViewModeOption
	* @readonly
	* @enum {number}
	*/
	componyx.UI.TimePicker.ViewModeOption =
    {
    	INPUT_CLOCK_POPUP: 0,
    	INPUT_CLOCK_STATIC: 1,
    	INPUT: 2,
    	CLOCK: 3
    }
})(window);