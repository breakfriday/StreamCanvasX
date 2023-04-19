class CanvasAudioVisulizer_Processor {
  private audio!: HTMLAudioElement;
  private canvas!: HTMLCanvasElement;
  private canvas1!: HTMLCanvasElement;
  private audioContext!: AudioContext;
  private canvas_context!: CanvasRenderingContext2D;
  private dataArray: any;
  private bufferLength: any;
  private analyserNode: AnalyserNode;
  private contentEl: HTMLElement;
  private canvasContext: CanvasRenderingContext2D;
  private loading: string;
  private audioSourceNode: MediaElementAudioSourceNode;
  private mediaSource_el: HTMLMediaElement;

  constructor(parmams: { media_el?: HTMLAudioElement; canvas_el?: HTMLCanvasElement; content_el: HTMLElement}) {
    const { canvas_el, media_el, content_el } = parmams;
    this.contentEl = content_el;
    if (canvas_el) {
      this.setCanvasDom(canvas_el);
    }
    this.createAudioContext();
    this.setMediaSource_el(media_el!);
    this.audioContextConnect();
  }

  setAudio(files_data) {
    const blob_url = URL.createObjectURL(files_data);
    this.audio.src = blob_url;
    this.audio.load();
    this.audio.play();
    this.analyser_channel();


    this.visulizerDraw();
  }

  createAudioContext() {
    // 创建一个音频分析节点，它可以将音频数据转换为频域或时域数据，以便进行可视化
    this.audioContext = new AudioContext();
    this.analyserNode = this.audioContext.createAnalyser();
  }

  setCanvasDom(el) {
    this.canvas = el;
    this.canvasContext = this.canvas.getContext('2d')!;
  }
  setMediaSource_el(el) {
    this.mediaSource_el = el;
    this.audioSourceNode = this.audioContext.createMediaElementSource(this.mediaSource_el);
  }
  audioContextConnect() {
    this.audioSourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);
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

      requestAnimationFrame(AnimationFrame.bind(this));
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


  // 音域
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

  // 时域
  visulizerDraw3() {
    const bufferLength = this.analyserNode.fftSize;
    const dataArray = new Float32Array(bufferLength);
    this.loading = 'false';

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

  drawLoading() {
    const ctx = this.canvasContext;
    const { canvas } = this;

    // 定义圆的半径和线宽
    const radius = 50;
    const lineWidth = 10;

    // 初始化弧形进度条的起始角度和结束角度
    let startAngle = 0;
    let endAngle = 0;

    const drawAnimation = () => {
      // 定义圆心的坐标
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      if (this.loading === 'false') {
        return false;
      }
      // 清除画布内容，准备绘制新的帧
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制背景圆圈
      ctx.beginPath(); // 开始新路径
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI); // 画一个完整的圆
      ctx.lineWidth = lineWidth; // 设置线宽
      ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)'; // 设置线条颜色
      ctx.stroke(); // 描边路径

      // 绘制loading进度弧形
      ctx.beginPath(); // 开始新路径
      ctx.arc(centerX, centerY, radius, startAngle * Math.PI, endAngle * Math.PI); // 画一个弧形
      ctx.lineWidth = lineWidth; // 设置线宽
      ctx.strokeStyle = 'rgba(50, 150, 255, 1)'; // 设置线条颜色
      ctx.stroke(); // 描边路径

      // 更新弧形进度条的起始角度和结束角度，用于下一帧的绘制
      startAngle += 0.01;
      endAngle += 0.02;

      // 当角度达到2π时，将其重置为0
      if (startAngle >= 2) {
        startAngle = 0;
      }

      if (endAngle >= 2) {
        endAngle = 0;
      }

      // 使用requestAnimationFrame()函数递归调用drawLoading()，实现动画效果
      requestAnimationFrame(drawAnimation);
    };


    drawAnimation();
  }

  setCanvasSize() {
    const height = this.contentEl.clientHeight - 30;
    const width = this.contentEl.clientWidth;


    this.canvas.height = height;
    this.canvas.width = width;
  }
}

export default CanvasAudioVisulizer_Processor;
