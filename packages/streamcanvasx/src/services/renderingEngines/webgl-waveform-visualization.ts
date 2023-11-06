
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../player';
import createREGL from 'regl';
import BaseRenderEnging from './baseEngine';
import { debug } from 'console';

@injectable()
class CanvasWaveService {
    canvas_el: HTMLCanvasElement;
    regGl: createREGL.Regl;
    canvas_context: CanvasRenderingContext2D;
    bufferData: Float32Array;
    dataArray: Float32Array;
    playerService: PlayerService;
    glContext: WebGLRenderingContext;
    baseEngine: BaseRenderEnging;
    drawCommand: createREGL.DrawCommand;
    vertBuffer: number[][];
    glBuffer: Array<createREGL.Buffer>;
    totalWaveforms: number;


    constructor() {


    }

    init(baseEngine: BaseRenderEnging) {
       this.baseEngine = baseEngine;
       this.canvas_el = this.baseEngine.canvas_el;
       this.glContext = this.baseEngine.gl_context;
       this.totalWaveforms = 1;


        this.initgl();
    }

    initgl() {
         this.regGl = createREGL({ canvas: this.canvas_el });
         let regl = this.regGl;


         this.drawCommand = this.regGl({
          frag: `
          precision mediump float;
          uniform vec4 color;
          void main() {
            gl_FragColor = vec4(0.47, 1.0, 0.0, 1.0);
          }`,

          vert: `
          precision mediump float;
          attribute vec2 position;
          uniform float yOffset; // 波形的垂直偏移
          uniform float yScale;  // 波形的垂直缩放
          void main() {
            gl_Position = vec4(position, 0, 1);
          }`,
          attributes: {
            // position: this.glBuffer,
            position: regl.prop('buffer'),
          },

          count: this.regGl.prop('count'),
          depth: { enable: false },
          primitive: 'lines',

         });
    }


      updateVertBuffer() {
        let pcmData = this.generateSineWave();

        if (!this.glBuffer) {
          this.glBuffer = [];
          for (let i = 0; i < this.totalWaveforms; i++) {
            this.glBuffer[i] = this.regGl.buffer({ type: 'float', usage: 'dynamic', length: pcmData.length });
          }
        }

        const { totalWaveforms } = this;
        const heightPerWaveform = 2 / (totalWaveforms); // 分配给每一路的高度空间
        const heightScale = heightPerWaveform * 0.5; // 实际波形的高度缩放，留出空间以避免相互重叠
        const verticalOffsetIncrement = heightPerWaveform;
        let verticalOffset = 1 - verticalOffsetIncrement / 2; // 从最顶部的波形开始计算垂直偏移

        for (let i = 0; i < this.totalWaveforms; i++) {
         let data = this.translatePointe(pcmData, heightScale, verticalOffset);
       // let data = this.convertPCMToVertices(pcmData, heightScale, verticalOffset);
          this.glBuffer[i](data);
          verticalOffset -= verticalOffsetIncrement; // 更新偏移量，为下一路波形准备
        }
      }

      // 将数据点转换为顶点数据
      translatePointe(data: Float32Array, heightScale: number, verticalOffset: number) {
        const translatedPoints = new Float32Array(data.length * 2); // 创建一个新的Float32Array，长度是原数组的两倍，因为每个点需要两个坐标值

        debugger;

        for (let index = 0; index < data.length; index++) {
          // 归一化X坐标到[-1, 1]
          const x = (index / (data.length - 1)) * 2 - 1;
          // 应用高度缩放和垂直偏移
          const y = (data[index] * heightScale) + verticalOffset;

          translatedPoints[index * 2] = x; // 储存x坐标
          translatedPoints[index * 2 + 1] = y; // 储存y坐标
        }


        return translatedPoints;
      }

      convertPCMToVertices(pcmData: Float32Array, heightScale: number, verticalOffset: number) {
        const sampleCount = pcmData.length;
        const vertices = [];

        for (let index = 0; index < sampleCount; index++) {
          const x = (index / (sampleCount - 1)) * 2 - 1; // 将索引规范化到[-1, 1]
          const y = pcmData[index];

          // 添加原始点
          vertices.push(x, y);
          // 添加沿x轴对称的点
          vertices.push(x, -y);
        }

        return vertices;
      }


      // 生成pcm mock 数据
      generateSineWave() {
        const sampleRate = 4000; // Standard CD-quality sample rate
        const duration = 1; // 1 second of audio


        function generateRandomPCMData(duration, sampleRate) {
          const numSamples = sampleRate * duration;
          const buffer = new Float32Array(numSamples);

          for (let i = 0; i < numSamples; i++) {
              // Math.random()  between -1 and 1
              buffer[i] = Math.random() * 2 - 1;
          }

          return buffer;
      }
        // 生成440Hz音频的PCM数据，持续1秒，样本率为44100Hz
        const randomPCMData = generateRandomPCMData(duration, sampleRate);

        return randomPCMData;
      }


      render() {
        // this.dataArray = this.generateSineWave();
        let regl = this.regGl;
        regl.frame(() => {
          regl.clear({
            color: [0, 0, 0, 1],
            depth: 1,
          });
          this.updateVertBuffer();

          for (let i = 0; i < this.totalWaveforms; i++) {
            this.drawCommand({ count: 48000, buffer: this.glBuffer[i] });
          }
        });
      }
}


export default CanvasWaveService;