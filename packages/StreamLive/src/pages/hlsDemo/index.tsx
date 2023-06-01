
import React, { useRef, useEffect } from 'react';
import { Divider, Space, Button } from 'antd';
// import CanvasPlayerByVideos from 'streamcanvasx/canvasPlayerByVideo';
import mpegts from 'mpegts.js';
import Hls from 'hls.js';
// import CanvasAudioProcess from 'streamcanvasx/canvasAudioProcess';
import { createAudioProcessingServiceInstance, createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';
// import { ICombinedDrawer } from 'streamcanvasx';
import mainPlayerService from 'streamcanvasx/es2017/services/mainCanvasPlayer';


const HlsDemo = () => {
  const vedio_hls_ref = useRef<HTMLVideoElement | null>(null);
  const veido_flv_ref = useRef<HTMLVideoElement | null>(null);
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
  const canvas_audio_ref = useRef(null);
  let streamPlayerRef = useRef<mainPlayerService | null>(null);
  const mediaSource = new MediaSource();

  // const audioContext = new (window.AudioContext || window.webkitAudioContext)();


  useEffect(() => {
    const streamPlayer = createMainPlayerInstance({
      root_el: veido_flv_ref?.current!,
      canvas_el: canvas_ref?.current!,
      config: {
            useCanvas: true,
            cutCanvas: true,
          },
  });
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
    const video_el = streamPlayerRef.current?._vedio;
    if (video_el) {
      video_el.addEventListener('play', () => {
        const audio_process = createAudioProcessingServiceInstance({ media_el: video_el, canvas_el: canvas_audio_ref.current! });


        // audio_process.updateBufferData();
        // audio_process.drawWithBufferData();
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
          <div
            ref={veido_flv_ref}
            style={{ width: '300px', height: '300px' }}
          />

          <div>
            <Button
              onClick={() => {
                flv_play();
              }}
            >flv 拉流
            </Button>

            <Button
              onClick={() => {
               streamPlayerRef.current?.reoload();
              }}
            >reload
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
        <canvas ref={canvas_ref} id="canvas" width="400" height="400" />
      </div>


      <div >
        <canvas style={{ background: 'black' }} ref={canvas_audio_ref} id="canvas" width="400" height="400" />
      </div>
    </div>
  );
};

export default HlsDemo;