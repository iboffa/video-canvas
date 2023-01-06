import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecorderService {
  start(): void {
    window.record.start();
  }

  record(chunk: Blob): void {
    chunk
      .arrayBuffer()
      .then((buffer) => window.record.sendChunk(buffer));
  }

  stop(): void {
    window.record.stop();
  }
}
