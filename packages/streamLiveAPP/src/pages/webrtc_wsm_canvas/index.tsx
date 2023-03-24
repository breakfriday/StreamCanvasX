import React, { useRef, useEffect } from 'react';

import main_player from './main';


const Wsm_Canvas = () => {
  useEffect(() => {
    setTimeout(() => {
      main_player();
    }, 200);
  }, []);
  return (
    <div>
      <div>
        <button id="open">打开摄像头</button>
        <button id="close">关闭摄像头</button>
      </div>
      <div>
        滤镜：
        <button className="filter-button" filter="original">原始</button>
        <button className="filter-button" filter="grayScale">灰度</button>
        <button className="filter-button" filter="brighten">高亮</button>
        <button className="filter-button" filter="invert">反色</button>
        <button className="filter-button" filter="noise">噪点</button>
        <button className="filter-button" filter="sobelFilter">边缘提取</button>
      </div>
      <div>
        <canvas id="canvas" />
        <p>fps: <span id="frameNum">0</span></p>
      </div>
    </div>

  );
};

export default Wsm_Canvas;
