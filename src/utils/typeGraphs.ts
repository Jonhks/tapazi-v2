import { GoogleChartWrapperChartType } from "react-google-charts";

type typeGraph = {
  name: GoogleChartWrapperChartType;
  id: string;
};

export const typeGraphs: typeGraph[] = [
  {
    name: "ColumnChart",
    id: "1",
  },
  {
    name: "LineChart",
    id: "2",
  },
  {
    name: "ScatterChart",
    id: "13",
  },
  {
    name: "Table",
    id: "15",
  },
];
