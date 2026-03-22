// @ts-nocheck
import { Chart, GoogleChartWrapperChartType } from "react-google-charts";

function StatsPortfoliosSelectionsGraphicPercentLeast({
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
        `Seed ${i + 1}`,
        parseFloat(source[`prnct_seed${i + 1}`]) ?? 0,
      ]),
    ];
  };

  const convertedData = convertDataForGoogleChart(data);

  return (
    <Chart
      chartType={graphType}
      data={convertedData}
      width="100%"
      options={{
        title,
        colors: ["#e040fb"],
        is3D: true,
        titleTextStyle: { color: "white", fontSize: 14 },
        legendTextStyle: { color: "white" },
        vAxis: {
          title: "Percent",
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

export default StatsPortfoliosSelectionsGraphicPercentLeast;
