using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Componyx.UI.Base;

namespace Componyx.UI
{
    /// <summary>
    /// This class has no specific description yet.
    /// </summary>
    public class ComboBoxAjaxResult : AjaxResult<ComboBoxItem>
    {
        /// <summary>
        /// Creates a new ajax result.
        /// </summary>
        public ComboBoxAjaxResult() : base()
        {
            FilteredColumns = new Dictionary<string, FilteredColumn>();
        }

        /// <summary>
        /// Creates a new ajax result.
        /// </summary>
        /// <param name="itemList">The list of items to return</param>
        public ComboBoxAjaxResult(ItemList<ComboBoxItem> itemList) : base(itemList)
        {
            FilteredColumns = new Dictionary<string, FilteredColumn>();
        }

        /// <summary>
        /// Creates a new ajax result.
        /// </summary>
        /// <param name="itemList">The list of items to return</param>
        /// <param name="totalItemCount">This paramater should hold the total item count and is required when data paging is enabled</param>
        public ComboBoxAjaxResult(ItemList<ComboBoxItem> itemList, int totalItemCount) : base(itemList, totalItemCount)
        {
            FilteredColumns = new Dictionary<string, FilteredColumn>();
        }
        
        /// <summary>
        /// A dictionary holding the item atrribute name as key and the filtered column as value to inform the component how the results are filtered.
        /// </summary>
        public Dictionary<string, FilteredColumn> FilteredColumns { get; set; }
    }

    /// <summary>
    /// Describes how a single column was filtered, for the combo box to display active filters.
    /// </summary>
    public class FilteredColumn
    {
        /// <summary>
        /// Gets or sets the filter option applied to the column.
        /// </summary>
        public FilterOption Filter { get; set; }

        /// <summary>
        /// Gets or sets the filter value.
        /// </summary>
        public string Value { get; set; }

        /// <summary>
        /// Specifies the type of text match used to filter a column.
        /// </summary>
        public enum FilterOption
        {
            /// <summary>
            /// Matches values starting with the filter text.
            /// </summary>
            STARTSWITH = 0,
            /// <summary>
            /// Matches values containing the filter text.
            /// </summary>
            CONTAINS = 1,
            /// <summary>
            /// Matches values equal to the filter text.
            /// </summary>
            EQUALS = 2,
            /// <summary>
            /// Matches values ending with the filter text.
            /// </summary>
            ENDSWITH = 3
        }

        /// <summary>
        /// Initializes a new, empty filtered column.
        /// </summary>
        public FilteredColumn()
        {
        }

        /// <summary>
        /// Initializes a new filtered column with the specified filter option.
        /// </summary>
        /// <param name="filter">The filter option to apply.</param>
        public FilteredColumn(FilterOption filter)
        {
            this.Filter = filter;
        }

        /// <summary>
        /// Initializes a new filtered column with the specified filter option and value.
        /// </summary>
        /// <param name="filter">The filter option to apply.</param>
        /// <param name="value">The filter value.</param>
        public FilteredColumn(FilterOption filter, string value)
        {
            this.Filter = filter;
            this.Value = value;
        }
    }
}
