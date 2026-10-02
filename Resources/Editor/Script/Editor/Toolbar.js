/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * Toolbar module — builds the editor toolbar, manages the toolbar box (floating/footer
 * display modes), the "more" overflow box, symbol pickers, and box-hiding logic.
 * @class Toolbar
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.Toolbar = class Toolbar
{
    #toolbarEl = null;   // The toolbar <div>
    #toolbarBox = null;   // Floating Box component (for externalEditable / caret mode)
    #toolbarMoreBox = null;   // "More" overflow Box
    #toolbarBoxTimerId = null;

    #emojiPicker = null;     // SymbolPicker instance
    #specialPicker = null;     // SymbolPicker instance

    constructor(editor)
    {
        this.editor = editor;
        this.cf = editor.componentFactory;
    }

    /** The root toolbar DOM element. */
    get element() { return this.#toolbarEl; }

    /** The emoji SymbolPicker instance (may be null). */
    get emojiPicker() { return this.#emojiPicker; }

    /** Returns true if the floating toolbar box is currently showing. */
    get toolbarBoxShowing() { return this.#toolbarBox?.showing ?? false; }

    /** The special-character SymbolPicker instance (may be null). */
    get specialPicker() { return this.#specialPicker; }

    /**
     * Creates the toolbar DOM element and all its buttons.
     * Must be called during draw().
     */
    createToolbar()
    {
        const editor = this.editor,
            cf = editor.componentFactory,
            co = editor.classOption,
            commands = editor.commands,
            sorted = editor.getSortedCommands();

        this.#toolbarEl = editor.element.appendChild($lib.element());
        this.#toolbarEl.className = editor.getCssClass(co.TOOLBAR);

        // Populate & sort the shared sorted-commands array
        $lib.each(commands, (cmd, key) =>
        {
            cmd.id = cmd.id || key;
            cmd.name = key;
            cmd.tooltip = editor.labels[`${cmd.name}CommandTooltip`] || cmd.tooltip;
            sorted.push(cmd);

            if (cmd.selector && !editor.selectableNodes.includes(cmd.selector))
                editor.selectableNodes.push(cmd.selector); // the selector defines if elements created with this command are selectable
        });

        sorted.sort((a, b) =>
        {
            if (a.group < b.group) return -1;
            if (a.group > b.group) return 1;
            if (a.position < b.position) return -1;
            if (a.position > b.position) return 1;
            return 0;
        });

        let prevGroup, container, target = this.#toolbarEl;

        $lib.each(sorted, (cmd) =>
        {
            if (!cmd.show)
                return;

            if (prevGroup !== cmd.group)
            {
                prevGroup = cmd.group;
                container = $lib.element(target, '', '', '', '', { className: editor.getCssClass(co.GROUP) });
            }

            cf.createButton(cmd.id, cmd.buttonId, container, cmd);

            if (cmd.id === 'more')
                target = this.#createMoreBox();
        });

        // Undo/redo start disabled
        const getId = (id) => editor.utility.getId(id);
        $UI.store[getId('undo')]?.disable();
        $UI.store[getId('redo')]?.disable();

        return this.#toolbarEl;
    }

    /**
     * Creates the floating toolbar Box (used in caret / externalEditable mode).
     */
    createToolbarBox()
    {
        const editor = this.editor;

        this.#toolbarBox = this.cf.createBox('Toolbar', editor.toolbarBoxId, editor.element, { cssClass: editor.getCssClass(editor.classOption.TOOLBAR_BOX), content: this.#toolbarEl });
        this.#toolbarBox.render();

        $lib.on(this.#toolbarBox.element, 'pointerdown', () => { editor.allowToolbarBoxHide = false; });
    }

    /**
     * Builds the emoji symbol picker.
     */
    async createEmojiSymbolPicker()
    {
        const editor = this.editor;
        let path = editor.emojiSymbolResourcePath;

        if (!editor.emojiSymbolData && !path)
            return;

        if (!editor.emojiSymbolData)
            editor.emojiSymbolData = await editor.utility.fetchData(path);

        this.#emojiPicker = new componyx.UI.editor_modules.SymbolPicker(
            editor,
            editor.emojiSymbolPickerBoxId,
            'EmojiSymbolPicker',
            editor.getCssClass(editor.classOption.EMOJI_SYMBOL_PICKER),
            editor.labels.emojiSymbolCategories,
            editor.emojiSymbolData
        );
    }

    /**
     * Builds the special-character symbol picker.
     */
    async createSpecialSymbolPicker()
    {
        const editor = this.editor;
        let path = editor.specialSymbolResourcePath;

        if (!editor.specialSymbolData && !path)
            return;

        if (!editor.specialSymbolData)
            editor.specialSymbolData = await editor.utility.fetchData(path);

        this.#specialPicker = new componyx.UI.editor_modules.SymbolPicker(
            editor,
            editor.specialSymbolPickerBoxId,
            'SpecialSymbolPicker',
            editor.getCssClass(editor.classOption.SPECIAL_SYMBOL_PICKER),
            editor.labels.specialSymbolCategories,
            editor.specialSymbolData
        );
    }

    /**
     * Schedules showing or hiding the toolbar box.
     * @param {boolean} [show=true]
     */
    setToolbarBoxDisplay(show = true)
    {
        const editor = this.editor,
            isFullscreen = editor.element.className.includes(' fullscreen');

        if (!this.#toolbarBox || editor.renderState !== 2 || (!show && isFullscreen))
            return;

        if (!editor.allowToolbarBoxHide && !show)
        {
            editor.allowToolbarBoxHide = true;
            return;
        }

        clearTimeout(this.#toolbarBoxTimerId);
        this.#toolbarBoxTimerId = setTimeout(() =>
        {
            if (show)
                this.#showToolbarBox();
            else
                this.#toolbarBox.hide();
        }, 0);
    }

    /**
     * Enables or disables all visible toolbar buttons (with optional exclusions).
     * @param {boolean}  enable
     * @param {string[]} [exclude=[]]  Command ids to leave unchanged.
     */
    setButtonState(enable, exclude = [])
    {
        const editor = this.editor,
            getId = (id) => editor.utility.getId(id);

        $lib.each(editor.getSortedCommands(), (cmd) =>
        {
            if (!cmd.show || exclude.includes(cmd.id))
                return;

            const button = $UI.store[getId(cmd.id)];

            if (!button) return;

            if (enable && button.disabled)
                button.enable();
            else if (!enable && !button.disabled)
                button.disable();
        });
    }

    /**
     * Hides all open overlay boxes (color swatch, symbol pickers, more box)
     * that should close when the user interacts elsewhere.
     * @param {Event} e
     */
    hideBoxes(e)
    {
        const editor = this.editor,
            target = e.target,
            getId = (id) => editor.utility.getId(id),
            cmds = editor.commands,
            fontColor = cmds.fontColor,
            fontBGColor = cmds.fontBGColor,
            emoji = cmds.emoji,
            special = cmds.special,
            cf = editor.componentFactory,
            colorSwatchBox = cf.colorSwatchBox,
            colorPicker = cf.colorPicker,
            tablePickerBox = editor.table.pickerBox,
            swatchShowing = colorSwatchBox?.showing,
            emojiShowing = this.#emojiPicker?.box.showing,
            specialShowing = this.#specialPicker?.box.showing,
            moreEl = this.#toolbarMoreBox?.element;

        const toolbarMoreIsActive =
            (swatchShowing && fontColor && moreEl?.contains($UI.store[getId(fontColor.id)]?.element)) ||
            (swatchShowing && fontBGColor && moreEl?.contains($UI.store[getId(fontBGColor.id)]?.element)) ||
            (emojiShowing && emoji && moreEl?.contains($UI.store[getId(emoji.id)]?.element)) ||
            (specialShowing && special && moreEl?.contains($UI.store[getId(special.id)]?.element));

        if (this.#allowHide(target, [colorSwatchBox?.element, colorPicker?.element]))
            colorSwatchBox?.hide();

        if (this.#emojiPicker && this.#allowHide(target, [this.#emojiPicker.box.element]))
            this.#emojiPicker.box.hide();

        if (this.#specialPicker && this.#allowHide(target, [this.#specialPicker.box.element]))
            this.#specialPicker.box.hide();

        if (tablePickerBox && this.#allowHide(target, [tablePickerBox.element]))
            tablePickerBox.hide();

        if (this.#toolbarMoreBox && !toolbarMoreIsActive && this.#allowHide(target, [moreEl]))
        {
            this.#toolbarMoreBox.hide();
            $UI.store[getId('more')]?.deselect();
        }
    }

    /**
     * Opens the special-character picker anchored to its toolbar button.
     * @param {Object} cmd  The command settings object.
     */
    showSpecialSymbolPicker(cmd) { this.#specialPicker?.show(cmd); }

    /**
     * Opens the emoji picker anchored to its toolbar button.
     * @param {Object} cmd  The command settings object.
     */
    showEmojiSymbolPicker(cmd) { this.#emojiPicker?.show(cmd); }

    /**
     * Creates the "more" overflow Box and returns the content container element.
     * @returns {HTMLElement}
     */
    #createMoreBox()
    {
        const editor = this.editor,
            content = $lib.element();

        this.#toolbarMoreBox = this.cf.createBox('ToolbarMore', editor.toolbarMoreBoxId, editor.element, { cssClass: editor.getCssClass(editor.classOption.TOOLBAR_MORE), content });
        this.#toolbarMoreBox.render();

        return content;
    }

    /**
     * Positions and shows the floating toolbar box based on display mode and caret position.
     */
    #showToolbarBox()
    {
        const editor = this.editor,
            sr = editor.selectionRange,
            editableEl = editor.getEditorElement(),
            boxOptions = componyx.UI.Box,
            isFullscreen = editor.element.className.includes(' fullscreen'),
            toolbarDisplay = editor.getToolbarDisplay(editableEl),
            tdOption = componyx.UI.Editor.ToolbarDisplayOption,
            width = editableEl.offsetWidth / 3;

        this.#toolbarBox.expander = editableEl;
        this.#toolbarBox.alignX = null;
        this.#toolbarBox.expandDirection = boxOptions.ExpandDirectionOption.UP;

        if (!isFullscreen && toolbarDisplay === tdOption.CARET)
        {
            const range = sr.getRange();

            if (range.collapsed)
                return;

            const rect = this.#getCaretCoordinates();

            this.#toolbarBox.expander = sr.getRootNodesInRange(range)[0];
            this.#toolbarBox.alignX = boxOptions.AlignXOption.CENTER;

            if (rect.x <= width)
                this.#toolbarBox.alignX = boxOptions.AlignXOption.LEFT;
            else if (rect.x > width * 2)
                this.#toolbarBox.alignX = boxOptions.AlignXOption.RIGHT;
        }
        else if (toolbarDisplay === tdOption.HEADER || toolbarDisplay === tdOption.CARET)
            this.#toolbarBox.expandDirection = boxOptions.ExpandDirectionOption.UP;
        else
            this.#toolbarBox.expandDirection = boxOptions.ExpandDirectionOption.DOWN;

        this.#toolbarBox.update(null, true);
    }

    /**
     * Gets the {x, y} screen coordinates of the caret.
     * @returns {{ x: number, y: number }}
     */
    #getCaretCoordinates()
    {
        const range = this.editor.selectionRange.getRange().cloneRange();
        range.collapse(true);

        const rect = range.getClientRects()[0];
        return rect ? { x: rect.left, y: rect.top } : { x: 0, y: 0 };
    }

    /**
     * Returns true when it is safe to hide a box (i.e. the active element is not
     * inside any of the provided elements).
     * @param {Element} activeEl
     * @param {Array<Element|undefined>} elements
     * @returns {boolean}
     */
    #allowHide(activeEl, elements)
    {
        if (!activeEl)
            return true;

        let allow = true;

        $lib.each(elements, (el) =>
        {
            if (!el) return;
            return (allow = activeEl !== el && !el.contains(activeEl));
        });

        return allow;
    }
};

export default componyx.UI.editor_modules.Toolbar;