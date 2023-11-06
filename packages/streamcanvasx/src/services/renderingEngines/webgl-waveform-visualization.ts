
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


    constructor() {


    }

    init(baseEngine: BaseRenderEnging) {
       this.baseEngine = baseEngine;
       this.canvas_el = this.baseEngine.canvas_el;
       this.glContext = this.baseEngine.gl_context;

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
          this.glBuffer[0] = this.regGl.buffer({ type: 'float', usage: 'dynamic', length: pcmData.length });
          this.glBuffer[1] = this.regGl.buffer({ type: 'float', usage: 'dynamic', length: pcmData.length });
          this.glBuffer[2] = this.regGl.buffer({ type: 'float', usage: 'dynamic', length: pcmData.length });
          this.glBuffer[3] = this.regGl.buffer({ type: 'float', usage: 'dynamic', length: pcmData.length });
          this.glBuffer[4] = this.regGl.buffer({ type: 'float', usage: 'dynamic', length: pcmData.length });
        }

        const totalWaveforms = 32;
        const heightPerWaveform = 2 / (totalWaveforms + 1); // 分配给每一路的高度空间
        const heightScale = heightPerWaveform * 0.8; // 实际波形的高度缩放，留出空间以避免相互重叠
        const verticalOffsetIncrement = heightPerWaveform;
        let verticalOffset = 1 - verticalOffsetIncrement; // 从最顶部的波形开始计算垂直偏移

        for (let i = 0; i < 5; i++) {
          let data = this.translatePointe(pcmData, heightScale, verticalOffset);
          this.glBuffer[i](data);
          verticalOffset -= verticalOffsetIncrement; // 更新偏移量，为下一路波形准备
        }

        // let vertPoints1 = this.translatePointe(pcmData, 0.1, 0.9);
        // let vertPoints2 = this.translatePointe(pcmData, 0.09, 0.5);
        // let vertPoints3 = this.translatePointe(pcmData, 0.1, 0.7);
        // let vertPoints4 = this.translatePointe(pcmData, 0.1, 0.6);
        // let vertPoints5 = this.translatePointe(pcmData, 0.1, 0.5);

        // this.glBuffer[0](vertPoints1);
        // this.glBuffer[1](vertPoints2);
        // this.glBuffer[2](vertPoints3);
        // this.glBuffer[3](vertPoints4);
        // this.glBuffer[4](vertPoints5);
      }

      translatePointe(data: Float32Array, heightScale = 0.2, verticalOffset = 0.8) {
        const translatedPoints = new Float32Array(data.length * 2); // 创建一个新的Float32Array，长度是原数组的两倍，因为每个点需要两个坐标值


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

      // // 将数据点转换为顶点数据
      // translatePointe11(pcmData: Float32Array) {
      //   const points = Array.from({ length: pcmData.length }, (_, i) => ({
      //     position: [
      //       (i / pcmData.length) * 2 - 1, // x坐标，归一化到 [-1, 1]
      //       pcmData[i], // y坐标
      //     ],
      //   }));

      //   let vertPoints = points.map(p => p.position);
      //   return vertPoints;
      // }

      drawWaveByGl() {
        this.drawCommand({ count: 441000 });
      }


      generateSineWave() {
        const sampleRate = 48000; // Standard CD-quality sample rate
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
          this.drawCommand({ count: 441000, buffer: this.glBuffer[0] });
           // this.drawCommand({ count: 441000, buffer: this.glBuffer[1] });
          this.drawCommand({ count: 441000, buffer: this.glBuffer[2] });
           this.drawCommand({ count: 441000, buffer: this.glBuffer[4] });

          // this.drawCommand({ count: 441000, buffer: this.glBuffer[4] });
          // this.drawCommand({ count: 441000, buffer: this.glBuffer[5] });
         // this.drawCommand({ count: 441000, buffer: this.glBuffer });
        });
      }
}


export default CanvasWaveService;