import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('record', {
  start: () => ipcRenderer.send('start-recording'),
  sendChunk: (chunk: ArrayBuffer) => {
    ipcRenderer.send('video-chunk', chunk);
  },
  stop: () => ipcRenderer.send('stop-recording'),
});
