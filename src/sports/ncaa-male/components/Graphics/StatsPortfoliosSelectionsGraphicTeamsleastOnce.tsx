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
  const convertDataForGoogleChart = (data): (string | number)[][] => {
    if (!data) return [];
    const source = Array.isArray(data) ? data[0] : data;
    if (!source) return [];
    return [
      ["Seed", "Count"],
      ...Array.from({ length: 16 }, (_, i) => [
        `${i + 1}`,
        source[`seed${i + 1}`] ?? 0,
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
        title: title,
        colors: ["#05fa05"],
        titleTextStyle: { color: "white" },
        legend: { position: "none" },
        vAxis: {
          title: "Times",
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
        backgroundColor: { fill: "#0d0d0d", opacity: 0.9 },
      }}
    />
  );
}

export default TeamPerYearlogGraphic;
