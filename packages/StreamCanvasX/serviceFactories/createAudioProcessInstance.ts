import { container1 } from '../container';
import AudioProcessingService from '../services/audioProcessingService';
import { TYPES } from './symbol';
import { IAudioProcessingService } from '../types/services';


container1.bind<IAudioProcessingService>(TYPES.IAudioProcessingService).to(AudioProcessingService);


// 创建一个工厂函数来创建 AudioProcessingService实例
function createAudioProcessingService(): IAudioProcessingService {
  return container1.get<IAudioProcessingService>(TYPES.IAudioProcessingService);
}


export default createAudioProcessingService;
