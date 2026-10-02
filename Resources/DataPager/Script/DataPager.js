/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * DataPager class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {Object} An instance of the component.
    */
    componyx.UI.DataPager = function DataPager(id, properties)
    {
        // define private properties
        var _instance = this,
            _pageIndex = 1,
            _renderCount = 0,
            _renderedCount = 0,
            _fireChange = true,
            _hidden,
            _themeOption = $base.static.ThemeOption,

            _classOption =
            {
                DATAPAGER: 'data-pager',
                BUTTONFIRST: 'button first',
                BUTTONLAST: 'button last',
                BUTTONPREVIOUS: 'button prev',
                BUTTONNEXT: 'button next',
                BUTTONPREVIOUSGROUP: 'button prev-group',
                BUTTONNEXTGROUP: 'button next-group',
                BUTTONPAGE: 'button page',
                PAGEHOLDER: 'page-holder'
            },

            _buttonOption =
            {
                FIRST: -1,
                LAST: -2,
                PREVIOUS: -3,
                NEXT: -4,
                PREVIOUSGROUP: -5,
                NEXTGROUP: -6
            };

        // define public properties
        /**
         * Gets or sets the css class of the button container.
         * @type {String}
         */
        this.cssClassButtonHolder = '';

        /**
         * Gets or sets the css class of the info container.
         * @type {String}
         */
        this.cssClassInfoHolder = '';

        /**
         * Gets or sets the css class of the page container.
         * @type {String}
         */
        this.cssClassPageHolder = '';

        /**
         * Gets or sets the item count.
         * @type {Number}
         */
        this.itemCount = 0;

        /**
         * Gets or sets the items per page.
         * @type {Number}
         */
        this.pageSize = 50;

        /**
         * Gets or sets the number of visible pages.
         * @type {Number}
         */
        this.visiblePages = 5;

        /**
         * Gets or sets the initial page index.
         * @type {Number}
         */
        this.pageIndex = 1;

        /**
         * Gets or sets the name.
         * @type {String}
         */
        this.name = '';

        /**
         * Gets or sets a value indicating whether the index change event is fired when the component is rendered.
         * @type {Boolean}
         */
        this.initialIndexChange = false;

        /**
         * Gets or sets the id of the numeric box from which the settings are cloned.
         * @type {String|null}
         */
        this.numericBoxId = null;

        /**
         * Gets or sets the id of the hidden input from which the settings are cloned. The hidden input contains the current page index.
         * @type {String|null}
         */
        this.hiddenInputId = null;

        /**
         * Gets or sets the IDs of the pager buttons.
         * @type {Object}
         */
        this.buttons = {
            /**
             * Gets or sets the ID of the first page button.
             * @type {String|null}
             */
            firstPageButtonId: null,

            /**
             * Gets or sets the ID of the last page button.
             * @type {String|null}
             */
            lastPageButtonId: null,

            /**
             * Gets or sets the ID of the previous page button.
             * @type {String|null}
             */
            previousPageButtonId: null,

            /**
             * Gets or sets the ID of the next page button.
             * @type {String|null}
             */
            nextPageButtonId: null,

            /**
             * Gets or sets the ID of the previous page group button.
             * @type {String|null}
             */
            previousPageGroupButtonId: null,

            /**
             * Gets or sets the ID of the next page group button.
             * @type {String|null}
             */
            nextPageGroupButtonId: null,

            /**
             * Gets or sets the ID of the page button.
             * @type {String|null}
             */
            pageButtonId: null
        };

        /**
         * @class
         * @augments componyx.UI.base.Events
         * @memberof componyx.UI.DataPager
         * @property {componyx.UI.base.Event} onFocus        - Event which fires when the datapager is focused.
         * @property {componyx.UI.base.Event} onBlur         - Event which fires when the datapager is blurred.
         * @property {componyx.UI.base.Event} onIndexChange  - Event which fires on a page index change. @see {@link componyx.UI.DataPager.IndexChangeEventArgs}
         * @see {@link componyx.UI.base.Events}
         */
        function DataPagerEvents(events)
        {
            Object.assign(this, events);

            this.onFocus = $base.static.createEvent('onFocus');
            this.onBlur = $base.static.createEvent('onBlur');
            this.onIndexChange = $base.static.createEvent('onIndexChange');
        };

        /**
         * DataPager events
         * @type {componyx.UI.DataPager.DataPagerEvents}
         */
        this.events = new DataPagerEvents(this.events);

        /**
         * DataPager index change event arguments.
         * @typedef {Object} IndexChangeEventArgs
         * @memberof componyx.UI.DataPager
         * @property {Number} pageIndex - The new page index (1-based).
         */

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        /** 
        * Sets buttons template.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content HTML string or element node as content. Pass null or empty string to remove the existing template.
        */
        this.setButtonTemplate = function (content)
        {
            _instance.addTemplate('Button', content);
        }

        /** 
        * Sets paging info template.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content HTML string or element node as content. Pass null or empty string to remove the existing template.
        */
        this.setInfoTemplate = function (content)
        {
            _instance.addTemplate('Info', content);
        }

        /** 
        * Gets the index of the current page.
        */
        this.getPageIndex = function ()
        {
            return _pageIndex;
        }

        /** 
        * Sets the page index to the specified number.
        * @param {Number} pageIndex The page index.
        */
        this.setPageIndex = function (pageIndex)
        {
            setPageIndex(pageIndex);
        }

        /** 
        * Gets the page count.
        */
        this.getPageCount = function ()
        {
            return getPageCount();
        }

        /** 
        * Gets the first item index of the current page.
        */
        this.getPageFirst = function ()
        {
            return getPageFirst();
        }

        /** 
        * Gets the last item index of the current page.
        */
        this.getPageLast = function ()
        {
            return getPageLast();
        }

        /** 
        * Renders the component.
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'data-pager', false);
                return;
            }

            // render logic after loading resources

            if (!_instance.hasTemplate('Button'))
                _instance.addTemplate('Button', '{first}{previous}{pages}{next}{last}{pageJump}');

            if (!_instance.hasTemplate('Info'))
                _instance.addTemplate('Info', 'Page {pageIndex}-{pageCount} / items {firstItemIndex}-{lastItemIndex} ({itemCount})');

            draw();
        }

        function preRender()
        {
            // initialize script and css
            return ['DataPager', ['Button', 'NumericBox']];
        }

        function postRender()
        {
            _renderedCount++;

            if (_renderCount != _renderedCount)
                return;

            drawInfo();

            _fireChange = _instance.initialIndexChange;

            if (!_instance.pageIndex && !$lib.isEmpty(_hidden.value) && !isNaN(_hidden.value))
                _instance.pageIndex = parseInt(_hidden.value, 10);

            if (_instance.itemCount > 0)
                update(_instance.pageIndex);

            _fireChange = true;

            _hidden = _instance.createSyncedInput(_instance.hiddenInputId, function ()
            {
                _instance.setPageIndex(this.value);
            });
            _hidden.__setValue(_pageIndex);

            $base.methods.postRender.call(_instance);
        }

        function draw()
        {
            _renderCount = _renderedCount = 0;
            drawButtons();
        }

        function drawButtons()
        {
            var values = {}, id = _instance.id, divPageHolder = null,
                divContainer = document.createElement('div');

            values['first'] = $lib.format('<div id="{0}_{1}"></div>', id, 'First');
            values['last'] = $lib.format('<div id="{0}_{1}"></div>', id, 'Last');
            values['previous'] = $lib.format('<div id="{0}_{1}"></div>', id, 'Prev');
            values['next'] = $lib.format('<div id="{0}_{1}"></div>', id, 'Next');
            values['pages'] = $lib.format('<div id="{0}_{1}"></div><div id="{0}_{2}"></div><div id="{0}_{3}"></div>', id, 'PrevGroup', 'Pages', 'NextGroup');
            values['pageJump'] = $lib.format('<div id="{0}_{1}"></div>', id, 'PageJump');

            if (_instance.cssClassButtonHolder)
                divContainer.className = _instance.cssClassButtonHolder;

            _instance.element.appendChild(divContainer);
            _instance.applyTemplate(divContainer, 'Button', values);

            divPageHolder = $lib($lib.format('#{0}_{1}', id, 'Pages'));

            if (divPageHolder && _instance.visiblePages > 0)
                _renderCount = 2 + _instance.visiblePages;

            if ($lib($lib.format('#{0}_First', id)))
                _renderCount++;

            if ($lib($lib.format('#{0}_Last', id)))
                _renderCount++;

            if ($lib($lib.format('#{0}_Prev', id)))
                _renderCount++;

            if ($lib($lib.format('#{0}_Next', id)))
                _renderCount++;

            if ($lib($lib.format('#{0}_PageJump', _instance.id)))
                _renderCount++;

            if ($lib($lib.format('#{0}_First', id)))
                createButton($lib.format('{0}_First', id), _instance.buttons.firstPageButtonId, null, null, _classOption.BUTTONFIRST, _buttonOption.FIRST);

            if ($lib($lib.format('#{0}_Last', id)))
                createButton($lib.format('{0}_Last', id), _instance.buttons.lastPageButtonId, null, null, _classOption.BUTTONLAST, _buttonOption.LAST);

            if ($lib($lib.format('#{0}_Prev', id)))
                createButton($lib.format('{0}_Prev', id), _instance.buttons.previousPageButtonId, null, null, _classOption.BUTTONPREVIOUS, _buttonOption.PREVIOUS);

            if ($lib($lib.format('#{0}_Next', id)))
                createButton($lib.format('{0}_Next', id), _instance.buttons.nextPageButtonId, null, null, _classOption.BUTTONNEXT, _buttonOption.NEXT);

            if (divPageHolder && _instance.visiblePages > 0)
            {
                divPageHolder.className = _instance.cssClassPageHolder || _classOption.PAGEHOLDER;
                createButton($lib.format('{0}_PrevGroup', id), _instance.buttons.previousPageGroupButtonId, divPageHolder, '...', _classOption.BUTTONPREVIOUSGROUP, _buttonOption.PREVIOUSGROUP);

                for (var index = 1; index <= _instance.visiblePages; index++)
                {
                    createButton($lib.format('{0}_{1}', id, index), _instance.buttons.pageButtonId, divPageHolder, null, _classOption.BUTTONPAGE, index);
                }

                createButton($lib.format('{0}_NextGroup', id), _instance.buttons.nextPageGroupButtonId, divPageHolder, '...', _classOption.BUTTONNEXTGROUP, _buttonOption.NEXTGROUP);
            }
            else
                divPageHolder.style.display = $lib('#' + id + '_PrevGroup').style.display = $lib('#' + id + '_NextGroup').style.display = 'none';


            if ($lib($lib.format('#{0}_PageJump', _instance.id)))
                createPageJump();
        }

        function drawInfo()
        {
            var values = {}, id = _instance.id,
                divContainer = document.createElement('div');

            values['pageIndex'] = $lib.format('<span id="{0}_{1}"></span>', id, 'PageIndex');
            values['pageCount'] = $lib.format('<span id="{0}_{1}"></span>', id, 'PageCount');
            values['firstItemIndex'] = $lib.format('<span id="{0}_{1}"></span>', id, 'FirstIndex');
            values['lastItemIndex'] = $lib.format('<span id="{0}_{1}"></span>', id, 'LastIndex');
            values['itemCount'] = $lib.format('<span id="{0}_{1}"></span>', id, 'ItemCount');

            if (_instance.cssClassInfoHolder)
                divContainer.className = _instance.cssClassInfoHolder;

            _instance.element.appendChild(divContainer);
            _instance.applyTemplate(divContainer, 'Info', values);
        }

        function createButton(id, cloneId, container, text, cssClass, option)
        {
            var button = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: container });

            button.primary = false;
            button.transparent = true;
            button.clone($UI.store[cloneId], _instance);

            if (!container)
            {
                button.hasIcon = true;
            }
            else
            {
                button.contentAlign = componyx.UI.Button.AlignOption.CENTER;
                button.text = text;

                if (option != _buttonOption.PREVIOUSGROUP && option != _buttonOption.NEXTGROUP)
                {
                    button.type = componyx.UI.Button.TypeOption.RADIOBUTTON;
                    button.radioGroupId = container.id;
                }
            }

            button.cssClass = cssClass;
            button.events.onPostRender.priorityAdd(postRender, null);
            button.command = function () { buttonAction(option); };
            button.delegateFocusEvents(_instance);
            button.show();
        }

        function createPageJump()
        {
            var id = $lib.format('{0}_PageJump', _instance.id),
                input = $UI.createComponent(componyx.UI.NumericBox, { id: id });

            input.clone($UI.store[_instance.numericBoxId], _instance);
            input.minValue = 1;
            input.maxValue = getPageCount();
            input.events.onPostRender.priorityAdd(postRender, null);
            input.events.onChanged.priorityAdd(pageJump, null);
            input.delegateFocusEvents(_instance);
            input.show();

            return input;
        }

        function pageJump(input, args)
        {
            if (!input.getValue())
            {
                input.setValue(_pageIndex);
                return;
            }

            update(parseInt(input.getValue(), 10));
        }

        function buttonAction(option)
        {
            if (!_instance.itemCount)
                return;

            var index = 1, pages = _instance.visiblePages;

            switch (option)
            {
                case _buttonOption.FIRST:
                    {
                        index = 1;
                        break;
                    }
                case _buttonOption.LAST:
                    {
                        index = getPageCount();
                        break;
                    }
                case _buttonOption.PREVIOUS:
                    {
                        index = _pageIndex - 1;
                        break;
                    }
                case _buttonOption.NEXT:
                    {
                        index = _pageIndex + 1;
                        break;
                    }
                case _buttonOption.PREVIOUSGROUP:
                    {
                        index = (Math.floor((_pageIndex - 1) / pages) * pages);
                        break;
                    }
                case _buttonOption.NEXTGROUP:
                    {
                        index = (Math.ceil(_pageIndex / pages) * pages) + 1;
                        break;
                    }
                default:
                    {
                        index = (Math.floor((_pageIndex - 1) / pages) * pages) + option;
                        break;
                    }
            }

            update(index);
        }

        function getPageCount()
        {
            return Math.ceil(_instance.itemCount / _instance.pageSize);
        }

        function getFirstItemIndex()
        {
            return ((_pageIndex - 1) * _instance.pageSize) + 1;
        }

        function getLastItemIndex()
        {
            var index = ((_pageIndex - 1) * _instance.pageSize) + _instance.pageSize;
            return (index > _instance.itemCount) ? _instance.itemCount : index;
        }

        function setPageIndex(index)
        {
            _fireChange = false;
            update(index);
            _fireChange = true;
        }

        function update(index)
        {
            var id = _instance.id,
                pages = _instance.visiblePages,
                first = $UI.store[$lib.format('{0}_First', id)],
                last = $UI.store[$lib.format('{0}_Last', id)],
                prev = $UI.store[$lib.format('{0}_Prev', id)],
                next = $UI.store[$lib.format('{0}_Next', id)],
                prevGroup = $UI.store[$lib.format('{0}_PrevGroup', id)],
                nextGroup = $UI.store[$lib.format('{0}_NextGroup', id)],
                input = $UI.store[$lib.format('{0}_PageJump', _instance.id)],
                groupStart = Math.floor((index - 1) / pages) * pages,
                pageCount = getPageCount(),
                button = null;

            if (index > pageCount)
                index = pageCount;

            _pageIndex = index;

            if (_hidden)
                _hidden.__setValue(_pageIndex);

            if (first && _pageIndex == 1)
                first.disable();
            else if (first)
                first.enable();

            if (prev && _pageIndex == 1)
                prev.disable();
            else if (prev)
                prev.enable();

            if (last && _pageIndex == pageCount)
                last.disable();
            else if (last)
                last.enable();

            if (next && _pageIndex == pageCount)
                next.disable();
            else if (next)
                next.enable();

            if (prevGroup && !groupStart)
                prevGroup.disable();
            else if (prevGroup)
                prevGroup.enable();

            if (nextGroup && (groupStart + pages) >= pageCount)
                nextGroup.disable();
            else if (nextGroup)
                nextGroup.enable();

            if (pageCount <= pages)
            {
                if (prevGroup)
                    prevGroup.hide();

                if (nextGroup)
                    nextGroup.hide();
            }
            else
            {
                if (prevGroup)
                    prevGroup.show();

                if (nextGroup)
                    nextGroup.show();
            }

            if ($lib($lib.format('#{0}_Pages', id)) && pages > 0)
            {
                for (var index = 1; index <= pages; index++)
                {
                    button = $UI.store[$lib.format('{0}_{1}', id, index)];
                    button.text = (groupStart + index).toString();
                    button.updateContent();

                    if ((groupStart + index) > pageCount)
                        button.hide();
                    else
                    {
                        button.show();

                        if (button.disabled)
                            button.enable();

                        if (groupStart + index == _pageIndex)
                            button.select();
                    }
                }
            }

            updateLabels();

            if (input && input.getValue() != _pageIndex.toString())
            {
                input.maxValue = pageCount;
                input.setValue(_pageIndex.toString(), false);
            }

            if (_fireChange)
                _instance.events.onIndexChange.fire(_instance, { pageIndex: _pageIndex });
        }

        function updateLabels()
        {
            if ($lib($lib.format('#{0}_PageIndex', id)))
                $lib($lib.format('#{0}_PageIndex', id)).innerHTML = _pageIndex;

            if ($lib($lib.format('#{0}_PageCount', id)))
                $lib($lib.format('#{0}_PageCount', id)).innerHTML = getPageCount();

            if ($lib($lib.format('#{0}_FirstIndex', id)))
                $lib($lib.format('#{0}_FirstIndex', id)).innerHTML = getFirstItemIndex();

            if ($lib($lib.format('#{0}_LastIndex', id)))
                $lib($lib.format('#{0}_LastIndex', id)).innerHTML = getLastItemIndex();

            if ($lib($lib.format('#{0}_ItemCount', id)))
                $lib($lib.format('#{0}_ItemCount', id)).innerHTML = _instance.itemCount;
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.DataPager.prototype = Object.create($base.methods);
    componyx.UI.DataPager.prototype.constructor = componyx.UI.DataPager;
})(window);