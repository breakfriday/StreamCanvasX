
import React, { useRef, useEffect, useState } from 'react';
interface IVideoComponent {
    url: string;
    key: string | number;
    hasVideo: boolean;
    hasAudio?: boolean;
    showAudio?: boolean;
    useOffScreen?: boolean;
    audioDrawType?: number ; // You might want to replace 'string' with the actual type here
    renderPerSecond?: number;
    updataBufferPerSecond?: number;
    fftsize?: number;
    bufferSize?: number;
    degree?: number;
    isLive?: boolean;
    streamType?: string;
    fileData?: File;
    enable_crypto?: boolean;
    key_v?: string;
  }
  const VideoComponents: React.FC<IVideoComponent> = (props) => {
    const containerRef = useRef(null);

    useEffect(() => {

    });
    return (<div>
      <div style={{ width: '800px', height: '500px', border: '1px' }} ref={containerRef} />

    </div>);
  };


  export default VideoComponents;