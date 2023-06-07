import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { injectable } from "inversify";
export var ServiceA = /*#__PURE__*/ function() {
    "use strict";
    function ServiceA() {
        _class_call_check(this, ServiceA);
    }
    _create_class(ServiceA, [
        {
            key: "logMessage",
            value: function logMessage(message) {
                alert(message);
            }
        }
    ]);
    return ServiceA;
}();
ServiceA = _ts_decorate([
    injectable()
], ServiceA);

 //# sourceMappingURL=audioWaveRender.js.map