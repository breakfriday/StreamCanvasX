import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import Emitter from '../../utils/emitter';
import YuvEnging from './render/yunEngine';
import { IBridgePlayerConfig } from '../../types/services';
import MediaRenderEngine from './render';
import { TYPES } from '../../serviceFactories/symbol';
import StreamIo from './streamIo';

@injectable()
class StreamBridgePlayer extends Emitter {
    config: IBridgePlayerConfig
    yuvEngine: YuvEnging;
    mediaRenderEngine: MediaRenderEngine
    streamIo: StreamIo
    canvasToVideoSerivce: any
    constructor(
        @inject(TYPES.IMediaRenderEngine) mediaRenderEngine: MediaRenderEngine,
        @inject(TYPES.IStreamIo) streamIo: StreamIo,
    ) {
        super();
        this.mediaRenderEngine=mediaRenderEngine;
        this.streamIo=streamIo;
    }
    init(config: IBridgePlayerConfig) {
        this.config=config;
        if(this.config.rtspUrl) {
            this.config.url=this.config.rtspUrl;
        }
        this.initPlugin();

        // for hook
        this.canvasToVideoSerivce={
            setCover: this.setCover,
            drawRotate: this.drawRotate

        };
        // this.mediaRenderEngine.init(this);
    }

    initPlugin() {
        // this.yuvEngine=new YuvEnging();
        // this.yuvEngine.init(this);
        this.streamIo.init(this);
        this.mediaRenderEngine.init(this);
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
    }
    setCover(parm: boolean) {
        try{
             this?.mediaRenderEngine?.yuvEngine.setCover(parm);
        }catch(e) {

        }
    }
    drawRotate(degree?: number) {
        try{
            this?.mediaRenderEngine?.yuvEngine.drawRotate(degree);
       }catch(e) {

       }
    }
}

export default StreamBridgePlayer;
