import loadWASM from './load_wasm.js';


const main_player = () => {
  let wam;
  let video;
  let gStream;
  let frameNum;
  let requestId;
  let gFilter;
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

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
        gFilter = wam.original;
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
  function draw() {
    if (video.paused) return false;

    // 绘制video当前画面
    context.drawImage(video, 0, 0);
    // 获取当前canvas图像像素
    window.canvas_context = context;
    const pixels = context.getImageData(0, 0, video.videoWidth, video.videoHeight);
    // 将pixels.data设置为滤镜之后像素值
    pixels.data.set(gFilter(pixels.data, canvas.width, canvas.height));
    // 将滤镜处理后pixels放回到canvas画布
    context.putImageData(pixels, 0, 0);
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
    const filter = wam[evt.target.getAttribute('filter')];
    gFilter = filter || wam.grayScale;
  }

  const frameNumDom = document.getElementById('frameNum');
  function showFPS() {
    frameNumDom.innerHTML = parseInt(fps);
  }

  // 加载wasm
  loadWASM().then((module) => {
    debugger
    wam = module;
    debugger
    // 增加原始滤镜模块
    wam.original = function (pixels) {
      return pixels;
    };
  });
  // 加载摄像头图像
  document.getElementById('open').addEventListener('click', openWebcam);
  document.getElementById('close').addEventListener('click', stopWebcam);

  Array.from(document.getElementsByClassName('filter-button')).forEach((element) => {
    element.addEventListener('click', setFilter);
  });

  let timer = setInterval(showFPS, 1000);
};


export default main_player;
