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
import mpegts from 'streamcanvasx-core';
import Mpegts from 'streamcanvasx-core';
import { IplayerConfig } from '../../types/services';
import AudioProcessingService from '../audio/audioContextService';
import WasmDecoderService from '../decoder/wasmDecoder';
import CanvasToVideoSerivce from '../muxer/canvasToVideo';
import MseDecoderService from '../decoder/mediaSource';
import PreProcessing from '../preprocessing';
import Scheduler from './util/scheduler';
import RenderEngine from '../renderingEngines/baseEngine';


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
    mseDecoderService: MseDecoderService;
    preProcessing: PreProcessing;
    renderEngine: RenderEngine;
    private _stats: Stats;
    private _startBpsTime?: number;
    _opt: any;
    _times: any;
    reload: any;
    config: IplayerConfig;
    error_connect_times: number;
    wasmDecoderService: WasmDecoderService;
    player2: any;
    canvasToVideoSerivce: CanvasToVideoSerivce;
    mediaInfo: {
        audioChannelCount?: number;
        audioCodec?: string;
        audioSampleRate?: number;
        videoCodec?: string;
        mimeType?: string;

    };
    meidiaEl: HTMLVideoElement;
    audioEl: HTMLVideoElement;
    scheduler: Scheduler;
    constructor(

        @inject(TYPES.IHttpFlvStreamLoader) httpFlvStreamService: HttpFlvStreamService,
        @inject(TYPES.IFLVDemuxService) flvVDemuxService: FlvDemuxService,
        @inject(TYPES.IWebcodecsDecoderService) webcodecsDecoderService: WebcodecsDecoderService,
        @inject(TYPES.ICanvasVideoService) canvasVideoService: CanvasVideoService,
        @inject(TYPES.IDebugLogService) debugLogService: DebugLogService,
        @inject(TYPES.IFLVDemuxStream) fLVDemuxStream: FLVDemuxStream,
        @inject(TYPES.IAudioProcessingService) audioProcessingService: AudioProcessingService,
        @inject(TYPES.IWasmDecoderService) wasmDecoderService: WasmDecoderService,
        @inject(TYPES.ICanvasToVideoSerivce) canvasToVideoSerivce: CanvasToVideoSerivce,
        @inject(TYPES.IMseDecoderService) mseDecoderService: MseDecoderService,
        @inject(TYPES.IPreProcessing) preProcessing: PreProcessing,
        @inject(TYPES.IRenderEngine) renderEngine: RenderEngine,
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
        this.wasmDecoderService = wasmDecoderService;
        this.canvasToVideoSerivce = canvasToVideoSerivce;
        this.mseDecoderService = mseDecoderService;
        this.preProcessing = preProcessing;
        this.renderEngine = renderEngine;
        this.scheduler = new Scheduler(1);

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
        window.streamCanvasX = window.__VERSION__ || 'DEV_0.1.84';
    }

    init(config?: IplayerConfig) {
        // let { model = UseMode.UseCanvas, url = '', contentEl = null, showAudio = false, hasAudio = true, hasVideo = true, errorUrl = '', useOffScreen = false, audioDraw = 1 } = config;

        const default_config: IplayerConfig = {
            model: UseMode.UseCanvas,
            url: '',
            showAudio: false,
            hasAudio: true,
            hasVideo: true,
            errorUrl: '',
            useOffScreen: false,
            audioDraw: 1,
            updataBufferPerSecond: 15,
            renderPerSecond: 15,
            fftsize: 128,
            bufferSize: 0.2,
            streamType: 'flv',
            isLive: true,
            splitAVBuffers: true,
        };

        function removeNullAndUndefined(obj: any): any {
            let newObj = { ...obj }; // Shallow copy of the object to avoid modifying the original
            Object.keys(newObj).forEach(key => {
                if (newObj[key] === null || newObj[key] === undefined) {
                    delete newObj[key];
                }
            });
            return newObj;
        }
        config = removeNullAndUndefined(config);

        this.config = Object.assign(default_config, config);
        let { model, url, contentEl, useOffScreen, fileData } = this.config;

        if (fileData) {
            let blobUrl = URL.createObjectURL(fileData);
            url = blobUrl;
        }


        // debugger;

        this.httpFlvStreamService.init(this, url);
        this.flvVDemuxService.init(this);
        if (typeof VideoDecoder != 'undefined') this.webcodecsDecoderService.init(this);
        this.fLVDemuxStream.init(this);
        this.canvasVideoService.init(this, { model: model, contentEl, useOffScreen });
        this.canvasToVideoSerivce.init(this);

        if (config.streamType === 'AAC' || config.streamType === 'MP4' || config.streamType === 'MpegTs' || config.streamType === 'MPEG-TS') {
            this.mseDecoderService.init(this);
            this.preProcessing.init(this);
        }
        // this.wasmDecoderService.init();


        // const decode_worker = new Worker(new URL('../decoder/decode_worker.js', import.meta.url));

        this.debounceReload();
    }

    createBetaPlayer() {
        // let videoEl = document.createElement('video');
        // this.meidiaEl = videoEl;
        // this.meidiaEl.autoplay = true;
        // this.meidiaEl.controls = false;

        this.httpFlvStreamService.fetchStream();

         let { hasAudio, showAudio } = this.config;


            let media_el = this.mseDecoderService.$videoElement;
            this.meidiaEl = media_el;

            // debugger;
            this.audioProcessingService.init(this, { media_el: media_el });


            // 此處默認靜音
            // this.audioProcessingService.mute(false);
    }
    createFlvPlayer(parms: { type?: string; isLive?: boolean; url?: string}) {
        if (window.wasmDebug) {
            this.createBetaPlayer2();
            return false;
        }
        let { type = 'flv' } = parms;

        let { isLive, url, fileData, streamType } = this.config;
        if (streamType === 'AAC' || streamType === 'MP4') {
            this.createBetaPlayer();
            return false;
        }

        if (fileData) {
            let blobUrl = URL.createObjectURL(fileData);
            url = blobUrl;
        }


        if (streamType == 'MpegTs' || streamType === 'MPEG-TS') {
            type = 'mpegts';
            isLive = false;
        }


        let videoEl = document.createElement('video');
        this.meidiaEl = videoEl;
        // document.getElementById('cont').append(videoEl);
        // videoEl.controls = true;
        // videoEl.width = 300;

        let { showAudio, hasAudio, hasVideo } = this.config;

        console.log('-----player config--------');
        console.info(this.config);
        console.log('------player config-------');


        // if (hasAudio = true) {
        //     this.audioProcessingService.init(this, { media_el: videoEl });

        //     // 此處默認靜音
        //     this.audioProcessingService.mute(true);
        // }


        // this.audioProcessingService.init(this, { media_el: videoEl });

        if (videoEl) {
            if (showAudio === true) {
                this.audioProcessingService.init(this, { media_el: videoEl });

                // 此處默認靜音
                this.audioProcessingService.mute(true);
                this.mpegtsPlayer = mpegts.createPlayer({
                    type: type!, // could also be mpegts, m2ts, flv
                    isLive: isLive,
                    url: url,
                    hasAudio: hasAudio,
                    hasVideo: false,

                  }, {
                        enableStashBuffer: false,
                        enableWorker: true,
                        liveBufferLatencyChasing: true,
                 });
                 this.mpegtsPlayer.attachMediaElement(videoEl);
            } else {
                this.mpegtsPlayer = mpegts.createPlayer({
                    type: type!, // could also be mpegts, m2ts, flv
                    isLive: isLive,
                    url: url,
                    splitAVBuffers: true,
                    // hasAudio: hasAudio,
                    // hasVideo: hasVideo,

                  }, {

                     enableStashBuffer: false,
                     enableWorker: true,
                     liveBufferLatencyChasing: true,
                     liveBufferLatencyMaxLatency: 1.5,
                     fixAudioTimestampGap: false,
                     autoCleanupSourceBuffer: true,
                    // // autoCleanupMaxBackwardDuration: 5, // seconds.
                    // autoCleanupMinBackwardDuration: 5,
                    // lazyLoad: false,
                    // liveBufferLatencyMinRemain: 0.1,
                    // lazyLoadMaxDuration: 4,
                    // enableWorker: true,
                    // liveBufferLatencyChasing: true,
                    // autoCleanupSourceBuffer: true,
                        // // autoCleanupMaxBackwardDuration: 5, // seconds.
                        //  autoCleanupMinBackwardDuration: 5,
                        // lazyLoad: false,
                        // liveBufferLatencyMinRemain: 0.1,
                        // lazyLoadMaxDuration: 4, // seconds.
                 });
                 let audioEl = document.createElement('video');

                 this.audioEl = audioEl;


                 this.audioProcessingService.init(this, { media_el: audioEl });

                 // 此處默認靜音
                 this.audioProcessingService.mute(true);

                 this.mpegtsPlayer.attachMediaElement(videoEl, audioEl);


                 this.videoEvent(videoEl);
            }

            this.mpegtsPlayer.defatulEvent();


        //   this.getVideoSize();
          this.mpegtsPlayer.load();

          this.canvasVideoService.drawLoading();

        //   window.pp = this.mpegtsPlayer;

        //   this.mpegtsPlayer.on('audio_segment', (data) => {
        //     // let h = data;
        //     // debugger;
        //   });


          if (isLive === false) {
            this.canvasVideoService.loading = false;
            setTimeout(() => {
                // this.mpegtsPlayer.load();

                this.mpegtsPlayer.play();
                this.canvasVideoService.createVideoFramCallBack(videoEl);
            }, 1000);


            return false;
          }


          this.mpegtsPlayer.on(mpegts.Events.MEDIA_INFO, (parm) => {
            let video_width = parm.metadata.width;
            let video_height = parm.metadata.height;

            this.mediaInfo = parm;


            let { hasVideo } = parm;
            let { hasAudio } = parm;

            this.emit('mediaInfo', { hasVideo, hasAudio });

            if (hasVideo === false && this.config.showAudio != true) {
                this.config.showAudio = true;
                this.meidiaEl = null;
                this.audioProcessingService.updateBufferData();
                this.audioProcessingService.render();
                this.audioEvent();
            }


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
            //     this.canvasVideoService.drawLoading();
            //    this.reload2();
               this.addReloadTask({ arr_msg: ['-----reload error-------', `reload: ${error}`, '-----reload error-------'] });
            }
          });

        //   this.mpegtsPlayer.on(mpegts.Events.LOADING_COMPLETE, () => {
        //     setTimeout(() => {
        //         this.reload2();
        //     }, 8 * 1000);
        //   });

        //   const seedFrame = () => {
        //     setTimeout(() => {
        //     let end = this.mpegtsPlayer.buffered.end(0);
        //     let delta = end - this.mpegtsPlayer.currentTime; // 获取buffered与当前播放位置的差值
        //     if (delta > 5 || delta < 0) {
        //          this.mpegtsPlayer.currentTime = this.mpegtsPlayer.buffered.end(0) - 1;
        //       }
        //     }, 9 * 1000);
        //   };
        let lowSpeedStartTime: number | null = null;

          this.mpegtsPlayer.on(mpegts.Events.STATISTICS_INFO, (data) => {
             let { speed, decodedFrames } = data;


            // let end = this.mpegtsPlayer.buffered.end(0);
            // let delta = end - this.mpegtsPlayer.currentTime; // 获取buffered与当前播放位置的差值
            // if (delta > 5 || delta < 0) {
            //      this.mpegtsPlayer.currentTime = this.mpegtsPlayer.buffered.end(0) - 1;
            //   }
            // console.info(end);
            // console.info(this.mpegtsPlayer.buffered);


            // if (speed <= 1) {
            //     if (lowSpeedStartTime === null) {
            //         lowSpeedStartTime = Date.now();
            //     }
            //     if (Date.now() - lowSpeedStartTime >= 80000) {
            //         this.reload2();
            //        lowSpeedStartTime = null; // 重置计时器
            //     }
            //     // this.reload();
            //     // this.reload();
            // } else {
            //     lowSpeedStartTime = null;
            //     if (decodedFrames > 0 || hasVideo === false) {
            //         this.canvasVideoService.loading = false;
            //         this.httpFlvStreamService.hertTime = 0;
            //         this.error_connect_times = 0;
            //     }
            // }

            if (speed <= 1) {
               if (lowSpeedStartTime === null) {
                    lowSpeedStartTime = Date.now();
                }
                if (Date.now() - lowSpeedStartTime >= 15000) {
                    // this.canvasVideoService.drawLoading();

                    // console.log('---heartcheck 异常 流量0 ----');
                    // this.reload2();

                    this.addReloadTask({ arr_msg: ['---heartcheck 异常 流量0 ----'] });
                   lowSpeedStartTime = null; // 重置计时器
                }
            }
            if (speed > 1) {
                lowSpeedStartTime = null;
                this.error_connect_times = 0;
            }

            this.emit('otherInfo', data);
        });


          this.mpegtsPlayer.on(mpegts.Events.METADATA_ARRIVED, (parm) => {
            // this.canvasVideoService.loading = false;
            // this.httpFlvStreamService.hertTime = 0;
            this.canvasVideoService.loading = false;
            let { mseLivePlayback, mseH265Playback } = mpegts.getFeatureList();


            // 12 是H265 , FLV的 解码器id
            if (parm.videocodecid == 12 && mseH265Playback === false) {
                this.destroy();

                console.log('使用jessibuca 軟解码中');

                this.createBetaPlayer2();
            } else {
                console.log('使用 硬解');
                this.mpegtsPlayer.play();
            }
          });
        }


        if (showAudio === false) {
            this.canvasVideoService.createVideoFramCallBack(videoEl);
        }
      }

      videoEvent(videoEl: HTMLVideoElement) {
        let video = videoEl;
        let lastTimeReadyStateBelow3: number | null = null; // 最后一次 readyState 小于3的时间
        const timeoutDuration = 1000; // 检查间隔（毫秒）
        const threshold = 15000; // 阈值（毫秒）
        let $this = this;
        let { url = '' } = this.config;

        function checkVideoState() {
            if ($this.meidiaEl === null) {
                return false;
            }
            // console.log('readystate', video.readyState);
            if (video.readyState < 3) {
                if (lastTimeReadyStateBelow3 === null) {
                    lastTimeReadyStateBelow3 = Date.now(); // 开始计时
                }

                const duration: number = Date.now() - lastTimeReadyStateBelow3;
                if (duration >= threshold) {
                //    $this.canvasVideoService.drawLoading();
                //    console.log('----readyState reset-----------');
                //    console.log(`reset:${video.readyState}`);
                //    console.log('----readyState reset-----------');
                //    $this.reload2(); // 触发回调函数
                $this.addReloadTask({ arr_msg: [`readyState 异常 :${video.readyState} ${url}`] });
                    setTimeout(checkVideoState, timeoutDuration); // 继续检查
                } else {
                    setTimeout(checkVideoState, timeoutDuration); // 继续检查
                }
            } else {
                lastTimeReadyStateBelow3 = null; // 重置计时
                setTimeout(checkVideoState, timeoutDuration); // 重新开始计时
            }
        }

        setTimeout(checkVideoState, 5000);


        if (this.meidiaEl) {
           this.meidiaEl.addEventListener('error', (e) => {
                const { error } = (e.target as HTMLVideoElement);
                switch (error.code) {
                  case 1:
                    this.addReloadTask({ arr_msg: [`中断下载 ${url}`] });
                    break;
                  case 2:
                    this.addReloadTask({ arr_msg: [`网络异常中断 ${url}`] });
                    break;
                  case 3:
                    this.addReloadTask({ arr_msg: [`解码失败 ${url}`] });
                    break;
                  case 4:
                  //  console.log('视频格式不支持。');
                    break;
                  default:
                    this.addReloadTask({ arr_msg: [`发生了其他错误 ${url}`] });
                    break;
                }
              });
        }
      }

      audioEvent(videoEl?: HTMLVideoElement) {
        let video = this.audioEl;
        let lastTimeReadyStateBelow3: number | null = null; // 最后一次 readyState 小于3的时间
        const timeoutDuration = 1000; // 检查间隔（毫秒）
        const threshold = 15000; // 阈值（毫秒）
        let $this = this;
        let { url = '' } = this.config;

        function checkVideoState() {
            if ($this.audioEl === null) {
                return false;
            }
            // console.log('readystate', video.readyState);
            if (video.readyState < 3) {
                if (lastTimeReadyStateBelow3 === null) {
                    lastTimeReadyStateBelow3 = Date.now(); // 开始计时
                }

                const duration: number = Date.now() - lastTimeReadyStateBelow3;
                if (duration >= threshold) {
                //    $this.canvasVideoService.drawLoading();
                //    console.log('----readyState reset-----------');
                //    console.log(`reset:${video.readyState}`);
                //    console.log('----readyState reset-----------');
                //    $this.reload2(); // 触发回调函数
                $this.addReloadTask({ arr_msg: [`readyState 异常 :${video.readyState} ${url}`] });
                    setTimeout(checkVideoState, timeoutDuration); // 继续检查
                } else {
                    setTimeout(checkVideoState, timeoutDuration); // 继续检查
                }
            } else {
                lastTimeReadyStateBelow3 = null; // 重置计时
                setTimeout(checkVideoState, timeoutDuration); // 重新开始计时
            }
        }

        setTimeout(checkVideoState, 5000);


        if (this.audioEl) {
           this.audioEl.addEventListener('error', (e) => {
                const { error } = (e.target as HTMLVideoElement);
                switch (error.code) {
                  case 1:
                    this.addReloadTask({ arr_msg: [`中断下载 ${url}`] });
                    break;
                  case 2:
                    this.addReloadTask({ arr_msg: [`网络异常中断 ${url}`] });
                    break;
                  case 3:
                    this.addReloadTask({ arr_msg: [`解码失败 ${url}`] });
                    break;
                  case 4:
                  //  console.log('视频格式不支持。');
                    break;
                  default:
                    this.addReloadTask({ arr_msg: [`发生了其他错误 ${url}`] });
                    break;
                }
              });
        }
      }


    createBetaPlayer2() {
        let { url } = this.httpFlvStreamService;
        let container = this.config.contentEl;

        const player = new window.Jessibuca({
            container: container,
            videoBuffer: 0.2, // 缓存时长
            isResize: false,
            text: '',
            loadingText: '加载中',
            debug: false,
            forceNoOffscreen: true,
            isNotMute: false,
            useWCS: false,
            useMSE: false,
            showBandwidth: false, // 显示网速

        });
        player.play(url);


        player.on('kBps', (data) => {
            this.emit('otherInfo', { speed: data });
          });
         player.on('stats', (s) => {
            this.emit('performaceInfo', { fps: s.fps });
          });


        this.player2 = player;
    }

    destroy() {
        if (this.canvasVideoService) {
            this.canvasVideoService.destroy();
            this.canvasVideoService = null;
        }

        if (this.mpegtsPlayer) {
            this.mpegtsPlayer.destroy();
            this.mpegtsPlayer = null;
        }
        if (this.player2) {
            this.player2.destroy();
        }
    }


    play(url: string) {
        this.httpFlvStreamService.fetchStream(url);
    }

    getStatus() {
        let video = this.meidiaEl;
        let data = {
            el: video,
            readay: video.readyState,
            paused: video.paused,
            error_connect_times: this.error_connect_times,
            url: this.config.url,
            taskQueue: this.scheduler.getQueue(),
        };

        console.info('getStatus', data);
        return data;
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


        retry() {
           if (this.mpegtsPlayer) {
             this.mpegtsPlayer.destroy();
           }
        }

        checkPlaying() {
            let video = this.meidiaEl;
            if (this.config.showAudio === true) {
                video = this.audioEl;
            } else {
                video = this.meidiaEl;
            }
            if (video.readyState < 3 || video.paused == true) {
                return false;
            } else {
                return true;
            }
        }

        reload2() {
            this.error_connect_times++;


            // if (this.error_connect_times > 3) {
            //    this.canvasVideoService.loading = false;
            //    this.setError();
            //    return false;
            // }
            // this.mpegtsPlayer.unload();
            // this.mpegtsPlayer.load();
            // this.canvasVideoService.drawLoading();
            // setTimeout(() => {
            //     try {
            //       this.mpegtsPlayer.play();
            //     } catch (e) {

            //     }
            // }, 200);
            if (this.error_connect_times > 4) {
                 this.canvasVideoService.loading = false;
               this.setError();
               return false;
            } else {
               this.mpegtsPlayer.reload();
            }
        }

        addReloadTask(parm?: {arr_msg?: Array<string>}) {
            if (this.error_connect_times > 4) {
                // console.log('error_connect_times > 4: Scheduler clearQueu ');
                this.scheduler.clearQueue();
                return false;
            }
            this.scheduler.addTask(() => {
                let { arr_msg = [''] } = parm;
                this.canvasVideoService.drawLoading();
                arr_msg.map((msg) => {
                    console.log(msg);
                });
                this.reload2();
                return new Promise(resolve => setTimeout(() => {
                    if (this.checkPlaying()) {
                        resolve('clean');
                    } else {
                        resolve('');
                    }
                    }, 10000)); // 已10s 的速度均衡执行reload 任务
                 });
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
            this.emit('otherInfo', { speed: 0 });
        }

        debounceReload() {
            let $this = this;

           this.reload = this.throttle(() => {
            //    this.canvasVideoService.drawLoading();
                this.httpFlvStreamService.hertTime++;

                debugger;
                if (this.httpFlvStreamService.hertTime > this.httpFlvStreamService.maxHeartTimes) {
                    console.log('超过最大重连次数');
                    this.setError();
                    return false;
                }
                $this.mpegtsPlayer.unload();
                $this.mpegtsPlayer.load();
                setTimeout(() => {
                   // $this.mpegtsPlayer.play();
                }, 200);
                // $this.mpegtsPlayer.play();
            }, 15 * 1000);
        }
}

export default PlayerService;
