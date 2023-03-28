class CanvasAudioVisulizer_Processor {
  private audio!: HTMLAudioElement;
  private canvas!: HTMLCanvasElement;
  private audioContext!: AudioContext;
  private context!: CanvasRenderingContext2D;
  private dataArray: any;
  private analyserNode: AnalyserNode;

  constructor(parmams: { audio_el: HTMLAudioElement; canvas_el: HTMLCanvasElement }) {
    this.audio = parmams.audio_el;
    this.canvas = parmams.canvas_el;
    this.audioContext = new AudioContext();
    if (this.canvas) {
      this.context = this.canvas.getContext('2d')!;
    }
  }

  setAudio(files_data) {
    const blob_url = URL.createObjectURL(files_data);
    this.audio.src = blob_url;
    this.audio.load();
    this.audio.play();


    // 创建了一个新的 AnalyserNode 对象 ,这是一个 Web Audio API 中的节点，它可以将音频数据转换为频域或时域数据，以便进行可视化
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 2048;

    //  创建了一个 MediaElementSourceNode 对象 .  关联HTMLMediaElement. 这可以用来播放和处理来自<video>或<audio> 元素的音频.
    const sourceNode = this.audioContext.createMediaElementSource(this.audio);

    // AudioContext 的输出连接到 AnalyserNode 的输入，将 HTML5 Audio 元素与 AnalyserNode 的输入连接，以便在 AnalyserNode 中处理音频数据。
    sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);

    const bufferLength = this.analyserNode.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  visulizerDraw() {
    const x = 0;
    const requestAnimationFrame = () => {
      this.analyserNode.getByteFrequencyData(this.dataArray);
    };

    requestAnimationFrame();
  }
}


export default CanvasAudioVisulizer_Processor;

