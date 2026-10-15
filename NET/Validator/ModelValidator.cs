using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using Componyx.Common;

namespace Componyx.UI
{
    /// <summary>
    /// Validates models and model properties using their DataAnnotations validation attributes.
    /// </summary>
    public static class ModelValidator
    {
        /// <summary>
        /// Validates a single value against the validation attributes of a model property.
        /// String values are converted to the property type using the invariant culture (e.g. 1234.5 and 2026-10-11).
        /// </summary>
        /// <typeparam name="T">The model type.</typeparam>
        /// <param name="propertyPath">The property name or path, e.g. "Name", "Address.Street" or "Children[0].Name".</param>
        /// <param name="value">The value to validate, as an invariant string or an already typed value.</param>
        /// <param name="invalidValueMessage">The message added when the value cannot be converted to the property type (optional).</param>
        /// <returns>The validation result with the messages of the failed attributes.</returns>
        public static FieldValidationResult ValidateProperty<T>(string propertyPath, object value, string invalidValueMessage = null)
        {
            PropertyInfo prop = FindProperty(typeof(T), propertyPath);

            if (prop == null)
                throw new ArgumentException($"Property '{propertyPath}' not found on {typeof(T).Name}.", nameof(propertyPath));

            string displayName = prop.GetCustomAttribute<DisplayAttribute>()?.GetName() ?? prop.Name;
            object instance = RuntimeHelpers.GetUninitializedObject(prop.ReflectedType);

            return ValidateValue(value, prop.PropertyType, displayName, prop.GetCustomAttributes<ValidationAttribute>(true), invalidValueMessage, instance);
        }

        /// <summary>
        /// Validates a single value against a set of validation attributes, without needing a model class.
        /// String values are converted to the value type using the invariant culture (e.g. 1234.5 and 2026-10-11).
        /// </summary>
        /// <param name="value">The value to validate, as an invariant string or an already typed value.</param>
        /// <param name="valueType">The type the value represents (e.g. typeof(int)).</param>
        /// <param name="displayName">The name used in the default messages of the attributes.</param>
        /// <param name="attributes">The validation attributes to apply.</param>
        /// <param name="invalidValueMessage">The message added when the value cannot be converted to the value type (optional).</param>
        /// <param name="instance">The object passed to the validation context (optional).</param>
        /// <returns>The validation result with the messages of the failed attributes.</returns>
        public static FieldValidationResult ValidateValue(object value, Type valueType, string displayName, IEnumerable<ValidationAttribute> attributes, string invalidValueMessage = null, object instance = null)
        {
            var result = new FieldValidationResult();

            if (!TryConvert(value, valueType, out object typedValue))
            {
                result.IsValid = false;

                if (!string.IsNullOrEmpty(invalidValueMessage))
                    result.Msg.Add(invalidValueMessage);

                return result;
            }

            var context = new ValidationContext(instance ?? new object()) { DisplayName = displayName };

            foreach (ValidationAttribute attr in attributes)
            {
                ValidationResult attrResult = attr.GetValidationResult(typedValue, context);

                if (attrResult != null)
                {
                    result.IsValid = false;
                    result.Msg.Add(attrResult.ErrorMessage);
                }
            }

            return result;
        }

        /// <summary>
        /// Validates a complete object, including nested models and collections of models declared in the same assembly.
        /// </summary>
        /// <param name="model">The object to validate.</param>
        /// <returns>The validation result with the messages per property path (e.g. "Address.Street").</returns>
        public static ObjectValidationResult ValidateObject(object model)
        {
            ArgumentNullException.ThrowIfNull(model);

            var errors = new Dictionary<string, List<string>>();
            ValidateObject(model, string.Empty, model.GetType().Assembly, errors);

            return new ObjectValidationResult(errors);
        }

        private static void ValidateObject(object model, string prefix, Assembly modelAssembly, Dictionary<string, List<string>> errors)
        {
            var results = new List<ValidationResult>();
            Validator.TryValidateObject(model, new ValidationContext(model), results, validateAllProperties: true);

            foreach (ValidationResult result in results)
            {
                foreach (string member in result.MemberNames.DefaultIfEmpty(string.Empty))
                {
                    string key = (member.Length > 0) ? prefix + member : string.Empty; // errors without a matching property are shown in the validator summary

                    if (!errors.TryGetValue(key, out List<string> list))
                        errors[key] = list = new List<string>();

                    list.Add(result.ErrorMessage);
                }
            }

            foreach (PropertyInfo prop in TypeCache.GetType(model.GetType()).Properties)
            {
                if (prop.PropertyType == typeof(string) || !prop.PropertyType.IsClass || prop.GetIndexParameters().Length > 0)
                    continue;

                object value = prop.GetValue(model);
                IEnumerable items = value as IEnumerable;

                if (items != null)
                {
                    int index = 0;

                    foreach (object item in items)
                    {
                        if (InAssembly(item, modelAssembly))
                            ValidateObject(item, $"{prefix}{prop.Name}[{index}].", modelAssembly, errors);

                        index++;
                    }
                }
                else if (InAssembly(value, modelAssembly))
                    ValidateObject(value, $"{prefix}{prop.Name}.", modelAssembly, errors);
            }
        }

        private static bool InAssembly(object value, Assembly modelAssembly)
        {
            return value != null && value.GetType().Assembly == modelAssembly;
        }

        private static PropertyInfo FindProperty(Type type, string path)
        {
            PropertyInfo prop = null;

            foreach (string part in (path ?? string.Empty).Split('.'))
            {
                if (prop != null)
                    type = GetElementType(prop.PropertyType);

                prop = TypeCache.GetType(type).GetProperty(part.Split('[')[0]);

                if (prop == null)
                    return null;
            }

            return prop;
        }

        private static Type GetElementType(Type type)
        {
            if (type.IsArray)
                return type.GetElementType();

            if (type.IsGenericType && typeof(IEnumerable).IsAssignableFrom(type))
                return type.GetGenericArguments()[0];

            return type;
        }

        internal static bool TryConvert(object value, Type type, out object result)
        {
            result = value;

            string text = value as string;

            if (text == null || type == typeof(string)) // only strings need converting; typed values and string properties are used as-is
                return true;

            if (text.Length == 0)
            {
                result = null;
                return true;
            }

            try
            {
                result = TypeDescriptor.GetConverter(type).ConvertFromInvariantString(text);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}