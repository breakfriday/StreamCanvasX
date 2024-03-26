import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../index';
import FetchLoader from "./fetch_loader";
import { BridgePlayerStreamType } from '../../../constant';
@injectable()
class StreamIo {
    _ioLoader: FetchLoader
    playerService: PlayerService
    constructor() {

    }
    init(playerService: PlayerService) {
        this.playerService=playerService;
        let stremType=this.playerService.config.stremType
        if(stremType===BridgePlayerStreamType.http_yuv){
            this._ioLoader=new FetchLoader();
        }else {
            
        }
       
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