using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Componyx.UI.Base;
using System.Xml.Serialization;

namespace Componyx.UI
{
    /// <summary>
    /// Represents a menu-item rendered within the AppSkin portal menu.
    /// </summary>
    public class AppSkinMenuItem : MenuItem
    {
        private ItemList<AppSkinMenuItem> _itemList = new ItemList<AppSkinMenuItem>();

        /// <summary>
        /// Gets or sets a value indicating in which menu-section the item is displayed.
        /// </summary>
        public MenuSectionOption MenuSection { get; set; }

        /// <summary>
        /// Gets or sets the tile-size of the portal menu group.
        /// </summary>
        public TileSizeOption GroupTileSize { get; set; }

        /// <summary>
        ///  Gets or sets the tile-size of the portal menu buttons.
        /// </summary>
        public TileSizeOption ButtonTileSize { get; set; }
        /// <summary>
        ///  Gets or sets a value indicating if the category (isCategory:true) is shown in the header-menu when menuSection:HEADER. By default the category is always displayed in the main-menu.
        /// </summary>
        public bool CategoryInHeader { get; set; }


        /// <summary>
        /// Gets the child-item list of the item.
        /// </summary>
        public new ItemList<AppSkinMenuItem> ItemList
        {
            get { return _itemList; }
        }

        /// <summary>
        /// Specifies the menu-section in which an <see cref="AppSkinMenuItem"/> is rendered.
        /// </summary>
        public enum MenuSectionOption
        {
            /** the menu-item will be rendered in the header and main menu-sections */
            Header = 0,
            /** the menu-item will be rendered in the main menu-section */
            Main = 1,
            /** the menu-item will be rendered in the footer menu-section */
            Footer = 2,
            /** the menu-item will be rendered in the quick-launch menu-section */
            QuickLaunch = 3
        }

        /// <summary>
        /// Specifies the tile-size used to render a menu-item button or group in the portal menu.
        /// </summary>
        public enum TileSizeOption
        {
            /** renders the menu-item button as small tile in the portal-menu */
            Small = 1,
            /** renders the menu-item button as small-wide tile in the portal-menu */
            Small_Wide = 2,
            /** renders the menu-item button as medium tile in the portal-menu */
            Medium = 4,
            /** renders the menu-item button as medium-wide tile in the portal-menu */
            Medium_Wide = 8,
            /** renders the menu-item button as large tile in the portal-menu */
            Large = 16
        }
    }
}
