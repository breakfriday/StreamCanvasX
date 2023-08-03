
/* eslint-disable no-negated-condition */
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import { Muxer, ArrayBufferTarget } from 'webm-muxer';
import Emitter from '../../utils/emitter';
import PlayerService from '../player';

@injectable()
class canvasToVideo {
    private recording: boolean;
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
    constructor() {

    }
    init(parm: {canvas?: HTMLCanvasElement}) {
        if (typeof VideoEncoder === 'undefined') {
            alert('no Support  VideoEncoder / WebCodecs API  use Https');
            return;
        }
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
    }

    async startReoord() {
        this.initAudio();
        this.createMuxer();
        this.startTime = document.timeline.currentTime;
        this.recording = true;
        this.lastKeyFrame = -Infinity;

        this.encodeVideoFrame();
    }
    encodeVideoFrame() {
        let { canvas } = this;
        let elapsedTime = Number(document.timeline.currentTime) - Number(this.startTime);
        let frame = new VideoFrame(canvas, {
            timestamp: elapsedTime * 1000,
        });
    }
}


export default canvasToVideo;