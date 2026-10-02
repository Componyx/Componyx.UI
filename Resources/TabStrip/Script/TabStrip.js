/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(async function (window)
{
    /**
     * Namespace for tabstrip modules.
     * @namespace componyx.UI.tabStrip_modules
     */
    componyx.UI.tabStrip_modules = componyx.UI.tabStrip_modules || {};

    /**
     * Promise that resolves when all tabstrip modules are loaded asynchronously.
     * @type {Promise<void>}
     * @memberof componyx.UI.tabStrip_modules
     */
    componyx.UI.tabStrip_modules.loaded = (async () =>
    {
        // these dynamic imports are removed when files are bundled into UI(.min).js
        await import(`${$UI.getScriptResourcePath('Base.NavigationManager')}`);
    })();

    await componyx.UI.tabStrip_modules.loaded;
    const NavigationManager = componyx.base_modules.NavigationManager;

    /**
    * TabStrip class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {Object} An instance of the component.
    */
    componyx.UI.TabStrip = function TabStrip(id, properties)
    {
        // define private properties
        var _instance = this,
            _themeOption = $base.static.ThemeOption,
            _alignmentOption = componyx.UI.TabStrip.AlignmentOption,
            _classOption =
            {
                STRIP: 'strip',
                ITEM: 'item'
            }

        // define public properties
        /**
         * Gets or sets a value indicating whether the PostBack event is automatically fired.
         * @type {String}
         */
        this.cssClassStrip = '';

        /**
         * Gets or sets the default css class of a tab item button.
         * @type {String}
         */
        this.cssClassItem = '';

        /**
         * Gets or sets the default css class of the tab item button icon.
         * @type {String}
         */
        this.cssClassItemIcon = '';

        /**
         * Gets or sets the selected item id.
         * @type {String}
         */
        this.selectedItemId = '';

        /**
         * Gets or sets the tab alignment.
         * @type {componyx.UI.TabStrip.AlignmentOption}
         */
        this.alignment = _alignmentOption.TOP;

        /**
         * Gets or sets the id of the component from which the settings are cloned.
         * @type {String|null}
         */
        this.buttonId = null;

        /**
         * Gets or sets the list of items.
         * @type {componyx.UI.TabStrip.Item[]}
         */
        this.itemList = [];

        /** @private
         *  @type {componyx.base_modules.NavigationManager}
         */
        this.navigationManager = null;

        /**
        * @class
         * @augments componyx.UI.base.Events
         * @memberof componyx.UI.TabStrip
         * @property {componyx.UI.base.Event} onItemSelect    - Event which fires when a tab item is selected. @see {@link componyx.UI.TabStrip.ItemEventArgs}
         * @property {componyx.UI.base.Event} onItemDeselect  - Event which fires when a tab item is deselected. @see {@link componyx.UI.TabStrip.ItemEventArgs}
         * @see {@link componyx.UI.base.Events}
         */
        function TabStripEvents(events)
        {
            Object.assign(this, events);
            this.onItemSelect = $base.static.createEvent('onItemSelect');
            this.onItemDeselect = $base.static.createEvent('onItemDeselect');
        };

        /**
         * TabStrip events
         * @type {componyx.UI.TabStrip.TabStripEvents}
         */
        this.events = new TabStripEvents(this.events);

        /**
         * TabStrip item event arguments.
         * @typedef {Object} ItemEventArgs
         * @memberof componyx.UI.TabStrip
         * @property {componyx.UI.Button} button - The tab button.
         * @property {componyx.UI.TabStrip.Item} item - The tab item.
         * @property {Event} event - The original event object.
         */

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        /** 
        * Renders the component
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'tab-strip');
                return;
            }

            // render logic after loading resources
            _instance.element.tabIndex = Number(_instance.tabIndex) || 0; // tabStrip widget is focusable, arrows are used to navigate tab-items
            draw();
        }

        /** 
         * Destroys the component.
         * @see {@link componyx.UI.base.methods#destroy}
         */
        this.destroy = function (...args)
        {
            dispose();
            $base.methods.destroy.call(this, ...args);
        }

        function preRender()
        {
            // initialize script and css
            return ['TabStrip', ['Button']];
        }

        function draw()
        {
            var strip = document.createElement('div'),
                selectFirst = true;

            strip.className = _classOption.STRIP;
            $lib.addClass(_instance.element, _alignmentOption.getName(_instance.alignment));

            $lib.each(_instance.itemList, function (item, index)
            {
                if ($lib.isEmpty(item.id))
                    item.id = index;

                createTab(item);

                if (item.selected)
                    selectFirst = false;
            });

            _instance.element.appendChild(strip);
            _instance.element.setAttribute('role', 'tablist');

            if (_instance.selectedItemId)
                $UI.store[getItemId(_instance.selectedItemId)].select();
            else if (selectFirst)
                $UI.store[getItemId(_instance.itemList[0].id)].select();

            $lib.on(_instance.element, 'focus', focus);
        }

        function focus()
        {
            if (!_instance.navigationManager)
                return;

            const active = _instance.element.ownerDocument.activeElement;
            if (_instance.element.contains(active) && active !== _instance.element)
                return; // focus is already on a child, so skip resetting focus

            _instance.navigationManager.setFocus(_instance.itemList[0].id);
        }

        function createTab(item)
        {
            var tab = $UI.createComponent(componyx.UI.Button, { id: getItemId(item.id), containerElement: _instance.element }),
                cloneId = item.buttonId || _instance.buttonId;

            tab.clone($UI.store[cloneId], _instance);
            tab.renderId = false;
            tab.cssClass = 'button ' + (item.cssClass || _instance.cssClassItem || _classOption.ITEM);
            tab.cssClassIcon = item.cssClassIcon || _instance.cssClassItemIcon;
            tab.hasIcon = item.hasIcon || false;
            tab.iconURL = item.iconURL;
            tab.selected = item.selected;
            tab.disabled = item.disabled;
            tab.split = item.split;

            if (!$lib.isEmpty(item.transparent))
                tab.transparent = item.transparent;
            else if (!cloneId)
                tab.transparent = true;

            if (!$lib.isEmpty(item.transparentBorder))
                tab.transparentBorder = item.transparentBorder;
            else if (!cloneId)
                tab.transparentBorder = false;

            if (!$lib.isEmpty(item.primary))
                tab.primary = item.primary;
            else if (!cloneId)
                tab.primary = false;

            if (!$lib.isEmpty(item.decoration))
                tab.decoration = item.decoration;
            else if (!cloneId)
                tab.decoration = (_instance.alignment == _alignmentOption.TOP) ? componyx.UI.Button.DecorationOption.OVERLINE : componyx.UI.Button.DecorationOption.UNDERLINE;

            tab.menuId = item.menuId;
            tab.menuItemId = item.menuItemId;
            tab.boxId = item.boxId;
            tab.type = componyx.UI.Button.TypeOption.RADIOBUTTON;
            tab.radioGroupId = _instance.id;
            tab.tabIndex = -1;
            tab.events.onSelect.priorityAdd(function (sender, args) { _instance.events.onItemSelect.fire(_instance, eventArgs(sender, item)); });
            tab.events.onDeselect.priorityAdd(function (sender, args) { _instance.events.onItemDeselect.fire(_instance, eventArgs(sender, item)); });

            if (item.content)
                tab.setContentTemplate(item.content);
            else
                tab.text = item.text;

            tab.events.onClick.priorityAdd((button, event) =>
            {
                _instance.navigationManager.setFocusFromEvent(item, event);
            });
            tab.events.onPostRender.priorityAdd((tab) =>
            {
                tab.getCommandButton().setAttribute('role', 'tab');
                createNavigationManager();
                setTimeout(() => { _instance.isReady.apply(_instance); });
            }, null);

            tab.show();
        }

        function createNavigationManager()
        {
            if (_instance.navigationManager)
                return;

            _instance.navigationManager = new NavigationManager(_instance.element,
                {
                    itemList: _instance.itemList,
                    horizontalRoot: true,
                    tabNavigation: true,
                    getButton: (item) => $UI.store[getItemId(item.id)]?.element,
                    isExpandable: (item) => false,
                    isFocusable: (item) => !Boolean(item.disabled)
                });
        }

        function getItemId(id)
        {
            return $lib.format('{0}_{1}', _instance.id, id);
        }

        function eventArgs(button, item)
        {
            return { button: button, item: item, event: $lib.event }
        }

        function dispose()
        {
            _instance.navigationManager?.destroy();
            _instance.navigationManager = null;
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.TabStrip.prototype = Object.create($base.methods);
    componyx.UI.TabStrip.prototype.constructor = componyx.UI.TabStrip;

    /**
    * AlignmentOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.TabStrip.AlignmentOption =
    {
        TOP: 0,
        BOTTOM: 1,

        getName: function (value) { return $base.static.getKeyByValue(this, value).toLowerCase(); }
    }

    /**
    * Creates an instance of the TabStrip item.
    * @class
    * @param {Object} properties The properties used to initialize the object.
    * @property {HTMLElement[]|HTMLElement} content Gets or sets the content template of the item.
    * @property {Boolean} hasIcon Gets or sets a value indicating if the item has an icon.
    * @property {String} cssClassIcon Gets or sets the css class of the icon.
    * @property {String} iconURL Gets or sets the URL of the icon.
    * @property {Boolean} split Gets or sets a value indicating if the button has two actions.
    * @property {Boolean} transparent Gets or sets a value indicating if the button's default background color is transparent.
    * @property {Boolean} transparentBorder Gets or sets a value indicating if the button's default border color is transparent.
    * @property {Boolean} primary Gets or sets a value indicating if the button is a primary button. When disabled the button's default style will be less prominent (basic) unless styled otherwise.
    * @property {Button.DecorationOption} decoration Gets or sets the decoration type used when the button is hovered/selected.
    * @property {String} menuId Gets or sets the id of the menu component.
    * @property {String} menuItemId Gets or sets the id of the menu item.
    * @property {String} boxId Gets or sets the id of the box component.
    * @property {String} buttonId Gets or sets the id of the button component.
    * @augments componyx.UI.base.Item
    * @see {@link componyx.UI.base.Item}
    */
    componyx.UI.TabStrip.Item = function (properties)
    {
        this.content = null;
        this.hasIcon = null;
        this.cssClassIcon = '';
        this.iconURL = null;
        this.split = null;
        this.transparent = null;
        this.transparentBorder = null;
        this.primary = null
        this.decoration = null;
        this.menuId = null;
        this.menuItemId = null;
        this.boxId = null;
        this.buttonId = null;

        $base.static.Item.call(this, properties);
    }
})(window);