import { container1 } from '../container';
import { OriginSerivce } from '../services/orignClass';
import { ServiceA } from '../services/ServiceA';
 import HttpFlvStreamLoader from '../services/stream/fetch_stream_loader';
import { TYPES } from './symbol';
import { IOriginSerivce, IServiceA } from '../types/services';
import { interfaces } from 'inversify';
import PlayerService from '../services/player';


container1.bind<PlayerService>(TYPES.IPlayerService).to(PlayerService);
container1.bind<HttpFlvStreamLoader>(TYPES.IHttpFlvStreamLoader).to(HttpFlvStreamLoader);

 function createPlayerServiceInstance(): PlayerService {
   return container1.get<PlayerService>(TYPES.IPlayerService);
 }

 export { createPlayerServiceInstance };