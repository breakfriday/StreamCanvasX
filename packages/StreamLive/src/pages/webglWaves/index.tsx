import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Form, Input, Radio, DividerProps } from 'antd';

import { createWaveAudioServiceInstance } from 'streamcanvasx/src/serviceFactories/index';

import styles from './index.module.css';

import AA from './aa';


type ICreateWaveAudioServiceInstance = ReturnType<typeof createWaveAudioServiceInstance>;

const waveDemo = () => {
    return (<div >

      <AA />

    </div>);
};

export default waveDemo;