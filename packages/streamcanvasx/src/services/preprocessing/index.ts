import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';

import PlayerService from '../player';

import Decrypt from './decrypt/sm4';

import CodecParser from 'codec-parser';

import WebcodecsAudioDecoder from '../decoder/audioDecoder';
import AudioContextPlayer from '../player/audioContextPlayer';

@injectable()
class PreProcessing {
    player: PlayerService;
    webcodecsAudioDecoder: WebcodecsAudioDecoder;
    audioContextPlayer: AudioContextPlayer;
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
        // this.webcodecsAudioDecoder = new WebcodecsAudioDecoder(); // 取audiocontext中的webcodecsAudioDecoder
        this.audioContextPlayer = new AudioContextPlayer();
        this.audioContextPlayer.init();
        this.webcodecsAudioDecoder = this.audioContextPlayer.webcodecsAudioDecoder;
        if (this.player?.config?.crypto?.enable === true) {
            this.decrypt = new Decrypt(this.player.config.crypto);
        }
        if (this.player.config.streamType = 'ACC') {
            this.initAccStreamParser();
        }
    }
    async processStream(reader: ReadableStreamDefaultReader) {
        // this.webcodecsAudioDecoder.init(this.audioContextPlayer);
        this.webcodecsAudioDecoder.init();
        if (this.player?.config?.crypto?.enable === true) {
            // 加密的acc 音频
            this.decrypt.processStream(reader);
        } else {
            // 纯acc 音频
            while (true) {
                try {
                    console.log(this.webcodecsAudioDecoder.getAudioDecoderState());

                    const { done, value } = await reader.read();

                    // const chunk = value?.buffer;
                    // console.log(chunk);
                    if (done) {
                        console.log('Stream complete');
                        return;
                    }


                    let { streamParser } = this;


                    let frames = [...streamParser.parseChunk(value)];
                    console.log(frames);
                    // console.log(frames[0]);
                    // console.log(typeof frames[0]);
                    this.audioContextPlayer.audioContextPlayer(frames);
                    // debugger;
                    // console.log('decode:', frames);
                    console.log('decode:', this.webcodecsAudioDecoder._audioSourceBuffers);
                    // debugger;


                    //  this.player.mseDecoderService.onstream(frames);
                } catch (e) {
                    console.error('Error reading stream', e);
                    return;
                }
            }
        }
    }
}


export default PreProcessing;