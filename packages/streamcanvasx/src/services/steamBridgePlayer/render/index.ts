
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../index';
import YuvEngine from './yunEngine';

@injectable()
class MediaRenderEngine {
  playerService: PlayerService;
  yuvEngine: YuvEngine
  init(playerService: PlayerService) {
    this.playerService=playerService;
    this.resignPlugin();
  }

  resignPlugin() {
    this.initYuvEngine();
  }
  initYuvEngine() {
    let { playerService } = this;
    this.yuvEngine=new YuvEngine();
    this.yuvEngine.init(playerService);
  }


    // 绘制 YUV 视频帧
}


export default MediaRenderEngine;

