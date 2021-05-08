export interface DataProps {
  date: string;
  close: number;
}

export interface MainChartProps {
  data: DataProps[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

export type TooltipData = DataProps;
