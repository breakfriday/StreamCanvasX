import Konva from 'konva';


const cell_shape = (cellWidth, cellHeight, x_inx, y_inx) => {
  const cell = new Konva.Group({
    x: x_inx * cellWidth,
    y: y_inx * cellHeight,
    width: cellWidth,
    height: cellHeight,
  });

  const cellRect = new Konva.Rect({
    x: 0,
    y: 0,
    width: cellWidth,
    height: cellHeight,
    fill: 'white',
    stroke: 'lightgray',
    strokeWidth: 1,
  });

  const cellText = new Konva.Text({
    x: cellWidth / 2,
    y: cellHeight / 2,
    text: (x_inx * 10 + y_inx).toString(),
    fontSize: 20,
    fontFamily: 'Calibri',
    fill: 'black',
    align: 'center',
    listening: false,
  });

  cell.add(cellRect);
  cell.add(cellText);

  return cell;
};


export default cell_shape;
