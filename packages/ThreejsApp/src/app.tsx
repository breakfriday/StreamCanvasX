import { runApp, IAppConfig } from 'ice';
import 'reflect-metadata';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
  },
};

runApp(appConfig);
