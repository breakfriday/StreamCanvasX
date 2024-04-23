
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import PlayerService from '../index';
import PCMPlayer from './audioContextPlayer';
import { PCMBufferItem, IAduioContextPlayerConfig } from '../../../types/services';

@injectable()
class AudioPlayer {
    playerService: PlayerService
    pcmPlayer: PCMPlayer
    constructor() {

    }
    init(playerService: PlayerService) {
        this.playerService=playerService;
    }

    createplayer(config: IAduioContextPlayerConfig) {
        this.pcmPlayer=new PCMPlayer();
        this.pcmPlayer.init(config,this.playerService);
    }
    feed(pcmData: Float32Array) {
        this.pcmPlayer.feedPCMDataBeta(pcmData);
    }
    destroy() {
        this.pcmPlayer.destroy();
    }
    mute(parm: boolean) {
        this.pcmPlayer.mute(parm);
    }
    setGain(value: number) {
        this.pcmPlayer.setGain(value);
    }
}


export default AudioPlayer;