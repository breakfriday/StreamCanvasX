import { HttpFlvStreamLoader } from '../services/stream/fetch_stream_loader';

import { fLVDemux } from '../services/demux/flvDemux';

import WebcodecsDecoder from '../services/decoder/webcodecs';

import Emitter from '../utils/emitter';

import { DEFAULT_PLAYER_OPTIONS } from '../constant/index';

import { I_DEFAULT_PLAYER_OPTIONS } from '../types/services/index';


class Player extends Emitter {
    HttpFlvStreamLoader: HttpFlvStreamLoader;
    fLVDemux: fLVDemux;
    stream: HttpFlvStreamLoader;
    webcodecsDecoder: WebcodecsDecoder;
    _opt: I_DEFAULT_PLAYER_OPTIONS;
    _times: any;
    constructor(options: any) {
        super();
        this.HttpFlvStreamLoader = new HttpFlvStreamLoader();
        this.fLVDemux = new fLVDemux(this);
        this._opt = Object.assign({}, DEFAULT_PLAYER_OPTIONS, options);

        this._times = {
            playInitStart: '', // 1
            playStart: '', // 2
            streamStart: '', // 3
            streamResponse: '', // 4
            demuxStart: '', // 5
            decodeStart: '', // 6
            videoStart: '', // 7
            playTimestamp: '', // playStart- playInitStart
            streamTimestamp: '', // streamStart - playStart
            streamResponseTimestamp: '', // streamResponse - streamStart_times
            demuxTimestamp: '', // demuxStart - streamResponse
            decodeTimestamp: '', // decodeStart - demuxStart
            videoTimestamp: '', // videoStart - decodeStart
            allTimestamp: '', // videoStart - playInitStart
        };
    }

    play() {
        this.init();
    }

    init() {
        if (!this.fLVDemux) {
            this.fLVDemux = new fLVDemux(this);
        }
        if (!this.stream) {
            this.stream = new HttpFlvStreamLoader(this);
        }
        if (!this.webcodecsDecoder) {
            this.webcodecsDecoder = new WebcodecsDecoder(this);
        }
    }

    fetchStream(url: string) {
        this.stream.fetchStream(url);
    }
}


export default Player;