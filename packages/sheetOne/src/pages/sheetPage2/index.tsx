import React, { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect, Text } from 'react-konva';
import SpreadSheet from 'konvaGrid';

const SheetPage2 = () => {
  return (
    <>
      <SpreadSheet autoFocus={false} />

      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Text text="Try click on rect" />

        </Layer>
      </Stage>
    </>
  );
};

export default SheetPage2;

