---
title: 播放
sidebar_label: 播放
sidebar_position: 0
---

##  本地文件播放
```tsx
import { createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';
  streamPlayer.set_blob_url(files_data);
```
```tsx  preview
import * as React from 'react';
import { createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';
const {useRef,useEffect}=React


const SimpleDemo = () => {
  const veido_flv_ref = useRef<HTMLVideoElement | null>(null);
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
  let streamPlayerRef = useRef<mainPlayerService | null>(null);

  useEffect(() => {
    const streamPlayer = createMainPlayerInstance({ root_el: veido_flv_ref?.current!, canvas_el: canvas_ref?.current! });
    streamPlayerRef.current = streamPlayer;
  }, []);

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

           <canvas ref={canvas_ref}  width="300" height="300" style={{"marginLeft":"15px"}} />
        </div>
    </div>
  )
}

export default SimpleDemo;
```

##  hls直播流播放
```tsx
import Hls from 'hls.js';
  hls.loadSource(url);
  hls.attachMedia(vedio_el);
  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    vedio_el.play();
  });

```

```tsx  preview
import * as React from 'react';
import { Button } from 'antd';
import Hls from 'hls.js';
const {useRef}=React


const SimpleDemo = () => {
  const vedio_hls_ref = useRef<HTMLVideoElement | null>(null);

  const hls_play = () => {
    if (Hls.isSupported()) {
      if (vedio_hls_ref?.current) {
        const vedio_el = vedio_hls_ref.current;
        const hls = new Hls();
        const url = '//localhost:8080/live/livestream.m3u8';
        hls.loadSource(url);
        hls.attachMedia(vedio_el);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          vedio_el.play();
        });
      }
    }
  };

  return (
    <div>
        <div id="original-player">
          <video
            ref={vedio_hls_ref}
            width="300"
            height="300"
            controls
            preload="none"
          />
          <div>
            <Button
              onClick={() => {
                hls_play();
              }}
            >hls 拉流
            </Button>
          </div>     
        </div>
    </div>
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
import { Button, Form, Input } from 'antd';
import {createPlayerServiceInstance } from 'streamcanvasx/es2017/serviceFactories/index';
const {useRef,useEffect,useState}=React

const VideoComponents = (props) => {
  const streamPlayer = useRef<any>(null);
  const [info, setInfo] = useState<any>();

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

##  WebCodecs 解码播放
### 本地文件 webCodecs 解码播放
### flv流 解码播放

