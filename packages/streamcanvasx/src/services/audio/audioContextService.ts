import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../player';
import { debug } from 'console';


const render_times = 1000 / 15;
const update_buffer_times = 1000 / 30;

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
    canvasWorker: Worker;
    medialEl: HTMLVideoElement;


    constructor() {
      this.context = {};
    }


    init(playerService: PlayerService, option: {media_el: HTMLVideoElement}) {
        let { media_el } = option;

        // window.video = media_el;
        // 用来读取 音频轨道
        this.medialEl = media_el;

        // return false

        this.playerService = playerService;
         this.createAudioContext();
         this.setMediaSource_el(media_el);
         this.audioContextConnect();


         if (playerService.config.showAudio === true) {
          if (playerService.config.useOffScreen === true) {
            this.update_buffer_worker();
           } else {
            this.updateBufferData();
           }
         }


         this.render();

        //  this.canvasWorker = new Worker(new URL('./worker.js', import.meta.url));
    }

    clearCanvas() {
      let canvasContext = this.playerService.canvasVideoService.canvas_context;
      let canvas = this.playerService.canvasVideoService.canvas_el;
      this.clear = true;
      // 清除画布
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }

    // visulizerDraw1() {
    //   let dataArray = this.bufferData;
    //   let bufferLength = this.bufferDataLength;

    //   let canvasContext = this.playerService.canvasVideoService.canvas_context;
    //   let canvas = this.playerService.canvasVideoService.canvas_el;

    //   let animationId: number | null = null;
    //   const AnimationFrame = () => {
    //     if (this.clear === true) {
    //       // this.destory()

    //       cancelAnimationFrame(animationId);

    //       return false;
    //     }

    //     if (this.playerService.canvasVideoService.loading === false) {
    //       canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    //       // 设置波形图样式
    //       canvasContext.lineWidth = 2;
    //       canvasContext.strokeStyle = '#7f0';


    //       // 绘制波形图
    //       canvasContext.beginPath();
    //       const sliceWidth = canvas.width / bufferLength;
    //       let x = 0;
    //       for (let i = 0; i < bufferLength; i++) {
    //         const value = dataArray[i] * canvas.height / 2;
    //         const y = canvas.height / 2 + value;

    //         if (i === 0) {
    //           canvasContext.moveTo(x, y);
    //         } else {
    //           canvasContext.lineTo(x, y);
    //         }

    //         x += sliceWidth;
    //       }
    //       canvasContext.lineTo(canvas.width, canvas.height / 2);
    //       canvasContext.stroke();
    //     }
    //     // 清除画布


    //     // 循环绘制
    //     animationId = requestAnimationFrame(AnimationFrame.bind(this));
    //   };
    //   AnimationFrame();
    // }

    visulizerDraw1() {
      let dataArray = this.bufferData;
      let bufferLength = this.bufferDataLength;
      let canvasContext = this.playerService.canvasVideoService.canvas_context;
      let canvas = this.playerService.canvasVideoService.canvas_el;
      let { renderPerSecond } = this.playerService.config;

      let timeId: any = '';
      // canvasContext.lineWidth = 2;
      // canvasContext.strokeStyle = '#7f0';
      // setTimeout(() => {
      //   canvasContext.lineWidth = 5;
      //   canvasContext.strokeStyle = '#7f0';
      // }, 400);
      // debugger;
      const AnimationFrame = () => {
         dataArray = this.bufferData;
          if (this.clear === true) {
              // This returns the function, effectively stopping the loop
              clearTimeout(timeId);
              return;
          }
          if (canvasContext.lineWidth != 5) {
            canvasContext.lineWidth = 5;
            canvasContext.strokeStyle = '#7f0';
          }

          if (this.playerService.canvasVideoService.loading === false) {
              canvasContext.clearRect(0, 0, canvas.width, canvas.height);
              // canvasContext.lineWidth = 2;
              // canvasContext.strokeStyle = '#7f0';

              canvasContext.beginPath();
              const sliceWidth = canvas.width / bufferLength;
              let x = 0;
              for (let i = 0; i < bufferLength; i++) {
                  // const value = dataArray[i] * canvas.height / 2;
                  // const y = canvas.height / 2 + value;
                  let v = dataArray[i];
                  const y = (1.0 - v) * canvas.height / 2; // 转换为画布坐标

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

          // Use setTimeout here to loop function call. Adjust the delay time as per your requirement. Here 1000/60 mimics a framerate of 60 FPS, similar to requestAnimationFrame
          timeId = setTimeout(AnimationFrame.bind(this), renderPerSecond);
      };
      AnimationFrame();
  }


  drawSymmetricWaveform() {
    let dataArray = this.bufferData;
    let bufferLength = this.bufferDataLength;
    let canvasContext = this.playerService.canvasVideoService.canvas_context;
    let canvas = this.playerService.canvasVideoService.canvas_el;

    let { renderPerSecond } = this.playerService.config;

    let timeId: any = '';
    // canvasContext.lineWidth = 2;
    // canvasContext.strokeStyle = '#7f0';
    // setTimeout(() => {
    //   canvasContext.lineWidth = 5;
    //   canvasContext.strokeStyle = '#7f0';
    // }, 400);

    const AnimationFrame = () => {
       dataArray = this.bufferData;
        if (this.clear === true) {
            // This returns the function, effectively stopping the loop
            clearTimeout(timeId);
            return;
        }
        if (canvasContext.lineWidth != 1 || canvasContext.strokeStyle != '#77ff00') {
          canvasContext.lineWidth = 1;
          canvasContext.strokeStyle = '#77ff00';
        }
        // canvasContext.lineWidth = 1;
        // canvasContext.strokeStyle = '#7f0';

        if (this.playerService.canvasVideoService.loading === false) {
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            // canvasContext.lineWidth = 2;
            // canvasContext.strokeStyle = '#7f0';

            canvasContext.beginPath();

            const sliceWidth = canvas.width / bufferLength;
            let x = 0;
            let gap = 10;
            let scale = canvas.height / 2;

            for (let i = 0; i < bufferLength; i++) {
                let v = dataArray[i];

                // // 对于上半部分
                // let y_upper = (1.0 - v) * canvas.height / 4; // 在原有基础上除以2，因为现在的画布分为上下两部分
                // // 对于下半部分
                // let y_lower = (1.0 + v) * canvas.height / 4 + canvas.height / 2; // 首先反转 v，然后加上画布高度的一半，使其位于下半部分


                let y_upper = v * scale + canvas.height / 2;
                // 对于下半部分
                let y_lower = -v * scale + canvas.height / 2;

                if (v === 0) {
                  y_upper = canvas.height / 2 - gap / 2;
                  y_lower = canvas.height / 2 + gap / 2;
              }

                if (i === 0) {
                    canvasContext.moveTo(x, y_upper); // 上半部分
                    canvasContext.moveTo(x, y_lower); // 下半部分
                } else {
                    canvasContext.lineTo(x, y_upper); // 上半部分
                    canvasContext.lineTo(x, y_lower); // 下半部分
                }


                x += sliceWidth;
            }

            canvasContext.lineTo(canvas.width, canvas.height / 2);
            canvasContext.stroke();
        }

        // Use setTimeout here to loop function call. Adjust the delay time as per your requirement. Here 1000/60 mimics a framerate of 60 FPS, similar to requestAnimationFrame
        timeId = setTimeout(AnimationFrame.bind(this), renderPerSecond);
    };
    AnimationFrame();
  }
  // render by offscreen
  visulizerDraw2() {
    const offscreen_canvas = this.playerService.canvasVideoService.canvas_el.transferControlToOffscreen();

    let { renderPerSecond } = this.playerService.config;

    this.canvasWorker.postMessage({
      event: 'updateBufferRender',
      canvas: offscreen_canvas,
      renderPerSecond: renderPerSecond,
     }, [offscreen_canvas]);
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

        console.log(dataArray);
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

      let { updataBufferPerSecond } = this.playerService.config;

      if (this.clear === true) {
        // this.destory()
        clearTimeout(this.timeId);

        return false;
      }
      // Move old data forward


      this.context.analyserNode?.getFloatTimeDomainData(dataArray);

      // 取到 0 数据不更新 bufferdata
      let hasZero = dataArray.some(value => value === 0);
      // debugger;
      if (hasZero === false) {
        bufferData.copyWithin(0, dataArray.length);
        // Add new data to the end of the buffer
        bufferData.set(dataArray, bufferDataLength - dataArray.length);
      }


      this.timeId = setTimeout(this.updateBufferData.bind(this), updataBufferPerSecond); // Updates at roughly 30 FPS
    }

    update_buffer_worker() {
      let { dataArray, bufferData } = this;
      let { bufferDataLength } = this;
      let { updataBufferPerSecond } = this.playerService.config;


      let timeId: any = '';

      let $this = this;


      let interval_fn = () => {
        timeId = setTimeout(() => {
        $this.context.analyserNode?.getFloatTimeDomainData(dataArray);


         $this.canvasWorker.postMessage({
            event: 'updateBufferData',
            dataArray: dataArray,
            bufferDataLength: bufferDataLength,
          });
          interval_fn.call(this);
        }, updataBufferPerSecond);
      };

      interval_fn();
    }


  setMediaSource_el(el: HTMLVideoElement) {
    this.context.mediaSource_el = el;
    this.context.audioSourceNode = this.context.audioContext!.createMediaElementSource(el);
  }

    createAudioContext() {
      let { fftsize = 128 } = this.playerService.config;
        this.context.audioContext = new AudioContext();
        this.context.analyserNode = this.context.audioContext.createAnalyser();

        this.context.analyserNode.fftSize = fftsize;
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
        if (this.playerService.mpegtsPlayer?.audioPlayer) {
          if (parm === true) {
            this.playerService.mpegtsPlayer?.audioPlayer?.mute(true);
          } else {
            this.playerService.mpegtsPlayer?.audioPlayer?.mute(false);
          }
        } else {
          if (parm === true) {
            try {
            this.context.analyserNode!.disconnect(this.context.audioContext!.destination);
            } catch (e) {

            }
          } else {
            this.context.analyserNode!.connect(this.context.audioContext!.destination);
          }
        }
      }


      setBufferData() {
        let second = this.playerService.config.bufferSize;
        // 根据 AudioContext 的采样率、所需的缓存时间和 FFT 大小来设置缓存区大小
       this.bufferDataLength = Math.ceil(second * this.context.audioContext!.sampleRate / this.dataArray.length) * this.dataArray.length;

       this.bufferData = new Float32Array(this.bufferDataLength);

       this.getAuDioInfo();
      }

      getAuDioInfo() {
        let { bufferDataLength } = this;
        let { frequencyBinCount } = this.context.analyserNode;
        let { updataBufferPerSecond } = this.playerService.config;


        let realTime = bufferDataLength / (frequencyBinCount * updataBufferPerSecond);

        setTimeout(() => {
        this.playerService.emit('audioInfo', { realTime });
        }, 900);
      }

      render() {
        let { config } = this.playerService;

        let { showAudio, useOffScreen } = config;


        if (showAudio === true) {
          this.playerService.canvasVideoService.loading = false;
          if (useOffScreen === true) {
            this.visulizerDraw2();
          } else {
            switch (config.audioDraw * 1) {
              case 1:
                  this.drawSymmetricWaveform();
                  break;
              case 2:
                   this.visulizerDraw();
                  break;
              default:
                  this.drawSymmetricWaveform();

              break;
            }
          }
        }
      }
}

export default AudioProcessingService;