import 'reflect-metadata';
import { Container } from 'inversify';
import { ServiceA } from './SeviceA';
import { AppClass } from './threeApp';


const container = new Container();

 container.bind(ServiceA).toSelf();
// container.bind(AppClass).toSelf();

const app = container.resolve(AppClass);


export { app };
