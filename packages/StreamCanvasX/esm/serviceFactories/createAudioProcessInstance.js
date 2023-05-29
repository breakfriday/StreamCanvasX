import { container1 } from "../container";
import AudioProcessingService from "../services/audioProcessingService";
import { TYPES } from "./symbol";
container1.bind(TYPES.IAudioProcessingService).toFactory(function(context) {
    return function(parmams) {
        var instance = new AudioProcessingService(parmams);
        return instance;
    };
});
// 创建一个工厂函数来创建 AudioProcessingService实例
function createAudioProcessingService() {
    return container1.get(TYPES.IAudioProcessingService);
}
function createAudioProcessingServiceInstance(parmams) {
    var AudioProcessingServiceFactory = container1.get(TYPES.IAudioProcessingService);
    var instance = AudioProcessingServiceFactory(parmams);
    return instance;
}
export { createAudioProcessingServiceInstance };

 //# sourceMappingURL=createAudioProcessInstance.js.map