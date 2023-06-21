import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_param } from "@swc/helpers/_/_ts_param";
import { injectable, inject } from 'inversify';
import { TYPES } from '../serviceFactories/symbol';
export let OriginSerivce = class OriginSerivce {
    doSomething() {
        this.logger.logMessage('asdfasdf');
    }
    constructor(logger, params){
        _define_property(this, "logger", void 0);
        this.logger = logger;
    }
};
OriginSerivce = _ts_decorate([
    injectable(),
    _ts_param(0, inject(TYPES.IServiceA))
], OriginSerivce);
