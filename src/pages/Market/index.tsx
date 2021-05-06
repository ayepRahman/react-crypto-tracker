import React from "react";
import { format } from "date-fns";
import numeral from "numeral";
import useAxios from "axios-hooks";
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from "victory";
import { theme } from "styles";

/**
 * Market displaying hisotrical data
 */

const url =
  "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=14";

const Market = () => {
  const [{ data, loading, error }, refetch] = useAxios(url);

  if (loading) return <div>loading</div>;

  console.log(data);
  const mappedData =
    data?.prices.map((ele: any) => ({
      date: ele[0],
      price: ele[1],
    })) || [];

  return (
    <div>
      <h4>Bitcoin</h4>
      <div style={{ width: "50vw", height: "80vh" }}>
        <VictoryChart
          height={1000}
          width={2000}
          domainPadding={10}
          theme={VictoryTheme.material}
        >
          {/* x || data */}
          <VictoryAxis
            tickCount={20}
            tickFormat={(date) => {
              console.log(date);
              return format(new Date(date), "d MMM yyy");
            }}
          />
          {/* y || price */}
          <VictoryAxis
            dependentAxis
            tickFormat={(price) => {
              return numeral(price).format("$0,0");
            }}
          />
          <VictoryLine
            style={{
              data: { stroke: theme.colors.niceblue, strokeWidth: 6 },
              // parent: { border: "px solid #ccc" },
            }}
            // interpolation="natural"
            data={mappedData}
            x={"date"}
            y={"price"}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default Market;
