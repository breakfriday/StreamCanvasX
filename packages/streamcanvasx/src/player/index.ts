import { HttpFlvStreamLoader } from '../services/stream/fetch_stream_loader';

import { fLVDemux } from '../services/demux/flvDemux';

import WebcodecsDecoder from '../services/decoder/webcodecs';

import Emitter from '../utils/emitter';

import { DEFAULT_PLAYER_OPTIONS } from '../constant/index';


class Player extends Emitter {
    HttpFlvStreamLoader: HttpFlvStreamLoader;
    fLVDemux: fLVDemux;
    stream: HttpFlvStreamLoader;
    webcodecsDecoder: WebcodecsDecoder;
    constructor() {
        super();
        this.HttpFlvStreamLoader = new HttpFlvStreamLoader();
        this.fLVDemux = new fLVDemux(this);
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
}


export default Player;