# StreamCanvaX

组件功能描述

## Install

```bash
$ npm i StreamCanvasX --save
```

## Usage

```js
import { createMainPlayerInstance } from 'StreamCanvasX/es2017/serviceFactories/index';

const streamPlayer = createMainPlayerInstance({ vedio_el, canvas_el });

streamPlayer?.createFlvPlayer({
      type: 'flv', // could also be mpegts, m2ts, flv
      isLive: true,
      url: url,
  });


```
