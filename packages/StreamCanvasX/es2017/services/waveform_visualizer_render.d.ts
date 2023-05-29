import { IDrawer } from '..';
export declare class WaveformVisualizer implements IDrawer {
    mediaSource_el: HTMLAudioElement | HTMLVideoElement;
    canvas: HTMLCanvasElement;
    audioContext: AudioContext;
    canvasContext: CanvasRenderingContext2D;
    analyserNode: AnalyserNode;
    audioSourceNode: MediaElementAudioSourceNode;
    drawAudio1(): void;
}
