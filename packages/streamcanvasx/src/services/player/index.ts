import { injectable, inject, Container } from 'inversify';
import Emitter from '../../utils/emitter';

import { ServiceA } from '../ServiceA';
import { TYPES } from '../../serviceFactories/symbol';
import HttpFlvStreamService from '../stream/fetch_stream_loader';

@injectable()
class PlayerService extends Emitter {
    logger: ServiceA;
    httpFlvStreamService: HttpFlvStreamService;
    constructor(
        @inject(TYPES.IServiceA) logger: ServiceA,
        @inject(TYPES.IHttpFlvStreamLoader) httpFlvStreamService: HttpFlvStreamService,
        ) {
        super();
        this.httpFlvStreamService = httpFlvStreamService;
    }
    log() {
        alert(22);
    }
    fetchstrean(url: string) {
        this.httpFlvStreamService.fetchStream(url);
    }
}

export default PlayerService;
