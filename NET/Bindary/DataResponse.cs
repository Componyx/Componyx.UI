using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Componyx.UI.Bindary
{
    /// <summary>
    /// This type is used to represent the client response data.
    /// </summary>
    public class DataResponse
    {
        /// <summary>
        /// Gets or sets the client id that was sent with the original request.
        /// </summary>
        public string ClientId { get; set; }

        /// <summary>
        /// Gets or sets the identifier of the callback method to invoke on the client.
        /// </summary>
        public string CallbackId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating that an error occurred.
        /// </summary>
        public bool IsError { get; set; }

        /// <summary>
        /// Gets or sets the client route index. If the route index is set, the routeData on the client is updated only when the active client route index matches with the data response.
        /// </summary>
        public int? RouteIndex { get; set; }

        /// <summary>
        /// Gets the client route path. If the route path is set, the viewData on the client is updated only when the active client route path matches with the data response.
        /// </summary>
        public string RoutePath { get; set; }

        /// <summary>
        /// /// Initializes a new instance of the Data Response class.
        /// </summary>
        internal DataResponse()
        {

        }

        /// <summary>
        /// Initializes a new instance of the Data Response class.
        /// </summary>
        /// <param name="callbackId">The client-side callback identifier which was specified in the data-request.</param>
        /// <param name="clientId">A custom generated client identifier not stored in a Session.</param>
        public DataResponse(string callbackId = null, string clientId = null)
        {
            this.ClientId = clientId;

            if (!string.IsNullOrEmpty(callbackId))
                this.CallbackId = callbackId;
        }
    }

    /// <summary>
    /// This type is used to represent the client response data.
    /// </summary>
    public class DataResponse<AppDataType> : DataResponse
    {
        /// <summary>
        /// Gets or sets the custom data within the response data.
        /// </summary>
        public DataContainer<AppDataType> Data { get; set; }

        /// <summary>
        /// Initializes a new instance of the Data Response class.
        /// </summary>
        /// <param name="callbackId">The client-side callback identifier which was specified in the data-request.</param>
        /// <param name="clientId">A custom generated client identifier not stored in a Session.</param>
        public DataResponse(string callbackId = null, string clientId = null) : base(callbackId, clientId)
        {
            this.Data = new DataContainer<AppDataType>();
        }
    }

    /// <summary>
    /// This type is used to represent the client response data.
    /// </summary>
    public class DataResponse<AppDataType, ViewDataType> : DataResponse
    {
        /// <summary>
        /// Gets or sets the custom data within the response data.
        /// </summary>
        public DataContainer<AppDataType, ViewDataType> Data { get; set; }
        
        /// <summary>
        /// Initializes a new instance of the Data Response class.
        /// </summary>
        /// <param name="callbackId">The client-side callback identifier which was specified in the data-request.</param>
        /// <param name="clientId">A custom generated client identifier not stored in a Session.</param>
        public DataResponse(string callbackId = null, string clientId = null) : base(callbackId, clientId)
        {
            this.Data = new DataContainer<AppDataType, ViewDataType>();
        }
    }

    /// <summary>
    /// This type is used to represent the client response data.
    /// </summary>
    public class DataResponse<AppDataType, RouteDataType, ViewDataType> : DataResponse
    {
        /// <summary>
        /// Gets or sets the custom data within the response data.
        /// </summary>
        public DataContainer<AppDataType, RouteDataType, ViewDataType> Data { get; set; }

        /// <summary>
        /// Initializes a new instance of the Data Response class.
        /// </summary>
        /// <param name="callbackId">The client-side callback identifier which was specified in the data-request.</param>
        /// <param name="clientId">A custom generated client identifier not stored in a Session.</param>
        public DataResponse(string callbackId = null, string clientId = null) : base(callbackId, clientId)
        {
            this.Data = new DataContainer<AppDataType, RouteDataType, ViewDataType>();
        }
    }

    /// <summary>
    /// This type is used to represent the client response data container.
    /// </summary>
    public class DataContainer<AppDataType>
    {
        /// <summary>
        /// Gets or sets the AppData.
        /// </summary>
        public AppDataType AppData { get; set; }

        /// <summary>
        /// Gets or sets the AppData update rules.
        /// </summary>
        public Componyx.Common.CaseInsensitiveDictionary<DataRules> AppDataRules { get; set; }
    }

    /// <summary>
    /// This type is used to represent the client response data container.
    /// </summary>
    public class DataContainer<AppDataType, ViewDataType> : DataContainer<AppDataType>
    {
        /// <summary>
        /// Gets or sets the ViewData.
        /// </summary>
        public ViewDataType ViewData { get; set; }

        /// <summary>
        /// Gets or sets the ViewData rules.
        /// </summary>
        public Componyx.Common.CaseInsensitiveDictionary<DataRules> ViewDataRules { get; set; }
    }

    /// <summary>
    /// This type is used to represent the client response data container.
    /// </summary>
    public class DataContainer<AppDataType, RouteDataType, ViewDataType> : DataContainer<AppDataType, ViewDataType>
    {
        /// <summary>
        /// Gets or sets the RouteData.
        /// </summary>
        public RouteDataType RouteData { get; set; }

        /// <summary>
        /// Gets or sets the RouteData update rules.
        /// </summary>
        public Componyx.Common.CaseInsensitiveDictionary<DataRules> RouteDataRules { get; set; }
    }
}
