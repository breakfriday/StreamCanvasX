
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';
import { PlayCircleFilled } from '@ant-design/icons';


const LiveVideo = (props) => {
    const containerRef = useRef();

    const playerRef = useRef();

    const runplayer = () => {
      let { url, key_v = '', enable_crypto = false, fileData } = props;
      // fetchflv.fetchStream(url);
      let showAudio = false,
      hasVideo = true,
      hasAudio = true;


      let config = { url,
        showAudio,
        hasVideo,
        hasAudio,
        contentEl: containerRef.current!,
        streamType: 'ACC',
        fileData,
        crypto: enable_crypto === '1' ? {
          key: key_v,
          enable: true,
          wasmModulePath: '',
          useWasm: true,
        } : null,
        };

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
        <audio id="aad" controls >
          <span > Download audio </span>
        </audio>
        <div ref={containerRef} style={{ width: '400px', height: '200px', border: '1px' }} />


      </>
    );
};


export default LiveVideo;