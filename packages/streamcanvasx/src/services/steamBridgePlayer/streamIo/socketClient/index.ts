
import PlayerService from '../../index';
import SignalClient from './signalClient';

class SocketClient {
    playerService: PlayerService;
    signalClient: SignalClient
    constructor() {
        this.signalClient=new SignalClient();
    }
    init(playerService: PlayerService) {
        this.playerService=playerService;
        this.signalClient.init(this.playerService);
    }
    async open() {
        try{
            await this.signalClient.connect();
            console.log("signalClient 连接成功");
            await this.play();
        }catch(e) {

        }
    }

    createPlayer() {

    }
    async play() {
        let { url } = this.playerService.config;
        try{
            await this.signalClient.callMethd("createPlayer",[url,5,0,1,1]);
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