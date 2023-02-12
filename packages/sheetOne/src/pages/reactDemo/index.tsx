import React, { useState, useRef } from 'react';
import { Text, Stage, Layer } from 'react-konva';
import Konva from 'konva';

function App() {
  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);

  const handleTextLoad = () => {
    setTextWidth(textRef.current.textWidth);
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Text
          ref={textRef}
          text="Your text"
          fontSize={24}
          onLoad={handleTextLoad}
          align="center"
        />
      </Layer>
    </Stage>
  );
}

export default App;
