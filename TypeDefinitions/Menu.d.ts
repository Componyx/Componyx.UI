declare namespace componyx
{
    namespace UI
    {
        /**
         * <p>Namespace for menu modules.</p>
         */
        namespace menu_modules
        {
            /**
             * <p>Promise that resolves when all menu modules are loaded asynchronously.</p>
             */
            var loaded: Promise<void>;
        }
        interface Menu extends componyx.UI.base.methods { }
        /**
         * <p>Menu class.</p>
         */
        class Menu extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new Menu instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<Menu> | HTMLElement);
            ajax: componyx.UI.base.Component['ajax'] & {
                /**
                 * <p>AJAX method used to load items on demand.</p>
                 */
                load: componyx.UI.base.AjaxMethod;
            };
            /**
             * <p>Gets or sets the default css class of an item group.</p>
             */
            cssClassItemGroup: string;
            /**
             * <p>Gets or sets the css class of the root item group.</p>
             */
            cssClassItemGroupRoot: string;
            /**
             * <p>Gets or sets the css class of the root item group when horizontalRoot is true.</p>
             */
            cssClassItemGroupHorizontalRoot: string;
            /**
             * <p>Gets or sets the css class of the root item group when visibleRoot is true.</p>
             */
            cssClassItemGroupVisibleRoot: string;
            /**
             * <p>Gets or sets the css class of the root item group when visibleRoot is false.</p>
             */
            cssClassItemGroupHiddenRoot: string;
            /**
             * <p>Gets or sets the default css class of a subgroup.</p>
             */
            cssClassSubGroup: string;
            /**
             * <p>Gets or sets the default css class of an item.</p>
             */
            cssClassItem: string;
            /**
             * <p>Gets or sets the default css class of the item icon.</p>
             */
            cssClassItemIcon: string;
            /**
             * <p>Gets or sets the css class of a childless item.</p>
             */
            cssClassItemChildless: string;
            /**
             * <p>Gets or sets the text label of the main category.</p>
             */
            mainCategoryLabel: string;
            /**
             * <p>Gets or sets the default template id of an item.</p>
             */
            itemTemplateId: string | null;
            /**
             * <p>Gets or sets the css style of the item group.</p>
             */
            itemGroupStyle: string;
            /**
             * <p>Gets or sets a value indicating whether the root level is visible.</p>
             */
            visibleRoot: boolean;
            /**
             * <p>Gets or sets a value indicating whether the root level menu items are horizontally rendered.</p>
             */
            horizontalRoot: boolean;
            /**
             * <p>Gets or sets a value indicating if we can move inside the menu with the tab key or if the tab key moves to the next focusable element outside of the menu.</p>
             */
            tabNavigation: boolean;
            /**
             * <p>Gets or sets a value indicating if child-items are rendered ahead (default) when available or rendered when the parent-item expands.</p>
             */
            renderOnExpand: boolean;
            /**
             * <p>Gets or sets a value indicating if the item can be expanded/collapsed (true) or is always in expanded state (false). Option has effect only when the corresponding item-group is statically positioned.</p>
             */
            expandable: boolean;
            /**
             * <p>Gets or sets a value indicating if one (true) or more (false) items per group can expanded simultaneously. Option has effect only when the corresponding item-group is statically positioned.</p>
             */
            singleExpand: boolean;
            /**
             * <p>Gets or sets a value indicating if a selectable item with child-items is expanded when selected.</p>
             */
            expandOnSelect: boolean;
            /**
             * <p>Gets or sets a value indicating if all items are collapsed when an item is selected. Option has effect only when the corresponding item-group is not statically positioned.</p>
             */
            collapseAllOnSelect: boolean;
            /**
             * <p>Gets or sets a value indicating if an item is expanded on a pointerenter event, click-event or on a click-event for the root level and on a pointerenter event for deeper levels. Option has effect only when the corresponding item-group is not statically positioned.</p>
             */
            expandOnClick: componyx.UI.Menu.ExpandOnClickOption;
            /**
             * <p>Gets or sets the default expand direction of a root menu item.</p>
             */
            rootExpandDirection: componyx.UI.Menu.ExpandDirectionOption | null;
            /**
             * <p>Gets or sets the default expand direction of a menu item.</p>
             */
            expandDirection: componyx.UI.Menu.ExpandDirectionOption | null;
            /**
             * <p>Gets or sets a value indicating how items are collapsed when a new item is expanded.</p>
             */
            collapseType: componyx.UI.Menu.CollapseTypeOption;
            /**
             * <p>Gets or sets a value indicating how items are collapsed when all items are collapsed through a click outside the menu boundaries.</p>
             */
            collapseAllType: componyx.UI.Menu.CollapseTypeOption;
            /**
             * <p>Gets or sets the delay in milliseconds before expanding a menu-item through a pointer-enter/leave event.</p>
             */
            expandDelay: number;
            /**
             * <p>Gets or sets the delay in milliseconds before collapsing all menu-items.</p>
             */
            collapseDelay: number;
            /**
             * <p>Gets or sets the id of the base item button.</p>
             */
            buttonId: string | null;
            /**
             * <p>Gets or sets the id of the base item-group box for the root level container.</p>
             */
            rootItemGroupBoxId: string | null;
            /**
             * <p>Gets or sets the id of the base item-group box.</p>
             */
            itemGroupBoxId: string | null;
            /**
             * <p>Gets or sets the list of items.</p>
             */
            itemList: componyx.UI.Menu.Item[];
            /**
             * <p>Menu events</p>
             */
            events: componyx.UI.Menu.MenuEvents;
            /**
             * <p>Expands the menu with the given item id(s). Animations are disabled when multiple item id's are provided.</p>
             * @param [id] - <p>The item identifier(s). The root level is expanded if the item id is not specified.</p>
             * @param [expanderElement] - <p>The element to which the expand is positioned when the expanding item-group is at root-level and not static positioned. The mouse cursor position is used when no expander element is specified for the previous mentioned scenario.</p>
             * @param [toggle] - <p>A value indicating if the item must collapse if it is already expanded.</p>
             * @param [instant = false] - <p>A value indicating if the item must be expanded (or collapsed) instantly (without animation). The option has effect only when a single item-id is provided.</p>
             */
            expand(id?: string | String[], expanderElement?: HTMLElement, toggle?: boolean, instant?: boolean): void;
            /**
             * <p>Collapses the menu with the given item id(s). Animations are disabled when multiple item id's are provided.</p>
             * @param [id] - <p>The item identifier(s). The root level is expanded if the item id is not specified.</p>
             * @param [instant = false] - <p>A value indicating if the item must be collapsed instantly (without animation). The option has effect only when a single item-id is provided.</p>
             */
            collapse(id?: string | String[], instant?: boolean): void;
            /**
             * <p>Cancels the current expand action.</p>
             */
            cancelExpand(): void;
            /**
             * <p>Shows the item category.</p>
             * @param id - <p>The item identifier.</p>
             * @param [previous = false] - <p>A value indicating that this category is previous to the current visible category.</p>
             * @param [instant = false] - <p>A value indicating if the category must be shown instantly (without animation).</p>
             */
            showCategory(id: string, previous?: string, instant?: boolean): void;
            /**
             * <p>Loads the item with the specified id.</p>
             * @param id - <p>The item identifier.</p>
             * @returns <p>The Path object offers methods to navigate in any direction from a specific item within the tree.</p>
             */
            loadItem(id: string): componyx.library.Path;
            /**
             * <p>Selects the item.</p>
             * @param id - <p>The item identifier.</p>
             */
            selectItem(id: string): void;
            /**
             * <p>Deselects the current selected item or the item with the specified id.</p>
             * @param [id] - <p>The item identifier.</p>
             */
            deselectItem(id?: string): void;
            /**
             * <p>Enables the item.</p>
             * @param id - <p>The item identifier.</p>
             */
            enableItem(id: string): void;
            /**
             * <p>Disables the item.</p>
             * @param id - <p>The item identifier.</p>
             * @param [keepSelected = false] - <p>A value indicating if the item must remain selected.</p>
             */
            disableItem(id: string, keepSelected?: boolean): void;
            /**
             * <p>Gets the identifier of the active category.</p>
             * @returns <p>The id of the active category.</p>
             */
            getActiveCategoryId(): string;
            /**
             * <p>Gets the identifier of the selected item or the identifier of the selected item within the specified radio group.</p>
             * @param [radioGroupId] - <p>The id of the radio group.</p>
             * @returns <p>The selected item id.</p>
             */
            getSelectedItemId(radioGroupId?: string): string;
            /**
             * <p>Gets the selected item or the selected item within the specified radio group.</p>
             * @param [radioGroupId] - <p>The id of the radio group.</p>
             * @returns <p>The selected item.</p>
             */
            getSelectedItem(radioGroupId?: string): componyx.UI.Menu.Item;
            /**
             * <p>Gets the expanded items.</p>
             * @returns <p>A list of expanded items.</p>
             */
            getExpandedItems(): componyx.UI.Menu.Item[];
            /**
             * <p>Collapses all expanded items with the delay configured through the collapseDelay property.</p>
             * @param [instant = false] - <p>A value indicating if all items must be collapsed instantly (without animations).</p>
             */
            collapseAllDelayed(instant?: boolean): void;
            /**
             * <p>Collapses all expanded items.</p>
             * @param [instant = false] - <p>A value indicating if all items must be collapsed instantly (without animations).</p>
             */
            collapseAll(instant?: boolean): void;
            /**
             * <p>Gets the root item-group box or the item-group box for the specified item id.</p>
             * @param [id] - <p>The item identifier.</p>
             * @returns <p>The box component.</p>
             */
            getItemGroupBox(id?: string): componyx.UI.Box;
            /**
             * <p>Removes the item with the specified id.</p>
             * @param id - <p>The item identifier.</p>
             */
            removeItem(id: string): void;
            /**
             * <p>Renders the specified item by creating a new element or overwriting the existing element.
             * The item must exist in the item list and the item's position in the item group will equal the item's position within the item list.</p>
             * @param item - <p>The item to render.</p>
             */
            renderItem(item: componyx.UI.Menu.Item): void;
            /**
             * <p>Shows the component.</p>
             */
            show(): void;
            /**
             * <p>Hides the component.</p>
             * @param [instant = false] - <p>A value indicating if all items must be collapsed instantly (without animations). By default the root item-group has no show/hide animations set. If a hide animation was set manually and instant hiding on the root item-group is required, disable the hide animation in advance.</p>
             */
            hide(instant?: boolean): void;
            /**
             * <p>Renders the component</p>
             */
            render(): void;
            /**
             * <p>Executes the post render procedure.</p>
             */
            postRender(): void;
            /**
             * <p>Destroys the component.</p>
             */
            destroy(): void;
            /**
             * <p>Draws the item list.</p>
             * @param itemList - <p>The items to draw.</p>
             */
            draw(itemList: componyx.UI.Menu.Item[]): void;
        }
        namespace Menu
        {
            /**
             * @property onItemClick - <p>Event which fires on an item mouseclick.</p>
             * @property onItemSelect - <p>Event which fires on an item select.</p>
             * @property onItemDeselect - <p>Event which fires on an item deselect.</p>
             * @property onItemExpand - <p>Event which fires on an item expand.</p>
             * @property onItemExpandComplete - <p>Event which fires when an item expand completed.</p>
             * @property onItemCollapse - <p>Event which fires on an item collapse.</p>
             * @property onItemCollapseComplete - <p>Event which fires when an item collapse completed.</p>
             * @property onLastItemCollapseComplete - <p>Event which fires when the last item collapse in the cascade collapse chain has completed.</p>
             * @property onPreRenderItemGroup - <p>Event which fires before an itemgroup (box component) is rendered.</p>
             * @property onPostRenderItemGroup - <p>Event which fires after an itemgroup (box component) is rendered.</p>
             * @property onPreRenderItem - <p>Event which fires before an item is rendered.</p>
             * @property onPostRenderItem - <p>Event which fires after an item is rendered.</p>
             * @property onPreLoadItemList - <p>Event which fires before the item-list data is loaded.</p>
             * @property onPostLoadItemList - <p>Event which fires when the item-list data is loaded.</p>
             * @property onPostRenderItemList - <p>Event which fires when the item-list is rendered.</p>
             */
            class MenuEvents extends componyx.UI.base.Events<componyx.UI.Menu>
            {
                constructor();
                /**
                 * <p>Event which fires on an item mouseclick.</p>
                */
                onItemClick: componyx.UI.base.Event<componyx.UI.Menu, componyx.UI.Menu.MenuItemEventArgs>;
                /**
                 * <p>Event which fires on an item select.</p>
                */
                onItemSelect: componyx.UI.base.Event<componyx.UI.Menu, componyx.UI.Menu.MenuItemEventArgs>;
                /**
                 * <p>Event which fires on an item deselect.</p>
                */
                onItemDeselect: componyx.UI.base.Event<componyx.UI.Menu, componyx.UI.Menu.MenuItemEventArgs>;
                /**
                 * <p>Event which fires on an item expand.</p>
                */
                onItemExpand: componyx.UI.base.Event<componyx.UI.Menu, componyx.UI.Menu.MenuItemEventArgs>;
                /**
                 * <p>Event which fires when an item expand completed.</p>
                */
                onItemExpandComplete: componyx.UI.base.Event<componyx.UI.Menu, componyx.UI.Menu.MenuItemEventArgs>;
                /**
                 * <p>Event which fires on an item collapse.</p>
                */
                onItemCollapse: componyx.UI.base.Event<componyx.UI.Menu, componyx.UI.Menu.MenuItemEventArgs>;
                /**
                 * <p>Event which fires when an item collapse completed.</p>
                */
                onItemCollapseComplete: componyx.UI.base.Event<componyx.UI.Menu, componyx.UI.Menu.MenuItemEventArgs>;
                /**
                 * <p>Event which fires when the last item collapse in the cascade collapse chain has completed.</p>
                */
                onLastItemCollapseComplete: componyx.UI.base.Event<componyx.UI.Menu, componyx.UI.Menu.MenuItemEventArgs>;
                /**
                 * <p>Event which fires before an itemgroup (box component) is rendered.</p>
                */
                onPreRenderItemGroup: componyx.UI.base.Event<componyx.UI.Menu, componyx.UI.Menu.MenuItemEventArgs>;
                /**
                 * <p>Event which fires after an itemgroup (box component) is rendered.</p>
                */
                onPostRenderItemGroup: componyx.UI.base.Event<componyx.UI.Menu, componyx.UI.Menu.MenuItemEventArgs>;
                /**
                 * <p>Event which fires before an item is rendered.</p>
                */
                onPreRenderItem: componyx.UI.base.Event<componyx.UI.Menu, componyx.UI.Menu.MenuItemEventArgs>;
                /**
                 * <p>Event which fires after an item is rendered.</p>
                */
                onPostRenderItem: componyx.UI.base.Event<componyx.UI.Menu, componyx.UI.Menu.MenuItemEventArgs>;
                /**
                 * <p>Event which fires before the item-list data is loaded.</p>
                */
                onPreLoadItemList: componyx.UI.base.Event<componyx.UI.Menu, null>;
                /**
                 * <p>Event which fires when the item-list data is loaded.</p>
                */
                onPostLoadItemList: componyx.UI.base.Event<componyx.UI.Menu, null>;
                /**
                 * <p>Event which fires when the item-list is rendered.</p>
                */
                onPostRenderItemList: componyx.UI.base.Event<componyx.UI.Menu, null>;
            }
            /**
             * <p>Menu item event arguments.</p>
             */
            type MenuItemEventArgs = {
                /** <p>The menu item (for item-group events: the parent item, null for the root item group).</p> */
                item: componyx.UI.Menu.Item | null;
                /** <p>The item element, null when there is no item.</p> */
                itemElement: HTMLElement | null;
                /** <p>The original event object.</p> */
                event: Event;
            };
            /**
             * <p>ExpandDirectionOption</p>
             */
            enum ExpandDirectionOption
            {
                DOWN = 0,
                RIGHT = 1,
                UP = 2,
                LEFT = 3
            }
            namespace ExpandDirectionOption
            {
                /**
                 * <p>Gets the lowercase name of the option value.</p>
                 * @param value - <p>The enum value.</p>
                 */
                function getName(value: componyx.UI.Menu.ExpandDirectionOption): string;
            }
            /**
             * <p>ColumnDirectionOption</p>
             */
            enum ColumnDirectionOption
            {
                HORIZONTAL = 0,
                VERTICAL = 1
            }
            /**
             * <p>TypeOption</p>
             */
            enum TypeOption
            {
                COMMANDBUTTON = 0,
                CHECKBUTTON = 1,
                RADIOBUTTON = 2
            }
            /**
             * <p>ExpandOnClickOption</p>
             */
            enum ExpandOnClickOption
            {
                ROOT = 0,
                ALWAYS = 1,
                NEVER = 2
            }
            /**
             * <p>CollapseTypeOption</p>
             */
            enum CollapseTypeOption
            {
                CASCADE = 0,
                SINGLE = 1,
                CONCURRENT = 2,
                INSTANT = 3
            }
            /**
             * <p>Creates an instance of the Menu item.</p>
             * @property cssClassItemGroup - <p>Gets or sets the css class of the child item-group.</p>
             * @property cssClassSubGroup - <p>Gets or sets the css class of a sub-group. Option has effect only when the subGroupId is specified.</p>
             * @property cssClassIcon - <p>Gets or sets the css class of the icon.</p>
             * @property style - <p>Gets or sets the css style of the item.</p>
             * @property itemGroupStyle - <p>Gets or sets the css style of the item-group.</p>
             * @property hasIcon - <p>Gets or sets a value indicating if the item has an icon.</p>
             * @property iconURL - <p>Gets or sets the URL of the icon.</p>
             * @property type - <p>Gets or sets the item button type.</p>
             * @property href - <p>Gets or sets the href (hypertext reference) of the item. Applies to non-split buttons only.</p>
             * @property target - <p>Gets or sets the href target of the item. Applies to non-split buttons only.</p>
             * @property command - <p>Gets or sets the command action of the item. A string wrapped function example: &quot;app.section.doCommand&quot;.</p>
             * @property radioGroupId - <p>Gets or sets the id of the radio group to which this item belongs.</p>
             * @property subGroupId - <p>Gets or sets the id of the sub group (container) to which this item belongs. When provided, an HTML element will be created to serve as a container for all items with the same sub-group identifier</p>
             * @property expandDirection - <p>Gets or sets the direction in which the menu item will expand it's children.</p>
             * @property isCategory - <p>Gets or sets a value indicating that the item is a category. Child-items of a category are rendered as root-level navigation and are displayed when the category-item is selected (hiding the current root menu/category).</p>
             * @property expandOnSelect - <p>Gets or sets a value indicating if a selectable item with child-items is expanded when selected.</p>
             * @property collapseAllOnSelect - <p>Gets or sets a value indicating if all items are collapsed when an item is selected. Option has effect only when the corresponding item-group is not statically positioned.</p>
             * @property expandable - <p>Gets or sets a value indicating if the item can be expanded/collapsed (true) or is always in expanded state (false). Option has effect only when the corresponding item-group is statically positioned.</p>
             * @property expanded - <p>Gets or sets a value indicating if the item is initially expanded. Option has effect only when the item is expandable (otherwise child-items are always expanded) and the child-item list is loaded.</p>
             * @property selectable - <p>Gets or sets a value indicating if the item is selectable. By default the item is selectable when there are no child-items or the item is a RADIO/CHECK-BUTTON type. Disable option when an item renders a template with no navigational purpose.</p>
             * @property selectedChild - <p>Gets or sets a value indicating if a child-item is selected.</p>
             * @property hasChildItems - <p>Gets or sets a value indicating if the item has children. Option has effect only when the child-items are loaded on demand.</p>
             * @property expandDelay - <p>Gets or sets the delay in milliseconds before expanding a menu-item through a pointer-enter/leave event.</p>
             * @property buttonId - <p>Gets or sets the id of the base item button.</p>
             * @property itemGroupBoxId - <p>Gets or sets the id of the base item-group box.</p>
             * @property itemList - <p>Gets or sets the child-item list of the item.</p>
             * @param properties - <p>The properties used to initialize the object.</p>
             */
            class Item extends componyx.UI.base.static.Item
            {
                constructor(properties: any);
                /**
                 * <p>Gets or sets the css class of the child item-group.</p>
                */
                cssClassItemGroup: string;
                /**
                 * <p>Gets or sets the css class of a sub-group. Option has effect only when the subGroupId is specified.</p>
                */
                cssClassSubGroup: string;
                /**
                 * <p>Gets or sets the css class of the icon.</p>
                */
                cssClassIcon: string;
                /**
                 * <p>Gets or sets the css style of the item.</p>
                */
                style: string;
                /**
                 * <p>Gets or sets the css style of the item-group.</p>
                */
                itemGroupStyle: string;
                /**
                 * <p>Gets or sets a value indicating if the item has an icon.</p>
                */
                hasIcon: boolean;
                /**
                 * <p>Gets or sets the URL of the icon.</p>
                */
                iconURL: string;
                /**
                 * <p>Gets or sets the item button type.</p>
                */
                type: TypeOption;
                /**
                 * <p>Gets or sets the href (hypertext reference) of the item. Applies to non-split buttons only.</p>
                */
                href: string;
                /**
                 * <p>Gets or sets the href target of the item. Applies to non-split buttons only.</p>
                */
                target: string;
                /**
                 * <p>Gets or sets the command action of the item. A string wrapped function example: &quot;app.section.doCommand&quot;.</p>
                */
                command: ((...params: any[]) => any) | string;
                /**
                 * <p>Gets or sets the id of the radio group to which this item belongs.</p>
                */
                radioGroupId: string;
                /**
                 * <p>Gets or sets the id of the sub group (container) to which this item belongs. When provided, an HTML element will be created to serve as a container for all items with the same sub-group identifier</p>
                */
                subGroupId: string;
                /**
                 * <p>Gets or sets the direction in which the menu item will expand it's children.</p>
                */
                expandDirection: ExpandDirectionOption;
                /**
                 * <p>Gets or sets a value indicating that the item is a category. Child-items of a category are rendered as root-level navigation and are displayed when the category-item is selected (hiding the current root menu/category).</p>
                */
                isCategory: boolean;
                /**
                 * <p>Gets or sets a value indicating if a selectable item with child-items is expanded when selected.</p>
                */
                expandOnSelect: boolean;
                /**
                 * <p>Gets or sets a value indicating if all items are collapsed when an item is selected. Option has effect only when the corresponding item-group is not statically positioned.</p>
                */
                collapseAllOnSelect: boolean;
                /**
                 * <p>Gets or sets a value indicating if the item can be expanded/collapsed (true) or is always in expanded state (false). Option has effect only when the corresponding item-group is statically positioned.</p>
                */
                expandable: boolean;
                /**
                 * <p>Gets or sets a value indicating if the item is initially expanded. Option has effect only when the item is expandable (otherwise child-items are always expanded) and the child-item list is loaded.</p>
                */
                expanded: boolean;
                /**
                 * <p>Gets or sets a value indicating if the item is selectable. By default the item is selectable when there are no child-items or the item is a RADIO/CHECK-BUTTON type. Disable option when an item renders a template with no navigational purpose.</p>
                */
                selectable: boolean;
                /**
                 * <p>Gets or sets a value indicating if a child-item is selected.</p>
                */
                selectedChild: boolean;
                /**
                 * <p>Gets or sets a value indicating if the item has children. Option has effect only when the child-items are loaded on demand.</p>
                */
                hasChildItems: boolean;
                /**
                 * <p>Gets or sets the delay in milliseconds before expanding a menu-item through a pointer-enter/leave event.</p>
                */
                expandDelay: number;
                /**
                 * <p>Gets or sets the id of the base item button.</p>
                */
                buttonId: string;
                /**
                 * <p>Gets or sets the id of the base item-group box.</p>
                */
                itemGroupBoxId: string;
                /**
                 * <p>Gets or sets the child-item list of the item.</p>
                */
                itemList: Item[];
            }
        }
    }
}