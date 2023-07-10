
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio } from 'antd';
import fpmap from 'lodash/fp/map';
import VideoComponents from './aa';
import { Data } from 'ice';

const boxs = [1, 2, 3, 4, 5, 6, 7];

let streamPlayers: any = [];

const HlsDemo = () => {
  useEffect(() => {}, []);
  const [data, setData] = useState<Array<{url: string; type: number}>>([]);
  return (
    <div>

      <Form
        name="basic"
        autoComplete="off"
        onFinish={(value: {url: string; type: number}) => {
            let item = { url: value.url, type: value.type };
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
        <Form.Item label="type" name="type">
          <Radio.Group>
            <Radio value="1"> 视频 </Radio>
            <Radio value="2"> 音频 </Radio>
          </Radio.Group>
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
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>

        {
          data.map((item, inx) => {
            let { url, type } = item;
            let showAudio = false;
            let hasAudio = false;
            let hasVideo = true;

            if (type == 2) {
                 showAudio = true;
                  hasAudio = true;
               hasVideo = false;
            } else {

            }

            return (<VideoComponents url={url} key={inx} hasVideo={hasVideo} hasAudio={hasAudio} showAudio={showAudio} />);
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