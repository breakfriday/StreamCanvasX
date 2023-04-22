import { injectable, inject, Container } from 'inversify';
import { ServiceA } from './ServiceA';

@injectable()
export class AppClass {
  logger: ServiceA;

  constructor(@inject(Logger) logger: ServiceA) {
    this.logger = logger;
  }

  doSomething(): void {
    this.logger.logMessage('ss');
  }
}
