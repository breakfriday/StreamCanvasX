import React, { useRef, useEffect } from 'react';
import { ResponsiveGrid } from '@alifd/next';
import Guide from './components/Guide';
import player from 'StreamCanvasX/player';

const { Cell } = ResponsiveGrid;

const Dashboard = () => {
  const vedio_ref = useRef(null);
  useEffect(() => {
    if (vedio_ref) {
      const el = vedio_ref?.current;
      player()
   
    }
  }, []);
  return (
    <ResponsiveGrid gap={20}>
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
        />
      </div>


      <div id="canvas-container">
        <canvas id="canvas" width="300" height="300" />
      </div>
    </ResponsiveGrid>
  );
};

export default Dashboard;
