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
        <input
            type="file"
            id="file-input"
            accept="audio/*,video/*"
            onChange={(event) => {
            const streamPlayer = streamPlayerRef.current!;
            const files_data = event.target?.files?.[0]; // 返回file对象， 继承自blob对象。
            files_data ? streamPlayer.set_blob_url(files_data) : '';
            }}
        />
    </div>
    </>
  )
}

export default SimpleDemo;