import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import Emitter from '../../utils/emitter';
import YuvEnging from './render/index';
import { IBridgePlayerConfig } from '../../types/services';


@injectable()
class StreamBridgePlayer extends Emitter {
    config: IBridgePlayerConfig
    yuvEngine: YuvEnging;
    constructor() {
        super();
    }
    init(config: IBridgePlayerConfig) {
        this.config=config;
        this.initPlugin();
    }

    initPlugin() {
        this.yuvEngine=new YuvEnging();
        this.yuvEngine.init(this);
    }

    start() {
        this.yuvEngine.render();
    }
}

export default StreamBridgePlayer;
