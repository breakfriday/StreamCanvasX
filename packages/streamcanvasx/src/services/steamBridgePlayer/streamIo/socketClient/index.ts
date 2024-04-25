
import PlayerService from '../../index';
import SignalClient from './signalClient';
import StreamSocketClient from './streamSocketClient';


function generateUniqueId() {
    const now = Date.now();

    const maxInt = 900;

    // 生成一个0到最大安全整数之间的随机整数
    const randomInt = Math.floor(Math.random() * maxInt);


    // const random = Math.floor(Math.random()* in);

    const uniqueId = randomInt;

    return uniqueId;
}

class SocketClient {
    playerService: PlayerService;
    signalClient: SignalClient;
    streamSocketClient: StreamSocketClient;
    clientId: number
    constructor() {
        this.signalClient=new SignalClient();
        this.streamSocketClient=new StreamSocketClient();
    }
    init(playerService: PlayerService) {
        this.clientId=generateUniqueId();
        this.playerService=playerService;
        this.signalClient.init(this.playerService,this.clientId);
        this.streamSocketClient.init(this.playerService,this.clientId);
    }
    async open() {
        // try{
        //     await this.signalClient.connect();
        //     console.log("signalClient 连接成功");
        //     await this.createPlayer();
        // }catch(e) {

        // }

        // try{
        //     await this.streamSocketClient.connect();
        //     console.log("dataClient 连接成功");
        // }catch(e) {
        //     return false;
        // }

        try {
            await Promise.all([this.signalClient.connect(),this.streamSocketClient.connect()]);
            console.log("signalClient 连接成功");
            console.log("dataClient 连接成功");
            await this.createPlayer();
        }catch(e) {
            console.error("ws client 连接失败");
        }
    }

    async createPlayer() {
        let { url } = this.playerService.config;

        try{
            await this.signalClient.callMethd("createPlayer",[url,5,0,1,0]);
            await this.signalClient.callMethd("play",[]);

            debugger;

            let info=await this.signalClient.getStreamInfo();
            debugger;
        }catch(e) {

        }
    }
    async reload() {
        if(!this.signalClient.ws) {
           await this.signalClient.connect();
        }
        if(!this.streamSocketClient.ws) {
           await this.streamSocketClient.connect();
        }
        try{
            await this.signalClient.callMethd("stop",[]);
            debugger;
            this.createPlayer();
            debugger;
        }catch(e) {

        }
    }
    async play() {
        let { url } = this.playerService.config;
        try{
            await this.signalClient.callMethd("play",[]);
        }catch(e) {

        }
    }

    async abort() {
        try{
            await this.signalClient.callMethd("stop",[]);
        }catch(e) {

        }
    }

    destroy() {
        this.signalClient.destroy();
        this.streamSocketClient.destroy();
    }
}

export default SocketClient;