import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../player';
import { TYPES } from '../../serviceFactories/symbol';
@injectable()
class HttpFlvStreamLoader {
    private _requestAbort: boolean;
    private _abortController: AbortController;
    private _abortController2: AbortController;
    private _requestAbort2: boolean;
    private _chunks2: Array<Uint8Array>;
    private playerService: PlayerService;
    public url: string;
    private downLoadConfig: {loading: boolean; text: string; startTime: number};

    maxHeartTimes: number;
    hertTime: number;
    constructor(
        // @inject(new LazyServiceIdentifer(() => TYPES.IPlayerService)) playerService: PlayerService,

        // @inject(new LazyServiceIdentifer(() => TYPES.IPlayerService)) playerService: PlayerService,

    ) {
        this.requestAbort = false;
        this.hertTime = 0;
        this.maxHeartTimes = 10;
        // this.playerService = playerService;
    }
    static isSupported() {
        if (window.fetch && window.ReadableStream) {
             return true;
        } else {
            console.log('Fetch and Stream API are not supported');
            return false;
        }
    }
    get requestAbort(): boolean {
        return this._requestAbort;
    }
    set requestAbort(value: boolean) {
        this._requestAbort = value;
    }
    get abortController() {
        return this._abortController;
    }

    init(playerService: PlayerService, url: string) {
        this.playerService = playerService;
        this.url = url;
    }

    // 统一 公用别名
    open() {
        this.fetchStream();
    }
   // 统一 公用别名
    abort() {
        this.abortFetch();
    }
    destroy() {
        this.abort();
    }
    async fetchStream(): Promise<void> {
        let { url } = this.playerService.config;
        let headers = new Headers();
        this._abortController = new AbortController();
        let params: RequestInit = {
            method: 'GET',
            mode: 'cors', // cors is enabled by default
            credentials: 'same-origin', // withCredentials is disabled by default
            headers: headers,
            cache: 'default',
            referrerPolicy: 'no-referrer-when-downgrade',
            signal: this.abortController.signal,

        };

        try {
            const response: Response = await fetch(url, params);
            if (this.requestAbort === true) {
                response.body.cancel();
                return;
            }

            // fetch API 的 Response 对象的 body 属性是一个 ReadableStream 流。
            const stream = response.body;
            const reader = stream?.getReader();
            if (reader) {
                await this.processStream(reader);
            }
        } catch (e) {

        }
    }

    abortFetch(): void {
        this.abortController.abort();
    }

    downLoadBlob(blob: Blob) {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'canvaToVideo.flv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }

    async downLoad() {
        const controller = new AbortController();
        this._abortController2 = controller;
        const { signal } = controller;
        let { url } = this;
        let tempUrl = new URL(url);
        let downUrl = `${location.protocol}//${tempUrl.host}${tempUrl.pathname}`;
        this._requestAbort2 = false;
        let requestAbort = this._requestAbort2;


        const downloadBlob = (blob: Blob) => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'canvaToVideo.flv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        };


    try {
        const response: Response = await fetch(downUrl, { signal });
        // if (requestAbort === true) {
        //     response.body.cancel();
        //     return;
        // }
        const stream = response.body;
        const reader = stream?.getReader();
        const chunks = this._chunks2 = [];
        if (reader) {
            while (true) {
                const { value, done } = await reader.read();

                if (done || requestAbort) {
                  break;
                }

                chunks.push(value);
            }
        }
    } catch (e) {
        if (e.name === 'AbortError') {
            const chunks = this._chunks2;
            const blob = new Blob(chunks, { type: 'video/x-flv' });
            this.downLoadBlob(blob);
        }
    }
    }

    abortDownLoad() {
        let controller = this._abortController2;
        let chunks = this._chunks2;
        if (controller) {
            controller.abort();
            // const blob = new Blob(chunks, { type: 'video/x-flv' });
            // this.downLoadBlob(blob);
            this._requestAbort2 = true;
        }
    }


    async processStream(reader: ReadableStreamDefaultReader): Promise<void> {
        while (true) {
            try {
                const { done, value } = await reader.read();

                const chunk = value?.buffer;
                // console.log(chunk);
                if (done) {
                    console.log('Stream complete');
                    return;
                }

                this.playerService.flvVDemuxService.dispatch(value);

               // this.playerService.fLVDemuxStream.dispatch(value);

                // Your process goes here, where you can handle each chunk of FLV data
                // For example:
                // this.processFlvChunk(value);
            } catch (e) {
                console.error('Error reading stream', e);
                return;
            }
        }
    }

    processFlvChunk(chunk: Uint8Array): void {


    }
}

export default HttpFlvStreamLoader;