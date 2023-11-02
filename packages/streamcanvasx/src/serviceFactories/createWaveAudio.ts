import { waveAudioContainer } from '../container';


import { TYPES } from './symbol';

import { IRTCPlayerConfig } from '../types/services';
import RenderEngine from '../services/renderingEngines/baseEngine';


waveAudioContainer.bind<RenderEngine>(TYPES.IRenderEngine).to(RenderEngine);


function createWaveAudioServiceInstance(config: IRTCPlayerConfig): RenderEngine {
    let playerInstance = waveAudioContainer.get<RenderEngine>(TYPES.IRenderEngine);
    playerInstance.init(config || {});
     return playerInstance;
   }

 export { createWaveAudioServiceInstance };