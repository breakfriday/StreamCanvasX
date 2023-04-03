class Audio_Process {
  private mediaSource_el!: HTMLAudioElement|HTMLVideoElement;
  private canvas!: HTMLCanvasElement;
  private audioContext!: AudioContext;
  private canvasContext!: CanvasRenderingContext2D;
  private analyserNode: AnalyserNode;
  private audioSourceNode: MediaElementAudioSourceNode;

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
    requestAnimationFrame(this.visulizerDraw.bind(this));
    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

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

      this.canvasContext.fillStyle = 'rgb(0, 0, 0)';
      this.canvasContext.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }
}

export default Audio_Process;
