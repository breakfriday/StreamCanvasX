import { injectable, inject, Container } from 'inversify';
import { ServiceA } from './ServiceA';
import { TYPES } from '../serviceFactories/symbol';

@injectable()
export class OriginSerivce {
  logger: ServiceA;

  constructor(
   @inject(TYPES.IServiceA) logger: ServiceA,
   name: string,
   ) {
    this.logger = logger;
    alert(name);
  }

  doSomething(): void {
    this.logger.logMessage('asdfasdf');
  }
}
