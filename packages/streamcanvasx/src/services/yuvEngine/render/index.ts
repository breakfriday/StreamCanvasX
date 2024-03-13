
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../../player';

import createREGL from 'regl';
class YuvRender {
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
    initGl() {

    }

    initRegl() {
        this.regGl = createREGL({ canvas: this.canvas_el, extensions: ['OES_texture_float', 'angle_instanced_arrays'] });
        let regl=this.regGl;
        const textureY = regl.texture();
        const textureU = regl.texture();
        const textureV = regl.texture();
        this.yuvTexture={ textureU,textureY,textureV };
        this.drawCommand=regl({
            frag: `
              precision mediump float;
              varying vec2 uv;
              uniform sampler2D textureY;
              uniform sampler2D textureU;
              uniform sampler2D textureV;
              void main() {
                float y = texture2D(textureY, uv).r;
                float u = texture2D(textureU, uv).r - 0.5;
                float v = texture2D(textureV, uv).r - 0.5;
                gl_FragColor = vec4(y + 1.403 * v, y - 0.344 * u - 0.714 * v, y + 1.77 * u, 1.0);
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
              textureY: () => textureY,
              textureU: () => textureU,
              textureV: () => textureV
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

    drawFrame(yData: Uint8Array, uData: Uint8Array, vData: Uint8Array, width: number, height: number) {
          // 更新纹理

          this.yuvTexture.textureY({ data: yData, width, height, format: 'luminance' });
          this.yuvTexture.textureU({ data: uData, width: width / 2, height: height / 2, format: 'luminance' });
          this.yuvTexture.textureV({ data: vData, width: width / 2, height: height / 2, format: 'luminance' });
          this.drawCommand();
    }

    // 绘制 YUV 视频帧
}


export default YuvRender;
