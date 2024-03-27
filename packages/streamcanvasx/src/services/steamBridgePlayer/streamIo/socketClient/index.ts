
import PlayerService from '../../index';
import SignalClient from './signalClient';
import StreamSocketClient from './streamSocketClient';

class SocketClient {
    playerService: PlayerService;
    signalClient: SignalClient;
    streamSocketClient: StreamSocketClient
    constructor() {
        this.signalClient=new SignalClient();
        this.streamSocketClient=new StreamSocketClient();
    }
    init(playerService: PlayerService) {
        this.playerService=playerService;
        this.signalClient.init(this.playerService);
        this.streamSocketClient.init(this.playerService);
    }
    async open() {
        try{
            await this.signalClient.connect();
            console.log("signalClient 连接成功");
            await this.play();
        }catch(e) {

        }

        try{
            await this.streamSocketClient.connect();
            console.log("dataClient 连接成功");
        }catch(e) {
            return false;
        }
    }

    async createPlayer() {
        let { url } = this.playerService.config;
        try{
            await this.signalClient.callMethd("createPlayer",[url,5,0,1,1]);
            await this.signalClient.callMethd("play",[]);
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
}

export default SocketClient;