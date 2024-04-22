
import { createPlayerServiceInstance } from './serviceFactories/createPlayerInstance';
import { createWaveVisualizationInstance } from './serviceFactories/createWaveVisualizationInstance';
import { IplayerConfig, IWavePlayerConfig, IWavePlayerExtend } from './types/services';
import { getConfig, loadMicroModule } from './loadMicroModule';
import { createStreamBridgePlayerInstance } from './serviceFactories/createStreamBridgePlayerInstance';

type ICreatePlayerServiceInstance = ReturnType<typeof createPlayerServiceInstance>;
type ICreateWaveVisualizationInstance = ReturnType<typeof createWaveVisualizationInstance>;


function extractDeviceId(url: string) {
    // 使用 URL 物件解析傳入的 URL
    const parsedUrl = new URL(url);

    // 獲得路徑部分
    const { pathname } = parsedUrl;

    // 分割路徑以取得各部分，假設ID總是在 .live.flv 前面
    const parts = pathname.split('/');

    // 提取包含ID的部分，這裡假設ID總是最後一部分的第一段（去除.live.flv）
    const lastPart = parts[parts.length - 1];
    const id = lastPart.split('.')[0];

    return id;
  }


const createPlayerServicePromise = async function (parm: IplayerConfig): Promise<ICreatePlayerServiceInstance> {
    try {
        let module = await loadMicroModule();

        if(window.yuv===true) {
            let { url } = parm;
             let deviceId=extractDeviceId(url);
            let rtspUrl=`rtsp://120.26.38.129:42022/rtp/${deviceId}`;
            parm.rtspUrl=rtspUrl;
            return module.createStreamBridgePlayerInstance(parm);
        }else{
            return module.createPlayerServiceInstance(parm);
        }
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
