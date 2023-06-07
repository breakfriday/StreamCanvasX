declare class httpFlvStreamLoader {
    private _requestAbort;
    constructor();
    static isSupported(): boolean;
    get requestAbort(): boolean;
    set requestAbort(value: boolean);
    fetchStream(url: string): Promise<void>;
    processStream(reader: ReadableStreamDefaultReader): Promise<void>;
    abort(): void;
}
