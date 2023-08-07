import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Form, Input } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';

import { Muxer, ArrayBufferTarget } from 'webm-muxer';

 import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';
 import styles from './index.module.css';
import Player from '../webgpuRener/aa';

 interface Icanvas {
    Canvas: HTMLCanvasElement;
    IContext2D: CanvasRenderingContext2D;
 }

const CanvasToVideo = () => {
 const canvasRef = useRef<HTMLCanvasElement>(null);
 let canvas: HTMLCanvasElement;
 let ctx: CanvasRenderingContext2D;
 let drawing: boolean;
 let lastPos: { x: number; y: number };
 let muxer: any;
 let startTime: CSSNumberish | null;
 let recording: boolean;
 let lastKeyFrame: number;
 let intervalId: ReturnType<typeof setInterval>;
 let videoEncoder: VideoEncoder | null;


 useEffect(() => {
  init();
  event();

  let player = createPlayerServiceInstance({});


  window.player = player;
 }, []);

 let [recordingStatus, setRecordingStatus] = useState({ textContent: '🔴' });


 let init = () => {
  canvas = canvasRef.current!;
  ctx = canvas.getContext('2d', { desynchronized: true })!;
  drawing = false;
  lastPos = { x: 0, y: 0 };
 };

let event = () => {
  canvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;

    drawing = true;
    lastPos = getRelativeMousePos(e);
    drawLine(lastPos, lastPos);
  });

  window.addEventListener('pointerup', () => {
    drawing = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!drawing) return;

    let newPos = getRelativeMousePos(e);
    drawLine(lastPos, newPos);
    lastPos = newPos;
  });
};

const drawLine = (from, to) => {
	ctx.beginPath();
	ctx.moveTo(from.x, from.y);
	ctx.lineTo(to.x, to.y);
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 3;
	ctx.lineCap = 'round';
	ctx.stroke();
};


const getRelativeMousePos = (e) => {
	let rect = canvas.getBoundingClientRect();
	return { x: e.clientX - rect.x, y: e.clientY - rect.y };
};


    return (
      <>

        <div >
          <canvas className={styles['canvas1']} ref={canvasRef} width="800" height={400} />
        </div>
        <div>
          <Button onClick={() => {
			         let canvas = canvasRef.current!;
 					 player.canvasToVideoSerivce.startReoord({ canvas: canvas });
          }}
          >start Recording</Button>
          <Button onClick={() => {
				let canvas = canvasRef.current!;
				alert(2)
				player.canvasToVideoSerivce.endRecording({ canvas: canvas });
		  }}
          >strop Recording</Button>
        </div>


      </>


    );
};

export default CanvasToVideo;