declare class WebGPURenderer {
    private device;
    private context;
    private canvas;
    constructor(canvas: HTMLCanvasElement);
    initGpu(): Promise<void>;
}
