import Konva from 'konva';
import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';


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

const Complex_Load = () => {
  const [stage_history, set_stage_history] = useState([
    {
      x: 20,
      y: 20,
    },
  ]);

  const [cur_history_step, set_cur_history_step] = useState(0);

  const position = stage_history[cur_history_step];

  const undo_handle = () => {

  };

  const redo_handle = () => {

  };

  const handle_drag_end = (evt) => {
    const history = stage_history.slice(0, cur_history_step + 1);

    const pos = {
      x: evt.target.x(),
      y: evt.target.y(),
    };
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
      </Layer>

    </Stage>
  );
};

export default Complex_Load;
