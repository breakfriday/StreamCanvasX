
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../player';

@injectable()
class CanvasVideoService {
    canvas_el: HTMLCanvasElement;
    canvas_context: CanvasRenderingContext2D;
    context2D: CanvasRenderingContext2D;
    playerService: PlayerService;
    constructor() {
        this.canvas_el = document.createElement('canvas');
        this._initContext2D();
        this.setCanvasSize();
    }

    init() {

    }


    setCanvasEL(el: HTMLCanvasElement) {
        this.canvas_el = document.createElement('canvas');
    }

    setCanvasSize() {
        this.canvas_el.width = 2000;
        this.canvas_el.height = 1000;
    }

    _initContext2D() {
        this.canvas_context = this.canvas_el.getContext('2d');
    }

    render(videoFrame: VideoFrame) {
        let video_width = 2000;
        let video_height = 1000;
        this.canvas_context.drawImage(videoFrame, 0, 0, video_width, video_height);
    }

    getCanvas2dEl() {
        return this.canvas_el;
    }
}


export default CanvasVideoService;