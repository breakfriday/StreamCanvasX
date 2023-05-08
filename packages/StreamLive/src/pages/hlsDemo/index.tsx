
import React, { useRef, useEffect } from 'react';
import { Divider, Space, Button } from 'antd';
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
  const canvas_audio_ref = useRef(null);
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


        const audio_process = createAudioProcessingServiceInstance({ media_el: veido_flv_ref.current!, canvas_el: canvas_audio_ref.current! });
        audio_process.visulizerDraw3();
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
  const flv_play = () => {
    let streamPlayer = streamPlayerRef.current;
    streamPlayer?.createFlvPlayer({
       type: 'flv', // could also be mpegts, m2ts, flv
      isLive: true,
      url: 'http://localhost:8080/live/livestream.flv',
  });
    // if (veido_flv_ref?.current) {
    //   const video_el = veido_flv_ref.current;
    //   const mpegts_player = mpegts.createPlayer({
    //     type: 'flv', // could also be mpegts, m2ts, flv
    //     isLive: true,
    //     url: 'http://localhost:8080/live/livestream.flv',
    //   });

    //   mpegts_player.on(mpegts.Events.METADATA_ARRIVED, () => {
    //     // const h = new CanvasPlayerByVideos({ vedio_el: veido_flv_ref?.current, canvas_el: canvas_ref?.current });
    //     // loadMediaEvent();
    //   });

    //   mpegts_player.attachMediaElement(video_el);
    //   mpegts_player.load();
    //   mpegts_player.play();
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
            ref={vedio_hls_ref}
            width="300"
            height="300"
            controls
            preload="none"
          />
          <div>
            <Button
              onClick={() => {
                hls_play();
              }}
            >hls 拉流
            </Button>

          </div>


        </div>


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
            <Button
              onClick={() => {
                flv_play();
              }}
            >flv 拉流
            </Button>

          </div>


        </div>
      </Space>

      <div>
        <Button onClick={() => {
          hls_play();
          flv_play();
        }}
        >
          all_start
        </Button>
      </div>


      <div id="canvas-container">
        <canvas ref={canvas_ref} id="canvas" width="800" height="800" />
      </div>


      <div >
        <canvas style={{ background: 'black' }} ref={canvas_audio_ref} id="canvas" width="300" height="300" />
      </div>
    </div>
  );
};

export default HlsDemo;