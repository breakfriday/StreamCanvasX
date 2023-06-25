
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';
import { PlayCircleFilled } from '@ant-design/icons';


const VideoComponents = (props) => {
  const streamPlayer = useRef<any>(null);
  const [info, setInfo] = useState<any>();

  useEffect(() => {
    let { url } = props;

    let player = createPlayerServiceInstance({ url, contentEl: containerRef.current! });
    streamPlayer.current = player;

    player.createFlvPlayer({});

    player.on('otherInfo', (data) => {
      let { speed } = data;
      setInfo({ speed });
    });

    // let canvas_el = player.canvasVideoService.getCanvas2dEl();

    // containerRef.current!.append(canvas_el);


    // loadMediaEvent();
  }, []);


  const containerRef = useRef(null);


  return (
    <div >
      <div style={{ width: '200px', height: '200px' }} ref={containerRef} />
      <div>{JSON.stringify(info)}</div>
      <Button onClick={() => {
        let play = streamPlayer.current;
        play.reload();
      }}
      >retry</Button>
      <Button onClick={() => {
        let play = streamPlayer.current;
        play.destroy();
      }}
      >destroy</Button>
      <Button onClick={() => {
        let play = streamPlayer.current;
        play.mpegtsPlayer.play();
      }}
      >DD</Button>
    </div>);
};

export default VideoComponents;