'use strict';

/**
 * Server-side data structures and update logic for Bindary:
 *   - DataRules
 *   - DataContainer
 *   - DataResponse
 *   - Subscription
 *   - DataUpdateManager
 *   - ClientActivityMonitor
 */

// ---------------------------------------------------------------------------
// DataRules
// ---------------------------------------------------------------------------

/**
 * This type is used to set update rules for the client data.
 * @memberof componyx.bindary
 */
class DataRules
{
    constructor()
    {
        /**
         * Gets or sets the route index for updating route data on a different route than the currently active route.
         * @type {string|null}
         */
        this.routeIndex = null;

        /**
         * Gets or sets the route path for updating view data on a different view than the currently active view.
         * @type {string|null}
         */
        this.routePath = null;

        /**
         * Gets or sets the hierarchical path on the target object where the source object will be added/updated.
         * @type {string|null}
         */
        this.path = null;

        /**
         * Gets or sets the key used to match and update items on the target array. The array item is
         * updated when the value on both source and target of specified key matches.
         * @type {string|null}
         */
        this.updateKey = null;

        /**
         * Gets or sets a collection of key values to remove. Items on the target client object with a
         * matching value for the specified UpdateKey will be removed.
         * @type {string[]|null}
         */
        this.removeByKeyValues = null;

        /**
         * Gets or sets the position within the array where the items must be added. Do not specify the
         * index (Null/Undefined) when items must be added at the end of the array.
         * @type {number|null}
         */
        this.addIndex = null;

        /**
         * Gets or sets the position within the array where the items must be removed. Do not specify the
         * index (Null/Undefined) when items must be removed at the end of the array.
         * @type {number}
         */
        this.removeIndex = 0;

        /**
         * Gets or sets the number of items to remove from the target array.
         * @type {number}
         */
        this.removeCount = 0;

        /**
         * Gets or sets a value indicating if null values in the response data will be ignored.
         * @type {boolean}
         */
        this.ignoreNullValues = false;

        /**
         * Gets or sets a value indicating if server data overwrites (false) or updates (true) data on the client.
         * @type {boolean|null}
         */
        this.update = null;

        /**
         * Gets or sets a value indicating whether incoming data responses are compared for equality before
         * updating to avoid redundant changes.
         * @type {boolean|null}
         */
        this.equalityCheck = null;

        /**
         * Gets or sets a value indicating if the HTML element must be recreated when there is already an
         * element for the relevant index/key.
         * @type {boolean|null}
         */
        this.recreate = null;

        /**
         * Gets or sets a collection of keys to omit on the target client object.
         * @type {Set<string>|null}
         */
        this.omitKeys = null;
    }
}

// ---------------------------------------------------------------------------
// DataContainer
// ---------------------------------------------------------------------------

/**
 * This type is used to represent the client response data container.
 * @memberof componyx.bindary
 */
class DataContainer
{
    constructor()
    {
        /**
         * Gets or sets the AppData.
         * @type {object|null}
         */
        this.appData = null;

        /**
         * Gets or sets the AppData update rules, keyed by property name (case-insensitive, lowercased).
         * Kept as a plain object rather than a Map, since it's passed straight to JSON.stringify.
         * @type {Object<string, componyx.bindary.DataRules>|null}
         */
        this.appDataRules = null;

        /**
         * Gets or sets the ViewData.
         * @type {object|null}
         */
        this.viewData = null;

        /**
         * Gets or sets the ViewData rules, keyed by property name (case-insensitive, lowercased).
         * @type {Object<string, componyx.bindary.DataRules>|null}
         */
        this.viewDataRules = null;

        /**
         * Gets or sets the RouteData.
         * @type {object|null}
         */
        this.routeData = null;

        /**
         * Gets or sets the RouteData update rules, keyed by property name (case-insensitive, lowercased).
         * @type {Object<string, componyx.bindary.DataRules>|null}
         */
        this.routeDataRules = null;
    }
}

// ---------------------------------------------------------------------------
// DataResponse
// ---------------------------------------------------------------------------

/**
 * This type is used to represent the client response data.
 * @memberof componyx.bindary
 */
class DataResponse
{
    /**
     * @param {string|null} [callbackId]  - Client-side callback identifier from the data request.
     * @param {string|null} [clientId]    - Custom client identifier (non-session based).
     */
    constructor(callbackId = null, clientId = null)
    {
        /**
         * Gets or sets the client id that was sent with the original request.
         * @type {string|null}
         */
        this.clientId = clientId;

        /**
         * Gets or sets the identifier of the callback method to invoke on the client.
         * @type {string|null}
         */
        this.callbackId = callbackId || null;

        /**
         * Gets or sets a value indicating that an error occurred.
         * @type {boolean}
         */
        this.isError = false;

        /**
         * Gets or sets the client route index. If the route index is set, the routeData on the client is
         * updated only when the active client route index matches with the data response.
         * @type {number|null}
         */
        this.routeIndex = null;

        /**
         * Gets the client route path. If the route path is set, the viewData on the client is updated only
         * when the active client route path matches with the data response.
         * @type {string|null}
         */
        this.routePath = null;

        /**
         * Gets or sets the custom data within the response data.
         * @type {componyx.bindary.DataContainer}
         */
        this.data = new DataContainer();
    }
}

// ---------------------------------------------------------------------------
// Subscription
// ---------------------------------------------------------------------------

/**
 * Represents a single client's subscription to an update event, along with any arguments bound to that subscription.
 * @memberof componyx.bindary
 */
class Subscription
{
    /**
     * Initializes a new subscription for the specified client.
     * @param {componyx.bindary.Client} client - The subscribing client.
     * @param {object|null} [args] - Arguments to bind to the subscription.
     */
    constructor(client, args = null)
    {
        /**
         * Gets or sets the subscribed client.
         * @type {componyx.bindary.Client}
         */
        this.client = client;

        /**
         * Gets or sets the arguments bound to the subscription.
         * @type {object|null}
         */
        this.args = args;
    }
}

// ---------------------------------------------------------------------------
// DataUpdateManager
// ---------------------------------------------------------------------------

/**
 * This type is used to manage data events by registering update event actions and subscribing clients to these update events.
 * Instantiated rather than static, for clean isolation between tests.
 *
 * The internal key format is groupId + '#' + updateId. A bare group
 * update fires all events whose key starts with groupId + '#'.
 * @memberof componyx.bindary
 */
class DataUpdateManager
{
    /**
     * Registered update actions, keyed by formatted updateId.
     * Each entry is an array of async (client, subscriptionArgs, updateArgs) => void functions.
     * @type {Map<string, Function[]>}
     */
    #updateEvents = new Map();

    /**
     * Active subscriptions, keyed by formatted updateId.
     * @type {Map<string, Subscription[]>}
     */
    #subscriptions = new Map();

    // -----------------------------------------------------------------------
    // Registration
    // -----------------------------------------------------------------------

    /**
     * Adds an update action for the specified Update and/or Group id. At least one of the id's must be provided.
     * @param {string} updateId - The identifier of the update event.
     * @param {Function} action - The action to call when the update event fires.
     * @param {string} [groupId] - The group to which the update belongs.
     */
    addUpdateAction(updateId, action, groupId = '')
    {
        const key = this.#formatKey(updateId, groupId);

        if (!this.#updateEvents.has(key))
            this.#updateEvents.set(key, []);

        this.#updateEvents.get(key).push(action);
    }

    // -----------------------------------------------------------------------
    // Subscription management
    // -----------------------------------------------------------------------

    /**
     * Subscribes a client for an update event.
     * @param {string} updateId - The identifier of the update event.
     * @param {componyx.bindary.Client} client - The client.
     * @param {string} [groupId] - The group to which the update belongs.
     * @param {object|null} [args] - Arguments to bind to the subscription.
     */
    subscribe(updateId, client, groupId = '', args = null)
    {
        const key = this.#formatKey(updateId, groupId);

        if (!this.#subscriptions.has(key))
            this.#subscriptions.set(key, []);

        if (!this.hasSubscription(updateId, client, groupId))
            this.#subscriptions.get(key).push(new Subscription(client, args));
    }

    /**
     * Checks if the client is subscribed to the specified update event.
     * @param {string} updateId - The identifier of the update event.
     * @param {componyx.bindary.Client} client - The client.
     * @param {string} [groupId] - The group to which the update belongs.
     * @returns {boolean} A boolean value indicating if the client is subscribed to the specified update event.
     */
    hasSubscription(updateId, client, groupId = '')
    {
        const key = this.#formatKey(updateId, groupId);

        if (!this.#subscriptions.has(key))
            return false;

        const list = this.#subscriptions.get(key);
        this.#cleanNulls(list);
        return list.some(s => s.client.id === client.id);
    }

    /**
     * Returns the client subscription for the specified update event.
     * @param {string} updateId - The identifier of the update event.
     * @param {componyx.bindary.Client} client - The client.
     * @param {string} [groupId] - The group to which the update belongs.
     * @returns {Subscription|null} The subscription for the specified update event and client.
     */
    getSubscription(updateId, client, groupId = '')
    {
        const key = this.#formatKey(updateId, groupId);

        if (!this.#subscriptions.has(key))
            return null;

        const list = this.#subscriptions.get(key);
        const found = list.find(s => s.client.id === client.id);

        if (found)
            return found;

        this.unsubscribeClientFromEvent(updateId, client, groupId);
        return null;
    }

    /**
     * Returns the subscribed clients for the specified update event.
     * @param {string} updateId - The identifier of the update event.
     * @param {string} [groupId] - The group to which the update belongs.
     * @returns {Subscription[]} List of clients.
     */
    subscriptions(updateId, groupId = '')
    {
        return this.#subscriptions.get(this.#formatKey(updateId, groupId)) ?? [];
    }

    // -----------------------------------------------------------------------
    // Unsubscribe
    // -----------------------------------------------------------------------

    /**
     * Removes all client subscriptions.
     */
    clearSubscriptions()
    {
        this.#subscriptions.clear();
    }

    /**
     * Removes all client subscriptions for the specified update event.
     * @param {string} updateId - The identifier of the update event.
     * @param {string} [groupId] - The group to which the update belongs.
     * @param {boolean} [startsWithSearch] - A value indicating if subscriptions which start with the
     * specified update identifier are removed.
     */
    unsubscribe(updateId, groupId = '', startsWithSearch = true)
    {
        const key = this.#formatKey(updateId, groupId);

        if (!startsWithSearch)
        {
            this.#subscriptions.delete(key);
        }
        else
        {
            for (const k of [...this.#subscriptions.keys()])
            {
                if (k.startsWith(key))
                    this.#subscriptions.delete(k);
            }
        }
    }

    /**
     * Removes all subscriptions of the specified client.
     * @param {componyx.bindary.Client} client - The client.
     * @param {string} [groupId] - The group for which the client subscriptions must be removed.
     */
    unsubscribeClient(client, groupId = '')
    {
        for (const [key, list] of this.#subscriptions)
        {
            if (groupId === '' || key.startsWith(groupId + '#'))
            {
                const filtered = list.filter(s => s.client.id !== client.id);
                this.#subscriptions.set(key, filtered);
            }
        }
    }

    /**
     * Removes the client subscription for the specified update event.
     * @param {string} updateId - The identifier of the update event.
     * @param {componyx.bindary.Client} client - The client.
     * @param {string} [groupId] - The group to which the update belongs.
     * @param {boolean} [startsWithSearch] - A value indicating if subscriptions of the specified client
     * which start with the specified update identifier are removed.
     */
    unsubscribeClientFromEvent(updateId, client, groupId = '', startsWithSearch = true)
    {
        if (!startsWithSearch)
        {
            if (!this.hasSubscription(updateId, client, groupId))
                return;

            const key = this.#formatKey(updateId, groupId);
            const list = this.#subscriptions.get(key);
            this.#subscriptions.set(key, list.filter(s => s.client.id !== client.id));
        }
        else
        {
            const prefix = this.#formatKey(updateId, groupId);

            for (const key of [...this.#subscriptions.keys()])
            {
                if (!key.startsWith(prefix))
                    continue;

                const effectiveUpdateId = groupId
                    ? key.substring(groupId.length + 1)
                    : key;

                if (this.hasSubscription(effectiveUpdateId, client, groupId))
                {
                    const list = this.#subscriptions.get(key);
                    this.#subscriptions.set(key, list.filter(s => s.client.id !== client.id));
                }
            }
        }
    }

    // -----------------------------------------------------------------------
    // Update / fire
    // -----------------------------------------------------------------------

    /**
     * Invokes all update event actions for all subscribers.
     * @param {string} [groupId] - The group to which the update belongs.
     * @param {object|null} [args] - An object to pass as second argument to the action method.
     */
    async updateGroup(groupId = '', args = null)
    {
        const prefix = groupId + '#';

        for (const key of [...this.#subscriptions.keys()])
        {
            if (key.startsWith(prefix))
            {
                const updateId = key.substring(prefix.length);
                await this.update(updateId, groupId, args);
            }
        }
    }

    /**
     * Invokes the specified update event actions for all subscribers.
     * @param {string} updateId - The identifier of the update event.
     * @param {string} [groupId] - The group to which the update belongs.
     * @param {object|null} [args] - An object to pass as second argument to the action method.
     */
    async update(updateId, groupId = '', args = null)
    {
        const key = this.#formatKey(updateId, groupId);

        if (!this.#subscriptions.has(key))
            return;

        for (const s of [...this.#subscriptions.get(key)])
        {
            await this.#invokeActions(updateId, s.client, groupId, s.args, args);
        }
    }

    /**
     * Calls all update event actions for the specified subscriber.
     * @param {componyx.bindary.Client} client - The client.
     * @param {string} [groupId] - The group to which the update belongs.
     * @param {object|null} [args] - An object to pass as second argument to the action method.
     */
    async updateClient(client, groupId = '', args = null)
    {
        for (const [key, list] of this.#subscriptions)
        {
            if (groupId !== '' && !key.startsWith(groupId + '#'))
                continue;

            for (const s of list.filter(s => s.client.id === client.id))
            {
                const updateId = key.substring(key.indexOf('#') + 1);
                await this.#invokeActions(updateId, client, groupId, s.args, args);
            }
        }
    }

    /**
     * Invokes the specified update event for the specified subscriber.
     * @param {string} updateId - The identifier of the update event.
     * @param {componyx.bindary.Client} client - The client.
     * @param {string} [groupId] - The group to which the update belongs.
     * @param {object|null} [args] - An object to pass as second argument to the action method.
     */
    async updateClientEvent(updateId, client, groupId = '', args = null)
    {
        const subscription = this.getSubscription(updateId, client, groupId);
        const key = this.#formatKey(updateId, groupId);
        const groupKey = groupId + '#';

        if ((!this.#updateEvents.has(key) && !this.#updateEvents.has(groupKey)) || !subscription)
            return;

        await this.#invokeActions(updateId, client, groupId, subscription.args, args);
    }

    // -----------------------------------------------------------------------
    // Private helpers
    // -----------------------------------------------------------------------

    /**
     * Invokes all registered actions for the update event and group, for a specific client.
     * @param {string} updateId
     * @param {componyx.bindary.Client} client
     * @param {string} [groupId]
     * @param {object|null} [subscriptionArgs]
     * @param {object|null} [updateArgs]
     * @private
     */
    async #invokeActions(updateId, client, groupId = '', subscriptionArgs = null, updateArgs = null)
    {
        const key = this.#formatKey(updateId, groupId);
        const groupKey = groupId + '#';

        const groupActions = this.#updateEvents.get(groupKey) ?? [];
        const eventActions = this.#updateEvents.get(key) ?? [];

        for (const action of [...groupActions, ...eventActions])
        {
            await action(client, subscriptionArgs, updateArgs);
        }
    }

    /**
     * Formats the internal map key from an updateId and groupId.
     * @param {string} updateId
     * @param {string} [groupId]
     * @returns {string}
     * @private
     */
    #formatKey(updateId, groupId = '')
    {
        return groupId + '#' + updateId;
    }

    /**
     * Removes null or invalid entries (missing a client) from a subscription list.
     * bug fix: clear null values to avoid weird null reference exception
     * @param {Subscription[]} list
     * @private
     */
    #cleanNulls(list)
    {
        for (let i = list.length - 1; i >= 0; i--)
        {
            if (!list[i] || !list[i].client)
                list.splice(i, 1);
        }
    }
}

// ---------------------------------------------------------------------------
// ClientActivityMonitor
// ---------------------------------------------------------------------------

/**
 * This type is used to check client activity.
 * Instantiated rather than static, for the same reason as DataUpdateManager.
 * @example
 * const monitor = new ClientActivityMonitor(server);
 * monitor.start();
 * @memberof componyx.bindary
 */
class ClientActivityMonitor
{
    #server;
    #dataUpdateManager;
    #intervalId = null;
    #disconnectedAt = new Map();

    /**
     * Creates a new activity monitor for the given server.
     * @param {componyx.bindary.Server} server - The componyx.bindary.Server instance to monitor.
     * @param {componyx.bindary.DataUpdateManager} [dataUpdateManager] - Optional DataUpdateManager for unsubscribing clients.
     */
    constructor(server, dataUpdateManager = null)
    {
        this.#server = server;
        this.#dataUpdateManager = dataUpdateManager;

        /**
         * The interval in seconds (1min default) between each check where inactive clients are removed
         * from the connected clients list.
         * @type {number}
         */
        this.removeInactiveClientsInterval = 60;

        /**
         * The amount of time in seconds before an XHR connected client is considered to be inactive.
         * @type {number}
         */
        this.inactiveClientXhrTimeout = 1200;

        /**
         * The amount of time in seconds (2min default) before a WebSocket connected client is considered
         * to be inactive when the connection is in a closed state. If the WebSocket connection is opened
         * again within this time-frame the Client is not considered inactive.
         * @type {number}
         */
        this.disconnectedWebSocketTimeout = 120;

        /**
         * A callback method which is invoked before an inactive/disconnected client is removed from the
         * active client list. The remove action can be cancelled by returning false from the callback method.
         * @type {Function|null}
         */
        this.callback = null;

        /**
         * Gets a value indicating if the client activity monitor is running.
         * @type {boolean}
         */
        this.isRunning = false;
    }

    /**
     * Starts the client activity monitor as a running background process which removes inactive clients.
     * @param {object} [options]
     * @param {number} [options.removeInactiveClientsInterval]
     * @param {number} [options.inactiveClientXhrTimeout]
     * @param {number} [options.disconnectedWebSocketTimeout]
     * @param {Function|null} [options.callback]
     */
    start(options = {})
    {
        this.removeInactiveClientsInterval = options.removeInactiveClientsInterval ?? this.removeInactiveClientsInterval;
        this.inactiveClientXhrTimeout = options.inactiveClientXhrTimeout ?? this.inactiveClientXhrTimeout;
        this.disconnectedWebSocketTimeout = options.disconnectedWebSocketTimeout ?? this.disconnectedWebSocketTimeout;
        this.callback = options.callback ?? this.callback;

        this.isRunning = true;
        this.#intervalId = setInterval(() => this.#removeInactiveClients(), this.removeInactiveClientsInterval * 1000);

        // unref() so this doesn't prevent graceful process shutdown
        if (this.#intervalId.unref)
            this.#intervalId.unref();
    }

    /**
     * Stops the client activity monitor.
     */
    stop()
    {
        this.isRunning = false;

        if (this.#intervalId)
        {
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }
    }

    /**
     * Test hook that triggers the inactive client check immediately, since #removeInactiveClients is
     * a true private method and can't be reached from outside the class any other way.
     */
    removeInactiveClientsNow()
    {
        this.#removeInactiveClients();
    }

    // -----------------------------------------------------------------------
    // Private
    // -----------------------------------------------------------------------

    /**
     * Removes clients that are inactive for a specified time period.
     * @private
     */
    #removeInactiveClients()
    {
        const { WebSocket } = require('ws');
        const now = new Date();

        for (const [clientId, client] of [...this.#server.clients])
        {
            try
            {
                // Check if WebSocket connection is expired (closed/null)
                let expiredWsConnection = false;

                try
                {
                    expiredWsConnection = client.isWebSocket &&
                        (!client.socket || client.socket.readyState >= WebSocket.CLOSING);
                }
                catch
                {
                    expiredWsConnection = client.isWebSocket;
                }

                // Track first time we see a disconnected WS client
                if (expiredWsConnection && !this.#disconnectedAt.has(client.id))
                    this.#disconnectedAt.set(client.id, now);

                // If WS client reconnected, remove from disconnected tracking
                if (client.isWebSocket && !expiredWsConnection && this.#disconnectedAt.has(client.id))
                    this.#disconnectedAt.delete(client.id);

                // Determine if client should be removed
                const wsDisconnectedSeconds = expiredWsConnection
                    ? (now - this.#disconnectedAt.get(client.id)) / 1000
                    : 0;

                const xhrInactiveSeconds = !client.isWebSocket
                    ? (now - client.lastActivity) / 1000
                    : 0;

                const shouldRemove =
                    (expiredWsConnection && wsDisconnectedSeconds >= this.disconnectedWebSocketTimeout) ||
                    (!client.isWebSocket && xhrInactiveSeconds >= this.inactiveClientXhrTimeout);

                if (!shouldRemove)
                    continue;

                // Invoke callback, removal can be cancelled by returning false
                let doRemove = true;

                if (this.callback)
                    doRemove = this.callback(client);

                if (doRemove)
                {
                    this.#server.removeClient(client);
                    this.#disconnectedAt.delete(client.id);

                    // Unsubscribe from DataUpdateManager if provided
                    if (this.#dataUpdateManager)
                        this.#dataUpdateManager.unsubscribeClient(client);
                }
            }
            catch (ex)
            {
                console.error('[ClientActivityMonitor] Error processing client:', clientId, ex.message);
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = { DataRules, DataResponse, DataContainer, DataUpdateManager, ClientActivityMonitor, Subscription };