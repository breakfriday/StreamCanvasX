
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../player';
import createREGL from 'regl';
import BaseRenderEnging from './baseEngine';

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
    glBuffer: createREGL.Buffer;


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
         this.vertBuffer = [[]];
         this.glBuffer = this.regGl.buffer(this.vertBuffer);
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
            position: this.glBuffer,
          },

          count: this.regGl.prop('count'),
          depth: { enable: false },
          primitive: 'line strip',

         });
    }


      updateVertBuffer() {
        this.dataArray = this.generateSineWave();
        let pcmData = this.dataArray;
        const points = Array.from({ length: pcmData.length }, (_, i) => ({
          position: [
            (i / pcmData.length) * 2 - 1, // x坐标，归一化到 [-1, 1]
            pcmData[i], // y坐标
          ],
        }));

         this.vertBuffer = points.map(p => p.position);
         this.glBuffer(this.vertBuffer);
         debugger;
      }


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
          this.drawWaveByGl();
        });
      }
}


export default CanvasWaveService;