import React, { useMemo, useCallback } from "react";
import { format } from "date-fns";
import numeral from "numeral";
import {
  AreaClosed,
  Area,
  Line,
  Bar,
  GridRows,
  GridColumns,
  withTooltip,
  Tooltip,
  useTooltip,
  TooltipWithBounds,
  defaultStyles as defaultToopTipStyles,
  localPoint,
  LinearGradient,
} from "@visx/visx";
import { curveMonotoneX } from "@visx/curve";
import { scaleTime, scaleLinear } from "@visx/scale";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { max, extent, bisector } from "d3-array";
import { MainChartProps, TooltipData, DataProps } from "./interfaces";
// import { theme } from "styles";

// const data = appleStock.slice(1000);

// TODO:
// YAxis - display price
// XAxis - display date
// Toltip - TO show Both Prices and Date

export const background = "#3b6978";
export const background2 = "#204051";
export const accentColor = "#edffea";
export const accentColorDark = "#75daad";
const tooltipStyles = {
  ...defaultToopTipStyles,
  background,
  padding: "0.5rem",
  border: "1px solid white",
  color: "white",
};

// accessors
const getDate = (d: DataProps) => new Date(d.date);
const getStockValue = (d: DataProps) => d.price;
const getFormatValue = (d: DataProps) => numeral(d.price).format("$0,0");
const bisectDate = bisector<DataProps, Date>((d) => new Date(d.date)).left;

const MainChart: React.FC<MainChartProps> = ({
  data,
  width = 10,
  height,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
}) => {
  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  } = useTooltip<TooltipData>();

  // bounds
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // scales
  const dateScale = useMemo(() => {
    return scaleTime({
      range: [margin.left, innerWidth + margin.left],
      domain: extent(data, getDate) as [Date, Date],
    });
  }, [innerWidth, margin.left, data]);
  const valueScale = useMemo(() => {
    return scaleLinear({
      // range: [0, 1],
      range: [innerHeight + margin.top, margin.top],
      domain: [0, (max(data, getStockValue) || 0) + innerHeight / 3],
      // domain: [0, (max(data, getStockValue) || 0) + innerHeight / 3],
      nice: true,
    });
    //
  }, [margin.top, innerHeight, data]);

  // tooltip handler
  const handleTooltip = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x);
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;

      if (d1 && getDate(d1)) {
        d =
          x0.valueOf() - getDate(d0).valueOf() >
          getDate(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }

      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: valueScale(getStockValue(d)),
      });
    },
    [showTooltip, valueScale, dateScale, data]
  );

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#area-background-gradient)"
          // fill="transparent"
          // rx control the border curve of rect
          // rx={16}
        />
        <LinearGradient
          id="area-background-gradient"
          from={background}
          to={background2}
        />
        <LinearGradient
          id="area-gradient"
          from={accentColor}
          to={accentColor}
          toOpacity={0.1}
        />
        {/* <GridRows
            left={margin.left}
            scale={stockValueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents="none"
          /> */}
        {/* <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.2}
            pointerEvents="none"
          /> */}
        <AreaClosed<DataProps>
          data={data}
          x={(d) => dateScale(getDate(d)) ?? 0}
          y={(d) => valueScale(getStockValue(d)) ?? 0}
          yScale={valueScale}
          strokeWidth={1}
          // color uses lineGradient component id to draw
          stroke="url(#area-gradient)"
          fill="url(#area-gradient)"
          curve={curveMonotoneX}
        />
        {/* a transparent ele that track the pointer event, allow us to display tooltup */}
        <Bar
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {/* drawing the line and circle indicator to be display in cursor over a
          selected area */}
        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: innerHeight + margin.top }}
              stroke={accentColorDark}
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill={accentColorDark}
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
      </svg>
      {tooltipData && (
        <div>
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop - 12}
            left={tooltipLeft + 12}
            style={tooltipStyles}
          >
            <ul style={{ padding: "0", margin: "0", listStyle: "none" }}>
              <li style={{ paddingBottom: "0.25rem" }}>
                <b>{format(getDate(tooltipData), "PPpp")}</b>
              </li>
              <li>
                Price: <b>{`${getFormatValue(tooltipData)}`}</b>
              </li>
            </ul>
          </TooltipWithBounds>
        </div>
      )}
    </div>
  );
};

export default MainChart;
