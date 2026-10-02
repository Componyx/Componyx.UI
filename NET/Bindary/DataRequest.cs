using Componyx.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Componyx.UI.Bindary
{
    /// <summary>
    /// This type is used to represent the client request data.
    /// </summary>
    public class DataRequest
    {
        /// <summary>
        /// Gets the client id that was send with the request.
        /// </summary>
        public string ClientId { get; set; }

        /// <summary>
        /// Gets the xhr request id that was generated for this request.
        /// </summary>
        public string XhrRequestId { get; protected internal set; }

        /// <summary>
        /// Gets the client route index.
        /// </summary>
        public int RouteIndex { get; set; }

        /// <summary>
        /// Gets the client route path.
        /// </summary>
        public string RoutePath { get; set; }

        /// <summary>
        /// Gets the method to invoke on the server.
        /// </summary>
        public string ServerMethod { get; set; }

        /// <summary>
        /// Gets the identifier of the callback method to invoke on the client.
        /// </summary>
        public string CallbackId { get; set; }

        /// <summary>
        /// Gets the client data request message.
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Gets a value indicating if we are dealing with the initial data load.
        /// </summary>
        public bool InitialLoad { get; set; }

        /// <summary>
        /// Gets a value indicating if the request is made to update the websocket object on the client.
        /// </summary>
        public bool WebSocketUpdate { get; set; }

        /// <summary>
        /// Gets the data query.
        /// </summary>
        public string Data { get; set; }

        /// <summary>
        /// Gets the custom request data query as dictionary when ClientDataRequestToDictionaryy on the DataServer is set to true.
        /// </summary>
        public CaseInsensitiveDictionary<object> DataDictionary { get; set; }

        /// <summary>
        /// Gets the exception if an exception occurred while deserializing the data within the data request as dictionary.
        /// </summary>
        public Exception DeserializationException { get; set; }

        /// <summary>
        /// Creates a new instance of the class.
        /// </summary>
        public DataRequest()
        {
            DataDictionary = new CaseInsensitiveDictionary<object>();
        }
    }
}
