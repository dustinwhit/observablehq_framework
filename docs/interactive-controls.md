---
index: true
---

# Interactive controls

Observable Framework exposes [Observable Inputs](https://github.com/observablehq/inputs) so you can add sliders, dropdowns and other widgets without writing custom code. These inputs let readers explore data dynamically, updating charts and tables as values change.

The [No Code Transformation Doc](../No%20Code%20Transformation%20Doc) notes:

> Key advantages: By building on Observable, you inherit its rich feature set: the reactive notebook environment, support for Observable Plot charts, and a library of interactive UI components ("Inputs" like sliders, dropdowns, etc.) for building dynamic controls.

Below is a short example. A dropdown chooses a sport from a dataset, and a range slider filters athletes by weight.

```js echo
const sport = view(Inputs.select(
  olympians.filter((d) => d.weight && d.height).map((d) => d.sport),
  {sort: true, unique: true, label: "Sport"}
));

const weight = view(
  Inputs.range(
    d3.extent(olympians, (d) => d.weight),
    {step: 1, label: "Weight (kg)"}
  )
);
```

```js echo
Inputs.table(
  olympians.filter(
    (d) => d.sport === sport &&
      d.weight < weight * 1.1 && weight * 0.9 < d.weight
  ),
  {sort: "weight"}
)
```

See [Observable Inputs](./inputs/) for the full list of available widgets.
