/**
 * This class has no specific description yet.
 */
export class GridColumnFilter
{
    constructor(properties)
    {
        /**
         * Gets or sets the Type of the column filter.
         * @type {String}
         */
        this.type = null;

        /**
         * Gets or sets the Value of the column filter.
         * @type {Array}
         */
        this.value = null;

        Object.assign(this, properties);
    }
}
