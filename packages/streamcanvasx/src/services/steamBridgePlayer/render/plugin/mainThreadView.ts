import PlayerService from '../../index';
import { MessageType } from '../../const';
class MainThreadCanvasView {
    playerService: PlayerService;
    isLoading: boolean
    canvas_el: HTMLCanvasElement;
    canvas_context: CanvasRenderingContext2D;
    zIndex: string
    constructor() {

    }
    init(playerService: PlayerService) {
        this.playerService=playerService;
        this.zIndex='7';
    }
    set loading(value: any) {
        this.isLoading= value;
      }
    load() {
        this.isLoading=true;
        let { contentEl } = this.playerService.config;
        let canvas_el=document.createElement("canvas");
        this.canvas_el=canvas_el;
        this.canvas_el.setAttribute('name', 'mainThreadCanvas');
        this.canvas_context=canvas_el.getContext("2d");
        this.isLoading=true;
        this.setCanvasAttributes();
        contentEl.append(canvas_el);

        this.initOffScreen();
    }
    setCanvasAttributes() {
        let { zIndex } = this;
        let { contentEl } = this.playerService.config;
        let width=contentEl.clientWidth;
        let height=contentEl.clientHeight;
        this.canvas_el.width=width;
        this.canvas_el.height=height;
        this.canvas_el.style.position="absolute";
        this.canvas_el.style.zIndex=zIndex;
        this.canvas_el.style.top="0px";
        this.canvas_el.style.left="0px";
    }
     render(bitmap: ImageBitmap) {
       this.canvas_context.drawImage(bitmap, 0, 0);
    }

    unload() {
      if(this.canvas_el) {
        this.canvas_el.remove();
        this.canvas_context=null;
        this.canvas_el=null;
      }
    }
    destroy() {
        this.unload();
    }

    initOffScreen() {
        let { width ,height } = this.playerService.mediaRenderEngine.mainThreadCanvasView.canvas_el;
        this.playerService._worker.postMessage({
            type: MessageType.INIT_WORKER_CANVAS,
            data: {
                width,height
            }
          });
    }
}

export default MainThreadCanvasView;