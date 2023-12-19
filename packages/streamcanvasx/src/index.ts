
import { createPlayerServiceInstance } from './serviceFactories/createPlayerInstance';
import { IplayerConfig } from './types/services';


type ICreatePlayerServiceInstance = ReturnType<typeof createPlayerServiceInstance>;


let loadMicroModule = async function (vendorUrl: string, indexUrl: string): Promise<any> {
    try {
        // 首先加载vendor模块
        await import(/* webpackIgnore: true */ vendorUrl);

        // vendor模块加载完成后，加载index模块
        const module = await import(/* webpackIgnore: true */ indexUrl);
        return module;
    } catch (error) {
        console.error('Error loading micro module:', error);
        throw new Error('Failed to load micro module');
    }
};


const createPlayerServicePromise = async function (parm: IplayerConfig): Promise<ICreatePlayerServiceInstance> {
    let module = await loadMicroModule(
        'https://breakhappy.oss-cn-beijing.aliyuncs.com/streamcanvasx/0.1.78/index.esm.es5.production.js',
        'https://breakhappy.oss-cn-beijing.aliyuncs.com/streamcanvasx/0.1.78/index.esm.es5.production.js');

    return module.createPlayerServiceInstance(parm);
};

export {
    createPlayerServiceInstance,
    createPlayerServicePromise,
};
