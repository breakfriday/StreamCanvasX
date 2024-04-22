import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import Emitter from '../../utils/emitter';
import YuvEnging from './render/yunEngine';
import { IBridgePlayerConfig } from '../../types/services';
import MediaRenderEngine from './render';
import { TYPES } from '../../serviceFactories/symbol';
import StreamIo from './streamIo';
import AudioPlayer from './audio';

@injectable()
class StreamBridgePlayer extends Emitter {
    config: IBridgePlayerConfig
    yuvEngine: YuvEnging;
    mediaRenderEngine: MediaRenderEngine
    streamIo: StreamIo
    canvasVideoService: any
    audioProcessingService: AudioPlayer
    constructor(
        @inject(TYPES.IMediaRenderEngine) mediaRenderEngine: MediaRenderEngine,
        @inject(TYPES.IStreamIo) streamIo: StreamIo,
        @inject(TYPES.IAudioPlayer) audioProcessingService: AudioPlayer,
    ) {
        super();
        this.mediaRenderEngine=mediaRenderEngine;
        this.streamIo=streamIo;
        this.audioProcessingService=audioProcessingService;
    }
    init(config: IBridgePlayerConfig) {
        this.config=config;
        if(this.config.rtspUrl) {
            this.config.url=this.config.rtspUrl;
        }
        this.initPlugin();

        let $this=this;
        // for hook
        this.canvasVideoService={
            setCover: (parm: boolean) => {
                this.setCover(parm);
            },
            drawRotate: (degree: number) => {
                this.drawRotate(degree);
            },
            rotateReset: () => {


            }

        };
        // this.mediaRenderEngine.init(this);
    }

    initPlugin() {
        // this.yuvEngine=new YuvEnging();
        // this.yuvEngine.init(this);
        this.streamIo.init(this);
        this.mediaRenderEngine.init(this);
        this.audioProcessingService.init(this);
    }
    createPlayer() {
        this.play();
    }
    fetchStream() {

    }

    start() {
        // this.yuvEngine.render();
    }

    // for hook
    createFlvPlayer() {
        this.play();
    }

    play() {
        this.mediaRenderEngine.drawLoading();

        this.streamIo.open();
    }
    abort() {
        this.streamIo.abort();
    }

    destroy() {
        this.streamIo.destroy();
        this.mediaRenderEngine.destroy();
        this.audioProcessingService.destroy();
    }
    setCover(parm: boolean) {
        try{
            debugger;
             this?.mediaRenderEngine?.yuvEngine.setCover(parm);
        }catch(e) {

        }
    }
    drawRotate(degree?: number) {
        degree=Number(degree);
        try{
            this?.mediaRenderEngine?.yuvEngine.drawRotate(degree);
       }catch(e) {

       }
    }
    mute() {

    }
}

export default StreamBridgePlayer;
