interface IDrawer {
    mediaSource_el: HTMLAudioElement | HTMLVideoElement;
    canvas: HTMLCanvasElement;
    audioContext: AudioContext;
    canvasContext: CanvasRenderingContext2D;
    analyserNode: AnalyserNode;
    audioSourceNode: MediaElementAudioSourceNode;
  }

  interface IProcess {
    context: IDrawer;
  }

  // 这是音频可视化的 绘图接口
  interface IWaveDecorator{
    drawAudio1: () => void;


  }


interface IOriginSerivce {
    logger: IServiceA;


    doSomething: () => void;
  }

interface IServiceA {
    logMessage: (message: string) => void;
  }


interface IAudioProcessingService{
  context: IProcess['context'];

}