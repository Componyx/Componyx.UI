using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.Xml.Serialization;
using System.ComponentModel;

namespace Componyx.UI.Base
{
    /// <summary>
    /// A string key/value collection for arbitrary item attributes, serialized as a flat JSON object.
    /// </summary>
    [Serializable]
    public class Attributes : Dictionary<string, string>
    {
        /// <summary>
        /// Initializes a new, empty attributes collection.
        /// </summary>
        public Attributes()
        {
        }

        /// <summary>
        /// Initializes a new attributes collection from the specified dictionary, converting each value to a string.
        /// </summary>
        /// <param name="dict">The source dictionary.</param>
        public Attributes(IDictionary<string, object> dict)
        {
            foreach (var item in dict)
                Add(item.Key, item.Value?.ToString());
        }
    }
}
