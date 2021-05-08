import React from "react";
import { format } from "date-fns";
import numeral from "numeral";
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from "victory";
import { theme } from "styles";
import { data } from "./mock";

const mappedData =
  data.map((ele: any) => ({
    date: ele.date,
    price: ele.count,
  })) || [];

const Example = () => {
  return (
    <div style={{ width: "50vw", height: "80vh" }}>
      <VictoryChart
        height={1000}
        width={2000}
        domainPadding={10}
        theme={VictoryTheme.material}
      >
        {/* x || data */}
        <VictoryAxis
          tickCount={3}
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
  );
};

export default Example;
