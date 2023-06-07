import React, { useRef, useEffect } from 'react';
import { Divider, Space, Button } from 'antd';
import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';

const fetchflv = new HttpFlvStreamLoader();
const FlvDemux = () => {
    return (
      <>
        <Button
          type="primary"
          onClick={() => {
            let url = 'http://localhost:8080/live/livestream.flv';
            fetchflv.fetchStream(url);
      }}
        >
          fetch flv http
        </Button>

        <Button onClick={() => {
            fetchflv.abortFetch();
        }}
        >abort</Button>
      </>


    );
};

export default FlvDemux;