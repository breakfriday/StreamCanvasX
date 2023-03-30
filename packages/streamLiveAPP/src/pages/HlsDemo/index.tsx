import React, { useRef, useEffect } from 'react';
import { ResponsiveGrid, Divider } from '@alifd/next';
import player from 'StreamCanvasX/player';
import CanvasPlayer from 'StreamCanvasX/canvasPlayer';
import mpegts from 'mpegts.js';
import Hls from 'hls.js';


const { Cell } = ResponsiveGrid;

const HlsDemo = () => {
  const vedio_ref = useRef(null);
  const canvas_ref = useRef(null);

  //   const url = 'https://localhost:8080/live/livestream.m3u8';


  const play = () => {
    if (Hls.isSupported()) {
      const video = document.getElementById('video');
      const hls = new Hls();
      const url = '//localhost:8080/live/livestream.m3u8';
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    }
  };

  const player2 = () => {
    const video = document.getElementById('video');
    const mpegts_player = mpegts.createPlayer({
      type: 'mse', // could also be mpegts, m2ts, flv
      isLive: true,
      url: '//localhost:8080/live/livestream.flv',
    });
    mpegts_player.attachMediaElement(video);
    mpegts_player.load();
    mpegts_player.play();
  };
  return (
    <div gap={20}>
      <div id="original-player">
        <video

          width="300"
          height="300"
          id="video"
          controls="true"
          preload="none"

        />

        <div onClick={() => {
          alert(2);
          player2();
        }}
        >ss
        </div>
      </div>


      <div id="canvas-container">
        <canvas ref={canvas_ref} id="canvas" width="800" height="800" />
      </div>
    </div>
  );
};

export default HlsDemo;
