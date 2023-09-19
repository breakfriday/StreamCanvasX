import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';

import WebcodecsAudioDecoder from '../decoder/audioDecoder';

@injectable()
class AudioContextPlayer {
	webcodecsAudioDecoder: WebcodecsAudioDecoder;
	context: {
		audioContext?: AudioContext;
		// analyserNode?: AnalyserNode;
		gainNode?: GainNode;
		audioSourceNode?: MediaElementAudioSourceNode;
		mediaSource_el?: HTMLAudioElement | HTMLVideoElement;
	};
	constructor() {

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
		const audioContext = new AudioContext({
			sampleRate: 32000,
		});
		// audioContext.createMediaStreamDestination;
		const audioSource = audioContext.createBufferSource();
		const scriptNode = audioContext.createScriptProcessor(4096, 1, 1);
		console.log(scriptNode.bufferSize);

		// debugger;
		const buffer = audioContext.createBuffer(
			1, // number of channels
			audioData.numberOfFrames * 4, // frameCount
			audioContext.sampleRate, //  audioContext.sampleRate
		);
		let nowBuffering = buffer.getChannelData(0);
		for (let i = 0; i < audioData.numberOfFrames * 4; i++) {
			// 需要添加 fade_in  fade_out
			nowBuffering[i] = audioBuffer[i];
		}

		scriptNode.onaudioprocess = (audioProcessingEvent) => {
			// The input buffer is the song we loaded earlier
			// const { inputBuffer } = audioProcessingEvent;

			// The output buffer contains the samples that will be modified and played
			const { outputBuffer } = audioProcessingEvent;

			// Loop through the output channels (in this case there is only one)
			for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
				const inputData = buffer.getChannelData(channel);
				const outputData = outputBuffer.getChannelData(channel);

				// Loop through the 4096 samples
				for (let sample = 0; sample < buffer.length; sample++) {
				// make output equal to the same as the input
				outputData[sample] = inputData[sample];
				}
			}
		};


		// nowBuffering = new Float32Array(audioBuffer);
		// audioSource.buffer = buffer;
		// audioSource.connect(audioContext.destination);
		// audioSource.start();
		audioSource.connect(scriptNode);
		scriptNode.connect(audioContext.destination);
		audioSource.start();


		audioSource.onended = () => {
			audioSource.disconnect(scriptNode);
			scriptNode.disconnect(audioContext.destination);
		};
	}
}

export default AudioContextPlayer;