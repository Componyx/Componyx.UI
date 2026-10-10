# Componyx.UI

**Standards-based, framework-free UI components for the web.**

📖 **[Full documentation, examples and API reference: componyx.com](https://componyx.com)**

> **First public release.** This is the first public release of Componyx.UI, so you
> may run into issues. If you do, please
> [open an issue](https://github.com/Componyx/Componyx.UI/issues) so it can be fixed.

Componyx.UI is a modular framework for building web interfaces with plain JavaScript, HTML and CSS. There's no build step and no compiler, everything runs directly in the browser.

## What's included

* **[Components](https://componyx.com/components/introduction)** — 25+ ready-to-use UI components: buttons, forms, menus, grids, dialogs and more, built in plain JavaScript with zero external runtime dependencies.
* **[Bindary](https://componyx.com/bindary/introduction)** — a reactive data-binding layer that keeps your UI in sync with your data, without adopting a new templating language. Use it alongside the components, or on its own.

---

## Why Componyx.UI?

## Componyx

Componyx delivers two products that work together, but stand on their own:

* **Componyx.UI** — reusable UI components you can drop into any HTML/JavaScript page.
* **Bindary** — a reactive data-binding layer that keeps your UI in sync with your data.

Use them together, or use either one independently.

### Componyx.UI

25+ ready-to-use components including buttons, forms, menus, grids, dialogs and more.

Built in plain JavaScript with zero external runtime dependencies.

### Bindary

A reactive data-binding layer for plain HTML.

Bind values, repeat data, load routes, and keep your UI in sync without adopting a new templating language.

---

## Why Componyx?

### Standards-based

Componyx components use HTML attributes and JavaScript events in a way that stays close to the platform.

There is no new component syntax to learn. If you know HTML and JavaScript, you already know the foundation.

The [API reference](https://componyx.com) documents the available elements, attributes, properties and events.

### No build step required

Add the Componyx resources to your page and go.

Your application does not need a compiler, bundler, or third-party JavaScript packages just to use Componyx.

### Modular by design

Use a single component or build an entire application interface from Componyx components.

Components can be declared directly in HTML or created and configured from JavaScript.

### Fast by default

Componyx works directly with the browser's DOM.

There is no virtual DOM or additional rendering layer between your application and the browser.

### Proven, not experimental

Componyx was developed over more than a decade in real business applications, handling real users, real data and real-world requirements.

It is now being made available as a reusable library.

### Free to use

Componyx.UI is free to use for personal and commercial projects, by companies, freelancers and agencies.

See [`LICENSE`](LICENSE) for the complete license terms.

---

## Getting Started

Componyx.UI is designed to work directly in the browser.

For installation instructions, examples, component documentation and API reference, visit:

**[componyx.com](https://componyx.com)**

---

## TypeScript definitions (optional)

Componyx.UI ships TypeScript definition files for editor IntelliSense and type checking in plain JavaScript projects. They are for tooling only; the components themselves are 100% JavaScript and nothing changes at runtime.
When using the NuGet package, the definitions are copied to TypeDefinitions/Componyx.UI on build; add that folder to the include of your tsconfig.json or jsconfig.json.

Setup for NPM and NuGet projects is described at [componyx.com](https://componyx.com).

---

## Editor support

Componyx ships a VS Code custom data file for IntelliSense on `ui-*`, `data-ui-*`, `b-*` and `data-bindary-*` attributes. When using the NuGet package, it is copied to `TypeDefinitions/Componyx.UI` on build. Add this to your project's `.vscode/settings.json`:

```json
{
  "html.customData": ["./TypeDefinitions/Componyx.UI/componyx.html-data.json"]
}
```

Restart VS Code (or reload the window) for it to take effect.

---

## Server-side integration

The core UI components are JavaScript-based and are not tied to a particular server-side technology.

Componyx provides integrations and helper libraries for server-side environments including:

* **.NET 10**
* **Node.js**

These integrations are optional. The client-side UI components can be used independently.

---

## Repository Structure

```text
Componyx.UI/
├── Build/              Build Scripts for minifying and bundeling scripts and CSS.
├── Data/               Data like IconPacks, JSDOC Template and Utils.
├── Docs/               Development documentation.
├── NET/                .NET integration and C# source.
├── NodeBackend/        NodeJS backend source files.
├── Resources/          JavaScript, CSS and other embedded resources
├── TypeDefinitions/    TypeScript definition files for VS intellisense.
├── README.md
└── LICENSE
```

For information about building the repository from source, see [`docs/BUILD.md`](docs/BUILD.md).

---

## Development

The repository contains the source code and build tooling used to develop and package Componyx.UI.

The build process bundles and minifies the client-side JavaScript and CSS resources and prepares the resources used by the .NET integration.

See [`docs/BUILD.md`](docs/BUILD.md) for development and build instructions.

---

## Documentation

Full documentation, examples and API reference are available at:

**[componyx.com](https://componyx.com)**

---

## License (TL;DR)

Componyx.UI is source-available under the Business Source License 1.1 (BUSL-1.1) with a custom Additional Use Grant. Each version automatically converts to the MIT license four years after its release.

Componyx.UI is free to use in production, for personal and commercial projects alike: build, run and sell your own applications, including for clients as a freelancer or agency. Letting your users build forms, pages or layouts within your application is free too.

What you may not do is resell, rebrand, or distribute Componyx.UI as your own product, library, or framework. A product whose main purpose is letting others build general-purpose forms, such as an online form builder or survey tool, is licensed separately.

See ['LICENSE'](LICENSE) for the full terms. Not sure whether your use is covered? [Contact us](https://componyx.com/contact/license).
