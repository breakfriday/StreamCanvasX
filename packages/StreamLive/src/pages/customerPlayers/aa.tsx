
import React, { useRef, useEffect } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';


const VideoComponents = (props) => {
  useEffect(() => {
    let { url } = props;

    let player = createPlayerServiceInstance({ url, contentEl: containerRef.current! });

    player.createFlvPlayer({});

    // let canvas_el = player.canvasVideoService.getCanvas2dEl();

    // containerRef.current!.append(canvas_el);


    // loadMediaEvent();
  }, []);

  const containerRef = useRef(null);


  return (
    <div >
      <div style={{ width: '200px', height: '200px' }} ref={containerRef} />
    </div>);
};

export default VideoComponents;