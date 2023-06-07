declare class httpFlvStreamLoader {
    private _requestAbort;
    private _abortController;
    constructor();
    static isSupported(): boolean;
    get requestAbort(): boolean;
    set requestAbort(value: boolean);
    get abortController(): AbortController;
    fetchStream(url: string): Promise<void>;
    abortFetch(): void;
    processStream(reader: ReadableStreamDefaultReader): Promise<void>;
    processFlvChunk(chunk: Uint8Array): void;
    abort(): void;
}
