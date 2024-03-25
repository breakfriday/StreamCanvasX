import { streamBridgeContainer } from '../container';


import PlayerService from '../services/steamBridgePlayer';
import { IBridgePlayerConfig } from '../types/services';
import { TYPES } from './symbol';
import StreamBridgePlayer from '../services/steamBridgePlayer';


streamBridgeContainer.bind<StreamBridgePlayer>(TYPES.IStreamBridePlayer).to(StreamBridgePlayer);


function createStreamBridgePlayerInstance(config: IBridgePlayerConfig): PlayerService {
  let playerInstance = streamBridgeContainer.get<PlayerService>(TYPES.IStreamBridePlayer);
  playerInstance.init(config);
   return playerInstance;
 }

 export { createStreamBridgePlayerInstance };