using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Componyx.UI
{
    /// <summary>
    /// This class provides options for the search middleware.
    /// </summary>
    public class AppSkinSearchOptions
    {
        /// <summary>
        /// Gets or sets the file path of the keyword file.
        /// </summary>
        public string KeywordFilePath { get; set; }
        /// <summary>
        /// Gets or sets a value indicating if a search action is executed with either contains (true) or starts with (false).
        /// </summary>
        public bool Contains { get; set; }
    }
}
