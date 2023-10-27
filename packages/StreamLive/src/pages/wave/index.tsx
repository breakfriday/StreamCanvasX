// import { Divider, Space, Button, Form, Input, Radio } from 'antd';
// import { start } from 'repl';
// let _ = require('lodash');

// const Wave = () => {
//   window.allData = [];
//   window.routes;
//   window.dataPoints;
//   window.updateDataPoints;
//   function init() {
//     window.routes = 32;
//     window.dataPoints = 3000;
//     window.updateDataPoints = 320;
//     setAllData();
//   }
//   function setAllData() {
//     window.routes = 32;
//     window.dataPoints = 5000;

//     // 创建模拟数据
//     const generateHexData = () => {
//         let data = [];
//         for (let i = 0; i < window.dataPoints; i++) {
//             data.push(Math.floor(32678).toString(16));
//         }
//         return data;
//     };
//     // const start = Date.now();
//     for (let i = 0; i < window.routes; i++) {
//       window.allData.push(generateHexData());
//     }
//     for (let i = 0; i < window.routes; i++) {
//       for (let j = 0; j < window.dataPoints; j++) {
//         window.allData[i][j] = (parseInt(window.allData[i][j], 16) / 32678) - 1;
//       }
//     }
//     // const end = Date.now();
//     // console.log(end - start);
//   }
//   function initCanvas() {
//     const element = document.getElementById('canvasContainer');
//     for (let i = 0; i < window.routes; i++) {
//       window[`canvas_el${i + 1}`] = document.createElement('canvas');
//       window[`ctx${i + 1}`] = window[`canvas_el${i + 1}`].getContext('2d');
//       window[`canvas_el${i + 1}`].height = 300;
//       window[`canvas_el${i + 1}`].width = 300;
//       window[`canvas_el${i + 1}`].style.position = 'relative';
//       // const div = document.createElement('div');
//       // div.style.border = '2px';
//       // div.style.width = '300px';
//       // div.style.height = '300px';
//       // div.style.position = 'relative';
//       // div.append(window[`canvas_el${i + 1}`]);
//       // element.append(div);
//       element.append(window[`canvas_el${i + 1}`]);
//     }
//   }
//   function draw() {
//     const AnimationFrame = () => {
//     const start = Date.now();
//     for (let i = 0; i < window.routes; i++) {
//       let canvas = window[`canvas_el${i + 1}`];
//       let ctx = window[`ctx${i + 1}`];
//       if (ctx.lineWidth != 1 || ctx.strokeStyle != '#77ff00') {
//         ctx.lineWidth = 1;
//         ctx.strokeStyle = '#77ff00';
//       }
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.beginPath();
//       const sliceWidth = canvas.width / window.allData[i].length;
//       let x = 0;
//       let gap = 6;
//       let scale = canvas.height / 2;
//       for (let j = 0; j < window.allData[i].length; j++) {
//         let v = window.allData[i][j];
//         let y_upper = v * scale + canvas.height / 2;
//         let y_lower = -v * scale + canvas.height / 2;
//         if (v === 0) {
//           y_upper = canvas.height / 2 - gap / 2;
//           y_lower = canvas.height / 2 + gap / 2;
//       }

//         if (j === 0) {
//           ctx.moveTo(x, y_upper); // 上半部分
//           ctx.moveTo(x, y_lower); // 下半部分
//         } else {
//           ctx.lineTo(x, y_upper); // 上半部分
//           ctx.lineTo(x, y_lower); // 下半部分
//         }
//         x += sliceWidth;
//       }
//       ctx.lineTo(canvas.width, canvas.height / 2);
//       ctx.stroke();
//     }
//     const end = Date.now();
//     console.log(end - start);
//     updataData();
//     setTimeout(AnimationFrame.bind(this), 25);
//   };

//   AnimationFrame();
//   }
//   function updataData() {
//     const generateHexData = () => {
//       let data = [];
//       for (let i = 0; i < window.updateDataPoints; i++) {
//           data.push(Math.floor(Math.random() * 65536).toString(16));
//       }
//       return data;
//     };
//     for (let i = 0; i < window.routes; i++) {
//       let data = generateHexData();
//       allData[i] = _.concat(allData[i], data);
//       window.allData[i] = _.drop(window.allData[i], window.updateDataPoints);
//       // let j = window.updateDataPoints;
//       // while (j > 0) {
//       //   window.allData[i].shift();
//       //   j--;
//       // }
//       for (let k = window.dataPoints - window.updateDataPoints; k < window.dataPoints; k++) {
//         window.allData[i][k] = (parseInt(window.allData[i][k], 16) / 32678) - 1;
//       }
//     }
//   }
//   function start() {
//     initCanvas();
//     draw();
//   }
//   return (
//     <>
//       <Button onClick={init}>init</Button>
//       <Button onClick={initCanvas}>initCanvas</Button>
//       <Button onClick={draw}>draw</Button>
//       <Button onClick={start}>start</Button>
//       <div id="canvasContainer"> test</div>
//     </>
//   );
// };
// export default Wave;

import { Divider, Space, Button, Form, Input, Radio } from 'antd';
import AudioWaveService from 'streamcanvasx/src/services/audio/audioWaveService';
const Wave = () => {
  let audioWave = new AudioWaveService();
  const routes = 32;
  // let contentEl = document.getElementById('canvasContainer');

  audioWave.init({ routes: routes });


  const ws = new WebSocket('ws://123.56.228.244:26003/audio');

  // 當連接打開時
  ws.onopen = function (event) {
      console.log('WebSocket 連接已打開', event);
      // 你可以在這裡發送初始訊息給伺服器，如果需要的話
      // ws.send(JSON.stringify({ type: 'initial', message: 'Hello server!' }));
  };

  ws.onmessage = function (event) {
    // const data = JSON.parse(event.data);
    // debugger;
    const { data } = event;
    // debugger;
    data.arrayBuffer().then((ab) => {
      const i16a = new Int16Array(ab);
      let subidx = 0;
      let updatearray = [];
      while (subidx <= i16a.length) {
        const terminalid = String(i16a[subidx]);
        const channelid = i16a[subidx + 2];
        const channeldata = i16a.subarray(subidx + 4, subidx + 164);
        subidx += 164;
        if (channelid) {
          updatearray.push(channeldata);
        }
        // debugger;
        console.log(channelid);
      }
      // debugger;
      audioWave.updateArrayData(updatearray);
      // debugger;
    });
  };


  // const routes = 32;
  // let audioWave;
  function initCanvas() {
    let contentEl = document.getElementById('canvasContainer');

    audioWave.initCanvas(contentEl);
    // for (let i = 0; i < routes; i++) {
    //   window[`AudioWave${i}`] = new AudioWaveService();
    //   window[`AudioWave${i}`].init({ routes: i });
    // }
  }
  // function update() {
  //   audioWave.update();
  //   // for (let i = 0; i < routes; i++) {
  //   //   window[`AudioWave${i}`].update();
  //   // }
  // }
  function startDraw() {
    audioWave.start();
  }
  return (
    <>
      <Button onClick={initCanvas}>initCanvas</Button>
      <Button onClick={startDraw}>startDraw</Button>


      <div id="canvasContainer" />
    </>
  );
};
export default Wave;