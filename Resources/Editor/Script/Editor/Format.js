/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * Format module for text formatting operations
 * @class Format
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.Format = class Format
{
    constructor(editor)
    {
        this.editor = editor;
        this.instance = editor;
        this.utility = editor.utility;
        this.cloneStamp = null;
    }

    /**
     * Sets a CSS block-level style on all root block nodes in the selection.
     * @param {string} property - CSS style property (camelCase, e.g. "text-align")
     * @param {string} value - CSS value
     */
    setBlockStyle(property, value)
    {
        const editor = this.editor;

        editor.activateDocument();

        const selection = editor.selectionRange,
            history = editor.history;

        let range = selection.getRange();

        if (!range)
            return;

        let nodes = selection.getRootNodesInRange(range);

        if (!nodes || !nodes.length)
            return;

        nodes.forEach(node =>
        {
            if (value == null || value === '')
                node.style.removeProperty(property);
            else
                node.style.setProperty(property, value);
        });

        history.addItem();
    }

    /**
     * Toggles the layout node on/off.
     * @param {Object} settings
     */
    toggleLayoutNode(settings)
    {
        this.editor.activateDocument();

        let range = this.editor.selectionRange.getRange();

        if (!this.allowContent(range))
            return;

        range = this.editor.selectionRange.ensureTextRange(range);

        let nodes = this.editor.selectionRange.getRootNodesInRange(range),
            length = nodes.length,
            rootNode = nodes[0],
            nodeName = settings.tag,
            styles = settings.styles,
            clearStyle = this.isClearStyle(styles),
            removable = (!styles || !$lib.isEmpty(clearStyle)),
            layoutNode = this.editor.nodeManager.getLayoutNode(nodeName, range.startContainer, nodes[0]),
            marker, end;

        if (this.editor.history.historyStack.get(this.editor.getEditorElement()).items.length == 0)
            range = this.editor.history.addItem(range);

        if (range.collapsed)
        {
            if (this.isWordSelection(range, rootNode))
            {
                if (layoutNode && styles && this.canUpdateStyleNode(layoutNode, rootNode, clearStyle))
                {
                    this.updateNodeStyles(layoutNode, styles);
                    this.editor.contentManager.cleanUp(rootNode, null, range);
                }
                else
                {
                    if (layoutNode && removable)
                        this.removeWordLayoutNode(nodeName, rootNode, range, clearStyle);
                    else if (!clearStyle)
                        this.addWordLayoutNode(nodeName, styles, rootNode, range);
                }
            }
            else
            {
                if (layoutNode && removable)
                    this.removeLayoutNode(nodeName, rootNode, range, clearStyle);
                else if (!clearStyle)
                    this.addLayoutNode(this.createLayoutNode(nodeName, styles), range);

                this.editor.contentManager.cleanUp(rootNode, null, range);
            }
        }
        else
        {
            marker = this.editor.selectionRange.createRangeMarker(range);
            range = this.editor.selectionRange.restoreRangeToMarker(marker, this.editor.getDoc().createRange());

            for (var index = 0; index < length; ++index)
            {
                let mustRestore = true;
                rootNode = nodes[index];
                end = (index == (length - 1));

                if ('UL OL TABLE TR'.split(' ').indexOf(rootNode.nodeName) > -1)
                    continue;

                if (layoutNode && removable)
                {
                    this.removeNodesFromRange(rootNode, nodeName, range, !index, end, clearStyle);
                }
                else if (!clearStyle)
                {
                    let node = this.createLayoutNode(nodeName, styles);
                    mustRestore = this.addNodeToRange(rootNode, node, range, !index, end);

                    if (index === 0)
                        node.insertBefore($lib('#' + marker.startId), node.firstChild);
                }

                if (mustRestore)
                {
                    range = this.editor.selectionRange.restoreRangeToMarker(marker, this.editor.getDoc().createRange());
                    this.editor.contentManager.cleanUp(rootNode, null, range, marker);
                }
            }
        }

        this.editor.history.addItem(this.editor.selectionRange.getRange(), marker);
    }

    /**
     * Copies the formatting.
     */
    copyFormat()
    {
        this.editor.activateDocument();
        let range = this.editor.selectionRange.getRange(),
            rootNode = this.editor.nodeManager.getRootNode(range.startContainer);

        this.cloneStamp = this.editor.nodeManager.getLayoutNodes(range.startContainer, rootNode, true);

        if ($lib.isEmpty(this.cloneStamp))
            this.cloneStamp = null;

        return this.cloneStamp;
    }

    /**
     * Pastes the formatting to the current range.
     * @param {Node[]} format
     * @param {boolean} clear
     */
    pasteFormat(format, clear = true)
    {
        this.editor.activateDocument();

        format = format || this.cloneStamp;

        if (format)
        {
            if (clear)
                this.editor.history.noHistory(() => this.clearFormat());

            let selection = this.editor.selectionRange,
                range = selection.ensureTextRange(selection.getRange()),
                marker = selection.createRangeMarker(range),
                nodes = selection.getRootNodesInRange(range),
                length = nodes.length,
                rootNode = nodes[0],
                wordRange, end;

            if (range.collapsed && !this.isWordSelection(range, rootNode))
                this.addLayoutNode(this.editor.nodeManager.buildLayoutTree(format), range);
            else
            {
                if (range.collapsed)
                    wordRange = this.createWordRange(rootNode, marker);

                range = (wordRange) ? wordRange.range : range;

                $lib.each(nodes, (rootNode, index) =>
                {
                    end = (index == (length - 1));

                    if (this.addNodeToRange(rootNode, this.editor.nodeManager.buildLayoutTree(format), range, !index, end))
                    {
                        range = this.editor.selectionRange.restoreRangeToMarker(marker, this.editor.getDoc().createRange());
                        this.editor.contentManager.cleanUp(rootNode, null, range, marker);
                    }
                });

                if (wordRange)
                    wordRange.clear();
            }

            this.editor.history.addItem(null, marker);

            if (!arguments.length)
                this.cloneStamp = null;
        }
    }

    /**
     * Clears the formatting on the current range.
     */
    clearFormat()
    {
        this.editor.activateDocument();

        let selection = this.editor.selectionRange,
            nodeName = '*',
            range = selection.ensureTextRange(this.editor.selectionRange.getRange()),
            nodes = selection.getRootNodesInRange(range),
            length = nodes.length,
            rootNode = nodes[0], end;

        if (range.collapsed)
        {
            if (this.isWordSelection(range, rootNode))
                this.removeWordLayoutNode(nodeName, rootNode, range);
            else
                this.removeLayoutNode(nodeName, rootNode, range);
        }
        else
        {
            let marker = selection.createRangeMarker(range);

            range = selection.restoreRangeToMarker(marker, this.editor.getDoc().createRange());

            $lib.each(nodes, (node, index) =>
            {
                rootNode = nodes[index];
                end = (index == (length - 1));

                this.removeNodesFromRange(rootNode, nodeName, range, !index, end);
                range = selection.restoreRangeToMarker(marker, this.editor.getDoc().createRange());
                this.editor.contentManager.cleanUp(rootNode, null, range, marker);
            });

            selection.removeRangeMarker(marker);
        }

        this.editor.history.addItem();
    }

    /**
     * Adds layout node
     */
    addLayoutNode(layoutNode, range)
    {
        $lib.insertNode(this.editor.nodeManager.getRootNode(layoutNode), true, true, range);
        range.setStart(this.editor.nodeManager.createTextNodePlaceHolder(layoutNode, null, this.utility.zeroWidthChar), 0);
        range.collapse(true);

        let next = layoutNode.nextSibling;

        if (next && next.textContent == this.utility.zeroWidthChar)
            next.remove();
    }

    /**
     * Removes layout node
     */
    removeLayoutNode(nodeName, rootNode, range, clearStyle)
    {
        this.createEmptyWord(range);
        this.removeWordLayoutNode(nodeName, rootNode, range, clearStyle);
    }

    /**
     * Adds layout node to word
     */
    addWordLayoutNode(nodeName, styles, rootNode, range)
    {
        let marker = this.editor.selectionRange.createRangeMarker(range),
            node = this.createLayoutNode(nodeName, styles).outerHTML,
            suffix = `</${nodeName}>`,
            prefix = node.substr(0, node.length - suffix.length);

        this.surroundWord(rootNode, marker, prefix, suffix);
        this.editor.selectionRange.restoreRangeToMarker(marker, range);

        this.editor.contentManager.cleanUp(rootNode, null, range, marker);
        this.editor.selectionRange.removeRangeMarker(marker);
        range.commonAncestorContainer.normalize();
    }

    /**
     * Removes layout node for word
     */
    removeWordLayoutNode(nodeName, rootNode, range, clearStyle)
    {
        let marker = this.editor.selectionRange.createRangeMarker(range),
            wordRange = this.createWordRange(rootNode, marker, true);

        this.removeNodesFromRange(rootNode, nodeName, wordRange.range, true, true, clearStyle);
        wordRange.clear();

        this.editor.selectionRange.restoreRangeToMarker(marker, range);
        this.editor.contentManager.cleanUp(rootNode, null, range, marker);
        this.editor.selectionRange.removeRangeMarker(marker);
    }

    /**
     * Creates an empty word
     */
    createEmptyWord(range)
    {
        let textNode = this.editor.getDoc().createTextNode(this.utility.zeroWidthChar + this.utility.zeroWidthChar);
        $lib.insertNode(textNode, true, true, range);
        range.setStart(textNode, 1);
        range.collapse(true);
    }

    /**
     * Creates a word range
     */
    createWordRange(rootNode, marker, includeSpaces)
    {
        let prefixId = this.utility.newGuid(),
            suffixId = this.utility.newGuid(),
            prefix = '<span id="' + prefixId + '"></span>',
            suffix = '<span id="' + suffixId + '"></span>',
            range;

        this.surroundWord(rootNode, marker, prefix, suffix, includeSpaces);
        range = this.editor.getDoc().createRange();
        range.setStartAfter($lib('#' + prefixId));
        range.setEndBefore($lib('#' + suffixId));

        return {
            range: this.editor.selectionRange.ensureTextRange(range),
            clear: function ()
            {
                rootNode.querySelectorAll('#' + prefixId).forEach(el => el.remove());
                rootNode.querySelectorAll('#' + suffixId).forEach(el => el.remove());
            }
        };
    }

    /**
     * Surrounds a word with the specified prefix and suffix
     */
    surroundWord(rootNode, marker, prefix, suffix, includeSpaces)
    {
        let markerEl = $lib('#' + marker.startId),
            startChar = '\u200c',
            endChar = '\u200d',
            previous = this.getTextNodeWithSpace(markerEl, rootNode, true),
            next = this.getTextNodeWithSpace(markerEl, rootNode);

        if (!previous.textContent.length)
            previous.textContent = this.utility.zeroWidthChar;

        if (!next.textContent.length)
            next.textContent = this.utility.zeroWidthChar;

        previous.textContent = previous.textContent.replace(this.utility.prevWordRegEx, (includeSpaces) ? startChar + '$1$2' : '$1' + startChar + '$2');
        next.textContent = next.textContent.replace(this.utility.nextWordRegEx, (includeSpaces) ? '$1$2' + endChar : '$1' + endChar + '$2');

        let html = rootNode.innerHTML;
        html = html.replace(/[\u200c]/gm, prefix).replace(/[\u200d]/gm, suffix);

        rootNode.innerHTML = html;
    }

    /**
     * Gets the text node with spaces
     */
    getTextNodeWithSpace(node, rootNode, previous)
    {
        let next;

        node = this.editor.nodeManager.getFirstTextNode(node, rootNode, previous, true);

        while (!node.textContent.match(/[\s]/gm))
        {
            next = this.editor.nodeManager.getFirstTextNode(this.editor.nodeManager.sibling(node, rootNode, previous, null, true), rootNode, previous, true);

            if (next && next != node)
            {
                // Stop if a <br> exists between current node and next
                const range = this.editor.getDoc().createRange();

                if (previous)
                {
                    range.setStartAfter(next);
                    range.setEndBefore(node);
                }
                else
                {
                    range.setStartAfter(node);
                    range.setEndBefore(next);
                }

                if (range.cloneContents().querySelector('br'))
                    break;

                node = next;
            }
            else
                break;
        }

        return node;
    }

    /**
     * Surrounds the rootNode range with the specified layout node
     */
    addNodeToRange(rootNode, layoutNode, range, start, end)
    {
        this.editor.selectionRange.splitRange(range, start, end);

        let innerNodes = this.editor.nodeManager.getElementsByTagName(rootNode, '*'),
            innerRootNodes = innerNodes.filter((node) =>
            {
                return this.editor.nodeManager.isBlock(node) || this.editor.nodeManager.isLayoutRoot(node);
            }),
            siblings = [];

        if (innerRootNodes.length)
        {
            if (!start && !end)
            {
                siblings = this.editor.nodeManager.getSiblings(rootNode, rootNode.lastChild);
                siblings.push(rootNode.lastChild);
            }
            else
                siblings = this.editor.nodeManager.getSiblings(rootNode, (end) ? range.endContainer.nextSibling : null, (start) ? range.startContainer.previousSibling : null);

            $lib.each(innerRootNodes, (node) =>
            {
                let index = siblings.indexOf(node);

                if (index > -1)
                    siblings.splice(index, 1);
            });

            if (siblings.length)
            {
                let lineRange = this.editor.getDoc().createRange();
                lineRange.setStartBefore(siblings[0]);
                lineRange.setEndAfter(siblings[siblings.length - 1]);

                if (lineRange.toString().length)
                    this.editor.selectionRange.surroundRange(lineRange, layoutNode);
                else
                    return false;
            }
        }
        else
        {
            let lineRange = this.editor.getDoc().createRange();

            lineRange.selectNodeContents(rootNode);

            if (start)
                lineRange.setStart(range.startContainer, range.startOffset);

            if (end)
                lineRange.setEnd(range.endContainer, range.endOffset);

            if (lineRange.toString().length || (rootNode.nodeName == 'FIGURE' && layoutNode.nodeName == 'A' && !layoutNode.parentNode))
                this.editor.selectionRange.surroundRange(lineRange, layoutNode);
            else
                return false;
        }

        return true;
    }

    /**
     * Remvoes the layout nodes from the range.
     * @param {any} rootNode
     * @param {any} nodeName
     * @param {any} range
     * @param {any} start
     * @param {any} end
     * @param {any} clearStyle
     */
    removeNodesFromRange(rootNode, nodeName, range, start, end, clearStyle)
    {
        let lineRange = this.editor.getDoc().createRange(),
            startContainer = range.startContainer,
            endContainer = range.endContainer,
            startOffset,
            textLength = endContainer.textContent.length,
            layoutNodes = [],
            siblings = new Map(),
            fragment, parent;

        nodeName = nodeName.toUpperCase();

        this.editor.selectionRange.splitRange(range, start, end);
        startContainer = range.startContainer;
        endContainer = range.endContainer;
        startOffset = range.startOffset;
        textLength = endContainer.textContent.length;

        if (start)
        {
            if (nodeName == '*' || clearStyle)
            {
                layoutNodes = this.editor.nodeManager.getLayoutNodes(range.startContainer, rootNode, null, (clearStyle) ? 2 : null);
                parent = layoutNodes[layoutNodes.length - 1];
            }
            else
            {
                parent = this.editor.nodeManager.getLayoutNode(nodeName, range.startContainer, rootNode);
                layoutNodes[0] = parent;
            }

            if (parent)
            {
                $lib.each(layoutNodes, (node, index) =>
                {
                    siblings.set(node.cloneNode(false), this.editor.nodeManager.getSiblings(node, range.startContainer, range.endContainer));

                    this.removeLayout(node, clearStyle);

                    range.setStart(startContainer, startOffset);
                    if (end)
                        range.setEnd(endContainer, textLength);
                });
            }
        }

        lineRange.selectNodeContents(rootNode);

        if (start)
            lineRange.setStart(range.startContainer, range.startOffset);

        if (end)
            lineRange.setEnd(range.endContainer, range.endContainer.textContent.length);

        fragment = lineRange.extractContents();
        let temp = $lib.element('', '', '');
        temp.appendChild(fragment);
        this.removeNodes(this.editor.nodeManager.getElementsByTagName(temp, nodeName), nodeName, clearStyle);

        lineRange.insertNode($lib.extract(temp));
        this.restoreSiblings(siblings);
    }

    /**
     * Removes the layout nodes.
     * @param {any} nodes
     * @param {any} nodeName
     * @param {any} clearStyle
     */
    removeNodes(nodes, nodeName, clearStyle)
    {
        $lib.each(nodes, (node) => 
        {
            if ((this.editor.nodeManager.isTextDecorationNode(node) || this.editor.nodeManager.isStyleNode(node)) && (nodeName == '*' || node.nodeName == nodeName))
            {
                this.removeLayout(node, clearStyle);
            }
        });
    }

    /**
     * Removes the layout from the node.
     * @param {any} node
     * @param {any} clearStyle
     */
    removeLayout(node, clearStyle)
    {
        if (clearStyle)
        {
            const hasClearStyle = this.hasStyleKey(node, clearStyle);

            if (hasClearStyle && this.hasOtherStyleKeys(node, clearStyle))
                node.style.removeProperty(clearStyle);
            else if (hasClearStyle)
                $lib.unsurround(node);
        }
        else
        {
            $lib.unsurround(node);
        }
    }

    /**
     * Restored nodes that where inside parent layout-node
     */
    restoreSiblings(siblings)
    {
        for (let [layoutNode, nodeList] of siblings)
        {
            $lib.each(nodeList, (node) =>
            {
                $lib.surround(layoutNode.cloneNode(false), node);
            });
        }
    }

    /**
     * Restores the style node on the specified children
     */
    restoreOriginalStyleNode(node, child)
    {
        let next = child.nextSibling;
        $lib.surround(node, child);

        while (next)
        {
            child = next;
            next = child.nextSibling;
            node.appendChild(child);
        }
    }

    /**
     * Returns a value indicating if the style node can be updated
     */
    canUpdateStyleNode(layoutNode, rootNode, clearStyle)
    {
        if (!clearStyle)
            return true;

        let parentLayoutNodes = this.editor.nodeManager.getLayoutNodes(layoutNode, rootNode, null, 2),
            updateStyleNode = true;

        $lib.each(parentLayoutNodes, (n) =>
        {
            return (updateStyleNode = !this.hasStyleKey(n, clearStyle));
        });

        return updateStyleNode;
    }

    /**
     * Creates layout node.
     * @param {string} nodeName
     * @param {Object} styles
     * @param {*} content
     * @param {Object} attributes
     * @param {Object} properties
     */
    createLayoutNode(nodeName, styles, content, attributes, properties)
    {
        return this.updateNodeStyles($lib.element('', '', nodeName, content, attributes, properties), styles);
    }

    /**
     * Updates the node styles.
     * @param {Node} node
     * @param {Object} styles
     * @param {boolean} clear
     */
    updateNodeStyles(node, styles, clear)
    {
        if (!$lib.isEmpty(styles))
            node.setAttribute(this.utility.attrPrefix + 'style', '');

        $lib.each(styles, (value, key) =>
        {
            if (clear)
                node.style.removeProperty(key);
            else
                node.style.setProperty(key, value);
        });

        return node;
    }

    /**
     * Gets the styles specified on the node and parent nodes.
     * Uses a cache (Map) to avoid redundant computation.
     * @param {Node} node
     * @param {Map<Node, Object>} [styleCache] Optional cache for memoization
     */
    getLayoutTreeStyles(node, styleCache = new Map())
    {
        if (!node)
            return {};

        if (styleCache.has(node))
            return styleCache.get(node);

        let styles = {};

        let current = node;
        while (current)
        {
            if (this.editor.nodeManager.isStyleNode(current))
            {
                this.iterateStyle(current, (name, value) =>
                {
                    if (!(name in styles))
                        styles[name] = value;
                });
            }
            current = current.parentNode;
        }

        styleCache.set(node, styles);
        return styles;
    }

    /**
     * Updates nodes with the specified style.
     * @param {Node} layoutNode
     * @param {Object} styles
     */
    updateDeeperStyleNodes(layoutNode, styles)
    {
        if ($lib.isEmpty(styles))
            return;

        let nodes = this.editor.nodeManager.getElementsByTagName(layoutNode, 'span');

        $lib.each(nodes, (node) =>
        {
            if (this.editor.nodeManager.isStyleNode(node))
            {
                if (this.hasDifferentStyleProp(layoutNode, node))
                    this.updateNodeStyles(node, styles, true);
                else
                    $lib.unsurround(node);
            }
        });
    }

    /**
     * Returns a value indicating if the parent and child have equal style properties.
     * @param {Node} parent
     * @param {Node} child
     */
    hasEqualStyles(parent, child)
    {
        if (parent.style.cssText == child.style.cssText)
            return true;

        let param = { has: false };

        this.iterateStyle(child, function (param, name, value)
        {
            return (param.has = parent.style[name] == value);
        }.bind(this, param));

        return param.has;
    }

    /**
     * Returns a value indicating if the child has different style properties defined than the parent.
     * @param {Node} parent
     * @param {Node} child
     */
    hasDifferentStyleProp(parent, child)
    {
        let param = { has: false };

        this.iterateStyle(child, function (param, name, value)
        {
            return !(param.has = $lib.isEmpty(parent.style[name]))
        }.bind(this, param));

        return param.has;
    }

    /**
     * Returns a value indicating if the node has other style keys than the one specified.
     * @param {Node} node
     * @param {string} key
     */
    hasOtherStyleKeys(node, key)
    {
        let param = { has: false };

        this.iterateStyle(node, function (param, name, value)
        {
            return !(param.has = name != key);
        }.bind(this, param));

        return param.has;
    }

    /**
     * Returns a value indicating if the node has the specified style key.
     * @param {Node} node
     * @param {string} key
     */
    hasStyleKey(node, key)
    {
        let param = { has: false };

        this.iterateStyle(node, function (param, name, value)
        {
            return !(param.has = name == key);
        }.bind(this, param));

        return param.has;
    }

    /**
     * Copies all the styles.
     * @param {Node} from
     * @param {Node} to
     */
    copyStyles(from, to)
    {
        this.iterateStyle(from, (name, value) => { to.style[name] = value; })
    }

    /**
     * Iterates all style properties and executes the specified function on each property.
     * @param {Node} node
     * @param {Function} fn
     */
    iterateStyle(node, fn)
    {
        if (!node.style)
            return;

        let props = node.style.cssText.split(';'), prop, name;

        $lib.each(props, (style) =>
        {
            prop = style.split(/:(.+)/);
            name = $lib.trim(prop[0]);

            if (!$lib.isEmpty(name))
                return fn(name, $lib.trim(prop[1]));
        });
    }

    /**
     * Returns a value indicating if the nodes can be merged.
     * @param {Node} sibling
     * @param {Node} node
     */
    canMerge(sibling, node)
    {
        if (!sibling)
            return false;

        if (this.editor.nodeManager.isStyleNode(sibling) && this.editor.nodeManager.isStyleNode(node))
            return (sibling.style.cssText == node.style.cssText);
        else
            return ((sibling.nodeType != 1 || !sibling.hasAttributes()) && sibling.nodeName == node.nodeName);
    }

    /**
     * Returns a value indicating if the style property must be cleared.
     * @param {Object} styles
     */
    isClearStyle(styles)
    {
        let styleName = null;
        $lib.each(styles, (v, k) =>
        {
            if (v == null)
                styleName = k;

            return !styleName;
        });

        return styleName;
    }

    /**
     * Returns a value indicating if the range allows content.
     * @param {Range} range
     */
    allowContent(range)
    {
        return (range.startContainer.nodeType != 1 || range.startContainer.contentEditable != 'false');
    }

    /**
     * Returns a value indicating if the range caret is placed inside a word.
     * @param {Range} range
     * @param {Node} rootNode
     */
    isWordSelection(range, rootNode)
    {
        let startContainer = range.startContainer,
            container = this.editor.nodeManager.getTextContainer(startContainer, rootNode),
            prevChar = this.getPreviousChar(startContainer, container, range),
            nextChar = this.getNextChar(startContainer, container, range);

        return (!$lib.isEmpty(prevChar) && prevChar.match(/[^\s]/) && !$lib.isEmpty(nextChar) && nextChar.match(/[^\s]/));
    }

    /**
     * Gets the previous character.
     * @param {Node} textNode
     * @param {Node} parent
     * @param {Range} range
     */
    getPreviousChar(textNode, parent, range)
    {
        let prevNode, prevChar = '';

        if (range.startOffset > 0)
            prevChar = textNode.textContent[range.startOffset - 1];
        else
        {
            prevNode = this.editor.nodeManager.sibling(textNode, parent, true, null, true);
            prevChar = (prevNode) ? prevNode.textContent[prevNode.textContent.length - 1] : '';
        }

        return prevChar;
    }

    /**
     * Gets the next character.
     * @param {Node} textNode
     * @param {Node} parent
     * @param {Range} range
     */
    getNextChar(textNode, parent, range)
    {
        let nextNode, nextChar = '';

        if (textNode.textContent.length > range.startOffset)
            nextChar = textNode.textContent[range.startOffset];
        else
        {
            nextNode = this.editor.nodeManager.sibling(textNode, parent, false, null, true);
            nextChar = (nextNode) ? nextNode.textContent[0] : '';
        }

        return nextChar;
    }
};

export default componyx.UI.editor_modules.FormatManager;
