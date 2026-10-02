declare namespace componyx 
{
    namespace UI
    {
        interface Carousel extends componyx.UI.base.methods { }
        /**
         * <p>Carousel class.</p>
         */
        class Carousel extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new Carousel instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<Carousel> | HTMLElement);
            /**
             * <p>Carousel slide animation.</p>
             * @property cssClass - <p>Gets or sets the css class that is applied to the element to provide the slide animation/transition.</p>
             */
            animation: componyx.UI.Carousel.Animation;
            /**
             * <p>Carousel events</p>
             */
            events: componyx.UI.Carousel.CarouselEvents;
            /**
             * <p>Starts rotating the slide items automatically.</p>
             * @param [interval] - <p>The interval in milliseconds before moving to the next item.</p>
             */
            start(interval?: number): void;
            /**
             * <p>Stops rotating the slide items automatically.</p>
             */
            stop(): void;
            /**
             * <p>Gets the index of the selected item.</p>
             * @returns <p>The index of the selected item.</p>
             */
            getSelectedIndex(): number;
            /**
             * <p>Selects the item with the specified index.</p>
             * @param index - <p>The index of the item.</p>
             * @param [instant] - <p>A value indicating if the item must be selected instantly (without transition animation).</p>
             */
            selectItem(index: number, instant?: boolean): void;
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
             * @param keepEvents - <p>A value indicating if component events should be kept.</p>
             */
            destroy(keepEvents: boolean): void;
            /**
             * <p>Gets or sets a value indicating if the carousel is rendered horizontal.</p>
            */
            horizontal: boolean;
            /**
             * <p>Gets or sets a value indicating if the carousel takes the full screen size.</p>
            */
            fullscreen: boolean;
            /**
             * <p>Gets or sets a value indicating if items can be selected by dragging.</p>
            */
            dragNavigation: boolean;
            /**
             * <p>Gets or sets a value indicating if items can be selected with the mouse wheel.</p>
            */
            wheelNavigation: boolean;
            /**
             * <p>Gets or sets a value indicating if items can be selected with the keyboard. With the option horizontal enabled only the left/right arrow keys can be used. When rendered vertically the up/down arrows, page up/down, home (first item) and end (last item) keys can be used.</p>
            */
            keyboardNavigation: boolean;
            /**
             * <p>Gets or sets a value indicating if there is a transition animation on initial item select.</p>
            */
            initialTransition: boolean;
            /**
             * <p>Gets or sets the percentage of the item to be visible before the item is selected.</p>
            */
            dragRevealPercentage: number;
            /**
             * <p>Gets or sets the drag speed (moved pixels relative to the elapsed time) required to select the designated item when the reveal percentage has not been matched.</p>
            */
            dragSelectSpeed: number;
            /**
             * <p>Gets or sets the interval in milliseconds for automatic carousel rotation.</p>
            */
            rotateInterval: number;
            /**
             * <p>Gets or sets the initial selected item index.</p>
            */
            selectedIndex: number;
        }
        namespace Carousel
        {
            /**
             * <p>Carousel slide animation settings.</p>
             */
            type Animation = {
                /** <p>Gets or sets the css class that is applied to the element to provide the slide animation/transition. Default: 'slide-animation'.</p> */
                cssClass: string;
            };
            /**
             * @property onItemSelect - <p>Event which fires on an item select.</p>
             * @property onTransitionComplete - <p>Event which fires when the item-select transition animation has completed.</p>
             */
            class CarouselEvents extends componyx.UI.base.Events<componyx.UI.Carousel>
            {
                constructor();
                /**
                 * <p>Event which fires on an item select.</p>
                */
                onItemSelect: componyx.UI.base.Event<componyx.UI.Carousel, componyx.UI.Carousel.CarouselEventArgs>;
                /**
                 * <p>Event which fires when the item-select transition animation has completed.</p>
                */
                onTransitionComplete: componyx.UI.base.Event<componyx.UI.Carousel, componyx.UI.Carousel.CarouselEventArgs>;
            }
            /**
             * <p>Carousel event arguments.</p>
             */
            type CarouselEventArgs = {
                /** <p>The index of the selected item.</p> */
                index: number;
                /** <p>The index of the previously selected item (onItemSelect only; undefined on the first select).</p> */
                previousIndex?: number;
            };
        }
    }
}