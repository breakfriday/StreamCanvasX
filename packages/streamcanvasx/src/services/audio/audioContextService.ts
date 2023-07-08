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
    playerService: PlayerService;
    clear: boolean;
    timeId: any;


    constructor() {
      this.context = {};
    }


    init(playerService: PlayerService, option: {media_el: HTMLVideoElement}) {
        let { media_el } = option;
         this.createAudioContext();
         this.setMediaSource_el(media_el);
         this.audioContextConnect();
         this.playerService = playerService;

         if (playerService.config.showAudio === true) {
          this.updateBufferData();
         }
    }

    clearCanvas() {
      let canvasContext = this.playerService.canvasVideoService.canvas_context;
      let canvas = this.playerService.canvasVideoService.canvas_el;
      this.clear = true;
      // 清除画布
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }

    visulizerDraw1() {
      let dataArray = this.bufferData;
      let bufferLength = this.bufferDataLength;

      let canvasContext = this.playerService.canvasVideoService.canvas_context;
      let canvas = this.playerService.canvasVideoService.canvas_el;

      let animationId: number | null = null;
      const AnimationFrame = () => {
        if (this.clear === true) {
          // this.destory()

          cancelAnimationFrame(animationId);

          return false;
        }

        if (this.playerService.canvasVideoService.loading === false) {
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);

          // 设置波形图样式
          canvasContext.lineWidth = 2;
          canvasContext.strokeStyle = '#7f0';


          // 绘制波形图
          canvasContext.beginPath();
          const sliceWidth = canvas.width / bufferLength;
          let x = 0;
          for (let i = 0; i < bufferLength; i++) {
            const value = dataArray[i] * canvas.height / 2;
            const y = canvas.height / 2 + value;

            if (i === 0) {
              canvasContext.moveTo(x, y);
            } else {
              canvasContext.lineTo(x, y);
            }

            x += sliceWidth;
          }
          canvasContext.lineTo(canvas.width, canvas.height / 2);
          canvasContext.stroke();
        }
        // 清除画布


        // 循环绘制
        animationId = requestAnimationFrame(AnimationFrame.bind(this));
      };
      AnimationFrame();
    }

    visulizerDraw() {
      let canvasContext = this.playerService.canvasVideoService.canvas_context;
      let canvas = this.playerService.canvasVideoService.canvas_el;

      const bufferLength = this.context.analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const AnimationFrame = () => {
        requestAnimationFrame(AnimationFrame.bind(this));
        // 获取音频数据
        this.context.analyserNode.getByteFrequencyData(dataArray);

        // 清除canvas
        canvasContext.fillStyle = 'rgb(255, 255, 255)';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        // 设置绘制音频数据的样式
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2;

          const r = barHeight + (25 * (i / bufferLength));
          const g = 250 * (i / bufferLength);
          const b = 50;

          // this.canvasContext.fillStyle = 'rgb(0, 0, 0)';
          // this.canvas_context.fillStyle = `rgb(${r},${g},${b})`;
          canvasContext.fillStyle = 'rgb(0, 0, 0)';
          canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      };
      AnimationFrame();
    }

    // updateBufferData() {
    //   let { dataArray, bufferData } = this;
    //   let { bufferDataLength } = this;
    //   if (this.clear === true) {
    //     // this.destory()

    //     return false;
    //   }
    //     // 将旧的数据向前移动
    //   bufferData.copyWithin(0, dataArray.length);
    //   this.context.analyserNode?.getFloatTimeDomainData(dataArray);
    //   // 将新的数据添加到缓存的末尾
    //   bufferData.set(dataArray, bufferDataLength - dataArray.length);
    //   // 每帧都更新缓存
    //   requestAnimationFrame(this.updateBufferData.bind(this));
    // }


    updateBufferData() {
      let { dataArray, bufferData } = this;
      let { bufferDataLength } = this;

      if (this.clear === true) {
        // this.destory()
        clearTimeout(this.timeId);

        return false;
      }
      // Move old data forward
      bufferData.copyWithin(0, dataArray.length);

      this.context.analyserNode?.getFloatTimeDomainData(dataArray);

      // Add new data to the end of the buffer
      bufferData.set(dataArray, bufferDataLength - dataArray.length);


      this.timeId = setTimeout(this.updateBufferData.bind(this), 1000 / 30); // Updates at roughly 30 FPS
    }


  setMediaSource_el(el: HTMLVideoElement) {
    this.context.mediaSource_el = el;
    this.context.audioSourceNode = this.context.audioContext!.createMediaElementSource(el);
  }

    createAudioContext() {
        this.context.audioContext = new AudioContext();
        this.context.analyserNode = this.context.audioContext.createAnalyser();

        this.context.analyserNode.fftSize = 256;
        this.context.gainNode = this.context.audioContext.createGain();

        this.bufferLength = this.context.analyserNode.frequencyBinCount;
        this.dataArray = new Float32Array(this.bufferLength);
        this.setBufferData();
      }

      resetAudioContextConnec() {
        this.context.audioSourceNode?.disconnect();
        this.audioContextConnect();
      }

      audioContextConnect() {
        // this.context.audioSourceNode!.connect(this.context.analyserNode!);
        // this.context.analyserNode!.connect(this.context.audioContext!.destination);

        this.context.audioSourceNode.connect(this.context.gainNode);
        this.context.gainNode.connect(this.context.analyserNode);
        this.context.gainNode.gain.value = 3;
        this.context.analyserNode.connect(this.context.audioContext.destination);
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
       this.bufferDataLength = Math.ceil(0.4 * this.context.audioContext!.sampleRate / this.dataArray.length) * this.dataArray.length;
       this.bufferData = new Float32Array(this.bufferDataLength);
      }
}

export default AudioProcessingService;