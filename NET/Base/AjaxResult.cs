using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.Xml.Serialization;
using System.ComponentModel;
using System.Collections;
using Componyx.Common;

namespace Componyx.UI.Base
{
    /// <summary>
    /// This class has no specific description yet.
    /// </summary>
    public class AjaxResult<T>
    {
        /// <summary>
        /// Gets or sets the list of items returned by the ajax result.
        /// </summary>
        public ItemList<T> ItemList { get; set; }

        /// <summary>
        /// Gets or sets the total item count, used when data paging is enabled.
        /// </summary>
        public int TotalItemCount { get; set; }

        /// <summary>
        /// Creates a new ajax result.
        /// </summary>
        public AjaxResult()
        {
            ItemList = new ItemList<T>();
        }

        /// <summary>
        /// Creates a new ajax result.
        /// </summary>
        /// <param name="itemList">The list of items to return</param>
        public AjaxResult(ItemList<T> itemList) : this()
        {
            ItemList = itemList;
        }

        /// <summary>
        /// Creates a new ajax result.
        /// </summary>
        /// <param name="itemList">The list of items to return</param>
        /// <param name="totalItemCount">This parameter should hold the total item count and is required when data paging is enabled</param>
        public AjaxResult(ItemList<T> itemList, int totalItemCount) : this()
        {
            ItemList = itemList;
            TotalItemCount = totalItemCount;
        }

        /// <summary>
        /// Serializes the ajax result to a JSON formatted string.
        /// </summary>
        /// <returns></returns>
        public string Serialize()
        {
            return UI.Json.Utility.Serialize(this);
        }

        /// <summary>
        /// Serializes the ajax result to a JSON memory stream.
        /// </summary>
        /// <returns></returns>
        public System.IO.MemoryStream SerializeToStream()
        {
            return new System.IO.MemoryStream(Encoding.UTF8.GetBytes(Serialize()));
        }
    }
}
