
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider } from 'antd';
import fpmap from 'lodash/fp/map';
import VideoComponents from './aa';
import { Data } from 'ice';
import './index.css';

const boxs = [1, 2, 3, 4, 5, 6, 7];

let streamPlayers: any = [];

const HlsDemo = () => {
  useEffect(() => {}, []);
  const [data, setData] = useState<Array<{url: string; type: number; useOffScreen: boolean; audioDrawType: number}>>([]);
  const [form_ref] = Form.useForm();
  const [formState, setFormState] = useState({ url: '', type: '1', useOffScreen: false, audioDrawType: '1' });
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
        onFinish={(value: {url: string; type: number; useOffScreen: boolean; audioDrawType: number}) => {
            let item = { url: value.url, type: value.type, useOffScreen: value.useOffScreen, audioDrawType: value.audioDrawType };
            let temp = Object.assign([], data);
            temp.push(item);
            setData(temp);
          }}
      >
        <Form.Item
          label="url"
          name="url"
        >
          <Input />
        </Form.Item>
        <Form.Item label="type" name="type" initialValue={'1'}>
          <Radio.Group>
            <Radio value="1"> 视频 </Radio>
            <Radio value="2"> 音频 </Radio>
          </Radio.Group>
        </Form.Item>

        {
         formState.type === '2' ? (<Form.Item label="useOffScreen Audio " valuePropName="useOffScreen" name="useOffScreen" initialValue={false}>
           <Switch />
         </Form.Item>) : ''
        }


        {
           formState.type === '2' && formState.useOffScreen != true ? (<Form.Item label="renderType" name="audioDrawType" initialValue={'1'}>
             <Radio.Group>
               <Radio value="2"> 波形渲染 </Radio>
               <Radio value="1"> 对称渲染 </Radio>
             </Radio.Group>
           </Form.Item>) : ''
        }

        {
            formState.type === '2' && formState.useOffScreen != true ? (
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
            formState.type === '2' && formState.useOffScreen != true ? (
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
            formState.type === '2' && formState.useOffScreen != true ? (<Form.Item label="fftsize" name="fftsize" initialValue={'1'}>
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
            let { url, type, useOffScreen, audioDrawType } = item;
            let showAudio = false;
            let hasAudio = false;
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
            />);
          })
        }
      </div>


      <div>
        //https://breakfriday.github.io/StreamCanvasX/

        // http://192.168.3.15/live/haikang.live.flv
      </div>

    </div>
  );
};

export default HlsDemo;