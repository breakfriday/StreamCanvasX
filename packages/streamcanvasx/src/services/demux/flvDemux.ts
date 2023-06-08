
const MEDIA_TYPE = {
    audio: 1,
    video: 2,
};

const FLV_MEDIA_TYPE = {
    audio: 8,
    video: 9,
};

const WORKER_CMD_TYPE = {
    init: 'init',
    initVideo: 'initVideo',
    render: 'render',
    playAudio: 'playAudio',
    initAudio: 'initAudio',
    kBps: 'kBps',
    decode: 'decode',
    audioCode: 'audioCode',
    videoCode: 'videoCode',
    wasmError: 'wasmError',
};

interface IData {
    ts: number;
    cts?: number;
    payload: Uint8Array;
    type: number;
    isIFrame?: boolean;
  }


  interface IPlayer {
    debug: any;
    _opt: any;
    decoderWorker: any;
    webcodecsDecoder: any;
    mseDecoder: any;
  }


class fLVDemux {
    private player: IPlayer;
    private stopId: any;
    private firstTimestamp: number | null;
    private startTimestamp: number | null;
    private delay: number;
    private bufferList: IData[];
    private dropping: boolean;
    private flvDemux: (data: ArrayBuffer) => void;
    private input: Generator<number>;
    constructor() {
        super();
        this.player = player;

        this.stopId = null;
        this.firstTimestamp = null;
        this.startTimestamp = null;
        this.delay = -1;
        this.bufferList = [];
        this.dropping = false;
        this.flvDemux = this.dispatchFlvData(this.input);

        this.player.debug.log('FlvDemux', 'init');
    }

    // 负责将提取的音频或视频负载数据解码。
    _doDecode(data: IData) {
       let { payload, type, ts, isIFrame, cts } = data;
        const { player } = this;
        let options = {
            ts: ts,
            cts: cts,
            type: type,
            isIFrame: false,
        };
        // use offscreen
        if (player._opt.useWCS && !player._opt.useOffscreen) {
            if (type === MEDIA_TYPE.video) {
                options.isIFrame = isIFrame;
            }
            this.pushBuffer(payload, options);
        } else if (player._opt.useMSE) {
            // use mse
            if (type === MEDIA_TYPE.video) {
                options.isIFrame = isIFrame;
            }
            this.pushBuffer(payload, options);
        } else {
            //
            if (type === MEDIA_TYPE.video) {
                player.decoderWorker && player.decoderWorker.decodeVideo(payload, ts, isIFrame);
            } else if (type === MEDIA_TYPE.audio) {
                if (player._opt.hasAudio) {
                    player.decoderWorker && player.decoderWorker.decodeAudio(payload, ts);
                }
            }
        }
    }


    _doDecoderDecode(data) {
        const { player } = this;
        const { webcodecsDecoder, mseDecoder } = player;

        if (data.type === MEDIA_TYPE.audio) {
            if (player._opt.hasAudio) {
                player.decoderWorker && player.decoderWorker.decodeAudio(data.payload, data.ts);
            }
        } else if (data.type === MEDIA_TYPE.video) {
            if (player._opt.useWCS && !player._opt.useOffscreen) {
                webcodecsDecoder.decodeVideo(data.payload, data.ts, data.isIFrame);
            } else if (player._opt.useMSE) {
                mseDecoder.decodeVideo(data.payload, data.ts, data.isIFrame, data.cts);
            }
        }
    }
    * _inputFlv(): Generator<number, void, undefined> {
        yield 9;
        const tmp = new ArrayBuffer(4);
        const tmp8 = new Uint8Array(tmp);
        const tmp32 = new Uint32Array(tmp);
        const { player } = this;

        while (true) {
            tmp8[3] = 0;
            const t: Uint8Array = yield 15;
            const type = t[4];
            tmp8[0] = t[7];
            tmp8[1] = t[6];
            tmp8[2] = t[5];
            const length = tmp32[0];
            tmp8[0] = t[10];
            tmp8[1] = t[9];
            tmp8[2] = t[8];
            let ts = tmp32[0];
            if (ts === 0xFFFFFF) {
                tmp8[3] = t[11];
                ts = tmp32[0];
            }
            const payload = yield length;
            switch (type) {
                case FLV_MEDIA_TYPE.audio:
                    if (player._opt.hasAudio) {
                        player.updateStats({
                            abps: payload.byteLength,
                        });
                        if (payload.byteLength > 0) {
                            this._doDecode(payload, MEDIA_TYPE.audio, ts);
                        }
                    }
                    break;
                case FLV_MEDIA_TYPE.video:
                    if (!player._times.demuxStart) {
                        player._times.demuxStart = now();
                    }
                    if (player._opt.hasVideo) {
                        player.updateStats({
                            vbps: payload.byteLength,
                        });
                        const isIFrame = payload[0] >> 4 === 1;
                        if (payload.byteLength > 0) {
                            const tmp32 = new Uint32Array(payload.buffer, 2, 1);
                            let cts = tmp32[0];

                            this._doDecode(payload, MEDIA_TYPE.video, ts, isIFrame, cts);
                        }
                    }
                    break;
            }
        }
    }

    // 用于向缓冲队列中添加音频或视频数据。
    pushBuffer(payload: any, options: any) {
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
}


export { fLVDemux };