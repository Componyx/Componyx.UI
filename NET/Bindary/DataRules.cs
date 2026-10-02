using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Componyx.UI.Bindary
{
    /// <summary>
    /// This type is used to set update rules for the client data.
    /// </summary>
    public class DataRules
    {

        /// <summary>
        /// Gets or sets the route index for updating route data on a different route than the currently active route.
        /// </summary>
        public string RouteIndex { get; set; }

        /// <summary>
        /// Gets or sets the route path for updating view data on a different view than the currently active view.
        /// </summary>
        public string RoutePath { get; set; }

        /// <summary>
        /// Gets or sets the hierarchical path on the target object where the source object will be added/updated.
        /// </summary>
        public string Path { get; set; }

        /// <summary>
        /// Gets or sets the key used to match and update items on the target array. The array item is updated when the value on both source and target of specified key matches.
        /// </summary>
        public string UpdateKey { get; set; }

        /// <summary>
        /// Gets or sets a collection of key values to remove. Items on the target client object with a matching value for the specified UpdateKey will be removed.
        /// </summary>
        public List<string> RemoveByKeyValues { get; set; }

        /// <summary>
        /// Gets or sets the position within the array where the items must be added. Do not specify the index (Null/Undefined) when items must be added at the end of the array.
        /// </summary>
        public int? AddIndex { get; set; }

        /// <summary>
        /// Gets or sets the position within the array where the items must be removed. Do not specify the index (Null/Undefined) when items must be removed at the end of the array.
        /// </summary>
        public int RemoveIndex { get; set; }

        /// <summary>
        /// Gets or sets the number of items to remove from the target array.
        /// </summary>
        public int RemoveCount { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if null values in the response data will be ignored.
        /// </summary>
        public bool IgnoreNullValues { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if server data overwrites (false) or updates (true) data on the client.
        /// </summary>
        public bool? Update { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether incoming data responses are compared for equality before updating to avoid redundant changes.
        /// </summary>
        public bool? EqualityCheck { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the HTML element must be recreated when there is already an element for the relevant index/key.
        /// </summary>
        public bool? Recreate { get; set; }

        /// <summary>
        /// Gets or sets a collection of keys to omit on the target client object.
        /// </summary>
        public HashSet<string> OmitKeys { get;set; }
    }
}
