import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';

import PlayerService from '../player';

import Decrypt from './decrypt/sm4';

@injectable()
class PreProcessing {
    player: PlayerService;
    decrypt: Decrypt;
    init(playerService: PlayerService) {
        this.player = playerService;
        if (this.player.config.crypto.enable === true) {
            this.decrypt = new Decrypt(this.player.config.crypto);
        }
    }
}


export default PreProcessing;