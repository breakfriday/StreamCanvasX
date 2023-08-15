
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, InputNumber, Modal, Col, Row, Select } from 'antd';

interface IProps{
    open: boolean;
    options: {
        videoBitrates: Array<{value: number | string; label: string}>;
        fileTypes: Array<{value: number | string; label: string}>;
        videoCodecs: Array<{value: number | string; label: string}>;
    };
    config?: {
        videoBitrate?: number;
        videoCodec?: string;
    };
    handleOk: Function;
    handleClose: Function;
}
const RecodDialog = (props: IProps) => {
    const { open, handleOk, handleClose, options } = props;

    useEffect(() => {

   }, [open]);


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
              <Col span={8}>
                <Form.Item label="videoCodecs" initialValue={'avc1.4d4029'} name="videoCodecs" style={{ width: 200 }}>
                  <Select
                    style={{ width: 200 }}
                    options={options && options.videoCodecs ? options.videoCodecs : []}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="videoBitrates" initialValue={9e6} name="videoBitrates" style={{ width: 90 }}>
                  <Select
                    style={{ width: 90 }}
                    options={options && options.videoBitrates ? options.videoBitrates : []}
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="fileTypes" initialValue={'mp4'} name="fileTypes" style={{ width: 90 }}>
                  <Select
                    style={{ width: 90 }}
                    options={options && options.fileTypes ? options.fileTypes : []}
                  />
                </Form.Item>
              </Col>
            </Row>


          </Form>

        </Modal>
      </>
    );
};

export default RecodDialog;