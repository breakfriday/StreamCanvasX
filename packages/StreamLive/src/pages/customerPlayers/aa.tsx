
import React, { useRef, useEffect } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';


const VideoComponents = (props) => {
  useEffect(() => {
    let { url } = props;

    let player = createPlayerServiceInstance({ url });

    player.createFlvPlayer({});

    let canvas_el = player.canvasVideoService.getCanvas2dEl();

    containerRef.current!.append(canvas_el);


    // loadMediaEvent();
  }, []);

  const containerRef = useRef(null);


  return (
    <div >
      <div ref={containerRef} />
    </div>);
};

export default VideoComponents;