import 'reflect-metadata';
import { Container } from 'inversify';
// import Logger from './Logger';
// import orignClass from './orignClass';

const container1 = new Container();

const containerPlayer = new Container();

const WebRTCInjectionContainer = new Container();

const WavePlayerContainer = new Container();
// container.bind<Logger>(Logger).toSelf();
// container.bind<orignClass>(orignClass).toSelf();


export { container1, Container, containerPlayer, WebRTCInjectionContainer, WavePlayerContainer };
