import { Item } from './base/Item.js';

/**
 * This class has no specific description yet.
 */
export class TabStripItem extends Item
{
    constructor(properties)
    {
        super(properties);

        /**
         * Gets or sets a value indicating if the item has an icon.
         * @type {Boolean}
         */
        this.hasIcon = false;

        /**
         * Gets or sets the css class of the icon.
         * @type {String}
         */
        this.cssClassIcon = null;

        /**
         * Gets or sets the URL of the icon.
         * @type {String}
         */
        this.iconURL = null;

        /**
         * Gets or sets a value indicating if the button has two actions.
         * @type {Boolean}
         */
        this.split = null;

        /**
         * Gets or sets a value indicating if the button's default background color is transparent.
         * @type {Boolean}
         */
        this.transparent = null;

        /**
         * Gets or sets a value indicating if the button's default border color is transparent.
         * @type {Boolean}
         */
        this.transparentBorder = null;

        /**
         * Gets or sets a value indicating if the button is a primary button. When disabled the button's default style will be less prominent (basic) unless styled otherwise.
         * @type {Boolean}
         */
        this.primary = null;

        /**
         * Gets or sets the decoration type used when the button is hovered/selected.
         * @type {TabStripItem.DecorationOption}
         */
        this.decoration = null;

        /**
         * Gets or sets the id of the menu component.
         * @type {String}
         */
        this.menuId = null;

        /**
         * Gets or sets the id of the menu item.
         * @type {String}
         */
        this.menuItemId = null;

        /**
         * Gets or sets the id of the box component.
         * @type {String}
         */
        this.boxId = null;

        /**
         * Gets or sets the id of the button component.
         * @type {String}
         */
        this.buttonId = null;

        Object.assign(this, properties);
    }
}

/**
 * Specifies the decoration style used when a tab strip button is hovered or selected.
 * @readonly
 * @enum {number}
 */
TabStripItem.DecorationOption =
{
    /**
     * Background
     */
    BACKGROUND: 0,
    /**
     * Underline
     */
    UNDERLINE: 1,
    /**
     * Overline
     */
    OVERLINE: 2,
    /**
     * Frontline
     */
    FRONTLINE: 3,
    /**
     * Backline
     */
    BACKLINE: 4
};
