import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';

import PlayerService from '../player';

import Decrypt from './decrypt/sm4';

import CodecParser from 'codec-parser';

@injectable()
class PreProcessing {
    player: PlayerService;
    decrypt: Decrypt;
    streamParser: CodecParser;

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
        // debugger;
        this.player.mseDecoderService.start();


        if (this.player?.config?.crypto?.enable === true) {
            this.decrypt = new Decrypt(this.player.config.crypto, this);
        }
        if (this.player.config.streamType === 'AAC') {
            this.initAccStreamParser();
        }
    }
    async processStream(reader: ReadableStreamDefaultReader) {
        if (this.player?.config?.crypto?.enable === true) {
            // 加密的acc 音频
            this.decrypt.processStream(reader);
        } else {
            // 纯acc 音频
            while (true) {
                try {
                    const { done, value } = await reader.read();

                    const chunk = value?.buffer;
                    // console.log(chunk);
                    if (done) {
                        console.log('Stream complete');
                        return;
                    }


                    let { streamParser } = this;


                    let frames = [...streamParser.parseChunk(value)];


                     this.player.mseDecoderService.onstream(frames);
                } catch (e) {
                    console.error('Error reading stream', e);
                    return;
                }
            }
        }
    }
}


export default PreProcessing;