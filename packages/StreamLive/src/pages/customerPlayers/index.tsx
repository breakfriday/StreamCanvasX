
import React, { useRef, useEffect } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
// import CanvasPlayerByVideos from 'streamcanvasx/canvasPlayerByVideo';
import mpegts from 'mpegts.js';
import Hls from 'hls.js';
// import CanvasAudioProcess from 'streamcanvasx/canvasAudioProcess';
import { createAudioProcessingServiceInstance, createMainPlayerInstance } from 'streamcanvasx/src/serviceFactories/index';
// import { ICombinedDrawer } from 'streamcanvasx';
import mainPlayerService from 'streamcanvasx/es2017/serviceFactories/index';
import { any } from '@tensorflow/tfjs';

const boxs = [1, 2, 3, 4, 5, 6, 7];

let streamPlayers: any = [];

const HlsDemo = () => {
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);


  const video_flv_refs = useRef([]);

  const canvas_refs = useRef([]);


  const video_box = useRef<HTMLElement>();


  let streamPlayerRef = useRef<mainPlayerService | null>(null);


  // const audioContext = new (window.AudioContext || window.webkitAudioContext)();


  useEffect(() => {
    const streamPlayer = createMainPlayerInstance({ canvas_el: canvas_ref?.current!, root_el: video_box.current! });
     streamPlayerRef.current = streamPlayer;

     streamPlayers = boxs.map((item, inx) => {
        let vedio_el = video_flv_refs.current[inx];
        let canvas_el = canvas_refs.current[inx];
        const streamPlayer = createMainPlayerInstance({ root_el: vedio_el, canvas_el });
        return streamPlayer;
    });

    // loadMediaEvent();
  }, []);

  //   const url = 'https://localhost:8080/live/livestream.m3u8';

  // async function decodeAudio(arrayBuffer) {
  //   const decodedAudioData = await audioContext.decodeAudioData(arrayBuffer);
  //   return decodedAudioData;
  // }


      // http://117.71.59.159:40012/live/luoxuan.live.flv
  const flv_play_by_index = (params) => {
    let { url, inx } = params;
    let streamPlayer = streamPlayers[inx];
        streamPlayer?.createFlvPlayer({
          type: 'flv', // could also be mpegts, m2ts, flv
          isLive: true,
          url: url,
      });
    };

  return (
    <div>
      <input
        type="file"
        id="file-input"
        accept="audio/*,video/*"
        onChange={(event) => {
          const streamPlayer = streamPlayerRef.current!;

          const files_data = event.target?.files?.[0]; // 返回file对象， 继承自blob对象。
          files_data ? streamPlayer.set_blob_url(files_data) : '';
        }}
      />


      <Space direction="horizontal" />

      <Space direction="horizontal" >
        <div ref={video_box} style={{ width: '300px', height: '300px' }}>


          <div />


        </div>
        {boxs.map((item, inx) => {
            return (
              <div key={inx} >
                <div
                  ref={el => (video_flv_refs.current[inx] = el)}
                  style={{ width: '300px', height: '300px' }}
                />
                <Form
                  name="basic"
                  autoComplete="off"
                  onFinish={(values) => {
                    flv_play_by_index({ url: values.url, inx });
              }}
                >
                  <Form.Item
                    label="url"
                    name="url"
                  >
                    <Input />
                  </Form.Item>


                  <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                    >
                      flv_play
                    </Button>
                  </Form.Item>
                </Form>
                <div>
                  <canvas ref={el => (canvas_refs.current[inx] = el)} id="canvas" width="300" height="300" />
                </div>

              </div>
            );
        })}


      </Space>


      <div id="canvas-container">
        <canvas ref={canvas_ref} id="canvas" width="800" height="800" />
      </div>


    </div>
  );
};

export default HlsDemo;