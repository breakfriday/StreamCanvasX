import * as React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import Guide from './components/Guide';

const { Cell } = ResponsiveGrid;

const Dashboard = () => {
  return (
    <ResponsiveGrid gap={20}>
      <div id="original-player">
        <video
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
