import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row, Modal, Select } from 'antd';
import { createRTCPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';


const RTCPlayer = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [form_ref] = Form.useForm();
    const containerRef = useRef();

    const showModal = () => {
        setIsModalOpen(true);
      };

      const handleOk = () => {
        setIsModalOpen(false);

        let player = createRTCPlayerServiceInstance({
            contentEl: containerRef.current!,
        });
        player.getMedia();
      };

      const handleCancel = () => {
        setIsModalOpen(false);
      };


    return (<div>
      <Button onClick={() => {
        showModal();
      }}
      >RTCPlayer</Button>
      <Button onClick={() => {
      setIsModalOpen1(true);
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
            initialValue={'default'}
            label="videoInput"
            name="videoInput"
          >
            <Select
              options={[]}
            />
          </Form.Item>
          <Form.Item
            initialValue={'default'}
            label="audioInput"
            name="audioInput"
          >
            <Select
              options={[]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>);
};


export default RTCPlayer;