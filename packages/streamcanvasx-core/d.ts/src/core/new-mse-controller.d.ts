interface InitSegment {
    type: string;
    container: string;
    codec?: string;
    mediaDuration?: number;
    data?: ArrayBuffer;
}
declare class MSEController {
    private TAG;
    private _config;
    private _emitter;
    private _mediaSource;
    private _mediaSourceObjectURL;
    private _mediaElement;
    private _isBufferFull;
    private _hasPendingEos;
    private _requireSetMediaDuration;
    private _pendingMediaDuration;
    private _pendingSourceBufferInit;
    private _mimeTypes;
    private _sourceBuffers;
    private _lastInitSegments;
    private _pendingSegments;
    private _pendingRemoveRanges;
    private _idrList;
    private e;
    constructor(config: any);
    destroy(): void;
    on(event: any, listener: any): void;
    off(event: any, listener: any): void;
    attachMediaElement(mediaElement: any): void;
    detachMediaElement(): void;
    appendInitSegment(initSegment: InitSegment, deferred?: any): void;
    appendMediaSegment(mediaSegment: any): void;
    seek(seconds: any): void;
    endOfStream(): void;
    getNearestKeyframe(dts: any): any;
    _needCleanupSourceBuffer(): boolean;
    _doCleanupSourceBuffer(): void;
    _updateMediaSourceDuration(): void;
    _doRemoveRanges(): void;
    _doAppendSegments(): void;
    _onSourceOpen(): void;
    _onSourceEnded(): void;
    _onSourceClose(): void;
    _hasPendingSegments(): boolean;
    _hasPendingRemoveRanges(): boolean;
    _onSourceBufferUpdateEnd(): void;
    _onSourceBufferError(e: any): void;
}
export default MSEController;
