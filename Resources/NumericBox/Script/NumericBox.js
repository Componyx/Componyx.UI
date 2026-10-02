/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * NumericBox class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {Object} An instance of the component.
    */
    componyx.UI.NumericBox = function NumericBox(id, properties)
    {
        // define private properties
        var _instance = this,
            _timerId = null,
            _input,
            _lastValue = '',
            _lastLiveValue = '',
            _pointerDown = false, _selectTextRangeTimerId,
            _themeOption = $base.static.ThemeOption,
            _roundingOption = componyx.UI.NumericBox.RoundingOption,
            _classOption =
            {
                DISABLED: 'disabled',
                READONLY: 'read-only',
                BUTTONS: 'buttons',
                BUTTONHOLDER: 'button-holder',
                BUTTON: 'button',
                PLUS: 'plus',
                MINUS: 'minus',
                VERTICAL: 'vertical'
            };

        // define public properties
        /**
         * Gets or sets the css class of the numeric box when it is disabled.
         * @type {String|null}
         */
        this.cssClassDisabled = null;

        /**
         * Gets or sets the css class of the numeric box when it is readonly.
         * @type {String|null}
         */
        this.cssClassReadOnly = null;

        /**
         * Gets or sets the css class of the button holder.
         * @type {String|null}
         */
        this.cssClassButtonHolder = null;

        /**
         * Gets or sets the css class of the buttons.
         * @type {String|null}
         */
        this.cssClassButton = null;

        /**
         * Gets or sets the css class of the plus button.
         * @type {String|null}
         */
        this.cssClassPlus = null;

        /**
         * Gets or sets the css class of the minus button.
         * @type {String|null}
         */
        this.cssClassMinus = null;

        /**
         * Gets or sets if the numeric box is disabled.
         * @type {Boolean}
         */
        this.disabled = false;

        /**
         * Gets or sets if the numeric box is readonly.
         * @type {Boolean}
         */
        this.readOnly = false;

        /**
         * Gets or sets if keyboard navigation is allowed.
         * @type {Boolean}
         */
        this.keyboardNavigation = true;

        /**
         * Gets or sets if the plus and minus buttons are visible.
         * @type {Boolean}
         */
        this.showButtons = true;

        /**
         * Gets or sets a value indicating if the buttons are displayed vertically instead of horizontally.
         * @type {Boolean}
         */
        this.verticalButtons = true;

        /**
         * Gets or sets a value indicating if the buttons are focusable.
         * @type {Boolean}
         */
        this.focusableButtons = true;

        /**
         * Gets or sets the minimium allowed value.
         * @type {Number|null}
         */
        this.minValue = null;

        /**
         * Gets or sets the maximum allowed value.
         * @type {Number|null}
         */
        this.maxValue = null;

        /**
         * Gets or sets the width of the component in the specified CSS unit (e.g., px, %, or ch).
         * @type {String}
         */
        this.width = '';

        /**
         * Gets or sets the incremental value when using plus or minus.
         * @type {Number}
         */
        this.incrementalValue = 1;

        /**
         * Gets or sets the placeholder which is visible when the input box has no value.
         * @type {String|null}
         */
        this.placeholder = null;

        /**
         * Gets or sets the decimal separator. Default: '.'.
         * @type {String}
         */
        this.decimalSeparator = '.';

        /**
         * Gets or sets the group separator.
         * @type {String|null}
         */
        this.groupSeparator = null;

        /**
         * Gets or sets the amount of decimal places.
         * @type {Number}
         */
        this.precision = 0;

        /**
         * Gets or sets the decimal rounding type that should be applied.
         * @type {componyx.UI.NumericBox.RoundingOption}
         */
        this.rounding = _roundingOption.ROUND;

        /**
         * Gets or sets if the input value can hold leading zeros.
         * @type {Boolean}
         */
        this.leadingZeros = false;

        /**
         * Gets or sets if the input value can hold trailing zeros at the decimal side.
         * @type {Boolean}
         */
        this.trailingZeros = true;

        /**
         * Gets or sets the value to right-align the digits by padding this value to the left.
         * @type {String|null}
         */
        this.digitPadLeftValue = null;

        /**
         * Gets or sets if the input value is selected when the input gets focus.
         * @type {Boolean}
         */
        this.selectOnFocus = false;

        /**
         * Gets or sets the id of the focus group to which this control belongs.
         * @type {String|null}
         */
        this.focusGroupId = null;

        /**
         * Gets or sets the value which indicates whether this control should get focus when there is no control focused in the focus group.
         * @type {Boolean}
         */
        this.focusGroupFirst = false;

        /**
         * Gets or sets the input field name of the control.
         * @type {String}
         */
        this.name = '';

        /**
         * Gets or sets the initial value of the numeric box and holds the selected value on a postback.
         * @type {Number|null}
         */
        this.value = null;

        /**
         * Gets or sets the id of the base button.
         * @type {String|null}
         */
        this.buttonId = null;

        /**
         * Gets or sets the tooltip manager used to display tooltips.
         * @type {String|null}
         */
        this.tooltipManagerId = null;

        /**
         * Gets or sets the id of the tooltip to show.
         * @type {String|null}
         */
        this.tooltipId = null;

        /**
         * Gets or sets the clientid of the HTML input.
         * @type {String|null}
         */
        this.inputId = null;


        /**
         * @class
         * @augments componyx.UI.base.Events
         * @memberof componyx.UI.NumericBox
         * @property {componyx.UI.base.Event} onFocus        - Event which fires when the component is focused.
         * @property {componyx.UI.base.Event} onBlur         - Event which fires when the component is blurred.
         * @property {componyx.UI.base.Event} onInputFocus   - Event which fires when the input is focused. @see {@link componyx.UI.NumericBox.InputEventArgs}
         * @property {componyx.UI.base.Event} onInputBlur    - Event which fires when the input is blurred. @see {@link componyx.UI.NumericBox.InputEventArgs}
         * @property {componyx.UI.base.Event} onChange       - Event which fires when the input changes. @see {@link componyx.UI.NumericBox.ChangeEventArgs}
         * @property {componyx.UI.base.Event} onChanged      - Event which fires when the input is changed (onblur or onpointerup). @see {@link componyx.UI.NumericBox.ChangeEventArgs}
         * @property {componyx.UI.base.Event} onIncrement    - Event which fires when the value is incremented. @see {@link componyx.UI.NumericBox.StepEventArgs}
         * @property {componyx.UI.base.Event} onDecrement    - Event which fires when the value is decremented. @see {@link componyx.UI.NumericBox.StepEventArgs}
         * @see {@link componyx.UI.base.Events}
         */
        function NumericBoxEvents(events)
        {
            Object.assign(this, events);
            this.onFocus = $base.static.createEvent('onFocus');
            this.onBlur = $base.static.createEvent('onBlur');
            this.onInputFocus = $base.static.createEvent('onInputFocus');
            this.onInputBlur = $base.static.createEvent('onInputBlur');
            this.onChange = $base.static.createEvent('onChange');
            this.onChanged = $base.static.createEvent('onChanged');
            this.onIncrement = $base.static.createEvent('onIncrement');
            this.onDecrement = $base.static.createEvent('onDecrement');
        }

        /**
         * NumericBox events
         * @type {componyx.UI.NumericBox.NumericBoxEvents}
         */
        this.events = new NumericBoxEvents(this.events);

        /**
         * NumericBox input focus/blur event arguments.
         * @typedef {Object} InputEventArgs
         * @memberof componyx.UI.NumericBox
         * @property {Event} event - The original event object.
         */

        /**
         * NumericBox change event arguments.
         * @typedef {Object} ChangeEventArgs
         * @memberof componyx.UI.NumericBox
         * @property {String} value - The input value without group separators and with '.' as decimal separator.
         * @property {Event} event - The original event object.
         * @property {Boolean} [incremental] - A value indicating if the change was caused by an increment or decrement (onChange only).
         */

        /**
         * NumericBox increment/decrement event arguments.
         * @typedef {Object} StepEventArgs
         * @memberof componyx.UI.NumericBox
         * @property {String} value - The new value without group separators and with '.' as decimal separator.
         * @property {String} previousValue - The previous value without group separators and with '.' as decimal separator.
         * @property {Event} event - The original event object.
         */

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);


        /** 
        * Sets the placeholder text.
        * @param {String} text The placeholder text.
        */
        this.setPlaceholder = function (text)
        {
            _input.placeholder = text;
            _instance.placeholder = text;
        }

        /** 
        * Selects the text of the input box.
        */
        this.select = function ()
        {
            select();
        }

        /** 
        * Sets focus on the input element.
        */
        this.focus = function ()
        {
            _input.focus();
        }

        /** 
        * Gets the input element.
        */
        this.getInput = function ()
        {
            return _input;
        }

        /** 
        * Gets the input value.
        * @returns {String} The value as formatted string.
        */
        this.getValue = function ()
        {
            return _input.value;
        }

        /**
        * Gets the value.
        * @returns {Number|null} The value as number.
        */
        this.getNumberValue = function ()
        {
            let value = getValue();

            if ($lib.isEmpty(value))
                return null;

            const decimals = Math.max(value.lastIndexOf(','), value.lastIndexOf('.'));
            if (decimals === -1)
                return Number(value);

            const groups = value.split(/[,\.]/);
            const d = groups.at(-1).length;
            const n = groups.join('');
            return Number(n.slice(0, -d) + '.' + n.slice(-d));
        }

        /** 
        * Sets the input value.
        * @param {String} value The value to set.
        * @param {boolean} [fireChange=true] A value indicating if the change event is fired.
        */
        this.setValue = function (value, fireChange)
        {
            if ($lib.isEmpty(value))
                value = '';

            setValue(value);

            if (fireChange !== false)
                valueChanged(false, false, false);
            else
                _lastLiveValue = _lastValue = value;
        }

        /** 
        * Resets the input to the initial value.
        * @param {boolean} [fireChange=true] A value indicating if the change event is fired.
        */
        this.reset = function (fireChange)
        {
            setValue(_instance.value);

            if (fireChange !== false)
                valueChanged(false, false, false);
            else
                _lastLiveValue = _lastValue = _instance.value;
        }

        /** 
        * Clears the input value.
        * @param {boolean} [fireChange=true] A value indicating if the change event is fired.
        */
        this.clear = function (fireChange)
        {
            setValue('');

            if (fireChange !== false)
                valueChanged(false, false, false);
            else
                _lastLiveValue = _lastValue = '';
        }

        /** 
        * Increments the value with one step.
        */
        this.increment = function ()
        {
            increment(true);
        }

        /** 
        * Decrements the value with one step.
        */
        this.decrement = function ()
        {
            decrement(true);
        }

        /** 
        * Renders the component
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'numeric-box', false);
                return;
            }

            // render logic after loading resources
            draw();
        }

        /** 
        * Destroys the component.
        * @see {@link componyx.UI.base.methods#destroy}
        */
        this.destroy = function (...args)
        {
            $base.methods.destroy.call(this, ...args);
            dispose();
        };

        function preRender()
        {
            // initialize script and css
            return ['NumericBox', ['Button']];
        }

        function draw()
        {
            let divButtonHolder = document.createElement('div'),
                name = _instance.name, value;

            _input = _instance.createSyncedInput(_instance.inputId, function ()
            {
                _instance.setValue(this.value);
            }, false);


            if (_instance.inputId)
            {
                if (_input.disabled)
                    _instance.disabled = true;

                if (_input.readOnly)
                    _instance.readOnly = true;
            }

            value = _instance.value || _input.value;

            if (!$lib.isEmpty(value))
                setValue(value);

            _input.className = _input.style.cssText = '';
            _input.type = 'text';
            _input.setAttribute('inputmode', 'numeric');
            _input.setAttribute('pattern', '[0-9]*');
            _input.readOnly = _instance.readOnly || false;
            _input.disabled = _instance.disabled || false;
            _input.placeholder = _instance.placeholder || '';

            if (_instance.width)
                _instance.element.style.width = $lib.unit(_instance.width);

            if (name)
                _input.setAttribute('name', name);

            _input.setAttribute('autocomplete', 'off');
            _instance.element.appendChild(_input);

            if (_instance.disabled)
                $lib.addClass(_instance.element, _instance.cssClassDisabled || _classOption.DISABLED);

            if (_instance.readOnly)
                $lib.addClass(_instance.element, _instance.cssClassReadOnly || _classOption.READONLY);

            if (_instance.showButtons)
            {
                $lib.addClass(_instance.element, _classOption.BUTTONS);
                createPlusButton(divButtonHolder);
                createMinusButton(divButtonHolder);
                divButtonHolder.className = _instance.cssClassButtonHolder || _classOption.BUTTONHOLDER;
                _instance.element.appendChild(divButtonHolder);

                if (_instance.verticalButtons)
                    $lib.addClass(divButtonHolder, _classOption.VERTICAL);
            }

            if (!$lib.isEmpty(_instance.focusGroupId))
            {
                if (!componyx.UI.NumericBox.FocusGroups[_instance.focusGroupId])
                    componyx.UI.NumericBox.FocusGroups[_instance.focusGroupId] = [];

                componyx.UI.NumericBox.FocusGroups[_instance.focusGroupId].push(_instance);
            }

            if (_instance.tooltipManagerId && _instance.tooltipId)
            {
                $UI.store[_instance.tooltipManagerId].addTrigger(_input, _instance.tooltipId);
            }

            _lastValue = _lastLiveValue = _input.value;
            bindEvents(_input);
            $base.methods.postRender.call(_instance);
        }

        function createMinusButton(container)
        {
            var button = createButton(container, _instance.id + '_Min');
            button.cssClass += ' ' + (_instance.cssClassMinus || _classOption.MINUS);

            if (!_instance.disabled)
            {
                button.events.onPointerDown.priorityAdd(function (sender, args) { _pointerDown = true; holdDecrement(args.event); });
                button.events.onClick.priorityAdd(function (sender, args)
                {
                    // call decrement() when button has focus and the keyboard is used to fire the click event
                    if (!_pointerDown)
                    {
                        decrement();
                        valueChanged();
                    }


                    _pointerDown = false;
                });
            }
            button.show();
        }

        function createPlusButton(container)
        {
            var button = createButton(container, _instance.id + '_Plus');
            button.cssClass += ' ' + (_instance.cssClassPlus || _classOption.PLUS);

            if (!_instance.disabled)
            {
                button.events.onPointerDown.priorityAdd(function (sender, args) { _pointerDown = true; holdIncrement(); });
                button.events.onClick.priorityAdd(function (sender, args)
                {
                    // call increment() when button has focus and the keyboard is used to fire the click event
                    if (!_pointerDown)
                    {
                        increment();
                        valueChanged();
                    }

                    _pointerDown = false;
                });
            }
            button.show();
        }

        function createButton(container, id)
        {
            var button = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: container });

            button.transparentBorder = button.primary = false;
            button.cssClass = _instance.cssClassButton || _classOption.BUTTON;
            button.clone($UI.store[_instance.buttonId], _instance);
            button.disabled = _instance.disabled;
            button.delegateFocusEvents(_instance);

            if (!_instance.focusableButtons)
                button.tabIndex = -1;

            return button;
        }

        function bindEvents(input)
        {
            if (!_instance.readOnly && !_instance.disabled)
            {
                $lib.on(input, 'keydown', validateInput);
                $lib.on(input, 'input', acceptInput);

                if (_instance.keyboardNavigation)
                {
                    $lib.on(input, 'keydown', navigate);
                    $lib.on(input, 'keyup', checkValueChange);
                }
            }

            $lib.on(input, 'blur', inputBlur);
            $lib.on(document, 'pointerup', stopHold);
            $lib.on(document, 'pointerdown', documentStop);

            $lib.on(input, 'focus', function (e)
            {
                componyx.UI.NumericBox.FocusGroupActive[_instance.focusGroupId] = _instance;

                if (!(_instance.readOnly || _instance.disabled) && _instance.selectOnFocus)
                    _selectTextRangeTimerId = setTimeout(function () { $lib.selectTextRange(input) }, 0);

                _instance.events.onInputFocus.fire(_instance, { event: $lib.event });
            });

            $lib.on(input, 'focus', _instance.onFocus, _instance, _instance);
        }
        function validateInput()
        {
            var e = $lib.event,
                keyCode = e.key,
                sep = _instance.decimalSeparator,
                sepKey = sep == keyCode,
                value = _input.value;

            if (keyCode == 'Enter')
            {
                inputBlur(e);
                return;
            }

            if (' End Home ArrowLeft ArrowRight ArrowUp ArrowDown Delete Backspace Tab '.indexOf(' ' + keyCode + ' ') > -1)
                return true;

            if ((sepKey && (!_instance.precision || value.indexOf(sepKey) > -1)) || (!sepKey && keyCode.match(/[0-9]/) == null))
                e.preventDefault();
        }

        function acceptInput()
        {
            let sep = _instance.decimalSeparator;

            _input.__value = _input.value.replace(sep, '');
        }

        function checkValueChange()
        {
            valueChanged(true);
        }

        function navigate()
        {
            var e = $lib.event,
                keyCode = e.key;

            if (keyCode == 'ArrowUp')
                increment();
            else if (keyCode == 'ArrowDown')
                decrement();
        }

        function valueChanged(live = false, incremental = false, fireHtmlEvent = true)
        {
            var e = $lib.event,
                input = _input,
                keyCode = (e) ? e.key : null;

            if (keyCode == 'Tab')
                return;

            if (live && _lastLiveValue != input.value)
            {
                _lastLiveValue = input.value;
                _instance.events.onChange.fire(_instance, { value: getValue(), event: $lib.event, incremental: incremental });
            }
            else if (!live && _lastValue != input.value)
            {
                _lastValue = _lastLiveValue = input.value;
                _instance.events.onChanged.fire(_instance, { value: getValue(), event: $lib.event });

                if (fireHtmlEvent)
                    $lib.fireEvent(input, 'change', true, true);
            }
        }

        function inputBlur()
        {
            let value = getValue();

            clearTimeout(_selectTextRangeTimerId);
            setValue(value);
            valueChanged(false, false);

            _instance.events.onInputBlur.fire(_instance, { event: $lib.event });
            _instance.onBlur.call(_instance);
        }

        function holdIncrement()
        {
            stopHold();
            increment();
            _timerId = setTimeout(function ()
            {
                _timerId = setInterval(function ()
                {
                    if (_instance.renderState === $base.static.RenderState.RENDERED)
                        increment();
                    else
                        stopHold();
                }, 50);
            }, 500);
        }

        function increment(ignoreFocusBox)
        {
            if (!ignoreFocusBox)
            {
                let focusedBox = getFocusedBox();

                if (focusedBox != null && focusedBox != _instance)
                {
                    focusedBox.increment(); // decrement other numericBox in focus group
                    return;
                }
            }

            let value = getValue(),
                prevValue = value,
                inc = _instance.incrementalValue,
                min = _instance.minValue,
                max = _instance.maxValue;

            if ($lib.isEmpty(value))
            {
                if (isNumber(min))
                    value = min;
                else if (isNumber(inc))
                {
                    if (!isNumber(max) || inc <= max)
                        value = inc;
                    else
                        value = max;
                }
                else if (isNumber(max))
                    value = max;
                else
                    value = 0;
            }
            else if (isNumber(value))
                value = parseFloat(value) + inc;

            setValue(value, true);
            _instance.events.onIncrement.fire(_instance, { value: getValue(), previousValue: prevValue, event: $lib.event });
            valueChanged(true, true);
        }

        function holdDecrement()
        {
            stopHold();
            decrement();

            _timerId = setTimeout(function ()
            {
                _timerId = setInterval(function ()
                {
                    if (_instance.renderState === $base.static.RenderState.RENDERED)
                        decrement();
                    else
                        stopHold();
                }, 50);
            }, 500);
        }

        function decrement(ignoreFocusBox)
        {
            if (!ignoreFocusBox)
            {
                let focusedBox = getFocusedBox();

                if (focusedBox != null && focusedBox != _instance)
                {
                    focusedBox.decrement(); // decrement other numericBox in focus group
                    return;
                }
            }

            let value = getValue(),
                prevValue = value,
                inc = _instance.incrementalValue,
                min = _instance.minValue,
                max = _instance.maxValue;

            if ($lib.isEmpty(value))
            {
                if (isNumber(max))
                    value = max;
                else if (isNumber(inc))
                {
                    if (!isNumber(min) || inc >= min)
                        value = inc;
                    else
                        value = min;
                }
                else if (isNumber(min))
                    value = min;
                else
                    value = 0;
            }
            else if (isNumber(value))
            {
                value = parseFloat(value) - inc;
            }

            setValue(value, true);
            _instance.events.onDecrement.fire(_instance, { value: getValue(), previousValue: prevValue, event: $lib.event });
            valueChanged(true, true);
        }

        function documentStop()
        {
            if (!_pointerDown)
                stopHold();
        }

        function stopHold()
        {
            if (_timerId && _instance.renderState === $base.static.RenderState.RENDERED)
            {
                var focusedBox = getFocusedBox();

                if (focusedBox?.element?.isConnected)
                    focusedBox.focus();
                else if (_input?.element?.isConnected)
                    _input.focus();

                valueChanged();
            }

            clearInterval(_timerId);
            clearTimeout(_timerId);
            _timerId = null;
        }

        function getFocusedBox()
        {
            if ($lib.isEmpty(_instance.focusGroupId))
                return null;

            var active = componyx.UI.NumericBox.FocusGroupActive[_instance.focusGroupId];

            if (active)
                return active;
            else
                return getFocusGroupFirst();
        }

        function getFocusGroupFirst()
        {
            var groups = componyx.UI.NumericBox.FocusGroups[_instance.focusGroupId],
                index = $lib.indexOf(groups, function (item) { return item.focusGroupFirst });

            if (index > -1)
                return groups[index];
            else
                return groups[0];
        }

        function getValue()
        {
            let value = _input.value,
                groupSep = _instance.groupSeparator;

            if (groupSep)
            {
                groupSep = $lib.escapeRegExp(groupSep);
                value = value.replace(new RegExp(groupSep, 'g'), '');
            }

            return value.replace(_instance.decimalSeparator, '.');
        }

        function isNumber(value)
        {
            return (!$lib.isEmpty(value) && !isNaN(value));
        }

        function formatNumber(value)
        {
            return $lib.formatNumber(value, _instance.leadingZeros, _instance.trailingZeros, _instance.precision, _roundingOption.getName(_instance.rounding), _instance.decimalSeparator, _instance.groupSeparator, _instance.digitPadLeftValue);
        }

        function setValue(value, incremental)
        {
            var min = _instance.minValue,
                max = _instance.maxValue,
                inc = _instance.incrementalValue;

            if (isNumber(value))
            {
                if (inc > 1)
                    value = Math.round(value / inc) * inc; // Snap to nearest increment if requested

                if (min != null && value < min)
                    value = (incremental && max != null) ? max : min;
                else if (max != null && value > max)
                    value = (incremental && min != null) ? min : max;

                value = formatNumber(value);
            }

            if (_input.value != value)
                _input.__setValue(value);
        }

        function select()
        {
            var input = _input;
            input.select();
        }

        function dispose()
        {
            var groups = componyx.UI.NumericBox.FocusGroups[_instance.focusGroupId] || null,
                active = componyx.UI.NumericBox.FocusGroupActive,
                index = -1;

            if (!$lib.isEmpty(_instance.focusGroupId))
            {
                if (active[_instance.focusGroupId] === _instance)
                    delete active[_instance.focusGroupId];

                if (groups)
                    index = $lib.indexOf(groups, function (item) { return (item === _instance) })

                if (index > -1)
                    groups.splice(index, 1);
            }

            $lib.off(document, 'pointerup', stopHold);
            $lib.off(document, 'pointerdown', documentStop);
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.NumericBox.prototype = Object.create($base.methods);
    componyx.UI.NumericBox.prototype.constructor = componyx.UI.NumericBox;
    componyx.UI.NumericBox.FocusGroups = {};
    componyx.UI.NumericBox.FocusGroupActive = {};

    /**
    * RoundingOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.NumericBox.RoundingOption =
    {
        NONE: 0,
        ROUND: 1,
        FLOOR: 2,
        CEIL: 3,

        getName: function (value) { return $base.static.getKeyByValue(this, value).toLowerCase(); }
    }
})(window);