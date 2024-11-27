import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import styles from './index.module.css';
 import { createPlayerServiceInstance,createPlayerServicePromise } from 'streamcanvasx/src/index';


type ICreatePlayerServiceInstance = ReturnType<typeof createPlayerServiceInstance>;

type IProps = {
    streamType?: string;
    url: string;
    className?: string;
  };


const OfflineVideo: React.FC<IProps> = (props) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<any>(null);

    const { url, streamType, className } = props;
    let type = streamType;
    if (url.includes('.ts')) {
        type = 'mpegts';
    } else {
        type = 'mp4';
    }

    if (url.includes('.aac')) {
        type = 'AAC';
    }


    const create_player = async () => {
        let auduo1 = {
                        fftsize: 128,
                        updataBufferPerSecond: 15,
                        renderPerSecond: 15,
                        audioDrawType: '1',
                        bufferSize: 0.2,
                        crypto: null,
                        audioPlayback: {
                            method: 'MSE', // 'MSE' 或 'AudioContext'
                            },
                        };
        let config = {
            url: url,
            contentEl: containerRef.current!,
            showAudio: true,
            hasAudio: true,
            isLive: false,
            errorUrl: '',
            streamType: type,
          };
        if (type === 'AAC') {
            config = Object.assign(config, auduo1);
         }
        const playerService =createPlayerServiceInstance(config);

        if (type === 'AAC') {
            playerService!.createBetaPlayer();
        } else {
            playerService!.createMp4player({ type: type });
        }

        playerRef.current = playerService;
    };

    useEffect(() => {
        create_player();
    }, []);


    return (<div className={className} ref={containerRef} style={{ height: '200px' }} />);
};

export default OfflineVideo;