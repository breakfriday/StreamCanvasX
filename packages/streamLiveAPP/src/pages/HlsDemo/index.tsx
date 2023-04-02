import React, { useRef, useEffect } from 'react';
import { ResponsiveGrid, Divider, Box, Button } from '@alifd/next';
import player from 'StreamCanvasX/player';
import CanvasPlayerByVideos from 'StreamCanvasX/canvasPlayerByVideo';
import mpegts from 'mpegts.js';
import Hls from 'hls.js';


const { Cell } = ResponsiveGrid;

const HlsDemo = () => {
  const vedio_hls_ref = useRef(null);
  const veido_flv_ref = useRef(null);
  const canvas_ref = useRef(null);

  useEffect(() => {
    const h = new CanvasPlayerByVideos({ vedio_el: veido_flv_ref?.current, canvas_el: canvas_ref?.current });
  }, []);

  //   const url = 'https://localhost:8080/live/livestream.m3u8';


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

  const flv_play = () => {
    if (veido_flv_ref?.current) {
      const video_el = veido_flv_ref.current;
      const mpegts_player = mpegts.createPlayer({
        type: 'flv', // could also be mpegts, m2ts, flv
        isLive: true,
        url: '//localhost:8080/live/livestream.flv',
      });
      mpegts_player.attachMediaElement(video_el);
      mpegts_player.load();
      mpegts_player.play();
    }
  };
  return (
    <div gap={20}>
      <input type="file" id="file-input" accept="video/mp4" onChange={()=>{
        const files_data = event.target?.files?.[0];
        if(files_data){
          let data_url = URL.createObjectURL(files_data);
          let videoPlayer=veido_flv_ref?.current
          videoPlayer.src =data_url;
          videoPlayer.load();
        }
      }} />


      <Box direction="row" spacing={20} />

      <Box direction="row" spacing={20}>
        <div id="original-player">
          <video
            ref={vedio_hls_ref}
            width="300"
            height="300"
            controls="true"
            preload="none"
          />
          <div>
            <Button
              type=""
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
            controls="true"
            preload="none"
          />

          <div>
            <Button
              type=""
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
    </div>
  );
};

export default HlsDemo;
