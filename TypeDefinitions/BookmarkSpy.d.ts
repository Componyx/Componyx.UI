declare namespace componyx 
{
    namespace UI
    {
        interface BookmarkSpy extends Omit<componyx.UI.base.methods, 'hide'> { }
        /**
         * <p>BookmarkSpy class.</p>
         */
        class BookmarkSpy extends componyx.UI.base.Component
        {
            /**
             * Creates a new BookmarkSpy instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<BookmarkSpy> | HTMLElement);
            /**
             * <p>BookmarkSpy events</p>
             */
            events: componyx.UI.BookmarkSpy.BookmarkSpyEvents;
            /**
             * <p>Initializes the BookmarkSpy component if this has not yet been done.</p>
             */
            show(): void;
            /**
             * <p>Initializes the BookmarkSpy component.</p>
             */
            init(): void;
            /**
             * <p>Initializes the BookmarkSpy component. Both init and render are the same for this component.</p>
             */
            render(): void;
            /**
             * <p>Destroys the component.</p>
             */
            destroy(): void;
            /**
             * <p>Gets or sets the css class to apply to the active menu-item anchor. Default: 'selected'.</p>
            */
            cssClass: string;
            /**
             * <p>Gets or sets the css class to apply to the parent anchor(s) of the active menu-item anchor.</p>
            */
            cssClassParent?: string;
            /**
             * <p>Gets or sets a value indicating to spy on horizontal instead of vertical scrolling.</p>
            */
            horizontal?: boolean;
            /**
             * <p>Gets or sets a value indicating if the URL anchor must be rewritten to the active bookmark.</p>
            */
            updateURL?: boolean;
            /**
             * <p>Gets or sets a value indicating if the click event of the selected anchor is executed.</p>
            */
            fireAnchorClick?: boolean;
            /**
             * <p>Gets or sets the scrollable container element or element id.</p>
            */
            scroller?: HTMLElement | string | null;
            /**
             * <p>Gets or sets the anchor container element or element id.</p>
            */
            anchorContainer?: HTMLElement | string | null;
            /**
             * <p>Gets or sets the offset in pixels.</p>
            */
            offset?: number;
            /**
             * <p>Gets or sets the bookmark tags (space delimited) to spy on.</p>
            */
            tags?: string;
            /**
             * <p>Gets or sets the menu component which holds the bookmark links.</p>
            */
            menuId?: string | null;
        }
        namespace BookmarkSpy
        {
            /**
             * @property onPreInit - <p>Event which fires before init but after resources load.</p>
             * @property onPostInit - <p>Event which fires after init.</p>
             * @property onChange - <p>Event which fires when the active bookmark changes.</p>
             */
            class BookmarkSpyEvents extends componyx.UI.base.Events<componyx.UI.BookmarkSpy>
            {
                constructor();
                /**
                 * <p>Event which fires before init but after resources load.</p>
                */
                onPreInit: componyx.UI.base.Event<componyx.UI.BookmarkSpy, undefined>;
                /**
                 * <p>Event which fires after init.</p>
                */
                onPostInit: componyx.UI.base.Event<componyx.UI.BookmarkSpy, undefined>;
                /**
                 * <p>Event which fires when the active bookmark changes.</p>
                */
                onChange: componyx.UI.base.Event<componyx.UI.BookmarkSpy, componyx.UI.BookmarkSpy.ChangeEventArgs>;
            }
            /**
             * <p>BookmarkSpy change event arguments.</p>
             */
            type ChangeEventArgs = {
                /** <p>The anchor of the active bookmark.</p> */
                selected: HTMLAnchorElement;
                /** <p>The anchor of the previously active bookmark, empty on the first change.</p> */
                deselected?: HTMLAnchorElement | null;
            };
        }
    }
}