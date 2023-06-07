import { IProcess } from '../types/services';
declare class AudioProcessingService {
    context: IProcess['context'];
    dataArray: Float32Array;
    bufferLength: number;
    bufferData: Float32Array;
    bufferDataLength: number;
    constructor(parmams: {
        media_el?: HTMLAudioElement;
        canvas_el?: HTMLCanvasElement;
    });
    createAudioContext(): void;
    setBufferData(): void;
    updateBufferData(): void;
    drawWithBufferData(): void;
    setCanvasDom(el: HTMLCanvasElement): void;
    setMediaSource_el(el: any): void;
    resetAudioContextConnec(): void;
    audioContextConnect(): void;
    mute(parm: any): void;
    visulizerDraw(): void;
    visulizerDraw1(): void;
    visulizerDraw2(): void;
    visulizerDraw3(): void;
    visulizerDraw4(): void;
}
export default AudioProcessingService;
