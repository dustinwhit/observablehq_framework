import {app, BrowserWindow} from "npm:electron";
import {startGuiServer} from "./gui/server.js";

async function createWindow() {
  const server = await startGuiServer({hostname: "127.0.0.1", openBrowser: false});
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 3001;

  const win = new BrowserWindow({width: 1000, height: 800});
  win.on("closed", () => {
    server.close();
  });
  await win.loadURL(`http://127.0.0.1:${port}/`);
}

app.whenReady().then(createWindow);
