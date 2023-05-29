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
        var _this = this;
        _class_call_check(this, mainPlayerService);
        _define_property(this, "video", void 0);
        _define_property(this, "canvas", void 0);
        _define_property(this, "context", void 0);
        _define_property(this, "mpegtsPlayer", void 0);
        this.video = parmams.vedio_el;
        this.canvas = parmams.canvas_el;
        if (this.canvas) {
            this.context = this.canvas.getContext("2d");
        }
        this.video.addEventListener("play", function() {
            requestAnimationFrame(_this.analyzeCanvas.bind(_this));
        }, false);
    }
    _create_class(mainPlayerService, [
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
            value: function setConfig() {}
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
            key: "analyzeCanvas",
            value: function analyzeCanvas() {
                if (this.video.ended || this.video.paused) {
                    return;
                }
                this.context.drawImage(this.video, 0, 0, 800, 800);
                var _this_context_getImageData = this.context.getImageData(0, 0, 1, 1), _this_context_getImageData_data = _sliced_to_array(_this_context_getImageData.data, 3), r = _this_context_getImageData_data[0], g = _this_context_getImageData_data[1], b = _this_context_getImageData_data[2];
                document.body.style.cssText = "background: rgb(".concat(r, ", ").concat(g, ", ").concat(b, ");");
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