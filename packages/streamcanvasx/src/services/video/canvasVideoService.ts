
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../player';
import createREGL from 'regl';
import REGL from 'Regl';

import WebGLYUVRenderer from './WebGLColorConverter';
import { GPUDevice, GPUSampler, GPURenderPipeline, GPUCanvasContext } from '../../types/services/webGpu';

import { UseMode } from '../../constant';
import { loadWASM } from '../../utils';

import ControlPanel from "./plugin/contrlPannel";


import MediaView from './plugin/mediaView';

@injectable()
class CanvasVideoService {
    mediaView: MediaView
    playerService: PlayerService

    constructor() {

    }

    init(playerService: PlayerService,data: {model?: UseMode; contentEl?: HTMLElement | null; useOffScreen: boolean}) {
      this.playerService=playerService;
        this.resignPlugin();
    }

    // 插件注冊
    resignPlugin() {
        let { playerService } = this;
        let { contentEl,model,useOffScreen } = this.playerService.config;

        this.mediaView=new MediaView();

        this.mediaView.init(playerService,{ contentEl,model,useOffScreen });

        let video=this.playerService.meidiaEl;
    }

    // 插件啓動
    pluginBoot(video: HTMLVideoElement) {
      let { contentEl } = this.playerService.config;
      this.mediaView.load(video);

      if(this.playerService.config.hasControl===true) {
        let control=new ControlPanel(video,contentEl);
         control.load();
      }
    }


    load(video: HTMLVideoElement) {
      this.pluginBoot(video);
    }

    drawLoading() {
      // debugger;
      //  this.mediaView.drawLoading();
    }
    drawError() {
        this.mediaView.drawError();
    }
    destroy() {
        this.mediaView.destroy();
    }
    setCover(cover: boolean = false) {
      this.mediaView.setCover(cover);
     }

     drawRotate(degree: number) {
      this.mediaView.drawRotate(degree);
     }
     rotateReset() {
      this.mediaView.rotateReset();
     }
}


export default CanvasVideoService;