/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

await (async function ()
{
    await import(`${$UI.getScriptResourcePath('Base.Bindary.Core')}`);
    await import(`${$UI.getScriptResourcePath('Base.Bindary.Connection')}`);
    await import(`${$UI.getScriptResourcePath('Base.Bindary.DataUpdater')}`);
    const core = componyx.bindary_modules.core;
    const connection = componyx.bindary_modules.connection;
    const dataUpdater = componyx.bindary_modules.dataUpdater;

    const router = componyx.bindary_modules.router =
    {
        getRouteIndex: function (routePath)
        {
            if (routePath == null)
                return -1;

            let path, match, index = -1;

            while (!match && ++index < $bindary.routes.length)
            {
                path = $bindary.routes[index].path;

                if ($bindary.routes[index].pathExp)
                    match = routePath.match(path);
                else
                    match = path === routePath;
            }

            if (match)
                return index;
            else
                return -1;
        },
        load: function (routePath)
        {
            core.routeError = false;

            let routeIndex = router.getRouteIndex(routePath);

            router.trackHistory(routePath);

            if (routeIndex == -1)
            {
                if ($bindary.routes.length && routePath) // with routes defined, a path that matches none of them is an error
                    router.error({ type: 'route', routePath: routePath });

                return routeIndex;
            }

            if ($lib.isEmpty($bindary.routeIndex)) // first load
                core.createTempViewContainer();
            else if (router.unload($bindary.routeIndex, routePath) === false) // cancel unload when return value is false
                return;

            let route = $bindary.routes[routeIndex],
                observing = ($lib.isEmpty(route.observing)) ? $bindary.observing : route.observing,
                data = route.data,
                viewURL = (core.parseExp(route, routePath, route.viewURL) || route.viewURL || ''),
                controllerURL = (core.parseExp(route, routePath, route.controllerURL) || route.controllerURL || '');

            // new route callback id
            core.routeCallbackId = $lib.guid();

            // store current route URL's
            core.viewURL = (viewURL) ? $bindary.viewRootURL + viewURL : '';
            core.controllerURL = (controllerURL) ? $bindary.controllerRootURL + controllerURL : '';

            core.busy = true;
            $bindary.route = route;
            $bindary.routeIndex = routeIndex;
            $bindary.routePath = routePath;
            $bindary.controller = core.cache.controller[core.controllerURL];

            core.routeRdy[routeIndex] = false;
            core.data = undefined;
            core.preLoad();

            $bindary.routeData = core.cache.routeData[routeIndex] = (core.cache.routeData[routeIndex]) ? core.cache.routeData[routeIndex] : (observing) ? $bindary.observe({}, core.dataLabel[1]) : {};
            $bindary.viewData = core.cache.viewData[routePath] = (core.cache.viewData[routePath]) ? core.cache.viewData[routePath] : (observing) ? $bindary.observe({}, core.dataLabel[2]) : {};

            if (core.controllerURL && $bindary.controller)
                core.srcState(core.controllerURL, true);

            if (core.viewURL)
            {
                core.srcState(core.viewURL, false);

                if (!core.cache.view[core.viewURL])
                {
                    core.xhr.push($lib.load({
                        url: core.viewURL,
                        onSuccess: function (args)
                        {
                            core.srcState(core.viewURL, true);
                            core.cache.view[core.viewURL] =
                            {
                                data: args.data,
                                html: core.tempViewContainer.innerHTML,
                                script: args.script,
                                css: args.css,
                                title: args.title
                            }

                            core.tempViewContainer.innerHTML = '';
                            router.loaded();
                        },
                        onError: (args) => { router.error({ type: 'view', status: args.xhr?.status, url: core.viewURL }); }
                    }, core.tempViewContainer, null));
                }
                else
                {
                    $lib.addHTML(core.cache.view[core.viewURL].data, null, null, function (args)
                    {
                        core.srcState(core.viewURL, true);
                        core.cache.view[core.viewURL].script = args.script;
                        core.cache.view[core.viewURL].css = args.css;
                        core.tempViewContainer.innerHTML = '';
                        router.loaded();
                    });
                }
            }

            if (!$bindary.controller)
            {
                $bindary.controller = core.cache.controller[core.controllerURL] = {};

                if (core.controllerURL)
                {
                    core.srcState(core.controllerURL, false);
                    $lib.addScriptSource(core.controllerURL, null,
                        {
                            onComplete: function (args)
                            {
                                core.srcState(core.controllerURL, true);
                                router.loaded();
                            },
                            onError: function (args)
                            {
                                delete core.cache.controller[core.controllerURL]; // retry on a next visit instead of caching an empty controller
                                router.error({ type: 'controller', url: core.controllerURL });
                            }
                        });
                }
            }

            let param =
            {
                dataRequest: connection.createDataRequestMsg(data, route.dataServerLoad, core.routeCallbackId, true),
                routeReady: function (data) { router.loaded(data); }
            }

            if (core.fireEvent('dataRequest', [param]) !== false)
            {
                if (route.dataConnect != false && $bindary.dataServerURL)
                    connection.dataSend(param.dataRequest); // use default data retrieval
                else
                    router.loaded(null); // no data source
            }
        },
        loaded: function (dataMsg)
        {
            if (core.routeError)
                return;

            if (dataMsg !== undefined)
                core.data = dataMsg;

            if (core.data !== undefined && (!core.viewURL || core.cache.srcReady[core.viewURL]) && (!core.controllerURL || core.cache.srcReady[core.controllerURL]))
            {
                let error = router.isError(core.data);

                core.busy = false;

                if (core.data && !core.isRouteCallback(core.data) && !error) // null value means no data-source
                    return;

                if (!error)
                    core.load();

                dataUpdater.update(core.data);
            }
        },
        unload: function (routeIndex, routePath, windowUnload)
        {
            let advance = core.fireEvent('unload', [routeIndex, routePath, windowUnload]);

            if (advance === false)
            {
                window.history.replaceState({ routePath: $bindary.routePath }, '', getFullPath($bindary.routePath)); // rewrite URL to previous one
                return advance;
            }

            // clear timers
            clearTimeout(core.liveBindTimerId);
            core.clearPendingUpdate();

            // abort active xhr's
            $lib.each(core.xhr, function (xhr) { xhr.abort(true); });

            if (!$bindary.caching)
                $bindary.clearCache();
            else
            {
                if (!$bindary.cacheRouteData)
                    delete core.cache.routeData[$bindary.routeIndex];

                if (!$bindary.cacheViewData)
                    delete core.cache.viewData[$bindary.routePath];

                if (!$bindary.cacheInternalTags)
                    $bindary.clearCache(true, true, true, false, false);
            }

            core.viewURL = core.controllerURL = null;
            core.callbacks = {};
            core.viewTree = null;
            core.xhr = []; // clear xhr array

            if ($bindary.clearViewOnUnload && core.getViewContainer())
                core.getViewContainer().innerHTML = '';

            if ($bindary.route && $bindary.route.dataServerUnload)
            {
                if (windowUnload)
                    $bindary.unload(null, $bindary.route.dataServerUnload);
                else
                    $bindary.dataSend(null, $bindary.route.dataServerUnload, null, null, false);
            }
        },
        error: function (info)
        {
            if (core.routeError) // report only the first failure of a route load, view and controller may both fail
                return;

            core.routeError = true;
            core.busy = false; // the route load has ended, so a next navigation (including Back) can proceed

            if (core.tempViewContainer)
                core.tempViewContainer.innerHTML = '';

            $lib.each(core.xhr, (xhr) => { xhr.abort(true); }); // stop the remaining requests of this route

            core.fireEvent('routeError', [Object.assign({ routePath: $bindary.routePath, route: $bindary.route }, info)]);
        },
        trackHistory: function (routePath)
        {
            core.historyAction = false;

            if (core.allowHistoryScroll && window.history.length == core.historyLength && $bindary.routePath != routePath)
                core.historyAction = true;

            if ($lib.isEmpty($bindary.routeIndex)) // first load
            {
                let pos = window.JSON.parse(window.sessionStorage.getItem('scrollPosition'));

                if (pos && pos.path === routePath)
                {
                    core.historyAction = true;
                    core.scrollPos[routePath] = pos;
                }
                else
                    core.historyAction = false;
            }

            core.historyLength = window.history.length;
            core.allowHistoryScroll = !$bindary.prettyURL; // defaults to true for hash routes and to false for prettyURL's
        },
        isError(dataMsg)
        {
            let isError = false;

            if (!dataMsg)
                return;

            if (!$lib.isArray(dataMsg))
                dataMsg = [dataMsg];

            $lib.each(dataMsg, function (msg)
            {
                return !(isError = (msg.isError) ? true : false); // break when error is found
            });

            return isError;
        }
    }
})();

export default componyx.bindary_modules.router;
