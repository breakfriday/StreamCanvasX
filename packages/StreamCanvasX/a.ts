const canvas = document.getElementById('audio_visualizer');
const canvasContext = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

navigator.mediaDevices.getUserMedia({ audio: true })
  .then((stream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      canvasContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);

      canvasContext.linegit Width = 2;
      canvasContext.strokeStyle = 'rgb(0, 255, 0)';
      canvasContext.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);  
        }

        x += sliceWidth;
      }

      canvasContext.lineTo(canvas.width, canvas.height / 2);
      canvasContext.stroke()
    };

    draw();
  })
  .catch((err) => {
    console.error(err);
  });
  