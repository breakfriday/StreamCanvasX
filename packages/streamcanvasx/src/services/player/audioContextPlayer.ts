import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';

import WebcodecsAudioDecoder from '../decoder/audioDecoder';

@injectable()
class AudioContextPlayer {
	webcodecsAudioDecoder: WebcodecsAudioDecoder;
	audioContext: AudioContext;
	audioSource: AudioBufferSourceNode;
	scriptNode: ScriptProcessorNode;
	count: number;
	// context: {
	// 	audioContext?: AudioContext;
	// 	// analyserNode?: AnalyserNode;
	// 	gainNode?: GainNode;
	// 	audioSourceNode?: MediaElementAudioSourceNode;
	// 	// mediaSource_el?: HTMLAudioElement | HTMLVideoElement;
	// };
	constructor() {
		this.audioContext = null;
		this.count = 0;
	}

	init(webcodecsAudioDecoder?) {
		if (!webcodecsAudioDecoder) {
			this.webcodecsAudioDecoder = new WebcodecsAudioDecoder();
		}
	}
	audioContextPlayer(frames) {
		for (let i in frames) {
			const audiochunk = new EncodedAudioChunk({
				type: 'key',
				timestamp: frames[i].totalSamples - frames[i - 1]?.totalSamples ? frames[i - 1].totalSamples : 0,
				duration: frames[i].totalDuration - frames[i - 1]?.totalDuration ? frames[i - 1].totalDuration : 0,
				data: new Uint8Array(frames[i].data),
			});

		this.webcodecsAudioDecoder.decode(audiochunk);
		}
	}
	audioContextScriptProcessor(audioData: AudioData, audioBuffer: ArrayBuffer) {
		if (!this.audioContext) {
			this.audioContext = new AudioContext({
				// sampleRate: 32000,
				sampleRate: audioData.sampleRate,
			});
		}
		// audioContext.createMediaStreamDestination;
		this.audioSource = this.audioContext.createBufferSource();
		this.scriptNode = this.audioContext.createScriptProcessor(1024, 1, 1);
		// console.log(this.scriptNode.bufferSize);

		// debugger;
		const buffer = this.audioContext.createBuffer(
			audioData.numberOfChannels,		// 1	 number of channels
			audioData.numberOfFrames, // frameCount
			this.audioContext.sampleRate, //  audioContext.sampleRate
		);
		let Float32Array_audioBuffer = new Float32Array(audioBuffer);
		let nowBuffering = buffer.getChannelData(0);
		// console.log('nowBuffering_1', nowBuffering);
		for (let i = 0; i < audioData.numberOfFrames; i++) {
			// 可以添加 fade_in  fade_out
			nowBuffering[i] = Float32Array_audioBuffer[i];
		}
		// console.log('Float32Array_audioBuffer', Float32Array_audioBuffer);
		// console.log('nowBuffering_2', nowBuffering);


		this.scriptNode.onaudioprocess = (audioProcessingEvent) => {
			// The input buffer is the song we loaded earlier
			// const { inputBuffer } = audioProcessingEvent;

			// The output buffer contains the samples that will be modified and played
			const { outputBuffer } = audioProcessingEvent;

			// Loop through the output channels (in this case there is only one)
			for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
				const inputData = buffer.getChannelData(channel);
				// console.log('inputData', inputData);
				this.count = this.count + 1;
				// console.log('count', this.count);
				console.log(this.audioContext.currentTime);
				const outputData = outputBuffer.getChannelData(channel);

				// Loop through the 4096 samples
				for (let sample = 0; sample < buffer.length; sample++) {
				// make output equal to the same as the input
				outputData[sample] = inputData[sample];
				}
			}
		};

		if (this.count === 0) {
			this.audioSource.buffer = buffer;
			this.audioSource.connect(this.scriptNode);
			this.scriptNode.connect(this.audioContext.destination);
			// nowBuffering = new Float32Array(audioBuffer);
			// audioSource.connect(audioContext.destination);
			// audioSource.start();

			this.audioSource.start();
		}


		// this.audioSource.onended = () => {
		// 	// if (this.scriptNode && this.audioSource) {
		// 	// 	this.audioSource.disconnect(this.scriptNode);
		// 	// 	this.scriptNode.disconnect(this.audioContext.destination);
		// 	// }
		// 	console.log('this.audioSource.onended');
		// };
	}
}

export default AudioContextPlayer;