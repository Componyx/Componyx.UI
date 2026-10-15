using System;
using System.Collections.Generic;
using System.Text;

namespace Componyx.UI
{
    /// <summary>
    /// The result of validating a single value with the ModelValidator.
    /// </summary>
    /// <param name="isValid">A value indicating whether the value is valid.</param>
    /// <param name="msg">The messages of the failed validation attributes.</param>
    public class FieldValidationResult(bool isValid = true, List<string> msg = null)
    {
        /// <summary>
        /// Gets or sets a value indicating whether the value is valid.
        /// </summary>
        public bool IsValid { get; set; } = isValid;

        /// <summary>
        /// Gets the messages of the failed validation attributes (empty when no message is available).
        /// </summary>
        public List<string> Msg { get; } = msg ?? new List<string>();
    }
}
