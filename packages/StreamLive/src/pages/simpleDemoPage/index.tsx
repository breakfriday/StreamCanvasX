import React, { useRef, useEffect } from 'react';
// import player from 'streamcanvasx/player';
// import CanvasPlayer from 'streamcanvasx/canvasPlayer';


 import { createPlayerServicePromise } from 'streamcanvasx/src/index';
 import styles from './index.module.css';

 let url = 'http://192.168.100.66:42221/rtp/525ED13A.live.flv';
const SimplePage = () => {
  useEffect(() => {

  }, []);

  const containerRef = useRef(null);


  const createPlayer = async () => {
    let player = await createPlayerServicePromise({ url, contentEl: containerRef.current!, streamType: 'flv' });


    player.createFlvPlayer({});
  };
  return (
    <div>


      <div onClick={() => {
       createPlayer();
      }}
      > createPlayerServicePromise</div>

      <div className={styles.box1} ref={containerRef} />

    </div>
  );
};

export default SimplePage;
