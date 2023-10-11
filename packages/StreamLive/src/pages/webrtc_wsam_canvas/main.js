// import loadWASM from './load_wasm.js';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { loadWASM, addScript2 } from '../../../../streamcanvasx/src/utils';


let model;
const Ai = false;
window.Module = {};

const main_player = async () => {
  let webdsp_cModule;
  let video;
  let gStream;
  let frameNum;
  let requestId;
  let gFilter;
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  webdsp_cModule = await loadWASM('webdsp_c.js', 'createWebdsp_c', webdsp_cModule);
  model = await cocoSsd.load();

  const outlineStuff = (predictions) => {
    const h = predictions;
    predictions.map((prediction) => {
      console.log(prediction.class);
      const [x, y, width, height] = prediction.bbox;
      context.strokeStyle = 'red';
      context.fillStyle = 'red';

      // 设置字体大小和字体类型
      context.font = '18px Arial';

      context.fillText(prediction.class, x, y);
      context.strokeRect(x, y, width, height);
      return prediction;
    });
  };

  function openWebcam() {
    navigator.mediaDevices.getUserMedia({
      video: true,
    }).then((stream) => {
      gStream = stream; // 保留MediaStream实例
      video = document.createElement('video');
      video.autoplay = true;
      video.srcObject = stream;
      video.addEventListener('loadeddata', () => {
        canvas.setAttribute('height', video.videoHeight);
        canvas.setAttribute('width', video.videoWidth);
        gFilter = webdsp_cModule.original;
        draw();
      });
    }).catch((err) => {
      media = 'video';
      console.log(err.name);
    });
  }
  function stopWebcam() {
    gStream.getTracks().forEach((track) => track.stop());
    window.clearInterval(timer);
    window.cancelAnimationFrame(requestId);
  }

  let lastCalledTime;
  let fps = 0;
  async function draw() {
    if (video.paused) return false;

    // 绘制video当前画面
    context.drawImage(video, 0, 0);
    // 获取当前canvas图像像素
    window.canvas_context = context;
    const pixels = context.getImageData(0, 0, video.videoWidth, video.videoHeight);

    const predictions = await model.detect(pixels);


    // 将pixels.data设置为滤镜之后像素值
    pixels.data.set(gFilter(pixels.data, canvas.width, canvas.height));

    // outlineStuff(predictions)
    // 将滤镜处理后pixels放回到canvas画布
    context.putImageData(pixels, 0, 0);
    if (window.AiTest === 1) {
      outlineStuff(predictions);
    }
    // 继续绘制
    requestId = requestAnimationFrame(draw);

    // 计算fps
    if (!lastCalledTime) {
      lastCalledTime = performance.now();
      fps = 0;
      return;
    }
    const delta = (performance.now() - lastCalledTime) / 1000;
    lastCalledTime = performance.now();
    fps = 1 / delta;
  }

  function setFilter(evt) {
    const filter = webdsp_cModule[evt.target.getAttribute('filter')];
    gFilter = filter || webdsp_cModule.grayScale;
    debugger;
  }

  const frameNumDom = document.getElementById('frameNum');
  function showFPS() {
    frameNumDom.innerHTML = parseInt(fps);
  }

  function bindLastArgs(func, ...boundArgs) {
    return function (...baseArgs) {
      return func(...baseArgs, ...boundArgs);
    };
  }
  // 加载wasm;
  // loadWASM().then((module) => {
  //   wam = module;
  //   // 增加原始滤镜模块
  //   wam.original = function (pixels) {
  //     return pixels;
  //   };
  // });
  webdsp_cModule['original'] = function (pixels) {
    return pixels;
  };

  webdsp_cModule['grayScale'] = function (pixelData) {
    // 获取像素数组长度
    const len = pixelData.length;
    // 开辟一块内存，返回地址
    const mem = webdsp_cModule._malloc(len);
    // 把像素数据放入这块内存mem
    webdsp_cModule.HEAPU8.set(pixelData, mem);
    // 处理像素，源数据
    webdsp_cModule._grayScale(mem, len);
    // 从heap中拿出mem～mem+len（起始指针到位移len的数据）
    const filtered = webdsp_cModule.HEAPU8.subarray(mem, mem + len);
    // 释放内存
    webdsp_cModule._free(mem);
    return filtered;
  };
  webdsp_cModule['brighten'] = function (pixelData, brightness = 25) {
    const len = pixelData.length;
    const mem = webdsp_cModule._malloc(len);
    webdsp_cModule.HEAPU8.set(pixelData, mem);
    webdsp_cModule._brighten(mem, len, brightness);
    const filtered = webdsp_cModule.HEAPU8.subarray(mem, mem + len);
    webdsp_cModule._free(mem);
    return filtered;
  };
  webdsp_cModule['invert'] = function (pixelData) {
    const len = pixelData.length;
    const mem = webdsp_cModule._malloc(len);
    webdsp_cModule.HEAPU8.set(pixelData, mem);
    webdsp_cModule._invert(mem, len);
    const filtered = webdsp_cModule.HEAPU8.subarray(mem, mem + len);
    webdsp_cModule._free(mem);
    return filtered;
  };
  webdsp_cModule['noise'] = function (pixelData) {
    const len = pixelData.length;
    const mem = webdsp_cModule._malloc(len * Float32Array.BYTES_PER_ELEMENT);
    webdsp_cModule.HEAPF32.set(pixelData, mem / Float32Array.BYTES_PER_ELEMENT);
    webdsp_cModule._noise(mem, len);
    const filtered = HEAPF32.subarray(mem / Float32Array.BYTES_PER_ELEMENT, mem / Float32Array.BYTES_PER_ELEMENT + len);
    webdsp_cModule._free(mem);
    return filtered;
  };
  // MultiFilter Family of Functions
  webdsp_cModule['multiFilter'] = function (pixelData, width, filterType, mag, multiplier, adj) {
    const len = pixelData.length;
    const mem = webdsp_cModule._malloc(len);
    webdsp_cModule.HEAPU8.set(pixelData, mem);
    webdsp_cModule._multiFilter(mem, len, width, filterType, mag, multiplier, adj);
    const filtered = webdsp_cModule.HEAPU8.subarray(mem, mem + len);
    webdsp_cModule._free(mem);
    return filtered;
  };
  webdsp_cModule['multiFilterFloat'] = function (pixelData, width, filterType, mag, multiplier, adj) {
    const len = pixelData.length;
    const mem = webdsp_cModule._malloc(len * Float32Array.BYTES_PER_ELEMENT);
    HEAPF32.set(pixelData, mem / Float32Array.BYTES_PER_ELEMENT);
    webdsp_cModule._multiFilterFloat(mem, len, width, filterType, mag, multiplier, adj);
    const filtered = HEAPF32.subarray(mem / Float32Array.BYTES_PER_ELEMENT, mem / Float32Array.BYTES_PER_ELEMENT + len);
    webdsp_cModule._free(mem);
    return filtered;
  };
  // bindLastArgs is defined and hoisted from below the module load
  const mag = 127;
  const mult = 2;
  const adj = 4;
  const filt = webdsp_cModule['multiFilter'];
  const filtFloat = webdsp_cModule['multiFilterFloat'];
  webdsp_cModule['sunset'] = bindLastArgs(filt, 4, mag, mult, adj);
  webdsp_cModule['analogTV'] = bindLastArgs(filt, 7, mag, mult, adj);
  webdsp_cModule['emboss'] = bindLastArgs(filt, 1, mag, mult, adj);
  webdsp_cModule['urple'] = bindLastArgs(filt, 2, mag, mult, adj);
  webdsp_cModule['forest'] = bindLastArgs(filtFloat, 5, mag, 3, 1);
  webdsp_cModule['romance'] = bindLastArgs(filtFloat, 8, mag, 3, 2);
  webdsp_cModule['hippo'] = bindLastArgs(filtFloat, 2, 80, 3, 2);
  webdsp_cModule['longhorn'] = bindLastArgs(filtFloat, 2, 27, 3, 2);
  webdsp_cModule['underground'] = bindLastArgs(filt, 8, mag, 1, 4);
  webdsp_cModule['rooster'] = bindLastArgs(filt, 8, 60, 1, 4);
  webdsp_cModule['moss'] = bindLastArgs(filtFloat, 1, mag, 1, 1);
  webdsp_cModule['mist'] = bindLastArgs(filt, 1, mag, 1, 1);
  webdsp_cModule['kaleidoscope'] = bindLastArgs(filt, 1, 124, 4, 3);
  webdsp_cModule['tingle'] = bindLastArgs(filtFloat, 1, 124, 4, 3);
  webdsp_cModule['bacteria'] = bindLastArgs(filt, 4, 0, 2, 4);
  webdsp_cModule['hulk'] = bindLastArgs(filt, 2, 10, 2, 4);
  webdsp_cModule['ghost'] = bindLastArgs(filt, 1, 5, 2, 4);
  webdsp_cModule['swebdsp_cModulep'] = bindLastArgs(filtFloat, 1, 40, 2, 3);
  webdsp_cModule['twisted'] = bindLastArgs(filt, 1, 40, 2, 3);
  webdsp_cModule['security'] = bindLastArgs(filt, 1, 120, 1, 0);
  webdsp_cModule['robbery'] = bindLastArgs(filtFloat, 1, 120, 1, 0);
  // end filters from multiFilter family

  webdsp_cModule['sobelFilter'] = function (pixelData, width, height, invert = false) {
    const len = pixelData.length;
    const mem = webdsp_cModule._malloc(len);
    webdsp_cModule.HEAPU8.set(pixelData, mem);
    webdsp_cModule._sobelFilter(mem, width, height, invert);
    const filtered = webdsp_cModule.HEAPU8.subarray(mem, mem + len);
    webdsp_cModule._free(mem);
    return filtered;
  };
  // convFilter family of filters
  webdsp_cModule['convFilter'] = function (pixelData, width, height, kernel, divisor, bias = 0, count = 1) {
    const arLen = pixelData.length;
    const memData = webdsp_cModule._malloc(arLen * Float32Array.BYTES_PER_ELEMENT);
    webdsp_cModule.HEAPF32.set(pixelData, memData / Float32Array.BYTES_PER_ELEMENT);
    const kerWidth = kernel[0].length;
    const kerHeight = kernel.length;
    const kerLen = kerWidth * kerHeight;
    const flatKernel = kernel.reduce((acc, cur) => acc.concat(cur));
    const memKernel = webdsp_cModule._malloc(kerLen * Float32Array.BYTES_PER_ELEMENT);
    webdsp_cModule.HEAPF32.set(flatKernel, memKernel / Float32Array.BYTES_PER_ELEMENT);
    webdsp_cModule._convFilter(memData, width, height, memKernel, 3, 3, divisor, bias, count);
    const filtered = webdsp_cModule.HEAPF32.subarray(memData / Float32Array.BYTES_PER_ELEMENT, memData / Float32Array.BYTES_PER_ELEMENT + arLen);
    webdsp_cModule._free(memData);
    webdsp_cModule._free(memKernel);
    return filtered;
  };
  // defining kernel and other parameters before each function definition
  let kernel = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
  let divisor = 9;
  const bias = 0;
  const count = 1;
  const conv = webdsp_cModule['convFilter'];
  webdsp_cModule['blur'] = bindLastArgs(conv, kernel, divisor, bias, 3);
  kernel = [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]], divisor = 1;
  webdsp_cModule['strongSharpen'] = bindLastArgs(conv, kernel, divisor);
  kernel = [[0, -1, 0], [-1, 5, -1], [0, -1, 0]], divisor = 2;
  webdsp_cModule['sharpen'] = bindLastArgs(conv, kernel, divisor);
  kernel = [[1, -1, -1], [-1, 8, -1], [-1, -1, 1]], divisor = 3;
  webdsp_cModule['clarity'] = bindLastArgs(conv, kernel, divisor);
  kernel = [[-1, -1, 1], [-1, 14, -1], [1, -1, -1]], divisor = 3;
  webdsp_cModule['goodMorning'] = bindLastArgs(conv, kernel, divisor);
  kernel = [[4, -1, -1], [-1, 4, -1], [0, -1, 4]], divisor = 3;
  webdsp_cModule['acid'] = bindLastArgs(conv, kernel, divisor);
  kernel = [[0, 0, -1], [-1, 12, -1], [0, -1, -1]], divisor = 2;
  webdsp_cModule['dewdrops'] = bindLastArgs(conv, kernel, divisor);
  kernel = [[-1, -1, 4], [-1, 9, -1], [0, -1, 0]], divisor = 2;
  webdsp_cModule['destruction'] = bindLastArgs(conv, kernel, divisor);

  // 加载摄像头图像
  document.getElementById('open').addEventListener('click', openWebcam);
  document.getElementById('close').addEventListener('click', stopWebcam);

  Array.from(document.getElementsByClassName('filter-button')).forEach((element) => {
    element.addEventListener('click', setFilter);
  });

  let timer = setInterval(showFPS, 1000);
};


export default main_player;
