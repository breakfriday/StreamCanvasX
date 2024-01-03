
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
// import PlayerService from '../player';
import createREGL from 'regl';
// import BaseRenderEnging from './baseEngine';
import WavePlayerService from '../audio/wavePlayer';
import LiveAudio from './liveAudio';


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
    waveformTextures: Array<createREGL.Texture2D>;
    totalWaveforms: number;
    bufferLength: number; // 每一路音频数据的长度
    bufferData: Array<Float32Array>;// 32 路音频数据的data
    liveAudio: LiveAudio;
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
      let { converLiveData, routes } = this.wavePlayerService.config;


        this.initgl();
        this.initData();
        if (converLiveData === true) {
          this.liveAudio = new LiveAudio(routes, 512, (data) => {
            let newData = data;
            debugger;
          });
        }
    }

    // initgl() {
    //      this.regGl = createREGL({ canvas: this.canvas_el });
    //      let regl = this.regGl;


    //      this.drawCommand = this.regGl({
    //       frag: `
    //       precision highp float;
    //       uniform vec4 color;
    //       void main() {
    //         gl_FragColor = vec4(0.47, 1.0, 0.0, 1.0);
    //       }`,

    //       vert: `
    //       precision highp float;
    //       attribute vec2 position;
    //       uniform float yOffset; // 波形的垂直偏移
    //       uniform float yScale;  // 波形的垂直缩放
    //       void main() {
    //         gl_PointSize = 10.0;
    //         gl_Position = vec4(position, 0, 1);
    //       }`,
    //       attributes: {
    //         // position: this.glBuffer,
    //         position: regl.prop('buffer'),
    //       },

    //       count: this.bufferLength * 2,
    //       depth: { enable: true },
    //       primitive: 'line strip',

    //      });

    //      if (!this.glBuffer) {
    //       this.glBuffer = [];
    //       for (let i = 0; i < this.totalWaveforms; i++) {
    //         this.glBuffer[i] = this.regGl.buffer({ type: 'float', usage: 'dynamic', length: this.bufferLength * 4 });
    //       }
    //     }
    //     // if (!this.xglBuffer) {
    //     //   this.xglBuffer = this.regGl.buffer({ type: 'float', usage: 'static', length: this.bufferLength * 2 });
    //     // }
    // }

    initgl() {
      this.regGl = createREGL({ canvas: this.canvas_el, extensions: ['OES_texture_float'] });
      let regl = this.regGl;
      let indices = Array.from({ length: this.bufferLength }, (_, k) => k); // 创建索引数组
      let vertexIndexBuffer = regl.buffer(indices);

      // 着色器程序
      this.drawCommand = regl({
        frag: `
        precision highp float;
        void main() {
          gl_FragColor = vec4(0.47, 1.0, 0.0, 1.0);
        }`,

        vert: `
        precision highp float;
        attribute float pcmData; // 音频数据作为属性
        attribute float vertexIndex; // 顶点索引
        uniform sampler2D waveformTexture; // 波形纹理 其中存储音频数据
        uniform float heightScale;  // 波形的垂直缩放
        uniform float verticalOffset; // 波形的垂直偏移
        uniform float count; // 传入顶点总数
               
        void main() {
      
          float scaleX = 2.0 / (count - 1.0);
          int pcmIndex = int(vertexIndex) / 2; // 计算 pcmData 的索引
          float x = vertexIndex * scaleX - 1.0; // 计算 x 坐标
          float y = pcmData * heightScale + verticalOffset; // 计算Y坐标

          gl_Position = vec4(x, y, 0.0, 1.0);
        }`,

        uniforms: {
          heightScale: regl.prop('heightScale'),
          verticalOffset: regl.prop('verticalOffset'),
          count: regl.prop('count'),
      },
        attributes: {
          pcmData: regl.prop('buffer'),
          vertexIndex: vertexIndexBuffer, // 顶点索引
        },

        count: regl.prop('count'),
        depth: { enable: true },
        primitive: 'line strip',
      });

      // 创建存储音频数据的 GLBuffer
      if (!this.glBuffer) {
        this.glBuffer = [];
        for (let i = 0; i < this.totalWaveforms; i++) {
          this.glBuffer[i] = this.regGl.buffer({ type: 'float', usage: 'dynamic', length: this.bufferLength });
        }
      }
    }


      updateVertBuffer() {
        const heightPerWaveform = 2 / this.totalWaveforms; // 分配给每一路的高度空间
        const heightScale = heightPerWaveform * 0.3; // 实际波形的高度缩放
        let verticalOffset = 1 - heightPerWaveform / 2; // 从最顶部的波形开始计算垂直偏移

        for (let i = 0; i < this.totalWaveforms; i++) {
          let pcmData = this.bufferData[i];
          this.glBuffer[i](pcmData); // 直接将音频数据存储到 GLBuffer
          verticalOffset -= heightPerWaveform; // 更新偏移量
        }
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


      render() {
        let regl = this.regGl;
        regl.frame(() => {
          regl.clear({
            color: [0, 0, 0, 1],
            depth: 1,
          });

          const heightPerWaveform = 2 / this.totalWaveforms;
          let verticalOffset = 1 - heightPerWaveform / 2;

          for (let i = 0; i < this.totalWaveforms; i++) {
            this.drawCommand({
              buffer: this.glBuffer[i],
              count: this.bufferData[i].length,
              heightScale: heightPerWaveform * 0.3,
              verticalOffset: verticalOffset,
            });

            verticalOffset -= heightPerWaveform;
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
