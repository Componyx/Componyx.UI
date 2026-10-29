import { Item } from './base/item.js';

/**
 * Represents a combo box item with additional properties for icons, checkboxes, and tooltips.
 * @memberof componyx.ui
 */
class ComboBoxItem extends Item
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

export { ComboBoxItem };
