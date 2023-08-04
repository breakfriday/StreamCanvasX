import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { injectable } from 'inversify';
export let ServiceA = class ServiceA {
    logMessage(message) {
        alert(message);
    }
};
ServiceA = _ts_decorate([
    injectable()
], ServiceA);
