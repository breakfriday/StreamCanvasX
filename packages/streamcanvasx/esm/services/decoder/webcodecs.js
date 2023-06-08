import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import Emitter from "../../utils/emitter";
import { parseAVCDecoderConfigurationRecord } from "../utils/h264";
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
    function WebcodecsDecoder(player) {
        _class_call_check(this, WebcodecsDecoder);
        var _this;
        _this = _super.call(this);
        _define_property(_assert_this_initialized(_this), "player", void 0);
        _define_property(_assert_this_initialized(_this), "hasInit", void 0);
        _define_property(_assert_this_initialized(_this), "isDecodeFirstIIframe", void 0);
        _define_property(_assert_this_initialized(_this), "isInitInfo", void 0);
        _define_property(_assert_this_initialized(_this), "decoder", void 0);
        _this.player = player;
        _this.hasInit = false;
        _this.isDecodeFirstIIframe = false;
        _this.isInitInfo = false;
        _this.decoder = null;
        _this.initDecoder();
        return _this;
    }
    _create_class(WebcodecsDecoder, [
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
                this.player.debug.log("Webcodecs", "destroy");
            }
        },
        {
            key: "initDecoder",
            value: function initDecoder() {
                var _this = this;
                this.decoder = new VideoDecoder({
                    output: function output(videoFrame) {
                        _this.handleDecode(videoFrame);
                    },
                    error: function error(error) {
                        _this.handleError(error);
                    }
                });
            }
        },
        {
            key: "handleDecode",
            value: function handleDecode(videoFrame) {
                if (!this.isInitInfo) {
                    var videoInfo = {
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
                    videoFrame: videoFrame
                });
                this.player.updateStats({
                    fps: true,
                    ts: 0,
                    buf: this.player.demux.delay
                });
            }
        },
        {
            key: "handleError",
            value: function handleError(error) {
                this.player.debug.error("Webcodecs", "VideoDecoder handleError", error);
            }
        },
        {
            key: "decodeVideo",
            value: function decodeVideo(payload, ts, isIframe) {
                // this.player.debug.log('Webcodecs decoder', 'decodeVideo', ts, isIframe);
                // eslint-disable-next-line no-negated-condition
                if (!this.hasInit) {
                    if (isIframe && payload[1] === 0) {
                        var videoCodec = payload[0] & 0x0F;
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
                        var config = formatVideoDecoderConfigure(payload.slice(5));
                        this.decoder.configure(config);
                        this.hasInit = true;
                    }
                } else {
                    // check width or height change
                    if (isIframe && payload[1] === 0) {
                        var data = payload.slice(5);
                        var config1 = parseAVCDecoderConfigurationRecord(data);
                        var videoInfo = this.player.video.videoInfo;
                        if (config1.codecWidth !== videoInfo.width || config1.codecHeight !== videoInfo.height) {
                            this.player.debug.log("Webcodecs", "width or height is update, width ".concat(videoInfo.width, "-> ").concat(config1.codecWidth, ", height ").concat(videoInfo.height, "-> ").concat(config1.codecHeight));
                            this.player.emit(EVENTS_ERROR.webcodecsWidthOrHeightChange);
                            return;
                        }
                    }
                    // fix : Uncaught DOMException: Failed to execute 'decode' on 'VideoDecoder': A key frame is required after configure() or flush().
                    if (!this.isDecodeFirstIIframe && isIframe) {
                        this.isDecodeFirstIIframe = true;
                    }
                    if (this.isDecodeFirstIIframe) {
                        var chunk = new EncodedVideoChunk({
                            data: payload.slice(5),
                            timestamp: ts,
                            type: isIframe ? ENCODED_VIDEO_TYPE.key : ENCODED_VIDEO_TYPE.delta
                        });
                        this.player.emit(EVENTS.timeUpdate, ts);
                        try {
                            if (this.isDecodeStateClosed()) {
                                this.player.debug.warn("Webcodecs", "VideoDecoder isDecodeStateClosed true");
                                return;
                            }
                            this.decoder.decode(chunk);
                        } catch (e) {
                            this.player.debug.error("Webcodecs", "VideoDecoder", e);
                            if (e.toString().indexOf(WCS_ERROR.keyframeIsRequiredError) !== -1) {
                                this.player.emit(EVENTS_ERROR.webcodecsDecodeError);
                            } else if (e.toString().indexOf(WCS_ERROR.canNotDecodeClosedCodec) !== -1) {
                                this.player.emit(EVENTS_ERROR.webcodecsDecodeError);
                            }
                        }
                    } else {
                        this.player.debug.warn("Webcodecs", "VideoDecoder isDecodeFirstIIframe false");
                    }
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
export { WebcodecsDecoder as default };

 //# sourceMappingURL=webcodecs.js.map