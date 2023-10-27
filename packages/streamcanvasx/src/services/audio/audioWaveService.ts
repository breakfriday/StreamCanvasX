import _, { map } from 'lodash';
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import RingBuffer from './ringBuffer';
// import PlayerService from '../player';


// @injectable()
class AudioWaveService {
  routes: number;
  arrayLength: number;
  updateArrayLength: number;
  // audioArray: any;
  // buffer: RingBuffer[];
  width: number;
  height: number;
  clear: boolean;
  updateDataTimeId: any;
  canvasMap: Map<number, HTMLCanvasElement>;
  bufferMap: Map<number, RingBuffer>;

  init(config) {
    this.updateDataTimeId = '';
    let { routes, arrayLength = 2400, updateArrayLength = 160, width = 2400, height = 200 } = config;
    this.routes = routes;
    this.width = width;
    this.height = height;
    this.arrayLength = arrayLength;
    this.updateArrayLength = updateArrayLength;
    // this.audioArray = [];

    let i = arrayLength;
    let array = [];
    while (i > 0) {
      array.push(0);
      i--;
    }

    // for (let j = 0; j < this.routes; j++) {
    //   this.audioArray.push(array);
    // }

    // let buffer = new RingBuffer(1000);

    // debugger;
    this.bufferMap = new Map();
    for (let i = 0; i < this.routes; i++) {
      this.bufferMap.set(i, new RingBuffer(this.arrayLength));
      this.bufferMap.get(i).enqueueBulk(array);
    }
  }
  initCanvas(contentEl: HTMLElement) {
    // let canvasArray = [];
    this.canvasMap = new Map();
    for (let i = 0; i < this.routes; i++) {
      this.canvasMap.set(i, document.createElement('canvas'));
      // canvasArray.push([i, document.createElement('canvas')]);
    }
    // this.canvasMap = new Map(canvasArray);

    const element = contentEl;
    for (let i = 0; i < this.routes; i++) {
      let canvas_el = this.canvasMap.get(i);
      canvas_el.height = this.height;
      canvas_el.width = this.width;
      canvas_el.style.display = 'block';
      canvas_el.style.position = 'relative';
      element.append(canvas_el);
    }
  }
  destory() {
    this.clear = true;
    console.log('destory');
    // if (this.playerService.config.showAudio === true) {
    //   this.playerService.audioProcessingService.clearCanvas();
    // }
    // if (this.canvas_el && this.contentEl) {
    //   this.canvas_el.remove();
    //   this.contentEl = null;
    // }
  }
  // update(array: [], config?) {
  //   let { renderTimes = 25, updateArrayTimes = 25 } = config;
  //   this.drawWave(renderTimes); // ms
  //   this.updateArrayData(updateArrayTimes); // ms
  //   // this.updateArrayData(array, updateArrayTimes); // ms
  // }
  start() {
    let renderTimes = 20;

    // let updateArrayTimes = 20;
    this.drawWave(renderTimes); // ms
    // this.updateArrayData(updateArrayTimes); // ms
    // this.updateArrayData(array, updateArrayTimes); // ms
  }
  drawWave(renderTimes: number) {
    const $this = this;
    // debugger;
    let timeId: any = '';
    const AnimationFrame = () => {
      if ($this.clear === true) {
        // This returns the function, effectively stopping the loop
        clearTimeout(timeId);
        return;
      }
      for (let i = 0; i < $this.routes; i++) {
        let canvas = $this.canvasMap.get(i);
        let ctx = canvas.getContext('2d');
        if (ctx.lineWidth != 1 || ctx.strokeStyle != '#77ff00') {
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#77ff00';
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        const sliceWidth = canvas.width / $this.arrayLength;
        let x = 0;
        let gap = 4;
        let scale = canvas.height / 2 * 0.8;
        for (let i = 0; i < $this.routes; i++) {
          let array = $this.bufferMap.get(i).buffer;
          let { size, head } = $this.bufferMap.get(i);
          for (let j = 0; j < $this.arrayLength; j++) {
            // let v = $this.audioArray[i][j];
            // let v = Math.sqrt(Math.abs(array[(head + j) % size]));
            let v = array[(head + j) % size];

            // debugger;
            let y_upper = v * scale + canvas.height / 2;
            let y_lower = -v * scale + canvas.height / 2;

            if (v === 0) {
              y_upper = canvas.height / 2 - gap / 2;
              // y_lower = canvas.height / 2 + gap / 2;
            }

            if (j === 0) {
              ctx.moveTo(x, y_upper); // 上半部分
              // ctx.moveTo(x, y_lower); // 下半部分
            } else {
              ctx.lineTo(x, y_upper); // 上半部分
              // ctx.lineTo(x, y_lower); // 下半部分
            }
            x += sliceWidth;
          }
        }


      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      }
      timeId = setTimeout(AnimationFrame.bind(this), renderTimes);
    };

    AnimationFrame();
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

  updateArrayData(updateArray: []) {
    // debugger;
    let $this = this;
    for (let i = 0; i < this.routes; i++) {
      let array = [];
      let buffer = $this.bufferMap.get(i);
      for (let j = 0; j < updateArray[i].length; j++) {
        array[j] = (updateArray[i][j] / 32678);
      }
      // debugger;s
      buffer.enqueueBulk(array);
      // this.audioArray[i] = _.concat(this.audioArray[i], array);
      // this.audioArray[i] = _.drop(this.audioArray[i], this.updateArrayLength);
    }
  }
}
// }


export default AudioWaveService;