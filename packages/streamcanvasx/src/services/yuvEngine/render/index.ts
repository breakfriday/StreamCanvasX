
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../player/index';

import createREGL from 'regl';

interface YUVFrame {
  yData: Uint8Array;
  uData: Uint8Array;
  vData: Uint8Array;
  width: number;
  height: number;
}

class YuvEnging {
    canvas_el: HTMLCanvasElement;
    regGl: createREGL.Regl;
    canvas_context: CanvasRenderingContext2D;
    glContext: WebGLRenderingContext;
    playerService: PlayerService;
    drawCommand: createREGL.DrawCommand;
    // yuv 紋理數據， 可以直接通過紋理對象 動態直接更新紋理，不要再dramCpmmand 中傳入
    yuvTexture: {
        textureY: createREGL.Texture2D;
        textureU: createREGL.Texture2D;
        textureV: createREGL.Texture2D;

    }
    constructor() {

    }
    init(playerService: PlayerService) {
        this.playerService=playerService;
        this.initCanvas();
        this.initGl();
    }
    initCanvas() {
        let { contentEl } = this.playerService.config;

        this.canvas_el = document.createElement('canvas');
        this.canvas_el.style.position = 'absolute';
        contentEl.append(this.canvas_el);
        this.setCanvasSize();
    }


    initRegl() {
        this.regGl = createREGL({ canvas: this.canvas_el, extensions: ['OES_texture_float', 'angle_instanced_arrays'] });
        let regl=this.regGl;
        const textureY = regl.texture({ width: 1, height: 1, format: 'luminance' }); // 存储视频帧的亮度（Y分量）信息
        const textureU = regl.texture({ width: 1, height: 1, format: 'luminance' }); // 存储色度信息
        const textureV = regl.texture({ width: 1, height: 1, format: 'luminance' }); // 存储色度信息


        this.yuvTexture={ textureU,textureY,textureV };

        // 将yuv 数据转换为RGB
        this.drawCommand=regl({
            frag: `
              precision mediump float;
              varying vec2 uv;   //纹理坐标，由顶点着色器计算-> 片段着色器
              uniform sampler2D textureY;
              uniform sampler2D textureU;
              uniform sampler2D textureV;
              void main() {
                float y = texture2D(textureY, uv).r;  //从textureY纹理中根据uv坐标采样颜色，然后提取其RGB颜色值存储到变量y中
                float u = texture2D(textureU, uv).r - 0.5; 
                float v = texture2D(textureV, uv).r - 0.5;
                gl_FragColor = vec4(y + 1.403 * v, y - 0.344 * u - 0.714 * v, y + 1.77 * u, 1.0);  // 最终 標準公式 计算转换成rgb  1.0 表示不透明
                
              }
            `,
            vert: `
              attribute vec2 position;
              varying vec2 uv;
              void main() {
                uv = position * 0.5 + 0.5;
                gl_Position = vec4(position, 0, 1);
              }
            `,
            attributes: {
              position: [
                -2, 0,
                0, -2,
                2, 2]
            },
            uniforms: {
              // textureY: () => textureY,
              // textureU: () => textureU,
              // textureV: () => textureV
              textureY: regl.prop('textureY'),
              textureU: regl.prop('textureU'),
              textureV: regl.prop('textureV'),
            },
            count: 3
          });
    }
    event() {
        this.setCanvasSize();
    }
    setCanvasSize() {
        let height = 200;
        let width = 400;
        let { contentEl } = this.playerService.config;

        if (contentEl) {
          height = contentEl.clientHeight;
          width = contentEl.clientWidth;
        }

          this.canvas_el.width = width;
          this.canvas_el.height = height;
    }


    update_yuv_texture(yuvFrame: YUVFrame) {
      if(yuvFrame) {
        let { yData, uData, vData,width,height }=yuvFrame;
        this.yuvTexture.textureY({ data: yData, width, height, format: 'luminance' });
        this.yuvTexture.textureU({ data: uData, width: width / 2, height: height / 2, format: 'luminance' });
        this.yuvTexture.textureV({ data: vData, width: width / 2, height: height / 2, format: 'luminance' });
      }
}

    render() {
      let regl=this.regGl;
      regl.frame(() => {
        regl.clear({
          color: [0, 0, 0, 1],
          depth: 1,
        });
        this.drawCommand({
          textureY: this.yuvTexture.textureY,
          textureU: this.yuvTexture.textureU,
          textureV: this.yuvTexture.textureV

        });
      });
    }

    // 绘制 YUV 视频帧
}


export default YuvEnging;
