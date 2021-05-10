import React from "react";
import { DataProps } from "interfaces/DataProps";

export interface SecondaryChartProps {
  data: DataProps[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const SecondaryChart: React.FC<SecondaryChartProps> = ({
  data,
  width = 10,
  height,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
}) => {
  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}></svg>
    </div>
  );
};

export default SecondaryChart;
