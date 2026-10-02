/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
/**
* The data request is a JSON serialized object sent to the backend data server.
* @typedef {Object} dataRequestType
* @memberof componyx.bindary
  * @property {String} [clientId]             - The id of the active client.
  * @property {Number} routeIndex             - The index of the active route.
  * @property {String} routePath              - The path of the active route.
  * @property {String} serverMethod	          - A class type and static method (dot separated) to call on the server when executing the data request. Requires the .NET server-side Bindary framework.
  * @property {Number} callbackId             - The identifier of the client callback method to invoke when the data request has finished.
  * @property {Number} initialLoad	          - A value indicating if this is the route's initial load.
  * @property {Object} data					  - The custom data object.
*/

/**
* The data response is a JSON serialized object returned from a backend data server.
* @typedef {Object} dataResponse
* @memberof componyx.bindary
  * @property {String} [clientId]			  - The id of the active client.
  * @property {Number} callbackId			  - The identifier of the client callback method to invoke when the data request has finished.
  * @property {String} isError	              - A value indicating that an error occurred.
  * @property {dataContainer} data			  - An object which holds the data and data-rules.
*/

/**
* The data container is part of the data response and holds data and optionally rules for at least one data container.
* @typedef {Object} dataContainer
* @memberof componyx.bindary
  * @property {Object} [appData]				- The app data.
  * @property {Object} [routeData]				- The route data.
  * @property {Object} [viewData]				- The view data.
  * @property {dataRules} [appDataRules]		- Data rules for app data.
  * @property {dataRules} [routeDataRules]		- Data rules for route data.
  * @property {dataRules} [viewDataRules]		- Data rules for view data.
*/

/**
* The data rules define how data from the server is updated on the client.
* @typedef {Object} dataRules
* @memberof componyx.bindary
  * @property {string} routeIndex                               - The route index for updating route data on a different route than the currently active route.
  * @property {string} routePath				                - The route path for updating view data on a different view than the currently active view.
  * @property {string} path                                     - The hierarchical path on the target object where the source object will be added/updated.
  * @property {number} updateKey                                - The key used to match and update items on the target array. The array item is updated when the value on both source and target of specified key matches.
  * @property {string[]} removeByKeyValues                      - A collection of key values to remove. Items on the target client object with a matching value for the specified UpdateKey will be removed.
  * @property {number} addIndex                                 - The position within the array where the items must be added. Do not specify the index (Null/Undefined) when items must be added at the end of the array.
  * @property {number} removeIndex                              - The position within the array where the items must be removed. Do not specify the index (Null/Undefined) when items must be removed at the end of the array.
  * @property {number} removeCount                              - The number of items to remove from the target array.
  * @property {number} ignoreNullValues			                - A value indicating if null values in the response data will be ignored.
  * @property {boolean} update                                  - A value indicating if server data overwrittes (false) or updates (true) data on the client.
  * @property {boolean} recreate                                - A value indicating if the HTML element must be recreated when there is already an element for the relevant index/key.
  * @property {Object.<string, object>} omitKeys                - A collection of keys to omit on the target client object.
*/

/**
* @typedef {Object} elementInfo
* @memberof componyx.bindary
  * @property {String} name						- The name of the element.
  * @property {Boolean} isInput					- A value indicating if the element is an input.
  * @property {Boolean} isTextarea				- A value indicating if the element is a textarea.
  * @property {Boolean} isSelect				- A value indicating if the element is a select.
  * @property {Boolean} isCheck					- A value indicating if the element is a checkbox.
  * @property {Boolean} isRadio					- A value indicating if the element is a radiobutton.
*/

/**
 * @typedef {Object} componyx.bindary.CancelToken
 * @property {boolean} cancel - Set to `true` to cancel the event.
 */

/**
 * @typedef {Object} componyx.bindary.WebSocketEventArgs
 * @property {WebSocket} socket - The WebSocket instance.
 * @property {Event} event - The native event object.
 */

/**
 * @typedef {Object} componyx.bindary.PreDataBindEventArgs
 * @property {componyx.bindary.TemplateItem} templateItem - The template item.
 * @property {HTMLElement} field - The field element.
 * @property {Function} dataBind - Function to trigger manual data binding.
 * @property {componyx.bindary.CancelToken} cancelToken - Token to cancel automatic data binding.
 */

/**
 * @typedef {Object} componyx.bindary.PostDataBindEventArgs
 * @property {componyx.bindary.TemplateItem} templateItem - The template item.
 * @property {HTMLElement} field - The field element.
 * @property {Object} model - The data model.
 * @property {any} value - The bound value.
 */

/**
 * @typedef {Object} componyx.bindary.ErrorEventArgs
 * @property {Object} error - The error object returned by the server.
 */

/**
 * @typedef {Object} componyx.bindary.RouteErrorEventArgs
 * @property {string} type - What failed: 'route' (no route matches the route path), 'view' or 'controller'.
 * @property {number} [status] - The HTTP status of the failed request, for 'view' and 'controller' when available.
 * @property {string} [url] - The URL of the view or controller that failed to load.
 * @property {string} routePath - The route path that was requested.
 */

/**
 * @typedef {Object} componyx.bindary.PreLoadEventArgs
 * @property {componyx.bindary.CancelToken} cancelToken - Token to cancel loading.
 */

/**
 * @typedef {Object} componyx.bindary.DataRequestEventArgs
 * @property {string} dataRequest - The requested data identifier.
 * @property {Function} routeReady - Callback to continue route loading.
 * @property {componyx.bindary.CancelToken} cancelToken - Token to cancel loading.
 */

/**
 * @typedef {Object} componyx.bindary.LoadEventArgs
 * @property {Object} [data] - The loaded route data.
 */

/**
 * @typedef {Object} componyx.bindary.PreDataUpdateEventArgs
 * @property {Object} dataMessage - The incoming data object.
 * @property {componyx.bindary.CancelToken} cancelToken - Token to cancel updating.
 */

/**
 * @typedef {Object} componyx.bindary.PostDataUpdateEventArgs
 * @property {Object} [data] - The updated data object.
 */

/**
 * @typedef {Object} componyx.bindary.VisibilityChangeEventArgs
 * @property {boolean} visible - Whether the document is now visible.
 * @property {componyx.bindary.CancelToken} cancelToken - Token to cancel the default visibility action. The default action checks if there is an open websocket connection and if so it will send a request to the server to update the websocket object on the client.
 */

/**
 * @typedef {Object} componyx.bindary.AnchorScrollEventArgs
 * @property {HTMLElement} [el] - The anchor element.
 */

/**
 * @typedef {Object} componyx.bindary.UnloadEventArgs
 * @property {number} routeIndex - The index of the route being unloaded.
 * @property {string} routePath - The path of the route being unloaded.
 * @property {componyx.bindary.CancelToken} cancelToken - Token to cancel unloading.
 * @property {boolean} pageHide - A value indicating if this unload was caused by the page hide event, rather than an in-app route change.
 */

/**
 * @typedef {Object} componyx.bindary.Route
 * @property {String|RegEx} path The route path to map. A string to map an exact route or a regex to map a dynamic route. Capture groups from the path with the regex and use them with $groupnumber in the URL, dataRequest and controller method settings.
 * @property {String} [controllerURL] URL of the controller js file.
 * @property {String} [viewURL] URL of the template view.
 * @property {String|Object} [data] JSON data to send with the data load (XHR or WS).
 * @property {Boolean} [dataConnect] A value indicating if the data source will be connected (default) or disconnected when this route is active.
 * @property {Boolean} [observing] A value indicating if changes are being observed for the routeData and viewData data-containers (ECMAScript 6 required).
 * @property {String} [controllerLoad] Name of the controller method invoked after loading the required route data and sources.
 * @property {String} [controllerPreDataBind] Name of the controller method invoked before the data bind action is executed. Defaults to 'preDataBind'. @see {@link componyx.bindary.PreDataBindEventArgs}
 * @property {String} [controllerPostDataBind] Name of the controller method invoked after the data bind action is executed. Defaults to 'postDataBind'. @see {@link componyx.bindary.PostDataBindEventArgs}
 * @property {String} [controllerPreDataUpdate] Name of the controller method invoked when data is received but before the client data is updated. The data object is passed as single argument. Use false as method return value to cancel further processing of the data object. Defaults to 'preDataUpdate'.
 * @property {String} [controllerPostDataUpdate] Name of the controller method invoked after the data is updated. Defaults to 'postDataUpdate'.
 * @property {String} [controllerPreRender] Name of the controller method invoked every time before the view is rendered. Defaults to 'preRender'.
 * @property {String} [controllerPostRender] Name of the controller method invoked every time after the view is rendered. Defaults to 'postRender'.
 * @property {String} [controllerPostLoad] Name of the controller method invoked when the route is loaded. Defaults to 'postLoad'.
 * @property {String} [controllerUnload] Name of the controller method invoked when the route is unloaded because a new route is requested. The routeIndex and routePath of the requested route are passed as arguments. A value of true/null/undefined to unload the current route and load the requested route or false to cancel the unload and keep the current route active. Defaults to 'unLoad'.
 * @property {String} [dataServerLoad] A class type and static method (dot separated) to invoke on the server to load data. Requires the .NET server-side Bindary framework.
 * @property {String} [dataServerUnload] A class type and static method (dot separated) to invoke on the server to unload data. Requires the .NET server-side Bindary framework.
 */

"use strict";
(async function (window)
{
    /**
     * Namespace for bindary modules.
     * @namespace componyx.UI.bindary_modules
     */
    componyx.bindary_modules = componyx.bindary_modules || {};

    /**
     * Promise that resolves when all bindary modules are loaded asynchronously.
     * @type {Promise<void>}
     * @memberof componyx.UI.bindary_modules
     */
    componyx.bindary_modules.loaded = (async () =>
    {
        // these dynamic imports are removed when files are bundled into UI(.min).js
        await import(`${$UI.getScriptResourcePath('Base.Sanitizer')}`);
        await import(`${$UI.getScriptResourcePath('Base.Bindary.Core')}`);
        await import(`${$UI.getScriptResourcePath('Base.Bindary.Connection')}`);
        await import(`${$UI.getScriptResourcePath('Base.Bindary.DataUpdater')}`);
        await import(`${$UI.getScriptResourcePath('Base.Bindary.ExpressionEngine')}`);
        await import(`${$UI.getScriptResourcePath('Base.Bindary.ProxyManager')}`);
        await import(`${$UI.getScriptResourcePath('Base.Bindary.Renderer')}`);
        await import(`${$UI.getScriptResourcePath('Base.Bindary.Router')}`);
        await import(`${$UI.getScriptResourcePath('Base.Bindary.Scroller')}`);
        await import(`${$UI.getScriptResourcePath('Base.Bindary.Template')}`);
    })();

    await componyx.bindary_modules.loaded;
    const Sanitizer = componyx.base_modules.Sanitizer;
    const core = componyx.bindary_modules.core;
    const dataUpdater = componyx.bindary_modules.dataUpdater;
    const connection = componyx.bindary_modules.connection;
    const proxyManager = componyx.bindary_modules.proxyManager;
    const Renderer = componyx.bindary_modules.Renderer;
    const router = componyx.bindary_modules.router;
    const scroller = componyx.bindary_modules.scroller;
    const TemplateItem = componyx.bindary_modules.TemplateItem;
    const ExpressionEngine = componyx.bindary_modules.ExpressionEngine;
    core.scroller = scroller;
    core.expressionEngine = new ExpressionEngine();
    core.sanitizer = new Sanitizer();

    /**
     * Bindary HTML data-attributes.
     * @typedef {Object} HTMLAttributes
     * @memberof componyx.bindary
     * @property {String} ["data-bindary-context"]          - This attribute sets the data-context (object scope) for the element and its child-elements through the data-key.
     * @property {String} ["data-bindary-value"]            - This attribute sets the inner text value of the element through the data-key.
     * @property {String} ["data-bindary-html"]             - This attribute sets the inner HTML value of the element through the data-key. By default the HTML data is sanitized unless specified as trusted data. Use trust:data-key for own (not user defined) HTML data-sources or enable $bindary.trustHTML to trust all data provided through data-bindary-html.
     * @property {String} ["data-bindary-bind"]             - This attribute enables two-way data-binding for input elements (input, textarea, select) through the data-key. Two-way data binding means that, apart from the element's value being updated when the data changes (either automatically or by manual registering), the data is updated as well when the element value changes.
     * @property {String} ["data-bindary-live"]             - This attribute enables live binding per element. Use "false" to disable live binding, "true" or empty to enable and use the global delay ($bindary.liveBindDelay), or a number (as string) to enable and set a custom delay in ms. Active on the element and its child elements.
     * @property {String} ["data-bindary-type"]             - This attribute can be used in conjunction with the bind/value attribute to define the data-type of the corresponding data value when the type is not a string. The supported data-types are boolean, number and date. For number, an optional precision can be specified: number(2) overrides the global decimalPrecision for this binding.
     * @property {String} ["data-bindary-attributes"]       - This attribute sets element attributes that require data-binding. Wrap the data-key inside curly brackets when custom text in the HTML attribute is desired.
     * @property {String} ["data-bindary-has-value"]         - This attribute without value defines that the element is rendered when the current data context is NOT empty, null or undefined. A data-key value can be specified when a different value than the current context should determine if the element will be rendered.
     * @property {String} ["data-bindary-repeat"]           - This attribute enables collection data-binding through the data-key.
     * @property {String} ["data-bindary-repeat-item-id"]     - This attribute can be used in conjunction with the repeat attribute. The data-key value specifies which item property of the bound collection serves as the item-template identifier.
     * @property {String} ["data-bindary-item-id"]           - This attribute sets the value for matching the item property specified through repeatItemId. The element will be rendered when the property value of the collection item matches the attribute value.
     * @property {String} ["data-bindary-filter"]           - This attribute can be used in conjunction with the repeat attribute to bind a (controller) function to filter the collection before rendering.
     * @property {String} ["data-bindary-view-formatter"]    - This attribute can be used in conjunction with the value or html attribute to bind a (controller) function to format the data value when the element is rendered.
     * @property {String} ["data-bindary-data-formatter"]    - This attribute can be used in conjunction with the bind attribute to bind a (controller) function to format the input value when data binding occurs.
     * @property {String} ["data-bindary-includable"]       - This attribute marks an element as includable template-item (no attribute value required).
     * @property {String} ["data-bindary-include"]          - This attribute includes the contents of an element or file. Use '#element-id' or 'data.key' (dynamic element-id value) to reference an element marked with the includable attribute by id. To reference a file use 'file:path'.
     * @property {String} ["data-bindary-component"]        - This attribute can be used in conjunction with the include attribute (file:path) and marks the included file content as component. The attribute value must contain the name of the component. The file must include JavaScript code to register the Bindary component, through $bindary.addComponent(), providing the component name (matching the component attribute value) and an initiator function.
     * @property {String} ["data-bindary-observe"]          - This attribute can be used in conjunction with the component attribute. The data-key value specifies which item property of the component's context will be automatically observed for data changes, triggering view updates when changes occur.
     * @property {String} ["data-bindary-load"]             - This attribute can be used in conjunction with the include attribute (file:path) for binding a (controller) function to invoke when the file contents have been loaded.
     * @property {String} ["data-bindary-pre-render"]        - This attribute can be used to bind a (controller) function to invoke before the element is rendered. The element is not rendered if the method returns false.
     * @property {String} ["data-bindary-if"]               - This attribute can be used to bind a (controller) function to execute a conditional if statement. The element is not rendered if the method returns false.
     * @property {String} ["data-bindary-else-if"]           - This attribute can be used to bind a (controller) function to execute a conditional else if statement. The element is not rendered if the method returns false.
     * @property {String} ["data-bindary-else"]             - This attribute determines that the element is rendered when the conditional if or elseif statements returned false.
     * @property {String} ["data-bindary-post-render"]       - This attribute can be used to bind a (controller) function to invoke after the element is rendered. The element is not visible if the method returns false.
     * @property {String} ["data-bindary-on"]               - This attribute can be used to bind a (controller) function to any HTML event.
     * @property {String} ["data-bindary-update-id"]         - This attribute sets a unique identifier to use when registering data changes for a specific element.
     * @property {String} ["data-bindary-keep"]             - This attribute can be used to define if the data-bindary- attributes are removed (no value) or remain (value "true") on the element after it has been discovered by the framework. Active on the element and its child elements.
     * @property {String} ["data-bindary-view"]             - This valueless attribute marks an HTML element as root container for requested views.
     * @property {String} ["data-bindary-ignore"]           - This valueless attribute marks an HTML element and its child elements with data-bindary attributes to be ignored. This can be used to activate templates at a desired moment and for such purpose the intended 'include' attribute is not desired.
     */

    core.initializePrefix(core.shortPrefix);
    core.initCache();

    /**
    * Bindary ($bindary) is a highly flexible data-binding framework for developing web applications. It utilizes declarative HTML templates based on data-attributes to bind the DOM- to the -JavaScript world.
    * @namespace
    * @memberof componyx
    */
    componyx.bindary = {
        /**
         * A value indicating if the route for the initial route path value is loaded when the DOM is ready.
         * @type {Boolean}
         */
        launchOnLoad: true,

        /**
         * The connection URL of the server side data-server for retrieving app/view data. Leave this setting empty when custom data retrieval methods are desired.
         * @type {String|null}
         */
        dataServerURL: null,

        /**
         * A value indicating if a relative data-server URL is used.
         * @type {Boolean}
         */
        relativeDataServerURL: false,

        /**
         * The relative or absolute root URL where views are located.
         * @type {String}
         */
        viewRootURL: '',

        /**
         * The relative or absolute root URL where client controllers are located.
         * @type {String}
         */
        controllerRootURL: '',

        /**
         * The relative or absolute root URL where includables are located.
         * @type {String}
         */
        includeRootURL: '',

        /**
         * A value indicating if the browser has support for the websocket protocol.
         * @type {Boolean}
         */
        get websocketSupport() { return "WebSocket" in window; },

        /**
         * A value indicating if websockets should be used for updating view data.
         * @type {Boolean}
         */
        useWebSocket: true,

        /**
         * A value indicating to use a secure connection (SSL/TLS). Defaults to true if a HTTPS connection is detected.
         * @type {Boolean|null}
         */
        secure: null,

        /**
         * The interval time in milliseconds between xhr data update checks when websockets are not supported/enabled.
         * @type {Number|null}
         */
        xhrUpdateInterval: null,

        /**
         * The time in milliseconds before a new attempt is made, when a previous attempt failed, to scroll to the anchor or history scroll position.
         * @type {Number}
         */
        scrollRetryInterval: 50,

        /**
         * The time in milliseconds before attempting to set the correct scroll position stops.
         * @type {Number}
         */
        scrollRetryTimeout: 2000,

        /**
         * A value indicating if a data-bound input element performs a live update of the corresponding data model (keyup events) or after a change (change/blur events).
         * @type {Boolean}
         */
        liveBind: true,

        /**
         * The delay in milliseconds for a live update.
         * @type {Number}
         */
        liveBindDelay: 0,

        /**
         * Fires when the WebSocket connection is opened.
         * @type {componyx.library.Event}
         * @see {@link componyx.bindary.WebSocketEventArgs}
         */
        onWebSocketOpen: $lib.createEvent('onWebSocketOpen'),

        /**
         * Fires when the WebSocket connection is closed (server can close connection also).
         * @type {componyx.library.Event}
         * @see {@link componyx.bindary.WebSocketEventArgs}
         */
        onWebSocketClose: $lib.createEvent('onWebSocketClose'),

        /**
         * Fires before a data-bound input element is updated. Can be used for validation.
         * @type {componyx.library.Event}
         * @see {@link componyx.bindary.PreDataBindEventArgs}
         */
        onPreDataBind: $lib.createEvent('onPreDataBind'),

        /**
         * Fires after data binding is applied to an input element.
         * @type {componyx.library.Event}
         * @see {@link componyx.bindary.PostDataBindEventArgs}
         */
        onPostDataBind: $lib.createEvent('onPostDataBind'),

        /**
         * Fires when the returned data object contains an error (`isError: true`).
         * @type {componyx.library.Event}
         * @see {@link componyx.bindary.ErrorEventArgs}
         */
        onDataError: $lib.createEvent('onDataError'),

        /**
         * Fires when a route cannot be loaded: no route matches the route path, or the route's view or controller fails to load.
         * @type {componyx.library.Event}
         * @see {@link componyx.bindary.RouteErrorEventArgs}
         */
        onRouteError: $lib.createEvent('onRouteError'),

        /**
         * Fires before loading route data and sources.
         * @type {componyx.library.Event}
         * @see {@link componyx.bindary.PreLoadEventArgs}
         */
        onPreLoad: $lib.createEvent('onPreLoad'),

        /**
         * Fires when the view data is requested.
         * @type {componyx.library.Event}
         * @see {@link componyx.bindary.DataRequestEventArgs}
         */
        onDataRequest: $lib.createEvent('onDataRequest'),

        /**
         * Fires after route data and sources are loaded.
         * @type {componyx.library.Event}
         * @see {@link componyx.bindary.LoadEventArgs}
         */
        onLoad: $lib.createEvent('onLoad'),

        /**
         * Fires when new data is received, before the client data is updated.
         * @type {componyx.library.Event}
         * @see {@link componyx.bindary.PreDataUpdateEventArgs}
         */
        onPreDataUpdate: $lib.createEvent('onPreDataUpdate'),

        /**
         * Fires after the client data has been updated.
         * @type {componyx.library.Event}
         * @see {@link componyx.bindary.PostDataUpdateEventArgs}
         */
        onPostDataUpdate: $lib.createEvent('onPostDataUpdate'),

        /**
         * Fires before the view is rendered.
         * @type {componyx.library.Event}
         */
        onPreRender: $lib.createEvent('onPreRender'),

        /**
         * Fires after the view is rendered.
         * @type {componyx.library.Event}
         */
        onPostRender: $lib.createEvent('onPostRender'),

        /**
         * Fires after the route has fully loaded.
         * @type {componyx.library.Event}
         * @see {@link componyx.bindary.LoadEventArgs}
         */
        onPostLoad: $lib.createEvent('onPostLoad'),

        /**
         * Fires when the document tab becomes visible or hidden.
         * @type {componyx.library.Event}
         * @see {@link componyx.bindary.VisibilityChangeEventArgs}
         */
        onVisibilityChange: $lib.createEvent('onVisibilityChange'),

        /**
         * Fires when the document is scrolled to an anchor.
         * @type {componyx.library.Event}
         * @see {@link componyx.bindary.AnchorScrollEventArgs}
         */
        onAnchorScroll: $lib.createEvent('onAnchorScroll'),

        /**
         * Fires after the route is unloaded because a new route is requested.
         * @type {componyx.library.Event}
         * @see {@link componyx.bindary.UnloadEventArgs}
         */
        onUnload: $lib.createEvent('onUnload'),

        /**
         * The id prefix for bindary elements within the view.
         * @type {String}
         */
        idPrefix: 'bindary_',

        /**
         * The date format used to convert date(time) types for textual display. Defaults to MM/dd/yyyy hh:mm.
         * @type {String}
         */
        dateFormat: 'MM/dd/yyyy hh:mm',

        /**
         * The decimal separator used to convert numeric types for textual display. Defaults to '.'.
         * @type {String}
         */
        decimalSeparator: '.',

        /**
         * The decimal precision used to convert numeric types for textual display.
         * @type {String|null}
         */
        decimalPrecision: null,

        /**
         * A value which is sent with each data request to be able to uniquely identify clients on the server. Only required when the client-id is not stored in a server-side Session.
         * @type {String|null}
         */
        clientId: null,

        /**
         * Holds the current data request object.
         * @type {dataRequestType|null}
         */
        dataRequest: null,

        /**
         * Holds the current active route.
         * @type {componyx.bindary.Route|null}
         */
        route: null,

        /**
         * Holds the current active route index.
         * @type {String|null}
         */
        routeIndex: null,

        /**
         * Holds the current active route path and can be set as initial launch value.
         * @type {String}
         */
        routePath: '',

        /**
         * The root path of the application must be specified when "prettyURL" is enabled and the application URL contains a path after the URL origin (protocol//domain:port), so that Bindary can detect the route path within the URL.
         * The rootPath must start and end with a forward slash (/).
         * @type {String}
         */
        rootPath: '/',

        /**
         * The base title of the application.
         * @type {String}
         */
        baseTitle: '',

        /**
         * Holds the controller object for the active route.
         * @type {Object}
         */
        controller: {},

        /**
         * Holds the data object which is bound to the global application context.
         * @type {Object}
         */
        appData: {},

        /**
         * Holds the data object which is bound to the context of the active route.
         * @type {Object}
         */
        routeData: {},

        /**
         * Holds the data object which is bound to the context of the active view.
         * @type {Object}
         */
        viewData: {},

        /**
         * The list of mapped routes.
         * @type {Object[]}
         */
        routes: [],

        /**
         * A value indicating if Bindary data-bound elements (template-items) are being detected outside of the view container element.
         * Set to false if template elements are only defined inside of the view container for better performance.
         * @type {Boolean}
         */
        detectOutsideView: true,

        /**
         * A value indicating if the data change detection must be precise (false) or as fast as possible (true).
         * When changed, it will have direct effect on the next view update. With dirty checks enabled: detection of changes during the view update works by checking if the data-key for a registered change is equal or inside an item's context.
         * Items that don't match with a registered data change are skipped and possible child items are not processed. Therefore possible context switching (by root/parent navigators) inside a template item is not considered. Nor are the preRender event actions, which may decide if a template item is rendered.
         * @type {Boolean}
         */
        dirtyChecks: false,

        /**
         * A value indicating if the route path in the URL starts with a forward slash (pretty) instead of a hash(#) or hash-bang(#!).
         * e.g. /Category/Product instead of #Category/Product.
         * When enabled, server-side routing of the route-path to the application's entrance page is required to deal with initial page loads where a route path is part of the URL (direct link).
         * Bindary will detect the route path in the URL and launch with the relevant route.
         * @type {Boolean}
         */
        prettyURL: true,

        /**
         * A value indicating if relative hyperlinks are dispatched to (handled by) the Bindary routing.
         * @type {Boolean}
         */
        linkDispatching: true,

        /**
         * A value indicating if the view HTML is cleared when a route is unloaded.
         * @type {Boolean}
         */
        clearViewOnUnload: false,

        /**
         * A value indicating if the framework is connected with a data provider.
         * @type {Boolean}
         */
        connected: false,

        /**
         * A value indicating if data-bindary attributes on the element are retained.
         * When disabled, calling updateTemplateItem() will update the defined attributes and hold previously stored values; clearing can be accomplished by specifying 'null' as attribute value.
         * When enabled, calling updateTemplateItem() will clear undefined attributes.
         * @type {Boolean}
         */
        keepAttributes: false,

        /**
         * A value indicating if a fragment identifier (anchor tag) specified in the URL through a hashtag is automatically scrolled into view after loading the route.
         * Use a second hashtag in the URL (without a matching route) to jump to a bookmark when the first hashtag contains the route-path.
         * @type {Boolean}
         */
        anchorScroll: true,

        /**
         * A value indicating whether client-side caching of views, view-css, view-scripts, controllers and data is enabled.
         * @type {Boolean}
         */
        caching: true,

        /**
         * A value indicating whether internal script and css tags loaded with a specific view are being cached.
         * @type {Boolean}
         */
        cacheInternalTags: false,

        /**
         * A value indicating whether the routeData container is retained in cache when a route is unloaded.
         * Route data is keyed by route index, so it is shared by every URL matching the same route definition.
         * @type {Boolean}
         */
        cacheRouteData: true,

        /**
         * A value indicating whether the viewData container is retained in cache when a route is unloaded.
         * View data is keyed by route path, so each distinct URL holds its own.
         * @type {Boolean}
         */
        cacheViewData: false,

        /**
         * A value indicating if server data overwrites (false) or updates (true) data on the client.
         * @type {Boolean}
         */
        defaultUpdateRule: false,

        /**
         * A value indicating whether incoming data responses are compared for equality before updating to avoid redundant changes.
         * @type {Boolean}
         */
        equalityCheck: true,

        /**
         * A value indicating if the HTML element must be recreated when there is already an element for the relevant index/key.
         * @type {Boolean}
         */
        defaultRecreateRule: false,

        /**
         * A value indicating if changes are being observed for the default appData, routeData and viewData data-containers (ECMAScript 6 required).
         * @type {Boolean}
         */
        observing: true,

        /**
         * A value indicating if changes are being observed during the view rendering process.
         * @type {Boolean}
         */
        observeDuringRender: false,

        /**
         * A value indicating if the view is automatically updated when changes are being observed.
         * @type {Boolean}
         */
        autoUpdateView: true,

        /**
         * A value indicating if all data provided through data-bindary-html attributes are trusted.
         * Enable this option only if there are no (sanitized) user defined HTML data-sources (potential security risks).
         * To trust a specific attribute use data-bindary-html="trust:dataKey".
         * @type {Boolean}
         */
        trustHTML: false,

        /**
         * A value indicating that the page is reloaded when the WebSocket is closed by the server due to an internal server error.
         * @type {Boolean}
         */
        reloadPageOnWebSocketServerError: true,

        /**
         * A value indicating that the route is reloaded when the page is restored from the back/forward cache (bfcache) after navigating back to the page.
         * @type {Boolean}
         */
        reloadRouteOnPageRestore: true,

        /**
         * The element that triggered a data-bind.
         * Used to prevent updating the field value while typing. Cleared after a view update or can be manually cleared to force the element’s value to update on the next view refresh.
         * @type {HTMLElement|null}
         */
        dataBindTrigger: null,

        /**
         * Gets or sets a custom sanitizer function. Overrides built-in sanitizer.
         * @type {Function|null}
         */
        sanitizer: null,

        get onDataBind()
        {
            console.warn("'onDataBind' is deprecated, mapped to 'onPreDataBind'.");
            return $bindary.onPreDataBind;
        },

        /**
         * A value indicating whether to use shorthand ('m-') or default ('data-bindary-') prefixes for attributes.
         * @type {boolean}
         */
        get useShorthand()
        {
            return core.useShorthand;
        },

        set useShorthand(value)
        {
            core.useShorthand = value;
            core.initializePrefix(value === true ? core.shortPrefix : core.longPrefix);
        },

        /**
         * A value indicating if attribute names use the hyphenated form (e.g. view-formatter) instead of the fused form (e.g. viewFormatter). This setting exists for backwards compatibility.
         * @type {boolean}
         */
        get hyphenatedAttributes()
        {
            return core.hyphenatedAttributes;
        },

        set hyphenatedAttributes(value)
        {
            core.initializePrefix(core.prefix, value);
        },


        /**
        * Gets the custom prefix.
        * @type {String}
        */
        get attributePrefix()
        {
            return core.prefix;
        },

        /**
        * Sets and uses a custom prefix to use for the 'data-bindary-' attributes.
        * @param {String} [prefix] The custom attribute prefix to use.
        */
        setCustomPrefix: function (prefix)
        {
            core.initializePrefix(prefix);
        },

        /** 
        * Launches the route for the initial route path value.
        * 
        */
        launch: function ()
        {
            launch();
        },
        /**
         * Adds a route with the specified route settings.
         *
         * @param {componyx.bindary.Route} route
         * @returns {number} The array index of the added route within the $bindary.routes array.
         */
        addRoute: function (route)
        {
            route.pathExp = (route.path instanceof RegExp);
            $bindary.routes.push(route);
            return $bindary.routes.length - 1;
        },

        /** 
        * Loads the route based on the current URL or based on the specified route path. Method is only applicable when $bindary.prettyURL is enabled.
        * @param {String} [routePath] The route path to load.
        * @returns {Number} The route index.
        */
        loadRoute: function (routePath)
        {
            if ($lib.isEmpty(routePath))
                routePath = core.getRoutePath();
            else if ($bindary.prettyURL)
            {
                let url = core.getFullPath(routePath);

                routePath = core.removeAnchor(routePath);

                if ($bindary.routePath != routePath)
                    window.history.pushState({ routePath: routePath }, '', url);
            }

            return router.load(routePath);
        },


        /** 
        * Dispatches anchor links so that they are handled by the framework's routing. Method is only applicable when "pretty URL" is enabled.
        * @param {HTMLElement} [container] The container element in which hyperlinks will be updated.
        */
        dispatchLinks: function (container)
        {
            core.dispatchLinks(container);
        },

        /** 
        * Dispatch an anchor link so that it is handled by the framework's routing. Method is only applicable when "pretty URL" is enabled.
        * @param {HTMLElement} anchor The anchor link tag.
        */
        dispatchLink: function (anchor)
        {
            core.dispatchLink(anchor);
        },

        /** 
        * Adds a component.
        * @param {String} name The name of the component.
        * @param {Function} initiator A method which initializes and returns a new instance of the component.
        */
        addComponent: function (name, initiator)
        {
            core.components[name] = initiator;
        },

        /** 
        * Observes the specified object for changes (ECMAScript 6 required). This method is intended to observe objects on the global (window) scope. Observing of the appData, routeData and viewData containers can be enabled through $bindary.observing.
        * @example window.myContainer = $bindary.observe({}, 'myContainer');
        * @param {Object} obj The object to observe.
        * @param {String} dataContainer The name of the root data-container on which the proxy object is defined.
        * @param {Object} settings An object with configuration settings for observing the object.
        * @param {CustomEvent} settings.event The custom event to dispatch when a property is changed. This can be used in combination with Native WebComponents to update your custom HTML component when an object property changes. Return false from this event to cancel data-change and view update.
        * @param {function(): CustomEvent} [settings.createEvent] - A factory function that returns a new CustomEvent for each change. Recommended when changes are batched, deferred, or when change isolation is required.
        * @param {Object} settings.eventPayload The additional data included in the event.detail, providing context for the data change. 
        * @param {HTMLElement} settings.element The element on which the custom event is fired. By default, the event is fired on the document object.
        * @param {TemplateItem[]} settings.viewTree The root tree to use when updating the view after a data change.
        * @param {Boolean} [settings.reuseProxy=true] A value indicating whether a single proxy instance is shared across multiple data paths. When disabled, each path gets its own independent proxy, losing cross-path change propagation
        * @returns {Object} A proxy object for template-binding on which modifications are immediately noticed and result in an update of the view.
        */
        observe: function (obj, dataContainer, settings)
        {
            if (settings && settings.viewTree)
            {
                settings.treeState = [];
                $lib.each(settings.viewTree, (item, index) => { settings.treeState[index] = item.captureTreeState(); })
            }

            return proxyManager.createProxy(obj, dataContainer, settings);
        },

        /**
         * @typedef {Object} ProxyManager
         * @memberof componyx.bindary
         * @property {function(Object): boolean} isProxy - Returns true if the object is a proxy.
         * @property {function(Object): Object|null} getTarget - Gets the underlying target of the given proxy.
         */

        /**
         * Gets the proxy manager used to create observable objects.
         * @returns {ProxyManager} The proxy manager object.
         */
        getProxyManager: function ()
        {
            return proxyManager;
        },

        /**
        * Stops observing for data-changes on observed objects until startObserving() is called.
        */
        stopObserving: function ()
        {
            core.observing = false;
        },

        /**
        * Restarts observing for data-changes on observed objects.
        */
        startObserving: function ()
        {
            core.observing = true;
        },

        /**
         * A function that determines if the handler applies to a specific template item or element.
         * @memberof componyx.bindary
         * @callback ValueMatcher
         * @param {componyx.bindary.TemplateItem} item The template item containing the element.
         * @returns {boolean} True if the handler should handle this, otherwise false.
         */

        /**
         * A function that retrieves the value from an element.
         * @callback ValueGetter
         * @memberof componyx.bindary
         * @param {HTMLElement} element The target element from which the value should be retrieved.
         * @returns {string} The extracted value from the element.
         */

        /**
         * A function that sets the value on an element.
         * @callback ValueSetter
         * @memberof componyx.bindary
         * @param {HTMLElement} element The target element on which the value should be set.
         * @param {string} value The value to set on the element.
         */

        /**
         * Registers a value handler for data-bound elements.
         * @param {ValueMatcher} matcher A function that checks if the handler applies for the specified template item.
         * @param {ValueGetter} getValue A function that retrieves the value from the element.
         * @param {ValueSetter} setValue A function that sets the value on the element.
         * @returns {String} The id of the registered handler (needed in case of removal).
         */
        registerValueHandler: function (matcher, getValue, setValue)
        {
            const id = $lib.guid();
            core.valueHandlers.push({ id, matcher, getValue, setValue });
            return id;
        },

        /** 
         * Unregisters a value handler.
         * @param {String} id The id of the handler to remove.
         */
        unregisterValueHandler: function (id)
        {
            const index = core.valueHandlers.findIndex(h => h.id === id);
            if (index !== -1)
            {
                core.valueHandlers.splice(index, 1);
            }
        },

        /** 
        * Places a lock (on the specified dataKey and/or dataContainer) to postpone data updates until unlock is called. 
        * Ommit parameters to lock complete data-tree or specify dataContainer only to lock container.
        * 
        * @param {String} dataKey The hierarchical path of the object or object value. This string value should consist of object keys separated by a '.' (dot) character (default, change via dataKeySeparatorChar) and without the data container name.
        * @param {String} [dataContainer] One of the following data containers: appData, routeData or viewData. Defaults to viewData when dataKey is specified.
        */
        lock: function (dataKey, dataContainer)
        {
            // keep cached data updates on lock for duplicate dataKey
            if (!dataKey && !dataContainer)
                core.dataLocks['#'] = core.dataLocks['#'] || []; // # for full lock
            else
            {
                let key = $lib.format('{0}{1}', dataContainer || core.dataLabel[2], (dataKey) ? core.dksc + dataKey : '');
                core.dataLocks[key] = core.dataLocks[key] || [];
            }
        },

        /** 
        * Removes the lock (on the specified dataKey and/or dataContainer) to re-enable data updates.
        * Ommit parameters to unlock complete data-tree or specify dataContainer only to unlock container.
        * 
        * @param {String} dataKey The hierarchical path of the object or object value. This string value should consist of object keys separated by a '.' (dot) character (default, change via dataKeySeparatorChar) and without the data container name.
        * @param {String} [dataContainer] One of the following data containers: appData, routeData or viewData. Defaults to viewData when dataKey is specified.
        * @param {Boolean} [ignore] A value indicating that previous received data must be ignored.
        * @param {Boolean} [update] The view is updated automatically after the unlock. This default update behaviour can be cancelled by specifying false for this argument.
        */
        unlock: function (dataKey, dataContainer, ignore, update)
        {
            let key;

            if (!dataKey && !dataContainer)
                key = '#';
            else
                key = $lib.format('{0}{1}', dataContainer || core.dataLabel[2], (dataKey) ? core.dksc + dataKey : '');

            if (!ignore)
            {
                core.autoUpdateView = false;
                $lib.each(core.dataLocks[key], function (fn)
                {
                    fn(); // call stored data-update functions
                });
                core.autoUpdateView = true;

                core.fireEvent('postDataUpdate');
            }

            delete core.dataLocks[key];

            if (!ignore && update != false)
                updateView();
        },

        /** 
        * Updates data-model values for data-bound elements.
        * @param {HTMLElement[]} elements A collection of data-bound elements for which the data-model values must be updated.
        */
        dataBind: function (elements)
        {
            $lib.each(elements, function (el)
            {
                let item = getTemplateItem(el);

                if (item)
                    item.dataBind();
            });
        },

        /** 
        * Registers a data change for the specified model (object reference) so that the next view update will display the new data.
        * 
        * @param {Object} model The model of the corresponding data-bound element.
        * @param {Object[]} arrayUpdateRules An array of updateRule objects for the array corresponding with the data-bound repeat element.
        * @param {Number[]} arrayUpdateRules.keys Indexes or keys within the collection where items where updated.
        * @param {Boolean} arrayUpdateRules.recreate A value indicating if the HTML element must be recreated when there is already an element for the relevant index/key.
        * @param {Number} arrayUpdateRules.addIndex Position within the array where the items where added. Do not specify the index (Null/Undefined) when items where added at the end of the array.
        * @param {Number} arrayUpdateRules.addCount Number of items that where added to the array.
        * @param {Number} arrayUpdateRules.removeIndex Position within the array where the items where removed. Do not specify the index (Null/Undefined) when items where removed at the end of the array.
        * @param {Number} arrayUpdateRules.removeCount Number of items that where removed from the array.
        * @param {Boolean} [update] The view is updated automatically after a data change. This default update behaviour can be cancelled by specifying false for this argument.
        */
        dataChangeForModel: function (model, arrayUpdateRules, update)
        {
            core.modelDataChanges.set(model, dataUpdater.initUpdateRules(core.modelDataChanges.get(model), arrayUpdateRules));

            if (update != false)
                updateView();
        },

        /** 
        * Registers a data change for the element with the specified updateId so that the next view update will display the new data.
        * 
        * @param {String} updateId The update id of the corresponding data-bound element.
        * @param {Object[]} arrayUpdateRules An array of updateRule objects for the array corresponding with the data-bound repeat element.
        * @param {Number[]} arrayUpdateRules.keys Indexes or keys within the collection where items where updated.
        * @param {Boolean} arrayUpdateRules.recreate A value indicating if the HTML element must be recreated when there is already an element for the relevant index/key.
        * @param {Number} arrayUpdateRules.addIndex Position within the array where the items where added. Do not specify the index (Null/Undefined) when items where added at the end of the array.
        * @param {Number} arrayUpdateRules.addCount Number of items that where added to the array.
        * @param {Number} arrayUpdateRules.removeIndex Position within the array where the items where removed. Do not specify the index (Null/Undefined) when items where removed at the end of the array.
        * @param {Number} arrayUpdateRules.removeCount Number of items that where removed from the array.
        * @param {Boolean} [update] The view is updated automatically after a data change. This default update behaviour can be cancelled by specifying false for this argument.
        */
        dataChangeForId: function (updateId, arrayUpdateRules, update)
        {
            core.dataChanges['#' + updateId] = dataUpdater.initUpdateRules(arrayUpdateRules, core.dataChanges['#' + updateId]);

            if (update != false)
                updateView();
        },

        /** 
        * Registers a data change for the specified dataKey so that the next view update will display the new data.
        * 
        * @param {String} dataKey The hierarchical path of the changed object or object value. This string value should consist of object keys separated by a '.' (dot) character (default, change via dataKeySeparatorChar) and without the data container name.
        * @param {String|Number} [dataContainer] One of the root data-containers to which the data-key belongs: appData(0), routeData(1) or viewData(2).
        * @param {Object[]} arrayUpdateRules An array of updateRule objects for the array corresponding with the data-bound repeat element.
        * @param {Number[]} arrayUpdateRules.keys Indexes or keys within the collection where items where updated.
        * @param {Boolean} arrayUpdateRules.recreate A value indicating if the HTML element must be recreated when there is already an element for the relevant index/key.
        * @param {Number} arrayUpdateRules.addIndex Position within the array where the items where added. Do not specify the index (Null/Undefined) when items where added at the end of the array.
        * @param {Number} arrayUpdateRules.addCount Number of items that where added to the array.
        * @param {Number} arrayUpdateRules.removeIndex Position within the array where the items where removed. Do not specify the index (Null/Undefined) when items where removed at the end of the array.
        * @param {Number} arrayUpdateRules.removeCount Number of items that where removed from the array.
        * @param {Boolean} [update] The view is updated automatically after a data change. This default update behaviour can be cancelled by specifying false for this argument.
        */
        dataChange: function (dataKey, dataContainer, arrayUpdateRules, update)
        {
            dataKey = $lib.isEmpty(dataContainer) ? dataKey : $lib.format('{0}.{1}', (typeof dataContainer === 'number') ? core.dataLabel[dataContainer] : dataContainer, dataKey);
            core.dataChanges[dataKey] = dataUpdater.initUpdateRules(arrayUpdateRules, core.dataChanges[dataKey]);

            if (update != false)
                updateView();
        },

        /**
        * Clears all registered data changes and cancels the delayed view update.
        */
        clearDataChanges: function ()
        {
            core.updatePending = false;
            core.pendingComplete = false;

            if (!core.busy)
                core.dataChanges = {};
        },

        /**
        * Sends the specified data to the server through the connected websocket or new xhr connection and returns an awaitable Promise that resolves when the response is received.
        * 
        * @param {Object} data The JSON data request.
        * @param {String} [serverMethod] A class type and static method (dot separated) to call on the server when executing the data request. Requires the .NET server-side Bindary framework.
        * @param {String} [clientId] A value which is send with each data request to be able to uniquely identify clients on the server side.
        * @param {Boolean} [updateView] A value indicating if the view is updated after the data response. Defaults to true.
        * @returns {Promise<Object>} Resolves with the server response message.
        */
        dataSendAsync: function (data, serverMethod, clientId, updateView)
        {
            return new Promise(resolve =>
            {
                this.dataSend(data, serverMethod, clientId, resolve, updateView);
            });
        },

        /** 
        * Sends the specified data to the server through the connected websocket or new xhr connection.
        * 
        * @param {Object} data The JSON data request.
        * @param {String} [serverMethod] A class type and static method (dot separated) to call on the server when executing the data request. Requires the .NET server-side Bindary framework.
        * @param {String} [clientId] A value which is send with each data request to be able to uniquely identify clients on the server side.
        * @param {Function} [onDataResponse] An event callback method which is invoked on the response for this request. Method parameters: data (Object).
        * @param {Boolean} [updateView] A value indicating if the view is updated after the data response. Defaults to true.
        * @returns {WebSocket|XMLHttpRequest} The WebSocket or XHR object used to transfer the data.
        */
        dataSend: function (data, serverMethod, clientId, onDataResponse, updateView)
        {
            let callbackId = $lib.guid(),
                onResponse = function (onDataResponse, updateView, dataMsg)
                {
                    if (updateView)
                    {
                        core.updatePending = false;
                        core.pendingComplete = false;
                    }

                    if (onDataResponse)
                        onDataResponse(dataMsg);

                    return updateView;
                }.bind(window, onDataResponse, updateView);

            if (!$lib.isEmpty(clientId))
                $bindary.clientId = clientId;

            core.callbacks[callbackId] = onResponse;

            return connection.dataSend(connection.createDataRequestMsg(data, serverMethod, callbackId), true);
        },

        /*
        * Sends the specified data to the server while attempting to keep the browser responsive to user-input.
        * Use this method to send data only when the window is being unloaded. Check the 3rd argument (boolean) in the controller's unload method to see if the call came from a window-before-unload event.
        * When Websockets are disabled or unsupported an attempt is made to send the data through navigator.sendBeacon, to keep the browser responsive to user-input.
        * However, if sendBeacon is unsupported a fallback to a synchronous XHR call is made.
        *
        * @param {Object} data The JSON data request. The navigator.sendBeacon method has browser-specific data size limitations.
        * @param {String} [serverMethod] A class type and static method (dot separated) to call on the server when executing the data request. Requires the .NET server-side Bindary framework.
        * @param {String} [clientId] A value which is send with each data request to be able to uniquely identify clients on the server side.
        * @returns {Boolean} A value is only returned when the data is sent through navigator.sendBeacon. This value indicates if the data was Successfully sent or if a data limit was reached.</returns>
        */
        unload: function (data, serverMethod, clientId)
        {
            if (clientId != undefined)
                $bindary.clientId = clientId;

            let result;
            data = connection.createDataRequestMsg(data, serverMethod);

            if (core.useWS())
                connection.dataSend(data);
            else
            {
                if (navigator.sendBeacon)
                    result = navigator.sendBeacon(connection.getDataServerURL($bindary.dataServerURL), data);
                else
                    $lib.xhr({ url: connection.getDataServerURL($bindary.dataServerURL), data: data, async: false });

                return result;
            }
        },

        /** 
        * Creates or updates a data-bound template item. The item will be rendered on the next view update.
        * 
        * @param {HTMLElement} element An HTML element having attributes to serve as data-bound template item.
        * @param {Boolean} [deep=false] A value indicating if child elements should be updated.
        * @param {Boolean} [clear=false] A value indicating if child items must be cleared.
        */
        updateTemplateItem: function (element, deep, clear)
        {
            return updateTemplateItem(element, deep, clear);
        },

        /**
        * Removes a data-bound template item.
        * 
        * @param {HTMLElement} element The original element.
        */
        removeTemplateItem: function (element)
        {
            const item = getTemplateItem(element);

            if (!item)
                return;

            // Step 1: remove all descendants from templateList and clear children arrays
            removeTemplateItemTree(item);

            // Step 2: remove the item itself from templateList
            let index = $lib.indexOf(core.templateList, i => i.id === item.id);
            if (index > -1)
                core.templateList.splice(index, 1);

            // Step 3: detach from parent or viewTree
            if (item.parent)
            {
                const parentChildren = item.parent.children;
                index = parentChildren.findIndex(c => c.id === item.id);
                if (index > -1)
                    parentChildren.splice(index, 1);
            }
            else
            {
                index = core.viewTree.findIndex(c => c.id === item.id);
                if (index > -1)
                    core.viewTree.splice(index, 1);
            }

            item.children = [];
        },

        /** 
        * (Re)Renders the view with the active data objects.
        * 
        * @param {Boolean} complete A value indicating if the view must be refreshed completely instead of checking for registered data changes.
        * @param {Boolean} redetectTemplateElements A value indicating if the template elements should be redetected. Make sure keep attributes is set to true, either globally or on the elements, otherwise these elements are not redetected.
        * @param {TemplateItem[]} [viewTree] The root template items for the view tree, from which the update will propagate.
        */
        updateView: function (complete, redetectTemplateElements, viewTree)
        {
            if (redetectTemplateElements)
                createViewTree();

            updateView(complete, viewTree, true);
        },

        /** 
        * (Re)Renders the view with the active data objects. The delayed update call is placed at the end of the execution queue through setTimeout()
        * 
        * @param {Boolean} complete A value indicating if the view must be refreshed completely instead of checking for registered data changes.
        * @param {Boolean} [redetectTemplateElements] A value indicating if the template elements should be redetected.
        * @param {TemplateItem[]} [viewTree] The root template items for the view tree, from which the update will propagate.
        */
        updateViewDelayed: function (complete, redetectTemplateElements, viewTree)
        {
            if (redetectTemplateElements)
                createViewTree();

            updateViewDelayed(complete, viewTree);
        },

        /**
        * Creates the view tree with data-bound template items.
        * 
        * @param {HTMLElement} [rootEl] The root HTML Element.
        * @param {componyx.bindary.TemplateItem} [rootItem] The root Template Item.
        */
        createViewTree: function (rootEl, rootItem)
        {
            createViewTree(rootEl, rootItem);
        },

        /**
        * Renders the view tree using data-bound template items.
        * **Important:** This method should only be called during an active render cycle, otherwise use `updateViewDelayed()` or `updateView()` instead.
        * Note that unlike `updateView()`, this method does **not** trigger `preRender` or `postRender` events.
        * @param {Boolean} update A value indicating if this is an update.
        * @param {TemplateItem[]} viewTree The view tree to create.
        */
        renderView: function (update, viewTree)
        {
            renderView(update, viewTree);
        },

        /** 
        * Disconnects the data connection.
        */
        disconnect: function ()
        {
            connection.disconnect();
        },

        /**
        * Gets the template item that belongs to the specified element.
        * @param {HTMLElement} The element for wich to retrieve the template item.
        * @returns {componyx.bindary.TemplateItem} The template item.
        */
        getTemplateItem: function (element)
        {
            return getTemplateItem(element);
        },

        /** 
        * Gets the view container element.
        * @returns {HTMLElement} The view container element.
        */
        getViewContainer: function ()
        {
            return core.viewContainer;
        },

        /** 
        * Gets the page anchor.
        * @returns {String} The page anchor.
        */
        getAnchor: function ()
        {
            return core.getAnchor();
        },

        /** 
        * Gets the base href which precedes all route paths when prettyURL is enabled.
        * @returns {String} The base href.
        */
        getBaseHref: function ()
        {
            return core.getBaseHref();
        },

        /** 
        * Gets the internal cache object which holds views, includes, controllers, source-ready states and the routeData/viewData containers per route.
        * The object is returned by reference, so modifications affect the framework directly.
        * @returns {Object} The cache object.
        */
        getCache: function ()
        {
            return core.cache;
        },

        /** 
        * Clears the internal cache object in where views, includes, controllers and data are stored. Loaded script and CSS tags from a view or includable file will also be removed from the page when clearing the cache (unless indicated otherwise through the parameters).
        * @param {Boolean} [keepControllers] A value indicating if loaded controller script tags must remain on the page.
        * @param {Boolean} [keepExternalScripts] A value indicating if external script tags from a view or includable file must remain on the page.
        * @param {Boolean} [keepExternalCss] A value indicating if external css tags from a view or includable file must remain on the page.
        * @param {Boolean} [keepInternalScripts] A value indicating if internal (also called inline) script tags from a view or includable file must remain on the page.
        * @param {Boolean} [keepInternalCss] A value indicating if internal (also called inline) css tags from a view or includable file must remain on the page.
        */
        clearCache: function (keepControllers, keepExternalScripts, keepExternalCSS, keepInternalScripts, keepInternalCss)
        {
            core.clearCache(keepControllers, keepExternalScripts, keepExternalCSS, keepInternalScripts, keepInternalCss);
        }
    }

    window.$bindary = componyx.bindary;

    /** 
    * @property {Boolean} [busy] A value indicating if the framework is busy loading a route or rendering the view.
    * @readonly
    * @memberof componyx.bindary
    */
    Object.defineProperty(window.$bindary, 'busy',
        {
            get: function () { return core.busy; }
        });

    /** 
    * @property {String} [dataKeySeparatorChar] The character(s) used as data-key separator. Defaults to '.' (dot). Only change if a dot is used in object keys.
    * @memberof componyx.bindary
    */
    Object.defineProperty(window.$bindary, 'dataKeySeparatorChar',
        {
            get: function () { return core.dksc; },
            set: function (value)
            {
                core.dksc = value;
            }
        });

    /** 
    * @property {String} [indexPointerChar] The character(s) used to indicate an index pointer within a data-key. Defaults to '@' (at sign). Only change if an at sign is used in object keys.
    * @memberof componyx.bindary
    */
    Object.defineProperty(window.$bindary, 'indexPointerChar',
        {
            get: function () { return core.ipc; },
            set: function (value)
            {
                core.ipc = value;
            }
        });

    function launch()
    {
        let routePath = core.getRoutePath();

        core.allowHistoryScroll = !$bindary.prettyURL;
        core.secure = core.getLocationOrigin().match(/^https:\/\//) != null;

        if (!$bindary.prettyURL)
        {
            if (!$lib.has(window, 'hashchange', hashChange))
                $lib.on(window, 'hashchange', hashChange);

            // because there is no way to distinguish between a hash change through a link or through a history action, we listen for document clicks to disallow history scrolling
            if (!$lib.has(document, 'click', docClick))
                $lib.on(document, 'click', docClick);
        }

        if ($bindary.observing)
        {
            $bindary.appData = $bindary.observe($bindary.appData, core.dataLabel[0]);
            $bindary.routeData = $bindary.observe($bindary.routeData, core.dataLabel[1]);
            $bindary.viewData = $bindary.observe($bindary.viewData, core.dataLabel[2]);
        }

        createBaseHref();

        if ($bindary.linkDispatching)
            core.dispatchLinks();

        core.launchRoutePath = $bindary.routePath;

        if ($lib.isEmpty(routePath) && !$lib.isEmpty($bindary.routePath))
            routePath = core.removeAnchor(($bindary.prettyURL) ? $bindary.routePath : $bindary.routePath.replace(/^[\/#!]+/, ''));

        $bindary.routePath = null; // route-path is compared and set in router.load()

        let state = $lib.clone({}, getHistoryState());

        state.routePath = routePath;
        window.history.replaceState(state, '', window.location.href); // store the initial routePath in the current state

        if (router.load(routePath) == -1)
            updateView(true);
    }

    function createBaseHref()
    {
        let head = $lib(null, document, 'head', true),
            base = $lib(null, head, 'base', true);

        if (base)
            return;

        $lib.element(head, null, 'base', null, { href: '/' });
    }

    function getHistoryState()
    {
        try
        {
            return window.history.state;
        }
        catch (ex)
        {
            $lib.log(ex.message);
            return null;
        }
    }

    function scroll(e)
    {
        clearTimeout(core.scrollTimerId);
        core.scrollTimerId = setTimeout(saveScrollPosition, 100);
    }

    function saveScrollPosition()
    {
        let path = $bindary.routePath;

        if ($lib.isEmpty(path))
            return;

        let win = $lib.getWindowSize(),
            x = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
            y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

        core.scrollPos[path] =
        {
            path: path,
            x: x,
            y: y,
            width: win.width + x,
            height: win.height + y
        }

        window.sessionStorage.setItem('scrollPosition', window.JSON.stringify(core.scrollPos[path])); // store last scroll position in session storage
    }

    function docClick()
    {
        core.allowHistoryScroll = false;
        clearTimeout(core.historyTimerId);
        core.historyTimerId = setTimeout(function () { core.allowHistoryScroll = true; }, 0);
    }

    function hashChange(e)
    {
        let routePath = core.getHashtag();

        if (core.isBookmarkJump(routePath))
            scroller.init(true);
        else
        {
            if ($lib.isEmpty(routePath))
                routePath = core.launchRoutePath;

            router.load(routePath);
        }
    }

    function popState(e)
    {
        let routePath = (e && e.state && !$lib.isEmpty(e.state.routePath)) ? e.state.routePath : null,
            anchor = core.getAnchor();

        if (!$bindary.prettyURL && !routePath) // only history actions and not hash changes if prettyURL is disabled
            return;

        core.allowHistoryScroll = true;

        if (!routePath)
            routePath = core.getRoutePath();

        if (!$lib.isEmpty(anchor) && core.isBookmarkJump(routePath + '#' + anchor))
            return;

        router.load(routePath);
    }

    function visibilityChange()
    {
        if (core.fireEvent('onVisibilityChange') !== false)
        {
            if (document.visibilityState === "visible" && core.useWS() && $bindary.connected)
                connection.dataSend(connection.createDataRequestMsg(null, "", null, false, true)); // update client websocket object
        }
    }

    function updateViewDelayed(complete, viewTree)
    {
        if (!viewTree)
        {
            core.pendingFullRender = core.pendingFullRender || complete; // escalate: a full-rebuild request anywhere in this batch always wins

            if (core.pendingUpdate)
                return; // already queued for this tick; the eventual flush will see the escalated value above

            core.pendingUpdate = true;

            queueMicrotask(function ()
            {
                if (!core.pendingUpdate) // flushed early elsewhere (e.g. a direct updateView call) - nothing left to do
                    return;

                updateView(core.clearPendingUpdate());
            });

            return;
        }

        if (core.pendingUpdate) // a full update is already queued; it supersedes any per-item batching
            return;

        // partial (scoped) update: accumulate items across calls in this tick into one batch
        const itemsToUpdate = viewTree.filter(item => !core.pendingTreeItems.has(item));

        if (itemsToUpdate.length === 0) // all already included in the pending batch
            return;

        itemsToUpdate.forEach(item => core.pendingTreeItems.add(item));
        core.pendingTreeBatch = core.pendingTreeBatch.concat(itemsToUpdate);
        core.pendingPartialFullRender = core.pendingPartialFullRender || complete;

        if (core.pendingPartialUpdate)
            return;

        core.pendingPartialUpdate = true;

        queueMicrotask(function ()
        {
            if (!core.pendingPartialUpdate)
                return;

            const { batch, complete } = core.clearPendingPartialUpdate();

            updateView(complete, batch, true);
        });
    }

    function updateView(complete, viewTree, isRoot)
    {
        const triggerElement = $bindary.dataBindTrigger;

        $bindary.dataBindTrigger = null;

        if (!viewTree) // clear global timer id
            core.clearPendingUpdate();

        if (!core.viewTree && !viewTree)
        {
            complete = true;
            createView();
        }

        if (!complete && (!core.templateUpdate && $lib.isEmpty(core.dataChanges) && core.modelDataChanges.size == 0))
        {
            core.postRender();
            return; // nothing to update
        }

        core.templateUpdate = false;
        core.preRender(triggerElement);
        renderView(!complete, viewTree, isRoot);
    }

    function createView()
    {
        if (core.viewURL)
            core.getViewContainer().innerHTML = core.cache.view[core.viewURL].html; // copy html

        createViewTree();
    }

    function renderView(update, tree, isRoot)
    {
        let root = isRoot || !tree,
            parentContext,
            setIdAttr = function (element, item)
            {
                if (element && (item.inRepeat || item.included))
                {
                    element.removeAttribute('id'); // remove id for element within repeat container or includable to avoid doubles
                    element.setAttribute(core.attr.id, item.id); // keep id as bindary attribute
                }
            };

        if (root)
            core.renderPass++;

        if (!tree)
            parentContext = window;

        tree = tree || core.viewTree || [];

        $lib.each(tree, function (item, index, tree, args, next)
        {
            let element, repeatValue,
                parent = item.parent;

            item.livePath = {};
            item.dataChange = null;
            element = null;

            if (item.updateIdFromParent)
                item.updateIdFromParent = item.updateId = null;

            if (parent)
            {
                parentContext = parent.context;

                if (parent.isComponent)
                    item.isComponent = true;
            }

            if (!item.included && parent)
                item.included = parent.included;

            item.inRepeat = false;

            if (parent && (parent.inRepeat || parent.repeatDataKeyPath))
            {
                item.key = parent.key;
                item.inRepeat = true;

                if (item.repeatDataKey) // repeat within repeat
                    item = item.getClone();
            }

            element = getElement(item);

            if (item.includable && !item.included)
            {
                $lib.remove(element); // do not display includable elements until they are included
                return next();
            }

            if (!item.component)
                item.context = parentContext;
            else if (item.loaded && item.inRepeat && !item.observeDataKeyPath)
            {
                item.context = null;
                item.element = element;
                item.context = core.components[item.component](item); // stale context across repeated instances without b-observe: re-derive rather than trust the cached value
            }

            if (item.includable) // the key-path for includables is known when the includable element is included in the tree
                item.updateKeyPaths();

            if (skipItem(element, item, tree[index - 1]))
                return next();

            if (!element) // element not available
                return next();

            if (!item.component && !item.repeatDataKey)
                item.defineContext(item.context);

            item.resolveLivePaths(false);

            if (update) // check data changes when updating
            {
                item.getDataChange();

                if (item.dataChange == null && item.isRendered)
                {
                    if ((!$bindary.dirtyChecks || checkRecursive(item)) && (!item.repeatDataKey && item.children && item.children.length))
                    {
                        item.element = element;
                        renderView(update, item.children); // check recursive for data changes

                        if (item.component && item.context?.postRender)
                            item.context.postRender(item); // always fire postrender for components if rendered, even when there are no data changes, because the component might need to update itself after its children have been updated.
                    }

                    return next();
                }
            }

            if (!item.repeatDataKey && element && element._bindaryPlaceholder) // replace place-holder for original element
            {
                let clone = item.sourceElement.cloneNode(true);
                element.parentElement.replaceChild(clone, element);
                item.element = element = clone;
                setIdAttr(element, item);
            }
            else if (!item.repeatDataKey && element)
                setIdAttr(element, item);

            let itemRenderer = new Renderer(item, element, update, next);

            if (item.repeatDataKey) // repeat element
            {
                item.repeatValue = repeatValue = item.getDataValue(item.repeatDataKey, parentContext); // define repeat value

                let emptyRepeater = $lib.isEmpty(item.repeatElements);
                let repeatExists = !emptyRepeater && $lib.contains((parent) ? parent.element : document, item.repeatElements[0]);

                if (repeatExists && dataChangeIsUpdate(item.dataChange)) // update
                {
                    $lib.each(item.dataChange, function (dataChange, index, arr, args, next)
                    {
                        let added = 0,
                            reps = item.repeatElements,
                            isArray = $lib.isArray(repeatValue),
                            repContainer = (function () { for (let x in reps) { return reps[x].parentNode; } })(reps);

                        if (dataChange.removeCount > 0 && isArray)
                            removeRepeatElements(item, dataChange);


                        $lib.each(dataChange.keys || [], function (key, index, arr, args, next)
                        {
                            key = key.toString();

                            if ($lib.isEmpty(repeatValue?.[key]))
                            {
                                if (reps[key])
                                {
                                    $lib.remove(reps[key]);
                                    delete reps[key];
                                }

                                next();
                            }
                            else
                            {
                                if (!reps[key])
                                    item.initRepeater(null, repContainer);

                                itemRenderer.next = next;
                                itemRenderer.dataChange = dataChange;
                                itemRenderer.render(repeatValue[key], key);
                            }
                        }, null, null, true, function () // last method
                        {
                            if (dataChange.addCount > 0 && isArray)
                            {
                                let startIndex = ($lib.isEmpty(dataChange.addIndex)) ? repeatValue.length - dataChange.addCount : dataChange.addIndex;
                                item.initRepeater(null, repContainer, reps[startIndex.toString()]);

                                // add elements at correct position
                                $lib.each(repeatValue, function (item, key, arr, args, next)
                                {
                                    itemRenderer.next = next;
                                    itemRenderer.render(item, key);
                                    return (++added != dataChange.addCount);
                                }, null, startIndex, true, next);
                            }
                            else
                                next();
                        });

                    }, null, null, true, next);
                }
                else // recreate
                {
                    if (item.filter)
                        repeatValue = core.call(item.filter, [item, repeatValue]); // filter collection before repeat (not possbile with update)

                    item.dataChange = [];
                    item.initRepeater(element, element.parentNode, element.nextElementSibling, true);

                    // recreate elements
                    $lib.each(repeatValue || [], function (item, key, arr, args, next)
                    {
                        itemRenderer.next = next;
                        itemRenderer.render(item, key);
                    }, null, null, true, next);
                }
            }
            else
            {
                item.dataChange = [];
                itemRenderer.render();
            }

        }, null, null, true, (root) ? core.postRender : null); // each loop with manual fetching and the root-iteration calls the postRender() after the last item.
    }

    function dataChangeIsUpdate(dataChange)
    {
        let update = true;

        if ($lib.isEmpty(dataChange))
            return false;

        $lib.each(dataChange, function (c)
        {
            return (update = (!$lib.isEmpty(c.keys) || !$lib.isEmpty(c.addCount) || !$lib.isEmpty(c.removeCount)));
        });

        return update;
    }

    function getElement(item)
    {
        let element;

        element = $lib('#' + item.id);

        if (!element && (!item.includable || item.included))
        {
            let parent = (item.parent && item.parent.element) ? item.parent.element : null;
            element = $lib((el) => { return (el.getAttribute(core.attr.id) === item.id) }, parent, item.sourceElement.nodeName, true);

            if (!element && parent) // element inside <template>?
            {
                let templates = parent.querySelectorAll('template');

                $lib.each(templates, (t) =>
                {
                    element = t.content.getElementById(item.id);

                    if (element)
                        return false;
                });
            }
        }

        return element;
    }

    function skipItem(element, item, prevItem)
    {
        let conditional = item.else || !$lib.isEmpty(item.elseIf) || !$lib.isEmpty(item.if),
            skip = false,
            result;

        if (!conditional)
            return false;

        const evalIf = () =>
        {
            if (item.ifExpr)
                return !!item.ifExpr(item.expressionTokenResolver.bind(item));

            return !!core.call(item.if, [item]);
        };

        const evalElseIf = () =>
        {
            if (item.elseIfExpr)
                return !!item.elseIfExpr(item.expressionTokenResolver.bind(item));

            return !!core.call(item.elseIf, [item]);
        };

        if (item.if)
        {
            result = evalIf();
            skip = !(item.conditionMet = result);
        }
        else if (item.elseIf || item.else)
        {
            skip = item.conditionMet = prevItem.conditionMet;

            if (!skip)
            {
                result = item.elseIf ? evalElseIf() : true;
                skip = !(item.conditionMet = result);
            }
        }

        if (skip && element && !element._bindaryPlaceholder)
            core.setItemPlaceHolder(item, element);

        return skip;
    }

    function checkRecursive(item)
    {
        if (core.modelDataChanges.size)
            return true;

        let mustCheck = false,
            paths = item.resolveLivePaths();

        $lib.each(paths, function (path)
        {
            $lib.each(core.dataChanges, function (r, key)
            {
                if (core.dataKeyMatch(key, path))
                    mustCheck = true;

                return !mustCheck;
            });

            return !mustCheck;
        });

        return mustCheck;
    }

    function removeRepeatElements(item, dataChange)
    {
        let reps = item.repeatElements;

        for (let index = 0; index < dataChange.removeCount; ++index)
        {
            let key = (dataChange.removeIndex + index).toString();

            $lib.remove(reps[key]);
            delete reps[key];
        }
    }

    function updateTemplateItem(el, deep, clear)
    {
        let item = getTemplateItem(el), parent, parentItem, dataKey;

        if (item)
            item.parseTemplateElement(el, getEvents(el), null, item.parent);
        else
        {
            parent = el.parentNode;

            while (parent)
            {
                parentItem = getTemplateItem(parent);

                if (parentItem != null)
                {
                    item = new TemplateItem(el, getEvents(el), null, parentItem);
                    parent = null;
                }
                else
                    parent = parent.parentNode;
            }

            if (!parentItem)
                item = new TemplateItem(el, getEvents(el), null);
        }

        if (clear)
        {
            removeTemplateItemTree(item);
        }

        if (deep)
            createViewTree(el, item);

        core.templateUpdate = true;
        return item;
    }

    function removeTemplateItemTree(item)
    {
        if (!item || !Array.isArray(item.children)) return;

        item.children.forEach(child =>
        {
            // Recursively remove all descendants
            removeTemplateItemTree(child);

            const index = $lib.indexOf(core.templateList, i => i.id === child.id); // Remove child from templateList

            if (index > -1)
                core.templateList.splice(index, 1);
        });

        item.children = [];
    }

    function getTemplateItem(node)
    {
        let id = (node.getAttribute) ? node.getAttribute(core.attr.id) || node.id : node.id;

        if ($lib.isEmpty(id))
            return null;

        let index = $lib.indexOf(core.templateList, function (i)
        {
            return (i.id === id);
        });

        if (index > -1)
            return core.templateList[index];
        else
            return null;
    }

    function createViewTree(root, rootItem)
    {
        let el, events, includes = [], index;

        if (!root)
        {
            core.templateList = [];
            core.viewTree = [];
        }

        iterate((!$bindary.detectOutsideView) ? core.getViewContainer() : root || document.documentElement, rootItem, includes);

        for (index = 0; index < includes.length; ++index)
        {
            $lib.remove(includes[index]);
        }

        for (index = 0; index < core.templateList.length; ++index)
        {
            el = core.templateList[index].sourceElement;

            if (!el || core.keepAttributes(el))
                continue;

            events = getEvents(el);

            // clear stored attributes
            $lib.each(core.attr, function (item, key)
            {
                if (key != 'view' && key != 'id')
                    el.removeAttribute(item);
            });

            $lib.each(events, function (value, event)
            {
                el.removeAttribute(core.attr.on + '-' + event);
            });
        }
    }

    function iterate(parent, parentItem, includes)
    {
        let node = (parent.nodeName == 'TEMPLATE' && parent.content) ? parent.content.firstChild : parent.firstChild, events, attributes, item, nodeType, obj;

        while (node)
        {
            nodeType = node.nodeType;
            obj = (nodeType == 1) ? getEventsAndAttributes(node) : null;
            events = (nodeType == 1) ? obj.events : null;
            attributes = (nodeType == 1) ? obj.attributes : null;
            item = parentItem;

            if (nodeType != 1 || !node.hasAttribute(core.attr.ignore))
            {
                const hasContentExpr = (nodeType == 1) ? core.resolveContentExpression(node) : false;

                if (nodeType == 1 && (hasTemplateAttribute(node) || !$lib.isEmpty(events) || !$lib.isEmpty(attributes)) || hasContentExpr)
                {
                    if (item = getTemplateItem(node))
                        item.parseTemplateElement(node, events, attributes, item.parent); // update
                    else
                        item = new TemplateItem(node, events, attributes, parentItem);

                    if (item.includableRoot)
                        includes.push(node);
                }

                if (nodeType == 1)
                    iterate(node, item, includes);
            }

            node = node.nextSibling;
        }
    }

    function getEventsAndAttributes(el)
    {
        let attr, events = {}, attributes = {};

        for (let index = 0; index < el.attributes.length; ++index)
        {
            attr = el.attributes[index];

            if ($lib.startsWith(attr.nodeName, core.attr.on))
                events[attr.nodeName.substr(core.attr.on.length + 1)] = attr.value;
            else if (attr.name.indexOf(core.prefix) != 0 && core.hasExpression(attr.value))
                attributes[attr.name] = attr.value;
        }

        return { events: events, attributes: attributes };
    }

    function getEvents(el)
    {
        let attr, events = {};

        for (let index = 0; index < el.attributes.length; ++index)
        {
            attr = el.attributes[index];

            if ($lib.startsWith(attr.nodeName, core.attr.on))
                events[attr.nodeName.substr(core.attr.on.length + 1)] = attr.value;
        }

        return events;
    }

    function hasTemplateAttribute(el)
    {
        const ignoreKeys = ['view', 'id', 'keep', 'live'];

        for (let key in core.attr)
        {
            if (!ignoreKeys.includes(key) && el.hasAttribute(core.attr[key]))
            {
                return true;
            }
        }

        return false;
    }

    $lib.on(document, 'visibilitychange', visibilityChange);
    $lib.on(window, 'scroll', scroll);
    $lib.on(window, 'popstate', popState);
    $lib.on(window, 'pageshow', (e) =>
    {
        if (e.persisted && $bindary.reloadRouteOnPageRestore) // restored from the back/forward cache
            router.load(core.getRoutePath());
    });
    $lib.on(window, 'pagehide', () =>
    {
        if (!$lib.isEmpty($bindary.routeIndex))
            router.unload($bindary.routeIndex, $bindary.routePath, true);
    });

    $.ready(async () =>
    {
        await componyx.bindary_modules.loaded;

        $.defer(() =>
        {
            if ($bindary.launchOnLoad)
                launch();
        });
    });

    componyx.bindary.TemplateItem = componyx.bindary_modules.TemplateItem;

})(window);