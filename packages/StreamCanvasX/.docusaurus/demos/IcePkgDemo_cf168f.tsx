import * as React from 'react';
import { Divider, Space, Button, Checkbox, Form, Input } from 'antd';
import { createAudioProcessingServiceInstance, createMainPlayerInstance } from 'StreamCanvasX/es2017/serviceFactories/index';
const {useRef,useEffect}=React


const SimpleDemo = () => {
  const veido_flv_ref = React.useRef<HTMLVideoElement | null>(null);
  const canvas_ref = React.useRef<HTMLCanvasElement | null>(null);
   let streamPlayerRef = useRef<mainPlayerService | null>(null);
   const canvas_audio_ref = useRef(null);

  useEffect(() => {
    const streamPlayer = createMainPlayerInstance({ root_el: veido_flv_ref?.current!, canvas_el: canvas_ref?.current! });
    streamPlayerRef.current = streamPlayer;

    loadMediaEvent()

  }, []);

    const loadMediaEvent = () => {
    const video_el = streamPlayerRef.current?._vedio;
    if (video_el) {
      video_el.addEventListener('play', () => {
        const audio_process = createAudioProcessingServiceInstance({ media_el: video_el, canvas_el: canvas_audio_ref.current! });


        audio_process.updateBufferData();
        audio_process.drawWithBufferData();
        //  audio_process.visulizerDraw3();
      });
    }
  };

  return (
    <>
    <div>
        <input
            type="file"
            id="file-input"
            accept="audio/*,video/*"
            onChange={(event) => {
            const streamPlayer = streamPlayerRef.current!;
            const files_data = event.target?.files?.[0]; // 返回file对象， 继承自blob对象。
            files_data ? streamPlayer.set_blob_url(files_data) : '';
            }}
        />
        <div style={{"display":"flex","flexDirection":"row"}}>
           <div
            ref={veido_flv_ref}
            style={{ width: '300px', height: '300px' }}
          />

           <canvas  ref={canvas_ref}  width="300" height="300" style={{"marginLeft":"15px","display":"none"}} />

          <div >
            <canvas style={{ background: 'black' }} ref={canvas_audio_ref} id="canvas" width="300" height="300" />
          </div>

           
        </div>
    
    </div>
    </>
  )
}

export default SimpleDemo;