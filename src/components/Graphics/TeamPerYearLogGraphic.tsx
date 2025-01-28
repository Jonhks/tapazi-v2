import { TeamsPerYearLog } from "@/types/index";
import { Chart, GoogleChartWrapperChartType } from "react-google-charts";

function TeamPerYearlogGraphic({
  graphType,
  teamsPerYearLog,
}: {
  graphType: GoogleChartWrapperChartType;
  teamsPerYearLog: TeamsPerYearLog;
}) {
  // chart.draw(data, {
  //   width: 400,
  //   height: 240,
  //   title: "Toppings I Like On My Pizza",
  //   colors: ["#e0440e", "#e6693e", "#ec8f6e", "#f3b49f", "#f6c7b6"],
  //   is3D: true,
  // });

  const convertData = (
    data: { year: number; tournament_id: number; teams: number }[]
  ): (string | number)[][] => {
    const header = ["Year", "Tournament ID", "Teams"];
    const rows = data.map((item) => [
      item.year.toString(),
      item.tournament_id,
      item.teams,
    ]);
    return [header, ...rows];
  };

  const convertedData = convertData(teamsPerYearLog);

  console.log(teamsPerYearLog);

  console.log(convertedData);

  return (
    <Chart
      // Try different chart types by changing this property with one of: ColumnChart, LineChart, AreaChart, BarChart, BubbleChart, ComboChart,  PieChart, DonutChart, GeoChart, Histogram, Line, RadarChart, ScatterChart, SteppedAreaChart, Table
      // chartType={"SteppedAreaChart"}
      chartType={graphType}
      data={convertedData}
      options={{
        title: "Average Weight by Age",
        colors: ["#238b94", "#b45705", "#fff"],
        is3D: true,
        vAxis: { title: "Tournament" },
        hAxis: { title: "Year" },
        // chartArea: { backgroundColor: "#000" },
        // backgroundColor: "rgb(37, 150, 190)",
        // backgroundColor: "hsl(21, 93%, 18%)",
        opacity: 0.5,
      }}
      legendToggle
    />
  );
}

export default TeamPerYearlogGraphic;
