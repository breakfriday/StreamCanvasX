import { ImainPlayerService } from '../types/services/index';
declare class mainPlayerService {
    private video;
    private canvas;
    private context;
    private mpegtsPlayer;
    private root_el;
    private aspectRatio;
    constructor(parmams: {
        canvas_el: HTMLCanvasElement;
        root_el: HTMLElement;
    });
    get _vedio(): HTMLVideoElement;
    createFlvPlayer(parms: Parameters<ImainPlayerService['createFlvPlayer']>[0]): void;
    setConfig(): void;
    load(): void;
    play(): void;
    paused(): void;
    reoload(): void;
    set_blob_url(filedata: File): void;
    vedioEvents(): void;
    loadMediaEvent(): void;
    setVideoSize(): void;
    analyzeCanvas(): void;
}
export default mainPlayerService;
