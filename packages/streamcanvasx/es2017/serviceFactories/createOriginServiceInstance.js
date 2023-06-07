import { container1 } from '../container';
import { OriginSerivce } from '../services/orignClass';
import { ServiceA } from '../services/ServiceA';
import { TYPES } from './symbol';
// container1.bind<IOriginSerivce>(TYPES.IOriginSerivce).to(OriginSerivce);
// container1.bind<IOriginSerivce>(OriginSerivce).toSelf();
// container1.bind<IServiceA>(ServiceA).toSelf();
container1.bind(TYPES.IServiceA).to(ServiceA);
container1.bind(TYPES.IOriginSerivce).toFactory((context)=>{
    return (dynamicValue)=>{
        const serviceA = context.container.get(TYPES.IServiceA);
        return new OriginSerivce(serviceA, dynamicValue);
    };
});
// 创建一个工厂函数来创建 createOriginSevice 实例
// function createOriginServiceInstance(): IOriginSerivce {
//   return container1.get<IOriginSerivce>(TYPES.IOriginSerivce);
// }
function createOriginServiceInstance(name) {
    const originClassFactory = container1.get(TYPES.IOriginSerivce);
    const originClassInstance = originClassFactory(name);
    return originClassInstance;
}
// const originClassFactory = container.get<interfaces.Factory<IOriginClass>>(TYPES.OriginClass);
// const originClassInstance = originClassFactory('Hello, InversifyJS!');
// LogServiceB: Hello, InversifyJS!
export default createOriginServiceInstance;

 //# sourceMappingURL=createOriginServiceInstance.js.map