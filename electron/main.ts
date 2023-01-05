import * as path from 'path';

import { app, BrowserWindow, ipcMain } from 'electron';
import * as ffmpeg from '@ffmpeg-installer/ffmpeg';
import { ChildProcess, spawn } from 'child_process';
import { formatDate } from './date_formatter';

let ffmpegProcess: ChildProcess;

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
    },
  });

  // Load the index.html of the app.
  win.loadFile(path.join(__dirname, '../index.html'));
}

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('web-contents-created', (event, webContents) => {
  // Set the Content-Security-Policy for all web contents
  const csp =
    "default-src 'self'; script-src 'self' 'nonce-{random-string}'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';";
  webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp],
      },
    });
  });
});

ipcMain.on('start-recording', () => {
  console.log('start recording');
  const filename = formatDate(new Date());
  ffmpegProcess = spawn(ffmpeg.path.replace('app.asar', 'app.asar.unpacked'), [
    '-f',
    'webm',
    '-c:v',
    'vp9',
    '-i',
    '-',
    '-c:a',
    'aac',
    '-strict',
    'experimental',
    `${filename}.mp4`,
  ]);

  ffmpegProcess.on('finish', () => {
    console.log('finish');
    ffmpegProcess.kill('SIGINT');
  });

  ffmpegProcess.on('error', (error) => {
    console.error(error);
  });

  ffmpegProcess.stdout?.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ffmpegProcess.stderr?.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
});

ipcMain.on('stop-recording', () => {
  console.log('stop recording');
  if (!ffmpegProcess.killed) {
    console.log('stdin end');
    ffmpegProcess.stdin?.end();
  }
});

ipcMain.on('video-chunk', (event, chunk: Uint8Array) => {
  console.log('chunk received');
  if (!ffmpegProcess.killed && !ffmpegProcess.stdin?.writableEnded)
    ffmpegProcess.stdin?.write(Buffer.from(chunk));
});
