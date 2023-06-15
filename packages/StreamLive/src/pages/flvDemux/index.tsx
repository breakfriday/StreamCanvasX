import React, { useRef, useEffect } from 'react';
import { Divider, Space, Button } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';

 import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';


const FlvDemux = () => {
    return (
      <>
        <Button
          type="primary"
          onClick={() => {
            let url = 'http://localhost:8080/live/livestream.flv';
            // fetchflv.fetchStream(url);
            const h = createPlayerServiceInstance();
           h.httpFlvStreamService.fetchStream(url);

           let el = h.canvasVideoService.getCanvas2dEl();

           let container = document.getElementById('aa');
           container?.appendChild(el);
      }}
        >
          fetch flv http
        </Button>
        <Button
          type="primary"
          onClick={() => {
            let url = 'http://localhost:8080/live/livestream.flv';
            // fetchflv.fetchStream(url);
            const h = createPlayerServiceInstance();
           h.httpFlvStreamService.fetchStream(url);

           let el = h.canvasVideoService.getCanvas2dEl();

           let container = document.getElementById('aa');
           container?.appendChild(el);
      }}
        >
          fetch flv http
        </Button>
        <Button
          type="primary"
          onClick={() => {
            let url = 'http://localhost:8080/live/livestream.flv';
            // fetchflv.fetchStream(url);
            const h = createPlayerServiceInstance();
           h.httpFlvStreamService.fetchStream(url);

           let el = h.canvasVideoService.getCanvas2dEl();

           let container = document.getElementById('aa');
           container?.appendChild(el);
      }}
        >
          fetch flv http
        </Button>
        <Button
          type="primary"
          onClick={() => {
            let url = 'http://localhost:8080/live/livestream.flv';
            // fetchflv.fetchStream(url);
            const h = createPlayerServiceInstance();
           h.httpFlvStreamService.fetchStream(url);

           let el = h.canvasVideoService.getCanvas2dEl();

           let container = document.getElementById('aa');
           container?.appendChild(el);
      }}
        >
          fetch flv http
        </Button>
        <Button
          type="primary"
          onClick={() => {
            let url = 'http://localhost:8080/live/livestream.flv';
            // fetchflv.fetchStream(url);
            const h = createPlayerServiceInstance();
           h.httpFlvStreamService.fetchStream(url);

           let el = h.canvasVideoService.getCanvas2dEl();

           let container = document.getElementById('aa');
           container?.appendChild(el);
      }}
        >
          fetch flv http
        </Button>
        <Button
          type="primary"
          onClick={() => {
            let url = 'http://localhost:8080/live/livestream.flv';
            // fetchflv.fetchStream(url);
            const h = createPlayerServiceInstance();
           h.httpFlvStreamService.fetchStream(url);

           let el = h.canvasVideoService.getCanvas2dEl();

           let container = document.getElementById('aa');
           container?.appendChild(el);
      }}
        >
          fetch flv http
        </Button>

        <Button onClick={() => {
           h.httpFlvStreamService.abortFetch();
        }}
        >abort</Button>
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
            // const video: HTMLVideoElement = document.getElementById('vidd')!;


            // let callback = (now, metadata) => {
            //     // 这里你可以做任何你想在每一帧更新时执行的操作
            //     // 'now' 参数是自页面加载以来的毫秒数，是一个高精度的时间戳
            //     // 'metadata' 参数包含有关当前视频帧的信息，包括预计的显示时间，视频帧的尺寸，媒体时间等
            //     console.log('Timestamp: ', now);
            //     console.log('Frame metadata: ', metadata);
            //     player.canvasVideoService.renderFrameByWebgpu(video);
            //     // 如果你想在下一帧再次运行回调，你需要再次请求它
            //     video.requestVideoFrameCallback(callback);
            // };

            // let pp = () => {
            //   requestAnimationFrame(() => {
            //     console.log('-----------');
            //     player.canvasVideoService.renderFrameByWebgpu(video);
            //     pp();
            //   });
            // };


            // setTimeout(() => {
            //    pp();
            //   // requestAnimationFrame(() => {
            //   //   player.canvasVideoService.renderFrameByWebgpu(window.tt);
            //   // });
            // }, 400);


           let pp = () => {
              video.requestVideoFrameCallback(() => {
                console.log('-----------');
                player.canvasVideoService.renderFrameByWebgpu(video);
                pp();
              });
            };


          setTimeout(() => {
          video.requestVideoFrameCallback(pp);
          }, 300);

          // 首次请求回调

            // 首次请求回调


          //  let play = async () => {
          //   const video = document.createElement('video');
          //   video.width = 300;
          //   video.loop = true;
          //   video.autoplay = true;
          //   video.muted = true;
          //   video.src = window.blobUrl;
          //   await video.play();

          //   debugger;

          //  player.video_render(video);
          //  };

          //  play();
      }}
        >
          play webgpu video
        </Button>


      </>


    );
};

export default FlvDemux;