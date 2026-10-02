/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * Slider class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {Object} An instance of the component.
    */
    componyx.UI.Slider = function Slider(id, properties)
    {
        // define private properties
        var _instance = this,
            _content, _track, _range, _decreaseButton, _increaseButton, _tooltipManager, _value, _startValue, _draggableHandle, _draggableStartHandle,
            _handlerId = [], _holdTimerId, _tooltipTimerId, _select, _cancelSelect, _selectedTicks = [], _animation, _dragging, _event,
            _tickMarkSideOption = componyx.UI.Slider.TickMarkSideOption, _hidden, _hiddenStart, _hiddenRange,
            _themeOption = $base.static.ThemeOption,
            _classOption =
            {
                ANIMATION: 'animation',
                VERTICAL: 'vertical',
                REVERSED: 'reversed',
                DISABLED: 'disabled',
                CONTENT: 'content',
                TICK_SIDE_BEFORE: 'tick-side-before',
                TICK_SIDE_AFTER: 'tick-side-after',
                TICKS: 'ticks',
                TICK_MARK: 'tick',
                MINOR: 'minor',
                MAJOR: 'major',
                TRACK: 'track',
                FIXED_TRACK_SIZE: 'fixed-track-size',
                RANGE: 'range',
                HANDLE: 'handle',
                START_HANDLE: 'handle start',
                SELECTED: 'selected',
                SELECTED_START: 'selected-start',
                DECREASE_BUTTON: 'button decrease',
                INCREASE_BUTTON: 'button increase',
                EXPAND_ICON: 'expand-icon'
            };

        // define public properties
        /**
         * Gets or sets a value indicating if the slider is rendered vertically.
         * @type {Boolean}
         */
        this.vertical = false;

        /**
         * Gets or sets a value indicating if the slider has a start- and end-handle to set a range.
         * @type {Boolean}
         */
        this.range = false;

        /**
         * Gets or sets a value indicating if the increase and decrease buttons are displayed.
         * @type {Boolean}
         */
        this.showButtons = true;

        /**
         * Gets or sets a value indicating if tooltips are displayed when there are value changes.
         * @type {Boolean}
         */
        this.showTooltips = true;

        /**
         * Gets or sets a value indicating if the slider is rendered in reverse direction.
         * @type {Boolean}
         */
        this.reversed = false;

        /**
         * Gets or sets a value indicating if the css animation is activated when the track is selected.
         * @type {Boolean}
         */
        this.animation = true;

        /**
         * Gets or sets a value indicating if the slider is disabled.
         * @type {Boolean}
         */
        this.disabled = false;

        /**
         * Gets or sets a value indicating where the tickmark side is rendered.
         * @type {componyx.UI.Slider.TickMarkSideOption}
         */
        this.tickMarkSide = _tickMarkSideOption.NONE;

        /**
         * Gets or sets a value indicating where the tickmark values are rendered.
         * @type {componyx.UI.Slider.TickMarkSideOption}
         */
        this.tickMarkValueSide = _tickMarkSideOption.NONE;

        /**
         * Gets or sets the track size. If a track size is defined the CSS class 'fixed-track-size' is appended to the root element. You can also control the slider’s dimensions via CSS, either on the track or the root element.
         * @type {String|Number}
         */
        this.trackSize = '';

        /**
         * Gets or sets the decimal separator used when displaying tickmark values.
         * @type {String}
         */
        this.decimalSeparator = '.';

        /**
         * Gets or sets the decimal places used when displaying tickmark values.
         * @type {Number}
         */
        this.decimalPlaces = 0;

        /**
         * Gets or sets the minimum value.
         * @type {Number}
         */
        this.minValue = 0;

        /**
         * Gets or sets the maximum value.
         * @type {Number}
         */
        this.maxValue = 100;

        /**
         * Gets or sets the minimum change in value.
         * @type {Number}
         */
        this.minChange = 1;

        /**
         * Gets or sets the maximum change in value. If a maximum value is not set the handle can move to any clicked position in the track.
         * @type {Number}
         */
        this.maxChange = 0;

        /**
         * Gets or sets the start value of the range slider.
         * @type {Number}
         */
        this.startValue = 0;

        /**
         * Gets or sets the value (end value in range) of the slider. If range is set to true and this value is not set it will take the maxValue by default, otherwise it defaults to the minValue or 0.
         * @type {Number|null}
         */
        this.value = null;

        /**
         * Gets or sets the amount of rendered tickmarks.
         * @type {Number}
         */
        this.tickMarks = 10;

        /**
         * Gets or sets the tickmark step on which a value is rendered. 0 means never, 1 means every item, 2 means every 2nd item.
         * @type {Number}
         */
        this.tickMarkValueStep = 1;

        /**
         * Gets or sets the tickmark step on which a minor tick is rendered. 0 means never, 1 means every item, 2 means every 2nd item and so on.
         * @type {Number}
         */
        this.minorTickMarkStep = 0;

        /**
         * Gets or sets the tickmark step on which a major tick is rendered. 0 means never, 1 means every item, 2 means every 2nd item and so on.
         * @type {Number}
         */
        this.majorTickMarkStep = 0;

        /**
         * Gets or sets the tickmark labels when text instead of a numeric value is desired.
         * @type {Object.<number, string>}
         */
        this.tickMarkLabels = {};

        /**
         * Gets or sets the id of the decrease button from which the settings are cloned.
         * @type {String|null}
         */
        this.decreaseButtonId = null;

        /**
         * Gets or sets the id of the increase button from which the settings are cloned.
         * @type {String|null}
         */
        this.increaseButtonId = null;

        /**
         * Gets or sets the id of the tooltip manager from which the settings are cloned.
         * @type {String|null}
         */
        this.tooltipManagerId = null;

        /**
         * Gets or sets the id of the hidden input from which the attributes and properties are cloned. The hidden input contains the selected value.
         * @type {String|null}
         */
        this.hiddenInputId = null;

        /**
         * Gets or sets the id of the range-start hidden input from which the attributes and properties are cloned. The hidden input contains the selected range start value.
         * @type {String|null}
         */
        this.startHiddenInputId = null;

        /**
         * Gets or sets the id of the range hidden input from which the attributes and properties are cloned. The hidden input contains both the selected range start and end value.
         * @type {String|null}
         */
        this.rangeHiddenInputId = null;


        /**
         * @class
         * @augments componyx.UI.base.Events
         * @memberof componyx.UI.Slider
         * @property {componyx.UI.base.Event} onFocus   - Event which fires when the component is focused.
         * @property {componyx.UI.base.Event} onBlur    - Event which fires when the component is blurred.
         * @property {componyx.UI.base.Event} onChange  - Event which fires when the value or start value is changed. @see {@link componyx.UI.Slider.ChangeEventArgs}
         * @see {@link componyx.UI.base.Events}
         */
        function SliderEvents(events)
        {
            Object.assign(this, events);
            this.onFocus = $base.static.createEvent('onFocus');
            this.onBlur = $base.static.createEvent('onBlur');
            this.onChange = $base.static.createEvent('onChange');
        }

        /**
         * Slider events
         * @type {componyx.UI.Slider.SliderEvents}
         */
        this.events = new SliderEvents(this.events);

        /**
         * Slider change event arguments.
         * @typedef {Object} ChangeEventArgs
         * @memberof componyx.UI.Slider
         * @property {Boolean} isStart - A value indicating if the range start value changed instead of the (end) value.
         * @property {Number|null} value - The new value.
         */

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        /** 
        * Sets the value template. The template supports the below listed interpolations.
        * - {value} This value will be replaced with the selected value or label text.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        this.setValueTemplate = function (content)
        {
            _instance.addTemplate('Value', content, false);
        }

        /** 
        * Sets the start value template. The template supports the below listed interpolations.
        * - {value} This value will be replaced with the selected value or label text.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        this.setStartValueTemplate = function (content)
        {
            _instance.addTemplate('StartValue', content, false);
        }

        /** 
        * Gets the selected slider value(s).
        * @returns {Number|Number[]} The value for a slider or the range start and end values for a range slider.
        */
        this.getValue = function ()
        {
            if (_instance.range)
                return [_startValue, _value];
            else
                return _value;
        }

        /** 
        * Sets the (end) value.
        * @param {Number} value The value to set.
        */
        this.setValue = function (value)
        {
            setValue(value);
        }

        /** 
        * Sets the start value in a range slider.
        * @param {Number} value The start value to set.
        */
        this.setStartValue = function (value)
        {
            setStartValue(value);
        }

        /** 
        * Renders the component
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'slider');
                return;
            }

            // create default templates
            if (!_instance.hasTemplate('Value'))
                _instance.addTemplate('Value', '{value}', true);

            if (!_instance.hasTemplate('StartValue'))
                _instance.addTemplate('StartValue', '{value}', true);

            // render logic after loading resources
            if ($lib.isEmpty(_instance.value))
            {
                if (_instance.range)
                    _instance.value = _instance.maxValue || 0;
                else
                    _instance.value = _instance.minValue || 0;
            }

            draw();
        }

        /** 
        * Handles the post render procedure.
        */
        this.postRender = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING) // extra safety to never execute a postRender when the component state is incorrect
                return;

            if (!$base.methods.postRender.call(_instance)) // component got destroyed on postrender event
                return;

            setValue(_instance.value);

            if (_instance.range)
                setStartValue(_instance.startValue);
            else
                updateHandleSettings();
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
            return ['Slider'];
        }

        function draw()
        {
            var tickMarkValueSide = _instance.tickMarkValueSide,
                range = _instance.range,
                reversed = _instance.reversed;

            _hidden = _instance.createSyncedInput(_instance.hiddenInputId, function ()
            {
                var value = this.value;
                setValue(($lib.isEmpty(value)) ? null : parseFloat(value));
            });

            if (range)
            {
                _hiddenStart = _instance.createSyncedInput(_instance.startHiddenInputId, function ()
                {
                    var value = this.value;
                    setStartValue(($lib.isEmpty(value)) ? null : parseFloat(value));
                });

                _hiddenRange = _instance.createSyncedInput(_instance.rangeHiddenInputId, function ()
                {
                    var value = this.value;

                    if ($lib.isEmpty(value))
                    {
                        setValue(null);
                        setStartValue(null);
                    }
                    else
                    {
                        var values = value.split(',').map(v => v.trim()),
                            start = values[0] !== undefined && !isNaN(values[0]) ? parseFloat(values[0]) : null,
                            end = values[1] !== undefined && !isNaN(values[1]) ? parseFloat(values[1]) : null;

                        setStartValue(start);
                        setValue(end);
                    }
                });

                if ($lib.isEmpty(_instance.startValue) && !$lib.isEmpty(_hiddenStart.value) && !isNaN(_hiddenStart.value))
                    _instance.startValue = parseFloat(_hiddenStart.value);
            }

            if (_instance.vertical)
                $lib.addClass(_instance.element, _classOption.VERTICAL);

            if (reversed)
                $lib.addClass(_instance.element, _classOption.REVERSED);

            if (range)
                $lib.addClass(_instance.element, _classOption.RANGE);

            if (_instance.disabled)
                $lib.addClass(_instance.element, _classOption.DISABLED);

            if (_instance.tickMarkSide === _tickMarkSideOption.BEFORE)
                $lib.addClass(_instance.element, _classOption.TICK_SIDE_BEFORE);
            else if (_instance.tickMarkSide === _tickMarkSideOption.AFTER)
                $lib.addClass(_instance.element, _classOption.TICK_SIDE_AFTER);

            if (_instance.showButtons)
            {
                if (reversed)
                    createIncreaseButton(_instance.element);
                else
                    createDecreaseButton(_instance.element);
            }

            _content = $lib.element(_instance.element, null, '', null, { "class": _classOption.CONTENT });

            if (_instance.majorTickMarkStep)
                $lib.addClass(_instance.element, _classOption.MAJOR);

            if (_instance.minorTickMarkStep)
                $lib.addClass(_instance.element, _classOption.MINOR);

            createTicks(tickMarkValueSide === _tickMarkSideOption.BOTH || tickMarkValueSide === _tickMarkSideOption.BEFORE, '');

            createTrack();
            createRange();

            if (range)
                _draggableStartHandle = createDraggableHandle(_classOption.START_HANDLE, dragStartHandle);

            _draggableHandle = createDraggableHandle(_classOption.HANDLE, dragHandle);

            if (range && reversed)
                switchHandles(true);

            createTicks(tickMarkValueSide === _tickMarkSideOption.BOTH || tickMarkValueSide === _tickMarkSideOption.AFTER, ' after');

            if (_instance.showButtons)
            {
                if (reversed)
                    createDecreaseButton(_instance.element);
                else
                    createIncreaseButton(_instance.element);
            }

            if (_instance.showTooltips)
                createTooltipManager();

            if ($lib.isEmpty(_instance.value) && !$lib.isEmpty(_hidden.value) && !isNaN(_hidden.value))
                _instance.value = parseFloat(_hidden.value);

            bindEvents();
            _instance.renderChildren();
        }

        function createTicks(withValues, cssAfter)
        {
            if (!_instance.tickMarks || _instance.tickMarkSide === _tickMarkSideOption.NONE)
                return;

            var ul = $lib.element(_content, null, 'ul', null, { "class": _classOption.TICKS + cssAfter }),
                reversed = _instance.reversed,
                ticks = _instance.tickMarks,
                minorStep = _instance.minorTickMarkStep,
                majorStep = _instance.majorTickMarkStep,
                value = null, index = 0;

            if ((cssAfter && _instance.tickMarkSide === _tickMarkSideOption.BEFORE) || (!cssAfter && _instance.tickMarkSide === _tickMarkSideOption.AFTER))
                return;

            if (reversed)
                index = ticks;

            for (index; (reversed) ? index >= 0 : index <= ticks; (reversed) ? --index : ++index)
            {
                if (withValues)
                {
                    value = (reversed) ? _instance.maxValue - ((getValueDelta() / (ticks)) * (ticks - index)) : _instance.minValue + ((getValueDelta() / (ticks)) * index);
                    value = $.formatNumber(value, false, true, _instance.decimalPlaces, false, _instance.decimalSeparator);
                }

                createTickMark(ul, (withValues && index % _instance.tickMarkValueStep == 0) ? value : null, (minorStep && (index % minorStep == 0)), (majorStep && (index % majorStep == 0)));
            }
        }

        function createTickMark(container, value, minorStep, majorStep)
        {
            var cssClass = '';

            if (value != null)
                value = ((_instance.tickMarkLabels) ? _instance.tickMarkLabels[value] || value : value).toString();

            if (majorStep)
                cssClass = ' ' + _classOption.MAJOR;
            else if (minorStep)
                cssClass = ' ' + _classOption.MINOR;

            $lib.element(container, null, 'li', (value != null) ? $lib.element(null, null, 'b', value) : null, { "class": _classOption.TICK_MARK + cssClass });
        }

        function createTrack()
        {
            _track = $lib.element(_content, null, '', null, { "class": _classOption.TRACK });

            if (_instance.trackSize)
            {
                _instance.element.classList.add(_classOption.FIXED_TRACK_SIZE);

                if (_instance.vertical)
                    _content.style.height = $lib.unit(_instance.trackSize);
                else
                    _content.style.width = $lib.unit(_instance.trackSize);
            }
        }

        function createRange()
        {
            _range = $lib.element(_track, null, '', null, { "class": _classOption.RANGE });
        }

        function createDraggableHandle(cssClass, drag)
        {
            var handle = $lib.element(_content, null, 'span', null, { "class": cssClass, "tabindex": (_instance.disabled) ? '' : '0' }),
                vertical = _instance.vertical, overshoot,
                pos = (vertical) ? 'top' : 'left',
                settings = {
                    boundaryZone: _track,
                    onDrag: function ()
                    {
                        if (!_instance.disabled)
                            $lib.defer(drag);
                    },
                    onDragEnd: function ()
                    {
                        handle.focus();
                    },
                    dragX: !_instance.disabled && !vertical,
                    dragY: !_instance.disabled && vertical,
                    ignoreBoundaryBorders: true
                };

            if ($lib.styleValue(handle, 'box-sizing', true) != 'border-box')
                handle.style.boxSizing = 'border-box';

            if (!_instance.disabled)
                bindHandleEvents(handle);

            return $lib.draggable(handle, settings);
        }

        function createDecreaseButton(container)
        {
            var direction = (_instance.vertical) ? ' up' : ' left';

            if (_instance.reversed)
                direction = (_instance.vertical) ? ' down' : ' right';

            _decreaseButton = createButton(container, _instance.id + '_decrease', _classOption.DECREASE_BUTTON + direction);
            _decreaseButton.events.onCommandClick.priorityAdd(function ()
            {
                if ($lib.event.type == 'keydown')
                {
                    decrease();
                    stop();
                }
            });

            _decreaseButton.events.onPointerDown.priorityAdd(function () { decrease(); });
            _decreaseButton.events.onPointerUp.priorityAdd(stop);
        }

        function createIncreaseButton(container)
        {
            var direction = (_instance.vertical) ? ' down' : ' right';

            if (_instance.reversed)
                direction = (_instance.vertical) ? ' up' : ' left';

            _increaseButton = createButton(container, _instance.id + '_increase', _classOption.INCREASE_BUTTON + direction);
            _increaseButton.events.onCommandClick.priorityAdd(function ()
            {
                if ($lib.event.type == 'keydown')
                {
                    increase();
                    stop();
                }
            });

            _increaseButton.events.onPointerDown.priorityAdd(function () { increase(); });
            _increaseButton.events.onPointerUp.priorityAdd(stop);
        }

        function createButton(container, id, cssClass)
        {
            var button = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: container });

            button.transparent = button.transparentBorder = button.hasIcon = true;
            button.cssClassIcon = _classOption.EXPAND_ICON;
            button.primary = false;
            button.cssClass = cssClass;
            button.clone($UI.store[_instance.buttonId], _instance);
            button.disabled = _instance.disabled;
            button.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);
            button.delegateFocusEvents(_instance);
            button.showing = true;

            return button;
        }

        function createTooltipManager()
        {
            var id = _instance.id + '_TooltipManager';

            _tooltipManager = $UI.createComponent(componyx.UI.TooltipManager, { id: id, containerElement: _instance.element });
            _tooltipManager.singleBoxInstance = false; // use separate box for range start and end tooltips
            _tooltipManager.clone($UI.store[_instance.tooltipManagerId], _instance, true, true, { triggers: '' });

            if (!_tooltipManager.boxId)
            {
                var box = $UI.createComponent(componyx.UI.Box, { id: id + '_Box', containerElement: _instance.element });
                box.autoPosition = componyx.UI.Box.AutoPositionOption.EXPAND;

                if (_instance.vertical)
                {
                    box.alignY = componyx.UI.Box.AlignXOption.CENTER;
                    box.expandDirection = componyx.UI.Box.ExpandDirectionOption.LEFT;
                }
                else
                {
                    box.alignX = componyx.UI.Box.AlignXOption.CENTER;
                    box.expandDirection = componyx.UI.Box.ExpandDirectionOption.UP;
                }


                box.autoInvertFit = true;
                _tooltipManager.boxId = box.id;
            }

            _tooltipManager.showing = true;
            _tooltipManager.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);
        }

        function bindEvents()
        {
            if (_instance.showTooltips)
            {
                _instance.events.onFocus.priorityAdd(function ()
                {
                    _tooltipManager.allowHide(false);
                    clearTimeout(_tooltipTimerId);

                    _tooltipTimerId = setTimeout(function ()
                    {
                        _tooltipManager.showTooltip(_draggableHandle.element);

                        if (_instance.range)
                            _tooltipManager.showTooltip(_draggableStartHandle.element);
                    }, 0);
                });

                _instance.events.onBlur.priorityAdd(function ()
                {
                    clearTimeout(_tooltipTimerId);

                    _tooltipTimerId = setTimeout(function ()
                    {
                        if (_select)
                            return;

                        _tooltipManager.allowHide(true);
                        _tooltipManager.hideTooltip(_draggableHandle.element);

                        if (_instance.range)
                            _tooltipManager.hideTooltip(_draggableStartHandle.element);
                    }, 0);
                });
            }

            _handlerId.push([window, 'resize', $lib.on(window, 'resize', function ()
            {
                var currentValue = _value;
                _value = null; // force change
                setValue(currentValue);

                if (_draggableStartHandle)
                {
                    currentValue = _startValue;
                    _startValue = null;
                    setStartValue(_startValue);
                }
            })]);

            if (!_instance.disabled)
            {
                var eventType = 'mouseup';
                $lib.on(document, eventType, cancelSelectState, false);
                $lib.on(document, eventType, stop);
                _handlerId.push([document, 'mouseup', $lib.on(document, 'mouseup', function ()
                {
                    if (_select)
                        _select.focus();

                    _select = null;
                })]);

                $lib.on(_content, 'mousedown', function (e) { $lib.defer(select.bind(_instance, e)); });
            }
        }

        function bindHandleEvents(handle)
        {
            $lib.on(handle, 'focus', _instance.onFocus, _instance, _instance);
            $lib.on(handle, 'blur', _instance.onBlur, _instance, _instance);
            $lib.on(handle, 'keydown', key);
            $lib.on(handle, 'keyup', stop);
            $lib.on(handle, 'mousedown', cancelSelectState, true);
            $lib.on(handle, 'mousedown', animationState, false);
        }

        function showTooltip(el, value, templateId)
        {
            if (!_instance.showTooltips)
                return;

            var id = _instance.id + '_' + templateId,
                div = $lib.element();

            if (_instance.tickMarkLabels && _instance.tickMarkLabels[value])
                value = _instance.tickMarkLabels[value];

            _instance.applyTemplate(div, templateId, { value: value });
            _tooltipManager.addTooltip(id, div.innerHTML); // add or update

            if (!_tooltipManager.triggers.get(el))
                _tooltipManager.addTrigger(el, id);

            if (_instance.__focus || _select)
                _tooltipManager.showTooltip(el);
        }

        function animationState(state)
        {
            if (!_instance.animation)
                return;

            _animation = state;

            if (state)
                $lib.addClass(_instance.element, _classOption.ANIMATION);
            else
                $lib.removeClass(_instance.element, _classOption.ANIMATION);
        }

        function cancelSelectState(state)
        {
            _cancelSelect = state;
        }

        function key(e)
        {
            var keyCode = e.key,
                vertical = _instance.vertical,
                reversed = _instance.reversed,
                draggable = (this === _draggableHandle.element) ? _draggableHandle : _draggableStartHandle,
                up = (keyCode == 'ArrowUp'), down = (keyCode == 'ArrowDown'),
                left = (keyCode == 'ArrowLeft'), right = (keyCode == 'ArrowRight');

            if (!(up || down || left || right))
                return;

            if ((!reversed && !vertical && (right || up)) ||
                (!reversed && vertical && (right || down)) ||
                (reversed && !vertical && (left || down)) ||
                (reversed && vertical && (left || up)))
                increase(draggable);
            else
                decrease(draggable);

            if (up || down)
                e.preventDefault(); // stop default page scroll
        }

        function select(e)
        {
            if (e.button > 0 || _cancelSelect)
                return;

            var vertical = _instance.vertical,
                reversed = _instance.reversed,
                maxChange = _instance.maxChange,
                scroll = $lib.getScrollPosition(),
                cursorPos = (vertical) ? $lib.clientY(e) + scroll.scrollTop : $lib.clientX(e) + scroll.scrollLeft,
                contentPos = $lib.getPos(_content),
                handlePos = getHandlePosition(_draggableHandle),
                startHandlePos = (_draggableStartHandle) ? getHandlePosition(_draggableStartHandle) : null,
                pos = cursorPos, diff, startDiff, value;

            pos -= (vertical) ? contentPos.top : contentPos.left;
            diff = Math.abs(pos - handlePos);

            if (_draggableStartHandle)
                startDiff = Math.abs(pos - startHandlePos);

            value = positionToValue(pos);
            animationState(true);
            _dragging = false;
            _event = e;

            if (_draggableStartHandle && (startDiff < diff || (startDiff === diff && pos < startHandlePos && !reversed))) // start-handle is closer to clicked position or handles are at same position and click position was before handle
            {
                if (maxChange && Math.abs(_startValue - value) > maxChange)
                    value += (pos > startHandlePos && !reversed) ? maxChange : maxChange * -1; // move back or forwards

                _select = _draggableStartHandle.element;
                setStartValue(value);
            }
            else
            {
                if (maxChange && Math.abs(_value - value) > maxChange)
                    value += (pos > handlePos && !reversed) ? maxChange : maxChange * -1; // move back or forwards

                _select = _draggableHandle.element;
                setValue(value);
            }
        }

        function dragStartHandle()
        {
            setDragHandle(_draggableStartHandle, setStartValue);
        }

        function dragHandle()
        {
            setDragHandle(_draggableHandle, setValue);
        }

        function setDragHandle(draggable, setValue)
        {
            let el = draggable.element,
                elPos = $lib.getPos(el),
                transform = el.style.transform,
                left = el.style.left,
                top = el.style.top;

            el.style.transform = "";
            el.style.left = el.style.top = '';
            $.setPos(el, { left: elPos.left, top: elPos.top }); // force element at position
            setValue(positionToValue(getHandlePosition(draggable)));
            el.style.transform = transform;
            el.style.left = left;
            el.style.top = top;
        }

        function switchHandles(reverse)
        {
            var startHandle = _draggableStartHandle.element,
                handle = _draggableHandle.element;

            if (reverse)
                _content.insertBefore(startHandle, handle);
            else
                _content.insertBefore(handle, startHandle);
        }

        function getHandlePosition(draggable)
        {
            var style = draggable.element.style,
                pos = (_instance.vertical) ? style.top : style.left;

            return Math.round(getNumericValue(pos));
        }

        function setStartValue(value)
        {
            value = validateValue(value);

            if (_value != null && value > _value)
                value = _value;

            var pos = valueToPosition(value),
                el = _draggableStartHandle.element,
                nextEl = el.nextElementSibling,
                change = (value != _startValue);

            if (!change)
                return;

            _startValue = value;
            setPosition(el, pos);

            if (_value == _instance.maxValue && _startValue == _value && nextEl === _draggableHandle.element) // put start-handle above end-handle to allow backwards movement
            {
                switchHandles();
                el.focus();
            }
            else if (_value == _instance.maxValue && _startValue != _value && nextEl !== _draggableHandle.element)
            {
                switchHandles(true);
                el.focus();
            }

            if (_animation)
            {
                $lib.on(_range, 'transitionend animationend', valueChanged, [true, el, value, _select, _event]);
                showTooltip(el, value, 'StartValue');
                setRangeStart(pos);
            }
            else
            {
                setRangeStart(pos);
                valueChanged(true, el, value, _select, _event);
            }
        }

        function setValue(value)
        {
            value = validateValue(value);

            if (_startValue != null && value < _startValue)
                value = _startValue;

            var pos = valueToPosition(value),
                el = _draggableHandle.element,
                nextEl = el.nextElementSibling,
                change = (value != _value);

            if (!change)
                return;

            _value = value;
            setPosition(el, pos);

            if (_animation)
            {
                $lib.on(_range, 'transitionend animationend', valueChanged, [false, el, value, _select, _event]);
                showTooltip(el, value, 'Value');
                setRange(pos);
            }
            else
            {
                setRange(pos);
                valueChanged(false, el, value, _select, _event);
            }
        }

        function valueChanged(start, el, value, select, event)
        {
            $lib.off(_range, 'transitionend animationend', valueChanged);
            selectTickMark(value, start);
            showTooltip(el, value, (start) ? 'StartValue' : 'Value');
            animationState(false);

            if (start)
                updateHandleSettings();
            else
                updateStartHandleSettings();

            if (start)
                _hiddenStart.__setValue(value);
            else
                _hidden.__setValue(value);

            if (_instance.range)
            {
                let startValue = _hiddenStart.value,
                    endValue = _hidden.value,
                    rangeValue = `${startValue || ''},${endValue || ''}`;

                _hiddenRange.__setValue(rangeValue);
            }

            _instance.events.onChange.fire(_instance, { isStart: start, value: value });

            if (select && select === _select && !_dragging)
            {
                _dragging = true;

                if (start)
                    _draggableStartHandle.startDrag(event);
                else
                    _draggableHandle.startDrag(event);
            }
        }

        function setPosition(handle, pos)
        {
            pos = $lib.unit(pos);

            if (_instance.vertical && handle.style.top != pos)
                handle.style.top = pos;
            else if (!_instance.vertical && handle.style.left != pos)
                handle.style.left = $lib.unit(pos);
        }

        function setRangeStart(pos)
        {
            var vertical = _instance.vertical,
                reversed = _instance.reversed,
                trackSize = (_instance.vertical) ? _track.offsetHeight : _track.offsetWidth,
                sizeProp = (vertical) ? 'height' : 'width',
                marginProp = (vertical) ? 'marginTop' : 'marginLeft',
                size = getNumericValue(_range.style[sizeProp]),
                margin;

            if (reversed)
            {
                marginProp = (vertical) ? 'marginBottom' : 'marginRight';
                pos = trackSize - pos;
            }

            margin = getNumericValue(_range.style[marginProp]);
            _range.style[marginProp] = $lib.unit(pos);

            if (pos == margin)
                return;

            if (pos > margin)
                _range.style[sizeProp] = $lib.unit(size - (pos - margin));
            else
                _range.style[sizeProp] = $lib.unit(size + (margin - pos));
        }

        function setRange(pos)
        {
            var vertical = _instance.vertical,
                reversed = _instance.reversed,
                trackSize = (_instance.vertical) ? _track.offsetHeight : _track.offsetWidth,
                marginProp = (vertical) ? 'marginTop' : 'marginLeft',
                margin;

            if (reversed)
                marginProp = (vertical) ? 'marginBottom' : 'marginRight';

            if (_instance.reversed)
                pos = trackSize - pos;

            margin = getNumericValue(_range.style[marginProp]);
            pos = pos - margin;
            pos = $lib.unit((pos < 0) ? 0 : pos);

            if (_instance.vertical)
                _range.style.height = pos;
            else
                _range.style.width = pos;
        }

        function selectTickMark(value, start)
        {
            if (!_instance.tickMarks || _instance.tickMarkSide === _tickMarkSideOption.NONE)
                return;

            var cssClass = (start) ? _classOption.SELECTED_START : _classOption.SELECTED,
                tickMarkSide = _instance.tickMarkSide,
                ticks = _instance.tickMarks,
                tickStep = getValueDelta() / ticks,
                step = value / tickStep;

            if (_selectedTicks)
            {
                var index = _selectedTicks.length, li;

                while (--index >= 0)
                {
                    li = _selectedTicks[index];

                    if ($lib.hasClass(li, cssClass))
                        $lib.removeClass(li, cssClass);

                    if (!$lib.hasClass(li, _classOption.SELECTED_START) && !$lib.hasClass(li, _classOption.SELECTED))
                        _selectedTicks.splice(index, 0); // remove from selected
                }
            }

            if (value % tickStep > 0) // value not on tickmark
                step = Math.floor(value / tickStep) // select ticks before current position

            var uls = $lib(null, _content, 'ul');

            $lib.each(uls, function (ul)
            {
                if (ul.childNodes.length > 0)
                {
                    var li = (_instance.reversed) ? ul.childNodes[(ul.childNodes.length - 1) - step] : ul.childNodes[step];
                    $lib.addClass(li, cssClass);

                    if ($lib.indexOf(_selectedTicks, li) == -1)
                        _selectedTicks.push(li);
                }
            });
        }

        function getNumericValue(text)
        {
            return parseFloat(text.replace(/[^0-9\.\-]/g, '')) || 0;
        }

        function decrease(draggable, hold)
        {
            if (!draggable)
                draggable = (_instance.range) ? _draggableStartHandle : _draggableHandle;

            change(draggable);
            _holdTimerId = setTimeout(decrease.bind(this, draggable, true), (hold) ? 40 : 500);
        }

        function increase(draggable, hold)
        {
            draggable = draggable || _draggableHandle;

            change(draggable, true);
            _holdTimerId = setTimeout(increase.bind(this, draggable, true), (hold) ? 40 : 500);
        }

        function change(draggable, increase)
        {
            var pos = getHandlePosition(draggable),
                value = positionToValue(pos),
                minChange = _instance.minChange;

            stop();

            if (increase)
                value += minChange;
            else
                value -= minChange;

            if (draggable === _draggableStartHandle)
                setStartValue(value);
            else
                setValue(value);
        }

        function stop()
        {
            clearTimeout(_holdTimerId);
        }

        function positionToValue(pos)
        {
            var reversed = _instance.reversed,
                trackSize = (_instance.vertical) ? _track.offsetHeight : _track.offsetWidth,
                value = (_instance.minValue + (getValueDelta() * (pos / trackSize))),
                minChange = _instance.minChange;

            if (reversed)
                value = (_instance.maxValue - (getValueDelta() * (pos / trackSize)));

            if (value % minChange > 0)
                value = Math.round(value / minChange) * minChange; // fix value if it is not a multiplication of the minimum change value

            return validateValue(value);
        }

        function validateValue(value)
        {
            if (value == null)
                return value;

            if (value < _instance.minValue)
                return _instance.minValue
            else if (value > _instance.maxValue)
                return _instance.maxValue
            else
                return value;
        }

        function valueToPosition(value)
        {
            var reversed = _instance.reversed,
                trackSize = (_instance.vertical) ? _track.offsetHeight : _track.offsetWidth,
                minValue = _instance.minValue;

            if (reversed)
                return trackSize - (((value - minValue) / getValueDelta()) * trackSize);
            else
                return ((value - minValue) / getValueDelta()) * trackSize;
        }

        function getValueDelta()
        {
            return _instance.maxValue - _instance.minValue;
        }

        function updateHandleSettings()
        {
            var settings = _draggableHandle.settings,
                reversed = _instance.reversed,
                trackSize = (_instance.vertical) ? _track.offsetHeight : _track.offsetWidth,
                tickValue = (_instance.minChange / getValueDelta()) * trackSize,
                overshoot = getOvershoot(_draggableHandle.element),
                prop = 'boundaryOvershoot';

            if (tickValue > 1)
                settings.tickY = settings.tickX = tickValue;

            settings[prop + 'Top'] = settings[prop + 'Bottom'] = settings[prop + 'Left'] = settings[prop + 'Right'] = overshoot;

            if (_instance.range && _startValue != null) // limit end-handle position at the start-handle position
            {
                var pos = valueToPosition(_startValue);

                if (reversed)
                    settings[prop + 'Bottom'] = settings[prop + 'Right'] = ((trackSize - pos) - overshoot) * -1;
                else
                    settings[prop + 'Top'] = settings[prop + 'Left'] = (pos - overshoot) * -1;
            }
        }

        function updateStartHandleSettings()
        {
            if (!_instance.range)
                return;

            var settings = _draggableStartHandle.settings,
                reversed = _instance.reversed,
                trackSize = (_instance.vertical) ? _track.offsetHeight : _track.offsetWidth,
                tickValue = (_instance.minChange / getValueDelta()) * trackSize,
                prop = 'boundaryOvershoot',
                overshoot = getOvershoot(_draggableStartHandle.element),
                pos = valueToPosition(_value);

            if (tickValue > 1)
                settings.tickY = settings.tickX = tickValue;

            settings[prop + 'Top'] = settings[prop + 'Bottom'] = settings[prop + 'Left'] = settings[prop + 'Right'] = overshoot;

            // limit start-handle position at the end-handle position
            if (reversed)
                settings[prop + 'Top'] = settings[prop + 'Left'] = (pos - overshoot) * -1;
            else
                settings[prop + 'Bottom'] = settings[prop + 'Right'] = ((trackSize - pos) - overshoot) * -1;
        }

        function getOvershoot(handle)
        {
            return (_instance.vertical) ? Math.round(handle.offsetHeight / 2) : Math.round(handle.offsetWidth / 2);
        }

        function dispose()
        {
            $lib.each(_handlerId, function (item)
            {
                $lib.off(item[0], item[1], item[2]);
            });

            $lib.off(document, 'mouseup', cancelSelectState);
            $lib.off(document, 'mouseup', stop);

            _startValue = _value = _select = null;
            _dragging;
            _handlerId = [];
            _selectedTicks = [];
            _draggableHandle = _draggableStartHandle = null;
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.Slider.prototype = Object.create($base.methods);
    componyx.UI.Slider.prototype.constructor = componyx.UI.Slider;


    /**
    * TickMarkSideOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Slider.TickMarkSideOption =
    {
        NONE: 0,
        BEFORE: 1,
        AFTER: 2,
        BOTH: 3
    }
})(window);