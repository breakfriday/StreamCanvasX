
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../player';
class CanvasVideoService {
    canvas_el: HTMLCanvasElement;
    canvas_context: CanvasRenderingContext2D;
    context2D: CanvasRenderingContext2D;
    playerService: PlayerService;
    constructor() {
        this.canvas_el = document.createElement('canvas');
        this.init();
    }

    init() {
        this._initContext2D();
    }

    getTarget() {
        return this.canvas_el;
    }


    setCanvasSize() {
        this.canvas_el.width = 400;
        this.canvas_el.height = 400;
    }

    _initContext2D() {
        this.canvas_context = this.canvas_el.getContext('2d');
    }

    render(videoFrame: VideoFrame) {
        let video_width = 400;
        let video_height = 400;
        this.canvas_context.drawImage(videoFrame, 0, 0, video_width, video_height);
    }
}


export default CanvasVideoService;