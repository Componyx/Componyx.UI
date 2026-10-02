/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.form_modules = componyx.UI.form_modules || {};
componyx.UI.form_modules.BuildPanelManager = class BuildPanelManager
{
    #classOption;
    #navigatorUpdateTimerId;
    #navigatorItemUpdateTimerId;
    #navigatorSearchTimerId;
    #navigatorItems = [];

    constructor(form)
    {
        this.form = form;
        this.panelBar = null;
        this.cf = form.componentFactory;
        this.navigatorMenu = null;
        this.navigatorSearchInput = null;
        this.#classOption = form.classOption;
    }

    createPanelBar(container, id, cloneId, panels)
    {
        const panelBar = $UI.createComponent(componyx.UI.PanelBar, { id: id, containerElement: container });
        panelBar.clone($UI.store[cloneId], this.form);

        panelBar.events.onPostRender.priorityAdd(() =>
        {
            this.createBuildBlocks();

            if (this.form.navigatorPanelId && this.panelBar.panels.find(p => p.id === this.form.navigatorPanelId))
                this.createNavigator();

        }, null);

        panelBar.events.onPostRender.priorityAdd(() =>
        {
            this.form.isReady();
        }, null, true);

        panelBar.expandOnPointerEnter = false;
        panelBar.multiExpand = true;
        panelBar.showing = true;
        panelBar.panels = panels;
        this.panelBar = panelBar;
    }

    createBuildBlocks()
    {
        this.form.buildBlocks.forEach((buildBlock, index) =>
        {
            const panelId = buildBlock.panelId,
                panel = (!$lib.isEmpty(panelId)) ? this.panelBar.panels.find(p => p.id === panelId) : this.panelBar.panels[0],
                contentEl = panel.contentElement;

            buildBlock.id = ($lib.isEmpty(buildBlock.id)) ? `build_item_${index}` : buildBlock.id;

            if (buildBlock.label?.startsWith(':'))
            {
                const key = buildBlock.label.slice(1);

                if (this.form.labels[key])
                    buildBlock.label = this.form.labels[key];
            }

            this.createBuildBlock(buildBlock, contentEl);
        });

        this.form.renderChildren(); // render panel-bar buttons
    }

    createBuildBlock(buildBlock, panelContentEl)
    {
        let element = this.createBuildBlockElement(buildBlock, panelContentEl);
        this.cf.createButton(element, this.form.getId(buildBlock, 'insert'), this.insertBuildBlockButtonId,
            {
                hasIcon: true,
                cssClassIcon: 'ico-plus',
                cssClass: this.form.getCssClass(this.#classOption.BUILD_BLOCK_INSERT),
                command: this.form.insertBuildBlock.bind(this.form, buildBlock)
            });

        this.form.draggable.createDraggableField(buildBlock);
    }

    createBuildBlockElement(buildBlock, container)
    {
        const element = $lib.element(container, '', '', '', { "class": `${this.form.getCssClass(this.#classOption.BUILD_BLOCK)} ${buildBlock.cssClass}`.trim() });

        this.cf.createDragHandle(element);
        $lib.element(element, '', 'i', '', { "class": `${this.form.getCssClass(this.#classOption.ICON)} ${buildBlock.cssClassIcon}`.trim() });
        const labelEl = $lib.element(element, '', 'span', '', { "class": `${this.form.getCssClass(this.#classOption.LABEL)}`.trim() });

        labelEl.innerHTML = buildBlock.label;
        buildBlock.element = element;
        return element;
    }

    createNavigator()
    {
        const panelId = this.form.navigatorPanelId,
            panel = this.panelBar.panels.find(p => p.id === panelId),
            contentEl = panel.contentElement,
            inputWrapper = $lib.element({ container: contentEl });

        this.navigatorSearchInput = this.cf.createInput({
            container: inputWrapper,
            type: 'text',
            placeholder: this.form.labels.navigatorSearchHint,
            events: {
                oninput: () =>
                {
                    clearTimeout(this.#navigatorSearchTimerId);

                    this.#navigatorSearchTimerId = setTimeout(() =>
                    {
                        const fields = this.form.getFields(),
                            query = this.navigatorSearchInput.value.toLowerCase(),
                            foundField = fields.find(f => ((f.label || '') + ' ' + (f.name || '')).toLowerCase().includes(query));

                        if (!foundField)
                        {
                            this.navigatorMenu.deselectItem();
                            return;
                        }

                        let expandList = [],
                            current = foundField;

                        while (current.parent)
                        {
                            expandList.push(current.parent.id);
                            current = current.parent;
                        }

                        this.navigatorMenu.expand(expandList.reverse(), null, false, true);

                        const button = $UI.store[`${this.navigatorMenu.id}_${foundField.id}`];
                        button.element.scrollIntoView({ behavior: "smooth", block: "nearest" });
                        this.navigatorMenu.selectItem(foundField.id);
                        this.navigatorSearchInput.focus();
                    }, this.form.navigatorSearchDelay);
                }
            }
        });
        this.navigatorSearchInput.style.display = 'none';

        this.navigatorMenu = this.cf.createComponent(contentEl,
            componyx.UI.Menu,
            `${this.form.id}_navigator_menu`,
            this.form.navigatorMenuId,
            {
                horizontalRoot: false,
                itemGroupStyle: "position: static",
                itemList: this.buildNavigatorMenu(),
                events: {
                    onPostRender: () => { this.navigatorSearchInput.style.display = ''; },
                    onItemSelect: (menu, args) => { this.selectItem(args); }
                }
            });

        this.navigatorMenu.render();
    }

    scheduleNavigatorUpdate()
    {
        if (!this.navigatorMenu || this.navigatorMenu.renderState !== $base.static.RenderState.RENDERED)
            return;

        this.#navigatorItems = []; // complete update, clear list
        clearTimeout(this.#navigatorItemUpdateTimerId);
        clearTimeout(this.#navigatorUpdateTimerId);
        this.#navigatorUpdateTimerId = setTimeout(() => { this.updateNavigator(); });
    }

    scheduleNavigatorItemUpdate(item, isRemoveField)
    {
        if (!this.navigatorMenu || this.navigatorMenu.renderState !== $base.static.RenderState.RENDERED || this.#navigatorUpdateTimerId)
            return;

        this.#navigatorItems.push({item, isRemoveField});
        clearTimeout(this.#navigatorItemUpdateTimerId);
        this.#navigatorItemUpdateTimerId = setTimeout(() =>
        {
            this.#navigatorItems.forEach((r) => this.updateNavigatorItem(r.item, r.isRemoveField));
            this.#navigatorItems = [];
            this.#navigatorItemUpdateTimerId = null;
        });
    }

    updateNavigatorItem(item, isRemoveField)
    {
        if (!this.navigatorMenu || this.navigatorMenu.renderState !== $base.static.RenderState.RENDERED)
            return;

        const menu = this.navigatorMenu,
            itemPath = menu.loadItem(item.id),
            menuItem = itemPath?.item;

        if (!menuItem) // update could happen directly after creation of field
            return;

        if (isRemoveField)
        {
            const parentItem = itemPath.hasParent() ? itemPath.parent().item : null;

            menu.removeItem(item.id);

            if (parentItem && parentItem.itemList)
            {
                const index = parentItem.itemList.findIndex(i => i.id === item.id);
                if (index >= 0)
                    parentItem.itemList.splice(index, 1);
            }

            menuItem.itemList = [];
        }
        else // update
        {
            menuItem.text = item.label || item.name || item.id;
            menu.renderItem(menuItem);

            if (menuItem.expanded)
                menu.expand(menuItem.id, null, false, true);
        }
    }

    updateNavigator()
    {
        const menu = this.navigatorMenu,
            expandedItems = this.navigatorMenu.getExpandedItems();

        menu.itemList = this.buildNavigatorMenu();
        menu.destroy();
        menu.events.onPostRender.priorityAdd(() =>
        {
            this.navigatorSearchInput.style.display = '';

            if (expandedItems?.length)
            {
                const expandedIds = expandedItems.filter(item =>
                {
                    if (item.attributes.type === 'Section')
                        return this.form.getSection(item.id);
                    else if (item.attributes.type === 'FieldSet')
                        return this.form.getFieldSet(item.id);
                    else // field
                        return this.form.getField(item.id);
                }).map(item => item.id);

                if (expandedIds.length)
                    this.navigatorMenu.expand(expandedIds, null, false, true);
            }
        });
        menu.events.onItemSelect.priorityAdd((menu, args) => { this.selectItem(args); });
        menu.render();
        this.#navigatorUpdateTimerId = null;
    }

    selectItem(args)
    {
        const item = args.item,
            type = item.attributes.type;

        if (this.form.isField(type))
            this.form.selectField(this.form.getField(item.id));
        else if (type === 'FieldSet')
            this.form.selectFieldSet(this.form.getFieldSet(item.id));
        else
            this.form.selectSection(this.form.getSection(item.id));
    }

    buildNavigatorMenu(fieldSets = this.form.fieldSets, parentItem = null)
    {
        const itemList = parentItem ? parentItem.itemList = [] : [];

        fieldSets.forEach((fs) =>
        {
            const cssClassIcon = fs.type === 'Section' ? 'ico-folder-closed' : 'ico-group',
                item = new componyx.UI.Menu.Item(
                    {
                        id: fs.id,
                        text: fs.label || fs.id,
                        hasIcon: true,
                        cssClassIcon: `${this.form.getCssClass(this.#classOption.ICON)} ${cssClassIcon}`.trim(),
                        attributes: { type: fs.type }
                    });

            itemList.push(item);

            if (!$lib.isEmpty(fs.fieldSets))
                this.buildNavigatorMenu(fs.fieldSets, item);
            else
            {
                (fs.fields || []).forEach((f) =>
                {
                    const fieldItem = new componyx.UI.Menu.Item(
                        {
                            id: f.id,
                            text: f.label || f.name,
                            hasIcon: true,
                            cssClassIcon: `${this.form.getCssClass(this.#classOption.ICON)} ${f.cssClassIcon}`.trim(),
                            attributes: { type: f.type }
                        });

                    item.itemList = item.itemList || [];
                    item.itemList.push(fieldItem);
                });
            }
        });

        return itemList;
    }


}

export default componyx.UI.form_modules.BuildPanelManager;