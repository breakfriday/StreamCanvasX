
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../player';

import WebGLYUVRenderer from './WebGLColorConverter';

function createContextGL($canvas: HTMLCanvasElement): WebGLRenderingContext | null {
    let gl: WebGLRenderingContext | null = null;

    const validContextNames: string[] = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'];
    let nameIndex = 0;

    while (!gl && nameIndex < validContextNames.length) {
      const contextName: string = validContextNames[nameIndex];

      try {
        let contextOptions: WebGLContextAttributes = { preserveDrawingBuffer: true };
        gl = $canvas.getContext(contextName, contextOptions) as WebGLRenderingContext;
      } catch (e) {
        gl = null;
      }

      if (!gl || typeof gl.getParameter !== 'function') {
        gl = null;
      }

      ++nameIndex;
    }

    return gl;
  }

@injectable()
class CanvasVideoService {
    canvas_el: HTMLCanvasElement;
    canvas_context: CanvasRenderingContext2D;
    context2D: CanvasRenderingContext2D;
    playerService: PlayerService;
    contextGl: WebGLRenderingContext;
    constructor() {
        this.canvas_el = document.createElement('canvas');
        this._initContext2D();
        this.setCanvasSize();
    }

    init() {

    }


    setCanvasEL(el: HTMLCanvasElement) {
        this.canvas_el = document.createElement('canvas');
    }

    setCanvasSize() {
        this.canvas_el.width = 2000;
        this.canvas_el.height = 1000;
    }

    _initContextGl() {
        this.contextGl = createContextGL(this.canvas_el);
        const webgl = WebGLYUVRenderer(this.contextGl, true);
        // this.contextGlRender = webgl.render;
        // this.contextGlDestroy = webgl.destroy;
    }

    _initContext2D() {
        this.canvas_context = this.canvas_el.getContext('2d');
    }

    render(videoFrame: VideoFrame) {
        let video_width = 2000;
        let video_height = 1000;
        this.canvas_context.drawImage(videoFrame, 0, 0, video_width, video_height);
    }

    getCanvas2dEl() {
        return this.canvas_el;
    }
}


export default CanvasVideoService;