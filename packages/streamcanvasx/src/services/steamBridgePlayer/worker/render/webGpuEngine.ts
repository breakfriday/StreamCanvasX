import vertexWGSL from './vertex.wgsl';
import fragmentWGSL from './fragment.wgsl';

interface YUVFrame {
    yData: Uint8Array;
    uData: Uint8Array;
    vData: Uint8Array;
    width: number;
    height: number;
    yDataSize?: number;
    uDataSize?: number;
    vDataSize?: number;
    actualRowWidth?: number;
    validWidth?: number;

  }
class YuvWebGpuEngine {
    private device: GPUDevice;
    private context: GPUCanvasContext;
    private gpuContext: GPUCanvasContext;
    private pipeline: GPURenderPipeline;
    private yTexture: GPUTexture;
    private uTexture: GPUTexture;
    private vTexture: GPUTexture;
    private textureView: GPUTextureView;
    bindGroup: GPUBindGroup
    GpuContext: GPUCanvasContext;
    canvas_el: OffscreenCanvas

    constructor(canvas: HTMLCanvasElement) {

    }

    init() {
        this.initGpu();
        this.createPipeline();
    }

    private createPipeline() {
        const vertexShaderModule = this.device.createShaderModule({
            code: vertexWGSL,
        });
        const fragmentShaderModuele= this.device.createShaderModule({
            code: fragmentWGSL,
        });

        // 创建绑定组布局,定义了在着色器中使用的资源类型和绑定点（如采样器和纹理）
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
                { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
                { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
                { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
                { binding: 4, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
                { binding: 5, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
            ],
        });

        // 指定管线布局
        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout],
        });

        let pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout, // 指定管线布局
            vertex: {
                module: vertexShaderModule,
                entryPoint: 'vertex_main',
            },
            fragment: {
                module: fragmentShaderModuele,
                entryPoint: 'fragment_main',
                targets: [{ format: 'bgra8unorm' }],
            },

        });

        this.pipeline=pipeline;
    }

    async initGpu() {
        if (!navigator.gpu) {
            console.error('WebGPU is not supported on this browser.');
            return;
        }

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
          throw Error("Couldn't request WebGPU adapter.");
        }
        this.device = await adapter.requestDevice();

        this.gpuContext = this.canvas_el.getContext('webgpu');
    }

    private createTexture(data: Uint8Array, width: number, height: number): GPUTexture {
        const texture = this.device.createTexture({
            size: [width, height, 1],
            format: 'r8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
        });

        this.device.queue.writeTexture(
            { texture: texture },
            data,
            { bytesPerRow: width },
            [width, height, 1]
        );

        return texture;
    }


    createTextures(frame: YUVFrame) {
    // 创建 Y、U、V 分量的纹理
    this.yTexture = this.createTexture(frame.yData, frame.width, frame.height);
    this.uTexture = this.createTexture(frame.uData, frame.width / 2, frame.height / 2);
    this.vTexture = this.createTexture(frame.vData, frame.width / 2, frame.height / 2);

    const bindGroupLayout = this.pipeline.getBindGroupLayout(0);
    // 获取管线的绑定组布局
    this.bindGroup = this.device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            { binding: 0, resource: this.device.createSampler() },// 绑定点 0, 1, 2: 分别是三个采样器（sampler），用于从纹理中采样数据。
            { binding: 1, resource: this.device.createSampler() },
            { binding: 2, resource: this.device.createSampler() },
            { binding: 3, resource: this.yTexture.createView() },// 绑定点 3: 绑定到 Y 纹理的视图。
            { binding: 4, resource: this.uTexture.createView() },// 绑定点 4: 绑定到 Y 纹理的视图。
            { binding: 5, resource: this.vTexture.createView() },// 绑定点 4: 绑定到 Y 纹理的视图。
        ],
    });
    }
    updateTextures(frame: YUVFrame) {

    }

    render() {

    }
}

export default YuvWebGpuEngine;