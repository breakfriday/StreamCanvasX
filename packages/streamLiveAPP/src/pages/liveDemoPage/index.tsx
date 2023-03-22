import React, { useRef, useEffect } from 'react';
import { ResponsiveGrid } from '@alifd/next';
import player from 'StreamCanvasX/player';
import CanvasPlayer from 'StreamCanvasX/canvasPlayer';

const { Cell } = ResponsiveGrid;

const Dashboard = () => {
  const vedio_ref = useRef(null);
  const canvas_ref = useRef(null);
  useEffect(() => {
    if (vedio_ref) {
      const el = vedio_ref?.current;
      if (el) {
        player(el);
      }

      const canvas_player = new CanvasPlayer({ canvas_el: canvas_ref?.current, vedio_el: vedio_ref?.current });
    }
  }, []);
  return (
    <div gap={20}>
      <div id="original-player">
        <video
          ref={vedio_ref}
          width="300"
          height="300"
          id="video"
          controls="true"
          preload="none"
          data-playback-id="29302SySXJgsLjQmbGiGiRQvEgiRplfvU"
          data-poster-time="10"
          loop
        />
      </div>


      <div id="canvas-container">
        <canvas ref={canvas_ref} id="canvas" width="800" height="800" />
      </div>
    </div>
  );
};

export default Dashboard;
