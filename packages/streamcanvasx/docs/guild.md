---
title: 新手指南
sidebar_label: Guild
sidebar_position: 2
---

##  本地文件播放
```tsx
import { createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';
streamPlayer.set_blob_url(files_data)
```
```tsx  preview
import * as React from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import { createAudioProcessingServiceInstance, createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';
const {useRef,useEffect}=React


const SimpleDemo = () => {
  const veido_flv_ref = React.useRef<HTMLVideoElement | null>(null);
  const canvas_ref = React.useRef<HTMLCanvasElement | null>(null);
   let streamPlayerRef = useRef<mainPlayerService | null>(null);

  useEffect(() => {
    const streamPlayer = createMainPlayerInstance({ root_el: veido_flv_ref?.current!, canvas_el: canvas_ref?.current! });
    streamPlayerRef.current = streamPlayer;

  }, []);

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
        <div style={{"display":"flex","flexDirection":"row"}}>
           <div
            ref={veido_flv_ref}
            style={{ width: '300px', height: '300px' }}
          />

           <canvas ref={canvas_ref}  width="300" height="300" style={{"marginLeft":"15px"}} />
        </div>
    
    </div>
    </>
  )
}

export default SimpleDemo;
```

##  flv直播流播放

```tsx
import {  createPlayerServiceInstance } from 'streamcanvasx/es2017/serviceFactories/index';

 let player = createPlayerServiceInstance({});

 player.createFlvPlayer({ url: '' });

```

```tsx  preview
import * as React from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import {createPlayerServiceInstance } from 'streamcanvasx/es2017/serviceFactories/index';
const {useRef,useEffect}=React


const SimpleDemo = () => {
  const veido_flv_ref = React.useRef<HTMLVideoElement | null>(null);
 
   let streamPlayerRef = useRef<mainPlayerService | null>(null);

  useEffect(() => {
  

  }, []);

    const flv_play = (params) => {
    let { url} = params;
    let streamPlayer =  streamPlayerRef.current
        streamPlayer?.createFlvPlayer({
          type: 'flv', // could also be mpegts, m2ts, flv
          isLive: true,
          url: url,
      });
    };

  return (
    <>
    <div>
  
          <div
            ref={veido_flv_ref}
            style={{ height: '300px' }}
          />
          <Form
            name="basic"
            autoComplete="off"
            onFinish={(value: {url:string}) => {
                let player = createPlayerServiceInstance();

                let url=value.url;

                player.createFlvPlayer({ url: value.url });

                let canvas_el = player.canvasVideoService.getCanvas2dEl();


                 veido_flv_ref.current.append(canvas_el);

                

             

           
                }}
           >
              <Form.Item
                label="url"
                name="url"
              >
                <Input />
              </Form.Item>


              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                >
                  fetch_play
                </Button>
              </Form.Item>
    </Form>
         
    </div>
    </>
  )
}

export default SimpleDemo;
```


##  WebGpu渲染播放

```tsx  preview
import * as React from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import { createAudioProcessingServiceInstance, createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';
const {useRef,useEffect}=React


const SimpleDemo = () => {
  const veido_flv_ref = React.useRef<HTMLVideoElement | null>(null);
  const canvas_ref = React.useRef<HTMLCanvasElement | null>(null);
   let streamPlayerRef = useRef<mainPlayerService | null>(null);

  useEffect(() => {
    const streamPlayer = createMainPlayerInstance({ root_el: veido_flv_ref?.current!, canvas_el: canvas_ref?.current! });
    streamPlayerRef.current = streamPlayer;

  }, []);

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
          <div
            ref={veido_flv_ref}
            style={{ width: '300px', height: '300px' }}
          />

           <canvas ref={canvas_ref}  width="300" height="300" />
    </div>
    </>
  )
}

export default SimpleDemo;
```

##  音频可视化
```tsx  
import { createAudioProcessingServiceInstance, createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';

const audio_process = createAudioProcessingServiceInstance({ media_el: video_el, canvas_el: canvas_audio_ref.current! });

audio_process.updateBufferData();
audio_process.drawWithBufferData();
```

```tsx  preview
import * as React from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import { createAudioProcessingServiceInstance, createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';
const {useRef,useEffect}=React


const SimpleDemo = () => {
  const veido_flv_ref = React.useRef<HTMLVideoElement | null>(null);
  const canvas_ref = React.useRef<HTMLCanvasElement | null>(null);
   let streamPlayerRef = useRef<mainPlayerService | null>(null);
   const canvas_audio_ref = useRef(null);

  useEffect(() => {
    const streamPlayer = createMainPlayerInstance({ root_el: veido_flv_ref?.current!, canvas_el: canvas_ref?.current! });
    streamPlayerRef.current = streamPlayer;

    loadMediaEvent()

  }, []);

    const loadMediaEvent = () => {
    const video_el = streamPlayerRef.current?._vedio;
    if (video_el) {
      video_el.addEventListener('play', () => {
        const audio_process = createAudioProcessingServiceInstance({ media_el: video_el, canvas_el: canvas_audio_ref.current! });


         audio_process.updateBufferData();
         audio_process.drawWithBufferData();
        // audio_process.visulizerDraw3();
      });
    }
  };

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
        <div style={{"display":"flex","flexDirection":"row"}}>
           <div
            ref={veido_flv_ref}
            style={{ width: '300px', height: '300px' }}
          />

           <canvas  ref={canvas_ref}  width="300" height="300" style={{"marginLeft":"15px","display":"none"}} />

          <div >
            <canvas style={{ background: 'black' }} ref={canvas_audio_ref} id="canvas" width="300" height="300" />
          </div>

           
        </div>
    
    </div>
    </>
  )
}

export default SimpleDemo;
```


##  WebCodecs 解码播放
### 本地文件 webCodecs 解码播放
### flv流 解码播放
