---
title: 快速开始
sidebar_label: 快速开始
sidebar_position: 1
---

<!-- import Readme from '../README.md';

<Readme /> -->
##  安装
```bash
$ npm i streamcanvasx --save
```

##  创建播放器
```js
import { createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';

const streamPlayer = createMainPlayerInstance({ canvas_el: canvas_ref?.current!, root_el: video_box.current! });

streamPlayer?.createFlvPlayer({
      type: 'flv', // could also be mpegts, m2ts, flv
      isLive: true,
      url: url,
  });
```

##  本地文件播放
```tsx
import { createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';
streamPlayer.set_blob_url(files_data)
```

```tsx  preview
import * as React from 'react';
import { createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';
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