import { container1 } from '../container';
import { AppClass } from '../services/orignClass';
import { ServiceA } from '../services/ServiceA';


container1.bind<AppClass>(AppClass).toSelf();
container1.bind<ServiceA>(ServiceA).toSelf();


// 创建一个工厂函数来创建 createOriginSevice 实例
function createOriginServiceInstance(): AppClass {
  return container1.get<AppClass>(AppClass);
}


export default createOriginServiceInstance;
