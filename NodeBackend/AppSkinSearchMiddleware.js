import { readFileSync, watch } from 'fs';
import { gunzipSync } from 'zlib';

let _cache = null;
let _watcher = null;

/**
 * This class has no specific description yet.
 */
export function createAppSkinSearchMiddleware(options)
{
    const keywordFilePath = options.keywordFilePath;
    const contains = options.contains || false;

    return async function (req, res, next)
    {
        try
        {
            const { index: keywordIndex, keys, routeTitles } = getKeywordIndex(keywordFilePath);

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache');

            const body = await readRequestBody(req);
            const json = body.replace(/\\/g, '\\\\');
            const settings = JSON.parse(json);

            // skip empty terms (double spaces), an empty term would match every key
            const terms = (settings.terms || '').split(' ').filter(term => term);

            // Route -> number of distinct search terms that matched it. A
            // route matching more of the query's words ranks higher than one
            // matching only one.
            const routeScores = new Map();

            for (const term of terms)
            {
                let termResult;

                if (!contains)
                {
                    termResult = prefixSearch(keywordIndex, keys, term);
                }
                else
                {
                    termResult = [];
                    const termLower = term.toLowerCase();

                    for (const key of keys)
                    {
                        if (key.toLowerCase().includes(termLower))
                            termResult.push(...keywordIndex.get(key));
                    }
                }

                // Distinct() here on purpose: a single term can match several
                // index keys that all point at the same route (e.g. "data"
                // prefix-matching both "data" and "dataserverurl"), that
                // should still only count as one matched term for this route,
                // not one point per matching key.
                for (const route of new Set(termResult))
                {
                    routeScores.set(route, (routeScores.get(route) || 0) + 1);
                }
            }

            const result = [...routeScores.entries()]
                .sort((a, b) => b[1] - a[1])
                .map(([route, score]) => ({
                    route,
                    title: (routeTitles[route] !== undefined) ? routeTitles[route] : route
                }));

            res.end(JSON.stringify(result));
        }
        catch (err)
        {
            next(err);
        }
    };
}

function readRequestBody(req)
{
    return new Promise((resolve, reject) =>
    {
        let data = '';

        req.on('data', chunk => { data += chunk; });
        req.on('end', () => resolve(data));
        req.on('error', reject);
    });
}

/**
 * Returns the routes of all keys that start with the term.
 */
function prefixSearch(keywordIndex, keys, term)
{
    const termLower = term.toLowerCase();
    let low = 0, high = keys.length;

    // binary search for the first key that is not smaller than the term (ignoring case)
    while (low < high)
    {
        const mid = low + Math.floor((high - low) / 2);

        if (termLower > keys[mid].toLowerCase())
            low = mid + 1;
        else
            high = mid;
    }

    // all keys starting with the term follow directly from there
    const termResult = [];

    for (let i = low; i < keys.length && keys[i].toLowerCase().startsWith(termLower); i++)
        termResult.push(...keywordIndex.get(keys[i]));

    return termResult;
}

/**
 * Loads the keyword index from disk or cache.
 */
function getKeywordIndex(keywordFilePath)
{
    if (_cache)
        return _cache;

    const compressed = readFileSync(keywordFilePath);
    const json = gunzipSync(compressed).toString('utf8');
    const data = JSON.parse(json);

    // sorted ignoring case, the same way prefixSearch compares
    const keys = Object.keys(data.keywords).sort((a, b) =>
    {
        const al = a.toLowerCase(), bl = b.toLowerCase();
        return al < bl ? -1 : (al > bl ? 1 : 0);
    });

    const index = new Map(Object.entries(data.keywords));

    _cache = { index, keys, routeTitles: data.routes };

    if (_watcher)
        _watcher.close();

    _watcher = watch(keywordFilePath, () => { _cache = null; });

    return _cache;
}