
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row } from 'antd';
import fpmap from 'lodash/fp/map';

import { Data } from 'ice';

import YuvPlayer from "streamcanvasx/src/services/yuvEngine/player/index";


async function fetchAndParseYUV(url, frameWidth, frameHeight) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const bytesPerFrame = frameWidth * frameHeight + 2 * (frameWidth / 2) * (frameHeight / 2);

  let contentEl=document.getElementById("yuvCanvas")!;

  let offset = 0;

   let player =new YuvPlayer({ frameWidth: 1270, frameHeight: 720,contentEl: contentEl });

   player.yuvEngine.render();

  while (offset < arrayBuffer.byteLength) {
      const ySize = frameWidth * frameHeight;
      const uvSize = (frameWidth / 2) * (frameHeight / 2);

      // 创建 Uint8Array 视图用于分别访问 Y, U, V 数据
      const yData = new Uint8Array(arrayBuffer, offset, ySize);
      offset += ySize;

      const uData = new Uint8Array(arrayBuffer, offset, uvSize);
      offset += uvSize;

      const vData = new Uint8Array(arrayBuffer, offset, uvSize);
      offset += uvSize;

      // 使用获取的 Y, U, V 数据渲染一帧

      let yuvData={
        yData,uData,vData
      };
      console.info(yuvData);


      player.yuvEngine.update_yuv_texture({ yData,uData,vData,width: 1270,height: 720 });


      // 等待下一帧（这里需要根据实际帧率进行调整）
      await new Promise(resolve => setTimeout(resolve, 1000 / 30)); // 假设视频是 30 FPS
  }
}


const HlsDemo = () => {
  useEffect(() => {}, []);

  return (
    <div>


      <div onClick={() => {
        fetchAndParseYUV('/output.yuv',1270,720);
      }}
      >fetch yuv</div>

      <div id="yuvCanvas" style={{ width: "1270px",height: "720px" }}>d</div>
      <div />

    </div>
  );
};

export default HlsDemo;