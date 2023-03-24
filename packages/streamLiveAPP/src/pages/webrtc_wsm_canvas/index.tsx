import React, { useRef, useEffect } from 'react';
import { Button } from '@alifd/next';

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
        <Button id="open">打开摄像头</Button>
        <Button id="close">关闭摄像头</Button>
      </div>
      <div>
        <div>
          滤镜：调用wsm c++ 实现
        </div>

        <Button className="filter-button" filter="original">原始</Button>
        <Button className="filter-button" filter="grayScale">灰度</Button>
        <Button className="filter-button" filter="brighten">高亮</Button>
        <Button className="filter-button" filter="invert">反色</Button>
        <Button className="filter-button" filter="noise">噪点</Button>
        <Button className="filter-button" filter="sobelFilter">边缘提取</Button>
      </div>
      <div>
        <canvas id="canvas" />
        <p>fps: <span id="frameNum">0</span></p>
      </div>
    </div>

  );
};

export default Wsm_Canvas;
