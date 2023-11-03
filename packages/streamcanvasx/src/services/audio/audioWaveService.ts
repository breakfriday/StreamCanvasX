import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import RingBuffer from './ringBuffer';
import { IWavePlayerConfig } from '../../types/services';

@injectable()
class AudioWave {
  routes: number;
  renderType: number;
  arrayLength: number;
  updateArrayLength: number;
  width: number;
  height: number;
  clear: boolean;
  isMocking: boolean;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  bufferMap: Map<number, RingBuffer>;
  analyserArrayMap: Map<number, Float32Array>;
  contextMap: Map<number, object>; // audiocontextMap
  observer: ResizeObserver;
  updateArrayTimes: number;
  hasSetSize: boolean;
  renderTimes: number;

  constructor() {
    this.hasSetSize = false;
  }

  init(config: IWavePlayerConfig) {
    // debugger;
    // this.updateDataTimeId = '';
    let { routes, contentEl, isMocking = false, renderType = 1, arrayLength = 8000 * 5, updateArrayLength = 160, width = 1600, height = 50 * 32, updateArrayTimes = 20, renderTimes = 20 } = config;
    this.renderType = renderType;
    this.routes = routes;
    this.isMocking = !isMocking;
    this.width = width;
    this.height = height;
    this.arrayLength = arrayLength;
    this.updateArrayLength = updateArrayLength;
    this.updateArrayTimes = updateArrayTimes;
    this.renderTimes = renderTimes;
    const element = contentEl;
    let i = arrayLength;
    let array = [];
    while (i > 0) {
      array.push(0);
      i--;
    }

    // debugger;
    switch (this.renderType) {
      case 1: // canvas2d
          break;
      case 2: // audioContext
          this.analyserArrayMap = new Map();
          this.contextMap = new Map();
          for (let i = 0; i < this.routes; i++) {
            this.analyserArrayMap.set(i, new Float32Array(64));
            let context = this.initAudioContext();
            this.contextMap.set(i, context);
          }
          break;
      case 3: // webGL
          break;
      default:
          break;
    }

    this.bufferMap = new Map();
    for (let i = 0; i < this.routes; i++) {
      this.bufferMap.set(i, new RingBuffer(this.arrayLength));
      this.bufferMap.get(i).enqueueBulk(array);
    }
    this.initCanvas(element);
  }

  initAudioContext() {
    let audioContext = new AudioContext({ sampleRate: 8000 });
    let audioSource = audioContext.createBufferSource();
    let buffer = audioContext.createBuffer(
      1,		// 1	 number of channels
      160, // 1024  frameCount
      8000, //  audioContext.sampleRate
    );
    let bufferList = [];
    bufferList.push(buffer);

    let scriptNode = audioContext.createScriptProcessor(1024, 0, 1);
    scriptNode.onaudioprocess = (audioProcessingEvent) => {
      const { outputBuffer } = audioProcessingEvent;
      const bufferItem = bufferList[0];
      bufferList.shift();

      const nowBuffering = outputBuffer.getChannelData(0);
      for (let i = 0; i < 128; i++) {
        nowBuffering[i] = bufferItem[i] || 0;
      }
    };

    let fftsize = 128;
    let analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = fftsize;

    scriptNode.connect(analyserNode);
    audioSource.buffer = buffer;
    analyserNode.connect(audioContext.destination);

    let context = {
      audioContext,
      analyserNode,
      scriptNode,
      audioSource,
      bufferList,
    };
    return context;
  }
  initCanvas(contentEl: HTMLElement) {
    const element = contentEl;

    this.canvas = document.createElement('canvas');
    this.canvas.height = this.height;
    this.canvas.width = this.width;
    // this.canvas.width = this.arrayLength;
    this.canvas.style.display = 'block';
    this.canvas.style.position = 'relative';
    if (element) {
      element.append(this.canvas);
    }
    this.setCanvasSize(element);
    this.ctx = this.canvas.getContext('2d');
  }
  setCanvasSize(element: HTMLElement) {
    let timeId: any = '';
    this.observer = new ResizeObserver(entries => {
      if (timeId) {
        clearTimeout(timeId);
      }

      timeId = setTimeout(() => {
        // console.log('监听到了尺寸变化了...', entries);
        // this.canvas.style.width = `${entries[0].contentRect.width}px`; // css 缩放目前可以解决模糊问题，但是对后续绘制影响有待研究
        this.canvas.width = entries[0].contentRect.width;
        this.hasSetSize = true;
      }, 200);
    });
    this.observer.observe(element);
  }

  destory() {
    this.clear = true;
    this.observer.disconnect();
    console.log('destory');
  }

  start() {
    // this.drawWave(renderTimes); // ms

    switch (this.renderType) {
      case 1: // canvas2d
          this.renderCanvas(); // ms
          break;
      case 2: // audioContext
          break;
      case 3: // webGL
          break;
      default:
          break;
    }
  }
  // renderCanvas(renderTimes: number) {
  //   const $this = this;
  //   let timeId: any = '';
  //   const AnimationFrame = () => {
  //     if ($this.clear === true) {
  //       // This returns the function, effectively stopping the loop
  //       clearTimeout(timeId);
  //       return;
  //     }
  //     debugger;
  //     if ($this.hasSetSize || timeId === '') {
  //       $this.drawWave();
  //     } else {
  //       $this.updateWave();
  //     }
  //     // if ($this.isMocking) {
  //     //   $this.mock();
  //     // }
  //     timeId = setTimeout(AnimationFrame.bind(this), renderTimes);
  //   };
  //   AnimationFrame();
  // }
  renderCanvas() {
    if (this.hasSetSize) {
      this.drawWave();
    } else {
      this.updateWave();
    }
  }
  // drawWave123(renderTimes: number) {  //audioContext demo
  //   const $this = this;
  //   // debugger;
  //   let timeId: any = '';
  //   const AnimationFrame = () => {
  //     if ($this.clear === true) {
  //       // This returns the function, effectively stopping the loop
  //       clearTimeout(timeId);
  //       return;
  //     }
  //     for (let i = 0; i < $this.routes; i++) {
  //       let audioContext = $this.contextMap.get(i);
  //       // let updateArray = $this.analyserArrayMap.get(i);
  //       // audioContext.analyserNode.getFloatTimeDomainData(updateArray);
  //       // console.log(updateArray);
  //       // let arr2 = new Uint8Array(64);
  //       // audioContext.analyserNode.getByteTimeDomainData(arr2);
  //       // console.log(updateArray);

  //       // debugger;
  //       let canvas = $this.canvasMap.get(i);
  //       let ctx = canvas.getContext('2d');
  //       if (ctx.lineWidth != 1 || ctx.strokeStyle != '#77ff00') {
  //         ctx.lineWidth = 1;
  //         ctx.strokeStyle = '#77ff00';
  //       }
  //       ctx.clearRect(0, 0, canvas.width, canvas.height);
  //       ctx.beginPath();
  //       const sliceWidth = canvas.width / $this.arrayLength;
  //       let x = 0;
  //       let gap = 4;
  //       let scale = canvas.height / 2 * 0.8;
  //       let array = $this.bufferMap.get(i).buffer;
  //       let { size, head } = $this.bufferMap.get(i);
  //       for (let j = 0; j < $this.arrayLength; j++) {
  //         // let v = $this.audioArray[i][j];
  //         // let v = Math.sqrt(Math.abs(array[(head + j) % size]));
  //         let v = array[(head + j) % size];
  //         // let v = (array[(head + j) % size] - 128) / 128;

  //           // debugger;
  //           let y_upper = v * scale + canvas.height / 2;
  //           let y_lower = -v * scale + canvas.height / 2;

  //           if (v === 0) {
  //             y_upper = canvas.height / 2 - gap / 2;
  //             y_lower = canvas.height / 2 + gap / 2;
  //           }

  //           if (j === 0) {
  //             ctx.moveTo(x, y_upper); // 上半部分
  //             ctx.moveTo(x, y_lower); // 下半部分
  //           } else {
  //             ctx.lineTo(x, y_upper); // 上半部分
  //             ctx.lineTo(x, y_lower); // 下半部分
  //           }
  //           x += sliceWidth;
  //         }


  //         ctx.lineTo(canvas.width, canvas.height / 2);
  //         ctx.stroke();
  //       }
  //       const generateHexData = () => {
  //         let data = [];
  //         for (let i = 0; i < this.updateArrayLength; i++) {
  //           data.push(Math.floor(Math.random() * 65536).toString(16));
  //         }
  //         return data;
  //       };
  //       let array = generateHexData();
  //       for (let i = 0; i < array.length; i++) {
  //         array[i] = (parseInt(array[i], 16) / 32768) - 1;
  //         // array[i] = (parseInt(array[i], 16) / 256);
  //       }
  //       for (let i = 0; i < this.routes; i++) {
  //         let buffer = this.bufferMap.get(i);
  //         buffer.enqueueBulk(array);
  //         this.bufferMap.set(i, buffer);
  //         let context = this.contextMap.get(i);
  //         context.bufferList.push(array);
  //         this.contextMap.set(i, context);
  //       }
  //       // debugger;

  //       timeId = setTimeout(AnimationFrame.bind(this), renderTimes);
  //     };


  //   AnimationFrame();
  // }

  drawWave() {
    const { canvas, ctx } = this;
    if (ctx.lineWidth != 1 || ctx.strokeStyle != '#77ff00' || ctx.fillStyle != '#000000') {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#77ff00';
      ctx.fillStyle = '#000000';
    }

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // debugger;
    for (let i = 0; i < this.routes; i++) {
      ctx.beginPath();
      let Y = i * canvas.height / this.routes;
      const sliceWidth = canvas.width / this.arrayLength;
      let x = 0;
      let gap = 1;
      let scale = canvas.height / 2 / this.routes;
      let array = this.bufferMap.get(i).buffer;
      let { size, head } = this.bufferMap.get(i);
      for (let j = 0; j < this.arrayLength; j++) {
        // let v = $this.audioArray[i][j];
        // let v = Math.sqrt(Math.abs(array[(head + j) % size]));
        let v = array[(head + j) % size];
        // let v = (array[(head + j) % size] - 128) / 128;

        // debugger;
        let y_upper = Y + v * scale + canvas.height / 2 / this.routes;
        let y_lower = Y + -v * scale + canvas.height / 2 / this.routes;

        if (v === 0) {
          y_upper = Y + canvas.height / 2 / this.routes - gap / 2;
          y_lower = Y + canvas.height / 2 / this.routes + gap / 2;
        }

        ctx.lineTo(x, y_upper); // 上半部分
        ctx.lineTo(x, y_lower); // 下半部分

        x += sliceWidth;
        }

      ctx.lineTo(canvas.width, Y + canvas.height / 2 / this.routes);
      ctx.stroke();
    }

    this.hasSetSize = false;
    // debugger;
  }

  updateWave() {
    const { canvas, ctx } = this;
    if (ctx.lineWidth != 1 || ctx.strokeStyle != '#77ff00' || ctx.fillStyle != '#000000') {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#77ff00';
    }
    ctx.drawImage(canvas, canvas.width / this.arrayLength * this.updateArrayLength, 0,
          canvas.width / this.arrayLength * (this.arrayLength - this.updateArrayLength), canvas.height,
          0, 0, canvas.width / this.arrayLength * (this.arrayLength - this.updateArrayLength), canvas.height);
    ctx.clearRect(canvas.width / this.arrayLength * (this.arrayLength - this.updateArrayLength), 0,
          canvas.width / this.arrayLength * this.updateArrayLength, canvas.height);

    ctx.fillRect(canvas.width / this.arrayLength * (this.arrayLength - this.updateArrayLength), 0,
          canvas.width / this.arrayLength * this.updateArrayLength, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < this.routes; i++) {
      let Y = i * canvas.height / this.routes;
      // let Y = 0;
      const sliceWidth = canvas.width / this.arrayLength;
      let x = (this.arrayLength - this.updateArrayLength) * sliceWidth;
      let gap = 1;
      let scale = canvas.height / 2 / this.routes;
      let array = this.bufferMap.get(i).buffer;
      let { size, head } = this.bufferMap.get(i);
      for (let j = this.arrayLength - this.updateArrayLength; j < this.arrayLength; j++) {
        // let v = $this.audioArray[i][j];
        // let v = Math.sqrt(Math.abs(array[(head + j) % size]));
        let v = array[(head + j) % size];
        // let v = (array[(head + j) % size] - 128) / 128;

        // debugger;
        let y_upper = Y + v * scale + canvas.height / 2 / this.routes;
        let y_lower = Y + -v * scale + canvas.height / 2 / this.routes;

        if (v === 0) {
          y_upper = Y + canvas.height / 2 / this.routes - gap / 2;
          y_lower = Y + canvas.height / 2 / this.routes + gap / 2;
        }

        if (j === this.arrayLength - this.updateArrayLength) {
            ctx.moveTo(x, y_upper); // 上半部分
            ctx.moveTo(x, y_lower); // 下半部分
          } else {
            ctx.lineTo(x, y_upper); // 上半部分
            ctx.lineTo(x, y_lower); // 下半部分
          }
          x += sliceWidth;
        }

      ctx.lineTo(canvas.width, Y + canvas.height / 2 / this.routes);
      // debugger;
    }
    ctx.stroke();
  }
  mock() {
    const generateHexData = () => {
      let data = [];
      for (let i = 0; i < this.updateArrayLength; i++) {
        data.push(Math.floor(Math.random() * 65536).toString(16));
      }
      return data;
    };
    let array = generateHexData();
    for (let i = 0; i < array.length; i++) {
      array[i] = (parseInt(array[i], 16) / 32768) - 1;
      // array[i] = (parseInt(array[i], 16) / 256);
    }
    for (let i = 0; i < this.routes; i++) {
      let buffer = this.bufferMap.get(i);
      buffer.enqueueBulk(array);
      this.bufferMap.set(i, buffer);
    }
  }
  // updateArrayData(updateArrayTimes: number) {
  //   if (this.clear === true) {
  //     clearTimeout(this.updateDataTimeId);
  //     return false;
  //   }
  //   const generateHexData = () => {
  //     let data = [];
  //     for (let i = 0; i < this.updateArrayLength; i++) {
  //         data.push(Math.floor(Math.random() * 65536).toString(16));
  //     }
  //     return data;
  //   };
  //   let array = generateHexData();
  //   for (let i = 0; i < array.length; i++) {
  //     array[i] = (parseInt(array[i], 16) / 32678) - 1;
  //   }
  //   this.audioArray = _.concat(this.audioArray, array);
  //   this.audioArray = _.drop(this.audioArray, this.updateArrayLength);

  //   this.updateDataTimeId = setTimeout(this.updateArrayData.bind(this), updateArrayTimes);
  // }

  updateArrayData(updateArray?: []) {
    // debugger;
    if (!this.isMocking && updateArray) {
      for (let i = 0; i < this.routes; i++) {
        let array = [];
        let buffer = this.bufferMap.get(i);
        for (let j = 0; j < updateArray[i].length; j++) {
          array[j] = (updateArray[i][j] / 32678);
        }
        buffer.enqueueBulk(array);
        // this.audioArray[i] = _.concat(this.audioArray[i], array);
        // this.audioArray[i] = _.drop(this.audioArray[i], this.updateArrayLength);
      }
    } else if (this.isMocking) {
      this.mock();
      setTimeout(this.updateArrayData.bind(this), this.updateArrayTimes);
    }
    this.start();
  }
}
// }


export default AudioWave;