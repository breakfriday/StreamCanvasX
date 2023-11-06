import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Form, Input, Radio, DividerProps } from 'antd';

import { createWaveAudioServiceInstance } from 'streamcanvasx/src/serviceFactories/index';

import styles from './index.module.css';


type ICreateWaveAudioServiceInstance = ReturnType<typeof createWaveAudioServiceInstance>;

const WAVEM = () => {
    const waveRef = useRef<ICreateWaveAudioServiceInstance | null>(null);
    const containerRef = useRef(null);
    useEffect(() => {
        let wavePlayer = createWaveAudioServiceInstance({ contentEl: containerRef.current! });
        waveRef.current = wavePlayer;
    }, []);
    return (<div >

      <div onClick={() => {
                alert(12);
                let wave = waveRef.current;

                 wave?.waveGl.render();
        }}
      >update</div>

      <div className={styles['box']} ref={containerRef}> </div>
    </div>);
};

export default WAVEM;