
import { createPlayerServiceInstance } from './serviceFactories/createPlayerInstance';
import { createWaveVisualizationInstance } from './serviceFactories/createWaveVisualizationInstance';
import { IplayerConfig, IWavePlayerConfig, IWavePlayerExtend } from './types/services';
import { getConfig, loadMicroModule } from './loadMicroModule';

type ICreatePlayerServiceInstance = ReturnType<typeof createPlayerServiceInstance>;
type ICreateWaveVisualizationInstance = ReturnType<typeof createWaveVisualizationInstance>;

const createPlayerServicePromise = async function (parm: IplayerConfig): Promise<ICreatePlayerServiceInstance> {
    try {
        let module = await loadMicroModule();

        return module.createPlayerServiceInstance(parm);
    } catch (e) {
        console.log(' 播放器 远程微模块加载失败');
        return createPlayerServiceInstance(parm);
    }
};

const createWaveVisualizationPromise = async function (config: IWavePlayerConfig, extend: IWavePlayerExtend): Promise<ICreateWaveVisualizationInstance> {
    try {
        let module = await loadMicroModule();

        return module.createWaveVisualizationInstance(config, extend);
    } catch (e) {
        console.log(' 波形可视化 远程微模块加载失败');
        return createWaveVisualizationInstance(config, extend);
    }
};

export {
    createPlayerServiceInstance,
    createPlayerServicePromise,
    createWaveVisualizationPromise,
    createWaveVisualizationInstance,
};
