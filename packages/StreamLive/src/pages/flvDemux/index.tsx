import React, { useRef, useEffect } from 'react';
import { Divider, Space, Button } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';

 import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';


const FlvDemux = () => {
 const containerRef = useRef(null);
 const playerRef = useRef(null);
    return (
      <>

        <Button
          type="primary"
          onClick={() => {
            let url = 'http://192.168.3.110:8080/live/livestream.flv';
            // fetchflv.fetchStream(url);
            let showAudio = false,
            hasVideo = true,
            hasAudio = true;

            const player = createPlayerServiceInstance({ url,
              showAudio,
              hasVideo,
              hasAudio,
              contentEl: containerRef.current!,
              });

              player.createBetaPlayer();
      }}
        >
          fetch flv http
        </Button>


        <div ref={containerRef} style={{ width: '400px', height: '200px', border: '1px' }} />


      </>


    );
};

export default FlvDemux;