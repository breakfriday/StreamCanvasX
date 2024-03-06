import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../../player';
import { UseMode } from '../../../constant';

import ControlPanel from "./contrlPannel";
class MediaView{
    canvas_el: HTMLCanvasElement;
    canvas_el2: HTMLCanvasElement; //canvas2 用来最原始视频录制的画布
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

    WatermarkModule;
    isDrawingWatermark: boolean;
    isGettingWatermark: boolean;
    constructor(){

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
        let { model = UseMode.UseCanvas, contentEl } = data || {};


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
    
    load(video: HTMLVideoElement){

        this.createVideoFramCallBack(video)
        this.resignPlugin()
      }
    event(){
              // 监听 dom size 变化， 调整canvas 大小
      this.resizeObserver = new ResizeObserver(() => {
        setTimeout(() => {
           this.setCanvasSize();
          //  this.resizeControlPannel();
        }, 20);
      });

      this.resizeObserver.observe(this.contentEl);

    }
    initgl(){

    }
    initGpu(){

    }
    _initContext2D() {
        if (this.playerService.config.useOffScreen === true) {
          // let offscreenCanvas = this.canvas_el.transferControlToOffscreen();
          // this.offscreen_canvas = offscreenCanvas;
          // 不能在主线程中  获取上下问
          // this.offscreen_canvas_context = offscreenCanvas.getContext('2d');
        } else {
          this.canvas_context = this.canvas_el.getContext('2d');
        }
         // this.canvas_context = this.canvas_el.getContext('2d');
      }
    setUseMode(mode: UseMode): void {
        this.useMode = mode;
    }
    setCanvasSize(){
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
        
    }
    createVideoFramCallBack(video: HTMLVideoElement) {
        let $this = this;
  
        let fpsCount = 5;
        let frame_count = 0;
        let start_time = 0.0;
        let now_time = 0.0;
        let fps = 0;
  
        function millisecondsToTime(ms: any) {
          // 将时间戳转换为秒并取整
          let seconds = Math.floor(ms / 1000);
  
          // 计算小时数、分钟数和秒数
          let hours = Math.floor(seconds / 3600);
          let minutes = Math.floor((seconds - (hours * 3600)) / 60);
           seconds = seconds - (hours * 3600) - (minutes * 60);
  
          // 如果只有一位数字，前面补0
          if (hours < 10) { hours = `0${hours}`; }
          if (minutes < 10) { minutes = `0${minutes}`; }
          if (seconds < 10) { seconds = `0${seconds}`; }
  
          // 返回格式化的字符串
          return `${hours}:${minutes}:${seconds}`;
        }
        let cb = () => {
          video.requestVideoFrameCallback((now) => {
              // $this.renderFrameByWebgpu(video);
              let last_time = now_time;
              if (start_time == 0.0) {
                start_time = now;
              }
              now_time = now;
              // let last_time = performance.now();
  
              let elapsed = (now_time - last_time) / 1000.0;
              // 每经过fpsCount帧后，输出一次当前的瞬时帧率
              if (!(frame_count % fpsCount)) {
                fps = (1 / elapsed).toFixed(3);
              }
              frame_count++;
  
              let performanceInfo = { fps: fps, duringtime: millisecondsToTime(now - start_time) };
              // console.info(performanceInfo);
  
              $this.playerService.emit('performaceInfo', performanceInfo);
              $this.render(video);
            cb();
          });
        };
        cb();
  
   
      }
    resignPlugin(){
        let contentEl=this.contentEl
        let video=this.playerService.meidiaEl
  
  
        if(this.playerService.config.hasControl===true){
          let control=new ControlPanel(video,contentEl);
          control.load()
        }
  

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
  
  
         // this.renderFrameByWebgpu(videoFrame);
  
      //    this.drawGl(videoFrame);
      }

      renderCanvas2d(videoFrame: VideoFrame | HTMLVideoElement) {
        // let video_width = videoFrame.codedHeight;
        // let video_height = videoFrame.codedHeight;
        let video = videoFrame as HTMLVideoElement;

        let width = 400;
        let height = 200;

        if (this.contentEl) {
          width = this.contentEl.clientWidth;
          height = this.contentEl.clientHeight;
        }
        const centerX = width / 2;
        const centerY = height / 2;
        // let ctx = this.canvas_context;
        // let { canvas_el } = this;
        // let canvas = canvas_el;
        // ctx.save();

        // this.canvas_context.clearRect(0, 0, width, height);
        // 取消cover后使用clearRect(0, 0, width, height)不能完全清除
        this.canvas_context.clearRect(0, centerY - centerX, width, width); // 当 width > height 时，有效
        // let clearStart = -Math.abs(centerX - centerY);
        // let clearSize = Math.max(3 * centerX - centerY, 3 * centerY - centerX);
        // this.canvas_context.clearRect(clearStart, clearStart, clearSize, clearSize); // 无需讨论 width height的大小关系，均有效

        let {offsetX,offsetY,targetVideoHeight,targetVideoWidth}=this.calculateVideoAttributes(video)
        this.canvas_context.drawImage(videoFrame, offsetX, offsetY, targetVideoWidth, targetVideoHeight);
      
      


        let video_height = video.videoHeight;
        let video_width = video.videoWidth;

        if (this.playerService.canvasToVideoSerivce.recording === true) {
          if (!this.canvas_context2) {
            this.canvas_context2 = this.canvas_el2.getContext('2d');
            this.setCanvas2Size({ width: video_width, height: video_height });
          }
          this.canvas_context2.clearRect(0, 0, video_width, video_height);

          // this.drawTrasform(30);
          this.canvas_context2.drawImage(videoFrame, 0, 0, video_width, video_height);
        }
        


        // this.drawTrasform(videoFrame, 30, ctx);
        if (this.isDrawingWatermark) {
          this.drawInvisibleWatermark(this.isDrawingWatermark, {});
          this.getInvisibleWatermark(this.isGettingWatermark, {});
        }

        // ctx.restore();
        // console.log(this.playerService.config.degree);
        // this.drawTrasform(videoFrame, this.playerService.config.degree);

        // ctx.restore();
        this.renderOriginCanvas(videoFrame);
    }

    // 属性x,
     calculateVideoAttributes(videoFrame: VideoFrame | HTMLVideoElement):{
         offsetX: number, 
         offsetY: number, 
         targetVideoWidth: number,
         targetVideoHeight: number 
        }{
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

        let  offsetX=0
        let  offsetY=0
        let targetVideoWidth=width
        let targetVideoHeight=height

        if(this.cover===true){

            if (this.cover === true && (this.rotateDegreeSum === 90 || this.rotateDegreeSum === 270)) {
                offsetX=centerX - centerY
                offsetY= centerY - centerX
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
        return {targetVideoWidth,targetVideoHeight,offsetX,offsetY}


     

      }

      drawInvisibleWatermark(){

      }

      getInvisibleWatermark(){
        
      }


    // 录制原始高清视频 ,
    renderOriginCanvas(videoFrame: VideoFrame | HTMLVideoElement) {
        let video = videoFrame as HTMLVideoElement;
        if (this.playerService.canvasToVideoSerivce.recording === true) {
          let video_height = video.videoHeight;
          let video_width = video.videoWidth;
          if (!this.canvas_context2) {
            this.canvas_context2 = this.canvas_el2.getContext('2d');
            this.setCanvas2Size({ width: video_width, height: video_height });
          }
          this.canvas_context2.clearRect(0, 0, video_width, video_height);
  
          // this.drawTrasform(30);
          this.canvas_context2.drawImage(videoFrame, 0, 0, video_width, video_height);
        }
    }

    setCanvas2Size(parm: {width: number; height: number}) {
        let { width, height } = parm;
       this.canvas_el2.width = width;
       this.canvas_el2.height = height;
     }
 

}

export default MediaView