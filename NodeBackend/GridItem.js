import { Item } from './base/Item.js';

/**
 * This class has no specific description yet.
 */
export class GridItem extends Item
{
    constructor(properties)
    {
        super(properties);

        /**
         * Gets or sets the css class of a check box cell.
         * @type {String}
         */
        this.cssClassCheckBox = null;

        /**
         * Gets or sets the css class of an expand cell.
         * @type {String}
         */
        this.cssClassExpand = null;

        /**
         * Gets or sets a value indicating if the row is draggable.
         * @type {Boolean}
         */
        this.draggable = true;

        /**
         * Gets or sets a value indicating if the row is expandable and collapsible.
         * @type {Boolean}
         */
        this.expandable = true;

        /**
         * Gets or sets a value indicating if the row is (initially) expanded.
         * @type {Boolean}
         */
        this.expanded = false;

        /**
         * Gets or sets a value indicating if the item holds a group of child-items.
         * @type {Boolean}
         */
        this.isGroup = false;

        /**
         * Gets or sets a value indicating if the group is expandable and collapsible.
         * @type {Boolean}
         */
        this.groupExpandable = true;

        /**
         * Gets or sets a value indicating if the group is (initially) expanded.
         * @type {Boolean}
         */
        this.groupExpanded = true;

        /**
         * Gets or sets the indent value of the group in pixels.
         * @type {Number}
         */
        this.groupIndent = null;

        /**
         * Gets or sets the id of the parent group-item to which this item belongs (IsGroup on parent item must be enabled).
         * @type {String}
         */
        this.parentId = null;

        Object.assign(this, properties);
    }
}
