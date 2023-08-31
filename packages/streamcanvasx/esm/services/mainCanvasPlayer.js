import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { injectable } from "inversify";
import mpegts from "streamcanvasx-core";
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
        _define_property(this, "metadata", void 0);
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
                    this.getVideoSize();
                    this.mpegtsPlayer.load();
                    this.mpegtsPlayer.on(mpegts.Events.MEDIA_INFO, function(parm) {
                        var video_width = parm.metadata.width;
                        var video_height = parm.metadata.height;
                        _this.metadata = {
                            video_height: video_height,
                            video_width: video_width
                        };
                        _this.getVideoSize();
                    });
                    this.mpegtsPlayer.on(mpegts.Events.METADATA_ARRIVED, function(parm) {
                        _this.mpegtsPlayer.play();
                    });
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
                    _this.analyzeCanvas.call(_this);
                // requestAnimationFrame(this.analyzeCanvas.bind(this));
                }, false);
            }
        },
        {
            key: "getVideoSize",
            value: function getVideoSize() {
                var _ref = {}, _ref_videoHeight = _ref.videoHeight, videoHeight = _ref_videoHeight === void 0 ? 0 : _ref_videoHeight, _ref_videoWidth = _ref.videoWidth, videoWidth = _ref_videoWidth === void 0 ? 0 : _ref_videoWidth;
                if (this.metadata) {
                    videoWidth = this.metadata.video_width;
                    videoHeight = this.metadata.video_height;
                } else {
                    videoHeight = this.video.videoHeight;
                    videoWidth = this.video.videoWidth;
                }
                // 计算最大公约数 （数学上求最大公约数的方法是“辗转相除法”，就是用一个数除以另一个数（不需要知道大小），取余数，再用被除数除以余数再取余，再用新的被除数除以新的余数再取余，直到余数为0，最后的被除数就是最大公约数）
                function gcd(a, b) {
                    return b === 0 ? a : gcd(b, a % b);
                }
                var greatestCommonDivisor = gcd(videoWidth, videoHeight);
                // 计算宽高比
                var aspectRatioWidth = videoWidth / greatestCommonDivisor;
                var aspectRatioHeight = videoHeight / greatestCommonDivisor;
                var ratio = "".concat(aspectRatioWidth, ":").concat(aspectRatioHeight);
                this.aspectRatio = aspectRatioWidth / aspectRatioHeight;
                console.log("------------------------");
                console.log(ratio);
                console.log("------------------------");
            }
        },
        {
            key: "loadMediaEvent",
            value: function loadMediaEvent() {
                var _this = this;
                var video_el = this.video;
                if (video_el) {
                    video_el.addEventListener("loadedmetadata", function() {
                        _this.getVideoSize();
                    // let { videoHeight, videoWidth } = video_el;
                    // // 计算最大公约数 （数学上求最大公约数的方法是“辗转相除法”，就是用一个数除以另一个数（不需要知道大小），取余数，再用被除数除以余数再取余，再用新的被除数除以新的余数再取余，直到余数为0，最后的被除数就是最大公约数）
                    //   function gcd(a, b) {
                    //       return b === 0 ? a : gcd(b, a % b);
                    //   }
                    //   let greatestCommonDivisor = gcd(videoWidth, videoHeight);
                    //   // 计算宽高比
                    //   let aspectRatioWidth = videoWidth / greatestCommonDivisor;
                    //   let aspectRatioHeight = videoHeight / greatestCommonDivisor;
                    //   let ratio = `${aspectRatioWidth}:${aspectRatioHeight}`;
                    //    this.aspectRatio = aspectRatioWidth / aspectRatioHeight;
                    //   console.log('------------------------');
                    //   console.log(ratio);
                    //   console.log('------------------------');
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
            key: "renderByWebGpu",
            value: function renderByWebGpu() {
                var _this = this;
                return _async_to_generator(function() {
                    var adapter, device, videoTexture, renderFrame;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    navigator.gpu.requestAdapter()
                                ];
                            case 1:
                                adapter = _state.sent();
                                return [
                                    4,
                                    adapter.requestDevice()
                                ];
                            case 2:
                                device = _state.sent();
                                videoTexture = device.createTexture({
                                    size: {
                                        width: _this.video.videoWidth,
                                        height: _this.video.videoHeight,
                                        depth: 1
                                    },
                                    format: "rgba8unorm",
                                    usage: window.GPUTextureUsage.COPY_DST | window.GPUTextureUsage.RENDER_ATTACHMENT
                                });
                                renderFrame = function() {
                                    // 将视频帧复制到纹理
                                    device.queue.copyExternalImageToTexture({
                                        source: _this.video
                                    }, {
                                        texture: videoTexture
                                    }, [
                                        _this.video.videoWidth,
                                        _this.video.videoHeight,
                                        1
                                    ]);
                                    // TODO: 在这里使用纹理进行渲染
                                    // 在下一帧继续
                                    requestAnimationFrame(renderFrame.bind(_this));
                                };
                                renderFrame.call(_this);
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "analyzeCanvas",
            value: function analyzeCanvas() {
                var _this = this;
                var width = this.canvas.width;
                var height = this.canvas.height / this.aspectRatio;
                var loopRender = function() {
                    if (_this.video.ended || _this.video.paused) {
                        return;
                    }
                    _this.context.drawImage(_this.video, 0, 0, width, height);
                    requestAnimationFrame(loopRender.bind(_this));
                };
                // 背景色域渐变
                var _this_context_getImageData = this.context.getImageData(0, 0, 1, 1), _this_context_getImageData_data = _sliced_to_array(_this_context_getImageData.data, 3), r = _this_context_getImageData_data[0], g = _this_context_getImageData_data[1], b = _this_context_getImageData_data[2];
                // document.body.style.cssText = `background: rgb(${r}, ${g}, ${b});`;
                loopRender();
            }
        }
    ]);
    return mainPlayerService;
}();
mainPlayerService = _ts_decorate([
    injectable()
], mainPlayerService);
export default mainPlayerService;
