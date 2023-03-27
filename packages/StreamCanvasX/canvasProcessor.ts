class Processor {
  private video!: HTMLVideoElement;
  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;

  constructor(parmams: { vedio_el: HTMLVideoElement; canvas_el: HTMLCanvasElement }) {
    this.video = parmams.vedio_el;
    this.canvas = parmams.canvas_el;
    if (this.canvas) {
      this.context = this.canvas.getContext('2d')!;
    }
  }
  createVedio() {

  }
  openCamera() {

  }
  closeCamera() {

  }
}


export default Processor;

