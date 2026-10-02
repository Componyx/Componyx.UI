/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * BookmarkSpy class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {Object} An instance of the component.
    */
    componyx.UI.BookmarkSpy = function BookmarkSpy(id, properties)
    {
        // define private properties
        let _instance = this,
            _raf = window.requestAnimationFrame, _caf = window.cancelAnimationFrame, _reqId,
            _scroller, _anchorContainer, _firstAnchor, _lastAnchor, _selected, _lastScroll,
            _initPath, _anchors = new Map(), _bookmarks = [];

        // define public properties
        /**
         * Gets or sets the css class to apply to the active menu-item anchor.
         * @property {String} cssClass=selected
         */
        this.cssClass = 'selected';

        /**
         * Gets or sets the css class to apply to the parent anchor(s) of the active menu-item anchor.
         * @property {String} [cssClassParent]
         */
        this.cssClassParent = '';

        /**
         * Gets or sets a value indicating to spy on horizontal instead of vertical scrolling.
         * @property {Boolean} [horizontal=false]
         */
        this.horizontal = false;

        /**
         * Gets or sets a value indicating if the URL anchor must be rewritten to the active bookmark.
         * @property {Boolean} [updateURL=true]
         */
        this.updateURL = true;

        /**
         * Gets or sets a value indicating if the click event of the selected anchor is executed.
         * @property {Boolean} [fireAnchorClick=false]
         */
        this.fireAnchorClick = false;

        /**
         * Gets or sets the scrollable container element or element id.
         * @property {HTMLElement|String} [scroller=document]
         */
        this.scroller = null;

        /**
         * Gets or sets the anchor container element or element id.
         * @property {HTMLElement|String} [anchorContainer=document]
         */
        this.anchorContainer = null;

        /**
         * Gets or sets the offset in pixels.
         * @property {Number} [offset=0]
         */
        this.offset = 0;

        /**
         * Gets or sets the bookmark tags (space delimited) to spy on.
         * @property {String} [tags]
         */
        this.tags = '';

        /**
         * Gets or sets the menu component which holds the bookmark links.
         * @property {String} [menuId]
         */
        this.menuId = null;


        /**
        * @class
         * @augments componyx.UI.base.Events
         * @memberof componyx.UI.BookmarkSpy
         * @property {componyx.UI.base.Event} onPreInit   - Event which fires before init but after resources load.
         * @property {componyx.UI.base.Event} onPostInit  - Event which fires after init.
         * @property {componyx.UI.base.Event} onChange    - Event which fires when the active bookmark changes. @see {@link componyx.UI.BookmarkSpy.ChangeEventArgs}
         * @see {@link componyx.UI.base.Events}
         */
        function BookmarkSpyEvents(events)
        {
            Object.assign(this, events);
            this.onPreInit = $base.static.createEvent('onPreInit');
            this.onPostInit = $base.static.createEvent('onPostInit');
            this.onChange = $base.static.createEvent('onChange');
        };

        /**
         * BookmarkSpy events
         * @type {componyx.UI.BookmarkSpy.BookmarkSpyEvents}
         */
        this.events = new BookmarkSpyEvents(this.events);

        /**
         * BookmarkSpy change event arguments.
         * @typedef {Object} ChangeEventArgs
         * @memberof componyx.UI.BookmarkSpy
         * @property {HTMLAnchorElement} selected - The anchor of the active bookmark.
         * @property {HTMLAnchorElement|null} [deselected] - The anchor of the previously active bookmark, empty on the first change.
         */

        if (!properties)
            properties = {};
        else if ($lib.isElement(properties))
            properties = { containerElement: properties }

        if (properties.cssClass == undefined)
            properties.cssClass = this.cssClass;

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        // the BookmarkSpy does not render html output, so nothing to hide
        this.hide = null;

        /** 
        * Initializes the BookmarkSpy component if this has not yet been done.
        */
        this.show = function ()
        {
            if (_instance.renderState == $base.static.RenderState.NONE)
                this.render();
        }

        /** 
        * Initializes the BookmarkSpy component.
        */
        this.init = function ()
        {
            const element = _instance.element;

            _instance.destroy(true, false); // keep events, keep the placeholder in the DOM
            _instance.element = element;
            _instance.hasTheme = false;
            $UI.store[_instance.id] = _instance;

            if (element) // a BookmarkSpy created by another component does not have an element
            {
                $UI.elementStore.set(element, _instance); // destroy() removed it
                $base.methods.setupMutationObserver.call(_instance);
            }

            _instance.renderState = $base.static.RenderState.RENDERED; // we need to set this state otherwise main UI postRender event might be blocked
            _instance.events.onPreInit.fire(_instance);

            if ($UI.busy)
            {
                if (!$UI.onPostRender.has(init))
                    $UI.onPostRender.once(init);
            }
            else
                init();
        }

        /**
        * Initializes the BookmarkSpy component. Both init and render are the same for this component.
        * @function
        */
        this.render = this.init;

        /** 
         * Destroys the component.
         * @see {@link componyx.UI.base.methods#destroy}
         */
        this.destroy = function (...args)
        {
            dispose();
            $base.methods.destroy.call(this, ...args);
        };

        function init()
        {
            _initPath = window.location.pathname;
            _scroller = getElement(_instance.scroller) || $lib.scrollableRoot();
            _anchorContainer = getElement(_instance.anchorContainer) || document;

            let bookmarks = $lib(null, _scroller, _instance.tags),
                anchors = $lib(null, _anchorContainer, 'a');

            $lib.each(bookmarks, function (el)
            {
                let a = getAnchor(el.id, anchors);

                if (a)
                {
                    _bookmarks.push(el);
                    _anchors.set(el.id, a);
                    _lastAnchor = a;

                    if (!_firstAnchor)
                        _firstAnchor = a;
                }
            });

            _bookmarks.reverse();
            update();
            _instance.events.onPostInit.fire(_instance);
        }

        function getElement(el)
        {
            if (el && typeof el == 'string' && $lib('#' + el))
                return $lib('#' + el);

            return el;
        }

        function getAnchor(id, anchors)
        {
            if ($lib.isEmpty(id))
                return;

            let item;

            $lib.each(anchors, function (a)
            {
                let index = a.href.lastIndexOf('#');

                if (index > -1)
                {
                    let hash = a.href.substr(index + 1);

                    if (hash === id)
                    {
                        item = a;
                        return false;
                    }
                }
            });

            return item;
        }

        function update()
        {
            if (!_anchors.size || window.location.pathname !== _initPath) // no anchors or route has changed
                return;

            let scroll = (_instance.horizontal) ? _scroller.scrollLeft : _scroller.scrollTop;

            if ($lib.isEmpty(_lastScroll) || Math.abs(_lastScroll - scroll) >= 1)
            {
                _lastScroll = scroll;
                spy();
            }

            _reqId = _raf(update);
        }

        function spy()
        {
            if (_lastScroll == 0)
                selectFirst();
            else if (isScrollEnd())
                selectLast();
            else
            {
                $lib.each(_bookmarks, function (bookmark)
                {
                    let scrollerPos = (_scroller !== $lib.scrollableRoot()) ? $lib.getPos(_scroller, null, true) : { top: 0, left: 0 },
                        pos = $lib.getPos(bookmark, null, true),
                        p = (_instance.horizontal) ? pos.left - (scrollerPos.left + _scroller.clientLeft) : pos.top - (scrollerPos.top + _scroller.clientTop); // include possible scroll-container border difference

                    if (p <= _instance.offset)
                    {
                        selectItem(_anchors.get(bookmark.id));
                        return false;
                    }
                });
            }
        }

        function isScrollEnd()
        {
            let size = (_instance.horizontal) ? _scroller.clientWidth : _scroller.clientHeight,
                scrollSize = (_instance.horizontal) ? _scroller.scrollWidth : _scroller.scrollHeight,
                maxScroll = scrollSize - size;

            return (Math.abs(_lastScroll - maxScroll) < 1);
        }


        function selectFirst()
        {
            selectItem(_firstAnchor);
        }

        function selectLast()
        {
            selectItem(_lastAnchor);
        }

        function selectItem(anchor)
        {
            if (anchor === _selected)
                return;

            let selected = _selected,
                hash = anchor.href.split('#'),
                l = hash.length - 1;

            _selected = anchor;

            if (selected)
                deselectItem(selected);

            if (_instance.cssClass)
                $lib.addClass(anchor, _instance.cssClass);

            if (_instance.cssClassParent)
                selectParent(anchor);

            if (_instance.fireAnchorClick)
                anchor.click();

            anchor.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

            let args = { selected: _selected, deselected: selected };

            updateMenu(args);

            if (_instance.updateURL)
            {
                let loc;

                if ($lib.isEmpty(window.location.hash))
                    loc = window.location.href + '#' + hash[l];
                else
                    loc = window.location.href.replace(/(.+)(#.+)$/, '$1#' + hash[l]); // replace last hash

                window.history.replaceState(null, '', loc);
            }


            _instance.events.onChange.fire(_instance, args);
        }

        function updateMenu(args)
        {
            if (!_instance.menuId)
                return;

            let menu = $UI.store[_instance.menuId];

            if (args.deselected)
                menu.deselectItem($UI.elementStore.get(args.deselected).id.replace(menu.id + '_', ''));

            menu.selectItem($UI.elementStore.get(args.selected).id.replace(menu.id + '_', ''));
        }

        function selectParent(anchor, deselect)
        {
            $lib(function (el)
            {
                let parent = getParentAnchor(el.previousElementSibling);

                if (parent)
                {
                    if (deselect)
                        $lib.removeClass(parent, _instance.cssClassParent);
                    else
                        $lib.addClass(parent, _instance.cssClassParent);

                    selectParent(parent);
                }
            }, anchor, '', false, true);
        }

        function getParentAnchor(el)
        {
            if (!el)
                return null;

            if (el.nodeName.toLowerCase() === 'a')
                return el;

            let anchors = $lib(null, el, 'a');

            if (anchors.length)
                return anchors[anchors.length - 1];
        }

        function deselectItem(anchor)
        {
            $lib.removeClass(anchor, _instance.cssClass);

            if (_instance.cssClassParent)
                selectParent(anchor, true);
        }

        function dispose()
        {
            _caf(_reqId);
            _reqId = null;

            if (_selected)
                deselectItem(_selected);

            _bookmarks = [];
            _anchors = new Map();
            _firstAnchor = _lastAnchor = _lastScroll = _selected = null;
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.BookmarkSpy.prototype = Object.create($base.methods);
    componyx.UI.BookmarkSpy.prototype.constructor = componyx.UI.BookmarkSpy;

})(window);