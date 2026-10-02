'use strict';

/**
 * @namespace bindary
 * @memberof componyx
 */

/**
 * Bindary Server - WebSocket and XHR data server.
 *
 * Dependencies: ws (WebSocket), express (or any Node http server)
 * npm install ws
 *
 * Usage:
 *   const { Server } = require('./bindary-server');
 *   const server = new Server({ controllers: require('./controllers') });
 *   server.attach(expressApp, httpServer);
 */

const { WebSocketServer, WebSocket } = require('ws');
const { randomUUID } = require('crypto');

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

/**
 * This type is used to store information of a connected client.
 * @memberof componyx.bindary
 */
class Client
{
    constructor(id)
    {
        /**
         * Gets or sets the unique client id.
         * To be able to uniquely identify clients, a unique client id must be send with each request.
         * The Bindary server uses sessionid's by default if no id is provided with the first client request.
         * @type {string}
         */
        this.id = id;

        /**
         * Gets the WebSocket associated with the remote client.
         * @type {WebSocket|null}
         */
        this.socket = null;

        /**
         * Gets or sets a value indicating if the client is connected through a WebSocket.
         * @type {boolean}
         */
        this.isWebSocket = false;

        /**
         * Gets a value indicating if this is the first request of the client.
         * @type {boolean}
         */
        this.isNew = true;

        /**
         * Gets the ip v4 address of the remote client.
         * @type {string|null}
         */
        this.ipv4 = null;

        /**
         * Gets the ip v6 address of the remote client.
         * @type {string|null}
         */
        this.ipv6 = null;

        /**
         * Gets a time stamp value indicating the client's last activity.
         * @type {Date}
         */
        this.lastActivity = new Date();

        /**
         * Gets the session object associated with the remote client, populated by the host app's session middleware.
         * @type {object|null}
         */
        this.session = null;

        /**
         * Gets or sets the send Exception.
         * @type {Error|null}
         */
        this.sendException = null;

        /**
         * Gets the response message for the current XHR request.
         * @type {Map<string, string[]>}
         */
        this.xhrResponseMessage = new Map();

        /**
         * Gets the response message queue.
         * @type {string[]}
         */
        this.xhrResponseMessageQueue = [];

        /**
         * Gets or sets a value indicating if the XHR response will contain a single message (true) or
         * will include all queued messages (false). By default all queued messages are sent. Only the
         * last message from a message queue will be sent when this setting is set to true.
         * @type {boolean}
         */
        this.ignoreQueuedXhrMessages = false;
    }
}

// ---------------------------------------------------------------------------
// DataRequest
// ---------------------------------------------------------------------------

/**
 * This type is used to represent the client request data.
 * @memberof componyx.bindary
 */
class DataRequest
{
    constructor()
    {
        /**
         * Gets the client id that was send with the request.
         * @type {string|null}
         */
        this.clientId = null;

        /**
         * Gets the method to invoke on the server.
         * @type {string|null}
         */
        this.serverMethod = null;

        /**
         * Gets the data query.
         * @type {string|null}
         */
        this.data = null;

        /**
         * Gets the custom request data query as dictionary when clientDataRequestToDictionary on the DataServer is set to true.
         * @type {object|null}
         */
        this.dataDictionary = null;

        /**
         * Gets the xhr request id that was generated for this request.
         * @type {string|null}
         */
        this.xhrRequestId = null;

        /**
         * Gets the client data request message.
         * @type {string|null}
         */
        this.message = null;

        /**
         * Gets the exception if an exception occurred while deserializing the data within the data request as dictionary.
         * @type {Error|null}
         */
        this.deserializationException = null;
    }
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

/**
 * Options for componyx.bindary.Server.
 * @typedef {object} ServerOptions
 * @memberof componyx.bindary
 * @property {object}   controllers             			- Map of fully-qualified class names to handler instances/classes. e.g. { 'MyApp.Media.MediaController': MediaController }
 * @property {string}   [defaultNamespace]      			- Default namespace prepended to server method names that don't already start with it, so the client can send a short name like "SaveItem" instead of the fully qualified type name.
 * @property {boolean}  [useSessionForClients]  			- Use session id as client id (default true).
 * @property {Function} [getSession]            			- (req) => session object. Required when useSessionForClients=true.
 * @property {number}   [maxMessageBytes]       			- Max WS message size in bytes (default 4MB).
 * @property {string}   [path]                  			- WebSocket upgrade path (default '/dataserver').
 * @property {string}   [xhrPath]               			- XHR POST path (default '/dataserver').
 * @property {boolean}  [clientDataRequestToDictionary] 	- Whether to parse request.data into request.dataDictionary (default true).
 * @property {Function} [sessionMiddleware]     			- Same middleware instance passed to app.use(session(...)). Runs express-session against WebSocket upgrade requests too, since those bypass Express normally. Omit if not needed.
 * @property {Function} [acceptWebSocketRequest] 			- (req) => boolean|Promise<boolean>. Called before a WebSocket connection is accepted. Defaults to accepting everything. Can also be set by overriding acceptWebSocketRequest() on a subclass instead.
 */

/**
 * This type is used to handle client connections.
 * @memberof componyx.bindary
 */
class Server
{
    #controllers;
	#defaultNamespace;
    #useSessionForClients;
    #getSession;
    #sessionMiddleware;
    #maxMessageBytes;
    #path;
    #xhrPath;
    #clientDataRequestToDictionary;
    #methodCache = new Map();
    #instanceCache = new Map();
    #wss = null;

    /**
     * @param {ServerOptions} options
     */
    constructor(options = {})
    {
        /** @type {Map<string, componyx.bindary.Client>} */
        this.clients = new Map();

        this.#controllers = options.controllers ?? {};
		this.#defaultNamespace = options.defaultNamespace ?? null;
        this.#useSessionForClients = options.useSessionForClients ?? true;
        this.#getSession = options.getSession ?? ((req) => req.session ?? null);
        this.#sessionMiddleware = options.sessionMiddleware ?? null;
        this.#maxMessageBytes = options.maxMessageBytes ?? 4 * 1024 * 1024;
        this.#path = options.path ?? '/dataserver';
        this.#xhrPath = options.xhrPath ?? '/dataserver';
        this.#clientDataRequestToDictionary = options.clientDataRequestToDictionary ?? true;

        // Allows callers to configure this via options instead of subclassing just for this one check
        if (typeof options.acceptWebSocketRequest === 'function')
            this.acceptWebSocketRequest = options.acceptWebSocketRequest.bind(this);
    }

    // -----------------------------------------------------------------------
    // Public API - attach to an existing http.Server + express app
    // -----------------------------------------------------------------------

    /**
     * Attaches the Bindary WebSocket server and XHR route to the given http server and express app.
     * @param {object} app - The Express application instance.
     * @param {object} httpServer - The Node.js http.Server instance.
     */
    attach(app, httpServer)
    {
        // noServer: true so this class can run sessionMiddleware/acceptWebSocketRequest
        // before handing the socket to ws, rather than ws claiming 'upgrade' first
        this.#wss = new WebSocketServer({ noServer: true });

        this.#wss.on('connection', (socket, req) =>
        {
            this.#handleWebSocket(socket, req);
        });

        httpServer.on('upgrade', (req, socket, head) =>
        {
            this.#handleUpgrade(req, socket, head);
        });

        app.post(this.#xhrPath, async (req, res) =>
        {
            await this.#handleXhr(req, res);
        });
    }

    // -----------------------------------------------------------------------
    // Overrideable lifecycle hooks, implemented as plain no-ops so a
    // subclass only needs to override what it actually uses
    // -----------------------------------------------------------------------

    /**
     * This virtual method is invoked before the WebSocket connection is accepted.
     * req.session is already populated here if sessionMiddleware was passed to the constructor.
     * @param {object} req
     * @returns {boolean|Promise<boolean>} A value to either accept (true) or deny (false) the WebSocket connection request.
     */
    acceptWebSocketRequest(req) { return true; }

    /**
     * This abstract method is invoked when a Request through either a WebSocket or XHR connection is made.
     * In this fase the Session State object is no longer available on the current HttpContext, however it
     * is cached in the Session property of this class.
     * @param {object} req
     */
    onOpen(req) {}

    /**
     * This abstract method is invoked when a client is loaded.
     * @param {string} message - The incoming message.
     * @param {componyx.bindary.DataRequest} request - The incoming message deserialized as DataRequest.
     * @param {componyx.bindary.Client} client - The loaded client.
     */
    onClientLoaded(message, request, client) {}

    /**
     * This abstract method is invoked when a text message is received from the Client.
     * @param {string} message - The incoming message.
     */
    onMessage(message) {}

    /**
     * This abstract method is invoked when a byte message is received from the Client.
     * @param {Buffer} message - The incoming message.
     */
    onMessageBinary(message) {}

    /**
     * This abstract method is invoked when a DataRequest message is received from the Client.
     * @param {componyx.bindary.DataRequest} request - The incoming message deserialized as DataRequest.
     */
    onDataRequest(request) {}

    /**
     * Handles possible exceptions that occur inside the custom implementation while processing the request.
     * Sending the error message to the client is usually possible.
     * For a custom implementation this Method should be overridden in the derived class.
     * @param {Error} ex
     * @param {componyx.bindary.DataRequest} request
     * @param {componyx.bindary.Client} client
     */
    onError(ex, request, client) { console.error('[Bindary] Error:', ex.message); }

    /**
     * Handles possible exceptions that occur outside the custom implementation while processing the request.
     * Sending the error message to the client is not possible.
     * For a custom implementation this Method should be overridden in the derived class.
     * @param {Error} ex
     */
    onServerError(ex) { console.error('[Bindary] Server error:', ex.message); }

    // -----------------------------------------------------------------------
    // Broadcast/send helpers
    // -----------------------------------------------------------------------

    /**
     * Broadcasts the message to all connected clients.
     * @param {string|object} message
     */
    async broadcast(message)
    {
        const str = (typeof message === 'object') ? JSON.stringify(message) : message;
        const promises = [];

        for (const client of this.clients.values())
            promises.push(this.send(client, str));

        return Promise.all(promises);
    }

    /**
     * Sends the message to the specified client.
     * @param {componyx.bindary.Client} client - The client to which the data will be sent.
     * @param {string|object} message - The data message to send.
     * @param {string|null} [xhrRequestId] - The identifier of the current XHR request (when applicable) to
     * send the message as response to the current request. Without this identifier the message is stored
     * in the queue to be returned at the first opportunity.
     * @returns {Promise<boolean>}
     */
    async send(client, message, xhrRequestId = null)
    {
        const str = (typeof message === 'object') ? JSON.stringify(message) : message;

        try
        {
            if (xhrRequestId && client.xhrResponseMessage.has(xhrRequestId))
            {
                // Reserved slot, append to this request's response
                client.xhrResponseMessage.get(xhrRequestId).push(str);
            }
            else if (client.isWebSocket && client.socket?.readyState === WebSocket.OPEN)
            {
                await this.#wsSend(client.socket, str);
            }
            else if (!client.isWebSocket)
            {
                // Queue for next XHR pickup
                client.xhrResponseMessageQueue.push(str);
            }

            return true;
        }
        catch (ex)
        {
            client.sendException = ex;
            return false;
        }
    }

    /**
     * Removes the specified client from the active client list. Does not unsubscribe the client from a
     * DataUpdateManager, since Server has no reference to one. Use ClientActivityMonitor (constructed with
     * a dataUpdateManager) for the combined remove-and-unsubscribe behavior, or call
     * dataUpdateManager.unsubscribeClient() yourself alongside this when removing clients manually.
     * @param {string|Client} clientOrId
     */
    removeClient(clientOrId)
    {
        const id = (typeof clientOrId === 'string') ? clientOrId : clientOrId.id;
        this.clients.delete(id);
    }

    /**
     * Closes the WebSocket server and terminates every currently connected WebSocket client.
     * Does not close the underlying http.Server itself, that remains the host app's own to manage.
     * @returns {Promise<void>}
     */
    close()
    {
        return new Promise((resolve) =>
        {
            if (!this.#wss)
            {
                resolve();
                return;
            }

            for (const client of this.#wss.clients)
                client.terminate();

            this.#wss.close(() => resolve());
        });
    }

    // -----------------------------------------------------------------------
    // Private: WebSocket upgrade
    // -----------------------------------------------------------------------

    /**
     * Handles the raw http.Server 'upgrade' event by hand, so sessionMiddleware and
     * acceptWebSocketRequest both run before the connection is accepted.
     * @param {object} req - The incoming http.IncomingMessage request.
     * @param {object} socket - The raw duplex socket for the connection.
     * @param {Buffer} head
     * @private
     */
    #handleUpgrade(req, socket, head)
    {
        const pathname = req.url.split('?')[0];

        if (pathname !== this.#path)
        {
            // Not ours, refuse cleanly rather than leaving the socket hanging
            socket.destroy();
            return;
        }

        const proceed = () =>
        {
            Promise.resolve(this.acceptWebSocketRequest(req))
                .then((accepted) =>
                {
                    if (!accepted)
                    {
                        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                        socket.destroy();
                        return;
                    }

                    this.#wss.handleUpgrade(req, socket, head, (ws) =>
                    {
                        this.#wss.emit('connection', ws, req);
                    });
                })
                .catch((ex) =>
                {
                    this.onServerError(ex);
                    socket.destroy();
                });
        };

        if (this.#sessionMiddleware)
        {
            // Populates req.session from the existing cookie; {} stands in for the response object
            this.#sessionMiddleware(req, {}, proceed);
        }
        else
        {
            proceed();
        }
    }

    // -----------------------------------------------------------------------
    // Private: WebSocket handler
    // -----------------------------------------------------------------------

    /**
     * Wires up message/close/error handling for a newly accepted WebSocket connection.
     * @param {WebSocket} socket
     * @param {object} req
     * @private
     */
    #handleWebSocket(socket, req)
    {
        try
        {
            this.onOpen(req);

            socket.on('message', async (data, isBinary) =>
            {
                try
                {
                    if (isBinary)
                    {
                        this.onMessageBinary(data);
                        return;
                    }

                    if (data.length > this.#maxMessageBytes)
                        throw new Error(`Message exceeds maximum allowed size of ${this.#maxMessageBytes} bytes.`);

                    const message = data.toString('utf8');
                    const request = this.#deserialize(message);
                    const clientId = request?.clientId ?? null;
                    const session = this.#getSession(req);

                    const client = this.#loadClient(clientId, session, req, socket);
                    this.onClientLoaded(message, request, client);

                    if (request)
                        await this.#messageReceivedAsync(request, client);
                    else
                        this.onMessage(message);
                }
                catch (ex)
                {
                    const request = null;
                    const client = null;
                    this.onError(ex, request, client);
                    socket.close(1011, ex.message);
                }
            });

            socket.on('close', () =>
            {
                for (const [id, client] of this.clients)
                {
                    if (client.socket === socket)
                    {
                        client.socket = null;
                        client.isWebSocket = false;
                        break;
                    }
                }
            });

            socket.on('error', (ex) =>
            {
                this.onServerError(ex);
            });
        }
        catch (ex)
        {
            this.onServerError(ex);

            if (socket.readyState === WebSocket.OPEN)
                socket.close(1011, ex.message);
        }
    }

    // -----------------------------------------------------------------------
    // Private: XHR handler
    // -----------------------------------------------------------------------

    /**
     * Handles a single XHR POST request: parses the body, resolves the
     * client, dispatches the request, and writes the response.
     * @param {object} req
     * @param {object} res
     * @private
     */
    async #handleXhr(req, res)
    {
        let client = null;
        let request = null;

        try
        {
            this.onOpen(req);
            res.setHeader('Content-Type', 'application/json; charset=utf-8');

            const body = await this.#readBody(req);
            request = this.#deserialize(body, true);
            const session = this.#getSession(req);

            client = this.#loadClient(request.clientId, session, req, null);

            // Reserve XHR response slot
            client.xhrResponseMessage.set(request.xhrRequestId, []);

            this.onClientLoaded(body, request, client);
            await this.#messageReceivedAsync(request, client);
        }
        catch (ex)
        {
            if (client && request && client.xhrResponseMessage.has(request.xhrRequestId))
            {
                client.xhrResponseMessage.get(request.xhrRequestId).length = 0;
                client.xhrResponseMessageQueue.length = 0;
            }

            this.onError(ex, request, client);
        }
        finally
        {
            try
            {
                if (!client || !request)
                {
                    res.end('{}');
                    return;
                }

                const slot = client.xhrResponseMessage.get(request.xhrRequestId) ?? [];
                const response = slot.length > 0 ? slot.join(',') : null;

                let responseQueue = null;
                let responseQueueCount = 0;

                if (!client.ignoreQueuedXhrMessages && client.xhrResponseMessageQueue.length > 0)
                {
                    responseQueueCount = client.xhrResponseMessageQueue.length;
                    responseQueue = client.xhrResponseMessageQueue.join(',');
                    client.xhrResponseMessageQueue.length = 0;
                }

                client.xhrResponseMessage.delete(request.xhrRequestId);

                if (responseQueue && response)
                    res.end(`[${responseQueue},${response}]`);
                else if (responseQueue)
                    res.end(responseQueueCount > 1 ? `[${responseQueue}]` : responseQueue);
                else if (response)
                    res.end(slot.length > 1 ? `[${response}]` : response);
                else
                    res.end();
            }
            catch (ex)
            {
                this.onServerError(ex);
            }
        }
    }

    // -----------------------------------------------------------------------
    // Private: method invocation
    // -----------------------------------------------------------------------

    /**
     * Runs the onDataRequest hook and, if the request names a server method, invokes it.
     * @param {componyx.bindary.DataRequest} request
     * @param {componyx.bindary.Client} client
     * @private
     */
    async #messageReceivedAsync(request, client)
    {
        this.onDataRequest(request);

        if (request.serverMethod)
            await this.#invokeMethod(request, client);
    }

    /**
     * Invokes the specifed method.
     * Controllers are passed in via options.controllers as a plain object map:
     *   { 'Full.Type.Name': ClassOrInstance }
     * Each method receives (client, request).
     * @param {componyx.bindary.DataRequest} request
     * @param {componyx.bindary.Client} client
     * @private
     */
    async #invokeMethod(request, client)
    {
		let method = request.serverMethod;

		if (this.#defaultNamespace && !method.startsWith(`${this.#defaultNamespace}.`))
		{
			method = `${this.#defaultNamespace}.${method}`;
		}
		
        const lastDot = method.lastIndexOf('.');
        const fullTypeName = method.substring(0, lastDot);
        const methodName = method.substring(lastDot + 1);
        const cacheKey = method;

        if (!this.#methodCache.has(cacheKey))
        {
            const controllerEntry = this.#controllers[fullTypeName];

            if (!controllerEntry)
                throw new Error(`Bindary: No controller registered for type "${fullTypeName}".`);

            let instance;

            if (typeof controllerEntry === 'function' && controllerEntry.prototype)
            {
                // It's a class constructor, instantiate and cache (isReusable=true by default)
                if (!this.#instanceCache.has(fullTypeName))
                    this.#instanceCache.set(fullTypeName, new controllerEntry());

                instance = this.#instanceCache.get(fullTypeName);
            }
            else
            {
                // It's already an instance
                instance = controllerEntry;
            }

            const fn = instance[methodName];

            if (typeof fn !== 'function')
                throw new Error(`Bindary: Method "${methodName}" not found on controller "${fullTypeName}".`);

            this.#methodCache.set(cacheKey, fn.bind(instance));
        }

        const boundMethod = this.#methodCache.get(cacheKey);
        console.log(`Invoke "${methodName}"`);
        await boundMethod(client, request);
    }

    // -----------------------------------------------------------------------
    // Private: client management
    // -----------------------------------------------------------------------

    /**
     * Load client from specified data query.
     * @param {string|null} clientId
     * @param {object|null} session
     * @param {object} req
     * @param {WebSocket|null} socket
     * @returns {componyx.bindary.Client}
     * @private
     */
    #loadClient(clientId, session, req, socket)
    {
        if (this.#useSessionForClients && session?.id)
            clientId = session.id;
        else if (!clientId)
            clientId = randomUUID();

        let client = this.clients.get(clientId);

        if (!client)
        {
            client = new Client(clientId);
            client.ipv4 = this.#getIPv4(req);
            client.ipv6 = this.#getIPv6(req);
            client.isNew = true;
            client.session = session;
            client.lastActivity = new Date();

            if (socket)
            {
                client.socket = socket;
                client.isWebSocket = true;
            }

            this.clients.set(clientId, client);
        }
        else
        {
            client.isNew = false;
            client.session = session;
            client.lastActivity = new Date();

            if (socket)
            {
                client.socket = socket;
                client.isWebSocket = true;
            }

            // there is a possibility that the client is removed from the list through the activity monitor due to inactivity just before this lock, check and restore
            if (!this.clients.has(clientId))
                this.clients.set(clientId, client);
        }

        return client;
    }

    // -----------------------------------------------------------------------
    // Private: helpers
    // -----------------------------------------------------------------------

    /**
     * Parse incoming message into a DataRequest.
     * @param {string} message
     * @param {boolean} [isXhr]
     * @returns {componyx.bindary.DataRequest}
     * @private
     */
    #deserialize(message, isXhr = false)
    {
        let request = null;

        try
        {
            const parsed = JSON.parse(message);
            request = Object.assign(new DataRequest(), parsed);
            request.message = message;

            if (request.data && this.#clientDataRequestToDictionary)
            {
                try
                {
                    // Case-insensitive dictionary: lowercase all keys
                    const raw = JSON.parse(request.data);
                    request.dataDictionary = this.#lowerCaseKeys(raw);
                }
                catch (ex)
                {
                    request.deserializationException = ex;
                }
            }
        }
        catch
        {
            // Could not parse
        }
        finally
        {
            if (!request && isXhr)
                request = new DataRequest();

            if (isXhr && request)
                request.xhrRequestId = randomUUID();

            if (request)
                request.message = message;
        }

        return request;
    }

    /**
     * Recursively lowercase all keys in an object, for case-insensitive lookups.
     * @param {object} obj
     * @returns {object}
     * @private
     */
    #lowerCaseKeys(obj)
    {
        if (typeof obj !== 'object' || obj === null)
            return obj;

        if (Array.isArray(obj))
            return obj.map(v => this.#lowerCaseKeys(v));

        return Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [k.toLowerCase(), this.#lowerCaseKeys(v)])
        );
    }

    /**
     * Read the full request body as a string.
     * @param {object} req - The incoming http.IncomingMessage request.
     * @returns {Promise<string>}
     * @private
     */
    #readBody(req)
    {
        return new Promise((resolve, reject) =>
        {
            const chunks = [];
            req.on('data', chunk => chunks.push(chunk));
            req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
            req.on('error', reject);
        });
    }

    /**
     * Promise wrapper for WebSocket.send.
     * @param {WebSocket} socket
     * @param {string} message
     * @private
     */
    #wsSend(socket, message)
    {
        return new Promise((resolve, reject) =>
        {
            socket.send(message, (err) => err ? reject(err) : resolve());
        });
    }

    /**
     * Extracts the IPv4 address from an incoming request, if any.
     * @param {object} req
     * @returns {string|null}
     * @private
     */
    #getIPv4(req)
    {
        const raw = req.socket?.remoteAddress ?? req.ip ?? '';
        return raw.includes('::ffff:') ? raw.replace('::ffff:', '') : (raw.includes(':') ? null : raw);
    }

    /**
     * Extracts the IPv6 address from an incoming request, if any.
     * @param {object} req
     * @returns {string|null}
     * @private
     */
    #getIPv6(req)
    {
        const raw = req.socket?.remoteAddress ?? req.ip ?? '';
        return (raw.includes(':') && !raw.startsWith('::ffff:')) ? raw : null;
    }
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = { Server, Client, DataRequest };