import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { injectable } from 'inversify';
import mpegts from 'mpegts.js';
let mainPlayerService = class mainPlayerService {
    get _vedio() {
        return this.video;
    }
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
    setConfig(params) {
        this.config = Object.assign({}, this.config, params);
    }
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
    vedioEvents() {
        this.loadMediaEvent();
        this.video.addEventListener('play', ()=>{
            requestAnimationFrame(this.analyzeCanvas.bind(this));
        }, false);
    }
    loadMediaEvent() {
        const video_el = this.video;
        if (video_el) {
            video_el.addEventListener('loadedmetadata', ()=>{
                let { videoHeight , videoWidth  } = video_el;
                // 计算最大公约数 （数学上求最大公约数的方法是“辗转相除法”，就是用一个数除以另一个数（不需要知道大小），取余数，再用被除数除以余数再取余，再用新的被除数除以新的余数再取余，直到余数为0，最后的被除数就是最大公约数）
                function gcd(a, b) {
                    return b === 0 ? a : gcd(b, a % b);
                }
                let greatestCommonDivisor = gcd(videoWidth, videoHeight);
                // 计算宽高比
                let aspectRatioWidth = videoWidth / greatestCommonDivisor;
                let aspectRatioHeight = videoHeight / greatestCommonDivisor;
                let ratio = `${aspectRatioWidth}:${aspectRatioHeight}`;
                this.aspectRatio = aspectRatioWidth / aspectRatioHeight;
                console.log('------------------------');
                console.log(ratio);
                console.log('------------------------');
            });
        }
    }
    setVideoSize() {
        let height = this.root_el.clientHeight;
        let width = this.root_el.clientWidth;
        this.video.height = height;
        this.video.width = width;
    }
    analyzeCanvas() {
        if (this.video.ended || this.video.paused) {
            return;
        }
        this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height / this.aspectRatio);
        // 背景色域渐变
        const { data: [r, g, b]  } = this.context.getImageData(0, 0, 1, 1);
        // document.body.style.cssText = `background: rgb(${r}, ${g}, ${b});`;
        requestAnimationFrame(this.analyzeCanvas.bind(this));
    }
    constructor(parmams){
        _define_property(this, "video", void 0);
        _define_property(this, "canvas", void 0);
        _define_property(this, "context", void 0);
        _define_property(this, "mpegtsPlayer", void 0);
        _define_property(this, "root_el", void 0);
        _define_property(this, "aspectRatio", void 0);
        _define_property(this, "config", void 0);
        // this.video = parmams.vedio_el;
        this.video = document.createElement('video');
        this.video.controls = true;
        this.canvas = parmams.canvas_el;
        this.root_el = parmams.root_el;
        this.config = parmams.config || {};
        if (this.canvas) {
            this.context = this.canvas.getContext('2d');
        }
        this.root_el.innerHTML = '';
        this.root_el.appendChild(this.video);
        this.setVideoSize();
        this.vedioEvents();
    }
};
mainPlayerService = _ts_decorate([
    injectable()
], mainPlayerService);
export default mainPlayerService;

 //# sourceMappingURL=mainCanvasPlayer.js.map