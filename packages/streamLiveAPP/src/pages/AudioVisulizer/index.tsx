import React, { useRef, useEffect } from 'react';
import { ResponsiveGrid, Divider } from '@alifd/next';
import player from 'StreamCanvasX/player';


const { Cell } = ResponsiveGrid;

const AudioPage = () => {
  const audio_ref = useRef(null);
  const canvas_ref = useRef(null);

  return (
    <div >
      <input
        type="file"
        accept="audio/*"
        onChange={(files) => {
          var files = files;
          debugger
          audio.src = URL.createObjectURL(files[0]);
          audio.load();
          audio.play();
        }}
      />
      <audio id="audio" controls />
      <Divider />
      <canvas ref={canvas_ref} id="canvas" width="800" height="800" />
    </div>
  );
};

export default AudioPage;
