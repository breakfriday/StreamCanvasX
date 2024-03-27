
import PlayerService from "../../index";

type PlayerParams = {
    url: string;
    timeout: number;
    playerType: number;
    transportType: number;
    hardDecode: number;
};

type ApiResponse = {
    type: string;
    msgId: string|number;
    timestamp: number;
    method: string;
    code: number;
    message: string;
    data: any[];
};

type ApirParams = {
    type: string;
    method: string;
    params: [];
};

class SignalClient {
    private ws: WebSocket | null = null;
    private wsUrl: string;
    private responseMap = new Map<number|string, (response: any) => void>(); // 使用responseMap来存储每个msgId对应的解析函数
    playerService: PlayerService

    constructor() {

    }

    init(playerService: PlayerService) {
        this.playerService=playerService;
        let { url } = this.playerService.config;
        this.wsUrl=url;
     }


    private connectSocket(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.ws) {
                resolve();
                return;
            }

            this.ws = new WebSocket(`${this.wsUrl}/signal/${id}`);

            this.ws.onopen = () => resolve();
            this.ws.onerror = (event) => reject(event);
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onclose = () => {
                console.log('WebSocket closed');
                this.ws = null;
            };
        });
    }

    connect(id: string): Promise<void> {
        return this.connectSocket(id);
    }

    handleMessage(event: MessageEvent) {
        const response: ApiResponse = JSON.parse(event.data);
        const resolve = this.responseMap.get(response.msgId);

        if (resolve) {
            resolve(response);
            this.responseMap.delete(response.msgId);
        }
    }

    private onMessage(event: MessageEvent): void {
        const message: ApiResponse = JSON.parse(event.data);

        // 处理不同类型的消息（例如，api响应，回调）
        switch (message.type) {
            case 'api':
                 this.handleMessage(event);
                break;
            case 'callback':
                this.handleCallback(message);
                break;
            default:
                console.error('未知的消息类型', message.type);
        }
    }


    private handleCallback(callback: ApiResponse): void {
        // 实现回调处理逻辑
        console.log('回调:', callback);
    }

    private onError(event: Event): void {
        console.error('WebSocket 错误:', event);
    }


    send(method: string, params: any[] = []): void {
        if (!this.ws) {
            console.error('WebSocket 未连接');
            return;
        }

        const message = {
            msgId: this.generateMsgId(),
            timestamp: Date.now(),
            method,
            params,
        };

        this.ws.send(JSON.stringify(message));
    }

    callMethd(method: string,params: ApirParams) {
        if (!this.ws) {
            console.error('WebSocket 未连接');
            return;
        }
    }

    private generateMsgId(): string {
        return Math.random().toString(36).substring(2, 15);
    }

    createPlayer(params: PlayerParams): void {
        this.send('createPlayer', [params.url, params.timeout, params.playerType, params.transportType, params.hardDecode]);
    }

    play(): void {
        this.send('play');
    }

    stop(): void {
        this.send('stop');
    }

    setNsLevel(level: number): void {
        this.send('setNsLevel', [level]);
    }
}

export default SignalClient;
// 使用
// const mediaPlayerWS = new MediaPlayerWS('ws://127.0.0.1:端口');
// mediaPlayerWS.connect('playerId');
// 继续执行创建播放器、播放、停止等操作
