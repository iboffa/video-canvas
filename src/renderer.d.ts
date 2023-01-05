export {};

interface RecordApi {
  start: () => void;
  sendChunk: (chunk: Uint8Array) => void;
  stop: () => void;
}

declare global {
  interface Window {
    record: RecordApi;
  }
}
