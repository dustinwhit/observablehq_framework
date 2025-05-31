---
title: Sample Dashboard
---

# Sample Dashboard

This page uses a preloaded dataset of U.S. state capitals to render a scatter plot with Observable Plot.

```js
import * as Plot from "npm:@observablehq/plot";
const capitals = FileAttachment("data/us-state-capitals.csv").csv({typed: true});
Plot.plot({
  marks: [Plot.dot(capitals, {x: "longitude", y: "latitude"})]
})
```
