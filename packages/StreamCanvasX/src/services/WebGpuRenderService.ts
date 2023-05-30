
interface CommandFunction {
    (encoder: GPUCommandEncoder): void;
  }

  class WebGPURenderer {
    private device: GPUDevice;
    private context: GPUCanvasContext;

    constructor(canvas: HTMLCanvasElement) {
      // 初始化WebGPU
      this.initWebGPU(canvas);
    }

     async initWebGPU(canvas: HTMLCanvasElement) {
      // 获取适配器和设备
      const adapter = await navigator.gpu.requestAdapter();
      this.device = await adapter.requestDevice();

      // 创建WebGPU上下文
      this.context = canvas.getContext('webgpu');

      // 设置默认纹理格式
      this.context.configure({
        device: this.device,
        format: 'bgra8unorm',
      });
    }

     createTextureFromImage(image: HTMLImageElement): GPUTexture {
      // 创建纹理
      const texture = this.device.createTexture({
        size: [image.width, image.height, 1],
        format: 'rgba8unorm',
        usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED,
      });

      // 使用GPU队列将图像复制到纹理
      this.device.queue.copyExternalImageToTexture(
        { source: image },
        { texture: texture },
        [image.width, image.height, 1],
      );

      return texture;
    }

     executeCommands(commands: CommandFunction[]) {
      // 创建命令编码器
      const commandEncoder = this.device.createCommandEncoder();

      // 记录命令
      for (const command of commands) {
        command(commandEncoder);
      }

      // 结束命令编码器并获取命令缓冲区
      const commandBuffer = commandEncoder.finish();

      // 提交命令缓冲区
      this.device.queue.submit([commandBuffer]);
    }
  }
