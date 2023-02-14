import Konva from 'konva';
import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';


const WIDTH = 100;
const HEIGHT = 100;

const grid = [['red', 'yellow'], ['yellow', 'red']];

const GridDemo1 = () => {
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const startX = Math.floor((-stagePos.x - window.innerWidth) / WIDTH) * WIDTH;

  const endX =
    Math.floor((-stagePos.x + window.innerWidth * 2) / WIDTH) * WIDTH;

  const startY =
    Math.floor((-stagePos.y - window.innerHeight) / HEIGHT) * HEIGHT;
  const endY =
    Math.floor((-stagePos.y + window.innerHeight * 2) / HEIGHT) * HEIGHT;

  const gridComponents: any[] = [];

  let i = 0;
  for (let x = startX; x < endX; x += WIDTH) {
    for (let y = startY; y < endY; y += HEIGHT) {
      if (i === 4) {
        i = 0;
      }

      const indexX = Math.abs(x / WIDTH) % grid.length;
      const indexY = Math.abs(y / HEIGHT) % grid[0].length;

      gridComponents.push(
        <Rect
          x={x}
          y={y}
          width={WIDTH}
          height={HEIGHT}
          fill={grid[indexX][indexY]}
          stroke="black"
        />,
      );
    }
  }

  return (
    <Stage
      x={stagePos.x}
      y={stagePos.y}
      width={window.innerWidth}
      height={window.innerHeight}
      draggable
      onDragEnd={(e) => {
        setStagePos(e.currentTarget.position());
      }}
    >
      <Layer>{gridComponents}</Layer>
    </Stage>
  );
};

export default GridDemo1;
