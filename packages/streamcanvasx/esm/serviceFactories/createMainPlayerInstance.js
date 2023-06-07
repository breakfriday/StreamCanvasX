import { container1 } from "../container";
import mainPlayerService from "../services/mainCanvasPlayer";
import { TYPES } from "./symbol";
container1.bind(TYPES.IMainPlayerService).toFactory(function(context) {
    return function(parmams) {
        var instance = new mainPlayerService(parmams);
        return instance;
    };
});
function createMainPlayerInstance(parmams) {
    //    const MainPlayer=
    var MainPlayerFactory = container1.get(TYPES.IMainPlayerService);
    var instance = MainPlayerFactory(parmams);
    return instance;
}
export { createMainPlayerInstance };

 //# sourceMappingURL=createMainPlayerInstance.js.map