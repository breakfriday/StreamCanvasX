import { Rect } from 'konva/lib/shapes/Rect';
import Konva from 'konva';

const creat_cells = (stage_width, stage_height, cell_width: 100, cell_height: 50) => {
  const rects: Rect[] = [];
  const rectWidth = cell_width;
  const rectHeight = cell_height;
  const padding = 0;
  const cols = Math.floor(stage_width / (rectWidth + padding));
  const rows = Math.floor(stage_height / (rectHeight + padding));
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
    }
  }

  return rects;
};

