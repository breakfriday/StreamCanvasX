import { ServiceA } from './ServiceA';
export declare class OriginSerivce {
    logger: ServiceA;
    constructor(logger: ServiceA, params: any);
    doSomething(): void;
}
