import React, { useRef, useEffect } from 'react';
import { ResponsiveGrid, Divider } from '@alifd/next';
import CanvasAudioVisulizer_Processor from 'StreamCanvasX/canvasAudioVisulizer';


const { Cell } = ResponsiveGrid;

const AudioPage = () => {
  const audio_ref = useRef(null);
  const canvas_ref = useRef(null);


  return (
    <div >
      <input
        type="file"
        accept="audio/*"
        onChange={(event) => {
          const files_data = event.target?.files?.[0];
          if (files_data) {
            const audio_process = new CanvasAudioVisulizer_Processor({ audio_el: audio_ref?.current, canvas_el: canvas_ref?.current });
            audio_process.setAudio(files_data);
          }
        }}
      />
      <audio id="audio" controls ref={audio_ref} />
      <Divider />
      <canvas ref={canvas_ref} id="canvas" width="1800" height="800" />
    </div>
  );
};

export default AudioPage;
