class CanvasAudioVisulizer_Processor {
  private audio!: HTMLAudioElement;
  private canvas!: HTMLCanvasElement;
  private audioContext!: AudioContext;
  private canvas_context!: CanvasRenderingContext2D;
  private dataArray: any;
  private bufferLength: any;
  private analyserNode: AnalyserNode;

  constructor(parmams: { audio_el: HTMLAudioElement; canvas_el: HTMLCanvasElement }) {
    this.audio = parmams.audio_el;
    this.canvas = parmams.canvas_el;
    this.audioContext = new AudioContext();
    if (this.canvas) {
      this.canvas_context = this.canvas.getContext('2d')!;
    }
  }

  setAudio(files_data) {
    const blob_url = URL.createObjectURL(files_data);
    this.audio.src = blob_url;
    this.audio.load();
    this.audio.play();


    // 创建了一个新的 AnalyserNode 对象 ,这是一个 Web Audio API 中的节点，它可以将音频数据转换为频域或时域数据，以便进行可视化
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 256;

    //  创建了一个 MediaElementSourceNode 对象 .  关联HTMLMediaElement. 这可以用来播放和处理来自<video>或<audio> 元素的音频.
    const sourceNode = this.audioContext.createMediaElementSource(this.audio);

    // AudioContext 的输出连接到 AnalyserNode 的输入，将 HTML5 Audio 元素与 AnalyserNode 的输入连接，以便在 AnalyserNode 中处理音频数据。
    sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);

    this.bufferLength = this.analyserNode.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.visulizerDraw();
  }

  visulizerDraw() {
    let x = 0;
    const CANVAS_WIDTH = this.canvas.width;
    const CANVAS_HEIGHT = this.canvas.height;
    const barWidth = (CANVAS_WIDTH / this.bufferLength) * 2.5;
    let barHeight;
    const AnimationFrame = () => {
      x = 0;

      this.analyserNode.getByteFrequencyData(this.dataArray);

      this.canvas_context.fillStyle = '#000';
      this.canvas_context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = 0; i < this.bufferLength; i++) {
        barHeight = this.dataArray[i];

        const r = barHeight + (25 * (i / this.bufferLength));
        const g = 250 * (i / this.bufferLength);
        const b = 50;

        this.canvas_context.fillStyle = `rgb(${r},${g},${b})`;
        this.canvas_context.fillRect(x, CANVAS_HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
        this.analyserNode.getByteFrequencyData(this.dataArray);
      }

      requestAnimationFrame(AnimationFrame);
    };

    AnimationFrame();
  }
}

export default CanvasAudioVisulizer_Processor;
