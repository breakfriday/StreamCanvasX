
import React, { useRef, useEffect } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import CanvasPlayerByVideos from 'StreamCanvasX/canvasPlayerByVideo';
import mpegts from 'mpegts.js';
import Hls from 'hls.js';
import CanvasAudioProcess from 'StreamCanvasX/canvasAudioProcess';
import { createAudioProcessingServiceInstance, createMainPlayerInstance } from 'StreamCanvasX/serviceFactories/index';
import { ICombinedDrawer } from 'StreamCanvasX';
import mainPlayerService from 'StreamCanvasX/services/mainCanvasPlayer';


const HlsDemo = () => {
  const vedio_hls_ref = useRef<HTMLVideoElement | null>(null);
  const veido_flv_ref = useRef<HTMLVideoElement | null>(null);
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);

  const veido_flv_ref1 = useRef<HTMLVideoElement | null>(null);
  const canvas_ref1 = useRef<HTMLCanvasElement | null>(null);
  let streamPlayerRef1 = useRef<mainPlayerService | null>(null);

  const veido_flv_ref2 = useRef<HTMLVideoElement | null>(null);
  const canvas_ref2 = useRef<HTMLCanvasElement | null>(null);
  let streamPlayerRef2 = useRef<mainPlayerService | null>(null);

  const veido_flv_ref3 = useRef<HTMLVideoElement | null>(null);
  const canvas_ref3 = useRef<HTMLCanvasElement | null>(null);
  let streamPlayerRef3 = useRef<mainPlayerService | null>(null);

  const veido_flv_ref4 = useRef<HTMLVideoElement | null>(null);
  const canvas_ref4 = useRef<HTMLCanvasElement | null>(null);
  let streamPlayerRef4 = useRef<mainPlayerService | null>(null);


  const veido_flv_ref5 = useRef<HTMLVideoElement | null>(null);
  const canvas_ref5 = useRef<HTMLCanvasElement | null>(null);
  let streamPlayerRef5 = useRef<mainPlayerService | null>(null);


  const veido_flv_ref6 = useRef<HTMLVideoElement | null>(null);
  const canvas_ref6 = useRef<HTMLCanvasElement | null>(null);
  let streamPlayerRef6 = useRef<mainPlayerService | null>(null);

  let streamPlayerRef = useRef<mainPlayerService | null>(null);
  const mediaSource = new MediaSource();

  // const audioContext = new (window.AudioContext || window.webkitAudioContext)();


  useEffect(() => {
    const streamPlayer = createMainPlayerInstance({ vedio_el: veido_flv_ref?.current!, canvas_el: canvas_ref?.current! });
    streamPlayerRef.current = streamPlayer;


    loadMediaEvent();
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

          <div>

            <Form
              name="basic"
              autoComplete="off"
              onFinish={(values) => {
                flv_play({ url: values.url });
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


          </div>


        </div>
      </Space>


      <div id="canvas-container">
        <canvas ref={canvas_ref} id="canvas" width="800" height="800" />
      </div>


    </div>
  );
};

export default HlsDemo;