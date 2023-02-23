import Konva from 'konva';
import React, { useRef, useEffect } from 'react';
import Circle from './components/circle';


class Scheduler {
  constructor(concurrency) {
    this.concurrency = concurrency; // 最大并发数
    this.tasks = []; // 任务队列
    this.currentCount = 0; // 当前并发数
  }

  addTask(task) {
    this.tasks.push(task); // 将任务添加到队列中
    this.runTasks(); // 尝试执行任务
  }

  async runTasks() {
    while (this.currentCount < this.concurrency && this.tasks.length) {
      // 当前并发数未达到最大值且还有任务需要执行
      const task = this.tasks.shift(); // 取出队列中的下一个任务
      this.currentCount++;
      task().finally(() => {
        this.currentCount--;
        this.runTasks(); // 执行完任务后尝试执行队列中的下一个任务
      });
    }
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const scheduler = new Scheduler(2);

const addTask = (time, order) => {
  scheduler.addTask(() => delay(time).then(() => console.log(order)));
};

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return (
    <>

      <div onClick={()=>{
     addTask(1000, "1");
     addTask(500, "2");
     addTask(300, "3");
     addTask(400, "4");

      }}>clickl</div>
      <Circle x={150} y={150} radius={50} color="red" />
      <Circle x={100} y={100} radius={25} color="green" />
    </>
  );
};

export default Home;
