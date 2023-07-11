let offscreenCanvas = '';
let canvasContext = '';
let bufferData = '';

onmessage = (event) => {
    switch (event.data.event) {
        case 'updateBufferData':
          // 处理更新 bufferData 的逻辑
            render_audio_buffer(event);
          break;
        // 可以添加其他 case 来处理不同的事件
        default:
          break;
      }
  };


  const update_buffer = (event) => {
    const { dataArray, bufferDataLength } = event.data;


    if (bufferData === '') {
        bufferData = new Float32Array(bufferDataLength);
    }


    // Move old data forward
    bufferData.copyWithin(0, dataArray.length);


    // Add new data to the end of the buffer
    bufferData.set(dataArray, bufferDataLength - dataArray.length);
  };


  const render_audio_buffer = (event) => {
    let animationId = null;


    let { dataArray } = event.data;
    let { bufferLength } = event.data;

    if (event.data.canvas) {
        offscreenCanvas = event.data.canvas;
        canvasContext = offscreenCanvas.getContext('2d');
    }

    let canvas = offscreenCanvas;


    const AnimationFrame = () => {
        if (this.clear === true) {
            // This returns the function, effectively stopping the loop
            return;
        }


            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = '#7f0';

            canvasContext.beginPath();
            const sliceWidth = canvas.width / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const value = dataArray[i] * canvas.height / 2;
                const y = canvas.height / 2 + value;

                if (i === 0) {
                    canvasContext.moveTo(x, y);
                } else {
                    canvasContext.lineTo(x, y);
                }

                x += sliceWidth;
            }
            canvasContext.lineTo(canvas.width, canvas.height / 2);
            canvasContext.stroke();


        // Use setTimeout here to loop function call. Adjust the delay time as per your requirement. Here 1000/60 mimics a framerate of 60 FPS, similar to requestAnimationFrame
        // setTimeout(AnimationFrame.bind(this), 1000 / 30);
    };
    AnimationFrame();
  };