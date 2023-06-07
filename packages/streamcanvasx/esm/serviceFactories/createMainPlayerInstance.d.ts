import mainPlayerService from '../services/mainCanvasPlayer';
import { ImainPlayerService } from '../types/services';
declare function createMainPlayerInstance(parmams: Parameters<ImainPlayerService['factory']>[0]): mainPlayerService;
export { createMainPlayerInstance };
