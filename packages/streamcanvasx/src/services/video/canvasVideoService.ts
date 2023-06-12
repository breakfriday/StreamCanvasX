
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../player';
class CanvasVideoService {
    canvas_el: HTMLCanvasElement;
    canvas_context: CanvasRenderingContext2D;
    context2D: CanvasRenderingContext2D;
    playerService: PlayerService;
    constructor() {

    }

    init() {

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