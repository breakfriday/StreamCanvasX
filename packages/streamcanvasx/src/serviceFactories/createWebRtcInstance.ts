import { WebRTCInjectionContainer } from '../container';

import RTCPlayerService from '../services/webrtc';
import { TYPES } from './symbol';


WebRTCInjectionContainer.bind<RTCPlayerService>(TYPES.IRTCPlayerService).to(RTCPlayerService);

function createRTCPlayerServiceInstance(config: any): RTCPlayerService {
    let playerInstance = WebRTCInjectionContainer.get<RTCPlayerService>(TYPES.IPlayerService);
    playerInstance.init(config || {});
     return playerInstance;
   }

   export { createRTCPlayerServiceInstance };