import Konva from 'konva';
import React, { useRef, useEffect } from 'react';
import Sheet from './components/sheet';

const Home = () => {

  return (
    <>
      <Sheet x={150} y={150} radius={50} color="red" />
    </>
  );
};

export default Home;
