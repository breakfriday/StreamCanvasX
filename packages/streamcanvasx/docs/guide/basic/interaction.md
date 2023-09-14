---
title: 交互
sidebar_label: 交互
sidebar_position: 2
---

##  音频可视化
通过`createAudioProcessingServiceInstance()`中的`updateBufferData()`、`drawWithBufferData()`暂存音频数据并绘制可视化图形。
```tsx  
import { createAudioProcessingServiceInstance, createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';

const audio_process = createAudioProcessingServiceInstance({ media_el: video_el, canvas_el: canvas_audio_ref.current! });

audio_process.updateBufferData();
audio_process.drawWithBufferData();
```

```tsx  preview
import * as React from 'react';
import { createAudioProcessingServiceInstance, createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';
const {useRef,useEffect}=React


const SimpleDemo = () => {
  const veido_flv_ref = useRef<HTMLVideoElement | null>(null);
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
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
  )
}

export default SimpleDemo;
```


##  旋转 镜像
在`createPlayerServiceInstance()`中的`canvasVideoService()`中提供了旋转、镜像的方法（如`drawTrasform()`、`drawVerticalMirror()`、`drawHorizontalMirror()`、`transformReset()`、`drawRotate()`、`rotateReset()`）。
```tsx
import {  createPlayerServiceInstance } from 'streamcanvasx/es2017/serviceFactories/index';
  let play = createPlayerServiceInstance({ url, contentEl: containerRef.current! });
  play.canvasVideoService.drawTrasform(degree);
  play.canvasVideoService.drawRotate(degree);
  play.canvasVideoService.drawVerticalMirror();
```

```tsx  preview
import * as React from 'react';
import { Space, Button, Form, Input } from 'antd';
import {createPlayerServiceInstance } from 'streamcanvasx/es2017/serviceFactories/index';
const {useRef,useEffect,useState}=React

const VideoComponents = (props) => {
  const streamPlayer = useRef<any>(null);
  const [info, setInfo] = useState<any>();
  const [degree, setDegree] = useState<any>();

  useEffect(() => {
    let { url } = props;
    let player = createPlayerServiceInstance({ url, contentEl: containerRef.current! });
    streamPlayer.current = player;
    player.createFlvPlayer({});
    player.on('otherInfo', (data) => {
      let { speed } = data;
      setInfo({ speed });
    });
  }, []);

  const containerRef = useRef(null);

  return (
    <div >
      <div style={{ width: '200px', height: '200px' }} ref={containerRef} />
      <div>{JSON.stringify(info)}</div>

      <Button onClick={() => {
        let play = streamPlayer.current;
        play.reload();
      }}
      >retry</Button>
      <Space>
        <Input
          min={-180}
          max={180}
          value={degree}
          onChange={e => {
          setDegree(e.target.value);
        }}
        />
        <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.drawTrasform(degree);
        }}
        >transform</Button>
        <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.transformReset();
        }}
        >transformReset</Button>
        <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.drawRotate(degree);
        }}
        >rotate</Button>
        <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.rotateReset();
        }}
        >rotateReset</Button>
        <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.drawVerticalMirror();
        }}
        >VerticalMirror</Button>
        <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.drawHorizontalMirror();
        }}
        >HorizontalMirror</Button>
      </Space>
    </div>);
}

const SimpleDemo=()=>{

  useEffect(() => {}, []);
  const [data, setData] = useState<Array<{url: string}>>([]);
  return (
    <div>
      <Form
        name="basic"
        autoComplete="off"
        onFinish={(value: {url: string}) => {
            let item = { url: value.url };
            let temp = Object.assign([], data);
            temp.push(item);
            setData(temp);
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
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {
          data.map((item, inx) => {
            let { url } = item;
            return (<VideoComponents url={url} key={inx} />);
          })
        }
      </div>
    </div>
  )
}

export default SimpleDemo;

```


