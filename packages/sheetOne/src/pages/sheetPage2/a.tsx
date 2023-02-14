import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';

const Grid = ({ rows, columns, cellSize }) => {
  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      cells.push({
        x: col * cellSize,
        y: row * cellSize,
        width: cellSize,
        height: cellSize
      });
    }
  }
  return (
    <Layer>
      {cells.map((cell, i) => (
        <Rect
          key={i}
          x={cell.x}
          y={cell.y}
          width={cell.width}
          height={cell.height}
          stroke='black'
        />
      ))}
    </Layer>
  );
};

const SelectionRect = ({ x, y, width, height, color, onSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const rectRef = useRef(null);

  const handleDragStart = e => {
    setIsDragging(true);
    setStartPoint({
      x: e.target.x(),
      y: e.target.y()
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onSelect({
      x: rectRef.current.x(),
      y: rectRef.current.y(),
      width: rectRef.current.width(),
      height: rectRef.current.height()
    });
  };

  return (
    <Rect
      ref={rectRef}
      x={x}
      y={y}
      width={width}
      height={height}
      fill={color}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />
  );
};

const App = () => {
  const [selectedCells, setSelectedCells] = useState([]);
  const handleSelect = selection => {
    const cells = [];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = { x: col * 50, y: row * 50, width: 50, height: 50 };
        if (
          cell.x + cell.width > selection.x &&
          cell.x < selection.x + selection.width &&
          cell.y + cell.height > selection.y &&
          cell.y < selection.y + selection.height
        ) {
          cells.push(cell);
        }
      }
    }
  }