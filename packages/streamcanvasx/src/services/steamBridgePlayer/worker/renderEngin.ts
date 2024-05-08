import { initial } from 'lodash';
import createREGL from 'regl';


interface YUVFrame {
  yData: Uint8Array;
  uData: Uint8Array;
  vData: Uint8Array;
  width: number;
  height: number;
  yDataSize?: number;
  uDataSize?: number;
  vDataSize?: number;
  actualRowWidth?: number;
  validWidth?: number;

}

class YuvEngine {
    canvas_el: HTMLCanvasElement;
    regGl: createREGL.Regl;
    canvas_context: CanvasRenderingContext2D;
    glContext: WebGLRenderingContext;
    drawCommand: createREGL.DrawCommand;
    // yuv 紋理數據， 可以直接通過紋理對象 動態直接更新紋理，不要再dramCpmmand 中傳入
    yuvTexture: {
        textureY: createREGL.Texture2D;
        textureU: createREGL.Texture2D;
        textureV: createREGL.Texture2D;

    }
    private coverMode: boolean;
    private canvasAspectRatio: number; // 图像的宽高比

    private rotationAngle: number = 0; // 旋转角度，默认为0

    constructor() {

    }

    init() {

    }
}

export default YuvEngine;