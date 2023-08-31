import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { injectable } from 'inversify';
import CodecParser from 'codec-parser';
let HttpFlvStreamLoader = // import CodecParser from '../decoder/CodecParser/index';
class HttpFlvStreamLoader {
    initAudioPlayer() {
        const mimeType = 'audio/aac';
        const options = {
            onCodec: ()=>{},
            onCodecUpdate: ()=>{},
            enableLogging: true
        };
        this.streamParser = new CodecParser(mimeType, options);
    }
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
    async fetchStream() {
        let { url  } = this.playerService.config;
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
    downLoadBlob(blob) {
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
        const { signal  } = controller;
        let { url  } = this;
        let tempUrl = new URL(url);
        let downUrl = `${location.protocol}//${tempUrl.host}${tempUrl.pathname}`;
        this._requestAbort2 = false;
        let requestAbort = this._requestAbort2;
        const downloadBlob = (blob)=>{
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
            const response = await fetch(downUrl, {
                signal
            });
            // if (requestAbort === true) {
            //     response.body.cancel();
            //     return;
            // }
            const stream = response.body;
            const reader = stream === null || stream === void 0 ? void 0 : stream.getReader();
            const chunks = this._chunks2 = [];
            if (reader) {
                while(true){
                    const { value , done  } = await reader.read();
                    if (done || requestAbort) {
                        break;
                    }
                    chunks.push(value);
                }
            }
        } catch (e) {
            if (e.name === 'AbortError') {
                const chunks = this._chunks2;
                const blob = new Blob(chunks, {
                    type: 'video/x-flv'
                });
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
    // async processStream(reader: ReadableStreamDefaultReader): Promise<void> {
    //     while (true) {
    //         try {
    //             const { done, value } = await reader.read();
    //             const chunk = value?.buffer;
    //             // console.log(chunk);
    //             if (done) {
    //                 console.log('Stream complete');
    //                 return;
    //             }
    //             this.playerService.flvVDemuxService.dispatch(value);
    //            // this.playerService.fLVDemuxStream.dispatch(value);
    //             // Your process goes here, where you can handle each chunk of FLV data
    //             // For example:
    //             // this.processFlvChunk(value);
    //         } catch (e) {
    //             console.error('Error reading stream', e);
    //             return;
    //         }
    //     }
    // }
    async processStream(reader) {
        if (!window.pp) {
            await this.playerService.mseDecoderService.start();
            window.pp = true;
        }
        while(true){
            try {
                const { done , value  } = await reader.read();
                const chunk = value === null || value === void 0 ? void 0 : value.buffer;
                // console.log(chunk);
                if (done) {
                    console.log('Stream complete');
                    return;
                }
                let { streamParser  } = this;
                let frames = [
                    ...streamParser.parseChunk(value)
                ];
                await this.playerService.mseDecoderService.onstream(frames);
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
        _define_property(this, "_abortController2", void 0);
        _define_property(this, "_requestAbort2", void 0);
        _define_property(this, "_chunks2", void 0);
        _define_property(this, "playerService", void 0);
        _define_property(this, "url", void 0);
        _define_property(this, "downLoadConfig", void 0);
        _define_property(this, "streamParser", void 0);
        _define_property(this, "maxHeartTimes", void 0);
        _define_property(this, "hertTime", void 0);
        this.requestAbort = false;
        this.hertTime = 0;
        this.maxHeartTimes = 10;
        this.initAudioPlayer();
    // this.playerService = playerService;
    }
};
HttpFlvStreamLoader = _ts_decorate([
    injectable()
], HttpFlvStreamLoader);
export default HttpFlvStreamLoader;
