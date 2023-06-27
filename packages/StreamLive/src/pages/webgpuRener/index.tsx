import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';

import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';

import Player from './aa';


const FlvDemux = () => {
   let [data, setData] = useState<Array<{type: number}>>([]);
    return (
      <>


        <div id="aa" />


        <input
          type="file"
          id="file-input"
          accept="audio/*,video/*"
          onChange={(event) => {
          let video: HTMLMediaElement = document.getElementById('vidd')!;
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
          //   const player = createPlayerServiceInstance({ model: 1 });

          //   let el = player.canvasVideoService.getCanvas2dEl();
          //   let container = document.getElementById('aa');
          //   container?.appendChild(el);
          //   let video: HTMLVideoElement = document.getElementById('vidd')! as HTMLVideoElement;
          //  player.canvasVideoService.createVideoFramCallBack(video);
      }}
        >
          play canvas2d video
        </Button>


        <Button
          type="primary"
          onClick={() => {
            const player = createPlayerServiceInstance({ model: 2 });


            let el = player.canvasVideoService.getCanvas2dEl();
            let container = document.getElementById('aa');
            container?.appendChild(el);
            let video: HTMLVideoElement = document.getElementById('vidd')! as HTMLVideoElement;


            player.canvasVideoService.createVideoFramCallBack(video);


          //  let pp = () => {
          //     video.requestVideoFrameCallback(() => {
          //       console.log('-----------');
          //       player.canvasVideoService.render(video);
          //       pp();
          //     });
          //   };


          // setTimeout(() => {
          // video.requestVideoFrameCallback(pp);
          // }, 300);
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

export default FlvDemux;