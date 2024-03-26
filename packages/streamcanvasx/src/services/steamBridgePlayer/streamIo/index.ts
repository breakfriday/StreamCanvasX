import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../index';
import FetchLoader from "./fetch_loader";

@injectable()
class StreamIo {
    _ioLoader: FetchLoader
    playerService: PlayerService
    constructor() {

    }
    init(playerService: PlayerService) {
        this.playerService=playerService;
        this._ioLoader=new FetchLoader();
        this._ioLoader.init(playerService);
    }
    open() {
        this._ioLoader.open();
    }
    abort() {

    }

    process() {

    }
}

export default StreamIo;