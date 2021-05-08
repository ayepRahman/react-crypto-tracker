import React from "react";
import { Grid, Snackbar, SnackbarCloseReason } from "@material-ui/core";
import { Skeleton, Alert } from "@material-ui/lab";
import useAxios from "axios-hooks";
import MainChart from "components/MainChart";
import TimeFilterButtons from "components/TimeFilterButtons";
import { SC } from "./styled";
import { DataProps } from "components/MainChart/interfaces";

const Market = () => {
  const [timeFilter, setTimeFilter] = React.useState<string>("1");
  const [isErrorMessage, setIsErrorMessage] = React.useState<string>("");
  const [boxSize, setBoxSize] = React.useState<{
    height: number;
    width: number;
  }>({
    height: 400,
    width: 0,
  });
  const [{ data, loading, error }] = useAxios(
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${timeFilter}`
  );
  const gridItemRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (error) {
      setIsErrorMessage(error.message);
    }
  }, [error]);

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

  const mappedData: DataProps[] = data
    ? data?.prices.map((ele: any) => ({
        date: new Date(ele[0]),
        price: ele[1],
      }))
    : [];

  const handleError = (
    e: React.SyntheticEvent<any>,
    reason?: SnackbarCloseReason
  ) => {
    setIsErrorMessage("");
  };

  return (
    <Grid container justify="center">
      <Grid ref={gridItemRef} item xs={8}>
        <SC.MarketHeader>
          <h1>Bitcoin</h1>
          <TimeFilterButtons
            value={timeFilter}
            onChange={(v) => setTimeFilter(v || "")}
          />
        </SC.MarketHeader>
        {loading ? (
          <Skeleton
            variant="rect"
            height={boxSize.height}
            width={boxSize.width}
          />
        ) : (
          <MainChart
            data={mappedData}
            height={boxSize.height}
            width={boxSize.width}
          />
        )}
      </Grid>
      <Snackbar open={!!isErrorMessage} onClose={handleError}>
        <Alert onClose={handleError} severity="error">
          {isErrorMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Market;
