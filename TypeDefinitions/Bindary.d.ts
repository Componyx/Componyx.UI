declare namespace componyx
{
    /**
     * <p>Namespace for bindary modules.</p>
     */
    namespace bindary_modules
    {
        /**
         * <p>Promise that resolves when all bindary modules are loaded asynchronously.</p>
         */
        var loaded: Promise<void>;
    }

    /**
     * <p>Bindary ($bindary) is a highly flexible data-binding framework for developing web applications. It utilizes declarative HTML templates based on data-attributes to bind the DOM- to the -JavaScript world.</p>
     */
    namespace bindary
    {
        /**
         * <p>The data request is a JSON serialized object sent to the backend data server.</p>
         * @property [clientId] - <p>The id of the active client.</p>
         * @property routeIndex - <p>The index of the active route.</p>
         * @property routePath - <p>The path of the active route.</p>
         * @property serverMethod - <p>A class type and static method (dot separated) to call on the server when executing the data request. Requires the .NET server-side Bindary framework.</p>
         * @property callbackId - <p>The identifier of the client callback method to invoke when the data request has finished.</p>
         * @property initialLoad - <p>A value indicating if this is the route's initial load.</p>
         * @property data - <p>The custom data object.</p>
         */
        type dataRequestType = {
            clientId?: string;
            routeIndex: number;
            routePath: string;
            serverMethod: string;
            callbackId: number;
            initialLoad: number;
            data: any;
        };
        /**
         * <p>The data response is a JSON serialized object returned from a backend data server.</p>
         * @property [clientId] - <p>The id of the active client.</p>
         * @property callbackId - <p>The identifier of the client callback method to invoke when the data request has finished.</p>
         * @property isError - <p>A value indicating that an error occurred.</p>
         * @property data - <p>An object which holds the data and data-rules.</p>
         */
        type dataResponse = {
            clientId?: string;
            callbackId: number;
            isError: string;
            data: dataContainer;
        };
        /**
         * <p>The data container is part of the data response and holds data and optionally rules for at least one data container.</p>
         * @property [appData] - <p>The app data.</p>
         * @property [routeData] - <p>The route data.</p>
         * @property [viewData] - <p>The view data.</p>
         * @property [appDataRules] - <p>Data rules for app data.</p>
         * @property [routeDataRules] - <p>Data rules for route data.</p>
         * @property [viewDataRules] - <p>Data rules for view data.</p>
         */
        type dataContainer = {
            appData?: any;
            routeData?: any;
            viewData?: any;
            appDataRules?: dataRules;
            routeDataRules?: dataRules;
            viewDataRules?: dataRules;
        };
        /**
         * <p>The data rules define how data from the server is updated on the client.</p>
         * @property routeIndex - <p>The route index for updating route data on a different route than the currently active route.</p>
         * @property routePath - <p>The route path for updating view data on a different view than the currently active view.</p>
         * @property path - <p>The hierarchical path on the target object where the source object will be added/updated.</p>
         * @property updateKey - <p>The key used to match and update items on the target array. The array item is updated when the value on both source and target of specified key matches.</p>
         * @property removeByKeyValues - <p>A collection of key values to remove. Items on the target client object with a matching value for the specified UpdateKey will be removed.</p>
         * @property addIndex - <p>The position within the array where the items must be added. Do not specify the index (Null/Undefined) when items must be added at the end of the array.</p>
         * @property removeIndex - <p>The position within the array where the items must be removed. Do not specify the index (Null/Undefined) when items must be removed at the end of the array.</p>
         * @property removeCount - <p>The number of items to remove from the target array.</p>
         * @property ignoreNullValues - <p>A value indicating if null values in the response data will be ignored.</p>
         * @property update - <p>A value indicating if server data overwrittes (false) or updates (true) data on the client.</p>
         * @property recreate - <p>A value indicating if the HTML element must be recreated when there is already an element for the relevant index/key.</p>
         * @property omitKeys - <p>A collection of keys to omit on the target client object.</p>
         */
        type dataRules = {
            routeIndex: string;
            routePath: string;
            path: string;
            updateKey: number;
            removeByKeyValues: string[];
            addIndex: number;
            removeIndex: number;
            removeCount: number;
            ignoreNullValues: number;
            update: boolean;
            recreate: boolean;
            omitKeys: {
                [key: string]: object;
            };
        };
        /**
         * @property name - <p>The name of the element.</p>
         * @property isInput - <p>A value indicating if the element is an input.</p>
         * @property isTextarea - <p>A value indicating if the element is a textarea.</p>
         * @property isSelect - <p>A value indicating if the element is a select.</p>
         * @property isCheck - <p>A value indicating if the element is a checkbox.</p>
         * @property isRadio - <p>A value indicating if the element is a radiobutton.</p>
         */
        type elementInfo = {
            name: string;
            isInput: boolean;
            isTextarea: boolean;
            isSelect: boolean;
            isCheck: boolean;
            isRadio: boolean;
        };
        /**
         * @property cancel - <p>Set to <code>true</code> to cancel the event.</p>
         */
        type CancelToken = {
            cancel: boolean;
        };
        /**
         * @property socket - <p>The WebSocket instance.</p>
         * @property event - <p>The native event object.</p>
         */
        type WebSocketEventArgs = {
            socket: WebSocket;
            event: Event;
        };
        /**
         * @property templateItem - <p>The template item.</p>
         * @property field - <p>The field element.</p>
         * @property dataBind - <p>Function to trigger manual data binding.</p>
         * @property cancelToken - <p>Token to cancel automatic data binding.</p>
         */
        type PreDataBindEventArgs = {
            templateItem: componyx.bindary.TemplateItem;
            field: HTMLElement;
            dataBind: (...params: any[]) => any;
            cancelToken: componyx.bindary.CancelToken;
        };
        /**
         * @property templateItem - <p>The template item.</p>
         * @property field - <p>The field element.</p>
         * @property model - <p>The data model.</p>
         * @property value - <p>The bound value.</p>
         */
        type PostDataBindEventArgs = {
            templateItem: componyx.bindary.TemplateItem;
            field: HTMLElement;
            model: any;
            value: any;
        };
        /**
         * @property error - <p>The error object returned by the server.</p>
         */
        type ErrorEventArgs = {
            error: any;
        };
        /**
         * @property type - <p>What failed: 'route' (no route matches the route path), 'view' or 'controller'.</p>
         * @property [status] - <p>The HTTP status of the failed request, for 'view' and 'controller' when available.</p>
         * @property [url] - <p>The URL of the view or controller that failed to load.</p>
         * @property routePath - <p>The route path that was requested.</p>
         */
        type RouteErrorEventArgs = {
            type: 'route' | 'view' | 'controller';
            status?: number;
            url?: string;
            routePath: string;
        };
        /**
         * @property cancelToken - <p>Token to cancel loading.</p>
         */
        type PreLoadEventArgs = {
            cancelToken: componyx.bindary.CancelToken;
        };
        /**
         * @property dataRequest - <p>The requested data identifier.</p>
         * @property routeReady - <p>Callback to continue route loading.</p>
         * @property cancelToken - <p>Token to cancel loading.</p>
         */
        type DataRequestEventArgs = {
            dataRequest: string;
            routeReady: (...params: any[]) => any;
            cancelToken: componyx.bindary.CancelToken;
        };
        /**
         * @property [data] - <p>The loaded route data.</p>
         */
        type LoadEventArgs = {
            data?: any;
        };
        /**
         * @property dataMessage - <p>The incoming data object.</p>
         * @property cancelToken - <p>Token to cancel updating.</p>
         */
        type PreDataUpdateEventArgs = {
            dataMessage: any;
            cancelToken: componyx.bindary.CancelToken;
        };
        /**
         * @property [data] - <p>The updated data object.</p>
         */
        type PostDataUpdateEventArgs = {
            data?: any;
        };
        /**
         * @property [context] - <p>Optional render context.</p>
         */
        type RenderEventArgs = {
            context?: any;
        };
        /**
         * @property visible - <p>Whether the document is now visible.</p>
         * @property cancelToken - <p>Token to cancel the default visibility action. The default action checks if there is an open websocket connection and if so it will send a request to the server to update the websocket object on the client.</p>
         */
        type VisibilityChangeEventArgs = {
            visible: boolean;
            cancelToken: componyx.bindary.CancelToken;
        };
        /**
         * @property [el] - <p>The anchor element.</p>
         */
        type AnchorScrollEventArgs = {
            el?: HTMLElement;
        };
        /**
         * @property routeIndex - <p>The index of the route being unloaded.</p>
         * @property routePath - <p>The path of the route being unloaded.</p>
         * @property cancelToken - <p>Token to cancel unloading.</p>
         */
        type UnloadEventArgs = {
            routeIndex: number;
            routePath: string;
            cancelToken: componyx.bindary.CancelToken;
        };

        /**
         * @property {String|RegEx} path The route path to map. A string to map an exact route or a regex to map a dynamic route. Capture groups from the path with the regex and use them with $groupnumber in the URL, dataRequest and controller method settings.
         * @property {String} [controllerURL] URL of the controller js file.
         * @property {String} [viewURL] URL of the template view.
         * @property {String|Object} [data] JSON data to send with the data load (XHR or WS).
         * @property {Boolean} [dataConnect] A value indicating if the data source will be connected (default) or disconnected when this route is active.
         * @property {Boolean} [observing] A value indicating if changes are being observed for the routeData and viewData data-containers (ECMAScript 6 required).
         * @property {String} [controllerLoad] Name of the controller method invoked after loading the required route data and sources.
         * @property {String} [controllerPreDataUpdate] Name of the controller method invoked when data is received but before the client data is updated. The data object is passed as single argument. Use false as method return value to cancel further processing of the data object. Defaults to 'preDataUpdate'.
         * @property {String} [controllerPostDataUpdate] Name of the controller method invoked after the data is updated. Defaults to 'postDataUpdate'.
         * @property {String} [controllerPreRender] Name of the controller method invoked every time before the view is rendered. Defaults to 'preRender'.
         * @property {String} [controllerPostRender] Name of the controller method invoked every time after the view is rendered. Defaults to 'postRender'.
         * @property {String} [controllerPostLoad] Name of the controller method invoked when the route is loaded. Defaults to 'postLoad'.
         * @property {String} [controllerUnload] Name of the controller method invoked when the route is unloaded because a new route is requested. The routeIndex and routePath of the requested route are passed as arguments. A value of true/null/undefined to unload the current route and load the requested route or false to cancel the unload and keep the current route active. Defaults to 'unLoad'.
         * @property {String} [dataServerLoad] A class type and static method (dot separated) to invoke on the server to load data. Requires the .NET server-side Bindary framework.
         * @property {String} [dataServerUnload] A class type and static method (dot separated) to invoke on the server to unload data. Requires the .NET server-side Bindary framework.
         */
        type Route =
            {
                path: string | RegExp;
                controllerURL?: string;
                viewURL?: string;
                data?: string | any;
                dataConnect?: boolean;
                observing?: boolean;
                controllerLoad?: string;
                controllerPreDataUpdate?: string;
                controllerPostDataUpdate?: string;
                controllerPreRender?: string;
                controllerPostRender?: string;
                controllerPostLoad?: string;
                controllerUnload?: string;
                dataServerLoad?: string;
                dataServerUnload?: string;
            }

        /**
         * <p>A value indicating if the route for the initial route path value is loaded when the DOM is ready.</p>
         */
        var launchOnLoad: boolean;
        /**
         * <p>The connection URL of the server side data-server for retrieving app/view data. Leave this setting empty when custom data retrieval methods are desired.</p>
         */
        var dataServerURL: string | null;
        /**
         * <p>A value indicating if a relative data-server URL is used.</p>
         */
        var relativeDataServerURL: boolean;
        /**
         * <p>The relative or absolute root URL where views are located.</p>
         */
        var viewRootURL: string;
        /**
         * <p>The relative or absolute root URL where client controllers are located.</p>
         */
        var controllerRootURL: string;
        /**
         * <p>The relative or absolute root URL where includables are located.</p>
         */
        var includeRootURL: string;
        /**
         * <p>A value indicating if the browser has support for the websocket protocol.</p>
         */
        const websocketSupport: boolean;
        /**
         * <p>A value indicating if websockets should be used for updating view data.</p>
         */
        var useWebSocket: boolean;
        /**
         * <p>A value indicating to use a secure connection (SSL/TLS). Defaults to true if a HTTPS connection is detected.</p>
         */
        var secure: boolean | null;
        /**
         * <p>The interval time in milliseconds between xhr data update checks when websockets are not supported/enabled.</p>
         */
        var xhrUpdateInterval: number | null;
        /**
         * <p>The time in milliseconds before a new attempt is made, when a previous attempt failed, to scroll to the anchor or history scroll position.</p>
         */
        var scrollRetryInterval: number;
        /**
         * <p>The time in milliseconds before attempting to set the correct scroll position stops.</p>
         */
        var scrollRetryTimeout: number;
        /**
         * <p>A value indicating if a data-bound input element performs a live update of the corresponding data model (keyup events) or after a change (change/blur events).</p>
         */
        var liveBind: boolean;
        /**
         * <p>The delay in milliseconds for a live update.</p>
         */
        var liveBindDelay: number;
        /**
         * <p>A Bindary event. Handlers receive the event arguments as first parameter.</p>
         * @template TArgs - The type of the event arguments.
         */
        type BindaryEvent<TArgs = any> = componyx.library.Event<(eventArgs: TArgs, ...params: any[]) => any>;
        /**
         * <p>Fires when the WebSocket connection is opened.</p>
         */
        var onWebSocketOpen: componyx.bindary.BindaryEvent<componyx.bindary.WebSocketEventArgs>;
        /**
         * <p>Fires when the WebSocket connection is closed (server can close connection also).</p>
         */
        var onWebSocketClose: componyx.bindary.BindaryEvent<componyx.bindary.WebSocketEventArgs>;
        /**
         * <p>Fires before a data-bound input element is updated. Can be used for validation.</p>
         */
        var onPreDataBind: componyx.bindary.BindaryEvent<componyx.bindary.PreDataBindEventArgs>;
        /**
         * <p>Fires after data binding is applied to an input element.</p>
         */
        var onPostDataBind: componyx.bindary.BindaryEvent<componyx.bindary.PostDataBindEventArgs>;
        /**
         * <p>Fires when the returned data object contains an error (<code>isError: true</code>).</p>
         */
        var onDataError: componyx.bindary.BindaryEvent<componyx.bindary.ErrorEventArgs>;
        /**
         * <p>Fires when a route cannot be loaded: no route matches the route path, or the route's view or controller fails to load.</p>
         */
        var onRouteError: componyx.bindary.BindaryEvent<componyx.bindary.RouteErrorEventArgs>;
        /**
         * <p>Fires before loading route data and sources.</p>
         */
        var onPreLoad: componyx.bindary.BindaryEvent<componyx.bindary.PreLoadEventArgs>;
        /**
         * <p>Fires when the view data is requested.</p>
         */
        var onDataRequest: componyx.bindary.BindaryEvent<componyx.bindary.DataRequestEventArgs>;
        /**
         * <p>Fires after route data and sources are loaded.</p>
         */
        var onLoad: componyx.bindary.BindaryEvent<componyx.bindary.LoadEventArgs>;
        /**
         * <p>Fires when new data is received, before the client data is updated.</p>
         */
        var onPreDataUpdate: componyx.bindary.BindaryEvent<componyx.bindary.PreDataUpdateEventArgs>;
        /**
         * <p>Fires after the client data has been updated.</p>
         */
        var onPostDataUpdate: componyx.bindary.BindaryEvent<componyx.bindary.PostDataUpdateEventArgs>;
        /**
         * <p>Fires before the view is rendered.</p>
         */
        var onPreRender: componyx.library.Event;
        /**
         * <p>Fires after the view is rendered.</p>
         */
        var onPostRender: componyx.library.Event;
        /**
         * <p>Fires after the route has fully loaded.</p>
         */
        var onPostLoad: componyx.bindary.BindaryEvent<componyx.bindary.LoadEventArgs>;
        /**
         * <p>Fires when the document tab becomes visible or hidden.</p>
         */
        var onVisibilityChange: componyx.bindary.BindaryEvent<componyx.bindary.VisibilityChangeEventArgs>;
        /**
         * <p>Fires when the document is scrolled to an anchor.</p>
         */
        var onAnchorScroll: componyx.bindary.BindaryEvent<componyx.bindary.AnchorScrollEventArgs>;
        /**
         * <p>Fires after the route is unloaded because a new route is requested.</p>
         */
        var onUnload: componyx.bindary.BindaryEvent<componyx.bindary.UnloadEventArgs>;
        /**
         * <p>The id prefix for bindary elements within the view.</p>
         */
        var idPrefix: string;
        /**
         * <p>The date format used to convert date(time) types for textual display. Defaults to MM/dd/yyyy hh:mm.</p>
         */
        var dateFormat: string;
        /**
         * <p>The decimal separator used to convert numeric types for textual display. Defaults to '.'.</p>
         */
        var decimalSeparator: string;
        /**
         * <p>The decimal precision used to convert numeric types for textual display.</p>
         */
        var decimalPrecision: string | null;
        /**
         * <p>A value which is sent with each data request to be able to uniquely identify clients on the server. Only required when the client-id is not stored in a server-side Session.</p>
         */
        var clientId: string | null;
        /**
         * <p>Holds the current data request object.</p>
         */
        var dataRequest: dataRequestType | null;
        /**
         * <p>Holds the current active route.</p>
         */
        var route: Route | null;
        /**
         * <p>Holds the current active route index.</p>
         */
        var routeIndex: string | null;
        /**
         * <p>Holds the current active route path and can be set as initial launch value.</p>
         */
        var routePath: string;
        /**
         * <p>The root path of the application must be specified when &quot;prettyURL&quot; is enabled and the application URL contains a path after the URL origin (protocol//domain:port), so that Bindary can detect the route path within the URL.
         * The rootPath must start and end with a forward slash (/).</p>
         */
        var rootPath: string;
        /**
         * <p>The base title of the application.</p>
         */
        var baseTitle: string;
        /**
         * <p>Holds the controller object for the active route.</p>
         */
        var controller: any;
        /**
         * <p>Holds the data object which is bound to the global application context.</p>
         */
        var appData: any;
        /**
         * <p>Holds the data object which is bound to the context of the active route.</p>
         */
        var routeData: any;
        /**
         * <p>Holds the data object which is bound to the context of the active view.</p>
         */
        var viewData: any;
        /**
         * <p>The list of mapped routes.</p>
         */
        var routes: object[];
        /**
         * <p>A value indicating if Bindary data-bound elements (template-items) are being detected outside of the view container element.
         * Set to false if template elements are only defined inside of the view container for better performance.</p>
         */
        var detectOutsideView: boolean;
        /**
         * <p>A value indicating if the data change detection must be precise (false) or as fast as possible (true).
         * When changed, it will have direct effect on the next view update. With dirty checks enabled: detection of changes during the view update works by checking if the data-key for a registered change is equal or inside an item's context.
         * Items that don't match with a registered data change are skipped and possible child items are not processed. Therefore possible context switching (by root/parent navigators) inside a template item is not considered. Nor are the preRender event actions, which may decide if a template item is rendered.</p>
         */
        var dirtyChecks: boolean;
        /**
         * <p>A value indicating if the route path in the URL starts with a forward slash (pretty) instead of a hash(#) or hash-bang(#!).
         * e.g. /Category/Product instead of #Category/Product.
         * When enabled, server-side routing of the route-path to the application's entrance page is required to deal with initial page loads where a route path is part of the URL (direct link).
         * Bindary will detect the route path in the URL and launch with the relevant route.</p>
         */
        var prettyURL: boolean;
        /**
         * <p>A value indicating if relative hyperlinks are dispatched to (handled by) the Bindary routing.</p>
         */
        var linkDispatching: boolean;
        /**
         * <p>A value indicating if the view HTML is cleared when a route is unloaded.</p>
         */
        var clearViewOnUnload: boolean;
        /**
         * <p>A value indicating if the framework is connected with a data provider.</p>
         */
        var connected: boolean;
        /**
         * <p>A value indicating if data-bindary attributes on the element are retained.
         * When disabled, calling updateTemplateItem() will update the defined attributes and hold previously stored values; clearing can be accomplished by specifying 'null' as attribute value.
         * When enabled, calling updateTemplateItem() will clear undefined attributes.</p>
         */
        var keepAttributes: boolean;
        /**
         * <p>A value indicating if a fragment identifier (anchor tag) specified in the URL through a hashtag is automatically scrolled into view after loading the route.
         * Use a second hashtag in the URL (without a matching route) to jump to a bookmark when the first hashtag contains the route-path.</p>
         */
        var anchorScroll: boolean;
        /**
         * <p>A value indicating whether client-side caching of views, view-css, view-scripts, controllers and data is enabled.</p>
         */
        var caching: boolean;
        /**
         * <p>A value indicating whether internal script and css tags loaded with a specific view are being cached.</p>
         */
        var cacheInternalTags: boolean;
        /**
         * <p>A value indicating whether the routeData container is retained in cache when a route is unloaded. Route data is keyed by route index, so it is shared by every URL matching the same route definition.</p>
         */
        var cacheRouteData: boolean;
        /**
         * <p>A value indicating whether the viewData container is retained in cache when a route is unloaded. View data is keyed by route path, so each distinct URL holds its own.</p>
         */
        var cacheViewData: boolean;
        /**
         * <p>A value indicating if server data overwrites (false) or updates (true) data on the client.</p>
         */
        var defaultUpdateRule: boolean;
        /**
         * <p>A value indicating whether incoming data responses are compared for equality before updating to avoid redundant changes.</p>
         */
        var equalityCheck: boolean;
        /**
         * <p>A value indicating if the HTML element must be recreated when there is already an element for the relevant index/key.</p>
         */
        var defaultRecreateRule: boolean;
        /**
         * <p>A value indicating if changes are being observed for the default appData, routeData and viewData data-containers (ECMAScript 6 required).</p>
         */
        var observing: boolean;
        /**
         * <p>A value indicating if changes are being observed during the view rendering process.</p>
         */
        var observeDuringRender: boolean;
        /**
         * <p>A value indicating if the view is automatically updated when changes are being observed.</p>
         */
        var autoUpdateView: boolean;
        /**
         * <p>A value indicating if all data provided through data-bindary-html attributes are trusted.
         * Enable this option only if there are no (sanitized) user defined HTML data-sources (potential security risks).
         * To trust a specific attribute use data-bindary-html=&quot;trust:dataKey&quot;.</p>
         */
        var trustHTML: boolean;
        /**
         * <p>A value indicating that the page is reloaded when the WebSocket is closed by the server due to an internal server error.</p>
         */
        var reloadPageOnWebSocketServerError: boolean;
        /**
         * <p>A value indicating that the route is reloaded when the page is restored from the back/forward cache (bfcache) after navigating back to the page.</p>
         */
        var reloadRouteOnPageRestore: boolean;
        /**
         * <p>The element that triggered a data-bind.
         * Used to prevent updating the field value while typing. Cleared after a view update or can be manually cleared to force the element’s value to update on the next view refresh.</p>
         */
        var dataBindTrigger: HTMLElement | null;
        /**
         * <p>Gets or sets a custom sanitizer function. Overrides built-in sanitizer.</p>
         */
        var sanitizer: ((...params: any[]) => any) | null;
        /**
         * <p>A value indicating whether to use shorthand ('m-') or default ('data-bindary-') prefixes for attributes.</p>
         */
        var useShorthand: boolean;
        /**
         * <p>A value indicating if attribute names use the hyphenated form (e.g. view-formatter) instead of the fused form (e.g. viewFormatter). This setting exists for backwards compatibility.</p>
         */
        var hyphenatedAttributes: boolean;
        /**
         * <p>A value indicating if the framework is busy loading a route or rendering the view.</p>
         */
        const busy: boolean;
        /**
         * <p>The character(s) used as data-key separator. Defaults to '.' (dot). Only change if a dot is used in object keys.</p>
         */
        var dataKeySeparatorChar: string;
        /**
         * <p>The character(s) used to indicate an index pointer within a data-key. Defaults to '@' (at sign). Only change if an at sign is used in object keys.</p>
         */
        var indexPointerChar: string;
        /**
         * <p>Gets the custom prefix.</p>
         */
        const attributePrefix: string;
        /**
         * <p>Sets and uses a custom prefix to use for the 'data-bindary-' attributes.</p>
         * @param [prefix] - <p>The custom attribute prefix to use.</p>
         */
        function setCustomPrefix(prefix?: string): void;
        /**
         * <p>Launches the route for the initial route path value.</p>
         */
        function launch(): void;
        /**
         * <p>Adds a route with the specified route settings.</p>
         * @param route - <p>An object with configuration settings for the route.</p>
         * @returns <p>The array index of the added route within the $bindary.routes array.</p>
         */
        function addRoute(route: Route): number;
        /**
         * <p>Loads the route based on the current URL or based on the specified route path. Method is only applicable when $bindary.prettyURL is enabled.</p>
         * @param [routePath] - <p>The route path to load.</p>
         * @returns <p>The route index.</p>
         */
        function loadRoute(routePath?: string): number;
        /**
         * <p>Dispatches anchor links so that they are handled by the framework's routing. Method is only applicable when &quot;pretty URL&quot; is enabled.</p>
         * @param [container] - <p>The container element in which hyperlinks will be updated.</p>
         */
        function dispatchLinks(container?: HTMLElement): void;
        /**
         * <p>Dispatch an anchor link so that it is handled by the framework's routing. Method is only applicable when &quot;pretty URL&quot; is enabled.</p>
         * @param anchor - <p>The anchor link tag.</p>
         */
        function dispatchLink(anchor: HTMLElement): void;
        /**
         * <p>Adds a component.</p>
         * @param name - <p>The name of the component.</p>
         * @param initiator - <p>A method which initializes and returns a new instance of the component.</p>
         */
        function addComponent(name: string, initiator: (...params: any[]) => any): void;
        /**
         * <p>Observes the specified object for changes (ECMAScript 6 required). This method is intended to observe objects on the global (window) scope. Observing of the appData, routeData and viewData containers can be enabled through $bindary.observing.</p>
         * @example
         * window.myContainer = $bindary.observe({}, 'myContainer');
         * @param obj - <p>The object to observe.</p>
         * @param dataContainer - <p>The name of the root data-container on which the proxy object is defined.</p>
         * @param settings - <p>An object with configuration settings for observing the object.</p>
         * @param settings.event - <p>The custom event to dispatch when a property is changed. This can be used in combination with Native WebComponents to update your custom HTML component when an object property changes. Return false from this event to cancel data-change and view update.</p>
         * @param [settings.createEvent] - <p>A factory function that returns a new CustomEvent for each change. Recommended when changes are batched, deferred, or when change isolation is required.</p>
         * @param settings.eventPayload - <p>The additional data included in the event.detail, providing context for the data change.</p>
         * @param settings.element - <p>The element on which the custom event is fired. By default, the event is fired on the document object.</p>
         * @param settings.viewTree - <p>The root tree to use when updating the view after a data change.</p>
         * @param [settings.reuseProxy = true] - <p>A value indicating whether a single proxy instance is shared across multiple data paths. When disabled, each path gets its own independent proxy, losing cross-path change propagation.</p>
         * @returns <p>A proxy object for template-binding on which modifications are immediately noticed and result in an update of the view.</p>
         */
        function observe(obj: any, dataContainer: string, settings: {
            event: CustomEvent;
            createEvent?: (...params: any[]) => any;
            eventPayload: any;
            element: HTMLElement;
            viewTree: TemplateItem[];
            reuseProxy?: boolean;
        }): any;
        /**
         * @property isProxy - <p>Returns true if the object is a proxy.</p>
         * @property getTarget - <p>Gets the underlying target of the given proxy.</p>
         */
        type ProxyManager = {
            isProxy: (...params: any[]) => any;
            getTarget: (...params: any[]) => any;
        };
        /**
         * <p>Gets the proxy manager used to create observable objects.</p>
         * @returns <p>The proxy manager object.</p>
         */
        function getProxyManager(): ProxyManager;
        /**
         * <p>Stops observing for data-changes on observed objects until startObserving() is called.</p>
         */
        function stopObserving(): void;
        /**
         * <p>Restarts observing for data-changes on observed objects.</p>
         */
        function startObserving(): void;
        /**
         * <p>A function that determines if the handler applies to a specific template item or element.</p>
         * @param item - <p>The template item containing the element.</p>
         */
        type ValueMatcher = (item: componyx.bindary.TemplateItem) => boolean;
        /**
         * <p>A function that retrieves the value from an element.</p>
         * @param element - <p>The target element from which the value should be retrieved.</p>
         */
        type ValueGetter = (element: HTMLElement) => string;
        /**
         * <p>A function that sets the value on an element.</p>
         * @param element - <p>The target element on which the value should be set.</p>
         * @param value - <p>The value to set on the element.</p>
         */
        type ValueSetter = (element: HTMLElement, value: string) => void;
        /**
         * <p>Registers a value handler for data-bound elements.</p>
         * @param matcher - <p>A function that checks if the handler applies for the specified template item.</p>
         * @param getValue - <p>A function that retrieves the value from the element.</p>
         * @param setValue - <p>A function that sets the value on the element.</p>
         * @returns <p>The id of the registered handler (needed in case of removal).</p>
         */
        function registerValueHandler(matcher: ValueMatcher, getValue: ValueGetter, setValue: ValueSetter): string;
        /**
         * <p>Unregisters a value handler.</p>
         * @param id - <p>The id of the handler to remove.</p>
         */
        function unregisterValueHandler(id: string): void;
        /**
         * <p>Places a lock (on the specified dataKey and/or dataContainer) to postpone data updates until unlock is called.
         * Ommit parameters to lock complete data-tree or specify dataContainer only to lock container.</p>
         * @param dataKey - <p>The hierarchical path of the object or object value. This string value should consist of object keys separated by a '.' (dot) character (default, change via dataKeySeparatorChar) and without the data container name.</p>
         * @param [dataContainer] - <p>One of the following data containers: appData, routeData or viewData. Defaults to viewData when dataKey is specified.</p>
         */
        function lock(dataKey: string, dataContainer?: string): void;
        /**
         * <p>Removes the lock (on the specified dataKey and/or dataContainer) to re-enable data updates.
         * Ommit parameters to unlock complete data-tree or specify dataContainer only to unlock container.</p>
         * @param dataKey - <p>The hierarchical path of the object or object value. This string value should consist of object keys separated by a '.' (dot) character (default, change via dataKeySeparatorChar) and without the data container name.</p>
         * @param [dataContainer] - <p>One of the following data containers: appData, routeData or viewData. Defaults to viewData when dataKey is specified.</p>
         * @param [ignore] - <p>A value indicating that previous received data must be ignored.</p>
         * @param [update] - <p>The view is updated automatically after the unlock. This default update behaviour can be cancelled by specifying false for this argument.</p>
         */
        function unlock(dataKey: string, dataContainer?: string, ignore?: boolean, update?: boolean): void;
        /**
         * <p>Updates data-model values for data-bound elements.</p>
         * @param elements - <p>A collection of data-bound elements for which the data-model values must be updated.</p>
         */
        function dataBind(elements: HTMLElement[]): void;
        /**
         * <p>Registers a data change for the specified model (object reference) so that the next view update will display the new data.</p>
         * @param model - <p>The model of the corresponding data-bound element.</p>
         * @param arrayUpdateRules - <p>An array of updateRule objects for the array corresponding with the data-bound repeat element.</p>
         * @param arrayUpdateRules.keys - <p>Indexes or keys within the collection where items where updated.</p>
         * @param arrayUpdateRules.recreate - <p>A value indicating if the HTML element must be recreated when there is already an element for the relevant index/key.</p>
         * @param arrayUpdateRules.addIndex - <p>Position within the array where the items where added. Do not specify the index (Null/Undefined) when items where added at the end of the array.</p>
         * @param arrayUpdateRules.addCount - <p>Number of items that where added to the array.</p>
         * @param arrayUpdateRules.removeIndex - <p>Position within the array where the items where removed. Do not specify the index (Null/Undefined) when items where removed at the end of the array.</p>
         * @param arrayUpdateRules.removeCount - <p>Number of items that where removed from the array.</p>
         * @param [update] - <p>The view is updated automatically after a data change. This default update behaviour can be cancelled by specifying false for this argument.</p>
         */
        function dataChangeForModel(model: any, arrayUpdateRules?: {
            keys?: number[];
            recreate?: boolean;
            addIndex?: number | null;
            addCount?: number;
            removeIndex?: number | null;
            removeCount?: number;
        }[], update?: boolean): void;
        /**
         * <p>Registers a data change for the element with the specified updateId so that the next view update will display the new data.</p>
         * @param updateId - <p>The update id of the corresponding data-bound element.</p>
         * @param arrayUpdateRules - <p>An array of updateRule objects for the array corresponding with the data-bound repeat element.</p>
         * @param arrayUpdateRules.keys - <p>Indexes or keys within the collection where items where updated.</p>
         * @param arrayUpdateRules.recreate - <p>A value indicating if the HTML element must be recreated when there is already an element for the relevant index/key.</p>
         * @param arrayUpdateRules.addIndex - <p>Position within the array where the items where added. Do not specify the index (Null/Undefined) when items where added at the end of the array.</p>
         * @param arrayUpdateRules.addCount - <p>Number of items that where added to the array.</p>
         * @param arrayUpdateRules.removeIndex - <p>Position within the array where the items where removed. Do not specify the index (Null/Undefined) when items where removed at the end of the array.</p>
         * @param arrayUpdateRules.removeCount - <p>Number of items that where removed from the array.</p>
         * @param [update] - <p>The view is updated automatically after a data change. This default update behaviour can be cancelled by specifying false for this argument.</p>
         */
        function dataChangeForId(updateId: string, arrayUpdateRules?: {
            keys?: number[];
            recreate?: boolean;
            addIndex?: number | null;
            addCount?: number;
            removeIndex?: number | null;
            removeCount?: number;
        }[], update?: boolean): void;
        /**
         * <p>Registers a data change for the specified dataKey so that the next view update will display the new data.</p>
         * @param dataKey - <p>The hierarchical path of the changed object or object value. This string value should consist of object keys separated by a '.' (dot) character (default, change via dataKeySeparatorChar) and without the data container name.</p>
         * @param [dataContainer] - <p>One of the root data-containers to which the data-key belongs: appData(0), routeData(1) or viewData(2).</p>
         * @param arrayUpdateRules - <p>An array of updateRule objects for the array corresponding with the data-bound repeat element.</p>
         * @param arrayUpdateRules.keys - <p>Indexes or keys within the collection where items where updated.</p>
         * @param arrayUpdateRules.recreate - <p>A value indicating if the HTML element must be recreated when there is already an element for the relevant index/key.</p>
         * @param arrayUpdateRules.addIndex - <p>Position within the array where the items where added. Do not specify the index (Null/Undefined) when items where added at the end of the array.</p>
         * @param arrayUpdateRules.addCount - <p>Number of items that where added to the array.</p>
         * @param arrayUpdateRules.removeIndex - <p>Position within the array where the items where removed. Do not specify the index (Null/Undefined) when items where removed at the end of the array.</p>
         * @param arrayUpdateRules.removeCount - <p>Number of items that where removed from the array.</p>
         * @param [update] - <p>The view is updated automatically after a data change. This default update behaviour can be cancelled by specifying false for this argument.</p>
         */
        function dataChange(dataKey: string, dataContainer?: string | number, arrayUpdateRules?: {
            keys?: number[];
            recreate?: boolean;
            addIndex?: number | null;
            addCount?: number;
            removeIndex?: number | null;
            removeCount?: number;
        }[], update?: boolean): void;
        /**
         * <p>Clears all registered data changes and cancels the delayed view update.</p>
         */
        function clearDataChanges(): void;
        /**
         * <p>Sends the specified data to the server through the connected websocket or new xhr connection and returns an awaitable Promise that resolves when the response is received.</p>
         * @param data - <p>The JSON data request.</p>
         * @param [serverMethod] - <p>A class type and static method (dot separated) to call on the server when executing the data request. Requires the .NET server-side Bindary framework.</p>
         * @param [clientId] - <p>A value which is send with each data request to be able to uniquely identify clients on the server side.</p>
         * @param [updateView] - <p>A value indicating if the view is updated after the data response. Defaults to true.</p>
         * @returns <p>Resolves with the server response message.</p>
         */
        function dataSendAsync(data: any, serverMethod?: string, clientId?: string, updateView?: boolean): Promise<object>;
        /**
         * <p>Sends the specified data to the server through the connected websocket or new xhr connection.</p>
         * @param data - <p>The JSON data request.</p>
         * @param [serverMethod] - <p>A class type and static method (dot separated) to call on the server when executing the data request. Requires the .NET server-side Bindary framework.</p>
         * @param [clientId] - <p>A value which is send with each data request to be able to uniquely identify clients on the server side.</p>
         * @param [onDataResponse] - <p>An event callback method which is invoked on the response for this request. Method parameters: data (Object).</p>
         * @param [updateView] - <p>A value indicating if the view is updated after the data response. Defaults to true.</p>
         * @returns <p>The WebSocket or XHR object used to transfer the data.</p>
         */
        function dataSend(data: any, serverMethod?: string, clientId?: string, onDataResponse?: (...params: any[]) => any, updateView?: boolean): WebSocket | XMLHttpRequest;
        /**
         * <p>Sends the specified data to the server while attempting to keep the browser responsive to user-input. Use this method to send data only when the window is being unloaded. Check the 3rd argument (boolean) in the controller's unload method to see if the call came from a window-before-unload event. When Websockets are disabled or unsupported an attempt is made to send the data through navigator.sendBeacon, to keep the browser responsive to user-input. However, if sendBeacon is unsupported a fallback to a synchronous XHR call is made.</p>
         * @param data - <p>The JSON data request. The navigator.sendBeacon method has browser-specific data size limitations.</p>
         * @param [serverMethod] - <p>A class type and static method (dot separated) to call on the server when executing the data request. Requires the .NET server-side Bindary framework.</p>
         * @param [clientId] - <p>A value which is send with each data request to be able to uniquely identify clients on the server side.</p>
         * @returns <p>A value is only returned when the data is sent through navigator.sendBeacon. This value indicates if the data was Successfully sent or if a data limit was reached.</p>
         */
        function unload(data: any, serverMethod?: string, clientId?: string): boolean | void;
        /**
         * <p>Creates or updates a data-bound template item. The item will be rendered on the next view update.</p>
         * @param element - <p>An HTML element having attributes to serve as data-bound template item.</p>
         * @param [deep = false] - <p>A value indicating if child elements should be updated.</p>
         * @param [clear = false] - <p>A value indicating if child items must be cleared.</p>
         */
        function updateTemplateItem(element: HTMLElement, deep?: boolean, clear?: boolean): void;
        /**
         * <p>Removes a data-bound template item.</p>
         * @param element - <p>The original element.</p>
         */
        function removeTemplateItem(element: HTMLElement): void;
        /**
         * <p>(Re)Renders the view with the active data objects.</p>
         * @param complete - <p>A value indicating if the view must be refreshed completely instead of checking for registered data changes.</p>
         * @param redetectTemplateElements - <p>A value indicating if the template elements should be redetected. Make sure keep attributes is set to true, either globally or on the elements, otherwise these elements are not redetected.</p>
         * @param [viewTree] - <p>The root template items for the view tree, from which the update will propagate.</p>
         */
        function updateView(complete: boolean, redetectTemplateElements: boolean, viewTree?: TemplateItem[]): void;
        /**
         * <p>(Re)Renders the view with the active data objects. The delayed update call is placed at the end of the execution queue through setTimeout()</p>
         * @param complete - <p>A value indicating if the view must be refreshed completely instead of checking for registered data changes.</p>
         * @param [redetectTemplateElements] - <p>A value indicating if the template elements should be redetected.</p>
         * @param [viewTree] - <p>The root template items for the view tree, from which the update will propagate.</p>
         */
        function updateViewDelayed(complete: boolean, redetectTemplateElements?: boolean, viewTree?: TemplateItem[]): void;
        /**
         * <p>Creates the view tree with data-bound template items.</p>
         * @param [rootEl] - <p>The root HTML Element.</p>
         * @param [rootItem] - <p>The root Template Item.</p>
         */
        function createViewTree(rootEl?: HTMLElement, rootItem?: componyx.bindary.TemplateItem): void;
        /**
         * <p>Renders the view tree using data-bound template items.
         * <b>Important:</b> This method should only be called during an active render cycle, otherwise use updateViewDelayed() or updateView() instead.
         * Note that unlike updateView(), this method does <b>not</b> trigger preRender or postRender events.</p>
         * @param [update] - <p>A value indicating if this is an update.</p>
         * @param [viewTree] - <p>The view tree to create.</p>
         */
        function renderView(update?: boolean, viewTree?: TemplateItem[]): void;
        /**
         * <p>Disconnects the data connection.</p>
         */
        function disconnect(): void;
        /**
         * <p>Gets the template item that belongs to the specified element.</p>
         * @param element - <p>The element for which to retrieve the template item.</p>
         * @returns <p>The template item.</p>
         */
        function getTemplateItem(element: HTMLElement): componyx.bindary.TemplateItem;
        /**
         * <p>Gets the view container element.</p>
         * @returns <p>The view container element.</p>
         */
        function getViewContainer(): HTMLElement;
        /**
         * <p>Gets the page anchor.</p>
         * @returns <p>The page anchor.</p>
         */
        function getAnchor(): string;
        /**
         * <p>Gets the base href which precedes all route paths when prettyURL is enabled.</p>
         * @returns <p>The base href.</p>
         */
        function getBaseHref(): string;
        /**
         * <p>Gets the internal cache object in where views, controllers and data are stored.</p>
         * @returns <p>The cache object.</p>
         */
        function getCache(): any;
        /**
         * <p>Clears the internal cache object in where views, includes, controllers and data are stored. Loaded script and CSS tags from a view or includable file will also be removed from the page when clearing the cache (unless indicated otherwise through the parameters).</p>
         * @param [keepControllers] - <p>A value indicating if loaded controller script tags must remain on the page.</p>
         * @param [keepExternalScripts] - <p>A value indicating if external script tags from a view or includable file must remain on the page.</p>
         * @param [keepExternalCss] - <p>A value indicating if external css tags from a view or includable file must remain on the page.</p>
         * @param [keepInternalScripts] - <p>A value indicating if internal (also called inline) script tags from a view or includable file must remain on the page.</p>
         * @param [keepInternalCss] - <p>A value indicating if internal (also called inline) css tags from a view or includable file must remain on the page.</p>
         */
        function clearCache(keepControllers?: boolean, keepExternalScripts?: boolean, keepExternalCss?: boolean, keepInternalScripts?: boolean, keepInternalCss?: boolean): void;
        /**
         * <p>Creates an instance of TemplateItem.</p>
         * @property root - <p>The root item or itself if this is the root of the item tree.</p>
         * @property parent - <p>The parent item.</p>
         * @property children - <p>The child items of the current item.</p>
         * @property id - <p>The unique identifier of the item.</p>
         * @property placeHolder - <p>A place holder element for an item that is not rendered.</p>
         * @property repeatPlaceHolder - <p>A place holder element for a repeating item.</p>
         * @property trusted - <p>A value indicating if the HTML value is trusted.</p>
         * @property includable - <p>A value indicating if the item is an includable item.</p>
         * @property includableRoot - <p>A value indicating if the item is the root of the includable.</p>
         * @property included - <p>A value indicating if an includable is included.</p>
         * @property includeFile - <p>The include file data-key or path.</p>
         * @property include - <p>The include data-key or identifier.</p>
         * @property isComponent - <p>A value indicating if the item is a component.</p>
         * @property loaded - <p>A value indicating if the included data or component is loaded.</p>
         * @property element - <p>The rendered element.</p>
         * @property sourceElement - <p>The original collected element. This element can differ from the rendered element when it is included or within a repeater.</p>
         * @property display - <p>The original display style of the element.</p>
         * @property elementInfo - <p>Information about the element.</p>
         * @property context - <p>The object context.</p>
         * @property repeatValue - <p>The repeat value context.</p>
         * @property repeatItemIdValue - <p>The value of the repeat item id.</p>
         * @property itemId - <p>The item is rendered if the item id matches the value of the repeat item id.</p>
         * @property index - <p>The current index within the array repeater.</p>
         * @property key - <p>The current key within the object repeater.</p>
         * @property value - <p>The data value.</p>
         * @property isRendered - <p>A value indicating if the element is rendered.</p>
         * @property dataChange - <p>Holds the active data change rules for the item.</p>
         * @property indexKey - <p>The index key holds the dynamic (data-key) or static index pointer.</p>
         * @property repeatElements - <p>The collection of elements within the repeater.</p>
         * @property dataType - <p>The type of the data value.</p>
         * @property inputBind - <p>The data bind value.</p>
         * @property liveBind - <p>A value indicating if live binding is enabled (true) or disabled (false) or the debounce delay in milliseconds.</p>
         * @property updateId - <p>The update identifier.</p>
         * @property updateIdFromParent - <p>A value indicating that the updateId was copied from the parent item in the update loop.</p>
         * @property attributes - <p>The data bound attributes.</p>
         * @property isHTML - <p>A value indicating if the data value is HTML.</p>
         * @property if - <p>The function invoked to test the conditional if statement.</p>
         * @property elseIf - <p>The function invoked to test the conditional else if statement.</p>
         * @property else - <p>The function invoked to test the conditional else statement.</p>
         * @property dataFormatter - <p>The function invoked when the value is set on the data object.</p>
         * @property viewFormatter - <p>The function invoked when the value is set on the element.</p>
         * @property preRender - <p>The function invoked before the element is rendered.</p>
         * @property postRender - <p>The function invoked after the element is rendered.</p>
         * @property load - <p>The function invoked when an includable is included.</p>
         * @property filter - <p>The function invoked to filter a collection.</p>
         * @property events - <p>The element events.</p>
         * @property repeatDataKey - <p>The data-key for the repeat value.</p>
         * @property repeatItemIdDataKey - <p>The data-key for the repeat item id.</p>
         * @property contextDataKey - <p>The data-key for the context value.</p>
         * @property hasValue - <p>The data-key for the value check.</p>
         * @property dataKey - <p>The data-key for the data value.</p>
         * @property repeatDataKeyPath - <p>The data-key for the repeat value.</p>
         * @property contextDataKeyPath - <p>The data-key for the context value.</p>
         * @property hasValueDataKeyPath - <p>The data-key for the value check.</p>
         * @property dataKeyPath - <p>The data-key for the data value.</p>
         * @property conditionMet - <p>A value indicating the state of the conditional statement.</p>
         * @param el - <p>The DOM element associated with the template item.</p>
         * @param events - <p>The events related to the template item.</p>
         * @param attributes - <p>The attributes for the template item.</p>
         * @param parent - <p>The parent TemplateItem if this item is a child.</p>
         * @param appendToRoot - <p>Determines whether to append to the root.</p>
         */
        class TemplateItem
        {
            constructor(el: HTMLElement, events: any, attributes: any, parent: componyx.bindary.TemplateItem, appendToRoot: boolean);
            /**
             * <p>The root item or itself if this is the root of the item tree.</p>
            */
            root: componyx.bindary.TemplateItem;
            /**
             * <p>The parent item.</p>
            */
            parent: componyx.bindary.TemplateItem;
            /**
             * <p>The child items of the current item.</p>
            */
            children: TemplateItem[];
            /**
             * <p>The unique identifier of the item.</p>
            */
            id: string;
            /**
             * <p>A place holder element for an item that is not rendered.</p>
            */
            placeHolder: HTMLElement;
            /**
             * <p>A place holder element for a repeating item.</p>
            */
            repeatPlaceHolder: HTMLElement;
            /**
             * <p>A value indicating if the HTML value is trusted.</p>
            */
            trusted: boolean;
            /**
             * <p>A value indicating if the item is an includable item.</p>
            */
            includable: boolean;
            /**
             * <p>A value indicating if the item is the root of the includable.</p>
            */
            includableRoot: boolean;
            /**
             * <p>A value indicating if an includable is included.</p>
            */
            included: boolean;
            /**
             * <p>The include file data-key or path.</p>
            */
            includeFile: string;
            /**
             * <p>The include data-key or identifier.</p>
            */
            include: string;
            /**
             * <p>A value indicating if the item is a component.</p>
            */
            isComponent: boolean;
            /**
             * <p>A value indicating if the included data or component is loaded.</p>
            */
            loaded: boolean;
            /**
             * <p>The rendered element.</p>
            */
            element: HTMLElement;
            /**
             * <p>The original collected element. This element can differ from the rendered element when it is included or within a repeater.</p>
            */
            sourceElement: HTMLElement;
            /**
             * <p>The original display style of the element.</p>
            */
            display: string;
            /**
             * <p>Information about the element.</p>
            */
            elementInfo: elementInfo;
            /**
             * <p>The object context.</p>
            */
            context: any;
            /**
             * <p>The repeat value context.</p>
            */
            repeatValue: any;
            /**
             * <p>The value of the repeat item id.</p>
            */
            repeatItemIdValue: any;
            /**
             * <p>The item is rendered if the item id matches the value of the repeat item id.</p>
            */
            itemId: any;
            /**
             * <p>The current index within the array repeater.</p>
            */
            index: number;
            /**
             * <p>The current key within the object repeater.</p>
            */
            key: string;
            /**
             * <p>The data value.</p>
            */
            value: any;
            /**
             * <p>A value indicating if the element is rendered.</p>
            */
            isRendered: boolean;
            /**
             * <p>Holds the active data change rules for the item.</p>
            */
            dataChange: object[];
            /**
             * <p>The index key holds the dynamic (data-key) or static index pointer.</p>
            */
            indexKey: String[] | Number[];
            /**
             * <p>The collection of elements within the repeater.</p>
            */
            repeatElements: HTMLElement[];
            /**
             * <p>The type of the data value.</p>
            */
            dataType: string;
            /**
             * <p>The data bind value.</p>
            */
            inputBind: string;
            /**
             * <p>A value indicating if live binding is enabled (true) or disabled (false) or the debounce delay in milliseconds.</p>
            */
            liveBind: boolean | number;
            /**
             * <p>The update identifier.</p>
            */
            updateId: string;
            /**
             * <p>A value indicating that the updateId was copied from the parent item in the update loop.</p>
            */
            updateIdFromParent: boolean;
            /**
             * <p>The data bound attributes.</p>
            */
            attributes: any;
            /**
             * <p>A value indicating if the data value is HTML.</p>
            */
            isHTML: boolean;
            /**
             * <p>The function invoked to test the conditional if statement.</p>
            */
            if: string;
            /**
             * <p>The function invoked to test the conditional else if statement.</p>
            */
            elseIf: string;
            /**
             * <p>The function invoked to test the conditional else statement.</p>
            */
            else: string;
            /**
             * <p>The function invoked when the value is set on the data object.</p>
            */
            dataFormatter: string;
            /**
             * <p>The function invoked when the value is set on the element.</p>
            */
            viewFormatter: string;
            /**
             * <p>The function invoked before the element is rendered.</p>
            */
            preRender: string;
            /**
             * <p>The function invoked after the element is rendered.</p>
            */
            postRender: string;
            /**
             * <p>The function invoked when an includable is included.</p>
            */
            load: string;
            /**
             * <p>The function invoked to filter a collection.</p>
            */
            filter: string;
            /**
             * <p>The element events.</p>
            */
            events: any;
            /**
             * <p>The data-key for the repeat value.</p>
            */
            repeatDataKey: String[];
            /**
             * <p>The data-key for the repeat item id.</p>
            */
            repeatItemIdDataKey: String[];
            /**
             * <p>The data-key for the context value.</p>
            */
            contextDataKey: String[];
            /**
             * <p>The data-key for the value check.</p>
            */
            hasValue: String[];
            /**
             * <p>The data-key for the data value.</p>
            */
            dataKey: String[];
            /**
             * <p>The data-key for the repeat value.</p>
            */
            repeatDataKeyPath: string;
            /**
             * <p>The data-key for the context value.</p>
            */
            contextDataKeyPath: string;
            /**
             * <p>The data-key for the value check.</p>
            */
            hasValueDataKeyPath: string;
            /**
             * <p>The data-key for the data value.</p>
            */
            dataKeyPath: string;
            /**
             * <p>A value indicating the state of the conditional statement.</p>
            */
            conditionMet: boolean;
        }
    }
}

/**
 * <p>Bindary ($bindary) is a highly flexible data-binding framework for developing web applications. It utilizes declarative HTML templates based on data-attributes to bind the DOM- to the -JavaScript world.</p>
 */
declare var $bindary: typeof componyx.bindary;