declare namespace componyx 
{
	namespace UI
	{
		interface ComboBox extends componyx.UI.base.methods { }		
		/**
         * <p>ComboBox class.</p>
         */
        class ComboBox extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new ComboBox instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<ComboBox> | HTMLElement);
			ajax: componyx.UI.base.Component['ajax'] & {
				/**
				 * <p>AJAX method used to load items on demand.</p>
				 */
				load: componyx.UI.base.AjaxMethod;
			};
            /**
             * <p>ComboBox events</p>
             */
            events: componyx.UI.ComboBox.ComboBoxEvents;
            /**
             * <p>Sets the header template.</p>
             * @param content - <p>HTML string or element node as content. Pass null or empty string to remove the existing template.</p>
             */
            setHeaderTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the footer template.</p>
             * @param content - <p>HTML string or element node as content. Pass null or empty string to remove the existing template.</p>
             */
            setFooterTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the select all checkbox template. The template supports the below listed interpolations.</p>
             * <ul>
             * <li>{checkBox} This value will be replaced with the checkbox element to select all items.</li>
             * </ul>
             * @param content - <p>HTML string or element node as content. Pass null or empty string to remove the existing template.</p>
             */
            setSelectAllTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the multiselect input template. The template supports the below listed interpolations. Default value: {count} items selected</p>
             * <ul>
             * <li>{count} This value will be replaced with the selected item count.</li>
             * </ul>
             * @param content - <p>HTML string or element node as content. Pass null or empty string to remove the existing template.</p>
             */
            setMultiSelectInputTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the preloader template.</p>
             * @param content - <p>HTML string or element node as content. Pass null or empty string to remove the existing template.</p>
             */
            setPreloaderTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the no result template.</p>
             * @param content - <p>Text string. Pass null or empty string to remove the existing template.</p>
             */
            setNoResultTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the multi-select item tag template. The template supports all data-item interpolations (view Base method comment). Default value: {text}.</p>
             * @param content - <p>HTML string or element node as content. Pass null or empty string to remove the existing template.</p>
             */
            setItemTagTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the placeholder text.</p>
             * @param text - <p>The placeholder text.</p>
             */
            setPlaceholder(text: string): void;
            /**
             * <p>Selects/deselects the item with the specified id.</p>
             * @param id - <p>The item identifier.</p>
             */
            toggleSelectItem(id: string): void;
            /**
             * <p>Selects the items with the specified id.</p>
             * @param ids - <p>The list of item ids.</p>
             */
            selectItems(ids: any[]): void;
            /**
             * <p>Deselects the items with the specified id.</p>
             * @param ids - <p>The list of item ids.</p>
             */
            deselectItems(ids: any[]): void;
            /**
             * <p>Selects the item with the specified id.</p>
             * @param id - <p>The item identifier.</p>
             */
            selectItem(id: string): void;
            /**
             * <p>Deselects the item with the specified id.</p>
             * @param id - <p>The item identifier.</p>
             */
            deselectItem(id: string): void;
            /**
             * <p>Enables the item with the specified id.</p>
             * @param id - <p>The item identifier.</p>
             */
            enableItem(id: string): void;
            /**
             * <p>Disables the item with the specified id.</p>
             * @param id - <p>The item identifier.</p>
             */
            disableItem(id: string): void;
            /**
             * <p>Gets the list-item element for the specified item id.</p>
             * @param id - <p>The item identifier.</p>
             * @returns <p>The list item element.</p>
             */
            getItemElement(id: string): HTMLElement;
            /**
             * <p>Gets the box component which serves as item list container.</p>
             * @returns <p>The Box component.</p>
             */
            getListBox(): componyx.UI.Box;
            /**
             * <p>Shows the listbox.</p>
             */
            showListBox(): void;
            /**
             * <p>Hides the listbox.</p>
             */
            hideListBox(): void;
            /**
             * <p>Gets the selected item.</p>
             * @returns <p>The selected item.</p>
             */
            getSelectedItem(): componyx.UI.ComboBox.Item;
            /**
             * <p>Gets the selected items in a multiselect combobox.</p>
             * @returns <p>The selected items.</p>
             */
            getSelectedItems(): componyx.UI.ComboBox.Item[];
            /**
             * <p>Gets the selected value.</p>
             * @returns <p>The selected value;</p>
             */
            getValue(): string;
            /**
             * <p>Clears the input value and the selected item(s).</p>
             */
            clear(): void;
            /**
             * <p>Clears the selected item(s).</p>
             */
            clearSelection(): void;
            /**
             * <p>Clears the input.</p>
             */
            clearInput(): void;
            /**
             * <p>Clears the item list.</p>
             */
            clearList(): void;
            /**
             * <p>Gets the input element.</p>
             * @returns <p>The input element.</p>
             */
            getInput(): HTMLElement;
            /**
             * <p>Disables the combo-box</p>
             */
            disable(): void;
            /**
             * <p>Enables the combo-box</p>
             */
            enable(): void;
            /**
             * <p>Sets the input to the specified value. With multi-select enabled, a comma separated list of item values can be specified.</p>
             * @param value - <p>The value(s) to set.</p>
             * @param [focus] - <p>A value indicating if the input should get focus.</p>
             */
            setValue(value: string | String[], focus?: boolean): void;
            /**
             * <p>Sets the focus on the input element.</p>
             */
            focus(): void;
            /**
             * <p>Triggers a data load.</p>
             * @param [clear] - <p>Defines if the current selection and input value should be cleared.</p>
             * @param [pageIndex] - <p>Defines which page index to load.</p>
             * @param [showListBox = true] - <p>Defines if the list box is shown.</p>
             */
            load(clear?: boolean, pageIndex?: number, showListBox?: boolean): void;
            /**
             * <p>Renders the component.</p>
             */
            render(): void;
            /**
             * <p>Destroys the component.</p>
             */
            destroy(): void;
            /**
             * <p>Gets or sets the css class of the expand button component.</p>
            */
            cssClassExpandButton: string;
            /**
             * <p>Gets or sets the css class of the expand icon.</p>
            */
            cssClassExpandIcon: string;
            /**
             * <p>Gets or sets the css class of the clear button component.</p>
            */
            cssClassClearButton: string;
            /**
             * <p>Gets or sets the css class of the datapager component.</p>
            */
            cssClassDataPager: string;
            /**
             * <p>Gets or sets the css class of the list box component.</p>
            */
            cssClassListBox: string;
            /**
             * <p>Gets or sets the css class of the unordered list.</p>
            */
            cssClassList: string;
            /**
             * <p>Gets or sets the css class of the list box header (default: 'header header-label').</p>
             */
            cssClassHeader: string;
            /**
             * <p>Gets or sets the css class of the list box footer (default: 'footer').</p>
             */
            cssClassFooter: string;
            /**
             * <p>Gets or sets the default css class of an item.</p>
            */
            cssClassItem: string;
            /**
             * <p>Gets or sets the css class of an item icon.</p>
            */
            cssClassItemIcon: string;
            /**
             * <p>Gets or sets the css class of an item checkbox.</p>
            */
            cssClassItemCheckBox: string;
            /**
             * <p>Gets or sets the css class of the 'select all' checkbox item.</p>
            */
            cssClassItemSelectAll: string;
            /**
             * <p>Gets or sets the css class of the preloader container.</p>
            */
            cssClassPreloader: string;
            /**
             * <p>Gets or sets the css class of the noresult container.</p>
            */
            cssClassNoResult: string;
            /**
             * <p>Gets or sets the identifying css class of a column.</p>
            */
            columnIdentifyingCssClass: string;
            /**
             * <p>Gets or sets the default template id of an item.</p>
            */
            itemTemplateId: string | null;
            /**
             * <p>Gets or sets a value indicating whether textual input is allowed.</p>
            */
            allowInput: boolean;
            /**
            * <p>Gets or sets a value indicating whether users can enter values not in the option list.</p>
            */
            allowCustomValue: boolean;
            /**
             * <p>Gets or sets a value indicating whether multiple items can be selected through checkboxes.</p>
            */
            multiSelect: boolean;
            /**
             * <p>Gets or sets a value indicating whether the combo box uses a split button.</p>
             */
            splitButton: boolean;
            /**
             * <p>Gets or sets a value indicating whether selected items are displayed as tags.</p>
            */
            multiSelectTagging: boolean;
            /**
             * <p>Gets or sets a value indicating if the input box will increase width automatically based on the size of the text.</p>
            */
            autoGrow: boolean;
            /**
             * <p>Gets or sets a value indicating whether keyboard navigation is allowed.</p>
            */
            keyboardNavigation: boolean;
            /**
             * <p>Gets or sets a value indicating whether the list box is collapsed on an item select.</p>
            */
            collapseOnItemSelect: boolean;
            /**
             * <p>Gets or sets a value indicating whether the data is loaded (through AJAX or by custom handling of the onPreLoadItemList event) when the component is rendering.</p>
            */
            loadOnRender: boolean;
            /**
             * <p>Gets or sets a value indicating whether the data is loaded (through AJAX or by custom handling of the onPreLoadItemList) when the text input is changed or the list box is expanded.</p>
            */
            loadOnDemand: boolean;
            /**
             * <p>Gets or sets a value indicating whether the data is reloaded when the list box is expanded.</p>
            */
            reloadOnExpand: boolean;
            /**
             * <p>Gets or sets the amount of characters required before a load on demand is performed.</p>
            */
            loadOnDemandCharStart: number;
            /**
             * <p>Gets or sets the delay in milliseconds on a keydown event before a load on demand is performed.</p>
            */
            loadOnDemandDelay: number;
            /**
             * <p>Gets or sets a value indicating whether the clear button is disabled.</p>
            */
            disableClearButton: boolean;
            /**
             * <p>Gets or sets a value indicating whether the datapager is enabled.</p>
            */
            enableDataPager: boolean;
            /**
             * <p>Gets or sets a value indicating whether the combobox is disabled.</p>
            */
            disabled: boolean;
            /**
             * <p>Gets or sets a value indicating whether the current selection must be kept when reloading data.</p>
            */
            keepSelectionOnReload: boolean;
            /**
             * <p>Gets or sets a value indicating whether the list box can only be expanded by typing, not by clicking the expand button.</p>
            */
            disableExpandOnClick: boolean;
            /**
             * <p>Gets or sets the placeholder which is visible when the input box has no value.</p>
            */
            placeholder: string;
            /**
             * <p>Gets or sets the input width in the specified unit.</p>
            */
            width: string;
            /**
             * <p>Gets or sets the name of the hidden input field which contains the selected value(s).</p>
            */
            name: string;
            /**
             * <p>Gets or sets the initial selected value.</p>
            */
            value: string;
            /**
             * <p>Gets or sets the list of items.</p>
            */
            itemList: ComboBox.Item[] | null;
            /**
             * <p>Gets or sets the tooltip manager used to display tooltips.</p>
            */
            tooltipManagerId: string | null;
            /**
             * <p>Gets or sets the id of the tooltip to show.</p>
            */
            tooltipId: string | null;
            /**
             * <p>Gets or sets the id of the expand button from which the settings are cloned.</p>
            */
            expandButtonId: string | null;
            /**
             * <p>Gets or sets the id of the clear button from which the settings are cloned.</p>
            */
            clearButtonId: string | null;
            /**
             * <p>Gets or sets the id of the tag button from which the settings are cloned.</p>
            */
            tagButtonId: string | null;
            /**
             * <p>Gets or sets the id of the list box from which the settings are cloned.</p>
            */
            listBoxId: string | null;
            /**
             * <p>Gets or sets the id of the list datapager from which the settings are cloned.</p>
            */
            dataPagerId: string | null;
            /**
             * <p>Gets or sets or sets the id of the HTML hidden input.</p>
            */
            hiddenInputId: string | null;
        }
        namespace ComboBox {
            /**
             * @property onFocus - <p>Event which fires when the combobox is focused.</p>
             * @property onBlur - <p>Event which fires when the combobox is blurred.</p>
             * @property onInputFocus - <p>Event which fires on the focus event of the input textbox.</p>
             * @property onInputBlur - <p>Event which fires on the blur event of the input textbox.</p>
             * @property onItemClick - <p>Event which fires on an item click.</p>
             * @property onItemSelect - <p>Event which fires on an item select.</p>
             * @property onItemDeselect - <p>Event which fires on an item deselect.</p>
             * @property onClear - <p>Event which fires when the clear button is clicked.</p>
             * @property onPreLoadItemList - <p>Event which fires before the item-list data is loaded.</p>
             * @property onPostLoadItemList - <p>Event which fires when the item-list data is loaded.</p>
             * @property onPostRenderItemList - <p>Event which fires when the item-list is rendered.</p>
             * @property onPreRenderItem - <p>Event which fires when an item is rendered.</p>
             * @property onPostRenderItem - <p>Event which fires when an item is rendered.</p>
             */
            class ComboBoxEvents extends componyx.UI.base.Events<componyx.UI.ComboBox> {
                constructor();
                /**
                 * <p>Event which fires when the combobox is focused.</p>
                */
                onFocus: componyx.UI.base.Event<componyx.UI.ComboBox, undefined>;
                /**
                 * <p>Event which fires when the combobox is blurred.</p>
                */
                onBlur: componyx.UI.base.Event<componyx.UI.ComboBox, undefined>;
                /**
                 * <p>Event which fires on the focus event of the input textbox.</p>
                */
                onInputFocus: componyx.UI.base.Event<componyx.UI.ComboBox, componyx.UI.ComboBox.ComboBoxItemEventArgs>;
                /**
                 * <p>Event which fires on the blur event of the input textbox.</p>
                */
                onInputBlur: componyx.UI.base.Event<componyx.UI.ComboBox, componyx.UI.ComboBox.ComboBoxItemEventArgs>;
                /**
                 * <p>Event which fires on an item click.</p>
                */
                onItemClick: componyx.UI.base.Event<componyx.UI.ComboBox, componyx.UI.ComboBox.ComboBoxItemEventArgs>;
                /**
                 * <p>Event which fires on an item select.</p>
                */
                onItemSelect: componyx.UI.base.Event<componyx.UI.ComboBox, componyx.UI.ComboBox.ComboBoxItemEventArgs>;
                /**
                 * <p>Event which fires on an item deselect.</p>
                */
                onItemDeselect: componyx.UI.base.Event<componyx.UI.ComboBox, componyx.UI.ComboBox.ComboBoxItemEventArgs>;
                /**
                 * <p>Event which fires when the clear button is clicked.</p>
                */
                onClear: componyx.UI.base.Event<componyx.UI.ComboBox, null>;
                /**
                 * <p>Event which fires before the item-list data is loaded.</p>
                */
                onPreLoadItemList: componyx.UI.base.Event<componyx.UI.ComboBox, componyx.UI.ComboBox.ComboBoxQueryEventArgs>;
                /**
                 * <p>Event which fires when the item-list data is loaded.</p>
                */
                onPostLoadItemList: componyx.UI.base.Event<componyx.UI.ComboBox, null>;
                /**
                 * <p>Event which fires when the item-list is rendered.</p>
                */
                onPostRenderItemList: componyx.UI.base.Event<componyx.UI.ComboBox, null>;
                /**
                 * <p>Event which fires when an item is rendered.</p>
                */
                onPreRenderItem: componyx.UI.base.Event<componyx.UI.ComboBox, componyx.UI.ComboBox.ComboBoxItemEventArgs>;
                /**
                 * <p>Event which fires when an item is rendered.</p>
                */
                onPostRenderItem: componyx.UI.base.Event<componyx.UI.ComboBox, componyx.UI.ComboBox.ComboBoxItemEventArgs>;
            }
            /**
             * <p>ComboBox item event arguments.</p>
             */
            type ComboBoxItemEventArgs = {
                /** <p>The combobox item, null for the input focus/blur events.</p> */
                item: componyx.UI.ComboBox.Item | null;
                /** <p>The original event object.</p> */
                event: Event;
            };
            /**
             * <p>ComboBox load query event arguments.</p>
             */
            type ComboBoxQueryEventArgs = {
                /** <p>The search text.</p> */
                text: string;
                /** <p>The page index (1-based).</p> */
                pageIndex: number;
            };
            /**
             * <p>FilterOption</p>
             */
            enum FilterOption {
                STARTSWITH = 0,
                CONTAINS = 1,
                EQUALS = 2,
                ENDSWITH = 3
            }
            /**
             * <p>Creates an instance of the ComboBox item.</p>
             * @param properties - <p>The properties used to initialize the object.</p>
             * @param properties.hasIcon - <p>Gets or sets a value indicating if the icon is displayed.</p>
             * @param properties.cssClassIcon - <p>Gets or sets the css class of the icon.</p>
             * @param properties.cssClassCheckBox - <p>Gets or sets the css class of the checkbox.</p>
             * @param properties.iconURL - <p>Gets or sets the icon URL.</p>
             * @param properties.tooltip - <p>Gets or sets the tooltip.</p>
             */
            class Item extends componyx.UI.base.static.Item {
                constructor(properties?: Partial<componyx.UI.ComboBox.Item>);
                /** <p>Gets or sets a value indicating if the icon is displayed.</p> */
                hasIcon: boolean;
                /** <p>Gets or sets the css class of the icon.</p> */
                cssClassIcon: string | null;
                /** <p>Gets or sets the css class of the checkbox.</p> */
                cssClassCheckBox: string | null;
                /** <p>Gets or sets the icon URL.</p> */
                iconURL: string;
                /** <p>Gets or sets the tooltip.</p> */
                tooltip: string;
            }
        }
	}
}