class Processor {
  private video!: HTMLVideoElement;
  private audio!: HTMLAudioElement;
  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;

  constructor(parmams: { audio_el: HTMLAudioElement; canvas_el: HTMLCanvasElement }) {
    this.audio = parmams.audio_el;
    this.canvas = parmams.canvas_el;
    if (this.canvas) {
      this.context = this.canvas.getContext('2d')!;
    }
    this.setAudio('');
    this.audio.play();
  }

  setAudio(files_data) {
    const blob_url = URL.createObjectURL(files_data);
    this.audio.src = blob_url;
    this.audio.load();
  }
}


export default Processor;

