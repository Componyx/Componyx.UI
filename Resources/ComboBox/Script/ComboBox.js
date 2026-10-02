/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * ComboBox class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @property {componyx.UI.base.AjaxMethod} ajax.load - AJAX method used to load items on demand.
    * @returns {Object} An instance of the component.
    */
    componyx.UI.ComboBox = function ComboBox(id, properties)
    {
        // define private properties
        var _instance = this,
            _elements = {},
            _tags = {},
            _input = null,
            _selectAllId = 'SelectAll',
            _loading = false,
            _loadTimerId = null,
            _lastQuery = null,
            _keyCode = null,
            _sizer = null,
            _expandButton = null,
            _clearButton = null,
            _clearButtonClicked = false,
            _listBox = null,
            _pager = null,
            _hidden = null,
            _ajax = null,
            _onDemand = false,
            _multiTemplateActive = false,
            _initialValue = false,
            _focusedItemId = null,
            _selectedItemId = null,
            _selectedItems = {},
            _selectedCount = 0,
            _columnRegEx = null,
            _forceSelect = false,
            _charValue = '',
            _allowHide = true,
            _pendingCustomValue = null,
            _themeOption = $base.static.ThemeOption,
            _filterOption = componyx.UI.ComboBox.FilterOption,
            _classOption =
            {
                GROW: 'grow',
                SIZER: 'sizer',
                MULTISELECT: 'multi',
                ALLOWINPUT: 'allow-input',
                TAGGING: 'tagging',
                TAG: 'button tag',
                DISABLED: 'disabled',
                EXPANDBUTTON: 'button expand down',
                EXPANDSPLIT: 'split',
                EXPANDICON: 'expand-icon',
                CLEARBUTTON: 'button clear',
                BOX: 'box',
                DATAPAGER: 'data-pager',
                BOXHEADER: 'header header-label',
                BOXFOOTER: 'footer',
                LIST: 'list',
                ITEM: 'item',
                ITEMICON: 'icon',
                ITEMCHECKBOX: 'checkbox',
                ITEMSELECTALL: 'item select-all',
                PRELOADER: 'preloader',
                NORESULT: 'no-result'
            };

        // define public properties
        /**
         * Gets or sets the css class of the expand button component.
         * @type {String}
         */
        this.cssClassExpandButton = '';

        /**
         * Gets or sets the css class of the expand icon.
         * @type {String}
         */
        this.cssClassExpandIcon = '';

        /**
         * Gets or sets the css class of the clear button component.
         * @type {String}
         */
        this.cssClassClearButton = '';

        /**
         * Gets or sets the css class of the datapager component.
         * @type {String}
         */
        this.cssClassDataPager = '';

        /**
         * Gets or sets the css class of the list box component.
         * @type {String}
         */
        this.cssClassListBox = '';

        /**
         * Gets or sets the css class of the unordered list.
         * @type {String}
         */
        this.cssClassList = '';

        /**
         * Gets or sets the default css class of an item.
         * @type {String}
         */
        this.cssClassItem = '';

        /**
         * Gets or sets the css class of an item icon.
         * @type {String}
         */
        this.cssClassItemIcon = '';

        /**
         * Gets or sets the css class of an item checkbox.
         * @type {String}
         */
        this.cssClassItemCheckBox = '';

        /**
         * Gets or sets the css class of the 'select all' checkbox item.
         * @type {String}
         */
        this.cssClassItemSelectAll = '';

        /**
         * Gets or sets the css class of the preloader container.
         * @type {String}
         */
        this.cssClassPreloader = '';

        /**
         * Gets or sets the css class of the noresult container.
         * @type {String}
         */
        this.cssClassNoResult = '';

        /**
         * Gets or sets the identifying css class of a column.
         * @type {String}
         */
        this.columnIdentifyingCssClass = '';

        /**
         * Gets or sets the default template id of an item.
         * @type {String|null}
         */
        this.itemTemplateId = null;

        /**
         * Gets or sets a value indicating whether textual input is allowed.
         * @type {Boolean}
         */
        this.allowInput = true;

        /**
         * Gets or sets a value indicating whether users can enter values not in the option list.
         * @type {Boolean}
         */
        this.allowCustomValue = false;

        /**
         * Gets or sets a value indicating whether the combo box uses a split button.
         * @type {Boolean}
         */
        this.splitButton = false;

        /**
         * Gets or sets a value indicating whether multiple items can be selected through checkboxes.
         * @type {Boolean}
         */
        this.multiSelect = false;

        /**
         * Gets or sets a value indicating whether selected items are displayed as tags.
         * @type {Boolean}
         */
        this.multiSelectTagging = false;

        /**
         * Gets or sets a value indicating if the input box will increase width automatically based on the size of the text.
         * @type {Boolean}
         */
        this.autoGrow = false;

        /**
         * Gets or sets a value indicating whether keyboard navigation is allowed.
         * @type {Boolean}
         */
        this.keyboardNavigation = true;

        /**
         * Gets or sets a value indicating whether the list box is collapsed on an item select.
         * @type {Boolean}
         */
        this.collapseOnItemSelect = true;

        /**
         * Gets or sets a value indicating whether the data is loaded when the component is rendering.
         * @type {Boolean}
         */
        this.loadOnRender = false;

        /**
         * Gets or sets a value indicating whether the data is loaded when the text input is changed or the list box is expanded.
         * @type {Boolean}
         */
        this.loadOnDemand = false;

        /**
         * Gets or sets a value indicating whether the data is reloaded when the list box is expanded.
         * @type {Boolean}
         */
        this.reloadOnExpand = false;

        /**
         * Gets or sets the amount of characters required before a load on demand is performed.
         * @type {Number}
         */
        this.loadOnDemandCharStart = 0;

        /**
         * Gets or sets the delay in milliseconds on a keydown event before a load on demand is performed.
         * @type {Number}
         */
        this.loadOnDemandDelay = 250;

        /**
         * Gets or sets a value indicating whether the clear button is disabled.
         * @type {Boolean}
         */
        this.disableClearButton = false;

        /**
         * Gets or sets a value indicating whether the datapager is enabled.
         * @type {Boolean}
         */
        this.enableDataPager = false;

        /**
         * Gets or sets a value indicating whether the combobox is disabled.
         * @type {Boolean}
         */
        this.disabled = false;

        /**
         * Gets or sets a value indicating whether the current selection must be kept when reloading data.
         * @type {Boolean}
         */
        this.keepSelectionOnReload = true;

        /**
         * Gets or sets a value indicating whether the list box can only be expanded by typing, not by clicking the expand button.
         * @type {Boolean}
         */
        this.disableExpandOnClick = false;

        /**
         * Gets or sets the placeholder which is visible when the input box has no value.
         * @type {String}
         */
        this.placeholder = '';

        /**
         * Gets or sets the input width in the specified unit.
         * @type {String}
         */
        this.width = '';

        /**
         * Gets or sets the name of the hidden input field which contains the selected value(s).
         * @type {String}
         */
        this.name = '';

        /**
         * Gets or sets the initial selected value.
         * @type {String}
         */
        this.value = '';

        /**
         * Gets or sets the list of items.
         * @type {componyx.UI.ComboBox.Item[]|null}
         */
        this.itemList = null;

        /**
         * Gets or sets the tooltip manager used to display tooltips.
         * @type {String|null}
         */
        this.tooltipManagerId = null;

        /**
         * Gets or sets the id of the tooltip to show.
         * @type {String|null}
         */
        this.tooltipId = null;

        /**
         * Gets or sets the id of the expand button from which the settings are cloned.
         * @type {String|null}
         */
        this.expandButtonId = null;

        /**
         * Gets or sets the id of the clear button from which the settings are cloned.
         * @type {String|null}
         */
        this.clearButtonId = null;

        /**
         * Gets or sets the id of the tag button from which the settings are cloned.
         * @type {String|null}
         */
        this.tagButtonId = null;

        /**
         * Gets or sets the id of the list box from which the settings are cloned.
         * @type {String|null}
         */
        this.listBoxId = null;

        /**
         * Gets or sets the id of the list datapager from which the settings are cloned.
         * @type {String|null}
         */
        this.dataPagerId = null;

        /**
         * Gets or sets or sets the id of the HTML hidden input.
         * @type {String|null}
         */
        this.hiddenInputId = null;


        /**
         * @class
         * @augments componyx.UI.base.Events
         * @memberof componyx.UI.ComboBox
         * @property {componyx.UI.base.Event} onFocus              - Event which fires when the combobox is focused. @see {@link componyx.UI.base.EventArgs}
         * @property {componyx.UI.base.Event} onBlur               - Event which fires when the combobox is blurred. @see {@link componyx.UI.base.EventArgs}
         * @property {componyx.UI.base.Event} onInputFocus         - Event which fires on the focus event of the input textbox. @see {@link componyx.UI.ComboBox.ComboBoxItemEventArgs}
         * @property {componyx.UI.base.Event} onInputBlur          - Event which fires on the blur event of the input textbox. @see {@link componyx.UI.ComboBox.ComboBoxItemEventArgs}
         * @property {componyx.UI.base.Event} onItemClick          - Event which fires on an item click. @see {@link componyx.UI.ComboBox.ComboBoxItemEventArgs}
         * @property {componyx.UI.base.Event} onItemSelect         - Event which fires on an item select. @see {@link componyx.UI.ComboBox.ComboBoxItemEventArgs}
         * @property {componyx.UI.base.Event} onItemDeselect       - Event which fires on an item deselect. @see {@link componyx.UI.ComboBox.ComboBoxItemEventArgs}
         * @property {componyx.UI.base.Event} onClear              - Event which fires when the clear button is clicked. @see {@link componyx.UI.ComboBox.ComboBoxEventArgs}
         * @property {componyx.UI.base.Event} onPreLoadItemList    - Event which fires before the item-list data is loaded. @see {@link componyx.UI.ComboBox.ComboBoxQueryEventArgs}
         * @property {componyx.UI.base.Event} onPostLoadItemList   - Event which fires when the item-list data is loaded. @see {@link componyx.UI.ComboBox.ComboBoxEventArgs}
         * @property {componyx.UI.base.Event} onPostRenderItemList - Event which fires when the item-list is rendered. @see {@link componyx.UI.ComboBox.ComboBoxEventArgs}
         * @property {componyx.UI.base.Event} onPreRenderItem      - Event which fires when an item is rendered. @see {@link componyx.UI.ComboBox.ComboBoxItemEventArgs}
         * @property {componyx.UI.base.Event} onPostRenderItem     - Event which fires when an item is rendered. @see {@link componyx.UI.ComboBox.ComboBoxItemEventArgs}
         * @see {@link componyx.UI.base.Events}
         */
        function ComboBoxEvents(events)
        {
            Object.assign(this, events);

            this.onFocus = $base.static.createEvent('onFocus');
            this.onBlur = $base.static.createEvent('onBlur');
            this.onInputFocus = $base.static.createEvent('onInputFocus');
            this.onInputBlur = $base.static.createEvent('onInputBlur');
            this.onItemClick = $base.static.createEvent('onItemClick');
            this.onItemSelect = $base.static.createEvent('onItemSelect');
            this.onItemDeselect = $base.static.createEvent('onItemDeselect');
            this.onClear = $base.static.createEvent('onClear');
            this.onPreLoadItemList = $base.static.createEvent('onPreLoadItemList');
            this.onPostLoadItemList = $base.static.createEvent('onPostLoadItemList');
            this.onPostRenderItemList = $base.static.createEvent('onPostRenderItemList');
            this.onPreRenderItem = $base.static.createEvent('onPreRenderItem');
            this.onPostRenderItem = $base.static.createEvent('onPostRenderItem');
        };

        /**
         * ComboBox events
         * @type {componyx.UI.ComboBox.ComboBoxEvents}
         */
        this.events = new ComboBoxEvents(this.events);


        /**
         * @typedef {Object} componyx.UI.ComboBox.ComboBoxEventArgs
         * @property {componyx.UI.ComboBox} ComboBox - The ComboBox instance.
         * @property {null} eventArgs - Not used, always null.
         */

        /**
         * @typedef {Object} componyx.UI.ComboBox.ComboBoxItemEventArgs
         * @property {componyx.UI.ComboBox} ComboBox - The ComboBox instance.
         * @property {Object} eventArgs - The event object containing more detailed information about the event.
         * @property {componyx.UI.ComboBox.Item|null} eventArgs.item - The combobox item, null for the input focus/blur events.
         * @property {Event} eventArgs.event - The original event object.
         */

        /**
         * @typedef {Object} componyx.UI.ComboBox.ComboBoxQueryEventArgs
         * @property {componyx.UI.ComboBox} ComboBox - The ComboBox instance.
         * @property {Object} eventArgs - The load query.
         * @property {string} eventArgs.text - The search text.
         * @property {number} eventArgs.pageIndex - The page index (1-based).
         */

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        /** 
        * Sets the header template.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content HTML string or element node as content. Pass null or empty string to remove the existing template.
        * @see {@link componyx.UI.base.addTemplate}
        */
        this.setHeaderTemplate = function (content)
        {
            _instance.addTemplate('Header', content, false);
        }

        /** 
        * Sets the footer template.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content HTML string or element node as content. Pass null or empty string to remove the existing template.
        * @see {@link componyx.UI.base.addTemplate}
        */
        this.setFooterTemplate = function (content)
        {
            _instance.addTemplate('Footer', content, false);
        }

        /** 
        * Sets the select all checkbox template. The template supports the below listed interpolations.
        * - {checkBox} This value will be replaced with the checkbox element to select all items.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content HTML string or element node as content. Pass null or empty string to remove the existing template.
        * @see {@link componyx.UI.base.addTemplate}
        */
        this.setSelectAllTemplate = function (content)
        {
            _instance.addTemplate('SelectAll', content, true);
        }

        /** 
        * Sets the multiselect input template. The template supports the below listed interpolations. Default value: {count} items selected
        * - {count} This value will be replaced with the selected item count.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content HTML string or element node as content. Pass null or empty string to remove the existing template.
        * @see {@link componyx.UI.base.addTemplate}
        */
        this.setMultiSelectInputTemplate = function (content)
        {
            _instance.addTemplate('MultiSelectInput', content, true);
        }

        /** 
        * Sets the preloader template.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content HTML string or element node as content. Pass null or empty string to remove the existing template.
        * @see {@link componyx.UI.base.addTemplate}
        */
        this.setPreloaderTemplate = function (content)
        {
            _instance.addTemplate('Preloader', content, true);
        }

        /** 
        * Sets the no result template.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content Text string. Pass null or empty string to remove the existing template.
        * @see {@link componyx.UI.base.addTemplate}
        */
        this.setNoResultTemplate = function (content)
        {
            _instance.addTemplate('NoResult', content, true);
        }

        /** 
        * Sets the multi-select item tag template. The template supports all data-item interpolations (view Base method comment). Default value: {text}.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content HTML string or element node as content. Pass null or empty string to remove the existing template.
        * @see {@link componyx.UI.base.addTemplate}
        */
        this.setItemTagTemplate = function (content)
        {
            _instance.addTemplate('ItemTag', content, true);
        }

        /** 
        * Adds (or removes) an item template. The template supports the below listed interpolations and all data-item interpolations (view Base method comment). Default value: {checkBox}{icon}{text}
        * - {checkBox} This value will be replaced with the checkbox element to select the item when multiSelect is enabled.
        * - {icon} This value will be replaced with the icon of the item when item.hasIcon is set to true.
        * @see {@link componyx.UI.base.methods#addTemplate}
        * @function
        */

        /** 
        * Sets the placeholder text.
        * @param {String} text The placeholder text.
        */
        this.setPlaceholder = function (text)
        {
            _input.placeholder = text;
            _instance.placeholder = text;
        }

        /** 
        * Selects/deselects the item with the specified id.
        * @param {String} id The item identifier.
        */
        this.toggleSelectItem = function (id)
        {
            _forceSelect = true;
            toggleSelectItem(id);
        }

        /** 
        * Selects the items with the specified id.
        * @param {Array} ids The list of item ids.
        */
        this.selectItems = function (ids)
        {
            for (var index = 0; index < ids.length; ++index)
            {
                _instance.selectItem(ids[index]);
            }
        }

        /** 
        * Deselects the items with the specified id.
        * @param {Array} ids The list of item ids.
        */
        this.deselectItems = function (ids)
        {
            if ($lib.isEmpty(ids))
                return;

            for (var index = 0; index < ids.length; ++index)
            {
                deselectItem(ids[index]);
            }
        }

        /** 
        * Selects the item with the specified id.
        * @param {String} id The item identifier.
        */
        this.selectItem = function (id)
        {
            _forceSelect = true;
            selectItem(id);
        }

        /** 
        * Deselects the item with the specified id.
        * @param {String} id The item identifier.
        */
        this.deselectItem = function (id)
        {
            deselectItem(id)
        }

        /** 
        * Enables the item with the specified id.
        * @param {String} id The item identifier.
        */
        this.enableItem = function (id)
        {
            enableItem(id);
        }

        /** 
        * Disables the item with the specified id.
        * @param {String} id The item identifier.
        */
        this.disableItem = function (id)
        {
            disableItem(id);
        }

        /** 
        * Gets the list-item element for the specified item id.
        * @param {String} id The item identifier.
        * @returns {HTMLElement} The list item element.
        */
        this.getItemElement = function (id)
        {
            return _elements[id];
        }

        /** 
        * Gets the box component which serves as item list container.
        * @returns {Box} The Box component.
        */
        this.getListBox = function ()
        {
            return _listBox;
        }

        /** 
        * Shows the listbox.
        */
        this.showListBox = function ()
        {
            _listBox.show();
        }

        /** 
        * Hides the listbox.
        */
        this.hideListBox = function ()
        {
            _listBox.hide();
        }

        /** 
        * Gets the selected item.
        * @returns {Item} The selected item.
        */
        this.getSelectedItem = function ()
        {
            for (const id in _selectedItems)
            {
                return _selectedItems[id];
            }
            return null;
        }

        /** 
        * Gets the selected items in a multiselect combobox.
        * @returns {Item[]} The selected items.
        */
        this.getSelectedItems = function ()
        {
            if (!_instance.multiSelect)
                return this.getSelectedItem();

            var items = [];

            for (var id in _selectedItems)
            {
                items.push(_selectedItems[id]);
            }

            return items;
        }

        /** 
        * Gets the selected value.
        * @returns {String} The selected value;
        */
        this.getValue = function ()
        {
            if (!_instance.multiSelect && _instance.allowCustomValue && _input.value !== _hidden.value)
                commitInputValue(); // make sure we commit when there is a pending custom value

            return _hidden.value;
        }

        /** 
        * Clears the input value and the selected item(s).
        */
        this.clear = function ()
        {
            clear();
        }

        /** 
        * Clears the selected item(s).
        */
        this.clearSelection = function ()
        {
            clearSelection();
        }

        /** 
        * Clears the input.
        */
        this.clearInput = function ()
        {
            clearInput();
        }

        /** 
        * Clears the item list.
        */
        this.clearList = function ()
        {
            clearList();
        }

        /** 
        * Gets the input element.
        * @returns {HTMLElement} The input element.
        */
        this.getInput = function ()
        {
            return _input;
        }

        /** 
        * Disables the combo-box
        */
        this.disable = function ()
        {
            _instance.disabled = true;

            if (_instance.renderState < $base.static.RenderState.RENDERED)
                return;

            _input.disabled = true;
            $lib.addClass(_instance.element, _classOption.DISABLED);
            _listBox.hide(true);
            _expandButton.disable();

            if (_clearButton)
                _clearButton.disable();
        }

        /** 
        * Enables the combo-box
        */
        this.enable = function ()
        {
            _instance.disabled = false;

            if (_instance.renderState < $base.static.RenderState.RENDERED)
                return;

            _input.disabled = false;
            $lib.removeClass(_instance.element, _classOption.DISABLED);
            _expandButton.enable();

            if (_clearButton)
                _clearButton.enable();
        }

        /** 
        * Sets the input to the specified value. With multi-select enabled, a comma separated list of item values can be specified.
        * @param {String|String[]} value The value(s) to set.
        * @param {Boolean} [focus] A value indicating if the input should get focus.
        */
        this.setValue = function (value, focus)
        {
            if (!_instance.itemList)
            {
                _instance.value = value;
                _initialValue = true;
                return;
            }

            var selectedItems = _instance.getSelectedItems();

            if (!$lib.isEmpty(selectedItems))
            {
                if (!$.isArray(selectedItems))
                    selectedItems = [selectedItems];

                var result = [];
                $lib.each(selectedItems, function (item) { result.push(item.id); });
                _instance.deselectItems(result);
            }

            if (!$lib.isEmpty(value))
            {
                var values = value.split(',');

                $lib.each(values, function (value)
                {
                    var item = _instance.itemList.getByValue(value);

                    if (item)
                        _instance.selectItem(item.id);
                });
            }

            if (focus)
                setFocus();
        }

        /** 
        * Sets the focus on the input element.
        */
        this.focus = function ()
        {
            setFocus();
        }

        /** 
        * Triggers a data load.
        * @param {Boolean} [clear] Defines if the current selection and input value should be cleared.
        * @param {Number} [pageIndex] Defines which page index to load.
        * @param {Boolean} [showListBox=true] Defines if the list box is shown.
        */
        this.load = function (clear, pageIndex, showListBox)
        {
            if (clear)
            {
                clearSelection();
                clearInput();
                clearList();
            }

            _lastQuery = null;
            load(pageIndex, showListBox, false);
        }

        /** 
        * Renders the component.
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'combo-box');
                return;
            }

            // render logic after loading resources
            // create default templates
            if (!_instance.hasTemplate('Default'))
                _instance.addTemplate('Default', '{checkBox}{icon}{text}', true);

            if (!_instance.hasTemplate('MultiSelectInput'))
                _instance.addTemplate('MultiSelectInput', '{count} items selected', true);

            draw();
        }

        /**
        * Executes the post render procedure.
        */
        this.postRender = function ()
        {
            if (_instance.renderState == $base.static.RenderState.RENDERED)
                return;

            // disable focusable command button because the text input should get focus instead
            _expandButton.getCommandButton().removeAttribute('tabindex');

            if (_expandButton.split)
                _expandButton.getExpandButton().removeAttribute('tabindex');

            toggleClearButton();
            bindInputEvents();
            autoGrow();

            if (!$base.methods.postRender.call(_instance)) // component got destroyed on postrender event
                return;

            if (_instance.itemList)
                dataLoaded();
            else if (_instance.loadOnRender)
                load(null, false, true);
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
            var script = ['Box', 'Button'];

            if (_instance.enableDataPager)
                script.push('DataPager');

            return ['ComboBox', script];
        }

        function setListBoxMinWidth()
        {
            var el = _listBox.element,
                devSize = $lib.borderAndPadding(el),
                r = /min-width:[^;]*(;|$)/gi,
                pos = el.style.position,
                important = el.style.getPropertyPriority('position');

            if (pos && important == 'important')
                pos += ' !' + important;

            el.style.position = "";
            var width = _expandButton.element.offsetWidth - devSize.width;
            el.style.position = pos;

            if (_listBox.style.match(r))
                _listBox.style = _listBox.style.replace(r, $lib.format('min-width:{0}px;', (width > 0) ? width : 0));
            else
            {
                if (_listBox.style && !$lib.endsWith(_listBox.style, ';'))
                    _listBox.style += ';';

                _listBox.style += $lib.format('min-width:{0}px;', (width > 0) ? width : 0);
            }
        }

        function bindInputEvents()
        {
            var input = _input;

            $lib.on(input, 'focus', inputFocus, input);
            $lib.on(input, 'focus', _instance.onFocus, _instance);
            $lib.on(input, 'blur', inputBlur, input);
            $lib.on(input, 'blur', _instance.onBlur, _instance);
            $lib.on(input, 'keydown', inputKeyDown, input);
            $lib.on(input, 'input', inputChanged, input);

            if (_instance.tooltipManagerId && _instance.tooltipId)
            {
                $UI.store[_instance.tooltipManagerId].addTrigger(input, _instance.tooltipId);
            }
        }

        function load(pageIndex, showListBox, initialLoad, onDemand)
        {
            var input = _input,
                value = input.value || _charValue || '',
                charStart, query = null;

            showListBox = (showListBox === false) ? false : true;

            query =
            {
                text: (!pageIndex) ? value : (_lastQuery) ? _lastQuery.text : '',
                pageIndex: pageIndex || 1
            };

            _instance.events.onPreLoadItemList.fire(_instance, query);
            charStart = _instance.loadOnDemandCharStart;

            if (!initialLoad && (!pageIndex && ((onDemand && charStart > 0 && value.length < charStart) || (_lastQuery && _lastQuery.text == value))))
                return;

            clearTimeout(_loadTimerId);
            _loadTimerId = null;
            _selectedItemId = _focusedItemId = null;
            _lastQuery = query;
            _loading = true;
            _charValue = '';

            if (_pager)
                _pager.hide();

            if (!_instance.keepSelectionOnReload)
                clearSelection();

            if (_instance.ajax.load && _instance.ajax.load.isDefined())
            {
                if (_ajax)
                    _ajax.abort();

                showPreloader();
                _ajax = _instance.ajaxCall('load', window.JSON.stringify(query), { onSuccess: function (args) { dataLoaded(pageIndex || -1, args, showListBox, onDemand); } });
            }
            else
                dataLoaded(null, null, showListBox, onDemand);
        }

        function dataLoaded(pageIndex, ajaxArgs, showListBox, onDemand)
        {
            var ajaxResult = null;

            _loading = false
            _onDemand = onDemand || false;

            if (ajaxArgs)
            {
                _instance.itemList = [];

                if (ajaxArgs.data)
                {
                    ajaxResult = (typeof ajaxArgs.data === 'string') ? window.JSON.parse(ajaxArgs.data) : ajaxArgs.data;
                    _instance.itemList = (ajaxResult) ? ajaxResult.itemList || [] : [];
                }
            }
            else if (_instance.itemList)
                _instance.itemList = (typeof _instance.itemList === 'string') ? window.JSON.parse(_instance.itemList) : _instance.itemList || [];

            setupItemList();
            setupPager(ajaxResult, pageIndex);
            _instance.events.onPostLoadItemList.fire(_instance, null);

            if (_instance.itemList.length > 0)
            {
                drawItemList(ajaxResult, onDemand);

                if (!_instance.loadOnDemand && _keyCode)
                    navigate();
            }
            else
                showNoResult();

            if (!onDemand)
                setMultiSelectValue();

            _onDemand = false;
            _initialValue = false;

            if (!_instance.itemList.length && !getList()?.childNodes.length)
                _listBox.hide(); // no point in showing empty list
            else
                _listBox.update(null, showListBox);

            if (_pendingCustomValue)
            {
                let value = _pendingCustomValue;
                _pendingCustomValue = null;
                addCustomValue(value);
            }

            _instance.events.onPostRenderItemList.fire(_instance, null);
        }

        function setupItemList()
        {
            if (!_instance.itemList)
                _instance.itemList = [];

            if (!_instance.itemList.getByValue)
                $base.static.ItemList.call(_instance.itemList);
        }

        function setupPager(ajaxResult, pageIndex)
        {
            if (_pager && ajaxResult && ajaxResult.totalItemCount && ajaxResult.totalItemCount > ajaxResult.itemList.length)
            {
                _pager.itemCount = ajaxResult.totalItemCount;

                if (pageIndex == -1)
                    _pager.setPageIndex(1);
                else
                    _pager.setPageIndex(pageIndex);

                _pager.show();
            }
            else if (_pager)
                _pager.hide();
        }

        function draw()
        {
            if (_instance.itemList && _instance.itemList.length == 0)
                _instance.itemList = null;

            if (_instance.multiSelect)
                $lib.addClass(_instance.element, _classOption.MULTISELECT);

            if (_instance.allowInput)
                $lib.addClass(_instance.element, _classOption.ALLOWINPUT);

            if (tagging())
                $lib.addClass(_instance.element, _classOption.TAGGING);

            if (_instance.autoGrow)
                $lib.addClass(_instance.element, _classOption.GROW);

            if (_instance.disabled)
                $lib.addClass(_instance.element, _classOption.DISABLED);

            if (!$lib.isEmpty(_instance.width))
                _instance.element.style.width = $lib.unit(_instance.width);

            createExpandButton();
            createListBox();
            _hidden = _instance.createSyncedInput(_instance.hiddenInputId, function ()
            {
                _instance.setValue(this.value);
            });

            _sizer = $lib.element(_instance.element);
            _sizer.className = _classOption.SIZER;
            _sizer.style.display = 'none';

            _instance.value = _instance.value || _hidden.value;

            if (!$lib.isEmpty(_instance.value))
            {
                _initialValue = true;
                _hidden.__setValue(_instance.value);
            }

            _instance.renderChildren();
        }

        function createExpandButton()
        {
            var id = _instance.id + '_Expand';
            _expandButton = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: _instance.element });

            _expandButton.transparentBorder = _expandButton.primary = false;
            _expandButton.clone($UI.store[_instance.expandButtonId], _instance);

            _expandButton.showing = true;
            _expandButton.textSelection = true;
            _expandButton.split = _instance.splitButton;
            _expandButton.cssClass = _expandButton.cssClass || _instance.cssClassExpandButton || _classOption.EXPANDBUTTON;
            _expandButton.boxId = (_expandButton.split) ? _instance.id + '_Box' : null;
            _expandButton.setContentTemplate(createContent());
            _expandButton.events.onPostRender.priorityAdd(() => { _instance.isReady.apply(_instance); }, null);
            _expandButton.disabled = _instance.disabled;
            _expandButton.delegateFocusEvents(_instance);

            if (!_expandButton.split)
            {
                _expandButton.events.onPointerDown.priorityAdd(function () { _allowHide = false; });

                _expandButton.command = function ()
                {
                    _allowHide = true;

                    if (_clearButtonClicked)
                    {
                        _clearButtonClicked = false;
                        _expandButton.deselect();
                        return;
                    }

                    if (_instance.disableExpandOnClick)
                    {
                        _expandButton.deselect();
                        return;
                    }

                    if ($lib.event.type != 'keydown' || $lib.event.key != ' ')
                        _listBox.toggle();
                };
            }
            else
            {
                _expandButton.events.onCommandPointerDown.priorityAdd(function () { if (_listBox.showing) { _allowHide = false; } });
            }
        }

        function createContent()
        {
            var arrContent = [], spanIcon, div;

            if (_instance.splitButton)
            {
                arrContent.push(createInput());
            }
            else
            {
                spanIcon = document.createElement('span');
                spanIcon.className = _instance.cssClassExpandIcon || _classOption.EXPANDICON;
                arrContent.push(createInput());
                arrContent.push(spanIcon);
            }

            if (!_instance.disableClearButton)
            {
                div = _instance.element.appendChild(document.createElement('div'));
                createClearButton(div);
                arrContent.push(_clearButton.containerElement);
            }

            return arrContent;
        }

        function createClearButton(container)
        {
            var id = _instance.id + '_Clear';
            _clearButton = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: container });

            _clearButton.clone($UI.store[_instance.clearButtonId], _instance);
            _clearButton.hasIcon = true;
            _clearButton.transparent = true;
            _clearButton.cssClass = _clearButton.cssClass || _instance.cssClassClearButton || _classOption.CLEARBUTTON;
            _clearButton.command = clearCommand;
            _clearButton.disabled = _instance.disabled;
            _clearButton.delegateFocusEvents(_instance);
            _clearButton.events.onPostRender.priorityAdd(() => { _instance.isReady.apply(_instance); }, null);
            _clearButton.events.onPostRender.priorityAdd(() => { _instance.isReady.apply(_instance); }, null);
            _clearButton.showing = true;
        }

        function createInput()
        {
            _input = document.createElement('input');

            _input.className = _input.style.cssText = '';
            _input.type = 'text';
            _input.autoComplete = 'off';
            _input.spellcheck = false;
            _input.setAttribute('autocomplete', 'off');
            _input.setAttribute('spellcheck', 'false');
            _input.placeholder = _instance.placeholder;

            if (_instance.disabled)
                _input.disabled = true;

            if (!_instance.allowInput)
                _input.readOnly = true;

            if (_instance.value)
                _input.value = _instance.value;

            return _input;
        }

        function createListBox()
        {
            var id = _instance.id + '_Box',
                box = $UI.createComponent(componyx.UI.Box, { id: id, containerElement: _instance.element }),
                divContainer = document.createElement('div'),
                divHeader = document.createElement('div'),
                divFooter = document.createElement('div'),
                ul = document.createElement('ul');

            _listBox = box;
            box.clone($UI.store[_instance.listBoxId], _instance);
            ul.className = _instance.cssClassList || _classOption.LIST;

            if (_instance.hasTemplate('Header') || _instance.hasTemplate('Footer') || _instance.enableDataPager)
            {
                if (_instance.hasTemplate('Header'))
                {
                    _instance.applyTemplate(divHeader, 'Header');
                    divHeader.className = _instance.cssClassHeader || _classOption.BOXHEADER;
                    divContainer.appendChild(divHeader);
                }

                divContainer.appendChild(ul);

                if (_instance.enableDataPager)
                    createDataPager(divContainer);

                if (_instance.hasTemplate('Footer'))
                {
                    _instance.applyTemplate(divFooter, 'Footer');
                    divFooter.className = _instance.cssClassFooter || _classOption.BOXFOOTER;
                    divContainer.appendChild(divFooter);
                }

                box.setContentTemplate(divContainer);
            }
            else
                box.setContentTemplate(ul);


            box.theme = $base.static.ThemeOption.NONE;
            box.cssClass = box.cssClass || _instance.cssClassListBox || _classOption.BOX;
            box.showing = false;
            box.hideOnOutsideClick = box.autoResizeFit = box.autoInvertFit = true;
            box.resizeToMaxHeight = false;
            box.expander = _expandButton.id;
            box.expandDirection = componyx.UI.Box.ExpandDirectionOption.DOWN;
            box.autoPosition = componyx.UI.Box.AutoPositionOption.EXPAND;
            box.events.onPostRender.priorityAdd(() => { _instance.isReady.apply(_instance); }, null);
            box.events.onPrePosition.priorityAdd(function (box)
            {
                $lib.removeClass(box.element, 'resized');
                getList().style.maxHeight = '';
            });

            box.events.onAutoFit.priorityAdd(function (box, args)
            {
                if (!args.resizedY)
                    return;

                var ul = getList(), height = 0, el = ul.parentNode.firstChild;

                $lib.addClass(box.element, 'resized');

                while (el)
                {
                    if (el != ul)
                        height += el.offsetHeight;

                    el = el.nextSibling;
                }

                el = ul;
                while (el != box.element.parentNode)
                {
                    height += $lib.borderAndPadding(el).height;
                    el = el.parentNode;
                }

                height = (box.element.offsetHeight - height);
                ul.style.maxHeight = (height > 0) ? $lib.unit(height) : $lib.unit(0);
            }, null);

            box.events.onHide.priorityAdd(function (box, args)
            {
                args.cancel = !_allowHide;
                _allowHide = true;

                if (!_expandButton.split)
                    _expandButton.deselect();
            });

            box.events.onHideComplete.priorityAdd(function ()
            {
                if (_instance.element && _instance.element.parentNode)
                {
                    if (!$lib.isEmpty(_focusedItemId))
                    {
                        $lib.removeClass(_elements[_focusedItemId], 'focus');

                        if (!$lib.isEmpty(_selectedItemId))
                            $lib.addClass(_elements[_selectedItemId], 'selected');
                    }
                }

                commitInputValue();
                _focusedItemId = null;
                _keyCode = null;
            });

            box.events.onShow.priorityAdd(function ()
            {
                setListBoxMinWidth();
            }, null);

            box.events.onShowComplete.priorityAdd(function ()
            {
                if (!_instance.element)
                    return;

                setFocus();

                if (_instance.loadOnDemand && (_instance.reloadOnExpand || $lib.isEmpty(_instance.itemList)))
                {
                    if (_instance.reloadOnExpand)
                        _lastQuery = null;

                    loadOnDemand(0);
                }
                else if (_keyCode)
                    navigate();
                else if (!$lib.isEmpty(_selectedItemId) && !$.isEmpty(_elements))
                    scrollToItem(_elements[_selectedItemId]);
            });
        }

        function createDataPager(divContainer)
        {
            var id = _instance.id + '_Pager';
            _pager = $UI.createComponent(componyx.UI.DataPager, { id: id, containerElement: divContainer });

            _pager.visiblePages = 0;
            _pager.pageSize = 25;

            _pager.clone($UI.store[_instance.dataPagerId], _instance);
            _pager.cssClass = _pager.cssClass || _instance.cssClassDataPager || _classOption.DATAPAGER;

            _pager.delegateFocusEvents(_instance);
            _pager.events.onPostRender.priorityAdd(() => { _instance.isReady.apply(_instance); }, null);
            _pager.events.onIndexChange.priorityAdd(pageIndexChange, null);

        }

        function pageIndexChange(pager, args)
        {
            load(args.pageIndex);
        }

        function inputFocus(input, e)
        {
            $lib.addClass(_instance.element, 'focus');

            if (_multiTemplateActive)
                input.value = '';

            if (input.value && _instance.allowInput)
                input.select();

            _instance.events.onInputFocus.fire(_instance, eventArgs(null));
        }

        function inputBlur(input)
        {
            $lib.removeClass(_instance.element, 'focus');

            if (!_listBox.showing)
            {
                commitInputValue();
            }

            _instance.events.onInputBlur.fire(_instance, eventArgs(null));
        }

        function commitInputValue()
        {
            const input = _input,
                selectedItem = _instance.getSelectedItem();

            if (_instance.multiSelect)
            {
                setMultiSelectValue();
            }
            else if (selectedItem && input.value !== selectedItem.text)
            {
                if (_instance.allowCustomValue)
                {
                    const value = input.value.trim();
                    clearSelection();
                    setInputValue(value);
                    _hidden.__setValue(value); // Set custom input value as selected value
                }
                else
                    input.value = selectedItem.text; // reset textual input to selected item text (is current selected value)
            }
            else if (!selectedItem)
            {
                if (_instance.allowCustomValue)
                    _hidden.__setValue(input.value); // Set custom input value as selected value
                else
                    $lib.fireEvent(_hidden, 'change'); // Fake change event otherwise there is no way to detect an invalid value was typed (validation, data-binding etc.)
            }
        }

        function inputKeyDown(input, e)
        {
            var key = e.key;

            autoGrow();

            if (e.ctrlKey)
                return;

            keyDownAction(key, e);
            toggleClearButton();
        }

        function keyDownAction(key, e)
        {
            var updateKeys = ' Backspace Delete ',
                isNavigate = (key == 'ArrowUp' || key == 'ArrowDown'),
                hasItems = _instance.itemList && _instance.itemList.length > 0,
                isChar = false, char;

            _keyCode = null;

            if (!_instance.loadOnDemand)
                updateKeys = updateKeys.replace(' Backspace Delete', '');

            if (key == 'Tab')
            {
                _allowHide = true;
                _listBox.hide();
                return;
            }

            isChar = key.match(/\s|\w|[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) != null || updateKeys.indexOf(key) > -1;

            if (isChar && updateKeys.indexOf(' ' + key + ' ') == -1)
                char = key;

            if (key == 'Enter' || (key == ' ' && !_instance.allowInput))
            {
                if (!$lib.isEmpty(_focusedItemId))
                {
                    (_focusedItemId == _selectAllId) ? selectAll() : toggleSelectItem(_focusedItemId);
                }
                else if (_instance.allowInput && _instance.allowCustomValue && _instance.multiSelect)
                {
                    const value = _input.value.trim();
                    if (!$lib.isEmpty(value))
                    {
                        if (_loading || _loadTimerId)
                            _pendingCustomValue = value; // itemList is stale mid-request, decide once fresh results arrive
                        else
                            addCustomValue(value);
                    }
                }

                if (!_instance.multiSelect)
                    _listBox.hide();

                e.preventDefault();
                return;
            }

            if (isNavigate || (!_instance.loadOnDemand && isChar))
            {
                if (isNavigate)
                    e.preventDefault();

                if (_listBox.showing && hasItems)
                {
                    if (navigate(key) === false)
                    {
                        e.preventDefault();
                        return;
                    }
                }
                else
                {
                    _keyCode = key;

                    if (hasItems)
                        _listBox.show();
                }
            }
            else if (_instance.loadOnDemand && isChar)
            {
                _charValue = '';

                if (updateKeys.indexOf(' ' + key + ' ') == -1)
                    _charValue = char;

                loadOnDemand();
            }

            autoGrow();
        }
        function inputChanged(input)
        {
            autoGrow();
            toggleClearButton();

            if ($lib.isEmpty(input.value))
            {
                if (_selectedItemId)
                {
                    deselectItem(_selectedItemId);
                }
                return;
            }

            if (_instance.loadOnDemand)
            {
                loadOnDemand();
            }
        }

        function autoGrow()
        {
            if (!_instance.autoGrow)
                return;

            var value = ($lib.isEmpty(_input.value)) ? _instance.placeholder : _input.value;

            _sizer.textContent = value.replace(/\s/g, '\xa0') + '\xa0\xa0\xa0\xa0';
            _sizer.style.display = 'inline-block';
            _input.style.width = $lib.unit(_sizer.offsetWidth);
            _sizer.style.display = 'none';
        }

        function loadOnDemand(delay = null)
        {
            clearTimeout(_loadTimerId);

            if (_loading)
                return;

            _loadTimerId = setTimeout(function () { load(null, null, null, true); }, (!$.isEmpty(delay)) ? delay : _instance.loadOnDemandDelay);
        }

        function navigate(keyCode)
        {
            if (!_instance.keyboardNavigation)
                return;

            var input = _input, value,
                itemList = _instance.itemList,
                itemId = _focusedItemId || _selectedItemId,
                id = '', item = null, selectRange = false,
                selectAll = (_instance.multiSelect && _instance.hasTemplate('SelectAll'));

            keyCode = (keyCode == undefined) ? _keyCode : keyCode; // active or cached keyCode

            if (_instance.allowInput)
            {
                if (_keyCode == null)
                {
                    const start = input.selectionStart, end = input.selectionEnd;
                    const hasSelection = start !== end;
                    if (hasSelection)
                        value = input.value.substring(0, start) + keyCode + input.value.substring(end);
                    else
                        value = ((start > 0) ? input.value.substr(0, start) : input.value) + keyCode;
                }
                else
                    value = input.value;
            }
            else
                value = keyCode;

            _keyCode = null;

            switch (keyCode)
            {
                case 'ArrowUp':

                    if (itemId == _selectAllId)
                        id = itemList[itemList.length - 1].id;
                    else if (!itemId || !(item = itemList.previous(itemId)))
                        id = (selectAll) ? _selectAllId : itemList[itemList.length - 1].id;
                    else
                        id = item.id;

                    if (id == _selectAllId)
                    {
                        focusSelectAll();
                        return;
                    }

                    break;

                case 'ArrowDown':

                    if (itemId == _selectAllId)
                        id = itemList[0].id;
                    else if (!itemId || !(item = itemList.next(itemId)))
                        id = (selectAll) ? _selectAllId : itemList[0].id;
                    else
                        id = item.id;

                    if (id == _selectAllId)
                    {
                        focusSelectAll();
                        return;
                    }

                    break;

                default:

                    itemId = (itemId != _selectAllId) ? itemId : '';
                    item = _instance.itemList.find(value, (!_instance.allowInput) ? itemId : null);

                    if (item)
                    {
                        id = item.id;

                        if (_instance.allowInput)
                            selectRange = true;
                    }

                    break;
            }

            if (!$lib.isEmpty(id))
                (_instance.multiSelect) ? focusItem(id, true) : selectItem(id, true);
            else if (!_instance.multiSelect && !$lib.isEmpty(_selectedItemId) && !_instance.allowCustomValue)
                deselectItem(_selectedItemId, false);

            if (selectRange)
                $lib.selectTextRange(input, value.length);

            return ($lib.isEmpty(id) || (_instance.multiSelect == true)); // do not accept key when item was selected
        }

        function drawItemList(ajaxResult, onDemand)
        {
            var li = null, ul = getList(),
                value = ',' + _instance.value + ',',
                filter = (_instance.allowInput && ajaxResult && ajaxResult.filteredColumns && !$lib.isEmpty(_lastQuery) && !$lib.isEmpty(_lastQuery.text)) ? true : false,
                item = null, select = false;

            _elements = {};
            ul.innerHTML = '';

            if (_instance.multiSelect && _instance.hasTemplate('SelectAll'))
            {
                var values = {},
                    checkBoxClass = _instance.cssClassItemCheckBox || _classOption.ITEMCHECKBOX;

                values['checkBox'] = $lib.format('<span class="{0}"></span>', checkBoxClass);
                ul.appendChild(li = document.createElement('li'));

                li.className = _instance.cssClassItemSelectAll || _classOption.ITEMSELECTALL;
                _instance.applyTemplate(li, _selectAllId, values);

                $lib.on(li, 'click', selectAll);
                $lib.on(li, 'pointerenter', focusSelectAll);

                _elements[_selectAllId] = li;
            }

            if (ajaxResult && ajaxResult.filteredColumns)
                _columnRegEx = {};

            for (var index = 0; index < _instance.itemList.length; ++index)
            {
                var itemOrg = _instance.itemList[index];

                if ($lib.isEmpty(itemOrg.id))
                    itemOrg.id = itemOrg.text.replace(/\s/g, '_');

                itemOrg.value = ($lib.isEmpty(itemOrg.value)) ? itemOrg.id : itemOrg.value;

                item = $lib.clone({}, itemOrg, true);
                item.text = $lib.encodeHTML(item.text);

                if (filter)
                    highlightMatch(item, ajaxResult);

                li = drawItem(item, index);

                if (item.selected || _selectedItems[item.id] || (_initialValue && value.indexOf(',' + item.value + ',') > -1))
                {
                    _forceSelect = select = true;
                    selectItem(item.id, true);
                }
            }

            if (!_instance.multiSelect && select && !onDemand)
                _listBox.hide();
        }

        function drawItem(item, index)
        {
            let ul = getList(),
                values = [],
                checkBoxClass, iconClass,
                li = document.createElement('li'), iconEl;

            if (_elements[item.id])
                ul.replaceChild(li, _elements[item.id]);
            else
                ul.appendChild(li);

            _elements[item.id] = li;

            _instance.events.onPreRenderItem.fire(_instance, eventArgs(item, null));
            checkBoxClass = item.cssClassCheckBox || _instance.cssClassItemCheckBox || _classOption.ITEMCHECKBOX,
                iconClass = item.cssClassIcon || _instance.cssClassItemIcon || _classOption.ITEMICON,
                values[0] = {};

            li.className = item.cssClass || _instance.cssClassItem || _classOption.ITEM;

            if ((index != undefined && index % 2 != 0) || (index == undefined && $lib.indexOf(ul.childNodes, li) % 2 != 0))
                $lib.addClass(li, 'odd');

            if (_instance.multiSelect)
                values[0]['checkBox'] = $lib.format('<span class="{0}"></span>', checkBoxClass);

            if (item.hasIcon)
                values[0]['icon'] = $lib.format('<i class="{0}"></i>', iconClass);

            values[1] = item;

            if (item.templateId || _instance.itemTemplateId)
                _instance.applyTemplate(li, item.templateId || _instance.itemTemplateId, values);
            else
                _instance.applyTemplate(li, 'Default', values);

            if ((iconEl = $lib(iconClass, li)[0]) && item.iconURL)
                iconEl.style.backgroundImage = 'url(' + item.iconURL + ')';

            if (item.disabled)
                disableItem(item.id);
            else if (_instance.tooltipManagerId && item.tooltip)
                addTooltip(li, item);

            bindItemEvents(li, item);

            _instance.events.onPostRenderItem.fire(_instance, eventArgs(item, null));
            return li;
        }

        function addTooltip(li, item)
        {
            const tooltipManager = $UI.store[_instance.tooltipManagerId],
                id = `${_instance.id}_${item.id}`;

            tooltipManager.addTooltip(id, tooltip);
            tooltipManager.addTrigger(li, id);
        }

        function bindItemEvents(li, item)
        {
            $lib.on(li, 'pointerenter', focusItem, [item.id, false]);
            $lib.on(li, 'click', function (itemId)
            {
                if (_instance.multiSelect)
                    toggleSelectItem(itemId);
                else
                    selectItem(itemId);

                _instance.events.onItemClick.fire(_instance, eventArgs(_instance.itemList.get(itemId)));
            }, item.id, _instance);
        }

        function highlightMatch(item, ajaxResult)
        {
            var match = '<b class="match">$1</b>';

            $lib.each(ajaxResult.filteredColumns, function (column, key)
            {
                if (!_columnRegEx[key])
                    _columnRegEx[key] = createRegEx(column.filter, column.value || _input.value);

                if (item[key])
                    item[key] = item[key].toString().replace(_columnRegEx[key], match);
                else if (item.attributes && item.attributes[key])
                    item.attributes[key] = item.attributes[key].toString().replace(_columnRegEx[key], match);
            });

            function createRegEx(filter, value)
            {
                value = $lib.escapeRegExp(value);

                switch (filter)
                {
                    case (_filterOption.STARTSWITH):
                        return new RegExp('^(' + value + ')', 'gi');
                        break;
                    case (_filterOption.CONTAINS):
                        return new RegExp('(' + value + ')', 'gi');
                        break;
                    case (_filterOption.EQUALS):
                        return new RegExp('^(' + value + ')$', 'gi');
                        break;
                    case (_filterOption.ENDSWITH):
                        return new RegExp('(' + value + ')$', 'gi');
                        break;
                }
            }
        }

        function showPreloader()
        {
            if (_instance.hasTemplate('Preloader'))
            {
                var li = document.createElement('li'),
                    ul = getList();
                ul.innerHTML = '';
                ul.appendChild(li);
                li.className = _instance.cssClassPreloader || _classOption.PRELOADER;
                _instance.applyTemplate(li, 'Preloader');
            }
        }

        function showNoResult()
        {
            var ul = getList();
            ul.innerHTML = '';

            if (_instance.hasTemplate('NoResult'))
            {
                var li = document.createElement('li');
                ul.appendChild(li);
                li.className = _instance.cssClassNoResult || _classOption.NORESULT;
                _instance.applyTemplate(li, 'NoResult');
            }
        }

        function eventArgs(item, e)
        {
            return { item: item, event: $lib.event }
        }

        function selectAll(id)
        {
            var id = _selectAllId,
                li = _elements[id],
                selected = $lib.hasClass(li, 'selected');

            $lib.toggleClass(li, 'selected');

            $lib.each(_instance.itemList, function (item)
            {
                if (selected)
                    deselectItem(item.id);
                else
                    selectItem(item.id);
            });

            if (selected)
                clearInput();
        }

        function focusSelectAll()
        {
            var id = _selectAllId;

            if (_focusedItemId)
                $lib.removeClass(_elements[_focusedItemId], 'focus');

            $lib.addClass(_elements[id], 'focus');
            _focusedItemId = id;
        }

        function focusItem(id, scroll, e)
        {
            var item = _instance.itemList.get(id);

            if (!_listBox.showing || id == _focusedItemId)
                return;

            if (_focusedItemId)
                $lib.removeClass(_elements[_focusedItemId], 'focus');

            $lib.addClass(_elements[id], 'focus');
            _focusedItemId = id;

            if (!$lib.isEmpty(_selectedItemId) && _selectedItemId != id)
            {
                $lib.removeClass(_elements[_selectedItemId], 'selected');
            }

            if (scroll)
                scrollToItem(_elements[id]);
        }

        function toggleSelectItem(id)
        {
            var item = _instance.itemList.get(id);

            if (_selectedItems[id])
                deselectItem(id);
            else
                selectItem(id);

            _forceSelect = false;
        }

        function selectItem(id, forceShow = false)
        {
            var item = _instance.itemList.get(id),
                li = _elements[id];

            if (item.disabled)
                return;

            if (!_forceSelect && item.selected)
            {
                if (!forceShow && _instance.collapseOnItemSelect)
                    _listBox.hide();

                return;
            }

            const selectionRestored = !!_selectedItems[id];

            item.selected = true;
            $lib.addClass(li, 'selected');

            if (_instance.multiSelect)
            {
                _selectedItems[id] = item;
                storeSelected();

                if (_instance.multiSelectTagging)
                    createTag(item);
            }
            else
            {
                clearSelection();
                _selectedItems[id] = item;

                if (!$lib.isEmpty(_focusedItemId))
                    $lib.removeClass(_elements[_focusedItemId], 'focus');

                _focusedItemId = null;
                _selectedItemId = id;
                _hidden.__setValue(item.value);

                if (_hidden.value === _instance.value)
                    _initialValue = false;

                if (!forceShow && _instance.collapseOnItemSelect)
                    _listBox.hide();
                else
                    scrollToItem(li);
            }

            if (!selectionRestored || !_instance.allowInput)
            {
                if (!tagging())
                    setInputValue(item.text, _instance.__focus);
                else
                    clearInput();
            }

            $lib.addClass(_instance.element, 'selected');
            toggleClearButton();
            _forceSelect = false;

            if (!selectionRestored)
                _instance.events.onItemSelect.fire(_instance, eventArgs(item));
        }

        function deselectItem(id, clearValue)
        {
            var item = _instance.itemList.get(id),
                li = _elements[id];

            if (item)
            {
                item.selected = false;
                _selectedItemId = null;
                $lib.removeClass(li, 'selected');
            }
            else // item was selected on previously loaded item-list
            {
                item = {};
                item.id = id; // for event arguments
            }

            delete _selectedItems[id];

            if (_instance.multiSelect)
            {
                storeSelected();

                if (_instance.multiSelectTagging)
                    removeTag(id);

                if (!_selectedCount)
                    $lib.removeClass(_instance.element, 'selected');
            }
            else
            {
                _hidden.__setValue('');
                $lib.removeClass(_instance.element, 'selected');
            }

            if (item.value === _instance.value)
                _initialValue = false;

            if (clearValue !== false && !tagging())
                setInputValue('', _instance.__focus);

            toggleClearButton();
            _instance.events.onItemDeselect.fire(_instance, eventArgs(item));
        }

        function disableItem(id)
        {
            var item = getItem(id);

            item.disabled = true;
            $lib.addClass(_elements[id], 'disabled');
        }

        function enableItem(id)
        {
            var item = getItem(id);

            item.disabled = false;
            $lib.removeClass(_elements[id], 'disabled');
        }

        function addCustomValue(value)
        {
            if (_selectedItems[value])
                return;

            setupItemList();

            let existingItem = _instance.itemList.getByText(value, true);

            if (existingItem && !existingItem.disabled)
            {
                selectItem(existingItem.id);
                clearInput();
                return;
            }

            let item = { id: value, value: value, text: value, selected: true, disabled: false };

            _selectedItems[value] = item;

            if (_instance.multiSelectTagging)
                createTag(item);

            storeSelected();
            clearInput();
            toggleClearButton();
            $lib.addClass(_instance.element, 'selected');
            _instance.events.onItemSelect.fire(_instance, eventArgs(item));
        }

        function createTag(item)
        {
            if (_tags[item.id])
                return;

            var button = $UI.createComponent(componyx.UI.Button, { id: getItemId(item.id), beforeElement: _input });

            _tags[item.id] = button;
            button.clone($UI.store[_instance.tagButtonId], _instance);
            button.primary = !_instance.allowInput;
            button.iconAlign = 2;
            button.hasIcon = true;
            button.transparentBorder = true;
            button.cssClass = _classOption.TAG;
            button.command = function (itemId)
            {
                $lib.event.stopPropagation();
                deselectItem(itemId);
            }.bind(_instance, item.id);
            button.delegateFocusEvents(_instance);

            if (_instance.hasTemplate('ItemTag'))
            {
                var content = $lib.element();
                _instance.applyTemplate(content, 'ItemTag', item);
                button.text = content.innerHTML;
            }
            else
                button.text = item.text;

            button.show();
        }

        function removeTag(id)
        {
            if (_tags[id])
            {
                _tags[id].destroy();
                delete _tags[id];
            }
        }

        function scrollToItem(li)
        {
            var ul = getList();
            ul.scrollTop = li.offsetTop - ul.offsetTop;
        }

        function getList()
        {
            return $lib(_instance.cssClassList || _classOption.LIST, _listBox.element, 'ul')[0];
        }

        function hasInputValue()
        {
            var input = _input;

            return (!$lib.isEmpty(input.value));
        }

        function setInputValue(text, focus)
        {
            var input = _input;

            if (!_instance.multiSelect || !_onDemand)
            {
                input.value = text;
                _multiTemplateActive = false;
                autoGrow();
            }

            if (focus)
                setFocus(input);
        }

        function setMultiSelectValue()
        {
            var input = _input;

            if (!input || tagging())
                return; // expand button containing input could be destoyed before the box (onHideComplete event) when the comboBox is destroyed

            if (_selectedCount > 1)
            {
                _instance.applyTemplate(input, 'MultiSelectInput', { 'count': _selectedCount });
                _multiTemplateActive = true;
            }
            else if (_selectedCount == 1)
                input.value = _instance.getSelectedItems()[0].text;

            autoGrow();
        }

        function setFocus(input)
        {
            input = input || _input;

            if ($lib.visible(input) && !input.hasFocus)
                input.focus();
        }

        function toggleClearButton()
        {
            if (_instance.disableClearButton)
                return;

            var show = (!$lib.isEmpty(_selectedItems) || hasInputValue());

            if (show)
                _clearButton.element.style.visibility = '';
            else
                _clearButton.element.style.visibility = 'hidden';
        }

        function storeSelected()
        {
            var sel = [];
            $lib.each(_selectedItems, function (item, key)
            {
                sel.push(item.value);
            });

            _selectedCount = sel.length;
            _hidden.__setValue((sel.length > 0) ? sel.join(',') : '');
        }

        function tagging()
        {
            return (_instance.multiSelect && _instance.multiSelectTagging);
        }

        function getItemId(id)
        {
            return $lib.format('{0}_{1}', _instance.id, id);
        }

        function getItem(itemId)
        {
            return (typeof (itemId) == 'string') ? _instance.itemList.get(itemId) : itemId;
        }

        function clearCommand()
        {
            _clearButtonClicked = true;
            _instance.events.onClear.fire(_instance, null);

            if (_instance.loadOnDemand)
                clearList();

            clear();

            _clearButton.element.style.visibility = 'hidden';
        }

        function clear()
        {
            clearSelection();
            clearInput();
        }

        function clearSelection()
        {
            const hasSelectedItems = Object.keys(_selectedItems).length > 0;

            if (hasSelectedItems)
            {
                for (const id in _selectedItems)
                {
                    deselectItem(id);
                }
            }
            else
            {
                _hidden.__setValue(''); // trigger change event
            }

            _selectedCount = 0;
        }

        function clearInput()
        {
            var input = _input;
            input.value = '';
            _lastQuery = null;

            if (_instance.loadOnDemand && _instance.loadOnRender)
                load(null, _listBox.showing, null, false);
        }

        function clearList()
        {
            _lastQuery = null;
            var ul = getList();
            ul.innerHTML = '';

            if (_instance.itemList)
                _instance.itemList.length = 0;

            if (_pager)
                _pager.hide();
        }

        function dispose()
        {
            if (_listBox)
                _listBox.hide(true);

            _pendingCustomValue = null;
            _listBox = null;
            _elements = {};
            _tags = {};
            _pager = _focusedItemId = _selectedItemId = _lastQuery = _expandButton = _clearButton = null;
            _selectedItems = {};
            _selectedCount = 0;
            _initialValue = _clearButtonClicked = false;
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.ComboBox.prototype = Object.create($base.methods);
    componyx.UI.ComboBox.prototype.constructor = componyx.UI.ComboBox;

    /**
    * FilterOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.ComboBox.FilterOption =
    {
        STARTSWITH: 0,
        CONTAINS: 1,
        EQUALS: 2,
        ENDSWITH: 3
    }

    /**
    * Creates an instance of the ComboBox item.
    * @class
    * @param {Object} properties The properties used to initialize the object.
    * @param {Boolean} properties.hasIcon Gets or sets a value indicating if the icon is displayed.
    * @param {String} properties.cssClassIcon Gets or sets the css class of the icon.
    * @param {String} properties.cssClassCheckBox Gets or sets the css class of the checkbox.
    * @param {String} properties.iconURL Gets or sets the icon URL.
    * @param {String} properties.tooltip Gets or sets the tooltip.
    * @augments componyx.UI.base.Item
    * @see {@link componyx.UI.base.Item}
    */
    componyx.UI.ComboBox.Item = function (properties)
    {
        this.hasIcon = false;
        this.cssClassIcon = null;
        this.cssClassCheckBox = null;
        this.iconURL = '';
        this.tooltip = '';

        $base.static.Item.call(this, properties);
    }
})(window);