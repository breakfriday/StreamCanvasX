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
        this.yuvEngine=new YuvEnging();
        this.yuvEngine.init(this);
    }
    createPlayer() {


    }
    fetchStream() {

    }

    start() {
        this.yuvEngine.render();
    }

    play() {
        this.streamIo.open();
    }
    abort() {
        this.streamIo.abort();
    }
}

export default StreamBridgePlayer;
