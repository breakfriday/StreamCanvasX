import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function decodeVideo2(buffer) {
    return _decodeVideo2.apply(this, arguments);
}
function _decodeVideo2() {
    _decodeVideo2 = _async_to_generator(function(buffer) {
        var videoDecoder;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    videoDecoder = new VideoDecoder({
                        output: function output(frame) {
                            var canvas = document.getElementById("canvas");
                            var context = canvas.getContext("2d");
                            context.drawImage(frame, 0, 0);
                            frame.close();
                        },
                        error: function error(e) {
                            console.error(e);
                        }
                    });
                    return [
                        4,
                        videoDecoder.configure({
                            codec: "vp8"
                        })
                    ];
                case 1:
                    _state.sent(); // configure with appropriate codec
                    videoDecoder.decode(new EncodedVideoChunk({
                        type: "key",
                        timestamp: 0,
                        data: buffer
                    }));
                    return [
                        2
                    ];
            }
        });
    });
    return _decodeVideo2.apply(this, arguments);
}
var DecodeVide = /*#__PURE__*/ function() {
    "use strict";
    function DecodeVide() {
        _class_call_check(this, DecodeVide);
    }
    _create_class(DecodeVide, [
        {
            key: "startDeconding",
            value: function startDeconding() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2
                        ];
                    });
                })();
            }
        }
    ]);
    return DecodeVide;
}();
