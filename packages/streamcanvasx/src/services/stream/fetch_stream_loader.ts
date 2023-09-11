import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../player';
import { TYPES } from '../../serviceFactories/symbol';

import CodecParser from 'codec-parser';
import Sm4js from 'sm4js';

import { addScript, addScript2 } from '../../utils';


// import CodecParser from '../decoder/CodecParser/index';
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
    private streamParser: CodecParser;

    private _runtimeInitializedNotify: () => void;
    private _runtimeInitialized(): Promise<void> {
        return new Promise((resolve) => {
            this._runtimeInitializedNotify = resolve;
        });
    }


    private _initAlldNotify: () => void;
    private _initAll(): Promise<void> {
        return new Promise((resolve) => {
            this._initAlldNotify = resolve;
        });
    }

    private sm4Instance: any;

    private wasminit: boolean;


    private bufferLength: number; // 初始缓冲区长度

    maxHeartTimes: number;
    hertTime: number;
    constructor(
        // @inject(new LazyServiceIdentifer(() => TYPES.IPlayerService)) playerService: PlayerService,

        // @inject(new LazyServiceIdentifer(() => TYPES.IPlayerService)) playerService: PlayerService,

    ) {
        this.requestAbort = false;
        this.hertTime = 0;
        this.maxHeartTimes = 10;
        this.wasminit = false;
        this.bufferLength = 160;


        this.beforInit();


        // this.playerService = playerService;
    }
    async beforInit() {
        await addScript2('gmssl_zb/gmssl_zb.js');

        Module.onRuntimeInitialized = () => {
            this._runtimeInitializedNotify();
        };


        await this._runtimeInitialized();


        this.createSm4();


        this.initAudioPlayer();


        this._initAlldNotify();
    }

    createSm4() {
        let $this = this;
        let gmssl = {

            ondata: function (chunk, size) {
                const asyncProcess = async (chunk, size) => {
                    let vdata = new Uint8Array(Module.HEAPU8.buffer, chunk, size);


                    let frames = [...$this.streamParser.parseChunk(vdata)];


                    try {
                          $this.playerService.mseDecoderService.onstream(frames);
                    } catch (e) {
                        debugger;
                    }
                };

                asyncProcess(chunk, size);


                // const pdata = Uint8Array.from(Module.HEAPU8.subarray(chunk, chunk + size));
            },

            onend: function () {
                console.log('------------222222222222222-------------------------');
            },
        };


        this.sm4Instance = new Module.GmsslZb(gmssl);
    }
    initAudioPlayer() {
            const mimeType = 'audio/aac';
                const options = {
                onCodec: () => {},
                onCodecUpdate: () => {},
                enableLogging: true,
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

   bufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
   }

   base64tobuffer(base64: any) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
   }

    concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
        let totalLength = 0;
        for (const arr of arrays) {
            totalLength += arr.length;
        }

        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
        }

        return result;
    }


    bufferToString(buffer: ArrayBuffer) {
        let decoder = new TextDecoder('utf-8');
        return decoder.decode(buffer);
    }
    stringToUint8arry(str: string) {
        const encoder = new TextEncoder(); // TextEncoder 的默认字符集是 'utf-8'
        return encoder.encode(str);
    }

    async fetchStream2(): Promise<Uint8Array | null> {
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


        const response: Response = await fetch(url, params);
        if (this.requestAbort === true) {
            response.body?.cancel();
            return null;
        }

        const stream = response.body;
        const reader = stream?.getReader();

        if (!reader) {
            return null;
        }

        const chunks: Uint8Array[] = [];

        while (true) {
            const { value, done } = await reader.read();

            if (done) {
                break;
            }

            if (value) {
                chunks.push(value);
            }
        }

        let data = this.concatUint8Arrays(chunks);
        let startTime = performance.now();

        let dataString = this.bufferToBase64(data.buffer);


        let secondTime = performance.now();

        console.log('perforceTime-bufferToBase64', `${secondTime - startTime} milliseconds.`);


        let sm4Config = {
            key: 'JeF8U9wHFOMfs2Y8',
            mode: 'ecb',
            iv: 'UISwD9fW6cFh9SNS',
            cipherType: 'base64',
        };


        let sm4 = new Sm4js(sm4Config);

        let ciphertext = sm4.encrypt(dataString);
        let thirdTime = performance.now();

        console.log('perforceTime-sm4Encode', `${thirdTime - secondTime} milliseconds`);


        let decodeText = sm4.decrypt(ciphertext);
        let fourthTime = performance.now();
        console.log('perforceTime-sm4decode', `${fourthTime - thirdTime} milliseconds`);


         let buffer2 = this.base64tobuffer(decodeText);
         let fifthTime = performance.now();


         console.log('perforceTime-base64toBuffer', `${fifthTime - fourthTime} milliseconds`);


        return data;
    }
    async fetchStream(): Promise<void> {
        try {
         await this._initAll();
        } catch (e) {
            console.error('error ');
        }

        debugger;
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
                debugger;
                return;
            }

            // fetch API 的 Response 对象的 body 属性是一个 ReadableStream 流。
            const stream = response.body;
            const reader = stream?.getReader();
            if (reader) {
                debugger;
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


    async processStream(reader: ReadableStreamDefaultReader): Promise<void> {
        if (!window.pp) {
           await this.playerService.mseDecoderService.start();

            window.pp = true;
        }
        let $this = this;

        let buffer16 = new Uint8Array(this.bufferLength); // 预设一个大小为16字节的buffer 用来解密
        let offset = 0;
        let { streamParser } = this;


        let remainingBytes = new Uint8Array(0); // Buffer for bytes that overflow the current chunk
        let isFirstChunk = true;
        while (true) {
            try {
                const { done, value } = await reader.read();


                const chunk = value?.buffer;
                // console.log(chunk);
                if (done) {
                    console.log('Stream complete');

                    return;
                }

                let concatenated = new Uint8Array(remainingBytes.length + value.length);
                concatenated.set(remainingBytes);
                concatenated.set(value, remainingBytes.length);

                if (isFirstChunk) {
                    if (concatenated.length >= 160) {
                        let firstChunk = concatenated.subarray(0, 160);


                        remainingBytes = concatenated.subarray(160);
                        debugger;
                        $this.sm4Instance.init(firstChunk, 'ideteck_chenxuejian_test');
                        isFirstChunk = false;
                    } else {
                        remainingBytes = concatenated; // If the chunk is smaller than 160 bytes, store and continue
                        continue;
                    }
                } else {
                    remainingBytes = concatenated;
                }

                const maxMultipleOf16 = Math.floor(remainingBytes.length / 16) * 16;


                if (maxMultipleOf16 > 0) {
                    let chunk = remainingBytes.subarray(0, maxMultipleOf16);
                    debugger;
                    this.sm4Instance.decode(chunk);
                    remainingBytes = remainingBytes.subarray(maxMultipleOf16);

                    debugger;
                }


                // if ($this.wasminit === false) {
                //     if(value.le)

                // }


                // for (let byte of value) {
                //     buffer16[offset] = byte;
                //     offset++;

                //     if (offset === this.bufferLength) {
                //         // decrypt(buffer); // 当我们有16字节时，传递给解密函数

                //         if ($this.wasminit === false) {
                //             $this.sm4Instance.init(buffer16.buffer, 'ideteck_chenxuejian_test');
                //             $this.wasminit = true;
                //             this.bufferLength = 16 * 1000;
                //         } else {
                //             if (window.ppp <= 3000) {
                //                 $this.sm4Instance.decode(buffer16.buffer);
                //                 window.ppp++;
                //             }
                //         }


                //         buffer16 = new Uint8Array(this.buferLength);f


                //         offset = 0;
                //     }
                // }


                // let frames = [...streamParser.parseChunk(value)];


                // await this.playerService.mseDecoderService.onstream(frames);
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