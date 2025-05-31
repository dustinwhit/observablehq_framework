# Dropzone input

The dropzone input allows users to drag files onto a highlighted area. It exposes
the dropped file in the same interface as [`FileAttachment`](../files), making it
easy to parse CSV, JSON and other formats.

```js echo
const upload = view(Inputs.dropzone({label: "Upload CSV", accept: ".csv"}));
```

```js echo
const table = await upload.csv({typed: true});
```

The dropzone also works when clicked, letting users select files via the native
file picker. When a file is dragged over the zone, its appearance changes to
offer visual feedback.
