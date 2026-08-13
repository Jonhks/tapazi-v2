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
  const convertDataForGoogleChart = (
    data: {
      seed1: number;
      seed2: number;
      seed3: number;
      seed4: number;
      seed5: number;
      seed6: number;
      seed7: number;
      seed8: number;
      seed9: number;
      seed10: number;
      seed11: number;
      seed12: number;
      seed13: number;
      seed14: number;
      seed15: number;
      seed16: number;
      prcnt_seed1: number;
      prcnt_seed2: number;
      prcnt_seed3: number;
      prcnt_seed4: number;
      prcnt_seed5: number;
      prcnt_seed6: number;
      prcnt_seed7: number;
      prcnt_seed8: number;
      prcnt_seed9: number;
      prcnt_seed10: number;
      prcnt_seed11: number;
      prcnt_seed12: number;
      prcnt_seed13: number;
      prcnt_seed14: number;
      prcnt_seed15: number;
      prcnt_seed16: number;
    }[]
  ): (string | number)[][] => {
    const header = [
      "Seed 1",
      "Seed 2",
      "Seed 3",
      "Seed 4",
      "Seed 5",
      "Seed 6",
      "Seed 7",
      "Seed 8",
      "Seed 9",
      "Seed 10",
      "Seed 11",
      "Seed 12",
      "Seed 13",
      "Seed 14",
      "Seed 15",
      "Seed 16",
    ];
    if (!data) return [];
    const rows = data.map((item) => [
      item.prcnt_seed1,
      item.prcnt_seed2,
      item.prcnt_seed3,
      item.prcnt_seed4,
      item.prcnt_seed5,
      item.prcnt_seed6,
      item.prcnt_seed7,
      item.prcnt_seed8,
      item.prcnt_seed9,
      item.prcnt_seed10,
      item.prcnt_seed11,
      item.prcnt_seed12,
      item.prcnt_seed13,
      item.prcnt_seed14,
      item.prcnt_seed15,
      item.prcnt_seed16,
    ]);
    return [header, ...rows];
  };

  const convertedData = convertDataForGoogleChart(data);

  return (
    <Chart
      chartType={graphType}
      data={convertedData}
      options={{
        title: title,
        colors: [
          "#FF5733",
          "#33FF57",
          "#3357FF",
          "#FF33A1",
          "#FF8C33",
          "#33FFF5",
          "#8C33FF",
          "#FF3333",
          "#33FF8C",
          "#5733FF",
          "#FF5733",
          "#33A1FF",
          "#FF33FF",
          "#FF5733",
          "#33FF33",
          "#FF33FF",
        ],
        is3D: true,
        vAxis: { title: "Percent" },
        hAxis: { title: "Seed" },
        chartArea: { width: "60%" },
      }}
      legendToggle
    />
  );
}

export default TeamPerYearlogGraphic;
