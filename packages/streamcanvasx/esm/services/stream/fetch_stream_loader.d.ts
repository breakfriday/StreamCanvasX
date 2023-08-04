import PlayerService from '../player';
declare class HttpFlvStreamLoader {
    private _requestAbort;
    private _abortController;
    private playerService;
    url: string;
    constructor();
    static isSupported(): boolean;
    get requestAbort(): boolean;
    set requestAbort(value: boolean);
    get abortController(): AbortController;
    init(playerService: PlayerService, url: string): void;
    fetchStream(url: string): Promise<void>;
    abortFetch(): void;
    processStream(reader: ReadableStreamDefaultReader): Promise<void>;
    processFlvChunk(chunk: Uint8Array): void;
}
export default HttpFlvStreamLoader;
