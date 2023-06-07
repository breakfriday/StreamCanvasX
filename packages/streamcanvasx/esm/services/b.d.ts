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
 */
declare const renderGif: (data: any, options: any) => {
    element: any;
    paused: boolean;
    play: () => void;
    pause: () => void;
    frameIndex: number;
};
