import { streamBridgeContainer } from '../container';


import PlayerService from '../services/steamBridgePlayer';
import { IBridgePlayerConfig } from '../types/services';
import { TYPES } from './symbol';
import StreamBridgePlayer from '../services/steamBridgePlayer';
import MediaRenderEngine from '../services/steamBridgePlayer/render';
import StreamIo from '../services/steamBridgePlayer/streamIo';

streamBridgeContainer.bind<StreamBridgePlayer>(TYPES.IStreamBridePlayer).to(StreamBridgePlayer);
streamBridgeContainer.bind<MediaRenderEngine>(TYPES.IMediaRenderEngine).to(MediaRenderEngine);
streamBridgeContainer.bind<StreamIo>(TYPES.IStreamIo).to(StreamIo);


function createStreamBridgePlayerInstance(config: IBridgePlayerConfig): PlayerService {
  let playerInstance = streamBridgeContainer.get<PlayerService>(TYPES.IStreamBridePlayer);
  playerInstance.init(config);
   return playerInstance;
 }

 export { createStreamBridgePlayerInstance };