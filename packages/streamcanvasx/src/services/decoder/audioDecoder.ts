import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import Emitter from '../../utils/emitter';
import PlayerService from '../player';

import CodecParser from 'codec-parser';
import { arrayBuffer, buffer } from 'stream/consumers';


@injectable()
class WebcodecsAudioDecoder extends Emitter {
    // private player: PlayerService;
    // private hasInit: boolean;
    private isInitInfo: boolean;
    private audioDecoder: any | null;
    private _audioSourceBuffers = [];

    // audioDecoderConfig;
    constructor() {
        super();

        this.hasInit = false;
        this.isInitInfo = false;
        this.audioDecoder = null;
    }
    init(playerService: PlayerService) {
        this.player = playerService;
        this.initDecoder();
    }
    destroy() {
        if (this.audioDecoder) {
            if (this.audioDecoder.state !== 'closed') {
                this.audioDecoder.close();
            }
            this.audioDecoder = null;
        }

        this.hasInit = false;
        this.isInitInfo = false;
        this.off();
    }
    initDecoder() {
        const _this = this;
        this.audioDecoder = new AudioDecoder({
            output(audioData) {
                _this.handleDecode(audioData);
                audioData.close();
            },
            error(error) {
                _this.handleError(error);
            },
        });
    }
    handleDecode(audioData: AudioData) {
        // console.log(audioData);
        const audioBuffer = new ArrayBuffer(audioData.numberOfFrames * 4);
        audioData.copyTo(audioBuffer, { planeIndex: 0 });
        // console.log('123465798', audioBuffer);
        this._audioSourceBuffers.push(audioData);
        // console.log(audioData);
        const audioContext = new AudioContext({
            sampleRate: 32000,
        });


        audioContext.createMediaStreamDestination;
        const audioSource = audioContext.createBufferSource();
        // debugger;
        const buffer = audioContext.createBuffer(
            1,
            audioData.numberOfFrames * 4,
            audioContext.sampleRate,
        );
        let nowBuffering = buffer.getChannelData(0);
        for (let i = 0; i < audioData.numberOfFrames * 4; i++) {
            nowBuffering[i] = audioBuffer[i];
        }
        // nowBuffering = new Float32Array(audioBuffer);
        audioSource.buffer = buffer;
        audioSource.connect(audioContext.destination);
        audioSource.start();
    }
    handleError(error: Error) {
        console.error(error);
        // this.player.debug.error('Webcodecs', 'VideoDecoder handleError', error);
    }
}
export default WebcodecsAudioDecoder;