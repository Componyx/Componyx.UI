/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * TooltipManager class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {Object} An instance of the component.
    */
    componyx.UI.TooltipManager = function TooltipManager(id, properties)
    {
        var _instance = this,
            _themeOption = $base.static.ThemeOption,
            _allowHide = true, _hideBlock, _boxDown, _hasFocus = new Map(), _box, _boxes = {}, _tooltipRefreshed = {}, _blurTimerId,
            _pointerEventOption = componyx.UI.TooltipManager.PointerEventOption,
            _triggers = new Map();

        // define public properties
        /**
         * Gets or sets the css class of the tooltip box.
         * @type {String}
         */
        this.cssClassBox = '';

        /**
         * Gets or sets the time in ms that tooltips remains visible (0 to keep visible).
         * @type {Number|null}
         */
        this.visibleDuration = null;

        /**
         * Gets or sets a value which defines on which pointer event the tooltip is shown.
         * @type {componyx.UI.TooltipManager.PointerEventOption}
         */
        this.showOnPointerEvent = _pointerEventOption.ENTER;

        /**
         * Gets or sets a value indicating if the tooltip is shown on a focus event.
         * @type {Boolean}
         */
        this.showOnFocus = true;

        /**
         * Gets or sets a value indicating if the tooltip is shown on a blur event.
         * @type {Boolean}
         */
        this.showOnBlur = false;

        /**
         * Gets or sets a value indicating if tooltip content is selectable, which means that the tooltip will remain visible on a pointer enter/click event.
         * @type {Boolean}
         */
        this.selectableTooltipContent = false;

        /**
         * Gets or sets the time in ms before the tooltip is displayed.
         * @type {Number}
         */
        this.showDelay = 200;

        /**
         * Gets or sets the time in ms before the tooltip is hidden.
         * @type {Number}
         */
        this.hideDelay = 200;

        /**
         * Gets or sets a value indicating if the direction arrow styles should be applied.
         * @type {Boolean}
         */
        this.arrowless = false;

        /**
         * Gets or sets a value indicating if a single box instance is used to display tooltips (defaults to true). When set to false multiple tooltips can be visible at the same time. Only set to false when required because a single instance has less overhead.
         * @type {Boolean}
         */
        this.singleBoxInstance = true;

        /**
         * Gets or sets the list of tooltip triggers.
         * @type {componyx.UI.TooltipManager.Trigger[]|object|Map}
         */
        Object.defineProperty(this, 'triggers', {
            get: function ()
            {
                return _triggers;
            },
            set: function (value)
            {
                if (value instanceof Map)
                {
                    _triggers = value;
                    return;
                }

                var map = new Map();

                if (Array.isArray(value))
                {
                    value.forEach(function (trigger)
                    {
                        map.set(trigger.triggerId, trigger);
                    });
                }
                else
                {
                    $lib.each(value, function (trigger, triggerId)
                    {
                        map.set(triggerId, trigger);
                    });
                }

                _triggers = map;
            },
            enumerable: true,
            configurable: true
        });

        /**
         * Gets or sets the clientid of the tooltip box.
         * @type {String|null}
         */
        this.boxId = null;


        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        /** 
        * Gets the instance of the Box component used to display the tooltips.
        * @param {String} [tooltipId] Id of the tooltip template.
        * @returns {componyx.UI.Box} The Box component used to display the tooltips.
        */
        this.getBox = function (tooltipId)
        {
            return getBox(tooltipId);
        }

        /** 
        * Gets the active trigger id.
        * @param {String} [tooltipId] Id of the tooltip template.
        * @returns {String|HTMLElement} The active trigger id.
        */
        this.activeTriggerId = function (tooltipId)
        {
            return getBox(tooltipId).__currentTriggerId;
        }

        /** 
        * Adds a tooltip template.
        * @param {String} id Id of the tooltip template.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content Template content.
        * @param {Boolean} cloneable Defines if the template can be cloned for multiple views.
        */
        this.addTooltip = function (id, content, clonable)
        {
            _instance.addTemplate(id, content, clonable);
            _tooltipRefreshed[id] = true;

            if (!_instance.singleBoxInstance && !_boxes[id])
                createBox(id);
        }

        /** 
        * Removes a tooltip template.
        * @param {String} id Id of the tooltip template.
        * @param {Boolean} keepTriggers=false A value indicating if the tooltip triggers should be kept.
        */
        this.removeTooltip = function (id, keepTriggers = false)
        {
            var found = false, index,
                clearTriggers = [], box = getBox(id);

            _instance.addTemplate(id, null);
            _tooltipRefreshed[id] = true;

            if (!keepTriggers)
            {
                _instance.triggers.forEach(function (trigger, triggerId)
                {
                    if (trigger.tooltipId === id)
                        clearTriggers.push(triggerId);
                });

                for (index = 0; index < clearTriggers.length; ++index)
                {
                    _instance.removeTrigger(clearTriggers[index]);
                }
            }

            if (!$lib.isEmpty(box.__currentTriggerId))
            {
                clearTimeout(box.__timerId);
                box.hide(true);
                box.__currentTriggerId = null;
            }

            if (!_instance.singleBoxInstance)
            {
                box.destroy();
                delete _boxes[id]
            }
            else if (box.__tooltipId === id)
                box.contentElement.innerHTML = ''; // clear content when active tooltip is removed
        }

        /** 
        * Adds a tooltip trigger.
        * @param {String|HTMLElement} triggerId The trigger element or element id that triggers the tooltip display.
        * @param {String} tooltipId The id of the tooltip template.
        * @param {componyx.UI.TooltipManager.PointerEventOption} showOnPointerEvent Gets or sets a value which defines on which pointer event the tooltip is shown.
        * @param {Boolean} showOnFocus Sets a value indicating if the tooltip is shown on a focus event.
        * @param {Boolean} showOnBlur Sets a value indicating if the tooltip is shown on a blur event.
        */
        this.addTrigger = function (triggerId, tooltipId, showOnPointerEvent, showOnFocus, showOnBlur)
        {
            _instance.triggers.set(triggerId, { tooltipId: tooltipId, showOnFocus: showOnFocus, showOnBlur: showOnBlur, showOnPointerEvent: showOnPointerEvent });

            if (_instance.renderState == $base.static.RenderState.RENDERED)
                bindTriggerEvents(triggerId);
        }

        /** 
        * Removes a tooltip trigger.
        * @param {String|HTMLElement} triggerId The trigger element or element id that triggers the tooltip display.
        */
        this.removeTrigger = function (triggerId)
        {
            if (_instance.renderState == $base.static.RenderState.RENDERED)
                removeEvent(triggerId);

            _instance.triggers.delete(triggerId);
        }

        /** 
        * Shows the tooltip with the specified triggerId.
        * @param {String|HTMLElement} triggerId The trigger element or element id that triggers the tooltip display.
        * @param {Boolean} [fromPointerDown=false] Set to true when called from a pointerdown handler, so the tooltip is not hidden by the pointerdown on the document that follows.
        */
        this.showTooltip = function (triggerId, fromPointerDown = false)
        {
            if (fromPointerDown)
                _allowHide = false; // same as triggerClick: the document pointerdown handler skips this one hide

            showTooltip(triggerId);
        }

        /** 
        * Hides the tooltip with the specified triggerId.
        * @param {String} [triggerId] The trigger element or element id that triggered the tooltip. When a value is provided the tooltip is hidden only if current trigger id matches the specified value.
        * @param {Boolean} [instant] A value indicating if the tooltip should be hidden instantly without animation.
        */
        this.hideTooltip = function (triggerId, instant)
        {
            hideTooltip(triggerId, instant);
        }

        /** 
        * Hides all tooltips.
        * @param {Boolean} [instant] A value indicating if the tooltip should be hidden instantly without animation.
        */
        this.hideAllTooltips = function (instant)
        {
            hideAllTooltips(instant);
        }

        /** 
        * Sets a value indicating if tooltip hiding is allowed.
        * @param {Boolean} [value] A value indicating if tooltip hiding is allowed.
        */
        this.allowHide = function (value)
        {
            _hideBlock = !value;
        }

        /** 
        * Renders the component.
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'tooltip-manager');
                return;
            }

            // render logic after loading resources 
            if (_instance.singleBoxInstance)
                createBox();
            else
            {
                var ready = true;

                $lib.each(_instance.templates, function (template, id)
                {
                    if (!_boxes[id])
                    {
                        ready = false;
                        createBox(id);
                    }
                });

                if (ready)
                    postRender();
            }
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
            return ['TooltipManager', ['Box']];
        }

        function postRender()
        {
            if (_instance.renderState == $base.static.RenderState.RENDERED)
                return;

            bindEvents();
            $base.methods.postRender.call(_instance);
        }

        function createBox(tooltipId)
        {
            var id = _instance.id + '_Box',
                arrowless = (_instance.arrowless) ? ' arrowless' : '';

            if (tooltipId)
                id += tooltipId;

            _box = $UI.createComponent(componyx.UI.Box, { id: id, containerElement: _instance.element });
            _box.clone($UI.store[_instance.boxId], _instance);
            _box.cssClass = (_box.cssClass || _instance.cssClassBox || 'box tooltip') + arrowless;
            _box.theme = $base.static.ThemeOption.NONE;
            _box.autoPosition = (_box.autoPosition != null && _box.autoPosition != componyx.UI.Box.AutoPositionOption.NONE) ? _box.autoPosition : componyx.UI.Box.AutoPositionOption.POINTER;
            _box.style = (!_instance.selectableTooltipContent) ? "pointer-events: none" : "";
            _box.__timerId = null;
            _box.__currentTriggerId = null;
            _box.events.onPostRender.priorityAdd(postRender, null);

            _box.events.onHideComplete.priorityAdd(hideTooltipComplete, tooltipId);
            _box.render();

            if (tooltipId)
                _boxes[tooltipId] = _box;
        }

        function bindEvents()
        {
            _instance.triggers.forEach(function (trigger, triggerId)
            {
                bindTriggerEvents(triggerId);
            });

            if (_instance.singleBoxInstance)
                bindBoxEvents();

            $lib.on(document, 'pointerdown', hideAllTooltips, false);
        }

        function bindTriggerEvents(triggerId)
        {
            var eventType = null,
                trigger = _instance.triggers.get(triggerId),
                showOnFocus = _instance.showOnFocus,
                showOnBlur = _instance.showOnBlur,
                element = ($lib.isElement(triggerId)) ? triggerId : $lib('#' + triggerId.toString()),
                tooltipId = trigger.tooltipId,
                fn = showTooltipDelayed;

            removeEvent(triggerId);

            if (_instance.showOnPointerEvent != _pointerEventOption.NONE)
                eventType = getPointerEventType(_instance.showOnPointerEvent);

            if (!$lib.isEmpty(trigger.showOnPointerEvent) && trigger.showOnPointerEvent != _instance.showOnPointerEvent)
            {
                if (trigger.showOnPointerEvent == _pointerEventOption.NONE)
                    eventType = null;
                else
                    eventType = getPointerEventType(trigger.showOnPointerEvent);
            }

            if (!$lib.isEmpty(trigger.showOnFocus) && trigger.showOnFocus != showOnFocus)
                showOnFocus = trigger.showOnFocus;

            if (!$lib.isEmpty(trigger.showOnBlur) && trigger.showOnBlur != showOnBlur)
                showOnBlur = trigger.showOnBlur;

            if ((eventType && $lib.has(element, eventType, showTooltipDelayed)) || (!eventType && $lib.has(element, 'focus', triggerFocus)))
                return;

            if (eventType == 'pointerdown')
                fn = triggerClick;

            if (eventType)
                $lib.on(element, eventType, fn, triggerId);

            if (eventType == 'pointerenter')
                $lib.on(element, 'pointerleave', hideTooltipDelayed, triggerId);

            if (showOnFocus)
            {
                $lib.on(element, 'focus', triggerFocus, triggerId);
                $lib.on(element, 'blur', triggerBlurDelayed, [triggerId, false]);
            }

            if (showOnBlur)
                $lib.on(element, 'blur', triggerBlur, [triggerId, true]);

            if (!_instance.singleBoxInstance)
                bindBoxEvents(tooltipId);
        }

        function bindBoxEvents(tooltipId)
        {
            var box = getBox(tooltipId);

            if (!box || !_instance.selectableTooltipContent)
                return;

            if (!box.trackPointer && !$lib.has(box.element, 'pointerenter', boxEnter))
            {
                $lib.on(box.element, 'pointerenter', boxEnter, [tooltipId]);

                $lib.on(box.element, 'pointerleave', function (tooltipId)
                {
                    if ($lib.isEmpty(getBox(tooltipId).__currentTriggerId))
                        return;

                    var event = getPointerEvent(getBox(tooltipId).__currentTriggerId);

                    if (event == _pointerEventOption.ENTER)
                    {
                        var now = new Date().getTime();
                        box.__extraHideDelay = null;

                        if (_instance.visibleDuration > 0 && (now - box.__visibleStart) < _instance.visibleDuration)
                            box.__extraHideDelay = _instance.visibleDuration - (now - box.__visibleStart);

                        hideTooltipDelayed(getBox(tooltipId).__currentTriggerId);
                    }


                }, [tooltipId]);

                $lib.on(box.element, 'pointerdown', function ()
                {
                    _boxDown = true;
                    _allowHide = false;
                });
            }
        }

        function boxEnter(tooltipId)
        {
            clearTimeout(getBox(tooltipId).__timerId);
        }

        function getPointerEvent(triggerId)
        {
            var trigger = _instance.triggers.get(triggerId);
            return (!$lib.isEmpty(trigger.showOnPointerEvent)) ? trigger.showOnPointerEvent : _instance.showOnPointerEvent;
        }

        function getPointerEventType(pointerEvent)
        {
            return (pointerEvent == _pointerEventOption.DOWN) ? 'pointerdown' : (pointerEvent == _pointerEventOption.ENTER) ? 'pointerenter' : 'contextmenu';
        }

        function removeEvent(triggerId)
        {
            var element = ($lib.isElement(triggerId)) ? triggerId : $lib('#' + triggerId.toString());

            if (!element)
                return;

            $lib.off(element, 'pointerdown', triggerClick);
            $lib.off(element, 'pointerenter contextmenu', showTooltipDelayed);
            $lib.off(element, 'pointerleave', hideTooltipDelayed);
            $lib.off(element, 'focus', triggerFocus);
            $lib.off(element, 'blur', triggerBlur);
            $lib.off(element, 'blur', triggerBlurDelayed);
        }

        function triggerFocus(triggerId, e)
        {
            clearTimeout(_blurTimerId);
            _hasFocus.set(triggerId, true);
            showTooltipDelayed(triggerId, e);
        }

        function triggerBlurDelayed(triggerId, showOnBlur)
        {
            _blurTimerId = setTimeout(triggerBlur.bind(_instance, triggerId, showOnBlur), 0);
        }

        function triggerBlur(triggerId, showOnBlur, e)
        {
            if (_boxDown) // selectableTooltipContent is true and blur is caused by pointer down on box
                _allowHide = false;
            else
                _allowHide = true;

            _boxDown = false;
            _hasFocus.set(triggerId, false);

            if (showOnBlur)
                showTooltipDelayed(triggerId);
            else
                hideTooltipDelayed(triggerId);

            _allowHide = true;
        }

        function triggerClick(triggerId)
        {
            _allowHide = false;
            showTooltipDelayed(triggerId);
        }

        function setVisibleTime(triggerId)
        {
            if (_instance.visibleDuration > 0)
            {
                var box = getBox(getTooltipId(triggerId));
                box.__extraHideDelay = null;
                box.__visibleStart = new Date().getTime();
                box.__timerId = setTimeout(function () { hideTooltip(triggerId); }, _instance.visibleDuration);
            }
        }

        function showTooltipDelayed(triggerId)
        {
            var tooltipId = getTooltipId(triggerId),
                box = getBox(tooltipId);

            if ($lib.event.type == 'contextmenu')
                $lib.event.preventDefault(); // cancel default browser menu

            clearTimeout(box.__timerId);

            if (!_instance.showDelay || (triggerId == box.__currentTriggerId && box.showing))
            {
                box.__currentTriggerId = triggerId;
                showTooltip(triggerId);
            }
            else
            {
                box.hide(true);
                box.__currentTriggerId = triggerId;
                box.__timerId = setTimeout(function () { showTooltip(triggerId); }, _instance.showDelay);
            }
        }

        function showTooltip(triggerId)
        {
            var tooltipId = _instance.triggers.get(triggerId)?.tooltipId,
                box = (tooltipId) ? getBox(tooltipId) : null,
                boxAutoPos = box.autoPosition, trigger;

            if (!box || !_instance.hasTemplate(tooltipId))
                return;

            clearTimeout(box.__timerId);

            if (box.showing)
            {
                trigger = (typeof triggerId === 'string') ? $lib('#' + triggerId) : triggerId;

                if (box.expander && box.expander != trigger)
                    box.expander = triggerId;

                box.__currentTriggerId = triggerId;
                updateBox(tooltipId, triggerId);
                return;
            }

            box.hide(true);
            box.__currentTriggerId = triggerId;

            if (boxAutoPos == componyx.UI.Box.AutoPositionOption.POINTER && $lib.event && $lib.event.type === 'focus')
                box.autoPosition = componyx.UI.Box.AutoPositionOption.EXPAND; // focus event does not work on mouse cursor since clientX and clientY are undefined

            if (box.autoPosition == componyx.UI.Box.AutoPositionOption.EXPAND)
                box.expander = triggerId;

            updateBox(tooltipId, triggerId);
            box.autoPosition = boxAutoPos; // restore original setting
        }

        function hideAllTooltips(instant)
        {
            if (!_allowHide || _hideBlock)
            {
                _allowHide = true;
                return;
            }

            if (_instance.singleBoxInstance)
            {
                let box = getBox();

                if (!box)
                    return;

                if (instant || (!_instance.hideDelay && !box.__extraHideDelay))
                {
                    clearTimeout(box.__timerId);
                    box.hide(instant);
                }
                else
                {
                    box.__timerId = setTimeout(function ()
                    {
                        clearTimeout(box.__timerId);
                        box.hide();
                    }, (_instance.hideDelay || 0) + box.__extraHideDelay || 0);

                    box.__extraHideDelay = null;
                }
            }
            else
            {
                _instance.triggers.forEach(function (trigger, triggerId)
                {
                    if (instant)
                        hideTooltip(triggerId, true);
                    else
                        hideTooltipDelayed(triggerId);
                });
            }

            _allowHide = true;
        }

        function hideTooltipDelayed(triggerId)
        {
            if ($lib.isEmpty(triggerId))
                return;

            var tooltipId = getTooltipId(triggerId),
                box = (tooltipId) ? getBox(tooltipId) : null;

            if ($lib.isEmpty(tooltipId) || box.__currentTriggerId != triggerId || _hasFocus.get(triggerId))
                return;

            if (!_allowHide || _hideBlock)
                return;

            clearTimeout(box.__timerId);

            if (!_instance.hideDelay && !box.__extraHideDelay)
                hideTooltip(triggerId);
            else
                box.__timerId = setTimeout(function () { hideTooltip(triggerId); }, (_instance.hideDelay || 0) + box.__extraHideDelay || 0);

            box.__extraHideDelay = null;
        }

        function hideTooltip(triggerId, instant)
        {
            if (_hideBlock)
                return;

            var tooltipId = getTooltipId(triggerId),
                box = getBox(tooltipId);

            if ($lib.isEmpty(tooltipId) || box.__currentTriggerId != triggerId)
                return;

            clearTimeout(box.__timerId);
            box.hide(instant);
        }

        function hideTooltipComplete(tooltipId)
        {
            getBox(tooltipId).__currentTriggerId = null;
        }

        function updateBox(tooltipId, triggerId)
        {
            var box = getBox(tooltipId), content;

            if (!_tooltipRefreshed[tooltipId] && (content = extractBoxContent(tooltipId)) && content.childNodes.length > 0)
                _instance.addTemplate(box.__tooltipId, content, _instance.templates.get(box.__tooltipId).cloneable); // reset template content and use current active tooltipId to set correct template when singleBoxInstance is enabled

            box.contentElement.innerHTML = '';
            _instance.applyTemplate(box.contentElement, tooltipId);
            _tooltipRefreshed[tooltipId] = false;
            box.__tooltipId = tooltipId;
            box.update(null, true);
            setVisibleTime(triggerId);
        }

        function getTooltipId(triggerId)
        {
            var trigger = _instance.triggers.get(triggerId);

            if (trigger)
                return trigger.tooltipId;
        }

        function getBox(tooltipId)
        {
            if (_instance.singleBoxInstance)
                return _box;
            else
                return _boxes[tooltipId];
        }

        function extractBoxContent(tooltipId)
        {
            return $lib.extract(getBox(tooltipId).contentElement);
        }

        function dispose()
        {
            $lib.off(document, 'pointerdown', hideAllTooltips);

            _instance.triggers.forEach(function (trigger, triggerId)
            {
                removeEvent(triggerId);
            });

            _boxDown = false;
            _allowHide = true;
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.TooltipManager.prototype = Object.create($base.methods);
    componyx.UI.TooltipManager.prototype.constructor = componyx.UI.TooltipManager;

    /**
    * PointerEventOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.TooltipManager.PointerEventOption =
    {
        NONE: 0,
        ENTER: 1,
        DOWN: 2,
        CONTEXT: 3
    }


    /**
    * Creates an instance of the Trigger.
    * @class
    * @property {String} triggerId Gets or sets the id of the trigger element.
    * @property {String} tooltipId Gets or sets the id of the tooltip template.
    * @property {PointerEventOption} showOnPointerEvent Gets or sets a value which defines on which pointer event the tooltip is shown.
    * @property {boolean} showOnFocus Gets or sets a value indicating if the tooltip is shown on a focus event.
    * @property {boolean} showOnBlur Gets or sets a value indicating if the tooltip is shown on a blur event.
    */
    componyx.UI.TooltipManager.Trigger = function ()
    {
        this.triggerId = null;
        this.tooltipId = null;
        this.showOnPointerEvent = null;
        this.showOnFocus = null;
        this.showOnBlur = null;
    }
})(window);