import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import { addScript2 } from '../../../utils';
import PlayerService from '../../player';
import { IplayerConfig } from '../../../types/services';

@injectable()
class Decrypt {
    private _runtimeInitializedNotify: () => void;
    private _runtimeInitialized(): Promise<void> {
        return new Promise((resolve) => {
            this._runtimeInitializedNotify = resolve;
        });
    }
    private sm4Instance: any;
    player: PlayerService;
    config: IplayerConfig['crypto'];

    constructor(config: IplayerConfig['crypto']) {
        this.config = config;
        this.init();
    }


    init() {
        // this.player = playerService;
        this.beforInit();
    }

    async beforInit() {
        await addScript2('gmssl_zb/gmssl_zb.js');

        Module.onRuntimeInitialized = () => {
            this._runtimeInitializedNotify();
        };

        await this._runtimeInitialized();
    }

    createSm4() {
        let $this = this;
        let gmssl = {

            ondata: function (chunk, size) {
                const asyncProcess = async (chunk, size) => {
                    let vdata = new Uint8Array(Module.HEAPU8.buffer, chunk, size);
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

            }
        }
    }
}


export default Decrypt;