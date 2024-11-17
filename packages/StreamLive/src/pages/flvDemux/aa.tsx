
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';
import { PlayCircleFilled } from '@ant-design/icons';
import { streamcanvasCore } from 'streamcanvasx/src';

const LiveVideo = (props) => {
    const videoRef = useRef<HTMLVideoElement>();

    const playerRef = useRef();

    const runplayer1 = () => {
      let { url } = props;
      // fetchflv.fetchStream(url);

      let mediaDdataSource={
        isLive: false,
        liveBufferLatencyChasing: true,
        type: "mse",
        url: "http://localhost:8081/output.flv",
        withCredentials: false
      }

      const player=streamcanvasCore.createPlayer(mediaDdataSource,{
        enableWorker:true,
        seekType:"range"
      })
      
      let videl_el=videoRef.current

      player.attachMediaElement(videl_el!)
      player.load()
      player.play();

    };



    useEffect(() => {
      runplayer1();
    }, []);

    return (
      <>
        <div>test</div>
        <video controls ref={videoRef} style={{ width: '400px', height: '200px', border: '1px' }} />
      </>
    );
};


export default LiveVideo;