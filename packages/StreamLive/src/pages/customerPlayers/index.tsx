
import React, { useRef, useEffect } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import CanvasPlayerByVideos from 'StreamCanvasX/canvasPlayerByVideo';
import mpegts from 'mpegts.js';
import Hls from 'hls.js';
import CanvasAudioProcess from 'StreamCanvasX/canvasAudioProcess';
import { createAudioProcessingServiceInstance, createMainPlayerInstance } from 'StreamCanvasX/serviceFactories/index';
import { ICombinedDrawer } from 'StreamCanvasX';
import mainPlayerService from 'StreamCanvasX/services/mainCanvasPlayer';
import { any } from '@tensorflow/tfjs';

const boxs = [1, 2, 3, 4, 5, 6, 7];

let streamPlayers: any = [];

const HlsDemo = () => {
  const vedio_hls_ref = useRef<HTMLVideoElement | null>(null);
  const veido_flv_ref = useRef<HTMLVideoElement | null>(null);
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);


  const video_flv_refs = useRef([]);
  const streamPlayerRefs = useRef([]);
  const canvas_refs = useRef([]);


  let streamPlayerRef = useRef<mainPlayerService | null>(null);
  const mediaSource = new MediaSource();

  // const audioContext = new (window.AudioContext || window.webkitAudioContext)();


  useEffect(() => {
    const streamPlayer = createMainPlayerInstance({ vedio_el: veido_flv_ref?.current!, canvas_el: canvas_ref?.current! });
    streamPlayerRef.current = streamPlayer;

     streamPlayers = boxs.map((item, inx) => {
        let vedio_el = video_flv_refs.current[inx];
        let canvas_el = canvas_refs.current[inx];
        const streamPlayer = createMainPlayerInstance({ vedio_el, canvas_el });
        return streamPlayer;
    });

    // loadMediaEvent();
  }, []);

  //   const url = 'https://localhost:8080/live/livestream.m3u8';

  // async function decodeAudio(arrayBuffer) {
  //   const decodedAudioData = await audioContext.decodeAudioData(arrayBuffer);
  //   return decodedAudioData;
  // }

  // 视屏加载完成事件
  const loadMediaEvent = () => {
    const video_el = veido_flv_ref?.current;
    if (video_el) {
      video_el.addEventListener('loadedmetadata', () => {
      let { videoHeight, videoWidth } = video_el;


      // 计算最大公约数 （数学上求最大公约数的方法是“辗转相除法”，就是用一个数除以另一个数（不需要知道大小），取余数，再用被除数除以余数再取余，再用新的被除数除以新的余数再取余，直到余数为0，最后的被除数就是最大公约数）
        function gcd(a, b) {
            return b === 0 ? a : gcd(b, a % b);
        }

        let greatestCommonDivisor = gcd(videoWidth, videoHeight);

        // 计算宽高比
        let aspectRatioWidth = videoWidth / greatestCommonDivisor;
        let aspectRatioHeight = videoHeight / greatestCommonDivisor;

        let ratio = `${aspectRatioWidth}:${aspectRatioHeight}`;
      });
    }
  };


  const hls_play = () => {
    if (Hls.isSupported()) {
      if (vedio_hls_ref?.current) {
        const vedio_el = vedio_hls_ref.current;
        const video = document.getElementById('video');
        const hls = new Hls();
        const url = '//localhost:8080/live/livestream.m3u8';
        hls.loadSource(url);
        hls.attachMedia(vedio_el);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          vedio_el.play();
        });
      }
    }
  };


  // http://117.71.59.159:40012/live/luoxuan.live.flv
  const flv_play = (params) => {
    let { url } = params;
    let streamPlayer = streamPlayerRef.current;
    streamPlayer?.createFlvPlayer({
      type: 'flv', // could also be mpegts, m2ts, flv
      isLive: true,
      url: url,
  });
    };


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
        <div id="original-player">
          <video
            ref={veido_flv_ref}
            width="300"
            height="300"
            id="video2"
            controls
            preload="none"
          />

          <div />


        </div>
        {boxs.map((item, inx) => {
            return (
              <div key={inx} >
                <video
                  ref={el => (video_flv_refs.current[inx] = el)}
                  width="300"
                  height="300"
                  id="video2"
                  controls
                  preload="none"
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


        <div
          onClick={() => {
            let h = video_flv_refs;

            debugger;
        }}

        >asdf</div>

      </Space>


      <div id="canvas-container">
        <canvas ref={canvas_ref} id="canvas" width="800" height="800" />
      </div>


    </div>
  );
};

export default HlsDemo;