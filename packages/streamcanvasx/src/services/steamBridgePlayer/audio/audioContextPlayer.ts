import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import Emitter from '../../../utils/emitter';
import PlayerService from '../index';

import { PCMBufferItem, IAduioContextPlayerConfig } from '../../../types/services';

// import worklet from './audioWorklet.js';

@injectable()
class AudioContextPlayer extends Emitter {
	config: IAduioContextPlayerConfig;
	hasInit: boolean;
	audioContext: AudioContext;
	scriptNode: ScriptProcessorNode;
	audioWorkletNode: AudioWorkletNode;
	gainNode: GainNode;
	hasInitScriptNode: boolean;
	hasInitAudioWorkletNode: boolean;
	bufferList: PCMBufferItem[];
	playedBufferCount: number;
	playingIndex: number;
	currentTime: number;
	remainingPCMData: Float32Array;
	isLive: boolean;
	replayCounts: number;
	replayPCMData: Float32Array;
	playersevice: PlayerService;
	canvas_el: HTMLCanvasElement;
	canvas_context: CanvasRenderingContext2D;
	clear?: boolean;
	resizeObserver: ResizeObserver;
	analyserNode: AnalyserNode
	constructor() {
		super();

		this.audioContext = null;
		this.hasInitScriptNode = false;
		this.hasInitAudioWorkletNode = false;
		this.bufferList = [];
		this.playedBufferCount = 1000;
		this.playingIndex = 0;
		this.currentTime = 0;
		this.remainingPCMData = new Float32Array(0);
		this.hasInit = false;
	}

	init(config?: IAduioContextPlayerConfig,playerService?: PlayerService) {
		this.playersevice=playerService;
		const default_config = {
			sampleRate: 32000,
			bufferSize: 1024,
			numberOfOutputChannels: 1,
			isLive: true,
			// sampleRate: 44100,
		};
		this.config = Object.assign(default_config, config);


		const { useWorklet, isLive } = this.config;
		this.isLive = isLive;
		this.initAudioContext();

		this.initScriptNode();
		this.hasInit = true;
	}

	initCanvas() {
		let { contentEl } =this.playersevice.config;


		this.canvas_el = document.createElement('canvas');
		this.canvas_el.style.position = 'absolute';
		this.canvas_context=this.canvas_el.getContext("2d");
		contentEl.append(this.canvas_el);
		this.setCanvasSize();
		this.event();
	}

	event() {
		let { contentEl } = this.playersevice.config;
		// 监听 dom size 变化， 调整canvas 大小
		this.resizeObserver = new ResizeObserver(() => {
		setTimeout(() => {
		this.setCanvasSize();
		//  this.resizeControlPannel();
		}, 20);
		});

		this.resizeObserver.observe(contentEl);
	}

	setCanvasSize() {
		let height = 200;
		let width = 400;
		let { contentEl } = this.playersevice.config;

		if (contentEl) {
		height = contentEl.clientHeight;
		width = contentEl.clientWidth;
		}

		this.canvas_el.width = width;
		this.canvas_el.height = height;
	}

	clearCanvas() {
		if(this.canvas_context) {
			let canvasContext = this.canvas_context;
			let canvas = this.canvas_el;
			this.clear = true;
			// 清除画布
			canvasContext.clearRect(0, 0, canvas.width, canvas.height);
		}
	  }

	initAudioContext() {
		if (!this.audioContext) {
			this.audioContext = new AudioContext({
				sampleRate: this.config.sampleRate,
			});
		}
		this.analyserNode=this.audioContext.createAnalyser();
		this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value=0.3;
	}
	destroy() {
        this.audioContext.close();
		this.audioContext = null;
		this.hasInit = false;
		this.hasInitScriptNode = false;
		this.bufferList = [];
		this.playedBufferCount = 1000;
		this.playingIndex = 0;
		if (this.scriptNode) {
			this.scriptNode && this.scriptNode.disconnect();
		}

		this.gainNode && this.gainNode.disconnect();
	}


	feedPCMData(pcmData: Float32Array) {
		const { bufferSize, numberOfOutputChannels } = this.config;
		let allPCMData = new Float32Array((this.remainingPCMData.length + pcmData.length));
		allPCMData.set(this.remainingPCMData, 0);
		allPCMData.set(pcmData, this.remainingPCMData.length);
		let count = Math.floor(allPCMData.length / (bufferSize * numberOfOutputChannels));

		for (let i = 0; i < count; i++) {
			let bufferItem: PCMBufferItem = {
				data: [],
			};

			for (let outputChannel = 0; outputChannel < numberOfOutputChannels; outputChannel++) {
				bufferItem.data.push(new Float32Array(bufferSize));
			}

			for (let index = 0; index < bufferSize; index++) {
				for (let outputChannel = 0; outputChannel < numberOfOutputChannels; outputChannel++) {
					bufferItem.data[outputChannel][index] = allPCMData[outputChannel + index * numberOfOutputChannels + i * (bufferSize * numberOfOutputChannels)];
				}
			}
			this.bufferList.push(bufferItem);
		}
		this.remainingPCMData = allPCMData.slice(count * bufferSize * numberOfOutputChannels);
	}
	feedPCMDataBeta(pcmData: Float32Array) { // 单声道
		const { bufferSize } = this.config;
		let allPCMData = new Float32Array((this.remainingPCMData.length + pcmData.length));
		allPCMData.set(this.remainingPCMData, 0);
		allPCMData.set(pcmData, this.remainingPCMData.length);
		let count = Math.floor(allPCMData.length / bufferSize);
		for (let i = 0; i < count; i++) {
			let bufferItem: PCMBufferItem = {
				data: [allPCMData.slice(i * bufferSize, (i + 1) * bufferSize)],
			};
			this.bufferList.push(bufferItem);
		}
		this.remainingPCMData = allPCMData.slice(count * bufferSize);
	}
	initScriptNode() {
		if (this.hasInitScriptNode) {
				return;
		}
		// debugger;
		const { bufferSize, numberOfOutputChannels } = this.config;
		const scriptNode = this.audioContext.createScriptProcessor(bufferSize, 0, numberOfOutputChannels); // bufferSize  numberOfOutputChannels
		if (this.isLive) { // 在线播放
			scriptNode.onaudioprocess = (audioProcessingEvent) => {
				const { outputBuffer } = audioProcessingEvent;
				if (this.bufferList.length) {
					const bufferItem = this.bufferList.shift();

					for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
						const nowBuffering = outputBuffer.getChannelData(channel);
						nowBuffering.set(bufferItem.data[channel]);
					}
				}
			};
		}

		this.scriptNode = scriptNode;
		this.scriptNode.connect(this.analyserNode);
		this.analyserNode.connect(this.gainNode);
		this.gainNode.connect(this.audioContext.destination);
		this.hasInitScriptNode = true;
        this.mute(true);
	}


	play() {
		if (this.audioContext.state === 'suspended') {
			this.audioContext.resume();
		}
	}
	pause() {
		if (this.audioContext.state === 'running') {
			this.audioContext.suspend();
		}
	}

    convertUint8ArrayToFloat32(uint8Data: Uint8Array): Float32Array {
        let float32Data = new Float32Array(uint8Data.length);
        for (let i = 0; i < uint8Data.length; i++) {
            // Map from [0, 255] to [-1.0, 1.0]
            float32Data[i] = (uint8Data[i] / 127.5) - 1.0;
        }
        return float32Data;
    }
	mute(parm: boolean) {
		if (parm === true) {
			this.gainNode.disconnect();
		} else {
			this.gainNode.connect(this.audioContext.destination);
		}
	}

    setGain(v: number = 1) {
        try {
        this.gainNode.gain.value = v;
        } catch (e) {
          console.error('调整音频增益失败');
        }
      }

	updateBufferData() {

	}
	render() {

	}
	showAudio() {
		this.playersevice.config.showAudio=true;
		this.updateBufferData();
		this.render();
	}
}

export default AudioContextPlayer;
