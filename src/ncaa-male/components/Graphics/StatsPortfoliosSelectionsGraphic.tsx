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
  const convertDataForGoogleChart = (item): (string | number)[][] => {
    if (!item) return [];
    const source = Array.isArray(item) ? item[0] : item;
    if (!source) return [];
    return [
      ["Seed", "Percentage"],
      ...Array.from({ length: 16 }, (_, i) => [
        `Seed ${i + 1}`,
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
      options={{
        title: title,
        colors: [
          "#33FF57", // Verde
          "#FF5733", // Rojo
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
        titleTextStyle: { color: "white" },
        legendTextStyle: { color: "white" },
        vAxis: {
          title: "Percentage",
          titleTextStyle: { color: "white" },
          textStyle: { color: "white" },
        },
        hAxis: {
          title: "Seed",
          titleTextStyle: { color: "white" },
          textStyle: { color: "white" },
        },
        chartArea: { width: "60%" },
        backgroundColor: { fill: "#0d0d0d", opacity: 0.9 },
      }}
      legendToggle
    />
  );
}

export default TeamPerYearlogGraphic;
