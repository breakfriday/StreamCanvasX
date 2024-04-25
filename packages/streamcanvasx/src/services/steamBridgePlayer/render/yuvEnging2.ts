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
class YuvEngine {
    canvas_el: HTMLCanvasElement;
    glContext: WebGL2RenderingContext;
    playerService: PlayerService;
    yuvTexture: {
        textureY: WebGLTexture;
        textureU: WebGLTexture;
        textureV: WebGLTexture;
    };
    private coverMode: boolean;
    private canvasAspectRatio: number;
    private rotationAngle: number = 0;
    hasTexture: boolean = false;

    constructor(playerService: PlayerService) {
        this.playerService = playerService;
    }

    init() {
        this.initCanvas();
        this.initWebGL();
        this.coverMode = false;
        this.canvasAspectRatio = 1;
        this.rotationAngle = 0;
    }

    setRotation(angle: number) {
        this.rotationAngle = angle;
        // Trigger a redraw here if real-time updating is necessary
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

    initWebGL() {
        this.glContext = this.canvas_el.getContext('webgl2');
        if (!this.glContext) {
            console.error('WebGL2 is not supported by your browser.');
            return;
        }
        this.initShaders();
        this.initTextures();
    }

    initShaders() {
        const vertexShaderSource = `
            attribute vec2 position;
            varying vec2 uv;
            uniform float canvasAspectRatio;
            uniform float videoAspectRatio;
            uniform bool coverMode;
            uniform float rotation;
            void main() {
                vec2 adjustedPosition = position;
                if (coverMode) {
                    float scale = max(canvasAspectRatio / videoAspectRatio, 1.0);
                    adjustedPosition.x *= scale;
                    adjustedPosition.y *= scale / (canvasAspectRatio / videoAspectRatio);
                } else {
                    if (videoAspectRatio > canvasAspectRatio) {
                        adjustedPosition.y = position.y * (canvasAspectRatio / videoAspectRatio);
                    } else {
                        adjustedPosition.x = position.x * (videoAspectRatio / canvasAspectRatio);
                    }
                }
                float rad = radians(rotation);
                float cosAngle = cos(rad);
                float sinAngle = sin(rad);
                vec2 rotatedPosition = vec2(
                    adjustedPosition.x * cosAngle - adjustedPosition.y * sinAngle,
                    adjustedPosition.x * sinAngle + adjustedPosition.y * cosAngle
                );
                uv = position * 0.5 + 0.5;
                uv.y = 1.0 - uv.y;
                gl_Position = vec4(rotatedPosition, 0, 1);
            }
        `;
        const fragmentShaderSource = `
            precision mediump float;
            varying vec2 uv;
            uniform sampler2D textureY;
            uniform sampler2D textureU;
            uniform sampler2D textureV;
            void main() {
                float y = texture2D(textureY, uv).r;
                float u = texture2D(textureU, uv).r - 0.5;
                float v = texture2D(textureV, uv).r - 0.5;
                float r = y + 1.403 * v;
                float g = y - 0.344 * u - 0.714 * v;
                float b = y + 1.770 * u;
                gl_FragColor = vec4(r, g, b, 1.0);
            }
        `;
        // Compile and link shaders here
    }

    initTextures() {
        const gl = this.glContext;
        this.yuvTexture = {
            textureY: gl.createTexture(),
            textureU: gl.createTexture(),
            textureV: gl.createTexture()
        };
        // Initialize and configure textures here
    }

    update_yuv_texture(yuvFrame) {
        const gl = this.glContext;
        if (yuvFrame) {
            let { yData, uData, vData, width, height } = yuvFrame;
            this.updateTexture(this.yuvTexture.textureY, yData, width, height);
            this.updateTexture(this.yuvTexture.textureU, uData, width / 2, height / 2);
            this.updateTexture(this.yuvTexture.textureV, vData, width / 2, height / 2);
            // Update textures and draw here
        }
    }

    updateTexture(texture, data, width, height) {
        const gl = this.glContext;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
        // Set texture parameters here if necessary
    }

    setCanvasSize() {
        let { contentEl } = this.playerService.config;
        this.canvas_el.width = contentEl.clientWidth;
        this.canvas_el.height = contentEl.clientHeight;
        this.canvasAspectRatio = this.canvas_el.width / this.canvas_el.height;
    }

    clear() {
        const gl = this.glContext;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    destroy() {
        const gl = this.glContext;
        gl.deleteTexture(this.yuvTexture.textureY);
        gl.deleteTexture(this.yuvTexture.textureU);
        gl.deleteTexture(this.yuvTexture.textureV);
        this.canvas_el.remove();
    }
}
