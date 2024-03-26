
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row } from 'antd';
import fpmap from 'lodash/fp/map';
import './index.css';

// import YuvPlayer from "streamcanvasx/src/services/yuvEngine/player/index";

import { createStreamBridgePlayerInstance } from 'streamcanvasx/src/serviceFactories/index';
import { IBridgePlayerConfig } from 'streamcanvasx/src/types/services';
import VideoComponents from './aa';

const player_count=12;


interface IFormData{
  url?: string;
  type?: number;
  stremType?: IBridgePlayerConfig["stremType"];
  frameWidth?: number;
  frameHeight?: number;
  renderFps?: number;
}

const yuvDemo = () => {
  useEffect(() => {}, []);

  const [data, setData] = useState<Array<IFormData>>([]);

  return (
    <div>

      <Form
        name="basic"
        autoComplete="off"
        onFieldsChange={(value) => {

        }}
        onFinish={(value) => {
          let { url } = value;
          let { fps } = value;
          let { frameHeight } = value;
          let { frameWidth } = value;

          let itemData={ renderFps: fps,frameHeight,frameWidth ,url };

          let temp = Object.assign([], data);

          temp.push(itemData);


          setData(temp);
          }}
      >
        <Form.Item
          initialValue={"/output.yuv"}
          label="url"
          name="url"
        >
          <Input />
        </Form.Item>

        <Form.Item
          initialValue={30}
          label="手动帧率"
          name="fps"
        >
          <Input />
        </Form.Item>

        <Form.Item
          initialValue={1270}
          label="frameWidth"
          name="frameWidth"
        >
          <Input />
        </Form.Item>

        <Form.Item
          initialValue={720}
          label="frameHeight"
          name="frameHeight"
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


      <div className="yuv_container">


        {
          data.map((item, inx) => {
            let { url, type, stremType ,frameWidth } = item;

            return (
              <VideoComponents
                url={url}
                frameWidth={frameWidth}
                key={inx}
              />

         );
          })
        }


      </div>


      <div />

    </div>
  );
};

export default yuvDemo;