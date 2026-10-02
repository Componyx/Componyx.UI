using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Componyx.UI
{
    /// <summary>
    /// This class has no specific description yet.
    /// </summary>
    public static class Extensions
    {
        /// <summary>
        /// Maps the Resource middleware to the specified path.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="path"></param>
        /// <returns></returns>
        public static IApplicationBuilder UseResource(this IApplicationBuilder app, string path = "/src")
        {
            app.Map(path, b =>
            {
                b.UseMiddleware<ResourceMiddleware>();
            });

            return app;
        }

        /// <summary>
        /// Maps the AppSkinSearch middleware to the specified path.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="options"></param>
        /// <param name="path"></param>
        /// <returns></returns>
        public static IApplicationBuilder UseAppSkinSearch(this IApplicationBuilder app, AppSkinSearchOptions options, string path = "/search")
        {
            app.Map(path, b =>
            {
                b.UseMiddleware<AppSkinSearchMiddleware>(options);
            });

            return app;
        }

        /// <summary>
        /// Maps the AppSkinAuthentication middleware to the specified paths.
        /// </summary>
        /// <param name="app">The application builder to configure middleware.</param>
        /// <param name="options">Options to configure the AppSkinAuthentication middleware. If null, default options will be used.</param>
        /// <param name="path">The path to which the authentication middleware will be mapped (default is "/authenticate").</param>
        /// <param name="signOutPath">The path for initiating sign-out actions (default is "/signout").</param>
        /// <returns>The updated application builder with the mapped middleware.</returns>
        public static IApplicationBuilder UseAppSkinAuthentication(this IApplicationBuilder app, AppSkinAuthenticationOptions options = null, string path = "/authenticate", string signOutPath = "/signout")
        {
            var paths = new List<string>() { path, signOutPath };
            options = options ?? new AppSkinAuthenticationOptions();

            options.SignOutPath = signOutPath;
            app.UseMiddleware<AppSkinAuthenticationMiddleware>(options, path);

            return app;
        }
    }
}
