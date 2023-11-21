import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row, Modal, Tabs } from 'antd';
import RTCPlayer from './aa';
import styles from './index.module.less';
import UseRTCPlayer from './hooks/UseRTCPlayer';
 import useMqtt from './hooks/UseMqtt';
import { useSearchParams, useParams } from 'ice';
import { tr } from 'date-fns/locale';
import R from 'ramda';
let classNames = require('classnames');

interface ICallMessage {
  room_id: string | null; // 房间名称
  initator: string | null; // 发起者device_id
  user_id: Array<string | number> | null; // 被邀请者device_id
}


const WebRTCChatHub = () => {
  const [playerRef, createPlayer] = UseRTCPlayer();
  const [showGridRight, setShowGridRight] = useState(true);
  const { sendMessage, subscribe, isConnected, messageHistory } = useMqtt('mqtt://192.168.3.34:8883');
  let containerRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [call_form_ref] = Form.useForm();
  // alert(JSON.stringify(searchParams))
  const roomId = searchParams.get('roomId');
  const deviceId = searchParams.get('deviceId');

  const [call_open_state, set_call_open_state] = useState(false);

  const [oncall_open_state, set_oncall_open_state] = useState(false);

  const callRing = (parm: {
      room_id: string | null; // 房间名称
      initator: string | null; // 发起者device_id
      user_id: Array<string | number> | null; // 被邀请者device_id
  }) => {
    let message = JSON.stringify(parm);

    sendMessage('v1/callsystem/OnCall/device/', message, { qos: 2 });
  };


  const Confir_call = () => {

  };


  const acceptCall = (message: ICallMessage) => {
    let roomId = message.room_id;
    let user_ids = message.user_id;
  };
  useEffect(() => {
      subscribe('v1/callsystem/OnCall/device/', { qos: 2 }, (MSG) => {
        let target_ids = MSG.payload.user_id;
        let taget_room = MSG.payload.room_id;

        if (taget_room === roomId && target_ids?.includes(deviceId!)) {
          set_oncall_open_state(true);
        }
      });
  }, []);
    return (
      <div>
        {/* <div >

          <RTCPlayer />


        </div> */}
        {/*
        <div style={{ height: '100px' }} />

        <div className={styles['main_top']}>
          main
        </div>
        <div className={styles['bottom-bar']}>

          <button className={styles['icon-button']}>
            <i className="icon-camera">打开摄像头</i>
          </button>
          <button className={styles['icon-button']}>
            <i className="icon-share">共享-屏幕</i>
          </button>
          <button className={styles['icon-button']}>
            <i className="icon-invite">邀请</i>
          </button>
          <button className={styles['icon-button']}>
            <i className="icon-members">成员数</i>
          </button>
          <button className={styles['icon-button']}>
            <i className="icon-members">聊天</i>
          </button>

        </div> */}
        <Modal
          title="call_ring"
          open={call_open_state}
          onOk={() => {
            let values = call_form_ref.getFieldsValue();
            let { ids } = values;

            callRing({
              room_id: roomId, initator: deviceId, user_id: [ids],
            });
            set_call_open_state(false);
          }}
          onCancel={() => {
            set_call_open_state(false);
          }}
        >
          <Form form={call_form_ref}>
            <Form.Item
              label="target_Ids"
              name="ids"
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="CONFIRN ONCALL"
          open={oncall_open_state}
          footer={false}
          onOk={() => {
          set_oncall_open_state(false);
        }}
          onCancel={() => {
          set_oncall_open_state(false);
        }}
        >
          <div className={styles['confirm_call']}>
            <Button size="large" onClick={() => { set_oncall_open_state(false); }}>REJECT</Button>
            <Button size="large" onClick={() => { set_oncall_open_state(false); }}>ACCEPT</Button>
          </div>
        </Modal>


        <div
          className={styles['phone']}
          onClick={() => {
            alert(22);
            callRing({ room_id: roomId, initator: deviceId, user_id: ['16'] });
        }}
        >
          📞
        </div>

        <div className={showGridRight ? styles['grid-container-has-right'] : styles['grid-container']}>

          {/* 第一行 */}
          <div className={styles['grid-item']}>
            <div className={styles['grid-item-box']} >1</div>
          </div>
          <div className={styles['grid-item']}>
            <div className={styles['grid-item-box']} >1</div>
          </div>
          <div className={styles['grid-item']}>
            <div className={styles['grid-item-box']} >1</div>
          </div>
          <div className={styles['grid-item']}>
            <div className={styles['grid-item-box']} >1</div>
          </div>

          {/* 第二行 */}
          <div className={showGridRight ? styles['grid-large-has-right'] : styles['grid-large']} ref={containerRef}>large_caputre</div>

          {/* 第三行 */}
          <div className={styles['grid-bottom']}>
            <button
              className={styles['icon-button']}
              onClick={() => {
                createPlayer(containerRef);
                playerRef.current?.getMedia();
            }}
            >
              <i className="icon-camera">打开摄像头</i>
            </button>
          </div>
          <div className={styles['grid-bottom']}>
            <button
              className={styles['icon-button']}
              onClick={() => {
                createPlayer(containerRef);
                playerRef.current?.getdisplaymedia();
            }}
            >
              <i className="icon-camera">共享-屏幕</i>
            </button>
          </div>
          <div className={styles['grid-bottom']}>
            <button
              className={styles['icon-button']}
              onClick={() => {
                set_call_open_state(true);
               // callRing({ room_id: roomId, initator: deviceId, user_id: ['16'] });
            }}
            >
              <i className="icon-camera">邀请</i>
            </button>
          </div>
          <div className={styles['grid-bottom']}>
            <button className={styles['icon-button']}>
              <i className="icon-members">成员</i>
            </button>
          </div>
          <div className={styles['grid-bottom']}>
            <button
              className={styles['icon-button']}
              onClick={() => {
              setShowGridRight(false);
            }}
            >
              <i className="icon-members">聊天</i>
            </button>
          </div>

          {/* 最右边列 */}
          {showGridRight ? (
            <div className={styles['gird-right']}>
              <Tabs
                defaultActiveKey="1"
                items={[
                    {
                      label: 'message history',
                      key: '1',
                      children: (<div>
                        {
                  messageHistory.map((v) => {
                    return (<div className={styles['line1']}>  {JSON.stringify(v)}</div>);
                  })
                }
                      </div>),
                    },
                    {
                      label: 'filiter msg',
                      key: '2',
                      children: 'Tab 2',

                    },
                    {
                      label: 'connect store',
                      key: '3',
                      children: 'Tab 3',
                    },
                  ]}
              />

            </div>
          ) : null}


        </div>
      </div>
      );
};


export default WebRTCChatHub;


