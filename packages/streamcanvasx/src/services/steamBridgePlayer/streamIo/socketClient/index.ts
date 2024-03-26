
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
    }
}

export default SocketClient;