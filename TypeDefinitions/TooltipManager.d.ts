declare namespace componyx 
{
    namespace UI
    {
        interface TooltipManager extends componyx.UI.base.methods { }
        /**
         * <p>TooltipManager class.</p>
         */
        class TooltipManager extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new TooltipManager instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<TooltipManager> | HTMLElement);
            /**
             * <p>Gets the instance of the Box component used to display the tooltips.</p>
             * @param [tooltipId] - <p>Id of the tooltip template.</p>
             * @returns <p>The Box component used to display the tooltips.</p>
             */
            getBox(tooltipId?: string): componyx.UI.Box;
            /**
             * <p>Gets the active trigger id.</p>
             * @param [tooltipId] - <p>Id of the tooltip template.</p>
             * @returns <p>The active trigger id.</p>
             */
            activeTriggerId(tooltipId?: string): string | HTMLElement;
            /**
             * <p>Adds a tooltip template.</p>
             * @param id - <p>Id of the tooltip template.</p>
             * @param content - <p>Template content.</p>
             * @param [cloneable] - <p>Defines if the template can be cloned for multiple views. Defaults to true.</p>
             */
            addTooltip(id: string, content: HTMLElement | HTMLElement[] | DocumentFragment | string, cloneable?: boolean): void;
            /**
             * <p>Removes a tooltip template.</p>
             * @param id - <p>Id of the tooltip template.</p>
             * @param [keepTriggers = false] - <p>A value indicating if the tooltip triggers should be kept.</p>
             */
            removeTooltip(id: string, keepTriggers?: boolean): void;
            /**
             * <p>Adds a tooltip trigger.</p>
             * @param triggerId - <p>The trigger element or element id that triggers the tooltip display.</p>
             * @param tooltipId - <p>The id of the tooltip template.</p>
             * @param [showOnPointerEvent] - <p>Gets or sets a value which defines on which pointer event the tooltip is shown.</p>
             * @param [showOnFocus] - <p>Sets a value indicating if the tooltip is shown on a focus event.</p>
             * @param [showOnBlur] - <p>Sets a value indicating if the tooltip is shown on a blur event.</p>
             */
            addTrigger(triggerId: string | HTMLElement, tooltipId: string, showOnPointerEvent?: componyx.UI.TooltipManager.PointerEventOption, showOnFocus?: boolean, showOnBlur?: boolean): void;
            /**
             * <p>Removes a tooltip trigger.</p>
             * @param triggerId - <p>The trigger element or element id that triggers the tooltip display.</p>
             */
            removeTrigger(triggerId: string | HTMLElement): void;
            /**
             * <p>Shows the tooltip with the specified triggerId.</p>
             * @param triggerId - <p>The trigger element or element id that triggers the tooltip display.</p>
             * @param [fromPointerDown] - <p>Set to true when called from a pointerdown handler, so the tooltip is not hidden by the pointerdown on the document that follows. Defaults to false.</p>
             */
            showTooltip(triggerId: string | HTMLElement, fromPointerDown?: boolean): void;
            /**
             * <p>Hides the tooltip with the specified triggerId.</p>
             * @param [triggerId] - <p>The trigger element or element id that triggered the tooltip. When a value is provided the tooltip is hidden only if current trigger id matches the specified value.</p>
             * @param [instant] - <p>A value indicating if the tooltip should be hidden instantly without animation.</p>
             */
            hideTooltip(triggerId?: string, instant?: boolean): void;
            /**
             * <p>Hides all tooltips.</p>
             * @param [instant] - <p>A value indicating if the tooltip should be hidden instantly without animation.</p>
             */
            hideAllTooltips(instant?: boolean): void;
            /**
             * <p>Sets a value indicating if tooltip hiding is allowed.</p>
             * @param [value] - <p>A value indicating if tooltip hiding is allowed.</p>
             */
            allowHide(value?: boolean): void;
            /**
             * <p>Renders the component.</p>
             */
            render(): void;
            /**
             * <p>Destroys the component.</p>
             * @param keepEvents - <p>A value indicating if component events should be kept.</p>
             * @param [removeElement = true] - <p>A value indicating if the corresponding HTML Element should be removed.</p>
             */
            destroy(keepEvents: boolean, removeElement?: boolean): void;
            /**
             * <p>Gets or sets the css class of the tooltip box.</p>
            */
            cssClassBox: string;
            /**
             * <p>Gets or sets the time in ms that tooltips remains visible (0 to keep visible).</p>
            */
            visibleDuration: number | null;
            /**
             * <p>Gets or sets a value which defines on which pointer event the tooltip is shown.</p>
            */
            showOnPointerEvent: componyx.UI.TooltipManager.PointerEventOption;
            /**
             * <p>Gets or sets a value indicating if the tooltip is shown on a focus event.</p>
            */
            showOnFocus: boolean;
            /**
             * <p>Gets or sets a value indicating if the tooltip is shown on a blur event.</p>
            */
            showOnBlur: boolean;
            /**
             * <p>Gets or sets a value indicating if tooltip content is selectable, which means that the tooltip will remain visible on a pointer enter/click event.</p>
            */
            selectableTooltipContent: boolean;
            /**
             * <p>Gets or sets the time in ms before the tooltip is displayed.</p>
            */
            showDelay: number;
            /**
             * <p>Gets or sets the time in ms before the tooltip is hidden.</p>
            */
            hideDelay: number;
            /**
             * <p>Gets or sets a value indicating if the direction arrow styles should be applied.</p>
            */
            arrowless: boolean;
            /**
             * <p>Gets or sets a value indicating if a single box instance is used to display tooltips (defaults to true). When set to false multiple tooltips can be visible at the same time. Only set to false when required because a single instance has less overhead.</p>
            */
            singleBoxInstance: boolean;
            /**
             * <p>Gets or sets the list of tooltip triggers.</p>
            */
            triggers: componyx.UI.TooltipManager.Trigger[];
            /**
             * <p>Gets or sets the clientid of the tooltip box.</p>
            */
            boxId: string | null;
        }
        namespace TooltipManager
        {
            /**
             * <p>PointerEventOption</p>
             */
            enum PointerEventOption
            {
                NONE = 0,
                ENTER = 1,
                DOWN = 2,
                CONTEXT = 3
            }
            /**
             * <p>Creates an instance of the Trigger.</p>
             */
            class Trigger
            {
                constructor();
                /**
                 * <p>Gets or sets the id of the trigger element.</p>
                */
                triggerId: string;
                /**
                 * <p>Gets or sets the id of the tooltip template.</p>
                */
                tooltipId: string;
                /**
                 * <p>Gets or sets a value which defines on which pointer event the tooltip is shown.</p>
                */
                showOnPointerEvent: PointerEventOption;
                /**
                 * <p>Gets or sets a value indicating if the tooltip is shown on a focus event.</p>
                */
                showOnFocus: boolean;
                /**
                 * <p>Gets or sets a value indicating if the tooltip is shown on a blur event.</p>
                */
                showOnBlur: boolean;
            }
        }
    }
}