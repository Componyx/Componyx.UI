using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Componyx.UI.Json
{
    /// <summary>
    /// Reads enum values from either their name (case-insensitive) or their number, and writes them as numbers. This matches the default enum handling of Newtonsoft.Json.
    /// </summary>
    internal sealed class LenientEnumConverter : JsonConverterFactory
    {
        /// <inheritdoc/>
        public override bool CanConvert(Type typeToConvert)
        {
            return typeToConvert.IsEnum;
        }

        /// <inheritdoc/>
        public override JsonConverter CreateConverter(Type typeToConvert, JsonSerializerOptions options)
        {
            return (JsonConverter)Activator.CreateInstance(typeof(EnumConverter<>).MakeGenericType(typeToConvert));
        }

        private sealed class EnumConverter<T> : JsonConverter<T> where T : struct, Enum
        {
            public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            {
                if (reader.TokenType == JsonTokenType.String)
                {
                    var name = reader.GetString();

                    if (Enum.TryParse(name, true, out T value))
                        return value;

                    throw new JsonException($"The value '{name}' is not valid for enum {typeof(T).Name}.");
                }

                if (reader.TokenType == JsonTokenType.Number && reader.TryGetInt64(out long number))
                    return (T)Enum.ToObject(typeof(T), number);

                throw new JsonException($"Unexpected token {reader.TokenType} for enum {typeof(T).Name}.");
            }

            public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
            {
                writer.WriteNumberValue(Convert.ToInt64(value));
            }
        }
    }
}