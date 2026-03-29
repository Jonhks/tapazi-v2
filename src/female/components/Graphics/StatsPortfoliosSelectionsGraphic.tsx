// @ts-nocheck
import { Chart, GoogleChartWrapperChartType } from "react-google-charts";

function StatsPortfoliosSelectionsGraphic({
  graphType,
  data,
  title,
}: {
  graphType: GoogleChartWrapperChartType;
  data;
  title: string;
}) {
  const convertDataForGoogleChart = (item): (string | number)[][] => {
    if (!item) return [];
    const source = Array.isArray(item) ? item[0] : item;
    if (!source) return [];
    return [
      ["Seed", "Percentage"],
      ...Array.from({ length: 16 }, (_, i) => [
        `${i + 1}`,
        parseFloat(source[`prnct_teams_seed${i + 1}`]) ?? 0,
      ]),
    ];
  };

  const convertedData = convertDataForGoogleChart(data);

  return (
    <Chart
      chartType={graphType}
      data={convertedData}
      width="100%"
      height="300px"
      options={{
        title,
        colors: ["#e040fb"],
        titleTextStyle: { color: "white", fontSize: 14 },
        legend: { position: "none" },
        vAxis: {
          title: "Percentage",
          titleTextStyle: { color: "white" },
          textStyle: { color: "white" },
          gridlines: { color: "#333" },
        },
        hAxis: {
          title: "Seed",
          titleTextStyle: { color: "white" },
          textStyle: { color: "white", fontSize: 11 },
          slantedText: false,
        },
        chartArea: { width: "80%", height: "70%" },
        backgroundColor: { fill: "#000000", opacity: 1 },
      }}
    />
  );
}

export default StatsPortfoliosSelectionsGraphic;
