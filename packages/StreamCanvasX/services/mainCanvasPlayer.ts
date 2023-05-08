import { injectable } from 'inversify';
import mpegts from 'mpegts.js';
import { ImainPlayerService } from '../types/services/index';

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
    createFlvPlayer(parms: Parameters<ImainPlayerService['createFlvPlayer']>[0]) {
      let { type, isLive, url } = parms;
      let videoEl = this.video;

      if (videoEl) {
        const mpegtsPlayer = mpegts.createPlayer({
          type: type!, // could also be mpegts, m2ts, flv
          isLive: isLive,
          url: url,
        });

        // mpegts_player.on(mpegts.Events.METADATA_ARRIVED, () => {
        //   // const h = new CanvasPlayerByVideos({ vedio_el: veido_flv_ref?.current, canvas_el: canvas_ref?.current });
        //   // loadMediaEvent();
        // });

        mpegtsPlayer.attachMediaElement(videoEl);
        mpegtsPlayer.load();
        mpegtsPlayer.play();
      }
    }

    set_blob_url(filedata: File) {
      let blobUrl = URL.createObjectURL(filedata);
      this.video.src = blobUrl;
      this.video.load();
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

