
import { createPlayerServiceInstance } from './serviceFactories/createPlayerInstance';
import { IplayerConfig } from './types/services';
import { getConfig, loadMicroModule } from './loadMicroModule';

type ICreatePlayerServiceInstance = ReturnType<typeof createPlayerServiceInstance>;


const createPlayerServicePromise = async function (parm: IplayerConfig): Promise<ICreatePlayerServiceInstance> {
    let module = await loadMicroModule();

    return module.createPlayerServiceInstance(parm);
};

export {
    createPlayerServiceInstance,
    createPlayerServicePromise,
};
