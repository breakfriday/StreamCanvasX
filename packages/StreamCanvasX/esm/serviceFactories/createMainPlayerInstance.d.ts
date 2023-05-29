import mainPlayerService from '../services/mainCanvasPlayer';
declare function createMainPlayerInstance(parmams: {
    canvas_el: HTMLCanvasElement;
    root_el: HTMLElement;
}): mainPlayerService;
export { createMainPlayerInstance };
