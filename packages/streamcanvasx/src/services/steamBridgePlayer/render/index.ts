
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../index';
import YuvEngine from './yunEngine';
import LoadingView from './plugin/loadingView';

@injectable()
class MediaRenderEngine {
  playerService: PlayerService;
  yuvEngine: YuvEngine;
  loadingView: LoadingView

  init(playerService: PlayerService) {
    this.playerService=playerService;
    this.resignPlugin();
    this.setContentStyle()
  }

  
  setContentStyle(){
    let { contentEl } = this.playerService.config;
    contentEl.style.position="relative"
    contentEl.style.overflow="hidden"

  }

  resignPlugin() {
    let { playerService } = this;
    this.initYuvEngine();

    this.loadingView=new LoadingView();
    this.loadingView.init(playerService);
  }
  initYuvEngine() {
    let { playerService } = this;
    this.yuvEngine=new YuvEngine();
    this.yuvEngine.init(playerService);
  }

  drawLoading(){
    if(this.loadingView.isLoading===true) {
      return false;
    }
    this.loadingView.load();

  }


    // 绘制 YUV 视频帧
}


export default MediaRenderEngine;

