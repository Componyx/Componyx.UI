/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * NodeManager module - node manipulation and tree operations.
 * @class NodeManager
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.NodeManager = class NodeManager
{
    constructor(editor)
    {
        this.editor = editor;
        this.utility = editor.utility;
    }

    /**
     * Returns a value indicating if the node is a bookmark node.
     * @param {Node} node
     */
    isBookmark(node)
    {
        return node && node.nodeType == 1 && node.nodeName == 'A' && node.hasAttribute('id') && !node.hasAttribute('href');
    }

    /**
     * Returns a value indicating if the node contains an image.
     * @param {Node} node
     */
    isImage(node)
    {
        return node && node.nodeType == 1 && !!node.querySelector(':scope > img');
    }

    /**
     * Returns a value indicating if the node is a media node.
     * @param {Node} node
     */
    isMedia(node)
    {
        return node && node.nodeType == 1 && node.nodeName == 'FIGURE' && node.hasAttribute(this.utility.attrPrefix + 'media');
    }

    /**
     * Returns a value indicating if the node is a link node.
     * @param {Node} node
     */
    isLink(node)
    {
        return node && node.nodeType == 1 && node.nodeName == 'A' && node.href;
    }

    /**
     * Returns a value indicating if the node matches the tag.
     * @param {string[]|string} tag
     * @param {Node} node
     */
    isTagMatch(tag, node)
    {
        let isMatch = false, name = node.nodeName.toLowerCase();
        tag = ($lib.isArray(tag)) ? tag : [tag];

        $lib.each(tag, function (t)
        {
            isMatch = (name == t.toLowerCase());
            return !isMatch;
        });

        return isMatch;
    }

    /**
     * Returns a value indicating if the node is a block node.
     * @param {Node} node
     */
    isBlock(node, includeWrapped = false)
    {
        if (!node || node.nodeType != 1)
            return false;

        let name = node.nodeName;

        if (!includeWrapped && name.match(this.utility.wrappedNodesRegEx))
            return false;
        else if (name.match(this.utility.blockNodeRegEx))
            return true;

        return window.getComputedStyle(node, null).getPropertyValue('position') == 'static' && window.getComputedStyle(node, null).getPropertyValue('display') == 'block';
    }

    /**
     * Returns a value indicating if the node is a list node.
     * @param {Node} node
     */
    isList(node)
    {
        return node.nodeType == 1 && 'UL OL'.split(' ').indexOf(node.nodeName) > -1;
    }

    /**
     * Returns a value indicating if the node is a root node for layout elements (LI).
     * @param {Node} node
     */
    isLayoutRoot(node)
    {
        return node.nodeType == 1 && 'LI'.split(' ').indexOf(node.nodeName) > -1;
    }

    /**
     * Returns a value indicating if the node is a layout node.
     * @param {Node} node
     */
    isLayoutNode(node)
    {
        return this.isTextDecorationNode(node) || this.isStyleNode(node);
    }

    /**
     * Returns a value indicating if the node is a text decoration node.
     * @param {Node} node
     */
    isTextDecorationNode(node)
    {
        return node.nodeType == 1 && $lib.isEmpty(node.id) && this.utility.layoutNodeNames.filter((val) => { return val != 'span' }).indexOf(node.nodeName.toLowerCase()) > -1;
    }

    /**
     * Returns a value indicating if the node is a style node.
     * @param {Node} node
     */
    isStyleNode(node)
    {
        return node.nodeType == 1 && node.nodeName == 'SPAN' && !$lib.isEmpty(node.style.cssText);
    }

    /**
     * Returns a value indicating if the parent node contains the node.
     * @param {Node} parent
     * @param {Node} node
     */
    contains(parent, node)
    {
        return $lib.contains(parent, node);
    }

    /**
     * Gets the image element inside the figure element.
     * @param {Node} el
     */
    getImageFromNode(el)
    {
        return el.nodeName === 'IMG' ? el : el.querySelector('img');
    }

    /**
     * Gets the node with the specified node name inside the specified element.
     * @param {Node} el The root element from where to search.
     * @param {String} name The name of the node to find.
     */
    getInnerNodeByName(el, name)
    {
        if (el.nodeName === name) return el;
        return el.querySelector(name);
    }

    /**
     * Gets the root node (block) for the specified node.
     * @param {Node} node
     * @param {boolean} [useLayoutRoot = true]
     */
    getRootNode(node, useLayoutRoot = true)
    {
        let editableElement = this.editor.getEditorElement();

        if (node == editableElement)
            return node.firstChild;
        else if (node.parentElement == editableElement)
            return node;

        while (node)
        {
            if (node.parentElement && !this.isBlock(node) && (!useLayoutRoot || !this.isLayoutRoot(node)))
                node = node.parentElement;
            else
                return node;
        }
    }

    /**
     * Gets the surrounding nodes for the specified element.
     * @param {Node} el
     * @param {Node} rootEl
     */
    getSurroundingNodes(el, rootEl)
    {
        let editableElement = this.editor.getEditorElement(),
            nodes = [];

        rootEl = rootEl || editableElement;

        while (el && el != rootEl)
        {
            nodes.push(el);
            el = el.parentElement;
        }

        return nodes;
    }

    /**
     * Gets the previous or next sibling node.
     * @param {Node} node
     * @param {Node} parent
     * @param {boolean} previous
     * @param {number} nodeType
     * @param {boolean} skipEmpty
     */
    sibling(node, parent, previous, nodeType, skipEmpty)
    {
        let fnGet = (previous) ? function (node) { return node.previousSibling; } : function (node) { return node.nextSibling; },
            fnNext = function (node)
            {
                let next;

                while (node && node != parent && !(next = fnGet(node)))
                {
                    if (node.parentNode != parent)
                        node = node.parentNode;
                    else
                        node = null;
                }

                return next;
            }

        while ((node = fnNext(node)) && ((nodeType && nodeType != node.nodeType) || (skipEmpty && !node.nodeName.match(this.utility.voidNodeRegEx) && !node.textContent.length) || (node.nodeType == 1 && node.hasAttribute(this.utility.markerAttr))))
        {
        }

        return node;
    }

    /**
     * Gets the previous sibling nodes for the startnode and the next sibling nodes for the endnode.
     * @param {Node} parent
     * @param {Node} startNode
     * @param {Node} endNode
     */
    getSiblings(parent, startNode, endNode, skipEmpty = true)
    {
        let node = startNode,
            nodes = [];

        if (node && this.contains(parent, node))
        {
            while ((node = this.sibling(node, parent, true, null, skipEmpty)))
            {
                nodes.unshift(node);
            }
        }

        node = endNode;

        if (node && this.contains(parent, node))
        {
            while ((node = this.sibling(node, parent, false, null, skipEmpty)))
            {
                nodes.push(node);
            }
        }

        return nodes;
    }

    /**
     * Gets the elements by tag name and returns them in a modifiable array.
     * @param {Node} node
     * @param {String} tagName
     * @param {Boolean} filterMarkers
     */
    getElementsByTagName(node, tagName, filterMarkers = true)
    {
        let mustFilter = (tagName.split(' ').length > 1),
            elements = node.getElementsByTagName((mustFilter) ? '*' : tagName),
            nodes = [];

        tagName = ' ' + tagName.toUpperCase() + ' ';

        $lib.each(elements, (el) =>
        {
            if ((!mustFilter || tagName.indexOf(' ' + el.nodeName + ' ') > -1) && (!filterMarkers || !el.hasAttribute(this.utility.markerAttr)))
                nodes.push(el);
        });

        return nodes;
    }

    /**
     * Gets the first text node within the specified node.
     * @param {Node} node
     * @param {Node} parent
     * @param {boolean} last
     * @param {boolean} skipEmpty
     */
    getFirstTextNode(node, parent, last, skipEmpty)
    {
        if (skipEmpty == undefined)
            skipEmpty = true;

        while (node && (node.nodeType != 3 || (skipEmpty && !node.textContent.length)))
        {
            if (node.hasChildNodes())
                node = (last) ? node.lastChild : node.firstChild;
            else
                node = this.sibling(node, parent, last, null, skipEmpty);
        }

        return node;
    }

    /**
     * Gets the next sibling node
     * @param {Node} node
     */
    nextNode(node)
    {
        if (!node)
            return null;

        if (node.hasChildNodes())
        {
            return node.firstChild;
        }
        else
        {
            while (node && !node.nextSibling)
            {
                node = node.parentNode;
            }
            if (!node)
            {
                return null;
            }
            return node.nextSibling;
        }
    }

    /**
     * Returns a value indicating if the node can be removed.
     * @param {Node} node
     */
    canRemove(node)
    {
        return (this.isLayoutNode(node) && (!this.nodeHasContent(node, false) || (node.firstElementChild == null && node.textContent.match(/^\uFEFF+$/g))));
    }

    /**
     * Returns a value indicating if the node has content.
     * @param {Node} node
     * @param {boolean} [ignoreBR=true]
     */
    nodeHasContent(node, ignoreBR = true)
    {
        if (node.textContent.length)
            return true;

        node = node.firstElementChild;

        while (node)
        {
            if ((!ignoreBR || (ignoreBR && node.nodeName != 'BR')) && !node.hasAttribute(this.utility.markerAttr))
                return true;

            node = node.nextElementSibling;
        }

        return false;
    }

    /**
     * Creates a text node inside the node.
     * @param {Node} node
     * @param {Node} beforeNode
     * @param {string} text
     */
    createTextNodePlaceHolder(node, beforeNode, text)
    {
        let doc = this.editor.getDoc(),
            textNode = doc.createTextNode(text || '');

        if (beforeNode)
            beforeNode.parentNode.insertBefore(textNode, beforeNode);
        else if (node.nodeName.match(this.utility.voidNodeRegEx))
            node.parentNode.insertBefore(textNode, node);
        else
            node.appendChild(textNode);

        return textNode;
    }

    /**
     * Creates node with specified settings.
     * @param {any} settings
     * @returns {HTMLElement} node
     */
    createNode(settings)
    {
        let node;

        if (!settings.attributes)
            settings.attributes = {};

        if (settings.cssClass)
            settings.attributes.class = settings.cssClass;

        if (settings.outerHTML)
        {
            let el = $lib.element();
            el.innerHTML = settings.outerHTML;
            node = $lib.unsurround(el); // document fragment node
        }
        else
            node = this.editor.format.createLayoutNode(settings.tag, settings.styles, (settings.innerHTML) ? [settings.innerHTML] : settings.textContent, settings.attributes, settings.properties);

        if (!$lib.isEmpty(settings.allowContent))
            node.contentEditable = settings.allowContent; // FF will remove any empty nodes on delete/backspace

        if (settings.selectable)
            this.editor.bindNodeEvents(node);

        return node;
    }

    /**
     * Gets the text container.
     * @param {Node} node
     * @param {Node} parent
     */
    getTextContainer(node, parent)
    {
        while (node != parent && 'DIV TD LI'.split(' ').indexOf(node.nodeName) == -1)
        {
            node = node.parentNode;
        }

        return node;
    }

    /**
     * Gets the nodes before the specified node.
     * @param {Node} parentNode The parent node.
     * @param {Node} endNode The ending node.
     * @returns {DocumentFragment} A fragment containing the nodes.
     */
    getNodesBefore(parentNode, endNode)
    {
        let node = parentNode.firstChild,
            fragment = document.createDocumentFragment(),
            next, current = fragment;

        while (node && node != endNode && node != parentNode)
        {
            if (!node.contains(endNode))
            {
                next = node.nextSibling;
                current.appendChild(node);
                node = next;
            }
            else
            {
                current = node.cloneNode(false);
                fragment.appendChild(current);
                node = node.firstChild;
            }
        }

        return fragment;
    }

    /**
     * Get the list (UL/OL) node.
     * @param {Node} startNode
     * @param {Node} rootNode
     */
    getListNode(startNode, rootNode)
    {
        return this.getMatchingNode(startNode, rootNode, (node) => { return this.utility.listFilter.indexOf(node.nodeName) > -1 });
    }

    /**
     * Get the list-item (LI) node.
     * @param {Node} startNode
     * @param {Node} rootNode
     */
    getListItemNode(startNode, rootNode)
    {
        return this.getMatchingNode(startNode, rootNode, (node) => { return node.nodeName == 'LI'; });
    }

    /**
     * Get the layout node for the startNode.
     * @param {String} nodeName
     * @param {Node} startNode
     * @param {Node} rootNode
     */
    getLayoutNode(nodeName, startNode, rootNode)
    {
        nodeName = nodeName.toUpperCase();

        let isMatch = (node) =>
        {
            if (node.nodeName === nodeName)
                return true;

            // Only match style spans if the layout operation IS a style operation
            if (nodeName === 'SPAN' && this.isStyleNode(node))
                return true;

            return false;
        };

        return this.getMatchingNode(startNode, rootNode, isMatch);
    }

    /**
     * Gets the node that matches the specified condition.
     * @param {Node} startNode
     * @param {Node} rootNode
     * @param {Function} isMatch
     */
    getMatchingNode(startNode, rootNode, isMatch)
    {
        let node = startNode;

        while (node && node != rootNode && !isMatch(node))
        {
            node = node.parentNode;
        }

        return (isMatch(node)) ? node : null;
    }

    /**
     * Gets the layout nodes from a specific start node.
     * @param {Node} startNode The node to start from.
     * @param {Node} rootNode The highest node in the tree to check.
     * @param {Boolean} [clone] A value indicating if a found layout-node is cloned.
     * @param {Number} [type] The type of the nodes to add (1: layout-node, 2: style-node, null/undefined/0: both)
     * @returns {Node[]} The list of layout-nodes.
     */
    getLayoutNodes(startNode, rootNode, clone, type)
    {
        let nodes = [], node = startNode, isLayout, isStyle;

        while (node != rootNode)
        {
            isLayout = this.isTextDecorationNode(node);
            isStyle = this.isStyleNode(node);

            if ((!type && (isLayout || isStyle)) || (type == 1 && isLayout) || (type > 1 && isStyle))
                nodes.push((clone) ? node.cloneNode(false) : node);

            node = node.parentNode;
        }

        return nodes.reverse();
    }

    /**
     * Builds the layout node tree with the specified nodes.
     * @param {Node[]} nodes
     */
    buildLayoutTree(nodes)
    {
        let layoutNode;

        $lib.each(nodes, (node) =>
        {
            let clone = node.cloneNode(false);

            if (node.hasAttribute(this.utility.selAttr))
                this.editor.bindNodeEvents(clone);

            if (layoutNode)
                layoutNode.appendChild(clone);

            layoutNode = clone;
        });

        return layoutNode;
    }

    /**
     * Removes the node while keeping markers.
     * @param {Node} node
     * @param {Object} marker
     */
    removeNodeAndKeepMarkers(node, marker)
    {
        let doc = this.editor.getDoc(),
            startMarker = node.querySelector('#' + marker.startId),
            endMarker = (marker.endId) ? node.querySelector('#' + marker.endId) : null;

        if (startMarker || endMarker)
        {
            let fragment = doc.createDocumentFragment();

            if (startMarker)
                fragment.appendChild(startMarker);

            if (endMarker)
                fragment.appendChild(endMarker);

            node.replaceWith(fragment);
        }
        else
            $lib.remove(node);
    }

    /**
     * Change node to specified block element.
     * @param {Node} node
     * @param {Node} blockNode
     */
    setBlockElement(node, blockNode)
    {
        let childNode = (blockNode && blockNode.firstElementChild) ? blockNode.firstElementChild : blockNode;

        childNode.appendChild($lib.extract(node));

        if (this.isLayoutRoot(node)) // exception for LI/TH/TD
            node.appendChild(blockNode);
        else
        {
            this.editor.format.copyStyles(node, blockNode);
            node.replaceWith(blockNode);
        }

        if (!childNode.childNodes.length)
            childNode.appendChild(this.editor.getDoc().createTextNode(this.utility.zeroWidthChar));
    }

    createCursorSpace(x)
    {
        this.editor.activateDocument();

        if (!this.editor.contentManager.hasContent())
            return;

        let range = this.editor.selectionRange.getRange(),
            rootNodes = this.editor.selectionRange.getRootNodesInRange(range),
            rootNode = rootNodes[0],
            firstChild = rootNode.firstChild,
            lastChild = rootNode.lastChild;

        if (firstChild && firstChild != rootNode && firstChild.nodeType == 1 && firstChild.hasAttribute(this.utility.selAttr) && firstChild.contentEditable == 'false')
        {
            let textNode = this.editor.getDoc().createTextNode(this.utility.zeroWidthChar);

            if (x < $lib.getPos(firstChild).left && !firstChild?.previousSibling?.nodeValue?.match(this.utility.zeroWidthRegEx))
            {
                firstChild.parentNode.insertBefore(textNode, firstChild);
                range.setStart(textNode, 0);
                range.collapse(true);
                this.editor.selectionRange.restoreRange(range);
            }
            else if (lastChild.nodeType == 1 && lastChild.nodeName != 'BR' && x > $lib.getPos(lastChild).right && !lastChild?.nextSibling?.nodeValue?.match(this.utility.zeroWidthRegEx))
            {
                lastChild.parentNode.insertBefore(textNode, lastChild.nextSibling);
                range.setStart(textNode, 0);
                range.collapse(true);
                this.editor.selectionRange.restoreRange(range);
            }
        }
    }
};

export default componyx.UI.editor_modules.NodeManager;
