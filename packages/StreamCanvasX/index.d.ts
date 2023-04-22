// 定义一个播放器 process接口
interface IDrawer {
  mediaSource_el: HTMLAudioElement|HTMLVideoElement;
  canvas: HTMLCanvasElement;
  audioContext: AudioContext;
  canvasContext: CanvasRenderingContext2D;
  analyserNode: AnalyserNode;
  audioSourceNode: MediaElementAudioSourceNode;
}

// 这是音频可视化的 绘图接口
interface IWaveDecorator{
  drawAudio1: () => void;
  drawAudio2: () => void;
  drawAudio3: () => void;
  drawAudio4: () => void;

}
