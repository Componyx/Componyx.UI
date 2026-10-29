/**
 * Represents a grid column filter, including its type and filter value.
 * @memberof componyx.ui
 */
class GridColumnFilter
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

export { GridColumnFilter };
