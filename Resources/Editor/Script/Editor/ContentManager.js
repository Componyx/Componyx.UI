/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * ContentManager module — manages content management actions.
 * 
 * @class
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.ContentManager = class ContentManager
{
    constructor(editor)
    {
        this.editor = editor;
        this.utility = editor.utility;
    }


    /**
     * Gets the editor content.
     * @param {HTMLElement|null} [editableElement] The specific editable element to get content from. Only applicable if this editor instance uses multiple editable elements.
     * @returns {String} The editor HTML content.
     *
     */
    getContent(editableElement)
    {
        let content = $lib.element();

        editableElement = editableElement || this.editor.getEditorElement();

        this.editor.resizer.clear(true); // clear resizer to avoid including resizer elements in the source
        content.innerHTML = editableElement.innerHTML;
        this.cleanSource(content);
        this.editor.table.clearAll(content, true);

        return content.innerHTML;
    }

    /**
     * Corrects the specified source document.
     * @param {HTMLElement} source
     * @param {Range} range
     * @param {Object} marker
     *
     */
    ensureDocStructure(source, range, marker)
    {
        this.editor.activateDocument();

        if (!this.hasContent())
            this.insertParagraph();

        const selection = this.editor.selectionRange;
        range = range || selection.ensureTextRange(selection.getRange());
        marker = marker || selection.createRangeMarker(range);

        this.editor.resizer.clear(true);
        this.editor.paragraphButtons.destroy(source);
        this.ensureWrappedNodes(source);
        this.ensureTableCellStructure(source);
        this.restoreEditorAttrs(source);

        for (const figure of source.querySelectorAll('figure:not([contenteditable="false"]):not(:has(table)')) // Figure left after table got removed
        {
            figure.remove();
        }

        let rootNodes = this.ensureBlockNodes(source);

        selection.restoreRangeToMarker(marker, this.editor.getDoc().createRange());
        this.createSelectables(source);

        for (const n of rootNodes)
        {
            this.cleanUp(n, null, range, marker);

            if (!n.childNodes.length)
                n.remove();
        }

        if (marker)
        {
            selection.restoreRangeToMarker(marker, this.editor.getDoc().createRange());
            selection.removeRangeMarker(marker);
        }

        this.editor.history.addItem();
    }

    /**
     * Ensures that root nodes are placed inside a block-node if this is not the case.
     * @param {HTMLElement} source
     * @returns {Set} A set of blocknodes.
     *
     */
    ensureBlockNodes(source)
    {
        let rootNodes = new Set(),
            blockEl;

        const childNodes = Array.from(source.childNodes);

        $lib.each(childNodes, (n) =>
        {
            let isBlock = this.editor.nodeManager.isBlock(n);

            if (n.nodeName === 'DIV' && n.contentEditable !== 'false')
            {
                const hasBlockChild = Array.from(n.childNodes).some(child => this.editor.nodeManager.isBlock(child));

                if (!hasBlockChild)
                {
                    let p = $lib.element('', '', 'p');
                    $lib.surround(p, n);  // wraps div inside p
                    $lib.unsurround(n);   // removes div, keeps its children inside p
                    blockEl = p;
                }
                else
                    blockEl = n;
            }
            else if (!isBlock && !blockEl)
                blockEl = $lib.surround($lib.element('', '', 'p'), n);
            else if (!isBlock)
                blockEl.appendChild(n);
            else
                blockEl = n;

            rootNodes.add(blockEl);
        });

        return rootNodes;
    }

    ensureWrappedNodes(source)
    {
        $lib.each(this.editor.nodeManager.getElementsByTagName(source, 'HR IMG VIDEO IFRAME OBJECT EMBED TABLE SVG'), (n) =>
        {
            let name = n.nodeName,
                parentNode = n.parentNode,
                isTable = name == 'TABLE',
                isFigure = name.match(this.utility.figureNodesRegEx),
                existingFigure = n.closest('figure');

            if (existingFigure)
            {
                n = existingFigure;
            }
            else if (n.nodeName == 'IMG' && !this.editor.nodeManager.isBlock(n.parentNode, true)) // inline image
            {
                if (n.parentNode.childNodes.length > 1)  // parent has other content beside the img, wrap img in its own span
                    n = $lib.surround($lib.element('', '', 'span'), n);
                else
                    n = n.parentNode;

                n.style.display = 'inline-block';
                n.style.width = 'fit-content';
            }
            else if (parentNode == source || (parentNode.nodeName == 'DIV' && isFigure) || (' DIV FIGURE '.indexOf(' ' + parentNode.nodeName + ' ') == -1))
            {
                n = $lib.surround($lib.element('', '', (isFigure) ? 'figure' : 'div', '', ''), n);
                if (n.parentNode != source && n.parentNode.nodeName == 'DIV') // remove parent when parent div node has been enclosed by a figure node
                    $lib.unsurround(n.parentNode);
            }
            else
                n = parentNode;

            if (!isTable)
                n.contentEditable = false;

            if (n.nodeName == 'FIGURE' && isTable)
            {
                n.classList.add(this.editor.getCssClass(this.editor.classOption.TABLE_WRAPPER));
            }
        });
    }

    /**
     * Cleans up the root node by clearing and merging double layout nodes.
     * @param {Node} rootNode
     * @param {string} nodeName
     * @param {Range} range
     * @param {Object} marker
     *
     */
    cleanUp(rootNode, nodeName, range, marker)
    {
        let removeMarker = $lib.isEmpty(marker);
        const selection = this.editor.selectionRange;

        marker = marker || selection.createRangeMarker(range || selection.getRange());

        this.replaceBoldItalic(rootNode);
        this.clearDoubles(rootNode, nodeName, marker);
        rootNode.normalize();
        this.mergeNodes(rootNode, nodeName, marker);
        this.removeRedundantStyleNodes(rootNode);

        selection.restoreRangeToMarker(marker, this.editor.getDoc().createRange());

        if (removeMarker)
            selection.removeRangeMarker(marker);
    }

    /**
     * Replaces bold <b> and italic <i> tags for strong <strong> and emphasized <em>.
     * @param {Node} rootNode
     *
     */
    replaceBoldItalic(rootNode)
    {
        let nodes = this.editor.nodeManager.getElementsByTagName(rootNode, 'b i');

        $lib.each(nodes, (node) =>
        {
            $lib.surround($lib.element('', '', (node.nodeName == 'B') ? 'strong' : 'em'), node);
            $lib.unsurround(node);
        });
    }

    /**
     * Clears double layout nodes when possible.
     * @param {Node} element
     * @param {string} nodeName
     * @param {Object} marker
     *
     */
    clearDoubles(element, nodeName, marker)
    {
        let nm = this.editor.nodeManager,
            nodes = nm.getElementsByTagName(element, nodeName || this.utility.layoutNodeNames.join(' ')),
            childNodes, childIndex, childNode, node, isStyle, textContent;

        $lib.each(nodes, (node) =>
        {
            if (!nm.contains(element, node))
                return;

            isStyle = nm.isStyleNode(node);
            textContent = node.textContent;

            if (nm.canRemove(node))
            {
                nm.removeNodeAndKeepMarkers(node, marker);
            }
            else
            {
                childNodes = nm.getElementsByTagName(node, node.nodeName.toUpperCase());

                for (childIndex = 0; childIndex < childNodes.length; ++childIndex)
                {
                    childNode = childNodes[childIndex];

                    if (nm.canRemove(node))
                        nm.removeNodeAndKeepMarkers(node, marker);
                    else if (!isStyle)
                        $lib.unsurround(childNode);
                    else if (nm.isStyleNode(childNode))
                    {
                        if (childNode.textContent == textContent)
                        {
                            this.editor.format.copyStyles(childNode, node);
                            $lib.unsurround(childNode);
                        }
                        else
                        {
                            let equal = true, sNode = childNode;

                            while (sNode && sNode != node)
                            {
                                if (nm.isStyleNode(sNode))
                                    equal = this.editor.format.hasEqualStyles(node, sNode);

                                sNode = (equal) ? sNode.parentNode : null;
                            }

                            if (equal)
                                $lib.unsurround(childNode);
                        }
                    }
                }
            }
        });
    }

    /**
     * Merges two of the same nodes when possible.
     * @param {Node} rootNode
     * @param {string} nodeName
     * @param {Object} marker
     *
     */
    mergeNodes(rootNode, nodeName, marker)
    {
        let nodes = this.editor.nodeManager.getElementsByTagName(rootNode, nodeName || this.utility.layoutNodeNames.join(' ')),
            startMarker = $lib('#' + marker.startId),
            endMarker = (marker.endId) ? $lib('#' + marker.endId) : null,
            node, index, prev, next;

        for (index = 0; index < nodes.length; ++index)
        {
            node = nodes[index];
            prev = node.previousSibling;
            next = node.nextSibling;

            if ((startMarker && prev == startMarker) || (endMarker && prev == endMarker))
                prev = prev.previousSibling;

            if ((startMarker && next == startMarker) || (endMarker && next == endMarker))
                next = next.nextSibling;

            if (this.editor.nodeManager.isStyleNode(node) || (node.nodeType == 1 && !node.hasAttributes()))
            {
                if (this.editor.format.canMerge(prev, node))
                {
                    if (prev.nextSibling && prev.nextSibling == startMarker)
                        node.insertBefore(startMarker, node.firstChild);
                    else if (prev.nextSibling && prev.nextSibling == endMarker)
                        node.insertBefore(endMarker, node.firstChild);

                    node.insertBefore($lib.extract(prev), node.firstChild);
                    $lib.remove(prev);
                }

                if (this.editor.format.canMerge(next, node))
                {
                    if (next.previousSibling && next.previousSibling == startMarker)
                        node.appendChild(startMarker);
                    else if (next.previousSibling && next.previousSibling == endMarker)
                        node.appendChild(endMarker);

                    node.appendChild($lib.extract(next));
                    $lib.remove(next);
                }
            }
        }
    }

    /**
     * Removes possible default style node when set as root layout-node.
     * @param {Node} rootNode
     *
     */
    removeRedundantStyleNodes(rootNode)
    {
        const nodes = this.editor.nodeManager.getElementsByTagName(rootNode, 'SPAN'),
            styleCache = new Map();

        $lib.each(nodes, node =>
        {
            if (this.editor.nodeManager.isStyleNode(node) && this.isRedundantStyleNode(node, styleCache))
            {
                $lib.unsurround(node);
            }
        });
    }

    /**
     * Checks if style node is redundant.
     * @param {Node} node
     * @param {Map} styleCache
     * @returns {boolean} A value indicating if the style node can be removed.
     *
     */
    isRedundantStyleNode(node, styleCache)
    {
        const inheritedStyles = this.editor.format.getLayoutTreeStyles(node.parentNode, styleCache);
        let redundant = true;

        this.editor.format.iterateStyle(node, (name, value) =>
        {
            const isDefaultFontFamily = (name === 'font-family' && value === this.editor.defaultFontFamily),
                isDefaultFontSize = (name === 'font-size' && value === this.editor.defaultFontSize);

            if (inheritedStyles[name] === undefined)
            {
                if (isDefaultFontFamily || isDefaultFontSize)
                {
                    return;
                }
                else
                    redundant = false;
            }
            else if (inheritedStyles[name] !== value)
            {
                return (redundant = false);
            }
        });

        return redundant;
    }

    /**
     * Cleans the HTML source.
     * @param {HTMLElement|null} source The specific source element to clean. If null, the active editor content will be cleaned directly.
     * @param {boolean} clearZeroWidthCharacters A value indicating whether zero-width characters should be cleared. Default is true.
     */
    cleanSource(source = null, clearZeroWidthCharacters = true)
    {
        const contentEl = source || this.editor.getEditorElement();

        this.clearEditorAttributes(contentEl);
        this.clearContentEditableChildren(contentEl);

        if (clearZeroWidthCharacters)
            this.clearZeroWidth(contentEl);

        this.clearEmptyParagraph(contentEl);
        this.editor.table.clearAll(contentEl);
        this.editor.paragraphButtons.destroy(contentEl);

        if (!source)
            this.editor.resizer.clear(true);

        return contentEl.innerHTML;
    }

    ensureTableCellStructure(source)
    {
        source.querySelectorAll('td, th').forEach(cell =>
        {
            if (!cell.firstChild)
            {
                const p = $lib.element({ tag: 'p' });
                p.appendChild($lib.element({ tag: 'br' }));
                cell.appendChild(p);
                return;
            }

            this.ensureBlockNodes(cell);
        });
    }

    /**
     * Esnures that specific nodes get the correct editor attribute.
     * @param {any} element
     *
     */
    restoreEditorAttrs(element)
    {
        const prefix = this.utility.attrPrefix,
            nm = this.editor.nodeManager;

        $lib.each(element.querySelectorAll('a, hr'), (node) =>
        {
            if (node.nodeName == 'A' && nm.isBookmark(node))
                node.setAttribute(prefix + 'bookmark', '');
            else if (node.nodeName == 'HR' && nm.isPageBreak(node))
                node.setAttribute(prefix + 'pagebreak', '');
        });
    }

    /**
     * Removes the editor attributes that are only required inside the editor.
     * @param {HTMLElement} editor
     *
     */
    clearEditorAttributes(element)
    {
        element = element || this.editor.getEditorElement();
        const prefix = this.utility.attrPrefix;
        const keep = [
            prefix + 'media',
            prefix + 'embed',
            prefix + 'styleid'
        ];

        $lib.each(element.getElementsByTagName('*'), (node) =>
        {
            if (node.hasAttributes())
            {
                Array.from(node.attributes)
                    .filter(attr => attr.name.startsWith(prefix) && !keep.includes(attr.name))
                    .forEach(attr => node.removeAttribute(attr.name));
            }
        });
    }

    /**
     * Removes zero-width characters from the source HTML.
     * @param {HTMLElement} editor
     *
     */
    clearZeroWidth(editor)
    {
        editor = editor || this.editor.getEditorElement();

        let nodes = editor.ownerDocument.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null, null),
            node, clear = [];

        while (node = nodes.nextNode())
        {
            if (node.nodeValue.match(this.utility.zeroWidthRegEx))
                node.nodeValue = node.nodeValue.replace(this.utility.zeroWidthRegEx, '');

            if (node.nodeValue.length == 0)
                clear.push(node);
        }

        clear.forEach((n) => { n.remove(); });
    }

    /**
     * Removes content editable child elements.
     * @param {HTMLElement} editor
     *
     */
    clearContentEditableChildren(editor)
    {
        editor = editor || this.editor.getEditorElement();
        editor.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    }

    /**
     * Clears the editor if it has an empty paragraph.
     * @param {HTMLElement} editor
     *
     */
    clearEmptyParagraph(editor)
    {
        editor = editor || this.editor.getEditorElement();

        if (editor && editor.innerHTML == '<p><br></p>')
        {
            while (editor.firstChild)
            {
                editor.firstChild.remove();
            }
        }
    }

    /** Inserts a paragraph into the current Range. 
     * *
     */
    insertParagraph()
    {
        const selection = this.editor.selectionRange,
            isAutoRecovery = !this.hasContent();

        let range = selection.getRange(),
            nodes = selection.getRootNodesInRange(range),
            lastNode = nodes[nodes.length - 1],
            p = this.editor.getDoc().createElement('p'),
            br = $lib.element('', '', 'br');

        p.appendChild(br);

        if (lastNode && lastNode.nodeName !== 'TD' && lastNode.nodeName !== 'TH')
            range = selection.collapseRangeToNode(lastNode)

        range.deleteContents();
        selection.insertIntoRange(range, p, br);
        selection.restoreRange(range);

        this.setBlockAttr(p);

        if (!isAutoRecovery)
            this.editor.history.addItem(range);
    }

    /**
     * Inserts a BR tag into the range.
     * @param {Range} range
     *
     */
    insertBR(range)
    {
        let br = $lib.element('', '', 'br'),
            sc = range.startContainer,
            n = this.editor.getDoc().createTextNode(this.utility.zeroWidthChar);

        if (sc.nodeType === 3 && sc.nodeValue.match(this.utility.zeroWidthRegEx))
        {
            range.setStart(sc, sc.length);
            range.collapse(true);
        }

        this.editor.selectionRange.insertIntoRange(range, br, br, true);
        this.editor.selectionRange.insertIntoRange(range, n, n, false);
    }

    /**
     * Inserts HTML or a node into the current selection.
     * @param {Object} settings
     * @returns {Node}
     *
     */
    insertHTML(settings)
    {
        this.editor.activateDocument();

        if (!this.hasContent())
            this.insertParagraph();

        const selection = this.editor.selectionRange,
            nm = this.editor.nodeManager,
            history = this.editor.history;

        let node = settings.node || nm.createNode(settings),
            range = selection.ensureTextRange(selection.getRange()),
            marker = selection.createRangeMarker(range);

        if (!range.collapsed)
        {
            range = selection.restoreRangeToMarker(marker, range);
            range.deleteContents();
            range = selection.restoreRangeToMarker(marker, range);
        }

        let markerEl = $lib('#' + marker.startId) || $lib('#' + marker.endId),
            rootNode = nm.getRootNode(markerEl),
            beforeNode;

        if (settings.tag && settings.isPhrasingContent == undefined && this.editor.nodeManager.isBlock($lib.element('', '', settings.tag), true))  // Safety: force block behaviour for known block elements
            settings.isPhrasingContent = false;

        if (settings.isPhrasingContent === false)
        {
            let rightSiblings = nm.getSiblings(rootNode, null, markerEl);

            if (rightSiblings.length > 1 || (rightSiblings.length === 1 && rightSiblings[0].nodeName !== 'BR'))
            {
                let p = $lib.element(rootNode.parentElement, rootNode.nextSibling, 'p', rightSiblings);

                if (!nm.nodeHasContent(rootNode))
                    rootNode.remove();

                rootNode = beforeNode = p;
            }
            else
            {
                beforeNode = rootNode.nextSibling;
            }
        }

        if (settings.isPhrasingContent !== false)
        {
            $lib.insertNode(node, true, true, range);

            range.setStartAfter(node);
            range.setEndAfter(node);
            range.collapse(false);

            let textNode = this.editor.getDoc().createTextNode(this.utility.zeroWidthChar);

            $lib.insertNode(textNode, true, true, range);
            range.collapse(true);
        }
        else
        {
            if (rootNode.nodeName.match(this.utility.blockNodeRegEx))
            {
                if (!nm.nodeHasContent(rootNode))
                    rootNode.parentElement.replaceChild(node, rootNode);
                else
                    rootNode.parentElement.insertBefore(node, beforeNode);

                if (!node.nextSibling)
                {
                    range.selectNodeContents(node);
                    range.collapse(false);

                    history.noHistory(() => this.insertParagraph());
                }
            }
            else
            {
                rootNode.insertBefore(node, markerEl.nextElementSibling || markerEl);
            }

            if (node.nextSibling)
            {
                range.selectNodeContents(node.nextSibling);
                range.collapse(true);
            }
        }

        selection.removeRangeMarker(marker);

        if (settings.select)
            this.editor.selectNode.bind(node)();

        history.addItem();

        return node;
    }

    /** 
     * Returns a value indicating if the editor body has content. 
     *
     */
    hasContent()
    {
        const editor = this.editor.getEditorElement();

        if (!editor.textContent.length && editor.firstChild && editor.firstChild.nodeType != 1)
            editor.firstChild.remove();

        return editor.childNodes.length != 0;
    }

    /**
     * Sets the block attribute if block view is enabled
     * @param {Node} el
     *
     */
    setBlockAttr(el)
    {
        if (this.editor.isBlockViewSelected())
            el.setAttribute(this.utility.attrPrefix + 'blockview', el.nodeName);
    }

    /**
     * Sets or removes the block view attributes.
     * @param {boolean} on
     * @param {HTMLElement} editor
     *
     */
    setBlockAttrAll(on = true, editor)
    {
        editor = editor || this.editor.getEditorElement();
        let attr = this.utility.attrPrefix + 'blockview';

        $lib.each(editor.childNodes, (el) =>
        {
            if (on)
                el.setAttribute(attr, el.nodeName);
            else if (!on)
                el.removeAttribute(attr);
        });
    }

    /**
     * Creates selectable elements for the specified source document.
     * @param {HTMLElement} source
     *
     */
    createSelectables(source)
    {
        new Set(source.querySelectorAll(this.editor.selectableNodes.join(','))).forEach(node =>
            this.editor.bindNodeEvents(node)
        );
    }
};

export default componyx.UI.editor_modules.ContentManager;
