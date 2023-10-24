import { useState, useEffect, useRef } from 'react';
import { createRTCPlayerServiceInstance, RTCPlayerService } from 'streamcanvasx/src/serviceFactories/index';

type IRTCPlayerService = ReturnType<typeof createRTCPlayerServiceInstance>;

type UseRTCPlayerReturnType = [
    React.MutableRefObject<IRTCPlayerService | null>,
    (containerRef: React.RefObject<HTMLElement>) => void,
];


function UseRTCPlayer(): UseRTCPlayerReturnType {
   const playerRef = useRef<IRTCPlayerService | null>(null);


    const createPlayer = (containerRef: React.RefObject<HTMLElement>) => {
        if (containerRef.current && !playerRef.current) {
            let player = createRTCPlayerServiceInstance({
                contentEl: containerRef.current!,
              });
            playerRef.current = player;
            }
    };

    useEffect(() => {
        return () => {
            if (playerRef.current) {
              console.log('destroy player');
            }
        };
    }, []);

    return [playerRef, createPlayer];
}


export default UseRTCPlayer;