# Chart Cell

The Chart Cell provides a simple no‑code interface for creating charts with [Observable Plot](https://observablehq.com/plot/).
It offers dropdown menus for chart type, data fields and aggregation. Use it by calling `ChartCell(data)` where `data` is an array of objects.

```js
view(ChartCell(await FileAttachment("penguins.csv").csv({typed: true})))
```

This renders a form for choosing chart parameters and displays the resulting chart.
