import AudioProcessingService from '../services/audioProcessingService';
declare function createAudioProcessingServiceInstance(parmams: {
    media_el?: HTMLMediaElement;
    canvas_el?: HTMLCanvasElement;
}): AudioProcessingService;
export { createAudioProcessingServiceInstance };
