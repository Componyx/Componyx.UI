using System;
using System.Collections.Generic;
using System.Text;

namespace Componyx.UI
{
    /// <summary>
    /// The result of validating submitted form values with the FormValidator.
    /// </summary>
    /// <param name="errors">The failed rule types per value path.</param>
    public class FormValidationResult(Dictionary<string, List<int>> errors = null)
    {
        /// <summary>
        /// Gets a value indicating whether all values are valid.
        /// </summary>
        public bool IsValid
        {
            get { return Errors.Count == 0; }
        }

        /// <summary>
        /// Gets the failed rule types (componyx.UI.Validator.TypeOption) per value path (e.g. "email" or "fs_repeated[1].name"); empty when all values are valid.
        /// </summary>
        public Dictionary<string, List<int>> Errors { get; } = errors ?? new Dictionary<string, List<int>>();
    }
}
