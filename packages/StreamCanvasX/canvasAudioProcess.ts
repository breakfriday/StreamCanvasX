import { WaveDecorator } from './AudioWaveformVisualizerDecorator';

// 定义一个绘图接口
interface IDrawer {
  mediaSource_el: HTMLAudioElement|HTMLVideoElement;
  canvas: HTMLCanvasElement;
  audioContext: AudioContext;
  canvasContext: CanvasRenderingContext2D;
  analyserNode: AnalyserNode;
  audioSourceNode: MediaElementAudioSourceNode;
}


@WaveDecorator()
class Audio_Process implements IDrawer {
  mediaSource_el!: HTMLAudioElement|HTMLVideoElement;
  canvas!: HTMLCanvasElement;
  audioContext!: AudioContext;
  canvasContext!: CanvasRenderingContext2D;
  analyserNode: AnalyserNode;
  audioSourceNode: MediaElementAudioSourceNode;

  constructor(parmams: { media_el?: HTMLAudioElement; canvas_el?: HTMLCanvasElement}) {
    const { canvas_el, media_el } = parmams;
    if (canvas_el) {
      this.setCanvasDom(canvas_el);
    }
    this.createAudioContext();
    this.setMediaSource_el(media_el);
    this.audioContextConnect();
  }


  createAudioContext() {
    this.audioContext = new AudioContext();
    this.analyserNode = this.audioContext.createAnalyser();
  }

  setCanvasDom(el: HTMLCanvasElement) {
    this.canvas = el;
    this.canvasContext = this.canvas.getContext('2d')!;
  }

  setMediaSource_el(el) {
    this.mediaSource_el = el;
    this.audioSourceNode = this.audioContext.createMediaElementSource(el);
  }

  audioContextConnect() {
    this.audioSourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);
  }

  visulizerDraw() {
    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const AnimationFrame = () => {
      requestAnimationFrame(AnimationFrame.bind(this));
      // 获取音频数据
      this.analyserNode.getByteFrequencyData(dataArray);

      // 清除canvas
      this.canvasContext.fillStyle = 'rgb(255, 255, 255)';
      this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // 设置绘制音频数据的样式
      const barWidth = (this.canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        const r = barHeight + (25 * (i / bufferLength));
        const g = 250 * (i / bufferLength);
        const b = 50;

        // this.canvasContext.fillStyle = 'rgb(0, 0, 0)';
        // this.canvas_context.fillStyle = `rgb(${r},${g},${b})`;
        this.canvasContext.fillStyle = 'rgb(0, 0, 0)';
        this.canvasContext.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };
    AnimationFrame();
  }

  visulizerDraw1() {
    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const AnimationFrame = () => {
      requestAnimationFrame(AnimationFrame.bind(this));
      // 将音频数据填充到数组当中
      this.analyserNode.getByteFrequencyData(dataArray);

      // 清除canvas
      this.canvasContext.fillStyle = '#000';
      this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

      const barWidth = (this.canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        const r = barHeight + (25 * (i / bufferLength));
        const g = 250 * (i / bufferLength);
        const b = 50;

        this.canvasContext.fillStyle = `rgb(${r},${g},${b})`;
        this.canvasContext.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    AnimationFrame();
  }


  // 时域
  visulizerDraw2() {
    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const AnimationFrame = () => {
      requestAnimationFrame(AnimationFrame.bind(this));
      // 获取音频数据
      this.analyserNode.getByteFrequencyData(dataArray);


      this.canvasContext.fillStyle = 'rgba(0, 0, 0, 0.05)';
      this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasContext.lineWidth = 2;
      this.canvasContext.strokeStyle = 'rgb(0, 255, 0)';

      this.canvasContext.beginPath();

      const sliceWidth = this.canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * this.canvas.height / 2;

        if (i === 0) {
          this.canvasContext.moveTo(x, y);
        } else {
          this.canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
      }

      this.canvasContext.lineTo(this.canvas.width, this.canvas.height / 2);
      this.canvasContext.stroke();
    };

    AnimationFrame();
  }

  visulizerDraw3() {
    const bufferLength = this.analyserNode.fftSize;
    const dataArray = new Float32Array(bufferLength);

    const AnimationFrame = () => {
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
      for (let i = 0; i < bufferLength; i++) {
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

  visulizerDraw4() {
    const bufferLength = this.analyserNode.fftSize;
    const dataArray = new Float32Array(bufferLength);
    const AnimationFrame = () => {
      requestAnimationFrame(AnimationFrame.bind(this));
      this.analyserNode.getFloatTimeDomainData(dataArray);

      this.canvasContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
      this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.canvasContext.lineWidth = 2;
      this.canvasContext.strokeStyle = 'rgb(0, 255, 0)';
      this.canvasContext.beginPath();

      const sliceWidth = this.canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * this.canvas.height / 2;

        if (i === 0) {
          this.canvasContext.moveTo(x, y);
        } else {
          this.canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
      }

      this.canvasContext.lineTo(this.canvas.width, this.canvas.height / 2);
      this.canvasContext.stroke();
    };

    AnimationFrame();
  }
}

export default Audio_Process;
