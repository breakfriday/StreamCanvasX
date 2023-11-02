
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import { GPUDevice, GPUSampler, GPURenderPipeline, GPUCanvasContext } from '../../types/services/webGpu';

import PlayerService from '../player';

@injectable()
class BaseRenderEnging {
    canvas_el: HTMLCanvasElement;
    canvas_context: CanvasRenderingContext2D;
    gl_context: WebGLRenderingContext;
    playerService: PlayerService;
    GpuContext: GPUCanvasContext;
    resizeObserver: ResizeObserver;
    contentEl?: HTMLElement;
    constructor() {

    }
    init(opt: {contentEl?: HTMLElement}) {
      if (opt?.contentEl) {
         this.contentEl = opt.contentEl;
      }
      this.canvas_el = document.createElement('canvas');
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
      let GpuContext = this.canvas_el.getContext('webgpu');
      this.GpuContext = GPUCanvasContext;
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
}


export default BaseRenderEnging;