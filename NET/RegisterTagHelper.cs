using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Componyx.UI.TagHelpers
{
    /// <summary>
    /// This class has no specific description yet.
    /// </summary>
    [HtmlTargetElement("componyx-ui-resources")]
    public class RegisterTagHelper : TagHelper
    {
        private const string _resourceHandler = "resource-handler";
        private const string _enableOnDemand = "enable-ondemand";
        private const string _includeVersion = "include-version";
        private const string _enableBindaryJS = "enable-Bindary-js";
        private const string _enableBaseJS = "enable-base-js";
        private const string _theme = "theme";

        /// <summary>
        /// Gets or sets the path of the UI resource handler (defaults to src).
        /// </summary>
        [HtmlAttributeName(_resourceHandler)]
        public string ResourceHandler { get; set; } = "/src";

        /// <summary>
        ///  Gets or sets a value indicating if on demand loading of components is enabled (true by default). If disabled, the complete MINIFIED UI component set will be registered at once. 
        /// </summary>
        [HtmlAttributeName(_enableOnDemand)]
        public bool EnableOnDemand { get; set; } = true;

        /// <summary>
        /// Gets or sets a value indicating if the assembly version is appended to the resource path.
        /// </summary>
        [HtmlAttributeName(_includeVersion)]
        public bool IncludeVersion { get; set; } = true;

        /// <summary>
        /// Gets or sets a value indicating if the Development Library and the UI Base JavaScript files are registered on the page (true by default). Only applicable when on demand is enabled.
        /// </summary>
        [HtmlAttributeName(_enableBaseJS)]
        public bool EnableBaseJS { get; set; } = true;

        /// <summary>
        /// Gets or sets a value indicating if the Bindary JavaScript file is registered on the page (true by default). Only applicable when on demand is enabled.
        /// </summary>
        [HtmlAttributeName(_enableBindaryJS)]
        public bool EnableBindaryJS { get; set; } = true;

        /// <summary>
        /// Gets or sets the CSS theme.
        /// </summary>
        [HtmlAttributeName(_theme)]
        public ThemeOption Theme { get; set; } = ThemeOption.Default;


        /// <summary>
        /// ThemeOption Enum
        /// </summary>
        public enum ThemeOption
        {
            /// <summary>
            /// No CSS Theme.
            /// </summary>
            None = -1,
            /// <summary>
            /// The Base CSS Theme contains all the basic component styling without specifying colors. Active for all Themes including custom Themes specified through cssThemeName.
            /// </summary>
            Base = 0,
            /// <summary>
            /// Default CSS Theme.
            /// </summary>
            Default = 1,
        }


        /// <summary>
        /// Handles the request.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="output"></param>
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            var type = this.GetType();
            var assembly = type.Assembly;
            string nameSpace = type.Namespace;
            var version = assembly.GetName().Version.ToString();
            var content = new StringBuilder();
            var src = new Dictionary<string, string>
            {
                ["BaseLibrary"] = "Base.Library.js",
                ["Base"] = "Base.js",
                ["BaseBindary"] = "Base.Bindary.js",
                ["BaseCSS"] = (Theme >= ThemeOption.Base) ? "Base.UI.css" : "",
                ["ThemeCSS"] = (Theme > ThemeOption.Base) ? $"Base.Themes.{Theme}.css" : "",
                ["BaseUI"] = "Base.UI.min.js"
            };

            var scriptTag = $"<script src=\"{ResourceHandler}?d={{0}}" + ((IncludeVersion) ? $"&v={version}" : "") + "\"></script>";
            var cssTag = $"<link rel=\"stylesheet\" href=\"{ResourceHandler}?d={{0}}" + ((IncludeVersion) ? $"&v={version}" : "") + "\"/>";
            var release = false;

#if !DEBUG
    release = true;

    foreach (var key in src.Keys.ToList())
    {
        src[key] = src[key].Replace(".js", ".min.js").Replace(".css", ".min.css");
    }
#endif

            if (EnableOnDemand)
            {
                if (EnableBaseJS)
                {
                    content.AppendFormat(scriptTag, src["BaseLibrary"]);
                    content.AppendFormat(scriptTag, src["Base"]);
                }

                content.Append("<script>");

                var path = ResourceHandler + "?d=";
                content.AppendFormat(
                    "componyx.UI.setResourcePath('{0}{1}.js', '{0}{1}.css', 1, '{0}{{0}}.Themes.Default.{2}css');",
                    path,
                    (release) ? "{0}.min" : "{0}",
                    (release) ? "min." : ""
                );

                if (IncludeVersion)
                    content.AppendFormat("$UI.version = '{0}';", version);

                content.Append("</script>");

                if (EnableBindaryJS)
                    content.AppendFormat(scriptTag, src["BaseBindary"]);
            }
            else
            {
                content.AppendFormat(scriptTag, src["BaseUI"]);
            }

            if (Theme >= ThemeOption.Base)
                content.AppendFormat(cssTag, src["BaseCSS"]);

            if (Theme > ThemeOption.Base)
                content.AppendFormat(cssTag, src["ThemeCSS"]);

            output.TagName = null;
            output.Content.SetHtmlContent(content.ToString());
        }
    }
}
