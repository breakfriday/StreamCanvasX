
import Emitter from '../../utils/emitter';
import { Idemux } from '../../types/services/index';
import BaseDemux from './baseDemux';
const MEDIA_TYPE = {
    audio: 1,
    video: 2,
};

const FLV_MEDIA_TYPE = {
    audio: 8,
    video: 9,
};


  interface IPlayer {
    debug: any;
    _opt: any;
    decoderWorker: any;
    webcodecsDecoder: any;
    mseDecoder: any;
  }


class fLVDemux extends BaseDemux {
    private flvDemux: (data: ArrayBuffer) => void;
    private input: Generator<number>;
    constructor(player: any) {
        super(player);
        this.input = this._inputFlv();
        this.flvDemux = this.dispatchFlvData(this.input);
        player.debug.log('FlvDemux', 'init');
    }

    dispatchFlvData(input: Generator<number>) {
        let need = input.next();
        let buffer: Uint8Array = null;
        return (value: ArrayBuffer) => {
            let data = new Uint8Array(value);
            if (buffer) {
                let combine = new Uint8Array(buffer.length + data.length);
                combine.set(buffer);
                combine.set(data, buffer.length);
                data = combine;
                buffer = null;
            }
            while (data.length >= need.value) {
                let remain = data.slice(need.value);
                need = input.next(data.slice(0, need.value));
                data = remain;
            }
            if (data.length > 0) {
                buffer = data;
            }
        };
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
}


export { fLVDemux };