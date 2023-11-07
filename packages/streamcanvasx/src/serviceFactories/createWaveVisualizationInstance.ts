import { waveVisualizationContainer } from '../container';

import { TYPES } from './symbol';

import WaveVisualization from '../services/waveVisualization/waveVisualization';
import WavePlayerService from '../services/audio/wavePlayer';
import AudioWaveService from '../services/audio/audioWaveService';
import WaveGl from '../services/renderingEngines/webgl-waveform-visualization';

import { IWavePlayerConfig } from '../types/services';

waveVisualizationContainer.bind<WaveVisualization>(TYPES.IWaveVisualization).to(WaveVisualization);
waveVisualizationContainer.bind<WavePlayerService>(TYPES.IWavePlayerService).to(WavePlayerService);
waveVisualizationContainer.bind<AudioWaveService>(TYPES.IAudioWaveService).to(AudioWaveService);
waveVisualizationContainer.bind<WaveGl>(TYPES.IWaveGl).to(WaveGl);

function createWaveVisualizationInstance(config: IWavePlayerConfig): WaveVisualization {
  let playerInstance = waveVisualizationContainer.get<WaveVisualization>(TYPES.IWaveVisualization);
  playerInstance.init(config || {});
   return playerInstance;
 }

export { createWaveVisualizationInstance };