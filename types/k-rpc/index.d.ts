// Type definitions for bittorrent-dht 9.0
// Project: https://github.com/mafintosh/k-rpc
// Definitions by: zcorw <https://github.com/zcorw>

/// <reference types="node" />


declare module 'k-rpc' {
  import { EventEmitter } from 'events';
  function krpc(opts: options): rpc;
  type options = {
    // per peer query timeout defaults to 2s
    timeout?: number,
    // an array of bootstrap nodes. defaults to the BitTorrent bootstrap nodes
    nodes?: string[],
    // how many concurrent queries should be made. defaults to 16
    concurrency?: number,
    // how big should be routing buckets be. defaults to 20.
    k?: number,
    // the local node id. defaults to 20 random bytes
    id?: Buffer,
    // Length of ID in bytes, defaults to 20 (sha1)
    idLength?: number,
    // optional k-rpc-socket instance
    krpcSocket?: krpcSocket,
  };
  type krpcSocket = any;
  type nodeAddress = {
    id: Buffer,
    host: string,
    port: number,
    token?: Buffer,
    distance?: number,
    seen?: number,
  };
  type rinfo = {
    address: string,
    family: string,
    port: number,
    size: number,
  };
  type queryMsg = {
    t?: Buffer,
    y?: 'q',
    q: string,
    a: any,
  };
  type responseMsg = any;
  type closestCB = (err: Error, numberOfReplies: number) => void;
  type sendCB = (err: Error) => void;
  type responseCB = (err: Error, reply: responseMsg, rinfo: rinfo, message: queryMsg) => void;
  type listenCB = () => void;

  interface rpc extends EventEmitter {
    id: Buffer;
    nodes: any;
    socket: krpcSocket;
    bind(port?: number, address?: string, callback?: listenCB): void;
    address(): rinfo;
    populate(target: Buffer, query: queryMsg, callback?: closestCB): void;
    closest(target: Buffer, query: queryMsg, onreply: (message: responseMsg, node: rinfo) => boolean, callback?: closestCB): void;
    query(node: nodeAddress, query: queryMsg, callback: responseCB): void;
    queryAll(nodes: nodeAddress[], query: queryMsg, onreply: (message: responseMsg, node: nodeAddress) => void, callback: closestCB): void;
    destroy(): void;
    response(node: nodeAddress, query: { t: Buffer }, response: any, nodes?: nodeAddress[], callback?: sendCB): void
    response(node: nodeAddress, query: { t: Buffer }, response: any, callback?: sendCB): void;
    error(node: nodeAddress, query: queryMsg, error: Buffer, callback?: sendCB): void;
    on(event: 'listening', callback: listenCB): this;
    on(event: 'warning', callback: (err: Error) => void): this;
    on(event: 'error', callback: (err: Error) => void): this;
    on(event: 'query', callback: (query: queryMsg, peer: rinfo) => void): this;
    on(event: 'node', callback: (node: nodeAddress) => void): this;
    on(event: 'ping', callback: (oldNodes: any[], swapNew: (deadNode: nodeAddress) => void) => void): this;
  }
  export = krpc;
}