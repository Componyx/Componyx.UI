using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Componyx.Common;

namespace Componyx.UI
{
    /// <summary>
    /// This class has no specific description yet.
    /// </summary>
    public class AppSkinError
    {
        /// <summary>
        /// Gets or sets the Error Message.
        /// </summary>
        public bool IsError { get { return true; }}

        /// <summary>
        /// Gets or sets the Error Message.
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Gets or sets the stack trace.
        /// </summary>
        public string StackTrace { get; set; }

        /// <summary>
        /// Gets or sets the timestamp.
        /// </summary>
        public DateTime Timestamp { get; set; }

        /// <summary>
        /// Gets or sets the logged identifier of the error.
        /// </summary>
        public int? Id { get; set; }

        /// <summary>
        /// Creates and initializes a new instance.
        /// </summary>
        /// <param name="ex"></param>
        /// <param name="logId"></param>
        public AppSkinError(Exception ex, int? logId = null)
        {
            this.Id = logId;
            this.Message = ex.Message;
            this.StackTrace = ex.StackTrace;
            this.Timestamp = DateTime.Now;
        }

        /// <summary>
        /// Serializes the error to a JSON string.
        /// </summary>
        /// <returns></returns>
        public string ToJSON()
        {
            return Json.Utility.Serialize(this);
        }
    }
}
