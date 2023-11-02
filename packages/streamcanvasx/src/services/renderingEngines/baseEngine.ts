
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';

import PlayerService from '../player';
import waveForm from './webgl-waveform-visualization';

import { IRTCPlayerConfig } from '../../types/services';

@injectable()
class BaseRenderEnging {
    canvas_el: HTMLCanvasElement;
    canvas_context: CanvasRenderingContext2D;
    gl_context: WebGLRenderingContext;
    playerService: PlayerService;
    resizeObserver: ResizeObserver;
    contentEl?: HTMLElement;
    config?: IRTCPlayerConfig;
    constructor() {

    }
    init(config: IRTCPlayerConfig) {
      this.config = config;
      this.canvas_el = document.createElement('canvas');
      this.contentEl = this.config.contentEl;
      this.contentEl?.append(this.canvas_el);
      this.event();
      this.initgl();
    }

    _initContext2D() {
      this.canvas_context = this.canvas_el.getContext('2d');
      }

    initgl() {
      const gl = this.canvas_el.getContext('webgl');
      this.gl_context = gl;
        // this.regGl = createREGL({ canvas: this.canvas_el, extensions: ['OES_texture_float'] });
    }

    initWebgpu() {
      // let GpuContext = this.canvas_el.getContext('webgpu');
      // this.GpuContext = GPUCanvasContext;
    }

    event() {
      // 监听 dom size 变化， 调整canvas 大小
      this.resizeObserver = new ResizeObserver(() => {
        setTimeout(() => {
           this.setCanvasSize();
        }, 20);
      });

      this.resizeObserver.observe(this.contentEl);
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
    }
    waveService() {
      let glWave = new waveForm(this);

      return glWave;
    }
}


export default BaseRenderEnging;