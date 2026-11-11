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
    /// Failed rules are reported as Validator rule types (componyx.UI.Validator.TypeOption), so the client shows its own (localized) message for each rule.
    /// </summary>
    public static class FormValidator
    {
        /// <summary>
        /// Validates the submitted form values against the form definition.
        /// </summary>
        /// <param name="definitionJson">The form definition JSON.</param>
        /// <param name="valuesJson">The submitted form values JSON. Fields are stored by name or binding key. A repeatable field set is stored as an object key, where the key is the field set id and the value is the array of repeated values.</param>
        /// <param name="isActive">An extra check whether a field (JSON node) is validated (default: all fields).</param>
        /// <returns>The validation result with the failed rule types per value path.</returns>
        /// <remarks>Fields that no rule can show, hide, enable, disable or make required/optional are validated by their definition, submitted or not. Fields a rule can change are only validated when submitted.
        /// Pass valuesJson as received, without re-serializing it with options that drop nulls or rename keys!</remarks>
        public static FormValidationResult Validate(string definitionJson, string valuesJson, Func<JsonNode, bool> isActive = null)
        {
            JsonArray rootSets = JsonNode.Parse(definitionJson).AsArray(); // the root sections or field sets; throws when the definition is not an array
            JsonObject values = string.IsNullOrWhiteSpace(valuesJson) ? new JsonObject() : JsonNode.Parse(valuesJson).AsObject();
            var entries = new List<Entry>();
            var errors = new Dictionary<string, List<int>>();

            var conditionalIds = new HashSet<string>();

            if (isActive == null)
                isActive = field => true;

            foreach (JsonNode node in rootSets)
            {
                CollectConditionalIds(node, conditionalIds);
                CollectFields(node, null, values, values, string.Empty, entries, errors);
            }

            CollectSkippableSections(rootSets, conditionalIds); // a section that can be skipped counts like a field set a rule can hide

            foreach (Entry entry in entries)
            {
                bool conditional = IsConditional(entry.Field, conditionalIds);

                if (!isActive(entry.Field) || (conditional ? !entry.Present : !IsActiveByDesign(entry.Field))) // a rule may have hidden or disabled it, so only its key tells
                    continue;

                string compareFieldId = Str(entry.Field["validationSettings"], "compareFieldId");
                Entry compareEntry = (compareFieldId != null) ? FindCompareEntry(entry, entries, compareFieldId) : null;
                List<int> failedRules = ValidateField(entry, compareEntry);

                if (failedRules.Count > 0)
                    errors[entry.Path] = failedRules;
            }

            return new FormValidationResult(errors);
        }

        private static void CollectFields(JsonNode node, JsonNode parent, JsonObject root, JsonNode scope, string prefix, List<Entry> entries, Dictionary<string, List<int>> errors)
        {
            if (node == null || Str(node, "repeatGroupId") != null) // clones of a repeated set are covered by the original's value array
                return;

            string type = Str(node, "type");

            if (type == "Field")
            {
                string key = Str(node, "bindingKey");

                if (string.IsNullOrEmpty(key))
                    key = Str(node, "name");

                entries.Add(new Entry(node, parent, GetValue(scope, key), prefix + key, HasKey(scope, key)));
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
                        CollectFields(field, node, root, item, id + "[" + index + "].", entries, errors);

                    if (index == 0)
                    {
                        foreach (JsonNode set in Children(node, "fieldSets"))
                            CollectFields(set, node, root, root, string.Empty, entries, errors);
                    }
                }

                return;
            }

            foreach (JsonNode child in Children(node, "fieldSets").Concat(Children(node, "fields")))
                CollectFields(child, node, root, root, string.Empty, entries, errors);
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

            if (!IsOptionValue(field, entry.Value))
            {
                failed.Add(RuleDataType);
                return failed;
            }

            int minLength = Int(settings, "minLength") ?? 0, maxLength = Int(settings, "maxLength") ?? 0; // 0 means not set, like the client

            if (text == null) // multi-value field (list): only required and length (the number of selected values) apply
            {
                int count = ((JsonArray)entry.Value).Count;

                if ((minLength > 0 && count < minLength) || (maxLength > 0 && count > maxLength))
                    failed.Add(RuleLength);

                return failed;
            }

            Type valueType = GetValueType(dataType);

            if (!ModelValidator.TryConvert(text, valueType, out object typedValue))
            {
                failed.Add(RuleDataType);
                return failed;
            }

            if ((dataType == DataTypeEmail && !new EmailAddressAttribute().IsValid(text)) || (dataType == DataTypeUrl && !new UrlAttribute().IsValid(text)))
                failed.Add(RuleDataType);

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

        private static bool HasKey(JsonNode scope, string key)
        {
            JsonNode node = scope;

            foreach (string part in (key ?? string.Empty).Split('.'))
            {
                JsonObject obj = node as JsonObject;

                if (obj == null || !obj.ContainsKey(part)) // ContainsKey is also true for a key with a null value
                    return false;

                node = obj[part];
            }

            return true;
        }

        private static void CollectConditionalIds(JsonNode node, HashSet<string> ids)
        {
            foreach (JsonNode ruleCase in Children(node, "ruleCases"))
            {
                foreach (JsonNode action in Children(ruleCase, "actions"))
                {
                    if (StateActions.Contains(Str(action, "runtimeActionId")))
                        ids.Add(Str(action, "targetFieldSetId") ?? Str(node, "id")); // the action targets the field itself or a field set
                }
            }

            foreach (JsonNode child in Children(node, "fieldSets").Concat(Children(node, "fields")))
                CollectConditionalIds(child, ids);
        }

        private static void CollectSkippableSections(JsonArray rootSets, HashSet<string> ids)
        {
            List<JsonNode> sections = rootSets.Where(node => Str(node, "type") == "Section").ToList();

            for (int index = 0; index < sections.Count; index++)
            {
                var fields = new List<JsonNode>();
                CollectFieldNodes(sections[index], fields); // all fields inside this section

                foreach (JsonNode field in fields)
                {
                    foreach (JsonNode ruleCase in Children(field, "ruleCases"))
                    {
                        int from = (Str(ruleCase, "runVisibility") == "section_hidden") ? 0 : index; // also runs from other pages, so it may jump before the user gets here

                        foreach (JsonNode action in Children(ruleCase, "actions"))
                        {
                            string actionId = Str(action, "runtimeActionId");
                            int to;

                            if (actionId == "end_form")
                                to = sections.Count;
                            else if (actionId == "show_section")
                                to = sections.FindIndex(section => Str(section, "id") == Str(action, "value"));
                            else
                                continue;

                            for (int skipped = from + 1; skipped < to; skipped++) // the sections jumped over (none for a jump back)
                                ids.Add(Str(sections[skipped], "id"));
                        }
                    }
                }
            }
        }

        private static void CollectFieldNodes(JsonNode node, List<JsonNode> fields)
        {
            if (Str(node, "type") == "Field")
            {
                fields.Add(node);
                return;
            }

            foreach (JsonNode child in Children(node, "fieldSets").Concat(Children(node, "fields")))
                CollectFieldNodes(child, fields);
        }

        private static bool IsConditional(JsonNode field, HashSet<string> conditionalIds)
        {
            for (JsonNode node = field; node != null; node = GetParentNode(node))
            {
                if (conditionalIds.Contains(Str(node, "id")))
                    return true;
            }

            return false;
        }

        private static bool IsActiveByDesign(JsonNode field)
        {
            for (JsonNode node = field; node != null; node = GetParentNode(node))
            {
                if (Bool(node, "disabled") || (Str(node, "type") != "Section" && !Bool(node, "visible", true))) // a section's visible state is just the current page
                    return false;
            }

            return true;
        }

        private static JsonNode GetParentNode(JsonNode node)
        {
            JsonNode list = node.Parent; // the "fields" or "fieldSets" array the node is in
            return (list != null) ? list.Parent : null;
        }

        private static bool IsOptionValue(JsonNode field, object value)
        {
            JsonArray options = field["options"] as JsonArray;

            if (options == null || options.Count == 0 || Str(field, "dataSourceId") != null || Bool(field["componentSettings"], "allowInput"))
                return true; // no fixed options to check against

            var allowed = new HashSet<string>();

            foreach (JsonNode option in Children(field, "options"))
            {
                if (Str(option, "name") != null || Str(option, "bindingKey") != null)
                    return true; // options bound to their own keys hold booleans, not option values

                allowed.Add(ToText(option["value"]));
            }

            JsonArray list = value as JsonArray;
            return (list != null) ? list.All(item => allowed.Contains(ToText(item))) : allowed.Contains((string)value);
        }

        private static string ToText(JsonNode node)
        {
            JsonValue jsonValue = node as JsonValue;

            if (jsonValue != null && jsonValue.TryGetValue(out string text))
                return text;

            return (node != null) ? node.ToJsonString() : string.Empty; // numbers and booleans as submitted text, like GetValue
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

        private const int DataTypeInteger = 0, DataTypeFloat = 1, DataTypeDateTime = 2, DataTypeEmail = 3, DataTypeUrl = 4;

        private const int RuleRequired = 0, RuleDataType = 1, RuleLength = 2, RuleRange = 3, RuleRegEx = 4, RuleCompare = 5;

        private static readonly HashSet<string> StateActions = new HashSet<string> { "show", "hide", "enable", "disable", "required", "optional" };

        private class Entry
        {
            public JsonNode Field { get; }
            public JsonNode Parent { get; }
            public object Value { get; }
            public string Path { get; }
            public bool Present { get; }

            public Entry(JsonNode field, JsonNode parent, object value, string path, bool present)
            {
                Field = field;
                Parent = parent;
                Value = value;
                Path = path;
                Present = present;
            }
        }
    }
}