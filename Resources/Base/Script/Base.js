/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

/** 
* componyx.UI ($UI) Contains global helper methods for UI components.
* @namespace UI
* @memberof componyx
*/
componyx.UI = {};

/** 
* @ignore
*/
globalThis.$UI = componyx.UI;

/**
 * @namespace base
 * @memberof componyx.UI
 */
componyx.UI.base = {};

(function (window)
{
    var _initComponent = {},
        _renderCount = 0, _isDetectAwaiting, _isBusy, _readyTimerId,
        _dataAttr = 'data-ui-', _dataTemplate = _dataAttr + 'template', _dataContentFrom = _dataAttr + 'contentfrom',
        _dataSettings = _dataAttr + 'settings', _dataSettingsId = _dataAttr + 'settingsid', _dataCloneable = _dataAttr + 'cloneable', _dataInterpolate = _dataAttr + 'interpolate', _dataType = _dataAttr + 'type',
        _dataAction = _dataAttr + 'action', _dataGroup = _dataAttr + 'group',
        _baseEventProto = Object.getPrototypeOf($lib.createEvent('')),
        _eventPrototype = Object.create(_baseEventProto),
        _namespace = 'componyx.UI.',
        _customTagPrefix = 'cui-',
        _cssClassHidden = 'hidden',
        _detected = Symbol('detected'),
        _settings = {},
        _addVersion = function (src)
        {
            if (!$UI.version || src.indexOf('?v=') > -1 || src.indexOf('&v=') > -1)
                return src;

            var version = 'v=' + $UI.version;
            return (src.indexOf('?') > -1) ? src + '&' + version : src + '?' + version;
        },
        _getObj = function (namespace)
        {
            var obj = window;
            for (var index = 0; index < namespace.length; ++index)
            {
                obj = obj[namespace[index]];
            }

            return obj;
        },
        _postRenderEvent = (function (eventName) 
        {
            var proto = Object.create(_baseEventProto);

            proto.fire = function () 
            {
                if (_renderCount !== 0)
                    return;

                if (_isDetectAwaiting) // reschedule                 
                {
                    _readyTimerId = setTimeout(this.fire.bind(this));
                    return;
                }

                _isBusy = false;
                return _baseEventProto.fire.call(this, null, []);
            };

            function Fn() 
            {
                this.eventName = eventName;
            }

            Fn.prototype = proto;
            return new Fn();
        })('onPostRender'),

        _getMethod = function (name)
        {
            if ($lib.isEmpty(name) || typeof name !== 'string')
                return name;

            name = name.trim();

            const match = name.match(/^([\w$.]+)\((.*)\);?$/);

            let argString = null;
            if (match)
            {
                name = match[1];
                argString = match[2].trim();
            }

            // Resolve function reference
            let obj = window;
            for (const part of name.split('.'))
            {
                obj = obj?.[part];
                if (!obj) return null;
            }

            if (typeof obj !== 'function')
                return obj;

            if (!match || !argString)
                return obj;

            // Split arguments by comma, naive (does not handle nested commas)
            let paramList = [];
            if (argString)
                paramList = argString.split(',').map(s => s.trim());

            // Return a wrapper that maps static and runtime args
            return (...runtimeArgs) =>
            {
                const finalArgs = paramList.map((p, i) =>
                {
                    try
                    {
                        // Single-quoted string literal: 'text' normalize to valid JSON before parsing
                        if (p.length >= 2 && p[0] === "'" && p[p.length - 1] === "'")
                        {
                            const inner = p.slice(1, -1)
                                .replace(/\\'/g, "'")   // unescape \' back to '
                                .replace(/"/g, '\\"');  // escape any literal " so JSON.parse doesn't choke
                            p = '"' + inner + '"';
                        }

                        return JSON.parse(p); // static JSON literal
                    }
                    catch
                    {
                        return runtimeArgs[i]; // reference to runtime argument
                    }
                });
                return obj(...finalArgs);
            };
        },

        /**
         * creates a new Base Event
         * @function _createEvent
         * @param {String} eventName
         * @returns {componyx.UI.base.Event}
         * @ignore
         */
        _createEvent = function (eventName)
        {
            var fn = function ()
            {
                this.eventName = eventName;
            }

            fn.prototype = _eventPrototype;
            return new fn();
        },

        /**
        * Represents a UI event used throughout the componyx.UI.base framework.
        * This event type is based on and compatible with {@link componyx.library.Event}, but may have an internal prototype chain or additional behaviors specific to the UI framework.
        * Event handlers receive the component instance (sender) as first argument and the event arguments as second argument.
        * The event arguments are described by the type in the @see tag of the event, if any.
        * @typedef {componyx.library.Event} componyx.UI.base.Event
        * @memberof componyx.UI.base
        * @see {@link componyx.library.Event}
        */

        /**
        * @typedef {Object} componyx.UI.base.EventArgs
        * @property {componyx.UI.base.Component|componyx.UI.base.WebComponent} component - The component instance.
        */

        /**
         * @typedef {Object} componyx.UI.base.PreRenderEventArgs
         * @property {componyx.UI.base.Component|componyx.UI.base.WebComponent} component - The component instance.
         * @property {Object} eventArgs - The event object containing more detailed information about the event.
         * @property {Boolean} eventArgs.cancel - Set to true to cancel the render.
         */

        /**
         * @typedef {Object} componyx.UI.base.TemplateEventArgs
         * @property {componyx.UI.base.Component|componyx.UI.base.WebComponent} component - The component instance.
         * @property {Object} eventArgs - The event object containing more detailed information about the event.
         * @property {String} eventArgs.id - The template id.
         * @property {HTMLElement} eventArgs.template - The template element.
         * @property {HTMLElement} eventArgs.element - The element to which the template content is added.
         * @property {Object|Object[]} eventArgs.values - The template replacement values.
         * @property {Function} [eventArgs.matchHandler] - The callback method for the template replacement values.
         */

        /**
         * @typedef {Object} componyx.UI.base.AjaxEventArgs
         * @property {componyx.UI.base.Component|componyx.UI.base.WebComponent} component - The component instance.
         * @property {Object} eventArgs - The XHR arguments as passed to the componyx.library.XhrCallback. Any callArgs passed to ajaxCall follow as additional handler parameters.
         */

        /**
         * @typedef {Object} componyx.UI.base.ClickEventArgs
         * @property {componyx.UI.base.Component|componyx.UI.base.WebComponent} component - The component instance.
         * @property {MouseEvent} eventArgs - The original click event.
         */

        /**
         * Base component events.
         * @class Events
         * @memberof componyx.UI.base
         * @property {Function} dispose                                  - Removes all event handlers.
         * @property {componyx.UI.base.Event} onPreRender             - Event which fires before the component is rendered. @see {@link componyx.UI.base.PreRenderEventArgs}
         * @property {componyx.UI.base.Event} onPostRender            - Event which fires after the component is rendered. @see {@link componyx.UI.base.EventArgs}
         * @property {componyx.UI.base.Event} onShow                  - Event which fires when the component is shown. @see {@link componyx.UI.base.EventArgs}
         * @property {componyx.UI.base.Event} onHide                  - Event which fires when the component is hidden. @see {@link componyx.UI.base.EventArgs}
         * @property {componyx.UI.base.Event} onDestroy               - Event which fires when the component is destroyed. @see {@link componyx.UI.base.EventArgs}
         * @property {componyx.UI.base.Event} onPreApplyTemplate      - Event which fires before a template is applied. @see {@link componyx.UI.base.TemplateEventArgs}
         * @property {componyx.UI.base.Event} onPostApplyTemplate     - Event which fires after a template is applied. @see {@link componyx.UI.base.TemplateEventArgs}
         * @property {componyx.UI.base.Event} onAjaxStart             - Event which fires before an ajax method call. @see {@link componyx.UI.base.AjaxEventArgs}
         * @property {componyx.UI.base.Event} onAjaxComplete          - Event which fires after an ajax method call. @see {@link componyx.UI.base.AjaxEventArgs}
         * @property {componyx.UI.base.Event} onAjaxSuccess           - Event which fires when an ajax method response has httpstatus >= 200 & < 300 or 304. @see {@link componyx.UI.base.AjaxEventArgs}
         * @property {componyx.UI.base.Event} onAjaxError             - Event which fires when an ajax method response does not have an http success status code. @see {@link componyx.UI.base.AjaxEventArgs}
         * @property {componyx.UI.base.Event} onAjaxProgress          - Event which fires periodically while downloading data. @see {@link componyx.UI.base.AjaxEventArgs}
         * @property {componyx.UI.base.Event} onAjaxUploadProgress    - Event which fires periodically while uploading data. @see {@link componyx.UI.base.AjaxEventArgs}
         * @property {componyx.UI.base.Event} onAjaxUploadError       - Event which fires when an upload failed. @see {@link componyx.UI.base.AjaxEventArgs}
         * @property {componyx.UI.base.Event} onAjaxAbort             - Event which fires when a running ajax call is aborted. @see {@link componyx.UI.base.AjaxEventArgs}
         * @property {componyx.UI.base.Event} onClick                 - Event which fires when the component is clicked. @see {@link componyx.UI.base.ClickEventArgs}
         */
        _baseEvents = function ()
        {
            this.dispose = function (eventPriority)
            {
                for (var name in this)
                {
                    if (this[name].priorityRemove)
                        this[name].priorityRemove(eventPriority);
                }
            }
            this.onPreRender = $base.static.createEvent('onPreRender');
            this.onPostRender = $base.static.createEvent('onPostRender');
            this.onShow = $base.static.createEvent('onShow');
            this.onHide = $base.static.createEvent('onHide');
            this.onDestroy = $base.static.createEvent('onDestroy');
            this.onPreApplyTemplate = $base.static.createEvent('onPreApplyTemplate');
            this.onPostApplyTemplate = $base.static.createEvent('onPostApplyTemplate');
            this.onAjaxStart = $base.static.createEvent('onAjaxStart');
            this.onAjaxComplete = $base.static.createEvent('onAjaxComplete');
            this.onAjaxSuccess = $base.static.createEvent('onAjaxSuccess');
            this.onAjaxError = $base.static.createEvent('onAjaxError');
            this.onAjaxProgress = $base.static.createEvent('onAjaxProgress');
            this.onAjaxUploadProgress = $base.static.createEvent('onAjaxUploadProgress');
            this.onAjaxUploadError = $base.static.createEvent('onAjaxUploadError');
            this.onAjaxAbort = $base.static.createEvent('onAjaxAbort');
            this.onClick = $base.static.createEvent('onClick');
        },

        _baseProperties = function ()
        {
            let instance = this;
            this.beforeElement = null;
            this.name = null;
            this.theme = null;
            this.themeName = null;
            this.cssClass = '';
            this.cssClassTouch = 'touch';
            this.autoTouchConfig = true;
            this.cloneInput = false;
            this.keepInputId = true;
            this.keepInputEventHandlers = false;
            this.disableDefaultCssClass = false;
            this.renderState = $base.static.RenderState.NONE;
            this.element = null;
            this.showing = false;
            this.allowPostRender = true;
            this.renderWhenConnected = false;
            this.ignoreConnectionCallbacks = false;
            this.canRender = true;
            this.templates = new Map();
            this.store = [];
            this.observing = false;
            this.attributeObserver = null;
            this.removalObserver = null;
            this.__suppressNextChangeEvent = false;
            this.__hidden = true;
            this.__ajax = {};
            this.__createdTemplates = {};
            this.__focus = false;

            this.ajax =
            {
                url: '',
                absoluteURL: true,
                headers: null,
                jsonResponseDataWrapper: 'd',
                jsonDeserializer: null,
                load: new $base.static.AjaxMethod(instance),

                addMethod: function (name)
                {
                    if (this[name] == null)
                        this[name] = new $base.static.AjaxMethod(instance);
                    else
                    {
                        var settings = this[name];
                        this[name] = new $base.static.AjaxMethod(instance);
                        $lib.clone(this[name], settings, true, true, true);
                    }
                }
            }
        },

        _getGroupTagSettings = function (el)
        {
            let settings = _getAttribute(el, _dataSettings);

            if (!$lib.isEmpty(settings))
            {
                _removeAttribute(el, _dataSettings);

                if (settings.indexOf('{') != 0)
                    settings = '{' + settings + '}';

                return window.JSON.parse(settings);
            }

            return null;
        },

        _getComponentTagSettings = function (el)
        {
            if (el[_detected])
                return;

            let settings = _getAttribute(el, _dataSettings),
                settingsId = _getAttribute(el, _dataSettingsId),
                obj = (settingsId) ? _settings[settingsId] : null;

            if (!$lib.isEmpty(settings))
            {
                _removeAttribute(el, _dataSettings); // we remove JSON attribute to free up memory, but settings can still be re-applied via the settingsId reference or individual ui- attributes

                if (settings.indexOf('{') != 0)
                    settings = '{' + settings + '}';

                var settingsObj = window.JSON.parse(settings);

                if (obj)
                    obj = $lib.clone(settingsObj, obj, true, false);
                else
                    obj = settingsObj;
            }

            return obj;
        },
        _getAttribute = (el, name) => el.getAttribute(name) || el.getAttribute(name.slice(5)),
        _hasAttribute = (el, name) => el.hasAttribute(name) || el.hasAttribute(name.slice(5)),
        _removeAttribute = (el, name) => { el.removeAttribute(name); el.removeAttribute(name.slice(5)); },
        _toCamelCase = (str) => { return str.replace(/-([a-z0-9])/gi, (match, char) => char.toUpperCase()); },
        _getPropertyName = (attrName) =>
        {
            let name = attrName.startsWith(_dataAttr) ? attrName.split('-').slice(2).join('-') : attrName.startsWith(_dataAttr.slice(5)) ? attrName.split('-').slice(1).join('-') : attrName; // remove prefix data-ui- or ui-
            return _toCamelCase(name);
        },
        _getDataAttributes = (el) =>
        {
            return Array.from(el.attributes)
                .filter(a =>
                {
                    const name = a.name.toLowerCase();
                    return name.startsWith(_dataAttr) || name.startsWith(_dataAttr.slice(5)); // data-ui- or ui-
                }).map(a => ({ name: a.name.toLowerCase(), value: a.value }));
        },
        _initDataAttributes = function (id, el)
        {
            const init = _initComponent[id] = _initComponent[id] || {},
                attrs = _getDataAttributes(el);

            init.attrs = init.attrs || {};

            // remove attributes that no longer exist on the element
            for (const name in init.attrs)
            {
                if (!attrs.some(a => a.name === name))
                {
                    _setPropertyFromAttribute.call(this, el, name, "");
                    delete init.attrs[name];
                }
            }

            attrs.forEach(attr =>
            {
                _setPropertyFromAttribute.call(this, el, attr.name, attr.value);
                init.attrs[attr.name] = attr.value;
            });
        },
        _setPropertyFromAttribute = function (element, name, value, remove = false)
        {
            if (value === null || element === null)
                return;

            const isCustomAttr = name.startsWith(_dataAttr) || name.startsWith(_dataAttr.slice(5));
            if (!isCustomAttr)
                return;

            let propName = _getPropertyName(name),
                prop = this[propName],
                restoreObserver = false,
                changed = false,
                newValue = {};

            if (prop === undefined)
                return;

            if (remove)
                element.removeAttribute(name);

            if (propName === 'settingsid')
                value = _settings[value];

            if (this.observing && this.attributeObserver)
            {
                restoreObserver = true;
                this.observing = false;
            }

            if (value === '')
            {
                if (Array.isArray(prop))
                {
                    newValue[propName] = [];
                }
                else if (prop && typeof prop === 'object')
                {
                    newValue[propName] = {};
                }
                else if (typeof prop === 'string')
                {
                    newValue[propName] = '';
                }
                else
                {
                    newValue[propName] = null;
                }
            }
            else
            {
                switch (typeof prop)
                {
                    case 'boolean':
                        newValue[propName] = (value === 'true');
                        break;

                    case 'number':
                        newValue[propName] = parseFloat(value);
                        break;

                    case 'object':
                        try
                        {
                            const trimmed = value.trim();
                            let parsed, isJson = true;

                            try
                            {
                                parsed = JSON.parse(trimmed);
                            }
                            catch (parseError)
                            {
                                isJson = false;
                            }

                            if (prop === null && !isJson)
                            {
                                newValue[propName] = value;
                                break;
                            }

                            if (propName === 'settings')
                            {
                                const settings = isJson ? parsed : JSON.parse('{' + trimmed + '}');

                                for (let key in settings)
                                {
                                    newValue[key] = settings[key];
                                }
                            }
                            else if (isJson)
                            {
                                newValue[propName] = parsed;
                            }
                        }
                        catch (e)
                        {
                            console.error(`Failed to parse JSON for ${name}:`, e);
                            throw e;
                        }
                        break;

                    default:
                        newValue[propName] = value;
                        break;
                }
            }

            // Apply new values
            if (Object.keys(newValue).length > 0)
                changed = this.cloneProperties(newValue);

            if (restoreObserver)
                setTimeout(() => { this.observing = true; }, 0);

            return changed;
        },
        _createGroup = function (groupId)
        {
            if (!$UI.groupStore[groupId])
                $UI.groupStore[groupId] = { items: [], exclude: [] };
        },
        _getComponentType = function (el)
        {
            if (el.__uiDetected)
                return null;

            let tag = el.tagName.toLowerCase(), type;

            if (tag.startsWith(_customTagPrefix.toLowerCase()))
            {
                type = tag.substr(_customTagPrefix.length);
                type = type
                    .split(/[\-]+/)
                    .map(x => x.charAt(0).toUpperCase() + x.slice(1)) // capitalize each first letter (masked-text-box to MaskedTextBox)
                    .join('');
            }
            else if (_hasAttribute(el, _dataType))
            {
                type = _getAttribute(el, _dataType);
            }
            else
                return null;

            if (type.split('.').length == 1)
                type = _namespace + type;

            el.__uiDetected = true; // set temporary flag to prevent retecting the component while already being processed

            return type;
        },
        _monkeyPatch = function (target, src, fn)
        {
            if (src[fn])
                target[fn] = function (fn, org, args) { org[fn](args); src[fn](args); }.bind(this, fn, target[fn]);
        },
        _detect = function (templateId)
        {
            var instance = this;

            if (!instance.__createdTemplates[templateId])
                return;

            const containers = instance.__createdTemplates[templateId].containers;
            delete instance.__createdTemplates[templateId];

            if (!instance.element)
                return;

            containers.forEach(container =>
            {
                if (container?.isConnected)
                    $UI.detect(container);
            });
        };

    /**
    * A list of supported UI component HTML data-attributes.
    * @typedef {Object} HTML_Attributes
    * @memberof componyx.UI.base
    * @property {String} ["data-ui-template"]			- Denotes an element as UI data template with the attribute value as template identifier (e.g. 'Header'). A component can have static templates, like a Header or Footer, and/or dynamic (item) templates.
    * @property {String} ["data-ui-cloneable"]			- Denotes a UI data template as cloneable (true) or non-cloneable (false). A cloneable template is for multiple use and a non-cloneable template is for single use, e.g. a template containing an element with a unique identifier.
    * @property {String} ["data-ui-interpolate"]        - Defines if a search and replace action on the inner HTML of the template will be performed to set the corresponding value for a interpolation tag (e.g. {value}).
    * @property {String} ["data-ui-contentfrom"]		- Sets the id of the HTML element whose content to use.
    * @property {String} ["data-ui-type"]				- The full name of the component type to render, e.g. Componyx.UI.Button.
    * @property {String} ["data-ui-action"]				- Defines if the component is rendered only (render) or rendered and displayed (show).
    * @property {String} ["data-ui-settings"]			- Initializes the component with the settings specified via the JSON formatted attribute value.
    * @property {String} ["data-ui-group"]				- Denotes an element as UI component group with the attribute value as group identifier.
    */


    /** Fires the event. This method should not be invoked by client code directly but only from inside component code.
    * @param {Object} instance The component instance on which initiates the event.
    * @param {Object[]} arguments A list of arguments to pass to the event handlers.
    * @param {Boolean} withInstance A value indicating if the component instance is passed as first argument to the event handler.
    * @name fire
    * @memberof componyx.UI.base.Event#
    * @function
    * @protected
    */
    _eventPrototype.fire = function (instance, args, withInstance) 
    {
        if (args == null)
            args = [];
        else if (!$lib.isArray(args))
            args = [args];

        if (withInstance !== false)
            args.unshift(instance);

        return _baseEventProto.fire.call(this, instance, args);
    };

    componyx.UI.__sourceElements = {};

    /** 
    * When specified, the version is appended to the URL for locating UI CSS & Script resources.
    * @type {String|null}
    * @memberof componyx.UI
    */
    componyx.UI.version = null;

    /** 
    * A value indicating whether UI components are automatically detected when the page is ready.
    * @type {Boolean}
    * @memberof componyx.UI
    */
    componyx.UI.autoDetect = true;

    /** 
    * Holds UI component references by unique id and HTMLElement.
    * @type {Object}
    * @memberof componyx.UI
    */
    componyx.UI.store = {};

    /** 
    * componyx.UI.elementStore Holds UI component references by HTMLElement.
    * @type {Object}
    * @memberof componyx.UI
    */
    componyx.UI.elementStore = new Map()

    /** 
    * componyx.UI.groupStore Holds UI component id's for each unique group.
    * @type {Object}
    * @memberof componyx.UI
    */
    componyx.UI.groupStore = {};

    /** 
    * componyx.UI.scriptResources Contains UI script resources for dynamic loading.
    * @type {Object}
    * @memberof componyx.UI
    */
    componyx.UI.scriptResources = { global: '' };

    /** 
    * componyx.UI.cssResources Contains UI css resources for dynamic loading.
    * @type {Object}
    * @memberof componyx.UI
    */
    componyx.UI.cssResources = { global: [] };

    /**
    * When specified, component resources will be added before this resource element.
    * @type {HTMLElement}
    * @memberof componyx.UI
    */
    componyx.UI.resourcesBefore = null;

    /** 
    * A value indicating if the UI is busy rendering components.
    * @type {Boolean}
    * @readonly
    * @memberof componyx.UI
    */
    Object.defineProperty(componyx.UI, 'busy',
        {
            get: function () { return _isBusy; }
        });

    /**
    * A value indicating if UI components use custom element names.
    * @type {Boolean} 
    * @memberof componyx.UI
    */
    componyx.UI.useCustomElementNames = false;

    /**
    * The CSS theme name which is set on the component's root element. Can be overridden when defined on a component-group or component.
    * @type {String}
    * @memberof componyx.UI
    */
    componyx.UI.themeName = null;

    /**
    * Gets or sets a value indicating if component resources (CSS and scripts) are loaded on demand. Disable when all resources are already included, e.g. with the bundled ui.js and ui.css.
    * @type {Boolean}
    * @memberof componyx.UI
    */
    componyx.UI.onDemandResourceLoading = true;

    /** 
     * Gets or sets the custom tag prefix for UI components. Defaults to 'cui-'.
     * @type {String}
     * @memberof componyx.UI
     */
    Object.defineProperty(componyx.UI, 'tagPrefix', {
        get: () => _customTagPrefix,
        set: value => _customTagPrefix = value
    });

    /** 
    * Sets the relative or absolute path for on-demand loading of component script and css resources.
    * @memberof componyx.UI
    * @param {String} scriptPath The path (relative or absolute root URL) to locate script resources. Use {0} as placeholder for the component name. (e.g. 'scripts/{0}.min.js' or 'http://path/src?d={0}.min.js')
    * @param {String} [cssPath] The path (relative or absolute root URL) to locate css resources. Use {0} as placeholder for the component name. (e.g. 'css/(0).min.css' or 'http://path/src?d={0}.min.css')
    * @param {componyx.UI.base.static.ThemeOption} [theme] The css theme to activate. Is required when a default component theme is used (e.g. ThemeOption.DEFAULT).
    * @param {String} [cssThemePath] The path (relative or absolute root URL) to locate css theme resources. Use {0} as placeholder for the component name. (e.g. 'css/{0}.Themes.Default.css' or 'http://path/src?d={0}.Themes.Default.css')
    */
    componyx.UI.setResourcePath = function (scriptPath, cssPath, theme, cssThemePath)
    {
        var script = $UI.scriptResources,
            css = $UI.cssResources;

        if (scriptPath)
            script.global = scriptPath;

        if (cssPath)
        {
            css.global[0] = cssPath;

            if (theme > $base.static.ThemeOption.BASE)
                css.global[theme] = cssThemePath;
        }
    };

    /**
    * Gets the resource path for on-demand loading of component scripts.
    * @memberof componyx.UI
    * @param {String} name The component name.
    * @returns {string} The script resource path
    */
    componyx.UI.getScriptResourcePath = function (name)
    {
        return _addVersion($UI.scriptResources[name] || $lib.format($UI.scriptResources.global, name));
    };

    /**
    * Gets the resource path for on-demand loading of component CSS.
    * @memberof componyx.UI
    * @param {String} name The component name.
    * @param {componyx.UI.base.static.ThemeOption} [theme=0] The css theme (e.g. ThemeOption.DEFAULT).
    * @returns {string} The css resource path
    */
    componyx.UI.getCssResourcePath = function (name, theme = 0)
    {
        return _addVersion(($UI.cssResources[name] || [])[theme] || $lib.format($UI.cssResources.global[theme], name));
    }

    /**
    * Creates a new component instance.
    * @memberof componyx.UI
    * @param {Function|Constructor|String} componentClass The component class (or name when options.loadScript is set to true).
    * @param {object} properties The properties to initialize the component. Must include the id property.
    * @param {HTMLElement} [element] The element that is the actual component instance (standard web components) or the placeholder element to replace with thew component instance.
    * @param {object} [options] Additional options.
    * @param {boolean} [options.loadScript=false] Indicates whether to load the component script if it is not already loaded. Be aware, this call is awaited!
    * @param {string|null} [options.namespace=null] The namespace to use when resolving the component script. Defaults to `componyx.UI.` if not provided.
    * @returns {object|Promise<object>} A new component instance or a Promise resolving to the new component instance in case of loadScript:true.
    */
    componyx.UI.createComponent = function (componentClass, properties, element, options)
    {
        const { loadScript = false, namespace = _namespace } = options ?? {};

        // If we need to load the script, return a Promise
        if (loadScript)
        {
            return (async () =>
            {
                componentClass = await $UI.loadComponentScript(namespace + componentClass);
                return $UI.createComponent(componentClass, properties, element, { ...options, loadScript: false });
            })();
        }

        let component = $UI.store[properties.id],
            create = (componentClass, properties) =>
            {
                const customTagName = `${_customTagPrefix}${componentClass.name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}`;
                component = document.createElement(customTagName);
                component.id = properties.id;
                component.init(properties);
                return component;
            };

        if (component && component.renderState != $base.static.RenderState.NONE)
            component.destroy();

        if (componentClass.prototype instanceof window.HTMLElement)
        {
            if ($lib.isEmpty(properties.renderWhenConnected))
                properties.renderWhenConnected = false;

            if (element)
            {
                if (!element.nodeName.toLowerCase().startsWith(_customTagPrefix))
                {
                    let templates = [];
                    $lib.each($lib.children(element), function (el)
                    {
                        if (_hasAttribute(el, _dataTemplate))
                            templates.push(el);
                    });

                    component = create(componentClass, properties);

                    $lib.each(templates, function (el)
                    {
                        component.collectTemplate(el);
                    });

                    element.replaceWith(component);
                }
                else
                {
                    component = element;

                    if (properties)
                        component.cloneProperties(properties);
                }

                if (properties?.containerElement && properties.containerElement !== component.parentElement)
                    properties.containerElement.insertBefore(component, properties.beforeElement);
            }
            else
            {
                component = create(componentClass, properties);

                if (properties?.containerElement)
                    properties.containerElement.insertBefore(component, properties.beforeElement);
            }
        }
        else
        {
            component = new componentClass(properties.id, properties);
        }

        return component;
    };

    /**
     * Loads the component script asynchronously by its full type name (including namespace).
     * This method dynamically imports the script file, waits for any module initialization, and returns the component class once it is loaded and available.
     * @param typeName The full name of the component type, including the namespace (e.g. 'componyx.UI.ComboBox').
     * @memberof componyx.UI
     * @returns {Promise<Function>} A Promise resolving to the loaded component class.
     */
    componyx.UI.loadComponentScript = async function (typeName)
    {
        const namespace = typeName.split('.'),
            name = namespace[namespace.length - 1];

        const existing = _getObj(namespace);
        if (existing)
            return existing;

        let src = $UI.getScriptResourcePath(name);
        if (!src.startsWith('/'))
            src = '/' + src;

        // load script file and avoid UI post-render event from firing
        _renderCount++;
        await import(src);

        const moduleContainer = `${name.charAt(0).toLowerCase() + name.slice(1)}_modules`,
            modules = _getObj(namespace.slice(0, -1).concat([moduleContainer]));

        if (modules)
            await modules.loaded;

        _renderCount--;

        return _getObj(namespace);
    }

    /** 
    * Detects and registers on the page defined components and component-groups.
    * @param {HTMLElement} [container] A container element in which the UI components must be detected.
    * @param {Boolean} [overwrite=true] A value indicating to overwrite (recreate) the component element if it already exists.
    * @memberof componyx.UI
    */
    componyx.UI.detect = async function (container, overwrite)
    {
        let track = new Map(), groups = [], removeList = [], createList = [], inputList = [],
            addToInputList = function (el)
            {
                var c = $UI.elementStore.get(el);

                if (c && (c.inputId || c.hiddenInputId) && overwrite)
                    inputList.push(c);
            };

        if ($lib.isEmpty(overwrite))
            overwrite = true;

        // collect component group elements
        $lib(function (el)
        {
            if (_hasAttribute(el, _dataGroup) && !$lib.isEmpty(el.id))
            {
                groups.push(el);
                _createGroup(el.id);
                _removeAttribute(el, _dataGroup);
            }

        }, container, _customTagPrefix + 'group');

        $lib.each(groups, function (groupEl)
        {
            var action = (_getAttribute(groupEl, _dataAction) || '').toLowerCase(),
                exclude = (_getAttribute(groupEl, _dataGroup) || '').replace(/\s/, '').split(','),
                properties = _getGroupTagSettings(groupEl),
                theme, themeName;

            if ($lib.isEmpty(action) && _hasAttribute(groupEl, _dataAction))
                action = "none";

            if (!$lib.isEmpty(properties))
            {
                theme = properties.theme;
                themeName = properties.themeName;
            }

            $lib(function (el, stop)
            {
                if (_hasAttribute(el, _dataGroup))
                    stop();

                let type;
                track.set(el, ''); // track elements

                if ((type = _getComponentType(el)))
                {
                    var id = el.id || (type.toLowerCase() + '_' + $lib.guid()),
                        mustExclude = $lib.indexOf(exclude, el.id) > -1;

                    el.id = id; // set id if it was not already defined

                    if (mustExclude)
                        createList.push([el, type]); // create instance only
                    else
                    {
                        createList.push([el, type, action, theme, themeName]);
                        addToInputList(el);
                    }

                    $UI.addToGroup(groupEl.id, el.id);

                    if ((_getAttribute(el, _dataAction) || '').toLowerCase() === 'clone' || mustExclude)
                        $UI.groupStore[groupEl.id].exclude.push(id); // exclude from render (included when group is destroyed)
                }
            }, groupEl);

            // groups are virtual elements, only keep content
            $lib.unsurround(groupEl);
        });

        // component elements
        $lib(function (el)
        {
            var type;

            if (_hasAttribute(el, _dataTemplate) && _getAttribute(el, _dataCloneable) != 'false')
                $lib(function (child) { track.set(child, ''); }, el); // never render elements that are inside a cloneable template

            if (!track.has(el) && (type = _getComponentType(el)))
            {
                createList.push([el, type]);
                addToInputList(el);
            }

        }, container);

        $lib.each(inputList, function (c) { c.getSourceElement(c.inputId || c.hiddenInputId); }); // this is a precaution to re-cache the input when the id could potentially have changed

        for (const item of createList)
        {
            if ($lib.contains(container || document, item[0]))
                await create(...item);
        }

        $lib.each(removeList, function (el) { $lib.remove(el); }); // remove elements for instantiated components intented for cloning

        return createList;

        async function create(el, type, groupAction, theme, themeName)
        {
            let obj, templates,
                action = (_getAttribute(el, _dataAction) || '').toLowerCase(),
                id = el.id || $lib.guid();

            el.id = id; // set id if it was not already defined
            themeName = themeName || $UI.themeName;

            if (action != "clone")
                action = action || groupAction;

            if ($lib.isEmpty(action) && !_hasAttribute(el, _dataAction))
                action = 'show';

            obj = $UI.store[id];

            if (obj)
            {
                templates = obj.templates;

                if ($lib.isElement(obj))
                {
                    if (obj.renderWhenConnected && obj.renderState) // standard webcomponent type
                    {
                        delete el.__uiDetected;
                        return;
                    }

                    _initDataAttributes.bind(obj)(id, obj);
                }
                else
                {
                    if (obj.element === el && !overwrite)
                    {
                        delete el.__uiDetected;
                        return;
                    }

                    if (action != "clone" && obj.element === el)
                    {
                        var parent = el.parentElement,
                            sibling = el.nextSibling;

                        obj.destroy();
                        parent.insertBefore(el, sibling);
                    }
                    else if (obj.element === el)
                        obj.destroy();
                }
            }

            let namespace = type.split('.');
            let componentClass = _getObj(namespace);

            _isDetectAwaiting = true; // make sure post-render event is not fired too early

            if (componentClass === undefined)
            {
                el[_detected] = true; // mark element as detected so we do not remove settings on the tag if a connectedCallback is triggered
                componentClass = await $UI.loadComponentScript(type);

                if ($UI.store[id] && $lib.isElement($UI.store[id]) && $UI.store[id].renderWhenConnected) // component is directly rendered via connectedCallback
                {
                    _isDetectAwaiting = false;
                    delete el[_detected];
                    delete el.__uiDetected;
                    return;
                }
            }

            await $UI.onPreLoadSettings.fire(el);
            _isDetectAwaiting = false; // ready for post-render event again
            _removeAttribute(el, _dataType); // clear type attribute so component wont be detected again
            el.__uiType = type; // store type on element for later reference (when component is inside template and parent component gets re-rendered)
            delete el[_detected];
            delete el.__uiDetected;

            const properties = _getComponentTagSettings(el) || {};

            if (templates)
                properties.templates = templates;

            if (!$lib.isEmpty(theme))
                properties.theme = theme;

            if (!$lib.isEmpty(themeName))
                properties.themeName = themeName;

            properties.id = id;
            obj = $UI.createComponent(componentClass, properties, el);

            if (!$lib.isElement(obj))
                _initDataAttributes.bind(obj)(id, $lib('#' + id));

            if (componentClass.prototype instanceof window.HTMLElement && obj.renderWhenConnected)
                return;

            if (action == 'clone')
                removeList.push(el); // component element is only intended for cloning
            else if (action == 'render')
                obj.render();
            else if (action == 'show')
                obj.show();
        }
    };

    /** 
    * Adds base settings for a specific component(s).
    * @memberof componyx.UI
    * @param {String} settingsId Identifier of the settings object.
    * @param {Object} settings The settings used to initialize the component.
    */
    componyx.UI.addSettings = function (settingsId, settings)
    {
        _settings[settingsId] = settings;
    };

    /** 
    * Adds a component to a unique group.
    * @memberof componyx.UI
    * @param {String} groupId Unique identifier of the component group.
    * @param {String} componentId Unique identifier of the component.
    */
    componyx.UI.addToGroup = function (groupId, componentId)
    {
        _createGroup(groupId);
        $UI.groupStore[groupId].items.push(componentId);
    };

    /** 
    * Renders all components in the specified group.
    * @memberof componyx.UI
    * @param {String} groupId Unique identifier of the component group.
    * @param {Boolean} [show] A value indicating if the components should be displayed (true by default).
    * @param {String[]} [exclude] A list of component id's inside the group to exclude from rendering.
    * @param {componyx.UI.base.static.ThemeOption} [theme] The active styling theme of the component.
    * @param {String} [themeName] The theme name is appended to the CSS class of the component's root HTMLElement.
    */
    componyx.UI.renderGroup = function (groupId, show, exclude, theme, themeName)
    {
        var group = $UI.groupStore[groupId];

        exclude = exclude || [];

        $lib.each(group.items, function (id)
        {
            var ex = exclude.slice().concat(group.exclude);

            if ($UI.store[id] && (!ex.length || $lib.indexOf(ex, id) == -1))
            {
                var c = $UI.store[id];
                c.theme = ($lib.isEmpty(theme)) ? c.theme : theme;
                c.themeName = ($lib.isEmpty(themeName)) ? c.themeName : themeName;

                if (show == false)
                {
                    if (!c.renderState)
                        c.render();
                }
                else
                    c.show();
            }
        });
    };

    /** 
    * Destroys all components in the specified group.
    * @memberof componyx.UI
    * @param {String} groupId Unique identifier of the component group.
    * @param {Boolean} [removeGroup=false] A value indicating if the group should be removed.
    */
    componyx.UI.destroyGroup = function (groupId, removeGroup)
    {
        $lib.each($UI.groupStore[groupId].items, function (id)
        {
            if ($UI.store[id])
                $UI.store[id].destroy();
        });

        if (removeGroup)
            $UI.removeGroup(groupId);
    };

    /** 
    * Removes the specified group.
    * @memberof componyx.UI
    * @param {String} groupId Unique identifier of the component group.
    */
    componyx.UI.removeGroup = function (groupId)
    {
        delete $UI.groupStore[groupId];
    };

    /** 
    * Destroys all components within the specified container element.
    * @param {HTMLElement} container A container element in which the UI components must be destoyed.
    * @memberof componyx.UI
    */
    componyx.UI.destroy = function (container)
    {
        var remove = [];

        $UI.elementStore.forEach(function (instance, el)
        {
            if ($lib.contains(container, el)) // first detect then remove, otherwise components with child-components could be removed first and therefor they are no longer within container.
                remove.push(instance);
        });

        $.each(remove, function (o)
        {
            o.destroy.bind(o)();
        });
    }

    /**
    * Event which fires before a UI component loads the component tag settings (JSON settings from the attribute data-ui-settings or data-ui-settingsid). Incoming argument is the HTMLElement.
    * @type {componyx.UI.base.Event}
    * @see {@link componyx.UI.base.Event}
    * @memberof componyx.UI
    */
    componyx.UI.onPreLoadSettings = _createEvent('onPreLoadSettings');

    /**
    * Event which fires before a UI component is rendered. Incoming argument is the component instance.
    * @type {componyx.UI.base.Event}
    * @see {@link componyx.UI.base.Event}
    * @memberof componyx.UI
    */
    componyx.UI.onPreRender = _createEvent('onPreRender');

    /**
    * Event which fires when the UI component chain is rendered.
    * @type {componyx.UI.base.Event}
    * @see {@link componyx.UI.base.Event}
    * @memberof componyx.UI
    */
    componyx.UI.onPostRender = _postRenderEvent;

    /**
     * Represents a configurable AJAX method associated with a component or context instance.
     * Used to generate dynamic endpoint URLs and manage request payloads and headers.
     * @typedef {Object} AjaxMethod
     * @memberof componyx.UI.base
     * @property {String} url                                          - The method-specific URL to use. If not set, falls back to `ajax.url`.
     * @property {Boolean} absoluteURL=true                            - If `false`, the URL will be resolved as relative to `location.origin`.
     * @property {String|null} jsonResponseDataWrapper=null            - Optional key to extract response data from (e.g., for .NET-style responses). Falls back to `ajax.jsonResponseDataWrapper`.
     * @property {Function|null} jsonDeserializer=null                 - Optional function to deserialize the JSON response.
     * @property {String} endPointMethod                               - The server-side method name to be appended to the endpoint URL.
     * @property {String|Object} customParameters                      - Additional query parameters or payload to be merged with the request data.
     * @property {Object.<string, string>|null} headers=null           - HTTP headers specific to this method. Overrides global headers in `ajax.headers`.
     */

    /**
     * @typedef {function(string): void} AddAjaxMethod
     * @memberof componyx.UI.base
     * @param {String} name - The method name to create or override.
     */

    /**
    * UI component Base Component class.
    * @class
    * @memberof componyx.UI
    * @property {String} id									                - The unique identifier of the component.
    * @property {HTMLElement} containerElement				                - The parent element of the component's root element.
    * @property {HTMLElement} beforeElement					                - The component's root element will be placed before this node when specified.
    * @property {String} name								                - The name of the component's input field when applicable.
    * @property {componyx.UI.base.static.ThemeOption} theme		        - The active styling theme of the component.
    * @property {String} themeName							                - The CSS theme name which is set on the component's root element.
    * @property {String} cssClass							                - The CSS class of the component's root HTMLElement.
    * @property {String} cssClassTouch						                - The CSS class applied to the component's root HTMLElement when dealing with a touch device.
    * @property {String} style								                - The CSS style text applied to the root HTMLElement of the component.
    * @property {String} title								                - The title of the root element.
    * @property {String} tabIndex							                - The tabindex of the component's root HTMLElement.
    * @property {Boolean} autoTouchConfig=true				                - A value indicating if the component automatically uses optimal touch device settings when rendered on a touch device.
    * @property {Boolean} cloneInput=false					                - A value indicating if the source input is cloned when a (hidden)input is used as base element.
    * @property {Boolean} keepInputId=true				                    - A value indicating if the source input id is kept when a (hidden)input is cloned and used as base element. Should be false when cloning a single input for use in multiple components.
    * @property {Boolean} keepInputEventHandlers=false		                - A value indicating if the source input event handlers are kept when a (hidden)input is cloned and used as base element.
    * @property {Boolean} disableDefaultCssClass=false		                - A value indicating if the default component css class is set on the component element.
    * @property {componyx.UI.base.static.RenderState} renderState		    - The current render state of the component.
    * @property {HTMLElement} element						                - The root HTMLElement of the component.
    * @property {Boolean} showing=false						                - A value indicating if the component is visible. This active state might differ from property hidden when async resources are loaded, i.e. when a component.show() is called this property value is set to true while the hidden property will also remain true until the resources are loaded and the component is rendered.
    * @property {Boolean} allowPostRender=true				                - A value indicating if the post render event is allowed.
    * @property {Boolean} renderWhenConnected=false			                - A value indicating if the component is rendered when the connectedCallback method is invoked. This property only applies to components that are build as standard Web Component with a custom element definition, see documentation for applicable components.
    * @property {Boolean} ignoreConnectionCallbacks=false                   - A value indicating if the execution of the connectedCallback and disconnectedCallback are prevented during DOM modifications (e.g. replaceChild, appendChild, insertBefore, replaceWith). By default, this is `false`. If needed, you can set it to `true` before modifying the DOM. This property only applies to components built as standard Web Components with a custom element definition; see documentation for applicable components.
    * @property {Boolean} canRender=true      				                - A value indicating if the component is allowed to render. Useful for delaying rendering until data binding (using any prefered framework) is complete when attributes are data-bound.
    * @property {Object} templates							                - Initialized Templates of the component.
    * @property {Object} store								                - Internal storage of UI child components.
    * @property {componyx.UI.base.Events} events							- The base component events.
    * @property {Object} ajax                                               - Contains AJAX configuration and dynamically created AJAX methods.
    * @property {String} ajax.url                                           - The default base URL used for AJAX calls.
    * @property {Boolean} ajax.absoluteURL=true                             - Indicates whether the `url` is treated as absolute (`true`) or relative to the current location (`false`).
    * @property {Object.<string, string>} [ajax.headers=null]               - Optional HTTP request headers to include with each AJAX call.
    * @property {String} ajax.jsonResponseDataWrapper='d'                   - The JSON wrapper key used to extract data from the server response (e.g., for ASP.NET JSON responses).
    * @property {Function|null} ajax.jsonDeserializer=null                  - Optional function to deserialize JSON data from the server.
    * @property {componyx.UI.base.AjaxMethod} ajax.load                  - Default AJAX method instance used for basic data loading.
    * @property {componyx.UI.base.AddAjaxMethod} ajax.addMethod          - INTERNAL: Adds or overrides a named AJAX method.
    */
    componyx.UI.base.Component = function (id, properties, baseObject)
    {
        var instance = this, isElement = $lib.isElement(properties);

        this.id = id;
        this.containerElement = (isElement) ? properties : (properties) ? properties.containerElement : null;
        this.style = '';
        this.tabIndex = null;
        this.events = this.events || {};

        _baseProperties.apply(this);
        _baseEvents.apply(this.events);

        if (properties && !isElement)
        {
            delete properties.containerElement;
            this.cloneProperties(properties);
        }

        if (baseObject)
        {
            if (baseObject.constructor.toString().indexOf('Array') == -1)
                baseObject = [baseObject];

            $lib.each(baseObject, function (baseObj)
            {
                if (typeof (baseObj) == 'function')
                    baseObj = new baseObj();

                $lib.clone({
                    target: instance,
                    source: baseObj,
                    deep: true,
                    overwrite: false,
                    extend: true,
                    excludeEmpty: false,
                    excludeFunctions: false
                });
            });
        }

        // Store component instance in shared variable for communication between components
        if (instance.id)
        {
            $UI.store[instance.id] = instance;

            let placeHolder = $lib('#' + instance.id);

            isElement = $lib.isElement(instance);

            if (!placeHolder && (instance.containerElement && instance.containerElement.isConnected))
            {
                if (isElement)
                    placeHolder = instance.containerElement.insertBefore(instance, instance.beforeElement);
                else
                    placeHolder = instance.containerElement.insertBefore(document.createElement('div'), instance.beforeElement);
            }

            if (placeHolder)
            {
                placeHolder.id = instance.id;
                placeHolder.style.display = 'none';
                instance.element = placeHolder;
                $UI.elementStore.set(placeHolder, instance);
            }
        }
    }

    window.$base = componyx.UI.base;

    /** 
    * Base static utility methods.
    * @namespace static
    * @memberof componyx.UI.base
    * @static
    */
    componyx.UI.base.static =
    {
        /**
        * Theme options.
        * @readonly
        * @enum {number}
        */
        ThemeOption:
        {
            NONE: -1,
            BASE: 0,
            DEFAULT: 1,

            getName: function (value)
            {
                return $base.static.getKeyByValue(this, value).toLowerCase();
            }
        },
        /**
        * Render states.
        * @readonly
        * @enum {number}
        */
        RenderState:
        {
            NONE: 0,
            RENDERING: 1,
            RENDERED: 2
        },

        /**
        * Animation easing options.
        * @readonly
        * @enum {number}
        */
        AnimationEasingOption:
        {
            linear: 0,
            easeInQuad: 1,
            easeOutQuad: 2,
            easeInOutQuad: 3,
            easeInCubic: 4,
            easeOutCubic: 5,
            easeInOutCubic: 6,
            easeInQuart: 7,
            easeOutQuart: 8,
            easeInOutQuart: 9,
            easeInQuint: 10,
            easeOutQuint: 11,
            easeInOutQuint: 12,
            easeInSine: 13,
            easeOutSine: 14,
            easeInOutSine: 15,
            easeInExpo: 16,
            easeOutExpo: 17,
            easeInOutExpo: 18,
            easeInCirc: 19,
            easeOutCirc: 20,
            easeInOutCirc: 21,
            easeInElastic: 22,
            easeOutElastic: 23,
            easeInOutElastic: 24,
            easeInBack: 25,
            easeOutBack: 26,
            easeInOutBack: 27,
            easeInBounce: 28,
            easeOutBounce: 29,
            easeInOutBounce: 30,

            getName: function (value) { return $base.static.getKeyByValue(this, value); }
        },

        getMethod: function (name)
        {
            return _getMethod(name);
        },

        getKeyByValue: function (obj, value)
        {
            for (var key in obj)
            {
                if (obj[key] == value)
                    return key.toString();
            }

            return null;
        },

        initDragSettings: function (settings, srcSettings)
        {
            $lib.each(settings.dropZones, function (id, index)
            {
                settings.dropZones[index] = (typeof (id) == 'string') ? $lib('#' + id) : id;
            });

            settings.dragHandle = (typeof (settings.dragHandle) == 'string') ? $lib('#' + settings.dragHandle) : settings.dragHandle;
            settings.dragGhost = (typeof (settings.dragGhost) == 'string') ? $lib('#' + settings.dragGhost) : settings.dragGhost;
            settings.boundaryZone = (typeof (settings.boundaryZone) == 'string') ? $lib('#' + settings.boundaryZone) : settings.boundaryZone;

            if (srcSettings)
                $lib.clone(settings, srcSettings, false, 2, true);

            $lib.each(settings, function (item, key)
            {
                if (item && typeof item == 'function')
                    _monkeyPatch(settings, srcSettings, key);
            });

            return settings;
        },

        initResizeSettings: function (settings, srcSettings)
        {
            $lib.each(settings.resizeHandles, function (value, key)
            {
                settings.resizeHandles[key] = (typeof (value) == 'string') ? $lib('#' + value) : value;
            });

            settings.resizeGhost = (typeof (settings.resizeGhost) == 'string') ? $lib('#' + settings.resizeGhost) : settings.resizeGhost;
            settings.boundaryZone = (typeof (settings.boundaryZone) == 'string') ? $lib('#' + settings.boundaryZone) : settings.boundaryZone;

            if (srcSettings)
                $lib.clone(settings, srcSettings, false, 2, true);

            $lib.each(settings, function (item, key)
            {
                if (item && typeof item == 'function')
                    _monkeyPatch(settings, srcSettings, key);
            });

            return settings;
        },

        initSelectSettings: function (settings, srcSettings)
        {
            $lib.each(settings.include, function (id, index)
            {
                settings.include[index] = (typeof (id) == 'string') ? $lib('#' + id) : id;
            });

            $lib.each(settings.exclude, function (id, index)
            {
                settings.exclude[index] = (typeof (id) == 'string') ? $lib('#' + id) : id;
            });

            settings.dragZone = (typeof (settings.dragZone) == 'string') ? $lib('#' + settings.dragZone) : settings.dragZone;
            settings.selectZone = (typeof (settings.selectZone) == 'string') ? $lib('#' + settings.selectZone) : settings.selectZone;

            if (srcSettings)
                $lib.clone(settings, srcSettings, false, 2, true);

            $lib.each(settings, function (item, key)
            {
                if (item && typeof item == 'function')
                    _monkeyPatch(settings, srcSettings, key);
            });

            return settings;
        },

        AjaxMethod: function (instance)
        {
            this.url = '';
            this.absoluteURL = true;
            this.jsonResponseDataWrapper = null;
            this.jsonDeserializer = null;
            this.endPointMethod = '';
            this.customParameters = '';
            this.headers = null;

            this.isDefined = function ()
            {
                return (!$lib.isEmpty(instance.ajax.url) || !$lib.isEmpty(this.url));
            }

            this.invoke = function (data, onStart, onComplete, onSuccess, onError, onProgress, onUploadProgress, onUploadError, onAbort)
            {
                let url = (this.url || instance.ajax.url),
                    absoluteURL = (this.absoluteURL || instance.ajax.absoluteURL),
                    headers = this.headers || instance.ajax.headers,
                    parameters = this.customParameters,
                    wrapper = '';

                if (!absoluteURL)
                    url = url.startsWith('/') ? `${location.origin}${url}` : `${location.origin}/${url}`;

                if (this.endPointMethod)
                    url += '/' + this.endPointMethod;

                if (!(data instanceof FormData) && (typeof data != "string" || $lib.startsWith(data, '{')))
                {
                    if (typeof data != "string")
                        data = window.JSON.stringify(data);

                    if (typeof parameters != "string")
                        parameters = window.JSON.stringify(parameters);

                    if (parameters && parameters.match(/^\{/))
                        parameters = parameters.substring(1, parameters.length - 1);

                    if (data && data.match(/^\{/))
                        data = data.substring(1, data.length - 1);

                    if (data && parameters)
                        data += ', ' + parameters;
                    else if (parameters)
                        data = parameters;

                    if (data)
                        data = '{' + data + '}';

                    if (this.jsonResponseDataWrapper != null)
                        wrapper = this.jsonResponseDataWrapper;
                    else if (instance.ajax.jsonResponseDataWrapper != null)
                        wrapper = instance.ajax.jsonResponseDataWrapper;
                }
                else
                {
                    if (parameters && (parameters.match(/^\?/) || parameters.match(/^\&/)))
                        parameters = parameters.substring(1);

                    if (data && parameters)
                        data += '&' + parameters;
                    else if (parameters)
                        data = parameters;
                }

                return $lib.xhr({
                    url,
                    data,
                    headers,
                    jsonResponseDataWrapper: wrapper,
                    jsonDeserializer: this.jsonDeserializer || instance.ajax.jsonDeserializer,
                    onStart,
                    onComplete,
                    onSuccess,
                    onError,
                    onProgress,
                    onUploadProgress,
                    onUploadError,
                    onAbort
                });
            }
        },

        /**
        * ItemList Base class.
        * @class
        * @memberof componyx.UI.base.static
        */
        ItemList: function ()
        {
            var _list = this;

            this.get = function (id)
            {
                return _list[getIndex(id)];
            }

            this.getByValue = function (value)
            {
                return _list[getIndexByValue(value)];
            }

            this.getByText = function (text, caseInsensitive)
            {
                return _list[getIndexByText(text, caseInsensitive)];
            }

            this.previous = function (id)
            {
                var index = getIndex(id),
                    item = _list[--index], start = item;

                while (item && item.disabled)
                {
                    item = _list[--index];

                    if (item === start)
                        item = null;
                }

                return item;
            }

            this.next = function (id)
            {
                var index = getIndex(id),
                    item = _list[++index], start = item;

                while (item && item.disabled)
                {
                    item = _list[++index];

                    if (item === start)
                        item = null;
                }

                return item;
            }

            this.find = function (text, id)
            {
                var list = _list.filter(text), index = 0;
                return (!id) ? list[0] : list[getIndex(id, list) + 1] || list[0];
            }

            this.filter = function (text)
            {
                var list = [];
                $lib.each(_list, function (item)
                {
                    if ($lib.startsWith(item.text, text, true))
                        list.push(item);
                });

                return list;
            }

            function getIndex(id, list)
            {
                return $lib.indexOf(list || _list, function (item) { return (item.id === id); });
            }

            function getIndexByValue(value, list)
            {
                return $lib.indexOf(list || _list, function (item) { return (item.value === value); });
            }

            function getIndexByText(text, caseInsensitive, list)
            {
                return $lib.indexOf(list || _list, function (item)
                {
                    return caseInsensitive
                        ? item.text.toLowerCase() === text.toLowerCase()
                        : item.text === text;
                });
            }
        },

        /**
        * Item base class.
        * @class
        * @memberof componyx.UI.base.static
        * @param {Object} properties The properties used to initialize the object.
        * @property {Object} attributes Gets or sets the attributes of the item.
        * @property {String} id Gets or sets the id of the item.
        * @property {String} templateId Gets or sets the id of the item template.
        * @property {String} cssClass Gets or sets the css class of the item.
        * @property {String} text Gets or sets the text of the item.
        * @property {String} value Gets or sets the value of the item.
        * @property {String} title Gets or sets the title of the item.
        * @property {Boolean} disabled Gets or sets a value indicating if the item is disabled.
        * @property {Boolean} readOnly Gets or sets a value indicating if the item is read-only.
        * @property {Boolean} selected Gets or sets a Value indicating if the item is selected.
        */
        Item: function (properties)
        {
            this.attributes = {};
            this.id = '';
            this.templateId = '';
            this.cssClass = '';
            this.text = '';
            this.value = '';
            this.title = '';
            this.disabled = false;
            this.readOnly = false;
            this.selected = false;
            $lib.clone(this, properties, true, true, true, true, false);
        },

        createEvent: function (eventName)
        {
            return _createEvent(eventName);
        }
    }

    /**
    * A base class for UI components extending the HTMLElement.
    * This class provides the core functionality for UI components including base properties and events.
     * @class WebComponent
     * @memberof componyx.UI.base
     * @augments HTMLElement
     */
    componyx.UI.base.WebComponent = class WebComponent extends HTMLElement
    {
        constructor()
        {
            super();

            /**
             * Events attached to the component.
             * @type {componyx.UI.base.Events}
            */
            this.events = this.events || {};

            _baseProperties.apply(this);
            _baseEvents.apply(this.events);
        }

        /**
        * Initializes the component with the specified properties.
        * @function
        */
        init(props)
        {
            _initComponent[this.id] = { props };
        }

        /**
        * Invoked when the element is added to the DOM. Renders the component if not already in the rendering state.
        * @function
        */
        async connectedCallback()
        {
            if (this.ignoreConnectionCallbacks)
                return;

            let id = this.id;

            if ($lib.isEmpty(id))
            {
                let type = Object.getPrototypeOf(this).constructor.name;
                id = (type.toLowerCase() + $lib.guid());
                this.setAttribute('id', id);
            }

            if (!$UI.store[id] || $UI.store[id] !== this) // new component, use initialisation props
            {
                const init = _initComponent[id] = _initComponent[id] || {},
                    props = init.props;

                if (!$lib.isEmpty(props))
                    this.cloneProperties(props);

                _initDataAttributes.bind(this)(id, this);
            }

            $UI.store[id] = this;

            if (this.renderWhenConnected && this.renderState == $base.static.RenderState.NONE)
            {
                await $UI.onPreLoadSettings.fire(this);

                if (this.renderState == $base.static.RenderState.NONE) // could have changed while awaiting (e.g. destroyed)
                    this.show();
            }
        }

        /**
        * Invoked when the element is removed from the DOM. Cleans up the component.
        * @function
        */
        disconnectedCallback()
        {
            if (!this.ignoreConnectionCallbacks && this.element)
            {
                this.destroy();
            }
        }

        /**
        * Renders the component.
        * @param {Function} resourceHandler The callback method for registering script and css resources.
        * @param {String} defaultName The default name is used as default css class and when $UI.useCustomElementNames is enabled, as the element tag name prefixed by 'com'.
        * @param {Boolean} hasTheme A value indicating if the component has a CSS theme.
        * @function
        */
        render(resourceHandler, defaultName, hasTheme)
        {
            if (this.renderState == $base.static.RenderState.RENDERING || this.canRender === false)
                return;

            this.destroy(true, false);
            $UI.store[this.id] = this;
            this.element = this;
            this.initRenderPhase(resourceHandler, defaultName, hasTheme);
        }

        /**
        * Destroys the component.
        * @param {Boolean} keepEvents A value indicating if component events should be kept.
        * @param {Boolean} removeElement=true A value indicating if the corresponding HTML Element should be removed.
        * @function
        */
        destroy(keepEvents, removeElement = true)
        {
            $base.methods.destroy.call(this, keepEvents, removeElement);
        }

        /**
         * Gets the CSS class name from the component property if it exists, otherwise returns the default CSS class.
         * @param {Object} classOption Object containing class options.
         * @param {string} cssClassValue Default CSS class value.
         * @returns {string} The resolved CSS class name.
         * @function
         */
        getCssClass(classOption, cssClassValue)
        {
            return $base.methods.getCssClass.call(this, classOption, cssClassValue);
        }

        /**
        * Clones component properties. This method should not be invoked by client code directly but only from inside component code.
        * @param {Object} properties The properties to clone.
        * @function
        * @protected
        */
        cloneProperties(properties)
        {
            $base.methods.cloneProperties.call(this, properties);
        }

        /**
        * Executes the post render procedure. This method should not be invoked by client code directly but only from inside component code.
        * @function
        * @protected
        */
        postRender()
        {
            $base.methods.postRender.call(this);
        }
    }

    /**
     * @interface
     * @name componyx.UI.base.methods
     * @memberof componyx.UI.base
     */

    componyx.UI.base.methods =
    {
        /**
         * Handles attribute mutations, updates corresponding properties, and triggers a single render after all mutations are processed.
         * @function componyx.UI.base.methods#mutationCallback
         * @param {MutationRecord[]} mutations - An array of mutation records containing details of the observed attribute changes.
         * @param {MutationObserver} observer - The MutationObserver instance that is observing changes to the DOM.
         * @protected
         */
        mutationCallback(mutations, observer)
        {
            let changes = false;

            if (!this.observing)
                return;

            clearTimeout(this.mutationRenderTimerId);

            for (const mutation of mutations)
            {
                let name = mutation.attributeName.toLowerCase(),
                    value = mutation.target.getAttribute(mutation.attributeName);

                if (_setPropertyFromAttribute.bind(this)(this.element, name, value))
                {
                    changes = true;

                    const init = _initComponent[this.id];
                    if (init?.attrs)
                        init.attrs[name] = value; // keep the diff cache in sync
                }
            }

            if (changes)
                this.mutationRenderTimerId = setTimeout(() => { this.render(); }, 0);
        },

        /** 
        * Executes and XHR call. This method should not be invoked by client code directly but only from inside component code.
        * @function componyx.UI.base.methods#ajaxCall
        * @param {String} method The name of the method.
        * @param {Object|String} data The data to send.
        * @param {Object} events An object holding event handlers for various XHR events.
        * @property {componyx.library.XhrCallback} events.onStart Defines the callback function to call before the request.
        * @property {componyx.library.XhrCallback} events.onComplete Defines the callback function to call after the request.
        * @property {componyx.library.XhrCallback} events.onSuccess Defines the callback function to call when the request was successful.
        * @property {componyx.library.XhrCallback} events.onError the callback function to call when the HTTP request failed. (HTTP status >= 200 and < 300).
        * @property {componyx.library.XhrCallback} events.onAbort Defines the callback function to call when the request was aborted.
        * @property {componyx.library.XhrCallback} events.onProgress Defines the callback function to call when there is a change in the download progress.
        * @property {componyx.library.XhrCallback} events.onUploadProgress Defines the callback function to call when there is a change in the upload progress.
        * @property {componyx.library.XhrCallback} events.onUploadError Defines the callback function to call when the upload failed.
        * @param {Object[]} callArgs Arguments to pass to the global event handlers.
        * @function
        * @protected
        */
        ajaxCall: function (method, data, events, callArgs)
        {
            events = events || {};

            let instance = this, guid = $lib.guid(),
                clear = () =>
                {
                    if (instance.__ajax && instance.__ajax[method] && instance.__ajax[method][guid]) // clear stored ajax request
                        delete instance.__ajax[method][guid];
                },
                invoke = (name, args) =>
                {
                    if (events[`on${name}`])
                        events[`on${name}`](args);

                    instance.events[`onAjax${name}`].fire(instance, [args].concat(callArgs || []));
                },
                begin = (args) => { invoke('Start', args); },
                end = (args) =>
                {
                    clear();
                    invoke('Complete', args);
                },
                success = (args) => { invoke('Success', args); },
                error = (args) => { invoke('Error', args); },
                progress = (args) => { invoke('Progress', args); },
                uploadProgress = (args) => { invoke('UploadProgress', args); },
                uploadError = (args) => { invoke('UploadError', args); },
                abort = (args) =>
                {
                    clear();
                    invoke('Abort', args);
                };

            if (!instance.__ajax[method])
                instance.__ajax[method] = {};

            instance.__ajax[method][guid] = instance.ajax[method].invoke(data, begin, end, success, error, progress, uploadProgress, uploadError, abort);
            return instance.__ajax[method][guid];
        },

        /**
        * Gets the css class for the specified class option value: the value of the matching cssClass<Key> property on the component when set, otherwise the default value.
        * Example: for the key 'BUILD_PANE' the property 'cssClassBuildPane' is checked.
        * @param {Object} classOption The class option object of the component.
        * @param {String} cssClassValue The default css class (a value of the class option object).
        * @returns {String} The resolved css class.
        * @function componyx.UI.base.methods#getCssClass
        * @protected
        */
        getCssClass: function (classOption, cssClassValue)
        {
            const key = Object.keys(classOption).find(key => classOption[key] === cssClassValue);

            if (!key)
                return cssClassValue;

            const propertyName = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(''); // e.g. 'BUILD_PANE' -> 'BuildPane'
            return this[`cssClass${propertyName}`] || cssClassValue;
        },

        /**
         * Suppresses any change events fired by the underlying input element during the execution of the provided action. Use this when programmatically setting a component value to prevent the change event from propagating as a user interaction.
         * The suppression is automatically lifted after the action completes, even if it throws.
         * @param {Function} action - The action to execute with change events suppressed.
         */
        suppressNextChangeEvent: function (action)
        {
            this.__suppressNextChangeEvent = true;
            try
            {
                action();
            }
            finally
            {
                this.__suppressNextChangeEvent = false;
            }
        },

        /** 
        * Hides the component when it's showing, otherwise it shows the component.
        * @function componyx.UI.base.methods#toggle
        */
        toggle: function ()
        {
            if (this.showing)
                this.hide();
            else
                this.show();
        },

        /** 
        * Shows the component.
        * @function componyx.UI.base.methods#show
        */
        show: function (fireEvent)
        {
            var instance = this;

            instance.showing = true;

            if (instance.renderState == $base.static.RenderState.NONE)
            {
                instance.render();
            }
            else if (instance.renderState == $base.static.RenderState.RENDERED && instance.__hidden)
            {
                instance.element.classList.remove(_cssClassHidden);
                instance.__hidden = false;

                if (fireEvent != false)
                    instance.events.onShow.fire(instance);
            }
            else
                instance.containerElement = instance.element.parentNode;
        },

        /** 
        * Hides the component.
        * @function componyx.UI.base.methods#hide
        */
        hide: function (fireEvent)
        {
            var instance = this;

            instance.showing = false;

            if (instance.renderState == $base.static.RenderState.RENDERED && !instance.__hidden)
            {
                var el, index,
                    elements = $lib('focus', instance.element);

                for (index = 0; index < elements.length; ++index)
                {
                    el = elements[index];

                    if (el.blur)
                        el.blur();

                    $lib.removeClass(el, 'focus');
                }

                instance.element.classList.add(_cssClassHidden);
                instance.__hidden = true;

                if (fireEvent != false)
                    instance.events.onHide.fire(instance);
            }
        },

        /** 
        * Destroys the component.
        * @param {Boolean} keepEvents A value indicating if component events should be kept.
        * @param {Boolean} removeElement=true A value indicating if the corresponding HTML Element should be removed.
        * @function componyx.UI.base.methods#destroy
        */
        destroy: function (keepEvents, removeElement = true)
        {
            var instance = this,
                element = instance.element, method, guid;

            if (instance.renderState != $base.static.RenderState.NONE)
            {
                instance.events.onDestroy.fire(instance);

                if (instance.renderState == $base.static.RenderState.RENDERED)
                {
                    // abort possible pending ajax requests
                    for (method in instance.__ajax)
                    {
                        for (guid in instance.__ajax[method])
                            instance.__ajax[method][guid].abort();
                    }

                    // remove child components
                    $lib.each(instance.store, function (id)
                    {
                        if ($UI.store[id])
                            $UI.store[id].destroy();
                    });
                }
                else if (instance.renderState == $base.static.RenderState.RENDERING)
                    _renderCount--; // component will never reach postRender event so remove from render stack

                instance.events.dispose((keepEvents) ? 2 : null); // when keep events is true, we only remove priority events otherwise they would be added again on render

                if (element && ($lib.isEmpty(element.id) || element.id === instance.id))
                {
                    var inputId = instance.inputId || instance.hiddenInputId;

                    if (!$lib.isEmpty(inputId))
                        this.getSourceElement(inputId); // this is a precaution to re-cache the input when the id could potentially have changed

                    if (removeElement)
                    {
                        instance.element = null;

                        if (!this.showing && element.parentNode)
                            $lib.remove(element);
                        else if (this.showing && element.parentNode)
                            $lib.remove(element);

                        delete _initComponent[instance.id];
                    }
                    else
                        element.innerHTML = '';
                }
            }

            $lib.each(instance.__createdTemplates, function (t) { clearTimeout(t.timerId); });

            instance.renderState = $base.static.RenderState.NONE;
            instance.element = null;
            instance.__createdTemplates = {};
            instance.__ajax = {};
            instance.store = [];
            delete $UI.store[instance.id];
            $UI.elementStore.delete(element);

            if (this.attributeObserver)
                this.attributeObserver.disconnect();

            if (this.removalObserver)
                this.removalObserver.disconnect();
        },

        /** 
        * Renders the component.
        * @param {Function} resourceHandler The callback method for registering script and css resources.
        * @param {String} defaultName The default name is used as default css class and when $UI.useCustomElementNames is enabled, as the element tag name prefixed by 'com'.
        * @param {Boolean} hasTheme A value indicating if the component has a CSS theme.
        * @param {String} tagName The tag name of the component element.
        * @param {String} customTagName The tag name of the component element when $UI.useCustomElementNames is enabled and a different tag than the default name is desired.
        * @function componyx.UI.base.methods#render
        */
        render: function (resourceHandler, defaultName, hasTheme, tagName, customTagName)
        {
            if (this.renderState == $base.static.RenderState.RENDERING || this.canRender === false)
                return;

            this.createElement(defaultName, tagName, customTagName);
            this.initRenderPhase(resourceHandler, defaultName, hasTheme);
        },


        /**
        * Initializes the render phase for the component.
        * This method should not be invoked by client code directly but only from inside component code.
        * @param {Function} resourceHandler The callback method for registering script and css resources.
        * @param {String} defaultName The default name is used as default css class and when $UI.useCustomElementNames is enabled, as the element tag name prefixed by 'cui'.
        * @param {Boolean} hasTheme A value indicating if the component has a CSS theme.
        * @function componyx.UI.base.methods#initRenderPhase
        * @protected
        */
        initRenderPhase: function (resourceHandler, defaultName, hasTheme)
        {
            const instance = this;

            // global $UI variables
            clearTimeout(_readyTimerId);
            _renderCount++;
            _isBusy = true;

            instance.renderState = $base.static.RenderState.RENDERING;
            instance.hasTheme = hasTheme;
            $UI.elementStore.delete(instance.element);
            $UI.elementStore.set(instance.element, instance);
            this.configureElement(defaultName);
            this.setupMutationObserver();

            if (this.invokePreRender() === true)
            {
                _renderCount--;
                return;
            }

            this.registerResources(resourceHandler);
        },

        /**
        * Creates the component's element and handles updates.
        * This method should not be invoked by client code directly but only from inside component code.
        * @param {String} defaultName The default name is used as default css class and when $UI.useCustomElementNames is enabled, as the element tag name prefixed by 'com'.
        * @param {String} tagName The tag name of the component element.
        * @param {String} customTagName The tag name of the component element when $UI.useCustomElementNames is enabled and a different tag than the default name is desired.
        * @function componyx.UI.base.methods#createElement
        * @protected
        */
        createElement: function (defaultName, tagName, customTagName)
        {
            if (customTagName || $UI.useCustomElementNames)
                tagName = (customTagName) ? customTagName : _customTagPrefix + defaultName;
            else
                tagName = tagName || 'div';

            let instance = this,
                element = document.createElement(tagName),
                containerElement = instance.containerElement,
                nextSibling, properties,
                oldElement = (instance.element?.isConnected) ? instance.element : $lib('#' + instance.id);

            if (oldElement)
            {
                instance.element = oldElement;
                instance.collectTemplates();
            }

            if (instance.renderState == $base.static.RenderState.RENDERED)
            {
                // the component has been rendered before so this is an update
                // the old element could already been removed from the page if we are dealing with a child component and the parent component's destroy was called.
                // if there is an old element, destroy it and make sure that it is recreated on the same position in the page.

                // Restore ui-type on cached template content so child components
                // can be re-detected on next applyTemplate
                instance.templates.forEach(function (template)
                {
                    if (!template.content)
                        return;

                    template.content.forEach(function (node)
                    {
                        if (node.nodeType === Node.ELEMENT_NODE && node.__uiType)
                            node.setAttribute(_dataType, node.__uiType);
                    });
                });


                if (oldElement)
                {
                    nextSibling = oldElement.nextSibling;
                    containerElement = oldElement.parentNode;
                }

                instance.destroy(true); // keep events

                if (nextSibling)
                    containerElement.insertBefore(oldElement, nextSibling);
                else if (oldElement)
                    containerElement.appendChild(oldElement);
            }

            $UI.store[instance.id] = instance;

            if (oldElement)
            {
                if (oldElement.isConnected)
                    oldElement.parentNode.replaceChild(element, oldElement);

                if (instance.templates.size) // keep templates
                {
                    instance.templates.forEach(function (template)
                    {
                        if (!template.content)
                            element.appendChild(template.element);
                    });
                }

                if (containerElement && containerElement != element.parentNode)
                    containerElement.appendChild(element);

                $lib.each(oldElement.attributes, (attr) => { element.setAttribute(attr.name, attr.value); })
            }
            else
            {
                containerElement = containerElement || document.body;
                containerElement.appendChild(element);
            }

            instance.element = element;
        },

        /**
        * Configures the component's element.
        * This method should not be invoked by client code directly but only from inside component code.
        * @param {String} defaultName The default name is used as default css class and when $UI.useCustomElementNames is enabled, as the element tag name prefixed by 'com'.
        * @function componyx.UI.base.methods#configureElement
        * @protected
        */
        configureElement: function (defaultName)
        {
            let instance = this,
                element = this.element,
                beforeElement = this.beforeElement,
                defaultTheme = $base.static.ThemeOption.DEFAULT;

            if (beforeElement && beforeElement != element.nextElementSibling && beforeElement.parentNode)
                beforeElement.parentNode.insertBefore(element, beforeElement);

            instance.containerElement = element.parentNode;

            element.id = instance.id;
            element.className = this.disableDefaultCssClass ? instance.cssClass ?? "" : `${defaultName} ${instance.cssClass || ""}`.trim();
            element.style.display = '';

            if (typeof instance.style === 'string')
                $lib.setStyle(element, instance.style);

            element.classList.add(_cssClassHidden); // component is invisible until rendered
            instance.__hidden = true;
            instance.theme = (instance.theme != null) ? instance.theme : defaultTheme || 0;
            $.addClass(element, instance.getThemeCSS());

            // add extra class when dealing with a touch device
            if (instance.cssClassTouch && $lib.touch)
                $lib.addClass(element, instance.cssClassTouch);

            if (!$lib.isEmpty(instance.title))
                element.title = instance.title;

            // bind default click event
            $lib.on(element, 'click', function (e)
            {
                instance.events.onClick.fire(instance, e);
            });
        },

        /**
        * Sets up the mutation observer to track attribute changes and DOM element removal.
        * This method should not be invoked by client code directly but only from inside component code.
        * @function componyx.UI.base.methods#setupMutationObserver
        * @protected
        */
        setupMutationObserver: function ()
        {
            const instance = this,
                doc = this.element.ownerDocument;

            if (this.attributeObserver)
                this.attributeObserver.disconnect();

            if (this.removalObserver)
                this.removalObserver.disconnect();

            if (!this.observing)
                return;

            this.attributeObserver = new MutationObserver(this.mutationCallback.bind(this));
            this.attributeObserver.observe(this.element, { attributes: true });

            this.removalObserver = new MutationObserver((mutations) => 
            {
                for (const mutation of mutations)
                {
                    for (const removedNode of mutation.removedNodes)
                    {
                        if (removedNode === instance.element && !(instance instanceof doc.defaultView.HTMLElement))
                        {
                            instance.destroy();
                            return;
                        }
                    }
                }
            });

            this.removalObserver.observe(this.element.parentElement, { childList: true });
        },

        /**
        * Invokes pre-render actions and fires the `onPreRender` event.
        * This method should not be invoked by client code directly but only from inside component code.
        * @function componyx.UI.base.methods#invokePreRender
        * @returns {boolean} A value indicating if the render should be canceled.
        * @protected
        */
        invokePreRender: function ()
        {
            let instance = this;
            $UI.onPreRender.fire(instance);

            const args = { cancel: false };

            instance.events.onPreRender.fire(instance, args);
            return args.cancel;
        },

        /**
        * Registers required resources (CSS and JS) for the component.
        * This method should not be invoked by client code directly but only from inside component code.
        * @param {Function} resourceHandler The callback method for fetching resources.
        * @param {Function} callback The callback to call after resources are loaded.
        * @function componyx.UI.base.methods#registerResources
        * @protected
        */
        registerResources: function (resourceHandler, callback)
        {
            const instance = this,
                theme = instance.theme,
                resources = resourceHandler ? resourceHandler.call(instance) : [],
                componentName = resources[0],
                script = $UI.onDemandResourceLoading ? (resources[1] || []).filter((name) => !$UI[name]) : [], // copy, never mutate the caller's array
                css = [];

            let scriptsLoaded = 0,
                cssLoaded = 0;

            const handler = function ()
            {
                if (scriptsLoaded < script.length || cssLoaded < css.length)
                    return;

                if (instance.renderState != $base.static.RenderState.RENDERING)
                    return; // destroyed while loading resources (destroy already corrected _renderCount)

                if (instance.element && instance.element !== $UI.store[instance.id]?.element) // re-rendered while loading resources
                {
                    --_renderCount;
                    return;
                }

                if (callback)
                    callback();
                else if (instance.render)
                    instance.render(); // finished including script and css, return to the component's render method
            };

            if ($UI.onDemandResourceLoading && theme > $base.static.ThemeOption.NONE)
            {
                let src = $UI.getCssResourcePath(componentName);

                if (src)
                    css.push({ src: src, id: _namespace + componentName + '.css' });

                if (theme != $base.static.ThemeOption.BASE && instance.hasTheme !== false)
                {
                    const themeName = $base.static.ThemeOption.getName(theme);
                    src = $UI.getCssResourcePath(componentName, theme);

                    if (src)
                        css.push({ src: src, id: $lib.format('{0}{1}.{2}.css', _namespace, componentName, themeName) });
                }
            }

            if (!script.length && !css.length)
            {
                handler(); // nothing to load
                return;
            }

            $lib.each(script, function (name)
            {
                const src = $UI.getScriptResourcePath(name);
                $lib.addScriptSource(src, _namespace + name + '.js', { onComplete: function () { scriptsLoaded++; handler(); } }, null, null, $UI.resourcesBefore);
            });

            $lib.each(css, function (item)
            {
                $lib.addCssSource(item.src, item.id, { onComplete: function () { cssLoaded++; handler(); } }, $UI.resourcesBefore);
            });
        },

        /**
        * Returns the CSS class string for the component's theme.
        * This method should not be invoked by client code directly but only from inside component code.
        * @function componyx.UI.base.methods#getThemeCSS
        * @protected
        */
        getThemeCSS: function ()
        {
            var cssClass = [], theme = this.theme, themeName = this.themeName;

            if (theme > $base.static.ThemeOption.NONE)
            {
                cssClass.push('theme');

                if (theme >= $base.static.ThemeOption.DEFAULT) // the class name is always set, even when hasTheme is false. The component can still pick-up styles from the global default css
                    cssClass.push('theme-' + $base.static.ThemeOption.getName(theme));
            }

            if (themeName)
                cssClass.push(themeName); // custom theme name

            return (cssClass.length) ? cssClass.join(' ') : '';
        },

        /** 
        * Moves the component to a new position within the DOM.
        * @param {HTMLElement} container The new container element.
        * @param {HTMLElement} [before] The new before element.
        * @function componyx.UI.base.methods#move
        */
        move: function (container, before)
        {
            var element = this.element;
            container.insertBefore(element, before);
            this.containerElement = container;
        },

        /** 
        * Calls the render method on all child components. This method should not be invoked by client code directly but only from inside component code.
        * @function componyx.UI.base.methods#renderChildren
        * @protected
        */
        renderChildren: function ()
        {
            var index = -1, ready = true, obj;

            while (++index < this.store.length)
            {
                if (obj = $UI.store[this.store[index]])
                {
                    if (obj.renderState != $base.static.RenderState.RENDERED)
                        ready = false;

                    if (!obj.renderState)
                        obj.render();
                }
                else
                    ready = false;
            }

            if (ready)
                this.postRender();
        },

        /** 
        * Checks if all child components have been rendered and calls the component's postRender method when this is the case. This method should not be invoked by client code directly but only from inside component code.
        * This method is used as a postRender callback for child components. 
        * @function componyx.UI.base.methods#childReady
        * @protected
        */
        isReady: function ()
        {
            var index = -1, ready = this.allowPostRender,
                state = $base.static.RenderState.RENDERED;

            while (ready && ++index < this.store.length)
            {
                ready = ($UI.store[this.store[index]] && $UI.store[this.store[index]].renderState == state);
            }

            if (ready)
                this.postRender();
        },

        /**
        * Executes the post render procedure. This method should not be invoked by client code directly but only from inside component code.
        * @function componyx.UI.base.methods#postRender
        * @protected
        */
        postRender: function ()
        {
            var instance = this;

            if (instance.renderState != $base.static.RenderState.RENDERING) // extra safety to never execute a postRender when the component state is incorrect
                return;

            instance.renderState = $base.static.RenderState.RENDERED;
            instance.allowPostRender = true;

            if (instance.showing)
                instance.show();

            _renderCount--;
            instance.events.onPostRender.fire(instance);

            if (instance.renderState != $base.static.RenderState.RENDERED)
                return false;

            if (_renderCount == 0)
            {
                clearTimeout(_readyTimerId);

                var ready = function (instance)
                {
                    if (instance.renderState == $base.static.RenderState.RENDERED) // destroy could have happened because of call via setTimeout
                        $UI.onPostRender.fire();
                }

                _readyTimerId = setTimeout(ready.bind(this, instance), 0); // put as last call on the stack
            }

            return true;
        },

        /** 
        * Adds (or removes) a template.
        * Templates for data-items provide support for property interpolations.
        * These interpolations are curly bracket formatted markers which are replaced with item property values during template rendering.
        * Example: {text} will output the value of item.text, while {customProperty} will output the value of item.attributes.customProperty.
        * @param {String} id Id of the template.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content HTML string or element node array or element node. Pass null or empty string to remove the existing template.
        * @param {Boolean} cloneable Defines if the template can be cloned for multiple views. Defaults to true.
        * @param {Boolean} interpolate Defines if a search and replace action on the inner HTML of the template will be performed to set the corresponding value for a interpolation tag (e.g. {value}).
        * @function componyx.UI.base.methods#addTemplate
        */
        addTemplate: function (id, content, cloneable, interpolate)
        {
            var template, instance = this,
                templates = this.templates;

            if ($lib.isEmpty(content))
            {
                if (templates.has(id))
                    templates.delete(id);
                else
                {
                    $lib(function (el)
                    {
                        if (_hasAttribute(el, _dataTemplate) && _getAttribute(el, _dataTemplate) === id)
                        {
                            template = el;
                            return false;
                        }
                    }, instance.element, 'div');

                    $lib.remove(template);
                }

                return;
            }

            template = document.createElement('div');
            template.setAttribute(_dataTemplate, id);
            template.setAttribute(_dataCloneable, (cloneable != undefined) ? cloneable : true);
            template.setAttribute(_dataInterpolate, (interpolate != undefined) ? interpolate : true);

            if ($lib.isArray(content))
            {
                for (var index = 0; index < content.length; ++index)
                {
                    template.appendChild(content[index]);
                }
            }
            else if (typeof content == 'string')
                template.innerHTML = content;
            else // HTMLElement or DocumentFragment
                template.appendChild(content);

            instance.collectTemplate(template);
        },

        /** 
        * Checks if the template with the specified template id exists.
        * @param {String} templateId The id of the template.
        * @returns {Boolean} True if the template is present, otherwise false.
        * @function componyx.UI.base.methods#hasTemplate
        */
        hasTemplate: function (templateId)
        {
            var instance = this, templates = this.templates;

            if (!templates.has(templateId))
                instance.collectTemplates();

            return (templates.has(templateId));
        },

        /** 
        * Gets all the template HTMLElements for the component and stores them in the component's internal template cache. This method should not be invoked by client code directly but only from inside component code.
        * @param {String} templateId The id of the template.
        * @function componyx.UI.base.methods#collectTemplates
        * @protected
        * @returns {HTMLElement[]} A list of collected template elements.
        */
        collectTemplates: function ()
        {
            var instance = this, templates = [],
                elements = $lib.children(instance.element);

            $lib.each(elements, function (el)
            {
                if (_hasAttribute(el, _dataTemplate))
                    templates.push(el);
            });

            $lib.each(templates, function (el)
            {
                instance.collectTemplate(el);
            });

            return templates;
        },

        /** 
        * Gets the template HTMLElement and stores it in the component's internal template cache. This method should not be invoked by client code directly but only from inside component code.
        * @param {HTMLElement} element The template element.
        * @function componyx.UI.base.methods#collectTemplate
        * @protected
        */
        collectTemplate: function (element)
        {
            if (!element)
                return null;

            var templateId = _getAttribute(element, _dataTemplate),
                cloneable = _getAttribute(element, _dataCloneable),
                interpolate = _getAttribute(element, _dataInterpolate);

            if ($lib.isEmpty(templateId)) // auto-generate a stable ID if none was specified
            {
                templateId = $lib.guid();
                element.setAttribute(_dataTemplate, templateId);
            }

            this.templates.set(templateId, { element: element, content: null, cloneable: ($lib.isEmpty(cloneable) || cloneable === 'true') ? true : false, interpolate: ($lib.isEmpty(interpolate) || interpolate === 'true') ? true : false });
            element.classList.add(_cssClassHidden);

            return element;
        },

        /** 
        * Gets the template content for the specified template id. This method should not be invoked by client code directly but only from inside component code.
        * @returns {DocumentFragment} The template content.
        * @function componyx.UI.base.methods#getTemplateContent
        * @protected
        */
        getTemplateContent: function (templateId)
        {
            let instance = this, element, template,
                templates = this.templates,
                templateProps = new Set(['template', 'contentfrom', 'cloneable', 'interpolate']),
                hasMeaningfulAttributes = (el) =>
                {
                    return Array.from(el.attributes).some(attr =>
                    {
                        let name = attr.name.toLowerCase();

                        // ignore presentation
                        if (name === 'class' || name === 'style')
                            return false;

                        if (name.startsWith('data-ui-'))
                            name = name.slice(5);

                        if (name.startsWith('ui-'))
                        {
                            let prop = name.slice(3);
                            return !templateProps.has(prop);
                        }

                        return true;
                    });
                },
                keepRootElement = false;

            if (!templates.has(templateId))
                instance.collectTemplates();

            if (templates.has(templateId))
            {
                template = templates.get(templateId);

                if (!template.content)
                {
                    element = template.element;
                    var contentFrom = _getAttribute(element, _dataContentFrom);

                    if (contentFrom)
                        contentFrom = $lib('#' + contentFrom);
                    else
                        keepRootElement = element.nodeName !== 'TEMPLATE' && hasMeaningfulAttributes(element);

                    if (keepRootElement)
                        template.content = [element];
                    else
                        template.content = $lib.extract(contentFrom || element, true); // extract to array

                    if (contentFrom)
                        $lib.remove(contentFrom);

                    $lib.remove(element); // remove from original position
                }

                return template.content;
            }
            else
                return null;
        },

        /** 
        * Applies the template content. This method should not be invoked by client code directly but only from inside component code.
        * @param {HTMLElement} element The element to which the template content will be added.
        * @param {String} templateId The id of the template.
        * @param {String[]} values Template replacement values.
        * @param {Function} matchHandler Callback method for the template replacement values.
        * @function componyx.UI.base.methods#applyTemplate
        * @protected
        */
        applyTemplate: function (element, templateId, values, matchHandler)
        {
            let content = this.getTemplateContent(templateId);

            if (!content)
                return;

            let instance = this,
                templates = instance.templates,
                isArray = $lib.isArray(values),
                template = templates.get(templateId),
                cloneable = template.cloneable,
                interpolate = template.interpolate,
                templateEl = template.element,
                isTemplate = templateEl.nodeName == 'TEMPLATE',
                keepRootElement = (content.length == 1 && content[0] === templateEl);

            if (keepRootElement) // template root element must be kept
            {
                if (cloneable)
                    templateEl = templateEl.cloneNode(true);

                if (templateEl.classList.contains(_cssClassHidden))
                    templateEl.classList.remove(_cssClassHidden);
            }
            else
            {
                templateEl.innerHTML = '';
                $lib.each(content, function (node)
                {
                    node = (cloneable) ? node.cloneNode(true) : node;
                    if (isTemplate)
                        templateEl.content.appendChild(node);
                    else
                        templateEl.appendChild(node);
                });
            }

            values = values || {};
            instance.events.onPreApplyTemplate.fire(instance, { id: templateId, template: templateEl, element: element, values: values, matchHandler: matchHandler });

            if (interpolate && !$lib.isEmpty(values))
                templateEl = parseTemplate(templateEl);

            if (element.nodeName.toLowerCase() == 'input')
                element.value = templateEl.textContent;
            else
            {
                if (keepRootElement)
                {
                    element.appendChild(templateEl);
                }
                else
                {
                    content = (isTemplate) ? templateEl.content : templateEl;

                    while (content.firstChild)
                    {
                        element.appendChild(content.firstChild);
                    }
                }

                let createdTemplate = instance.__createdTemplates[templateId];

                if (!createdTemplate)
                    createdTemplate = instance.__createdTemplates[templateId] = { containers: [], timerId: null };

                if (element && !createdTemplate.containers.includes(element))
                    createdTemplate.containers.push(element);

                clearTimeout(createdTemplate.timerId);
                createdTemplate.timerId = setTimeout(_detect.bind(instance, templateId));
            }

            instance.events.onPostApplyTemplate.fire(instance, { id: templateId, template: templateEl, element: element, values: values, matchHandler: matchHandler });

            function parseTemplate(template)
            {
                let regex = /\{+([^\{\}\s]+)\}+/gm,
                    nodes = [],
                    attrNodes = [],
                    node,
                    replacementNodes = {},
                    walker = template.ownerDocument.createTreeWalker(template, NodeFilter.SHOW_TEXT, null, false);

                while (node = walker.nextNode())
                {
                    nodes.push(node); // Store each text node
                }

                walker = template.ownerDocument.createTreeWalker(template, NodeFilter.SHOW_ELEMENT, null, false);
                while (node = walker.nextNode())
                {
                    for (let attr of node.attributes)
                    {
                        if (regex.test(attr.value))
                        {
                            attrNodes.push({ element: node, name: attr.name, value: attr.value }); // Store each attribute
                        }
                    }
                }

                $lib.each(nodes, function (node)
                {
                    if (node.nodeValue.match(regex))
                    {
                        let tempElement = template.ownerDocument.createElement('div'); // use temporary element node because the replacement value might include html
                        tempElement.innerHTML = node.nodeValue.replace(regex, replace); // replace the {name}, {name/} and {/name} occurences for the corresponding values

                        for (let guid in replacementNodes)
                        {
                            const el = tempElement.querySelector('#' + guid);
                            if (el) el.replaceWith(replacementNodes[guid]);
                        }

                        node.parentElement.replaceChild(tempElement, node);
                        $.unsurround(tempElement); // remove the temporary element
                    }
                });

                $lib.each(attrNodes, function (attr)
                {
                    attr.element.setAttribute(attr.name, attr.value.replace(regex, replace));
                });

                function replace(match)
                {
                    var value = match.toString(),
                        left = (value.match(/\{/g) || []).length,
                        right = (value.match(/\}/g) || []).length;

                    if ((left >= 1 && left % 2 != 0) && (right >= 1 && right % 2 != 0))
                        value = value.replace(/\{([^\{\}\s]+)\}/, replace);

                    return value.replace('{{', '{').replace('}}', '}'); // escape braces {{ = {

                    function replace(match)
                    {
                        var value = '',
                            found = false,
                            index = 0,
                            key = match.substring(1, match.length - 1);

                        if (values && isArray)
                        {
                            while (index < values.length && !found)
                            {
                                value = lookup(values[index]);
                                index++;
                            }
                        }
                        else if (values)
                            value = lookup(values);

                        if (matchHandler)
                            value = matchHandler(match, value);

                        if (typeof value === 'string' || typeof value === 'number')
                        {
                            return value;
                        }
                        else if (value && value instanceof $lib.defaultView(template).Node)
                        {
                            let guid = $lib.guid();
                            replacementNodes[guid] = value;
                            return `<span id="${guid}"></span>`;
                        }

                        return value;

                        function lookup(keyValuePair)
                        {
                            found = true;

                            if (keyValuePair[key] != undefined)
                                return keyValuePair[key];
                            else if (keyValuePair.attributes && keyValuePair.attributes[key])
                                return keyValuePair.attributes[key];

                            found = false;
                            return '';
                        }
                    }
                }

                return template;
            }
        },

        /** 
        * Executes a form post-back. This method should not be invoked by client code directly but only from inside component code.
        * @param {String} arg The postback argument.
        * @param {String} formId The id of the form.
        * @function componyx.UI.base.methods#postBack
        * @protected
        */
        postBack: function (arg, formId)
        {
            var instance = this, frm = null, result = null, submit = null, result = null;

            if (formId)
            {
                frm = $lib('#' + formId);
            }
            else
            {
                result = $lib(null, instance.element, 'form', true, true);

                if (result == null)
                    frm = document.getElementsByTagName('form')[0];
                else
                    frm = result;
            }

            if (!frm)
                return false;

            instance.setPostBackArgs(frm, arg);
            frm.submit();
        },

        /** 
        * Sets the postback arguments. This method should not be invoked by client code directly but only from inside component code.
        * @param {HTMLElement} frm The form element.
        * @param {String} arg The postback argument.
        * @function componyx.UI.base.methods#setPostBackArgs
        * @function
        * @protected
        */
        setPostBackArgs: function (frm, arg)
        {
            var instance = this;
            var hidField;

            if (!frm.__EVENTTARGET)
            {
                hidField = document.createElement('input');
                hidField.type = 'hidden';
                hidField.id = hidField.name = '__EVENTTARGET';
                frm.appendChild(hidField);
            }

            if (!frm.__EVENTARGUMENT)
            {
                hidField = document.createElement('input');
                hidField.type = 'hidden';
                hidField.id = hidField.name = '__EVENTARGUMENT';
                frm.appendChild(hidField);
            }

            frm.__EVENTTARGET.value = instance.name;
            frm.__EVENTARGUMENT.value = arg;
        },

        /** 
        * Clones the source component. This method should not be invoked by client code directly but only from inside component code.
        * @param {componyx.UI.base.Component} source The source component.
        * @param {componyx.UI.base.Component} parent The parent component.
        * @param {Boolean} [cloneTemplates=true] A value indicating if templates are cloned.
        * @param {Boolean} [cloneEvents=true] A value indicating if events are cloned.
        * @param {Object} [omitKeys=null] An object with keys to omit from cloning.
        * @function componyx.UI.base.methods#clone
        * @protected
        */
        clone: function (source, parent, cloneTemplates, cloneEvents, omitKeys)
        {
            let target = this,
                id = target.id,
                container = target.containerElement;

            // set theme and render state
            target.theme = parent.theme;
            target.themeName = parent.themeName;
            target.renderState = $base.static.RenderState.NONE;

            // add to internal storage
            parent.store.push(id);

            if (!source)
                return;

            if (!omitKeys)
                omitKeys = {};

            source.collectTemplates(); // make sure that templates are collected
            let omit = $lib.clone({ element: '', events: '', templates: '', store: '', attributeObserver: '', removalObserver: '', observing: '' }, omitKeys);
            $lib.clone(target, source, true, true, true, true, true, null, omit);

            // clone events and templates separately
            if (cloneEvents != false)
                target.cloneEvents(source.events);

            if (cloneTemplates != false)
                target.templates = new Map(source.templates);

            target.id = id;
            target.containerElement = container;
            target.theme = parent.theme;
            target.themeName = parent.themeName;
            target.renderState = $base.static.RenderState.NONE;
        },

        /** 
        * Clones component properties. This method should not be invoked by client code directly but only from inside component code.
        * @param {Object} properties The properties to clone.
        * @function componyx.UI.base.methods#cloneProperties
        * @protected
        */
        cloneProperties: function (properties)
        {
            const instance = this;
            let changed = false;

            if (properties.events)
            {
                instance.cloneEvents(properties.events);
                changed = true;
            }
            delete properties.events;

            for (const key in properties)
            {
                const value = properties[key];
                const prev = instance[key];

                if (value === null || typeof value !== 'object')
                    instance[key] = value; // primitive or null assigned directly
                else if (Array.isArray(value) || $lib.isPlainObject(value, true))
                {
                    const report = { changed: false };
                    instance[key] = $lib.clone({
                        target: Array.isArray(value) ? instance[key] || [] : instance[key] || {},
                        source: value,
                        deep: true,
                        overwrite: true,
                        extend: true,
                        excludeEmpty: 2,
                        excludeFunctions: false,
                        report: report
                    }); // deep clone arrays/objects

                    if (!changed && report.changed)
                        changed = true;

                    continue; // report already tells us definitively whether this key changed, skip the reference check below
                }
                else
                    instance[key] = value; // assign class instances, natives, etc by reference

                if (!changed && instance[key] !== prev)
                    changed = true;
            }

            return changed;
        },

        /** 
        * Clones component events. This method should not be invoked by client code directly but only from inside component code.
        * @param {componyx.UI.base.Events} source The source events.
        * @function componyx.UI.base.methods#cloneEvents
        * @protected
        */
        cloneEvents: function (source)
        {
            let target = this.events,
                handler, src,
                copyHandlers = function (handlers, target, priority)
                {
                    if (!handlers)
                        return;

                    handlers.forEach(function (handler, guid)
                    {
                        $lib.each(handler, function (h)
                        {
                            if (priority)
                                target.priorityAdd(h.handler, h.args, h.fireOnce);
                            else
                                target.add(h.handler, h.args, h.fireOnce);
                        });
                    });
                };

            for (let name in source)
            {
                if (!target[name])
                    target[name] = $base.static.createEvent(name);

                if (target[name].add)
                {
                    src = source[name];

                    if (typeof (src) === "string") // html registered events
                    {
                        src = _getMethod(src);

                        if (src)
                        {
                            src.__guid = source[name]; // deterministic guid, tied to the raw expression

                            if (!target[name].has(src)) // check if the handler already exists
                                target[name].add(src);
                        }
                    }
                    else if (typeof (src) === "function") // instance initialization with function
                        target[name].add(src);
                    else if (src && src.isBound && src.isBound())
                    {
                        copyHandlers(src.priorityHandlers(), target[name], true);
                        copyHandlers(src.handlers(), target[name]);
                    }
                }
            }
        },

        /** 
        * Checks the focus state of the component and fires the focus event accordingly. This method should not be invoked by client code directly but only from inside component code.
        * @param {componyx.UI.base.Component} [instance] A component for which to check the focus state.
        * @function componyx.UI.base.methods#onFocus
        * @protected
        */
        onFocus: function (instance)
        {
            instance = instance || this;

            if (instance.__focus)
                return;

            instance.__focus = true;
            instance.events.onFocus.fire(instance);
        },

        /** 
        * Checks the blur state of the component and fires the blur event accordingly. This method should not be invoked by client code directly but only from inside component code.
        * @param {componyx.UI.base.Component} [instance] A component for which to check the blur state.
        * @function componyx.UI.base.methods#onBlur
        * @protected
        */
        onBlur: function (instance)
        {
            instance = instance || this;

            if ($lib.event && $lib.event.relatedTarget && instance.element.contains($lib.event.relatedTarget))
                return;

            instance.__focus = false;
            instance.events.onBlur.fire(instance);
        },

        /** 
        * Delegates focus events on the current instance to the specified instance. This method should not be invoked by client code directly but only from inside component code.
        * @param {componyx.UI.base.Component} instance The component instance to which the focus / blur events are delegated.
        * @function componyx.UI.base.methods#delegateFocusEvents
        * @protected
        */
        delegateFocusEvents: function (instance)
        {
            this.events.onFocus.priorityAdd(instance.onFocus, instance);
            this.events.onBlur.priorityAdd(instance.onBlur, instance);
        },

        /** 
        * Creates a (hidden) input field to store the input value and syncs it with the component. This method should not be invoked by client code directly but only from inside component code.
        * @param {String} sourceElementId The identifier of the source element.
        * @param {Function} onChange The handler for the event which fires when the hidden input value changes.
        * @param {bool} isHidden A value indicating if it is a hidden input.
        * @function componyx.UI.base.methods#createHiddenInput
        * @protected
        */
        createSyncedInput: function (sourceElementId, onChange, isHidden = true)
        {
            let input = document.createElement('input'),
                classInstance = this;

            if (sourceElementId)
            {
                input = this.getSourceElement(sourceElementId);

                if (input.disabled)
                    this.disabled = true;
                if (input.readOnly)
                    this.readOnly = true;
            }

            if (isHidden)
                input.type = 'hidden';

            // store synced value
            input.__value = input.value;

            if (!$lib.isEmpty(this.name))
                input.setAttribute('name', this.name);

            // Save native descriptor
            const nativeValueDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

            // Override value property
            Object.defineProperty(input, "value", {
                get()
                {
                    return nativeValueDesc.get.call(this);  // Return native value to reflect user input
                },
                set(value)
                {
                    if (this.__value === value)
                        return;

                    nativeValueDesc.set.call(this, value); // Update native value so UI stays in sync
                    this.__value = value; // Keep internal __value synced

                    if (onChange)
                        onChange.apply(input, [classInstance]);
                },
                configurable: true
            });

            input.__setValue = function (value)
            {
                if (value == this.__value)
                {
                    return;
                }

                // Update both native and internal value
                this.__value = value;
                nativeValueDesc.set.call(this, value);

                if (classInstance?.__suppressNextChangeEvent)
                {
                    return;
                }

                $lib.fireEvent(this, 'change'); // Fire HTML change
            }.bind(input);

            return this.element.appendChild(input);
        },

        /** 
        * Gets the source element. This method should not be invoked by client code directly but only from inside component code.
        * @param {String} elementId The identifier of the source element.
        * @function componyx.UI.base.methods#getSourceElement
        * @protected
        */
        getSourceElement: function (elementId)
        {
            var el = $lib('#' + elementId);

            if (el)
            {
                if (!this.keepInputId)
                    el.removeAttribute('id');

                $UI.__sourceElements[elementId] = el;

                let change = el.onchange;
                el.onchange = null; // we do not wan't to fire the onchange when the element is removed from DOM
                el.remove();
                el.onchange = change;
            }
            else
                el = $UI.__sourceElements[elementId];

            if (!this.cloneInput)
                return el;
            else
            {
                var clone = el.cloneNode(true); // clone attributes
                return (this.keepInputEventHandlers) ? $lib.copyEvents(clone, el) : clone;
            }
        }
    }

    $lib.ready(function ()
    {
        if ($UI.autoDetect !== false)
            $UI.detect.bind(window, null)(); // register component detection on DOM ready event
    });

})(window);