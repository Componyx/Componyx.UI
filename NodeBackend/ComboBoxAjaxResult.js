import { AjaxResult } from './base/AjaxResult.js';

/**
 * This class has no specific description yet.
 */
export class ComboBoxAjaxResult extends AjaxResult
{
    constructor(itemList, totalItemCount)
    {
        super(itemList, totalItemCount);

        /**
         * A dictionary holding the item atrribute name as key and the filtered column as value to inform the component how the results are filtered.
         * @type {Object}
         */
        this.filteredColumns = {};
    }
}

/**
 * Describes how a single column was filtered, for the combo box to display active filters.
 */
export class FilteredColumn
{
    constructor(filter, value)
    {
        /**
         * Gets or sets the filter option applied to the column.
         * @type {FilteredColumn.FilterOption}
         */
        this.filter = (filter !== undefined) ? filter : null;

        /**
         * Gets or sets the filter value.
         * @type {String}
         */
        this.value = (value !== undefined) ? value : null;
    }
}

/**
 * Specifies the type of text match used to filter a column.
 * @readonly
 * @enum {number}
 */
FilteredColumn.FilterOption = {
    /**
     * Matches values starting with the filter text.
     */
    STARTSWITH: 0,
    /**
     * Matches values containing the filter text.
     */
    CONTAINS: 1,
    /**
     * Matches values equal to the filter text.
     */
    EQUALS: 2,
    /**
     * Matches values ending with the filter text.
     */
    ENDSWITH: 3
};
