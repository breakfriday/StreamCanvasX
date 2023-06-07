import { _ as _define_property } from "@swc/helpers/_/_define_property";
class httpFlvStreamLoader {
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
    async fetchStream(url) {
        let sourceUrl = url;
        let headers = new Headers();
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
            var _response_body;
            const response = await fetch(url, params);
            if (this.requestAbort === true) {
                response.body.cancel();
                return;
            }
            const reader = (_response_body = response.body) === null || _response_body === void 0 ? void 0 : _response_body.getReader();
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
                let chunk = value.value.buffer;
                if (done) {
                    console.log('Stream complete');
                    return;
                }
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
    abort() {}
    constructor(){
        _define_property(this, "_requestAbort", void 0);
        _define_property(this, "_abortController", void 0);
        this.requestAbort = false;
        this._abortController = new AbortController();
    }
}

 //# sourceMappingURL=fetch_stream_loader.js.map