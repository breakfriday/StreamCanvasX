

组件功能描述

## Install

```bash
$ npm i streamcanvasx --save
```

## Usage



```js
import { createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';

const streamPlayer = createMainPlayerInstance({ canvas_el: canvas_ref?.current!, root_el: video_box.current! });

streamPlayer?.createFlvPlayer({
      type: 'flv', // could also be mpegts, m2ts, flv
      isLive: true,
      url: url,
  });


```

音频可视化化

```js

import { createAudioProcessingServiceInstance, createMainPlayerInstance } from 'streamcanvasx/es2017/serviceFactories/index';

const streamPlayer = createMainPlayerInstance({ vedio_el, canvas_el });

streamPlayer?.createFlvPlayer({
      type: 'flv', // could also be mpegts, m2ts, flv
      isLive: true,
      url: url,
  });


const audio_process = createAudioProcessingServiceInstance({ media_el: veido_flv_ref.current!, canvas_el: canvas_audio_ref.current! });

audio_process.updateBufferData();
audio_process.drawWithBufferData();


```
