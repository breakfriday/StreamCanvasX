
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../index';

import createREGL from 'regl';
import { threadId } from 'worker_threads';

interface YUVFrame {
  yData: Uint8Array;
  uData: Uint8Array;
  vData: Uint8Array;
  width: number;
  height: number;
}

@injectable()
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
    private coverMode: boolean;
    private canvasAspectRatio: number; // 图像的宽高比

    private rotationAngle: number = 0; // 旋转角度，默认为0
    hasTexture: boolean
    constructor() {

    }
    init(playerService: PlayerService) {
        this.canvasAspectRatio=1;
        this.rotationAngle=0;

        this.playerService=playerService;
        this.initCanvas();
        this.initRegl();
        this.coverMode=false;
    }
    setRotation(angle: number) {
      this.rotationAngle = angle; // 更新角度
      // 可以在这里触发重绘，如果需要实时更新
  }
   drawRotate(angle: number) {
    this.rotationAngle = angle; // 更新角度
   }

    setCover(cover: boolean) {
      this.coverMode = cover;
  }
    initCanvas() {
        let { contentEl } = this.playerService.config;

        this.canvas_el = document.createElement('canvas');
        this.canvas_el.style.position = 'absolute';
        this.canvas_el.setAttribute('name', 'glcanvas');
        contentEl.append(this.canvas_el);
        this.setCanvasSize();
    }


    initRegl() {
    //   if (!this.regGl.hasExtension('WEBGL2')) {
    //     debugger
    //     console.error('WebGL2 is not supported by your browser.');
    // }
    if(window.debugYuv===true) {
      console.log("update_yuv_texture");
    }
        this.regGl = createREGL({
          canvas: this.canvas_el,
          gl: this.canvas_el.getContext('webgl2'),
          attributes: {
            alpha: false, // 禁用画布的透明度，因为它可能影响性能
            antialias: true, // 根据需要启用或禁用抗锯齿
            depth: false, // 如果不需要深度缓存，可以禁用以节省资源
            stencil: false,
            preserveDrawingBuffer: false,
            powerPreference: 'high-performance', // 倾向于使用高性能的图形处理器
            premultipliedAlpha: false,
            desynchronized: true, // 减少延迟

          }
      });
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

                float r = y + 1.403 * v;
                float g = y - 0.344 * u - 0.714 * v;
                float b = y + 1.770 * u;

                gl_FragColor = vec4(r, g, b, 1.0);

                // gl_FragColor = vec4(y + 1.403 * v, y - 0.344 * u - 0.714 * v, y + 1.77 * u, 1.0);  // 最终 標準公式 计算转换成rgb  1.0 表示不透明
                
              }
            `,
            vert: `
            attribute vec2 position;
            varying vec2 uv;
            uniform float canvasAspectRatio;
            uniform float videoAspectRatio;
            uniform bool coverMode;
            uniform float rotation;  // 旋转角度，以度为单位
            void main() {
                vec2 adjustedPosition = position;

                if (coverMode) {
                  float scale = max(canvasAspectRatio / videoAspectRatio, 1.0);
                  adjustedPosition.x *= scale;
                  adjustedPosition.y *= scale / (canvasAspectRatio / videoAspectRatio);
                }else{
                  if (videoAspectRatio > canvasAspectRatio) {
                    adjustedPosition.y = position.y * (canvasAspectRatio / videoAspectRatio);
                  } else {
                    adjustedPosition.x = position.x * (videoAspectRatio / canvasAspectRatio);
                }

              } 
             
                
              // 应用旋转矩阵
              float rad = radians(rotation);
              float cosAngle = cos(rad);
              float sinAngle = sin(rad);
              vec2 rotatedPosition = vec2(
                  adjustedPosition.x * cosAngle - adjustedPosition.y * sinAngle,
                  adjustedPosition.x * sinAngle + adjustedPosition.y * cosAngle
              );

              uv = position * 0.5 + 0.5;
              uv.y = 1.0 - uv.y; // 翻转Y轴
              gl_Position = vec4(rotatedPosition, 0, 1);
            }
            `,
            attributes: {
              position: [
                -1, -1, // bottom left
                1, -1, // bottom right
                -1, 1,// top left

                -1, 1, // top left
                1, -1,// bottom right
                1, 1] // top right
            },
          //   elements: [
          //     [0, 1, 2], // first triangle
          //     [2, 1, 3] // second triangle
          // ],
            uniforms: {
              // textureY: () => textureY,
              // textureU: () => textureU,
              // textureV: () => textureV
              textureY: regl.prop('textureY'),
              textureU: regl.prop('textureU'),
              textureV: regl.prop('textureV'),
              canvasAspectRatio: regl.prop('canvasAspectRatio'), // 从 regl 的 context 获取画布宽高比
              videoAspectRatio: regl.prop('videoAspectRatio'), // 从属性传递视频宽高比
              coverMode: regl.prop('coverMode'),
              rotation: regl.prop('rotationAngle')
            },
            count: 6
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

          this.canvasAspectRatio= this.canvas_el.width / this.canvas_el.height; // 更新画布宽高比
          // setTimeout(() => {
          //   this.regGl.poll();
          // }, 300);
    }


    update_yuv_texture(yuvFrame: YUVFrame) {
      if(window.debugYuv===true) {
        console.log("update_yuv_texture");
      }
      if(yuvFrame) {
        let { yData, uData, vData,width,height }=yuvFrame;
        if(this.hasTexture) {
          this.yuvTexture.textureY.subimage({
            data: yData,
            width: width,
            height: height,
          });

          this.yuvTexture.textureU.subimage({
            data: uData,
            width: width/2,
            height: height/2,
          });


          this.yuvTexture.textureV.subimage({
            data: vData,
            width: width/2,
            height: height/2,
          });

          // 更新 U 纹理
        }else{
          this.yuvTexture.textureY({ data: yData, width, height, format: 'luminance',min: 'linear', mag: 'linear' });
          this.yuvTexture.textureU({ data: uData, width: width / 2, height: height / 2, format: 'luminance',min: 'linear', mag: 'linear' });
          this.yuvTexture.textureV({ data: vData, width: width / 2, height: height / 2, format: 'luminance',min: 'linear', mag: 'linear' });
          this.hasTexture=true;
        }

        this.drawCommand({
          textureY: this.yuvTexture.textureY,
          textureU: this.yuvTexture.textureU,
          textureV: this.yuvTexture.textureV,
          videoAspectRatio: width/height,
          canvasAspectRatio: this.canvasAspectRatio,
          coverMode: this.coverMode,
          rotationAngle: this.rotationAngle

        });
      }
}


    clear() {
      let regl=this.regGl;
         regl.clear({
          color: [0, 0, 0, 0],
          depth: 1,
        });
    }
    destroy() {
      this.clear();

      console.log("---------------");

      console.log("destroy","嘗試銷毀 webgl");

      console.log("---------------");

      setTimeout(() => {
        if (this.yuvTexture.textureY) {
          this.yuvTexture.textureY.destroy();
      }
      }, 0);

      setTimeout(() => {
        if (this.yuvTexture.textureU) {
          this.yuvTexture.textureU.destroy();
      }
      }, 0);

      setTimeout(() => {
        if (this.yuvTexture.textureV) {
          this.yuvTexture.textureV.destroy();
      }
      }, 0);
      setTimeout(() => {
        if(this.regGl) {
          this.regGl.destroy();
        }
      }, 0);


      if(this.canvas_el) {
        this.canvas_el.remove();
      }
    }


    // 绘制 YUV 视频帧
}


export default YuvEnging;
