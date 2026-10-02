declare namespace componyx
{
    namespace UI
    {
        /**
         * <p>Namespace for editor modules.</p>
         */
        namespace editor_modules
        {
            /**
             * <p>Promise that resolves when all editor modules are loaded asynchronously.</p>
             */
            var loaded: Promise<void>;

            /**
             * <p>Provides utilities for working with the DOM selection and ranges within the editor document.
             * Use this in custom commands to get and restore the selection range.</p>
             * <p>Available as editor.selectionRange; not constructed directly.</p>
             */
            class SelectionRange
            {
                private constructor();
                /**
                 * <p>Gets the selection object of the editor document (the iframe selection when iframe is set to true).</p>
                 */
                getSelection(): Selection;
                /**
                 * <p>Gets the active selection range. If there is no selection, a collapsed range at the start of the content is created.</p>
                 */
                getRange(): Range;
                /**
                 * <p>Restores the selection range to the provided range.</p>
                 * @param range - <p>The range to select.</p>
                 * @returns <p>The selection range.</p>
                 */
                restoreRange(range: Range): Range;
                /**
                 * <p>Selects the contents of the specified node.</p>
                 * @param node - <p>The node whose contents are selected.</p>
                 * @returns <p>The selection range.</p>
                 */
                selectNodeContents(node: Node): Range;
                /**
                 * <p>Collapses the selection range to the start or end of the specified node.</p>
                 * @param node - <p>The node to collapse to.</p>
                 * @param [toStart = false] - <p>True to collapse to the start of the node, false to collapse to the end.</p>
                 * @returns <p>The selection range.</p>
                 */
                collapseRangeToNode(node: Node, toStart?: boolean): Range;
                /**
                 * <p>Gets the HTML of the contents within the specified range.</p>
                 * @param range - <p>The range.</p>
                 * @returns <p>The selected HTML.</p>
                 */
                getSelectedHTML(range: Range): string;
            }

            /**
             * <p>Provides utilities for querying DOM nodes within the editor document.
             * Useful for writing isActive functions of custom commands.</p>
             * <p>Available as editor.nodeManager; not constructed directly.</p>
             */
            class NodeManager
            {
                private constructor();
                /**
                 * <p>Returns a value indicating if the node is a link node (an A element with an href).</p>
                 * @param node - <p>The node.</p>
                 */
                isLink(node: Node): boolean;
                /**
                 * <p>Returns a value indicating if the node is an image container: an element with a direct child IMG element (typically the FIGURE).
                 * Note: returns false for the IMG element itself.</p>
                 * @param node - <p>The node.</p>
                 */
                isImage(node: Node): boolean;
                /**
                 * <p>Returns a value indicating if the node is a media node (a FIGURE element created by the media command).</p>
                 * @param node - <p>The node.</p>
                 */
                isMedia(node: Node): boolean;
                /**
                 * <p>Returns a value indicating if the node is a bookmark node (an A element with an id and without an href).</p>
                 * @param node - <p>The node.</p>
                 */
                isBookmark(node: Node): boolean;
                /**
                 * <p>Returns a value indicating if the node name matches the tag (case-insensitive).</p>
                 * @param tag - <p>The tag or list of tags to match.</p>
                 * @param node - <p>The node.</p>
                 */
                isTagMatch(tag: string | string[], node: Node): boolean;
                /**
                 * <p>Gets the root (block-level) node for the specified node.</p>
                 * @param node - <p>The node.</p>
                 * @returns <p>The root node.</p>
                 */
                getRootNode(node: Node): HTMLElement;
                /**
                 * <p>Walks up from the start node until a node matches the specified condition, stopping at the root node.</p>
                 * @param startNode - <p>The node to start from.</p>
                 * @param rootNode - <p>The highest node in the tree to check.</p>
                 * @param isMatch - <p>The condition a node must match.</p>
                 * @returns <p>The matching node, or null if no node matches.</p>
                 */
                getMatchingNode(startNode: Node, rootNode: Node, isMatch: (node: Node) => boolean): Node | null;
            }

            /**
             * <p>Manages the undo/redo history stack.</p>
             * <p>Available as editor.history; not constructed directly.</p>
             */
            class History
            {
                private constructor();
                /**
                 * <p>Adds a history item (undo step) for the current document state and selection.
                 * Call this at the end of every custom command that mutates the document directly, otherwise undo will not work correctly.
                 * Editor methods such as insert(), toggleLayoutNode() and setBlock() add their own history item.</p>
                 */
                addItem(): void;
                /**
                 * <p>Invokes the specified method without registering history items.
                 * Use this to combine several editor operations into a single undo step: call the operations inside noHistory() and call addItem() once afterwards.</p>
                 * @param method - <p>The method to invoke.</p>
                 * @returns <p>The result of the invoked method.</p>
                 */
                noHistory<T>(method: () => T): T;
            }

            /**
             * <p>Tracks the current layout state of the editor, including the active selection context (link, image, media, active formats).</p>
             * <p>Available as editor.layoutState; not constructed directly.</p>
             */
            class LayoutState
            {
                private constructor();
                /**
                 * <p>The layout state of the current selection. Read-only: update it via getState().</p>
                 */
                readonly activeLayout: componyx.UI.Editor.ActiveLayout;
                /**
                 * <p>Updates the layout state from the current selection and syncs the toolbar.
                 * Call this after mutations that affect the active layout.</p>
                 */
                getState(): void;
            }
        }

        namespace Editor
        {
            /**
             * @property [id] - <p>The identifier of the content editable element.</p>
             * @property [element] - <p>The HTML element instead of the identifier.</p>
             * @property [toolbarDisplay] - <p>The toolbar display for the editable element.</p>
             */
            type EditableElement = {
                id?: string;
                element?: HTMLElement;
                toolbarDisplay?: ToolbarDisplayOption;
            };

            /**
             * <p>The text labels used by the editor.</p>
             */
            type LabelSettings = {
                comboBoxPlaceholderEditable?: string;
                comboBoxPlaceholderReadOnly?: string;
                alignLeft?: string;
                alignCenter?: string;
                alignRight?: string;
                alignJustify?: string;
                alignTop?: string;
                alignMiddle?: string;
                alignBottom?: string;
                borderStyleNone?: string;
                borderStyleSolid?: string;
                borderStyleDashed?: string;
                borderStyleDotted?: string;
                borderStyleDouble?: string;
                dialogConfirm?: string;
                dialogCancel?: string;
                sourceViewDialogHeader?: string;
                sourceViewRootItem?: string;
                bookmarkDialogHeader?: string;
                bookmarkInputPlaceholder?: string;
                bookmarkPrefix?: string;
                symbolSearchInputPlaceholder?: string;
                linkDialogHeader?: string;
                linkHref?: string;
                linkText?: string;
                linkTitle?: string;
                linkTarget?: string;
                linkTargetCurrent?: string;
                linkTargetNew?: string;
                linkDownloadable?: string;
                removeLink?: string;
                imageDialogHeader?: string;
                imageSource?: string;
                imageAlt?: string;
                imageWidth?: string;
                imageHeight?: string;
                imageAlignment?: string;
                imageAlignLeft?: string;
                imageAlignCenter?: string;
                imageAlignRight?: string;
                imageInlineAlignDefaultTop?: string;
                imageInlineAlignDefaultCenter?: string;
                imageInlineAlignDefaultBottom?: string;
                imageInlineAlignLeft?: string;
                imageInlineAlignRight?: string;
                imageInline?: string;
                imageFileButtonTooltip?: string;
                imageConstrainButtonTooltip?: string;
                mediaDialogHeader?: string;
                mediaSource?: string;
                mediaEmbed?: string;
                mediaWidth?: string;
                comboBoxNoResult?: string;
                default?: string;
                emojiSymbolCategories?: string[];
                specialSymbolCategories?: string[];
                tableDialogHeader?: string;
                tableDialogCategoryTable?: string;
                tableDialogCategoryRow?: string;
                tableDialogCategoryCell?: string;
                tableWidth?: string;
                tableAlignment?: string;
                tableCellSpacing?: string;
                tableCellPadding?: string;
                headerRow?: string;
                footerRow?: string;
                rowHeight?: string;
                cellWidth?: string;
                cellHeight?: string;
                cellPadding?: string;
                caption?: string;
                bgColor?: string;
                borderWidth?: string;
                borderStyle?: string;
                borderColor?: string;
                verticalAlign?: string;
                horizontalAlign?: string;
                tableMenuCut?: string;
                tableMenuCopy?: string;
                tableMenuPaste?: string;
                tableMenuPastePlainText?: string;
                tableMenuRow?: string;
                tableMenuAddRowAbove?: string;
                tableMenuAddRowBelow?: string;
                tableMenuRemoveRow?: string;
                tableMenuColumn?: string;
                tableMenuAddColumnLeft?: string;
                tableMenuAddColumnRight?: string;
                tableMenuRemoveColumn?: string;
                tableMenuMerge?: string;
                tableMenuMergeSelection?: string;
                tableMenuMergeRight?: string;
                tableMenuMergeDown?: string;
                tableMenuSplit?: string;
                tableMenuSettings?: string;
                tableMenuDelete?: string;
                undoCommandTooltip?: string;
                redoCommandTooltip?: string;
                boldCommandTooltip?: string;
                italicCommandTooltip?: string;
                underlineCommandTooltip?: string;
                strikeThroughCommandTooltip?: string;
                fontColorCommandTooltip?: string;
                fontBGColorCommandTooltip?: string;
                blockCommandTooltip?: string;
                fontFamilyCommandTooltip?: string;
                fontSizeCommandTooltip?: string;
                styleCommandTooltip?: string;
                alignCommandTooltip?: string;
                lineHeightCommandTooltip?: string;
                indentMinCommandTooltip?: string;
                indentPlusCommandTooltip?: string;
                orderedListCommandTooltip?: string;
                unorderedListCommandTooltip?: string;
                checkListCommandTooltip?: string;
                linkCommandTooltip?: string;
                imageCommandTooltip?: string;
                mediaCommandTooltip?: string;
                tableCommandTooltip?: string;
                subscriptCommandTooltip?: string;
                superscriptCommandTooltip?: string;
                copyFormatCommandTooltip?: string;
                clearFormatCommandTooltip?: string;
                bookmarkCommandTooltip?: string;
                horizontalLineCommandTooltip?: string;
                pageBreakCommandTooltip?: string;
                sourceCommandTooltip?: string;
                expandCommandTooltip?: string;
                previewCommandTooltip?: string;
                saveCommandTooltip?: string;
                exportCommandTooltip?: string;
                printCommandTooltip?: string;
                moreCommandTooltip?: string;
                blockViewCommandTooltip?: string;
                specialCommandTooltip?: string;
                emojiCommandTooltip?: string;
            };

            /**
             * <p>Editor CSS Variables.</p>
             * @property ["--font-color"] - <p>The font color.</p>
             * @property ["--font-bg-color"] - <p>The font background color.</p>
             * @property ["--image-width"] - <p>The image width.</p>
             * @property ["--image-height"] - <p>The image height.</p>
             */
            type CSSVariables = {
                "--font-color"?: string;
                "--font-bg-color"?: string;
                "--image-width"?: string;
                "--image-height"?: string;
            };

            /**
             * @property match - <p>The matching RegExp.</p>
             * @property replace - <p>The replacement text.</p>
             */
            type ReplacementItem = {
                match: RegExp;
                replace: string;
            };

            /**
             * <p>Returns true if the command button is active (selected).</p>
             * @param node - <p>The HTML Element node.</p>
             * @param cmd - <p>The command settings.</p>
             */
            type IsActiveFunction = (node: HTMLElement, cmd?: CommandSettings) => boolean;

            /**
             * <p>Returns the layout node when it is deeper inside the root-node of the active selection range (e.g. FIGURE &gt; IMG).</p>
             * @param node - <p>The HTML Element node.</p>
             */
            type GetNodeFunction = (node: HTMLElement) => HTMLElement | null;

            /**
             * @property node - <p>Gets or sets the node.</p>
             * @property tag - <p>Gets or sets the tag of the element.</p>
             * @property cssClass - <p>Gets or sets the CSS class of the element.</p>
             * @property styles - <p>Gets or sets the CSS styles of the element.</p>
             * @property attributes - <p>Gets or sets the attributes of the element.</p>
             * @property textContent - <p>Gets or sets the text content of the element.</p>
             * @property innerHTML - <p>Gets or sets the inner HTML of the element (overwrites textContent).</p>
             * @property outerHTML - <p>Gets or sets the outer HTML of the element. When a value is provided the tag, cssClass, styles, attributes, textContent and innerHTML properties are ignored.</p>
             * @property isPhrasingContent - <p>Gets or sets a value indicating if the element is phrasing content and can be placed inside a P tag.</p>
             * @property selectable - <p>Gets or sets a value indicating if the element is selectable. For selectability on document reload, ensure the element matches a selector in selectableNodes.</p>
             * @property select - <p>Gets or sets a value indicating if the element is selected when inserted.</p>
             * @property allowContent - <p>Gets or sets a value indicating if the element allows editable content.</p>
             */
            type HTMLElementSettings = {
                node?: Node;
                tag?: string;
                cssClass?: string;
                styles?: { [key: string]: string };
                attributes?: { [key: string]: string };
                textContent?: string;
                innerHTML?: string;
                outerHTML?: string;
                isPhrasingContent?: boolean;
                selectable?: boolean;
                select?: boolean;
                allowContent?: boolean;
            };

            /**
             * <p>Command settings.</p>
             */
            type CommandSettings = {
                /** <p>Gets or sets the button command.</p> */
                command?: ((cmd?: any) => any) | null;
                /** <p>Gets or sets the key used to trigger the command when the CTRL key is held.</p> */
                shortcutKey?: string;
                /** <p>Gets or sets the tooltip text to display when the command is in focus.</p> */
                tooltip?: string;
                /** <p>Gets or sets the css class name of the button icon.</p> */
                cssClassIcon?: string;
                /** <p>Gets or sets the css class name of the button.</p> */
                cssClass?: string;
                /** <p>Gets or sets a value indicating if the command button is shown.</p> */
                show?: boolean;
                /** <p>Gets or sets the function which should return true if the command button is active (selected).</p> */
                isActive?: IsActiveFunction;
                /** <p>Gets or sets the function which should return the layout node when it is deeper inside the root-node of the active selection range (e.g. FIGURE &gt; IMG).</p> */
                getNode?: GetNodeFunction;
                /** <p>Gets or sets the id of the base item button.</p> */
                buttonId?: string | null;
                /** <p>Gets or sets a value indicating the button type. 0: command-button, 1: check-button, 2: radio-button.</p> */
                type?: 0 | 1 | 2;
                /** <p>Gets or sets the id of the menu component.</p> */
                menuId?: string | null;
                /** <p>Gets or sets the menu-item id.</p> */
                menuItemId?: string;
                /** <p>Gets or sets the index number of the group to which the command belongs.</p> */
                group?: number;
                /** <p>Gets or sets the position of the command within the group. If no positions are specified commands are ordered by insertion order.</p> */
                position?: number;
                /** <p>Gets or sets the settings which configure the element to insert into the document.</p> */
                elementSettings?: HTMLElementSettings;
                /** <p>Gets or sets the command id (used by built-in commands).</p> */
                id?: string;
                /** <p>Gets or sets a value indicating if the command node is selectable (used by built-in commands).</p> */
                selectable?: boolean;
                /** <p>Gets or sets the id of the box shown by the command button (used by built-in commands).</p> */
                boxId?: string;
                /** <p>Gets or sets the CSS variable set by the command button (used by built-in commands).</p> */
                cssVariable?: string;
                /** <p>Gets or sets the content alignment of the command button (used by built-in commands).</p> */
                contentAlign?: number;
                /** <p>Gets or sets the expand direction of the command box (used by built-in commands).</p> */
                expandDirection?: string;
                /** <p>Gets or sets a CSS selector that makes elements created by this command selectable. The selector is added to selectableNodes when the toolbar is created.</p> */
                selector?: string;
            };

            /**
             * @property name - <p>Gets or sets the category name.</p>
             * @property values - <p>Gets or sets the symbols of the category.</p>
             */
            type SymbolCategory = {
                name: string;
                values: componyx.UI.Editor.Symbol[];
            };

            /**
             * @property name - <p>Gets or sets the symbol name.</p>
             * @property value - <p>Gets or sets the symbol value.</p>
             */
            type Symbol = {
                name: string;
                value: string;
            };

            /**
             * <p>PDF export settings for jsPDF. View https://github.com/parallax/jsPDF</p>
             */
            type PDFExportSettings = {
                filename?: string;
                margin?: number | number[];
                autoPaging?: boolean | string;
                html2canvas?: { [key: string]: any };
                x?: number;
                y?: number;
                /** <p>Width in mm on the page.</p> */
                width?: number;
                /** <p>Width in CSS px the content is laid out in.</p> */
                windowWidth?: number;
                [key: string]: any;
            };

            /**
             * <p>Identifiers for controls in the link dialog.</p>
             */
            type LinkDialogIds = {
                /** <p>Gets or sets the id of the base link-href form-field.</p> */
                hrefFormFieldId: string | null;
                /** <p>Gets or sets the id of the base link-text form-field.</p> */
                textFormFieldId: string | null;
                /** <p>Gets or sets the id of the base link-title form-field.</p> */
                titleFormFieldId: string | null;
                /** <p>Gets or sets the id of the base link-target form-field.</p> */
                targetFormFieldId: string | null;
                /** <p>Gets or sets the id of the base link-downloadable form-field.</p> */
                downloadableFormFieldId: string | null;
                /** <p>Gets or sets the id of the base link-href combo-box.</p> */
                hrefComboBoxId: string | null;
                /** <p>Gets or sets the id of the base link-target combo-box.</p> */
                targetComboBoxId: string | null;
                /** <p>Gets or sets the id of the base remove-link button.</p> */
                removeButtonId: string | null;
            };

            /**
             * <p>Identifiers for controls in the image dialog.</p>
             */
            type ImageDialogIds = {
                /** <p>Gets or sets the id of the base image-source form-field.</p> */
                sourceFormFieldId: string | null;
                /** <p>Gets or sets the id of the base image-alt form-field.</p> */
                altFormFieldId: string | null;
                /** <p>Gets or sets the id of the base image-width form-field.</p> */
                widthFormFieldId: string | null;
                /** <p>Gets or sets the id of the base image-height form-field.</p> */
                heightFormFieldId: string | null;
                /** <p>Gets or sets the id of the base caption form-field.</p> */
                captionFormFieldId: string | null;
                /** <p>Gets or sets the id of the base alignment form-field.</p> */
                alignmentFormFieldId: string | null;
                /** <p>Gets or sets the id of the base image file button.</p> */
                fileButtonId: string | null;
                /** <p>Gets or sets the id of the base image constrain button.</p> */
                constrainButtonId: string | null;
            };

            /**
             * <p>Identifiers for controls in the media dialog.</p>
             */
            type MediaDialogIds = {
                /** <p>Gets or sets the id of the base media-source form-field.</p> */
                sourceFormFieldId: string | null;
                /** <p>Gets or sets the id of the base media-embed form-field.</p> */
                embedFormFieldId: string | null;
                /** <p>Gets or sets the id of the base media-width form-field.</p> */
                widthFormFieldId: string | null;
                /** <p>Gets or sets the id of the base media-caption form-field.</p> */
                captionFormFieldId: string | null;
            };

            /**
             * <p>Identifiers for controls in the table dialog.</p>
             */
            type TableDialogIds = {
                /** <p>Gets or sets the id of the base table-width form-field.</p> */
                tableWidthFormFieldId: string | null;
                /** <p>Gets or sets the id of the base table-align form-field.</p> */
                tableAlignFormFieldId: string | null;
                /** <p>Gets or sets the id of the base table-border-width form-field.</p> */
                tableBorderWidthFormFieldId: string | null;
                /** <p>Gets or sets the id of the base table-border-style form-field.</p> */
                tableBorderStyleFormFieldId: string | null;
                /** <p>Gets or sets the id of the base table-cell-spacing form-field.</p> */
                tableCellSpacingFormFieldId: string | null;
                /** <p>Gets or sets the id of the base table-cell-padding form-field.</p> */
                tableCellPaddingFormFieldId: string | null;
                /** <p>Gets or sets the id of the base table-caption form-field.</p> */
                tableCaptionFormFieldId: string | null;
                /** <p>Gets or sets the id of the base table-background-color form-field.</p> */
                tableBgColorFormFieldId: string | null;
                /** <p>Gets or sets the id of the base table-border-color form-field.</p> */
                tableBorderColorFormFieldId: string | null;
                /** <p>Gets or sets the id of the base row-is-header form-field.</p> */
                rowIsHeaderFormFieldId: string | null;
                /** <p>Gets or sets the id of the base row-is-footer form-field.</p> */
                rowIsFooterFormFieldId: string | null;
                /** <p>Gets or sets the id of the base row-height form-field.</p> */
                rowHeightFormFieldId: string | null;
                /** <p>Gets or sets the id of the base row-background-color form-field.</p> */
                rowBgColorFormFieldId: string | null;
                /** <p>Gets or sets the id of the base row-border-style form-field.</p> */
                rowBorderStyleFormFieldId: string | null;
                /** <p>Gets or sets the id of the base row-border-color form-field.</p> */
                rowBorderColorFormFieldId: string | null;
                /** <p>Gets or sets the id of the base cell-width form-field.</p> */
                cellWidthFormFieldId: string | null;
                /** <p>Gets or sets the id of the base cell-height form-field.</p> */
                cellHeightFormFieldId: string | null;
                /** <p>Gets or sets the id of the base cell-vertical-align form-field.</p> */
                cellVerticalAlignFormFieldId: string | null;
                /** <p>Gets or sets the id of the base cell-horizontal-align form-field.</p> */
                cellHorizontalAlignFormFieldId: string | null;
                /** <p>Gets or sets the id of the base cell-border-width form-field.</p> */
                cellBorderWidthFormFieldId: string | null;
                /** <p>Gets or sets the id of the base cell-border-style form-field.</p> */
                cellBorderStyleFormFieldId: string | null;
                /** <p>Gets or sets the id of the base cell-padding form-field.</p> */
                cellPaddingFormFieldId: string | null;
                /** <p>Gets or sets the id of the base cell-background-color form-field.</p> */
                cellBgColorFormFieldId: string | null;
                /** <p>Gets or sets the id of the base cell-border-color form-field.</p> */
                cellBorderColorFormFieldId: string | null;
                /** <p>Gets or sets the id of the base cell-horizontal-align combo-box.</p> */
                horizontalAlignComboBoxId: string | null;
                /** <p>Gets or sets the id of the base cell-vertical-align combo-box.</p> */
                verticalAlignComboBoxId: string | null;
                /** <p>Gets or sets the id of the base border-style combo-box, shared across table, row and cell panels.</p> */
                borderStyleComboBoxId: string | null;
                /** <p>Gets or sets the id of the base border-color button, shared across table, row and cell panels.</p> */
                borderColorButtonId: string | null;
                /** <p>Gets or sets the id of the base background-color button, shared across table, row and cell panels.</p> */
                bgColorButtonId: string | null;
            };

            /**
             * <p>The layout state of the current selection (see editor.layoutState.activeLayout).</p>
             * <p>Besides the listed properties, every command with an isActive function gets a key equal to its command id,
             * holding the matching node (or the node returned by its getNode function) when active, otherwise null.
             * This includes custom commands.</p>
             */
            type ActiveLayout = {
                /** <p>The node name of the root block (e.g. 'P', 'H1').</p> */
                readonly block: string;
                /** <p>The text-align value of the root block.</p> */
                readonly align: string;
                /** <p>The line-height value of the root block.</p> */
                readonly lineHeight?: string;
                /** <p>The font size (CSS value).</p> */
                readonly fontSize: string;
                /** <p>The font family.</p> */
                readonly fontFamily: string;
                /** <p>The active style menu item (empty object when no style is active).</p> */
                readonly styleItem: { readonly id?: string; readonly text?: string; readonly [key: string]: any };
                /** <p>The active link element, or null.</p> */
                readonly link?: HTMLAnchorElement | null;
                /** <p>The active image element, or null.</p> */
                readonly image?: HTMLImageElement | null;
                /** <p>The active media (FIGURE) element, or null.</p> */
                readonly media?: HTMLElement | null;
                /** <p>The active bookmark element, or null.</p> */
                readonly bookmark?: HTMLAnchorElement | null;
                /** <p>Active node per command id (e.g. strong, em, u, s, sub, sup, or a custom command id).</p> */
                readonly [commandId: string]: any;
            };

            /**
             * <p>Internal CSS class name constants. Override a class via the matching cssClass&lt;Key&gt; property on the instance.</p>
             */
            type ClassOption = Readonly<{
                TOOLBAR: 'toolbar';
                TOOLBAR_BOX: 'toolbar-box';
                TOOLBAR_MORE: 'toolbar-more';
                GROUP: 'group';
                CONTENT: 'editor-content';
                FOOTER: 'footer';
                PATH: 'path';
                WORD_COUNT: 'word-count';
                FULLSCREEN: 'fullscreen';
                PREVIEW: 'preview';
                SOURCE_VIEW: 'source-view';
                BOOKMARK: 'bookmark';
                FIGURE: 'figure';
                MEDIA: 'media';
                LINK_DIALOG: 'link-dialog';
                BOOKMARK_DIALOG: 'bookmark-dialog';
                IMAGE_DIALOG: 'image-dialog';
                MEDIA_DIALOG: 'media-dialog';
                SOURCE_DIALOG: 'source-dialog';
                FOCUS: 'focus';
                FRAMED: 'framed';
                HIDDEN: 'hidden';
                TOOLTIP_MENU_LINK: 'tooltip-menu-link';
                DOC_TOOLTIPS: 'doc-tooltips';
                IMG_INLINE_ALIGN_DEFAULT_TOP: 'img-inline-align-default-top';
                IMG_INLINE_ALIGN_DEFAULT_CENTER: 'img-inline-align-default-center';
                IMG_INLINE_ALIGN_DEFAULT_BOTTOM: 'img-inline-align-default-bottom';
                IMG_INLINE_ALIGN_LEFT: 'img-inline-align-left';
                IMG_INLINE_ALIGN_RIGHT: 'img-inline-align-right';
                IMG_ALIGN_LEFT: 'img-align-left';
                IMG_ALIGN_CENTER: 'img-align-center';
                IMG_ALIGN_RIGHT: 'img-align-right';
                COLORSWATCH_BOX: 'box color-swatch';
                SWATCH: 'swatch';
                SWATCH_COLOR: 'swatch-color';
                CLEARCOLOR_BUTTON: 'clear-color-button';
                COLORPICKER_BUTTON: 'color-picker-button';
                SYMBOL_PICKER_BOX: 'box symbol-picker';
                EMOJI_SYMBOL_PICKER: 'emoji-picker';
                SPECIAL_SYMBOL_PICKER: 'special-picker';
                SYMBOL_CATEGORIES: 'symbol-categories';
                SYMBOL_VIEW: 'symbol-view';
                SYMBOL_CATEGORY: 'symbol-category';
                SYMBOL_ITEMS: 'symbol-items';
                SYMBOL_HEADER: 'symbol-header';
                SYMBOL_FOOTER: 'symbol-footer';
                SYMBOL: 'symbol';
                TABLE_PICKER: 'te-picker';
                TABLE_PICKER_GRID: 'te-picker-grid';
                TABLE_PICKER_LABEL: 'te-picker-label';
                TABLE_WRAPPER: 'te-wrapper';
                TABLE_ANCHOR: 'te-anchor';
                TABLE_SELECTED: 'te-selected';
                TABLE_COL_HANDLE: 'te-col-handle';
                TABLE_COL_HANDLE_ACTIVE: 'te-col-handle-active';
                TABLE_MENU_BUTTON: 'te-menu-button';
                TABLE_DIALOG: 'table-dialog';
                TABLE_DIALOG_CATEGORIES: 'table-dialog-categories';
                TABLE_DIALOG_VIEW: 'table-dialog-view';
                TABLE_DIALOG_PANEL: 'table-dialog-panel';
                TABLE_DIALOG_CATEGORY: 'table-dialog-category';
                ACTIVE: 'active';
                REMOVE: 'remove';
                LOCK: 'lock';
                FILE_SELECT: 'file-select';
                FIELD_HALF: 'field-half';
                PARAGRAPH: 'paragraph';
                PDF_EXPORT: 'editor-pdf-export';
            }>;

            /* --- Event args and handlers --- */

            /**
             * @property imageElement - <p>The image element involved.</p>
             * @property [file] - <p>The image file if available, otherwise null.</p>
             */
            type ImageEventArgs = {
                imageElement: HTMLImageElement;
                file?: File | null;
            };

            /**
             * @property event - <p>The native paste event.</p>
             */
            type PasteEventArgs = {
                event: ClipboardEvent;
            };

            /**
             * @property html - <p>The document HTML content.</p>
             */
            type SaveEventArgs = {
                html: string;
            };

            /**
             * @property href - <p>The URL or path of the link.</p>
             * @property text - <p>The link text.</p>
             * @property title - <p>The link title.</p>
             * @property target - <p>The link target.</p>
             */
            type ActiveLinkItem = {
                href: string;
                text: string;
                title: string;
                target: string;
            };

            /**
             * @param url - <p>The URL or path of the selected link.</p>
             * @param [linkText] - <p>The link text.</p>
             * @param [linkTitle] - <p>The link title.</p>
             */
            type ConfirmLinkSelectionCallback = (url: string, linkText?: string, linkTitle?: string) => void;

            /**
             * @property container - <p>The dialog content container element.</p>
             * @property activeItem - <p>The currently active link in the editor, or null if no link is selected.</p>
             * @property confirmSelection - <p>A function to confirm the selected link and insert it into the document.</p>
             */
            type LinkDialogShowEventArgs = {
                container: HTMLElement;
                activeItem: ActiveLinkItem | null;
                confirmSelection: ConfirmLinkSelectionCallback;
            };

            /**
             * @property src - <p>The URL or path of the image.</p>
             * @property alt - <p>The alternative text.</p>
             * @property width - <p>The image width.</p>
             * @property height - <p>The image height.</p>
             * @property caption - <p>The caption text.</p>
             */
            type ActiveImageItem = {
                src: string;
                alt: string;
                width: number;
                height: number;
                caption: string;
            };

            /**
             * @param url - <p>The URL or path of the selected image.</p>
             * @param [alt] - <p>The alternative text.</p>
             * @param [caption] - <p>The caption text.</p>
             */
            type ConfirmImageSelectionCallback = (url: string, alt?: string, caption?: string) => void;

            /**
             * @property container - <p>The dialog content container element.</p>
             * @property activeItem - <p>The currently active image in the editor, or null if no image is selected.</p>
             * @property confirmSelection - <p>A function to confirm the selected image and insert it into the document.</p>
             */
            type ImageDialogShowEventArgs = {
                container: HTMLElement;
                activeItem: ActiveImageItem | null;
                confirmSelection: ConfirmImageSelectionCallback;
            };

            /**
             * @property src - <p>The URL or path of the media, or null if embedded.</p>
             * @property embed - <p>The embed HTML, or null if a URL is used.</p>
             * @property width - <p>The media width.</p>
             * @property caption - <p>The caption text.</p>
             */
            type ActiveMediaItem = {
                src: string | null;
                embed: string | null;
                width: string;
                caption: string;
            };

            /**
             * @param url - <p>The URL or path of the selected media.</p>
             */
            type ConfirmMediaSelectionCallback = (url: string) => void;

            /**
             * @property container - <p>The dialog content container element.</p>
             * @property activeItem - <p>The currently active media in the editor, or null if no media is selected.</p>
             * @property confirmSelection - <p>A function to confirm the selected media and insert it into the document.</p>
             */
            type MediaDialogShowEventArgs = {
                container: HTMLElement;
                activeItem: ActiveMediaItem | null;
                confirmSelection: ConfirmMediaSelectionCallback;
            };

            /**
             * @property sanitizer - <p>The created sanitizer class instance.</p>
             */
            type CreateSanitizerEventArgs = {
                sanitizer: componyx.base_modules.Sanitizer;
            };

            /**
            * <p>Editor events.</p>
            */
            class EditorEvents extends componyx.UI.base.Events<componyx.UI.Editor>
            {
                constructor(events?: componyx.UI.base.Events);
                /** <p>Fires when all included iframe stylesheets are loaded.</p> */
                onStylesheetsLoaded: componyx.UI.base.Event<componyx.UI.Editor, undefined>;
                /** <p>Fires when an image is dragged and dropped into the editor.</p> */
                onImageDrop: componyx.UI.base.Event<componyx.UI.Editor, componyx.UI.Editor.ImageEventArgs>;
                /** <p>Fires when an image is selected or URL provided.</p> */
                onImageSelect: componyx.UI.base.Event<componyx.UI.Editor, componyx.UI.Editor.ImageEventArgs>;
                /** <p>Fires when an image is fully loaded.</p> */
                onImageLoad: componyx.UI.base.Event<componyx.UI.Editor, componyx.UI.Editor.ImageEventArgs>;
                /** <p>Fires on paste.</p> */
                onPaste: componyx.UI.base.Event<componyx.UI.Editor, componyx.UI.Editor.PasteEventArgs>;
                /** <p>Fires on undo.</p> */
                onUndo: componyx.UI.base.Event<componyx.UI.Editor, undefined>;
                /** <p>Fires on redo.</p> */
                onRedo: componyx.UI.base.Event<componyx.UI.Editor, undefined>;
                /** <p>Fires on text selection change.</p> */
                onSelectionChange: componyx.UI.base.Event<componyx.UI.Editor, undefined>;
                /** <p>Fires on save.</p> */
                onSave: componyx.UI.base.Event<componyx.UI.Editor, componyx.UI.Editor.SaveEventArgs>;
                /** <p>Fires when the link dialog content is rendered.</p> */
                onLinkDialogShow: componyx.UI.base.Event<componyx.UI.Editor, componyx.UI.Editor.LinkDialogShowEventArgs>;
                /** <p>Fires when the image dialog content is rendered.</p> */
                onImageDialogShow: componyx.UI.base.Event<componyx.UI.Editor, componyx.UI.Editor.ImageDialogShowEventArgs>;
                /** <p>Fires when the media dialog content is rendered.</p> */
                onMediaDialogShow: componyx.UI.base.Event<componyx.UI.Editor, componyx.UI.Editor.MediaDialogShowEventArgs>;
                /** <p>Fires when the default HTML sanitizer is created, allowing optional configuration.</p> */
                onCreateSanitizer: componyx.UI.base.Event<componyx.UI.Editor, componyx.UI.Editor.CreateSanitizerEventArgs>;
            }

            /**
             * <p>Creates an instance of the Style item.</p>
             */
            class StyleItem
            {
                /**
                 * @param properties - <p>The properties used to initialize the object.</p>
                 */
                constructor(properties?: Partial<StyleItem>);
                /** <p>Gets or sets the identifier of the item (id is generated by default).</p> */
                id?: string;
                /** <p>Gets or sets the display text of the item.</p> */
                text: string;
                /** <p>Gets or sets the css class of the preview element.</p> */
                previewCssClass: string;
                /** <p>Gets or sets a value indicating that the item is a category. Child-items of a category are rendered as root-level navigation and are displayed when the category-item is selected (hiding the current root menu/category).</p> */
                isCategory?: boolean;
                /** <p>Gets or sets the id of the menu item template.</p> */
                templateId: string;
                /** <p>Gets or sets the settings which configure the element to insert into the document.</p> */
                elementSettings: HTMLElementSettings;
                /** <p>Gets or sets the child-item list of the item.</p> */
                itemList: componyx.UI.Editor.StyleItem[];
            }

            /**
             * <p>ToolbarDisplayOption</p>
             */
            const ToolbarDisplayOption: {
                readonly HEADER: 0;
                readonly FOOTER: 1;
                readonly CARET: 2;
                /** <p>Gets the lowercase name of the option value.</p> */
                getName(value: ToolbarDisplayOption): string;
            };
            type ToolbarDisplayOption = 0 | 1 | 2;
        }

        interface Editor extends componyx.UI.base.methods { }

        /**
         * <p>Editor class.</p>
         * <p>Note: if you use $lib alongside the editor API in an iframe configuration, be aware that editor operations temporarily switch $lib.document to the iframe document.
         * This resets automatically via microtask after each callstack. Call editor.deactivateDocument() explicitly (or reset $lib.document) if you need to restore the context immediately within the same callstack.</p>
         */
        class Editor extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new Editor instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties?: Partial<Editor> | HTMLElement);

            /**
             * <p>Internal CSS class name constants.
             * You can override any of these classes on the instance by defining a property named cssClass&lt;Key&gt;
             * where &lt;Key&gt; is the PascalCase key (e.g. 'TOOLBAR_BOX' -&gt; 'cssClassToolbarBox').
             * Overriding these classes without including the default names may break styling and functionality.</p>
             */
            readonly classOption: componyx.UI.Editor.ClassOption;

            /* --- Properties --- */

            /** <p>Gets or sets the editor height.</p> */
            editorHeight: string;
            /** <p>Gets or sets the default font size.</p> */
            defaultFontSize: string;
            /** <p>Gets or sets the default font family.</p> */
            defaultFontFamily: string;
            /** <p>Gets or sets the default alignment.</p> */
            defaultAlign: string;
            /** <p>Gets or sets the default line-height.</p> */
            defaultLineHeight: string;
            /** <p>Gets or sets the content.</p> */
            content: string;
            /** <p>Gets or sets the toolbar display option.</p> */
            toolbarDisplay: componyx.UI.Editor.ToolbarDisplayOption;
            /** <p>Gets or sets a value indicating the editor uses an iframe (instead of content-editable DIV) to isolate the content-editable document from the default document.</p> */
            iframe: boolean;
            /** <p>Gets or sets a value indicating if CSS imported fonts should be detected and included in the fontFamily menu.</p> */
            detectFonts: boolean;
            /** <p>Gets or sets a value indicating if default WebSafe fonts are included in the fontFamily menu.</p> */
            includeWebSafeFonts: boolean;
            /** <p>Gets or sets a value indicating if missing font-sizes are added to the font-size menu.</p> */
            addMissingFontSize: boolean;
            /** <p>Gets or sets a value indicating if the default Browser spellcheck is enabled on the content-editable element.</p> */
            defaultSpellcheck: boolean;
            /** <p>Gets or sets a value indicating if the source view is displayed in a dialog instead of in the editor view.</p> */
            sourceViewInDialog: boolean;
            /** <p>Gets or sets a value indicating if a local image file can be selected.</p> */
            allowImageFileSelect: boolean;
            /** <p>Gets or sets a value indicating if an url can be entered for images.</p> */
            allowImageUrlInput: boolean;
            /** <p>Gets or sets the default indent CSS unit value.</p> */
            indentValue: string;
            /** <p>Gets or sets the maximum items allowed in the history stack. Null means no limit.</p> */
            maxHistoryLength: number | null;
            /** <p>Gets or sets the prefix used to store data in local storage like color swatch colors.</p> */
            localStoragePrefix: string;
            /** <p>Gets or sets the resource path for fetching the emojis.</p> */
            emojiSymbolResourcePath: string;
            /** <p>Gets or sets the resource path for fetching the special characters.</p> */
            specialSymbolResourcePath: string;
            /** <p>Gets or sets the emoji symbol data. The data can either be set directly or can be fetched by specifying the emoji symbol resource path.</p> */
            emojiSymbolData: componyx.UI.Editor.SymbolCategory[] | null;
            /** <p>Gets or sets the special symbol data. The data can either be set directly or can be fetched by specifying the special symbol resource path.</p> */
            specialSymbolData: componyx.UI.Editor.SymbolCategory[] | null;
            /** <p>Gets or sets a list of editable elements (add via addEditableElement). No default content-editable element will be rendered when editable elements are provided.</p> */
            editableElements: componyx.UI.Editor.EditableElement[];
            /** <p>Gets or sets a list of custom fonts to include in the fontFamily menu.</p> */
            fonts: string[];
            /** <p>Gets or sets a list of fonts to specifically exclude from the fontFamily menu.</p> */
            excludeFonts: string[];
            /** <p>Gets or sets a list of CSS unit font sizes to show in the fontSize menu.</p> */
            fontSizes: string[];
            /** <p>Gets or sets a list of style items to show in the style menu.</p> */
            styles: componyx.UI.Editor.StyleItem[];
            /** <p>Gets or sets a list of line height options.</p> */
            lineHeights: string[];
            /** <p>Gets or sets a list of ordered list-item options.</p> */
            orderedList: string[];
            /** <p>Gets or sets a list of unordered list-item options.</p> */
            unorderedList: string[];
            /** <p>Gets or sets a list of colors displayed in the color-swatch.</p> */
            colorSwatchColors: string[];
            /**
             * <p>Gets or sets a list of unique command names (or special keywords) to show on initialization. By default all supported commands are visible. If set, only these listed commands are visible.</p>
             * <ul>
             * <li>'*core' : ['undo','redo','bold','italic','underline','strikeThrough','align','indentMin','indentPlus','copyFormat','clearFormat']</li>
             * <li>'*list' : ['orderedList','unorderedList']</li>
             * <li>'*font' : ['fontSize','fontFamily']</li>
             * <li>'*font-color' : ['fontColor','fontBGColor']</li>
             * </ul>
             */
            visibleCommands: string[];
            /** <p>Gets or sets a list of extra commands to add on initialization. Each object key is the unique command name and the value holds the command settings.</p> */
            extraCommands: { [key: string]: componyx.UI.Editor.CommandSettings };
            /** <p>Gets or sets the text labels used by the editor.</p> */
            labels: componyx.UI.Editor.LabelSettings;
            /** <p>Gets or sets a list of stylesheets to include in the iframe. Setting only applicable when iframe is set to true.</p> */
            includeStylesheets: string[];
            /** <p>Gets or sets the PDF export settings for jsPDF. View https://github.com/parallax/jsPDF</p> */
            PDFExportSettings: componyx.UI.Editor.PDFExportSettings;
            /** <p>Gets or sets media URL replacement options.</p> */
            mediaURLReplacement: componyx.UI.Editor.ReplacementItem[];
            /** <p>Gets or sets CSS Selectors for nodes that are selectable in the editor. Defaults include anchors, figures and non-editable elements. Additional selectors can be added before render to support custom selectable elements.</p> */
            selectableNodes: string[];
            /** <p>Gets or sets a custom sanitizer function to sanitize HTML. When set, overrides the built-in sanitizer. Client-side sanitization is not a substitute for server-side validation.</p> */
            sanitizer: ((html: string) => string) | null;

            /* --- Base component ids --- */

            /** <p>Gets or sets the id of the base menu.</p> */
            menuId: string | null;
            /** <p>Gets or sets the id of the base table menu.</p> */
            tableMenuId: string | null;
            /** <p>Gets or sets the id of the base toolbar box.</p> */
            toolbarBoxId: string | null;
            /** <p>Gets or sets the id of the base toolbar-more box.</p> */
            toolbarMoreBoxId: string | null;
            /** <p>Gets or sets the id of the base color swatch box.</p> */
            colorSwatchBoxId: string | null;
            /** <p>Gets or sets the id of the base clear-color button.</p> */
            clearColorButtonId: string | null;
            /** <p>Gets or sets the id of the base color picker.</p> */
            colorPickerId: string | null;
            /** <p>Gets or sets the id of the base source-dialog.</p> */
            sourceDialogId: string | null;
            /** <p>Gets or sets the id of the base bookmark-dialog.</p> */
            bookmarkDialogId: string | null;
            /** <p>Gets or sets the id of the base link-dialog.</p> */
            linkDialogId: string | null;
            /** <p>Gets or sets the id of the base image-dialog.</p> */
            imageDialogId: string | null;
            /** <p>Gets or sets the id of the base media-dialog.</p> */
            mediaDialogId: string | null;
            /** <p>Gets or sets identifiers for controls in the link dialog.</p> */
            linkDialog: componyx.UI.Editor.LinkDialogIds;
            /** <p>Gets or sets identifiers for controls in the image dialog.</p> */
            imageDialog: componyx.UI.Editor.ImageDialogIds;
            /** <p>Gets or sets identifiers for controls in the media dialog.</p> */
            mediaDialog: componyx.UI.Editor.MediaDialogIds;
            /** <p>Gets or sets identifiers for controls in the table dialog.</p> */
            tableDialog: componyx.UI.Editor.TableDialogIds;
            /** <p>Gets or sets the id of the base validator.</p> */
            validatorId: string | null;
            /** <p>Gets or sets the id of the base emoji symbol picker box.</p> */
            emojiSymbolPickerBoxId: string | null;
            /** <p>Gets or sets the id of the base special symbol picker box.</p> */
            specialSymbolPickerBoxId: string | null;
            /** <p>Gets or sets the id of the base button tooltip manager.</p> */
            buttonTooltipManagerId: string | null;
            /** <p>Gets or sets the id of the base document tooltip manager.</p> */
            documentTooltipManagerId: string | null;
            /** <p>Gets or sets the id of the base table picker box.</p> */
            tablePickerBoxId: string | null;

            /* --- Editor Module API --- */

            /** <p>Provides utilities for working with the DOM selection and ranges within the editor document. Use this in custom commands to get and restore the selection range.</p> */
            selectionRange: componyx.UI.editor_modules.SelectionRange;
            /** <p>Provides utilities for querying DOM nodes within the editor document.</p> */
            nodeManager: componyx.UI.editor_modules.NodeManager;
            /** <p>Manages the undo/redo history stack. Call history.addItem() at the end of every custom command that mutates the document, otherwise undo will not work correctly.</p> */
            history: componyx.UI.editor_modules.History;
            /** <p>Tracks the current layout state of the editor, including the active selection context (link, image, table etc.). Call layoutState.getState() after mutations that affect the active layout to keep the toolbar in sync.</p> */
            layoutState: componyx.UI.editor_modules.LayoutState;

            /** <p>Editor events.</p> */
            events: componyx.UI.Editor.EditorEvents;
            /** <p>Editor commands.</p> */
            commands: { [key: string]: componyx.UI.Editor.CommandSettings };

            /* --- Methods --- */

            /**
             * <p>Adds a content editable element.</p>
             * @param config - <p>The settings of the editable element.</p>
             */
            addEditableElement(config: componyx.UI.Editor.EditableElement): void;
            /** <p>Undoes an action.</p> */
            undo(): void;
            /** <p>Redoes an action.</p> */
            redo(): void;
            /** <p>Sets/unsets bold on the currently selected text range.</p> */
            bold(): void;
            /** <p>Sets/unsets italic on the currently selected text range.</p> */
            italic(): void;
            /** <p>Sets/unsets underline on the currently selected text range.</p> */
            underline(): void;
            /** <p>Sets/unsets strike-through on the currently selected text range.</p> */
            strikeThrough(): void;
            /** <p>Sets/unsets sub on the currently selected text range.</p> */
            sub(): void;
            /** <p>Sets/unsets super on the currently selected text range.</p> */
            sup(): void;
            /**
             * <p>Increases/decreases the indent on the current root block element.</p>
             * @param value - <p>A positive or negative CSS value.</p>
             */
            indent(value: string): void;
            /** <p>Clears the formatting on the currently selected text range.</p> */
            clearFormat(): void;
            /**
             * <p>Copies the formatting on the currently selected text range.</p>
             * @returns <p>A list of formatting nodes currently active on the selected text range.</p>
             */
            copyFormat(): Node[];
            /**
             * <p>Pastes the formatting on the currently selected text range.</p>
             * @param format - <p>A list of formatting nodes to apply to the selected text range.</p>
             */
            pasteFormat(format: Node[]): void;
            /**
             * <p>Converts the root block-level nodes in the currently selected text range to the specified block-level tag.</p>
             * @param tag - <p>The block-level element tag.</p>
             */
            setBlock(tag: string): void;
            /**
             * <p>Surrounds/unsurrounds the currently selected text range with the specified layout node.</p>
             * @param settings - <p>The layout-node settings (e.g. { tag: 'span', styles: { color: 'red' } }).</p>
             */
            toggleLayoutNode(settings: componyx.UI.Editor.HTMLElementSettings): void;
            /**
             * <p>Inserts HTML on the currently selected text range.</p>
             * @param settings - <p>The element settings.</p>
             */
            insert(settings: componyx.UI.Editor.HTMLElementSettings): void;
            /**
             * <p>Shows/hides the HTML source viewer.</p>
             * @param [on] - <p>Use value null to toggle, true to force on, false to force off.</p>
             */
            toggleSourceView(on?: boolean | null): void;
            /**
             * <p>Enables/disables the visibility of block level elements in the document.</p>
             * @param [on] - <p>Use value null to toggle, true to force on, false to force off.</p>
             */
            toggleBlockView(on?: boolean | null): void;
            /**
             * <p>Expands/collapses the editor view to fullscreen.</p>
             * @param [on] - <p>Use value null to toggle, true to force on, false to force off.</p>
             */
            toggleExpandedView(on?: boolean | null): void;
            /**
             * <p>Shows/hides the document in preview modus.</p>
             * @param [on] - <p>Use value null to toggle, true to force on, false to force off.</p>
             */
            togglePreview(on?: boolean | null): void;
            /** <p>Saves the document (fires onSave).</p> */
            save(): void;
            /** <p>Exports the document to PDF. Configure settings via PDFExportSettings.</p> */
            exportToPDF(): void;
            /** <p>Prints the document.</p> */
            print(): void;
            /**
             * <p>Gets a value indicating if the editor has editable elements.</p>
             */
            hasEditables(): boolean;
            /** <p>Shows the bookmark dialog.</p> */
            bookmark(): void;
            /** <p>Shows the insert link dialog to create a link for the selection range.</p> */
            insertLink(): void;
            /** <p>Removes the active link in the selection range.</p> */
            removeLink(): void;
            /** <p>Shows the insert image dialog.</p> */
            insertImage(): void;
            /** <p>Removes the active image in the selection range. If the image is wrapped in a FIGURE element, the figure is removed.</p> */
            removeImage(): void;
            /** <p>Shows the insert media dialog.</p> */
            insertMedia(): void;
            /** <p>Removes the active media in the selection range.</p> */
            removeMedia(): void;
            /**
             * <p>Sets the text-align value on the nodes in the selection range.</p>
             * @param value - <p>The text-align value (e.g. 'left', 'center', 'right', 'justify').</p>
             */
            align(value: string): void;
            /**
             * <p>Sets the line-height on the nodes in the selection range.</p>
             * @param value - <p>The line-height value.</p>
             */
            lineHeight(value: string | number): void;
            /** <p>Activates the current document.</p> */
            activateDocument(): void;
            /** <p>Deactivates the current document (resets $lib.document to window.document).</p> */
            deactivateDocument(): void;

            /**
             * <p>Sets the link dialog content template. Available placeholders: {href}, {text}, {title}, {target}.</p>
             * @param content - <p>The HTML template.</p>
             */
            setLinkDialogContentTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the image dialog content template. Available placeholders: {source}, {alt}, {width}, {height}, {caption}, {alignment}, {inline} (renders in footer).</p>
             * @param content - <p>The HTML template.</p>
             */
            setImageDialogContentTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the media dialog content template. Available placeholders: {source}, {width}, {caption}.</p>
             * @param content - <p>The HTML template.</p>
             */
            setMediaDialogContentTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the table dialog Table panel content template. Available placeholders: {width}, {alignment}, {bgColor}, {borderWidth}, {borderStyle}, {borderColor}, {cellSpacing}, {caption}.</p>
             * @param content - <p>The HTML template.</p>
             */
            setTableDialogTableTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the table dialog Row panel content template. Available placeholders: {isHeader}, {isFooter}, {height}, {bgColor}, {borderStyle}, {borderColor}.</p>
             * @param content - <p>The HTML template.</p>
             */
            setTableDialogRowTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the table dialog Cell panel content template. Available placeholders: {width}, {height}, {verticalAlign}, {horizontalAlign}, {bgColor}, {borderWidth}, {borderStyle}, {borderColor}, {padding}.</p>
             * @param content - <p>The HTML template.</p>
             */
            setTableDialogCellTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the word count template. Available placeholders: {words} (word count), {chars} (character count).</p>
             * @param content - <p>The HTML template.</p>
             */
            setWordCountTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the tooltip menu template. Available placeholders: {href} (link href), {editButton} (edit link/image/media button), {removeButton} (remove link/image/media button).</p>
             * @param content - <p>The HTML template.</p>
             */
            setTooltipMenuTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;

            /**
             * <p>Adds a toolbar command.</p>
             * @param name - <p>The unique command name.</p>
             * @param settings - <p>The command settings.</p>
             */
            addCommand(name: string, settings: componyx.UI.Editor.CommandSettings): void;
            /**
             * <p>Initializes the editor with ONLY the specified commands set to enabled (or disabled when the enable parameter is set to false).
             * For other commands, the opposite action is applied.
             * Special keywords can be used to refer to predefined groups of commands:</p>
             * <ul>
             * <li>'*core' : ['undo','redo','bold','italic','underline','strikeThrough','align','indentMin','indentPlus','copyFormat','clearFormat']</li>
             * <li>'*list' : ['orderedList','unorderedList']</li>
             * <li>'*font' : ['fontSize','fontFamily']</li>
             * <li>'*font-color' : ['fontColor','fontBGColor']</li>
             * </ul>
             * @param commands - <p>The unique command names or special keywords to enable/disable.</p>
             * @param [enable = true] - <p>If true, specified commands are enabled; if false, they are disabled.</p>
             */
            initCommands(commands: string[], enable?: boolean): void;
            /**
             * <p>Gets the active content-editable editor element (when iframe is set to true this will return the document.body element of the iframe).</p>
             * @returns <p>The active content-editable element.</p>
             */
            getEditorElement(): HTMLElement;
            /**
             * <p>Sets focus to the editable element.</p>
             * @param [caretAtEnd = true] - <p>A value indicating to set the caret at the end of the content.</p>
             */
            focus(caretAtEnd?: boolean): void;
            /**
             * <p>Cleans the HTML source.</p>
             * @param [clearZeroWidthCharacters = true] - <p>A value indicating if zero-width characters are removed.</p>
             */
            cleanSource(clearZeroWidthCharacters?: boolean): void;
            /**
             * <p>Gets the editor content (equal to getContent()).</p>
             * @param [editableElement] - <p>The specific editable element to get content from. Only applicable if this editor instance uses multiple editable elements.</p>
             * @returns <p>The editor HTML content.</p>
             */
            getValue(editableElement?: HTMLElement | null): string;
            /**
             * <p>Gets the editor content.</p>
             * @param [editableElement] - <p>The specific editable element to get content from. Only applicable if this editor instance uses multiple editable elements.</p>
             * @returns <p>The editor HTML content.</p>
             */
            getContent(editableElement?: HTMLElement | null): string;
            /**
             * <p>Sets the editor content (equal to setContent()).</p>
             * @param content - <p>The HTML content.</p>
             * @param [editableElement] - <p>The specific editable element to set content for. Only applicable if this editor instance uses multiple editable elements.</p>
             */
            setValue(content: string, editableElement?: HTMLElement | null): void;
            /**
             * <p>Sets the editor content.</p>
             * @param content - <p>The HTML content.</p>
             * @param [editableElement] - <p>The specific editable element to set content for. Only applicable if this editor instance uses multiple editable elements.</p>
             * @param [sanitize = true] - <p>A value indicating if the content should be sanitized.</p>
             */
            setContent(content: string, editableElement?: HTMLElement | null, sanitize?: boolean): void;
            /**
             * <p>Gets the active selection range.</p>
             * @returns <p>The active selection range.</p>
             */
            getRange(): Range;
            /**
             * <p>Sets the state of the toolbar buttons.</p>
             * @param enable - <p>A value that indicates if buttons are enabled or disabled.</p>
             * @param [exclude] - <p>A list of command id's to exclude.</p>
             */
            setToolbarButtonState(enable: boolean, exclude?: string[]): void;
            /** <p>Renders the component.</p> */
            render(): void;
            /** <p>Executes the post render procedure.</p> */
            postRender(): void;
            /** <p>Destroys the component.</p> */
            destroy(): void;
        }
    }
}