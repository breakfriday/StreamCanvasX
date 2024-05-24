import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../../player';
import { UseMode } from '../../../constant';
import { RotateDecorator ,RotateResetDecrator,TrasformDecractor ,TrasforResetmDecractor ,VerticalMirrorDecrator,HorizontalMirrorDecrator } from './utilDecorator/RotateTrasformDecorator';


class MediaView {
    canvas_el: HTMLCanvasElement;
    canvas_el2: HTMLCanvasElement; // canvas2 用来最原始视频录制的画布
    canvas_context: CanvasRenderingContext2D;
    canvas_context2: CanvasRenderingContext2D;
    contentEl: HTMLElement;

    useMode: UseMode;

    playerService: PlayerService;
    resizeObserver: ResizeObserver;

    videoFrame: VideoFrame;

    clear: boolean;
    loading: boolean;
    cover: boolean;

    transformCount: number;
    transformDegreeSum: number;
    rotateDegreeSum: number;


    isDrawingWatermark: boolean;
    isGettingWatermark: boolean;
    frameCallbackId: number

    video: HTMLVideoElement
    startTime: number;
    timer: NodeJS.Timeout;
    lastCount: number;
    nowFrameCount: number;
    showError?: boolean

    constructor() {
        this.canvas_el = document.createElement('canvas');

        // canvas_el2 用于录制原始高清视频
        this.canvas_el2 = document.createElement('canvas');

        this.canvas_el.style.position = 'absolute';
    }
    init(playerService: PlayerService, data: {model?: UseMode; contentEl?: HTMLElement | null; useOffScreen: boolean}) {
        // this.initGpu();
        //  this.setUseMode(UseMode.UseCanvas);
        //  this.setUseMode(UseMode.UseWebGPU);
        this.playerService = playerService;
        let { model = UseMode.UseCanvas, contentEl } = playerService.config|| {};


          this.setUseMode(model);
          if (contentEl) {
            this.contentEl = contentEl;
            this.setCanvasSize();
            this.contentEl.append(this.canvas_el);

            this.event();
          }

        //  this.setUseMode(UseMode.UseWebGPU);
        // this.setUseMode(UseMode.UseCanvas);

         switch (this.useMode) {
            case UseMode.UseCanvas:
                this._initContext2D();
                break;
            case UseMode.UseWebGL:
                this.initgl();
                break;
            case UseMode.UseWebGPU:
                this.initGpu();
            break;
        }


        // this.initgl();
    }

    load(video: HTMLVideoElement) {
      this.video=video;
      this.startTime = performance.now();


      video.addEventListener('loadeddata', () => {
        console.log("MediaView",'loadeddata');
        this.startHearChceck();
        this.startVideoFrameCallBack();
      });

      video.addEventListener('error', () => {
        this.cancelVideoFrameCallBack();
      });


      video.addEventListener('loadstart', () => {
        this.cancelVideoFrameCallBack();
      });

      // this.createVideoFramCallBack(video);
      }

      startVideoFrameCallBack() {
        this.cancelVideoFrameCallBack();

        let frameCount = 0;
        let lastFrameTime = performance.now();
        let fps = 0;
        const fpsCount = 5;
        let $this=this;
        // let startTime = performance.now();
        this.nowFrameCount=0;
        this.lastCount=0;

        const updatePerformanceInfo = (now) => {
          if (frameCount >= fpsCount) {
              let elapsed = (now - lastFrameTime) / 1000;
              fps = (fpsCount / elapsed).toFixed(1);

              frameCount = 0;
              lastFrameTime = now;
          }


          let performanceInfo = { fps: fps, duringtime: $this.millisecondsToTime(now - this.startTime) };
          $this.playerService.emit('performaceInfo', performanceInfo);
      };

        const frameCallback=(now) => {
          frameCount++;
          if(this.playerService.error_connect_times>this.playerService.maxErrorTimes) {
            return false;
          }
          this.render(this.video);
          this.nowFrameCount++;
          try{
            updatePerformanceInfo(now);
          }catch(e) {
          }
          this.frameCallbackId = this.video.requestVideoFrameCallback(frameCallback);
        };

        this.frameCallbackId = this.video.requestVideoFrameCallback(frameCallback);
      }

      cancelVideoFrameCallBack() {
        if(this.frameCallbackId) {
          this.video.cancelVideoFrameCallback(this.frameCallbackId);
        }
      }
    event() {
              // 监听 dom size 变化， 调整canvas 大小
      this.resizeObserver = new ResizeObserver(() => {
        setTimeout(() => {
           this.setCanvasSize();
          //  this.resizeControlPannel();
        }, 20);
      });

      this.resizeObserver.observe(this.contentEl);
    }
    initgl() {

    }
    initGpu() {

    }
    _initContext2D() {
        if (this.playerService.config.useOffScreen === true) {

        } else {
          this.canvas_context = this.canvas_el.getContext('2d');
        }
      }
    setUseMode(mode: UseMode): void {
        this.useMode = mode;
    }
    setCanvasSize() {
        let height = 200;
        let width = 400;

        // if (this.playerService.config.useOffScreen == true) {
        //   return false;
        // }


        if (this.contentEl) {
          height = this.contentEl.clientHeight;
          width = this.contentEl.clientWidth;
        }

          this.canvas_el.width = width;
          this.canvas_el.height = height;
          if(this.showError===true) {
            this.drawError();
          }
    }
    // createVideoFramCallBack(video: HTMLVideoElement) {
    //     let $this = this;

    //     let fpsCount = 5;
    //     let frame_count = 0;
    //     let start_time = 0.0;
    //     let now_time = 0.0;
    //     let fps = 0;

    //     function millisecondsToTime(ms: any) {
    //       // 将时间戳转换为秒并取整
    //       let seconds = Math.floor(ms / 1000);

    //       // 计算小时数、分钟数和秒数
    //       let hours = Math.floor(seconds / 3600);
    //       let minutes = Math.floor((seconds - (hours * 3600)) / 60);
    //        seconds = seconds - (hours * 3600) - (minutes * 60);

    //       // 如果只有一位数字，前面补0
    //       if (hours < 10) { hours = `0${hours}`; }
    //       if (minutes < 10) { minutes = `0${minutes}`; }
    //       if (seconds < 10) { seconds = `0${seconds}`; }

    //       // 返回格式化的字符串
    //       return `${hours}:${minutes}:${seconds}`;
    //     }
    //     let cb = () => {
    //       video.requestVideoFrameCallback((now) => {
    //           // $this.renderFrameByWebgpu(video);
    //           let last_time = now_time;
    //           if (start_time == 0.0) {
    //             start_time = now;
    //           }
    //           now_time = now;
    //           // let last_time = performance.now();

    //           let elapsed = (now_time - last_time) / 1000.0;
    //           // 每经过fpsCount帧后，输出一次当前的瞬时帧率
    //           if (!(frame_count % fpsCount)) {
    //             fps = (1 / elapsed).toFixed(3);
    //           }
    //           frame_count++;

    //           let performanceInfo = { fps: fps, duringtime: millisecondsToTime(now - start_time) };
    //           // console.info(performanceInfo);

    //           $this.playerService.emit('performaceInfo', performanceInfo);
    //           $this.render(video);
    //         cb();
    //       });
    //     };
    //     cb();
    //   }

    createVideoFramCallBack(video: HTMLVideoElement) {
      let frameCount = 0;
      let lastFrameTime = performance.now();
      let fps = 0;
      const fpsCount = 5;
      let $this=this;
      let startTime = performance.now();

      const updatePerformanceInfo = (now) => {
          if (frameCount >= fpsCount) {
              let elapsed = (now - lastFrameTime) / 1000;
              fps = (fpsCount / elapsed).toFixed(1);

              frameCount = 0;
              lastFrameTime = now;
          }


          let performanceInfo = { fps: fps, duringtime: $this.millisecondsToTime(now - startTime) };
          $this.playerService.emit('performaceInfo', performanceInfo);
          // $this.playerService.emit('performanceInfo', {
          //     fps: fps,
          //     duringTime: $this.millisecondsToTime(now - lastFrameTime)
          // });
      };

      const frameCallback = (now) => {
          frameCount++;
          updatePerformanceInfo(now);
          this.render(video);
          video.requestVideoFrameCallback(frameCallback);
      };

      video.requestVideoFrameCallback(frameCallback);
  }
  millisecondsToTime(ms) {
    let seconds = Math.floor(ms / 1000);
    let hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    return [hours, minutes, seconds].map(v => v.toString().padStart(2, '0')).join(':');
}

    render(videoFrame: VideoFrame | HTMLVideoElement) {
        this.videoFrame = videoFrame as VideoFrame;
          switch (this.useMode) {
              case UseMode.UseCanvas:
                  this.renderCanvas2d(videoFrame);
                  break;
              case UseMode.UseWebGL:
                //   this.renderGl(videoFrame);
                  break;
              case UseMode.UseWebGPU:
                //   this.renderFrameByWebgpu(videoFrame);
              break;
          }
      }


      clearCanvas() {
        if (this.playerService.config.useOffScreen === true) {
            return false;
          }
          let canvasEl = this.canvas_el;
          this.clear = true;
          // 清除画布
          this.canvas_context.clearRect(0, 0, canvasEl.width, canvasEl.height);
      }
      destroy() {
        // if (this.playerService.config.showAudio === true) {
        //   this.playerService.audioProcessingService.clearCanvas();
        // }
        if (this.canvas_el && this.contentEl) {
          this.canvas_el.remove();
          this.contentEl = null;
          this.stopHeartChceck();
        }
      }

      drawError() {
        let canvasContext = this.canvas_context;
        let canvas = this.canvas_el;
        let { errorUrl = '' } = this.playerService.config;

        let errorImg = new Image();
        errorImg.src = errorUrl;

        errorImg.onload = function () {
          let width = canvas.width * 0.5;

            errorImg.width = width;


          let startY = (canvas.height - width) / 2;
          let startX = (canvas.width - width) / 2;
          canvasContext.drawImage(errorImg, startX, startY, width, width);
       };

       if(this.playerService.error_message) {
        let message=this.playerService.error_message;
        canvasContext.font = '13px Arial';
        canvasContext.fillStyle = 'gray';
        canvasContext.textAlign = 'center';
        canvasContext.fillText(message, canvas.width/2 , canvas.height*0.85);
       }
       this.showError=true;
      }
      renderCanvas2d(videoFrame: VideoFrame | HTMLVideoElement) {
        this.showError=false;

        let video = videoFrame as HTMLVideoElement;

        let width = 400;
        let height = 200;

        if (this.contentEl) {
          width = this.contentEl.clientWidth;
          height = this.contentEl.clientHeight;
        }
        const centerX = width / 2;
        const centerY = height / 2;

        this.canvas_context.clearRect(0, centerY - centerX, width, width); // 当 width > height 时，有效


        let { offsetX,offsetY,targetVideoHeight,targetVideoWidth }=this.calculateVideoAttributes(video);
        this.canvas_context.drawImage(videoFrame, offsetX, offsetY, targetVideoWidth, targetVideoHeight);
    }


     calculateVideoAttributes(videoFrame: VideoFrame | HTMLVideoElement): {
         offsetX: number;
         offsetY: number;
         targetVideoWidth: number;
         targetVideoHeight: number;
        } {
        let video = videoFrame as HTMLVideoElement;
        let video_height = video.videoHeight;
        let video_width = video.videoWidth;
        let width = 400;
        let height = 200;
        if (this.contentEl) {
            width = this.contentEl.clientWidth;
            height = this.contentEl.clientHeight;
          }

        const centerX = width / 2;
        const centerY = height / 2;

        let offsetX=0;
        let offsetY=0;
        let targetVideoWidth=width;
        let targetVideoHeight=height;

        if(this.cover===true) {
            if (this.cover === true && (this.rotateDegreeSum === 90 || this.rotateDegreeSum === 270)) {
                offsetX=centerX - centerY;
                offsetY= centerY - centerX;
                targetVideoWidth=height;
                targetVideoHeight=width;
            }
        }else{
              let scaleRatio = Math.min(width / video_width, height / video_height);
              // Calculate the target video dimensions after scaling
               targetVideoWidth = video_width * scaleRatio;
               targetVideoHeight = video_height * scaleRatio;

              // Calculate the position to center the video frame on the canvas
             offsetX = (width - targetVideoWidth) / 2;
             offsetY = (height - targetVideoHeight) / 2;
        }
        return { targetVideoWidth,targetVideoHeight,offsetX,offsetY };
      }

      setCover(cover: boolean = false) {
        this.cover = cover;
       }

       @RotateDecorator
       drawRotate(degree: number) {}

       @RotateResetDecrator
       rotateReset() { }

       @TrasformDecractor
       drawTrasform(degree: number) {}

       @TrasforResetmDecractor
       transformReset() {}

       @VerticalMirrorDecrator
       drawVerticalMirror() {
        // 垂直镜像变化
      }
      @HorizontalMirrorDecrator
      drawHorizontalMirror() {
      // 水平镜像变化
      }

    setCanvas2Size(parm: {width: number; height: number}) {
     let { width, height } = parm;
       this.canvas_el2.width = width;
       this.canvas_el2.height = height;
     }

    startHearChceck() {
      if (!this.timer) {
        this.timer = setInterval(() => {
           if(this.lastCount>=this.nowFrameCount) {
            this.playerService.addReloadTask({ arr_msg: ['---fps 調用鏈檢查異常 ----'] });
           }else{
            // console.log(this.lastCount)
            // console.log(this.nowFrameCount)
            // debugger
            this.lastCount=this.nowFrameCount;
           }
          }, 10000); // 每10秒检查一次
      }
    }

     stopHeartChceck() {
      if(this.timer) {
        clearInterval(this.timer);
        this.timer=null;
       }
     }
}

export default MediaView;