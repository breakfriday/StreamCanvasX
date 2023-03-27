import React, { useRef, useEffect } from 'react';
import { ResponsiveGrid, Divider } from '@alifd/next';
import player from 'StreamCanvasX/player';


const { Cell } = ResponsiveGrid;

const AudioPage = () => {
  const audio_ref = useRef(null);
  const canvas_ref = useRef(null);


  const set_audio = (parm) => {
    const { src } = parm;
    if (audio_ref?.current) {
      const audio_el = audio_ref.current;
      audio_el.src = src;
      audio.load();
      audio.play();
    }
  };

  return (
    <div >
      <input
        type="file"
        accept="audio/*"
        onChange={(event) => {
          const files_data = event?.target?.files[0];

          set_audio({ src: URL.createObjectURL(files_data) });
        }}
      />
      <audio id="audio" controls ref={audio_ref} />
      <Divider />
      <canvas ref={canvas_ref} id="canvas" width="800" height="800" />
    </div>
  );
};

export default AudioPage;
