import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';
import { WHIPClient } from './whis.js';

const Whip = () => {
 const containerRef = useRef(null);
 const playerRef = useRef(null);
    return (
      <>


        <Form
          name="basic"
          autoComplete="off"
        >
          <Form.Item
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

          <Form.Item label="renderType" name="audioDrawType" initialValue={'1'}>
            <Radio.Group>
              <Radio value="2"> whep </Radio>
              <Radio value="1"> whip </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>


      </>


    );
};

export default Whip;