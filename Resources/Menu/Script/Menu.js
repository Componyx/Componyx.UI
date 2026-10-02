/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(async function (window)
{
    /**
     * Namespace for menu modules.
     * @namespace componyx.UI.menu_modules
     */
    componyx.UI.menu_modules = componyx.UI.menu_modules || {};

    /**
     * Promise that resolves when all menu modules are loaded asynchronously.
     * @type {Promise<void>}
     * @memberof componyx.UI.menu_modules
     */
    componyx.UI.menu_modules.loaded = (async () =>
    {
        // these dynamic imports are removed when files are bundled into UI(.min).js
        await import(`${$UI.getScriptResourcePath('Base.NavigationManager')}`);
    })();

    await componyx.UI.menu_modules.loaded;
    const NavigationManager = componyx.base_modules.NavigationManager;

    /**
    * Menu class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @property {componyx.UI.base.AjaxMethod} ajax.load - AJAX method used to load items on demand.
    * @returns {Object} An instance of the component.
    */
    componyx.UI.Menu = function Menu(id, properties)
    {
        var _instance = this,
            _toggle = false,
            _hasDynamicGroup = false,
            _pointerEnterEvent = false,
            _cancelExpand = null,
            _allowExpand = true,
            _allowCollapse = true,
            _expandStates = {},
            _expandList = [],
            _currentExpandId = null,
            _queuedExpandItemId = null,
            _timerId = null,
            _cachedExpand = false,
            _expanderElement = null,
            _selectedItemId = null,
            _collapseInstant = false,
            _categoryId,
            _pointerCoordinates,
            _expandOnClickOption = componyx.UI.Menu.ExpandOnClickOption,
            _expandDirectionOption = componyx.UI.Menu.ExpandDirectionOption,
            _typeOption = componyx.UI.Menu.TypeOption,
            _collapseTypeOption = componyx.UI.Menu.CollapseTypeOption,
            _expandStateOption =
            {
                EXPANDING: 0,
                EXPANDED: 1,
                COLLAPSING: 2,
                COLLAPSED: 3
            },
            _classOption =
            {
                HORIZONTALROOT: 'horizontal',
                ITEM: 'button item',
                ITEMGROUP: 'item-group box',
                ITEMGROUPROOT: 'root',
                ITEMGROUPVISIBLEROOT: 'visible-root',
                ITEMGROUPSTATIC: 'static',
                CATEGORY: 'cat',
                CATEGORY_NAVIGATOR: 'cat-nav',
                CATEGORY_CONTAINER: 'cat-container',
                SUBGROUP: 'sub-group',
                ITEMCHILDLESS: 'childless',
                SELECTEDCHILD: 'sel-child',
                EXPANDED: 'expanded'
            };

        // define public properties
        /**
         * Gets or sets the default css class of an item group.
         * @type {String}
         */
        this.cssClassItemGroup = '';

        /**
         * Gets or sets the css class of the root item group.
         * @type {String}
         */
        this.cssClassItemGroupRoot = '';

        /**
         * Gets or sets the css class of the root item group when horizontalRoot is true.
         * @type {String}
         */
        this.cssClassItemGroupHorizontalRoot = '';

        /**
         * Gets or sets the css class of the root item group when visibleRoot is true.
         * @type {String}
         */
        this.cssClassItemGroupVisibleRoot = '';

        /**
         * Gets or sets the css class of the root item group when visibleRoot is false.
         * @type {String}
         */
        this.cssClassItemGroupHiddenRoot = '';

        /**
         * Gets or sets the default css class of a subgroup.
         * @type {String}
         */
        this.cssClassSubGroup = '';

        /**
         * Gets or sets the default css class of an item.
         * @type {String}
         */
        this.cssClassItem = '';

        /**
         * Gets or sets the css class of a childless item.
         * @type {String}
         */
        this.cssClassItemChildless = '';

        /**
         * Gets or sets the text label of the main category.
         * @type {String}
         */
        this.mainCategoryLabel = '';

        /**
         * Gets or sets the default template id of an item.
         * @type {String|null}
         */
        this.itemTemplateId = null;

        /**
         * Gets or sets the css style of the item group.
         * @type {String}
         */
        this.itemGroupStyle = '';

        /**
         * Gets or sets a value indicating whether the root level is visible.
         * @type {Boolean}
         */
        this.visibleRoot = true;

        /**
         * Gets or sets a value indicating whether the root level menu items are horizontally rendered.
         * @type {Boolean}
         */
        this.horizontalRoot = true;

        /**
         * Gets or sets a value indicating if we can move inside the menu with the tab key or if the tab key moves to the next focusable element outside of the menu.
         * @type {Boolean}
         */
        this.tabNavigation = true;

        /**
         * Gets or sets a value indicating if child-items are rendered ahead (default) when available or rendered when the parent-item expands.
         * @type {Boolean}
         */
        this.renderOnExpand = false;

        /**
         * Gets or sets a value indicating if the item can be expanded/collapsed (true) or is always in expanded state (false). Option has effect only when the corresponding item-group is statically positioned.
         * @type {Boolean}
         */
        this.expandable = true;

        /**
         * Gets or sets a value indicating if one (true) or more (false) items per group can expanded simultaneously. Option has effect only when the corresponding item-group is statically positioned.
         * @type {Boolean}
         */
        this.singleExpand = false;

        /**
         * Gets or sets a value indicating if a selectable item with child-items is expanded when selected.
         * @type {Boolean}
         */
        this.expandOnSelect = true;

        /**
         * Gets or sets a value indicating if all items are collapsed when an item is selected. Option has effect only when the corresponding item-group is not statically positioned.
         * @type {Boolean}
         */
        this.collapseAllOnSelect = false;

        /**
         * Gets or sets a value indicating if an item is expanded on a pointerenter event, click-event or on a click-event for the root level and on a pointerenter event for deeper levels. Option has effect only when the corresponding item-group is not statically positioned.
         * @type {componyx.UI.Menu.ExpandOnClickOption}
         */
        this.expandOnClick = _expandOnClickOption.ROOT;

        /**
         * Gets or sets the default expand direction of a root menu item.
         * @type {componyx.UI.Menu.ExpandDirectionOption|null}
         */
        this.rootExpandDirection = null;

        /**
         * Gets or sets the default expand direction of a menu item.
         * @type {componyx.UI.Menu.ExpandDirectionOption|null}
         */
        this.expandDirection = null;

        /**
         * Gets or sets a value indicating how items are collapsed when a new item is expanded.
         * @type {componyx.UI.Menu.CollapseTypeOption}
         */
        this.collapseType = _collapseTypeOption.SINGLE;

        /**
         * Gets or sets a value indicating how items are collapsed when all items are collapsed through a click outside the menu boundaries.
         * @type {componyx.UI.Menu.CollapseTypeOption}
         */
        this.collapseAllType = _collapseTypeOption.CASCADE;

        /**
         * Gets or sets the delay in milliseconds before expanding a menu-item through a pointer-enter/leave event.
         * @type {Number}
         */
        this.expandDelay = 100;

        /**
         * Gets or sets the delay in milliseconds before collapsing all menu-items.
         * @type {Number}
         */
        this.collapseDelay = 100;

        /**
         * Gets or sets the id of the base item button.
         * @type {String|null}
         */
        this.buttonId = null;

        /**
         * Gets or sets the id of the base item-group box for the root level container.
         * @type {String|null}
         */
        this.rootItemGroupBoxId = null;

        /**
         * Gets or sets the id of the base item-group box.
         * @type {String|null}
         */
        this.itemGroupBoxId = null;

        /**
         * Gets or sets the list of items.
         * @type {componyx.UI.Menu.Item[]}
         */
        this.itemList = [];

        /** @private
         *  @type {componyx.base_modules.NavigationManager}
         */
        this.navigationManager = null;

        /**
         * @class
         * @augments componyx.UI.base.Events
         * @memberof componyx.UI.Menu
         * @property {componyx.UI.base.Event} onItemClick                  - Event which fires on an item mouseclick. @see {@link componyx.UI.Menu.MenuItemEventArgs}
         * @property {componyx.UI.base.Event} onItemSelect                 - Event which fires on an item select. @see {@link componyx.UI.Menu.MenuItemEventArgs}
         * @property {componyx.UI.base.Event} onItemDeselect               - Event which fires on an item deselect. @see {@link componyx.UI.Menu.MenuItemEventArgs}
         * @property {componyx.UI.base.Event} onItemExpand                 - Event which fires on an item expand. @see {@link componyx.UI.Menu.MenuItemEventArgs}
         * @property {componyx.UI.base.Event} onItemExpandComplete         - Event which fires when an item expand completed. @see {@link componyx.UI.Menu.MenuItemEventArgs}
         * @property {componyx.UI.base.Event} onItemCollapse               - Event which fires on an item collapse. @see {@link componyx.UI.Menu.MenuItemEventArgs}
         * @property {componyx.UI.base.Event} onItemCollapseComplete       - Event which fires when an item collapse completed. @see {@link componyx.UI.Menu.MenuItemEventArgs}
         * @property {componyx.UI.base.Event} onLastItemCollapseComplete   - Event which fires when the last item collapse in the cascade collapse chain has completed. @see {@link componyx.UI.Menu.MenuItemEventArgs}
         * @property {componyx.UI.base.Event} onPreRenderItemGroup         - Event which fires before an itemgroup (box component) is rendered. @see {@link componyx.UI.Menu.MenuItemEventArgs}
         * @property {componyx.UI.base.Event} onPostRenderItemGroup        - Event which fires after an itemgroup (box component) is rendered. @see {@link componyx.UI.Menu.MenuItemEventArgs}
         * @property {componyx.UI.base.Event} onPreRenderItem              - Event which fires before an item is rendered. @see {@link componyx.UI.Menu.MenuItemEventArgs}
         * @property {componyx.UI.base.Event} onPostRenderItem             - Event which fires after an item is rendered. @see {@link componyx.UI.Menu.MenuItemEventArgs}
         * @property {componyx.UI.base.Event} onPreLoadItemList            - Event which fires before the item-list data is loaded. @see {@link componyx.UI.Menu.MenuEventArgs}
         * @property {componyx.UI.base.Event} onPostLoadItemList           - Event which fires when the item-list data is loaded. @see {@link componyx.UI.Menu.MenuEventArgs}
         * @property {componyx.UI.base.Event} onPostRenderItemList         - Event which fires when the item-list is rendered. @see {@link componyx.UI.Menu.MenuEventArgs}
         * @see {@link componyx.UI.base.Events}
         */
        function MenuEvents(events)
        {
            Object.assign(this, events);
            this.onItemClick = $base.static.createEvent('onItemClick');
            this.onItemSelect = $base.static.createEvent('onItemSelect');
            this.onItemDeselect = $base.static.createEvent('onItemDeselect');
            this.onItemExpand = $base.static.createEvent('onItemExpand');
            this.onItemExpandComplete = $base.static.createEvent('onItemExpandComplete');
            this.onItemCollapse = $base.static.createEvent('onItemCollapse');
            this.onItemCollapseComplete = $base.static.createEvent('onItemCollapseComplete');
            this.onLastItemCollapseComplete = $base.static.createEvent('onLastItemCollapseComplete');
            this.onPreRenderItemGroup = $base.static.createEvent('onPreRenderItemGroup');
            this.onPostRenderItemGroup = $base.static.createEvent('onPostRenderItemGroup');
            this.onPreRenderItem = $base.static.createEvent('onPreRenderItem');
            this.onPostRenderItem = $base.static.createEvent('onPostRenderItem');
            this.onPreLoadItemList = $base.static.createEvent('onPreLoadItemList');
            this.onPostLoadItemList = $base.static.createEvent('onPostLoadItemList');
            this.onPostRenderItemList = $base.static.createEvent('onPostRenderItemList');
        }

        /**
         * Menu events
         * @type {componyx.UI.Menu.MenuEvents}
         */
        this.events = new MenuEvents(this.events);

        /**
         * @typedef {Object} componyx.UI.Menu.MenuEventArgs
         * @property {componyx.UI.Menu} Menu - The Menu instance.
         * @property {null} eventArgs - Not used, always null.
         */

        /**
         * @typedef {Object} componyx.UI.Menu.MenuItemEventArgs
         * @property {componyx.UI.Menu} Menu - The Menu instance.
         * @property {Object} eventArgs - The event object containing more detailed information about the event.
         * @property {componyx.UI.Menu.Item|null} eventArgs.item - The menu item (for item-group events: the parent item, null for the root item group).
         * @property {HTMLElement|null} eventArgs.itemElement - The item element, null when there is no item.
         * @property {Event} eventArgs.event - The original event object.
         */

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        /** 
        * Expands the menu with the given item id(s). Animations are disabled when multiple item id's are provided.
        * @param {String|String[]|null} [id] The item identifier(s). The root level is expanded if the item id is not specified.
        * @param {HTMLElement} [expanderElement] The element to which the expand is positioned when the expanding item-group is at root-level and not static positioned. The mouse cursor position is used when no expander element is specified for the previous mentioned scenario.
        * @param {Boolean} [toggle] A value indicating if the item must collapse if it is already expanded.
        * @param {Boolean} [instant=false] A value indicating if the item must be expanded (or collapsed) instantly (without animation). The option has effect only when a single item-id is provided.
        */
        this.expand = function (id, expanderElement, toggle, instant)
        {
            var hasExpandedItem = !$lib.isEmpty(_currentExpandId);

            if (hasExpandedItem && _expanderElement !== expanderElement)
            {
                hasExpandedItem = false;
                _instance.collapseAll(true);
                _expanderElement = null;
            }

            id = id || ['root'];

            if (!$lib.isArray(id))
                id = [id];

            if (_instance.visibleRoot)
            {
                id = id.filter(x => x !== 'root');

                if (!id.length)
                {
                    console.warn(`Ignoring expand of root level for menu ${_instance.id} because visibleRoot is true.`);
                    return;
                }
            }

            instant = (id.length > 1 || instant);
            _allowExpand = true;
            _allowCollapse = false;
            _collapseInstant = instant;

            $lib.each(id, function (id)
            {
                var itemExpanded = _expandStates[id] <= _expandStateOption.EXPANDED,
                    box = getItemBox(id),
                    a = box.animation,
                    showType = a.showType;

                if (_collapseInstant)
                    box.animation.showType = 0;

                if (!itemExpanded)
                {
                    var item = getItem(id);

                    if (expanderElement)
                        _expanderElement = (typeof (expanderElement) == 'string') ? $lib('#' + expanderElement) : expanderElement;

                    if (item.isCategory)
                        showCategory(id, null, _collapseInstant);
                    else
                    {
                        expand(id, instant);
                    }
                }
                else if (toggle)
                {
                    if (id == 'root')
                        _instance.collapseAll();
                    else
                        collapse(id);
                }

                if (_collapseInstant)
                    a.showType = showType;
            });

            _collapseInstant = false;
        }

        /** 
        * Collapses the menu with the given item id(s). Animations are disabled when multiple item id's are provided.
        * @param {String|String[]} [id] The item identifier(s). The root level is expanded if the item id is not specified.
        * @param {Boolean} [instant=false] A value indicating if the item must be collapsed instantly (without animation). The option has effect only when a single item-id is provided.
        */
        this.collapse = function (id, instant)
        {
            id = id || ['root'];

            if (!$lib.isArray(id))
                id = [id];

            _collapseInstant = (id.length > 1 || instant);

            $lib.each(id, function (id)
            {
                collapse(id);
            });

            _collapseInstant = false;
        }

        /** 
        * Cancels the current expand action.
        */
        this.cancelExpand = function ()
        {
            _cancelExpand = true;
        }

        /** 
        * Shows the item category.
        * @param {String} id The item identifier.
        * @param {String} [previous=false] A value indicating that this category is previous to the current visible category.
        * @param {Boolean} [instant=false] A value indicating if the category must be shown instantly (without animation).
        */
        this.showCategory = function (id, previous, instant)
        {
            showCategory(id, previous, instant);
        }

        /** 
        * Loads the item with the specified id.
        * @param {String} id The item identifier.
        * @returns {componyx.library.Path} The Path object offers methods to navigate in any direction from a specific item within the tree.
        */
        this.loadItem = function (id)
        {
            return loadItem(id);
        }

        /** 
        * Selects the item.
        * @param {String} id The item identifier.
        */
        this.selectItem = function (id)
        {
            selectItem(id);
        }

        /** 
        * Deselects the current selected item or the item with the specified id.
        * @param {String} [id] The item identifier.
        */
        this.deselectItem = function (id)
        {
            id = $lib.isEmpty(id) ? _selectedItemId : id;

            if (id)
                deselectItem(id);
        }

        /** 
        * Enables the item.
        * @param {String} id The item identifier.
        */
        this.enableItem = function (id)
        {
            enableItem(id);
        }

        /** 
        * Disables the item.
        * @param {String} id The item identifier.
        * @param {Boolean} [keepSelected=false] A value indicating if the item must remain selected.
        */
        this.disableItem = function (id, keepSelected)
        {
            disableItem(id, keepSelected);
        }

        /** 
        * Gets the identifier of the active category.
        * @returns {String} The id of the active category.
        */
        this.getActiveCategoryId = function ()
        {
            return _categoryId;
        }

        /** 
        * Gets the identifier of the selected item or the identifier of the selected item within the specified radio group.
        * @param {String} [radioGroupId] The id of the radio group.
        * @returns {String} The selected item id.
        */
        this.getSelectedItemId = function (radioGroupId)
        {
            var item = _instance.getSelectedItem(radioGroupId);
            return (item) ? item.id : null;
        }

        /** 
        * Gets the selected item or the selected item within the specified radio group.
        * @param {String} [radioGroupId] The id of the radio group.
        * @returns {componyx.UI.Menu.Item} The selected item.
        */
        this.getSelectedItem = function (radioGroupId)
        {
            if (!$lib.isEmpty(radioGroupId) && componyx.UI.Button.RadioGroups[_instance.id + '_' + radioGroupId])
                return getItem(componyx.UI.Button.RadioGroups[_instance.id + '_' + radioGroupId].id.replace(_instance.id + '_', ''));
            else if (!$lib.isEmpty(_selectedItemId))
                return getItem(_selectedItemId);

            return null;
        }

        /** 
        * Gets the expanded items.
        * @returns {componyx.UI.Menu.Item[]} A list of expanded items.
        */
        this.getExpandedItems = function ()
        {
            var paths = $lib.path(_instance.itemList, 'itemList', function (item) { return (item.expanded); }),
                itemList = [];

            $lib.each(paths, function (path) { itemList.push(path.item); });
            return itemList;
        }

        /**
        * Collapses all expanded items with the delay configured through the collapseDelay property.
        * @param {Boolean} [instant=false] A value indicating if all items must be collapsed instantly (without animations).
        */
        this.collapseAllDelayed = function (instant)
        {
            _allowCollapse = true;
            collapseAllDelayed(null, instant);
        }

        /** 
        * Collapses all expanded items.
        * @param {Boolean} [instant=false] A value indicating if all items must be collapsed instantly (without animations).
        */
        this.collapseAll = function (instant)
        {
            collapseAll(instant);
        }

        /** 
        * Gets the root item-group box or the item-group box for the specified item id.
        * @param {String} [id] The item identifier.
        * @returns {componyx.UI.Box} The box component.
        */
        this.getItemGroupBox = function (id)
        {
            return getItemBox(id);
        }

        /** 
        * Removes the item with the specified id.
        * @param {String} id The item identifier.
        */
        this.removeItem = function (id)
        {
            var itemPath = loadItem(id);

            if (itemPath)
                removeItem(itemPath.item);
        }

        /** 
        * Renders the specified item by creating a new element or overwriting the existing element.
        * The item must exist in the item list and the item's position in the item group will equal the item's position within the item list.
        * @param {componyx.UI.Menu.Item} item The item to render.
        */
        this.renderItem = function (item)
        {
            var itemPath = loadItem(item.id),
                index = itemPath.index,
                parentItem = itemPath.hasParent() ? itemPath.parent().item : null,
                parentId = parentItem?.id;

            drawItem(getItemBox(parentId).contentElement, item, parentItem, (index == itemPath.start().length() - 1) ? null : index);
        }

        /** 
        * Shows the component.
        */
        this.show = function ()
        {
            $base.methods.show.call(_instance);

            if (_instance.renderState == $base.static.RenderState.RENDERED && _instance.visibleRoot && _instance.itemList && _instance.itemList.length)
                getItemBox().show();
        }

        /** 
        * Hides the component.
        * @param {Boolean} [instant=false] A value indicating if all items must be collapsed instantly (without animations). By default the root item-group has no show/hide animations set. If a hide animation was set manually and instant hiding on the root item-group is required, disable the hide animation in advance.
        */
        this.hide = function (instant)
        {
            if (_instance.renderState != $base.static.RenderState.RENDERED)
            {
                $base.methods.hide.call(_instance);
                return;
            }

            var fn = function ()
            {
                if (_instance.visibleRoot)
                {
                    var box = getItemBox();
                    box.events.onHideComplete.priorityAdd(function () { $base.methods.hide.call(_instance); }, null, true);
                    box.hide();
                }
                else
                    $base.methods.hide.call(_instance);
            }

            if (!isCollapsing())
                fn();
            else
            {
                this.collapseAll(instant);
            }
        }

        /** 
        * Renders the component
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'menu');
                return;
            }

            // render logic after loading resources

            // create default templates
            if (!_instance.hasTemplate('Default'))
                _instance.addTemplate('Default', '{text}', true);

            _instance.element.tabIndex = Number(_instance.tabIndex) || 0; // menu widget is focusable, arrows are used to navigate menu-items
            bindGlobalEvents();
            _instance.allowPostRender = false; // block postRender call
            load();
            _instance.allowPostRender = true;
            _instance.renderChildren();
        }

        /** 
        * Executes the post render procedure.
        */
        this.postRender = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING) // extra safety to never execute a postRender when the component state is incorrect
                return;

            $base.methods.postRender.call(this);

            if (_instance.visibleRoot && getItemBox())
                getItemBox().show();

            _allowExpand = true;
            $lib.each(_expandList, function (itemId) // expand items from initial expand list
            {
                var box = getItemBox(itemId), a = box.animation,
                    showType = a.showType;

                _collapseInstant = true;
                box.animation.showType = 0;
                expand(itemId, true);
                a.showType = showType;
                _collapseInstant = false;
            });

            if (_instance.visibleRoot && _instance.expandOnClick <= _expandOnClickOption.ALWAYS)
                _allowExpand = false;

            _expandList = [];
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

        /** 
        * Draws the item list.
        */
        this.draw = function (itemList)
        {
            draw(itemList);
        }

        function preRender()
        {
            // initialize script and css
            return ['Menu', ['Box', 'Button']];
        }

        function load(parentItem)
        {
            var query;

            _instance.events.onPreLoadItemList.fire(_instance, null);

            if (_instance.ajax.load && _instance.ajax.load.isDefined())
            {
                query = '"parentItem": ';
                query += (parentItem) ? window.JSON.stringify(parentItem) : 'null';
                _instance.ajaxCall('load', query, { onSuccess: function () { dataLoaded(parentItem); } });
            }
            else
            {
                if (parentItem)
                    draw(parentItem.itemList, parentItem);
                else
                    draw(_instance.itemList);
            }
        }

        function dataLoaded(parentItem, ajaxArgs)
        {
            var itemList = [];

            if (ajaxArgs)
            {
                if (ajaxArgs.data)
                {
                    var ajaxResult = (typeof ajaxArgs.data === 'string') ? window.JSON.parse(ajaxArgs.data) : ajaxArgs.data;
                    itemList = (ajaxResult) ? ajaxResult.itemList || [] : [];
                }

                if (!itemList)
                    itemList = [];
            }

            _instance.events.onPostLoadItemList.fire(_instance, null);

            if (parentItem)
            {
                parentItem.itemList = itemList;
                draw(parentItem.itemList, parentItem);
            }
            else
            {
                _instance.itemList = itemList;
                draw(_instance.itemList);
            }

            _instance.events.onPostRenderItemList.fire(_instance, null);
        }

        function draw(itemList, parentItem)
        {
            if (!itemList || !itemList.length)
                return;

            let itemGroup, index = -1;

            if (!parentItem || !$UI.store[getItemId(parentItem.id + '_Box')])
                itemGroup = createItemGroup(parentItem);
            else
                itemGroup = $UI.store[getItemId(parentItem.id + '_Box')].contentElement; // existing item-group

            // clear container
            $lib.removeChildren(itemGroup);

            if (parentItem && parentItem.isCategory)
            {
                var item = createCategoryNavigator(parentItem);
                drawItem(itemGroup, item, parentItem);
            }

            while (++index < itemList.length)
            {
                drawItem(itemGroup, itemList[index], parentItem);
            }

            if (_cachedExpand && parentItem && _queuedExpandItemId == parentItem.id)
                expandCachedItem();
        }
        function createNavigationManager()
        {
            if (_instance.navigationManager)
                return;

            _instance.navigationManager = new NavigationManager(_instance.element,
                {
                    itemList: _instance.itemList,
                    horizontalRoot: _instance.horizontalRoot,
                    tabNavigation: _instance.tabNavigation,
                    getButton: (item) => $UI.store[getItemId(item.id)]?.element,
                    getExpander: () => _expanderElement,
                    getCollapseTarget: (item) =>
                    {
                        const itemId = item.id,
                            itemPath = loadItem(itemId);

                        if (itemPath?.hasParent())
                            return itemPath.parent().item;

                        if (!_instance.visibleRoot)
                            return getItem('root');

                        return null;
                    },
                    isExpanded: (item) => { return _expandStates[item.id] === _expandStateOption.EXPANDED; },
                    isExpandable: (item) => { return hasChildItems(item); },
                    isFocusable: (item) => { return !Boolean(item.disabled); },
                    onExpand: (item) => { _allowExpand = true; expand(item.id); },
                    onCollapse: (item) => { collapse(item.id); },
                    onCollapseAll: () => { collapseAll(true); _allowExpand = true; }
                });
        }

        function drawItem(itemGroup, item, parentItem, pos)
        {
            var button, box,
                exists = $UI.store[getItemId(item.id)] != null,
                container = getSubGroup(item),
                subGroupId = (!$lib.isEmpty(item.subGroupId)) ? _instance.id + '_' + item.subGroupId : null,
                cssClassSubGroup = (item.cssClassSubGroup) ? item.cssClassSubGroup : _instance.cssClassSubGroup || _classOption.SUBGROUP,
                expandable = ($lib.isEmpty(item.expandable)) ? _instance.expandable : item.expandable,
                mustExpand;

            if (exists)
                removeItem(item); // remove item

            // set default values
            if ($lib.isEmpty(item.id))
                item.id = $lib.format('{0}{1}', (parentItem) ? parentItem.id + '_' : '', $lib.guid());

            item.type = item.type || _typeOption.COMMANDBUTTON;
            item.selectable = ($lib.isEmpty(item.selectable) && (!hasChildItems(item) || item.type != _typeOption.COMMANDBUTTON || item.href)) ? true : item.selectable;

            if (subGroupId && (!container || container.id != subGroupId))
                container = $lib.element(itemGroup, '', '', null, { "id": subGroupId, "class": cssClassSubGroup });

            button = createButton(container || itemGroup, item, parentItem, pos);
            _instance.events.onPreRenderItem.fire(_instance, eventArgs(item));

            if (!hasChildItems(item))
                $lib.addClass(button.element, _instance.cssClassItemChildless || _classOption.ITEMCHILDLESS);

            if (hasChildItems(item))
            {
                createItemGroup(item);
                box = getItemBox(item.id);
                item.__static = box.__static;

                if (item.__static)
                    $lib.addClass(button.element, 'static');

            }

            bindItemEvents(button, item, parentItem);

            if (item.selected)
            {
                item.selected = false;
                selectItem(item.id);
            }
            else if (item.selectedChild)
                $lib.addClass(button.element, _classOption.SELECTEDCHILD);

            if (item.disabled)
                disableItem(item.id, true);

            // expand and render children only when child-items directly available, not supported for load on demand
            if (item.itemList && item.itemList.length > 0)
            {
                mustExpand = (expandable == false || item.expanded) && (parentItem || _instance.visibleRoot);

                if (mustExpand)
                    _expandList.push(item.id);

                if (mustExpand || !_instance.renderOnExpand)
                    draw(item.itemList, item);
            }

            _instance.events.onPostRenderItem.fire(_instance, eventArgs(item));
        }

        function createButton(container, item, parentItem, pos)
        {
            var id = getItemId(item.id),
                templateId = item.templateId || _instance.itemTemplateId || 'Default',
                temp = document.createElement('div'),
                cloneId = item.buttonId || _instance.buttonId,
                button = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: container }),
                expandDirection = ($lib.isEmpty(item.expandDirection)) ? defaultDirection(_instance.visibleRoot && !parentItem) : item.expandDirection,
                expandOnSelect = ($lib.isEmpty(item.expandOnSelect)) ? _instance.expandOnSelect : item.expandOnSelect,
                cssClass = `${_classOption.ITEM} ${(item.cssClass || _instance.cssClassItem || '').replace(/\s\s+/g, ' ')}`;

            if (item.selectable)
                cssClass += ' selectable';
            else if (!item.command && !item.href)
                cssClass += ' no-action';

            button.clone($UI.store[cloneId], _instance);
            button.transparent = true;
            button.split = (button.split == true) ? true : (!expandOnSelect && !item.isCategory && item.expandable != false && item.selectable && hasChildItems(item));
            button.cssClass = cssClass;
            button.cssClassIcon = item.cssClassIcon || _instance.cssClassItemIcon || '';
            button.style = item.style;
            button.expandDirection = expandDirection;
            button.contentAlign = 0;
            button.iconAlign = 0;
            button.hasIcon = item.hasIcon;
            button.iconURL = item.iconURL;
            button.selected = item.selected;
            button.disabled = item.disabled;
            button.tabIndex = -1;
            button.keyboardExpand = false;
            button.type = item.type || 0;
            button.renderId = false;
            button.target = item.target;
            button.href = item.href;
            button.title = item.title;

            button.events.onPostRender.priorityAdd(function (pos, button)
            {
                let itemList = (parentItem) ? parentItem.itemList : _instance.itemList;

                if (!$lib.isEmpty(pos) && itemList[pos + 1])
                {
                    let before = $UI.store[getItemId(itemList[pos + 1].id)]; // get next button
                    button.move(container, before.element);
                }

                let box = getItemBox(parentItem?.id),
                    role = (box.__static) ? 'treeitem' : 'menuitem';

                setAriaRoleAttr(button.getCommandButton(), role);

                if (button.split)
                    setAriaRoleAttr(button.getExpandButton(), role);

                createNavigationManager();
                setTimeout(() => { _instance.isReady.apply(_instance); });
            }, [pos]);
            button.events.onSelect.priorityAdd(function (itemId) { selectItem(itemId); }, [item.id]);
            button.events.onDeselect.priorityAdd(function (itemId) { deselectItem(itemId); }, [item.id]);
            button.__menuItem = item; // bind item to button

            if (hasChildItems(item) && !item.isCategory)
                button.expandCommand = function () { }; // define noop command to show expand icon

            if (item.type == _typeOption.RADIOBUTTON)
            {
                button.radioGroupId = (!$lib.isEmpty(item.radioGroupId)) ? _instance.id + '_' + item.radioGroupId : (parentItem) ? getItemId(parentItem.id) : _instance.id;
                button.hasIcon = true;
            }
            else if (item.type == _typeOption.CHECKBUTTON)
                button.hasIcon = true;

            _instance.applyTemplate(temp, templateId, item);
            button.setContentTemplate($lib.extract(temp));
            button.showing = true;
            button.render();

            return button;
        }

        function createItemGroup(parentItem)
        {
            var id = (parentItem) ? getItemId(parentItem.id + '_Box') : _instance.id + '_Box',
                groupBoxId = (!parentItem && !$lib.isEmpty(_instance.rootItemGroupBoxId)) ? _instance.rootItemGroupBoxId : _instance.itemGroupBoxId,
                itemGroupStyle = (parentItem) ? parentItem.itemGroupStyle || _instance.itemGroupStyle : _instance.itemGroupStyle,
                box = $UI.createComponent(componyx.UI.Box, { id: id, containerElement: _instance.element }), cssClass;

            if (parentItem && !$lib.isEmpty(parentItem.itemGroupBoxId))
                groupBoxId = parentItem.itemGroupBoxId;

            _instance.events.onPreRenderItemGroup.fire(_instance, eventArgs(parentItem));

            if (parentItem)
            {
                cssClass = parentItem.cssClassItemGroup || _instance.cssClassItemGroup || _classOption.ITEMGROUP;
            }
            else
            {
                cssClass = _instance.cssClassItemGroup || _classOption.ITEMGROUP;
                cssClass += ' ' + (_instance.cssClassItemGroupRoot || _classOption.ITEMGROUPROOT);

                if (_instance.horizontalRoot)
                {
                    cssClass += ' ' + (_instance.cssClassItemGroupHorizontalRoot || _classOption.HORIZONTALROOT);
                    $lib.addClass(_instance.element, _classOption.HORIZONTALROOT);
                }

                if (_instance.visibleRoot)
                {
                    cssClass += ' ' + (_instance.cssClassItemGroupVisibleRoot || _classOption.ITEMGROUPVISIBLEROOT);
                    box.autoFit = false;
                }
            }

            box.clone($UI.store[groupBoxId], _instance);

            if (itemGroupStyle)
                box.style = itemGroupStyle;

            box.theme = $base.static.ThemeOption.NONE;
            box.cssClass += (box.cssClass) ? ' ' + cssClass : cssClass;
            box.modal = box.draggable = false;
            box.contentTag = 'nav';
            box.events.onPostRender.priorityAdd(function (parentItem, box)
            {
                box.__static = isStaticBox(box);
                let role = box.__static ? 'tree' : 'menu';

                setAriaRoleAttr(box.contentElement, role);

                if (box.__static)
                {
                    if (parentItem && !parentItem.isCategory) // position box after parent-item element
                    {
                        let button = $UI.store[getItemId(parentItem.id)];
                        let parentEl = button.element;
                        box.move(parentEl.parentNode, parentEl.nextSibling);
                    }

                    box.autoPosition = 0;
                    box.autoFit = false;
                    $lib.addClass(box.element, _classOption.ITEMGROUPSTATIC);
                    box.animation.showDirection = box.animation.hideDirection = 'down';
                }
                else
                {
                    if (parentItem)
                    {
                        let button = $UI.store[getItemId(parentItem.id)];
                        setAriaPopupAttr(button.getCommandButton());

                        if (button.split)
                            setAriaPopupAttr(button.getExpandButton());
                    }

                    bindBoxEvents(box, parentItem);
                    _hasDynamicGroup = true;
                }

                _instance.events.onPostRenderItemGroup.fire(_instance, eventArgs(parentItem));
                _instance.isReady.apply(_instance);
            }, [parentItem]);

            if (!parentItem && _instance.visibleRoot)
            {
                if (box.animation.showType == null)
                    box.animation.showType = 0;

                if (box.animation.hideType == null)
                    box.animation.hideType = 0;

                box.events.onShowComplete.priorityAdd(expandItemComplete, [null]);
                _expandStates['root'] == _expandStateOption.EXPANDED;
            }

            box.render();

            return box.contentElement;
        }

        function setAriaPopupAttr(el)
        {
            el.setAttribute('aria-haspopup', 'menu');
        }

        function setAriaRoleAttr(el, role)
        {
            el.setAttribute('role', role);
        }

        function createCategoryNavigator(parentItem)
        {
            var item = new componyx.UI.Menu.Item(),
                ancestorItem = getParentCategoryItem(parentItem.id),
                id = (ancestorItem) ? ancestorItem.id : null;

            item.text = (ancestorItem) ? ancestorItem.text : _instance.mainCategoryLabel;
            item.hasChildItems = item.expandable = false;
            item.hasIcon = true;
            item.cssClass = _classOption.CATEGORY_NAVIGATOR + ((ancestorItem) ? '' : ' root');
            item.command = function () { showCategory(id, true); _allowExpand = false; };
            item.__nav = true;
            return item;
        }

        function getParentCategoryItem(itemId)
        {
            var itemPath = loadItem(itemId),
                item = (itemPath.hasParent()) ? itemPath.parent().item : null;

            while (item)
            {
                if (item.isCategory)
                    return item;
                else if (itemPath.hasParent())
                    item = itemPath.parent().item;
                else
                    item = null;
            }

            return item;
        }

        function removeItem(item)
        {
            var container;

            $lib.each(item.itemList, function (item, index)
            {
                removeItem(item); // first remove children if any
            });

            var box = getItemBox(item.id);

            if ($UI.store[getItemId(item.id)])
                $UI.store[getItemId(item.id)].destroy(); // remove button

            if (box)
            {
                box.destroy();
                box.showing = false;
            }

            container = getSubGroup(item);

            if (container && !container.childNodes.length)
                $lib.remove(container);

            delete _expandStates[item.id];
        }

        function isStaticBox(box)
        {
            var el = box.element;

            el.classList.remove('hidden');
            let isStaticPosition = ('absolute fixed'.indexOf($lib.styleValue(el, 'position', true)) == -1);
            el.classList.add('hidden');

            return isStaticPosition;
        }

        function getItemBox(itemId)
        {
            return ($lib.isEmpty(itemId) || itemId == 'root') ? $UI.store[_instance.id + '_Box'] : $UI.store[getItemId(itemId + '_Box')];
        }

        function getSubGroup(item)
        {
            var subGroupId = item.subGroupId;

            if ($lib.isEmpty(subGroupId))
                return null;

            return $lib($lib.format('#{0}_{1}', _instance.id, subGroupId));
        }

        function getItemId(itemId)
        {
            return _instance.id + '_' + itemId;
        }

        function getItem(itemId)
        {
            if (itemId && typeof (itemId) != 'string')
                return itemId;

            if (itemId && itemId != 'root')
            {
                return ($UI.store[getItemId(itemId)]?.__menuItem) ? $UI.store[getItemId(itemId)].__menuItem : loadItem(itemId).item;
            }

            let item = new componyx.UI.Menu.Item();
            item.id = 'root';
            item.hasChildItems = true;
            item.__lastCollapse = true;
            item.__static = getItemBox(item.id).__static;
            return item;
        }

        function loadItem(itemId)
        {
            if (itemId == 'root')
                return null;

            let path = $lib.path(_instance.itemList, 'itemList', function (item) { return (item.id === itemId) }, true);

            if (!path)
                return null;

            return path.create(); // always create a new instance to avoid issues with modifications to the same Path instance
        }

        function defaultDirection(isRoot)
        {
            if (isRoot)
            {
                if (_instance.rootExpandDirection != null)
                    return _instance.rootExpandDirection;
                else
                    return (_instance.horizontalRoot) ? _expandDirectionOption.DOWN : _expandDirectionOption.RIGHT;
            }
            else
                return (_instance.expandDirection != null) ? _instance.expandDirection : _expandDirectionOption.RIGHT;
        }

        function eventArgs(item)
        {
            return {
                item: item || null,
                itemElement: (item) ? $lib('#' + getItemId(item.id)) : null,
                event: $lib.event
            }
        }

        function bindGlobalEvents()
        {
            // collapse on document click
            $lib.on(document, 'pointerup', collapseAllDelayed, null, _instance);
            $lib.on(document, 'pointerup', allowance);

            // cancel collapse on component click
            $lib.on(_instance.element, 'pointerup', function ()
            {
                _allowCollapse = false;

                if (!_instance.visibleRoot)
                    _allowExpand = false;
            });

            $lib.on(_instance.element, 'focus', focus);
        }

        function focus()
        {
            if (!_instance.navigationManager)
                return;

            const active = _instance.element.ownerDocument.activeElement;
            if (_instance.element.contains(active) && active !== _instance.element)
                return; // focus is already on a child, so skip resetting focus

            let item = _instance.itemList[0],
                itemPath = _currentExpandId ? loadItem(_currentExpandId) : null;

            if (itemPath != null)
                item = itemPath.firstChild()?.item || item;

            _instance.navigationManager.setFocus(item.id);
        }

        function allowance()
        {
            _allowCollapse = true;

            if (!_instance.visibleRoot)
                _allowExpand = true;
        }

        function bindBoxEvents(box, parentItem)
        {
            if (_instance.expandOnClick == _expandOnClickOption.NEVER)
            {
                $lib.on(box.element, 'pointerenter', function ()
                {
                    var parentItemId = (parentItem) ? parentItem.id : 'root';

                    if (_expandStates[parentItemId] < _expandStateOption.COLLAPSING)
                        expand(parentItemId);
                }, null, _instance);

                $lib.on(box.element, 'pointerleave', function ()
                {
                    collapseAllDelayed()
                }, null, _instance);
            }
        }

        function bindItemEvents(button, item, parentItem)
        {
            let itemId = item.id;

            button.events.onClick.priorityAdd((button, event) => { _instance.navigationManager.setFocusFromEvent(item, event); });

            if (item.type == _typeOption.COMMANDBUTTON) // for button type check/radio (de)selectItem() is called through button events
                button.events.onCommandClick.priorityAdd(function (button, buttonArgs) { selectItem(item.id) });

            if (item.expandable == false) // child-items already expanded and/or can't be collapsed
                return;

            let isRoot = _instance.visibleRoot && (!parentItem || parentItem.isCategory);

            if (item.__static || !hasChildItems(item.id) ||
                _instance.expandOnClick == _expandOnClickOption.ALWAYS ||
                (_instance.expandOnClick == _expandOnClickOption.ROOT && isRoot))
            {
                let fn = function (item) { expandItemClick(item.id) }.bind(_instance, item);

                if (button.split)
                    button.events.onExpandClick.priorityAdd(fn);
                else
                    button.events.onCommandClick.priorityAdd(fn);
            }

            button.events.onCommandClick.priorityAdd(function (item)
            {
                _pointerEnterEvent = false;
                collapseOnSelect(item);

                if (_cancelExpand)
                {
                    _cancelExpand = null;
                    return;
                }

                var expandOnSelect = ($lib.isEmpty(item.expandOnSelect)) ? _instance.expandOnSelect : item.expandOnSelect;

                if (!button.split || (expandOnSelect && item.selectable))
                    expand(item.id);

            }.bind(_instance, item));

            if (button.split)
            {
                button.events.onExpandClick.priorityAdd(function (item)
                {
                    _pointerEnterEvent = false;
                    expand(item.id);
                }.bind(_instance, item));
            }

            if (item.__static)
                return;

            if (_instance.expandOnClick != _expandOnClickOption.ALWAYS)
            {
                button.events.onPointerEnter.priorityAdd(function (item)
                {
                    if (!_hasDynamicGroup)
                        return;

                    _pointerEnterEvent = true;
                    expand(item.id);
                }.bind(_instance, item));
            }
        }

        function collapseOnSelect(item)
        {
            var collapseAllOnSelect = ($lib.isEmpty(item.collapseAllOnSelect)) ? _instance.collapseAllOnSelect : item.collapseAllOnSelect;

            if (item.selectable && (!item.__static) && collapseAllOnSelect)
            {
                _instance.cancelExpand();
                expand(item.id, true);
                collapseAll();
            }
        }

        function expandItemClick(itemId)
        {
            var item = getItem(itemId);

            if (item.__static || !hasChildItems(itemId))
                _allowExpand = true;
            else
            {
                if (_allowExpand)
                    collapse(_currentExpandId);

                _allowExpand = !_allowExpand;
            }
        }

        function expandCachedItem()
        {
            var itemId = _queuedExpandItemId;

            _cachedExpand = _queuedExpandItemId = null;
            expand(itemId, true);
        }

        function expand(itemId, instant)
        {
            var itemPath = (itemId != 'root') ? loadItem(itemId) : null,
                item = (itemId == 'root') ? getItem(itemId) : itemPath.item,
                parentItemId = (itemPath && itemPath.hasParent()) ? itemPath.parent().item.id : 'root',
                box = getItemBox(itemId),
                expandDelay = (instant || item.__static) ? 0 : ($lib.isEmpty(item.expandDelay)) ? _instance.expandDelay : item.expandDelay;

            if (!_allowExpand || item.disabled || itemId == _queuedExpandItemId || (itemId != 'root' && _expandStates[parentItemId] >= _expandStateOption.COLLAPSING))
                return;

            if (item.isCategory)
            {
                if (!_pointerEnterEvent)
                    showCategory(itemId, null, instant);

                return;
            }

            clearTimeout(_timerId);
            _toggle = false;

            if (box && box.showing && item.__static) // toggle action
            {
                _toggle = true;
                _currentExpandId = itemId; // change current expand id
                collapse(itemId);
                return;
            }
            else if (box && !box.showing && !$lib.isEmpty(_currentExpandId) && (itemId == _currentExpandId || inPath(_currentExpandId, itemId)))
            {
                _currentExpandId = null; // static group should expand if box is not showing
            }

            if ((!box || box.showing) && !$lib.isEmpty(_currentExpandId) && (itemId == _currentExpandId || inPath(_currentExpandId, itemId))) // check if item is equal or parent of the current expanded item
                return;

            _pointerCoordinates = null;

            if ($lib.event)
            {
                const x = $lib.clientX($lib.event),
                    y = $lib.clientY($lib.event);

                if (!$lib.isEmpty(x) || !$lib.isEmpty(y))
                    _pointerCoordinates = { clientX: x, clientY: y };
            }

            if (!expandDelay)
                expandItem(itemId);
            else
            {
                _timerId = setTimeout(function ()
                {
                    expandItem(itemId);
                }, expandDelay);
            }
        }

        function expandItem(itemId)
        {
            var isRootId = itemId === 'root',
                itemPath = (!isRootId) ? loadItem(itemId) : null,
                item = (isRootId) ? getItem(itemId) : itemPath.item,
                parentItemId = (itemPath && itemPath.hasParent()) ? itemPath.parent().item.id : null,
                isVirtualRoot = isVirtualRootExpand(itemId, parentItemId),
                isRootLevelExpand = isVirtualRoot || (!parentItemId && _expandStates['root'] === undefined),
                lastExpandId = _currentExpandId,
                box = getItemBox(itemId),
                button = $UI.store[getItemId(itemId)],
                itemGroup = (box) ? box.contentElement : null,
                expandDirection = ($lib.isEmpty(item.expandDirection)) ? defaultDirection(isRootLevelExpand) : item.expandDirection;

            clearTimeout(_timerId);

            if (isVirtualRoot && !_instance.visibleRoot)
            {
                _allowExpand = true;

                if ($lib.event && $lib.event.type == 'click')
                    _allowCollapse = false;
            }

            if ((parentItemId && _expandStates[parentItemId] == _expandStateOption.EXPANDING) || (!_instance.visibleRoot && _expandStates['root'] == _expandStateOption.EXPANDING))
            {
                // parent is expanding, cache the expand
                _queuedExpandItemId = item.id;
                _cachedExpand = true;
                return;
            }

            if (hasChildItems(item) && (!itemGroup || itemGroup.childNodes.length == 0))
            {
                // first load or draw the items and cache the expand
                _cachedExpand = true;
                _queuedExpandItemId = item.id;

                if (!$lib.isEmpty(item.itemList))
                    draw(item.itemList, item);
                else
                    load(item);

                return;
            }

            _currentExpandId = _queuedExpandItemId = null;
            _cachedExpand = false;

            const canExpand = item.__static
                || (isVirtualRoot && !_instance.visibleRoot)
                || (!parentItemId && _instance.visibleRoot)
                || (!parentItemId && _expandStates['root'] === _expandStateOption.EXPANDED)
                || _expandStates[parentItemId] === _expandStateOption.EXPANDED;

            if (canExpand)
            {
                _currentExpandId = item.id;

                if (hasChildItems(item) && (!_expandStates[item.id] || _expandStates[item.id] >= _expandStateOption.COLLAPSING))
                    _expandStates[item.id] = _expandStateOption.EXPANDING;
                else
                    _expandStates[item.id] = _expandStateOption.EXPANDED;
            }

            if ((lastExpandId != _currentExpandId && !inPath(_currentExpandId, lastExpandId)) && (!item.__static || _instance.singleExpand))
                collapse(lastExpandId); // collapse last expanded item

            if (_expandStates[item.id] != _expandStateOption.EXPANDING) // return if there is no item to expand
                return;

            box.stopAnimation();
            box.autoInvertFit = false;
            box.autoResizeFit = false;

            if (!item.__static)
            {
                let expander = (isVirtualRoot) ? _expanderElement : $UI.store[getItemId(itemId)]?.element;

                if (expander) // use the parent item to position the item group box
                {
                    box.autoInvertFit = true;
                    box.autoResizeFit = true;
                    box.expander = expander;
                    box.expandDirection = expandDirection;
                    box.autoPosition = componyx.UI.Box.AutoPositionOption.EXPAND;
                }
                else // use the mouse cursor positions to position the item group box
                {
                    box.autoPosition = componyx.UI.Box.AutoPositionOption.POINTER;
                }
            }
            else if (button)
            {
                $lib.addClass(button.element, _classOption.EXPANDED); // no expander element, set expanded class manually
                toggleButtonDirection(itemId);
            }

            box.events.onShowComplete.remove(expandItemComplete);
            box.events.onHideComplete.remove(collapseItemComplete);

            box.events.onShowComplete.priorityAdd(expandItemComplete, [item.id]);
            box.events.onHideComplete.priorityAdd(collapseItemComplete, [item.id, box.animation.hideType]);

            box.show(false, _pointerCoordinates);
            _instance.events.onItemExpand.fire(_instance, eventArgs(item));
        }

        function expandItemComplete(itemId)
        {
            let item = getItem(itemId),
                button = $UI.store[getItemId(itemId)],
                itemPath,
                parentId;

            if (_expandStates[item.id] != _expandStateOption.EXPANDING)
                return;

            setTimeout(() => { _allowCollapse = true; });
            _expandStates[item.id] = _expandStateOption.EXPANDED;
            item.expanded = true;

            if (button)
                button.element.setAttribute('aria-expanded', 'true');
            else if (_expanderElement)
                _expanderElement.setAttribute('aria-expanded', 'true');

            _instance.navigationManager.expandComplete(itemId);
            _instance.events.onItemExpandComplete.fire(_instance, eventArgs(item));

            if (_cachedExpand)
            {
                itemPath = loadItem(_queuedExpandItemId);

                if (itemPath)
                {
                    parentId = (itemPath.hasParent()) ? itemPath.parent().item.id : null;
                }

                if (item.id == 'root' || (item.id == parentId))
                    expandCachedItem();
            }
        }

        function isCollapsing()
        {
            var collapsing = false;

            $lib.each(_expandStates, function (val)
            {
                collapsing = (val === _expandStateOption.COLLAPSING);
                return !collapsing;
            });

            return collapsing;
        }

        function collapseAllDelayed(e, instant)
        {
            if (!_allowCollapse || !_hasDynamicGroup)
                return;

            _queuedExpandItemId = null;
            _cachedExpand = false;
            clearTimeout(_timerId);

            if (!_currentExpandId)
                return;

            _timerId = setTimeout(function (instant)
            {
                collapseAll(instant);
            }.bind(_instance, instant), _instance.collapseDelay);
        }

        function collapseAll(instant = false)
        {
            if (!_hasDynamicGroup)
                return;

            _collapseInstant = instant;
            _queuedExpandItemId = null;
            _cachedExpand = false;

            let startExpandId = _currentExpandId;

            if (_instance.expandOnClick <= _expandOnClickOption.ALWAYS && _instance.visibleRoot && startExpandId == 'root')
            {
                _allowExpand = false;
                return;
            }

            _currentExpandId = null; // clear last expanded item id to avoid collapsible checks while collapsing, since there is no expanded item

            startExpandId = findValidCollapseStart(startExpandId);

            if (startExpandId)
                collapse(startExpandId);

            _collapseInstant = false;
        }

        function findValidCollapseStart(itemId)
        {
            while (itemId)
            {
                let state = _expandStates[itemId];
                if (state === _expandStateOption.EXPANDING || state === _expandStateOption.EXPANDED)
                {
                    return itemId; // Found valid expanded item
                }

                const itemPath = (itemId !== 'root') ? loadItem(itemId) : null;
                itemId = (itemPath && itemPath.hasParent()) ? itemPath.parent().item.id : null;
            }

            return null; // No valid expanded item found
        }

        function collapse(itemId)
        {
            if (!itemId)
                return;

            if (itemId != 'root')
                itemId = concurrentCollapse(itemId, (_currentExpandId) ? _instance.collapseType : _instance.collapseAllType);

            if (itemId)
                collapseItem(itemId);
        }

        function concurrentCollapse(itemId, collapseType)
        {
            if (collapseType == _collapseTypeOption.CASCADE) // no concurrent collapse
                return itemId;

            // collapse all expanded simultaneously, collapseItem will check if the item is collapsible
            var itemPath = loadItem(itemId),
                item = itemPath.item, lastCollapse;

            while (item)
            {
                lastCollapse = item.__lastCollapse = isLastCollapsible(item);
                collapseItem(item.id);

                if (!lastCollapse && itemPath.hasParent())
                    item = itemPath.parent().item;
                else
                    item = null;
            }
        }

        function collapseItem(itemId, isPointerEnter)
        {
            if ($lib.isEmpty(itemId))
                return;

            var item = getItem(itemId),
                cascadeCollapse = (_currentExpandId) ? (_instance.collapseType == _collapseTypeOption.CASCADE) : false,
                box = getItemBox(itemId),
                lastCollapse = item.__lastCollapse,
                isKeyboardNavigation = _instance.navigationManager.isCollapsing(itemId);

            isPointerEnter = $lib.isEmpty(isPointerEnter) ? Boolean(_pointerEnterEvent) : Boolean(isPointerEnter);

            if ($lib.isEmpty(lastCollapse))
                lastCollapse = item.__lastCollapse = isLastCollapsible(item);

            if (collapsible(item, lastCollapse, isPointerEnter, isKeyboardNavigation))
            {
                if (lastCollapse)
                    _pointerEnterEvent = false; // reset event

                if (box && isInstantCollapse(lastCollapse)) // decide instant (or animated)
                    box.animation.hideType = componyx.UI.Box.AnimationTypeOption.NONE;

                _expandStates[item.id] = _expandStateOption.COLLAPSING;
                item.expanded = false;

                if (box)
                {
                    if (box.__static)
                        toggleButtonDirection(itemId, true);

                    box.__pointerEnterEvent = isPointerEnter; // pass through when cascade collapse
                    box.hide();
                    _instance.events.onItemCollapse.fire(_instance, eventArgs(item));
                }
                else
                    collapseItemComplete(itemId); // item has no child-items
            }
            else if (!lastCollapse && cascadeCollapse && item.__static) // instant skip
            {
                var itemPath = (itemId != 'root') ? loadItem(itemId) : null,
                    parentItemId = (itemPath && itemPath.hasParent()) ? itemPath.parent().item.id : null;
                collapseItem(parentItemId);
            }
        }

        function isInstantCollapse(lastCollapse)
        {
            if (_collapseInstant) // instant forced
                return true;

            var collapseType = (_currentExpandId) ? _instance.collapseType : _instance.collapseAllType;

            if (collapseType == _collapseTypeOption.CASCADE)
                return false;

            if (collapseType > _collapseTypeOption.SINGLE)
                return true; // concurrent and instant types

            if (_currentExpandId == null) // collapse all action
                return false;

            return !lastCollapse; // single type, all deeper levels are instant
        }

        function collapseItemComplete(itemId, hideType)
        {
            let itemPath = (itemId != 'root') ? loadItem(itemId) : null,
                item = (itemId == 'root') ? getItem(itemId) : itemPath.item,
                box = getItemBox(itemId),
                lastCollapse = isLastCollapsible(item),
                collapseType = (_currentExpandId) ? _instance.collapseType : _instance.collapseAllType,
                parentItemId = (itemPath && itemPath.hasParent()) ? itemPath.parent().item.id : null,
                button = $UI.store[getItemId(itemId)],
                lastItemId = null, isPointerEnter;

            if (_expandStates[item.id] != _expandStateOption.COLLAPSING) // wrong state
                return;

            _expandStates[item.id] = _expandStateOption.COLLAPSED;
            _instance.navigationManager.collapseComplete(itemId);

            if (button)
            {
                $lib.removeClass(button.element, _classOption.EXPANDED); // expanded class is set manually for static-box expand
                button.element.setAttribute('aria-expanded', 'false');
            }
            else if (_expanderElement)
                _expanderElement.setAttribute('aria-expanded', 'false');

            if (box)
            {
                // reset hide type when collapse was instant
                if (box.animation.hideType != hideType)
                    box.animation.hideType = hideType;

                isPointerEnter = box.__pointerEnterEvent; // cascade collapse was initiated on a pointerenter event
                delete box.__pointerEnterEvent;
                _instance.events.onItemCollapseComplete.fire(_instance, eventArgs(item));
            }

            if (collapseType != _collapseTypeOption.CASCADE && item.__lastCollapse && !lastCollapse && parentItemId) // item is no longer the last collapsible item
            {
                delete item.__lastCollapse;
                collapse(parentItemId);
            }
            if (collapseType == _collapseTypeOption.CASCADE && !lastCollapse && parentItemId != null) // cascade collapse
                collapseItem(parentItemId, isPointerEnter);
            else if (parentItemId == null && !_instance.visibleRoot && (lastItemId = getLaunchItemId())) // get launching item-id for invisible root
                collapseItem(lastItemId, isPointerEnter);
            else if (parentItemId == null && _instance.visibleRoot && _instance.expandOnClick <= _expandOnClickOption.ALWAYS && !_currentExpandId)
                _allowExpand = false;

            if (box && item.__lastCollapse)
            {
                delete item.__lastCollapse;
                _instance.events.onLastItemCollapseComplete.fire(_instance, eventArgs(item));
            }

            _collapseInstant = false; // instant collapse was forced
        }

        function isVirtualRootExpand(itemId, parentItemId)
        {
            if (_instance.visibleRoot)
                return false;

            if (itemId === 'root')
                return true;

            if (!parentItemId)
                return _expandStates['root'] === undefined; // there is no expanding/expanded root item to which this expand belongs

            return _expandStates[parentItemId] === undefined; // there is no expanding/expanded parent item to which this expand belongs
        }

        function getLaunchItemId()
        {
            var launchId = null;

            $lib.each(_expandStates, function (expandState, itemId)
            {
                var itemPath = loadItem(itemId);

                if (expandState <= _expandStateOption.EXPANDED && (itemId == 'root' || !itemPath.hasParent()))
                {
                    launchId = itemId;
                    return false;
                }
            });

            return launchId;
        }

        function isLastCollapsible(item)
        {
            if (item.isCategory || item.id == 'root')
                return true;

            if ($lib.isEmpty(_currentExpandId)) // collapse all action
            {
                var last = true;

                $lib.each(_expandStates, function (state, id)
                {
                    if (item.id != id && state < _expandStateOption.COLLAPSING)
                        return (last = false);
                });

                return last;
            }

            var itemPath = loadItem(item.id);

            if (!itemPath.hasParent())
                return true;

            if (_toggle)
                return (item.id == _currentExpandId);
            else
            {
                item = itemPath.parent().item; // set item to parent
                return (item.id == _currentExpandId || inPath(_currentExpandId, item.id)); // item is last collapsible when parent-item is either parent of current expand-item or current expand-item
            }
        }

        function collapsible(item, lastCollapse, isPointerEnter, isKeyboardNavigation)
        {
            let singleExpand = _instance.singleExpand;

            if (isKeyboardNavigation)
                return true;

            if (item.expandable == false || item.isCategory || _expandStates[item.id] >= _expandStateOption.COLLAPSING ||
                (item.id == 'root' && (_instance.visibleRoot || !$lib.isEmpty(_currentExpandId))))
                return false;

            if (_toggle)
                return true; // toggle action
            else if (item.__static)
            {
                if (isPointerEnter) // collapse can only happen on click
                    return false;

                // singleExpand and not current expanded item and last collapse
                if (singleExpand && !$lib.isEmpty(_currentExpandId) && _currentExpandId != item.id && lastCollapse)
                    return true;
                else
                    return false;
            }
            else if (_currentExpandId == item.id) // there is no toggle action for popup menu-items via pointer events, so never collapse expanded item
                return false;

            let collapsible = true;
            $lib.each(_expandStates, function (expandState, itemId)
            {
                if (itemId != item.id && expandState <= _expandStateOption.COLLAPSING && !item.__static)
                {
                    // avoid collapse when the item to collapse is root or parent of expanding, expanded or collapsing child item
                    collapsible = !inPath(itemId, item.id);
                }

                return collapsible;
            });

            return collapsible;
        }

        function toggleButtonDirection(itemId, collapse)
        {
            var el = $UI.store[getItemId(itemId)].element;
            $lib.removeClass(el, 'right down');
            $lib.addClass(el, (collapse) ? 'right' : 'down');
        }

        function inPath(itemId, checkItemId)
        {
            if (itemId == 'root')
                return false;

            var itemPath = loadItem(itemId), match = false;

            if (!itemPath)
                return match;

            while (itemPath.hasParent() && itemPath.parent() && !match)
            {
                match = (itemPath.item.id === checkItemId) ? true : false;
            }

            return match;
        }

        function selectItem(itemId)
        {
            var item = getItem(itemId),
                button = $UI.store[getItemId(itemId)],
                command = function (item)
                {
                    if (item.command = convertCommand(item.command))
                        return item.command(_instance, eventArgs(item));
                };

            if (!item || item.disabled)
                return;

            command(item);

            if (item.__nav) // category navigator
                return;

            if (!item.selected && item.selectable)
            {
                if (item.type == _typeOption.COMMANDBUTTON)
                {
                    if (_selectedItemId)
                        deselectItem(_selectedItemId);

                    item.selected = true;
                    _selectedItemId = item.id;

                    button.events.onSelect.disable(true);
                    button.select();
                    button.events.onSelect.enable(true);
                    updateParents(item, true);
                }
                else
                {
                    item.selected = true;

                    if (button && !button.selected) // API call instead of button click
                    {
                        button.events.onSelect.disable(true);
                        button.select();
                        button.events.onSelect.enable(true);
                    }
                }

                _instance.events.onItemSelect.fire(_instance, eventArgs(item));
            }
        }

        function deselectItem(itemId)
        {
            var item = getItem(itemId),
                button = $UI.store[getItemId(itemId)];

            if (!item || item.disabled || !item.selected || !item.selectable)
                return;

            item.selected = false;

            if (item.type == _typeOption.COMMANDBUTTON)
            {
                button.events.onDeselect.disable(true);
                button.deselect();
                button.events.onDeselect.enable(true);

                _selectedItemId = null;
                updateParents(item, false);
            }
            else if (button.selected) // API call instead of button click
                button.deselect();

            _instance.events.onItemDeselect.fire(_instance, eventArgs(item));
        }

        function showCategory(itemId, previous, instant)
        {
            var box = getItemBox(itemId), container,
                current = getItemBox(_categoryId), currentId = _categoryId;

            if (current === box) // already displaying
                return;

            // finish current animation if not yet finished
            if (!$lib.isEmpty(current.__hidingId) && _expandStates[current.__hidingId] === _expandStateOption.COLLAPSING)
                getItemBox(current.__hidingId).hide(true);
            else if (_expandStates[_categoryId] === _expandStateOption.EXPANDING)
                current.show(true);

            _categoryId = itemId;
            setCategoryBoxDisplay(box, true);
            setCategoryBoxDisplay(current, true);

            if (!$lib.isEmpty(itemId))
                $lib.addClass(box.element, getItemBox().element.className); // copy root classes

            $lib.addClass(_instance.element, _classOption.CATEGORY);
            container = $lib.element(_instance.element, '', '', null, { "class": _classOption.CATEGORY_CONTAINER });

            if (previous)
            {
                box.move(container); // make sure that the new box is positioned before the currently visible box
                current.move(container);
                box.events.onShowComplete.priorityAdd(showCategoryComplete, [itemId, container, current, currentId]); // the current box will be hidden when the show completed
                _expandStates[itemId] = _expandStateOption.EXPANDING;

                if (!$lib.isEmpty(currentId))
                    _expandStates[currentId] = _expandStateOption.COLLAPSING;

                box.show(instant);
            }
            else
            {
                current.move(container); // make sure that the current box is inside the category container
                box.move(container); // make sure that the new box is positioned after the currently visible box
                _expandStates[itemId] = _expandStateOption.EXPANDED;
                box.__hidingId = currentId;
                box.show(true); // instant show, not visible until current starts hiding.

                current.events.onHideComplete.priorityAdd(hideCategoryComplete, [currentId, container]);

                if (!$lib.isEmpty(currentId))
                    _expandStates[currentId] = _expandStateOption.COLLAPSING;

                current.hide(instant);
            }
        }

        function setCategoryBoxDisplay(box, on)
        {
            var a = box.animation;

            if (on)
            {
                a.showType = a.hideType = 3; // CSS
                $lib.addClass(box.element, _classOption.CATEGORY);
                box.autoFit = false;
            }
            else
            {
                a.showType = a.hideType = 0;
                $lib.removeClass(box.element, _classOption.CATEGORY);
                $lib.removeClass(_instance.element, _classOption.CATEGORY);
            }
        }

        function showCategoryComplete(itemId, container, current, currentId)
        {
            var box = getItemBox(itemId);

            if (!$lib.isEmpty(currentId))
                _expandStates[currentId] = _expandStateOption.COLLAPSED;

            _expandStates[itemId] = _expandStateOption.EXPANDED;
            current.hide(true);
            setCategoryBoxDisplay(box);
            $lib.unsurround(container);
            box.events.onShowComplete.remove(showCategoryComplete);
        }

        function hideCategoryComplete(itemId, container)
        {
            var box = getItemBox(itemId);

            setCategoryBoxDisplay(box);

            if (!$lib.isEmpty(itemId)) // remove root classes
            {
                $lib.removeClass(box.element, $lib.format('{0} {1} {2}', _classOption.ITEMGROUPROOT, _classOption.ITEMGROUPVISIBLEROOT, _classOption.HORIZONTALROOT));
                _expandStates[itemId] = _expandStateOption.COLLAPSED;
            }

            $lib.unsurround(container);
            delete getItemBox(_categoryId).__hidingId;
            box.events.onHideComplete.remove(hideCategoryComplete);
        }

        function disableItem(itemId, keepSelected)
        {
            var item = getItem(itemId),
                button = $UI.store[getItemId(itemId)];

            if (!item)
                return;

            if (item.selected && !keepSelected)
                deselectItem(item.id);

            item.disabled = true;

            if (button)
                button.disable();
        }

        function enableItem(itemId)
        {
            var item = getItem(itemId),
                button = $UI.store[getItemId(itemId)];

            if (!item)
                return;

            item.disabled = false;

            if (button)
                button.enable();
        }

        function convertCommand(command)
        {
            return $base.static.getMethod(command);
        }

        function updateParents(item, select)
        {
            var itemPath = loadItem(item.id);

            if (!itemPath)
                return;

            while (itemPath.hasParent())
            {
                item = itemPath.parent().item;
                var button = $UI.store[getItemId(item.id)],
                    buttonEl = (button) ? button.element : null;

                if (select)
                {
                    item.selectedChild = true;
                    $lib.addClass(buttonEl, _classOption.SELECTEDCHILD);
                }
                else
                {
                    item.selectedChild = false;
                    $lib.removeClass(buttonEl, _classOption.SELECTEDCHILD);
                }
            }
        }

        function hasChildItems(item)
        {
            return (Boolean(item.hasChildItems) || !$lib.isEmpty(item.itemList));
        }

        function dispose()
        {
            $lib.each(_instance.store, (id) =>
            {
                if ($UI.store[id])
                    delete $UI.store[id].__menuItem;
            }); // remove custom item binding 

            // remove document event handlers
            $lib.off(document, 'mouseup', collapseAllDelayed);
            $lib.off(document, 'mouseup', allowance);

            _instance.navigationManager?.destroy();
            _instance.navigationManager = null;
            _expandList = [];
            _expandStates = {};
            _hasDynamicGroup = false;
            _categoryId = _cachedExpand = _selectedItemId = _queuedExpandItemId = _currentExpandId = _expanderElement = null;
            _allowCollapse = _allowExpand = true;
            _collapseInstant = false;
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.Menu.prototype = Object.create($base.methods);
    componyx.UI.Menu.prototype.constructor = componyx.UI.Menu;

    /**
    * ExpandDirectionOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Menu.ExpandDirectionOption =
    {
        DOWN: 0,
        RIGHT: 1,
        UP: 2,
        LEFT: 3,

        getName: function (value) { return $base.static.getKeyByValue(this, value).toLowerCase(); }
    }

    /**
    * TypeOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Menu.TypeOption =
    {
        COMMANDBUTTON: 0,
        CHECKBUTTON: 1,
        RADIOBUTTON: 2
    }

    /**
    * ExpandOnClickOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Menu.ExpandOnClickOption =
    {
        ROOT: 0,
        ALWAYS: 1,
        NEVER: 2
    }

    /**
    * CollapseTypeOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Menu.CollapseTypeOption =
    {
        /* collapse expanded items in cascade order */
        CASCADE: 0,
        /* collapse expanded items at current level, instant collapse (no animation) for deeper levels (option has no effect on collapse all action) */
        SINGLE: 1,
        /* collapse expanded items simultaneously */
        CONCURRENT: 2,
        /* instant collapse expanded items (no animation) */
        INSTANT: 3
    }

    /**
    * Creates an instance of the Menu item.
    * @class
    * @param {Object} properties The properties used to initialize the object.
    * @property {String} cssClassItemGroup Gets or sets the css class of the child item-group.
    * @property {String} cssClassSubGroup Gets or sets the css class of a sub-group. Option has effect only when the subGroupId is specified.
    * @property {String} cssClassIcon Gets or sets the css class of the icon.
    * @property {String} style Gets or sets the css style of the item.
    * @property {String} itemGroupStyle Gets or sets the css style of the item-group.
    * @property {Boolean} hasIcon=false Gets or sets a value indicating if the item has an icon.
    * @property {String} iconURL Gets or sets the URL of the icon.
    * @property {TypeOption} type Gets or sets the item button type.
    * @property {String} href Gets or sets the href (hypertext reference) of the item. Applies to non-split buttons only.
    * @property {String} target Gets or sets the href target of the item. Applies to non-split buttons only.
    * @property {Function|String} command Gets or sets the command action of the item. A string wrapped function example: "app.section.doCommand".
    * @property {String} radioGroupId Gets or sets the id of the radio group to which this item belongs.
    * @property {String} subGroupId Gets or sets the id of the sub group (container) to which this item belongs. When provided, an HTML element will be created to serve as a container for all items with the same sub-group identifier
    * @property {ExpandDirectionOption} expandDirection Gets or sets the direction in which the menu item will expand it's children.
    * @property {Boolean} isCategory Gets or sets a value indicating that the item is a category. Child-items of a category are rendered as root-level navigation and are displayed when the category-item is selected (hiding the current root menu/category).
    * @property {Boolean} expandOnSelect Gets or sets a value indicating if a selectable item with child-items is expanded when selected.
    * @property {Boolean} collapseAllOnSelect Gets or sets a value indicating if all items are collapsed when an item is selected. Option has effect only when the corresponding item-group is not statically positioned.
    * @property {Boolean} expandable Gets or sets a value indicating if the item can be expanded/collapsed (true) or is always in expanded state (false). Option has effect only when the corresponding item-group is statically positioned.
    * @property {Boolean} expanded=false Gets or sets a value indicating if the item is initially expanded. Option has effect only when the item is expandable (otherwise child-items are always expanded) and the child-item list is loaded.
    * @property {Boolean} selectable=null Gets or sets a value indicating if the item is selectable. By default the item is selectable when there are no child-items or the item is a RADIO/CHECK-BUTTON type. Disable option when an item renders a template with no navigational purpose.
    * @property {Boolean} selectedChild=false Gets or sets a value indicating if a child-item is selected.
    * @property {Boolean} hasChildItems=false Gets or sets a value indicating if the item has children. Option has effect only when the child-items are loaded on demand.
    * @property {Number} expandDelay Gets or sets the delay in milliseconds before expanding a menu-item through a pointer-enter/leave event.
    * @property {String} buttonId Gets or sets the id of the base item button.
    * @property {String} itemGroupBoxId Gets or sets the id of the base item-group box.
    * @property {Item[]} itemList Gets or sets the child-item list of the item.
    * @augments componyx.UI.base.Item
    * @see {@link componyx.UI.base.Item}
    */
    componyx.UI.Menu.Item = function (properties)
    {
        this.cssClassItemGroup = '';
        this.cssClassSubGroup = '';
        this.cssClassIcon = '';
        this.style = '';
        this.itemGroupStyle = '';
        this.hasIcon = false;
        this.iconURL = null;
        this.type = componyx.UI.Menu.TypeOption.COMMANDBUTTON;
        this.href = null;
        this.target = null;
        this.command = null;
        this.radioGroupId = '';
        this.subGroupId = null;
        this.expandDirection = null;
        this.isCategory = null;
        this.expandOnSelect = null;
        this.collapseAllOnSelect = null;
        this.expandable = true;
        this.expanded = false;
        this.selectable = null;
        this.selectedChild = false;
        this.hasChildItems = false;
        this.expandDelay = null;
        this.itemGroupBoxId = null;
        this.buttonId = null;
        this.itemList = [];

        $base.static.Item.call(this, properties);
    }
})();
