/**
 * Public API for in-process filesystem coordination through one shared
 * `LockManager`.
 *
 * Guarantees are scoped to operations that use this package and share that
 * manager; this is not OS-level or cross-process locking.
 */
import { LockManager, LockManagerOptions } from "./lock_manager.js";
import {
  Client,
  ClientCollectBufferOptions,
  ClientCollectDirentOptions,
  ClientCollectOptions,
  ClientCollectStringOptions,
  ClientOptions,
  ClientReadBufferOptions,
  ClientReadOptions,
  ClientCreateReadStreamOptions,
  ClientReadStringOptions,
  ClientWriteOptions,
  ClientCreateWriteStreamOptions,
} from "./client.js";

export {
  Client,
  ClientCollectBufferOptions,
  ClientCollectDirentOptions,
  ClientCollectOptions,
  ClientCollectStringOptions,
  LockManager,
  LockManagerOptions,
  ClientReadBufferOptions,
  ClientReadOptions,
  ClientCreateReadStreamOptions,
  ClientReadStringOptions,
  ClientCreateWriteStreamOptions,
  ClientWriteOptions,
  ClientOptions,
};
