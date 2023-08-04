
/* eslint-disable no-negated-condition */
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import { Muxer, ArrayBufferTarget } from 'webm-muxer';
import Emitter from '../../utils/emitter';
import PlayerService from '../player';

@injectable()
class canvasToVideo {
     recording: boolean;
    private videoEncoder: VideoEncoder | null;
    private audioEncoder: AudioEncoder | null;
    private intervalId: ReturnType<typeof setInterval>;
    private audioTrack: MediaStreamTrack;
    private audioSampleRate: number;
    private canvas: HTMLCanvasElement;
    private IContext2D: CanvasRenderingContext2D;
    private muxer: Muxer<ArrayBufferTarget>;
    private startTime: CSSNumberish | null;
    private lastKeyFrame: number;
    private recordTextContent: string;
    constructor() {
       console.log('');
    }
    init(parm: {canvas?: HTMLCanvasElement}) {
        if (parm.canvas) {
            this.canvas = parm.canvas;
        }
    }

    async initAudio() {
        if (typeof AudioEncoder !== 'undefined') {
            try {
                let userMedia = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
                this.audioTrack = userMedia.getAudioTracks()[0];
            } catch (e) {}
        } else {
            console.log('no support AudioEncoder');
        }
        this.audioSampleRate = this.audioTrack?.getCapabilities().sampleRate.max;
    }

    createMuxer() {
        let { canvas, audioTrack, audioSampleRate } = this;

        let muxer = new Muxer({
            target: new WebMMuxer.ArrayBufferTarget(),
            video: {
                codec: 'V_VP9',
                width: canvas.width,
                height: canvas.height,
                frameRate: 30,
            },
            audio: audioTrack ? {
                codec: 'A_OPUS',
                sampleRate: audioSampleRate,
                numberOfChannels: 1,
            } : undefined,
            firstTimestampBehavior: 'offset', // Because we're directly piping a MediaStreamTrack's data into it
        });

        this.muxer = muxer;


        this.videoEncoder = new VideoEncoder({
            output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
            error: e => console.error(e),
        });

        this.videoEncoder.configure({
            codec: 'vp09.00.10.08',
            width: canvas.width,
            height: canvas.height,
            bitrate: 1e6,
        });

        if (this.audioTrack) {
            this.audioEncoder = new AudioEncoder({
                output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
                error: e => console.error(e),
            });
            this.audioEncoder.configure({
                codec: 'opus',
                numberOfChannels: 1,
                sampleRate: audioSampleRate,
                bitrate: 64000,
            });

            // Create a MediaStreamTrackProcessor to get AudioData chunks from the audio track
            let trackProcessor = new MediaStreamTrackProcessor({ track: audioTrack });
            let $this = this;
            let consumer = new WritableStream({
                write(audioData) {
                    if (!$this.recording) return;
                    $this.audioEncoder.encode(audioData);
                    audioData.close();
                },
            });
            trackProcessor.readable.pipeTo(consumer);
        }
    }

    async startReoord(parm: {canvas?: HTMLCanvasElement}) {
        if (parm.canvas) {
            this.canvas = parm.canvas;
        }
        if (typeof VideoEncoder === 'undefined') {
            alert('no Support  VideoEncoder / WebCodecs API  use Https');
            return;
        }
        this.initAudio();
        this.createMuxer();
        this.startTime = document.timeline.currentTime;
        this.recording = true;
        this.lastKeyFrame = -Infinity;

        this.encodeVideoFrame();

        this.intervalId = setInterval(this.encodeVideoFrame, 1000 / 30);
    }
    encodeVideoFrame() {
        let { canvas, lastKeyFrame, videoEncoder } = this;

        let elapsedTime = Number(document.timeline.currentTime) - Number(this.startTime);
        let frame = new VideoFrame(canvas, {
            timestamp: elapsedTime * 1000,
        });
                // Ensure a video key frame at least every 10 seconds
        let needsKeyFrame = elapsedTime - lastKeyFrame >= 10000;
        if (needsKeyFrame) lastKeyFrame = elapsedTime;


        videoEncoder.encode(frame, { keyFrame: needsKeyFrame });

        // 很重要 frame 一定要close
        frame.close();

        this.recordTextContent = `${elapsedTime % 1000 < 500 ? '🔴' : '⚫'} Recording - ${(elapsedTime / 1000).toFixed(1)} s`;
    }
    async endRecording() {
        this.recordTextContent = '';
        this.recording = false;

        clearInterval(this.intervalId);

        this.audioTrack?.stop();

        await this.videoEncoder.flush();
        await this.audioEncoder.flush();
        this.muxer.finalize();

        let { buffer } = this.muxer.target;

        this.downloadBlob(new Blob([buffer]));
    }

    downloadBlob(blob: Blob) {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'picasso.webm';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }
}


export default canvasToVideo;