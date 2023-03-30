class CanvasAudioVisulizer_Processor {
  private audio!: HTMLAudioElement;
  private canvas!: HTMLCanvasElement;
  private canvas1!: HTMLCanvasElement;
  private audioContext!: AudioContext;
  private canvas_context!: CanvasRenderingContext2D;
  private dataArray: any;
  private bufferLength: any;
  private analyserNode: AnalyserNode;

  constructor(parmams: { audio_el: HTMLAudioElement; canvas_el: HTMLCanvasElement; canvas_el1: HTMLCanvasElement }) {
    this.audio = parmams.audio_el;
    this.canvas = parmams.canvas_el;
    this.canvas1 = parmams.canvas_el1;
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
    this.analyser_channel();


    this.visulizerDraw();
  }

  analyser_channel() {
    // 创建一个音频分析节点，它可以将音频数据转换为频域或时域数据，以便进行可视化
    this.analyserNode = this.audioContext.createAnalyser();
    // Must be a power of 2 between 2 5 and 2 15 , so one of: 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768. Defaults to 2048.
    this.analyserNode.fftSize = 2048;

    //  创建了一个 MediaElementSourceNode 对象 .  关联HTMLMediaElement. 这可以用来播放和处理来自<video>或<audio> 元素的音频.
    const elementSourceNode = this.audioContext.createMediaElementSource(this.audio);


    // 将 MediaElementSourceNode（音频元素）的输出连接到 AnalyserNode（音频分析器）的输入。(将 HTML5 Audio 元素与 AnalyserNode 的输入连接)
    // 这样，音频数据就可以在 AnalyserNode 中进行处理
    elementSourceNode.connect(this.analyserNode);
    // 将 AnalyserNode 的输出连接到 AudioContext 的输出（扬声器）。
    // 这将使音频数据经过分析后再播放。
    this.analyserNode.connect(this.audioContext.destination);

    this.bufferLength = this.analyserNode.frequencyBinCount;
    // 创建  frequencyBinCount长度的Uint8Array (8 位无符号整型数组)数组，用于存放音频数据
    // 为什么使用Uint8Array ，因为音频频的每个数据占用一个字节，当音频无数据时，array中的值均为0。每一个字节有8位，最大值为2的8次方，即256。
    this.dataArray = new Uint8Array(this.bufferLength);
  }

  // 获取音频解析数据
  getByteFrequencyData() {
    this.dataArray = new Uint8Array(this.bufferLength);
  }

  visulizerDraw() {
    let x = 0;
    const CANVAS_WIDTH = this.canvas.width;
    const CANVAS_HEIGHT = this.canvas.height;
    const barWidth = (CANVAS_WIDTH / this.bufferLength) * 2.5;
    let barHeight;
    const AnimationFrame = () => {
      x = 0;

      // 将音频数据填充到数组当中
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

  visulizerDraw1() {
    const x = 0;
    let canvas_context;

    if (this.canvas1) {
      canvas_context = this.canvas1.getContext('2d')!;
    }

    const CANVAS_WIDTH = canvas_context.width;
    const CANVAS_HEIGHT = canvas_context.height;


    const AnimationFrame = () => {

    };

    AnimationFrame();
  }
}

export default CanvasAudioVisulizer_Processor;
