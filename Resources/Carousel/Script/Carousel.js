/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * Carousel class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {Object} An instance of the component.
    */
    componyx.UI.Carousel = function Carousel(id, properties)
    {
        // define private properties
        var _instance = this,
            _slider, _viewport, _navigation, _indicators, _drag, _select, _start = {}, _last = {}, _animation,
            _selectedIndex, _prevIndex, _rotateTimerId, _itemCount, _defaultInterval = 5000, _allowDrag = true,
            _themeOption = $base.static.ThemeOption,
            _classOption =
            {
                HORIZONTAL: 'horizontal',
                DRAG: 'drag',
                VIEWPORT: 'viewport',
                SLIDER: 'slider',
                NAVIGATION: 'navigation',
                PREVIOUS: 'previous',
                NEXT: 'next',
                ITEM: 'item',
                MOVEBACK: 'move-back',
                MOVEFORWARD: 'move-forward',
                MOVETO: 'move-to',
                SELECTED: 'selected',
                OUT_OF_VIEW: 'out-of-view'
            };

        // define public properties
        /**
         * Gets or sets a value indicating if the carousel is rendered horizontal.
         * @type {Boolean}
         */
        this.horizontal = false;

        /**
         * Gets or sets a value indicating if the carousel takes the full screen size.
         * @type {Boolean}
         */
        this.fullscreen = false;

        /**
         * Gets or sets a value indicating if items can be selected by dragging.
         * @type {Boolean}
         */
        this.dragNavigation = true;

        /**
         * Gets or sets a value indicating if items can be selected with the mouse wheel.
         * @type {Boolean}
         */
        this.wheelNavigation = true;

        /**
         * Gets or sets a value indicating if items can be selected with the keyboard. 
         * With the option horizontal enabled only the left/right arrow keys can be used. 
         * When rendered vertically the up/down arrows, page up/down, home (first item) and end (last item) keys can be used.
         * @type {Boolean}
         */
        this.keyboardNavigation = true;

        /**
         * Gets or sets a value indicating if there is a transition animation on initial item select.
         * @type {Boolean}
         */
        this.initialTransition = true;

        /**
         * Gets or sets the percentage of the item to be visible before the item is selected.
         * @type {Number}
         */
        this.dragRevealPercentage = 50;

        /**
         * Gets or sets the drag speed (moved pixels relative to the elapsed time) required to select the designated item when the reveal percentage has not been matched.
         * @type {Number}
         */
        this.dragSelectSpeed = 20;

        /**
         * Gets or sets the interval in milliseconds for automatic carousel rotation.
         * @type {Number}
         */
        this.rotateInterval = 0;

        /**
         * Gets or sets the initial selected item index.
         * @type {Number}
         */
        this.selectedIndex = 0;


        /**
        * Carousel slide animation.
        * @type animation
        * @property {String} cssClass=slide-animation												- Gets or sets the css class that is applied to the element to provide the slide animation/transition.
        */
        this.animation =
        {
            cssClass: 'slide-animation'
        }

        /**
        * @class
        * @augments componyx.UI.base.Events
        * @memberof componyx.UI.Carousel
        * @property {componyx.UI.base.Event} onItemSelect             - Event which fires on an item select. @see {@link componyx.UI.Carousel.CarouselEventArgs}
        * @property {componyx.UI.base.Event} onTransitionComplete     - Event which fires when the item-select transition animation has completed. @see {@link componyx.UI.Carousel.CarouselEventArgs}
        * @see {@link componyx.UI.base.Events}
        */
        function CarouselEvents(events)
        {
            Object.assign(this, events);

            this.onItemSelect = $base.static.createEvent('onItemSelect');
            this.onTransitionComplete = $base.static.createEvent('onTransitionComplete');
        };

        /**
         * Carousel events
         * @type {componyx.UI.Carousel.CarouselEvents}
         */
        this.events = new CarouselEvents(this.events);

        /**
         * Carousel event arguments.
         * @typedef {Object} CarouselEventArgs
         * @memberof componyx.UI.Carousel
         * @property {Number} index - The index of the selected item.
         * @property {Number} [previousIndex] - The index of the previously selected item (onItemSelect only; undefined on the first select).
         */

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        this.stop = function ()
        {
            clearTimeout(_rotateTimerId);
        }

        /** 
        * Starts rotating the slide items automatically.
        * @param {Number} [interval]=5000 The interval in milliseconds before moving to the next item.
        */
        this.start = function (interval)
        {
            _instance.stop();
            _instance.rotateInterval = interval || _defaultInterval;
            _rotateTimerId = setTimeout(nextItem, _instance.rotateInterval);
        }

        /** 
        * Gets the index of the selected item.
        * @returns {Number} The index of the selected item.
        */
        this.getSelectedIndex = function ()
        {
            return _selectedIndex;
        }

        /** 
        * Selects the item with the specified index.
        * @param {Number} index The index of the item.
        * @param {Boolean} [instant] A value indicating if the item must be selected instantly (without transition animation).
        */
        this.selectItem = function (index, instant)
        {
            selectItem(index, instant);
        }

        /** 
        * Renders the component
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'carousel', false);
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

            if (!$base.methods.postRender.call(_instance)) // component got destroyed on postrender event
                return;

            selectItem(0, true);

            if (_instance.selectedIndex > 0)
                selectItem(_instance.selectedIndex, _instance.initialTransition);
            else
            {
                if (_instance.rotateInterval)
                    _instance.start(_instance.rotateInterval);
            }
        }

        /** 
        * Destroys the component.
        * @param {Boolean} keepEvents A value indicating if component events should be kept.
        */
        this.destroy = function (keepEvents)
        {
            dispose();
            $base.methods.destroy.call(this, keepEvents);
        }

        function preRender()
        {
            // initialize script and css
            return ['Carousel'];
        }

        function draw()
        {
            var index = -1,
                horizontal = _instance.horizontal;

            if (!_instance.fullscreen)
                _instance.element.setAttribute('tabindex', 0);

            if (horizontal)
                $lib.addClass(_instance.element, _classOption.HORIZONTAL);

            _viewport = $lib.element(_instance.element, null, '', null, { "class": _classOption.VIEWPORT });
            _slider = $lib.element(_viewport, null, '', null, { "class": _classOption.SLIDER });

            _navigation = $lib.element(_instance.element, null, '', null, { "class": _classOption.NAVIGATION });
            createItem(_navigation, _classOption.PREVIOUS, 'div', prevItem);

            _indicators = $lib.element(_navigation, null, 'ul');

            _instance.templates.forEach(function (template, id)
            {
                var item = $lib.element(_slider, null, '', null, { 'class': `${_classOption.ITEM} ${_classOption.OUT_OF_VIEW}` });

                if (!horizontal)
                    item.style.height = (100 / (_instance.templates.size)) + "%";

                _instance.applyTemplate(item, id);
                createItem(_indicators, _classOption.ITEM, 'li', selectItem.bind(_instance, ++index, null));
            });

            _itemCount = _instance.templates.size;

            if (horizontal)
                _slider.style.width = (_itemCount * 100) + '%';
            else
                _slider.style.height = (_itemCount * 100) + '%';

            createItem(_navigation, _classOption.NEXT, 'div', nextItem);
            bindEvents();

            if (_instance.dragNavigation)
                $lib.addClass(_instance.element, _classOption.DRAG);

            _instance.postRender();
        }

        function createItem(container, cssClass, tag, fn)
        {
            var a = $lib.element($lib.element(container, null, tag, null, { 'class': cssClass }), null, 'a', null, { href: 'javascript:void(0);' });
            $lib.on(a.parentElement, 'click', fn);
        }

        function bindEvents()
        {
            var doc = document,
                el = (_instance.fullscreen) ? doc : _instance.element;

            if (_instance.dragNavigation)
                $lib.on(el, 'mousedown', startDrag);

            $lib.on(doc, 'mousemove', drag);
            $lib.on(doc, 'mouseup', endDrag);
            $lib.on(window, 'resize', resize);

            if (_instance.keyboardNavigation)
                $lib.on(el, 'keydown', key);

            if (_instance.wheelNavigation)
                $lib.on(el, 'wheel', wheel);

            $lib.on(_navigation, 'mousedown', cancelDrag);
        }

        function resize()
        {
            $lib.defer(function () { selectItem(_selectedIndex, true); });
        }

        function cancelDrag()
        {
            _allowDrag = false;
        }

        function prevItem()
        {
            selectItem(_selectedIndex - 1);
        }

        function nextItem()
        {
            selectItem(_selectedIndex + 1);
        }

        function key(e)
        {
            var keyCode = e.key,
                find = ' ' + keyCode.toString() + ' ',
                horizontal = _instance.horizontal, index;

            if ((horizontal && ' ArrowLeft ArrowRight '.indexOf(find) == -1) ||
                (!horizontal && ' PageUp PageDown Home End ArrowUp ArrowDown '.indexOf(find) == -1))
                return;

            if (keyCode == 'End')
                index = _itemCount - 1;
            else if (keyCode == 'Home')
                index = 0;
            else
                index = (' PageUp ArrowUp ArrowLeft '.indexOf(find) > -1) ? _selectedIndex - 1 : _selectedIndex + 1;

            selectItem(index);

            if (!_instance.fullscreen)
                e.preventDefault();
        }

        function wheel(e)
        {
            var forwards = (e.deltaY > 0);

            if ((forwards && _selectedIndex == _itemCount - 1) || !forwards && !_selectedIndex)
                return;

            selectItem((forwards) ? _selectedIndex + 1 : _selectedIndex - 1);

            if (!_instance.fullscreen)
                e.preventDefault();
        }

        function startDrag(e)
        {
            if (_drag || !_allowDrag)
                return;

            let prop = (_instance.horizontal) ? 'left' : 'top',
                items = $lib(_classOption.ITEM, _slider);

            _drag = true;
            _start.x = $lib.clientX(e);
            _start.y = $lib.clientY(e);
            _start.width = _instance.element.offsetWidth;
            _start.height = _instance.element.offsetHeight;
            _start.left = parseFloat(_slider.style.left) || 0;
            _start.top = parseFloat(_slider.style.top) || 0;
            _start.time = new Date().getTime();
            _last = {};

            if (_select)
            {
                var pos = $lib.styleValue(_slider, prop, true),
                    stepSize = (_instance.horizontal) ? _instance.element.offsetWidth : _instance.element.offsetHeight,
                    nearestIndex = Math.round(-parseFloat(pos) / stepSize);

                nearestIndex = Math.max(0, Math.min(_itemCount - 1, nearestIndex));

                stopAnimation(); // animation stop will set viewport position to selectedIndex
                selectItem(nearestIndex, true); // snap state (index, nav, out-of-view) to match the interrupted position

                _slider.style[prop] = pos;
                _start[prop] = parseFloat(pos) || 0;
            }

            for (let itemIndex = 0; itemIndex < items.length; itemIndex++)
                $lib.removeClass(items[itemIndex], _classOption.OUT_OF_VIEW);

            drag(e);
        }

        function drag(e)
        {
            if (!_drag)
                return;

            let horizontal = _instance.horizontal,
                x = $lib.clientX(e),
                y = $lib.clientY(e),
                moveX = _start.x - x,
                moveY = _start.y - y,
                move = (horizontal) ? moveX : moveY,
                forwards = move > 0;

            if (!move || (forwards && _selectedIndex == _itemCount - 1) || !forwards && !_selectedIndex)
                return;

            _instance.stop();

            if (horizontal)
                _slider.style.left = $lib.unit(_start.left - moveX);
            else
                _slider.style.top = $lib.unit(_start.top - moveY);

            _last.x = x;
            _last.moveX = moveX;
            _last.y = y;
            _last.moveY = moveY;
        }

        function endDrag(e)
        {
            if (!_allowDrag)
            {
                _allowDrag = true;
                return;
            }

            if (!_drag)
                return;

            var horizontal = _instance.horizontal,
                percentage = (_instance.dragRevealPercentage / 100) || 0.5,
                speed = (_instance.dragSelectSpeed / 100) || 0.2,
                isSlide = ((horizontal && Math.abs(_last.moveX) / _start.width >= percentage) || (!horizontal && Math.abs(_last.moveY) / _start.height >= percentage)),
                move = (horizontal) ? _last.moveX : _last.moveY,
                forwards = move > 0,
                elapsedTime;

            if (!isSlide)
            {
                elapsedTime = new Date().getTime() - _start.time;
                isSlide = (Math.abs(move) / elapsedTime >= 0.20); // 1px per 5ms
            }

            _drag = _select = false;

            if (isSlide)
                selectItem((forwards) ? _selectedIndex + 1 : _selectedIndex - 1);
            else
                selectItem(_selectedIndex); // slide back to current
        }

        function selectItem(index, instant)
        {
            var moveIndicator = true;

            if (index >= _itemCount)
            {
                moveIndicator = false;
                index = 0;
            }
            else if (index < 0)
            {
                moveIndicator = false;
                index = _itemCount - 1;
            }

            let a = _instance.animation,
                horizontal = _instance.horizontal,
                prop = (horizontal) ? 'left' : 'top',
                easing = $base.static.AnimationEasingOption.getName(a.easing) || $base.static.AnimationEasingOption.getName($base.static.AnimationEasingOption.easeOutCubic),
                to = (horizontal) ? (index * _instance.element.offsetWidth) : (index * _instance.element.offsetHeight),
                nav = $lib(null, _indicators, 'li'),
                items = $lib(_classOption.ITEM, _slider),
                first;

            _instance.stop();
            stopAnimation();

            _prevIndex = _selectedIndex;
            _selectedIndex = index;
            _select = true;

            if ($lib.isEmpty(_slider.style[prop]))
            {
                _slider.style[prop] = '0px'; // must have a value to get transitionend event
            }

            if (!instant)
            {
                var value = $lib.unit(to * -1);

                if (_slider.style[prop] != value)
                {
                    _animation = $lib.cssAnimation(_slider, a.cssClass || undefined, [], { onComplete: transitionComplete });
                    _slider.style[prop] = value;
                }
                else
                    transitionComplete();
            }

            if (_prevIndex != _selectedIndex)
            {
                for (let itemIndex = 0; itemIndex < items.length; itemIndex++)
                    $lib.removeClass(items[itemIndex], _classOption.OUT_OF_VIEW);

                $lib.removeClass(nav[_prevIndex], _classOption.SELECTED);

                if (!$lib.isEmpty(_prevIndex) && moveIndicator && Math.abs(_prevIndex - _selectedIndex) == 1)
                    $lib.addClass(nav[_prevIndex], (_prevIndex < _selectedIndex) ? _classOption.MOVEFORWARD : _classOption.MOVEBACK);

                $lib.addClass(nav[_selectedIndex], _classOption.MOVETO);
            }

            _instance.events.onItemSelect.fire(_instance, { index: _selectedIndex, previousIndex: _prevIndex });

            if (instant)
                transitionComplete();
        }

        function stopAnimation()
        {
            if (_animation)
                _animation.complete();
            else if ($lib.hasClass(_slider, _instance.animation.cssClass)) // check for css animation
                transitionComplete();

            _animation = null;
        }

        function transitionComplete()
        {
            let prop = (_instance.horizontal) ? 'left' : 'top',
                to = (_instance.horizontal) ? (_selectedIndex * _instance.element.offsetWidth) : (_selectedIndex * _instance.element.offsetHeight),
                items = $lib(_classOption.ITEM, _slider),
                nav = $lib(null, _indicators, 'li');

            _slider.style[prop] = $lib.unit(to * -1);

            $lib.off(_slider, 'transitionend animationend', transitionComplete);
            $lib.removeClass(_slider, _instance.animation.cssClass);

            for (let itemIndex = 0; itemIndex < items.length; itemIndex++)
            {
                if (itemIndex !== _selectedIndex)
                    $lib.addClass(items[itemIndex], _classOption.OUT_OF_VIEW);
            }

            $lib.removeClass(nav[_prevIndex], _classOption.MOVEBACK + ' ' + _classOption.MOVEFORWARD);
            $lib.removeClass(nav[_selectedIndex], _classOption.MOVETO);
            $lib.addClass(nav[_selectedIndex], _classOption.SELECTED);

            _animation = null;
            _select = false;

            if (_instance.rotateInterval)
                _instance.start(_instance.rotateInterval);

            _instance.events.onTransitionComplete.fire(_instance, { index: _selectedIndex });
        }

        function dispose()
        {
            var doc = document;

            stopAnimation();
            _instance.stop();

            if (_instance.fullscreen)
            {
                $lib.off(doc, 'mousedown', startDrag);
                $lib.off(doc, 'keydown', key);
                $lib.off(doc, 'wheel', wheel);
            }

            $lib.off(doc, 'mousemove', drag);
            $lib.off(doc, 'mouseup', endDrag);
            $lib.off(window, 'resize', resize);

            _last = {};
            _select = _drag = false;
            _selectedIndex = _prevIndex = undefined;
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.Carousel.prototype = Object.create($base.methods);
    componyx.UI.Carousel.prototype.constructor = componyx.UI.Carousel;
})(window);