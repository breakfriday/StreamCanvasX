import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import WebMWriter from "webm-writer";
var ImageDecoderService = /*#__PURE__*/ function() {
    "use strict";
    function ImageDecoderService() {
        _class_call_check(this, ImageDecoderService);
        _define_property(this, "imageDecoderProcess", void 0);
        console.log("--");
    }
    _create_class(ImageDecoderService, [
        {
            key: "createImageDecoder",
            value: function createImageDecoder(imageByteStream) {
                var _this = this;
                return _async_to_generator(function() {
                    var imageDecoder;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                imageDecoder = new ImageDecoder({
                                    data: imageByteStream,
                                    type: "image/gif"
                                });
                                return [
                                    4,
                                    imageDecoder.tracks.ready
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    4,
                                    imageDecoder.completed
                                ];
                            case 2:
                                _state.sent();
                                _this.imageDecoderProcess = imageDecoder;
                                return [
                                    2,
                                    imageDecoder
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "blobToArrayBuffer",
            value: /*

    除了使用 FileReader 的 readAsArrayBuffer 方法外，
    还可以使用 Blob.arrayBuffer() (File 对象就是一个 Blob 对象) 方法来获得一个 Promise，
    该 Promise 解析为表示 Blob 数据的 ArrayBuffer。

    */ function blobToArrayBuffer(file) {
                return _async_to_generator(function() {
                    var arraybuffer;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    file.arrayBuffer()
                                ];
                            case 1:
                                arraybuffer = _state.sent();
                                return [
                                    2,
                                    arraybuffer
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "fetchImageByteStream",
            value: function fetchImageByteStream(gifURL) {
                return _async_to_generator(function() {
                    var response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    fetch(gifURL)
                                ];
                            case 1:
                                response = _state.sent();
                                return [
                                    2,
                                    response.body
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "decodeGifToWebM",
            value: function decodeGifToWebM(imageDecoder) {
                return _async_to_generator(function() {
                    var frameCount, _ref, headFrame, frameDuration, canvas, canvasContext, videoWriter, writeVideoFrame, webMBlob;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                frameCount = imageDecoder.tracks.selectedTrack.frameCount;
                                return [
                                    4,
                                    imageDecoder.decode({
                                        frameIndex: 0
                                    })
                                ];
                            case 1:
                                _ref = _state.sent(), headFrame = _ref.image;
                                frameDuration = headFrame.duration / 1000;
                                console.log("--输出帧日志--");
                                console.log({
                                    headFrame: headFrame,
                                    frameCount: frameCount,
                                    frameDuration: frameDuration
                                });
                                canvas = document.createElement("canvas");
                                // codedWidth ，codedHeight代表视频帧的编码高度和宽度，这是帧原始的像素维度。
                                canvas.width = headFrame.codedWidth;
                                canvas.height = headFrame.codedHeight;
                                canvasContext = canvas.getContext("2d");
                                videoWriter = new WebMWriter({
                                    quality: 1,
                                    fileWriter: null,
                                    fd: null,
                                    // You must supply one of:
                                    frameDuration: frameDuration,
                                    frameRate: 1000 / frameDuration,
                                    transparent: true,
                                    alphaQuality: 1
                                });
                                writeVideoFrame = function() {
                                    var _ref = _async_to_generator(function() {
                                        var frameIndex, result;
                                        var _arguments = arguments;
                                        return _ts_generator(this, function(_state) {
                                            switch(_state.label){
                                                case 0:
                                                    frameIndex = _arguments.length > 0 && _arguments[0] !== void 0 ? _arguments[0] : 0;
                                                    if (frameIndex >= frameCount) return [
                                                        2
                                                    ];
                                                    return [
                                                        4,
                                                        imageDecoder.decode({
                                                            frameIndex: frameIndex
                                                        })
                                                    ];
                                                case 1:
                                                    result = _state.sent();
                                                    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                                                    canvasContext.drawImage(result.image, 0, 0);
                                                    videoWriter.addFrame(canvas);
                                                    return [
                                                        4,
                                                        writeVideoFrame(frameIndex + 1)
                                                    ];
                                                case 2:
                                                    _state.sent();
                                                    return [
                                                        2
                                                    ];
                                            }
                                        });
                                    });
                                    return function writeVideoFrame() {
                                        return _ref.apply(this, arguments);
                                    };
                                }();
                                return [
                                    4,
                                    writeVideoFrame()
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    4,
                                    videoWriter.complete()
                                ];
                            case 3:
                                webMBlob = _state.sent();
                                return [
                                    2,
                                    URL.createObjectURL(webMBlob)
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getImageDataByByUrl",
            value: function getImageDataByByUrl(options) {
                var _this = this;
                return _async_to_generator(function() {
                    var imgUrl, imageData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                imgUrl = options.imgUrl;
                                return [
                                    4,
                                    _this.fetchImageByteStream(imgUrl)
                                ];
                            case 1:
                                imageData = _state.sent();
                                return [
                                    2,
                                    imageData
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getImageDataByFile",
            value: function getImageDataByFile(file) {
                var _this = this;
                return _async_to_generator(function() {
                    var data;
                    return _ts_generator(this, function(_state) {
                        data = _this.blobToArrayBuffer(file);
                        return [
                            2,
                            data
                        ];
                    });
                })();
            }
        },
        {
            key: "decoderByData",
            value: function decoderByData(data) {
                var _this = this;
                return _async_to_generator(function() {
                    var startTime, imageDecoder;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                startTime = performance.now();
                                return [
                                    4,
                                    _this.createImageDecoder(data)
                                ];
                            case 1:
                                imageDecoder = _state.sent();
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getFrameResultByFrameIndex",
            value: function getFrameResultByFrameIndex(options, imageDecoderPorocss) {
                return _async_to_generator(function() {
                    var frameIndex, result;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                frameIndex = options.frameIndex;
                                return [
                                    4,
                                    imageDecoderPorocss.decode({
                                        frameIndex: frameIndex
                                    })
                                ];
                            case 1:
                                result = _state.sent();
                                return [
                                    2,
                                    result
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "compose1",
            value: function compose1(options) {
                var _this = this;
                return _async_to_generator(function() {
                    var imgData, startTime, imageDecoder, videoBlobURL, endTime, duration_time;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.getImageDataByByUrl(options)
                                ];
                            case 1:
                                imgData = _state.sent();
                                startTime = new Date();
                                return [
                                    4,
                                    _this.createImageDecoder(imgData)
                                ];
                            case 2:
                                imageDecoder = _state.sent();
                                return [
                                    4,
                                    _this.decodeGifToWebM(imageDecoder)
                                ];
                            case 3:
                                videoBlobURL = _state.sent();
                                endTime = new Date();
                                duration_time = (endTime.getTime() - startTime.getTime()) / 1000;
                                console.log("转码用时".concat(duration_time, " 秒"));
                                return [
                                    2,
                                    videoBlobURL
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "compose2",
            value: function compose2(options) {
                var _this = this;
                return _async_to_generator(function() {
                    var imgData, startTime, imageDecoder, result;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.getImageDataByByUrl(options)
                                ];
                            case 1:
                                imgData = _state.sent();
                                startTime = new Date();
                                return [
                                    4,
                                    _this.createImageDecoder(imgData)
                                ];
                            case 2:
                                imageDecoder = _state.sent();
                                result = _this.getFrameResultByFrameIndex({
                                    frameIndex: 0
                                }, imageDecoder);
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "renderCanvas",
            value: function renderCanvas(options) {
                var _this = this;
                return _async_to_generator(function() {
                    var imgUrl, imageByteStream, imageDecoder, frameCount, _ref, headFrame, frameDuration;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                imgUrl = options.imgUrl;
                                return [
                                    4,
                                    _this.fetchImageByteStream(imgUrl)
                                ];
                            case 1:
                                imageByteStream = _state.sent();
                                return [
                                    4,
                                    _this.createImageDecoder(imageByteStream)
                                ];
                            case 2:
                                imageDecoder = _state.sent();
                                frameCount = imageDecoder.tracks.selectedTrack.frameCount;
                                return [
                                    4,
                                    imageDecoder.decode({
                                        frameIndex: 0
                                    })
                                ];
                            case 3:
                                _ref = _state.sent(), headFrame = _ref.image;
                                frameDuration = headFrame.duration / 1000;
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return ImageDecoderService;
}();
export { ImageDecoderService };

 //# sourceMappingURL=image_decode_webm_writer_service.js.map