import { TeamsPerYearLog } from "@/types/index";
import { Chart, GoogleChartWrapperChartType } from "react-google-charts";

function TeamPerYearlogGraphic({
  graphType,
  teamsPerYearLog,
}: {
  graphType: GoogleChartWrapperChartType;
  teamsPerYearLog: TeamsPerYearLog;
}) {
  const convertData = (
    data: { year: number; tournament_id: number; teams: number }[]
  ): (string | number)[][] => {
    const header = [
      "Year",
      //  "Tournament ID",
      "Teams",
    ];
    if (!data) return [];
    const rows = data.map((item) => [
      item.year.toString(),
      // item.tournament_id,
      item.teams,
    ]);
    return [header, ...rows];
  };

  const convertedData = convertData(teamsPerYearLog);

  return (
    <Chart
      // Try different chart types by changing this property with one of: ColumnChart, LineChart, AreaChart, BarChart, BubbleChart, ComboChart,  PieChart, DonutChart, GeoChart, Histogram, Line, RadarChart, ScatterChart, SteppedAreaChart, Table
      // chartType={"SteppedAreaChart"}
      chartType={graphType}
      data={convertedData}
      options={{
        title: "Teams Per Year Log",
        colors: ["#238b94", "#b45705", "#fff"],
        is3D: true,
        vAxis: { title: "Tournament" },
        hAxis: { title: "Year" },
        // chartArea: { width: "85%", height: "0%" },
        // backgroundColor: "rgb(37, 150, 190)",
        // backgroundColor: "hsl(21, 93%, 18%)",
        opacity: 0.5,
      }}
      legendToggle
    />
  );
}

export default TeamPerYearlogGraphic;
