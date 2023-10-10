import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row, Modal, Select } from 'antd';
import { createRTCPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';


const RTCPlayer = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [form_ref] = Form.useForm();
    const [form_ref1] = Form.useForm();
    const containerRef = useRef();

    const [deviceList, setDeviceList] = useState({ videoInputs: [], audioInputs: [] });

   const playerRef = useRef<RTCPlayer>(null);

   const controlHandle = async () => {
    let player = playerRef.current;
    let data = await player.getDeviceLIst();
    let { videoInputs, audioInputs } = data;

    setDeviceList(data);
   };

    const showModal = () => {
        setIsModalOpen(true);
      };

      const handleOk = () => {
        setIsModalOpen(false);

        let player = createRTCPlayerServiceInstance({
            contentEl: containerRef.current!,
        });
        player.getMedia();

        playerRef.current = player;
      };

      const handleCancel = () => {
        setIsModalOpen(false);
      };


    return (<div ref={containerRef}>
      <Button onClick={() => {
        showModal();
      }}
      >RTCPlayer</Button>
      <Button onClick={() => {
      setIsModalOpen1(true);
      controlHandle();
      }}
      >control</Button>
      <Modal title="RTCPlayer" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
          name="basic"
          form={form_ref}
          autoComplete="off"
          onFieldsChange={(value) => {
           let data = form_ref.getFieldsValue();
        }}
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
            initialValue={'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IndoaXAgdGVzdCIsImlhdCI6MTUxNjIzOTAyMn0.jpM01xu_vnSXioxQ3I7Z45bRh5eWRBEY2WJPZ6FerR8'}
            label="token"
            name="token"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>


      <Modal
        title="control"
        open={isModalOpen1}
        onOk={() => {
        setIsModalOpen1(false);
      }}
        onCancel={() => {
            setIsModalOpen1(false);
        }}
      >
        <Button onClick={() => {
        let player = playerRef.current;
        player.stopStream();
        }}
        >stopStream</Button>
        <Form
          name="basic"
          form={form_ref1}
          autoComplete="off"
          onFieldsChange={(value) => {
           let data = form_ref1.getFieldsValue();
        }}
          onFinish={(value) => {
            let { audioInput, videoInput } = value;
            let player = playerRef.current;
            player.getMedia({ audioSource: audioInput, videoSource: videoInput });
          }}
        >
          <Form.Item
            initialValue={'default'}
            label="videoInput"
            name="videoInput"
          >
            <Select
              options={deviceList.videoInputs}
            />
          </Form.Item>
          <Form.Item
            initialValue={'default'}
            label="audioInput"
            name="audioInput"
          >
            <Select
              options={deviceList.audioInputs}
            />
          </Form.Item>


          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
            >
              set_media
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>);
};


export default RTCPlayer;