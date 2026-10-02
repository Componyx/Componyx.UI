declare namespace componyx 
{
    namespace UI
    {
        interface Box extends componyx.UI.base.methods { }
        /**
         * <p>Box class.</p>
         */
        class Box extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new Box instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<Box> | HTMLElement);
            ajax: componyx.UI.base.Component['ajax'] & {
                /**
                 * <p>AJAX method used to load box content data on demand.</p>
                 */
                load: componyx.UI.base.AjaxMethod;
            };
            /**
             * <p>Box animation.</p>
             * @property showType - <p>Gets or sets the animation type used when showing the box.</p>
             * @property showClass - <p>Gets or sets the CSS class applied when showing the box.</p>
             * @property showDirection - <p>Gets or sets the animation direction (down, right, up, left) used when showing the box.</p>
             * @property showFade - <p>Gets or sets a value indicating if fading is used when showing the box.</p>
             * @property hideType - <p>Gets or sets the animation type used when hiding the box.</p>
             * @property hideClass - <p>Gets or sets the CSS class applied when hiding the box.</p>
             * @property hideDirection - <p>Gets or sets the animation direction (top, right, bottom, left) used when hiding the box.</p>
             * @property hideFade - <p>Gets or sets a value indicating if fading is used when hiding the box.</p>
             */
            animation: componyx.UI.Box.Animation;
            dragSettings: componyx.library.DraggableSettings;
            /**
             * <p>Box events</p>
             */
            events: componyx.UI.Box.BoxEvents;
            /**
             * <p>Adds the content template.</p>
             * @param content - <p>The content template.</p>
             */
            setContentTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Updates the box view to stretch and position with the updated content.</p>
             * @param [content] - <p>A new content template.</p>
             * @param [show = true] - <p>A value indicating if the box should be displayed when hidden.</p>
             */
            update(content?: HTMLElement | HTMLElement[] | DocumentFragment | string, show?: boolean): void;
            /**
             * <p>Stops the animation.</p>
             */
            stopAnimation(): void;
            /**
             * <p>Shows or hides the component.</p>
             */
            toggle(): void;
            /**
             * <p>Shows the component.</p>
             * @param [instant] - <p>A value indicating if the box should be shown instantly without animation.</p>
             * @param [pointerCoordinates] - <p>Optional pointer coordinates for POINTER auto-positioning. Pass these when the show is deferred (e.g. via setTimeout), as the original pointer event may no longer be available by then.</p>
             */
            show(instant?: boolean, pointerCoordinates?: { clientX: number, clientY: number }): void;
            /**
             * <p>Hides the component.</p>
             * @param [instant] - <p>A value indicating if the box should be hidden instantly without animation.</p>
             */
            hide(instant?: boolean): void;
            /**
             * <p>Renders the component.</p>
             */
            render(): void;
            /**
             * <p>Destroys the component.</p>
             */
            destroy(): void;
            /**
             * <p>Gets or sets the css class of the box content.</p>
            */
            cssClassContent: string;
            /**
             * <p>Gets or sets the css class of the box modal overlay.</p>
            */
            cssClassModal: string;
            /**
             * <p>Gets or sets the css class of the box when AutoInvertFit is true and the box is inverted.</p>
            */
            cssClassHorizontalInverted: string;
            /**
             * <p>Gets or sets the css class of the box when AutoInvertFit is true and the box is inverted.</p>
            */
            cssClassVerticalInverted: string;
            /**
             * <p>Gets or sets the top position of the box. Overwrites the property if already defined through Style.</p>
            */
            top: string;
            /**
             * <p>Gets or sets the right position of the box. Overwrites the property if already defined through Style.</p>
            */
            right: string;
            /**
             * <p>Gets or sets the bottom position of the box. Overwrites the property if already defined through Style.</p>
            */
            bottom: string;
            /**
             * <p>Gets or sets the left position of the box. Overwrites the property if already defined through Style.</p>
            */
            left: string;
            /**
             * <p>Gets or sets the width of the box. Overwrites the property if already defined through Style.</p>
            */
            width: string;
            /**
             * <p>Gets or sets the height of the box. Overwrites the property if already defined through Style.</p>
            */
            height: string;
            /**
             * <p>Gets or sets a value indicating if the box element must stretch to the size of the expander element. The content width has priority over the expander width when stretchToContent is enabled and the content exceeds the expander width.</p>
            */
            stretchToExpander: boolean;
            /**
             * <p>Gets or sets a value indicating if the box element must stretch to the size of the content element. This setting is useful when the box is positioned absolute/fixed and the content element is a flex-box (display:flex).</p>
            */
            stretchToContent: boolean;
            /**
             * <p>Gets or sets a value indicating whether the box should handle focus events for focusable child elements. Only applies when modal is false.</p>
            */
            handleFocus: boolean;
            /**
             * <p>Gets or sets a value indicating whether the first element of the focusable list should get focus when the box is shown.</p>
            */
            autoFocus: boolean;
            /**
             * <p>Gets or sets a value indicating whether the focusable list is ordered by tabindex (requires all elements to have a tabindex set).</p>
            */
            tabIndexFocus: boolean;
            /**
             * <p>Gets or sets the auto position of the box.</p>
            */
            autoPosition: componyx.UI.Box.AutoPositionOption;
            /**
             * <p>Gets or sets a value indicating whether the box should try to fit when the window is to small.</p>
            */
            autoFit: boolean;
            /**
             * <p>Gets or sets a value indicating whether the box should try to fit inverted when the window is to small.</p>
            */
            autoInvertFit: boolean;
            /**
             * <p>Gets or sets a value indicating whether the box should be resized when the window is to small.</p>
            */
            autoResizeFit: boolean;
            /**
             * <p>Gets or sets a value indicating whether the animation direction should be auto inverted when the box is inverted.</p>
            */
            autoInvertAnimation: boolean;
            /**
             * <p>Gets or sets a value indicating whether the box is either resized to the window width or available (inverted)space when auto resized.</p>
            */
            resizeToMaxWidth: boolean;
            /**
             * <p>Gets or sets a value indicating whether the box is either resized to the window height or available (inverted)space when auto resized.</p>
            */
            resizeToMaxHeight: boolean;
            /**
             * <p>Gets or sets a value indicating whether the box is displayed as modal popup.</p>
            */
            modal: boolean;
            /**
             * <p>Gets or sets a value indicating whether the box is draggable.</p>
            */
            draggable: boolean;
            /**
             * <p>Gets or sets a value indicating whether the box is hidden when the user clicks outside the box.</p>
            */
            hideOnOutsideClick: boolean;
            /**
             * <p>Gets or sets a value indicating whether the box position tracks the pointer when AutoPosition is set to POINTER.</p>
            */
            trackPointer: boolean;
            /**
             * <p>Gets or sets a value indicating whether the box's horizontal position is aligned to the left, center or right of the expander element or mouse cursor.</p>
            */
            alignX: componyx.UI.Box.AlignXOption | null;
            /**
             * <p>Gets or sets a value indicating whether the box's vertical position is aligned to the top, center or bottom of the expander element or mouse cursor.</p>
            */
            alignY: componyx.UI.Box.AlignYOption | null;
            /**
             * <p>Gets the tag name of the content element.</p>
            */
            contentTag: string;
            /**
             * <p>Gets or sets the expand direction.</p>
            */
            expandDirection: componyx.UI.Box.ExpandDirectionOption;
            /**
             * <p>Gets or sets the expander element or element-id.</p>
            */
            expander: HTMLElement | string | null;
            /**
             * <p>Gets or sets the submitter element or element-id on which to fire a click event when the enter-key is pressed within a field inside the box element.</p>
            */
            enterKeySubmitter: HTMLElement | string | null;
            /**
             * <p>Gets the element which contains the box content.</p>
            */
            readonly contentElement: HTMLElement;
        }
        namespace Box
        {
            /**
             * <p>Box animation settings.</p>
             */
            type Animation = {
                /** <p>Gets or sets the animation type used when showing the box.</p> */
                showType: componyx.UI.Box.AnimationTypeOption | null;
                /** <p>Gets or sets the CSS class applied when showing the box.</p> */
                showClass: string | null;
                /** <p>Gets or sets the animation direction (down, right, up, left) used when showing the box.</p> */
                showDirection: string | null;
                /** <p>Gets or sets a value indicating if fading is used when showing the box.</p> */
                showFade: boolean | null;
                /** <p>Gets or sets the animation type used when hiding the box.</p> */
                hideType: componyx.UI.Box.AnimationTypeOption | null;
                /** <p>Gets or sets the CSS class applied when hiding the box.</p> */
                hideClass: string | null;
                /** <p>Gets or sets the animation direction (top, right, bottom, left) used when hiding the box.</p> */
                hideDirection: string | null;
                /** <p>Gets or sets a value indicating if fading is used when hiding the box.</p> */
                hideFade: boolean | null;
            };
            /**
             * @property onPrePosition - <p>Event which fires before the box is positioned.</p>
             * @property onPostPosition - <p>Event which fires after the box is positioned.</p>
             * @property onAutoFit - <p>Event which fires when the window is too small and the box performs an auto fit.</p>
             * @property onShowComplete - <p>Event which fires when the show animation has completed, or immediately if animation type is 'none'.</p>
             * @property onHideComplete - <p>Event which fires when the hide animation has completed, or immediately if animation type is 'none'.</p>
             * @property onHide - <p>Inherited event which fires when the box is hidden. The Box passes HideEventArgs: set cancel to true to keep the box visible.</p>
             */
            class BoxEvents extends componyx.UI.base.Events<componyx.UI.Box, componyx.UI.Box.HideEventArgs>
            {
                constructor();
                /**
                 * <p>Event which fires before the box is positioned.</p>
                */
                onPrePosition: componyx.UI.base.Event<componyx.UI.Box, null>;
                /**
                 * <p>Event which fires after the box is positioned.</p>
                */
                onPostPosition: componyx.UI.base.Event<componyx.UI.Box, null>;
                /**
                 * <p>Event which fires when the window is too small and the box performs an auto fit.</p>
                */
                onAutoFit: componyx.UI.base.Event<componyx.UI.Box, componyx.UI.Box.AutoFitEventArgs>;
                /**
                 * <p>Event which fires when the show animation has completed, or immediately if animation type is 'none'.</p>
                */
                onShowComplete: componyx.UI.base.Event<componyx.UI.Box, undefined>;
                /**
                 * <p>Event which fires when the hide animation has completed, or immediately if animation type is 'none'.</p>
                */
                onHideComplete: componyx.UI.base.Event<componyx.UI.Box, undefined>;
            }
            /**
             * <p>Box hide event arguments.</p>
             */
            type HideEventArgs = {
                /** <p>The original event object.</p> */
                event: Event;
                /** <p>Set to true to cancel hiding the box.</p> */
                cancel: boolean;
            };
            /**
             * <p>Box auto fit event arguments.</p>
             */
            type AutoFitEventArgs = {
                /** <p>A value indicating if the box was fitted horizontally.</p> */
                fitX: boolean;
                /** <p>A value indicating if the box was fitted vertically.</p> */
                fitY: boolean;
                /** <p>A value indicating if the box position was inverted horizontally.</p> */
                invertedX: boolean;
                /** <p>A value indicating if the box position was inverted vertically.</p> */
                invertedY: boolean;
                /** <p>A value indicating if the box was resized horizontally.</p> */
                resizedX: boolean;
                /** <p>A value indicating if the box was resized vertically.</p> */
                resizedY: boolean;
            };
            /**
             * <p>AutoPositionOption</p>
             */
            enum AutoPositionOption
            {
                NONE = 0,
                TOPLEFT = 1,
                TOPCENTER = 2,
                TOPRIGHT = 3,
                LEFT = 4,
                CENTER = 5,
                RIGHT = 6,
                BOTTOMLEFT = 7,
                BOTTOMCENTER = 8,
                BOTTOMRIGHT = 9,
                POINTER = 10,
                EXPAND = 11
            }
            /**
             * <p>ExpandDirectionOption</p>
             */
            enum ExpandDirectionOption
            {
                DOWN = 0,
                RIGHT = 1,
                UP = 2,
                LEFT = 3
            }
            namespace ExpandDirectionOption
            {
                /**
                 * <p>Gets the lowercase name of the option value.</p>
                 * @param value - <p>The enum value.</p>
                 */
                function getName(value: componyx.UI.Box.ExpandDirectionOption): string;
            }
            /**
             * <p>AlignXOption</p>
             */
            enum AlignXOption
            {
                LEFT = 0,
                CENTER = 1,
                RIGHT = 2
            }
            namespace AlignXOption
            {
                /**
                 * <p>Gets the lowercase name of the option value.</p>
                 * @param value - <p>The enum value.</p>
                 */
                function getName(value: componyx.UI.Box.AlignXOption): string;
            }
            /**
             * <p>AlignYOption</p>
             */
            enum AlignYOption
            {
                TOP = 0,
                CENTER = 1,
                BOTTOM = 2
            }
            namespace AlignYOption
            {
                /**
                 * <p>Gets the lowercase name of the option value.</p>
                 * @param value - <p>The enum value.</p>
                 */
                function getName(value: componyx.UI.Box.AlignYOption): string;
            }
            /**
             * <p>AnimationTypeOption</p>
             */
            enum AnimationTypeOption
            {
                NONE = 0,
                SLIDE = 1,
                REVEAL = 2,
                CSS = 3
            }
        }
    }
}