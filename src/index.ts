import * as electron from 'electron';

interface StrictChannelMap {
  [k: string]: any;
}

/**
 * Magic union-->intersection conversion, courtesy of StackOverflow!
 *
 * https://stackoverflow.com/a/50375712 / https://stackoverflow.com/a/50375286
 *
 * Uses some typescript trickery to transform a union to an intersection by
 * first defining the passed type as a parameter type for a function type,
 * then
 */
type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends ((k: infer I) => void) ? I : never;

type Omit<T, U> = Pick<T, Exclude<keyof T, U>>;

type IntersectMethodSignatures<S> = UnionToIntersection<S[keyof S]>;

/**
 * Intersection of strictly-typed `send` method signatures
 *
 * Note: signature is the same for `send`, `sendSync`, and `sendToHost`
 */
type SendMethodSignatures<
  ChannelMap extends StrictChannelMap
> = IntersectMethodSignatures<{
  [C in keyof ChannelMap]: (
    ChannelMap[C] extends void ?
      (channel: C) => void :
      (channel: C, payload: ChannelMap[C]) => void
  )
}>;

/**
 * Intersection of strictly-typed `sendTo` method signatures
 */
type SendToMethodSignatures<
  ChannelMap extends StrictChannelMap
> = IntersectMethodSignatures<{
  [C in keyof ChannelMap]: (
    ChannelMap[C] extends void ?
      (webContentsId: number, channel: C) => void :
      (webContentsId: number, channel: C, payload: ChannelMap[C]) => void
  )
}>;

/**
 * Intersection of strictly-typed signatures for methods that register listeners
 *
 * Note: signature is the same for `on`, `once`, and `removeListener`
 */
type ListenerRegistrarSignatures<
  ChannelMap extends StrictChannelMap
> = IntersectMethodSignatures<{
  [C in keyof ChannelMap]: (
    channel: C,
    listener: ChannelMap[C] extends void ?
      (event: electron.Event) => void :
      (event: electron.Event, payload: ChannelMap[C]) => void
  ) => void
}>;

/**
 * Intersection of strictly-typed `removeAllListeners` method signatures
 */
type RemoveAllListenersSignatures<
  ChannelMap extends StrictChannelMap
> = IntersectMethodSignatures<{
  [C in keyof ChannelMap]: (channel: C) => void
}>;

/**
 * Base type for a strict ipc module (main or renderer)
 *
 * For providing strictly-typed methods, a simple interface merge wouldn't do
 * the trick because the new method definitions would be treated as overloads
 * and the loosely typed definitions would be left intact. By omitting those
 * methods entirely before merging, the return type only defines the strictly
 * typed methods.
 */
type StrictIpcModule<
  ChannelMap extends StrictChannelMap,
  LooseModule extends NodeJS.EventEmitter
> = Omit<
  LooseModule,
  'on' | 'once' | 'removeAllListeners' | 'removeListener'
> & {
  on: ListenerRegistrarSignatures<ChannelMap>;
  once: ListenerRegistrarSignatures<ChannelMap>;
  removeAllListeners: RemoveAllListenersSignatures<ChannelMap>;
  removeListener: ListenerRegistrarSignatures<ChannelMap>;
};

/**
 * Type definition used to override default IpcRenderer with strict typing
 */
export type StrictIpcRenderer<ChannelMap extends StrictChannelMap> = Omit<
  StrictIpcModule<ChannelMap, electron.IpcRenderer>,
  'send' | 'sendSync' | 'sendTo' | 'sendToHost'
> & {
  send: SendMethodSignatures<ChannelMap>;
  sendSync: SendMethodSignatures<ChannelMap>;
  sendTo: SendToMethodSignatures<ChannelMap>;
  sendToHost: SendMethodSignatures<ChannelMap>;
};

/**
 * Type definition used to override default IpcMain with strict typing
 */
export type StrictIpcMain<
  ChannelMap extends StrictChannelMap
> = StrictIpcModule<ChannelMap, electron.IpcMain>;
