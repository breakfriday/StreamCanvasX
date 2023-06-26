
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../player';
import createREGL from 'regl';
import REGL from 'Regl';

import WebGLYUVRenderer from './WebGLColorConverter';
import { GPUDevice, GPUSampler, GPURenderPipeline, GPUCanvasContext } from '../../types/services/webGpu';

import { UseMode } from '../../constant';
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
    renderPipeline: GPURenderPipeline;
    regGl: REGL.Regl;
    useMode: UseMode;
    sampler: GPUSampler;
    contentEl: HTMLElement;
    clear: boolean;
    loading: boolean;
    frameInfo: VideoFrame;
    resizeObserver: ResizeObserver;
    constructor() {
        this.canvas_el = document.createElement('canvas');

        this.canvas_el.style.position = 'absolute';
        // this._initContext2D();

        // this.init();
        // this.setCanvasSize();
    }

    event() {
      this.resizeObserver = new ResizeObserver(() => {
        setTimeout(() => {
           this.setCanvasSize();
        }, 20);
      });

      this.resizeObserver.observe(this.contentEl);
    }

    init(playerService: PlayerService, data: {model?: UseMode; contentEl?: HTMLElement | null}) {
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

          // navigator.gpu.getPreferredCanvasFormat() 返回最适合当前设备和环境的WebGPU canvas上下文的颜色格式
          const presentationFormat = navigator.gpu.getPreferredCanvasFormat();


          this.GpuContext.configure({
            device: this.device,
            format: presentationFormat,
            alphaMode: 'premultiplied',
          });

            // Create a basic vertex shader
            const vertexShader = `@group(0) @binding(0) var mySampler : sampler;
            @group(0) @binding(1) var myTexture : texture_2d<f32>;
            
            struct VertexOutput {
              @builtin(position) Position : vec4<f32>,
              @location(0) fragUV : vec2<f32>,
            }
            
            @vertex
            fn vert_main(@builtin(vertex_index) VertexIndex : u32) -> VertexOutput {
              const pos = array(
                vec2( 1.0,  1.0),
                vec2( 1.0, -1.0),
                vec2(-1.0, -1.0),
                vec2( 1.0,  1.0),
                vec2(-1.0, -1.0),
                vec2(-1.0,  1.0),
              );
            
              const uv = array(
                vec2(1.0, 0.0),
                vec2(1.0, 1.0),
                vec2(0.0, 1.0),
                vec2(1.0, 0.0),
                vec2(0.0, 1.0),
                vec2(0.0, 0.0),
              );
            
              var output : VertexOutput;
              output.Position = vec4(pos[VertexIndex], 0.0, 1.0);
              output.fragUV = uv[VertexIndex];
              return output;
            }
            
            @fragment
            fn frag_main(@location(0) fragUV : vec2<f32>) -> @location(0) vec4<f32> {
              return textureSample(myTexture, mySampler, fragUV);
            }`;

        // Create a basic fragment shader
        const fragmentShader = `@group(0) @binding(1) var mySampler: sampler;
        @group(0) @binding(2) var myTexture: texture_external;
        
        @fragment
        fn main(@location(0) fragUV : vec2<f32>) -> @location(0) vec4<f32> {
          return textureSampleBaseClampToEdge(myTexture, mySampler, fragUV);
        }`;


      // 创建渲染管道
            this.renderPipeline = this.device.createRenderPipeline({
                    layout: 'auto',
                    vertex: {
                        module: this.device.createShaderModule({
                            code: vertexShader,
                        }),
                        entryPoint: 'vert_main',
                    },
                    fragment: {
                        module: this.device.createShaderModule({
                            code: fragmentShader,
                        }),
                        entryPoint: 'main',
                        targets: [{
                            format: presentationFormat,
                        }],
                    },

                    primitive: {
                        topology: 'triangle-list',
                      },
                    // primitive: { topology: 'triangle-strip', stripIndexFormat: 'uint16' },
                });


            this.sampler = this.device.createSampler({
                magFilter: 'linear',
                minFilter: 'linear',
            });
    }

    async renderFrameByWebgpu(frame: VideoFrame | HTMLVideoElement) {
        let $this = this;
        const uniformBindGroup = $this.device.createBindGroup({
            layout: $this.renderPipeline.getBindGroupLayout(0),
            entries: [
              {
                binding: 1,
                resource: this.sampler,
              },
              {
                binding: 2,
                resource: this.device.importExternalTexture({
                  source: frame as any, // eslint-disable-line @typescript-eslint/no-explicit-any
                }),
              },
            ],
          });


          const commandEncoder = this.device.createCommandEncoder();
          const textureView = this.GpuContext.getCurrentTexture().createView();

          const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
              {
                view: textureView,
                clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                loadOp: 'clear',
                storeOp: 'store',
              },
            ],
          };


        // 创建指令池
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.renderPipeline);
        passEncoder.setBindGroup(0, uniformBindGroup);
        passEncoder.draw(6, 1, 0, 0);
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
      let height = 200;
      let width = 400;


      if (this.contentEl) {
        height = this.contentEl.clientHeight;
        width = this.contentEl.clientWidth;
      }

        this.canvas_el.width = width;
        this.canvas_el.height = height;
    }

    _initContextGl() {
        this.contextGl = createContextGL(this.canvas_el);
        const webgl = WebGLYUVRenderer(this.contextGl, true);
        // this.contextGlRender = webgl.render;
        // this.contextGlDestroy = webgl.destroy;
    }


    render(videoFrame: VideoFrame | HTMLVideoElement) {
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

    renderCanvas2d(videoFrame: VideoFrame | HTMLVideoElement) {
        // let video_width = videoFrame.codedHeight;
        // let video_height = videoFrame.codedHeight;

        let width = 400;
        let height = 200;

        if (this.contentEl) {
          width = this.contentEl.clientWidth;
          height = this.contentEl.clientHeight;
        }


        this.canvas_context.drawImage(videoFrame, 0, 0, width, height);
    }

    getCanvas2dEl() {
        return this.canvas_el;
    }
    createVideoFramCallBack(video: HTMLVideoElement) {
      let $this = this;


      let frame_count = 0;
      let start_time = 0.0;

      function millisecondsToTime(ms: any) {
        // 将时间戳转换为秒并取整
        let seconds = Math.floor(ms / 1000);

        // 计算小时数、分钟数和秒数
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds - (hours * 3600)) / 60);
         seconds = seconds - (hours * 3600) - (minutes * 60);

        // 如果只有一位数字，前面补0
        if (hours < 10) { hours = `0${hours}`; }
        if (minutes < 10) { minutes = `0${minutes}`; }
        if (seconds < 10) { seconds = `0${seconds}`; }

        // 返回格式化的字符串
        return `${hours}:${minutes}:${seconds}`;
      }
      let cb = () => {
        video.requestVideoFrameCallback((now) => {
            // $this.renderFrameByWebgpu(video);
            if (start_time == 0.0) {
              start_time = now;
            }
            let last_time = performance.now();

            let elapsed = (now - start_time) / 1000.0;
            let fps = (++frame_count / elapsed).toFixed(3);

            let performanceInfo = { fps: fps, duringtime: millisecondsToTime(now - start_time) };
            // console.info(performanceInfo);

            $this.playerService.emit('performaceInfo', performanceInfo);
            $this.render(video);
          cb();
        });
      };
      cb();
    }

    clearCanvas() {
      let canvasEl = this.canvas_el;
      this.clear = true;
      // 清除画布
      this.canvas_context.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }
    drawLoading() {
      let ctx = this.canvas_context;
      let { canvas_el } = this;
      let canvas = canvas_el;

      // 定义圆的半径和线宽
      const radius = 50;
      const lineWidth = 10;

      // 初始化弧形进度条的起始角度和结束角度
      let startAngle = 0;
      let endAngle = 0;
      let $this = this;

      let drawAnimation = () => {
        // 定义圆心的坐标
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        if (this.loading === false) {
          return false;
        }
        if ($this.clear === true) {
          // this.destory()
          $this.clearCanvas();
          return false;
        }
        // 清除画布内容，准备绘制新的帧
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制背景圆圈
        ctx.beginPath(); // 开始新路径
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI); // 画一个完整的圆
        ctx.lineWidth = lineWidth; // 设置线宽
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)'; // 设置线条颜色
        ctx.stroke(); // 描边路径

        // 绘制loading进度弧形
        ctx.beginPath(); // 开始新路径
        ctx.arc(centerX, centerY, radius, startAngle * Math.PI, endAngle * Math.PI); // 画一个弧形
        ctx.lineWidth = lineWidth; // 设置线宽
        ctx.strokeStyle = 'rgba(50, 150, 255, 1)'; // 设置线条颜色
        ctx.stroke(); // 描边路径

        // 更新弧形进度条的起始角度和结束角度，用于下一帧的绘制
        startAngle += 0.01;
        endAngle += 0.02;

        // 当角度达到2π时，将其重置为0
        if (startAngle >= 2) {
          startAngle = 0;
        }

        if (endAngle >= 2) {
          endAngle = 0;
        }

        // 使用requestAnimationFrame()函数递归调用drawLoading()，实现动画效果
        requestAnimationFrame(drawAnimation);
      };


      drawAnimation();
    }

    destroy() {
      if (this.canvas_el && this.contentEl) {
        this.canvas_el.remove();
        this.contentEl = null;
      }
    }
}


export default CanvasVideoService;