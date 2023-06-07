import { _ as _define_property } from "@swc/helpers/_/_define_property";
class WebGPURenderer {
    async initGpu() {
        if (!navigator.gpu) {
            throw Error('WebGPU not supported.');
        }
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            throw Error("Couldn't request WebGPU adapter.");
        }
        this.device = await adapter.requestDevice();
        const context = this.canvas.getContext('webgpu');
    }
    constructor(canvas){
        _define_property(this, "device", void 0);
        _define_property(this, "context", void 0);
        _define_property(this, "canvas", void 0);
        // 初始化WebGPU
        this.canvas = canvas;
        this.initGpu();
    }
}

 //# sourceMappingURL=WebGpuRenderService.js.map