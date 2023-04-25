import { container1 } from '../container';
import { OriginSerivce } from '../services/orignClass';
import { ServiceA } from '../services/ServiceA';
import { TYPES } from './symbol';


container1.bind<OriginSerivce>(OriginSerivce).toSelf();
container1.bind<ServiceA>(ServiceA).toSelf();


// 创建一个工厂函数来创建 createOriginSevice 实例
function createOriginServiceInstance(): IOriginSerivce {
  return container1.get<IOriginSerivce>(OriginSerivce);
}


export default createOriginServiceInstance;
