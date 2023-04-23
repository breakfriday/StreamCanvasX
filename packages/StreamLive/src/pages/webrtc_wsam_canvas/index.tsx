import React, { useRef, useEffect } from 'react';
import { Button, Divider, Space, Tabs } from 'antd';

import main_player from './main';

const { TabPane } = Tabs;


const Wsm_Canvas = () => {
  useEffect(() => {
    setTimeout(() => {
      main_player();
    }, 200);
  }, []);

  const set_filiter = () => {

  };
  return (
    <div>
      <Space direction="horizontal" >
        <Button type="primary" id="open">打开摄像头</Button>
        <Button type="primary" id="close">关闭摄像头</Button>
      </Space>
      <Divider />
      <div>

        <Tabs>
          <TabPane tab="wsm c++ " key="1">
            <Divider />

            <Space direction="horizontal" >

              <Button className="filter-button" type="secondary" filter="original">原始</Button>
              <Button className="filter-button" type="secondary" filter="grayScale">灰度</Button>
              <Button className="filter-button" type="secondary" filter="brighten">高亮</Button>
              <Button className="filter-button" type="secondary" filter="invert">反色</Button>
              <Button className="filter-button" type="secondary" filter="noise">噪点</Button>
              <Button className="filter-button" type="secondary" filter="sobelFilter">边缘提取</Button>
            </Space>
          </TabPane>

          <TabPane tab="canvas Api " key="2">
            <Space direction="horizontal" style={{ marginTop: '20px' }}>
              <Button className="filter-button" type="secondary" filter="original">图像翻转</Button>
            </Space>
          </TabPane>

          <TabPane tab="内容交互 " key="3">
            <Space direction="horizontal" style={{ marginTop: '20px' }}>
              <Button
                type="secondary"
                onClick={() => {
                  window.AiTest = 1;
                }}
              >AI识别
              </Button>
            </Space>
          </TabPane>

        </Tabs>

      </div>
      <div style={{ marginTop: '10px' }}>
        <canvas id="canvas" />
        <p>fps: <span id="frameNum">0</span></p>
      </div>
    </div>

  );
};

export default Wsm_Canvas;
