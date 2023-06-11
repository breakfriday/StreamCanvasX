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
      }}
        >
          fetch flv httpdd
        </Button>

        <Button onClick={() => {
            // fetchflv.abortFetch();
        }}
        >abort</Button>
      </>


    );
};

export default FlvDemux;