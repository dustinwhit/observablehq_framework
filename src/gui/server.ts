import {createServer} from "node:http";
import {dirname} from "node:path/posix";
import {fileURLToPath} from "node:url";
import open from "open";
import send from "send";
import {isSystemError} from "../error.js";

export interface GuiOptions {
  hostname: string;
  port?: number;
  openBrowser?: boolean;
}

export async function startGuiServer({hostname, port, openBrowser = true}: GuiOptions) {
  const root = dirname(fileURLToPath(import.meta.url));
  const server = createServer((req, res) => {
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
