import {readFile, writeFile} from "node:fs/promises";
import {parse, format} from "d3-dsv";
import {group, rollup, sum, mean} from "d3-array";
import * as clack from "@clack/prompts";
import type {TtyEffects} from "./tty.js";
import {bold, defaultEffects as defaultTtyEffects, faint, inverse} from "./tty.js";
import {CliError} from "./error.js";

export interface TransformEffects extends TtyEffects {
  clack: typeof clack;
  readFile(path: string): Promise<string>;
  writeFile(path: string, contents: string): Promise<void>;
}

const defaultEffects: TransformEffects = {
  ...defaultTtyEffects,
  clack,
  readFile,
  writeFile
};

export interface TransformOptions {
  source: string;
  output?: string;
}

export async function transform(
  {source, output}: TransformOptions,
  effects: TransformEffects = defaultEffects
): Promise<void> {
  const {clack} = effects;
  clack.intro(`${inverse(" observable transform ")} ${faint(`v${process.env.npm_package_version}`)}`);
  const text = await effects.readFile(source);
  const data = parse(text);
  const action = await clack.select({
    message: "Choose an operation",
    options: [
      {value: "filter", label: "Filter rows"},
      {value: "aggregate", label: "Aggregate"},
      {value: "sql", label: "Convert to SQL"}
    ],
    initialValue: "filter"
  });
  if (clack.isCancel(action)) throw new CliError("Stopped transform", {print: false});

  if (action === "filter") {
    const column = await clack.text({message: "Column"});
    const value = await clack.text({message: "Equals"});
    if (clack.isCancel(column) || clack.isCancel(value)) throw new CliError("Stopped transform", {print: false});
    const result = data.filter((d: any) => d[column] === value);
    const csv = format(result);
    if (output) {
      await effects.writeFile(output, csv);
      clack.outro(`Wrote ${bold(output)} (${result.length} rows)`);
    } else {
      console.log(csv);
    }
  } else if (action === "aggregate") {
    const groupCol = await clack.text({message: "Group by column"});
    const valueCol = await clack.text({message: "Value column"});
    const agg = await clack.select({
      message: "Aggregator",
      options: [
        {value: "count", label: "count"},
        {value: "sum", label: "sum"},
        {value: "mean", label: "mean"}
      ],
      initialValue: "count"
    });
    if (clack.isCancel(groupCol) || clack.isCancel(valueCol) || clack.isCancel(agg))
      throw new CliError("Stopped transform", {print: false});
    const rolled = Array.from(
      rollup(
        data,
        (v) =>
          agg === "count"
            ? v.length
            : agg === "sum"
              ? sum(v, (d: any) => +d[valueCol])
              : mean(v, (d: any) => +d[valueCol]),
        (d: any) => d[groupCol]
      ),
      ([key, value]) => ({[groupCol]: key, [valueCol]: value as any})
    );
    const csv = format(rolled);
    if (output) {
      await effects.writeFile(output, csv);
      clack.outro(`Wrote ${bold(output)} (${rolled.length} rows)`);
    } else {
      console.log(csv);
    }
  } else if (action === "sql") {
    const table = await clack.text({message: "Table name", placeholder: "data"});
    if (clack.isCancel(table)) throw new CliError("Stopped transform", {print: false});
    const columns = Object.keys(data[0] ?? {});
    const create = `CREATE TABLE ${table} (\n  ${columns.map((c) => `\`${c}\` TEXT`).join(",\n  ")}\n);`;
    const inserts = data
      .map(
        (row: any) =>
          `INSERT INTO ${table} VALUES (${columns.map((c) => `'${String(row[c]).replace(/'/g, "''")}'`).join(", ")});`
      )
      .join("\n");
    const sql = `${create}\n${inserts}\n`;
    if (output) {
      await effects.writeFile(output, sql);
      clack.outro(`Wrote ${bold(output)}`);
    } else {
      console.log(sql);
    }
  }
}
