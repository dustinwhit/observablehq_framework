import React, {useEffect, useRef, useState} from "npm:react";
import {Runtime, Inspector} from "npm:@observablehq/runtime";
import * as Plot from "npm:@observablehq/plot";
import * as aq from "npm:arquero";

export default function App() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [dataset, setDataset] = useState("aapl");
  const [chartType, setChartType] = useState("line");
  const [minHorsepower, setMinHorsepower] = useState(100);
  const [groupBy, setGroupBy] = useState("none");

  useEffect(() => {
    if (!chartRef.current) return;
    const runtime = new Runtime();
    const main = runtime.module();

    const raw = dataset === "aapl" ? aapl : cars;
    let table = aq.from(raw);
    if (dataset === "cars") {
      table = table.filter((d: any) => d.horsepower >= minHorsepower);
      if (groupBy !== "none") {
        table = table.groupby(groupBy).rollup({weight: (d: any) => aq.op.mean(d.weight)});
      }
    }
    const data = table.objects();

    main.variable().define("data", data);
    main.variable().define("chartType", chartType);
    main
      .variable(Inspector.into(chartRef.current))
      .define("chart", ["data", "chartType"], (data: any[], chartType: string) => {
        if (dataset === "cars" && groupBy !== "none") {
          return Plot.plot({marks: [Plot.barY(data, {x: groupBy, y: "weight"})]});
        }
        if (chartType === "line") {
          return Plot.plot({marks: [Plot.line(data, {x: "date", y: "close"})]});
        }
        return Plot.plot({marks: [Plot.dot(data, {x: "horsepower", y: "weight"})]});
      });

    return () => runtime.dispose();
  }, [dataset, chartType, minHorsepower, groupBy]);

  return (
    <div>
      <h1>Observable GUI</h1>
      <div style={{marginBottom: "1rem"}}>
        <label>
          Dataset:
          <select value={dataset} onChange={(e) => setDataset(e.target.value)}>
            <option value="aapl">AAPL Prices</option>
            <option value="cars">Cars</option>
          </select>
        </label>
        <label style={{marginLeft: "1rem"}}>
          Chart Type:
          <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="line">Line</option>
            <option value="scatter">Scatter</option>
          </select>
        </label>
      </div>
      {dataset === "cars" && (
        <div style={{marginBottom: "1rem"}}>
          <label>
            Min horsepower: {minHorsepower}
            <input
              type="range"
              min="0"
              max="300"
              value={minHorsepower}
              onChange={(e) => setMinHorsepower(+e.target.value)}
              style={{marginLeft: "0.5rem"}}
            />
          </label>
          <label style={{marginLeft: "1rem"}}>
            Group by:
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
              <option value="none">None</option>
              <option value="origin">Origin</option>
              <option value="cylinders">Cylinders</option>
            </select>
          </label>
        </div>
      )}
      <div ref={chartRef} />
    </div>
  );
}

const aapl = [
  {date: new Date("2024-01-01"), close: 150},
  {date: new Date("2024-02-01"), close: 155},
  {date: new Date("2024-03-01"), close: 148},
  {date: new Date("2024-04-01"), close: 160}
];

const cars = [
  {horsepower: 130, weight: 3504, cylinders: 8, origin: "USA"},
  {horsepower: 165, weight: 3693, cylinders: 8, origin: "USA"},
  {horsepower: 150, weight: 3436, cylinders: 8, origin: "USA"},
  {horsepower: 140, weight: 3433, cylinders: 8, origin: "USA"},
  {horsepower: 198, weight: 4341, cylinders: 8, origin: "Europe"},
  {horsepower: 95, weight: 2372, cylinders: 4, origin: "Japan"}
];
