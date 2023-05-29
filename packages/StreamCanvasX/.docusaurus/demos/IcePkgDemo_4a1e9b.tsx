import * as React from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import mainPlayerService from 'StreamCanvasX/es2017/services/mainCanvasPlayer';
const {useRef}=React


const SimpleDemo = () => {
  const vedio_hls_ref = React.useRef<HTMLVideoElement | null>(null);
  const veido_flv_ref = React.useRef<HTMLVideoElement | null>(null);
  const canvas_ref = React.useRef<HTMLCanvasElement | null>(null);
  const video_flv_refs = useRef([]);
  const streamPlayerRefs = useRef([]);
  const canvas_refs = useRef([]);


  return (
    <>
    <div>
               <div key={inx} >
                <video
                  ref={el => (video_flv_refs.current[inx] = el)}
                  width="300"
                  height="300"
                  id="video2"
                  controls
                  preload="none"
                />
                <Form
                  name="basic"
                  autoComplete="off"
                  onFinish={(values) => {
                    flv_play_by_index({ url: values.url, inx });
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
                <div>
                  <canvas ref={el => (canvas_refs.current[inx] = el)} id="canvas" width="300" height="300" />
                </div>

              </div>
    </div>
    </>
  )
}

export default SimpleDemo;