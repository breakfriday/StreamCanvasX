import Konva from 'konva';
import React, { useRef, useEffect } from 'react';
import RacingGame from './components/RaceGame';

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let Game = '';


  const draw = () => {

  };
  useEffect(() => {
    if (canvasRef.current) {
      Game = new RacingGame('stage');
      Game.loadImage('https://pic.616pic.com/ys_img/00/07/77/xOsqgV61fT.jpg');
    }
  }, []);


  return (
    <>
      <div>

        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            Game.startRace();

            debugger
          }}
        >start_game
        </div>

        <div ref={canvasRef} id="stage" />
      </div>

    </>
  );
};

export default Home;
