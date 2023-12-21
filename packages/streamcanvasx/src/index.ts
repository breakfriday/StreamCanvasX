
import { createPlayerServiceInstance } from './serviceFactories/createPlayerInstance';
import { IplayerConfig } from './types/services';
import { getConfig, loadMicroModule } from './loadMicroModule';

type ICreatePlayerServiceInstance = ReturnType<typeof createPlayerServiceInstance>;


const createPlayerServicePromise = async function (parm: IplayerConfig): Promise<ICreatePlayerServiceInstance> {
    try {
        let module = await loadMicroModule();

        return module.createPlayerServiceInstance(parm);
    } catch (e) {
        console.log(' 播放器 远程微模块加载失败');
        return createPlayerServiceInstance(parm);
    }
};

export {
    createPlayerServiceInstance,
    createPlayerServicePromise,
};
