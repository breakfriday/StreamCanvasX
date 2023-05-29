import * as React from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import { createAudioProcessingServiceInstance, createMainPlayerInstance } from 'StreamCanvasX/es2017/serviceFactories/index';
const {useRef}=React


const SimpleDemo = () => {
  const vedio_hls_ref = React.useRef<HTMLVideoElement | null>(null);
  const veido_flv_ref = React.useRef<HTMLVideoElement | null>(null);
  const canvas_ref = React.useRef<HTMLCanvasElement | null>(null);


  return (
    <>
    <div>
    </div>
    </>
  )
}

export default SimpleDemo;