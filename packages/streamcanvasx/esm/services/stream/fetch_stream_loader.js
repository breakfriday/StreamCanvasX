import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var httpFlvStreamLoader = /*#__PURE__*/ function() {
    "use strict";
    function httpFlvStreamLoader() {
        _class_call_check(this, httpFlvStreamLoader);
        _define_property(this, "_requestAbort", void 0);
        _define_property(this, "_abortController", void 0);
        this.requestAbort = false;
        this._abortController = new AbortController();
    }
    _create_class(httpFlvStreamLoader, [
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
            key: "fetchStream",
            value: function fetchStream(url) {
                var _this = this;
                return _async_to_generator(function() {
                    var sourceUrl, headers, params, _response_body, response, reader, e;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                sourceUrl = url;
                                headers = new Headers();
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
                                reader = (_response_body = response.body) === null || _response_body === void 0 ? void 0 : _response_body.getReader();
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
            key: "processStream",
            value: function processStream(reader) {
                return _async_to_generator(function() {
                    var _ref, done, value, chunk, e;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!true) return [
                                    3,
                                    5
                                ];
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    reader.read()
                                ];
                            case 2:
                                _ref = _state.sent(), done = _ref.done, value = _ref.value;
                                chunk = value.value.buffer;
                                if (done) {
                                    console.log("Stream complete");
                                    return [
                                        2
                                    ];
                                }
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                e = _state.sent();
                                console.error("Error reading stream", e);
                                return [
                                    2
                                ];
                            case 4:
                                return [
                                    3,
                                    0
                                ];
                            case 5:
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
        },
        {
            key: "abort",
            value: function abort() {}
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
    return httpFlvStreamLoader;
}();

 //# sourceMappingURL=fetch_stream_loader.js.map