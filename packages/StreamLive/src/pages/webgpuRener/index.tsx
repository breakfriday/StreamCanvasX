import React, { useRef, useEffect } from 'react';
import { Divider, Space, Button } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';

 import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';


const FlvDemux = () => {
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
            const player = createPlayerServiceInstance();

            let el = player.canvasVideoService.getCanvas2dEl();
            let container = document.getElementById('aa');
            container?.appendChild(el);
            let video: HTMLVideoElement = document.getElementById('vidd')!;
           player.canvasVideoService.createVideoFramCallBack(video);
      }}
        >
          play webgpu video
        </Button>


        <Button
          type="primary"
          onClick={() => {
            const player = createPlayerServiceInstance();


            let el = player.canvasVideoService.getCanvas2dEl();
            let container = document.getElementById('aa');
            container?.appendChild(el);
            let video: HTMLVideoElement = document.getElementById('vidd')!;


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
          play canvas2d video
        </Button>


      </>


    );
};

export default FlvDemux;