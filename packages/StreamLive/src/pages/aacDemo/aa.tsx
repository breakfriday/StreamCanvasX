
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';
import { PlayCircleFilled } from '@ant-design/icons';


const LiveVideo = (props) => {
    const containerRef = useRef();

    const playerRef = useRef();

    const runplayer = () => {
      let { url, key_v = '', enable_crypto = false, fileData, showAudio = false } = props;
      // fetchflv.fetchStream(url);

     let hasVideo = false,
      hasAudio = true;


      let auduo1 = { fftsize: 128, updataBufferPerSecond: 15, renderPerSecond: 15, audioDrawType: '1', bufferSize: 0.2 };
      let config = { url,
        showAudio,
        hasVideo,
        hasAudio,
        contentEl: containerRef.current!,
        streamType: 'AAC',
        fileData,
        crypto: enable_crypto === '1' ? {
          key: key_v,
          enable: true,
          wasmModulePath: '',
          useWasm: true,
        } : null,
       };

       config = Object.assign(config, auduo1);

       debugger;


      const player = createPlayerServiceInstance(config);


      player.createBetaPlayer();
    };


    useEffect(() => {
      runplayer();
    }, []);

    return (
      <>
        <div>test</div>
        {/* <audio id="aad" controls >
          <span > Download audio </span>
        </audio> */}
        <div ref={containerRef} style={{ width: '400px', height: '200px', border: '1px' }} />


      </>
    );
};


export default LiveVideo;