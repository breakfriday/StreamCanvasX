import React, { memo } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { isNull } from './helpers';


/**
 * Default cell component
 * @param props
 */
const Cell: React.FC = memo((props: any) => {
  const {
    x = 0,
    y = 0,
    width,
    height,
    value,
    fill = 'white',
    strokeWidth = 1,
    stroke = '#d9d9d9',
    align = 'left',
    verticalAlign = 'middle',
    textColor = '#333',
    padding = 5,
    fontFamily = 'Arial',
    fontSize = 12,
    children,
    wrap = 'none',
    fontWeight = 'normal',
    fontStyle = 'normal',
    textDecoration,
    alpha = 1,
    strokeEnabled = true,
    globalCompositeOperation = 'multiply',
    isOverlay,
    ...rest
  } = props;
  if (isOverlay) return null;
  const fillEnabled = !!fill;
  const textStyle = `${fontWeight} ${fontStyle}`;
  return (
    <Group {...rest}>
      <Rect
        x={x + 0.5}
        y={y + 0.5}
        height={height}
        width={width}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        shadowForStrokeEnabled={false}
        strokeScaleEnabled={false}
        hitStrokeWidth={0}
        alpha={alpha}
        fillEnabled={fillEnabled}
        strokeEnabled={strokeEnabled}
      />
      {isNull(value) ? null : (
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={value}
          fill={textColor}
          verticalAlign={verticalAlign}
          align={align}
          fontFamily={fontFamily}
          fontStyle={textStyle}
          textDecoration={textDecoration}
          padding={padding}
          wrap={wrap}
          fontSize={fontSize}
          hitStrokeWidth={0}
        />
      )}
      {children}
    </Group>
  );
});

/**
 * Default CellRenderer
 * @param props
 */
const CellRenderer = (props: any) => {
  return <Cell {...props} />;
};

export default CellRenderer;
export { CellRenderer, Cell };
