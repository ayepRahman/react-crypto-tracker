import React from "react";
import { Grid } from "@material-ui/core";
import useAxios from "axios-hooks";
import MainChart from "components/MainChart";
import numeral from "numeral";
import { ButtonGroup, Button } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import styled from "styled-components";
import TimeFilterButtons from "components/TimeFilterButtons";
import useOptionalControlledState from "hooks/useOptionalControlledState";

/**
 * Market displaying hisotrical data
 */

const MarketHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// export enum TimePeriod {
//   P7D
//   P1M
// }

// TimePeriod enum

const Market = () => {
  const [timeFilter, setTimeFilter] = React.useState<string>("1");
  const [boxSize, setBoxSize] = React.useState<{
    height: number;
    width: number;
  }>({
    height: 400,
    width: 0,
  });
  const [{ data, loading, error }, refetch] = useAxios(
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${timeFilter}`
  );
  const gridItemRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleResize = (height?: number, width?: number) => {
      setBoxSize({
        height: boxSize.height,
        width: width || 0,
      });
    };

    handleResize(boxSize.height, gridItemRef.current?.clientWidth || 0);

    window.addEventListener("resize", () =>
      handleResize(boxSize.height, gridItemRef?.current?.clientWidth || 0)
    );

    // return () => {
    //   window.removeEventListener("resize", () => handleResize());
    // };
  }, [gridItemRef, boxSize.height]);

  const mappedData: { date: string; close: number }[] = data
    ? data?.prices.map((ele: any) => ({
        date: new Date(ele[0]),
        close: ele[1],
      }))
    : [];

  return (
    <Grid container justify="center">
      <Grid ref={gridItemRef} item xs={8}>
        <MarketHeader>
          <h1>Bitcoin</h1>
          <TimeFilterButtons
            value={timeFilter}
            onChange={(v) => setTimeFilter(v || "")}
          />
        </MarketHeader>
        <MainChart
          data={mappedData}
          height={boxSize.height}
          width={boxSize.width}
        />
      </Grid>
    </Grid>
  );
};

export default Market;
