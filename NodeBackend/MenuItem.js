import { Item } from './base/Item.js';

/**
 * This class has no specific description yet.
 */
export class MenuItem extends Item
{
    constructor(properties)
    {
        super(properties);

        let _itemList = [];
        let _hasChildItems = null;

        /**
         * Gets or sets the css class of the child item-group.
         * @type {String}
         */
        this.cssClassItemGroup = null;

        /**
         * Gets or sets the css class of a sub-group. Option has effect only when the subGroupId is specified.
         * @type {String}
         */
        this.cssClassSubGroup = null;

        /**
         * Gets or sets the css class of the icon.
         * @type {String}
         */
        this.cssClassIcon = null;

        /**
         * Gets or sets the CSS style of the item.
         * @type {String}
         */
        this.style = null;

        /**
         * Gets or sets the CSS style of the item-group.
         * @type {String}
         */
        this.itemGroupStyle = null;

        /**
         * Gets or sets a value indicating if the item has an icon.
         * @type {Boolean}
         */
        this.hasIcon = false;

        /**
         * Gets or sets the URL of the icon.
         * @type {String}
         */
        this.iconURL = null;

        /**
         * Gets or sets the item button type.
         * @type {MenuItem.TypeOption}
         */
        this.type = null;

        /**
         * Gets or sets the href (hypertext reference) of the item. Applies to non-split buttons only.
         * @type {String}
         */
        this.href = null;

        /**
         * Gets or sets the href target of the item. Applies to non-split buttons only.
         * @type {String}
         */
        this.target = null;

        /**
         * Gets or sets the command action of the item. A string wrapped function example: "app.section.doCommand".
         * @type {String}
         */
        this.command = null;

        /**
         * Gets or sets the id of the radio group to which this item belongs.
         * @type {String}
         */
        this.radioGroupId = null;

        /**
         * Gets or sets the id of the sub group (container) to which this item belongs. When provided, an HTML element will be created to serve as a container for all items with the same sub-group identifier
         * @type {String}
         */
        this.subGroupId = null;

        /**
         * Gets or sets the direction in which the menu item will expand it's children.
         * @type {MenuItem.ExpandDirectionOption}
         */
        this.expandDirection = null;

        /**
         * Gets or sets a value indicating that the item is a category. Child-items of a category are rendered as root-level navigation and are displayed when the category-item is selected (hiding the current root menu/category).
         * @type {Boolean}
         */
        this.isCategory = null;

        /**
         * Gets or sets a value indicating if a selectable item with child-items is expanded when selected.
         * @type {Boolean}
         */
        this.expandOnSelect = null;

        /**
         * Gets or sets a value indicating if all items are collapsed when an item is selected. Option has effect only when the corresponding item-group is not statically positioned.
         * @type {Boolean}
         */
        this.collapseAllOnSelect = null;

        /**
         * Gets or sets a value indicating if the item can be expanded/collapsed (true) or is always in expanded state (false). Option has effect only when the item-group containing the child-items is positioned statically.
         * @type {Boolean}
         */
        this.expandable = null;

        /**
         * Gets or sets a value indicating if the item is initially expanded. Option has effect only when the item is expandable (otherwise child-items are always expanded) and the child-item list is loaded.
         * @type {Boolean}
         */
        this.expanded = null;

        /**
         * Gets or sets a value indicating if the item is selectable. By default the item is selectable when there are no child-items or the item is a RADIO/CHECK-BUTTON type. Disable option when an item renders a template with no navigational purpose.
         * @type {Boolean}
         */
        this.selectable = null;

        /**
         * Gets or sets a value indicating if a child-item is selected.
         * @type {Boolean}
         */
        this.selectedChild = null;

        /**
         * Gets or sets the delay in milliseconds before expanding a menu-item through a pointer-enter/leave event.
         * @type {Number}
         */
        this.expandDelay = null;

        /**
         * Gets or sets the id of the base item button.
         * @type {String}
         */
        this.buttonId = null;

        /**
         * Gets or sets the id of the base item-group box.
         * @type {String}
         */
        this.itemGroupBoxId = null;

        /**
         * Gets or sets a value indicating if the item has children. Option has effect only when the child-items are loaded on demand.
         * @type {Boolean}
         */
        Object.defineProperty(this, 'hasChildItems',
        {
            get()
            {
                if (_hasChildItems !== null)
                    return _hasChildItems;
                else if (_itemList.length > 0)
                    return true;

                return null;
            },
            set(value)
            {
                _hasChildItems = value;
            },
            enumerable: true
        });

        /**
         * Gets or sets the child-item list of the item.
         * @type {Array}
         */
        Object.defineProperty(this, 'itemList',
        {
            get()
            {
                return _itemList;
            },
            enumerable: true
        });

        Object.assign(this, properties);
    }
}

/**
 * Specifies the button type of a MenuItem.
 * @readonly
 * @enum {number}
 */
MenuItem.TypeOption =
{
    /**
     * A standard command button.
     */
    COMMANDBUTTON: 0,
    /**
     * A toggleable check button.
     */
    CHECKBUTTON: 1,
    /**
     * A radio button, mutually exclusive within its radio group.
     */
    RADIOBUTTON: 2
};

/**
 * Specifies the direction in which a menu item's children expand.
 * @readonly
 * @enum {number}
 */
MenuItem.ExpandDirectionOption =
{
    /**
     * Expands downward.
     */
    DOWN: 0,
    /**
     * Expands to the right.
     */
    RIGHT: 1,
    /**
     * Expands upward.
     */
    UP: 2,
    /**
     * Expands to the left.
     */
    LEFT: 3
};

/**
 * Specifies the layout direction of a menu item's columns.
 * @readonly
 * @enum {number}
 */
MenuItem.ColumnDirectionOption =
{
    /**
     * Columns are laid out horizontally.
     */
    HORIZONTAL: 0,
    /**
     * Columns are laid out vertically.
     */
    VERTICAL: 1
};
