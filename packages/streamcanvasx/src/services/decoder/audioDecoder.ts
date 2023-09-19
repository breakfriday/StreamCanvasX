import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';

import AudioContextPlayer from '../player/audioContextPlayer';

@injectable()
class WebcodecsAudioDecoder {
    // private player: PlayerService;
    // private hasInit: boolean;
    // private isInitInfo: boolean;
    private audioDecoder: any | null;
    _audioSourceBuffers: any[];
    private config: any;
    audioContextPlayer: AudioContextPlayer;

    constructor() {
        this.audioDecoder = null;
        this._audioSourceBuffers = [];
    }
    init(audioContextPlayer?, config?) {
        if (!audioContextPlayer) {
            this.audioContextPlayer = new AudioContextPlayer();
        }

        const default_config = {
            codec: 'mp4a.40.2',
            sampleRate: 32000,
            numberOfChannels: 1,
        };
        this.config = Object.assign(default_config, config);
        this.initDecoder(this.config);
    }
    destroy() {
        if (this.audioDecoder) {
            if (this.audioDecoder.state !== 'closed') {
                this.audioDecoder.close();
            }
            this.audioDecoder = null;
        }
        // this.hasInit = false;
        // this.isInitInfo = false;
    }
    initDecoder(audioDecoderConfig) {
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
        this.audioDecoder.configure(audioDecoderConfig);
    }
    decode(audiochunk: EncodedAudioChunk) {
        this.audioDecoder.decode(audiochunk);
    }
    handleDecode(audioData: AudioData) {
        const audioBuffer = new ArrayBuffer(audioData.numberOfFrames * 4);
        audioData.copyTo(audioBuffer, { planeIndex: 0 });
        this._audioSourceBuffers.push(audioData);
        this.audioContextPlayer.audioContextScriptProcessor(audioData, audioBuffer);
    }
    handleError(error: Error) {
        console.error(error);
    }
    getAudioDecoderState() {
        return this.audioDecoder.state;
    }
}
export default WebcodecsAudioDecoder;