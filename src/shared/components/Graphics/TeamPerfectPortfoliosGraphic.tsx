// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { TeamPerfectPortfolios } from "@/types/index";
import {
  Chart,
  GoogleChartWrapper,
  GoogleChartWrapperChartType,
} from "react-google-charts";

function TeamPerYearlogGraphic({
  graphType,
  teamsPerYearLog,
  SeteamPerfectPortfoliosSelected,
}: {
  graphType: GoogleChartWrapperChartType;
  teamsPerYearLog: TeamPerfectPortfolios[];
  SeteamPerfectPortfoliosSelected: (value: number) => void;
}) {
  const convertData = (
    data: {
      year: number;
      total_weight: number;
      total_points: number;
    }[]
  ): (string | number)[][] => {
    const header = ["Year", "Total Weight", "Total Points"];
    if (!data) return [];
    const rows = data.map((item) => [
      item.year.toString(),
      // item.tournament_name,
      item.total_weight,
      item.total_points,
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
        SeteamPerfectPortfoliosSelected(value);
      }
    });
  };

  return (
    <Chart
      chartType={graphType}
      data={convertedData}
      options={{
        title: "Historical Perfect Portfolios",
        colors: ["#238b94", "#b45705", "#fff"],
        is3D: true,
        vAxis: { title: "Tournament" },
        hAxis: { title: "Year" },
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
