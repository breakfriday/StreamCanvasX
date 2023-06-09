class HttpFlvStreamLoader {
    private _requestAbort: boolean;
    private _abortController: AbortController;
    constructor(player) {
        this.requestAbort = false;
        this.player = player;
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


    async fetchStream(url: string): Promise<void> {
        let sourceUrl = url;
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

            const reader = response.body?.getReader();
            if (reader) {
                await this.processStream(reader);
            }
        } catch (e) {

        }
    }

    abortFetch(): void {
        this.abortController.abort();
    }


    async processStream(reader: ReadableStreamDefaultReader): Promise<void> {
        while (true) {
            try {
                const { done, value } = await reader.read();

                const chunk = value?.buffer;
                console.log(chunk);
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

    processFlvChunk(chunk: Uint8Array): void {


    }
}

export { HttpFlvStreamLoader };