/// <reference types="dom-webcodecs" />
import Emitter from '../../utils/emitter';
import PlayerService from '../player';
declare class WebcodecsDecoder extends Emitter {
    private player;
    private hasInit;
    private isDecodeFirstIIframe;
    private isInitInfo;
    private decoder;
    constructor();
    init(playerService: PlayerService): void;
    destroy(): void;
    initDecoder(): void;
    handleDecode(videoFrame: VideoFrame): void;
    handleError(error: Error): void;
    decodeVideo(payload: Uint8Array, ts: number, isIframe: boolean): void;
    isDecodeStateClosed(): boolean;
}
export default WebcodecsDecoder;
