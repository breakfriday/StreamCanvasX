import { _ as _define_property } from "@swc/helpers/_/_define_property";
export class WaveformVisualizer {
    drawAudio1() {
        const bufferLength = this.analyserNode.fftSize;
        const dataArray = new Float32Array(bufferLength);
        const AnimationFrame = ()=>{
            this.analyserNode.getFloatTimeDomainData(dataArray);
            // 清除画布
            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // 设置波形图样式
            this.canvasContext.lineWidth = 2;
            this.canvasContext.strokeStyle = '#7f0';
            // 绘制波形图
            this.canvasContext.beginPath();
            const sliceWidth = this.canvas.width / bufferLength;
            let x = 0;
            for(let i = 0; i < bufferLength; i++){
                const value = dataArray[i] * this.canvas.height / 2;
                const y = this.canvas.height / 2 + value;
                if (i === 0) {
                    this.canvasContext.moveTo(x, y);
                } else {
                    this.canvasContext.lineTo(x, y);
                }
                x += sliceWidth;
            }
            this.canvasContext.lineTo(this.canvas.width, this.canvas.height / 2);
            this.canvasContext.stroke();
            // 循环绘制
            requestAnimationFrame(AnimationFrame.bind(this));
        };
        AnimationFrame();
    }
    constructor(){
        _define_property(this, "mediaSource_el", void 0);
        _define_property(this, "canvas", void 0);
        _define_property(this, "audioContext", void 0);
        _define_property(this, "canvasContext", void 0);
        _define_property(this, "analyserNode", void 0);
        _define_property(this, "audioSourceNode", void 0);
    }
}

 //# sourceMappingURL=waveform_visualizer_render.js.map