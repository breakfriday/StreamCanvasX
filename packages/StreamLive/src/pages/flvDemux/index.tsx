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
            let url = 'http://localhost:8080/live/livestream.flv';
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
      }}
        >
          fetch flv http
        </Button>


        <div ref={containerRef} />


      </>


    );
};

export default FlvDemux;