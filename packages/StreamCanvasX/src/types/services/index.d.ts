export interface IDrawer {
    mediaSource_el?: HTMLAudioElement | HTMLVideoElement;
    canvas?: HTMLCanvasElement;
    audioContext?: AudioContext;
    canvasContext?: CanvasRenderingContext2D;
    analyserNode?: AnalyserNode;
    audioSourceNode?: MediaElementAudioSourceNode;
  }

  export interface IProcess {
    context: IDrawer;
  }

  // 这是音频可视化的 绘图接口
  export interface IWaveDecorator{
    drawAudio1: () => void;


  }


export interface IOriginSerivce {
    logger: IServiceA;


    doSomething: () => void;
  }

export interface IOriginSerivceFactory{
  (Name: string): IOriginSerivce;
}

export interface IServiceA {
    logMessage: (message: string) => void;
  }


export interface IAudioProcessingService{
  context: IProcess['context'];

}


 interface playerParms{
  type: string; isLive: boolean; url: string;
}


export interface ImainPlayerService{
 createFlvPlayer: (parms: Partial<playerParms>) => void;
 set_blob_url: (filedata: File) => void;
 analyzeCanvas: () => void;

}
