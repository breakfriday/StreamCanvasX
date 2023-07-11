onmessage = (event) => {
    let offscreenCanvas = event.data.canvas;
    let { bufferData } = event.data;
    let bufferLength = bufferData.length;

    let canvasContext = offscreenCanvas.getContext('2d');
    let animationId = null;

    function AnimationFrame() {
      if (self.clear) {
        cancelAnimationFrame(animationId);
        return;
      }

      if (self.loading === false) {
        canvasContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

        // 设置波形图样式
        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = '#7f0';

        // 绘制波形图
        canvasContext.beginPath();
        const sliceWidth = offscreenCanvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const value = bufferData[i] * offscreenCanvas.height / 2;
          const y = offscreenCanvas.height / 2 + value;

          if (i === 0) {
            canvasContext.moveTo(x, y);
          } else {
            canvasContext.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasContext.lineTo(offscreenCanvas.width, offscreenCanvas.height / 2);
        canvasContext.stroke();
      }

      animationId = requestAnimationFrame(AnimationFrame);
    }

    AnimationFrame();
  };