import { container1 } from '../container';
import { OriginSerivce } from '../services/orignClass';
import { ServiceA } from '../services/ServiceA';
 import HttpFlvStreamLoader from '../services/stream/fetch_stream_loader';
import { TYPES } from './symbol';
import { IOriginSerivce, IServiceA } from '../types/services';
import { interfaces } from 'inversify';
import PlayerService from '../services/player';

import FLVDemuxService from '../services/demux/flvDemux';


container1.bind<PlayerService>(TYPES.IPlayerService).to(PlayerService);
container1.bind<HttpFlvStreamLoader>(TYPES.IHttpFlvStreamLoader).to(HttpFlvStreamLoader);

container1.bind<FLVDemuxService>(TYPES.IFLVDemuxService).to(FLVDemuxService);

 function createPlayerServiceInstance(): PlayerService {
   return container1.get<PlayerService>(TYPES.IPlayerService);
 }

 export { createPlayerServiceInstance };