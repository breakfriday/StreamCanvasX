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

interface Iconfig{
  useCanvas: boolean;
  cutCanvas: boolean;
  useWebGpu: boolean;

}

interface IfactoryParms{
  config: Partial<Iconfig>;
  root_el: HTMLElement;
  canvas_el: HTMLCanvasElement;
}


export interface ImainPlayerService{
 createFlvPlayer: (parms: Partial<playerParms>) => void;
 set_blob_url: (filedata: File) => void;
 analyzeCanvas: () => void;
 setConfig: (parms: Partial<Iconfig>) => void;
 factory: (parms: Partial<IfactoryParms>) => void;

}


export interface Idemux{
  isIFrame: boolean;
  IData: {
    ts: number;
    cts?: number;
    payload: Uint8Array;
    type: number;
    isIFrame?: boolean;
  };
}

export interface I_DEFAULT_PLAYER_OPTIONS {
  videoBuffer: number;
  videoBufferDelay: number;
  isResize: boolean;
  isFullResize: boolean;
  isFlv: boolean;
  debug: boolean;
  hotKey: boolean;
  loadingTimeout: number;
  heartTimeout: number;
  timeout: number;
  loadingTimeoutReplay: boolean;
  heartTimeoutReplay: boolean;
  loadingTimeoutReplayTimes: number;
  heartTimeoutReplayTimes: number;
  supportDblclickFullscreen: boolean;
  showBandwidth: boolean;
  keepScreenOn: boolean;
  isNotMute: boolean;
  hasAudio: boolean;
  hasVideo: boolean;
  operateBtns: {
      fullscreen: boolean;
      screenshot: boolean;
      play: boolean;
      audio: boolean;
      record: boolean;
  };
  controlAutoHide: boolean;
  hasControl: boolean;
  loadingText: string;
  background: string;
  decoder: string;
  url: string;
  rotate: number;
  forceNoOffscreen: boolean;
  hiddenAutoPause: boolean;
  protocol: number;
  demuxType: string;
  useWCS: boolean;
  wcsUseVideoRender: boolean;
  useMSE: boolean;
  useOffscreen: boolean;
  autoWasm: boolean;
  wasmDecodeErrorReplay: boolean;
  openWebglAlignment: boolean;
  wasmDecodeAudioSyncVideo: boolean;
  recordType: string;
  useWebFullScreen: boolean;
}