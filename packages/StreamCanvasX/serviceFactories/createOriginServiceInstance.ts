import { container1 } from '../container';
import { OriginSerivce } from '../services/orignClass';
import { ServiceA } from '../services/ServiceA';
import { TYPES } from './symbol';
import { IOriginSerivce, IServiceA } from '../types/services';


container1.bind<IOriginSerivce>(TYPES.IOriginSerivce).to(OriginSerivce);
// container1.bind<IOriginSerivce>(OriginSerivce).toSelf();
// container1.bind<IServiceA>(ServiceA).toSelf();


container1.bind<IServiceA>(TYPES.IServiceA).to(ServiceA);


// 创建一个工厂函数来创建 createOriginSevice 实例
function createOriginServiceInstance(): IOriginSerivce {
  return container1.get<IOriginSerivce>(TYPES.IOriginSerivce);
}


export default createOriginServiceInstance;
