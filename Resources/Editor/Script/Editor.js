/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

(async function (window)
{
    /**
     * Namespace for editor modules.
     * @namespace componyx.UI.editor_modules
     */
    componyx.UI.editor_modules = componyx.UI.editor_modules || {};

    /**
     * Promise that resolves when all editor modules are loaded asynchronously.
     * @type {Promise<void>}
     * @memberof componyx.UI.editor_modules
     */
    componyx.UI.editor_modules.loaded = (async () =>
    {
        // these dynamic imports are removed when files are bundled into UI(.min).js
        await import(`${$UI.getScriptResourcePath('Base.Sanitizer')}`);
        await import(`${$UI.getScriptResourcePath('Editor.ContentManager')}`);
        await import(`${$UI.getScriptResourcePath('Editor.ComponentFactory')}`);
        await import(`${$UI.getScriptResourcePath('Editor.DialogManager')}`);
        await import(`${$UI.getScriptResourcePath('Editor.EventManager')}`);
        await import(`${$UI.getScriptResourcePath('Editor.Format')}`);
        await import(`${$UI.getScriptResourcePath('Editor.History')}`);
        await import(`${$UI.getScriptResourcePath('Editor.LayoutState')}`);
        await import(`${$UI.getScriptResourcePath('Editor.ListManager')}`);
        await import(`${$UI.getScriptResourcePath('Editor.MenuManager')}`);
        await import(`${$UI.getScriptResourcePath('Editor.NodeManager')}`);
        await import(`${$UI.getScriptResourcePath('Editor.ParagraphButtons')}`);
        await import(`${$UI.getScriptResourcePath('Editor.Resizer')}`);
        await import(`${$UI.getScriptResourcePath('Editor.SelectionRange')}`);
        await import(`${$UI.getScriptResourcePath('Editor.SourceViewBuilder')}`);
        await import(`${$UI.getScriptResourcePath('Editor.SymbolPicker')}`);
        await import(`${$UI.getScriptResourcePath('Editor.Table')}`);
        await import(`${$UI.getScriptResourcePath('Editor.TableDialog')}`);
        await import(`${$UI.getScriptResourcePath('Editor.Toolbar')}`);
        await import(`${$UI.getScriptResourcePath('Editor.TooltipMenu')}`);
        await import(`${$UI.getScriptResourcePath('Editor.Utility')}`);
    })();

    await componyx.UI.editor_modules.loaded;
    const Sanitizer = componyx.base_modules.Sanitizer;
    const ContentManager = componyx.UI.editor_modules.ContentManager;
    const ComponentFactory = componyx.UI.editor_modules.ComponentFactory;
    const DialogManager = componyx.UI.editor_modules.DialogManager;
    const EventManager = componyx.UI.editor_modules.EventManager;
    const Format = componyx.UI.editor_modules.Format;
    const History = componyx.UI.editor_modules.History;
    const LayoutState = componyx.UI.editor_modules.LayoutState;
    const ListManager = componyx.UI.editor_modules.ListManager;
    const MenuManager = componyx.UI.editor_modules.MenuManager;
    const NodeManager = componyx.UI.editor_modules.NodeManager;
    const ParagraphButtons = componyx.UI.editor_modules.ParagraphButtons;
    const Resizer = componyx.UI.editor_modules.Resizer;
    const SelectionRange = componyx.UI.editor_modules.SelectionRange;
    const SourceViewBuilder = componyx.UI.editor_modules.SourceViewBuilder;
    const Table = componyx.UI.editor_modules.Table;
    const Toolbar = componyx.UI.editor_modules.Toolbar;
    const TooltipMenu = componyx.UI.editor_modules.TooltipMenu;
    const Utility = componyx.UI.editor_modules.Utility;

    /**
    * @typedef {Object} EditableElement.
    * @memberof componyx.UI.Editor
    * @property {String} [id] The identifier of the content editable element.
    * @property {HTMLElement} [element] The HTML element instead of the identifier.
    * @property {ToolbarDisplayOption} [settings.toolbarDisplay] The toolbar display for the editable element.
    */

    /**
     * @typedef {Object.<string, string>} LabelSettings
     * @memberof componyx.UI.Editor
     * @property {String} comboBoxPlaceholderEditable           = - Select or Type -                        - Gets or sets the default placeholder for a combobox that allows input.
     * @property {String} comboBoxPlaceholderReadOnly           = - Select -                                - Gets or sets the default placeholder for a combobox that is read-only.
     * @property {String} alignLeft                             = Left                                      - Gets or sets the label for left alignment.
     * @property {String} alignCenter                           = Center                                    - Gets or sets the label for center alignment.
     * @property {String} alignRight                            = Right                                     - Gets or sets the label for right alignment.
     * @property {String} alignJustify                          = Justify                                   - Gets or sets the label for justified text alignment.
     * @property {String} alignTop                              = Top                                       - Gets or sets the label for vertical top alignment.
     * @property {String} alignMiddle                           = Middle                                    - Gets or sets the label for vertical middle alignment.
     * @property {String} alignBottom                           = Center                                    - Gets or sets the label for vertical bottom alignment.
     * @property {String} borderStyleNone                       = None                                      - Gets or sets the label for border-style none.
     * @property {String} borderStyleSolid                      = Solid                                     - Gets or sets the label for border-style solid.
     * @property {String} borderStyleDashed                     = Dashed                                    - Gets or sets the label for border-style dashed.
     * @property {String} borderStyleDotted                     = Dotted                                    - Gets or sets the label for border-style dotted.
     * @property {String} borderStyleDouble                     = Double                                    - Gets or sets the label for border-style double.
     * 
     * @property {String} dialogConfirm                         = OK                                        - Gets or sets the label for the confirm button in dialogs.
     * @property {String} dialogCancel                          = Cancel                                    - Gets or sets the label for the cancel button in dialogs.
     * @property {String} sourceViewDialogHeader                = Source View                               - Gets or sets the header label for the Source View dialog.
     * @property {String} sourceViewRootItem                    = document                                  - Gets or sets the label for the root item in Source View.
     * @property {String} bookmarkDialogHeader                  = Insert/Edit Bookmark                      - Gets or sets the header label for the Insert/Edit Bookmark dialog.
     * @property {String} bookmarkInputPlaceholder              = Bookmark name                             - Gets or sets the placeholder text for the bookmark name input.
     * @property {String} bookmarkPrefix                        = Bookmark                                  - Gets or sets the prefix text for bookmarks.
     * @property {String} symbolSearchInputPlaceholder          = Search                                    - Gets or sets the placeholder text for the symbol search input.
     * 
     * @property {String} linkDialogHeader                      = Insert/Edit Link                          - Gets or sets the header label for the Insert/Edit Link dialog.
     * @property {String} linkHref                              = URL                                       - Gets or sets the label for the URL field in the Link dialog.
     * @property {String} linkText                              = Text                                      - Gets or sets the label for the text field in the Link dialog.
     * @property {String} linkTitle                             = Title                                     - Gets or sets the label for the Title field in the Link dialog.
     * @property {String} linkTarget                            = Target                                    - Gets or sets the label for the Target field in the Link dialog.
     * @property {String} linkTargetCurrent                     = Current window                            - Gets or sets the label for opening the link in the current window.
     * @property {String} linkTargetNew                         = New window                                - Gets or sets the label for opening the link in a new window.
     * @property {String} linkDownloadable                      = Downloadable                              - Gets or sets the label indicating a downloadable link.
     * @property {String} removeLink                            = Remove link                               - Gets or sets the label for removing a link.
     * 
     * @property {String} imageDialogHeader                     = Insert/Edit Image                         - Gets or sets the header label for the Insert/Edit Image dialog.
     * @property {String} imageSource                           = Image URL/File                            - Gets or sets the label for the image URL or file input.
     * @property {String} imageAlt                              = Alternative text                          - Gets or sets the label for the alternative text of an image.
     * @property {String} imageWidth                            = Width                                     - Gets or sets the label for the width of an image.
     * @property {String} imageHeight                           = Height                                    - Gets or sets the label for the height of an image.
     * @property {String} imageAlignment                        = Alignment                                 - Gets or sets the label for image alignment.
     * @property {String} imageInline                           = Inline image                              - Gets or sets the label for inline images.
     * @property {String} imageFileButtonTooltip                = Upload file from computer                 - Gets or sets the tooltip text for the image upload button.
     * @property {String} imageConstrainButtonTooltip           = Lock/Unlock image proportions             - Gets or sets the tooltip text for the image constrain proportions button.
     * 
     * @property {String} mediaDialogHeader                     = Insert/Edit Media                         - Gets or sets the header label for the Insert/Edit Media dialog.
     * @property {String} mediaSource                           = Media URL                                 - Gets or sets the label for the media URL input.
     * @property {String} mediaEmbed                            = Media Embed                               - Gets or sets the label for the media embed input.
     * @property {String} mediaWidth                            = Width                                     - Gets or sets the label for the width of media elements.
     * 
     * @property {String} comboBoxNoResult                      =                                           - Gets or sets the label shown when no results are found in combo boxes.
     * @property {String} default                               = - Default -                               - Gets or sets the label for the default option.
     * @property {String[]} emojiSymbolCategories               = ['All']                                   - Gets or sets the list of emoji symbol categories.
     * @property {String[]} specialSymbolCategories             = ['All']                                   - Gets or sets the list of special symbol categories.
     * 
     * @property {String} tableDialogHeader                     = Table Settings                            - Gets or sets the header label for the Table Settings dialog.
     * @property {String} tableDialogCategoryTable              = Table                                     - Gets or sets the label for the Table category in the Table Settings dialog.
     * @property {String} tableDialogCategoryRow                = Row                                       - Gets or sets the label for the Row category in the Table Settings dialog.
     * @property {String} tableDialogCategoryCell               = Cell                                      - Gets or sets the label for the Cell category in the Table Settings dialog.
     * @property {String} tableWidth                            = Width                                     - Gets or sets the label for the table width field.
     * @property {String} tableAlignment                        = Alignment                                 - Gets or sets the label for the table alignment field.
     * @property {String} tableCellSpacing                      = Cell Spacing                              - Gets or sets the label for the table cell spacing field.
     * @property {String} tableCellPadding                      = Cell Padding                              - Gets or sets the label for the table cell padding field.
     * @property {String} headerRow                             = Header Row                                - Gets or sets the label for the row header toggle.
     * @property {String} footerRow                             = Footer Row                                - Gets or sets the label for the row footer toggle.
     * @property {String} rowHeight                             = Height                                    - Gets or sets the label for the row height.
     * @property {String} cellWidth                             = Width                                     - Gets or sets the label for the cell width field.
     * @property {String} cellHeight                            = Height                                    - Gets or sets the label for the cell height field.
     * @property {String} cellPadding                           = Padding                                   - Gets or sets the label for the cell padding field.
     * @property {String} caption                               = Caption                                   - Gets or sets the label for caption fields (table, image, media).
     * @property {String} bgColor                               = Background Color                          - Gets or sets the label for background color fields (row, cell).
     * @property {String} borderWidth                           = Border Width                              - Gets or sets the label for border width fields (table, cell).
     * @property {String} borderStyle                           = Border Style                              - Gets or sets the label for border style fields (table, cell).
     * @property {String} borderColor                           = Border Color                              - Gets or sets the label for border color fields (table, cell).
     * @property {String} verticalAlign                         = Vertical Align                            - Gets or sets the label for the vertical alignment field.
     * @property {String} horizontalAlign                       = Horizontal Align                          - Gets or sets the label for the horizontal alignment field.
     * 
     * @property {String} tableMenuCut                          = Cut                                       - Gets or sets the label for cutting selected table content.
     * @property {String} tableMenuCopy                         = Copy                                      - Gets or sets the label for copying selected table content.
     * @property {String} tableMenuPaste                        = Paste                                     - Gets or sets the label for pasting clipboard content into the table.
     * @property {String} tableMenuPastePlainText               = Paste as plain text                       - Gets or sets the label for pasting clipboard content without formatting.                                                                                               
     * @property {String} tableMenuRow                          = Row                                       - Gets or sets the label for the row submenu.
     * @property {String} tableMenuAddRowAbove                  = Add Row above                             - Gets or sets the label for inserting a row above the current row.
     * @property {String} tableMenuAddRowBelow                  = Add Row below                             - Gets or sets the label for inserting a row below the current row.
     * @property {String} tableMenuRemoveRow                    = Remove Row                                - Gets or sets the label for removing the selected row.                                                                                             
     * @property {String} tableMenuColumn                       = Column                                    - Gets or sets the label for the column submenu.
     * @property {String} tableMenuAddColumnLeft                = Add Column left                           - Gets or sets the label for inserting a column to the left.
     * @property {String} tableMenuAddColumnRight               = Add Column right                          - Gets or sets the label for inserting a column to the right.
     * @property {String} tableMenuRemoveColumn                 = Remove Column                             - Gets or sets the label for removing the selected column.                                                                                   
     * @property {String} tableMenuMerge                        = Merge                                     - Gets or sets the label for the merge submenu.
     * @property {String} tableMenuMergeSelection               = Merge Selection                           - Gets or sets the label for merging selected cells into one cell.
     * @property {String} tableMenuMergeRight                   = Merge Right                               - Gets or sets the label for merging the current cell with the cell to the right.
     * @property {String} tableMenuMergeDown                    = Merge Down                                - Gets or sets the label for merging the current cell with the cell below.
     * @property {String} tableMenuSplit                        = Split Cells                               - Gets or sets the label for splitting a merged cell into individual cells.                                                                           
     * @property {String} tableMenuSettings                     = Settings                                  - Gets or sets the label for opening the table settings dialog.
     * @property {String} tableMenuDelete                       = Delete Table                              - Gets or sets the label for deleting the entire table.
     * 
     * @property {String} undoCommandTooltip                                                                - Gets or sets the tooltip text for the Undo command button.
     * @property {String} redoCommandTooltip                                                                - Gets or sets the tooltip text for the Redo command button.
     * @property {String} boldCommandTooltip                                                                - Gets or sets the tooltip text for the Bold command button.
     * @property {String} italicCommandTooltip                                                              - Gets or sets the tooltip text for the Italic command button.
     * @property {String} underlineCommandTooltip                                                           - Gets or sets the tooltip text for the Underline command button.
     * @property {String} strikeThroughCommandTooltip                                                       - Gets or sets the tooltip text for the StrikeThrough command button.
     * @property {String} fontColorCommandTooltip                                                           - Gets or sets the tooltip text for the Font Color command button.
     * @property {String} fontBGColorCommandTooltip                                                         - Gets or sets the tooltip text for the Background Color command button.
     * @property {String} blockCommandTooltip                                                               - Gets or sets the tooltip text for the Block style command button.
     * @property {String} fontFamilyCommandTooltip                                                          - Gets or sets the tooltip text for the Font Family command button.
     * @property {String} fontSizeCommandTooltip                                                            - Gets or sets the tooltip text for the Font Size command button.
     * @property {String} styleCommandTooltip                                                               - Gets or sets the tooltip text for the Style command button.
     * @property {String} alignCommandTooltip                                                               - Gets or sets the tooltip text for the Align command button.
     * @property {String} lineHeightCommandTooltip                                                          - Gets or sets the tooltip text for the Line Height command button.
     * @property {String} indentMinCommandTooltip                                                           - Gets or sets the tooltip text for the Decrease Indent command button.
     * @property {String} indentPlusCommandTooltip                                                          - Gets or sets the tooltip text for the Increase Indent command button.
     * @property {String} orderedListCommandTooltip                                                         - Gets or sets the tooltip text for the Ordered List command button.
     * @property {String} unorderedListCommandTooltip                                                       - Gets or sets the tooltip text for the Unordered List command button.
     * @property {String} checkListCommandTooltip                                                           - Gets or sets the tooltip text for the Check List command button.
     * @property {String} linkCommandTooltip                                                                - Gets or sets the tooltip text for the Link command button.
     * @property {String} imageCommandTooltip                                                               - Gets or sets the tooltip text for the Image command button.
     * @property {String} mediaCommandTooltip                                                               - Gets or sets the tooltip text for the Media command button.
     * @property {String} tableCommandTooltip                                                               - Gets or sets the tooltip text for the Table command button.
     * @property {String} subscriptCommandTooltip                                                           - Gets or sets the tooltip text for the Subscript command button.
     * @property {String} superscriptCommandTooltip                                                         - Gets or sets the tooltip text for the Superscript command button.
     * @property {String} copyFormatCommandTooltip                                                          - Gets or sets the tooltip text for the Copy Format command button.
     * @property {String} clearFormatCommandTooltip                                                         - Gets or sets the tooltip text for the Clear Format command button.
     * @property {String} bookmarkCommandTooltip                                                            - Gets or sets the tooltip text for the Bookmark command button.
     * @property {String} horizontalLineCommandTooltip                                                      - Gets or sets the tooltip text for the Horizontal Line command button.
     * @property {String} pageBreakCommandTooltip                                                           - Gets or sets the tooltip text for the Page Break command button.
     * @property {String} sourceCommandTooltip                                                              - Gets or sets the tooltip text for the Source View command button.
     * @property {String} expandCommandTooltip                                                              - Gets or sets the tooltip text for the Expand View command button.
     * @property {String} previewCommandTooltip                                                             - Gets or sets the tooltip text for the Preview command button.
     * @property {String} saveCommandTooltip                                                                - Gets or sets the tooltip text for the Save command button.
     * @property {String} exportCommandTooltip                                                              - Gets or sets the tooltip text for the Export to PDF command button.
     * @property {String} printCommandTooltip                                                               - Gets or sets the tooltip text for the Print command button.
     * @property {String} moreCommandTooltip                                                                - Gets or sets the tooltip text for the More options command button.
     * @property {String} blockViewCommandTooltip                                                           - Gets or sets the tooltip text for the Block View command button.
     * @property {String} specialCommandTooltip                                                             - Gets or sets the tooltip text for the Special Symbols command button.
     * @property {String} emojiCommandTooltip                                                               - Gets or sets the tooltip text for the Emoji Symbols command button.
     */

    /**
     * Editor CSS Variables.
     * @typedef {Object} CSSVariables
     * @memberof componyx.UI.Editor
     * @property {string} ["--font-color"]                                          - The font color.
     * @property {string} ["--font-bg-color"]                                       - The font background color.
     * @property {string} ["--image-width"]                                         - The image width.
     * @property {string} ["--image-height"]                                        - The image height.
     */

    /**
     * @function isActiveFunction
     * @memberof componyx.UI.Editor
     * @param {HTMLElement} node               - The HTML Element node.
     * @param {CommandSettings} cmd            - The command settings.
    */

    /**
      * @function getNodeFunction
      * @memberof componyx.UI.Editor
      * @param {HTMLElement} node               - The HTML Element node.
     */

    /**
     * @typedef {Object.<string, any>} ReplacementItem
     * @memberof componyx.UI.Editor
     * @param {RegExp} match                    - The matching RegExp.
     * @param {String} replace                  - The replacement text.
     */

    /**
     * @typedef {Object.<string, any>} HTMLElementSettings
     * @memberof componyx.UI.Editor
     * @property {Node} node Gets or sets the node.
     * @property {String} tag Gets or sets the tag of the element.
     * @property {String} cssClass Gets or sets the CSS class of the element.
     * @property {Object.<string, string>} styles Gets or sets the CSS styles of the element.
     * @property {Object.<string, string>} attributes Gets or sets the attributes of the element.
     * @property {String} textContent Gets or sets the text content of the element.
     * @property {String} innerHTML Gets or sets the inner HTML of the element (overwrites textContent).
     * @property {String} outerHTML Gets or sets the outer HTML of the element. When a value is provided the tag, cssClass, styles, attributes, textContent and innerHTML properties are ignored.
     * @property {Boolean} isPhrasingContent Gets or sets a value indicating if the element is phrasing content and can be placed inside a P tag.
     * @property {Boolean} selectable Gets or sets a value indicating if the element is selectable. For selectability on document reload, ensure the element matches a selector in selectableNodes so the node will remain selectable.
     * @property {Boolean} select Gets or sets a value indicating if the element is selected when inserted.
     * @property {Boolean} allowContent Gets or sets a value indicating if the element allows editable content.
     */

    /**
     * @typedef {Object.<string, any>} CommandSettings
     * @memberof componyx.UI.Editor
     * @property {Function} command Gets or sets the button command.
     * @property {String} shortcutKey Gets or sets the key used to trigger the command when the CTRL key is held.
     * @property {String} tooltip Gets or sets the tooltip text to display when the command is in focus.
     * @property {String} cssClassIcon Gets or sets thecss class name of the button icon.
     * @property {Boolean} show Gets or sets a value indicating if the command button is shown.
     * @property {componyx.UI.Editor.IsActiveFunction} isActive Gets or sets the function which should return true if the command button is active (selected).
     * @property {componyx.UI.Editor.GetNodeFunction} getNode Gets or sets the function which should return the layout node when it is deeper inside the root-node of the active selection range (e.g. FIGURE > IMG).
     * @property {String} buttonId Gets or sets the id of the base item button.
     * @property {componyx.UI.Button.TypeOption} type Gets or sets a value indicating the button type. 0: command-button, 1: check-button, 2: radio-button.
     * @property {String} menuId Gets or sets the id of the menu component.
     * @property {String} menuItemId Gets or sets the menu-item id.
     * @property {Number} group Gets or sets the index number of the group to which the command belongs.
     * @property {Number} position Gets or sets the position of the command within the group. If no positions are specified commands are ordered by insertion order.
     * @property {componyx.UI.Editor.HTMLElementSettings} elementSettings Gets or sets the settings which configure the element to insert into the document.
    */

    /**
    * @typedef {Object.<string, any>} SymbolCategory
    * @memberof componyx.UI.Editor
    * @property {String} name Gets or sets the category name.
    * @property {componyx.UI.Editor.Symbol[]} values Gets or sets the symbols of the category.
    */

    /**
     * @typedef {Object.<string, any>} Symbol
     * @memberof componyx.UI.Editor
     * @property {String} name Gets or sets the symbol name.
     * @property {String} value Gets or sets the symbol value.
     */

    /**
    * Editor class.
    * Note: if you use $lib alongside the editor API in an iframe configuration, be aware that editor operations temporarily switch $lib.document to the iframe document. 
    * This resets automatically via microtask after each callstack. Call editor.deactivateDocument() explicitly (or reset $lib.document) if you need to restore the context immediately within the same callstack.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {String} An instance of the component.
    */
    componyx.UI.Editor = function Editor(id, properties)
    {
        // define private properties
        let _instance = this,
            _themeOption = $base.static.ThemeOption,
            _toolbarDisplayOption = componyx.UI.Editor.ToolbarDisplayOption,
            _resizeTimerId,
            _range, _sortedCommands = [],
            _toolbar, _footerEl, _pathEl, _wordCountEl, _logoEl, _doc, _editableElement, _editor, _iframe,
            _resizeHandle, _resizeMask,
            _sourceElement = new Map(),
            _sourceViewStore = new Map(),
            _sanitizer,
            _iconPrefix = 'ico-editor-';

        /**
        * Internal CSS class name constants.
        * You can override any of these classes on the Component instance by defining a property named
        * `cssClass<Key>` where <Key> is the PascalCase key from this object.
        * Example:
        *  'BUILD_PANE' -> 'cssClassBuildPane'
        * Be cautious: overriding these classes without including the default names may break styling and functionality.
        * @constant
        * @type {Readonly<Object<string, string>>}
        */
        this.classOption = Object.freeze(
            {
                TOOLBAR: 'toolbar',
                TOOLBAR_BOX: 'toolbar-box',
                TOOLBAR_MORE: 'toolbar-more',
                GROUP: 'group',
                CONTENT: 'editor-content',
                FOOTER: 'footer',
                PATH: 'path',
                WORD_COUNT: 'word-count',
                FULLSCREEN: 'fullscreen',
                PREVIEW: 'preview',
                SOURCE_VIEW: 'source-view',
                BOOKMARK: 'bookmark',
                FIGURE: 'figure',
                MEDIA: 'media',
                LINK_DIALOG: 'link-dialog',
                BOOKMARK_DIALOG: 'bookmark-dialog',
                IMAGE_DIALOG: 'image-dialog',
                MEDIA_DIALOG: 'media-dialog',
                SOURCE_DIALOG: 'source-dialog',
                FOCUS: 'focus',
                FRAMED: 'framed',
                HIDDEN: 'hidden',
                TOOLTIP_MENU_LINK: 'tooltip-menu-link',
                DOC_TOOLTIPS: 'doc-tooltips',
                IMG_INLINE_ALIGN_DEFAULT_TOP: 'img-inline-align-default-top',
                IMG_INLINE_ALIGN_DEFAULT_CENTER: 'img-inline-align-default-center',
                IMG_INLINE_ALIGN_DEFAULT_BOTTOM: 'img-inline-align-default-bottom',
                IMG_INLINE_ALIGN_LEFT: 'img-inline-align-left',
                IMG_INLINE_ALIGN_RIGHT: 'img-inline-align-right',
                IMG_ALIGN_LEFT: 'img-align-left',
                IMG_ALIGN_CENTER: 'img-align-center',
                IMG_ALIGN_RIGHT: 'img-align-right',
                COLORSWATCH_BOX: 'box color-swatch',
                SWATCH: 'swatch',
                SWATCH_COLOR: 'swatch-color',
                CLEARCOLOR_BUTTON: 'clear-color-button',
                COLORPICKER_BUTTON: 'color-picker-button',
                SYMBOL_PICKER_BOX: 'box symbol-picker',
                EMOJI_SYMBOL_PICKER: 'emoji-picker',
                SPECIAL_SYMBOL_PICKER: 'special-picker',
                SYMBOL_CATEGORIES: 'symbol-categories',
                SYMBOL_VIEW: 'symbol-view',
                SYMBOL_CATEGORY: 'symbol-category',
                SYMBOL_ITEMS: 'symbol-items',
                SYMBOL_HEADER: 'symbol-header',
                SYMBOL_FOOTER: 'symbol-footer',
                SYMBOL: 'symbol',
                TABLE_PICKER: 'te-picker',
                TABLE_PICKER_GRID: 'te-picker-grid',
                TABLE_PICKER_LABEL: 'te-picker-label',
                TABLE_WRAPPER: 'te-wrapper',
                TABLE_ANCHOR: 'te-anchor',
                TABLE_SELECTED: 'te-selected',
                TABLE_COL_HANDLE: 'te-col-handle',
                TABLE_COL_HANDLE_ACTIVE: 'te-col-handle-active',
                TABLE_MENU_BUTTON: 'te-menu-button',
                TABLE_DIALOG: 'table-dialog',
                TABLE_DIALOG_CATEGORIES: 'table-dialog-categories',
                TABLE_DIALOG_VIEW: 'table-dialog-view',
                TABLE_DIALOG_PANEL: 'table-dialog-panel',
                TABLE_DIALOG_CATEGORY: 'table-dialog-category',
                ACTIVE: 'active',
                REMOVE: 'remove',
                LOCK: 'lock',
                FILE_SELECT: 'file-select',
                FIELD_HALF: 'field-half',
                PARAGRAPH: 'paragraph',
                PDF_EXPORT: 'editor-pdf-export'
            });

        // define public properties
        /** 
         * Gets or sets the editor height.
         * @type {String}
         */
        this.editorHeight = '';

        /** 
         * Gets or sets the default font size.
         * @type {String}
         */
        this.defaultFontSize = '16px';

        /** 
         * Gets or sets the default font family.
         * @type {String}
         */
        this.defaultFontFamily = 'Arial';

        /** 
         * Gets or sets the default alignment.
         * @type {String}
         */
        this.defaultAlign = '';

        /** 
         * Gets or sets the default line-height.
         * @type {String}
         */
        this.defaultLineHeight = '';

        /** 
         * Gets or sets the content.
         * @type {String}
         */
        this.content = '';

        /** 
         * Gets or sets the toolbar display option.
         * @type {String}
         */
        this.toolbarDisplay = _toolbarDisplayOption.HEADER;

        /** 
         * Gets or sets a value indicating uses an iframe (instead of content-editable DIV).
         * @type {Boolean}
         * @default false
         */
        this.iframe = false;

        /** 
         * Gets or sets a value indicating if CSS imported fonts should be detected.
         * @type {Boolean}
         * @default true
         */
        this.detectFonts = true;

        /** 
         * Gets or sets a value indicating if default WebSafe fonts are included in the fontFamily menu.
         * @type {Boolean}
         * @default true
         */
        this.includeWebSafeFonts = true;

        /** 
         * Gets or sets a value indicating if missing font-sizes are added to the font-size menu.
         * @type {Boolean}
         * @default true
         */
        this.addMissingFontSize = true;

        /** 
         * Gets or sets a value indicating if the default Browser spellcheck is enabled.
         * @type {Boolean}
         * @default true
         */
        this.defaultSpellcheck = true;

        /** 
         * Gets or sets a value indicating if the source view is displayed in a dialog.
         * @type {Boolean}
         * @default false
         */
        this.sourceViewInDialog = false;

        /** 
         * Gets or sets a value indicating if a local image file can be selected.
         * @type {Boolean}
         * @default true
         */
        this.allowImageFileSelect = true;

        /** 
         * Gets or sets a value indicating if an url can be entered for images.
         * @type {Boolean}
         * @default true
         */
        this.allowImageUrlInput = true;

        /** 
         * Gets or sets the default indent CSS unit value.
         * @type {String}
         * @default '20px'
         */
        this.indentValue = '20px';

        /**
         * Gets or sets the maximum items allowed in the history stack. Null means no limit.
         * @type {number|null}
         */
        this.maxHistoryLength = null;

        /**
         * Gets or sets the prefix used to store data in local storage like color swatch colors.
         * @type {String}
         */
        this.localStoragePrefix = 'editor';

        /** 
         * Gets or sets the resource path for fetching the emojis.
         * @type {String}
         * @default 'src?d=Editor.Emoji.json'
         */
        this.emojiSymbolResourcePath = 'src?d=Editor.Emoji.json';

        /** 
         * Gets or sets the resource path for fetching the special characters.
         * @type {String}
         * @default 'src?d=Editor.Special.json'
         */
        this.specialSymbolResourcePath = 'src?d=Editor.Special.json';

        /** 
         * Gets or sets the emoji symbol data.
         * @type {componyx.UI.Editor.SymbolCategory[]}
         */
        this.emojiSymbolData = null;

        /** 
         * Gets or sets the special symbol data.
         * @type {componyx.UI.Editor.SymbolCategory[]}
         */
        this.specialSymbolData = null;

        /** 
         * Gets or sets a list of editable elements.
         * @type {EditableElement[]}
         */
        this.editableElements = [];

        /** 
         * Gets or sets a list of custom fonts to include in the fontFamily menu.
         * @type {String[]}
         */
        this.fonts = [];

        /** 
         * Gets or sets a list fonts to specifically exclude from the fontFamily menu.
         * @type {String[]}
         */
        this.excludeFonts = [];

        /** 
         * Gets or sets a list CSS unit font sizes to show in the fontSize menu.
         * @type {String[]}
         */
        this.fontSizes = ["8px", "9px", "10px", "11px", "12px", "13px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "40px", "48px", "60px", "72px", "96px"];

        /** 
         * Gets or sets a list style items to show in the style menu.
         * @type {componyx.UI.Editor.StyleItem[]}
         */
        this.styles = [];

        /** 
         * Gets or sets a list of line height options.
         * @type {String[]}
         */
        this.lineHeights = ["0", "0.5", "1", "1.1", "1.2", "1.3", "1.4", "1.5", "2", "2.5", "3", "4"];

        /** 
         * Gets or sets a list of ordered list-item options.
         * @type {String[]}
         */
        this.orderedList = ['decimal', 'lower-alpha', 'lower-greek', 'lower-roman', 'upper-alpha', 'upper-roman'];

        /** 
         * Gets or sets a list of unordered list-item options.
         * @type {String[]}
         */
        this.unorderedList = ['disc', 'circle', 'square'];

        /** 
         * Gets or sets a list of colors displayed in the color-swatch.
         * @type {String[]}
         */
        this.colorSwatchColors = ['LightCoral', 'Plum', 'LightBlue', 'PaleTurquoise', 'PaleGreen', 'LemonChiffon',
            'IndianRed', 'Orchid', 'SkyBlue', 'Turquoise', 'LightGreen', 'PaleGoldenrod',
            'Red', 'MediumOrchid', 'DeepSkyBlue', 'Cyan', 'GreenYellow', 'Gold',
            'Crimson', 'DarkOrchid', 'SteelBlue', 'LightSeaGreen', 'LimeGreen', 'Orange',
            'DarkRed', 'Indigo', 'MidnightBlue', 'DarkCyan', 'Green', 'DarkOrange',
            'White', 'LightGray', 'DarkGray', 'Gray', 'DimGray', 'Black'];

        /** 
         * Gets or sets a list of unique command names (or special keywords) to show on initialization.
         * By default all supported commands are visible. If set, only these listed commands are visible.
         * core ['undo','redo','bold','italic','underline','strikeThrough','align','indentMin','indentPlus','copyFormat','clearFormat'].
         * list ['orderedList','unorderedList'].     
         * font ['fontSize','fontFamily'].
         * font-color ['fontColor','fontBGColor']
         * @type {String[]}
         */
        this.visibleCommands = [];

        /** 
         * Gets or sets a list of extra commands to add on initialization. 
         * Each object key is the unique command name and the value holds the command settings.
         * @type {Object.<string, CommandSettings>}
         */
        this.extraCommands = {};

        /** 
         * Gets or sets the text labels used by the editor.
         * @type {componyx.UI.Editor.LabelSettings}
         */
        this.labels = {
            comboBoxPlaceholderEditable: '- Select or Enter -',
            comboBoxPlaceholderReadOnly: '- Select - ',
            alignLeft: 'Left',
            alignCenter: 'Center',
            alignRight: 'Right',
            alignJustify: 'Justify',
            alignTop: 'Top',
            alignMiddle: 'Middle',
            alignBottom: 'Bottom',
            borderStyleNone: 'None',
            borderStyleSolid: 'Solid',
            borderStyleDashed: 'Dashed',
            borderStyleDotted: 'Dotted',
            borderStyleDouble: 'Double',
            dialogConfirm: 'OK',
            dialogCancel: 'Cancel',
            sourceViewDialogHeader: 'Source View',
            sourceViewRootItem: 'document',
            bookmarkDialogHeader: 'Insert/Edit Bookmark',
            bookmarkInputPlaceholder: 'Bookmark name',
            bookmarkPrefix: 'Bookmark',
            symbolSearchInputPlaceholder: 'Search',
            linkDialogHeader: 'Insert/Edit Link',
            linkHref: 'URL',
            linkText: 'Text',
            linkTitle: 'Title',
            linkTarget: 'Target',
            linkTargetCurrent: 'Current window',
            linkTargetNew: 'New window',
            linkDownloadable: 'Downloadable',
            removeLink: 'Remove link',
            imageDialogHeader: 'Insert/Edit Image',
            imageSource: 'Image URL/File',
            imageAlt: 'Alternative text',
            imageWidth: 'Width',
            imageHeight: 'Height',
            imageAlignment: 'Alignment',
            imageAlignLeft: 'Left',
            imageAlignCenter: 'Center',
            imageAlignRight: 'Right',
            imageInlineAlignDefaultTop: 'Top',
            imageInlineAlignDefaultCenter: 'Center',
            imageInlineAlignDefaultBottom: 'Bottom',
            imageInlineAlignLeft: 'Left',
            imageInlineAlignRight: 'Right',
            imageInline: 'Inline image',
            imageFileButtonTooltip: 'Upload file from computer',
            imageConstrainButtonTooltip: 'Lock/Unlock image proportions',
            mediaDialogHeader: 'Insert/Edit Media',
            mediaSource: 'Media URL',
            mediaEmbed: 'Media Embed',
            mediaWidth: 'Width',
            comboBoxNoResult: '',
            default: '- Default -',
            emojiSymbolCategories: ['All'],
            specialSymbolCategories: ['All'],
            tableDialogHeader: 'Table Settings',
            tableDialogCategoryTable: 'Table',
            tableDialogCategoryRow: 'Row',
            tableDialogCategoryCell: 'Cell',
            tableWidth: 'Width',
            tableAlignment: 'Alignment',
            tableCellSpacing: 'Cell Spacing',
            tableCellPadding: 'Cell Padding',
            headerRow: 'Header Row',
            footerRow: 'Footer Row',
            rowHeight: 'Height',
            cellWidth: 'Width',
            cellHeight: 'Height',
            cellPadding: 'Padding',
            caption: 'Caption',
            bgColor: 'Background Color',
            borderWidth: 'Border Width',
            borderStyle: 'Border Style',
            borderColor: 'Border Color',
            verticalAlign: 'Vertical Align',
            horizontalAlign: 'Horizontal Align',

            tableMenuCut: 'Cut',
            tableMenuCopy: 'Copy',
            tableMenuPaste: 'Paste',
            tableMenuPastePlainText: 'Paste as plain text',
            tableMenuRow: 'Row',
            tableMenuAddRowAbove: 'Add Row above',
            tableMenuAddRowBelow: 'Add Row below',
            tableMenuRemoveRow: 'Remove Row',
            tableMenuColumn: 'Column',
            tableMenuAddColumnLeft: 'Add Column left',
            tableMenuAddColumnRight: 'Add Column right',
            tableMenuRemoveColumn: 'Remove Column',
            tableMenuMerge: 'Merge',
            tableMenuMergeSelection: 'Merge Selection',
            tableMenuMergeRight: 'Merge Right',
            tableMenuMergeDown: 'Merge Down',
            tableMenuSplit: 'Split Cells',
            tableMenuSettings: 'Settings',
            tableMenuDelete: 'Delete Table',

            undoCommandTooltip: '',
            redoCommandTooltip: '',
            boldCommandTooltip: '',
            italicCommandTooltip: '',
            underlineCommandTooltip: '',
            strikeThroughCommandTooltip: '',
            fontColorCommandTooltip: '',
            fontBGColorCommandTooltip: '',
            blockCommandTooltip: '',
            fontFamilyCommandTooltip: '',
            fontSizeCommandTooltip: '',
            styleCommandTooltip: '',
            alignCommandTooltip: '',
            lineHeightCommandTooltip: '',
            indentMinCommandTooltip: '',
            indentPlusCommandTooltip: '',
            orderedListCommandTooltip: '',
            unorderedListCommandTooltip: '',
            checkListCommandTooltip: '',
            linkCommandTooltip: '',
            imageCommandTooltip: '',
            mediaCommandTooltip: '',
            tableCommandTooltip: '',
            subscriptCommandTooltip: '',
            superscriptCommandTooltip: '',
            copyFormatCommandTooltip: '',
            clearFormatCommandTooltip: '',
            bookmarkCommandTooltip: '',
            horizontalLineCommandTooltip: '',
            pageBreakCommandTooltip: '',
            sourceCommandTooltip: '',
            expandCommandTooltip: '',
            previewCommandTooltip: '',
            saveCommandTooltip: '',
            exportCommandTooltip: '',
            printCommandTooltip: '',
            moreCommandTooltip: '',
            blockViewCommandTooltip: '',
            specialCommandTooltip: '',
            emojiCommandTooltip: ''
        };

        /** 
         * Gets or sets a list stylesheets to include in the iframe. Setting only applicable when iframe is set to true.
         * @type {String[]}
         */
        this.includeStylesheets = [];

        /** 
         * Gets or sets the PDF export settings for jsPDF. View https://github.com/parallax/jsPDF
         * @type {Object}
         */
        this.PDFExportSettings = {
            filename: "export.pdf",
            margin: [10, 10, 10, 10],
            autoPaging: "text",
            html2canvas: {
                useCORS: true,
                allowTaint: false,
                logging: false
            },
            x: 0,
            y: 0,
            width: 180,       // mm on the page
            windowWidth: 680  // CSS px the content is laid out in
        };

        /** 
         * Gets or sets media URL replacement options. 
         * @type {componyx.UI.Editor.ReplacementItem[]}
         */
        this.mediaURLReplacement = [
            {
                match: /(youtube\.com\/)watch\?v=/gi,
                replace: '$1embed/'
            },
            {
                match: /youtu\.be\/([a-zA-Z0-9_-]+)/gi,
                replace: 'youtube.com/embed/$1'
            }
        ];

        /**
         * Gets or sets CSS Selectors for nodes that are selectable in the editor.
         * Defaults include anchors, figures and non-editable elements.
         * Additional selectors can be added before render to support custom selectable elements.
         * @type {String[]}
         */
        this.selectableNodes = ['a', 'figure', '[contenteditable="false"]'];

        /** 
         * Gets or sets the id of the base menu.
         * @type {String}
         */
        this.menuId = null;

        /** 
         * Gets or sets the id of the base table menu.
         * @type {String}
         */
        this.tableMenuId = null;

        /** 
         * Gets or sets the id of the base toolbar box.
         * @type {String}
         */
        this.toolbarBoxId = null;

        /** 
         * Gets or sets the id of the base toolbar-more box.
         * @type {String}
         */
        this.toolbarMoreBoxId = null;

        /** 
         * Gets or sets the id of the base color swatch box.
         * @type {String}
         */
        this.colorSwatchBoxId = null;

        /** 
         * Gets or sets the id of the base clear-color button.
         * @type {String}
         */
        this.clearColorButtonId = null;

        /** 
         * Gets or sets the id of the base color picker.
         * @type {String}
         */
        this.colorPickerId = null;

        /** 
         * Gets or sets the id of the base source-dialog.
         * @type {String}
         */
        this.sourceDialogId = null;

        /** 
         * Gets or sets the id of the base bookmark-dialog.
         * @type {String}
         */
        this.bookmarkDialogId = null;

        /** 
         * Gets or sets the id of the base link-dialog.
         * @type {String}
         */
        this.linkDialogId = null;

        /** 
         * Gets or sets the id of the base image-dialog.
         * @type {String}
         */
        this.imageDialogId = null;

        /** 
         * Gets or sets the id of the base media-dialog.
         * @type {String}
         */
        this.mediaDialogId = null;

        /**
         * Gets or sets identifiers for controls in the link dialog.
         * @type {Object}
         */
        this.linkDialog = {
            /** 
             * Gets or sets the id of the base link-href form-field.
             * @type {String}
             */
            hrefFormFieldId: null,

            /** 
             * Gets or sets the id of the base link-text form-field.
             * @type {String}
             */
            textFormFieldId: null,

            /** 
             * Gets or sets the id of the base link-title form-field.
             * @type {String}
             */
            titleFormFieldId: null,

            /** 
             * Gets or sets the id of the base link-target form-field.
             * @type {String}
             */
            targetFormFieldId: null,

            /** 
             * Gets or sets the id of the base link-downloadable form-field.
             * @type {String}
             */
            downloadableFormFieldId: null,

            /** 
             * Gets or sets the id of the base link-href combo-box.
             * @type {String}
             */
            hrefComboBoxId: null,

            /** 
             * Gets or sets the id of the base link-target combo-box.
             * @type {String}
             */
            targetComboBoxId: null,

            /** 
             * Gets or sets the id of the base remove-link button.
             * @type {String}
             */
            removeButtonId: null
        };

        /**
         * Gets or sets identifiers for controls in the image dialog.
         * @type {Object}
         */
        this.imageDialog = {
            /** 
             * Gets or sets the id of the base image-source form-field.
             * @type {String}
             */
            sourceFormFieldId: null,

            /** 
             * Gets or sets the id of the base image-alt form-field.
             * @type {String}
             */
            altFormFieldId: null,

            /** 
             * Gets or sets the id of the base image-width form-field.
             * @type {String}
             */
            widthFormFieldId: null,

            /** 
             * Gets or sets the id of the base image-height form-field.
             * @type {String}
             */
            heightFormFieldId: null,

            /** 
             * Gets or sets the id of the base caption form-field.
             * @type {String}
             */
            captionFormFieldId: null,

            /** 
             * Gets or sets the id of the base alignment form-field.
             * @type {String}
             */
            alignmentFormFieldId: null,

            /** 
             * Gets or sets the id of the base image file button.
             * @type {String}
             */
            fileButtonId: null,

            /** 
             * Gets or sets the id of the base image constrain button.
             * @type {String}
             */
            constrainButtonId: null
        };

        /**
         * Gets or sets identifiers for controls in the media dialog.
         * @type {Object}
         */
        this.mediaDialog = {
            /** 
             * Gets or sets the id of the base media-source form-field.
             * @type {String}
             */
            sourceFormFieldId: null,

            /** 
             * Gets or sets the id of the base media-embed form-field.
             * @type {String}
             */
            embedFormFieldId: null,

            /** 
             * Gets or sets the id of the base media-width form-field.
             * @type {String}
             */
            widthFormFieldId: null,

            /**
             * Gets or sets the id of the base media-caption form-field.
             * @type {String}
             */
            captionFormFieldId: null
        };

        /**
        * Gets or sets identifiers for controls in the table dialog.
        * @type {Object}
        */
        this.tableDialog = {
            /** 
             * Gets or sets the id of the base table-width form-field.
             * @type {String}
             */
            tableWidthFormFieldId: null,

            /** 
             * Gets or sets the id of the base table-align form-field.
             * @type {String}
             */
            tableAlignFormFieldId: null,

            /** 
             * Gets or sets the id of the base table-border-width form-field.
             * @type {String}
             */
            tableBorderWidthFormFieldId: null,

            /** 
             * Gets or sets the id of the base table-border-style form-field.
             * @type {String}
             */
            tableBorderStyleFormFieldId: null,

            /** 
             * Gets or sets the id of the base table-cell-spacing form-field.
             * @type {String}
             */
            tableCellSpacingFormFieldId: null,

            /** 
             * Gets or sets the id of the base table-cell-padding form-field.
             * @type {String}
             */
            tableCellPaddingFormFieldId: null,

            /** 
             * Gets or sets the id of the base table-caption form-field.
             * @type {String}
             */
            tableCaptionFormFieldId: null,

            /** 
             * Gets or sets the id of the base table-background-color form-field.
             * @type {String}
             */
            tableBgColorFormFieldId: null,

            /** 
             * Gets or sets the id of the base table-border-color form-field.
             * @type {String}
             */
            tableBorderColorFormFieldId: null,

            /** 
             * Gets or sets the id of the base row-is-header form-field.
             * @type {String}
             */
            rowIsHeaderFormFieldId: null,

            /** 
             * Gets or sets the id of the base row-is-footer form-field.
             * @type {String}
             */
            rowIsFooterFormFieldId: null,

            /** 
             * Gets or sets the id of the base row-height form-field.
             * @type {String}
             */
            rowHeightFormFieldId: null,

            /** 
             * Gets or sets the id of the base row-background-color form-field.
             * @type {String}
             */
            rowBgColorFormFieldId: null,

            /**
             * Gets or sets the id of the base row-border-style form-field.
             * @type {String}
             */
            rowBorderStyleFormFieldId: null,

            /**
             * Gets or sets the id of the base row-border-color form-field.
             * @type {String}
             */
            rowBorderColorFormFieldId: null,

            /** 
             * Gets or sets the id of the base cell-width form-field.
             * @type {String}
             */
            cellWidthFormFieldId: null,

            /** 
             * Gets or sets the id of the base cell-height form-field.
             * @type {String}
             */
            cellHeightFormFieldId: null,

            /** 
             * Gets or sets the id of the base cell-vertical-align form-field.
             * @type {String}
             */
            cellVerticalAlignFormFieldId: null,

            /** 
             * Gets or sets the id of the base cell-horizontal-align form-field.
             * @type {String}
             */
            cellHorizontalAlignFormFieldId: null,

            /** 
             * Gets or sets the id of the base cell-border-width form-field.
             * @type {String}
             */
            cellBorderWidthFormFieldId: null,

            /** 
             * Gets or sets the id of the base cell-border-style form-field.
             * @type {String}
             */
            cellBorderStyleFormFieldId: null,

            /** 
             * Gets or sets the id of the base cell-padding form-field.
             * @type {String}
             */
            cellPaddingFormFieldId: null,

            /** 
             * Gets or sets the id of the base cell-background-color form-field.
             * @type {String}
             */
            cellBgColorFormFieldId: null,

            /** 
             * Gets or sets the id of the base cell-border-color form-field.
             * @type {String}
             */
            cellBorderColorFormFieldId: null,


            /** 
             * Gets or sets the id of the base cell-horizontal-align combo-box.
             * @type {String}
             */
            horizontalAlignComboBoxId: null,

            /** 
             * Gets or sets the id of the base cell-vertical-align combo-box.
             * @type {String}
             */
            verticalAlignComboBoxId: null,

            /** 
             * Gets or sets the id of the base border-style combo-box, shared across table, row and cell panels.
             * @type {String}
             */
            borderStyleComboBoxId: null,

            /** 
             * Gets or sets the id of the base border-color button, shared across table, row and cell panels.
             * @type {String}
             */
            borderColorButtonId: null,

            /** 
             * Gets or sets the id of the base background-color button, shared across table, row and cell panels.
             * @type {String}
             */
            bgColorButtonId: null,
        };

        /** 
         * Gets or sets the id of the base validator.
         * @type {String}
         */
        this.validatorId = null;

        /** 
         * Gets or sets the id of the base emoji symbol picker box.
         * @type {String}
         */
        this.emojiSymbolPickerBoxId = null;

        /** 
         * Gets or sets the id of the base special symbol picker box.
         * @type {String}
         */
        this.specialSymbolPickerBoxId = null;

        /** 
         * Gets or sets the id of the base button tooltip manager.
         * @type {String}
         */
        this.buttonTooltipManagerId = null;

        /** 
         * Gets or sets the id of the base document tooltip manager.
         * @type {String}
         */
        this.documentTooltipManagerId = null;

        /** 
         * Gets or sets the id of the base table picker box.
         * @type {String}
         */
        this.tablePickerBoxId = null;


        /**
        * Gets or sets a custom sanitizer function to sanitize HTML. When set, overrides the built-in sanitizer.
        * The function receives an HTML string and should return a sanitized HTML string.
        * For high-security requirements, consider a dedicated library such as DOMPurify.
        * Client-side sanitization is not a substitute for server-side validation.
        * @type {Function|null}
        */
        this.sanitizer = null;

        /** --- Editor Module API --- */

        /**
         * Provides utilities for working with the DOM selection and ranges within the editor document.
         * Use this in custom commands to get, manipulate and restore the selection range.
         * @type {componyx.UI.editor_modules.SelectionRange}
         */
        this.selectionRange = null;

        /**
         * Provides utilities for querying and manipulating DOM nodes within the editor document.
         * @type {componyx.UI.editor_modules.NodeManager}
         */
        this.nodeManager = null;

        /**
         * Manages the editor document content, including inserting and sanitizing HTML.
         * @type {componyx.UI.editor_modules.ContentManager}
         */
        this.contentManager = null;

        /**
         * Provides text formatting operations on the current selection range.
         * @type {componyx.UI.editor_modules.Format}
         */
        this.format = null;

        /**
         * Manages the undo/redo history stack.
         * Call history.addItem() at the end of every custom command that mutates the document,
         * otherwise undo will not work correctly.
         * @type {componyx.UI.editor_modules.History}
         */
        this.history = null;

        /**
         * Tracks the current layout state of the editor, including the active selection context
         * (link, image, table etc.). Call layoutState.getState() after mutations that affect
         * the active layout to keep the toolbar in sync.
         * @type {componyx.UI.editor_modules.LayoutState}
         */
        this.layoutState = null;

        /**
         * Provides general editor utilities.
         * @type {componyx.UI.editor_modules.Utility}
         */
        this.utility = null;

        /** --- Editor Internal Modules --- */

        /** @ignore 
         * @type {componyx.UI.editor_modules.ComponentFactory} 
         */
        this.componentFactory = null;

        /** @ignore 
         * @type {componyx.UI.editor_modules.DialogManager} 
        */
        this.dialogManager = null;

        /** @ignore 
         * @type {componyx.UI.editor_modules.EventManager} 
        */
        this.eventManager = null;

        /** @ignore 
         * @type {componyx.UI.editor_modules.ListManager} 
        */
        this.listManager = null;

        /** @ignore 
         * @type {componyx.UI.editor_modules.MenuManager} 
         */
        this.menuManager = null;

        /** @ignore 
         * @type {componyx.UI.editor_modules.ParagraphButtons} 
         */
        this.paragraphButtons = null;

        /** @ignore 
         * @type {componyx.UI.editor_modules.Resizer} 
        */
        this.resizer = null;

        /** @ignore 
         * @type {componyx.UI.editor_modules.SourceViewBuilder} 
        */
        this.sourceViewBuilder = null;

        /** @ignore 
         * @type {componyx.UI.editor_modules.Table} 
        */
        this.table = null;

        /** @ignore 
         * @type {componyx.UI.editor_modules.Toolbar} 
        */
        this.toolbar = null;

        /** @ignore 
         * @type {componyx.UI.editor_modules.TooltipMenu} 
        */
        this.tooltipMenu = null;

        /**
         * Gets or sets a value indicating if the toolbar box is allowed to hide.
         * @private
         * @ignore
         */
        this.allowToolbarBoxHide = true;

        /**
         * Gets or sets a value indicating if the selection change event needs to be canceled.
         * @private
         * @ignore
         */
        this.cancelSelectionChange = false;

        /**
         * Gets the iframe element.
         * @private
         * @ignore
         */
        Object.defineProperty(this, '_iframe', { get: () => _iframe });

        /**
         * Selects the node (must be called with bind).
         * @ignore
         */
        this.selectNode = selectNode;

        /**
         * Gets the selected nodes.
         * @returns {any} return value
         * @ignore
         */
        this.getSelectedNodes = () =>
        {
            return _editableElement.querySelectorAll(`*[${_instance.utility.selAttr}="1"]`);
        }

        /**
         * Clears the selected nodes.
        * @ignore 
        */
        this.clearSelection = () =>
        {
            let nodes = _instance.getSelectedNodes();
            $lib.each(nodes, (node) =>
            {
                node.setAttribute(_instance.utility.selAttr, '');
            });

            _instance.paragraphButtons.hide();
        }

        /**
         * Returns a value indicating if the editor body has content.
         * @returns {boolean}
         * @ignore
         */
        this.hasContent = () => { return _instance.contentManager.hasContent(); };

        /**
         * Gets the toolbar display setting for an editable element.
         * @param {HTMLElement} el
         * @returns {ToolbarDisplayOption}
         * @ignore
         */
        this.getToolbarDisplay = (el) => { return getToolbarDisplay(el); };

        /**
         * Shows or hides the toolbar box.
         * @param {boolean} show
         * @ignore
         */
        this.setToolbarBoxDisplay = (show) => { setToolbarBoxDisplay(show); };

        /** 
         Activates the current document.
        */
        this.activateDocument = () =>
        {
            activateDocument();
        };

        /** Deactivates the current document. 
         */
        this.deactivateDocument = () =>
        {
            deactivateDocument();
        }

        /**
         * Gets the active editor based on a node.
         * @param {Node} activeNode - The node to set as active editor.
         * @returns {any} - Result of setting the active editor.
         * @ignore
         */
        this.getActiveEditor = function (activeNode)
        {
            return getActiveEditor(activeNode);
        }

        /**
         * Sets the active editor based on a node.
         * @param {Node} activeNode - The node to set as active editor.
         * @returns {any} - Result of setting the active editor.
         * @ignore
         */
        this.setActiveEditor = function (activeNode)
        {
            return setActiveEditor(activeNode);
        }

        /**
         * Binds events for selectable elements within a node.
         * @param {Node} node - The node whose child elements will receive events.
         * @ignore
         */
        this.bindNodeEvents = (node) =>
        {
            bindNodeEvents(node);
        }

        /**
         * Returns the current document object.
         * @returns {Document} - The editor's document.
         * @ignore
         */
        this.getDoc = () => 
        {
            return _doc;
        }

        /**
         * Gets the stored selection range.
         * @returns {Range}
         * @ignore
         */
        this.getStoredRange = () =>
        {
            return _range;
        }

        /**
         * Stores the selection range.
         * @returns {Range}
         * @ignore
         */
        this.storeRange = (range) =>
        {
            _range = range;
        }

        /**
         * Returns the word count container element.
         * @returns {HTMLElement}
         * @ignore
         */
        this.getWordCountElement = () =>
        {
            return _wordCountEl;
        }

        /**
         * Returns the path container element.
         * @returns {HTMLElement}
         * @ignore
         */
        this.getPathElement = () =>
        {
            return _pathEl;
        }

        /**
         * Returns a UI component by its ID.
         * @param {string} id - Component ID.
         * @returns {any} - The component from $UI.store.
         * @ignore
         */
        this.getComponent = (id) =>
        {
            return $UI.store[getId(id)];
        }

        /**
         * Gets the source viewer store.
         * @ignore
         */
        this.getSourceViewStore = () =>
        {
            return _sourceViewStore;
        }

        /**
         * Checks if block view mode is currently selected.
         * @returns {boolean} - True if block view is active, false otherwise.
         * @ignore
         */
        this.isBlockViewSelected = () =>
        {
            return isBlockViewSelected();
        }

        /**
         * Disables block view mode.
         * @ignore
         */
        this.disableBlockView = () =>
        {
            disableBlockView();
        }

        /**
         * Hide overlays.
         * @ignore
         */
        this.hideOverlays = () =>
        {
            _instance.resizer.clear(true);
            _instance.paragraphButtons.destroy(_instance.getEditorElement());
            _instance.hideTooltips();
        }

        /**
         * Hides tooltips.
         * @ignore
         */
        this.hideTooltips = () =>
        {
            _instance.tooltipMenu.tooltipManager.hideAllTooltips(true);
            _instance.componentFactory.tooltipManager.hideAllTooltips(true);
        }

        /**
         * Creates the source view builder.
         * @param {HTMLElement} source
         * @param {HTMLElement} target
         * @ignore
         */
        this.createSourceViewBuilder = (source, target) =>
        {
            createSourceViewBuilder(source, target);
        }

        /**
         * Sets the source view builder html.
         * @param {HTMLElement} source
         * @ignore
         */
        this.setSourceViewBuilderHTML = (source) =>
        {
            setSourceViewBuilderHTML(source);
        }

        /**
         * Gets the commands as sorted array.
         * @ignore
         */
        this.getSortedCommands = () =>
        {
            return _sortedCommands;
        }

        /**
        * Gets the css class if it exists and otherwise the default css class.
        * @returns {String} The css class.
        * @ignore
        */
        this.getCssClass = (cssClassValue) =>
        {
            const classOption = _instance.classOption;
            const key = Object.keys(classOption).find(key => classOption[key] === cssClassValue);
            const propertyName = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(''); // Convert enum key to a proper property format (e.g., 'BUILD_PANE' -> 'BuildPane')

            return _instance[`cssClass${propertyName}`] || cssClassValue;
        }

        /**
         * Gets the Sanitizer object to sanitize HTML.
         * @returns {componyx.bindary_modules.Sanitizer} The Sanitizer object.
         * @ignore
         */
        this.getSanitizer = function ()
        {
            if (!_sanitizer)
            {
                _sanitizer = new Sanitizer();
                _instance.events.onCreateSanitizer.fire(_instance, { sanitizer: _sanitizer });
            }

            return _sanitizer;
        }

        /**
         * Callback for image-related events.
         * @typedef {function} componyx.UI.Editor.ImageEventHandler
         * @param {componyx.UI.Editor} editor - The editor instance firing the event.
         * @param {componyx.UI.Editor.ImageEventArgs} eventArgs - The event details.
         */

        /**
         * @typedef {Object} componyx.UI.Editor.ImageEventArgs
         * @property {HTMLImageElement} imageElement - The image element involved.
         * @property {File|null} [file] - The image file if available, otherwise null.
         */

        /**
         * Callback for paste events.
         * @typedef {function} componyx.UI.Editor.PasteEventHandler
         * @param {componyx.UI.Editor} editor - The editor instance firing the event.
         * @param {componyx.UI.Editor.PasteEventArgs} eventArgs - The event details.
         */

        /**
         * @typedef {Object} componyx.UI.Editor.PasteEventArgs
         * @property {ClipboardEvent} event - The native paste event.
         */

        /**
         * Callback for base editor events (stylesheets loaded, undo, redo, selection change).
         * @typedef {function} componyx.UI.Editor.BaseEventHandler
         * @param {componyx.UI.Editor} editor - The editor instance firing the event.
         */

        /**
         * @typedef {function} componyx.UI.Editor.LinkDialogShowEventHandler
         * @param {componyx.UI.Editor} editor - The editor instance firing the event.
         * @param {componyx.UI.Editor.LinkDialogShowEventArgs} eventArgs - The event details.
         */

        /**
         * @typedef {Object} componyx.UI.Editor.LinkDialogShowEventArgs
         * @property {HTMLElement} container - The dialog content container element.
         * @property {componyx.UI.Editor.ActiveLinkItem|null} activeItem - The currently active link in the editor, or null if no link is selected.
         * @property {componyx.UI.Editor.ConfirmLinkSelectionCallback} confirmSelection - A function to confirm the selected link and insert it into the document.
         */

        /**
         * @typedef {Object} componyx.UI.Editor.ActiveLinkItem
         * @property {string} href - The URL or path of the link.
         * @property {string} text - The link text.
         * @property {string} title - The link title.
         * @property {string} target - The link target.
         */

        /**
         * @callback componyx.UI.Editor.ConfirmLinkSelectionCallback
         * @param {String} url - The URL or path of the selected image.
         * @param {String} [linkText] - The link text.
         * @param {String} [linkTitle] - The link title.
         */

        /**
         * @typedef {function} componyx.UI.Editor.ImageDialogShowEventHandler
         * @param {componyx.UI.Editor} editor - The editor instance firing the event.
         * @param {componyx.UI.Editor.ImageDialogShowEventArgs} eventArgs - The event details.
         */

        /**
         * @typedef {Object} componyx.UI.Editor.ImageDialogShowEventArgs
         * @property {HTMLElement} container - The dialog content container element.
         * @property {componyx.UI.Editor.ActiveImageItem|null} activeItem - The currently active image in the editor, or null if no image is selected.
         * @property {componyx.UI.Editor.ConfirmImageSelectionCallback} confirmSelection - A function to confirm the selected image and insert it into the document.
         */

        /**
         * @typedef {Object} componyx.UI.Editor.ActiveImageItem
         * @property {string} src - The URL or path of the image.
         * @property {string} alt - The alternative text.
         * @property {number} width - The image width.
         * @property {number} height - The image height.
         * @property {string} caption - The caption text.
         */

        /**
         * @callback componyx.UI.Editor.ConfirmImageSelectionCallback
         * @param {String} url - The URL or path of the selected image.
         * @param {String} [alt] - The alternative text.
         * @param {String} [caption] - The caption text.
         */

        /**
         * @typedef {function} componyx.UI.Editor.MediaDialogShowEventHandler
         * @param {componyx.UI.Editor} editor - The editor instance firing the event.
         * @param {componyx.UI.Editor.MediaDialogShowEventArgs} eventArgs - The event details.
         */

        /**
         * @typedef {Object} componyx.UI.Editor.MediaDialogShowEventArgs
         * @property {HTMLElement} container - The dialog content container element.
         * @property {componyx.UI.Editor.ActiveMediaItem|null} activeItem - The currently active media in the editor, or null if no media is selected.
         * @property {componyx.UI.Editor.ConfirmMediaSelectionCallback} confirmSelection - A function to confirm the selected media and insert it into the document.
         */

        /**
         * @typedef {Object} componyx.UI.Editor.ActiveMediaItem
         * @property {string|null} src - The URL or path of the media, or null if embedded.
         * @property {string|null} embed - The embed HTML, or null if a URL is used.
         * @property {string} width - The media width.
         * @property {string} caption - The caption text.
         */

        /**
         * @callback componyx.UI.Editor.ConfirmMediaSelectionCallback
         * @param {String} url - The URL or path of the selected media.
         */

        /**
         * Callback for sanitizer creation events.
         * @typedef {function} componyx.UI.Editor.CreateSanitizerEventHandler
         * @param {componyx.UI.Editor} editor - The editor instance firing the event.
         * @param {componyx.UI.Editor.CreateSanitizerEventArgs} eventArgs - The event details.
         */

        /**
         * @typedef {Object} componyx.UI.Editor.CreateSanitizerEventArgs
         * @property {componyx.base_modules.Sanitizer} sanitizer - The created sanitizer class instance.
         */

        /**
         * Callback for save events.
         * @typedef {function} componyx.UI.Editor.SaveEventHandler
         * @param {componyx.UI.Editor} editor - The editor instance firing the event.
         * @param {componyx.UI.Editor.SaveEventArgs} eventArgs - The event details.
         */

        /**
         * @typedef {Object} componyx.UI.Editor.SaveEventArgs
         * @property {String} html - The document HTML content.
         */

        /**
         * @class
         * @augments componyx.UI.base.Events
         * @memberof componyx.UI.Editor
         * @property {componyx.UI.base.Event} onStylesheetsLoaded                                                                - Fires when all included iframe stylesheets are loaded. @see {@link componyx.UI.Editor.BaseEventHandler}
         * @property {componyx.UI.base.Event} onImageDrop                                                                        - Fires when an image is dragged and dropped into the editor. @see {@link componyx.UI.Editor.ImageEventHandler}
         * @property {componyx.UI.base.Event} onImageSelect                                                                      - Fires when an image is selected or URL provided. @see {@link componyx.UI.Editor.ImageEventHandler}
         * @property {componyx.UI.base.Event} onImageLoad                                                                        - Fires when an image is fully loaded. @see {@link componyx.UI.Editor.ImageEventHandler}
         * @property {componyx.UI.base.Event} onPaste                                                                            - Fires on paste. @see {@link componyx.UI.Editor.PasteEventHandler}
         * @property {componyx.UI.base.Event} onUndo                                                                             - Fires on undo. @see {@link componyx.UI.Editor.BaseEventHandler}
         * @property {componyx.UI.base.Event} onRedo                                                                             - Fires on redo. @see {@link componyx.UI.Editor.BaseEventHandler}
         * @property {componyx.UI.base.Event} onSelectionChange                                                                  - Fires on text selection change. @see {@link componyx.UI.Editor.BaseEventHandler}
         * @property {componyx.UI.base.Event} onSave                                                                             - Fires on save. @see {@link componyx.UI.Editor.SaveEventHandler}
         * @property {componyx.UI.base.Event} onLinkDialogShow                                                                   - Fires when the image dialog content is rendered. @see {@link componyx.UI.Editor.LinkDialogShowEventHandler}
         * @property {componyx.UI.base.Event} onImageDialogShow                                                                  - Fires when the image dialog content is rendered. @see {@link componyx.UI.Editor.ImageDialogShowEventHandler}
         * @property {componyx.UI.base.Event} onMediaDialogShow                                                                  - Fires when the image dialog content is rendered. @see {@link componyx.UI.Editor.MediaDialogShowEventHandler} 
         * @property {componyx.UI.base.Event} onCreateSanitizer                                                                  - Fires when the default HTML sanitizer is created, allowing optional configuration. @see {@link componyx.UI.Editor.CreateSanitizerEventHandler}
         * @see {@link componyx.UI.base.Events}
         */
        function EditorEvents(events)
        {
            Object.assign(this, events);
            this.onStylesheetsLoaded = $base.static.createEvent('onStylesheetsLoaded');
            this.onImageDrop = $base.static.createEvent('onImageDrop');
            this.onImageSelect = $base.static.createEvent('onImageSelect');
            this.onImageLoad = $base.static.createEvent('onImageLoad');
            this.onPaste = $base.static.createEvent('onPaste');
            this.onUndo = $base.static.createEvent('onUndo');
            this.onRedo = $base.static.createEvent('onRedo');
            this.onSelectionChange = $base.static.createEvent('onSelectionChange');
            this.onSave = $base.static.createEvent('onSave');
            this.onLinkDialogShow = $base.static.createEvent('onLinkDialogShow');
            this.onImageDialogShow = $base.static.createEvent('onImageDialogShow');
            this.onMediaDialogShow = $base.static.createEvent('onMediaDialogShow');
            this.onCreateSanitizer = $base.static.createEvent('onCreateSanitizer');
        };

        /**
         * Editor events
         * @type {componyx.UI.Editor.EditorEvents}
         */
        this.events = new EditorEvents(this.events);

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        /** --- public API Methods --- */

        /**
        * Adds a content editable element
        * @param {EditableElement} config The settings of the editable element.
        */
        this.addEditableElement = function (config)
        {
            const element = config.element || $lib('#' + config.id),
                exists = this.editableElements.some(c =>
                {
                    const existing = c.element || $lib('#' + c.id);
                    return existing === element;
                });

            if (exists)
                return;

            const active = { doc: _doc, el: _editableElement };

            this.editableElements.push(config);
            setupEditor(element);

            if (active.el?.isConnected)
            {
                _doc = active.doc;
                _editableElement = active.el;
            }
        }

        /**
        * Undoes an action.
        */
        this.undo = function () { _instance.history.undo(_editableElement); }
        /**
         * Redoes an action.
         */
        this.redo = function () { _instance.history.redo(_editableElement); }
        /**
         * Set/unsets bold on the currently selected text range.
        */
        this.bold = () => { toggleLayoutNode({ tag: 'strong' }); }
        /**
         * Set/unsets italic on the currently selected text range.
        */
        this.italic = () => { toggleLayoutNode({ tag: 'em' }); }
        /**
         * Set/unsets underline on the currently selected text range.
        */
        this.underline = () => { toggleLayoutNode({ tag: 'u' }); }
        /**
         * Set/unsets strike-through on the currently selected text range.
        */
        this.strikeThrough = () => { toggleLayoutNode({ tag: 's' }); }
        /**
         * Set/unsets sub on the currently selected text range.
        */
        this.sub = () => { toggleLayoutNode({ tag: 'sub' }); }
        /**
         * Set/unsets super on the currently selected text range.
        */
        this.sup = () => { toggleLayoutNode({ tag: 'sup' }); }
        /**
         * Increases/decreases the indent on the current root block element.
         * @param {String} value A positive or negative CSS value.
        */
        this.indent = (value) => { indent(value); }
        /**
         * Clears the formatting on the currently selected text range.
        */
        this.clearFormat = () => { clearFormat(); }
        /**
         * Copies the formatting on the currently selected text range.
         * @returns {Node[]} A list of formatting nodes currently active on the selected text range.
        */
        this.copyFormat = () => { return copyFormat(); }
        /**
         * Pastes the formatting on the currently selected text range.
         * @param {Node[]} format A list of formatting nodes to apply to the selected text range.
        */
        this.pasteFormat = (format) => { _instance.format.pasteFormat(format); }
        /**
         * Converts the root block-level nodes in the currently selected text range to the specified block-level tag.
         * @param {String} tag The block-level element tag.
        */
        this.setBlock = (tag) => { setBlock(tag); }
        /**
         * Surrounds/unsurrounds the currently selected text range with the specified layout node.
         * @param {String} tag The layout-node tag.
         * @param {Object<string, any>} styles The CSS styles.
        */
        this.toggleLayoutNode = (settings) => { toggleLayoutNode(settings) };
        /**
         * Inserts HTML on the currently selected text range.
         * @param {ElementSettings} settings The element settings.
        */
        this.insert = (settings) => { insertHTML(settings); }
        /**
         * Shows/hides the HTML source viewer.
         * @param {Boolean} on Use value null to toggle, true to force on, false to force off.
        */
        this.toggleSourceView = (on = null) =>
        {
            toggleMenuButton($UI.store[getId('source')], on);
            sourceView();
        }
        /**
         * Enables/disables the visibility of block level elements in the document.
         * @param {Boolean} on Use value null to toggle, true to force on, false to force off.
         */
        this.toggleBlockView = (on = null) =>
        {
            toggleMenuButton($UI.store[getId('blockView')], on);
            blockView();
        }
        /**
         * Expand/collapse the editor view to fullscreen.
         * @param {Boolean} on Use value null to toggle, true to force on, false to force off.
         */
        this.toggleExpandedView = (on = null) =>
        {
            toggleMenuButton($UI.store[getId('expand')], on);
            expandedView();
        }
        /**
         * Shows/hides the document in preview modus.
         * @param {Boolean} on Use value null to toggle, true to force on, false to force off.
         */
        this.togglePreview = (on = null) =>
        {
            toggleMenuButton($UI.store[getId('preview')], on);
            preview();
        }
        /**
         * Saves the document.
        */
        this.save = () => { save(); }
        /**
         * Exports the document. Configure settings via PDFExportSettings.
        */
        this.exportToPDF = () => { exportToPDF(); }
        /**
         * Prints the document.
        */
        this.print = () => { print(); }

        /**
         * Gets a value indicating if the editor has editable elements.
         * @returns {boolean}
         */
        this.hasEditables = () => { return hasEditables(); }

        /**
         * Show bookmark dialog.
         */
        this.bookmark = () => { bookmark(); }

        /**
         * Show the insert link dialog to create a link for the selection range.
         */
        this.insertLink = () => { insertLink(); }

        /**
         * Removes the active link in the selection range.
         */
        this.removeLink = () => { removeLink(); }

        /**
         * Show the insert image dialog to create a link for the selection range.
         */
        this.insertImage = () => { insertImage(); };

        /**
         * Removes the active image in the selection range.
         */
        this.removeImage = () => { removeImage(); };

        /**
         * Show the insert media dialog to create a link for the selection range.
         */
        this.insertMedia = () => { insertMedia(); };

        /**
         * Removes the active media in the selection range.
         */
        this.removeMedia = () => { removeMedia(); }

        /**
         * Sets the text-align value on the nodes in the selection range.
         * @param {Number} value
         */
        this.align = (value) => { _instance.format.setBlockStyle('text-align', value); }

        /**
         * Sets the line-height on the nodes in the selection range.
         * @param {Number} value
         */
        this.lineHeight = (value) => { _instance.format.setBlockStyle('line-height', value); }

        /**
         * Sets the font family.
         * @param {any} font
         * @ignore
         */
        this.setFontFamily = (font) =>
        {
            toggleLayoutNode({ tag: 'span', styles: { 'font-family': font } });
        }

        /**
         * Sets the font size.
         * @param {any} size
         * @ignore
         */
        this.setFontSize = (size) =>
        {
            toggleLayoutNode({ tag: 'span', styles: { 'font-size': size } });
        }

        /**
         * Sets the font color.
         * @param {any} cmd
         * @ignore
         */
        this.setFontColor = (cmd) =>
        {
            let button = _instance.getComponent(cmd.id);

            toggleLayoutNode({ tag: 'span', styles: { 'color': button.__color } });
        }

        /**
         * Sets the font BG color.
         * @param {any} cmd
         * @ignore
         */
        this.setFontBGColor = (cmd) =>
        {
            let button = _instance.getComponent(cmd.id);

            toggleLayoutNode({ tag: 'span', styles: { 'background-color': button.__color } });
        }

        /**
         * Sets the style.
         * @param {any} styleItem
         * @ignore
         */
        this.setStyle = (styleItem) =>
        {
            insertHTML(styleItem.elementSettings);
        }

        /**
        * Editor commands.
        * @type {Object.<string, CommandSettings>}
        */
        this.commands =
        {
            undo:
            {
                command: _instance.undo,
                shortcutKey: 'z',
                cssClassIcon: _iconPrefix + 'undo',
                show: true,
                buttonId: null,
                group: 0,
                position: 0
            },
            redo:
            {
                command: _instance.redo,
                shortcutKey: 'y',
                cssClassIcon: _iconPrefix + 'redo',
                show: true,
                buttonId: null,
                group: 0,
                position: 0
            },

            bold:
            {
                id: 'strong',
                command: _instance.bold,
                shortcutKey: 'b',
                cssClassIcon: _iconPrefix + 'bold',
                show: true,
                isActive: isTagMatch.bind(_instance, 'strong'),
                type: 1,
                buttonId: null,
                group: 1,
                position: 0,
                elementSettings: { tag: 'strong' }
            },
            italic:
            {
                id: 'em',
                command: _instance.italic,
                shortcutKey: 'i',
                cssClassIcon: _iconPrefix + 'italic',
                show: true,
                isActive: isTagMatch.bind(_instance, 'em'),
                type: 1,
                buttonId: null,
                group: 1,
                position: 0,
                elementSettings: { tag: 'em' }
            },
            underline:
            {
                id: 'u',
                command: _instance.underline,
                shortcutKey: 'u',
                cssClassIcon: _iconPrefix + 'underline',
                show: true,
                isActive: isTagMatch.bind(_instance, 'u'),
                type: 1,
                buttonId: null,
                group: 1,
                position: 0,
                elementSettings: { tag: 'u' }
            },
            strikeThrough:
            {
                id: 's',
                command: _instance.strikeThrough,
                cssClassIcon: _iconPrefix + 'strikethrough',
                show: true,
                isActive: isTagMatch.bind(_instance, 's'),
                type: 1,
                buttonId: null,
                group: 1,
                position: 0,
                elementSettings: { tag: 's' }
            },
            fontColor:
            {
                command: _instance.setFontColor,
                cssClassIcon: _iconPrefix + 'font-color',
                show: true,
                buttonId: null,
                type: 1,
                boxId: 'ColorSwatch',
                cssVariable: '--font-color',
                group: 1,
                position: 0
            },
            fontBGColor:
            {
                command: _instance.setFontBGColor,
                cssClassIcon: _iconPrefix + 'font-bgcolor',
                show: true,
                buttonId: null,
                type: 1,
                boxId: 'ColorSwatch',
                cssVariable: '--font-bg-color',
                group: 1,
                position: 0
            },

            block:
            {
                command: null,
                show: true,
                buttonId: null,
                menuId: null,
                menuItemId: 'Block',
                cssClass: 'block',
                contentAlign: 0,
                group: 2,
                position: 0
            },
            fontFamily:
            {
                command: null,
                show: true,
                buttonId: null,
                menuId: null,
                menuItemId: 'FontFamily',
                cssClass: 'font-family',
                contentAlign: 0,
                group: 2,
                position: 0
            },
            fontSize:
            {
                command: null,
                show: true,
                buttonId: null,
                menuId: null,
                menuItemId: 'FontSize',
                cssClass: 'font-size',
                contentAlign: 0,
                group: 2,
                position: 0
            },
            style:
            {
                command: null,
                show: false,
                buttonId: null,
                menuId: null,
                menuItemId: 'Style',
                cssClass: 'style',
                contentAlign: 0,
                group: 2,
                position: 0
            },

            align:
            {
                command: null,
                cssClassIcon: _iconPrefix + 'align-left',
                show: true,
                buttonId: null,
                menuItemId: 'Align',
                group: 3,
                position: 0
            },

            lineHeight:
            {
                command: null,
                cssClassIcon: _iconPrefix + 'line-height',
                show: true,
                buttonId: null,
                menuItemId: 'LineHeight',
                group: 3,
                position: 0
            },

            indentMin:
            {
                command: indent.bind(_instance, '-' + _instance.indentValue),
                cssClassIcon: _iconPrefix + 'indent-min',
                show: true,
                buttonId: null,
                group: 3,
                position: 0
            },
            indentPlus:
            {
                command: indent.bind(_instance, _instance.indentValue),
                cssClassIcon: _iconPrefix + 'indent-plus',
                show: true,
                buttonId: null,
                group: 3,
                position: 0
            },

            orderedList:
            {
                command: toggleListItem.bind(_instance, 'OL', null),
                cssClassIcon: _iconPrefix + 'ol',
                show: true,
                buttonId: null,
                menuId: null,
                menuItemId: 'OrderedList',
                group: 4,
                position: 0
            },
            unorderedList:
            {
                command: toggleListItem.bind(_instance, 'UL', null),
                cssClassIcon: _iconPrefix + 'ul',
                show: true,
                buttonId: null,
                menuId: null,
                menuItemId: 'UnorderedList',
                group: 4,
                position: 0
            },
            link:
            {
                command: insertLink,
                shortcutKey: 'k',
                cssClassIcon: _iconPrefix + 'link',
                show: true,
                isActive: isLink,
                selectable: true,
                buttonId: null,
                group: 5,
                position: 0
            },
            image:
            {
                command: insertImage,
                cssClassIcon: _iconPrefix + 'image',
                show: true,
                isActive: isImage,
                getNode: getImageFromNode.bind(_instance),
                selectable: true,
                buttonId: null,
                group: 5,
                position: 0
            },
            media:
            {
                command: insertMedia,
                cssClassIcon: _iconPrefix + 'media',
                show: true,
                isActive: isMedia,
                selectable: true,
                buttonId: null,
                group: 5,
                position: 0
            },
            table:
            {
                command: null,
                cssClassIcon: _iconPrefix + 'table',
                show: true,
                selectable: true,
                buttonId: null,
                boxId: 'TablePicker',
                group: 5,
                position: 0
            },

            subscript:
            {
                id: 'sub',
                command: _instance.sub,
                cssClassIcon: _iconPrefix + 'sub',
                show: true,
                isActive: isTagMatch.bind(_instance, 'sub'),
                type: 1,
                buttonId: null,
                group: 6,
                position: 0,
                elementSettings: { tag: 'sub' }
            },
            superscript:
            {
                id: 'sup',
                command: _instance.sup,
                cssClassIcon: _iconPrefix + 'super',
                show: true,
                isActive: isTagMatch.bind(_instance, 'sup'),
                type: 1,
                buttonId: null,
                group: 6,
                position: 0,
                elementSettings: { tag: 'sup' }
            },
            copyFormat:
            {
                command: copyFormat,
                cssClassIcon: _iconPrefix + 'brush',
                show: true,
                buttonId: null,
                group: 6,
                position: 0
            },
            clearFormat:
            {
                command: clearFormat,
                cssClassIcon: _iconPrefix + 'formatting-clear',
                show: true,
                buttonId: null,
                group: 6,
                position: 0
            },

            bookmark:
            {
                command: bookmark,
                cssClassIcon: _iconPrefix + 'bookmark',
                show: true,
                isActive: isBookmark,
                buttonId: null,
                group: 7,
                position: 0
            },
            horizontalLine:
            {
                command: insertHR,
                cssClassIcon: _iconPrefix + 'line',
                show: true,
                buttonId: null,
                group: 7,
                position: 0
            },
            pageBreak:
            {
                command: insertPageBreak,
                cssClassIcon: _iconPrefix + 'pagebreak',
                show: true,
                buttonId: null,
                group: 7,
                position: 0
            },

            source:
            {
                command: sourceView,
                cssClassIcon: _iconPrefix + 'source',
                show: true,
                type: 1,
                buttonId: null,
                group: 8,
                position: 0
            },
            expand:
            {
                command: expandedView,
                cssClassIcon: _iconPrefix + 'expand',
                show: true,
                buttonId: null,
                type: 1,
                group: 8,
                position: 0
            },
            preview:
            {
                command: preview,
                cssClassIcon: _iconPrefix + 'preview',
                show: true,
                buttonId: null,
                type: 1,
                group: 8,
                position: 0
            },
            save:
            {
                command: save,
                cssClassIcon: _iconPrefix + 'save',
                show: true,
                buttonId: null,
                group: 8,
                position: 0
            },
            export:
            {
                command: exportToPDF,
                cssClassIcon: _iconPrefix + 'pdf',
                show: true,
                buttonId: null,
                group: 8,
                position: 0
            },
            print:
            {
                command: print,
                cssClassIcon: _iconPrefix + 'print',
                show: true,
                buttonId: null,
                group: 8,
                position: 0
            },

            more:
            {
                command: null,
                cssClass: 'more',
                cssClassIcon: _iconPrefix + 'more',
                show: true,
                buttonId: null,
                type: 1,
                boxId: 'ToolbarMore',
                expandDirection: 'right',
                group: 9,
                position: 0
            },
            blockView:
            {
                command: blockView,
                cssClassIcon: _iconPrefix + 'block',
                show: true,
                type: 1,
                buttonId: null,
                group: 10,
                position: 0
            },
            special:
            {
                command: specialSymbols,
                cssClassIcon: _iconPrefix + 'omega',
                show: true,
                buttonId: null,
                group: 10,
                position: 0
            },
            emoji:
            {
                command: emojiSymbols,
                cssClassIcon: _iconPrefix + 'emoji',
                show: true,
                buttonId: null,
                group: 10,
                position: 0
            }
        }

        /** 
         * Sets the link dialog content template.
         * Available placeholders:
         * - {href}      - The href field.
         * - {text}      - The text field.
         * - {title}     - The title field.
         * - {target}    - The target field.
         * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
         */
        this.setLinkDialogContentTemplate = function (content)
        {
            _instance.addTemplate('LinkDialogContent', content, false);
        }

        /** 
         * Sets the image dialog content template.
         * Available placeholders:
         * - {source}    - The source field.
         * - {alt}       - The alternative text field.
         * - {width}     - The width field.
         * - {height}    - The height field.
         * - {caption}   - The caption field.
         * - {alignment} - The alignment radio buttons.
         * - {inline}    - The inline checkbox (renders in footer).
         * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
         */
        this.setImageDialogContentTemplate = function (content)
        {
            _instance.addTemplate('ImageDialogContent', content, false);
        }

        /** 
         * Sets the media dialog content template.
         * Available placeholders:
         * - {source}    - The source field.
         * - {width}     - The width field.
         * - {caption}   - The caption field.
         * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
         */
        this.setMediaDialogContentTemplate = function (content)
        {
            _instance.addTemplate('MediaDialogContent', content, false);
        }

        /** 
         * Sets the table dialog Table panel content template.
         * Available placeholders:
         * - {width}       - The width field.
         * - {alignment}   - The alignment field.
         * - {bgColor}     - The background color field.
         * - {borderWidth} - The border width field.
         * - {borderStyle} - The border style field.
         * - {borderColor} - The border color field.
         * - {cellSpacing} - The cell spacing field.
         * - {caption}     - The caption field.
         * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
         */
        this.setTableDialogTableTemplate = function (content)
        {
            _instance.addTemplate('TableDialogTable', content, false);
        }

        /** 
         * Sets the table dialog Row panel content template.
         * Available placeholders:
         * - {isHeader}    - The header row toggle.
         * - {isFooter}    - The footer row toggle.
         * - {height}      - The height field.
         * - {bgColor}     - The background color field.
         * - {borderStyle} - The border style field.
         * - {borderColor} - The border color field.
         * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
         */
        this.setTableDialogRowTemplate = function (content)
        {
            _instance.addTemplate('TableDialogRow', content, false);
        }

        /** 
         * Sets the table dialog Cell panel content template.
         * Available placeholders:
         * - {width}          - The width field.
         * - {height}         - The height field.
         * - {verticalAlign}  - The vertical alignment field.
         * - {horizontalAlign}- The horizontal alignment field.
         * - {bgColor}        - The background color field.
         * - {borderWidth}    - The border width field.
         * - {borderStyle}    - The border style field.
         * - {borderColor}    - The border color field.
         * - {padding}        - The padding field.
         * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
         */
        this.setTableDialogCellTemplate = function (content)
        {
            _instance.addTemplate('TableDialogCell', content, false);
        }

        /** 
        * Sets the word count template. The template supports the below listed placeholders.
        * - {words} This value will be replaced with the word count.
        * - {chars} This value will be replaced with the character count.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        this.setWordCountTemplate = function (content)
        {
            _instance.addTemplate('WordCount', content, false);
        }

        /** 
        * Sets the menu tooltip template. The template supports the below listed placeholders.
        * - {href} This value will be replaced with link href.
        * - {editButton} This value will be replaced with the edit link/image/media button.
        * - {removeButton} This value will be replaced with the remove link/image/media button.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        this.setTooltipMenuTemplate = function (content)
        {
            _instance.addTemplate('TooltipMenu', content, false);
        }

        /**
         * Adds a toolbar command.
         * @param {String} name The unique command name.
         * @param {CommandSettings} settings The command settings.
         */
        this.addCommand = function (name, settings)
        {
            _instance.commands[name] = settings;
        }

        /**
         * Initializes the editor with ONLY the specified commands set to enabled (or disabled when the enable parameter is set to false).
         * For other commands, the opposite action is applied.
         * Special keywords can be used to refer to predefined groups of commands:
         *   - '*core'       : ['undo','redo','bold','italic','underline','strikeThrough','align','indentMin','indentPlus','copyFormat','clearFormat']
         *   - '*list'       : ['orderedList','unorderedList']
         *   - '*font'       : ['fontSize','fontFamily']
         *   - '*font-color' : ['fontColor','fontBGColor']
         * @param {String[]} commands The unique command names or special keywords to enable/disable.
         * @param {Boolean} [enable=true] If true, specified commands are enabled; if false, they are disabled.
         */
        this.initCommands = function (commands, enable = true)
        {
            const special = {
                '*core': ['undo', 'redo', 'bold', 'italic', 'underline', 'strikeThrough', 'align', 'indentMin', 'indentPlus', 'copyFormat', 'clearFormat'],
                '*list': ['orderedList', 'unorderedList'],
                '*font': ['fontSize', 'fontFamily'],
                '*font-color': ['fontColor', 'fontBGColor']
            },
                commandSet = new Set(commands.flatMap(cmd => special[cmd] || cmd));

            for (const key in _instance.commands)
            {
                _instance.commands[key].show = commandSet.has(key) ? enable : !enable;
            }
        };


        /**
         * Gets the active content-editable editor element (when iframe is set to true this will return the document.body element of the iframe).
         * @returns {String} The editor HTML content.
         */
        this.getEditorElement = function ()
        {
            return _editableElement;
        }

        /**
         * Sets focus to the editable element.
         * @param {boolean} [caretAtEnd=true] A value indicating to set the caret at the end of the content.
         */
        this.focus = function (caretAtEnd = true)
        {
            _editableElement.focus();

            if (caretAtEnd)
            {
                let sel = _instance.selectionRange.getSelection();
                sel.selectAllChildren(_editableElement.lastElementChild || _editableElement);
                sel.collapseToEnd();
            }
        }

        /**
         * Cleans the HTML source.
         * @param {boolean} clearZeroWidthCharacters
         */
        this.cleanSource = (clearZeroWidthCharacters = true) =>
        {
            _instance.contentManager.cleanSource(null, clearZeroWidthCharacters);
        }

        /**
         * Gets the editor content (equal to getContent()).
         * @param {HTMLElement|null} [editableElement] The specific editable element to get content from. Only applicable if this editor instance uses multiple editable elements.
         * @returns {String} The editor HTML content.
         */
        this.getValue = (editableElement) => this.getContent(editableElement);

        /**
         * Gets the editor content.
         * @param {HTMLElement|null} [editableElement] The specific editable element to get content from. Only applicable if this editor instance uses multiple editable elements.
         * @returns {String} The editor HTML content.
         */
        this.getContent = function (editableElement)
        {
            return _instance.contentManager.getContent(editableElement);
        }

        /**
         * Sets the editor content (equal to setContent()).
         * @param {String} content The HTML content.
         * @param {HTMLElement|null} [editableElement] The specific editable element to set content for. Only applicable if this editor instance uses multiple editable elements.
         */
        this.setValue = (content, editableElement) => this.setContent(content, editableElement);

        /**
         * Sets the editor content.
         * @param {String} content The HTML content.
         * @param {HTMLElement|null} [editableElement] The specific editable element to set content for. Only applicable if this editor instance uses multiple editable elements.
         * @param {Boolean} sanitize A value indicating if the content should be sanitized.
         */
        this.setContent = function (content, editableElement, sanitize = true)
        {
            editableElement = editableElement || _editableElement;
            editableElement.innerHTML = _instance.sanitizer ? _instance.sanitizer(content) : _instance.getSanitizer().sanitize(content);
            _instance.contentManager.ensureDocStructure(editableElement);
        }

        /**
         * Gets the active selection range.
         * @returns {Range} The active selection range.
         */
        this.getRange = function ()
        {
            activateDocument();
            let range = _instance.selectionRange.getRange();
            deactivateDocument();
            return range;
        }

        /**
         * Sets the state of the toolbar button.
         * @param {boolean} enable A value that indicates if buttons are enabled or disabled.
         * @param {String[]} exclude A list of command id's to exclude.
         */
        this.setToolbarButtonState = function (enable, exclude = [])
        {
            setToolbarButtonState(enable, exclude);
        }

        /** 
        * Renders the component
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'editor', _themeOption.DEFAULT);
                return;
            }

            // render logic after loading resources
            if (!_instance.hasTemplate('WordCount'))
                _instance.addTemplate('WordCount', '{words} words, {chars} characters', false);

            $lib.each(_instance.extraCommands, (settings, name) => { _instance.addCommand(name, settings); });

            if (!$lib.isEmpty(_instance.visibleCommands))
                _instance.initCommands(_instance.visibleCommands);

            instantiateModules();
            draw();
        }

        /** 
        * Executes the post render procedure.
        */
        this.postRender = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING) // extra safety to never execute a postRender when the component state is incorrect
                return;

            if (!_instance.iframe)
            {
                if (hasEditables())
                {
                    $lib.each(_instance.editableElements, (item) =>
                    {
                        setupEditor(item.element || $lib('#' + item.id));
                    });

                    _instance.element.classList.add(_instance.getCssClass(_instance.classOption.HIDDEN));
                }
                else
                {
                    setupEditor(_editor, false);
                    setTimeout(function ()
                    {
                        _doc.defaultView.focus();
                        _editableElement.focus();
                    });
                }
            }

            $base.methods.postRender.call(this);
            _instance.layoutState.updateLayoutSettings();
        }

        /** 
         * Destroys the component.
         * @see {@link componyx.UI.base.methods#destroy}
         */
        this.destroy = function (...args)
        {
            dispose();
            $base.methods.destroy.call(this, ...args);
        }

        /** Initializes script and css. 
         * @ignore
         */
        function preRender()
        {
            var script = ['Button', 'FormField', 'ComboBox', 'Dialog', 'Menu', 'ColorButton', 'ColorPicker', 'NumericBox', 'Validator', 'TooltipManager'];
            return ['Editor', script];
        }

        /** Initializes the editor. 
         * @ignore
         */
        function init()
        {
            activateDocument();

            if (_instance.content)
                _instance.setContent(content);

            deactivateDocument();

            if (_instance.renderState == 2)
                _instance.layoutState.updateLayoutSettings();
        }


        function instantiateModules()
        {
            _instance.utility = new Utility(_instance);
            _instance.componentFactory = new ComponentFactory(_instance);
            _instance.contentManager = new ContentManager(_instance);
            _instance.dialogManager = new DialogManager(_instance);
            _instance.eventManager = new EventManager(_instance);
            _instance.format = new Format(_instance);
            _instance.history = new History(_instance);
            _instance.layoutState = new LayoutState(_instance);
            _instance.listManager = new ListManager(_instance);
            _instance.menuManager = new MenuManager(_instance);
            _instance.nodeManager = new NodeManager(_instance);
            _instance.paragraphButtons = new ParagraphButtons(_instance);
            _instance.resizer = new Resizer(_instance);
            _instance.selectionRange = new SelectionRange(_instance);
            _instance.sourceViewBuilder = new SourceViewBuilder(_instance);
            _instance.table = new Table(_instance);
            _instance.toolbar = new Toolbar(_instance);
            _instance.tooltipMenu = new TooltipMenu(_instance);
        }

        /** Draws the editor. 
         *  @ignore
         */
        async function draw()
        {
            _toolbar = _instance.toolbar.createToolbar();

            _instance.layoutState.init();

            if (hasEditables() || _instance.toolbarDisplay == _toolbarDisplayOption.FOOTER)
                _instance.toolbar.createToolbarBox();

            if (!hasEditables())
            {
                createEditor();
                createFooter();

                if (_instance.toolbarDisplay == _toolbarDisplayOption.FOOTER) // set toolbar as footer
                    _instance.element.appendChild(_toolbar);
            }
            else
            {
                _instance.sourceViewInDialog = true;
            }

            if (_instance.sourceViewInDialog)
                _instance.dialogManager.createSourceDialog();

            await _instance.menuManager.createMenu();
            _instance.componentFactory.createColorSwatch();
            _instance.componentFactory.createColorPicker();
            await _instance.toolbar.createEmojiSymbolPicker();
            await _instance.toolbar.createSpecialSymbolPicker();
            _instance.table.createPicker();
            _instance.renderChildren();
        }

        function hasEditables()
        {
            return !$lib.isEmpty(_instance.editableElements);
        }

        /**
         * Creates the source view builder.
         * @param {any} source
         * @param {any} target
         * @ignore
         */
        function createSourceViewBuilder(source, target)
        {
            let viewer = new SourceViewBuilder(target, `${_instance.utility.buttonCss} ${_instance.getThemeCSS()} edit`, 'span', _instance.labels.sourceViewRootItem, _instance.utility.voidNodeRegEx);
            viewer.build(source.cloneNode(true));
            _sourceViewStore.set(source, viewer);
        }

        /**
         * Sets the source view HTML on the specified source.
         * @param {any} source
         * @ignore
         */
        function setSourceViewBuilderHTML(source)
        {
            source.innerHTML = _sourceViewStore.get(source).outerHTML();
        }

        /**
         * Binds the select events for the specified node.
         * @param {any} node
         * @ignore
         */
        function bindNodeEvents(node)
        {
            const selection = _instance.selectionRange;

            if (isBookmark(node) || (node.nodeName == 'FIGURE' && !node.querySelector('table')))
                node.contentEditable = false;

            node.setAttribute(_instance.utility.selAttr, "");
            $lib.on(node, 'click', selectNode.bind(node, false, true));

            if (node.nodeName != 'A')
            {
                $lib.on(node, 'pointerenter', function (e)
                {
                    if (!setActiveEditor(e.target))
                        return;

                    activateDocument();
                    _range = selection.getRange();

                    if (_range.collapsed && !_instance.getSelectedNodes().length)
                        _instance.paragraphButtons.show(_editableElement, this);
                });
                $lib.on(node, 'pointerleave', function (e)
                {
                    if (!setActiveEditor(e.target))
                        return;

                    activateDocument();
                    _range = selection.getRange();

                    if (!_instance.getSelectedNodes().length)
                        _instance.paragraphButtons.hide();
                });
            }
        }

        /** Creates the footer. 
         * @ignore
         */
        function createFooter()
        {
            _footerEl = $lib.element(_instance.element, '', '', '', null, { className: _instance.getCssClass(_instance.classOption.FOOTER) });
            _pathEl = $lib.element(_footerEl, '', '', '', null, { className: _instance.getCssClass(_instance.classOption.PATH) });
            _wordCountEl = $lib.element(_footerEl, '', '', '', null, { className: _instance.getCssClass(_instance.classOption.WORD_COUNT) });
            _logoEl = $lib.element(_footerEl, '', '', '', null, { className: 'c-logo' });
            _resizeHandle = $lib.element(_footerEl, '', '', '', null, { className: 'resize-handle' });

            _pathEl.innerHTML = '&nbsp;';
            let resizeSettings = { defaultHandles: false, resizeHandles: { s: _resizeHandle } };

            if (_instance.iframe)
            {
                resizeSettings.onResizeStart = createResizeMask;
                resizeSettings.onResizeEnd = removeResizeMask;
            }

            $lib.resizable(_editor, resizeSettings);
        }

        /** Creates a resize mask to cover the iframe otherwise the resize-drag can stop. 
        * @ignore
        */
        function createResizeMask()
        {
            _resizeMask = $lib.element(document.body, '', '', '', { style: 'position: fixed; z-index: 9999; inset: 0px 0px 0px 0px; opacity: 0;' });
        }

        /** Removes the created resize mask.  
        * @ignore
        */
        function removeResizeMask()
        {
            $lib.remove(_resizeMask);
        }

        /** Creates the editor. 
         * @ignore
         */
        function createEditor()
        {
            _editor = $lib.element(_instance.element);
            _editor.className = _instance.getCssClass(_instance.classOption.CONTENT);
            _editor.style.boxSizing = 'border-box';

            if (!$lib.isEmpty(_instance.name))
                _editor.setAttribute('name', _instance.name);

            if (_instance.editorHeight)
                _editor.style.height = $lib.unit(_instance.editorHeight);

            if (_instance.iframe)
            {
                _iframe = document.createElement('iframe');
                _iframe.setAttribute('allowtransparency', 'true');
                _iframe.setAttribute('frameborder', '0');
                _iframe.style.width = _iframe.style.height = "100%";
                _iframe.style.display = 'block';
                _editor.appendChild(_iframe);

                _instance.element.classList.add(_instance.getCssClass(_instance.classOption.FRAMED));

                _iframe.onload = function () // directly fired on postRender() -> show()
                {
                    setupEditor(_iframe.contentWindow.document.body);
                    $lib.addClass(_editableElement, 'iframe');
                    addStylesheets();
                }
            }
        }

        /**
         * @ignore
         * @param {any} editorBody
         * @param {any} useMainCssClass
         */
        function setupEditor(editorBody, useMainCssClass = true)
        {
            _doc = editorBody.ownerDocument;
            _editableElement = editorBody;
            _instance.history.init(_editableElement);
            _instance.eventManager.bindEvents();

            if (useMainCssClass)
                copyCssClass(editorBody);

            init();

            if (_editableElement.tabIndex == -1 && !$lib.isEmpty(_instance.tabIndex))
                _editableElement.setAttribute('tabindex', _instance.tabIndex);

            if (!_instance.sourceViewInDialog)
            {
                let source = $lib.element();
                source.className = _instance.getCssClass(_instance.classOption.SOURCE_VIEW);
                source.style.display = 'none';
                _editor.after(source); // place it directly after the content, so it takes the content's spot in both toolbar positions
                _sourceElement.set(_editableElement, source);
            }
        }
        /**
         * @ignore
         * @param {any} editorBody
         */
        function copyCssClass(editorBody)
        {
            const classesToAdd = _instance.element.className.replace(/\bhidden\b/g, '').trim().replace(/\s+/g, ' ');
            $lib.addClass(editorBody, classesToAdd);
            $lib.removeClass(editorBody, _instance.getCssClass(_instance.classOption.FOCUS) + ' ' + _instance.getCssClass(_instance.classOption.FRAMED));
        }

        /** Adds stylesheets. 
         * @ignore
         */
        function addStylesheets()
        {
            let sheets = _instance.includeStylesheets,
                length = (!$lib.isEmpty(sheets)) ? sheets.length : 0, cssLoaded = 0,
                onComplete = () =>
                {
                    if (++cssLoaded >= length)
                        _instance.events.onStylesheetsLoaded.fire(_instance);
                };

            if (!$lib.isEmpty(_instance.includeStylesheets))
            {
                activateDocument();
                $lib.each(_instance.includeStylesheets, (src) =>
                {
                    $lib.addCssSource(src, '', { onComplete: onComplete });
                });
                deactivateDocument();
            }
            else
                onComplete();
        }

        /**
         * @param {any} show
         * @returns {any} return value
         * @ignore
         */
        function setToolbarBoxDisplay(show = true)
        {
            _instance.toolbar.setToolbarBoxDisplay(show);
        }

        /**
         * Gets the toolbar display setting.
         * @param {any} el
         * @returns {ToolbarDisplayOption} the toolbar display.
         * @ignore
         */
        function getToolbarDisplay(el)
        {
            let els = _instance.editableElements,
                index = _instance.editableElements.findIndex((item) =>
                {
                    return (!$lib.isEmpty(item.toolbarDisplay) && (item.element === el || item.id === el.id));
                });

            return (index > -1) ? els[index].toolbarDisplay : _instance.toolbarDisplay;
        }

        /** Activates the document. 
         * @ignore
         */
        function activateDocument()
        {
            let sel = _instance.selectionRange.getSelection();

            if (_instance.iframe)
            {
                $lib.document = _doc;
                $lib.defer(deactivateDocument);
            }

            _doc.defaultView.focus();

            if (!sel.rangeCount || !$lib.contains(_editableElement, _instance.selectionRange.getRange().startContainer))
            {
                sel.removeAllRanges();
                _editableElement.focus();
            }
        }

        /** Deactivates the document. 
         * @ignore
         */
        function deactivateDocument()
        {
            $lib.document = window.document;
        }

        /**
         * Sets the global active editor and document variables.
         * @param {any} activeNode
         * @returns {boolean} A value indicating if the active node was equal or inside an editor element.
         * @ignore
         */
        function setActiveEditor(activeNode)
        {
            let editor = getActiveEditor(activeNode);

            if (hasEditables())
            {
                if (editor)
                {
                    _editor = _editableElement = editor;
                    _doc = _editableElement.ownerDocument;
                    return true;
                }
                else return false;
            }
            else
                return (editor === _editableElement);
        }

        /**
         * Gets the active editor.
         * @param {any} activeNode
         * @returns {Node} The active editor element.
         * @ignore
         */
        function getActiveEditor(activeNode)
        {
            let editor = _instance.utility.getContentEditable(activeNode);

            if (hasEditables())
            {
                if (_instance.editableElements.findIndex((item) =>
                {
                    let el = item.element || $lib('#' + item.id);
                    return el == editor;
                }) > -1)
                {
                    return editor;
                }
                return null;
            }
            else
                return editor;
        }

        /**
         * Returns a value indicating if the node is a bookmark node.
         * @param {Node} node
         * @ignore
         */
        function isBookmark(node)
        {
            return _instance.nodeManager.isBookmark(node);
        }

        /**
         * Returns a value indicating if the node is an image node.
         * @param {Node} node
         * @ignore
         */
        function isImage(node)
        {
            return _instance.nodeManager.isImage(node);
        }

        /**
         * Returns a value indicating if the node is a media node.
         * @param {Node} node
         * @ignore
         */
        function isMedia(node)
        {
            return _instance.nodeManager.isMedia(node);
        }

        /**
         * Returns a value indicating if the node is a link node.
         * @param {Node} node
         * @ignore
         */
        function isLink(node)
        {
            return _instance.nodeManager.isLink(node);
        }

        /**
         * Returns a value indicating if the node matches the tag.
         * @param {string[]|string} tag
         * @param {Node} node
         * @ignore
         */
        function isTagMatch(tag, node)
        {
            return _instance.nodeManager.isTagMatch(tag, node);
        }

        /**
         * Gets the image element inside the figure element.
         * @param {Node} el
         * @ignore
         */
        function getImageFromNode(el)
        {
            return _instance.nodeManager.getInnerNodeByName(el, 'IMG');
        }

        /**
         * Selects the node.
         * @param {Node} node
         * @ignore
         */
        function selectNode(selectContents = false, singleSelect = false, e)
        {
            if (_editableElement.contentEditable != 'true' || this.parentNode.hasAttribute(_instance.utility.selAttr)) // return when A is inside FIGURE
                return;

            const selection = _instance.selectionRange;
            activateDocument();
            _instance.cancelSelectionChange = true;

            if (!_instance.contentManager.hasContent())
                _instance.contentManager.insertParagraph();

            let node = this,
                range = selection.getRange();

            selectContents = (selectContents || (node.contentEditable == 'false' && node.firstElementChild?.nodeName !== 'TABLE' && !node.querySelector('[contenteditable="true"]')));

            if (singleSelect)
                _instance.clearSelection();

            if (singleSelect && selectContents)
                range.collapse(true);

            if (range.collapsed && selectContents)
                range = _instance.selectionRange.selectNodeContents(node);

            if (node.hasAttribute(_instance.utility.selAttr))
                node.setAttribute(_instance.utility.selAttr, '1');

            _instance.layoutState.getState();

            let selectedNodes = _instance.getSelectedNodes(),
                layout = _instance.layoutState.activeLayout;

            if (selectedNodes.length == 1 && layout.image)
                _instance.resizer.set(layout.image);
            else
                _instance.resizer.clear(true);

            if (node.nodeName != 'A')
            {
                if (selectedNodes.length == 1)
                    _instance.paragraphButtons.show(_editableElement, node);
                else
                    _instance.paragraphButtons.hide();
            }

            if (selectedNodes.length == 1)
                _instance.tooltipMenu.show(node);

            _instance.cancelSelectionChange = false;
            _range = range;

            if (e)
                e.stopPropagation();
        }

        /**
         * Handles the bookmark command.
         * @ignore
         */
        function bookmark()
        {
            if (!_instance.dialogManager.bookmarkDialog)
                _instance.dialogManager.createBookmarkDialog();

            _instance.dialogManager.bookmarkDialog.show();
        }

        /**
         * @ignore
         */
        function insertHR()
        {
            let hr = $lib.element('', '', 'hr');

            insertHTML(
                {
                    tag: 'div',
                    isPhrasingContent: false,
                    selectable: true,
                    allowContent: false,
                    innerHTML: hr.outerHTML
                });
        }

        /**
         * @ignore 
         * */
        function insertPageBreak()
        {
            let hr = $lib.element({ tag: 'hr', attrs: { style: 'page-break-before: always;', [`${_instance.utility.attrPrefix}pagebreak`]: '' } });
            insertHTML(
                {
                    tag: 'div',
                    isPhrasingContent: false,
                    selectable: true,
                    allowContent: false,
                    innerHTML: hr.outerHTML
                });
        }

        /**
         * 
         * @param {any} settings
         * @returns {any} return value
         * @ignore
         */
        function insertHTML(settings)
        {
            return _instance.contentManager.insertHTML(settings);
        }

        /** Toggles the block view. 
         * @ignore
         */
        function blockView()
        {
            if (!$UI.store[getId('blockView')])
                return;

            let blockViewButton = $UI.store[getId('blockView')],
                on = (blockViewButton.selected);

            _instance.contentManager.setBlockAttrAll(on);

            if (on)
                _instance.layoutState.addActiveMode('blockView', _instance.toggleBlockView);
            else
                _instance.layoutState.removeActiveMode('blockView');
        }

        /**
         * 
         * @param {any} el
         * @ignore
         * @returns {boolean} A value indicating if the block view is selected.
         */
        function isBlockViewSelected()
        {
            let blockViewButton = $UI.store[getId('blockView')];

            return (blockViewButton) ? blockViewButton.selected : false;
        }

        /**
         * Toggles the special character view.
         * @param {any} cmd
         * @ignore
         */
        function specialSymbols(cmd)
        {
            _instance.toolbar.showSpecialSymbolPicker(cmd);
        }

        /**
         * Toggles the emojis view.
         * @param {any} cmd
         * @ignore
         */
        function emojiSymbols(cmd)
        {
            _instance.toolbar.showEmojiSymbolPicker(cmd);
        }

        /**
         * Sets the indent value on the selection range.
         * @param {any} value
         * @ignore
         */
        function indent(value)
        {
            activateDocument();

            let lm = _instance.listManager,
                rm = _instance.selectionRange,
                nm = _instance.nodeManager,
                nr = parseFloat(value),
                increase = nr > 0,
                unit = value.replace(nr, ''),
                range = rm.getRange(),
                nodesInRange = rm.getNodesInRange(range),
                selectedListItems = rm.getListItemNodesInRange(nodesInRange),
                rootNodes = rm.getRootNodesInRange(range, nodesInRange, false),
                marker = rm.createRangeMarker(rm.ensureTextRange(range));

            $lib.each(rootNodes, (node) =>
            {
                if (!nm.isList(node))
                {
                    let newValue = (node.style.marginLeft) ? parseFloat(node.style.marginLeft) + nr : nr;

                    if (newValue < 0)
                        node.style.removeProperty('margin-left');
                    else
                        node.style.marginLeft = newValue + unit;
                }
                else if (!increase)
                {
                    lm.decreaseListIndent(node, selectedListItems);
                }
            });

            selectedListItems.forEach(node =>
            {
                if (increase)
                    lm.increaseListIndent(node);
            });

            _instance.history.addItem(range, marker);
        }

        /**
         * Toggles a list item node.
         * @param {any} tag
         * @param {any} on
         * @ignore
         */
        function toggleListItem(tag, on)
        {
            _instance.listManager.toggleListItem(tag, on);
        }

        /** Inserts a link. 
         * @ignore
         */
        function insertLink()
        {
            if (!_instance.dialogManager.linkDialog)
                _instance.dialogManager.createLinkDialog();

            _instance.dialogManager.linkDialog.show();
        }

        /**
         * Removes the currently selected link.
         * @ignore 
         * */
        function removeLink()
        {
            if (_instance.layoutState.activeLayout.link)
            {
                let selection = _instance.selectionRange,
                    range = selection.ensureTextRange(selection.getRange()),
                    marker = selection.createRangeMarker(range);

                $lib.unsurround(_instance.layoutState.activeLayout.link);
                _instance.history.addItem(range, marker);

                if (_instance.dialogManager.linkDialog.showing)
                    _instance.dialogManager.linkDialog.hide();
            }
        }

        /**
         * Inserts an image.
         * @param {any} cmd
         * @ignore
         */
        function insertImage(cmd)
        {
            if (!_instance.dialogManager.imageDialog)
                _instance.dialogManager.createImageDialog();

            _instance.dialogManager.imageDialog.show();
        }

        /**
         * Removes the currently selected image. If the image is wrapped in a FIGURE element, the figure is removed.
         * @ignore 
         */
        function removeImage()
        {
            const image = _instance.layoutState.activeLayout.image;
            if (!image) return;

            _instance.resizer.clear(true);
            _instance.hideTooltips();

            const node = image.closest('figure') || image;
            removeNodeAndRestoreCaret(node);
        }

        /**
         * Inserts a media item.
         * @param {any} cmd
         * @ignore
         */
        function insertMedia(cmd)
        {
            if (!_instance.dialogManager.mediaDialog)
                _instance.dialogManager.createMediaDialog();

            _instance.dialogManager.mediaDialog.show();
        }

        /**
         * Removes the currently selected media element. If the media is wrapped in a FIGURE element, the figure is removed.
         * @ignore 
         */
        function removeMedia()
        {
            const media = _instance.layoutState.activeLayout.media;
            if (!media) return;

            _instance.hideTooltips();
            removeNodeAndRestoreCaret(media);
        }
        function removeNodeAndRestoreCaret(node)
        {
            if (!node)
                return;

            const editorEl = _instance.getEditorElement(),
                nm = _instance.nodeManager,
                sel = _instance.selectionRange,
                target = nm.sibling(node, editorEl, false) || nm.sibling(node, editorEl, true),
                range = sel.getRange();

            node.remove();

            if (target)
            {
                range.selectNodeContents(target);
                range.collapse(true);
            }
            else if (!_instance.contentManager.hasContent())
                _instance.contentManager.insertParagraph();

            _instance.history.addItem();
        }

        /** Toggles the source viewer. 
         * @ignore
         */
        function sourceView()
        {
            if (_instance.dialogManager.sourceDialog)
            {
                _instance.dialogManager.sourceDialog.show();
                return;
            }

            let sourceEl = _sourceElement.get(_editableElement),
                sourceButton = $UI.store[getId('source')];

            if (sourceButton.selected)
            {
                _instance.layoutState.addActiveMode('source', _instance.toggleSourceView);
                setToolbarButtonState(false, ['source', 'expand']);
                sourceEl.style.display = '';
                sourceEl.style.height = _editor.style.height;
                _editor.style.display = 'none';

                if (_footerEl)
                    _footerEl.style.display = 'none';

                _instance.eventManager.disposeEvents();

                _instance.hideOverlays();
                _instance.disableBlockView();
                _instance.cleanSource();
                createSourceViewBuilder(_editableElement, sourceEl);
                sourceEl.focus();
            }
            else
            {
                setToolbarButtonState(true);
                _editor.style.display = '';

                if (_footerEl)
                    _footerEl.style.display = '';

                sourceEl.style.display = 'none';
                _instance.eventManager.bindEvents();

                setSourceViewBuilderHTML(_editableElement);
                _instance.contentManager.ensureDocStructure(_editableElement);
                _instance.layoutState.removeActiveMode('source');
                _editableElement.focus();
            }
        }

        /**
         * Sets the state of the toolbar button.
         * @param {boolean} enable A value that indicates if buttons are enabled or disabled.
         * @param {String[]} exclude A list of command id's to exclude.
         * @ignore
         */
        function setToolbarButtonState(enable, exclude = [])
        {
            $lib.each(_sortedCommands, function (cmd)
            {
                if (!cmd.show || exclude.indexOf(cmd.id) > -1)
                    return;

                let button = $UI.store[getId(cmd.id)];

                if (enable && button.disabled)
                    button.enable();
                else if (!enable && !button.disabled)
                    button.disable();
            });
        }

        /** Expands the editor view port 
         * @ignore
         */
        function expandedView()
        {
            let toolbarDisplay = (getToolbarDisplay(_editableElement) != 1) ? _toolbarDisplayOption.HEADER : _toolbarDisplayOption.FOOTER,
                cssClass = _instance.getCssClass(_instance.classOption.FULLSCREEN),
                cssClassFullscreen = cssClass + '-' + _toolbarDisplayOption.getName(toolbarDisplay),
                el = (hasEditables()) ? _editableElement : _instance.element,
                expandButton = $UI.store[getId('expand')],
                toolbarBox = $UI.store[getId('Toolbar')];

            if (expandButton.selected)
            {
                _instance.layoutState.addActiveMode('expand', _instance.toggleExpandedView);
                $lib.addClass(_instance.element, cssClass);
                $lib.addClass(el, cssClassFullscreen);

                if (hasEditables())
                {
                    if (toolbarBox)
                        toolbarBox.stretchToExpander = true;

                    $lib.on(window, 'resize', updateHeight);
                    updateHeight();
                }
            }
            else
            {
                $lib.removeClass(_instance.element, cssClass);
                $lib.removeClass(el, cssClassFullscreen);

                if (hasEditables())
                {
                    if (toolbarBox)
                        toolbarBox.stretchToExpander = false;

                    el.style.height = '';
                    el.style.top = '';
                    $lib.off(window, 'resize', updateHeight);
                }

                _instance.layoutState.removeActiveMode('expand');
            }

            setToolbarBoxDisplay(_instance.toolbar.toolbarBoxShowing);
        }

        /** Displayes the document in preview modus. 
         * @ignore
         */
        function preview()
        {
            let cssClassPreview = _instance.getCssClass(_instance.classOption.PREVIEW),
                previewButton = $UI.store[getId('preview')];

            if (previewButton.selected)
            {
                _instance.layoutState.addActiveMode('preview', _instance.togglePreview);
                $lib.addClass(_editableElement, cssClassPreview);
                setToolbarButtonState(false, ['preview', 'expand']);
                _range = _instance.selectionRange.getRange();
                _instance.selectionRange.getSelection().removeAllRanges();
                _instance.hideOverlays();
                _instance.disableBlockView();
                _instance.cleanSource();
                _instance.eventManager.disposeEvents();
                _editableElement.contentEditable = false;
            }
            else
            {
                $lib.removeClass(_editableElement, cssClassPreview);
                setToolbarButtonState(true);
                _editableElement.contentEditable = true;
                _instance.contentManager.ensureDocStructure(_editableElement);
                _instance.eventManager.bindEvents();
                _instance.layoutState.removeActiveMode('preview');
                _editableElement.focus();

                if (_range)
                    _instance.selectionRange.restoreRange(_range);
            }
        }

        /** Saves the document. 
         * @ignore
         */
        function save()
        {
            _instance.events.onSave.fire(_instance, { html: _instance.getContent(_editableElement) });
        }

        /** Prints the document. 
         * @ignore
         */
        function print()
        {
            const win = (_instance.iframe) ? _iframe.contentWindow : window;
            const editorEl = _editableElement;
            const original = editorEl.innerHTML;

            editorEl.innerHTML = _instance.getContent();
            win.print();
            editorEl.innerHTML = original;
            _instance.contentManager.createSelectables(editorEl);
        }

        /**
         * Exports document to PDF.
         * @param {any} settings
         * @ignore
         */
        function exportToPDF()
        {
            let pdf = new window.jspdf.jsPDF(),
                element = $lib.element({ props: { className: _instance.getCssClass(_instance.classOption.PDF_EXPORT) }, content: [_instance.getContent(_editableElement)] }),
                options = $lib.clone({
                    target: {},
                    source: _instance.PDFExportSettings,
                    deep: true,
                    overwrite: 1
                });

            element.style.width = (options.windowWidth || 1024) + 'px';

            return pdf.html(element, options)
                .then(() => pdf.save(options.filename || 'document.pdf'))
                .catch(error => console.error('PDF export failed:', error));
        }

        /**
         * Sets the block tag.
         * @param {any} tag
         * @param {any} layoutNode
         * @ignore
         */
        function setBlock(tag, layoutNode)
        {
            activateDocument();
            _editableElement.focus();

            let selection = _instance.selectionRange,
                nm = _instance.nodeManager,
                range = selection.ensureTextRange(selection.getRange()),
                nodes = selection.getRootNodesInRange(range),
                marker = selection.createRangeMarker(range);

            $lib.each(nodes, (node) =>
            {
                if (node.nodeName.toLowerCase() != tag)
                    nm.setBlockElement(node, (!layoutNode) ? _instance.format.createLayoutNode(tag) : nm.getRootNode(layoutNode).cloneNode(true));
            });

            blockView();
            range = _instance.selectionRange.restoreRangeToMarker(marker, _doc.createRange());
            _instance.history.addItem(range, marker);
        }

        /** Copies the formatting. 
         * @ignore
         */
        function copyFormat()
        {
            return _instance.format.copyFormat();
        }

        /** Clears the formatting on the current range. 
         * @ignore
         */
        function clearFormat()
        {
            _instance.format.clearFormat();
        }

        /**
         * Toggles the layout node on/off.
         * @param {any} settings
         * @ignore
         */
        function toggleLayoutNode(settings)
        {
            _instance.format.toggleLayoutNode(settings);
        }

        /** Updates the inline editor height in fullscreen mode. 
         * @ignore
         */
        function updateHeight()
        {
            clearTimeout(_resizeTimerId);
            _resizeTimerId = setTimeout(function ()
            {
                deactivateDocument();

                // let the CSS top/bottom define the fullscreen box before measuring
                _editableElement.style.height = '';
                _editableElement.style.top = '';

                let rect = _editableElement.getBoundingClientRect(),
                    toolbarBox = $UI.store[getId('Toolbar')],
                    toolbarHeight = Math.ceil((toolbarBox.element).getBoundingClientRect().height);

                // toolbar at the top: the editable element starts below the toolbar box
                if (getToolbarDisplay(_editableElement) != _toolbarDisplayOption.FOOTER)
                    _editableElement.style.top = $lib.unit(rect.top + toolbarHeight);

                _editableElement.style.height = $lib.unit(rect.height - toolbarHeight);

                // reposition and restretch the toolbar box to the resized editable element
                toolbarBox.update();
            }, 0);
        }

        /**
         * Disables the block view.
         * @ignore
         */
        function disableBlockView()
        {
            if (!$UI.store[getId('blockView')])
                return;

            let blockViewButton = $UI.store[getId('blockView')];

            if (blockViewButton.selected)
            {
                blockViewButton.deselect();
                blockView();
            }
        }

        /**
         * Toggles the menu button.
         * @param {any} button
         * @param {any} on
         * @ignore
         */
        function toggleMenuButton(button, on = null)
        {
            if (on === true)
                button.select();
            else if (on === false)
                button.deselect();
            else
            {
                if (button.selected)
                    button.deselect();
                else
                    button.select();
            }
        }

        /**
         * 
         * @param {any} id
         * @returns {any} return value
         * @ignore
         */
        function getId(id)
        {
            return _instance.id + '_' + id;
        }

        /**
         * @ignore
         */
        function dispose()
        {
            if (hasEditables())
            {
                $lib.each(_instance.editableElements, (item) =>
                {
                    _editableElement = item.element || $lib('#' + item.id);
                    _instance.eventManager.disposeEvents();
                    _instance.table.destroy();
                });
            }
            else
            {
                _instance.eventManager.disposeEvents();
                _instance.table.destroy();
            }

            _instance.cancelSelectionChange = false;
            _instance.layoutState.dispose();
            _instance.tooltipMenu.dispose();
            _instance.history.dispose();

            $lib.off(window, 'resize', updateHeight);
            clearTimeout(_resizeTimerId);

            _sortedCommands = [];
            _sourceElement = new Map();
            _sourceViewStore = new Map();
        }
    }

    /**
    * Creates an instance of the Style item.
    * @class
    * @param {Object} properties The properties used to initialize the object.
    * @property {String} [id] Gets or sets the identifier of the item (id is generated by default).
    * @property {String} text Gets or sets the display text of the item.
    * @property {String} previewCssClass Gets or sets the css class of the preview element.
    * @property {Boolean} [isCategory=false] Gets or sets a value indicating that the item is a category. Child-items of a category are rendered as root-level navigation and are displayed when the category-item is selected (hiding the current root menu/category).
    * @property {String} templateId Gets or sets the id of the menu item template.
    * @property {componyx.UI.Editor.HTMLElementSettings} elementSettings Gets or sets the settings which configure the element to insert into the document.
    * @property {componyx.UI.Editor.StyleItem[]} [itemList] Gets or sets the child-item list of the item.
     */
    componyx.UI.Editor.StyleItem = function (properties)
    {
        var p = properties;

        this.id = (p) ? p.id : $lib.guid();
        this.text = (p) ? p.text : "";
        this.previewCssClass = (p) ? p.previewCssClass : "";
        this.isCategory = (p) ? p.isCategory : false;
        this.templateId = (p) ? p.templateId : "";
        this.elementSettings = (p) ? p.elementSettings || {} : {};
        this.itemList = [];
    }

    /**
    * ToolbarDisplayOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Editor.ToolbarDisplayOption =
    {
        HEADER: 0,
        FOOTER: 1,
        CARET: 2,

        getName: function (value) { return $base.static.getKeyByValue(this, value).toLowerCase(); }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.Editor.prototype = Object.create($base.methods);
    componyx.UI.Editor.prototype.constructor = componyx.UI.Editor;
})(window);