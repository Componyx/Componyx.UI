/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * SymbolPicker module — builds and manages a categorised symbol/emoji picker box.
 * One instance is created for emoji symbols and one for special characters.
 *
 * @class SymbolPicker
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.SymbolPicker = class SymbolPicker
{
    /**
     * @param {componyx.UI.Editor} editor        The editor instance.
     * @param {string}  cloneId                     Id of the base Box component to clone from.
     * @param {string}  id                          Id that will be given to the new Box.
     * @param {string}  pickerCssClass              Extra CSS class for the picker box.
     * @param {string[]} catLabels                  Display labels for every category (index 0 = "All").
     * @param {Array}   symbols                     Category data: [{name, values:[{value, name}]}].
     */
    constructor(editor, cloneId, id, pickerCssClass, catLabels, symbols)
    {
        this.editor = editor;
        this.cf = editor.componentFactory;
        this.symbols = symbols;
        this.selectedCategory = undefined;
        this.searchFilter = '';

        this.categoriesEl = null;
        this.symbolViewEl = null;
        this.headerEl = null;
        this.searchEl = null;
        this.symbolsEl = null;
        this.footerEl = null;
        this.nameEl = null;

        this.box = this.#createBox(id, cloneId, pickerCssClass, catLabels, symbols);
    }

    /**
     * Shows the picker box anchored to the toolbar button for the given command.
     * @param {Object} cmd  The command settings object (must have an `id` property).
     */
    show(cmd)
    {
        const button = $UI.store[this.editor.utility.getId(cmd.id)];
        this.box.expander = button.element;
        this.box.show();
    }

    /**
     * Builds the DOM and Box component.
     */
    #createBox(id, cloneId, pickerCssClass, catLabels, symbols)
    {
        const editor = this.editor,
            co = editor.classOption;

        this.categoriesEl = $lib.element('', '', '', '', { class: editor.getCssClass(co.SYMBOL_CATEGORIES) });
        this.symbolViewEl = $lib.element('', '', '', '', { class: editor.getCssClass(co.SYMBOL_VIEW) });
        this.headerEl = $lib.element(this.symbolViewEl, '', 'header', '', { class: editor.getCssClass(co.SYMBOL_HEADER) });

        this.searchEl = $lib.element(
            this.headerEl, '', 'input', '',
            { type: 'text', placeholder: editor.labels.symbolSearchInputPlaceholder },
            {
                onfocus: () => { editor.eventManager.disposeEvents(); },
                onblur: () => { editor.eventManager.bindEvents(); },
                oninput: this.#renderCategory.bind(this)
            }
        );

        this.symbolsEl = $lib.element(this.symbolViewEl, '', '', '', { class: editor.getCssClass(co.SYMBOL_ITEMS) });
        this.footerEl = $lib.element(this.symbolViewEl, '', 'footer', '', { class: editor.getCssClass(co.SYMBOL_FOOTER) });
        this.nameEl = $lib.element(this.footerEl, '', 'span');

        // "All" category link
        $lib.element(this.categoriesEl, '', 'a', catLabels[0], { class: editor.getCssClass(co.SYMBOL_CATEGORY) }, { onclick: this.#selectCategory.bind(this, null) });

        // Per-category links
        $lib.each(symbols, (cat, index) =>
        {
            $lib.element(this.categoriesEl, '', 'a', catLabels[index + 1] || cat.name, { class: editor.getCssClass(co.SYMBOL_CATEGORY) }, { onclick: this.#selectCategory.bind(this, index) });
        });

        const cssClass = editor.getCssClass(co.SYMBOL_PICKER_BOX) + ' ' + pickerCssClass;
        const box = this.cf.createBox(id, cloneId, editor.element, { cssClass: cssClass, content: [this.categoriesEl, this.symbolViewEl] });
        box.animation.showType = box.animation.hideType = 0;
        box.events.onShowComplete.priorityAdd(() => { this.#onShow(); });
        box.events.onHideComplete.priorityAdd(() => { this.#onHide(); });

        box.render();
        return box;
    }

    /**
 * Selects a category index (null = all) and re-renders the symbol grid.
 * @param {number|null} cat
 */
    #selectCategory(cat)
    {
        if (cat === undefined)
            this.selectedCategory = cat = null;
        else if (cat === this.selectedCategory && this.searchFilter === this.searchEl.value)
            return;

        this.selectedCategory = cat;
        this.#renderCategory();
        this.#updateActiveCategory();
    }

    #updateActiveCategory()
    {
        const activeCssClass = this.editor.getCssClass(this.editor.classOption.ACTIVE);
        const catCssClass = this.editor.getCssClass(this.editor.classOption.SYMBOL_CATEGORY);
        const index = this.selectedCategory === null ? 0 : this.selectedCategory + 1;

        this.categoriesEl.querySelectorAll(`.${catCssClass}`).forEach((el, i) =>
            el.classList.toggle(activeCssClass, i === index));
    }

    /**
     * (Re-)renders the symbol grid, applying the current category filter and search term.
     */
    #renderCategory()
    {
        const selCat = this.selectedCategory,
            co = this.editor.classOption;

        this.searchFilter = this.searchEl.value.toLowerCase();
        this.symbolsEl.innerHTML = '';

        $lib.each(this.symbols, (cat, index) =>
        {
            if (selCat != null && selCat !== index)
                return;

            $lib.each(cat.values, (symbol) =>
            {
                if (!this.searchFilter || (symbol.name || '').toLowerCase().includes(this.searchFilter))
                {
                    $lib.element(
                        this.symbolsEl, '', 'a', symbol.value,
                        { class: this.editor.getCssClass(co.SYMBOL), title: symbol.name },
                        {
                            onpointerover: this.#showInfo.bind(this, symbol),
                            onfocus: this.#showInfo.bind(this, symbol),
                            onclick: this.#selectSymbol.bind(this, symbol)
                        }
                    );
                }
            });

            if (selCat != null)
                return false; // stop after the selected category
        });
    }

    #onShow()
    {
        const sr = this.editor.selectionRange;
        this.editor.storeRange(sr.ensureTextRange(sr.getRange()).cloneRange());
        this.searchEl.value = '';
        this.#selectCategory(this.selectedCategory);
    }

    #onHide()
    {
        const stored = this.editor.getStoredRange(),
            current = this.editor.selectionRange.getRange();

        if (stored !== current)
            this.editor.selectionRange.restoreRange(stored);

        setTimeout(() => { this.editor.getEditorElement().focus(); }, 0);
    }

    #showInfo(symbol)
    {
        this.nameEl.textContent = symbol.name;
    }

    #selectSymbol(symbol, e)
    {
        const editor = this.editor;

        editor.activateDocument();

        if (!editor.contentManager.hasContent())
            editor.contentManager.insertParagraph();

        const node = editor.getDoc().createTextNode(symbol.value);

        editor.contentManager.insertHTML({ node });

        const sr = editor.selectionRange,
            range = sr.ensureTextRange(sr.getRange());

        editor.storeRange(range);
        this.box.hide();
        editor.toolbar.hideBoxes(e);
    }
};

export default componyx.UI.editor_modules.SymbolPicker;