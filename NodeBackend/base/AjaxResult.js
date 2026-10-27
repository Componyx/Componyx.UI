/**
 * Represents the result of an AJAX request, including the returned items and total item count for paging.
 * @memberof componyx.ui
 */
class AjaxResult
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

export { AjaxResult };
