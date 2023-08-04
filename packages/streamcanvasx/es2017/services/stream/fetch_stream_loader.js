import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { injectable } from 'inversify';
let HttpFlvStreamLoader = class HttpFlvStreamLoader {
    static isSupported() {
        if (window.fetch && window.ReadableStream) {
            return true;
        } else {
            console.log('Fetch and Stream API are not supported');
            return false;
        }
    }
    get requestAbort() {
        return this._requestAbort;
    }
    set requestAbort(value) {
        this._requestAbort = value;
    }
    get abortController() {
        return this._abortController;
    }
    init(playerService, url) {
        this.playerService = playerService;
        this.url = url;
    }
    async fetchStream(url) {
        let sourceUrl = url;
        let headers = new Headers();
        this._abortController = new AbortController();
        let params = {
            method: 'GET',
            mode: 'cors',
            credentials: 'same-origin',
            headers: headers,
            cache: 'default',
            referrerPolicy: 'no-referrer-when-downgrade',
            signal: this.abortController.signal
        };
        try {
            const response = await fetch(url, params);
            if (this.requestAbort === true) {
                response.body.cancel();
                return;
            }
            // fetch API 的 Response 对象的 body 属性是一个 ReadableStream 流。
            const stream = response.body;
            const reader = stream === null || stream === void 0 ? void 0 : stream.getReader();
            if (reader) {
                await this.processStream(reader);
            }
        } catch (e) {}
    }
    abortFetch() {
        this.abortController.abort();
    }
    async processStream(reader) {
        while(true){
            try {
                const { done , value  } = await reader.read();
                const chunk = value === null || value === void 0 ? void 0 : value.buffer;
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
    processFlvChunk(chunk) {}
    constructor(){
        _define_property(this, "_requestAbort", void 0);
        _define_property(this, "_abortController", void 0);
        _define_property(this, "playerService", void 0);
        _define_property(this, "url", void 0);
        this.requestAbort = false;
    // this.playerService = playerService;
    }
};
HttpFlvStreamLoader = _ts_decorate([
    injectable()
], HttpFlvStreamLoader);
export default HttpFlvStreamLoader;
