/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /** 
    * Grid class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @property {componyx.UI.base.AjaxMethod} ajax.load - AJAX method used to load the grid's items.
    * @property {componyx.UI.base.AjaxMethod} ajax.loadItem - AJAX method used to load an item's detail data when a row is expanded.
    * @returns {Object} An instance of the component.
    */
    componyx.UI.Grid = function Grid(id, properties)
    {
        var _instance = this,
            _elementHandler, _outsideClick = true,
            _documentHandler = [],
            _themeOption = $base.static.ThemeOption,
            _rowSelectionOption = componyx.UI.Grid.RowSelectionOption,
            _rowExpansionOption = componyx.UI.Grid.RowExpansionOption,
            _groupExpansionOption = componyx.UI.Grid.GroupExpansionOption,
            _columnSortingOption = componyx.UI.Grid.ColumnSortingOption,
            _sortOrderOption = componyx.UI.Grid.SortOrderOption,
            _filterInputTypeOption = componyx.UI.Grid.FilterInputTypeOption,
            _filterMenuOptions = componyx.UI.Grid.FilterMenuOptions,
            _filterNumeric = _filterMenuOptions.EQUALTO + _filterMenuOptions.NOTEQUALTO + _filterMenuOptions.GREATERTHAN + _filterMenuOptions.GREATERTHANOREQUALTO + _filterMenuOptions.LESSTHAN + _filterMenuOptions.LESSTHANOREQUALTO + _filterMenuOptions.EMPTY + _filterMenuOptions.NOTEMPTY,
            _filterText = _filterMenuOptions.EQUALTO + _filterMenuOptions.NOTEQUALTO + _filterMenuOptions.STARTSWITH + _filterMenuOptions.NOTSTARTSWITH + _filterMenuOptions.ENDSWITH + _filterMenuOptions.NOTENDSWITH + _filterMenuOptions.CONTAINS + _filterMenuOptions.NOTCONTAINS + _filterMenuOptions.EMPTY + _filterMenuOptions.NOTEMPTY,
            _filterMenu, _filter = {}, _sort = {}, _headerDraggables = {}, _itemDraggables = [], _selectedItems = {}, _timerIds = [],
            _fixedColumnStyleSheet, _lastScrollLeft = 0, _scrollTimerId, _fixedColumnUpdateTimerId,
            _pager, _depthLevels, _loading, _ajax = [], _divHeader, _divFilter, _divContent, _tooltipManager, _scrollbarSize, _selectable, _hidden,
            _divNoResult, _divPreloader, _lastItem, _expandedItemId, _itemDropZones,
            _tableData = { header: null, filter: null, content: null, columnIndex: null, columnStartWidth: null, totalWidth: null, columnDistribution: null, columnLimits: null },
            _treeGroup, _cancelSelect, _forceSelect = false, _hasGroups,
            _displayRows = function (itemId, display)
            {
                var items = _treeGroup[itemId].items,
                    cssClass = _classOption.EXPANDED,
                    cssClassGroupHead = _instance.cssClassGroupHead || _classOption.GROUP_HEAD,
                    tr = getItemRow(itemId),
                    td = $lib(cssClassGroupHead, tr, 'td', true);

                if (td)
                {
                    if (display == null)
                        $lib.toggleClass(td, cssClass);
                    else if (display == '')
                        $lib.addClass(td, cssClass);
                    else
                        $lib.removeClass(td, cssClass);

                    if ($lib.hasClass(td, cssClass))
                        _instance.events.onItemGroupExpand.fire(_instance, eventArgs(loadItem(itemId), tr, td));
                    else
                        _instance.events.onItemGroupCollapse.fire(_instance, eventArgs(loadItem(itemId), tr, td));
                }

                for (var index = 0; index < items.length; ++index)
                {
                    tr = getItemRow(items[index].id);

                    if (display == null)
                        tr.style.display = (tr.style.display == 'none') ? '' : 'none'; // toggle
                    else
                        tr.style.display = display; // set as specified

                    if (tr.style.display == 'none' && items[index].expanded)
                        collapseItem(items[index].id); // the detail row has no id and isn't part of the group, so it must be closed explicitly

                    if (items[index].isGroup && tr.style.display == 'none') // always collapse children when parent is collapsed
                        _displayRows(items[index].id, 'none');
                }
            },
            _classOption =
            {
                HEADER: 'header',
                CONTENT: 'content',
                DATA_PAGER: 'data-pager',
                RESIZABLE: 'resizable',
                DRAGGABLE: 'draggable',
                SELECTABLE: 'selectable',
                DRAG: 'drag',
                DRAG_HANDLE: 'drag-handle',
                SCROLLABLE_X: 'scrollable-x',
                SCROLLABLE_Y: 'scrollable-y',
                TEXTBOX: 'textbox',
                FILTERROW: 'filter',
                FILTER_BUTTON: 'button filter',
                FILTERMENU: 'menu filter',
                FILTERRANGE: 'range',
                FILTER_FROM: 'filter-from',
                FILTER_TO: 'filter-to',
                SORTASC: 'asc',
                SORTDESC: 'desc',
                HEADER_LABEL: 'header-label',
                RESIZE_HANDLE: 'resize-handle',
                COLUMN_SORTING: 'column-sorting',
                DRAG_GHOST: 'drag-ghost',
                DROPPABLE: 'droppable',
                LEFT: 'left',
                RIGHT: 'right',
                TOP: 'top',
                BOTTOM: 'bottom',
                PRELOADER: 'preloader',
                NORESULT: 'noresult',
                CHECKBOX: 'checkbox',
                EXPAND: 'expand',
                EXPAND_ICON: 'expand-icon',
                EXPANDED: 'expanded',
                SELECTED: 'selected',
                COLUMN_GROUP: 'column-group',
                COLUMN: 'column',
                FIXED_COLUMN: 'fixed-column',
                HIDDEN_COLUMN: 'hidden-column',
                ITEM: '',
                GROUP_ITEM: 'group-item',
                GROUP_HEAD: 'group-head'
            };

        // define public properties
        /**
         * Gets or sets the css class of the header container.
         * @type {String}
         */
        this.cssClassHeader = '';

        /**
         * Gets or sets the css class of the content container.
         * @type {String}
         */
        this.cssClassContent = '';

        /**
         * Gets or sets the css class of the datapager.
         * @type {String}
         */
        this.cssClassDataPager = '';

        /**
         * Gets or sets the css class of the filter button.
         * @type {String}
         */
        this.cssClassFilterButton = '';

        /**
         * Gets or sets the css class of the filter menu.
         * @type {String}
         */
        this.cssClassFilterMenu = '';

        /**
         * Gets or sets the css class of the filter from label.
         * @type {String}
         */
        this.cssClassFilterFrom = '';

        /**
         * Gets or sets the css class of the filter to label.
         * @type {String}
         */
        this.cssClassFilterTo = '';

        /**
         * Gets or sets the css class of the header label.
         * @type {String}
         */
        this.cssClassHeaderLabel = '';

        /**
         * Gets or sets the css class of the resize handle.
         * @type {String}
         */
        this.cssClassResizeHandle = '';

        /**
         * Gets or sets the css class of the drag ghost.
         * @type {String}
         */
        this.cssClassDragGhost = '';

        /**
         * Gets or sets the css class of the preloader.
         * @type {String}
         */
        this.cssClassPreloader = '';

        /**
         * Gets or sets the css class of the no result container.
         * @type {String}
         */
        this.cssClassNoResult = '';

        /**
         * Gets or sets the css class of the check box.
         * @type {String}
         */
        this.cssClassCheckBox = '';

        /**
         * Gets or sets the css class of the expand cell.
         * @type {String}
         */
        this.cssClassExpand = '';

        /**
         * Gets or sets the css class of the expand icon.
         * @type {String}
         */
        this.cssClassExpandIcon = '';

        /**
         * Gets or sets the css class of the item.
         * @type {String}
         */
        this.cssClassItem = '';

        /**
         * Gets or sets the css class of a group-item.
         * @type {String}
         */
        this.cssClassGroupItem = '';

        /**
         * Gets or sets the css class of a group-item head.
         * @type {String}
         */
        this.cssClassGroupHead = '';

        /**
         * Gets or sets the css class of a fixed column.
         * @type {String}
         */
        this.cssClassFixedColumn = '';

        /**
         * Gets or sets the css class of a hidden column.
         * @type {String}
         */
        this.cssClassHiddenColumn = '';

        /**
         * Gets or sets the default template id of an item.
         * @type {String|null}
         */
        this.itemTemplateId = null;

        /**
         * Gets or sets the indent value of an item-group in pixels (defaults to 16).
         * @type {Number}
         */
        this.groupIndent = 16;

        /**
         * Gets or sets the amount of fixed columns at the left side of the grid which remain visible while scrolling horizontally.
         * @type {Number}
         */
        this.fixedColumns = 0;

        /**
         * Gets or sets the time in milliseconds between a horizontal scrolling action and updating the position of fixed columns accordingly (defaults to 100).
         * @type {Number}
         */
        this.fixedColumnScrollUpdate = 100;

        /**
         * Gets or sets the bottom offset in pixels for the viewport height. Only applicable when useViewportHeight is enabled.
         * @type {Number}
         */
        this.viewportBottomOffset = 0;

        /**
         * Gets or sets the height of the content container.
         * @type {String}
         */
        this.contentHeight = '';

        /**
         * Gets or sets the style of the content container.
         * @type {String}
         */
        this.contentStyle = '';

        /**
         * Gets or sets a value indicating whether column headers are draggable.
         * @type {Boolean}
         */
        this.draggableHeaders = true;

        /**
         * Gets or sets a value indicating whether column headers are resizable.
         * @type {Boolean}
         */
        this.resizableHeaders = true;

        /**
         * Gets or sets a value indicating whether data items are draggable.
         * @type {Boolean}
         */
        this.draggableItems = false;

        /**
         * Gets or sets a value indicating if the total width of the grid view is preserved when resizing a column. When enabled, resizing a column header will not change the total width of the grid, instead the change in width will be distributed over all resizable columns.
         * @type {Boolean}
         */
        this.preserveTotalWidth = false;

        /**
         * Gets or sets a value indicating whether the data pager is enabled.
         * @type {Boolean}
         */
        this.enableDataPager = false;

        /**
         * Gets or sets a value indicating whether the tooltip manager is enabled.
         * @type {Boolean}
         */
        this.enableTooltipManager = true;

        /**
         * Gets or sets a value indicating whether the filter row is enabled.
         * @type {Boolean}
         */
        this.enableFilterRow = true;

        /**
         * Gets or sets a value indicating whether the expand column is enabled.
         * @type {Boolean}
         */
        this.enableExpandColumn = true;

        /**
         * Gets or sets a value indicating whether the selection should be cleared on a click outside the grid.
         * @type {Boolean}
         */
        this.clearSelectionOnOutsideClick = false;

        /**
         * Gets or sets a value indicating whether the viewport height is utilized for the content container. The height calculation respects a possible bottom margin of the grid element.
         * @type {Boolean}
         */
        this.useViewportHeight = false;

        /**
         * Gets or sets the column sorting option.
         * @type {componyx.UI.Grid.ColumnSortingOption}
         */
        this.columnSorting = _columnSortingOption.NONE;

        /**
         * Gets or sets the row selection option.
         * @type {componyx.UI.Grid.RowSelectionOption}
         */
        this.rowSelection = _rowSelectionOption.NONE;

        /**
         * Gets or sets the row expansion option.
         * @type {componyx.UI.Grid.RowExpansionOption}
         */
        this.rowExpansion = _rowExpansionOption.NONE;

        /**
         * Gets or sets the item-group expansion option.
         * @type {componyx.UI.Grid.GroupExpansionOption}
         */
        this.groupExpansion = _groupExpansionOption.ICON;

        /**
         * Gets or sets friendly labels for filter menu options (EQUALTO, NOTEQUALTO, GREATERTHAN, GREATERTHANOREQUALTO, LESSTHAN, LESSTHANOREQUALTO, STARTSWITH, NOTSTARTSWITH, ENDSWITH, NOTENDSWITH, CONTAINS, NOTCONTAINS, BETWEEN, NOTBETWEEN, IN, NOTIN, EMPTY, NOTEMPTY)
         * @type {Object<String, String>}
         */
        this.filterMenuLabels = {};

        /**
         * Gets or sets the filter from and to labels (0: FROM, 1: TO).
         * @type {String[]}
         */
        this.filterBetweenLabels = [];

        /**
         * Gets or sets the list of items.
         * @type {componyx.UI.Grid.Item[]|null}
         */
        this.itemList = null;

        /**
         * Gets or sets the column groups.
         * @type {componyx.UI.Grid.ColumnGroup[]}
         */
        this.columnGroups = [];

        /**
         * Gets or sets the columns.
         * @type {componyx.UI.Grid.Column[]}
         */
        this.columns = [];

        /**
         * Gets or sets the id of the filter menu.
         * @type {String|null}
         */
        this.filterMenuId = null;

        /**
         * Gets or sets the id of the datapager.
         * @type {String|null}
         */
        this.dataPagerId = null;

        /**
         * Gets or sets the id of the tooltip manager used to display tooltips.
         * @type {String|null}
         */
        this.tooltipManagerId = null;

        /**
         * Gets or sets the drag settings for the draggable headers.
         * @type {componyx.library.DraggableSettings}
         */
        this.headerDragSettings = {};

        /**
         * Gets or sets the drag settings for the draggable items.
         * @type {componyx.library.DraggableSettings}
         */
        this.itemDragSettings = {};

        /**
         * Gets or sets the resize settings for the resizable headers.
         * @type {componyx.library.ResizableSettings}
         */
        this.headerResizeSettings = {};

        /**
         * Gets or sets the select settings for the selectable items.
         * @type {componyx.library.SelectableSettings}
         */
        this.selectSettings = {};

        /**
         * @class
         * @augments componyx.UI.base.Events
         * @memberof componyx.UI.Grid
         * @property {componyx.UI.base.Event} onItemClick              - Event which fires on an item click. @see {@link componyx.UI.Grid.GridItemEventArgs}
         * @property {componyx.UI.base.Event} onItemSelect             - Event which fires on an item select. @see {@link componyx.UI.Grid.GridItemEventArgs}
         * @property {componyx.UI.base.Event} onItemDeselect           - Event which fires on an item deselect. @see {@link componyx.UI.Grid.GridItemEventArgs}
         * @property {componyx.UI.base.Event} onItemExpand             - Event which fires on an item expand. @see {@link componyx.UI.Grid.GridItemEventArgs}
         * @property {componyx.UI.base.Event} onItemCollapse           - Event which fires on an item collapse. @see {@link componyx.UI.Grid.GridItemEventArgs}
         * @property {componyx.UI.base.Event} onItemGroupExpand        - Event which fires on an item-group expand. @see {@link componyx.UI.Grid.GridItemEventArgs}
         * @property {componyx.UI.base.Event} onItemGroupCollapse      - Event which fires on an item-group collapse. @see {@link componyx.UI.Grid.GridItemEventArgs}
         * @property {componyx.UI.base.Event} onPreRenderItem          - Event which fires when an item is rendered. @see {@link componyx.UI.Grid.GridItemEventArgs}
         * @property {componyx.UI.base.Event} onPostRenderItem         - Event which fires when an item is rendered. @see {@link componyx.UI.Grid.GridItemEventArgs}
         * @property {componyx.UI.base.Event} onPreLoadItemList        - Event which fires before the item-list data is loaded. @see {@link componyx.UI.Grid.GridQueryEventArgs}
         * @property {componyx.UI.base.Event} onPostLoadItemList       - Event which fires when the item-list data is loaded. @see {@link componyx.UI.Grid.GridAjaxEventArgs}
         * @property {componyx.UI.base.Event} onPostRenderItemList     - Event which fires when the item-list is rendered. @see {@link componyx.UI.Grid.GridAjaxEventArgs}
         * @property {componyx.UI.base.Event} onPreLoadItem            - Event which fires before the item data is loaded. @see {@link componyx.UI.Grid.GridEventArgs}
         * @property {componyx.UI.base.Event} onPostLoadItem           - Event which fires when the item data is loaded. @see {@link componyx.UI.Grid.GridAjaxEventArgs}
         * @property {componyx.UI.base.Event} onColumnOrderChange      - Event which fires when the column order is changed. @see {@link componyx.UI.Grid.GridColumnOrderEventArgs}
         * @property {componyx.UI.base.Event} onColumnResize           - Event which fires when a column is resized. @see {@link componyx.UI.Grid.GridColumnResizeEventArgs}
         * @property {componyx.UI.base.Event} onColumnSort             - Event which fires when the list is sorted. @see {@link componyx.UI.Grid.GridColumnSortEventArgs}
         * @property {componyx.UI.base.Event} onItemOrderChange        - Event which fires when the item order is changed. @see {@link componyx.UI.Grid.GridItemOrderEventArgs}
         * @see {@link componyx.UI.base.Events}
         */
        function GridEvents(events)
        {
            Object.assign(this, events);

            this.onItemClick = $base.static.createEvent('onItemClick');
            this.onItemSelect = $base.static.createEvent('onItemSelect');
            this.onItemDeselect = $base.static.createEvent('onItemDeselect');
            this.onItemExpand = $base.static.createEvent('onItemExpand');
            this.onItemCollapse = $base.static.createEvent('onItemCollapse');
            this.onItemGroupExpand = $base.static.createEvent('onItemGroupExpand');
            this.onItemGroupCollapse = $base.static.createEvent('onItemGroupCollapse');
            this.onPreRenderItem = $base.static.createEvent('onPreRenderItem');
            this.onPostRenderItem = $base.static.createEvent('onPostRenderItem');
            this.onPreLoadItemList = $base.static.createEvent('onPreLoadItemList');
            this.onPostLoadItemList = $base.static.createEvent('onPostLoadItemList');
            this.onPostRenderItemList = $base.static.createEvent('onPostRenderItemList');
            this.onPreLoadItem = $base.static.createEvent('onPreLoadItem');
            this.onPostLoadItem = $base.static.createEvent('onPostLoadItem');
            this.onColumnOrderChange = $base.static.createEvent('onColumnOrderChange');
            this.onColumnResize = $base.static.createEvent('onColumnResize');
            this.onColumnSort = $base.static.createEvent('onColumnSort');
            this.onItemOrderChange = $base.static.createEvent('onItemOrderChange');
        };

        /**
         * Grid events
         * @type {componyx.UI.Grid.GridEvents}
         */
        this.events = new GridEvents(this.events);

        /**
         * @typedef {Object} componyx.UI.Grid.GridEventArgs
         * @property {componyx.UI.Grid} Grid - The Grid instance.
         */

        /**
         * @typedef {Object} componyx.UI.Grid.GridItemEventArgs
         * @property {componyx.UI.Grid} Grid - The Grid instance.
         * @property {Object} eventArgs - The event object containing more detailed information about the event.
         * @property {componyx.UI.Grid.Item} eventArgs.item - The grid item.
         * @property {HTMLTableRowElement} eventArgs.tr - The table row of the item.
         * @property {HTMLTableCellElement|null} eventArgs.td - The group-head cell (item-group expand/collapse) or the expand content cell (item expand), otherwise null.
         * @property {Event} eventArgs.event - The original event object.
         */

        /**
         * @typedef {Object} componyx.UI.Grid.GridQueryEventArgs
         * @property {componyx.UI.Grid} Grid - The Grid instance.
         * @property {Object} eventArgs - The load query.
         * @property {Object.<string, componyx.UI.Grid.SortOrderOption>} eventArgs.sortOrder - The sort order per column id.
         * @property {Object} eventArgs.filter - The active filter.
         * @property {number} eventArgs.pageIndex - The page index (1-based).
         */

        /**
         * @typedef {Object} componyx.UI.Grid.GridAjaxEventArgs
         * @property {componyx.UI.Grid} Grid - The Grid instance.
         * @property {Object|undefined} eventArgs - The ajax result arguments, undefined when no ajax load method is defined (item-list events only).
         * @property {string|Object} eventArgs.data - The response data.
         */

        /**
         * @typedef {Object} componyx.UI.Grid.GridColumnSortEventArgs
         * @property {componyx.UI.Grid} Grid - The Grid instance.
         * @property {Object} eventArgs - The event object containing more detailed information about the event.
         * @property {string} eventArgs.columnId - The column id.
         * @property {componyx.UI.Grid.SortOrderOption|undefined} eventArgs.order - The new sort order, undefined when sorting was removed.
         */

        /**
         * @typedef {Object} componyx.UI.Grid.GridColumnOrderEventArgs
         * @property {componyx.UI.Grid} Grid - The Grid instance.
         * @property {Object} eventArgs - The event object containing more detailed information about the event.
         * @property {number} eventArgs.sourceIndex - The original column index.
         * @property {number} eventArgs.targetIndex - The new column index.
         */

        /**
         * @typedef {Object} componyx.UI.Grid.GridColumnResizeEventArgs
         * @property {componyx.UI.Grid} Grid - The Grid instance.
         * @property {Object} eventArgs - The event object containing more detailed information about the event.
         * @property {number} eventArgs.columnIndex - The column index.
         * @property {HTMLElement} eventArgs.element - The resized header element.
         */

        /**
         * @typedef {Object} componyx.UI.Grid.GridItemOrderEventArgs
         * @property {componyx.UI.Grid} Grid - The Grid instance.
         * @property {Object} eventArgs - The event object containing more detailed information about the event.
         * @property {componyx.UI.Grid.Item[]} eventArgs.items - The moved items (a group item includes its child items).
         * @property {number} eventArgs.fromIndex - The original item index.
         * @property {number} eventArgs.toIndex - The target item index.
         * @property {number} eventArgs.resultIndex - The resulting index after the move.
         * @property {HTMLElement} eventArgs.dropZone - The drop zone (table row) the items were dropped on.
         * @property {HTMLElement|null} eventArgs.nextRow - The row before which the items were inserted, null when appended at the end.
         */


        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        // define ajax method
        this.ajax.addMethod('loadItem');

        /** 
        * Sets the preloader template.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The content template. Pass null or empty string to remove the existing template.
        */
        this.setPreloaderTemplate = function (content)
        {
            _instance.addTemplate('Preloader', content, false);
        }

        /** 
        * Sets the item preloader template.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The content template. Pass null or empty string to remove the existing template.
        */
        this.setItemPreloaderTemplate = function (content)
        {
            _instance.addTemplate('ItemPreloader', content, false);
        }

        /** 
        * Sets the no result template.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The content template. Pass null or empty string to remove the existing template.
        */
        this.setNoResultTemplate = function (content)
        {
            _instance.addTemplate('NoResult', content, false);
        }

        /** 
        * Selects/deselects the item with the specified id.
        * @param {String} id Item id
        */
        this.toggleSelectItem = function (id)
        {
            _forceSelect = true;
            toggleSelectItem(id);
        }

        /** 
        * Selects the items with the specified id.
        * @param {Array} ids The list of item ids.
        */
        this.selectItems = function (ids)
        {
            for (var index = 0; index < ids.length; ++index)
            {
                _instance.selectItem(ids[index]);
            }
        }

        /** 
        * Deselects the items with the specified id.
        * @param {Array} ids The list of item ids.
        */
        this.deselectItems = function (ids)
        {
            for (var index = 0; index < ids.length; ++index)
            {
                deselectItem(ids[index]);
            }
        }

        /** 
        * Selects the item with the specified id.
        * @param {String} id Item id
        */
        this.selectItem = function (id)
        {
            _forceSelect = true;
            selectItem(id);
        }

        /** 
        * Deselects the item with the specified id.
        * @param {String} id Item id
        */
        this.deselectItem = function (id)
        {
            deselectItem(id);
        }

        /** 
        * Expands/collapses the item with the specified id.
        * @param {String} id Item id
        */
        this.toggleExpandItem = function (id)
        {
            toggleExpandItem(id);
        }

        /** 
        * Expands the item with the specified id.
        * @param {String} id Item id
        */
        this.expandItem = function (id)
        {
            expandItem(id);
        }

        /** 
        * Collapses the item with the specified id.
        * @param {String} id Item id
        */
        this.collapseItem = function (id)
        {
            collapseItem(id);
        }

        /** 
        * Expands/collapses the item-group with the specified id.
        * @param {String} id Item id
        */
        this.toggleExpandItemGroup = function (id)
        {
            expandItemGroup(id, null);
        }

        /** 
        * Expands the item-group with the specified id.
        * @param {String} id Item id
        */
        this.expandItemGroup = function (id)
        {
            expandItemGroup(id, true);
        }

        /** 
        * Collapses the item-group with the specified id.
        * @param {String} id Item id
        */
        this.collapseItemGroup = function (id)
        {
            expandItemGroup(id, false);
        }

        /** 
        * Enables the item with the specified id.
        * @param {String} id Item id
        */
        this.enableItem = function (id)
        {
            enableItem(id);
        }

        /** 
        * Disables the item with the specified id.
        * @param {String} id Item id
        */
        this.disableItem = function (id)
        {
            disableItem(id);
        }

        /** 
        * Returns the grid column group index with the specified id.
        * @param {String} id The column id.
        */
        this.getColumnGroupIndex = function (id)
        {
            return getIndex(_instance.columnGroups, id);
        }

        /** 
        * Returns the grid column group with the specified id.
        * @param {String} id The column id.
        */
        this.getColumnGroup = function (id)
        {
            return _instance.columnGroups[getIndex(_instance.columnGroups, id)];
        }

        /** 
        * Removes a column group header from the grid.
        * @param {String} id The id of the column group.
        */
        this.removeColumnGroup = function (id)
        {
            _instance.columnGroups.splice(getIndex(_instance.columnGroups, id), 1);
        }

        /** 
        * Returns the grid column index with the specified id.
        * @param {String} id The column id.
        */
        this.getColumnIndex = function (id)
        {
            return getIndex(_instance.columns, id);
        }

        /** 
        * Returns the grid column with the specified id.
        * @param {String} id The column id.
        */
        this.getColumn = function (id)
        {
            return _instance.columns[getIndex(_instance.columns, id)];
        }

        /** 
        * Removes a column from the grid.
        * @param {String} id The id of the column.
        */
        this.removeColumn = function (id)
        {
            _instance.columns.splice(getIndex(_instance.columns, id), 1);
        }

        /** 
        * Shows a columnGroup in the grid.
        * @param {String} id The id of the columnGroup.
        */
        this.showColumnGroup = function (id)
        {
            setColumnGroupDisplay(id, true);
        }

        /** 
        * Hides a columnGroup in the grid.
        * @param {String} id The id of the columnGroup.
        */
        this.hideColumnGroup = function (id)
        {
            setColumnGroupDisplay(id, false);
        }

        /** 
        * Shows a column in the grid.
        * @param {String} id The id of the column.
        */
        this.showColumn = function (id)
        {
            setColumnDisplay(id, true);
        }

        /** 
        * Hides a column in the grid.
        * @param {String} id The id of the column.
        */
        this.hideColumn = function (id)
        {
            setColumnDisplay(id, false);
        }

        /** 
        * Returns the selectable object which enables grid table elements to be selectable.
        */
        this.selectable = function ()
        {
            return _selectable;
        }

        /** 
        * Disables selection on elements for the current click event. Selection is automatically re-enabled when the current event bubbles to the document click.
        */
        this.cancelSelectClick = function ()
        {
            _cancelSelect = true;

            if (_selectable)
                _selectable.disable();
        }

        /** 
        * Filters the grid.
        * 
        * @param {Object} columns 
        * Plain Object with column id as key and a Plain Object as value. 
        * The value Object properties:
        *     value (String): The filter value.
        *     [type] (FilterMenuOptions): One or more of the options.
        *     [updateInput] (Boolean): Value indicating if the corresponding filter input value should be updated (default true).
        * 
        * @param {Boolean} [autoLoad] Defines if the grid should reload data.
        * @param {Boolean} [clear] Defines if the current selection should be cleared.
        */
        this.filter = function (columns, autoLoad, clear)
        {
            for (var columnId in columns)
            {
                setColumnFilter(columnId, columns[columnId].value, columns[columnId].type);

                if (_instance.enableFilterRow && columns[columnId].updateInput != false)
                {
                    setFilterValue(columnId, columns[columnId].value);
                    _filterMenu.selectItem(columnId);
                }
            }

            if (autoLoad != false)
                load(clear);
        }

        /** 
        * Sorts the grid.
        * @param {Object} columns Object with column id as key and one of the options from componyx.UI.Grid.SortOrderOption as value.
        * @param {Boolean} [autoLoad] Defines if the grid should reload data.
        * @param {Boolean} [clear] Defines if the current selection should be cleared.
        */
        this.sort = function (columns, autoLoad, clear)
        {
            for (var columnId in columns)
            {
                setColumnSortOrder(columnId, columns[columnId]);
            }

            if (autoLoad != false)
                load(clear);
        }

        /** 
        * Triggers a data load.
        * @param {Boolean} [clear] Defines if the current selection should be cleared.
        * @param {Number} [pageIndex] Defines which page index to load.
        */
        this.load = function (clear, pageIndex)
        {
            if (clear)
                clearSelection();

            load(pageIndex);
        }

        /** 
        * Returns the grid item with the specified id.
        * @param {String} id The item id.
        */
        this.getItem = function (id)
        {
            return _instance.itemList[getIndex(_instance.itemList, id)];
        }

        /** 
        * Removes the grid item with the specified id.
        * @param {String} id The item id.
        */
        this.removeItem = function (id)
        {
            removeItem(id);
        }

        /** 
        * Renders the specified item by creating a new table record or overwriting the existing table record in the grid. 
        * The item must exist in the item list and the item's position in the item group will equal the item's position within the item list.
        * @param {componyx.UI.Grid.Item} item The item to render.
        */
        this.renderItem = function (item)
        {
            var table = _divContent.firstChild;

            if (_divPreloader != null)
                _divPreloader.style.display = 'none';
            if (_divNoResult != null)
                _divNoResult.style.display = 'none';

            // display table
            table.style.display = '';
            drawItem(table, item, getIndex(_instance.itemList, item.id));

            if (_selectable)
                _selectable.update();
        }

        /** 
        * Renders the component.
        */
        this.render = async function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'grid');
                return;
            }

            if (_instance.enableFilterRow && componyx.UI.menu_modules)
                await componyx.UI.menu_modules.loaded; // we wait before the menu and it's modules are loaded

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

            postRender();
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
            var cssClassFixedColumn = _instance.cssClassFixedColumn || _classOption.FIXED_COLUMN,
                script = [],
                cssId = 'componyx.UI.Grid.global';

            if (_instance.enableDataPager)
                script.push('DataPager');

            script.push('Box');
            script.push('TooltipManager');
            script.push('Button');

            if (_instance.fixedColumns > 0)
            {
                _fixedColumnStyleSheet = $lib.getStyleSheet(cssId);

                if (!_fixedColumnStyleSheet)
                {
                    $lib.addCssTag($lib.format('#{0} .{1} { }', _instance.id, cssClassFixedColumn), cssId);
                    _fixedColumnStyleSheet = $lib.getStyleSheet(cssId);
                }
            }

            if (_instance.enableFilterRow)
            {
                var comparer = function (type)
                {
                    return function (col) { return (!col.disableFilter && !col.filterTemplate && col.filterInputType === type) };
                }

                script.push('Menu');

                if ($lib.indexOf(_instance.columns, comparer(_filterInputTypeOption.NUMERICBOX)) > -1)
                    script.push('NumericBox');

                if ($lib.indexOf(_instance.columns, comparer(_filterInputTypeOption.COMBOBOX)) > -1)
                    script.push('ComboBox');

                if ($lib.indexOf(_instance.columns, comparer(_filterInputTypeOption.DATEPICKER)) > -1)
                    script.push('DatePicker');

                if ($lib.indexOf(_instance.columns, comparer(_filterInputTypeOption.TIMEPICKER)) > -1)
                    script.push('TimePicker');

                if ($lib.indexOf(_instance.columns, comparer(_filterInputTypeOption.SLIDER)) > -1)
                    script.push('Slider');
            }

            return ['Grid', script];
        }

        function postRender()
        {
            if (!$base.methods.postRender.call(_instance)) // component got destroyed on postrender event
                return;

            load();
        }

        function load(pageIndex)
        {
            let query =
            {
                sortOrder: _sort,
                filter: _filter,
                pageIndex: pageIndex || 1
            };

            _instance.events.onPreLoadItemList.fire(_instance, query);

            _expandedItemId = null;
            _lastItem = null;
            _loading = true;

            if (_pager)
                _pager.hide();

            if (_instance.ajax.load && _instance.ajax.load.isDefined())
            {
                showPreloader();

                if (_ajax[0])
                    _ajax[0].abort();

                _ajax[0] = _instance.ajaxCall('load', window.JSON.stringify(query),
                    {
                        onSuccess: function (args)
                        {
                            dataLoaded(pageIndex || -1, args);
                        }
                    });
            }
            else
                dataLoaded();
        }

        function dataLoaded(pageIndex, ajaxArgs)
        {
            var ajaxResult = null;

            _loading = false

            if (ajaxArgs)
            {
                _instance.itemList = [];
                if (ajaxArgs.data)
                {
                    ajaxResult = (typeof ajaxArgs.data === 'string') ? window.JSON.parse(ajaxArgs.data) : ajaxArgs.data;
                    _instance.itemList = (ajaxResult) ? ajaxResult.itemList || [] : [];
                }
            }
            else if (_instance.itemList)
                _instance.itemList = (typeof _instance.itemList === 'string') ? window.JSON.parse(_instance.itemList) : _instance.itemList || [];

            if (!_instance.itemList)
                _instance.itemList = [];

            setupPager(ajaxResult, pageIndex);
            _instance.events.onPostLoadItemList.fire(_instance, ajaxArgs);

            if (_instance.itemList.length > 0)
                drawItemList();
            else
                showNoResult();

            detectViewportSize();
            _instance.events.onPostRenderItemList.fire(_instance, ajaxArgs);
        }

        function setupPager(ajaxResult, pageIndex)
        {
            let itemCount = _instance.itemList.filter(function (item) { return !item.isGroup; }).length; // group header rows don't count as items

            if (_pager && ajaxResult && ajaxResult.totalItemCount && ajaxResult.totalItemCount > itemCount)
            {
                _pager.itemCount = ajaxResult.totalItemCount;

                if (pageIndex == -1)
                    _pager.setPageIndex(1);
                else
                    _pager.setPageIndex(pageIndex);

                _pager.show();
            }
            else if (_pager)
                _pager.hide();
        }

        function draw()
        {
            _scrollbarSize = $lib.getScrollBarSize();

            if (_instance.enableTooltipManager)
                createTooltipManager();

            createHeader();
            createContent();
            _hidden = _instance.createSyncedInput();

            if (_instance.enableDataPager)
                createDataPager();

            $lib.on(window, 'resize', detectViewportSize);
            _documentHandler.push($lib.on(document, 'click', function ()
            {
                if (_selectable && _cancelSelect)
                    _selectable.enable();

                _cancelSelect = false;
            }));

            bindOutsideClickHandler();
            _instance.renderChildren();
        }

        function bindOutsideClickHandler()
        {
            if (_instance.clearSelectionOnOutsideClick)
            {
                _elementHandler = $lib.on(_instance.element, 'pointerdown', function () { _outsideClick = false; }, null, _instance);
                _documentHandler.push($lib.on(document, 'pointerup', function (e)
                {
                    if (_outsideClick)
                        clearSelection();

                    _outsideClick = true;
                }, null, _instance));
            }
        }

        function createTooltipManager()
        {
            var id = _instance.id + '_TooltipManager';

            _tooltipManager = $UI.createComponent(componyx.UI.TooltipManager, { id: id, containerElement: _instance.element });
            _tooltipManager.clone($UI.store[_instance.tooltipManagerId], _instance, true, true, { triggers: '' });

            if (!_tooltipManager.boxId)
            {
                var box = $UI.createComponent(componyx.UI.Box, { id: id + '_TempBox', containerElement: _instance.element });
                box.expandDirection = componyx.UI.Box.ExpandDirectionOption.DOWN;
                box.autoPosition = componyx.UI.Box.AutoPositionOption.EXPAND;
                box.alignX = componyx.UI.Box.AlignXOption.CENTER;
                box.autoInvertFit = true;
                _tooltipManager.boxId = box.id;
            }

            _tooltipManager.showing = true;
            _tooltipManager.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);
        }

        function createHeader()
        {
            var div = _instance.element.appendChild(document.createElement('div')),
                table = div.appendChild(document.createElement('div')).appendChild(document.createElement('table')),
                dragGhost = createDragGhost(div.firstChild),
                colgroup = table.appendChild(document.createElement('colgroup')),
                tbody = table.appendChild(document.createElement('tbody')),
                cssClassCheckBox = _instance.cssClassCheckBox || _classOption.CHECKBOX,
                cssClassExpand = _instance.cssClassExpand || _classOption.EXPAND,
                cssClassHiddenColumn = _instance.cssClassHiddenColumn || _classOption.HIDDEN_COLUMN,
                cssClassFixedColumn = _instance.cssClassFixedColumn || _classOption.FIXED_COLUMN,
                row, cell, column, groupId, group, groups = {}, rowNum = 0, index, rows = [], fixed,
                resizeHandle, maxDepth, spanSelectAll, container, tooltipTemplate;

            _headerDraggables = {};
            _depthLevels = getDepthLevels();
            maxDepth = _depthLevels[0];

            div.className = _instance.cssClassHeader || _classOption.HEADER;
            _divHeader = div;

            if (_instance.resizableHeaders)
                $lib.addClass(div, _classOption.RESIZABLE);

            if (_instance.draggableHeaders)
                $lib.addClass(div, _classOption.DRAGGABLE);

            for (index = 0; index < maxDepth; ++index)
            {
                // create total rows
                rows.push(table.insertRow(-1));
            }

            for (index = (showExpandColumn()) ? -1 : 0; index < _instance.columns.length; ++index)
            {
                spanSelectAll = null;
                column = _instance.columns[index] || null;
                rowNum = (index > -1) ? _depthLevels[1][column.id] - 1 : 0;
                fixed = (_instance.fixedColumns > 0 && index < _instance.fixedColumns);

                cell = document.createElement('th');
                cell.rowSpan = maxDepth - rowNum;
                container = cell.appendChild(document.createElement('div')).appendChild(document.createElement('span'));
                container.className = _instance.cssClassHeaderLabel || _classOption.HEADER_LABEL;

                // add col to colgroup
                var col = colgroup.appendChild(document.createElement('col'));
                // add at correct row index
                rows[rowNum].appendChild(cell);

                if (index == -1)
                {
                    $lib.addClass(cell, cssClassExpand);
                    $lib.addClass(col, cssClassExpand);

                    if (fixed)
                        $lib.addClass(cell, cssClassFixedColumn);

                    continue;
                }

                groupId = column.columnGroupId;
                cell.id = _instance.id + '_h_' + column.id;
                cell.setAttribute('tabindex', '0');
                tooltipTemplate = (column.headerTooltipTemplate) ? column.headerTooltipTemplate : _instance.getTemplateContent('HeaderTooltip_' + column.id);

                column.headerText = ($lib.isEmpty(column.headerText)) ? '' : column.headerText;

                if (column.visible == false)
                {
                    $lib.addClass(col, cssClassHiddenColumn);
                    $lib.addClass(cell, cssClassHiddenColumn);
                }

                if (fixed)
                    $lib.addClass(cell, cssClassFixedColumn);

                if (tooltipTemplate)
                {
                    // header tooltip
                    column.headerTooltipTemplate = tooltipTemplate;

                    if (_tooltipManager)
                    {
                        _tooltipManager.addTooltip(column.id, tooltipTemplate);
                        _tooltipManager.addTrigger(cell.id, column.id);
                    }
                }

                if (column.columnTemplate)
                    _instance.addTemplate('Column_' + column.id, column.columnTemplate);

                if (column.filterTemplate)
                    _instance.addTemplate('Filter_' + column.id, column.filterTemplate);

                $lib.addClass(cell, column.cssClassHeader || _classOption.COLUMN);

                if (column.style)
                    $lib.updateStyle(cell.style, column.style);

                if (column.cssClassHeader)
                    $lib.addClass(col, column.cssClassHeader);

                if (!$lib.isEmpty(column.width))
                    col.style.width = $lib.unit(column.width);

                if (column.checkBox)
                {
                    $lib.addClass(cell, cssClassCheckBox);
                    $lib.addClass(col, cssClassCheckBox);

                    if (_instance.rowSelection == _rowSelectionOption.MULTI)
                    {
                        spanSelectAll = container.appendChild(document.createElement('span'));
                        spanSelectAll.className = cssClassCheckBox;

                        if (!$lib.isEmpty(column.headerText))
                            container.appendChild(document.createTextNode(column.headerText));

                        $lib.on(spanSelectAll, 'click', selectAll, [spanSelectAll]);
                    }
                }
                else
                {
                    container.innerHTML = column.headerText;

                    if (_instance.resizableHeaders && column.resizable != false)
                    {
                        resizeHandle = cell.firstChild.appendChild(document.createElement('span'));
                        resizeHandle.className = _instance.cssClassResizeHandle || _classOption.RESIZE_HANDLE;
                    }
                }

                if (!$lib.isEmpty(groupId))
                {
                    while (!$lib.isEmpty(groupId))
                    {
                        group = _instance.columnGroups[getIndex(_instance.columnGroups, groupId)];

                        // add group only once
                        if (!groups[groupId])
                        {
                            cell = document.createElement('th');
                            cell.colSpan = 1;
                            groups[groupId] = cell;

                            container = cell.appendChild(document.createElement('div')).appendChild(document.createElement('span'));
                            container.innerHTML = group.headerText;

                            $lib.addClass(cell, group.cssClass || _classOption.COLUMN_GROUP);

                            if (fixed)
                                $lib.addClass(cell, cssClassFixedColumn);

                            if (group.style)
                                $lib.updateStyle(cell.style, group.style);

                            // insert cell at correct row number
                            rows[--rowNum].appendChild(cell);
                        }
                        else
                            groups[groupId].colSpan++;

                        groupId = group.parentId;
                    }
                }
            }

            // set css class first on left TH's
            setHeaderFirstChildClass(table);

            // all dropzones must exist before we can bind events
            for (index = 0; index < _instance.columns.length; ++index)
            {
                column = _instance.columns[index];
                bindHeaderEvents(getColumnTableHeader(column.id), column, dragGhost);
            }

            // hide columns under hidden group
            for (index = 0; index < _instance.columnGroups.length; ++index)
            {
                if (group.visible == false)
                    setColumnGroupDisplay(_instance.columnGroups[index].id, false);
            }

            if (_instance.enableFilterRow)
                createFilterRow(div);

            function getDepthLevels()
            {
                var depth, groupId, column,
                    _depthLevels = [0, {}];

                for (var index = 0; index < _instance.columns.length; ++index)
                {
                    column = _instance.columns[index];
                    groupId = column.columnGroupId;
                    depth = 1;
                    _depthLevels[1][column.id] = depth;

                    while (!$lib.isEmpty(groupId))
                    {
                        ++depth;

                        if (depth > _depthLevels[1][column.id])
                            _depthLevels[1][column.id] = depth; // depth per column

                        groupId = _instance.columnGroups[getIndex(_instance.columnGroups, groupId)].parentId;
                    }

                    if (depth > _depthLevels[0])
                        _depthLevels[0] = depth; // total depth
                }

                return _depthLevels;
            }
        }

        function setHeaderFirstChildClass(table)
        {
            var tr = $lib(null, table, 'tr', true),
                stop, th;

            while (tr && !stop)
            {
                th = tr.firstChild;
                $lib.addClass(th, 'first');
                stop = (th.rowSpan > 1);

                tr = tr.nextSibling;
            }
        }

        function bindHeaderEvents(cell, column, dragGhost)
        {
            if (column.checkBox || column.expand)
                return;

            var resizeHandle = $lib(_instance.cssClassResizeHandle || _classOption.RESIZE_HANDLE, cell, 'span', true),
                title = $lib(_instance.cssClassHeaderLabel || _classOption.HEADER_LABEL, cell, 'span', true),
                enableSorting = !column.disableSorting && _instance.columnSorting != _columnSortingOption.NONE;

            if (_instance.resizableHeaders && resizeHandle)
            {
                $lib.resizable(cell, $base.static.initResizeSettings({
                    resizeHandles: { 'e': resizeHandle },
                    defaultHandles: false,
                    onResizeStart: headerResizeStart,
                    onResize: function (args) { $lib.defer(headerResize.bind(_instance, args)); },
                    onResizeEnd: headerResizeEnd,
                }, _instance.headerResizeSettings));
            }

            if (enableSorting)
            {
                title.classList.add(_classOption.COLUMN_SORTING);
                $lib.on(title, 'click', sort, [column.id, null]);
            }

            if (_instance.draggableHeaders)
            {
                $lib.on(title, 'pointerdown', disableDrag, column.id);

                if (resizeHandle)
                    $lib.on(resizeHandle, 'pointerdown', disableDrag, column.id);

                if (!$lib.has(document, 'pointerup', enableDrag))
                    $lib.on(document, 'pointerup', enableDrag);

                _headerDraggables[column.id] = $lib.draggable(cell, $base.static.initDragSettings({
                    dragGhost: dragGhost,
                    autoGhostSize: true,
                    minDragX: 1,
                    dragY: false,
                    dropAcceptMode: 2,
                    droppableClass: _instance.headerDragSettings.droppableClass || _classOption.DROPPABLE,
                    dropZones: getHeaderDropZones(column),
                    onDragStart: headerDragStart,
                    onDroppable: function (args) { $lib.defer(headerDroppable.bind(_instance, args)); },
                    onDroppableLeave: headerDroppableLeave,
                    onDrop: headerDrop
                }, _instance.headerDragSettings));
            }
        }

        function disableDrag(columnId)
        {
            _headerDraggables[columnId].disable();
        }

        function enableDrag()
        {
            _timerIds.push(setTimeout(function ()
            {
                $lib.each(_headerDraggables, function (item)
                {
                    if (item.disabled)
                        item.enable();
                });
            }, 0));
        }

        function getHeaderDropZones(column)
        {
            var index, col, dropZones = [];

            for (index = 0; index < _instance.columns.length; ++index)
            {
                col = _instance.columns[index];

                if (col.id != column.id && col.columnGroupId == column.columnGroupId)
                    dropZones.push(getColumnTableHeader(col.id));
            }

            return dropZones;
        }

        function getItemDropZones(item)
        {
            if (!_hasGroups)
                return _itemDropZones = $lib(null, _divContent, 'tr'); // without groups, all table-rows are droppable

            var dropZones = [];

            $lib.each(_instance.itemList, function (i)
            {
                if (i.parentId === item.parentId)
                    dropZones.push(getItemRow(i.id));
            });

            return dropZones;
        }

        function createFilterRow(div)
        {
            var table = div.appendChild(document.createElement('div')).appendChild(document.createElement('table')),
                colgroup = table.appendChild(document.createElement('colgroup')),
                tbody = table.appendChild(document.createElement('tbody')),
                cssClassCheckBox = _instance.cssClassCheckBox || _classOption.CHECKBOX,
                cssClassExpand = _instance.cssClassExpand || _classOption.EXPAND,
                cssClassHiddenColumn = _instance.cssClassHiddenColumn || _classOption.HIDDEN_COLUMN,
                cssClassFixedColumn = _instance.cssClassFixedColumn || _classOption.FIXED_COLUMN,
                row = table.insertRow(-1), cell, column, id, col,
                container, fixed;

            _divFilter = table.parentNode;
            table.className = _instance.cssClassFilterRow || _classOption.FILTERROW;

            $lib.on(_divFilter, 'keydown', filterKeydown, null, _instance);

            for (var index = (showExpandColumn()) ? -1 : 0; index < _instance.columns.length; ++index)
            {
                fixed = (_instance.fixedColumns > 0 && index < _instance.fixedColumns);
                column = _instance.columns[index] || null;
                cell = row.appendChild(document.createElement('td'));
                cell.appendChild(document.createElement('div'));
                container = cell.firstChild.appendChild(document.createElement('div'));

                // add col to colgroup
                col = colgroup.appendChild(document.createElement('col'));

                if (index == -1)
                {
                    $lib.addClass(cell, cssClassExpand);
                    $lib.addClass(col, cssClassExpand);

                    if (fixed)
                        $lib.addClass(cell, cssClassFixedColumn);

                    continue;
                }

                id = $lib.format('{0}_FilterInput_{1}', _instance.id, column.id);

                $lib.addClass(cell, column.cssClassHeader || _classOption.COLUMN);

                if (fixed)
                    $lib.addClass(cell, cssClassFixedColumn);

                if (column.visible == false)
                {
                    $lib.addClass(col, cssClassHiddenColumn);
                    $lib.addClass(cell, cssClassHiddenColumn);
                }

                if (column.cssClassHeader)
                    $lib.addClass(col, column.cssClassHeader);

                if (!$lib.isEmpty(column.width))
                    col.style.width = $lib.unit(column.width);

                if (column.checkBox)
                {
                    $lib.addClass(cell, cssClassCheckBox);
                    $lib.addClass(col, cssClassCheckBox);
                }
                else if (!column.disableFilter)
                {
                    var options = column.filterMenuOptions,
                        range = (options & _filterMenuOptions.BETWEEN || options & _filterMenuOptions.NOTBETWEEN),
                        rangeOnly = (options == _filterMenuOptions.BETWEEN + _filterMenuOptions.NOTBETWEEN ||
                            options == _filterMenuOptions.BETWEEN || options == _filterMenuOptions.NOTBETWEEN),
                        isSlider = column.filterInputType === _filterInputTypeOption.SLIDER,
                        rangeContainer;

                    if (!options)
                        options = getDefaultOptions(column);

                    if (range)
                        rangeContainer = $lib.element(cell.firstChild, '', '', null, { "class": _classOption.FILTERRANGE });

                    if (_instance.hasTemplate('Filter_' + column.id) || _instance.hasTemplate('RangeFilter_' + column.id))
                    {
                        if (!rangeOnly)
                            _instance.applyTemplate(container, 'Filter_' + column.id);

                        if (range)
                            _instance.applyTemplate(rangeContainer, 'RangeFilter_' + column.id);
                    }
                    else
                    {
                        if (range && !isSlider)
                        {
                            var filterFrom = $lib.element(rangeContainer, '', 'label');
                            filterFrom.className = _instance.cssClassFilterFrom || _classOption.FILTER_FROM;
                            filterFrom.innerHTML = _instance.filterBetweenLabels[0] || '<b>From</b>';

                            var filterTo = $lib.element(rangeContainer, '', 'label');
                            filterTo.className = _instance.cssClassFilterTo || _classOption.FILTER_TO;
                            filterTo.innerHTML = _instance.filterBetweenLabels[1] || '<b>To</b>';
                        }

                        if (isSlider)
                        {
                            $lib.remove(rangeContainer);
                            createSlider(column, id, options, container);
                        }
                        else
                        {
                            var fn;

                            if (!column.filterInputType)
                                fn = createTextBox;
                            else if (column.filterInputType == _filterInputTypeOption.NUMERICBOX)
                                fn = createNumericBox;
                            else if (column.filterInputType == _filterInputTypeOption.COMBOBOX)
                                fn = createComboBox;
                            else if (column.filterInputType == _filterInputTypeOption.DATEPICKER)
                                fn = createDatePicker;
                            else if (column.filterInputType == _filterInputTypeOption.TIMEPICKER)
                                fn = createTimePicker;

                            if (!rangeOnly)
                                fn(column, id, options, container);

                            if (range)
                            {
                                fn(column, id + '_From', options, filterFrom);
                                fn(column, id + '_To', options, filterTo);
                            }
                        }
                    }

                    createFilterButton(column, options, cell.firstChild);
                }
            }
        }

        function filterKeydown(e)
        {
            if (e.key !== 'Enter')
                return;

            let prefix = _instance.id + '_FilterInput_',
                match = null,
                el = e.target;

            while (el)
            {
                if (el.id && el.id.indexOf(prefix) === 0)
                    match = el; // keep overwriting, we want the outermost match, not the first one found

                el = el.parentElement;
            }

            if (!match)
                return; // not inside a filter input

            let id = match.id.replace(/_From$|_To$/, ''); // range inputs are suffixed _From/_To, strip that first

            e.preventDefault();
            triggerFilter(id.replace(prefix, ''));
        }

        function getDefaultOptions(column)
        {
            switch (column.filterInputType)
            {
                case _filterInputTypeOption.NUMERICBOX:
                case _filterInputTypeOption.DATEPICKER:
                case _filterInputTypeOption.TIMEPICKER:
                case _filterInputTypeOption.SLIDER:
                    return _filterNumeric;
                case _filterInputTypeOption.COMBOBOX:
                case _filterInputTypeOption.TEXTBOX:
                    return _filterText;
            }
        }

        function createTextBox(column, id, options, container)
        {
            var input = container.appendChild(document.createElement('input'));

            input.id = id;
            input.type = 'text';
            input.className = _instance.cssClassTextBox || _classOption.TEXTBOX;
        }

        function createNumericBox(column, id, options, container)
        {
            var numericBox = $UI.createComponent(componyx.UI.NumericBox, { id: id, containerElement: container });

            numericBox.clone($UI.store[column.filterInputId], _instance);
            numericBox.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null, true);
            numericBox.showing = true;
        }

        function createComboBox(column, id, options, container)
        {
            var comboBox = $UI.createComponent(componyx.UI.ComboBox, { id: id, containerElement: container }),
                multiSelect = (options & _filterMenuOptions.IN || options & _filterMenuOptions.NOTIN);

            comboBox.clone($UI.store[column.filterInputId], _instance);
            comboBox.multiSelect = multiSelect;
            comboBox.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null, true);
            comboBox.showing = true;
        }

        function createDatePicker(column, id, options, container)
        {
            var datePicker = $UI.createComponent(componyx.UI.DatePicker, { id: id, containerElement: container });

            datePicker.clone($UI.store[column.filterInputId], _instance);
            datePicker.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null, true);
            datePicker.showing = true;
        }

        function createTimePicker(column, id, options, container)
        {
            var timePicker = $UI.createComponent(componyx.UI.TimePicker, { id: id, containerElement: container });

            timePicker.clone($UI.store[column.filterInputId], _instance);
            timePicker.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null, true);
            timePicker.showing = true;
        }

        function createSlider(column, id, options, container)
        {
            var slider = $UI.createComponent(componyx.UI.Slider, { id: id, containerElement: container });

            slider.clone($UI.store[column.filterInputId], _instance);
            slider.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null, true);
            slider.showing = true;
        }

        function createFilterButton(column, options, container)
        {
            var id = $lib.format('{0}_FilterButton_{1}', _instance.id, column.id),
                button = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: container }),
                singleOption = !options || (Math.log(options) / Math.log(2) % 1 == 0);

            button.primary = button.transparentBorder = false;
            button.clone($UI.store[column.filterButtonId], _instance);
            button.hasIcon = true;
            button.cssClass = button.cssClass || _instance.cssClassFilterButton || _classOption.FILTER_BUTTON;
            button.command = filterCommand.bind(_instance, button);
            button.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null, true);
            button.showing = true;

            if (!singleOption)
            {
                button.menuId = $lib.format('{0}_FilterMenu', _instance.id);
                button.menuItemId = column.id;

                if (_tooltipManager)
                {
                    button.tooltipManagerId = _tooltipManager.id;
                    button.tooltipId = column.id + '_Filter';
                }

                createFilterMenu(column, options);
            }
        }

        function createFilterMenu(column, options)
        {
            var id = $lib.format('{0}_FilterMenu', _instance.id),
                menu = _filterMenu || $UI.createComponent(componyx.UI.Menu, { id: id, containerElement: _instance.element }),
                options = column.filterMenuOptions, rootItem = new componyx.UI.Menu.Item(), item, value;

            if (!options)
                options = getDefaultOptions(column);

            rootItem.id = column.id;
            menu.itemList.push(rootItem);

            for (var key in _filterMenuOptions)
            {
                value = _filterMenuOptions[key];

                if (options & value)
                {
                    item = new componyx.UI.Menu.Item();
                    item.id = $lib.format('{0}_{1}', rootItem.id, value);
                    item.value = value;
                    item.key = key;
                    item.text = _instance.filterMenuLabels[key] || key;
                    item.radioGroupId = column.id;
                    item.type = componyx.UI.Menu.TypeOption.RADIOBUTTON;
                    rootItem.itemList.push(item);

                    if ((!column.filterMenuSelectedOption && rootItem.itemList.length == 1) || column.filterMenuSelectedOption == _filterMenuOptions[key])
                    {
                        item.selected = true;

                        if (_tooltipManager)
                            _tooltipManager.addTooltip(column.id + '_Filter', item.text);
                    }
                }
            }

            if (!_filterMenu)
            {
                _filterMenu = menu;
                menu.clone($UI.store[_instance.filterMenuId], _instance);
                menu.cssClass = menu.cssClass || _instance.cssClassFilterMenu || _classOption.FILTERMENU;
                menu.expandOnClick = true;
                menu.visibleRoot = false;
                menu.showing = true;
                menu.collapseAllOnSelect = true;
                menu.events.onPostRender.priorityAdd(() => { _instance.isReady.apply(_instance); }, null);
                menu.events.onItemExpand.priorityAdd(() => { _tooltipManager?.hideAllTooltips(); });
                menu.events.onItemSelect.priorityAdd(selectFilter);
            }

            toggleFilterView(column, rootItem.itemList[0]);
        }

        function createContent()
        {
            var table, column, colgroup, col, index,
                cssClassHiddenColumn = _instance.cssClassHiddenColumn || _classOption.HIDDEN_COLUMN,
                cssClassCheckBox = _instance.cssClassCheckBox || _classOption.CHECKBOX,
                cssClassExpand = _instance.cssClassExpand || _classOption.EXPAND;

            _divContent = _instance.element.appendChild(document.createElement('div'));
            _divContent.className = _instance.cssClassContent || _classOption.CONTENT;

            if (_instance.rowSelection > _rowSelectionOption.NONE)
                $lib.addClass(_divContent, _classOption.SELECTABLE);

            if (!$lib.isEmpty(_instance.contentStyle))
                $lib.setStyle(_divContent, _instance.contentStyle);

            if (!$lib.isEmpty(_instance.contentHeight))
                _divContent.style.height = $lib.unit(_instance.contentHeight);

            table = _divContent.appendChild(document.createElement('table'));
            colgroup = table.appendChild(document.createElement('colgroup'));

            table.appendChild(document.createElement('tbody'));

            for (index = (showExpandColumn()) ? -1 : 0; index < _instance.columns.length; ++index)
            {
                col = colgroup.appendChild(document.createElement('col'));

                if (index == -1)
                {
                    $lib.addClass(col, cssClassExpand);
                    continue;
                }

                column = _instance.columns[index];

                if (column.visible == false)
                    $lib.addClass(col, cssClassHiddenColumn);

                if (column.checkBox)
                    $lib.addClass(col, cssClassCheckBox);

                if (column.cssClass)
                    $lib.addClass(col, column.cssClass);

                if (!$lib.isEmpty(column.width))
                    col.style.width = $lib.unit(column.width);
            }
        }

        function createDataPager()
        {
            var id = _instance.id + '_Pager';
            _pager = $UI.createComponent(componyx.UI.DataPager, { id: id, containerElement: _instance.element });

            _pager.visiblePages = 0;

            _pager.clone($UI.store[_instance.dataPagerId], _instance);
            _pager.cssClass = _pager.cssClass || _instance.cssClassDataPager || _classOption.DATA_PAGER;
            _pager.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);
            _pager.events.onIndexChange.priorityAdd(pageIndexChange, null);
        }

        function pageIndexChange(pager, args)
        {
            load(args.pageIndex);
        }

        function drawItemList()
        {
            var table = _divContent.firstChild, tbody = $lib(null, table, 'tbody', true);

            _itemDropZones = null;

            if (_divPreloader != null)
                _divPreloader.style.display = 'none';
            if (_divNoResult != null)
                _divNoResult.style.display = 'none';

            // clear table data
            table.style.display = '';
            tbody.parentNode.replaceChild(document.createElement('tbody'), tbody);
            _hasGroups = false;
            _treeGroup = {};

            $lib.each(_itemDraggables, (d) =>
            {
                d.disable();
            });

            _itemDraggables = [];

            for (var index = 0; index < _instance.itemList.length; ++index)
            {
                drawItem(table, _instance.itemList[index]);
            }

            _lastItem = null;
            _timerIds.push(setTimeout(initSelectable.bind(_instance, table), 0));
        }

        function drawItem(table, item, pos)
        {
            var rowIndex, index, column, cell, spanCheckBox, spanExpand, divGroupItem, spanGroupExpandIcon, group,
                cssClass = item.cssClass || _instance.cssClassItem || _classOption.ITEM,
                cssClassHiddenColumn = _instance.cssClassHiddenColumn || _classOption.HIDDEN_COLUMN,
                cssClassFixedColumn = _instance.cssClassFixedColumn || _classOption.FIXED_COLUMN,
                cssClassCheckBox = _instance.cssClassCheckBox || _classOption.CHECKBOX,
                cssClassExpand = _instance.cssClassExpand || _classOption.EXPAND,
                cssClassExpandIcon = _instance.cssClassExpandIcon || _classOption.EXPAND_ICON,
                cssClassGroupHead = _instance.cssClassGroupHead || _classOption.GROUP_HEAD,
                cssClassGroupItem = _instance.cssClassGroupItem || _classOption.GROUP_ITEM,
                cssClassGroupExpandIcon = _instance.cssClassExpandIcon || _classOption.EXPAND_ICON,
                itemIndent = item.groupIndent || _instance.groupIndent, fixed,
                tr = getItemRow(item.id),
                dragHandleIndex = (_instance.draggableItems && item.draggable) ? getDragHandleColumnIndex() : -1;

            // cache item
            _lastItem = item;

            if (!tr)
            {
                tr = (pos) ? table.insertRow(pos) : table.insertRow(-1);
                rowIndex = tr.rowIndex;
            }
            else
            {
                rowIndex = tr.rowIndex;
                table.deleteRow(rowIndex);
                tr = table.insertRow(rowIndex);
            }

            tr.id = getItemId(item.id);

            if (cssClass)
                tr.className = cssClass;

            if (rowIndex % 2 != 0)
                $lib.addClass(tr, 'odd');

            _instance.events.onPreRenderItem.fire(_instance, eventArgs(item, tr, null));

            for (index = (showExpandColumn()) ? -1 : 0; index < _instance.columns.length; ++index)
            {
                column = _instance.columns[index] || null;
                cell = tr.appendChild(document.createElement('td'));
                fixed = (_instance.fixedColumns > 0 && index < _instance.fixedColumns);

                if (index == -1)
                {
                    if (item.expandable != false)
                    {
                        spanExpand = cell.appendChild(document.createElement('span'));
                        spanExpand.className = cssClassExpandIcon;
                        $lib.addClass(cell, cssClassExpand);
                    }

                    if (fixed)
                        $lib.addClass(cell, cssClassFixedColumn);

                    continue;
                }

                $lib.addClass(cell, column.cssClass);

                if (column.visible == false)
                    $lib.addClass(cell, cssClassHiddenColumn);

                if (fixed)
                    $lib.addClass(cell, cssClassFixedColumn);

                if (column.checkBox)
                {
                    spanCheckBox = cell.appendChild(document.createElement('span'));
                    spanCheckBox.className = cssClassCheckBox;

                    $lib.addClass(cell, cssClassCheckBox);

                    if (_instance.rowSelection == _rowSelectionOption.MULTI)
                    {
                        $lib.on(cell, 'click', function (itemId, e)
                        {
                            e.stopPropagation(); // skip the row click, which would replace the selection
                            toggleSelectItem(itemId);
                        }, item.id, _instance);
                    }
                }
                else
                {
                    let isFirstTextColumn = (index == 0 || (index == 1 && _instance.columns[0].checkBox));

                    if ((item.isGroup || !$lib.isEmpty(item.parentId)) && isFirstTextColumn)
                    {
                        divGroupItem = cell.appendChild(document.createElement('div'));
                        divGroupItem.className = cssClassGroupItem;

                        if (!$lib.isEmpty(item.parentId))
                        {
                            group = _treeGroup[item.parentId];

                            if (getIndex(group.items, item.id) == -1)
                                group.items.push(item);

                            divGroupItem.style.marginLeft = $lib.unit(group.indent);

                            $lib.addClass(cell, cssClassGroupItem);

                            if (group.expanded === false)
                                tr.style.display = 'none';
                        }

                        if (item.isGroup)
                        {
                            _hasGroups = true;

                            if (!_treeGroup[item.id])
                            {
                                _treeGroup[item.id] = {};
                                _treeGroup[item.id].items = [];
                            }

                            _treeGroup[item.id].expanded = (group) ? group.expanded : item.groupExpanded;
                            _treeGroup[item.id].indent = (group) ? group.indent + itemIndent : itemIndent; // set group indent

                            spanGroupExpandIcon = divGroupItem.appendChild(document.createElement('span'));
                            $lib.addClass(cell, cssClassGroupHead);
                            $lib.addClass(spanGroupExpandIcon, cssClassGroupExpandIcon);

                            if (item.groupExpanded)
                                $lib.addClass(cell, _classOption.EXPANDED);

                            if (_treeGroup[item.id].items.length > 0)
                                expandItemGroup(item.id, _treeGroup[item.id].expanded); // expand group when single item is re-rendered
                        }

                        _instance.applyTemplate(divGroupItem, 'Column_' + column.id, item);
                    }
                    else
                    {
                        _instance.applyTemplate(cell, 'Column_' + column.id, item);
                    }

                    if (index === dragHandleIndex)
                        cell.insertBefore(createDragHandle(), cell.firstChild);
                }
            }

            if (item.disabled)
                disableItem(item.id);

            if (item.selected || _selectedItems[item.id])
            {
                _forceSelect = true;
                selectItem(item.id);
            }

            if (item.expanded)
                expandItem(item.id);

            bindItemEvents(tr, spanExpand, (_instance.groupExpansion == _groupExpansionOption.ITEM) ? divGroupItem : spanGroupExpandIcon, item);

            if (_instance.draggableItems && item.draggable)
                _timerIds.push(setTimeout(function () { initDraggable(item, tr) }.bind(_instance, item, tr), 0));

            _instance.events.onPostRenderItem.fire(_instance, eventArgs(item, tr, null));
        }

        function bindItemEvents(tr, spanExpand, groupExpandEl, item)
        {
            $lib.on(tr, 'click', function (itemId)
            {
                if (_cancelSelect)
                    return;

                if (_instance.rowSelection == _rowSelectionOption.SINGLE)
                    toggleSelectItem(itemId);

                _instance.events.onItemClick.fire(_instance, eventArgs(loadItem(itemId), tr, null));
            }, item.id, _instance);

            if (spanExpand) // expand item details
            {
                $lib.on(spanExpand.parentNode, 'pointerdown', _instance.cancelSelectClick);
                $lib.on(spanExpand.parentNode, 'click', toggleExpandItem, item.id, _instance);
            }

            if (groupExpandEl && item.isGroup && item.groupExpandable && _instance.groupExpansion != _groupExpansionOption.NONE) // expand item tree group
            {
                $lib.on(groupExpandEl, 'pointerdown', _instance.cancelSelectClick);
                $lib.on(groupExpandEl, 'click', expandItemGroup, [item.id, null], _instance);
            }
        }

        function initSelectable(table)
        {
            if (_instance.rowSelection == _rowSelectionOption.MULTI)
            {
                if (_selectable == null)
                {
                    _selectable = $lib.selectable($base.static.initSelectSettings(
                        {
                            dragZone: _divContent,
                            includeTags: 'tr',
                            exclude: $lib('disabled', table, 'tr'),
                            toggleClickSelect: (_instance.selectSettings.toggleClickSelect == false) ? false : true,
                            selectMode: (_instance.draggableItems) ? 2 : '',
                            onSelect: onSelect
                        }, _instance.selectSettings));

                    $lib.on(_divContent, 'pointerdown', function (e)
                    {
                        var touch = (e.pointerType === 'touch');

                        // a touch tap behaves like a ctrl-click: add to the selection, tap again to remove
                        _selectable.settings.appendClickSelect = touch || _instance.selectSettings.appendClickSelect;
                        _selectable.settings.toggleClickSelect = touch || _instance.selectSettings.toggleClickSelect !== false;
                    });
                }
                else
                {
                    _selectable.settings.exclude = $lib('disabled', table, 'tr');
                    _selectable.update();
                }
            }
        }

        function initDraggable(item, tr)
        {
            let dragHandle = tr.querySelector(':scope > td > ' + getDragHandleSelector()), 
                draggable = $lib.draggable(tr, $base.static.initDragSettings({
                    dragHandle,
                    dragGhost: createDragGhost(tr.parentNode, 'tr'),
                    autoGhostSize: false,
                    minDragY: 1,
                    dragX: false,
                    dropAcceptMode: 2,
                    droppableClass: _instance.itemDragSettings.droppableClass || _classOption.DROPPABLE,
                    dropZones: (!item.isGroup && $lib.isEmpty(item.parentId) && _itemDropZones) ? _itemDropZones : getItemDropZones(item),
                    onDragStart: itemDragStart,
                    onDragEnd: itemDragEnd,
                    onDroppable: function (args) { $lib.defer(itemDroppable.bind(_instance, args)); },
                    onDroppableLeave: itemDroppableLeave,
                    onDrop: itemDrop
                }, _instance.itemDragSettings));

            _itemDraggables.push(draggable);
        }

        function createDragGhost(container, nodeName)
        {
            var dragGhost = $lib.element(container, null, nodeName);
            dragGhost.className = _instance.cssClassDragGhost || _classOption.DRAG_GHOST;
            dragGhost.style.display = 'none';
            return dragGhost;
        }

        function detectViewportSize()
        {
            _timerIds.push(setTimeout(detect, 0));
        }

        function detect()
        {
            if (_instance.useViewportHeight)
            {
                var winSize = $lib.getWindowSize();

                _divContent.style.height = 'auto';
                var pos = $lib.getPos(_divContent),
                    availableHeight = (winSize.height - pos.top) - (_instance.viewportBottomOffset || 0);

                if ((pos.top + pos.height) > availableHeight)
                    _divContent.style.height = $lib.unit(availableHeight);
            }

            detectScrollX();
            detectScrollY();
        }

        function detectScrollX()
        {
            var overflow = $lib.styleValue(_divContent, 'overflow-x');

            $lib.removeClass(_instance.element, _classOption.SCROLLABLE_X);

            // because of a rounding bug within IE the inner width is used instead of the scrollWidth
            if ('hidden visible'.indexOf(overflow) > -1 || _divContent.firstChild.offsetWidth <= _divContent.clientWidth)
                return;

            $lib.addClass(_instance.element, _classOption.SCROLLABLE_X);

            if (!$lib.has(_divContent, 'scroll', scrollDelayed))
                $lib.on(_divContent, 'scroll', scrollDelayed);
        }

        function detectScrollY()
        {
            var overflow = $lib.styleValue(_divContent, 'overflow-y'), height, scrollHeight;

            $lib.removeClass(_instance.element, _classOption.SCROLLABLE_Y);
            _divHeader.firstChild.style.paddingRight = '';

            if (_divFilter)
                _divFilter.style.paddingRight = '';

            // because of a rounding bug within IE the inner height is used instead of the scrollHeight
            if ('hidden visible'.indexOf(overflow) > -1 || (_divContent.firstChild.offsetHeight <= _divContent.clientHeight && overflow != 'scroll'))
                return;

            $lib.addClass(_instance.element, _classOption.SCROLLABLE_Y);
            _divHeader.firstChild.style.paddingRight = $lib.unit(_scrollbarSize.width);

            if (_divFilter)
                _divFilter.style.paddingRight = _divHeader.firstChild.style.paddingRight;
        }

        function scrollDelayed()
        {
            clearTimeout(_scrollTimerId);
            _scrollTimerId = setTimeout(function () { scroll(); }, 0);
        }

        function scroll()
        {
            var scrollLeft = _divContent.scrollLeft, table = _divHeader.firstChild,
                cssClassFixedColumn = _instance.cssClassFixedColumn || _classOption.FIXED_COLUMN;

            if (_lastScrollLeft == scrollLeft)
                return;

            table.style.marginLeft = $lib.unit(scrollLeft * -1);

            if (_divFilter)
                _divFilter.firstChild.style.marginLeft = table.style.marginLeft;

            if (_instance.fixedColumns > 0)
            {
                // update fixed column css rule with correct left position
                clearTimeout(_fixedColumnUpdateTimerId);
                _fixedColumnUpdateTimerId = setTimeout(function () { $lib.setCssRule(_fixedColumnStyleSheet, null, '#' + _instance.id + ' .' + cssClassFixedColumn, 'left:' + scrollLeft + 'px;'); }, _instance.fixedColumnScrollUpdate);
            }

            _lastScrollLeft = scrollLeft;
        }

        function showPreloader()
        {
            hideChildren(_divContent);

            if (_divPreloader != null)
                _divPreloader.style.display = '';
            else if (_instance.hasTemplate('Preloader'))
            {
                _divPreloader = _divContent.appendChild(document.createElement('div'));
                _divPreloader.className = _instance.cssClassPreloader || _classOption.PRELOADER;
                _instance.applyTemplate(_divPreloader, 'Preloader');
            }
        }

        function showItemPreloader(cell)
        {
            if (_instance.hasTemplate('ItemPreloader'))
            {
                var divPreloader = cell.appendChild(document.createElement('div'));
                divPreloader.className = _instance.cssClassPreloader || _classOption.PRELOADER;
                _instance.applyTemplate(divPreloader, 'ItemPreloader');
            }
        }

        function showNoResult()
        {
            hideChildren(_divContent);

            if (_divNoResult != null)
                _divNoResult.style.display = '';
            else if (_instance.hasTemplate('NoResult'))
            {
                _divNoResult = _divContent.appendChild(document.createElement('div'));
                _divNoResult.className = _instance.cssClassNoResult || _classOption.NORESULT;
                _instance.applyTemplate(_divNoResult, 'NoResult');
            }
        }

        function hideChildren(container)
        {
            var childs = $lib.children(container);

            $lib.each(childs, function (el)
            {
                el.style.display = 'none';
            });
        }

        function selectFilter(menu, args)
        {
            var item = args.item,
                key = item.key,
                column = _instance.columns[getIndex(_instance.columns, item.radioGroupId)];

            toggleFilterView(column, item);

            if (_tooltipManager)
            {
                if (_tooltipManager.getBox())
                    _tooltipManager.getBox().hide(true);

                _tooltipManager.addTooltip(column.id + '_Filter', _instance.filterMenuLabels[key] || key);
            }
        }

        function toggleFilterView(column, item)
        {
            var value = item.value,
                isRange = (value == _filterMenuOptions.BETWEEN || value == _filterMenuOptions.NOTBETWEEN);

            if (column.filterInputType === _filterInputTypeOption.SLIDER)
            {
                var slider = $UI.store[$lib.format('{0}_FilterInput_{1}', _instance.id, column.id)],
                    curValue = slider.getValue(),
                    isArray = $lib.isArray(curValue);

                if ((isArray && !isRange) || (!isArray && isRange))
                {
                    if (isRange)
                        slider.value = curValue;
                    else
                        slider.value = curValue[1];

                    slider.range = isRange;
                    slider.render();
                }

                return;
            }

            var div = getFilterCell(column.id).firstElementChild,
                container = div.firstElementChild,
                rangeContainer = $lib(_classOption.FILTERRANGE, div, 'div', true);

            if (!rangeContainer)
                return;


            container.style.display = (isRange) ? 'none' : '';
            rangeContainer.style.display = (isRange) ? '' : 'none';
        }

        function filterCommand(button)
        {
            var columnId = button.id.replace(_instance.id + '_FilterButton_', '');
            triggerFilter(columnId);
        }

        function triggerFilter(columnId)
        {
            var column = _instance.columns[getIndex(_instance.columns, columnId)],
                selOption = column.filterMenuSelectedOption || 1,
                type = selOption,
                item;

            if (_filterMenu)
            {
                item = _filterMenu.getSelectedItem(columnId);
                type = (item) ? _filterMenuOptions[item.key] : selOption;
            }

            filter(columnId, getFilterValue(columnId), type);
        }

        function filter(columnId, value, type)
        {
            setColumnFilter(columnId, value, type);
            load();
        }

        function setColumnFilter(columnId, value, type)
        {
            if ((type != _filterMenuOptions.EMPTY && type != _filterMenuOptions.NOTEMPTY) && $lib.isEmpty(value) || ($lib.isArray(value) && $lib.isEmpty(value.join(''))))
                delete _filter[columnId];
            else
            {
                _filter[columnId] = {};
                _filter[columnId].type = _filterMenuOptions.getName(type);
                _filter[columnId].value = value;
            }
        }

        function getFilterValue(columnId)
        {
            var index = getIndex(_instance.columns, columnId),
                column = _instance.columns[index],
                cell = getFilterCell(null, index),
                columnFilter = [],
                id = $lib.format('{0}_FilterInput_{1}', _instance.id, column.id),
                idFrom = id + '_From', idTo = id + '_To',
                input, fn = 'getValue';

            if (!column.filterInputType)
            {
                input = $lib('#' + id);

                if (cell.firstChild.style.display != 'none')
                {
                    appendFilter(input.value);
                }
                else
                {
                    appendFilter($lib('#' + idFrom).value);
                    appendFilter($lib('#' + idTo).value);
                }
            }
            else
            {
                if (cell.firstChild.style.display != 'none')
                {
                    appendFilter($UI.store[id][fn]());
                }
                else
                {
                    appendFilter($UI.store[idFrom][fn]());
                    appendFilter($UI.store[idTo][fn]());
                }
            }

            return columnFilter;

            function appendFilter(value)
            {
                if (!$lib.isEmpty(value))
                    columnFilter = ($lib.isArray(value)) ? columnFilter.concat(value.slice(0)) : columnFilter.concat([value]);
            }
        }

        function setFilterValue(columnId, value)
        {
            var index = getIndex(_instance.columns, columnId),
                column = _instance.columns[index],
                cell = getFilterCell(null, index),
                id = $lib.format('{0}_FilterInput_{1}', _instance.id, column.id),
                idFrom = id + '_From', idTo = id + '_To',
                input;

            if (!column.filterInputType)
            {
                input = $lib('#' + id);

                if (cell.firstChild.style.display != 'none')
                {
                    input.value = value;
                }
                else
                {
                    $lib('#' + idFrom).value = value;
                    $lib('#' + idTo).value = value;
                }
            }
            else
            {
                if (cell.firstChild.style.display != 'none')
                {
                    setValue(id);
                }
                else
                {
                    setValue(idFrom);
                    setValue(idTo);
                }
            }

            function setValue(id)
            {
                if (column.filterInputType == _filterInputTypeOption.COMBOBOX)
                {
                    $UI.store[id].clearSelection();
                    $UI.store[id].selectedItems($lib.isArray(value) ? value : [value]);
                }
                else
                {
                    $UI.store[id].setValue(value);
                }
            }
        }

        function selectAll(spanSelectAll)
        {
            if ($lib.hasClass(spanSelectAll, _classOption.SELECTED))
            {
                $lib.removeClass(spanSelectAll, _classOption.SELECTED);
                _selectable.deselect();
            }
            else
            {
                $lib.addClass(spanSelectAll, _classOption.SELECTED);
                _selectable.select();
            }
        }

        function sort(columnId, order)
        {
            setColumnSortOrder(columnId, order);
            _instance.events.onColumnSort.fire(_instance, { columnId: columnId, order: _sort[columnId] });

            load();
        }

        function setColumnSortOrder(columnId, order)
        {
            var th = getColumnTableHeader(columnId),
                both = _classOption.SORTASC + ' ' + _classOption.SORTDESC;

            if (!$lib.isEmpty(order))
            {
                $lib.removeClass(th, both);

                if (order == _sortOrderOption.ASC)
                    $lib.addClass(th, _classOption.SORTASC);
                else if (order == _sortOrderOption.DESC)
                    $lib.addClass(th, _classOption.SORTDESC);
            }
            else
            {
                if ($lib.hasClass(th, _classOption.SORTASC))
                {
                    $lib.removeClass(th, _classOption.SORTASC);
                    $lib.addClass(th, _classOption.SORTDESC);
                }
                else if ($lib.hasClass(th, _classOption.SORTDESC))
                    $lib.removeClass(th, _classOption.SORTDESC);
                else
                    $lib.addClass(th, _classOption.SORTASC);
            }

            if (_instance.columnSorting != _columnSortingOption.MULTI)
            {
                $lib.each(_sort, function (order, key)
                {
                    if (key != columnId)
                        $lib.removeClass(getColumnTableHeader(key), both);
                });

                _sort = {};
            }

            if ($lib.hasClass(th, _classOption.SORTASC))
                _sort[columnId] = _sortOrderOption.ASC;
            else if ($lib.hasClass(th, _classOption.SORTDESC))
                _sort[columnId] = _sortOrderOption.DESC;
            else if (columnId in _sort)
                delete _sort[columnId];
        }

        function getHeader()
        {
            return $lib(_instance.cssClassHeader || _classOption.HEADER, _instance.element, 'div');
        }

        function headerDragStart(args)
        {
            args.settings.dragGhost.innerHTML = args.element.firstChild.textContent;
        }

        function headerDroppable(args)
        {
            var dropZone = args.dropZone,
                center = (args.dropZonePos.left + (dropZone.offsetWidth / 2)),
                cssLeft = _classOption.LEFT,
                cssRight = _classOption.RIGHT,
                scroll = $lib.getScrollPosition(),
                clientX = $lib.clientX($lib.event) + scroll.scrollLeft;

            $lib.removeClass(dropZone, cssLeft + ' ' + cssRight);

            if (clientX <= center)
            {
                $lib.addClass(dropZone, cssLeft);
            }
            else
            {
                $lib.addClass(dropZone, cssRight);
            }
        }

        function headerDroppableLeave(args)
        {
            $lib.removeClass(args.dropZone, _classOption.LEFT + ' ' + _classOption.RIGHT);
        }

        function headerDrop(args)
        {
            var column,
                sourceId = args.element.id.replace(_instance.id + '_h_', ''),
                targetId = args.dropZone.id.replace(_instance.id + '_h_', ''),
                sourceIndex = getIndex(_instance.columns, sourceId),
                targetIndex = getIndex(_instance.columns, targetId),
                right = $lib.hasClass(args.dropZone, _classOption.RIGHT),
                tables = $lib(null, _divHeader, 'table'),
                tr = $lib(null, _divContent, 'tr', true);

            $lib.removeClass(args.dropZone, _classOption.LEFT + ' ' + _classOption.RIGHT);

            // clear element drop position
            $lib.updateStyle(args.element.style, 'position:;left:;top:;');

            if (right)
                ++targetIndex;

            if (sourceIndex == targetIndex)
                return;

            // change header column order
            changeHeaderColumnOrder(tables[0], sourceIndex, sourceId, targetIndex, targetId, right);

            if (_instance.enableFilterRow)
            {
                // change filter row column order
                changeColumnOrder($lib(null, tables[1], 'tr', true), sourceIndex, targetIndex);
            }

            if (!_loading && tr)
            {
                // change column order (rows and colgroup)
                changeColumnOrder(tr, sourceIndex, targetIndex);
            }
            else
            {
                // rows are (re)drawn in the new order on load, but the content colgroup persists
                changeOrder($lib(null, _divContent.firstChild, 'colgroup', true), sourceIndex, targetIndex);
            }

            // remove column at source index
            column = _instance.columns.splice(sourceIndex, 1)[0];

            if (targetIndex > sourceIndex)
                --targetIndex;

            _instance.columns.splice(targetIndex, 0, column); // add column to target index
            moveDragHandles();
            _instance.events.onColumnOrderChange.fire(_instance, { sourceIndex: sourceIndex, targetIndex: targetIndex });
        }

        function headerResizeStart(args)
        {
            storeTableData(args);
        }

        function headerResizeEnd(args)
        {
            detectScrollX();
            _instance.events.onColumnResize.fire(_instance, { columnIndex: _tableData.columnIndex, element: args.element });
        }

        function headerResize(args)
        {
            let index = _tableData.columnIndex,
                width = $lib.unit(clampWidth(parseFloat(args.element.style.width), _tableData.columnLimits)),
                change, remainder = 0;

            updateColumnWidth(index, width);

            if (_instance.preserveTotalWidth && _tableData.columnDistribution.length > 0) // divide the width difference over columns
            {
                change = (_tableData.columnStartWidth - parseFloat(width)) / _tableData.columnDistribution.length;

                $lib.each(_tableData.columnDistribution, function (colData)
                {
                    let targetWidth = colData.width + change + remainder,
                        appliedWidth = clampWidth(targetWidth, colData.limits);

                    updateColumnWidth(colData.index, $lib.unit(appliedWidth));
                    remainder = targetWidth - appliedWidth;
                });
            }
            else if (!_instance.preserveTotalWidth)
            {
                change = (parseFloat(width) - _tableData.columnStartWidth);
                _instance.element.style.width = $lib.unit(_tableData.totalWidth + change);
            }
        }

        function updateColumnWidth(index, width)
        {
            // update col elements for fixed table-layout
            _tableData.header[index].style.width = _tableData.content[index].style.width = width;

            if (_tableData.filter != null)
                _tableData.filter[index].style.width = width;
        }

        function changeHeaderColumnOrder(table, sourceIndex, sourceId, targetIndex, targetId, right)
        {
            var tr = $lib(null, table, 'tr')[_depthLevels[1][sourceId] - 1],
                sourceElement = getColumnTableHeader(sourceId),
                targetElement = getColumnTableHeader(targetId);

            changeOrder($lib(null, table, 'colgroup', true), sourceIndex, targetIndex);

            if (right)
                targetElement = targetElement.nextSibling || null;

            if (targetElement)
                tr.insertBefore(sourceElement, targetElement);
            else
                tr.appendChild(sourceElement);
        }

        function changeColumnOrder(tr, sourceIndex, targetIndex)
        {
            var expandIndex = (showExpandColumn()) ? 1 : 0,
                cellCount = _instance.columns.length + expandIndex;

            changeOrder($lib(null, tr.parentNode.parentNode, 'colgroup', true), sourceIndex, targetIndex);

            while (tr)
            {
                if (tr.childNodes.length == cellCount)
                    changeOrder(tr, sourceIndex, targetIndex);

                tr = tr.nextSibling;
            }
        }

        function changeOrder(parent, sourceIndex, targetIndex)
        {
            sourceIndex = getCellIndex(sourceIndex);
            targetIndex = getCellIndex(targetIndex);

            var childNodes = parent.childNodes,
                append = (targetIndex >= childNodes.length);

            if (append)
                parent.appendChild(childNodes[sourceIndex]);
            else
                parent.insertBefore(childNodes[sourceIndex], childNodes[targetIndex]);
        }

        function createDragHandle()
        {
            var handle = document.createElement('span');
            handle.className = _instance.cssClassDragHandle || _classOption.DRAG_HANDLE;
            handle.setAttribute('aria-hidden', 'true');
            return handle;
        }

        function getDragHandleColumnIndex()
        {
            return _instance.columns.findIndex((column) => !column.checkBox && column.visible !== false);
        }

        function getDragHandleSelector()
        {
            return '.' + (_instance.cssClassDragHandle || _classOption.DRAG_HANDLE).trim().split(/\s+/).join('.');
        }

        function moveDragHandles()
        {
            if (!_instance.draggableItems || !_divContent)
                return;

            var columnIndex = getDragHandleColumnIndex();

            if (columnIndex < 0)
                return;

            var cellIndex = getCellIndex(columnIndex);

            $lib.children($lib(null, _divContent.firstChild, 'tbody', true)).forEach(function (tr)
            {
                moveDragHandle(tr, cellIndex);
            });
        }

        function moveDragHandle(tr, cellIndex)
        {
            let selector = getDragHandleSelector(),
                handle = tr.querySelector(':scope > td > ' + selector), // only a handle directly in this row's cells
                cell = tr.children[cellIndex];

            if (handle && cell && handle.parentNode !== cell)
                cell.insertBefore(handle, cell.firstChild);
        }

        function itemDragStart(args)
        {
            var tr = getTableRow(args.element),
                el = tr.cloneNode(true),
                dragGhost = args.settings.dragGhost,
                childNodes = el.childNodes,
                node = tr.firstChild;

            if (dragGhost.parentNode != tr.parentNode)
                tr.parentNode.appendChild(dragGhost);

            dragGhost.innerHTML = '';

            while (node)
            {
                var td = childNodes[0];
                td.style.width = $lib.unit(node.offsetWidth);
                dragGhost.appendChild(td);
                node = node.nextSibling;
            }

            $lib.addClass(tr, _classOption.DRAG);
        }

        function itemDragEnd(args)
        {
            $lib.removeClass(getTableRow(args.element), _classOption.DRAG);
        }

        function itemDroppable(args)
        {
            var dropZone = args.dropZone,
                center = (args.dropZonePos.top + (dropZone.offsetHeight / 2)),
                cssTop = _classOption.TOP,
                cssBottom = _classOption.BOTTOM,
                scroll = $lib.getScrollPosition(),
                clientY = $lib.clientY($lib.event) + scroll.scrollTop;

            $lib.removeClass(dropZone, cssTop + ' ' + cssBottom);

            if (clientY <= center)
            {
                $lib.addClass(dropZone, cssTop);
            }
            else
            {
                $lib.addClass(dropZone, cssBottom);
            }
        }

        function itemDroppableLeave(args)
        {
            clearDropZoneCSS(args.dropZone);
        }

        function itemDrop(args)
        {
            var itemList = _instance.itemList,
                dropZone = args.dropZone,
                tr = getTableRow(args.element),
                bottom = $lib.hasClass(dropZone, _classOption.BOTTOM),
                index = $lib.indexOf(args.settings.dropZones, tr),
                targetIndex = $lib.indexOf(args.settings.dropZones, dropZone);

            if (Math.abs(targetIndex - index) > 1 || (targetIndex > index && bottom) || (targetIndex < index && !bottom))
            {
                var nextRow = (bottom) ? dropZone.nextElementSibling : dropZone,
                    item = loadItem(tr.id.replace(_instance.id + '_', '')),
                    targetItem = loadItem(dropZone.id.replace(_instance.id + '_', '')),
                    moveDown = (targetIndex > index),
                    expanded = [],
                    items = [item];

                index = getIndex(itemList, item.id);

                if (item.isGroup)
                {
                    items = items.concat(getItemsInGroup(item.id));
                    collapseItems(items, expanded);
                }

                if (targetItem.isGroup && bottom)
                {
                    var groupItems = getItemsInGroup(targetItem.id);

                    collapseItems([targetItem].concat(groupItems), expanded);
                    targetIndex = getIndex(itemList, groupItems[groupItems.length - 1].id) + 1;
                    nextRow = (!itemList[targetIndex]) ? null : getItemRow(itemList[targetIndex].id);
                }
                else
                    targetIndex = getIndex(itemList, targetItem.id);

                if (!targetItem.isGroup && bottom)
                    ++targetIndex;

                var resultIndex = $lib.move(itemList, index, targetIndex, items.length); // move items

                // move table-rows
                $lib.each(items, function (i)
                {
                    var tr = getItemRow(i.id);
                    tr.parentNode.insertBefore(tr, nextRow);
                });

                // expand items that where expanded before the move
                $lib.each(expanded, function (id)
                {
                    expandItem(id);
                });

                updateItemDropZones((!_hasGroups) ? getItemDropZones() : null);
                _instance.events.onItemOrderChange.fire(_instance, { items: items, fromIndex: index, toIndex: targetIndex, resultIndex: resultIndex, dropZone: dropZone, nextRow: nextRow });
            }

            clearDropZoneCSS(args.dropZone);
            $lib.updateStyle(args.element.style, 'left:;top:;');

            if ($lib.isEmpty(args.element.getAttribute('style')))
                args.element.removeAttribute('style')
        }

        function updateItemDropZones(dropZones)
        {
            $lib.each(_itemDraggables, function (d)
            {
                var tr, item;

                if (!dropZones)
                {
                    tr = getTableRow(d.element),
                        item = loadItem(tr.id.replace(_instance.id + '_', ''));
                    d.settings.dropZones = getItemDropZones(item);
                }
                else
                    d.settings.dropZones = dropZones;
            });
        }

        function collapseItems(items, expanded)
        {
            if (!expanded)
                expanded = [];

            $lib.each(items, function (i)
            {
                if (i.expanded)
                {
                    expanded.push(i.id);
                    collapseItem(i.id);
                }
            });

            return expanded;
        }

        function getTableRow(el)
        {
            return (el.nodeName.toLowerCase() === 'tr') ? el : el.parentNode;
        }

        function clearDropZoneCSS(dropZone)
        {
            $lib.removeClass(dropZone, _classOption.TOP + ' ' + _classOption.BOTTOM);
        }

        function onSelect(args)
        {
            var index;

            for (index = 0; index < args.deselected.length; index++)
            {
                deselectItem(args.deselected[index].id.replace(_instance.id + '_', ''), args.event);
            }

            for (index = 0; index < args.selected.length; index++)
            {
                selectItem(args.selected[index].id.replace(_instance.id + '_', ''), args.event);
            }
        }

        function toggleSelectItem(id)
        {
            var isSelected = (_selectedItems[id] != null);

            if (_instance.rowSelection == _rowSelectionOption.MULTI)
            {
                // multi: toggle this item only, keep the rest of the selection
                if (isSelected)
                    deselectItem(id);
                else
                    selectItem(id);
            }
            else
            {
                clearSelection(); // single: clear any selection, then select the item unless it was the selected one

                if (!isSelected)
                    selectItem(id);
            }

            _forceSelect = false;
        }

        function selectItem(itemId)
        {
            if ($lib.isEmpty(itemId))
                return;

            var item = loadItem(itemId),
                el = getItemRow(itemId);

            if (!_forceSelect && item.disabled)
                return;

            _selectedItems[itemId] = item;
            item.selected = true;
            storeSelected();
            $lib.addClass(el, _classOption.SELECTED);

            _forceSelect = false;
            _instance.events.onItemSelect.fire(_instance, eventArgs(item, el, null));

            selectItemsInGroup(item);
        }

        function deselectItem(itemId)
        {
            if ($lib.isEmpty(itemId))
                return;

            var item = loadItem(itemId),
                el = getItemRow(itemId);

            delete _selectedItems[itemId];
            item.selected = false;
            storeSelected();
            $lib.removeClass(el, _classOption.SELECTED);

            _instance.events.onItemDeselect.fire(_instance, eventArgs(item, el, null));

            selectItemsInGroup(item, true);
        }

        function storeSelected()
        {
            var sel = [];
            $lib.each(_selectedItems, function (item, key)
            {
                sel.push((!$lib.isEmpty(item.value)) ? item.value : item.id);
            });

            _hidden.value = (sel.length > 0) ? sel.join(',') : '';
        }

        function clearSelection()
        {
            if (_selectable)
                _selectable.deselect();
            else if (!$lib.isEmpty(_selectedItems))
            {
                for (var id in _selectedItems)
                {
                    deselectItem(id);
                }
            }
        }

        function selectItemsInGroup(item, deselect)
        {
            if (_instance.rowSelection != _rowSelectionOption.MULTI || !item.isGroup)
                return;

            $lib.each(getItemsInGroup(item.id), function (i)
            {
                (deselect) ? deselectItem(i.id) : selectItem(i.id);
            });
        }

        function getItemsInGroup(itemId)
        {
            var parentIds = [itemId],
                items = [];

            $lib.each(_instance.itemList, function (i, index)
            {
                if ($lib.isEmpty(i.parentId))
                    return;

                if ($lib.indexOf(parentIds, i.parentId) > -1)
                {
                    if (i.isGroup)
                        parentIds.push(i.id);

                    items.push(i);
                }
            });

            return items;
        }

        function removeItem(itemId)
        {
            var tr = getItemRow(itemId),
                index = getIndex(_instance.itemList, itemId),
                item = _instance.itemList[index],
                table = _divContent.firstChild;

            if (tr)
                table.deleteRow(tr.rowIndex); // remove table record

            if (!$lib.isEmpty(item.parentId) && _treeGroup[item.parentId])
                _treeGroup[item.parentId].items.splice(getIndex(_treeGroup[item.parentId].items, item.id), 1); // remove from item group

            _instance.itemList.splice(index, 1);

            if (item.isGroup)
            {
                $lib.each(_treeGroup[item.id], function (i)
                {
                    removeItem(i.id); // remove child items in group
                });
            }

            if (_selectable)
                _selectable.update();
        }

        function toggleExpandItem(itemId)
        {
            var item = loadItem(itemId);

            if (item.expanded)
                collapseItem(item.id);
            else
                expandItem(item.id);
        }

        function expandItem(itemId)
        {
            var item = loadItem(itemId),
                tr = getItemRow(itemId),
                table = _divContent.firstChild, cell,
                trExpand,
                templateId = _instance.itemTemplateId || item.templateId,
                query = { id: itemId };

            if (item.disabled || !templateId)
                return;

            trExpand = table.insertRow(tr.rowIndex + 1);

            if (_instance.rowExpansion == _rowExpansionOption.SINGLE && !$lib.isEmpty(_expandedItemId))
                collapseItem(_expandedItemId);

            if (_instance.enableExpandColumn)
            {
                cell = trExpand.appendChild(document.createElement('td'));
                $lib.addClass(cell, _instance.cssClassExpand || _classOption.EXPAND);
            }

            cell = trExpand.appendChild(document.createElement('td'));
            cell.colSpan = _instance.columns.length;

            item.expanded = true;
            $lib.addClass(tr, 'expanded');
            _expandedItemId = itemId;

            if (_selectable)
                _selectable.settings.exclude.push(trExpand); // exclude from select list

            if (_instance.ajax.loadItem && _instance.ajax.loadItem.isDefined())
            {
                if (_ajax[1])
                    _ajax[1].abort();

                _instance.events.onPreLoadItem.fire(_instance);
                showItemPreloader(cell);

                _ajax[1] = _instance.ajaxCall('loadItem', window.JSON.stringify(query),
                    {
                        onSuccess: function (args)
                        {
                            var item = (typeof args.data === 'string') ? window.JSON.parse(args.data) : args.data;

                            $lib.removeChildren(cell);
                            _instance.applyTemplate(cell, templateId, item);
                            _instance.events.onPostLoadItem.fire(_instance, args);
                        }
                    });
            }
            else if (!$lib.isEmpty(templateId))
                _instance.applyTemplate(cell, templateId, item);

            _instance.events.onItemExpand.fire(_instance, eventArgs(item, tr, cell));
        }

        function collapseItem(itemId)
        {
            var item = loadItem(itemId),
                tr = getItemRow(itemId),
                table = _divContent.firstChild,
                templateId = _instance.itemTemplateId || item.templateId;

            if (item.disabled || !templateId)
                return;

            item.expanded = false;
            _expandedItemId = null;
            $lib.removeClass(tr, 'expanded');

            table.deleteRow(tr.rowIndex + 1);

            _instance.events.onItemCollapse.fire(_instance, eventArgs(item, tr, null));
        }

        function expandItemGroup(itemId, expand)
        {
            var display = (expand) ? '' : null;

            if (expand === false)
                display = 'none';

            _displayRows(itemId, display);
        }

        function getGroupColumns(groupId)
        {
            var columns = [],
                findColumns = function (groupId)
                {
                    $lib.each(_instance.columns, function (column)
                    {
                        if (column.columnGroupId == groupId)
                            columns.push(column);
                    });

                    $lib.each(_instance.columnGroups, function (group)
                    {
                        if (group.parentId == groupId)
                            findColumns(group.id);
                    });
                }

            findColumns(groupId);
            return columns;
        }

        function setColumnGroupDisplay(groupId, visible)
        {
            var group = _instance.columnGroups[getIndex(_instance.columnGroups, groupId)];
            group.visible = visible;
            $lib.each(getGroupColumns(groupId), function (column) { setColumnDisplay(column, visible); });
        }

        function setColumnDisplay(columnId, visible)
        {
            let column = _instance.columns[getIndex(_instance.columns, columnId)],
                cellIndex = getCellIndex(getIndex(_instance.columns, columnId)),
                cssClassHiddenColumn = _instance.cssClassHiddenColumn || _classOption.HIDDEN_COLUMN,
                toggleCssClass = (visible) ? $lib.removeClass : $lib.addClass,
                headerTable = _divHeader.firstChild, filterTable, contentTable = _divContent.firstChild,
                rows = $lib.children($lib(null, contentTable, 'tr', true).parentNode),
                handleColumnIndex = (_instance.draggableItems) ? getDragHandleColumnIndex() : -1,
                handleCellIndex = getCellIndex(handleColumnIndex);

            column.visible = visible;
            toggleCssClass($lib.children($lib(null, headerTable, 'th', true).parentNode)[cellIndex], cssClassHiddenColumn);
            toggleCssClass($lib.children($lib(null, headerTable, 'col', true).parentNode)[cellIndex], cssClassHiddenColumn);
            toggleCssClass($lib.children($lib(null, contentTable, 'col', true).parentNode)[cellIndex], cssClassHiddenColumn);

            if (_instance.enableFilterRow)
            {
                filterTable = _divFilter.firstChild,
                    toggleCssClass($lib.children($lib(null, filterTable, 'th', true).parentNode)[cellIndex], cssClassHiddenColumn);
                toggleCssClass($lib.children($lib(null, filterTable, 'col', true).parentNode)[cellIndex], cssClassHiddenColumn);
            }

            for (let index = 0; index < rows.length; ++index)
            {
                toggleCssClass($lib.children(rows[index])[cellIndex], cssClassHiddenColumn);

                if (handleColumnIndex > -1)
                    moveDragHandle(rows[index], handleCellIndex);
            };
        }

        function disableItem(itemId)
        {
            var item = loadItem(itemId);

            item.disabled = true;
            $lib.addClass(getItemRow(itemId), 'disabled');
        }

        function enableItem(itemId)
        {
            var item = loadItem(itemId);

            item.disabled = false;
            $lib.removeClass(getItemRow(itemId), 'disabled');
        }

        function getFilterCell(columnId, index)
        {
            var filterRow;

            index = (index != undefined) ? index : getIndex(_instance.columns, columnId),
                filterRow = $lib(_instance.cssClassFilterRow || _classOption.FILTERROW, _instance.element, null, true);

            return $lib.children($lib(null, filterRow, 'tr', true))[getCellIndex(index)];
        }

        function getColumnTableHeader(columnId)
        {
            return $lib($lib.format('#{0}_h_{1}', _instance.id, columnId));
        }

        function getColWidthLimits(index)
        {
            var limits = { min: 0, max: Infinity };

            $lib.each([_tableData.header, _tableData.filter, _tableData.content], function (cols)
            {
                if (cols)
                {
                    var style = getComputedStyle(cols[index]);

                    limits.min = Math.max(limits.min, parseFloat(style.minWidth) || 0);
                    limits.max = Math.min(limits.max, parseFloat(style.maxWidth) || Infinity);
                }
            });

            return limits;
        }

        function clampWidth(width, limits)
        {
            return Math.min(Math.max(width, limits.min), limits.max);
        }

        function storeTableData(args)
        {
            var columnId = args.element.id.replace(_instance.id + '_h_', ''),
                headerTables = $lib(null, _divHeader, 'table'), column, columnWidths = [],
                sizeDev = $lib.borderAndPadding(_instance.element),
                expandIndex = (showExpandColumn()) ? 1 : 0;

            // clear
            _tableData.header = _tableData.filter = _tableData.content = null;
            // store
            _tableData.columnIndex = getIndex(_instance.columns, columnId); // no expand offset needed, arrays below already exclude it
            _tableData.header = getTableCols(headerTables[0]).slice(expandIndex);
            _tableData.content = getTableCols(_divContent.firstChild).slice(expandIndex);

            if (_instance.enableFilterRow)
                _tableData.filter = (headerTables[1]) ? getTableCols(headerTables[1]).slice(expandIndex) : null;

            _tableData.columnLimits = getColWidthLimits(_tableData.columnIndex);
            _tableData.totalWidth = _instance.element.offsetWidth - sizeDev.width; // get total width
            _tableData.columnStartWidth = args.startWidth; // resize column start width

            if (_instance.preserveTotalWidth)
            {
                _tableData.columnDistribution = [];
                column = _instance.columns[_tableData.columnIndex];
            }

            $lib.each(_instance.columns, function (col, index)
            {
                var el = $lib('#' + _instance.id + '_h_' + col.id),
                    offsetWidth = el.offsetWidth;

                columnWidths[index] = offsetWidth;

                if (_instance.preserveTotalWidth && col != column && col.resizable != false && !col.checkBox && col.visible !== false)
                    _tableData.columnDistribution.push({ index: index, width: offsetWidth, limits: getColWidthLimits(index) });
            });

            $lib.each(columnWidths, function (width, index)
            {
                updateColumnWidth(index, $lib.unit(width)); // make sure that columns have the correct width when table is stretched to fit viewport
            });

            function getTableCols(table)
            {
                var colGroup = $lib(null, table, 'colgroup', true);
                return $lib(null, colGroup, 'col');
            }
        }

        function showExpandColumn()
        {
            return (_instance.enableExpandColumn && _instance.rowExpansion > _rowExpansionOption.NONE);
        }

        function getIndex(arr, id)
        {
            return $lib.indexOf(arr, function (item) { return (item.id === id.toString()) })
        }

        function getCellIndex(index)
        {
            var expandIndex = (showExpandColumn()) ? 1 : 0;

            return index + expandIndex;
        }

        function getItemRow(itemId)
        {
            return $lib('#' + getItemId(itemId));
        }

        function getItemId(id)
        {
            return _instance.id + '_' + id;
        }

        function loadItem(itemId)
        {
            if (_lastItem && _lastItem.id === itemId)
                return _lastItem;

            return _lastItem = $lib.path(_instance.itemList, 'itemList', function (item) { return (item.id === itemId) }, true).item;
        }

        function eventArgs(item, tr, td)
        {
            return { item: item, tr: tr, td: td, event: $lib.event }
        }

        function dispose()
        {
            $lib.each(_timerIds, function (v) { clearTimeout(v); });
            clearTimeout(_scrollTimerId);
            clearTimeout(_fixedColumnUpdateTimerId);

            $lib.off(window, 'resize', detectViewportSize);
            $lib.off(document, 'pointerup', enableDrag);

            if (_elementHandler)
                $lib.off(_instance.element, 'pointerdown', _elementHandler);

            $lib.each(_documentHandler, function (handlerId)
            {
                $lib.off(document, 'click', handlerId);
            });

            if (_fixedColumnStyleSheet && _fixedColumnStyleSheet.cssRules.length <= 1)
                $lib.remove(_fixedColumnStyleSheet.ownerNode);

            $lib.each(_itemDraggables, (d) =>
            {
                d.disable();
            });

            _itemDraggables = [];
            _timerIds = [];
            _documentHandler = [];
            _selectedItems = {};
            _filter = {};
            _sort = {};
            _lastItem = _filterMenu = _fixedColumnStyleSheet = _elementHandler = _selectable = _divNoResult = _divPreloader = _divContent = _divHeader = _divFilter = _expandedItemId = null;
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.Grid.prototype = Object.create($base.methods);
    componyx.UI.Grid.prototype.constructor = componyx.UI.Grid;

    /**
    * RowSelectionOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Grid.RowSelectionOption =
    {
        NONE: 0,
        SINGLE: 1,
        MULTI: 2
    }

    /**
    * RowExpansionOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Grid.RowExpansionOption =
    {
        NONE: 0,
        SINGLE: 1,
        MULTI: 2
    }

    /**
    * GroupExpansionOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Grid.GroupExpansionOption =
    {
        NONE: 0,
        ICON: 1,
        ITEM: 2
    }

    /**
    * ColumnSortingOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Grid.ColumnSortingOption =
    {
        NONE: 0,
        SINGLE: 1,
        MULTI: 2
    }

    /**
    * SortOrderOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Grid.SortOrderOption =
    {
        ASC: 0,
        DESC: 1
    }

    /**
    * FilterMenuOptions
    * @readonly
    * @enum {number}
    */
    componyx.UI.Grid.FilterMenuOptions =
    {
        EQUALTO: 1,
        NOTEQUALTO: 2,
        GREATERTHAN: 4,
        GREATERTHANOREQUALTO: 8,
        LESSTHAN: 16,
        LESSTHANOREQUALTO: 32,
        STARTSWITH: 64,
        NOTSTARTSWITH: 128,
        ENDSWITH: 256,
        NOTENDSWITH: 512,
        CONTAINS: 1024,
        NOTCONTAINS: 2048,
        BETWEEN: 4096,
        NOTBETWEEN: 8192,
        IN: 16384,
        NOTIN: 32768,
        EMPTY: 65536,
        NOTEMPTY: 131072,

        getName: function (value) { return $base.static.getKeyByValue(this, value).toLowerCase(); }
    }

    /**
    * FilterInputTypeOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Grid.FilterInputTypeOption =
    {
        TEXTBOX: 0,
        NUMERICBOX: 1,
        COMBOBOX: 2,
        DATEPICKER: 3,
        TIMEPICKER: 4,
        SLIDER: 5
    }

    /**
     * Creates an instance of the Grid Item.
     * @class
     * @memberof componyx.UI.Grid
     * @param {Object} properties The properties used to initialize the object.
     * @property {String} properties.cssClassCheckBox Gets or sets the css class of a check box cell.
     * @property {String} properties.cssClassExpand Gets or sets the css class of an expand cell.
     * @property {Boolean} properties.draggable Gets or sets a value indicating if the row is draggable.
     * @property {Boolean} properties.expandable Gets or sets a value indicating if the row is expandable and collapsible.
     * @property {Boolean} properties.expanded Gets or sets a value indicating if the row is (initially) expanded.
     * @property {Boolean} properties.isGroup Gets or sets a value indicating if the item holds a group of child-items.
     * @property {Boolean} properties.groupExpandable Gets or sets a value indicating if the group is expandable and collapsible.
     * @property {Boolean} properties.groupExpanded Gets or sets a value indicating if the group is (initially) expanded.
     * @property {Number} properties.groupIndent Gets or sets the indent value of the group in pixels.
     * @property {String} properties.parentId Gets or sets the id of the parent group-item to which this item belongs (IsGroup on parent item must be enabled).
     * @augments componyx.UI.base.static.Item
     * @see {@link componyx.UI.base.static.Item}
     */
    componyx.UI.Grid.Item = class GridItem
    {
        constructor(properties)
        {

            /** Gets or sets the css class of a check box cell.
             *  @type {String}
             */
            this.cssClassCheckBox = '';

            /** Gets or sets the css class of an expand cell.
             *  @type {String}
             */
            this.cssClassExpand = '';

            /** Gets or sets a value indicating if the row is draggable.
             *  @type {Boolean}
             */
            this.draggable = true;

            /** Gets or sets a value indicating if the row is expandable and collapsible.
             *  @type {Boolean}
             */
            this.expandable = true;

            /** Gets or sets a value indicating if the row is (initially) expanded.
             *  @type {Boolean}
             */
            this.expanded = false;

            /** Gets or sets a value indicating if the item holds a group of child-items.
             *  @type {Boolean}
             */
            this.isGroup = false;

            /** Gets or sets a value indicating if the group is expandable and collapsible.
             *  @type {Boolean}
             */
            this.groupExpandable = true;

            /** Gets or sets a value indicating if the group is (initially) expanded.
             *  @type {Boolean}
             */
            this.groupExpanded = true;

            /** Gets or sets the indent value of the group in pixels.
             *  @type {Number|null}
             */
            this.groupIndent = null;

            /** Gets or sets the id of the parent group-item to which this item belongs (IsGroup on parent item must be enabled).
             *  @type {String|null}
             */
            this.parentId = null;

            // call original base constructor logic as you requested
            $base.static.Item.call(this, properties);
        }
    };

    /**
     * Creates an instance of the Grid ColumnGroup.
     * @class
     * @memberof componyx.UI.Grid
     * @param {Object} properties The properties used to initialize the object.
     * @property {String} properties.id Gets or sets the id of the column group.
     * @property {String} properties.parentId Gets or sets the parent group id for nesting column groups.
     * @property {String} properties.headerText Gets or sets the header text of the column group.
     * @property {String} properties.cssClass Gets or sets the css class of the column group.
     * @property {String} properties.style Gets or sets the css style of the column group.
     */
    componyx.UI.Grid.ColumnGroup = class ColumnGroup
    {
        constructor(properties)
        {

            /** Gets or sets the id of the column group.
             *  @type {String|null}
             */
            this.id = null;

            /** Gets or sets the parent group id for nesting column groups.
             *  @type {String|null}
             */
            this.parentId = null;

            /** Gets or sets the header text of the column group.
             *  @type {String|null}
             */
            this.headerText = null;

            /** Gets or sets the css class of the column group.
             *  @type {String|null}
             */
            this.cssClass = null;

            /** Gets or sets the css style of the column group.
             *  @type {String|null}
             */
            this.style = null;

            $lib.clone(this, properties, true, true, true, true, false);
        }
    };

    /**
     * Creates an instance of the Grid Column.
     * @class
     * @memberof componyx.UI.Grid
     * @param {Object} properties The properties used to initialize the object.
     * @property {String} properties.id Gets or sets the id of the column.
     * @property {String} properties.columnGroupId Gets or sets the column group id.
     * @property {String} properties.headerText Gets or sets the header text of the column.
     * @property {String} properties.cssClassHeader Gets or sets the css class of the header column.
     * @property {String} properties.cssClass Gets or sets the css class of the column.
     * @property {String} properties.style Gets or sets the css style of the column header.
     * @property {String} properties.width Gets or sets the width of the column.
     * @property {Boolean} properties.resizable Gets or sets a value indicating if the column can be resized (defaults to true).
     * @property {Boolean} properties.checkBox Gets or sets a value indicating if the column is a checkbox column.
     * @property {Boolean} properties.visible Gets or sets a value indicating if the column is visible.
     * @property {Boolean} properties.disableSorting Gets or sets a value indicating if the sorting is disabled for this column.
     * @property {Boolean} properties.disableFilter Gets or sets a value indicating if the filter is disabled for this column when enableFilterRow is set to true.
     * @property {FilterMenuOptions} properties.filterMenuOptions Gets or sets one or more FilterMenuOptions options.
     * @property {FilterMenuSelectedOption} properties.filterMenuSelectedOption Gets or sets which filter-menu option is initially selected.
     * @property {FilterInputTypeOption} properties.filterInputType Gets or sets one of the FilterInputTypeOption.
     * @property {HTMLElement|HTMLElement[]|DocumentFragment|String} properties.headerTooltipTemplate Gets or sets the header tooltip template.
     * @property {HTMLElement|HTMLElement[]|DocumentFragment|String} properties.columnTemplate Gets or sets the column template. All item properties can be used in the template as interpolations via '{propertyName}'.
     * @property {HTMLElement|HTMLElement[]|DocumentFragment|String} properties.filterTemplate Gets or sets the filter template.
     * @property {HTMLElement|HTMLElement[]|DocumentFragment|String} properties.rangeFilterTemplate Gets or sets the range filter template.
     * @property {String} properties.filterButtonId Gets or sets the id of the filter Button component from which the settings are cloned.
     * @property {String} properties.filterInputId Gets or sets the id of the UI component (NumericBox, ComboBox, DatePicker, TimePicker, Slider) from which the settings are cloned.
     */
    componyx.UI.Grid.Column = class Column
    {
        constructor(properties)
        {

            /** Gets or sets the id of the column.
             *  @type {String|null}
             */
            this.id = null;

            /** Gets or sets the column group id.
             *  @type {String|null}
             */
            this.columnGroupId = null;

            /** Gets or sets the header text of the column.
             *  @type {String|null}
             */
            this.headerText = null;

            /** Gets or sets the css class of the header column.
             *  @type {String|null}
             */
            this.cssClassHeader = null;

            /** Gets or sets the css class of the column.
             *  @type {String|null}
             */
            this.cssClass = null;

            /** Gets or sets the css style of the column header.
             *  @type {String|null}
             */
            this.style = null;

            /** Gets or sets the width of the column.
             *  @type {String|null}
             */
            this.width = null;

            /** Gets or sets a value indicating if the column can be resized (defaults to true).
             *  @type {Boolean}
             */
            this.resizable = true;

            /** Gets or sets a value indicating if the column is a checkbox column.
             *  @type {Boolean}
             */
            this.checkBox = false;

            /** Gets or sets a value indicating if the column is visible.
             *  @type {Boolean}
             */
            this.visible = true;

            /** Gets or sets a value indicating if the sorting is disabled for this column.
             *  @type {Boolean}
             */
            this.disableSorting = false;

            /** Gets or sets a value indicating if the filter is disabled for this column when enableFilterRow is set to true.
             *  @type {Boolean}
             */
            this.disableFilter = false;

            /** Gets or sets one or more FilterMenuOptions options.
             *  @type {FilterMenuOptions|null}
             */
            this.filterMenuOptions = null;

            /** Gets or sets which filter-menu option is initially selected.
             *  @type {FilterMenuSelectedOption|null}
             */
            this.filterMenuSelectedOption = null;

            /** Gets or sets one of the FilterInputTypeOption.
             *  @type {FilterInputTypeOption|null}
             */
            this.filterInputType = null;

            /** Gets or sets the header tooltip template.
             *  @type {HTMLElement|HTMLElement[]|DocumentFragment|String|null}
             */
            this.headerTooltipTemplate = null;

            /** Gets or sets the column template. All item properties can be used in the template as interpolations via '{propertyName}'.
             *  @type {HTMLElement|HTMLElement[]|DocumentFragment|String|null}
             */
            this.columnTemplate = null;

            /** Gets or sets the filter template.
             *  @type {HTMLElement|HTMLElement[]|DocumentFragment|String|null}
             */
            this.filterTemplate = null;

            /** Gets or sets the range filter template.
             *  @type {HTMLElement|HTMLElement[]|DocumentFragment|String|null}
             */
            this.rangeFilterTemplate = null;

            /** Gets or sets the id of the filter Button component from which the settings are cloned.
             *  @type {String|null}
             */
            this.filterButtonId = null;

            /** Gets or sets the id of the UI component (NumericBox, ComboBox, DatePicker, TimePicker, Slider) from which the settings are cloned.
             *  @type {String|null}
             */
            this.filterInputId = null;

            $lib.clone(this, properties, true, true, true, true, false);
        }
    };

})(window);