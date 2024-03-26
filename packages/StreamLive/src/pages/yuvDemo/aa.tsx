
import React, { useRef, useEffect, useState } from 'react';

import { createStreamBridgePlayerInstance } from 'streamcanvasx/src/serviceFactories/index';
import { BridgePlayerStreamType } from 'streamcanvasx/src/constant';
interface IVideoComponent {
    url: string;
    key: string | number;
    frameHeight?: number;
    frameWidth?: number;
    renderFps?: number;

  }
  const VideoComponents: React.FC<IVideoComponent> = (props) => {
    const containerRef = useRef(null);

    useEffect(() => {
        let { url } = props;

        let player=createStreamBridgePlayerInstance({
             url,
            contentEl: containerRef.current!,
            renderFps: 30,
            stremType: BridgePlayerStreamType.http_yuv,
            frameHeight: 720,
            frameWidth: 1270

        });

        console.log("--start---");

        player.play();
    },[]);
    return (<div>
      <div style={{ width: "400px", height: "300px", border: '1px' }} ref={containerRef} />

    </div>);
  };


  export default VideoComponents;