import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../player';

@injectable()
class AudioProcessingService {
    context: {
        audioContext?: AudioContext;
        analyserNode?: AnalyserNode;
        gainNode?: GainNode;
        audioSourceNode?: MediaElementAudioSourceNode;
        mediaSource_el?: HTMLAudioElement | HTMLVideoElement;
    };
    bufferLength: number;
    dataArray: any;
    bufferData: Float32Array; // 时域 缓存
    bufferDataLength: number;


    constructor() {
      this.context = {};
    }


    init(playerService: PlayerService, option: {media_el: HTMLVideoElement}) {
        let { media_el } = option;
         this.createAudioContext();
         this.setMediaSource_el(media_el);
         this.audioContextConnect();
    }

    updateBufferData() {
        let { dataArray, bufferData } = this;
        let { bufferDataLength } = this;
          // 将旧的数据向前移动
        bufferData.copyWithin(0, dataArray.length);
        this.context.analyserNode?.getFloatTimeDomainData(dataArray);
        // 将新的数据添加到缓存的末尾
        bufferData.set(dataArray, bufferDataLength - dataArray.length);
        // 每帧都更新缓存
        requestAnimationFrame(this.updateBufferData.bind(this));
    }


  setMediaSource_el(el: HTMLVideoElement) {
    this.context.mediaSource_el = el;
    this.context.audioSourceNode = this.context.audioContext!.createMediaElementSource(el);
  }

    createAudioContext() {
        this.context.audioContext = new AudioContext();
        this.context.analyserNode = this.context.audioContext.createAnalyser();

        this.context.analyserNode.fftSize = 512;
        this.context.gainNode = this.context.audioContext.createGain();

        this.bufferLength = this.context.analyserNode.fftSize;
        this.dataArray = new Float32Array(this.bufferLength);
        this.setBufferData();
      }

      resetAudioContextConnec() {
        this.context.audioSourceNode?.disconnect();
        this.audioContextConnect();
      }

      audioContextConnect() {
        this.context.audioSourceNode!.connect(this.context.analyserNode!);
        this.context.analyserNode!.connect(this.context.audioContext!.destination);
      }

      mute(parm?: boolean) {
        if (parm === true) {
          this.context.analyserNode!.disconnect(this.context.audioContext!.destination);
        } else {
          this.context.analyserNode!.connect(this.context.audioContext!.destination);
        }
      }


      setBufferData() {
        // 根据 AudioContext 的采样率、所需的缓存时间和 FFT 大小来设置缓存区大小
       this.bufferDataLength = Math.ceil(1 * this.context.audioContext!.sampleRate / this.dataArray.length) * this.dataArray.length;
       this.bufferData = new Float32Array(this.bufferDataLength);
      }
}

export default AudioProcessingService;