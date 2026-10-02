using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Componyx.UI
{
    /// <summary>
    /// This class has no specific description yet.
    /// </summary>
    [Serializable()]
    public class GridItem : Componyx.UI.Base.Item
    {
        /// <summary>
        /// Gets or sets the css class of a check box cell.
        /// </summary>
        public string CssClassCheckBox { get; set; }

        /// <summary>
        /// Gets or sets the css class of an expand cell.
        /// </summary>
        public string CssClassExpand { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the row is draggable.
        /// </summary>
        public bool Draggable { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the row is expandable and collapsible.
        /// </summary>
        public bool Expandable { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the row is (initially) expanded.
        /// </summary>
        public bool Expanded { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the item holds a group of child-items.
        /// </summary>
        public bool IsGroup { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the group is expandable and collapsible.
        /// </summary>
        public bool GroupExpandable { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the group is (initially) expanded.
        /// </summary>
        public bool GroupExpanded { get; set; }

        /// <summary>
        /// Gets or sets the indent value of the group in pixels.
        /// </summary>
        public int? GroupIndent { get; set; }

        /// <summary>
        /// Gets or sets the id of the parent group-item to which this item belongs (IsGroup on parent item must be enabled).
        /// </summary>
        public string ParentId { get; set; }

        /// <summary>
        /// Initializes a new instance of the class.
        /// </summary>
        public GridItem() : base()
        {
            Draggable = Expandable = GroupExpandable = GroupExpanded = true;
        }
    }
}