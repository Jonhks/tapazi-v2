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
    name: "AreaChart",
    id: "3",
  },
  {
    name: "BarChart",
    id: "4",
  },
  {
    name: "ComboChart",
    id: "6",
  },
  {
    name: "PieChart",
    id: "7",
  },
  {
    name: "DonutChart",
    id: "8",
  },
  {
    name: "ScatterChart",
    id: "13",
  },
  {
    name: "SteppedAreaChart",
    id: "14",
  },
  {
    name: "Table",
    id: "15",
  },
];
