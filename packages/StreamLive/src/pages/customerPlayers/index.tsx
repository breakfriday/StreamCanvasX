
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row } from 'antd';
import fpmap from 'lodash/fp/map';
import VideoComponents from './aa';
import { Data } from 'ice';
import './index.css';

const boxs = [1, 2, 3, 4, 5, 6, 7];

let streamPlayers: any = [];

interface IFormData{
  url: string;
  type: number;
  useOffScreen: boolean;
  audioDrawType: number;
  renderPerSecond?: number;
  updataBufferPerSecond?: number;
  fftsize?: number;
  bufferSize?: number;

}

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
      // 创建一个新的 script 元素
      const script = document.createElement('script');
      script.crossOrigin = 'anonymous';
      script.src = url;

      // 当脚本加载并执行成功时，解析 Promise
      script.onload = () => {
          resolve();
      };

      // 当加载脚本发生错误时，拒绝 Promise
      script.onerror = (error) => {
          reject(new Error(`Script load error: ${error}`));
      };

      // 把 script 元素添加到文档中，开始加载脚本
      document.head.append(script);
  });
}


// loadScript('/jessibuca.js');


// let url = `${location.origin}/ffmpeg.min.js`;
// loadScript(url).then(() => {
//   let { createFFmpeg } = window.FFmpeg;
//   let core_path = new URL('ffmpeg_core.js', document.location).href;
//   window.ffmpeg = createFFmpeg({ log: true, corePath: core_path });
// });

//  window.pp = () => {
//   window.ffmpeg.load(() => {
//     alert(22222222);
//   });
// };

const HlsDemo = () => {
  useEffect(() => {}, []);
  const [data, setData] = useState<Array<IFormData>>([]);
  const [form_ref] = Form.useForm();
  const [formState, setFormState] = useState({ url: '', type: '1', useOffScreen: false, audioDrawType: '1' });

  const formatter = (value: number) => `${value}ms* sampleRate (44100HZ)`;
  return (
    <div>

      <Form
        name="basic"
        form={form_ref}
        autoComplete="off"
        onFieldsChange={(value) => {
           let data = form_ref.getFieldsValue();
            setFormState(data);
        }}
        onFinish={(value: IFormData) => {
            let item = { ...value };
            let temp = Object.assign([], data);
            temp.push(item);


            setData(temp);
          }}
      >
        <Form.Item
          initialValue={'http://localhost:8080/live/livestream.flv'}
          label="url"
          name="url"
          initialValue={'ws://172.21.58.51/live/0.live.flv'}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="media"
          name="media"
          initialValue={['hasVideo', 'hasAudio']}
        >
          <Checkbox.Group>
            <Checkbox value="hasAudio" >hasAudio</Checkbox>
            <Checkbox value="hasVideo" >hasVideo</Checkbox>
          </Checkbox.Group>

        </Form.Item>

        <Form.Item label="type" name="type" initialValue={'1'}>
          <Radio.Group>
            <Radio value="1"> 视频 </Radio>
            <Radio value="2"> 音频 </Radio>
          </Radio.Group>
        </Form.Item>


        {
          (<Form.Item label="decodeType" valuePropName="decodeType" name="decodeType" >
            <Radio.Group>
              <Radio value=""> AUTO </Radio>
              <Radio value="1"> WEBCODECS </Radio>
              <Radio value="2">MSE</Radio>
              <Radio value="3">WASM FFMPEG</Radio>
            </Radio.Group>
          </Form.Item>)
          }


        <Row>
          <Col span={6}>

            {
             (<Form.Item label="decode enableWorker" valuePropName="enableWorker" name="enableWorker" >
               <Switch defaultChecked />
             </Form.Item>)
            }

          </Col>
          <Col span={6}>
            {
                formState.type === '1' ? (<Form.Item label="enableStashBuffer" valuePropName="enableStashBuffer" name="enableStashBuffer" >
                  <Switch />
                </Form.Item>) : ''
            }
          </Col>

          <Col span={6}>
            {
                  formState.type === '1' ? (<Form.Item label="autoCleanBuffer" valuePropName="autoCleanBuffer" name="enableStashBuffer" >
                    <Switch defaultChecked />
                  </Form.Item>) : ''
              }
          </Col>


        </Row>


        {
         formState.type === '2' ? (<Form.Item label="useOffScreen Audio " valuePropName="useOffScreen" name="useOffScreen" initialValue={false}>
           <Switch />
         </Form.Item>) : ''
        }


        {
           formState.type === '2' ? (<Form.Item label="renderType" name="audioDrawType" initialValue={'1'}>
             <Radio.Group>
               <Radio value="2"> 波形渲染 </Radio>
               <Radio value="1"> 对称渲染 </Radio>
             </Radio.Group>
           </Form.Item>) : ''
        }

        {
            formState.type === '2' ? (
              <Form.Item name="renderPerSecond" label="renderPerSecond" initialValue={15}>
                <Slider
                  marks={{
                15: '15',
                30: '30',
                60: '60',

          }}
                />
              </Form.Item>) : ''
        }

        {
            formState.type === '2' ? (
              <Form.Item name="updataBufferPerSecond" label="updataBufferPerSecond" initialValue={15}>
                <Slider
                  marks={{
                15: '15',
                30: '30',
                60: '60',

          }}
                />
              </Form.Item>) : ''
        }

        {
            formState.type === '2' ? (<Form.Item label="fftsize" name="fftsize" initialValue={128}>
              <Radio.Group>
                <Radio value={64}> 64 </Radio>
                <Radio value={128}> 128 </Radio>
                <Radio value={256}> 256 </Radio>
                <Radio value={512}> 512 </Radio>
                <Radio value={1024}> 1024 </Radio>
                <Radio value={2048}> 2048</Radio>
              </Radio.Group>
            </Form.Item>) : ''
        }

        {
            formState.type === '2' ? (
              <Form.Item label="bufferSize" name="bufferSize" initialValue={0.2}>
                <Slider
                  min={0}
                  max={10}
                  step={0.01}
                  tooltip={{ formatter }}
                />
              </Form.Item>) : ''
        }


        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
          >
            fetch_play
          </Button>
        </Form.Item>
      </Form>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>

        {
          data.map((item, inx) => {
            let { url, type, useOffScreen, audioDrawType, media } = item;
            let showAudio = false;

            let hasAudio = media.includes('hasAudio');
            let hasVideo = true;


            if (type == 2) {
                 showAudio = true;
                  hasAudio = true;
                   hasVideo = false;
            } else {

            }

            return (<VideoComponents
              url={url}
              key={inx}
              hasVideo={hasVideo}
              hasAudio={hasAudio}
              showAudio={showAudio}
              useOffScreen={useOffScreen}
              audioDrawType={audioDrawType}
              updataBufferPerSecond={item.updataBufferPerSecond}
              renderPerSecond={item.renderPerSecond}
              fftsize={item.fftsize}
              bufferSize={item.bufferSize}
              // degree={}
            />);
          })
        }
      </div>


      <div>
        //https://breakfriday.github.io/StreamCanvasX/

        // http://192.168.3.15/live/haikang.live.flv
      </div>


      <div />

    </div>
  );
};

export default HlsDemo;