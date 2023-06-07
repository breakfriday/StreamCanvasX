import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_param } from "@swc/helpers/_/_ts_param";
import { injectable, inject } from "inversify";
import { TYPES } from "../serviceFactories/symbol";
export var OriginSerivce = /*#__PURE__*/ function() {
    "use strict";
    function OriginSerivce(logger, params) {
        _class_call_check(this, OriginSerivce);
        _define_property(this, "logger", void 0);
        this.logger = logger;
    }
    _create_class(OriginSerivce, [
        {
            key: "doSomething",
            value: function doSomething() {
                this.logger.logMessage("asdfasdf");
            }
        }
    ]);
    return OriginSerivce;
}();
OriginSerivce = _ts_decorate([
    injectable(),
    _ts_param(0, inject(TYPES.IServiceA))
], OriginSerivce);
