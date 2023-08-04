import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { injectable } from "inversify";
import Emitter from "../../utils/emitter";
function now() {
    return new Date().getTime();
}
var formatVideoDecoderConfigure = function(avcC) {
    var codecArray = avcC.subarray(1, 4);
    var codecString = "avc1.";
    for(var j = 0; j < 3; j++){
        var h = codecArray[j].toString(16);
        if (h.length < 2) {
            h = "0".concat(h);
        }
        codecString += h;
    }
    return {
        codec: codecString,
        description: avcC
    };
};
var ENCODED_VIDEO_TYPE = {
    key: "key",
    delta: "delta"
};
var EVENTS = {
    fullscreen: "fullscreen$2",
    webFullscreen: "webFullscreen",
    decoderWorkerInit: "decoderWorkerInit",
    play: "play",
    playing: "playing",
    pause: "pause",
    mute: "mute",
    load: "load",
    loading: "loading",
    videoInfo: "videoInfo",
    timeUpdate: "timeUpdate",
    audioInfo: "audioInfo",
    log: "log",
    error: "error",
    kBps: "kBps",
    timeout: "timeout",
    delayTimeout: "delayTimeout",
    loadingTimeout: "loadingTimeout",
    stats: "stats",
    performance: "performance",
    record: "record",
    recording: "recording",
    recordingTimestamp: "recordingTimestamp",
    recordStart: "recordStart",
    recordEnd: "recordEnd",
    recordCreateError: "recordCreateError",
    buffer: "buffer",
    videoFrame: "videoFrame",
    start: "start",
    metadata: "metadata",
    resize: "resize",
    streamEnd: "streamEnd",
    streamSuccess: "streamSuccess",
    streamMessage: "streamMessage",
    streamError: "streamError",
    volumechange: "volumechange",
    destroy: "destroy",
    mseSourceOpen: "mseSourceOpen",
    mseSourceClose: "mseSourceClose",
    mseSourceBufferError: "mseSourceBufferError",
    mseSourceBufferBusy: "mseSourceBufferBusy",
    mseSourceBufferFull: "mseSourceBufferFull",
    videoWaiting: "videoWaiting",
    videoTimeUpdate: "videoTimeUpdate",
    videoSyncAudio: "videoSyncAudio",
    playToRenderTimes: "playToRenderTimes"
};
var EVENTS_ERROR = {
    playError: "playIsNotPauseOrUrlIsNull",
    fetchError: "fetchError",
    websocketError: "websocketError",
    webcodecsH265NotSupport: "webcodecsH265NotSupport",
    webcodecsDecodeError: "webcodecsDecodeError",
    webcodecsWidthOrHeightChange: "webcodecsWidthOrHeightChange",
    mediaSourceH265NotSupport: "mediaSourceH265NotSupport",
    mediaSourceFull: EVENTS.mseSourceBufferFull,
    mseSourceBufferError: EVENTS.mseSourceBufferError,
    mediaSourceAppendBufferError: "mediaSourceAppendBufferError",
    mediaSourceBufferListLarge: "mediaSourceBufferListLarge",
    mediaSourceAppendBufferEndTimeout: "mediaSourceAppendBufferEndTimeout",
    wasmDecodeError: "wasmDecodeError",
    webglAlignmentError: "webglAlignmentError"
};
var VIDEO_ENC_CODE = {
    h264: 7,
    h265: 12
};
var WCS_ERROR = {
    keyframeIsRequiredError: "A key frame is required after configure() or flush()",
    canNotDecodeClosedCodec: "Cannot call 'decode' on a closed codec"
};
var WebcodecsDecoder = /*#__PURE__*/ function(Emitter) {
    "use strict";
    _inherits(WebcodecsDecoder, Emitter);
    var _super = _create_super(WebcodecsDecoder);
    function WebcodecsDecoder() {
        _class_call_check(this, WebcodecsDecoder);
        var _this;
        _this = _super.call(this);
        _define_property(_assert_this_initialized(_this), "player", void 0);
        _define_property(_assert_this_initialized(_this), "hasInit", void 0);
        _define_property(_assert_this_initialized(_this), "isDecodeFirstIIframe", void 0);
        _define_property(_assert_this_initialized(_this), "isInitInfo", void 0);
        _define_property(_assert_this_initialized(_this), "decoder", void 0);
        _this.hasInit = false;
        _this.isDecodeFirstIIframe = false;
        _this.isInitInfo = false;
        _this.decoder = null;
        return _this;
    }
    _create_class(WebcodecsDecoder, [
        {
            key: "init",
            value: function init(playerService) {
                this.player = playerService;
            // this.initDecoder();
            }
        },
        {
            key: "destroy",
            value: function destroy() {
                if (this.decoder) {
                    if (this.decoder.state !== "closed") {
                        this.decoder.close();
                    }
                    this.decoder = null;
                }
                this.hasInit = false;
                this.isInitInfo = false;
                this.isDecodeFirstIIframe = false;
                this.off();
            }
        },
        {
            // 用于初始化解码器
            key: "initDecoder",
            value: function initDecoder() {
                var _this = this;
                this.decoder = new VideoDecoder({
                    output: function output(videoFrame) {
                        _this.handleDecode(videoFrame);
                        videoFrame.close();
                    },
                    error: function error(error) {
                        _this.handleError(error);
                    }
                });
            }
        },
        {
            // 处理解码后的视频帧
            key: "handleDecode",
            value: function handleDecode(videoFrame) {
                if (!this.isInitInfo) {
                    // this.player.video.updateVideoInfo({
                    //     width: videoFrame.codedWidth,
                    //     height: videoFrame.codedHeight,
                    // });
                    // this.player.video.initCanvasViewSize();
                    this.isInitInfo = true;
                }
                this.player.debugLogService.info({
                    title: "videoFrame",
                    info: videoFrame,
                    logkey: "videoFrame"
                });
                this.player.canvasVideoService.render(videoFrame);
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
        },
        {
            // 处理解码过程中的错误
            key: "handleError",
            value: function handleError(error) {
                console.error(error);
            // this.player.debug.error('Webcodecs', 'VideoDecoder handleError', error);
            }
        },
        {
            // 对视频数据进行解码
            key: "decodeVideo",
            value: function decodeVideo(payload, ts, isIframe) {
                // eslint-disable-next-line no-negated-condition
                if (!this.hasInit) {
                    if (isIframe && payload[1] === 0) {
                        // 获取视频编码方式
                        var videoCodec = payload[0] & 0x0F;
                        // 如果解码出来的是
                        if (videoCodec === VIDEO_ENC_CODE.h265) {
                            console.log("不支持 H265");
                            return;
                        }
                        if (!this.player._times.decodeStart) {
                            this.player._times.decodeStart = now();
                        }
                        /*
              payload.slice(5) 这个操作是从关键帧数据中提取出AVCDecoderConfigurationRecord的部分。
              具体来说，前5个字节是FLV格式定义的固定头部，包含了一些基本的信息，例如帧类型（关键帧或非关键帧）和编码格式（例如H.264）。
              所以这里需要跳过前5个字节，从第6个字节开始才是AVCDecoderConfigurationRecord。

              codec：编码格式，例如"vp8"、"vp9"、"avc"（H.264）等。
            codedWidth 和 codedHeight：视频的宽度和高度。
             other fields：可能还包含其他一些信息，例如比特率、帧率等，具体的内容可能会根据编码格式和实际的需求有所不同。
              */ var config = formatVideoDecoderConfigure(payload.slice(5));
                        this.decoder.configure(config);
                        // hasInit 视频解码器是否已经初始化
                        this.hasInit = true;
                    }
                } else {
                    // 如果还没有解码过关键帧，并且当前帧是关键帧
                    if (!this.isDecodeFirstIIframe && isIframe) {
                        // 标记已经解码过第一个关键帧
                        this.isDecodeFirstIIframe = true;
                    }
                    /*
            isDecodeFirstIIframe 确保在解码非关键帧之前，至少已经解码过一个关键帧。
            只有当 isDecodeFirstIIframe 为 true（表示已经解码过至少一个关键帧）时，才会尝试去解码非关键帧。
             */ if (this.isDecodeFirstIIframe) {
                        // 创建一个新的已编码视频块，包含了视频数据、时间戳和帧类型
                        var chunk = new EncodedVideoChunk({
                            data: payload.slice(5),
                            timestamp: ts,
                            type: isIframe ? ENCODED_VIDEO_TYPE.key : ENCODED_VIDEO_TYPE.delta
                        });
                        this.player.emit(EVENTS.timeUpdate, ts);
                        try {
                            if (this.isDecodeStateClosed()) {
                                return;
                            }
                            this.decoder.decode(chunk);
                        } catch (e) {
                            if (e.toString().indexOf(WCS_ERROR.keyframeIsRequiredError) !== -1) {
                                this.player.emit(EVENTS_ERROR.webcodecsDecodeError);
                            } else if (e.toString().indexOf(WCS_ERROR.canNotDecodeClosedCodec) !== -1) {
                                this.player.emit(EVENTS_ERROR.webcodecsDecodeError);
                            }
                        }
                    } else {}
                }
            }
        },
        {
            key: "isDecodeStateClosed",
            value: function isDecodeStateClosed() {
                return this.decoder.state === "closed";
            }
        }
    ]);
    return WebcodecsDecoder;
}(Emitter);
WebcodecsDecoder = _ts_decorate([
    injectable()
], WebcodecsDecoder);
export default WebcodecsDecoder;
