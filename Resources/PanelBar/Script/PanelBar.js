/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

(function ()
{
    /**
    * PanelBar class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.WebComponent
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {componyx.UI.PanelBar} An instance of the component.
    */
    class PanelBar extends componyx.UI.base.WebComponent 
    {

        /**
        * Internal CSS class name constants.
        * You can override any of these classes on the Component instance by defining a property named
        * `cssClass<Key>` where <Key> is the PascalCase key from this object.
        * Example:
        *  'PANEL' -> 'cssClassPanel'
        * Be cautious: overriding these classes without including the default names may break styling and functionality.
        * @constant
        * @type {Readonly<Object<string, string>>}
        */
        classOption =
            {
                PANEL: 'panel',
                ICON: 'icon',
                TITLE: 'title',
                CONTENT: 'content',
                EXPANDED: 'expanded',
                DISABLED: 'disabled'
            };

        constructor(id, properties)
        {
            super(id, properties);

            /**
             * Gets or sets a value indicating if a panel is expanded on the pointer enter event.
             * @type {boolean}
             */
            this.expandOnPointerEnter = false;

            /**
             * Gets or sets a value indicating if one panel or multiple panels can be expanded simultaneously.
             * @type {Boolean}
             */
            this.multiExpand = false;

            /**
             * Gets or sets the panels to render inside the panel-bar.
             * @type {PanelBar.Panel[]}
             */
            this.panels = [];

            /**
            * @class
            * @augments componyx.UI.base.Events
            * @memberof componyx.UI.PanelBar
            * @property {componyx.UI.base.Event} onPanelExpand      - Fires when a panel expands. @see {@link componyx.UI.PanelBar.PanelBarEventArgs}
            * @property {componyx.UI.base.Event} onPanelCollapse    - Fires when a panel collapses. @see {@link componyx.UI.PanelBar.PanelBarEventArgs}
            * @see {@link componyx.UI.base.Events}
            */
            function PanelBarEvents(events)
            {
                Object.assign(this, events);

                this.onPanelExpand = $base.static.createEvent('onPanelExpand');
                this.onPanelCollapse = $base.static.createEvent('onPanelCollapse');
            };

            /**
             * PanelBar events
             * @type {componyx.UI.PanelBar.PanelBarEvents}
             */
            this.events = new PanelBarEvents(this.events);

            /**
            * @typedef {Object} PanelBarEventArgs
            * @memberof componyx.UI.PanelBar
            * @property {componyx.UI.PanelBar} panelBar - The PanelBar instance.
            * @property {Object} eventArgs - The event object containing more detailed information about the event.
            * @property {componyx.UI.PanelBar.Panel} eventArgs.panel - The panel instance associated with the event.
            */
        }

        /**
        * Gets the Panel class instance by the specified panel element.
        * @param {HTMLElement} element The panel element.
        * @returns {PanelBar.Panel}
         */
        getPanelByElement(element)
        {
            return this.panels.find(p => p.element === element);
        }

        /**
        * Gets the Panel class instance by the specified id.
        * @param {String} id The panel identifier.
        * @returns {PanelBar.Panel}
         */
        getPanelById(id)
        {
            return this.panels.find(p => p.id === id);
        }

        /**
         * Updates the title of the specified panel.
         * @param {Componyx.PanelBar.Panel|HTMLElement|String} panel The Panel instance, element, or identifier.
         * @param {HTMLElement|DocumentFragment|string} title The title presented in the panel header.
         */
        updatePanelTitle(panel, title)
        {
            let panelEl = (panel instanceof HTMLElement) ? panel : (typeof panel === 'string') ? this.getPanelById(panel).element : panel.element,
                cssClass = this.#getCssClass(this.classOption.TITLE),
                headerTitleEl = panelEl.querySelector(`header .${cssClass}`);

            if (typeof title === 'string')
                headerTitleEl.innerHTML = title;
            else
                headerTitleEl.appendChild(title);

            panel.title = title;
        }

        /**
         * Shows the specified panel.
         * @param {Componyx.PanelBar.Panel|HTMLElement|String} panel The Panel instance, element, or identifier.
         */
        showPanel(panel)
        {
            let panelEl = (panel instanceof HTMLElement) ? panel : (typeof panel === 'string') ? this.getPanelById(panel).element : panel.element;
            panelEl.style.display = '';
        }

        /**
         * Hides the specified panel.
         * @param {Componyx.PanelBar.Panel|HTMLElement|String} panel The Panel instance, element, or identifier.
         */
        hidePanel(panel)
        {
            let panelEl = (panel instanceof HTMLElement) ? panel : (typeof panel === 'string') ? this.getPanelById(panel).element : panel.element;
            panelEl.style.display = 'none';
        }

        /**
         * Toggles the expand/collapse state of the specified panel element.
         * If multiExpand is false, collapses all panels before expanding the selected one.
         * @param {Componyx.PanelBar.Panel|HTMLElement|String} panel The Panel instance, element, or identifier.
         */
        toggleExpandPanel(panel)
        {
            const panelEl = (panel instanceof HTMLElement) ? panel : (typeof panel === 'string') ? this.getPanelById(panel).element : panel.element,
                cssClass = this.#getCssClass(this.classOption.EXPANDED);

            if (panelEl.classList.contains(cssClass))
                this.collapsePanel(panel);
            else
                this.expandPanel(panel);
        }

        /**
         * Expands the specified panel element by adding the expand CSS class.
         * Fires an event indicating the panel has expanded.
         * @param {Componyx.PanelBar.Panel|HTMLElement|String} panel The Panel instance, element, or identifier.
         * @param {Boolean} instant=false A value indicating if the default CSS animation should be skipped.
         */
        expandPanel(panel, instant=false)
        {
            const panelEl = (panel instanceof HTMLElement) ? panel : (typeof panel === 'string') ? this.getPanelById(panel).element : panel.element,
                cssClass = this.#getCssClass(this.classOption.EXPANDED);

            panel = this.getPanelByElement(panelEl);

            if (!this.multiExpand)
                this.collapseAllPanels(instant);

            if (instant)
            {
                panelEl.style.transition = 'none';
                void panelEl.offsetHeight; // force reflow to pickup transition change
            }

            panelEl.classList.add(cssClass);
            this.events.onPanelExpand.fire(this, { panel });
            panel.expanded = true;

            if (instant)
                requestAnimationFrame(() => { panelEl.style.transition = ''; });
        }

        /**
         * Collapses the specified panel element by removing the expand CSS class.
         * Fires an event indicating the panel has collapsed.
         * @param {Componyx.PanelBar.Panel|HTMLElement|String} panel The Panel instance, element, or identifier.
         * @param {Boolean} instant=false A value indicating if the default CSS animation should be skipped.
         */
        collapsePanel(panel, instant = false)
        {
            const panelEl = (panel instanceof HTMLElement) ? panel : (typeof panel === 'string') ? this.getPanelById(panel).element : panel.element,
                cssClass = this.#getCssClass(this.classOption.EXPANDED);

            if (instant)
            {
                panelEl.style.transition = 'none';
                void panelEl.offsetHeight; // force reflow to pickup transition change
            }

            panel = this.getPanelByElement(panelEl);
            panelEl.classList.remove(cssClass);

            this.events.onPanelCollapse.fire(this, { panel });
            panel.expanded = false;

            if (instant)
                requestAnimationFrame(() => { panelEl.style.transition = ''; });
        }

        /**
         * Disables the specified panel.
         * @param {Componyx.PanelBar.Panel|HTMLElement|String} panel The Panel instance, element, or identifier.
         */
        disablePanel(panel)
        {
            const panelEl = (panel instanceof HTMLElement) ? panel : (typeof panel === 'string') ? this.getPanelById(panel).element : panel.element,
                cssClass = this.#getCssClass(this.classOption.DISABLED);

            panelEl.classList.add(cssClass);
            panelEl.inert = true;
            this.getPanelByElement(panelEl).disabled = true;
        }

        /**
         * Enables the specified panel.
         * @param {Componyx.PanelBar.Panel|HTMLElement|String} panel The Panel instance, element, or identifier.
         */
        enablePanel(panel)
        {
            const panelEl = (panel instanceof HTMLElement) ? panel : (typeof panel === 'string') ? this.getPanelById(panel).element : panel.element,
                cssClass = this.#getCssClass(this.classOption.DISABLED);

            panelEl.classList.remove(cssClass);
            panelEl.inert = false;
            this.getPanelByElement(panelEl).disabled = false;
        }

        /**
         * Collapses all panels by removing the expand CSS class from all expanded panels.
         * @param {Boolean} instant=false A value indicating if the default CSS animation should be skipped.
         */
        collapseAllPanels(instant = false)
        {
            const cssClass = this.#getCssClass(this.classOption.EXPANDED);

            this.panels.forEach((panel) =>
            {
                const el = panel.element;

                if (el && el.classList.contains(cssClass))
                    this.collapsePanel(el, instant);

            });
        }

        /**
         * Enables all panels. 
         */
        enableAllPanels()
        {
            this.panels.forEach((panel) =>
            {
                this.enablePanel(panel);
            });
        }

        /**
         * Disables all panels. 
         */
        disableAllPanels()
        {
            this.panels.forEach((panel) =>
            {
                this.disablePanel(panel);
            });
        }

        /**
         * Shows all panels. 
         */
        showAllPanels()
        {
            this.panels.forEach((panel) =>
            {
                this.showPanel(panel);
            });
        }

        /**
         * Hides all panels. 
         */
        hideAllPanels()
        {
            this.panels.forEach((panel) =>
            {
                this.hidePanel(panel);
            });
        }

        /**
        * Renders the component.
        */
        render()
        {
            if (this.renderState != $base.static.RenderState.RENDERING)
            {
                super.render(this.#preRender, 'panel-bar');
                return;
            }

            // render logic after loading resources
            this.#draw();
            $lib.on(document, 'focus', this.#focus, null, this, true);
            this.renderChildren();
        }

        /**
        * Destroys the component.
        * @param {Boolean} keepEvents A value indicating if component events should be kept.
        * @param {Boolean} removeElement=true A value indicating if the corresponding HTML Element should be removed.
        * @see {@link componyx.UI.base.methods#destroy}
        * @function
        */
        destroy(keepEvents, removeElement = true)
        {
            this.#dispose();
            super.destroy(keepEvents, removeElement);
        }

        #preRender()
        {
            return [PanelBar.name];
        }

        #draw()
        {
            this.panels.forEach((panel, index) =>
            {
                this.#createPanel(panel, panel.templateId || `Content_${index}`);
            });
        }

        /**
         * Creates the panel
         * @param {PanelBar.Panel} panel
         * @private
         */
        #createPanel(panel, templateId)
        {
            const panelEl = $lib.element(this.element, '', '', '',
                {
                    "id": (!$lib.isEmpty(panel.id)) ? `${this.id}_${panel.id}` : undefined,
                    "class": this.#getCssClass(this.classOption.PANEL),
                    "style": panel.style || undefined
                }),
                headerTitleEl = $lib.element('', '', 'span', panel.title, { "class": this.#getCssClass(this.classOption.TITLE) }),
                headerEl = $lib.element(panelEl, '', 'header', headerTitleEl),
                contentEl = $lib.element(panelEl, '', '', '', { "class": this.#getCssClass(this.classOption.CONTENT) });

            if (panel.cssClass)
                panelEl.classList.add(panel.cssClass);

            if (panel.hasIcon)
            {
                let iconEl = $lib.element(headerEl, headerTitleEl, 'i', '', { "class": this.#getCssClass(this.classOption.ICON) });

                if (panel.cssClassIcon)
                    iconEl.classList.add(panel.cssClassIcon);
            }

            if (panel.minHeight)
                panelEl.style.minHeight = $lib.unit(panel.minHeight);

            if (panel.maxHeight)
                panelEl.style.minHeight = $lib.unit(panel.minHeight);

            if (!panel.content)
                panel.content = this.getTemplateContent(templateId);

            if (panel.content)
                $lib.element(contentEl, '', '', panel.content);

            panel.element = panelEl;
            panel.contentElement = contentEl;

            if (panel.expanded)
                this.expandPanel(panelEl);

            if (panel.disabled)
            {
                let cssClass = this.#getCssClass(this.classOption.DISABLED);
                panelEl.classList.add(cssClass);
                panelEl.inert = true;
            }

            this.#bindEvents(panelEl, headerEl);
        }

        #getCssClass(cssClassValue)
        {
            return super.getCssClass(this.classOption, cssClassValue);
        }

        #bindEvents(panelEl, headerEl)
        {
            if (this.expandOnPointerEnter)
                $lib.on(panelEl, 'pointerenter', this.#pointerEnter, [panelEl], this, true);

            $lib.on(headerEl, 'click', this.toggleExpandPanel, [panelEl], this, true);
        }

        #pointerEnter(panelEl, event)
        {
            if (event.pointerType === "touch")
                return;

            this.expandPanel(panelEl);
        }

        #focus(event)
        {
            const focusedEl = event.target,
                cssClass = this.#getCssClass(this.classOption.PANEL);

            if (this.contains(focusedEl))
            {
                const panelEl = focusedEl.closest('.' + cssClass);
                this.expandPanel(panelEl);
            }
        }

        #dispose()
        {
            $lib.off(document, 'focus', this.#focus);
        }
    }

    /**
     * The Panel class.
     * @class Panel
     * @memberof componyx.UI.PanelBar
     * @param {Object} properties The properties used to initialize the object.
     * @property {string} [id] Gets or sets the identifier of the panel.
     * @property {boolean} [expanded] Gets or sets a value indicating if this panel is expanded.
     * @property {boolean} [hasIcon] Gets or sets a value indicating if there is an icon in the panel header.
     * @property {string} [cssClass] Gets or sets the css class of the panel. This class is combined with the default class set on the PanelBar component.
     * @property {string} [cssClassIcon] Gets or sets the css class of the panel header icon. This class is combined with the default icon class set on the PanelBar component.
     * @property {string} [style] Gets or sets the css style of the panel.
     * @property {string} [minHeight] Gets or sets the minimum height of the panel in the desired CSS units.
     * @property {string} [maxHeight] Gets or sets the maximum  height of the panel in the desired CSS units.
     * @property {HTMLElement|DocumentFragment|string} title Gets or sets the title presented in the panel header.
     * @property {HTMLElement|DocumentFragment|string} content Gets or sets the content of the panel.
     * @property {string} templateId Gets or sets the content template id of this panel.
     * @property {HTMLElement} element Gets the rendered panel element.
     * @property {HTMLElement} contentElement Gets the rendered panel content element.
     */
    PanelBar.Panel = class Panel
    {
        constructor(properties)
        {
            this.id = null;
            this.expanded = false;
            this.hasIcon = false;
            this.cssClass = '';
            this.cssClassIcon = '';
            this.style = '';
            this.minHeight = '';
            this.maxHeight = '';
            this.title = '';
            this.content = '';
            this.templateId = '';
            this.element = null;
            this.contentElement = null;
            Object.defineProperties(this, Object.getOwnPropertyDescriptors(properties));
        }
    };

    // Preserve HTMLElement prototype and extend it with $base.methods
    Object.assign(PanelBar.prototype, Object.fromEntries(Object.entries($base.methods).filter(([key]) => !['render', 'destroy', 'getCssClass'].includes(key))));

    // Restore the constructor reference
    PanelBar.prototype.constructor = PanelBar;
    componyx.UI.PanelBar = PanelBar;

    // Define the custom element
    customElements.define(`${componyx.UI.tagPrefix}${PanelBar.name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}`, PanelBar); // cui-panel-bar
})();