
import React, { useRef, useEffect } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';


const VideoComponents = () => {
  useEffect(() => {


    // loadMediaEvent();
  }, []);


  return (<div >
    <Form
      name="basic"
      autoComplete="off"
      onFinish={(value: string) => {
           let player = createPlayerServiceInstance();

           let pp = player.createFlvPlayer({ url: value.url });

           let canvas_el = player.canvasVideoService.getCanvas2dEl();

           let container = document.getElementById('cont')!;
           container.append(canvas_el);
          }}
    >
      <Form.Item
        label="url"
        name="url"
      >
        <Input />
      </Form.Item>


      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button
          type="primary"
          htmlType="submit"
        >
          fetch_play
        </Button>
      </Form.Item>
    </Form>
  </div>);
};

export default VideoComponents;