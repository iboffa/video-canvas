const { contextBridge, ipcRenderer } = require('electron');
var global = global || window;

contextBridge.exposeInMainWorld('record', {
  start: () => ipcRenderer.send('start-recording'),
  sendChunk: (chunk) => ipcRenderer.send('video-chunk', chunk),
  stop: () => ipcRenderer.send('stop-recording')
})
