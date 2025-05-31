import {createServer} from "node:http";
import {dirname} from "node:path/posix";
import {fileURLToPath} from "node:url";
import open from "open";
import send from "send";
import {isSystemError} from "../error.js";
import {readConfig} from "../config.js";
import type {PreviewServer} from "../preview.js";

export interface GuiOptions {
  hostname: string;
  port?: number;
  openBrowser?: boolean;
}

export async function startGuiServer({hostname, port, openBrowser = true}: GuiOptions) {
  const root = dirname(fileURLToPath(import.meta.url));
  let previewServer: PreviewServer | null = null;
  const server = createServer(async (req, res) => {
    if (req.method === "POST" && req.url === "/api/build") {
      try {
        const config = await readConfig();
        await import("../build.js").then((b) => b.build({config}));
        res.end("Build complete");
      } catch (error: any) {
        res.statusCode = 500;
        res.end(error.message);
      }
      return;
    }
    if (req.method === "POST" && req.url === "/api/preview") {
      if (!previewServer) {
        previewServer = await import("../preview.js").then((p) =>
          p.preview({hostname: "127.0.0.1", open: true})
        );
      }
      res.end("Preview started");
      return;
    }
    let pathname = req.url === "/" ? "/index.html" : req.url!;
    send(req, pathname, {root}).pipe(res);
  });

  if (port === undefined) {
    const MAX_PORT = 49152;
    for (port = 3001; port < MAX_PORT; ++port) {
      try {
        await new Promise<void>((resolve, reject) => {
          server.once("error", reject);
          server.listen(port!, hostname, resolve);
        });
        break;
      } catch (error) {
        if (!isSystemError(error) || error.code !== "EADDRINUSE") throw error;
      }
    }
    if (port === MAX_PORT) throw new Error(`Couldn’t connect to any port on ${hostname}`);
  } else {
    await new Promise<void>((resolve) => server.listen(port!, hostname, resolve));
  }
  const url = `http://${hostname}:${port}/`;
  console.log(`Observable GUI running at ${url}`);
  if (openBrowser) open(url);
  return server;
}
