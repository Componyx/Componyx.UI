declare namespace componyx 
{
	namespace UI
	{
		interface Button extends componyx.UI.base.methods { }
		/**
         * <p>Button class.</p>
         * @param id - <p>The id of the component.</p>
         * @param properties - <p>The properties used to initialize the component or the container element.</p>
         */
        class Button extends componyx.UI.base.Component implements componyx.UI.base.methods {
            constructor(id: string, properties: any | HTMLElement);
            /**
             * <p>Button events</p>
             */
            events: componyx.UI.Button.ButtonEvents;
            /**
             * <p>A value indicating if the last action was triggered via keyboard navigation.</p>
             */
            isKeyboardNavigation(): boolean;
            /**
             * <p>Selects the button</p>
             */
            toggleSelect(): void;
            /**
             * <p>Selects the button</p>
             */
            select(): void;
            /**
             * <p>Deselects the button</p>
             */
            deselect(): void;
            /**
             * <p>Enables the button</p>
             */
            enable(): void;
            /**
             * <p>Disables the button</p>
             * @param [keepSelected = false] - <p>A value indicating if the button must remain selected.</p>
             */
            disable(keepSelected?: boolean): void;
            /**
             * <p>Sets focus on the button.</p>
             */
            focus(): void;
            /**
             * <p>Removes focus from the button.</p>
             */
            blur(): void;
            /**
             * <p>Executes the command click event.</p>
             */
            commandClick(): void;
            /**
             * <p>Executes the command click event.</p>
             */
            expandClick(): void;
            /**
             * <p>Gets the command button element.</p>
             */
            getCommandButton(): HTMLElement;
            /**
             * <p>Gets the expand button element.</p>
             */
            getExpandButton(): HTMLElement | null;
            /**
             * <p>Updates the button content with the specified template or text</p>
             */
            updateContent(): void;
            /**
             * <p>Sets the content template.</p>
             * @param content - <p>The content template.</p>
             */
            setContentTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Renders the component</p>
             */
            render(): void;
            /**
             * <p>Handles the post render procedure.</p>
             */
            postRender(): void;
            /**
             * <p>Destroys the component.</p>
             * @param keepEvents - <p>A value indicating if the events must be kept.</p>
             * @param [removeElement = true] - <p>A value indicating if the element must be removed.</p>
             */
            destroy(keepEvents: boolean, removeElement?: boolean): void;
            /**
             * <p>The currently selected button per radio group id.</p>
             */
            static readonly RadioGroups: {
                readonly [radioGroupId: string]: componyx.UI.Button;
            };
            /**
             * <p>Gets the selected button for the specified radio group.</p>
             * @param radioGroupId - <p>The radio group id.</p>
             * @returns <p>The selected button, or undefined if no button in the group is selected.</p>
             */
            static getSelected(radioGroupId: string): componyx.UI.Button | undefined;
            /**
             * <p>Gets or sets the content align class. This class is followed by a hyphen (-) with the current align option and is appended to the button class. Default: content-left</p>
            */
            cssClassContentAlign: string;
            /**
             * <p>Gets or sets the icon align class. This class is followed by a hyphen (-) with the current align option and is appended to the button class. Default: icon-left</p>
            */
            cssClassIconAlign: string;
            /**
             * <p>Gets or sets the css class for a split button.</p>
            */
            cssClassSplit: string;
            /**
             * <p>Gets or sets the css class of the command button in a split button.</p>
            */
            cssClassCommand: string;
            /**
             * <p>Gets or sets the css class of the expand button in a split button.</p>
            */
            cssClassExpand: string;
            /**
             * <p>Gets or sets the css class of the expand icon in a split button.</p>
            */
            cssClassExpandIcon: string;
            /**
             * <p>Gets or sets the css class of the button icon.</p>
            */
            cssClassIcon: string;
            /**
             * <p>Gets or sets the css class of the content holder within the button.</p>
            */
            cssClassContentHolder: string;
            /**
             * <p>Gets or sets the shortcut key to trigger this button e.g. 'z', 'ctrl+z', 'alt+s'. If no modifier is provided, <code>ctrl</code> is assumed by default.</p>
            */
            shortcutKey: string | null;
            /**
             * <p>Gets or sets the DOM element (or its identifier, or a function returning it) within which this shortcut is active. If <code>null</code>, the shortcut is globally active (i.e., it works anywhere).</p>
            */
            shortcutScope: HTMLElement | string | ((...params: any[]) => any) | null;
            /**
             * <p>Gets or sets a value indicating if the button keyboard navigation for expanding/collapsing is enabled when it has an expandable feature (menuId, boxId or expandCommand).</p>
            */
            keyboardExpand: boolean;
            /**
             * <p>Gets or sets the href (hypertext reference) of the button. Applies to non-split buttons only.</p>
            */
            href: string | null;
            /**
             * <p>Gets or sets the href target of the button. Applies to non-split buttons only.</p>
            */
            target: string | null;
            /**
             * <p>Gets or sets the command action of the button.</p>
            */
            command: ((...params: any[]) => any) | string | null;
            /**
             * <p>Gets or sets an expand command action.</p>
            */
            expandCommand: ((...params: any[]) => any) | string | null;
            /**
             * <p>Gets or sets a collapse command action.</p>
            */
            collapseCommand: ((...params: any[]) => any) | string | null;
            /**
             * <p>Gets or sets the text of the button.</p>
            */
            text: string | null;
            /**
             * <p>Gets or sets if the icon span tag should be rendered.</p>
            */
            hasIcon: boolean;
            /**
             * <p>Gets or sets the URL of the icon.</p>
            */
            iconUrl: string | null;
            /**
             * <p>Gets or sets the size option.</p>
            */
            size: componyx.UI.Button.SizeOption;
            /**
             * <p>Gets or sets the content alignment option.</p>
            */
            contentAlign: componyx.UI.Button.AlignOption;
            /**
             * <p>Gets or sets the icon alignment option.</p>
            */
            iconAlign: componyx.UI.Button.AlignOption;
            /**
             * <p>Gets or sets the type of the button.</p>
            */
            type: componyx.UI.Button.TypeOption;
            /**
             * <p>Gets or sets the expand direction of the button.</p>
            */
            expandDirection: componyx.UI.Button.ExpandDirectionOption;
            /**
             * <p>Gets or sets the decoration type used when the button is hovered/selected.</p>
            */
            decoration: componyx.UI.Button.DecorationOption;
            /**
             * <p>Gets or sets the radio group id.</p>
            */
            radioGroupId: string | null;
            /**
             * <p>Gets or sets a value indicating if the identifier of the component is rendered in the HTML output of the root element.</p>
            */
            renderId: boolean;
            /**
             * <p>Gets or sets a value indicating whether the PostBack event is automatically fired.</p>
            */
            autoPostBack: boolean;
            /**
             * <p>Gets or sets a value indicating whether the button is disabled.</p>
            */
            disabled: boolean;
            /**
             * <p>Gets or sets a value indicating whether the button is selected.</p>
            */
            selected: boolean;
            /**
             * <p>Gets or sets a value indicating whether the button is in expanded state.</p>
            */
            expanded: boolean;
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
             * <p>Gets or sets a value indicating if the ripple animation is activated on a command/expand click event.</p>
            */
            rippleAnimation: boolean;
            /**
             * <p>Gets or sets which menu to expand when the expand button is clicked.</p>
            */
            menuId: string | null;
            /**
             * <p>Gets or sets a menu root item to expand on the corresponding menu when the expand button is clicked.</p>
            */
            menuItemId: string | null;
            /**
             * <p>Gets or sets which box to expand when the expand button is clicked.</p>
            */
            boxId: string | null;
            /**
             * <p>Gets or sets the tooltip manager used to display tooltips.</p>
            */
            tooltipManagerId: string | null;
            /**
             * <p>Gets or sets the id of the tooltip to show.</p>
            */
            tooltipId: string | null;
            /**
             * <p>Gets the element which contains the button content.</p>
            */
            readonly contentElement: HTMLElement;
        }
        namespace Button {
            /**
             * @property onFocus - <p>Fires when the button is focused.</p>
             * @property onBlur - <p>Fires when the button is blurred.</p>
             * @property onPointerEnter - <p>Fires on pointerenter.</p>
             * @property onPointerLeave - <p>Fires on pointerleave.</p>
             * @property onPointerDown - <p>Fires on pointerdown.</p>
             * @property onPointerUp - <p>Fires on pointerup.</p>
             * @property onDblClick - <p>Fires on double click.</p>
             * @property onSelect - <p>Fires on select.</p>
             * @property onDeselect - <p>Fires on deselect.</p>
             * @property onCommandClick - <p>Fires on command click.</p>
             * @property onCommandPointerEnter - <p>Fires on command pointerenter.</p>
             * @property onCommandPointerLeave - <p>Fires on command pointerleave.</p>
             * @property onCommandPointerDown - <p>Fires on command pointerdown.</p>
             * @property onCommandPointerUp - <p>Fires on command pointerup.</p>
             * @property onCommandDblClick - <p>Fires on command double click.</p>
             * @property onExpandClick - <p>Fires on expand click.</p>
             * @property onExpandPointerEnter - <p>Fires on expand pointerenter.</p>
             * @property onExpandPointerLeave - <p>Fires on expand pointerleave.</p>
             * @property onExpandPointerDown - <p>Fires on expand pointerdown.</p>
             * @property onExpandPointerUp - <p>Fires on expand pointerup.</p>
             * @property onExpandDblClick - <p>Fires on expand double click.</p>
             */
            class ButtonEvents extends componyx.UI.base.Events<componyx.UI.Button> {
                constructor();
                /**
                 * <p>Fires when the button is focused.</p>
                */
                onFocus: componyx.UI.base.Event<componyx.UI.Button, undefined>;
                /**
                 * <p>Fires when the button is blurred.</p>
                */
                onBlur: componyx.UI.base.Event<componyx.UI.Button, undefined>;
                /**
                 * <p>Fires on pointerenter.</p>
                */
                onPointerEnter: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on pointerleave.</p>
                */
                onPointerLeave: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on pointerdown.</p>
                */
                onPointerDown: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on pointerup.</p>
                */
                onPointerUp: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on double click.</p>
                */
                onDblClick: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on select.</p>
                */
                onSelect: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on deselect.</p>
                */
                onDeselect: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on command click.</p>
                */
                onCommandClick: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on command pointerenter.</p>
                */
                onCommandPointerEnter: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on command pointerleave.</p>
                */
                onCommandPointerLeave: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on command pointerdown.</p>
                */
                onCommandPointerDown: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on command pointerup.</p>
                */
                onCommandPointerUp: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on command double click.</p>
                */
                onCommandDblClick: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on expand click.</p>
                */
                onExpandClick: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on expand pointerenter.</p>
                */
                onExpandPointerEnter: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on expand pointerleave.</p>
                */
                onExpandPointerLeave: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on expand pointerdown.</p>
                */
                onExpandPointerDown: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on expand pointerup.</p>
                */
                onExpandPointerUp: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
                /**
                 * <p>Fires on expand double click.</p>
                */
                onExpandDblClick: componyx.UI.base.Event<componyx.UI.Button, componyx.UI.Button.ButtonEventArgs>;
            }
            /**
             * <p>Button event arguments.</p>
             */
            type ButtonEventArgs = {
                /** <p>The original event object.</p> */
                event: Event;
            };
            /**
             * <p>SizeOption</p>
             */
            enum SizeOption {
                SMALL = "s",
                MEDIUM = "m",
                LARGE = "l",
                XLARGE = "xl"
            }
            /**
             * <p>TypeOption</p>
             */
            enum TypeOption {
                COMMANDBUTTON = 0,
                CHECKBUTTON = 1,
                RADIOBUTTON = 2
            }
            /**
             * <p>ExpandDirectionOption</p>
             */
            enum ExpandDirectionOption {
                DOWN = 0,
                RIGHT = 1,
                UP = 2,
                LEFT = 3
            }
            namespace ExpandDirectionOption {
                /**
                 * <p>Gets the name of the specified value.</p>
                 * @param value - <p>The enum value.</p>
                 */
                function getName(value: componyx.UI.Button.ExpandDirectionOption): string;
            }
            /**
             * <p>AlignOption</p>
             */
            enum AlignOption {
                LEFT = 0,
                CENTER = 1,
                RIGHT = 2
            }
            namespace AlignOption {
                /**
                 * <p>Gets the name of the specified value.</p>
                 * @param value - <p>The enum value.</p>
                 */
                function getName(value: componyx.UI.Button.AlignOption): string;
            }
            /**
             * <p>DecorationOption</p>
             */
            enum DecorationOption {
                BACKGROUND = 0,
                UNDERLINE = 1,
                OVERLINE = 2,
                FRONTLINE = 3,
                BACKLINE = 4
            }
            namespace DecorationOption {
                /**
                 * <p>Gets the name of the specified value.</p>
                 * @param value - <p>The enum value.</p>
                 */
                function getName(value: componyx.UI.Button.DecorationOption): string;
            }
        }
    }
}