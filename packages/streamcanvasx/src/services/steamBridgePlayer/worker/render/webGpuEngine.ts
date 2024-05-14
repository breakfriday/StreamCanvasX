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

        const shaderModule = this.device.createShaderModule({
            code: `
                @vertex
                fn vertex_main(@builtin(vertex_index) VertexIndex : u32) -> @builtin(position) vec4<f32> {
                    var pos = array<vec2<f32>, 6>(
                        vec2<f32>(-1.0, -1.0),
                        vec2<f32>(1.0, -1.0),
                        vec2<f32>(-1.0, 1.0),
                        vec2<f32>(-1.0, 1.0),
                        vec2<f32>(1.0, -1.0),
                        vec2<f32>(1.0, 1.0)
                    );
                    return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
                }

                @fragment
                fn fragment_main() -> @location(0) vec4<f32> {
                    return vec4<f32>(1.0, 0.0, 0.0, 1.0); // Red color for testing
                }
            `,
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