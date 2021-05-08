import React from "react";
import { Grid } from "@material-ui/core";
import useAxios from "axios-hooks";
import MainChart from "components/MainChart";
import numeral from "numeral";
import { ButtonGroup, Button } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import styled from "styled-components";
import useOptionalControlledState from "hooks/useOptionalControlledState";
import { TimeFilters } from "enums/TimeFilters";

export const TimePeriod: {
  [key: string]: TimeFilters;
} = {
  "1D": TimeFilters.P1D,
  "7D": TimeFilters.P7D,
  "1M": TimeFilters.P1M,
  "3M": TimeFilters.P3M,
  "1Y": TimeFilters.P1Y,
  ALL: TimeFilters.ALL,
};

export const TimeFilterButtons: React.FC<{
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
}> = ({ value, defaultValue, onChange }) => {
  const [filter, setFilter] = useOptionalControlledState<string | undefined>({
    controlledValue: value,
    initialValue: TimeFilters.P1D,
    onChange,
  });
  console.log("FILTER", filter);

  return (
    <ToggleButtonGroup
      value={filter}
      exclusive
      onChange={(e, v) => {
        console.log("ToggleButtonGroup", v);
        setFilter(v);
      }}
      color="primary"
      aria-label="outlined primary button group"
    >
      {Object.keys(TimePeriod).map((t) => {
        return (
          <ToggleButton key={t} value={TimePeriod[t]}>
            {t}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
};

export default TimeFilterButtons;
