export default MSStreamLoader;
declare class MSStreamLoader extends BaseLoader {
    static isSupported(): boolean;
    constructor(seekHandler: any, config: any);
    TAG: string;
    _seekHandler: any;
    _config: any;
    _xhr: XMLHttpRequest;
    _reader: any;
    _totalRange: any;
    _currentRange: any;
    _currentRequestURL: any;
    _currentRedirectedURL: any;
    _contentLength: number;
    _receivedLength: number;
    _bufferLimit: number;
    _lastTimeBufferSize: number;
    _isReconnecting: boolean;
    _internalOpen(dataSource: any, range: any, isSubrange: any): void;
    _dataSource: any;
    _internalAbort(): void;
    _xhrOnReadyStateChange(e: any): void;
    _xhrOnError(e: any): void;
    _msrOnProgress(e: any): void;
    _doReconnectIfNeeded(): void;
    _msrOnLoad(e: any): void;
    _msrOnError(e: any): void;
}
import { BaseLoader } from './loader.js';
