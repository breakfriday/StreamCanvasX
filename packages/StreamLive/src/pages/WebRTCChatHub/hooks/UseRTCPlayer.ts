import { useState, useEffect, useRef } from 'react';
import { createRTCPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';

type IRTCPlayerService = ReturnType<typeof createRTCPlayerServiceInstance>;

type UseRTCPlayerReturnType = [
    React.MutableRefObject<IRTCPlayerService | null>,
    (containerRef: React.RefObject<HTMLElement>) => void,
    devices:{ videoInputs: MediaDeviceInfo[]; audioInputs: MediaDeviceInfo[]} | undefined,
];


function UseRTCPlayer(): UseRTCPlayerReturnType {
   const playerRef = useRef<IRTCPlayerService | null>(null);

   const [devices, setDevices] = useState<{ videoInputs: MediaDeviceInfo[]; audioInputs: MediaDeviceInfo[]} | undefined>(null);


    const createPlayer = (containerRef: React.RefObject<HTMLElement>) => {
        if (containerRef.current && !playerRef.current) {
            let player = createRTCPlayerServiceInstance({
                contentEl: containerRef.current!,
              });
            playerRef.current = player;

            getDevices();
        }
    };


    const getDevices = async () => {
        let devices = await playerRef.current?.getDeviceLIst();


        setDevices(devices);
    };

    useEffect(() => {
        return () => {
            if (playerRef.current) {
              console.log('destroy player');
            }
        };
    }, []);

    return [playerRef, createPlayer, devices];
}


export default UseRTCPlayer;