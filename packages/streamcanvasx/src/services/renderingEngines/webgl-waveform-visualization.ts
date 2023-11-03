
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
        // this.regGl = createREGL({ canvas: this.canvas_el, extensions: ['OES_texture_float'] });

        this.regGl = createREGL({ gl: this.glContext, extensions: ['OES_texture_float'] });
    }


      updateBuffer() {
        const points = this.bufferData;
      }

      initBufferData() {
       let dataLength = 40000;
       this.bufferData = new Float32Array(dataLength);
      }

      drawWaveByGl() {
        let { dataArray } = this;
        let canvas = this.canvas_el;
        let bufferLength = 1000;
        let scale = 1;

        const vertices = [];
        for (let i = 0; i < bufferLength; i++) {
            let v = dataArray[i];
            let x = (i / bufferLength) * 2 - 1; // Convert x to WebGL clip space (-1 to 1)

            let y_upper = (v * scale + canvas.height / 2) / canvas.height * 2 - 1;
            let y_lower = (-v * scale + canvas.height / 2) / canvas.height * 2 - 1;

            vertices.push(x, y_upper, x, y_lower);
        }

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
        const drawTriangle = this.regGl({
            frag: fragmentShader,

            vert: vertexShader,

            attributes: {
              position: vertices,
            },

            count: vertices.length / 2,
            primitive: 'lines',
          });
      }


      render() {
        this.regGl.clear({ color: [0, 0, 0, 1] });
        this.drawWaveByGl();


        setTimeout(() => {
          this.render();
        }, 10);
      }
}


export default CanvasWaveService;