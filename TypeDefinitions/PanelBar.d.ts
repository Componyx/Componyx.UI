declare namespace componyx 
{
    namespace UI
    {
        interface PanelBar extends Omit<componyx.UI.base.methods, 'render' | 'destroy' | 'cloneProperties' | 'postRender'> { }
        /**
         * <p>PanelBar class.</p>
         */
        class PanelBar extends componyx.UI.base.WebComponent
        {
            /**
             * Creates a new PanelBar instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id?: string, properties?: Partial<PanelBar> | HTMLElement);
            /**
             * <p>Internal CSS class name constants.
             * You can override any of these classes on the Component instance by defining a property named
             * <code>cssClass&lt;Key&gt;</code> where <Key> is the PascalCase key from this object.
             * Example:
             * 'PANEL' -&gt; 'cssClassPanel'
             * Be cautious: overriding these classes without including the default names may break styling and functionality.</p>
             */
            readonly classOption: Readonly<{
                PANEL: 'panel';
                ICON: 'icon';
                TITLE: 'title';
                CONTENT: 'content';
                EXPANDED: 'expanded';
                DISABLED: 'disabled';
            }>;
            /**
             * <p>Gets or sets a value indicating if a panel is expanded on the pointer enter event.</p>
             */
            expandOnPointerEnter: boolean;
            /**
             * <p>Gets or sets a value indicating if one panel or multiple panels can be expanded simultaneously.</p>
             */
            multiExpand: boolean;
            /**
             * <p>Gets or sets the panels to render inside the panel-bar.</p>
             */
            panels: PanelBar.Panel[];
            /**
             * <p>PanelBar events</p>
             */
            events: componyx.UI.PanelBar.PanelBarEvents;
            /**
             * <p>Gets the Panel class instance by the specified panel element.</p>
             * @param element - <p>The panel element.</p>
             */
            getPanelByElement(element: HTMLElement): PanelBar.Panel;
            /**
             * <p>Gets the Panel class instance by the specified id.</p>
             * @param id - <p>The panel identifier.</p>
             */
            getPanelById(id: string): PanelBar.Panel;
            /**
             * <p>Updates the title of the specified panel.</p>
             * @param panel - <p>The Panel instance, element, or identifier.</p>
             * @param title - <p>The title presented in the panel header.</p>
             */
            updatePanelTitle(panel: componyx.UI.PanelBar.Panel | HTMLElement | string, title: HTMLElement | DocumentFragment | string): void;
            /**
             * <p>Shows the specified panel.</p>
             * @param panel - <p>The Panel instance, element, or identifier.</p>
             */
            showPanel(panel: componyx.UI.PanelBar.Panel | HTMLElement | string): void;
            /**
             * <p>Hides the specified panel.</p>
             * @param panel - <p>The Panel instance, element, or identifier.</p>
             */
            hidePanel(panel: componyx.UI.PanelBar.Panel | HTMLElement | string): void;
            /**
             * <p>Toggles the expand/collapse state of the specified panel element.
             * If multiExpand is false, collapses all panels before expanding the selected one.</p>
             * @param panel - <p>The Panel instance, element, or identifier.</p>
             */
            toggleExpandPanel(panel: componyx.UI.PanelBar.Panel | HTMLElement | string): void;
            /**
             * <p>Expands the specified panel element by adding the expand CSS class.
             * Fires an event indicating the panel has expanded.</p>
             * @param panel - <p>The Panel instance, element, or identifier.</p>
             * @param instant - <p>A value indicating if the default CSS animation should be skipped.</p>
             */
            expandPanel(panel: componyx.UI.PanelBar.Panel | HTMLElement | string, instant: boolean): void;
            /**
             * <p>Collapses the specified panel element by removing the expand CSS class.
             * Fires an event indicating the panel has collapsed.</p>
             * @param panel - <p>The Panel instance, element, or identifier.</p>
             * @param instant - <p>A value indicating if the default CSS animation should be skipped.</p>
             */
            collapsePanel(panel: componyx.UI.PanelBar.Panel | HTMLElement | string, instant: boolean): void;
            /**
             * <p>Disables the specified panel.</p>
             * @param panel - <p>The Panel instance, element, or identifier.</p>
             */
            disablePanel(panel: componyx.UI.PanelBar.Panel | HTMLElement | string): void;
            /**
             * <p>Enables the specified panel.</p>
             * @param panel - <p>The Panel instance, element, or identifier.</p>
             */
            enablePanel(panel: componyx.UI.PanelBar.Panel | HTMLElement | string): void;
            /**
             * <p>Collapses all panels by removing the expand CSS class from all expanded panels.</p>
             * @param instant - <p>A value indicating if the default CSS animation should be skipped.</p>
             */
            collapseAllPanels(instant: boolean): void;
            /**
             * <p>Enables all panels.</p>
             */
            enableAllPanels(): void;
            /**
             * <p>Disables all panels.</p>
             */
            disableAllPanels(): void;
            /**
             * <p>Shows all panels.</p>
             */
            showAllPanels(): void;
            /**
             * <p>Hides all panels.</p>
             */
            hideAllPanels(): void;
            /**
             * <p>Renders the component.</p>
             */
            render(): void;
        }
        namespace PanelBar
        {
            /**
             * @property onPanelExpand - <p>Fires when a panel expands.</p>
             * @property onPanelCollapse - <p>Fires when a panel collapses.</p>
             */
            class PanelBarEvents extends componyx.UI.base.Events<componyx.UI.PanelBar>
            {
                constructor();
                /**
                 * <p>Fires when a panel expands.</p>
                */
                onPanelExpand: componyx.UI.base.Event<componyx.UI.PanelBar>;
                /**
                 * <p>Fires when a panel collapses.</p>
                */
                onPanelCollapse: componyx.UI.base.Event<componyx.UI.PanelBar>;
            }
            /**
             * <p>The Panel class.</p>
             * @property [id] - <p>Gets or sets the identifier of the panel.</p>
             * @property [expanded] - <p>Gets or sets a value indicating if this panel is expanded.</p>
             * @property [hasIcon] - <p>Gets or sets a value indicating if there is an icon in the panel header.</p>
             * @property [cssClass] - <p>Gets or sets the css class of the panel. This class is combined with the default class set on the PanelBar component.</p>
             * @property [cssClassIcon] - <p>Gets or sets the css class of the panel header icon. This class is combined with the default icon class set on the PanelBar component.</p>
             * @property [style] - <p>Gets or sets the css style of the panel.</p>
             * @property [maxHeight] - <p>Gets or sets the maximum height of the panel in the desired CSS units.</p>
             * @property [minHeight] - <p>Gets or sets the minimum height of the panel in the desired CSS units.</p>
             * @property title - <p>Gets or sets the title presented in the panel header.</p>
             * @property content - <p>Gets or sets the content of the panel.</p>
             * @property element - <p>Gets the rendered panel element.</p>
             * @property contentElement - <p>Gets the rendered panel content element.</p>
             * @param properties - <p>The properties used to initialize the object.</p>
             */
            class Panel
            {
                constructor(properties: any);
                /**
                 * <p>Gets or sets the identifier of the panel.</p>
                */
                id?: string;
                /**
                 * <p>Gets or sets a value indicating if this panel is expanded.</p>
                */
                expanded?: boolean;
                /**
                 * <p>Gets or sets a value indicating if there is an icon in the panel header.</p>
                */
                hasIcon?: boolean;
                /**
                 * <p>Gets or sets the css class of the panel. This class is combined with the default class set on the PanelBar component.</p>
                */
                cssClass?: string;
                /**
                 * <p>Gets or sets the css class of the panel header icon. This class is combined with the default icon class set on the PanelBar component.</p>
                */
                cssClassIcon?: string;
                /**
                 * <p>Gets or sets the css style of the panel.</p>
                */
                style?: string;
                /**
                 * <p>Gets or sets the minimum height of the panel in the desired CSS units.</p>
                */
                minHeight?: string;
                /**
                 * <p>Gets or sets the maximum height of the panel in the desired CSS units.</p>
                */
                maxHeight?: string;
                /**
                 * <p>Gets or sets the id of the template used for the panel content.</p>
                */
                templateId?: string;
                /**
                 * <p>Gets or sets the title presented in the panel header.</p>
                */
                title: HTMLElement | DocumentFragment | string;
                /**
                 * <p>Gets or sets the content of the panel.</p>
                */
                content: HTMLElement | DocumentFragment | string;
                /**
                 * <p>Gets the rendered panel element.</p>
                */
                element: HTMLElement;
                /**
                 * <p>Gets the rendered panel content element.</p>
                */
                contentElement: HTMLElement;
            }
        }
    }
}