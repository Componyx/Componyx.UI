using System;
using System.Text.RegularExpressions;

namespace Componyx.UI
{

    /// <summary>
    /// Checks that a submitted SignaturePad value contains nothing but an SVG with paths exactly as the SignaturePad produces it.
    /// </summary>
    /// <remarks>
    /// A SignaturePad value looks like this:
    ///   &lt;svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" ...&gt;&lt;path d="M 10 20 Q ..."/&gt;&lt;/svg&gt;
    /// It's checked in three parts: the frame (&lt;svg ... &gt; and &lt;/svg&gt;), the attributes of the svg, and the paths inside.
    /// Each part may only contain what the SignaturePad itself writes. Valid pieces are removed, and if anything is left over, the value is invalid.
    /// </remarks>
    public static class SignaturePadValidator
    {
        private const string _namespaceAttribute = " xmlns=\"http://www.w3.org/2000/svg\"";

        // one svg attribute: a known name, and a value with only letters, digits and # ( ) , . % - and spaces (so no quotes, < > & : or /)
        private static readonly Regex _attributePattern = new Regex(
            " (viewBox|width|height|fill|stroke|stroke-width|stroke-linecap|stroke-linejoin)=\"[A-Za-z0-9#(),.% \\-]*\"",
            RegexOptions.CultureInvariant | RegexOptions.NonBacktracking);

        // one path: only a "d" attribute, with the same characters as _pathDataPattern in SignaturePad.js
        private static readonly Regex _pathPattern = new Regex(
            "<path d=\"[MLQ0-9.\\- ]*\"(/>|></path>)",
            RegexOptions.CultureInvariant | RegexOptions.NonBacktracking);

        /// <summary>
        /// Returns true if the value is an empty signature or a valid SignaturePad SVG, otherwise false.
        /// </summary>
        /// <param name="value">The submitted value.</param>
        /// <param name="maxLength">The maximum allowed length of the value in characters.</param>
        public static bool Validate(string value, int maxLength = 200000)
        {
            if (string.IsNullOrEmpty(value))
                return true;

            if (value.Length > maxLength)
                return false;

            // the frame: starts with <svg, ends with </svg>, and the first > (end of the svg tag) comes before </svg>
            if (!value.StartsWith("<svg", StringComparison.Ordinal) || !value.EndsWith("</svg>", StringComparison.Ordinal))
                return false;

            int rootEnd = value.IndexOf('>');

            if (rootEnd > value.Length - 7)
                return false;

            string attributes = value.Substring(4, rootEnd - 4); // everything between "<svg" and ">"
            string content = value.Substring(rootEnd + 1, value.Length - 6 - (rootEnd + 1)); // everything between ">" and "</svg>"

            // the attributes: the svg namespace is required, and after removing it and all known attributes, nothing may be left
            int namespaceIndex = attributes.IndexOf(_namespaceAttribute, StringComparison.Ordinal);

            if (namespaceIndex == -1)
                return false;

            string remainingAttributes = attributes.Remove(namespaceIndex, _namespaceAttribute.Length); // removes only this one, like replace in the Node version

            if (_attributePattern.Replace(remainingAttributes, "") != "")
                return false;

            // the content: after removing all valid paths, nothing may be left
            return _pathPattern.Replace(content, "") == "";
        }
    }
}