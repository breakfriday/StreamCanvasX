import { inject, injectable } from 'inversify';
import { ServiceA } from './SeviceA';
import { SERVICE_IDENTIFIER } from './constants';

@injectable()
export class AppClass {
  @inject(ServiceA) private serviceA: ServiceA;


  run() {
    // this.serviceA.logMessage('Hello, world!');
    alert(this.age);
    this.serviceA.logMessage('test');
  }
}
