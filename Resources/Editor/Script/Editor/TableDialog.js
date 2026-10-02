/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * TableDialog module — manages the Table Settings dialog.
 * @class TableDialog
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.TableDialog = class TableDialog
{
    #dialog = null;
    #editor;
    #cf;
    #context = null;

    // Category elements
    #categoriesEl = null;
    #settingsViewEl = null;

    // Change tracking flags (reset on each dialog open)
    #tableChanged = { borderWidth: false, borderStyle: false, borderColor: false };
    #rowChanged = { borderStyle: false, borderColor: false };
    #cellChanged = { borderWidth: false, borderStyle: false, borderColor: false };

    // Table fields
    #tableWidth = null;
    #tableAlignment = null;
    #tableBorderWidth = null;
    #tableBorderStyle = null;
    #tableBorderColorBtn = null;
    #tableBgColorBtn = null;
    #tableCellSpacing = null;
    #tableCellPadding = null;
    #tableCaption = null;

    // Row fields
    #rowIsHeader = null;
    #rowIsFooter = null;
    #rowHeight = null;
    #rowBgColorBtn = null;
    #rowBorderStyle = null;
    #rowBorderColorBtn = null;

    // Cell fields
    #cellWidth = null;
    #cellHeight = null;
    #cellVerticalAlign = null;
    #cellHorizontalAlign = null;
    #cellBgColorBtn = null;
    #cellBorderWidth = null;
    #cellBorderStyle = null;
    #cellBorderColorBtn = null;

    #selectedCssClass;
    #panelCssClass;
    #fieldHalfCssClass;

    constructor(editor)
    {
        this.#editor = editor;
        this.#cf = editor.componentFactory;
        this.utility = editor.utility;
        this.#selectedCssClass = editor.getCssClass(this.#editor.classOption.TABLE_SELECTED);
        this.#panelCssClass = editor.getCssClass(this.#editor.classOption.TABLE_DIALOG_PANEL);
        this.#fieldHalfCssClass = editor.getCssClass(editor.classOption.FIELD_HALF);
    }

    get dialog() { return this.#dialog; }

    show(context)
    {
        this.#context = context;
        this.#dialog?.show();
    }

    create()
    {
        const editor = this.#editor,
            cf = this.#cf,
            id = 'TableDialog',
            header = $lib.element('', '', '', editor.labels.tableDialogHeader || 'Table Settings'),
            content = $lib.element();

        this.#categoriesEl = $lib.element('', '', '', '', { class: editor.getCssClass(editor.classOption.TABLE_DIALOG_CATEGORIES) });
        this.#settingsViewEl = $lib.element('', '', '', '', { class: editor.getCssClass(editor.classOption.TABLE_DIALOG_VIEW) });

        // Build category navigation — Table / Row / Cell
        const categories = [
            { label: editor.labels.tableDialogCategoryTable, fn: () => this.#showCategory('table') },
            { label: editor.labels.tableDialogCategoryRow, fn: () => this.#showCategory('row') },
            { label: editor.labels.tableDialogCategoryCell, fn: () => this.#showCategory('cell') },
        ];

        $lib.each(categories, cat =>
        {
            $lib.element(this.#categoriesEl, '', 'a', cat.label, { class: editor.getCssClass(editor.classOption.TABLE_DIALOG_CATEGORY) }, { onclick: cat.fn });
        });

        // Build all three setting panels (hidden by default)
        this.#settingsViewEl.append(
            this.#buildTablePanel(),
            this.#buildRowPanel(),
            this.#buildCellPanel()
        );

        content.append(this.#categoriesEl, this.#settingsViewEl);

        this.#dialog = cf.createDialog(id, editor.tableDialogId, {
            cssClass: editor.getCssClass(editor.classOption.TABLE_DIALOG),
            header,
            content,
            onShowComplete: () => this.#onShowComplete(),
            onConfirm: () => this.#onConfirm(),
            onHide: () =>
            {
                const cell = this.#context.cell;

                cell.classList.remove(this.#selectedCssClass);

                if (!cell.className)
                    cell.removeAttribute('class');

                this.#context = null;
            }
        });
    }

    // ── Category navigation ───────────────────────────────────────────────────

    #showCategory(name)
    {
        this.#settingsViewEl.querySelectorAll(`.${this.#panelCssClass}`).forEach(panel =>
        {
            panel.style.display = panel.dataset.category === name ? '' : 'none';
        });

        const activeCssClass = this.#editor.getCssClass(this.#editor.classOption.ACTIVE);

        $lib.each(this.#categoriesEl.children, (link, index) =>
        {
            const cats = ['table', 'row', 'cell'];
            link.classList.toggle(activeCssClass, cats[index] === name);
        });
    }

    // ── Panel builders ────────────────────────────────────────────────────────

    #buildTablePanel()
    {
        const editor = this.#editor,
            cf = this.#cf,
            panel = this.#createPanel('table'),
            labels = editor.labels,
            td = editor.tableDialog,
            temp = $lib.element();

        const fields = {};

        // Width — full width on its own row
        this.#tableWidth = $lib.element('', '', 'input', '', { type: 'text', id: this.#getId('tableWidth') });
        fields.width = cf.createFormField('fldTableWidth', td.tableWidthFormFieldId, temp, { label: labels.tableWidth, field: this.#tableWidth }).element;

        // Cell spacing / Cell padding — paired
        this.#tableCellSpacing = $lib.element('', '', 'input', '', { type: 'text', id: this.#getId('tableCellSpacing') });
        fields.cellSpacing = cf.createFormField('fldTableCellSpacing', td.tableCellSpacingFormFieldId, temp, { label: labels.tableCellSpacing, field: this.#tableCellSpacing, cssClass: this.#fieldHalfCssClass }).element;

        this.#tableCellPadding = $lib.element('', '', 'input', '', { type: 'text', id: this.#getId('tableCellPadding') });
        fields.cellPadding = cf.createFormField('fldTableCellPadding', td.tableCellPaddingFormFieldId, temp, { label: labels.tableCellPadding, field: this.#tableCellPadding, cssClass: this.#fieldHalfCssClass }).element;

        // Alignment
        this.#tableAlignment = this.#createComboBox('tableAlignment', td.horizontalAlignComboBoxId, [
            { value: 'left', text: labels.alignLeft },
            { value: 'center', text: labels.alignCenter },
            { value: 'right', text: labels.alignRight },
        ]);
        fields.alignment = cf.createFormField('fldTableAlignment', td.tableAlignFormFieldId, temp, { label: labels.tableAlignment, field: this.#tableAlignment.element }).element;

        // Border width / Border style — paired
        this.#tableBorderWidth = $lib.element({ tag: 'input', props: { type: 'text', id: this.#getId('tableBorderWidth'), oninput: () => { this.#tableChanged.borderWidth = true; } } });
        fields.borderWidth = cf.createFormField('fldTableBorderWidth', td.tableBorderWidthFormFieldId, temp, { label: labels.borderWidth, field: this.#tableBorderWidth, cssClass: this.#fieldHalfCssClass }).element;

        this.#tableBorderStyle = this.#createComboBox('tableBorderStyle', td.borderStyleComboBoxId, [
            { value: 'none', text: labels.borderStyleNone },
            { value: 'solid', text: labels.borderStyleSolid },
            { value: 'dashed', text: labels.borderStyleDashed },
            { value: 'dotted', text: labels.borderStyleDotted },
            { value: 'double', text: labels.borderStyleDouble },
        ], () => { this.#tableChanged.borderStyle = true });
        fields.borderStyle = cf.createFormField('fldTableBorderStyle', td.tableBorderStyleFormFieldId, temp, { label: labels.borderStyle, field: this.#tableBorderStyle.element, cssClass: this.#fieldHalfCssClass }).element;

        // Border color / Background color
        this.#tableBorderColorBtn = this.#createColorButton('tableBorderColor', td.tableBorderColorFormFieldId, td.borderColorButtonId, temp, labels.borderColor, true, () => { this.#tableChanged.borderColor = true });
        fields.borderColor = temp.lastElementChild;

        this.#tableBgColorBtn = this.#createColorButton('tableBgColor', td.tableBgColorFormFieldId, td.bgColorButtonId, temp, labels.bgColor, true);
        fields.bgColor = temp.lastElementChild;

        // Caption
        this.#tableCaption = $lib.element('', '', 'input', '', { type: 'text', id: this.#getId('tableCaption') });
        fields.caption = cf.createFormField('fldTableCaption', td.tableCaptionFormFieldId, temp, { label: labels.caption, field: this.#tableCaption }).element;

        const defaultTemplate = '{width}{cellSpacing}{cellPadding}{alignment}{borderWidth}{borderStyle}{borderColor}{bgColor}{caption}',
            templateId = 'TableDialogTable',
            defaultTemplateId = 'Default' + templateId;

        if (!editor.hasTemplate(templateId))
        {
            editor.addTemplate(defaultTemplateId, defaultTemplate, false);
            editor.applyTemplate(panel, defaultTemplateId, fields);
        }
        else
            editor.applyTemplate(panel, templateId, fields);

        return panel;
    }

    #buildRowPanel()
    {
        const editor = this.#editor,
            cf = this.#cf,
            panel = this.#createPanel('row'),
            labels = editor.labels,
            td = editor.tableDialog,
            temp = $lib.element();

        const fields = {};

        // Header / Footer toggles — paired
        this.#rowIsHeader = $lib.element('', '', 'input', '', { type: 'checkbox', id: this.#getId('rowIsHeader') });
        fields.isHeader = cf.createFormField('fldRowIsHeader', td.rowIsHeaderFormFieldId, temp, { label: labels.headerRow, field: this.#rowIsHeader, switch: true, labelDisplay: 5 }).element;

        this.#rowIsFooter = $lib.element('', '', 'input', '', { type: 'checkbox', id: this.#getId('rowIsFooter') });
        fields.isFooter = cf.createFormField('fldRowIsFooter', td.rowIsFooterFormFieldId, temp, { label: labels.footerRow, field: this.#rowIsFooter, switch: true, labelDisplay: 5 }).element;

        // Height — full width on its own
        this.#rowHeight = $lib.element('', '', 'input', '', { type: 'text', id: this.#getId('rowHeight') });
        fields.height = cf.createFormField('fldRowHeight', td.rowHeightFormFieldId, temp, { label: labels.rowHeight, field: this.#rowHeight }).element;

        // Border style — paired with height
        this.#rowBorderStyle = this.#createComboBox('rowBorderStyle', td.borderStyleComboBoxId, [
            { value: 'none', text: labels.borderStyleNone },
            { value: 'solid', text: labels.borderStyleSolid },
            { value: 'dashed', text: labels.borderStyleDashed },
            { value: 'dotted', text: labels.borderStyleDotted },
            { value: 'double', text: labels.borderStyleDouble },
        ], () => { this.#rowChanged.borderStyle = true; });
        fields.borderStyle = cf.createFormField('fldRowBorderStyle', td.rowBorderStyleFormFieldId, temp, { label: labels.borderStyle, field: this.#rowBorderStyle.element }).element;

        // Border color / Background color — full width each
        this.#rowBorderColorBtn = this.#createColorButton('rowBorderColor', td.rowBorderColorFormFieldId, td.borderColorButtonId, temp, labels.borderColor, true, () => { this.#rowChanged.borderColor = true; });
        fields.borderColor = temp.lastElementChild;

        this.#rowBgColorBtn = this.#createColorButton('rowBgColor', td.rowBgColorFormFieldId, td.bgColorButtonId, temp, labels.bgColor, true);
        fields.bgColor = temp.lastElementChild;

        const defaultTemplate = '{isHeader}{isFooter}{height}{borderStyle}{borderColor}{bgColor}',
            templateId = 'TableDialogRow',
            defaultTemplateId = 'Default' + templateId;

        if (!editor.hasTemplate(templateId))
        {
            editor.addTemplate(defaultTemplateId, defaultTemplate, false);
            editor.applyTemplate(panel, defaultTemplateId, fields);
        }
        else
            editor.applyTemplate(panel, templateId, fields);

        return panel;
    }

    #buildCellPanel()
    {
        const editor = this.#editor,
            cf = this.#cf,
            panel = this.#createPanel('cell'),
            labels = editor.labels,
            td = editor.tableDialog,
            temp = $lib.element();

        const fields = {};

        // Width / Height — paired
        this.#cellWidth = $lib.element('', '', 'input', '', { type: 'text', id: this.#getId('cellWidth') });
        fields.width = cf.createFormField('fldCellWidth', td.cellWidthFormFieldId, temp, { label: labels.cellWidth, field: this.#cellWidth, cssClass: this.#fieldHalfCssClass }).element;

        this.#cellHeight = $lib.element('', '', 'input', '', { type: 'text', id: this.#getId('cellHeight') });
        fields.height = cf.createFormField('fldCellHeight', td.cellHeightFormFieldId, temp, { label: labels.cellHeight, field: this.#cellHeight, cssClass: this.#fieldHalfCssClass }).element;

        // Vertical / Horizontal align — paired
        this.#cellVerticalAlign = this.#createComboBox('cellVerticalAlign', td.verticalAlignComboBoxId, [
            { value: 'top', text: labels.alignTop },
            { value: 'middle', text: labels.alignMiddle },
            { value: 'bottom', text: labels.alignBottom },
        ]);
        fields.verticalAlign = cf.createFormField('fldCellVerticalAlign', td.cellVerticalAlignFormFieldId, temp, { label: labels.verticalAlign, field: this.#cellVerticalAlign.element, cssClass: this.#fieldHalfCssClass }).element;

        this.#cellHorizontalAlign = this.#createComboBox('cellHorizontalAlign', td.horizontalAlignComboBoxId, [
            { value: 'left', text: labels.alignLeft },
            { value: 'center', text: labels.alignCenter },
            { value: 'right', text: labels.alignRight },
        ]);
        fields.horizontalAlign = cf.createFormField('fldCellHorizontalAlign', td.cellHorizontalAlignFormFieldId, temp, { label: labels.horizontalAlign, field: this.#cellHorizontalAlign.element, cssClass: this.#fieldHalfCssClass }).element;

        // Border width / Border style — paired
        this.#cellBorderWidth = $lib.element({ tag: 'input', props: { type: 'text', id: this.#getId('cellBorderWidth'), oninput: () => { this.#cellChanged.borderWidth = true; } } });
        fields.borderWidth = cf.createFormField('fldCellBorderWidth', td.cellBorderWidthFormFieldId, temp, { label: labels.borderWidth, field: this.#cellBorderWidth, cssClass: this.#fieldHalfCssClass }).element;

        this.#cellBorderStyle = this.#createComboBox('cellBorderStyle', td.borderStyleComboBoxId, [
            { value: 'none', text: labels.borderStyleNone },
            { value: 'solid', text: labels.borderStyleSolid },
            { value: 'dashed', text: labels.borderStyleDashed },
            { value: 'dotted', text: labels.borderStyleDotted },
            { value: 'double', text: labels.borderStyleDouble },
        ], () => { this.#cellChanged.borderStyle = true; });
        fields.borderStyle = cf.createFormField('fldCellBorderStyle', td.cellBorderStyleFormFieldId, temp, { label: labels.borderStyle, field: this.#cellBorderStyle.element, cssClass: this.#fieldHalfCssClass }).element;

        // Border color / Background color — full width each
        this.#cellBorderColorBtn = this.#createColorButton('cellBorderColor', td.cellBorderColorFormFieldId, td.borderColorButtonId, temp, labels.borderColor, true, () => { this.#cellChanged.borderColor = true; });
        fields.borderColor = temp.lastElementChild;

        this.#cellBgColorBtn = this.#createColorButton('cellBgColor', td.cellBgColorFormFieldId, td.bgColorButtonId, temp, labels.bgColor, true);
        fields.bgColor = temp.lastElementChild;

        const defaultTemplate = '{width}{height}{verticalAlign}{horizontalAlign}{borderWidth}{borderStyle}{padding}{borderColor}{bgColor}',
            templateId = 'TableDialogCell',
            defaultTemplateId = 'Default' + templateId;

        if (!editor.hasTemplate(templateId))
        {
            editor.addTemplate(defaultTemplateId, defaultTemplate, false);
            editor.applyTemplate(panel, defaultTemplateId, fields);
        }
        else
            editor.applyTemplate(panel, templateId, fields);

        return panel;
    }

    // ── Show / Confirm ────────────────────────────────────────────────────────

    #onShowComplete()
    {
        const { cell, table } = this.#context || {},
            row = cell.closest('tr');

        cell.classList.add(this.#selectedCssClass);

        // make sure all fields in all panels can be detected by box
        this.#settingsViewEl.querySelectorAll(`.${this.#panelCssClass}`).forEach(panel =>
        {
            panel.style.display = '';
        });

        this.#dialog.getBox().update(); // creates focusable field list, first field will be focused after this event

        this.#showCategory('cell');

        if (table)
            this.#loadTableValues(table, cell);

        if (row)
            this.#loadRowValues(row);

        if (cell)
            this.#loadCellValues(cell);

        this.#resetFlags();
    }

    #resetFlags()
    {
        this.#tableChanged = { borderWidth: false, borderStyle: false, borderColor: false };
        this.#rowChanged = { borderStyle: false, borderColor: false };
        this.#cellChanged = { borderWidth: false, borderStyle: false, borderColor: false, padding: false };
    }

    #onConfirm()
    {
        let { cell, table } = this.#context || {},
            row = cell?.closest('tr');

        if (table)
            this.#applyTableValues(table);

        if (row)
            this.#applyRowValues(row, table);

        cell = this.#context.cell; // cell can change if switched to/from header row

        if (cell)
            this.#applyCellValues(cell);

        this.#editor.table.updateContextCell(cell);
        this.#editor.history.addItem();
    }

    // ── Load current values into fields ───────────────────────────────────────

    #loadTableValues(table, cell)
    {
        this.#tableWidth.value = table.style.width || '';
        this.#tableCellSpacing.value = table.style.borderSpacing || '';
        this.#tableCellPadding.value = cell.style.padding || '';
        this.#tableCaption.value = table.querySelector('caption')?.textContent || '';

        if (this.#tableBgColorBtn)
            this.#tableBgColorBtn.setRGBA(...this.#resolveColor(table.style.backgroundColor));

        this.#tableBorderWidth.value = table.style.borderWidth || '';
        this.#tableBorderStyle.setValue(table.style.borderStyle || '');

        if (this.#tableBorderColorBtn)
            this.#tableBorderColorBtn.setRGBA(...this.#resolveColor(table.style.borderColor));

        // Alignment — infer from margin/float
        if (table.style.marginLeft === 'auto' && table.style.marginRight === 'auto')
            this.#tableAlignment.setValue('center');
        else if (table.style.marginLeft === 'auto')
            this.#tableAlignment.setValue('right');
        else if (table.style.float)
            this.#tableAlignment.setValue(table.style.float);
        else
            this.#tableAlignment.setValue('');
    }

    #loadRowValues(row)
    {
        this.#rowIsHeader.checked = row.parentElement?.tagName === 'THEAD';
        this.#rowIsFooter.checked = row.parentElement?.tagName === 'TFOOT';
        this.#rowHeight.value = row.style.height || '';

        if (this.#rowBgColorBtn)
            this.#rowBgColorBtn.setRGBA(...this.#resolveColor(row.style.backgroundColor));

        this.#rowBorderStyle.setValue(row.style.borderStyle || '');

        if (this.#rowBorderColorBtn)
            this.#rowBorderColorBtn.setRGBA(...this.#resolveColor(row.style.borderColor));
    }

    #loadCellValues(cell)
    {
        this.#cellWidth.value = cell.style.width || '';
        this.#cellHeight.value = cell.style.height || '';
        this.#cellBorderWidth.value = cell.style.borderWidth || '';

        this.#cellVerticalAlign.setValue(cell.style.verticalAlign || '');
        this.#cellHorizontalAlign.setValue(cell.style.textAlign || '');
        this.#cellBorderStyle.setValue(cell.style.borderStyle || '');

        if (this.#cellBgColorBtn)
            this.#cellBgColorBtn.setRGBA(...this.#resolveColor(cell.style.backgroundColor));

        if (this.#cellBorderColorBtn)
            this.#cellBorderColorBtn.setRGBA(...this.#resolveColor(cell.style.borderColor));
    }

    // ── Apply values to DOM ───────────────────────────────────────────────────

    #applyTableValues(table)
    {
        // Width
        this.#setStyle(table, 'width', this.#tableWidth.value);

        // Background color
        this.#setStyle(table, 'backgroundColor', this.#colorValue(this.#tableBgColorBtn));

        // Cell spacing
        if (this.#tableCellSpacing.value)
        {
            table.style.borderCollapse = 'separate';
            this.#setStyle(table, 'borderSpacing', $lib.unit(this.#tableCellSpacing.value));
        }
        else
        {
            table.style.borderCollapse = 'collapse';
            table.style.removeProperty('border-spacing');
        }

        // Border — stored on table for read-back
        const borderWidth = this.#tableBorderWidth.value ? $lib.unit(this.#tableBorderWidth.value) : '',
            borderStyle = this.#tableBorderStyle.getValue() || '',
            borderColor = this.#colorValue(this.#tableBorderColorBtn);

        this.#setStyle(table, 'borderWidth', borderWidth);
        this.#setStyle(table, 'borderStyle', borderStyle);
        this.#setStyle(table, 'borderColor', borderColor);

        // Cell padding and border — applied to cells respecting cell-level overrides
        const cellPadding = this.#tableCellPadding.value ? $lib.unit(this.#tableCellPadding.value) : '',
            currentCell = this.#context?.cell;

        table.querySelectorAll('td, th').forEach(cell =>
        {
            const isCurrentCell = cell === currentCell;

            if (this.#tableChanged.borderWidth && (!isCurrentCell || !this.#cellChanged.borderWidth))
                this.#setStyle(cell, 'borderWidth', borderWidth);

            if (this.#tableChanged.borderStyle && (!isCurrentCell || !this.#cellChanged.borderStyle))
                this.#setStyle(cell, 'borderStyle', borderStyle);

            if (this.#tableChanged.borderColor && (!isCurrentCell || !this.#cellChanged.borderColor))
                this.#setStyle(cell, 'borderColor', borderColor);

            this.#setStyle(cell, 'padding', cellPadding);
        });

        // Alignment
        table.style.removeProperty('float');
        table.style.removeProperty('margin-left');
        table.style.removeProperty('margin-right');
        switch (this.#tableAlignment.getValue())
        {
            case 'center': table.style.marginLeft = table.style.marginRight = 'auto'; break;
            case 'right': table.style.marginLeft = 'auto'; break;
            case 'left': table.style.float = 'left'; break;
        }

        // Caption
        let caption = table.querySelector('caption');
        if (this.#tableCaption.value)
        {
            if (!caption)
            {
                caption = table.ownerDocument.createElement('caption');
                table.insertBefore(caption, table.firstChild);
            }
            caption.textContent = this.#tableCaption.value;
        }
        else if (caption)
        {
            caption.remove();
        }
    }

    #applyRowValues(row, table)
    {
        const doc = table.ownerDocument;
        const tbody = table.querySelector('tbody') || this.#ensureSection(table, 'tbody');

        // Header toggle
        if (this.#rowIsHeader.checked && row.parentElement?.tagName !== 'THEAD')
        {
            let thead = table.querySelector('thead');
            if (!thead) { thead = doc.createElement('thead'); table.insertBefore(thead, table.firstChild); }
            this.#convertCells(row, 'TH');
            thead.appendChild(row);
        }
        else if (!this.#rowIsHeader.checked && row.parentElement?.tagName === 'THEAD')
        {
            const thead = row.parentElement;
            this.#convertCells(row, 'TD');
            tbody.insertBefore(row, tbody.firstChild);
            if (!thead.children.length) thead.remove();
        }
        // Footer toggle
        if (this.#rowIsFooter.checked && row.parentElement?.tagName !== 'TFOOT')
        {
            let tfoot = table.querySelector('tfoot');
            if (!tfoot) { tfoot = doc.createElement('tfoot'); table.appendChild(tfoot); }
            this.#convertCells(row, 'TD');
            tfoot.insertBefore(row, tfoot.firstChild);
        }
        else if (!this.#rowIsFooter.checked && row.parentElement?.tagName === 'TFOOT')
        {
            const tfoot = row.parentElement;
            tbody.appendChild(row);
            this.#convertCells(row, 'TD');
            if (!tfoot.children.length) tfoot.remove();
        }

        this.#setStyle(row, 'height', this.#rowHeight.value ? $lib.unit(this.#rowHeight.value) : '');
        this.#setStyle(row, 'backgroundColor', this.#colorValue(this.#rowBgColorBtn));

        // Row border — applied to row and its cells respecting cell-level overrides
        const borderStyle = this.#rowBorderStyle.getValue() || '',
            borderColor = this.#colorValue(this.#rowBorderColorBtn),
            currentCell = this.#context?.cell;

        if (this.#rowChanged.borderStyle)
            this.#setStyle(row, 'borderStyle', borderStyle);

        if (this.#rowChanged.borderColor)
            this.#setStyle(row, 'borderColor', borderColor);

        row.querySelectorAll('td, th').forEach(cell =>
        {
            const isCurrentCell = cell === currentCell;

            if (this.#rowChanged.borderStyle && (!isCurrentCell || !this.#cellChanged.borderStyle))
                this.#setStyle(cell, 'borderStyle', borderStyle);

            if (this.#rowChanged.borderColor && (!isCurrentCell || !this.#cellChanged.borderColor))
                this.#setStyle(cell, 'borderColor', borderColor);
        });
    }

    #applyCellValues(cell)
    {
        this.#setStyle(cell, 'width', this.#cellWidth.value ? $lib.unit(this.#cellWidth.value) : '');
        this.#setStyle(cell, 'height', this.#cellHeight.value ? $lib.unit(this.#cellHeight.value) : '');
        this.#setStyle(cell, 'verticalAlign', this.#cellVerticalAlign.getValue());
        this.#setStyle(cell, 'textAlign', this.#cellHorizontalAlign.getValue());
        this.#setStyle(cell, 'backgroundColor', this.#colorValue(this.#cellBgColorBtn));

        if (this.#cellChanged.borderWidth)
            this.#setStyle(cell, 'borderWidth', this.#cellBorderWidth.value ? $lib.unit(this.#cellBorderWidth.value) : '');

        if (this.#cellChanged.borderStyle)
            this.#setStyle(cell, 'borderStyle', this.#cellBorderStyle.getValue());

        if (this.#cellChanged.borderColor)
            this.#setStyle(cell, 'borderColor', this.#colorValue(this.#cellBorderColorBtn));

    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    #convertCells(row, tagName)
    {
        const doc = row.ownerDocument,
            { cell, table } = this.#context || {};

        for (const c of [...row.cells])
        {
            if (c.nodeName !== tagName)
            {
                const newCell = doc.createElement(tagName);
                newCell.innerHTML = c.innerHTML;
                for (const attr of c.attributes)
                    newCell.setAttribute(attr.name, attr.value);

                c.replaceWith(newCell);

                if (c === cell)
                    this.#context.cell = newCell;
            }
        }
    }

    #colorValue(btn)
    {
        const value = btn?.getValue();
        if (!value)
            return '';

        return `rgba(${value})`;
    }

    #setStyle(el, prop, value)
    {
        if (value)
            el.style[prop] = value;
        else
            el.style.removeProperty(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
    }

    #createPanel(category)
    {
        const panel = $lib.element({ attrs: { 'data-category': category, class: this.#panelCssClass } });
        panel.style.display = 'none';
        return panel;
    }

    #createComboBox(id, cloneId, options, onChanged = null)
    {
        const itemList = [];

        $lib.each(options, opt =>
        {
            itemList.push({ id: opt.value, value: opt.value, text: opt.text });
        });

        const combo = this.#cf.createComboBox(id, cloneId, null, { itemList });

        if (onChanged)
        {
            combo.events.onItemSelect.priorityAdd(onChanged);
            combo.events.onItemDeselect.priorityAdd(onChanged);
        }

        return combo;
    }

    #createColorButton(id, formfieldCloneId, cloneId, container, label, halfField = false, onChanged = null)
    {
        const editor = this.#editor,
            cf = this.#cf;

        const colorButton = cf.createColorButton(id, cloneId, container,
            {
                command: () =>
                {
                    const swatchBox = cf.colorSwatchBox;
                    if (!swatchBox)
                        return;

                    if (swatchBox.showing)
                    {
                        // Second call — swatch confirmed a color, __color was set by #selectSwatchColor
                        const button = colorButton.getButton();

                        if (!button.__color)
                            colorButton.setRGBA(255, 0, 0, 0);
                        else
                            colorButton.setRGBA(...this.#resolveColor(button.__color));

                        if (onChanged)
                            onChanged();
                    }
                    else
                    {
                        // First call — register as active target and open swatch
                        cf.setActiveExpandButton(colorButton.getButton());
                        swatchBox.expander = colorButton.element;
                        swatchBox.show();
                    }
                }
            });

        cf.createFormField('fld_' + id, formfieldCloneId, container, { label, field: colorButton.element, cssClass: halfField ? this.#fieldHalfCssClass : undefined });

        return colorButton;
    }

    #resolveColor(value)
    {
        if (!value)
            return [255, 0, 0, 0]; // alpha 0 = no color

        const temp = $lib.element({ container: document.body });
        temp.style.color = value;
        const computed = getComputedStyle(temp).color; // "rgb(r, g, b)" or "rgba(r, g, b, a)"
        temp.remove();
        return computed.match(/[\d.]+/g);
    }

    #ensureSection(table, tag)
    {
        let section = table.querySelector(tag);
        if (!section)
        {
            section = table.ownerDocument.createElement(tag);
            const tfoot = table.querySelector('tfoot');
            tag === 'tbody' && tfoot ? table.insertBefore(section, tfoot) : table.appendChild(section);
        }
        return section;
    }

    #getId(id) { return this.utility.getId(id); }
};

export default componyx.UI.editor_modules.TableDialog;