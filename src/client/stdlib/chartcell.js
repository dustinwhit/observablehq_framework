// ChartCell: a minimal no-code chart builder using Observable Plot
export default async function chartCell(data, options = {}) {
  if (!Array.isArray(data)) throw new Error("data must be an array of objects");
  const [{select}, Plot] = await Promise.all([
    import("npm:@observablehq/inputs"),
    import("npm:@observablehq/plot")
  ]);

  const columns = data.length ? Object.keys(data[0]) : [];
  const form = document.createElement("form");
  form.style.marginBottom = "0.5rem";

  const chartTypes = ["bar", "line", "scatter"];
  const chartTypeInput = select(chartTypes, {label: "Chart type", value: options.type || chartTypes[0]});
  const xInput = select(columns, {label: "X", value: options.x || columns[0]});
  const yInput = select(columns, {label: "Y", value: options.y || columns[1]});
  const aggInput = select(["count", "sum", "mean"], {label: "Aggregate", value: options.aggregate || "count"});
  form.append(chartTypeInput, xInput, yInput, aggInput);

  const div = document.createElement("div");
  div.appendChild(form);
  const plotDiv = div.appendChild(document.createElement("div"));

  function render() {
    const type = chartTypeInput.value;
    const x = xInput.value;
    const y = yInput.value;
    const agg = aggInput.value;
    let mark;
    switch (type) {
      case "line":
        mark = Plot.line(data, {x, y});
        break;
      case "scatter":
        mark = Plot.dot(data, {x, y});
        break;
      default:
        mark = Plot.barY(data, Plot.groupX({[agg]: y}, {x}));
    }
    plotDiv.replaceChildren(Plot.plot({marks: [mark]}));
  }

  chartTypeInput.addEventListener("input", render);
  xInput.addEventListener("input", render);
  yInput.addEventListener("input", render);
  aggInput.addEventListener("input", render);

  render();
  return div;
}
