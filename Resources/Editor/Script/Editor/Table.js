/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * Table module — manages table editing.
 * 
 * @class Table
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.Table = class Table
{
    /**
     * @type {Set<HTMLTableCellElement>}
     * @ignore
     */
    #selectedCells = new Set();
    /**
     * @type {HTMLTableCellElement}
     * @ignore
     */
    #anchorCell = null;
    #isSelecting = false;
    #tableObservers = new WeakMap();
    #dragging = null;
    #rafId = null;
    #lastEvent = null;
    #pickerCssClass;
    #pickerGridCssClass;
    #pickerLabelCssClass;
    #wrapperCssClass;
    #selectedCssClass;
    #anchorCssClass;
    #colHandleCssClass;
    #colHandleActiveCssClass;
    #menuButtonCssClass;
    #activeMenuButton;
    #contextCell;

    constructor(editor)
    {
        this.editor = editor;
        this.cf = editor.componentFactory;
        this.utility = editor.utility;
        this.#pickerCssClass = editor.getCssClass(editor.classOption.TABLE_PICKER);
        this.#pickerGridCssClass = editor.getCssClass(editor.classOption.TABLE_PICKER_GRID);
        this.#pickerLabelCssClass = editor.getCssClass(editor.classOption.TABLE_PICKER_LABEL);
        this.#wrapperCssClass = editor.getCssClass(editor.classOption.TABLE_WRAPPER);
        this.#anchorCssClass = editor.getCssClass(editor.classOption.TABLE_ANCHOR);
        this.#selectedCssClass = editor.getCssClass(editor.classOption.TABLE_SELECTED);
        this.#colHandleCssClass = editor.getCssClass(editor.classOption.TABLE_COL_HANDLE);
        this.#colHandleActiveCssClass = editor.getCssClass(editor.classOption.TABLE_COL_HANDLE_ACTIVE);
        this.#menuButtonCssClass = editor.getCssClass(editor.classOption.TABLE_MENU_BUTTON);
        this.menu = null;
        this.pickerBox = null;

        this.editor.events.onUndo.priorityAdd(() => { this.afterHistoryAction(); });
        this.editor.events.onRedo.priorityAdd(() => { this.afterHistoryAction(); });
    }

    bindEvents()
    {
        if (!this.editor.getEditorElement())
            return;

        const el = this.editor.getEditorElement(),
            doc = this.editor.getDoc();

        $lib.on(el, 'cut', this.#cut, null, this, true);
        $lib.on(el, 'copy', this.#copy, null, this, true);
        $lib.on(el, 'paste', this.#paste, null, this, true);
        $lib.on(el, 'pointerdown', this.#pointerDown, null, this, true);
        $lib.on(el, 'pointerover', this.#pointerOver, null, this, true);
        $lib.on(el, 'pointermove', this.#pointerMove, null, this, true);
        $lib.on(el, 'keydown', this.#keyDown, null, this, true);
        $lib.on(el, 'contextmenu', this.#contextMenu, null, this, true);

        // Resizing cols
        $lib.on(doc, 'selectionchange', this.#selectionChange, null, this, true);
        $lib.on(doc, 'pointerdown', this.removeMenuButton, null, this, true);
        $lib.on(doc, 'pointerdown pointerup', this.#resizeEnd, null, this, true);
        $lib.on(doc, 'pointerup', this.#pointerUp, null, this, true);
        $lib.on(doc, 'pointermove', this.#scheduleResize, null, this, true);
    }

    disposeEvents()
    {
        if (!this.editor.getEditorElement())
            return;

        const el = this.editor.getEditorElement(),
            doc = this.editor.getDoc();

        $lib.off(el, 'cut', this.#cut);
        $lib.off(el, 'copy', this.#copy);
        $lib.off(el, 'paste', this.#paste);
        $lib.off(el, 'pointerdown', this.#pointerDown);
        $lib.off(el, 'pointerover', this.#pointerOver);
        $lib.off(el, 'pointermove', this.#pointerMove);
        $lib.off(el, 'pointerup', this.#pointerUp);
        $lib.off(el, 'keydown', this.#keyDown);
        $lib.off(el, 'contextmenu', this.#contextMenu);

        $lib.off(doc, 'selectionchange', this.#selectionChange);
        $lib.off(doc, 'pointerdown', this.removeMenuButton);
        $lib.off(doc, 'pointerdown pointerup', this.#resizeEnd);
        $lib.off(doc, 'pointerup', this.#pointerUp);
        $lib.off(doc, 'pointermove', this.#scheduleResize);

        this.clearSelection();
    }

    destroy()
    {
        this.disposeEvents();
        this.editor.events.onUndo.priorityRemove(2);
        this.editor.events.onRedo.priorityRemove(2);
    }

    clearAll(source, clearWrapperCssClass = false)
    {
        const contentEl = source || this.editor.getEditorElement();
        if (!contentEl)
            return;

        // Remove col handles and menu buttons from all table wrappers
        contentEl.querySelectorAll(`figure.${this.#wrapperCssClass}`).forEach(wrapper =>
        {
            wrapper.querySelectorAll(`:scope > .${this.#colHandleCssClass}`).forEach(h => h.remove());
            wrapper.querySelectorAll(`:scope > a.${this.#menuButtonCssClass}`).forEach(b => b.remove());

            if (clearWrapperCssClass)
            {
                wrapper.classList.remove(this.#wrapperCssClass);
                if (!wrapper.className)
                    wrapper.removeAttribute('class');
            }
        });

        // Strip selection classes from all cells
        contentEl.querySelectorAll('td, th').forEach(cell =>
        {
            cell.classList.remove(this.#selectedCssClass, this.#anchorCssClass);
            if (!cell.className)
                cell.removeAttribute('class');
        });
    }

    clearSelection()
    {
        this.#clearHighlights();
        this.#selectedCells = new Set();
        this.#anchorCell = null;
        this.#contextCell = null;
        this.removeMenuButton();

        if (this.menu)
            this.menu.collapseAll(true);
    }

    updateContextCell(cell)
    {
        this.#contextCell = cell;
    }

    afterHistoryAction()
    {
        this.clearAll();

        this.editor.getEditorElement().querySelectorAll('table').forEach(t =>
        {
            this.#rebuildColgroup(t);
            this.#buildHandles(t)
        });
    }

    createPicker()
    {
        const content = this.createPickerBox(),
            grid = $lib.element({ container: content, attrs: { class: this.#pickerGridCssClass } }),
            label = $lib.element({ container: content, content: '0 x 0', attrs: { class: this.#pickerLabelCssClass } });

        for (let index = 0; index < 100; index++)
        {
            const c = $lib.element();
            c.dataset.row = Math.floor(index / 10) + 1;
            c.dataset.col = (index % 10) + 1;
            grid.appendChild(c);
        }

        $lib.on(grid, 'pointerover', e =>
        {
            const c = e.target.closest('[data-row]');
            if (!c) return;

            const r = +c.dataset.row, cl = +c.dataset.col; // convert strs to integers
            [...grid.children].forEach(x => x.classList.toggle(this.#selectedCssClass, +x.dataset.row <= r && +x.dataset.col <= cl)); // force toggle on/off
            label.textContent = `${r} × ${cl}`;
        });

        $lib.on(grid, 'click', e =>
        {
            const c = e.target.closest('[data-row]');
            if (!c) return;

            this.insertTable(+c.dataset.row, +c.dataset.col);
            this.pickerBox.events.onHideComplete.add(() =>
            {
                [...grid.children].forEach(x => x.classList.remove(this.#selectedCssClass));
                label.textContent = `0 × 0`;
            });
            this.pickerBox.hide();
        });
    }

    createPickerBox()
    {
        const editor = this.editor,
            content = $lib.element();

        this.pickerBox = this.cf.createBox('TablePicker', editor.tablePickerBoxId, editor.element, { cssClass: this.#pickerCssClass, content: content });

        return content;
    }

    showMenuButton(cell)
    {
        let wrapperEl = cell.closest('table').closest(`figure.${this.#wrapperCssClass}`),
            button = wrapperEl.querySelector(`a.${this.#menuButtonCssClass}`);

        if (!button)
        {
            const buttonCss = `${this.utility.buttonLucentCss} ${this.editor.getThemeCSS()} ${this.#menuButtonCssClass} ico-cog`;
            button = $lib.element({ container: wrapperEl, tag: 'a', props: { className: buttonCss, contentEditable: false } });

            $lib.on(button, 'click', this.#showMenu, null, this);
        }

        this.#contextCell = cell; // capture before focus can shift
        this.#activeMenuButton = button;
        this.positionMenuButton(cell);
    }

    positionMenuButton(cell)
    {
        const btn = this.#activeMenuButton;
        if (!btn) return;

        const wrapperEl = btn.closest(`figure.${this.#wrapperCssClass}`),
            wrapperRect = wrapperEl.getBoundingClientRect(),
            cellRect = cell.getBoundingClientRect(),
            btnWidth = btn.offsetWidth || 30,
            btnHeight = btn.offsetHeight || 30;

        btn.style.left = `${cellRect.right - wrapperRect.left - btnWidth}px`;
        btn.style.top = `${cellRect.top - wrapperRect.top - btnHeight}px`;
        btn.style.display = '';
    }

    hideMenuButton()
    {
        if (!this.#activeMenuButton)
            return;

        this.#activeMenuButton.style.display = 'none';
    }

    removeMenuButton(e)
    {
        if (!this.#activeMenuButton || this.#dragging)
            return;

        const target = e?.target;

        if (!target) // No target (manual call) -> remove
        {
            this.#activeMenuButton.remove();
            this.#activeMenuButton = null;
            return;
        }

        // If clicking on the menu button itself, keep it
        if (target.closest?.(`a.${this.#menuButtonCssClass}`))
            return;

        const clickedCell = target.closest?.('td,th');

        // Clicked inside the same table -> keep button
        if (clickedCell)
        {
            const currentWrapper = this.#activeMenuButton.closest(`figure.${this.#wrapperCssClass}`);
            const clickedWrapper = clickedCell.closest(`figure.${this.#wrapperCssClass}`);

            if (currentWrapper === clickedWrapper)
                return;
        }

        // Otherwise remove
        this.#activeMenuButton.remove();
        this.#activeMenuButton = null;
    }

    // ── Operations ───────────────────────────────────────────────────────────

    insertTable(rows = 3, cols = 3)
    {
        const colgroup = $lib.element({ tag: 'colgroup' }),
            tbody = $lib.element({ tag: 'tbody' }),
            table = $lib.element({ tag: 'table', content: [colgroup, tbody] });

        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';

        for (let colIndex = 0; colIndex < cols; colIndex++)
            colgroup.appendChild($lib.element({ tag: 'col' }));

        for (let rowIndex = 0; rowIndex < rows; rowIndex++)
        {
            const tr = $lib.element({ container: tbody, tag: 'tr' })
            for (let colIndex = 0; colIndex < cols; colIndex++)
                tr.appendChild(this.#createCell());
        }

        const wrapper = $lib.element({ tag: 'figure', content: [table], props: { className: this.#wrapperCssClass } });

        this.editor.contentManager.insertHTML({
            node: wrapper,
            isPhrasingContent: false
        });

        // Set px col widths after layout, then build handles
        this.editor.getDoc().defaultView.requestAnimationFrame(() =>
        {
            this.editor.activateDocument();
            this.#rebuildColgroup(table);
            this.#buildHandles(table);
            const firstCell = table.querySelector('td,th');
            this.editor.bindNodeEvents(wrapper);
            this.#finalize(firstCell);
        });
    }

    addRow(above = false)
    {
        const { cell, table } = this.#context();
        if (!cell)
            return;

        const row = cell.parentElement,
            colIndex = this.#cellColIndex(row, cell),
            colCount = this.#rowColCount(table.rows[0]),
            newRow = $lib.element({ tag: 'tr' });

        for (let index = 0; index < colCount; index++)
            newRow.appendChild(this.#createCell());

        if (above)
            row.before(newRow);
        else
            row.after(newRow);

        this.#finalize(newRow.cells[colIndex]);
        this.menu.collapseAll(true);
    }

    removeRow()
    {
        const { cell, table } = this.#context();
        if (!table || table.rows.length <= 1)
            return;

        const rows = this.#getSelectedRows(table),
            firstIndex = Math.min(...rows.map(r => this.#rowIndex(table, r))),
            colIndex = this.#cellColIndex(cell.parentElement, cell);

        rows.forEach(r => r.remove());

        const targetRow = table.rows[Math.min(firstIndex, table.rows.length - 1)];
        this.#finalize(targetRow.cells[colIndex]);
        this.menu.collapseAll(true);
    }

    addColumn(left = false)
    {
        const { cell, table } = this.#context();
        if (!cell) return;

        const row = cell.parentElement,
            colIndex = this.#columnIndexOfCell(row, cell),
            rowIndex = this.#rowIndex(table, row);

        Array.from(table.rows).forEach(r =>
        {
            const c = this.#cellAtColumnIndex(r, colIndex);
            if (c)
                left ? c.before(this.#createCell()) : c.after(this.#createCell());
        });

        this.#rebuildColgroup(table, colIndex);

        const newColIndex = left ? colIndex : colIndex + 1,
            newCell = this.#cellAtColumnIndex(table.rows[rowIndex], newColIndex);

        this.#buildHandles(table);
        this.#finalize(newCell);
        this.menu.collapseAll(true);
    }

    removeColumn()
    {
        const { cell, table } = this.#context();

        if (!cell || this.#rowColCount(table.rows[0]) <= 1)
            return;

        const row = cell.parentElement,
            colIndex = this.#columnIndexOfCell(row, cell),
            rowIndex = this.#rowIndex(table, row);

        Array.from(table.rows).forEach(r =>
        {
            const t = this.#cellAtColumnIndex(r, colIndex);
            if (!t) return;

            const cellStart = this.#columnIndexOfCell(r, t),
                span = t.colSpan || 1;

            if (cellStart === colIndex) span === 1 ? t.remove() : t.colSpan--;
            else if (cellStart < colIndex) t.colSpan--;
        });

        this.#rebuildColgroup(table);

        const targetRow = table.rows[rowIndex],
            newCell = this.#cellAtColumnIndex(targetRow, colIndex);

        this.#buildHandles(table);
        this.#finalize(newCell);
        this.menu.collapseAll(true);
    }

    // ── Merge / Split ─────────────────────────────────────────────────────────────

    canMerge()
    {
        const cells = this.#getSelectedCells(this.#context().table);
        return cells.length > 1;
    }

    canSplit()
    {
        return this.#getSelectedCells(this.#context().table)
            .some(c => (c.colSpan || 1) > 1 || (c.rowSpan || 1) > 1);
    }

    canMergeRight()
    {
        const { cell, table } = this.#context();
        if (!cell) return false;
        if (this.#getSelectedCells(table).length > 1) return false;

        const grid = this.#buildGridMap(table);
        const origin = this.#cellOrigin(grid, cell);
        if (!origin) return false;

        const next = grid[origin.r]?.[origin.c + (cell.colSpan || 1)];
        if (!next) return false;

        // shapes must align exactly — same rowSpan and same starting row
        const nextOrigin = this.#cellOrigin(grid, next);
        return (next.rowSpan || 1) === (cell.rowSpan || 1) && nextOrigin.r === origin.r;
    }

    canMergeDown()
    {
        const { cell, table } = this.#context();
        if (!cell) return false;
        if (this.#getSelectedCells(table).length > 1) return false;

        const grid = this.#buildGridMap(table);
        const origin = this.#cellOrigin(grid, cell);
        if (!origin) return false;

        const below = grid[origin.r + (cell.rowSpan || 1)]?.[origin.c];
        if (!below) return false;

        // shapes must align exactly — same colSpan and same starting column
        const belowOrigin = this.#cellOrigin(grid, below);
        return (below.colSpan || 1) === (cell.colSpan || 1) && belowOrigin.c === origin.c;
    }

    merge(cells)
    {
        cells = cells || this.#getSelectedCells(this.#context().table);
        if (!cells || cells.length < 2) return;

        const { table } = this.#context();
        const grid = this.#buildGridMap(table);

        // find bounding rectangle
        let minRow = Infinity, maxRow = -Infinity,
            minCol = Infinity, maxCol = -Infinity;

        cells.forEach(cell =>
        {
            const origin = this.#cellOrigin(grid, cell);
            if (!origin) return;
            minRow = Math.min(minRow, origin.r);
            maxRow = Math.max(maxRow, origin.r + (cell.rowSpan || 1) - 1);
            minCol = Math.min(minCol, origin.c);
            maxCol = Math.max(maxCol, origin.c + (cell.colSpan || 1) - 1);
        });

        // collect ALL cells in the rectangle, not just selected ones
        const allCells = new Set();
        for (let r = minRow; r <= maxRow; r++)
            for (let c = minCol; c <= maxCol; c++)
                if (grid[r]?.[c]) allCells.add(grid[r][c]);

        const [first, ...rest] = allCells;
        first.colSpan = maxCol - minCol + 1;
        first.rowSpan = maxRow - minRow + 1;

        // Collect all block content from all cells into first cell
        const fragment = document.createDocumentFragment();
        this.#appendCellContent(fragment, first);
        rest.forEach(cell => this.#appendCellContent(fragment, cell, true));
        first.innerHTML = '';
        first.appendChild(fragment);

        rest.forEach(c => c.remove());

        this.#finalize(first);
        this.menu.collapseAll(true);
    }

    mergeRight()
    {
        const { cell, table } = this.#context();
        if (!cell) return;

        const grid = this.#buildGridMap(table);
        const origin = this.#cellOrigin(grid, cell);
        if (!origin) return;

        const next = grid[origin.r]?.[origin.c + (cell.colSpan || 1)];
        if (!next) return;

        const fragment = document.createDocumentFragment();
        this.#appendCellContent(fragment, cell);
        this.#appendCellContent(fragment, next, true);

        cell.colSpan = (cell.colSpan || 1) + (next.colSpan || 1);
        cell.innerHTML = '';
        cell.appendChild(fragment);
        next.remove();

        this.#finalize(cell);
        this.menu.collapseAll(true);
    }

    mergeDown()
    {
        const { cell, table } = this.#context();
        if (!cell) return;

        const grid = this.#buildGridMap(table);
        const origin = this.#cellOrigin(grid, cell);
        if (!origin) return;

        const below = grid[origin.r + (cell.rowSpan || 1)]?.[origin.c];
        if (!below) return;

        const fragment = document.createDocumentFragment();
        this.#appendCellContent(fragment, cell);
        this.#appendCellContent(fragment, below, true);

        cell.rowSpan = (cell.rowSpan || 1) + (below.rowSpan || 1);
        cell.innerHTML = '';
        cell.appendChild(fragment);
        below.remove();

        this.#finalize(cell);
        this.menu.collapseAll(true);
    }

    split(cells)
    {
        cells = cells || this.#getSelectedCells(this.#context().table);
        if (!cells || !cells.length) return;

        const { table } = this.#context();
        const grid = this.#buildGridMap(table); // one snapshot, valid throughout
        const firstCell = cells[0];

        cells.forEach(cell =>
        {
            this.#splitCell(table, cell, grid);
        });

        this.#finalize(firstCell);
        this.menu.collapseAll(true);
    }

    #appendCellContent(fragment, cell, skipPlaceholder = false)
    {
        const children = Array.from(cell.childNodes);

        if (!children.length)
        {
            if (!skipPlaceholder)
            {
                const p = $lib.element({ tag: 'p' });
                $lib.element({ container: p, tag: 'br' });
                fragment.appendChild(p);
            }
            return;
        }

        if (skipPlaceholder
            && children.length === 1
            && children[0].nodeName === 'P'
            && children[0].childNodes.length === 1
            && children[0].firstChild?.nodeName === 'BR')
            return;

        children.forEach(n => fragment.appendChild(n.cloneNode(true)));
    }

    #splitCell(table, cell, grid)
    {
        const colSpan = cell.colSpan || 1,
            rowSpan = cell.rowSpan || 1;

        grid = grid || this.#buildGridMap(table);

        if (colSpan > 1)
        {
            cell.colSpan = 1;
            for (let i = 1; i < colSpan; i++)
                cell.parentElement.insertBefore(this.#createCell(), cell.nextElementSibling);
        }

        if (rowSpan > 1)
        {
            const origin = this.#cellOrigin(grid, cell);
            if (!origin)
                return;

            cell.rowSpan = 1;

            for (let rowIndex = 1; rowIndex < rowSpan; rowIndex++)
            {
                const targetRow = table.rows[origin.r + rowIndex];
                if (!targetRow)
                    continue;

                const siblingCell = grid[origin.r + rowIndex]?.[origin.c + colSpan];

                for (let colIndex = 0; colIndex < colSpan; colIndex++)
                {
                    const newCell = this.#createCell();
                    targetRow.insertBefore(newCell, siblingCell);
                }
            }
        }
    }

    // ── Event handlers ───────────────────────────────────────────────────────

    #cut(e)
    {
        const { cell, table } = this.#context();

        if (!table)
            return;

        const data = this.#serializeSelection();
        if (!data)
            return;

        e.clipboardData.setData('text/html', data.html);
        e.clipboardData.setData('text/plain', data.text);
        e.preventDefault();
        this.#clearCells(this.#getSelectedCells(table));
        this.#finalize(cell);
    }

    #copy(e)
    {
        const data = this.#serializeSelection();
        if (!data)
            return;

        e.clipboardData.setData('text/html', data.html);
        e.clipboardData.setData('text/plain', data.text);
        e.preventDefault();
    }

    #paste(e)
    {
        const { cell, table } = this.#context();
        if (!cell || !table)
            return;

        const html = e.clipboardData.getData('text/html');

        if (html)
        {
            const temp = $lib.element({ content: [html] }),
                sourceTable = temp.querySelector(':scope > table');

            if (!sourceTable)
                return;

            sourceTable.remove();

            if (temp.textContent.trim())
                return;

            e.preventDefault();
            this.#applyPaste(sourceTable, table, cell);
        }
        else
        {
            const text = e.clipboardData.getData('text/plain');
            if (text)
            {
                e.preventDefault();
                this.#insertPlainText(text);
            }
        }

        this.#finalize(cell);
    }

    #pointerDown(e)
    {
        if (e.button !== 0)
            return;

        this.#contextCell = null;

        const cell = e.target.closest('td,th');

        if (!cell)
            return;

        const differentTable = this.#anchorCell && !this.#isSameTable(cell, this.#anchorCell);

        if (differentTable && this.#isSelecting)
            return;

        if (differentTable)
            this.clearSelection();

        this.#isSelecting = true;
        this.#clearHighlights();
        this.#ensureCellParagraph(cell);

        if (e.shiftKey && this.#anchorCell)
        {
            e.preventDefault();
            this.#selectRange(this.#anchorCell, cell);
        }
        else if (e.ctrlKey || e.metaKey)
        {
            e.preventDefault();
            this.#selectedCells.has(cell) ? this.#selectedCells.delete(cell) : this.#selectedCells.add(cell);
            this.#anchorCell = cell;
        }
        else
        {
            this.#selectedCells = new Set([cell]);
            this.#anchorCell = cell;
        }

        this.#applyHighlights();
        this.showMenuButton(cell);
        this.#buildHandles(cell.closest('table'));
    }

    #pointerOver(e)
    {
        if (!this.#isSelecting)
            return;

        const cell = e.target.closest('td,th');

        if (!cell || !this.#anchorCell)
            return;

        if (!this.#isSameTable(cell, this.#anchorCell))
            return;

        this.#clearHighlights();
        this.#selectRange(this.#anchorCell, cell);
        this.#applyHighlights();
    }

    #pointerMove(e)
    {
        this.#collapseMultiCellSelection();
    }

    #pointerUp(e)
    {
        const cell = e.target.closest('td,th');

        this.#isSelecting = false;

        if (cell)
            cell.closest('table').style.removeProperty('user-select');
    }

    #keyDown(e)
    {
        this.#handleCaretOutsideCell(e);

        const { cell } = this.#context();

        if (!cell || !this.editor.getEditorElement().contains(cell))
            return;

        this.#ensureCellParagraph(cell);

        if (e.shiftKey && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key))
            this.#keySelection(e, cell);
        else
            this.#keyNavigation(e, cell);
    }

    #contextMenu(e)
    {
        const cell = e.target.closest('td,th');
        if (!cell) return;

        // single cell with text selection — let browser handle
        if (this.#selectedCells.size <= 1)
        {
            const range = this.editor.selectionRange.getRange();
            if (!range.collapsed)
                return;
        }

        this.#contextCell = cell; // capture before focus can shift
        e.preventDefault();
        this.#showMenu();
    }

    #selectionChange(e)
    {
        const { cell, table } = this.#context();

        if (!cell)
            return;

        this.showMenuButton(cell);
    }

    // ── Menu ─────────────────────────────────────────────────────────────────

    #showMenu()
    {
        if (this.#activeMenuButton)
            this.hideMenuButton();

        if (!this.menu)
            this.#createMenu();
        else if (this.menu.renderState == $base.static.RenderState.RENDERED)
        {
            this.#updateMenuState();
            this.menu.expand('root');
        }
    }

    #createMenu()
    {
        const Item = componyx.UI.Menu.Item,
            labels = this.editor.labels;

        this.menu = this.cf.createMenu('TableMenu', this.editor.tableMenuId, this.editor.element);

        const list = this.menu.itemList;

        const selectable = false;

        list.push(new Item({
            id: 'Cut',
            text: labels.tableMenuCut,
            hasIcon: true,
            selectable,
            cssClassIcon: 'icon ico-editor-cut',
            command: () => this.#actionCut()
        }));

        list.push(new Item({
            id: 'Copy',
            text: labels.tableMenuCopy,
            hasIcon: true,
            selectable,
            cssClassIcon: 'icon ico-copy',
            command: () => this.#actionCopy()
        }));

        list.push(new Item({
            id: 'Paste',
            text: labels.tableMenuPaste,
            hasIcon: true,
            selectable,
            cssClassIcon: 'icon ico-editor-clipboard',
            command: () => this.#actionPaste()
        }));

        list.push(new Item({
            id: 'PastePlainText',
            text: labels.tableMenuPastePlainText,
            hasIcon: true,
            selectable,
            cssClassIcon: 'icon ico-editor-clipboard-text',
            command: () => this.#actionPasteText()
        }));

        const rowItem = new Item({
            id: 'Row',
            text: labels.tableMenuRow,
            hasIcon: true,
            selectable,
            cssClassIcon: 'icon ico-editor-row',
        });

        rowItem.itemList.push(new Item({
            id: 'AddRowAbove',
            text: labels.tableMenuAddRowAbove,
            hasIcon: true,
            selectable,
            cssClassIcon: 'icon ico-editor-add-above',
            command: () => this.addRow(true)
        }));

        rowItem.itemList.push(new Item({
            id: 'AddRowBelow',
            text: labels.tableMenuAddRowBelow,
            hasIcon: true,
            selectable,
            cssClassIcon: 'icon ico-editor-add-below',
            command: () => this.addRow()
        }));

        rowItem.itemList.push(new Item({
            id: 'RemoveRow',
            text: labels.tableMenuRemoveRow,
            hasIcon: true,
            selectable,
            cssClassIcon: 'icon ico-editor-remove-row',
            command: () => this.removeRow()
        }));

        list.push(rowItem);

        const colItem = new Item({
            id: 'Col',
            text: labels.tableMenuColumn,
            hasIcon: true,
            cssClassIcon: 'icon ico-editor-col',
            selectable,
        });

        colItem.itemList.push(new Item({
            id: 'AddColLeft',
            text: labels.tableMenuAddColumnLeft,
            hasIcon: true,
            selectable,
            cssClassIcon: 'icon ico-editor-add-left',
            command: () => this.addColumn(true)
        }));

        colItem.itemList.push(new Item({
            id: 'AddColRight',
            text: labels.tableMenuAddColumnRight,
            hasIcon: true,
            selectable,
            cssClassIcon: 'icon ico-editor-add-right',
            command: () => this.addColumn()
        }));

        colItem.itemList.push(new Item({
            id: 'RemoveCol',
            text: labels.tableMenuRemoveColumn,
            hasIcon: true,
            selectable,
            cssClassIcon: 'icon ico-editor-remove-col',
            command: () => this.removeColumn()
        }));

        list.push(colItem);

        const mergeItem = new Item({
            id: 'Merge',
            text: labels.tableMenuMerge,
            hasIcon: true,
            selectable,
            cssClassIcon: 'icon ico-editor-merge-cells',
        });

        mergeItem.itemList.push(new Item({
            id: 'MergeSelection',
            selectable,
            text: labels.tableMenuMergeSelection,
            command: () => this.merge()
        }));

        mergeItem.itemList.push(new Item({
            id: 'MergeRight',
            selectable,
            text: labels.tableMenuMergeRight,
            command: () => this.mergeRight()
        }));

        mergeItem.itemList.push(new Item({
            id: 'MergeDown',
            selectable,
            text: labels.tableMenuMergeDown,
            command: () => this.mergeDown()
        }));

        list.push(mergeItem);

        list.push(new Item({
            id: 'Split',
            selectable,
            text: labels.tableMenuSplit,
            hasIcon: true,
            cssClassIcon: 'icon ico-editor-split-cells',
            command: () => this.split()
        }));

        list.push(new Item({
            id: 'Settings',
            selectable,
            text: labels.tableMenuSettings,
            hasIcon: true,
            cssClassIcon: 'icon ico-cog',
            command: () => this.#showSettings()
        }));

        list.push(new Item({
            id: 'DeleteTable',
            text: labels.tableMenuDelete,
            hasIcon: true,
            selectable,
            cssClassIcon: 'icon ico-bin',
            command: () => this.#deleteTable()
        }));

        this.menu.events.onPostRender.priorityAdd(() =>
        {
            this.#updateMenuState();
            this.menu.expand('root');
        });

        this.menu.expandOnClick = componyx.UI.Menu.ExpandOnClickOption.ROOT;
        this.menu.visibleRoot = false;
        this.menu.showType = this.menu.hideType = 0;  // Disable animations for context menu
        this.menu.show();
    }

    #updateMenuState()
    {
        const { table } = this.#context();

        table && table.rows.length > 1 ? this.menu.enableItem('RemoveRow') : this.menu.disableItem('RemoveRow');
        table && this.#rowColCount(table.rows[0]) > 1 ? this.menu.enableItem('RemoveCol') : this.menu.disableItem('RemoveCol');

        // Merge / Split
        this.canMerge() ? this.menu.enableItem('MergeSelection') : this.menu.disableItem('MergeSelection');
        this.canMergeRight() ? this.menu.enableItem('MergeRight') : this.menu.disableItem('MergeRight');
        this.canMergeDown() ? this.menu.enableItem('MergeDown') : this.menu.disableItem('MergeDown');
        this.canSplit() ? this.menu.enableItem('Split') : this.menu.disableItem('Split');
    }

    #deleteTable()
    {
        const { table } = this.#context();
        if (!table)
            return;

        const wrapper = table.closest(`figure.${this.#wrapperCssClass}`);
        (wrapper || table).remove();

        this.#removeHandles(table);
        this.#finalize();
        this.menu.collapseAll(true);
    }

    #showSettings()
    {
        this.menu.collapseAll(true);
        this.editor.dialogManager.tableDialog.show(this.#context());
    }

    async #actionCut()
    {
        const { cell, table } = this.#context();
        if (!table)
            return;

        await this.#writeToClipboard();
        this.#clearCells(this.#getSelectedCells(table));
        this.#finalize(cell);
        this.menu.collapseAll(true);
    }

    async #actionCopy()
    {
        await this.#writeToClipboard();
        this.menu.collapseAll(true);
    }

    async #actionPaste()
    {
        const { cell } = this.#context();
        if (!cell) return;

        this.#selectCell(cell);

        const clipboardItems = await navigator.clipboard.read(),
            item = clipboardItems[0];

        if (!item.types.includes('text/html')) return;

        const blob = await item.getType('text/html'),
            html = await blob.text(),
            text = item.types.includes('text/plain') ? await (await item.getType('text/plain')).text() : '';

        const dt = new DataTransfer();
        dt.setData('text/html', html);

        if (text)
            dt.setData('text/plain', text);

        this.editor.getEditorElement().dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); // fire paste event (global event handler will sanitize html)
        this.menu.collapseAll(true);
    }

    async #actionPasteText()
    {
        const { cell, table } = this.#context();
        if (!cell || !table)
            return;

        const text = await navigator.clipboard.readText();
        this.#insertPlainText(text);
        this.#finalize(cell);
        this.menu.collapseAll(true);
    }

    async #insertPlainText(text)
    {
        const { cell } = this.#context();
        if (!cell)
            return;

        const range = this.editor.selectionRange.getRange();

        if (!cell.contains(range.startContainer))
            return;

        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        this.editor.selectionRange.ensureTextRange(range);
    }


    // ── Keyboard Navigation ──────────────────────────────────────────────────

    #keyNavigation(e, cell)
    {
        const table = cell.closest('table'),
            grid = this.#buildGridMap(table),
            origin = this.#cellOrigin(grid, cell),
            key = e.key;

        if (!origin) return;

        const { r, c } = origin,
            rowSpan = cell.rowSpan || 1,
            colSpan = cell.colSpan || 1;

        let target = null;

        if (key === 'Tab')
        {
            const allCells = Array.from(table.querySelectorAll('td,th')),
                domIndex = allCells.indexOf(cell);

            if (e.shiftKey)
                target = allCells[domIndex - 1] ?? null;
            else if (domIndex < allCells.length - 1)
                target = allCells[domIndex + 1];
            else
            {
                this.addRow();
                target = table.rows[table.rows.length - 1].cells[0];
            }
        }
        else if (key === 'ArrowLeft')
        {
            if (!this.#atCellStart(cell)) return;
            target = grid[r]?.[c - 1] ?? null;
            if (!target) { e.preventDefault(); e.stopPropagation(); return; }
        }
        else if (key === 'ArrowRight')
        {
            if (!this.#atCellEnd(cell)) return;
            target = grid[r]?.[c + colSpan] ?? null;
            if (!target) { e.preventDefault(); e.stopPropagation(); return; }
        }
        else if (key === 'ArrowUp')
        {
            if (!this.#onFirstLine(cell)) return;
            target = grid[r - 1]?.[c] ?? null;
            if (!target) { e.preventDefault(); e.stopPropagation(); return; }
        }
        else if (key === 'ArrowDown')
        {
            if (!this.#onLastLine(cell)) return;
            target = grid[r + rowSpan]?.[c] ?? null;
            if (!target) { e.preventDefault(); e.stopPropagation(); return; }
        }

        if (target)
        {
            e.preventDefault();
            e.stopPropagation();
            this.#selectCell(target, false);
            this.#placeCaret(target, key === 'ArrowRight' || key === 'ArrowDown' || key === 'Tab');
        }
    }

    #keySelection(e, cell)
    {
        const key = e.key,
            table = cell.closest('table'),
            grid = this.#buildGridMap(table);

        // Only expand selection when caret is at the boundary in the arrow direction
        // This allows normal text selection within a cell first
        if (this.#selectedCells.size <= 1)
        {
            if (key === 'ArrowRight' && !this.#atCellEnd(cell, false)) return;
            if (key === 'ArrowLeft' && !this.#atCellStart(cell, false)) return;
            if (key === 'ArrowDown' && !this.#onLastLine(cell)) return;
            if (key === 'ArrowUp' && !this.#onFirstLine(cell)) return;
        }

        if (!this.#anchorCell)
            this.#anchorCell = cell;

        const anchorOrigin = this.#cellOrigin(grid, this.#anchorCell);

        let minRow = anchorOrigin.r,
            maxRow = anchorOrigin.r + (this.#anchorCell.rowSpan || 1) - 1,
            minCol = anchorOrigin.c,
            maxCol = anchorOrigin.c + (this.#anchorCell.colSpan || 1) - 1;

        this.#selectedCells.forEach(c =>
        {
            const origin = this.#cellOrigin(grid, c);
            if (!origin) return;
            minRow = Math.min(minRow, origin.r);
            maxRow = Math.max(maxRow, origin.r + (c.rowSpan || 1) - 1);
            minCol = Math.min(minCol, origin.c);
            maxCol = Math.max(maxCol, origin.c + (c.colSpan || 1) - 1);
        });

        // Focus is whichever corner is opposite the anchor
        const focusRow = anchorOrigin.r <= (minRow + maxRow) / 2 ? maxRow : minRow;
        const focusCol = anchorOrigin.c <= (minCol + maxCol) / 2 ? maxCol : minCol;

        // Step focus one unit in the arrow direction
        let newFocusRow = focusRow,
            newFocusCol = focusCol;

        if (key === 'ArrowRight') newFocusCol = focusCol + 1;
        else if (key === 'ArrowLeft') newFocusCol = focusCol - 1;
        else if (key === 'ArrowDown') newFocusRow = focusRow + 1;
        else if (key === 'ArrowUp') newFocusRow = focusRow - 1;

        const nextFocus = grid[newFocusRow]?.[newFocusCol] ?? null;
        if (!nextFocus)
            return;

        e.preventDefault();
        e.stopPropagation();
        this.#clearHighlights();
        this.#selectRange(this.#anchorCell, nextFocus);
        this.#applyHighlights();

        this.editor.getDoc().defaultView.requestAnimationFrame(() =>
        {
            this.editor.activateDocument();
            this.#placeCaret(this.#anchorCell, true);
        });
    }

    #atCellStart(cell, requireCollapsed = true)
    {
        const range = this.editor.selectionRange.getRange();
        if (requireCollapsed && !range.collapsed)
            return false;

        if (!cell.contains(range.startContainer))
            return false;

        if (range.startOffset !== 0)
            return false;

        let node = range.startContainer;
        while (node && node !== cell)
        {
            if (node.previousSibling)
                return false;

            node = node.parentNode;
        }
        return true;
    }

    #atCellEnd(cell, requireCollapsed = true)
    {
        const range = this.editor.selectionRange.getRange();
        if (requireCollapsed && !range.collapsed)
            return false;

        const container = range.endContainer,
            maxOffset = container.nodeType === Node.TEXT_NODE ? container.length : container.childNodes.length;

        if (!cell.contains(container))
            return false;

        if (range.endOffset !== maxOffset)
            return false;

        let node = container;
        while (node && node !== cell)
        {
            if (node.nextSibling)
                return false;

            node = node.parentNode;
        }
        return true;
    }

    #onFirstLine(cell)
    {
        const range = this.editor.selectionRange.getRange(),
            style = getComputedStyle(cell),
            lineHeight = parseFloat(style.lineHeight) || 16,
            paddingTop = parseFloat(style.paddingTop) || 0;

        let rangeRect = range.getBoundingClientRect();

        if (rangeRect.top === 0)
        {
            const node = range.startContainer;
            const target = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
            rangeRect = target.getBoundingClientRect();
        }

        const cellRect = cell.getBoundingClientRect();

        return rangeRect.top - (cellRect.top + paddingTop) < lineHeight / 2;
    }

    #onLastLine(cell)
    {
        const range = this.editor.selectionRange.getRange(),
            style = getComputedStyle(cell),
            lineHeight = parseFloat(style.lineHeight) || 16,
            paddingBottom = parseFloat(style.paddingBottom) || 0;

        let rangeRect = range.getBoundingClientRect();

        if (rangeRect.top === 0)
        {
            const node = range.startContainer;
            const target = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
            rangeRect = target.getBoundingClientRect();
        }

        const cellRect = cell.getBoundingClientRect();

        return rangeRect.bottom - (cellRect.bottom - paddingBottom) < lineHeight / 2;
    }

    #placeCaret(cell, toStart)
    {
        this.#ensureCellParagraph(cell);

        const blocks = Array.from(cell.children).filter(n => this.editor.nodeManager.isBlock(n)),
            target = !toStart ? blocks[blocks.length - 1] : blocks[0],
            range = this.editor.selectionRange.getRange();

        range.selectNodeContents(target);
        this.editor.selectionRange.ensureTextRange(range); // resolves to text node first
        range.collapse(toStart); // then collapse on text node
        this.editor.selectionRange.restoreRange(range);
    }

    // ── Resize handles ───────────────────────────────────────────────────────

    #buildHandles(table)
    {
        const wrapperEl = table.closest(`figure.${this.#wrapperCssClass}`);
        if (!wrapperEl)
            return;

        this.#removeHandles(table);

        const cols = this.#cols(table);

        cols.forEach(col =>
        {
            const handle = $lib.element({ container: wrapperEl, props: { className: this.#colHandleCssClass } });
            this.#positionHandle(handle, col, table);
            $lib.on(handle, 'pointerdown', this.#resizeStart, [col, table], this);
        });

        // Observe table for size changes
        if (!this.#tableObservers.has(table))
        {
            const observer = new ResizeObserver(() =>
            {
                if (!table.isConnected)
                {
                    observer.disconnect();
                    this.#tableObservers.delete(table);
                    return;
                }
                this.#repositionHandles(table);
            });
            observer.observe(table);
            this.#tableObservers.set(table, observer);
        }
    }

    #repositionHandles(table)
    {
        if (!table?.isConnected)
            return;

        const cols = this.#cols(table),
            wrapperEl = table.closest(`figure.${this.#wrapperCssClass}`);

        wrapperEl.querySelectorAll(`:scope > .${this.#colHandleCssClass}`)
            .forEach((handle, index) => this.#positionHandle(handle, cols[index], table));
    }

    #positionHandle(handle, col, table)
    {
        const wrapperEl = table.closest(`figure.${this.#wrapperCssClass}`),
            wrapperRect = wrapperEl.getBoundingClientRect(),
            tableRect = table.getBoundingClientRect();

        handle.style.left = Math.round((tableRect.left - wrapperRect.left) + col.offsetLeft + col.offsetWidth - (handle.offsetWidth / 2)) + 'px';
        handle.style.top = Math.round(tableRect.top - wrapperRect.top) + 'px';
        handle.style.height = table.offsetHeight + 'px';
    }

    #removeHandles(table = null)
    {
        if (table)
        {
            this.#tableObservers.get(table)?.disconnect();
            this.#tableObservers.delete(table);

            const wrapperEl = table.closest(`figure.${this.#wrapperCssClass}`);
            wrapperEl?.querySelectorAll(`:scope > .${this.#colHandleCssClass}`).forEach(h => h.remove());
        }
        else
        {
            const root = this.editor.getEditorElement();
            root.querySelectorAll(`.${this.#colHandleCssClass}`).forEach(h => h.remove());
            this.#tableObservers = new WeakMap();
        }
    }

    // ── Resizing ─────────────────────────────────────────────────────────────

    #resizeStart(col, table, e)
    {
        if (e.button !== 0)
            return;

        e.preventDefault();  // prevents drag initiation and text selection
        e.stopPropagation(); // we own this event, don't bubble up
        this.hideMenuButton();

        const handle = e.target,
            cols = this.#cols(table),
            colIndex = cols.findIndex(c => c === col),
            isLast = cols[cols.length - 1] === col,
            nextCol = col.nextElementSibling,
            prevCol = col.previousElementSibling,
            usePercent = this.#usesPercentages(table),
            tableRect = table.getBoundingClientRect(),
            widthOfPrevCols = cols.slice(0, colIndex).reduce((sum, c) => sum + c.offsetWidth, 0),
            neighbourCol = (isLast && usePercent) ? prevCol : nextCol;

        handle.classList.add(this.#colHandleActiveCssClass);

        this.#dragging = {
            col,
            table,
            isLast,
            usePercent,
            totalWidth: table.offsetWidth,
            startColWidth: col.offsetWidth,
            startNextColWidth: neighbourCol ? neighbourCol.offsetWidth : 0,
            nextCol: neighbourCol,
            startX: tableRect.left + widthOfPrevCols + col.offsetWidth,
        };
    }

    #scheduleResize(e)
    {
        if (!this.#dragging)
            return;

        this.#lastEvent = e;
        if (!this.#rafId)
        {
            this.#rafId = this.editor.getDoc().defaultView.requestAnimationFrame(() =>
            {
                this.editor.activateDocument();

                if (this.#lastEvent)
                    this.#resize(this.#lastEvent);

                this.#rafId = null;
                this.#lastEvent = null;
            });
        }
    }

    #resize(e)
    {
        const { col, table, isLast, usePercent, totalWidth, startColWidth, startX } = this.#dragging;

        const delta = e.clientX - startX,
            newPx = Math.max(30, startColWidth + delta);

        if (isLast && !usePercent)
        {
            const newTableWidth = Math.max(totalWidth - startColWidth + 30, totalWidth + delta);
            table.style.width = newTableWidth.toFixed(0) + 'px';
            col.style.width = newPx.toFixed(0) + 'px';
        }
        else
        {
            const nextCol = this.#dragging.nextCol,
                nextColWidth = startColWidth + this.#dragging.startNextColWidth - newPx;

            if (!nextCol || nextColWidth < 30)
                return;

            if (usePercent)
            {
                col.style.width = (newPx / totalWidth * 100).toFixed(2) + '%';
                nextCol.style.width = (nextColWidth / totalWidth * 100).toFixed(2) + '%';
            }
            else
            {
                col.style.width = newPx.toFixed(0) + 'px';
                nextCol.style.width = nextColWidth.toFixed(0) + 'px';
            }
        }

        this.#repositionHandles(table);
    }

    #resizeEnd()
    {
        if (!this.#dragging)
            return;

        const { table } = this.#dragging;
        if (this.#rafId) { cancelAnimationFrame(this.#rafId); this.#rafId = null; }
        this.#dragging = null;
        this.#lastEvent = null;

        const wrapperEl = table.closest(`figure.${this.#wrapperCssClass}`);
        wrapperEl.querySelectorAll(`:scope > .${this.#colHandleCssClass}`).forEach(h => h.classList.remove(this.#colHandleActiveCssClass));

        const { cell } = this.#context();
        this.#finalize(cell);

        if (cell && this.#activeMenuButton)
            this.positionMenuButton(cell);
    }

    // ── Copying/Pasting ──────────────────────────────────────────────────────

    /**
     * Writes the table html data to the clipboard.
     */
    async #writeToClipboard()
    {
        const data = this.#serializeSelection();
        if (!data)
            return;

        await navigator.clipboard.write([
            new ClipboardItem({
                'text/html': new Blob([data.html], { type: 'text/html' }),
                'text/plain': new Blob([data.text], { type: 'text/plain' })
            })
        ]);
    }

    /**
     * Builds the html data to copy.
     * @ignore
     * @returns {Object} The html and text data.
     */
    #serializeSelection()
    {
        const { table } = this.#context();
        if (!table || this.#selectedCells.size === 0)
            return null;

        const rowMap = new Map();

        this.#selectedCells.forEach(cell =>
        {
            const row = cell.parentElement;

            if (!rowMap.has(row))
                rowMap.set(row, []);

            rowMap.get(row).push(cell);
        });

        const tableEl = $lib.element({ tag: 'table' });

        rowMap.forEach(cells =>
        {
            const tr = $lib.element({ container: tableEl, tag: 'tr' });

            cells.forEach(cell =>
            {
                $lib.element({
                    container: tr,
                    tag: 'td',
                    content: [cell.innerHTML],
                    props:
                    {
                        colSpan: cell.colSpan || undefined,
                        rowSpan: cell.rowSpan || undefined
                    },
                    attrs: { style: cell.getAttribute?.('style') }
                });
            });
        });

        return {
            html: tableEl.outerHTML,
            text: tableEl.innerText
        };
    }

    /**
     * Pastes the source table cells into the target table at the current selection.
     * @param {any} sourceTable
     * @param {any} table
     * @param {any} cell
     * @ignore
     */
    #applyPaste(sourceTable, table, cell)
    {
        const startRowIndex = this.#rowIndex(table, cell.parentElement),
            startColIndex = this.#cellColIndex(cell.parentElement, cell),
            tableIdAttr = this.utility.tableIdAttr,
            tempId = $lib.guid();

        table.setAttribute(tableIdAttr, tempId);

        this.#preparePasteArea(sourceTable, table, cell, startRowIndex, startColIndex);
        this.#copyCells(sourceTable, table, startRowIndex, startColIndex);

        setTimeout(() =>
        {
            const restoredTable = this.editor.getEditorElement().querySelector(`[${tableIdAttr}="${tempId}"]`);

            if (!restoredTable)
                return;

            restoredTable.removeAttribute(tableIdAttr);

            const restoredCell = this.#cellAtColumnIndex(restoredTable.rows[startRowIndex], startColIndex);
            this.#rebuildColgroup(restoredTable);
            this.#finalize(restoredCell);
        }, 0);
    }

    /**
     * Expands the table if needed and normalizes the paste region by unmerging conflicting spans.
     * @param {any} sourceTable
     * @param {any} table
     * @param {any} cell
     * @param {any} startRowIndex
     * @param {any} startColIndex
     * @ignore
     */
    #preparePasteArea(sourceTable, table, cell, startRowIndex, startColIndex)
    {
        const srcMaxCols = this.#maxColCount(sourceTable),
            srcRows = sourceTable.rows.length,
            section = cell.closest('tbody') || cell.closest('thead') || cell.closest('tfoot') || table;

        // Add rows to current table
        while (table.rows.length < startRowIndex + srcRows)
        {
            const newRow = $lib.element({ container: section, tag: 'tr' });

            for (let index = 0; index < this.#rowColCount(table.rows[0]); index++)
                newRow.appendChild(this.#createCell());
        }

        const requiredCols = startColIndex + srcMaxCols,
            currentCols = this.#rowColCount(table.rows[0]),
            diff = requiredCols - currentCols;

        if (diff > 0)  // Expand all rows to new column width
        {
            for (const row of table.rows)
            {
                for (let index = 0; index < diff; index++)
                    row.appendChild(this.#createCell());
            }
        }

        // Unmerge all cells in the paste rectangle so we have a clean flat grid
        for (let r = startRowIndex; r < startRowIndex + srcRows; r++)
        {
            for (let c = startColIndex; c < startColIndex + srcMaxCols; c++)
            {
                const existing = this.#cellAtColumnIndex(table.rows[r], c);
                if (existing && ((existing.colSpan || 1) > 1 || (existing.rowSpan || 1) > 1))
                    this.#splitCell(table, existing);
            }
        }
    }

    /**
     * Copies cell content and spanning info from source to target table.
     * @param {any} sourceTable
     * @param {any} table
     * @param {any} startRowIndex
     * @param {any} startColIndex
     * @ignore
     */
    #copyCells(sourceTable, table, startRowIndex, startColIndex)
    {
        Array.from(sourceTable.rows).forEach((sourceRow, rowOffset) =>
        {
            let colOffset = 0;
            Array.from(sourceRow.cells).forEach(sourceCell =>
            {
                const targetRow = table.rows[startRowIndex + rowOffset],
                    targetCol = this.#cellAtColumnIndex(targetRow, startColIndex + colOffset);
                if (!targetCol)
                    return;

                targetCol.innerHTML = sourceCell.innerHTML;
                targetCol.colSpan = sourceCell.colSpan || 1;
                targetCol.rowSpan = sourceCell.rowSpan || 1;

                if (sourceCell.hasAttribute('style'))
                    targetCol.setAttribute('style', sourceCell.getAttribute('style'));
                else
                    targetCol.removeAttribute('style');

                // Remove cells now covered by this spanning cell
                for (let rowIndex = 1; rowIndex < (targetCol.rowSpan || 1); rowIndex++)
                    for (let colIndex = 0; colIndex < (targetCol.colSpan || 1); colIndex++)
                    {
                        const covered = this.#cellAtColumnIndex(table.rows[startRowIndex + rowOffset + rowIndex], startColIndex + colOffset + colIndex);
                        if (covered)
                            covered.remove();
                    }

                colOffset += sourceCell.colSpan || 1;
            });
        });
    }

    // ── Selection ────────────────────────────────────────────────────────────

    /**
     * Selects a rectangular range of cells, expanding to fully include
     * any partially covered rowspan/colspan cells.
     * @ignore
     */
    #selectRange(start, end)
    {
        const table = start.closest('table');

        // STEP 1: Build visual grid (rowspan/colspan resolved)
        const grid = this.#buildGridMap(table);

        // STEP 2: Get cell positions in grid
        const startPos = this.#cellOrigin(grid, start);
        const endPos = this.#cellOrigin(grid, end);

        if (!startPos || !endPos) return;

        // STEP 3: Initial rectangle
        let minRow = Math.min(startPos.r, endPos.r);
        let maxRow = Math.max(startPos.r, endPos.r);
        let minCol = Math.min(startPos.c, endPos.c);
        let maxCol = Math.max(startPos.c, endPos.c);

        // STEP 4: Expand until stable (respect full spans)
        let expanded = true;

        while (expanded)
        {
            expanded = false;

            for (let r = minRow; r <= maxRow; r++)
            {
                for (let c = minCol; c <= maxCol; c++)
                {
                    const cell = grid[r]?.[c];
                    if (!cell) continue;

                    const bounds = this.#getCellBounds(cell, grid);

                    if (bounds.minRow < minRow)
                    {
                        minRow = bounds.minRow;
                        expanded = true;
                    }

                    if (bounds.minCol < minCol)
                    {
                        minCol = bounds.minCol;
                        expanded = true;
                    }

                    if (bounds.maxRow > maxRow)
                    {
                        maxRow = bounds.maxRow;
                        expanded = true;
                    }

                    if (bounds.maxCol > maxCol)
                    {
                        maxCol = bounds.maxCol;
                        expanded = true;
                    }
                }
            }
        }

        // STEP 5: Collect final selection
        this.#selectedCells = new Set();

        for (let r = minRow; r <= maxRow; r++)
        {
            for (let c = minCol; c <= maxCol; c++)
            {
                const cell = grid[r]?.[c];
                if (cell)
                {
                    this.#selectedCells.add(cell);
                }
            }
        }
    }

    /**
     * Builds a visual grid map of the table where each (row, col) position points to the actual DOM cell. 
     * Handles rowspan/colspan by assigning spanning cells to all occupied visual slots.
     * This grid represents visual layout, not DOM structure.
     * @ignore
     */
    #buildGridMap(table)
    {
        const map = [],
            rows = Array.from(table.rows);

        rows.forEach((row, rowIndex) =>
        {
            if (!map[rowIndex]) map[rowIndex] = [];

            let col = 0;
            Array.from(row.children).forEach(cell =>
            {
                // Skip slots already claimed by a rowspanning cell from above
                while (map[rowIndex][col]) col++;

                const rowSpan = cell.rowSpan || 1,
                    colSpan = cell.colSpan || 1;

                for (let r = 0; r < rowSpan; r++)
                {
                    for (let c = 0; c < colSpan; c++)
                    {
                        if (!map[rowIndex + r])
                            map[rowIndex + r] = [];

                        map[rowIndex + r][col + c] = cell;  // same cell DOM reference used for all covered visual slots
                    }
                }

                col += colSpan;
            });
        });

        return map;
    }

    /**
     * Returns the top-left grid position of a cell within the table grid.
     * @ignore
     */
    #cellOrigin(grid, cell)
    {
        for (let r = 0; r < grid.length; r++)
        {
            for (let c = 0; c < (grid[r]?.length || 0); c++)
            {
                if (grid[r][c] === cell)
                {
                    return { r, c };
                }
            }
        }
        return null;
    }

    /**
     * Returns the full grid bounds occupied by a cell (including spans).
     * @ignore
     */
    #getCellBounds(cell, grid)
    {
        const origin = this.#cellOrigin(grid, cell),
            rowSpan = cell.rowSpan || 1,
            colSpan = cell.colSpan || 1;

        return {
            minRow: origin.r,
            maxRow: origin.r + rowSpan - 1,
            minCol: origin.c,
            maxCol: origin.c + colSpan - 1
        };
    }

    #selectCell(cell, placeCaret = true)
    {
        if (!cell)
            return;

        this.#clearHighlights();
        this.#selectedCells = new Set([cell]);
        this.#anchorCell = cell;
        this.#applyHighlights();

        if (!placeCaret)
            return;

        const range = this.editor.selectionRange.getRange();
        if (!cell.contains(range.startContainer) || !range.collapsed)
            this.#placeCaret(cell, true);
    }

    #clearHighlights()
    {
        this.#selectedCells.forEach(c =>
        {
            c.classList.remove(this.#selectedCssClass, this.#anchorCssClass);
            if (!c.className)
                c.removeAttribute('class');
        });

        if (this.#anchorCell)
        {
            this.#anchorCell.classList.remove(this.#anchorCssClass);
            if (!this.#anchorCell.className)
                this.#anchorCell.removeAttribute('class');
        }
    }

    #applyHighlights()
    {
        if (this.#selectedCells.size > 1)
            this.#selectedCells.forEach(c => c.classList.add(this.#selectedCssClass));

        if (this.#anchorCell)
            this.#anchorCell.classList.add(this.#anchorCssClass);
    }

    #getSelectedCells(table)
    {
        return Array.from(this.#selectedCells);
    }

    #getSelectedRows(table) { return [...new Set(this.#getSelectedCells(table).map(c => c.parentElement))]; }


    // ── Helpers ──────────────────────────────────────────────────────────────

    #context()
    {
        const selection = this.editor.selectionRange,
            range = selection.getRange(),
            nodes = selection.getNodesInRange(range),
            rootNodes = selection.getRootNodesInRange(range, nodes),
            rootNode = rootNodes[0];

        let cell = rootNode?.closest('td,th') || this.#contextCell || this.#firstSelectedCell();

        if (!cell?.isConnected)
            cell = null;

        return { cell, table: cell?.closest('table') };
    }

    #handleCaretOutsideCell(e)
    {
        const range = this.editor.selectionRange.getRange(),
            startContainer = range.startContainer,
            el = startContainer.nodeType === Node.TEXT_NODE ? startContainer.parentElement : startContainer,
            figure = el.closest(`figure.${this.#wrapperCssClass}`),
            isPrintable = this.utility.isPrintableChar(e);

        let firstCell = el.closest('td,th');

        if (figure && !firstCell) // Caret is between figure and table element - do not allow typing here, move to first cell
        {
            if (range.collapsed)
            {
                firstCell = figure.querySelector('td,th');
                if (firstCell)
                    this.#placeCaret(firstCell, true);
            }
            else if (isPrintable || e.key === 'Delete' || e.key === 'Backspace')
            {
                // Clamp start of range to the first cell's content
                firstCell = figure.querySelector('td,th');
                if (firstCell)
                {
                    range.setStart(firstCell.firstElementChild, 0);
                    this.editor.selectionRange.ensureTextRange(range);
                    this.editor.selectionRange.restoreRange(range);
                }
            }
        }
    }

    #collapseMultiCellSelection()
    {
        const range = this.editor.selectionRange.getRange();

        if (range.collapsed)
            return;

        const startContainer = range.startContainer,
            endContainer = range.endContainer,
            firstEl = startContainer.nodeType === Node.TEXT_NODE ? startContainer.parentElement : startContainer,
            lastEl = endContainer.nodeType === Node.TEXT_NODE ? endContainer.parentElement : endContainer,
            firstCell = firstEl.closest('td, th'),
            lastCell = lastEl.closest('td, th');

        if (firstCell && firstCell !== lastCell) // selection spawns multiple cells
        {
            const grid = this.#buildGridMap(firstCell.closest('table')),
                anchorPos = this.#cellOrigin(grid, firstCell),
                cellPos = (lastCell) ? this.#cellOrigin(grid, lastCell) : null,
                isForward = (lastCell) ? cellPos.r > anchorPos.r || (cellPos.r === anchorPos.r && cellPos.c > anchorPos.c) : true;

            this.editor.getDoc().defaultView.requestAnimationFrame(() =>
            {
                this.#placeCaret(firstCell, true);
            });
        }
    }

    #ensureCellParagraph(cell)
    {
        if (!cell)
            return;

        const selection = this.editor.selectionRange,
            range = selection.getRange();

        // Wrap any stray inline/text nodes directly in cell into a <p>
        const strayNodes = Array.from(cell.childNodes).filter(n => n.nodeType === Node.TEXT_NODE || (n.nodeType === Node.ELEMENT_NODE && !this.editor.nodeManager.isBlock(n)));

        if (strayNodes.length)
        {
            const marker = selection.createRangeMarker(range);
            const p = $lib.element({ tag: 'p' });
            cell.insertBefore(p, strayNodes[0]);
            strayNodes.forEach(n => p.appendChild(n));

            if (!p.firstChild || p.firstChild.nodeName === 'BR')
            {
                p.innerHTML = '';
                $lib.element({ container: p, tag: 'br' });
            }

            selection.restoreRangeToMarker(marker, range);
            return;
        }

        // If cell has no block at all, insert <p><br>
        const hasBlock = Array.from(cell.children).some(n => this.editor.nodeManager.isBlock(n));

        if (!hasBlock)
        {
            const p = $lib.element({ tag: 'p' }),
                br = $lib.element({ container: p, tag: 'br' });
            selection.insertIntoRange(range, p, br);
            selection.restoreRange(range);
            return;
        }

        // If caret is at cell level, move it into the appropriate child
        if (range.startContainer === cell)
        {
            const target = cell.children[range.startOffset] || cell.lastElementChild;
            range.selectNodeContents(target);
            range.collapse(true);
            selection.ensureTextRange(range);
            selection.restoreRange(range);
        }

        Array.from(cell.children).filter(n => this.editor.nodeManager.isBlock(n) && !n.firstChild).forEach(n => $lib.element({ container: n, tag: 'br' })); // Make sure empty block has at least <br> tag, otherwise caret can't be set.
    }

    #firstSelectedCell()
    {
        return this.#selectedCells.values().next().value ?? null;
    }

    #usesPercentages(table)
    {
        const w = table.style.width || '';
        return w === '' || w === '100%' || w.endsWith('%');
    }

    #createCell(container = null)
    {
        const p = $lib.element({ tag: 'p' }),
            br = $lib.element({ container: p, tag: 'br' });

        return $lib.element({ tag: 'td', container, content: p });
    }

    #rebuildColgroup(table, splitAt = -1)
    {
        const cg = table.querySelector('colgroup');
        if (!cg) return;

        const totalCols = this.#rowColCount(table.rows[0]),
            usePercent = this.#usesPercentages(table),
            totalWidth = table.offsetWidth,
            currentWidths = Array.from(cg.children).map(col => col.offsetWidth);

        currentWidths.splice(splitAt + 1, 0, 0); // insert placeholder for new col

        cg.innerHTML = '';

        for (let index = 0; index < totalCols; index++)
        {
            const col = $lib.element({ container: cg, tag: 'col' });
            let px;

            if (splitAt >= 0 && (index === splitAt || index === splitAt + 1))
            {
                const halfSize = Math.floor(currentWidths[splitAt] / 2);

                if (index === splitAt)
                    px = halfSize;
                else  // index === splitAt + 1
                    px = currentWidths[splitAt] - halfSize; // remainder avoids losing px to rounding
            }
            else
                px = currentWidths[index] || (totalWidth / totalCols);

            col.style.width = usePercent ? (px / totalWidth * 100).toFixed(2) + '%' : px.toFixed(0) + 'px';
        }
    }

    #ensureSection(table, tag)
    {
        let section = table.querySelector(tag);
        if (!section)
        {
            const tfoot = table.querySelector('tfoot');
            section = $lib.element({ container: table, tag, before: tag === 'tbody' && tfoot ? tfoot : null });
        }
        return section;
    }

    #maxColCount(table)
    {
        let max = 0;

        for (const row of table.rows)
            max = Math.max(max, this.#rowColCount(row));

        return max;
    }

    /**
     * Returns the column count for the given row. We only support rectangular table's so any row should return correct max column count.
     * @param {any} row
     * @returns {number} The column count.
     * @ignore
     */
    #rowColCount(row)
    {
        let colCount = 0;

        for (const c of row.cells)
            colCount += c.colSpan || 1;

        return colCount;
    }

    #cellColIndex(row, cell) { return Array.from(row.cells).indexOf(cell); }

    #rowIndex(table, row) { return Array.from(table.rows).indexOf(row); }

    /**
     * Resolves the column index of the given cell considering spans.
     * @param {any} row
     * @param {any} cell
     * @ignore
     * @returns {number} The column index of the cell.
     */
    #columnIndexOfCell(row, cell)
    {
        let index = 0;
        for (const c of row.cells)
        {
            if (c === cell)
                return index;

            index += c.colSpan || 1;
        }
        return -1;
    }

    /**
     * Resolves the cell for the given column index.
     * @param {any} row The row.
     * @param {any} colIndex The real spanned column index.
     * @ignore
     * @returns {HTMLTableCellElement|null} The resolved cell.
     */
    #cellAtColumnIndex(row, colIndex)
    {
        let colCount = 0;
        for (const cell of row.cells)
        {
            const span = cell.colSpan || 1;
            if (colCount <= colIndex && colIndex < colCount + span)
                return cell;

            colCount += span;
        }
        return null;
    }

    #cols(table)
    {
        return Array.from(table.querySelectorAll(':scope > colgroup > col'));
    }

    #clearCells(cells)
    {
        cells.forEach(cell =>
        {
            const p = $lib.element({ tag: 'p' });
            $lib.element({ container: p, tag: 'br' });
            cell.innerHTML = '';
            cell.appendChild(p);
        });
    }

    #isSameTable(cellA, cellB)
    {
        return cellA?.closest('table') === cellB?.closest('table');
    }

    #finalize(cell)
    {
        const table = cell?.closest('table');

        this.clearSelection();
        this.removeMenuButton();

        if (table)
            this.#removeHandles(table);

        this.editor.history.addItem();

        if (table)
            this.#buildHandles(table);

        if (cell)
            this.#selectCell(cell);
    }
};

export default componyx.UI.editor_modules.Table;
