import Konva from 'konva';
import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Circle } from 'react-konva';


const possibleFilters = ['', 'blur', 'invert'];

function createObject(attrs) {
  return Object.assign({}, attrs, {
    // define position
    x: 0,
    y: 0,
    // here should be url to image
    src: '',
    // and define filter on it, let's define that we can have only
    // "blur", "invert" or "" (none)
    filter: 'blur',
  });
}
function createYoda(attrs) {
  return Object.assign(createObject(attrs), {
    src: '/assets/yoda.jpg',
  });
}

function createDarth(attrs) {
  return Object.assign(createObject(attrs), {
    src: '/assets/darth-vader.jpg',
  });
}

let stage_history = [{
  x: 20,
  y: 20,
}];

let history_step = 0;


function generateItems() {
  const items = [];
  for (let i = 0; i < 10; i++) {
    items.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      id: `node-${i}`,
      color: Konva.Util.getRandomColor(),
    });
  }
  return items;
}


const Complex_Load = () => {
  const [position, set_position] = useState(stage_history[history_step]);

  const [cirecle_items, set_circle_items] = useState(generateItems());

  const undo_handle = () => {
    if (history_step === 0) {
      return false;
    }
    history_step -= 1;
    const previous_postion = stage_history[history_step];


    set_position(previous_postion);
  };

  const redo_handle = () => {
    if (history_step === stage_history.length - 1) {
      return false;
    }
    history_step += 1;
    const next_position = stage_history[history_step];
    set_position(next_position);
  };

  const handle_drag_end = (evt) => {
    const history = stage_history.slice(0, history_step + 1);

    const pos = {
      x: evt.target.x(),
      y: evt.target.y(),
    };

    stage_history = history.concat([pos]);
    history_step += 1;

    set_position(pos);
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>

      <Layer>
        <Text text="undo" onClick={undo_handle} />
        <Text text="redo" x={40} onClick={redo_handle} />
        <Rect
          x={position.x}
          y={position.y}
          width={50}
          height={50}
          fill="black"
          draggable
          onDragEnd={handle_drag_end}
        />

        {cirecle_items.map((item: any) => (
          <Circle
            key={item.id}
            name={item.id}
            draggable
            x={item.x}
            y={item.y}
            fill={item.color}
            radius={50}
            onDragStart={() => {}}
            onDragEnd={() => {}}
          />
        ))}
      </Layer>

    </Stage>
  );
};

export default Complex_Load;
