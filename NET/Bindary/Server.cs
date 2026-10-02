using Componyx.Common;
using Componyx.Common.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Componyx.UI.Bindary
{
    /// <summary>
    /// This type is used to handle client connections.
    /// </summary>
    public abstract class Server
    {
        private readonly RequestDelegate _next;
        private static string _cookieKey = "Componyx.UI.SessionId";
        private static ConcurrentDictionary<string, Client> _clients = new ConcurrentDictionary<string, Client>();
        private static List<Type> _assemblyTypes;
        private static ConcurrentDictionary<string, object> _instances = new ConcurrentDictionary<string, object>();
        private static ConcurrentDictionary<string, MethodInfo> _methods = new ConcurrentDictionary<string, MethodInfo>();

        /// <summary>
        /// Gets or sets the Function which handles class instantiation.
        /// </summary>
        public static Func<Type, object> ClassInstantiator { get; set; }

        /// <summary>
        /// Gets the connected clients.
        /// </summary>
        public static ConcurrentDictionary<string, Client> Clients
        {
            get
            {
                return _clients;
            }
        }

        /// <summary>
        /// Reconnects an existing Client to a new session ID, in case the ID changes after the session was already established. Call this if you're seeing sessions unexpectedly lose their associated Client.
        /// </summary>
        /// <param name="context">The current HttpContext.</param>
        /// <param name="sessionIdCookieOptions">The SessionId is stored in a Cookie to be able to retrieve the connected Client if the Session has expired.</param>
        public static void UpdateClientSession(HttpContext context, CookieOptions sessionIdCookieOptions = null)
        {
            var newSessionId = context.Session.Id;

            if (context.Request.Cookies[_cookieKey] != null)
            {
                var oldSessionId = context.Request.Cookies[_cookieKey];

                lock (Clients)
                {
                    if (Clients.TryGetValue(oldSessionId, out var client))
                    {
                        client.UpdateSession(context.Session);
                        client.Id = newSessionId;
                        Clients.TryRemove(oldSessionId, out var oldClient);
                        Clients.TryAdd(newSessionId, client);
                    }
                }
            }

            context.Response.Cookies.Append(_cookieKey, newSessionId, (sessionIdCookieOptions != null) ? sessionIdCookieOptions : new CookieOptions() { HttpOnly = true, IsEssential = true, Secure = true, SameSite = SameSiteMode.Strict });
        }


        /// <summary>
        /// Gets or sets the serializer for deserializing the client data request object to a dictionary. When null, <see cref="Json.Utility.Serializer"/> is used.
        /// </summary>
        public IJsonSerializer DataRequestJsonSerializer { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the client data request string should be deserialized to a dictionary. Defaults to true.
        /// </summary>
        public bool ClientDataRequestToDictionary { get; set; } = true;

        /// <summary>
        /// Gets or sets a value indicating if the Session Id is used to uniquely identify Clients. A WebSocket connection is closed with code 1011 (internal server error) when the Session object is null.
        /// </summary>
        public bool UseSessionIdForClients { get; set; } = true;

        /// <summary>
        /// Gets or sets the WebSocket buffer size in bytes. By default the buffer size is set to 8192 bytes (8KB).
        /// </summary>
        public int WebSocketBufferSize { get; set; } = 8192;

        /// <summary>
        /// Gets or sets the WebSocket maximum message receive size in bytes. Defaults to 4194304 bytes (4MB).
        /// </summary>
        public int WebSocketMaxMessageSize { get; set; } = 4194304;

        /// <summary>
        /// Gets or sets the default namespace prepended to server method names that don't already start with it, so the client can send a short name like "SaveItem" instead of the fully qualified type name.
        /// </summary>
        public string DefaultNamespace { get; set; }


        /// <summary>
        /// Initializes the Server class.
        /// </summary>
        /// <param name="next"></param>
        public Server(RequestDelegate next)
        {
            _next = next;
        }

        /// <summary>
        /// Invokes the middleware.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                string message;
                DataRequest request = null;
                WebSocketResult result;
                WebSocket socket = null;
                Client client = null;
                var contextData = new ContextData()
                {
                    Session = context.Session,
                    IsXHR = true,
                    IP4 = Utility.GetClientIPv4(context),
                    IP6 = Utility.GetClientIPv6(context)
                };

                // Force ASP.NET to commit and persist the session cookie now, before LoadClient() reads Session.Id, otherwise a session that was never written to may not survive to the next request, silently changing this client's identity on reconnect.
                if (this.UseSessionIdForClients && context.Session != null)
                {
                    if (string.IsNullOrEmpty(context.Session.GetString("Componyx.UI.Bindary.SessionEstablished")))
                        context.Session.SetString("Componyx.UI.Bindary.SessionEstablished", "1");
                }

                if (context.WebSockets != null && context.WebSockets.IsWebSocketRequest)
                {
                    if (!AcceptWebSocketRequest(context))
                    {
                        context.Response.StatusCode = 403;
                        return;
                    }

                    using (WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync())
                    {
                        try
                        {
                            socket = webSocket;
                            contextData.IsXHR = false;
                            Open(context);

                            while (socket != null && socket.State < WebSocketState.Closed)
                            {
                                result = await ReceiveWebSocketData(socket).ConfigureAwait(false);

                                if (socket != null && (socket.State < WebSocketState.Closed))
                                {
                                    switch (result.ReceiveResult.MessageType)
                                    {
                                        case WebSocketMessageType.Text:
                                            message = Encoding.UTF8.GetString(result.Message, 0, result.Message.Count());
                                            request = Deserialize(message);
                                            var clientId = (request != null) ? request.ClientId : null;

                                            if (this.UseSessionIdForClients && contextData.Session == null)
                                            {
                                                throw new Exception("Session is null while UseSessionIdForClients is set to true.");
                                            }
                                            else
                                            {
                                                client = LoadClient(contextData, clientId, socket);
                                                ClientLoaded(message, request, client);

                                                try
                                                {
                                                    if (request != null)
                                                        await MessageReceivedAsync(request, client);
                                                    else
                                                        MessageReceived(message);
                                                }
                                                catch (Exception ex)
                                                {
                                                    Error(ex, request, client);

                                                    if (socket.State < WebSocketState.Closed)
                                                        await Close(socket);
                                                }
                                            }
                                            break;
                                        case WebSocketMessageType.Binary:
                                            try
                                            {
                                                MessageReceived(result.Message);
                                            }
                                            catch (Exception ex)
                                            {
                                                Error(ex, request, client);

                                                if (socket.State < WebSocketState.Closed)
                                                    await Close(socket);
                                            }

                                            break;
                                        case WebSocketMessageType.Close:
                                            await Close(socket);
                                            break;
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            ServerError(ex);

                            if (socket != null && socket.State < WebSocketState.Closed)
                                await Close(socket, WebSocketCloseStatus.InternalServerError, ex.Message);
                        }
                    }
                }
                else // xhr connection
                {
                    string responseQueue = null, response = null;
                    int responseQueueCount = 0;

                    try
                    {
                        Open(context);
                        context.Response.Clear();
                        context.Response.ContentType = "application/json; charset=utf-8";

                        using (var reader = new StreamReader(context.Request.Body))
                        {
                            message = await reader.ReadToEndAsync();
                        }

                        request = Deserialize(message, true);
                        client = LoadClient(contextData, request.ClientId, null);

                        client.XhrResponseMessage[request.XhrRequestId] = new List<string>(); // reserve key
                        ClientLoaded(message, request, client);

                        await MessageReceivedAsync(request, client).ConfigureAwait(false);
                    }
                    catch (Exception ex)
                    {
                        if (client != null && client.XhrResponseMessage.ContainsKey(request.XhrRequestId))
                        {
                            client.XhrResponseMessage[request.XhrRequestId].Clear();
                            client.XhrResponseMessageQueue.Clear();
                        }

                        Error(ex, request, client);
                    }
                    finally
                    {
                        if (client.XhrResponseMessage[request.XhrRequestId] != null && client.XhrResponseMessage[request.XhrRequestId].Count > 0)
                            response = string.Join(",", client.XhrResponseMessage[request.XhrRequestId]);

                        if (!client.IgnoreQueuedXhrMessages && client.XhrResponseMessageQueue.Count > 0)
                        {
                            lock (client) // place lock on specific client to handle response queue synchronously.
                            {
                                if (client.XhrResponseMessageQueue.Count > 0)
                                {
                                    responseQueueCount = client.XhrResponseMessageQueue.Count;
                                    responseQueue = string.Join(",", client.XhrResponseMessageQueue);
                                    client.XhrResponseMessageQueue.Clear(); // clear message queue
                                }
                            }
                        }

                        if (context == null)
                            throw new Exception("HttpContext is null");

                        if (context.Response == null)
                            throw new Exception("HttpContext.Response is null");

                        if (!context.RequestAborted.IsCancellationRequested)
                        {
                            if (responseQueue != null && response != null)
                                await context.Response.WriteAsync(string.Format("[{0},{1}]", responseQueue, response));
                            else if (responseQueue != null)
                                await context.Response.WriteAsync(string.Format((responseQueueCount > 1) ? "[{0}]" : "{0}", responseQueue));
                            else if (response != null)
                                await context.Response.WriteAsync(string.Format((client.XhrResponseMessage[request.XhrRequestId].Count > 1) ? "[{0}]" : "{0}", response));

                            if (request != null && client.XhrResponseMessage.ContainsKey(request.XhrRequestId))
                                client.XhrResponseMessage.Remove(request.XhrRequestId);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ServerError(ex);
            }
        }

        /// <summary>
        /// Handles the websocket or xhr received message event for text messages.
        /// </summary>
        protected async Task MessageReceivedAsync(DataRequest request, Client client)
        {
            Message(request);

            if (!string.IsNullOrEmpty(request.ServerMethod))
                await InvokeMethodAsync(request, client);
        }

        /// <summary>
        /// Handles the websocket or xhr received message event for binary messages.
        /// </summary>
        protected void MessageReceived(string message)
        {
            Message(message);
        }

        /// <summary>
        /// Handles the websocket or xhr received message event for binary messages.
        /// </summary>
        protected void MessageReceived(byte[] message)
        {
            Message(message);
        }

        /// <summary>
        /// This virtual method is invoked before the WebSocket connection is accepted.
        /// </summary>
        /// <returns>A value to either accept (true) or deny (false) the WebSocket connection request.</returns>
        protected virtual bool AcceptWebSocketRequest(HttpContext context = null) { return true; }

        /// <summary>
        /// This abstract method is invoked when a Request through either a WebSocket or XHR connection is made.
        /// In this fase the Session State object is no longer available on the current HttpContext, however it is cached in the Session property of this class.
        /// </summary>
        ///<param name="context">The HTTP context of the current request.</param>
        protected abstract void Open(HttpContext context);

        /// <summary>
        /// This abstract method is invoked when a client is loaded.
        /// </summary>
        ///<param name="message">The incoming message.</param>
        ///<param name="request">The incoming message deserialized as DataRequest.</param>
        ///<param name="client">The loaded client.</param>
        protected abstract void ClientLoaded(string message, DataRequest request, Client client);

        /// <summary>
        /// This abstract method is invoked when a text message is received from the Client.
        /// </summary>
        /// <param name="message">The incoming message.</param>
        protected abstract void Message(string message);

        /// <summary>
        /// This abstract method is invoked when a byte message is received from the Client.
        /// </summary>
        /// <param name="message">The incoming message.</param>
        protected abstract void Message(byte[] message);

        /// <summary>
        /// This abstract method is invoked when a DataRequest message is received from the Client.
        /// </summary>
        /// <param name="request">The incoming message deserialized as DataRequest.</param>
        protected abstract void Message(DataRequest request);

        /// <summary>
        /// Handles possible exceptions that occure inside the custom implementation while processing the request.
        /// Sending the error message to the client is usually possible.
        /// For a custom implementation this Method should be overridden in the derived class.
        /// </summary>
        /// <param name="ex"></param>
        /// <param name="request"></param>
        /// <param name="client"></param>
        protected abstract void Error(Exception ex, DataRequest request, Client client);

        /// <summary>
        /// Handles possible exceptions that occure outside the custom implementation while processing the request.
        /// Sending the error message to the client is not possible.
        /// For a custom implementation this Method should be overridden in the derived class.
        /// </summary>
        /// <param name="ex"></param>
        protected abstract void ServerError(Exception ex);

        /// <summary>
        /// Closes the WebSocket connection.
        /// </summary>
        /// <param name="socket"></param>
        /// <param name="status"></param>
        /// <param name="statusDescription"></param>
        /// <returns></returns>
        protected virtual async Task Close(WebSocket socket, WebSocketCloseStatus status = WebSocketCloseStatus.NormalClosure, string statusDescription = null)
        {
            await socket.CloseOutputAsync(status, statusDescription, CancellationToken.None);
        }

        /// <summary>
        /// Broadcasts the message to all connected clients. 
        /// </summary>
        public static async Task<bool> BroadCast(string message)
        {
            return await Send(Clients.Values.ToList(), message);
        }

        /// <summary>
        /// Broadcasts the message to all connected clients. 
        /// </summary>
        /// <param name="response">The data response.</param>
        public static async Task<bool> BroadCast<AppDataType, RouteDataType, ViewDataType>(DataResponse<AppDataType, RouteDataType, ViewDataType> response)
        {
            return await Send(Clients.Values.ToList(), response);
        }

        /// <summary>
        /// Broadcasts the message to all connected clients. 
        /// </summary>
        /// <param name="message">The data message to send.</param>
        /// <param name="type">The message type.</param>
        public static async Task<bool> BroadCast(byte[] message, WebSocketMessageType type = WebSocketMessageType.Binary)
        {
            return await Send(Clients.Values.ToList(), message, type);
        }

        /// <summary>
        /// Sends the data response to the specified clients.
        /// </summary>
        /// <param name="clients">The clients to which the data will be send.</param>
        /// <param name="response">The data response.</param>
        public static async Task<bool> Send(IEnumerable<Client> clients, DataResponse response)
        {
            var success = true;

            foreach (Client client in clients)
            {
                var s = await Send(client, response);

                if (!s)
                    success = s;
            }

            return success;
        }

        /// <summary>
        /// Sends the data response to the specified client.
        /// </summary>
        /// <param name="client">The client to which the data will be send</param>
        /// <param name="response">The data response.</param>
        /// <param name="xhrRequestId">The identifier of the current XHR request (when applicable) to send the message as response to the current request. Without this identifier the message is stored in the queue to be returned at the first opportunity.</param>
        public static async Task<bool> Send(Client client, DataResponse response, string xhrRequestId = null)
        {
            return await Send(client, Json.Utility.Serialize(response), xhrRequestId);
        }

        /// <summary>
        /// Sends the message to the specified clients.
        /// </summary>
        /// <param name="clients">The clients to which the data will be sent.</param>
        /// <param name="message">The data message to send.</param>
        public static async Task<bool> Send(List<Client> clients, string message)
        {
            var success = true;

            foreach (Client client in clients)
            {
                var s = await Send(client, message);

                if (!s)
                    success = s;
            }

            return success;
        }

        /// <summary>
        /// Sends the message to the specified clients.
        /// </summary>
        /// <param name="clients">The clients to which the data will be sent.</param>
        /// <param name="message">The data message to send.</param>
        /// <param name="type">The message type.</param>
        public static async Task<bool> Send(IEnumerable<Client> clients, byte[] message, WebSocketMessageType type = WebSocketMessageType.Binary)
        {
            var success = true;

            foreach (Client client in clients)
            {
                var s = await Send(client, message, type);

                if (!s)
                    success = s;
            }

            return success;
        }

        /// <summary>
        /// Sends the message to the specified client.
        /// </summary>
        /// <param name="client">The client to which the data will be sent.</param>
        /// <param name="message">The data message to send.</param>
        /// <param name="xhrRequestId">The identifier of the current XHR request (when applicable) to send the message as response to the current request. Without this identifier the message is stored in the queue to be returned at the first opportunity.</param>
        public static async Task<bool> Send(Client client, string message, string xhrRequestId = null)
        {
            try
            {
                if (xhrRequestId != null && client.XhrResponseMessage.ContainsKey(xhrRequestId)) // reserved slot?
                    client.XhrResponseMessage[xhrRequestId].Add(message); // add response message for current XHR request
                else if (client.IsWebSocket && client.Socket.State == WebSocketState.Open) // could throw an ObjectDisposedException
                    await client.Socket.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes(message)), WebSocketMessageType.Text, true, CancellationToken.None);
                else if (!client.IsWebSocket)
                    client.XhrResponseMessageQueue.Add(message); // store message for next XHR request

                return true;
            }
            catch (Exception ex)
            {
                client.SendException = ex;
                return false;
            }
        }

        /// <summary>
        /// Sends the message to the specified client through a websocket connection (no xhr support).
        /// </summary>
        /// <param name="client">The client to which the data will be sent.</param>
        /// <param name="message">The data message to send.</param>
        /// <param name="type">The message type.</param>
        public static async Task<bool> Send(Client client, byte[] message, WebSocketMessageType type = WebSocketMessageType.Binary)
        {
            try
            {
                if (client.Socket.State == WebSocketState.Open)
                    await client.Socket.SendAsync(new ArraySegment<byte>(message), type, true, CancellationToken.None);

                return true;
            }
            catch (Exception ex)
            {
                client.SendException = ex;
                return false;
            }
        }

        /// <summary>
        /// Removes the client with the specified client id from the active client list and unsubscribes the client from the data update manager.
        /// </summary>
        /// <param name="clientId">The unique client identifier.</param>
        public static void RemoveClient(string clientId)
        {
            if (Clients.TryGetValue(clientId, out var client))
                RemoveClient(client);
        }

        /// <summary>
        /// Removes the specified client from the active client list and unsubscribes the client from the data update manager. 
        /// </summary>
        /// <param name="client">The client object.</param>
        /// <returns></returns>
        public static bool RemoveClient(Client client)
        {
            var removed = false;

            lock (Clients)
            {
                removed = Clients.TryRemove(client.Id, out Client value);
                DataUpdateManager.Unsubscribe(client);
            }

            return removed;
        }

        /// <summary>
        /// Invokes the specifed method.
        /// </summary>
        private async Task InvokeMethodAsync(DataRequest request, Client client)
        {
            string method = request.ServerMethod;

            if (!string.IsNullOrEmpty(DefaultNamespace) && !method.StartsWith(DefaultNamespace + ".", StringComparison.OrdinalIgnoreCase))
            {
                method = DefaultNamespace + "." + method;
            }

            var fullName = method.Substring(0, method.LastIndexOf('.'));
            var methodName = method.Substring(method.LastIndexOf('.') + 1);
            object instance = null;
            object[] args = { client, request };

            lock (_methods)
            {
                if (_assemblyTypes == null)
                    _assemblyTypes = this.GetType().Assembly.GetTypes().ToList();
            }

            var methodInfo = _methods.GetOrAdd(method, _ =>
            {
                Type type = null;

                foreach (Type t in _assemblyTypes)
                {
                    if (t.FullName.Equals(fullName, StringComparison.OrdinalIgnoreCase))
                    {
                        type = t;
                        break;
                    }
                }

                if (type == null)
                    throw new InvalidOperationException($"Bindary dispatch: type '{fullName}' not found.");

                var mi = type.GetMethod(methodName, System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public, null, new[] { typeof(Client), typeof(DataRequest) }, null);

                if (mi == null)
                    throw new InvalidOperationException($"Bindary dispatch: method '{methodName}' with signature (Client, DataRequest) not found on '{fullName}'.");

                return mi;
            });

            var isStatic = methodInfo.IsStatic;

            if (!isStatic && !_instances.TryGetValue(fullName, out instance))
            {
                instance = (ClassInstantiator == null) ? Activator.CreateInstance(this.GetType().Assembly.GetType(fullName, false, true)) : ClassInstantiator(this.GetType().Assembly.GetType(fullName));
                var isReusable = instance.GetType().IsDefined(typeof(ReusableAttribute), inherit: false);

                if (isReusable)
                    instance = _instances.GetOrAdd(fullName, instance);
            }

            await (Task)methodInfo.Invoke(instance, args);
        }

        /// <summary>
        /// Load client from specified data query.
        /// </summary>
        /// <param name="ctxData"></param>
        /// <param name="clientId"></param>
        /// <param name="socket"></param>
        /// <returns></returns>
        private Client LoadClient(ContextData ctxData, string clientId, WebSocket socket)
        {
            if (this.UseSessionIdForClients)
                clientId = ctxData.Session.Id;
            else if (string.IsNullOrEmpty(clientId))
                clientId = Convert.ToBase64String(Guid.NewGuid().ToByteArray()).Replace("/", "-").Replace("+", "_").Replace("=", "");


            Client client;
            var found = false;

            if (!(found = Clients.TryGetValue(clientId, out client)))
            {
                client = new Client();
                client.Id = clientId;
                client.IPv4Address = ctxData.IP4;
                client.IPv6Address = ctxData.IP6;
                client.IsNew = true;
                client.Session = ctxData.Session;
                client.LastActivity = DateTime.Now;

                if (!ctxData.IsXHR)
                {
                    client.Socket = socket;
                    client.IsWebSocket = true;
                }

                Clients[clientId] = client;
            }
            else
            {
                lock (client)
                {
                    client.IsNew = false;
                    client.Session = ctxData.Session;
                    client.LastActivity = DateTime.Now;

                    if (!ctxData.IsXHR)
                    {
                        client.Socket = socket;
                        client.IsWebSocket = true;
                    }

                    // there is a possibility that the client is removed from the list through the activity monitor due to inactivity just before this lock, check and restore
                    if (!Clients.ContainsKey(clientId))
                        Clients[clientId] = client;
                }
            }

            return client;
        }

        private DataRequest Deserialize(string message, bool xhr = false)
        {
            DataRequest request = null;

            try
            {
                request = Json.Utility.Deserialize<DataRequest>(message);

                try
                {
                    if (request != null && ClientDataRequestToDictionary && !string.IsNullOrWhiteSpace(request.Data))
                        request.DataDictionary = Json.Utility.Deserialize<CaseInsensitiveDictionary<object>>(request.Data, DataRequestJsonSerializer);
                    
                }
                catch (Exception ex)
                {
                    request.DeserializationException = ex;
                }
            }
            finally
            {
                if (request == null && xhr)
                    request = new DataRequest();

                if (xhr)
                    request.XhrRequestId = Guid.NewGuid().ToString();

                if (request != null)
                    request.Message = message;
            }

            return request;
        }
        private async Task<WebSocketResult> ReceiveWebSocketData(WebSocket socket)
        {
            ArraySegment<Byte> buffer = new ArraySegment<byte>(new Byte[this.WebSocketBufferSize]); // 8KB buffer
            WebSocketReceiveResult receive = null;
            var result = new WebSocketResult();

            using (var ms = new MemoryStream())
            {
                do
                {
                    if (ms.Capacity > this.WebSocketMaxMessageSize)
                        throw new Exception($"The received message exceeds the maximum allowed message size. The Bindary server setting WebSocketMaxMessageSize is set to allow {this.WebSocketMaxMessageSize} bytes.");

                    receive = await socket.ReceiveAsync(buffer, CancellationToken.None);
                    ms.Write(buffer.Array, buffer.Offset, receive.Count);
                }
                while (!receive.EndOfMessage);

                result.Message = ms.ToArray();
                result.ReceiveResult = receive;
            }

            return result;
        }

        private class WebSocketResult
        {
            public WebSocketReceiveResult ReceiveResult { get; set; }
            public byte[] Message { get; set; }
        }

        private class ContextData
        {
            public ISession Session { get; set; }
            public System.Net.IPAddress IP4 { get; set; }
            public System.Net.IPAddress IP6 { get; set; }
            public bool IsXHR { get; set; }
        }
    }
}
