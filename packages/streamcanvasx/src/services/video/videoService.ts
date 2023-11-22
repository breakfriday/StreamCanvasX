
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import RTCPlayerService from '../webrtc';


@injectable()
class VideoService {
    playerService: RTCPlayerService;
    resizeObserver: ResizeObserver;
    meidiaEl: HTMLVideoElement;
    constructor() {

    }

    init(playerService: RTCPlayerService) {
       this.playerService = playerService;
       let { config } = this.playerService;
    //    debugger;
       this.start();


        // this.initgl();
    }

    start() {
        let { contentEl } = this.playerService.config;
        this.render();
        if (contentEl) {
          this.event();
        }
    }

    event() {
        let { contentEl } = this.playerService.config;

        this.resizeObserver = new ResizeObserver(() => {
            setTimeout(() => {
               this.setVideoSize();
            }, 20);
          });

          this.resizeObserver.observe(contentEl);
      }


    setVideoSize() {
        let { contentEl } = this.playerService.config;
        let height = 200;
        let width = 400;

        // if (this.playerService.config.useOffScreen == true) {
        //   return false;
        // }


        if (contentEl) {
          height = contentEl.clientHeight;
          width = contentEl.clientWidth;
        }

        //   this.meidiaEl.width = width;

        //  this.meidiaEl.height = height;
        this.meidiaEl.style.width = '100%';
        this.meidiaEl.style.height = '100%';
    }

    render() {
        let { contentEl } = this.playerService.config;
        this.meidiaEl = document.createElement('video');
        // this.meidiaEl.style.position = 'absolute';
        // this.meidiaEl.style.top = '0px';
        // this.meidiaEl.style.left = '0px';
        this.meidiaEl.autoplay = true;
        contentEl.append(this.meidiaEl);
    }

    play() {
        this.meidiaEl.play();
    }
    pause() {
        this.meidiaEl.pause();
    }
}


export default VideoService;