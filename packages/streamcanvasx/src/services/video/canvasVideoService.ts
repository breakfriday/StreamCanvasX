
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../player';
import createREGL from 'regl';
import REGL from 'Regl';

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

  enum UseMode {
    UseWebGL,
    UseCanvas,
    UseWebGPU,
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
    renderPipeline: GPURenderPipeline;
    gPUSampler: GPUSampler;
    regGl: REGL.Regl;
    useMode: UseMode;
    constructor() {
        this.canvas_el = document.createElement('canvas');
        // this._initContext2D();

        this.init();
        this.setCanvasSize();
    }

    init() {
        // this.initGpu();
         this.setUseMode(UseMode.UseCanvas);


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
    setUseMode(mode: UseMode): void {
        this.useMode = mode;
      }

    initgl() {
        this.regGl = createREGL({ canvas: this.canvas_el, extensions: ['OES_texture_float'] });
    }

    async drawGl(frame: VideoFrame) {
        let ImageBitmap = await createImageBitmap(frame);
        const texture = this.regGl.texture(frame);


        const draw = this.regGl({
            frag: `
              precision mediump float;
              uniform sampler2D texture;
              varying vec2 uv;
              void main () {
                gl_FragColor = texture2D(texture, uv);
              }
            `,
            vert: `
              precision mediump float;
              attribute vec2 position;
              varying vec2 uv;
              void main () {
                uv = position;
                gl_Position = vec4(2.0 * position - 1.0, 0, 1);
              }
            `,
            attributes: {
              position: [[0, 0], [0, 1], [1, 1], [0, 0], [1, 1], [1, 0]],
            },
            uniforms: {
              texture: texture,
            },
            count: 6,
          });

          this.regGl.clear({ color: [0, 0, 0, 1] });


          draw(texture);
          texture.destroy();
    }

    _initContext2D() {
        this.canvas_context = this.canvas_el.getContext('2d');
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

          this.GpuContext.configure({
            device: this.device,
            format: 'bgra8unorm',
          });

            // Create a basic vertex shader
            const vertexShader = `
            struct VertexOutput {
              [[builtin(position)]] position: vec4<f32>;
              [[location(0)]] texCoord: vec2<f32>;
            };
          
            [[stage(vertex)]]
            fn main([[location(0)]] position: vec4<f32>,
                    [[location(1)]] texCoord: vec2<f32>) -> VertexOutput {
              var output: VertexOutput;
              output.position = position;
              output.texCoord = texCoord;
              return output;
            }
          `;

        // Create a basic fragment shader
        const fragmentShader = `
        [[group(0), binding(0)]] var srcTexture: texture_2d<f32>;
        [[stage(fragment)]]
        fn main([[location(0)]] texCoord: vec2<f32>) -> [[location(0)]] vec4<f32> {
          return textureLoad(srcTexture, vec2<i32>(i32(texCoord.x * 640), i32(texCoord.y * 480)), 0);
        }
      `;


      // 创建渲染管道
            this.renderPipeline = this.device.createRenderPipeline({
                    layout: 'auto',
                    vertex: {
                        module: this.device.createShaderModule({
                            code: vertexShader,
                        }),
                        entryPoint: 'main',
                    },
                    fragment: {
                        module: this.device.createShaderModule({
                            code: fragmentShader,
                        }),
                        entryPoint: 'main',
                        targets: [{
                            format: 'bgra8unorm',
                        }],
                    },

                    primitive: { topology: 'triangle-strip', stripIndexFormat: 'uint16' },
                });
    }

    async renderFrameByWebgpu(frame: VideoFrame) {
        let { displayWidth, displayHeight } = frame;


        const videoTexture = this.device.createTexture({
            size: {
                width: displayWidth,
                height: displayHeight,
              },
              format: 'rgba8unorm',
              usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
        });

       // const textureView = videoTexture.createView();

        let externalTexture = this.device.importExternalTexture({
            source: frame,
          });

          textureView = externalTexture.createView();


        // 将图像复制到纹理
        this.device.queue.copyExternalImageToTexture(
            { source: imageBitmap },
            { texture: videoTexture },
            [displayWidth, displayHeight],
        );


        const commandEncoder = this.device.createCommandEncoder();


        // commandEncoder.copyTextureToBuffer(
        //     { source: canvas },
        //     { texture: videoTexture, mipLevel: 1 },
        //     [displayWidth, displayHeight],
        // );

        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: textureView,
                    loadOp: 'clear',
                    loadValue: { r: 0, g: 0, b: 0, a: 1 }, // 清空颜色

                    storeOp: 'store',
                },
            ],
        };

        // 创建指令池
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.renderPipeline);
        passEncoder.draw(3, 1, 0, 0);
        passEncoder.end();

        this.device.queue.submit([commandEncoder.finish()]);
    }


    async drawFrameByWebgpu() {

        // this.GpuContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    }


    setCanvasEL(el: HTMLCanvasElement) {
        this.canvas_el = document.createElement('canvas');
    }

    setCanvasSize() {
        this.canvas_el.width = 400;
        this.canvas_el.height = 200;
    }

    _initContextGl() {
        this.contextGl = createContextGL(this.canvas_el);
        const webgl = WebGLYUVRenderer(this.contextGl, true);
        // this.contextGlRender = webgl.render;
        // this.contextGlDestroy = webgl.destroy;
    }


    render(videoFrame: VideoFrame) {
        switch (this.useMode) {
            case UseMode.UseCanvas:
                this.renderCanvas2d(videoFrame);
                break;
            case UseMode.UseWebGL:
                this.renderGl(videoFrame);
                break;
            case UseMode.UseWebGPU:
                this.renderFrameByWebgpu(videoFrame);
            break;
        }


       // this.renderFrameByWebgpu(videoFrame);

    //    this.drawGl(videoFrame);
    }

    renderGl(videoFrame: VideoFrame) {
        // Define a REGL command to render the video frame.
        let { regGl } = this;
        const drawImage = this.regGl({
            frag: `
            precision mediump float;
            uniform sampler2D texture;
            varying vec2 uv;
            void main () {
                gl_FragColor = texture2D(texture, uv);
            }
            `,
            vert: `
            precision mediump float;
            attribute vec2 position;
            varying vec2 uv;
            void main () {
                uv = position;
                gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
            }
            `,
            attributes: {
                position: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
            },
            uniforms: {
                texture: regGl.prop('texture'),
              },
            count: 4,
        });
    }

    renderCanvas2d(videoFrame: VideoFrame) {
        let video_width = videoFrame.codedHeight;
        let video_height = videoFrame.codedHeight;


        this.canvas_context.drawImage(videoFrame, 0, 0, 400, 200);
    }

    getCanvas2dEl() {
        return this.canvas_el;
    }
}


export default CanvasVideoService;