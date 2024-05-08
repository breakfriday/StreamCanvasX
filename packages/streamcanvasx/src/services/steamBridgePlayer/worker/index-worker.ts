// 使用 self 代表 Worker 自身的全局上下文

import YuvEngine from './renderEngin';
import Singleton from './singleton';
// self.addEventListener('message', (event) => {
//     console.log('Received in worker:', event.data);
//     let count = 0;
//     for (let i = 0; i < event.data; i++) {
//         count += i;
//     }


//     let h=new YuvEngine();

//     // 发送数据回主线程
//     self.postMessage(count);
//     debugger;
// });


// // 在 Worker 初始化时就创建实例
 const instance = Singleton.getInstance();

// // 监听来自主线程的消息
self.addEventListener('message', (event) => {
    // 更新数据或处理其他任务

    instance.updateData(event);

    // postMessage(`Data updated to: ${instance.getData()}`);
});
