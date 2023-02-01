import Konva from 'konva';
import cell_shape from './celll';

const grid_layer = () => {
  const grid_layer = new Konva.Layer();


  const cellSize = 60;
  const gridSize = 100;


  const cell_render = (cellSize, i, j) => {
    return new Konva.Rect({
      x: i * cellSize,
      y: j * cellSize,
      width: cellSize,
      height: cellSize,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 1,
    });
  };

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
    //   const cell = new Konva.Rect({
    //     x: j * cellSize,
    //     y: i * cellSize,
    //     width: cellSize,
    //     height: cellSize,
    //     fill: 'white',
    //     stroke: 'lightgray',
    //     strokeWidth: 1,
    //   });

      const cell = cell_shape(cellSize, cellSize, i, j);
      cell.on('click', function () {
        alert(
          `Cell index: (${
            Math.floor(this.y() / cellSize)
          }, ${
            Math.floor(this.x() / cellSize)
          })`,
        );
      });

  

      //   cell.on('mouseover', (evt) => {
      //     const shape = evt.target;
      //     shape.fill('blue');

      //   });
      //   cell.on('mouseout', (evt) => {
      //     const shape = evt.target;
      //     shape.fill('white');

      //   });

      grid_layer.add(cell);
    }
  }

  return grid_layer;
};


export default grid_layer;
