/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

await (async function ()
{
    await import(`${$UI.getScriptResourcePath('Base.Bindary.Core')}`);
    await import(`${$UI.getScriptResourcePath('Base.Bindary.DataUpdater')}`);
    const core = componyx.bindary_modules.core;
    const dataUpdater = componyx.bindary_modules.dataUpdater;

    const connection = componyx.bindary_modules.connection =
    {
        connect: function (dataRequest)
        {
            let settings,
                reloadPage = function (event)
                {
                    if (event && event.code)
                        $lib.log($lib.trim(event.code + " " + event.reason));
                    setTimeout(function () { window.location.reload(); }, 0);
                }

            if ($bindary.connected || !$bindary.dataServerURL)
                return;

            $bindary.dataServerURL = connection.getDataServerURL($bindary.dataServerURL);

            if (core.useWS())
            {
                core.dataWS = $lib.ws({
                    url: $bindary.dataServerURL, onOpen: function (event)
                    {
                        core.fireEvent('webSocketOpen', [core.dataWS, event]);
                        $bindary.connected = true;
                        core.dataWS.send(dataRequest);
                    },
                    onMessage: function (event) { connection.received(window.JSON.parse(event.data)); },
                    onClose: function (event)
                    {
                        $bindary.connected = false;
                        core.fireEvent('webSocketClose', [core.dataWS, event]);

                        const reconnectCodes = [1006, 1011, 1012, 1013];

                        if (reconnectCodes.includes(event.code) && $bindary.reloadPageOnWebSocketServerError)
                            reloadPage(event);
                    }
                });
            }
            else if ($bindary.dataServerURL)
            {
                settings =
                {
                    url: $bindary.dataServerURL,
                    repeatInterval: $bindary.xhrUpdateInterval,
                    data: dataRequest,
                    onSuccess: function (args)
                    {
                        if ($bindary.dataRequest.initialLoad)
                        {
                            $bindary.dataRequest.initialLoad = false;
                            args.settings.data = window.JSON.stringify($bindary.dataRequest);
                        }

                        $bindary.connected = true;
                        connection.xhrResponse(args);
                    }
                }

                core.dataXHR = $lib.xhr(settings);
                core.xhr.push(core.dataXHR);
            }
        },
        disconnect: function ()
        {
            if (!$bindary.connected)
                return;

            if (core.useWS())
                core.dataWS.close();
            else
                core.dataXHR.abort(true);

            core.dataWS = core.dataXHR = null;
            $bindary.connected = false;
        },
        getDataServerURL: function (url)
        {
            let relative = $bindary.relativeDataServerURL;
            let secure = ($bindary.secure != null) ? $bindary.secure : core.secure;

            if (core.useWS() && (!/^(ws+s*\:\/\/)/gi.test(url)))
            {
                url = (secure) ? "wss://" + url : "ws://" + url;
            }
            else if (!core.useWS() && !relative && !/^(http+s*\:\/\/)/gi.test(url))
            {
                url = (secure) ? "https://" + url : "http://" + url;
            }

            return url;
        },
        dataSend: function (dataRequest, custom)
        {
            if (!$bindary.dataServerURL)
                return;

            dataRequest = connection.stringifyQuery(dataRequest);

            if (custom && !core.useWS()) // create new xhr because the default data xhr is in repeating modus
            {
                let settings =
                {
                    url: $bindary.dataServerURL,
                    data: dataRequest,
                    onSuccess: function (args)
                    {
                        connection.xhrResponse(args);
                    }
                }

                return $lib.xhr(settings).xhr;
            }
            else
            {
                if (!$bindary.connected || (core.useWS() && core.dataWS.readyState !== core.dataWS.OPEN))
                {
                    $bindary.connected = false;
                    connection.connect(dataRequest);
                }
                else if (core.useWS())
                    core.dataWS.send(dataRequest);
                else
                {
                    core.dataXHR.abort(true); // abort current repeating xhr
                    core.dataXHR.settings.data = dataRequest; // set new query
                    core.dataXHR = $lib.xhr(core.dataXHR.settings); // fire new xhr with previous settings
                }

                if (core.useWS() && custom)
                    return core.dataWS;
            }
        },
        xhrResponse: function (args)
        {
            if (!args.data)
                return;

            let dataMsg = args.data,
                lastIndex = ($lib.isArray(dataMsg)) ? dataMsg.length - 1 : -1,
                clientId = (lastIndex > -1) ? dataMsg[lastIndex].clientId : dataMsg.clientId; // clientId is required

            if ($lib.isEmpty($bindary.clientId) && !$lib.isEmpty(clientId)) // check if client id is generated on the server
            {
                $bindary.clientId = clientId;

                if (core.dataXHR)
                {
                    if (typeof core.dataXHR.settings.data == 'string')
                        core.dataXHR.settings.data = window.JSON.parse(core.dataXHR.settings.data);

                    core.dataXHR.settings.data.clientId = $bindary.clientId; // send client id with next xhr request
                }
            }

            connection.received(dataMsg);
        },
        received: function (dataMsg)
        {
            if (!dataMsg)
                return;

            let lastIndex = ($lib.isArray(dataMsg)) ? dataMsg.length - 1 : -1,
                clientId = (lastIndex > -1) ? dataMsg[lastIndex].clientId : dataMsg.clientId; // clientId is required

            if ($lib.isEmpty($bindary.clientId) && !$lib.isEmpty(clientId))
                $bindary.clientId = $bindary.dataRequest.clientId = clientId;

            if ($lib.isEmpty($bindary.routeIndex) || core.routeRdy[$bindary.routeIndex]) // no route or route is loaded
                dataUpdater.update(dataMsg);
            else if (!core.isRouteCallback(dataMsg))
                dataUpdater.update(dataMsg, false);
            else
                connection.routeLoaded(dataMsg) // data update for new route
        },
        routeLoaded: async function (dataMsg)
        {
            await import(`${$UI.getScriptResourcePath('Base.Bindary.Router')}`);
            componyx.bindary_modules.router.loaded(dataMsg); // data update for new route
        },
        createDataRequestMsg(data, serverMethod, callbackId, initialLoad, webSocketUpdate)
        {
            let route = $bindary.routes[$bindary.routeIndex],
                dataRequestString,
                dataRequestObj = {}
            dataRequestObj.clientId = $bindary.clientId || null;
            dataRequestObj.routeIndex = $bindary.routeIndex;
            dataRequestObj.routePath = $bindary.routePath;
            dataRequestObj.serverMethod = core.parseExp(route, $bindary.routePath, serverMethod || "") || "";
            dataRequestObj.callbackId = callbackId || null;
            dataRequestObj.initialLoad = initialLoad || false;
            dataRequestObj.webSocketUpdate = webSocketUpdate || false;
            dataRequestObj.data = core.parseExp(route, $bindary.routePath, (connection.stringifyQuery(data)));

            dataRequestString = JSON.stringify(dataRequestObj);
            $bindary.dataRequest = dataRequestObj;
            return dataRequestString;
        },
        stringifyQuery(dataRequest)
        {
            return (dataRequest && typeof (dataRequest) == 'object') ? JSON.stringify(dataRequest) : dataRequest || null;
        }
    }
})();

export default componyx.bindary_modules.connection;


