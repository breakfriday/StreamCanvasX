import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row, Modal, Tabs, Tag } from 'antd';
import UseRTCPlayer from './hooks/UseRTCPlayer';


interface Iprops{
 whepUrl?: string;
 whipUrl?: string;
 userId?: string;
}
//
const RtcPlayer: React.FC<Iprops> = (props) => {
    const [playerRef, createPlayer] = UseRTCPlayer();
    let containerRef = useRef(null);
    let { whepUrl, whipUrl, userId } = props;

    useEffect(() => {
        createPlayer(containerRef);
    }, []);

    useEffect(() => {
      if (whepUrl) {
        playerRef.current?.runWhep({ url: whepUrl });
      } else {
        playerRef.current?.destroy();
      }
    }, [whepUrl]);

    useEffect(() => {
      if (whipUrl) {
        playerRef.current?.pushWhip({ url: whipUrl });
      } else {
        playerRef.current?.destroy();
      }
    }, [whipUrl]);


    return (
      <div ref={containerRef} style={{ height: '100%', width: '100%', position: 'relative' }} >
        <Tag color="#2db7f5" style={{ position: 'absolute', left: '0px', top: '0px' }}>设备id：{userId}</Tag>
        {/* <div style={{ position: 'absolute', left: '0px', top: '0px' }} >设备id：{userId}</div> */}
      </div>
      );
};

export default RtcPlayer;