import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import Emitter from '../../utils/emitter';

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
import AudioProcessingService from '../audio/audioContextService';


mpegts.LoggingControl.applyConfig({
    forceGlobalTag: true,
    globalTag: 'streanCanvasX',
    enableDebug: true,
    enableAll: true,
    enableInfo: true,
    enableVerbose: false,
    enableError: true,
    enableWarn: false,

 });

window.streamCanvasX = '0.1.22';
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
    audioProcessingService: AudioProcessingService;
    private _stats: Stats;
    private _startBpsTime?: number;
    _opt: any;
    _times: any;
    reload: any;
    config: IplayerConfig;
    error_connect_times: number;
    constructor(

        @inject(TYPES.IHttpFlvStreamLoader) httpFlvStreamService: HttpFlvStreamService,
        @inject(TYPES.IFLVDemuxService) flvVDemuxService: FlvDemuxService,
        @inject(TYPES.IWebcodecsDecoderService) webcodecsDecoderService: WebcodecsDecoderService,
        @inject(TYPES.ICanvasVideoService) canvasVideoService: CanvasVideoService,
        @inject(TYPES.IDebugLogService) debugLogService: DebugLogService,
        @inject(TYPES.IFLVDemuxStream) fLVDemuxStream: FLVDemuxStream,
        @inject(TYPES.IAudioProcessingService) audioProcessingService: AudioProcessingService,
        ) {
        super();
        this.httpFlvStreamService = httpFlvStreamService;
        this.flvVDemuxService = flvVDemuxService;
        this.webcodecsDecoderService = webcodecsDecoderService;
        this.canvasVideoService = canvasVideoService;
        this.debugLogService = debugLogService;
        this.fLVDemuxStream = fLVDemuxStream;
        this.audioProcessingService = audioProcessingService;
        this._opt = Object.assign({}, DEFAULT_PLAYER_OPTIONS);
        this.error_connect_times = 0;


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
        let { model = UseMode.UseCanvas, url = '', contentEl = null, showAudio = false, hasAudio = true, hasVideo = true, errorUrl = '' } = config;
        this.config = { model, url, contentEl, showAudio, hasAudio, hasVideo, errorUrl };

        this.httpFlvStreamService.init(this, url);
        this.flvVDemuxService.init(this);
        this.webcodecsDecoderService.init(this);
        this.fLVDemuxStream.init(this);
        this.canvasVideoService.init(this, { model: model, contentEl });


        this.debounceReload();
    }
    createFlvPlayer(parms: { type?: string; isLive?: boolean; url?: string}) {
        let { type = 'flv', isLive = true } = parms;
        let { url } = this.httpFlvStreamService;
        let videoEl = document.createElement('video');
        // document.getElementById('cont').append(videoEl);
        // videoEl.controls = true;
        // videoEl.width = 300;

        let { showAudio, hasAudio, hasVideo } = this.config;

        console.log('-----player config--------');
        console.info(this.config);
        console.log('------player config-------');


        if (hasAudio === true) {
            this.audioProcessingService.init(this, { media_el: videoEl });
            this.audioProcessingService.mute(true);
        }


        // this.audioProcessingService.init(this, { media_el: videoEl });

        if (videoEl) {
            if (showAudio === true) {
                this.mpegtsPlayer = mpegts.createPlayer({
                    type: type!, // could also be mpegts, m2ts, flv
                    isLive: isLive,
                    url: url,
                    hasAudio: hasAudio,
                    hasVideo: hasVideo,

                  }, {
                 });
            } else {
                this.mpegtsPlayer = mpegts.createPlayer({
                    type: type!, // could also be mpegts, m2ts, flv
                    isLive: isLive,
                    url: url,
                    hasAudio: hasAudio,
                    hasVideo: hasVideo,

                  }, { enableStashBuffer: false,
                        enableWorker: true,
                        liveBufferLatencyChasing: true,
                        liveBufferLatencyMaxLatency: 1, // seconds.
                        autoCleanupSourceBuffer: true,
                        autoCleanupMaxBackwardDuration: 5, // seconds.
                        lazyLoad: false,
                        liveBufferLatencyMinRemain: 0.1,
                        lazyLoadMaxDuration: 4, // seconds.
                 });
            }

          this.mpegtsPlayer.attachMediaElement(videoEl);
        //   this.getVideoSize();
          this.mpegtsPlayer.load();

          this.canvasVideoService.drawLoading();

          this.mpegtsPlayer.on(mpegts.Events.MEDIA_INFO, (parm) => {
            let video_width = parm.metadata.width;
            let video_height = parm.metadata.height;
            // this.metadata = {
            //   video_height, video_width,
            // };
            // this.getVideoSize();
           });

           this.mpegtsPlayer.on(mpegts.Events.ERROR, (error, detailError) => {
            console.log('---------');
            console.info(error);
            console.log('---------');
            if (error === mpegts.ErrorTypes.NETWORK_ERROR || error === mpegts.ErrorTypes.MEDIA_ERROR) {
                setTimeout(() => {
                    this.reload2();
                }, 8 * 1000);
            }
          });


          this.mpegtsPlayer.on(mpegts.Events.STATISTICS_INFO, (data) => {
            let { speed, decodedFrames } = data;

            if (speed <= 1) {
                // this.reload();
                this.reload();
            } else {
                if (decodedFrames > 0 || hasVideo === false) {
                    this.canvasVideoService.loading = false;
                    this.httpFlvStreamService.hertTime = 0;
                }
            }


            this.emit('otherInfo', data);
        });


          this.mpegtsPlayer.on(mpegts.Events.METADATA_ARRIVED, (parm) => {
            // this.canvasVideoService.loading = false;
            // this.httpFlvStreamService.hertTime = 0;
            this.mpegtsPlayer.play();
          });
        }


        if (showAudio === false) {
            // this.canvasVideoService.render(videoEl);
            this.canvasVideoService.createVideoFramCallBack(videoEl);
        } else {
            this.audioProcessingService.visulizerDraw1();
        }
      }

    destroy() {
        if (this.canvasVideoService) {
            this.canvasVideoService.destroy();
        }

        if (this.mpegtsPlayer) {
            this.mpegtsPlayer.destroy();
        }
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


    throttle(fn: Function, delay: number) {
        let _start = Date.now();
        return (...args: any[]) => {
          let _now = Date.now();
          let self = this;
          let _args = args;
             if (_now - _start >= delay) {
            fn.apply(self, _args);
            _start = Date.now();
          }
        };
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

        reload2() {
            this.error_connect_times++;
            if (this.error_connect_times >= 3) {
               this.canvasVideoService.loading = false;
               this.setError();
               return false;
            }
            this.mpegtsPlayer.unload();
            this.mpegtsPlayer.load();
            this.canvasVideoService.drawLoading();
            setTimeout(() => {
                this.mpegtsPlayer.play();
            }, 200);
        }

        setError() {
            this.canvasVideoService.loading = false;
            this.mpegtsPlayer.pause();
            this.mpegtsPlayer.unload();
            // this.mpegtsPlayer.destroy();
            if (this.config.showAudio === true) {
                this.audioProcessingService.clearCanvas();
            } else {
               this.canvasVideoService.clearCanvas();
            }

            this.canvasVideoService.drawError();
        }

        debounceReload() {
            let $this = this;

           this.reload = this.throttle(() => {
            //    this.canvasVideoService.drawLoading();
                this.httpFlvStreamService.hertTime++;
                if (this.httpFlvStreamService.hertTime > this.httpFlvStreamService.maxHeartTimes) {
                    console.log('超过最大重连次数');
                    this.setError();
                    return false;
                }
                $this.mpegtsPlayer.unload();
                $this.mpegtsPlayer.load();
                setTimeout(() => {
                    $this.mpegtsPlayer.play();
                }, 200);
                // $this.mpegtsPlayer.play();
            }, 15 * 1000);
        }

        // reload() {
        //     let $this = this;
        //     debugger;
        //     let debounceReload = fpdebounce(() => {
        //         $this.mpegtsPlayer.unload();
        //         $this.mpegtsPlayer.load();
        //         $this.mpegtsPlayer.play();
        //     })(10 * 1000);
        //     debugger;
        //     return debounceReload;
        // }
}

export default PlayerService;
