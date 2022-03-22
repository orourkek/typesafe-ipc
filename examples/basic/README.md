# `typesafe-ipc` Example App

A minimal and framework-agnostic electron application to showcase `typesafe-ipc` in action.

Since `typesafe-ipc` doesn't require any specific libraries or frameworks (except `electron`), this app was built to be as minimal as possible. The UI is written in plain HTML and CSS, and TypeScript is built using `fuse-box` with extremely minimal configuration.

Like all electron apps this one has code for the main process ([`main.ts`](./src/main.ts)) and the renderer process ([`renderer.ts`](./src/renderer.ts)) that sometimes need to exchange messages.

## Running the App

```
// install dependencies:
$ npm i

// build the app:
$ npm run build

// run it:
$ npm start
```
