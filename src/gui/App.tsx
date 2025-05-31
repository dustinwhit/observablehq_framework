import React, {useEffect, useRef, useState} from "npm:react";
import {Runtime, Inspector} from "npm:@observablehq/runtime";
import * as Plot from "npm:@observablehq/plot";

export default function App() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [dataset, setDataset] = useState("aapl");
  const [chartType, setChartType] = useState("line");
  const [message, setMessage] = useState("");

  async function trigger(path: string) {
    const res = await fetch(path, {method: "POST"});
    setMessage(await res.text());
  }

  const handleBuild = () => trigger("/api/build");
  const handlePreview = () => trigger("/api/preview");

  useEffect(() => {
    if (!chartRef.current) return;
    const runtime = new Runtime();
    const main = runtime.module();

    main.variable().define("data", dataset === "aapl" ? aapl : cars);
    main.variable().define("chartType", chartType);
    main
      .variable(Inspector.into(chartRef.current))
      .define("chart", ["data", "chartType"], (data: any[], chartType: string) => {
        if (chartType === "line") {
          return Plot.plot({marks: [Plot.line(data, {x: "date", y: "close"})]});
        }
        return Plot.plot({marks: [Plot.dot(data, {x: "horsepower", y: "weight"})]});
      });

    return () => runtime.dispose();
  }, [dataset, chartType]);

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
        <button style={{marginLeft: "1rem"}} onClick={handleBuild}>
          Build
        </button>
        <button style={{marginLeft: "0.5rem"}} onClick={handlePreview}>
          Preview
        </button>
      </div>
      <div ref={chartRef} />
      {message && <p>{message}</p>}
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
  {horsepower: 130, weight: 3504},
  {horsepower: 165, weight: 3693},
  {horsepower: 150, weight: 3436},
  {horsepower: 140, weight: 3433}
];
