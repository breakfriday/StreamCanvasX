class Processor {
  constructor() {
    this.video = document.getElementById('video');
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');

    this.video.addEventListener(
      'play',
      () => {
        requestAnimationFrame(this.analyzeCanvas.bind(this));
      },
      false,
    );
  }

  analyzeCanvas() {
    if (this.video.ended || this.video.paused) {
      return;
    }

    this.context.drawImage(
      this.video,
      0,
      0,
      this.video.width,
      this.video.height,
    );

    const {
      data: [r, g, b],
    } = this.context.getImageData(0, 0, 1, 1);

    document.body.style.cssText = `background: rgb(${r}, ${g}, ${b});`;
    requestAnimationFrame(this.analyzeCanvas.bind(this));
  }
}

