# typesafe-ipc

A type-only library for adding strict type safety to Electron's IPC modules

## Installation

```
// NPM
$ npm install typesafe-actions

// YARN
$ yarn add typesafe-actions
```

## Usage

Both `ipcMain` and `ipcRenderer` are provided as ready-made modules by `electron` that allow sending and receiving arbitrary payloads over arbitrary channels. To add strict typing you'll first have to define an interface that maps channel names to payload types, then explicitly cast those modules to the strict type alternatives provided by this library:

```typescript
import * as electron from 'electron';

interface IpcChannels {
  'no-payload': void;
  'simple-palyload': string;
  'complex-payload': {
    foo: string;
    bar: {
      baz: number;
    }
  };
}

const ipcRenderer: StrictIpcRenderer<IpcChannels> = electron.ipcRenderer;
const ipcMain: StrictIpcMain<IpcChannels> = electron.ipcMain;

export { ipcMain, ipcRenderer }
```

## Motivation

Having worked on a few different electron projects, I noticed that the number of ipc messages and the complexity of managing them grew at least linearly alongside the rest of the app. Without type safety, Electron's `ipcMain` and `ipcRenderer` allow developers to send messages to/from any channel name and with any payload type. As the app grows and inevitable refactors happen, the lack of type safety around both sending and receiving these messages becomes an annoyance at best and a liability at worst.

Enter `typesafe-ipc`, which aims to provide a lightweight, *type-only* solution to this problem by providing strict typing to the ipc module methods.
