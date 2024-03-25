import { streamBridgeContainer } from '../container';


import PlayerService from '../services/steamBridgePlayer';
import { IBridgePlayerConfig } from '../types/services';
import { TYPES } from './symbol';
import StreamBridgePlayer from '../services/steamBridgePlayer';
import MediaRenderEngine from '../services/steamBridgePlayer/render';


streamBridgeContainer.bind<StreamBridgePlayer>(TYPES.IStreamBridePlayer).to(StreamBridgePlayer);
streamBridgeContainer.bind<MediaRenderEngine>(TYPES.IMediaRenderEngine).to(MediaRenderEngine);


function createStreamBridgePlayerInstance(config: IBridgePlayerConfig): PlayerService {
  let playerInstance = streamBridgeContainer.get<PlayerService>(TYPES.IStreamBridePlayer);
  playerInstance.init(config);
   return playerInstance;
 }

 export { createStreamBridgePlayerInstance };