import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';

import PlayerService from '../player';

import Decrypt from './decrypt/sm4';

import CodecParser from 'codec-parser';

@injectable()
class PreProcessing {
    player: PlayerService;
    decrypt: Decrypt;
    private streamParser: CodecParser;
    private audioDecoder: any | null;
    private _audioSourceBuffers = [];

    constructor() {

    }
    initAccStreamParser() {
        const mimeType = 'audio/aac';
        const options = {
        onCodec: () => {},
        onCodecUpdate: () => {},
        enableLogging: true,
    };

    this.streamParser = new CodecParser(mimeType, options);
    }
    init(playerService: PlayerService) {
        this.player = playerService;
        this.player.mseDecoderService.start();


        if (this.player?.config?.crypto?.enable === true) {
            this.decrypt = new Decrypt(this.player.config.crypto);
        }
        if (this.player.config.streamType = 'ACC') {
            this.initAccStreamParser();
        }
    }
    async processStream(reader: ReadableStreamDefaultReader) {
        const audioDecoderConfig = {
            codec: 'mp4a.40.2',
            sampleRate: 32000,
            numberOfChannels: 1,
            // description: 'ArrayBuffer',
        };
        this.initDecoder();
        this.audioDecoder.configure(audioDecoderConfig);

        if (this.player?.config?.crypto?.enable === true) {
            // 加密的acc 音频
            this.decrypt.processStream(reader);
        } else {
            // 纯acc 音频
            while (true) {
                try {
                    // console.log(audioDecoderConfig);


                    console.log(this.audioDecoder.state);

                    const { done, value } = await reader.read();

                    // const chunk = value?.buffer;
                    // console.log(chunk);
                    // console.log(value);
                    if (done) {
                        console.log('Stream complete');
                        return;
                    }


                    let { streamParser } = this;


                    let frames = [...streamParser.parseChunk(value)];
                    console.log(frames);
                    // console.log(frames[0]);
                    // console.log(typeof frames[0]);
                    for (let i in frames) {
                        const audiochunk = new EncodedAudioChunk({
                            type: 'key',
                            timestamp: frames[i].totalSamples - frames[i - 1]?.totalSamples ? frames[i - 1].totalSamples : 0,
                            duration: frames[i].totalDuration - frames[i - 1]?.totalDuration ? frames[i - 1].totalDuration : 0,
                            data: new Uint8Array(frames[i].data),
                        });
                        // const init = {
                        //     type: 'key',
                        //     data: frames[i],
                        //     timestamp: 1024,
                        //     // duration: 32,
                        //   };
                        // let audiochunk = new EncodedAudioChunk(init);
                        // console.log('132132', this.audioDecoder.state);
                        this.audioDecoder.decode(audiochunk);
                        // await this.audioDecoder.flush();
                    }
                    // debugger;
                    // console.log('decode:', frames);
                    console.log('decode:', this._audioSourceBuffers);
                    // debugger;


                    //  this.player.mseDecoderService.onstream(frames);
                } catch (e) {
                    console.error('Error reading stream', e);
                    return;
                }
            }
        }
    }
    initDecoder() {
        const _this = this;
        this.audioDecoder = new AudioDecoder({
            output(audiochunk) {
                _this.handleFrame(audiochunk);
                audiochunk.close();
            },
            error(error) {
                debugger;
                console.log(error);
            },
            // output: this.handleFrame,
            // error: console.error,
          });
    }
    // DecoderAudio(){

    // }

    handleFrame(audiochunk: AudioData) {
        // console.log(audiochunk);
        const audiochunkbuffer = new ArrayBuffer(audiochunk.numberOfFrames * 4);
        audiochunk.copyTo(audiochunkbuffer, { planeIndex: 0 });
        console.log('123465798', audiochunkbuffer);
        this._audioSourceBuffers.push(audiochunk);
        console.log(audiochunk);

        // console.log('in  handleFrame', this._audioSourceBuffers);
        const audioContext = new AudioContext({
            sampleRate: 32000,
        });


        // console.log(audiochunk.format);


        audioContext.createMediaStreamDestination;
        const audioSource = audioContext.createBufferSource();
        // debugger;
        const buffer = audioContext.createBuffer(
            1,
            audiochunk.numberOfFrames * 4,
            audioContext.sampleRate,
        );
        let nowBuffering = buffer.getChannelData(0);
        for (let i = 0; i < audiochunk.numberOfFrames * 4; i++) {
            nowBuffering[i] = audiochunkbuffer[i];
        }
        // nowBuffering = new Float32Array(audiochunkbuffer);
        audioSource.buffer = buffer;
        audioSource.connect(audioContext.destination);
        audioSource.start();

        // audioContext.decodeAudioData(audiochunkbuffer, (buffer) => {
        //     audioSource.buffer = buffer;
        //     audioSource.connect(audioContext.destination);
        //     audioSource.start();
        // }, (error) => {
        //     debugger;
        //     console.log(error);
        // });

        // audioSource.buffer = this._audioSourceBuffers;
        // audioSource.buffer = {
        //     numberOfChannels: 1,
        //     getChannelData: this._audioSourceBuffers,
        // };
        // audioSource.buffer = audiochunk,
        // audioSource.buffer.copyFromChannel = audiochunk,
        // audioSource.buffer = buffer,
        // audioSource.connect(audioContext.destination);
    }
}


export default PreProcessing;