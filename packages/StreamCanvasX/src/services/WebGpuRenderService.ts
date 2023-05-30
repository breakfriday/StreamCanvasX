
class WebGpuRender {
    private device: any;
    constructor() {

    }
    async initWwebGpu() {
        const adapter = await navigator.gpu.requestAdapter();
        this.device = await adapter.requestDevice();
    }
}