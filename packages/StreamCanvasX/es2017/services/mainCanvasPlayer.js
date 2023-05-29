import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { injectable } from 'inversify';
import mpegts from 'mpegts.js';
let mainPlayerService = class mainPlayerService {
    createFlvPlayer(parms) {
        let { type , isLive , url  } = parms;
        let videoEl = this.video;
        if (videoEl) {
            this.mpegtsPlayer = mpegts.createPlayer({
                type: type,
                isLive: isLive,
                url: url,
                hasAudio: true
            });
            this.mpegtsPlayer.attachMediaElement(videoEl);
            this.mpegtsPlayer.load();
            this.mpegtsPlayer.play();
            this.mpegtsPlayer.on(mpegts.Events.ERROR, (error, detailError)=>{
                if (error === mpegts.ErrorTypes.NETWORK_ERROR) {
                    if (detailError === mpegts.ErrorDetails.NETWORK_UNRECOVERABLE_EARLY_EOF) {
                        this.reoload();
                    }
                    if (detailError === mpegts.ErrorDetails.NETWORK_TIMEOUT) {
                        return false;
                    }
                }
            });
        }
    }
    setConfig() {}
    load() {
        this.mpegtsPlayer.load();
    }
    play() {
        this.mpegtsPlayer.play();
    }
    paused() {
        this.mpegtsPlayer.pause();
    }
    reoload() {
        this.mpegtsPlayer.unload();
        this.mpegtsPlayer.detachMediaElement();
        this.mpegtsPlayer.attachMediaElement(this.video);
        this.mpegtsPlayer.load();
        this.mpegtsPlayer.play();
    }
    set_blob_url(filedata) {
        let blobUrl = URL.createObjectURL(filedata);
        this.video.src = blobUrl;
        this.video.load();
    }
    analyzeCanvas() {
        if (this.video.ended || this.video.paused) {
            return;
        }
        this.context.drawImage(this.video, 0, 0, 800, 800);
        const { data: [r, g, b]  } = this.context.getImageData(0, 0, 1, 1);
        document.body.style.cssText = `background: rgb(${r}, ${g}, ${b});`;
        requestAnimationFrame(this.analyzeCanvas.bind(this));
    }
    constructor(parmams){
        _define_property(this, "video", void 0);
        _define_property(this, "canvas", void 0);
        _define_property(this, "context", void 0);
        _define_property(this, "mpegtsPlayer", void 0);
        this.video = parmams.vedio_el;
        this.canvas = parmams.canvas_el;
        if (this.canvas) {
            this.context = this.canvas.getContext('2d');
        }
        this.video.addEventListener('play', ()=>{
            requestAnimationFrame(this.analyzeCanvas.bind(this));
        }, false);
    }
};
mainPlayerService = _ts_decorate([
    injectable()
], mainPlayerService);
export default mainPlayerService;

 //# sourceMappingURL=mainCanvasPlayer.js.map