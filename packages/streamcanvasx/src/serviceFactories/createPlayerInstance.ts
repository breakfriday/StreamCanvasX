import { containerPlayer } from '../container';

 import HttpFlvStreamLoader from '../services/stream/fetch_stream_loader';
import { TYPES } from './symbol';


import PlayerService from '../services/player';

import FLVDemuxService from '../services/demux/flvDemux';


containerPlayer.bind<PlayerService>(TYPES.IPlayerService).to(PlayerService);
containerPlayer.bind<HttpFlvStreamLoader>(TYPES.IHttpFlvStreamLoader).to(HttpFlvStreamLoader);

containerPlayer.bind<FLVDemuxService>(TYPES.IFLVDemuxService).to(FLVDemuxService);

 function createPlayerServiceInstance(): PlayerService {
   return containerPlayer.get<PlayerService>(TYPES.IPlayerService);
 }

 export { createPlayerServiceInstance };