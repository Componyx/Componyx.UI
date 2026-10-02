/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * ListManager module - manages list operations.
 * @class ListManager
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.ListManager = class ListManager
{
    constructor(editor)
    {
        this.editor = editor;
        this.utility = editor.utility;
    }

    /**
     * Toggles a list item node.
     * @param {string} tag
     * @param {boolean} on
     */
    toggleListItem(tag, on)
    {
        this.editor.activateDocument();

        if (!this.editor.contentManager.hasContent())
            this.editor.contentManager.insertParagraph();

        let selection = this.editor.selectionRange,
            range = selection.getRange(),
            nodesInRange = selection.getNodesInRange(range),
            selectedListItems = selection.getListItemNodesInRange(nodesInRange),
            rootNodes = selection.getRootNodesInRange(range, nodesInRange, false),
            marker = selection.createRangeMarker(selection.ensureTextRange(range)),
            type = this.editor.menuManager.getSelectedItemId(tag),
            prop = 'list-style-type',
            styles = {}, clear = false;

        if (type)
            type = type.replace(`${tag}_`, '');

        if (type == 'disc' || type == 'decimal')
        {
            clear = true;
            styles[prop] = null;
        }
        else
            styles[prop] = type;

        $lib.each(rootNodes, (rootNode) =>
        {
            if (rootNode.nodeName == tag) // list-node
            {
                if (on)
                    this.editor.format.updateNodeStyles(rootNode, styles, clear);
                else
                {
                    let listNode = rootNode, parentListNode;

                    while (listNode)
                    {
                        parentListNode = this.editor.nodeManager.getListNode(listNode.parentElement, this.editor.getEditorElement());
                        this.decreaseListIndent(listNode, selectedListItems, (parentListNode) ? false : true);
                        listNode = parentListNode;
                    }
                }
            }
            else
            {
                let layoutNode = this.editor.format.updateNodeStyles($lib.element('', '', tag), styles);

                if (this.utility.listFilter.indexOf(rootNode.nodeName) == -1)
                    layoutNode.appendChild($lib.element('', '', 'li'));

                rootNode.style.removeProperty(prop);
                this.editor.nodeManager.setBlockElement(rootNode, this.editor.nodeManager.getRootNode(layoutNode).cloneNode(true));
            }
        });

        this.editor.history.addItem(range, marker);
        this.editor.deactivateDocument();
    }

    /**
     * Toggles a list item node type.
     * @param {string} tag
     */
    toggleListItemType(tag)
    {
        this.toggleListItem(tag, true);
    }

    /**
     * Increases the indent of the specified list-item node.
     * @param {Node} node
     */
    increaseListIndent(node)
    {
        let nodeName = node.parentElement.nodeName,
            list = node.querySelector(this.utility.listFilter),
            prev = (node.previousElementSibling && node.previousElementSibling.nodeName == 'LI') ? node.previousElementSibling : null,
            next = (node.nextElementSibling && node.nextElementSibling.nodeName == 'LI') ? node.nextElementSibling : null,
            nextList = (next && next.firstChild && this.utility.listFilter.indexOf(next.firstChild.nodeName) > -1) ? next.firstChild : null,
            removeList = (list) =>
            {
                let parentItem = list.parentElement;
                list.remove();

                if (!parentItem.childNodes.length)
                    parentItem.remove();
            };

        if (prev)
        {
            let prevList = prev.querySelector(this.utility.listFilter);

            if (!prevList)
                prevList = $lib.element(prev, '', nodeName);

            prevList.appendChild(node);

            if (list)
            {
                prevList.insertBefore($lib.extract(list), node.nextSibling);
                removeList(list);
            }

            if (nextList)
            {
                prevList.appendChild($lib.extract(nextList));
                removeList(nextList);
            }
        }
        else if (nextList)
        {
            nextList.insertBefore(node, nextList.firstChild);

            if (list)
            {
                nextList.insertBefore($lib.extract(list), node.nextSibling);
                removeList(list);
            }
        }
        else if (list)
        {
            let liBefore = node.cloneNode(false);

            liBefore.appendChild(this.editor.nodeManager.getNodesBefore(node, list));
            list.insertBefore(liBefore, list.firstChild);
            node.style.listStyleType = 'none';

            let after = this.editor.nodeManager.sibling(list, node);

            if (after)
            {
                list.remove();

                let fragmentAfter = $lib.extract(node);

                if (fragmentAfter.childNodes.length)
                {
                    let liAfter = node.cloneNode(false);
                    liAfter.appendChild(fragmentAfter);
                    list.appendChild(liAfter);
                }

                node.appendChild(list);
            }
        }
        else // create deeper list
        {
            let li = node.cloneNode(true);

            node.style.listStyleType = 'none';
            node.innerHTML = '';
            node.appendChild($lib.element('', '', nodeName, li));
        }
    }

    /**
     * Decreases the indent of the selected list-item nodes of the specified list node.
     * @param {Node} listNode
     * @param {Set<Node>} selectedListItems
     * @param {boolean} removeSelected
     */
    decreaseListIndent(listNode, selectedListItems, removeSelected = true)
    {
        let li = listNode.firstElementChild,
            listNodeParent = listNode.parentElement,
            listNodeSibling = listNode.nextElementSibling,
            fragmentSelected = this.editor.getDoc().createDocumentFragment(),
            fragmentAfter = this.editor.getDoc().createDocumentFragment(),
            childListNode, afterListNode, node, next, p;

        while (li)
        {
            if (!selectedListItems.has(li))
                li = (!next) ? li.nextElementSibling : null;
            else
            {
                if (removeSelected)
                    selectedListItems.delete(li);

                next = li.nextElementSibling;
                fragmentSelected.appendChild(li);
                childListNode = li.querySelector(this.utility.listFilter);
                li = next;

                if (childListNode) // keep same depth level
                    this.increaseListDepth(childListNode);
            }
        }

        if (next) // copy to new list-node
        {
            node = next;

            while (node)
            {
                next = node.nextElementSibling;
                fragmentAfter.appendChild(node);
                node = next;
            }
        }

        if (listNodeParent.nodeName == 'LI') // add selected LI's to parent list-node
        {
            let lastItem = fragmentSelected.lastChild;
            listNodeParent.parentElement.insertBefore(fragmentSelected, listNodeParent.nextElementSibling);

            childListNode = listNodeParent.firstElementChild;

            if (this.utility.listFilter.indexOf(childListNode.nodeName) > -1 && !childListNode.childNodes.length)
                childListNode.remove();

            if (fragmentAfter.childNodes.length)
            {
                afterListNode = lastItem.querySelector(this.utility.listFilter);

                if (!afterListNode)
                    afterListNode = $lib.element(lastItem, '', listNode.nodeName);
            }
        }
        else // add selected LI's as P tags
        {
            while (node = fragmentSelected.firstChild)
            {
                p = $lib.element('', '', 'p', $lib.extract(node));
                listNodeParent.insertBefore(p, listNodeSibling);
                node.remove();
            }

            if (fragmentAfter.childNodes.length)
            {
                afterListNode = $lib.element('', '', listNode.nodeName);
                listNodeParent.insertBefore(afterListNode, listNodeSibling);
            }
        }

        if (afterListNode)
            afterListNode.appendChild(fragmentAfter); // add unselected list-item's at the bottom

        if (!listNode.childNodes.length)
            listNode.remove();
    }

    /**
     * Increases the depth of the list.
     * @param {Node} listNode
     */
    increaseListDepth(listNode)
    {
        let ul = $lib.element('', '', listNode.nodeName),
            li = $lib.element('', '', 'li', '', { style: 'list-style-type: none' });

        $lib.surround(li, listNode);
        $lib.surround(ul, li);
    }

    /**
     * Returns a value indicating if the caret is at the start of a list item (<li>).
     * @param {Range} range
     */
    isCaretAtListItemStart(range)
    {
        let sContainer = range.startContainer,
            el = (sContainer.nodeType == 3) ? sContainer.parentElement : sContainer;

        return (range.startOffset == 0 && el.nodeName == 'LI');
    }
};

export default componyx.UI.editor_modules.ListManager;
