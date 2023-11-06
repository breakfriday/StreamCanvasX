
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

    constructor() {


    }

    init(baseEngine: BaseRenderEnging) {
       this.baseEngine = baseEngine;
       this.canvas_el = this.baseEngine.canvas_el;
       this.glContext = this.baseEngine.gl_context;
       this.initBufferData();
        this.initgl();
    }

    initgl() {
         this.regGl = createREGL({ canvas: this.canvas_el });

        // this.regGl = createREGL({ gl: this.glContext, extensions: ['OES_texture_float'] });
        debugger;
    }


      updateBuffer() {
        const points = this.bufferData;
      }

      initBufferData() {
       let dataLength = 40000;
       this.bufferData = new Float32Array(dataLength);
      }

      drawWaveByGl() {
        let pcmData = this.dataArray;
        const points = Array.from({ length: pcmData.length }, (_, i) => ({
          position: [
            (i / pcmData.length) * 2 - 1, // x坐标，归一化到 [-1, 1]
            pcmData[i], // y坐标
          ],
        }));


        const vertexShader = `
                              precision mediump float;
                              attribute vec2 position;
                              void main() {
                                gl_Position = vec4(position, 0, 1);
                              }
                            `;

        const fragmentShader = `
          precision mediump float;
          void main() {
            gl_FragColor = vec4(0.47, 1.0, 0.0, 1.0); // Color #77ff00
          }
        `;
         this.regGl({
            frag: fragmentShader,

            vert: vertexShader,

            attributes: {
              position: points.map(p => p.position),
            },

            count: points.length,
            depth: { enable: false },
          });

          debugger;
      }

      generateSineWave() {
        const frequency = 440; // 频率, 440Hz 是音乐A4音
        const sampleRate = 44100; // 采样率
        const duration = 4000 / sampleRate; // 根据采样点数计算持续时间


        function generatePCMData(frequency: number, duration: number, sampleRate: number): Float32Array {
          const numSamples: number = sampleRate * duration;
          const buffer: Float32Array = new Float32Array(numSamples);

          for (let i = 0; i < numSamples; i++) {
            buffer[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
          }

          return buffer;
        }

        // 例如：生成440Hz音频的PCM数据，持续1秒，样本率为44100Hz
        const pcmData: Float32Array = generatePCMData(440, 1, 44100);

        return pcmData;
      }


      render() {
        this.dataArray = this.generateSineWave();
        let regl = this.regGl;
        regl.frame(() => {
          regl.clear({
            color: [0, 0, 0, 1],
            depth: 1,
          });
           this.drawWaveByGl();
           debugger;
        });
      }
}


export default CanvasWaveService;