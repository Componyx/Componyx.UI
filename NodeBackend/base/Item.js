/**
 * This class has no specific description yet.
 */
export class Item
{
    constructor(properties)
    {
        /**
         * Gets or sets the identifier of the item.
         * @type {String}
         */
        this.id = null;

        /**
         * Gets or sets the identifier of the template used to render the item.
         * @type {String}
         */
        this.templateId = null;

        /**
         * Gets or sets the CSS class of the item.
         * @type {String}
         */
        this.cssClass = null;

        /**
         * Gets or sets a value indicating if the item is disabled.
         * @type {Boolean}
         */
        this.disabled = false;

        /**
         * Gets or sets a value indicating if the item is selected.
         * @type {Boolean}
         */
        this.selected = false;

        /**
         * Gets or sets the display text of the item.
         * @type {String}
         */
        this.text = null;

        /**
         * Gets or sets the value of the item.
         * @type {String}
         */
        this.value = null;

        /**
         * Gets or sets the title of the item.
         * @type {String}
         */
        this.title = null;

        /**
         * Gets or sets the custom attributes of the item.
         * @type {Object}
         */
        this.attributes = {};

        Object.assign(this, properties);
    }
}
