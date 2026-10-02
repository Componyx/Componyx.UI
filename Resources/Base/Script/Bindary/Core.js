/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

await (async function ()
{
    componyx.bindary_modules = componyx.bindary_modules || {};
    const core = componyx.bindary_modules.core =
    {
        liveBindTimers: new WeakMap(),
        cache: null,
        data: null,
        routeRdy: {},
        useShorthand: true,
        prefix: null,
        longPrefix: 'data-bindary-',
        shortPrefix: 'b-',
        hyphenatedAttributes: true,
        dksc: '.',
        ipc: '@',
        dataLabel: ['appData', 'routeData', 'viewData'],
        viewContainer: null,
        xhr: [],
        dataWS: null,
        dataXHR: null,
        viewURL: null,
        controllerURL: null,
        dataChanges: {},
        modelDataChanges: new Map(),
        dataLocks: {},
        repItemClones: {},
        launchRoutePath: null,
        liveBindTimerId: null,
        scrollTimerId: null,
        historyTimerId: null,
        scrollPos: {},
        historyLength: null,
        historyAction: null,
        allowHistoryScroll: null,
        secure: null,
        viewTree: null,
        tempViewContainer: null,
        callbacks: {},
        scrollableRoot: null,
        autoUpdateView: true,
        observing: true,
        observed: null,
        busy: false,
        rendering: false,
        linkRegEx: /^((ftp|http)*s*:\/\/)|^([a-zA-Z]+\:)|^(\.\.\/)|^(\/\/)|^(\#)/gi, // match protocol, protocol-relative, relative URL or hash
        escapeRegEx: /\\\${1}(parent)*$/, // match escaped $parent
        methodRegEx: /(^\${1}(component|context)+.)/, // match $component or $context 
        dataKeyRegEx: /\{\{([^\{\}\s]+)\}\}/gm, // match {{dataKey}}
        hasBindingRegEx: /\{\{([\s\S]*?)\}\}/,
        singleWord: /^(\${0,1}\w+)$/,
        attrRegEx: /((,+\s*|^)([^=\s]+))\s*=+\s*(?=(?:[^'"]*('|")[^\4]*\4)*[^'"]*$)/gm, // match (, )attribute= not within single or double quotes.
        quoteRegEx: /"/g, // find quotes
        timeRegEx: /t|\s?hh|\s?h|:mm|:m|:ss|:s/gi,
        valueKey: '$value',
        parentKey: '$parent',
        key: '$key',
        postRenderFlag: false,
        waiters: [],
        valueHandlers: [],
        templateUpdate: null,
        templateList: null,
        routeCallbackId: null,
        rendered: [],
        components: {},
        pendingUpdate: false, // a full (non-viewTree-scoped) update is queued for the next microtask flush
        pendingFullRender: false, // escalates to true if any queued caller in this batch asked for a full rebuild
        pendingPartialUpdate: false, // a viewTree-scoped (partial) update is queued for the next microtask flush
        pendingPartialFullRender: false,
        pendingTreeItems: new WeakSet(), // items already included in the pending viewTree batch, to dedupe repeat calls
        pendingTreeBatch: [], // accumulates items across multiple calls within the same tick before the batch flushes
        dataBindTrigger: null,
        dataBindLive: false,
        renderPass: 0,
        omit:
        {
            root: '',
            parent: '',
            children: '',
            context: '',
            repeatValue: '',
            value: '',
            element: '',
            repeatElements: '',
            isRendered: '',
            livePath: ''
        },
        attr: {
            id: '',
            view: '',
            context: '',
            value: '',
            html: '',
            bind: '',
            live: '',
            type: '',
            attributes: '',
            hasValue: '',
            repeat: '',
            repeatItemId: '',
            itemId: '',
            filter: '',
            viewFormatter: '',
            dataFormatter: '',
            includable: '',
            include: '',
            component: '',
            observe: '',
            load: '',
            preRender: '',
            postRender: '',
            "if": '',
            "elseIf": '',
            "else": '',
            on: '',
            updateId: '',
            keep: '',
            ignore: ''
        },
        scroller: null,
        sanitizer: null,
        expressionEngine: null,

        getId()
        {
            return $bindary.idPrefix + $lib.guid();
        },

        clearPendingUpdate()
        {
            const complete = core.pendingFullRender;
            core.pendingUpdate = false;
            core.pendingFullRender = false;
            return complete;
        },

        clearPendingPartialUpdate()
        {
            const batch = core.pendingTreeBatch;
            const complete = core.pendingPartialFullRender;

            core.pendingPartialUpdate = false;
            core.pendingTreeBatch = [];
            core.pendingPartialFullRender = false;
            batch.forEach(item => core.pendingTreeItems.delete(item));

            return { batch, complete };
        },

        fireEvent(name, args = [], excludeController)
        {
            let ucase = name.charAt(0).toUpperCase() + name.slice(1),
                eventName = 'on' + ucase,
                ctrlResult,
                cancelToken = { cancel: false };

            if (!args)
                args = [];

            args.push(cancelToken);

            if ($bindary.route && !excludeController)
            {
                let route = $bindary.route,
                    controller = $bindary.controller,
                    method = core.parseExp(route, core.getRoutePath(), route['controller' + ucase]) || name;

                if (controller && controller[method])
                    ctrlResult = controller[method].apply(controller, args);
            }

            if ($bindary[eventName])
                $bindary[eventName].fire($bindary, args);

            if (ctrlResult === false || cancelToken.cancel === true) // cancelToken.cancel is prefered, others are for backwards compatibility
                return false;
        },

        srcState(url, ready)
        {
            core.cache.srcReady[url] = ready;
        },

        preLoad()
        {
            core.fireEvent('preLoad', null, true);
        },

        load()
        {
            if (core.viewURL)
                core.setTitle(core.cache.view[core.viewURL].title);

            core.fireEvent('load');
        },

        preRender(triggerElement)
        {
            core.dataBindTrigger = triggerElement;
            core.busy = true;
            core.rendering = true;
            core.fireEvent('preRender');
        },

        postRender()
        {
            // if includes are loading set ready flag and call from finished include
            if (core.hasLoadingIncludes())
            {
                core.postRenderFlag = true;
                return;
            }

            core.dataBindTrigger = null;
            core.dataBindLive = false;
            core.postRenderFlag = false;
            core.busy = false;
            core.rendering = false;
            core.setRenderStates();

            if ($bindary.linkDispatching)
                core.dispatchLinks();

            core.dataChanges = {}; // clear data changes
            core.modelDataChanges = new Map();

            core.fireEvent('postRender');

            if (core.routeCallbackId)
                core.postLoad();
        },

        postLoad()
        {
            core.scroller.init(undefined, $bindary.routePath);

            core.routeCallbackId = null;
            core.routeRdy[$bindary.routeIndex] = true;
            core.data = undefined;
            core.fireEvent('postLoad');
        },

        setTitle(title)
        {
            let baseTitle = $bindary.baseTitle || '';

            if (title)
                document.title = baseTitle + title;
            else if (!document.title)
                document.title = baseTitle;
        },

        setRenderStates()
        {
            $lib.each(core.rendered, function (item)
            {
                item.isRendered = true;
            }); // set rendered state for elements within repeat when all repeat-elements are rendered
            core.rendered = [];
        },

        hasLoadingIncludes()
        {
            let loading = false;

            $lib.each(core.cache.include, function (include)
            {
                return !(loading = include.loading);
            });

            return loading;
        },

        createTempViewContainer()
        {
            if (!core.tempViewContainer)
            {
                core.tempViewContainer = document.createElement('div');
            }
        },

        getViewContainer()
        {
            if (!core.viewContainer)
            {
                core.viewContainer = $lib(function (el)
                {
                    return (el.hasAttribute(core.attr.view));
                }, null, '', true);
            }

            return core.viewContainer;
        },

        isRouteCallback(dataMsg)
        {
            return (core.routeCallbackId && !$lib.isEmpty(dataMsg) && (dataMsg.callbackId === core.routeCallbackId || $lib.indexOf(dataMsg, function (msg) { return (core.routeCallbackId == msg.callbackId); }) > -1));
        },

        parseExp(route, routePath, text)
        {
            if (!route || !route.pathExp || !text || text.search(/\$\d/) == -1)
                return text;

            let exp = route.path,
                match = exp.exec(routePath);

            for (let index = 0; index < match.length; ++index)
            {
                text = text.replace($lib.format('${0}', index), match[index] || '');
            }

            route.path.lastIndex = 0; // always reset
            return text;
        },

        getTemplateFlags(el, flags)
        {
            const result = Object.fromEntries(flags.map(key => [key, undefined]));

            for (let parent = el; parent; parent = parent.parentElement)
            {
                for (const key of flags)
                {
                    if (result[key] !== undefined) continue;

                    const attrValue = parent.getAttribute(core.attr[key]);
                    if (attrValue !== null)
                    {
                        if (attrValue === 'true') result[key] = true;
                        else if (attrValue === 'false') result[key] = false;
                        else if (attrValue === '' || attrValue === 'null') result[key] = null;
                        else
                        {
                            const num = Number(attrValue);
                            result[key] = isNaN(num) ? null : num;
                        }
                    }
                }

                if (flags.every(key => result[key] !== undefined))  // Exit early if all flags have been resolved
                    break;
            }

            return result;
        },

        keepAttributes(el)
        {
            const { keep } = core.getTemplateFlags(el, ['keep']);

            if (keep !== undefined && keep !== null)
            {
                return keep;
            }

            return $bindary.keepAttributes;
        },

        setItemPlaceHolder(item, element)
        {
            core.createPlaceHolder(item, element.parentElement, element);

            if (!item.inRepeat && !item.repeatDataKey)
                item.isRendered = false;

            if (!item.repeatDataKey || element != item.repeatPlaceHolder)
                $lib.remove(element);
        },

        createPlaceHolder(item, parent, before)
        {
            let node = item.sourceElement.nodeName,
                placeHolder = document.createElement(node);
            placeHolder.style.display = 'none';
            placeHolder.setAttribute(core.attr.id, item.id);

            if (!item.inRepeat)
                placeHolder.id = item.id;

            placeHolder._bindaryPlaceholder = true;

            if (before)
                parent.insertBefore(placeHolder, before);
            else
                parent.appendChild(placeHolder);

            return placeHolder;
        },

        dispatchLinks(container)
        {
            let baseHref = core.getBaseHref();

            if (baseHref.match(core.linkRegEx)) // links are not dispatchable because of base href
                return;

            $lib(core.dispatchLink, container || document, 'a');
        },

        dispatchLink(a)
        {
            if (!core.dispatchable(a))
                return;

            if ($bindary.prettyURL && !$lib.has(a, 'click', core.dispatch))
                $lib.on(a, 'click', core.dispatch);
            else if (!$bindary.prettyURL)
                a.href = '#' + a.href;
        },

        dispatch(e)
        {
            let href = this.getAttribute('href'),
                target = this.getAttribute('target'),
                baseHref = core.getBaseHref(),
                routePath = baseHref + href.replace(/^\//, '');

            if (!core.dispatchable(this) || baseHref.match(core.linkRegEx))
                return;

            if (core.isBookmarkJump(routePath))
                return;

            this.href = 'javascript:void(0);';
            setTimeout(function (href) { this.href = href; }.bind(this, href), 0);
            $bindary.loadRoute(routePath);
        },

        dispatchable(a)
        {
            let href = a.getAttribute('href'),
                target = a.getAttribute('target');
            return (!$lib.isEmpty(href) && $lib.isEmpty(target) && !href.match(core.linkRegEx))
        },

        getBaseHref()
        {
            let head = $lib(null, document, 'head', true),
                base = $lib(null, head, 'base', true),
                href = (base) ? base.getAttribute('href') : '';

            return (href === '/') ? '' : href;
        },

        getRoutePath()
        {
            let rootPath = $bindary.rootPath || '/',
                routePath = null;

            if ($bindary.prettyURL)
                routePath = location.pathname.replace(rootPath, '');
            else
                routePath = core.getHashtag();

            return ($lib.isEmpty(routePath)) ? '' : decodeURIComponent(routePath);
        },

        getLocationOrigin()
        {
            if (window.location.origin)
                return window.location.origin;
            else
                return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        },

        getHashtag()
        {
            let hash = window.location.hash.split('#')[1];

            if ($lib.isEmpty(hash))
                return null;

            if (hash.indexOf('!') == 0) // hash-bang
                hash = hash.substr(1);

            return hash;
        },

        getAnchor()
        {
            let anchor, hash,
                href = window.location.href, index = href.lastIndexOf('#');

            if ($bindary.prettyURL && window.location.hash)
                anchor = window.location.hash.substr(1);
            else if (!$bindary.prettyURL && index > -1)
            {
                hash = href.substr(index + 1);

                if (href.substr(href.indexOf('#') + 1) !== hash)
                    anchor = hash;
            }

            return anchor;
        },

        removeAnchor(routePath)
        {
            let hashIndex;

            if ((hashIndex = routePath.indexOf('#')) > -1)
                routePath = routePath.substr(0, hashIndex);

            return routePath;
        },

        isBookmarkJump(routePath)
        {
            return (core.removeAnchor(routePath) === $bindary.routePath && (($bindary.prettyURL && routePath.indexOf('#') > -1) || (!$bindary.prettyURL && core.getAnchor())));
        },

        getFullPath(routePath)
        {
            return core.getLocationOrigin() + $bindary.rootPath + routePath;
        },

        initCache()
        {
            core.cache = { srcReady: {}, view: {}, controller: {}, routeData: {}, viewData: {}, include: {} };
        },

        clearCache(keepControllers, keepExternalScripts, keepExternalCSS, keepInternalScripts, keepInternalCSS)
        {
            let clear = function (item)
            {
                let tags = (keepExternalScripts && keepInternalScripts) ? [] : item.script;
                tags = (keepExternalCSS && keepInternalCSS) ? tags : tags.concat(item.css);

                $lib.each(tags, function (tag)
                {
                    let nodeName = tag.nodeName.toLowerCase();

                    if ((nodeName == 'style' && !keepInternalCSS)
                        || (nodeName == 'link' && !keepExternalCSS)
                        || (nodeName == 'script' && tag.src && !keepExternalScripts)
                        || (nodeName == 'script' && tag.text && !keepInternalScripts))
                    {
                        $lib.remove(tag);
                    }
                });
            };

            if (!keepControllers)
            {
                $lib.each(core.cache.controller, function (tag)
                {
                    $lib.remove(tag);
                });
            }

            if (!(keepExternalScripts && keepExternalCSS && keepInternalScripts && keepInternalCSS))
            {
                $lib.each(core.cache.view, function (item) { clear(item); });
                $lib.each(core.cache.include, function (item) { clear(item); });
            }

            if (!keepControllers && !keepExternalScripts && !keepExternalCSS && !keepInternalScripts && !keepInternalCSS)
                core.initCache();
        },

        initializePrefix(prefix, hyphenatedAttributes=true)
        {
            core.prefix = prefix;
            core.hyphenatedAttributes = hyphenatedAttributes;
            Object.keys(core.attr).forEach((key) =>
            {
                core.attr[key] = prefix + (core.hyphenatedAttributes ? core.camelToKebab(key) : key.toLowerCase());
            });
        },

        camelToKebab(text)
        {
            return text.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        },

        clearWaiters()
        {
            let index = core.waiters.length, waiter;

            if (index == 0)
                return;

            while (--index)
            {
                waiter = core.waiters[index];

                if (!waiter.waiting)
                    core.waiters.splice(index, 1);
            }
        },

        useWS()
        {
            return ($bindary.useWebSocket && $bindary.websocketSupport);
        },

        formatDate(date, format)
        {
            format = format || $bindary.dateFormat;
            return $lib.formatDate(date, format);
        },

        customEventHandler()
        {
            core.eventHandler.apply(this, arguments);
        },

        eventHandler(method, item, treeState, args, internal, context, e)
        {
            item.restoreContext(treeState);

            if (!internal)
                core.call(method, [item, e], context);
            else
            {
                let methodArgs = [];
                methodArgs.unshift(item);
                args.push(e);
                method.apply(this, methodArgs.concat(args));
            }
        },

        call(method, args, context)
        {
            if (!method)
                return;

            let item = args[0];

            if (!context)
                context = core.getMethodContext(method, item);

            method = core.methodName(method);

            let contextTree = method.split('.'), length = contextTree.length;

            $lib.each(contextTree, function (name, index)
            {
                if (!context && $bindary.controller && $bindary.controller[name])
                    context = $bindary.controller;
                else if (!context)
                    context = window;

                method = context[name];

                if (index != length - 1)
                    context = context[name];
            });

            return method.apply(context, args);
        },

        methodName(method)
        {
            let p = '$component', c = '$context';

            method = method.replace(core.methodRegEx, ''); // replace $component. and $context.
            return method.replace('\\' + p, p).replace('\\' + c, c) // replace escaped keys
        },

        getMethodContext(method, item)
        {
            if (!method)
                return null;

            let keys = method.split('.');

            if (core.isKey(keys[0], '$context'))
                return item.context;

            if (!item.isComponent || !core.isKey(keys[0], '$component'))
                return null;

            while (!item.component)
                item = item.parent;

            return item.context;
        },

        resolveContentExpression(el)
        {
            const nodes = el.childNodes;
            let hasElementChild = false;
            const candidates = [];

            for (let i = 0; i < nodes.length; i++)
            {
                const n = nodes[i];

                if (n.nodeType === 1)
                    hasElementChild = true;
                else if (n.nodeType === 3 && n.data.includes('{{'))
                    candidates.push(n);
            }

            if (candidates.length === 0)
                return false; // nothing to do

            if (!hasElementChild)
                return true; // pure-text, existing whole-content path handles it, unchanged

            for (const textNode of candidates)
            {
                const span = document.createElement('span');
                span.textContent = textNode.data;
                textNode.replaceWith(span);
            }

            return false; // this element itself is no longer a content-expression node; the new spans get discovered independently below
        },

        hasContentExpression(el)
        {
            const nodes = el.childNodes;
            let index = nodes.length;

            while (index--)
            {
                const n = nodes[index];

                if (n.nodeType === 1) // ELEMENT_NODE
                    return false;

                if (n.nodeType === 3 && n.data.includes('{{'))
                    return true;
            }

            return false;
        },

        hasExpression(text)
        {
            return (text.indexOf('{{') > -1 && text.match(core.hasBindingRegEx) !== null);
        },

        isKey(text, key)
        {
            return (text && text.indexOf(key) == 0);
        },

        dataKeyMatch(key, startKey)
        {
            return (key && startKey && $lib.startsWith(key, startKey + core.dksc));
        },

        literalContainsKey(value)
        {
            let left = (value.match(/\{/g) || []).length,
                right = (value.match(/\}/g) || []).length;

            return ((left >= 1 && left % 2 == 0) && (right >= 1 && right % 2 == 0));
        },

        escapeDataKey(dataKey)
        {
            $lib.each(dataKey, function (item, index) { dataKey[index] = item.replace(core.escapeRegEx, '$$1'); });
        },

        toBoolean(text)
        {
            if (!text)
                return false;

            switch (text.toLowerCase().trim())
            {
                case "false": case "no": case "0": return false;
                default: return true;
            }
        },

        getElementValue(item)
        {
            const el = item.element;

            for (const handler of core.valueHandlers)
            {
                if (handler.matcher(item) && handler.getValue)
                {
                    return handler.getValue(el);
                }
            }

            return (el.contentEditable == 'true') ? el.innerHTML : el.value;
        },

        setElementValue(item, value, isHTML)
        {
            const el = item.element;

            for (const handler of core.valueHandlers)
            {
                if (handler.matcher(item) && handler.setValue)
                {
                    return handler.setValue(el, value);
                }
            }

            if (isHTML && el.innerHTML != value)
                el.innerHTML = value;
            else if (!isHTML)
                $lib.setText(el, value);
        },

        createJSON(text)
        {
            return text.replace(core.quoteRegEx, '\\"').replace(core.attrRegEx, '"$2"$3":"').substr(1) + '"'; // first escape all double-quotes, than replace attribute matches and finally remove extra double-quote at beginning and add one at the end
        },

        addDataContainer(dataKey, isRoot)
        {
            if (!dataKey)
                return null;

            let container, index = 0, root = dataKey[0], addSymbol;

            if (root == core.parentKey || root == core.valueKey || root == core.key)
            {
                isRoot = false;
            }
            else if (root == '$')
            {
                isRoot = true;
                root = dataKey[1] || root;
                ++index;
            }
            else if (isRoot)
                addSymbol = true;

            if (isRoot && $lib.indexOf(core.dataLabel, root) == -1)
            {
                if (root in $bindary.viewData)
                    container = core.dataLabel[2];
                else if (root in $bindary.routeData)
                    container = core.dataLabel[1];
                else if (root in $bindary.appData)
                    container = core.dataLabel[0];

                if (container)
                    dataKey.splice(index, 0, container);
            }

            if (addSymbol)
                dataKey.splice(0, 0, '$');

            return dataKey;
        }
    };
})();

export default componyx.bindary_modules.core;






