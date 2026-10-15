using System;
using System.Collections.Generic;
using System.Text;

namespace Componyx.UI
{
    /// <summary>
    /// The result of validating a complete object with the ModelValidator.
    /// </summary>
    /// <param name="errors">The messages per property path of the failed validation attributes.</param>
    public class ObjectValidationResult(Dictionary<string, List<string>> errors = null)
    {
        /// <summary>
        /// Gets a value indicating whether the object is valid.
        /// </summary>
        public bool IsValid
        {
            get { return Errors.Count == 0; }
        }

        /// <summary>
        /// Gets the messages per property path (e.g. "Address.Street"); empty when the object is valid. Key "" holds object-level errors shown only in the configured Summary element.
        /// </summary>
        public Dictionary<string, List<string>> Errors { get; } = errors ?? new Dictionary<string, List<string>>();
    }
}
