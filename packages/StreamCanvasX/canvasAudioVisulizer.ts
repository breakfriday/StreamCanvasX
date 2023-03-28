class CanvasAudioVisulizer_Processor {
  private audio!: HTMLAudioElement;
  private canvas!: HTMLCanvasElement;
  private audioContext!: AudioContext;
  private context!: CanvasRenderingContext2D;

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


    // 创建了一个新的 AnalyserNode 对象
    const analyser = this.audioContext.createAnalyser();

    //  创建了一个 MediaElementSourceNode 对象 .  关联HTMLMediaElement. 这可以用来播放和处理来自<video>或<audio> 元素的音频.
    const audioSrc = this.audioContext.createMediaElementSource(this.audio);

    // AudioContext 的输出连接到 AnalyserNode 的输入，将 HTML5 Audio 元素与 AnalyserNode 的输入连接，以便在 AnalyserNode 中处理音频数据。
    audioSrc.connect(analyser);
    analyser.connect(this.audioContext.destination);
  }
}


export default CanvasAudioVisulizer_Processor;

