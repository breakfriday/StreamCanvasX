
import React, { useRef, useEffect, useState } from 'react';

import { createStreamBridgePlayerInstance } from 'streamcanvasx/src/serviceFactories/index';

interface IVideoComponent {
    url: string;
    key: string | number;

  }
  const VideoComponents: React.FC<IVideoComponent> = (props) => {
    const containerRef = useRef(null);

    useEffect(() => {
        let { url } = props;
        let player=createStreamBridgePlayerInstance({ url });
    });
    return (<div>
      <div style={{ width: '800px', height: '500px', border: '1px' }} ref={containerRef} />

    </div>);
  };


  export default VideoComponents;