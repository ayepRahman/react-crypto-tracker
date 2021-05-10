import React from "react";
import {
  Group,
  LinePath,
  AxisLeft,
  AxisBottom,
  curveMonotoneX,
} from "@visx/visx";
import { LineChartProps } from "./interfaces";
import { DataProps } from "interfaces/DataProps";
import {
  AXIS_COLOR,
  AXIS_BOTTOM_TICK_LABEL_PROPS,
  AXIS_LEFT_TICK_LABEL_PROPS,
} from "./constants";

const AreaChart: React.FC<LineChartProps> = ({
  data,
  width,
  yMax,
  margin,
  xScale,
  yScale,
  hideBottomAxis = false,
  hideLeftAxis = false,
  stroke,
  top,
  left,
  xTickFormat,
  children,
}) => {
  // accessors
  const getDate = (d: DataProps) => new Date(d?.date);
  const getStockValue = (d: DataProps) => d?.price;

  if (width < 10) return null;
  return (
    <Group left={left || margin.left} top={top || margin.top}>
      <LinePath<DataProps>
        data={data}
        x={(d) => xScale(getDate(d)) || 0}
        y={(d) => yScale(getStockValue(d)) || 0}
        strokeWidth={1.5}
        stroke={stroke}
        curve={curveMonotoneX}
      />
      {!hideBottomAxis && (
        <AxisBottom
          top={yMax}
          scale={xScale}
          numTicks={width > 520 ? 10 : 5}
          stroke={AXIS_COLOR}
          tickStroke={AXIS_COLOR}
          tickLabelProps={() => AXIS_BOTTOM_TICK_LABEL_PROPS}
        />
      )}
      {!hideLeftAxis && (
        <AxisLeft
          scale={yScale}
          numTicks={5}
          stroke={AXIS_COLOR}
          tickStroke={AXIS_COLOR}
          tickLabelProps={() => AXIS_LEFT_TICK_LABEL_PROPS}
          tickFormat={(d) => {
            return xTickFormat ? xTickFormat(d) : d;
          }}
        />
      )}
      {children}
    </Group>
  );
};

export default AreaChart;
