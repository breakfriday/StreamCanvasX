import React, { useRef, useEffect } from 'react';
import { Divider, Space, Button } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';

 import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';


 const h = createPlayerServiceInstance();

const FlvDemux = () => {
    return (
      <>
        <Button
          type="primary"
          onClick={() => {
            let url = 'http://localhost:8080/live/livestream.flv';
            // fetchflv.fetchStream(url);
           h.httpFlvStreamService.fetchStream(url);

           let el = h.canvasVideoService.getCanvas2dEl();

           let container = document.getElementById('aa');
           container?.appendChild(el);
      }}
        >
          fetch flv http
        </Button>

        <Button onClick={() => {
           h.httpFlvStreamService.abortFetch();
        }}
        >abort</Button>
        <div id="aa" />


      </>


    );
};

export default FlvDemux;