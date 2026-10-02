declare namespace componyx
{
    /**
     * <p>Enables responsive templates based on media-queries defined through HTML data-attributes.</p>
     */
    namespace responsiveTemplates
    {
        /**
         * <p>A registered responsive template. Passed to the template events and callbacks.</p>
         */
        type Template = {
            /** <p>The template element.</p> */
            element: HTMLElement;
            /** <p>The place-holder elements inside the template.</p> */
            placeHolders: HTMLElement[];
            /** <p>Space separated list of css sources loaded when the template is active.</p> */
            css: string;
            /** <p>Space separated list of javascript sources loaded when the template is active.</p> */
            js: string;
            /** <p>The callbacks specified when the template was added.</p> */
            callbacks: componyx.responsiveTemplates.TemplateCallbacks;
            /** <p>The media query list linked to the template, when a media query was specified.</p> */
            mediaQuery?: MediaQueryList;
            /** <p>A value indicating if all template sources have been loaded.</p> */
            sourcesLoaded?: boolean;
            /** <p>The script and link tags added for the template sources.</p> */
            tags?: HTMLElement[];
        };
        /**
         * <p>Optional template callbacks. The template is passed as first argument to all callbacks.</p>
         */
        type TemplateCallbacks = {
            /** <p>Called when a template is activated.</p> */
            onActivate?: (template: componyx.responsiveTemplates.Template) => any;
            /** <p>Called when a template is deactivated.</p> */
            onDeactivate?: (template: componyx.responsiveTemplates.Template) => any;
            /** <p>Called when a JS or CSS source is loaded. The source is passed as second argument.</p> */
            onLoadSrc?: (template: componyx.responsiveTemplates.Template, src: string) => any;
            /** <p>Called when all JS and CSS sources have been loaded.</p> */
            onLoadComplete?: (template: componyx.responsiveTemplates.Template) => any;
            /** <p>Called when the media query of the template changes its match state, before the template is activated or deactivated.</p> */
            onMatchMediaChange?: (template: componyx.responsiveTemplates.Template) => any;
        };
        /**
         * <p>Defines if responsive design templates are automatically detected when the DOM is ready.</p>
         */
        var autoDetect: boolean;
        /**
         * <p>The id of the template to load at startup.</p>
         */
        var launchTemplateId: string | null;
        /**
         * <p>The id of the template to load when media queries are not supported/used.</p>
         */
        var fallbackTemplateId: string | null;
        /**
         * <p>Current active template.</p>
         */
        var activeTemplate: componyx.responsiveTemplates.Template | null;
        /**
         * <p>Event which fires when the view templates have been detected and initialized. Handlers receive no arguments.</p>
         */
        var onPostDetect: componyx.library.Event<() => any>;
        /**
         * <p>Event which fires when a <code>matchMedia</code> query changes its match state (e.g., from matching to non-matching or vice versa), before the template is activated or deactivated. Handlers receive the template of the media query.</p>
         */
        var onMatchMediaChange: componyx.library.Event<(template: componyx.responsiveTemplates.Template) => any>;
        /**
         * <p>Event which fires when a view template is activated. Handlers receive the activated template.</p>
         */
        var onActivate: componyx.library.Event<(template: componyx.responsiveTemplates.Template) => any>;
        /**
         * <p>Event which fires when a view template is deactivated. Handlers receive the deactivated template.</p>
         */
        var onDeactivate: componyx.library.Event<(template: componyx.responsiveTemplates.Template) => any>;
        /**
         * <p>Event which fires when a single template resource is loaded. Handlers receive the loaded source.</p>
         */
        var onLoadSrc: componyx.library.Event<(src: string) => any>;
        /**
         * <p>Event which fires when all template resources have been loaded. Handlers receive no arguments.</p>
         */
        var onLoadComplete: componyx.library.Event<() => any>;
        /**
         * <p>Detects and initializes responsive design templates on the page.</p>
         */
        function detect(): Promise<void>;
        /**
         * <p>Adds a responsive template which can be linked to the specified media query.</p>
         * @param templateId - <p>The id of the DOM Element which will act as responsive design template.</p>
         * @param mediaQuery - <p>The media query (or comma separated list) which is linked to the responsive design template.</p>
         * @param css - <p>Space separated list of css sources to load when the responsive design template is active.</p>
         * @param js - <p>Space separated list of javascript sources to load when the responsive design template is active.</p>
         * @param callbacks - <p>An object containing optional callback functions. The template is passed as first argument to all callbacks.</p>
         */
        function add(templateId: string, mediaQuery: string, css: string, js: string, callbacks: componyx.responsiveTemplates.TemplateCallbacks): Promise<void>;
        /**
         * <p>Activates the responsive template with the specified id.</p>
         * @param templateId - <p>The id of the DOM Element which will act as responsive design template.</p>
         */
        function activate(templateId: string): Promise<void>;
        /**
         * <p>Deactivates the responsive template with the specified id.</p>
         * @param templateId - <p>The id of the DOM Element which will act as responsive design template.</p>
         */
        function deactivate(templateId: string): Promise<void>;
    }
}