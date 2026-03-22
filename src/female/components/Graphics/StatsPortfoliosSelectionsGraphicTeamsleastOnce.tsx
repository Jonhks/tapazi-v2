// @ts-nocheck
import { Chart, GoogleChartWrapperChartType } from "react-google-charts";

function StatsPortfoliosSelectionsGraphicTeamsleastOnce({
  graphType,
  data,
  title,
}: {
  graphType: GoogleChartWrapperChartType;
  data;
  title: string;
}) {
  const convertDataForGoogleChart = (data): (string | number)[][] => {
    const header = Array.from({ length: 16 }, (_, i) => `Seed ${i + 1}`);
    if (!data) return [];
    const rows = data.map((item) =>
      Array.from({ length: 16 }, (_, i) => item[`seed${i + 1}`]),
    );
    return [header, ...rows];
  };

  const convertedData = convertDataForGoogleChart(data);

  return (
    <Chart
      chartType={graphType}
      data={convertedData}
      width="100%"
      options={{
        title,
        colors: [
          "#e040fb", "#ce93d8", "#ab47bc", "#8e24aa",
          "#7b1fa2", "#6a1b9a", "#4a148c", "#df78ef",
          "#ea80fc", "#cc00ff", "#d500f9", "#aa00ff",
          "#c51162", "#f50057", "#ff4081", "#ff80ab",
        ],
        is3D: true,
        titleTextStyle: { color: "white", fontSize: 14 },
        legendTextStyle: { color: "white" },
        vAxis: {
          title: "Times",
          titleTextStyle: { color: "white" },
          textStyle: { color: "white" },
          gridlines: { color: "#333" },
        },
        hAxis: {
          title: "Seed",
          titleTextStyle: { color: "white" },
          textStyle: { color: "white" },
        },
        chartArea: { width: "60%" },
        backgroundColor: { fill: "#000000", opacity: 1 },
      }}
      legendToggle
    />
  );
}

export default StatsPortfoliosSelectionsGraphicTeamsleastOnce;
