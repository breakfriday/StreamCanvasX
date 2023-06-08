import { _ as _define_property } from "@swc/helpers/_/_define_property";
import Emitter from '../../utils/emitter';
function now() {
    return new Date().getTime();
}
const formatVideoDecoderConfigure = (avcC)=>{
    let codecArray = avcC.subarray(1, 4);
    let codecString = 'avc1.';
    for(let j = 0; j < 3; j++){
        let h = codecArray[j].toString(16);
        if (h.length < 2) {
            h = `0${h}`;
        }
        codecString += h;
    }
    return {
        codec: codecString,
        description: avcC
    };
};
const ENCODED_VIDEO_TYPE = {
    key: 'key',
    delta: 'delta'
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
    playToRenderTimes: 'playToRenderTimes'
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
    webglAlignmentError: 'webglAlignmentError'
};
const VIDEO_ENC_CODE = {
    h264: 7,
    h265: 12
};
const WCS_ERROR = {
    keyframeIsRequiredError: 'A key frame is required after configure() or flush()',
    canNotDecodeClosedCodec: "Cannot call 'decode' on a closed codec"
};
class WebcodecsDecoder extends Emitter {
    destroy() {
        if (this.decoder) {
            if (this.decoder.state !== 'closed') {
                this.decoder.close();
            }
            this.decoder = null;
        }
        this.hasInit = false;
        this.isInitInfo = false;
        this.isDecodeFirstIIframe = false;
        this.off();
        this.player.debug.log('Webcodecs', 'destroy');
    }
    initDecoder() {
        const _this = this;
        this.decoder = new VideoDecoder({
            output (videoFrame) {
                _this.handleDecode(videoFrame);
            },
            error (error) {
                _this.handleError(error);
            }
        });
    }
    handleDecode(videoFrame) {
        if (!this.isInitInfo) {
            let videoInfo = {
                width: videoFrame.codedWidth,
                height: videoFrame.codedHeight
            };
            this.player.video.updateVideoInfo({
                width: videoFrame.codedWidth,
                height: videoFrame.codedHeight
            });
            this.player.video.initCanvasViewSize();
            this.isInitInfo = true;
        }
        if (!this.player._times.videoStart) {
            this.player._times.videoStart = now();
            this.player.handlePlayToRenderTimes();
        }
        this.player.handleRender();
        this.player.video.render({
            videoFrame
        });
        this.player.updateStats({
            fps: true,
            ts: 0,
            buf: this.player.demux.delay
        });
    }
    handleError(error) {
        this.player.debug.error('Webcodecs', 'VideoDecoder handleError', error);
    }
    decodeVideo(payload, ts, isIframe) {
        // this.player.debug.log('Webcodecs decoder', 'decodeVideo', ts, isIframe);
        // eslint-disable-next-line no-negated-condition
        if (!this.hasInit) {
            if (isIframe && payload[1] === 0) {
                const videoCodec = payload[0] & 0x0F;
                this.player.video.updateVideoInfo({
                    encTypeCode: videoCodec
                });
                // 如果解码出来的是
                if (videoCodec === VIDEO_ENC_CODE.h265) {
                    this.emit(EVENTS_ERROR.webcodecsH265NotSupport);
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
            // check width or height change
            // if (isIframe && payload[1] === 0) {
            //     let data = payload.slice(5);
            //     const config = parseAVCDecoderConfigurationRecord(data);
            //     const { videoInfo } = this.player.video;
            //     if (config.codecWidth !== videoInfo.width || config.codecHeight !== videoInfo.height) {
            //         this.player.debug.log('Webcodecs', `width or height is update, width ${videoInfo.width}-> ${config.codecWidth}, height ${videoInfo.height}-> ${config.codecHeight}`);
            //         this.player.emit(EVENTS_ERROR.webcodecsWidthOrHeightChange);
            //         return;
            //     }
            // }
            // fix : Uncaught DOMException: Failed to execute 'decode' on 'VideoDecoder': A key frame is required after configure() or flush().
            if (!this.isDecodeFirstIIframe && isIframe) {
                this.isDecodeFirstIIframe = true;
            }
            if (this.isDecodeFirstIIframe) {
                const chunk = new EncodedVideoChunk({
                    data: payload.slice(5),
                    timestamp: ts,
                    type: isIframe ? ENCODED_VIDEO_TYPE.key : ENCODED_VIDEO_TYPE.delta
                });
                this.player.emit(EVENTS.timeUpdate, ts);
                try {
                    if (this.isDecodeStateClosed()) {
                        this.player.debug.warn('Webcodecs', 'VideoDecoder isDecodeStateClosed true');
                        return;
                    }
                    this.decoder.decode(chunk);
                } catch (e) {
                    this.player.debug.error('Webcodecs', 'VideoDecoder', e);
                    if (e.toString().indexOf(WCS_ERROR.keyframeIsRequiredError) !== -1) {
                        this.player.emit(EVENTS_ERROR.webcodecsDecodeError);
                    } else if (e.toString().indexOf(WCS_ERROR.canNotDecodeClosedCodec) !== -1) {
                        this.player.emit(EVENTS_ERROR.webcodecsDecodeError);
                    }
                }
            } else {
                this.player.debug.warn('Webcodecs', 'VideoDecoder isDecodeFirstIIframe false');
            }
        }
    }
    isDecodeStateClosed() {
        return this.decoder.state === 'closed';
    }
    constructor(player){
        super();
        _define_property(this, "player", void 0);
        _define_property(this, "hasInit", void 0);
        _define_property(this, "isDecodeFirstIIframe", void 0);
        _define_property(this, "isInitInfo", void 0);
        _define_property(this, "decoder", void 0);
        this.player = player;
        this.hasInit = false;
        this.isDecodeFirstIIframe = false;
        this.isInitInfo = false;
        this.decoder = null;
        this.initDecoder();
    }
}
export { WebcodecsDecoder as default };

 //# sourceMappingURL=webcodecs.js.map