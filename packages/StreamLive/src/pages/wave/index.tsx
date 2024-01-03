import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Form, Input, Radio } from 'antd';
import { createWaveVisualizationInstance } from 'streamcanvasx/src/serviceFactories/index';

import styles from './index.module.css';

type ICreateWaveVisualizationInstance = ReturnType<typeof createWaveVisualizationInstance>;


const Wave = () => {
  // debugger;
  const containerRef = useRef();
  const waveVisualizationRef = useRef<ICreateWaveVisualizationInstance | null>(null);
  const [kbps, setKbps] = useState<string>();

  const audioProcess1 = (stream: MediaStream) => {
    let audioContext = new AudioContext();
    let source = audioContext.createMediaStreamSource(stream);

    // 创建 ScriptProcessorNode
    let processor = audioContext.createScriptProcessor(512, 1, 1);

    let waveVisualization = waveVisualizationRef.current;
    waveVisualization?.WavePlayerService.waveGl.render();
    // 处理音频事件
    processor.onaudioprocess = function (e) {
        // 获取输入缓冲区的浮点数组
        let { inputBuffer } = e;
        let inputData = inputBuffer.getChannelData(0);

        let createMockData32 = () => {
          let mockdata_item = inputData;
          let mockdata = [];
          for (let i = 0; i < 32; i++) {
            mockdata[i] = mockdata_item;
          }
          return mockdata;
        };

        // inputData 是 Float32Array，包含音频样本数据
        // 在这里可以对 inputData 进行处理
       // console.log(inputData);

       let data32 = createMockData32();

        waveVisualization?.WavePlayerService.update(data32);
      // waveVisualization?.WavePlayerService.triggerUpdate(data32);
      // console.info(data32);
    };

    // 连接节点
    source.connect(processor);
    processor.connect(audioContext.destination);
  };

 let getAudioPlay = async (parm?: {audioSource?: string; videoSource?: string}) => {
    let { audioSource = '', videoSource = '' } = parm || {};
   let mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

   let audio: HTMLAudioElement = document.getElementById('audioElement');
   audio.srcObject = mediaStream;

   audioProcess1(mediaStream);
   return mediaStream;
};
  useEffect(() => {
    const routes = 32;
    let length = 90000;
    let waveVisualization = createWaveVisualizationInstance({ routes: routes, contentEl: containerRef.current, renderType: 3, isMocking: false, arrayLength: length, updateArrayTimes: 10, converLiveData: false }, {});
    waveVisualizationRef.current = waveVisualization;
  }, []);

  return (
    <>
      <audio id="audioElement" autoPlay controls />
      <Button onClick={() => {
      getAudioPlay();
      }}
      >audio Play</Button>
      <Button onClick={() => {
        let waveVisualization = waveVisualizationRef.current;
        let ws: WebSocket;
        let dataByte: number;
        let lastTime = 0;
        let nowTime = 0;
        let dataCount = 0;
        let count = 5;
        function createWebSocket() {
          try {
            ws = new WebSocket('ws://123.56.228.244:26003/audio');
            initws();
          } catch (e) {
            console.log(`catch${e}`);
            reconnect();
          }
        }

        createWebSocket();

3;
        function initws() {
          // 當連接打開時
          ws.onopen = function (event) {
            console.log('WebSocket 連接已打開', event);
            // 你可以在這裡發送初始訊息給伺服器，如果需要的話
            // ws.send(JSON.stringify({ type: 'initial', message: 'Hello server!' }));
          };

          ws.onmessage = function (event) {
            const { data } = event;
            // debugger;
            data.arrayBuffer().then((ab) => {
              const i16a = new Int16Array(ab);
              let subidx = 0;
              let updatearray = new Array(0);
              while (subidx <= i16a.length) {
                const terminalid = String(i16a[subidx]);
                const channelid = i16a[subidx + 2];
                const channeldata = i16a.subarray(subidx + 4, subidx + 164);
                subidx += 164;

                if (channelid) {
                  const array = waveVisualization?.WavePlayerService.hexArrayToFloat32Array(channeldata);
                  updatearray.push(array);
                }
                // debugger;
                // console.log(channelid);
              }
              dataByte = data.arrayBuffer().length * 2; // Byte
              lastTime = nowTime;
              nowTime = Number(Date.now());
              let elapsed = (nowTime - lastTime); // ms
              if (!(dataCount % count)) {
                setKbps((dataByte / elapsed).toFixed(3)); // KBps
              }
              dataCount++;

              // debugger;
              // console.log('onmessage');
              waveVisualization?.WavePlayerService.update(updatearray);

              // debugger;
            });
          };

          // 當連接出現錯誤時
          ws.onerror = function (error) {
            console.error('WebSocket 錯誤', error);
            reconnect();
          };

          // 當連接被關閉時
          ws.onclose = function (event) {
            if (event.wasClean) {
              console.log(`WebSocket 連接已關閉 cleanly, code=${event.code}, reason=${event.reason}`);
            } else {
              console.error('WebSocket connection died');
              reconnect();
            }
          };
        }

        let isReconnrcting = false;
        let timeid: any = '';
        function reconnect() {
          if (isReconnrcting) {
            return;
          }
          isReconnrcting = true;
          timeid && clearTimeout(timeid);
          timeid = setTimeout(() => {
            console.log('重连中...');
            isReconnrcting = false;
            createWebSocket();
          }, 2000);
        }


        if (waveVisualization?.renderType === 3) {
          waveVisualization?.WavePlayerService.waveGl.render();
        }
      }}
      >update by WebSocket</Button>


      <Button onClick={() => {
        let waveVisualization = waveVisualizationRef.current;
        waveVisualization?.destroy();
      }}
      >destroy</Button>
      <div>{`${kbps}KB/s`}</div>

      <div className={styles['div1']} ref={containerRef} id="canvasContainer" />
    </>
  );
};
export default Wave;