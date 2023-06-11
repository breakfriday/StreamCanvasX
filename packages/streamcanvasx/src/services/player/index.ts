import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import Emitter from '../../utils/emitter';

import { ServiceA } from '../ServiceA';
import { TYPES } from '../../serviceFactories/symbol';
import HttpFlvStreamService from '../stream/fetch_stream_loader';
import FlvDemuxService from '../demux/flvDemux';

@injectable()
class PlayerService extends Emitter {
    logger: ServiceA;
    httpFlvStreamService: HttpFlvStreamService;
    flvVDemuxService: FlvDemuxService;
    constructor(
        @inject(TYPES.IServiceA) logger: ServiceA,
        @inject(TYPES.IHttpFlvStreamLoader) httpFlvStreamService: HttpFlvStreamService,
        @inject(TYPES.IFLVDemuxService) flvVDemuxService: FlvDemuxService,
        ) {
        super();
        this.httpFlvStreamService = httpFlvStreamService;
        this.flvVDemuxService = flvVDemuxService;
        this.init();
    }

    init() {
        this.httpFlvStreamService.init(this);
    }
    log() {
        alert(22);
    }
    fetchstrean(url: string) {
        this.httpFlvStreamService.fetchStream(url);
    }

    play(url: string) {
        this.httpFlvStreamService.fetchStream(url);
    }
}

export default PlayerService;
