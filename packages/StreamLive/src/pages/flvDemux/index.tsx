import React, { useRef, useEffect } from 'react';
import { Divider, Space, Button } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';

 import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';

 const containerRef = useRef(null);

const FlvDemux = () => {
    return (
      <>
        <Button
          type="primary"
          onClick={() => {
            let url = 'http://localhost:8080/live/livestream.flv';
            // fetchflv.fetchStream(url);
            let showAudio = false,
            hasVideo = true,
            hasAudio = true,
            contentEl: containerRef.current!;
            const player = createPlayerServiceInstance({ url, showAudio, hasVideo, hasAudio, contentEl });
            player.createBetaPlayer();
      }}
        >
          fetch flv http
        </Button>


        <Button onClick={() => {
          //  h.httpFlvStreamService.abortFetch();
        }}
        >abort</Button>
        <div ref={containerRef} />


      </>


    );
};

export default FlvDemux;