import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
var AudioProcessingService = /*#__PURE__*/ function() {
    "use strict";
    function AudioProcessingService(parmams) {
        _class_call_check(this, AudioProcessingService);
        _define_property(this, "context", void 0);
        _define_property(this, "dataArray", void 0);
        _define_property(this, "bufferLength", void 0);
        _define_property(this, "bufferData", void 0 // 时域 缓存
        );
        _define_property(this, "bufferDataLength", void 0);
        var canvas_el = parmams.canvas_el, media_el = parmams.media_el;
        this.context = {};
        if (canvas_el) {
            this.setCanvasDom(canvas_el);
        }
        this.createAudioContext();
        this.setMediaSource_el(media_el);
        this.audioContextConnect();
    }
    _create_class(AudioProcessingService, [
        {
            key: "createAudioContext",
            value: function createAudioContext() {
                this.context.audioContext = new AudioContext();
                this.context.analyserNode = this.context.audioContext.createAnalyser();
                this.bufferLength = this.context.analyserNode.fftSize;
                this.dataArray = new Float32Array(this.bufferLength);
                this.setBufferData();
            }
        },
        {
            key: "setBufferData",
            value: function setBufferData() {
                // 根据 AudioContext 的采样率、所需的缓存时间和 FFT 大小来设置缓存区大小
                this.bufferDataLength = Math.ceil(1 * this.context.audioContext.sampleRate / this.dataArray.length) * this.dataArray.length;
                this.bufferData = new Float32Array(this.bufferDataLength);
            }
        },
        {
            key: "updateBufferData",
            value: function updateBufferData() {
                var _this_context_analyserNode;
                var _this = this, dataArray = _this.dataArray, bufferData = _this.bufferData;
                var bufferDataLength = this.bufferDataLength;
                // 将旧的数据向前移动
                bufferData.copyWithin(0, dataArray.length);
                (_this_context_analyserNode = this.context.analyserNode) === null || _this_context_analyserNode === void 0 ? void 0 : _this_context_analyserNode.getFloatTimeDomainData(dataArray);
                // 将新的数据添加到缓存的末尾
                bufferData.set(dataArray, bufferDataLength - dataArray.length);
                // 每帧都更新缓存
                requestAnimationFrame(this.updateBufferData.bind(this));
            }
        },
        {
            key: "drawWithBufferData",
            value: function drawWithBufferData() {
                var _this = this;
                var dataArray = this.bufferData;
                var bufferLength = this.bufferDataLength;
                var AnimationFrame = function() {
                    // 清除画布
                    _this.context.canvasContext.clearRect(0, 0, _this.context.canvas.width, _this.context.canvas.height);
                    // 设置波形图样式
                    _this.context.canvasContext.lineWidth = 2;
                    _this.context.canvasContext.strokeStyle = "#7f0";
                    // 绘制波形图
                    _this.context.canvasContext.beginPath();
                    var sliceWidth = _this.context.canvas.width / bufferLength;
                    var x = 0;
                    for(var i = 0; i < bufferLength; i++){
                        var value = dataArray[i] * _this.context.canvas.height / 2;
                        var y = _this.context.canvas.height / 2 + value;
                        if (i === 0) {
                            _this.context.canvasContext.moveTo(x, y);
                        } else {
                            _this.context.canvasContext.lineTo(x, y);
                        }
                        x += sliceWidth;
                    }
                    _this.context.canvasContext.lineTo(_this.context.canvas.width, _this.context.canvas.height / 2);
                    _this.context.canvasContext.stroke();
                    // 循环绘制
                    requestAnimationFrame(AnimationFrame.bind(_this));
                };
                AnimationFrame();
            }
        },
        {
            key: "setCanvasDom",
            value: function setCanvasDom(el) {
                this.context.canvas = el;
                this.context.canvasContext = this.context.canvas.getContext("2d");
            }
        },
        {
            key: "setMediaSource_el",
            value: function setMediaSource_el(el) {
                this.context.mediaSource_el = el;
                this.context.audioSourceNode = this.context.audioContext.createMediaElementSource(el);
            }
        },
        {
            key: "resetAudioContextConnec",
            value: function resetAudioContextConnec() {
                var _this_context_audioSourceNode;
                (_this_context_audioSourceNode = this.context.audioSourceNode) === null || _this_context_audioSourceNode === void 0 ? void 0 : _this_context_audioSourceNode.disconnect();
                this.audioContextConnect();
            }
        },
        {
            key: "audioContextConnect",
            value: function audioContextConnect() {
                this.context.audioSourceNode.connect(this.context.analyserNode);
                this.context.analyserNode.connect(this.context.audioContext.destination);
            }
        },
        {
            key: "mute",
            value: function mute(parm) {
                if (parm === true) {
                    this.context.analyserNode.disconnect(this.context.audioContext.destination);
                } else {
                    this.context.analyserNode.connect(this.context.audioContext.destination);
                }
            }
        },
        {
            key: "visulizerDraw",
            value: function visulizerDraw() {
                var _this = this;
                var bufferLength = this.context.analyserNode.frequencyBinCount;
                var dataArray = new Uint8Array(bufferLength);
                var AnimationFrame = function() {
                    requestAnimationFrame(AnimationFrame.bind(_this));
                    // 获取音频数据
                    _this.context.analyserNode.getByteFrequencyData(dataArray);
                    // 清除canvas
                    _this.context.canvasContext.fillStyle = "rgb(255, 255, 255)";
                    _this.context.canvasContext.fillRect(0, 0, _this.context.canvas.width, _this.context.canvas.height);
                    // 设置绘制音频数据的样式
                    var barWidth = _this.context.canvas.width / bufferLength * 2.5;
                    var barHeight;
                    var x = 0;
                    for(var i = 0; i < bufferLength; i++){
                        barHeight = dataArray[i] / 2;
                        var r = barHeight + 25 * (i / bufferLength);
                        var g = 250 * (i / bufferLength);
                        var b = 50;
                        // this.canvasContext.fillStyle = 'rgb(0, 0, 0)';
                        // this.canvas_context.fillStyle = `rgb(${r},${g},${b})`;
                        _this.context.canvasContext.fillStyle = "rgb(0, 0, 0)";
                        _this.context.canvasContext.fillRect(x, _this.context.canvas.height - barHeight, barWidth, barHeight);
                        x += barWidth + 1;
                    }
                };
                AnimationFrame();
            }
        },
        {
            key: "visulizerDraw1",
            value: function visulizerDraw1() {
                var _this = this;
                var bufferLength = this.context.analyserNode.frequencyBinCount;
                var dataArray = new Uint8Array(bufferLength);
                var AnimationFrame = function() {
                    requestAnimationFrame(AnimationFrame.bind(_this));
                    // 将音频数据填充到数组当中
                    _this.context.analyserNode.getByteFrequencyData(dataArray);
                    // 清除canvas
                    _this.context.canvasContext.fillStyle = "#000";
                    _this.context.canvasContext.fillRect(0, 0, _this.context.canvas.width, _this.context.canvas.height);
                    var barWidth = _this.context.canvas.width / bufferLength * 2.5;
                    var barHeight;
                    var x = 0;
                    for(var i = 0; i < bufferLength; i++){
                        barHeight = dataArray[i];
                        var r = barHeight + 25 * (i / bufferLength);
                        var g = 250 * (i / bufferLength);
                        var b = 50;
                        _this.context.canvasContext.fillStyle = "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
                        _this.context.canvasContext.fillRect(x, _this.context.canvas.height - barHeight, barWidth, barHeight);
                        x += barWidth + 1;
                    }
                };
                AnimationFrame();
            }
        },
        {
            // 时域
            key: "visulizerDraw2",
            value: function visulizerDraw2() {
                var _this = this;
                var bufferLength = this.context.analyserNode.frequencyBinCount;
                var dataArray = new Uint8Array(bufferLength);
                var AnimationFrame = function() {
                    requestAnimationFrame(AnimationFrame.bind(_this));
                    // 获取音频数据
                    _this.context.analyserNode.getByteFrequencyData(dataArray);
                    _this.context.canvasContext.fillStyle = "rgba(0, 0, 0, 0.05)";
                    _this.context.canvasContext.fillRect(0, 0, _this.context.canvas.width, _this.context.canvas.height);
                    _this.context.canvasContext.lineWidth = 2;
                    _this.context.canvasContext.strokeStyle = "rgb(0, 255, 0)";
                    _this.context.canvasContext.beginPath();
                    var sliceWidth = _this.context.canvas.width * 1.0 / bufferLength;
                    var x = 0;
                    for(var i = 0; i < bufferLength; i++){
                        var v = dataArray[i] / 128.0;
                        var y = v * _this.context.canvas.height / 2;
                        if (i === 0) {
                            _this.context.canvasContext.moveTo(x, y);
                        } else {
                            _this.context.canvasContext.lineTo(x, y);
                        }
                        x += sliceWidth;
                    }
                    _this.context.canvasContext.lineTo(_this.context.canvas.width, _this.context.canvas.height / 2);
                    _this.context.canvasContext.stroke();
                };
                AnimationFrame();
            }
        },
        {
            key: "visulizerDraw3",
            value: function visulizerDraw3() {
                var _this = this;
                var bufferLength = this.bufferLength;
                var dataArray = this.dataArray;
                var AnimationFrame = function() {
                    _this.context.analyserNode.getFloatTimeDomainData(dataArray);
                    // 清除画布
                    _this.context.canvasContext.clearRect(0, 0, _this.context.canvas.width, _this.context.canvas.height);
                    // 设置波形图样式
                    _this.context.canvasContext.lineWidth = 2;
                    _this.context.canvasContext.strokeStyle = "#7f0";
                    // 绘制波形图
                    _this.context.canvasContext.beginPath();
                    var sliceWidth = _this.context.canvas.width / bufferLength;
                    var x = 0;
                    for(var i = 0; i < bufferLength; i++){
                        var value = dataArray[i] * _this.context.canvas.height / 2;
                        var y = _this.context.canvas.height / 2 + value;
                        if (i === 0) {
                            _this.context.canvasContext.moveTo(x, y);
                        } else {
                            _this.context.canvasContext.lineTo(x, y);
                        }
                        x += sliceWidth;
                    }
                    _this.context.canvasContext.lineTo(_this.context.canvas.width, _this.context.canvas.height / 2);
                    _this.context.canvasContext.stroke();
                    // 循环绘制
                    requestAnimationFrame(AnimationFrame.bind(_this));
                };
                AnimationFrame();
            }
        },
        {
            key: "visulizerDraw4",
            value: function visulizerDraw4() {
                var _this = this;
                var bufferLength = this.context.analyserNode.fftSize;
                var dataArray = new Float32Array(bufferLength);
                var AnimationFrame = function() {
                    requestAnimationFrame(AnimationFrame.bind(_this));
                    _this.context.analyserNode.getFloatTimeDomainData(dataArray);
                    _this.context.canvasContext.fillStyle = "rgba(0, 0, 0, 0.1)";
                    _this.context.canvasContext.fillRect(0, 0, _this.context.canvas.width, _this.context.canvas.height);
                    _this.context.canvasContext.lineWidth = 2;
                    _this.context.canvasContext.strokeStyle = "rgb(0, 255, 0)";
                    _this.context.canvasContext.beginPath();
                    var sliceWidth = _this.context.canvas.width * 1.0 / bufferLength;
                    var x = 0;
                    for(var i = 0; i < bufferLength; i++){
                        var v = dataArray[i] / 128.0;
                        var y = v * _this.context.canvas.height / 2;
                        if (i === 0) {
                            _this.context.canvasContext.moveTo(x, y);
                        } else {
                            _this.context.canvasContext.lineTo(x, y);
                        }
                        x += sliceWidth;
                    }
                    _this.context.canvasContext.lineTo(_this.context.canvas.width, _this.context.canvas.height / 2);
                    _this.context.canvasContext.stroke();
                };
                AnimationFrame();
            }
        }
    ]);
    return AudioProcessingService;
}();
export default AudioProcessingService;

 //# sourceMappingURL=audioProcessingService.js.map