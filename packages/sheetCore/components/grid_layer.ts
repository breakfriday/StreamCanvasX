import Konva from 'konva';

const grid_layer = () => {
  const grid_layer = new Konva.Layer();

  const rects = [];
  const rectWidth = 100;
  const rectHeight = 50;
  const padding = 0;
  const cols = Math.floor(stage.width() / (rectWidth + padding));
  const rows = Math.floor(stage.height() / (rectHeight + padding));
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const rect = new Konva.Rect({
        x: i * (rectWidth + padding),
        y: j * (rectHeight + padding),
        width: rectWidth,
        height: rectHeight,
        fill: 'white',
        stroke: 'lightgray',
        strokeWidth: 1,
        draggable: false,
      });
      rects.push(rect);
      grid_layer.add(rect);
    }
  }

  return grid_layer;
};



export default grid_layer