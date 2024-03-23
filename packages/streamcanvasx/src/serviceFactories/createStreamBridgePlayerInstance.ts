import { container1, containerPlayer } from '../container';




import PlayerService from '../services/player';


 function createPlayerServiceInstance(config: IplayerConfig): PlayerService {
  let playerInstance = containerPlayer.get<PlayerService>(TYPES.IPlayerService);
  playerInstance.init(config || {});
   return playerInstance;
 }

 export { createPlayerServiceInstance };