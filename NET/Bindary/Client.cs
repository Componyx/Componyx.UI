using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Componyx.UI.Bindary
{
    /// <summary>
    /// This type is used to store information of a connected client.
    /// </summary>
    public class Client
    {
        /// <summary>
        /// Gets or sets the unique client id.
        /// To be able to uniquely identify clients, a unique client id must be send with each request. 
        /// The Bindary server uses sessionid's by default if no id is provided with the first client request.
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Gets the ip v4 address of the remote client.
        /// </summary>
        public IPAddress IPv4Address { get; protected internal set; }

        /// <summary>
        /// Gets the ip v6 address of the remote client.
        /// </summary>
        public IPAddress IPv6Address { get; protected internal set; }

        /// <summary>
        /// Gets the WebSocket associated with the remote client.
        /// </summary>
        public WebSocket Socket { get; protected internal set; }

        /// <summary>
        /// Gets the HttpContext associated with the remote client.
        /// </summary>
        public ISession Session { get; protected internal set; }

        /// <summary>
        /// Gets or sets a value indicating if the client is connected through a WebSocket.
        /// </summary>
        public bool IsWebSocket { get; protected internal set; }

        /// <summary>
        /// Gets a value indicating if this is the first request of the client.
        /// </summary>
        public bool IsNew { get; protected internal set; }

        /// <summary>
        /// Gets a time stamp value indicating the client's last activity.
        /// </summary>
        public DateTime LastActivity { get; protected internal set; }

        /// <summary>
        /// Gets the response message for the current XHR request.
        /// </summary>
        public Dictionary<string, List<string>> XhrResponseMessage { get; protected internal set; } = new Dictionary<string, List<string>>();

        /// <summary>
        /// Gets the response message queue.
        /// </summary>
        public List<string> XhrResponseMessageQueue { get; protected internal set; } = new List<string>();

        /// <summary>
        /// Gets or sets a value indicating if the XHR response will contain a single message (true) or will include all queued messages (false).
        /// By default all queued messages are sent. Only the last message from a message queue will be sent when this setting is set to true.
        /// </summary>
        public bool IgnoreQueuedXhrMessages { get; set; }

        /// <summary>
        /// Gets or sets the send Exception.
        /// </summary>
        public Exception SendException { get; set; }

        /// <summary>
        /// Updates the stored client Session.
        /// </summary>
        /// <param name="session">The active Session object.</param>
        /// <param name="overwriteExisting">Overwrite keys on the active Session object with previously stored values.</param>
        public void UpdateSession(ISession session, bool overwriteExisting = false)
        {
            var oldSession = this.Session;

            this.Session = session;

            if (oldSession == null || !oldSession.Keys.Any()) // no values to copy
                return;

            foreach (var key in session.Keys)
            {
                if (oldSession.GetString(key) != session.GetString(key))
                    return; // values on the new session object have changed, do not copy values
            }

            foreach (var key in oldSession.Keys)
            {
                if (overwriteExisting || !session.Keys.Contains(key))
                {
                    session.SetString(key, oldSession.GetString(key));
                }
            }
        }

    }
}
