using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Serialization;

namespace Componyx.UI
{
    /// <summary>
    /// This class has no specific description yet.
    /// </summary>
    public class TabStripItem : Componyx.UI.Base.Item
    {
        /// <summary>
        /// Gets or sets a value indicating if the item has an icon.
        /// </summary>
        public bool HasIcon { get; set; }

        /// <summary>
        /// Gets or sets the css class of the icon.
        /// </summary>
        public string CssClassIcon { get; set; }

        /// <summary>
        /// Gets or sets the URL of the icon.
        /// </summary>
        public string IconURL { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the button has two actions.
        /// </summary>
        public bool? Split { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the button's default background color is transparent.
        /// </summary>
        public bool? Transparent { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the button's default border color is transparent.
        /// </summary>
        public bool? TransparentBorder { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the button is a primary button. When disabled the button's default style will be less prominent (basic) unless styled otherwise.
        /// </summary>
        public bool? Primary { get; set; }

        /// <summary>
        /// Gets or sets the decoration type used when the button is hovered/selected.
        /// </summary>
        public DecorationOption? Decoration { get; set; }

        /// <summary>
        /// Gets or sets the id of the menu component.
        /// </summary>
        public string MenuId { get; set; }

        /// <summary>
        /// Gets or sets the id of the menu item.
        /// </summary>
        public string MenuItemId { get; set; }

        /// <summary>
        /// Gets or sets the id of the box component.
        /// </summary>
        public string BoxId { get; set; }

        /// <summary>
        /// Gets or sets the id of the button component.
        /// </summary>
        public string ButtonId { get; set; }

        /// <summary>
        /// Specifies the decoration style used when a tab strip button is hovered or selected.
        /// </summary>
        public enum DecorationOption
        {
            /// <summary>
            /// Background
            /// </summary>
            Background = 0,
            /// <summary>
            /// Underline
            /// </summary>
            Underline = 1,
            /// <summary>
            /// Overline
            /// </summary>
            Overline = 2,
            /// <summary>
            /// Frontline
            /// </summary>
            Frontline = 3,
            /// <summary>
            /// Backline
            /// </summary>
            Backline = 4
        }

    }
}
