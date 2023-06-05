// class VideoPlayer {
//     constructor(canvasId, codec) {
//       this.canvas = document.getElementById(canvasId);
//       this.context = this.canvas.getContext('2d');
//       this.codec = codec;
//       this.decoder = null;
//       this.pendingFrame = null;
//       this.playing = false;
//     }

//     async play(file) {
//       if (this.decoder) {
//         this.decoder.close();
//       }

//       let fileReader = new FileReader();
//       fileReader.onload = e => this.startDecoding(e.target.result);
//       fileReader.readAsArrayBuffer(file);

//       this.playing = true;
//       this.drawFrame();
//     }

//     async startDecoding(buffer) {
//       this.decoder = new VideoDecoder({
//         output: frame => {
//           this.pendingFrame = frame;
//         },
//         error: e => {
//           console.error(e);
//         },
//       });

//       await this.decoder.configure({ codec: this.codec });
//       this.decoder.decode(new EncodedVideoChunk({
//         type: 'key',
//         timestamp: 0,
//         data: buffer,
//       }));
//     }

//     drawFrame() {
//       if (this.pendingFrame) {
//         this.context.drawImage(this.pendingFrame, 0, 0);
//         this.pendingFrame.close();
//         this.pendingFrame = null;
//       }

//       // Schedule the next frame draw
//       if (this.playing) {
//         requestAnimationFrame(() => this.drawFrame());
//       }
//     }

//     stop() {
//       if (this.decoder) {
//         this.decoder.close();
//         this.decoder = null;
//       }

//       this.playing = false;
//     }
//   }
