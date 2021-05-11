import React from "react";
import { Grid } from "@material-ui/core";
import useAxios from "axios-hooks";
import numeral from "numeral";
import { constantCase } from "change-case";
import CoinChart from "containers/CoinChart";
import { theme } from "styles";
import { CoinDataProps } from "./interfaces";
import { SC } from "./styled";
import { Pagination, Skeleton } from "@material-ui/lab";
import styled from "styled-components";

const CHART_BOX_SIZE = {
  height: 40,
  width: 150,
};

const MAX_PAGE_COUNT = 250;

const CoinsContainer = styled.div`
  height: calc(100vh - 4rem);
  overflow: hidden;
  overflow-y: auto;
`;

const PaginationWrapper = styled.div`
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Coins = () => {
  const [page, setPage] = React.useState<number>(1);
  const [{ data, loading }, reFetch] = useAxios<CoinDataProps[]>(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&page=${page}&sparkline=false&price_change_percentage=1h%2C24h%2C7d
`
  );

  const TableHeader = () => {
    return (
      <SC.TableHeaderRow>
        <th align="left">#</th>
        <th align="left">Coin</th>
        <th align="left">Price</th>
        <th align="left">24h %</th>
        <th align="left">7d %</th>
        <th align="left">24h Volume</th>
        <th align="left">Mkt Cap</th>
        <th align="left">Last 7 days</th>
      </SC.TableHeaderRow>
    );
  };

  const TableBody = () => {
    return (
      <>
        {data?.length
          ? data.map((ele) => {
              return (
                <SC.TableBodyRow>
                  <SC.TableData>{ele.market_cap_rank}</SC.TableData>
                  <SC.TableData>
                    <div>
                      <img
                        height="20rem"
                        width="20rem"
                        src={ele.image}
                        alt={ele.name}
                      />
                    </div>
                    <b>{ele.name}</b>
                    <div style={{ color: theme.colors.primary }}>
                      {constantCase(ele.symbol)}
                    </div>
                  </SC.TableData>
                  <SC.TableData>
                    {numeral(ele.current_price).format("$0,0.00")}
                  </SC.TableData>
                  <SC.TableData
                    color={
                      Math.sign(ele.price_change_percentage_24h) >= 0
                        ? theme.colors.lime
                        : theme.colors.red
                    }
                  >
                    {numeral(ele.price_change_percentage_24h / 100).format(
                      "0.0%"
                    )}
                  </SC.TableData>
                  <SC.TableData
                    color={
                      Math.sign(ele.price_change_percentage_7d_in_currency) >= 0
                        ? theme.colors.lime
                        : theme.colors.red
                    }
                  >
                    {numeral(
                      ele.price_change_percentage_7d_in_currency / 100
                    ).format("0.0%")}
                  </SC.TableData>
                  <SC.TableData>
                    {numeral(ele.total_volume).format("$0,0")}
                  </SC.TableData>
                  <SC.TableData>
                    {numeral(ele.market_cap).format("$0,0")}
                  </SC.TableData>
                  <td width={CHART_BOX_SIZE.width}>
                    <CoinChart
                      height={CHART_BOX_SIZE.height}
                      width={CHART_BOX_SIZE.width}
                      color={
                        Math.sign(ele.price_change_percentage_7d_in_currency) >=
                        0
                          ? theme.colors.lime
                          : theme.colors.red
                      }
                      id={ele.id}
                    />
                  </td>
                </SC.TableBodyRow>
              );
            })
          : null}
      </>
    );
  };

  return (
    <CoinsContainer>
      <Grid container justify="center">
        <Grid xs={10} md={10}>
          {loading ? (
            <Skeleton variant="rect" height="100vh" width="100%" />
          ) : (
            <>
              <SC.Table width="100%">
                <TableHeader />
                <TableBody />
              </SC.Table>
              <PaginationWrapper>
                <Pagination
                  count={MAX_PAGE_COUNT}
                  page={page}
                  onChange={(e, pageNumber) => {
                    setPage(pageNumber);
                    reFetch();
                  }}
                />
              </PaginationWrapper>
            </>
          )}
        </Grid>
      </Grid>
    </CoinsContainer>
  );
};

export default Coins;
