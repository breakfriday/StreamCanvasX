import 'reflect-metadata';
import { Container } from 'inversify';
import { ThreeApp } from './threeApp';
import { AddCubeService } from './shapes/addcube';
import { SERVICE_IDENTIFIER } from './constants';

const container = new Container();
container.bind<ThreeApp>(ThreeApp).toSelf();
container.bind<AddCubeService>(SERVICE_IDENTIFIER.AddCubeService).to(AddCubeService);


const threeApp = container.get<ThreeApp>(ThreeApp);
// threeApp.init();
// threeApp.render();


export default threeApp;
