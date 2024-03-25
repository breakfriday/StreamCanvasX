import PlayerService from '../index';
class FetchLoader {
    playerService: PlayerService;
    private _abortController: AbortController;
    constructor() {

    }
    get abortController() {
        return this._abortController;
    }
    init(playerService: PlayerService) {
        this.playerService=playerService;
    }
    open() {
        this.fetch_io();
    }

    async fetch_io() {
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
    }
    abort() {

    }
    detroy() {

    }
    process() {

    }
}

export default FetchLoader;