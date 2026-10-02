/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * Box class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @property {componyx.UI.base.AjaxMethod} ajax.load - AJAX method used to load box content data on demand.
    * @returns {Object} An instance of the component.
    */
    componyx.UI.Box = function Box(id, properties)
    {
        var _instance = this,
            _contentElement,
            _draggable,
            _focusable = [],
            _timerId = null,
            _showTimerId, _hideTimerId,
            _styleCache = {},
            _animation = null,
            _invertedX = false,
            _invertedY = false,
            _resizedX = false,
            _resizedY = false,
            _resizeObserver = null,
            _invertMarginX = 0,
            _invertMarginY = 0,
            _rendered = false,
            _allowHide = true,
            _expander = null, _modal,
            _pointerCoordinates,
            _modalStyle = 'position:fixed; left:0px; top:0px; width:100%; height:100%;',
            _themeOption = $base.static.ThemeOption,
            _autoPositionOption = componyx.UI.Box.AutoPositionOption,
            _expandDirectionOption = componyx.UI.Box.ExpandDirectionOption,
            _alignXOption = componyx.UI.Box.AlignXOption,
            _alignYOption = componyx.UI.Box.AlignYOption,
            _animationTypeOption = componyx.UI.Box.AnimationTypeOption,
            _classOption =
            {
                CONTENT: 'content',
                MODAL: 'modal',
                EXPANDED: 'expanded',
                HORIZONTALINVERTED: 'inverted',
                VERTICALINVERTED: 'inverted',
                SHOW: 'show',
                SHOWANIMATION: 'show-animation',
                HIDEANIMATION: 'hide-animation'
            };

        // define public properties
        /**
         * Gets or sets the css class of the box content.
         * @type {String}
         */
        this.cssClassContent = '';

        /**
         * Gets or sets the css class of the box modal overlay.
         * @type {String}
         */
        this.cssClassModal = '';

        /**
         * Gets or sets the css class of the box when AutoInvertFit is true and the box is inverted horizontally.
         * @type {String}
         */
        this.cssClassHorizontalInverted = '';

        /**
         * Gets or sets the css class of the box when AutoInvertFit is true and the box is inverted vertically.
         * @type {String}
         */
        this.cssClassVerticalInverted = '';

        /**
         * Gets or sets the top position of the box. Overwrites the property if already defined through Style.
         * @type {String}
         */
        this.top = '';

        /**
         * Gets or sets the right position of the box. Overwrites the property if already defined through Style.
         * @type {String}
         */
        this.right = '';

        /**
         * Gets or sets the bottom position of the box. Overwrites the property if already defined through Style.
         * @type {String}
         */
        this.bottom = '';

        /**
         * Gets or sets the left position of the box. Overwrites the property if already defined through Style.
         * @type {String}
         */
        this.left = '';

        /**
         * Gets or sets the width of the box. Overwrites the property if already defined through Style.
         * @type {String}
         */
        this.width = '';

        /**
         * Gets or sets the height of the box. Overwrites the property if already defined through Style.
         * @type {String}
         */
        this.height = '';

        /**
         * Gets or sets a value indicating if the box element must stretch to the size of the expander element. The content width has priority over the expander width when stretchToContent is enabled and the content exceeds the expander width.
         * @type {Boolean}
         */
        this.stretchToExpander = false;

        /**
         * Gets or sets a value indicating if the box element must stretch to the size of the content element. This setting is useful when the box is positioned absolute/fixed and the content element is a flex-box (display:flex).
         * @type {Boolean}
         */
        this.stretchToContent = false;

        /**
         * Gets or sets a value indicating whether the box should handle focus events for focusable child elements. Only applies when modal is false.
         * @type {Boolean}
         */
        this.handleFocus = false;

        /**
         * Gets or sets a value indicating whether the first element of the focusable list should get focus when the box is shown.
         * @type {Boolean}
         */
        this.autoFocus = true;

        /**
         * Gets or sets a value indicating whether the focusable list is ordered by tabindex (requires all elements to have a tabindex set).
         * @type {Boolean}
         */
        this.tabIndexFocus = false;

        /**
         * Gets or sets the auto position of the box.
         * @type {componyx.UI.Box.AutoPositionOption}
         */
        this.autoPosition = _autoPositionOption.NONE;

        /**
         * Gets or sets a value indicating whether the box should try to fit when the window is too small.
         * @type {Boolean}
         */
        this.autoFit = true;

        /**
         * Gets or sets a value indicating whether the box should try to fit inverted when the window is too small.
         * @type {Boolean}
         */
        this.autoInvertFit = false;

        /**
         * Gets or sets a value indicating whether the box should be resized when the window is too small.
         * @type {Boolean}
         */
        this.autoResizeFit = false;

        /**
         * Gets or sets a value indicating whether the animation direction should be auto inverted when the box is inverted.
         * @type {Boolean}
         */
        this.autoInvertAnimation = true;

        /**
         * Gets or sets a value indicating whether the box is either resized to the window width or available (inverted) space when auto resized.
         * @type {Boolean}
         */
        this.resizeToMaxWidth = true;

        /**
         * Gets or sets a value indicating whether the box is either resized to the window height or available (inverted) space when auto resized.
         * @type {Boolean}
         */
        this.resizeToMaxHeight = true;

        /**
         * Gets or sets a value indicating whether the box is displayed as modal popup.
         * @type {Boolean}
         */
        this.modal = false;

        /**
         * Gets or sets a value indicating whether the box is draggable.
         * @type {Boolean}
         */
        this.draggable = false;

        /**
         * Gets or sets a value indicating whether the box is hidden when the user clicks outside the box.
         * @type {Boolean}
         */
        this.hideOnOutsideClick = false;

        /**
         * Gets or sets a value indicating whether the box position tracks the pointer when AutoPosition is set to Pointer.
         * @type {Boolean}
         */
        this.trackPointer = false;

        /**
         * Gets or sets a value indicating whether the box's horizontal position is aligned to the left, center or right of the expander element or pointer.
         * @type {componyx.UI.Box.AlignXOption|null}
         */
        this.alignX = null;

        /**
         * Gets or sets a value indicating whether the box's vertical position is aligned to the top, center or bottom of the expander element or pointer.
         * @type {componyx.UI.Box.AlignYOption|null}
         */
        this.alignY = null;

        /**
         * Gets the tag name of the content element.
         * @type {String}
         */
        this.contentTag = 'div';

        /**
         * Gets or sets the expand direction.
         * @type {componyx.UI.Box.ExpandDirectionOption}
         */
        this.expandDirection = _expandDirectionOption.RIGHT;

        /**
         * Gets or sets the expander element or element-id.
         * @type {HTMLElement|String|null}
         */
        this.expander = null;

        /**
         * Gets or sets the submitter element or element-id on which to fire a click event when the enter-key is pressed within a field inside the box element.
         * @type {HTMLElement|String|null}
         */
        this.enterKeySubmitter = null;

        /**
         * Gets the element which contains the box content.
         * @type {HTMLElement}
         */
        Object.defineProperty(this, 'contentElement',
            {
                get: function () { return _contentElement; }
            });


        /**
        * Box animation.
        * @type animation
        * @property {componyx.UI.Box.AnimationTypeOption} showType         - Gets or sets the animation type used when showing the box.
        * @property {String} showClass											- Gets or sets the CSS class applied when showing the box.
        * @property {String} showDirection                                      - Gets or sets the animation direction (down, right, up, left) used when showing the box.
        * @property {Boolean} showFade                                          - Gets or sets a value indicating if fading is used when showing the box.
        * @property {componyx.UI.Box.AnimationTypeOption} hideType         - Gets or sets the animation type used when hiding the box.
        * @property {String} hideClass											- Gets or sets the CSS class applied when hiding the box.
        * @property {String} hideDirection                                      - Gets or sets the animation direction (top, right, bottom, left) used when hiding the box.
        * @property {Boolean} hideFade                                          - Gets or sets a value indicating if fading is used when hiding the box.
        */
        this.animation =
        {
            showType: null,
            showClass: null,
            showDirection: null,
            showFade: null,
            hideType: null,
            hideClass: null,
            hideDirection: null,
            hideFade: null
        }

        /**
        * @type {componyx.library.DraggableSettings}
        * @see {@link componyx.library.DraggableSettings}
        */
        this.dragSettings = {};

        /**
        * @class
         * @augments componyx.UI.base.Events
         * @memberof componyx.UI.Box
         * @property {componyx.UI.base.Event} onPrePosition      - Event which fires before the box is positioned.
         * @property {componyx.UI.base.Event} onPostPosition     - Event which fires after the box is positioned.
         * @property {componyx.UI.base.Event} onAutoFit          - Event which fires when the window is too small and the box performs an auto fit. @see {@link componyx.UI.Box.AutoFitEventArgs}
         * @property {componyx.UI.base.Event} onShowComplete     - Event which fires when the show animation has completed, or immediately if animation type is 'none'.
         * @property {componyx.UI.base.Event} onHideComplete     - Event which fires when the hide animation has completed, or immediately if animation type is 'none'.
         * @property {componyx.UI.base.Event} onHide             - Event which fires when the box is hidden (overrides the base event arguments). Set cancel to true to keep the box visible. @see {@link componyx.UI.Box.HideEventArgs}
         * @see {@link componyx.UI.base.Events}
         */
        function BoxEvents(events)
        {
            Object.assign(this, events);
            this.onPrePosition = $base.static.createEvent('onPrePosition');
            this.onPostPosition = $base.static.createEvent('onPostPosition');
            this.onAutoFit = $base.static.createEvent('onAutoFit');
            this.onShowComplete = $base.static.createEvent('onShowComplete');
            this.onHideComplete = $base.static.createEvent('onHideComplete');
        };

        /**
         * Box events
         * @type {componyx.UI.Box.BoxEvents}
         */
        this.events = new BoxEvents(this.events);

        /**
         * Box hide event arguments.
         * @typedef {Object} HideEventArgs
         * @memberof componyx.UI.Box
         * @property {Event} event - The original event object.
         * @property {Boolean} cancel - Set to true to cancel hiding the box.
         */

        /**
         * Box auto fit event arguments.
         * @typedef {Object} AutoFitEventArgs
         * @memberof componyx.UI.Box
         * @property {Boolean} fitX - A value indicating if the box was fitted horizontally.
         * @property {Boolean} fitY - A value indicating if the box was fitted vertically.
         * @property {Boolean} invertedX - A value indicating if the box position was inverted horizontally.
         * @property {Boolean} invertedY - A value indicating if the box position was inverted vertically.
         * @property {Boolean} resizedX - A value indicating if the box was resized horizontally.
         * @property {Boolean} resizedY - A value indicating if the box was resized vertically.
         */

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        /** 
        * Adds the content template.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The content template.
        */
        this.setContentTemplate = function (content)
        {
            _instance.addTemplate('Content', content, false);
        }

        /** 
        * Updates the box view to stretch and position with the updated content.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} [content] A new content template.
        * @param {Boolean} [show=true] A value indicating if the box should be displayed when hidden.
        */
        this.update = function (content, show)
        {
            stopAnimation();

            if (content)
            {
                _instance.addTemplate('Content', content, false);
                _instance.applyTemplate(_instance.contentElement, 'Content');
            }

            if (_instance.modal || _instance.handleFocus)
                createFocusableList();

            if (_instance.autoPosition == _autoPositionOption.EXPAND)
                getExpander();

            if (_instance.showing || !show)
            {
                if (_instance.showing && _instance.autoPosition == _autoPositionOption.EXPAND && _instance.expander != _expander)
                {
                    setExpanded(_expander, true);
                    setExpanded(_instance.expander);
                    _expander = _instance.expander;
                }

                activate();
            }
            else
                this.show();
        }

        /** 
        * Stops the animation.
        */
        this.stopAnimation = function ()
        {
            stopAnimation();
        }

        /** 
        * Shows or hides the component.
        */
        this.toggle = function ()
        {
            checkExpander();
            $base.methods.toggle.call(_instance);
        }

        /** 
        * Shows the component.
        * @param {boolean} [instant] A value indicating if the box should be shown instantly without animation.
        * @param {{clientX: number, clientY: number}} [pointerCoordinates] Optional pointer coordinates for POINTER auto-positioning. Pass these when the show is deferred (e.g. via setTimeout), as the original pointer event may no longer be available by then.
        */
        this.show = function (instant, pointerCoordinates)
        {
            show(instant, pointerCoordinates);
        }

        /** 
        * Hides the component.
        * @param {Boolean} [instant] A value indicating if the box should be hidden instantly without animation.
        */
        this.hide = function (instant)
        {
            hide(instant);
        }

        /** 
        * Renders the component.
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'box', false);
                return;
            }

            // render logic after loading resources
            if (_instance.ajax.load && _instance.ajax.load.isDefined())
                load();
            else
                draw();
        }

        /** 
         * Destroys the component.
         * @see {@link componyx.UI.base.methods#destroy}
         */
        this.destroy = function (...args)
        {
            stopAnimation();
            dispose();
            $base.methods.destroy.call(this, ...args);
        }

        function show(instant, pointerCoordinates)
        {
            var a = _instance.animation, el = _instance.element,
                type = (a.showType != null) ? a.showType : _animationTypeOption.SLIDE;

            checkExpander();

            if (_instance.showing && _rendered)
            {
                _allowHide = true;
                clearTimers();

                if (instant)
                    stopAnimation();

                return;
            }

            _rendered = true;
            _allowHide = false;
            _expander = _instance.expander;

            if (_instance.renderState != $base.static.RenderState.RENDERED)
            {
                _rendered = false;

                if (_instance.renderState == $base.static.RenderState.NONE)
                    $base.methods.show.call(_instance);

                return;
            }

            clearTimers();
            stopAnimation();
            addDirectionClass();
            removeOutsideClickHandler();

            if (_instance.autoPosition == _autoPositionOption.POINTER)
            {
                _pointerCoordinates = pointerCoordinates ?? { clientX: ($lib.event) ? $lib.clientX($lib.event) : 0, clientY: ($lib.event) ? $lib.clientY($lib.event) : 0 }
            }

            if (instant || !type)
                execShow(instant);
            else if (!_showTimerId)
                _showTimerId = setTimeout(execShow.bind(_instance, instant), 0); // animate when device is ready
        }

        function execShow(instant)
        {
            var a = _instance.animation, el = _instance.element,
                type = (a.showType != null) ? a.showType : _animationTypeOption.SLIDE,
                direction = getShowDirection(),
                fade = (a.showFade != null) ? a.showFade : false;

            $base.methods.show.call(_instance);
            el.style.display = '';
            activate();
            setExpanded(_instance.expander);
            bindOutsideClickHandler();

            _instance.showing = true;

            if (_instance.trackPointer)
            {
                $lib.on(document, 'pointermove', trackPointer, null, _instance);
                $lib.on(document, 'pointerup', stopPointerTracking, _instance.hideOnOutsideClick);
            }

            _modal.style.display = 'none';

            if (_instance.autoInvertAnimation && _invertedX)
                direction = (direction.indexOf('right') > -1) ? direction.replace('right', 'left') : direction.replace('left', 'right');

            if (_instance.autoInvertAnimation && _invertedY)
                direction = (direction.indexOf('down') > -1) ? direction.replace('down', 'up') : direction.replace('up', 'down');

            if (!instant && type > 0)
            {
                if (type == _animationTypeOption.SLIDE)
                    _animation = $lib.slide(el, false, 'slide', direction, fade, showComplete);
                else if (type == _animationTypeOption.REVEAL)
                    _animation = $lib.slide(el, false, 'reveal', direction, fade, showComplete);
                else if (type == _animationTypeOption.CSS)
                {
                    _animation = $lib.cssAnimation(el, a.showClass || _classOption.SHOWANIMATION, [], { onComplete: showComplete });
                }
                else
                    showComplete();
            }
            else
                showComplete();

            _allowHide = true;
        }

        function hide(instant)
        {
            if (!_instance.showing)
            {
                clearTimers();

                if (instant)
                    stopAnimation();

                return;
            }

            if (_instance.renderState != $base.static.RenderState.RENDERED)
                return;

            var a = _instance.animation,
                type = (a.hideType != null) ? a.hideType : _animationTypeOption.SLIDE;

            clearTimers();
            stopAnimation();
            _allowHide = false;

            if (instant || !type) // synchronous
                execHide(instant);
            else if (!_hideTimerId)
                _hideTimerId = setTimeout(execHide.bind(_instance, instant), 0); // animate when device is ready
        }

        function execHide(instant)
        {
            var a = _instance.animation, el = _instance.element,
                type = (a.hideType != null) ? a.hideType : _animationTypeOption.SLIDE,
                direction = getHideDirection(),
                fade = (a.hideFade != null) ? a.hideFade : false,
                args = { event: $lib.event, cancel: false };

            _instance.showing = false;
            _instance.events.onHide.fire(_instance, args);

            if (args.cancel)
            {
                _instance.showing = _allowHide = true;
                return;
            }

            removeOutsideClickHandler();
            stopPointerTracking();
            el.style.display = '';
            _modal.style.display = 'none';

            if (!instant && type > 0)
            {
                if (_instance.autoInvertAnimation && _invertedX)
                    direction = (direction.indexOf('right') > -1) ? direction.replace('right', 'left') : direction.replace('left', 'right');

                if (_instance.autoInvertAnimation && _invertedY)
                    direction = (direction.indexOf('down') > -1) ? direction.replace('down', 'up') : direction.replace('up', 'down');

                if (type == _animationTypeOption.SLIDE)
                    _animation = $lib.slide(el, true, 'slide', direction, fade, hideComplete);
                else if (type == _animationTypeOption.REVEAL)
                    _animation = $lib.slide(el, true, 'reveal', direction, fade, hideComplete);
                else if (type == _animationTypeOption.CSS)
                {
                    _animation = $lib.cssAnimation(el, a.hideClass || _classOption.HIDEANIMATION, [], { onComplete: hideComplete });
                }
                else
                    hideComplete();
            }
            else
                hideComplete();

            _allowHide = true;
        }

        function showComplete()
        {
            if (arguments[0] && arguments[0] instanceof Event && arguments[0].target !== _instance.element)
                return;

            var el = _instance.element;

            _showTimerId = null;

            $lib.addClass(el, _classOption.SHOW);
            el.style.display = '';

            if (_instance.modal)
                _modal.style.display = '';

            if (_instance.modal || _instance.handleFocus)
            {
                createFocusableList();
                blurAll();
                $lib.on(el, 'keydown', setFocus);

                if (_instance.autoFocus && _focusable.length > 0)
                    setTimeout(function () { setFocus(); }, 1);
            }

            if (_animation)
            {
                _animation = null;
                position();
            }

            _instance.events.onShowComplete.fire(_instance);
        }

        function hideComplete()
        {
            if (arguments[0] && arguments[0] instanceof Event && arguments[0].target !== _instance.element)
                return;

            var el = _instance.element;

            _hideTimerId = null;

            if (_instance.modal || _instance.handleFocus)
                $lib.off(el, 'keydown', setFocus);

            $lib.removeClass(el, _classOption.SHOW);
            setExpanded(_instance.expander, true);
            _instance.showing = false;
            _animation = null;
            _pointerCoordinates = null;
            $base.methods.hide.call(_instance, false);
            _instance.events.onHideComplete.fire(_instance);
        }

        function clearTimers()
        {
            clearTimeout(_showTimerId);
            clearTimeout(_hideTimerId);
            _showTimerId = _hideTimerId = null;
        }

        function trackPointer(e)
        {
            const pointerType = e.pointerType;

            if (pointerType === "mouse" || pointerType === "pen")
            {
                position();
            }
        }

        function stopPointerTracking(hide)
        {
            $lib.off(document, 'pointermove', trackPointer);
            $lib.off(document, 'pointerup', stopPointerTracking);

            if (hide)
            {
                _allowHide = true;
                checkHide();
            }
        }

        function checkExpander()
        {
            getExpander();

            if (_instance.expander != _expander && _instance.autoPosition == _autoPositionOption.EXPAND)
            {
                _instance.hide(true); // instant hide when previous expander element is different
                setExpanded(_expander, true);
            }
        }

        function getExpander()
        {
            if (!$lib.isEmpty(_instance.expander) && (typeof _instance.expander === 'string') && $lib('#' + _instance.expander))
                _instance.expander = $lib('#' + _instance.expander);
        }

        function addDirectionClass()
        {
            var direction = _instance.animation.showDirection || 'right',
                vertical = (_instance.expandDirection == _expandDirectionOption.DOWN || _instance.expandDirection == _expandDirectionOption.UP);

            clearDirectionClasses();

            if (_instance.expandDirection != null)
                $lib.addClass(_instance.element, _expandDirectionOption.getName(_instance.expandDirection));
            else
                $lib.addClass(_instance.element, direction);

            if (vertical && _instance.alignX > 0)
                $lib.addClass(_instance.element, $lib.format('align-{0}', _alignXOption.getName(_instance.alignX)));
            else if (!vertical && _instance.alignY > 0)
                $lib.addClass(_instance.element, $lib.format('align-{0}', _alignYOption.getName(_instance.alignY)));
        }

        function clearDirectionClasses()
        {
            $lib.removeClass(_instance.element, 'down right up left align-left align-center align-right align-top align-bottom');
        }

        function setExpanded(expander, remove)
        {
            if ($lib.isEmpty(expander) || _instance.autoPosition != _autoPositionOption.EXPAND)
                return;

            if (remove)
                $lib.removeClass(expander, _classOption.EXPANDED);
            else
                $lib.addClass(expander, _classOption.EXPANDED);
        }

        function checkHide()
        {
            if (_allowHide)
                _instance.hide();

            _allowHide = true;
        }

        function blurAll()
        {
            $lib(function (el)
            {
                if (el.blur)
                    el.blur();

            }, document.body);
        }

        function createFocusableList()
        {
            _focusable = [];

            $lib(function (el)
            {
                if ($lib.focusable(el))
                    _focusable.push(el);

            }, _instance.element);

            if (_instance.tabIndexFocus)
            {
                _focusable = _focusable.sort(function (a, b)
                {
                    return (a.tabIndex - b.tabIndex);
                });
            }
        }

        function setFocus(e)
        {
            let keyCode = (e) ? e.key : null,
                shift = (e) ? e.shiftKey : false,
                startIndex, element, index, focusable,
                doc = _instance.element.ownerDocument || document;

            if (!_focusable.length)
                return;

            if (!e || keyCode == 'Tab')
            {
                if (e)
                {
                    element = $lib.eventSource(e);
                    startIndex = index = $lib.indexOf(_focusable, element);

                    if (index == -1)
                        return;

                    if (index == _focusable.length - 1)
                        index = (shift) ? index - 1 : 0;
                    else if (shift)
                        index--;
                    else
                        index++;

                    if (index < 0)
                        index = 0;

                    e.returnValue = false;
                }
                else
                {
                    startIndex = _focusable.length;
                    index = 0;
                }

                // loop until next visible focusable element is found or when we are back on the current element
                while (!focusable && (startIndex != index))
                {
                    _focusable[index].focus();
                    focusable = (_focusable[index] === doc.activeElement);

                    if (!focusable)
                    {
                        if (shift)
                            index--;
                        else
                            index++;

                        if (index < 0)
                            index = _focusable.length - 1;

                        if (index != startIndex && index == _focusable.length)
                            index = 0;
                    }
                }

                return false;
            }
        }

        function getShowDirection()
        {
            var a = _instance.animation;

            if (a.showDirection)
                return a.showDirection;

            if (_instance.expandDirection != null)
                return _expandDirectionOption.getName(_instance.expandDirection);
            else
                return 'right';
        }

        function getHideDirection()
        {
            var a = _instance.animation;
            return (a.hideDirection != null) ? a.hideDirection : getShowDirection();
        }

        function stopAnimation()
        {
            if (_animation)
                _animation.complete();

            _animation = null;
        }

        function preRender()
        {
            // initialize script and css
            return ['Box'];
        }

        function load(parentItem, initialLoad)
        {
            _instance.ajaxCall('load', null, { onSuccess: dataLoaded });
        }

        function dataLoaded(ajaxArgs)
        {
            draw(ajaxArgs.data);
        }

        function draw(data)
        {
            var divBox = _instance.element,
                content = document.createElement(_instance.contentTag || 'div');

            _modal = document.createElement('div');
            _modal.className = _instance.cssClassModal || _classOption.MODAL;
            $lib.updateStyle(_modal.style, _modalStyle);
            divBox.appendChild(_modal);

            content.className = _instance.cssClassContent || _classOption.CONTENT;
            divBox.appendChild(content);

            if (data)
            {
                content.innerHTML = data;
            }
            else
            {
                _instance.applyTemplate(content, 'Content');
            }

            _contentElement = content;
            _resizeObserver = new ResizeObserver(positionDelayed);
            _resizeObserver.observe(_contentElement);

            bindGlobalEvents();

            if (_instance.draggable)
            {
                _draggable = $lib.draggable(_instance.element, $base.static.initDragSettings(_instance.dragSettings));
            }

            _instance.postRender();
        }

        function activate()
        {
            _styleCache = {};
            $lib.setStyle(_instance.element, '');

            getExpander();
            stretch();
            setStyle();
            position();
        }

        function stretch()
        {
            if (!_instance.showing || _animation || (!_instance.stretchToExpander && !_instance.stretchToContent))
                return;

            var divBox = _instance.element, contentSize, expanderSize;

            if (_instance.stretchToContent)
            {
                contentSize = $lib.size(_instance.contentElement);
                divBox.style.minWidth = $lib.unit(contentSize.width);
                divBox.style.minHeight = $lib.unit(contentSize.height);
            }

            if (_instance.stretchToExpander && _instance.expander)
            {
                expanderSize = $lib.size(_instance.expander);

                if (!contentSize)
                    contentSize = $lib.size(_instance.contentElement);

                if (expanderSize.width > contentSize.width)
                    divBox.style.minWidth = $lib.unit(expanderSize.width);
            }
        }

        function setStyle()
        {
            var divBox = _instance.element,
                content = _instance.contentElement,
                style = [];

            $lib.updateStyle(divBox.style, _instance.style);
            content.style.width = content.style.height = '';

            if (_instance.top)
                style.push('top: ' + $lib.unit(_instance.top));
            if (_instance.right)
                style.push('right: ' + $lib.unit(_instance.right));
            if (_instance.bottom)
                style.push('bottom: ' + $lib.unit(_instance.bottom));
            if (_instance.left)
                style.push('left: ' + $lib.unit(_instance.left));
            if (_instance.width)
                style.push('width: ' + $lib.unit(_instance.width));
            if (_instance.height)
                style.push('height: ' + $lib.unit(_instance.height));

            // add styles
            if (style.length > 0)
                $lib.updateStyle(divBox.style, style.join(';'));
        }

        function position()
        {
            clearTimeout(_timerId);
            _timerId = null;

            if (!_instance.showing || _animation || (_instance.autoPosition == _autoPositionOption.NONE && !_instance.autoFit))
                return;

            var divBox = _instance.element;

            _invertMarginX = _invertMarginY = 0;
            _instance.events.onPrePosition.fire(_instance, null);

            if (_instance.autoInvertFit)
            {
                $lib.removeClass(divBox, _instance.cssClassHorizontalInverted || _classOption.HORIZONTALINVERTED);
                $lib.removeClass(divBox, _instance.cssClassVerticalInverted || _classOption.VERTICALINVERTED);
            }

            if (_instance.autoPosition != _autoPositionOption.NONE)
            {
                var stylePos = _styleCache.position || $lib.styleValue(divBox, 'position');

                if (stylePos != 'absolute' && stylePos != 'fixed')
                {
                    divBox.style.position = 'fixed';
                    stylePos = 'fixed';
                    _styleCache.position = stylePos;
                }

                divBox.style.position = stylePos;

                if (_instance.autoPosition == _autoPositionOption.EXPAND)
                    positionExpand(stylePos);
                else if (_instance.autoPosition == _autoPositionOption.POINTER && _pointerCoordinates)
                    positionAtPointer(stylePos, _pointerCoordinates.clientX, _pointerCoordinates.clientY);
                else
                    positionAuto(stylePos);
            }

            _instance.events.onPostPosition.fire(_instance, null);

            if (_instance.autoFit)
                fit();
        }

        function clearPosition()
        {
            $lib.updateStyle(_instance.element.style, 'left: $; right: $; top: $; bottom: $; width: $; height: $;'.replace(/\$/g, 'auto'));
        }

        function positionExpand(stylePos)
        {
            clearPosition();

            var coords = {},
                vertical = (_instance.expandDirection == _expandDirectionOption.DOWN || _instance.expandDirection == _expandDirectionOption.UP),
                divBox = _instance.element,
                expander = _instance.expander,
                position = $lib.getPos(expander, null, stylePos == 'fixed'),
                boxWidth = _styleCache.width = _styleCache.width || divBox.offsetWidth,
                boxHeight = _styleCache.height = _styleCache.height || divBox.offsetHeight,
                expanderWidth = (vertical && _instance.alignX > 0) ? expander.offsetWidth : 0,
                expanderHeight = (!vertical && _instance.alignY > 0) ? expander.offsetHeight : 0;

            _invertMarginX = position.width;
            _invertMarginY = position.height;

            switch (_instance.expandDirection)
            {
                case (_expandDirectionOption.DOWN):
                    coords.left = position.left;
                    coords.top = position.bottom;
                    break;

                case (_expandDirectionOption.UP):
                    coords.left = position.left;
                    coords.top = position.top - boxHeight;
                    break;

                case (_expandDirectionOption.RIGHT):
                    coords.left = position.right;
                    coords.top = position.top;
                    break;

                case (_expandDirectionOption.LEFT):
                    coords.left = position.left - boxWidth;
                    coords.top = position.top;
                    break;
            }

            if (vertical && _instance.alignX > 0)
            {
                if (_instance.alignX == _alignXOption.CENTER)
                    coords.left += (expanderWidth / 2) - (boxWidth / 2);
                else
                    coords.left = position.right - boxWidth;
            }
            else if (!vertical && _instance.alignY > 0)
            {
                if (_instance.alignY == _alignYOption.CENTER)
                    coords.top += (expanderHeight / 2) - (boxHeight / 2);
                else
                    coords.top = position.bottom - boxHeight;
            }

            $lib.setPos(divBox, coords, true);
        }

        function positionAtPointer(stylePos, clientX, clientY)
        {
            var coords = {},
                direction = _instance.animation.showDirection || 'right',
                divBox = _instance.element,
                boxWidth = _styleCache.width = _styleCache.width || divBox.offsetWidth,
                boxHeight = _styleCache.height = _styleCache.height || divBox.offsetHeight,
                scroll = $lib.getScrollPosition(),
                y = (stylePos != 'fixed') ? clientY + scroll.scrollTop : clientY,
                x = (stylePos != 'fixed') ? clientX + scroll.scrollLeft : clientX;

            clearPosition();

            if (_instance.expandDirection != null)
                direction = _expandDirectionOption.getName(_instance.expandDirection); // expand direction has precedence over animation direction

            if (direction.indexOf('left') > -1)
                coords.left = x - boxWidth;
            else
                coords.left = x;

            if (direction.indexOf('up') > -1)
                coords.top = y - boxHeight;
            else
                coords.top = y;

            // unlike the auto position setting 'expand', the auto postion setting 'pointer' allows both horizontal and vertical alignment.

            if (_instance.alignX == _alignXOption.CENTER)
                coords.left = x - (boxWidth / 2);
            else if (_instance.alignX > 0)
                coords.left = x - boxWidth;

            if (_instance.alignY == _alignYOption.CENTER)
                coords.top = y - (boxHeight / 2);
            else if (_instance.alignY > 0)
                coords.top = y - boxHeight;

            $lib.setPos(divBox, coords, true);
        }

        function positionAuto(stylePos)
        {
            var divBox = _instance.element, position;

            clearPosition();
            position = $lib.getPos(divBox, $lib.positionedParent(divBox), stylePos == 'fixed');

            if (_instance.autoPosition <= _autoPositionOption.TOPRIGHT)
            {
                divBox.style.top = '0%';
            }
            else if (_instance.autoPosition <= _autoPositionOption.RIGHT)
            {
                divBox.style.top = '50%';
                divBox.style.marginTop = $lib.unit((position.height / 2) * -1);
            }
            else
            {
                divBox.style.bottom = '0%';
            }

            if (_instance.autoPosition == _autoPositionOption.TOPLEFT || _instance.autoPosition == _autoPositionOption.LEFT || _instance.autoPosition == _autoPositionOption.BOTTOMLEFT)
            {
                divBox.style.left = '0%';
            }
            else if (_instance.autoPosition == _autoPositionOption.TOPCENTER || _instance.autoPosition == _autoPositionOption.CENTER || _instance.autoPosition == _autoPositionOption.BOTTOMCENTER)
            {
                divBox.style.left = '50%';
                divBox.style.marginLeft = $lib.unit((position.width / 2) * -1);
            }
            else
            {
                divBox.style.right = '0%';
            }
        }

        function fit()
        {
            var divBox = _instance.element,
                winSize = $lib.getWindowSize(),
                rect = $lib.getPos(divBox, null, true),
                autoPos = (_instance.autoPosition == _autoPositionOption.NONE || _instance.autoPosition == _autoPositionOption.EXPAND || _instance.autoPosition == _autoPositionOption.POINTER),
                fitX = (autoPos && (rect.left < 0 || rect.right > winSize.width)) ? true : false,
                fitY = (autoPos && (rect.top < 0 || rect.bottom > winSize.height)) ? true : false,
                vertical = (_instance.expandDirection == _expandDirectionOption.DOWN || _instance.expandDirection == _expandDirectionOption.UP);

            _invertedX = _invertedY = _resizedX = _resizedY = false;
            divBox.style.removeProperty('--expander-offset');

            if (fitX)
            {
                fitHorizontal(rect, winSize);

                if (vertical)
                {
                    $lib.removeClass(_instance.element, 'align-left align-center align-right');

                    if (divBox.style.left && divBox.style.left != 'auto')
                        $lib.addClass(_instance.element, 'align-left');
                    else
                        $lib.addClass(_instance.element, 'align-right');
                }

                if (!fitY)
                    divBox.style.top = $lib.unit(rect.top - parseFloat($.styleValue(divBox, 'margin-top', true))); // must be changed to match fixed position
            }

            if (fitY)
            {
                fitVertical(rect, winSize);

                if (!vertical)
                {
                    $lib.removeClass(_instance.element, 'align-top align-center align-bottom');

                    if (divBox.style.top && divBox.style.top != 'auto')
                        $lib.addClass(_instance.element, 'align-top');
                    else
                        $lib.addClass(_instance.element, 'align-bottom');
                }

                if (!fitX)
                    divBox.style.left = $lib.unit(rect.left - parseFloat($.styleValue(divBox, 'margin-left', true))); // must be changed to match fixed position
            }

            if (fitX || fitY)
            {
                divBox.style.position = 'fixed';
                setExpanderOffset(divBox, vertical);
                _instance.events.onAutoFit.fire(_instance, { fitX: fitX, fitY: fitY, invertedX: _invertedX, invertedY: _invertedY, resizedX: _resizedX, resizedY: _resizedY });
            }
        }

        function fitVertical(rect, winSize)
        {
            var divBox = _instance.element,
                invertRect = getInvertRect(divBox, true),
                space = 0, invertPos = 0, invertSpace = 0, marginTop = 0, devSize = 0, height = 0,
                fits = (rect.height <= winSize.height),
                resize = function ()
                {
                    if (fits || !_instance.autoResizeFit) return;

                    const cs = window.getComputedStyle(divBox),
                        boxSizing = (cs.boxSizing || cs.getPropertyValue('box-sizing') || 'content-box').toLowerCase();

                    let baseSpace;
                    if (_instance.resizeToMaxHeight)
                    {
                        baseSpace = winSize.height;
                        divBox.style.top = $lib.unit(0);
                    }
                    else
                    {
                        baseSpace = (_invertedY) ? invertSpace : space;
                    }

                    let finalHeight = baseSpace;

                    if (boxSizing === 'content-box') // subtract border+padding because style.height sets the content box
                    {
                        const devSize = $lib.borderAndPadding(divBox);
                        finalHeight = baseSpace - devSize.height;
                    }

                    divBox.style.height = (finalHeight > 0) ? $lib.unit(finalHeight) : '0px';
                    _styleCache.height = null;
                    _resizedY = true;
                };

            // clear position and margin
            $lib.updateStyle(divBox.style, 'top:auto;bottom:auto;margin-top:0px !important;margin-bottom:0px !important;');

            if (_instance.autoPosition != _autoPositionOption.EXPAND || !_instance.autoInvertFit
                || (_instance.expandDirection != _expandDirectionOption.DOWN && _instance.expandDirection != _expandDirectionOption.UP))
            {
                if (rect.top < 0)
                    divBox.style.top = $lib.unit(0);
                else
                    divBox.style.bottom = $lib.unit(0);

                return resize();
            }
            else if (_instance.expandDirection == _expandDirectionOption.DOWN)
            {
                if (rect.top < 0)
                {
                    divBox.style.top = $lib.unit(0);
                    return resize();
                }
                else if ((rect.top - _invertMarginY) > winSize.height)
                {
                    divBox.style.bottom = $lib.unit(0);
                    return resize();
                }

                space = winSize.height - rect.top;
                invertPos = invertRect.top - (invertRect.height + _invertMarginY);
                invertSpace = (invertPos < 0) ? invertRect.bottom - invertRect.height - _invertMarginY : invertRect.height;
            }
            else
            {
                if (rect.bottom > winSize.height)
                {
                    divBox.style.bottom = $lib.unit(0);
                    return resize();
                }
                else if ((rect.bottom + _invertMarginY) < 0)
                {
                    divBox.style.top = $lib.unit(0);
                    return resize();
                }

                space = (winSize.height < rect.bottom) ? winSize.height : rect.bottom;
                invertPos = invertRect.bottom + _invertMarginY;
                invertSpace = (invertPos < 0) ? 0 : winSize.height - invertPos;
            }

            if (rect.height <= invertSpace)
            {
                // box fits inverted
                $lib.addClass(divBox, _instance.cssClassVerticalInverted || _classOption.VERTICALINVERTED);
                divBox.style.top = $lib.unit(invertPos);
                _invertedY = true;
                return;
            }
            else
            {
                // when invert space is larger, utilize that space
                if (space >= invertSpace)
                {
                    if (fits && rect.top >= 0)
                        divBox.style.bottom = $lib.unit(0);
                    else
                        divBox.style.top = (rect.top >= 0) ? $lib.unit(rect.top) : $lib.unit(0);
                }
                else
                    divBox.style.top = (invertPos >= 0) ? $lib.unit(invertPos) : $lib.unit(0);

                if (invertSpace > space)
                {
                    $lib.addClass(divBox, _instance.cssClassVerticalInverted || _classOption.VERTICALINVERTED);
                    _invertedY = true;
                }

                if (!_instance.resizeToMaxHeight)
                    fits = (space >= invertSpace) ? (rect.height <= space) : (rect.height <= invertSpace);

                return resize();
            }
        }

        function fitHorizontal(rect, winSize)
        {
            var divBox = _instance.element,
                invertRect = getInvertRect(divBox),
                space = 0, invertPos = 0, invertSpace = 0, marginLeft = 0, devSize = 0, width = 0,
                fits = (rect.width <= winSize.width),
                resize = function ()
                {
                    if (fits || !_instance.autoResizeFit) return;

                    const cs = window.getComputedStyle(divBox),
                        boxSizing = (cs.boxSizing || cs.getPropertyValue('box-sizing') || 'content-box').toLowerCase();

                    let baseSpace;
                    if (_instance.resizeToMaxWidth)
                    {
                        baseSpace = winSize.width;
                        divBox.style.left = $lib.unit(0);
                    }
                    else
                    {
                        baseSpace = (_invertedX) ? invertSpace : space;
                    }

                    let finalWidth = baseSpace;

                    if (boxSizing === 'content-box') // subtract border+padding because style.width sets the content box
                    {
                        const devSize = $lib.borderAndPadding(divBox);
                        finalWidth = baseSpace - devSize.width;
                    }

                    divBox.style.width = (finalWidth > 0) ? $lib.unit(finalWidth) : '0px';
                    _styleCache.width = null;
                    _resizedX = true;
                };

            // clear position and margin
            $lib.updateStyle(divBox.style, 'left:auto;right:auto;margin-left:0px !important;margin-right:0px !important;');

            if ((_instance.autoPosition != _autoPositionOption.EXPAND || !_instance.autoInvertFit)
                || (_instance.expandDirection != _expandDirectionOption.RIGHT && _instance.expandDirection != _expandDirectionOption.LEFT))
            {
                if (rect.left < 0)
                    divBox.style.left = $lib.unit(0);
                else
                    divBox.style.right = $lib.unit(0);

                return resize();
            }
            else if (_instance.expandDirection == _expandDirectionOption.RIGHT)
            {
                if (rect.left < 0)
                {
                    divBox.style.left = $lib.unit(0);
                    return resize();
                }
                else if ((rect.left - _invertMarginX) > winSize.width)
                {
                    divBox.style.right = $lib.unit(0);
                    return resize();
                }

                space = winSize.width - rect.left;
                invertPos = invertRect.left - (invertRect.width + _invertMarginX);
                invertSpace = (invertPos < 0) ? invertRect.right - invertRect.width - _invertMarginX : invertRect.width;
            }
            else
            {
                if (rect.right > winSize.width)
                {
                    divBox.style.right = $lib.unit(0);
                    return resize();
                }
                else if ((rect.right + _invertMarginX) < 0)
                {
                    divBox.style.left = $lib.unit(0);
                    return resize();
                }

                space = (winSize.width < rect.right) ? winSize.width : rect.right;
                invertPos = invertRect.right + _invertMarginX;
                invertSpace = (invertPos < 0) ? 0 : winSize.width - invertPos;
            }

            if (rect.width <= invertSpace)
            {
                // box fits inverted
                $lib.addClass(divBox, _instance.cssClassHorizontalInverted || _classOption.HORIZONTALINVERTED);
                divBox.style.left = $lib.unit(invertPos);
                _invertedX = true;
                return;
            }
            else
            {
                // when invert space is larger, utilize that space
                if (space >= invertSpace)
                {
                    if (fits && rect.left >= 0)
                        divBox.style.right = $lib.unit(0);
                    else
                        divBox.style.left = (rect.left >= 0) ? $lib.unit(rect.left) : $lib.unit(0);
                }
                else
                    divBox.style.left = (invertPos >= 0) ? $lib.unit(invertPos) : $lib.unit(0);

                if (invertSpace > space)
                {
                    $lib.addClass(divBox, _instance.cssClassHorizontalInverted || _classOption.HORIZONTALINVERTED);
                    _invertedX = true;
                }

                if (!_instance.resizeToMaxWidth)
                    fits = (space >= invertSpace) ? (rect.width <= space) : (rect.width <= invertSpace);

                return resize();
            }
        }

        function setExpanderOffset(divBox, vertical)
        {
            if (!_instance.expander) return;

            const boxRect = divBox.getBoundingClientRect(),
                expRect = _instance.expander.getBoundingClientRect(),
                expCenterX = expRect.left + expRect.width / 2,
                expCenterY = expRect.top + expRect.height / 2;

            if (vertical)
            {
                if (divBox.classList.contains('align-left'))
                {
                    const offsetX = Math.floor(expCenterX - boxRect.left);
                    divBox.style.setProperty('--expander-offset', offsetX + 'px');
                } else if (divBox.classList.contains('align-right'))
                {
                    const offsetX = Math.floor(boxRect.right - expCenterX);
                    divBox.style.setProperty('--expander-offset', offsetX + 'px');
                }
            }
            else
            {
                if (divBox.classList.contains('align-top'))
                {
                    const offsetY = Math.floor(expCenterY - boxRect.top);
                    divBox.style.setProperty('--expander-offset', offsetY + 'px');
                } else if (divBox.classList.contains('align-bottom'))
                {
                    const offsetY = Math.floor(boxRect.bottom - expCenterY);
                    divBox.style.setProperty('--expander-offset', offsetY + 'px');
                }
            }
        }

        function getInvertRect(divBox, vertical)
        {
            var cssClass = (vertical) ? _instance.cssClassVerticalInverted || _classOption.VERTICALINVERTED : _instance.cssClassHorizontalInverted || _classOption.HORIZONTALINVERTED;
            var rect;

            if (!$lib.hasClass(divBox, cssClass))
            {
                $lib.addClass(divBox, cssClass);
                rect = $lib.getPos(divBox, null, true);
                $lib.removeClass(divBox, cssClass);
            }
            else
                rect = $lib.getPos(divBox, null, true);

            return rect;
        }

        function bindGlobalEvents()
        {
            $lib.on(window, 'resize', positionDelayed, null, _instance);
            $lib.on(window, 'scroll', positionDelayed, null, _instance);
            $lib.on(_instance.element, 'pointerdown pointerup', function () { _allowHide = false; }, null, _instance);
            $lib.on(_instance.element, 'pointercancel', function () { _allowHide = true; }, null, _instance); // touch scroll/long-press ends without pointerup
            $lib.on(_instance.element, 'keydown', function (e)
            {
                const doc = _instance.element.ownerDocument || document,
                    activeElement = doc.activeElement;

                if (e.defaultPrevented) // canceled by other handler, do not process enter key submission
                    return;

                if (_instance.enterKeySubmitter && e.key?.toLowerCase() == 'enter' && !e.shiftKey && activeElement && _instance.element.contains(activeElement))
                {
                    let element = _instance.enterKeySubmitter;

                    element = (typeof element === 'string') ? $lib('#' + element) : element;
                    $lib.fireEvent(element, 'click', true, true);
                }
            });
        }

        function bindOutsideClickHandler()
        {
            if (_instance.hideOnOutsideClick && !$lib.has(document, 'pointerup', checkHide))
                $lib.on(document, 'pointerup', checkHide);
        }

        function removeOutsideClickHandler()
        {
            $lib.off(document, 'pointerup', checkHide);
        }

        function positionDelayed()
        {
            clearTimeout(_timerId);
            _timerId = setTimeout(position, 0);
        }

        function dispose()
        {
            $lib.off(window, 'resize', positionDelayed);
            $lib.off(window, 'scroll', positionDelayed);
            $lib.off(document, 'pointermove', trackPointer);
            $lib.off(document, 'pointerup', stopPointerTracking);

            if (_resizeObserver)
            {
                _resizeObserver.disconnect();
                _resizeObserver = null;
            }

            clearTimers();
            removeOutsideClickHandler();

            if (_draggable)
                _draggable.disable();

            _draggable = null;
            _pointerCoordinates = null;
            _styleCache = {};
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.Box.prototype = Object.create($base.methods);
    componyx.UI.Box.prototype.constructor = componyx.UI.Box;

    /**
    * AutoPositionOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Box.AutoPositionOption =
    {
        NONE: 0,
        TOPLEFT: 1,
        TOPCENTER: 2,
        TOPRIGHT: 3,
        LEFT: 4,
        CENTER: 5,
        RIGHT: 6,
        BOTTOMLEFT: 7,
        BOTTOMCENTER: 8,
        BOTTOMRIGHT: 9,
        POINTER: 10,
        EXPAND: 11
    }

    /**
    * ExpandDirectionOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Box.ExpandDirectionOption =
    {
        DOWN: 0,
        RIGHT: 1,
        UP: 2,
        LEFT: 3,

        getName: function (value) { return $base.static.getKeyByValue(this, value).toLowerCase(); }
    }

    /**
    * AlignXOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Box.AlignXOption =
    {
        LEFT: 0,
        CENTER: 1,
        RIGHT: 2,

        getName: function (value) { return $base.static.getKeyByValue(this, value).toLowerCase(); }
    }

    /**
    * AlignYOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Box.AlignYOption =
    {
        TOP: 0,
        CENTER: 1,
        BOTTOM: 2,

        getName: function (value) { return $base.static.getKeyByValue(this, value).toLowerCase(); }
    }

    /**
    * AnimationTypeOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Box.AnimationTypeOption =
    {
        NONE: 0,
        SLIDE: 1,
        REVEAL: 2,
        CSS: 3
    }
})(window);