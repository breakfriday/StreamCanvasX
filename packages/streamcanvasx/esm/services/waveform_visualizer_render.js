import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
export var WaveformVisualizer = /*#__PURE__*/ function() {
    "use strict";
    function WaveformVisualizer() {
        _class_call_check(this, WaveformVisualizer);
        _define_property(this, "mediaSource_el", void 0);
        _define_property(this, "canvas", void 0);
        _define_property(this, "audioContext", void 0);
        _define_property(this, "canvasContext", void 0);
        _define_property(this, "analyserNode", void 0);
        _define_property(this, "audioSourceNode", void 0);
    }
    _create_class(WaveformVisualizer, [
        {
            key: "drawAudio1",
            value: function drawAudio1() {
                var _this = this;
                var bufferLength = this.analyserNode.fftSize;
                var dataArray = new Float32Array(bufferLength);
                var AnimationFrame = function() {
                    _this.analyserNode.getFloatTimeDomainData(dataArray);
                    // 清除画布
                    _this.canvasContext.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
                    // 设置波形图样式
                    _this.canvasContext.lineWidth = 2;
                    _this.canvasContext.strokeStyle = "#7f0";
                    // 绘制波形图
                    _this.canvasContext.beginPath();
                    var sliceWidth = _this.canvas.width / bufferLength;
                    var x = 0;
                    for(var i = 0; i < bufferLength; i++){
                        var value = dataArray[i] * _this.canvas.height / 2;
                        var y = _this.canvas.height / 2 + value;
                        if (i === 0) {
                            _this.canvasContext.moveTo(x, y);
                        } else {
                            _this.canvasContext.lineTo(x, y);
                        }
                        x += sliceWidth;
                    }
                    _this.canvasContext.lineTo(_this.canvas.width, _this.canvas.height / 2);
                    _this.canvasContext.stroke();
                    // 循环绘制
                    requestAnimationFrame(AnimationFrame.bind(_this));
                };
                AnimationFrame();
            }
        }
    ]);
    return WaveformVisualizer;
}();
