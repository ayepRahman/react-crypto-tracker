import React from "react";
import { DataProps } from "interfaces/DataProps";
import AreaChart from "components/AreaChart";
import { Brush, LinearGradient, scaleLinear, scaleTime } from "@visx/visx";
import BaseBrush, {
  BaseBrushState,
  UpdateBrush,
} from "@visx/brush/lib/BaseBrush";
import { Bounds } from "@visx/brush/lib/types";
import { max, min, extent, bisector } from "d3-array";
import { theme } from "styles";
import numeral from "numeral";

export interface SecondaryChartProps {
  data: DataProps[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

// accessors
const getDate = (d: DataProps) => new Date(d.date);
const getStockValue = (d: DataProps) => d.price;
const getFormatValue = (d: DataProps) => numeral(d.price).format("$0,0");
const bisectDate = bisector<DataProps, Date>((d) => new Date(d.date)).left;

const SecondaryChart: React.FC<SecondaryChartProps> = ({
  data,
  width = 10,
  height,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
}) => {
  const [filteredStock, setFilteredStock] = React.useState(data);
  const brushRef = React.useRef<BaseBrush | null>(null);
  // bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(height - margin.top - margin.bottom, 0);
  // const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
  // const yBrushMax = Math.max(
  //   bottomChartHeight - brushMargin.top - brushMargin.bottom,
  //   0
  // );

  // scales
  const dateScale = React.useMemo(() => {
    return scaleTime({
      range: [0, xMax],
      domain: extent(data, getDate) as [Date, Date],
    });
  }, [xMax, data]);
  const priceScale = React.useMemo(() => {
    return scaleLinear({
      range: [yMax + margin.top, margin.top],
      domain: [min(data, getStockValue) || 0, max(data, getStockValue) || 0],
      nice: true,
    });
    //
  }, [margin.top, yMax, data]);

  const initialBrushPosition = React.useMemo(
    () => ({
      start: { x: dateScale(getDate(data[50])) },
      end: { x: dateScale(getDate(data[100])) },
    }),
    [dateScale, data]
  );
  // const brushDateScale = React.useMemo(
  //   () =>
  //     scaleTime<number>({
  //       range: [0, xMax],
  //       domain: extent(data, getDate) as [Date, Date],
  //     }),
  //   [xMax]
  // );
  // const brushStockScale = React.useMemo(
  //   () =>
  //     scaleLinear({
  //       range: [yBrushMax, 0],
  //       domain: [0, max(stock, getStockValue) || 0],
  //       nice: true,
  //     }),
  //   [yBrushMax]
  // );

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1, y0, y1 } = domain;
    const filteredData = data.filter((s) => {
      const x = getDate(s).getTime();
      const y = getStockValue(s);
      return x > x0 && x < x1 && y > y0 && y < y1;
    });
    setFilteredStock(filteredData);
  };

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <AreaChart
          hideLeftAxis
          hideBottomAxis
          data={data}
          width={width}
          margin={{ ...margin }}
          yMax={yMax}
          xScale={dateScale}
          yScale={priceScale}
          gradientColor={theme.colors.lapislazuli}
        >
          <LinearGradient
            id="brush-gradient"
            from={theme.colors.primary}
            fromOpacity={0.5}
            to={theme.colors.primary}
            toOpacity={0.5}
          />
          <Brush
            innerRef={brushRef}
            xScale={dateScale}
            yScale={priceScale}
            width={xMax}
            height={yMax}
            margin={{ ...margin }}
            handleSize={8}
            resizeTriggerAreas={["left", "right"]}
            brushDirection="horizontal"
            initialBrushPosition={initialBrushPosition}
            onChange={onBrushChange}
            onClick={() => setFilteredStock(data)}
            selectedBoxStyle={{
              fill: `url(#brush-gradient)`,
              stroke: "white",
            }}
          />
        </AreaChart>
      </svg>
    </div>
  );
};

export default SecondaryChart;
