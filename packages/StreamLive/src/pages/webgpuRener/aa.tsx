import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';

import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';


const Player = (props) => {
    const container_ref = useRef<HTMLDivElement >(null);
    useEffect(() => {
        const { type = 1 } = props;
        const player = createPlayerServiceInstance({ model: type });

        let el = player.canvasVideoService.getCanvas2dEl();
        let container = document.getElementById('aa');
        container?.appendChild(el);
        let video: HTMLVideoElement = document.getElementById('vidd')! as HTMLVideoElement;
        player.canvasVideoService.createVideoFramCallBack(video);

        container_ref.current!.append(el);
    }, []);


    return (<div style={{ width: '300px', height: '150px' }} ref={container_ref} />);
};

export default Player;