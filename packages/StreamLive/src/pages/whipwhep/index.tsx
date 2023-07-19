import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';
import { WHIPClient } from './whis.js';

const Whip = () => {
 const containerRef = useRef(null);
 const playerRef = useRef(null);

 const runWhip = async () => {
            // Get mic+cam
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

        // Create peerconnection
        const pc = new RTCPeerConnection();

        // Send all tracks
        for (const track of stream.getTracks()) {
            // You could add simulcast too here
            pc.addTrack(track);
        }

        // Create whip client
        const whip = new WHIPClient();

        const url = 'https://whip.test/whip/endpoint';
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IndoaXAgdGVzdCIsImlhdCI6MTUxNjIzOTAyMn0.jpM01xu_vnSXioxQ3I7Z45bRh5eWRBEY2WJPZ6FerR8';

        // Start publishing
        whip.publish(pc, url, token);
 };
    return (
      <>


        <Form
          name="basic"
          autoComplete="off"
          onFinish={(value) => {
            let { url, token, type } = value;
          }}
        >
          <Form.Item
            initialValue={'https://whip.test/whip/endpoint'}
            label="url"
            name="url"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="token"
            name="token"
            initialValue={'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IndoaXAgdGVzdCIsImlhdCI6MTUxNjIzOTAyMn0.jpM01xu_vnSXioxQ3I7Z45bRh5eWRBEY2WJPZ6FerR8'}
          >
            <Input />
          </Form.Item>

          <Form.Item label="renderType" name="type" initialValue={'1'}>
            <Radio.Group>
              <Radio value="2"> whep </Radio>
              <Radio value="1"> whip </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
            >
              submit
            </Button>
          </Form.Item>
        </Form>


      </>


    );
};

export default Whip;