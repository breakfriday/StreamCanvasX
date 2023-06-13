import { containerPlayer } from '../container';

 import HttpFlvStreamLoader from '../services/stream/fetch_stream_loader';
import { TYPES } from './symbol';

import WebcodecsDecoderService from '../services/decoder/webcodecs';


import PlayerService from '../services/player';

import FLVDemuxService from '../services/demux/flvDemux';

import CanvasVideoService from '../services/video/canvasVideoService';

import DebugLogService from '../services/DebugLogService';


containerPlayer.bind<PlayerService>(TYPES.IPlayerService).to(PlayerService);
containerPlayer.bind<HttpFlvStreamLoader>(TYPES.IHttpFlvStreamLoader).to(HttpFlvStreamLoader);

containerPlayer.bind<WebcodecsDecoderService>(TYPES.IWebcodecsDecoderService).to(WebcodecsDecoderService);

containerPlayer.bind<FLVDemuxService>(TYPES.IFLVDemuxService).to(FLVDemuxService);

containerPlayer.bind<CanvasVideoService>(TYPES.ICanvasVideoService).to(CanvasVideoService);

containerPlayer.bind<DebugLogService>(TYPES.IDebugLogService).to(DebugLogService);

 function createPlayerServiceInstance(): PlayerService {
   return containerPlayer.get<PlayerService>(TYPES.IPlayerService);
 }

 export { createPlayerServiceInstance };