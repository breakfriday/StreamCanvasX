
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row } from 'antd';
import fpmap from 'lodash/fp/map';
import './index.css'

import YuvPlayer from "streamcanvasx/src/services/yuvEngine/player/index";


const player_count=12

function createYuvPlayers(instanceCount, frameWidth, frameHeight) {
  const players = new Map();
  for (let i = 0; i < instanceCount; i++) {
      const contentEl = document.getElementById(`yuvCanvas${i}`);
      const player = new YuvPlayer({ frameWidth, frameHeight, contentEl });
      players.set(`player${i}`, player);
  }
  return players;
}


async function fetchAndParseYUV(url, frameWidth, frameHeight ,playerCount,fps) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const bytesPerFrame = frameWidth * frameHeight + 2 * (frameWidth / 2) * (frameHeight / 2);

 let players= createYuvPlayers(playerCount,frameWidth,frameHeight);

  let offset = 0;

  for (let player of players.values()) {
    if (player.yuvEngine) {
        player.yuvEngine.render();
    }
}


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

      for (let player of players.values()) {
        if (player.yuvEngine) {
            player.yuvEngine.update_yuv_texture({ yData,uData,vData,width: frameWidth,height: frameHeight });
        }
    }


      // 等待下一帧（这里需要根据实际帧率进行调整）
      await new Promise(resolve => setTimeout(resolve, 1000 /fps)); // 假设视频是 30 FPS
  }
}


const wsConnect=() => {
  // 假设你已知的视频宽度和高度
const width = 1920;
const height = 1080;

let players= createYuvPlayers(9,width,height);

for (let player of players.values()) {
  if (player.yuvEngine) {
      player.yuvEngine.render();
  }
}
//  player6.yuvEngine.render();
//  player7.yuvEngine.render();
//  player8.yuvEngine.render();


//  player9.yuvEngine.render();
//  player10.yuvEngine.render();
//  player11.yuvEngine.render();


// 创建WebSocket连接
const ws = new WebSocket('ws://127.0.0.1:4300/ws/21');

// 设置binaryType以确保接收到的数据为ArrayBuffer
ws.binaryType = 'arraybuffer';

ws.onopen = () => {
    console.log('WebSocket connection established');
};

ws.onmessage = (event) => {
    // 接收到的数据是一个ArrayBuffer
    const data = event.data as ArrayBuffer;

    // 根据YUV420p格式计算Y, U, V数据的大小
    const ySize = width * height;
    const uvSize = (width / 2) * (height / 2);

    // 创建TypedArray来引用Y, U, V数据
    const yData = new Uint8Array(data, 0, ySize);
    const uData = new Uint8Array(data, ySize, uvSize);
    const vData = new Uint8Array(data, ySize + uvSize, uvSize);

    // 此处处理分离出来的Y, U, V数据

    let yuvData={
      yData,uData,vData
    };
    console.info(yuvData);

    for (let player of players.values()) {
      if (player.yuvEngine) {
          player.yuvEngine.update_yuv_texture({ yData,uData,vData,width: width,height: height });
      }
  }


    // player6.yuvEngine.update_yuv_texture({ yData,uData,vData,width: 1920,height: 1080 });
    // player7.yuvEngine.update_yuv_texture({ yData,uData,vData,width: 1920,height: 1080 });
    // player8.yuvEngine.update_yuv_texture({ yData,uData,vData,width: 1920,height: 1080 });


    // player9.yuvEngine.update_yuv_texture({ yData,uData,vData,width: 1920,height: 1080 });
    // player10.yuvEngine.update_yuv_texture({ yData,uData,vData,width: 1920,height: 1080 });
    // player11.yuvEngine.update_yuv_texture({ yData,uData,vData,width: 1920,height: 1080 });


    // 例如，可以在这里调用一个渲染函数
    // renderFrame(yData, uData, vData, width, height);
};

ws.onerror = (error) => {
  debugger
    console.log('WebSocket error:', error);
};

ws.onclose = () => {
  debugger
    console.log('WebSocket connection closed');
};
};


const yuvDemo = () => {
  useEffect(() => {}, []);

  return (
    <div>

    <Form
        name="basic"

        autoComplete="off"
        onFieldsChange={(value) => {
         
        }}

        onFinish={(value) => {

          let playerCount=value.playerCount
          let fps=value.fps
          let frameHeight=value.frameHeight
          let frameWidth =value.frameWidth

          fetchAndParseYUV('/output.yuv',frameWidth,frameHeight,playerCount,fps);



          }}


    >
      <Form.Item
        initialValue={6}
        label="渲染路数"
        name="playerCount">
          <Input />
      </Form.Item>
      <Form.Item
        initialValue={30}
        label="手动帧率"
        name="fps">
          <Input />
      </Form.Item>

      <Form.Item
        initialValue={1270}
        label="frameWidth"
        name="frameWidth">
        <Input />
      </Form.Item>

      <Form.Item
        initialValue={720}
        label="frameHeight"
        name="frameHeight">
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
          >
            fetch_play
          </Button>
        </Form.Item>
    </Form>


      <div onClick={() => {
        fetchAndParseYUV('/output.yuv',1270,720);
      }}
      >fetch yuv</div>


      <div onClick={() => {
        wsConnect();
      }}
      >
        ws connect
      </div>


      <div className='yuv_container'>
        {(()=>{
         
         return  Array.from({ length: player_count }, (_, i) => (
            <div id={`yuvCanvas${i}`} style={{ width: "400px", height: "300px" }}>
              {i}
            </div>
          ))



        })()}

          {/* <div id="yuvCanvas0" style={{ width: "400px",height: "300px" }}>d</div>
          <div id="yuvCanvas1" style={{ width: "400px",height: "300px" }}>d</div>
          <div id="yuvCanvas2" style={{ width: "400px",height: "300px" }}>d</div>
          <div id="yuvCanvas3" style={{ width: "400px",height: "300px" }}>d</div>
          <div id="yuvCanvas4" style={{ width: "100px",height: "100px" }}>d</div>
          <div id="yuvCanvas5" style={{ width: "100px",height: "100px" }}>d</div>
          <div id="yuvCanvas6" style={{ width: "100px",height: "100px" }}>d</div>
          <div id="yuvCanvas7" style={{ width: "100px",height: "100px" }}>d</div>

          <div id="yuvCanvas8" style={{ width: "100px",height: "100px" }}>d</div>
          <div id="yuvCanvas9" style={{ width: "100px",height: "100px" }}>d</div>
          <div id="yuvCanvas10" style={{ width: "100px",height: "100px" }}>d</div>
          <div id="yuvCanvas11" style={{ width: "100px",height: "100px" }}>d</div>
          <div id="yuvCanvas12" style={{ width: "100px",height: "100px" }}>d</div> */}
      </div>


      <div />

    </div>
  );
};

export default yuvDemo;