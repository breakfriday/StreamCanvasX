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
    createVideoFramCallBack(){

    }
    resignPlugin(){
        let contentEl=this.contentEl
        let video=this.playerService.meidiaEl
  
  
        if(this.playerService.config.hasControl===true){
          let control=new ControlPanel(video,contentEl);
          control.load()
        }
  

    }

}

export default MediaView