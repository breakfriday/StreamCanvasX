import SocketClient from './index';
import { MessageType } from '../../const';
class StreamWorker {
    socketClient: SocketClient
    static getInstance() {
        if (!StreamWorker.instance) {
            StreamWorker.instance = new StreamWorker();
        }
        return StreamWorker.instance;
    }

    constructor() {

    }
    render() {

    }

    onMessage(event: MessageEvent<any>) {
        let { type,data } =event.data;


        switch (type) {
            case MessageType.RENDER_FRAME:

                break;
            case MessageType.INIT_WORKER_CANVAS:

                break;
            case MessageType.INIT_CONFIG:

                   break;
            case MessageType.OPEN_SOCKET:

                    break;
            case MessageType.RELOAD:

                    break;
            default:
             break;
            // Add more cases here as needed
        }

        // if(type==MessageType.RENDER_FRAME) {
        //     this.parseData(data);
        // }else{

        // }
    }
}


const instance = StreamWorker.getInstance();

// // 监听来自主线程的消息
self.addEventListener('message', (event) => {
    // 更新数据或处理其他任务

    instance.onMessage(event);

    // postMessage(`Data updated to: ${instance.getData()}`);
});