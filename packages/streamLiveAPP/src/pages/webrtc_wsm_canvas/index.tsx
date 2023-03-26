import React, { useRef, useEffect } from 'react';
import { Button, Divider, Message, Box, Tab } from '@alifd/next';

import main_player from './main';


const Wsm_Canvas = () => {
  useEffect(() => {
    setTimeout(() => {
      main_player();
    }, 200);
  }, []);
  return (
    <div>
      <Box direction="row" spacing={20}>
        <Button type="primary" id="open">打开摄像头</Button>
        <Button type="primary" id="close">关闭摄像头</Button>
      </Box>
      <Divider />
      <div>

        <Tab>
          <Tab.Item title="wsm c++ " key="1">
            <Divider />

            <Box direction="row" spacing={20}>

              <Button className="filter-button" type="secondary" filter="original">原始</Button>
              <Button className="filter-button" type="secondary" filter="grayScale">灰度</Button>
              <Button className="filter-button" type="secondary" filter="brighten">高亮</Button>
              <Button className="filter-button" type="secondary" filter="invert">反色</Button>
              <Button className="filter-button" type="secondary" filter="noise">噪点</Button>
              <Button className="filter-button" type="secondary" filter="sobelFilter">边缘提取</Button>
            </Box>
          </Tab.Item>

          <Tab.Item title="canvas Api " key="2">
            <Box direction="row" spacing={20}  style={{ marginTop: '20px' }}>
              <Button className="filter-button" type="secondary" filter="original">图像翻转</Button>
            </Box>
          </Tab.Item>

        </Tab>

      </div>
      <div style={{ marginTop: '10px' }}>
        <canvas id="canvas" />
        <p>fps: <span id="frameNum">0</span></p>
      </div>
    </div>

  );
};

export default Wsm_Canvas;
