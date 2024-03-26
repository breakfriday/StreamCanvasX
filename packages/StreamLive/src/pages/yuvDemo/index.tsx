
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row } from 'antd';
import fpmap from 'lodash/fp/map';
import './index.css';

// import YuvPlayer from "streamcanvasx/src/services/yuvEngine/player/index";

import { createStreamBridgePlayerInstance } from 'streamcanvasx/src/serviceFactories/index';
import { IBridgePlayerConfig } from 'streamcanvasx/src/types/services';

const player_count=12;


interface IFormData{
  url: string;
  type: number;
  stremType: IBridgePlayerConfig["stremType"];
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
          let { playerCount } = value;
          let { fps } = value;
          let { frameHeight } = value;
          let { frameWidth } = value;

          fetchAndParseYUV('/output.yuv',frameWidth,frameHeight,playerCount,fps);
          }}
      >
        <Form.Item
          initialValue={""}
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


      <div onClick={() => {
        fetchAndParseYUV('/output.yuv',1270,720);
      }}
      >fetch yuv</div>


      <div onClick={() => {
        wsConnect();
      }}
      >
        ws connect
      </div>


      <div className="yuv_container">
        {(() => {
         return Array.from({ length: player_count }, (_, i) => (
           <div id={`yuvCanvas${i}`} style={{ width: "400px", height: "300px" }}>
             {i}
           </div>
          ));
        })()}

        {
          data.map((item, inx) => {
            let { url, type, stremType } = item;


            return (
              <div style={{ width: "400px", height: "300px" }}>
                <VideoComponents
                  url={url}
                  key={inx}
                />
              </div>
         );
          })
        }


      </div>


      <div />

    </div>
  );
};

export default yuvDemo;