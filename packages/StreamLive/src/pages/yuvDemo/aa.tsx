
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row } from 'antd';

import { createPlayerServicePromise } from 'streamcanvasx/src/index';
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
         window.yuv=true;
        let { url,frameHeight,frameWidth ,renderFps ,streamType } = props;
        const createPlayer=async () => {
          let player=await createPlayerServicePromise({
            url,
            contentEl: containerRef.current!,
            renderFps: 30,
            stremType: streamType,
            frameHeight,
            frameWidth,

        });
          streamPlayer.current = player;
          player.createFlvPlayer();
        };

        createPlayer();
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
         player.canvasVideoService.setCover(true);
      }}
      >cover-true</Button>

      <Button onClick={() => {
         let player=streamPlayer.current;
         player.canvasVideoService.setCover(false);
      }}
      >cover-false</Button>

      <Button onClick={() => {
       let player=streamPlayer.current;
       player.canvasVideoService.drawRotate(180);
      }}
      >drawRotate(180)</Button>

      <Button onClick={() => {

      }}
      >setError</Button>

      <Button onClick={() => {
        let player=streamPlayer.current;
        player.audioProcessingService.mute(true);
      }}
      >mute true</Button>

      <Button onClick={() => {
        let player=streamPlayer.current;
        player.audioProcessingService.mute(false);
      }}
      >mute false</Button>

      <Button onClick={() => {
          let player=streamPlayer.current;
          debugger;
          player.forceReload();
      }}
      >reload</Button>

      <Button onClick={() => {
            let player=streamPlayer.current;
            player.getQueue();
      }}
      >getQueue</Button>

    </div>);
  };


  export default VideoComponents;