/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 *  LayoutState module -  layout state tracking and updates.
  * @class LayoutState
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.LayoutState = class LayoutState
{
    constructor(editor)
    {
        this.editor = editor;
        this.utility = editor.utility;
        this.tree = null;
        this.activeLayout = {};
        this.activeMode = { editableElement: null, keys: {} };
        this.checkCommands = [];
    }

    /** Initializes layout settings. */
    init()
    {
        this.activeLayout.block = 'P';
        this.activeLayout.align = 'left';
        this.activeLayout.fontSize = this.editor.defaultFontSize;
        this.activeLayout.fontFamily = this.editor.defaultFontFamily;
        this.activeLayout.styleItem = {};

        this.checkCommands = this.editor.getSortedCommands().filter((cmd) => { return !$lib.isEmpty(cmd.isActive) });
        this.checkCommands.forEach((cmd) => { this.activeLayout[cmd.id] = null });
    }

    dispose()
    {
        this.editor = null;
        this.utility = null;
        this.tree = null;
        this.activeLayout = {};
        this.activeMode = { editableElement: null, keys: {} };
        this.checkCommands = [];
    }

    /** Gets the layout state. */
    getState()
    {
        this.editor.activateDocument();
        let range = this.editor.selectionRange.getRange();

        if (range)
        {
            let sContainer = range.startContainer,
                el = (sContainer.nodeType == 1) ? sContainer : sContainer.parentElement,
                rootEl = this.editor.nodeManager.getRootNode(el),
                nodes = this.getSurroundingLayoutNodes(el, rootEl),
                layoutNodes = nodes.layoutNodes,
                tree = nodes.tree;

            if (tree.length)
            {
                if (this.tree && this.tree.length == tree.length)
                {
                    let change = false;

                    $lib.each(this.tree, (n, i) =>
                    {
                        return !(change = !n.isEqualNode(tree[i]));
                    });

                    if (!change)
                        return; // selection and nodes within selection have not changed
                }

                this.tree = [];
                $lib.each(tree, (n, i) =>
                {
                    this.tree.push(n.cloneNode(true));
                });

                this.activeLayout.block = rootEl.nodeName;
                this.activeLayout.align = rootEl.style.textAlign || this.editor.defaultAlign;
                this.activeLayout.lineHeight = rootEl.style.lineHeight || this.editor.defaultLineHeight;

                this.activeLayout.fontFamily = this.editor.defaultFontFamily;
                this.activeLayout.styleItem = {};

                this.detectFontSize(el, layoutNodes);

                if (layoutNodes.fontFamilyNode)
                    this.activeLayout.fontFamily = layoutNodes.fontFamilyNode.style.fontFamily.replace(/\"/g, '');

                if (layoutNodes.styleNode)
                {
                    let menuItem = this.editor.menuManager.loadMenuItem(layoutNodes.styleNode.getAttribute(this.utility.attrPrefix + 'styleid'));
                    if (menuItem)
                        this.activeLayout.styleItem = menuItem.item;
                }

                this.checkCommands.forEach((cmd) =>
                {
                    this.activeLayout[cmd.id] = layoutNodes[cmd.id]
                });

                if (!this.editor.hasEditables())
                {
                    this.updatePath(tree);
                    this.updateWordCount();
                }
            }
        }

        this.updateLayoutSettings();
    }

    /**
     * Gets the surrounding layout-nodes for the specified element.
     * @param {Node} el
     * @param {Node} rootEl
     */
    getSurroundingLayoutNodes(el, rootEl)
    {
        let layoutNodes = {},
            nodes = [],
            checkCommands = this.checkCommands.slice(),
            editableElement = this.editor.getEditorElement();

        while (el && el != editableElement)
        {
            nodes.push(el);

            if (el != rootEl)
            {
                if (!$lib.isEmpty(el.style.fontSize) && !layoutNodes.fontSizeNode)
                    layoutNodes.fontSizeNode = el;

                if (!$lib.isEmpty(el.style.fontFamily) && !layoutNodes.fontFamilyNode)
                    layoutNodes.fontFamilyNode = el;
            }

            if (!$lib.isEmpty(el.getAttribute(this.utility.attrPrefix + 'styleid')) && !layoutNodes.styleNode)
                layoutNodes.styleNode = el;

            $lib.each(checkCommands, (cmd, index) =>
            {
                if (cmd.isActive(el, cmd))
                {
                    layoutNodes[cmd.id] = (cmd.getNode) ? cmd.getNode(el) : el;
                }
            });

            el = (el == rootEl) ? null : el.parentElement;
        }

        return { layoutNodes: layoutNodes, tree: nodes.reverse() };
    }

    /**
     * Detects and sets the font size
     * @param {Node} el
     * @param {Object} layoutNodes
     */
    detectFontSize(el, layoutNodes)
    {
        let fontSize = this.getFontSize(el);

        if (layoutNodes.fontSizeNode && (layoutNodes.fontSizeNode == el || this.getFontSize(layoutNodes.fontSizeNode) == fontSize))
            this.activeLayout.fontSize = layoutNodes.fontSizeNode.style.fontSize;
        else
        {
            this.activeLayout.fontSize = fontSize;

            let itemPath = this.editor.menuManager.loadMenuItem('fontSize_' + fontSize);

            if (!itemPath && this.editor.addMissingFontSize)
            {
                this.deselectMenuItem('fontSize');
                this.editor.menuManager.buildFontSizeMenu([fontSize]);
                this.editor.deactivateDocument();
                this.editor.menuManager.renderMenuItem('FontSize');
                this.editor.activateDocument();
            }
        }
    }

    /**
     * Gets the computed font size
     * @param {Node} el
     */
    getFontSize(el)
    {
        let fontSize = window.getComputedStyle(el, null).getPropertyValue('font-size');
        return parseFloat(fontSize) + 'px';
    }

    /** Updates layout settings. */
    updateLayoutSettings()
    {
        this.updateContent('block', this.activeLayout.block);
        this.updateContent('fontFamily', this.activeLayout.fontFamily);
        this.updateContent('fontSize', this.activeLayout.fontSize);
        this.updateContent('align', this.activeLayout.align);
        this.updateContent('lineHeight', this.activeLayout.lineHeight);
        this.updateContent('style', this.activeLayout.styleItem.text, this.activeLayout.styleItem.id);

        this.checkCommands.forEach((cmd) =>
        {
            let name = cmd.id,
                button = this.editor.getComponent(name);

            if (!button)
                return;

            if (this.activeLayout[name] && !button.selected)
                button.select();
            else if (!this.activeLayout[name] && button.selected)
                button.deselect();
        });
    }

    /**
     * Updates button content and menu selection
     * @param {string} buttonId
     * @param {string} text
     * @param {string} id
     */
    updateContent(buttonId, text, id)
    {
        if (!id)
            id = text;

        let menuItemId = buttonId + '_' + id,
            button = this.editor.getComponent(buttonId),
            itemPath = this.editor.menuManager.loadMenuItem(menuItemId);

        if (!itemPath)
            return this.deselectMenuItem(buttonId);

        if (button && !button.hasIcon)
        {
            button.text = text;
            button.updateContent();
        }

        this.cancelMenuItemCommand(itemPath.item);
        this.editor.menuManager.selectMenuItem(menuItemId);
    }

    /**
     * Cancel menu-item command.
     * @param {Object} item
     */
    cancelMenuItemCommand(item)
    {
        let command = item.command;
        item.command = function ()
        {
            item.command = command;
        };
    }

    /** 
     * Deselect the selected menu-item for the specified group 
     * @param {string} buttonId
     */
    deselectMenuItem(buttonId)
    {
        let selectedId = this.editor.menuManager.getSelectedItemId(buttonId);

        if (selectedId)
            this.editor.menuManager.deselectMenuItem(selectedId);
    }

    /**
     * Updates the document node path.
     * @param {Node[]} tree
     */
    updatePath(tree)
    {
        let pathEl = this.editor.getPathElement();

        if (!pathEl)
            return;

        let length = tree.length;

        pathEl.innerHTML = '';

        $lib.each(tree, (node, index) =>
        {
            $lib.on($lib.element(pathEl, '', '', node.nodeName.toLowerCase(), '', { className: 'path-item' }),
                'click',
                this.editor.selectNode.bind(node, true));

            if (length > index + 1)
                $lib.element(pathEl, '', '', '›', '', { className: 'path-divider' });
        });
    }

    /** Updates the document word count. */
    updateWordCount()
    {
        let wordCountEl = this.editor.getWordCountElement();

        if (!wordCountEl)
            return;

        wordCountEl.innerHTML = '';
        this.editor.applyTemplate(wordCountEl, 'WordCount', this.getWordCount());
    }

    /** Gets the document word count. */
    getWordCount()
    {
        let editableElement = this.editor.getEditorElement(),
            t = editableElement.textContent,
            words = [];

        $lib.each(editableElement.childNodes, (el) =>
        {
            let lineWords = el.textContent.replace(/\n+/g, ' ').replace(/\s+/g, ' ').replace(/^\s+/, '').replace(/\s+$/, '').split(' ');

            if (lineWords[0] == '')
                lineWords.shift();

            words = words.concat(lineWords);
        });

        return {
            words: words.length,
            chars: t.replace(/\n+/g, '').length
        };
    }

    /**
     * Adds an active mode.
     * @param {string} key
     * @param {Function} toggleMethod
     */
    addActiveMode(key, toggleMethod)
    {
        this.activeMode.editableElement = this.editor.getEditorElement();
        this.activeMode.keys[key] = toggleMethod.bind(this.editor, false);
    }

    /**
     * Removes an active mode.
     * @param {string} key
     */
    removeActiveMode(key)
    {
        delete this.activeMode.keys[key];
    }

    /**
     * Resets all active modes.
     */
    resetActiveModes()
    {
        let editableElement = this.editor.getEditorElement();

        if (!this.activeMode.editableElement || this.activeMode.editableElement == editableElement || $lib.isEmpty(this.activeMode.keys))
            return;

        let currentEditableElement = editableElement;
        this.editor.setActiveEditor(this.activeMode.editableElement);

        $lib.each(this.activeMode.keys, function (method)
        {
            method();
        });

        this.editor.setActiveEditor(currentEditableElement);
    }
};

export default componyx.UI.editor_modules.LayoutState;
