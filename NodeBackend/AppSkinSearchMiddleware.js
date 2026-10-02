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
            const terms = settings.terms.split(' ');

            // Route -> number of distinct search terms that matched it. A
            // route matching more of the query's words ranks higher than one
            // matching only one.
            const routeScores = new Map();

            for (const term of terms)
            {
                let termResult;

                if (!contains)
                {
                    termResult = binarySearch(keywordIndex, keys, term, 0, keys.length - 1);
                }
                else
                {
                    termResult = [];
                    const termLower = term.toLowerCase();

                    for (const key of keywordIndex.keys())
                    {
                        if (key.toLowerCase().indexOf(termLower) > -1)
                            termResult = termResult.concat(keywordIndex.get(key));
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

function binarySearch(keywordIndex, keys, term, min, max)
{
    const pos = min + Math.ceil((max - min) / 2);

    const key = keys[pos];
    const value = keywordIndex.get(key);
    const termResult = [];

    if (key.toLowerCase().startsWith(term.toLowerCase()))
    {
        termResult.push(...value);

        // look for further matching words
        let index = pos;
        let found = true;

        while (found)
        {
            index++;

            if (index < keys.length && keys[index].toLowerCase().startsWith(term.toLowerCase()))
            {
                termResult.push(...keywordIndex.get(keys[index]));
            }
            else
            {
                found = false;
            }
        }
    }

    const c = term.toLowerCase() < key.toLowerCase() ? -1 : (term.toLowerCase() > key.toLowerCase() ? 1 : 0);

    if (c === -1 && (pos - min) > 1)
        return termResult.concat(binarySearch(keywordIndex, keys, term, min, pos));
    else if (c === 1 && (max - pos) > 1)
        return termResult.concat(binarySearch(keywordIndex, keys, term, pos, max));
    else
        return termResult; // ready
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
