import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import Emitter from '../../utils/emitter';
import YuvEnging from './render/yunEngine';
import { IBridgePlayerConfig } from '../../types/services';
import MediaRenderEngine from './render';
import { TYPES } from '../../serviceFactories/symbol';

@injectable()
class StreamBridgePlayer extends Emitter {
    config: IBridgePlayerConfig
    yuvEngine: YuvEnging;
    mediaRenderEngine: MediaRenderEngine
    constructor(
        @inject(TYPES.IMediaRenderEngine) mediaRenderEngine: MediaRenderEngine,
    ) {
        super();
        this.mediaRenderEngine=mediaRenderEngine;
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
}

export default StreamBridgePlayer;
