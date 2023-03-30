import React, { useRef, useEffect } from 'react';
import { ResponsiveGrid, Divider } from '@alifd/next';
import player from 'StreamCanvasX/player';
import CanvasPlayer from 'StreamCanvasX/canvasPlayer';
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
      const url = 'http://localhost:8080/live/livestream.m3u8';
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    }
  };
  return (
    <div gap={20}>
      <div id="original-player">
        <video

          width="900"
          height="900"
          id="video"
          controls="true"
          preload="none"

        />

        <div onClick={() => {
          alert(2);
          play();
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
