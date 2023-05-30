import { ImainPlayerService } from '../types/services/index';
declare class mainPlayerService {
    private video;
    private canvas;
    private context;
    private mpegtsPlayer;
    private root_el;
    private aspectRatio;
    private metadata;
    private config;
    constructor(parmams: Parameters<ImainPlayerService['factory']>[0]);
    get _vedio(): HTMLVideoElement;
    createFlvPlayer(parms: Parameters<ImainPlayerService['createFlvPlayer']>[0]): void;
    setConfig(params: Parameters<ImainPlayerService['setConfig']>[0]): void;
    load(): void;
    play(): void;
    paused(): void;
    reoload(): void;
    set_blob_url(filedata: File): void;
    vedioEvents(): void;
    getVideoSize(): void;
    loadMediaEvent(): void;
    setVideoSize(): void;
    renderByWebGpu(): Promise<void>;
    analyzeCanvas(): void;
}
export default mainPlayerService;
