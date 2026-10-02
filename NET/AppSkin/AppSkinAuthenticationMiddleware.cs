using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Matching;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Diagnostics.Eventing.Reader;
using System.IO;
using System.Linq;
using System.Runtime.Caching;
using System.Text;
using System.Threading.Tasks;

namespace Componyx.UI
{
    /// <summary>
    /// This class handles authentication requests.
    /// </summary>
    public class AppSkinAuthenticationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;
        private string _path = string.Empty;
        private readonly AppSkinAuthenticationOptions _options;
        private const string _prefix = "Componyx.UI.AppSkin.";
        private const string _signInAttemptsCacheKey = _prefix + "SignInAttempts";
        private const string _verificationTokenCookieName = _prefix + "VerificationToken";
        private const string _authResponseSessionKey = _prefix + "AuthResponse";
        private static readonly object _lock = new object();

        /// <summary>
        /// Initializes a new instance of the class.
        /// </summary>
        /// <param name="next"></param>
        /// <param name="configuration"></param>
        /// <param name="path"></param>
        /// <param name="options"></param>
        public AppSkinAuthenticationMiddleware(RequestDelegate next, IConfiguration configuration, string path, AppSkinAuthenticationOptions options)
        {
            _next = next;
            _configuration = configuration;
            _path = path;
            _options = options ?? new AppSkinAuthenticationOptions();
        }

        /// <summary>
        /// Gets the authentication response from the last request which is stored in the Session object.
        /// </summary>
        /// <param name="context">The current HttpContext.</param>
        /// <returns>The authentication response.</returns>
        public static AppSkinAuthenticationResponse GetAuthenticationResponse(HttpContext context)
        {
            var response = context.Session.GetString(_authResponseSessionKey);

            if (!string.IsNullOrEmpty(response))
                return Json.Utility.Deserialize<AppSkinAuthenticationResponse>(response);
            else
                return null;
        }

        /// <summary>
        /// Handles the request.
        /// </summary> 
        /// <param name="context"></param>
        public async Task InvokeAsync(HttpContext context)
        {
            var req = context.Request;

            if (!context.Request.Path.Value.Equals(_path, StringComparison.OrdinalIgnoreCase) && !context.Request.Path.Value.Equals(_options.SignOutPath, StringComparison.OrdinalIgnoreCase))
            {
                await _next(context);
                return;
            }

            if (req.ContentType == "application/json") // XHR JSON POST
            {
                context.Response.ContentType = "application/json";
                context.Response.GetTypedHeaders().CacheControl = new Microsoft.Net.Http.Headers.CacheControlHeaderValue()
                {
                    NoCache = true
                };

                string json;
                using (StreamReader reader = new StreamReader(req.Body))
                {
                    json = await reader.ReadToEndAsync();
                }

                var authRequest = Json.Utility.Deserialize<AppSkinAuthenticationRequest>(json);
                var authResponse = new AppSkinAuthenticationResponse();

                if (!context.User.Identity.IsAuthenticated)
                {
                    authResponse = await SignIn(context, authRequest);
                }
                else if (authRequest.SignOut == true)
                {
                    ClearAuthenticationCookies(context, _options.AuthenticationCookieName);
                    authResponse = await _options.SignOut(context);
                }

                await context.Response.WriteAsync(Json.Utility.Serialize(authResponse));
                return;
            }
            else // FORM POST
            {
                StringValues queryValue = string.Empty;
                bool isFormPost = req.Method == HttpMethods.Post && req.HasFormContentType;
                var type = isFormPost
                            ? req.Form["type"].ToString()
                            : req.Query.TryGetValue("type", out queryValue)
                                ? queryValue.ToString()
                                : null;
                var fullPath = context.Request.PathBase + context.Request.Path;
                bool signOut = isFormPost ? req.Form["signout"].ToString() == "1" : req.Query.TryGetValue("signout", out queryValue) ? queryValue.ToString() == "1" : fullPath.StartsWithSegments(_options.SignOutPath);
                var returnUrl = isFormPost ? req.Form["returnurl"].ToString() : req.Query.TryGetValue("returnurl", out queryValue) ? queryValue.ToString() : null; // optional return url

                if (!context.User.Identity.IsAuthenticated)
                {
                    if (!string.IsNullOrEmpty(type)) // OAuth Microsoft Identity authentication provider
                    {
                        var properties = new AuthenticationProperties
                        {
                            RedirectUri = "/",
                            Items = { { "type", type }, { "returnUrl", returnUrl } } // Add custom data here
                        };

                        await context.ChallengeAsync(type, properties);
                        return;
                    }
                    else if (isFormPost)
                    {
                        var authRequest = new AppSkinAuthenticationRequest()
                        {
                            Username = req.Form["username"],
                            Password = req.Form["password"],
                            Persistent = (req.Form["persistent"] == "1") ? true : false,
                            CRSFToken = req.Form["crsftoken"],
                            VerificationCode = req.Form["verificationcode"]
                        };

                        var authResponse = await SignIn(context, authRequest);
                        context.Session.SetString(_authResponseSessionKey, Json.Utility.Serialize(authResponse));

                        if (!string.IsNullOrEmpty(returnUrl))
                            context.Response.Redirect(returnUrl);

                        return;
                    }
                }
                else if (signOut)
                {
                    if (!string.IsNullOrEmpty(type)) // OAuth Microsoft Identity authentication provider
                    {
                        await ClearOAuthTokens(context, type);
                        ClearAuthenticationCookies(context, _options.AuthenticationCookieName);
                        await context.SignOutAsync(type);
                        return;
                    }
                    else
                    {
                        ClearAuthenticationCookies(context, _options.AuthenticationCookieName);

                        var authResponse = await _options.SignOut(context);
                        context.Session.SetString(_authResponseSessionKey, Json.Utility.Serialize(authResponse));

                        if (!string.IsNullOrEmpty(returnUrl))
                            context.Response.Redirect(returnUrl);

                        return;
                    }
                }
            }

            await _next(context);
        }

        /// <summary>
        /// Performs a custom sign in.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="authRequest"></param>
        /// <returns></returns>
        private async Task<AppSkinAuthenticationResponse> SignIn(HttpContext context, AppSkinAuthenticationRequest authRequest)
        {
            var response = new AppSkinAuthenticationResponse();
            ObjectCache cache = MemoryCache.Default;
            var attempts = 0;
            var verificationCacheKey = context.Request.Cookies[_verificationTokenCookieName];
            var newVerificationCode = new Random().Next(0, (int)Math.Pow(10, _options.VerificationCodeLength)).ToString($"D{_options.VerificationCodeLength}");

            if (authRequest.CRSFToken != context.Session.GetString(_options.CRSFTokenSessionKey))
            {
                response.FailureReason = AppSkinAuthenticationResponse.FailureReasonOption.CRSFTokenMismatch;
                return response;
            }

            if (!string.IsNullOrEmpty(authRequest.VerificationCode))
            {
                newVerificationCode = null;
                response = VerifyCode(context, authRequest.VerificationCode);

                if (response.CodeVerified == false)
                    return response;
            }
            else if (string.IsNullOrEmpty(authRequest.Username) || string.IsNullOrEmpty(authRequest.Password))
            {
                response.FailureReason = AppSkinAuthenticationResponse.FailureReasonOption.UsernameOrPasswordMismatch;
                return response;
            }

            var signInAttemptsKey = _signInAttemptsCacheKey + "-" + authRequest.Username;

            if (cache[signInAttemptsKey] != null)
                attempts = (int)cache[signInAttemptsKey];

            lock (_lock)
            {
                cache.Set(signInAttemptsKey, ++attempts, new CacheItemPolicy() { AbsoluteExpiration = DateTimeOffset.UtcNow.AddMinutes(_options.MaxSignInAttemptsExpirationTime) });
            }

            if (attempts >= _options.MaxSignInAttempts)
            {
                response.FailureReason = AppSkinAuthenticationResponse.FailureReasonOption.MaxSignInAttemptsExceeded;
                return response;
            }

            // try to sign-in
            response = await _options.SignIn(context, authRequest, newVerificationCode, response.CodeVerified);

            if (response.AuthenticationState == AppSkinAuthenticationResponse.AuthenticationStateOption.CredentialsValidated)
            {
                cache.Remove(signInAttemptsKey);
                var cacheKey = Guid.NewGuid().ToString();

                context.Response.Cookies.Append(_verificationTokenCookieName, cacheKey, new CookieOptions
                {
                    HttpOnly = true,  // Prevent access via JavaScript
                    Secure = true,    // Only send over HTTPS
                    SameSite = SameSiteMode.Strict, // Prevent cross-site requests
                });

                cache.Set(cacheKey,
                    new AppSkinVerificationData() { VerificationCode = newVerificationCode },
                    new CacheItemPolicy() { AbsoluteExpiration = DateTimeOffset.UtcNow.AddMinutes(_options.VerificationExpirationTime) });
            }
            else if (response.AuthenticationState == AppSkinAuthenticationResponse.AuthenticationStateOption.Authenticated)
            {
                cache.Remove(signInAttemptsKey);
                cache.Remove(verificationCacheKey);
                context.Response.Cookies.Delete(_verificationTokenCookieName);
            }

            return response;
        }

        private AppSkinAuthenticationResponse VerifyCode(HttpContext context, string verificationCode)
        {
            var response = new AppSkinAuthenticationResponse();
            ObjectCache cache = MemoryCache.Default;
            var verificationCacheKey = context.Request.Cookies[_verificationTokenCookieName];
            var verificationData = (!string.IsNullOrEmpty(verificationCacheKey)) ? cache.Get(verificationCacheKey) as AppSkinVerificationData : null;

            response.CodeVerified = false;

            if (verificationData == null || verificationData.VerificationCode != verificationCode)
            {
                response.FailureReason = AppSkinAuthenticationResponse.FailureReasonOption.VerificationCodeMismatch;

                if (verificationData != null)
                {
                    if (verificationData.Attempts >= _options.MaxVerifyCodeAttempts)
                    {
                        response.FailureReason = AppSkinAuthenticationResponse.FailureReasonOption.MaxVerifyAttemptsExceeded;
                        cache.Remove(verificationCacheKey);
                        context.Response.Cookies.Delete(_verificationTokenCookieName);
                    }
                    else
                    {
                        verificationData.Attempts++;
                        cache.Set(verificationCacheKey, verificationData, new CacheItemPolicy() { AbsoluteExpiration = DateTimeOffset.UtcNow.AddMinutes(_options.VerificationExpirationTime) });
                    }
                }
                else
                {
                    context.Response.Cookies.Delete(_verificationTokenCookieName);
                    response.FailureReason = AppSkinAuthenticationResponse.FailureReasonOption.VerificationCodeExpired;
                }

                return response;
            }
            else
                response.CodeVerified = true;

            return response;
        }

        private async Task ClearOAuthTokens(HttpContext context, string scheme)
        {
            var authResult = await context.AuthenticateAsync(scheme);
            if (authResult.Succeeded)
            {
                var properties = authResult.Properties;
                properties?.Items.Remove(".Token.access_token");
                properties?.Items.Remove(".Token.id_token");
                properties?.Items.Remove(".Token.refresh_token");
            }
        }

        private void ClearAuthenticationCookies(HttpContext context, string cookieName)
        {
            foreach (var cookie in context.Request.Cookies)
            {
                if (cookie.Key.StartsWith(cookieName))
                {
                    context.Response.Cookies.Delete(cookie.Key);
                }
            }
        }

    }
}
