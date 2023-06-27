import { containerPlayer } from '../container';

 import HttpFlvStreamLoader from '../services/stream/fetch_stream_loader';
import { TYPES } from './symbol';

import WebcodecsDecoderService from '../services/decoder/webcodecs';


import PlayerService from '../services/player';

import FLVDemuxService from '../services/demux/flvDemux';

import CanvasVideoService from '../services/video/canvasVideoService';

import DebugLogService from '../services/DebugLogService';

import FLVDemuxStream from '../services/demux/flvDemuxStream';

import AudioProcessingService from '../services/audio/audioContextService';

import { IplayerConfig } from '../types/services';


containerPlayer.bind<PlayerService>(TYPES.IPlayerService).to(PlayerService);
containerPlayer.bind<HttpFlvStreamLoader>(TYPES.IHttpFlvStreamLoader).to(HttpFlvStreamLoader);

containerPlayer.bind<WebcodecsDecoderService>(TYPES.IWebcodecsDecoderService).to(WebcodecsDecoderService);

containerPlayer.bind<FLVDemuxService>(TYPES.IFLVDemuxService).to(FLVDemuxService);

containerPlayer.bind<CanvasVideoService>(TYPES.ICanvasVideoService).to(CanvasVideoService);

containerPlayer.bind<DebugLogService>(TYPES.IDebugLogService).to(DebugLogService);

containerPlayer.bind<AudioProcessingService>(TYPES.IAudioProcessingService).to(AudioProcessingService);

containerPlayer.bind<FLVDemuxStream>(TYPES.IFLVDemuxStream).to(FLVDemuxStream);
 function createPlayerServiceInstance(config: IplayerConfig): PlayerService {
  let playerInstance = containerPlayer.get<PlayerService>(TYPES.IPlayerService);
  playerInstance.init(config || {});
   return playerInstance;
 }

 export { createPlayerServiceInstance };