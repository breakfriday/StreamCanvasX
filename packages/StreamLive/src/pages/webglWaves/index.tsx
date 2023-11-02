import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Form, Input, Radio, DividerProps } from 'antd';

import { createWaveAudioServiceInstance } from 'streamcanvasx/src/serviceFactories/index';

import styles from './index.module.css';


type ICreateWaveAudioServiceInstance = ReturnType<typeof createWaveAudioServiceInstance>;

const waveDemo = () => {
    const waveRef = useRef<ICreateWaveAudioServiceInstance | null>(null);
    useEffect(() => {
        let wavePlayer = createWaveAudioServiceInstance({});
        waveRef.current = wavePlayer;
    }, []);
    return (<div >ss

      <div onClick={() => {
                alert(12);
                let wave = waveRef.current;
        }}
      >update</div>

      <div className={styles['box']}> sws</div>
    </div>);
};

export default waveDemo;