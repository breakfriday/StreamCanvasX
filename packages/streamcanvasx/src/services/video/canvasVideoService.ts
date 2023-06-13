
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
    renderPipeline: GPURenderPipeline;
    gPUSampler: GPUSampler;
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

                 // Create a basic vertex shader
                const vertexShader = `
                [[stage(vertex)]] fn main(
                    [[builtin(vertex_index)]] VertexIndex : u32
                ) -> [[builtin(position)]] vec4<f32> {
                    var pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
                        vec2<f32>(-1.0, -1.0),
                        vec2<f32>(3.0, -1.0),
                        vec2<f32>(-1.0, 3.0)
                    );
                    return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
                }
            `;

              // Create a basic fragment shader
            const fragmentShader = `
                [[group(0), binding(0)]] var s: sampler;
                [[group(0), binding(1)]] var t: texture_2d<f32>;

                [[stage(fragment)]] fn main([[builtin(fragment_coord)]] FragCoord : vec4<f32>)
                -> [[builtin(color)]] vec4<f32> {
                    return textureSample(t, s, FragCoord.xy / vec2<f32>(512.0, 512.0));
                }
            `;

            const bindGroupLayout = this.device.createBindGroupLayout({
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.FRAGMENT,
                        sampler: {
                            type: 'filtering',
                        },
                    },
                    {
                        binding: 1,
                        visibility: GPUShaderStage.FRAGMENT,
                        texture: {
                            sampleType: 'float',
                        },
                    },
                ],
            });

            // Create a pipeline layout
            const pipelineLayout = this.device.createPipelineLayout({
                bindGroupLayouts: [bindGroupLayout],
            });

                // Create a render pipeline with the shaders
            this.renderPipeline = this.device.createRenderPipeline({
                    layout: pipelineLayout,
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
                    primitive: {
                        topology: 'triangle-list',
                    },
                });

                this.gPUSampler = this.device.createSampler();
    }

    renderFrameByWebgpu(frame: VideoFrame) {
        const videoTexture = this.device.createTexture({
            size: [frame.displayWidth, frame.displayHeight, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING,
        });

        this.device.queue.copyExternalImageToTexture(
            { source: frame },
            { texture: videoTexture },
            [frame.displayWidth, frame.displayHeight],
        );

        const bindGroup = this.device.createBindGroup({
            layout: this.renderPipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: this.gPUSampler },
                { binding: 1, resource: videoTexture.createView() },
            ],
        });

        const commandEncoder = this.device.createCommandEncoder();
        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: this.GpuContext.getCurrentTexture().createView(),
                    loadOp: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    storeOp: 'store',
                },
            ],
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.renderPipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(3, 1, 0, 0);
        passEncoder.end();

        this.device.queue.submit([commandEncoder.finish()]);
    }

    create() {
        // let texure = this.device.createTexture({
        //     size: {
        //         width: 2000,
        //         height: 1000,
        //         depthOrArrayLayers: 1,
        //     },
        //     format: 'rgba8unorm',
        //     usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
        // });
    }

    async drawFrameByWebgpu() {

        // this.GpuContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

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
        this.renderCanvas2d(videoFrame);
    }

    renderCanvas2d(videoFrame: VideoFrame) {
        let video_width = videoFrame.codedHeight;
        let video_height = videoFrame.codedHeight;


        this.canvas_context.drawImage(videoFrame, 0, 0, video_width, video_height);
    }

    getCanvas2dEl() {
        return this.canvas_el;
    }
}


export default CanvasVideoService;