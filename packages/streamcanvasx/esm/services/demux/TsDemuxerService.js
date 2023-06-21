// MPEG-2 TS 数据流的解复用 , 转换 mpeg-ts流为h.264视频的类
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var AvcFrame = function AvcFrame(pts, dts) {
    "use strict";
    _class_call_check(this, AvcFrame);
    _define_property(this, "pts", void 0);
    _define_property(this, "dts", void 0);
    _define_property(this, "units", void 0);
    _define_property(this, "frame", void 0);
    _define_property(this, "key", void 0);
    _define_property(this, "duration", void 0);
    this.pts = pts;
    this.dts = dts;
    this.units = [];
    this.frame = false;
    this.key = false;
    this.duration = 0;
};
var TsDemuxer = /*#__PURE__*/ function() {
    "use strict";
    function TsDemuxer() {
        _class_call_check(this, TsDemuxer);
        _define_property(this, "prevAvcFrame", void 0);
        this.prevAvcFrame = null;
    }
    _create_class(TsDemuxer, [
        {
            key: "demux",
            value: function demux(data) {
                var pmtId = -1;
                var avcId = -1;
                var avcPesData = [];
                var avcTrack = {
                    codec: "",
                    width: 0,
                    height: 0,
                    profileIdc: null,
                    profileCompatibility: null,
                    levelIdc: null,
                    pps: [],
                    sps: [],
                    frames: []
                };
                for(var start = 0, len = data.length; start < len; start += 188){
                    if (data[start] !== 0x47) throw new Error("TS packet did not start with 0x47");
                    var payloadUnitStartIndicator = !!(data[start + 1] & 0x40);
                    var pid = ((data[start + 1] & 0x1f) << 8) + data[start + 2];
                    var adaptationFiledControl = (data[start + 3] & 0x30) >> 4;
                    var offset = void 0;
                    if (adaptationFiledControl > 1) {
                        offset = start + 5 + data[start + 4];
                        if (offset === start + 188) continue;
                    } else {
                        offset = start + 4;
                    }
                    switch(pid){
                        case 0:
                            if (payloadUnitStartIndicator) offset += data[offset] + 1;
                            pmtId = (data[offset + 10] & 0x1f) << 8 | data[offset + 11];
                            break;
                        case pmtId:
                            {
                                if (payloadUnitStartIndicator) offset += data[offset] + 1;
                                var tableEnd = offset + 3 + ((data[offset + 1] & 0x0f) << 8 | data[offset + 2]) - 4;
                                var programInfoLength = (data[offset + 10] & 0x0f) << 8 | data[offset + 11];
                                offset += 12 + programInfoLength;
                                while(offset < tableEnd){
                                    var esPid = (data[offset + 1] & 0x1f) << 8 | data[offset + 2];
                                    switch(data[offset]){
                                        case 0x1b:
                                            avcId = esPid;
                                            break;
                                    }
                                    offset += ((data[offset + 3] & 0x0f) << 8 | data[offset + 4]) + 5;
                                }
                            }
                            break;
                        case avcId:
                            if (payloadUnitStartIndicator && avcPesData.length) {
                                var pes = TsDemuxer.parsePES(concatUint8Array.apply(void 0, _to_consumable_array(avcPesData)));
                                if (pes) {
                                    var units = parseAnnexBNALus(pes.data).units;
                                    if (units) this.createAvcFrames(avcTrack, units, pes.pts, pes.dts);
                                }
                                avcPesData = [];
                            }
                            avcPesData.push(data.subarray(offset, start + 188));
                            break;
                    }
                }
                for(var i = 0, l = avcTrack.frames.length, offset1 = 0, frame, nextFrame; i < l; i++){
                    frame = avcTrack.frames[i];
                    nextFrame = avcTrack.frames[i + 1];
                    if (nextFrame) {
                        frame.duration = nextFrame.dts - frame.dts;
                    } else {
                        var _avcTrack_frames_;
                        frame.duration = ((_avcTrack_frames_ = avcTrack.frames[i - 1]) === null || _avcTrack_frames_ === void 0 ? void 0 : _avcTrack_frames_.duration) || 0;
                    }
                }
                return {
                    video: avcTrack
                };
            }
        },
        {
            key: "createAvcFrames",
            value: function createAvcFrames(track, units, pts, dts) {
            // 省略代码，因为它和你提供的代码基本一样
            }
        }
    ], [
        {
            key: "parsePES",
            value: function parsePES(data) {
            // 省略代码，因为它和你提供的代码基本一样
            }
        },
        {
            key: "getSyncOffset",
            value: function getSyncOffset(data) {
            // 省略代码，因为它和你提供的代码基本一样
            }
        }
    ]);
    return TsDemuxer;
}();
