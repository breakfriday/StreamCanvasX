import React, { useRef, useEffect, useState } from 'react';
import useDrag from './useDrag';
import useCount from './useCount';

// const SimpleDemo = () => {
//   const [style1, setState1] = React.useState({ width: 250, height: 120 });
//   const [style2, setState2] = React.useState({ width: 250, height: 120 });
//   const origin1 = React.useRef(null);
//   const origin2 = React.useRef(null);

// // 鼠标移动 计算宽高并更新元素style
//   const onMouseMove1 = event => {
//     event.stopPropagation();
//     event.preventDefault();
//     const { clientX } = event;
//     const { clientY } = event;
//     const width = style1.width + clientX - origin1.current.x;
//     const height = style1.height + clientY - origin1.current.y;
//     setState1({ width, height });
//   };
//   const onMouseMove2 = event => {
//     event.stopPropagation();
//     event.preventDefault();
//     const { clientX } = event;
//     const { clientY } = event;
//     const width = style2.width + clientX - origin2.current.x;
//     const height = style2.height + clientY - origin2.current.y;
//     setState2({ width, height });
//   };

//   // 鼠标按下
//   const onMouseDown1 = event => {
//     event.stopPropagation();
//     event.preventDefault();
//     const { clientX } = event;
//     const { clientY } = event;
//     // origin移动起始坐标轴
//     origin1.current = { x: clientX, y: clientY };
//     bindEvents1();
//   };
//   const onMouseDown2 = event => {
//     event.stopPropagation();
//     event.preventDefault();
//     const { clientX } = event;
//     const { clientY } = event;
//     // origin移动起始坐标轴
//     origin2.current = { x: clientX, y: clientY };
//     bindEvents2();
//   };

//     // 鼠标释放后解绑事件
//   const onMouseUp1 = event => {
//     unbindEvents1();
//   };
//   const onMouseUp2 = event => {
//     unbindEvents2();
//   };

//   const bindEvents1 = () => {
//     document.addEventListener('mouseup', onMouseUp1);
//     document.addEventListener('mousemove', onMouseMove1);
//     document.addEventListener('mouseleave', onMouseUp1);
//   };
//   const bindEvents2 = () => {
//     document.addEventListener('mouseup', onMouseUp2);
//     document.addEventListener('mousemove', onMouseMove2);
//     document.addEventListener('mouseleave', onMouseUp2);
//   };
//   const unbindEvents1 = () => {
//     document.removeEventListener('mouseup', onMouseUp1);
//     document.removeEventListener('mousemove', onMouseMove1);
//     document.removeEventListener('mouseleave', onMouseUp1);
//   };
//   const unbindEvents2 = () => {
//     document.removeEventListener('mouseup', onMouseUp2);
//     document.removeEventListener('mousemove', onMouseMove2);
//     document.removeEventListener('mouseleave', onMouseUp2);
//   };

//   React.useEffect(() => {
//     return () => {
//       unbindEvents1();
//       unbindEvents2();
//     };
//   }, []);

//   return (
//     <div style={{ border: '1px solid green' }}>
//       我是绿色的盒子的盒子
//       <div
//         onMouseDown={onMouseDown1}
//         style={{ border: '1px solid red', ...style1 }}
//       >
//         <h3>我是红色的盒子，点我拖动改变大小</h3>

//         <div
//           onMouseDown={onMouseDown2}
//           style={{ border: '1px solid blue', ...style2 }}
//         >
//           <h3>我是蓝色的盒子，点我拖动改变大小</h3>
//         </div>
//       </div>


//     </div>
//   );
// };

const SimpleDemo = () => {
  // const { count, click, click2 } = useCount();
  const { style, initDrag, count } = useDrag();
  const divElementRef = useRef(null);
  return (
    <>
      <div className="box123" style={{ border: '1px solid green' }}>
        我是绿色的盒子的盒子
        <div
          ref={divElementRef}
          className="box111"
          onClick={() => {
            initDrag(divElementRef);
          }}
          // onMouseDown={onMouseDown}
          style={{ border: '1px solid red', width: style }}
        >
          <h3>我是红色的盒子，点我拖动改变大小</h3>

          {/* <div
            className="box222"
            onMouseDown={onMouseDown}
            style={{ border: '1px solid blue', width: 200, height: 200 }}
          >
            <h3>我是蓝色的盒子，点我拖动改变大小</h3>
          </div> */}
        </div>

      </div>

      <div >
        count:{ count }
        {/*
        <div onMouseDown={click}> count + 1</div>
        <div onClick={click2}> count + 2</div> */}
      </div>
      <div>
        width:{ style }
      </div>


    </>
  );
};


export default SimpleDemo;