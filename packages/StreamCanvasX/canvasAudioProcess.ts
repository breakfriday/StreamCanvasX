class Process {
  private audio!: HTMLAudioElement;
  private canvas!: HTMLCanvasElement;
  private canvas1!: HTMLCanvasElement;
  private audioContext!: AudioContext;
  private canvas_context!: CanvasRenderingContext2D;

  constructor() {
    console.log('sdf');
  }

  setSource() {

  }

  setCanvasDom(el: HTMLCanvasElement) {
    this.canvas = el;
    this.canvas_context = this.canvas.getContext('2d')!;
  }

  visulizerDraw1() {

  }
}

export default Process;
