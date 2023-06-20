import { container1 } from '../container';
import mainPlayerService from '../services/mainCanvasPlayer';
import { TYPES } from './symbol';
container1.bind(TYPES.IMainPlayerService).toFactory((context) => {
    return function (parmams) {
        let instance = new mainPlayerService(parmams);
        return instance;
    };
});
function createMainPlayerInstance(parmams) {
    //    const MainPlayer=
    let MainPlayerFactory = container1.get(TYPES.IMainPlayerService);
    let instance = MainPlayerFactory(parmams);
    return instance;
}
export { createMainPlayerInstance };

 // # sourceMappingURL=createMainPlayerInstance.js.map