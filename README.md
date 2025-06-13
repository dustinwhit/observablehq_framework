# Observable Framework

[**Observable Framework**](https://observablehq.com/framework/) is a free, [open-source](./LICENSE), static site generator for data apps, dashboards, reports, and more. Framework combines JavaScript on the front-end for interactive graphics with any language on the back-end for data analysis. Framework features [data loaders](https://observablehq.com/framework/loaders) that precompute static snapshots of data at build time for dashboards that load instantly.

Recent additions include a drag-and-drop **dropzone** input for uploading files and a `RemoteDatabaseClient` for querying external databases over HTTP. These features simplify working with CSV or JSON data and connecting to remote sources without writing code.

<a href="https://observablehq.observablehq.cloud/oss-analytics/@observablehq/framework">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://observablehq.observablehq.cloud/oss-analytics/@observablehq/framework/downloads-dark.svg">
    <img alt="Daily downloads of Observable Framework" src="https://observablehq.observablehq.cloud/oss-analytics/@observablehq/framework/downloads.svg">
  </picture>
</a>

<sub>Daily downloads of Observable Framework · [oss-analytics](https://observablehq.observablehq.cloud/oss-analytics/)</sub>

## Documentation 📚

https://observablehq.com/framework/

## Installation & usage 🛠️

Start the optional GUI editor with:

```sh
npx @observablehq/framework gui
```

By default this opens <http://127.0.0.1:3001/>.

To explore the included sample datasets and a starter notebook, run:

```sh
npx @observablehq/framework samples
```

This copies the bundled files into a local `samples/` directory so you can preview them immediately.

## Development setup

To install dependencies for local development, run the included setup script. It
verifies that Node.js and Yarn are available and then installs all packages via
Yarn:

```sh
./setup.sh
```

## Examples 🖼️

https://github.com/observablehq/framework/tree/main/examples

## Releases (changelog) 🚀

https://github.com/observablehq/framework/releases

## Getting help 🏠

Please [open a discussion](https://github.com/observablehq/framework/discussions) if you’d like help. We also recommend [searching issues](https://github.com/observablehq/framework/issues).

## Contributing 🙏

See [Contributing](https://observablehq.com/framework/contributing).
