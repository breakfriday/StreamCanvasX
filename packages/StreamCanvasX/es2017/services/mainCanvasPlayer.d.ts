import { ImainPlayerService } from '../types/services/index';
declare class mainPlayerService {
    private video;
    private canvas;
    private context;
    private mpegtsPlayer;
    constructor(parmams: {
        vedio_el: HTMLVideoElement;
        canvas_el: HTMLCanvasElement;
    });
    createFlvPlayer(parms: Parameters<ImainPlayerService['createFlvPlayer']>[0]): void;
    setConfig(): void;
    load(): void;
    play(): void;
    paused(): void;
    reoload(): void;
    set_blob_url(filedata: File): void;
    analyzeCanvas(): void;
}
export default mainPlayerService;
