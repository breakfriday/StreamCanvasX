
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
    device: GPUDevice;
    GpuContext: GPUCanvasContext;
    constructor() {
        this.canvas_el = document.createElement('canvas');
        this._initContext2D();
        this.setCanvasSize();
    }

    init() {

    }


    async initGpu() {
        if (!navigator.gpu) {
            throw Error('WebGPU not supported.');
          }
          const adapter = await navigator.gpu.requestAdapter();
          if (!adapter) {
            throw Error("Couldn't request WebGPU adapter.");
          }
          this.device = await adapter.requestDevice();

          this.GpuContext = this.canvas_el.getContext('webgpu');
    }

    create() {
        let texure = this.device.createTexture({
            size: {
                width: 2000,
                height: 1000,
                depthOrArrayLayers: 1,
            },
            format: 'rgba8unorm',
            usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
        });
    }


    // async function drawFrame() {
    //     // 使用HTMLCanvasElement或OffscreenCanvas的绘制上下文
    //     let canvas = document.querySelector("canvas");
    //     let context = canvas.getContext("2d");

    //     // 将视频帧绘制到canvas
    //     context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    //     // 将canvas像素复制到GPU纹理
    //     let imageBitmap = await createImageBitmap(canvas);
    //     device.queue.copyExternalImageToTexture(
    //         { source: imageBitmap },
    //         { texture: texture },
    //         [video.videoWidth, video.videoHeight]
    //     );

    //     // 在这里使用纹理进行渲染
    //     // ...

    //     requestAnimationFrame(drawFrame);
    // }


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
        let video_width = videoFrame.codedHeight;
        let video_height = videoFrame.codedHeight;


        this.canvas_context.drawImage(videoFrame, 0, 0, video_width, video_height);
    }

    getCanvas2dEl() {
        return this.canvas_el;
    }
}


export default CanvasVideoService;