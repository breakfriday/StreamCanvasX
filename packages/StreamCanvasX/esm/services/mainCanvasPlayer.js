import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { injectable } from "inversify";
import mpegts from "mpegts.js";
var mainPlayerService = /*#__PURE__*/ function() {
    "use strict";
    function mainPlayerService(parmams) {
        _class_call_check(this, mainPlayerService);
        _define_property(this, "video", void 0);
        _define_property(this, "canvas", void 0);
        _define_property(this, "context", void 0);
        _define_property(this, "mpegtsPlayer", void 0);
        _define_property(this, "root_el", void 0);
        _define_property(this, "aspectRatio", void 0);
        _define_property(this, "config", void 0);
        // this.video = parmams.vedio_el;
        this.video = document.createElement("video");
        this.video.controls = true;
        this.canvas = parmams.canvas_el;
        this.root_el = parmams.root_el;
        this.config = parmams.config || {};
        if (this.canvas) {
            this.context = this.canvas.getContext("2d");
        }
        this.root_el.innerHTML = "";
        this.root_el.appendChild(this.video);
        this.setVideoSize();
        this.vedioEvents();
    }
    _create_class(mainPlayerService, [
        {
            key: "_vedio",
            get: function get() {
                return this.video;
            }
        },
        {
            key: "createFlvPlayer",
            value: function createFlvPlayer(parms) {
                var _this = this;
                var type = parms.type, isLive = parms.isLive, url = parms.url;
                var videoEl = this.video;
                if (videoEl) {
                    this.mpegtsPlayer = mpegts.createPlayer({
                        type: type,
                        isLive: isLive,
                        url: url,
                        hasAudio: true
                    });
                    this.mpegtsPlayer.attachMediaElement(videoEl);
                    this.mpegtsPlayer.load();
                    this.mpegtsPlayer.play();
                    this.mpegtsPlayer.on(mpegts.Events.ERROR, function(error, detailError) {
                        if (error === mpegts.ErrorTypes.NETWORK_ERROR) {
                            if (detailError === mpegts.ErrorDetails.NETWORK_UNRECOVERABLE_EARLY_EOF) {
                                _this.reoload();
                            }
                            if (detailError === mpegts.ErrorDetails.NETWORK_TIMEOUT) {
                                return false;
                            }
                        }
                    });
                }
            }
        },
        {
            key: "setConfig",
            value: function setConfig(params) {
                this.config = Object.assign({}, this.config, params);
            }
        },
        {
            key: "load",
            value: function load() {
                this.mpegtsPlayer.load();
            }
        },
        {
            key: "play",
            value: function play() {
                this.mpegtsPlayer.play();
            }
        },
        {
            key: "paused",
            value: function paused() {
                this.mpegtsPlayer.pause();
            }
        },
        {
            key: "reoload",
            value: function reoload() {
                this.mpegtsPlayer.unload();
                this.mpegtsPlayer.detachMediaElement();
                this.mpegtsPlayer.attachMediaElement(this.video);
                this.mpegtsPlayer.load();
                this.mpegtsPlayer.play();
            }
        },
        {
            key: "set_blob_url",
            value: function set_blob_url(filedata) {
                var blobUrl = URL.createObjectURL(filedata);
                this.video.src = blobUrl;
                this.video.load();
            }
        },
        {
            key: "vedioEvents",
            value: function vedioEvents() {
                var _this = this;
                this.loadMediaEvent();
                this.video.addEventListener("play", function() {
                    requestAnimationFrame(_this.analyzeCanvas.bind(_this));
                }, false);
            }
        },
        {
            key: "loadMediaEvent",
            value: function loadMediaEvent() {
                var _this = this;
                var video_el = this.video;
                if (video_el) {
                    video_el.addEventListener("loadedmetadata", function() {
                        var videoHeight = video_el.videoHeight, videoWidth = video_el.videoWidth;
                        // 计算最大公约数 （数学上求最大公约数的方法是“辗转相除法”，就是用一个数除以另一个数（不需要知道大小），取余数，再用被除数除以余数再取余，再用新的被除数除以新的余数再取余，直到余数为0，最后的被除数就是最大公约数）
                        function gcd(a, b) {
                            return b === 0 ? a : gcd(b, a % b);
                        }
                        var greatestCommonDivisor = gcd(videoWidth, videoHeight);
                        // 计算宽高比
                        var aspectRatioWidth = videoWidth / greatestCommonDivisor;
                        var aspectRatioHeight = videoHeight / greatestCommonDivisor;
                        var ratio = "".concat(aspectRatioWidth, ":").concat(aspectRatioHeight);
                        _this.aspectRatio = aspectRatioWidth / aspectRatioHeight;
                        console.log("------------------------");
                        console.log(ratio);
                        console.log("------------------------");
                    });
                }
            }
        },
        {
            key: "setVideoSize",
            value: function setVideoSize() {
                var height = this.root_el.clientHeight;
                var width = this.root_el.clientWidth;
                this.video.height = height;
                this.video.width = width;
            }
        },
        {
            key: "analyzeCanvas",
            value: function analyzeCanvas() {
                if (this.video.ended || this.video.paused) {
                    return;
                }
                this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height / this.aspectRatio);
                // 背景色域渐变
                var _this_context_getImageData = this.context.getImageData(0, 0, 1, 1), _this_context_getImageData_data = _sliced_to_array(_this_context_getImageData.data, 3), r = _this_context_getImageData_data[0], g = _this_context_getImageData_data[1], b = _this_context_getImageData_data[2];
                // document.body.style.cssText = `background: rgb(${r}, ${g}, ${b});`;
                requestAnimationFrame(this.analyzeCanvas.bind(this));
            }
        }
    ]);
    return mainPlayerService;
}();
mainPlayerService = _ts_decorate([
    injectable()
], mainPlayerService);
export default mainPlayerService;

 //# sourceMappingURL=mainCanvasPlayer.js.map