import React, {useEffect, useRef, useState} from "npm:react";
import {Runtime, Inspector} from "npm:@observablehq/runtime";
import * as Plot from "npm:@observablehq/plot";
import {dropzone} from "../client/stdlib/inputs.js";
import {RemoteDatabaseClient} from "../client/stdlib/remote-db.js";

export default function App() {
  const chartRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const [dataset, setDataset] = useState("aapl");
  const [data, setData] = useState<any[]>(aapl);
  const [chartType, setChartType] = useState("line");
  const [dbUrl, setDbUrl] = useState("");
  const [sql, setSql] = useState("");

  useEffect(() => {
    setData(dataset === "aapl" ? aapl : cars);
  }, [dataset]);

  useEffect(() => {
    if (!chartRef.current) return;
    const runtime = new Runtime();
    const main = runtime.module();

    main.variable().define("data", data);
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
  }, [data, chartType]);

  // Initialize dropzone for file uploads
  useEffect(() => {
    if (!uploadRef.current) return;
    const zone = dropzone({label: "Upload CSV or JSON", accept: ".csv,.json"});
    const handle = async () => {
      const file = zone.value;
      if (!file) return;
      try {
        if (/\.csv$/i.test(file.name)) {
          setData(await file.csv({typed: true}));
        } else if (/\.json$/i.test(file.name)) {
          setData(await file.json());
        }
      } catch (error) {
        console.error(error);
      }
    };
    zone.addEventListener("input", handle);
    uploadRef.current.appendChild(zone);
    return () => {
      zone.removeEventListener("input", handle);
      uploadRef.current?.removeChild(zone);
    };
  }, []);

  async function runQuery() {
    if (!dbUrl || !sql) return;
    try {
      const db = new RemoteDatabaseClient(dbUrl);
      const rows = await db.query(sql, []);
      setData(rows);
    } catch (error) {
      console.error(error);
    }
  }

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

      <div ref={uploadRef} style={{marginBottom: "1rem"}} />

      <div style={{marginBottom: "1rem"}}>
        <h2>Remote Database</h2>
        <div>
          <label>
            Endpoint:
            <input
              type="text"
              value={dbUrl}
              onChange={(e) => setDbUrl(e.target.value)}
              placeholder="https://example.com/query"
            />
          </label>
        </div>
        <div style={{marginTop: "0.5rem"}}>
          <label>
            SQL:
            <textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              rows={4}
              cols={40}
            />
          </label>
        </div>
        <button style={{marginTop: "0.5rem"}} onClick={runQuery}>
          Run Query
        </button>
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
