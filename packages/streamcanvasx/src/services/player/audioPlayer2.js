
class AudioContextPlayer {
	constructor(preProcessingService) {
		this.audioContext = null;
		this.hasInitScriptNode = false;
		this.hasInitAudioWorkletNode = false;
		this.bufferList = [];
		this.playedBufferCount = 200;
		this.playingIndex = 0;
		this.currentTime = 0;
		this.remainingPCMData = new Float32Array(0);
		this.hasInit = false;
	}

	init(config) {
		const default_config = {
			sampleRate: 8000,
			bufferSize: 128,
			numberOfOutputChannels: 1,
			isLive: true,
		};
		this.config = Object.assign(default_config, config);
		const { useWorklet, isLive } = this.config;
		this.isLive = isLive;
		this.initAudioContext();

		this.initScriptNode();

		this.hasInit = true;
	}
	initAudioContext() {
		if (!this.audioContext) {
			this.audioContext = new AudioContext({
				sampleRate: this.config.sampleRate,
			});
		}
		this.gainNode = this.audioContext.createGain();
		this.gainNode.gain.value=1;
	}
	destroy() {
		this.audioContext = null;
		this.hasInit = false;
		this.hasInitScriptNode = false;
		this.bufferList = [];
		this.playingIndex = 0;
		if (this.scriptNode) {
			this.scriptNode && this.scriptNode.disconnect();
		}
		if (this.audioWorkletNode) {
			this.audioWorkletNode && this.audioWorkletNode.disconnect();
		}
		this.gainNode && this.gainNode.disconnect();
	}


	feedPCMDataBeta(pcmData) { // 单声道
		if(this.pcmData.length===0) {
			return false;
		}
		const { bufferSize } = this.config;
		let allPCMData = new Float32Array((this.remainingPCMData.length + pcmData.length));
		allPCMData.set(this.remainingPCMData, 0);
		allPCMData.set(pcmData, this.remainingPCMData.length);
		let count = Math.floor(allPCMData.length / bufferSize);
		for (let i = 0; i < count; i++) {
			let bufferItem = {
				data: [allPCMData.slice(i * bufferSize, (i + 1) * bufferSize)],
			};
			this.bufferList.push(bufferItem);
			if (this.bufferList.length > this.playedBufferCount) {
                this.bufferList.shift();
            }
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
		this.scriptNode.connect(this.gainNode);
		this.gainNode.connect(this.audioContext.destination);
		this.hasInitScriptNode = true;
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
	mute(parm) {
		if (parm === true) {
			this.gainNode.disconnect();
		} else {
			this.gainNode.connect(this.audioContext.destination);
		}
	}
}

export default AudioContextPlayer;
