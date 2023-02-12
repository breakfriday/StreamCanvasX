import React, { useRef, useEffect } from 'react';
import Konva from 'konva';


const grid: any = '';


const Sheet = React.forwardRef<HTMLImageElement>((props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const draw = () => {
    // first we need to create a stage
    const stage = new Konva.Stage({
      container: 'stage', // id of container <div>
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const layer = new Konva.Layer();

    const group = new Konva.Group({
      x: stage.width() / 2,
      y: stage.height() / 2,
    });

    const text = new Konva.Text({
      text: 'Click to edit',
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: 'black',
      padding: 20,
      align: 'center',
      editable: true,
      draggable: true,

    });
    const textWidth = text.width();
    text.x((stage.width() - textWidth) / 2);
    text.y(stage.height() / 2);

    text.on('dblclick', function (e) {
      this.text(location.href);
      const textWidth = this.width();

      text.x((stage.width() - textWidth) / 2);


      layer.draw();
    });


    layer.add(text);
    stage.add(layer);
  };
  useEffect(() => {
    if (canvasRef.current) {
      draw();
    }
  }, []);


  return (
    <div>

      <div onClick={() => {
        grid.grid_layer.clear();
      }}
      >clear
      </div>

      <div ref={canvasRef} id="stage" />
    </div>);
});
export default Sheet;
