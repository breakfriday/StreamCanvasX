
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import fpmap from 'lodash/fp/map';
import VideoComponents from './aa';
import { Data } from 'ice';

const boxs = [1, 2, 3, 4, 5, 6, 7];

let streamPlayers: any = [];

const HlsDemo = () => {
  useEffect(() => {}, []);
  const [data, setData] = useState<Array<{url: string}>>([]);
  return (
    <div>

      <Form
        name="basic"
        autoComplete="off"
        onFinish={(value: {url: string}) => {
            let item = { url: value.url };
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


        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
          >
            fetch_play
          </Button>
        </Form.Item>
      </Form>
      <div style={{ display: 'flex', flexDirection: 'row' }}>

        {
          data.map((item, inx) => {
            let { url } = item;

            return (<VideoComponents url={url} key={inx} />);
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