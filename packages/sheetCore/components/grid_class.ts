import Konva from 'konva';
import { Rect } from 'konva/lib/shapes/Rect';
import { Stage } from 'konva/lib/Stage';
import { Group } from 'konva/lib/Group';

class Grid_layer {
  private stage_width: number;
  private stage_height: number;
  private layer: any;
  private stage: Stage;
  constructor(stage) {
    this.stage_width = stage.width();
    this.stage_height = stage.height();
    this.stage = stage;
    this.create_grid_layer();

    this.cell_hover_event();
  }

  create_grid_layer() {
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
  }

  create_cell_group(x, y, w, h) {
    const cell_group = new Konva.Group({
      x,
      y,
      width: w,
      height: h,
      data: {
        name: '从前有座山',
      },
    });

    const square = new Konva.Rect({
      x: 0,
      y: 0,
      width: w,
      height: h,
      fill: 'white',
      stroke: 'lightgray',
      strokeWidth: 1,
      draggable: false,
      data: {
        cell_x: x,
        cell_y: y,

        name2: '从前有座山',
      },
    });

    const text = new Konva.Text({
      x: 0,
      y: 0,
      width: w,
      height: h,
      fontFamily: 'Calibri',
      fontSize: 14,
      fill: 'black',
      text: 'hello_word',
      align: 'center',

      textDecoration: '',

    });

    cell_group.add(square);
    cell_group.add(text);

    return cell_group;
  }

  create_cell(cell_width, cell_height) {
    const rects: Group[] = [];
    const rectWidth = cell_width;
    const rectHeight = cell_height;
    const padding = 0;
    const cols = Math.floor(this.stage_width / (rectWidth + padding));
    const rows = Math.floor(this.stage_height / (rectHeight + padding));
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * (rectWidth + padding);
        const y = j * (rectHeight + padding);

        const cell_group = this.create_cell_group(x, y, cell_width, cell_height);
        rects.push(cell_group);

        this.layer.add(cell_group);
      }
    }
  }

  render_layer() {
    this.create_cell(100, 50);
    this.layer.draw();
  }

  cell_hover_event() {
    this.layer.on('mouseover', (evt) => {
      const shape = evt.target;
      document.body.style.cursor = 'pointer';
      shape.fill('#00D2FF');
      this.layer.draw();
    });
    this.layer.on('mouseout', (evt) => {
      const shape = evt.target;
      document.body.style.cursor = 'default';
      shape.fill('black');
      this.layer.draw();
    });

    this.layer.on('click', (evt) => {
      const shape = evt.target;

      const x = evt.evt.layerX;
      const y = evt.evt.layerY;

      alert(
        `Cell index: (${
          Math.floor(x / 100) + 1
        }, ${
          Math.floor(y / 50) + 1
        })`,
      );
    });
  }
}


export default Grid_layer;
