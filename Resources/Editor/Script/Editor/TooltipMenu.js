/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * TooltipMenu module - manages the contextual tooltip that appears on link, image and media selection.
 * @class TooltipMenu
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.TooltipMenu = class TooltipMenu
{
    #tooltipId = null;
    #menu = { link: null, editButton: null, removeButton: null };

    constructor(editor)
    {
        this.editor = editor;
        this.utility = editor.utility;
        this.tooltipManager = editor.componentFactory.createTooltipManager('documentTooltipManager', editor.documentTooltipManagerId, editor.element, { cssClass: editor.getCssClass(editor.classOption.DOC_TOOLTIPS), showOnPointerEvent: 0 });
    }

    show(node)
    {
        const layout = this.editor.layoutState.activeLayout,
            menu = this.#menu;

        // Show tooltip only when a supported layout is active.
        if (!layout.link && !layout.image && !layout.media)
            return;

        if (!menu.link)
            this.#create();

        // Show link only when editing a hyperlink.
        menu.link.style.display = 'none';

        if (layout.link?.href)
        {
            menu.link.style.display = '';
            menu.link.href = layout.link.href;
            menu.link.textContent = layout.link.href;
        }

        this.tooltipManager.addTrigger(node, this.#tooltipId);
        this.tooltipManager.showTooltip(node);
    }

    dispose()
    {
        this.tooltipManager?.destroy();
        this.tooltipManager = null;
    }

    #create()
    {
        const content = $lib.element();

        this.#tooltipId = this.utility.getId('selectedNode');

        this.#buildMenu(content);

        $lib.on(content, 'pointerdown', () =>
        {
            this.editor.allowToolbarBoxHide = false;
        });

        this.tooltipManager.addTooltip(this.#tooltipId, content, false);
    }

    #buildMenu(content)
    {
        const templateId = 'TooltipMenu',
            buttonCss = `${this.utility.buttonLucentCss} ${this.editor.getThemeCSS()}`,
            linkCss = this.editor.getCssClass(this.editor.classOption.TOOLTIP_MENU_LINK),
            values =
            {
                link: `<a class="${linkCss}" target="_blank">`,
                editButton: `<a class="${buttonCss} edit ico-pencil">`,
                removeButton: `<a class="${buttonCss} remove ico-bin">`
            };

        values['/link'] = values['/editButton'] = values['/removeButton'] = '</a>';

        if (!this.editor.hasTemplate(templateId))
            this.editor.addTemplate(templateId, '{link}{/link}{editButton}{/editButton}{removeButton}{/removeButton}', true);

        this.editor.applyTemplate(content, templateId, values);

        const menu = this.#menu;

        menu.link = content.querySelector(`a.${linkCss.replaceAll(' ', '.')}`);
        menu.editButton = content.querySelector(`a.${buttonCss.replaceAll(' ', '.')}.edit`);
        menu.removeButton = content.querySelector(`a.${buttonCss.replaceAll(' ', '.')}.remove`);

        menu.editButton.onclick = () =>
        {
            const layout = this.editor.layoutState.activeLayout;

            if (layout.link)
                this.editor.insertLink();
            else if (layout.image)
                this.editor.insertImage();
            else if (layout.media)
                this.editor.insertMedia();
        };

        menu.removeButton.onclick = () =>
        {
            const layout = this.editor.layoutState.activeLayout;

            this.tooltipManager.hideAllTooltips(true);

            if (layout.link)
                this.editor.removeLink();
            else if (layout.image)
                this.editor.removeImage();
            else if (layout.media)
                this.editor.removeMedia();
        };
    }
};

export default componyx.UI.editor_modules.TooltipMenu;