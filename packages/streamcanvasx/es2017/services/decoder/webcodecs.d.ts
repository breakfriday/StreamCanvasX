import Emitter from '../../utils/emitter';
export default class WebcodecsDecoder extends Emitter {
    private player;
    private hasInit;
    private isDecodeFirstIIframe;
    private isInitInfo;
    private decoder;
    constructor(player: any);
    destroy(): void;
    initDecoder(): void;
    handleDecode(videoFrame: any): void;
    handleError(error: any): void;
    decodeVideo(payload: any, ts: any, isIframe: any): void;
    isDecodeStateClosed(): boolean;
}
