import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import { TYPES } from '../../serviceFactories/symbol';
import AudioWaveService from './audioWaveService';
import WaveGl from '../renderingEngines/webgl-waveform-visualization';
import WaveVisualization from '../waveVisualization/waveVisualization';
import { IWavePlayerConfig } from '../../types/services';


@injectable()
class WavePlayer {
  canvas_el: HTMLCanvasElement;
  canvas_context: CanvasRenderingContext2D;
  gl_context: WebGLRenderingContext;
  resizeObserver: ResizeObserver;
  contentEl?: HTMLElement;
  // config?: IWavePlayerConfig;
  waveVisualization: WaveVisualization;
  waveGl: WaveGl;
  audioWaveService: AudioWaveService;
  renderType: number;

  constructor(
    @inject(TYPES.IAudioWaveService) audioWaveService: AudioWaveService,
    @inject(TYPES.IWaveGl) waveGl: WaveGl,
    ) {
  this.audioWaveService = audioWaveService;
  this.waveGl = waveGl;
  }

  init(waveVisualization?: WaveVisualization) {
    this.waveVisualization = waveVisualization;
    const { renderType } = waveVisualization.config;
    this.renderType = renderType;
    // this.config = waveVisualization.config;
    this.canvas_el = waveVisualization.canvas_el;
    this.contentEl = waveVisualization.contentEl;
    this.event();


    switch (renderType) {
      case 1: // canvas2d
        this.initContext2D();
        this.audioWaveService.init(this);
          break;
      case 2: // audioContext
          break;
      case 3: // webGL
        this.initgl();
        this.waveGl.init(this);
          break;
      default:
          break;
    }

    // this.audioWaveService.init(config);
  }

  initContext2D() {
    this.canvas_context = this.canvas_el.getContext('2d');
  }
  initgl() {
    const gl = this.canvas_el.getContext('webgl');
    this.gl_context = gl;
  }

  event() {
      // 监听 dom size 变化， 调整canvas 大小
      this.resizeObserver = new ResizeObserver((entries) => {
        setTimeout(() => {
          switch (this.renderType) {
            case 1: // canvas2d
              this.setCanvasSize2(entries);
                break;
            case 2: // audioContext
                break;
            case 3: // webGL
              this.setCanvasSize();
                break;
            default:
                break;
          }
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
  setCanvasSize2(entries) {
        this.canvas_el.style.width = `${entries[0].contentRect.width}px`; // css 缩放目前可以解决模糊问题，但是对后续绘制影响有待研究
        this.canvas_el.style.height = `${this.canvas_el.height}px`;
  }
}
export default WavePlayer;