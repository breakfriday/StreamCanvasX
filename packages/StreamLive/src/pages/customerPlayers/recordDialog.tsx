
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, InputNumber, Modal, Col, Row } from 'antd';

interface IProps{
    open: boolean;
    config?: {
        videoBitrate?: number;
        videoCodec?: string;
    };
    handleOk: Function;
    handleClose: Function;
}
const RecodDialog = (props: IProps) => {
    const { open, handleOk, handleClose } = props;
    return (
      <>

        <Modal
          title="recordConfig"
          centered
          open={open}
          width={1000}
          onOk={() => {
            handleOk();
          }}
          onCancel={() => {
            handleClose();
          }}
        >
          <Form>
            <Row>
              <Col span={6}>
                <Form.Item label="videoBitrate" initialValue={9e6} name="videoBitrate" style={{ width: 120 }}>
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="videoCodec" initialValue={'avc1.4d4029'} name="videoCodec">
                  <Input />
                </Form.Item>
              </Col>
            </Row>


          </Form>

        </Modal>
      </>
    );
};

export default RecodDialog;