import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import Emitter from '../../utils/emitter';
import PlayerService from '../player';


function now(): number {
    return new Date().getTime();
}


const formatVideoDecoderConfigure = (avcC: Uint8Array): { codec: string; description: Uint8Array } => {
    let codecArray = avcC.subarray(1, 4);
    let codecString = 'avc1.';
    for (let j = 0; j < 3; j++) {
        let h = codecArray[j].toString(16);
        if (h.length < 2) {
            h = `0${h}`;
        }
        codecString += h;
    }

    return {
        codec: codecString,
        description: avcC,
    };
};


 const ENCODED_VIDEO_TYPE = {
    key: 'key',
    delta: 'delta',
};


const EVENTS = {
    fullscreen: 'fullscreen$2',
    webFullscreen: 'webFullscreen',
    decoderWorkerInit: 'decoderWorkerInit',
    play: 'play',
    playing: 'playing',
    pause: 'pause',
    mute: 'mute',
    load: 'load',
    loading: 'loading',
    videoInfo: 'videoInfo',
    timeUpdate: 'timeUpdate',
    audioInfo: 'audioInfo',
    log: 'log',
    error: 'error',
    kBps: 'kBps',
    timeout: 'timeout',
    delayTimeout: 'delayTimeout',
    loadingTimeout: 'loadingTimeout',
    stats: 'stats',
    performance: 'performance',
    record: 'record',
    recording: 'recording',
    recordingTimestamp: 'recordingTimestamp',
    recordStart: 'recordStart',
    recordEnd: 'recordEnd',
    recordCreateError: 'recordCreateError',
    buffer: 'buffer',
    videoFrame: 'videoFrame',
    start: 'start',
    metadata: 'metadata',
    resize: 'resize',
    streamEnd: 'streamEnd',
    streamSuccess: 'streamSuccess',
    streamMessage: 'streamMessage',
    streamError: 'streamError',
    volumechange: 'volumechange',
    destroy: 'destroy',
    mseSourceOpen: 'mseSourceOpen',
    mseSourceClose: 'mseSourceClose',
    mseSourceBufferError: 'mseSourceBufferError',
    mseSourceBufferBusy: 'mseSourceBufferBusy',
    mseSourceBufferFull: 'mseSourceBufferFull',
    videoWaiting: 'videoWaiting',
    videoTimeUpdate: 'videoTimeUpdate',
    videoSyncAudio: 'videoSyncAudio',
    playToRenderTimes: 'playToRenderTimes',
};
const EVENTS_ERROR = {
    playError: 'playIsNotPauseOrUrlIsNull',
    fetchError: 'fetchError',
    websocketError: 'websocketError',
    webcodecsH265NotSupport: 'webcodecsH265NotSupport',
    webcodecsDecodeError: 'webcodecsDecodeError',
    webcodecsWidthOrHeightChange: 'webcodecsWidthOrHeightChange',
    mediaSourceH265NotSupport: 'mediaSourceH265NotSupport',
    mediaSourceFull: EVENTS.mseSourceBufferFull,
    mseSourceBufferError: EVENTS.mseSourceBufferError,
    mediaSourceAppendBufferError: 'mediaSourceAppendBufferError',
    mediaSourceBufferListLarge: 'mediaSourceBufferListLarge',
    mediaSourceAppendBufferEndTimeout: 'mediaSourceAppendBufferEndTimeout',
    wasmDecodeError: 'wasmDecodeError',
    webglAlignmentError: 'webglAlignmentError',
};
 const VIDEO_ENC_CODE = {
    h264: 7,
    h265: 12,
};
 const WCS_ERROR = {
    keyframeIsRequiredError: 'A key frame is required after configure() or flush()',
    canNotDecodeClosedCodec: "Cannot call 'decode' on a closed codec",
};


interface VideoInfo {
    width: number;
    height: number;
    encTypeCode?: number;
  }

  interface Times {
    videoStart?: number;
    decodeStart?: number;
  }


  @injectable()
 class WebcodecsDecoder extends Emitter {
    private player: PlayerService;
    private hasInit: boolean;
    private isDecodeFirstIIframe: boolean;
    private isInitInfo: boolean;
    private decoder: any | null;
    constructor() {
        super();

        this.hasInit = false;
        this.isDecodeFirstIIframe = false;
        this.isInitInfo = false;
        this.decoder = null;
        this.initDecoder();
    }
    init(playerService: PlayerService) {
        this.player = playerService;
    }
    initDecoder() {
        const _this = this;
        this.decoder = new VideoDecoder({
            output(videoFrame) {
                _this.handleDecode(videoFrame);
            },
            error(error) {
                _this.handleError(error);
            },
        });
    }

    handleDecode(videoFrame: VideoFrame) {
        if (!this.isInitInfo) {
            this.player.video.updateVideoInfo({
                width: videoFrame.codedWidth,
                height: videoFrame.codedHeight,
            });
            // this.player.video.initCanvasViewSize();

            debugger;
            this.isInitInfo = true;
        }

        // if (!this.player._times.videoStart) {
        //     this.player._times.videoStart = now();
        //     this.player.handlePlayToRenderTimes();
        // }

        // this.player.handleRender();
        // this.player.video.render({
        //     videoFrame,
        // });

        // this.player.updateStats({ fps: true, ts: 0, buf: this.player.demux.delay });
    }

    handleError(error: Error) {
        console.log(error);
        // this.player.debug.error('Webcodecs', 'VideoDecoder handleError', error);
    }

    decodeVideo(payload: Uint8Array, ts: number, isIframe: boolean): void {
        // this.player.debug.log('Webcodecs decoder', 'decodeVideo', ts, isIframe);

// eslint-disable-next-line no-negated-condition
        if (!this.hasInit) {
            if (isIframe && payload[1] === 0) { // 是关键帧且payload的第2个字节为0
                // 更新视频信息
                // 根据视频编码格式（H.264, H.265等）进行不同的处理

                const videoCodec: number = (payload[0] & 0x0F);
                // this.player.video.updateVideoInfo({
                //     encTypeCode: videoCodec,
                // });

                // 如果解码出来的是
                if (videoCodec === VIDEO_ENC_CODE.h265) {
                    console.log('不支持 H265');
                    return;
                }
                if (!this.player._times.decodeStart) {
                    this.player._times.decodeStart = now();
                }

                const config = formatVideoDecoderConfigure(payload.slice(5));
                this.decoder.configure(config);
                this.hasInit = true;
            }
        } else {
            // 如果当前帧是关键帧，并且payload的第二个字节为0，表示这是一个序列参数集或图像参数集包
            if (isIframe && payload[1] === 0) {

            }

           // 如果还没有解码过关键帧，并且当前帧是关键帧
            if (!this.isDecodeFirstIIframe && isIframe) {
               // 标记已经解码过第一个关键帧
                this.isDecodeFirstIIframe = true;
            }

            /*
            isDecodeFirstIIframe 确保在解码非关键帧之前，至少已经解码过一个关键帧。
            只有当 isDecodeFirstIIframe 为 true（表示已经解码过至少一个关键帧）时，才会尝试去解码非关键帧。
             */
            if (this.isDecodeFirstIIframe) {
                  // 创建一个新的已编码视频块，包含了视频数据、时间戳和帧类型
                const chunk: EncodedVideoChunk = new EncodedVideoChunk({
                    data: payload.slice(5),
                    timestamp: ts,
                    type: isIframe ? ENCODED_VIDEO_TYPE.key : ENCODED_VIDEO_TYPE.delta,
                });
                this.player.emit(EVENTS.timeUpdate, ts);
                try {
                    if (this.isDecodeStateClosed()) {
                        return;
                    }
                    this.decoder.decode(chunk);
                } catch (e: any) {
                    if (e.toString().indexOf(WCS_ERROR.keyframeIsRequiredError) !== -1) {
                        this.player.emit(EVENTS_ERROR.webcodecsDecodeError);
                    } else if (e.toString().indexOf(WCS_ERROR.canNotDecodeClosedCodec) !== -1) {
                        this.player.emit(EVENTS_ERROR.webcodecsDecodeError);
                    }
                }
            } else {

            }
        }
    }

    isDecodeStateClosed() {
        return this.decoder.state === 'closed';
    }
}


export default WebcodecsDecoder;