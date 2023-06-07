// @ts-ignore
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import WebMWriter from "webm-writer";
var fetchImageByteStream = function() {
    var _ref = _async_to_generator(function(gifURL) {
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
    });
    return function fetchImageByteStream(gifURL) {
        return _ref.apply(this, arguments);
    };
}();
var createImageDecoder = function() {
    var _ref = _async_to_generator(function(imageByteStream) {
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
                    return [
                        2,
                        imageDecoder
                    ];
            }
        });
    });
    return function createImageDecoder(imageByteStream) {
        return _ref.apply(this, arguments);
    };
}();
var decodeGifToWebM = function() {
    var _ref = _async_to_generator(function(imageDecoder) {
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
                    console.log({
                        headFrame: headFrame,
                        frameCount: frameCount,
                        frameDuration: frameDuration
                    });
                    canvas = document.createElement("canvas");
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
    });
    return function decodeGifToWebM(imageDecoder) {
        return _ref.apply(this, arguments);
    };
}();
export function setupImageDecodeWriteWebm(options) {
    var startTranscode = function() {
        var _ref = _async_to_generator(function() {
            var startTime, image, imageByteStream, imageDecoder, webmBlobURL, endTime, duration;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        options.time.innerText = "开始转码...";
                        startTime = new Date();
                        image = options.inputGif;
                        return [
                            4,
                            fetchImageByteStream(image.src)
                        ];
                    case 1:
                        imageByteStream = _state.sent();
                        return [
                            4,
                            createImageDecoder(imageByteStream)
                        ];
                    case 2:
                        imageDecoder = _state.sent();
                        return [
                            4,
                            decodeGifToWebM(imageDecoder)
                        ];
                    case 3:
                        webmBlobURL = _state.sent();
                        options.video.src = webmBlobURL;
                        endTime = new Date();
                        duration = (endTime.getTime() - startTime.getTime()) / 1000;
                        options.time.innerText = "转码完成，用时 ".concat(duration, "s");
                        return [
                            2
                        ];
                }
            });
        });
        return function startTranscode() {
            return _ref.apply(this, arguments);
        };
    }();
    options.button.addEventListener("click", startTranscode, false);
}

 //# sourceMappingURL=image-decoder-wem-writter.js.map