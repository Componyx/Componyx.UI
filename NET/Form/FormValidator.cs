using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;

namespace Componyx.UI
{
    /// <summary>
    /// Validates submitted values against a Form definition (the Form component's JSON), using each field's required flag and validation settings.
    /// Works directly on the JSON, so no C# classes for the Form types are needed. Failed rules are reported as Validator rule types
    /// (componyx.UI.Validator.TypeOption), so the client shows its own (localized) message for each rule.
    /// </summary>
    public static class FormValidator
    {
        /// <summary>
        /// Validates the submitted form values against the form definition.
        /// </summary>
        /// <param name="definitionJson">The form definition JSON (as stored by the Form component).</param>
        /// <param name="valuesJson">The submitted form values JSON (the Form's values model: field binding keys, repeatable field sets as arrays keyed by the set's id).</param>
        /// <param name="isActive">Determines whether a field (JSON node) is validated (default: visible and not disabled).</param>
        /// <returns>The failed rule types per value path (e.g. "email" or "fs_kids[1].childName"); empty when all values are valid.</returns>
        public static Dictionary<string, List<int>> Validate(string definitionJson, string valuesJson, Func<JsonNode, bool> isActive = null)
        {
            JsonArray rootSets = JsonNode.Parse(definitionJson).AsArray(); // the root sections or field sets; throws when the definition is not an array
            JsonObject values = string.IsNullOrWhiteSpace(valuesJson) ? new JsonObject() : JsonNode.Parse(valuesJson).AsObject();
            var entries = new List<Entry>();
            var errors = new Dictionary<string, List<int>>();

            if (isActive == null)
                isActive = field => Bool(field, "visible", true) && !Bool(field, "disabled");

            foreach (JsonNode node in rootSets)
                Collect(node, null, values, values, string.Empty, entries, errors);

            foreach (Entry entry in entries)
            {
                if (!isActive(entry.Field))
                    continue;

                string compareFieldId = Str(entry.Field["validationSettings"], "compareFieldId");
                Entry compareEntry = (compareFieldId != null) ? FindCompareEntry(entry, entries, compareFieldId) : null;
                List<int> failedRules = ValidateField(entry, compareEntry);

                if (failedRules.Count > 0)
                    errors[entry.Path] = failedRules;
            }

            return errors;
        }

        /// <summary>
        /// Collects all fields with the values scope they read from, mirroring the client: fields inside a repeatable field set
        /// read from that set's array item (keyed by the set's id), all other fields read from the root values.
        /// </summary>
        private static void Collect(JsonNode node, JsonNode parent, JsonObject root, JsonNode scope, string prefix, List<Entry> entries, Dictionary<string, List<int>> errors)
        {
            if (node == null || Str(node, "repeatGroupId") != null) // clones of a repeated set are covered by the original's value array
                return;

            string type = Str(node, "type");

            if (type == "Field")
            {
                string key = Str(node, "bindingKey");

                if (string.IsNullOrEmpty(key))
                    key = Str(node, "name");

                entries.Add(new Entry(node, parent, GetValue(scope, key), prefix + key));
                return;
            }

            if (type == "FieldSet" && Bool(node, "repeatable"))
            {
                string id = Str(node, "id");
                JsonArray items = root[id] as JsonArray;
                int maxRepeats = Int(node, "maxRepeats") ?? 0;

                if (items == null)
                    items = new JsonArray();

                if (maxRepeats > 0 && items.Count > maxRepeats) // the client prevents this, so only a tampered request gets here
                    errors[id] = new List<int> { RuleRange };

                int count = Math.Max(items.Count, 1); // validate at least one item, like the rendered original

                for (int index = 0; index < count; index++)
                {
                    JsonNode item = (index < items.Count) ? items[index] : null;

                    foreach (JsonNode field in Children(node, "fields"))
                        Collect(field, node, root, item, id + "[" + index + "].", entries, errors);

                    if (index == 0)
                    {
                        foreach (JsonNode set in Children(node, "fieldSets"))
                            Collect(set, node, root, root, string.Empty, entries, errors);
                    }
                }

                return;
            }

            foreach (JsonNode child in Children(node, "fieldSets").Concat(Children(node, "fields")))
                Collect(child, node, root, root, string.Empty, entries, errors);
        }

        private static List<int> ValidateField(Entry entry, Entry compareEntry)
        {
            JsonNode field = entry.Field;
            JsonNode settings = field["validationSettings"];
            int? dataType = Int(settings, "dataType");
            var failed = new List<int>();
            string text = entry.Value as string;

            if (entry.Value == null || (text != null && text.Length == 0))
            {
                if (Bool(field, "required"))
                    failed.Add(RuleRequired);

                return failed;
            }

            if (text == null) // multi-value field (list): only required applies
                return failed;

            Type valueType = GetValueType(dataType);

            if (!ModelValidator.TryConvert(text, valueType, out object typedValue))
            {
                failed.Add(RuleDataType);
                return failed;
            }

            if ((dataType == DataTypeEmail && !new EmailAddressAttribute().IsValid(text)) || (dataType == DataTypeUrl && !new UrlAttribute().IsValid(text)))
                failed.Add(RuleDataType);

            int minLength = Int(settings, "minLength") ?? 0, maxLength = Int(settings, "maxLength") ?? 0; // 0 means not set, like the client

            if (valueType == typeof(string) && (minLength > 0 || maxLength > 0)
                && !new StringLengthAttribute(maxLength > 0 ? maxLength : int.MaxValue) { MinimumLength = minLength }.IsValid(text))
                failed.Add(RuleLength);

            double? minRange = Dbl(settings, "minRange"), maxRange = Dbl(settings, "maxRange");

            if ((valueType == typeof(long?) || valueType == typeof(decimal?)) && (minRange != null || maxRange != null)
                && !new RangeAttribute(minRange ?? double.MinValue, maxRange ?? double.MaxValue).IsValid(typedValue))
                failed.Add(RuleRange);

            string pattern = Str(settings, "pattern");

            if (valueType == typeof(string) && !string.IsNullOrEmpty(pattern) && !IsMatch(text, pattern))
                failed.Add(RuleRegEx);

            if (compareEntry != null && !Compare(text, compareEntry.Value, valueType, Str(settings, "compareOperator")))
                failed.Add(RuleCompare);

            return failed;
        }

        /// <summary>
        /// Finds the compared field: in the same repeat item when both fields share a field set, otherwise its first occurrence.
        /// </summary>
        private static Entry FindCompareEntry(Entry entry, List<Entry> entries, string compareFieldId)
        {
            Entry first = null;

            foreach (Entry e in entries)
            {
                if (Str(e.Field, "id") != compareFieldId)
                    continue;

                if (e.Parent == entry.Parent && GetItemPrefix(e.Path) == GetItemPrefix(entry.Path))
                    return e;

                if (first == null)
                    first = e;
            }

            return first;
        }

        private static string GetItemPrefix(string path)
        {
            int index = path.LastIndexOf(']');
            return (index >= 0) ? path.Substring(0, index + 1) : string.Empty;
        }

        private static Type GetValueType(int? dataType)
        {
            if (dataType == DataTypeInteger)
                return typeof(long?);

            if (dataType == DataTypeFloat)
                return typeof(decimal?);

            if (dataType == DataTypeDateTime)
                return typeof(DateTime?);

            return typeof(string);
        }

        private static object GetValue(JsonNode scope, string key)
        {
            JsonNode node = scope;

            foreach (string part in (key ?? string.Empty).Split('.'))
            {
                JsonObject obj = node as JsonObject;
                node = (obj != null) ? obj[part] : null;
            }

            if (node == null)
                return null;

            JsonArray array = node as JsonArray;

            if (array != null)
                return (array.Count > 0) ? array : null;

            JsonValue jsonValue = node as JsonValue;

            if (jsonValue != null)
            {
                if (jsonValue.TryGetValue(out string text))
                    return text;

                if (jsonValue.TryGetValue(out bool isChecked))
                    return isChecked ? "true" : null; // unchecked counts as empty, like the client
            }

            return node.ToJsonString(); // numbers in invariant notation
        }

        private static bool IsMatch(string value, string pattern)
        {
            try
            {
                return Regex.IsMatch(value, pattern, RegexOptions.None, TimeSpan.FromSeconds(1)); // partial match, like RegExp.test on the client
            }
            catch (Exception) // invalid pattern or timeout
            {
                return false;
            }
        }

        private static bool Compare(object value, object otherValue, Type valueType, string op)
        {
            if (!ModelValidator.TryConvert(value, valueType, out object a) || !ModelValidator.TryConvert(otherValue, valueType, out object b))
                return false;

            IComparable comparable = a as IComparable;

            if (comparable == null || b == null)
                return false;

            int result = comparable.CompareTo(b);

            switch (op)
            {
                case "<": return result < 0;
                case "<=": return result <= 0;
                case ">": return result > 0;
                case ">=": return result >= 0;
                case "!=": return result != 0;
                default: return result == 0;
            }
        }

        private static IEnumerable<JsonNode> Children(JsonNode node, string key)
        {
            JsonArray children = (node != null) ? node[key] as JsonArray : null;

            if (children == null)
                return Enumerable.Empty<JsonNode>();

            return children.Where(child => child != null);
        }

        private static string Str(JsonNode node, string key)
        {
            JsonValue value = (node != null) ? node[key] as JsonValue : null;
            return (value != null && value.TryGetValue(out string result)) ? result : null;
        }

        private static bool Bool(JsonNode node, string key, bool defaultValue = false)
        {
            JsonValue value = (node != null) ? node[key] as JsonValue : null;
            return (value != null && value.TryGetValue(out bool result)) ? result : defaultValue;
        }

        private static int? Int(JsonNode node, string key)
        {
            JsonValue value = (node != null) ? node[key] as JsonValue : null;
            return (value != null && value.TryGetValue(out int result)) ? result : null;
        }

        private static double? Dbl(JsonNode node, string key)
        {
            JsonValue value = (node != null) ? node[key] as JsonValue : null;
            return (value != null && value.TryGetValue(out double result)) ? result : null;
        }

        // componyx.UI.Validator.DataTypeOption
        private const int DataTypeInteger = 0, DataTypeFloat = 1, DataTypeDateTime = 2, DataTypeEmail = 3, DataTypeUrl = 4;

        // componyx.UI.Validator.TypeOption
        private const int RuleRequired = 0, RuleDataType = 1, RuleLength = 2, RuleRange = 3, RuleRegEx = 4, RuleCompare = 5;

        /// <summary>
        /// A field from the definition, with its parent node, its submitted value and its value path.
        /// </summary>
        private class Entry
        {
            public JsonNode Field { get; }
            public JsonNode Parent { get; }
            public object Value { get; }
            public string Path { get; }

            public Entry(JsonNode field, JsonNode parent, object value, string path)
            {
                Field = field;
                Parent = parent;
                Value = value;
                Path = path;
            }
        }
    }
}