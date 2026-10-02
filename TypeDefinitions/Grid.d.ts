declare namespace componyx
{
    namespace UI
    {
        interface Grid extends componyx.UI.base.methods { }
        /**
        * <p>Grid class.</p>
        */
        class Grid extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new Grid instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<Grid> | HTMLElement);
            ajax: componyx.UI.base.Component['ajax'] & {
                /**
                 * <p>AJAX method used to load the grid's items.</p>
                 */
                load: componyx.UI.base.AjaxMethod;

                /**
                 * <p>AJAX method used to load an item's detail data when a row is expanded.</p>
                 */
                loadItem: componyx.UI.base.AjaxMethod;
            };
            /**
             * <p>Gets or sets the css class of the header container.</p>
             */
            cssClassHeader: string;
            /**
             * <p>Gets or sets the css class of the content container.</p>
             */
            cssClassContent: string;
            /**
             * <p>Gets or sets the css class of the datapager.</p>
             */
            cssClassDataPager: string;
            /**
             * <p>Gets or sets the css class of the filter button.</p>
             */
            cssClassFilterButton: string;
            /**
             * <p>Gets or sets the css class of the filter menu.</p>
             */
            cssClassFilterMenu: string;
            /**
             * <p>Gets or sets the css class of the filter from label.</p>
             */
            cssClassFilterFrom: string;
            /**
             * <p>Gets or sets the css class of the filter to label.</p>
             */
            cssClassFilterTo: string;
            /**
             * <p>Gets or sets the css class of the filter row (default: 'filter').</p>
             */
            cssClassFilterRow: string;
            /**
             * <p>Gets or sets the css class of the filter text boxes (default: 'textbox').</p>
             */
            cssClassTextBox: string;
            /**
             * <p>Gets or sets the css class of the header label.</p>
             */
            cssClassHeaderLabel: string;
            /**
             * <p>Gets or sets the css class of the resize handle.</p>
             */
            cssClassResizeHandle: string;
            /**
             * <p>Gets or sets the css class of the drag ghost.</p>
             */
            cssClassDragGhost: string;
            /**
             * <p>Gets or sets the css class of the preloader.</p>
             */
            cssClassPreloader: string;
            /**
             * <p>Gets or sets the css class of the no result container.</p>
             */
            cssClassNoResult: string;
            /**
             * <p>Gets or sets the css class of the check box.</p>
             */
            cssClassCheckBox: string;
            /**
             * <p>Gets or sets the css class of the expand cell.</p>
             */
            cssClassExpand: string;
            /**
             * <p>Gets or sets the css class of the expand icon.</p>
             */
            cssClassExpandIcon: string;
            /**
             * <p>Gets or sets the css class of the item.</p>
             */
            cssClassItem: string;
            /**
             * <p>Gets or sets the css class of a group-item.</p>
             */
            cssClassGroupItem: string;
            /**
             * <p>Gets or sets the css class of a group-item head.</p>
             */
            cssClassGroupHead: string;
            /**
             * <p>Gets or sets the css class of a fixed column.</p>
             */
            cssClassFixedColumn: string;
            /**
             * <p>Gets or sets the css class of a hidden column.</p>
             */
            cssClassHiddenColumn: string;
            /**
             * <p>Gets or sets the default template id of an item.</p>
             */
            itemTemplateId: string | null;
            /**
             * <p>Gets or sets the indent value of an item-group in pixels (defaults to 10).</p>
             */
            groupIndent: number;
            /**
             * <p>Gets or sets the amount of fixed columns at the left side of the grid which remain visible while scrolling horizontally.</p>
             */
            fixedColumns: number;
            /**
             * <p>Gets or sets the time in milliseconds between a horizontal scrolling action and updating the position of fixed columns accordingly (defaults to 100).</p>
             */
            fixedColumnScrollUpdate: number;
            /**
             * <p>Gets or sets the bottom offset in pixels for the viewport height. Only applicable when useViewportHeight is enabled.</p>
             */
            viewportBottomOffset: number;
            /**
             * <p>Gets or sets the height of the content container.</p>
             */
            contentHeight: string;
            /**
             * <p>Gets or sets the style of the content container.</p>
             */
            contentStyle: string;
            /**
             * <p>Gets or sets a value indicating whether column headers are draggable.</p>
             */
            draggableHeaders: boolean;
            /**
             * <p>Gets or sets a value indicating whether column headers are resizable.</p>
             */
            resizableHeaders: boolean;
            /**
             * <p>Gets or sets a value indicating whether data items are draggable.</p>
             */
            draggableItems: boolean;
            /**
             * <p>Gets or sets a value indicating if the total width of the grid view is preserved when resizing a column. When enabled, resizing a column header will not change the total width of the grid, instead the change in width will be distributed over all resizable columns.</p>
             */
            preserveTotalWidth: boolean;
            /**
             * <p>Gets or sets a value indicating whether the data pager is enabled.</p>
             */
            enableDataPager: boolean;
            /**
             * <p>Gets or sets a value indicating whether the tooltip manager is enabled.</p>
             */
            enableTooltipManager: boolean;
            /**
             * <p>Gets or sets a value indicating whether the filter row is enabled.</p>
             */
            enableFilterRow: boolean;
            /**
             * <p>Gets or sets a value indicating whether the expand column is enabled.</p>
             */
            enableExpandColumn: boolean;
            /**
             * <p>Gets or sets a value indicating whether the selection should be cleared on a click outside the grid.</p>
             */
            clearSelectionOnOutsideClick: boolean;
            /**
             * <p>Gets or sets a value indicating whether the viewport height is utilized for the content container. The height calculation respects a possible bottom margin of the grid element.</p>
             */
            useViewportHeight: boolean;
            /**
             * <p>Gets or sets the column sorting option.</p>
             */
            columnSorting: componyx.UI.Grid.ColumnSortingOption;
            /**
             * <p>Gets or sets the row selection option.</p>
             */
            rowSelection: componyx.UI.Grid.RowSelectionOption;
            /**
             * <p>Gets or sets the row expansion option.</p>
             */
            rowExpansion: componyx.UI.Grid.RowExpansionOption;
            /**
             * <p>Gets or sets the item-group expansion option.</p>
             */
            groupExpansion: componyx.UI.Grid.GroupExpansionOption;
            /**
             * <p>Gets or sets friendly labels for filter menu options (EQUALTO, NOTEQUALTO, GREATERTHAN, GREATERTHANOREQUALTO, LESSTHAN, LESSTHANOREQUALTO, STARTSWITH, NOTSTARTSWITH, ENDSWITH, NOTENDSWITH, CONTAINS, NOTCONTAINS, BETWEEN, NOTBETWEEN, IN, NOTIN, EMPTY, NOTEMPTY)</p>
             */
            filterMenuLabels: {
                [key: string]: String;
            };
            /**
             * <p>Gets or sets the filter from and to labels (0: FROM, 1: TO).</p>
             */
            filterBetweenLabels: String[];
            /**
             * <p>Gets or sets the list of items.</p>
             */
            itemList: componyx.UI.Grid.Item[] | null;
            /**
             * <p>Gets or sets the column groups.</p>
             */
            columnGroups: componyx.UI.Grid.ColumnGroup[];
            /**
             * <p>Gets or sets the columns.</p>
             */
            columns: componyx.UI.Grid.Column[];
            /**
             * <p>Gets or sets the id of the filter menu.</p>
             */
            filterMenuId: string | null;
            /**
             * <p>Gets or sets the id of the datapager.</p>
             */
            dataPagerId: string | null;
            /**
             * <p>Gets or sets the id of the tooltip manager used to display tooltips.</p>
             */
            tooltipManagerId: string | null;
            /**
             * <p>Gets or sets the drag settings for the draggable headers.</p>
             */
            headerDragSettings: componyx.library.DraggableSettings;
            /**
             * <p>Gets or sets the drag settings for the draggable items.</p>
             */
            itemDragSettings: componyx.library.DraggableSettings;
            /**
             * <p>Gets or sets the resize settings for the resizable headers.</p>
             */
            headerResizeSettings: componyx.library.ResizableSettings;
            /**
             * <p>Gets or sets the select settings for the selectable items.</p>
             */
            selectSettings: componyx.library.SelectableSettings;
            /**
             * <p>Grid events</p>
             */
            events: componyx.UI.Grid.GridEvents;
            /**
             * <p>Sets the preloader template.</p>
             * @param content - <p>The content template. Pass null or empty string to remove the existing template.</p>
             */
            setPreloaderTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the item preloader template.</p>
             * @param content - <p>The content template. Pass null or empty string to remove the existing template.</p>
             */
            setItemPreloaderTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the no result template.</p>
             * @param content - <p>The content template. Pass null or empty string to remove the existing template.</p>
             */
            setNoResultTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Selects/deselects the item with the specified id.</p>
             * @param id - <p>Item id</p>
             */
            toggleSelectItem(id: string): void;
            /**
             * <p>Selects the items with the specified id.</p>
             * @param ids - <p>The list of item ids.</p>
             */
            selectItems(ids: any[]): void;
            /**
             * <p>Deselects the items with the specified id.</p>
             * @param ids - <p>The list of item ids.</p>
             */
            deselectItems(ids: any[]): void;
            /**
             * <p>Selects the item with the specified id.</p>
             * @param id - <p>Item id</p>
             */
            selectItem(id: string): void;
            /**
             * <p>Deselects the item with the specified id.</p>
             * @param id - <p>Item id</p>
             */
            deselectItem(id: string): void;
            /**
             * <p>Expands/collapses the item with the specified id.</p>
             * @param id - <p>Item id</p>
             */
            toggleExpandItem(id: string): void;
            /**
             * <p>Expands the item with the specified id.</p>
             * @param id - <p>Item id</p>
             */
            expandItem(id: string): void;
            /**
             * <p>Collapses the item with the specified id.</p>
             * @param id - <p>Item id</p>
             */
            collapseItem(id: string): void;
            /**
             * <p>Expands/collapses the item-group with the specified id.</p>
             * @param id - <p>Item id</p>
             */
            toggleExpandItemGroup(id: string): void;
            /**
             * <p>Expands the item-group with the specified id.</p>
             * @param id - <p>Item id</p>
             */
            expandItemGroup(id: string): void;
            /**
             * <p>Collapses the item-group with the specified id.</p>
             * @param id - <p>Item id</p>
             */
            collapseItemGroup(id: string): void;
            /**
             * <p>Enables the item with the specified id.</p>
             * @param id - <p>Item id</p>
             */
            enableItem(id: string): void;
            /**
             * <p>Disables the item with the specified id.</p>
             * @param id - <p>Item id</p>
             */
            disableItem(id: string): void;
            /**
             * <p>Returns the grid column group index with the specified id.</p>
             * @param id - <p>The column id.</p>
             */
            getColumnGroupIndex(id: string): number;
            /**
             * <p>Returns the grid column group with the specified id.</p>
             * @param id - <p>The column id.</p>
             */
            getColumnGroup(id: string): componyx.UI.Grid.ColumnGroup;
            /**
             * <p>Removes a column group header from the grid.</p>
             * @param id - <p>The id of the column group.</p>
             */
            removeColumnGroup(id: string): void;
            /**
             * <p>Returns the grid column index with the specified id.</p>
             * @param id - <p>The column id.</p>
             */
            getColumnIndex(id: string): number;
            /**
             * <p>Returns the grid column with the specified id.</p>
             * @param id - <p>The column id.</p>
             */
            getColumn(id: string): componyx.UI.Grid.Column;
            /**
             * <p>Removes a column from the grid.</p>
             * @param id - <p>The id of the column.</p>
             */
            removeColumn(id: string): void;
            /**
             * <p>Shows a columnGroup in the grid.</p>
             * @param id - <p>The id of the columnGroup.</p>
             */
            showColumnGroup(id: string): void;
            /**
             * <p>Hides a columnGroup in the grid.</p>
             * @param id - <p>The id of the columnGroup.</p>
             */
            hideColumnGroup(id: string): void;
            /**
             * <p>Shows a column in the grid.</p>
             * @param id - <p>The id of the column.</p>
             */
            showColumn(id: string): void;
            /**
             * <p>Hides a column in the grid.</p>
             * @param id - <p>The id of the column.</p>
             */
            hideColumn(id: string): void;
            /**
             * <p>Returns the selectable object which enables grid table elements to be selectable.</p>
             */
            selectable(): any;
            /**
             * <p>Disables selection on elements for the current click event. Selection is automatically re-enabled when the current event bubbles to the document click.</p>
             */
            cancelSelectClick(): void;
            /**
             * <p>Filters the grid.</p>
             * @param columns - <p>Plain Object with column id as key and a Plain Object as value.
             * The value Object properties:
             * value (String): The filter value.
             * [type] (FilterMenuOptions): One or more of the options.
             * [updateInput] (Boolean): Value indicating if the corresponding filter input value should be updated (default true).</p>
             * @param [autoLoad] - <p>Defines if the grid should reload data.</p>
             * @param [clear] - <p>Defines if the current selection should be cleared.</p>
             */
            filter(columns: any, autoLoad?: boolean, clear?: boolean): void;
            /**
             * <p>Sorts the grid.</p>
             * @param columns - <p>Object with column id as key and one of the options from componyx.UI.Grid.SortOrderOption as value.</p>
             * @param [autoLoad] - <p>Defines if the grid should reload data.</p>
             * @param [clear] - <p>Defines if the current selection should be cleared.</p>
             */
            sort(columns: any, autoLoad?: boolean, clear?: boolean): void;
            /**
             * <p>Triggers a data load.</p>
             * @param [clear] - <p>Defines if the current selection should be cleared.</p>
             * @param [pageIndex] - <p>Defines which page index to load.</p>
             */
            load(clear?: boolean, pageIndex?: number): void;
            /**
             * <p>Returns the grid item with the specified id.</p>
             * @param id - <p>The item id.</p>
             */
            getItem(id: string): componyx.UI.Grid.Item;
            /**
             * <p>Removes the grid item with the specified id.</p>
             * @param id - <p>The item id.</p>
             */
            removeItem(id: string): void;
            /**
             * <p>Renders the specified item by creating a new table record or overwriting the existing table record in the grid.
             * The item must exist in the item list and the item's position in the item group will equal the item's position within the item list.</p>
             * @param item - <p>The item to render.</p>
             */
            renderItem(item: componyx.UI.Grid.Item): void;
            /**
             * <p>Renders the component.</p>
             */
            render(): void;
            /**
             * <p>Handles the post render procedure.</p>
             */
            postRender(): void;
            /**
             * <p>Destroys the component.</p>
             */
            destroy(): void;
        }
        namespace Grid
        {
            /**
             * @property onItemClick - <p>Event which fires on an item click.</p>
             * @property onItemSelect - <p>Event which fires on an item select.</p>
             * @property onItemDeselect - <p>Event which fires on an item deselect.</p>
             * @property onItemExpand - <p>Event which fires on an item expand.</p>
             * @property onItemCollapse - <p>Event which fires on an item collapse.</p>
             * @property onItemGroupExpand - <p>Event which fires on an item-group expand.</p>
             * @property onItemGroupCollapse - <p>Event which fires on an item-group collapse.</p>
             * @property onPreRenderItem - <p>Event which fires when an item is rendered.</p>
             * @property onPostRenderItem - <p>Event which fires when an item is rendered.</p>
             * @property onPreLoadItemList - <p>Event which fires before the item-list data is loaded.</p>
             * @property onPostLoadItemList - <p>Event which fires when the item-list data is loaded.</p>
             * @property onPostRenderItemList - <p>Event which fires when the item-list is rendered.</p>
             * @property onPreLoadItem - <p>Event which fires before the item data is loaded.</p>
             * @property onPostLoadItem - <p>Event which fires when the item data is loaded.</p>
             * @property onColumnOrderChange - <p>Event which fires when the column order is changed.</p>
             * @property onColumnResize - <p>Event which fires when a column is resized.</p>
             * @property onColumnSort - <p>Event which fires when the list is sorted.</p>
             * @property onItemOrderChange - <p>Event which fires when the item order is changed.</p>
             */
            class GridEvents extends componyx.UI.base.Events<componyx.UI.Grid>
            {
                constructor();
                /**
                 * <p>Event which fires on an item click.</p>
                */
                onItemClick: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridItemEventArgs>;
                /**
                 * <p>Event which fires on an item select.</p>
                */
                onItemSelect: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridItemEventArgs>;
                /**
                 * <p>Event which fires on an item deselect.</p>
                */
                onItemDeselect: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridItemEventArgs>;
                /**
                 * <p>Event which fires on an item expand.</p>
                */
                onItemExpand: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridItemEventArgs>;
                /**
                 * <p>Event which fires on an item collapse.</p>
                */
                onItemCollapse: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridItemEventArgs>;
                /**
                 * <p>Event which fires on an item-group expand.</p>
                */
                onItemGroupExpand: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridItemEventArgs>;
                /**
                 * <p>Event which fires on an item-group collapse.</p>
                */
                onItemGroupCollapse: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridItemEventArgs>;
                /**
                 * <p>Event which fires when an item is rendered.</p>
                */
                onPreRenderItem: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridItemEventArgs>;
                /**
                 * <p>Event which fires when an item is rendered.</p>
                */
                onPostRenderItem: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridItemEventArgs>;
                /**
                 * <p>Event which fires before the item-list data is loaded.</p>
                */
                onPreLoadItemList: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridQueryEventArgs>;
                /**
                 * <p>Event which fires when the item-list data is loaded.</p>
                */
                onPostLoadItemList: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridAjaxEventArgs | undefined>;
                /**
                 * <p>Event which fires when the item-list is rendered.</p>
                */
                onPostRenderItemList: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridAjaxEventArgs | undefined>;
                /**
                 * <p>Event which fires before the item data is loaded.</p>
                */
                onPreLoadItem: componyx.UI.base.Event<componyx.UI.Grid, undefined>;
                /**
                 * <p>Event which fires when the item data is loaded.</p>
                */
                onPostLoadItem: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridAjaxEventArgs>;
                /**
                 * <p>Event which fires when the column order is changed.</p>
                */
                onColumnOrderChange: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridColumnOrderEventArgs>;
                /**
                 * <p>Event which fires when a column is resized.</p>
                */
                onColumnResize: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridColumnResizeEventArgs>;
                /**
                 * <p>Event which fires when the list is sorted.</p>
                */
                onColumnSort: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridColumnSortEventArgs>;
                /**
                 * <p>Event which fires when the item order is changed.</p>
                */
                onItemOrderChange: componyx.UI.base.Event<componyx.UI.Grid, componyx.UI.Grid.GridItemOrderEventArgs>;
            }
            /**
             * <p>Grid item event arguments.</p>
             */
            type GridItemEventArgs = {
                /** <p>The grid item.</p> */
                item: componyx.UI.Grid.Item;
                /** <p>The table row of the item.</p> */
                tr: HTMLTableRowElement;
                /** <p>The group-head cell (item-group expand/collapse) or the expand content cell (item expand), otherwise null.</p> */
                td: HTMLTableCellElement | null;
                /** <p>The original event object.</p> */
                event: Event;
            };
            /**
             * <p>Grid load query event arguments.</p>
             */
            type GridQueryEventArgs = {
                /** <p>The sort order per column id.</p> */
                sortOrder: { [columnId: string]: componyx.UI.Grid.SortOrderOption };
                /** <p>The active filter.</p> */
                filter: object;
                /** <p>The page index (1-based).</p> */
                pageIndex: number;
            };
            /**
             * <p>Grid ajax result arguments. For the item-list events these are undefined when no ajax load method is defined.</p>
             */
            type GridAjaxEventArgs = {
                /** <p>The response data.</p> */
                data: string | object;
            };
            /**
             * <p>Grid column sort event arguments.</p>
             */
            type GridColumnSortEventArgs = {
                /** <p>The column id.</p> */
                columnId: string;
                /** <p>The new sort order, undefined when sorting was removed.</p> */
                order: componyx.UI.Grid.SortOrderOption | undefined;
            };
            /**
             * <p>Grid column order event arguments.</p>
             */
            type GridColumnOrderEventArgs = {
                /** <p>The original column index.</p> */
                sourceIndex: number;
                /** <p>The new column index.</p> */
                targetIndex: number;
            };
            /**
             * <p>Grid column resize event arguments.</p>
             */
            type GridColumnResizeEventArgs = {
                /** <p>The column index.</p> */
                columnIndex: number;
                /** <p>The resized header element.</p> */
                element: HTMLElement;
            };
            /**
             * <p>Grid item order event arguments.</p>
             */
            type GridItemOrderEventArgs = {
                /** <p>The moved items (a group item includes its child items).</p> */
                items: componyx.UI.Grid.Item[];
                /** <p>The original item index.</p> */
                fromIndex: number;
                /** <p>The target item index.</p> */
                toIndex: number;
                /** <p>The resulting index after the move.</p> */
                resultIndex: number;
                /** <p>The drop zone (table row) the items were dropped on.</p> */
                dropZone: HTMLElement;
                /** <p>The row before which the items were inserted, null when appended at the end.</p> */
                nextRow: HTMLElement | null;
            };
            /**
             * <p>RowSelectionOption</p>
             */
            enum RowSelectionOption
            {
                NONE = 0,
                SINGLE = 1,
                MULTI = 2
            }
            /**
             * <p>RowExpansionOption</p>
             */
            enum RowExpansionOption
            {
                NONE = 0,
                SINGLE = 1,
                MULTI = 2
            }
            /**
             * <p>GroupExpansionOption</p>
             */
            enum GroupExpansionOption
            {
                NONE = 0,
                ICON = 1,
                ITEM = 2
            }
            /**
             * <p>ColumnSortingOption</p>
             */
            enum ColumnSortingOption
            {
                NONE = 0,
                SINGLE = 1,
                MULTI = 2
            }
            /**
             * <p>SortOrderOption</p>
             */
            enum SortOrderOption
            {
                ASC = 0,
                DESC = 1
            }
            /**
             * <p>FilterMenuOptions</p>
             */
            enum FilterMenuOptions
            {
                EQUALTO = 1,
                NOTEQUALTO = 2,
                GREATERTHAN = 4,
                GREATERTHANOREQUALTO = 8,
                LESSTHAN = 16,
                LESSTHANOREQUALTO = 32,
                STARTSWITH = 64,
                NOTSTARTSWITH = 128,
                ENDSWITH = 256,
                NOTENDSWITH = 512,
                CONTAINS = 1024,
                NOTCONTAINS = 2048,
                BETWEEN = 4096,
                NOTBETWEEN = 8192,
                IN = 16384,
                NOTIN = 32768,
                EMPTY = 65536,
                NOTEMPTY = 131072
            }
            namespace FilterMenuOptions
            {
                /**
                 * <p>Gets the lowercase name of the option value.</p>
                 */
                function getName(value: componyx.UI.Grid.FilterMenuOptions): string;
            }
            /**
             * <p>FilterInputTypeOption</p>
             */
            enum FilterInputTypeOption
            {
                TEXTBOX = 0,
                NUMERICBOX = 1,
                COMBOBOX = 2,
                DATEPICKER = 3,
                TIMEPICKER = 4,
                SLIDER = 5
            }
            /**
             * <p>Creates an instance of the Grid Item.</p>
             * @property cssClassCheckBox - <p>Gets or sets the css class of a check box cell.</p>
             * @property cssClassExpand - <p>Gets or sets the css class of an expand cell.</p>
             * @property draggable - <p>Gets or sets a value indicating if the row is draggable.</p>
             * @property expandable - <p>Gets or sets a value indicating if the row is expandable and collapsible.</p>
             * @property expanded - <p>Gets or sets a value indicating if the row is (initially) expanded.</p>
             * @property isGroup - <p>Gets or sets a value indicating if the item holds a group of child-items.</p>
             * @property groupExpandable - <p>Gets or sets a value indicating if the group is expandable and collapsible.</p>
             * @property groupExpanded - <p>Gets or sets a value indicating if the group is (initially) expanded.</p>
             * @property groupIndent - <p>Gets or sets the indent value of the group in pixels.</p>
             * @property parentId - <p>Gets or sets the id of the parent group-item to which this item belongs (IsGroup on parent item must be enabled).</p>
             * @param properties - <p>The properties used to initialize the object.</p>
             */
            class Item extends componyx.UI.base.static.Item
            {
                constructor(properties: any);
                /**
                 * <p>Gets or sets the css class of a check box cell.</p>
                */
                cssClassCheckBox: string;
                /**
                 * <p>Gets or sets the css class of an expand cell.</p>
                */
                cssClassExpand: string;
                /**
                 * <p>Gets or sets a value indicating if the row is draggable.</p>
                */
                draggable: boolean;
                /**
                 * <p>Gets or sets a value indicating if the row is expandable and collapsible.</p>
                */
                expandable: boolean;
                /**
                 * <p>Gets or sets a value indicating if the row is (initially) expanded.</p>
                */
                expanded: boolean;
                /**
                 * <p>Gets or sets a value indicating if the item holds a group of child-items.</p>
                */
                isGroup: boolean;
                /**
                 * <p>Gets or sets a value indicating if the group is expandable and collapsible.</p>
                */
                groupExpandable: boolean;
                /**
                 * <p>Gets or sets a value indicating if the group is (initially) expanded.</p>
                */
                groupExpanded: boolean;
                /**
                 * <p>Gets or sets the indent value of the group in pixels.</p>
                */
                groupIndent: number;
                /**
                 * <p>Gets or sets the id of the parent group-item to which this item belongs (IsGroup on parent item must be enabled).</p>
                */
                parentId: string;
            }
            /**
             * <p>Creates an instance of the Grid ColumnGroup.</p>
             * @property id - <p>Gets or sets the id of the column group.</p>
             * @property parentId - <p>Gets or sets the parent group id for nesting column groups.</p>
             * @property headerText - <p>Gets or sets the header text of the column group.</p>
             * @property cssClass - <p>Gets or sets the css class of the column group.</p>
             * @property style - <p>Gets or sets the css style of the column group.</p>
             * @param properties - <p>The properties used to initialize the object.</p>
             */
            class ColumnGroup
            {
                constructor(properties: any);
                /**
                 * <p>Gets or sets the id of the column group.</p>
                */
                id: string;
                /**
                 * <p>Gets or sets the parent group id for nesting column groups.</p>
                */
                parentId: string;
                /**
                 * <p>Gets or sets the header text of the column group.</p>
                */
                headerText: string;
                /**
                 * <p>Gets or sets the css class of the column group.</p>
                */
                cssClass: string;
                /**
                 * <p>Gets or sets the css style of the column group.</p>
                */
                style: string;
            }
            /**
             * <p>Creates an instance of the Grid Column.</p>
             * @property id - <p>Gets or sets the id of the column.</p>
             * @property columnGroupId - <p>Gets or sets the column group id.</p>
             * @property headerText - <p>Gets or sets the header text of the column.</p>
             * @property cssClassHeader - <p>Gets or sets the css class of the header column.</p>
             * @property cssClass - <p>Gets or sets the css class of the column.</p>
             * @property style - <p>Gets or sets the css style of the column header.</p>
             * @property width - <p>Gets or sets the width of the column.</p>
             * @property resizable - <p>Gets or sets a value indicating if the column can be resized (defaults to true).</p>
             * @property checkBox - <p>Gets or sets a value indicating if the column is a checkbox column.</p>
             * @property visible - <p>Gets or sets a value indicating if the column is visible.</p>
             * @property disableFilter - <p>Gets or sets a value indicating if the filter is disabled for this column when enableFilterRow is set to true.</p>
             * @property filterMenuOptions - <p>Gets or sets one or more FilterMenuOptions options.</p>
             * @property filterMenuSelectedOption - <p>Gets or sets which filter-menu option is initially selected.</p>
             * @property filterInputType - <p>Gets or sets one of the FilterInputTypeOption.</p>
             * @property headerTooltipTemplate - <p>Gets or sets the header tooltip template.</p>
             * @property columnTemplate - <p>Gets or sets the column template. All item properties can be used in the template as interpolations via '{propertyName}'.</p>
             * @property filterTemplate - <p>Gets or sets the filter template.</p>
             * @property rangeFilterTemplate - <p>Gets or sets the range filter template.</p>
             * @property filterButtonId - <p>Gets or sets the id of the filter Button component from which the settings are cloned.</p>
             * @property filterInputId - <p>Gets or sets the id of the UI component (NumericBox, ComboBox, DatePicker, TimePicker, Slider) from which the settings are cloned.</p>
             * @param properties - <p>The properties used to initialize the object.</p>
             */
            class Column
            {
                constructor(properties: any);
                /**
                 * <p>Gets or sets the id of the column.</p>
                */
                id: string;
                /**
                 * <p>Gets or sets the column group id.</p>
                */
                columnGroupId: string;
                /**
                 * <p>Gets or sets the header text of the column.</p>
                */
                headerText: string;
                /**
                 * <p>Gets or sets the css class of the header column.</p>
                */
                cssClassHeader: string;
                /**
                 * <p>Gets or sets the css class of the column.</p>
                */
                cssClass: string;
                /**
                 * <p>Gets or sets the css style of the column header.</p>
                */
                style: string;
                /**
                 * <p>Gets or sets the width of the column.</p>
                */
                width: string;
                /**
                 * <p>Gets or sets a value indicating if the column can be resized (defaults to true).</p>
                */
                resizable: boolean;
                /**
                 * <p>Gets or sets a value indicating if the column is a checkbox column.</p>
                */
                checkBox: boolean;
                /**
                 * <p>Gets or sets a value indicating if the column is visible.</p>
                */
                visible: boolean;
                /**
                 * <p>Gets or sets a value indicating if the sorting is disabled for this column.</p>
                */
                disableSorting: boolean;
                /**
                 * <p>Gets or sets a value indicating if the filter is disabled for this column when enableFilterRow is set to true.</p>
                */
                disableFilter: boolean;
                /**
                 * <p>Gets or sets one or more FilterMenuOptions options.</p>
                */
                filterMenuOptions: FilterMenuOptions;
                /**
                 * <p>Gets or sets which filter-menu option is initially selected.</p>
                */
                filterMenuSelectedOption: FilterMenuOptions | null;
                /**
                 * <p>Gets or sets one of the FilterInputTypeOption.</p>
                */
                filterInputType: FilterInputTypeOption;
                /**
                 * <p>Gets or sets the header tooltip template.</p>
                */
                headerTooltipTemplate: HTMLElement | HTMLElement[] | DocumentFragment | string;
                /**
                 * <p>Gets or sets the column template. All item properties can be used in the template as interpolations via '{propertyName}'.</p>
                */
                columnTemplate: HTMLElement | HTMLElement[] | DocumentFragment | string;
                /**
                 * <p>Gets or sets the filter template.</p>
                */
                filterTemplate: HTMLElement | HTMLElement[] | DocumentFragment | string;
                /**
                 * <p>Gets or sets the range filter template.</p>
                */
                rangeFilterTemplate: HTMLElement | HTMLElement[] | DocumentFragment | string;
                /**
                 * <p>Gets or sets the id of the filter Button component from which the settings are cloned.</p>
                */
                filterButtonId: string;
                /**
                 * <p>Gets or sets the id of the UI component (NumericBox, ComboBox, DatePicker, TimePicker, Slider) from which the settings are cloned.</p>
                */
                filterInputId: string;
            }
        }

    }
}