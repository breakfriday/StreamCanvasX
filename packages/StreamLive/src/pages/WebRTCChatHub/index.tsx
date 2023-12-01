import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row, Modal, Tabs, Flex, ConfigProvider, theme, Card, List } from 'antd';
// import RTCPlayer from './aa';
import styles from './index.module.css';
import UseRTCPlayer from './hooks/UseRTCPlayer';
 import useMqtt from './hooks/UseMqtt';
import { useSearchParams, useParams } from 'ice';
import { tr } from 'date-fns/locale';
import RtcPlayer from './RtcPlayer';
import useDrag from './hooks/useDrag';

const R = require('ramda');
let classNames = require('classnames');

interface ICallMessage {
  room_id: string | null; // 房间名称
  initator: string | null; // 发起者device_id
  user_id: Array<string | number> | null; // 被邀请者device_id
}

let wsProtocol = 'ws';
let wsPort = 8883;


// 判断当前页面是否使用 HTTPS
if (window.location.protocol === 'https:') {
    wsProtocol = 'wss';
    wsPort = 8884;
}


const WebRTCChatHub = () => {
  let containerRef2 = useRef<HTMLDivElement | null>(null);
  // debugger;
  const { style, onMouseDown } = useDrag(containerRef2);
  // const aaa = useDrag({ changeWidth: true, changeHeight: false });
  const [playerRef, createPlayer] = UseRTCPlayer();
  const [showGridRight, setShowGridRight] = useState(true);
  const { sendMessage, subscribe, isConnected, messageHistory } = useMqtt(`${wsProtocol}://192.168.3.34:${wsPort}`);


  let containerRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [call_form_ref] = Form.useForm();
  // alert(JSON.stringify(searchParams))
  const roomId = searchParams.get('roomId');
  const deviceId = searchParams.get('deviceId');


  const [call_open_state, set_call_open_state] = useState(false);

  const [oncall_open_state, set_oncall_open_state] = useState<{open: boolean; roomId?: string}>({ open: false });

  const [whepUrlStore, setWhepUrlSotre] = useState<Array<{url?: string}>>([]);

  const callRing = async (parm: {
      room_id: string | null; // 房间名称
      initator: string | null; // 发起者device_id
      user_id: Array<string | number> | null; // 被邀请者device_id
  }) => {
    let message = parm;
    let messageString = JSON.stringify(message);
    let targetRoomId = roomId;

    if (roomId === null) {
      targetRoomId = await createRoomId();

      updateUrlHistory({ roomId: targetRoomId });
      message = Object.assign({}, message, { room_id: targetRoomId });
    }
    messageString = JSON.stringify(message);
    sendMessage('v1/callsystem/OnCall/device/', messageString, { qos: 2 });

    // setTimeout(() => {
    //   const urlString = location.href;

    //   // 创建一个URL对象
    //   const url = new URL(urlString);

    //   // 获取"name"参数的值
    //   const nameValue = url.searchParams.get('name');
    // }, 12);
  };


  const createRoomId = (): Promise< string> => {
    return new Promise((resolve, reject) => {
      // 使用 setTimeout 模拟异步操作，这里设置为0毫秒，表示立即解决
      setTimeout(() => {
        const roomId = Math.floor(Math.random() * 900) + 100;
        resolve(String(roomId));
      }, 10);
    });
  };

  const Confir_call = () => {

  };

  const fetch_remote_media = (urls) => {
    createPlayer(containerRef);

    let whepUrl = urls[0];


    setTimeout(() => {
    playerRef.current?.runwhep({ url: whepUrl.url });
    }, 200);
  };


  const acceptCall = (message: ICallMessage) => {
    let roomId = message.room_id;
    let user_ids = message.user_id;
  };

  const push_media = async () => {
    createPlayer(containerRef);
    await playerRef.current?.getMedia();
    let targetRoomId = roomId;
    if (roomId === null) {
     let { roomId } = oncall_open_state;
     updateUrlHistory({ roomId });
     targetRoomId = roomId!;
    }


    let url = `//192.168.3.15/index/api/whip?app=${targetRoomId}&stream=${deviceId}`;
   // playerRef.current?.runwhip({ url: url, token: 'ss' });

  // url = 'http://localhost:1985/rtc/v1/whip/?app=live&stream=livestream ';
    playerRef.current?.pushWhip({ url: url });

    // setTimeout(() => {

    // }, 900);
  };

  const pushScreenMedia = async () => {
    createPlayer(containerRef);
    await playerRef.current?.getdisplaymedia();
    let url = `//192.168.3.15/index/api/whip?app=${roomId}&stream=${deviceId}`;
    // url = 'http://localhost:1985/rtc/v1/whip/?app=live&stream=livestream ';
    playerRef.current?.pushWhip({ url: url });
  };


  const updateUrlHistory = (newParm: { roomId?: string; deviceId?: string}) => {
    let oldData = { roomId, deviceId };
    let data = Object.assign({}, oldData, newParm);

    setSearchParams(data);
  };

  const getSearchParms = () => {
     const urlString = location.href;

      const url = new URL(urlString);

      const roomId = url.searchParams.get('roomId');
      const deviceId = url.searchParams.get('deviceId');
    return {
      roomId,
      deviceId,
    };
  };

  useEffect(() => {
      // 監聽 被 invite 消息
      subscribe('v1/callsystem/OnCall/device/', { qos: 2 }, (MSG) => {
        let target_ids = MSG.payload.user_id;
        let taget_room = MSG.payload.room_id;

        let { roomId, deviceId } = getSearchParms();

        if (roomId === null && target_ids?.includes(deviceId!)) {
          set_oncall_open_state({ open: true, roomId: taget_room! });
        }

        if (taget_room === roomId && target_ids?.includes(deviceId!)) {
          set_oncall_open_state({ open: true });
        }
      });

      subscribe('v1/callsystem/OnPlay/device/', { qos: 2 }, (MSG) => {
        let whepUrl = MSG.payload.whep?.filter((v) => {
          if (v.user != deviceId) {
            return v.url;
          }
        });


        if (whepUrl && whepUrl?.length > 0) {
          let diffValues = R.difference(whepUrl, whepUrlStore);
          let newwhepUrlStore = [...whepUrlStore, ...diffValues];
          setWhepUrlSotre(newwhepUrlStore);
         // fetch_remote_media(newwhepUrlStore);
        }

        // console.log('-----------');
      });
      // let newparms = Object.assign(searchParams, { name: 22 });
      debugger;
  }, []);
    return (
      <ConfigProvider theme={{ algorithm: [theme.defaultAlgorithm, theme.compactAlgorithm] }}>
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
            open={oncall_open_state.open}
            footer={false}
            onOk={() => {
          set_oncall_open_state({ open: false, roomId: '' });
        }}
            onCancel={() => {
          set_oncall_open_state({ open: false, roomId: '' });
        }}
          >
            <div className={styles['confirm_call']}>
              <Button size="large" onClick={() => { set_oncall_open_state({ open: false, roomId: '' }); }}>REJECT</Button>
              <Button size="large" onClick={() => { set_oncall_open_state({ open: false, roomId: '' }); push_media(); }}>ACCEPT</Button>
            </div>
          </Modal>


          {/* <div
          className={styles['phone']}
          onClick={() => {
            alert(22);
            callRing({ room_id: roomId, initator: deviceId, user_id: ['16'] });
        }}
        >
          📞
        </div> */}

          <div className={showGridRight ? styles['grid-container-has-right'] : styles['grid-container']}>

            {/* 第一行 */}
            {/* <div className={styles['grid-item']}>
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
          </div> */}

            {
            whepUrlStore && whepUrlStore.length > 0 ? (
              // <div className={styles['gird-first-row']}>
              <div
                className={styles['gird-first-row']}
              >
                <div className={styles['first-flex-row']}>
                  {
                          (() => {
                            return R.map((v) => {
                              return (<div className={styles['row_item']} >
                                <RtcPlayer whepUrl={v.url} />
                              </div>);
                            }, whepUrlStore);
                          })()
                        }

                  <Card className={styles['row_item']} >m1</Card>


                </div>

              </div>
            ) : ''
          }


            {/* 第二行 */}
            <div
              className={showGridRight ? styles['grid-large-has-right'] : styles['grid-large']}
              ref={containerRef2}
              onMouseDown={onMouseDown}
              style={{ width: style.width }}
            ><Card ref={containerRef} style={{ height: '100%' }} /></div>

            {/* 第三行 */}
            <div
              className={styles['grid_third_row']}
              style={{ width: style.width }}
            >

              <div className={styles['third-flex-row']}>
                <div className={styles['grid-bottom']}>
                  <Button
                    type="primary"
                    className={styles['icon-button']}
                    onClick={() => {
                createPlayer(containerRef);
                playerRef.current?.getMedia();
                }}
                  >
                    <i className="icon-camera">打开摄像头</i>
                  </Button>
                </div>
                <div className={styles['grid-bottom']}>
                  <Button
                    className={styles['icon-button']}
                    onClick={() => {
                // createPlayer(containerRef);
                // playerRef.current?.getdisplaymedia();
                pushScreenMedia();
            }}
                  >
                    <i className="icon-camera">共享-屏幕</i>
                  </Button>
                </div>
                <div className={styles['grid-bottom']}>
                  <Button
                    className={styles['icon-button']}
                    onClick={() => {
                set_call_open_state(true);
               // callRing({ room_id: roomId, initator: deviceId, user_id: ['16'] });
            }}
                  >
                    <i className="icon-camera">邀请</i>
                  </Button>
                </div>
                <div className={styles['grid-bottom']}>
                  <Button className={styles['icon-button']}>
                    <i className="icon-members">成员</i>
                  </Button>
                </div>
                <div className={styles['grid-bottom']}>
                  <Button
                    className={styles['icon-button']}
                    onClick={() => {
              setShowGridRight(false);
            }}
                  >
                    <i className="icon-members">聊天</i>
                  </Button>
                </div>
                <div className={styles['grid-bottom']}>
                  <Button
                    className={styles['icon-button']}
                    onClick={() => {
                     playerRef.current?.close();
            }}
                  >
                    <i className="icon-members">挂断</i>
                  </Button>
                </div>
              </div>
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
                      children: (
                        <List
                          header={<div>message history</div>}
                          bordered

                        >
                          {
                               messageHistory.map((v) => {
                                return (<List.Item>  {JSON.stringify(v)}</List.Item>);
                              })
                          }

                        </List>
                        ),
                    },

                    {
                      label: 'pull stream store',
                      key: '2',
                      children: (<div>
                        {
                          whepUrlStore.map((v) => {
                            return (<div className={styles['line1']}>  {JSON.stringify(v)}</div>);
                          })
                        }
                      </div>),
                    },


                  ]}
                />

              </div>
          ) : null}


          </div>
        </div>
      </ConfigProvider>
      );
};


export default WebRTCChatHub;


