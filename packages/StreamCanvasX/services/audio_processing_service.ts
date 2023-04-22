import { injectable, inject, Container } from 'inversify';
import { IDrawer } from '..';

@injectable()
class AudioProcessingService implements IDrawer {
  mediaSource_el!: HTMLAudioElement|HTMLVideoElement;
  canvas!: HTMLCanvasElement;
  audioContext!: AudioContext;
  canvasContext!: CanvasRenderingContext2D;
  analyserNode: AnalyserNode;
  audioSourceNode: MediaElementAudioSourceNode;

  constructor(parmams: { media_el?: HTMLAudioElement; canvas_el?: HTMLCanvasElement}) {
    const { canvas_el, media_el } = parmams;
    if (canvas_el) {
      this.setCanvasDom(canvas_el);
    }
    this.createAudioContext();
    this.setMediaSource_el(media_el);
    this.audioContextConnect();
  }


  createAudioContext() {
    this.audioContext = new AudioContext();
    this.analyserNode = this.audioContext.createAnalyser();
  }

  setCanvasDom(el: HTMLCanvasElement) {
    this.canvas = el;
    this.canvasContext = this.canvas.getContext('2d')!;
  }

  setMediaSource_el(el) {
    this.mediaSource_el = el;
    this.audioSourceNode = this.audioContext.createMediaElementSource(el);
  }

  audioContextConnect() {
    this.audioSourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);
  }
}

export default AudioProcessingService;
