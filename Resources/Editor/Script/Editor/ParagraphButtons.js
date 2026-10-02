/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * ParagraphButtons module - manages the before/after paragraph insert buttons.
 * @class ParagraphButtons
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.ParagraphButtons = class ParagraphButtons
{
    #buttons = new Map();

    constructor(editor)
    {
        this.editor = editor;
        this.utility = editor.utility;
    }

    show(editableElement, node)
    {
        let buttons = this.#buttons.get(editableElement),
            container = node.nodeName.match(this.utility.voidNodeRegEx) ? node.parentNode : node,
            scrollValues = this.utility.saveScroll(editableElement);

        if (!buttons)
            buttons = this.#create(editableElement);

        let before = buttons.before,
            after = buttons.after;

        before.remove();
        after.remove();

        container.appendChild(before);
        container.appendChild(after);

        let pos = $lib.getPos(node);
        after.style.display = before.style.display = '';

        $lib.setPos(before, { top: pos.top - (before.offsetHeight / 2), left: pos.left }, true);
        $lib.setPos(after, { top: pos.bottom - (after.offsetHeight / 2), left: pos.right - (after.offsetWidth / 2) }, true);

        this.utility.resetScroll(editableElement, scrollValues);
    }

    hide()
    {
        for (let [key, value] of this.#buttons)
        {
            value.before.style.display = value.after.style.display = 'none';
        }
    }

    destroy(editableElement)
    {
        const paragraphCssClass = `a.button.${this.editor.getCssClass(this.editor.classOption.PARAGRAPH)}`;
        editableElement.querySelectorAll(`${paragraphCssClass}`).forEach(el => el.remove());
        this.#buttons = new Map();
    }

    #create(editableElement)
    {
        let cssClass = `${this.utility.buttonCss} ${this.editor.getThemeCSS()} ${this.editor.getCssClass(this.editor.classOption.PARAGRAPH)}`,
            before = this.#createButton(editableElement, { className: cssClass + ' before' }),
            after = this.#createButton(editableElement, { className: cssClass + ' after' }),
            buttons = { before, after };

        before.onclick = this.#insert.bind(this, before, true);
        after.onclick = this.#insert.bind(this, after, false);

        before.contentEditable = false;
        after.contentEditable = false;

        this.#buttons.set(editableElement, buttons);
        return buttons;
    }

    #createButton(container, props)
    {
        return $lib.element(container, '', 'a', '', '', props);
    }

	#insert(node, before, e)
	{
		this.editor.activateDocument();

		let rootNode = this.editor.nodeManager.getRootNode(node, false),
			p = $lib.element('', '', 'p', $lib.element('', '', 'br'));

		if (before)
			rootNode.parentNode.insertBefore(p, rootNode);
		else
		{
			if (rootNode.nextElementSibling)
				rootNode.parentNode.insertBefore(p, rootNode.nextElementSibling);
			else
				rootNode.parentNode.appendChild(p);
		}

		this.editor.contentManager.setBlockAttr(p);

		let sel = this.editor.selectionRange.getSelection(),
			range = this.editor.selectionRange.getRange();

		range.selectNode(p.firstChild);
		range.collapse(true);

		sel.removeAllRanges();
		sel.addRange(range);

		e.preventDefault();
		e.stopPropagation();

		this.editor.history.addItem();
		this.editor.deactivateDocument();
	}
};

export default componyx.UI.editor_modules.ParagraphButtons;