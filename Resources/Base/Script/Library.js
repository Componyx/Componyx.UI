/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
/** 
* Root namespace for componyx components and utilities (shorthand: CMP).
* @namespace componyx
*/
globalThis.componyx = {};
globalThis.CMP = globalThis.componyx;

(function (window)
{
    /**
    * @typedef {Object} componyx.library.Toggle
    * @memberof componyx.library
    * @property {Function} enable Enables the functionality.
    * @property {Function} disable Disables the functionality.
    */

    /**
    * @typedef {Object} componyx.library.Dimensions
    * @memberof componyx.library
    * @property {number} width The width value.
    * @property {number} height The height value.
    */
    /**
    * @typedef {Object} componyx.library.BorderSizes
    * @memberof componyx.library
    * @property {number} borderTop The width of the top border.
    * @property {number} borderRight The width of the right border.
    * @property {number} borderBottom The width of the bottom border.
    * @property {number} borderLeft The width of the left border.
    */
    /**
    * @typedef {Object} componyx.library.PaddingSizes
    * @memberof componyx.library
    * @property {number} paddingTop The width of the top padding.
    * @property {number} paddingRight The width of the right padding.
    * @property {number} paddingBottom The width of the bottom padding.
    * @property {number} paddingLeft The width of the left padding.
    */
    /**
    * @typedef {Object} componyx.library.BorderPaddingSizes
    * @memberof componyx.library
    * @property {number} width Total padding and border width.
    * @property {number} height Total padding and border height.
    * @property {number} borderTop The width of the top border.
    * @property {number} borderRight The width of the right border.
    * @property {number} borderBottom The width of the bottom border.
    * @property {number} borderLeft The width of the left border.
    * @property {number} paddingTop The width of the top padding.
    * @property {number} paddingRight The width of the right padding.
    * @property {number} paddingBottom The width of the bottom padding.
    * @property {number} paddingLeft The width of the left padding.
    */
    /**
    * @typedef {Object} componyx.library.MarginSizes
    * @memberof componyx.library
    * @property {number} top The width of the top margin.
    * @property {number} right The width of the right margin.
    * @property {number} bottom The width of the bottom margin.
    * @property {number} left The width of the left margin.
    * @property {number} width The width of the left and right margin.
    * @property {number} height The width of the top and bottom margin.
    */
    /**
    * @typedef {Object} componyx.library.Position
    * @memberof componyx.library
    * @property {number} top The top position.
    * @property {number} right The right position.
    * @property {number} bottom The bottom position.
    * @property {number} left The left position.
    */
    /**
    * @typedef {Object} componyx.library.ScrollPos
    * @memberof componyx.library
    * @property {number} scrollTop The scroll top value.
    * @property {number} scrollLeft The scroll left value.
    */

    /**
    *   @typedef {Object} componyx.library.DraggableSettings
    *	@memberof componyx.library
    *   @property {HTMLElement} dragHandle The handle which activates dragging.
    *   @property {HTMLElement} dragGhost Visible element when dragging.
    *   @property {HTMLElement} boundaryZone Defines the drag boundaries.
    *   @property {HTMLElement[]|Function} dropZones A static array of drop zone elements or a function that returns a list of drop zone elements where the draggable element is allowed to be dropped.
    *   @property {Number|String} dropAcceptMode Defines how much overlap is required to accept the dropping.
    *   -   0: full
    *   -   1: half
    *   -   2: touch
    *   @property {Boolean} ghostOnly Defines that only the ghost element must be visible when dragging.
    *   @property {Boolean} autoGhostSize A value indicating if the element size should be applied to the ghost element.
    *   @property {Boolean} allowDropOutZone A value indicating if the draggable element can be dropped outside of a drop zone.
    *   @property {Boolean} moveOriginal=true A value indicating if the original element is moved when a drag ghost is used and the drag operation ends.
    *   @property {Boolean} dragX=true A value indicating if horizontal dragging is allowed.
    *   @property {Boolean} dragY=true A value indicating if vertical dragging is allowed.
    *	@property {Boolean} scrollX A value indicating if the drag element activates horizontal scrolling on the boundary zone when the drag element hits the left or right of the boundary zone.
    *   @property {Boolean} scrollY A value indicating if the drag element activates vertical scrolling on the boundary zone when the drag element hits the top or bottom of the boundary zone.
    *   @property {Number} minDragX Minimum change in pixels before the horizontal dragging starts.
    *   @property {Number} minDragY Minimum change in pixels before the vertcial dragging starts.
    *   @property {Number} tickX Horizontal tick size.
    *   @property {Number} tickY Vertical tick size.
    *   @property {Number} boundaryOvershootLeft Defines how many extra pixels the boundary zone may be exceeded (or limited) on the left side.
    *   @property {Number} boundaryOvershootRight Defines how many extra pixels the boundary zone may be exceeded (or limited) on the right side.
    *   @property {Number} boundaryOvershootTop Defines how many extra pixels the boundary zone may be exceeded (or limited) on the top side.
    *   @property {Number} boundaryOvershootBottom Defines how many extra pixels the boundary zone may be exceeded (or limited) on the bottom side.
    *   @property {Boolean} ignoreBoundaryBorders Defines a value indicating if the borders of the boundary zone are ignored in the boundary calculations.
    *   @property {Boolean} ignoreMargins Defines a value indicating if drag element margins are ignored in the boundary calculations.
    *   @property {String} dragClass CSS class applied to the element when dragging.
    *   @property {String} droppableClass CSS class applied to the element and dropzone when the element is droppable.
    *   @property {String} dropClass CSS class applied to the element and dropzone when the element is dropped.
    *   @property {Boolean} cancelDrag A value indicating if the the drag operation is canceled before it starts. If needed, set this value in the onDragStart event.
    *   @property {Function} onDragStart Event callback method.
    *   @property {Function} onDrag Event callback method.
    *   @property {Function} onDragEnd Event callback method.
    *   @property {Function} onDroppableEnter Event callback method.
    *   @property {Function} onDroppable Event callback method.
    *   @property {Function} onDroppableLeave Event callback method.
    *   @property {Function} onDrop Event callback method. 
    */

    /**
    * @typedef {Object} componyx.library.DraggableController
    * @memberof componyx.library
    * @property {HTMLElement} element The specified HTMLElement.
    * @property {Object} settings The specified settings.
    * @property {Boolean} disabled A value indicating if the draggable functionality is disabled.
    * @property {Function} enable Enables the specified element to be draggable.
    * @property {Function} disable Disables the specified element to be draggable.
    * @property {Function} startDrag Starts the dragging.
    * @property {Function} endDrag Ends the dragging.
    */

    /**
    * @typedef {Object} componyx.library.ResizableSettings
    * @memberof componyx.library
    * @property {Object} resizeHandles Resize handle object (key, value).
    * - key: resize direction s, e or se.
    * - value: HTMLElement.
    * @property {HTMLElement} resizeGhost Visible element when resizing.
    * @property {HTMLElement} boundaryZone Defines the resize boundaries.
    * @property {Boolean} defaultHandles Defines if default resize handles are applied.
    * @property {Boolean} ghostOnly Defines that only the ghost element must be visible when resizing.
    * @property {Number} minResizeX Minimum change in pixels before the horizontal resizing starts.
    * @property {Number} minResizeY Minimum change in pixels before the vertcial resizing starts.
    * @property {Number} tickX Horizontal tick size.
    * @property {Number} tickY Vertical tick size.
    * @property {String} resizeClass CSS class applied to the element when resizing.
    * @property {Function} onResizeStart Event callback method.
    * @property {Function} onResize Event callback method.
    * @property {Function} onResizeEnd Event callback method. */

    /**
    * @typedef {Object} componyx.library.ResizableController
    * @memberof componyx.library
    * @property {HTMLElement} element The specified HTMLElement.
    * @property {Object} settings The specified 
    * @property {Boolean} disabled A value indicating if the resizable functionality is disabled.
    * @property {Function} enable Enables the specified element to be resizable.
    * @property {Function} disable Disables the specified element to be resizable.
    */

    /**
    * @typedef {Object} componyx.library.SelectableSettings
    * @memberof componyx.library
    * @property {HTMLElement} dragZone Defines the zone from where a drag select can be started.
    * @property {HTMLElement} selectZone Defines the zone with selectable elements.
    * @property {HTMLElement[]} include Elements to include (by default all child elements of the selectZone are included).
    * @property {HTMLElement[]} exclude Elements to exclude. Setting is ignored if elements are explicitly specified with the include setting.
    * @property {String} includeTags Space separated list of tags to include. Setting is ignored if elements are explicitly specified with the include setting.
    * @property {String} excludeTags Space separated list of tags to exclude. Setting is ignored if elements are explicitly specified with the include setting.
    * @property {Boolean} liveUpdate When set to true the onSelect event is fired while dragging otherwise the event is fired when the drag selection ends.
    * @property {Boolean} clearOnOutsideClick Indicates if the selection should be cleared on a click outside the dragZone.
    * @property {Boolean} toggleDragSelect Deselects the selected element(s) on a drag select.
    * @property {Boolean} toggleClickSelect Deselects the selected element(s) on a click select.
    * @property {Boolean} appendDragSelect Appends the current selection on a drag select.
    * @property {Boolean} appendClickSelect Appends the current selection on a click select.
    * @property {Boolean} shiftSelect Defines if shift key selection is enabled.
    * @property {Boolean} ctrlSelect Defines if ctrl key selection is enabled.
    * @property {Number} scrollOffsetX Defines the horizontal scroll offset within the dragZone.
    * @property {Number} scrollOffsetY Defines the vertical scroll offset within the dragZone.
    * @property {Number|String} selectMode
    *-  0: drag_click
    *-  1: drag
    *-  2: click
    * @property {String} dragSelectionClass CSS class of the drag selection.
    * @property {String} selectedClass CSS class applied to the element when selected.
    * @property {Function} onDragStart Event callback method.
    * @property {Function} onDrag Event callback method.
    * @property {Function} onDragEnd Event callback method.
    * @property {Function} onSelect Event callback method.
     */

    /**
    * @typedef {Object} componyx.library.SelectableController
    * @memberof componyx.library
    * @property {HTMLElement} element The specified HTMLElement.
    * @property {Object} settings The specified settings.
    * @property {Boolean} disabled A value indicating if the selectable functionality is disabled.
    * @property {Function} enable Enables the selectability for all elements in the list of selectable elements.
    * @property {Function} disable Disables the selectability for all elements in the list of selectable elements.
    * @property {Function} update Updates the list of selectable elements and removes event bindings for previous selectable elements.
    * @property {Function} deselect Deselects all selected element(s) from the list of selectable elements. Optional argument: A Boolean value indicating if the select event should fire.
    * @property {Function} select Selects all element(s) from the list of selectable elements. Optional argument: A Boolean value indicating if the select event should fire.
    * @property {Function} getSelectable Returns an array of all selectable elements in the following format: at index [0]: element, at index [1]:bounding client rectangle.
    * @property {Function} getSelection Returns an array of all selected elements.
    */

    /**
    * @typedef {Object} componyx.library.Viewport
    * @memberof componyx.library
    * @property {Boolean} top Defines if the top of the element is visible.
    * @property {Boolean} right Defines if the right of the element is visible.
    * @property {Boolean} bottom Defines if the bottom of the element is visible.
    * @property {Boolean} left Defines if the left of the element is visible.
    * @property {Boolean} visible Defines if the element is partially visible.
    * @property {Boolean} full Defines if the element is fully visible.
    */

    /**
     * @typedef {Object} componyx.library.XhrWrappedResult
     * @memberof componyx.library
     * @property {XMLHttpRequest} xhr The xhr object.
     * @property {Object} settings The initial settings object.
     * @property {componyx.library.XhrAbortFunction} abort A method to abort the running xhr request. Different to xhr.abort() in that it will also abort a repeating call specified with settings.repeatInterval.
    */

    /**
     * A function to abort the active xhr request.
     * @typedef {function} componyx.library.XhrAbortFunction
     * @memberof componyx.library
     * @param {boolean} stopRepeat Stops the repeating xhr call cycle when a repeatInterval was specified in the xhr settings.
     * @returns {void}
     */

    /**
     * Callback for xhr events.
     * @typedef {function} componyx.library.XhrCallback
     * @memberof componyx.library
     * @param {Object} args An object used as argument for XHR callbacks.
     * @param {XMLHttpRequest} args.xhr The xhr object.
     * @param {componyx.library.xhrSettings} args.settings The settings of the xhr.
     * @param {Object} args.data The response data.
     * @param {boolean} args.timeout A value indicating if the request timed out.
     * @param {ProgressEvent} args.event A progress event (onProgress and onUploadProgress).
     * @returns {void}
     */

    /**
     * Callback for iteration.
     * @typedef {function} componyx.library.EachCallback
     * @memberof componyx.library
     * @param {Object} item - The current item in the iteration.
     * @param {number|string} index - The current array index or object key.
     * @param {Object|Object[]} object - The object that is being iterated.
     * @param {Object} args - The initial arguments that were provided with the 'each' method call.
     * @param {function} next - A callback function to retrieve the next item from the iteration.
     * @returns {void}
     */

    let $, _display = new Set(), _animation, Animation, _guid = 1,
        _requestFrame = window.requestAnimationFrame,
        _cancelFrame = window.cancelAnimationFrame,
        _cssPropRegExp = /(\-([a-z]){1})/g,
        _nav = window.navigator,
        _pointer = (_nav.pointerEnabled == true),
        _hasTouch = ((_nav.msMaxTouchPoints || _nav.maxTouchPoints) > 0 && (_pointer || 'ontouchstart' in document.documentElement)),
        _pointerEvents =
        {
            onmousedown: 'onpointerdown',
            onmouseup: 'onpointerup',
            onmousemove: 'onpointermove'
        },
        _noop = function () { },
        _nativeListeners = new WeakMap(),
        _stopEvent = function (e) { e.preventDefault(); e.stopPropagation(); },
        _preventDefault = function (e) { e.preventDefault(); },
        _setTouchAction = function (el, value)
        {
            const current = getComputedStyle(el).touchAction;

            // skip when already set by us, or explicitly set by the implementer in css/inline
            if (el.__touchAction !== undefined || (current && current !== 'auto'))
                return;

            el.__touchAction = el.style.touchAction; // remember the original inline value for the reset
            el.style.touchAction = value;
        },
        _resetTouchAction = function (el)
        {
            if (el.__touchAction === undefined)
                return;

            el.style.touchAction = el.__touchAction;
            delete el.__touchAction;
        },
        _slice = function (arr, start, end) { return Array.prototype.slice.call(arr, start, end); },
        _addTag = function (tag, before)
        {
            if (before)
                before.parentElement.insertBefore(tag, before);
            else
                ($(null, null, 'head', true) || $.getDocument().body).appendChild(tag);
        },
        _removeHandler = function (obj, eventType, guid)
        {
            var current = obj.__events[eventType],
                handlers = current.get(guid);

            if (handlers)
            {
                $.each(handlers, function (h)
                {
                    if (h.listenerMethod)
                    {
                        obj.removeEventListener(h.orgEventType, h.listenerMethod, h.options || false); // remove the native listener with its original options

                        let list = _getNativeListeners(obj), index; // also remove from our registry so we don't leak
                        for (index = list.length - 1; index >= 0; index--)
                        {
                            let rec = list[index];
                            if (rec.handlerGuid === guid && rec.listener === h.listenerMethod)
                            {
                                list.splice(index, 1);
                            }
                        }
                    }
                });

                current.delete(guid);
            }

            if (current.size == 0)
            {
                obj.__events[eventType] = null;

                if (obj[eventType])
                    obj[eventType] = null;
            }
        },
        _getNativeListeners = function (obj)
        {
            let list = _nativeListeners.get(obj);
            if (!list)
            {
                list = [];
                _nativeListeners.set(obj, list);
            }
            return list;
        },
        _isBorderBox = function (element)
        {
            return ($.styleValue(element, 'box-sizing', true) === 'border-box');
        },
        _getSize = function (element, type)
        {
            var outer = $.element($.getDocument().body),
                inner = $.getDocument().createElement('div'),
                s = $.styleValue, def = '1px', size = {};

            $.updateStyle(outer.style, $.format('border-style:solid;border-color:transparent;width:{0};min-width:{0};height:{0};min-height:{0}', def));
            // copy paddings and borders from computed style
            $.updateStyle(outer.style, $.format('{0}top:{1};{0}right:{2};{0}bottom:{3};{0}left:{4};', 'padding-', s(element, 'paddingTop'), s(element, 'paddingRight'), s(element, 'paddingBottom'), s(element, 'paddingLeft')));
            $.updateStyle(outer.style, $.format('{0}top-{1}:{2};{0}right-{1}:{3};{0}bottom-{1}:{4};{0}left-{1}:{5};', 'border-', 'width', s(element, 'borderTopWidth'), s(element, 'borderRightWidth'), s(element, 'borderBottomWidth'), s(element, 'borderLeftWidth')));

            inner.style.width = inner.style.height = '1px';
            outer.appendChild(inner);

            if (type == 'border')
            {
                $.updateStyle(outer.style, 'padding:0');
                set('border');
            }
            else
            {
                $.updateStyle(outer.style, 'border:0');
                set('padding');
            }

            $.remove(outer);
            return size;

            function set(prefix)
            {
                var outerPos = $.getPos(outer),
                    innerPos = $.getPos(outer.firstChild);

                size[prefix + 'Top'] = innerPos.top - outerPos.top;
                size[prefix + 'Right'] = outerPos.right - innerPos.right;
                size[prefix + 'Bottom'] = outerPos.bottom - innerPos.bottom;
                size[prefix + 'Left'] = innerPos.left - outerPos.left;
            }
        },

        /** 
        * Retrieves elements by there css classname(s).
        * 
        * @param {String} className Space-delimited list of class names.
        * @param {HTMLElement} baseElement Element from where to start searching or null to start at the document.
        * @param {String} tagName Name of tags to search or null to search all tags.
        * @param {Function} callback 
        * A callback function which accepts two arguments and returns true to include or false to exclude the element from the result array. 
        *     argument 1: The current element in the iteration.
        *     argument 2: A function reference to stop the iteraton when called. (optional)
        *     Pass null if no callback is required.
        * 
        * @param {Boolean} scalar Boolean indicating to return a single result which makes the iteration stop after a match.
        * @returns {HTMLElement[]} Array of elements.
        * @private
        */
        _getElementsByClassName = function (className, baseElement, tagName, callback, scalar)
        {
            var tags = [],
                result = [],
                index = -1, length, stopped = false,
                stop = function () { stopped = true; }, fn;

            className = $.trim(className);
            tagName = $.trim(tagName) || '*';
            baseElement = baseElement || $.getDocument();
            tags = baseElement.getElementsByClassName(className);
            length = tags.length;

            if (tagName != '*' || callback)
            {
                tagName = ' ' + tagName.toLowerCase() + ' ';

                if (callback && tagName != ' * ')
                    fn = function (tag, stop) { return (tagName.indexOf(' ' + tag.nodeName.toLowerCase() + ' ') > -1 && callback(tag, stop)); };
                else if (tagName != ' * ')
                    fn = function (tag, stop) { return (tagName.indexOf(' ' + tag.nodeName.toLowerCase() + ' ') > -1); };
                else
                    fn = callback;

                while (++index < length && !stopped)
                {
                    if (fn(tags[index], stop))
                    {
                        result.push(tags[index]);

                        if (scalar)
                            stopped = true;
                    }
                }
            }
            else if (scalar)
            {
                while (++index < length && !stopped)
                {
                    result.push(tags[index]);

                    if (scalar)
                        stopped = true;
                }
            }
            else
            {
                while (++index < length)
                    result.push(tags[index]);
            }

            return (!scalar) ? result : result[0] || null;
        },

        /** 
        *    Iterates through the DOM and matches them against a custom filter function.
        * 
        * @param {HTMLElement} baseElement Element from where to start searching or null to start at the document.
        * @param {String} tagName Tag name or Space-delimited list of tag names to search or null to search all tags.
        * @param {Function} callback 
        * A callback function which accepts two arguments and returns true to include or false to exclude the element from the result array. 
        *     argument 1: The current element in the iteration.
        *     argument 2: A function reference to stop the iteraton when called. (optional)
        *     Pass null if no callback is required.
        * 
        * @param {Boolean} scalar Boolean indicating to return a single result which makes the iteration stop after a match.
        * @returns {HTMLElement[]} Array of elements
        * @private
        */
        _getElements = function (baseElement, tagName, callback, scalar)
        {
            var result = [],
                index = -1, length = 0, stopped = false,
                stop = function () { stopped = true; },
                tags = [], fn;

            tagName = $.trim(tagName) || '*';
            tagName = tagName.toLowerCase();
            baseElement = baseElement || $.getDocument();

            if (tagName.indexOf(' ') != -1)
            {
                tags = baseElement.getElementsByTagName('*');
                tagName = ' ' + tagName + ' ';

                if (callback)
                    fn = function (tag, stop) { return (tagName.indexOf(' ' + tag.nodeName.toLowerCase() + ' ') > -1 && callback(tag, stop)); };
                else
                    fn = function (tag, stop) { return (tagName.indexOf(' ' + tag.nodeName.toLowerCase() + ' ') > -1); };
            }
            else
            {
                fn = callback;
                tags = baseElement.getElementsByTagName(tagName);
            }

            length = tags.length;

            if (fn)
            {
                while (++index < length && !stopped)
                {
                    if (fn(tags[index], stop))
                    {
                        result.push(tags[index]);

                        if (scalar)
                            stopped = true;
                    }
                }
            }
            else if (scalar)
            {
                while (++index < length && !stopped)
                {
                    result.push(tags[index]);

                    if (scalar)
                        stopped = true;
                }
            }
            else
            {
                while (++index < length)
                    result.push(tags[index]);
            }

            return (!scalar) ? result : result[0] || null;
        },

        /** 
        *    Iterates upwards through the DOM starting at the base element and matches them against a custom filter function.
        * 
        * @param {HTMLElement} baseElement Element from where to start searching.
        * @param {String} tagName Tag name or Space-delimited list of tag names to search or null to search all tags.
        * @param {Function} callback 
        * A callback function which accepts two arguments and returns true to include or false to exclude the element from the result array. 
        *     argument 1: The current element in the iteration.
        *     argument 2: A function reference to stop the iteraton when called. (optional)
        *     Pass null if no callback is required.
        * 
        * @param {Boolean} scalar Boolean indicating to return a single result which makes the iteration stop after a match.
        * @returns {HTMLElement[]} Array of elements
        * @private
        */
        _getParentElements = function (baseElement, tagName, callback, scalar)
        {
            var result = [],
                element, stopped = false, fn,
                stop = function () { stopped = true; };

            tagName = $.trim(tagName) || '*';
            tagName = tagName.toLowerCase();
            element = baseElement;

            if (tagName != '*')
            {
                tagName = ' ' + tagName + ' ';

                if (callback)
                    fn = function (tag, stop) { return (tagName.indexOf(' ' + tag.nodeName.toLowerCase() + ' ') > -1 && callback(tag, stop)); };
                else
                    fn = function (tag, stop) { return (tagName.indexOf(' ' + tag.nodeName.toLowerCase() + ' ') > -1); };
            }
            else
                fn = callback;

            if (fn)
            {
                while ((element = element.parentNode) && !stopped)
                {
                    if (fn(element, stop))
                    {
                        result.push(element);

                        if (scalar)
                            stopped = true;
                    }
                }
            }
            else if (scalar)
            {
                while ((element = element.parentNode) && !stopped)
                {
                    result.push(element);

                    if (scalar)
                        stopped = true;
                }
            }
            else
            {
                while ((element = element.parentNode))
                    result.push(element);
            }

            return (!scalar) ? result : result[0] || null;
        },

        /** 
        * Handles the event that fired.
        * @param {Object} e event
        * @param {Object} obj Javascript Object or DOM element
        * @private
        */
        _handleEvent = function (e, obj)
        {
            e = e || $.defaultView(obj || this).event;

            if (e instanceof Event)
                $.event = e; // real event

            let eventType = e.type.toLowerCase(),
                handlers = obj ? obj.__events[eventType] : this.__events['on' + eventType],
                results = [],
                result = null,
                passedArgs = _slice(arguments);

            obj = obj || this;

            if (!handlers)
                return;

            if (passedArgs.length > 2)
                passedArgs = passedArgs.slice(2);
            else
                passedArgs = null;

            handlers.forEach(function (handler, guid, mapObj)
            {
                if (result != false)
                {
                    let fireOnce = [];

                    for (var index = 0; index < handler.length; ++index)
                    {
                        let h = handler[index],
                            args = [];

                        if (h.fired)
                            continue;

                        if (h.fireOnce)
                        {
                            h.fired = true;
                            fireOnce.push(h);
                        }

                        if (!$.isEmpty(h.args))
                            args = h.args.slice();

                        if (passedArgs)
                            args = args.concat(passedArgs);

                        args.push(e);
                        result = h.handler.apply(h.context || obj, args);
                        results.push(result);

                        if (e.returnValue != undefined && e.returnValue === false)
                            result = false;

                        if (result == false)
                            break;
                    }

                    if (fireOnce.length > 0)
                    {
                        if (fireOnce.length == handler.length)
                            $.off(obj, eventType, guid);
                        else
                        {
                            // case where a specific handler is bound multiple times, but not all bound handlers where called with fireOnce
                            for (var index = 0; index < fireOnce.length; ++index)
                            {
                                let removeIndex = handler.indexOf(fireOnce[index]);

                                if (removeIndex > -1)
                                    handler.splice(removeIndex, 1);
                            }
                        }
                    }
                }
            });

            const win = $.defaultView($.getDocument()),
                PromiseCtor = win.Promise || Promise,
                promises = results.filter(r => r instanceof PromiseCtor);

            if (promises.length > 0)
            {
                return Promise.all(promises).then(() => result);
            }
            return result;
        },

        _translateEventType = function (eventType)
        {
            eventType = eventType.toLowerCase();

            if (eventType.indexOf('on') !== 0)
                eventType = 'on' + eventType;

            if (_pointerEvents[eventType])
                eventType = _pointerEvents[eventType];

            return eventType;
        },

        _eventKey = function (e, k)
        {
            var val = e[k];

            if (e.touches && e.touches[0])
                val = e.touches[0][k];
            else if (e.changedTouches && e.changedTouches[0])
                val = e.changedTouches[0][k];

            return val;
        },

        _touch = function (el, zone, x, y)
        {
            var xZone = ((el.left >= zone.left && el.left <= zone.right) || (zone.left >= el.left && zone.left <= el.right) ||
                (el.right >= zone.left && el.right <= zone.right) || (zone.right >= el.left && zone.right <= el.right)),
                yZone = ((el.top >= zone.top && el.top <= zone.bottom) || (zone.top >= el.top && zone.top <= el.bottom) ||
                    (el.bottom >= zone.top && el.bottom <= zone.bottom) || (zone.bottom >= el.top && zone.bottom <= el.bottom));

            x = (x == undefined) ? true : x;
            y = (y == undefined) ? true : y;

            if (x && y)
                return (xZone && yZone);
            else if (y)
                return yZone;
            else
                return xZone;
        },

        _setGUID = function (obj)
        {
            if (!obj.__guid)
                obj.__guid = $.guid();

            return _getGUID(obj);
        },

        _getGUID = function (obj)
        {
            return obj.__guid;
        },

        _addCallback = function (tag, complete, error)
        {
            if (!tag.__callbackQueue)
                tag.__callbackQueue = [];

            var callback = tag.__callbackQueue[tag.__callbackQueue.length] = {};
            callback.complete = complete;
            callback.error = error;
        },

        _refuseCssRules = function (tag)
        {
            var error = false;

            if (tag.type == 'text/css')
            {
                try
                {
                    var rules = tag.sheet.cssRules; // loading failed if cssRules can't be requested
                }
                catch (ex)
                {
                    error = true;
                    $.log(ex.message + ' ' + tag.href);
                }
            }

            return error;
        },

        _srcReady = function (tag, error)
        {
            if (!tag)
                return;

            if (!error)
                error = _refuseCssRules(tag);

            tag.onload = tag.onreadystatechange = null;
            tag.__busy = null;

            if (tag.hasAttribute && tag.hasAttribute("__busy"))
                tag.removeAttribute('__busy');

            if (tag.__callbackQueue)
            {
                // execute callbacks from queue
                for (var index = 0; tag.__callbackQueue[index]; ++index)
                {
                    if (error)
                        tag.__callbackQueue[index].error();
                    else
                        tag.__callbackQueue[index].complete();
                }

                tag.__callbackQueue = null;

                if (tag.hasAttribute && tag.hasAttribute("__callbackQueue"))
                    tag.removeAttribute('__callbackQueue');
            }

            if (error)
                tag.__error = true;
        },

        _createMask = function (element)
        {
            const s = $.styleValue,
                maskEl = $.getDocument().createElement('div'),
                width = element.offsetWidth,
                height = element.offsetHeight,
                rect = element.getBoundingClientRect();

            maskEl.style.position = s(element, 'position', true);
            maskEl.style.left = s(element, 'left', true);
            maskEl.style.right = s(element, 'right', true);
            maskEl.style.top = s(element, 'top', true);
            maskEl.style.bottom = s(element, 'bottom', true);
            maskEl.style.marginLeft = s(element, 'marginLeft', true);
            maskEl.style.marginRight = s(element, 'marginRight', true);
            maskEl.style.marginTop = s(element, 'marginTop', true);
            maskEl.style.marginBottom = s(element, 'marginBottom', true);
            maskEl.style.zIndex = s(element, 'zIndex', true);
            maskEl.style.width = $.unit(rect.width);
            maskEl.style.height = $.unit(rect.height);
            maskEl.style.overflow = 'hidden';

            maskEl.style.setProperty('--cui-mask-width', `${width}px`);
            maskEl.style.setProperty('--cui-mask-height', `${height}px`);

            element.replaceWith(maskEl);
            maskEl.appendChild(element);

            return maskEl;
        },

        _removeMask = function (element)
        {
            var maskEl = element.parentNode;
            maskEl.replaceWith(element);
            return maskEl;
        },

        _getPositionStyle = function (element)
        {
            var s = element.style;
            var style =
            {
                'position': s.position,
                'left': s.left,
                'right': s.right,
                'top': s.top,
                'bottom': s.bottom,
                'margin': s.margin,
                'margin-left': s.marginLeft,
                'margin-right': s.marginRight,
                'margin-top': s.marginTop,
                'margin-bottom': s.marginBottom,
                'width': s.width,
                'box-sizing': s.boxSizing
            }

            return style;
        },

        _setPositionStyle = function (element, style)
        {
            var styles = [];

            $.each(style, function (item, key)
            {
                styles.push(key + ':' + item + ';');
            });

            $.updateStyle(element.style, styles.join(''));
        },

        _getOpacity = function (element)
        {
            var value = $.styleValue(element, 'opacity');
            return (value != '') ? value : 1;
        },

        _setOpacity = function (element, value)
        {
            element.style.opacity = value;
        },

        _toArray = function (obj)
        {
            return (obj == null || obj == undefined || $.isArray(obj)) ? obj : [obj];
        },

        _setDisplay = function (element, reset)
        {
            let docElement = element.ownerDocument.documentElement;

            if (reset && !_display.size)
                return;

            if (reset)
            {
                while (element && element != docElement)
                {
                    if (_display.has(element))
                        element.style.display = 'none';

                    element = element.parentNode;
                }
            }
            else
            {
                while (element && element != docElement)
                {
                    if (element.style.display == 'none')
                    {
                        element.style.display = '';
                        _display.add(element);
                    }

                    element = element.parentNode;
                }
            }

            if (reset)
                _display = new Set();
        },
        _scrollDraggable = function (settings)
        {
            const { scrollX, scrollY, boundary, scrollContainer, state } = settings;
            let scrollSpeed = 1;

            if (state.scrolling)
                return;

            state.scrolling = true;
            let lastPos = { ...state.currentPositions },
                initDirection =
                {
                    x: scrollX
                        ? lastPos.left < boundary.left
                            ? 'left'
                            : lastPos.right > boundary.right
                                ? 'right'
                                : null
                        : null,
                    y: scrollY
                        ? lastPos.top < boundary.top
                            ? 'up'
                            : lastPos.bottom > boundary.bottom
                                ? 'down'
                                : null
                        : null
                };

            function step()
            {
                const pos = state.currentPositions || {},
                    container = scrollContainer,
                    reachedScrollX = scrollX &&
                        ((initDirection.x === 'left' && container.scrollLeft === 0) ||
                            (initDirection.x === 'right' &&
                                container.scrollLeft >= container.scrollWidth - container.clientWidth)),
                    reachedScrollY = scrollY &&
                        ((initDirection.y === 'up' && container.scrollTop === 0) ||
                            (initDirection.y === 'down' &&
                                container.scrollTop >= container.scrollHeight - container.clientHeight));

                // Stop if not dragging, if boundaries are reached, or if the scroll direction has reversed based on the initial positions.
                if (!state.dragging || reachedScrollX || reachedScrollY ||
                    (scrollX &&
                        ((initDirection.x === 'left' && pos.left > lastPos.left) ||
                            (initDirection.x === 'right' && pos.left < lastPos.left))) ||
                    (scrollY &&
                        ((initDirection.y === 'up' && pos.top > lastPos.top) ||
                            (initDirection.y === 'down' && pos.top < lastPos.top))))
                {
                    state.scrolling = false;
                    return;
                }

                let deltaX = 0,
                    deltaY = 0;

                if (scrollX && initDirection.x)
                {
                    deltaX = initDirection.x === 'left' ? -scrollSpeed : scrollSpeed;
                }
                if (scrollY && initDirection.y)
                {
                    deltaY = initDirection.y === 'up' ? -scrollSpeed : scrollSpeed;
                }

                // If there's no movement, stop scrolling.
                if (deltaX === 0 && deltaY === 0)
                {
                    state.scrolling = false;
                    return;
                }

                state.scrolledByDrag = true;
                container.scrollBy(deltaX, deltaY);
                scrollSpeed = Math.min(scrollSpeed + 1, 10); // Gradually increase speed.
                lastPos = { ...state.currentPositions };

                if (state.drag)
                    state.drag();

                state.scrolledByDrag = false;
                _requestFrame(step);
            }

            _requestFrame(step);
        },
        _JSON =
        {
            replacer: function (key, value, casing, optimizer, properties, exclude, replacer)
            {
                var cOption = $.JSON.CasingOption,
                    oOption = $.JSON.OptimizerOption;
                casing = casing || cOption.NONE;
                optimizer = optimizer || oOption.NONE;

                var newKey = null, remove = [],
                    optimized = ((optimizer & oOption.OPTIMIZED) == oOption.OPTIMIZED),
                    excludeNull = (optimized || (optimizer & oOption.EXCLUDENULL) == oOption.EXCLUDENULL),
                    excludeFalse = (optimized || (optimizer & oOption.EXCLUDEFALSE) == oOption.EXCLUDEFALSE),
                    excludeZero = (optimized || (optimizer & oOption.EXCLUDEZERO) == oOption.EXCLUDEZERO),
                    excludeEmpty = (optimized || (optimizer & oOption.EXCLUDEEMPTY) == oOption.EXCLUDEEMPTY);

                if (casing || optimizer || properties || replacer)
                {
                    if (value != null && typeof value === 'object')
                    {
                        for (var k in value)
                        {
                            newKey = k;
                            if (!properties || (properties[k] && !exclude) || (!properties[k] && exclude))
                            {
                                if (casing != cOption.NONE && /^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k))
                                {
                                    newKey = $.format('{0}{1}', (casing == cOption.CAMELCASE) ? k.charAt(0).toLowerCase() : k.charAt(0).toUpperCase(), k.substr(1));
                                    value[newKey] = value[k];
                                    delete value[k];
                                }

                                if (replacer)
                                    replacer(newKey, value[newKey], value);
                            }
                            else
                                remove.push(k);
                        }

                        $.each(remove, function (k)
                        {
                            delete value[k];
                        });
                    }
                }

                if (($.isEmpty(value) && excludeNull)
                    || (typeof value == 'number' && value == 0 && excludeZero)
                    || (typeof value == 'boolean' && value === false && excludeFalse)
                    || (typeof value == 'string' && value === "" && excludeEmpty))
                    return undefined;

                return value;
            }
        },

        /**
        * @class Event
        * @memberof componyx.library
         */
        _eventBase =
        {
            /** Adds a fire once event handler for the event.
            * @param {Function} handler Callback method to invoke when the event fires. Event can be cancelled by returning false.
            * @param {Object[]} [args] Arguments to pass to the specified event handler when the event fires.
            * @returns {String} The unique id of the event-handler.
            * @memberof componyx.library.Event#
            * @function
            */
            once: function (handler, args)
            {
                return this.add(handler, args, true);
            },

            /** Adds an event handler for the event.
            * @param {Function} handler Callback method to invoke when the event fires. Event can be cancelled by returning false.
            * @param {Object[]} [args] Arguments to pass to the specified event handler when the event fires.
            * @param {Boolean} [fireOnce] A value indicating if the handler will fire only once which means that the handler is removed from the event directly after execution.
            * @returns {String} The unique id of the event-handler.
            * @memberof componyx.library.Event#
            * @function
            */
            add: function (handler, args, fireOnce)
            {
                return $.on(this, this.eventName, handler, args, null, null, fireOnce);
            },

            /** Checks if the event handler is attached.
            * @param {Function} handler The event handler to check.
            * @returns {Boolean} A value indicating if the handler is already present on the event.
            * @memberof componyx.library.Event#
            * @function
            */
            has: function (handler)
            {
                let eventName = this.eventName.toLowerCase(),
                    hasHandler = false;

                if (this[eventName + '_'])
                    hasHandler = $.has(this, eventName + '_', handler);

                if (!hasHandler && this[eventName])
                    hasHandler = $.has(this, eventName, handler);

                return hasHandler;
            },

            /** Removes an event handler for the event.
            * @param {Function} handler Callback method to invoke when the event fires.
            * @memberof componyx.library.Event#
            * @function
            */
            remove: function (handler)
            {
                var eventName = this.eventName.toLowerCase();

                if (this[eventName + '_'])
                    $.off(this, eventName + '_', handler);

                if (this[eventName])
                    $.off(this, eventName, handler);
            },

            /** 
            * Removes all event handlers for the event.
            * @memberof componyx.library.Event#
            * @function
            */
            removeAll: function ()
            {
                var eventName = this.eventName.toLowerCase();

                if (this[eventName])
                    $.off(this, eventName);
            },

            /**
            * Disables the event until the current call stack is finished by using a setTimeout() call.
            * @memberof componyx.library.Event#
            * @param {boolean} [priorityHandler=false] Indicates whether to disable the priority handler instead of the main handler. 
            * This should generally remain false when called by client code directly. Only set to true internally within a component to disable the prioritized handler.
            * @function
            */
            disable: function (priorityHandler = false)
            {
                var _ = this;

                if (priorityHandler)
                    _.__priorityDisabled = true;
                else
                    _.__disabled = true;

                clearTimeout(_.__disabledTimerId);
                _.__disabledTimerId = setTimeout(function () { _.__disabled = null; }, 0);
            },

            /**
            * Re-enables disabled events directly.
            * @memberof componyx.library.Event#
            * @param {boolean} [priorityHandler=false] Indicates whether to enable the disabled priority handler instead of the main handler. 
            * This should generally remain false when called by client code directly. Only set to true internally within a component to disable the prioritized handler.
            * @function
            */
            enable: function (priorityHandler = false)
            {
                var _ = this;
                clearTimeout(_.__disabledTimerId);

                if (priorityHandler)
                    _.__priorityDisabled = false;
                else
                    _.__disabled = false;
            },

            /** Adds an event handler with priority. This method should not be invoked by client code directly but only from inside component code. Priority handlers should only be used within a framework where the internal handler should be called before anything else.
            * @param {Function} handler Callback method to invoke when the event fires.
            * @param {Object[]} [args] Arguments to pass to the specified event handler when the event fires.
            * @param {Boolean} [fireOnce] A value indicating if the handler will fire only once which means that the handler is removed from the event directly after execution.
            * @memberof componyx.library.Event#
            * @function
            * @protected
            */
            priorityAdd: function (handler, args, fireOnce)
            {
                return $.on(this, this.eventName + '_', handler, args, null, null, fireOnce);
            },

            /** 
            * Removes all event handlers for the event. This method should not be invoked by client code directly but only from inside component code.
            * @param {Number} [eventPriority] The priority of the events to remove, null/0 for both normal and priority events, 1 for normal events only, 2 for priority events only.
            * @memberof componyx.library.Event#
            * @function
            * @protected
            */
            priorityRemove: function (eventPriority)
            {
                var eventName = this.eventName.toLowerCase();

                if ((!eventPriority || eventPriority == 2) && this[eventName + '_'])
                    $.off(this, eventName + '_');

                if ((!eventPriority || eventPriority == 1) && this[eventName])
                    $.off(this, eventName);
            },

            /** Fires the event. This method should not be invoked by client code directly but only from inside component code.
            * @param {Object} context The context (this) for which the method is invoked.
            * @param {Object[]} arguments A list of arguments to pass to the event handlers.
            * @memberof componyx.library.Event#
            * @function
            */
            fire: function (context, args)
            {
                const eventName = this.eventName.toLowerCase(),
                    win = $.defaultView($.getDocument()),
                    PromiseCtor = win.Promise || Promise;

                let priorityResult, mainResult;
                let results = [];

                if ($.isEmpty(args))
                    args = [];

                if (!$.isArray(args))
                    args = [args]; // single argument

                if (!this.__priorityDisabled && this[eventName + '_'])
                {
                    priorityResult = this[eventName + '_'].apply(context, args);
                    if (priorityResult !== undefined)
                    {
                        results.push(priorityResult);
                    }
                }

                // Skip main event if disabled
                if (!this.__disabled && this[eventName])
                {
                    mainResult = this[eventName].apply(context, args);
                    if (mainResult !== undefined)
                    {
                        results.push(mainResult);
                    }
                }

                const promises = results.filter(r => r instanceof PromiseCtor);
                if (promises.length > 0)
                {
                    return Promise.all(promises).then(() => undefined);
                }

                return mainResult !== undefined ? mainResult : priorityResult;
            },

            /** Checks if a handler is bound.
            * @returns {Boolean} A value indicating if a handler is bound to the event.
            * @memberof componyx.library.Event#
            * @function
            * @protected
            */
            isBound: function ()
            {
                var eventName = this.eventName.toLowerCase();
                return (this[eventName + '_'] || this[eventName]);
            },

            /** Gets all bound event handlers.
            * @returns {Object} A list of bound handlers.
            * @memberof componyx.library.Event#
            * @function
            * @protected
            */
            handlers: function ()
            {
                if (!this.__events)
                    return null;

                return this.__events[this.eventName.toLowerCase()];
            },

            /** Gets all bound priority event handlers.
            * @returns {Object} A list of bound handlers.
            * @memberof componyx.library.Event#
            * @function
            * @protected
            */
            priorityHandlers: function ()
            {
                if (!this.__events)
                    return null;

                return this.__events[this.eventName.toLowerCase() + '_'];
            }
        },

        _createObject = (typeof Object.create !== 'function') ? function (o) { function F() { }; F.prototype = o; return new F(); } : Object.create,

        _clone = function (config)
        {
            const isPlain = $.isPlainObject(config.source),
                isArray = $.isArray(config.source);

            // do not clone when: the source and the target are the same or the source is not a plain object
            if (!config.source || config.source === config.target)
                return config.target;
            else if ((!isPlain && !isArray) || Object.isFrozen(config.source))
                return config.source; // return reference for non-plain or frozen objects

            // return reference from visited/excluded objects
            for (var index = 0; index < config.exclude.length; ++index)
            {
                if (config.exclude[index][0] === config.source)
                {
                    return config.exclude[index][1];
                }
            }

            let typeName = null;
            if (isPlain && config.types)
            {
                if (!config.typeCheck || config.typeCheck === "constructor")
                    typeName = config.source.constructor && config.source.constructor.name;
                else
                    typeName = config.source[config.typeCheck];
            }

            // use native clone for special objects (Date, Map, Set, Blob, etc.)
            if (typeof config.source === 'object' && !isPlain && !isArray && !(config.source.constructor !== Object && config.types && (config.types[typeName])))
            {
                try
                {
                    const cloned = structuredClone(config.source);
                    config.exclude.push([config.source, cloned]);
                    return cloned; // safe to return
                }
                catch
                {
                    return config.source; // fallback to reference if structuredClone fails
                }
            }

            if (typeof config.source === 'object')
            {
                if (isArray)
                {
                    config.target = $.isArray(config.target) ? config.target : [];
                }
                else if (typeName && config.types && config.types[typeName])
                {
                    const TypeCtor = config.types[typeName] || config.source.constructor;
                    config.target = config.target || new TypeCtor();
                }
                else
                {
                    config.target = (!config.target || 'function object'.indexOf(typeof (config.target)) == -1) ? {} : config.target;
                }
            }

            // keep track of visited objects to avoid circular reference
            config.exclude.push([config.source, config.target]);

            $.each(config.source, function (item, key)
            {
                let type = typeof (item),
                    target = config.target[key],
                    targetType = typeof (target),
                    isDeepObject = config.deep &&
                        item && typeof item === 'object' &&
                        target && typeof target === 'object' &&
                        ($.isPlainObject(item) || $.isArray(item));

                if ((config.omit.has(key)) || (type == 'undefined') ||
                    (targetType == 'undefined' && !config.extend) ||
                    (config.excludeFunctions && type === 'function') ||
                    (targetType != 'undefined' && config.overwrite == 0 && !isDeepObject) ||
                    (!$.isEmpty(target) && config.overwrite != 1 && !isDeepObject) ||
                    ($.isEmpty(config.source[key]) && (config.excludeEmpty == 1 || (config.excludeEmpty == 2 && $.isPlainObject(target)))))
                    return;

                let convertFn = config.converter[key];

                if (convertFn)
                {
                    config.target[key] = convertFn(item, key, config.target);
                    if (config.report)
                        config.report.changed = true;
                }
                else if (config.deep && ($.isPlainObject(item) || $.isArray(item) || (typeof item === 'object' && item !== null)))
                {
                    const newConfig = Object.create(config); // inherit defaults
                    newConfig.target = config.target[key];
                    newConfig.source = item;
                    newConfig.exclude = config.exclude.slice(); // fresh copy for this branch
                    config.target[key] = _clone(newConfig);
                }
                else
                {
                    if (config.report && config.target[key] !== item)
                    {
                        config.target[key] = item;
                        config.report.changed = true;
                    }
                    else if (!config.report)
                        config.target[key] = item;
                }
            });

            return config.target;
        },

        _path = function (items, recursionKey, comparer, scalar)
        {
            var result = [], paths = [];

            comparer = comparer || function () { return true; };
            scalar = (scalar != undefined) ? scalar : false;
            path(items, []);

            for (var index = 0; index < result.length; index++)
            {
                paths.push(new Path(items, recursionKey, result[index][0], result[index][1]));
            }

            return (scalar) ? paths[0] : paths;
            function path(items, tree)
            {
                var index = -1, item, children, stop;

                while (++index < items.length && !stop)
                {
                    item = items[index];

                    if (comparer(item))
                    {
                        result.push([tree.concat(index), item]);

                        if (scalar)
                            stop = true;
                    }
                    else
                    {
                        children = _path.children(item, recursionKey);

                        if (children && $.isArray(children))
                        {
                            path(children, tree.concat(index));
                        }
                    }
                }
            }
        };

    _path.children = function (item, recursionKey)
    {
        if (!recursionKey)
            return null;

        var index = -1, keys = recursionKey.split(".");

        if (keys.length == 1)
            return item[keys[0]];

        while (++index < keys.length)
        {
            item = item[keys[index]];
        }

        return item;
    };

    _path.getItem = function (items, tree, recursionKey)
    {
        var level = tree.length - 1, curLevel = -1, item;

        if (level < 0)
            level = 0;

        while (++curLevel <= level)
        {
            item = items[tree[curLevel]];
            items = _path.children(item, recursionKey);
        }

        return item;
    };

    /**
    * Path class for navigating recursive data arrays.
    * @class
    * @param {Object[]} items An array of items.
    * @param {String} recursionKey The object key which points to the child items array. Separate object keys with a dot "." to denote a deeper level.
    * @param {string[]} tree The tree path of the current item.
    * @param {Object} item Current item.
    * @property {Array} items The array containing all the items.
    * @property {String} recursionKey The object key that points to the child items.
    * @property {Object} item The current item.
    * @property {Array} children The child items of the current item.
    * @property {Array} tree The tree path of the current item.
    * @property {Number} index The index of the current item.
    * @property {Array} startTree The start tree of the path.
    * @memberof componyx.library
    */
    let Path = function (items, recursionKey, tree, item)
    {
        this.items = items;
        this.recursionKey = recursionKey;
        this.item = item;
        this.children = _path.children(this.item, this.recursionKey);
        this.tree = tree;
        this.index = tree[tree.length - 1];
        this.startTree = tree.slice();
    };

    Path.prototype =
    {
        /** 
        * Creates a new Path object instance with the current tree position.
        * @returns {Path} The new Path instance.
        */
        create: function ()
        {
            return new Path(this.items, this.recursionKey, this.tree.slice(0), this.item);
        },
        /** 
        * Navigates to the starting item.
        * @returns {Path} The current Path instance.
        */
        start: function ()
        {
            this.tree = this.startTree.slice();
            this.index = this.tree[this.tree.length - 1];
            this.item = _path.getItem(this.items, this.tree, this.recursionKey);
            this.children = _path.children(this.item, this.recursionKey);
            return this;
        },
        /** 
        * Navigates to the root item.
        * @returns {Path} The current Path instance.
        */
        root: function ()
        {
            this.tree = [this.tree[0]];
            this.index = this.tree[0];
            this.item = this.items[this.index];
            this.children = _path.children(this.item, this.recursionKey);
            return this;
        },
        /** 
        * Checks if the current item has a parent item.
        * @returns {Boolean} A value indicating if the current item has a parent item.
        */
        hasParent: function ()
        {
            return (this.tree.length > 1);
        },
        /** 
        * Navigates to the parent item.
        * @returns {Path} The current Path instance.
        */
        parent: function ()
        {
            if (this.tree.length == 1)
                return this;

            this.tree.pop();
            this.index = this.tree[this.tree.length - 1];
            this.item = _path.getItem(this.items, this.tree, this.recursionKey);
            this.children = _path.children(this.item, this.recursionKey);
            return this;
        },
        /** 
        * Navigates to the first item on the current level.
        * @returns {Path} The current Path instance.
        */
        first: function ()
        {
            this.index = 0;
            this.tree[this.tree.length - 1] = this.index;
            this.item = _path.getItem(this.items, this.tree, this.recursionKey);
            this.children = _path.children(this.item, this.recursionKey);
            return this;
        },
        /** 
        * Navigates to the last item on the current level.
        * @returns {Path} The current Path instance.
        */
        last: function ()
        {
            this.index = this.length() - 1;
            this.tree[this.tree.length - 1] = this.index;
            this.item = _path.getItem(this.items, this.tree, this.recursionKey);
            this.children = _path.children(this.item, this.recursionKey);
            return this;
        },
        /** 
        * Navigates to the previous item on the current level.
        * @returns {Path} The current Path instance.
        */
        previous: function ()
        {
            if (this.hasPrevious())
            {
                this.index--;
                this.tree[this.tree.length - 1] = this.index;
                this.item = _path.getItem(this.items, this.tree, this.recursionKey);
                this.children = _path.children(this.item, this.recursionKey);
            }
            return this;
        },
        /** 
        * Navigates to the next item on the current level.
        * @returns {Path} The current Path instance.
        */
        next: function ()
        {
            if (this.hasNext())
            {
                this.index++;
                this.tree[this.tree.length - 1] = this.index;
                this.item = _path.getItem(this.items, this.tree, this.recursionKey);
                this.children = _path.children(this.item, this.recursionKey);
            }
            return this;
        },
        /** 
        * Navigates to the item with the specified index on the current level.
        * @returns {Path} The current Path instance.
        */
        sibling: function (index)
        {
            this.index = index;
            this.tree[this.tree.length - 1] = this.index;
            this.item = _path.getItem(this.items, this.tree, this.recursionKey);
            this.children = _path.children(this.item, this.recursionKey);
            return this;

        },
        /** 
        * Navigates to the child item with the specified index.
        * @returns {Path} The current Path instance.
        */
        child: function (index)
        {
            if (!Array.isArray(this.children) || (index < 0 || index >= this.children.length))
                return this;

            this.index = index;
            this.tree.push(index);
            this.item = _path.getItem(this.items, this.tree, this.recursionKey);
            this.children = _path.children(this.item, this.recursionKey);
            return this;
        },
        /** 
        * Navigates to the first child item.
        * @returns {Path} The current Path instance.
        */
        firstChild: function ()
        {
            return this.child(0);
        },
        /** 
        * Navigates to the last child item.
        * @returns {Path} The current Path instance.
        */
        lastChild: function ()
        {
            return this.child(this.children?.length - 1);
        },
        /**
        * Checks if we can move to a next item from the current index in the active list.
        * @returns {Boolean} A value indicating if there is a next item.
        */
        hasNext: function ()
        {
            return this.index + 1 < this.length();
        },
        /**
        * Checks if we can move to a previous item from the current index in the active list.
        * @returns {Boolean} A value indicating if there is a previous item.
        */
        hasPrevious: function ()
        {
            return this.index - 1 >= 0;
        },
        /** 
        * Returns the length of the items array at the current level.
        * @returns {Number} The length of the items array.
        */
        length: function ()
        {
            if (this.hasParent())
                return this.create().parent().children.length;
            else
                return this.items.length;
        },
        /** 
        * Iterates through the items in the array and evaluates each object against the specified comparer function.
        * The iteration is called recursively when the recursionKey is found on an object.
        * @param {function} comparer The comparer method.
        * @param {boolean} scalar A value indicating if only the first path is returned.
        * @returns {Path} A new instance of the Path object.
        */
        path: function (comparer, scalar)
        {
            return _path(this.items, this.recursionKey, comparer, scalar);
        }
    };

    /**
    * Animation class.
    * @class
    * @memberof componyx.library
    * @property {String} id The unique id of the animation.
    * @property {HTMLElement[]} e The elements involved in the animation.
    * @property {Object} p The element properties that will be animated.
    * @property {Object} s The settings of the animation.
    * @property {Number} startTime The start time of the animation.
    * @property {Array} elapsedTime The elapsed time of the animation.
    * @property {Boolean} isReverse A value indicating if the animation is being played backwards.
    * @property {Number} state The current animation state: STARTED: 0, PLAYING: 1, PAUSED: 2, COMPLETED: 3, STOPPED: 4
    */
    Animation = function (elements, properties, settings)
    {

        this.id = $.guid();
        this.e = elements;
        this.p = properties;
        this.s = settings;
        this.startTime = null;
        this.elapsedTime = null;
        this.isReverse = false;
        this.state = 0;
        this.display = {};
        this.cache = {};
        this.kill = false;

        // call the update on initialization
        this.update();
    };

    Animation.prototype =
    {
        /** 
        * Starts the animation.
        */
        start: function ()
        {
            _animation.active[this.id] = this;
            this.startTime = null;
            this.state = _animation.State.STARTED;
            this.isReverse = false;
            _animation.run(this);
        },

        /** 
        * Plays/continues the animation if it is not yet playing.
        */
        play: function ()
        {


            if (this.state == _animation.State.PLAYING)
                return;

            // sync new start time with current time
            if (this.state == _animation.State.PAUSED && this.elapsedTime)
                this.startTime = new Date().getTime() - this.elapsedTime;

            this.state = _animation.State.PLAYING;
            _animation.run(this);
        },

        /** 
        * Pauses the animation.
        */
        pause: function ()
        {
            this.state = _animation.State.PAUSED;
            this.update();
        },

        /** 
        * Completes the animation by skipping to the final frame.
        */
        complete: function ()
        {
            this.startTime = null;
            this.state = _animation.State.COMPLETED;
            _animation.run(this);
        },

        /** 
        * Stops the animation.
        */
        stop: function ()
        {


            this.startTime = null;
            this.state = _animation.State.STOPPED;

            if (this.s.onStop)
                this.s.onStop();
        },

        /** 
        * Plays the animation backwards.
        */
        reverse: function ()
        {


            this.startTime = null;
            this.state = _animation.State.STARTED;
            this.isReverse = true;
            this.update();
            _animation.run(this);
        },

        /** 
        * Kills the animation.
        */
        kill: function ()
        {


            if (!_animation.timerId)
                _animation.kill(this.id);
            else
                this.kill = true;
        },

        /** 
        * Updates a frame in the animation.
        */
        update: function ()
        {
            var unitRegExp = _animation.unitRegExp,
                relativeRegExp = _animation.relativeRegExp,
                eIndex, index,
                settings, element, property, properties, c, d, key, fromUnit, styleValue, tempIndex, tempValue,
                valString, fromValue, toValue, changeValue, value, color, isRelative, isMinus,
                now = new Date().getTime();

            if (this.startTime === null)
                this.startTime = now;

            this.elapsedTime = now - this.startTime;

            if (this.elapsedTime >= this.s.duration)
                this.state = _animation.State.COMPLETED;

            for (eIndex = 0; this.e[eIndex]; ++eIndex) // iterates through elements
            {
                element = this.e[eIndex];
                properties = (this.p.length > eIndex) ? this.p[eIndex] : this.p[this.p.length - 1];
                d = this.display[eIndex.toString()] = {};

                for (property in properties)
                {
                    unitRegExp.lastIndex = relativeRegExp.lastIndex = 0;
                    key = eIndex.toString() + '_' + property;
                    c = null;
                    fromValue = toValue = '';
                    isRelative = isMinus = false;

                    if (!(c = this.cache[key]))
                    {
                        if ($.isArray(properties[property])) // [value, settings]
                        {
                            valString = properties[property][0].toString();
                            settings = properties[property][1];
                            settings = (typeof settings == 'number') ? { duration: settings } : settings || {};

                            if (typeof settings.easing == 'undefined')
                                settings.easing = this.s.easing;
                            if (typeof settings.duration == 'undefined')
                                settings.duration = this.s.duration;
                            if (typeof settings.easeBackOvershoot == 'undefined')
                                settings.easeBackOvershoot = this.s.easeBackOvershoot;
                        }
                        else
                        {
                            valString = properties[property].toString();
                            settings = this.s;
                        }

                        c = this.cache[key] = {};
                        c.settings = settings;
                        c.name = (property.indexOf("-") === -1) ? property : property.replace(_cssPropRegExp, function (match) { return match.substring(1).toUpperCase() })
                        c.isStyle = (element.style[c.name] != undefined || c.name == 'opacity');
                        c.isSize = (c.name.indexOf('width') > -1 || c.name.indexOf('height') > -1);

                        if (c.name == 'opacity')
                            fromValue = _getOpacity(element);
                        else
                            fromValue = (c.isStyle) ? $.styleValue(element, c.name) : element[c.name];

                        if (property == 'display' || property == 'visibility')
                            d['end_' + property] = valString;
                        else if (toValue = _animation.getColor(valString.replace(relativeRegExp, '')))
                        {
                            if (relativeRegExp.test(valString))
                            {
                                isRelative = true;

                                if (valString.indexOf("-") === 0)
                                    isMinus = true;
                            }

                            changeValue = { red: 0, green: 0, blue: 0, alpha: null };
                            fromValue = _animation.getColor(fromValue) || { red: 0, green: 0, blue: 0, alpha: null };

                            for (color in changeValue)
                            {
                                if (toValue[color] != null)
                                {
                                    changeValue[color] = toValue[color] - fromValue[color];

                                    if (isRelative)
                                        changeValue[color] = (isMinus) ? toValue[color] * -1 : toValue[color];
                                }
                            }

                            c.color = true;
                            c.fromValue = fromValue;
                            c.changeValue = changeValue;
                        }
                        else
                        {
                            c.fromValue = [];
                            c.unit = [];
                            c.changeValue = [];

                            fromValue = fromValue.toString().split(' ');
                            toValue = valString.split(' ');

                            for (index = 0; toValue[index] != undefined; ++index)
                            {
                                isRelative = isMinus = false;

                                if (relativeRegExp.test(toValue[index].toString()))
                                {
                                    isRelative = true;

                                    if (toValue[index].indexOf("-") === 0)
                                        isMinus = true;

                                    toValue[index] = toValue[index].toString().replace(relativeRegExp, '') || 0;
                                }

                                if (unitRegExp.test($.trim(toValue.toString())))
                                {
                                    c.unit[index] = toValue[index].toString().replace(unitRegExp, '');

                                    if (unitRegExp.test($.trim(fromValue[index].toString())))
                                    {
                                        fromUnit = fromValue[index].toString().replace(unitRegExp, '');

                                        if (c.isStyle && c.unit[index] != fromUnit)
                                        {
                                            // unit mismatch, convert to same unit (pixels)
                                            styleValue = element.style[c.name];
                                            tempValue = [];

                                            for (tempIndex = 0; tempIndex < index; ++tempIndex)
                                            {
                                                tempValue.push(tempIndex + 1 + 'px'); // trick to create unique values so that when we retrieve the computed value below we get the same amount of values
                                            }

                                            element.style[c.name] = $.trim(tempValue.join(' ') + ' ' + toValue[index]);
                                            tempValue = $.styleValue(element, c.name, true);
                                            element.style[c.name] = styleValue; // reset temp value

                                            toValue[index] = (index) ? tempValue.split(' ')[index] : tempValue;
                                            c.unit[index] = fromUnit; // force to unit returned from computed style
                                        }


                                        fromValue[index] = parseFloat(fromValue[index]);
                                    }
                                    else
                                    {
                                        fromValue[index] = 0;
                                    }

                                    c.unit[index] = c.unit[index] || fromUnit;
                                    c.fromValue[index] = fromValue[index];
                                    toValue[index] = parseFloat(toValue[index]);

                                    if (isRelative)
                                        c.changeValue[index] = (isMinus) ? toValue[index] * -1 : toValue[index];
                                    else
                                        c.changeValue[index] = toValue[index] - fromValue[index];

                                    if (c.name !== 'opacity')
                                        c.unit[index] = c.unit[index] || 'px';
                                }
                            }
                        }
                    }

                    if (c.unit)
                    {
                        value = [];

                        for (index = 0; c.fromValue[index] != undefined; ++index)
                        {
                            value[index] = _animation.setValue(c.fromValue[index], c.changeValue[index], this, c.settings);

                            if (c.unit[index] === 'px')
                                value[index] = Math.round(value[index]);

                            if (value[index] < 0 && c.isSize)
                                value[index] = 0;

                            if (c.isStyle && c.name !== 'opacity')
                                value[index] += c.unit[index] || '';
                        }

                        if (c.isStyle)
                        {
                            if (c.name === 'opacity')
                                _setOpacity(element, value.join(''));
                            else
                                element.style[c.name] = value.join(' ');
                        }
                        else
                            element[c.name] = value.join(' ');
                    }
                    else if (c.color)
                    {
                        value = { red: 0, green: 0, blue: 0, alpha: null };
                        fromValue = { red: c.fromValue.red, green: c.fromValue.green, blue: c.fromValue.blue, alpha: c.fromValue.alpha };
                        changeValue = { red: c.changeValue.red, green: c.changeValue.green, blue: c.changeValue.blue, alpha: c.changeValue.alpha };

                        for (color in value)
                        {
                            if (changeValue[color] != null)
                            {
                                value[color] = _animation.setValue(fromValue[color], changeValue[color], this, c.settings);

                                if (color != 'alpha')
                                    value[color] = Math.ceil(value[color]);

                                if (value[color] < 0)
                                    value[color] = 0;

                                if (value[color] > 255)
                                    value[color] = 255;
                            }
                        }

                        if (value.alpha != null)
                            value = 'rgba(' + value.red + ',' + value.green + ',' + value.blue + ',' + value.alpha + ')';
                        else
                            value = 'rgb(' + value.red + ',' + value.green + ',' + value.blue + ')';

                        if (c.isStyle)
                            element.style[c.name] = value;
                        else
                            element[c.name] = value;
                    }
                }

                if (this.state == _animation.State.STARTED || this.state == _animation.State.COMPLETED)
                {
                    if (this.state == _animation.State.STARTED)
                    {
                        if (!this.isReverse)
                        {
                            d['start_visibility'] = $.styleValue(element, 'visibility');
                            d['start_display'] = $.styleValue(element, 'display');
                        }

                        // always make the element visible at the start of an animation
                        if (element.style.display == 'none')
                            element.style.display = '';

                        element.style['visibility'] = ($.styleValue(element, 'visibility') == 'hidden') ? 'visible' : element.style['visibility'];
                        element.style['display'] = ($.styleValue(element, 'display') == 'none') ? $.defaultDisplay(element.nodeName) : element.style['display'];
                    }

                    // set the desired visibility or display on the element at the end of an animation
                    if (this.state == _animation.State.COMPLETED && (d['start_visibility'] || d['start_display'] || d['end_visibility'] || d['end_display']))
                    {
                        if (this.isReverse)
                        {
                            element.style.visibility = (d['start_visibility']) ? d['start_visibility'] : element.style.visibility;
                            element.style.display = (d['start_display']) ? d['start_display'] : element.style.display;
                        }
                        else
                        {
                            element.style.visibility = (d['end_visibility']) ? d['end_visibility'] : element.style.visibility;
                            element.style.display = (d['end_display']) ? d['end_display'] : element.style.display;
                        }
                    }
                }
            }

            if (this.state == _animation.State.STARTED)
                this.state = _animation.State.PLAYING;
        }
    };

    _animation =
    {
        State: { STARTED: 0, PLAYING: 1, PAUSED: 2, COMPLETED: 3, STOPPED: 4 },
        unitRegExp: /^([-+]?[0-9]*\.?[0-9]+)/,
        relativeRegExp: /^[+|-][=]/g,
        hexColorRegExp: /^[#]([0-9a-fA-F]{3}$|[0-9a-fA-F]{6}$)/g,
        rgbColorRegExp: /^rgb/gi,
        active: {},
        timerId: null,
        requestAnimationFrame: function (callback, interval)
        {
            return (_requestFrame) ? _requestFrame(callback) : setInterval(callback, interval);
        },
        cancelAnimationFrame: function (id)
        {
            (_cancelFrame) ? _cancelFrame(id) : clearInterval(id);
        },
        ease:
        {
            linear: function (t, d, b, c)
            {
                return b + ((t / d) * c);
            },
            easeInQuad: function (t, d, b, c)
            {
                return _animation.ease.easeInPoly(t, d, b, c);
            },
            easeOutQuad: function (t, d, b, c)
            {
                return _animation.ease.easeOutPoly(t, d, b, c);
            },
            easeInOutQuad: function (t, d, b, c)
            {
                return _animation.ease.easeInOutPoly(t, d, b, c);
            },
            easeInCubic: function (t, d, b, c)
            {
                return _animation.ease.easeInPoly(t, d, b, c, 2);
            },
            easeOutCubic: function (t, d, b, c)
            {
                return _animation.ease.easeOutPoly(t, d, b, c, 2);
            },
            easeInOutCubic: function (t, d, b, c)
            {
                return _animation.ease.easeInOutPoly(t, d, b, c, 2);
            },
            easeInQuart: function (t, d, b, c)
            {
                return _animation.ease.easeInPoly(t, d, b, c, 3);
            },
            easeOutQuart: function (t, d, b, c)
            {
                return _animation.ease.easeOutPoly(t, d, b, c, 3);
            },
            easeInOutQuart: function (t, d, b, c)
            {
                return _animation.ease.easeInOutPoly(t, d, b, c, 3);
            },
            easeInQuint: function (t, d, b, c)
            {
                return _animation.ease.easeInPoly(t, d, b, c, 4);
            },
            easeOutQuint: function (t, d, b, c)
            {
                return _animation.ease.easeOutPoly(t, d, b, c, 4);
            },
            easeInOutQuint: function (t, d, b, c)
            {
                return _animation.ease.easeInOutPoly(t, d, b, c, 4);
            },
            easeInPoly: function (t, d, b, c, p)
            {
                var progress = t / d;
                p = p || 1;
                return b + ((progress * (Math.pow(progress, p))) * c);
            },
            easeOutPoly: function (t, d, b, c, p)
            {
                var progress = 1 - (t / d);
                p = p || 1;
                var percentage = 1 - (1 * progress * (Math.pow(progress, p)));
                return b + (percentage * c);
            },
            easeInOutPoly: function (t, d, b, c, p)
            {
                if (t / (d / 2) < 1)
                {
                    return _animation.ease.easeInPoly(t, d / 2, b, c / 2, p);
                }
                else
                {
                    return _animation.ease.easeOutPoly(t - (d / 2), d / 2, b + (c / 2), c / 2, p);
                }
            },
            easeInSine: function (t, d, b, c)
            {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOutSine: function (t, d, b, c)
            {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOutSine: function (t, d, b, c)
            {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            },
            easeInExpo: function (t, d, b, c)
            {
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOutExpo: function (t, d, b, c)
            {
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOutExpo: function (t, d, b, c)
            {
                if (t == 0) return b;
                if (t == d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            },
            easeInCirc: function (t, d, b, c)
            {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOutCirc: function (t, d, b, c)
            {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOutCirc: function (t, d, b, c)
            {
                if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            },
            easeInElastic: function (t, d, b, c)
            {
                var s = 1.70158; var p = 0; var a = c;
                if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
                if (a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOutElastic: function (t, d, b, c)
            {
                var s = 1.70158; var p = 0; var a = c;
                if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
                if (a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
            },
            easeInOutElastic: function (t, d, b, c)
            {
                var s = 1.70158; var p = 0; var a = c;
                if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
                if (a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            },
            easeInBack: function (t, d, b, c, s)
            {
                if (s == undefined || s == null) s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOutBack: function (t, d, b, c, s)
            {
                if (s == undefined || s == null) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOutBack: function (t, d, b, c, s)
            {
                if (s == undefined || s == null) s = 1.70158;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            },
            easeInBounce: function (t, d, b, c)
            {
                return c - _animation.ease.easeOutBounce(d - t, d, 0, c) + b;
            },
            easeOutBounce: function (t, d, b, c)
            {
                if ((t /= d) < (1 / 2.75))
                {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75))
                {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75))
                {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else
                {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOutBounce: function (t, d, b, c)
            {
                if (t < d / 2) return _animation.ease.easeInBounce(t * 2, d, 0, c) * .5 + b;
                return _animation.ease.easeOutBounce(t * 2 - d, d, 0, c) * .5 + c * .5 + b;
            }
        },
        start: function (elements, properties, settings)
        {
            var animation;

            elements = ($.isArray(elements)) ? elements : [elements];
            properties = ($.isArray(properties)) ? properties : [properties];
            settings = (typeof settings == 'number') ? { duration: settings } : settings || {};

            settings =
            {
                duration: (typeof settings.duration != 'undefined') ? settings.duration || 0 : $.animationSettings.duration,
                easing: settings.easing || $.animationSettings.easing,
                easeBackOvershoot: (!$.isEmpty(settings.easeBackOvershoot)) ? settings.easeBackOvershoot : $.animationSettings.easeBackOvershoot,
                onFrame: (typeof settings.onFrame != 'undefined') ? settings.onFrame : $.animationSettings.onFrame,
                onStop: (typeof settings.onStop != 'undefined') ? settings.onStop : $.animationSettings.onStop,
                onComplete: (typeof settings.onComplete != 'undefined') ? settings.onComplete : $.animationSettings.onComplete
            }

            animation = new Animation(elements, properties, settings);
            _animation.active[animation.id] = animation;

            if (!_animation.timerId)
                _animation.timerId = _animation.requestAnimationFrame(_animation.update, $.animationSettings.interval);

            return animation;
        },
        run: function (animation)
        {
            animation.update();

            if (animation.state == _animation.State.COMPLETED)
            {
                if (animation.s.onComplete)
                    animation.s.onComplete();

                if (!_animation.timerId)
                    _animation.kill(animation.id); // kill directly when animation update loop is inactive
                else
                    animation.kill = true; // kill this animation in next update
            }
            else if (!_animation.timerId)
            {
                _animation.active[animation.id] = animation;
                _animation.timerId = _animation.requestAnimationFrame(_animation.update, $.animationSettings.interval); // start animation update loop
            }
        },
        kill: function (id)
        {
            _animation.active[id] = null;
            delete _animation.active[id];
        },
        update: function ()
        {
            var id, animation, handlers = [], kill = [], index, len;

            if ($.isEmpty(_animation.active))
            {
                _animation.cancelAnimationFrame(_animation.timerId);
                _animation.timerId = null;
                return;
            }
            else
            {
                for (id in _animation.active) // main loop, iterates through active animations
                {
                    animation = _animation.active[id];

                    if (animation.state == _animation.State.PLAYING)
                    {
                        animation.update();

                        if (animation.s.onFrame)
                            handlers.push(animation.s.onFrame);
                    }

                    if (!animation.kill && animation.state == _animation.State.COMPLETED)
                    {
                        if (animation.s.onComplete)
                            handlers.push(animation.s.onComplete);

                        animation.kill = true;
                    }

                    if (animation.kill)
                        kill.push(animation.id);
                }
            }

            for (index = 0; index < handlers.length; ++index)
            {
                handlers[index]();
            }

            for (index = 0; index < kill.length; ++index)
            {
                _animation.kill(kill[index]);
            }

            if (_requestFrame)
                _animation.timerId = _animation.requestAnimationFrame(_animation.update, $.animationSettings.interval);
        },
        setValue: function (fromValue, changeValue, animation, settings)
        {
            var value;

            if (animation.isReverse)
            {
                fromValue += changeValue;
                changeValue = changeValue * -1;
            }

            // property duration can differ from animation duration
            if (animation.state == _animation.State.COMPLETED || animation.elapsedTime >= settings.duration)
                value = fromValue + changeValue;
            else
            {
                value = _animation.ease[settings.easing](animation.elapsedTime, settings.duration, fromValue, changeValue, settings.easeBackOvershoot);

                if ((changeValue > 0 && value > (fromValue + changeValue)) || (changeValue < 0 && value < (fromValue + changeValue)))
                    value = fromValue + changeValue;
            }

            return value;
        },
        getColor: function (value)
        {
            if (typeof (value) != 'string')
                return null;

            var hexColorRegExp = _animation.hexColorRegExp,
                rgbColorRegExp = _animation.rgbColorRegExp;

            hexColorRegExp.lastIndex = rgbColorRegExp.lastIndex = 0;

            if (hexColorRegExp.test(value))
            {
                var val = $.hexToRgb(value.substring(1));
                return { red: val[0], green: val[1], blue: val[2] }
            }
            else if (rgbColorRegExp.test(value))
            {
                var values = value.replace(/[^\d%,.]/g, '').split(',');

                var convert = function (value)
                {
                    if (/%$/g.test(value))
                    {
                        value = parseInt(value.replace('%', ''), 10);
                        return Math.ceil((value / 100) * 255);
                    }
                    else
                    {
                        return parseInt(value, 10);
                    }
                }

                var value =
                {
                    red: convert(values[0]),
                    green: convert(values[1]),
                    blue: convert(values[2]),
                    alpha: (values.length > 3) ? parseFloat(values[3]) : null
                }

                return value;
            }

            return null;
        }
    };

    /** 
    * @alias componyx.library
    * @class
    * Search the DOM with the specified selector.
    * Only the selector argument is required for an id search.
    * @param {Object} selector 
    *-  1: null: no filter apart from baseElement and tagName.
    *-  2: '#id': get single element by id.
    *-  3: 'class1 class2': get elements by class name(s), 
    *-  4: ['class1 class2', callback] get elements by class name(s) and use callback function to filter result.
    *-  5: callback function. 
    * The callback function accepts two arguments and returns true to include or false to exclude the element from the result array. 
    *     argument 1: The current element in the iteration.
    *     argument 2: A function reference to stop the iteraton when called. (optional)
    * 
    * @param {HTMLElement} baseElement Element from where to start searching or null to start at the document.
    * @param {String} tagName Name of tags to search or null to search all tags.
    * @param {Boolean} scalar A value indicating to return a single result which makes the iteration stop after a match (function or class selector only).
    * @param {Boolean} upwards A value indicating to iterate upwards through the DOM starting at the base element (does not work with class selectors).
    * @returns {HTMLElement[]} The element for an id or scalar search otherwise an array of elements (empty array when there is no result).
    * @property {HTMLElement} document The active document object.
    * @property {Boolean} touch A value indicating if we are dealing with a touch device.
    * @property {Event} event This variable will hold the last active HTML event object.
    * @property {WebSocket[]} webSockets This variable will hold the active WebSocket connections.
    */
    $ = function (selector, baseElement, tagName, scalar, upwards)
    {
        if (typeof (selector) === 'string' && !$.isEmpty(selector) && selector.indexOf('#') != 0)
            selector = [selector, null];

        if ($.isArray(selector))
        {
            return _getElementsByClassName(selector[0], baseElement, tagName, selector[1], scalar);
        }
        else if (!selector || typeof (selector) === 'function')
        {
            if (upwards)
                return _getParentElements(baseElement, tagName, selector, scalar);
            else
                return _getElements(baseElement, tagName, selector, scalar);
        }
        else
            return $.getDocument().getElementById(selector.substr(1));
    }

    componyx.library = window.$lib = $;
    $.getDocument = function () { return $.document || window.document };
    $.document = null;
    $.touch = _hasTouch;
    $.event = null;
    $.webSockets = [];

    /** Creates a class instance for binding and handeling events.
    * @param {String} eventName The name of the event.
    * @returns {Event} An object for handeling events.
    */
    $.createEvent = function (eventName)
    {
        var fn = function ()
        {
            this.eventName = eventName.toLowerCase();
        }
        fn.prototype = _eventBase;
        return new fn();
    }

    /** 
    * Global Animation settings.
    * @typedef {Object} componyx.library.animationSettings
    * @memberof componyx.library
    * @property {Number} duration The duration of the animation.
    * @property {Number} interval The interval of the update function.
    * @property {String} easing The animation easing setting.
    * @property {Number} easeBackOvershoot Defines the easeBackOvershoot value for the easeBack method.
    * @property {Function} onFrame A callback method which is called for every frame update.
    * @property {Function} onStop A callback method which is called when the animation is stopped
    * @property {Function} onComplete A callback method which is called when the animation is completed.
    */
    $.animationSettings =
    {
        duration: 1000,
        interval: 10,
        easing: 'linear',
        easeBackOvershoot: null,
        onFrame: null,
        onStop: null,
        onComplete: null
    }

    /** 
    * Generates a new unique id.
    * @returns {String} The generated id.
    */
    $.guid = function ()
    {
        _guid++;
        const now = Date.now(); // current time in milliseconds
        return `${now.toString(36)}${_guid.toString(36)}`;
    }

    /** 
    * Emulates a namespace by creating an object hierarchy for the specified namespace text.
    * @param {String} namespace Text with '.' separators as namespace.
    */
    $.registerNamespace = function (namespace)
    {
        var names = namespace.split('.'),
            root = window,
            name;

        for (var index = 0; index < names.length; ++index)
        {
            name = names[index];

            if (!root[name])
                root = root[name] = {};
            else
                root = root[name];
        }
    }

    /** Enables the element(s) within a specified zone to be selectable.
    * @param {componyx.library.SelectableSettings} settings The settings which configure the select behaviour.
    * @returns {componyx.library.SelectableController} An Object to control the selectable behaviour.
    */
    $.selectable = function (settings)
    {
        settings = settings || {};

        var _allowDrag, _dragging, _selection, _scrollX, _scrollY, _selectionDev, _flipX, _flipY, _dragZone,
            _startX, _startY, _lastX, _lastY, _startTop, _startLeft, _ctrlKey, _shiftKey, _docElement = $.scrollableRoot(),
            _nodeNames, _list = {}, _textSelection, _shiftUpwards,
            _scrollDirection, _scrollTimerId, _resizeTimerId, _selected = [], _deselected = [], _lastSelected = [],
            _scrollSpeedX = 0, _scrollSpeedY = 0, _lastScrollLeft = 0, _lastScrollTop = 0, _scrollbarSize = $.getScrollBarSize(),
            _bubble = true, _boundary, _maxScrollX, _maxScrollY, _lastEvent, _rafId,
            _selZone =
            {
                left: 0,
                top: 0,
                width: 0,
                height: 0
            },
            _ScrollDirectionOption =
            {
                LEFT: 1,
                RIGHT: 2,
                TOP: 4,
                BOTTOM: 8
            };

        var controller =
        {
            settings: settings,
            disabled: false,
            enable: function ()
            {
                var selectModeText = (settings.selectMode) ? settings.selectMode.toString().toLowerCase() : '';

                settings.shiftSelect = (settings.shiftSelect != undefined) ? settings.shiftSelect : true;
                settings.ctrlSelect = (settings.ctrlSelect != undefined) ? settings.ctrlSelect : true;
                settings.selectedClass = settings.selectedClass || 'selected';
                settings.dragZone = settings.dragZone || _docElement;
                settings.selectZone = settings.selectZone || settings.dragZone;

                _textSelection = $.textSelection(settings.dragZone);
                _dragZone = settings.dragZone;

                if (!settings.selectMode || selectModeText == 'drag_click')
                    settings.selectMode = 0;
                else if (selectModeText == 'drag')
                    settings.selectMode = 1;
                else if (selectModeText == 'click')
                    settings.selectMode = 2;

                if (!settings.selectMode || settings.selectMode == 2)
                    bind();

                if (settings.selectMode <= 1)
                {
                    $.on(window, 'resize', resize);
                    $.on($.getDocument(), 'pointerup', endDrag);
                    $.on($.getDocument(), 'pointerup', clearClick);
                    $.on($.getDocument(), 'pointermove', scheduleDrag);
                    $.on(settings.dragZone, 'pointerdown', startDrag);
                    $.on(settings.dragZone, 'dragstart', _stopEvent);
                }

                this.disabled = false;
                _allowDrag = false;
                return this;
            },
            disable: function ()
            {
                if (!settings.selectMode || settings.selectMode == 2)
                    unbind();

                if (settings.selectMode <= 1)
                {
                    $.off(window, 'resize', resize);
                    $.off($.getDocument(), 'pointerup', endDrag);
                    $.off($.getDocument(), 'pointerup', clearClick);
                    $.off($.getDocument(), 'pointermove', scheduleDrag);
                    $.off(settings.dragZone, 'pointerdown', startDrag);
                    $.off(settings.dragZone, 'dragstart', _stopEvent);
                }

                _allowDrag = false;
                this.disabled = true;
                return this;
            },
            update: function ()
            {
                this.disable();
                this.enable();
            },
            deselect: function (fireSelectEvent)
            {
                _selected = [];
                _deselected = [];

                for (var index = 0; index < _list.length; ++index)
                {
                    deselect(_list[index][0]);
                }

                if (settings.onSelect && fireSelectEvent !== false)
                    settings.onSelect(eventArgs());
            },
            select: function (fireSelectEvent)
            {
                _selected = [];
                _deselected = [];

                for (var index = 0; index < _list.length; ++index)
                {
                    select(_list[index][0]);
                }

                if (settings.onSelect && fireSelectEvent !== false)
                    settings.onSelect(eventArgs());
            },
            getSelectable: function ()
            {
                return _list;
            },
            getSelection: function ()
            {
                return getSelection();
            }
        }

        return controller.enable();

        // private methods
        function resize()
        {
            clearTimeout(_resizeTimerId);
            _resizeTimerId = setTimeout(function ()
            {
                unbind();
                bind();
            }, 0);
        }

        function bind()
        {
            getList();

            for (var index = 0; index < _list.length; ++index)
            {
                $.on(_list[index][0], 'click', toggleSelect);

                if (settings.selectMode <= 1)
                    $.on(_list[index][0], 'pointerup', cancelBubble);
            }
        }

        function unbind()
        {
            for (var index = 0; index < _list.length; ++index)
            {
                $.off(_list[index][0], 'click', toggleSelect);

                if (settings.selectMode <= 1)
                    $.off(_list[index][0], 'pointerup', cancelBubble);
            }
        }

        function getList()
        {
            var elList = getElements(), el,
                dragZone = settings.dragZone,
                scrollLeft = dragZone.scrollLeft,
                scrollTop = dragZone.scrollTop;

            // create new lists
            _list = [];
            _selected = [];

            dragZone.scrollLeft = 0;
            dragZone.scrollTop = 0;

            for (var index = 0; index < elList.length; ++index)
            {
                el = elList[index];
                _list[index] = [el, $.getPos(el)];
            }

            dragZone.scrollLeft = scrollLeft;
            dragZone.scrollTop = scrollTop;
        }

        function getElements()
        {
            if (settings.include)
                return settings.include;
            else
            {
                if (settings.excludeTags)
                {
                    _nodeNames = ' ' + settings.excludeTags.toUpperCase() + ' ';
                    return $(function (el)
                    {
                        return (_nodeNames.indexOf(' ' + el.nodeName + ' ') == -1 && (!settings.exclude || $.indexOf(settings.exclude, el) == -1));
                    }, settings.selectZone);
                }
                else
                {
                    return $(function (el)
                    {
                        return (!settings.exclude || $.indexOf(settings.exclude, el) == -1);
                    }, settings.selectZone, settings.includeTags);
                }
            }
        }

        function startDrag(e)
        {
            if (e.button > 0 || e.pointerType === 'touch') // drag-select is for mouse/pen only, a finger scrolls
                return;

            var dragZoneDev, winSize,
                dragZonePos = $.styleValue(_dragZone, 'position') || 'static',
                scrollable = (_dragZone == _docElement || dragZonePos != 'static'),
                overflowX = $.styleValue(_dragZone, 'overflow-x'),
                overflowY = $.styleValue(_dragZone, 'overflow-y'),
                scroll = $.getScrollPosition(), x = $.clientX(e), y = $.clientY(e);

            // check if dragzone is scrollable
            _scrollX = (scrollable && overflowX != "hidden" && _dragZone.scrollWidth > _dragZone.clientWidth);
            _scrollY = (scrollable && overflowY != "hidden" && _dragZone.scrollHeight > _dragZone.clientHeight);
            scrollable = _scrollX || _scrollY;

            if (!scrollable)
                _dragZone = _docElement; // if dragZone is not scrollable we set it to docElement

            if (_dragZone == _docElement)
            {
                winSize = $.getWindowSize();
                _boundary = { top: 0, right: 0, bottom: 0, left: 0 };
                _boundary.right = winSize.width;
                _boundary.bottom = winSize.height;

                // check if doc element is scrollable
                _scrollX = (_docElement.scrollWidth > _docElement.clientWidth);
                _scrollY = (_docElement.scrollHeight > _docElement.clientHeight);
                scrollable = _scrollX || _scrollY;
            }
            else
            {
                _boundary = $.getPos(_dragZone);
                dragZoneDev = $.borderAndPadding(_dragZone, true);
                _boundary.top += dragZoneDev.borderTop;
                _boundary.right -= dragZoneDev.borderRight;
                _boundary.bottom -= dragZoneDev.borderBottom;
                _boundary.left += dragZoneDev.borderLeft;

                if (_scrollY)
                    _boundary.right -= _scrollbarSize.width;

                if (_scrollX)
                    _boundary.bottom -= _scrollbarSize.height;
            }

            // stop drag on scrollbar touch
            if (((!scrollable || _dragZone == _docElement) && (x > _boundary.right || y > _boundary.bottom))
                || (_dragZone != _docElement && (x + scroll.scrollLeft > _boundary.right || y + scroll.scrollTop > _boundary.bottom)))
            {
                return;
            }

            _maxScrollX = (_dragZone.scrollWidth - _dragZone.clientWidth);
            _maxScrollY = (_dragZone.scrollHeight - _dragZone.clientHeight);
            _boundary.top += settings.scrollOffsetY || 2;
            _boundary.left += settings.scrollOffsetX || 2;
            _boundary.bottom -= settings.scrollOffsetY || 2;
            _boundary.right -= settings.scrollOffsetX || 2;

            _dragging = false;
            _allowDrag = true;
            _deselected = [];
            _shiftKey = e.shiftKey;
            _ctrlKey = e.ctrlKey;
            _textSelection.disable();

            if (_selection)
                _selection.parentNode.removeChild(_selection);

            _selection = _dragZone.appendChild($.getDocument().createElement('div'));
            _selection.style.width = _selection.style.height = '0px';

            if (settings.dragSelectionClass)
                _selection.className = settings.dragSelectionClass;
            else
                _selection.style.border = '1px dotted black';

            if (scrollable)
            {
                _selection.style.position = 'absolute';
                $.setPos(_selection, { top: y + scroll.scrollTop, left: x + scroll.scrollLeft });
            }
            else
            {
                _selection.style.position = 'fixed';
                $.setPos(_selection, { top: y, left: x });
            }

            // store start values
            _selectionDev = $.borderAndPadding(_selection);
            _startTop = parseInt(_selection.style.top, 10);
            _startLeft = parseInt(_selection.style.left, 10);
            _startX = _lastX = $.clientX(e) + _dragZone.scrollLeft;
            _startY = _lastY = $.clientY(e) + _dragZone.scrollTop;
            _selection.style.display = 'none';
        }

        function endDrag(e)
        {
            if (!_allowDrag)
                return;

            _allowDrag = false;
            _cancelFrame(_rafId);
            _rafId = null;
            stopScroll();
            _textSelection.enable();
            _lastSelected = [];
            _flipX = _flipY = false;
            _lastX = _lastY = 0;

            if (_dragging)
            {
                if (!settings.liveUpdate)
                    updateSelection(e);

                if (settings.onDragEnd)
                    settings.onDragEnd(eventArgs(e));

                _dragging = false;
            }

            _selection.parentNode.removeChild(_selection);
            _selection = null;
        }

        function scheduleDrag(e)
        {
            _lastEvent = e;
            if (!_rafId)
            {
                _rafId = _requestFrame(() =>
                {
                    if (_lastEvent && _lastEvent.type === 'pointermove')
                        drag(_lastEvent);

                    _rafId = null;
                });
            }
        }

        function drag(e)
        {
            if (!_allowDrag)
                return;

            var scroll = $.getScrollPosition(),
                clientX = $.clientX(e) + _dragZone.scrollLeft,
                clientY = $.clientY(e) + _dragZone.scrollTop,
                deltaX = clientX - _lastX,
                deltaY = clientY - _lastY,
                width = parseInt(_selection.style.width, 10),
                height = parseInt(_selection.style.height, 10),
                left = parseInt(_selection.style.left, 10),
                top = parseInt(_selection.style.top, 10),
                boundaryX, boundaryY, absWidth, absHeight;

            if (clientX < _startX)
            {
                if (!_flipX)
                {
                    width = Math.abs(deltaX);
                    left = _startLeft + deltaX;
                    _flipX = true;
                }
                else
                {
                    left += deltaX;
                    width -= deltaX;
                }
            }
            else
            {
                if (_flipX)
                {
                    width = Math.abs(deltaX);
                    left = _startLeft + deltaX;
                    _flipX = false;
                }
                else
                {
                    width += deltaX;
                }
            }

            if (clientY < _startY)
            {
                if (!_flipY)
                {
                    height = Math.abs(deltaY);
                    top = _startTop + deltaY;
                    _flipY = true;
                }
                else
                {
                    top += deltaY;
                    height -= deltaY;
                }
            }
            else
            {
                if (_flipY)
                {
                    height = Math.abs(deltaY);
                    top = _startTop + deltaY;
                    _flipY = false;
                }
                else
                {
                    height += deltaY;
                }
            }

            absWidth = width + _selectionDev.width;
            absHeight = height + _selectionDev.height;
            _lastX = clientX;
            _lastY = clientY;

            if (Math.abs(clientX - _startX) < 1 && Math.abs(clientY - _startY) < 1)
                return;

            if (!_dragging)
            {
                // start drag

                if (settings.liveUpdate && (settings.toggleDragSelect || settings.ctrlSelect))
                    _lastSelected = getSelection();

                if (!settings.appendDragSelect)
                    clear(e);

                _bubble = false;
                _dragging = true;
                _selection.style.display = '';

                if (settings.onDragStart)
                    settings.onDragStart(eventArgs(e));
            }

            _scrollDirection = null;

            // change client coordinates
            if (_dragZone == _docElement)
            {
                clientX = $.clientX(e);
                clientY = $.clientY(e);
            }
            else
            {
                clientX = $.clientX(e) + scroll.scrollLeft;
                clientY = $.clientY(e) + scroll.scrollTop;
            }

            if (clientX <= _boundary.left && _scrollX && _dragZone.scrollLeft)
            {
                boundaryX = true;
                _scrollDirection = _ScrollDirectionOption.LEFT;
                _scrollSpeedX = Math.round((_boundary.left - clientX) / 2) || 1;
            }
            else if (clientX >= _boundary.right && _scrollX && _dragZone.scrollLeft < _maxScrollX)
            {
                boundaryX = true;
                _scrollDirection = _ScrollDirectionOption.RIGHT;
                _scrollSpeedX = Math.round((clientX - _boundary.right) / 2) || 1;
            }

            if (clientY <= _boundary.top && _scrollY && _dragZone.scrollTop)
            {
                boundaryY = true;
                _scrollDirection += _ScrollDirectionOption.TOP;
                _scrollSpeedY = Math.round((_boundary.top - clientY) / 2) || 1;
            }
            else if (clientY >= _boundary.bottom && _scrollY && _dragZone.scrollTop < _maxScrollY)
            {
                boundaryY = true;
                _scrollDirection += _ScrollDirectionOption.BOTTOM;
                _scrollSpeedY = Math.round((clientY - _boundary.bottom) / 2) || 1;
            }

            if (!_scrollTimerId || !boundaryX)
            {
                if (_scrollX && _flipX && left < _dragZone.scrollLeft)
                {
                    left = _dragZone.scrollLeft;
                    width = parseInt(_selection.style.width, 10);
                }

                if (_scrollX && !_flipX && left + absWidth > _dragZone.scrollLeft + _dragZone.clientWidth)
                    width = (_dragZone.scrollLeft + _dragZone.clientWidth) - (left + _selectionDev.width);

                _selection.style.width = $.unit((width > 0) ? width : 0);
                _selection.style.left = $.unit(left);
            }

            if (!_scrollTimerId || !boundaryY)
            {
                if (_scrollY && _flipY && top < _dragZone.scrollTop)
                {
                    top = _dragZone.scrollTop;
                    height = parseInt(_selection.style.height, 10);
                }

                if (_scrollY && !_flipY && top + absHeight > _dragZone.scrollTop + _dragZone.clientHeight)
                {
                    height = (_dragZone.scrollTop + _dragZone.clientHeight) - (top + _selectionDev.height);
                }


                _selection.style.height = $.unit((height > 0) ? height : 0);
                _selection.style.top = $.unit(top);
            }

            if (_scrollDirection != null && !_scrollTimerId)
                startScroll(left, top, width, height);
            else if (_scrollDirection == null)
            {
                stopScroll();
            }
            else
            {
                if (!boundaryX)
                {
                    _selZone.left = left;
                    _selZone.width = width;
                }

                if (!boundaryY)
                {
                    _selZone.top = top;
                    _selZone.height = height;
                }
            }

            if (settings.onDrag)
                settings.onDrag(eventArgs(e));

            if (!_scrollTimerId && settings.liveUpdate)
                updateSelection(e);
        }

        function startScroll(left, top, width, height)
        {
            stopScroll();
            _selZone.left = left;
            _selZone.top = top;
            _selZone.width = width;
            _selZone.height = height;
            _lastScrollLeft = _dragZone.scrollLeft;
            _lastScrollTop = _dragZone.scrollTop
            _scrollTimerId = setTimeout(scrollUpdate, 5);
        }

        function stopScroll()
        {
            clearTimeout(_scrollTimerId);
            _scrollTimerId = null;
            _lastScrollLeft = _lastScrollTop = 0;
        }

        function scrollUpdate()
        {
            var scrollLeft = _dragZone.scrollLeft, scrollTop = _dragZone.scrollTop,
                updateScrollLeft = (Math.abs(_dragZone.scrollLeft - _lastScrollLeft) == 0),
                updateScrollTop = (Math.abs(_dragZone.scrollTop - _lastScrollTop) == 0),
                update, x, y;

            if (_scrollDirection & _ScrollDirectionOption.LEFT)
            {
                update = true;

                if (updateScrollLeft)
                    scrollLeft -= _scrollSpeedX;

                if (scrollLeft < 0)
                    scrollLeft = 0;

                _lastX -= x = Math.abs(scrollLeft - _lastScrollLeft);

                if (_lastX < _startX && !_flipX)
                {
                    _selZone.width = 0
                    _flipX = true;
                }

                if (!_flipX)
                {
                    _selZone.width -= x;
                }
                else
                {
                    if (scrollLeft == 0)
                    {
                        _selZone.width += _selZone.left;
                        _selZone.left = 0;
                    }
                    else
                    {
                        _selZone.width += x;
                        _selZone.left -= x;
                    }
                }
            }

            if (_scrollDirection & _ScrollDirectionOption.RIGHT)
            {
                update = true;

                if (updateScrollLeft)
                    scrollLeft += _scrollSpeedX;

                if (scrollLeft > _maxScrollX)
                    scrollLeft = _maxScrollX;

                _lastX += x = Math.abs(scrollLeft - _lastScrollLeft);

                if (_lastX >= _startX && _flipX)
                {
                    _selZone.width = 0
                    _flipX = false;
                }

                if (_flipX)
                {
                    _selZone.left += y;
                    _selZone.width -= y;
                }
                else
                {
                    _selZone.width += y;

                    if ((_selZone.left + _selZone.width + _selectionDev.width) > _dragZone.scrollWidth)
                        _selZone.width = _dragZone.scrollWidth - (_selZone.left + _selectionDev.width);
                }
            }

            if (_scrollDirection & _ScrollDirectionOption.TOP)
            {
                update = true;

                if (updateScrollTop)
                    scrollTop -= _scrollSpeedY;

                if (scrollTop < 0)
                    scrollTop = 0;

                _lastY -= y = Math.abs(scrollTop - _lastScrollTop);

                if (_lastY < _startY && !_flipY)
                {
                    _selZone.height = 0
                    _flipY = true;
                }

                if (!_flipY)
                {
                    _selZone.height -= y;
                }
                else
                {
                    if (scrollTop == 0)
                    {
                        _selZone.height += _selZone.top;
                        _selZone.top = 0;
                    }
                    else
                    {
                        _selZone.height += y;
                        _selZone.top -= y;
                    }
                }
            }

            if (_scrollDirection & _ScrollDirectionOption.BOTTOM)
            {
                update = true;

                if (updateScrollTop)
                    scrollTop += _scrollSpeedY;

                if (scrollTop > _maxScrollY)
                    scrollTop = _maxScrollY;

                _lastY += y = Math.abs(scrollTop - _lastScrollTop);

                if (_lastY >= _startY && _flipY)
                {
                    _selZone.height = 0
                    _flipY = false;
                }

                if (_flipY)
                {
                    _selZone.top += y;
                    _selZone.height -= y;
                }
                else
                {
                    _selZone.height += y;

                    if ((_selZone.top + _selZone.height + _selectionDev.height) > _dragZone.scrollHeight)
                    {
                        _selZone.height = _dragZone.scrollHeight - (_selZone.top + _selectionDev.height);
                    }
                }
            }

            if (update)
            {
                if (_selZone.width < 0)
                    _selZone.width = 0;

                if (_selZone.height < 0)
                    _selZone.height = 0;

                _selection.style.width = $.unit(_selZone.width);
                _selection.style.height = $.unit(_selZone.height);
                _selection.style.left = $.unit(_selZone.left);
                _selection.style.top = $.unit(_selZone.top);

                if (settings.liveUpdate)
                    updateSelection();

                _lastScrollTop = scrollTop;
                _lastScrollLeft = scrollLeft;
                _scrollTimerId = setTimeout(scroll, 0);
            }
            else
            {
                stopScroll();
            }
        }

        function scroll()
        {
            _dragZone.scrollTop = _lastScrollTop;
            _dragZone.scrollLeft = _lastScrollLeft;

            if ((_dragZone.scrollTop >= _maxScrollY && (_scrollDirection & _ScrollDirectionOption.BOTTOM || _scrollDirection & _ScrollDirectionOption.TOP))
                || (_dragZone.scrollLeft >= _maxScrollX && (_scrollDirection & _ScrollDirectionOption.RIGHT || _scrollDirection & _ScrollDirectionOption.LEFT)))
                stopScroll();
            else
                _scrollTimerId = setTimeout(scrollUpdate, 5);
        }

        function cancelBubble()
        {
            _bubble = false;
        }

        function clearClick()
        {
            if (settings.clearOnOutsideClick && _bubble)
                clearSelection();

            _bubble = true;
        }

        function clear(e)
        {
            if (!e.shiftKey && !e.ctrlKey)
                clearSelection();
        }

        function clearSelection()
        {
            var selList = getSelection();

            _deselected = [];
            _selected = [];

            for (var index = 0; index < selList.length; ++index)
            {
                deselect(selList[index]);
            }

            if (settings.onSelect)
                settings.onSelect(eventArgs());
        }

        function getSelection()
        {
            var result = [];

            for (var index = 0; index < _list.length; ++index)
            {
                if ($.hasClass(_list[index][0], settings.selectedClass))
                    result.push(_list[index][0]);
            }

            return result;
        }

        function toggleSelect(e)
        {
            if (!_bubble)
                return;

            var el = this,
                hasClass = $.hasClass(el, settings.selectedClass),
                shift = (settings.shiftSelect && e.shiftKey),
                ctrl = (settings.ctrlSelect && e.ctrlKey);

            _deselected = [];
            _selected = [];

            if (shift)
            {
                appendSelection(el);
            }
            else
            {
                if (!ctrl && !settings.appendClickSelect)
                    clear(e);

                if (hasClass && (settings.toggleClickSelect || ctrl))
                    deselect(el);
                else
                    select(el);
            }

            if (settings.onSelect)
                settings.onSelect(eventArgs(e));
        }

        function appendSelection(el)
        {
            var curIndex, firstIndex, lastIndex, startIndex = 0, length, directionChange,
                comparer = function (item)
                {
                    return ($.hasClass(item[0], settings.selectedClass));
                };

            curIndex = $.indexOf(_list, function (item) { return (item[0] === el) });
            firstIndex = $.indexOf(_list, comparer);
            lastIndex = $.indexOf(_slice(_list).reverse(), comparer);

            if (lastIndex > -1)
                lastIndex = (_list.length - 1) - lastIndex;

            if (lastIndex == firstIndex)
                _shiftUpwards = false;

            if (_shiftUpwards && (curIndex > lastIndex))
            {
                _shiftUpwards = false;
                directionChange = true;
            }
            else if (!_shiftUpwards && (curIndex < firstIndex))
            {
                _shiftUpwards = true;
                directionChange = true;
            }

            if (firstIndex == lastIndex && firstIndex == -1)
                firstIndex = lastIndex = 0;

            if (curIndex <= lastIndex && _shiftUpwards)
            {
                startIndex = curIndex;
                length = (directionChange) ? firstIndex : lastIndex;
            }
            else if (curIndex >= firstIndex)
            {
                startIndex = (directionChange) ? lastIndex : firstIndex;
                length = curIndex;
            }

            clearSelection();

            for (var index = 0; index < _list.length; ++index)
            {
                el = _list[index][0];

                if (index >= startIndex && index <= length)
                    select(el);
                else
                    deselect(el);
            }
        }

        function deselect(el)
        {
            if ($.hasClass(el, settings.selectedClass))
            {
                $.removeClass(el, settings.selectedClass);
                _deselected.push(el);
            }
        }

        function select(el)
        {
            if (!$.hasClass(el, settings.selectedClass))
            {
                $.addClass(el, settings.selectedClass);
                _selected.push(el);
            }
        }

        function updateSelection(e)
        {
            var selZone = $.getPos(_selection),

                shift = (settings.shiftSelect && _shiftKey),
                ctrl = (settings.ctrlSelect && _ctrlKey),
                el, elZone;

            if (_dragZone != _docElement)
                addScroll(selZone, _dragZone);

            if (settings.liveUpdate)
                liveUpdate(selZone, ctrl, shift);
            else
            {
                for (var index = 0; index < _list.length; ++index)
                {
                    el = _list[index][0];
                    elZone = _list[index][1];

                    if (touch(elZone, selZone))
                    {
                        if ((settings.toggleDragSelect || ctrl) && $.hasClass(el, settings.selectedClass))
                            deselect(el);
                        else
                            select(el);
                    }
                }
            }
            if (settings.onSelect)
                settings.onSelect(eventArgs(e));
        }

        function liveUpdate(selZone, ctrl, shift)
        {
            var el, elZone,
                append = settings.appendDragSelect || ctrl || shift;

            for (var index = 0; index < _list.length; ++index)
            {
                el = _list[index][0];
                elZone = _list[index][1];

                if (touch(elZone, selZone))
                {
                    if ((settings.toggleDragSelect || ctrl) && $.indexOf(_lastSelected, el) > -1)
                        deselect(el);
                    else
                        select(el);
                }
                else if (append && $.indexOf(_lastSelected, el) > -1)
                    select(el);
            }
        }

        function addScroll(zone, scroll)
        {
            zone.top += scroll.scrollTop;
            zone.right += scroll.scrollLeft;
            zone.bottom += scroll.scrollTop;
            zone.left += scroll.scrollLeft;
            return zone;
        }

        function touch(el, zone)
        {
            return _touch(el, zone);
        }

        function eventArgs(e)
        {
            return { selected: _selected, deselected: _deselected, settings: settings, event: e || null }
        }
    }

    /** Enables the specified element to be resizable.
    * @param {HTMLElement} element to make resizable.
    * @param {componyx.library.ResizableSettings} settings The settings which configure the resize behaviour.
    * @returns {componyx.library.ResizableController} An Object to control the resizable behaviour.
    */
    $.resizable = function (element, settings)
    {
        settings = settings || {};

        var _handlers = [], _allowResize = false, _resizing = false,
            _rafId, _lastEvent,
            _ver = $.getDocument().createElement('div'),
            _hor = $.getDocument().createElement('div'),
            _startX = 0, _startY = 0, _startWidth = 0, _startHeight = 0,
            _direction, _stylePos, _boundary, _position, _margin, _elDev,
            _textSelection = $.textSelection($.getDocument().documentElement);

        settings.resizeHandles = _toArray(settings.resizeHandles);
        settings.defaultHandles = ($.isEmpty(settings.defaultHandles)) ? true : settings.defaultHandles;
        settings.minResizeX = (settings.minResizeX) ? settings.minResizeX : 1;
        settings.minResizeY = (settings.minResizeX) ? settings.minResizeX : 1;

        var controller =
        {
            element: element,
            settings: settings,
            disabled: false,

            enable: function ()
            {
                if (settings.defaultHandles)
                {
                    _stylePos = $.styleValue(element, 'position');

                    if ('relative absolute fixed'.indexOf(_stylePos) == -1)
                        _stylePos = element.style.position = _stylePos = 'relative';

                    _ver.className = 'draghandle-e';
                    _hor.className = 'draghandle-s';
                    $.updateStyle(_ver.style, 'position: absolute; top: 0px; right: -3px; width: 7px; height: 100%; cursor: e-resize');
                    $.updateStyle(_hor.style, 'position: absolute; left: 0px; bottom: -3px; height: 7px; width: 100%; cursor: s-resize');
                    element.appendChild(_ver);
                    element.appendChild(_hor);

                    bind(_ver, 'e');
                    bind(_hor, 's');
                }

                $.each(settings.resizeHandles, function (resizeHandle)
                {
                    $.each(resizeHandle, function (val, key)
                    {
                        bind(val, key.toLowerCase());
                    });
                });

                _handlers.pointerup = $.on($.getDocument(), 'pointerup', endResize);
                _handlers.pointermove = $.on($.getDocument(), 'pointermove', scheduleResize);

                function bind(resizeHandle, direction)
                {
                    var handler = {};

                    handler.resizeHandle = resizeHandle;

                    // e/w only: allow vertical scrolling, n/s only: allow horizontal scrolling, corners: block both
                    const resizeX = /[ew]/.test(direction), resizeY = /[ns]/.test(direction);
                    _setTouchAction(resizeHandle, (resizeX && resizeY) ? 'none' : (resizeX ? 'pan-y' : 'pan-x'));

                    handler.dragstart = $.on(resizeHandle, 'dragstart', _stopEvent);
                    handler.pointerdown = $.on(resizeHandle, 'pointerdown', startResize, direction);
                    _handlers.push(handler);
                }

                this.disabled = false;
                return this;
            },
            disable: function ()
            {
                $.each(_handlers, function (handler, index)
                {
                    $.off(handler.resizeHandle, 'dragstart', handler.dragstart);
                    $.off(handler.resizeHandle, 'pointerdown', handler.pointerdown);
                    _resetTouchAction(handler.resizeHandle);
                });

                $.off($.getDocument(), 'pointerup', _handlers.pointerup);
                $.off($.getDocument(), 'pointermove', _handlers.pointermove);

                this.disabled = true;
                return this;
            }
        }

        return controller.enable();

        // private methods

        function startResize(d, e)
        {
            if (e.button > 0)
                return;

            var el = settings.resizeGhost || element,
                boundaryDev = (settings.boundaryZone) ? $.borderAndPadding(settings.boundaryZone, true) : null,
                scroll = $.getScrollPosition(),
                clientX = $.clientX(e) + scroll.scrollLeft,
                clientY = $.clientY(e) + scroll.scrollTop;

            _direction = d;
            _resizing = false;
            _allowResize = true;
            _textSelection.disable();

            // store element & event info
            _margin = $.margin(element);
            _elDev = $.borderAndPadding(el);
            _startX = clientX;
            _startY = clientY;
            _startWidth = element.offsetWidth - _elDev.width;
            _startHeight = element.offsetHeight - _elDev.height;

            if (settings.resizeGhost)
            {
                // setup ghost element                    
                el.style.display = '';
                _position = $.getPos(element);
                el.style.position = 'absolute';
                $.setPos(el, { top: _position.top, left: _position.left });
                el.style.width = $.unit(_startWidth);
                el.style.height = $.unit(_startHeight);
                _position = $.getPos(el);
                el.style.display = 'none';
            }
            else
                _position = $.getPos(element);

            if (settings.boundaryZone)
            {
                _boundary = $.getPos(settings.boundaryZone);
                _boundary.top += boundaryDev.borderTop;
                _boundary.right -= boundaryDev.borderRight;
                _boundary.bottom -= boundaryDev.borderBottom;
                _boundary.left += boundaryDev.borderLeft;
            }

            resize(e);
        }

        function endResize(e)
        {
            if (!_allowResize)
                return;

            var el = settings.resizeGhost || element;
            _allowResize = false;
            _textSelection.enable();
            _cancelFrame(_rafId);
            _rafId = null;

            if (_resizing)
            {
                _resizing = false;
                $.removeClass(el, settings.resizeClass);

                if (settings.resizeGhost)
                {
                    _elDev = $.borderAndPadding(element);
                    element.style.width = $.unit(el.offsetWidth - _elDev.width);
                    element.style.height = $.unit(el.offsetHeight - _elDev.height);
                    el.style.display = 'none';
                }

                if (settings.onResizeEnd)
                    settings.onResizeEnd(eventArgs(e));
            }
        }

        function scheduleResize(e)
        {
            _lastEvent = e;
            if (!_rafId)
            {
                _rafId = _requestFrame(() =>
                {
                    if (_lastEvent && _lastEvent.type === 'pointermove')
                        resize(_lastEvent);

                    _rafId = null;
                });
            }
        }

        function resize(e)
        {
            if (!_allowResize)
                return;

            var width, height, left, top,
                el = settings.resizeGhost || element,
                scroll = $.getScrollPosition(),
                clientX = $.clientX(e) + scroll.scrollLeft,
                clientY = $.clientY(e) + scroll.scrollTop;

            if (Math.abs(clientX - _startX) < settings.minResizeX && Math.abs(clientY - _startY) < settings.minResizeY)
                return;

            if (!_resizing)
            {
                _resizing = true;
                el.style.display = '';
                $.addClass(el, settings.resizeClass);

                // hide element in ghost only mode
                if (settings.ghostOnly)
                    element.style.display = 'none';

                if (settings.onResizeStart)
                    settings.onResizeStart(eventArgs(e));
            }

            left = _position.left;
            top = _position.top;
            width = _startWidth + (_direction.indexOf('e') > -1 ? (clientX - _startX) : (_startX - clientX));
            height = _startHeight + (_direction.indexOf('s') > -1 ? (clientY - _startY) : (_startY - clientY));

            if (settings.tickX)
                width = Math.round(width / settings.tickX) * settings.tickX;

            if (settings.tickY)
                height = Math.round(height / settings.tickY) * settings.tickY;

            if (_boundary)
            {
                if ((left + (width + _elDev.width) + _margin.right) > _boundary.right)
                {
                    width = _boundary.right - left - _margin.right - _elDev.width;
                    width = (settings.tickX) ? Math.floor(width / settings.tickX) * settings.tickX : width;
                }

                if ((top + (height + _elDev.height) + _margin.bottom) > _boundary.bottom)
                {
                    height = _boundary.bottom - top - _margin.bottom - _elDev.height;
                    height = (settings.tickY) ? Math.floor(height / settings.tickY) * settings.tickY : height;
                }
            }

            width = (width < 0) ? 0 : width;
            height = (height < 0) ? 0 : height;


            if (_direction.indexOf('e') > -1 || _direction.indexOf('w') > -1)
                el.style.width = $.unit(width);

            if (_direction.indexOf('n') > -1 || _direction.indexOf('s') > -1)
                el.style.height = $.unit(height);

            if (settings.onResize)
                settings.onResize(eventArgs(e));

        }

        function eventArgs(e)
        {
            return { element: element, startWidth: _startWidth, startHeight: _startHeight, startX: _startX, startY: _startY, settings: settings, event: e, direction: _direction }
        }
    }

    /** Enables the specified element to be draggable.
    * @param {HTMLElement} element DOM element to make draggable.
    *  @param {componyx.library.DraggableSettings} settings The settings which configure the drag behaviour.
    * @returns {componyx.library.DraggableController} An Object to control the draggable behaviour.
    */
    $.draggable = function (element, settings)
    {
        settings = settings || {};

        var _handler = {}, _allowDrag = false, _previousScroll, _boundaryDev,
            _state = { dragging: false, scrolling: false, currentPositions: null, drag: null },
            _lastEvent, _transformValues, _boundaryScrollHandler,
            _dropZones, _dropZonesPos, _dropZoneIndex, _startDropZoneIndex,
            _deviationX = 0, _deviationY = 0,
            _dragHandle = settings.dragHandle || element,
            _startX, _startY, _startLeft, _startTop,
            _left, _top, _width, _height, _stylePos,
            _boundary, _margin, _rafId,
            _textSelection = $.textSelection(document);

        if (settings.dropZones && typeof settings.dropZones !== 'function')
            settings.dropZones = _toArray(settings.dropZones);

        var controller =
        {
            element: element,
            settings: settings,
            disabled: false,
            enable: function ()
            {
                var mode = settings.dropAcceptMode;

                if ($.isEmpty(mode))
                    mode = 0;
                else if (typeof mode == 'string')
                {
                    if (mode === 'full')
                        mode = 0;
                    else if (mode === 'half')
                        mode = 1;
                    else
                        mode = 2;
                }

                settings.dropAcceptMode = mode;
                settings.moveOriginal = (settings.moveOriginal == undefined) ? true : settings.moveOriginal;
                settings.dragX = (settings.dragX == undefined) ? true : settings.dragX;
                settings.dragY = (settings.dragY == undefined) ? true : settings.dragY;
                settings.minDragX = (settings.minDragX) ? settings.minDragX : 0;
                settings.minDragY = (settings.minDragY) ? settings.minDragY : 0;

                _setTouchAction(_dragHandle, (settings.dragX === settings.dragY) ? 'none' : (settings.dragX ? 'pan-y' : 'pan-x'));  // prevent the browser from claiming touch drags for scrolling (pointercancel)
                _handler.dragstart = $.on(_dragHandle, 'dragstart', _stopEvent);
                _handler.pointerdown = $.on(_dragHandle, 'pointerdown', startDrag);
                _handler.pointerup = $.on($.getDocument(), 'pointerup', endDrag);
                _handler.pointermove = $.on($.getDocument(), 'pointermove', scheduleDrag);

                this.disabled = false;
                return this;
            },
            disable: function ()
            {
                $.each(_handler, function (id, type)
                {
                    var el = $.getDocument();

                    if ('dragstart pointerdown'.indexOf(type) > -1)
                        el = _dragHandle;

                    $.off(el, type, id)
                });

                _resetTouchAction(_dragHandle);
                this.disabled = true;
                return this;
            },
            startDrag: function (e)
            {
                startDrag(e || $.event, true);
            },
            endDrag: function (e)
            {
                endDrag(e || $.event);
            }
        }

        return controller.enable();

        // private methods
        function startDrag(e, forceStart)
        {
            if (!forceStart && e.button > 0)
                return;

            var elementStylePos = getPosition(element, $.isEmpty(settings.dragGhost)),
                dragGhost = settings.dragGhost,
                position = $.getPos(element, null),
                absPos = (elementStylePos !== 'fixed') ? position : $.getPos(element, null, false),
                el = dragGhost || element,
                scroll = $.getScrollPosition(),
                clientX = $.clientX(e) + scroll.scrollLeft,
                clientY = $.clientY(e) + scroll.scrollTop;

            // cancel drag when there is no draghandle and an inner element reaching outside the drag element boundaries is causing the drag
            if (!forceStart && !settings.dragHandle && !(clientX > absPos.left && clientX < absPos.right && clientY > absPos.top && clientY < absPos.bottom))
                return;

            _state.dragging = false;
            _allowDrag = true;
            _textSelection.disable();
            el.style.display = '';
            _margin = (settings.ignoreMargins) ? { top: 0, bottom: 0, left: 0, right: 0 } : $.margin(element);
            _startLeft = position.left;
            _startTop = position.top;
            _startX = $.clientX(e);
            _startY = $.clientY(e);
            _previousScroll = null;

            if (dragGhost)
            {
                var ghostPos = { top: absPos.top, left: absPos.left, bottom: 'auto', right: 'auto' };

                _stylePos = getPosition(el, true);

                if (_stylePos === 'fixed')
                {
                    ghostPos.top -= scroll.scrollTop;
                    ghostPos.left -= scroll.scrollLeft;

                    if (elementStylePos !== 'fixed')
                    {
                        _startLeft -= scroll.scrollLeft;
                        _startTop -= scroll.scrollTop;
                    }
                }

                $.setPos(el, ghostPos); // set drag-ghost at same position as element
                position = $.getPos(el, null);
                el.style.display = 'none';

                if (settings.autoGhostSize)
                {
                    var ghostDev = $.borderAndPadding(el);
                    el.style.width = $.unit(element.offsetWidth - ghostDev.width);
                    el.style.height = $.unit(element.offsetHeight - ghostDev.height);
                }
            }
            else
                _stylePos = elementStylePos;

            _deviationX = clientX - position.left;
            _deviationY = clientY - position.top;

            _boundaryDev = (settings.boundaryZone && settings.ignoreBoundaryBorders !== true) ? $.borderAndPadding(settings.boundaryZone, true) : null;
            updateBoundary(scroll);
            drag(e);
        }

        function updateBoundary(scroll)
        {
            if (settings.boundaryZone)
            {
                if (!_boundary)
                    _boundary = {};

                if (_stylePos === 'absolute' && settings.boundaryZone === $.getDocument().documentElement)
                {
                    _boundary.top = scroll.scrollTop;
                    _boundary.left = scroll.scrollLeft;
                    _boundary.right = scroll.scrollLeft + window.innerWidth;
                    _boundary.bottom = scroll.scrollTop + window.innerHeight;
                }
                else
                {
                    let boundaryDev = _boundaryDev || { borderTop: 0, borderRight: 0, borderBottom: 0, borderLeft: 0 },
                        b = $.getPos(settings.boundaryZone);

                    _boundary.top = b.top;
                    _boundary.left = b.left;
                    _boundary.right = b.right;
                    _boundary.bottom = b.bottom;

                    _boundary.top += boundaryDev.borderTop - (settings.boundaryOvershootTop || 0);
                    _boundary.right -= boundaryDev.borderRight - (settings.boundaryOvershootRight || 0);
                    _boundary.bottom -= boundaryDev.borderBottom - (settings.boundaryOvershootBottom || 0);
                    _boundary.left += boundaryDev.borderLeft - (settings.boundaryOvershootLeft || 0);
                }
            }
        }

        function scheduleDrag(e)
        {
            _lastEvent = e;
            if (!_rafId)
            {
                _rafId = _requestFrame(() =>
                {
                    if (_lastEvent && _lastEvent.type === 'pointermove')
                        drag(_lastEvent);

                    _rafId = null;
                });
            }
        }

        function drag(e)
        {
            if (!_allowDrag)
                return;

            let el = settings.dragGhost || element,
                scroll = $.getScrollPosition(),
                clientX = $.clientX(e) + scroll.scrollLeft,
                clientY = $.clientY(e) + scroll.scrollTop,
                dragX = settings.dragX && Math.abs($.clientX(e) - _startX) >= settings.minDragX,
                dragY = settings.dragY && Math.abs($.clientY(e) - _startY) >= settings.minDragY,
                scrollX = settings.scrollX,
                scrollY = settings.scrollY,
                boundaryZone = settings.boundaryZone,
                tickRounding = Math.round;

            if (!dragX && !dragY)
                return;

            if (!_state.dragging)
            {
                clearDroppableClass(el);
                _startDropZoneIndex = _dropZoneIndex;
                _dropZoneIndex = null;
                _dropZonesPos = [];

                if (settings.onDragStart)
                    settings.onDragStart(eventArgs(e));

                if (settings.cancelDrag)
                {
                    _allowDrag = settings.cancelDrag = false;
                    return;
                }

                _state.dragging = true;
                el.style.display = '';

                // hide element in ghost only mode
                if (settings.dragGhost && settings.ghostOnly)
                    element.style.display = 'none';

                if (settings.dragClass)
                    $.addClass(element, settings.dragClass);

                if (settings.dragGhost)
                {
                    let pos = element.getBoundingClientRect(),
                        offsetX = $.clientX(e) - pos.left,
                        offsetY = $.clientY(e) - pos.top,
                        ratioX = offsetX / pos.width, // calculate ratio of mouse offset vs size of original element
                        ratioY = offsetY / pos.height;

                    // use ratio on ghost (ghost could have different sizes)
                    if (pos.width != el.offsetWidth)
                        _deviationX -= ((element.offsetWidth - el.offsetWidth) * ratioX);

                    if (pos.height != el.offsetHeight)
                        _deviationY -= ((element.offsetHeight - el.offsetHeight) * ratioY);

                    if (settings.dragClass)
                        $.addClass(el, settings.dragClass);

                    _dropZones = (settings.dropZones && typeof settings.dropZones === 'function') ? settings.dropZones() : settings.dropZones;

                    if (_dropZones && !_dropZones.length)
                        _dropZones = null;

                    if (_dropZones)
                    {
                        for (let index = 0; index < _dropZones.length; ++index)
                        {
                            _dropZonesPos[index] = $.getPos(_dropZones[index], null, false);
                        }
                    }
                }

                _width = el.offsetWidth;
                _height = el.offsetHeight;
                _transformValues = getTransformValues(el);

                if (boundaryZone && !_boundaryScrollHandler)
                {
                    _boundaryScrollHandler = () =>
                    {
                        if (!_state.scrolledByDrag && _state.dragging && _lastEvent)
                            drag(_lastEvent);
                    };

                    if (boundaryZone === $.getDocument().documentElement || boundaryZone === $.getDocument().body)
                        $.getDocument().addEventListener('scroll', _boundaryScrollHandler, { passive: true });
                    else
                        boundaryZone.addEventListener('scroll', _boundaryScrollHandler, { passive: true });
                }
            }

            if (_stylePos === 'fixed' && _previousScroll)
            {
                _deviationX += scroll.scrollLeft - _previousScroll.scrollLeft;
                _deviationY += scroll.scrollTop - _previousScroll.scrollTop;
            }

            _lastEvent = e;
            _left = clientX - _deviationX;
            _top = clientY - _deviationY;

            if (_stylePos === 'absolute')
                updateBoundary(scroll); // update boundary

            if (_boundary)
            {
                let result = boundaryCheck(_left, _top, _width, _height);
                _left = (result.boundaryLeft != undefined) ? result.boundaryLeft : result.left
                _top = (result.boundaryTop != undefined) ? result.boundaryTop : result.top;
                tickRounding = Math.floor;

                if (_previousScroll && _stylePos !== 'fixed') // correct positions for scrolling
                {
                    if (result.boundaryLeft != undefined && scrollX)
                    {
                        const scrollDiff = scroll.scrollLeft - _previousScroll.scrollLeft;

                        if (scrollDiff > 0) // Scrolling Right
                        {
                            _left = Math.min(result.left + scrollDiff, result.boundaryLeft);
                        }
                        else if (scrollDiff < 0) // Scrolling Left
                        {
                            _left = Math.max(result.left + scrollDiff, result.boundaryLeft);
                        }
                    }

                    if (result.boundaryTop != undefined && scrollY)
                    {
                        const scrollDiff = scroll.scrollTop - _previousScroll.scrollTop;

                        if (scrollDiff > 0) // Scrolling Down
                        {
                            _top = Math.min(result.top + scrollDiff, result.boundaryTop);
                        }
                        else if (scrollDiff < 0) // Scrolling Up
                        {
                            _top = Math.max(result.top + scrollDiff, result.boundaryTop);
                        }
                    }
                }

                _state.currentPositions =
                {
                    left: result.left - _margin.left,
                    top: result.top - _margin.top,
                    right: result.left + _width + _margin.right,
                    bottom: result.top + _height + _margin.bottom
                };
                _state.drag = () =>
                {
                    drag(_lastEvent);
                }

                if ((scrollX && result.boundaryLeft != undefined) || (scrollY && result.boundaryTop != undefined))
                {
                    _scrollDraggable({
                        scrollX: scrollX,
                        scrollY: scrollY,
                        boundary: _boundary,
                        scrollContainer: boundaryZone,
                        state: _state
                    });
                }
            }

            let offsetX = 0, offsetY = 0, dropLeft, dropTop;

            if (settings.tickX)
                _left = tickRounding((_left / settings.tickX) * settings.tickX);

            if (settings.tickY)
                _top = tickRounding((_top / settings.tickY) * settings.tickY);

            if (settings.dragX)
            {
                offsetX = _left - _startLeft;

                if (_stylePos === 'fixed')
                    _left += scroll.scrollLeft;

                dropLeft = _left;
            }
            else
            {
                _left = _startLeft;
                dropLeft = (_stylePos === 'fixed') ? _left + scroll.scrollLeft : _left;
            }


            if (settings.dragY)
            {
                offsetY = _top - _startTop;

                if (_stylePos === 'fixed')
                    _top += scroll.scrollTop;

                dropTop = _top;
            }
            else
            {
                _top = _startTop;
                dropTop = (_stylePos === 'fixed') ? _top + scroll.scrollTop : _top;
            }

            el.style.transform = `translate(${_transformValues.x + offsetX}px, ${_transformValues.y + offsetY}px)`;
            drop(dropLeft, dropTop, _width, _height, e);

            if (settings.onDrag)
                settings.onDrag(eventArgs(e));

            _previousScroll = scroll;
        }

        function endDrag(e)
        {
            if (!_allowDrag)
                return;

            var el = settings.dragGhost || element,
                boundaryZone = settings.boundaryZone,
                dropZone = (_dropZoneIndex != null) ? _dropZones[_dropZoneIndex] : null;

            _cancelFrame(_rafId);
            _rafId = null;
            _allowDrag = false;
            _textSelection.enable();

            if (_state.dragging)
            {
                _state.dragging = false;

                if (boundaryZone)
                {
                    if (boundaryZone === $.getDocument().documentElement || boundaryZone === $.getDocument().body)
                        $.getDocument().removeEventListener('scroll', _boundaryScrollHandler);
                    else
                        boundaryZone.removeEventListener('scroll', _boundaryScrollHandler);
                }

                if (settings.dragClass)
                {
                    $.removeClass(element, settings.dragClass);
                    $.removeClass(el, settings.dragClass);
                }

                clearDroppableClass(el);

                let pos = $.getPos(el);

                el.style.transform = "";
                $.setPos(el, { left: pos.left, top: pos.top }); // force element at position

                // reject or accept drag result on element
                if (_dropZones && !dropZone && !settings.allowDropOutZone)
                    reject();
                else if (settings.dragGhost && (settings.allowDropOutZone || !_dropZones || dropZone))
                    accept();

                if (settings.dragGhost)
                    el.style.display = 'none';

                if (dropZone)
                {
                    if (settings.dropClass)
                    {
                        $.addClass(element, settings.dropClass);
                        $.addClass(dropZone, settings.dropClass);
                    }

                    if (settings.onDrop)
                        settings.onDrop(eventArgs(e));
                }

                if (settings.onDragEnd)
                    settings.onDragEnd(eventArgs(e));
            }
        }

        function getTransformValues(el)
        {
            const transform = window.getComputedStyle(el).transform;

            if (transform === 'none')
            {
                return { x: 0, y: 0 };
            }

            // The matrix values for 2D transform are in this order:
            // matrix(a, b, c, d, e, f) where: e (translationX) = translateX, f (translationY) = translateY
            const matrix = transform.match(/matrix\((.*)\)/);
            if (matrix && matrix[1])
            {
                const values = matrix[1].split(',').map(parseFloat);
                return {
                    x: values[4], // translationX
                    y: values[5]  // translationY
                };
            }

            return { x: 0, y: 0 };
        }

        function clearDroppableClass(el)
        {
            var dropZone = (_dropZoneIndex != null) ? _dropZones[_dropZoneIndex] : null;

            if (settings.droppableClass)
            {
                $.removeClass(el, settings.droppableClass);

                if (dropZone)
                    $.removeClass(dropZone, settings.droppableClass);
            }
        }

        function getPosition(el, isDragger)
        {
            var stylePos = $.styleValue(el, 'position');

            if (isDragger && 'fixed absolute relative'.indexOf(stylePos) == -1) // element has static position
                stylePos = el.style.position = 'fixed';

            return stylePos;
        }

        function boundaryCheck(left, top, width, height)
        {
            const pos = { left: left, top: top };

            if ((left - _margin.left) < _boundary.left)
            {
                pos.boundaryLeft = _boundary.left + _margin.left;
            }
            else if ((left + width + _margin.right) > _boundary.right)
            {
                pos.boundaryLeft = _boundary.right - (width + _margin.right);
            }

            if ((top - _margin.top) < _boundary.top)
            {
                pos.boundaryTop = _boundary.top + _margin.top;
            }
            else if ((top + height + _margin.bottom) > _boundary.bottom)
            {
                pos.boundaryTop = _boundary.bottom - (height + _margin.bottom);
            }

            return pos;
        }
        function drop(left, top, width, height, e)
        {
            if (!_dropZones)
                return null;

            let dropZone = (_dropZoneIndex != null) ? _dropZones[_dropZoneIndex] : null,
                el = settings.dragGhost || element,
                right = (left + width), bottom = (top + height),
                inZone = false,
                newDropZone = null,
                matchingZones = [];

            for (let index = 0; index < _dropZones.length; index++)
            {
                let zone = _dropZonesPos[index];

                inZone = (!settings.dropAcceptMode) ? full(zone) :
                    (settings.dropAcceptMode == 1) ? half(zone) : touch(zone);

                if (inZone)
                    matchingZones.push({ element: _dropZones[index], depth: getDepth(_dropZones[index]) });
            }

            if (matchingZones.length)
            {
                matchingZones.sort((a, b) => b.depth - a.depth); // Sort by depth (deepest first) and pick the deepest zone
                newDropZone = matchingZones[0].element;
            }

            if (dropZone && newDropZone != dropZone)
            {
                if (settings.dropClass)
                {
                    $.removeClass(element, settings.dropClass);
                    $.removeClass(dropZone, settings.dropClass);
                }

                if (settings.droppableClass)
                    $.removeClass(dropZone, settings.droppableClass);

                if (settings.onDroppableLeave)
                    settings.onDroppableLeave(eventArgs(e));
            }

            if (newDropZone)
            {
                _dropZoneIndex = _dropZones.indexOf(newDropZone);
                $.addClass(newDropZone, settings.droppableClass);
                $.addClass(el, settings.droppableClass);

                if (newDropZone == dropZone && settings.onDroppable)
                    settings.onDroppable(eventArgs(e, newDropZone));
                else if (newDropZone != dropZone)
                {
                    if (settings.onDroppableEnter)
                        settings.onDroppableEnter(eventArgs(e));

                    if (settings.onDroppable)
                        settings.onDroppable(eventArgs(e));
                }
            }
            else
            {
                _dropZoneIndex = null;
                $.removeClass(el, settings.droppableClass);
            }

            // private methods
            function full(zone)
            {
                var xZone = left >= zone.left && right <= zone.right,
                    yZone = top >= zone.top && bottom <= zone.bottom;

                return (xZone && yZone);
            }

            function half(zone)
            {
                var xZone = ((zone.right - zone.left) >= (width / 2) && ((right <= zone.right && (right - zone.left) >= (width / 2)) || (right > zone.right && (right - zone.right) <= (width / 2)))),
                    yZone = ((zone.bottom - zone.top) >= (height / 2) && ((bottom <= zone.bottom && (bottom - zone.top) >= (height / 2)) || (bottom > zone.bottom && (bottom - zone.bottom) <= (height / 2))));

                return (xZone && yZone);
            }

            function touch(zone)
            {
                return _touch({ top: top, right: right, bottom: bottom, left: left }, zone);
            }

            function getDepth(element)
            {
                let depth = 0;
                while (element.parentElement)
                {
                    depth++;
                    element = element.parentElement;
                }
                return depth;
            }
        }

        function eventArgs(e)
        {
            return {
                element: element,
                settings: settings,
                event: e,
                left: _left,
                top: _top,
                dropZone: (_dropZoneIndex != null) ? _dropZones[_dropZoneIndex] : null,
                dropZonePos: (_dropZoneIndex != null) ? _dropZonesPos[_dropZoneIndex] : null,
                boundaryPos: _boundary || null
            }
        }

        function accept()
        {
            if (!settings.moveOriginal)
                return;

            var elStylePos = $.styleValue(element, 'position'), pos;

            if (_stylePos === 'fixed' && elStylePos !== 'fixed')
                pos = $.getPos(settings.dragGhost, null, false);
            if (_stylePos !== 'fixed' && elStylePos === 'fixed')
                pos = $.getPos(settings.dragGhost, null, true);
            else
                pos = $.getPos(settings.dragGhost);

            $.setPos(element, { left: pos.left, top: pos.top });
        }

        function reject()
        {
            if (!settings.dragGhost && settings.moveOriginal)
                $.setPos(element, { left: _startLeft, top: _startTop });

            _dropZoneIndex = _startDropZoneIndex;

            if (_dropZoneIndex != null && settings.dropClass)
            {
                $.addClass(element, settings.dropClass);
                $.addClass(_dropZones[_startDropZoneIndex], settings.dropClass);
            }
        }
    }

    /** 
    * Displays the element by fading it from transparent to opaque.
    * When parameters are passed as array, they will be matched on array index.
    * @param {HTMLElement|HTMLElement[]} element Element.
    * @param {componyx.library.animationSettings} settings The settings which configure the animation.
    * @returns {componyx.library.Animation} The Animation object.
    */
    $.fadeIn = function (element, settings)
    {
        var elements;
        var arg = $.each({ el: element }, function (item, key, object)
        {
            if (!$.isArray(item))
                object[key] = [item];
        });

        elements = arg.el;

        $.each(elements, function (element, index)
        {
            if (element.style.display != 'none')
                element.style.display = 'none';

            _setOpacity(element, 0);
        });

        return $.animate(elements, { display: '', opacity: 1 }, settings);
    }

    /** 
    * Hides the element by fading it from opaque to transparent.
    * When parameters are passed as array, they will be matched on array index.
    * @param {HTMLElement|HTMLElement[]} element Element.
    * @param {componyx.library.animationSettings} settings The settings which configure the animation.
    * @returns {componyx.library.Animation} The Animation object.
    */
    $.fadeOut = function (element, settings)
    {
        var elements = (!$.isArray(element)) ? [element] : element;

        $.each(elements, function (element, index)
        {
            if (element.style.display == 'none')
                element.style.display = '';

            _setOpacity(element, 1);
        });

        return $.animate(elements, { display: 'none', opacity: 0 }, settings);
    }

    /**
     * Performs a slide transition effect to reveal an element by creating a clipping mask, applying animation classes, and then removing the mask upon completion.
     * @param {HTMLElement} element - The target element to animate.
     * @param {boolean} out=false - If true, performs a slide/reveal OUT effect; otherwise, performs a slide/reveal IN effect.
     * @param {string} effect='slide' - The type of effect to use; expected values are "slide" or "reveal".
     * @param {string} direction='right' - The direction of the animation (e.g., "left", "right", "up", "down"). 
     * @param {boolean} fade=false - If true, the effect will include a fade transition. 
     * @param {Function} onComplete - Callback invoked when the transition completes.
     * @return {Function} abort - Function to abort the animation; pass false to abort without firing onComplete.
     */
    $.slide = function (element, out = false, effect = 'slide', direction = 'right', fade = false, onComplete)
    {
        let maskEl = _createMask(element),
            effectClass = (effect == 'slide') ? 'cui-slide' : 'cui-reveal',
            isStatic = ('absolute fixed'.indexOf($.styleValue(maskEl, 'position')) == -1),
            classes = [
                "cui-mask",
                'cui-' + direction,
                (out) ? `${effectClass}-out` : `${effectClass}-in`,
                (fade) ? "cui-fade" : "",
                (isStatic) ? "cui-static" : ""
            ].filter(Boolean),
            complete = () =>
            {
                _removeMask(element);
                onComplete();
            }

        maskEl.classList.add(...classes);
        maskEl.offsetWidth; // force reflow to apply styles immediately
        return $.cssAnimation(maskEl, undefined, [element], { onComplete: complete });
    }

    /**
     * Handle returned by {@link cssAnimation} to control an in-progress CSS animation/transition.
     * @typedef {Object} cssAnimationController
     * @memberof componyx.library
     * @property {Function} abort - Function to abort the animation by removing the animation class.
     * @property {Function} complete - Function to complete the animation by removing the animation class and firing the onComplete handler.
     */
    
    /**
     * Applies a CSS animation/transition to an element by adding the specified classes and triggers the onComplete callback when the animation/transition ends.
     * @param {HTMLElement} element - The element to animate.
     * @param {String} [animationClass] - The CSS class used to trigger the animation/transition.
     * @param {HTMLElement[]} [triggerElements] - Array of child elements that are considered valid for triggering the animation/transition start/end events. If ommited only the main element will trigger.
     * @param {Object} callbacks - An object to configure the event callbacks.
     * @param {Function} callbacks.onComplete - Callback invoked when the animation/transition completes.
     * @param {Function} callbacks.onStart - Callback invoked when the animation/transition starts.
     * @param {Function} callbacks.isComplete - Callback invoked to check if the animation/transition has completed. The TransitionEnd event might fire multiple times if multiple animations/transitions have been configured on the element (or pseudo elements) in CSS.
     * @return {cssAnimationController} An object to abort/complete the css animation/transition.
     */
    $.cssAnimation = function (element, animationClass = 'cui-animation', triggerElements = [], callbacks = {})
    {
        let transitionStarted = false,
            animationStarted = false,
            transitionEnded = false,
            animationEnded = false,
            isAllowed = (event) => { return (event.target === element || triggerElements.includes(event.target)) },
            isComplete = () =>
            {
                if (callbacks.isComplete && callbacks.isComplete() || ((!transitionStarted || transitionEnded) && (!animationStarted || animationEnded)))
                {
                    cleanup();
                    callbacks.onComplete && callbacks.onComplete();
                }
            },
            onTransitionStart = (event) =>
            {
                if (!isAllowed(event))
                    return;

                transitionStarted = true;
                callbacks.onStart && callbacks.onStart();
            },
            onAnimationStart = (event) =>
            {
                if (!isAllowed(event))
                    return;

                animationStarted = true;
                callbacks.onStart && callbacks.onStart();
            },
            onTransitionEnd = (event) =>
            {
                if (!isAllowed(event))
                    return;

                transitionEnded = true;
                isComplete();
            },
            onAnimationEnd = (event) =>
            {
                if (!isAllowed(event))
                    return;

                animationEnded = true;
                isComplete();
            },
            cleanup = () =>
            {
                element.classList.remove(...animationClass.split(' '));
                element.removeEventListener("transitionstart", onTransitionStart);
                element.removeEventListener("animationstart", onAnimationStart);
                element.removeEventListener("transitionend", onTransitionEnd);
                element.removeEventListener("animationend", onAnimationEnd);
            };

        cleanup();
        element.addEventListener("transitionstart", onTransitionStart);
        element.addEventListener("animationstart", onAnimationStart);
        element.addEventListener("transitionend", onTransitionEnd);
        element.addEventListener("animationend", onAnimationEnd);

        element.classList.add(...animationClass.split(' '));
        element.offsetWidth; // force reflow to apply styles immediately

        return {
            abort: () => { cleanup(); },
            complete: () => { cleanup(); callbacks.onComplete && callbacks.onComplete(); }
        }
    };

    /** 
    * Animates the element by transitioning the current css class(es) to the specified class(es).
    * When parameters are passed as array, they will be matched on array index.
    * @param {HTMLElement|HTMLElement[]} element Element.
    * @param {String|String[]} cssClass Class name(s) string. Use space separated names to apply multiple classes on a single element.
    * @param {Object|Object[]} classSpecifier The class specifier defines how classes are assigned to the element(s). 
    * By default classes are toggled, use classname: 'toggle/add/remove' for the desired behaviour.
    * @param {componyx.library.animationSettings} settings The settings which configure the animation.
    * @returns {componyx.library.Animation} The Animation object.
    */
    $.animateToClass = function (element, cssClass, classSpecifier, settings)
    {
        if (!element || !cssClass || (!$.defaultView(element).getComputedStyle && !defaultView(element).body.currentStyle))
            return;

        var settings = settings || {},
            onComplete = (settings.onComplete != undefined) ? settings.onComplete : $.animationSettings.onComplete,
            to, curClass, curSpecifiers, map, property, index, value, computedStyle,
            mappings = [],
            supRegExp = /^[-\d|\d]+([\D]+)|^[#]([0-9a-fA-F]{3}$|[0-9a-fA-F]{6}$)|^rgb/gi, // units and hex/rgb(a) colors are supported
            elements, classes, classSpecifiers,
            arg = $.each({ el: element, c: cssClass, s: classSpecifier }, function (item, key, object)
            {
                if (!$.isArray(item))
                    object[key] = [item];
            });

        elements = arg.el;
        classes = arg.c || [];
        classSpecifiers = arg.s || [];

        for (index = 0; index < elements.length; ++index)
        {
            map = mappings[index] = {};
            curClass = (classes.length > index) ? classes[index] : classes[classes.length - 1];
            curSpecifiers = (classSpecifiers.length > index) ? classSpecifiers[index] : classSpecifiers[classSpecifiers.length - 1];
            to = $.getDocument().createElement(elements[index].nodeName);
            $.getDocument().body.appendChild(to);

            to.className = elements[index].className;
            assignClasses(to, curClass.split(' '), curSpecifiers);
            computedStyle = $.defaultView(element).getComputedStyle(to, null);

            for (property in computedStyle)
            {
                if (/^[\d]+$/g.test(property))
                {
                    property = computedStyle[property].replace(/(\-([a-z]){1})/g, function (match) { return match.substring(1).toUpperCase() });
                }

                value = computedStyle[property];

                if (value && (property == 'display' || property == 'visibility' || supRegExp.test(value)))
                    map[property] = value;
            }

            to.parentNode.removeChild(to);
        }

        settings.onComplete = function ()
        {
            for (index = 0; index < elements.length; ++index)
            {
                curClass = (classes.length > index) ? classes[index] : classes[classes.length - 1];
                curSpecifiers = (classSpecifiers.length > index) ? classSpecifiers[index] : classSpecifiers[classSpecifiers.length - 1];
                map = (mappings.length > index) ? mappings[index] : mappings[mappings.length - 1];

                assignClasses(elements[index], curClass.split(' '), curSpecifiers);

                for (property in map)
                {
                    elements[index].style[property] = '';
                }
            }

            if (onComplete)
                onComplete();
        }

        return $.animate(elements, mappings, settings);

        function assignClasses(e, c, s)
        {
            $.each(c, function (c)
            {
                if (s && s[c] && s[c].toLowerCase() == 'add')
                    $.addClass(e, c);
                else if (s && s[c] && s[c].toLowerCase() == 'remove')
                    $.removeClass(e, c);
                else
                    $.toggleClass(e, c);
            });
        }
    }

    /** 
    * Animates the element(s) by transitioning the current property values to the specified values.
    * When both elements and properties are passed as array they will be matched on array index, otherwise the element(s) will use the properties object.
    * @param {HTMLElement|HTMLElement[]} element Element.
    * @param {Object|Object[]} properties Properties.
    * A single property can be specified in two ways.
    * property: value
    * property: [value, settings] Animation settings or a numeric value to specify the duration only.
    * @param {componyx.library.animationSettings|Number} settings Animation settings or a numeric value to specify the duration only.
    * @returns {componyx.library.Animation} The Animation object.
    */
    $.animate = function (element, properties, settings)
    {
        return _animation.start(element, properties, settings);
    }

    /** 
    * Moves array elements from one position to another.
    * @param {Array} list The array.
    * @param {Number} index The position index of the element to move.
    * @param {Number} targetIndex The position index where the elements are placed (current index in the array before moving).
    * @param {Number} [amount=1] The number of elements to be moved.
    * @returns {Number} The new index of the moved element(s). The index changes when elements are moved from top to bottom because the array will be re-ordered.
    */
    $.move = function (list, index, targetIndex, amount)
    {
        if (targetIndex < index)
            Array.prototype.splice.apply(list, [targetIndex, 0].concat(list.splice(index, amount || 1)));
        else // in this case we do not use splice removement before adding, because it reorders the array which invalidates the specified targetIndex
        {
            var i = -1, temp = [];
            while (++i < amount)
                temp.push(list[index + i]);

            Array.prototype.splice.apply(list, [targetIndex, 0].concat(temp));
            list.splice(index, amount);
            targetIndex -= amount;
        }

        return targetIndex;
    };

    /** 
    * Iterates through the items of the object or array and invokes the handler while passing in the item value, item key/index, the object/array and optional extra arguments.
    * @param {Object|Array} object An object or array to iterate or a settings object holding the properties to configure the each call.
    * @param {componyx.library.EachCallback} callback A delegate handler that is invoked for each item.
    * @param {Array} [args] An array of extra arguments to pass to the handler.
    * @param {Number} [startIndex] The start position of the iteration when dealing with an Array type.
    * @param {Boolean} [manualFetching] A value indicating if manual fetching is required. This allows asynchronous code execution while performing an iteration. The fetcher method to manually move the iterator to the next item is passed to the handler as fifth argument.
    * @param {Function} [last] A callback method to invoke when manualFetching is enabled and the last item has been iterated.
    * @param {Boolean} [reverse] A value indicating if the iteration should move backwards. Reverse iteration is supported for arrays, and for objects only when manualFetching is true.
    * @example
     * // Traditional usage (positional arguments)
     * $.each(['item-1', 'item-2'], (item, index, array, args) => { },['arg-1'], 0, false, null, false);
     * @example
     * // Using a settings object (all parameters are optional and can be selectively provided)
     * $.each({
     *   object: ['item-1', 'item-2'],
     *   handler: (item, index, array, args) => { },
     *   args: ['arg-1'],
     *   startIndex: 0,
     *   manualFetching: false,
     *   last: null,
     *   reverse: false
     * });
    */
    $.each = function (object, callback, args, startIndex, manualFetching, last, reverse)
    {
        if (!object)
            return;

        if (arguments.length === 1 && $.isPlainObject(object))
        {
            ({ object, callback, args, startIndex, manualFetching, last, reverse } = object);
        }

        let key,
            index = (startIndex !== undefined) ? startIndex : (reverse ? (object.length - 1) : 0),
            length = object.length,
            isObject = (typeof length != 'number'), keys = [], next,
            isEmpty = function (length, last)
            {
                if (!length)
                {
                    if (last)
                        last();

                    return true;
                }
                else
                    return false;
            };

        if (manualFetching)
        {
            if (reverse)
                ++index;
            else
                --index;

            if (isObject)
            {
                for (key in object)
                    keys.push(key);

                length = keys.length;

                if (isEmpty(length, last))
                    return;

                next = function (object, index, keys, args, length, last)
                {
                    if (reverse)
                        --index;
                    else
                        ++index;

                    if ((!reverse && index < length) || (reverse && index >= 0))
                        callback(object[keys[index]], keys[index], object, args, function () { next(object, index, keys, args, length, last); });
                    else if (last)
                        last();
                };
                next(object, index, keys, args, length, last);
            }
            else
            {
                if (isEmpty(length, last))
                    return;

                next = function (object, index, args, length, last)
                {
                    if (reverse)
                        --index;
                    else
                        ++index;

                    if ((!reverse && index < length) || (reverse && index >= 0))
                        callback(object[index], index, object, args, function () { next(object, index, args, length, last); });
                    else if (last)
                        last();
                };
                next(object, index, args, length, last);
            }

            return object;
        }

        if (isObject)
        {
            for (key in object)
            {
                if (callback(object[key], key, object, args) === false)
                {
                    break;
                }
            }
        }
        else
        {
            for (; (reverse) ? index >= 0 : index < length; (reverse) ? --index : ++index)
            {
                if (callback(object[index], index, object, args) === false)
                {
                    break;
                }
            }
        }

        return object;
    }

    /**
     * Copies properties from the source object (or function) to the target object. 
     * Supports deep cloning, conditionally overwriting properties, circular reference protection and excluding specific values or types.
     * @param {Object|Object} target - The target object to which properties will be copied, or a settings object holding all configuration options.
     * @param {Object} [source] - The source object whose properties will be cloned to the target.
     * @param {boolean} [deep=false] - If true, perform a deep copy (recursive cloning).
     * @param {number|boolean} [overwrite=false] - Specifies how to overwrite existing properties on the target:
     *   - `0` or `false`: Do not overwrite existing properties.
     *   - `1` or `true`: Overwrite existing properties.
     *   - `2`: Overwrite only if the target property is `null` or `undefined`.
     * @param {boolean} [extend=true] - If true, new properties from the source will be added to the target object.
     * @param {boolean} [excludeEmpty=false] - Defines if null, undefined, or empty values should be excluded from the source object:
     *   - `false`: Include null, undefined, or empty values.
     *   - `true`: Exclude null, undefined, or empty values.
     *   - `2`: Exclude when the target is a plain object type (clones value types only).
     * @param {boolean} [excludeFunctions=false] - If true, function properties will not be copied.
     * @param {Array.<Array>} [exclude] - Tracks visited/excluded objects to handle circular references. [0] the object to match, [1] the object to return.
     * @param {Set|Object} [omit] - A Set or Object specifying keys to omit from the source object.
     * @param {Object<string, Function>} [types] -  An object mapping type names to their constructor functions. 
     * @param {string} [typeCheck="constructor"] - How to determine type names: `"constructor"` (default) or a property name on the source.
     * @param {Object} [converter] - An object mapping source keys to custom converter functions.
     * @param {Object} [report] - An optional object used to report whether any target values were actually changed during cloning. If provided, its `changed` property is set to `true` the moment any property on the target is written.
     * @returns {Object} The updated target object after cloning.
     *
     * @example
     * // Traditional usage (positional arguments)
     * $.clone(target, source, true, 1, true, false, false, [], new Set(), { MyType: MyClass }, {});
     *
     * @example
     * // Using a settings object (all parameters are optional and can be selectively provided)
     * $.clone({
     *   target: target,
     *   source: source,
     *   deep: true,
     *   overwrite: 1,
     *   extend: true,
     *   excludeEmpty: false,
     *   excludeFunctions: false,
     *   exclude: [],
     *   omit: new Set(['password']),
     *   types: { MyType: MyClass },
     *   typeCheck: "type"
     *   converter: { date: (val) => new Date(val) },
     *   report: { changed: false }
     * });
     */
    $.clone = function (target, source, deep, overwrite, extend, excludeEmpty, excludeFunctions, exclude, omit, types, typeCheck, converter, report)
    {
        let config, realObj = {};

        if (arguments.length === 1 && $.isPlainObject(target))
            config = target;
        else
            config = { target, source, deep, overwrite, extend, excludeEmpty, excludeFunctions, exclude, omit, types, typeCheck, converter, report };

        // initialize clone settings
        config.overwrite = (config.overwrite != undefined) ? config.overwrite : 0;
        config.extend = (config.extend != undefined) ? config.extend : true;
        config.excludeEmpty = (config.excludeEmpty != undefined) ? config.excludeEmpty : 0;

        if (!config.exclude)
            config.exclude = [];

        if (!config.omit)
            config.omit = new Set();
        else if (!(config.omit instanceof Set))
            config.omit = new Set(Object.keys(config.omit));

        if (!config.converter)
            config.converter = {};

        if (typeof (config.overwrite) == 'boolean')
            config.overwrite = (config.overwrite) ? 1 : 0;

        if (typeof (config.excludeEmpty) == 'boolean')
            config.excludeEmpty = (config.excludeEmpty) ? 1 : 0;

        if (typeof (config.source) == 'function')
        {
            // applies only to root object
            config.source.apply(realObj);
            config.source = realObj;
        }

        return _clone(config);
    };

    /** 
    * Returns the name of the object's constructor.
    * @param {Object} obj The Object to check.
    * @returns {String} The constructor name.
    */
    $.getConstructor = function (obj)
    {
        return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
    }

    /** 
    * Gets the type of the object.
    * @param {Object} obj The Object to check.
    * @returns {String} Returns the object type as string.
    */
    $.type = function (obj)
    {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    }

    /** 
    * Gets the object's prototype.
    * 
    * @param {Object} obj The Object from which the prototype is returned.
    * @returns {Object} Returns the object's prototype.
    */
    $.getPrototypeOf = function (obj)
    {
        return (obj.constructor && obj.constructor.prototype) || obj.__proto__ || obj.prototype || Object.prototype;
    }

    /** 
    * Checks if the passed object/array/string is null or empty.
    * @param {Object} obj The Object to check.
    * @param {Boolean} trim Removes leading and trailing white space characters, new lines and tabs from the specified string (Defaults to true).
    * @returns {Boolean} Returns true if the specified object is null or empty, otherwise false.
    */
    $.isEmpty = function (obj, trim)
    {
        if (typeof (obj) == 'undefined' || obj == null)
            return true;
        else if (typeof (obj) == 'string')
            return (trim === false) ? (obj == "") : ($.trim(obj) == "");
        else if (typeof (obj) == 'number' || typeof (obj) == 'boolean')
            return false;
        else if ($.isArray(obj))
            return (obj.length == 0);

        if ($.isDOM(obj))
            return false

        if ($.isPlainObject(obj))
            return Object.keys(obj).length === 0;

        return false;
    }

    /** 
    * Checks if the passed object is a plain object.
    * @param {Object} obj The Object to check.
    * @param {Boolean} strict A value indicating if custom class objects should NOT be considered a plain object.
    * @returns {Boolean} Returns true if the specified object is a plain object, otherwise false.
    */
    $.isPlainObject = function (obj, strict = false)
    {
        const isPlain = (obj && $.type(obj) == 'object');

        if (!isPlain || !strict)
            return isPlain;

        return obj.constructor === Object || obj.constructor == null;
    }

    /** 
    * Checks if the passed object is a primative type.
    * @param {Object} obj The Object to check.
    * @returns {Boolean} Returns true if the specified object is a primative type, otherwise false.
    */
    $.isPrimitive = function (obj)
    {
        return (obj !== Object(obj));
    }

    /** 
    * Checks if the passed object is an XML element.
    * 
    * @param {Object} obj The Object to check.
    * @returns {Boolean} Returns true if the specified object is an XMLElement, otherwise false.
    */
    $.isXMLElement = function (obj)
    {
        var documentElement = (obj ? obj.ownerDocument || obj : 0).documentElement;
        return documentElement ? documentElement.nodeName !== "HTML" : false;
    }

    /** 
    * Checks if the passed object is an HTML element.
    * 
    * @param {Object} obj The Object to check.
    * @returns {Boolean} Returns true if the specified object is an HTMLElement, otherwise false.
    */
    $.isElement = function (obj)
    {
        return ($.defaultView(obj) && obj instanceof $.defaultView(obj).HTMLElement);
    }

    /** 
    * Checks if the specified object is a DOM object.
    * @param {Object} obj The Object to check.
    * @returns {Boolean} Returns true if the specified object is a DOM object, otherwise false.
    */
    $.isDOM = function (obj)
    {
        return ($.defaultView(obj) && obj instanceof $.defaultView(obj).Node);
    }

    /**
     * Returns the window object associated with the specified node.
     * @param {Node} node The node for which to return the associated window object.
     * @returns {Window} The window object associated with the specified node or null if specified obj is not of type Node.
     */
    $.defaultView = function (node)
    {
        let check = function (n) { return '[object HTMLDocument]'.indexOf(Object.prototype.toString.call(n)) > -1 };
        return (node && node.ownerDocument && check(node.ownerDocument)) ? node.ownerDocument.defaultView || null : (node && check(node)) ? node.defaultView || null : null;
    }

    /** 
    * Checks if the passed object is an array.
    * @param {Object} obj The Object to check.
    * @returns {Boolean} Returns true if the specified object is an array, otherwise false.
    */
    $.isArray = Array.isArray;
    
    /** 
    * Checks if the passed object is a date.
    * @param {Object} obj The Object to check.
    * @returns {Boolean} Returns true if the specified object is a Date, otherwise false.
    */
    $.isDate = function (obj)
    {
        const DateCtor = $.getDocument().defaultView.Date;
        return (obj instanceof DateCtor);
    }

    /** 
    * Adds a handler which fires when the document is ready for manipulation, but before all resources have been loaded.
    * @param {Function} handler A handler.
    * @param {Array} args An array of arguments that should be passed to the handler.
    * @param {Object} context The execution context object on which the handler is applied.
    */
    $.ready = function (handler, args, context)
    {
        var self = this, obj = { handler: handler, args: args, object: context || window };

        // If document is already loaded, execute immediately
        if (document.readyState === "interactive" || document.readyState === "complete")
        {
            invoke(obj, null);
            return;
        }

        if (!this.handlers)
        {
            this.handlers = [];
            $.getDocument().addEventListener("DOMContentLoaded", DOMContentLoaded, false);

        }

        this.handlers.push(obj);

        function DOMContentLoaded(e)
        {
            $.getDocument().removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
            ready(e);
        }

        function ready(e)
        {

            $.each(self.handlers, function (object)
            {
                invoke(object, e);
            });
        }

        function invoke(object, e)
        {
            if (object.args)
            {
                object.args.push(e);
                object.handler.apply(object.object, object.args);
            }
            else
                object.handler(e);
        }
    }

    /** 
    * Attaches a fire once event handler to the specified object event(s).
    * @param {HTMLElement|Object} obj HTMLElement or object.
    * @param {String} eventType One or more event types separated by a space.
    * @param {Function} handler A method containing executable code.
    * @param {Object[]} [args] An array of arguments that should be passed to the event handler.
    * @param {Object} [context] The execution context object on which the handler is applied, by default the DOM element/object on which the event is fired.
    * @param {Boolean} [unique=false] A value indicating if event handlers for a specific object and event-type should exist only once.
    * @returns {String} The generated guid of the handler.
    */
    $.once = function (obj, eventType, handler, args, context, unique)
    {
        return $.on(obj, eventType, handler, args, context, unique, true);
    }

    /** 
    * Attaches an event handler to the specified object event(s).
    * @param {HTMLElement|Object|Object} obj HTMLElement, object, or settings object.
    * @param {String} eventType One or more event types separated by a space.
    * @param {Function} handler A method containing executable code.
    * @param {Object[]} [args] An array of arguments that should be passed to the event handler.
    * @param {Object} [context] The execution context object on which the handler is applied.
    * @param {Boolean} [unique=false] If true, only one handler per GUID is allowed.
    * @param {Boolean} [fireOnce=false] If true, handler is removed after first run.
    * @param {Object} [options] Native addEventListener options (capture, passive, once).
    * @returns {String} The generated guid of the handler.
    */
    $.on = function (obj, eventType, handler, args, context, unique, fireOnce, options)
    {
        if (arguments.length === 1 && $.isPlainObject(obj)) // support settings object
            ({ obj, eventType, handler, args, context, unique, fireOnce, options } = obj);

        let eventTypes = eventType.split(' '),
            guid = _setGUID(handler);

        args = (args != undefined) ? args : null;
        args = _toArray(args);

        $.each(eventTypes, function (orgEventType)
        {
            let evtType = _translateEventType(orgEventType);

            if (!obj.__events)
                obj.__events = {};

            if (!obj.__events[evtType])
            {
                obj.__events[evtType] = new Map();

                if (obj[evtType])
                    obj.__events[evtType].set('0', [{ handler: obj[evtType], args: null }]);
            }

            let current = obj.__events[evtType].get(guid);

            if (!current)
                obj.__events[evtType].set(guid, current = []);

            if (current.length == 0 || !unique || options)
            {
                let listenerMethod = null;

                if ($.isDOM(obj) || '[object Window][object DOMWindow]'.indexOf(Object.prototype.toString.call(obj)) > -1)
                {
                    if (options)
                    {
                        listenerMethod = function (e)
                        {
                            let allArgs = args ? args.slice() : [];
                            allArgs.push(e);
                            handler.apply(context || obj, allArgs);
                        };
                        obj.addEventListener(orgEventType, listenerMethod, options);

                        _getNativeListeners(obj).push({
                            type: orgEventType,
                            handlerGuid: guid,
                            listener: listenerMethod,
                            options: options
                        });
                    }
                    else if (evtType in obj)
                    {
                        obj[evtType] = _handleEvent.bind(obj);
                    }
                    else if (current.length == 0)
                    {
                        listenerMethod = _handleEvent.bind(obj);
                        obj.addEventListener(orgEventType, listenerMethod);
                        _getNativeListeners(obj).push({
                            type: orgEventType,
                            handlerGuid: guid,
                            listener: listenerMethod,
                            options: false
                        });
                    }
                }
                else
                {
                    obj[evtType] = _handleEvent.bind(obj, { type: evtType }, obj);
                }

                current[current.length] = { handler: handler, context: context, args: args, fireOnce: fireOnce, orgEventType: orgEventType, listenerMethod: listenerMethod };
            }
        });

        return guid;
    }

    /** 
    * Checks if the event handler is attached to the object for the specified event type.
    * @param {HTMLElement|Object} obj HTMLElement or object.
    * @param {String} eventType Event type.
    * @param {Function|String} handler The handler or the handler guid returned from the bind method.
    * @returns {Boolean} True if the handler is bound, otherwise false.
    */
    $.has = function (obj, eventType, handler)
    {
        var guid = (typeof (handler) == "string") ? handler : _getGUID(handler);

        if ($.isEmpty(guid))
            return false;

        eventType = _translateEventType(eventType);
        return (obj.__events && obj.__events[eventType] && obj.__events[eventType].has(guid)) ? true : false;
    }

    /** 
    * Removes the attached event handler from the object for the specified type.
    * @param {HTMLElement|Object} obj HTMLElement or object.
    * @param {String} [eventType] Event type. Ommit to remove all bounded event handlers.
    * @param {Function|String} [handler] The handler or the guid of the handler to remove. Ommit to remove all bounded event handlers for the specified event type.
    */
    $.off = function (obj, eventType, handler)
    {
        var guid = (!handler || typeof (handler) == "string") ? handler : _getGUID(handler),
            eventType = ($.isEmpty(eventType)) ? null : eventType,
            current;

        if (!obj.__events || (handler && $.isEmpty(guid)))
            return;

        if (eventType)
        {
            $.each(eventType.split(' '), function (eventType)
            {
                eventType = _translateEventType(eventType);

                if ($.isEmpty(guid))
                {
                    current = obj.__events[eventType];

                    if (current)
                    {
                        current.forEach(function (handler, guid, mapObj)
                        {
                            $.off(obj, eventType, guid);
                        });
                    }

                    delete obj.__events[eventType];
                    delete obj[eventType];
                }
                else
                {
                    if ($.has(obj, eventType, guid))
                        _removeHandler(obj, eventType, guid);
                }
            });
        }
        else
        {
            $.each(obj.__events, function (current, eventType)
            {
                if (current)
                {
                    current.forEach(function (handler, guid, mapObj)
                    {
                        _removeHandler(obj, eventType, guid);
                    });
                }

                delete obj[eventType];
            });

            delete obj.__events;
            _nativeListeners.delete(obj);
        }
    }

    /** 
    * Copies the events from the source to the target object.
    * @param {HTMLElement|Object} target HTMLElement or object.
    * @param {HTMLElement|Object} source HTMLElement or object.
    * @returns {HTMLElement|Object} The target HTMLElement or object.
    */
    $.copyEvents = function (target, source)
    {
        var events = source.__events;

        $.each(events, function (e, eventType)
        {
            if (e)
            {
                e.forEach(function (handler, guid, mapObj)
                {
                    $.each(handler, function (h, index)
                    {
                        $.on(target, eventType, h.handler, h.args, h.context, false, h.fireOnce);
                    });
                });
            }
        });

        return target;
    }

    /** 
    * Fires the HTML event of the specified type on the element
    * @param {HTMLElement} element DOM element
    * @param {String} type HTMLEvent type
    * @param {Boolean} [bubbles=false] A value indicating whether the event should bubble up through the event chain or not.
    * @param {Boolean} [cancelable=false] A value indicating whether the event can be cancelled.
    * @param {Object} [properties] Properties with which the event object will be extended.
    */
    $.fireEvent = function (element, type, bubbles, cancelable, properties)
    {
        bubbles = bubbles || false;
        cancelable = cancelable || false;

        var e = new CustomEvent(type, { "bubbles": bubbles, "cancelable": cancelable });

        if (properties)
            $.clone(e, properties);

        return element.dispatchEvent(e);
    }

    /**
    * Global HTTP(S) request events for the following methods: xhr(), addCssSource() and addScriptSource().
    * @typedef {Object} componyx.library.httpRequestHandlers
    * @property {componyx.library.Event} onStart             - Event which fires before an HTTP request.
    * @property {componyx.library.Event} onComplete          - Event which fires after an HTTP request.
    * @property {componyx.library.Event} onSuccess           - Event which fires when an HTTP request was successful (status 200).
    * @property {componyx.library.Event} onError             - Event which fires when an HTTP request returned an error.
    * @property {componyx.library.Event} onAbort             - Event which fires when an HTTP request is aborted.
    */
    $.httpRequestHandlers =
    {
        onStart: $.createEvent('onStart'),
        onComplete: $.createEvent('onComplete'),
        onSuccess: $.createEvent('onSuccess'),
        onError: $.createEvent('onError'),
        onAbort: $.createEvent('onAbort')
    }

    /**
    * Global XMLHttpRequest (AJAX) settings which apply to all xhr requests, unless overridden on the xhr method call.
    * @typedef {Object} componyx.library.xhrSettings
    * @memberof componyx.library
    * @property {XMLHttpRequest} xhr Object instance to use for the xhr request.
    * @property {String} url Defines the uniform resource locator.
    * @property {String|Object|FormData} data Defines the data to send with the request as URL parameters or JSON String/Object.
    * @property {String} responseType Defines the type of the response. 
    * @property {String} method Defines the HTTP request method (GET or POST). The setting requestMethod is supported for backwards compatibility.
    * @property {String} contentType Defines the HTTP request content type. The setting requestContentType is supported for backwards compatibility.
    * @property {Object} headers Defines the HTTP request headers (key value pair). The setting requestHeaders is supported for backwards compatibility.
    * @property {String} jsonResponseDataWrapper Defines the JSON response data wrapper. e.g. ASP.NET uses d as default data wrapper.
    * @property {Function} jsonDeserializer Defines the custom JSON deserializer method.
    * @property {Boolean} jsonParseWrappedDataString Defines if the data within the JSON response data wrapper should be parsed again if it is of type String.
    * @property {Boolean} async Defines if the request is synchronous or asynchronous (default).
    * @property {Number} timeout Defines the timeout in milliseconds before the request is aborted.
    * @property {Number} repeatInterval Defines the interval in milliseconds between repeating xhr requests.
    * @property {componyx.library.XhrCallback} onStart Defines the callback function to call before the request.
    * @property {componyx.library.XhrCallback} onComplete Defines the callback function to call after the request.
    * @property {componyx.library.XhrCallback} onSuccess Defines the callback function to call when the request was successful.
    * @property {componyx.library.XhrCallback} onError the callback function to call when the HTTP request failed. (HTTP status >= 200 and < 300).
    * @property {componyx.library.XhrCallback} onAbort Defines the callback function to call when the request was aborted.
    * @property {componyx.library.XhrCallback} onProgress Defines the callback function to call when there is a change in the download progress.
    * @property {componyx.library.XhrCallback} onUploadProgress Defines the callback function to call when there is a change in the upload progress.
    * @property {componyx.library.XhrCallback} onUploadError Defines the callback function to call when the upload failed.
    */
    $.xhrSettings =
    {
        xhr: null,
        url: null,
        data: null,
        responseType: null,
        method: 'POST',
        contentType: '',
        headers: null,
        jsonResponseDataWrapper: '',
        jsonDeserializer: null,
        jsonParseWrappedDataString: true,
        async: true,
        timeout: null,
        repeatInterval: null,
        onStart: null,
        onComplete: null,
        onSuccess: null,
        onError: null,
        onAbort: null,
        onProgress: null,
        onUploadProgress: null,
        onUploadError: null
    }

    /** Adds the (X)HTML data to the specified element(s) and loads contained script and CSS resources.
    * @param {String} html The HTML string to add.
    * @param {HTMLElement} [element] The Element to which the html will be appended.
    * @param {Object} [mapping] A mapping object where the key refers to the id of the source element and the value refers to the target element or element id.
    * @param {Function} [onComplete] Event callback method which is invoked when the html data is added and the resources are loaded.
    */
    $.addHTML = function (html, element, mapping, onComplete)
    {
        var temp, key, value, source, target, tag, nodeName, head, sheet, args = {},
            cssText = [], tags = [], css = 0, scripts = 0, scriptsLoaded = 0, cssLoaded = 0;

        temp = $.getDocument().createElement('div');
        temp.style.display = 'none';
        temp.innerHTML = html;
        args.title = temp.getElementsByTagName('title')[0];

        if (args.title)
            args.title = args.title.textContent;

        // remove possible head tags
        $(function (tag) { tags.push(tag); }, temp, 'base meta title');
        $.each(tags, function (tag) { $.remove(tag); });
        tags = [];
        // get script and css tags
        $(function (tag) { tags.push(tag); }, temp, 'script link style'); // find resources

        // store clean html, script and css tags
        args.html = temp.innerHTML;
        args.script = [];
        args.css = [];
        args.element = element;

        for (var index = 0; index < tags.length; ++index)
        {
            tag = tags[index];
            $.remove(tag);

            if (!$.isEmpty(tag.id) && $('#' + tag.id))
                continue;

            nodeName = tag.nodeName.toLowerCase();

            if (nodeName == 'script')
            {
                if (tag.src)
                {
                    ++scripts;
                    args.script.push($.addScriptSource(tag.src, tag.id, {
                        onComplete: function ()
                        {
                            $.defer(function ()
                            {
                                ++scriptsLoaded;
                                callback();
                            });
                        }
                    }, false, false));
                }
                else if (tag.text)
                    args.script.push(tag);
            }
            else if (nodeName == 'link' && tag.rel == "stylesheet" && tag.href)
            {
                ++css;
                args.css.push($.addCssSource(tag.href, tag.id, {
                    onComplete:
                        function ()
                        {
                            $.defer(function ()
                            {
                                ++cssLoaded;
                                callback();
                            });
                        }
                }));
            }
            else if (nodeName == 'style')
            {
                args.css.push($.addCssTag(tag.innerHTML, tag.id));
            }
        }

        if (css + scripts == 0)
            callback();

        function callback()
        {
            if (cssLoaded == css && scriptsLoaded == scripts)
            {
                if (mapping)
                {
                    for (key in mapping)
                    {
                        if (source = $('#' + key))
                        {
                            value = mapping[key];
                            target = (typeof (value) == 'string') ? $('#' + value) : value;
                            target.appendChild(source);
                        }
                    }
                }
                else if (element)
                    element.innerHTML = temp.innerHTML;

                // inline scripts are delayed because they are executed directly while they might have script src dependencies
                $.each(args.script, function (tag, index)
                {
                    if (tag.text)
                        args.script[index] = $.addScriptTag(tag.text, tag.id);
                })

                if (onComplete)
                    onComplete(args);
            }

        }
    }

    /** Loads (X)HTML data through an XML HTTP request and adds the data to the current document with the addHTML method (view addHTML comments for more info).
    * @param {componyx.library.xhrSettings} settings The Settings which configure the xhr request. (view XhrSettings)
    * @param {HTMLElement} element The Element to which the html will be appended.
    * @param {Object} [mapping] A mapping object where the key refers to the id of the source element and the value refers to the target element or element id.
    * @returns {componyx.library.XhrWrappedResult} An object wrapped around the xhr object.
    */
    $.load = function (settings, element, mapping)
    {
        var onSuccess = (settings.onSuccess != undefined) ? settings.onSuccess : $.xhrSettings.onSuccess;

        settings.method = (settings.method || settings.requestMethod || 'GET');

        settings.onSuccess = function (args)
        {
            $.addHTML(args.data, element, mapping, function (a)
            {
                args.title = a.title;
                args.html = a.html;
                args.css = a.css;
                args.script = a.script;
                args.element = a.element;

                if (onSuccess)
                    onSuccess(args);
            });
        }

        return $.xhr(settings);
    }

    /** Executes an XMLHTTP (AJAX) request.
    * @param {componyx.library.xhrSettings} settings The settings which configure the xhr request (view xhrSettings).
    * @returns {componyx.library.XhrWrappedResult} An object wrapped around the xhr object.
    */
    $.xhr = function (settings)
    {
        var xhr, pollTimer, abort, timeout, errorHandler, repeat = true, type, doc = $.getDocument(),
            contentTypes =
            {
                HTML: 'text/html',
                XML1: 'text/xml',
                XML2: 'application/xml',
                JSON: 'application/json',
                FORMURL: 'application/x-www-form-urlencoded'
            },
            setHandler = function (name) { return (settings[name] != undefined) ? settings[name] : $.xhrSettings[name] };

        settings = settings || {};

        settings =
        {
            xhr: settings.xhr || $.xhrSettings.xhr,
            url: settings.url || $.xhrSettings.url,
            data: settings.data,
            responseType: settings.responseType || $.xhrSettings.responseType,
            method: (settings.method || settings.requestMethod || $.xhrSettings.method || $.xhrSettings.requestMethod || 'POST').toUpperCase(),
            contentType: (settings.contentType || settings.requestContentType || $.xhrSettings.contentType || $.xhrSettings.requestContentType || '').toUpperCase(),
            headers: settings.headers || settings.requestHeaders || $.xhrSettings.headers || $.xhrSettings.requestHeaders,
            jsonResponseDataWrapper: settings.jsonResponseDataWrapper || $.xhrSettings.jsonResponseDataWrapper,
            jsonDeserializer: settings.jsonDeserializer || $.xhrSettings.jsonDeserializer,
            jsonParseWrappedDataString: (typeof settings.jsonParseWrappedDataString != 'undefined') ? settings.jsonParseWrappedDataString : $.xhrSettings.jsonParseWrappedDataString,
            async: (typeof settings.async != 'undefined') ? settings.async : $.xhrSettings.async,
            timeout: settings.timeout || $.xhrSettings.timeout,
            repeatInterval: settings.repeatInterval || $.xhrSettings.repeatInterval,
            onStart: setHandler('onStart'),
            onComplete: setHandler('onComplete'),
            onSuccess: setHandler('onSuccess'),
            onError: setHandler('onError'),
            onAbort: setHandler('onAbort'),
            onProgress: setHandler('onProgress'),
            onUploadProgress: setHandler('onUploadProgress'),
            onUploadError: setHandler('onUploadError')
        }

        xhr = settings.xhr;

        if (!xhr)
            xhr = settings.xhr = new doc.defaultView.XMLHttpRequest();

        if (!settings.contentType)
        {
            type = contentTypes.JSON;

            if (settings.method == 'GET' || (typeof settings.data == 'string' && !$.startsWith(settings.data, '{')))
                type = contentTypes.FORMURL;
            else if (settings.data instanceof FormData)
                type = null;

            settings.contentType = type;
        }

        // xhr 2 settings and events
        if (settings.responseType)
            xhr.responseType = settings.responseType;

        return send();

        function send()
        {
            var args = { xhr: xhr || null, data: null, timeout: null, event: null, settings: settings }, ready,
                fire = function (eventName, args)
                {
                    if (settings[eventName])
                        settings[eventName](args);

                    if ($.httpRequestHandlers[eventName])
                        $.httpRequestHandlers[eventName].fire(window, args);
                },
                parse = function (data, jsonDeserializer)
                {
                    return (jsonDeserializer) ? jsonDeserializer(data) : $.getDocument().defaultView.JSON.parse(data);
                };

            if (settings.onError || $.httpRequestHandlers.onError.isBound())
                errorHandler = true;

            if (xhr.upload) // XHR 2 support
            {
                if (settings.onProgress)
                {
                    xhr.onprogress = function (event)
                    {
                        args.event = event;
                        fire('onProgress', args);
                    }
                }

                if (settings.onUploadProgress)
                {
                    xhr.upload.onprogress = function (event)
                    {
                        args.event = event;
                        fire('onUploadProgress', args);
                    };
                }

                if (settings.onUploadError)
                {
                    xhr.upload.onerror = function (event)
                    {
                        args.event = event;
                        fire('onUploadError', args);
                    };
                }
            }

            fire('onStart', args);

            var stateChange = xhr.onreadystatechange = function ()
            {
                var data, contentType = null, wrap = settings.jsonResponseDataWrapper, status;

                if (abort || timeout || xhr.readyState == 4)
                {
                    ready = true;
                    args.timeout = timeout;
                    xhr.onreadystatechange = null;
                    status = xhr.status;

                    if (abort)
                    {
                        fire('onAbort', args);
                        return;
                    }

                    if (status >= 200 && status < 300 || status === 304)
                    {
                        data = xhr.responseText;

                        if (xhr.responseText != '') // parse xml or json response
                        {
                            contentType = xhr.getResponseHeader('content-type');

                            if (contentType && xhr.responseXML && (contentType.toLowerCase().indexOf(contentTypes.XML1) > -1 || contentType.toLowerCase().indexOf(contentTypes.XML2) > -1))
                            {
                                data = xhr.responseXML.documentElement;
                            }
                            else if (contentType && contentType.toLowerCase().indexOf(contentTypes.JSON) > -1)
                            {
                                data = xhr.responseText;

                                if (!$.isEmpty(data))
                                {
                                    data = parse(data, settings.jsonDeserializer);

                                    if (!$.isEmpty(data) && $.isPlainObject(data) && wrap && data[wrap] !== undefined)
                                    {
                                        data = data[wrap];

                                        if (typeof (data) == 'string' && !$.isEmpty(data) && settings.jsonParseWrappedDataString)
                                            data = parse(data, settings.jsonDeserializer);
                                    }
                                }
                            }
                        }

                        args.data = data;
                        fire('onSuccess', args);
                    }
                    else
                    {
                        var message = 'XHR failed. \n';

                        if (timeout)
                            message = 'XHR timed out after ' + settings.timeout + ' ms. \n';

                        $.log(message + 'Status: ' + xhr.status + ' ' + xhr.statusText);

                        if (errorHandler)
                            fire('onError', args);
                    }

                    fire('onComplete', args);

                    if (repeat && !$.isEmpty(settings.repeatInterval))
                        pollTimer = setTimeout(function () { send(); }, settings.repeatInterval);
                }
            }

            if (settings.timeout && settings.timeout > 0)
            {
                xhr.timeout = settings.timeout;
                xhr.ontimeout = function ()
                {
                    if (!ready)
                    {
                        timeout = true;
                        stateChange();
                    }
                };
            }

            if (settings.method == 'GET')
            {
                if ($.isPlainObject(settings.data))
                {
                    var params = [];
                    $.each(settings.data, function (value, key)
                    {
                        params.push(key + '=' + encodeURIComponent(value));
                    });
                    settings.url += '?' + params.join('&');
                }
                else if (settings.data)
                {
                    if (settings.data.match(/^\?|^\&/))
                        settings.data = settings.data.substring(1);

                    settings.url += '?' + settings.data;
                }
            }

            xhr.open(settings.method, settings.url, settings.async);

            // add custom request headers
            $.each(settings.headers, function (header, value)
            {
                xhr.setRequestHeader(header, value);
            });

            if (settings.method == 'GET')
            {
                xhr.send(null);
            }
            else
            {
                if (settings.contentType)
                    xhr.setRequestHeader("Content-Type", settings.contentType);

                xhr.send(($.isPlainObject(settings.data) ? $.getDocument().defaultView.JSON.stringify(settings.data) : settings.data || null));
            }

            if (!settings.async)
                stateChange();

            var result =
            {
                abort: function (stopRepeat)
                {
                    if (stopRepeat)
                    {
                        clearTimeout(pollTimer);
                        repeat = false;
                    }

                    abort = true;
                    xhr.abort();
                },
                xhr: xhr,
                settings: settings
            }

            return result;
        }
    }

    /** 
    * Global WebSocket settings which apply to all WebSocket connections, unless overridden on the ws method call.
    * @typedef {Object} wsSettings
    * @memberof componyx.library
    * @property {String} url Defines the uniform resource locator.
    * @property {String} binaryType A value indicating the type of binary data being transmitted by the connection. This should be either "blob" if DOM Blob objects are being used or "arraybuffer" if ArrayBuffer objects are being used.
    * @property {String|JSON} data Defines the initial data to send when the WebSocket connection is opened or retrieved from the pool.
    * @property {Boolean} pooling Defines if only a single WebSocket connection can be opened per client and URL (true by default).
    * @property {Function} onOpen Defines the callback function to call when the WebSocket connection is opened.
    * @property {Function} onClose Defines the callback function to call when the WebSocket connection is closed.
    * @property {Function} onMessage Defines the callback function to call when a message is received.
    * @property {Function} onError Defines the callback function when a WebSocket error occurs.
    */
    $.wsSettings =
    {
        url: null,
        binaryType: null,
        data: null,
        pooling: true,
        onOpen: null,
        onClose: null,
        onMessage: null,
        onError: null
    }

    /** Creates a full-duplex WebSocket TCP connection.
    * @param {componyx.library.wsSettings} settings The settings which configure the WebSocket (view wsSettings).
    * @returns {WebSocket} The WebSocket object.
    */
    $.ws = function (settings)
    {
        var ws, url;

        if (!("WebSocket" in window))
        {
            $.log('WebSocket not supported.');
            return;
        }

        settings =
        {
            url: settings.url || $.wsSettings.url,
            data: settings.data || $.wsSettings.data,
            binaryType: settings.binaryType || $.wsSettings.binaryType,
            pooling: settings.pooling || $.wsSettings.pooling,
            onOpen: (settings.onOpen != undefined) ? settings.onOpen : $.wsSettings.onOpen,
            onClose: (settings.onClose != undefined) ? settings.onClose : $.wsSettings.onClose,
            onMessage: (settings.onMessage != undefined) ? settings.onMessage : $.wsSettings.onMessage,
            onError: (settings.onError != undefined) ? settings.onError : $.wsSettings.onError
        }

        url = settings.url.toLowerCase();

        if (settings.pooling && $.webSockets[url] && $.webSockets[url].readyState <= 1)
        {
            ws = $.webSockets[url];
        }
        else
        {
            ws = new WebSocket(settings.url);

            $.on(ws, 'error', function (e) { $.log(e.message); });

            if (settings.pooling)
            {
                $.webSockets[url] = ws;
                $.on(ws, 'close', function (e) { delete $.webSockets[url]; });
            }
        }

        if (settings.binaryType)
            ws.binaryType = settings.binaryType;

        if (ws.readyState == 1)
            ws.send(settings.data); // send when socket is already open
        else if (settings.onOpen || settings.data)
        {
            $.on(ws, 'open', function (event) // bind to websocket open event
            {
                if (settings.data)
                    ws.send(data);

                if (settings.onOpen && !$.has(ws, 'open', settings.onOpen))
                    settings.onOpen(event);
            });
        }

        if (settings.onClose && !$.has(ws, 'close', settings.onClose))
            $.on(ws, 'close', settings.onClose);

        if (settings.onMessage && !$.has(ws, 'message', settings.onMessage))
            $.on(ws, 'message', settings.onMessage);

        if (settings.onError && !$.has(ws, 'error', settings.onError))
            $.on(ws, 'error', settings.onError);

        return ws;
    }

    /** Adds a script tag with the specified source and id to the page
    * @param {String} src The src of the tag
    * @param {String} id The id of the tag
    * @param {Object} handlers 
    *   @param {Object} handlers.onStart The onStart is called when a new tag is added to the page.
    *   @param {Object} handlers.onComplete The onComplete is called when an HTTP request has finished.
    *   @param {Object} handlers.onError The onError is called when an HTTP request has failed.
    * @param {Boolean} [async] A value indicating if the script should be loaded with the async option (false by default).
    * @param {Boolean} [defer] A value indicating if the script should be loaded with the defer option (false by default).
    * @param {HTMLElement} [before] The new tag will be placed before this tag if it was not already on the page.
    * @returns {HTMLElement} The created element.
    */
    $.addScriptSource = function (src, id, handlers, async, defer, before)
    {
        var script = null,
            head = $(null, null, 'head', true) || $.getDocument().body,
            result;

        handlers =
        {
            onStart: (handlers && handlers.onStart) ? handlers.onStart : null,
            onComplete: (handlers && handlers.onComplete) ? handlers.onComplete : null
        }

        if (!id || (script = $('#' + id)) == null)
        {
            result = _getElements(head, 'script', function (el) { return (el.getAttribute('src') == src) });

            if (result.length > 0)
                script = result[0];
        }

        function fire(eventName, args)
        {
            if (handlers[eventName])
                handlers[eventName](args);

            $.httpRequestHandlers[eventName].fire(window, args);
        }

        if (script)
        {
            if (script.__busy)
                _addCallback(script, function () { fire('onComplete', script) }, function () { fire('onError', script) });
            else if (script.__error)
                fire('onError', script);
            else
                fire('onComplete', script);
        }
        else
        {
            // script will now be busy loading
            script = $.getDocument().createElement('script');

            if (id)
                script.id = id;

            script.src = src;
            script.type = 'text/javascript';
            script.async = async || false;
            script.defer = defer || false;
            script.__busy = true;

            _addCallback(script, function () { fire('onComplete', script) }, function () { fire('onError', script) });
            script.onload = function () { _srcReady(script); }
            script.onerror = function () { _srcReady(script, true); }
            _addTag(script, before);

            fire('onStart', script);
        }

        return script;
    }

    /** Adds a css link tag with the specified source and id to the page
    * @param {String} src The src of the tag
    * @param {String} id The id of the tag
    * @param {Object} handlers 
    *   @param {Object} handlers.onStart The onStart is called when a new tag is added to the page.
    *   @param {Object} handlers.onComplete The onComplete is called when an HTTP request has finished.
    *   @param {Object} handlers.onError The onError is called when an HTTP request has failed.
    * @param {HTMLElement} [before] The new tag will be placed before this tag if it was not already on the page.
    * @returns {HTMLElement} The created element.
    */
    $.addCssSource = function (src, id, handlers, before)
    {
        var head = $(null, null, 'head', true) || $.getDocument().body,
            css = $('#' + id),
            result;

        handlers =
        {
            onStart: (handlers && handlers.onStart != undefined) ? handlers.onStart : null,
            onComplete: (handlers && handlers.onComplete != undefined) ? handlers.onComplete : null
        }

        if (!id || (css = $('#' + id)) == null)
        {
            result = _getElements(head, 'link', function (el) { return (el.getAttribute('src') == src) });

            if (result.length > 0)
                css = result[0];
        }

        function fire(eventName, args)
        {
            if (handlers[eventName])
                handlers[eventName](args);

            $.httpRequestHandlers[eventName].fire(window, args);
        }

        if (css)
        {
            if (css.__busy) // script already on page but loading, add callback to queue
                _addCallback(css, function () { fire('onComplete', css) }, function () { fire('onError', css) });
            else
            {
                if (_refuseCssRules(css))
                    fire('onError', css);
                else
                    fire('onComplete', css);
            }
        }
        else
        {
            // css will now be busy loading
            css = $.getDocument().createElement('link');

            if (id)
                css.id = id;

            css.href = src;
            css.rel = 'Stylesheet';
            css.type = 'text/css';
            css.__busy = true;

            // add callback to queue
            _addCallback(css, function () { fire('onComplete', css) }, function () { fire('onError', css) });
            css.onload = function () { _srcReady(css); }
            css.onerror = function () { _srcReady(css, true); }
            _addTag(css, before);

            fire('onStart', css);
        }

        return css;
    }

    /** Adds an inline script tag with the specified text and id to the page.
    * @param {String} text Script text
    * @param {String} id Id of the script tag
    * @param {HTMLElement} [before] The new tag will be placed before this tag when specified.
    * @returns {HTMLElement} The created element.
    */
    $.addScriptTag = function (text, id, before)
    {
        // check if script with id is already on the page
        if (id && $('#' + id))
            return $('#' + id);

        var script = $.getDocument().createElement('script'),
            head = $(null, null, 'head', true) || $.getDocument().body;

        if (id)
            script.id = id;

        script.type = 'text/javascript';
        script.text = text;
        _addTag(script, before);

        return script;
    }

    /** Adds an inline css style tag with the specified text and id to the page.
    * @param {String} text Css text
    * @param {String} id Id of the style tag
    * @param {HTMLElement} [before] The new tag will be placed before this tag when specified.
    * @returns {HTMLElement} The created element.
    */
    $.addCssTag = function (text, id, before)
    {
        // check if style with id is already on the page
        if (id && $('#' + id))
            return $('#' + id);

        var style = $.getDocument().createElement('style'),
            head = $(null, null, 'head', true) || $.getDocument().body;

        if (id)
            style.id = id;

        if (style.styleSheet)
            style.styleSheet.cssText = text; // ie
        else
            style.appendChild($.getDocument().createTextNode(text));

        _addTag(style, before);

        return style;
    }

    /** 
    * Inserts, updates or removes a CSS rule in the specified styleSheet.
    * @param {CSSStyleSheet} styleSheet The styleSheet in which the rule will be added, updated or removed.
    * @param {Number} ruleIndex The position index for the rule within the styleSheet. Required if the selector parameter is not specified.
    * @param {String|RegExp} selector Specify either the selector text for a new CSS rule or a matching text/regex for finding an existing CSS rule.
    * @param {String} style The CSS style value or null to remove the rule.
    * @param {Boolean} [update] A value indicating if the style of the matching rule should be set (default) or updated.
    * @returns {Number} The position index of the rule within the styleSheet.
    */
    $.setCssRule = function (styleSheet, ruleIndex, selector, style, update)
    {
        var rule, rules = styleSheet.cssRules || styleSheet.rules, length = rules.length, comparer,
            isRegExp = (selector instanceof RegExp),
            updateRule = function (ruleIndex)
            {
                if (style == null)
                    styleSheet.deleteRule(ruleIndex);
                else if (update)
                    $.updateStyle(rules[ruleIndex].style, style)
                else
                    rules[ruleIndex].style.cssText = style;

                return ruleIndex;
            };

        if ($.isEmpty(selector))
            return updateRule(ruleIndex);

        if (!isRegExp)
            comparer = function (rule) { return (rule.selectorText === selector); }
        else
            comparer = function (rule) { return (rule.selectorText && rule.selectorText.match(selector)); }

        for (var index = 0; index < length; ++index)
        {
            rule = rules[index];

            if (comparer(rule))
                return updateRule(index);
        }

        return styleSheet.insertRule(selector + "{" + style + "}", ($.isEmpty(ruleIndex)) ? length : ruleIndex); // returns the position index
    }

    /** 
    * Gets CSS rules from the specified styleSheet.
    * @param {CSSStyleSheet} styleSheet The styleSheet in which the rule(s) exists.
    * @param {String} selector The selector text/regex to match rules.
    * @returns {CSSRule[]} The found CSS rule(s).
    */
    $.getCssRule = function (styleSheet, selector)
    {
        var rule, rules = styleSheet.cssRules || styleSheet.rules, length = rules.length, comparer,
            result = [],
            isRegExp = (selector instanceof RegExp);

        if (!isRegExp)
        {
            comparer = function (rule) { return (rule.selectorText === selector); }
        }
        else
            comparer = function (rule) { return (rule.selectoText && rule.selectorText.match(selector)); }

        for (var index = 0; index < length; ++index)
        {
            rule = rules[index];

            if (comparer(rule))
                result.push(rule);
        }

        return result;
    }

    /** 
    * Fires an HTTP request to the specified source every x milliseconds to keep the current HTTP session alive
    * @param {String} src Source location
    * @param {Number} delay Refresh delay in milliseconds, 300000 milliseconds (5 minutes) by default
    * @returns {Function} A method to kill the keep alive
    */
    $.keepAlive = function (src, delay)
    {
        var iframe = $.getDocument().createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = "javascript:'';";
        $.getDocument().body.appendChild(iframe);

        var timerId = setInterval(function ()
        {
            iframe.src = src + "?" + new Date().getTime();
        }, delay || 300000);

        var kill = function ()
        {
            clearInterval(timerId);
            $.getDocument().body.removeChild(iframe);
        }

        return kill;
    }

    /**
     * Creates a new HTMLElement.
     * @param {HTMLElement|Object} [container] The container element to append the new element to, or a settings object holding the properties to configure element creation.
     * @param {HTMLElement} [before] The element to insert before (if using positional parameters).
     * @param {String} [tag='div'] The tag name for the new element.
     * @param {Node[]|Node|String|String[]} [content] The content of the new element. String[] is treated as HTML.
     * @param {Object} [attrs] Attributes to set on the element.
     * @param {Object} [props] Properties to set on the element.
     * @returns {HTMLElement} The created element.
     * @example
     * // Traditional usage (positional arguments)
     * $.element(container, before, 'div', 'Hello', { id: 'greeting' }, { className: 'text' });
     * @example
     * // Using a settings object (all parameters are optional and can be selectively provided)
     * $.element({
     *   container: container,
     *   before: before,
     *   tagName: 'div',
     *   content: 'Hello',
     *   attrs: { id: 'greeting' },
     *   props: { className: 'text' }
     * });
     */
    $.element = function (container, before, tag, content, attrs, props)
    {
        if (arguments.length === 1 && $.isPlainObject(container))
        {
            ({ container, before, tag, content, attrs, props } = container);
        }

        let el = $.getDocument().createElement(tag || 'div');

        if (before)
            before.parentElement.insertBefore(el, before);
        else if (container)
            container.appendChild(el);

        if (content)
        {
            if ($.isArray(content))
            {
                if ($.isDOM(content[0]))
                    $.each(content, function (c) { el.appendChild(c); });
                else
                    el.innerHTML = content.join('');
            }
            else if ($.isDOM(content))
                el.appendChild(content);
            else
                el.textContent = content;
        }

        $.each(attrs, function (value, name)
        {
            if (value != undefined)
                el.setAttribute(name, value);
        });

        $.each(props, function (value, name)
        {
            if (value != undefined)
                el[name] = value;
        });

        return el;
    }

    /** Gets the common ancestor for 2 nodes.
    * @param {HTMLElement} firstNode The first node.
    * @param {HTMLElement} secondNode The second node.
    * @param {HTMLElement} [parentElement] Only siblings within the specified parent element are retrieved.
    * @returns {HTMLElement} The common ancestor element.
    */
    $.commonAncestor = function (firstNode, secondNode, parentElement)
    {
        var ancestor,
            stop = function (el, stop)
            {
                if (el == parentElement)
                    stop();

                return true;
            },
            firstParents = $(stop, firstNode, null, false, true).reverse(),
            secParents = $(stop, secondNode, null, false, true).reverse();

        $.each(firstParents, function (el, index)
        {
            ancestor = firstParents[index];

            if (ancestor != secParents[index]) // parents no longer match
            {
                ancestor = firstParents[index - 1];
                return false;
            }
        });

        return ancestor;
    }

    /** Gets the next or previous sibling of the specified node.
    * @param {Node} node The start node.
    * @param {Boolean} [previous]  A value indicating if the previous node is retrieved instead of the next.
    * @param {Number} [nodeType] A node type value to retrieve the first sibling occurence of this node type, by default any node type is retrieved.
    * @param {HTMLElement} [parentElement] Only siblings within the specified parent element are retrieved.
    * @param {Boolean} [skipEmpty] A value indicating if empty siblings must be skipped.
    * @returns {Node} The next or previous sibling node or null if there is none.
    */
    $.sibling = function (node, previous, nodeType, parentElement, skipEmpty)
    {
        var fnGet = (previous) ? function (node) { return node.previousSibling; } : function (node) { return node.nextSibling; },
            fnNext = function (node)
            {
                while (node && !fnGet(node))
                {
                    if (node.parentNode != parentElement)
                        node = node.parentNode;
                    else
                        node = null;
                }

                if (node)
                    return fnGet(node);
            }

        while ((node = fnNext(node)) && ((nodeType && nodeType != node.nodeType) || (skipEmpty && !node.textContent.length)))
        {
        }

        return node;
    }

    /** Retrieves the first child node by tagname that is of type ELEMENT_NODE.
    * @param {HTMLElement} element The XML or (X)HTML element.
    * @param {String} name The name of the tag.
    * @returns {HTMLElement} The first child element which equals the specified name.
    */
    $.firstChildByTagName = function (element, name)
    {
        element = element.firstElementChild;

        while (element)
        {
            if (element.nodeName && element.nodeName.toLowerCase() == name.toLowerCase())
                return element;

            element = element.nextElementSibling;
        }

        return null;
    }

    /** Retrieves an array of childnodes that are of type ELEMENT_NODE.
    * @param {HTMLElement} element The XML or (X)HTML element.
    * @returns {HTMLElement[]} Element collection.
    */
    $.children = function (element)
    {
        if (!element)
            return null;

        var nodeList = [];
        element = element.firstElementChild;

        while (element)
        {
            if (element.nodeType == 1)
                nodeList.push(element);

            element = element.nextElementSibling;
        }

        return nodeList;
    }

    /** Appends the child nodes from the source element to the target element.
    * @param {HTMLElement} source The source element.
    * @param {HTMLElement} target The target element.
    * @returns {HTMLElement} The target element.
    */
    $.appendChildren = function (source, target)
    {
        var child = source.firstChild, next;

        while (child)
        {
            next = child.nextSibling;
            target.appendChild(child);
            child = next;
        }

        return target;
    }

    /** Removes the specified node.
    * @param {HTMLElement} element The node to remove.
    * @returns {Node} A Node object, representing the removed node, or null if the node does not exist.
    */
    $.remove = function (element)
    {
        if (element)
            element.remove();

        return element;
    }

    /** Removes all the children of the specified element.
    * @param {HTMLElement} element The element for which the children will be removed.
    */
    $.removeChildren = function (element)
    {
        $.extract(element);
    }

    /** Surrounds the content with the specified element.
    * @param {HTMLElement} element The element to make parent of the specified content.
    * @param {Node|DocumentFragment} content The content node(s) to surround with the specified element.
    * @returns {HTMLElement} The specified element.
    */
    $.surround = function (element, content)
    {
        if (!$.isInDOM(element) && !(content instanceof $.defaultView(element).DocumentFragment))
        {
            var parent = content.parentNode,
                next = content.nextSibling;

            if (parent)
            {
                if (next)
                    parent.insertBefore(element, next);
                else
                    parent.appendChild(element);
            }
        }

        element.appendChild(content);
        return element;
    }

    /** Replaces itself for it's child nodes.
    * @param {HTMLElement} element The element to replace.
    * @returns {HTMLElement} The replaced element.
    */
    $.unsurround = function (element)
    {
        return element.parentNode.replaceChild($.extract(element), element);
    }

    /** Extracts the child nodes from the specified element by appending the nodes to a document fragment or array.
    * @param {HTMLElement} element The element containing the child nodes to extract.
    * @param {Boolean} [toArray] A value indicating if the nodes should be extracted to an array.
    * @returns {DocumentFragment|HTMLElement[]} A document fragment or array containing the extracted child nodes.
    */
    $.extract = function (element, toArray)
    {
        var fragment = $.getDocument().createDocumentFragment(), list;

        if (element.nodeName.toLowerCase() == 'template' && element.content && element.content.childNodes.length)
            element = element.content;

        if (toArray)
        {
            list = [];
            while (element.firstChild)
            {
                list.push($.remove(element.firstChild));
            }
        }
        else
        {
            while (element.firstChild)
            {
                fragment.appendChild(element.firstChild);
            }
        }


        return (list) ? list : fragment;
    }

    /** Converts the HTML text to a document fragment.
    * @param {String} text The HTML text.
    * @returns {DocumentFragment} A document fragment containing the nodes from the HTML string.
    */
    $.fragmentFromHTML = function (text)
    {
        var div = $.getDocument().createElement('div');
        div.innerHTML = text;
        return extract(div);
    }

    /** Inserts the node at the current caret (cursor) position (overriding any selection).
    * @param {Node} node The node to insert.
    * @param {Boolean} [select] A value indicating if the inserted node must be selected.
    * @param {Range} [range] A range in which the node will be inserted. By default the current selection range is used.
    * @param {Boolean} [deleteContent] A value indicating if the content within the range should be removed prior to the insertion of the node.
    */
    $.insertNode = function (node, select, deleteContent, range)
    {
        var sel = $.defaultView(node).getSelection(), addToSelection = true;

        if (range && !select)
            addToSelection = false;

        range = range || sel.getRangeAt(0);

        if (sel.rangeCount)
        {
            if (deleteContent)
                range.deleteContents();

            range.insertNode(node);

            if (addToSelection)
            {
                if (!select)
                    range.collapse(false);

                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }

    /** Gets the nodes within the current selection range.
    * @param {String} [nodeName] A single node name or a space separated string with node names to filter the result list.
    * @param {Range} [range] A selection range from which nodes are retrieved. By default the current selection range is used.
    * @returns {Node[]} A list of nodes (which satisfy the optional filter) within the selection range.
    */
    $.getNodesInRange = function (nodeName, range)
    {
        range = range || $.getDocument().defaultView.getSelection().getRangeAt(0);

        if (!range || range.collapsed)
            return [];

        var node = range.startContainer,
            endNode = range.endContainer, rangeNodes, filtered,
            fnNextNode = function (node)
            {
                if (node.hasChildNodes())
                    return node.firstChild;
                else
                {
                    while (node && !node.nextSibling)
                    {
                        node = node.parentNode;
                    }

                    if (!node)
                        return null;

                    return node.nextSibling;
                }
            };

        // Special case for a range that is contained within a single node
        if (node == endNode)
            return [node];

        // Iterate nodes until we hit the end container
        rangeNodes = [];
        while (node && node != endNode)
        {
            rangeNodes.push(node = fnNextNode(node));
        }

        // Add partially selected nodes at the start of the range
        node = range.startContainer;
        while (node && node != range.commonAncestorContainer)
        {
            rangeNodes.unshift(node);
            node = node.parentNode;
        }

        if (!nodeName)
            return rangeNodes;

        for (var index = 0; index < rangeNodes.length; ++index)
        {
            node = rangeNodes[index];
            if (nodeName.indexOf(node.nodeName) > -1)
                filtered.push(node);
        }

        return filtered;
    }

    /** Encodes a js string
    * @param {String} text The text to encode
    * @returns {String} An encoded string
    */
    $.encodeString = function (text)
    {
        if (!text)
            return '';

        var arr = text.split(''), ascii;

        for (var i = 0; i < arr.length; ++i)
        {
            switch (arr[i])
            {
                case '\\':
                    arr[i] = '\\\\';
                    break;
                case '"':
                    arr[i] = '\\"';
                    break;
                case '\'':
                    arr[i] = '\\\'';
                    break;
                case '\b':
                    arr[i] = '\\b';
                    break;
                case '\f':
                    arr[i] = '\\f';
                    break;
                case '\n':
                    arr[i] = '\\n';
                    break;
                case '\r':
                    arr[i] = '\\r';
                    break;
                case '\t':
                    arr[i] = '\\t';
                    break;
                default:
                    ascii = arr[i].charCodeAt(0);

                    if (ascii < 32 || ascii > 127)
                        arr[i] = '\\u' + ('0000' + ascii.toString(16)).slice(-4);

                    break;
            }
        }

        return arr.join('');
    }

    /** Encodes an html string
    * @param {String} text The text to encode
    * @returns {String} An encoded string
    */
    $.encodeHTML = function (text)
    {
        if (!text)
            return '';

        var arr = text.split(''), ascii, s = "&nbsp;";

        for (var i = 0; i < arr.length; ++i)
        {
            switch (arr[i])
            {
                case '<':
                    arr[i] = '&lt;';
                    break;
                case '>':
                    arr[i] = '&gt;';
                    break;
                case '&':
                    arr[i] = '&amp;';
                    break;
                case '"':
                    arr[i] = '&quot;';
                    break;
                case "'":
                    arr[i] = '&#39;';
                    break;
                case "  ":
                    arr[i] = s + s;
                    break;
                case '\t':
                    arr[i] = s + s + s + s;
                    break;
                case '\n':
                    arr[i] = "<br />";
                    break;
                default:
                    ascii = arr[i].charCodeAt(0);

                    if (ascii < 32 || ascii > 127)
                        arr[i] = '&#' + ascii + ';';

                    break;
            }
        }

        return arr.join('');
    }

    /** 
    * Checks if the element's classname property contains the css class(es).
    * @param {HTMLElement} element The element to check.
    * @param {String} cssClass Name of the css class.
    * @returns {Boolean} Returns true if the element's classname contains the cssClass, otherwise false.
    */
    $.hasClass = function (element, cssClass)
    {
        if (!element || !element.className || !cssClass)
            return false;

        var className = ''
        var search = '';
        var cssClasses = cssClass.split(' ');

        for (var index = 0; index < cssClasses.length; ++index)
        {
            cssClass = cssClasses[index];
            className = ' ' + element.className + ' ';
            search = ' ' + cssClass + ' ';

            if (className.indexOf(search) == -1)
                return false;
        }

        return true;
    }

    /** 
    * Toggles between css class(es) by removing the class if it's already defined on the element and otherwise adding it.
    * @param {HTMLElement} element The element.
    * @param {String} cssClass Name of the css class or classes separated by a space.
    */
    $.toggleClass = function (element, cssClass)
    {
        if (!element)
            return;

        var cssClasses = cssClass.split(' ');

        for (var index = 0; index < cssClasses.length; ++index)
        {
            cssClass = cssClasses[index];

            if ($.hasClass(element, cssClass))
                $.removeClass(element, cssClass);
            else
                $.addClass(element, cssClass);
        }
    }

    /** 
    * Adds the specified css class(es) to the element.
    * @param {HTMLElement} element The element.
    * @param {String} cssClass Name of the css class or classes separated by a space.
    */
    $.addClass = function (element, cssClass)
    {
        if (!element || !cssClass)
            return;

        var cssClasses = cssClass.split(' ');

        for (var index = 0; index < cssClasses.length; ++index)
        {
            cssClass = cssClasses[index];

            if (!element.className)
                element.className = cssClass;
            else if (!$.hasClass(element, cssClass))
                element.className += ' ' + cssClass;
        }
    }

    /** 
    * Removes the specified css class(es) from the element.
    * @param {HTMLElement} element The element.
    * @param {String} cssClass Name of the css class or classes separated by a space.
    */
    $.removeClass = function (element, cssClass)
    {
        if (!element || !element.className || !cssClass)
            return;

        var cssClasses = cssClass.split(' '), className, search;

        for (var index = 0; index < cssClasses.length; ++index)
        {
            cssClass = cssClasses[index];
            className = ' ' + element.className + ' ';
            search = new RegExp('\\s' + $.trim(cssClass) + '\\s');

            className = className.replace(search, ' ');
            element.className = $.trim(className);
        }

        if ($.isEmpty($.trim(element.className)))
            element.removeAttribute('class');
    }

    /** 
    * Retrieves the current inline or computed value of a style property.
    * @param {HTMLElement} element The element.
    * @param {String} property Style property name in camelcase (backgroundColor) or separated by hyphens (background-color).
    * @param {Boolean} computed Defines if only a computed style value should be retrieved.
    * @returns {String} The element style.
    */
    $.styleValue = function (element, property, computed)
    {
        if (property.indexOf("-") > -1)
            property = property.replace(_cssPropRegExp, function (match) { return match.substring(1).toUpperCase() })

        if (!computed && element.style[property])
            return element.style[property];
        else if ($.defaultView(element).getComputedStyle)
            return $.defaultView(element).getComputedStyle(element, null)[property];
    }

    /** 
    * Sets the style text of an element.
    * @param {HTMLElement} element The element.
    * @param {String} style Style text.
    */
    $.setStyle = function (element, style)
    {
        if (style)
            element.setAttribute('style', style);
        else
            element.removeAttribute('style');
    }

    /** 
    * Updates the CSS style declaration of an HTMLElement or Stylesheet. Empty style properties are removed.
    * @param {CSSStyleDeclaration} style The current style.
    * @param {String} text The style text with which the current style is updated.
    */
    $.updateStyle = function (style, text)
    {
        var prop, name, value,
            semicolon = '###semicolon###',
            props = text.replace(/\\;/g, semicolon).split(';');

        for (var index = 0; index < props.length; ++index)
        {
            prop = props[index].split(/:(.+)/); // split first part as property name, the rest as value
            name = $.trim(prop[0]);
            value = (prop[1] != undefined) ? $.trim(prop[1].replace(semicolon, CSS.escape(';'))) : undefined;

            if (name.endsWith(':'))
                name = name.substr(0, name.length - 1);

            if (name)
            {
                if (value == undefined)
                    style.setProperty(name, '');
                else if ($.endsWith(value, '!important'))
                    style.setProperty(name, value.replace('!important', ''), 'important');
                else
                    style.setProperty(name, value);
            }
        }
    }

    /** 
    * Copies the computed style of the source element to the target element. 
    * @param {HTMLElement} source The source element.
    * @param {HTMLElement} target The target element.
    */
    $.copyComputedStyle = function (source, target)
    {
        var style = ($.defaultView(source).getComputedStyle) ? $.defaultView(source).getComputedStyle(source, null) : source.currentStyle,
            cssText = [], k;

        for (var key in style)
        {
            if (style[key])
            {
                k = key.replace(/(([A-Z]){1})/g, function (match) { return '-' + match.toLowerCase() });
                cssText.push(k + ":" + style[key]);
            }
        }

        $.setStyle(target, cssText.join(';'));
    }

    /** 
    * Gets the stylesheet by source url or id. 
    * The stylesheet will be matched on id if the id parameter is passed.
    * @param {String} id Id of the stylesheet.
    * @param {String} src Src of the stylesheet.
    * @returns {Object} Stylesheet object.
    */
    $.getStyleSheet = function (id, src)
    {
        for (var index = 0; index < $.getDocument().styleSheets.length; ++index)
        {
            if ((id && $.getDocument().styleSheets[index].ownerNode.id == id) || (src && $.getDocument().styleSheets[index].ownerNode.href == src))
                return $.getDocument().styleSheets[index];
        }
    }

    /** 
    * Gets the source element for the current event.
    * @param {Object} e The event.
    * @returns {HTMLElement} Source element.
    */
    $.eventSource = function (e)
    {
        return e.target || e.srcElement;
    }

    /** 
    * Gets the related element for the current event.
    * @param {Object} e The event
    * @returns {HTMLElement} Related element.
    */
    $.eventRelated = function (e)
    {
        return e.relatedTarget || (e.type == 'mouseout') ? e.toElement : e.fromElement;
    }

    /** 
    * Gets the x coordinate of the (mouse)pointer.
    * @param {Object} e The event.
    * @returns {Number} ClientX position.
    */
    $.clientX = function (e)
    {
        return _eventKey(e, 'clientX');
    }

    /** 
    * Gets the y coordinate of the (mouse)pointer.
    * @param {Object} e The event.
    * @returns {Number} ClientY position.
    */
    $.clientY = function (e)
    {
        return _eventKey(e, 'clientY');
    }

    /**  
    * Gets the absolute page position coordinates of the element.
    * @param {HTMLElement} element The element.
    * @param {HTMLElement} [parent] An element to get the position coordinates of the element, relative to its parent element.
    * @param {Boolean} [fixed] A value indicating if fixed position values (ignoring scrollbar positions) should be returned.
    * @returns {componyx.library.Position} An object wich describes the position values.
    */
    $.getPos = function (element, parent, fixed)
    {
        _setDisplay(element);

        var scroll,
            rect = element.getBoundingClientRect(),
            pos =
            {
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                left: rect.left,
                width: rect.width,
                height: rect.height
            };

        _setDisplay(element, true);

        if (($.isEmpty(fixed) && $.styleValue(element, 'position') === 'fixed') || fixed)
            return pos;

        if (parent)
        {
            rect = parent.getBoundingClientRect();
            pos.top -= rect.top;
            pos.right -= rect.left;
            pos.bottom -= rect.top;
            pos.left -= rect.left;
        }
        else
        {
            scroll = $.getScrollPosition();
            pos.top += scroll.scrollTop;
            pos.right += scroll.scrollLeft;
            pos.bottom += scroll.scrollTop;
            pos.left += scroll.scrollLeft;
        }

        return pos;
    }

    /**  
    * Sets the position coordinates of the specified element so that it matches the specified position on the page (NOT relative to a parent element).
    * @param {HTMLElement} element The element.
    * @param {Object} pagePos The horizontal and/or vertical position in pixels specified via the object keys top, right, bottom of left.
    * @param {Boolean} [keepMargin] Defines if specified element margins must be preserved.
    */
    $.setPos = function (element, pagePos, keepMargin)
    {
        var pos, s = element.style, margin = {},
            isSet =
            {
                top: !$.isEmpty(pagePos.top) && pagePos.top != 'auto',
                right: !$.isEmpty(pagePos.right) && pagePos.right != 'auto',
                bottom: !$.isEmpty(pagePos.bottom) && pagePos.bottom != 'auto',
                left: !$.isEmpty(pagePos.left) && pagePos.left != 'auto'
            };

        if (keepMargin)
        {
            margin.top = element.style.marginTop;
            margin.right = element.style.marginRight;
            margin.bottom = element.style.marginBottom;
            margin.left = element.style.marginLeft;
            $.updateStyle(element.style, 'margin: 0px !important;');
        }

        init('top');
        init('right');
        init('bottom');
        init('left');

        pos = $.getPos(element);
        set('top');
        set('right');
        set('bottom');
        set('left');

        if (keepMargin)
        {
            $.updateStyle(element.style, 'margin:;');
            element.style.marginTop = margin.top;
            element.style.marginRight = margin.right;
            element.style.marginBottom = margin.bottom;
            element.style.marginLeft = margin.left;
        }

        function init(key)
        {
            s[key] = (isSet[key]) ? $.unit(pagePos[key]) : s[key];
        }

        function set(key)
        {
            s[key] = (isSet[key] && pos[key] != pagePos[key]) ? $.unit(pagePos[key] - (pos[key] - pagePos[key])) : s[key];
        }
    }

    /** 
    * Returns the first relative, absolute or fixed positioned parent element if there is any.
    * @param {HTMLElement} element The element.
    * @returns {HTMLElement} A positioned parent element or null when no positioned parent is found.
    */
    $.positionedParent = function (element)
    {
        var result = _getParentElements(element, null, function (el, stop)
        {
            if (!$.isElement(el))
            {
                stop();
                return false;
            }

            var position = $.styleValue(el, 'position'),
                found = (position == 'relative' || position == 'absolute' || position == 'fixed');

            if (found)
            {
                stop();
                return true;
            }

            return false;
        });

        return (result && result.length > 0) ? result[0] : null;
    }

    /** 
    * Returns the scrollLeft and scrollTop positions.
    * @returns {componyx.library.ScrollPos} An object which describes the scroll values.
    */
    $.getScrollPosition = function ()
    {
        var scroll = {};

        scroll.scrollLeft = $.getDocument().defaultView.scrollX;
        scroll.scrollTop = $.getDocument().defaultView.scrollY;

        return scroll;
    }

    /** 
    * Escapes a regular expression string to use with the regexp object.
    * @param {String} text The text to escape.
    * @returns {String} The escaped text.
    */
    $.escapeRegExp = function (text)
    {
        return text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    /** 
    * Removes leading and trailing white space characters, new lines and tabs from the specified string.
    * @param {String} text Text to trim.
    * @returns {String} the trimmed text.
    */
    $.trim = function (text)
    {
        if (!text)
            return text;

        return text.toString().replace(/^[\s|\n|\r|\t]+/, '').replace(/[\s|\n|\r|\t]+$/, '');
    }

    /** 
    * Checks if the text strats with the specified prefix.
    * @param {String} text 
    * @param {String} prefix 
    * @param {Boolean} ignoreCase Defines if the comparison should be case-insensitive.
    * @returns {Boolean} Returns true if the text staats with the specified prefix, otherwise false.
    */
    $.startsWith = function (text, prefix, ignoreCase)
    {
        return (ignoreCase) ? text.toLowerCase().indexOf(prefix.toLowerCase()) === 0 : text.indexOf(prefix) === 0;
    }

    /** 
    * Checks if the text ends with the specified suffix.
    * @param {String} text 
    * @param {String} suffix 
    * @param {Boolean} ignoreCase Defines if the comparison should be case-insensitive.
    * @returns {Boolean} Returns true if the text ends with the specified suffix, otherwise false.
    */
    $.endsWith = function (text, suffix, ignoreCase)
    {
        var length = text.length - suffix.length;

        if (length < 0)
            return false;

        return (ignoreCase) ? text.toLowerCase().lastIndexOf(suffix.toLowerCase()) === length : text.lastIndexOf(suffix) === length;
    }

    /** 
    * Searches for a specified value within an array and returns its index (or -1 if not found).
    * @param {Array} items Array to search.
    * @param {Object} comparer 
    * - 1. A value of any type to compare with.
    * - 2. A function which accepts the item to compare as argument and returns a boolean value indicating if there was a successful match.
    * @param {Boolean} ignoreCase Defines if the comparison should be case-insensitive.
    * @param {Boolean} strictCompare Defines if the comparison should be strict. Compared values only match when they are of the same type (true by default).
    * @returns {Number} Index of the found item or -1 if not found.
    */
    $.indexOf = function (items, comparer, ignoreCase, strictCompare)
    {
        if ($.isEmpty(items))
            return -1;

        var value = (typeof (comparer) != 'function') ? comparer || '' : '', val;

        if (typeof (comparer) == 'string')
        {
            val = value.toString().toLowerCase();
            comparer = function (v) { return (v === value) };

            if (ignoreCase)
                comparer = function (v) { return (v.toString().toLowerCase() == val) };
            else if (!strictCompare)
                comparer = function (v) { return (v == value) };
        }
        else if (typeof (comparer) != 'function')
            comparer = function (v) { return (v === value) };

        for (var index = 0; index < items.length; ++index)
        {
            if (comparer(items[index]))
                return index;
        }

        return -1;
    }

    /** 
    * Iterates through the items in the array and evaluates each object against the specified comparer function.
    * The iteration is called recursively when the recursionKey is found on an object.
    * 
    * @param {Array} items The root array.
    * @param {String} recursionKey The object key which points to the child items array. Separate object keys with a dot "." to denote a deeper level.
    * @param {Function} comparer A function which accepts the item to compare as argument and returns a boolean value indicating if there was a successful match.
    * @param {Boolean} scalar A value indicating to return a single result which makes the iteration stop after a match.
    * @returns {componyx.library.Path[]|componyx.library.Path} An array of Path instances or a single Path instance when the scalar option was provided. The Path object offers methods to navigate in any direction from a specific item within the tree.
    */
    $.path = function (items, recursionKey, comparer, scalar)
    {
        return _path(items, recursionKey, comparer, scalar);
    }

    /** 
    * Creates and returns an object for disabling and enabling text selection for the specified element and underlaying elements.
    * @param {HTMLElement} element The element.
    * @returns {componyx.library.Toggle} An object to control the text selection behaviour.
    */
    $.textSelection = function (element)
    {
        var curSelect = {},
            styleEl = (element == $.getDocument()) ? $.getDocument().body : element,
            textSelection =
            {
                disable: function ()
                {
                    if (typeof (element.onselectstart) != 'undefined')
                        $.on(element, 'selectstart', _preventDefault);

                    $.each(['Moz', 'webkit', 'ms', ''], function (key)
                    {
                        key += (key) ? 'UserSelect' : 'userSelect';

                        if (key in styleEl.style && $.styleValue(styleEl, key) != 'none')
                        {
                            curSelect[key] = styleEl.style[key];
                            styleEl.style[key] = 'none';
                        }
                    });
                },

                enable: function ()
                {
                    if (typeof (element.onselectstart) != 'undefined')
                        $.off(element, 'selectstart', _preventDefault);

                    $.each(curSelect, function (val, key)
                    {
                        styleEl.style[key] = val;
                    });
                }
            }

        return textSelection;
    }

    /** 
    * Converts the rgb color to a hexadecimal string.
    * @param {Number} red 0-255 numeric value.
    * @param {Number} green 0-255 numeric value.
    * @param {Number} blue 0-255 numeric value.
    * @returns {String} The hex value.
    */
    $.rgbToHex = function (red, green, blue)
    {
        var hexRed, hexGreen, hexBlue;

        hexRed = red.toString(16);
        if (hexRed.length == 1)
            hexRed = '0' + hexRed;

        hexGreen = green.toString(16);
        if (hexGreen.length == 1)
            hexGreen = '0' + hexGreen;

        hexBlue = blue.toString(16);
        if (hexBlue.length == 1)
            hexBlue = '0' + hexBlue;

        return hexRed + hexGreen + hexBlue;
    }

    /** 
    * Converts a hexadecimal color string to a rgb color.
    * @param {String} hex hex color string.
    * @returns {Number[]} The R,G,B values.
    */
    $.hexToRgb = function (hex)
    {
        var hexRed = '00', hexGreen = '00', hexBlue = '00';

        if (hex)
        {
            if (hex.indexOf('#') == 0)
                hex = hex.substr(1);

            if (hex.length == 3)
            {
                hexRed = hex.substring(0, 1) + hex.substring(0, 1);
                hexGreen = hex.substring(1, 2) + hex.substring(1, 2);
                hexBlue = hex.substring(2, 3) + hex.substring(2, 3);
            }
            else
            {
                hexRed = (hex.length > 1) ? hex.substring(0, 2) : '00';
                hexGreen = (hex.length > 3) ? hex.substring(2, 4) : '00';
                hexBlue = (hex.length > 5) ? hex.substring(4, 6) : '00';
            }
        }

        return [parseInt(hexRed, 16), parseInt(hexGreen, 16), parseInt(hexBlue, 16)];
    }

    /**
    * Converts the rgb value to hsv.
    * @param {Number} r The red value 0-255.
    * @param {Number} g The green value 0-255.
    * @param {Number} b The blue value 0-255.
    * @returns {Number[]} The hue saturation value.
    */
    $.rgbToHsv = function (r, g, b)
    {
        r /= 255, g /= 255, b /= 255;

        var min = Math.min(r, g, b),
            max = Math.max(r, g, b),
            delta = max - min,
            h = 0, s = 0, v = max;

        if (min != max)
        {
            s = (delta / max);

            switch (max)
            {
                case r: h = (g - b) / delta + (g < b ? 6 : 0); break;
                case g: h = (b - r) / delta + 2; break;
                case b: h = (r - g) / delta + 4; break;
            }

            h /= 6;
        }

        return [h, s, v];
    }

    /** 
    * Converts the hsv value to rgb.
    * @param {Number} h The hue value 0-1.
    * @param {Number} s The saturation value 0-1.
    * @param {Number} v The lightness value 0-1.
    * @returns {Number[]} The rgb value.
    */
    $.hsvToRgb = function (h, s, v)
    {
        var step = h / (1 / 6),
            pos = step - Math.floor(step), // position within this hue sector (0=start, 1=end)
            hueFactor = (Math.floor(step) % 2) ? (1 - pos) : pos, // interpolation factor for the "middle" channel; 0=at darkest end, 1=at brightest end of this sector
            brightest = v,
            darkest = (1 - s) * v, // channel pulled toward gray by saturation
            middle = darkest + (brightest - darkest) * hueFactor, // intermediate channel between darkest and brightest
            r, g, b;

        if (step == 6)
            step = 0;

        // channel order patterns for each hue sector
        const channels = [
            [brightest, middle, darkest],  // sector 0
            [middle, brightest, darkest],  // sector 1
            [darkest, brightest, middle],  // sector 2
            [darkest, middle, brightest],  // sector 3
            [middle, darkest, brightest],  // sector 4
            [brightest, darkest, middle]   // sector 5
        ];

        [r, g, b] = channels[Math.floor(step)]; // destruct into r, g, b

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    /** 
    * Gets the width and height of the window.
    * @returns {componyx.library.Dimensions} An object describing the width and height sizes.
    */
    $.getWindowSize = function ()
    {
        var winSize = { width: 0, height: 0 };

        winSize.width = $.getDocument().documentElement.clientWidth || $.getDocument().body.clientWidth;
        winSize.height = $.getDocument().documentElement.clientHeight || $.getDocument().body.clientHeight;
        return winSize;
    }

    /** 
    * Gets the width and height of a scrollbar.
    * @returns {componyx.library.Dimensions} An object describing the width and height sizes.
    */
    $.getScrollBarSize = function ()
    {
        var outer = $.getDocument().body.appendChild($.getDocument().createElement('div')),
            inner = outer.appendChild($.getDocument().createElement('div')),
            size = { width: 0, height: 0 };

        outer.style.overflow = 'scroll';
        outer.style.width = inner.style.width = '100px';
        outer.style.height = inner.style.height = '100px';

        size.width = outer.scrollWidth - outer.clientWidth;
        size.height = outer.scrollHeight - outer.clientHeight;
        outer.parentNode.removeChild(outer);

        return size;
    }

    /** 
    * Adds the specified unit or the default 'px' unit to the value if the unit is missing.
    * @param {String} value Nummeric value.
    * @param {String} unit Css unit.
    * @returns {String} The value with the specified or default unit.
    */
    $.unit = function (value, unit)
    {
        return (/[^\d]$/.test($.trim(value.toString()))) ? value : value + (unit || 'px');
    }

    /** 
    * Returns the full size of an element, including the border, padding and optional margin sizes.
    * @param {HTMLElement} element The element.
    * @param {Boolean} [includeMargin] A value indicating if element margin sizes must be included.
    * @returns {componyx.library.Dimensions} An object describing the width and height sizes.
    */
    $.size = function (element, includeMargin)
    {
        var bp = $.borderAndPadding(element),
            margin = (includeMargin) ? $.margin(element) : null,
            borderWidth = bp.borderLeft + bp.borderRight,
            borderHeight = bp.borderTop + bp.borderBottom,
            scrollWidth = element.scrollWidth,
            scrollHeight = element.scrollHeight,
            result = {};

        result.width = scrollWidth + borderWidth;
        result.height = scrollHeight + borderHeight;

        if (includeMargin)
        {
            result.width += margin.width;
            result.height += margin.height;
        }

        if (scrollWidth > (element.offsetWidth - borderWidth))
            result.width += bp.paddingRight;

        if (scrollHeight > (element.offsetHeight - borderHeight))
            result.height += bp.paddingBottom;

        return result;
    }

    /** 
    * Returns the border sizes of the element in pixels.
    * @param {HTMLElement} element The element.
    * @returns {componyx.library.BorderSizes} An object describing the border sizes of the element.
    */
    $.border = function (element)
    {
        return _getSize(element, 'border');
    }

    /** 
    * Returns the padding sizes of the element in pixels.
    * @param {HTMLElement} element The element.
    * @returns {componyx.library.PaddingSizes} An object describing the padding sizes of the element.
    */
    $.padding = function (element)
    {
        return _getSize(element, 'padding');
    }

    /** 
    * Returns the border size, padding size and combined size (width and height of border and padding) in pixels.
    * @param {HTMLElement} element The element.
    * @param {Boolean} [computeSize] A value indicating if the combined size (width and height of border and padding) is computed. When omitted the size is only computed when the element has the default CSS box-sizing value (content-box).
    * @returns {componyx.library.BorderPaddingSizes} An object describing the border & padding size of the element.
    */
    $.borderAndPadding = function (element, computeSize)
    {
        var size = $.clone($.border(element), $.padding(element));

        if (computeSize || (computeSize !== false && !_isBorderBox(element)))
        {
            size.width = size.borderLeft + size.borderRight + size.paddingLeft + size.paddingRight;
            size.height = size.borderTop + size.borderBottom + size.paddingTop + size.paddingBottom;
        }
        else
            size.width = size.height = 0;

        return size;
    }

    /** 
    * Returns the margin sizes of the element in pixels.
    * @param {HTMLElement} element The element.
    * @returns {componyx.library.MarginSizes} An object describing the margin sizes of the element.
    */
    $.margin = function (element)
    {
        const computedStyle = window.getComputedStyle(element),
            margins = {
                top: parseFloat(computedStyle.marginTop),
                right: parseFloat(computedStyle.marginRight),
                bottom: parseFloat(computedStyle.marginBottom),
                left: parseFloat(computedStyle.marginLeft)
            };

        margins.width = margins.left + margins.right;
        margins.height = margins.top + margins.bottom;

        return margins;
    }

    $.isInDOM = function (node)
    {
        return $.contains($.getDocument().documentElement, node);
    }

    /** 
    * Checks if the node is a child of the specified parent element.
    * @param {HTMLElement} parent The parent element.
    * @param {Node} node The node for which to check if it is a child of the specified parent.
    * @returns {Boolean} A value indicating if the node is a child of the specified parent element.
    */
    $.contains = function (parent, node)
    {
        if (!node || !parent)
            return false;

        if ($.isElement(node))
            return (parent !== node && parent.contains && parent.contains(node));

        return (_getParentElements(node, null, function (el, stop)
        {
            if (el === parent)
            {
                stop();
                return true;
            }
            else
                return false;
        }).length > 0)
    }

    /** 
    * Returns a new string that right-aligns the characters in this instance by padding them on the left with a specified Unicode character, for a specified total length.
    * @param {String} value The string value on which the operation is applied.
    * @param {Number} length The number of characters in the resulting string, equal to the number of original characters plus any additional padding characters.
    * @param {String} [text] The padding character(s).
    * @returns {String} Left padded text.
    */
    $.padLeft = function (value, length, text)
    {
        return Array(length - String(value).length + 1).join(text || '0') + value;
    }

    /** 
    * Returns a new string that left-aligns the characters in this instance by padding them on the right with a specified Unicode character, for a specified total length.
    * @param {String} value The string value on which the operation is applied.
    * @param {Number} length The number of characters in the resulting string, equal to the number of original characters plus any additional padding characters.
    * @param {String} [text] The padding character(s).
    * @returns {String} Right padded text.
    */
    $.padRight = function (value, length, text)
    {
        return value + Array(length - String(value).length + 1).join(text || '0');
    }

    /** 
    * Rounds the number with the specified rounding type and precision.
    * @param {Number} value Numeric value.
    * @param {Number} precision Amount of decimal places.
    * @param {String} [rounding] Type of decimal rounding (round (default), floor or ceil).
    * @returns {Number} Rounded numeric value.
    */
    $.roundNumber = function (value, precision, rounding)
    {
        if ($.isEmpty(value) || isNaN(value))
            return value;

        if (typeof (value) == 'string')
            value = parseFloat(value);

        if (!rounding || rounding.toString().toLowerCase() == 'round')
            return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
        else if (rounding.toString().toLowerCase() == 'floor')
            return Math.floor(value * Math.pow(10, precision)) / Math.pow(10, precision);
        else if (rounding.toString().toLowerCase() == 'ceil')
            return Math.ceil(value * Math.pow(10, precision)) / Math.pow(10, precision);
        else
            return value;
    }

    /** 
    * Reverses the specified text.
    * @param {String} text Text to reverse.
    * @returns {String} Reversed text.
    */
    $.reverseText = function (text)
    {
        return text.split('').reverse().join('');
    }

    /** 
    * Replaces each parameter in a specified String with the text equivalent of a corresponding object's value.
    * @param {String} text Text to which the format will be applied.
    * @param {...*|Object} args A variable amount of parameters or an object with named keys to be replaced in the text string.
    * @returns {String} The formatted text.
    */
    $.format = function (text)
    {
        var args = _slice(arguments, 1);

        if ($.isPlainObject(args[0]))
            args = args[0];

        return text.replace(/\{+([^{}]+)\}+/g, replace);

        function replace(match)
        {
            var value = match.toString(),
                left = (value.match(/\{/g) || []).length,
                right = (value.match(/\}/g) || []).length;

            if ((left >= 1 && left % 2 != 0) && (right >= 1 && right % 2 != 0))
                value = value.replace(/\{([^{}]+)\}/, replace);

            return value.replace('{{', '{').replace('}}', '}');

            function replace(match)
            {
                var capture = match.substring(1, match.length - 1);

                if (window.isNaN(capture))
                    return args[capture];
                else
                    return args[parseInt(capture, 10)];
            }
        }
    }

    /** 
    * Formats a numeric value for textual display.
    * @param {Number} value Numeric value.
    * @param {Boolean} [leadingZeros] Defines if leading zeros should be displayed.
    * @param {Boolean} [trailingZeros] Defines if trailing zeros on the decimal side should be displayed.
    * @param {Number} [precision] Amount of decimal places.
    * @param {String} [rounding] Type of decimal rounding when rounding is desired (round, floor or ceil).
    * @param {String} [decimalSeparator = .] The character used as decimal separator.
    * @param {String} [groupSeparator] The character used as group separator.
    * @param {String} [digitPadLeftValue] The specified value is used to right-align the digits by padding this value to the left.
    * @returns {Number} Formatted numeric value.
    */
    $.formatNumber = function (value, leadingZeros, trailingZeros, precision, rounding, decimalSeparator, groupSeparator, digitPadLeftValue)
    {
        if ($.isEmpty(value) || isNaN(value))
            return value;

        var valueText = '', digits = '', decimals = '', groupCount = 0,
            zeros = '0000000000000000000000000000000'; // max 31 decimal digits

        if (!decimalSeparator)
            decimalSeparator = '.';

        if (rounding && rounding != "none")
            value = $.roundNumber(value, precision, rounding);

        if (precision > 31)
            precision = 31;

        valueText = value.toString();

        if (valueText.indexOf('.') == 0)
            valueText = '0' + valueText;

        if (valueText.indexOf('.') > -1)
        {
            decimals = valueText.substr(valueText.indexOf('.') + 1);
            digits = valueText.replace('.' + decimals, '');
        }
        else
            digits = valueText;

        if (!$.isEmpty(digitPadLeftValue))
            digits = (digitPadLeftValue + digits).slice(digitPadLeftValue.length * -1);

        if (!leadingZeros)
            digits = digits.replace(/(?=^0+[1-9]*)0+/, '');

        if (!digits)
            digits = '0';

        if (!$.isEmpty(precision))
        {
            if (precision == 0)
                decimals = '';
            else if (decimals.toString().length > precision)
                decimals = decimals.substr(0, precision)
            else if (decimals.toString().length < precision)
                decimals += zeros.substr(0, precision - decimals.toString().length);
        }

        if (!trailingZeros)
            decimals = decimals.replace(/([0]+$)/g, '');

        if (!groupSeparator)
            valueText = digits;
        else
            valueText = digits.replace(/(?=(\d{3})+$)/g, groupSeparator).replace(/^[^0-9]/g, '');

        if (precision != 0 && decimals)
            valueText += decimalSeparator + decimals;

        return valueText;
    }

    /** 
    * Formats a date value for textual display.
    * @param {Date} date The Date value.
    * @param {String} format The Date format as in 'MM-dd-yyyy hh:mm:ss'. Casing for Month and minutes is required, other casings are ignored.
    */
    $.formatDate = function (date, format)
    {
        var day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear(),
            hour = date.getHours(), min = date.getMinutes(), sec = date.getSeconds();

        format = (format) ? format : 'MM-dd-yyyy';
        return format.replace(/yyyy/gi, year).replace('MM', $.padLeft(month, 2)).replace('M', month).replace(/dd/gi, $.padLeft(day, 2)).replace(/d/gi, day)
            .replace(/hh/gi, $.padLeft(hour, 2)).replace(/h/gi, hour)
            .replace('mm', $.padLeft(min, 2)).replace('m', min)
            .replace(/ss/gi, $.padLeft(sec, 2)).replace(/s/gi, sec);
    }

    /** 
    * Parses a string value to a workable date object.
    * @param {String} value Date value as string.
    * @param {String} format Date format as in 'mm-dd-yyyy hh:mm:ss'.
    * @returns {Date} New Date object.
    */
    $.parseDate = function (value, format)
    {
        var splitChar = format.match(/([^\w])/)[1];

        format = format.toLowerCase().replace('t', ' ');
        value = value.toLowerCase().replace('t', ' ').replace(/[\/\.\-]/g, splitChar); // use same date separator in value as in format    

        var df = $.trim(format.replace(/(h+:[^\s]*)([\s]|$)/gi, '')),
            parts = df.split(splitChar),
            dv = $.trim(value.replace(/(\d+:[^\s]*)([^\d]|$)/g, '')),
            d = dv.split(splitChar),
            hasTime = dv.length < value.length,
            isDigit = function (v) { return /^[0-9]+$/.test(v); },
            equalize = function (format, value)
            {
                $.each(format, function (f, index)
                {
                    var v = value[index];

                    if (!v)
                        return;

                    if (f.length < v.length)
                        format[index] += f[0];
                    else if (v.length < f.length && f.length == 2)
                        value[index] = '0' + v[0];
                });
            };

        if (!isDigit(d[0]) || !parseFloat(d[0]) || !isDigit(d[1]) || !parseFloat(d[1]) || !isDigit(d[2]) || !parseFloat(d[2]))
            return null;

        equalize(parts, d);

        var f = parts.join(splitChar),
            v = d.join(splitChar),
            year = v.substring(f.indexOf('y'), f.lastIndexOf('y') + 1),
            month = v.substring(f.indexOf('m'), f.lastIndexOf('m') + 1),
            day = v.substring(f.indexOf('d'), f.lastIndexOf('d') + 1),
            date = new Date(parseFloat(year), parseFloat(month) - 1, parseFloat(day));

        if (hasTime && format.indexOf('h:') > -1)
        {
            var tv = $.trim(value.replace(dv, '')),
                t = tv.split(':');

            if (t.filter(function (i) { return (isDigit(i)); }).length > 0)
            {
                var tf = $.trim(format.replace(df, ''));

                parts = tf.split(':');
                equalize(parts, t);
                f = parts.join(':');
                v = t.join(':');

                var hour = v.substring(f.indexOf('h'), f.lastIndexOf('h') + 1),
                    minute = v.substring(f.indexOf('m'), f.lastIndexOf('m') + 1),
                    second = (f.indexOf('s') > -1) ? v.substring(f.indexOf('s'), f.lastIndexOf('s') + 1) : 0;

                date.setHours(hour);
                date.setMinutes(minute);
                date.setSeconds(second);
            }
        }

        return date;
    }

    /** 
    * Returns true if the specified year is a leap year, otherwise false.
    * @param {Number} year The year.
    * @returns {Boolean} A value indicating if the specified year is a leap year.
    */
    $.isLeapYear = function (year)
    {
        return (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0));
    }

    /** 
    * Gets the ISO-8601 week number (Mon-Sun, first 4 day week) or the alternative variant (Sun-Sat/Sat-Fri, first week has 1st of January) when the first day is specified as Saturday or Sunday.
    * @param {Date} date Date object.
    * @param {Number} [firstDay=1] Day of the week 0:Sunday, 1:Monday, 6:Saturday.
    * @returns {Number} Week number.
    */
    $.getWeekNumber = function (date, firstDay)
    {
        firstDay = ($.isEmpty(firstDay)) ? 1 : firstDay;
        var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())),
            day = d.getUTCDay();

        if (firstDay == 0 || firstDay == 6)
        {
            if (firstDay == 6)
                day = (day == 6) ? 0 : day + 1;

            d.setUTCDate(d.getUTCDate() - day);
        }
        else
            d.setUTCDate(d.getUTCDate() + 4 - (day || 7)); // Set to nearest Thursday (sunday = day 7 instead of 0)

        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1)), // Get first day of year
            week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7); // Calculate full weeks to nearest Thursday

        if (firstDay == 1)
            return week;

        var startNewYear = new Date(Date.UTC(d.getUTCFullYear() + 1, 0, 1)); // Get first day of next year

        if (((startNewYear - d) / 86400000) > 6)
            return week;
        else
            return 1; // 1st of January is in this week
    }

    /** 
    * Gets the start date of the week by following the ISO-8601 standard.
    * @param {Number} week The week number.
    * @param {Number} year The year.
    * @param {Number} firstDay Day of the week (0-6). 0:Sunday, 6:Saturday.
    * @returns {Date} The start date of the week.
    */
    $.getDateOfWeek = function (week, year, firstDay)
    {
        var start = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7)),
            dayOfWeek = start.getUTCDay() - firstDay;

        if (dayOfWeek < 4)
            start.setDate(start.getUTCDate() - start.getUTCDay() + firstDay);
        else
            start.setDate(start.getUTCDate() + 7 - (start.getUTCDay() - firstDay));

        return start;
    }

    /** 
    * Selects a range of characters within the element.
    * @param {HTMLElement} element The element.
    * @param {Number} start Start index of selection.
    * @param {Number} [length] Selection length.
    */
    $.selectTextRange = function (element, start, length)
    {
        var doc = element.ownerDocument,
            view = $.defaultView(element),
            text = element.nodeValue || element.textContent || element.innerText || element.value || '',
            textLength = text.length,
            start = start || 0,
            length = length || (textLength - start),
            end = start + length,
            range = null, sel = null, sNode = null, eNode = null;

        if (start > end)
            return;

        if (element.focus)
            element.focus();

        if (element.setSelectionRange)
            element.setSelectionRange(start, end); // input or textarea
        else
        {
            // DOM element
            if (element.firstChild)
            {
                sNode = getNode(start);
                eNode = getNode(end);
                start = start - sNode.start;
                end = end - eNode.start;
                sNode = sNode.node;
                eNode = eNode.node;
            }
            else
                sNode = eNode = element;

            range = doc.createRange();
            range.setStart(sNode, start);
            range.setEnd(eNode, end);
            sel = view.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }

        function getNode(pos)
        {
            var node = element.firstChild,
                result = { start: 0, node: null },
                offset = 0, length = 0, text = '';

            result.node = node;

            if (pos > 0)
            {
                while (node && offset < pos)
                {
                    text = node.nodeValue || node.textContent || node.innerText;
                    offset += text.length;
                    result.node = node;
                    node = node.nextSibling;
                }

                result.start = offset - text.length;
            }

            node = result.node;

            while (node.nodeType != 3)
            {
                // get text node
                result.node = node.firstChild;
                node = result.node;
            }

            return result;
        }
    }

    /** 
    * Sets the text or value of a DOM element/node.
    * 
    * @param {HTMLElement} element The element/node.
    * @param {String} text Text content.
    */
    $.setText = function (element, text)
    {
        if (text == undefined || text == null)
            text = '';

        var nodeName = element.nodeName.toLowerCase(),
            isInput = (nodeName == 'input' || nodeName == 'textarea' || nodeName == 'select');

        if (isInput && text != element.value) // last part is IE fix, setting value to empty when it was empty results in onchange event not fireing.
            element.value = text;
        else if (!isInput && element.textContent != undefined)
            element.textContent = text;
    }

    /** 
    * Checks if an element is focusable.
    * 
    * @param {HTMLElement} element The element.
    * @returns {Boolean} A value indicating if the element is focusable.
    */
    $.focusable = function (element)
    {
        if (element.tabIndex > -1 && !element.disabled && element.offsetHeight > 0)
            return true;

        return false;
    }

    /** 
    * Checks if an element is visible.
    * 
    * @param {HTMLElement} element The element to check.
    * @param {HTMLElement} [container] If specified the visibility style on the element's parents within the container are checked.
    * @returns {Boolean} A value indicating if the element is visible.
    */
    $.visible = function (element, container)
    {
        var s = $.styleValue,
            container = container || element,
            visible = (element.offsetHeight > 0 && s(element, "visibility") != 'hidden');

        if (container != element)
            element = element.parentNode;

        while (element && element != container && visible)
        {
            visible = (s(element, "visibility") != 'hidden');
            element = element.parentNode;
        }

        return visible;
    }

    /** 
    * Detects and returns the scrollable root element.
    * @returns {HTMLElement} The scrollable root element.
    */
    $.scrollableRoot = function ()
    {
        var div, docElement;

        if ($.getDocument().documentElement.scrollTop > 0)
            return $.getDocument().documentElement;
        else if ($.getDocument().body.scrollTop > 0)
            return $.getDocument().body;
        else
        {
            div = $.getDocument().body.appendChild($.getDocument().createElement('div'));
            $.setStyle(div, 'width:1px;height:' + $.getWindowSize().height + 1000);
            $.getDocument().documentElement.scrollTop = 1;
            $.getDocument().body.scrollTop = 1;
            docElement = ($.getDocument().documentElement.scrollTop > 0) ? $.getDocument().documentElement : $.getDocument().body;
            docElement.scrollTop = 0;
            div.parentNode.removeChild(div);
            return docElement;
        }
    }

    /** Defines the prototype of an object and keeps the correct constructor.
    * @param {Object} obj The object to derive from the base object.
    * @param {Object} baseObj The base object that will become the prototype of the derived object.
    */
    $.prototype = function (obj, baseObj)
    {
        obj.prototype = _createObject(baseObj); // create new instance otherwise prototype constructor is overridden when the same base object is used.
        obj.prototype.constructor = obj;
    }

    /** Creates a new instance by calling the specified constructor and initializes the new object with the specified properties.
    * @param {Function} constructor An object's constructor function.
    * @param {Object} properties The initialization properties of the new object.
    * @returns {Object} The new object instance.
    */
    $.instantiate = function (constructor, properties)
    {
        return $.clone(new constructor(), properties, true, true, true, false, true);
    }

    /** Defers the specified method until the current task stack has finished processing.
    * @param {Function} fn The method to invoke as soon as possible after the current task stack has finished. Use the native bind method to pass in arguments.
    */
    $.defer = function (fn)
    {
        if (window.Promise)
            window.Promise.resolve().then(fn);
        else
            setTimeout(fn, 0);
    }

    /** Scrolls to the vertical or horizontal position of the specified element.
    * @param {HTMLElement} element The element to scroll to.
    * @param {HTMLElement} [scrollElement] A parent scroll element.
    * @param {Number} [type] A value indicating if scrolling should be vertical (0), horizontal (1) or vertical & horizontal (2).
    * @param {componyx.library.animationSettings} [animationSettings] Animation settings for the scroll effect.
    */
    $.scrollTo = function (element, scrollElement, type, animationSettings)
    {
        scrollElement = scrollElement || $.scrollableRoot();

        if (!type || type == 2)
            scrollElement.scrollTop = 0;

        if (type > 1)
            scrollElement.scrollLeft = 0;

        var scrollPos = $.getPos(element, scrollElement),
            props = {};

        if (!type || type == 2)
            props.scrollTop = scrollPos.top;

        if (type > 1)
            props.scrollLeft = scrollPos.left;

        if (animationSettings)
            $.animate(scrollElement, props, animationSettings);
        else
        {
            $.each(props, function (v, k)
            {
                scrollElement[k] = v;
            });
        }
    }

    /** Checks if the specified element is visible within the current viewport (window dimensions with vertical and horizontal scrollbar position).
    * @param {HTMLElement} element The element to check for.
    * @returns {componyx.library.Viewport} An object describing the element's visibility within the viewport.
    */
    $.inViewport = function (element)
    {
        if (!element)
            return false;

        var winSize = $.getWindowSize(), result = {},
            scroll = $.getScrollPosition(),
            viewport =
            {
                top: scroll.scrollTop,
                bottom: scroll.scrollTop + winSize.height,
                left: scroll.scrollLeft,
                right: scroll.scrollLeft + winSize.width
            },
            pos = $.getPos(element);

        result.top = pos.top >= viewport.top && pos.top <= viewport.bottom;
        result.bottom = pos.bottom >= viewport.top && pos.bottom <= viewport.bottom;
        result.left = pos.left >= viewport.left && pos.left <= viewport.right;
        result.right = pos.right >= viewport.left && pos.right <= viewport.right;
        result.visible = (result.top || result.bottom) && (result.left || result.right);
        result.full = result.top && result.bottom && result.left && result.right;

        return result;
    }

    /** Logs the message in the js console if available.
    * @param {String} message The message to log.
    */
    $.log = function (message)
    {
        if (!$.getDocument().defaultView.console || !$.getDocument().defaultView.console.log)
            return;

        var date = new Date();
        $.getDocument().defaultView.console.log($.format("{0}:{1}:{2} {3}", $.padLeft(date.getHours(), 2), $.padLeft(date.getMinutes(), 2), $.padLeft(date.getSeconds(), 2), message));
    }

    /**
    * JSON
    * @namespace
    */
    $.JSON =
    {
        /** 
        * Serializer casing options.
        * @readonly
        * @enum {number}
        */
        CasingOption:
        {
            NONE: 0,
            CAMELCASE: 1,
            PASCALCASE: 2
        },

        /** 
        * Serializer optimizer options.
        * @readonly
        * @enum {number}
        */
        OptimizerOption:
        {
            NONE: 0,
            EXCLUDENULL: 1,
            EXCLUDEFALSE: 2,
            EXCLUDEZERO: 4,
            EXCLUDEEMPTY: 8,
            OPTIMIZED: 16
        },

        /** 
        * Serializes an object to a JSON string.
        * @param {Object} obj Object to serialize.
        * @param {CasingOption} casing Casing option.
        * @param {OptimizerOption} optimizer Optimizer option(s).
        * @param {Object} properties List of property keys to include/exclude.
        * @param {Boolean} exclude Defines whether keys in the properties parameter should be included(default) or excluded.
        * @param {Function} replacer Replacer method to control property serialization.
        */
        serialize: function (obj, casing, optimizer, properties, exclude, replacer)
        {
            var keys = null;
            $.each(properties, function (key)
            {
                if (!keys)
                    keys = {};

                keys[key] = true;
            });

            return $.getDocument().defaultView.JSON.stringify(obj, function (key, value)
            {
                return _JSON.replacer(key, value, casing, optimizer, keys, exclude, replacer);
            });
        },

        /** 
        * Deserializes a JSON string to an object.
        * @param {String} json JSON string to deserialize.
        * @param {CasingOption} casing Casing option.
        * @param {OptimizerOption} optimizer Optimizer option(s).
        * @param {Object} properties List of property keys to include/exclude.
        * @param {Boolean} exclude Defines whether keys in the properties parameter should be included(default) or excluded.
        * @param {Function} replacer Replacer method to control property serialization.
        */
        deserialize: function (json, casing, optimizer, properties, exclude, replacer)
        {
            var keys = null;
            $.each(properties, function (key)
            {
                if (!keys)
                    keys = {};

                keys[key] = true;
            });

            return $.getDocument().defaultView.JSON.parse(json, function (key, value)
            {
                return _JSON.replacer(key, value, casing, optimizer, keys, exclude, replacer);
            });
        }
    }

    window.$ = window.$ || window.$lib;

})(window);
