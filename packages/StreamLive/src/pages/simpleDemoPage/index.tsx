import React, { useRef, useEffect } from 'react';
import player from 'StreamCanvasX/player';
import CanvasPlayer from 'StreamCanvasX/canvasPlayer';

import { createOriginServiceInstance } from 'StreamCanvasX/serviceFactories/index';


const SimplePage = () => {
  const vedio_ref = useRef(null);
  const canvas_ref = useRef(null);
  useEffect(() => {
    if (vedio_ref) {
      const el = vedio_ref?.current;
      if (el) {
        player(el);
      }

      let h = createOriginServiceInstance('geoio');
      h.doSomething();
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


      <div >this is the test</div>

    </div>
  );
};

export default SimplePage;
