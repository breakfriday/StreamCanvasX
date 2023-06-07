import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var WebGPURenderer = /*#__PURE__*/ function() {
    "use strict";
    function WebGPURenderer(canvas) {
        _class_call_check(this, WebGPURenderer);
        _define_property(this, "device", void 0);
        _define_property(this, "context", void 0);
        _define_property(this, "canvas", void 0);
        // 初始化WebGPU
        this.canvas = canvas;
        this.initGpu();
    }
    _create_class(WebGPURenderer, [
        {
            key: "initGpu",
            value: function initGpu() {
                var _this = this;
                return _async_to_generator(function() {
                    var adapter, context;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!navigator.gpu) {
                                    throw Error("WebGPU not supported.");
                                }
                                return [
                                    4,
                                    navigator.gpu.requestAdapter()
                                ];
                            case 1:
                                adapter = _state.sent();
                                if (!adapter) {
                                    throw Error("Couldn't request WebGPU adapter.");
                                }
                                return [
                                    4,
                                    adapter.requestDevice()
                                ];
                            case 2:
                                _this.device = _state.sent();
                                context = _this.canvas.getContext("webgpu");
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return WebGPURenderer;
}();

 //# sourceMappingURL=WebGpuRenderService.js.map