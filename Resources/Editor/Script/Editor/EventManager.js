/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * Event manager - manages document events.
 * @class EventManager
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.EventManager = class EventManager
{
    #changeTimerId;
    #keyDownTimerId;

    constructor(editor)
    {
        this.editor = editor;
        this.utility = editor.utility;
    }

    bindEvents()
    {
        if (!this.editor.getEditorElement())
            return;

        const el = this.editor.getEditorElement();
        const doc = this.editor.getDoc();

        el.contentEditable = true;
        el.spellcheck = this.editor.defaultSpellcheck;

        $lib.on(el, 'focus', this.focus, null, this, true);
        $lib.on(el, 'blur', this.blur, null, this, true);
        $lib.on(el, 'drop', this.drop, null, this, true);
        $lib.on(el, 'dragEnd', this.dragEnd, null, this, true);
        $lib.on(el, 'paste', this.paste, null, this, true);
        $lib.on(el, 'pointerdown', this.pointerDown, null, this, true);
        $lib.on(el, 'keydown', this.keyDown, null, this, true);
        $lib.on(doc, 'selectionchange', this.selectionChange, null, this, true);
        $lib.on(doc, 'pointerup', this.pointerUp, null, this, true);
        $lib.on(document, 'pointerup', this.documentPointerUp, null, this, true);
        $lib.on(document, 'keyup', this.documentKeyUp, null, this, true);
        $lib.on(window, 'resize', this.windowResize, null, this, true);

        this.editor.table.bindEvents();
    }

    disposeEvents()
    {
        if (!this.editor.getEditorElement())
            return;

        const el = this.editor.getEditorElement();
        const doc = this.editor.getDoc();

        $lib.off(el, 'focus', this.focus);
        $lib.off(el, 'blur', this.blur);
        $lib.off(el, 'drop', this.drop);
        $lib.off(el, 'dragEnd', this.dragEnd);
        $lib.off(el, 'paste', this.paste);
        $lib.off(el, 'pointerdown', this.pointerDown);
        $lib.off(el, 'keydown', this.keyDown);
        $lib.off(doc, 'selectionchange', this.selectionChange);
        $lib.off(doc, 'pointerup', this.pointerUp);
        $lib.off(document, 'pointerup', this.documentPointerUp);
        $lib.off(document, 'keyup', this.documentKeyUp);
        $lib.off(window, 'resize', this.windowResize);

        this.editor.table.disposeEvents();
    }

    focus(e)
    {
        if (!this.editor.setActiveEditor(e.target))
            return;

        this.editor.activateDocument();
        this.editor.cancelSelectionChange = false;

        if (!this.editor.contentManager.hasContent())
            this.editor.contentManager.insertParagraph();

        if (!this.editor.hasEditables())
            this.editor.element.classList.add(this.editor.getCssClass(this.editor.classOption.FOCUS));

        this.editor.setToolbarBoxDisplay();
        this.editor.layoutState.resetActiveModes();
    }

    blur(e)
    {
        if (this.editor.allowToolbarBoxHide)
        {
            const editorEl = this.editor.getActiveEditor(e.target);

            if (editorEl)
                this.editor.contentManager.clearEmptyParagraph(editorEl);
        }

        if (!this.editor.hasEditables())
            this.editor.element.classList.remove(this.editor.getCssClass(this.editor.classOption.FOCUS));

        this.editor.deactivateDocument();
        this.editor.setToolbarBoxDisplay(false);
        this.editor.cancelSelectionChange = true;
    }

    selectionChange(e)
    {
        const doc = e.target?.ownerDocument || document;
        const activeElement = doc.activeElement;

        if (!activeElement || !this.editor.setActiveEditor(activeElement) || this.editor.cancelSelectionChange)
            return;

        clearTimeout(this.#changeTimerId);
        this.#changeTimerId = setTimeout(this.#handleSelectionChange.bind(this, activeElement), 0);
    }

    keyDown(e)
    {
        if (!this.editor.setActiveEditor(e.target))
            return;

        this.editor.activateDocument();

        if (!this.editor.contentManager.hasContent())
            this.editor.contentManager.insertParagraph();

        const selection = this.editor.selectionRange,
            range = selection.getRange(),
            sContainer = range.startContainer,
            nodes = selection.getNodesInRange(range),
            rootNodes = selection.getRootNodesInRange(range, nodes),
            rootNode = rootNodes[0],
            prevRootNode = rootNode.previousSibling,
            lastRootNode = rootNodes[rootNodes.length - 1],
            isList = this.editor.nodeManager.isList(rootNode) || rootNode.nodeName === 'LI',
            key = e.key.toLowerCase(),
            isPrintable = this.utility.isPrintableChar(e),
            insideCell = !!rootNode.closest('td, th');

        this.editor.setToolbarBoxDisplay();

        if (isPrintable && !selection.allowContent(range))
            return false;

        if (isPrintable || ' enter tab delete backspace '.indexOf(' ' + key + ' ') > -1)
            this.#afterKeyDown(rootNode, range.collapsed === false);

        if (e.ctrlKey && key === 'a')
        {
            selection.selectAll();
            return false;
        }

        if (key === 'enter' && e.shiftKey)
        {
            this.editor.contentManager.insertBR(range);
            return false;
        }
        else if (key === 'enter' && !e.shiftKey && rootNode.nodeName !== 'P' && !isList)
        {
            this.editor.contentManager.insertParagraph();
            return false;
        }

        // handle backspace/delete on BR+ZW line
        if (key === 'backspace' && range.collapsed)
        {
            const onZW = sContainer.nodeType === 3 && sContainer.nodeValue.match(/^\uFEFF+$/);
            const onBR = sContainer.nodeName === 'BR';

            if (onZW || onBR)
            {
                const br = onZW ? this.editor.nodeManager.sibling(sContainer, rootNode, true) : sContainer;
                const zw = onZW ? sContainer : sContainer.nextSibling?.nodeValue?.match(/^\uFEFF+$/) ? sContainer.nextSibling : null;
                const prevTextNode = this.editor.nodeManager.sibling(br, rootNode, true, 3);

                if (br?.nodeName === 'BR')
                {
                    br.remove();
                    zw?.remove();

                    if (prevTextNode)
                    {
                        range.setStart(prevTextNode, prevTextNode.textContent.length);
                        range.collapse(true);
                        selection.restoreRange(range);
                    }

                    return false;
                }
            }
        }

        if (isPrintable && range.collapsed && sContainer.nodeType === 3 &&
            this.editor.nodeManager.isLayoutNode(sContainer.parentNode) &&
            sContainer.textContent.match(/^\uFEFF+$/g))
        {
            range.setStart(sContainer, 0);
            range.setEnd(sContainer, sContainer.length);
            this.editor.storeRange(range);
        }

        if (isPrintable && rootNode.textContent.length === 0)
            this.editor.nodeManager.createTextNodePlaceHolder(rootNode);

        if (key === 'backspace' && selection.isCaretAtListItemStart(range))
        {
            this.editor.indent('-' + this.editor.indentValue);
            return false;
        }
        else if (key === 'tab')
        {
            if (!e.shiftKey && !isList && insideCell) // let table navigation handle this
                return;

            if (!e.shiftKey && range.collapsed && !isList)
                selection.insertIntoRange(range, this.editor.getDoc().createTextNode(this.utility.tabChar), null, true);
            else
                this.editor.indent((e.shiftKey ? '-' : '') + this.editor.indentValue);

            return false;
        }
        else if (e.ctrlKey && (this.editor.getSortedCommands().find(c => c.shortcutKey && c.shortcutKey.toLowerCase() === key)))
        {
            return false;
        }

        if (key === 'backspace' && range.collapsed && prevRootNode &&
            prevRootNode.contentEditable === 'false' &&
            selection.isCaretAtParagraphStart(range))
        {
            if (prevRootNode.hasAttribute(this.utility.selAttr))
                this.editor.selectNode.call(prevRootNode, false);
            else
                range.startContainer.previousSibling.remove();

            return false;
        }

        if ((rootNode.contentEditable === 'false' || sContainer.contentEditable === 'false') &&
            ' enter delete backspace '.indexOf(' ' + key + ' ') > -1)
        {
            this.editor.resizer.clear(true);
            this.editor.paragraphButtons.destroy(this.editor.getEditorElement());

            if (rootNode.contentEditable === 'false')
            {
                $lib.each(rootNodes, node =>
                {
                    if (node.nodeType === 1 && node.contentEditable === 'false')
                        node.remove();
                });
            }
            else
                sContainer.remove();

            if ((key === 'backspace' || key === 'delete') && lastRootNode.contentEditable === 'false')
                return false;
        }
    }

    pointerDown(e)
    {
        if (!this.editor.setActiveEditor(e.target))
            return;

        const x = $lib.clientX(e);
        setTimeout(this.editor.nodeManager.createCursorSpace.bind(this.editor.nodeManager, x), 0);
    }

    pointerUp(e)
    {
        this.editor.menuManager.menu.collapseAllDelayed();
        this.editor.toolbar.hideBoxes(e);

        if (this.editor.format.cloneStamp)
            this.editor.format.pasteFormat();

        this.editor.format.cloneStamp = null;
        this.editor.deactivateDocument();
    }

    documentPointerUp(e)
    {
        this.editor.toolbar.hideBoxes(e);
    }

    documentKeyUp(e)
    {
        this.editor.deactivateDocument();
    }

    drop(e)
    {
        const x = $lib.clientX(e),
            y = $lib.clientY(e),
            files = e.dataTransfer.files,
            doc = this.editor.getDoc();

        if (files.length && (doc.caretRangeFromPoint || doc.caretPositionFromPoint))
        {
            let range, pos;

            $lib.each(files, file =>
            {
                if (file && file.type.match('image.*'))
                {
                    e.stopPropagation();
                    e.preventDefault();

                    const url = window.URL.createObjectURL(file);
                    const img = new Image();

                    if (doc.caretRangeFromPoint && !range)
                        range = doc.caretRangeFromPoint(x, y);
                    else if (!range)
                    {
                        pos = doc.caretPositionFromPoint(x, y);
                        range = doc.createRange();
                        range.setStart(pos.offsetNode, pos.offset);
                        range.collapse();
                    }

                    range.insertNode(img);
                    range.setStartAfter(img);

                    img.onload = () =>
                    {
                        this.editor.activateDocument();
                        img.setAttribute('width', img.naturalWidth);
                        img.setAttribute('height', img.naturalHeight);
                        img.__widthRatio = img.width / img.height;

                        const figure = $lib.element({ tag: 'figure' });
                        figure.contentEditable = false;
                        $lib.surround(figure, img);

                        this.editor.events.onImageLoad.fire(this.editor, { imageElement: img, file });
                    };

                    img.src = url;
                    this.editor.events.onImageDrop.fire(this.editor, { imageElement: img, file });
                }
            });

            this.editor.contentManager.ensureDocStructure(this.editor.getEditorElement());
        }

        this.editor.history.addItem();
        return false;
    }

    dragEnd(e)
    {
        this.editor.history.addItem();
    }

    paste(e)
    {
        const hasHtml = !!e.clipboardData?.getData('text/html');

        setTimeout(() =>
        {
            const editorEl = this.editor.getEditorElement(),
                selection = this.editor.selectionRange,
                range = selection.ensureTextRange(selection.getRange()),
                marker = selection.createRangeMarker(range),
                html = editorEl.innerHTML;

            if (hasHtml)
            {
                editorEl.innerHTML = this.editor.sanitizer ? this.editor.sanitizer(html) : this.editor.getSanitizer().sanitize(html);
            }
                
            this.editor.contentManager.ensureDocStructure(editorEl, null, marker);
            this.editor.events.onPaste.fire(this.editor, { event: e });
        }, 0);
    }

    windowResize(e)
    {
        setTimeout(() =>
        {
            const selected = this.editor.getSelectedNodes();

            if (this.editor.getEditorElement() && selected.length === 1)
                this.editor.selectNode.call(selected[0], false);
        }, 0);
    }

    #handleSelectionChange(activeElement)
    {
        const selection = this.editor.selectionRange;
        this.editor.activateDocument();
        selection.getRange();

        if (this.editor.renderState !== 2 ||
            !this.editor.setActiveEditor(activeElement) ||
            !selection.getSelection().rangeCount)
            return;

        if (selection.rangeChanged(this.editor.getStoredRange()))
        {
            this.editor.storeRange(selection.getRange());

            if (!this.editor.contentManager.hasContent())
                this.editor.contentManager.insertParagraph();

            this.editor.clearSelection();
            this.editor.resizer.clear();
            selection.selectNodesInRange(this.editor.getStoredRange());

            if (!this.editor.element.className.includes(' fullscreen') && this.editor.getToolbarDisplay(this.editor.getEditorElement()) === componyx.UI.Editor.ToolbarDisplayOption.CARET)
            {
                this.editor.setToolbarBoxDisplay(!this.editor.getStoredRange().collapsed);
            }

            this.editor.events.onSelectionChange.fire(this.editor);
        }

        this.editor.layoutState.getState();
        this.editor.deactivateDocument();
    }

    #afterKeyDown(rootNode, mustCorrectify = false)
    {
        clearTimeout(this.#keyDownTimerId);
        this.#keyDownTimerId = setTimeout(() =>
        {
            const selection = this.editor.selectionRange;
            this.editor.activateDocument();

            if (!this.editor.history.hasDocumentChanged())
                return;

            const range = selection.ensureTextRange(this.editor.selectionRange.getRange());
            const marker = selection.createRangeMarker(range);

            if (mustCorrectify)
                this.editor.contentManager.ensureDocStructure(this.editor.getEditorElement(), range, marker);
            else
            {
                this.editor.contentManager.cleanUp(rootNode, null, range, marker);
                selection.removeRangeMarker(marker);
            }

            this.editor.history.addItem();
            this.editor.layoutState.getState();
        }, 0);
    }
};

export default componyx.UI.editor_modules.EventManager;