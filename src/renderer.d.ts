export {};

interface RecordApi {
  start: () => void;
  sendChunk: (chunk: ArrayBuffer) => void;
  stop: () => void;
}

declare global {
  interface Window {
    record: RecordApi;
  }
}
