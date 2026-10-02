import { MenuItem } from './MenuItem.js';

/**
 * Represents a menu-item rendered within the AppSkin portal menu.
 */
export class AppSkinMenuItem extends MenuItem
{
    constructor(properties)
    {
        super(properties);

        let _itemList = [];

        /**
         * Gets or sets a value indicating in which menu-section the item is displayed.
         * @type {AppSkinMenuItem.MenuSectionOption}
         */
        this.menuSection = null;

        /**
         * Gets or sets the tile-size of the portal menu group.
         * @type {AppSkinMenuItem.TileSizeOption}
         */
        this.groupTileSize = null;

        /**
         *  Gets or sets the tile-size of the portal menu buttons.
         * @type {AppSkinMenuItem.TileSizeOption}
         */
        this.buttonTileSize = null;

        /**
         *  Gets or sets a value indicating if the category (isCategory:true) is shown in the header-menu when menuSection:HEADER. By default the category is always displayed in the main-menu.
         * @type {Boolean}
         */
        this.categoryInHeader = false;

        /**
         * Gets the child-item list of the item.
         * @type {Array}
         */
        Object.defineProperty(this, 'itemList',
        {
            get()
            {
                return _itemList;
            },
            enumerable: true
        });

        Object.assign(this, properties);
    }
}

/**
 * Specifies the menu-section in which an AppSkinMenuItem is rendered.
 * @readonly
 * @enum {number}
 */
AppSkinMenuItem.MenuSectionOption =
{
    /** the menu-item will be rendered in the header and main menu-sections */
    HEADER: 0,
    /** the menu-item will be rendered in the main menu-section */
    MAIN: 1,
    /** the menu-item will be rendered in the footer menu-section */
    FOOTER: 2,
    /** the menu-item will be rendered in the quick-launch menu-section */
    QUICKLAUNCH: 3
};

/**
 * Specifies the tile-size used to render a menu-item button or group in the portal menu.
 * @readonly
 * @enum {number}
 */
AppSkinMenuItem.TileSizeOption =
{
    /** renders the menu-item button as small tile in the portal-menu */
    SMALL: 1,
    /** renders the menu-item button as small-wide tile in the portal-menu */
    SMALL_WIDE: 2,
    /** renders the menu-item button as medium tile in the portal-menu */
    MEDIUM: 4,
    /** renders the menu-item button as medium-wide tile in the portal-menu */
    MEDIUM_WIDE: 8,
    /** renders the menu-item button as large tile in the portal-menu */
    LARGE: 16
};
