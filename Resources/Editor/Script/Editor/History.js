/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};
/**
 * History module — manages undo/redo snapshots for the editor.
 * @class History
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.History = class History
{
    constructor(editor)
    {
        this.editor = editor;
        this.historyStack = new Map();
        this.cancelHistoryAction = false;
    }

    /** Initializes the history object. */
    init(editableElement)
    {
        this.historyStack.set(editableElement, { items: [], index: -1 });
    }

    dispose()
    {
        this.historyStack = new Map();
    }

    /**
     * Adds a history item.
     * @param {any} range
     * @param {any} marker
     */
    addItem(range, marker)
    {
        let editableElement = this.editor.getEditorElement();

        if (this.cancelHistoryAction || !this.hasDocumentChanged())
        {
            if (marker)
                this.editor.selectionRange.removeRangeMarker(marker);

            return;
        }

        let blockViewOn = this.editor.isBlockViewSelected();
        this.editor.activateDocument();

        this.editor.hideOverlays();
        this.editor.disableBlockView();
        range = this.editor.selectionRange.ensureTextRange(range || this.editor.selectionRange.getRange());

        let history = this.historyStack.get(editableElement),
            deleteCount = history.items.length - (history.index + 1),
            snapshot = {
                marker: marker || this.editor.selectionRange.createRangeMarker(range),
                html: editableElement.innerHTML
            };

        if (blockViewOn)
        {
            this.editor.toggleBlockView(true);
        }

        range = this.editor.selectionRange.restoreRangeToMarker(snapshot.marker, editableElement.ownerDocument.createRange());
        this.editor.selectionRange.removeRangeMarker(snapshot.marker);
        editableElement.normalize();
        this.editor.selectionRange.selectNodesInRange(range);

        if (deleteCount > 0)
            history.items.splice(deleteCount * -1);

        history.items.push(snapshot);
        const maxLength = this.editor.maxHistoryLength;
        if (maxLength && history.items.length > maxLength)
        {
            const overflow = history.items.length - maxLength;
            history.items.splice(0, overflow);
        }

        history.index = history.items.length - 1;

        if (history.index > 0)
            this.editor.getComponent('undo').enable();

        this.editor.getComponent('redo').disable();

        return range;
    }

    /** Undoes an action. */
    undo(editableElement)
    {
        let history = this.historyStack.get(editableElement);

        if (history.index == 0)
            return;

        history.index--;
        this.restoreItem();
        this.editor.getComponent('redo').enable();

        if (history.index == 0)
            this.editor.getComponent('undo').disable();

        this.editor.events.onUndo.fire(this.editor, null);
    }

    /** Redoes an action. */
    redo(editableElement)
    {
        let history = this.historyStack.get(editableElement);

        if (history.index == (history.items.length - 1))
            return;

        history.index++;
        this.restoreItem();
        this.editor.getComponent('undo').enable();

        if (history.index == (history.items.length - 1))
            this.editor.getComponent('redo').disable();

        this.editor.events.onRedo.fire(this.editor, null);
    }

    /**
     * Restores the editor state to a history item.
     */
    restoreItem()
    {
        this.editor.activateDocument();

        let editableElement = this.editor.getEditorElement(),
            history = this.historyStack.get(editableElement),
            snapshot = history.items[history.index];

        this.editor.hideOverlays();
        this.editor.disableBlockView();
        editableElement.innerHTML = snapshot.html;
        this.editor.contentManager.createSelectables(editableElement);
        let range = this.editor.selectionRange.restoreRangeToMarker(snapshot.marker, editableElement.ownerDocument.createRange());
        this.editor.selectionRange.removeRangeMarker(snapshot.marker);
        this.editor.selectionRange.selectNodesInRange(range);

        if (this.editor.isBlockViewSelected())
            this.editor.toggleBlockView(true);
    }

    /** Returns a value indicating if the document has changed. */
    hasDocumentChanged()
    {
        let editableElement = this.editor.getEditorElement();
        let history = this.historyStack.get(editableElement);

        if ($lib.isEmpty(history.items))
            return true;

        let item = history.items[history.index],
            marker = item.marker,
            tempEl = $lib.element('', '', '', [item.html]);

        $lib.remove(tempEl.querySelector('#' + marker.startId));

        if (marker.endId)
            $lib.remove(tempEl.querySelector('#' + marker.endId));

        return tempEl.innerHTML != editableElement.innerHTML;
    }

    /**
     * Disables history tracking for the specified method.
     * @param {any} method
     */
    noHistory(method)
    {
        this.cancelHistoryAction = true;
        let result = method();
        this.cancelHistoryAction = false;
        return result;
    }

    destroy()
    {
        this.historyStack = new Map();
    }
};

export default componyx.UI.editor_modules.History;
