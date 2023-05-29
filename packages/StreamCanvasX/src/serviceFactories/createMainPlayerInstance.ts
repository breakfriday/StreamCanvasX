import { container1 } from '../container';
import AudioProcessingService from '../services/audioProcessingService';
import mainPlayerService from '../services/mainCanvasPlayer';
import { TYPES } from './symbol';
import { IAudioProcessingService } from '../types/services';
import { interfaces } from 'inversify';


container1.bind<interfaces.Factory<mainPlayerService>>(TYPES.IMainPlayerService)
.toFactory<mainPlayerService>((context) => {
    return (parmams: { vedio_el: HTMLVideoElement; canvas_el: HTMLCanvasElement; root_el: HTMLElement}) => {
        let instance = new mainPlayerService(parmams);
        return instance;
    };
});


function createMainPlayerInstance(parmams: { canvas_el: HTMLCanvasElement; root_el: HTMLElement}) {
//    const MainPlayer=
  const MainPlayerFactory: (parmams: { canvas_el: HTMLCanvasElement; root_el: HTMLElement}) => mainPlayerService = container1.get<interfaces.Factory<mainPlayerService>>(TYPES.IMainPlayerService);
  let instance = MainPlayerFactory(parmams);
  return instance;
}

export { createMainPlayerInstance };