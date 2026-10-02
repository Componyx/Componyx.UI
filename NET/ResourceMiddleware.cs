using Componyx.Common;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Componyx.UI
{
    /// <summary>
    /// This class has no specific description yet.
    /// </summary>
    public class ResourceMiddleware
    {
        private readonly RequestDelegate _next;

        /// <summary>
        /// The component types for which resources are loaded through this resource handler.
        /// </summary>
        public static Dictionary<string, Type> _components = new Dictionary<string, Type>();

        /// <summary>
        /// Adds the component name and type for which to load resources through this resource handler.
        /// </summary>
        /// <param name="name">The component name.</param>
        /// <param name="type">The component type.</param>
        public static void AddComponent(string name, Type type)
        {
            if (!_components.ContainsKey(name))
                _components.Add(name, type);
        }

        /// <summary>
        /// Initializes a new instance of the class.
        /// </summary>
        /// <param name="next"></param>
        public ResourceMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        /// <summary>
        /// Handles the request.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public async Task InvokeAsync(HttpContext context)
        {
            string data = context.Request.Query["d"][0];
            string version = (context.Request.Query["v"].Count > 0) ? context.Request.Query["v"][0] : "";
            string name = data.Substring(0, data.IndexOf("."));
            bool isBase = name == "Base";
            Type type = GetType(name);
            string nameSpace = type.Namespace;
            string path = string.Format("{0}.{1}.Resources", nameSpace, name);
            string basePath = string.Format("{0}.{1}.Resources", nameSpace, "Base");
            string resource = "";
            string content = "";
            string contentType = "text/css";
            string url;
            Regex rgx = new Regex("<%=WebResource\\(\"([^\"]*)\"\\)%>");
            bool byteResponse = false;
            byte[] ba = null;

            if (isBase && (data != "Base.js" && data != "Base.min.js"))
                data = data.Replace("Base.", "");

            if (data.Contains("Themes."))
            {
                if (!isBase)
                    data = data[(data.IndexOf(".") + 1)..];

                resource = string.Format("{0}.CSS.{1}", path, data);
            }
            else
            {
                if (data.EndsWith(".js"))
                {
                    resource = string.Format("{0}.Script.{1}", path, data);
                    contentType = "text/javascript";
                }
                else if (data.EndsWith(".css"))
                {
                    resource = string.Format("{0}.CSS.{1}", path, data);
                }
                else if (data.EndsWith(".woff") || data.EndsWith(".ttf"))
                {
                    contentType = string.Format("application/font-{0}", data[(data.LastIndexOf(".") + 1)..]);
                    resource = string.Format("{0}.Font.{1}", path, data);
                    byteResponse = true;
                }
                else
                {
                    data = data[(data.IndexOf(".") + 1)..];
                    resource = string.Format("{0}.Data.{1}", path, data);
                }
            }

            if (byteResponse)
                ba = Utility.GetEmbeddedResourceBytes(resource, type.Assembly);
            else
            {
                content = Utility.GetEmbeddedResourceContent(resource, type.Assembly);

                if (contentType == "text/css")
                {
                    url = Utility.GetWebRootUrl(context) + context.Request.PathBase.Value.TrimStart('/').TrimEnd('/') + "?d=";
                    content = rgx.Replace(content, string.Format("{0}$1", url)); // first replace <%=WebResource...%> for resource url with path

                    if (!isBase)
                        content = content.Replace(string.Format("{0}.CSS.", basePath), "Base."); //CSS: replace references to CSS files located in Base Resources, Componyx.UI.Base.Resources.CSS.ComponentIcons.css -> Base.ComponentIcons.css

                    content = content.Replace(string.Format("{0}.Font.", path), (isBase) ? name + "." : ""); // Fonts: Base resources include "Base" in the request ("Base.UI.woff") but other components do not ("Editor.woff")
                }
            }

            context.Response.ContentType = contentType;

            if (!string.IsNullOrEmpty(version)) // version is specified, cache response
            {
                context.Response.GetTypedHeaders().CacheControl = new Microsoft.Net.Http.Headers.CacheControlHeaderValue()
                {
                    Public = true,
                    MaxAge = new TimeSpan(168, 0, 0) // cache one week
                };
            }

            if (byteResponse)
                await context.Response.Body.WriteAsync(ba);
            else
                await context.Response.WriteAsync(content);
        }

        private Type GetType(string name)
        {
            Type type;

            if (_components.TryGetValue(name, out type))
                return type;

            return this.GetType();
        }
    }
}
