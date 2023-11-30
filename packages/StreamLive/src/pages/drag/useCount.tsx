import exp from 'constants';
import { useEffect, useRef, useState } from 'react';

function useCount() {
  const [count, setCount] = useState(0);

  // function click() {
  //   const newCount = count + 1;
  //   setCount(newCount);
  // }
  const click = (e) => {
    console.log(e);
    const newCount = count + 1;
    setCount(newCount);
  };
  function click2() {
    const newCount = count + 2;
    setCount(newCount);
  }

  return { count, click, click2 };
}

export default useCount;