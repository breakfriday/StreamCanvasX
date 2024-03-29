import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';
import { WHIPClient } from './whis.js';
import { WHEPClient } from './whep.js';
import Player from './aa.tsx';
import styles from './index.module.less';
const Whip = () => {
 const containerRef = useRef(null);
 const playerRef = useRef(null);
 const [form_ref] = Form.useForm();
 const runWhip = async (value) => {
            // Get mic+cam
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

        let { url, token } = value;

        // Create peerconnection
        const pc = new RTCPeerConnection();

        // Send all tracks
        for (const track of stream.getTracks()) {
            // You could add simulcast too here
            pc.addTrack(track);
        }

        // Create whip client
        const whip = new WHIPClient();

        // const url = 'https://whip.test/whip/endpoint';
        // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IndoaXAgdGVzdCIsImlhdCI6MTUxNjIzOTAyMn0.jpM01xu_vnSXioxQ3I7Z45bRh5eWRBEY2WJPZ6FerR8';

        // Start publishing
        whip.publish(pc, url, token);
 };

 const runWhep = async (value) => {
            // Create peerconnection
         let { url, token } = value;
        const pc = window.pc = new RTCPeerConnection();

        // Add recv only transceivers
        pc.addTransceiver('audio');
        pc.addTransceiver('video');

        pc.ontrack = (event) => {
            console.log(event);
            if (event.track.kind == 'video') document.querySelector('video').srcObject = event.streams[0];
        };

        // Create whep client
        const whep = new WHEPClient();

        // const url = 'https://whep.test/whep/endpoint';
        // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaWxsaWNhc3QiOnsidHlwZSI6IlN1YnNjcmliZSIsInNlcnZlcklkIjoidmlld2VyMSIsInN0cmVhbUFjY291bnRJZCI6InRlc3QiLCJzdHJlYW1OYW1lIjoidGVzdCJ9LCJpYXQiOjE2NzY2NDkxOTd9.ZE8Ftz9qiS04zTKBqP1MHZTOh8dvI73FBraleQM9h1A';

        // Start viewing
        whep.view(pc, url, token);
 };
    return (
      <>


        <Form
          name="basic"
          autoComplete="off"
          form={form_ref}
          onFinish={(value) => {

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
              onClick={() => {
               let data = form_ref.getFieldsValue();

                runWhip(data);
              }}
            >
              push  whip
            </Button>
            <Button
              type="primary"
              onClick={() => {
                let data = form_ref.getFieldsValue();
                runWhep(data);
              }}
            >
              fetch  whep
            </Button>
          </Form.Item>
        </Form>


        <video width={400} controls />


        <div className={styles['grid_container']}>
          <Player />
          <Player />
          <Player />
          <Player />
          <Player />
          <Player />
        </div>


      </>


    );
};

export default Whip;