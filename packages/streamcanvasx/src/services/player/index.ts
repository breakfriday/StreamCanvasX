import { injectable, inject, Container } from 'inversify';
import Emitter from '../../utils/emitter';

import { ServiceA } from '../ServiceA';
import { TYPES } from '../../serviceFactories/symbol';

@injectable()
class PlayerService extends Emitter {
    logger: ServiceA;
    constructor(@inject(TYPES.IServiceA) logger: ServiceA) {
        super();
    }
    log() {
        alert(22);
    }
}

export default PlayerService;
