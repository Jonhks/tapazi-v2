// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Chart, GoogleChartWrapperChartType } from "react-google-charts";

function TeamPerYearlogGraphic({
  graphType,
  data,
  title,
}: {
  graphType: GoogleChartWrapperChartType;
  data;
  title: string;
}) {
  const convertDataForGoogleChart = (
    data: {
      seed1: number;
      seed2: number;
      seed3: number;
      seed4: number;
      seed5: number;
      seed6: number;
      seed7: number;
      seed8: number;
      seed9: number;
      seed10: number;
      seed11: number;
      seed12: number;
      seed13: number;
      seed14: number;
      seed15: number;
      seed16: number;
      prcnt_teams_seed1: number;
      prcnt_teams_seed2: number;
      prcnt_teams_seed3: number;
      prcnt_teams_seed4: number;
      prcnt_teams_seed5: number;
      prcnt_teams_seed6: number;
      prcnt_teams_seed7: number;
      prcnt_teams_seed8: number;
      prcnt_teams_seed9: number;
      prcnt_teams_seed10: number;
      prcnt_teams_seed11: number;
      prcnt_teams_seed12: number;
      prcnt_teams_seed13: number;
      prcnt_teams_seed14: number;
      prcnt_teams_seed15: number;
      prcnt_teams_seed16: number;
      // total: number;
      // total_prcnt: number;
      // entries: number;
    }[]
  ): (string | number)[][] => {
    const header = [
      // "Year",
      // "Tournament Name",
      "Seed 1",
      "Seed 2",
      "Seed 3",
      "Seed 4",
      "Seed 5",
      "Seed 6",
      "Seed 7",
      "Seed 8",
      "Seed 9",
      "Seed 10",
      "Seed 11",
      "Seed 12",
      "Seed 13",
      "Seed 14",
      "Seed 15",
      "Seed 16",
      // "Total",
      // "Total %",
      // "Entries",
    ];
    if (!data) return [];
    const rows = data.map((item) => [
      // item.year,
      // item.tournament_name,
      item.seed1,
      item.seed2,
      item.seed3,
      item.seed4,
      item.seed5,
      item.seed6,
      item.seed7,
      item.seed8,
      item.seed9,
      item.seed10,
      item.seed11,
      item.seed12,
      item.seed13,
      item.seed14,
      item.seed15,
      item.seed16,
      // item.total,
      // item.total_prcnt,
      // item.entries,
    ]);
    return [header, ...rows];
  };

  const convertedData = convertDataForGoogleChart(data);

  return (
    <Chart
      // Try different chart types by changing this property with one of: ColumnChart, LineChart, AreaChart, BarChart, BubbleChart, ComboChart,  PieChart, DonutChart, GeoChart, Histogram, Line, RadarChart, ScatterChart, SteppedAreaChart, Table
      // chartType={"SteppedAreaChart"}
      chartType={graphType}
      data={convertedData}
      options={{
        title: title,
        colors: [
          "#FF5733", // Rojo
          "#33FF57", // Verde
          "#3357FF", // Azul
          "#FF33A1", // Rosa
          "#FF8C33", // Naranja
          "#33FFF5", // Cian
          "#8C33FF", // Púrpura
          "#FF3333", // Rojo oscuro
          "#33FF8C", // Verde claro
          "#5733FF", // Azul oscuro
          "#FF5733", // Rojo claro
          "#33A1FF", // Azul claro
          "#FF33FF", // Magenta
          "#FF5733", // Rojo coral
          "#33FF33", // Verde lima
          "#FF33FF", // Fucsia
        ],
        is3D: true,
        vAxis: { title: "Times" },
        hAxis: { title: "Seed" },
        chartArea: { width: "60%" },
        // backgroundColor: "rgb(37, 150, 190)",
        // backgroundColor: "hsl(21, 93%, 18%)",
        // opacity: 0.5,
      }}
      legendToggle
    />
  );
}

export default TeamPerYearlogGraphic;
