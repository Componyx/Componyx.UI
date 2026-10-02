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
    public class MenuItem : Componyx.UI.Base.Item
    {
        private ItemList<MenuItem> _itemList = new ItemList<MenuItem>();
        private bool? _hasChildItems;

        /// <summary>
        /// Gets or sets the css class of the child item-group.
        /// </summary>
        public string CssClassItemGroup { get; set; }

        /// <summary>
        /// Gets or sets the css class of a sub-group. Option has effect only when the subGroupId is specified.
        /// </summary>
        public string CssClassSubGroup { get; set; }

        /// <summary>
        /// Gets or sets the css class of the icon.
        /// </summary>
        public string CssClassIcon { get; set; }

        /// <summary>
        /// Gets or sets the CSS style of the item.
        /// </summary>
        public string Style { get; set; }

        /// <summary>
        /// Gets or sets the CSS style of the item-group.
        /// </summary>
        public string ItemGroupStyle { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the item has an icon.
        /// </summary>
        public bool HasIcon { get; set; }

        /// <summary>
        /// Gets or sets the URL of the icon.
        /// </summary>
        public string IconURL { get; set; }

        /// <summary>
        /// Gets or sets the item button type.
        /// </summary>
        public TypeOption? Type { get; set; }

        /// <summary>
        /// Gets or sets the href (hypertext reference) of the item. Applies to non-split buttons only.
        /// </summary>
        public string Href { get; set; }

        /// <summary>
        /// Gets or sets the href target of the item. Applies to non-split buttons only.
        /// </summary>
        public string Target { get; set; }

        /// <summary>
        /// Gets or sets the command action of the item. A string wrapped function example: "app.section.doCommand".
        /// </summary>
        public string Command { get; set; }


        /// <summary>
        /// Gets or sets the id of the radio group to which this item belongs.
        /// </summary>
        public string RadioGroupId { get; set; }

        /// <summary>
        /// Gets or sets the id of the sub group (container) to which this item belongs. When provided, an HTML element will be created to serve as a container for all items with the same sub-group identifier
        /// </summary>
        public string SubGroupId { get; set; }

        /// <summary>
        /// Gets or sets the direction in which the menu item will expand it's children.
        /// </summary>
        public ExpandDirectionOption? ExpandDirection { get; set; }

        /// <summary>
        /// Gets or sets a value indicating that the item is a category. Child-items of a category are rendered as root-level navigation and are displayed when the category-item is selected (hiding the current root menu/category).
        /// </summary>
        public bool? IsCategory { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if a selectable item with child-items is expanded when selected.
        /// </summary>
        public bool? ExpandOnSelect { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if all items are collapsed when an item is selected. Option has effect only when the corresponding item-group is not statically positioned.
        /// </summary>
        public bool? CollapseAllOnSelect { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the item can be expanded/collapsed (true) or is always in expanded state (false). Option has effect only when the item-group containing the child-items is positioned statically.
        /// </summary>
        public bool? Expandable{ get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the item is initially expanded. Option has effect only when the item is expandable (otherwise child-items are always expanded) and the child-item list is loaded.
        /// </summary>
        public bool? Expanded { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the item is selectable. By default the item is selectable when there are no child-items or the item is a RADIO/CHECK-BUTTON type. Disable option when an item renders a template with no navigational purpose.
        /// </summary>
        public bool? Selectable { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if a child-item is selected.
        /// </summary>
        public bool? SelectedChild { get; set;  }

        /// <summary>
        /// Gets or sets a value indicating if the item has children. Option has effect only when the child-items are loaded on demand.
        /// </summary>
        public bool? HasChildItems
        {
            get
            {
                if ((_hasChildItems.HasValue))
                {
                    return _hasChildItems.Value;
                }
                else if (_itemList.Count > 0)
                {
                    return true;
                }

                return null;
            }
            set { _hasChildItems = value; }
        }

        /// <summary>
        /// Gets or sets the delay in milliseconds before expanding a menu-item through a pointer-enter/leave event.
        /// </summary>
        public int? ExpandDelay { get; set; }

        /// <summary>
        /// Gets or sets the id of the base item button.
        /// </summary>
        public string ButtonId { get; set; }

        /// <summary>
        /// Gets or sets the id of the base item-group box.
        /// </summary>
        public string ItemGroupBoxId { get; set; }

        /// <summary>
        /// Gets or sets the child-item list of the item.
        /// </summary>
        public ItemList<MenuItem> ItemList
        {
            get { return _itemList; }
        }

        #region "Enums"
        /// <summary>
        /// Specifies the button type of a <see cref="MenuItem"/>.
        /// </summary>
        public enum TypeOption
        {
            /// <summary>
            /// A standard command button.
            /// </summary>
            CommandButton = 0,
            /// <summary>
            /// A toggleable check button.
            /// </summary>
            CheckButton = 1,
            /// <summary>
            /// A radio button, mutually exclusive within its radio group.
            /// </summary>
            RadioButton = 2
        }

        /// <summary>
        /// Specifies the direction in which a menu item's children expand.
        /// </summary>
        public enum ExpandDirectionOption
        {
            /// <summary>
            /// Expands downward.
            /// </summary>
            Down = 0,
            /// <summary>
            /// Expands to the right.
            /// </summary>
            Right = 1,
            /// <summary>
            /// Expands upward.
            /// </summary>
            Up = 2,
            /// <summary>
            /// Expands to the left.
            /// </summary>
            Left = 3
        }

        /// <summary>
        /// Specifies the layout direction of a menu item's columns.
        /// </summary>
        public enum ColumnDirectionOption
        {
            /// <summary>
            /// Columns are laid out horizontally.
            /// </summary>
            Horizontal = 0,
            /// <summary>
            /// Columns are laid out vertically.
            /// </summary>
            Vertical = 1
        }
        #endregion

        /// <summary>
        /// Constructor.
        /// </summary>
        public MenuItem(): base()
        {

        }
    }
}
