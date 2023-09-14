import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import { addScript2 } from '../../../utils';
import PlayerService from '../../player';
import { IplayerConfig } from '../../../types/services';
import PreProcessing from '..';

@injectable()
class Decrypt {
    private _runtimeInitializationPromise: Promise<void> | null = null;
    private _runtimeInitializedNotify: () => void;
    private _runtimeInitialized(): Promise<void> {
        if (!this._runtimeInitializationPromise) {
            this._runtimeInitializationPromise = new Promise((resolve) => {
                this._runtimeInitializedNotify = resolve;
            });
        }
        return this._runtimeInitializationPromise;
    }
    private sm4Instance: any;
    player: PlayerService;
    config: IplayerConfig['crypto'];
    preProcessing: PreProcessing;


    constructor(config: IplayerConfig['crypto'], preProcessingService) {
        this.config = config;
        this.init();
        this.preProcessing = preProcessingService;
    }


    init() {
        // this.player = playerService;
        this.beforInit();
    }

    async beforInit() {
        if (this.config.useWasm === true) {
            if (window.gmssl_zb_install === true) {
                setTimeout(() => {
                this._runtimeInitializedNotify();
                }, 400);
            } else {
                await addScript2('gmssl_zb/gmssl_zb.js');
                Module.onRuntimeInitialized = () => {
                    debugger;
                    window.gmssl_zb_install = true;
                    this._runtimeInitializedNotify();
                };
            }

            await this._runtimeInitialized();
        }


        this.createSm4();
    }

    createSm4() {
        let $this = this;
        let gmssl = {

            ondata: function (chunk: number, size: number) {
                const asyncProcess = async (chunk: number, size: number) => {
                    let vdata = new Uint8Array(Module.HEAPU8.buffer, chunk, size);


                    let frames = [...$this.preProcessing.streamParser.parseChunk(vdata)];

                    $this.preProcessing.player.mseDecoderService.onstream(frames);
                };

                asyncProcess(chunk, size);


                // const pdata = Uint8Array.from(Module.HEAPU8.subarray(chunk, chunk + size));
            },

            onend: function () {

            },
        };


        this.sm4Instance = new Module.GmsslZb(gmssl);
    }


   async processStream(reader: ReadableStreamDefaultReader) {
        let $this = this;
        let remainingBytes = new Uint8Array(0); // Buffer for bytes that overflow the current chunk
        let isFirstChunk = true;

        debugger;
        await this._runtimeInitialized();

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
                      //  let firstChunk = concatenated.subarray(0, 160);

                        let firstChunk = new Uint8Array(concatenated.buffer.slice(0, 160));


                        // remainingBytes = concatenated.subarray(160);

                        remainingBytes = new Uint8Array(concatenated.buffer.slice(160));

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
                    // let chunk = remainingBytes.subarray(0, maxMultipleOf16);
                    let chunkToDecode = remainingBytes.buffer.slice(0, maxMultipleOf16);
                    this.sm4Instance.decode(chunkToDecode);
                    // remainingBytes = remainingBytes.subarray(maxMultipleOf16);
                    remainingBytes = new Uint8Array(remainingBytes.buffer.slice(maxMultipleOf16));
                }
            } catch (e) {
                console.error('Error reading stream', e);
                return;
            }
        }
    }
}


export default Decrypt;