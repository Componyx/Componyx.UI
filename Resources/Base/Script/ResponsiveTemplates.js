/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(async function (window)
{
    let _attr =
    {
        placeHolderId: 'placeholderid',
        css: 'css',
        js: 'js',
        onPostDetect: 'onPostDetect',
        onMatchMediaChange: 'onMatchMediaChange',
        onActivate: 'onActivate',
        onDeactivate: 'onDeactivate',
        onLoadSrc: 'onLoadSrc',
        onLoadComplete: 'onLoadComplete'
    },
        _templates = {},
        _placeHolders = {},
        _activeElement;

    $lib.each(_attr, function (v, k) { _attr[k] = 'data-rsp-template-' + k.toLowerCase(); }); // create correct attribute keys with 'data-rsp-template' prefix
    _attr.template = 'data-rsp-template'; // defines a template element

    /**
    * componyx.responsiveTemplates HTML data-attributes.
    * @typedef {Object} HTML_Attributes
    * @memberof componyx.responsiveTemplates
    * @property {String} ["data-rsp-template-placeHolderId"]            - a place-holder element for moving content between templates.
    * @property {String} ["data-rsp-template-css"]                     - css resources (space-delimited) that should be loaded when the template is activated.
    * @property {String} ["data-rsp-template-js"]                      - js resources (space-delimited) that should be loaded when the template is activated
    * @property {String} ["data-rsp-template-onPostDetect"]            - method which is invoked when the view templates have been detected and initialized.
    * @property {String} ["data-rsp-template-onMatchMediaChange"]      - method which is invoked when a `matchMedia` query changes its match state (e.g., from matching to non-matching or vice versa).
    * @property {String} ["data-rsp-template-onActivate"]              - method which is invoked when a template is activated.
    * @property {String} ["data-rsp-template-onDeactivate"]            - method which is invoked when a template is deactivated.
    * @property {String} ["data-rsp-template-onLoadSrc"]               - method which is invoked when a single template resource is loaded.
    * @property {String} ["data-rsp-template-onLoadComplete"]          - method which is invoked when all template resources have been loaded.
    */

    /**
     * A registered responsive template. Passed to the template events and callbacks.
     * @typedef {Object} Template
     * @memberof componyx.responsiveTemplates
     * @property {HTMLElement} element - The template element.
     * @property {HTMLElement[]} placeHolders - The place-holder elements inside the template.
     * @property {String} css - Space separated list of css sources loaded when the template is active.
     * @property {String} js - Space separated list of javascript sources loaded when the template is active.
     * @property {Object} callbacks - The callbacks specified when the template was added.
     * @property {MediaQueryList} [mediaQuery] - The media query list linked to the template, when a media query was specified.
     * @property {Boolean} [sourcesLoaded] - A value indicating if all template sources have been loaded.
     * @property {HTMLElement[]} [tags] - The script and link tags added for the template sources.
     */

    /**
     * Enables responsive templates based on media-queries defined through HTML data-attributes.
     * Event handlers are invoked with window as context and receive the arguments described per event.
     * @namespace componyx.responsiveTemplates
     * @memberof componyx
     */
    const rspTemplates = componyx.responsiveTemplates =
    {
        /** Defines if responsive design templates are automatically detected when the DOM is ready.
         * @type {Boolean}
         */
        autoDetect: true,

        /** The id of the template to load at startup.
         * @type {String|null}
         */
        launchTemplateId: null,

        /** The id of the template to load when media queries are not supported/used.
         * @type {String|null}
         */
        fallbackTemplateId: null,

        /** Current active template.
         * @type {componyx.responsiveTemplates.Template|null}
         */
        activeTemplate: null,

        /** Event which fires when the view templates have been detected and initialized. Handlers receive no arguments.
         * @type {componyx.library.Event}
         */
        onPostDetect: $lib.createEvent('onPostDetect'),

        /** Event which fires when a `matchMedia` query changes its match state (e.g., from matching to non-matching or vice versa), before the template is activated or deactivated. Handlers receive the template of the media query.
         * @type {componyx.library.Event}
         * @see {@link componyx.responsiveTemplates.Template}
         */
        onMatchMediaChange: $lib.createEvent('onMatchMediaChange'),

        /** Event which fires when a view template is activated. Handlers receive the activated template.
         * @type {componyx.library.Event}
         * @see {@link componyx.responsiveTemplates.Template}
         */
        onActivate: $lib.createEvent('onActivate'),

        /** Event which fires when a view template is deactivated. Handlers receive the deactivated template.
         * @type {componyx.library.Event}
         * @see {@link componyx.responsiveTemplates.Template}
         */
        onDeactivate: $lib.createEvent('onDeactivate'),

        /** Event which fires when a single template resource is loaded. Handlers receive the loaded source (String).
         * @type {componyx.library.Event}
         */
        onLoadSrc: $lib.createEvent('onLoadSrc'),

        /** Event which fires when all template resources have been loaded. Handlers receive no arguments.
         * @type {componyx.library.Event}
         */
        onLoadComplete: $lib.createEvent('onLoadComplete'),

        /** 
        * Detects and initializes responsive design templates on the page.
        */
        detect: async function ()
        {
            let templates = $lib(function (el) { return (el.hasAttribute(_attr.template) && el.id) }, document.body, 'div section'),
                postDetect;

            _templates = {};
            _placeHolders = {};
            _activeElement = null;

            $lib.each(templates, function (t)
            {
                rspTemplates.add(t.id, t.getAttribute(_attr.template), t.getAttribute(_attr.css), t.getAttribute(_attr.js),
                    {
                        onMatchMediaChange: getHandler(t.getAttribute(_attr.onMatchMediaChange)),
                        onActivate: getHandler(t.getAttribute(_attr.onActivate)),
                        onDeactivate: getHandler(t.getAttribute(_attr.onDeactivate)),
                        onLoadSrc: getHandler(t.getAttribute(_attr.onLoadSrc)),
                        onLoadComplete: getHandler(t.getAttribute(_attr.onLoadComplete))
                    });

                postDetect = getHandler(t.getAttribute(_attr.onPostDetect));

                if (postDetect)
                    postDetect();
            });

            rspTemplates.onPostDetect.fire(window);
        },

        /** 
        * Adds a responsive template which can be linked to the specified media query.
        * 
        * @param {String} templateId The id of the DOM Element which will act as responsive design template.
        * @param {String} mediaQuery The media query (or comma separated list) which is linked to the responsive design template.
        * @param {String} css Space separated list of css sources to load when the responsive design template is active.
        * @param {String} js Space separated list of javascript sources to load when the responsive design template is active.
        * @param {Object} callbacks An object containing optional callback functions. The template is passed as first argument to all callbacks.
        * @param {Function} [callbacks.onMatchMediaChange] Called when the media query changes its match state, before the template is activated or deactivated.
        * @param {Function} [callbacks.onActivate] Called when a template is activated. 
        * @param {Function} [callbacks.onDeactivate] Called when a template is deactivated. 
        * @param {Function} [callbacks.onLoadSrc] Called when a JS or CSS source is loaded. The source (String) is passed as second parameter.
        * @param {Function} [callbacks.onLoadComplete] Called when all JS and CSS sources have been loaded. 
        */
        add: async function (templateId, mediaQuery, css, js, callbacks)
        {
            let template = $lib('#' + templateId),
                placeHolders = getPlaceHolders($lib('#' + templateId)),
                qry;

            _templates[templateId] = { element: template, placeHolders: placeHolders, css: $lib.trim(css) || "", js: $lib.trim(js) || "", callbacks: callbacks };
            rspTemplates.deactivate(templateId);

            if (mediaQuery && window.matchMedia)
            {
                qry = window.matchMedia(mediaQuery);
                qry.addEventListener('change', async function (e) { await matchMediaChange(e.target, templateId) });

                _templates[templateId].mediaQuery = qry;

                if (($lib.isEmpty(rspTemplates.launchTemplateId) && qry.matches) || (rspTemplates.launchTemplateId === templateId))
                    rspTemplates.activate(templateId);
            }
            else if (rspTemplates.launchTemplateId === templateId)
                rspTemplates.activate(templateId);
            else if (rspTemplates.fallbackTemplateId === templateId)
                rspTemplates.activate(templateId);
        },

        /** 
        * Activates the responsive template with the specified id.
        * 
        * @param {String} templateId The id of the DOM Element which will act as responsive design template.
        */
        activate: async function (templateId)
        {
            let template = _templates[templateId],
                templatePlaceHolder = $lib('#' + templateId);

            rspTemplates.activeTemplate = template;

            // replace placeholder with original template
            templatePlaceHolder.parentNode.replaceChild(template.element, templatePlaceHolder);
            template.element.style.display = '';

            $lib.each(template.placeHolders, function (target)
            {
                let id = target.getAttribute(_attr.placeHolderId),
                    source;

                if ($lib.isEmpty(target.id))
                {
                    source = getActivePlaceHolder(id);
                    target.id = id; // only a placeholder of the active template has an id
                    source.removeAttribute('id');

                    $lib.appendChildren(source, target);
                    _placeHolders[id] = target;
                }
            });

            if (_activeElement && document.body.contains(_activeElement))
                _activeElement.focus();

            await call(template, 'onActivate');
            rspTemplates.onActivate.fire(window, [template]);

            if (template.sourcesLoaded)
                toggleSources(template, false);
            else if (template.js || template.css)
                registerSources(templateId);
        },

        /** 
        * Deactivates the responsive template with the specified id.
        * 
        * @param {String} templateId The id of the DOM Element which will act as responsive design template.
        */
        deactivate: async function (templateId)
        {
            let template = _templates[templateId],
                templatePlaceHolder = document.createElement('div');

            _activeElement = document.activeElement;

            if (!template.element.parentNode)
                return;

            // remove the original template but keep a placeholder on the page so that when the template is activated it has the same position in the DOM tree
            templatePlaceHolder.id = templateId;
            templatePlaceHolder.style.display = 'none';
            template.element.parentNode.replaceChild(templatePlaceHolder, template.element);

            toggleSources(template, true);

            if (rspTemplates.activeTemplate === template) // another template may already have been activated
                rspTemplates.activeTemplate = null;

            await call(template, 'onDeactivate');
            rspTemplates.onDeactivate.fire(window, [template]);
        }
    }

    function getHandler(name)
    {
        if (!name)
            return null;

        let contextTree = name.split('.'), length = contextTree.length, context = window, method;

        $lib.each(contextTree, function (name, index)
        {
            method = context[name];

            if (index != length - 1)
                context = context[name];
        });

        return method;
    }

    function getPlaceHolders(template)
    {
        let placeHolders = $lib(function (el) { return (el.hasAttribute(_attr.placeHolderId)) }, template);

        $lib.each(placeHolders, function (el)
        {
            if (!$lib.isEmpty(el.id))
                _placeHolders[el.id] = el;
        });

        return placeHolders;
    }

    function getActivePlaceHolder(id)
    {
        if (_placeHolders[id])
            return _placeHolders[id];

        return _placeHolders[id] = $lib('#' + id);
    }

    async function matchMediaChange(qry, templateId)
    {
        let template = _templates[templateId];

        await call(template, 'onMatchMediaChange');
        rspTemplates.onMatchMediaChange.fire(window, [template]);

        if (qry.matches)
            rspTemplates.activate(templateId);
        else
            rspTemplates.deactivate(templateId);
    }

    async function registerSources(templateId)
    {
        let template = _templates[templateId],
            js = (template.js) ? template.js.split(/\s+/) : [],
            css = (template.css) ? template.css.split(/\s+/) : [],
            length = js.length + css.length,
            srcLoaded = 0,
            callback = async function (src)
            {
                await call(template, 'onLoadSrc', [src]);
                rspTemplates.onLoadSrc.fire(window, [src]);

                if (length == srcLoaded)
                {
                    template.sourcesLoaded = true;
                    await call(template, 'onLoadComplete');
                    rspTemplates.onLoadComplete.fire(window);
                }
            };

        template.tags = []; // keep the added tags so they can be toggled when the template is (de)activated

        $lib.each(js, function (src)
        {
            template.tags.push($lib.addScriptSource(src, '', { onComplete: function () { ++srcLoaded; callback(src); } }));
        });

        $lib.each(css, function (src)
        {
            template.tags.push($lib.addCssSource(src, '', { onComplete: function () { ++srcLoaded; callback(src); } }));
        });
    }

    function toggleSources(template, disable)
    {
        $lib.each(template.tags || [], function (tag)
        {
            if (tag && tag.nodeName === 'LINK') // only stylesheets can be disabled, an executed script cannot be undone
                tag.disabled = disable;
        });
    }

    async function call(template, name, args)
    {
        args = args || [];

        if (template.callbacks && template.callbacks[name])
        {
            args.unshift(template);
            // Use await to ensure that async handlers are handled properly
            await template.callbacks[name].apply(window, args);
        }
    }

    $lib.ready(function ()
    {
        // detect templates when DOM is ready
        if (rspTemplates.autoDetect)
            rspTemplates.detect();
    });

})(window);