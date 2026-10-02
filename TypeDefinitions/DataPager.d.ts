declare namespace componyx 
{
    namespace UI
    {
        interface DataPager extends componyx.UI.base.methods { }
        /**
         * <p>DataPager class.</p>
         */
        class DataPager extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new DataPager instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<DataPager> | HTMLElement);
            /**
             * <p>DataPager events</p>
             */
            events: componyx.UI.DataPager.DataPagerEvents;
            /**
             * <p>Sets buttons template.</p>
             * @param content - <p>HTML string or element node as content. Pass null or empty string to remove the existing template.</p>
             */
            setButtonTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets paging info template.</p>
             * @param content - <p>HTML string or element node as content. Pass null or empty string to remove the existing template.</p>
             */
            setInfoTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Gets the index of the current page.</p>
             */
            getPageIndex(): number;
            /**
             * <p>Sets the page index to the specified number.</p>
             * @param pageIndex - <p>The page index.</p>
             */
            setPageIndex(pageIndex: number): void;
            /**
             * <p>Gets the page count.</p>
             */
            getPageCount(): number;
            /**
             * <p>Gets the first item index of the current page.</p>
             */
            getPageFirst(): number;
            /**
             * <p>Gets the last item index of the current page.</p>
             */
            getPageLast(): number;
            /**
             * <p>Renders the component.</p>
             */
            render(): void;
            /**
             * <p>Gets or sets the css class of the button container.</p>
            */
            cssClassButtonHolder: string;
            /**
             * <p>Gets or sets the css class of the info container.</p>
            */
            cssClassInfoHolder: string;
            /**
             * <p>Gets or sets the css class of the page container.</p>
            */
            cssClassPageHolder: string;
            /**
             * <p>Gets or sets the item count.</p>
            */
            itemCount: number;
            /**
             * <p>Gets or sets the items per page.</p>
            */
            pageSize: number;
            /**
             * <p>Gets or sets the number of visible pages.</p>
            */
            visiblePages: number;
            /**
             * <p>Gets or sets the initial page index.</p>
            */
            pageIndex: number;
            /**
             * <p>Gets or sets a value indicating whether the index change event is fired when the component is rendered.</p>
            */
            initialIndexChange: boolean;
            /**
             * <p>Gets or sets the name.</p>
             */
            name: string;
            /**
             * <p>Gets or sets the IDs of the pager buttons.</p>
             */
            buttons: {
                /** <p>Gets or sets the ID of the first page button.</p> */
                firstPageButtonId: string | null;
                /** <p>Gets or sets the ID of the last page button.</p> */
                lastPageButtonId: string | null;
                /** <p>Gets or sets the ID of the previous page button.</p> */
                previousPageButtonId: string | null;
                /** <p>Gets or sets the ID of the next page button.</p> */
                nextPageButtonId: string | null;
                /** <p>Gets or sets the ID of the previous page group button.</p> */
                previousPageGroupButtonId: string | null;
                /** <p>Gets or sets the ID of the next page group button.</p> */
                nextPageGroupButtonId: string | null;
                /** <p>Gets or sets the ID of the page button.</p> */
                pageButtonId: string | null;
            };
            /**
             * <p>Gets or sets the id of the numeric box from which the settings are cloned.</p>
            */
            numericBoxId: string | null;
            /**
             * <p>Gets or sets the id of the hidden input from which the settings are cloned. The hidden input contains the current page index.</p>
            */
            hiddenInputId: string | null;
        }
        namespace DataPager
        {
            /**
             * @property onFocus - <p>Event which fires when the datapager is focused.</p>
             * @property onBlur - <p>Event which fires when the datapager is blurred.</p>
             * @property onIndexChange - <p>Event which fires on a page index change.</p>
             */
            class DataPagerEvents extends componyx.UI.base.Events<componyx.UI.DataPager>
            {
                constructor();
                /**
                 * <p>Event which fires when the datapager is focused.</p>
                */
                onFocus: componyx.UI.base.Event<componyx.UI.DataPager, undefined>;
                /**
                 * <p>Event which fires when the datapager is blurred.</p>
                */
                onBlur: componyx.UI.base.Event<componyx.UI.DataPager, undefined>;
                /**
                 * <p>Event which fires on a page index change.</p>
                */
                onIndexChange: componyx.UI.base.Event<componyx.UI.DataPager, componyx.UI.DataPager.IndexChangeEventArgs>;
            }
            /**
             * <p>DataPager index change event arguments.</p>
             */
            type IndexChangeEventArgs = {
                /** <p>The new page index (1-based).</p> */
                pageIndex: number;
            };
        }
    }
}