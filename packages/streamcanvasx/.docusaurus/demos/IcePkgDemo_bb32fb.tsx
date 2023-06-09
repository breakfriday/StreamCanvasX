import * as React from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import { createAudioProcessingServiceInstance, createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';
const {useRef,useEffect}=React


const SimpleDemo = () => {
  const veido_flv_ref = React.useRef<HTMLVideoElement | null>(null);
  const canvas_ref = React.useRef<HTMLCanvasElement | null>(null);
   let streamPlayerRef = useRef<mainPlayerService | null>(null);

  useEffect(() => {
    const streamPlayer = createMainPlayerInstance({ root_el: veido_flv_ref?.current!, canvas_el: canvas_ref?.current! });
    streamPlayerRef.current = streamPlayer;

  }, []);

    const flv_play = (params) => {
    let { url} = params;
    let streamPlayer =  streamPlayerRef.current
        streamPlayer?.createFlvPlayer({
          type: 'flv', // could also be mpegts, m2ts, flv
          isLive: true,
          url: url,
      });
    };

  return (
    <>
    <div>
  
          <div
            ref={veido_flv_ref}
            style={{ width: '300px', height: '300px' }}
          />
               <Form
                  name="basic"
                  autoComplete="off"
                  onFinish={(values) => {
                    flv_play({ url: values.url });
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
                      flv_play
                    </Button>
                  </Form.Item>
                </Form>

           <canvas ref={canvas_ref}  width="300" height="300" />
    </div>
    </>
  )
}

export default SimpleDemo;