using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Serialization;
using System.Reflection;
using System.Collections;
using Componyx.Common;

namespace Componyx.UI.Base
{
    /// <summary>
    /// This class has no specific description yet.
    /// </summary>
    [Serializable()]
    public class Item
    {
        /// <summary>
        /// Gets or sets the identifier of the item.
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the identifier of the template used to render the item.
        /// </summary>
        public string TemplateId { get; set; }

        /// <summary>
        /// Gets or sets the CSS class of the item.
        /// </summary>
        public string CssClass { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the item is disabled.
        /// </summary>
        public bool Disabled { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the item is selected.
        /// </summary>
        public bool Selected { get; set; }

        /// <summary>
        /// Gets or sets the display text of the item.
        /// </summary>
        public string Text { get; set; }

        /// <summary>
        /// Gets or sets the value of the item.
        /// </summary>
        public string Value { get; set; }

        /// <summary>
        /// Gets or sets the title of the item.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the custom attributes of the item.
        /// </summary>
        public Attributes Attributes { get; set; }

        /// <summary>
        /// Constructor.
        /// </summary>
        public Item()
        {
            Attributes = new Attributes();
        }

        /// <summary>
        /// Serializes the item to a JSON foratted string.
        /// </summary>
        /// <returns></returns>
        public string Serialize()
        {
            return UI.Json.Utility.Serialize(this);
        }

        /// <summary>
        /// Serializes the item to a JSON memory stream.
        /// </summary>
        /// <returns></returns>
        public System.IO.MemoryStream SerializeToStream()
        {
            return new System.IO.MemoryStream(Encoding.UTF8.GetBytes(Serialize()));
        }
    }
}
