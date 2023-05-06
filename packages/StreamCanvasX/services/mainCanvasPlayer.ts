import { injectable } from 'inversify';

@injectable()
class mainPlayerService {
    private video!: HTMLVideoElement;
    private canvas!: HTMLCanvasElement;
    private context!: CanvasRenderingContext2D;

    constructor(parmams: { vedio_el: HTMLVideoElement; canvas_el: HTMLCanvasElement }) {
      this.video = parmams.vedio_el;
      this.canvas = parmams.canvas_el;
      if (this.canvas) {
        this.context = this.canvas.getContext('2d')!;
      }

      this.video.addEventListener(
        'play',
        () => {
          requestAnimationFrame(this.analyzeCanvas.bind(this));
        },
        false,
      );
    }


    analyzeCanvas() {
      if (this.video.ended || this.video.paused) {
        return;
      }

      this.context.drawImage(
        this.video,
        0,
        0,
        800,
        800,
      );

      const {
        data: [r, g, b],
      } = this.context.getImageData(0, 0, 1, 1);

      document.body.style.cssText = `background: rgb(${r}, ${g}, ${b});`;
      requestAnimationFrame(this.analyzeCanvas.bind(this));
    }
  }


  export default mainPlayerService;

