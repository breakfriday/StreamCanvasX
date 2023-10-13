import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row } from 'antd';
import RTCPlayer from './aa';
import styles from './index.module.less';


const WebRTCChatHub = () => {
    return (
      <div className={styles['grid_container']}>

        <RTCPlayer />
        <RTCPlayer />
        <RTCPlayer />
        <RTCPlayer />
        <RTCPlayer />
      </div>);
};


export default WebRTCChatHub;


