
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row } from 'antd';

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
    const streamPlayer = useRef<any>(null);

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


      streamPlayer.current = player;

      console.log("--start---");

        player.createFlvPlayer();
    },[]);
    return (<div>
      <div style={{ width: "800px", height: "400px", border: '1px' }} ref={containerRef} />
      <Button onClick={() => {
        let player=streamPlayer.current;
        player.destroy();
      }}
      >destroy</Button>

      <Button onClick={() => {
         let player=streamPlayer.current;
         player.setCover(true);
      }}
      >cover-true</Button>

      <Button onClick={() => {
         let player=streamPlayer.current;
         player.setCover(false);
      }}
      >cover-false</Button>

      <Button onClick={() => {

      }}
      >setError</Button>

      <Button onClick={() => {

      }}
      >mute</Button>

    </div>);
  };


  export default VideoComponents;