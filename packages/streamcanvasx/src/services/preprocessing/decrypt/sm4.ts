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


    streamOn() {

    }
}


export default Decrypt;