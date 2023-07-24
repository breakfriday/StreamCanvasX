
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';
import { PlayCircleFilled } from '@ant-design/icons';


const LiveVideo = (props) => {
    const containerRef = useRef();

    const playerRef = useRef();

    useEffect(() => {
        let { url } = props;
        // fetchflv.fetchStream(url);
        let showAudio = false,
        hasVideo = true,
        hasAudio = true;


        const player = createPlayerServiceInstance({ url,
          showAudio,
          hasVideo,
          hasAudio,
          contentEl: containerRef.current!,
          });

          player.createBetaPlayer();
    }, []);

    return (
      <>
        <div>test</div>
        <div ref={containerRef} style={{ width: '400px', height: '200px', border: '1px' }} />
      </>
    );
};


export default LiveVideo;