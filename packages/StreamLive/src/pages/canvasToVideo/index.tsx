import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Form, Input } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';

import { Muxer, ArrayBufferTarget } from 'webm-muxer';

 import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';
 import styles from './index.module.css';

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

const startRecording = () => {
  	// Check for VideoEncoder availability
	if (typeof VideoEncoder === 'undefined') {
		alert('no Support  VideoEncoder / WebCodecs API  use Https');
		return;
	}


  	// Create a WebM muxer with a video track and maybe an audio track
	muxer = new WebMMuxer.Muxer({
		target: new WebMMuxer.ArrayBufferTarget(),
		video: {
			codec: 'V_VP9',
			width: canvas.width,
			height: canvas.height,
			frameRate: 30,
		},
		firstTimestampBehavior: 'offset', // Because we're directly piping a MediaStreamTrack's data into it
	});


 const videoEncoder = new VideoEncoder({
		output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
		error: e => console.error(e),
	});
    videoEncoder.configure({
		codec: 'vp09.00.10.08',
		width: canvas.width,
		height: canvas.height,
		bitrate: 1e6,
	});

  startTime = document.timeline.currentTime!;
	recording = true;
	lastKeyFrame = -Infinity;

	encodeVideoFrame();
	intervalId = setInterval(encodeVideoFrame, 1000 / 30);
};

const encodeVideoFrame = () => {
  let elapsedTime = document.timeline.currentTime - startTime;
	let frame = new VideoFrame(canvas, {
		timestamp: elapsedTime * 1000,
	});

	// Ensure a video key frame at least every 10 seconds
	let needsKeyFrame = elapsedTime - lastKeyFrame >= 10000;
	if (needsKeyFrame) lastKeyFrame = elapsedTime;

	videoEncoder!.encode(frame, { keyFrame: needsKeyFrame });
	frame.close();
  let textContent = `${elapsedTime % 1000 < 500 ? '🔴' : '⚫'} Recording - ${(elapsedTime / 1000).toFixed(1)} s`;
  setRecordingStatus({ textContent });

	// recordingStatus.textContent =
	// 	`${elapsedTime % 1000 < 500 ? '🔴' : '⚫'} Recording - ${(elapsedTime / 1000).toFixed(1)} s`;
};

const endRecording = async () => {
  setRecordingStatus({ textContent: '' });
	recording = false;

	clearInterval(intervalId);


	await videoEncoder?.flush();

	muxer.finalize();

	let { buffer } = muxer.target;
	downloadBlob(new Blob([buffer]));

	videoEncoder = null;
	audioEncoder = null;
	muxer = null;
	startTime = null;
	firstAudioTimestamp = null;
};

const downloadBlob = (blob: Blob) => {

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
            startRecording();
          }}
          >start Recording</Button>
          <Button>strop Recording</Button>
        </div>


      </>


    );
};

export default CanvasToVideo;