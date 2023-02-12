import React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';


const grid_com = () => {
  const gridData = [
    ['A1', 'A2', 'A3'],
    ['B1', 'B2', 'B3'],
    ['C1', 'C2', 'C3'],
  ];

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {gridData.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <React.Fragment key={`${rowIndex}-${cellIndex}`}>
              <Rect
                x={100 * cellIndex}
                y={100 * rowIndex}
                width={100}
                height={100}
                fill="#ddd"
                stroke="#000"
                strokeWidth={1}
              />
              <Text
                x={100 * cellIndex + 50}
                y={100 * rowIndex + 50}
                text={cell}
                fontSize={20}
                align="center"
                verticalAlign="middle"
              />
            </React.Fragment>
          )))}
      </Layer>
    </Stage>
  );
};


export default grid_com;
