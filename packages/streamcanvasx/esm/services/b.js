/**
 * @author zhangxinxu(.com)
 * @version 1.0.0 2023-05-06
 * @description 让当前Gif图片点击可以暂停播放
 * 如果你有类似需求，基于此实现进行改造
 * 详见：https://www.zhangxinxu.com/wordpress/?p=10830
 *
 * @data {*} data 需要渲染的 GIF 元素，
 * 可以是选择器字符串，
 * 也可以是DOM对象，
 * 或者是 NodeList 对象
 * 也可以省略，会遍历当前页面所有以.gif为后缀的图片元素
 * @returns
 */ import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
var renderGif = function renderGif1(data, options) {
    var objReturn = {
        element: null,
        paused: false,
        play: function play() {},
        pause: function pause() {},
        frameIndex: -1
    };
    // 如果浏览器不支持
    if (typeof ImageDecoder == "undefined") {
        console.error("当前浏览器不支持 ImageDecoder API，无法暂停 GIF");
        return objReturn;
    }
    if (typeof data == "undefined") {
        data = 'img[src$=".gif"]';
    }
    if (typeof data == "string") {
        data = document.querySelectorAll(data);
    }
    if (!data) {
        return objReturn;
    }
    // 支持 NodeList 对象
    if (data.forEach) {
        data.forEach(function(ele, index) {
            var obj = renderGif(ele);
            if (index === 0) {
                objReturn = obj;
            }
        });
        return objReturn;
    }
    var defaults = {
        bindEvent: true
    };
    var params = Object.assign(defaults, options || {});
    // gif图片的url地址
    var src = data.src;
    if (!src) {
        return;
    }
    var dom = data;
    // 创建的用来播放gif的canvas元素
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    // 一些与GIF播放有关的变量
    var imageDecoder = null;
    var imageIndex = 0;
    var paused = false;
    // 绘制方法
    var renderImage = function renderImage1(result) {
        context.drawImage(result.image, 0, 0);
        var track = imageDecoder.tracks.selectedTrack;
        // 如果播放结束，从头开始循环
        if (imageDecoder.complete) {
            if (track.frameCount === 1) {
                return;
            }
            if (imageIndex + 1 >= track.frameCount) {
                imageIndex = 0;
            }
        }
        // 绘制下一帧内容
        imageDecoder.decode({
            frameIndex: ++imageIndex
        }).then(function(nextResult) {
            if (paused === false) {
                setTimeout(function() {
                    renderImage(nextResult);
                }, result.image.duration / 1000.0);
            } else {
                canvas.nextResult = nextResult;
            }
        }).catch(function(e) {
            // imageIndex可能超出的容错处理
            if (_instanceof(e, RangeError)) {
                imageIndex = 0;
                imageDecoder.decode({
                    frameIndex: imageIndex
                }).then(renderImage);
            } else {
                throw e;
            }
        });
    };
    // 判断地址能够请求
    fetch(src).then(function(response) {
        // 可以请求，进行样式处理
        // 设置canvas尺寸
        canvas.width = dom.naturalWidth;
        canvas.height = dom.naturalHeight;
        // 实际显示尺寸
        canvas.style.width = "".concat(dom.clientWidth, "px");
        canvas.style.height = "".concat(dom.clientHeight, "px");
        // 隐藏图片，显示画布
        dom.after(canvas);
        dom.style.position = "absolute";
        dom.style.opacity = "0";
        // 将GIF绘制在canvas上
        imageDecoder = new ImageDecoder({
            data: response.body,
            type: "image/gif"
        });
        // 解析第一帧并绘制
        imageDecoder.decode({
            frameIndex: imageIndex
        }).then(renderImage);
    });
    // 播放和暂停方法
    var play = function play() {
        paused = false;
        renderImage(canvas.nextResult);
    };
    var pause = function pause() {
        paused = true;
    };
    if (params.bindEvent) {
        // 事件绑定处理
        dom.addEventListener("click", function() {
            if (paused) {
                play();
            } else {
                pause();
            }
        });
        canvas.addEventListener("click", function() {
            if (paused) {
                play();
            } else {
                pause();
            }
        });
    }
    // 返回数据和方法
    objReturn = {
        element: data,
        paused: paused,
        play: play,
        pause: pause,
        frameIndex: imageIndex
    };
    // 几个布尔值和数值属性实时获取
    Object.defineProperties(objReturn, {
        paused: {
            get: function get() {
                return paused;
            }
        },
        frameIndex: {
            get: function get() {
                return imageIndex;
            }
        }
    });
    return objReturn;
};
