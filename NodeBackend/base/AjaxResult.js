/**
 * This class has no specific description yet.
 */
export class AjaxResult
{
    constructor(itemList, totalItemCount)
    {
        /**
         * Gets or sets the list of items returned by the ajax result.
         * @type {Array}
         */
        this.itemList = itemList || [];

        /**
         * Gets or sets the total item count, used when data paging is enabled.
         * @type {Number}
         */
        this.totalItemCount = totalItemCount || 0;
    }
}
