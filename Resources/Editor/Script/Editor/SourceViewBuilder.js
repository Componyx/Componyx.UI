/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};
/**
 * SourceViewBuilder module — The source viewer.
 * 
 * @class SourceViewBuilder
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.SourceViewBuilder = class SourceViewBuilder
{
    constructor(targetNode, buttonCssClass = '', defTagName = 'span', rootItemText = 'root-item', voidNodeRegEx = null)
    {
        this.targetNode = targetNode;
        this.buttonCssClass = buttonCssClass;
        this.defTagName = defTagName;
        this.rootItemText = rootItemText;
        this.voidNodeRegEx = voidNodeRegEx;
    }

    outerHTML()
    {
        let rootItem = this.targetNode.querySelector('.item.root'),
            tag = $lib.remove(rootItem.querySelector('.tag')),
            content = this.targetNode.textContent;

        rootItem.insertBefore(tag, rootItem.querySelector('.item')); // restore tag
        return content;
    }

    build(sourceNode)
    {
        this.targetNode.innerHTML = '';

        let me = this,
            rootItem = $lib.element(this.targetNode, '', '', '', '', { className: 'item root' });

        rootItem.onclick = me.select.bind(me, rootItem);
        me.createButton(rootItem, { className: this.buttonCssClass, onclick: me.edit.bind(me, rootItem, true) });
        $lib.element(rootItem, '', 'span', this.rootItemText, '', { className: 'tag' });
        me.createEditBox(rootItem, true);
        me.buildSection(sourceNode, rootItem);
    }

    buildSection(sourceNode, targetNode, beforeNode)
    {
        let me = this,
            node = sourceNode.firstChild, nodeType, hasChildElements,
            item, nodeName, tag;

        while (node)
        {
            nodeType = node.nodeType;
            nodeName = node.nodeName.toLowerCase();
            hasChildElements = node.firstElementChild != null;

            if (nodeType == 1)
            {
                item = $lib.element(targetNode, beforeNode, '', '', '', { className: 'item' });
                item.onclick = me.select.bind(me, item);
                me.createButton(item, { className: this.buttonCssClass, onclick: me.edit.bind(me, item, false) });

                if (hasChildElements)
                    $lib.element(item, '', this.defTagName, '', '', { className: 'expand', onclick: me.toggleExpand.bind(me, item) });
                else
                    item.className += ' childless';

                me.createEditBox(item, false);

                tag = $lib.element(item, '', this.defTagName, `<${nodeName}`, '', { className: 'tag' });

                if (node.hasAttributes())
                    me.buildAttributes(node, tag);

                tag.appendChild(document.createTextNode('>'));

                if (hasChildElements)
                    me.buildSection(node, item);
                else
                    this.writeData(node, item);

                if (node.hasChildNodes() || (!this.voidNodeRegEx || !nodeName.match(this.voidNodeRegEx)))
                    tag = $lib.element(item, '', this.defTagName, `</${nodeName}>`, '', { className: 'end-tag' });
            }
            else
                this.writeData(node, targetNode);

            node = node.nextSibling;
        }
    }

    createEditBox(item, isRoot)
    {
        $lib.element(item, '', 'span', '', '', {
            className: 'edit-box',
            contentEditable: true,
            spellcheck: false,
            onblur: this.edit.bind(this, item, isRoot)
        });
    }

    writeData(node, targetNode)
    {
        let data = $lib.element(targetNode, '', this.defTagName),
            nodeType = node.nodeType;

        data.className = (nodeType == 8) ? 'data comment' : 'data';
        data.textContent = (nodeType == 8) ? ` <!-- ${node.textContent} -->` : node.textContent;
    }

    buildAttributes(sourceNode, targetNode)
    {
        $lib.each(sourceNode.attributes, (attr) =>
        {
            targetNode.appendChild(document.createTextNode(' '));
            $lib.element(targetNode, '', this.defTagName, attr.name, { class: 'attr-name' });
            targetNode.appendChild(document.createTextNode('="'));
            $lib.element(targetNode, '', this.defTagName, attr.value, { class: 'attr-value' });
            targetNode.appendChild(document.createTextNode('"'));
        });
    }

    createButton(item, props)
    {
        $lib.element(item, '', 'a', '', '', props);
    }

    toggleExpand(item, e)
    {
        item.classList.toggle('collapsed');
        e.preventDefault();
    }

    select(item, e) 
    {
        if (!item)
            return;

        if (e)
            e.stopPropagation();

        if (item.classList.contains('edit-mode'))
            return;

        let selected = this.targetNode.querySelector('.selected');

        if (selected == item)
            return;

        if (selected)
            selected.classList.remove('selected', 'edit-mode');

        item.classList.toggle('selected'); // shows edit button
    }

    edit(item, isRoot, e)
    {
        let edit = item.querySelector('.edit-box');

        if (isRoot && this.saved)
            return;

        e.stopPropagation();

        if (!item.classList.contains('edit-mode'))
        {
            item.classList.add('edit-mode'); // shows save icon

            if (isRoot)
                edit.textContent = this.outerHTML();
            else
                edit.textContent = item.textContent;

            edit.focus();
        }
        else
        {
            item.classList.remove('edit-mode');
            this.save(item, isRoot);
        }
    }

    save(item, isRoot)
    {
        let edit = item.querySelector('.edit-box'),
            parentNode = item.parentNode,
            changedSource = $lib.element({ tag: 'template' });

        if (isRoot)
        {
            parentNode = item;
            item.querySelectorAll('.item').forEach(e => e.remove());
        }

        changedSource.innerHTML = edit.textContent;
        edit.textContent = '';
        this.buildSection(changedSource.content, parentNode, (isRoot) ? null : item); // rebuild, use original item as beforeElement

        if (!isRoot)
            item.remove(); // remove original item
        else
        { // avoid fireing edit event after save action
            item.firstElementChild.outerHTML = item.firstElementChild.outerHTML;
            item.firstElementChild.onclick = this.edit.bind(this, item, true);
        }

        this.select(isRoot ? item : parentNode.querySelector('.item'));
    }
};
export default componyx.UI.editor_modules.SourceViewBuilder;
