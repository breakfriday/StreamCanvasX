import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import Emitter from '../../utils/emitter';

import { ServiceA } from '../ServiceA';
import { TYPES } from '../../serviceFactories/symbol';
import HttpFlvStreamService from '../stream/fetch_stream_loader';
import FlvDemuxService from '../demux/flvDemux';
import { DEFAULT_PLAYER_OPTIONS } from '../../constant';
import WebcodecsDecoderService from '../decoder/webcodecs';


function now() {
    return new Date().getTime();
}

type Stats = {
    ts?: number;
    buf?: number;
    fps: number;
    abps: number;
    vbps: number;
};

@injectable()
class PlayerService extends Emitter {
    httpFlvStreamService: HttpFlvStreamService;
    flvVDemuxService: FlvDemuxService;
    webcodecsDecoderService: WebcodecsDecoderService;
    private _stats: Stats;
    private _startBpsTime?: number;
    _opt: any;
    _times: any;
    constructor(

        @inject(TYPES.IHttpFlvStreamLoader) httpFlvStreamService: HttpFlvStreamService,
        @inject(TYPES.IFLVDemuxService) flvVDemuxService: FlvDemuxService,
        @inject(TYPES.IWebcodecsDecoderService) webcodecsDecoderService: WebcodecsDecoderService,
        ) {
        super();
        this.httpFlvStreamService = httpFlvStreamService;
        this.flvVDemuxService = flvVDemuxService;
        this.webcodecsDecoderService = webcodecsDecoderService;
        this._opt = Object.assign({}, DEFAULT_PLAYER_OPTIONS);
        this.init();

        this._times = {
            playInitStart: '', // 1
            playStart: '', // 2
            streamStart: '', // 3
            streamResponse: '', // 4
            demuxStart: '', // 5
            decodeStart: '', // 6
            videoStart: '', // 7
            playTimestamp: '', // playStart- playInitStart
            streamTimestamp: '', // streamStart - playStart
            streamResponseTimestamp: '', // streamResponse - streamStart_times
            demuxTimestamp: '', // demuxStart - streamResponse
            decodeTimestamp: '', // decodeStart - demuxStart
            videoTimestamp: '', // videoStart - decodeStart
            allTimestamp: '', // videoStart - playInitStart
        };

        this._stats = {
            buf: 0, // 当前缓冲区时长，单位毫秒,
            fps: 0, // 当前视频帧率
            abps: 0, // 当前音频码率，单位bit
            vbps: 0, // 当前视频码率，单位bit
            ts: 0, // 当前视频帧pts，单位毫秒
        };
    }

    init() {
        this.httpFlvStreamService.init(this);
        this.flvVDemuxService.init(this);
        this.webcodecsDecoderService.init(this);
    }
    log() {
        alert(22);
    }
    fetchstrean(url: string) {
        this.httpFlvStreamService.fetchStream(url);
    }

    play(url: string) {
        this.httpFlvStreamService.fetchStream(url);
    }

        //
    updateStats(options: any) {
            options = options || {};

            if (!this._startBpsTime) {
                this._startBpsTime = now();
            }

            // if (isNotEmpty(options.ts)) {
            //     this._stats.ts = options.ts;
            // }

            // if (isNotEmpty(options.buf)) {
            //     this._stats.buf = options.buf;
            // }

            if (options.fps) {
                this._stats.fps += 1;
            }
            if (options.abps) {
                this._stats.abps += options.abps;
            }
            if (options.vbps) {
                this._stats.vbps += options.vbps;
            }

            const _nowTime = now();
            const timestamp = _nowTime - this._startBpsTime;

            if (timestamp < 1 * 1000) {
                return;
            }

            // this.emit(EVENTS.stats, this._stats);
            // this.emit(EVENTS.performance, fpsStatus(this._stats.fps));
            this._stats.fps = 0;
            this._stats.abps = 0;
            this._stats.vbps = 0;
            this._startBpsTime = _nowTime;
        }
}

export default PlayerService;
