import * as electron from 'electron';
import { StrictIpcMain, StrictIpcRenderer } from 'typesafe-ipc';

interface IpcChannels {
  'button-click': { count: number };
}

const ipcRenderer: StrictIpcRenderer<IpcChannels> = electron.ipcRenderer;
const ipcMain: StrictIpcMain<IpcChannels> = electron.ipcMain;

export { ipcMain, ipcRenderer };
