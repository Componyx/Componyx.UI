using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Componyx.UI.Bindary
{
    /// <summary>
    /// This type is used to check client activity.
    /// </summary>
    public class ClientActivityMonitor
    {
        private static Thread _monitor;
        private static int _removeInactiveClientsInterval = 60;
        private static int _inactiveClientXhrTimeout = 1200;
        private static int _disconnectedWebSocketTimeout = 60;
        private static Func<Client, bool> _callback;
        private static bool _stop = false;
        private static Dictionary<Client, DateTime> _wsClients = new Dictionary<Client, DateTime>();

        /// <summary>
        /// Gets a value indicating if the client activity monitor is running.
        /// </summary>
        public static bool IsRunning { get; private set; } = false;

        /// <summary>
        /// Starts the client activity monitor as a running background proces which removes inactive clients.
        /// </summary>
        /// <param name="removeInactiveClientsInterval">The interval in seconds (1min default) between each check where inactive clients are removed from the connected clients list.</param>
        /// <param name="inactiveClientXhrTimeout">The amount of time in seconds before an XHR connected client is considered to be inactive.</param>
        /// <param name="disconnectedWebSocketTimeout">The amount of time in seconds (2min default) before a WebSocket connected client is considered to be inactive when the connection is in a closed state. If the WebSocket connection is opened again within this time-frame the Client is not considered inactive.</param>
        /// <param name="callback">A callback method which is invoked before an inactive/disconnected client is removed from the active client list. The remove action can be cancelled by returning false from the callback method.</param>
        public static void Start(int removeInactiveClientsInterval = 60, int inactiveClientXhrTimeout = 1200, int disconnectedWebSocketTimeout = 120, Func<Client, bool> callback = null)
        {
            _removeInactiveClientsInterval = removeInactiveClientsInterval;
            _inactiveClientXhrTimeout = inactiveClientXhrTimeout;
            _disconnectedWebSocketTimeout = disconnectedWebSocketTimeout;
            _callback = callback;

            _monitor = new Thread(Run);
            _monitor.IsBackground = true;
            _monitor.Start();
            IsRunning = true;
        }

        /// <summary>
        /// Stops the client activity monitor.
        /// </summary>
        public static void Stop()
        {
            IsRunning = false;
            _stop = true;
        }

        private static void Run()
        {
            while (!_stop)
            {
                RemoveInactiveClients();
                Thread.Sleep(_removeInactiveClientsInterval * 1000);
            }
        }

        /// <summary>
        /// Removes clients that are inactive for a specified time period.
        /// </summary>
        private static void RemoveInactiveClients()
        {
            bool result = true;

            lock (Server.Clients)
            {
                foreach (var clientId in Server.Clients.Keys)
                {
                    Client client;

                    if (Server.Clients.TryGetValue(clientId, out client))
                    {
                        lock (client)
                        {
                            if (client == null)
                            {
                                Server.Clients.TryRemove(clientId, out Client removedClient);
                                continue;
                            }

                            var expiredWSConnection = false;

                            try
                            {
                                expiredWSConnection = (client.IsWebSocket && (client.Socket == null || (client.Socket.State >= WebSocketState.Closed))); // requesting WebSocket object can result in exception when it's no longer avaiable
                            }
                            catch
                            {
                                expiredWSConnection = client.IsWebSocket;
                            }

                            if (expiredWSConnection && !_wsClients.ContainsKey(client))
                                _wsClients.Add(client, DateTime.Now);
                            else if (client.IsWebSocket && !expiredWSConnection && _wsClients.ContainsKey(client))
                                _wsClients.Remove(client); // remove client when the client exists in the marked for deletion list while websocket is reconnected

                            if ((expiredWSConnection && (DateTime.Now - _wsClients[client]).TotalSeconds >= _disconnectedWebSocketTimeout) ||
                                (!client.IsWebSocket && (DateTime.Now - client.LastActivity).TotalSeconds >= _inactiveClientXhrTimeout))
                            {
                                result = true;

                                if (_callback != null)
                                    result = _callback(client);

                                if (result)
                                {
                                    Server.RemoveClient(client);

                                    if (expiredWSConnection)
                                        _wsClients.Remove(client);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
