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
               <div  >
                <video
                  width="300"
                  height="300"
                  controls
                  preload="none"
                />
                <Form
                  name="basic"
                  autoComplete="off"
                  onFinish={(values) => {
                   
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
                
                </div>

              </div>
    </div>
    </>
  )
}

export default SimpleDemo;