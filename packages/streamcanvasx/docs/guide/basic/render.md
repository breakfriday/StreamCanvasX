---
title: 渲染
sidebar_label: 渲染
sidebar_position: 1
---

## 分别使用canvas WebGpu进行渲染
`createPlayerServiceInstance()`提供了`canvas`、`WebGpu`两种方式进行音视频的渲染，可以在model属性中进行`canvas`和`WebGpu`的选择。
```tsx
import { createPlayerServiceInstance } from 'streamcanvasx/es2017/serviceFactories/index';
        const { type = 1 } = props;
        const player = createPlayerServiceInstance({ model: type });
```

```tsx  preview
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button } from 'antd';

import { createPlayerServiceInstance } from 'streamcanvasx/es2017/serviceFactories/index';

const Player = (props) => {
    const container_ref = useRef<HTMLDivElement >(null);
    useEffect(() => {
        const { type = 1 } = props;
        const player = createPlayerServiceInstance({ model: type });

        let el = player.canvasVideoService.getCanvas2dEl();
        let container = document.getElementById('aa');
        container?.appendChild(el);
        let video: HTMLVideoElement = document.getElementById('vidd')! as HTMLVideoElement;
        player.canvasVideoService.createVideoFramCallBack(video);

        container_ref.current!.append(el);
    }, []);


    return (<div style={{ width: '300px', height: '150px' }} ref={container_ref} />);
};


const SimpleDemo = () => {
   let [data, setData] = useState<Array<{type: number}>>([]);
    return (
      <>
        <div id="aa" />
        <input
          type="file"
          id="file-input"
          accept="audio/*,video/*"
          onChange={(event) => {
          let video: HTMLMediaElement = document.getElementById('vidd')! as HTMLVideoElement;
          const files_data: File = event.target?.files?.[0]; // 返回file对象， 继承自blob对象。
          window.blobUrl = URL.createObjectURL(files_data);
          video.src = blobUrl;
          video.load();
          video.play();
        }}
        />
        <video controls id="vidd" width={300} />

        <Button
          type="primary"
          onClick={() => {
            let temp = Object.assign([], data);
            temp.push({ type: 1 });

            setData(temp);
          }}
        >
          play canvas2d video
        </Button>


        <Button
          type="primary"
          onClick={() => {
            let temp = Object.assign([], data);
            temp.push({ type: 2 });

            setData(temp);
          }}
        >
          play webgpu video
        </Button>

        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>

          {
          (() => {
            return data.map((value, inx) => {
              let { type } = value;
              return <Player key={inx} type={type} />;
            });
          })()
          }
        </div>
      </>
    );
};

export default SimpleDemo;
```

