using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Componyx.Common;
using System.Runtime.Caching;
using System.IO.Compression;
using System.Text;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Reflection;

namespace Componyx.UI
{
    /// <summary>
    /// Top-level shape of the generated index file, matches
    /// KeywordExtractorPlugin.KeywordIndexData. Kept as a separate copy
    /// here rather than shared, since this project and the extractor
    /// don't currently reference a common assembly for it.
    /// </summary>
    public class KeywordIndexData
    {
        /// <summary>
        /// Maps a route to its display title.
        /// </summary>
        public Dictionary<string, string> Routes { get; set; }

        /// <summary>
        /// Maps a search keyword to the list of routes it matches.
        /// </summary>
        public CaseInsensitiveSortedDictionary<List<string>> Keywords { get; set; }
    }

    /// <summary>
    /// A single search result, route and title, in place of the previous
    /// pipe-delimited "route|title" string.
    /// </summary>
    public class SearchResult
    {
        /// <summary>
        /// Gets or sets the matched route.
        /// </summary>
        public string Route { get; set; }

        /// <summary>
        /// Gets or sets the display title for the matched route.
        /// </summary>
        public string Title { get; set; }
    }

    /// <summary>
    /// This class has no specific description yet.
    /// </summary>
    public class AppSkinSearchMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _keywordFilePath;
        private readonly bool _contains;
        private const string _keywordIndexKey = "Componyx.UI.AppSkin:KeywordIndex";

        private class KeywordIndexCache
        {
            public CaseInsensitiveSortedDictionary<List<string>> Index { get; set; }
            public List<string> Keys { get; set; }
            public Dictionary<string, string> RouteTitles { get; set; }
        }

        /// <summary>
        /// Initializes a new instance of the class.
        /// </summary>
        /// <param name="next"></param>
        /// <param name="options"></param>
        public AppSkinSearchMiddleware(RequestDelegate next, AppSkinSearchOptions options = null)
        {
            _next = next;

            if (options == null)
                options = new AppSkinSearchOptions();

            _keywordFilePath = (string.IsNullOrEmpty(options.KeywordFilePath))
                ? Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "KeywordIndex.json.gz")
                : options.KeywordFilePath;

            _contains = options.Contains;
        }

        /// <summary>
        /// Handles the request.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public async Task InvokeAsync(HttpContext context)
        {
            var cache = GetKeywordIndex();
            var keywordIndex = cache.Index;
            var keys = cache.Keys;
            var routeTitles = cache.RouteTitles;

            context.Response.ContentType = "application/json";
            context.Response.GetTypedHeaders().CacheControl = new Microsoft.Net.Http.Headers.CacheControlHeaderValue()
            {
                NoCache = true
            };

            var request = context.Request;
            string json;

            using (StreamReader reader = new StreamReader(request.Body))
            {
                json = await reader.ReadToEndAsync();
            }

            var settings = Json.Utility.Deserialize<SearchSettings>(json);

            // skip empty terms (double spaces), an empty term would match every key
            var terms = (settings?.Terms ?? string.Empty).Split(' ', StringSplitOptions.RemoveEmptyEntries);

            // Route: number of distinct search terms that matched it. A route matching more of the query's words ranks higher than one matching only one.
            var routeScores = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

            foreach (var term in terms)
            {
                List<string> termResult = new List<string>();

                if (!_contains)
                {
                    PrefixSearch(keywordIndex, keys, term, termResult);
                }
                else
                {
                    foreach (var key in keys)
                    {
                        if (key.Contains(term, StringComparison.OrdinalIgnoreCase))
                            termResult.AddRange(keywordIndex[key]);
                    }
                }

                // Distinct() here on purpose: a single term can match several index keys that all point at the same route (e.g. "data" prefix-matching both "data" and "dataserverurl"),
                // that should still only count as one matched term for this route, not one point per matching key.
                foreach (var route in termResult.Distinct())
                {
                    routeScores.TryGetValue(route, out var score);
                    routeScores[route] = score + 1;
                }
            }

            var result = routeScores.OrderByDescending(kv => kv.Value)
                .Select(kv => new SearchResult
                {
                    Route = kv.Key,
                    Title = routeTitles.TryGetValue(kv.Key, out var title) ? title : kv.Key
                }).ToList();

            await context.Response.WriteAsync(Json.Utility.Serialize(result));
        }

        /// <summary>
        /// Adds the routes of all keys that start with the term.
        /// </summary>
        private static void PrefixSearch(CaseInsensitiveSortedDictionary<List<string>> keywordIndex, List<string> keys, string term, List<string> termResult)
        {
            int low = 0, high = keys.Count;

            // binary search for the first key that is not smaller than the term (ignoring case)
            while (low < high)
            {
                var mid = low + (high - low) / 2;

                if (StringComparer.OrdinalIgnoreCase.Compare(term, keys[mid]) > 0)
                    low = mid + 1;
                else
                    high = mid;
            }

            // all keys starting with the term follow directly from there
            for (var index = low; index < keys.Count && keys[index].StartsWith(term, StringComparison.OrdinalIgnoreCase); index++)
                termResult.AddRange(keywordIndex[keys[index]]);
        }

        /// <summary>
        /// Loads the keyword index from disk or cache.
        /// </summary>
        private KeywordIndexCache GetKeywordIndex()
        {
            ObjectCache cache = MemoryCache.Default;

            if (cache[_keywordIndexKey] is KeywordIndexCache cached)
                return cached;

            var path = _keywordFilePath;

            using (FileStream fileStream = File.OpenRead(path))
            using (GZipStream gzipStream = new GZipStream(fileStream, CompressionMode.Decompress))
            using (StreamReader reader = new StreamReader(gzipStream, Encoding.UTF8))
            {
                var data = Json.Utility.Deserialize<KeywordIndexData>(reader.ReadToEnd());
                var result = new KeywordIndexCache
                {
                    Index = data.Keywords,
                    Keys = data.Keywords.Keys.OrderBy(k => k, StringComparer.OrdinalIgnoreCase).ToList(), // sorted ignoring case, the same way PrefixSearch compares
                    RouteTitles = data.Routes
                };

                var policy = new CacheItemPolicy();
                policy.ChangeMonitors.Add(new HostFileChangeMonitor(new List<string>() { path }));

                cache.Set(_keywordIndexKey, result, policy);

                return result;
            }
        }
    }

    /// <summary>
    /// Deserialization target for the search request body.
    /// </summary>
    public class SearchSettings
    {
        /// <summary>
        /// Gets or sets the space-separated search terms submitted by the client.
        /// </summary>
        public string Terms { get; set; }
    }
}