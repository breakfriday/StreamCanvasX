async function decode(data) {
    const codec = 'vp09.00.10.08'; // H.264 编解码器
    let config = {
      codec: codec,
      codedWidth: 640,
      codedHeight: 480,
      description: data, // 包含解码器特定信息的 ArrayBuffer 或 ArrayBufferView
    };
    let decoder = new VideoDecoder({
      output: handleDecodedFrame,
      error: error => { console.error(error); },
    });
    decoder.configure(config);
    decoder.decode(new EncodedVideoChunk({ type: 'key', timestamp: 0, data: data }));
    decoder.close();
  }


  async function handleDecodedFrame(frame) {
    let canvas: HTMLCanvasElement = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let imageBitmap = await createImageBitmap(frame);
    context.drawImage(imageBitmap, 0, 0);
  }



  function transmuxer=()=>{
    transmuxer.on('data', (segment) => {
        let track = segment.tracks.video;
      
        if (track) {
          let data = new Uint8Array(track.initSegment.byteLength + track.samples.reduce((total, sample) => total + sample.data.byteLength, 0));
          data.set(track.initSegment, 0);
          let offset = track.initSegment.byteLength;
          for (let sample of track.samples) {
            data.set(sample.data, offset);
            offset += sample.data.byteLength;
          }
      
          // 现在 data 包含 H.264 数据
        }
      });
      
  }