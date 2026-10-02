using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Componyx.UI
{
    /// <summary>
    /// This class has no specific description yet.
    /// </summary>
    public class Utility
    {
        /// <summary>
        /// Gets the specified name in camel case format.
        /// </summary>
        /// <param name="name">The name to format.</param>
        /// <returns>A camel cased name.</returns>
        public static string CamelCase(string name)
        {
            return name[0].ToString().ToLower() + name.Substring(1);
        }

        /// <summary>Retrieves the content from the embedded resource as string.</summary>
        /// <param name="embeddedResource">The resource name including the namespace from which to retrieve the content</param>
        /// <param name="assembly">The assembly containing the resource file.</param>
        /// <remarks></remarks>
        public static string GetEmbeddedResourceContent(string embeddedResource, Assembly assembly)
        {
            string fileContent;

            using (System.IO.Stream stream = assembly.GetManifestResourceStream(embeddedResource))
            {
                using (System.IO.StreamReader reader = new System.IO.StreamReader(stream))
                {
                    fileContent = reader.ReadToEnd();
                }
            }

            return fileContent;
        }

        /// <summary>Retrieves the content from the embedded resource as byte array.</summary>
        /// <param name="embeddedResource">The resource name including the namespace from which to retrieve the content</param>
        /// <param name="assembly">The assembly containing the resource file.</param>
        /// <remarks></remarks>
        public static byte[] GetEmbeddedResourceBytes(string embeddedResource, Assembly assembly)
        {
            using (System.IO.Stream stream = assembly.GetManifestResourceStream(embeddedResource))
            {
                if (stream == null)
                    return null;

                byte[] ba = new byte[stream.Length];
                stream.ReadExactly(ba);
                return ba;
            }
        }

        /// <summary>
        /// Gets the web root url.
        /// </summary>
        /// <param name="context">The current active http context.</param>
        /// <returns></returns>
        public static string GetWebRootUrl(HttpContext context)
        {
            return context.Request.Scheme + "://" + context.Request.Host + "/";
        }

        /// <summary>
        /// Gets the IPv4 address of the remote client.
        /// </summary>
        /// <param name="context">The current active http context.</param>
        /// <returns>IPv4 address.</returns>
        public static IPAddress GetClientIPv4(HttpContext context)
        {
            try
            {
                return Array.FindAll(Dns.GetHostEntry(context.Connection.RemoteIpAddress).AddressList, a => a.AddressFamily == AddressFamily.InterNetwork).FirstOrDefault();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Gets the IPv6 address of the remote client.
        /// </summary>
        /// <param name="context">The current active http context.</param>
        /// <returns>IPv6 address.</returns>
        public static IPAddress GetClientIPv6(HttpContext context)
        {
            try
            {
                return Array.FindAll(Dns.GetHostEntry(context.Connection.RemoteIpAddress).AddressList, a => a.AddressFamily == AddressFamily.InterNetworkV6).FirstOrDefault();
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        /// <summary>
        /// Get resource names for specified type.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static string[] GetResourceNames(System.Type type)
        {
            return System.Reflection.Assembly.GetAssembly(type).GetManifestResourceNames();
        }

        /// <summary>
        /// Creates a new date object by parsing the value with the specified date format.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="format"></param>
        /// <returns></returns>
        public static DateTime? ParseDate(string value, string format)
        {
            int year = 0, month = 0, day = 0;
            Regex splitRegEx = new Regex("[^\\w]");
            Regex digitRegEx = new Regex("^[0-9]+$");
            string splitChar = splitRegEx.Match(format).Value;
            string[] parts = format.Split(splitChar[0]);
            string[] dt = value.Split(splitChar[0]);
            string part;

            // digit mismatch           
            if (dt.Length < 3 || !digitRegEx.IsMatch(dt[0]) || !digitRegEx.IsMatch(dt[1]) || !digitRegEx.IsMatch(dt[2]))
                return null;

            // format mismatch
            if ((parts[0].Length > dt[0].Length) || (parts[1].Length > dt[1].Length) || (parts[2].Length > dt[2].Length) ||
                (parts[0].Length != dt[0].Length && int.Parse(dt[0]) <= 9) ||
                (parts[1].Length != dt[1].Length && int.Parse(dt[1]) <= 9) ||
                (parts[2].Length != dt[2].Length && int.Parse(dt[2]) <= 9))
                return null;

            part = value.Substring(format.IndexOf("y"));
            year = (part.IndexOf(splitChar) > -1) ? int.Parse(part.Substring(0, part.IndexOf(splitChar))) : int.Parse(part);
            part = value.Substring(format.IndexOf("M"));
            month = (part.IndexOf(splitChar) > -1) ? int.Parse(part.Substring(0, part.IndexOf(splitChar))) : int.Parse(part);
            part = value.Substring(format.IndexOf("d"));
            day = (part.IndexOf(splitChar) > -1) ? int.Parse(part.Substring(0, part.IndexOf(splitChar))) : int.Parse(part);

            // wrong date
            if (year.ToString().Length > 4 || month.ToString().Length > 2 || day.ToString().Length > 2 || day == 0 || month == 0 || year == 0)
                return null;

            return new DateTime(year, month, day);
        }
    }
}
