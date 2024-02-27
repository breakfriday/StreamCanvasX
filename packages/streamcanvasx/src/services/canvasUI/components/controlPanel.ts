class VideoController {
    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private isPlaying: boolean;
    private handleRadius: number = 10; // 句柄的半径
    offsetX: number

    constructor(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) {
      this.video = videoElement;
      this.canvas = canvasElement;
      this.ctx = this.canvas.getContext('2d');
      this.isPlaying = false;
      this.offsetX=0;

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
      // let { offsetX } = this;
      // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // // Draw progress bar
      // const progress = (this.video.currentTime / this.video.duration) * (this.canvas.width-offsetX);
      // this.ctx.fillStyle = 'green';
      // this.ctx.fillRect(offsetX, 0, progress, 10);
      // // Draw play/pause toggle
      // this.ctx.fillStyle = this.isPlaying ? 'red' : 'blue';
      // this.ctx.fillRect(150, 20, 20, 20); // 假定播放/暂停按钮的简单表示

      this.drawProgress();
    }

    private drawProgress() {
      let { offsetX } = this;
      const progress_wh=this.canvas.width-offsetX;

      const cur_progress_wh = (this.video.currentTime / this.video.duration) * progress_wh;
      const progressBarHeight = 4; // 进度条的高度

      // 清除画布
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // 绘制进度条背景
      this.ctx.fillStyle = 'rgba(211, 211, 211, 0.5)';
      this.ctx.fillRect(offsetX, (this.canvas.height - progressBarHeight) / 2, progress_wh, progressBarHeight);

      // 绘制进度
      this.ctx.fillStyle = 'lightblue';
      this.ctx.fillRect(offsetX, (this.canvas.height - progressBarHeight) / 2, cur_progress_wh, progressBarHeight);

      // 绘制圆形句柄
      this.ctx.fillStyle = 'white';
      this.ctx.beginPath();
      this.ctx.arc(offsetX+cur_progress_wh, this.canvas.height / 2, this.handleRadius, 0, Math.PI * 2);
      this.ctx.fill();
  }
  }


  export default VideoController;