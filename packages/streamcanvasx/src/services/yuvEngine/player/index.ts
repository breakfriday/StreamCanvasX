import YuvEnging from '../render/index';

interface Iconfig {
    contentEl: HTMLElement;
    frameWidth: number;
    frameHeight: number;


}
class Player {
    config: Iconfig
    yuvEngine: YuvEnging;
    constructor(config: Iconfig) {
        this.init(config);
    }
    init(config: Iconfig) {
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

export default Player;