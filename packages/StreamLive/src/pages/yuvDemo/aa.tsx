
import React, { useRef, useEffect, useState } from 'react';

import { createStreamBridgePlayerInstance } from 'streamcanvasx/src/serviceFactories/index';
import { BridgePlayerStreamType } from 'streamcanvasx/src/constant';
interface IVideoComponent {
    url: string;
    key: string | number;
    frameHeight?: number;
    frameWidth?: number;
    renderFps?: number;
    streamType?: BridgePlayerStreamType;

  }
  const VideoComponents: React.FC<IVideoComponent> = (props) => {
    const containerRef = useRef(null);

    useEffect(() => {
        let { url,frameHeight,frameWidth ,renderFps ,streamType } = props;


        let player=createStreamBridgePlayerInstance({
             url,
            contentEl: containerRef.current!,
            renderFps: 30,
            stremType: streamType,
            frameHeight,
            frameWidth,

        });

        console.log("--start---");

        player.play();
    },[]);
    return (<div>
      <div style={{ width: "400px", height: "400px", border: '1px' }} ref={containerRef} />

    </div>);
  };


  export default VideoComponents;