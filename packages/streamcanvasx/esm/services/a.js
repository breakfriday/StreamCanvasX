/* eslint-disable */ import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { TsDemuxer } from "./ts-demuxer";
if (!("VideoDecoder" in window)) {
    window.alert("请开启 chrome://flags/#enable-experimental-web-platform-features");
} else {
    main();
}
function main() {
    return _main.apply(this, arguments);
}
function _main() {
    _main = _async_to_generator(function() {
        var isAvcC, response, movie, _, tsDemuxer, avcTrack, canvas, ctx, decoderConfig, _ref, config, supported, frameCount, startTime, decoder, sleep, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, frame, data, timestamp, duration, chunk, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    isAvcC = false; // avcC 格式还是 AnnexB，false 为 AnnexB 格式
                    return [
                        4,
                        fetch("https://test-streams.mux.dev/x36xhzz/url_4/url_718/193039199_mp4_h264_aac_7.ts")
                    ];
                case 1:
                    response = _state.sent();
                    _ = Uint8Array.bind;
                    return [
                        4,
                        response.arrayBuffer()
                    ];
                case 2:
                    movie = new (_.apply(Uint8Array, [
                        void 0,
                        _state.sent()
                    ]));
                    tsDemuxer = new TsDemuxer();
                    avcTrack = tsDemuxer.demux(movie).video;
                    canvas = document.createElement("canvas");
                    canvas.width = avcTrack.width;
                    canvas.height = avcTrack.height;
                    document.body.appendChild(canvas);
                    ctx = canvas.getContext("2d");
                    ctx.font = "30px serif";
                    decoderConfig = {
                        codec: avcTrack.codec
                    };
                    if (isAvcC) {
                        decoderConfig.description = AVCDecoderConfigurationRecord(avcTrack);
                    }
                    return [
                        4,
                        VideoDecoder.isConfigSupported(decoderConfig)
                    ];
                case 3:
                    _ref = _state.sent(), config = _ref.config, supported = _ref.supported;
                    console.log(config);
                    if (!supported) {
                        window.alert("当前设备不支持解码 codec: ".concat(avcTrack.codec));
                        return [
                            2
                        ];
                    }
                    frameCount = 0;
                    decoder = new VideoDecoder({
                        output: function(frame) {
                            ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
                            frame.close();
                            var now = performance.now();
                            var fps = "";
                            if (frameCount++) {
                                fps = (1000 * (frameCount / (now - startTime))).toFixed(0) + " FPS";
                            } else {
                                startTime = now;
                            }
                            ctx.fillText(fps, 20, 50);
                        },
                        error: console.error
                    });
                    // 配置 VideoDecoder
                    decoder.configure(decoderConfig);
                    sleep = function(ms) {
                        return new Promise(function(r) {
                            return setTimeout(r, ms);
                        });
                    };
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 4;
                case 4:
                    _state.trys.push([
                        4,
                        9,
                        10,
                        11
                    ]);
                    _iterator = avcTrack.frames[Symbol.iterator]();
                    _state.label = 5;
                case 5:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        8
                    ];
                    frame = _step.value;
                    data = isAvcC ? avcC(frame.units) : AnnexB(frame.units);
                    timestamp = frame.pts / 90000;
                    duration = frame.duration / 90000;
                    chunk = new EncodedVideoChunk({
                        type: frame.key ? "key" : "delta",
                        timestamp: timestamp * 1000000,
                        duration: duration * 1000000,
                        data: data
                    });
                    decoder.decode(chunk);
                    return [
                        4,
                        sleep(duration * 1000)
                    ];
                case 6:
                    _state.sent();
                    _state.label = 7;
                case 7:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        5
                    ];
                case 8:
                    return [
                        3,
                        11
                    ];
                case 9:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        11
                    ];
                case 10:
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                    return [
                        7
                    ];
                case 11:
                    return [
                        2
                    ];
            }
        });
    });
    return _main.apply(this, arguments);
}
function AnnexB(units) {
    var size = units.reduce(function(t, u) {
        return t + u.byteLength;
    }, 0) + units.length * 3;
    var data = new Uint8Array(size);
    var offset = 0;
    units.forEach(function(unit) {
        data.set([
            0,
            0,
            1
        ], offset);
        offset += 3;
        data.set(unit, offset);
        offset += unit.byteLength;
    });
    return data;
}
function avcC(units) {
    var size = units.reduce(function(t, u) {
        return t + u.byteLength;
    }, 0) + units.length * 4;
    var data = new Uint8Array(size);
    var dataView = new DataView(data.buffer);
    var offset = 0;
    units.forEach(function(unit) {
        dataView.setUint32(offset, unit.byteLength);
        offset += 4;
        data.set(unit, offset);
        offset += unit.byteLength;
    });
    return data;
}
function AVCDecoderConfigurationRecord(track) {
    var sps = [];
    var pps = [];
    var len;
    track.sps.forEach(function(s) {
        var _sps;
        len = s.byteLength;
        sps.push(len >>> 8 & 0xff);
        sps.push(len & 0xff);
        (_sps = sps).push.apply(_sps, _to_consumable_array(s));
    });
    track.pps.forEach(function(p) {
        var _pps;
        len = p.byteLength;
        pps.push(len >>> 8 & 0xff);
        pps.push(len & 0xff);
        (_pps = pps).push.apply(_pps, _to_consumable_array(p));
    });
    return new Uint8Array([
        0x01,
        track.profileIdc,
        track.profileCompatibility,
        track.levelIdc,
        0xfc | 3,
        0xe0 | track.sps.length
    ].concat(sps).concat([
        track.pps.length
    ]).concat(pps));
}

 //# sourceMappingURL=a.js.map