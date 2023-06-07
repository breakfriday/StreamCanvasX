class FetchStreamLoader {
    private _requestAbort: boolean;
    constructor() {
        this.requestAbort = false;
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


    async fetchStream(url: string) {
        let headers = new Headers();
        let params: RequestInit = {
            method: 'GET',
            mode: 'cors', // cors is enabled by default
            credentials: 'same-origin', // withCredentials is disabled by default
            headers: headers,
            cache: 'default',
            referrerPolicy: 'no-referrer-when-downgrade',

        };
        fetch(url, params).then(response => {

          });

        try {
            let res = await fetch(url, params);
        } catch (e) {

        }
    }

    abort() {

    }
}