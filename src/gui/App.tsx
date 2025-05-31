import React, {useEffect, useRef, useState} from "npm:react";

export default function App() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [dataset, setDataset] = useState("aapl");

  useEffect(() => {
    if (!chartRef.current) return;

    let aborted = false;

    (async () => {
      const {default: ChartCell} = await import("observablehq:stdlib/chartcell");
      const data = dataset === "aapl" ? aapl : cars;
      const element = await ChartCell(data);
      if (!aborted && chartRef.current) {
        chartRef.current.replaceChildren(element);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [dataset]);

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
      </div>
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
  {horsepower: 130, weight: 3504},
  {horsepower: 165, weight: 3693},
  {horsepower: 150, weight: 3436},
  {horsepower: 140, weight: 3433}
];
