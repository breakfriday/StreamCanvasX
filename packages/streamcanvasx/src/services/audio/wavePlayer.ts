import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import { TYPES } from '../../serviceFactories/symbol';
import AudioWaveService from './audioWaveService';
import { IWavePlayerConfig } from '../../types/services';


@injectable()
class WavePlayer {
  audioWaveService: AudioWaveService;

  constructor(
    @inject(TYPES.IAudioWaveService) audioWaveService: AudioWaveService,
    ) {
  this.audioWaveService = audioWaveService;
  }

  init(config?: IWavePlayerConfig) {
    this.audioWaveService.init(config);
  }
}
export default WavePlayer;