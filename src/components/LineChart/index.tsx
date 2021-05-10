import React from "react";
import {
  Group,
  AreaClosed,
  // AreaClosedProps,
  LinePath,
  AxisLeft,
  AxisBottom,
  AxisScale,
  LinearGradient,
  curveMonotoneX,
} from "@visx/visx";
import { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";
import { DataProps } from "components/MainChart/interfaces";

//TODO: figure how to add axis in linepath
// figure how to show tick base on margin

// Initialize some variables
const axisColor = "black";
const axisBottomTickLabelProps = {
  textAnchor: "middle" as const,
  fontFamily: "Arial",
  fontSize: 10,
  fill: axisColor,
};
const axisLeftTickLabelProps = {
  dx: "-0.25em",
  dy: "0.25em",
  fontFamily: "Arial",
  fontSize: 10,
  textAnchor: "end" as const,
  fill: axisColor,
};

export interface LineChartProps {
  data: DataProps[];
  // gradientColor: string;
  xScale: AxisScale<number>;
  yScale: AxisScale<number>;
  width: number;
  yMax: number;
  margin: { top: number; right: number; bottom: number; left: number };
  hideBottomAxis?: boolean;
  stroke: string;
  hideLeftAxis?: boolean;
  top?: number;
  left?: number;
  children?: React.ReactNode;
}

const LineChart: React.FC<LineChartProps> = ({
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
  children,
}) => {
  // accessors
  const getDate = (d: DataProps) => new Date(d?.date);
  const getStockValue = (d: DataProps) => d?.price;

  if (width < 10) return null;
  return (
    <Group left={left || margin.left} top={top || margin.top}>
      {/* <LinearGradient
        id="gradient"
        from={gradientColor}
        fromOpacity={1}
        to={gradientColor}
        toOpacity={1}
      /> */}
      <LinePath<DataProps>
        data={data}
        x={(d) => xScale(getDate(d)) || 0}
        y={(d) => yScale(getStockValue(d)) || 0}
        // yScale={(d: DataProps) => yScale(getDate(d)) || 0}
        strokeWidth={1.5}
        stroke={stroke}
        curve={curveMonotoneX}
      />
      {!hideBottomAxis && (
        <AxisBottom
          top={yMax}
          scale={xScale}
          numTicks={width > 520 ? 10 : 5}
          stroke={axisColor}
          tickStroke={axisColor}
          // tickFormat={(d) => {
          //   console.log(d);
          //   return d;
          // }}
          // tickFormat=(d => {
          //   return d
          // })
          tickLabelProps={() => axisBottomTickLabelProps}
        />
      )}
      {!hideLeftAxis && (
        <AxisLeft
          scale={yScale}
          numTicks={5}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisLeftTickLabelProps}
        />
      )}
      {children}
    </Group>
  );
};

export default LineChart;
