import mainPlayerService from '../services/mainCanvasPlayer';
declare function createMainPlayerInstance(parmams: {
    vedio_el: HTMLVideoElement;
    canvas_el: HTMLCanvasElement;
}): mainPlayerService;
export { createMainPlayerInstance };
