using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Componyx.UI
{
    /// <summary>
    /// This class is used to hold the authentication result.
    /// </summary>
    public class AppSkinAuthenticationResponse
    {
        /// <summary>
        /// Gets or sets a value indicating the state of the authentication process.
        /// </summary>
        public AuthenticationStateOption AuthenticationState { get; set; }

        /// <summary>
        /// Gets or sets an optional redirect path after the authentication state goes to state 1.
        /// </summary>
        public string RedirectPath { get; set; }

        /// <summary>
        /// Gets or sets the custom failure message when the failure reason is set to other.
        /// </summary>
        public string FailureMessage { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the maximum sign-in attempts have been exceeded.
        /// </summary>
        public FailureReasonOption? FailureReason { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if the verification code is verified.
        /// </summary>
        public bool? CodeVerified{ get; set; }

        /// <summary>
        /// The Authentiation state options.
        /// </summary>
        public enum AuthenticationStateOption
        {
            /// <summary>
            /// The user is not authenticated.
            /// </summary>
            Unauthenticated = 0,
            /// <summary>
            /// The credentials have been successfully validated but the user is not yet authenticated (Step 1 in Two-Factor authentication).
            /// </summary>
            CredentialsValidated = 1,
            /// <summary>
            /// The user is successfully authenticated.
            /// </summary>
            Authenticated = 2
        }

        /// <summary>
        /// The failure reason options.
        /// </summary>
        public enum FailureReasonOption
        {
            /// <summary>
            /// Provided CRSF Token does not match with token in Session object.
            /// </summary>
            CRSFTokenMismatch = 0,
            /// <summary>
            /// Total attempts exceeded the configured max sign-in attempts.
            /// </summary>
            MaxSignInAttemptsExceeded = 1,
            /// <summary>
            /// Provided username and/or password do not match.
            /// </summary>
            UsernameOrPasswordMismatch = 2,
            /// <summary>
            /// Provided verificatin code does not match.
            /// </summary>
            VerificationCodeMismatch = 3,
            /// <summary>
            /// The generated verification-code has expired.
            /// </summary>
            VerificationCodeExpired = 4,
            /// <summary>
            /// Total attempts exceeded the configured max verify code attempts.
            /// </summary>
            MaxVerifyAttemptsExceeded = 5,
            /// <summary>
            /// Other reason.
            /// </summary>
            Other = 6
        }
    }
}
