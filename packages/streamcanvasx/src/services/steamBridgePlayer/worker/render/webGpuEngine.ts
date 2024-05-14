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
    private pipeline: GPUCanvasContext;
    private yTexture: GPUTexture;
    private uTexture: GPUTexture;
    private vTexture: GPUTexture;
    private textureView: GPUTextureView;
    GpuContext: GPUCanvasContext;
    canvas_el: OffscreenCanvas

    constructor(canvas: HTMLCanvasElement) {

    }

    init() {
        this.initGpu();
    }

    private createPipeline() {
        const vertexShaderModule = this.device.createShaderModule({
            code: vertexWGSL,
        });
        const fragmentShaderModuele= this.device.createShaderModule({
            code: fragmentWGSL,
        });
        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [],
        });

        let pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
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

    createTextures(frame: YUVFrame) {

    }
    updateTextures(frame: YUVFrame) {

    }

    render() {

    }
}

export default YuvWebGpuEngine;