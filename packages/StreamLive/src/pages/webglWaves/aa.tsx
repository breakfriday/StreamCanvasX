import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Form, Input, Radio, DividerProps } from 'antd';

import { createWaveAudioServiceInstance } from 'streamcanvasx/src/serviceFactories/index';

import styles from './index.module.css';


type ICreateWaveAudioServiceInstance = ReturnType<typeof createWaveAudioServiceInstance>;

const WAVEM = () => {
    const waveRef = useRef<ICreateWaveAudioServiceInstance | null>(null);
    const containerRef = useRef(null);
    useEffect(() => {
        let wavePlayer = createWaveAudioServiceInstance({ contentEl: containerRef.current! });
        waveRef.current = wavePlayer;
    }, []);
    return (<div >

      <div onClick={() => {
                alert(12);
                let wave = waveRef.current;

                let totalWave = wave?.waveGl.totalWaveforms;


                setInterval(() => {
                    let createMockData32 = () => {
                        let mockdata_item = wave?.waveGl.generateSineWave(200, 1);
                        let mockdata = [];
                        for (let i = 0; i < totalWave; i++) {
                            mockdata[i] = mockdata_item;
                        }
                        return mockdata;
                    };

                    let mockdata = createMockData32();
                    wave?.waveGl.inputData(mockdata);
                }, 60);


                 wave?.waveGl.render();
        }}
      >update mock</div>


      <div onClick={() => {
                alert(12);
                let wave = waveRef.current;

                let totalWave = wave?.waveGl.totalWaveforms;


                // 建立連接到 WebSocket 伺服器的URL
                const ws = new WebSocket('ws://123.56.228.244:26003/audio');

                // 當連接打開時
                ws.onopen = function (event) {
                    console.log('WebSocket 連接已打開', event);
                    // 你可以在這裡發送初始訊息給伺服器，如果需要的話
                    // ws.send(JSON.stringify({ type: 'initial', message: 'Hello server!' }));
                };

                ws.onerror = function (error) {
                   alert('WebSocket 錯誤');
                };
                // 當接收到伺服器發送的消息時

                ws.onclose = function (event) {
                    if (event.wasClean) {
                        alert(`WebSocket 連接已關閉 cleanly, code=${event.code}, reason=${event.reason}`);
                    } else {
                        alert('WebSocket connection died');
                    }
                };


                ws.onmessage = function (event) {
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
                          updatearray.push(channeldata);
                        }
                          // debugger;
                          // console.log(channelid);
                        }
                        // debugger;
                        console.log('onmessage');
                        wave?.waveGl.inputData(updatearray);
                        // debugger;
                      });
                };


                 wave?.waveGl.render();
        }}
      >update by websocket</div>

      <div className={styles['box']} ref={containerRef}> </div>
    </div>);
};

export default WAVEM;