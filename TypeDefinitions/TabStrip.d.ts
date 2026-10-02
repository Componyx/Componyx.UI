declare namespace componyx 
{
    namespace UI
    {
        /**
        * <p>Namespace for tabstrip modules.</p>
        */
        namespace tabStrip_modules
        {
            /**
             * <p>Promise that resolves when all form modules are loaded asynchronously.</p>
             */
            var loaded: Promise<void>;
        }

        interface TabStrip extends componyx.UI.base.methods { }
        /**
         * <p>TabStrip class.</p>
         */
        class TabStrip extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new TabStrip instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<TabStrip> | HTMLElement);
            /**
             * <p>TabStrip events</p>
             */
            events: componyx.UI.TabStrip.TabStripEvents;
            /**
             * <p>Renders the component</p>
             */
            render(): void;
            /**
             * <p>Gets or sets a value indicating whether the PostBack event is automatically fired</p>
            */
            cssClassStrip: string;
            /**
             * <p>Gets or sets the default css class of an tab item button.</p>
            */
            cssClassItem: string;
            /**
             * <p>Gets or sets the default css class of the tab item button icon.</p>
            */
            cssClassItemIcon: string;
            /**
             * <p>Gets or sets the selected item id.</p>
            */
            selectedItemId: string;
            /**
             * <p>Gets or sets the tab alignment.</p>
            */
            alignment: componyx.UI.TabStrip.AlignmentOption;
            /**
             * <p>Gets or sets the id of the component from which the settings are cloned.</p>
            */
            buttonId: string | null;
            /**
             * <p>Gets or sets the list of items.</p>
            */
            itemList: componyx.UI.TabStrip.Item[];
        }
        namespace TabStrip
        {
            /**
             * @property onItemSelect - <p>Event which fires when a tab item is selected.</p>
             * @property onItemDeselect - <p>Event which fires when a tab item is deselected.</p>
             */
            class TabStripEvents extends componyx.UI.base.Events<componyx.UI.TabStrip>
            {
                constructor();
                /**
                 * <p>Event which fires when a tab item is selected.</p>
                */
                onItemSelect: componyx.UI.base.Event<componyx.UI.TabStrip, componyx.UI.TabStrip.ItemEventArgs>;
                /**
                 * <p>Event which fires when a tab item is deselected.</p>
                */
                onItemDeselect: componyx.UI.base.Event<componyx.UI.TabStrip, componyx.UI.TabStrip.ItemEventArgs>;
            }
            /**
             * <p>TabStrip item event arguments.</p>
             */
            type ItemEventArgs = {
                /** <p>The tab button.</p> */
                button: componyx.UI.Button;
                /** <p>The tab item.</p> */
                item: componyx.UI.TabStrip.Item;
                /** <p>The original event object.</p> */
                event: Event;
            };
            /**
             * <p>AlignmentOption</p>
             */
            enum AlignmentOption
            {
                TOP = 0,
                BOTTOM = 1
            }
            namespace AlignmentOption
            {
                /**
                 * <p>Gets the lowercase name of the option value.</p>
                 * @param value - <p>The enum value.</p>
                 */
                function getName(value: componyx.UI.TabStrip.AlignmentOption): string;
            }
            /**
             * <p>Creates an instance of the TabStrip item.</p>
             * @property content - <p>Gets or sets the content template of the item.</p>
             * @property hasIcon - <p>Gets or sets a value indicating if the item has an icon.</p>
             * @property cssClassIcon - <p>Gets or sets the css class of the icon.</p>
             * @property iconURL - <p>Gets or sets the URL of the icon.</p>
             * @property split - <p>Gets or sets a value indicating if the button has two actions.</p>
             * @property transparent - <p>Gets or sets a value indicating if the button's default background color is transparent.</p>
             * @property transparentBorder - <p>Gets or sets a value indicating if the button's default border color is transparent.</p>
             * @property primary - <p>Gets or sets a value indicating if the button is a primary button. When disabled the button's default style will be less prominent (basic) unless styled otherwise.</p>
             * @property decoration - <p>Gets or sets the decoration type used when the button is hovered/selected.</p>
             * @property menuId - <p>Gets or sets the id of the menu component.</p>
             * @property menuItemId - <p>Gets or sets the id of the menu item.</p>
             * @property boxId - <p>Gets or sets the id of the box component.</p>
             * @property buttonId - <p>Gets or sets the id of the button component.</p>
             * @param properties - <p>The properties used to initialize the object.</p>
             */
            class Item extends componyx.UI.base.static.Item
            {
                constructor(properties: any);
                /**
                 * <p>Gets or sets the content template of the item.</p>
                */
                content: HTMLElement[] | HTMLElement;
                /**
                 * <p>Gets or sets a value indicating if the item has an icon.</p>
                */
                hasIcon: boolean;
                /**
                 * <p>Gets or sets the css class of the icon.</p>
                */
                cssClassIcon: string;
                /**
                 * <p>Gets or sets the URL of the icon.</p>
                */
                iconURL: string;
                /**
                 * <p>Gets or sets a value indicating if the button has two actions.</p>
                */
                split: boolean;
                /**
                 * <p>Gets or sets a value indicating if the button's default background color is transparent.</p>
                */
                transparent: boolean;
                /**
                 * <p>Gets or sets a value indicating if the button's default border color is transparent.</p>
                */
                transparentBorder: boolean;
                /**
                 * <p>Gets or sets a value indicating if the button is a primary button. When disabled the button's default style will be less prominent (basic) unless styled otherwise.</p>
                */
                primary: boolean;
                /**
                 * <p>Gets or sets the decoration type used when the button is hovered/selected.</p>
                */
                decoration: Button.DecorationOption;
                /**
                 * <p>Gets or sets the id of the menu component.</p>
                */
                menuId: string;
                /**
                 * <p>Gets or sets the id of the menu item.</p>
                */
                menuItemId: string;
                /**
                 * <p>Gets or sets the id of the box component.</p>
                */
                boxId: string;
                /**
                 * <p>Gets or sets the id of the button component.</p>
                */
                buttonId: string;
            }
        }
    }
}