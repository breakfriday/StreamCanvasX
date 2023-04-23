import { container1 } from '../container';
import { AppClass } from '../services/orignClass';
import { ServiceA } from '../services/ServiceA';
import AudioProcessingService from '../services/audio_processing_service';

container1.bind<AppClass>(AppClass).toSelf();
container1.bind<ServiceA>(ServiceA).toSelf();


container1.bind<AudioProcessingService>(AudioProcessingService).to(AudioProcessingService);

// const instance = container1.get<AppClass>(AppClass);

// instance.logger.logMessage('asdf');


// 创建一个工厂函数来创建 BusinessService 实例
function createProcessService(): AppClass {
  return container1.get<AppClass>(AppClass);
}


export default createProcessService;
