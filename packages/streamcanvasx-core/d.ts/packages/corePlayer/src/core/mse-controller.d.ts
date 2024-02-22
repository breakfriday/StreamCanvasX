export default MSEController;
declare class MSEController {
    constructor(config: any);
    TAG: string;
    _config: any;
    _emitter: any;
    e: {
        onSourceOpen: any;
        onSourceEnded: any;
        onSourceClose: any;
        onSourceBufferError: any;
        onSourceBufferUpdateEnd: any;
    };
    _mediaSource: MediaSource;
    _mediaSourceObjectURL: string;
    _mediaElement: any;
    _isBufferFull: boolean;
    _hasPendingEos: boolean;
    _requireSetMediaDuration: boolean;
    _pendingMediaDuration: number;
    _pendingSourceBufferInit: any[];
    _mimeTypes: {
        video: any;
        audio: any;
    };
    _sourceBuffers: {
        video: any;
        audio: any;
    };
    _lastInitSegments: {
        video: any;
        audio: any;
    };
    _pendingSegments: {
        video: any[];
        audio: any[];
    };
    _pendingRemoveRanges: {
        video: any[];
        audio: any[];
    };
    _idrList: IDRSampleList;
    destroy(): void;
    on(event: any, listener: any): void;
    off(event: any, listener: any): void;
    attachMediaElement(mediaElement: any): void;
    detachMediaElement(): void;
    appendInitSegment(initSegment: any, deferred: any): void;
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
import { IDRSampleList } from './media-segment-info.js';
