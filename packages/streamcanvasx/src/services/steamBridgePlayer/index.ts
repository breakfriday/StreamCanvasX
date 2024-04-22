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
        this.initPlugin();
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
}

export default StreamBridgePlayer;
