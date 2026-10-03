declare namespace componyx
{
    namespace base_modules
    {
        /**
         * <p>The built-in HTML sanitizer used by components such as Editor and Form.</p>
         */
        class Sanitizer
        {
            /**
             * <p>Sanitizes the specified HTML.</p>
             * @param html - <p>The HTML to sanitize.</p>
             * @returns <p>The sanitized HTML.</p>
             */
            sanitize(html: string): string;
        }
    }
    /**
     * <p>componyx.UI ($UI) Contains global helper methods for UI components.</p>
     */
    namespace UI 
    {
        /**
         * <p>When specified, the version is appended to the URL for locating UI CSS &amp; Script resources.</p>
         */
        var version: string | null;

        /**
         * <p>A value indicating whether UI components are automatically detected when the page is ready.</p>
         */
        var autoDetect: boolean;
        /**
         * <p>Holds UI component references by unique id and HTMLElement.</p>
         */
        var store: any;
        /**
         * <p>componyx.UI.elementStore Holds UI component references by HTMLElement.</p>
         */
        var elementStore: any;
        /**
         * <p>componyx.UI.groupStore Holds UI component id's for each unique group.</p>
         */
        var groupStore: any;
        /**
         * <p>componyx.UI.scriptResources Contains UI script resources for dynamic loading.</p>
         */
        var scriptResources: any;
        /**
         * <p>componyx.UI.cssResources Contains UI css resources for dynamic loading.</p>
         */
        var cssResources: any;
        /**
         * <p>When specified, component resources will be added before this resource element.</p>
         */
        var resourcesBefore: HTMLElement;
        /**
         * <p>A value indicating if UI components use custom element names.</p>
         */
        var useCustomElementNames: boolean;
        /**
         * <p>The CSS theme name which is set on the component's root element. Can be overridden when defined on a component-group or component.</p>
         */
        var themeName: string;
        /**
         * <p>Gets or sets a value indicating if component resources (CSS and scripts) are loaded on demand. Disable when all resources are already included, e.g. with the bundled ui.js and ui.css.</p>
        */
        var onDemandResourceLoading: boolean;
        /**
         * <p>A value indicating if the UI is busy rendering components.</p>
         */
        const busy: boolean;
        /**
         * <p>Gets or sets the custom tag prefix for UI components. Defaults to 'cui-'.</p>
         */
        var tagPrefix: string;
        /**
         * <p>Sets the relative or absolute path for on-demand loading of component script and css resources.</p>
         * @param scriptPath - <p>The path (relative or absolute root URL) to locate script resources. Use {0} as placeholder for the component name. (e.g. 'scripts/{0}.min.js' or 'http://path/src?d={0}.min.js')</p>
         * @param [cssPath] - <p>The path (relative or absolute root URL) to locate css resources. Use {0} as placeholder for the component name. (e.g. 'css/(0).min.css' or 'http://path/src?d={0}.min.css')</p>
         * @param [theme] - <p>The css theme to activate. Is required when a default component theme is used (e.g. ThemeOption.DEFAULT).</p>
         * @param [cssThemePath] - <p>The path (relative or absolute root URL) to locate css theme resources. Use {0} as placeholder for the component name. (e.g. 'css/{0}.Themes.Default.css' or 'http://path/src?d={0}.Themes.Default.css')</p>
         */
        function setResourcePath(scriptPath: string, cssPath?: string, theme?: componyx.UI.base.static.ThemeOption, cssThemePath?: string): void;
        /**
         * <p>Gets the resource path for on-demand loading of component scripts.</p>
         * @param name - <p>The component name.</p>
         * @returns <p>The script resource path</p>
         */
        function getScriptResourcePath(name: string): string;
        /**
         * <p>Gets the resource path for on-demand loading of component CSS.</p>
         * @param name - <p>The component name.</p>
         * @param [theme = 0] - <p>The css theme (e.g. ThemeOption.DEFAULT).</p>
         * @returns <p>The css resource path</p>
         */
        function getCssResourcePath(name: string, theme?: componyx.UI.base.static.ThemeOption): string;
        /**
         * Creates a new component instance synchronously.
         * @param componentClass The component class constructor.
         * @param properties The properties to initialize the component. Must include the `id` property.
         * @param element Optional element that is the actual component instance or placeholder to replace.
         * @param options Optional parameters.
         *   - `loadScript`: When `false` or omitted, assumes the component class is already loaded.
         *   - `namespace`: The namespace to resolve the component script. Defaults to `'componyx.UI'`.
         * @returns The created component instance.
         */
        function createComponent(componentClass: Function | { new(...args: any): any }, properties: object, element?: HTMLElement, options?: { loadScript?: false; namespace?: string | null }): any;

        /**
         * Creates a new component instance asynchronously by loading the component script first.
         * @param componentClass The component class name (string).
         * @param properties The properties to initialize the component. Must include the `id` property.
         * @param element Optional element that is the actual component instance or placeholder to replace.
         * @param options Parameters.
         *   - `loadScript`: Must be `true` to trigger async loading of the script.
         *   - `namespace`: The namespace to resolve the component script. Defaults to `'componyx.UI'`.
         * @returns A Promise resolving to the created component instance.
         */
        function createComponent(componentClass: string, properties: object, element: HTMLElement | null | undefined, options: { loadScript: true; namespace?: string | null }): Promise<any>;

        /**
        * Loads the component script asynchronously by its full type name (including namespace).
        * This method dynamically imports the script file, waits for any module initialization, and returns the component class once it is loaded and available.
        * @param typeName The full name of the component type, including the namespace (e.g. 'componyx.UI.ComboBox').
        * @returns A Promise resolving to the loaded component class.
        */
        function loadComponentScript(typeName: string): Promise<any>;

        /**
         * <p>Detects and registers on the page defined components and component-groups.</p>
         * @param [container] - <p>A container element in which the UI components must be detected.</p>
         * @param [overwrite = true] - <p>A value indicating to overwrite (recreate) the component element if it already exists.</p>
         */
        function detect(container?: HTMLElement, overwrite?: boolean): Promise<void>;
        /**
         * <p>Adds base settings for a specific component(s).</p>
         * @param settingsId - <p>Identifier of the settings object.</p>
         * @param settings - <p>The settings used to initialize the component.</p>
         */
        function addSettings(settingsId: string, settings: any): void;
        /**
         * <p>Adds a component to a unique group.</p>
         * @param groupId - <p>Unique identifier of the component group.</p>
         * @param componentId - <p>Unique identifier of the component.</p>
         */
        function addToGroup(groupId: string, componentId: string): void;
        /**
         * <p>Renders all components in the specified group.</p>
         * @param groupId - <p>Unique identifier of the component group.</p>
         * @param [show] - <p>A value indicating if the components should be displayed (true by default).</p>
         * @param [exclude] - <p>A list of component id's inside the group to exclude from rendering.</p>
         * @param [theme] - <p>The active styling theme of the component.</p>
         * @param [themeName] - <p>The theme name is appended to the CSS class of the component's root HTMLElement.</p>
         */
        function renderGroup(groupId: string, show?: boolean, exclude?: String[], theme?: componyx.UI.base.static.ThemeOption, themeName?: string): void;
        /**
         * <p>Destroys all components in the specified group.</p>
         * @param groupId - <p>Unique identifier of the component group.</p>
         * @param [removeGroup = false] - <p>A value indicating if the group should be removed.</p>
         */
        function destroyGroup(groupId: string, removeGroup?: boolean): void;
        /**
         * <p>Removes the specified group.</p>
         * @param groupId - <p>Unique identifier of the component group.</p>
         */
        function removeGroup(groupId: string): void;
        /**
         * <p>Destroys all components within the specified container element.</p>
         * @param container - <p>A container element in which the UI components must be destoyed.</p>
         */
        function destroy(container: HTMLElement): void;
        /**
         * Event which fires before a UI component loads the component tag settings (JSON settings from the attribute data-ui-settings or data-ui-settingsid).
         * Incoming argument is the HTMLElement.
         */
        var onPreLoadSettings: componyx.UI.base.Event<HTMLElement, undefined>;

        /**
         * Event which fires before a UI component is rendered. Incoming argument is the component instance.
         */
        var onPreRender: componyx.UI.base.Event<componyx.UI.base.Component | componyx.UI.base.WebComponent, undefined>;

        /**
         * Event which fires when the UI component chain is rendered.
         */
        var onPostRender: componyx.UI.base.PostRenderEvent;

        namespace base 
        {
            /**
             * <p>Represents a UI event used throughout the componyx.UI.base framework.
             * This event type is based on and compatible with {@link componyx.library.Event}, but may have an internal prototype chain or additional behaviors specific to the UI framework.</p>
             * <p>Handlers receive the sender (the component instance) as first argument and the event arguments as second argument; <code>this</code> is the sender as well.</p>
             * @template TSender - The type of the sender (the component instance).
             * @template TArgs - The type of the event arguments.
             */
            interface Event<TSender = any, TArgs = any> extends componyx.library.Event<(this: TSender, sender: TSender, eventArgs: TArgs, ...params: any[]) => any>
            {
                /**
                 * <p>Fires the event. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param instance - <p>The component instance which initiates the event.</p>
                 * @param [args] - <p>The event arguments, or a list of arguments to pass to the event handlers.</p>
                 * @param [withInstance = true] - <p>A value indicating if the component instance is passed as first argument to the event handler.</p>
                 */
                fire(instance: TSender, args?: any, withInstance?: boolean): any;
            }

            interface PostRenderEvent extends Event
            {
                /**
                 * Fires the event.
                 */
                fire(): void;
            }

            /**
             * <p>Base component events.</p>
             * @template TSender - The type of the component instance passed as sender to the event handlers.
             * @template THideArgs - The type of the onHide event arguments. Components that fire onHide with arguments (e.g. the Box) pass their own type.
             * @property dispose - <p>Removes all event handlers.</p>
             * @property onPreRender - <p>Event which fires before the component is rendered.</p>
             * @property onPostRender - <p>Event which fires after the component is rendered.</p>
             * @property onShow - <p>Event which fires when the component is shown.</p>
             * @property onHide - <p>Event which fires when the component is hidden.</p>
             * @property onDestroy - <p>Event which fires when the component is destroyed.</p>
             * @property onPreApplyTemplate - <p>Event which fires before a template is applied.</p>
             * @property onPostApplyTemplate - <p>Event which fires after a template is applied.</p>
             * @property onAjaxStart - <p>Event which fires before an ajax method call.</p>
             * @property onAjaxComplete - <p>Event which fires after an ajax method call.</p>
             * @property onAjaxSuccess - <p>Event which fires when an ajax method response has httpstatus &gt;= 200 &amp; &lt; 300 or 304.</p>
             * @property onAjaxError - <p>Event which fires when an ajax method response does not have an http success status code.</p>
             * @property onAjaxProgress - <p>Event which fires periodically while downloading data.</p>
             * @property onAjaxUploadProgress - <p>Event which fires periodically while uploading data.</p>
             * @property onAjaxUploadError - <p>Event which fires when an upload failed.</p>
             * @property onAjaxAbort - <p>Event which fires when a running ajax call is aborted.</p>
             * @property onClick - <p>Event which fires when the component is clicked.</p>
             */
            class Events<TSender = componyx.UI.base.Component | componyx.UI.base.WebComponent, THideArgs = undefined>
            {
                /**
                 * <p>Removes all event handlers.</p>
                */
                dispose: (...params: any[]) => any;
                /**
                 * <p>Event which fires before the component is rendered.</p>
                */
                onPreRender: componyx.UI.base.Event<TSender, componyx.UI.base.PreRenderEventArgs>;
                /**
                 * <p>Event which fires after the component is rendered.</p>
                */
                onPostRender: componyx.UI.base.Event<TSender, undefined>;
                /**
                 * <p>Event which fires when the component is shown.</p>
                */
                onShow: componyx.UI.base.Event<TSender, undefined>;
                /**
                 * <p>Event which fires when the component is hidden.</p>
                */
                onHide: componyx.UI.base.Event<TSender, THideArgs>;
                /**
                 * <p>Event which fires when the component is destroyed.</p>
                */
                onDestroy: componyx.UI.base.Event<TSender, undefined>;
                /**
                 * <p>Event which fires before a template is applied.</p>
                */
                onPreApplyTemplate: componyx.UI.base.Event<TSender, componyx.UI.base.TemplateEventArgs>;
                /**
                 * <p>Event which fires after a template is applied.</p>
                */
                onPostApplyTemplate: componyx.UI.base.Event<TSender, componyx.UI.base.TemplateEventArgs>;
                /**
                 * <p>Event which fires before an ajax method call.</p>
                */
                onAjaxStart: componyx.UI.base.Event<TSender, componyx.UI.base.AjaxEventArgs>;
                /**
                 * <p>Event which fires after an ajax method call.</p>
                */
                onAjaxComplete: componyx.UI.base.Event<TSender, componyx.UI.base.AjaxEventArgs>;
                /**
                 * <p>Event which fires when an ajax method response has httpstatus &gt;= 200 &amp; &lt; 300 or 304.</p>
                */
                onAjaxSuccess: componyx.UI.base.Event<TSender, componyx.UI.base.AjaxEventArgs>;
                /**
                 * <p>Event which fires when an ajax method response does not have an http success status code.</p>
                */
                onAjaxError: componyx.UI.base.Event<TSender, componyx.UI.base.AjaxEventArgs>;
                /**
                 * <p>Event which fires periodically while downloading data.</p>
                */
                onAjaxProgress: componyx.UI.base.Event<TSender, componyx.UI.base.AjaxEventArgs>;
                /**
                 * <p>Event which fires periodically while uploading data.</p>
                */
                onAjaxUploadProgress: componyx.UI.base.Event<TSender, componyx.UI.base.AjaxEventArgs>;
                /**
                 * <p>Event which fires when an upload failed.</p>
                */
                onAjaxUploadError: componyx.UI.base.Event<TSender, componyx.UI.base.AjaxEventArgs>;
                /**
                 * <p>Event which fires when a running ajax call is aborted.</p>
                */
                onAjaxAbort: componyx.UI.base.Event<TSender, componyx.UI.base.AjaxEventArgs>;
                /**
                 * <p>Event which fires when the component is clicked. The event arguments are the original click event.</p>
                */
                onClick: componyx.UI.base.Event<TSender, MouseEvent>;
            }
            /**
             * <p>Pre-render event arguments.</p>
             */
            type PreRenderEventArgs = {
                /** <p>Set to true to cancel the render.</p> */
                cancel: boolean;
            };
            /**
             * <p>Template event arguments.</p>
             */
            type TemplateEventArgs = {
                /** <p>The template id.</p> */
                id: string;
                /** <p>The template element.</p> */
                template: HTMLElement;
                /** <p>The element to which the template content is added.</p> */
                element: HTMLElement;
                /** <p>The template replacement values.</p> */
                values: any;
                /** <p>The callback method for the template replacement values.</p> */
                matchHandler?: (...params: any[]) => any;
            };
            /**
             * <p>Ajax event arguments: the XHR arguments as passed to the componyx.library.XhrCallback. Any callArgs passed to ajaxCall follow as additional handler parameters.</p>
             */
            type AjaxEventArgs = any;
            /**
             * <p>Represents a configurable AJAX method associated with a component or context instance.
             * Used to generate dynamic endpoint URLs and manage request payloads and headers.</p>
             * @property url - <p>The method-specific URL to use. If not set, falls back to <code>ajax.url</code>.</p>
             * @property absoluteURL - <p>If <code>false</code>, the URL will be resolved as relative to <code>location.origin</code>.</p>
             * @property jsonResponseDataWrapper - <p>Optional key to extract response data from (e.g., for .NET-style responses). Falls back to <code>ajax.jsonResponseDataWrapper</code>.</p>
             * @property jsonDeserializer - <p>Optional function to deserialize the JSON response.</p>
             * @property endPointMethod - <p>The server-side method name to be appended to the endpoint URL.</p>
             * @property customParameters - <p>Additional query parameters or payload to be merged with the request data.</p>
             * @property headers - <p>HTTP headers specific to this method. Overrides global headers in <code>ajax.headers</code>.</p>
             */
            type AjaxMethod = {
                url: string;
                absoluteURL: boolean;
                jsonResponseDataWrapper: string | null;
                jsonDeserializer: ((...params: any[]) => any) | null;
                endPointMethod: string;
                customParameters: string | any;
                headers: {
                    [key: string]: string;
                } | null;
                /**
                 * <p>Returns a value indicating if the ajax method has a defined url, either on the method itself or on the component's base ajax settings.</p>
                 */
                isDefined(): boolean;
                /**
                 * <p>Invokes the ajax method.</p>
                 * @param data - <p>The data to send.</p>
                 * @param onStart - <p>Callback fired before the request.</p>
                 * @param onComplete - <p>Callback fired after the request.</p>
                 * @param onSuccess - <p>Callback fired when the request was successful.</p>
                 * @param onError - <p>Callback fired when the request failed.</p>
                 * @param onProgress - <p>Callback fired on download progress.</p>
                 * @param onUploadProgress - <p>Callback fired on upload progress.</p>
                 * @param onUploadError - <p>Callback fired when the upload failed.</p>
                 * @param onAbort - <p>Callback fired when the request was aborted.</p>
                 */
                invoke(data: any, onStart?: (...params: any[]) => any, onComplete?: (...params: any[]) => any, onSuccess?: (...params: any[]) => any, onError?: (...params: any[]) => any, onProgress?: (...params: any[]) => any, onUploadProgress?: (...params: any[]) => any, onUploadError?: (...params: any[]) => any, onAbort?: (...params: any[]) => any): any;
            };
            /**
             * @param name - <p>The method name to create or override.</p>
             */
            type AddAjaxMethod = (name: string) => void;
            /**
             * <p>UI component Base Component class.</p>
             * @property id - <p>The unique identifier of the component.</p>
             * @property containerElement - <p>The parent element of the component's root element.</p>
             * @property beforeElement - <p>The component's root element will be placed before this node when specified.</p>
             * @property name - <p>The name of the component's input field when applicable.</p>
             * @property theme - <p>The active styling theme of the component.</p>
             * @property themeName - <p>The CSS theme name which is set on the component's root element.</p>
             * @property cssClass - <p>The CSS class of the component's root HTMLElement.</p>
             * @property cssClassTouch - <p>The CSS class applied to the component's root HTMLElement when dealing with a touch device.</p>
             * @property style - <p>The CSS style text applied to the root HTMLElement of the component.</p>
             * @property title - <p>The title of the root element.</p>
             * @property tabIndex - <p>The tabindex of the component's root HTMLElement.</p>
             * @property autoTouchConfig - <p>A value indicating if the component automatically uses optimal touch device settings when rendered on a touch device.</p>
             * @property cloneInput - <p>A value indicating if the source input is cloned when a (hidden)input is used as base element.</p>
             * @property keepInputId - <p>A value indicating if the source input id is kept when a (hidden)input is cloned and used as base element.</p>
             * @property keepInputEventHandlers - <p>A value indicating if the source input event handlers are kept when a (hidden)input is cloned and used as base element.</p>
             * @property disableDefaultCssClass - <p>A value indicating if the default component css class is set on the component element.</p>
             * @property renderState - <p>The current render state of the component.</p>
             * @property element - <p>The root HTMLElement of the component.</p>
             * @property showing - <p>A value indicating if the component is visible. This active state might differ from property hidden when async resources are loaded, i.e. when a component.show() is called this property value is set to true while the hidden property will also remain true until the resources are loaded and the component is rendered.</p>
             * @property allowPostRender - <p>A value indicating if the post render event is allowed.</p>
             * @property renderWhenConnected - <p>A value indicating if the component is rendered when the connectedCallback method is invoked. This property only applies to components that are build as standard Web Component with a custom element definition, see documentation for applicable components.</p>
             * @property ignoreConnectionCallbacks - <p>A value indicating if the execution of the connectedCallback and disconnectedCallback are prevented during DOM modifications (e.g. replaceChild, appendChild, insertBefore, replaceWith). By default, this is <code>false</code>. If needed, you can set it to <code>true</code> before modifying the DOM. This property only applies to components built as standard Web Components with a custom element definition; see documentation for applicable components.</p>
             * @property canRender - <p>A value indicating if the component is allowed to render. Useful for delaying rendering until data binding (using any prefered framework) is complete when attributes are data-bound.</p>
             * @property templates - <p>Initialized Templates of the component.</p>
             * @property store - <p>Internal storage of UI child components.</p>
             * @property events - <p>The base component events.</p>
             * @property ajax - <p>Contains AJAX configuration and dynamically created AJAX methods.</p>
             * @property ajax.url - <p>The default base URL used for AJAX calls.</p>
             * @property ajax.absoluteURL - <p>Indicates whether the <code>url</code> is treated as absolute (<code>true</code>) or relative to the current location (<code>false</code>).</p>
             * @property [ajax.headers = null] - <p>Optional HTTP request headers to include with each AJAX call.</p>
             * @property ajax.jsonResponseDataWrapper - <p>The JSON wrapper key used to extract data from the server response (e.g., for ASP.NET JSON responses).</p>
             * @property ajax.jsonDeserializer - <p>Optional function to deserialize JSON data from the server.</p>
             * @property ajax.load - <p>Default AJAX method instance used for basic data loading.</p>
             * @property ajax.addMethod - <p>INTERNAL: Adds or overrides a named AJAX method.</p>
             */
            class Component
            {
                /**
                 * @param id - <p>The unique identifier of the component.</p>
                 * @param [properties] - <p>The properties used to initialize the component or the container element.</p>
                 * @param [baseObject] - <p>One or more objects or constructors whose members are cloned onto the component instance (constructors are instantiated first).</p>
                 */
                constructor(id: string, properties?: any | HTMLElement, baseObject?: object | (new () => object) | Array<object | (new () => object)>);
                /**
                 * <p>The unique identifier of the component.</p>
                */
                id: string;
                /**
                 * <p>The parent element of the component's root element.</p>
                */
                containerElement: HTMLElement;
                /**
                 * <p>The component's root element will be placed before this node when specified.</p>
                */
                beforeElement: HTMLElement;
                /**
                 * <p>The name of the component's input field when applicable.</p>
                */
                name: string;
                /**
                 * <p>The active styling theme of the component.</p>
                */
                theme: componyx.UI.base.static.ThemeOption;
                /**
                 * <p>The CSS theme name which is set on the component's root element.</p>
                */
                themeName: string;
                /**
                 * <p>The CSS class of the component's root HTMLElement.</p>
                */
                cssClass: string;
                /**
                 * <p>The CSS class applied to the component's root HTMLElement when dealing with a touch device.</p>
                */
                cssClassTouch: string;
                /**
                 * <p>The CSS style text applied to the root HTMLElement of the component.</p>
                */
                style: string;
                /**
                 * <p>The title of the root element.</p>
                */
                title: string;
                /**
                 * <p>The tabindex of the component's root HTMLElement.</p>
                */
                tabIndex: string;
                /**
                 * <p>A value indicating if the component automatically uses optimal touch device settings when rendered on a touch device.</p>
                */
                autoTouchConfig: boolean;
                /**
                 * <p>A value indicating if the source input is cloned when a (hidden)input is used as base element.</p>
                */
                cloneInput: boolean;
                /**
                 * <p>A value indicating if the source input id is kept when a (hidden)input is cloned and used as base element.</p>
                */
                keepInputId: boolean;
                /**
                 * <p>A value indicating if the source input event handlers are kept when a (hidden)input is cloned and used as base element.</p>
                */
                keepInputEventHandlers: boolean;
                /**
                 * <p>A value indicating if the default component css class is set on the component element.</p>
                */
                disableDefaultCssClass: boolean;
                /**
                 * <p>The current render state of the component.</p>
                */
                renderState: componyx.UI.base.static.RenderState;
                /**
                 * <p>The root HTMLElement of the component.</p>
                */
                element: HTMLElement;
                /**
                 * <p>A value indicating if the component is visible. This active state might differ from property hidden when async resources are loaded, i.e. when a component.show() is called this property value is set to true while the hidden property will also remain true until the resources are loaded and the component is rendered.</p>
                */
                showing: boolean;
                /**
                 * <p>A value indicating if the post render event is allowed.</p>
                */
                allowPostRender: boolean;
                /**
                 * <p>A value indicating if the component is rendered when the connectedCallback method is invoked. This property only applies to components that are build as standard Web Component with a custom element definition, see documentation for applicable components.</p>
                */
                renderWhenConnected: boolean;
                /**
                 * <p>A value indicating if the execution of the connectedCallback and disconnectedCallback are prevented during DOM modifications (e.g. replaceChild, appendChild, insertBefore, replaceWith). By default, this is <code>false</code>. If needed, you can set it to <code>true</code> before modifying the DOM. This property only applies to components built as standard Web Components with a custom element definition; see documentation for applicable components.</p>
                */
                ignoreConnectionCallbacks: boolean;
                /**
                 * <p>A value indicating if the component is allowed to render. Useful for delaying rendering until data binding (using any prefered framework) is complete when attributes are data-bound.</p>
                */
                canRender: boolean;
                /**
                 * <p>Initialized Templates of the component.</p>
                */
                templates: any;
                /**
                 * <p>Internal storage of UI child components.</p>
                */
                store: any;
                /**
                 * <p>A value indicating if the component observes attribute mutations on its root element to keep properties in sync.</p>
                */
                observing: boolean;
                /**
                 * <p>The MutationObserver instance watching attribute changes on the component's root element, when observing is active.</p>
                */
                attributeObserver: MutationObserver | null;
                /**
                 * <p>The MutationObserver instance watching for removal of the component's root element from its parent, when observing is active.</p>
                */
                removalObserver: MutationObserver | null;
                /**
                 * <p>The base component events.</p>
                */
                events: componyx.UI.base.Events<any, any>;
                /**
                 * <p>Contains AJAX configuration and dynamically created AJAX methods.</p>
                */
                ajax: {
                    url: string;
                    absoluteURL: boolean;
                    headers?: {
                        [key: string]: string;
                    };
                    jsonResponseDataWrapper: string;
                    jsonDeserializer: ((...params: any[]) => any) | null;
                    load: componyx.UI.base.AjaxMethod;
                    addMethod: componyx.UI.base.AddAjaxMethod;
                };
            }
            /**
             * <p>Base static utility methods.</p>
             */
            namespace static
            {
                /**
                 * <p>Theme options.</p>
                 */
                enum ThemeOption
                {
                    NONE = -1,
                    BASE = 0,
                    DEFAULT = 1
                }
                namespace ThemeOption
                {
                    /**
                     * <p>Gets the name of the specified value.</p>
                     * @param value - <p>The enum value.</p>
                     */
                    function getName(value: componyx.UI.base.static.ThemeOption): string;
                }
                /**
                 * <p>Render states.</p>
                 */
                enum RenderState
                {
                    NONE = 0,
                    RENDERING = 1,
                    RENDERED = 2
                }
                /**
                 * <p>Animation easing options.</p>
                 */
                enum AnimationEasingOption
                {
                    linear = 0,
                    easeInQuad = 1,
                    easeOutQuad = 2,
                    easeInOutQuad = 3,
                    easeInCubic = 4,
                    easeOutCubic = 5,
                    easeInOutCubic = 6,
                    easeInQuart = 7,
                    easeOutQuart = 8,
                    easeInOutQuart = 9,
                    easeInQuint = 10,
                    easeOutQuint = 11,
                    easeInOutQuint = 12,
                    easeInSine = 13,
                    easeOutSine = 14,
                    easeInOutSine = 15,
                    easeInExpo = 16,
                    easeOutExpo = 17,
                    easeInOutExpo = 18,
                    easeInCirc = 19,
                    easeOutCirc = 20,
                    easeInOutCirc = 21,
                    easeInElastic = 22,
                    easeOutElastic = 23,
                    easeInOutElastic = 24,
                    easeInBack = 25,
                    easeOutBack = 26,
                    easeInOutBack = 27,
                    easeInBounce = 28,
                    easeOutBounce = 29,
                    easeInOutBounce = 30
                }
                namespace AnimationEasingOption
                {
                    /**
                     * <p>Gets the name of the specified value.</p>
                     * @param value - <p>The enum value.</p>
                     */
                    function getName(value: componyx.UI.base.static.AnimationEasingOption): string;
                }
                /**
                 * <p>Resolves a method reference. If the name is a string it is resolved as a (possibly dotted) global function reference, optionally with a static-argument call expression (e.g. <code>"my.ns.fn('literal', 1)"</code>), in which case a wrapper function is returned that merges the static arguments with any runtime arguments. Non-string values are returned unchanged.</p>
                 * @param name - <p>The method reference or function.</p>
                 */
                function getMethod(name: ((...params: any[]) => any) | string): ((...params: any[]) => any) | string | null;
                /**
                 * <p>Gets the key of the specified value on an object (typically an enum-like object).</p>
                 * @param obj - <p>The object to search.</p>
                 * @param value - <p>The value to look up.</p>
                 */
                function getKeyByValue(obj: any, value: any): string | null;
                /**
                 * <p>Initializes drag settings, resolving element references and merging with source settings. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param settings - <p>The drag settings to initialize.</p>
                 * @param srcSettings - <p>Source settings to merge in.</p>
                 */
                function initDragSettings(settings: any, srcSettings?: any): any;
                /**
                 * <p>Initializes resize settings, resolving element references and merging with source settings. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param settings - <p>The resize settings to initialize.</p>
                 * @param srcSettings - <p>Source settings to merge in.</p>
                 */
                function initResizeSettings(settings: any, srcSettings?: any): any;
                /**
                 * <p>Initializes select settings, resolving element references and merging with source settings. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param settings - <p>The select settings to initialize.</p>
                 * @param srcSettings - <p>Source settings to merge in.</p>
                 */
                function initSelectSettings(settings: any, srcSettings?: any): any;
                /**
                 * <p>Creates a new base UI event.</p>
                 * @param eventName - <p>The name of the event.</p>
                 */
                function createEvent(eventName: string): componyx.UI.base.Event;
                /**
                 * <p>A base, array-like list of {@link componyx.UI.base.static.Item} items providing lookup and navigation helpers.</p>
                 */
                interface ItemList extends Omit<Array<componyx.UI.base.static.Item>, 'find' | 'filter'>
                {
                    /**
                     * <p>Gets the item with the specified id.</p>
                     * @param id - <p>The id of the item.</p>
                     */
                    get(id: string): componyx.UI.base.static.Item;
                    /**
                     * <p>Gets the item with the specified value.</p>
                     * @param value - <p>The value of the item.</p>
                     */
                    getByValue(value: any): componyx.UI.base.static.Item;
                    /**
                     * <p>Gets the item with the specified text.</p>
                     * @param text - <p>The text of the item.</p>
                     * @param [caseInsensitive] - <p>A value indicating if the comparison is case insensitive.</p>
                     */
                    getByText(text: string, caseInsensitive?: boolean): componyx.UI.base.static.Item;
                    /**
                     * <p>Gets the previous enabled item relative to the item with the specified id.</p>
                     * @param id - <p>The id of the item.</p>
                     */
                    previous(id: string): componyx.UI.base.static.Item;
                    /**
                     * <p>Gets the next enabled item relative to the item with the specified id.</p>
                     * @param id - <p>The id of the item.</p>
                     */
                    next(id: string): componyx.UI.base.static.Item;
                    /**
                     * <p>Finds the next matching item for the specified filter text, cycling past the item with the specified id.</p>
                     * @param text - <p>The text to filter on.</p>
                     * @param [id] - <p>The id of the item to start searching after.</p>
                     */
                    find(text: string, id?: string): componyx.UI.base.static.Item;
                    /**
                     * <p>Filters the list to items whose text starts with the specified text.</p>
                     * @param text - <p>The text to filter on.</p>
                     */
                    filter(text: string): componyx.UI.base.static.Item[];
                }
                const ItemList: { new(): ItemList; prototype: ItemList };
                /**
                 * <p>Item base class.</p>
                 * @param properties - <p>The properties used to initialize the object.</p>
                 */
                class Item
                {
                    constructor(properties: any);
                    /**
                     * <p>Gets or sets the attributes of the item.</p>
                    */
                    attributes: any;
                    /**
                     * <p>Gets or sets the id of the item.</p>
                    */
                    id: string;
                    /**
                     * <p>Gets or sets the id of the item template.</p>
                    */
                    templateId: string;
                    /**
                     * <p>Gets or sets the css class of the item.</p>
                    */
                    cssClass: string;
                    /**
                     * <p>Gets or sets the text of the item.</p>
                    */
                    text: string;
                    /**
                     * <p>Gets or sets the value of the item.</p>
                    */
                    value: string;
                    /**
                     * <p>Gets or sets a value indicating if the item is disabled.</p>
                    */
                    disabled: boolean;
                    /**
                     * <p>Gets or sets a value indicating if the item is read-only.</p>
                    */
                    readOnly: boolean;
                    /**
                     * <p>Gets or sets a Value indicating if the item is selected.</p>
                    */
                    selected: boolean;
                }
            }
            /**
             * <p>A base class for UI components extending the HTMLElement.
             * This class provides the core functionality for UI components including base properties and events.</p>
             */
            /**
             * <p>Web components receive the same base properties as Component (theme, cssClass, renderState, ajax, etc.).
             * Id, style, title and tabIndex come from HTMLElement itself.</p>
             */
            interface WebComponent extends Omit<componyx.UI.base.Component, 'id' | 'containerElement' | 'style' | 'title' | 'tabIndex' | 'events'> { }
            class WebComponent extends HTMLElement
            {
                /**
                 * <p>Events attached to the component.</p>
                 */
                events: componyx.UI.base.Events<any, any>;
                /**
                 * <p>Initializes the component with the specified properties.</p>
                 * @param [props] - <p>The properties used to initialize the component.</p>
                 */
                init(props?: any): void;
                /**
                 * <p>Invoked when the element is added to the DOM. Renders the component if not already in the rendering state.</p>
                 */
                connectedCallback(): void;
                /**
                 * <p>Invoked when the element is removed from the DOM. Cleans up the component.</p>
                 */
                disconnectedCallback(): void;
                /**
                 * <p>Renders the component.</p>
                 * @param resourceHandler - <p>The callback method for registering script and css resources.</p>
                 * @param defaultName - <p>The default name is used as default css class and when $UI.useCustomElementNames is enabled, as the element tag name prefixed by $UI.tagPrefix (default 'cui-').</p>
                 * @param [hasTheme] - <p>A value indicating if the component has a CSS theme.</p>
                 */
                render(resourceHandler: (...params: any[]) => any, defaultName: string, hasTheme?: boolean): void;
                /**
                 * <p>Clones component properties. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param properties - <p>The properties to clone.</p>
                 */
                protected cloneProperties(properties: any): void;
                /**
                 * <p>Executes the post render procedure. This method should not be invoked by client code directly but only from inside component code.</p>
                 */
                protected postRender(): void;
                /**
                 * <p>Destroys the component.</p>
                 * @param keepEvents - <p>A value indicating if component events should be kept.</p>
                 * @param removeElement - <p>A value indicating if the corresponding HTML Element should be removed.</p>
                 */
                destroy(keepEvents: boolean, removeElement?: boolean): void;
                /**
                 * <p>Gets the CSS class name from the component property if it exists, otherwise returns the default CSS class.</p>
                 * @param classOption - <p>Object containing class options.</p>
                 * @param cssClassValue - <p>Default CSS class value.</p>
                 * @returns <p>The resolved CSS class name.</p>
                 */
                getCssClass(classOption: any, cssClassValue: string): string;
            }
            interface methods
            {
                /**
                 * <p>Handles attribute mutations, updates corresponding properties, and triggers a single render after all mutations are processed.</p>
                 * @param mutations - <p>An array of mutation records containing details of the observed attribute changes.</p>
                 * @param observer - <p>The MutationObserver instance that is observing changes to the DOM.</p>
                 */
                mutationCallback(mutations: MutationRecord[], observer: MutationObserver): void;
                /**
                 * <p>Executes and XHR call. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param method - <p>The name of the method.</p>
                 * @param data - <p>The data to send.</p>
                 * @param events - <p>An object holding event handlers for various XHR events (onStart, onComplete, onSuccess, onError, onAbort, onProgress, onUploadProgress, onUploadError).</p>
                 * @param callArgs - <p>Arguments to pass to the global event handlers.</p>
                 */
                ajaxCall(method: string, data: any | string, events?: any, callArgs?: any[]): any;
                /**
                 * <p>Suppresses any change events fired by the underlying input element during the execution of the provided action. Use this when programmatically setting a component value to prevent the change event from propagating as a user interaction. The suppression is automatically lifted after the action completes, even if it throws.</p>
                 * @param action - <p>The action to execute with change events suppressed.</p>
                 */
                suppressNextChangeEvent(action: (...params: any[]) => any): void;
                /**
                 * <p>Hides the component when it's showing, otherwise it shows the component.</p>
                 */
                toggle(): void;
                /**
                 * <p>Shows the component.</p>
                 */
                show(): void;
                /**
                 * <p>Hides the component.</p>
                 */
                hide(): void;
                /**
                 * <p>Destroys the component.</p>
                 * @param keepEvents - <p>A value indicating if component events should be kept.</p>
                 * @param removeElement - <p>A value indicating if the corresponding HTML Element should be removed.</p>
                 */
                destroy(keepEvents: boolean, removeElement?: boolean): void;
                /**
                 * <p>Renders the component.</p>
                 * @param resourceHandler - <p>The callback method for registering script and css resources.</p>
                 * @param defaultName - <p>The default name is used as default css class and when $UI.useCustomElementNames is enabled, as the element tag name prefixed by $UI.tagPrefix (default 'cui-').</p>
                 * @param [hasTheme] - <p>A value indicating if the component has a CSS theme.</p>
                 * @param [tagName] - <p>The tag name of the component element.</p>
                 * @param [customTagName] - <p>The tag name of the component element when $UI.useCustomElementNames is enabled and a different tag than the default name is desired.</p>
                 */
                render(resourceHandler: (...params: any[]) => any, defaultName: string, hasTheme?: boolean, tagName?: string, customTagName?: string): void;
                /**
                 * <p>Initializes the render phase for the component.
                 * This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param resourceHandler - <p>The callback method for registering script and css resources.</p>
                 * @param defaultName - <p>The default name is used as default css class and when $UI.useCustomElementNames is enabled, as the element tag name prefixed by $UI.tagPrefix (default 'cui-').</p>
                 * @param hasTheme - <p>A value indicating if the component has a CSS theme.</p>
                 */
                initRenderPhase(resourceHandler: (...params: any[]) => any, defaultName: string, hasTheme: boolean): void;
                /**
                 * <p>Creates the component's element and handles updates.
                 * This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param defaultName - <p>The default name is used as default css class and when $UI.useCustomElementNames is enabled, as the element tag name prefixed by $UI.tagPrefix (default 'cui-').</p>
                 * @param tagName - <p>The tag name of the component element.</p>
                 * @param customTagName - <p>The tag name of the component element when $UI.useCustomElementNames is enabled and a different tag than the default name is desired.</p>
                 */
                createElement(defaultName: string, tagName: string, customTagName: string): void;
                /**
                 * <p>Configures the component's element.
                 * This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param defaultName - <p>The default name is used as default css class and when $UI.useCustomElementNames is enabled, as the element tag name prefixed by $UI.tagPrefix (default 'cui-').</p>
                 */
                configureElement(defaultName: string): void;
                /**
                 * <p>Sets up the mutation observer to track attribute changes and DOM element removal.
                 * This method should not be invoked by client code directly but only from inside component code.</p>
                 */
                setupMutationObserver(): void;
                /**
                 * <p>Invokes pre-render actions and fires the <code>onPreRender</code> event.
                 * This method should not be invoked by client code directly but only from inside component code.</p>
                 */
                invokePreRender(): void;
                /**
                 * <p>Registers required resources (CSS and JS) for the component.
                 * This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param resourceHandler - <p>The callback method for fetching resources.</p>
                 * @param callback - <p>The callback to call after resources are loaded.</p>
                 */
                registerResources(resourceHandler: (...params: any[]) => any, callback: (...params: any[]) => any): void;
                /**
                 * <p>Returns the CSS class string for the component's theme.
                 * This method should not be invoked by client code directly but only from inside component code.</p>
                 */
                getThemeCSS(): void;
                /**
                 * <p>Moves the component to a new position within the DOM.</p>
                 * @param container - <p>The new container element.</p>
                 * @param [before] - <p>The new before element.</p>
                 */
                move(container: HTMLElement, before?: HTMLElement): void;
                /**
                 * <p>Calls the render method on all child components. This method should not be invoked by client code directly but only from inside component code.</p>
                 */
                renderChildren(): void;
                /**
                 * <p>Checks if all child components have been rendered and calls the component's postRender method when this is the case. This method should not be invoked by client code directly but only from inside component code.
                 * This method is used as a postRender callback for child components.</p>
                 */
                isReady(): void;
                /**
                 * <p>Executes the post render procedure. This method should not be invoked by client code directly but only from inside component code.</p>
                 */
                postRender(): void;
                /**
                 * <p>Adds (or removes) a template.
                 * Templates for data-items provide support for property interpolations.
                 * These interpolations are curly bracket formatted markers which are replaced with item property values during template rendering.
                 * Example: {text} will output the value of item.text, while {customProperty} will output the value of item.attributes.customProperty.</p>
                 * @param id - <p>Id of the template.</p>
                 * @param content - <p>HTML string or element node array or element node. Pass null or empty string to remove the existing template.</p>
                 * @param [cloneable = true] - <p>Defines if the template can be cloned for multiple views.</p>
                 * @param [interpolate = true] - <p>Defines if a search and replace action on the inner HTML of the template will be performed to set the corresponding value for a interpolate tag (e.g. {value}).</p>
                 */
                addTemplate(id: string, content: HTMLElement | HTMLElement[] | DocumentFragment | string | null, cloneable?: boolean, interpolate?: boolean): void;
                /**
                 * <p>Checks if the template with the specified template id exists.</p>
                 * @param templateId - <p>The id of the template.</p>
                 * @returns <p>True if the template is present, otherwise false.</p>
                 */
                hasTemplate(templateId: string): boolean;
                /**
                 * <p>Gets all the template HTMLElements for the component and stores them in the component's internal template cache. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @returns <p>A list of collected template elements.</p>
                 */
                collectTemplates(): HTMLElement[];
                /**
                 * <p>Gets the template HTMLElement and stores it in the component's internal template cache. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param element - <p>The template element.</p>
                 */
                collectTemplate(element: HTMLElement): void;
                /**
                 * <p>Gets the template content for the specified template id. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param templateId - <p>The id of the template.</p>
                 * @returns <p>The template content.</p>
                 */
                getTemplateContent(templateId: string): DocumentFragment;
                /**
                 * <p>Applies the template content. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param element - <p>The element to which the template content will be added.</p>
                 * @param templateId - <p>The id of the template.</p>
                 * @param [values] - <p>Template replacement values.</p>
                 * @param [matchHandler] - <p>Callback method for the template replacement values.</p>
                 */
                applyTemplate(element: HTMLElement, templateId: string, values?: any, matchHandler?: (...params: any[]) => any): void;
                /**
                 * <p>Executes a form post-back. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param arg - <p>The postback argument.</p>
                 * @param formId - <p>The id of the form.</p>
                 */
                postBack(arg: string, formId: string): void;
                /**
                 * <p>Sets the postback arguments. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param frm - <p>The form element.</p>
                 * @param arg - <p>The postback argument.</p>
                 */
                setPostBackArgs(frm: HTMLElement, arg: string): void;
                /**
                 * <p>Clones the source component. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param source - <p>The source component.</p>
                 * @param parent - <p>The parent component.</p>
                 * @param [cloneTemplates = true] - <p>A value indicating if templates are cloned.</p>
                 * @param [cloneEvents = true] - <p>A value indicating if events are cloned.</p>
                 * @param [omitKeys = null] - <p>An object with keys to omit from cloning.</p>
                 */
                clone(source: componyx.UI.base.Component, parent: componyx.UI.base.Component, cloneTemplates?: boolean, cloneEvents?: boolean, omitKeys?: any): void;
                /**
                 * <p>Clones component properties. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param properties - <p>The properties to clone.</p>
                 */
                cloneProperties(properties: any): void;
                /**
                 * <p>Clones component events. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param source - <p>The source events.</p>
                 */
                cloneEvents(source: componyx.UI.base.Events): void;
                /**
                 * <p>Checks the focus state of the component and fires the focus event accordingly. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param [instance] - <p>A component for which to check the focus state.</p>
                 */
                onFocus(instance?: componyx.UI.base.Component): void;
                /**
                 * <p>Checks the blur state of the component and fires the blur event accordingly. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param [instance] - <p>A component for which to check the blur state.</p>
                 */
                onBlur(instance?: componyx.UI.base.Component): void;
                /**
                 * <p>Delegates focus events on the current instance to the specified instance. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param instance - <p>The component instance to which the focus / blur events are delegated.</p>
                 */
                delegateFocusEvents(instance: componyx.UI.base.Component): void;
                /**
                 * <p>Creates a (hidden) input field to store the input value and syncs it with the component. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param sourceElementId - <p>The identifier of the source element.</p>
                 * @param onChange - <p>The handler for the event which fires when the hidden input value changes.</p>
                 * @param [isHidden = true] - <p>A value indicating if it is a hidden input.</p>
                 */
                createSyncedInput(sourceElementId: string, onChange: (...params: any[]) => any, isHidden?: boolean): void;
                /**
                 * <p>Gets the source element. This method should not be invoked by client code directly but only from inside component code.</p>
                 * @param elementId - <p>The identifier of the source element.</p>
                 */
                getSourceElement(elementId: string): void;
            }
        }

    }
}

/**
 * <p>componyx.UI ($UI) Contains global helper methods for UI components.</p>
 */
declare var $UI: typeof componyx.UI;
/**
 * <p>componyx.UI.base ($base) Base classes, static helpers and methods for UI components.</p>
 */
declare var $base: typeof componyx.UI.base;