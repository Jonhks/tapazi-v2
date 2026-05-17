// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { TeamsPerYearLog } from "@/types/index";
import { Chart, GoogleChartWrapperChartType } from "react-google-charts";

function TeamPerYearlogGraphic({
  graphType,
  teamsPerYearLog,
  setTeamsPerYearLogSelected,
}: {
  graphType: GoogleChartWrapperChartType;
  teamsPerYearLog: TeamsPerYearLog;
  setTeamsPerYearLogSelected: (value: nmber) => void;
}) {
  const convertData = (
    data: { year: number; tournament_id: number; teams: number }[],
  ): (string | number)[][] => {
    const header = [
      "Year",
      //  "Tournament ID",
      "Teams",
    ];
    if (!Array.isArray(data)) return [];
    const rows = data.map((item) => [
      item.year.toString(),
      // item.tournament_id,
      item.teams,
    ]);
    return [header, ...rows];
  };

  const convertedData = convertData(teamsPerYearLog);

  const handleChartReady = (chartWrapper: GoogleChartWrapper | null) => {
    const chart = chartWrapper.getChart();
    const dataTable = chartWrapper?.getDataTable();

    google.visualization.events.addListener(chart, "select", () => {
      const selectedItem = chart.getSelection()[0];
      if (selectedItem) {
        const value = dataTable.getValue(selectedItem.row, 0);
        setTeamsPerYearLogSelected(value);
      }
    });
  };

  return (
    <Chart
      // Try different chart types by changing this property with one of: ColumnChart, LineChart, AreaChart, BarChart, BubbleChart, ComboChart,  PieChart, DonutChart, GeoChart, Histogram, Line, RadarChart, ScatterChart, SteppedAreaChart, Table
      // chartType={"SteppedAreaChart"}
      chartType={graphType}
      data={convertedData}
      options={{
        title: "Teams Per Year Log",
        titleTextStyle: { color: "#ffffff" },
        colors: ["#238b94", "#b45705", "#fff"],
        is3D: true,
        height: 500,
        backgroundColor: "#24253e",
        vAxis: {
          title: "Tournament",
          titleTextStyle: { color: "#ffffff" },
          textStyle: { color: "#ffffff" },
        },
        hAxis: {
          title: "Year",
          titleTextStyle: { color: "#ffffff" },
          textStyle: { color: "#ffffff" },
        },
        legend: { textStyle: { color: "#ffffff" } },
        opacity: 0.5,
      }}
      chartEvents={[
        {
          eventName: "ready",
          callback: ({ chartWrapper }) => handleChartReady(chartWrapper),
        },
      ]}
      legendToggle
    />
  );
}

export default TeamPerYearlogGraphic;
