
import Konva from 'konva';
import { Rect } from 'konva/lib/shapes/Rect';

import grid_cells from './grid_cell';

const grid_layer = (stage: any) => {
  const layer = new Konva.Layer();

  const stage_width = stage.width();
  const stage_height = stage.height();

  const cells: Rect[] = grid_cells(stage_width, stage_height, 100, 50);


  debugger
  layer.add(cells);

  debugger

  return layer;
};


export default grid_layer;
