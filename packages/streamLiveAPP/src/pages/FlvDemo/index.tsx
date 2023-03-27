import React, { useRef, useEffect } from 'react';
import { Button, Divider, Message, Box, Tab } from '@alifd/next';
import JessibucaPlayer from 'react-jessibuca';


const FlvDemo = () => {
  return (
    <div>
      this is the flv AiTest

      <div>this is  the test</div>
      <JessibucaPlayer width={400} height={300} src="http://192.168.100.66:41012/rtp/643F57E0.live.flv" decoder="http://localhost:3333/decoder.js" />

    </div>
  );
};

export default FlvDemo;
