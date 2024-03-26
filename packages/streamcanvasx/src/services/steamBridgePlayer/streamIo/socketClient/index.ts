
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
            await this.play();
        }catch(e) {

        }
    }

    createPlayer() {

    }
    async play() {
        try{
            await this.signalClient.callMethd("createPlayer",[]);
            await this.signalClient.callMethd("play",[]);
        }catch(e) {

        }
    }
}

export default SocketClient;