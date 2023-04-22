import React, { useRef, useEffect } from 'react';
import { ResponsiveGrid, Divider, Box, Button } from '@alifd/next';
import CanvasPlayerByVideos from 'StreamCanvasX/canvasPlayerByVideo';
import mpegts from 'mpegts.js';
import Hls from 'hls.js';
import CanvasAudioProcess from 'StreamCanvasX/canvasAudioProcess';
import { ICombinedDrawer } from 'StreamCanvasX';
// import fpget from 'lodash/fp/get';

// const { Cell } = ResponsiveGrid;

const HlsDemo = () => {
  const vedio_hls_ref = useRef<HTMLMediaElement | null>(null);
  const veido_flv_ref = useRef<HTMLMediaElement | null>(null);
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
  const canvas_audio_ref = useRef(null);
  const mediaSource = new MediaSource();

  // const audioContext = new (window.AudioContext || window.webkitAudioContext)();


  useEffect(() => {
    const h = new CanvasPlayerByVideos({ vedio_el: veido_flv_ref?.current, canvas_el: canvas_ref?.current });
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
        // Video metadata is loaded
        // console.log('loadMedia success');
        // get_audio_stream();

        const audio_process = new CanvasAudioProcess({ media_el: veido_flv_ref.current!, canvas_el: canvas_audio_ref.current! });
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
    if (veido_flv_ref?.current) {
      const video_el = veido_flv_ref.current;
      const mpegts_player = mpegts.createPlayer({
        type: 'flv', // could also be mpegts, m2ts, flv
        isLive: true,
        url: '//localhost:8080/live/livestream.flv',
      });

      mpegts_player.on(mpegts.Events.METADATA_ARRIVED, () => {
        // const h = new CanvasPlayerByVideos({ vedio_el: veido_flv_ref?.current, canvas_el: canvas_ref?.current });
        // loadMediaEvent();
      });

      mpegts_player.attachMediaElement(video_el);
      mpegts_player.load();
      mpegts_player.play();
    }
  };
  return (
    <div>
      <input
        type="file"
        id="file-input"
        accept="audio/*,video/*"
        onChange={(event) => {
          const files_data = event.target?.files?.[0];
          if (files_data) {
            const data_url = URL.createObjectURL(files_data);
            const videoPlayer = veido_flv_ref?.current;
            if (videoPlayer) {
              videoPlayer.src = data_url;
              videoPlayer.load();
            }
          }
        }}
      />


      <Box direction="row" spacing={20} />

      <Box direction="row" spacing={20}>
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
      </Box>

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
