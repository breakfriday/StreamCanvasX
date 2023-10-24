import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row } from 'antd';
import RTCPlayer from './aa';
import styles from './index.module.less';
let classNames = require('classnames');


let getNames = () => {

};
const WebRTCChatHub = () => {
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

        <div className={classNames(styles['grid-container-has-right'])}>

          {/* 第一行 */}
          <div className={styles['grid-item']}>1</div>
          <div className={styles['grid-item']}>2</div>
          <div className={styles['grid-item']}>3</div>
          <div className={styles['grid-item']}>4</div>

          {/* 第二行 */}
          <div className={styles['grid-large-has-right']}>large_caputre</div>

          {/* 第三行 */}
          <div className={styles['grid-bottom']}>
            <button className={styles['icon-button']}>
              <i className="icon-camera">打开摄像头</i>
            </button>
          </div>
          <div className={styles['grid-bottom']}>
            <button className={styles['icon-button']}>
              <i className="icon-camera">共享-屏幕</i>
            </button>
          </div>
          <div className={styles['grid-bottom']}>
            <button className={styles['icon-button']}>
              <i className="icon-camera">邀请</i>
            </button>
          </div>
          <div className={styles['grid-bottom']}>
            <button className={styles['icon-button']}>
              <i className="icon-members">成员</i>
            </button>
          </div>
          <div className={styles['grid-bottom']}>
            <button className={styles['icon-button']}>
              <i className="icon-members">聊天</i>
            </button>
          </div>

          {/* 最右边列 */}
          <div className={styles['gird-right']}>
            <div style={{ width: '100px' }}>
              chat
            </div>

          </div>

        </div>
      </div>
      );
};


export default WebRTCChatHub;


