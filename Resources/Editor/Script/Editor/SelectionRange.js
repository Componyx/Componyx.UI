/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * SelectionRange module - range manipulation and selection management.
 * @class SelectionRange
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.SelectionRange = class SelectionRange
{
    constructor(editor)
    {
        this.editor = editor;
        this.util = editor.utility;
    }

    /**
     * Gets the range object.
     */
    getRange()
    {
        let editableElement = this.editor.getEditorElement(),
            doc = this.editor.getDoc(),
            sel = this.getSelection(),
            range;

        if (!sel.rangeCount)
        {
            editableElement.focus();

            if (!sel.rangeCount)
            {
                range = doc.createRange();
                range.selectNodeContents(editableElement.firstChild || editableElement);
                range.collapse(true);
                sel.addRange(range);
            }
        }

        range = sel.getRangeAt(0);

        if (this.editor.hasContent() && range.startContainer == editableElement && range.startOffset == 0)
            range.setStart(editableElement.firstChild, 0);

        return range;
    }

    selectAll()
    {
        let range = this.getRange(),
            element = this.editor.getEditorElement();

        range.setStartBefore(element.firstElementChild);
        range.setEndAfter(element.lastElementChild);
        this.selectNodesInRange(range);
    }

    /**
     * Gets the selection object.
     */
    getSelection()
    {
        let iframe = this.editor._iframe;
        return (iframe) ? iframe.contentWindow.getSelection() : window.getSelection();
    }

    /**
     * Ensures that the Range is set to a text node.
     * @param {Range} range
     */
    ensureTextRange(range)
    {
        let node,
            collapsed = range.collapsed,
            startContainer = range.startContainer,
            endContainer = range.endContainer,
            getTextNode = (node, container, beforeNode) =>
            {
                let textNode, useEndOffset = false;

                if (node)
                {
                    if (node.nodeName.match(this.util.voidNodeRegEx))
                    {
                        let prev = node.previousSibling;
                        while (prev && prev.nodeName.match(this.util.voidNodeRegEx))
                            prev = prev.previousSibling;

                        if (prev)
                        {
                            useEndOffset = true;
                            textNode = prev.nodeType == 3 ? prev : this.editor.nodeManager.getFirstTextNode(prev, container, true);
                            if (textNode)
                                return { textNode, useEndOffset };
                        }
                    }

                    node = (node.nodeType == 1) ? node.firstChild || this.editor.nodeManager.createTextNodePlaceHolder(node, beforeNode) : node;
                    textNode = node;
                }
                else
                    textNode = this.editor.nodeManager.createTextNodePlaceHolder(container, beforeNode);

                return { textNode, useEndOffset };
            };

        if (startContainer.nodeType == 1)
        {
            node = startContainer.childNodes[range.startOffset];
            let { textNode: startNode, useEndOffset } = getTextNode(node, startContainer, startContainer.firstChild);
            let offset = useEndOffset ? startNode.textContent.length : 0;
            range.setStart(startNode, offset);

            if (collapsed && !range.collapsed)
            {
                range.setStart(range.startContainer, offset);
                range.collapse(true);
            }
        }

        if (range.collapsed)
            return range;

        if (endContainer.nodeType == 1)
        {
            node = endContainer.childNodes[range.endOffset] || endContainer.lastChild; // past the end - use last child

            let { textNode: endNode } = getTextNode(node, endContainer);
            range.setEnd(endNode, endNode.textContent.length);
        }

        return range;
    }

    /**
     * Restores the range to the marker(s).
     * @param {Object} marker
     * @param {Range} range
     * @returns {Range} The selection range.
     */
    restoreRangeToMarker(marker, range)
    {
        return this.restoreRange(this.setRangeToMarker(range, marker.startId, marker.endId));
    }

    /**
     * Restores the selection range to the provided range.
     * @param {Range} range
     * @returns {Range} The selection range.
     */
    restoreRange(range)
    {
        let sel = this.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        return range;
    }

    /**
     * Restores the range to the marker(s).
     * @param {Range} range
     * @param {string} startId
     * @param {string} endId
     * @returns {Range} The selection range.
     */
    setRangeToMarker(range, startId, endId)
    {
        let doc = this.editor.getDoc(),
            startEl = $lib('#' + startId),
            endEl = $lib('#' + endId),
            endNode = (endEl) ? endEl.previousSibling : null;

        if (!startEl && !endEl)
        {
            $lib.log('setRangeToMarker() exception, no marker found.');
            return range;
        }

        if (startEl)
        {
            let startNode = startEl.nextSibling;

            if (startNode && startNode.nodeType == 3)
                range.setStart(startNode, 0);
            else
            {
                if (startNode && startNode.hasChildNodes())
                    startNode = this.editor.nodeManager.getFirstTextNode(startNode, startEl.parentElement);

                if (startNode && startNode.nodeType == 3)
                    range.setStart(startNode, 0);
                else
                {
                    startNode = this.editor.nodeManager.getFirstTextNode(startEl.previousSibling, startEl.parentElement, true);

                    if (startNode)
                        range.setStart(startNode, startNode.textContent.length);
                    else
                    {
                        startNode = doc.createTextNode('');
                        startEl.parentNode.insertBefore(startNode, startEl);
                        range.setStart(startNode, 0);
                    }
                }
            }
        }

        if (!endEl)
            return range;

        if (endNode && endNode.nodeType == 3)
            range.setEnd(endNode, endNode.textContent.length);
        else
        {
            if (endNode && endNode.hasChildNodes())
                endNode = this.editor.nodeManager.getFirstTextNode(endNode, endEl.parentElement, true);

            if (endNode && endNode.nodeType == 3)
                range.setEnd(endNode, endNode.textContent.length);
            else
            {
                endNode = this.editor.nodeManager.getFirstTextNode(endEl.nextSibling, endEl.parentElement);

                if (endNode)
                    range.setEnd(endNode, 0);
                else
                {
                    endNode = doc.createTextNode('');
                    endEl.parentNode.insertBefore(endNode, endEl);
                    range.setEnd(endNode, 0);
                }
            }
        }

        return range;
    }

    /**
     * Creates range marker(s).
     * @param {Range} range
     */
    createRangeMarker(range)
    {
        let doc = this.editor.getDoc(),
            startContainer = range.startContainer,
            startOffset = range.startOffset,
            endContainer = (!range.collapsed) ? range.endContainer : null,
            endOffset = range.endOffset,
            startMarker = doc.createElement('span'),
            startId = this.util.newGuid(), endId, node;

        startMarker.id = startId;
        startMarker.setAttribute(this.util.markerAttr, '');

        if (startContainer.nodeType == 1 || !startOffset)
            startContainer.parentNode.insertBefore(startMarker, startContainer);
        else
        {
            node = startContainer.splitText(startOffset);
            node.parentNode.insertBefore(startMarker, node);

            if (!node.textContent.length || node.nodeValue.match(/^\uFEFF+$/))
                node.remove();

            if (endContainer)
            {
                if (startContainer == endContainer)
                {
                    endOffset -= startOffset;
                    endContainer = node;
                }
            }
        }

        if (endContainer)
        {
            let endMarker = doc.createElement('span');

            endId = this.util.newGuid();
            endMarker.id = endId
            endMarker.setAttribute(this.util.markerAttr, '');

            if (endContainer.nodeType == 1 || endContainer.textContent.length == endOffset)
                endContainer.parentElement.insertBefore(endMarker, endContainer.nextSibling);
            else
            {
                node = endContainer.splitText(endOffset);
                node.parentNode.insertBefore(endMarker, node);

                if (!node.textContent.length || node.nodeValue.match(/^\uFEFF+$/))
                    node.remove();
            }
        }

        return { startId: startId, endId: endId };
    }

    /**
     * Remove range marker(s).
     * @param {Object} marker
     */
    removeRangeMarker(marker)
    {
        const editableElement = this.editor.getEditorElement();
        editableElement.querySelectorAll('#' + marker.startId).forEach(el => el.remove());

        if (marker.endId)
            editableElement.querySelectorAll('#' + marker.endId).forEach(el => el.remove());
    }

    /**
     * Gets all the nodes within the range
     * @param {Range} range
     */
    getNodesInRange(range)
    {
        let node = range.startContainer,
            endNode = range.endContainer,
            startOffset = range.startOffset,
            endOffset = range.endOffset;

        if (node == endNode && node.nodeType == 1 && startOffset == 0 && endOffset == node.childNodes.length)
            return [node];

        if (node.nodeType == 1 && node.childNodes.length > startOffset)
            node = node.childNodes[startOffset];

        if (endNode.nodeType == 1 && endNode.childNodes.length > endOffset)
            endNode = endNode.childNodes[endOffset];

        let rangeNodes = [node];

        if (node == endNode)
            return rangeNodes;

        while (node && node != endNode)
        {
            node = this.editor.nodeManager.nextNode(node);

            if (node)
                rangeNodes.push(node);
        }

        return rangeNodes;
    }

    /**
     * Gets the root nodes in the range
     * @param {Range} range
     * @param {Node[]} [nodes]
     * @param {boolean} [useLayoutRoot = true]
     */
    getRootNodesInRange(range, nodes, useLayoutRoot = true)
    {
        let seen = new Map(),
            rootNodes = [], node;

        nodes = nodes || this.getNodesInRange(range);

        for (let index = 0; index < nodes.length; ++index)
        {
            node = this.editor.nodeManager.getRootNode(nodes[index], useLayoutRoot);

            if (node && !seen.has(node))
            {
                seen.set(node, true);
                rootNodes.push(node);
            }
        }

        return rootNodes;
    }

    /**
     * Selects the contents of the specified node.
     * @param {Node} node
     */
    selectNodeContents(node)
    {
        let doc = this.editor.getDoc(),
            range = doc.createRange();

        range.selectNodeContents(node);
        return this.restoreRange(range);
    }

    /**
     * Selects the nodes inside the range.
     * @param {Range} range
     */
    selectNodesInRange(range)
    {
        let rootNodes = this.getRootNodesInRange(range),
            nodes = this.editor.nodeManager.getSurroundingNodes(range.startContainer, rootNodes[0]);

        $lib.each(rootNodes.concat(nodes), (node) =>
        {
            if (node.nodeType == 1 && node.hasAttribute(this.util.selAttr))
                this.editor.selectNode.bind(node, false)();
        });
    }

    /**
     * Collapses the range to the specified node.
     * @param {Node} node
     * @param {boolean} toStart
     */
    collapseRangeToNode(node, toStart = false)
    {
        let doc = this.editor.getDoc(),
            range = doc.createRange();

        range.selectNode(node);
        range.collapse(toStart); // move to start or end
        return this.restoreRange(range);
    }

    /**
     * Gets the selected HTML from the range.
     * @param {Range} range
     */
    getSelectedHTML(range)
    {
        return $lib.element('', '', '', range.cloneContents()).innerHTML;
    }

    /**
     * Splits the text containers at the start and end.
     * @param {Range} range
     * @param {boolean} start
     * @param {boolean} end
     */
    splitRange(range, start, end)
    {
        let startOffset = range.startOffset,
            endOffset = range.endOffset,
            textLength = range.endContainer.textContent.length;

        if (start && startOffset > 0)
        {
            if (range.startContainer == range.endContainer)
            {
                endOffset -= startOffset;
                textLength -= startOffset;
            }

            range.setStart(range.startContainer.splitText(startOffset), 0); // startContainer is new node created at offset
        }

        if (end && endOffset < textLength)
            range.endContainer.splitText(endOffset);

        return range;
    }

    /**
     * Returns a value indicating if the range has changed
     */
    rangeChanged(lastRange)
    {
        let r = this.getRange(), r2 = lastRange;

        if (!r2)
            return true;

        return (r.startContainer != r2.startContainer || r.endContainer != r2.endContainer ||
            r.startOffset != r2.startOffset || r.endOffset != r2.endOffset);
    }

    /**
     * Inserts the node into the range.
     * @param {Range} range
     * @param {Node} insertNode
     * @param {Node} selectNode
     * @param {Boolean} after
     */
    insertIntoRange(range, insertNode, selectNode, after)
    {
        selectNode = selectNode || insertNode;
        range.insertNode(insertNode);

        if (after)
        {
            range.setStartAfter(selectNode);
            range.setEndAfter(selectNode);
        }
        else
        {
            range.setStartBefore(selectNode);
            range.setEndBefore(selectNode);
        }
    }

    /**
     * Surrounds the range with the layout node.
     * @param {Range} range
     * @param {Node} layoutNode
     */
    surroundRange(range, layoutNode)
    {
        let format = this.editor.format;
        layoutNode.appendChild(range.extractContents()); // collapses range (extractContents() instead of surroundContents(), because the last has problems with text-nodes)
        format.updateDeeperStyleNodes(layoutNode, format.getLayoutTreeStyles(layoutNode));
        range.insertNode(this.editor.nodeManager.getRootNode(layoutNode));
    }

    /**
     * Gets the list-item nodes for the specified range.
     * @param {Node[]} nodesInRange
     */
    getListItemNodesInRange(nodesInRange)
    {
        let editableElement = this.editor.getEditorElement(),
            listItemNodesInRange = new Set();

        $lib.each(nodesInRange, (n) =>
        {
            let item = this.editor.nodeManager.getListItemNode(n, this.editor.nodeManager.getListNode(n, editableElement) || editableElement);

            if (item)
                listItemNodesInRange.add(item);
        });

        return listItemNodesInRange;
    }

    /**
     * Returns a value indicating if the caret is at the start of a list item (<li>).
     * @param {any} range
     */
    isCaretAtListItemStart(range)
    {
        let sContainer = range.startContainer,
            el = (sContainer.nodeType == 3) ? sContainer.parentElement : sContainer;

        return (range.startOffset == 0 && el.nodeName == 'LI');
    }

    /**
     * Returns a value indicating if the caret is at the start of a paragraph (<p>).
     * @param {any} range
     */
    isCaretAtParagraphStart(range)
    {
        let sContainer = range.startContainer,
            el = (sContainer.nodeType == 3) ? sContainer.parentElement : sContainer;

        return (range.startOffset == 0 && el.nodeName == 'P');
    }

    /**
     * Returns a value indicating if the start container of the range allows content.
     * @param {any} range
     */
    allowContent(range)
    {
        return (range.startContainer.nodeType != 1 || range.startContainer.contentEditable != 'false');
    }
};

export default componyx.UI.editor_modules.RangeManager;
