
import RuleEngine from './ruleEngine';
let fetchConfig = async function () {
    const response = await fetch('https://breakhappy.oss-cn-beijing.aliyuncs.com/streamcanvasx/config/diamondConfig.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
};

const getConfig = async () => {
    let config: RuleEngineConfig = await fetchConfig();
    let { data } = config;


    const engine = new RuleEngine(config);
    const dataId = engine.evaluate({ currentDomain: location.href });
    const selectData = data.find((it) => {
        return it.id === dataId;
    });

   let verison = selectData.version;

   let resouce = config.resources.find((v) => {
    return v.version === verison;
   });
   return resouce.data;
};


let loadMicroModule = async function (): Promise<any> {
    let resouce_url = await getConfig();
    let vendorUrl = resouce_url[0];
    let indexUrl = resouce_url[1];

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

export { getConfig, loadMicroModule };