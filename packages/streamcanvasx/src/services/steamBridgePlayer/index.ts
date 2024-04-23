import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import Emitter from '../../utils/emitter';
import YuvEnging from './render/yunEngine';
import { IBridgePlayerConfig } from '../../types/services';
import MediaRenderEngine from './render';
import { TYPES } from '../../serviceFactories/symbol';
import StreamIo from './streamIo';
import AudioPlayer from './audio';
import Scheduler from '../player/util/scheduler';
@injectable()
class StreamBridgePlayer extends Emitter {
    config: IBridgePlayerConfig
    yuvEngine: YuvEnging;
    mediaRenderEngine: MediaRenderEngine
    streamIo: StreamIo
    canvasVideoService: any
    audioProcessingService: AudioPlayer
    scheduler: Scheduler;
    error_connect_times: number;
    maxErrorTimes: number
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
        this.scheduler = new Scheduler(1);
        this.maxErrorTimes=1000000;
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
    checkPlaying() {
        let { heartCheck } = this.streamIo._ioLoader.streamSocketClient;
        if(heartCheck===true) {
            this.mediaRenderEngine.clearLoading();
        }
        return heartCheck;
    }

    addReloadTask(parm?: {arr_msg?: Array<string>}) {
        if (this.error_connect_times > this.maxErrorTimes) {
          //  console.log("error_connect_times > 4: Scheduler clearQueu  "+this.config.url)
            // this.scheduler.clearQueue();
            return false;
        }

        let queue = this.scheduler.getQueue();
        if (queue.length > 10) {
           // console.log("task > 10 addTask false "+this.config.url)
            return false;
        }
        this.scheduler.addTask(() => {
            let { arr_msg = [''] } = parm;
            // this.canvasVideoService.drawLoading();
            this.mediaRenderEngine.drawLoading();
            console.log('=======tasking=======');
             console.log("reload");
            console.log('=======tasking=======');
             this.reload();
            return new Promise(resolve => setTimeout(() => {
                if (this.checkPlaying()) {
                    this.error_connect_times = 0;
                    resolve('clean');
                } else {
                    resolve('');
                }
                }, 10000)); // 已10s 的速度均衡执行reload 任务
             });
    }

    reload() {
        this.streamIo._ioLoader.reload();
    }
}

export default StreamBridgePlayer;
