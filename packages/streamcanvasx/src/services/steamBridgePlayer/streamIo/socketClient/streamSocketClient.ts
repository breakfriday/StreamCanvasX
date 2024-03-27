
import PlayerService from "../../index";

function generateUniqueID() {
    const timestamp = new Date().getTime().toString(36); // 获取时间戳并转换为36进制
    const randomString = Math.random().toString(36).substring(2, 15); // 生成随机字符串
    return timestamp + randomString;
}

interface YUVFrame {
    yData: Uint8Array;
    uData: Uint8Array;
    vData: Uint8Array;
    width: number;
    height: number;
  }

class StreamSocketClient {
    playerService: PlayerService;
    private ws: WebSocket | null = null;
    private lastMsgId = 0;
    previousTimestamp = 0;
    frameCount = 0;
    fps = 0;
    constructor() {

    }
    init(playerService: PlayerService) {
        this.playerService=playerService;
    }

    private connectSocket(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.ws) {
                resolve();
                return;
            }

            this.ws = new WebSocket(`ws://127.0.0.1:4300/data/${id}`);

            this.ws.onopen = () => resolve();
            this.ws.onerror = (event) => reject(event);
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onclose = () => {
                console.log('WebSocket closed');
                this.ws = null;
            };
        });
    }
    connect(): Promise<void> {
        let id=generateUniqueID();// 生成唯一id
        return this.connectSocket(id);
    }

    onMessage(event: MessageEvent) {
        // 接收到的数据是一个ArrayBuffer
        const data = new DataView(event.data);

        // 协议头: 固定4字节
        const header = data.getUint32(0);
        if (header !== 0xFFFFFFFF) {
            console.error('Invalid header');
            return;
        }

        // 数据类型: 1字节
        const dataType = data.getUint8(4);
        if (dataType !== 0x01) { // 0x00为音频，0x01为视频
            console.log('Not video data');
            return;
        }

        // 解析视频相关信息
        const pts = data.getBigUint64(5);
        const width = data.getUint16(13);
        const height = data.getBigUint64(15);
        const yStride = data.getUint16(23);
        const uStride = data.getUint16(25);
        const vStride = data.getUint16(27);
        const dataLength = data.getUint32(29);

        // 计算Y, U, V数据起始位置和大小
        const headerSize = 33; // 协议头到数据长度字节数的总长度
        const yDataSize = yStride * Number(height);
        const uDataSize = yDataSize / 4;
        const vDataSize = yDataSize / 4;

        const yData = new Uint8Array(event.data, headerSize, yDataSize);
        const uData = new Uint8Array(event.data, headerSize + yDataSize, uDataSize);
        const vData = new Uint8Array(event.data, headerSize + yDataSize + uDataSize, vDataSize);

        let yuvData = {

            width: Number(width),
            height: Number(height),
            yData,
            uData,
            vData
        };

        console.info(yuvData);
        this.processFrame(yuvData);
    }

    processFrame(frame: YUVFrame) {
        this.playerService.mediaRenderEngine.yuvEngine.update_yuv_texture(frame);
    }
    disConnect() {

    }
}


export default StreamSocketClient;