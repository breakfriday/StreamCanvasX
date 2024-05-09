
import YuvEngine from './renderEngin';
import { MessageType } from '../const';
class Singleton {
    private static instance: Singleton | null = null;
    yuvEngine: YuvEngine
    constructor() {
        this.init();
    }
    init() {
        this.yuvEngine=new YuvEngine();

        this.yuvEngine.init();
        debugger;
    }

    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }


    onMessage(event: MessageEvent<any>) {
        let { type,data } =event.data;
        if(type==MessageType.RENDER_FRAME) {
            debugger;
        }else{

        }
    }
}


export default Singleton;