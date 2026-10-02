using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Serialization;

namespace Componyx.UI.Base
{
    /// <summary>
    /// This class has no specific description yet.
    /// </summary>
    public class NameValuePair
    {       
        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the value.
        /// </summary>
        public string Value { get; set; }

        /// <summary>
        /// Initializes a new, empty name/value pair.
        /// </summary>
        public NameValuePair()
        {
        }

        /// <summary>
        /// Initializes a new name/value pair with the specified name and value.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <param name="value">The value.</param>
        public NameValuePair(string name, string value)
        {
            this.Name = name;
            this.Value = value;
        }
    }
}
