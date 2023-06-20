import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import Emitter from '../../utils/emitter';

import { ServiceA } from '../ServiceA';
import { TYPES } from '../../serviceFactories/symbol';
import HttpFlvStreamService from '../stream/fetch_stream_loader';
import FlvDemuxService from '../demux/flvDemux';
import { DEFAULT_PLAYER_OPTIONS } from '../../constant';
import WebcodecsDecoderService from '../decoder/webcodecs';
import CanvasVideoService from '../video/canvasVideoService';
import DebugLogService from '../DebugLogService';
import FLVDemuxStream from '../demux/flvDemuxStream';
import { UseMode } from '../../constant';
import mpegts from 'mpegts.js';
import Mpegts from 'mpegts.js';
import { IplayerConfig } from '../../types/services';
import { runInThisContext } from 'vm';

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
    canvasVideoService: CanvasVideoService;
    debugLogService: DebugLogService;
    fLVDemuxStream: FLVDemuxStream;
    mpegtsPlayer: Mpegts.Player;
    private _stats: Stats;
    private _startBpsTime?: number;
    _opt: any;
    _times: any;
    constructor(

        @inject(TYPES.IHttpFlvStreamLoader) httpFlvStreamService: HttpFlvStreamService,
        @inject(TYPES.IFLVDemuxService) flvVDemuxService: FlvDemuxService,
        @inject(TYPES.IWebcodecsDecoderService) webcodecsDecoderService: WebcodecsDecoderService,
        @inject(TYPES.ICanvasVideoService) canvasVideoService: CanvasVideoService,
        @inject(TYPES.IDebugLogService) debugLogService: DebugLogService,
        @inject(TYPES.IFLVDemuxStream) fLVDemuxStream: FLVDemuxStream,
        ) {
        super();
        this.httpFlvStreamService = httpFlvStreamService;
        this.flvVDemuxService = flvVDemuxService;
        this.webcodecsDecoderService = webcodecsDecoderService;
        this.canvasVideoService = canvasVideoService;
        this.debugLogService = debugLogService;
        this.fLVDemuxStream = fLVDemuxStream;
        this._opt = Object.assign({}, DEFAULT_PLAYER_OPTIONS);


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

    init(config?: IplayerConfig) {
        let { model = UseMode.UseCanvas, url = '', contentEl = null } = config;
        this.httpFlvStreamService.init(this, url);
        this.flvVDemuxService.init(this);
        this.webcodecsDecoderService.init(this);
        this.fLVDemuxStream.init(this);
        this.canvasVideoService.init({ parm: model, contentEl });
    }
    createFlvPlayer(parms: { type?: string; isLive?: boolean; url?: string}) {
        let { type = 'flv', isLive = true } = parms;
        let { url } = this.httpFlvStreamService;
        let videoEl = document.createElement('video');
        // document.getElementById('cont').append(videoEl);
        // videoEl.controls = true;
        // videoEl.width = 300;

        if (videoEl) {
          this.mpegtsPlayer = mpegts.createPlayer({
            type: type!, // could also be mpegts, m2ts, flv
            isLive: isLive,
            url: url,
            hasAudio: true,
            hasVideo: true,

          }, { enableStashBuffer: true,
                enableWorker: true,
                liveBufferLatencyChasing: true,
                autoCleanupSourceBuffer: true,
                lazyLoad: false,
         });
          this.mpegtsPlayer.attachMediaElement(videoEl);
        //   this.getVideoSize();
          this.mpegtsPlayer.load();

          this.mpegtsPlayer.on(mpegts.Events.MEDIA_INFO, (parm) => {
            let video_width = parm.metadata.width;
            let video_height = parm.metadata.height;
            // this.metadata = {
            //   video_height, video_width,
            // };
            // this.getVideoSize();
           });

           this.mpegtsPlayer.on(mpegts.Events.ERROR, (error, detailError) => {
            if (error === mpegts.ErrorTypes.NETWORK_ERROR) {
                this.mpegtsPlayer.unload();
                this.mpegtsPlayer.load();
                this.mpegtsPlayer.play();
            }
          });


          this.mpegtsPlayer.on(mpegts.Events.STATISTICS_INFO, (data) => {
            let { speed } = data;

            this.emit('otherInfo', data);
        });


          this.mpegtsPlayer.on(mpegts.Events.METADATA_ARRIVED, (parm) => {
            this.mpegtsPlayer.play();
          });
        }

        // this.canvasVideoService.render(videoEl);
        this.canvasVideoService.createVideoFramCallBack(videoEl);
      }

    destroy() {
        this.mpegtsPlayer.destroy();
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

    // viedeo render 使用webGpu
    video_render(video: HTMLVideoElement) {
        if ('requestVideoFrameCallback' in video) {
            video.requestVideoFrameCallback(() => {
                this.canvasVideoService.renderFrameByWebgpu(video);
            });


            // video.requestVideoFrameCallback(frame);
          } else {

            // requestAnimationFrame(frame);
          }
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
        retry() {
           if (this.mpegtsPlayer) {
             this.mpegtsPlayer.destroy();
           }
        }

        reload() {
            this.mpegtsPlayer.unload();
            this.mpegtsPlayer.load();
            this.mpegtsPlayer.play();
        }
}

export default PlayerService;
