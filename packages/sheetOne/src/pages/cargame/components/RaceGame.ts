import Konva from 'konva';
import { Rect } from 'konva/lib/shapes/Rect';
import { Stage } from 'konva/lib/Stage';
import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';

class RacingGame {
  private stage: Stage;
  private layer: Layer;
  private carImage: any;
  private racetrack: any;
  private tween: any;
  private trackPath = [];

  get Layer(): Layer {
    return this.layer;
  }


  set Layer(value: Layer) {
    this.layer = value;
  }


  constructor(containerId) {
    this.stage = new Konva.Stage({
      container: containerId,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.carImage = null;
    this.racetrack = null;
    this.tween = null;
    this.trackPath = [];
  }

  loadImage(imageUrl) {
    const imageObj = new Image();
    imageObj.src = imageUrl;
    imageObj.onload = () => {
      this.createRacetrack();
      this.draw_circle()
      this.createRacingCar(imageObj);

      this.layer.draw();
    };
  }


  draw_circle() {
    const circle = new Konva.Circle({
      x: 400,
      y: 700,
      radius: 300,
      stroke: 'black',
      strokeWidth: 4,
    });
    this.layer.add(circle);
  }

  createRacingCar(imageObj) {
    this.carImage = new Konva.Image({
      image: imageObj,
      x: this.stage.width() / 2,
      y: this.stage.height() / 2 - 100,
      width: 50,
      height: 50,
      zIndex: 20,
      offset: {
        x: 25,
        y: 25,
      },
    });
    this.layer.add(this.carImage);
  }

  createRacetrack() {
    for (let i = 0; i < 1000; i += 1) {
      this.trackPath.push(
        50 * Math.sin(i / 50) +
          50 * Math.sin(i / 100) +
          50 * Math.sin(i / 200) +
          window.innerWidth / 2,
      );
      this.trackPath.push(i);
    }


    const track = new Konva.Line({
      points: this.trackPath,
      stroke: 'black',
      strokeWidth: 5,
    });
    this.layer.add(track);
  }

  startRace() {
    let x = 0;
    this.animation = new Konva.Animation((frame) => {
      x += 1;
      const nextX = this.trackPath[x * 4];
      const nextY = this.trackPath[x * 4 + 1];
      this.carImage.setX(nextX);
      this.carImage.setY(nextY);

      // prevent the car from going off the track
      if (x * 2 >= this.trackPath.length) {
        this.animation.stop();
      }
    }, this.layer);
    this.animation.start();
  }
}


export default RacingGame;
