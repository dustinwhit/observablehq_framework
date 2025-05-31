import {app, BrowserWindow} from 'electron';
import {startGuiServer} from '../gui/server.js';

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
  await startGuiServer({hostname: '127.0.0.1', port: 3001, openBrowser: false});
  mainWindow = new BrowserWindow({width: 1024, height: 768});
  await mainWindow.loadURL('http://127.0.0.1:3001');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
