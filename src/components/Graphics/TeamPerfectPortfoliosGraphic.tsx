import { TeamPerfectPortfolios } from "@/types/index";
import { Chart, GoogleChartWrapperChartType } from "react-google-charts";

function TeamPerYearlogGraphic({
  graphType,
  teamsPerYearLog,
}: {
  graphType: GoogleChartWrapperChartType;
  teamsPerYearLog: TeamPerfectPortfolios[];
}) {
  const convertData = (
    data: {
      year: number;
      // tournament_name: string;
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
      legendToggle
    />
  );
}

export default TeamPerYearlogGraphic;
