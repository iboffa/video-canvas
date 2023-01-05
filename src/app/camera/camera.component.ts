import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChildProcess, spawn } from 'child_process';
import { from, Observable } from 'rxjs';
import { RecorderService } from '../services/recorder/recorder.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export default class CameraComponent implements OnInit, AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  recording = false;
  camera$!: Observable<MediaStream>;
  ffmpeg!: ChildProcess;
  mediaRecorder!: MediaRecorder;

  constructor(private zone: NgZone, private recorderService: RecorderService) {}

  ngOnInit() {
    this.camera$ = from(navigator.mediaDevices.getUserMedia({ video: true }));
  }

  ngAfterViewInit(): void {
    this.mediaRecorder = new MediaRecorder(
      this.canvasElement.nativeElement.captureStream(),
      { mimeType: 'video/webm;codecs=vp9' }
    );
    this.mediaRecorder.onstart = () => this.recorderService.start();
    this.mediaRecorder.ondataavailable = (event) =>
      this.recorderService.record(event.data);
    this.mediaRecorder.onstop = () => this.recorderService.stop();
  }

  toggleRecording() {
    this.recording = !this.recording;
    if (this.recording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  startRecording() {
    this.mediaRecorder.start(1000);
  }

  stopRecording() {
    this.mediaRecorder.stop();
  }

  onPlay() {
    const context = this.canvasElement.nativeElement.getContext('2d');
    const width = this.canvasElement.nativeElement.width;
    const height = this.canvasElement.nativeElement.height;

    const drawFrame = () => {
      this.zone.runOutsideAngular(() => {
        requestAnimationFrame(drawFrame);
        context!.drawImage(
          this.videoElement.nativeElement,
          0,
          0,
          width,
          height
        );
      });
    };

    drawFrame();
  }
}
