
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
// import PlayerService from '../player';
import createREGL from 'regl';
// import BaseRenderEnging from './baseEngine';
import WavePlayerService from '../audio/wavePlayer';


@injectable()
class CanvasWaveService {
    canvas_el: HTMLCanvasElement;
    regGl: createREGL.Regl;
    canvas_context: CanvasRenderingContext2D;
    dataArray: Float32Array;
    // playerService: PlayerService;
    glContext: WebGLRenderingContext;
    wavePlayerService: WavePlayerService;
    drawCommand: createREGL.DrawCommand;
    // vertBuffer: Array<Float32Array>;
    vertBuffer: number[][];
    // xglBuffer: createREGL.Buffer;
    glBuffer: Array<createREGL.Buffer>;
    totalWaveforms: number;
    bufferLength: number; // 每一路音频数据的长度
    bufferData: Array<Float32Array>;// 32 路音频数据的data
    // updateLength: number; // 每次更新音频数据的长度
    // verticalOffsetArray: number[]; // 垂直偏移量
    constructor() {


    }

    init(wavePlayerService: WavePlayerService) {
       this.wavePlayerService = wavePlayerService;
       this.canvas_el = this.wavePlayerService.canvas_el;
       this.glContext = this.wavePlayerService.gl_context;
       this.totalWaveforms = this.wavePlayerService.config.routes;
       this.bufferLength = this.wavePlayerService.config.arrayLength;
      //  this.vertBuffer = [];


        this.initgl();
        this.initData();
    }

    initgl() {
         this.regGl = createREGL({ canvas: this.canvas_el });
         let regl = this.regGl;


         this.drawCommand = this.regGl({
          frag: `
          precision highp float;
          uniform vec4 color;
          void main() {
            gl_FragColor = vec4(0.47, 1.0, 0.0, 1.0);
          }`,

          vert: `
          precision highp float;
          attribute vec2 position;
          uniform float yOffset; // 波形的垂直偏移
          uniform float yScale;  // 波形的垂直缩放
          void main() {
            gl_PointSize = 10.0;
            gl_Position = vec4(position, 0, 1);
          }`,
          attributes: {
            // position: this.glBuffer,
            position: regl.prop('buffer'),
          },

          count: this.bufferLength * 2,
          depth: { enable: true },
          primitive: 'line strip',

         });

         if (!this.glBuffer) {
          this.glBuffer = [];
          for (let i = 0; i < this.totalWaveforms; i++) {
            this.glBuffer[i] = this.regGl.buffer({ type: 'float', usage: 'dynamic', length: this.bufferLength * 4 });
          }
        }
        // if (!this.xglBuffer) {
        //   this.xglBuffer = this.regGl.buffer({ type: 'float', usage: 'static', length: this.bufferLength * 2 });
        // }
    }


      updateVertBuffer() {
        const { totalWaveforms } = this;
        const heightPerWaveform = 2 / (totalWaveforms); // 分配给每一路的高度空间
        const heightScale = heightPerWaveform * 0.3; // 实际波形的高度缩放，留出空间以避免相互重叠,最大不能超过0.5，否则放大会导致波形重叠
        const verticalOffsetIncrement = heightPerWaveform;
        let verticalOffset = 1 - verticalOffsetIncrement / 2; // 从最顶部的波形开始计算垂直偏移

        for (let i = 0; i < this.totalWaveforms; i++) {
          // let pcmData = this.bufferData[i].subarray(this.bufferData[i].length - this.updateLength);
          let pcmData = this.bufferData[i];

          let data = this.convertPCMToVertices(pcmData, heightScale, verticalOffset);
          // this.vertBuffer[i].copyWithin(0, 2 * this.updateLength);
          // this.vertBuffer[i].set(data, 2 * (this.bufferData[i].length - this.updateLength));
          // this.glBuffer[i](this.vertBuffer[i]);
          this.glBuffer[i](data);
          verticalOffset -= verticalOffsetIncrement; // 更新偏移量，为下一路波形准备
        }
      }
      // initVertBuffer() {
      //   const { totalWaveforms } = this;
      //   const heightPerWaveform = 2 / (totalWaveforms); // 分配给每一路的高度空间
      //   const heightScale = heightPerWaveform * 0.3; // 实际波形的高度缩放，留出空间以避免相互重叠,最大不能超过0.5，否则放大会导致波形重叠
      //   const verticalOffsetIncrement = heightPerWaveform;
      //   let verticalOffset = 1 - verticalOffsetIncrement / 2; // 从最顶部的波形开始计算垂直偏移
      //   this.verticalOffsetArray = [];
      //   for (let i = 0; i < this.totalWaveforms; i++) {
      //     let pcmData = this.bufferData[i];
      //     this.verticalOffsetArray.push(verticalOffset);
      //    // let data = this.translatePointe(pcmData, heightScale, verticalOffset);
      //     let data = this.convertPCMToVertices(pcmData, heightScale, verticalOffset);
      //     this.vertBuffer[i] = data;
      //     this.glBuffer[i](this.vertBuffer[i]);
      //     verticalOffset -= verticalOffsetIncrement; // 更新偏移量，为下一路波形准备
      //   }
      // }
      // initXVertBuffer() {
      //   const array = new Float32Array(this.bufferLength * 2);
      //   for (let index = 0; index < this.bufferLength; index++) {
      //     const x = (index / (this.bufferLength - 1)) * 2 - 1;
      //     array[2 * index] = x;
      //     array[2 * index + 1] = x;
      //   }
      //   this.xglBuffer(array);
      // }

      // 将数据点转换为顶点数据
      translatePointe(data: Float32Array, heightScale: number, verticalOffset: number) {
        const translatedPoints = new Float32Array(data.length * 2); // 创建一个新的Float32Array，长度是原数组的两倍，因为每个点需要两个坐标值

        // debugger;

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


      // PCM数据点转换为对称于X轴的两组顶点数据
      convertPCMToVertices(pcmData: Float32Array, heightScale: number, verticalOffset: number) {
        const sampleCount = pcmData.length;
        // const vertices = new Float32Array(sampleCount * 2);
        const vertices = [];

        for (let index = 0; index < sampleCount; index++) {
          const x = (index / (sampleCount - 1)) * 2 - 1; // 将索引规范化到[-1, 1]
          const y = (pcmData[index] * heightScale) + verticalOffset;

          // 添加原始点
          vertices.push(x, y);
          // vertices[2 * index] = (y);
          // 添加沿x轴对称的点
          vertices.push(x, -y + 2 * verticalOffset);
          // vertices[2 * index + 1] = (-y + 2 * verticalOffset);
        }

        return vertices;
      }


    hexArrayToFloat32Array(hexArray: Int16Array) {
     // 创建一个足够大的buffer来存放16位的PCM数据
     const buffer = new ArrayBuffer(hexArray.length * 2);
      // 使用一个DataView来操作ArrayBuffer
      const view = new DataView(buffer);

      // 16进制 转16位10进制整数
      hexArray.forEach((hex, i) => {
        const intValue = parseInt(hex, 16);
        // 将16位整数（假定为有符号）写入DataView
        view.setInt16(i * 2, intValue, true);
      });

      // 现在我们有了一个包含16位PCM数据的ArrayBuffer，创建一个16位整数数组来读取它
      const int16Array = new Int16Array(buffer);

      // 创建一个Float32Array来存放-1到1之间的浮点数
      const float32Array = new Float32Array(int16Array.length);

      // 归1化，转换16位整数范围到-1到1的浮点数
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768;
      }

      return float32Array;
      }
      // 生成pcm mock 数据
      generateSineWave(sampleRate = 4000, duration = 1) {
        function generateRandomPCMData(duration: number, sampleRate: number) {
          const numSamples = sampleRate * duration;
          const buffer = new Float32Array(numSamples);

          for (let i = 0; i < numSamples; i++) {
              // Math.random()  between -1 and 1
              let value = Math.random() * 2 - 1;
              buffer[i] = Math.sign(value) * Math.pow(Math.abs(value), 8);
              // buffer[i] = Math.sign(value) * Math.pow(Math.abs(value), 8);
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


          // console.log('------');


          for (let i = 0; i < this.totalWaveforms; i++) {
            let glbuffer = this.glBuffer[i].length;

            let count = this.bufferData[i].length * 2;

            this.drawCommand({ count: count, buffer: this.glBuffer[i] });
          }
        });
      }


      initData() {
        let routes = this.totalWaveforms;
        let length = this.bufferLength;
        this.bufferData = [];
        for (let i = 0; i < routes; i++) {
          this.bufferData[i] = new Float32Array(length);
        }
        // this.initVertBuffer();
        // this.initXVertBuffer();
      }


      destroy() {
        // this.xglBuffer.destroy();
        for (let i = 0; i < this.totalWaveforms; i++) {
          this.glBuffer[i].destroy();
        }
        this.regGl.destroy();
      }

      inputData(data: Array<Float32Array>) {
        let shiftAppendTypedArray = (bufferData: Float32Array, dataArray: Float32Array) => {
          bufferData.copyWithin(0, dataArray.length);
          bufferData.set(dataArray, bufferData.length - dataArray.length);

          return { data: bufferData, lenght: dataArray.length };
        };

        for (let i = 0; i < data.length; i++) {
          shiftAppendTypedArray(this.bufferData[i], data[i]);
        }

        this.updateVertBuffer();
      }
}


export default CanvasWaveService;
