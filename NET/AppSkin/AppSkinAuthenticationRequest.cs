using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Componyx.UI
{
    /// <summary>
    /// This class is used to hold the authentication settings.
    /// </summary>
    public class AppSkinAuthenticationRequest
    {
        /// <summary>
        /// Gets the username.
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// Gets the password.
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// Gets a value indicating if the sign-in is persistent.
        /// </summary>
        public bool Persistent { get; set; }

        /// <summary>
        /// Gets or sets the Cross Site Request Forgery Token. The token value must be present in the user's session object under the key "CSRFToken" (can be changed through AppSkinAuthenticationHandlerOptions) so that the Authentication Middleware can validate the token in the request.
        /// </summary>
        public string CRSFToken { get; set; }

        /// <summary>
        /// Gets or sets the sign-in verification code.
        /// </summary>
        public string VerificationCode { get; set; }

        /// <summary>
        /// Gets or sets a value indicating if its a sign-out action.
        /// </summary>
        public bool? SignOut { get; set; } 
    }
}
