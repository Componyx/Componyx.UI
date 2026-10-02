using Microsoft.VisualBasic;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Xml.Serialization;
using Componyx.UI.Base;

namespace Componyx.UI
{
    /// <summary>
    /// This class has no specific description yet.
    /// </summary>
    [Serializable()]
    public class ComboBoxItem : Componyx.UI.Base.Item
    {
        /// <summary>
        /// Gets or sets the CSS class of the item's icon.
        /// </summary>
        public string CssClassIcon { get; set; }

        /// <summary>
        /// Gets or sets the CSS class of the item's checkbox.
        /// </summary>
        public string CssClassCheckBox { get; set; }

        /// <summary>
        /// Gets or sets the URL of the item's icon.
        /// </summary>
        public string IconURL { get; set; }

        /// <summary>
        /// Gets or sets the tooltip text of the item.
        /// </summary>
        public string Tooltip { get; set; }
    }
}
