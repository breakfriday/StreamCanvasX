import { injectable, inject, Container } from 'inversify';
import { IDrawer, IProcess } from '..';

@injectable()
class AudioProcessingService implements IProcess {
  context: IProcess['context'];

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
    this.context.audioContext = new AudioContext();
    this.context.analyserNode = this.context.audioContext.createAnalyser();
  }

  setCanvasDom(el: HTMLCanvasElement) {
    this.context.canvas = el;
    this.context.canvasContext = this.context.canvas.getContext('2d')!;
  }

  setMediaSource_el(el) {
    this.context.mediaSource_el = el;
    this.context.audioSourceNode = this.context.audioContext.createMediaElementSource(el);
  }

  audioContextConnect() {
    this.context.audioSourceNode.connect(this.context.analyserNode);
    this.context.analyserNode.connect(this.context.audioContext.destination);
  }
}

export default AudioProcessingService;
