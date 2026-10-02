/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * MenuManager module - menu and toolbar operations.
 * @class MenuManager
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.MenuManager = class MenuManager
{
    constructor(editor)
    {
        this.editor = editor;
        this.cf = editor.componentFactory;
        this.utility = editor.utility;
        this.menu = null;
        this.defaultMenuButton = null;
    }

    /**
     * Loads a menu item
     * @param {string} menuItemId
     */
    loadMenuItem(menuItemId)
    {
        return this.menu.loadItem(menuItemId);
    }

    /**
     * Renders a menu item
     * @param {string} itemId
     */
    renderMenuItem(itemId)
    {
        let itemPath = this.loadMenuItem(itemId);
        if (itemPath)
            this.menu.renderItem(itemPath.item);
    }

    /**
     * Selects a menu item
     * @param {string} menuItemId
     */
    selectMenuItem(menuItemId)
    {
        this.menu.selectItem(menuItemId);
    }

    /**
     * Deselects a menu item
     * @param {string} menuItemId
     */
    deselectMenuItem(menuItemId)
    {
        this.menu.deselectItem(menuItemId);
    }

    /**
     * Gets selected item id
     * @param {string} groupId
     */
    getSelectedItemId(groupId)
    {
        return this.menu.getSelectedItemId(groupId);
    }

    /**
     * Gets the menu
     */
    getMenu()
    {
        return this.menu;
    }

    /** Creates the menu. */
    async createMenu()
    {
        this.menu = this.cf.createMenu('Menu', this.editor.menuId, this.editor.element);

        let list = this.menu.itemList;

        this.#createDefaultMenuButton();
        list.push(this.#createMenuItem({ id: 'Block' }));
        list.push(this.#createMenuItem({ id: 'FontFamily' }))
        list.push(this.#createMenuItem({ id: 'FontSize' }));
        list.push(this.#createMenuItem({ id: 'Style' }));
        list.push(this.#createMenuItem({ id: 'Align' }));
        list.push(this.#createMenuItem({ id: 'LineHeight' }));
        list.push(this.#createMenuItem({ id: 'OrderedList', cssClassItemGroup: 'item-group box ordered-list' }));
        list.push(this.#createMenuItem({ id: 'UnorderedList', cssClassItemGroup: 'item-group box unordered-list' }));

        this.#buildBlockMenu();
        this.buildFontSizeMenu(this.editor.fontSizes);
        this.#buildStyleMenu();
        this.#buildAlignMenu();
        this.#buildLineHeightMenu();
        this.#buildListItemMenu(this.menu.itemList[6], 'OL', this.editor.orderedList);
        this.#buildListItemMenu(this.menu.itemList[7], 'UL', this.editor.unorderedList);
        await this.#buildFontFamilyMenu();

    }

    /**
     * Builds the font size menu
     * @param {string[]} fontSizes
     */
    buildFontSizeMenu(fontSizes)
    {
        let lastUnit,
            rootItem = this.menu.itemList[2],
            cat = 'fontSize';

        if (!rootItem.itemList.length)
            rootItem.itemList.push(this.#createDefaultMenuItem(cat, this.editor.setFontSize.bind(this.editor, null)));

        $lib.each(fontSizes, (f) =>
        {
            let unit = f.replace(/([^\d])/g, '');
            let item = {
                id: `${cat}_${f}`,
                value: f,
                text: f,
                command: this.editor.setFontSize.bind(this.editor, f),
                radioGroupId: cat
            };

            if (lastUnit && unit != lastUnit)
                item.cssClass = 'first-type';

            rootItem.itemList.push(this.#createMenuItem(item));
            lastUnit = unit;
        });

        rootItem.itemList.sort((a, b) =>
        {
            return parseFloat(a.value) - parseFloat(b.value)
        });
    }

    /** Creates the default menu button. */
    #createDefaultMenuButton()
    {
        this.defaultMenuButton = $UI.createComponent(componyx.UI.Button, {
            id: this.utility.getId('DefaultMenuButton'),
            primary: false
        });
    }

    /**
     * Creates a default menu item
     * @param {string} cat
     * @param {Function} command
     */
    #createDefaultMenuItem(cat, command)
    {
        return this.#createMenuItem({
            id: `${cat}_Default`,
            text: this.editor.labels.default,
            radioGroupId: cat,
            command: command
        });
    }

    /**
     * Creates a menu item.
     * @param {Object} props
     */
    #createMenuItem(props)
    {
        props.type = 2; // radio button type

        if (!props.buttonId)
            props.buttonId = this.defaultMenuButton.id;

        return new componyx.UI.Menu.Item(props);
    }

    /** Builds the block menu. */
    #buildBlockMenu()
    {
        let item = this.menu.itemList[0],
            groupId = 'block',
            fn = (id, text, templateId, command, groupId) =>
            {
                return this.#createMenuItem({
                    id: groupId + '_' + id,
                    value: id,
                    text: (this.editor.labels[id]) ? this.editor.labels[id] : text,
                    templateId: templateId,
                    command: command,
                    radioGroupId: groupId
                });
            };

        for (let i = 1; i < 7; ++i) // add headings
        {
            let id = `H${i}`;
            item.itemList.push(fn(id, `Heading ${i}`, id + '_Template', this.editor.setBlock.bind(this.editor, `h${i}`, null), groupId));
            this.menu.addTemplate(id + '_Template', `<h${i}>{text}</h${i}>`);
        }

        item.itemList.push(fn('P', `Paragraph`, 'Paragraph_Template', this.editor.setBlock.bind(this.editor, 'p', null), groupId));
        this.menu.addTemplate('Paragraph_Template', `<p>{text}</p>`);

        item.itemList.push(fn('PRE', `Pre`, 'Pre_Template', this.editor.setBlock.bind(this.editor, 'pre', null), groupId));
        this.menu.addTemplate('Pre_Template', `<pre>{text}</pre>`);
    }

    /** Builds the font family menu. */
    async #buildFontFamilyMenu()
    {
        let docFonts = document.fonts;
        await docFonts.ready;
        let seen = new Set();

        const fonts = [];

        if (this.editor.detectFonts)
        {
            docFonts.forEach((f) =>
            {
                let family = f.family;

                if (!seen.has(family))
                {
                    fonts.push(family);
                    seen.add(family);
                }
            });
        }

        if (this.editor.includeWebSafeFonts)
        {
            let webFonts = this.utility.webFonts;

            $lib.each(webFonts, (f) =>
            {
                if (!seen.has(f) && docFonts.check(`12px "${f}"`))
                {
                    fonts.push(f);
                    seen.add(f);
                }
            });
        }

        $lib.each(this.editor.fonts, (f) =>
        {
            if (!seen.has(f))
            {
                fonts.push(f);
                seen.add(f);
            }
        });

        $lib.each(this.editor.excludeFonts, (f) =>
        {
            if (seen.has(f))
            {
                let index = fonts.indexOf(f);
                if (index > -1)
                    fonts.splice(index, 1);
            }
        });

        let rootItem = this.menu.itemList[1],
            cat = 'fontFamily';

        rootItem.itemList.push(this.#createDefaultMenuItem(cat, this.editor.setFontFamily.bind(this.editor, null)));

        $lib.each(fonts.sort(), (f) =>
        {
            rootItem.itemList.push(this.#createMenuItem({
                id: `${cat}_${f}`,
                value: f,
                text: f,
                command: this.editor.setFontFamily.bind(this.editor, f),
                radioGroupId: 'fontFamily'
            }));
        });
    }

    /** Builds the style menu. */
    #buildStyleMenu()
    {
        let rootItem = this.menu.itemList[3],
            templateId = 'StyleItem_Template';

        this.menu.addTemplate(templateId, `<div class="style-item"><div class="preview {previewCssClass}"></div><div class="text">{text}</div></div>`);

        $lib.each(this.editor.styles, (s) => 
        {
            rootItem.itemList.push(this.#createStyleItem(s));
        });
    }

    /**
     * Creates a style item.
     * @param {Object} s
     */
    #createStyleItem(s)
    {
        let menuItem = this.#createMenuItem({
            id: s.id,
            text: s.name,
            templateId: s.templateId || 'StyleItem_Template',
            command: this.editor.setStyle.bind(this.editor, s),
            radioGroupId: 'style',
            isCategory: s.isCategory,
            attributes: { previewCssClass: s.previewCssClass }
        });

        $lib.each(s.itemList, (item) =>
        {
            menuItem.itemList.push(this.#createStyleItem(item));
        });

        return menuItem;
    }

    /** Builds the alignment menu. */
    #buildAlignMenu()
    {
        let rootItem = this.menu.itemList[4],
            lbl = this.editor.labels,
            cat = 'align',
            iconPrefix = this.utility.iconPrefix;

        rootItem.itemList.push(this.#createDefaultMenuItem(cat, this.editor.align.bind(this.editor, null)));

        $lib.each([`${cat}Left`, `${cat}Center`, `${cat}Right`, `${cat}Justify`], (val) =>
        {
            let icon = `icon ${iconPrefix + val.replace('align', 'align-').toLowerCase()}`,
                item = {
                    id: val.replace('align', 'align_').toLowerCase(),
                    text: `<span class="${icon}"></span>${lbl[val]}`,
                    command: this.editor.align.bind(this.editor, val.toLowerCase().replace('align', '')),
                    radioGroupId: cat
                };
            rootItem.itemList.push(this.#createMenuItem(item));
        });
    }

    /** Builds the lineheight menu. */
    #buildLineHeightMenu()
    {
        let rootItem = this.menu.itemList[5],
            cat = 'lineHeight';

        rootItem.itemList.push(this.#createDefaultMenuItem(cat, this.editor.lineHeight.bind(this.editor, null)));

        $lib.each(this.editor.lineHeights, (val) =>
        {
            rootItem.itemList.push(this.#createMenuItem({
                id: `${cat}_${val}`,
                text: val,
                command: this.editor.lineHeight.bind(this.editor, val),
                radioGroupId: 'lineHeight',
            }));
        });
    }

    /**
     * Builds the list-item menu.
     * @param {Object} rootItem
     * @param {string} prefix
     * @param {Array} list
     */
    #buildListItemMenu(rootItem, prefix, list)
    {
        let iconPrefix = this.utility.iconPrefix;

        $lib.each(list, (val) =>
        {
            rootItem.itemList.push(this.#createMenuItem({
                id: `${prefix}_${val}`,
                command: () => this.editor.listManager.toggleListItemType(prefix),
                radioGroupId: prefix,
                cssClassIcon: `icon ico-xl ${iconPrefix}list-${val.toLowerCase()}`,
                hasIcon: true
            }));
        });
    }
};

export default componyx.UI.editor_modules.MenuManager;
