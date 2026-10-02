import { Item } from './base/Item.js';

/**
 * This class has no specific description yet.
 */
export class ComboBoxItem extends Item
{
    constructor(properties)
    {
        super(properties);

        /**
         * Gets or sets the CSS class of the item's icon.
         * @type {String}
         */
        this.cssClassIcon = null;

        /**
         * Gets or sets the CSS class of the item's checkbox.
         * @type {String}
         */
        this.cssClassCheckBox = null;

        /**
         * Gets or sets the URL of the item's icon.
         * @type {String}
         */
        this.iconURL = null;

        /**
         * Gets or sets the tooltip text of the item.
         * @type {String}
         */
        this.tooltip = null;

        Object.assign(this, properties);
    }
}
