import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { injectable } from "inversify";
import CodecParser from "codec-parser";
var HttpFlvStreamLoader = // import CodecParser from '../decoder/CodecParser/index';
/*#__PURE__*/ function() {
    "use strict";
    function HttpFlvStreamLoader() {
        _class_call_check(this, HttpFlvStreamLoader);
        _define_property(this, "_requestAbort", void 0);
        _define_property(this, "_abortController", void 0);
        _define_property(this, "_abortController2", void 0);
        _define_property(this, "_requestAbort2", void 0);
        _define_property(this, "_chunks2", void 0);
        _define_property(this, "playerService", void 0);
        _define_property(this, "url", void 0);
        _define_property(this, "downLoadConfig", void 0);
        _define_property(this, "streamParser", void 0);
        _define_property(this, "maxHeartTimes", void 0);
        _define_property(this, "hertTime", void 0);
        this.requestAbort = false;
        this.hertTime = 0;
        this.maxHeartTimes = 10;
        this.initAudioPlayer();
    }
    _create_class(HttpFlvStreamLoader, [
        {
            key: "initAudioPlayer",
            value: function initAudioPlayer() {
                var mimeType = "audio/aac";
                var options = {
                    onCodec: function() {},
                    onCodecUpdate: function() {},
                    enableLogging: true
                };
                this.streamParser = new CodecParser(mimeType, options);
            }
        },
        {
            key: "requestAbort",
            get: function get() {
                return this._requestAbort;
            },
            set: function set(value) {
                this._requestAbort = value;
            }
        },
        {
            key: "abortController",
            get: function get() {
                return this._abortController;
            }
        },
        {
            key: "init",
            value: function init(playerService, url) {
                this.playerService = playerService;
                this.url = url;
            }
        },
        {
            // 统一 公用别名
            key: "open",
            value: function open() {
                this.fetchStream();
            }
        },
        {
            // 统一 公用别名
            key: "abort",
            value: function abort() {
                this.abortFetch();
            }
        },
        {
            key: "destroy",
            value: function destroy() {
                this.abort();
            }
        },
        {
            key: "fetchStream",
            value: function fetchStream() {
                var _this = this;
                return _async_to_generator(function() {
                    var url, headers, params, response, stream, reader, e;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                url = _this.playerService.config.url;
                                headers = new Headers();
                                _this._abortController = new AbortController();
                                params = {
                                    method: "GET",
                                    mode: "cors",
                                    credentials: "same-origin",
                                    headers: headers,
                                    cache: "default",
                                    referrerPolicy: "no-referrer-when-downgrade",
                                    signal: _this.abortController.signal
                                };
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    5,
                                    ,
                                    6
                                ]);
                                return [
                                    4,
                                    fetch(url, params)
                                ];
                            case 2:
                                response = _state.sent();
                                if (_this.requestAbort === true) {
                                    response.body.cancel();
                                    return [
                                        2
                                    ];
                                }
                                stream = response.body;
                                reader = stream === null || stream === void 0 ? void 0 : stream.getReader();
                                if (!reader) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    _this.processStream(reader)
                                ];
                            case 3:
                                _state.sent();
                                _state.label = 4;
                            case 4:
                                return [
                                    3,
                                    6
                                ];
                            case 5:
                                e = _state.sent();
                                return [
                                    3,
                                    6
                                ];
                            case 6:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "abortFetch",
            value: function abortFetch() {
                this.abortController.abort();
            }
        },
        {
            key: "downLoadBlob",
            value: function downLoadBlob(blob) {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                a.download = "canvaToVideo.flv";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
        },
        {
            key: "downLoad",
            value: function downLoad() {
                var _this = this;
                return _async_to_generator(function() {
                    var controller, signal, url, tempUrl, downUrl, requestAbort, downloadBlob, response, stream, reader, chunks, _ref, value, done, e, chunks1, blob;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                controller = new AbortController();
                                _this._abortController2 = controller;
                                signal = controller.signal;
                                url = _this.url;
                                tempUrl = new URL(url);
                                downUrl = "".concat(location.protocol, "//").concat(tempUrl.host).concat(tempUrl.pathname);
                                _this._requestAbort2 = false;
                                requestAbort = _this._requestAbort2;
                                downloadBlob = function(blob) {
                                    var url = window.URL.createObjectURL(blob);
                                    var a = document.createElement("a");
                                    a.style.display = "none";
                                    a.href = url;
                                    a.download = "canvaToVideo.flv";
                                    document.body.appendChild(a);
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                };
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    6,
                                    ,
                                    7
                                ]);
                                return [
                                    4,
                                    fetch(downUrl, {
                                        signal: signal
                                    })
                                ];
                            case 2:
                                response = _state.sent();
                                stream = response.body;
                                reader = stream === null || stream === void 0 ? void 0 : stream.getReader();
                                chunks = _this._chunks2 = [];
                                if (!reader) return [
                                    3,
                                    5
                                ];
                                _state.label = 3;
                            case 3:
                                if (!true) return [
                                    3,
                                    5
                                ];
                                return [
                                    4,
                                    reader.read()
                                ];
                            case 4:
                                _ref = _state.sent(), value = _ref.value, done = _ref.done;
                                if (done || requestAbort) {
                                    return [
                                        3,
                                        5
                                    ];
                                }
                                chunks.push(value);
                                return [
                                    3,
                                    3
                                ];
                            case 5:
                                return [
                                    3,
                                    7
                                ];
                            case 6:
                                e = _state.sent();
                                if (e.name === "AbortError") {
                                    chunks1 = _this._chunks2;
                                    blob = new Blob(chunks1, {
                                        type: "video/x-flv"
                                    });
                                    _this.downLoadBlob(blob);
                                }
                                return [
                                    3,
                                    7
                                ];
                            case 7:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "abortDownLoad",
            value: function abortDownLoad() {
                var controller = this._abortController2;
                var chunks = this._chunks2;
                if (controller) {
                    controller.abort();
                    // const blob = new Blob(chunks, { type: 'video/x-flv' });
                    // this.downLoadBlob(blob);
                    this._requestAbort2 = true;
                }
            }
        },
        {
            key: "processStream",
            value: // async processStream(reader: ReadableStreamDefaultReader): Promise<void> {
            //     while (true) {
            //         try {
            //             const { done, value } = await reader.read();
            //             const chunk = value?.buffer;
            //             // console.log(chunk);
            //             if (done) {
            //                 console.log('Stream complete');
            //                 return;
            //             }
            //             this.playerService.flvVDemuxService.dispatch(value);
            //            // this.playerService.fLVDemuxStream.dispatch(value);
            //             // Your process goes here, where you can handle each chunk of FLV data
            //             // For example:
            //             // this.processFlvChunk(value);
            //         } catch (e) {
            //             console.error('Error reading stream', e);
            //             return;
            //         }
            //     }
            // }
            function processStream(reader) {
                var _this = this;
                return _async_to_generator(function() {
                    var _ref, done, value, chunk, streamParser, frames, e;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!!window.pp) return [
                                    3,
                                    2
                                ];
                                return [
                                    4,
                                    _this.playerService.mseDecoderService.start()
                                ];
                            case 1:
                                _state.sent();
                                window.pp = true;
                                _state.label = 2;
                            case 2:
                                if (!true) return [
                                    3,
                                    8
                                ];
                                _state.label = 3;
                            case 3:
                                _state.trys.push([
                                    3,
                                    6,
                                    ,
                                    7
                                ]);
                                return [
                                    4,
                                    reader.read()
                                ];
                            case 4:
                                _ref = _state.sent(), done = _ref.done, value = _ref.value;
                                chunk = value === null || value === void 0 ? void 0 : value.buffer;
                                // console.log(chunk);
                                if (done) {
                                    console.log("Stream complete");
                                    return [
                                        2
                                    ];
                                }
                                streamParser = _this.streamParser;
                                frames = _to_consumable_array(streamParser.parseChunk(value));
                                return [
                                    4,
                                    _this.playerService.mseDecoderService.onstream(frames)
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    3,
                                    7
                                ];
                            case 6:
                                e = _state.sent();
                                console.error("Error reading stream", e);
                                return [
                                    2
                                ];
                            case 7:
                                return [
                                    3,
                                    2
                                ];
                            case 8:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "processFlvChunk",
            value: function processFlvChunk(chunk) {}
        }
    ], [
        {
            key: "isSupported",
            value: function isSupported() {
                if (window.fetch && window.ReadableStream) {
                    return true;
                } else {
                    console.log("Fetch and Stream API are not supported");
                    return false;
                }
            }
        }
    ]);
    return HttpFlvStreamLoader;
}();
HttpFlvStreamLoader = _ts_decorate([
    injectable()
], HttpFlvStreamLoader);
export default HttpFlvStreamLoader;
