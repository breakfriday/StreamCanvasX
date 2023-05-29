import * as React from 'react';
import mainPlayerService from 'StreamCanvasX/es2017/services/mainCanvasPlayer';




const SimpleDemo = () => {
  const vedio_hls_ref = useRef<HTMLVideoElement | null>(null);
  const veido_flv_ref = useRef<HTMLVideoElement | null>(null);
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);

  
  return (
    <>
   <div onClick={()=>{
    alert(22)
    }}>222</div>
    </>
  )
}

export default SimpleDemo;