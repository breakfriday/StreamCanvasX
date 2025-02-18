import React, { useState, useRef, useEffect } from 'react';
import { Button, Slider } from 'antd';
import styles from './index.module.css';

import {
  PlayCircleOutlined, PauseCircleOutlined,
} from '@ant-design/icons';


const AudioComponent = ({ src, position = '' }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }
  };

  const updateTime = () => {
    if (audioRef.current.currentTime === audioRef.current.duration) setIsPlaying(false);
    setCurrentTime(audioRef.current.currentTime);
    if (!duration) {
      setDuration(audioRef.current.duration);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
    }


    return () => {
      if (audio) {
        audio.removeEventListener('loadedmetadata', () => {
        });
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', updateTime);
    }


    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', updateTime);
      }
    };
  }, [duration]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const onSliderChange = value => {
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <div className={styles.audioMessage}>
      <audio ref={audioRef} src={src} preload="metadata" />

      <div>
        {isPlaying === false ? <PlayCircleOutlined onClick={togglePlayPause} /> : <PauseCircleOutlined onClick={togglePlayPause} />}
      </div>
      <Slider
        min={0}
        max={duration}
        value={currentTime}
        onChange={onSliderChange}
        tipFormatter={formatTime}
        styles={{
          track: {
            background: `${position === 'right' ? 'var(--white)' : ''}`,
          },
        }}
        style={{ width: 200 }}
        className={styles['slider_progress']}
      />
      <div>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

export default AudioComponent;
