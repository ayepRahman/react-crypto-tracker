import React from "react";
import { Grid, Snackbar, SnackbarCloseReason } from "@material-ui/core";
import { Skeleton, Alert } from "@material-ui/lab";
import useAxios from "axios-hooks";
import PrimaryChart from "components/PrimaryChart";
import SecondaryChart from "components/SecondaryChart";
import TimeFilterButtons from "components/TimeFilterButtons";
import { SC } from "./styled";
import { DataProps } from "interfaces/DataProps";
import useWindowDimensions from "hooks/useWindowDimensions";
import { useQueryParams, StringParam } from "use-query-params";
import { MarketContext } from "store/MarketProvider";
import styled from "styled-components";

// https://api.coingecko.com/api/v3/coins/bitcoin?tickers=false&community_data=false&developer_data=false&sparkline=false

const Card = styled.div`
  border-radius: 8px;
  padding: 1rem;
  background: ${(p) => p.theme.colors.light};
  color: ${(p) => p.theme.colors.primary};
`;

const Header = styled.h2`
  display: flex;
  margin: 0;
`;

const Img = styled.img``;

const MarketChart = () => {
  const {
    filteredDataState: { filteredData },
  } = React.useContext(MarketContext);

  const [queryParams] = useQueryParams({
    id: StringParam,
    name: StringParam,
  });
  const [timeFilter, setTimeFilter] = React.useState<string>("1");
  const [isErrorMessage, setIsErrorMessage] = React.useState<string>("");
  const [boxWidth, setBoxWidth] = React.useState<number>(0);
  const { height } = useWindowDimensions();
  const [
    {
      data: coinChartData,
      loading: isLoadingCoinChartData,
      error: coinChartDataError,
    },
    fetch,
  ] = useAxios(
    {
      url: `https://api.coingecko.com/api/v3/coins/${queryParams?.id}/market_chart?vs_currency=usd&days=${timeFilter}`,
      method: "GET",
    },
    { manual: true }
  );
  const gridItemRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (queryParams.id && queryParams.name) {
      fetch();
    }
  }, [fetch, queryParams, queryParams.id, queryParams.name]);

  React.useEffect(() => {
    if (coinChartDataError) {
      setIsErrorMessage(coinChartDataError.message);
    }
  }, [coinChartDataError]);

  React.useEffect(() => {
    const handleResize = (width?: number) => {
      setBoxWidth(width || 0);
    };

    handleResize(gridItemRef.current?.clientWidth || 0);

    window.addEventListener("resize", () =>
      handleResize(gridItemRef?.current?.clientWidth || 0)
    );

    return () => {
      window.removeEventListener("resize", () => handleResize());
    };
  }, [gridItemRef]);

  const mappedData: DataProps[] = React.useMemo(() => {
    return coinChartData
      ? coinChartData?.prices.map((ele: any) => ({
          date: new Date(ele[0]),
          price: ele[1],
        }))
      : [];
  }, [coinChartData]);

  const handleError = (
    e: React.SyntheticEvent<any>,
    reason?: SnackbarCloseReason
  ) => {
    setIsErrorMessage("");
  };

  return (
    <Grid item ref={gridItemRef} xs={12} md={8} lg={8} xl={6}>
      <SC.MarketHeader>
        <SC.Title>{queryParams?.name}</SC.Title>
        <TimeFilterButtons
          value={timeFilter}
          onChange={(v) => setTimeFilter(v || "")}
        />
      </SC.MarketHeader>
      {isLoadingCoinChartData ? (
        <Skeleton
          variant="rect"
          height={Math.floor(height * 0.6)}
          width={boxWidth}
        />
      ) : mappedData?.length ? (
        <>
          <PrimaryChart
            data={filteredData ?? []}
            height={Math.floor(height * 0.4)}
            width={boxWidth}
            margin={{
              top: 16,
              right: 16,
              bottom: 40,
              left: 48,
            }}
          />
          <SecondaryChart
            data={mappedData ?? []}
            height={Math.floor(height * 0.1)}
            width={boxWidth}
            margin={{
              top: 0,
              right: 16,
              bottom: 24,
              left: 48,
            }}
          />
        </>
      ) : null}
      <Snackbar open={!!isErrorMessage} onClose={handleError}>
        <Alert onClose={handleError} severity="error">
          {isErrorMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export interface GetCoinStatisticResponse {
  id: string;
  name: string;
  img: {
    large: string;
    small: string;
    thumb: string;
  };
}

const CoinStatistic = () => {
  const [queryParams] = useQueryParams({
    id: StringParam,
  });

  const [
    { data: coinData, loading: isLoadingCoinData, error: coinDataError },
    fetch,
  ] = useAxios<GetCoinStatisticResponse | null>(
    {
      url: `https://api.coingecko.com/api/v3/coins/${queryParams?.id}?tickers=false&community_data=false&developer_data=false&sparkline=false`,
      method: "GET",
    },
    { manual: true }
  );

  console.log(coinData);

  React.useEffect(() => {
    if (queryParams?.id) {
      fetch();
    }
  }, [queryParams.id, fetch]);

  return (
    <Grid item xs={12} md={4} lg={4} xl={2}>
      <Card>
        <Header>
          <Img /> {coinData?.name} Price Statistics (USD)
        </Header>
      </Card>
    </Grid>
  );
};

const Market = () => {
  return (
    <Grid container justify="center" spacing={2}>
      <MarketChart />
      <CoinStatistic />
    </Grid>
  );
};

export default Market;
