using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Componyx.UI
{
    /// <summary>
    /// This class provides options for the authentication middleware.
    /// </summary>
    public class AppSkinAuthenticationOptions
    {
        private int _verificationCodeLength = 6;

        /// <summary>
        /// Gets or sets the callback invoked during a custom sign-in authentication process.
        /// </summary>
        /// <remarks>
        /// The delegate accepts the following parameters:
        /// <para>
        /// <see cref="HttpContext"/>: The current HTTP context.
        /// </para>
        /// <para>
        /// <see cref="AppSkinAuthenticationRequest"/>: The authentication request containing user credentials.
        /// </para>
        /// <para>
        /// <see cref="string"/>: The generated verification code. 
        /// </para>
        /// <para>
        /// <see cref="bool"/>: Indicates if the stored verification-code is successfully verified against the verification-code in the request.
        /// <c>true</c> means verified, <c>false</c> means not verified, and <c>null</c> indicates not applicable.
        /// </para>
        /// </remarks>
        /// <returns>
        /// A <see cref="Task{AppSkinAuthenticationResponse}"/> representing the asynchronous operation, which contains the authentication response.
        /// </returns>
        public Func<HttpContext, AppSkinAuthenticationRequest, string, bool?, Task<AppSkinAuthenticationResponse>> SignIn { get; set; }

        /// <summary>
        /// Gets or sets the callback to invoke when signing out using a custom authentication method.
        /// </summary>
        /// <remarks>
        /// The callback is provided with the current <see cref="HttpContext"/> for processing the request.
        /// </remarks>
        /// <returns>
        /// A <see cref="Task{AppSkinAuthenticationResponse}"/> representing the asynchronous operation, which contains the authentication response.
        /// </returns>
        public Func<HttpContext, Task<AppSkinAuthenticationResponse>> SignOut { get; set; }

        /// <summary>
        /// Gets or sets the callback method for when the user has signed out with an external authentication provider. This callback can be used to clean-up user data.
        /// </summary>
        /// <remarks>
        /// The callback is provided with the current <see cref="HttpContext"/> for processing the request.
        /// </remarks>
        /// <returns>
        /// A <see cref="Task"/> representing the asynchronous operation of the process.
        /// </returns>
        public Func<HttpContext, Task> OAuthSignedOutCallback { get; set; }

        /// <summary>
        /// Gets or sets the length of the login verification code.
        /// </summary>
        /// <remarks>
        /// This property is intended for a custom implementation of the provided SignIn and SignOut delegates.
        /// It is not applicable when using OAuth sign-in methods.
        /// </remarks>
        public int VerificationCodeLength 
        {
            get => _verificationCodeLength;
            set 
            {
                if (value < 4)
                    throw new ArgumentOutOfRangeException(nameof(VerificationCodeLength), "Verification code length must be at least 4.");

                _verificationCodeLength = value;
            } 
        }

        /// <summary>
        /// Gets or sets the maximum allowed sign-in attempts (defaults to 10).
        /// </summary>
        /// <remarks>
        /// This property is intended for a custom implementation of the provided SignIn and SignOut delegates.
        /// It is not applicable when using OAuth sign-in methods.
        /// </remarks>
        public int MaxSignInAttempts { get; set; } = 10;

        /// <summary>
        /// Gets or sets the maximum allowed verify code attempts (defaults to 5).
        /// </summary>
        /// <remarks>
        /// This property is intended for a custom implementation of the provided SignIn and SignOut delegates.
        /// It is not applicable when using OAuth sign-in methods.
        /// </remarks>
        public int MaxVerifyCodeAttempts { get; set; } = 5;

        /// <summary>
        /// Gets or sets the sign-in attempt expiration time in minutes (defaults to 10).
        /// </summary>
        /// <remarks>
        /// This property is intended for a custom implementation of the provided SignIn and SignOut delegates.
        /// It is not applicable when using OAuth sign-in methods.
        /// </remarks>
        public int MaxSignInAttemptsExpirationTime { get; set; } = 10;

        /// <summary>
        /// Gets or sets the time in minutes of how long the verification code can be verified after the code has been given out (defaults to 10).
        /// </summary>
        /// <remarks>
        /// This property is intended for a custom implementation of the provided SignIn and SignOut delegates.
        /// It is not applicable when using OAuth sign-in methods.
        /// </remarks>
        public int VerificationExpirationTime { get; set; } = 10;

        /// <summary>
        /// Gets or sets the session key in which the CRSF token is stored that must be validated during an authentication request.
        /// </summary>
        /// <remarks>
        /// This property is intended for a custom implementation of the provided SignIn and SignOut delegates.
        /// It is not applicable when using OAuth sign-in methods.
        /// </remarks>
        public string CRSFTokenSessionKey { get; set; } = "CRSFToken";

        /// <summary>
        /// Gets or sets the name of the authentication cookie.
        /// </summary>
        /// <remarks>
        /// This setting is used to clear the authentication cookie(s) in the sign-out procedure.
        /// </remarks>
        public string AuthenticationCookieName { get; set; } = "AuthCookie";

        /// <summary>
        /// Gets or sets the sign-out path used to sign out the user and clear user related data. This route can be invoked from the oAuth provider also.
        /// </summary>
        public string SignOutPath { get; set; }
    }

}