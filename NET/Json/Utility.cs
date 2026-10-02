using Componyx.Common.Json;
using System;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Componyx.UI.Json
{
    /// <summary>
    /// Provides the JSON serialization used by Componyx.UI for data sent to and received from the client.
    /// </summary>
    public static class Utility
    {
        private static IJsonSerializer _serializer = new DefaultSerializer();

        /// <summary>
        /// Gets or sets the serializer used by Componyx.UI. Set this once at application startup. Defaults to a System.Text.Json based serializer that writes camelCase property names and dictionary keys, as expected by the client.
        /// </summary>
        public static IJsonSerializer Serializer
        {
            get => _serializer;
            set => _serializer = value ?? throw new ArgumentNullException(nameof(value));
        }

        /// <summary>
        /// Serializes the object to JSON.
        /// </summary>
        /// <typeparam name="T">The data type.</typeparam>
        /// <param name="obj">The object to serialize.</param>
        /// <param name="serializer">The serializer to use. When omitted, <see cref="Serializer"/> is used.</param>
        /// <returns>The JSON string.</returns>
        public static string Serialize<T>(T obj, IJsonSerializer serializer = null)
        {
            return (serializer ?? _serializer).Serialize(obj);
        }

        /// <summary>
        /// Deserializes the object from JSON.
        /// </summary>
        /// <typeparam name="T">The data type.</typeparam>
        /// <param name="json">The JSON string.</param>
        /// <param name="serializer">The serializer to use. When omitted, <see cref="Serializer"/> is used.</param>
        /// <returns>The deserialized object.</returns>
        public static T Deserialize<T>(string json, IJsonSerializer serializer = null)
        {
            return (serializer ?? _serializer).Deserialize<T>(json);
        }

        /// <summary>
        /// The default serializer. Uses separate options for writing and reading, because System.Text.Json does not allow reference handling (needed when writing) together with populating existing objects (needed when reading).
        /// </summary>
        private sealed class DefaultSerializer : IJsonSerializer
        {
            private readonly IJsonSerializer _writer;
            private readonly IJsonSerializer _reader;

            public DefaultSerializer()
            {
                var writeOptions = CreateBaseOptions();
                writeOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles; // like Newtonsoft's ReferenceLoopHandling.Ignore

                var readOptions = CreateBaseOptions();
                readOptions.PreferredObjectCreationHandling = JsonObjectCreationHandling.Populate; // Newtonsoft fills get-only collections and existing objects

                _writer = new SystemTextJsonSerializer(writeOptions);
                _reader = new SystemTextJsonSerializer(readOptions);
            }

            public string Serialize<T>(T data)
            {
                return _writer.Serialize(data);
            }

            public T Deserialize<T>(string json)
            {
                return _reader.Deserialize<T>(json);
            }

            private static JsonSerializerOptions CreateBaseOptions()
            {
                return new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    DictionaryKeyPolicy = JsonNamingPolicy.CamelCase, // Newtonsoft's CamelCasePropertyNamesContractResolver camelCases dictionary keys too
                    PropertyNameCaseInsensitive = true,
                    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                    IncludeFields = true, // Newtonsoft serializes public fields
                    NumberHandling = JsonNumberHandling.AllowReadingFromString, // Newtonsoft reads "123" into numeric properties
                    AllowTrailingCommas = true,
                    ReadCommentHandling = JsonCommentHandling.Skip,
                    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping, // no \uXXXX for non-ASCII or HTML characters, like Newtonsoft
                    Converters = { new LenientEnumConverter() } // enums by name or number, written as numbers, like Newtonsoft
                };
            }
        }
    }
}