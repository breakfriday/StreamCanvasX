import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Form, Input, Radio } from 'antd';
// import AudioWaveService from 'streamcanvasx/src/services/audio/audioWaveService';
import { createWaveVisualizationInstance } from 'streamcanvasx/src/serviceFactories/index';

import styles from './index.module.css';

const Wave = () => {
  // debugger;
  const containerRef = useRef();
  const waveVisualizationRef = useRef();

  useEffect(() => {
    const routes = 32;
    // let contentEl = document.getElementById('canvasContainer');

    // audioWave.init({ routes: routes });
    // debugger;
    let waveVisualization = createWaveVisualizationInstance({ routes: routes, contentEl: containerRef.current, renderType: 3, isMocking: false });
    waveVisualizationRef.current = waveVisualization;
    // waveVisualization.init({ routes: routes, contentEl: containerRef.current, renderType: 1 });
    // player.audioWaveService.initCanvas(containerRef.current);

    const ws = new WebSocket('ws://123.56.228.244:26003/audio');

    // 當連接打開時
    ws.onopen = function (event) {
        console.log('WebSocket 連接已打開', event);
        // 你可以在這裡發送初始訊息給伺服器，如果需要的話
        // ws.send(JSON.stringify({ type: 'initial', message: 'Hello server!' }));
    };

    ws.onmessage = function (event) {
      // const data = JSON.parse(event.data);
      // debugger;
      const { data } = event;
      // debugger;
      data.arrayBuffer().then((ab) => {
        const i16a = new Int16Array(ab);
        let subidx = 0;
        let updatearray = [];
        while (subidx <= i16a.length) {
          const terminalid = String(i16a[subidx]);
          const channelid = i16a[subidx + 2];
          const channeldata = i16a.subarray(subidx + 4, subidx + 164);
          subidx += 164;
          if (channelid) {
            const array = waveVisualization.WavePlayerService.hexArrayToFloat32Array(channeldata);
            updatearray.push(array);
          }
            // debugger;
            // console.log(channelid);
          }
          // debugger;
          console.log('onmessage');
          waveVisualization.WavePlayerService.update(updatearray);
          // debugger;
        });
      };

      if (waveVisualization.renderType === 3) {
        waveVisualization.WavePlayerService.waveGl.render();
      }
    // function initCanvas() {
    //   let contentEl = document.getElementById('canvasContainer');

    //   audioWave.initCanvas(contentEl);
    // }
    // function startDraw() {
    //   audioWave.start();
    // }
  }, []);

  // let player = playerRef.current;
  // let audioWave = player.AudioWaveService;


  return (
    <>
      {/* <Button onClick={() => {
      // let contentEl = document.getElementById('canvasContainer');
      // audioWave.initCanvas(contentEl);
      let player = playerRef.current;
      player.audioWaveService.initCanvas(containerRef.current);
      }}
      >initCanvas</Button> */}
      <Button onClick={() => {
      let waveVisualization = waveVisualizationRef.current;
      waveVisualization.WavePlayerService.update();
      //   audioWave.start();
      }}
      >updateArrayData</Button>


      <div className={styles['div1']} ref={containerRef} id="canvasContainer" />
    </>
  );
};
export default Wave;