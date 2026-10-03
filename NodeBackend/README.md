# Componyx Node.js backend

Server-side helpers for using Componyx.UI and Bindary with a Node.js backend.

> Provided as-is for Node.js users. The .NET integration is the primary, actively used backend.

## What's included

**Bindary server** (`bindary-server.js`, `bindary-data.js`)
A WebSocket and XHR data server for Bindary, including data updates, subscriptions and client tracking. Requires the `ws` package:

```bash
npm install ws
```

For a working demo with full code examples, see [Bindary with a Node.js backend](https://componyx.com/bindary/backend-nodejs).

**AppSkin search middleware** (`AppSkinSearchMiddleware.js`)
Express-style middleware that answers AppSkin search requests from a prebuilt keyword index, generated with the Componyx Search Indexer.

**Component data classes**
Plain classes that mirror the .NET types, for building the JSON that components consume:

| Class | Used for |
| --- | --- |
| `Item`, `AjaxResult` (in `base/`) | Base classes for items and paged ajax results |
| `ComboBoxItem`, `ComboBoxAjaxResult`, `FilteredColumn` | ComboBox items and ajax results |
| `GridItem`, `GridColumnFilter` | Grid rows and column filters |
| `MenuItem`, `AppSkinMenuItem` | Menu and AppSkin menu items |
| `TabStripItem` | TabStrip items |
| `AppSkinError` | Error responses for AppSkin |

## AppSkin search

```js
import express from 'express';
import { createAppSkinSearchMiddleware } from './AppSkinSearchMiddleware.js';

const app = express();

app.post('/search', createAppSkinSearchMiddleware({
    keywordFilePath: './KeywordIndex.json.gz',
    contains: false
}));
```

* Use the path AppSkin's search posts to; `/search` is an example.
* The middleware reads the request body itself. Don't run `express.json()` before this route.
* `contains: false` matches keywords starting with the search term, `true` matches the term anywhere in a keyword.

## Component data

```js
import { ComboBoxItem } from './ComboBoxItem.js';
import { ComboBoxAjaxResult } from './ComboBoxAjaxResult.js';

app.post('/api/colors', (req, res) =>
{
    const items = [
        new ComboBoxItem({ text: 'Red', value: 'red' }),
        new ComboBoxItem({ text: 'Blue', value: 'blue' })
    ];

    res.json(new ComboBoxAjaxResult(items, items.length));
});
```

## Contributing

Are you a Node.js developer who'd like to help improve or maintain the Node.js backend? Ideas and bug reports are welcome as [GitHub issues](https://github.com/Componyx/Componyx.UI/issues). For code contributions, please open an issue first to discuss the change.

## License

Part of Componyx.UI, under the same license. See [LICENSE](https://github.com/Componyx/Componyx.UI/blob/master/LICENSE).