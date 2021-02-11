# typesafe-ipc

A type-only library for adding strict type safety to Electron's IPC modules

## Installation

```
// NPM
$ npm install typesafe-ipc

// YARN
$ yarn add typesafe-ipc
```

## Usage

***Note: see the [provided example app](./examples/basic/README.md) to see `typesafe-ipc` being used inside an electron app.***

Both `ipcMain` and `ipcRenderer` are provided by `electron` as modules that allow sending and receiving arbitrary payloads over arbitrary channels. This library utilizes type assertions to add strict typing to various methods in those modules, which provides compile-time confidence that your code isn't sending or receiving arbitrary ipc messages.

Using `typed-ipc` requires two things:

- An interface that maps ipc channel names to payload types
- Using instances of `ipcMain` and `ipcRenderer` that have had `StrictIpcMain` and `StrictIpcRenderer` types asserted on them

The easiest way to accomplish this is to create a file (module) that defines the payload type interface, and also imports `ipcMain` and `ipcRenderer` so they can be re-exported with `StrictIpcMain` and `StrictIpcRenderer` types asserted.

```typescript
import * as electron from 'electron';
import { StrictIpcMain, StrictIpcRenderer } from 'typesafe-ipc';

interface IpcChannelMap {
  'no-payload': void;
  'simple-payload': string;
  'complex-payload': {
    foo: string;
    bar: {
      baz: number;
    }
  };
}

const ipcRenderer: StrictIpcRenderer<IpcChannelMap> = electron.ipcRenderer;
const ipcMain: StrictIpcMain<IpcChannelMap> = electron.ipcMain;

export { ipcMain, ipcRenderer };
```

The `ipcMain` and `ipcRenderer` exported from this module will be exactly the same as their internal counterparts, except they will have been type-asserted using the strict helper types. This means the method signatures for channel-specific methods (`on`, `once`, `send`, etc) will have been replaced with explicit signatures for each member of the `IpcChannelMap` interface. All code in main or renderer processes that utilize ipc should be updated to instead use these strictly-typed alternatives.

### Usage with `enum` instead of string literals

It's also possible to use an `enum` for channel names. Usage is exactly the same as above except that `IpcChannelMap` is keyed with enum values:

```typescript
export const enum Channel {
  NoPayload = 'no-payload',
  SimplePayload = 'simple-payload',
  ComplexPayload = 'complex-payload'
}

interface IpcChannelMap {
  [Channel.NoPayload]: void;
  [Channel.SimplePayload]: string;
  [Channel.ComplexPayload]: {
    foo: string;
    bar: {
      baz: number;
    }
  };
}
```

## Motivation & Philosophy

Having worked on a few different electron projects I noticed that as the app grew, managing ipc messaging became increasingly complex. Without type safety, Electron's `ipcMain` and `ipcRenderer` modules allow developers to send messages to/from any channel name and with any payload type. As the app grows and inevitable refactors happen, the lack of type safety around both sending and receiving these messages becomes an annoyance at best and a liability at worst.

Enter `typesafe-ipc`, which aims to provide a lightweight, *type-only* solution to this problem by providing strict typing to ipc module methods.
