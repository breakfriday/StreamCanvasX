class VideoController {
    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private isPlaying: boolean;
    offsetX: number

    constructor(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) {
      this.video = videoElement;
      this.canvas = canvasElement;
      this.ctx = this.canvas.getContext('2d');
      this.isPlaying = false;
      this.offsetX=100;

      this.initControls();
      this.update();
    }

    initControls() {
      let { offsetX } = this;
      this.canvas.addEventListener('click', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;


        if (x > 0 && x < offsetX) { //  判断是否点击了播放/暂停按钮
           return false;
        } else {
          // 调整视频进度
         // const clickedTime = (x / (this.canvas.width- offsetX)) * this.video.duration;
          const clickedTime = ((x - offsetX) / (this.canvas.width - offsetX)) * this.video.duration;

          this.video.currentTime = clickedTime;
        }
      });
    }

    togglePlayPause() {
      if (this.video.paused || this.video.ended) {
        this.video.play();
        this.isPlaying = true;
      } else {
        this.video.pause();
        this.isPlaying = false;
      }
    }

    update() {
      requestAnimationFrame(() => this.update());
      this.drawControls();
    }

    drawControls() {
      let { offsetX } = this;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // Draw progress bar
      const progress = (this.video.currentTime / this.video.duration) * (this.canvas.width-offsetX);
      this.ctx.fillStyle = 'green';
      this.ctx.fillRect(offsetX, 0, progress, 10);
      // Draw play/pause toggle
      this.ctx.fillStyle = this.isPlaying ? 'red' : 'blue';
      this.ctx.fillRect(150, 20, 20, 20); // 假定播放/暂停按钮的简单表示
    }
  }


  export default VideoController;