using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.Xml.Serialization;
using System.ComponentModel;
using System.Collections;
using System.Reflection;
using Componyx.Common;

namespace Componyx.UI.Base
{
    /// <summary>
    /// This class has no specific description yet.
    /// </summary>
    public class ItemList<T> : System.Collections.Generic.List<T>
    {
        /// <summary>
        /// Deserializes the JSON formatted string in to an itemlist of type T.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static ItemList<T> Deserialize(string data)
        {
            return UI.Json.Utility.Deserialize<ItemList<T>>(data);
        }

        /// <summary>
        /// Serializes the itemlist of type T to a JSON formatted string.
        /// </summary>
        /// <returns></returns>
        public string Serialize()
        {
            return UI.Json.Utility.Serialize(this);
        }

        /// <summary>
        /// Serializes the itemlist of type T to a JSON memory stream.
        /// </summary>
        /// <returns></returns>
        public System.IO.MemoryStream SerializeToStream()
        {
            return new System.IO.MemoryStream(Encoding.UTF8.GetBytes(Serialize()));
        }
    }
}
