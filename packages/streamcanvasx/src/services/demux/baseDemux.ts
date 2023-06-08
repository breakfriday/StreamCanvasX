import Emitter from '../../utils/emitter';
import IPlayer from '../../player/index';
import { Idemux } from '../../types/services/index';
const MEDIA_TYPE = {
    audio: 1,
    video: 2,
};

interface IData {
    ts: number;
    cts?: number;
    payload: Uint8Array;
    type: number;
    isIFrame?: boolean;
  }


export default class BaseDemux extends Emitter {
     firstTimestamp: number | null;
     startTimestamp: number | null;
     stopId: NodeJS.Timer | null;
     delay: number;
     bufferList: IData[];
     dropping: boolean;
     player: IPlayer;

    constructor(player: IPlayer) {
        super();
        this.player = player;


        this.stopId = null;
        this.firstTimestamp = null;
        this.startTimestamp = null;
        this.delay = -1;
        this.bufferList = [];
        this.dropping = false;
        this.initInterval();
    }

    destroy() {
        if (this.stopId) {
            clearInterval(this.stopId);
            this.stopId = null;
        }
        this.firstTimestamp = null;
        this.startTimestamp = null;
        this.delay = -1;
        this.bufferList = [];
        this.dropping = false;
        this.off();
        this.player.debug.log('CommonDemux', 'destroy');
    }

    getDelay(timestamp) {
        if (!timestamp) {
            return -1;
        }
         // eslint-disable-next-line no-negated-condition
        if (!this.firstTimestamp) {
            this.firstTimestamp = timestamp;
            this.startTimestamp = Date.now();
            this.delay = -1;
        } else {
            if (timestamp) {
                const localTimestamp = (Date.now() - this.startTimestamp);
                const timeTimestamp = (timestamp - this.firstTimestamp);
                if (localTimestamp >= timeTimestamp) {
                    this.delay = localTimestamp - timeTimestamp;
                } else {
                    this.delay = timeTimestamp - localTimestamp;
                }
            }
        }
        return this.delay;
    }

    resetDelay() {
        this.firstTimestamp = null;
        this.startTimestamp = null;
        this.delay = -1;
        this.dropping = false;
    }

    //
    initInterval() {
        this.player.debug.log('common dumex', 'init Interval');
        let _loop = () => {
            let data;

            const { videoBuffer } = this.player._opt;
            const { videoBufferDelay } = this.player._opt;
            if (this.bufferList.length) {
                if (this.dropping) {
                    // this.player.debug.log('common dumex', `is dropping`);
                    data = this.bufferList.shift();
                    if (data.type === MEDIA_TYPE.audio && data.payload[1] === 0) {
                        this._doDecoderDecode(data);
                    }
                    while (!data.isIFrame && this.bufferList.length) {
                        data = this.bufferList.shift();
                        if (data.type === MEDIA_TYPE.audio && data.payload[1] === 0) {
                            this._doDecoderDecode(data);
                        }
                    }
                    // i frame
                    if (data.isIFrame && this.getDelay(data.ts) <= Math.min(videoBuffer, 200)) {
                        this.dropping = false;
                        this._doDecoderDecode(data);
                    }
                } else {
                    data = this.bufferList[0];
                    if (this.getDelay(data.ts) === -1) {
                        // this.player.debug.log('common dumex', `delay is -1`);
                        this.bufferList.shift();
                        this._doDecoderDecode(data);
                    } else if (this.delay > (videoBuffer + videoBufferDelay)) {
                        // this.player.debug.log('common dumex', `delay is ${this.delay}, set dropping is true`);
                        this.resetDelay();
                        this.dropping = true;
                    } else {
                        data = this.bufferList[0];
                        if (this.getDelay(data.ts) > videoBuffer) {
                            // drop frame
                            this.bufferList.shift();
                            this._doDecoderDecode(data);
                        } else {
                            // this.player.debug.log('common dumex', `delay is ${this.delay}`);
                        }
                    }
                }
            }
        };
        _loop();
        this.stopId = setInterval(_loop, 10);
    }

    //    // 负责将提取的音频或视频负载数据解码。
    _doDecode(data: Idemux['IData']) {
        let { payload, type, ts, isIFrame, cts } = data;

        const { player } = this;
        let options = {
            ts: ts,
            cts: cts,
            type: type,
            isIFrame: false,
        };

        if (type === MEDIA_TYPE.video) {
            options.isIFrame = isIFrame;
        }
        this.pushBuffer(payload, options);
    }

    _doDecoderDecode(data: Idemux['IData']) {
        const { player } = this;
        const { webcodecsDecoder } = player;

       if (data.type === MEDIA_TYPE.video) {
           webcodecsDecoder.decodeVideo(data.payload, data.ts, data.isIFrame);
        }
    }

    pushBuffer(payload, options) {
        // 音频
        if (options.type === MEDIA_TYPE.audio) {
            this.bufferList.push({
                ts: options.ts,
                payload: payload,
                type: MEDIA_TYPE.audio,
            });
        } else if (options.type === MEDIA_TYPE.video) {
            this.bufferList.push({
                ts: options.ts,
                cts: options.cts,
                payload: payload,
                type: MEDIA_TYPE.video,
                isIFrame: options.isIFrame,
            });
        }
    }

    close() {

    }
}
